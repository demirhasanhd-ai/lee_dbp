import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, realpathSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { backup, DatabaseSync } from "node:sqlite";
import { parseArgs } from "node:util";
import { pathToFileURL } from "node:url";

const manifestUrl = new URL("./data/draft-resource-obs-cleanup-2026-11-18.json", import.meta.url);
const identityFields = ["academic_year", "department", "program_name", "level", "code", "name"];
const resourceKeys = { detailFields: "resources", fields: "Ders Kaynakları" };
const digest = (text) => createHash("sha256").update(text).digest("hex");
const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);

export function loadDraftResourceCleanupManifest() {
  return JSON.parse(readFileSync(manifestUrl, "utf8"));
}

export function planDraftResourceCleanup(rows, manifest = loadDraftResourceCleanupManifest()) {
  const byId = new Map(rows.map((row) => [row.id, row]));
  const changes = [];
  const skipped = [];
  for (const target of manifest.targets) {
    const row = byId.get(target.id);
    const skip = (reason) => skipped.push({ id: target.id, code: target.code, department: target.department, reason });
    if (!row) { skip("missing"); continue; }
    if (identityFields.some((field) => row[field] !== target[field])) { skip("identity-changed"); continue; }
    if (row.status !== "Taslak") { skip("course-not-draft"); continue; }
    let stored;
    try { stored = JSON.parse(row.package_json); }
    catch { skip("invalid-package"); continue; }
    if (!isObject(stored)) { skip("invalid-package"); continue; }
    const versioned = stored.publicationModel === "published-draft-v1" || "published" in stored || "draft" in stored;
    if (versioned !== (target.revision === "draft")) { skip("revision-changed"); continue; }
    // A top-level Taslak value can coexist with an approval-pending draft.
    if (versioned && stored.draft?.status !== "Taslak") { skip("package-not-draft"); continue; }
    const coursePackage = versioned ? stored.draft?.package : stored;
    if (!isObject(coursePackage)) { skip("invalid-package"); continue; }
    const containers = target.resourceContainers;
    if (containers.every((container) => coursePackage[container]?.[resourceKeys[container]] === manifest.replacement)) {
      skip("already-updated"); continue;
    }
    // Any intervening package edit, including a newly added book, vetoes the update.
    if (row.updated_at !== target.updated_at || digest(row.package_json) !== target.packageSha256) {
      skip("record-changed"); continue;
    }
    const sourceText = manifest.sourceTexts[target.sourceTextIndex];
    if (!sourceText || !/\bOBS\b/iu.test(sourceText) || containers.some((container) =>
      !Object.hasOwn(resourceKeys, container) || coursePackage[container]?.[resourceKeys[container]] !== sourceText
    )) { skip("resources-changed"); continue; }
    for (const container of containers) coursePackage[container][resourceKeys[container]] = manifest.replacement;
    changes.push({
      id: row.id, code: row.code, name: row.name, department: row.department, level: row.level,
      revision: target.revision, beforeResources: sourceText, afterResources: manifest.replacement,
      beforePackageJson: row.package_json, afterPackageJson: JSON.stringify(stored),
    });
  }
  return { operation: manifest.operation, changes, skipped };
}

export function applyDraftResourceCleanup(db, manifest = loadDraftResourceCleanupManifest(), { beforeCommit = () => {} } = {}) {
  db.exec("BEGIN IMMEDIATE");
  try {
    const plan = planDraftResourceCleanup(db.prepare("SELECT * FROM courses").all(), manifest);
    const update = db.prepare("UPDATE courses SET package_json = ? WHERE id = ? AND status = 'Taslak' AND package_json = ?");
    for (const change of plan.changes) {
      const result = update.run(change.afterPackageJson, change.id, change.beforePackageJson);
      if (result.changes !== 1) throw new Error(`Ders güncellenemedi: ${change.id} / ${change.code}`);
    }
    if (plan.changes.length) {
      db.prepare("INSERT INTO audit_logs(action, actor, payload_json, created_at) VALUES (?, ?, ?, ?)").run(
        "course.package.migrate", "system",
        JSON.stringify({ operation: manifest.operation, sourceBackup: manifest.sourceBackup, changed: plan.changes.length,
          skipped: plan.skipped.length, courseIds: plan.changes.map((change) => change.id) }),
        new Date().toISOString(),
      );
    }
    // Persist the original packages before committing; failure rolls back every write.
    beforeCommit(plan);
    db.exec("COMMIT");
    return plan;
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

function summary(plan, mode) {
  const byDepartment = {};
  const skipReasons = {};
  for (const change of plan.changes) byDepartment[change.department] = (byDepartment[change.department] || 0) + 1;
  for (const skip of plan.skipped) skipReasons[skip.reason] = (skipReasons[skip.reason] || 0) + 1;
  return { operation: plan.operation, mode, changed: mode === "apply" ? plan.changes.length : 0,
    eligible: plan.changes.length, skipped: plan.skipped.length, skipReasons, byDepartment };
}

async function main() {
  const { values } = parseArgs({ options: {
    db: { type: "string" }, "from-backup": { type: "string" }, apply: { type: "boolean", default: false },
    "report-dir": { type: "string" }, help: { type: "boolean", default: false },
  } });
  if (values.help) {
    console.log("Önizleme: node lib/draftResourceObsCleanup.mjs --db /app/data/dbp.sqlite\n" +
      "Uygulama: node lib/draftResourceObsCleanup.mjs --db /app/data/dbp.sqlite --apply\n" +
      "Yedek inceleme: node lib/draftResourceObsCleanup.mjs --from-backup <yedek.json>\n" +
      "--apply öncesi SQLite yedeği ve geri dönüş raporu, varsayılan olarak veritabanının backups klasörüne yazılır.");
    return;
  }
  if (Boolean(values.db) === Boolean(values["from-backup"])) throw new Error("Yalnız --db veya --from-backup belirtin.");
  if (values.apply && !values.db) throw new Error("--apply yalnız --db ile kullanılabilir; JSON yedekleri değiştirilmez.");
  const manifest = loadDraftResourceCleanupManifest();
  if (values["from-backup"]) {
    const bytes = readFileSync(values["from-backup"]);
    if (digest(bytes) !== manifest.sourceBackupSha256) throw new Error("Yedek SHA-256 değeri incelenen dosyayla eşleşmiyor.");
    const payload = JSON.parse(bytes.toString("utf8").replace(/^\uFEFF/u, ""));
    console.log(JSON.stringify(summary(planDraftResourceCleanup(payload.tables.courses, manifest), "preview"), null, 2));
    return;
  }
  if (!existsSync(values.db) || !statSync(values.db).isFile()) throw new Error("Mevcut bir SQLite veritabanı yolu belirtin.");
  const dbFile = realpathSync(values.db);
  const db = new DatabaseSync(dbFile, { readOnly: !values.apply });
  try {
    db.exec("PRAGMA busy_timeout = 5000");
    const preview = planDraftResourceCleanup(db.prepare("SELECT * FROM courses").all(), manifest);
    if (!values.apply || !preview.changes.length) {
      console.log(JSON.stringify(summary(preview, values.apply ? "apply" : "preview"), null, 2));
      return;
    }
    const reportDir = path.resolve(values["report-dir"] || path.join(path.dirname(dbFile), "backups"));
    mkdirSync(reportDir, { recursive: true });
    const stamp = new Date().toISOString().replace(/[:.]/gu, "-");
    const stem = `${manifest.operation}-${stamp}`;
    const backupFile = path.join(reportDir, `${stem}.sqlite`);
    const reportFile = path.join(reportDir, `${stem}.json`);
    if (existsSync(backupFile) || existsSync(reportFile)) throw new Error("Yedek/rapor dosyası zaten mevcut.");
    await backup(db, backupFile);
    const plan = applyDraftResourceCleanup(db, manifest, { beforeCommit: (prepared) => {
      writeFileSync(reportFile, JSON.stringify({ ...summary(prepared, "preview"), status: "prepared",
        database: dbFile, backupFile, preparedAt: new Date().toISOString(),
        changes: prepared.changes, skippedRecords: prepared.skipped }, null, 2) + "\n", { encoding: "utf8", flag: "wx", mode: 0o600 });
    } });
    let reportWarning;
    try {
      const report = JSON.parse(readFileSync(reportFile, "utf8"));
      writeFileSync(reportFile, JSON.stringify({ ...report, ...summary(plan, "apply"), status: "committed",
        committedAt: new Date().toISOString() }, null, 2) + "\n", "utf8");
    } catch {
      reportWarning = "İşlem tamamlandı; raporun son durum bilgisi yazılamadı. Özgün kayıtlar prepared raporunda saklıdır.";
    }
    console.log(JSON.stringify({ ...summary(plan, "apply"), backupFile, reportFile, reportWarning }, null, 2));
  } finally { db.close(); }
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  main().catch((error) => { console.error(error.message); process.exitCode = 1; });
}

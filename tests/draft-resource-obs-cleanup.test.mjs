import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { applyDraftResourceCleanup, loadDraftResourceCleanupManifest, planDraftResourceCleanup } from "../lib/draftResourceObsCleanup.mjs";

const reviewed = loadDraftResourceCleanupManifest();
const placeholder = reviewed.sourceTexts[0];
const replacement = reviewed.replacement;
const entry = fileURLToPath(new URL("../lib/draftResourceObsCleanup.mjs", import.meta.url));
const hash = (text) => createHash("sha256").update(text).digest("hex");

function row(id = 1, stored = { detailFields: { resources: placeholder, content: "Öğretim elemanının içeriği" } }) {
  return { id, academic_year: "2026-2027", department: "Makine Mühendisliği ABD", program_name: "Makine Mühendisliği",
    level: "Doktora", code: `MMB${900 + id}`, name: `Ders ${id}`, status: "Taslak", updated_at: "2026-11-18T14:00:00Z",
    package_json: JSON.stringify(stored) };
}

function manifestFor(rows) {
  return { ...reviewed, targets: rows.map((course) => {
    const stored = JSON.parse(course.package_json);
    const versioned = "draft" in stored || "published" in stored;
    const pkg = versioned ? stored.draft.package : stored;
    return { ...course, revision: versioned ? "draft" : "legacy", packageSha256: hash(course.package_json), sourceTextIndex: 0,
      resourceContainers: ["detailFields", "fields"].filter((container) => pkg[container]) };
  }) };
}

function database(file = ":memory:") {
  const db = new DatabaseSync(file);
  db.exec(`CREATE TABLE courses (id INTEGER PRIMARY KEY, academic_year TEXT, department TEXT, program_name TEXT,
    level TEXT, code TEXT, name TEXT, status TEXT, updated_at TEXT, package_json TEXT);
    CREATE TABLE audit_logs (id INTEGER PRIMARY KEY, action TEXT, actor TEXT, payload_json TEXT, created_at TEXT);
    CREATE TABLE workflow_requests (target TEXT, status TEXT);
    INSERT INTO workflow_requests VALUES ('unchanged', 'Komisyon Onayı Bekliyor');`);
  return db;
}

function insert(db, course) {
  const keys = Object.keys(course);
  db.prepare(`INSERT INTO courses (${keys.join(", ")}) VALUES (${keys.map(() => "?").join(", ")})`).run(...Object.values(course));
}

test("reviewed manifest fixes 647 identities and 17 OBS templates", () => {
  assert.equal(reviewed.targets.length, 647);
  assert.equal(new Set(reviewed.targets.map((target) => target.id)).size, 647);
  assert.equal(reviewed.sourceTexts.length, 17);
  assert.equal(reviewed.exportedAt, "2026-11-18T14:30:35.527Z");
  for (const target of reviewed.targets) {
    assert.match(reviewed.sourceTexts[target.sourceTextIndex], /\bOBS\b/iu);
    assert.match(target.packageSha256, /^[a-f0-9]{64}$/u);
    assert.ok(["draft", "legacy"].includes(target.revision));
    assert.ok(target.resourceContainers.length);
  }
  assert.ok(!reviewed.targets.some((target) => [438, 662, 3239, 3248, 3249, 3245, 2525].includes(target.id)),
    "known pending approvals and published Harita/Biyoloji courses are outside the allowlist");
});

test("plan changes only listed draft resources and preserves real references and published package", () => {
  const published = { fields: { "Ders Kaynakları": "Onaylı kaynakça" }, detailFields: { resources: placeholder }, savedAt: "approved" };
  const envelope = { publicationModel: "published-draft-v1", published: { package: published, approvedAt: "before", approvedBy: "Başkan" },
    draft: { status: "Taslak", updatedAt: "draft-time", package: {
      detailFields: { resources: placeholder, content: "Derse özel içerik" }, fields: { "Ders Kaynakları": placeholder, "Dersin Adı": "Ders" },
      weeklyTopics: { 1: "Korunacak konu" }, savedAt: "teacher-time" } } };
  const legacy = row(1);
  const versioned = row(2, envelope);
  const bibliography = row(3, { detailFields: { resources: "Öztürk, M. Orhan. Ruh Sağlığı ve Bozuklukları. 2016." } });
  const unknown = row(4);
  const rows = [legacy, versioned, bibliography, unknown];
  const before = structuredClone(rows);
  const plan = planDraftResourceCleanup(rows, manifestFor([legacy, versioned]));
  assert.deepEqual(plan.changes.map((change) => change.id), [1, 2]);
  assert.deepEqual(rows, before, "planning must be read-only");
  const edited = JSON.parse(plan.changes[1].afterPackageJson);
  const expected = structuredClone(envelope);
  expected.draft.package.detailFields.resources = replacement;
  expected.draft.package.fields["Ders Kaynakları"] = replacement;
  assert.deepEqual(edited, expected);
  assert.deepEqual(edited.published, envelope.published);
});

test("both status gates and exact package, timestamp and identity guards exclude changed records", () => {
  const originals = Array.from({ length: 11 }, (_, index) => row(index + 1));
  const fixture = manifestFor(originals);
  const current = structuredClone(originals);
  for (const [index, status] of ["Yayımlandı", "Komisyon Onayı Bekliyor", "ABD Son Onayı Bekliyor", "Düzeltme İstendi", "İncelemede"].entries()) {
    current[index].status = status;
  }
  current[5].package_json = JSON.stringify({ detailFields: { resources: placeholder + " Karasar, Bilimsel Araştırma Yöntemi." } });
  current[6].updated_at = "later";
  current[7].department = "Başka ABD";
  current[8].package_json = "invalid-json";
  current[9].package_json = JSON.stringify({ publicationModel: "published-draft-v1", draft: { status: "Taslak", package: {} } });
  const plan = planDraftResourceCleanup(current, fixture);
  assert.deepEqual(plan.changes.map((change) => change.id), [11]);
  assert.equal(plan.skipped.length, 10);
  for (const status of ["Komisyon Onayı Bekliyor", "ABD Son Onayı Bekliyor", "Düzeltme İstendi", "İncelemede", undefined]) {
    const course = row(20, { draft: { status, package: { detailFields: { resources: placeholder } } } });
    const result = planDraftResourceCleanup([course], manifestFor([course]));
    assert.equal(result.changes.length, 0);
    assert.equal(result.skipped[0].reason, "package-not-draft");
  }
});

test("apply preserves every non-resource column, logs once, and reruns without writes", () => {
  const db = database();
  try {
    const course = row();
    insert(db, course);
    const fixture = manifestFor([course]);
    const workflowBefore = db.prepare("SELECT * FROM workflow_requests").all();
    let journal;
    const applied = applyDraftResourceCleanup(db, fixture, { beforeCommit: (plan) => { journal = structuredClone(plan); } });
    assert.equal(applied.changes.length, 1);
    assert.equal(journal.changes[0].beforePackageJson, course.package_json);
    assert.deepEqual({ ...db.prepare("SELECT * FROM courses").get() }, { ...course, package_json: applied.changes[0].afterPackageJson });
    assert.deepEqual(db.prepare("SELECT * FROM workflow_requests").all(), workflowBefore);
    assert.equal(db.prepare("SELECT count(*) AS n FROM audit_logs").get().n, 1);
    const repeated = applyDraftResourceCleanup(db, fixture);
    assert.equal(repeated.changes.length, 0);
    assert.equal(repeated.skipped[0].reason, "already-updated");
    assert.equal(db.prepare("SELECT count(*) AS n FROM audit_logs").get().n, 1);
  } finally { db.close(); }
});

test("journal failure rolls back all course changes and audit records", () => {
  const db = database();
  try {
    const rows = [row(1), row(2)];
    for (const course of rows) insert(db, course);
    const before = db.prepare("SELECT * FROM courses ORDER BY id").all();
    assert.throws(() => applyDraftResourceCleanup(db, manifestFor(rows), { beforeCommit: () => { throw new Error("disk full"); } }), /disk full/u);
    assert.deepEqual(db.prepare("SELECT * FROM courses ORDER BY id").all(), before);
    assert.equal(db.prepare("SELECT count(*) AS n FROM audit_logs").get().n, 0);
  } finally { db.close(); }
});

test("CLI preview is read-only and rejects missing databases and JSON apply", () => {
  const dir = mkdtempSync(path.join(tmpdir(), "dbp-obs-cleanup-"));
  try {
    const target = reviewed.targets[0];
    // Use the real manifest identity with a mismatched package to prove the CLI cannot update arbitrary content.
    const file = path.join(dir, "fixture.sqlite");
    const db = database(file);
    insert(db, { ...row(target.id), ...Object.fromEntries(["academic_year", "department", "program_name", "level", "code", "name", "updated_at"].map((key) => [key, target[key]])) });
    db.close();
    const before = hash(readFileSync(file));
    const result = spawnSync(process.execPath, [entry, "--db", file], { encoding: "utf8" });
    assert.equal(result.status, 0, result.stderr);
    assert.equal(JSON.parse(result.stdout).eligible, 0);
    assert.equal(hash(readFileSync(file)), before);
    assert.deepEqual(readdirSync(dir), ["fixture.sqlite"]);
    const noCreate = spawnSync(process.execPath, [entry, "--db", path.join(dir, "missing.sqlite"), "--apply"], { encoding: "utf8" });
    assert.notEqual(noCreate.status, 0);
    assert.deepEqual(readdirSync(dir), ["fixture.sqlite"]);
    const jsonApply = spawnSync(process.execPath, [entry, "--from-backup", "missing.json", "--apply"], { encoding: "utf8" });
    assert.notEqual(jsonApply.status, 0);
    assert.match(jsonApply.stderr, /JSON yedekleri değiştirilmez/u);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

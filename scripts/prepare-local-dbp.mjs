import { existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { inspectProjectModules, printModuleProblems } from "./check-project-modules.mjs";

function runNpm(args, { rootDir, capture = false }) {
  const windows = process.platform === "win32";
  return spawnSync(windows ? (process.env.ComSpec || "cmd.exe") : "npm",
    windows ? ["/d", "/s", "/c", `npm.cmd ${args.join(" ")}`] : args, {
      cwd: rootDir, windowsHide: true, encoding: "utf8", maxBuffer: 32 * 1024 * 1024,
      stdio: capture ? "pipe" : "inherit",
    });
}

function dependencyProblems(result) {
  if (result.error) throw result.error;
  let tree;
  try { tree = JSON.parse(result.stdout || ""); }
  catch { throw new Error(`npm bağımlılık kontrolü tamamlanamadı: ${result.stderr || result.stdout || result.status}`); }
  if (tree.error && !Array.isArray(tree.problems)) throw new Error(tree.error.summary || "npm bağımlılık kontrolü başarısız.");
  const problems = (tree.problems || []).filter((problem) => !problem.startsWith("extraneous:"));
  if (result.status !== 0 && !tree.problems?.length) throw new Error(result.stderr || "npm bağımlılık kontrolü başarısız.");
  return problems;
}

function lockNeedsInstall(rootDir) {
  const lock = path.join(rootDir, "package-lock.json");
  if (!existsSync(lock)) return false;
  const expected = JSON.parse(readFileSync(lock, "utf8")).packages || {};
  let installed;
  try { installed = JSON.parse(readFileSync(path.join(rootDir, "node_modules", ".package-lock.json"), "utf8")).packages || {}; }
  catch { return true; }
  return Object.entries(expected).some(([name, item]) => name && !item.link && (
    installed[name] ? item.version !== installed[name].version : !item.optional && !item.peer
  ));
}

function installCommand(rootDir, manifest) {
  const lock = path.join(rootDir, "package-lock.json");
  if (!existsSync(lock)) return "install";
  const locked = JSON.parse(readFileSync(lock, "utf8")).packages?.[""];
  const entries = (value) => JSON.stringify(Object.entries(value || {}).sort(([a], [b]) => a.localeCompare(b)));
  return locked && ["dependencies", "devDependencies", "optionalDependencies"]
    .every((key) => entries(manifest[key]) === entries(locked[key])) ? "ci" : "install";
}

export function prepareLocalDbp({
  rootDir, checkOnly = false, npm = runNpm, inspect = inspectProjectModules,
  log = console.log, error = console.error, nodeVersion = process.versions.node,
} = {}) {
  if (Number(nodeVersion.split(".")[0]) < 24) {
    error(`[HATA] Node.js 24 veya üzeri gerekiyor. Yüklü sürüm: ${nodeVersion}`);
    return 1;
  }
  let modules = inspect(rootDir, { local: true });
  if (modules.missingFiles.length) {
    printModuleProblems({ ...modules, missingPackages: [] }, error);
    return 1;
  }
  const manifest = JSON.parse(readFileSync(path.join(rootDir, "package.json"), "utf8"));
  const declared = { ...manifest.dependencies, ...manifest.devDependencies };
  const undeclared = modules.missingPackages.filter(({ specifier }) => {
    const name = specifier.startsWith("@") ? specifier.split("/").slice(0, 2).join("/") : specifier.split("/")[0];
    return !Object.hasOwn(declared, name);
  });
  if (undeclared.length) {
    printModuleProblems({ missingFiles: [], missingPackages: undeclared }, error);
    error("Bu paketlerin sürümü önce package.json içinde tanımlanmalıdır; otomatik sürüm seçilmedi.");
    return 1;
  }
  const lockChanged = lockNeedsInstall(rootDir);
  log("[dbp] Yerel paketler ve proje modülleri kontrol ediliyor...");
  const listArgs = ["ls", "--all", "--include=dev", "--json"];
  const problems = dependencyProblems(npm(listArgs, { rootDir, capture: true }));
  const needsInstall = lockChanged || modules.missingPackages.length > 0 || problems.length > 0;
  if (needsInstall) {
    for (const problem of problems) log(`[dbp] ${problem}`);
    if (checkOnly) {
      error("[dbp] Bağımlılık kurulumu gerekiyor; salt kontrol modunda kurulum yapılmadı.");
      return 2;
    }
    log("[dbp] Eksik veya uyumsuz paketler kuruluyor/güncelleniyor...");
    const installed = npm([installCommand(rootDir, manifest), "--include=dev", "--no-audit", "--no-fund"], { rootDir });
    if (installed.error || installed.status !== 0) {
      error(`[HATA] Paket kurulumu başarısız: ${installed.error?.message || installed.status}`);
      return 1;
    }
    const remaining = dependencyProblems(npm(listArgs, { rootDir, capture: true }));
    if (remaining.length) {
      for (const problem of remaining) error(`[HATA] ${problem}`);
      return 1;
    }
    modules = inspect(rootDir, { local: true });
  }
  if (modules.missingFiles.length || modules.missingPackages.length) {
    printModuleProblems(modules, error);
    return 1;
  }
  log("[dbp] Bağımlılıklar hazır.");
  return 0;
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  try {
    process.exitCode = prepareLocalDbp({
      rootDir: fileURLToPath(new URL("../", import.meta.url)), checkOnly: process.argv.includes("--check-only"),
    });
  } catch (error) {
    console.error(`[HATA] Başlangıç kontrolü başarısız: ${error.message}`);
    process.exitCode = 1;
  }
}

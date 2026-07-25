import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const localVolumeDir = process.env.DBP_LOCAL_VOLUME_DIR || path.join(rootDir, "local-volume");
const localDataDir = path.join(localVolumeDir, "data");
const localBackupDir = path.join(localDataDir, "backups");

process.env.HOST ??= "127.0.0.1";
process.env.PORT ??= "8081";
process.env.NODE_ENV ??= "production";
process.env.DBP_DATA_DIR ??= localDataDir;
process.env.DBP_SQLITE_PATH ??= path.join(localDataDir, "dbp.sqlite");
process.env.DBP_BACKUP_DIR ??= localBackupDir;
process.env.DBP_SEED_FILE ??= path.join(rootDir, "local-preview", "program-data-local.js");

mkdirSync(process.env.DBP_BACKUP_DIR, { recursive: true });

if (process.env.DBP_SKIP_LOCAL_BUILD !== "1") {
  const buildCommand = process.platform === "win32" ? "cmd.exe" : "npm";
  const buildArgs =
    process.platform === "win32"
      ? ["/d", "/s", "/c", "npm.cmd run build"]
      : ["run", "build"];
  const build = spawnSync(buildCommand, buildArgs, {
    cwd: rootDir,
    stdio: "inherit",
  });
  if (build.error) {
    console.error(`[dbp] Build baslatilamadi: ${build.error.message}`);
    process.exit(1);
  }
  if (build.status !== 0) {
    process.exit(build.status || 1);
  }
}

console.log(`[dbp] Local volume: ${localVolumeDir}`);
console.log(`[dbp] Local SQLite: ${process.env.DBP_SQLITE_PATH}`);

await import(pathToFileURL(path.join(rootDir, "server.mjs")).href);

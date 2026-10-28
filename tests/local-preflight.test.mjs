import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { inspectProjectModules } from "../scripts/check-project-modules.mjs";
import { prepareLocalDbp } from "../scripts/prepare-local-dbp.mjs";

function fixture(t) {
  const rootDir = mkdtempSync(path.join(tmpdir(), "dbp-preflight-"));
  t.after(() => {
    assert.equal(path.dirname(path.resolve(rootDir)), path.resolve(tmpdir()));
    assert.ok(path.basename(rootDir).startsWith("dbp-preflight-"));
    rmSync(rootDir, { recursive: true, force: true });
  });
  const write = (name, content) => {
    const target = path.join(rootDir, name);
    mkdirSync(path.dirname(target), { recursive: true });
    writeFileSync(target, content);
  };
  write("package.json", JSON.stringify({ type: "module", dependencies: { "fixture-package": "1.0.0" } }));
  return { rootDir, write };
}

const healthy = { files: [], missingFiles: [], missingPackages: [] };
const listed = (problems = []) => ({ status: problems.length ? 1 : 0, stdout: JSON.stringify({ problems }) });

test("module checks follow new nested sources and report missing source files without executing code", (t) => {
  const { rootDir, write } = fixture(t);
  write("server.mjs", 'import "./lib/new-feature.mjs";\nthrow new Error("must not execute");\naudit("database.import", "test");\nconst sql = "SELECT name FROM users";');
  write("lib/new-feature.mjs", 'export { value } from "./nested/value.mjs";');
  write("lib/nested/value.mjs", 'export const value = 1;');
  assert.equal(inspectProjectModules(rootDir).missingFiles.length, 0);
  assert.equal(inspectProjectModules(rootDir).missingPackages.length, 0);
  write("lib/new-feature.mjs", 'import "./missing.mjs";');
  const result = inspectProjectModules(rootDir);
  assert.equal(result.missingFiles.length, 1);
  assert.equal(result.missingFiles[0].file, path.join("lib", "missing.mjs"));
});

test("local checks include the literal dynamic development renderer while runtime checks skip it", (t) => {
  const { rootDir, write } = fixture(t);
  write("server.mjs", 'if (localDev) await import("./scripts/local-dev-renderer.mjs");');
  assert.equal(inspectProjectModules(rootDir).missingFiles.length, 0);
  assert.ok(inspectProjectModules(rootDir, { local: true }).missingFiles.some((item) => item.file.endsWith("local-dev-renderer.mjs")));
});

test("healthy import-only packages are not reported as missing", (t) => {
  const { rootDir, write } = fixture(t);
  write("server.mjs", 'import fixture from "fixture-package";');
  write("node_modules/fixture-package/package.json", JSON.stringify({ name: "fixture-package", type: "module", exports: { import: "./index.mjs" } }));
  write("node_modules/fixture-package/index.mjs", 'export default 1;');
  assert.deepEqual(inspectProjectModules(rootDir).missingPackages, []);
});

test("local preparation repairs missing packages once and verifies the repaired tree", (t) => {
  const { rootDir } = fixture(t);
  const calls = []; let repaired = false;
  const result = prepareLocalDbp({ rootDir, log() {}, error: assert.fail,
    inspect: () => repaired ? healthy : { ...healthy, missingPackages: [{ specifier: "fixture-package", importer: "server.mjs" }] },
    npm: (args) => {
      calls.push(args);
      if (args[0] === "install") { repaired = true; return { status: 0 }; }
      return listed(repaired ? [] : ["missing: fixture-package@1.0.0"]);
    },
  });
  assert.equal(result, 0);
  assert.deepEqual(calls.map((args) => args[0]), ["ls", "install", "ls"]);
  assert.ok(calls[1].includes("--include=dev"));
});

test("missing source files and unlisted packages stop startup without npm installation", (t) => {
  const { rootDir } = fixture(t);
  for (const modules of [
    { ...healthy, missingFiles: [{ file: "lib/missing.mjs", importer: "server.mjs" }] },
    { ...healthy, missingPackages: [{ specifier: "not-in-manifest", importer: "server.mjs" }] },
  ]) {
    assert.equal(prepareLocalDbp({ rootDir, log() {}, error() {}, inspect: () => modules, npm: () => assert.fail("npm must not run") }), 1);
  }
});

test("extraneous packages and harmless lock timestamp differences do not trigger installation", (t) => {
  const { rootDir, write } = fixture(t);
  const lock = JSON.stringify({ packages: { "node_modules/fixture-package": { version: "1.0.0" } } });
  write("node_modules/.package-lock.json", lock);
  write("package-lock.json", lock);
  assert.equal(prepareLocalDbp({ rootDir, log() {}, error: assert.fail, inspect: () => healthy,
    npm: (args) => { assert.equal(args[0], "ls"); return listed(["extraneous: harmless-package@1.0.0"]); },
  }), 0);
});

test("changed locked versions request repair while check-only mode never installs", (t) => {
  const { rootDir, write } = fixture(t);
  write("package-lock.json", JSON.stringify({ packages: { "node_modules/fixture-package": { version: "1.0.1" } } }));
  write("node_modules/.package-lock.json", JSON.stringify({ packages: { "node_modules/fixture-package": { version: "1.0.0" } } }));
  assert.equal(prepareLocalDbp({ rootDir, checkOnly: true, log() {}, error() {}, inspect: () => healthy,
    npm: (args) => { assert.equal(args[0], "ls"); return listed(); },
  }), 2);
});

test("failed installation stops startup and is not retried in a loop", (t) => {
  const { rootDir } = fixture(t); const calls = [];
  assert.equal(prepareLocalDbp({ rootDir, log() {}, error() {}, inspect: () => healthy,
    npm: (args) => { calls.push(args[0]); return args[0] === "ls" ? listed(["missing: fixture-package"]) : { status: 1 }; },
  }), 1);
  assert.deepEqual(calls, ["ls", "install"]);
});

test("a matching lockfile repairs the whole installed tree using npm ci", (t) => {
  const { rootDir, write } = fixture(t); const calls = []; let repaired = false;
  write("package-lock.json", JSON.stringify({ packages: {
    "": { dependencies: { "fixture-package": "1.0.0" } },
    "node_modules/fixture-package": { version: "1.0.0" },
  } }));
  assert.equal(prepareLocalDbp({ rootDir, log() {}, error: assert.fail, inspect: () => healthy,
    npm: (args) => {
      calls.push(args[0]);
      if (args[0] === "ci") { repaired = true; return { status: 0 }; }
      return listed(repaired ? [] : ["missing: fixture-package"]);
    },
  }), 0);
  assert.deepEqual(calls, ["ls", "ci", "ls"]);
});

test("old Node versions stop before checking or installing packages", (t) => {
  const { rootDir } = fixture(t);
  assert.equal(prepareLocalDbp({ rootDir, nodeVersion: "20.0.0", log() {}, error() {},
    inspect: () => assert.fail("must stop before module scan"), npm: () => assert.fail("must not install"),
  }), 1);
});

test("the Windows launcher performs preflight before starting the watched server", () => {
  const launcher = readFileSync(new URL("../web_run_home-UA.bat", import.meta.url), "utf8");
  assert.ok(launcher.indexOf("scripts\\check-local-dbp-port.mjs") < launcher.indexOf("scripts\\prepare-local-dbp.mjs"),
    "a running server must be reused before attempting to reinstall its dependencies");
  assert.ok(launcher.indexOf("scripts\\prepare-local-dbp.mjs") < launcher.indexOf("--watch --watch-path"));
});

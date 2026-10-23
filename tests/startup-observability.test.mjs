import assert from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = fileURLToPath(new URL("../", import.meta.url));
const loggingUrl = new URL("../lib/runtimeLogging.mjs", import.meta.url).href;
const wrapper = fileURLToPath(new URL("../scripts/with-timestamps.mjs", import.meta.url));

test("timings preserve results, errors and background promises, and log timestamps/PIDs once", () => {
  const script = `
    import assert from "node:assert/strict";
    import { measureStartupSync, measureStartupAsync, observeStartupBackground } from ${JSON.stringify(loggingUrl)};
    const value = {};
    assert.equal(measureStartupSync("sync", () => value), value);
    assert.equal(await measureStartupAsync("async", async () => value), value);
    const error = new Error("fixture failure");
    assert.throws(() => measureStartupSync("sync fail", () => { throw error; }), e => e === error);
    await assert.rejects(measureStartupAsync("async fail", async () => { throw error; }), e => e === error);
    let release;
    const pending = new Promise(resolve => { release = resolve; });
    assert.equal(observeStartupBackground("background", () => pending), pending);
    console.log("foreground continues");
    release(value);
    await pending;
    await Promise.resolve();
    console.log("multiline %s\\nsecond line", "message");
    console.error(new Error("stack fixture"));
  `;
  const result = spawnSync(process.execPath, [wrapper, process.execPath, "--input-type=module", "-e", script], {
    cwd: root, encoding: "utf8", timeout: 10_000, env: { ...process.env, TZ: "UTC" },
  });
  assert.equal(result.status, 0, result.stderr);
  for (const line of `${result.stdout}${result.stderr}`.trim().split(/\r?\n/u).filter(Boolean)) {
    const matches = [...line.matchAll(/\[(\d{2})\.(\d{2})\.(\d{4}) (\d{2}:\d{2}:\d{2})\]/gu)];
    assert.equal(matches.length, 1, line);
    assert.match(line, /^\[.*?\] \[pid=\d+\] /u);
    const [, day, month, year, time] = matches[0];
    assert.ok(Math.abs(Date.now() - Date.parse(`${year}-${month}-${day}T${time}+03:00`)) < 10_000);
  }
  assert.ok(result.stdout.indexOf("foreground continues") < result.stdout.indexOf("arka plan görevi sona erdi"));
  assert.match(result.stdout, /sync — tamamlandı; süre: \d+\.\d ms/u);
  assert.match(result.stderr, /async fail — hata; süre:/u);
});

test("watch observation reports a changed path while Node still performs the restart", {
  timeout: 20_000,
  skip: !["win32", "darwin"].includes(process.platform),
}, async (t) => {
  const fixtureParent = path.join(root, "tmp");
  await mkdir(fixtureParent, { recursive: true });
  const fixture = await mkdtemp(path.join(fixtureParent, "startup-observability-"));
  const file = path.join(fixture, "app.mjs");
  await writeFile(file, 'console.log("FIXTURE_READY"); setInterval(() => {}, 1000);\n');
  const child = spawn(process.execPath, [wrapper, process.execPath, "--watch", `--watch-path=${file}`, "--watch-preserve-output", file], {
    cwd: fixture, windowsHide: true, stdio: ["ignore", "pipe", "pipe"],
  });
  let stdout = "", stderr = "";
  child.stdout.on("data", chunk => { stdout += chunk; });
  child.stderr.on("data", chunk => { stderr += chunk; });
  t.after(async () => {
    const closed = new Promise(resolve => child.once("close", resolve));
    if (process.platform === "win32") {
      spawnSync("taskkill.exe", ["/pid", String(child.pid), "/t", "/f"], { windowsHide: true });
    } else {
      child.kill("SIGINT");
    }
    await closed;
    assert.equal(path.dirname(fixture), fixtureParent);
    assert.ok(path.basename(fixture).startsWith("startup-observability-"));
    await rm(fixture, { recursive: true, force: true });
  });
  async function until(predicate) {
    const deadline = Date.now() + 8_000;
    while (!predicate()) {
      assert.ok(Date.now() < deadline, stdout + stderr);
      await new Promise(resolve => setTimeout(resolve, 30));
    }
  }
  await until(() => stdout.includes("FIXTURE_READY"));
  await writeFile(file, 'console.log("FIXTURE_UPDATED"); setInterval(() => {}, 1000);\n');
  await until(() => stdout.includes("Dosya olayi:") && stdout.includes("Restarting") && stdout.includes("FIXTURE_UPDATED"));
  assert.ok(stdout.includes(JSON.stringify(file)), stdout);
});

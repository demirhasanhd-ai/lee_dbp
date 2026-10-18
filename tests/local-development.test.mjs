import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdir, mkdtemp, rm, symlink, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import test from "node:test";
import { chromium } from "playwright";
import { createLocalDevRenderer } from "../scripts/local-dev-renderer.mjs";

const rootDir = fileURLToPath(new URL("../", import.meta.url));

function checkPort(port) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [path.join(rootDir, "scripts/check-local-dbp-port.mjs")], {
      env: { ...process.env, HOST: "127.0.0.1", PORT: String(port), DBP_LOCAL_DEV: "1" },
      stdio: "ignore",
      windowsHide: true,
    });
    child.on("error", reject);
    child.on("exit", resolve);
  });
}

test("local development updates React, server components and CSS without reloading, and preserves API requests", { timeout: 120_000 }, async (t) => {
  // A separate app and API fixture: never load server.mjs, .env or a live DB.
  const fixtureRoot = await mkdtemp(path.join(tmpdir(), "dbp-local-dev-"));
  let renderer;
  let browser;
  let runtime = "development";
  let healthStatus = 200;
  const errors = [];
  const httpServer = createServer(async (req, res) => {
    try {
      if (req.url === "/dbp/api/dbp/health") {
        res.writeHead(healthStatus, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: true, runtime }));
        return;
      }
      if (req.url === "/dbp/api/dbp/echo") {
        let body = "";
        for await (const chunk of req) body += chunk;
        res.writeHead(200, { "Content-Type": "application/json", "Set-Cookie": "api_cookie=kept; Path=/dbp/; HttpOnly" });
        res.end(JSON.stringify({ body, cookie: req.headers.cookie, method: req.method }));
        return;
      }
      const hasBody = req.method !== "GET" && req.method !== "HEAD";
      const response = await renderer.fetch(new Request(`http://${req.headers.host}${req.url}`, {
        method: req.method, headers: req.headers, body: hasBody ? req : undefined, ...(hasBody ? { duplex: "half" } : {}),
      }));
      const headers = Object.fromEntries(response.headers);
      if (response.headers.getSetCookie().length) headers["set-cookie"] = response.headers.getSetCookie();
      res.writeHead(response.status, headers);
      res.end(Buffer.from(await response.arrayBuffer()));
    } catch (error) {
      errors.push(error.message);
      res.writeHead(500);
      res.end("Test server error");
    }
  });
  t.after(async () => {
    await browser?.close();
    await renderer?.close();
    httpServer.closeAllConnections();
    await new Promise((resolve) => httpServer.close(resolve));
    // Remove only this test's newly created, named temporary directory.
    assert.equal(path.dirname(fixtureRoot), path.resolve(tmpdir()));
    assert.ok(path.basename(fixtureRoot).startsWith("dbp-local-dev-"));
    await rm(fixtureRoot, { recursive: true, force: true });
  });
  await mkdir(path.join(fixtureRoot, "app/echo"), { recursive: true });
  await mkdir(path.join(fixtureRoot, "empty-env"));
  await symlink(path.join(rootDir, "node_modules"), path.join(fixtureRoot, "node_modules"), process.platform === "win32" ? "junction" : "dir");
  await writeFile(path.join(fixtureRoot, "package.json"), '{"type":"module"}');
  const vinextUrl = pathToFileURL(path.join(rootDir, "node_modules/vinext/dist/index.js")).href;
  await writeFile(path.join(fixtureRoot, "vite.config.mjs"), `import vinext from ${JSON.stringify(vinextUrl)};
export default { plugins: [vinext()], envDir: './empty-env', cacheDir: './cache/node_modules/.vite', server: { watch: { usePolling: true, interval: 100 } } };`);
  await writeFile(path.join(fixtureRoot, "next.config.mjs"), "export default { basePath: '/dbp' };");
  await writeFile(path.join(fixtureRoot, "app/layout.tsx"), "import './style.css'; export default function Layout({children}) { return <html><body>{children}</body></html> }");
  const clientFile = path.join(fixtureRoot, "app/Counter.tsx");
  const clientSource = '"use client"; import {useState} from "react"; export default function Counter() { const [count, setCount] = useState(0); return <button onClick={() => setCount(count + 1)}>İlk metin: {count}</button> }';
  await writeFile(clientFile, clientSource);
  const pageFile = path.join(fixtureRoot, "app/page.tsx");
  const pageSource = 'import Counter from "./Counter"; export default function Page() { return <main><h1>İlk başlık</h1><Counter/></main> }';
  await writeFile(pageFile, pageSource);
  const cssFile = path.join(fixtureRoot, "app/style.css");
  await writeFile(cssFile, "body { background-color: rgb(240, 241, 242); }");
  await writeFile(path.join(fixtureRoot, "app/echo/route.ts"), 'export async function POST(request) { return Response.json({ body: await request.text(), cookie: request.headers.get("cookie") }); } export function GET() { return Response.redirect("http://localhost/dbp/", 307); }');

  await new Promise((resolve) => httpServer.listen(0, "127.0.0.1", resolve));
  const port = httpServer.address().port;
  const origin = `http://127.0.0.1:${port}`;
  renderer = await createLocalDevRenderer({ rootDir: fixtureRoot, httpServer, port });
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  await context.addCookies([{ name: "session_fixture", value: "preserved", url: origin }]);
  const page = await context.newPage();
  page.on("pageerror", (error) => errors.push(error.message));
  let connected = false;
  page.on("console", (message) => { if (message.text().includes("[vite] connected")) connected = true; });
  const response = await page.goto(`${origin}/dbp/`, { waitUntil: "networkidle" });
  assert.equal(response.status(), 200);
  assert.equal(connected, true, "HMR connects through the same public port");
  await page.getByRole("button", { name: "İlk metin: 0" }).click();
  await page.waitForFunction(() => document.querySelector("button")?.textContent === "İlk metin: 1");
  const navigationStart = await page.evaluate(() => performance.timeOrigin);

  await writeFile(clientFile, clientSource.replace("İlk metin", "Güncel metin"));
  await page.getByRole("button", { name: "Güncel metin: 1" }).waitFor();
  assert.equal(await page.evaluate(() => performance.timeOrigin), navigationStart, "React state and document survive the update");
  await writeFile(cssFile, "body { background-color: rgb(11, 22, 33); }");
  await page.waitForFunction(() => getComputedStyle(document.body).backgroundColor === "rgb(11, 22, 33)");
  await writeFile(pageFile, pageSource.replace("İlk başlık", "Güncel başlık"));
  await page.getByRole("heading", { name: "Güncel başlık" }).waitFor();
  assert.equal(await page.evaluate(() => performance.timeOrigin), navigationStart, "server component changes also update without a document reload");

  const api = await page.evaluate(async () => (await fetch("/dbp/api/dbp/echo", { method: "POST", body: "API kaydı" })).json());
  assert.equal(api.body, "API kaydı");
  assert.equal(api.method, "POST");
  assert.match(api.cookie, /session_fixture=preserved/u);
  assert.ok((await context.cookies()).some((cookie) => cookie.name === "api_cookie" && cookie.httpOnly));
  const forwarded = await page.evaluate(async () => (await fetch("/dbp/echo", { method: "POST", body: "Vite gövdesi" })).json());
  assert.equal(forwarded.body, "Vite gövdesi");
  assert.match(forwarded.cookie, /session_fixture=preserved/u);
  const redirect = await fetch(`${origin}/dbp/echo`, { redirect: "manual" });
  assert.equal(redirect.status, 307, "the local renderer preserves redirects");

  assert.equal(await checkPort(port), 0, "a development server can be reused");
  runtime = "production";
  assert.equal(await checkPort(port), 3, "the launcher detects the old production server");
  healthStatus = 503;
  assert.equal(await checkPort(port), 2, "an occupied unhealthy port is reported");
  assert.deepEqual(errors, []);
});

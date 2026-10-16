import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { after } from "node:test";
import { chromium } from "playwright";
import { createPublicFixtures } from "./public-fixtures.mjs";

const clientRoot = fileURLToPath(new URL("../../dist/client/", import.meta.url));
const mime = { ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png", ".woff2": "font/woff2" };
let setup;
let active = 0;
const waiting = [];

async function asset(url) {
  const relative = decodeURIComponent(url.pathname.replace(/^\/dbp\//u, ""));
  const file = path.resolve(clientRoot, relative);
  if (!file.startsWith(`${path.resolve(clientRoot)}${path.sep}`)) return null;
  try {
    if (!(await stat(file)).isFile()) return null;
    return new Response(await readFile(file), { headers: { "Content-Type": mime[path.extname(file)] || "application/octet-stream" } });
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}

async function start() {
  const { default: worker } = await import("../../dist/server/index.js");
  const fixtures = createPublicFixtures();
  const server = createServer(async (request, response) => {
    try {
      const url = new URL(request.url, `http://${request.headers.host}`);
      const result = await asset(url) || await worker.fetch(new Request(url, { headers: { accept: "text/html" } }), {
        ASSETS: { fetch: async (input) => await asset(new URL(input.url || input)) || new Response("Not found", { status: 404 }) },
      }, { waitUntil() {}, passThroughOnException() {} });
      response.writeHead(result.status, Object.fromEntries(result.headers));
      response.end(Buffer.from(await result.arrayBuffer()));
    } catch (error) {
      response.writeHead(500);
      response.end(String(error));
    }
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  try {
    const browser = await chromium.launch({ headless: true });
    return { browser, server, fixtures, origin: `http://127.0.0.1:${server.address().port}` };
  } catch (error) {
    server.close();
    fixtures.close();
    throw error;
  }
}

after(async () => {
  if (!setup) return;
  const runtime = await setup.catch(() => null);
  if (!runtime) return;
  await runtime.browser.close();
  await new Promise((resolve) => runtime.server.close(resolve));
  runtime.fixtures.close();
});

export async function withPublicPage(pagePath, options, callback) {
  if (active >= 3) await new Promise((resolve) => waiting.push(resolve));
  active++;
  let context;
  try {
    const runtime = await (setup ||= start());
    context = await runtime.browser.newContext();
    const errors = [], apiRequests = [];
    await context.route("**/*", async (route) => {
      const url = new URL(route.request().url());
      if (url.origin !== runtime.origin) return route.abort();
      if (!url.pathname.startsWith("/dbp/api/dbp/")) return route.continue();
      apiRequests.push(url.pathname);
      try {
        assert.equal(route.request().method(), "GET", "public tests must not write application data");
        if (options.apiGate) await options.apiGate;
        return await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(runtime.fixtures.respond(url, options)) });
      } catch (error) {
        errors.push(error.message);
        return route.fulfill({ status: 500, contentType: "application/json", body: JSON.stringify({ message: error.message }) });
      }
    });
    const page = await context.newPage();
    page.on("pageerror", (error) => errors.push(error.message));
    if (options.preparePage) await options.preparePage(page);
    const response = await page.goto(`${runtime.origin}${pagePath}`, { waitUntil: options.waitUntil || "networkidle" });
    const value = await callback({ page, response, apiRequests });
    assert.deepEqual(errors, [], `browser/API errors for ${pagePath}`);
    return value;
  } finally {
    await context?.close();
    active--;
    waiting.shift()?.();
  }
}

export async function renderHydrated(environment, pagePath) {
  assert.deepEqual(environment, {}, "browser fixtures do not load environment configuration");
  return withPublicPage(pagePath, {}, async ({ page, response, apiRequests }) => {
    const packagePage = new URL(pagePath, "http://localhost").searchParams.has("ders");
    await page.locator(packagePage ? ".week-grid" : ".public-course-table").first().waitFor();
    assert.ok(apiRequests.some((item) => item.endsWith(packagePage ? "/course-package" : "/courses")));
    return new Response(await page.content(), { status: response.status(), headers: { "Content-Type": "text/html" } });
  });
}

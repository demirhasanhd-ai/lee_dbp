import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const okuWebsiteFooterLink =
  /<a(?=[^>]*\bhref=["']https:\/\/osmaniye\.edu\.tr["'])(?=[^>]*\btarget=["']_blank["'])(?=[^>]*\brel=["']noopener noreferrer["'])[^>]*>\s*OKÜ Web Sitesi\s*<\/a>/i;

async function packageVersion() {
  const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
  return packageJson.version;
}

async function render(environment = {}) {
  const previousEnvironment = new Map();
  for (const [key, value] of Object.entries(environment)) {
    previousEnvironment.set(key, process.env[key]);
    process.env[key] = value;
  }

  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  try {
    const { default: worker } = await import(workerUrl.href);

    return await worker.fetch(
      new Request("http://localhost/dbp/", {
        headers: { accept: "text/html" },
      }),
      {
        ASSETS: {
          fetch: async () => new Response("Not found", { status: 404 }),
        },
      },
      {
        waitUntil() {},
        passThroughOnException() {},
      },
    );
  } finally {
    for (const [key, value] of previousEnvironment) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
}

test("server-renders the public home page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>LEE Ders Bilgi Paketi \| LEE DBP<\/title>/i);
  assert.match(html, /Ders Kataloğu/);
  assert.doesNotMatch(html, /Yönetim Alanı|Giriş Yap|\/dbp\/yonetim/i);
  assert.doesNotMatch(html, /Your site is taking shape|Codex is working/i);
});

test("footer OKÜ Web Sitesi link opens in a new tab", async () => {
  const response = await render();
  const html = await response.text();
  assert.match(html, okuWebsiteFooterLink);
});

test("server footer renders the package version", async () => {
  const response = await render();
  const html = (await response.text()).replaceAll("<!-- -->", "");
  const escapedVersion = (await packageVersion()).replaceAll(".", "\\.");
  assert.match(html, new RegExp(`Versiyon:\\s*${escapedVersion}`));
});

test("production server port does not turn the e-Enstitu link into localhost", async () => {
  const response = await render({ NODE_ENV: "production", PORT: "8081" });
  const html = await response.text();

  assert.match(
    html,
    /<a(?=[^>]*\bclass=["'][^"']*\breturn-link\b[^"']*["'])(?=[^>]*\bhref=["']https:\/\/e-enstitu\.osmaniye\.edu\.tr\/#["'])[^>]*>/i,
  );
  assert.doesNotMatch(html, /href=["']http:\/\/localhost:8080/i);
});

test("local preview footer OKÜ Web Sitesi link opens in a new tab", async () => {
  const html = await readFile(new URL("../local-preview/index.html", import.meta.url), "utf8");
  assert.match(html, okuWebsiteFooterLink);
});

test("local preview loads version from the package endpoint", async () => {
  const html = await readFile(new URL("../local-preview/index.html", import.meta.url), "utf8");
  assert.match(html, /<script\s+src=["']\/app-version\.js["']\s+defer><\/script>/i);
  assert.match(html, /\bdata-app-version\b/);
  assert.doesNotMatch(html, /Versiyon:\s*\d/);
});

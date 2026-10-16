import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { createServer } from "node:http";
import { DatabaseSync } from "node:sqlite";
import vm from "node:vm";

const source = readFileSync(new URL("../../server.mjs", import.meta.url), "utf8");
const declarations = new Map([...source.matchAll(/^(?:async )?function (\w+)\([^\n]*\) \{[\s\S]*?^\}/gm)].map((match) => [match[1], match[0]]));
export const browserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140.0.0.0 Safari/537.36";

export function viewStatisticsFixture(t) {
  const db = new DatabaseSync(":memory:");
  t.after(() => db.close());
  for (const table of ["page_view_events", "page_view_monthly_stats"]) {
    const schema = source.match(new RegExp(`CREATE TABLE IF NOT EXISTS ${table} \\([\\s\\S]*?\\n    \\);`));
    assert.ok(schema, table);
    db.exec(schema[0]);
  }
  const createContext = () => {
    const context = vm.createContext({
      db, URL, Request, Response, Headers, Buffer, randomUUID, basePath: "/dbp", port: 8081,
      repairText: (value) => value,
      stripBasePath: (pathname) => pathname === "/dbp" ? "/" : pathname.replace(/^\/dbp\//u, "/"),
      normalizePublicRouteSegment: (value) => value.toLowerCase(),
      publicProgramRouteContext: (pathname) => pathname === "/dbp/mat/tezli" ? { itemId: "mat/tezli", itemTitle: "Matematik" } : null,
      publicCourseRouteContext: (pathname) => pathname === "/dbp/mat/tezli/mat864" ? { canonicalPath: pathname, found: { course: { code: "MAT864", name: "Analiz", programName: "Matematik", level: "Tezli Yüksek Lisans" } } } : null,
      countRows: (table) => db.prepare(`SELECT COUNT(*) AS count FROM ${table}`).get().count,
    });
    vm.runInContext(source.match(/^const viewStatTypes = \{[\s\S]*?^\};/m)[0], context);
    for (const name of ["yearMonthFromIso", "normalizeViewStatType", "normalizeViewEventRow", "incrementPageViewSummary", "logPageView", "publicViewStats", "pageViewContextForPath", "pageViewContextForCatalogUrl", "requestClientIp", "isPageViewNavigation", "trackPageViewRequest", "nodeRequestToWeb", "sendWebResponse"]) {
      assert.ok(declarations.has(name), name);
      vm.runInContext(declarations.get(name), context);
    }
    return context;
  };
  const context = createContext();
  const navigation = (pathname = "/dbp/", { cookie, headers = {}, method = "GET", response, runtime = context } = {}) => {
    const request = new Request(`https://example.test${pathname}`, { method, headers: {
      accept: "text/html,application/xhtml+xml", "user-agent": browserAgent,
      "sec-fetch-dest": "document", "sec-fetch-mode": "navigate", "x-forwarded-for": "192.0.2.1",
      ...(cookie ? { cookie } : {}), ...headers,
    } });
    return runtime.trackPageViewRequest(request, response || new Response("<!doctype html><title>Local test</title>", { headers: { "Content-Type": "text/html; charset=utf-8" } }));
  };
  const totals = () => Object.fromEntries(db.prepare("SELECT view_type, COUNT(*) AS count FROM page_view_events GROUP BY view_type").all().map((row) => [row.view_type, row.count]));
  return { db, context, createContext, navigation, totals };
}

export async function viewStatisticsTestServer(t) {
  const fixture = viewStatisticsFixture(t);
  const errors = [];
  const server = createServer(async (req, res) => {
    try {
      const request = fixture.context.nodeRequestToWeb(req);
      const url = new URL(request.url);
      const response = url.pathname.endsWith("/api/dbp/health")
        ? Response.json({ ok: true })
        : new Response('<!doctype html><title>Local statistics test</title><a href="/dbp/">Ana Sayfa</a><a href="/dbp/kalite">Kalite</a><a href="/dbp/#programlar">Ders Kataloğu</a><a href="/dbp/mat/tezli/mat864">Ders</a>', { headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Set-Cookie": "existing_cookie=kept; Path=/; HttpOnly; Expires=Wed, 21 Oct 2037 07:28:00 GMT",
        } });
      await fixture.context.sendWebResponse(res, fixture.context.trackPageViewRequest(request, response));
    } catch (error) {
      errors.push(error);
      res.writeHead(500);
      res.end("Test server error");
    }
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(async () => {
    await new Promise((resolve) => server.close(resolve));
    assert.deepEqual(errors, []);
  });
  return { ...fixture, origin: `http://127.0.0.1:${server.address().port}` };
}

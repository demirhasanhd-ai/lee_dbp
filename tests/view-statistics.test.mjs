import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { get } from "node:http";
import test from "node:test";
import { browserAgent, viewStatisticsFixture, viewStatisticsTestServer } from "./helpers/view-statistics-fixtures.mjs";

const sessionCookie = (response) => response.headers.getSetCookie().find((value) => value.startsWith("lee_dbp_home_visit="))?.split(";")[0];

test("first home visit creates one browser-session event with a private response and a session cookie", (t) => {
  const { navigation, totals } = viewStatisticsFixture(t);
  const response = navigation();
  assert.deepEqual(totals(), { home: 1 });
  const cookie = response.headers.getSetCookie()[0];
  assert.match(cookie, /^lee_dbp_home_visit=/u);
  assert.match(cookie, /HttpOnly; SameSite=Lax; Secure/u);
  assert.match(cookie, /Path=\/dbp\//u);
  assert.doesNotMatch(cookie, /Max-Age|Expires/iu);
  assert.equal(response.headers.get("cache-control"), "private, no-store");
});

test("home refreshes, catalogue-section links and returning from subpages do not increment home within the same session", (t) => {
  const { navigation, totals, context } = viewStatisticsFixture(t);
  const cookie = sessionCookie(navigation());
  for (const pathname of ["/dbp/kalite", "/dbp/ogrenci-gostergeleri", "/dbp/tez-ska", "/dbp/article", "/dbp/yayin", "/dbp/article/tez", "/dbp/mat/tezli", "/dbp/mat/tezli/mat864"]) navigation(pathname, { cookie });
  for (const pathname of ["/dbp/", "/dbp/#programlar", "/dbp/?source=menu"]) {
    const response = navigation(pathname, { cookie });
    assert.equal(response.headers.getSetCookie().length, 0);
  }
  assert.deepEqual(totals(), { home: 1, kalite_gostergeleri: 1, ogrenci_gostergeleri: 1, tez_ska_analiz: 1, bib_scopus: 1, bib_tr_dizin: 1, bib_tez: 1, anabilimdali: 1, ders: 1 });
  const displayed = context.publicViewStats();
  assert.equal(displayed.totals.find((row) => row.viewType === "home").count, 1, "the footer's home total must also remain one");
  assert.equal(displayed.monthly.filter((row) => row.viewType === "home").reduce((sum, row) => sum + row.count, 0), 1, "the statistics dashboard's monthly home total must remain one");
});

test("direct subpage visits do not count as home; independent browser sessions sharing an IP count separately", (t) => {
  const { navigation, totals } = viewStatisticsFixture(t);
  navigation("/dbp/kalite");
  assert.equal(totals().home, undefined);
  const first = sessionCookie(navigation());
  const second = sessionCookie(navigation());
  assert.notEqual(first, second);
  navigation("/dbp/", { cookie: first });
  navigation("/dbp/", { cookie: second });
  assert.equal(totals().home, 2);
});

test("server restarts preserve home deduplication and old events and summary rows remain intact", (t) => {
  const { db, context, navigation, totals, createContext } = viewStatisticsFixture(t);
  context.logPageView({ eventUuid: "historical-event", viewedAt: "2026-09-01T00:00:00Z", viewType: "home", itemId: "home", path: "/", userAgent: "Wget/1.21" });
  const old = db.prepare("SELECT * FROM page_view_events WHERE event_uuid = 'historical-event'").get();
  const oldSummary = db.prepare("SELECT * FROM page_view_monthly_stats WHERE year_month = '2026-09'").get();
  const cookie = sessionCookie(navigation());
  navigation("/dbp/", { cookie, runtime: createContext() });
  assert.equal(totals().home, 2);
  assert.deepEqual(db.prepare("SELECT * FROM page_view_events WHERE event_uuid = 'historical-event'").get(), old);
  assert.deepEqual(db.prepare("SELECT * FROM page_view_monthly_stats WHERE year_month = '2026-09'").get(), oldSummary);
});

test("health probes, crawlers, RSC, prefetch, fetch requests and non-HTML/error responses are not visits", (t) => {
  const { navigation, totals } = viewStatisticsFixture(t);
  for (const agent of ["Wget/1.21", "curl/8.0", "Googlebot/2.1", "UptimeRobot/2.0", "kube-probe/1.0", "python-requests/2.0", "facebookexternalhit/1.1", ""]) navigation("/dbp/", { headers: { "user-agent": agent } });
  for (const headers of [
    { "sec-fetch-dest": "empty", "sec-fetch-mode": "cors" }, { accept: "application/json" }, { rsc: "1" },
    { "next-router-prefetch": "1" }, { "x-middleware-prefetch": "1" }, { purpose: "prefetch" }, { "sec-purpose": "prefetch;prerender" },
  ]) navigation("/dbp/", { headers });
  navigation("/dbp/?_rsc=payload");
  navigation("/dbp/", { method: "HEAD" });
  for (const status of [302, 404, 500]) navigation("/dbp/", { response: new Response("Not a visit", { status, headers: { "Content-Type": "text/html" } }) });
  navigation("/dbp/", { response: Response.json({ ok: true }) });
  navigation("/dbp/", { response: new Response("RSC", { headers: { "Content-Type": "text/x-component" } }) });
  for (const pathname of ["/dbp/api/dbp/health", "/dbp/api/dbp/view-stats", "/dbp/assets/client.js", "/dbp/oku-logo.png", "/dbp/panel"]) navigation(pathname);
  assert.deepEqual(totals(), {});
  const dockerfile = readFileSync(new URL("../Dockerfile", import.meta.url), "utf8");
  assert.match(dockerfile, /CMD wget -qO- http:\/\/127\.0\.0\.1:8081\/dbp\/api\/dbp\/health/u);
});

test("malformed cookies start a new session and HTTP local development remains supported", (t) => {
  const { navigation, totals, context } = viewStatisticsFixture(t);
  assert.ok(sessionCookie(navigation("/dbp/", { cookie: "lee_dbp_home_visit=invalid; other=value" })));
  const response = context.trackPageViewRequest(new Request("http://localhost/dbp/", { headers: { accept: "text/html", "user-agent": browserAgent } }), new Response("HTML", { headers: { "Content-Type": "text/html" } }));
  assert.doesNotMatch(response.headers.getSetCookie()[0], /; Secure/u);
  assert.equal(totals().home, 2);
});

test("HTTP responses preserve existing cookies and statistics remain consistent across home and content requests", async (t) => {
  const { origin, totals } = await viewStatisticsTestServer(t);
  const headers = { accept: "text/html", "user-agent": browserAgent, "sec-fetch-dest": "document", "sec-fetch-mode": "navigate" };
  const visit = (pathname, requestHeaders) => new Promise((resolve, reject) => {
    get(`${origin}${pathname}`, { headers: requestHeaders }, (response) => {
      response.resume();
      response.on("end", () => resolve({ status: response.statusCode, cookies: response.headers["set-cookie"] || [] }));
    }).on("error", reject);
  });
  const first = await visit("/dbp/", headers);
  assert.equal(first.status, 200);
  const cookies = first.cookies;
  assert.equal(cookies.length, 2);
  assert.ok(cookies.some((cookie) => cookie.includes("existing_cookie=kept") && cookie.includes("Expires=Wed,")));
  const cookie = cookies.find((value) => value.startsWith("lee_dbp_home_visit=")).split(";")[0];
  for (const pathname of ["/dbp/kalite", "/dbp/mat/tezli/mat864", "/dbp/", "/dbp/"]) await visit(pathname, { ...headers, cookie });
  await visit("/dbp/api/dbp/health", { "user-agent": "Wget/1.21" });
  assert.deepEqual(totals(), { home: 1, kalite_gostergeleri: 1, ders: 1 });
});

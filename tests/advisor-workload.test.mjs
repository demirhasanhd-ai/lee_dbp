import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";

const source = readFileSync(new URL("../server.mjs", import.meta.url), "utf8");
const declarations = new Map([...source.matchAll(/^(?:async )?function (\w+)\([^\n]*\) \{[\s\S]*?^\}/gm)].map((match) => [match[1], match[0]]));
const payload = (summary = { activeStudents: 60, advisorCount: 10, studentsPerAdvisor: 999 }) => ({
  schemaVersion: 1, source: "e_enstitu_advisor_assignments", generatedAt: "2026-11-24T12:00:00.000Z", summary,
  privateAdvisorName: "Never publish me", privateStudentId: "private-student-id",
});

function fixture(respond = () => ({ ok: true, json: async () => payload() }), bases = ["http://source"]) {
  const calls = [];
  const context = vm.createContext({
    URL, Response,
    stripBasePath: (path) => path.replace(/^\/dbp/u, ""),
    ensureDb: async () => {},
    jsonResponse: (value, init) => Response.json(value, init),
    eEnstituApiBaseUrls: () => bases,
    eEnstituDbTimeoutMs: () => 1500,
    withTimeout: (promise) => promise,
    fetch: async (url, init) => { calls.push({ url: new URL(url), init }); return respond(url, init); },
    console: { error() {} },
    normalizeScope: (value = "") => value.toLocaleLowerCase("tr-TR"), displayLevel: (value) => value,
    databaseProgramCatalog: () => [
      { mainDepartment: "Örnek ABD", department: "Alt A", programName: "Program A", levels: ["Doktora", "Tezli Yüksek Lisans"] },
      { mainDepartment: "Örnek ABD", department: "Alt B", programName: "Program B", levels: ["Tezli Yüksek Lisans"] },
      { mainDepartment: "Başka ABD", department: "Başka ABD", programName: "Program C", levels: ["Doktora"] },
    ],
  });
  for (const name of ["qualityScopeDefinitions", "loadEEnstituAdvisorWorkload", "handleDbpApi"]) vm.runInContext(declarations.get(name), context);
  return { calls, request: (query = "") => context.handleDbpApi(new Request("http://localhost/dbp/api/dbp/advisor-workload" + query)) };
}

test("advisor workload exposes only aggregates and recomputes the average from its counts", async () => {
  const { request, calls } = fixture();
  const response = await request();
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    generatedAt: "2026-11-24T12:00:00.000Z", source: "e_enstitu_advisor_assignments",
    summary: { activeStudents: 60, advisorCount: 10, studentsPerAdvisor: 6 },
  });
  assert.equal(calls[0].url.pathname, "/api/public/dbp/advisor-workload");
  assert.equal(calls[0].url.search, "");
  assert.equal(calls[0].init.cache, "no-store");
});

test("the selected student program and level are forwarded together, including Turkish names", async () => {
  const { request, calls } = fixture();
  const scope = { department: "Yönetim Bilişim Sistemleri ABD", programName: "Yönetim Bilişim Sistemleri", level: "Doktora" };
  const response = await request("?" + new URLSearchParams({ ...scope, irrelevant: "ignored" }));
  assert.equal(response.status, 200);
  assert.deepEqual(Object.fromEntries(calls[0].url.searchParams), scope);
  const incomplete = await request("?programName=Example");
  assert.equal(incomplete.status, 400);
  assert.equal(calls.length, 1);
});

test("a scope with no current advisors is zero students and zero advisors, with no division by zero", async () => {
  const { request } = fixture(() => ({ ok: true, json: async () => payload({ activeStudents: 0, advisorCount: 0 }) }));
  assert.deepEqual((await (await request()).json()).summary, { activeStudents: 0, advisorCount: 0, studentsPerAdvisor: null });
});

test("source failures or incompatible responses stay errors instead of fabricated zero counts", async () => {
  for (const value of [
    {}, { ...payload(), schemaVersion: 0 }, { ...payload(), source: "old_snapshot" }, { ...payload(), generatedAt: "invalid" },
    payload({ activeStudents: -1, advisorCount: 0 }), payload({ activeStudents: 1, advisorCount: 0 }),
    payload({ activeStudents: 1, advisorCount: 2 }), payload({ activeStudents: 3.5, advisorCount: 1 }),
  ]) {
    const { request } = fixture(() => ({ ok: true, json: async () => value }));
    const response = await request();
    assert.equal(response.status, 503, JSON.stringify(value));
    assert.equal((await response.json()).summary, undefined);
  }
  const { request } = fixture(() => { throw new Error("source unavailable"); });
  assert.equal((await request()).status, 503);
});

test("an unavailable source candidate falls back to another configured e-Enstitü endpoint", async () => {
  const { request, calls } = fixture((url) => {
    if (url.hostname === "old") return { ok: false, status: 404, json: async () => ({}) };
    return { ok: true, json: async () => payload() };
  }, ["http://old", "http://current"]);
  assert.equal((await request()).status, 200);
  assert.deepEqual(calls.map(({ url }) => url.hostname), ["old", "current"]);
});

test("parent ABD filters forward all matching catalog programs and track-only filters stay scoped", async () => {
  const { request, calls } = fixture((url) => {
    const query = new URL(url).searchParams;
    return { ok: true, json: async () => ({ ...payload(), scope: {
      ...(query.get("level") ? { level: query.get("level") } : {}),
      ...(query.has("programs") ? { programs: JSON.parse(query.get("programs")) } : {}),
    } }) };
  });
  for (const level of ["", "Tezli Yüksek Lisans", "Doktora"]) {
    assert.equal((await request("?" + new URLSearchParams({ mainDepartment: "Örnek ABD", level }))).status, 200);
    const programs = JSON.parse(calls.at(-1).url.searchParams.get("programs"));
    assert.deepEqual(programs.map((item) => item.programName), level === "Doktora" ? ["Program A"] : level ? ["Program A", "Program B"] : ["Program A", "Program A", "Program B"]);
    assert.ok(programs.every((item) => !level || item.level === level));
  }
  assert.equal((await request("?" + new URLSearchParams({ level: "Doktora" }))).status, 200);
  assert.deepEqual(Object.fromEntries(calls.at(-1).url.searchParams), { level: "Doktora" });
  const before = calls.length;
  for (const query of [{ mainDepartment: "Olmayan ABD" }, { mainDepartment: "Başka ABD", level: "Tezli Yüksek Lisans" }, { level: "Lisans" }]) {
    assert.equal((await request("?" + new URLSearchParams(query))).status, 400);
  }
  assert.equal(calls.length, before, "invalid scopes must never fall back to the institute");
});

test("sources that silently ignore the new scope cannot return institute counts", async () => {
  const { request } = fixture();
  assert.equal((await request("?" + new URLSearchParams({ mainDepartment: "Örnek ABD" }))).status, 503);
  assert.equal((await request("?" + new URLSearchParams({ level: "Doktora" }))).status, 503);
});

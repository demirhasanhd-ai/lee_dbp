import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";
import vm from "node:vm";

const source = readFileSync(new URL("../server.mjs", import.meta.url), "utf8");
const declarations = new Map([...source.matchAll(/^(?:async )?function (\w+)\([^\n]*\) \{[\s\S]*?^\}/gm)].map((match) => [match[1], match[0]]));
const retryDelay = 5 * 60_000;

function fixture(t, { fail = false } = {}) {
  let now = Date.parse("2026-11-24T10:00:00.000Z");
  let calls = 0;
  const snapshot = { source: "e_enstitu_advisor_directory", snapshotVersion: 7, generatedAt: "2026-11-16T10:00:00.000Z", institute: {}, programs: [] };
  const db = new DatabaseSync(":memory:");
  t.after(() => db.close());
  db.exec("CREATE TABLE metadata (key TEXT PRIMARY KEY, value TEXT)");
  const context = vm.createContext({
    Date: class extends Date {
      constructor(...args) { super(...(args.length ? args : [now])); }
      static now() { return now; }
    },
    db,
    console: { error() {} },
    studentStatisticsSnapshotKey: "student_statistics_snapshot_v1",
    studentStatisticsRefreshLastAttemptAt: 0,
    studentStatisticsRefreshPromise: undefined,
    studentStatisticsSnapshotCache: snapshot,
    eEnstituDbTimeoutMs: () => 5000,
    eEnstituApiBaseUrls: () => ["http://fixture"],
    withTimeout: (promise) => promise,
    fetch: async () => {
      calls++;
      if (fail) throw new Error("source temporarily unavailable");
      return { ok: true, json: async () => snapshot };
    },
    officialStudentStatisticsSnapshot: (value) => value,
    readStudentStatisticsSnapshot: () => context.studentStatisticsSnapshotCache,
    managedSchedule: () => [],
    nextMainDataRefreshDate: () => null,
    audit() {},
  });
  for (const name of ["shouldRefreshStudentStatisticsSource", "refreshStudentStatisticsSnapshot", "queueStudentStatisticsRefresh"]) {
    assert.ok(declarations.has(name), name);
    vm.runInContext(declarations.get(name), context);
  }
  return { context, snapshot, db, calls: () => calls, advance: (ms) => { now += ms; } };
}

test("old sources without advisor fields are retried at most once per five minutes", async (t) => {
  const { context, snapshot, db, calls, advance } = fixture(t);
  assert.equal(context.shouldRefreshStudentStatisticsSource(snapshot), true);
  const updated = await context.queueStudentStatisticsRefresh("public-statistics-refresh");
  assert.ok(db.prepare("SELECT value FROM metadata WHERE key = ?").get("student_statistics_snapshot_v1"));
  advance(60_001);
  assert.equal(context.shouldRefreshStudentStatisticsSource(updated), false);
  advance(retryDelay);
  assert.equal(context.shouldRefreshStudentStatisticsSource(updated), true);
  assert.equal(calls(), 1);
});

test("failed advisor refreshes retain the cached snapshot and apply the same retry delay", async (t) => {
  const { context, snapshot, calls, advance } = fixture(t, { fail: true });
  assert.equal(await context.queueStudentStatisticsRefresh("public-statistics-refresh"), snapshot);
  assert.equal(context.studentStatisticsRefreshPromise, undefined);
  assert.equal(context.shouldRefreshStudentStatisticsSource(snapshot), false);
  advance(retryDelay + 1);
  assert.equal(context.shouldRefreshStudentStatisticsSource(snapshot), true);
  assert.equal(calls(), 1);
});

test("manual refreshes can retry immediately and complete advisor data needs no compatibility retry", async (t) => {
  const { context, snapshot, calls } = fixture(t);
  await context.queueStudentStatisticsRefresh("public-force-refresh");
  await context.queueStudentStatisticsRefresh("public-force-refresh");
  assert.equal(calls(), 2);
  assert.equal(context.shouldRefreshStudentStatisticsSource({ ...snapshot, advisorRatios: {}, enrollmentHistory: {} }), false);
});

test("missing or invalid snapshot dates do not prevent advisor compatibility refreshes", (t) => {
  const { context, snapshot } = fixture(t);
  for (const generatedAt of [undefined, "invalid"]) {
    assert.equal(context.shouldRefreshStudentStatisticsSource({ ...snapshot, generatedAt }), true);
  }
});

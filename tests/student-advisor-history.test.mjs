import assert from "node:assert/strict";
import test from "node:test";
import { mergeStudentAdvisorHistory, publicStudentAdvisorHistory } from "../lib/studentAdvisorHistory.mjs";

const program = { departmentId: "biology", department: "Biyoloji ABD", programName: "Biyoloji", level: "Tezli Yüksek Lisans", activeStudents: 30, advisorCount: 5, suppressed: false, statusDataComplete: true };
const observation = (year, overrides = {}) => ({ year, observedAt: `${year}-11-20T10:00:00.000Z`, programs: [{ ...program, ...overrides }] });
const catalog = [{ departmentId: "catalog-biology", department: "Biyoloji ABD", programName: "Biyoloji", level: "Tezli Yüksek Lisans" }];
const matches = (programs, consumed, official) => programs.map((candidate, index) => ({ candidate, index })).filter(({ candidate, index }) => !consumed.has(index) && candidate.programName === official.programName && candidate.level === official.level);

test("yearly observations retain each year's own students and advisors across updates and restarts", () => {
  const first = mergeStudentAdvisorHistory([], observation(2025));
  const updated = mergeStudentAdvisorHistory(JSON.parse(JSON.stringify(first)), observation(2026, { activeStudents: 48, advisorCount: 8 }));
  const history = publicStudentAdvisorHistory(updated, catalog, matches);
  assert.deepEqual(history.map((item) => [item.year, item.programs[0].activeStudents, item.programs[0].advisorCount, item.programs[0].studentsPerAdvisor]), [[2025, 30, 5, 6], [2026, 48, 8, 6]]);
  const newer = { ...observation(2026, { activeStudents: 56 }), observedAt: "2026-12-01T10:00:00.000Z" };
  const replaced = mergeStudentAdvisorHistory(updated, newer);
  assert.equal(replaced.length, 2);
  assert.equal(replaced[0].programs[0].activeStudents, 30);
  assert.equal(replaced[1].programs[0].activeStudents, 56);
  assert.deepEqual(mergeStudentAdvisorHistory(replaced, observation(2026)), replaced);
});

test("unavailable years and old payloads never acquire invented data", () => {
  assert.deepEqual(mergeStudentAdvisorHistory([], undefined), []);
  assert.deepEqual(mergeStudentAdvisorHistory([], { ...observation(2025), year: 2024 }), []);
  assert.deepEqual(publicStudentAdvisorHistory([], catalog, matches), []);
});

test("suppression, missing statuses and zero advisors never produce ratios", () => {
  for (const overrides of [{ activeStudents: null, suppressed: true }, { statusDataComplete: false }, { advisorCount: 0 }]) {
    const history = mergeStudentAdvisorHistory([], observation(2025, overrides));
    assert.equal(publicStudentAdvisorHistory(history, catalog, matches)[0].programs[0].studentsPerAdvisor, null);
  }
});

test("same-ABD program aliases share the advisor denominator", () => {
  const source = observation(2025);
  source.programs.push({ ...program, activeStudents: 10 });
  const row = publicStudentAdvisorHistory(mergeStudentAdvisorHistory([], source), catalog, matches)[0].programs[0];
  assert.equal(row.activeStudents, 40);
  assert.equal(row.advisorCount, 5);
  assert.equal(row.studentsPerAdvisor, 8);
  source.programs[1].departmentId = "another-department";
  const ambiguous = publicStudentAdvisorHistory(mergeStudentAdvisorHistory([], source), catalog, matches)[0].programs[0];
  assert.equal(ambiguous.advisorCount, null);
  assert.equal(ambiguous.studentsPerAdvisor, null);
});

test("non-thesis masters are excluded", () => {
  const source = observation(2025, { level: "Tezsiz Yüksek Lisans" });
  assert.equal(mergeStudentAdvisorHistory([], source)[0].programs.length, 0);
});

test("OBS enrollment reconstructions keep historical advisor counts unavailable and preserve observations", () => {
  const reconstructed = { ...observation(2025, { advisorCount: null }), method: "enrollment_intervals" };
  const history = mergeStudentAdvisorHistory([], reconstructed);
  const row = publicStudentAdvisorHistory(history, catalog, matches)[0].programs[0];
  assert.equal(row.activeStudents, 30);
  assert.equal(row.advisorCount, null);
  assert.equal(row.studentsPerAdvisor, null);
  const observed = mergeStudentAdvisorHistory([], observation(2025));
  assert.deepEqual(mergeStudentAdvisorHistory(observed, { ...reconstructed, observedAt: "2025-12-31T20:59:59.000Z" }), observed);
  const corrected = { ...reconstructed, generatedAt: "2026-11-20T12:00:00.000Z", programs: [{ ...program, advisorCount: null, activeStudents: 40 }] };
  assert.equal(mergeStudentAdvisorHistory(history, corrected)[0].programs[0].activeStudents, 40);
});

test("actual observations replace later-generated reconstructions regardless of arrival order", () => {
  const reconstructed = {
    ...observation(2025, { advisorCount: null }),
    observedAt: "2025-12-31T20:59:59.000Z",
    generatedAt: "2026-11-24T08:00:00.000Z",
    method: "enrollment_intervals",
  };
  const actual = observation(2025);
  const reconstructedFirst = mergeStudentAdvisorHistory(mergeStudentAdvisorHistory([], reconstructed), actual);
  const actualFirst = mergeStudentAdvisorHistory(mergeStudentAdvisorHistory([], actual), reconstructed);
  assert.deepEqual(reconstructedFirst, actualFirst);
  const row = publicStudentAdvisorHistory(reconstructedFirst, catalog, matches)[0].programs[0];
  assert.equal(row.advisorCount, 5);
  assert.equal(row.studentsPerAdvisor, 6);
});

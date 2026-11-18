import assert from "node:assert/strict";
import test from "node:test";
import { initialContributionMatrix } from "../lib/courseContributionDefaults.mjs";

const legacy = [{ P1: 4, P2: 2, P3: 1, P4: 5, P5: 3, P6: 2, P7: 4, P8: 1, P9: 3, P10: 5, P11: 2 }];
const outcomes = (count) => Array.from({ length: count }, (_, index) => ({ id: `pc-${index + 1}`, text: `Çıktı ${index + 1}` }));

test("legacy drafts suggest the first 7 or 11 scores and leave an added 12th outcome empty", () => {
  const stored = { contributionMatrix: legacy };
  const before = JSON.stringify(stored);
  for (const count of [7, 11, 12]) {
    const matrix = initialContributionMatrix(stored, outcomes(count), "Taslak");
    assert.deepEqual(Object.values(matrix[0]), Object.values(legacy[0]).slice(0, Math.min(count, 11)));
    assert.equal(Object.keys(matrix[0]).length, Math.min(count, 11));
    assert.equal(matrix[0]["pc-12"], undefined);
  }
  assert.equal(JSON.stringify(stored), before, "suggestions never mutate the saved package or seed");
});

test("unchanged and mixed outcome identities keep existing scores, including current teacher values", () => {
  const program = [{ id: "P1", text: "Unchanged" }, { id: "pc-new", text: "Changed" }];
  assert.deepEqual(initialContributionMatrix({ contributionMatrix: legacy }, program, "Taslak"), [{ P1: 4, "pc-new": 2 }]);
  assert.deepEqual(initialContributionMatrix({ contributionMatrix: [{ ...legacy[0], "pc-new": 5 }] }, program, "Taslak"), [{ P1: 4, "pc-new": 5 }]);
});

test("legacy suggestions remain positional when outputs are removed or reordered before the first save", () => {
  const reordered = [{ id: "P4", text: "First remaining outcome" }, { id: "P2", text: "Second remaining outcome" }];
  assert.deepEqual(initialContributionMatrix({ contributionMatrix: legacy }, reordered, "Taslak"), [{ P4: 4, P2: 2 }]);
  const saved = { contributionMatrix: [{ P4: 5, P2: 1 }], programOutcomes: reordered };
  assert.deepEqual(initialContributionMatrix(saved, reordered.toReversed(), "Taslak"), saved.contributionMatrix);
});

test("saving a program-outcome snapshot ends positional suggestions, even after clearing cells or changing the program", () => {
  for (const contributionMatrix of [[{ "pc-2": 5 }], [{}], []]) {
    const stored = { contributionMatrix, programOutcomes: outcomes(11) };
    assert.deepEqual(initialContributionMatrix(stored, outcomes(12).reverse(), "Taslak", legacy), contributionMatrix);
  }
  assert.deepEqual(initialContributionMatrix({ programOutcomes: [] }, outcomes(11), "Taslak", legacy), []);
});

test("reviewed and approved packages never receive positional suggestions", () => {
  for (const status of ["Yayımlandı", "Yayınlandı", "Public", "Onaylandı", "Komisyon Onayı Bekliyor", "ABD Son Onayı Bekliyor", "İncelemede", "Düzeltme İstendi"]) {
    assert.deepEqual(initialContributionMatrix({ contributionMatrix: legacy }, outcomes(12), status), legacy, status);
  }
});

test("a missing legacy matrix can use preserved course defaults, but an explicitly empty matrix stays empty", () => {
  assert.equal(initialContributionMatrix(null, outcomes(7), "Taslak", legacy)[0]["pc-1"], 4);
  assert.deepEqual(initialContributionMatrix({ contributionMatrix: [] }, outcomes(7), "Taslak", legacy), []);
  assert.deepEqual(initialContributionMatrix({ contributionMatrix: [null, { P1: 0, P2: 6, P3: 3 }] }, outcomes(3), "Taslak"), [{}, { "pc-3": 3 }]);
});

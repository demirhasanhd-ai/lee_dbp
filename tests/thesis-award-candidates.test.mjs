import test from "node:test";
import assert from "node:assert/strict";

import {
  isThesisAwardCandidate,
  thesisAwardCandidateCounts,
  thesisAwardCandidateYears,
} from "../lib/thesisAwardCandidates.mjs";

test("loads only the thesis-award candidates selected in the supplied workbook", () => {
  assert.deepEqual(thesisAwardCandidateYears, [2023, 2024, 2025]);
  assert.deepEqual(thesisAwardCandidateCounts, { 2023: 22, 2024: 23, 2025: 23 });
  assert.equal(isThesisAwardCandidate({ publicationYear: 2023, yokThesisId: "792342" }), true);
  assert.equal(isThesisAwardCandidate({ publicationYear: 2023, yokThesisId: "999999" }), false);
  assert.equal(isThesisAwardCandidate({ publicationYear: 2022, yokThesisId: "792342" }), false);
});

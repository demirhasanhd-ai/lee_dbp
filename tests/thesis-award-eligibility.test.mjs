import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";
import vm from "node:vm";
import {
  calculateAutomaticPublicationActivity, calculateAutomaticJuryRubric, degreeGroup, juryCriteria,
} from "../lib/thesisBibliometrics.mjs";
import {
  isThesisAwardCandidate, thesisAwardCandidateCounts, thesisAwardCandidateSource, thesisAwardCandidateYears,
} from "../lib/thesisAwardCandidates.mjs";
import { scientificFieldForDepartment } from "../lib/thesisPublicationMatcher.mjs";
import { displayDepartment } from "../lib/thesisSdg.mjs";
import { createThesisAwardPublicationFilter } from "../lib/thesisAwardPublications.mjs";

const source = readFileSync(new URL("../server.mjs", import.meta.url), "utf8");
const thesis = {
  identifier: "award-thesis", yokThesisId: "792342", publicationYear: 2023,
  title: "Energy research", authors: ["Person, Student"], advisors: ["Name, Advisor"],
  department: "Makine Mühendisliği ABD", degreeType: "Doctoral Thesis",
};

function fixture(t) {
  const db = new DatabaseSync(":memory:");
  t.after(() => db.close());
  for (const table of ["thesis_publications", "thesis_academic_activities", "thesis_jury_evaluations"]) {
    const schema = source.match(new RegExp(`CREATE TABLE IF NOT EXISTS ${table} \\([\\s\\S]*?\\n    \\);`));
    assert.ok(schema, table);
    db.exec(schema[0]);
  }
  const context = vm.createContext({
    db, currentThesisSnapshot: () => ({ records: [thesis] }),
    isThesisAwardCandidate, thesisAwardCandidateCounts, thesisAwardCandidateSource, thesisAwardCandidateYears,
    calculateAutomaticPublicationActivity, calculateAutomaticJuryRubric, degreeGroup, juryCriteria,
    scientificFieldForDepartment, displayDepartment,
    createThesisAwardPublicationFilter, metadataJson: (key, fallback) => fallback,
    normalizePublicRouteSegment: (value) => String(value).toLowerCase(),
    parseJsonField: (value, fallback) => value ? JSON.parse(value) : fallback,
  });
  vm.runInContext(source.match(/^function adminThesisAwardPayload\([^\n]*\) \{[\s\S]*?^\}/m)[0], context);
  const insert = ({ status, title, doi = title, scopus = 1, trdizin = 0, citations = 3 }) => {
    db.prepare(`INSERT INTO thesis_publications (
      thesis_identifier, thesis_cohort_year, degree_type, department, publication_title, publication_year,
      publication_type, doi, relation_status, indexed_scopus, indexed_trdizin, authors_json,
      citation_count, created_at, updated_at
    ) VALUES (?, 2023, 'Doctoral Thesis', ?, ?, 2024, 'Article', ?, ?, ?, ?, ?, ?, 'now', 'now')`)
      .run(thesis.identifier, thesis.department, title, doi, status, scopus, trdizin,
        JSON.stringify(["Student Person", "Advisor Name"]), citations);
  };
  const payload = () => JSON.parse(JSON.stringify(context.adminThesisAwardPayload(2023)));
  return { db, insert, payload };
}

test("awards score advisor-confirmed and qualifying verified publications in both EK-1 and EK-2", (t) => {
  const { db, insert, payload } = fixture(t);
  for (let index = 0; index < 6; index += 1) {
    insert({ status: index < 2 ? "verified" : "advisor_confirmed", title: `Energy research article ${index}` });
  }
  for (const status of ["suggested", "under_review", "needs_evidence", "rejected"]) {
    insert({ status, title: `Excluded ${status}`, citations: 100 });
  }
  const mixed = payload();
  const candidate = mixed.candidates[0];
  assert.equal(candidate.publicationCount, 6);
  assert.equal(mixed.summary.publications, 6);
  assert.equal(candidate.automaticActivityCount, 6);
  assert.equal(candidate.automaticPublicationScore, 68.4);
  assert.equal(candidate.automaticCitationScore, 18);
  assert.equal(candidate.activityScore, 86.4);
  assert.equal(candidate.automaticJuryEvaluation.scores["9"], 5);
  assert.equal(candidate.automaticJuryEvaluation.scores["16"], 5);
  assert.equal(candidate.totalScore, candidate.activityScore + candidate.juryScore);
  assert.equal(mixed.rankings.find((row) => row.field === "Fen Bilimleri" && row.degree === "doctorate").candidates[0].totalScore, candidate.totalScore);
  assert.equal(db.prepare("SELECT count(*) AS count FROM thesis_publications WHERE relation_status='advisor_confirmed'").get().count, 4);

  db.exec("UPDATE thesis_publications SET relation_status='verified' WHERE relation_status='advisor_confirmed'");
  const verified = payload();
  assert.deepEqual(mixed.candidates, verified.candidates);
  assert.deepEqual(mixed.summary, verified.summary);
  assert.deepEqual(mixed.rankings, verified.rankings);
});

test("awards count a publication once across verified and advisor-confirmed source records", (t) => {
  const { insert, payload } = fixture(t);
  insert({ status: "verified", title: "Energy research shared article", doi: "10.1/shared" });
  insert({ status: "advisor_confirmed", title: "Energy research shared article", doi: "10.1/shared", scopus: 0, trdizin: 1 });
  const data = payload();
  const candidate = data.candidates[0];
  assert.equal(data.summary.publications, 1);
  assert.equal(candidate.publicationCount, 1);
  assert.equal(candidate.automaticActivityCount, 1);
  assert.equal(candidate.scopusCount, 1);
  assert.equal(candidate.trDizinCount, 1);
  assert.equal(candidate.activityScore, 14.4);
});

test("awards recheck stored verified rows and keep advisor decisions regardless of overlap", (t) => {
  const { db, insert, payload } = fixture(t);
  for (let index = 0; index < 4; index += 1) {
    insert({ status: "advisor_confirmed", title: `Advisor accepted article ${index}` });
  }
  for (let index = 0; index < 2; index += 1) {
    insert({ status: "verified", title: `Unrelated automatic article ${index}`, citations: 100 });
  }
  const candidate = payload().candidates[0];
  assert.equal(candidate.publicationCount, 4);
  assert.equal(candidate.automaticActivityCount, 4);
  assert.equal(candidate.automaticPublicationScore, 45.6);
  assert.equal(candidate.automaticCitationScore, 12);
  assert.equal(candidate.activityScore, 57.6);
  assert.equal(candidate.automaticJuryEvaluation.scores["9"], 5);
  assert.equal(candidate.automaticJuryEvaluation.scores["16"], 5);
  assert.equal(db.prepare("SELECT count(*) AS count FROM thesis_publications WHERE relation_status='verified'").get().count, 2);
});

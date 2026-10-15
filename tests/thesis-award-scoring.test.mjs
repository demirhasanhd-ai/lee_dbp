import test from "node:test";
import assert from "node:assert/strict";

import { calculateAutomaticPublicationActivity } from "../lib/thesisBibliometrics.mjs";

test("calculates automatic EK-1 publication and citation points from verified metadata", () => {
  const result = calculateAutomaticPublicationActivity([{
    publication_title: "Indexed thesis article",
    publication_type: "Article",
    authors_json: JSON.stringify(["Ayşe Yılmaz", "Mehmet Demir"]),
    indexed_scopus: 1,
    indexed_trdizin: 0,
    indexed_wos: 0,
    citation_count: 3,
  }], ["Yılmaz, Ayşe"]);

  assert.equal(result.publicationScore, 11.4);
  assert.equal(result.citationScore, 3);
  assert.equal(result.score, 14.4);
  assert.equal(result.items[0].activityCode, "1.1.2");
  assert.equal(result.items[0].authorPosition, 1);
});

test("does not treat an SCImago quartile as a WoS quartile without WoS evidence", () => {
  const result = calculateAutomaticPublicationActivity([{
    publication_title: "Scopus Q1 article",
    publication_type: "Article",
    authors_json: JSON.stringify(["Fatma Yılmaz", "Hande Demir", "Hasan Demir"]),
    indexed_scopus: 1,
    indexed_wos: 0,
    quartile: "Q1",
    citation_count: 0,
  }], ["Gültepe, Fatma"]);

  assert.equal(result.items[0].activityCode, "1.1.2");
  assert.equal(result.items[0].authorPosition, 1);
  assert.equal(result.publicationScore, 10.8);
});

test("uses the WoS quartile rule only when WoS is explicitly verified", () => {
  const result = calculateAutomaticPublicationActivity([{
    publication_title: "WoS Q1 article",
    publication_type: "Article",
    authors_json: JSON.stringify(["Advisor Name", "Student Person", "Coauthor Name"]),
    indexed_scopus: 1,
    indexed_wos: 1,
    quartile: "Q1",
  }], ["Person, Student"]);

  assert.equal(result.items[0].activityCode, "1.1.1-Q1");
  assert.equal(result.items[0].authorPosition, 2);
  assert.equal(result.publicationScore, 24);
});

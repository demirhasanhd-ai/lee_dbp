import assert from "node:assert/strict";
import test from "node:test";
import { createThesisAwardPublicationFilter } from "../lib/thesisAwardPublications.mjs";
import { thesisPublicationTopicEvidence } from "../lib/thesisPublicationMatcher.mjs";

const thesis = {
  title: "alpha beta gamma delta epsilon zeta theta kappa",
  keywords: ["lambda", "omicron", "sigma", "omega"],
};
const titleQuarter = "alpha beta planet rocket comet solar lunar orbit";
const unrelatedTitle = "planet rocket comet solar lunar orbit galaxy cosmos";
const row = (title, status = "verified") => ({
  publication_title: title, publication_year: 2024, relation_status: status,
});

test("verified award publications accept title coverage above 23% and reject 22.22%", () => {
  const qualifies = createThesisAwardPublicationFilter();
  const publication = { title: titleQuarter };
  const evidence = thesisPublicationTopicEvidence(thesis, publication);
  assert.equal(evidence.bestTitle.coverage, 0.25);
  assert.equal(qualifies(row(titleQuarter), thesis), true);
  const longerThesis = { title: `${thesis.title} iota`, keywords: thesis.keywords };
  const below = `${titleQuarter} quasar`;
  assert.equal(thesisPublicationTopicEvidence(longerThesis, { title: below }).bestTitle.coverage, 2 / 9);
  assert.equal(qualifies(row(below), longerThesis), false);
});

test("verified awards use source abstracts above 23% topic coverage even when the title fails", () => {
  const publication = { title: unrelatedTitle, year: 2024, doi: "10.1/topic", abstract: "alpha beta gamma quasar" };
  const qualifies = createThesisAwardPublicationFilter({ trDizin: { papers: [publication] } });
  const evidence = thesisPublicationTopicEvidence(thesis, publication);
  assert.equal(evidence.bestTitle.coverage, 0);
  assert.equal(evidence.topic.coverage, 0.25);
  assert.equal(qualifies({ ...row("Imported title"), doi: "10.1/TOPIC" }, thesis), true);
  assert.equal(qualifies(row(unrelatedTitle), thesis), true, "title/year lookup must work without a DOI");

  const longerThesis = { ...thesis, keywords: [...thesis.keywords, "iota"] };
  const above = { ...publication, abstract: `${publication.abstract} pulsar` };
  assert.equal(thesisPublicationTopicEvidence(longerThesis, above).topic.coverage, 3 / 13);
  assert.equal(createThesisAwardPublicationFilter({ scopus: [above] })(row(unrelatedTitle), longerThesis), true);
  const belowThesis = { ...longerThesis, keywords: [...longerThesis.keywords, "tau"] };
  const below = { ...above, abstract: `${above.abstract} nebula` };
  assert.equal(thesisPublicationTopicEvidence(belowThesis, below).topic.coverage, 3 / 14);
  assert.equal(createThesisAwardPublicationFilter({ scopus: [below] })(row(unrelatedTitle), belowThesis), false);
});

test("the 23% title and topic thresholds are inclusive", () => {
  const words = Array.from({ length: 100 }, (_, index) => `thesisword${index}`);
  const others = Array.from({ length: 100 }, (_, index) => `publicationword${index}`);
  for (const shared of [22, 23]) {
    const title = [...words.slice(0, shared), ...others.slice(shared)].join(" ");
    const titlePublication = { title, year: 2024, keywords: others.map((word) => `extra${word}`) };
    const titleThesis = { title: words.join(" "), keywords: words.map((word) => `extra${word}`) };
    const titleEvidence = thesisPublicationTopicEvidence(titleThesis, titlePublication);
    assert.equal(titleEvidence.bestTitle.coverage, shared / 100);
    assert.ok(titleEvidence.topic.coverage < 0.23);
    assert.equal(createThesisAwardPublicationFilter({ scopus: [titlePublication] })(row(title), titleThesis), shared === 23);

    const topicThesis = { title: words.slice(0, 8).join(" "), keywords: words.slice(8) };
    const topicPublication = { title: others.join(" "), year: 2024, keywords: words.slice(0, shared) };
    const topicEvidence = thesisPublicationTopicEvidence(topicThesis, topicPublication);
    assert.equal(topicEvidence.bestTitle.coverage, 0);
    assert.equal(topicEvidence.topic.coverage, shared / 100);
    assert.equal(createThesisAwardPublicationFilter({ scopus: [topicPublication] })(row(topicPublication.title), topicThesis), shared === 23);
  }
});

test("high coverage does not bypass the two-title-word or three-topic-word minimums", () => {
  const qualifies = createThesisAwardPublicationFilter();
  assert.equal(qualifies(row("alpha planet"), { title: "alpha beta" }), false);
  const publication = { title: "comet galaxy", year: 2024, keywords: ["alpha", "beta"] };
  assert.equal(createThesisAwardPublicationFilter({ scopus: [publication] })(row(publication.title), {
    title: "planet rocket", keywords: ["alpha", "beta"],
  }), false);
});

test("advisor confirmation bypasses topic checks and other statuses cannot qualify", () => {
  const qualifies = createThesisAwardPublicationFilter();
  assert.equal(qualifies(row(unrelatedTitle, "advisor_confirmed"), thesis), true);
  assert.equal(qualifies(row(unrelatedTitle), thesis), false);
  for (const status of ["rejected", "suggested", "under_review", "needs_evidence"]) {
    assert.equal(qualifies(row(titleQuarter, status), thesis), false, status);
  }
});

test("award topic evidence can come from either source for the same publication", () => {
  const trDizin = [{ title: unrelatedTitle, year: 2024, doi: "10.1/shared" }];
  const scopus = [{ title: unrelatedTitle, year: 2024, abstract: "alpha beta gamma quasar" }];
  const qualifies = createThesisAwardPublicationFilter({ trDizin, scopus });
  assert.equal(qualifies({ ...row(unrelatedTitle), doi: "10.1/shared" }, thesis), true);
});

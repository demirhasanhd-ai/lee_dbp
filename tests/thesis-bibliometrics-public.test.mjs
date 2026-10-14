import assert from "node:assert/strict";
import test from "node:test";
import { publicThesisBibliometrics } from "../lib/thesisBibliometrics.mjs";

const theses = [
  { identifier: "tez-1", title: "Batarya depolama", keywords: ["batarya"], department: "Enerji Sistemleri Mühendisliği ABD", degreeType: "Yüksek Lisans", publicationYear: 2023 },
  { identifier: "tez-2", title: "Spor yönetimi", keywords: ["spor"], department: "Beden Eğitimi ve Spor ABD", degreeType: "Doktora", publicationYear: 2023 },
  { identifier: "tez-3", title: "Hemşirelik bakımı", keywords: ["bakım"], department: "Hemşirelik ABD", degreeType: "Yüksek Lisans", publicationYear: 2024 },
];

const baseRow = {
  publication_type: "Makale",
  indexed_scopus: 0,
  indexed_trdizin: 0,
  indexed_wos: 0,
  funding_type: "none",
  funding_detail: "",
  quartile: "",
  sdg_json: "[]",
  citation_count: 0,
  international_collaboration: 0,
  updated_at: "2026-10-13T08:00:00.000Z",
};

test("uses suggested matches, excludes rejected matches and deduplicates publications", () => {
  const rows = [
    { ...baseRow, id: 1, thesis_identifier: "tez-1", thesis_cohort_year: 2023, department: "Enerji Sistemleri Mühendisliği ABD", degree_type: "Yüksek Lisans", publication_title: "Battery article", publication_year: 2024, doi: "10.1/shared", relation_status: "suggested", indexed_scopus: 1, quartile: "Q1", citation_count: 5, funding_type: "tubitak", international_collaboration: 1 },
    { ...baseRow, id: 2, thesis_identifier: "tez-2", thesis_cohort_year: 2023, department: "Beden Eğitimi ve Spor ABD", degree_type: "Doktora", publication_title: "Battery article", publication_year: 2024, doi: "10.1/shared", relation_status: "verified", citation_count: 3 },
    { ...baseRow, id: 3, thesis_identifier: "tez-3", thesis_cohort_year: 2024, department: "Hemşirelik ABD", degree_type: "Yüksek Lisans", publication_title: "Rejected article", publication_year: 2025, doi: "10.1/rejected", relation_status: "rejected", indexed_trdizin: 1 },
  ];

  const result = publicThesisBibliometrics(rows, { theses });

  assert.equal(result.summary.completedTheses, 3);
  assert.equal(result.summary.thesesWithPublication, 2);
  assert.equal(result.summary.uniquePublications, 1);
  assert.equal(result.summary.thesisPublicationLinks, 2);
  assert.equal(result.summary.qualifiedPublications, 1);
  assert.equal(result.citationPerformance.total.totalCitations, 5);
  assert.equal(result.international.total, 1);
  assert.equal(result.funding.find((item) => item.type === "tubitak")?.count, 1);
  assert.deepEqual(result.yearlyPublications, [{ year: 2024, total: 1, masters: 1, doctorates: 1 }]);
  assert.equal(result.fieldBreakdown.find((item) => item.field === "Fen Bilimleri")?.mastersPerformance.converted, 1);
});

test("uses the supplied ABD scientific-field classification", () => {
  const result = publicThesisBibliometrics([], { theses });
  const social = result.fieldBreakdown.find((item) => item.field === "Sosyal Bilimler");
  const health = result.fieldBreakdown.find((item) => item.field === "Sağlık Bilimleri");

  assert.equal(social?.theses, 1);
  assert.equal(health?.theses, 1);
});

test("applies year filters safely when their order is reversed", () => {
  const result = publicThesisBibliometrics([], { theses, yearFrom: 2024, yearTo: 2023 });
  assert.equal(result.summary.completedTheses, 3);
  assert.deepEqual(result.filters.years, [2023, 2024]);
});

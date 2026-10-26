import test from "node:test";
import assert from "node:assert/strict";

import { matchThesisPublications } from "../lib/thesisPublicationMatcher.mjs";

const okuAffiliation = [{ id: "60088374", name: "Osmaniye Korkut Ata University" }];

test("matches a 2023 doctoral thesis with accent-insensitive student and advisor names", () => {
  const matches = matchThesisPublications({
    theses: [{
      identifier: "thesis-ugur-acar",
      publicationYear: 2023,
      title: "Net sıfır enerjili binaların Türkiye iklim koşullarında uygulanabilirliğinin araştırılması",
      alternativeTitle: "Investigation of net zero energy buildings under Türkiye climate conditions",
      authors: ["Acar, Ugur"],
      advisors: ["Kaska, Onder"],
      department: "Makine Mühendisliği Ana Bilim Dalı",
      degreeType: "Doctoral Thesis",
      sdg: [{ id: "7" }],
    }],
    scopus: [{
      id: "publication-1",
      title: "Performance of solar panels to achieve zero energy buildings in Türkiye climate conditions",
      year: 2022,
      authors: [{ name: "Uğur Acar" }, { name: "Önder Kaşka" }],
      affiliations: okuAffiliation,
      source: "Journal of Building Engineering",
      citedByCount: 12,
      sdgs: [{ id: "9" }],
    }],
  });

  assert.equal(matches.length, 1);
  assert.equal(matches[0].thesisIdentifier, "thesis-ugur-acar");
  assert.equal(matches[0].relationStatus, "verified");
  assert.deepEqual(matches[0].authors, ["Uğur Acar", "Önder Kaşka"]);
  assert.equal(matches[0].citationCount, 12);
  assert.deepEqual(matches[0].sdgs, ["7", "9"]);

  const withoutOkuAddress = matchThesisPublications({
    theses: [{
      identifier: "thesis-ugur-acar",
      publicationYear: 2023,
      title: "Net sıfır enerjili binaların Türkiye iklim koşullarında uygulanabilirliğinin araştırılması",
      alternativeTitle: "Investigation of net zero energy buildings under Türkiye climate conditions",
      authors: ["Acar, Ugur"],
      advisors: ["Kaska, Onder"],
    }],
    scopus: [{
      id: "publication-1",
      title: "Performance of solar panels to achieve zero energy buildings in Türkiye climate conditions",
      year: 2022,
      authors: [{ name: "Uğur Acar" }, { name: "Önder Kaşka" }],
      affiliations: [],
    }],
  });
  assert.equal(withoutOkuAddress.length, 0);
});

test("matches the explicitly verified Fatma Gültepe and Fatma Yılmaz identity", () => {
  const matches = matchThesisPublications({
    theses: [{
      identifier: "thesis-fatma-gultepe",
      publicationYear: 2023,
      title: "Salamura kapari meyvelerinin farklı yöntemler ile kurutulmasının incelenmesi",
      alternativeTitle: "Investigation of drying caper fruits with different methods",
      keywords: ["Food Engineering"],
      authors: ["Gültepe, Fatma"],
      advisors: ["Demir, Hande", "Demir, Hasan"],
      department: "Gıda Mühendisliği Ana Bilim Dalı",
      degreeType: "Master Thesis",
    }],
    scopus: [{
      id: "publication-2",
      title: "Optimization of Caper Drying Using Response Surface Methodology and Artificial Neural Networks for Energy Efficiency Characteristics",
      year: 2023,
      authors: [{ name: "Fatma Yılmaz" }, { name: "Hande Demir" }, { name: "Hasan Demir" }],
      affiliations: okuAffiliation,
      source: "Energies",
    }],
  });

  assert.equal(matches.length, 1);
  assert.equal(matches[0].thesisIdentifier, "thesis-fatma-gultepe");
  assert.equal(matches[0].relationStatus, "verified");
});

test("matches Fatma Gültepe with the ASCII Scopus form Yilmaz F.", () => {
  const matches = matchThesisPublications({
    theses: [{
      identifier: "thesis-fatma-gultepe-scopus",
      publicationYear: 2023,
      title: "Salamura kapari meyvelerinin farklı yöntemler ile kurutulmasının incelenmesi",
      alternativeTitle: "Investigation of drying caper fruits with different methods",
      keywords: ["Food Engineering"],
      authors: ["Gültepe, Fatma"],
      advisors: ["Demir, Hande", "Demir, Hasan"],
      department: "Gıda Mühendisliği Ana Bilim Dalı",
      degreeType: "Master Thesis",
    }],
    scopus: [{
      id: "publication-fatma-yilmaz-initials",
      title: "Optimization of Caper Drying Using Response Surface Methodology and Artificial Neural Networks for Energy Efficiency Characteristics",
      year: 2023,
      authors: [{ name: "Demir H." }, { name: "Demir H." }, { name: "Yilmaz F." }],
      affiliations: okuAffiliation,
      source: "Energies",
    }],
  });

  assert.equal(matches.length, 1);
  assert.equal(matches[0].thesisIdentifier, "thesis-fatma-gultepe-scopus");
  assert.equal(matches[0].relationStatus, "verified");
});

test("rejects publications when thesis and publication topics do not match", () => {
  const matches = matchThesisPublications({
    theses: [{
      identifier: "thesis-ugur-acar-low-topic",
      publicationYear: 2023,
      title: "Net sıfır enerjili binaların Türkiye iklim koşullarında uygulanabilirliğinin araştırılması",
      authors: ["Acar, Uğur"],
      advisors: ["Kaşka, Önder"],
    }],
    scopus: [{
      id: "publication-building-envelope",
      title: "Multi-objective optimization of building envelope components at the preliminary design stage for residential buildings in Turkey",
      year: 2021,
      authors: [{ name: "Acar U." }, { name: "Kaska O." }, { name: "Tokgoz N." }],
      affiliations: okuAffiliation,
    }],
  });

  assert.equal(matches.length, 0);
});

test("rejects publications when the thesis advisor is not a co-author", () => {
  const matches = matchThesisPublications({
    theses: [{
      identifier: "thesis-student-only",
      publicationYear: 2024,
      title: "Yerel yönetimlerde dijital dönüşüm uygulamaları",
      authors: ["Yılmaz, Ayşe"],
      advisors: ["Demir, Mehmet"],
    }],
    scopus: [{
      id: "publication-student-only",
      title: "A policy note from municipal practice",
      year: 2025,
      authors: [{ name: "Ayşe Yılmaz" }],
      affiliations: [],
    }],
  });

  assert.equal(matches.length, 0);
});

test("does not create candidates when the thesis student is absent", () => {
  const matches = matchThesisPublications({
    theses: [{
      identifier: "thesis-missing-student",
      publicationYear: 2023,
      title: "Salamura kapari meyvelerinin kurutulması",
      authors: ["Gültepe, Fatma"],
      advisors: ["Demir, Hande"],
    }],
    scopus: [{
      id: "publication-with-advisor-only",
      title: "Optimization of caper drying",
      year: 2024,
      authors: [{ name: "Hande Demir" }],
      affiliations: okuAffiliation,
    }],
  });

  assert.equal(matches.length, 0);
});

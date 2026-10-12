import test from "node:test";
import assert from "node:assert/strict";

import { matchThesisPublications } from "../lib/thesisPublicationMatcher.mjs";

const okuAffiliation = [{ id: "60088374", name: "Osmaniye Korkut Ata University" }];

test("matches a 2023 doctoral thesis with the student and advisor as publication authors", () => {
  const matches = matchThesisPublications({
    theses: [{
      identifier: "thesis-ugur-acar",
      publicationYear: 2023,
      title: "Net sıfır enerjili binaların Türkiye iklim koşullarında uygulanabilirliğinin araştırılması",
      alternativeTitle: "Investigation of net zero energy buildings under Türkiye climate conditions",
      authors: ["Acar, Uğur"],
      advisors: ["Kaşka, Önder"],
      department: "Makine Mühendisliği Ana Bilim Dalı",
      degreeType: "Doctoral Thesis",
    }],
    scopus: [{
      id: "publication-1",
      title: "Performance of solar panels to achieve zero energy buildings in Türkiye climate conditions",
      year: 2022,
      authors: [{ name: "Uğur Acar" }, { name: "Önder Kaşka" }],
      affiliations: okuAffiliation,
      source: "Journal of Building Engineering",
    }],
  });

  assert.equal(matches.length, 1);
  assert.equal(matches[0].thesisIdentifier, "thesis-ugur-acar");
});

test("matches the explicitly verified Fatma Gültepe and Fatma Yılmaz identity", () => {
  const matches = matchThesisPublications({
    theses: [{
      identifier: "thesis-fatma-gultepe",
      publicationYear: 2023,
      title: "Salamura kapari meyvelerinin farklı yöntemler ile kurutulmasının incelenmesi",
      alternativeTitle: "Investigation of drying caper fruits with different methods",
      keywords: ["caper", "drying", "energy efficiency"],
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
});

test("does not infer a changed surname without strong topic evidence", () => {
  const matches = matchThesisPublications({
    theses: [{
      identifier: "thesis-unrelated",
      publicationYear: 2023,
      title: "Salamura kapari meyvelerinin kurutulması",
      authors: ["Gültepe, Fatma"],
      advisors: ["Demir, Hande"],
    }],
    scopus: [{
      id: "publication-unrelated",
      title: "A completely unrelated study on building materials",
      year: 2024,
      authors: [{ name: "Fatma Yılmaz" }, { name: "Hande Demir" }],
      affiliations: okuAffiliation,
    }],
  });

  assert.equal(matches.length, 0);
});

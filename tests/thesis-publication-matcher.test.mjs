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

test("accepts the Uğur Acar 2022 meteorological-year publication at the award thresholds", () => {
  const matches = matchThesisPublications({
    theses: [{
      identifier: "thesis-ugur-acar-award",
      publicationYear: 2023,
      title: "Net sıfır enerjili binaların Türkiye iklim koşullarında uygulanabilirliğinin araştırılması",
      alternativeTitle: "Investigation of applicability of net zero energy buildings under the climate conditions of Türkiye",
      keywords: ["Mühendislik Bilimleri", "Engineering Sciences"],
      authors: ["Acar, Uğur"],
      advisors: ["Kaşka, Önder"],
      department: "Makine Mühendisliği Ana Bilim Dalı",
      degreeType: "Doctoral Thesis",
    }],
    trDizin: [{
      id: "1173510",
      title: "The effects of different typical meteorological year data on the heating and cooling demand of buildings: Case study of Turkiye",
      abstract: "Weather data affects building energy analysis. Heating and cooling demands of buildings are compared for different climate files in Türkiye using Energyplus.",
      year: 2022,
      authors: [
        { name: "Önder KAŞKA", institutions: ["Osmaniye Korkut Ata Üniversitesi"] },
        { name: "Ugur Acar", institutions: ["Türkiye Cumhuriyeti Çevre ve Şehircilik Bakanlığı"] },
      ],
      institutions: ["OSMANİYE KORKUT ATA ÜNİVERSİTESİ"],
      journalName: "Journal of Thermal Engineering",
      doi: "10.18186/thermal.1191087",
    }],
  });

  assert.equal(matches.length, 1);
  assert.equal(matches[0].thesisIdentifier, "thesis-ugur-acar-award");
  assert.equal(matches[0].indexedTrdizin, true);
});

test("assigns Mustafa İsmet Başboğa's 2022 publication only to his matching 2021 master's thesis", () => {
  const matches = matchThesisPublications({
    theses: [{
      identifier: "thesis-basboga-master-2021",
      publicationYear: 2021,
      title: "İşyeri mutluluğu ve iş tatmini ilişkisinde algılanan örgütsel desteğin aracı rolünün belirlenmesi",
      keywords: ["İşyeri Mutluluğu", "İş Tatmini", "Algılanan Örgütsel Destek"],
      authors: ["Başboğa, Mustafa İsmet"],
      advisors: ["Kara, Ergün"],
      degreeType: "Master Thesis",
    }, {
      identifier: "thesis-basboga-doctorate-2025",
      publicationYear: 2025,
      title: "Göçmen girişimcilerin girişimcilik eğilimi ve yenilikçi iş davranışı ilişkisinde bilinçli farkındalığın aracı rolü",
      keywords: ["İş davranışı", "Aracı rol"],
      authors: ["Başboğa, Mustafa İsmet"],
      advisors: ["Kara, Ergün"],
      degreeType: "Doctoral Thesis",
    }],
    trDizin: [{
      id: "basboga-workplace-happiness-2022",
      title: "İşyeri Mutluluğu ve İş Tatmini İlişkisinde Algılanan Örgütsel Desteğin Aracı Rolünün Belirlenmesi",
      abstract: "İşyeri mutluluğu, iş tatmini ve algılanan örgütsel destek ilişkisi incelenmiştir.",
      year: 2022,
      authors: [
        { name: "Mustafa İsmet Başboğa", institutions: ["Osmaniye Korkut Ata Üniversitesi"] },
        { name: "Ergün Kara", institutions: ["Osmaniye Korkut Ata Üniversitesi"] },
      ],
      institutions: ["Osmaniye Korkut Ata Üniversitesi"],
      journalName: "Mehmet Akif Ersoy Üniversitesi İktisadi ve İdari Bilimler Fakültesi Dergisi",
    }],
  });

  assert.equal(matches.length, 1);
  assert.equal(matches[0].thesisIdentifier, "thesis-basboga-master-2021");
  assert.equal(matches[0].degreeType, "Master Thesis");
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

test("requires the student, main advisor and every co-advisor in the same publication", () => {
  const thesis = {
    identifier: "thesis-with-co-advisor",
    publicationYear: 2024,
    title: "Enerji sistemlerinde hidrojen depolama performansının incelenmesi",
    keywords: ["hidrojen", "enerji", "depolama"],
    authors: ["Örnek, Ayşe"],
    advisors: ["Danışman, Mehmet", "Eşdanışman, Selin"],
  };
  const publication = {
    id: "publication-with-only-main-advisor",
    title: "Hidrojen enerji sistemlerinde depolama performansı",
    year: 2025,
    authors: [{ name: "Ayşe Örnek" }, { name: "Mehmet Danışman" }],
    affiliations: okuAffiliation,
  };

  assert.equal(matchThesisPublications({ theses: [thesis], scopus: [publication] }).length, 0);

  publication.authors.push({ name: "Selin Eşdanışman" });
  assert.equal(matchThesisPublications({ theses: [thesis], scopus: [publication] }).length, 1);
});

test("does not use one abbreviated publication author for two thesis advisors", () => {
  const thesis = {
    identifier: "thesis-two-demir-advisors",
    publicationYear: 2023,
    title: "Kapari meyvelerinin enerji verimli kurutulması",
    keywords: ["kapari", "kurutma", "enerji"],
    authors: ["Gültepe, Fatma"],
    advisors: ["Demir, Hande", "Demir, Hasan"],
  };
  const publication = {
    id: "publication-one-demir-initial",
    title: "Kapari kurutma yöntemlerinin enerji performansı",
    year: 2023,
    authors: [{ name: "Yilmaz F." }, { name: "Demir H." }],
    affiliations: okuAffiliation,
  };

  assert.equal(matchThesisPublications({ theses: [thesis], scopus: [publication] }).length, 0);

  publication.authors.push({ name: "Demir H." });
  assert.equal(matchThesisPublications({ theses: [thesis], scopus: [publication] }).length, 1);
});

test("matches Turkish dotless ı against ASCII i in abbreviated author names", () => {
  const matches = matchThesisPublications({
    theses: [{
      identifier: "thesis-turkish-dotless-i",
      publicationYear: 2025,
      title: "Hidrojen depolama malzemelerinin hesaplamalı incelenmesi",
      keywords: ["hidrojen", "depolama", "malzeme"],
      authors: ["Çavdar, Nuran"],
      advisors: ["Arıkan, Nihat", "Al, Selgin"],
    }],
    scopus: [{
      id: "publication-ascii-arikan",
      title: "Hidrojen depolama malzemelerinin hesaplamalı incelenmesi",
      year: 2025,
      authors: [{ name: "Cavdar N." }, { name: "Arikan N." }, { name: "Al S." }],
      affiliations: okuAffiliation,
    }],
  });

  assert.equal(matches.length, 1);
});

test("matches a compound advisor surname in abbreviated index form", () => {
  const matches = matchThesisPublications({
    theses: [{
      identifier: "thesis-compound-advisor-surname",
      publicationYear: 2024,
      title: "Investigation of citron and sweet orange peels as herbal tea",
      authors: ["Güneşli, Aysima"],
      advisors: ["Süfer, Özge", "Özkan Karabacak, Azime"],
    }],
    scopus: [{
      id: "publication-compound-advisor-surname",
      title: "Investigation of citron and sweet orange peels as herbal tea",
      year: 2026,
      authors: [{ name: "Süfer Ö." }, { name: "Özkan Karabacak A." }, { name: "Güneşli A." }],
      affiliations: okuAffiliation,
    }],
  });

  assert.equal(matches.length, 1);
});

test("does not confuse Ali Mücahit Kaya with Attila Kaya or the incomplete Kaya A. index form", () => {
  const thesis = {
    identifier: "thesis-ali-mucahit-kaya",
    publicationYear: 2025,
    title: "İşyeri nezaketsizliği ile işe yabancılaşma ilişkisinde örgütsel sinizmin aracı rolü",
    alternativeTitle: "The Mediating Role of Organizational Identification in the Effect of Perceived Organizational Support on Employee Performance",
    keywords: ["işyeri", "örgütsel", "çalışan"],
    authors: ["Kaya, Ali Mücahit"],
    advisors: ["Kara, Ergün"],
  };
  const publication = {
    id: "publication-attila-kaya",
    title: "The Mediating Role of Organizational Identification in the Effect of Perceived Organizational Support on Employee Performance",
    year: 2021,
    authors: [{ name: "Ergün Kara" }, { name: "Attila Kaya" }],
    affiliations: okuAffiliation,
    keywords: ["organizational", "employee", "performance"],
  };

  assert.equal(matchThesisPublications({ theses: [thesis], scopus: [publication] }).length, 0);

  publication.authors[1] = { id: "59012441600", name: "Kaya A." };
  assert.equal(matchThesisPublications({ theses: [thesis], scopus: [publication] }).length, 0);

  publication.authors[1] = { name: "Kaya A.M." };
  assert.equal(matchThesisPublications({ theses: [thesis], scopus: [publication] }).length, 1);
});

test("uses a source-verified full name when a Scopus author entry omits the given-name initial", () => {
  const matches = matchThesisPublications({
    theses: [{
      identifier: "thesis-omer-kenan",
      publicationYear: 2023,
      title: "Torpido benzeri geometriler etrafındaki akış yapılarının incelenmesi",
      alternativeTitle: "Investigation of flow characteristics around a blunt nose and conical stern geometry with single and tandem arrangements",
      keywords: ["torpido", "akış", "geometri"],
      authors: ["Kenan, Ömer"],
      advisors: ["Yanıktepe, Bülent", "Özgören, Muammer"],
    }],
    scopus: [{
      id: "publication-omer-kenan",
      title: "Investigation of flow characteristics around a blunt nose and conical stern geometry with single and tandem arrangements",
      year: 2022,
      authors: [
        { id: "59485602900", name: "Kenan" },
        { name: "Yaniktepe B." },
        { name: "Özgören M." },
      ],
      affiliations: okuAffiliation,
      keywords: ["flow", "torpedo", "geometry"],
    }],
  });

  assert.equal(matches.length, 1);
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

const STOP_WORDS = new Set([
  "ve", "veya", "ile", "icin", "için", "bir", "bu", "the", "of", "in", "on", "to", "and", "for", "using",
  "analysis", "study", "investigation", "evaluation", "effect", "effects", "determination", "examination",
  "analizi", "incelenmesi", "arastirilmasi", "araştırılması", "belirlenmesi", "degerlendirilmesi", "değerlendirilmesi",
  "uzerine", "üzerine", "etkisi", "etkisinin", "yontemi", "yöntemi", "calismasi", "çalışması",
]);

export function normalizeMatchText(value = "") {
  return String(value)
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9çğıöşü\s]/giu, " ")
    .replace(/\s+/gu, " ")
    .trim();
}

function meaningfulTokens(value) {
  return new Set(normalizeMatchText(value).split(" ").filter((token) => token.length > 2 && !STOP_WORDS.has(token)));
}

function overlap(left, right) {
  const a = meaningfulTokens(left);
  const b = meaningfulTokens(right);
  const shared = [...a].filter((token) => b.has(token));
  return {
    shared,
    jaccard: shared.length / Math.max(1, new Set([...a, ...b]).size),
    coverage: shared.length / Math.max(1, Math.min(a.size, b.size)),
  };
}

function personParts(value = "") {
  const raw = String(value).replace(/\b(?:prof|doç|doc|dr|öğr|ogr|üyesi|uyesi)\.?\b/giu, " ").trim();
  const [beforeComma, afterComma = ""] = raw.split(",");
  const surname = normalizeMatchText(afterComma ? beforeComma : raw.split(/\s+/u).at(-1));
  const given = normalizeMatchText(afterComma || raw.split(/\s+/u).slice(0, -1).join(" "));
  const initials = given.split(" ").filter(Boolean).map((item) => item[0]).join("");
  return { surname, initials };
}

function publicationPersonMatches(person, publicationAuthors = []) {
  const target = personParts(person);
  if (!target.surname) return false;
  return publicationAuthors.some((entry) => {
    const name = normalizeMatchText(typeof entry === "string" ? entry : entry?.name);
    const words = name.split(" ").filter(Boolean);
    if (!words.includes(target.surname)) return false;
    if (!target.initials) return true;
    const nonSurnameWords = words.filter((word) => word !== target.surname);
    return target.initials.split("").some((initial) => nonSurnameWords.some((word) => word.startsWith(initial)));
  });
}

function isOkuAddressed(source, publication) {
  if (source === "scopus") {
    return (publication.affiliations || []).some((item) => String(item?.id || "") === "60088374"
      || /osmaniye korkut ata/u.test(normalizeMatchText(item?.name)));
  }
  return (publication.institutions || []).some((item) => /osmaniye korkut ata/u.test(normalizeMatchText(item)))
    || (publication.authors || []).some((author) => (author?.institutions || []).some((item) => /osmaniye korkut ata/u.test(normalizeMatchText(item))));
}

function publicationIdentity(source, publication) {
  return `${source}:${publication.id || publication.doi || `${normalizeMatchText(publication.title)}:${publication.year}`}`;
}

function fundingType(publication) {
  const value = normalizeMatchText(`${(publication.fundingSponsors || []).join(" ")} ${(publication.fundingNumbers || []).join(" ")} ${publication.projectGroup || ""} ${publication.projectNumber || ""}`);
  if (/tubitak|tovag|eeeag|sobag|kbabag|caydag|sage|bideb/u.test(value)) return "tubitak";
  if (/bap|bilimsel arastirma projes/u.test(value)) return "bap";
  return value ? "other" : "unknown";
}

export function scientificFieldForDepartment(value = "") {
  const name = normalizeMatchText(value);
  if (/ebelik|hemsire|hemşire|saglik|sağlık|ic hastalik|iç hastalık|beden egitimi|beden eğitimi|spor bilim/u.test(name)) return "Sağlık Bilimleri";
  if (/kimya|biyoloji|fizik|matematik|muhendis|mühendis|enerji|batarya|gida|gıda|tarim|tarım|harita|cevre|çevre|malzeme|teknoloji/u.test(name)) return "Fen Bilimleri";
  if (/aile danisman|aile danışman|arkeoloji|iktisat|isletme|işletme|tarih|turk dili|türk dili|resim|siyaset|kamu yonetimi|kamu yönetimi|yonetim bilisim|yönetim bilişim|gastronomi|turizm|felsefe|ilahiyat|din bilim|muhasebe|finans/u.test(name)) return "Sosyal Bilimler";
  return "Atanamayan";
}

function candidateFor(thesis, publication, source) {
  const thesisYear = Number(thesis.publicationYear) || 0;
  const publicationYear = Number(publication.year) || 0;
  if (!publicationYear || publicationYear < thesisYear || publicationYear > new Date().getFullYear()) return null;
  if (!isOkuAddressed(source, publication)) return null;
  const authors = publication.authors || [];
  const student = (thesis.authors || []).find((person) => publicationPersonMatches(person, authors));
  const advisor = (thesis.advisors || []).find((person) => publicationPersonMatches(person, authors));
  if (!student || !advisor) return null;

  const titleMatches = [thesis.title, thesis.alternativeTitle].filter(Boolean).map((title) => overlap(title, publication.title));
  const bestTitle = titleMatches.sort((a, b) => b.coverage - a.coverage || b.jaccard - a.jaccard)[0] || { shared: [], coverage: 0, jaccard: 0 };
  const thesisTopics = `${thesis.title || ""} ${thesis.alternativeTitle || ""} ${(thesis.keywords || []).join(" ")}`;
  const publicationTopics = `${publication.title || ""} ${(publication.keywords || []).join(" ")} ${publication.abstract || ""}`;
  const topic = overlap(thesisTopics, publicationTopics);
  const topicMatched = (bestTitle.shared.length >= 2 && bestTitle.coverage >= 0.42)
    || (topic.shared.length >= 3 && topic.coverage >= 0.30);
  if (!topicMatched) return null;

  const confidence = Math.min(0.99, 0.55 + bestTitle.coverage * 0.25 + topic.coverage * 0.20);
  const sourceName = source === "scopus" ? "Scopus" : "TR Dizin";
  const journal = publication.source || publication.journalName || "";
  return {
    identity: publicationIdentity(source, publication),
    thesisIdentifier: thesis.identifier,
    thesisTitle: thesis.title || "",
    thesisCohortYear: thesisYear,
    degreeType: thesis.degreeType || "",
    department: thesis.department || "",
    scientificField: scientificFieldForDepartment(thesis.department),
    publicationTitle: publication.title,
    publicationYear,
    publicationType: publication.type || publication.publicationTypeLabel || publication.documentType || "",
    doi: publication.doi || "",
    source: journal ? `${sourceName} · ${journal}` : sourceName,
    indexedScopus: source === "scopus",
    indexedTrdizin: source === "trdizin",
    sdgs: (publication.sdgs || []).map((item) => String(item.id || item)).filter(Boolean),
    fundingType: fundingType(publication),
    fundingDetail: [...(publication.fundingSponsors || []), ...(publication.fundingNumbers || []), publication.projectGroup, publication.projectNumber].filter(Boolean).join(" · "),
    relationStatus: "verified",
    confidence: Math.round(confidence * 100) / 100,
    evidenceNote: `Kural doğrulaması: öğrenci (${student}) ve danışman (${advisor}) yayında birlikte yazar; tez-yayın konu örtüşmesi ${Math.round(Math.max(bestTitle.coverage, topic.coverage) * 100)}%; kaynak ${sourceName}.`,
  };
}

export function matchThesisPublications({ theses = [], scopus = [], trDizin = [] } = {}) {
  const activeTheses = theses.filter((thesis) => thesis.status !== "deleted" && thesis.identifier && thesis.publicationYear);
  const sources = [
    ...scopus.map((publication) => ({ source: "scopus", publication })),
    ...(Array.isArray(trDizin) ? trDizin : trDizin?.papers || []).map((publication) => ({ source: "trdizin", publication })),
  ];
  const sourcesBySurname = new Map();
  for (const entry of sources) {
    const surnames = new Set((entry.publication.authors || []).flatMap((author) => normalizeMatchText(typeof author === "string" ? author : author?.name).split(" ")).filter(Boolean));
    for (const surname of surnames) {
      const bucket = sourcesBySurname.get(surname) || [];
      bucket.push(entry);
      sourcesBySurname.set(surname, bucket);
    }
  }
  const matches = [];
  const seen = new Set();
  for (const thesis of activeTheses) {
    const studentSurname = personParts(thesis.authors?.[0] || "").surname;
    const candidates = studentSurname ? sourcesBySurname.get(studentSurname) || [] : [];
    for (const { source, publication } of candidates) {
      const candidate = candidateFor(thesis, publication, source);
      if (!candidate) continue;
      const key = `${thesis.identifier}|${candidate.doi || candidate.identity}`.toLocaleLowerCase("tr-TR");
      if (seen.has(key)) continue;
      seen.add(key);
      matches.push(candidate);
    }
  }
  return matches.sort((a, b) => a.publicationYear - b.publicationYear || b.confidence - a.confidence);
}

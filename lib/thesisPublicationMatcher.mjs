const STOP_WORDS = new Set([
  "ve", "veya", "ile", "icin", "için", "bir", "bu", "the", "of", "in", "on", "to", "and", "for", "using",
  "analysis", "study", "investigation", "evaluation", "effect", "effects", "determination", "examination",
  "analizi", "incelenmesi", "arastirilmasi", "araştırılması", "belirlenmesi", "degerlendirilmesi", "değerlendirilmesi",
  "uzerine", "üzerine", "etkisi", "etkisinin", "yontemi", "yöntemi", "calismasi", "çalışması",
]);

// Confirmed person-name changes. Keep this list explicit so people with the
// same given name are never merged by inference alone.
const VERIFIED_SURNAME_ALIASES = new Map([
  ["f|gultepe", "yilmaz"],
  ["f|yılmaz", "yilmaz"],
  ["f|yilmaz", "yilmaz"],
]);

// Scopus occasionally returns an incomplete indexed name even though the
// underlying publisher record exposes the full person name. Keep the very
// small set of source-verified corrections explicit; never infer these from a
// shared surname/initial. The Attila Kaya entry also prevents it from being
// confused with the 2025 graduate Ali Mücahit Kaya.
const VERIFIED_INDEX_AUTHOR_NAMES = new Map([
  ["59012441600", "Attila Kaya"],
  ["59485602900", "Ömer Kenan"],
]);

// OKU_ABD_Bilim_Alanlari.xlsx kaynağındaki kurumsal sınıflandırma.
const OKU_SCIENTIFIC_FIELDS = new Map([
  ["aile danismanligi ve egitimi", "Sosyal Bilimler"], ["arkeoloji", "Sosyal Bilimler"],
  ["batarya sistemleri ve hidrojen teknolojileri", "Fen Bilimleri"], ["beden egitimi ve spor", "Sosyal Bilimler"],
  ["biyoloji", "Fen Bilimleri"], ["ebelik", "Sağlık Bilimleri"], ["ekoturizm rehberligi", "Sosyal Bilimler"],
  ["elektrik elektronik muhendisligi", "Fen Bilimleri"], ["enerji sistemleri muhendisligi", "Fen Bilimleri"],
  ["felsefe ve din bilimleri", "Sosyal Bilimler"], ["fizik", "Fen Bilimleri"],
  ["gastronomi ve mutfak sanatlari", "Sosyal Bilimler"], ["gida muhendisligi", "Fen Bilimleri"],
  ["gida teknolojisi", "Fen Bilimleri"], ["harita muhendisligi", "Fen Bilimleri"],
  ["hemsirelik", "Sağlık Bilimleri"], ["insaat muhendisligi", "Fen Bilimleri"],
  ["iktisat", "Sosyal Bilimler"], ["isletme", "Sosyal Bilimler"], ["isletme bilim dali", "Sosyal Bilimler"],
  ["muhasebe ve finansman bilim dali", "Sosyal Bilimler"], ["yonetim ve organizasyon bilim dali", "Sosyal Bilimler"],
  ["kimya", "Fen Bilimleri"], ["makine muhendisligi", "Fen Bilimleri"], ["matematik", "Fen Bilimleri"],
  ["muhendislik ve teknoloji yonetimi", "Fen Bilimleri"], ["organik tarim isletmeciligi", "Sosyal Bilimler"],
  ["resim", "Sosyal Bilimler"], ["siyaset bilimi ve kamu yonetimi", "Sosyal Bilimler"],
  ["tarih", "Sosyal Bilimler"], ["temel islam bilimleri", "Sosyal Bilimler"],
  ["turk dili ve edebiyati", "Sosyal Bilimler"], ["yonetim bilisim sistemleri", "Sosyal Bilimler"],
]);

const OKU_DEPARTMENT_LABELS = new Map([
  ["aile danismanligi ve egitimi", "Aile Danışmanlığı ve Eğitimi ABD"],
  ["aile danismanligi", "Aile Danışmanlığı ve Eğitimi ABD"],
  ["arkeoloji", "Arkeoloji ABD"],
  ["batarya sistemleri ve hidrojen teknolojileri", "Batarya Sistemleri ve Hidrojen Teknolojileri ABD"],
  ["beden egitimi ve spor", "Beden Eğitimi ve Spor ABD"],
  ["beden egitimi spor", "Beden Eğitimi ve Spor ABD"],
  ["biyoloji", "Biyoloji ABD"],
  ["ebelik", "Ebelik ABD"],
  ["ekoturizm rehberligi", "Ekoturizm Rehberliği ABD"],
  ["elektrik elektronik muhendisligi", "Elektrik-Elektronik Mühendisliği ABD"],
  ["elektrik ve elektronik muhendisligi", "Elektrik-Elektronik Mühendisliği ABD"],
  ["enerji sistemleri muhendisligi", "Enerji Sistemleri Mühendisliği ABD"],
  ["enerji sistemleri", "Enerji Sistemleri Mühendisliği ABD"],
  ["enerji muhendisligi", "Enerji Sistemleri Mühendisliği ABD"],
  ["felsefe ve din bilimleri", "Felsefe ve Din Bilimleri ABD"],
  ["katihal fizigi", "Fizik ABD"],
  ["fizik", "Fizik ABD"],
  ["gastronomi ve mutfak sanatlari", "Gastronomi ve Mutfak Sanatları ABD"],
  ["gida muhendisligi", "Gıda Mühendisliği ABD"],
  ["gida teknolojisi", "Gıda Teknolojisi ABD"],
  ["harita muhendisligi", "Harita Mühendisliği ABD"],
  ["hemsirelik", "Hemşirelik ABD"],
  ["geoteknik", "İnşaat Mühendisliği ABD"],
  ["insaat muhendisligi", "İnşaat Mühendisliği ABD"],
  ["insaat", "İnşaat Mühendisliği ABD"],
  ["iktisat", "İktisat ABD"],
  ["muhasebe ve finansman", "Muhasebe ve Finansman Bilim Dalı"],
  ["yonetim ve organizasyon", "Yönetim ve Organizasyon Bilim Dalı"],
  ["isletme bilim dali", "İşletme Bilim Dalı"],
  ["isletme", "İşletme ABD"],
  ["anorganik kimya", "Kimya ABD"],
  ["kimya muhendisligi", "Kimya Mühendisliği ABD"],
  ["kimya", "Kimya ABD"],
  ["makine muhendisligi", "Makine Mühendisliği ABD"],
  ["matematik", "Matematik ABD"],
  ["muhendislik ve teknoloji yonetimi", "Mühendislik ve Teknoloji Yönetimi ABD"],
  ["organik tarim isletmeciligi", "Organik Tarım İşletmeciliği ABD"],
  ["resim", "Resim ASD"],
  ["siyaset bilimi ve kamu yonetimi", "Siyaset Bilimi ve Kamu Yönetimi ABD"],
  ["tarih", "Tarih ABD"],
  ["temel islam bilimleri", "Temel İslam Bilimleri ABD"],
  ["turk dili ve edebiyati egitimi", "Türk Dili ve Edebiyatı ABD"],
  ["turk halk edebiyati", "Türk Dili ve Edebiyatı ABD"],
  ["turk dili ve edebiyati", "Türk Dili ve Edebiyatı ABD"],
  ["yonetim bilisim sistemleri", "Yönetim Bilişim Sistemleri ABD"],
  ["yonetim bilimleri", "Yönetim Bilişim Sistemleri ABD"],
  ["yenilenebilir enerji teknolojileri ve yonetimi", "Enerji Sistemleri Mühendisliği ABD"],
]);

export function normalizeMatchText(value = "") {
  return String(value)
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/ı/gu, "i")
    .replace(/[^a-z0-9\s]/giu, " ")
    .replace(/\s+/gu, " ")
    .trim();
}

// Keep relation matching independent from the broader analytics normalizer.
// NFD makes c/ç, g/ğ, o/ö, s/ş and u/ü equivalent. Scopus/TR Dizin author
// forms frequently transliterate Turkish dotless ı as ASCII i, so normalise
// that pair as well (Uğur/Ugur, Kaşka/Kaska, Arıkan/Arikan, etc.).
function normalizeRelationText(value = "") {
  return String(value)
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/ı/gu, "i")
    .replace(/[^a-z0-9çğıöşü\s]/giu, " ")
    .replace(/\s+/gu, " ")
    .trim();
}

function meaningfulTokens(value) {
  return new Set(normalizeRelationText(value).split(" ").filter((token) => token.length > 2 && !STOP_WORDS.has(token)));
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
  const scopusStyle = raw.includes(",") ? null : raw.match(/^(.+?)\s+((?:[A-ZÇĞİÖŞÜ]\.?){1,5})$/u);
  if (scopusStyle) {
    // Retain compound surnames in abbreviated index forms such as
    // "Özkan Karabacak A." instead of reducing them to "Karabacak".
    const surname = normalizeRelationText(scopusStyle[1]);
    const initials = normalizeRelationText(scopusStyle[2]).replace(/\s+/gu, "");
    return { surname: VERIFIED_SURNAME_ALIASES.get(`${initials}|${surname}`) || surname, initials };
  }
  const [beforeComma, afterComma = ""] = raw.split(",");
  const surname = normalizeRelationText(afterComma ? beforeComma : raw.split(/\s+/u).at(-1));
  const given = normalizeRelationText(afterComma || raw.split(/\s+/u).slice(0, -1).join(" "));
  const initials = given.split(" ").filter(Boolean).map((item) => item[0]).join("");
  return { surname: VERIFIED_SURNAME_ALIASES.get(`${initials}|${surname}`) || surname, initials };
}

function personGivenNames(value = "") {
  const raw = String(value).replace(/\b(?:prof|doç|doc|dr|öğr|ogr|üyesi|uyesi)\.?\b/giu, " ").trim();
  const [beforeComma, afterComma = ""] = raw.split(",");
  if (afterComma) return normalizeRelationText(afterComma).split(" ").filter(Boolean);
  const scopusStyle = raw.match(/^(.+?)\s+((?:[A-ZÇĞİÖŞÜ]\.?){1,5})$/u);
  if (scopusStyle) return normalizeRelationText(scopusStyle[2]).replace(/\s+/gu, "").split("").filter(Boolean);
  return normalizeRelationText(raw).split(" ").filter(Boolean).slice(0, -1);
}

function publicationAuthorName(entry) {
  if (typeof entry === "string") return entry;
  const verified = VERIFIED_INDEX_AUTHOR_NAMES.get(String(entry?.id || ""));
  return verified || entry?.name || "";
}

function allGivenNamesRepresented(targetGivenNames, candidateWords) {
  if (!targetGivenNames.length) return true;
  const remaining = [...candidateWords];
  for (const givenName of targetGivenNames) {
    const exactIndex = remaining.findIndex((word) => word === givenName);
    const initialIndex = exactIndex >= 0 ? -1 : remaining.findIndex((word) => word.length === 1 && word === givenName[0]);
    const index = exactIndex >= 0 ? exactIndex : initialIndex;
    if (index < 0) return false;
    remaining.splice(index, 1);
  }
  return true;
}

function publicationAuthorMatchesPerson(person, entry) {
  const target = personParts(person);
  if (!target.surname) return false;
  const targetGivenNames = personGivenNames(person);
  const value = publicationAuthorName(entry);
  const name = normalizeRelationText(value);
  const words = name.split(" ").filter(Boolean);
  if (words.includes(target.surname)) {
    const nonSurnameWords = words.filter((word) => word !== target.surname);
    if (allGivenNamesRepresented(targetGivenNames, nonSurnameWords)) return true;
  }
  // Abbreviated index forms must contain every given-name initial. A single
  // "Kaya A." is not enough for "Ali Mücahit Kaya" and must never be treated
  // as the full "A.M." identity.
  const candidate = personParts(value);
  return candidate.surname === target.surname && (!target.initials || !candidate.initials
    || target.initials === candidate.initials);
}

function matchPeopleToDistinctPublicationAuthors(people = [], publicationAuthors = []) {
  const expectedPeople = people.map((person) => String(person || "").trim()).filter(Boolean);
  if (!expectedPeople.length || publicationAuthors.length < expectedPeople.length) return null;

  const candidates = expectedPeople.map((person, expectedIndex) => ({
    expectedIndex,
    authorIndexes: publicationAuthors
      .map((entry, authorIndex) => (publicationAuthorMatchesPerson(person, entry) ? authorIndex : -1))
      .filter((authorIndex) => authorIndex >= 0),
  })).sort((left, right) => left.authorIndexes.length - right.authorIndexes.length);
  if (candidates.some((item) => item.authorIndexes.length === 0)) return null;

  const assignments = Array(expectedPeople.length).fill(-1);
  const usedAuthorIndexes = new Set();
  function assign(candidateIndex) {
    if (candidateIndex >= candidates.length) return true;
    const candidate = candidates[candidateIndex];
    for (const authorIndex of candidate.authorIndexes) {
      if (usedAuthorIndexes.has(authorIndex)) continue;
      assignments[candidate.expectedIndex] = authorIndex;
      usedAuthorIndexes.add(authorIndex);
      if (assign(candidateIndex + 1)) return true;
      usedAuthorIndexes.delete(authorIndex);
      assignments[candidate.expectedIndex] = -1;
    }
    return false;
  }
  return assign(0) ? assignments : null;
}

function usesVerifiedSurnameChange(person = "") {
  const raw = String(person).trim();
  const [beforeComma, afterComma = ""] = raw.split(",");
  const originalSurname = normalizeRelationText(afterComma ? beforeComma : raw.split(/\s+/u).at(-1));
  const mapped = personParts(person);
  return Boolean(originalSurname && VERIFIED_SURNAME_ALIASES.has(`${mapped.initials}|${originalSurname}`));
}

function isOkuAddressed(source, publication) {
  if (source === "scopus") {
    return (publication.affiliations || []).some((item) => String(item?.id || "") === "60088374"
      || /osmaniye korkut ata/u.test(normalizeRelationText(item?.name)));
  }
  return (publication.institutions || []).some((item) => /osmaniye korkut ata/u.test(normalizeRelationText(item)))
    || (publication.authors || []).some((author) => (author?.institutions || []).some((item) => /osmaniye korkut ata/u.test(normalizeRelationText(item))));
}

function publicationIdentity(source, publication) {
  return `${source}:${publication.id || publication.doi || `${normalizeRelationText(publication.title)}:${publication.year}`}`;
}

function crossSourcePublicationIdentity(publication) {
  const doi = normalizeRelationText(publication.doi || "").replace(/\s+/gu, "");
  return doi || `${normalizeRelationText(publication.title)}:${Number(publication.year) || 0}`;
}

function studentIdentity(person = "") {
  const parts = personParts(person);
  const givenNames = personGivenNames(person);
  // Retain every given name. This keeps Mustafa İsmet Başboğa separate from
  // another Mustafa Başboğa while still tolerating the Turkish/ASCII forms
  // used by Scopus and TR Dizin.
  return `${parts.surname}|${givenNames.join(" ") || parts.initials}`;
}

function fundingType(publication) {
  const value = normalizeMatchText(`${(publication.fundingSponsors || []).join(" ")} ${(publication.fundingNumbers || []).join(" ")} ${publication.projectGroup || ""} ${publication.projectNumber || ""}`);
  if (/tubitak|tovag|eeeag|sobag|kbabag|caydag|sage|bideb/u.test(value)) return "tubitak";
  if (/bap|bilimsel arastirma projes/u.test(value)) return "bap";
  return value ? "other" : "unknown";
}

function citationCount(publication) {
  const value = Number(publication.citationCount ?? publication.citedByCount ?? publication.citedbyCount ?? publication.citations ?? 0);
  return Number.isFinite(value) && value > 0 ? Math.trunc(value) : 0;
}

function publicationCountries(publication) {
  const direct = Array.isArray(publication.countries) ? publication.countries : [];
  const authorCountries = (publication.authors || []).flatMap((author) => Array.isArray(author?.countries) ? author.countries : []);
  return [...new Set([...direct, ...authorCountries].map((item) => String(item?.name || item).trim()).filter(Boolean))];
}

export function scientificFieldForDepartment(value = "") {
  const name = normalizeMatchText(value).replace(/ı/gu, "i");
  const canonical = name
    .replace(/\b(?:ana bilim dali|anabilim dali|ana sanat dali|anasanat dali|abd|asd)\b/gu, " ")
    .replace(/\s+/gu, " ").trim();
  const exact = OKU_SCIENTIFIC_FIELDS.get(canonical);
  if (exact) return exact;
  const included = [...OKU_SCIENTIFIC_FIELDS.entries()].find(([department]) => canonical.includes(department) || department.includes(canonical));
  if (included) return included[1];
  if (/ebelik|hemsire|hemşire|saglik|sağlık|ic hastalik|iç hastalık/u.test(name)) return "Sağlık Bilimleri";
  if (/kimya|biyoloji|fizik|fizig|matematik|muhendis|enerji|batarya|gida|tarim|harita|cevre|malzeme|teknoloji|insaat|geoteknik/u.test(name)) return "Fen Bilimleri";
  if (/aile danisman|arkeoloji|beden egitimi|spor ana bilim|iktisat|isletme|tarih|turk dili|turk halk edebiyati|resim|siyaset|kamu yonetimi|yonetim bilisim|yonetim bilimleri|gastronomi|turizm|felsefe|ilahiyat|din bilim|muhasebe|finans/u.test(name)) return "Sosyal Bilimler";
  return "Atanamayan";
}

export function canonicalDepartmentName(value = "") {
  const name = normalizeMatchText(value).replace(/ı/gu, "i");
  const matches = [...OKU_DEPARTMENT_LABELS.entries()]
    .filter(([needle]) => name.includes(needle))
    .sort((left, right) => right[0].length - left[0].length);
  if (matches.length) return matches[0][1];
  return String(value || "").replace(/^.*?enstitusu\s*,?/iu, "").trim() || "ABD / ASD bilgisi yok";
}

function candidateFor(thesis, publication, source) {
  const thesisYear = Number(thesis.publicationYear) || 0;
  const publicationYear = Number(publication.year) || 0;
  // A publication produced during the thesis study can precede the formal
  // graduation/DSpace year. Relation evidence, not the publication year, decides.
  if (!publicationYear || publicationYear > new Date().getFullYear()) return null;
  if (!isOkuAddressed(source, publication)) return null;
  const authors = publication.authors || [];
  const advisors = (thesis.advisors || []).map((person) => String(person || "").trim()).filter(Boolean);
  if (!advisors.length) return null;
  let student = "";
  for (const candidateStudent of thesis.authors || []) {
    // The student, main advisor and every co-advisor must be represented by
    // separate author entries in the same publication. This prevents one
    // abbreviated author (for example "Demir H.") from satisfying two people.
    if (matchPeopleToDistinctPublicationAuthors([candidateStudent, ...advisors], authors)) {
      student = candidateStudent;
      break;
    }
  }
  if (!student) return null;

  const titleMatches = [thesis.title, thesis.alternativeTitle].filter(Boolean).map((title) => overlap(title, publication.title));
  const bestTitle = titleMatches.sort((a, b) => b.coverage - a.coverage || b.jaccard - a.jaccard)[0] || { shared: [], coverage: 0, jaccard: 0 };
  const thesisTopics = `${thesis.title || ""} ${thesis.alternativeTitle || ""} ${(thesis.keywords || []).join(" ")}`;
  const publicationTopics = `${publication.title || ""} ${(publication.keywords || []).join(" ")} ${publication.abstract || ""}`;
  const topic = overlap(thesisTopics, publicationTopics);
  const topicMatched = (bestTitle.shared.length >= 2 && bestTitle.coverage >= 0.20)
    || (topic.shared.length >= 3 && topic.coverage >= 0.12)
    // For an explicitly confirmed surname change, student + advisor + OKÜ
    // address already provide unusually strong identity evidence. Two distinct
    // subject tokens are sufficient to retain the confirmed thesis relation.
    || (usesVerifiedSurnameChange(student) && topic.shared.length >= 2);

  if (!topicMatched) return null;

  const confidence = Math.min(0.99, 0.55 + bestTitle.coverage * 0.25 + topic.coverage * 0.20);
  const sourceName = source === "scopus" ? "Scopus" : "TR Dizin";
  const journal = publication.source || publication.journalName || "";
  const thesisSdgs = (thesis.sdg || []).map((item) => String(item?.id || item)).filter(Boolean);
  const publicationSdgs = (publication.sdgs || []).map((item) => String(item?.id || item)).filter(Boolean);
  const countries = publicationCountries(publication);
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
    authors: authors.map((entry) => typeof entry === "string" ? entry : entry?.name).filter(Boolean),
    citationCount: citationCount(publication),
    countries,
    internationalCollaboration: countries.some((country) => !/^(?:turkey|turkiye|türkiye)$/u.test(normalizeMatchText(country))),
    indexedScopus: source === "scopus",
    indexedTrdizin: source === "trdizin",
    sdgs: [...new Set([...thesisSdgs, ...publicationSdgs])],
    fundingType: fundingType(publication),
    fundingDetail: [...(publication.fundingSponsors || []), ...(publication.fundingNumbers || []), publication.projectGroup, publication.projectNumber].filter(Boolean).join(" · "),
    // Öğrenci + danışman ortak yazarlığı, tez-yayın konu örtüşmesi ve OKÜ
    // adresi birlikte doğrulandığı için aday çalışma kitabında kullanılan
    // eşikler doğrulanmış ilişki üretir. Danışman sonradan reddedebilir.
    relationStatus: "verified",
    confidence: Math.round(confidence * 100) / 100,
    evidenceNote: `Kural doğrulaması: öğrenci (${student}) ile tez danışmanı/eş danışmanları (${advisors.join("; ")}) yayında birlikte yazar; tez-yayın konu örtüşmesi ${Math.round(Math.max(bestTitle.coverage, topic.coverage) * 100)}%; ${sourceName} kaydında OKÜ adresi görüldü.`,
    // Internal ranking evidence. A publication can weakly overlap a later
    // thesis of the same student as well as strongly overlap the thesis it was
    // actually produced from. matchThesisPublications uses these values to
    // keep the publication on only the best-fitting thesis.
    _studentIdentity: studentIdentity(student),
    _publicationIdentity: crossSourcePublicationIdentity(publication),
    _titleShared: bestTitle.shared.length,
    _titleCoverage: bestTitle.coverage,
    _topicShared: topic.shared.length,
    _topicCoverage: topic.coverage,
  };
}

function compareThesisFit(left, right) {
  return right._titleCoverage - left._titleCoverage
    || right._titleShared - left._titleShared
    || right._topicCoverage - left._topicCoverage
    || right._topicShared - left._topicShared
    || Math.abs(left.publicationYear - left.thesisCohortYear) - Math.abs(right.publicationYear - right.thesisCohortYear)
    || Number(right.thesisCohortYear <= right.publicationYear) - Number(left.thesisCohortYear <= left.publicationYear)
    || String(left.thesisIdentifier).localeCompare(String(right.thesisIdentifier), "tr");
}

function publicMatch(candidate) {
  const {
    _studentIdentity,
    _publicationIdentity,
    _titleShared,
    _titleCoverage,
    _topicShared,
    _topicCoverage,
    ...match
  } = candidate;
  return match;
}

export function matchThesisPublications({ theses = [], scopus = [], trDizin = [] } = {}) {
  const activeTheses = theses.filter((thesis) => thesis.status !== "deleted" && thesis.identifier && thesis.publicationYear);
  const sources = [
    ...scopus.map((publication) => ({ source: "scopus", publication })),
    ...(Array.isArray(trDizin) ? trDizin : trDizin?.papers || []).map((publication) => ({ source: "trdizin", publication })),
  ];
  const sourcesBySurname = new Map();
  for (const entry of sources) {
    const surnames = new Set((entry.publication.authors || []).flatMap((author) => {
      const value = typeof author === "string" ? author : author?.name;
      return [...normalizeRelationText(value).split(" "), personParts(value).surname];
    }).filter(Boolean));
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
  // A student may have both master's and doctorate theses. Do not attach one
  // publication to both merely because the author pair and a few broad topic
  // words overlap. Resolve each student + publication pair to the thesis with
  // the strongest title/topic evidence; year proximity is only a tie-breaker.
  const grouped = new Map();
  for (const candidate of matches) {
    const key = `${candidate._studentIdentity}|${candidate._publicationIdentity}`;
    const bucket = grouped.get(key) || [];
    bucket.push(candidate);
    grouped.set(key, bucket);
  }
  const resolved = [];
  for (const bucket of grouped.values()) {
    const best = [...bucket].sort(compareThesisFit)[0];
    for (const candidate of bucket) {
      if (candidate.thesisIdentifier === best.thesisIdentifier) resolved.push(publicMatch(candidate));
    }
  }
  return resolved.sort((a, b) => a.publicationYear - b.publicationYear || b.confidence - a.confidence);
}

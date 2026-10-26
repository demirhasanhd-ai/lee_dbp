import { canonicalDepartmentName, scientificFieldForDepartment } from "./thesisPublicationMatcher.mjs";

export const THESIS_EVALUATION_YEARS = Array.from(
  { length: Math.max(1, new Date().getFullYear() - 2022) },
  (_, index) => 2023 + index,
);

export const juryRubricSections = [
  {
    key: "A",
    title: "Özgünlük ve Yaratıcılık",
    criteria: [
      "Tezin problem durumu açık ve vurgulayıcı bir biçimde açıklanmıştır.",
      "Tezin araştırma konusu özgün, yaratıcı ve yenilikçi öneriler sunmaktadır.",
      "Tez disiplinler arası bilimsel bir içeriğe sahiptir.",
      "Tezin amacı açık bir dille ifade edilmiştir.",
      "Tez, problemin/ihtiyacın çözümü için uygulanabilir ve yaratıcı bir çözüm ortaya koymaktadır.",
      "Tezde sunulan öneriler özgün ve araştırma sonuçlarına dayalıdır.",
    ],
  },
  {
    key: "B",
    title: "Sürdürülebilirlik Yapılabilirlik ve Yaygın Etki Potansiyeli",
    criteria: [
      "Tezin araştırma konusu OKÜ'nün ihtisaslaşma alanına katkı sağlamaktadır.",
      "Tez, OKÜ stratejik planında yer alan Eğitim-Öğretim hedeflerine katkı sunmaktadır.",
      "Tez, OKÜ stratejik planında yer alan Araştırma-Geliştirme hedeflerine katkı sunmaktadır.",
      "Tez, OKÜ stratejik planında yer alan Toplumsal Katkı hedeflerine katkı sunmaktadır.",
      "Tez, OKÜ stratejik planında yer alan Liderlik Yönetim hedeflerine katkı sunmaktadır.",
      "Tez sosyal/çevresel/ekonomik etki analizi içermektedir.",
      "Sürdürülebilirlik göstergeleri veya metrikleri kullanılmıştır.",
      "Sonuçlar farklı bağlam ve kurumlara transfer edilebilir veya uygulanabilirdir.",
      "Araştırma, ulusal kalkınmaya uzun vadeli katkı potansiyeli taşımaktadır.",
      "Tez, nitelikli akademik yayın ve patent/tescil gibi çıktı üretme potansiyeline sahiptir.",
      "Tez, yeni tez ve projelerin üretilmesi potansiyeline sahiptir.",
      "Tez, ülkenin yurt dışına bağımlılığını azaltma veya rekabet gücünü artırma potansiyeline sahiptir.",
    ],
  },
  {
    key: "C",
    title: "BM Sürdürülebilir Kalkınma Amaçlarına Katkı Düzeyi",
    criteria: [
      "Yoksulluğun azaltılması ve gelir eşitsizliğiyle mücadele",
      "Gıda güvenliği, sürdürülebilir tarım ve beslenme",
      "Fiziksel ve ruhsal sağlık sistemleri",
      "Eğitimde erişim, kalite ve öğrenme çıktıları",
      "Cinsiyet eşitliği ve kadınların güçlenmesi",
      "Suya erişim, sanitasyon ve su yönetimi",
      "Yenilenebilir enerji ve enerji verimliliği",
      "İstihdam, iş kalitesi ve ekonomik büyüme",
      "Ar-Ge, altyapı, teknoloji ve inovasyon",
      "Gelir ve fırsat eşitsizliklerinin azaltılması",
      "Kentsel yaşam kalitesi, ulaşım ve afet direnci",
      "Döngüsel ekonomi, atık azaltımı ve sürdürülebilir tedarik",
      "İklim değişikliğiyle mücadele ve uyum",
      "Deniz ekosistemleri ve su biyoçeşitliliği",
      "Ormanlar, kara ekosistemleri ve biyoçeşitlilik",
      "Yönetişim, adalet, güvenlik ve kurumlar",
      "İş birlikleri ve çok paydaşlı ortaklıklar",
    ],
  },
];

export const juryCriteria = juryRubricSections.flatMap((section) =>
  section.criteria.map((label, index) => ({
    no: juryRubricSections
      .slice(0, juryRubricSections.findIndex((item) => item.key === section.key))
      .reduce((sum, item) => sum + item.criteria.length, 0) + index + 1,
    section: section.key,
    sectionTitle: section.title,
    label,
  })),
);

export const activityRuleOptions = [
  ["1.1.1-Q1", "WoS özgün araştırma makalesi Q1", 30, "tezden_uretilmis"],
  ["1.1.1-Q2", "WoS özgün araştırma makalesi Q2", 24, "tezden_uretilmis"],
  ["1.1.1-Q3", "WoS özgün araştırma makalesi Q3", 18, "tezden_uretilmis"],
  ["1.1.1-Q4", "WoS özgün araştırma makalesi Q4", 15, "tezden_uretilmis"],
  ["1.1.2", "ÜAK uluslararası alan indeksi makalesi", 12, "tezden_uretilmis"],
  ["1.1.3", "Uluslararası vaka/teknik not/editöre mektup vb.", 9, "tezden_uretilmis"],
  ["1.1.4", "Diğer uluslararası indeksli özgün makale", 6, "tezden_uretilmis"],
  ["1.2.1", "ULAKBİM/TR Dizin özgün araştırma makalesi", 5, "tezden_uretilmis"],
  ["1.2.2", "Ulusal hakemli dergide yayın", 2, "tezden_uretilmis"],
  ["1.2.3", "Diğer ulusal dergide yayın", 1, "tezden_uretilmis"],
  ["1.2.4", "Ulusal/uluslararası ansiklopedi maddesi", 2, "tezden_uretilmis", 5],
  ["2.1.1", "Uluslararası bilimsel kitap", 15, "tezden_uretilmis"],
  ["2.1.3", "Uluslararası bilimsel kitap bölümü", 8, "tezden_uretilmis", 2],
  ["2.2.1", "Ulusal bilimsel kitap", 10, "tezden_uretilmis"],
  ["2.2.3", "Ulusal bilimsel kitap bölümü", 3, "tezden_uretilmis", 2],
  ["3.1-TAM", "Uluslararası tam metin bildiri", 3, "tezden_uretilmis"],
  ["3.1-OZET", "Uluslararası özet/poster bildiri", 2, "tezden_uretilmis"],
  ["3.2-TAM", "Ulusal tam metin bildiri", 2, "tezden_uretilmis"],
  ["3.2-OZET", "Ulusal özet/poster bildiri", 1, "tezden_uretilmis"],
  ["4.1", "Uluslararası atıf", 1, "teze_veya_yayina_atif"],
  ["4.2", "Ulusal atıf", 0.5, "teze_veya_yayina_atif"],
  ["5.1", "Uluslararası destekli araştırma projesi", 45, "tez_ile_ilgili"],
  ["5.2-Y", "Bir yıldan uzun TÜBİTAK/UDAP/Bakanlık projesi yürütücü", 30, "tez_ile_ilgili"],
  ["5.2-A", "Bir yıldan uzun TÜBİTAK/UDAP/Bakanlık projesi araştırmacısı/bursiyeri", 24, "tez_ile_ilgili"],
  ["5.3-Y", "Bir yıl ve daha kısa TÜBİTAK/UDAP/Bakanlık projesi yürütücü", 15, "tez_ile_ilgili"],
  ["5.3-A", "Bir yıl ve daha kısa TÜBİTAK/UDAP/Bakanlık projesi araştırmacısı/bursiyeri", 10, "tez_ile_ilgili"],
  ["5.4-Y", "BAP/kalkınma ajansı projesi yürütücü", 10, "tez_ile_ilgili"],
  ["5.4-A", "BAP/kalkınma ajansı projesi araştırmacısı/bursiyeri", 5, "tez_ile_ilgili"],
  ["6.1-UZUN", "Yurt dışı araştırma faaliyeti (en az 3 ay)", 10, "tez_ile_ilgili"],
  ["6.1-KISA", "Yurt dışı araştırma faaliyeti (3 aydan kısa)", 5, "tez_ile_ilgili"],
  ["7.1.1", "Uluslararası sanat/tasarım etkinliğinde özgün eser", 20, "tez_ile_ilgili"],
  ["7.1.2", "Uluslararası sanat/tasarım etkinliğinde karma eser", 12, "tez_ile_ilgili"],
  ["7.1.3", "Uluslararası sanat/tasarım etkinliğinde özgün uygulama", 12, "tez_ile_ilgili"],
  ["7.1.4", "Uluslararası sanat/tasarım etkinliğinde karma uygulama", 10, "tez_ile_ilgili"],
  ["7.1.5", "Uluslararası sanat/tasarım etkinliğinde özgün dinleti/gösteri", 6, "tez_ile_ilgili"],
  ["7.1.6", "Uluslararası sanat/tasarım etkinliğinde karma dinleti/gösteri", 3, "tez_ile_ilgili"],
  ["7.2.1", "Ulusal sanat/tasarım etkinliğinde özgün eser", 10, "tez_ile_ilgili"],
  ["7.2.2", "Ulusal sanat/tasarım etkinliğinde karma eser", 8, "tez_ile_ilgili"],
  ["7.2.3", "Ulusal sanat/tasarım etkinliğinde özgün uygulama", 6, "tez_ile_ilgili"],
  ["7.2.4", "Ulusal sanat/tasarım etkinliğinde karma uygulama", 5, "tez_ile_ilgili"],
  ["7.2.5", "Ulusal sanat/tasarım etkinliğinde özgün dinleti/gösteri", 3, "tez_ile_ilgili"],
  ["7.2.6", "Ulusal sanat/tasarım etkinliğinde karma dinleti/gösteri", 2, "tez_ile_ilgili"],
  ["8.1", "Uluslararası bilim/sanat ödülü", 15, "tez_ile_ilgili"],
  ["8.2", "Ulusal bilim/sanat ödülü", 10, "tez_ile_ilgili"],
  ["8.3", "Üniversite bilim/sanat ödülü", 5, "tez_ile_ilgili"],
  ["8.4-BASVURU", "Uluslararası patent başvurusu", 30, "tez_ile_ilgili"],
  ["8.4-TESCIL", "Tescilli uluslararası patent", 40, "tez_ile_ilgili"],
  ["8.5-BASVURU", "Ulusal patent başvurusu", 20, "tez_ile_ilgili"],
  ["8.5-TESCIL", "Tescilli ulusal patent", 30, "tez_ile_ilgili"],
  ["8.6", "Tescilli faydalı model", 12, "tez_ile_ilgili"],
  ["8.7", "Tasarım tescili", 6, "tez_ile_ilgili"],
  ["8.8-UZUN", "Yurt dışı bursu (7 ay ve üzeri)", 10, "tez_ile_ilgili"],
  ["8.8-ORTA", "Yurt dışı bursu (4-6 ay)", 8, "tez_ile_ilgili"],
  ["8.8-KISA", "Yurt dışı bursu (1-3 ay)", 5, "tez_ile_ilgili"],
].map(([code, label, baseScore, relationType, maxQuantity]) => ({
  code,
  label,
  baseScore,
  relationType,
  maxQuantity: Number(maxQuantity) || null,
  supportsAuthorContribution: /^[123]\./u.test(String(code)),
}));

function json(value, fallback) {
  try { return JSON.parse(value || ""); } catch { return fallback; }
}

export function degreeGroup(value = "") {
  const normalized = String(value).toLocaleLowerCase("tr-TR");
  return /doctor|doktora|phd/u.test(normalized) ? "doctorate" : "masters";
}

export function authorContribution(authorCount, authorPosition) {
  const count = Math.max(1, Number(authorCount) || 1);
  const position = Math.max(1, Number(authorPosition) || 1);
  if (count === 1) return position === 1 ? 1 : 0;
  if (count === 2) return [0.95, 0.85][position - 1] || 0;
  if (count === 3) return [0.90, 0.80, 0.75][position - 1] || 0;
  return [0.80, 0.70, 0.60][position - 1] || 0.50;
}

export function calculateActivityScore({ baseScore, authorCount, authorPosition, quantity = 1, applyAuthorContribution = true }) {
  const coefficient = applyAuthorContribution ? authorContribution(authorCount, authorPosition) : 1;
  return Math.round((Number(baseScore) || 0) * coefficient * Math.max(1, Number(quantity) || 1) * 100) / 100;
}

function awardNameParts(value = "") {
  const raw = String(value).trim();
  const scopusStyle = raw.includes(",") ? null : raw.match(/^(.+?)\s+((?:[A-ZÇĞİÖŞÜ]\.?){1,5})$/u);
  const normalized = raw
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/ı/gu, "i")
    .replace(/[^a-z0-9\s,]/gu, " ")
    .replace(/\s+/gu, " ")
    .trim();
  if (scopusStyle) {
    const surname = scopusStyle[1]
      .toLocaleLowerCase("tr-TR")
      .normalize("NFD")
      .replace(/\p{M}/gu, "")
      .replace(/ı/gu, "i")
      .replace(/[^a-z0-9\s]/gu, " ")
      .trim()
      .split(/\s+/u)
      .at(-1) || "";
    const initials = scopusStyle[2].toLocaleLowerCase("tr-TR").replace(/[^a-zçğıöşü]/gu, "");
    return { surname, initials };
  }
  const [beforeComma, afterComma = ""] = normalized.split(",");
  const words = (afterComma ? `${afterComma} ${beforeComma}` : normalized).split(" ").filter(Boolean);
  const surname = words.at(-1) || "";
  const initials = words.slice(0, -1).map((word) => word[0]).join("");
  const aliases = new Map([["f|gultepe", "yilmaz"], ["f|yilmaz", "yilmaz"]]);
  return { surname: aliases.get(`${initials}|${surname}`) || surname, initials };
}

function awardAuthorPosition(studentNames, authors) {
  const students = (Array.isArray(studentNames) ? studentNames : [studentNames]).map(awardNameParts).filter((person) => person.surname);
  const position = authors.findIndex((author) => {
    const candidate = awardNameParts(typeof author === "string" ? author : author?.name);
    return students.some((student) => candidate.surname === student.surname
      && (!student.initials || !candidate.initials || student.initials[0] === candidate.initials[0]));
  });
  return position >= 0 ? position + 1 : Math.max(1, authors.length);
}

function publicationAuthors(row) {
  const raw = row.authors_json ?? row.authors;
  if (Array.isArray(raw)) return raw;
  try { return JSON.parse(raw || "[]"); } catch { return []; }
}

function automaticPublicationRule(row) {
  const type = String(row.publication_type || "").toLocaleLowerCase("tr-TR");
  const quartile = String(row.quartile || "").toUpperCase();
  const scopus = Boolean(row.indexed_scopus);
  const trDizin = Boolean(row.indexed_trdizin);
  const wos = Boolean(row.indexed_wos);
  const international = scopus || wos;
  let code = "";

  if (/book chapter|kitap böl|chapter/u.test(type)) code = international ? "2.1.3" : "2.2.3";
  else if (/book|kitap/u.test(type)) code = international ? "2.1.1" : "2.2.1";
  else if (/conference|proceeding|bildiri|poster/u.test(type)) {
    const fullText = /full|tam metin/u.test(type);
    code = international ? (fullText ? "3.1-TAM" : "3.1-OZET") : (fullText ? "3.2-TAM" : "3.2-OZET");
  } else if (wos && ["Q1", "Q2", "Q3", "Q4"].includes(quartile)) code = `1.1.1-${quartile}`;
  else if (scopus) code = "1.1.2";
  else if (trDizin) code = "1.2.1";
  else code = "1.2.3";

  return activityRuleOptions.find((rule) => rule.code === code);
}

export function calculateAutomaticPublicationActivity(publications = [], studentNames = []) {
  const items = publications.map((row) => {
    const rule = automaticPublicationRule(row);
    const authors = publicationAuthors(row);
    const authorCount = Math.max(1, authors.length);
    const authorPosition = awardAuthorPosition(studentNames, authors);
    const contributionCoefficient = rule?.supportsAuthorContribution === false ? 1 : authorContribution(authorCount, authorPosition);
    const publicationScore = calculateActivityScore({
      baseScore: rule?.baseScore || 0,
      authorCount,
      authorPosition,
      applyAuthorContribution: rule?.supportsAuthorContribution !== false,
    });
    const citationCount = Math.max(0, Number(row.citation_count || 0));
    const citationRule = activityRuleOptions.find((candidate) => candidate.code === (row.indexed_scopus || row.indexed_wos ? "4.1" : "4.2"));
    const citationScore = Math.round(citationCount * Number(citationRule?.baseScore || 0) * 100) / 100;
    return {
      publicationTitle: row.publication_title || "",
      activityCode: rule?.code || "",
      activityLabel: rule?.label || "",
      baseScore: Number(rule?.baseScore || 0),
      authorCount,
      authorPosition,
      contributionCoefficient,
      publicationScore,
      citationCount,
      citationActivityCode: citationRule?.code || "",
      citationUnitScore: Number(citationRule?.baseScore || 0),
      citationScore,
      score: Math.round((publicationScore + citationScore) * 100) / 100,
    };
  });
  return {
    items,
    publicationScore: Math.round(items.reduce((sum, item) => sum + item.publicationScore, 0) * 100) / 100,
    citationScore: Math.round(items.reduce((sum, item) => sum + item.citationScore, 0) * 100) / 100,
    score: Math.round(items.reduce((sum, item) => sum + item.score, 0) * 100) / 100,
  };
}

export function calculateJuryRubric(scores = {}) {
  const safe = Object.fromEntries(juryCriteria.map((item) => [String(item.no), Math.min(5, Math.max(0, Number(scores[item.no] ?? scores[String(item.no)] ?? 0) || 0))]));
  const selectedC = juryCriteria.filter((item) => item.section === "C" && safe[String(item.no)] > 0);
  if (selectedC.length > 4) throw new Error("BM Sürdürülebilir Kalkınma Amaçları bölümünde en fazla 4 ölçüt puanlanabilir.");
  return { scores: safe, rubricScore: Object.values(safe).reduce((sum, value) => sum + value, 0), selectedC: selectedC.length };
}

const AUTOMATIC_JURY_MANUAL_CRITERIA = new Set([1, 2, 4, 5, 6, 12, 13, 14]);

function rubricEvidenceScore(rawScore = 0) {
  const value = Number(rawScore) || 0;
  if (value >= 8) return 5;
  if (value >= 5) return 4;
  if (value >= 3) return 3;
  if (value >= 2) return 2;
  return value > 0 ? 1 : 0;
}

/**
 * Produces an evidence-limited EK-2 pre-assessment from the same DSpace/SKA,
 * strategic-plan and verified thesis-publication data used by the public
 * thesis analyses. Criteria requiring the thesis full text or jury judgement
 * deliberately remain unscored. This is the retrospective EK-2 result used
 * for the closed 2023–2025 award evaluation.
 */
export function calculateAutomaticJuryRubric(thesis = {}, publications = []) {
  const sdgRows = (Array.isArray(thesis.sdg) ? thesis.sdg : [])
    .map((item) => ({
      id: String(item?.id || ""),
      title: String(item?.title || `SKA ${item?.id || ""}`),
      rawScore: Number(item?.score || 0),
      matchedTerms: Array.isArray(item?.matchedTerms) ? item.matchedTerms.filter(Boolean) : [],
    }))
    .filter((item) => /^(?:[1-9]|1[0-7])$/u.test(item.id) && item.rawScore > 0)
    .sort((left, right) => right.rawScore - left.rawScore || Number(left.id) - Number(right.id));
  const sdgById = new Map(sdgRows.map((item) => [item.id, item]));
  const scores = Object.fromEntries(juryCriteria.map((item) => [String(item.no), 0]));
  const evidence = {};
  const set = (no, score, note) => {
    scores[String(no)] = Math.min(5, Math.max(0, Number(score) || 0));
    evidence[String(no)] = note;
  };
  const bestSdg = (ids) => ids.map((id) => sdgById.get(String(id))).filter(Boolean)
    .sort((left, right) => right.rawScore - left.rawScore)[0];
  const sdgNote = (row, prefix) => row
    ? `${prefix}: SKA ${row.id} · ${row.title}${row.matchedTerms.length ? ` (${row.matchedTerms.slice(0, 4).join(", ")})` : ""}.`
    : `${prefix} için DSpace başlık, anahtar kelime veya özetinde doğrulanabilir eşleşme bulunamadı.`;

  for (const no of AUTOMATIC_JURY_MANUAL_CRITERIA) {
    evidence[String(no)] = "Tezin tam metni ve jüri uzman değerlendirmesi gerektiği için otomatik puanlanmadı.";
  }

  // A3 — interdisciplinary content: use only cross-domain SKA evidence.
  const sdgFamilies = [
    [1, 5, 8, 10], [2, 3, 4], [6, 7, 12, 13, 14, 15], [9, 11], [16, 17],
  ].filter((family) => family.some((id) => sdgById.has(String(id)))).length;
  const interdisciplinaryScore = sdgFamilies >= 4 ? 5 : sdgFamilies === 3 ? 4 : sdgFamilies === 2 ? 3 : sdgRows.length >= 2 ? 1 : 0;
  set(3, interdisciplinaryScore, sdgRows.length
    ? `${sdgRows.length} SKA eşleşmesi ${sdgFamilies} farklı tema ailesine yayılıyor: ${sdgRows.slice(0, 5).map((item) => `SKA ${item.id}`).join(", ")}.`
    : "Disiplinler arası içerik için DSpace metaverisinde çoklu tema kanıtı bulunamadı.");

  const specialization = bestSdg([7, 13, 6, 12, 9]);
  set(7, rubricEvidenceScore(specialization?.rawScore), sdgNote(specialization, "OKÜ ihtisaslaşma alanı eşleşmesi"));
  const education = bestSdg([4, 3, 5]);
  set(8, rubricEvidenceScore(education?.rawScore), sdgNote(education, "Eğitim-öğretim stratejik amacı eşleşmesi"));
  const research = bestSdg([9, 7, 15]);
  const researchScore = Math.max(rubricEvidenceScore(research?.rawScore), publications.length >= 3 ? 5 : publications.length === 2 ? 4 : publications.length === 1 ? 3 : 0);
  set(9, researchScore, `${sdgNote(research, "Araştırma-geliştirme stratejik amacı eşleşmesi")} Doğrulanmış tez kaynaklı yayın: ${publications.length}.`);
  const social = bestSdg([3, 10, 11, 1, 2, 5, 6, 8, 13, 14, 15, 16]);
  set(10, rubricEvidenceScore(social?.rawScore), sdgNote(social, "Toplumsal katkı stratejik amacı eşleşmesi"));
  const governance = bestSdg([16, 17, 9, 4]);
  set(11, rubricEvidenceScore(governance?.rawScore), sdgNote(governance, "Liderlik-yönetim stratejik amacı eşleşmesi"));

  const national = bestSdg([2, 3, 4, 7, 8, 9, 11, 12, 13]);
  set(15, rubricEvidenceScore(national?.rawScore), sdgNote(national, "Ulusal kalkınmaya katkı potansiyeli"));
  const qualifiedPublications = publications.filter((item) => item.indexed_wos || item.indexed_scopus || item.indexed_trdizin || item.doi).length;
  const outputScore = qualifiedPublications >= 3 ? 5 : qualifiedPublications === 2 ? 4 : qualifiedPublications === 1 ? 3 : publications.length ? 2 : 0;
  set(16, outputScore, `${publications.length} doğrulanmış tez kaynaklı yayın; bunların ${qualifiedPublications} adedi indeks/DOI kanıtı taşıyor.`);
  const funded = publications.filter((item) => item.funding_type && item.funding_type !== "unknown").length;
  const continuationScore = funded > 0 ? 5 : publications.length >= 2 ? 4 : publications.length === 1 ? 3 : 0;
  set(17, continuationScore, funded
    ? `${funded} yayında proje desteği bulundu; yeni proje/çıktı devamlılığı için doğrudan kanıt kabul edildi.`
    : `${publications.length} tez kaynaklı yayın üzerinden yeni çalışma üretme potansiyeli değerlendirildi; proje desteği kaydı bulunmadı.`);
  const competitiveness = bestSdg([7, 8, 9, 12]);
  set(18, rubricEvidenceScore(competitiveness?.rawScore), sdgNote(competitiveness, "Rekabet gücü/yurt dışına bağımlılığın azaltılması eşleşmesi"));

  // C section: score only the four strongest SDG matches.
  for (const row of sdgRows.slice(0, 4)) {
    const no = 18 + Number(row.id);
    set(no, rubricEvidenceScore(row.rawScore), sdgNote(row, "DSpace içerik eşleşmesi"));
  }
  for (const criterion of juryCriteria.filter((item) => item.section === "C")) {
    if (!evidence[String(criterion.no)]) evidence[String(criterion.no)] = "İlk dört uygun SKA eşleşmesi içinde olmadığı için puanlanmadı.";
  }

  const result = calculateJuryRubric(scores);
  return {
    ...result,
    evidence,
    items: juryCriteria.map((criterion) => ({
      ...criterion,
      score: result.scores[String(criterion.no)] || 0,
      evidence: evidence[String(criterion.no)] || "Otomatik değerlendirme kanıtı bulunamadı.",
      assessmentMode: AUTOMATIC_JURY_MANUAL_CRITERIA.has(criterion.no) ? "manual_required" : "automatic",
    })),
    manualCriteria: [...AUTOMATIC_JURY_MANUAL_CRITERIA],
  };
}

export function publicThesisBibliometrics(rows, { field = "", degree = "", department = "", yearFrom = 0, yearTo = 0, theses = [] } = {}) {
  const currentYear = new Date().getFullYear();
  const requestedFrom = Number(yearFrom) || 0;
  const requestedTo = Number(yearTo) || 0;
  const lowerYear = requestedFrom && requestedTo ? Math.min(requestedFrom, requestedTo) : requestedFrom;
  const upperYear = requestedFrom && requestedTo ? Math.max(requestedFrom, requestedTo) : requestedTo;
  const activeRows = rows.filter((row) => row.relation_status !== "rejected");
  const allTheses = theses.filter((thesis) => thesis.status !== "deleted" && thesis.identifier && Number(thesis.publicationYear));
  const thesisFilters = (thesis) => {
    const thesisDepartment = canonicalDepartmentName(thesis.department);
    const thesisYear = Number(thesis.publicationYear || 0);
    if (field && scientificFieldForDepartment(thesisDepartment) !== field) return false;
    if (degree && degreeGroup(thesis.degreeType) !== degree) return false;
    if (department && thesisDepartment !== department) return false;
    if (lowerYear && thesisYear < lowerYear) return false;
    if (upperYear && thesisYear > upperYear) return false;
    return true;
  };
  const selectedTheses = allTheses.filter(thesisFilters);
  const selectedThesisIds = new Set(selectedTheses.map((thesis) => thesis.identifier));
  const thesisById = new Map(allTheses.map((thesis) => [thesis.identifier, thesis]));
  const filtered = activeRows.filter((row) => selectedThesisIds.has(row.thesis_identifier));
  const uniqueKey = (row) => String(row.doi || "").trim().toLocaleLowerCase("tr-TR") || `${String(row.publication_title || "").trim().toLocaleLowerCase("tr-TR")}|${row.publication_year}`;
  const uniqueRows = [...filtered.reduce((map, row) => {
    const key = uniqueKey(row);
    const existing = map.get(key);
    if (!existing) map.set(key, { ...row });
    else map.set(key, {
      ...existing,
      indexed_scopus: existing.indexed_scopus || row.indexed_scopus ? 1 : 0,
      indexed_trdizin: existing.indexed_trdizin || row.indexed_trdizin ? 1 : 0,
      indexed_wos: existing.indexed_wos || row.indexed_wos ? 1 : 0,
      citation_count: Math.max(Number(existing.citation_count || 0), Number(row.citation_count || 0)),
      international_collaboration: existing.international_collaboration || row.international_collaboration ? 1 : 0,
      quartile: existing.quartile || row.quartile,
      sdg_json: JSON.stringify([...new Set([...json(existing.sdg_json, []), ...json(row.sdg_json, [])])]),
      source: [...new Set([existing.source, row.source].filter(Boolean))].join(" · "),
    });
    return map;
  }, new Map()).values()];
  const uniqueDegreeCount = (items, targetDegree) => new Set(items
    .filter((row) => degreeGroup(row.degree_type) === targetDegree)
    .map(uniqueKey)).size;
  const thesisYears = selectedTheses.map((thesis) => Number(thesis.publicationYear)).filter(Number.isFinite);
  const firstYear = thesisYears.length ? Math.min(...thesisYears) : currentYear;
  const lastYear = thesisYears.length ? Math.max(...thesisYears) : currentYear;
  const years = Array.from({ length: lastYear - firstYear + 1 }, (_, index) => firstYear + index);
  const yearly = years.map((year) => {
    const cohortTheses = selectedTheses.filter((thesis) => Number(thesis.publicationYear) === year);
    const cohortIds = new Set(cohortTheses.map((thesis) => thesis.identifier));
    const convertedIds = new Set(filtered.filter((row) => cohortIds.has(row.thesis_identifier)).map((row) => row.thesis_identifier));
    const degreeRow = (target) => {
      const degreeTheses = cohortTheses.filter((thesis) => degreeGroup(thesis.degreeType) === target);
      const converted = degreeTheses.filter((thesis) => convertedIds.has(thesis.identifier)).length;
      return { theses: degreeTheses.length, converted, rate: degreeTheses.length ? converted / degreeTheses.length * 100 : 0 };
    };
    return { year, totalTheses: cohortTheses.length, convertedTheses: convertedIds.size,
      conversionRate: cohortTheses.length ? convertedIds.size / cohortTheses.length * 100 : 0,
      masters: degreeRow("masters"), doctorates: degreeRow("doctorate") };
  });
  const sdgCounts = new Map();
  const fundingCounts = new Map();
  const quartileCounts = new Map();
  const publicationTypeCounts = new Map();
  const strategicCounts = new Map();
  const normalizePublicationType = (value) => {
    const name = String(value || "").toLocaleLowerCase("tr-TR");
    if (/makale|article|paper|research/u.test(name)) return "Makale";
    if (/bildiri|conference|proceeding/u.test(name)) return "Bildiri";
    if (/kitap böl|book chapter/u.test(name)) return "Kitap bölümü";
    if (/kitap|book/u.test(name)) return "Kitap";
    if (/patent/u.test(name)) return "Patent";
    return "Diğer";
  };
  const strategicPriority = (row) => {
    const thesis = thesisById.get(row.thesis_identifier) || {};
    const thesisKeywords = Array.isArray(thesis.keywords) ? thesis.keywords.join(" ") : String(thesis.keywords || "");
    const text = `${thesis.title || ""} ${thesisKeywords} ${row.publication_title || ""}`.toLocaleLowerCase("tr-TR");
    if (/hidrojen|hydrogen/u.test(text)) return "Hidrojen";
    if (/batarya|battery|enerji depola/u.test(text)) return "Batarya ve enerji depolama";
    if (/yenilenebilir|renewable|güneş|solar|rüzgar|wind/u.test(text)) return "Yenilenebilir enerji";
    if (/enerji verim|energy efficien/u.test(text)) return "Enerji verimliliği";
    if (/yapay zek|artificial intelligence|machine learning|derin öğren|deep learning/u.test(text)) return "Yapay zekâ ve dijitalleşme";
    if (/sürdürülebilir|sustainab|iklim|climate/u.test(text)) return "Sürdürülebilirlik ve iklim";
    return "Diğer alanlar";
  };
  for (const row of uniqueRows) {
    for (const sdg of json(row.sdg_json, [])) sdgCounts.set(String(sdg), (sdgCounts.get(String(sdg)) || 0) + 1);
    const funding = row.funding_type || "unknown";
    fundingCounts.set(funding, (fundingCounts.get(funding) || 0) + 1);
    const quartile = String(row.quartile || "").toUpperCase();
    if (/^Q[1-4]$/u.test(quartile)) quartileCounts.set(quartile, (quartileCounts.get(quartile) || 0) + 1);
    const publicationType = normalizePublicationType(row.publication_type);
    publicationTypeCounts.set(publicationType, (publicationTypeCounts.get(publicationType) || 0) + 1);
    const strategic = strategicPriority(row);
    strategicCounts.set(strategic, (strategicCounts.get(strategic) || 0) + 1);
  }
  const knownFields = allTheses.map((thesis) => scientificFieldForDepartment(thesis.department)).filter(Boolean);
  const fields = ["Fen Bilimleri", "Sosyal Bilimler", "Sağlık Bilimleri", ...[...new Set(knownFields)].filter((item) => !["Fen Bilimleri", "Sosyal Bilimler", "Sağlık Bilimleri"].includes(item))];
  const departments = [...new Set(allTheses
    .filter((thesis) => !field || scientificFieldForDepartment(thesis.department) === field)
    .map((thesis) => canonicalDepartmentName(thesis.department)).filter(Boolean))].sort((a, b) => a.localeCompare(b, "tr"));
  const presentFields = new Set(selectedTheses.map((thesis) => scientificFieldForDepartment(thesis.department)));
  const fieldsToCompare = field ? [field] : ["Fen Bilimleri", "Sosyal Bilimler", "Sağlık Bilimleri", ...[...presentFields].filter((item) => !["Fen Bilimleri", "Sosyal Bilimler", "Sağlık Bilimleri"].includes(item))];
  const fieldBreakdown = fieldsToCompare.map((scientificField) => {
    const fieldTheses = selectedTheses.filter((thesis) => scientificFieldForDepartment(thesis.department) === scientificField);
    const fieldIds = new Set(fieldTheses.map((thesis) => thesis.identifier));
    const fieldRows = filtered.filter((row) => scientificFieldForDepartment(row.department) === scientificField);
    const fieldUnique = [...new Map(fieldRows.map((row) => [uniqueKey(row), row])).values()];
    const converted = new Set(fieldRows.map((row) => row.thesis_identifier)).size;
    const degreePerformance = (targetDegree) => {
      const degreeTheses = fieldTheses.filter((thesis) => degreeGroup(thesis.degreeType) === targetDegree);
      const degreeIds = new Set(degreeTheses.map((thesis) => thesis.identifier));
      const convertedCount = new Set(fieldRows.filter((row) => degreeIds.has(row.thesis_identifier)).map((row) => row.thesis_identifier)).size;
      return { theses: degreeTheses.length, converted: convertedCount, rate: degreeTheses.length ? convertedCount / degreeTheses.length * 100 : 0 };
    };
    return {
      field: scientificField,
      theses: fieldTheses.length,
      convertedTheses: converted,
      conversionRate: fieldTheses.length ? converted / fieldTheses.length * 100 : 0,
      publications: fieldUnique.length,
      masters: uniqueDegreeCount(fieldRows, "masters"),
      doctorates: uniqueDegreeCount(fieldRows, "doctorate"),
      mastersPerformance: degreePerformance("masters"),
      doctoratePerformance: degreePerformance("doctorate"),
      scopus: fieldUnique.filter((row) => row.indexed_scopus).length,
      trdizin: fieldUnique.filter((row) => row.indexed_trdizin).length,
    };
  });
  const departmentBreakdown = [...new Set(selectedTheses.map((thesis) => canonicalDepartmentName(thesis.department)).filter(Boolean))].map((name) => {
    const departmentTheses = selectedTheses.filter((thesis) => canonicalDepartmentName(thesis.department) === name);
    const ids = new Set(departmentTheses.map((thesis) => thesis.identifier));
    const links = filtered.filter((row) => ids.has(row.thesis_identifier));
    const publications = new Set(links.map(uniqueKey)).size;
    const converted = new Set(links.map((row) => row.thesis_identifier)).size;
    return { department: name, field: scientificFieldForDepartment(name), theses: departmentTheses.length,
      convertedTheses: converted, conversionRate: departmentTheses.length ? converted / departmentTheses.length * 100 : 0, publications };
  }).sort((a, b) => b.conversionRate - a.conversionRate || b.publications - a.publications || a.department.localeCompare(b.department, "tr"));
  const indexPriority = (row) => row.indexed_wos ? "SCI/SCIE" : row.indexed_scopus ? "Scopus" : row.indexed_trdizin ? "TR Dizin" : "Diğer";
  const indexDistribution = ["SCI/SCIE", "Scopus", "TR Dizin", "Diğer"].map((index) => {
    const indexRows = uniqueRows.filter((row) => indexPriority(row) === index);
    return { index, total: indexRows.length,
      masters: new Set(filtered.filter((row) => indexPriority(row) === index && degreeGroup(row.degree_type) === "masters").map(uniqueKey)).size,
      doctorates: new Set(filtered.filter((row) => indexPriority(row) === index && degreeGroup(row.degree_type) === "doctorate").map(uniqueKey)).size };
  });
  const publicationYears = [...new Set(uniqueRows.map((row) => Number(row.publication_year)).filter(Number.isFinite))].sort((a, b) => a - b);
  const yearlyPublications = publicationYears.map((year) => {
    const yearRows = filtered.filter((row) => Number(row.publication_year) === year);
    return {
      year,
      total: new Set(yearRows.map(uniqueKey)).size,
      masters: new Set(yearRows.filter((row) => degreeGroup(row.degree_type) === "masters").map(uniqueKey)).size,
      doctorates: new Set(yearRows.filter((row) => degreeGroup(row.degree_type) === "doctorate").map(uniqueKey)).size,
    };
  });
  const completedThesisIds = new Set(filtered.map((row) => row.thesis_identifier));
  const qualityRows = uniqueRows.filter((row) => row.indexed_wos || row.indexed_trdizin || (row.indexed_scopus && /^Q[1-4]$/u.test(String(row.quartile || "").toUpperCase())));
  const citationPublications = (links) => [...links.reduce((map, row) => {
      const key = uniqueKey(row);
      const existing = map.get(key);
      map.set(key, existing
        ? { ...existing, citation_count: Math.max(Number(existing.citation_count || 0), Number(row.citation_count || 0)) }
        : row);
      return map;
    }, new Map()).values()];
  const citationSummaryFor = (targetDegree = "") => {
    const links = targetDegree ? filtered.filter((row) => degreeGroup(row.degree_type) === targetDegree) : filtered;
    const publications = citationPublications(links);
    const total = publications.reduce((sum, row) => sum + Number(row.citation_count || 0), 0);
    const cited = publications.filter((row) => Number(row.citation_count || 0) > 0).length;
    return { publications: publications.length, totalCitations: total, citationsPerPublication: publications.length ? total / publications.length : 0,
      citedPublications: cited, citedRate: publications.length ? cited / publications.length * 100 : 0 };
  };
  const citationPerformance = { total: citationSummaryFor(), masters: citationSummaryFor("masters"), doctorates: citationSummaryFor("doctorate") };
  const yearlyCitations = publicationYears.map((year) => {
    const yearRows = filtered.filter((row) => Number(row.publication_year) === year);
    const citationTotal = (targetDegree) => citationPublications(yearRows.filter((row) => degreeGroup(row.degree_type) === targetDegree))
      .reduce((sum, row) => sum + Number(row.citation_count || 0), 0);
    return { year, masters: citationTotal("masters"), doctorates: citationTotal("doctorate") };
  });
  const international = { total: uniqueRows.filter((row) => row.international_collaboration).length,
    rate: uniqueRows.length ? uniqueRows.filter((row) => row.international_collaboration).length / uniqueRows.length * 100 : 0,
    masters: new Set(filtered.filter((row) => row.international_collaboration && degreeGroup(row.degree_type) === "masters").map(uniqueKey)).size,
    doctorates: new Set(filtered.filter((row) => row.international_collaboration && degreeGroup(row.degree_type) === "doctorate").map(uniqueKey)).size };
  const cohortYears = [...new Set(selectedTheses.map((thesis) => Number(thesis.publicationYear)))].sort((a, b) => a - b);
  const cohorts = cohortYears.map((year) => {
    const cohort = selectedTheses.filter((thesis) => Number(thesis.publicationYear) === year);
    const rowForWindow = (windowYears) => {
      const eligible = currentYear - year >= windowYears;
      const converted = eligible ? cohort.filter((thesis) => filtered.some((row) => row.thesis_identifier === thesis.identifier
        && Number(row.publication_year) >= year && Number(row.publication_year) - year <= windowYears)).length : null;
      return { eligible, converted, rate: eligible && cohort.length ? converted / cohort.length * 100 : null };
    };
    return { year, theses: cohort.length, month12: rowForWindow(1), month24: rowForWindow(2), month36: rowForWindow(3) };
  });
  const timeToPublication = [-1, 0, 1, 2, 3].map((difference) => ({ difference,
    label: difference < 0 ? "Tez tamamlanmadan önce" : difference === 0 ? "Tez yılı içinde" : difference === 3 ? "3 yıl ve sonrası" : `${difference} yıl sonra`,
    count: uniqueRows.filter((row) => {
      const gap = Number(row.publication_year) - Number(row.thesis_cohort_year);
      return difference < 0 ? gap < 0 : difference === 3 ? gap >= 3 : gap === difference;
    }).length }));
  return {
    generatedAt: rows.reduce((latest, row) => String(row.updated_at || "") > latest ? String(row.updated_at) : latest, ""),
    range: { fromYear: firstYear, toYear: lastYear },
    filters: { fields, departments, years: [...new Set(allTheses.map((thesis) => Number(thesis.publicationYear)))].sort((a, b) => a - b), degrees: ["masters", "doctorate"] },
    scope: { relationStatuses: [...new Set(filtered.map((row) => row.relation_status))], label: "Otomatik eşleşen tez kaynaklı yayın adayları" },
    summary: {
      completedTheses: selectedTheses.length,
      completedMasters: selectedTheses.filter((thesis) => degreeGroup(thesis.degreeType) === "masters").length,
      completedDoctorates: selectedTheses.filter((thesis) => degreeGroup(thesis.degreeType) === "doctorate").length,
      thesesWithPublication: completedThesisIds.size,
      conversionRate: selectedTheses.length ? completedThesisIds.size / selectedTheses.length * 100 : 0,
      uniquePublications: uniqueRows.length,
      thesisPublicationLinks: filtered.length,
      masters: uniqueDegreeCount(filtered, "masters"),
      doctorates: uniqueDegreeCount(filtered, "doctorate"),
      qualifiedPublications: qualityRows.length,
      qualifiedPublicationRate: uniqueRows.length ? qualityRows.length / uniqueRows.length * 100 : 0,
    },
    indexSummary: {
      total: uniqueRows.length,
      scopus: uniqueRows.filter((row) => row.indexed_scopus).length,
      trdizin: uniqueRows.filter((row) => row.indexed_trdizin).length,
      wosSciScie: uniqueRows.filter((row) => row.indexed_wos).length,
      quartileAssigned: uniqueRows.filter((row) => /^Q[1-4]$/u.test(String(row.quartile || "").toUpperCase())).length,
    },
    fieldBreakdown,
    departmentBreakdown,
    yearly,
    yearlyPublications,
    indexDistribution,
    publicationTypes: [...publicationTypeCounts.entries()].map(([type, count]) => ({ type, count })).sort((a, b) => b.count - a.count),
    timeToPublication,
    citationPerformance,
    yearlyCitations,
    international,
    cohorts,
    strategicPriorities: [...strategicCounts.entries()].map(([area, count]) => ({ area, count })).sort((a, b) => b.count - a.count),
    sdgs: [...sdgCounts.entries()].map(([id, count]) => ({ id, count })).sort((a, b) => Number(a.id) - Number(b.id)),
    funding: [...fundingCounts.entries()].map(([type, count]) => ({ type, count })).sort((a, b) => b.count - a.count),
    quartiles: [...["Q1", "Q2", "Q3", "Q4"].map((quartile) => ({ quartile, count: quartileCounts.get(quartile) || 0 })),
      { quartile: "Bilgi yok", count: uniqueRows.filter((row) => !/^Q[1-4]$/u.test(String(row.quartile || "").toUpperCase())).length }],
    publications: uniqueRows.sort((a, b) => Number(b.publication_year) - Number(a.publication_year) || String(a.publication_title).localeCompare(String(b.publication_title), "tr")).slice(0, 8).map((row) => ({
      id: row.id,
      title: row.publication_title,
      year: row.publication_year,
      publicationType: row.publication_type,
      degree: degreeGroup(row.degree_type),
      field: scientificFieldForDepartment(row.department),
      doi: row.doi,
      source: row.source,
      fundingType: row.funding_type,
      fundingDetail: row.funding_detail,
      quartile: row.quartile || "",
      indexedScopus: Boolean(row.indexed_scopus),
      indexedTrdizin: Boolean(row.indexed_trdizin),
      indexedWos: Boolean(row.indexed_wos),
      citationCount: Number(row.citation_count || 0),
      relationStatus: row.relation_status,
      sdgs: json(row.sdg_json, []),
    })),
  };
}

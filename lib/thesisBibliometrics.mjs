import { scientificFieldForDepartment } from "./thesisPublicationMatcher.mjs";

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

export function calculateJuryRubric(scores = {}) {
  const safe = Object.fromEntries(juryCriteria.map((item) => [String(item.no), Math.min(5, Math.max(0, Number(scores[item.no] ?? scores[String(item.no)] ?? 0) || 0))]));
  const selectedC = juryCriteria.filter((item) => item.section === "C" && safe[String(item.no)] > 0);
  if (selectedC.length > 4) throw new Error("BM Sürdürülebilir Kalkınma Amaçları bölümünde en fazla 4 ölçüt puanlanabilir.");
  return { scores: safe, rubricScore: Object.values(safe).reduce((sum, value) => sum + value, 0), selectedC: selectedC.length };
}

export function publicThesisBibliometrics(rows, { field = "", degree = "" } = {}) {
  const filtered = rows.filter((row) => {
    if (row.relation_status !== "verified") return false;
    if (field && scientificFieldForDepartment(row.department) !== field) return false;
    if (degree && degreeGroup(row.degree_type) !== degree) return false;
    return true;
  });
  const uniqueKey = (row) => String(row.doi || "").trim().toLocaleLowerCase("tr-TR") || `${String(row.publication_title || "").trim().toLocaleLowerCase("tr-TR")}|${row.publication_year}`;
  const uniqueRows = [...filtered.reduce((map, row) => {
    const key = uniqueKey(row);
    const existing = map.get(key);
    if (!existing) map.set(key, { ...row });
    else map.set(key, {
      ...existing,
      indexed_scopus: existing.indexed_scopus || row.indexed_scopus ? 1 : 0,
      indexed_trdizin: existing.indexed_trdizin || row.indexed_trdizin ? 1 : 0,
      quartile: existing.quartile || row.quartile,
      sdg_json: JSON.stringify([...new Set([...json(existing.sdg_json, []), ...json(row.sdg_json, [])])]),
      source: [...new Set([existing.source, row.source].filter(Boolean))].join(" · "),
    });
    return map;
  }, new Map()).values()];
  const uniqueDegreeCount = (items, targetDegree) => new Set(items
    .filter((row) => degreeGroup(row.degree_type) === targetDegree)
    .map(uniqueKey)).size;
  let cumulative = 0;
  const currentYear = new Date().getFullYear();
  const firstYear = Math.min(currentYear, ...uniqueRows.map((row) => Number(row.publication_year)).filter(Number.isFinite));
  const years = Array.from({ length: currentYear - firstYear + 1 }, (_, index) => firstYear + index);
  const yearly = years.map((year) => {
    const yearRows = uniqueRows.filter((row) => Number(row.publication_year) === year);
    const yearLinks = filtered.filter((row) => Number(row.publication_year) === year);
    const masters = uniqueDegreeCount(yearLinks, "masters");
    const doctorates = uniqueDegreeCount(yearLinks, "doctorate");
    cumulative += yearRows.length;
    return { year, masters, doctorates, total: yearRows.length, cumulative };
  });
  const sdgCounts = new Map();
  const fundingCounts = new Map();
  const quartileCounts = new Map();
  for (const row of uniqueRows) {
    for (const sdg of json(row.sdg_json, [])) sdgCounts.set(String(sdg), (sdgCounts.get(String(sdg)) || 0) + 1);
    const funding = row.funding_type || "unknown";
    fundingCounts.set(funding, (fundingCounts.get(funding) || 0) + 1);
    const quartile = String(row.quartile || "").toUpperCase();
    if (/^Q[1-4]$/u.test(quartile)) quartileCounts.set(quartile, (quartileCounts.get(quartile) || 0) + 1);
  }
  const fields = [...new Set(rows
    .filter((row) => row.relation_status === "verified")
    .map((row) => scientificFieldForDepartment(row.department))
    .filter(Boolean))].sort((a, b) => a.localeCompare(b, "tr"));
  const fieldBreakdown = [...new Set(filtered.map((row) => scientificFieldForDepartment(row.department)))].sort((a, b) => a.localeCompare(b, "tr")).map((scientificField) => {
    const fieldRows = filtered.filter((row) => scientificFieldForDepartment(row.department) === scientificField);
    const fieldUnique = [...new Map(fieldRows.map((row) => [uniqueKey(row), row])).values()];
    return {
      field: scientificField,
      total: fieldUnique.length,
      masters: uniqueDegreeCount(fieldRows, "masters"),
      doctorates: uniqueDegreeCount(fieldRows, "doctorate"),
      scopus: fieldUnique.filter((row) => row.indexed_scopus).length,
      trdizin: fieldUnique.filter((row) => row.indexed_trdizin).length,
    };
  });
  return {
    generatedAt: rows.reduce((latest, row) => String(row.updated_at || "") > latest ? String(row.updated_at) : latest, ""),
    range: { fromYear: firstYear, toYear: currentYear },
    filters: { fields, degrees: ["masters", "doctorate"] },
    summary: {
      uniquePublications: uniqueRows.length,
      thesisPublicationLinks: filtered.length,
      masters: uniqueDegreeCount(filtered, "masters"),
      doctorates: uniqueDegreeCount(filtered, "doctorate"),
    },
    indexSummary: {
      total: uniqueRows.length,
      scopus: uniqueRows.filter((row) => row.indexed_scopus).length,
      trdizin: uniqueRows.filter((row) => row.indexed_trdizin).length,
      wosSciScie: uniqueRows.filter((row) => row.indexed_wos).length,
      quartileAssigned: uniqueRows.filter((row) => /^Q[1-4]$/u.test(String(row.quartile || "").toUpperCase())).length,
    },
    fieldBreakdown,
    yearly,
    sdgs: [...sdgCounts.entries()].map(([id, count]) => ({ id, count })).sort((a, b) => Number(a.id) - Number(b.id)),
    funding: [...fundingCounts.entries()].map(([type, count]) => ({ type, count })).sort((a, b) => b.count - a.count),
    quartiles: ["Q1", "Q2", "Q3", "Q4"].map((quartile) => ({ quartile, count: quartileCounts.get(quartile) || 0 })),
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
      sdgs: json(row.sdg_json, []),
    })),
  };
}

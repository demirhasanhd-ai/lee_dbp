export const MIN_COURSE_LEARNING_OUTCOMES = 5;
export const MIN_OUTCOME_WORDS = 4;
export const MAX_OUTCOME_CHARACTERS = 180;

// OKÜ Ders Bilgi Paketi Hazırlama Kılavuzu (Mart 2026), general writing
// guidance and Tables 4–6. These examples form the application's allowlist.
const cognitiveVerbs = [
  "tanır", "tanımlar", "hatırlar", "listeler", "söyler", "belirler",
  "adlandırır", "seçer", "etiketler", "sıralar", "eşleştirir", "yazar",
  "açıklar", "özetler", "sınıflandırır", "karşılaştırır", "yorumlar",
  "örneklendirir", "farklılaştırır", "değiştirir", "gözden geçirir",
  "yeniden yazar", "tartışır", "anlatır", "kullanır", "çözer", "gösterir",
  "hesaplar", "uygular", "kurar", "test eder", "dener", "çizer", "uyarlar",
  "yapar", "türetir", "analiz eder", "gruplar", "bağlantı kurar",
  "örüntü çıkarır", "kategorize eder", "inceler", "araştırır", "ayırır",
  "ilişkilendirir", "parçalara böler", "sentezler", "değerlendirir",
  "birleştirir", "kodlar", "geliştirir", "karar verir", "bütçeler",
  "doğrular", "onaylar", "önerir", "savunur", "tasarlar", "oluşturur",
  "modeller", "simule eder", "yeniden düzenler", "inşa eder", "yaratır",
  "üretir",
];

const affectiveVerbs = [
  "farkına varır", "dinler", "dikkat eder", "gözlemler", "tanır", "algılar",
  "izler", "not alır", "takip eder", "tepki verir", "kabul eder",
  "işbirliği yapar", "gönüllü olur", "katılır", "onaylar", "yardım eder",
  "destekler", "uygular", "savunur", "teşvik eder", "önerir", "değer verir",
  "önem verir", "benimser", "içselleştirir", "uyar", "tercih eder",
  "düzenler", "uyarlar", "düzeltir", "karşı koyar", "planlar", "çabalar",
  "karar verir", "belirler", "sistematikleştirir", "korur", "sürdürür",
  "model olur", "gösterir", "ilham verir", "liderlik yapar",
];

const psychomotorVerbs = [
  // "Fark eder" is intentionally accepted according to Table 6.
  "fark eder", "algılar", "gözlemler", "ayırt eder", "tepki verir", "seçer",
  "tanır", "dikkat eder", "ayırt etmek", "hazırlar", "pozisyonalır",
  "odaklanır", "hedef belirler", "hazırlık yapar", "yerleşir", "düşünür",
  "koordine eder", "dener", "uygular", "kılavuzluk yapar", "rehberlik alır",
  "test eder", "iyileştirir", "geliştirir", "tekrarlar", "bağımsız uygular",
  "hızlandırır", "ölçer", "kurar", "inşa eder", "tamir eder", "karıştırır",
  "düzeltir", "taslak oluşturur", "uyarlar", "değiştirir", "esnetir",
  "modifiye eder", "dönüştürür", "yaratır", "inovasyon yapar", "tasarlar",
  "sentez yapar", "fomüle eder",
];

export const measurableOutcomeVerbs = Object.freeze([...new Set([
  ...cognitiveVerbs,
  ...affectiveVerbs,
  ...psychomotorVerbs,
  "örnek verir", "çalıştırır", "problem çözer",
  // Retain existing accepted verbs and standard spellings of guide typos.
  "çözümler", "eleştirir", "raporlar", "yürütür", "sunar",
  "simüle eder", "pozisyon alır", "formüle eder", "iş birliği yapar",
])]);

export const vagueOutcomeVerbs = Object.freeze([
  "bilir", "anlar", "kavrar", "maruz kalır", "haberdar olur",
  "bilgi sahibi olur", "fikir sahibi olur", "aşina olur", "öğrenir",
]);

const instructorCentered = [
  "kazandırmak", "öğretmek", "anlatmak", "tanıtmak", "vermek",
  "öğrenciye", "ders kapsamında",
];

/** @typedef {"program" | "course"} OutcomeKind */
/** @typedef {{ code: string, severity: "critical" | "warning" | "info", field: string, message: string }} OutcomeIssue */
/** @typedef {{ status: "empty" | "good" | "warning" | "error", title: string, messages: string[] }} OutcomeQualityResult */

/** @param {string} value */
const normalize = (value) => value.toLocaleLowerCase("tr-TR").replace(/\s+/gu, " ").trim();

/** @param {readonly string[]} phrases */
function phrasePattern(phrases) {
  // Prefer the longest phrase so "problem çözer" / "çözer" and
  // "sentez yapar" / "yapar" each count as one action.
  const alternatives = [...phrases].sort((a, b) => b.length - a.length)
    .map((phrase) => phrase.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&"));
  return new RegExp(`(?<![\\p{L}\\p{M}])(?:${alternatives.join("|")})(?![\\p{L}\\p{M}])`, "gu");
}

const measurablePattern = phrasePattern(measurableOutcomeVerbs);
const vaguePattern = phrasePattern(vagueOutcomeVerbs);
const instructorPattern = phrasePattern(instructorCentered);

/** @param {string[]} phrases */
const quotePhrases = (phrases) => [...new Set(phrases)].map((phrase) => `“${phrase}”`).join(", ");

/**
 * Share vocabulary and failure reasons between the editor and quality reports.
 * @param {string} rawText
 * @param {OutcomeKind} [kind]
 * @returns {OutcomeIssue[]}
 */
export function evaluateOutcomeRules(rawText, kind = "course") {
  const text = normalize(rawText);
  if (!text) {
    return [{ code: "empty", severity: "critical", field: "Çıktı",
      message: kind === "course"
        ? "Bu öğrenme çıktısı boş bırakılamaz; doldurun veya en az beş çıktı kalacak şekilde kaldırın."
        : "Bu program çıktısı boş bırakılamaz; doldurun veya kaldırın." }];
  }

  /** @type {OutcomeIssue[]} */
  const issues = [];
  const vague = [...text.matchAll(vaguePattern)].map((match) => match[0]);
  const actions = [...text.matchAll(measurablePattern)].map((match) => match[0]);
  const instructor = [...text.matchAll(instructorPattern)].map((match) => match[0]);
  if (vague.length) {
    issues.push({ code: "vague-verb", severity: "warning", field: "Çıktı fiili",
      message: `Belirsiz fiil/ifade bulundu: ${quotePhrases(vague)}. Kılavuzdaki ölçülebilir aktif fiillerden birini kullanın.` });
  }
  if (!actions.length) {
    issues.push({ code: "missing-verb", severity: "warning", field: "Çıktı fiili",
      message: "Kabul edilen ölçülebilir fiillerden biri bulunamadı. Listede yer alan bir fiil kullanılması zorunludur. Örneğin: tanımlar, açıklar, hesaplar, çözer, modeller, fark eder." });
  }
  const wordCount = text.split(" ").length;
  if (wordCount < MIN_OUTCOME_WORDS) {
    issues.push({ code: "too-short", severity: "warning", field: "Çıktı ifadesi",
      message: `Metin ${wordCount} kelimeden oluşuyor; en az ${MIN_OUTCOME_WORDS} kelimelik tam bir kazanım cümlesi yazın.` });
  }
  if (rawText.length > MAX_OUTCOME_CHARACTERS) {
    issues.push({ code: "too-long", severity: "info", field: "Çıktı uzunluğu",
      message: `Metin ${rawText.length} karakter; en fazla ${MAX_OUTCOME_CHARACTERS} karakter olmalıdır. Cümleyi sadeleştirin.` });
  }
  if (actions.length > 1) {
    issues.push({ code: "multiple-actions", severity: "warning", field: "Çıktı eylemleri",
      message: `${actions.length} eylem kullanımı bulundu: ${quotePhrases(actions)}. Her çıktıda tek fiil ve tek yargı/yüklem kullanın.` });
  }
  if (instructor.length) {
    issues.push({ code: "instructor-centered", severity: "warning", field: "Çıktı odağı",
      message: `Öğretici odaklı sayılan ifade bulundu: ${quotePhrases(instructor)}. ${kind === "program" ? "Program çıktısı öğrencinin süreç sonunda yapabileceklerini göstermelidir." : "Öğrenme çıktısı öğrencinin yapacağı davranışı göstermelidir."}` });
  }
  if (kind === "program" && !/(yetkin|beceri|bilgi|alan|araştır|etik|çözüm|değerlendir)/u.test(text)) {
    issues.push({ code: "program-context", severity: "warning", field: "Program çıktısı bağlamı",
      message: "Program çıktısında bilgi, beceri, yetkinlik veya TYYÇ bağlamı bulunamadı. Mevcut kontrol yetkin, beceri, bilgi, alan, araştır, etik, çözüm veya değerlendir ifadelerinden en az birini arar." });
  }
  return issues;
}

/**
 * @param {string} rawText
 * @param {OutcomeKind} kind
 * @returns {OutcomeQualityResult}
 */
export function evaluateOutcomeQuality(rawText, kind) {
  const issues = evaluateOutcomeRules(rawText, kind);
  if (!issues.length) {
    return { status: "good", title: "Uygun", messages: ["Tanımlı öğrenme çıktısı kurallarına uygun."] };
  }
  return {
    status: issues[0].code === "empty" ? "empty" : issues.length > 1 ? "error" : "warning",
    title: issues[0].code === "empty" ? "Boş çıktı" : "Düzenlenmeli",
    messages: issues.map(({ message }) => message),
  };
}

/** @param {string[]} outcomes */
export function courseOutcomePublishIssues(outcomes) {
  const issues = outcomes.length < MIN_COURSE_LEARNING_OUTCOMES
    ? [`En az ${MIN_COURSE_LEARNING_OUTCOMES} öğrenme çıktısı yazılmalıdır (mevcut: ${outcomes.length}).`]
    : [];
  outcomes.forEach((outcome, index) => {
    const result = evaluateOutcomeQuality(outcome, "course");
    if (result.status !== "good") issues.push(`ÖÇ${index + 1}: ${result.messages.join(" ")}`);
  });
  return issues;
}

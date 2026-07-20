"use client";

export type OutcomeKind = "program" | "course";

export type OutcomeQualityResult = {
  status: "empty" | "good" | "warning" | "error";
  title: string;
  messages: string[];
};

const vagueVerbs = [
  "bilir",
  "anlar",
  "fark eder",
  "kavrar",
  "haberdar olur",
  "bilgi sahibi olur",
  "aşina olur",
];

const measurableVerbs = [
  "açıklar",
  "uygular",
  "tasarlar",
  "değerlendirir",
  "karşılaştırır",
  "analiz eder",
  "çözümler",
  "problem çözer",
  "ilişkilendirir",
  "kullanır",
  "sıralar",
  "listeler",
  "gösterir",
  "çizer",
  "eleştirir",
  "yorumlar",
  "raporlar",
  "geliştirir",
  "üretir",
  "seçer",
  "planlar",
  "yürütür",
  "sunar",
];

const instructorCentered = [
  "kazandırmak",
  "öğretmek",
  "anlatmak",
  "tanıtmak",
  "vermek",
  "öğrenciye",
  "ders kapsamında",
];

const normalize = (value: string) =>
  value
    .toLocaleLowerCase("tr-TR")
    .replace(/\s+/g, " ")
    .trim();

const includesAny = (text: string, items: string[]) =>
  items.some((item) => text.includes(item));

const countActionHints = (text: string) =>
  measurableVerbs.filter((verb) => text.includes(verb)).length +
  (text.match(/\sve\s|\sile\s|,\s/g)?.length ?? 0);

export function evaluateOutcomeQuality(
  rawText: string,
  kind: OutcomeKind,
): OutcomeQualityResult {
  const text = normalize(rawText);
  if (!text) {
    return {
      status: "empty",
      title: "Boş",
      messages: ["Çıktı maddesi yazıldığında otomatik denetlenecek."],
    };
  }

  const messages: string[] = [];
  if (includesAny(text, vagueVerbs)) {
    messages.push(
      "Belirsiz fiil kullanılmış. “bilir, anlar, fark eder” yerine ölçülebilir aktif fiil seçin.",
    );
  }
  if (!includesAny(text, measurableVerbs)) {
    messages.push(
      "Ölçülebilir aktif fiil bulunamadı. Örn. açıklar, uygular, değerlendirir, tasarlar.",
    );
  }
  if (text.split(" ").length < 4) {
    messages.push("İfade konu başlığı gibi duruyor; tam bir kazanım cümlesi yazın.");
  }
  if (rawText.length > 180) {
    messages.push("Cümle uzun. Daha açık, sade ve tek davranışa odaklı yazın.");
  }
  if (countActionHints(text) > 3) {
    messages.push(
      "Birden fazla eylem içeriyor olabilir. Her çıktıda mümkünse tek yargı/yüklem kullanın.",
    );
  }
  if (includesAny(text, instructorCentered)) {
    messages.push(
      kind === "program"
        ? "Program çıktısı öğrencinin süreç sonunda yapabileceklerini göstermeli."
        : "Öğrenme çıktısı öğretim elemanının değil öğrencinin yapacaklarını göstermeli.",
    );
  }
  if (
    kind === "program" &&
    !/(yetkin|beceri|bilgi|alan|araştır|etik|çözüm|değerlendir)/.test(text)
  ) {
    messages.push("Program çıktısında bilgi, beceri, yetkinlik veya TYYÇ bağlamı daha görünür olmalı.");
  }

  if (messages.length === 0) {
    return {
      status: "good",
      title: "Uygun",
      messages: ["Açık, ölçülebilir ve öğrenci odaklı görünüyor."],
    };
  }

  return {
    status: messages.length > 1 ? "error" : "warning",
    title: messages.length > 1 ? "Düzenlenmeli" : "Gözden geçirilmeli",
    messages,
  };
}

export function OutcomeQualityHint({
  text,
  kind,
}: {
  text: string;
  kind: OutcomeKind;
}) {
  const result = evaluateOutcomeQuality(text, kind);
  return (
    <div className={`outcome-quality ${result.status}`}>
      <strong>{result.title}</strong>
      <span>{result.messages[0]}</span>
    </div>
  );
}

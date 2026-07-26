export type SdgGoal = {
  id: string;
  title: string;
  imageSrc: string;
};

export const SDG_LOGO_SRC = "/sdg/sdg_logo.png";

export const DEFAULT_COURSE_SDG_IDS = ["4", "9", "17"] as const;

export const SDG_GOALS: SdgGoal[] = [
  { id: "1", title: "Yoksulluğa Son", imageSrc: "/sdg/sdg_1.png" },
  { id: "2", title: "Açlığa Son", imageSrc: "/sdg/sdg_2.png" },
  { id: "3", title: "Sağlık ve Kaliteli Yaşam", imageSrc: "/sdg/sdg_3.png" },
  { id: "4", title: "Nitelikli Eğitim", imageSrc: "/sdg/sdg_4.png" },
  { id: "5", title: "Toplumsal Cinsiyet Eşitliği", imageSrc: "/sdg/sdg_5.png" },
  { id: "6", title: "Temiz Su ve Sanitasyon", imageSrc: "/sdg/sdg_6.png" },
  { id: "7", title: "Erişilebilir ve Temiz Enerji", imageSrc: "/sdg/sdg_7.png" },
  { id: "8", title: "İnsana Yakışır İş ve Ekonomik Büyüme", imageSrc: "/sdg/sdg_8.png" },
  { id: "9", title: "Sanayi, Yenilikçilik ve Altyapı", imageSrc: "/sdg/sdg_9.png" },
  { id: "10", title: "Eşitsizliklerin Azaltılması", imageSrc: "/sdg/sdg_10.png" },
  { id: "11", title: "Sürdürülebilir Şehirler ve Topluluklar", imageSrc: "/sdg/sdg_11.png" },
  { id: "12", title: "Sorumlu Üretim ve Tüketim", imageSrc: "/sdg/sdg_12.png" },
  { id: "13", title: "İklim Eylemi", imageSrc: "/sdg/sdg_13.png" },
  { id: "14", title: "Sudaki Yaşam", imageSrc: "/sdg/sdg_14.png" },
  { id: "15", title: "Karasal Yaşam", imageSrc: "/sdg/sdg_15.png" },
  { id: "16", title: "Barış, Adalet ve Güçlü Kurumlar", imageSrc: "/sdg/sdg_16.png" },
  { id: "17", title: "Amaçlar için Ortaklıklar", imageSrc: "/sdg/sdg_17.png" },
];

export function findSdgGoal(value: string) {
  const id = value.trim().match(/\d+/)?.[0] || "";
  return SDG_GOALS.find((goal) => goal.id === id);
}

export function formatSdgGoal(goal: SdgGoal) {
  return `${goal.id} · ${goal.title}`;
}

export function resolveSdgGoals(
  values?: string | readonly string[],
  fallback: readonly string[] = DEFAULT_COURSE_SDG_IDS,
) {
  const source = Array.isArray(values)
    ? values
    : String(values || "").split(/[,;|\n]+/);
  const selected = source
    .map((value) => findSdgGoal(value))
    .filter((goal): goal is SdgGoal => Boolean(goal));
  const unique = selected.filter((goal, index, list) => list.findIndex((item) => item.id === goal.id) === index);
  if (unique.length) return unique;
  return fallback.map((id) => findSdgGoal(id)).filter((goal): goal is SdgGoal => Boolean(goal));
}

export type Assessment = {
  id: number;
  name: string;
  count: number;
  weight: number;
  fixed?: boolean;
};

export type Workload = { count: number; hours: number; custom?: boolean };

const foldTurkishText = (value: string) => value
  .toLocaleLowerCase("tr-TR")
  .replaceAll("ç", "c")
  .replaceAll("ğ", "g")
  .replaceAll("ı", "i")
  .replaceAll("ö", "o")
  .replaceAll("ş", "s")
  .replaceAll("ü", "u")
  .replaceAll("â", "a")
  .replaceAll("î", "i")
  .replaceAll("û", "u")
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "");

export const normalizeActivityName = (value: string) => foldTurkishText(value).replace(/[^a-z0-9]+/g, " ").trim();
const rounded = (value: number, digits = 6) => Number(value.toFixed(digits));

export const workloadTotalHours = (rows: Record<string, Workload>) => rounded(Object.values(rows).reduce(
  (total, row) => total + Number(row.count || 0) * Number(row.hours || 0),
  0,
), 2);

export const linkedWorkloadNames = (rows: Record<string, Workload>, assessmentName: string) => {
  const exact = normalizeActivityName(assessmentName);
  const preparation = normalizeActivityName(`${assessmentName} Hazırlığı`);
  return Object.keys(rows).filter((name) => {
    const normalized = normalizeActivityName(name);
    return normalized === exact || normalized === preparation;
  });
};

export const assessmentWorkloadName = (assessmentName: string) => `${assessmentName.trim() || "Yeni Değerlendirme"} Hazırlığı`;

export function rebalanceAssessmentWeights(items: Assessment[]) {
  const active = items.filter((item) => item.count > 0);
  if (!active.length) return items.map((item) => ({ ...item, weight: 0 }));
  const activeTotal = active.reduce((sum, item) => sum + Math.max(0, Number(item.weight || 0)), 0);
  if (activeTotal === 100) return items;
  if (active.length === 1) {
    return items.map((item) => ({ ...item, weight: item.id === active[0].id ? 100 : 0 }));
  }
  const rawWeights = active.map((item) => activeTotal > 0 ? Math.max(0, Number(item.weight || 0)) * 100 / activeTotal : 100 / active.length);
  const integerWeights = rawWeights.map(Math.floor);
  let remainder = 100 - integerWeights.reduce((sum, weight) => sum + weight, 0);
  rawWeights
    .map((weight, index) => ({ index, fraction: weight - integerWeights[index] }))
    .sort((left, right) => right.fraction - left.fraction)
    .forEach(({ index }) => { if (remainder > 0) { integerWeights[index] += 1; remainder -= 1; } });
  const weights = new Map(active.map((item, index) => [item.id, integerWeights[index]]));
  return items.map((item) => ({ ...item, weight: item.count > 0 ? weights.get(item.id) ?? 0 : 0 }));
}

export function redistributeRemovedWorkload(rows: Record<string, Workload>, removedNames: string[]) {
  if (!removedNames.length) return rows;
  const targetTotal = workloadTotalHours(rows);
  const removed = new Set(removedNames);
  const next = Object.fromEntries(Object.entries(rows).filter(([name]) => !removed.has(name)));
  const currentTotal = workloadTotalHours(next);
  const deficit = rounded(targetTotal - currentTotal, 6);
  if (deficit <= 0) return next;
  const flexible = Object.entries(next).filter(([name, row]) => row.count > 0 && normalizeActivityName(name) !== "ders suresi");
  const recipients = flexible.length ? flexible : Object.entries(next).filter(([, row]) => row.count > 0);
  if (!recipients.length) return next;
  let remaining = deficit;
  let changed = true;
  while (remaining >= 0.5 && changed) {
    changed = false;
    for (const [name] of recipients) {
      const row = next[name];
      const increment = row.count * 0.5;
      if (increment > remaining + 0.000001) continue;
      next[name] = { ...row, hours: rounded(row.hours + 0.5, 2) };
      remaining = rounded(remaining - increment, 6);
      changed = true;
      if (remaining < 0.5) break;
    }
  }
  if (remaining > 0.000001) {
    const [name] = recipients[recipients.length - 1];
    const row = next[name];
    next[name] = { ...row, hours: rounded(row.hours + remaining / row.count, 6) };
  }
  return next;
}

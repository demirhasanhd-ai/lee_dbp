export const DEFAULT_PUBLIC_DATA_REFRESH_PLAN = Object.freeze({
  quarterlyEnabled: true,
  quarterlyMonths: [3, 6, 9, 12],
  quarterlyRunHour: 1,
  citationsEnabled: true,
  citationWeekday: 1,
  citationRunHour: 1,
  timezone: "Europe/Istanbul",
  retryNextDay: true,
});

const WEEKDAY_INDEX = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
const MONTH_NAMES = { 1: "Ocak", 2: "Şubat", 3: "Mart", 4: "Nisan", 5: "Mayıs", 6: "Haziran", 7: "Temmuz", 8: "Ağustos", 9: "Eylül", 10: "Ekim", 11: "Kasım", 12: "Aralık" };
const WEEKDAY_NAMES = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];

function safeInteger(value, fallback, min, max) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= min && parsed <= max ? parsed : fallback;
}

export function normalizePublicDataRefreshPlan(value = {}) {
  const rawMonths = Array.isArray(value.quarterlyMonths) ? value.quarterlyMonths : DEFAULT_PUBLIC_DATA_REFRESH_PLAN.quarterlyMonths;
  const quarterlyMonths = [...new Set(rawMonths.map((month) => safeInteger(month, 0, 1, 12)).filter(Boolean))].sort((a, b) => a - b);
  const timezone = String(value.timezone || DEFAULT_PUBLIC_DATA_REFRESH_PLAN.timezone).trim();
  try { new Intl.DateTimeFormat("tr-TR", { timeZone: timezone }).format(); } catch { return { ...DEFAULT_PUBLIC_DATA_REFRESH_PLAN }; }
  return {
    quarterlyEnabled: value.quarterlyEnabled !== false,
    quarterlyMonths: quarterlyMonths.length ? quarterlyMonths : [...DEFAULT_PUBLIC_DATA_REFRESH_PLAN.quarterlyMonths],
    quarterlyRunHour: safeInteger(value.quarterlyRunHour, 1, 0, 23),
    citationsEnabled: value.citationsEnabled !== false,
    citationWeekday: safeInteger(value.citationWeekday, 1, 0, 6),
    citationRunHour: safeInteger(value.citationRunHour, 1, 0, 23),
    timezone,
    retryNextDay: value.retryNextDay !== false,
  };
}

function localParts(date, timezone) {
  const values = Object.fromEntries(new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23", weekday: "short",
  }).formatToParts(date).filter((part) => part.type !== "literal").map((part) => [part.type, part.value]));
  return {
    year: Number(values.year), month: Number(values.month), day: Number(values.day),
    hour: Number(values.hour), minute: Number(values.minute), weekday: WEEKDAY_INDEX[values.weekday] ?? 0,
  };
}

function zonedDateTime(year, month, day, hour, timezone) {
  const desired = Date.UTC(year, month - 1, day, hour, 0, 0, 0);
  let utc = desired;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const actual = localParts(new Date(utc), timezone);
    const rendered = Date.UTC(actual.year, actual.month - 1, actual.day, actual.hour, actual.minute, 0, 0);
    utc += desired - rendered;
  }
  return new Date(utc);
}

export function quarterlyRefreshDates(year, planValue = DEFAULT_PUBLIC_DATA_REFRESH_PLAN) {
  const plan = normalizePublicDataRefreshPlan(planValue);
  if (!plan.quarterlyEnabled) return [];
  return plan.quarterlyMonths.map((month) => {
    const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
    return zonedDateTime(year, month, lastDay, plan.quarterlyRunHour, plan.timezone);
  });
}

export function nextQuarterlyRefreshDate(now = new Date(), planValue = DEFAULT_PUBLIC_DATA_REFRESH_PLAN) {
  const plan = normalizePublicDataRefreshPlan(planValue);
  if (!plan.quarterlyEnabled) return null;
  const year = localParts(now, plan.timezone).year;
  return [year, year + 1].flatMap((item) => quarterlyRefreshDates(item, plan)).find((date) => date > now) || null;
}

export function latestQuarterlyRefreshDate(now = new Date(), planValue = DEFAULT_PUBLIC_DATA_REFRESH_PLAN) {
  const plan = normalizePublicDataRefreshPlan(planValue);
  if (!plan.quarterlyEnabled) return null;
  const year = localParts(now, plan.timezone).year;
  return [year - 1, year].flatMap((item) => quarterlyRefreshDates(item, plan))
    .filter((date) => date <= now).sort((left, right) => right.getTime() - left.getTime())[0] || null;
}

export function nextWeeklyRefreshDate(now = new Date(), planValue = DEFAULT_PUBLIC_DATA_REFRESH_PLAN) {
  const plan = normalizePublicDataRefreshPlan(planValue);
  if (!plan.citationsEnabled) return null;
  const local = localParts(now, plan.timezone);
  let days = (plan.citationWeekday - local.weekday + 7) % 7;
  if (days === 0 && (local.hour > plan.citationRunHour || (local.hour === plan.citationRunHour && local.minute >= 0))) days = 7;
  const localDate = new Date(Date.UTC(local.year, local.month - 1, local.day));
  localDate.setUTCDate(localDate.getUTCDate() + days);
  return zonedDateTime(localDate.getUTCFullYear(), localDate.getUTCMonth() + 1, localDate.getUTCDate(), plan.citationRunHour, plan.timezone);
}

export function latestWeeklyRefreshDate(now = new Date(), planValue = DEFAULT_PUBLIC_DATA_REFRESH_PLAN) {
  const plan = normalizePublicDataRefreshPlan(planValue);
  if (!plan.citationsEnabled) return null;
  const local = localParts(now, plan.timezone);
  let days = (local.weekday - plan.citationWeekday + 7) % 7;
  if (days === 0 && local.hour < plan.citationRunHour) days = 7;
  const localDate = new Date(Date.UTC(local.year, local.month - 1, local.day));
  localDate.setUTCDate(localDate.getUTCDate() - days);
  return zonedDateTime(localDate.getUTCFullYear(), localDate.getUTCMonth() + 1, localDate.getUTCDate(), plan.citationRunHour, plan.timezone);
}

export function publicDataScheduleLabels(planValue = DEFAULT_PUBLIC_DATA_REFRESH_PLAN) {
  const plan = normalizePublicDataRefreshPlan(planValue);
  const quarterly = plan.quarterlyMonths.map((month) => {
    const day = new Date(Date.UTC(2028, month, 0)).getUTCDate();
    return `${day} ${MONTH_NAMES[month]}`;
  }).join(", ");
  return {
    quarterly: plan.quarterlyEnabled ? `${quarterly} · ${String(plan.quarterlyRunHour).padStart(2, "0")}:00` : "Kapalı",
    citations: plan.citationsEnabled ? `Her ${WEEKDAY_NAMES[plan.citationWeekday]} · ${String(plan.citationRunHour).padStart(2, "0")}:00` : "Kapalı",
    timezone: plan.timezone,
    retry: plan.retryNextDay ? "Başarısız işlem ertesi gün yeniden denenir" : "Otomatik yeniden deneme kapalı",
  };
}

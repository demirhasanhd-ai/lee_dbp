export const COURSE_STRUCTURE_LABELS = Object.freeze([
  "Matematik ve Temel Bilimler",
  "Mühendislik Bilimleri",
  "Mühendislik Tasarımı",
  "Sosyal Bilimler",
  "Eğitim Bilimleri",
  "Fen Bilimleri",
  "Sağlık Bilimleri",
  "Alan Bilgisi",
]);

/**
 * Keep the teacher's visible percentages without redistributing legacy hidden values.
 * This creates editor state; it does not migrate stored or published packages.
 * @param {Record<string, number>} [values]
 * @returns {Record<string, number>}
 */
export function normalizeCourseStructures(values = {}) {
  return Object.fromEntries(COURSE_STRUCTURE_LABELS.map((label) => [label, values[label] ?? 0]));
}

/** @param {Record<string, number>} values */
export function courseStructureTotal(values) {
  return COURSE_STRUCTURE_LABELS.reduce((sum, label) => sum + Number(values[label] || 0), 0);
}

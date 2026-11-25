/**
 * Old positional scores are suggestions only until a draft is saved with its
 * program-outcome snapshot. After that, even deliberately empty cells belong
 * to the teacher and must never be filled again from the defaults.
 * @param {{ contributionMatrix?: Record<string, number>[], programOutcomes?: unknown[] } | null} packageData
 * @param {{ id: string, text: string }[]} programOutcomes
 * @param {string} status
 * @param {Record<string, number>[]} defaultRows
 * @returns {Record<string, number>[]}
 */
export function initialContributionMatrix(packageData, programOutcomes, status, defaultRows = []) {
  const savedRows = Array.isArray(packageData?.contributionMatrix) ? packageData.contributionMatrix : [];
  if (status !== "Taslak" || Array.isArray(packageData?.programOutcomes)) return savedRows;
  const rows = Array.isArray(packageData?.contributionMatrix) ? savedRows : defaultRows;
  return rows.map((row) => Object.fromEntries(programOutcomes.flatMap(({ id }, index) => {
    const source = row || {};
    // P1…P11 are the old positional defaults, even when the remaining profile
    // happens to retain a P-number identity after outputs were removed/moved.
    const hasCurrentScore = !/^P\d+$/.test(id) && Object.hasOwn(source, id);
    const score = hasCurrentScore ? source[id] : index < 11 ? source[`P${index + 1}`] : undefined;
    return Number.isInteger(score) && score >= 1 && score <= 5 ? [[id, score]] : [];
  })));
}

/**
 * @param {{ id: string, text: string }[]} programOutcomes
 * @param {string[]} outcomes
 * @param {Record<string, number>[]} matrix
 * @returns {string}
 */
export function missingProgramOutcomeMappingMessage(programOutcomes, outcomes, matrix) {
  const missing = programOutcomes.flatMap(({ id }, index) =>
    outcomes.some((text, rowIndex) => text.trim() && Number.isInteger(matrix[rowIndex]?.[id]) &&
      matrix[rowIndex][id] >= 1 && matrix[rowIndex][id] <= 5) ? [] : [`PÇ${index + 1}`]);
  return missing.length ? `${missing.join(", ")} hiçbir ders öğrenme çıktısıyla eşleştirilmemiş. Onaya göndermeden önce bu program çıktılarını 1–5 düzeyinde eşleştirin.` : "";
}

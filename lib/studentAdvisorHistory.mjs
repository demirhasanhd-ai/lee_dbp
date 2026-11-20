const researchLevels = new Set(["Tezli Yüksek Lisans", "Doktora"]);

// Each year retains its latest actual observation, including its original date.
export function mergeStudentAdvisorHistory(history, observation) {
  const observations = Array.isArray(history) ? history : [];
  const date = new Date(observation?.observedAt);
  if (Number.isNaN(date.getTime()) || !Array.isArray(observation?.programs)) return observations;
  const year = Number(new Intl.DateTimeFormat("en", { timeZone: "Europe/Istanbul", year: "numeric" }).format(date));
  if (year !== observation.year) return observations;
  const previous = observations.find((item) => item.year === year);
  if (previous && previous.method !== "enrollment_intervals" && observation.method === "enrollment_intervals") return observations;
  const revision = observation.method === "enrollment_intervals" ? Date.parse(observation.generatedAt || observation.observedAt) : date.getTime();
  const previousRevision = previous?.method === "enrollment_intervals" ? Date.parse(previous.generatedAt || previous.observedAt) : Date.parse(previous?.observedAt);
  if (previous && previousRevision >= revision) return observations;
  const programs = observation.programs.filter((item) => researchLevels.has(item.level)
    && typeof item.departmentId === "string" && item.departmentId
    && typeof item.programName === "string" && item.programName
    && (item.advisorCount === null || (Number.isInteger(item.advisorCount) && item.advisorCount >= 0))
    && (item.activeStudents === null || (Number.isInteger(item.activeStudents) && item.activeStudents >= 0)));
  return [...observations.filter((item) => item.year !== year), {
    year,
    observedAt: date.toISOString(),
    method: observation.method === "enrollment_intervals" ? "enrollment_intervals" : "observed",
    generatedAt: observation.generatedAt || date.toISOString(),
    programs: programs.map((item) => ({
      departmentId: item.departmentId,
      department: item.department,
      programName: item.programName,
      level: item.level,
      activeStudents: item.activeStudents,
      advisorCount: item.advisorCount,
      suppressed: Boolean(item.suppressed),
      statusDataComplete: item.statusDataComplete !== false,
    })),
  }].sort((left, right) => left.year - right.year);
}

export function publicStudentAdvisorHistory(history, catalog, matchPrograms) {
  return history.map((observation) => {
    const consumed = new Set();
    const programs = catalog.filter((official) => researchLevels.has(official.level)).flatMap((official) => {
      const matches = matchPrograms(observation.programs, consumed, official);
      matches.forEach(({ index }) => consumed.add(index));
      if (!matches.length) return [];
      const sources = matches.map(({ candidate }) => candidate);
      const advisorCounts = new Set(sources.map((source) => source.advisorCount));
      const departmentIds = new Set(sources.map((source) => source.departmentId));
      const denominatorKnown = departmentIds.size === 1 && advisorCounts.size === 1;
      const advisorCount = denominatorKnown ? sources[0].advisorCount : null;
      const suppressed = sources.some((source) => source.suppressed);
      const statusDataComplete = sources.every((source) => source.statusDataComplete !== false);
      const activeStudents = suppressed || !statusDataComplete || sources.some((source) => source.activeStudents == null)
        ? null : sources.reduce((sum, source) => sum + source.activeStudents, 0);
      return [{
        ...official,
        activeStudents,
        advisorCount,
        studentsPerAdvisor: activeStudents == null || !advisorCount ? null : activeStudents / advisorCount,
        suppressed,
        statusDataComplete,
      }];
    });
    return { year: observation.year, observedAt: observation.observedAt, method: observation.method, programs };
  });
}

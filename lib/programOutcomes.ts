export type ProgramOutcome = { id: string; text: string };

export const legacyProgramOutcomes: ProgramOutcome[] = Array.from({ length: 11 }, (_, index) => ({
  id: `P${index + 1}`,
  text: "",
}));

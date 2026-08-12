import { resolveCourseProgramContext } from "../../lib/data/programNavigation";
import { programSlug } from "../../lib/data/programs";
import { PublicProgramSidebar } from "../PublicProgramSidebar";

type PackageNavigationProps = {
  code: string;
  department?: string;
  programName?: string;
  level?: string;
};

export function PackageNavigation({ code, department, programName, level }: PackageNavigationProps) {
  const context = resolveCourseProgramContext({ code, department, programName, level });
  if (!context) return null;
  const { course, program } = context;

  return (
    <PublicProgramSidebar
      department={program.department}
      levels={program.levels}
      activeLevel={course.level}
      activeProgramKey={programSlug(program)}
      activeTab="courses"
      programHref=""
    />
  );
}

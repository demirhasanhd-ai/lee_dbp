import { notFound, redirect } from "next/navigation";
import { normalizePublicSegment, resolvePublicProgramRoute } from "../../../../lib/data/publicRoutes";
import { CanonicalCoursePackage } from "./CanonicalCoursePackage";

type PageProps = { params: Promise<{ programCode: string; levelCode: string; courseCode: string }> };

export default async function ShortCoursePage({ params }: PageProps) {
  const { programCode, levelCode, courseCode } = await params;
  const resolved = resolvePublicProgramRoute(programCode, levelCode);
  if (!resolved) notFound();
  const canonicalCode = normalizePublicSegment(courseCode);
  if (!canonicalCode) notFound();
  if (programCode !== resolved.alias || levelCode !== resolved.levelCode || courseCode !== canonicalCode) {
    redirect(`/${resolved.alias}/${resolved.levelCode}/${canonicalCode}`);
  }
  return <CanonicalCoursePackage
    department={resolved.program.department}
    programName={resolved.program.programName}
    level={resolved.level}
    courseCode={canonicalCode}
  />;
}

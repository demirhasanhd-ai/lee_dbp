import { notFound } from "next/navigation";
import { resolvePublicProgramRoute } from "../../../lib/data/publicRoutes";
import { PublicProgramView } from "../../programlar/[slug]/page";

type PageProps = {
  params: Promise<{ programCode: string; levelCode: string }>;
  searchParams: Promise<{ sekme?: string }>;
};

export default async function ShortProgramLevelPage({ params, searchParams }: PageProps) {
  const [{ programCode, levelCode }, query] = await Promise.all([params, searchParams]);
  const resolved = resolvePublicProgramRoute(programCode, levelCode);
  if (!resolved) notFound();
  return <PublicProgramView program={resolved.program} forcedLevel={resolved.level} query={query} />;
}

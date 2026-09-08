import { notFound } from "next/navigation";
import { resolvePublicProgramRoute } from "../../lib/data/publicRoutes";
import { PublicProgramView } from "../programlar/[slug]/page";

type PageProps = {
  params: Promise<{ programCode: string }>;
  searchParams: Promise<{ sekme?: string }>;
};

export default async function ShortProgramPage({ params, searchParams }: PageProps) {
  const [{ programCode }, query] = await Promise.all([params, searchParams]);
  const resolved = resolvePublicProgramRoute(programCode);
  if (!resolved) notFound();
  return <PublicProgramView program={resolved.program} forcedLevel={resolved.level} query={query} />;
}

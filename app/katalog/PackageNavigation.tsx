import { PublicProgramSidebar } from "../PublicProgramSidebar";

const programUrl = "/programlar/aile-danismanligi-ve-egitimi-abd-aile-danismanligi-ve-egitimi";
const levels = ["Tezsiz YL", "Tezli YL"];

export function PackageNavigation({ code }: { code: string }) {
  const thesis = Number(code.match(/\d+/)?.[0] ?? 500) >= 600;
  return (
    <PublicProgramSidebar
      department="Aile Danışmanlığı ve Eğitimi ABD"
      levels={levels}
      activeLevel={thesis ? "Tezli YL" : "Tezsiz YL"}
      activeTab="courses"
      programHref={programUrl}
    />
  );
}

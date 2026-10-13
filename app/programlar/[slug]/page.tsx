import { getProgramBySlug, LEE_PROGRAMS, programSlug, type LeeProgram } from "../../../lib/data/programs";
import { ProgramCourses } from "./ProgramCourses";
import { PublicSiteHeader } from "../../PublicSiteHeader";
import { dbpPath } from "../../../lib/dbpPath";

type PageProps={params:Promise<{slug:string}>;searchParams:Promise<{programKey?:string;duzey?:string;sekme?:string}>};

export default async function PublicProgramPage({params,searchParams}:PageProps){
 const [{slug},query]=await Promise.all([params,searchParams]);const program=getProgramBySlug(slug);
 if(!program)return <main className="public-program-page"><div className="public-program-content"><section className="public-empty"><h1>Program bulunamadı</h1><a href={dbpPath("/#programlar")}>Programlara dönün</a></section></div></main>;
 return <PublicProgramView program={program} query={query}/>;
}

export function PublicProgramView({
 program,
 query = {},
 forcedLevel,
}: {
 program: LeeProgram;
 query?: {programKey?:string;duzey?:string;sekme?:string};
 forcedLevel?: string;
}) {
 const siblingPrograms=LEE_PROGRAMS.filter((item)=>item.department===program.department);
 const programItems=siblingPrograms.map((item)=>({
  visibilityKey:programSlug(item),
  programName:item.programName,
  levels:item.levels,
  courses:[],
 }));
 const requestedProgram=programItems.find((item)=>item.visibilityKey===query.programKey)??programItems[0];
 const selectedLevel=forcedLevel??query.duzey;
 const requestedLevel=requestedProgram.levels.find((level)=>level===selectedLevel)??requestedProgram.levels[0];
 const initialView={programKey:requestedProgram.visibilityKey,level:requestedLevel,tab:query.sekme==="courses"?"courses" as const:"profile" as const};
 return <main className="public-program-page">
  <PublicSiteHeader/>
  <div className="public-program-shell"><div className="public-program-content"><div className="public-breadcrumb"><a href={dbpPath("/")}>Ana Sayfa</a><span>/</span><a href={dbpPath("/#programlar")}>Programlar</a><span>/</span><b>{program.programName}</b></div><div id="program-dersleri"><ProgramCourses visibilityKey={programSlug(program)} department={program.department} programName={program.programName} levels={program.levels} courses={[]} programItems={programItems} initialView={initialView}/></div></div></div>
 </main>;
}

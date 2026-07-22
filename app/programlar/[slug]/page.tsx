import { getProgramBySlug, LEE_PROGRAMS, programSlug, type LeeProgram, type ProgramLevel } from "../../../lib/data/programs";
import { officialCoursesForProgram } from "../../../lib/data/officialCourses";
import { ProgramCourses, type PublicCourse } from "./ProgramCourses";
import { PublicSiteHeader } from "../../PublicSiteHeader";

type PageProps={params:Promise<{slug:string}>};
function coursePrefix(program:LeeProgram){return program.programName.split(/\s+/).slice(0,3).map(word=>word[0]).join("").toLocaleUpperCase("tr-TR")}
function demoProgramCourses(program:LeeProgram):PublicCourse[]{const prefix=coursePrefix(program);return program.levels.flatMap((level:ProgramLevel,levelIndex)=>[
 {code:`${prefix} ${501+levelIndex*100}`,name:`${program.programName} Alanında Bilimsel Araştırma`,level,term:"Güz" as const,type:"Zorunlu" as const,theory:3,practice:0,ects:6},
 {code:`${prefix} ${503+levelIndex*100}`,name:`${program.programName} Kuramları`,level,term:"Güz" as const,type:"Seçmeli" as const,theory:3,practice:0,ects:6},
 {code:`${prefix} ${590+levelIndex*100}`,name:"Seminer",level,term:"Güz" as const,type:"Zorunlu" as const,theory:0,practice:2,ects:3},
 {code:`${prefix} ${502+levelIndex*100}`,name:`${program.programName} Güncel Yaklaşımlar`,level,term:"Bahar" as const,type:"Seçmeli" as const,theory:3,practice:0,ects:6},
 {code:`${prefix} ${504+levelIndex*100}`,name:`${program.programName} Uygulamaları`,level,term:"Bahar" as const,type:"Seçmeli" as const,theory:2,practice:2,ects:6},
 {code:`${prefix} ${592+levelIndex*100}`,name:"Uzmanlık Alan Dersi",level,term:"Bahar" as const,type:"Zorunlu" as const,theory:4,practice:0,ects:8},
]);}
function programCourses(program:LeeProgram):PublicCourse[]{
 const official=officialCoursesForProgram(program);
 if(official.length) return official.map((course)=>({
  code:course.code,
  name:course.name,
  level:course.level,
  term:course.term,
  type:course.type,
  theory:course.theory,
  practice:course.practice,
  ects:course.ects,
  credit:course.credit,
  instructor:course.instructor,
  programCode:course.programCode,
 }));
 return demoProgramCourses(program);
}

export default async function PublicProgramPage({params}:PageProps){
 const {slug}=await params;const program=getProgramBySlug(slug);
 if(!program)return <main className="public-program-page"><div className="public-program-content"><section className="public-empty"><h1>Program bulunamadı</h1><a href="/#programlar">Programlara dönün</a></section></div></main>;
 const siblingPrograms=LEE_PROGRAMS.filter((item)=>item.department===program.department);
 const programItems=siblingPrograms.map((item)=>({
  visibilityKey:programSlug(item),
  programName:item.programName,
  levels:item.levels,
  courses:programCourses(item),
 }));
 return <main className="public-program-page">
  <PublicSiteHeader/>
  <div className="public-program-shell"><div className="public-program-content"><div className="public-breadcrumb"><a href="/">Ana Sayfa</a><span>/</span><a href="/#programlar">Programlar</a><span>/</span><b>{program.programName}</b></div><div id="program-dersleri"><ProgramCourses visibilityKey={programSlug(program)} department={program.department} programName={program.programName} levels={program.levels} courses={programCourses(program)} programItems={programItems}/></div></div></div>
 </main>;
}

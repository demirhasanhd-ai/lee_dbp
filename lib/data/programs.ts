export type ProgramLevel="Tezsiz Yüksek Lisans"|"Tezli Yüksek Lisans"|"Doktora";
export type LeeProgram={mainDepartment:string;department:string;programName:string;levels:ProgramLevel[]};
const L=(tezsiz:boolean,tezli:boolean,doktora:boolean):ProgramLevel[]=>[...(tezsiz?["Tezsiz Yüksek Lisans" as const]:[]),...(tezli?["Tezli Yüksek Lisans" as const]:[]),...(doktora?["Doktora" as const]:[])];
export const LEE_PROGRAMS:LeeProgram[]=[
 ["Aile Danışmanlığı ve Eğitimi ABD","Aile Danışmanlığı ve Eğitimi ABD","Aile Danışmanlığı ve Eğitimi",L(true,true,false)],
 ["Arkeoloji ABD","Arkeoloji ABD","Arkeoloji",L(false,true,false)],
 ["Batarya Sistemleri ve Hidrojen Teknolojileri ABD","Batarya Sistemleri ve Hidrojen Teknolojileri ABD","Batarya Sistemleri ve Hidrojen Teknolojileri",L(false,true,false)],
 ["Beden Eğitimi ve Spor ABD","Beden Eğitimi ve Spor ABD","Beden Eğitimi ve Spor",L(true,true,false)],
 ["Biyoloji ABD","Biyoloji ABD","Biyoloji",L(true,true,true)],
 ["Ebelik ABD","Ebelik ABD","Ebelik",L(false,true,false)],
 ["Ekoturizm Rehberliği ABD","Ekoturizm Rehberliği ABD","Ekoturizm Rehberliği",L(false,true,false)],
 ["Elektrik Elektronik Mühendisliği ABD","Elektrik Elektronik Mühendisliği ABD","Elektrik Elektronik Mühendisliği",L(false,true,false)],
 ["Enerji Sistemleri Mühendisliği ABD","Enerji Sistemleri Mühendisliği ABD","Enerji Sistemleri Mühendisliği",L(true,true,true)],
 ["Felsefe ve Din Bilimleri ABD","Felsefe ve Din Bilimleri ABD","Felsefe ve Din Bilimleri",L(false,true,false)],
 ["Fizik ABD","Fizik ABD","Fizik",L(false,true,true)],
 ["Gastronomi ve Mutfak Sanatları ABD","Gastronomi ve Mutfak Sanatları ABD","Gastronomi ve Mutfak Sanatları",L(true,true,false)],
 ["Gıda Mühendisliği ABD","Gıda Mühendisliği ABD","Gıda Mühendisliği",L(false,true,true)],
 ["Gıda Teknolojisi ABD","Gıda Teknolojisi ABD","Gıda Teknolojisi",L(true,true,false)],
 ["Harita Mühendisliği ABD","Harita Mühendisliği ABD","Harita Mühendisliği",L(false,true,false)],
 ["Hemşirelik ABD","Hemşirelik ABD","İç Hastalıkları Hemşireliği",L(false,true,false)],
 ["İnşaat Mühendisliği ABD","İnşaat Mühendisliği ABD","İnşaat Mühendisliği",L(false,true,true)],
 ["İktisat ABD","İktisat ABD","Ekonomi ve Finans",L(true,false,false)],
 ["İktisat ABD","İktisat ABD","İktisat",L(false,true,false)],
 ["İşletme ABD","İşletme","İşletme",L(true,true,true)],
 ["İşletme ABD","Muhasebe ve Finansman","Muhasebe ve Finansman",L(true,true,false)],
 ["İşletme ABD","Yönetim Organizasyon","Yönetim Organizasyon",L(true,true,false)],
 ["Kimya ABD","Kimya ABD","Kimya",L(false,true,true)],
 ["Makine Mühendisliği ABD","Makine Mühendisliği ABD","Makine Mühendisliği",L(false,true,true)],
 ["Matematik ABD","Matematik ABD","Matematik",L(false,true,false)],
 ["Mühendislik ve Teknoloji Yönetimi ABD","Mühendislik ve Teknoloji Yönetimi ABD","Mühendislik ve Teknoloji Yönetimi",L(true,false,false)],
 ["Organik Tarım İşletmeciliği ABD","Organik Tarım İşletmeciliği ABD","Organik Tarım İşletmeciliği",L(true,true,false)],
 ["Resim ASD","Resim ASD","Resim",L(true,true,false)],
 ["Siyaset Bilimi ve Kamu Yönetimi ABD","Siyaset Bilimi ve Kamu Yönetimi ABD","Siyaset Bilimi ve Kamu Yönetimi",L(true,true,true)],
 ["Tarih ABD","Tarih ABD","Tarih",L(true,true,false)],
 ["Temel İslam Bilimleri ABD","Temel İslam Bilimleri ABD","Temel İslam Bilimleri",L(false,true,false)],
 ["Türk Dili ve Edebiyatı ABD","Türk Dili ve Edebiyatı ABD","Türk Dili ve Edebiyatı",L(true,true,true)],
 ["Yönetim Bilişim Sistemleri ABD","Yönetim Bilişim Sistemleri ABD","Yönetim Bilişim Sistemleri",L(true,true,true)],
].map(([mainDepartment,department,programName,levels])=>({mainDepartment,department,programName,levels})) as LeeProgram[];
export const MAIN_DEPARTMENTS=[...new Set(LEE_PROGRAMS.map(item=>item.mainDepartment))];
export const PROGRAM_TOTALS={mainDepartments:MAIN_DEPARTMENTS.length,tezsiz:LEE_PROGRAMS.filter(x=>x.levels.includes("Tezsiz Yüksek Lisans")).length,tezli:LEE_PROGRAMS.filter(x=>x.levels.includes("Tezli Yüksek Lisans")).length,doktora:LEE_PROGRAMS.filter(x=>x.levels.includes("Doktora")).length};

export const programSlug=(program:Pick<LeeProgram,"department"|"programName">)=>
 `${program.department}-${program.programName}`
  .toLocaleLowerCase("tr-TR")
  .replace(/[çÇ]/g,"c").replace(/[ğĞ]/g,"g").replace(/[ıİ]/g,"i")
  .replace(/[öÖ]/g,"o").replace(/[şŞ]/g,"s").replace(/[üÜ]/g,"u")
  .normalize("NFD").replace(/[\u0300-\u036f]/g,"")
  .replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");

export const getProgramBySlug=(slug:string)=>LEE_PROGRAMS.find(program=>programSlug(program)===slug);

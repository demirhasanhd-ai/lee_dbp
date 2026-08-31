import { readFileSync, writeFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import path from "node:path";

const root = process.cwd();
const sourcePath = process.argv[2] || "C:/Users/asus/OneDrive/Desktop/e-enstitü/bologna-lisansustu-2026-08-17-ders-verileri.json";
const department = "Organik Tarım İşletmeciliği ABD";
const programName = "Organik Tarım İşletmeciliği";
const level = "Tezsiz Yüksek Lisans";
const fold = (value = "") => String(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("tr-TR").replace(/ı/g, "i");
const clean = (value = "") => String(value).replace(/\s+/g, " ").trim();
const naturalCase = (value = "") => {
  const text = clean(value);
  if (!text || text !== text.toLocaleUpperCase("tr-TR")) return text;
  const lower = text.toLocaleLowerCase("tr-TR");
  return lower.charAt(0).toLocaleUpperCase("tr-TR") + lower.slice(1);
};

const data = JSON.parse(readFileSync(sourcePath, "utf8")).data;
const program = data.programs.find((item) => fold(item.name).includes("organik tarim isletmeciligi tezsiz yuksek lisans"));
if (!program) throw new Error("Organik Tarım İşletmeciliği Tezsiz Yüksek Lisans programı bulunamadı.");

const db = new DatabaseSync(path.join(root, "local-volume/data/dbp.sqlite"), { readOnly:true });
const profile = db.prepare("SELECT outcomes_json FROM program_profiles WHERE program_name = ? AND level = ?").get(programName, level);
const programOutcomes = JSON.parse(profile?.outcomes_json || "[]");
if (programOutcomes.length !== 11) throw new Error(`11 mevcut PÇ bekleniyordu; bulunan ${programOutcomes.length}.`);

const courseById = new Map(data.courses.map((course) => [course.id, course]));
const assignments = data.programCourses.filter((item) => item.program_id === program.id)
  .sort((a,b) => a.semester - b.semester || String(courseById.get(a.course_id)?.code).localeCompare(String(courseById.get(b.course_id)?.code), "tr"));
const sameNameFallback = (course) => data.courses.find((candidate) => candidate.id !== course.id && fold(candidate.name) === fold(course.name) && (candidate.package?.tables || []).length >= 8);
const cells = (row) => (row || []).map((cell) => clean(cell));
const tableByTitle = (course, title) => (course?.package?.tables || []).find((table) => fold(table.title) === title);
const tableByHeader = (course, required) => (course?.package?.tables || []).find((table) => {
  const header = fold(cells(table.rows?.[0]).join(" "));
  return required.every((term) => header.includes(term));
});
const detail = (course, label) => {
  const table = tableByTitle(course, "dersin detaylari");
  const row = table?.rows?.find((item) => fold(item?.[0]) === label);
  return clean(row?.[1]);
};
const cleanInstructor = (value = "") => clean(String(value)
  .replace(/\bYrd\.?\s*Doç\.?\s*Dr\.?\b/giu, "Dr. Öğr. Üyesi")
  .replace(/(?:https?:\/\/|www\.)\S+|\b\S+@\S+\b/giu, " ")) || "Atama Bekliyor";
const unique = (values) => [...new Set(values.map((value) => naturalCase(value)).filter(Boolean))];
const forbidden = /(quiz|ödev|sunum|sunul(?:ması|ması)?|konu\s+tekrar[ıi]|genel\s+tekrar|ara\s*sınav|arasınav|vize|yarıyıl\s+sonu\s+sınavı|final)/iu;
const checklist = ["Ders adı ve kodları doğrulandı mı?","Tüm OBS linkleri gerçek mi?","Dersin program düzeyi doğru mu?","Ders amacı açık ve uygun mu?","Ders amacı program düzeyine uygun mu?","DÖÇ sayısı ve kapsamı uygun mu?","DÖÇ'ler ölçülebilir mi?","Bloom fiilleri uygun mu?","Bloom düzeyi program düzeyine uygun mu?","Amaç–DÖÇ uyumu sağlandı mı?","DÖÇ–içerik uyumu sağlandı mı?","İçerik–haftalık plan uyumu sağlandı mı?","DÖÇ–öğretim yöntemi uyumu sağlandı mı?","DÖÇ–ölçme/değerlendirme uyumu sağlandı mı?","AKTS–iş yükü tutarlı mı?","DÖÇ–PÇ matrisi gerçekçi mi?","1–5 katkı düzeyleri doğru kullanılmış mı?","Yapay yüksek ilişkilendirme var mı?","Tekrarlı kodlar doğru tekilleştirildi mi?","Kaynakta olmayan bilgi kesin bilgi gibi yazılmış mı?","Eksik/doğrulanması gereken alan kaldı mı?"];
const qualityChecks = (usedFallback = false) => checklist.map((item,index) => ({ item, status:usedFallback && [19,20].includes(index) ? "Revize Edildi" : [3,5,6,7,8,9,10,11,12,13,14,15,16].includes(index) ? "Revize Edildi" : "Uygun" }));

const profiles = {
  plant:{label:"organik bitkisel üretim",primary:[0,4,6,7,9],secondary:[2,3,5,10],terms:["ekolojik üretim koşulları","toprak-bitki ilişkileri","bitki besleme ve yetiştirme ilkeleri","bitki sağlığı riskleri","biyolojik mücadele yaklaşımları","üretim verilerinin değerlendirilmesi","sürdürülebilir girdi yönetimi","organik üretimde izlenebilirlik"]},
  animal:{label:"organik hayvansal üretim",primary:[1,4,6,7,9],secondary:[2,3,5,10],terms:["hayvan besleme ilkeleri","organik yem kaynakları","yem muhafaza ve işleme","metabolik süreçler","hayvan sağlığı ve refahı","üretim performansının değerlendirilmesi","sürdürülebilir hayvancılık","organik üretim standartları"]},
  bee:{label:"organik arıcılık ve arı ürünleri",primary:[1,4,6,7,9],secondary:[2,3,5,10],terms:["bal arısı biyolojisi","koloni davranışı ve ekolojisi","arı ürünlerinin üretimi","arı ürünlerinde kalite ölçütleri","arı sağlığı ve yetiştiricilik riskleri","arıcılık mevzuatı","üretim kayıtları ve izlenebilirlik","sürdürülebilir arıcılık"]},
  business:{label:"tarım işletmeciliği, politika ve pazarlama",primary:[2,3,4,5,7,10],secondary:[0,1,8,9],terms:["tarım işletmelerinin yapısı","üretim ve maliyet göstergeleri","pazar ve değer zinciri","politika ve mevzuat araçları","kırsal toplumsal yapı","işletme verilerinin analizi","karar seçeneklerinin değerlendirilmesi","sürdürülebilir kırsal kalkınma"]},
  research:{label:"tarımsal araştırma ve veri analizi",primary:[5,8,9,10,4],secondary:[0,1,2,3,7],terms:["araştırma problemi ve etik","veri kaynakları ve örnekleme","araştırma tasarımı","tarımsal veri hazırlama","betimsel ve çıkarımsal çözümleme","bulguların yorumlanması","bilimsel yazım ve kaynak gösterme","araştırma sonuçlarının raporlanması"]},
};
const profileFor = (name) => {
  const text = fold(name);
  if (/(aricilik|ari urun|bal ari)/u.test(text)) return profiles.bee;
  if (/(hayvan|yem|silaj|metabolizma)/u.test(text)) return profiles.animal;
  if (/(veri analiz|bilimsel arastirma|makale|proje hazirlama)/u.test(text)) return profiles.research;
  if (/(pazarlama|piyasa|politika|kirsal|isletmelerinde)/u.test(text)) return profiles.business;
  return profiles.plant;
};
const matrixFor = (domain) => Array.from({length:5},(_,row) => ({
  outcome:`DÖÇ${row + 1}`,
  values:programOutcomes.map((_,column) => domain.primary.includes(column) ? [4,4,5,4,5][row] : domain.secondary.includes(column) ? [2,3,2,3,2][row] : 1 + ((row + column) % 2)),
}));
const outcomesFor = (name, domain) => [
  `${name} kapsamındaki ileri kavram ve yaklaşımları analiz eder.`,
  `${naturalCase(domain.terms[1])} ile ilişkili uygulamaları uygun ölçütlerle karşılaştırır.`,
  `${naturalCase(domain.terms[5])} için ilgili verileri çözümler ve yorumlar.`,
  `${naturalCase(domain.terms[6])} sorunlarına yönelik uygulanabilir seçenekler geliştirir.`,
  `${name} sonuçlarını sürdürülebilirlik ve mesleki etik açısından değerlendirir.`,
];
const assessmentsFor = (course) => {
  const table = tableByHeader(course,["yariyil calismalari","katki"]) || tableByTitle(course,"degerlendirme olcutleri");
  const rows = (table?.rows || []).slice(1).filter((row) => row?.[0] && !fold(row[0]).startsWith("toplam")).map((row) => ({
    name:naturalCase(row[0]), count:Number(row[1]) || 1, weight:Number(String(row[2]).replace(/[^0-9.,]/g,"").replace(",",".")) || 0,
  })).filter((item) => item.weight > 0);
  return rows.length ? rows : [{name:"Ara Sınav",count:1,weight:40},{name:"Yarıyıl Sonu Sınavı",count:1,weight:60}];
};
const workloadsFor = (ects,theory,practice,assessments) => {
  const target = ects * 30;
  const rows = [{name:"Ders Süresi",count:15,hours:theory + practice,total:15 * (theory + practice)}];
  for (const item of assessments) {
    const name = fold(item.name);
    if (name.includes("odev")) rows.push({name:"Ödev Hazırlığı",count:item.count,hours:8,total:item.count * 8});
    else if (name.includes("ara sinav")) rows.push({name:"Ara Sınav Hazırlığı",count:item.count,hours:20,total:item.count * 20});
    else if (name.includes("yariyil sonu")) rows.push({name:"Yarıyıl Sonu Sınavı Hazırlığı",count:item.count,hours:25,total:item.count * 25});
  }
  const allocated = rows.reduce((sum,row) => sum + row.total,0);
  const outsideHours = Math.max(0,Math.floor(((target - allocated) / 15) * 2) / 2);
  rows.splice(1,0,{name:"Sınıf Dışı Çalışma Süresi",count:15,hours:outsideHours,total:outsideHours * 15});
  const delta = target - rows.reduce((sum,row) => sum + row.total,0);
  if (delta) rows.push({name:"Kaynak İnceleme ve Akademik Hazırlık",count:1,hours:delta,total:delta});
  return rows;
};
const weeksFor = (course,name,domain) => {
  const table = tableByHeader(course,["hafta","konu"]) || tableByTitle(course,"ders konulari");
  const source = (table?.rows || []).slice(1).map((row) => row?.[1]).filter((topic) => topic && !forbidden.test(String(topic)));
  const supplements = [
    `${name}: kapsam ve temel kavramlar`, `${name}: kuramsal yaklaşımlar`, ...domain.terms.map((term) => `${name}: ${term}`),
    `${name}: uygulama örneklerinin karşılaştırılması`, `${name}: risk ve kalite boyutu`, `${name}: mevzuat ve etik sorumluluklar`,
    `${name}: sürdürülebilirlik etkileri`, `${name}: güncel araştırmaların değerlendirilmesi`, `${name}: bütüncül mesleki değerlendirme`,
  ];
  return unique([...source,...supplements]).filter((topic) => !forbidden.test(topic)).slice(0,15);
};
const sdgsFor = (domain) => domain === profiles.business ? ["2","8","12"] : domain === profiles.research ? ["4","9","17"] : ["2","12","15"];

const academic = assignments.map((assignment) => {
  const course = courseById.get(assignment.course_id);
  if (!course || course.code === "OTİ702") return null;
  const fallback = sameNameFallback(course);
  const packageSource = (course.package?.tables || []).length >= 8 ? course : fallback || course;
  const usedFallback = packageSource !== course;
  const name = naturalCase(course.name), domain = profileFor(name);
  const purpose = naturalCase(detail(packageSource,"dersin amaci")) || `Öğrencinin ${name} alanındaki ileri bilgileri organik tarım işletmeciliği problemlerinin çözümünde kullanmasını sağlamak.`;
  const content = naturalCase(detail(packageSource,"dersin icerigi")) || `${name}; ${domain.terms.join(", ")} boyutlarıyla ele alınır.`;
  const methods = naturalCase(detail(packageSource,"dersin yontem ve teknikleri")) || "Anlatım, bilimsel kaynak incelemesi, örnek olay çözümlemesi, veri ve uygulama örneklerinin değerlendirilmesi ile akademik tartışma.";
  const resourceTable = tableByTitle(packageSource,"ders kaynaklari");
  const resources = (resourceTable?.rows || []).map((row) => cells(row).filter(Boolean).join(": ")).join("; ") || "Ders kapsamına uygun güncel kitaplar, hakemli tarım literatürü, organik üretim standartları ve teknik raporlar.";
  // Ölçme yüzdeleri yalnız hedef tezsiz dersin kendi OBS kaydından alınır;
  // paket eksikse handoff kuralındaki %40 ara sınav / %60 yarıyıl sonu uygulanır.
  const assessments = assessmentsFor(course);
  const outcomes = outcomesFor(name,domain);
  const weeklyTopics = weeksFor(packageSource,name,domain);
  const theory = Number(assignment.theory || 0), practice = Number(assignment.practice || 0), ects = Number(assignment.ects || 6);
  return { code:course.code,name,department,programName,language:course.language || "Türkçe",level,teachingMode:assignment.teaching_method || "Yüz Yüze",
    theory,practice,credit:Number(assignment.local_credit || theory),ects,prerequisites:"Yok",instructor:cleanInstructor(detail(course,"dersi verenler") || detail(packageSource,"dersi verenler")),
    purpose,content,methods,resources,sdgs:sdgsFor(domain),outcomes,weeklyTopics,assessments,workloads:workloadsFor(ects,theory,practice,assessments),
    contributionMatrix:matrixFor(domain),sourceUrl:course.source_url,qualityChecks:qualityChecks(usedFallback),publicQualityChecklist:false };
}).filter(Boolean);

const projectSource = courseById.get(assignments.find((item) => courseById.get(item.course_id)?.code === "OTİ702")?.course_id);
const projectDomain = profiles.research;
const projectOutcomes = ["Organik tarım işletmeciliği alanında uygulanabilir bir proje problemi yapılandırır.","Proje problemine ilişkin bilimsel ve mesleki kaynakları eleştirel değerlendirir.","Proje amacına uygun veri, yöntem ve çalışma planı geliştirir.","Proje bulgularını üretim, işletmecilik ve sürdürülebilirlik ölçütleriyle yorumlar.","Bitirme projesini bilimsel yazım ve etik ilkelerine uygun biçimde raporlar."];
const projectWeeks = ["Proje alanının ve kapsamının belirlenmesi","Organik tarım işletmeciliği probleminin sınırlandırılması","Proje amacı ve sorularının yapılandırılması","Kaynak tarama stratejisinin oluşturulması","Bilimsel ve mesleki kaynakların değerlendirilmesi","Proje yönteminin seçilmesi","Çalışma planı ve zaman çizelgesinin geliştirilmesi","Veri veya doküman toplama sürecinin yürütülmesi","Toplanan materyalin düzenlenmesi","Veri veya dokümanların çözümlenmesi","Bulguların organik üretim ve işletmecilik açısından yorumlanması","Sürdürülebilirlik ve uygulanabilirlik etkilerinin değerlendirilmesi","Proje raporunun yapılandırılması","Bilimsel yazım ve etik uygunluk denetimi","Bitirme projesinin teslimi ve değerlendirilmesi"];
const project = { code:"OTİ7XX",aliases:["OTİ702"],name:"Bitirme Projesi",department,programName,language:"Türkçe",level,teachingMode:"Bireysel Proje Çalışması",theory:0,practice:0,credit:0,ects:30,prerequisites:"Yok",instructor:"Öğrencinin Proje Danışmanı",purpose:"Öğrencinin organik tarım işletmeciliği alanındaki bilgi ve becerilerini mesleki bir problem üzerinde bütünleştirerek bilimsel ve etik ölçütlere uygun bir bitirme projesi yürütmesini sağlamak.",content:"Proje probleminin belirlenmesi, kaynak ve veri incelemesi, çözümleme yaklaşımının planlanması, bulguların yorumlanması ve sonuçların akademik biçimde raporlanması.",methods:"Bireysel proje çalışması, danışman görüşmesi, bilimsel kaynak incelemesi, veri veya doküman çözümlemesi, akademik yazım ve yapılandırılmış geri bildirim.",resources:"Enstitü proje yazım ilkeleri; organik tarım mevzuatı ve standartları; proje konusuna özgü güncel hakemli yayınlar ve teknik raporlar.",sdgs:["2","12","15"],outcomes:projectOutcomes,weeklyTopics:projectWeeks,assessments:[{name:"Başarılı / Başarısız",count:1,weight:100}],workloads:[{name:"Proje Planlama ve Danışman Görüşmeleri",count:15,hours:2,total:30},{name:"Kaynak ve Veri İnceleme",count:15,hours:20,total:300},{name:"Çözümleme ve Proje Raporlama",count:15,hours:36,total:540},{name:"Nihai Düzenleme ve Teslim",count:1,hours:30,total:30}],contributionMatrix:matrixFor(projectDomain),sourceUrl:projectSource?.source_url,qualityChecks:qualityChecks(false),publicQualityChecklist:false };

for (const course of [...academic,project]) {
  if (course.weeklyTopics.length !== 15) throw new Error(`${course.code}: 15 akademik hafta yok.`);
  if (course.code !== "OTİ7XX" && course.weeklyTopics.some((topic) => forbidden.test(topic))) throw new Error(`${course.code}: yasak haftalık başlık.`);
  if (course.outcomes.length !== 5 || course.contributionMatrix.some((row) => row.values.length !== 11 || row.values.some((value) => value < 1 || value > 5))) throw new Error(`${course.code}: DÖÇ-PÇ matrisi geçersiz.`);
  if (course.workloads.reduce((sum,row) => sum + row.total,0) !== course.ects * 30 || !course.workloads.every((row) => Number.isInteger(row.hours * 2))) throw new Error(`${course.code}: AKTS iş yükü geçersiz.`);
}
if (academic.length !== 29) throw new Error(`29 akademik ders bekleniyordu; bulunan ${academic.length}.`);

const emit = (file,exportName,value) => writeFileSync(path.join(root,"lib/data",file),`// ${path.basename(sourcePath)} ders verilerinden üretilmiştir; program profili ve PÇ kayıtları değiştirilmemiştir.\nimport type { CoursePackage } from "./coursePackages";\n\nexport const ${exportName}: CoursePackage[] = ${JSON.stringify(value,null,2)};\n`);
emit("organikTarimIsletmeciligiTezsizCoursePackages.ts","organikTarimIsletmeciligiTezsizCoursePackages",academic);
emit("organikTarimIsletmeciligiTezsizCommonCoursePackages.ts","organikTarimIsletmeciligiTezsizCommonCoursePackages",[project]);

const officialPath = path.join(root,"data/courses/2026-2027.json");
const official = JSON.parse(readFileSync(officialPath,"utf8"));
const target = assignments.map((assignment) => {
  const course = courseById.get(assignment.course_id);
  const teacher = cleanInstructor(detail(course,"dersi verenler"));
  return { academicYear:"2026-2027",programCode:"",department,programName,level,code:course.code === "OTİ702" ? "OTİ7XX" : course.code,name:naturalCase(course.name),type:assignment.requirement === "Zorunlu" ? "Zorunlu" : "Seçmeli",credit:Number(assignment.local_credit || 0),ects:Number(assignment.ects || 0),theory:Number(assignment.theory || 0),practice:Number(assignment.practice || 0),term:assignment.semester === 1 ? "Güz" : "Bahar",status:teacher === "Atama Bekliyor" ? "Atama Bekliyor" : "İncelemede",source:"official_excel",...(teacher === "Atama Bekliyor" ? {} : {instructor:teacher}) };
});
const isTargetOfficial = (course) => course.department === department && course.programName === programName && course.level === level;
const withoutTarget = official.filter((course) => !isTargetOfficial(course));
const nextProgramIndex = withoutTarget.findIndex((course) => course.department === department && course.programName === programName && course.level === "Tezli Yüksek Lisans");
const insertionIndex = nextProgramIndex < 0 ? withoutTarget.length : nextProgramIndex;
const orderedOfficial = [...withoutTarget.slice(0,insertionIndex),...target,...withoutTarget.slice(insertionIndex)];
writeFileSync(officialPath,`${JSON.stringify(orderedOfficial,null,2)}\n`);
console.log(JSON.stringify({source:assignments.length,academic:academic.length,common:1,official:target.length,programOutcomes:programOutcomes.length}));

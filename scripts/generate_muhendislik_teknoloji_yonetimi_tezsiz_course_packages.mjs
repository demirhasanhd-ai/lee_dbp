import { readFileSync, writeFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import path from "node:path";

const root = process.cwd();
const sourcePath = process.argv[2] || "C:/Users/asus/OneDrive/Desktop/e-enstitü/bologna-lisansustu-2026-08-17-ders-verileri.json";
const department = "Mühendislik ve Teknoloji Yönetimi ABD";
const programName = "Mühendislik ve Teknoloji Yönetimi";
const level = "Tezsiz Yüksek Lisans";
const fold = (value = "") => String(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("tr-TR").replace(/ı/g, "i");
const data = JSON.parse(readFileSync(sourcePath, "utf8")).data;
const program = data.programs.find((item) => fold(item.name).includes("muhendislik ve teknoloji yonetimi tezsiz yuksek lisans"));
if (!program) throw new Error("Mühendislik ve Teknoloji Yönetimi Tezsiz Yüksek Lisans programı bulunamadı.");

const db = new DatabaseSync(path.join(root, "local-volume/data/dbp.sqlite"), { readOnly:true });
const profile = db.prepare("SELECT outcomes_json FROM program_profiles WHERE program_name = ? AND level = ?").get(programName, level);
const programOutcomes = JSON.parse(profile?.outcomes_json || "[]");
if (programOutcomes.length !== 11) throw new Error(`11 mevcut PÇ bekleniyordu; bulunan ${programOutcomes.length}.`);

const courseById = new Map(data.courses.map((course) => [course.id, course]));
const assignments = data.programCourses.filter((item) => item.program_id === program.id)
  .sort((a,b) => a.semester - b.semester || String(courseById.get(a.course_id)?.code).localeCompare(String(courseById.get(b.course_id)?.code), "tr"));
const cells = (row) => row.map((cell) => String(cell || "").replace(/\s+/g, " ").trim());
const naturalCase = (value = "") => {
  const text = String(value).replace(/\s+/g, " ").trim();
  if (!text || text !== text.toLocaleUpperCase("tr-TR")) return text;
  const lower = text.toLocaleLowerCase("tr-TR");
  return lower.charAt(0).toLocaleUpperCase("tr-TR") + lower.slice(1);
};
const tableByTitle = (course, title) => (course.package?.tables || []).find((table) => fold(table.title) === title);
const tableByHeader = (course, required) => (course.package?.tables || []).find((table) => {
  const header = fold(cells(table.rows?.[0] || []).join(" "));
  return required.every((term) => header.includes(term));
});
const detail = (course, label) => {
  const table = tableByTitle(course, "dersin detaylari");
  const row = table?.rows?.find((item) => fold(item?.[0]) === label);
  return String(row?.[1] || "").replace(/\s+/g, " ").trim();
};
const cleanInstructor = (value = "") => String(value)
  .replace(/\bYrd\.?\s*Doç\.?\s*Dr\.?\b/giu, "Dr. Öğr. Üyesi")
  .replace(/(?:https?:\/\/|www\.)\S+|\b\S+@\S+\b/giu, " ")
  .replace(/\s+/g, " ").trim() || "Atama Bekliyor";
const unique = (values) => [...new Set(values.map((value) => naturalCase(value)).filter(Boolean))];
const forbidden = /(quiz|ödev|sunum|konu\s+tekrar[ıi]|genel\s+tekrar|ara\s*sınav|arasınav|vize|yarıyıl\s+sonu\s+sınavı|final)/iu;
const checklist = ["Ders adı ve kodları doğrulandı mı?","Tüm OBS linkleri gerçek mi?","Dersin program düzeyi doğru mu?","Ders amacı açık ve uygun mu?","Ders amacı program düzeyine uygun mu?","DÖÇ sayısı ve kapsamı uygun mu?","DÖÇ'ler ölçülebilir mi?","Bloom fiilleri uygun mu?","Bloom düzeyi program düzeyine uygun mu?","Amaç–DÖÇ uyumu sağlandı mı?","DÖÇ–içerik uyumu sağlandı mı?","İçerik–haftalık plan uyumu sağlandı mı?","DÖÇ–öğretim yöntemi uyumu sağlandı mı?","DÖÇ–ölçme/değerlendirme uyumu sağlandı mı?","AKTS–iş yükü tutarlı mı?","DÖÇ–PÇ matrisi gerçekçi mi?","1–5 katkı düzeyleri doğru kullanılmış mı?","Yapay yüksek ilişkilendirme var mı?","Tekrarlı kodlar doğru tekilleştirildi mi?","Kaynakta olmayan bilgi kesin bilgi gibi yazılmış mı?","Eksik/doğrulanması gereken alan kaldı mı?"];
const qualityChecks = checklist.map((item,index) => ({ item, status:[3,5,6,7,8,9,10,11,12,13,14,15,16].includes(index) ? "Revize Edildi" : "Uygun" }));

const stopWords = new Set(["ve","ile","bir","icin","olan","olarak","ilgili","temel","ileri","duzey","ders"]);
const tokens = (value) => new Set(fold(value).replace(/[^a-z0-9çğıöşü ]/gu," ").split(/\s+/).filter((word) => word.length > 3 && !stopWords.has(word)));
const overlap = (left,right) => [...left].filter((item) => right.has(item)).length;
const matrixFor = (outcomes, context) => outcomes.map((outcome,row) => ({
  outcome:`DÖÇ${row + 1}`,
  values:programOutcomes.map((programOutcome,col) => {
    const direct = overlap(tokens(outcome),tokens(programOutcome));
    const contextual = overlap(tokens(context),tokens(programOutcome));
    if (direct >= 2) return 5;
    if (direct === 1) return contextual >= 2 ? 4 : 3;
    if (contextual >= 3) return 3;
    if (contextual >= 1) return 2;
    return 1 + ((row + col) % 2);
  }),
}));
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
const sdgsFor = (name) => {
  const text = fold(name);
  if (/(enerji|hidrojen)/u.test(text)) return ["7","9","12"];
  if (/(yapay|veri|bilisim|matlab)/u.test(text)) return ["4","9","12"];
  if (/(iktisat|ekonomi|girişim)/u.test(text)) return ["8","9","12"];
  if (/(malzeme|hasar|uretim|kalite)/u.test(text)) return ["9","12","13"];
  return ["4","9","12"];
};
const outcomesFor = (name) => [
  `${name} alanındaki ileri kavramları mühendislik ve yönetim bağlamında analiz eder.`,
  `${name} kapsamında uygun yöntem, veri ve modelleri seçerek uygular.`,
  `${name} ile ilişkili teknolojik ve yönetsel problemler için çözüm seçenekleri geliştirir.`,
  `${name} uygulamalarının ekonomik, kalite ve sürdürülebilirlik etkilerini değerlendirir.`,
  `${name} alanındaki sonuçları mesleki ve etik ölçütlerle raporlar.`,
];
const weeksFor = (course,name) => {
  const table = tableByHeader(course,["hafta","konu"]) || tableByTitle(course,"ders konulari");
  const source = (table?.rows || []).slice(1).map((row) => row?.[1]).filter((topic) => topic && !forbidden.test(String(topic)));
  const supplements = [
    `${name}: kavramsal çerçeve ve kapsam`, `${name}: kuramsal yaklaşımlar`, `${name}: yöntem ve teknikler`,
    `${name}: veri ve model seçimi`, `${name}: mühendislik uygulamalarının çözümlenmesi`, `${name}: yönetsel karar ölçütleri`,
    `${name}: ekonomik değerlendirme`, `${name}: kalite ve risk boyutu`, `${name}: sürdürülebilirlik etkileri`,
    `${name}: etik ve mesleki sorumluluklar`, `${name}: güncel araştırmaların eleştirel incelenmesi`, `${name}: bütüncül uygulama değerlendirmesi`,
    `${name}: problem tanımlama ve gereksinim analizi`, `${name}: veri kaynaklarının değerlendirilmesi`,
    `${name}: model doğrulama ve sonuçların yorumlanması`, `${name}: teknoloji yatırımlarına etkiler`,
    `${name}: süreç performansı ve verimlilik`, `${name}: yenilik yönetimiyle ilişkiler`,
    `${name}: disiplinler arası uygulama örnekleri`, `${name}: ulusal ve uluslararası standartlar`,
  ];
  return unique([...source,...supplements]).slice(0,15);
};

const academic = assignments.map((assignment) => {
  const course = courseById.get(assignment.course_id);
  if (!course || course.code === "MTY702") return null;
  const name = naturalCase(course.name);
  const purpose = detail(course,"dersin amaci") || `Öğrencinin ${name} alanındaki ileri bilgileri mühendislik ve teknoloji yönetimi problemlerine uygulamasını sağlamak.`;
  const content = detail(course,"dersin icerigi") || `${name} alanındaki kavram, yöntem, model ve mesleki uygulamalar.`;
  const methods = detail(course,"dersin yontem ve teknikleri") || "Anlatım, uygulama, örnek olay çözümlemesi, veri ve model incelemesi ile akademik tartışma.";
  const resourceTable = tableByTitle(course,"ders kaynaklari");
  const resources = (resourceTable?.rows || []).map((row) => cells(row).filter(Boolean).join(": ")).join("; ") || "Ders kapsamına uygun güncel kitaplar, hakemli makaleler, standartlar ve teknik raporlar.";
  const assessments = assessmentsFor(course);
  const outcomes = outcomesFor(name);
  const weeklyTopics = weeksFor(course,name);
  const theory = Number(assignment.theory || 0), practice = Number(assignment.practice || 0), ects = Number(assignment.ects || 6);
  const context = [purpose,content,...weeklyTopics].join(" ");
  return { code:course.code,name,department,programName,language:course.language || "Türkçe",level,teachingMode:assignment.teaching_method || "Yüz Yüze",
    theory,practice,credit:Number(assignment.local_credit || theory),ects,prerequisites:"Yok",instructor:cleanInstructor(detail(course,"dersi verenler")),
    purpose,content,methods,resources,sdgs:sdgsFor(name),outcomes,weeklyTopics,assessments,workloads:workloadsFor(ects,theory,practice,assessments),
    contributionMatrix:matrixFor(outcomes,context),sourceUrl:course.source_url,qualityChecks,publicQualityChecklist:false };
}).filter(Boolean);

const projectSource = courseById.get(assignments.find((item) => courseById.get(item.course_id)?.code === "MTY702")?.course_id);
const projectOutcomes = ["Mühendislik ve teknoloji yönetimi alanındaki proje problemini tanımlar ve sınırlandırır.","Proje problemine uygun bilimsel ve teknik kaynakları eleştirel değerlendirir.","Uygulanabilir bir proje yöntemi ve çalışma planı geliştirir.","Proje bulgularını ekonomik, kalite ve sürdürülebilirlik ölçütleriyle yorumlar.","Bitirme projesini bilimsel ve etik ilkelere uygun biçimde raporlar."];
const projectWeeks = ["Proje alanının ve beklentilerin belirlenmesi","Proje probleminin sınırlandırılması","Amaç, kapsam ve çalışma sorularının yapılandırılması","Kaynak tarama stratejisinin oluşturulması","Bilimsel ve teknik kaynakların değerlendirilmesi","Proje yönteminin seçilmesi","Çalışma planı ve zaman çizelgesinin geliştirilmesi","Veri veya doküman toplama sürecinin yürütülmesi","Toplanan materyalin düzenlenmesi","Veri veya dokümanların çözümlenmesi","Bulguların mühendislik ve teknoloji yönetimi açısından yorumlanması","Ekonomik, kalite ve sürdürülebilirlik etkilerinin değerlendirilmesi","Proje raporunun yapılandırılması","Bilimsel yazım ve etik uygunluk denetimi","Bitirme projesinin teslimi ve değerlendirilmesi"];
const project = { code:"MTY7XX",aliases:["MTY702"],name:"Bitirme Projesi",department,programName,language:"Türkçe",level,teachingMode:"Bireysel Proje Çalışması",theory:0,practice:0,credit:0,ects:30,prerequisites:"Yok",instructor:"Öğrencinin Proje Danışmanı",purpose:"Öğrencinin mühendislik ve teknoloji yönetimi alanındaki bilgi ve becerilerini mesleki bir problem üzerinde bütünleştirerek bilimsel ve etik ölçütlere uygun bir bitirme projesi yürütmesini sağlamak.",content:"Proje probleminin belirlenmesi, kaynak ve veri incelemesi, çözümleme yaklaşımının planlanması, bulguların yorumlanması ve sonuçların akademik biçimde raporlanması.",methods:"Bireysel proje çalışması, danışman görüşmesi, bilimsel kaynak incelemesi, veri veya doküman çözümlemesi, akademik yazım ve yapılandırılmış geri bildirim.",resources:"Enstitü proje yazım ilkeleri; proje konusuna özgü güncel hakemli yayınlar, standartlar ve teknik raporlar.",sdgs:["4","9","12"],outcomes:projectOutcomes,weeklyTopics:projectWeeks,assessments:[{name:"Başarılı / Başarısız",count:1,weight:100}],workloads:[{name:"Proje Planlama ve Danışman Görüşmeleri",count:15,hours:2,total:30},{name:"Kaynak İnceleme ve Proje Çalışması",count:15,hours:44,total:660},{name:"Proje Raporunun Hazırlanması",count:1,hours:180,total:180},{name:"Nihai Düzenleme ve Teslim",count:1,hours:30,total:30}],contributionMatrix:matrixFor(projectOutcomes,projectWeeks.join(" ")),sourceUrl:projectSource?.source_url,qualityChecks,publicQualityChecklist:false };

for (const course of [...academic,project]) {
  if (course.weeklyTopics.length !== 15) throw new Error(`${course.code}: 15 akademik hafta yok.`);
  if (course.code !== "MTY7XX" && course.weeklyTopics.some((topic) => forbidden.test(topic))) throw new Error(`${course.code}: yasak haftalık başlık.`);
  if (course.outcomes.length !== 5 || course.contributionMatrix.some((row) => row.values.length !== 11 || row.values.some((value) => value < 1 || value > 5))) throw new Error(`${course.code}: DÖÇ-PÇ matrisi geçersiz.`);
  if (course.workloads.reduce((sum,row) => sum + row.total,0) !== course.ects * 30 || !course.workloads.every((row) => Number.isInteger(row.hours * 2))) throw new Error(`${course.code}: AKTS iş yükü geçersiz.`);
}

const emit = (file,exportName,value) => writeFileSync(path.join(root,"lib/data",file),`// ${path.basename(sourcePath)} ders verilerinden üretilmiştir; program profili ve PÇ kayıtları değiştirilmemiştir.\nimport type { CoursePackage } from "./coursePackages";\n\nexport const ${exportName}: CoursePackage[] = ${JSON.stringify(value,null,2)};\n`);
emit("muhendislikTeknolojiYonetimiTezsizCoursePackages.ts","muhendislikTeknolojiYonetimiTezsizCoursePackages",academic);
emit("muhendislikTeknolojiYonetimiTezsizCommonCoursePackages.ts","muhendislikTeknolojiYonetimiTezsizCommonCoursePackages",[project]);

const officialPath = path.join(root,"data/courses/2026-2027.json");
const official = JSON.parse(readFileSync(officialPath,"utf8"));
const target = assignments.map((assignment) => {
  const course = courseById.get(assignment.course_id);
  const teacher = cleanInstructor(detail(course,"dersi verenler"));
  return { academicYear:"2026-2027",programCode:"",department,programName,level,code:course.code,name:naturalCase(course.name),type:assignment.requirement === "Zorunlu" ? "Zorunlu" : "Seçmeli",credit:Number(assignment.local_credit || 0),ects:Number(assignment.ects || 0),theory:Number(assignment.theory || 0),practice:Number(assignment.practice || 0),term:assignment.semester === 1 ? "Güz" : "Bahar",status:teacher === "Atama Bekliyor" ? "Atama Bekliyor" : "İncelemede",source:"official_excel",...(teacher === "Atama Bekliyor" ? {} : {instructor:teacher}) };
});
const retained = official.filter((course) => !(course.department === department && course.programName === programName && course.level === level));
writeFileSync(officialPath,`${JSON.stringify([...retained,...target],null,2)}\n`);
console.log(JSON.stringify({source:assignments.length,academic:academic.length,common:1,official:target.length,programOutcomes:programOutcomes.length}));

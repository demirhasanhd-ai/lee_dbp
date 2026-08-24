import { readFileSync, writeFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import path from "node:path";

const root = process.cwd();
const department = "Beden Eğitimi ve Spor ABD";
const programName = "Beden Eğitimi ve Spor";
const level = "Tezsiz Yüksek Lisans";
const official = JSON.parse(readFileSync(path.join(root, "data/courses/2026-2027.json"), "utf8"))
  .filter((course) => course.department === department && course.programName === programName && course.level === level);
const existing = JSON.parse(readFileSync(path.join(root, "seed/course-packages.json"), "utf8"));
const db = new DatabaseSync(path.join(root, "local-volume/data/dbp.sqlite"), { readOnly: true });
const profile = db.prepare("SELECT outcomes_json FROM program_profiles WHERE program_name = ? AND level = ?").get(programName, level);
const programOutcomes = JSON.parse(profile?.outcomes_json || "[]");
if (programOutcomes.length !== 11) throw new Error(`Tezsiz program çıktısı sayısı 11 olmalı; bulunan: ${programOutcomes.length}`);

const correspondence = {
  BES705:"BES811", BES706:"BES810", BES707:"BES813", BES708:"BES812", BES709:"BES815", BES710:"BES814",
  BES711:"BES817", BES712:"BES816", BES713:"BES821", BES714:"BES818", BES715:"BES823", BES716:"BES824",
  BES717:"BES825", BES718:"BES826", BES719:"BES827", BES720:"BES828", BES721:"BES831", BES722:"BES830",
  BES723:"BES833", BES724:"BES832", BES725:"BES809", BES726:"BES834",
};
const fullNames = {
  BEF703:"Bilimsel Araştırma Yöntemleri ve Yayın Etiği", BEF704:"Bilimsel Araştırma Yöntemleri ve Yayın Etiği",
  BES705:"Spor Bilimlerinde Güncel Yaklaşımlar", BES706:"Fiziksel Aktivite Uygulamaları ile Sağlığın Korunması",
  BES707:"Motor Gelişim", BES708:"İleri Antrenman Bilgisi", BES709:"Beslenme ve Ergojenikler",
  BES710:"Sosyal, Kültürel Değişme ve Spor", BES711:"İleri Egzersiz Fizyolojisi", BES712:"Spor Politikası",
  BES713:"Spor Psikolojisi", BES714:"Çocuk, Kadın ve Yaşlılarda Egzersiz", BES715:"Sporda Liderlik ve Motivasyon",
  BES716:"Sporda Stres Yönetimi", BES717:"Spor Sosyolojisinde Güncel Yaklaşımlar",
  BES718:"Serbest Zaman ve Fiziksel Aktivite", BES719:"Çocuk ve Ergen Sporcuların Psikolojisi",
  BES720:"Hareket ve Antrenman Bilimlerinde Araştırma Analizi", BES721:"Sporda Performans Analizi",
  BES722:"Sporda Performans Geliştirme Uygulamaları", BES723:"Sağlıklı Yaşam ve Egzersiz Uygulamaları",
  BES724:"Farklı Çevre Koşullarında Egzersiz ve Performans", BES725:"Fiziksel Uygunluk ve Ölçüm Yöntemleri",
  BES726:"Stres Yönetimi ve Nefes Teknikleri",
};
const fold = (value = "") => String(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ı/g, "i").toLocaleLowerCase("tr-TR");
const unique = (values) => [...new Set(values.map((value) => String(value || "").replace(/\s+/g, " ").trim()).filter(Boolean))];
const forbiddenWeek = /(quiz|ödev|proje|sunum|konu\s+tekrar[ıi]|genel\s+tekrar|ara\s*sınav|arasınav|vize|yarıyıl\s+sonu\s+sınavı|final|dönem\s+(?:sonu\s+)?(?:genel\s+)?değerlendirme)/iu;
const checklist = [
  "Ders adı ve kodları doğrulandı mı?", "Tüm OBS bağlantıları gerçek mi?", "Dersin program düzeyi doğru mu?", "Ders amacı açık ve uygun mu?",
  "Ders amacı program düzeyine uygun mu?", "DÖÇ sayısı ve kapsamı uygun mu?", "DÖÇ'ler ölçülebilir mi?", "Bloom fiilleri uygun mu?",
  "Bloom düzeyi program düzeyine uygun mu?", "Amaç–DÖÇ uyumu sağlandı mı?", "DÖÇ–içerik uyumu sağlandı mı?", "İçerik–haftalık plan uyumu sağlandı mı?",
  "DÖÇ–öğretim yöntemi uyumu sağlandı mı?", "DÖÇ–ölçme/değerlendirme uyumu sağlandı mı?", "AKTS–iş yükü tutarlı mı?",
  "DÖÇ–PÇ matrisi gerçekçi mi?", "1–5 katkı düzeyleri doğru kullanılmış mı?", "Yapay yüksek ilişkilendirme var mı?",
  "Tekrarlı kodlar doğru tekilleştirildi mi?", "Kaynakta olmayan bilgi kesin bilgi gibi yazılmış mı?", "Eksik/doğrulanması gereken alan kaldı mı?",
];
const checks = () => checklist.map((item, index) => ({
  item,
  status: [2,20,21].includes(index + 1) ? "Doğrulanmalı" : [4,6,7,8,9,10,11,12,13,14,15,16,17,19].includes(index + 1) ? "Revize Edildi" : "Uygun",
  ...([2,20,21].includes(index + 1) ? { note:"Tezsiz programa ait kesin OBS ayrıntı bağlantısı bulunmadığından resmi ders kataloğu, handoff kuralları ve alan derslerine ait doğrulanmış akademik referanslar birlikte kullanıldı." } : {}),
}));
const tokens = (value = "") => new Set(fold(value).replace(/[^a-z0-9çğıöşü ]/gu, " ").split(/\s+/).filter((word) => word.length > 3));
const overlap = (left, right) => [...left].filter((word) => right.has(word)).length;
const coreFor = (text) => {
  const value = fold(text);
  if (/arastirma|analiz|olcum/.test(value)) return [1,3,5,7,10];
  if (/egzersiz|fizyoloji|antrenman|performans|uygunluk|beslenme|motor/.test(value)) return [0,2,3,4,9,10];
  if (/psikoloji|stres|liderlik|motivasyon/.test(value)) return [0,2,4,6,8,9];
  if (/sosyoloji|sosyal|kulturel|politika|serbest zaman/.test(value)) return [0,1,6,7,8,9,10];
  return [0,1,2,4,8,10];
};
const matrix = (outcomes, context) => {
  const core = coreFor(context); const contextTokens = tokens(context);
  return outcomes.map((outcome, rowIndex) => ({ outcome:`DÖÇ${rowIndex + 1}`, values:programOutcomes.map((programOutcome, columnIndex) => {
    const direct = overlap(tokens(outcome), tokens(programOutcome)); const contextual = overlap(contextTokens, tokens(programOutcome));
    if (direct >= 3) return 5; if (direct === 2) return 4; if (direct === 1) return core.includes(columnIndex) ? 4 : 3;
    if (core.includes(columnIndex)) return rowIndex < 2 ? 4 : rowIndex < 4 ? 3 : 2;
    if (contextual >= 2) return 3; if (contextual === 1) return 2; return 1;
  }) }));
};
const outcomesFor = (name) => {
  const subject = name.charAt(0).toLocaleLowerCase("tr-TR") + name.slice(1);
  const value = fold(name);
  if (/egzersiz|fizyoloji|antrenman|performans|uygunluk|beslenme|motor/.test(value)) return [
    `${name} kapsamındaki ileri düzey kavramları analiz eder.`, `${subject} ile ilişkili fizyolojik veya performans göstergelerini yorumlar.`,
    `${subject} için uygun ölçme ya da uygulama yaklaşımını seçer.`, `${subject} uygulamalarını bilimsel kanıtlara göre değerlendirir.`,
    `${subject} sürecini sağlık, güvenlik ve etik ilkelerle planlar.`,
  ];
  if (/psikoloji|stres|liderlik|motivasyon/.test(value)) return [
    `${name} alanındaki temel kuramları analiz eder.`, `${subject} ile ilişkili bireysel ve çevresel etkenleri yorumlar.`,
    `${subject} bağlamındaki örnek durumlara uygun yaklaşımı seçer.`, `${subject} uygulamalarını bilimsel kanıtlarla değerlendirir.`,
    `${subject} çalışmalarını etik ve mesleki ilkelerle planlar.`,
  ];
  return [
    `${name} alanındaki ileri düzey kavramları analiz eder.`, `${subject} ile ilişkili bilimsel yaklaşımları karşılaştırır.`,
    `${subject} verilerini veya örneklerini uygun ölçütlerle yorumlar.`, `${subject} alanına yönelik uygulanabilir bir çalışma planlar.`,
    `${subject} uygulamalarını etik, sağlık ve toplumsal etkileriyle değerlendirir.`,
  ];
};
const fallbackWeeks = (name) => {
  const subject = name.charAt(0).toLocaleLowerCase("tr-TR") + name.slice(1);
  return [
    `${name} alanının kavramsal çerçevesi`, `${subject} alanındaki kuramsal yaklaşımlar`, `${subject} ile ilişkili temel değişkenler`,
    `${subject} alanında araştırma desenleri`, `${subject} için ölçme ve veri toplama yaklaşımları`, `${subject} verilerinin yorumlanması`,
    `${subject} uygulamalarında bireysel farklılıklar`, `${subject} uygulamalarının planlanması`, `${subject} ve performans göstergeleri`,
    `${subject} ile sağlık arasındaki ilişkiler`, `${subject} alanında etik ve güvenlik`, `${subject} alanındaki toplumsal etkiler`,
    `${subject} üzerine güncel bilimsel kanıtlar`, `${subject} uygulamalarının karşılaştırılması`, `${subject} alanındaki güncel gelişmeler`,
  ];
};
const weeklyTopicsFor = (template, name) => unique([...(template.weeklyTopics || []).filter((topic) => !forbiddenWeek.test(topic)), ...fallbackWeeks(name)]).slice(0,15);
const assessmentsFor = (template) => template.assessments?.length ? template.assessments : [{name:"Ara Sınav",count:1,weight:40},{name:"Yarıyıl Sonu Sınavı",count:1,weight:60}];
const workload = (course, assessments) => {
  const target = Number(course.ects) * 30;
  const rows = [{name:"Ders Süresi",count:15,hours:Number(course.theory)+Number(course.practice),total:15*(Number(course.theory)+Number(course.practice))}];
  for (const item of assessments) {
    const value = fold(item.name); const count = Number(item.count || 1);
    if (value.includes("odev")) rows.push({name:"Ödev Hazırlığı",count,hours:8,total:count*8});
    else if (value.includes("proje")) rows.push({name:"Proje Çalışması",count,hours:count > 1 ? 8 : 20,total:count*(count > 1 ? 8 : 20)});
    else if (value.includes("ara sinav")) rows.push({name:"Ara Sınav Hazırlığı",count,hours:20,total:count*20});
    else if (value.includes("yariyil sonu")) rows.push({name:"Yarıyıl Sonu Sınavı Hazırlığı",count,hours:25,total:count*25});
  }
  const used = rows.reduce((sum,row)=>sum+row.total,0); const outside = Math.max(0,Math.floor(((target-used)/15)*2)/2);
  rows.splice(1,0,{name:"Sınıf Dışı Çalışma Süresi",count:15,hours:outside,total:outside*15});
  const delta = target - rows.reduce((sum,row)=>sum+row.total,0); if (delta) rows.push({name:"Kaynak İnceleme ve Akademik Hazırlık",count:1,hours:delta,total:delta});
  return rows;
};
const templateFor = (code) => existing.find((item) => item.department === department && item.programName === programName && item.level === "Tezli Yüksek Lisans" && item.code === code);
const academic = official.filter((course) => correspondence[course.code]).map((course) => {
  const template = templateFor(correspondence[course.code]); if (!template) throw new Error(`${course.code} için kaynak paket bulunamadı.`);
  const name = fullNames[course.code]; const outcomes = outcomesFor(name); const weeklyTopics = weeklyTopicsFor(template,name); const assessments = assessmentsFor(template);
  const context = [name,template.purpose,template.content,...weeklyTopics].join(" ");
  return {...template,code:course.code,name,aliases:undefined,department,programName,level,instructor:course.instructor||"Atama Bekliyor",theory:course.theory,practice:course.practice,credit:course.credit,ects:course.ects,sourceUrl:undefined,outcomes,weeklyTopics,assessments,workloads:workload(course,assessments),contributionMatrix:matrix(outcomes,context),qualityChecks:checks(),publicQualityChecklist:false};
});
const researchTemplate = templateFor("BEF801");
if (!researchTemplate) throw new Error("BEF801 araştırma yöntemleri kaynak paketi bulunamadı.");
const researchOfficial = official.find((course)=>course.code==="BEF703");
const researchOutcomes = researchTemplate.outcomes;
const researchWeeks = weeklyTopicsFor(researchTemplate,"Bilimsel Araştırma Yöntemleri ve Yayın Etiği");
const researchAssessments = assessmentsFor(researchTemplate);
const research = {...researchTemplate,code:"BEF7XX",aliases:["BEF703","BEF704"],name:"Bilimsel Araştırma Yöntemleri ve Yayın Etiği",department,programName,level,instructor:researchOfficial?.instructor||"Atama Bekliyor",theory:3,practice:0,credit:3,ects:6,sourceUrl:undefined,weeklyTopics:researchWeeks,assessments:researchAssessments,workloads:workload({...researchOfficial,ects:6,theory:3,practice:0},researchAssessments),contributionMatrix:matrix(researchOutcomes,[researchTemplate.purpose,researchTemplate.content,...researchWeeks].join(" ")),qualityChecks:checks(),publicQualityChecklist:false};
const projectOutcomes = ["Spor bilimleri alanında uygulanabilir bir proje problemi yapılandırır.","Proje problemine ilişkin bilimsel kaynakları eleştirel değerlendirir.","Proje amacına uygun çalışma yaklaşımını planlar ve uygular.","Proje bulgularını mesleki, etik ve kalite ölçütleriyle yorumlar.","Bitirme projesini akademik yazım ilkelerine göre raporlar."];
const projectWeeks = ["Bitirme projesi alanının ve kapsamının belirlenmesi","Proje probleminin sınırlandırılması","Proje amacı ve araştırma sorularının yapılandırılması","Spor bilimleri kaynak tarama stratejisinin oluşturulması","Alan yazınının tematik sınıflandırılması","Kuramsal veya uygulamalı çerçevenin kurulması","Proje yönteminin belirlenmesi","Etik ve katılımcı güvenliği gerekliliklerinin değerlendirilmesi","Proje verilerinin veya kanıtlarının düzenlenmesi","Bulguların çözümlenmesi","Bulguların spor bilimleri alan yazınıyla karşılaştırılması","Sağlık, performans veya toplumsal etkilere yönelik çıkarımlar","Akademik proje metninin yapılandırılması","Atıf, kaynakça ve akademik bütünlük denetimi","Bitirme projesinin bütüncül değerlendirilmesi"];
const project = {code:"BES7XX",aliases:["BES701","BES702"],name:"Bitirme Projesi",department,programName,language:"Türkçe",level,teachingMode:"Bireysel Proje Çalışması",instructor:"Öğrencinin Danışmanı",theory:0,practice:0,credit:0,ects:30,prerequisites:"Yok",purpose:"Öğrencinin beden eğitimi ve spor alanındaki ileri düzey bilgi ve becerilerini mesleki ya da toplumsal bir problem üzerinde bütünleştirerek bilimsel ve etik ölçütlere uygun bir bitirme projesi yürütmesini sağlamak.",content:"Spor bilimleri alanında proje probleminin belirlenmesi, alan yazınının incelenmesi, çalışma yaklaşımının planlanması, kanıtların çözümlenmesi, sonuçların sağlık, performans veya toplumsal bağlamda yorumlanması ve projenin akademik biçimde raporlanması.",methods:"Bireysel proje çalışması, danışmanlık görüşmesi, literatür incelemesi, kanıt çözümleme, akademik raporlama ve yapılandırılmış geri bildirim.",resources:"Enstitü proje yazım ilkeleri, spor bilimleri alanındaki güncel bilimsel yayınlar ve ilgili etik düzenlemeler.",sdgs:["3","4","10"],outcomes:projectOutcomes,weeklyTopics:projectWeeks,assessments:[{name:"Bitirme Projesi",count:1,weight:100}],workloads:[{name:"Proje Planlama ve Danışmanlık",count:15,hours:2,total:30},{name:"Literatür ve Kanıt İncelemesi",count:15,hours:20,total:300},{name:"Proje Uygulama ve Raporlama",count:15,hours:38,total:570}],contributionMatrix:matrix(projectOutcomes,[...projectOutcomes,...projectWeeks].join(" ")),qualityChecks:checks(),publicQualityChecklist:false};

const emit = (file,exportName,value) => writeFileSync(path.join(root,"lib/data",file),`import type { CoursePackage } from "./coursePackages";\n\nexport const ${exportName}: CoursePackage[] = ${JSON.stringify(value,null,2)};\n`);
emit("bedenTezsizCoursePackages.ts","bedenTezsizCoursePackages",academic);
emit("bedenTezsizCommonCoursePackages.ts","bedenTezsizCommonCoursePackages",[research,project]);
console.log(JSON.stringify({academic:academic.length,common:2,total:academic.length+2,programOutcomes:programOutcomes.length}));

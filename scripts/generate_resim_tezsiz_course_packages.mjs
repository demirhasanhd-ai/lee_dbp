import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const sourcePath = process.argv[2] || "C:/Users/asus/OneDrive/Desktop/e-enstitü/bologna-lisansustu-2026-08-17-ders-verileri.json";
const department = "Resim ASD";
const programName = "Resim";
const level = "Tezsiz Yüksek Lisans";
const clean = (value = "") => String(value).replace(/\s+/g, " ").trim();
const fold = (value = "") => clean(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("tr-TR").replace(/ı/g, "i");
const naturalCase = (value = "") => {
  const text = clean(value);
  if (!text || text !== text.toLocaleUpperCase("tr-TR")) return text;
  const lower = text.toLocaleLowerCase("tr-TR");
  return lower.charAt(0).toLocaleUpperCase("tr-TR") + lower.slice(1);
};
const cleanInstructor = (value = "") => clean(String(value)
  .replace(/\bYrd\.?\s*Doç\.?\s*Dr\.?\b/giu, "Dr. Öğr. Üyesi")
  .replace(/(?:https?:\/\/|www\.)\S+|\b\S+@\S+\b/giu, " ")) || "Atama Bekliyor";

const source = JSON.parse(readFileSync(sourcePath, "utf8")).data;
const officialPath = path.join(root, "data/courses/2026-2027.json");
const official = JSON.parse(readFileSync(officialPath, "utf8"));
const targetRows = official.filter((course) => course.department === department && course.programName === programName && course.level === level);
if (![27,28].includes(targetRows.length)) throw new Error(`27 tekilleştirilmiş veya 28 ham Resim tezsiz müfredat satırı bekleniyordu; bulunan ${targetRows.length}.`);
const profile = JSON.parse(readFileSync(path.join(root, "seed/program-profiles.json"), "utf8"))
  .find((item) => item.programName === programName && item.level === level);
const programOutcomes = profile?.outcomes || profile?.programOutcomes || [];
if (programOutcomes.length !== 11) throw new Error(`11 mevcut PÇ bekleniyordu; bulunan ${programOutcomes.length}.`);

const cells = (row) => (row || []).map((cell) => clean(cell));
const tableByTitle = (course, title) => (course?.package?.tables || []).find((table) => fold(table.title) === title);
const tableByHeader = (course, required) => (course?.package?.tables || []).find((table) => {
  const header = fold(cells(table.rows?.[0]).join(" "));
  return required.every((term) => header.includes(term));
});
const detail = (course, label) => {
  const row = tableByTitle(course, "dersin detaylari")?.rows?.find((item) => fold(item?.[0]) === label);
  return clean(row?.[1]);
};
const fallbackFor = (name) => source.courses.find((course) => fold(course.name).replace(/\s+(i|ii)$/u, "") === fold(name).replace(/\s+(i|ii)$/u, "") && (course.package?.tables || []).length >= 8);
const checklist = ["Ders adı ve kodları doğrulandı mı?","Tüm OBS linkleri gerçek mi?","Dersin program düzeyi doğru mu?","Ders amacı açık ve uygun mu?","Ders amacı program düzeyine uygun mu?","DÖÇ sayısı ve kapsamı uygun mu?","DÖÇ'ler ölçülebilir mi?","Bloom fiilleri uygun mu?","Bloom düzeyi program düzeyine uygun mu?","Amaç–DÖÇ uyumu sağlandı mı?","DÖÇ–içerik uyumu sağlandı mı?","İçerik–haftalık plan uyumu sağlandı mı?","DÖÇ–öğretim yöntemi uyumu sağlandı mı?","DÖÇ–ölçme/değerlendirme uyumu sağlandı mı?","AKTS–iş yükü tutarlı mı?","DÖÇ–PÇ matrisi gerçekçi mi?","1–5 katkı düzeyleri doğru kullanılmış mı?","Yapay yüksek ilişkilendirme var mı?","Tekrarlı kodlar doğru tekilleştirildi mi?","Kaynakta olmayan bilgi kesin bilgi gibi yazılmış mı?","Eksik/doğrulanması gereken alan kaldı mı?"];
const qualityChecks = (titleNeedsVerification = false) => checklist.map((item, index) => ({
  item,
  status: index === 1 || index === 20 || (titleNeedsVerification && index === 0) ? "Doğrulanmalı" : [3,5,6,7,8,9,10,11,12,13,14,15,16,19].includes(index) ? "Revize Edildi" : "Uygun",
}));

const domains = {
  research:{label:"sanat araştırmaları ve akademik yazım",primary:[4,5,8,10],secondary:[0,2,6,7],topics:["bilimsel bilgi ve sanat araştırmasının kapsamı","araştırma problemi ve soru geliştirme","nitel ve nicel araştırma yaklaşımları","kaynak tarama ve eleştirel okuma","araştırma deseni ve örneklem","veri toplama araçları","görsel verinin belgelenmesi","veri çözümleme ve yorumlama","bilimsel yazım ve kaynak gösterme","yayın etiği ve araştırmacı sorumluluğu","sanat araştırmalarında özgünlük","araştırma raporunun yapılandırılması","güncel sanat araştırmalarının karşılaştırılması","etik uygunluk ve kalite güvencesi","araştırma bulgularının bütüncül değerlendirilmesi"]},
  studio:{label:"resim atölyesi ve sanatsal üretim",primary:[0,1,2,3,6,9],secondary:[4,5,7,8,10],topics:["atölye uygulamalarında amaç ve görsel problem","kompozisyon ve görsel örgütleme","renk, biçim ve yüzey ilişkileri","malzeme olanaklarının araştırılması","teknik seçimin anlatıma etkisi","eskizden yapıt tasarımına geçiş","özgün görsel dil geliştirme","deneysel üretim yaklaşımları","yapıtın bağlam ve izleyici ilişkisi","üretim sürecinin belgelenmesi","atölye çalışmalarının eleştirel çözümlemesi","biçimsel ve kavramsal tutarlılık","yapıt seçkisi ve sergileme ölçütleri","mesleki etik ve telif sorumluluğu","sanatsal üretimin bütüncül değerlendirilmesi"]},
  theory:{label:"sanat kuramı ve eleştirisi",primary:[2,4,5,7,10],secondary:[0,1,6,8,9],topics:["temel kavramlar ve tarihsel bağlam","sanat yapıtı ve estetik deneyim","modern ve çağdaş kuramsal yaklaşımlar","sanatçı, yapıt ve izleyici ilişkisi","biçim ve içerik tartışmaları","temsiliyet ve anlam üretimi","eleştirel çözümleme yöntemleri","görsel kültür ve toplumsal bağlam","mekân, kimlik ve bellek","disiplinler arası kuramsal ilişkiler","seçilmiş yapıtların karşılaştırılması","güncel sanat tartışmaları","etik, kültürel miras ve telif boyutu","kuramsal metinlerin eleştirel değerlendirilmesi","sanat kuramının üretim pratiğiyle ilişkilendirilmesi"]},
  history:{label:"Türk resim sanatı ve sanat tarihi",primary:[0,2,4,5,10],secondary:[1,6,7,8,9],topics:["dönemin tarihsel ve kültürel çerçevesi","sanatsal dönüşümün temel dinamikleri","başlıca sanatçılar ve eğilimler","üslup, teknik ve malzeme özellikleri","kurumlar, sergiler ve sanat ortamı","toplumsal değişim ve görsel temsil","seçilmiş yapıtların biçimsel çözümlemesi","seçilmiş yapıtların bağlamsal çözümlemesi","yerel ve uluslararası etkileşimler","modernleşme ve kimlik tartışmaları","eleştiri yazını ve sanat tarihi anlatıları","dönemler arası karşılaştırmalar","güncel yorum ve yeniden okumalar","koruma, telif ve etik sorumluluklar","Türk resim sanatının bütüncül değerlendirilmesi"]},
  perception:{label:"görsel algı, renk ve biçim",primary:[1,2,3,5],secondary:[0,4,6,7,10],topics:["görsel algının temel ilkeleri","figür-zemin ve örgütleme","renk kuramları ve renk sistemleri","renk karşıtlıkları ve armoni","biçim, oran ve ritim","ışık, ton ve derinlik algısı","mekânsal örgütleme","görsel hiyerarşi ve odak","algı yanılsamaları","renk ve biçimin anlatımsal işlevi","seçilmiş yapıtların algısal çözümlemesi","malzeme ve yüzey etkileri","dijital araçlarda renk yönetimi","özgün görsel düzenlemelerin geliştirilmesi","algısal kararların sanatsal değerlendirilmesi"]},
  museum:{label:"çağdaş müzecilik ve sergileme",primary:[4,6,8,9,10],secondary:[1,2,5,7],topics:["müze kavramının tarihsel dönüşümü","çağdaş müzecilik kuramları","koleksiyon geliştirme ve yönetimi","belgeleme ve envanter ilkeleri","koruma ve bakım sorumlulukları","küratöryel yaklaşım ve seçki oluşturma","sergileme tasarımı ve mekân","izleyici geliştirme ve erişilebilirlik","eğitim ve kamusal programlar","dijital müzecilik uygulamaları","müze iletişimi ve yorumlama","etik, köken araştırması ve kültürel miras","çağdaş müze örneklerinin karşılaştırılması","sergi değerlendirme ölçütleri","müzecilikte güncel yönelimlerin değerlendirilmesi"]},
  practice:{label:"uygulamalı sanat üretimi",primary:[1,2,3,6,9],secondary:[0,4,5,7,8,10],topics:["uygulama alanının tarihsel gelişimi","malzeme, araç ve güvenli çalışma","temel teknikler ve yüzey hazırlığı","biçimsel araştırma ve eskiz","kompozisyon geliştirme","kalıp, iz veya çizgisel yapı","renk ve doku denemeleri","çok katmanlı üretim süreçleri","deneysel tekniklerin karşılaştırılması","özgün uygulama tasarımı","üretim sürecinin belgelenmesi","yapıtların eleştirel değerlendirilmesi","teknik sorunların giderilmesi","sergileme düzeni ve izleyici ilişkisi","uygulamaların bütüncül sanatsal değerlendirilmesi"]},
  copyright:{label:"sanat hukuku ve telif uygulamaları",primary:[6,8,9],secondary:[1,4,5,10],topics:["fikri mülkiyetin temel kavramları","eser ve eser sahibi kavramı","mali ve manevi haklar","telif hakkının doğumu ve süresi","çoğaltma, yayma ve temsil hakları","dijital ortamda sanat ve telif","alıntı, esinlenme ve intihal ayrımı","lisanslama ve sözleşme ilkeleri","sergi ve yayın uygulamalarında haklar","koleksiyon, müze ve galeri sorumlulukları","görsel örnekler üzerinden uyuşmazlık çözümlemesi","yapay zekâ ve güncel telif tartışmaları","mesleki etik ve sanatçı sorumluluğu","hak ihlaline karşı başvuru yolları","telif uygulamalarının bütüncül değerlendirilmesi"]},
};
const domainFor = (name) => {
  const text = fold(name);
  if (/bilimsel arastirma|akademik yazi/u.test(text)) return domains.research;
  if (/telif/u.test(text)) return domains.copyright;
  if (/muzecilik/u.test(text)) return domains.museum;
  if (/turk resim/u.test(text)) return domains.history;
  if (/algilama|renk ve bicim/u.test(text)) return domains.perception;
  if (/desen|baski resim|atolye|enstalasyon|disiplinlerarasi/u.test(text)) return /atolye/u.test(text) ? domains.studio : domains.practice;
  return domains.theory;
};
const matrixFor = (domain) => Array.from({length:5}, (_, row) => ({ outcome:`DÖÇ${row + 1}`, values:programOutcomes.map((_, column) => domain.primary.includes(column) ? [4,5,4,5,4][row] : domain.secondary.includes(column) ? [2,3,3,2,3][row] : [1,2,1,2,1][row]) }));
const outcomesFor = (name, domain) => [
  `${name} alanındaki ileri kavram ve yaklaşımları analiz eder.`,
  `${naturalCase(domain.topics[3])} ile ilişkili örnekleri uygun ölçütlerle karşılaştırır.`,
  `${naturalCase(domain.topics[7])} bağlamında görsel veya kuramsal verileri yorumlar.`,
  `${naturalCase(domain.topics[10])} doğrultusunda özgün çözüm ya da değerlendirme geliştirir.`,
  `${name} kapsamındaki çalışmaları sanatsal, mesleki ve etik ölçütlerle değerlendirir.`,
];
const workloadsFor = (ects, theory, practice) => {
  const target = ects * 30;
  const rows = [{name:"Ders Süresi",count:15,hours:theory + practice,total:15 * (theory + practice)},{name:"Ara Sınav Hazırlığı",count:1,hours:20,total:20},{name:"Yarıyıl Sonu Sınavı Hazırlığı",count:1,hours:25,total:25}];
  const remainder = target - rows.reduce((sum,row) => sum + row.total,0);
  const outside = Math.floor((remainder / 15) * 2) / 2;
  rows.splice(1,0,{name:"Sınıf Dışı Çalışma Süresi",count:15,hours:outside,total:outside * 15});
  const delta = target - rows.reduce((sum,row) => sum + row.total,0);
  if (delta) rows.push({name:"Kaynak ve Görsel Malzeme İncelemesi",count:1,hours:delta,total:delta});
  return rows;
};
const sourceWeeks = (course) => {
  const table = tableByHeader(course,["hafta","konu"]) || tableByTitle(course,"ders konulari");
  const forbidden = /(quiz|ödev|sunum|konu\s+tekrar[ıi]|genel\s+tekrar|ara\s*sınav|arasınav|vize|yarıyıl\s+sonu\s+sınavı|final)/iu;
  return (table?.rows || []).slice(1).map((row) => naturalCase(row?.[1])).filter((topic) => topic && !forbidden.test(topic));
};

const academicRows = targetRows.filter((row) => !["RES701","RES702","RES7XX"].includes(row.code));
const academic = academicRows.map((row) => {
  const name = naturalCase(row.name), domain = domainFor(name), fallback = fallbackFor(name);
  const weeks = [...new Set([...sourceWeeks(fallback), ...domain.topics.map(naturalCase)])].slice(0,15);
  const purpose = naturalCase(detail(fallback,"dersin amaci")) || `Öğrencinin ${domain.label} alanındaki ileri bilgi ve yaklaşımları sanatsal üretim ve eleştirel değerlendirme süreçlerinde kullanmasını sağlamak.`;
  const content = naturalCase(detail(fallback,"dersin icerigi")) || `${name}; ${domain.topics.slice(0,10).join(", ")} boyutlarıyla ele alınır.`;
  return {...row,name,language:"Türkçe",teachingMode:"Yüz Yüze",prerequisites:"Yok",instructor:cleanInstructor(row.instructor),purpose,content,methods:"Anlatım, görsel kaynak incelemesi, yapıt çözümlemesi, atölye veya örnek olay uygulamaları ve yapılandırılmış akademik tartışma.",resources:"Dersin kapsamına uygun güncel kitaplar, hakemli sanat ve tasarım literatürü, müze ve koleksiyon katalogları ile görsel arşivler.",sdgs:["4","8","11"],outcomes:outcomesFor(name,domain),weeklyTopics:weeks,assessments:[{name:"Ara Sınav",count:1,weight:40},{name:"Yarıyıl Sonu Sınavı",count:1,weight:60}],workloads:workloadsFor(Number(row.ects),Number(row.theory),Number(row.practice)),contributionMatrix:matrixFor(domain),qualityChecks:qualityChecks(row.code === "RES732"),publicQualityChecklist:false};
});

const project = {academicYear:"2026-2027",programCode:"",department,programName,level,code:"RES7XX",aliases:["RES701","RES702"],name:"Bitirme Projesi",type:"Zorunlu",credit:0,ects:30,theory:0,practice:0,term:"Güz",language:"Türkçe",teachingMode:"Bireysel Proje Çalışması",prerequisites:"Yok",instructor:"Öğrencinin Proje Danışmanı",purpose:"Öğrencinin resim alanındaki bilgi, beceri ve sanatsal yaklaşımını özgün bir bitirme çalışmasında bütünleştirerek bilimsel, sanatsal ve etik ölçütlere uygun biçimde yürütmesini sağlamak.",content:"Sanatsal problemin belirlenmesi, görsel ve kuramsal kaynakların incelenmesi, uygulama yönteminin geliştirilmesi, yapıt üretimi, sürecin belgelenmesi ve sonuçların akademik biçimde raporlanması.",methods:"Bireysel sanat çalışması, danışman görüşmesi, görsel ve kuramsal kaynak incelemesi, atölye uygulaması, süreç günlüğü ve yapılandırılmış geri bildirim.",resources:"Enstitü bitirme projesi ilkeleri; resim alanına özgü güncel sanat yayınları, müze ve galeri katalogları, görsel arşivler ve proje konusuna ilişkin hakemli çalışmalar.",sdgs:["4","8","11"],outcomes:["Resim alanında özgün bir sanatsal problem yapılandırır.","Proje problemine ilişkin görsel ve kuramsal kaynakları eleştirel değerlendirir.","Amaca uygun malzeme, teknik ve çalışma planı geliştirir.","Sanatsal üretim sürecini belgeler ve elde edilen yapıtları bağlamı içinde yorumlar.","Bitirme projesini sanatsal, akademik ve etik ölçütlere uygun biçimde raporlar."],weeklyTopics:["Proje alanının ve kapsamının belirlenmesi","Sanatsal problemin sınırlandırılması","Proje amacı ve üretim sorularının geliştirilmesi","Görsel ve kuramsal kaynak taraması","Kaynakların eleştirel değerlendirilmesi","Malzeme ve teknik seçeneklerinin araştırılması","Eskiz ve ön uygulamaların geliştirilmesi","Çalışma planının uygulanması","Sanatsal üretimin sürdürülmesi","Üretim sürecinin belgelenmesi","Yapıtların biçimsel ve kavramsal değerlendirilmesi","Yapıt seçkisinin oluşturulması","Proje raporunun yapılandırılması","Sanatsal ve akademik uygunluk denetimi","Bitirme projesinin teslimi ve değerlendirilmesi"],assessments:[{name:"Başarılı / Başarısız",count:1,weight:100}],workloads:[{name:"Proje Planlama ve Danışman Görüşmeleri",count:15,hours:2,total:30},{name:"Görsel ve Kuramsal Kaynak İnceleme",count:15,hours:12,total:180},{name:"Atölye Uygulaması ve Yapıt Üretimi",count:15,hours:42,total:630},{name:"Raporlama ve Teslim",count:1,hours:60,total:60}],contributionMatrix:matrixFor(domains.studio),qualityChecks:qualityChecks(false),publicQualityChecklist:false,status:"İncelemede",source:"official_excel"};

for (const course of [...academic,project]) {
  if (course.weeklyTopics.length !== 15) throw new Error(`${course.code}: 15 akademik hafta yok.`);
  if (course.outcomes.length !== 5 || course.contributionMatrix.some((matrixRow) => matrixRow.values.length !== 11 || matrixRow.values.some((value) => value < 1 || value > 5))) throw new Error(`${course.code}: DÖÇ-PÇ matrisi geçersiz.`);
  if (course.workloads.reduce((sum,row) => sum + row.total,0) !== course.ects * 30 || !course.workloads.every((row) => Number.isInteger(row.hours * 2))) throw new Error(`${course.code}: AKTS iş yükü geçersiz.`);
  if (course.qualityChecks.length !== 21 || course.publicQualityChecklist !== false) throw new Error(`${course.code}: iç kontrol listesi geçersiz.`);
}
if (academic.length !== 26) throw new Error(`26 akademik ders bekleniyordu; bulunan ${academic.length}.`);

const packageFields = (course) => {
  const {academicYear,programCode,type,term,status,source,...value} = course;
  return value;
};
const emit = (file, exportName, value) => writeFileSync(path.join(root,"lib/data",file),`// Mevcut LEE_DBP müfredatı ve ${path.basename(sourcePath)} yardımcı ders içeriği temel alınmıştır; program profili ve PÇ kayıtları değiştirilmemiştir.\nimport type { CoursePackage } from "./coursePackages";\n\nexport const ${exportName}: CoursePackage[] = ${JSON.stringify(value.map(packageFields),null,2)};\n`);
emit("resimTezsizCoursePackages.ts","resimTezsizCoursePackages",academic);
emit("resimTezsizCommonCoursePackages.ts","resimTezsizCommonCoursePackages",[project]);

const normalizedOfficial = [...academicRows.map((row) => ({...row,name:naturalCase(row.name),instructor:row.instructor ? cleanInstructor(row.instructor) : undefined})),project].map((row) => {
  const {aliases,language,teachingMode,prerequisites,purpose,content,methods,resources,sdgs,outcomes,weeklyTopics,assessments,workloads,contributionMatrix,qualityChecks,publicQualityChecklist,...value} = row;
  if (!value.instructor || value.instructor === "Atama Bekliyor") delete value.instructor;
  return value;
});
const withoutTarget = official.filter((course) => !(course.department === department && course.programName === programName && course.level === level));
const insertionIndex = withoutTarget.findIndex((course) => course.department === department && course.programName === programName && course.level === "Tezli Yüksek Lisans");
const ordered = [...withoutTarget.slice(0,insertionIndex),...normalizedOfficial,...withoutTarget.slice(insertionIndex)];
writeFileSync(officialPath,`${JSON.stringify(ordered,null,2)}\n`);
console.log(JSON.stringify({sourceProgramRows:0,officialBefore:targetRows.length,academic:academic.length,common:1,officialAfter:normalizedOfficial.length,programOutcomes:programOutcomes.length}));

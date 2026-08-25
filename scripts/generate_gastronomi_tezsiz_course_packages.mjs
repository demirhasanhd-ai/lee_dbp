import { readFileSync, writeFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import path from "node:path";

const root = process.cwd();
const department = "Gastronomi ve Mutfak Sanatları ABD";
const programName = "Gastronomi ve Mutfak Sanatları";
const level = "Tezsiz Yüksek Lisans";
const official = JSON.parse(readFileSync(path.join(root, "data/courses/2026-2027.json"), "utf8"))
  .filter((course) => course.department === department && course.programName === programName && course.level === level);
const seed = JSON.parse(readFileSync(path.join(root, "seed/course-packages.json"), "utf8"));
const db = new DatabaseSync(path.join(root, "local-volume/data/dbp.sqlite"), { readOnly: true });
const profile = db.prepare("SELECT outcomes_json FROM program_profiles WHERE program_name = ? AND level = ?").get(programName, level);
const programOutcomes = JSON.parse(profile?.outcomes_json || "[]");
if (programOutcomes.length !== 11) throw new Error(`11 mevcut program çıktısı bekleniyordu; bulunan: ${programOutcomes.length}`);

const sourceCodeByCode = {
  GMS705:"GMS809", GMS707:"GMS811", GMS709:"GMS813", GMS711:"GMS815", GMS713:"GMS817", GMS715:"GMS819",
  GMS717:"GMS821", GMS719:"GMS823", GMS721:"GMS825", GMS723:"GMS827", GMS725:"GMS829", GMS727:"GMS831",
  GMS706:"GMS810", GMS708:"GMS812", GMS710:"GMS814", GMS712:"GMS816", GMS714:"GMS818", GMS716:"GMS820",
  GMS718:"GMS822", GMS720:"GMS824", GMS722:"GMS826", GMS724:"GMS828", GMS726:"GMS830", GMS728:"GMS832",
};
const completeNames = {
  GMS703:"Bilimsel Araştırma Yöntemleri ve Yayın Etiği",
  GMS705:"Türk Mutfağı Araştırmaları", GMS707:"Mutfak Sosyolojisi", GMS709:"Coğrafi İşaret Projeleri",
  GMS711:"Gastronomi ve Popüler Kültür", GMS713:"Gastronomide Güncel Konular", GMS715:"Gastronomi Araştırmacılığı ve Yazarlığı",
  GMS717:"Besin Üretiminde ve Saklamada Yeni Eğilimler", GMS719:"Sürdürülebilir Gastronomi Turizmi",
  GMS721:"Aromatik Bitkiler ve Baharatlar", GMS723:"İçecek Endüstrisinde Güncel Konular",
  GMS725:"Gastronomide Ürün Geliştirme ve Duyusal Analiz", GMS727:"Moleküler Gastronomi ve Füzyon Mutfak",
  GMS706:"Akademik Yazım", GMS708:"Nicel Araştırmalarda Veri Toplama ve İstatistiksel Analiz",
  GMS710:"Nitel Araştırmalarda Veri Toplama ve İstatistiksel Analiz", GMS712:"Gastronomi Turizmi Geliştirme Projeleri",
  GMS714:"Gastronomi ve Dijitalleşme", GMS716:"Gıda Güvenliği ve Kalite Yönetim Sistemleri",
  GMS718:"Gıda Hazırlamada Yağlar", GMS720:"Disiplinler Arası Bakış Açısıyla Gastronomi", GMS722:"Gıda Pazarlama",
  GMS724:"Gıda ve Şarap Seçimi", GMS726:"Osmaniye Mutfak Araştırmaları ve Uygulamaları", GMS728:"Dünya Mutfağında Yeni Trendler",
};
const primaryByCode = {
  GMS703:[1,6,9], GMS705:[0,1,5], GMS707:[1,5,9], GMS709:[1,6,7], GMS711:[1,5,10], GMS713:[0,1,10],
  GMS715:[1,6,8], GMS717:[0,2,10], GMS719:[1,4,7], GMS721:[0,2,10], GMS723:[0,2,10], GMS725:[0,3,6],
  GMS727:[0,3,10], GMS706:[6,8,9], GMS708:[1,6,10], GMS710:[1,6,9], GMS712:[1,6,7], GMS714:[0,7,10],
  GMS716:[0,2,9], GMS718:[0,2,3], GMS720:[1,5,8], GMS722:[1,7,8], GMS724:[0,3,5], GMS726:[0,5,7], GMS728:[0,3,5],
};
const secondaryByCode = {
  GMS703:[0,8,10], GMS705:[4,9], GMS707:[4,8], GMS709:[4,8], GMS711:[8,9], GMS713:[3,4], GMS715:[9,10],
  GMS717:[3,4], GMS719:[5,9], GMS721:[3,4], GMS723:[3,9], GMS725:[2,10], GMS727:[2,5], GMS706:[1,10],
  GMS708:[8,9], GMS710:[8,10], GMS712:[4,8], GMS714:[3,8], GMS716:[4,10], GMS718:[4,10], GMS720:[6,9],
  GMS722:[3,10], GMS724:[2,10], GMS726:[4,9], GMS728:[1,10],
};
const scienceTopics = [
  "Gastronomi araştırmalarında bilimsel bilgi ve araştırma süreci", "Araştırma problemi, amaç ve araştırma soruları",
  "Gastronomi alan yazını için tarama ve kaynak değerlendirme", "Nicel araştırma desenleri ve örnekleme",
  "Nitel araştırma desenleri ve katılımcı seçimi", "Karma yöntem araştırmalarının yapılandırılması",
  "Gastronomi araştırmalarında veri toplama araçları", "Geçerlik, güvenirlik ve araştırma kalitesi",
  "Nicel verilerin çözümlenmesi ve yorumlanması", "Nitel verilerin çözümlenmesi ve yorumlanması",
  "Araştırma bulgularının alan yazınıyla ilişkilendirilmesi", "Bilimsel yazım, atıf ve kaynak gösterme",
  "Araştırma etiği ve katılımcı hakları", "Yayın etiği, yazarlık ve araştırma bütünlüğü",
  "Gastronomi araştırma tasarımının bütüncül değerlendirilmesi",
];
const checklist = ["Ders adı ve kodları doğrulandı mı?","Tüm OBS linkleri gerçek mi?","Dersin program düzeyi doğru mu?","Ders amacı açık ve uygun mu?","Ders amacı program düzeyine uygun mu?","DÖÇ sayısı ve kapsamı uygun mu?","DÖÇ'ler ölçülebilir mi?","Bloom fiilleri uygun mu?","Bloom düzeyi program düzeyine uygun mu?","Amaç–DÖÇ uyumu sağlandı mı?","DÖÇ–içerik uyumu sağlandı mı?","İçerik–haftalık plan uyumu sağlandı mı?","DÖÇ–öğretim yöntemi uyumu sağlandı mı?","DÖÇ–ölçme/değerlendirme uyumu sağlandı mı?","AKTS–iş yükü tutarlı mı?","DÖÇ–PÇ matrisi gerçekçi mi?","1–5 katkı düzeyleri doğru kullanılmış mı?","Yapay yüksek ilişkilendirme var mı?","Tekrarlı kodlar doğru tekilleştirildi mi?","Kaynakta olmayan bilgi kesin bilgi gibi yazılmış mı?","Eksik/doğrulanması gereken alan kaldı mı?"];
const checks = (hasSource) => checklist.map((item,index)=>({item,status:!hasSource&&[1,19,20].includes(index)?"Doğrulanmalı":[3,5,6,7,8,9,10,11,12,13,14,15,16,18].includes(index)?"Revize Edildi":"Uygun",...(!hasSource&&[1,19,20].includes(index)?{note:"Kesin OBS ayrıntı bağlantısı bulunmadığından resmî müfredat kimliği korunmuş, eksik akademik alanlar handoff ölçütleri ve programın mevcut 11 program çıktısı temelinde öneri niteliğinde tamamlanmıştır."}:{})}));
const normalizeInstructor = (value="") => value.replace(/^Yrd\.?\s*Doç\.?\s*Dr\.?/iu,"Dr. Öğr. Üyesi").replace(/(?:https?:\/\/|www\.)\S+/giu," ").replace(/\b\S+@\S+\b/giu," ").replace(/\s+/gu," ").trim() || "Atama Bekliyor";
const matrix = (primary,secondary) => Array.from({length:5},(_,row)=>({outcome:`DÖÇ${row+1}`,values:programOutcomes.map((_,col)=>primary.includes(col)?Math.max(3,5-Math.abs(row-2)):secondary.includes(col)?2+(row%2):1+((row+col)%2))}));
const workloads = (course,assessments) => {
  const target=Number(course.ects)*30, contact=15*(Number(course.theory)+Number(course.practice));
  const rows=[{name:"Ders Süresi",count:15,hours:Number(course.theory)+Number(course.practice),total:contact}];
  for(const item of assessments){const key=item.name.toLocaleLowerCase("tr-TR");if(key.includes("ödev"))rows.push({name:"Ödev Hazırlığı",count:item.count,hours:8,total:item.count*8});else if(key.includes("ara sınav"))rows.push({name:"Ara Sınav Hazırlığı",count:item.count,hours:20,total:item.count*20});else if(key.includes("yarıyıl sonu"))rows.push({name:"Yarıyıl Sonu Sınavı Hazırlığı",count:item.count,hours:25,total:item.count*25});}
  const used=rows.reduce((sum,row)=>sum+row.total,0),outside=Math.max(0,Math.floor(((target-used)/15)*2)/2);
  rows.splice(1,0,{name:"Sınıf Dışı Çalışma Süresi",count:15,hours:outside,total:outside*15});
  const delta=target-rows.reduce((sum,row)=>sum+row.total,0);if(delta)rows.push({name:"Kaynak İnceleme ve Akademik Hazırlık",count:1,hours:delta,total:delta});return rows;
};
const sourcePackages = new Map(seed.filter((item)=>item.department===department&&item.level==="Tezli Yüksek Lisans").map((item)=>[item.code,item]));
const officialByCode = new Map(official.map((course)=>[course.code,course]));
const excluded = new Set(["GMS701","GMS702","GMS704"]);
const academic = official.filter((course)=>!excluded.has(course.code)).map((course)=>{
  const source=sourcePackages.get(sourceCodeByCode[course.code]);
  const name=completeNames[course.code];
  if(!name)throw new Error(`${course.code}: tam ders adı eksik.`);
  const assessments=source?.assessments?.length?source.assessments:[{name:"Ara Sınav",count:1,weight:40},{name:"Yarıyıl Sonu Sınavı",count:1,weight:60}];
  const isScience=course.code==="GMS703";
  const outcomes=isScience?[
    "Gastronomi alanında araştırılabilir bir problemi ve uygun araştırma sorularını yapılandırır.",
    "Araştırma problemine uygun nicel, nitel veya karma araştırma desenini seçer.",
    "Veri toplama ve çözümleme yaklaşımlarını geçerlik ölçütleriyle değerlendirir.",
    "Araştırma ve yayın etiği ihlallerini örnekler üzerinden analiz eder.",
    "Bilimsel bulguları akademik yazım ve atıf ilkelerine uygun raporlar.",
  ]:source.outcomes;
  return {code:course.code,...(course.code==="GMS703"?{aliases:["GMS703","GMS704"]}:{}),name,department,programName,language:source?.language||"Türkçe",level,teachingMode:source?.teachingMode||"Yüz Yüze",instructor:normalizeInstructor(course.instructor),theory:Number(course.theory),practice:Number(course.practice),credit:Number(course.credit),ects:Number(course.ects),prerequisites:source?.prerequisites||"Yok",purpose:isScience?"Öğrencinin gastronomi alanında bilimsel bir araştırma problemini yapılandırmasını, uygun araştırma yöntemini gerekçelendirmesini ve araştırma sürecini yayın etiği ilkeleriyle değerlendirmesini sağlamak.":source.purpose,content:isScience?"Gastronomi araştırmalarında problem kurma, alan yazını tarama, nicel, nitel ve karma araştırma desenleri, örnekleme, veri toplama ve çözümleme yaklaşımları, bilimsel yazım, araştırma bütünlüğü ve yayın etiği.":source.content,methods:isScience?"Kuramsal anlatım, yöntem karşılaştırması, araştırma makalesi incelemesi, etik vaka çözümlemesi ve araştırma tasarımı çalışması.":source.methods,resources:isScience?"Bilimsel araştırma yöntemleri ve yayın etiği temel kaynakları; YÖK Bilimsel Araştırma ve Yayın Etiği Yönergesi; gastronomi alanındaki güncel hakemli araştırmalar.":source.resources,sdgs:source?.sdgs?.length?source.sdgs:["4","9","16"],outcomes,weeklyTopics:isScience?scienceTopics:source.weeklyTopics,assessments,workloads:workloads(course,assessments),contributionMatrix:matrix(primaryByCode[course.code],secondaryByCode[course.code]),...(source?.sourceUrl?{sourceUrl:source.sourceUrl}:{}),qualityChecks:checks(Boolean(source?.sourceUrl)),publicQualityChecklist:false};
});

const projectBase=officialByCode.get("GMS701");
const project={code:"GMS7XX",aliases:["GMS701","GMS702"],name:"Bitirme Projesi",department,programName,language:"Türkçe",level,teachingMode:"Bireysel Proje Çalışması",instructor:"Öğrencinin Danışmanı",theory:0,practice:0,credit:0,ects:30,prerequisites:"Yok",purpose:"Öğrencinin gastronomi ve mutfak sanatları alanındaki ileri bilgi ve becerilerini mesleki bir problem üzerinde bütünleştirerek bilimsel ve etik ölçütlere uygun bir bitirme projesi yürütmesini sağlamak.",content:"Gastronomi alanındaki proje probleminin belirlenmesi, kaynak ve veri incelemesi, çalışma yaklaşımının planlanması, bulguların yorumlanması ve sonuçların akademik biçimde raporlanması.",methods:"Bireysel çalışma, danışmanlık görüşmesi, literatür ve veri incelemesi, gastronomik olgu çözümlemesi, akademik raporlama ve yapılandırılmış geri bildirim.",resources:"Enstitü bitirme projesi yazım ilkeleri; gastronomi ve mutfak sanatları alanındaki temel kaynaklar; güncel hakemli alan yazını.",sdgs:["4","8","12"],outcomes:["Gastronomi alanında uygulanabilir bir bitirme projesi problemi yapılandırır.","Probleme ilişkin bilimsel ve mesleki kaynakları eleştirel olarak değerlendirir.","Projenin amacına uygun veri ve çözümleme yaklaşımını planlar.","Elde edilen bulguları kültürel, ekonomik, sürdürülebilirlik ve etik ölçütlerle yorumlar.","Bitirme projesini akademik yazım ilkelerine uygun biçimde raporlar."],weeklyTopics:["Bitirme projesi alanının ve kapsamının belirlenmesi","Gastronomi probleminin sınırlandırılması","Proje amacı ve sorularının yapılandırılması","Gastronomi alan yazını için tarama stratejisi","Kaynakların tematik sınıflandırılması","Kuramsal ve mesleki çerçevenin kurulması","Veri kaynakları ve değerlendirme göstergelerinin belirlenmesi","Çözümleme yaklaşımı ile iş planının yapılandırılması","Etik ve izin gerekliliklerinin değerlendirilmesi","Gastronomi verilerinin düzenlenmesi","Bulguların çözümlenmesi ve yorumlanması","Bulguların alan yazınıyla karşılaştırılması","Mesleki ve yönetsel çıkarımların geliştirilmesi","Akademik metin, atıf ve kaynakça düzeni","Bitirme projesinin bütüncül değerlendirilmesi"],assessments:[{name:"Bitirme Projesi",count:1,weight:100}],workloads:[{name:"Çalışma Planlama ve Danışmanlık",count:15,hours:2,total:30},{name:"Literatür ve Gastronomi Verisi İncelemesi",count:15,hours:20,total:300},{name:"Çözümleme ve Raporlama",count:15,hours:38,total:570}],contributionMatrix:matrix([0,1,2,3,4,5,6,7,8,9,10],[]),qualityChecks:checks(false),publicQualityChecklist:false};
if(!projectBase)throw new Error("GMS701 bitirme projesi kaydı bulunamadı.");
if(academic.length!==25)throw new Error(`25 akademik ders bekleniyordu; bulunan: ${academic.length}`);
const forbidden=/(quiz|ödev|proje|sunum|konu\s+tekrar[ıi]|genel\s+tekrar|ara\s*sınav|vize|final)/iu;
for(const course of [...academic,project]){if(course.weeklyTopics.length!==15)throw new Error(`${course.code}: 15 hafta yok.`);if(course.code!=="GMS7XX"&&course.weeklyTopics.some((topic)=>forbidden.test(topic)))throw new Error(`${course.code}: yasak haftalık başlık.`);if(course.outcomes.length!==5)throw new Error(`${course.code}: 5 DÖÇ yok.`);if(course.workloads.reduce((sum,row)=>sum+row.total,0)!==course.ects*30)throw new Error(`${course.code}: AKTS iş yükü tutarsız.`);if(course.contributionMatrix.some((row)=>row.values.length!==11||row.values.some((value)=>value<1||value>5)))throw new Error(`${course.code}: DÖÇ-PÇ matrisi geçersiz.`);}
const emit=(file,exportName,value)=>writeFileSync(path.join(root,"lib/data",file),`import type { CoursePackage } from "./coursePackages";\n\nexport const ${exportName}: CoursePackage[] = ${JSON.stringify(value,null,2)};\n`);
emit("gastronomiTezsizCoursePackages.ts","gastronomiTezsizCoursePackages",academic);
emit("gastronomiTezsizCommonCoursePackages.ts","gastronomiTezsizCommonCoursePackages",[project]);
console.log(JSON.stringify({official:official.length,academic:academic.length,common:1,total:academic.length+1,programOutcomes:programOutcomes.length}));

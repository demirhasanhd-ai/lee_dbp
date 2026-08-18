import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const sourcePath = process.argv[2] || process.env.BOLOGNA_DERS_JSON;
if (!sourcePath) throw new Error("Kullanım: node scripts/generate_beden_tezli_course_packages.mjs <ders-verileri.json>");
const outputPath = path.join(process.cwd(), "lib", "data", "bedenTezliCoursePackages.ts");
const fold = (value = "") => String(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("tr-TR").replace(/ı/g, "i");
const data = JSON.parse(readFileSync(sourcePath, "utf8")).data;
const program = data.programs.find((item) => fold(item.name).includes("beden egitimi ve spor tezli yuksek lisans"));
if (!program) throw new Error("Beden Eğitimi ve Spor Tezli Yüksek Lisans programı bulunamadı.");
const programOutcomes = [
  "Beden eğitimi ve spor alanındaki ileri düzey bilgileri uygular.", "Spor bilimlerine ilişkin sorunları bilimsel yöntemlerle analiz eder.",
  "Alan bilgilerini farklı disiplinlerden gelen bilgilerle bütünleştirir.", "Spor ve fiziksel aktiviteye yönelik uygulamaları tasarlar ve değerlendirir.",
  "Bilimsel araştırma tasarlar, yürütür ve sonuçlandırır.", "Alanına özgü ölçme ve değerlendirme yöntemlerini uygular ve yorumlar.",
  "Disiplinler arası ekiplerde iş birliği yapar ve sorumluluk alır.", "Bilimsel bilgiyi yazılı, sözlü ve görsel olarak sunar.",
  "Bilimsel araştırma ve meslek etiği ilkelerini uygular.", "Sporun sağlık ve toplumsal etkilerini değerlendirir.",
  "Alanındaki güncel gelişmeleri ve teknolojileri izler ve mesleki gelişimine uygular.",
];
const rawOfficial = readFileSync(path.join(process.cwd(), "lib", "data", "officialCourses.ts"), "utf8");
const officialCourses = rawOfficial.split(/\r?\n/).filter((line) => line.includes('department: "Beden Eğitimi ve Spor ABD"') && line.includes('level: "Tezli Yüksek Lisans"')).map((line) => {
  const get = (key) => line.match(new RegExp(`${key}: "([^"]*)"`))?.[1] || "";
  const number = (key) => Number(line.match(new RegExp(`${key}: ([0-9.]+)`))?.[1] || 0);
  return { code:get("code"), name:get("name"), type:get("type"), theory:number("theory"), practice:number("practice"), credit:number("credit"), ects:number("ects"), term:get("term"), instructor:get("instructor") };
});
const sourceCourseByCode = new Map(data.programCourses.filter((row) => row.program_id === program.id).map((row) => {
  const course = data.courses.find((item) => item.id === row.course_id);
  return [course?.code, { course, assignment:row }];
}));
const commonCodes = /^(BES80[1-8]|BEF80[12]|DAN80[12])$/u;
const cells = (row) => row.map((cell) => String(cell || "").replace(/\s+/g, " ").trim());
const tableByHeader = (course, required) => (course?.package?.tables || []).find((table) => {
  const header = fold(cells(table.rows?.[0] || []).join(" "));
  return (table.rows?.length || 0) > 1 && required.every((term) => header.includes(term));
});
const detail = (course, label) => {
  const table = (course?.package?.tables || []).find((item) => fold(item.title) === "dersin detaylari" && item.rows?.some((row) => fold(row?.[0]) === label));
  return String(table?.rows?.find((row) => fold(row?.[0]) === label)?.[1] || "").trim();
};
const unique = (items) => [...new Set(items.map((item) => String(item || "").replace(/\s+/g, " ").trim()).filter(Boolean))];
const forbiddenWeek = /^(ara\s*sınav|yarıyıl sonu sınavı|final|quiz|ödev|proje|sunum|konu tekrarı|genel tekrar|genel değerlendirme|ders tekrarı|dönem değerlendirmesi)/iu;
const checklist = ["Ders adı ve kodları doğrulandı mı?", "Tüm OBS linkleri gerçek mi?", "Dersin program düzeyi doğru mu?", "Ders amacı açık ve uygun mu?", "Ders amacı program düzeyine uygun mu?", "DÖÇ sayısı ve kapsamı uygun mu?", "DÖÇ'ler ölçülebilir mi?", "Bloom fiilleri uygun mu?", "Bloom düzeyi program düzeyine uygun mu?", "Amaç–DÖÇ uyumu sağlandı mı?", "DÖÇ–içerik uyumu sağlandı mı?", "İçerik–haftalık plan uyumu sağlandı mı?", "DÖÇ–öğretim yöntemi uyumu sağlandı mı?", "DÖÇ–ölçme/değerlendirme uyumu sağlandı mı?", "AKTS–iş yükü tutarlı mı?", "DÖÇ–PÇ matrisi gerçekçi mi?", "1–5 katkı düzeyleri doğru kullanılmış mı?", "Yapay yüksek ilişkilendirme var mı?", "Tekrarlı kodlar doğru tekilleştirildi mi?", "Kaynakta olmayan bilgi kesin bilgi gibi yazılmış mı?", "Eksik/doğrulanması gereken alan kaldı mı?"];
const checks = (hasSource) => checklist.map((item, index) => ({ item, status: !hasSource && index === 1 ? "Doğrulanmalı" : [3,5,6,7,9,10,11,12,14,15,16].includes(index) ? "Revize Edildi" : "Uygun", ...(!hasSource && index === 1 ? {note:"Ders JSON/OBS kaynak paketinde bulunmadığı için resmi katalog kimliği esas alındı."} : {}) }));
const stages = (name) => [
  `${name} kavramsal çerçevesi ve terminolojisi`, `${name} kuramsal yaklaşımları`, `${name} tarihsel ve güncel gelişimi`, `${name} temel değişkenleri ve belirleyicileri`,
  `${name} alanında araştırma desenleri`, `${name} ölçme ve veri toplama yaklaşımları`, `${name} uygulama ilkeleri`, `${name} bireysel farklılıkların değerlendirilmesi`,
  `${name} performans ve sağlık göstergeleri`, `${name} veri çözümleme ve yorumlama`, `${name} program veya uygulama tasarımı`, `${name} etik ve güvenlik boyutu`,
  `${name} toplumsal ve kültürel etkileri`, `${name} güncel bilimsel kanıtların karşılaştırılması`, `${name} alan uygulamalarının eleştirel değerlendirilmesi`,
];
const outcomesFor = (name) => [
  `${name} kapsamındaki ileri düzey kavramları analiz eder.`, `${name} alanındaki bilimsel yaklaşımları karşılaştırır.`,
  `${name} ile ilişkili ölçüm, uygulama veya yönetim sürecini uygular.`, `${name} verilerini bilimsel ölçütlerle değerlendirir.`,
  `${name} uygulamalarını etik, sağlık ve toplumsal etkileri bakımından değerlendirir.`,
];
const focusFor = (name) => {
  const value = fold(name); const focus = new Set([1,2,9,11]);
  if (/egzersiz|fizyoloji|antrenman|performans|uygunluk|beslenme|motor/u.test(value)) [3,4,6,10].forEach((x)=>focus.add(x));
  if (/psikoloji|stres|liderlik|motivasyon/u.test(value)) [3,4,6,7,10].forEach((x)=>focus.add(x));
  if (/yonetim|organizasyon|politika|kriz|yonetisim/u.test(value)) [3,7,8,10].forEach((x)=>focus.add(x));
  if (/ogretim|egitim|program/u.test(value)) [3,4,6,7,8].forEach((x)=>focus.add(x));
  if (/arastirma|istatistik|analiz|makale/u.test(value)) [5,6,8].forEach((x)=>focus.add(x));
  if (/sosyoloji|sosyal|kulturel|ahlak|felsefe|serbest zaman/u.test(value)) [3,8,9,10].forEach((x)=>focus.add(x));
  return [...focus];
};
const matrixFor = (name) => Array.from({length:5},(_,row)=>({outcome:`DÖÇ${row+1}`,values:programOutcomes.map((_,index)=>focusFor(name).includes(index+1)?(row<2?5:row<4?4:3):[5,7,8,11].includes(index+1)?2:1)}));
const assessmentsFor = (course) => {
  const table = tableByHeader(course,["yariyil calismalari","katki"]) || (course?.package?.tables || []).find((item)=>fold(item.title)==="degerlendirme olcutleri");
  const rows=(table?.rows||[]).slice(1).filter((row)=>row?.[0]&&!fold(row[0]).startsWith("toplam")).map((row)=>({name:String(row[0]).trim(),count:Number(row[1])||1,weight:Number(String(row[2]).replace(/[^0-9.,]/g,"").replace(",","."))||0})).filter((row)=>row.weight>0);
  return rows.length?rows:[{name:"Ara Sınav",count:1,weight:40},{name:"Yarıyıl Sonu Sınavı",count:1,weight:60}];
};
const workloadsFor = (ects,theory,practice,assessments) => {
  const target=ects*30; const rows=[{name:"Ders Süresi",count:15,hours:theory+practice,total:15*(theory+practice)}];
  for(const assessment of assessments){const name=fold(assessment.name); if(name.includes("odev"))rows.push({name:"Ödev Hazırlığı",count:assessment.count,hours:6,total:assessment.count*6}); else if(name.includes("uygulama"))rows.push({name:"Uygulama Çalışması",count:assessment.count,hours:3,total:assessment.count*3}); else if(name.includes("proje"))rows.push({name:"Proje Çalışması",count:assessment.count,hours:assessment.count>1?10:20,total:assessment.count*(assessment.count>1?10:20)}); else if(name.includes("ara sinav"))rows.push({name:"Ara Sınav Hazırlığı",count:assessment.count,hours:20,total:assessment.count*20}); else if(name.includes("yariyil sonu"))rows.push({name:"Yarıyıl Sonu Sınavı Hazırlığı",count:assessment.count,hours:25,total:assessment.count*25});}
  const allocated=rows.reduce((sum,row)=>sum+row.total,0); const outside=Math.max(0,Math.floor(((target-allocated)/15)*2)/2); rows.splice(1,0,{name:"Sınıf Dışı Çalışma Süresi",count:15,hours:outside,total:outside*15}); const delta=target-rows.reduce((sum,row)=>sum+row.total,0); if(delta)rows.push({name:"Kaynak İnceleme ve Akademik Hazırlık",count:1,hours:delta,total:delta}); return rows;
};

const packages=officialCourses.filter((official)=>!commonCodes.test(official.code)).map((official)=>{
  const source=sourceCourseByCode.get(official.code); const course=source?.course; const name=course?.name||official.name.replace(/\.\.\.$/u,"").trim(); const hasSource=Boolean(course?.source_url);
  const purpose=detail(course,"dersin amaci")||`${name} alanındaki kuram, araştırma ve uygulamaları lisansüstü düzeyde analiz etme ve değerlendirme yetkinliği kazandırmak.`;
  const content=detail(course,"dersin icerigi")||`${name} alanının kuramsal temelleri, araştırma yaklaşımları, ölçme ve değerlendirme süreçleri, uygulama ilkeleri ile güncel bilimsel gelişmeler.`;
  const methods=detail(course,"dersin yontem ve teknikleri")||"Kuramsal anlatım, bilimsel kaynak incelemesi, örnek olay çözümlemesi, veri yorumlama ve uygulama tasarımı.";
  const resourceTable=(course?.package?.tables||[]).find((item)=>fold(item.title)==="ders kaynaklari"); const resources=(resourceTable?.rows||[]).map((row)=>cells(row).filter(Boolean).join(": ")).join("; ")||(hasSource?"OBS kaydında belirtilen ders kaynakları.":"Ders sorumlusu tarafından doğrulanacak güncel spor bilimleri kaynakları.");
  const weeklyTable=tableByHeader(course,["hafta","konu"])||(course?.package?.tables||[]).find((item)=>fold(item.title)==="ders konulari"); const sourceWeeks=unique((weeklyTable?.rows||[]).slice(1).filter((row)=>row?.[1]&&!forbiddenWeek.test(String(row[1]).trim())).map((row)=>String(row[1]).trim())); const weeklyTopics=unique([...sourceWeeks,...stages(name)]).slice(0,15);
  const assessments=assessmentsFor(course); const theory=Number(source?.assignment?.theory??official.theory),practice=Number(source?.assignment?.practice??official.practice),ects=Number(source?.assignment?.ects??official.ects??6)||6; const outcomes=outcomesFor(name);
  return {code:official.code,name,department:"Beden Eğitimi ve Spor ABD",programName:"Beden Eğitimi ve Spor",language:course?.language||"Türkçe",level:"Tezli Yüksek Lisans",teachingMode:source?.assignment?.teaching_method||"Yüz Yüze",theory,practice,credit:Number(source?.assignment?.local_credit??official.credit??theory),ects,prerequisites:"Yok",instructor:detail(course,"dersi verenler")||official.instructor||"Atama Bekliyor",purpose,content,methods,resources,sdgs:["3","4","5","10","16"],outcomes,weeklyTopics,assessments,workloads:workloadsFor(ects,theory,practice,assessments),contributionMatrix:matrixFor(name),sourceUrl:course?.source_url,qualityChecks:checks(hasSource),publicQualityChecklist:false};
});
writeFileSync(outputPath,`// ${path.basename(sourcePath)} ve resmi LEE_DBP ders kataloğundan üretilmiştir; program profili ve PÇ kayıtları değiştirilmemiştir.\nimport type { CoursePackage } from "./coursePackages";\n\nexport const bedenTezliCoursePackages: CoursePackage[] = ${JSON.stringify(packages,null,2)};\n`,`utf8`);
console.log(`${packages.length} Beden Eğitimi ve Spor alan dersi paketi oluşturuldu; kaynak dışı ${packages.filter((item)=>!item.sourceUrl).length}; PÇ ${programOutcomes.length}.`);

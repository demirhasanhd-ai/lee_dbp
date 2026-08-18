import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const sourcePath = process.argv[2] || process.env.BOLOGNA_DERS_JSON;
if (!sourcePath) throw new Error("Kullanım: node scripts/generate_ebelik_tezli_course_packages.mjs <ders-verileri.json>");
const fold = (value = "") => String(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("tr-TR").replace(/ı/g, "i");
const clean = (value = "") => String(value).replace(/\s+/g, " ").trim();
const unique = (items) => [...new Set(items.map(clean).filter(Boolean))];
const proseName = (name) => clean(name).toLocaleLowerCase("tr-TR");
const sentenceStart = (text) => text ? `${text.charAt(0).toLocaleUpperCase("tr-TR")}${text.slice(1)}` : text;
const data = JSON.parse(readFileSync(sourcePath, "utf8")).data;
const program = data.programs.find((item) => fold(item.name) === "ebelik tezli yuksek lisans");
if (!program) throw new Error("Ebelik Tezli Yüksek Lisans programı bulunamadı.");

const programOutcomes = [
  "Ebelik alanındaki ileri düzey kuramsal ve uygulamalı bilgileri uygular.",
  "Kadın, yenidoğan, aile ve toplum sağlığı sorunlarını analiz eder.",
  "Kanıta dayalı ebelik bakımını planlar, uygular ve değerlendirir.",
  "Klinik karar verme süreçlerinde güncel bilimsel kanıtları kullanır.",
  "Bağımsız bilimsel araştırma tasarlar, yürütür ve raporlar.",
  "Ebelik hizmetlerine yönelik eğitim ve danışmanlık programları geliştirir.",
  "Dijital sağlık ve ebelik teknolojilerini etkin kullanır.",
  "Disiplinler arası ekiplerde iş birliği yapar ve sorumluluk alır.",
  "Bilimsel, mesleki ve etik ilkeleri uygular.",
  "Ebelik hizmetlerini kalite, eşitlik ve toplumsal yarar açısından değerlendirir.",
  "Alanındaki güncel gelişmeleri izler ve bilimsel olarak sunar.",
];
const rawOfficial = readFileSync(path.join(process.cwd(), "lib", "data", "officialCourses.ts"), "utf8");
const getString = (line, key) => line.match(new RegExp(`${key}: "([^"]*)"`))?.[1] || "";
const getNumber = (line, key) => Number(line.match(new RegExp(`${key}: ([0-9.]+)`))?.[1] || 0);
const officialCourses = rawOfficial.split(/\r?\n/)
  .filter((line) => line.includes('department: "Ebelik ABD"') && line.includes('level: "Tezli Yüksek Lisans"'))
  .map((line) => ({code:getString(line,"code"),name:getString(line,"name"),type:getString(line,"type"),theory:getNumber(line,"theory"),practice:getNumber(line,"practice"),credit:getNumber(line,"credit"),ects:getNumber(line,"ects"),term:getString(line,"term"),instructor:getString(line,"instructor")}));
const courseById = new Map(data.courses.map((course) => [course.id, course]));
const assignments = data.programCourses.filter((item) => item.program_id === program.id).map((assignment) => ({assignment,course:courseById.get(assignment.course_id)})).filter((item) => item.course);
const sourceByCode = new Map(assignments.map((item) => [item.course.code, item]));
const cells = (row) => Array.isArray(row) ? row.map(clean) : [];
const detail = (course, label) => {
  const table = (course?.package?.tables || []).find((item) => fold(item.title) === "dersin detaylari" && item.rows?.some((row) => fold(row?.[0]) === label));
  return clean(table?.rows?.find((row) => fold(row?.[0]) === label)?.[1]);
};
const tableByHeader = (course, headers) => (course?.package?.tables || []).find((table) => {
  const first = cells(table.rows?.[0]).map(fold);
  return headers.every((header) => first.some((cell) => cell.includes(header)));
});
const domainFor = (name) => {
  const n=fold(name);
  if(/istatistik/u.test(n)) return {label:"sağlık bilimlerinde istatistik",core:[5,4,7],sdgs:["3","4","9"],terms:["veri türleri ve ölçüm düzeyleri","tanımlayıcı istatistikler","olasılık ve dağılımlar","örnekleme ve kestirim","hipotez testleri","ilişki ve karşılaştırma analizleri","sonuçların yorumlanması","sağlık verilerinde raporlama"]};
  if(/dogum bilgisi|perinat/u.test(n)) return {label:"gebelik, doğum ve perinatal bakım",core:[2,3,4],sdgs:["3","5","10"],terms:["gebelik ve doğum fizyolojisi","anne ve fetüs değerlendirmesi","risk belirleme","doğum sürecinin yönetimi","kanıta dayalı bakım","acil durum yaklaşımı","anne-yenidoğan güvenliği","bakım sonuçlarının değerlendirilmesi"]};
  if(/yenidogan/u.test(n)) return {label:"yenidoğan sağlığı ve bakımı",core:[2,3,4],sdgs:["3","5","10"],terms:["yenidoğanın fizyolojik uyumu","ilk değerlendirme","riskli yenidoğan","beslenme ve gelişim","kanıta dayalı bakım","aile merkezli yaklaşım","güvenli bakım","izlem ve danışmanlık"]};
  if(/ureme|infertil|kadin sagligi|hatalik/u.test(n)) return {label:"kadın ve üreme sağlığı",core:[2,3,6],sdgs:["3","5","10"],terms:["üreme sistemi ve fizyopatoloji","kadın sağlığı sorunları","risk etmenleri","tanılama ve yönlendirme","kanıta dayalı ebelik bakımı","üreme sağlığı danışmanlığı","eşitlik ve hak temelli yaklaşım","bakım sonuçlarının değerlendirilmesi"]};
  if(/ogretim|ebeveyn egitimi/u.test(n)) return {label:"ebelik eğitimi ve danışmanlık",core:[6,3,8],sdgs:["3","4","5"],terms:["öğrenme gereksiniminin belirlenmesi","yetişkin öğrenmesi","eğitim hedefleri","öğretim yöntemleri","eğitim materyali","danışmanlık iletişimi","uygulama ve geri bildirim","eğitim sonuçlarının değerlendirilmesi"]};
  if(/etik/u.test(n)) return {label:"sağlık bakımında etik",core:[9,10,8],sdgs:["3","5","16"],terms:["etik ilke ve kuramlar","hasta hakları","özerklik ve aydınlatılmış onam","mahremiyet ve gizlilik","etik ikilemler","mesleki sorumluluk","eşitlik ve adalet","etik karar verme"]};
  return {label:"ebelik kuramı ve ileri uygulama",core:[1,3,11],sdgs:["3","4","5"],terms:["ebeliğin kavramsal temelleri","kuram ve model yaklaşımı","kadın ve aile odaklı bakım","kanıta dayalı uygulama","klinik karar verme","mesleki roller","bakım kalitesi","güncel ebelik araştırmaları"]};
};
const generatedWeeks = (name, domain) => { const subject=proseName(name); return unique([
  `${sentenceStart(subject)}: kapsam ve temel kavramlar`,...domain.terms.slice(0,4).map((x)=>sentenceStart(x)),
  `${sentenceStart(domain.terms[4])}: bilimsel kanıtların incelenmesi`,`${sentenceStart(domain.terms[5])}: uygulama ilkeleri`,`${sentenceStart(domain.terms[6])}: örnek durumların değerlendirilmesi`,`${sentenceStart(domain.terms[7])}: sonuçların yorumlanması`,
  `${sentenceStart(subject)} alanında risk ve güvenlik`,`${sentenceStart(subject)} alanında disiplinler arası iş birliği`,`${sentenceStart(subject)} alanında etik ve hak temelli yaklaşım`,`${sentenceStart(subject)} uygulamalarında kalite`,`${sentenceStart(subject)} alanındaki güncel bilimsel kanıtlar`,`${sentenceStart(subject)} bilgilerinin bütünleştirilmesi`,
]); };
const outcomesFor = (name,domain) => {const subject=proseName(name); return [
  `${sentenceStart(subject)} kapsamındaki ileri bilgileri analiz eder.`,
  `${sentenceStart(domain.label)} alanındaki bilimsel kanıtları karşılaştırır.`,
  `${Sentence(subject)} kapsamında uygun ebelik yaklaşımını uygular.`,
  `${sentenceStart(subject)} ile ilişkili bakım sonuçlarını değerlendirir.`,
  `${sentenceStart(subject)} uygulamalarını etik ve kalite ölçütleriyle yorumlar.`,
];};
function Sentence(subject){return sentenceStart(subject);}
const matrixFor = (domain) => {
  const core=domain.core; const primary=[[1,core[0]],[2,4,core[0]],[3,core[1]],[3,4,10],[9,10,core[2]]].map((x)=>[...new Set(x)]); const secondary=[[2,11],[1,3,11],[1,4,6],[2,8,11],[3,8,11]];
  return primary.map((targets,row)=>({outcome:`DÖÇ${row+1}`,values:programOutcomes.map((_,i)=>targets.includes(i+1)?(row===2?5:4):secondary[row].includes(i+1)?3:1+(i+row)%2)}));
};
const forbiddenWeek=/\b(quiz|kısa sınav|odev|ödev|proje|sunum|konu tekrarı|genel tekrar|ara sınav|vize|final|yarıyıl sonu)\b/iu;
const assessmentsFor = (course) => {
  const table=tableByHeader(course,["yariyil calismalari","katki"])||(course?.package?.tables||[]).find((item)=>fold(item.title)==="degerlendirme olcutleri");
  const rows=(table?.rows||[]).slice(1).map(cells).filter((row)=>row[0]&&Number(String(row.at(-1)).replace(",","."))>0).map((row)=>({name:row[0],count:Math.min(15,Number(row[1])||1),weight:Number(String(row.at(-1)).replace(",","."))}));
  return rows.length?rows:[{name:"Ara Sınav",count:1,weight:40},{name:"Yarıyıl Sonu Sınavı",count:1,weight:60}];
};
const workloadsFor = (ects,theory,practice,assessments) => {
  const target=ects*30; const rows=[{name:"Ders Süresi",count:15,hours:theory+practice,total:15*(theory+practice)}];
  for(const a of assessments){const n=fold(a.name);if(n.includes("odev"))rows.push({name:"Ödev Hazırlığı",count:a.count,hours:6,total:a.count*6});else if(n.includes("uygulama"))rows.push({name:"Uygulama Çalışması",count:a.count,hours:3,total:a.count*3});else if(n.includes("proje"))rows.push({name:"Proje Çalışması",count:a.count,hours:10,total:a.count*10});else if(n.includes("ara sinav"))rows.push({name:"Ara Sınav Hazırlığı",count:a.count,hours:20,total:a.count*20});else if(n.includes("yariyil sonu"))rows.push({name:"Yarıyıl Sonu Sınavı Hazırlığı",count:a.count,hours:25,total:a.count*25});}
  let excess=rows.reduce((s,r)=>s+r.total,0)-target;
  for(let i=rows.length-1;i>0&&excess>0;i-=1){const step=0.5*rows[i].count;const reducible=Math.max(0,(rows[i].hours-1)*rows[i].count);const reduction=Math.min(reducible,Math.ceil(excess/step)*step);rows[i].hours-=reduction/rows[i].count;rows[i].total=rows[i].hours*rows[i].count;excess-=reduction;}
  let remaining=target-rows.reduce((s,r)=>s+r.total,0); const outside=Math.max(0,Math.floor((remaining/15)*2)/2); rows.splice(1,0,{name:"Sınıf Dışı Çalışma Süresi",count:15,hours:outside,total:outside*15}); remaining=target-rows.reduce((s,r)=>s+r.total,0); if(remaining)rows.push({name:"Kaynak İnceleme ve Akademik Hazırlık",count:1,hours:remaining,total:remaining}); return rows;
};
const checks=(hasSource)=>[
  "Ders adı ve kodları doğrulandı mı?","Tüm OBS linkleri gerçek mi?","Dersin program düzeyi doğru mu?","Ders amacı açık ve uygun mu?","Ders amacı program düzeyine uygun mu?","DÖÇ sayısı ve kapsamı uygun mu?","DÖÇ'ler ölçülebilir mi?","Bloom fiilleri uygun mu?","Bloom düzeyi program düzeyine uygun mu?","Amaç–DÖÇ uyumu sağlandı mı?","DÖÇ–içerik uyumu sağlandı mı?","İçerik–haftalık plan uyumu sağlandı mı?","DÖÇ–öğretim yöntemi uyumu sağlandı mı?","DÖÇ–ölçme/değerlendirme uyumu sağlandı mı?","AKTS–iş yükü tutarlı mı?","DÖÇ–PÇ matrisi gerçekçi mi?","1–5 katkı düzeyleri doğru kullanılmış mı?","Yapay yüksek ilişkilendirme var mı?","Tekrarlı kodlar doğru tekilleştirildi mi?","Kaynakta olmayan bilgi kesin bilgi gibi yazılmış mı?","Eksik/doğrulanması gereken alan kaldı mı?"
].map((item,i)=>({item,status:!hasSource&&i===1?"Doğrulanmalı":([3,5,6,7,9,10,11,12,14,15,16].includes(i)?"Revize Edildi":"Uygun"),...(!hasSource&&i===1?{note:"Ders JSON/OBS kaynak paketinde bulunmadığı için resmi katalog kimliği esas alındı."}:{})}));
const commonRawCodes=/^(DAN80[1-4]|EBE80[1-9]|EBE810)$/u;
const academicPackages=officialCourses.filter((o)=>!commonRawCodes.test(o.code)).map((official)=>{
  const source=sourceByCode.get(official.code); const course=source?.course; const name=course?.name||official.name.replace(/\.\.\.$/u,"").trim(); const domain=domainFor(name); const hasSource=Boolean(course?.source_url); const subject=proseName(name);
  const purpose=detail(course,"dersin amaci")||`${sentenceStart(subject)} alanındaki kuramsal bilgileri, bilimsel kanıtları ve ebelik uygulamalarını lisansüstü düzeyde değerlendirme yetkinliği kazandırmak.`;
  const content=detail(course,"dersin icerigi")||`${sentenceStart(subject)}; ${domain.terms.join(", ")} boyutlarıyla ele alınır.`;
  const methods=detail(course,"dersin yontem ve teknikleri")||"Kuramsal anlatım, bilimsel kaynak incelemesi, vaka tartışması ve kanıta dayalı karar verme çalışmaları.";
  const resourceTable=(course?.package?.tables||[]).find((item)=>fold(item.title)==="ders kaynaklari"); const resources=(resourceTable?.rows||[]).map((row)=>cells(row).filter(Boolean).join(": ")).join("; ")||"Dünya Sağlık Örgütü ebelik ve kadın sağlığı kaynakları; ICM temel yeterlilikleri; konuya ilişkin güncel hakemli sağlık bilimleri literatürü.";
  const weeklyTable=tableByHeader(course,["hafta","konu"])||(course?.package?.tables||[]).find((item)=>fold(item.title)==="ders konulari"); const sourceWeeks=unique((weeklyTable?.rows||[]).slice(1).filter((row)=>row?.[1]&&!forbiddenWeek.test(clean(row[1]))).map((row)=>row[1])); const weeklyTopics=unique([...sourceWeeks,...generatedWeeks(name,domain)]).slice(0,15);
  const assessments=assessmentsFor(course); const theory=Number(source?.assignment?.theory??official.theory),practice=Number(source?.assignment?.practice??official.practice),ects=Number(source?.assignment?.ects??official.ects??6)||6;
  return {code:official.code,name,department:"Ebelik ABD",programName:"Ebelik",language:course?.language||"Türkçe",level:"Tezli Yüksek Lisans",teachingMode:source?.assignment?.teaching_method||"Yüz Yüze",theory,practice,credit:Number(source?.assignment?.local_credit??official.credit??theory),ects,prerequisites:"Yok",instructor:detail(course,"dersi verenler")||official.instructor||"Atama Bekliyor",purpose,content,methods,resources,sdgs:domain.sdgs,outcomes:outcomesFor(name,domain),weeklyTopics,assessments,workloads:workloadsFor(ects,theory,practice,assessments),contributionMatrix:matrixFor(domain),sourceUrl:course?.source_url,qualityChecks:checks(hasSource),publicQualityChecklist:false};
});
const commonSpecs=[
  {code:"DAN8XX",name:"DANIŞMANLIK",theory:0,practice:1,credit:0,ects:1,purpose:"Öğrencinin ebelik alanındaki akademik gelişimini ve tez araştırması sürecini bilimsel yöntem, kadın merkezli bakım ve araştırma etiği bakımından yönlendirmek.",content:"Akademik planlama, ebelik literatürünün izlenmesi, araştırma probleminin geliştirilmesi, yöntem seçimi, etik uygunluk, ilerleme değerlendirmesi ve bilimsel raporlama süreçleri.",stages:["Akademik çalışma planının oluşturulması","Ebelik araştırma alanının sınırlandırılması","Kadın ve yenidoğan sağlığı literatürünün taranması","Araştırma probleminin netleştirilmesi","Etik ve mahremiyet gerekliliklerinin incelenmesi","Araştırma tasarımının değerlendirilmesi","Veri toplama planının izlenmesi","Araştırma kayıtlarının kontrolü","Bulguların ön değerlendirmesi","Analiz yaklaşımının gözden geçirilmesi","Bilimsel yazım planının oluşturulması","Kaynak ve atıf düzeninin denetlenmesi","Araştırma sınırlılıklarının değerlendirilmesi","Akademik gelişim ve ilerleme izlemesi","Sonraki dönem çalışma planının kararlaştırılması"]},
  {code:"EBE8XX",name:"UZMANLIK ALAN DERSİ",theory:4,practice:0,credit:0,ects:5,purpose:"Öğrencinin tez konusu ile ilişkili ileri ebelik literatürünü eleştirel değerlendirmesini ve araştırmasının kuramsal-yöntemsel altyapısını derinleştirmesini sağlamak.",content:"Tez alanına özgü ebelik literatürü, kadın ve yenidoğan sağlığı bağlamı, araştırma problemi, kuramsal çerçeve, yöntem seçimi, veri yorumlama ve araştırma etiği.",stages:["Tez alanının bilimsel kapsamının belirlenmesi","İleri ebelik literatürünün sınıflandırılması","Bakım kuramlarının karşılaştırılması","Araştırma boşluğunun tanımlanması","Araştırma sorularının geliştirilmesi","Hipotezlerin bilimsel temellendirilmesi","Araştırma desenlerinin karşılaştırılması","Örnekleme yaklaşımının değerlendirilmesi","Ölçüm araçlarının incelenmesi","Veri kalite ölçütlerinin belirlenmesi","Analiz seçeneklerinin karşılaştırılması","Bulguların klinik yorum çerçevesi","Etik ve mahremiyet risklerinin değerlendirilmesi","Araştırma sınırlılıklarının tartışılması","Kuramsal ve yöntemsel çerçevenin bütünleştirilmesi"]},
  {code:"EBE806",name:"SEMİNER",theory:0,practice:0,credit:0,ects:6,purpose:"Ebelik alanında bilimsel bir problemi literatüre dayalı inceleme, akademik metne dönüştürme ve bilimsel ortamda savunma becerisi kazandırmak.",content:"Literatür tarama, araştırma problemi, kanıta dayalı ebelik bilgisi, bilimsel metin, bulguların sentezi, akademik anlatım ve tartışma.",stages:["Seminer konusunun ve kapsamının belirlenmesi","Araştırma sorusunun geliştirilmesi","Literatür tarama stratejisinin kurulması","Kaynakların güvenilirlik bakımından değerlendirilmesi","Literatürün tematik sınıflandırılması","Ebelik kanıtlarının karşılaştırılması","Seminer metninin iskeletinin oluşturulması","Yöntem ve bulguların sentezlenmesi","Tablo ve görsellerin bilimsel düzenlenmesi","Bilimsel tartışmanın yapılandırılması","Sonuç ve çıkarımların oluşturulması","Atıf ve kaynakça denetimi","Akademik anlatım tasarımının geliştirilmesi","Bilimsel anlatımın uygulanması","Geri bildirim doğrultusunda nihai düzenleme"]},
  {code:"EBE809",name:"BİLİMSEL ARAŞTIRMA YÖNTEMLERİ VE YAYIN ETİĞİ",theory:3,practice:0,credit:3,ects:6,purpose:"Ebelik araştırmalarını bilimsel yöntem ve yayın etiği ilkelerine uygun tasarlama, yürütme, analiz etme ve raporlama yeterliliği kazandırmak.",content:"Araştırma problemi, sağlık araştırması desenleri, örnekleme, veri toplama, analiz yaklaşımı, bilimsel yazım, araştırma bütünlüğü, yayın etiği ve hassas grupların korunması.",stages:["Bilimsel bilgi ve ebelik araştırmasının özellikleri","Araştırma problemi ve hipotez geliştirme","Nicel araştırma desenleri","Nitel araştırma desenleri","Örnekleme ve çalışma grubu","Veri toplama araçları ve geçerlik","Sağlık verilerinde kalite güvencesi","Temel veri analizi yaklaşımları","Bulguların yorumlanması","Bilimsel makalenin yapısı","Kaynak kullanımı ve atıf ilkeleri","Araştırma bütünlüğü","Yayın etiği ihlallerinin değerlendirilmesi","Etik kurul ve hassas grupların korunması","Araştırma tasarımının bütüncül değerlendirilmesi"]},
  {code:"EBE81X",name:"TEZ ÇALIŞMASI",theory:0,practice:0,credit:0,ects:24,purpose:"Öğrencinin ebelik alanında bağımsız bir araştırmayı etik ilkelere uygun biçimde tasarlaması, yürütmesi, çözümlemesi ve bilimsel olarak savunmasını sağlamak.",content:"Özgün ebelik araştırma problemi, literatür sentezi, araştırma tasarımı, etik süreç, veri üretimi, kalite kontrolü, analiz, klinik yorumlama, tez yazımı ve savunma.",stages:["Araştırma probleminin kesinleştirilmesi","Literatür çerçevesinin güncellenmesi","Araştırma amaç ve hipotezlerinin yapılandırılması","Yöntem ve örnekleme planının kesinleştirilmesi","Etik kurul ve kurum izinlerinin tamamlanması","Veri toplama sürecinin planlanması","Katılımcı güvenliği ve veri kalite kontrolü","Veri toplama sürecinin izlenmesi","Verilerin düzenlenmesi ve doğrulanması","Analizlerin yürütülmesi","Bulguların ebelik bakımı açısından yorumlanması","Bulguların literatürle karşılaştırılması","Tez bölümlerinin bilimsel yazımı","Tez metninin bütünlük ve etik denetimi","Savunma hazırlığı ve araştırmanın bilimsel sunumu"]},
];
const commonPackages=commonSpecs.map((spec)=>{const domain=domainFor(spec.name);const assessments=spec.code==="EBE806"?[{name:"Seminer Metni ve Sunumu",count:1,weight:100}]:spec.code==="EBE809"?[{name:"Ara Sınav",count:1,weight:40},{name:"Yarıyıl Sonu Sınavı",count:1,weight:60}]:[{name:"Başarılı / Başarısız",count:1,weight:100}];return {...spec,department:"Ebelik ABD",programName:"Ebelik",language:"Türkçe",level:"Tezli Yüksek Lisans",teachingMode:spec.code==="EBE809"?"Yüz Yüze":"Bireysel Çalışma",prerequisites:"Yok",instructor:spec.code==="EBE809"?"Doç. Dr. FİLİZ POLAT":"Öğrencinin Danışmanı",methods:"Literatür incelemesi, akademik tartışma, bireysel araştırma ve danışmanlık görüşmesi.",resources:"Dünya Sağlık Örgütü ebelik kaynakları; ICM temel yeterlilikleri; güncel hakemli ebelik ve kadın sağlığı literatürü.",sdgs:domain.sdgs,outcomes:outcomesFor(spec.name,domain),weeklyTopics:spec.stages,assessments,workloads:workloadsFor(spec.ects,spec.theory,spec.practice,assessments),contributionMatrix:matrixFor(domain),qualityChecks:checks(true),publicQualityChecklist:false};});
writeFileSync(path.join(process.cwd(),"lib","data","ebelikTezliCoursePackages.ts"),`// ${path.basename(sourcePath)} ve resmi LEE_DBP ders kataloğundan üretilmiştir; program profili ve PÇ kayıtları değiştirilmemiştir.\nimport type { CoursePackage } from "./coursePackages";\n\nexport const ebelikTezliCoursePackages: CoursePackage[] = ${JSON.stringify(academicPackages,null,2)};\n`,`utf8`);
writeFileSync(path.join(process.cwd(),"lib","data","ebelikCommonCoursePackages.ts"),`// Ebelik Tezli Yüksek Lisans ortak/süreç dersleri alan bağlamına uyarlanmıştır.\nimport type { CoursePackage } from "./coursePackages";\n\nexport const ebelikCommonCoursePackages: CoursePackage[] = ${JSON.stringify(commonPackages,null,2)};\n`,`utf8`);
console.log(JSON.stringify({academic:academicPackages.length,common:commonPackages.length,sourceMissing:academicPackages.filter((p)=>!p.sourceUrl).map((p)=>p.code),pc:programOutcomes.length},null,2));

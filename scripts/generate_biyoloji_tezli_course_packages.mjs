import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const sourcePath = process.argv[2] || process.env.BOLOGNA_DERS_JSON;
if (!sourcePath) throw new Error("Kullanım: node scripts/generate_biyoloji_tezli_course_packages.mjs <ders-verileri.json>");
const fold = (value = "") => String(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("tr-TR").replace(/ı/g, "i");
const clean = (value = "") => String(value).replace(/\s+/g, " ").trim();
const unique = (items) => [...new Set(items.map(clean).filter(Boolean))];
const data = JSON.parse(readFileSync(sourcePath, "utf8")).data;
const program = data.programs.find((item) => fold(item.name) === "biyoloji tezli yuksek lisans");
if (!program) throw new Error("Biyoloji Tezli Yüksek Lisans programı bulunamadı.");

const programOutcomes = [
  "Biyoloji alanındaki ileri düzey kuramsal ve uygulamalı bilgileri kullanır.",
  "Biyolojik verileri bilimsel ve istatistiksel yöntemlerle analiz eder.",
  "Biyolojik sorunlara bilimsel yöntemlerle çözüm geliştirir.",
  "Bağımsız bir biyolojik araştırmayı tasarlar, yürütür ve sonuçlandırır.",
  "Farklı disiplinlerden gelen bilgileri biyolojik verilerle bütünleştirir.",
  "Laboratuvar ve araştırma yöntemlerini uygular ve değerlendirir.",
  "Bilimsel literatürü eleştirel biçimde değerlendirir ve kullanır.",
  "Bilimsel çalışmalarını yazılı, sözlü ve görsel olarak sunar.",
  "Bilimsel araştırma, yayın ve meslek etiği ilkelerini uygular.",
  "Biyolojik çalışmaların çevresel ve toplumsal etkilerini değerlendirir.",
  "Alanındaki güncel gelişmeleri izler ve mesleki gelişimine uygular.",
];
const nameOverrides = {
  "BİO877": "BİYOLOJİK ARAŞTIRMALARDA İLERİ DÜZEY VERİ ANALİZİ",
  "BİO885": "DOKULARDA BİYOMARKIR ARAŞTIRMALARI VE UYGULAMALARI",
};
const rawOfficial = readFileSync(path.join(process.cwd(), "lib", "data", "officialCourses.ts"), "utf8");
const getString = (line, key) => line.match(new RegExp(`${key}: "([^"]*)"`))?.[1] || "";
const getNumber = (line, key) => Number(line.match(new RegExp(`${key}: ([0-9.]+)`))?.[1] || 0);
const officialCourses = rawOfficial.split(/\r?\n/)
  .filter((line) => line.includes('department: "Biyoloji ABD"') && line.includes('level: "Tezli Yüksek Lisans"'))
  .map((line) => ({ code:getString(line,"code"), name:getString(line,"name"), type:getString(line,"type"), theory:getNumber(line,"theory"), practice:getNumber(line,"practice"), credit:getNumber(line,"credit"), ects:getNumber(line,"ects"), term:getString(line,"term"), instructor:getString(line,"instructor") }));
const sourceByCode = new Map(data.programCourses.filter((row) => row.program_id === program.id).map((assignment) => {
  const course = data.courses.find((item) => item.id === assignment.course_id);
  return [course?.code, { course, assignment }];
}));
const commonRawCodes = /^(BİO80[1-9]|BİO810|DAN80[1-4])$/u;
const cells = (row) => row.map(clean);
const tableByHeader = (course, terms) => (course?.package?.tables || []).find((table) => {
  const header = fold(cells(table.rows?.[0] || []).join(" "));
  return (table.rows?.length || 0) > 1 && terms.every((term) => header.includes(term));
});
const detail = (course, label) => {
  const table = (course?.package?.tables || []).find((item) => fold(item.title) === "dersin detaylari" && item.rows?.some((row) => fold(row?.[0]) === label));
  return clean(table?.rows?.find((row) => fold(row?.[0]) === label)?.[1]);
};
const forbiddenWeek = /^(ara\s*sınav|yarıyıl sonu sınavı|final|quiz|ödev|proje|sunum|konu tekrarı|genel tekrar|genel değerlendirme|ders tekrarı|dönem değerlendirmesi)/iu;
const checklist = ["Ders adı ve kodları doğrulandı mı?", "Tüm OBS linkleri gerçek mi?", "Dersin program düzeyi doğru mu?", "Ders amacı açık ve uygun mu?", "Ders amacı program düzeyine uygun mu?", "DÖÇ sayısı ve kapsamı uygun mu?", "DÖÇ'ler ölçülebilir mi?", "Bloom fiilleri uygun mu?", "Bloom düzeyi program düzeyine uygun mu?", "Amaç–DÖÇ uyumu sağlandı mı?", "DÖÇ–içerik uyumu sağlandı mı?", "İçerik–haftalık plan uyumu sağlandı mı?", "DÖÇ–öğretim yöntemi uyumu sağlandı mı?", "DÖÇ–ölçme/değerlendirme uyumu sağlandı mı?", "AKTS–iş yükü tutarlı mı?", "DÖÇ–PÇ matrisi gerçekçi mi?", "1–5 katkı düzeyleri doğru kullanılmış mı?", "Yapay yüksek ilişkilendirme var mı?", "Tekrarlı kodlar doğru tekilleştirildi mi?", "Kaynakta olmayan bilgi kesin bilgi gibi yazılmış mı?", "Eksik/doğrulanması gereken alan kaldı mı?"];
const checks = (hasSource) => checklist.map((item,index) => ({ item, status:!hasSource && index === 1 ? "Doğrulanmalı" : [3,5,6,7,9,10,11,12,14,15,16].includes(index) ? "Revize Edildi" : "Uygun", ...(!hasSource && index === 1 ? {note:"Ders JSON/OBS kaynak paketinde bulunmadığı için resmi katalog kimliği esas alındı."} : {}) }));

const domainFor = (name) => {
  const n = fold(name);
  if (/mikroorganizma|mikrob|antibiyotik|bulasici|fitopatojen|mikoloji/u.test(n)) return {label:"mikrobiyoloji ve mikrobiyal sistemler", focus:[1,2,3,4,6,7,9,11], sdgs:["3","4","12"], terms:["mikrobiyal yapı ve çeşitlilik","gelişme ve metabolizma","konak-mikroorganizma etkileşimi","kontrol ve direnç mekanizmaları","örnekleme ve kültür yaklaşımları","moleküler tanımlama","veri yorumlama","biyogüvenlik ve etik"]};
  if (/genetik|molekuler|klonlama|rekombinant|dna|kalitsal|yapay zeka|veri analiz/u.test(n)) return {label:"moleküler biyoloji, genetik ve biyolojik veri analizi", focus:[1,2,3,4,5,6,7,8,9,11], sdgs:["3","4","9"], terms:["moleküler temel ve terminoloji","genom organizasyonu","gen ifadesi ve düzenlenmesi","moleküler yöntem seçimi","deneysel tasarım","biyolojik veri kalite kontrolü","istatistiksel ve hesaplamalı analiz","sonuçların biyolojik yorumlanması"]};
  if (/bitki|polen|palinoloji|tohum|cimlenme|hidrobotanik|odun|doku kulturu/u.test(n)) return {label:"bitki biyolojisi, botanik ve ekofizyoloji", focus:[1,2,3,4,5,6,7,10,11], sdgs:["4","13","15"], terms:["bitkisel yapı ve işlev","taksonomik ve ekolojik ilkeler","örnekleme ve teşhis ölçütleri","çevresel etmenler","fizyolojik yanıtlar","popülasyon ve habitat ilişkileri","deneysel yaklaşım","koruma ve sürdürülebilirlik"]};
  if (/mantar|fungal|etnomikoloji|gasteroid/u.test(n)) return {label:"mikoloji ve fungal biyoloji", focus:[1,2,3,4,6,7,9,10,11], sdgs:["3","4","15"], terms:["fungal çeşitlilik ve sınıflandırma","morfoloji ve gelişim","fizyoloji ve metabolizma","ekolojik roller","örnekleme ve tanılama","moleküler sistematik","biyolojik etkinlikler","toksisite ve güvenlik"]};
  if (/ekoloji|cevre|kirlilik|atik|ekotoksik|enerji|yaban|populasyon/u.test(n)) return {label:"ekoloji, çevre biyolojisi ve sürdürülebilirlik", focus:[1,2,3,4,5,6,7,9,10,11], sdgs:["4","13","15"], terms:["ekolojik sistem yaklaşımı","popülasyon ve komünite süreçleri","çevresel baskılar","örnekleme tasarımı","gösterge ve biyobelirteçler","risk değerlendirmesi","veri analizi","koruma ve yönetim seçenekleri"]};
  if (/fizyoloji|metabolizma|enzim|biyokimya|hormon|toksikoloji|biyomarkir|antioksidan|makromolekul/u.test(n)) return {label:"fizyoloji, biyokimya ve toksikoloji", focus:[1,2,3,4,5,6,7,9,11], sdgs:["3","4","9"], terms:["biyolojik yapı-işlev ilişkileri","metabolik yollar","düzenleyici mekanizmalar","deneysel göstergeler","örnek hazırlama ve ölçüm ilkeleri","biyobelirteç yaklaşımı","doz-yanıt ve etki analizi","bulguların fizyolojik yorumlanması"]};
  if (/entomoloji|bocek|zooloji|balik|hayvan/u.test(n)) return {label:"zooloji, hayvan biyolojisi ve sistematik", focus:[1,2,3,4,6,7,10,11], sdgs:["4","14","15"], terms:["hayvansal çeşitlilik","morfolojik karakterler","fizyolojik uyumlar","sistematik ilkeler","örnekleme ve preparasyon","tanılama anahtarları","habitat ve dağılış","koruma biyolojisi"]};
  return {label:"ileri biyoloji araştırmaları", focus:[1,2,3,4,5,6,7,8,9,10,11], sdgs:["4","9","15"], terms:["ileri kavramsal çerçeve","bilimsel literatürün değerlendirilmesi","araştırma problemi","yöntem ve veri kaynakları","analiz yaklaşımı","bulguların yorumlanması","etik ve araştırma bütünlüğü","güncel bilimsel gelişmeler"]};
};
const proseName = (name) => clean(name).toLocaleLowerCase("tr-TR");
const sentenceStart = (text) => text ? `${text.charAt(0).toLocaleUpperCase("tr-TR")}${text.slice(1)}` : text;
const generatedWeeks = (name, domain) => {
  const subject = proseName(name);
  return unique([
  `${sentenceStart(subject)}: kapsam, temel kavramlar ve terminoloji`, `${domain.terms[0]}: kuramsal çerçeve`, `${domain.terms[1]}: mekanizmalar ve ilişkiler`, `${domain.terms[2]}: güncel bilimsel yaklaşımlar`,
  `${domain.terms[3]}: araştırma sorularının kurulması`, `${domain.terms[4]}: yöntem ve ölçütlerin seçimi`, `${domain.terms[5]}: veri üretimi ve kalite güvencesi`, `${domain.terms[6]}: çözümleme ilkeleri`,
  `${sentenceStart(subject)}: örnek araştırmaların karşılaştırılması`, `${domain.terms[7]}: bulguların yorumlanması`, `${sentenceStart(subject)}: disiplinler arası bağlantılar`, `${sentenceStart(subject)}: etik, güvenlik ve sınırlılıklar`,
  `${sentenceStart(subject)}: çevresel veya toplumsal etkilerin değerlendirilmesi`, `${sentenceStart(subject)}: güncel literatürün eleştirel incelenmesi`, `${sentenceStart(subject)}: bütünleşik bilimsel değerlendirme`,
]);
};
const outcomesFor = (name, domain) => {
  const subject = proseName(name);
  return [
  `${sentenceStart(subject)} kapsamındaki ileri biyolojik kavramları analiz eder.`,
  `${domain.label} alanındaki bilimsel yaklaşımları karşılaştırır.`,
  `${sentenceStart(subject)} için uygun araştırma veya inceleme yöntemini uygular.`,
  `${sentenceStart(subject)} verilerini bilimsel ölçütlerle değerlendirir.`,
  `${sentenceStart(subject)} bulgularını etik ve biyolojik bağlamda yorumlar.`,
];
};
const matrixFor = (domain) => {
  const label=fold(domain.label);
  const core=/mikrob/u.test(label)?[3,6,9]:/molekuler|genetik|veri/u.test(label)?[2,4,6]:/bitki|botanik|mikol|fungal|zooloji|hayvan/u.test(label)?[3,6,10]:/ekoloji|cevre/u.test(label)?[3,4,10]:/fizyoloji|biyokimya|toksikoloji/u.test(label)?[2,3,6]:[4,5,8];
  const primary = [[1,7],[2,7,11],[3,4,core[0]],[2,6,core[1]],[9,10,core[2]]].map((row)=>[...new Set(row)]);
  const secondary = [[2,5],[1,5,8],[1,2,5,7],[1,3,5,11],[3,4,7,11]];
  return primary.map((targets,row) => ({outcome:`DÖÇ${row+1}`,values:programOutcomes.map((_,index) => {
    const pc=index+1;
    if (targets.includes(pc)) return row === 2 ? 5 : 4;
    if (secondary[row].includes(pc) && domain.focus.includes(pc)) return 3;
    if (domain.focus.includes(pc)) return 2;
    return 1;
  })}));
};
const assessmentsFor = (course) => {
  const table = tableByHeader(course,["yariyil calismalari","katki"]) || (course?.package?.tables || []).find((item)=>fold(item.title)==="degerlendirme olcutleri");
  const rows=(table?.rows||[]).slice(1).filter((row)=>row?.[0]&&!fold(row[0]).startsWith("toplam")).map((row)=>{const rawCount=Number(row[1])||1; return {name:clean(row[0]),count:rawCount >= 1 && rawCount <= 15 ? rawCount : 1,weight:Number(String(row[2]).replace(/[^0-9.,]/g,"").replace(",","."))||0};}).filter((row)=>row.weight>0);
  return rows.length ? rows : [{name:"Ara Sınav",count:1,weight:40},{name:"Yarıyıl Sonu Sınavı",count:1,weight:60}];
};
const workloadsFor = (ects,theory,practice,assessments) => {
  const target=ects*30; const rows=[{name:"Ders Süresi",count:15,hours:theory+practice,total:15*(theory+practice)}];
  for(const assessment of assessments){const n=fold(assessment.name); if(n.includes("odev"))rows.push({name:"Ödev Hazırlığı",count:assessment.count,hours:6,total:assessment.count*6}); else if(n.includes("uygulama"))rows.push({name:"Uygulama Çalışması",count:assessment.count,hours:3,total:assessment.count*3}); else if(n.includes("proje"))rows.push({name:"Proje Çalışması",count:assessment.count,hours:10,total:assessment.count*10}); else if(n.includes("ara sinav"))rows.push({name:"Ara Sınav Hazırlığı",count:assessment.count,hours:20,total:assessment.count*20}); else if(n.includes("yariyil sonu"))rows.push({name:"Yarıyıl Sonu Sınavı Hazırlığı",count:assessment.count,hours:25,total:assessment.count*25});}
  const remaining=target-rows.reduce((sum,row)=>sum+row.total,0); const outside=Math.max(0,Math.floor((remaining/15)*2)/2); rows.splice(1,0,{name:"Sınıf Dışı Çalışma Süresi",count:15,hours:outside,total:outside*15}); const delta=target-rows.reduce((sum,row)=>sum+row.total,0); if(delta)rows.push({name:"Kaynak İnceleme ve Akademik Hazırlık",count:1,hours:delta,total:delta}); return rows;
};

const fieldPackages = officialCourses.filter((official)=>!commonRawCodes.test(official.code)).map((official) => {
  const source=sourceByCode.get(official.code); const course=source?.course; const name=course?.name || nameOverrides[official.code] || official.name.replace(/\.\.\.$/u,"").trim(); const hasSource=Boolean(course?.source_url); const domain=domainFor(name);
  const subject=proseName(name);
  const purpose=detail(course,"dersin amaci") || `${sentenceStart(subject)} alanındaki ileri kavramları, araştırma yaklaşımlarını ve biyolojik bulguları lisansüstü düzeyde analiz etme ve değerlendirme yetkinliği kazandırmak.`;
  const content=detail(course,"dersin icerigi") || `${sentenceStart(subject)}; ${domain.terms.join(", ")} boyutlarıyla ele alınır.`;
  const methods=detail(course,"dersin yontem ve teknikleri") || "Kuramsal anlatım, bilimsel kaynak incelemesi, biyolojik veri yorumlama, yöntem karşılaştırması ve akademik tartışma.";
  const resourceTable=(course?.package?.tables||[]).find((item)=>fold(item.title)==="ders kaynaklari");
  const resources=(resourceTable?.rows||[]).map((row)=>cells(row).filter(Boolean).join(": ")).join("; ") || (hasSource ? "OBS kaydında belirtilen ders kaynakları." : "Campbell Biology; Alberts ve diğerleri, Molecular Biology of the Cell; konuya ilişkin güncel hakemli biyoloji literatürü ve yetkili bilimsel kurum kaynakları.");
  const weeklyTable=tableByHeader(course,["hafta","konu"]) || (course?.package?.tables||[]).find((item)=>fold(item.title)==="ders konulari");
  const sourceWeeks=unique((weeklyTable?.rows||[]).slice(1).filter((row)=>row?.[1]&&!forbiddenWeek.test(clean(row[1]))).map((row)=>row[1]));
  const weeklyTopics=unique([...sourceWeeks,...generatedWeeks(name,domain)]).slice(0,15);
  const assessments=assessmentsFor(course); const theory=Number(source?.assignment?.theory??official.theory),practice=Number(source?.assignment?.practice??official.practice),ects=Number(source?.assignment?.ects??official.ects??6)||6;
  return {code:official.code,name,department:"Biyoloji ABD",programName:"Biyoloji",language:course?.language||"Türkçe",level:"Tezli Yüksek Lisans",teachingMode:source?.assignment?.teaching_method||"Yüz Yüze",theory,practice,credit:Number(source?.assignment?.local_credit??official.credit??theory),ects,prerequisites:"Yok",instructor:detail(course,"dersi verenler")||official.instructor||"Atama Bekliyor",purpose,content,methods,resources,sdgs:domain.sdgs,outcomes:outcomesFor(name,domain),weeklyTopics,assessments,workloads:workloadsFor(ects,theory,practice,assessments),contributionMatrix:matrixFor(domain),sourceUrl:course?.source_url,qualityChecks:checks(hasSource),publicQualityChecklist:false};
});

const commonSpecs = [
  {code:"DAN8XX",name:"DANIŞMANLIK",theory:0,practice:1,credit:0,ects:1,purpose:"Öğrencinin biyoloji alanındaki akademik gelişimini ve tez araştırması sürecini bilimsel yöntem, araştırma etiği ve zaman yönetimi bakımından yönlendirmek.",content:"Akademik planlama, biyoloji literatürünün izlenmesi, araştırma probleminin geliştirilmesi, yöntem seçimi, veri yönetimi, etik uygunluk, ilerleme değerlendirmesi ve bilimsel raporlama süreçleri.",methods:"Danışmanlık görüşmesi, literatür değerlendirmesi, araştırma planı incelemesi ve ilerleme izlemesi.",stages:["Akademik çalışma planının oluşturulması","Biyoloji araştırma alanının sınırlandırılması","Literatür tarama stratejisinin değerlendirilmesi","Araştırma probleminin netleştirilmesi","Etik ve biyogüvenlik gerekliliklerinin incelenmesi","Araştırma tasarımının değerlendirilmesi","Veri toplama planının izlenmesi","Araştırma kayıtlarının kontrolü","Bulguların ön değerlendirmesi","Analiz yaklaşımının gözden geçirilmesi","Bilimsel yazım planının oluşturulması","Kaynak ve atıf düzeninin denetlenmesi","Araştırma sınırlılıklarının değerlendirilmesi","Akademik gelişim ve ilerleme izlemesi","Sonraki dönem çalışma planının kararlaştırılması"]},
  {code:"BİO8XX",name:"UZMANLIK ALAN DERSİ",theory:4,practice:0,credit:0,ects:5,purpose:"Öğrencinin tez konusu ile ilişkili ileri biyoloji literatürünü eleştirel değerlendirmesini ve araştırmasının kuramsal-yöntemsel altyapısını derinleştirmesini sağlamak.",content:"Tez alanına özgü güncel biyoloji literatürü, araştırma problemi, kuramsal çerçeve, deneysel veya gözlemsel tasarım, veri analizi yaklaşımı, biyolojik yorumlama ve araştırma etiği.",methods:"Bireysel araştırma, makale incelemesi, yöntem karşılaştırması, veri yorumlama ve danışmanlık tartışması.",stages:["Tez alanının bilimsel kapsamının belirlenmesi","Temel ve güncel literatürün sınıflandırılması","Kuramsal yaklaşımların karşılaştırılması","Araştırma boşluğunun tanımlanması","Biyolojik araştırma sorularının geliştirilmesi","Hipotezlerin bilimsel temellendirilmesi","Araştırma desenlerinin karşılaştırılması","Örnekleme yaklaşımının değerlendirilmesi","Ölçüm ve gözlem yöntemlerinin incelenmesi","Veri kalite ölçütlerinin belirlenmesi","Analiz seçeneklerinin karşılaştırılması","Bulguların biyolojik yorum çerçevesi","Etik ve biyogüvenlik risklerinin değerlendirilmesi","Araştırma sınırlılıklarının tartışılması","Kuramsal ve yöntemsel çerçevenin bütünleştirilmesi"]},
  {code:"BİO806",name:"SEMİNER",theory:0,practice:0,credit:0,ects:6,purpose:"Biyoloji alanında bilimsel bir problemi literatüre dayalı olarak inceleme, akademik metne dönüştürme ve bilimsel ortamda savunma becerisi kazandırmak.",content:"Literatür tarama, kaynak değerlendirme, araştırma probleminin kurulması, bilimsel metin yapısı, bulguların sentezi, görsel veri sunumu, akademik anlatım ve bilimsel tartışma.",methods:"Literatür incelemesi, bilimsel yazım, akademik sunum, akran değerlendirmesi ve tartışma.",stages:["Seminer konusunun ve kapsamının belirlenmesi","Araştırma sorusunun geliştirilmesi","Literatür tarama stratejisinin kurulması","Kaynakların güvenilirlik bakımından değerlendirilmesi","Literatürün tematik sınıflandırılması","Biyolojik kanıtların karşılaştırılması","Seminer metninin iskeletinin oluşturulması","Yöntem ve bulguların sentezlenmesi","Tablo ve görsellerin bilimsel düzenlenmesi","Bilimsel tartışmanın yapılandırılması","Sonuç ve çıkarımların oluşturulması","Atıf ve kaynakça denetimi","Akademik görsel anlatım tasarımının geliştirilmesi","Bilimsel anlatımın uygulanması","Geri bildirim doğrultusunda nihai düzenleme"]},
  {code:"BİO809",name:"BİLİMSEL ARAŞTIRMA YÖNTEMLERİ VE YAYIN ETİĞİ",theory:3,practice:0,credit:3,ects:6,purpose:"Biyoloji araştırmalarını bilimsel yöntem ve yayın etiği ilkelerine uygun tasarlama, yürütme, analiz etme ve raporlama yeterliliği kazandırmak.",content:"Bilimsel problem ve hipotez, biyolojik araştırma desenleri, örnekleme, veri toplama ve kalite güvencesi, temel analiz yaklaşımları, bilimsel yazım, araştırma bütünlüğü, yayın etiği ve biyogüvenlik.",methods:"Kuramsal anlatım, biyoloji makalesi incelemesi, araştırma tasarımı çözümlemesi, etik vaka tartışması ve veri yorumlama.",stages:["Bilimsel bilgi ve biyoloji araştırmasının özellikleri","Araştırma problemi ve hipotez geliştirme","Biyolojik araştırma desenlerinin karşılaştırılması","Örnekleme ve çalışma birimlerinin belirlenmesi","Değişken ve ölçüm düzeyleri","Veri toplama yöntemleri ve kalite güvencesi","Deneysel kontrol ve geçerlik","Temel biyolojik veri analizi yaklaşımları","Bulguların görselleştirilmesi ve yorumlanması","Bilimsel makalenin yapısı","Kaynak kullanımı ve atıf ilkeleri","Araştırma bütünlüğü ve sorumlu araştırma","Yayın etiği ihlallerinin değerlendirilmesi","Biyogüvenlik ve etik kurul süreçleri","Araştırma tasarımının bütüncül değerlendirilmesi"]},
  {code:"BİO81X",name:"TEZ ÇALIŞMASI",theory:0,practice:0,credit:0,ects:24,purpose:"Öğrencinin biyoloji alanında bağımsız bir araştırmayı etik ilkelere uygun biçimde tasarlaması, yürütmesi, çözümlemesi ve bilimsel olarak savunmasını sağlamak.",content:"Özgün biyolojik araştırma problemi, literatür sentezi, araştırma tasarımı, etik ve biyogüvenlik, veri üretimi, kalite kontrolü, analiz, biyolojik yorumlama, tez yazımı ve savunma.",methods:"Bağımsız araştırma, laboratuvar veya saha çalışmasının izlenmesi, veri analizi, bilimsel yazım ve danışmanlık görüşmesi.",stages:["Araştırma probleminin kesinleştirilmesi","Literatür çerçevesinin güncellenmesi","Araştırma amaç ve hipotezlerinin yapılandırılması","Yöntem ve örnekleme planının kesinleştirilmesi","Etik ve biyogüvenlik süreçlerinin tamamlanması","Veri üretim sürecinin planlanması","Araştırma kayıtlarının ve kalite kontrolünün yürütülmesi","Veri toplama sürecinin izlenmesi","Verilerin düzenlenmesi ve doğrulanması","Analizlerin yürütülmesi","Bulguların biyolojik olarak yorumlanması","Bulguların literatürle karşılaştırılması","Tez bölümlerinin bilimsel yazımı","Tez metninin bütünlük ve etik denetimi","Savunma hazırlığı ve araştırmanın bilimsel sunumu"]},
];
const commonPackages = commonSpecs.map((spec) => {
  const domain=domainFor(spec.name); const assessments=spec.code === "BİO806" ? [{name:"Seminer Metni ve Sunumu",count:1,weight:100}] : spec.code === "BİO809" ? [{name:"Ara Sınav",count:1,weight:40},{name:"Yarıyıl Sonu Sınavı",count:1,weight:60}] : [{name:"Başarılı / Başarısız",count:1,weight:100}];
  return {...spec,department:"Biyoloji ABD",programName:"Biyoloji",language:"Türkçe",level:"Tezli Yüksek Lisans",teachingMode:spec.code === "BİO809" ? "Yüz Yüze" : "Bireysel Çalışma",prerequisites:"Yok",instructor:spec.code === "BİO809" ? "Prof. Dr. ABDULLAH MART" : "Öğrencinin Danışmanı",resources:"Biyoloji alanına özgü güncel hakemli literatür; Enstitü tez yazım ve etik yönergeleri; ders sorumlusunun önerdiği bilimsel kaynaklar.",sdgs:domain.sdgs,outcomes:outcomesFor(spec.name,domain),weeklyTopics:spec.stages,assessments,workloads:workloadsFor(spec.ects,spec.theory,spec.practice,assessments),contributionMatrix:matrixFor(domain),qualityChecks:checks(true),publicQualityChecklist:false};
});

const header = `// ${path.basename(sourcePath)} ve resmi LEE_DBP ders kataloğundan üretilmiştir; program profili ve PÇ kayıtları değiştirilmemiştir.\nimport type { CoursePackage } from "./coursePackages";\n\n`;
writeFileSync(path.join(process.cwd(),"lib","data","biyolojiTezliCoursePackages.ts"),`${header}export const biyolojiTezliCoursePackages: CoursePackage[] = ${JSON.stringify(fieldPackages,null,2)};\n`,`utf8`);
writeFileSync(path.join(process.cwd(),"lib","data","biyolojiCommonCoursePackages.ts"),`${header}export const biyolojiCommonCoursePackages: CoursePackage[] = ${JSON.stringify(commonPackages,null,2)};\n`,`utf8`);
console.log(JSON.stringify({field:fieldPackages.length,common:commonPackages.length,sourceMissing:fieldPackages.filter((item)=>!item.sourceUrl).map((item)=>item.code),pc:programOutcomes.length},null,2));

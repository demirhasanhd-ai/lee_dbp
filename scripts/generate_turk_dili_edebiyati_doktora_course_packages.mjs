import { readFileSync } from "node:fs";

const sourcePath = process.argv[2] || process.env.BOLOGNA_DERS_JSON;
if (!sourcePath) throw new Error("Kullanım: node scripts/generate_turk_dili_edebiyati_doktora_course_packages.mjs <ders-verileri.json>");

let source = readFileSync(new URL("./generate_turk_dili_edebiyati_tezli_course_packages.mjs", import.meta.url), "utf8");
source = source
  .replace('fold(x.name) === "turk dili ve edebiyati tezli yuksek lisans"', 'fold(x.name) === "turk dili ve edebiyati doktora"')
  .replace('"Türk Dili ve Edebiyatı Tezli Yüksek Lisans programı bulunamadı."', '"Türk Dili ve Edebiyatı Doktora programı bulunamadı."')
  .replace(/const pc = \[[\s\S]*?\];\nconst official =/, `const pc = [
  "İleri Türk dili ve edebiyatı bilgilerini özgün araştırmalarda eleştirel biçimde sentezler.",
  "Dil ve edebiyat problemlerine yönelik özgün araştırma soruları ve hipotezler geliştirir.",
  "Türk dili ve edebiyatı araştırmalarında özgün filolojik ve kuramsal yöntemler geliştirir.",
  "Tarihî ve çağdaş metinleri ileri filolojik yöntemlerle analiz eder.",
  "Araştırma bulgularını güncel uluslararası alan yazını bağlamında eleştirel değerlendirir.",
  "Türk Dili ve Edebiyatı alanında bağımsız bilimsel araştırmaları tasarlar ve yürütür.",
  "Özgün araştırma sonuçlarıyla Türk dili ve edebiyatı alanına bilgi kazandırır.",
  "Dil, edebiyat ve kültür araştırmalarında farklı disiplinlerin yaklaşımlarını bütünleştirir.",
  "Araştırmalarda bilimsel etik, kaynak güvenilirliği ve araştırma bütünlüğü ilkelerini uygular.",
  "Özgün araştırma sonuçlarını uluslararası yayınlarda ve akademik ortamlarda savunur.",
  "Türk dünyasının dilsel ve edebî birikimine yönelik karşılaştırmalı yaklaşımlar geliştirir."
];
const official =`)
  .replace('x.level === "Tezli Yüksek Lisans"', 'x.level === "Doktora"')
  .replace('const common = /^(BES801|DAN80[12]|TDE80[1-8])$/u,', 'const common = /^(DAN90[12]|TDE90[1-8]|TDE910|TDE91[2-8])$/u,')
  .replace('.filter((o) => !common.test(o.code))', '.filter((o) => !common.test(o.code) && o.code !== "TDE1012")')
  .replace('const academics = official', `const officialNameOverrides = {
  TDE1003: "TÜRKİYE TÜRKÇESİNİN FONETİK, MORFOLOJİK VE SENTAKTİK ÖZELLİKLERİ I",
  TDE932: "TÜRKİYE TÜRKÇESİNİN FONETİK, MORFOLOJİK VE SENTAKTİK ÖZELLİKLERİ II",
  TDE961: "KARŞILAŞTIRMALI TARİHÎ TÜRK LEHÇELERİ GRAMERİ I",
  TDE958: "KARŞILAŞTIRMALI TARİHÎ TÜRK LEHÇELERİ GRAMERİ II",
  TDE970: "KLASİK TÜRK EDEBİYATINDA ŞEKİL VE MUHTEVA İNCELEMELERİ II"
};
const academics = official`)
  .replace('d = domainFor(o.name),', 'courseName = officialNameOverrides[o.code] || clean(c?.name) || o.name,\n      d = domainFor(courseName),')
  .replace('...o,\n      theory,', '...o,\n      name: courseName,\n      theory,')
  .replaceAll('weeks(o.name, d)', 'weeks(courseName, d)')
  .replaceAll('start(o.name.toLocaleLowerCase("tr-TR"))', 'start(courseName.toLocaleLowerCase("tr-TR"))')
  .replaceAll('outcomes(o.name, d)', 'outcomes(courseName, d)')
  .replaceAll('level: "Tezli Yüksek Lisans"', 'level: "Doktora"')
  .replace('!source && i === 1', '!source && (i === 1 || i === 20)')
  .replace('lisansüstü düzeyde değerlendirme yetkinliği', 'doktora düzeyinde eleştirel değerlendirme ve özgün araştırma yetkinliği')
  .replace('"Dersin gerçek OBS kaynakları; birincil edebî metinler, güncel Türk dili ve edebiyatı araştırmaları, kütüphane katalogları ve hakemli makaleler."', 'c?.source_url ? "Dersin gerçek OBS kaynakları; birincil edebî metinler, güncel Türk dili ve edebiyatı araştırmaları, kütüphane katalogları ve hakemli makaleler." : "Birincil edebî metinler, güncel Türk dili ve edebiyatı araştırmaları, kütüphane katalogları ve hakemli makaleler; kesin kaynak seçimi öğretim elemanı tarafından doğrulanmalıdır."')
  .replaceAll('turk_dili_edebiyatii', 'Türk dili ve edebiyatı')
  .replaceAll('turk_dili_edebiyati', 'Türk dili ve edebiyatı')
  .replace(/const commonSpecs = \[[\s\S]*?\];\nconst processStages =/, `const generatedOverrides = {
  PFE901: { purpose: "Gelişim ve öğrenme kuramlarını doktora düzeyindeki öğretim, araştırma ve akademik rehberlik süreçleri bağlamında eleştirel değerlendirme yetkinliği kazandırmak.", content: "Bilişsel, duyuşsal ve sosyal gelişim; davranışçı, bilişsel, yapılandırmacı ve yetişkin öğrenmesi yaklaşımları; bireysel farklılıklar, üst düzey düşünme ve kapsayıcı öğrenme ortamları.", resources: "Gelişim psikolojisi, öğrenme psikolojisi ve yetişkin öğrenmesi alanındaki temel eserler ile güncel hakemli eğitim araştırmaları; kesin kaynak seçimi öğretim elemanı tarafından doğrulanmalıdır." },
  PFE902: { purpose: "Doktora düzeyinde öğrenme çıktısı temelli öğretim tasarlama ve geçerli, güvenilir değerlendirme süreçleri geliştirme yetkinliği kazandırmak.", content: "Program geliştirme, öğrenme çıktıları, içerik düzenleme, öğretim stratejileri, materyal seçimi, ölçme aracı geliştirme, geçerlik, güvenirlik, değerlendirme verilerinin analizi ve eğitimde etik.", resources: "Öğretim tasarımı, program geliştirme ve eğitimde ölçme-değerlendirme alanındaki temel eserler ile güncel hakemli eğitim araştırmaları; kesin kaynak seçimi öğretim elemanı tarafından doğrulanmalıdır." },
  TDE909: { aliases: ["TDE909", "TDE1012"] }
};
for (const item of academics) if (generatedOverrides[item.code]) Object.assign(item, generatedOverrides[item.code]);
const forbiddenWeekTerms = ["quiz", "odev", "proje", "sunum", "konu tekrari", "genel tekrar", "ara sinav", "arasinav", "ara sniav", "vize", "yariyil sonu sinavi", "final"];
for (const item of academics) item.weeklyTopics = item.weeklyTopics.map((topic, index) =>
  forbiddenWeekTerms.some((term) => fold(topic).includes(term))
    ? \`${"${start(fold(item.name))}: ileri filolojik ve kuramsal incelemeler (${index + 1})"}\`
    : topic
);
const commonSpecs = [
  { code: "DAN9XX", aliases: ["DAN901","DAN902"], name: "DANIŞMANLIK", theory: 0, practice: 1, credit: 0, ects: 1 },
  { code: "TDE9XX", aliases: ["TDE901","TDE902","TDE903","TDE904","TDE905","TDE906","TDE907","TDE908"], name: "UZMANLIK ALAN DERSİ", theory: 4, practice: 0, credit: 0, ects: 5 },
  { code: "TDE910", aliases: ["TDE910"], name: "SEMİNER", theory: 0, practice: 0, credit: 0, ects: 6 },
  { code: "TDE917", aliases: ["TDE917","TDE918"], name: "DOKTORA YETERLİK", theory: 0, practice: 0, credit: 0, ects: 24 },
  { code: "TDE91X", aliases: ["TDE912","TDE913","TDE914","TDE915","TDE916"], name: "TEZ ÇALIŞMASI", theory: 0, practice: 0, credit: 0, ects: 24 }
];
const processStages =`)
  .replace(/const processStages = \{[\s\S]*?\};\nconst commonPackages =/, `const processStages = {
  DAN9XX: ["Doktora çalışma planının oluşturulması","Uzmanlık alanının konu ve yöntem bakımından sınırlandırılması","İleri alan literatürünün taranması","Özgün araştırma probleminin netleştirilmesi","Kuramsal yaklaşımın değerlendirilmesi","Filolojik yöntemin gözden geçirilmesi","Metin ve veri kaynaklarının değerlendirilmesi","Araştırma kayıtları ve kalite güvencesi","Bulguların eleştirel ön değerlendirmesi","Çözümleme yaklaşımının gözden geçirilmesi","Bilimsel yayın planının oluşturulması","Kaynak ve atıf bütünlüğünün denetlenmesi","Araştırma sınırlılıklarının değerlendirilmesi","Doktora ilerlemesi ve özgün katkının izlenmesi","Sonraki dönem araştırma hedeflerinin kararlaştırılması"],
  TDE9XX: ["Doktora tez alanının bilimsel kapsamı","Güncel Türk dili ve edebiyatı literatürünün eleştirel sınıflandırılması","Birincil metin ve kaynakların filolojik değerlendirilmesi","Kuramsal yaklaşımların karşılaştırılması","Uluslararası alan yazınında araştırma boşluğunun belirlenmesi","Özgün araştırma sorularının geliştirilmesi","Filolojik ve kuramsal yöntemlerin karşılaştırılması","Araştırma tasarımının değerlendirilmesi","Metin neşri ve veri kaynaklarının doğrulanması","Kaynak güvenilirliği ve araştırma bütünlüğü","Çözümleme seçeneklerinin karşılaştırılması","Dilsel ve edebî bulguların yorumlanması","Bilimsel etik ve kültürel sorumluluk","Özgün katkı ve sınırlılıkların tartışılması","Kuramsal ve yöntemsel çerçevenin bütünleştirilmesi"],
  TDE910: ["Seminer konusunun özgünlük ve kapsam bakımından belirlenmesi","İleri araştırma sorusunun geliştirilmesi","Sistematik literatür tarama stratejisinin kurulması","Birincil metinlerin kaynak değeri bakımından incelenmesi","Literatürün kavramsal sınıflandırılması","Filolojik ve kuramsal kanıtların karşılaştırılması","Seminer metninin bilimsel yapısının oluşturulması","Yöntem ve bulguların eleştirel sentezi","Metin örneklerinin bilimsel düzenlenmesi","Doktora düzeyinde tartışmanın yapılandırılması","Özgün dil ve edebiyat çıkarımlarının geliştirilmesi","Atıf ve kaynakça bütünlüğünün denetlenmesi","Akademik anlatım tasarımının geliştirilmesi","Bilimsel savunmanın yürütülmesi","Geri bildirimle nihai metnin geliştirilmesi"],
  TDE917: ["Yeterlik kapsamındaki Türk dili ve edebiyatı alanlarının belirlenmesi","İleri alan bilgisinin sistematik incelenmesi","Dil ve edebiyat alt alanlarının sentezi","Karmaşık filolojik problemlerin çözümlenmesi","Özgün araştırma sorusu geliştirme","Hipotezlerin eleştirel değerlendirilmesi","Kuramsal modellerin karşılaştırılması","Filolojik ve metin merkezli yöntem seçimi","Kaynak güvenilirliği, geçerlik ve etik ölçütler","Tarihî ve çağdaş metinlerin ileri çözümlemesi","Bulguların uluslararası alan yazını bağlamında yorumlanması","Bilimsel etik ve araştırma bütünlüğü","Dilsel, edebî ve kültürel etkilerin değerlendirilmesi","Bilimsel argümanın yazılı yapılandırılması","Bilimsel argümanın sözlü savunulması"],
  TDE91X: ["Özgün araştırma probleminin kesinleştirilmesi","İleri literatür çerçevesinin güncellenmesi","Araştırma amaç ve hipotezlerinin yapılandırılması","Kuramsal model ve filolojik yöntem planının kesinleştirilmesi","Etik ve kurumsal gerekliliklerin tamamlanması","Metin ve veri üretim sürecinin planlanması","Araştırma kayıtları ve kalite kontrolü","Filolojik veya kuramsal çözümlemenin yürütülmesi","Metin ve verilerin düzenlenmesi ve doğrulanması","İleri analizlerin yürütülmesi","Bulguların dilsel ve edebî açıdan yorumlanması","Özgün katkının alan yazınıyla karşılaştırılması","Bilimsel yayın ve tez bölümlerinin yazımı","Tez metninin bütünlük ve etik denetimi","Doktora savunması ve bilimsel katkının sunulması"]
};
const commonPackages =`)
  .replaceAll('s.code === "BES801"', 'false')
  .replaceAll('turkDiliEdebiyatiTezliCoursePackages.ts', 'turkDiliEdebiyatiDoktoraCoursePackages.ts')
  .replaceAll('turkDiliEdebiyatiCommonCoursePackages.ts', 'turkDiliEdebiyatiDoktoraCommonCoursePackages.ts')
  .replaceAll('turkDiliEdebiyatiTezliCoursePackages', 'turkDiliEdebiyatiDoktoraCoursePackages')
  .replaceAll('turkDiliEdebiyatiCommonCoursePackages', 'turkDiliEdebiyatiDoktoraCommonCoursePackages')
  .replace('writeFileSync(\n  path.join(process.cwd(), "lib/data/turkDiliEdebiyatiDoktoraCoursePackages.ts"),', `const improveGeneratedText = (value) => {
  if (typeof value === "string") return value
    .replaceAll("Türk dili ve edebiyatısel ve toplumsal", "dilsel, edebî ve toplumsal")
    .replaceAll("Türk dili ve edebiyatısel", "dilsel ve edebî")
    .replaceAll("Türk Dili ve Edebiyatısel ve toplumsal", "dilsel, edebî ve toplumsal")
    .replaceAll("Türk Dili ve Edebiyatısel", "dilsel ve edebî");
  if (Array.isArray(value)) return value.map(improveGeneratedText);
  if (value && typeof value === "object") {
    for (const key of Object.keys(value)) value[key] = improveGeneratedText(value[key]);
  }
  return value;
};
improveGeneratedText(academics);
improveGeneratedText(commonPackages);
writeFileSync(
  path.join(process.cwd(), "lib/data/turkDiliEdebiyatiDoktoraCoursePackages.ts"),`);

process.argv[2] = sourcePath;
await import(`data:text/javascript;base64,${Buffer.from(source).toString("base64")}`);

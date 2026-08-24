import { readFileSync } from "node:fs";

const sourcePath = process.argv[2] || process.env.BOLOGNA_DERS_JSON;
if (!sourcePath) throw new Error("Kullanım: node scripts/generate_siyaset_kamu_yonetimi_doktora_course_packages.mjs <ders-verileri.json>");

let source = readFileSync(new URL("./generate_siyaset_kamu_yonetimi_tezli_course_packages.mjs", import.meta.url), "utf8");
source = source
  .replace('fold(x.name) === "siyaset bilimi ve kamu yonetimi tezli yuksek lisans"', 'fold(x.name) === "siyaset bilimi ve kamu yonetimi doktora"')
  .replace('"Siyaset Bilimi ve Kamu Yönetimi Tezli Yüksek Lisans programı bulunamadı."', '"Siyaset Bilimi ve Kamu Yönetimi Doktora programı bulunamadı."')
  .replace(/const pc = \[[\s\S]*?\];\nconst official =/, `const pc = [
  "İleri siyaset ve kamu yönetimi bilgilerini özgün araştırmalarda eleştirel biçimde sentezler.",
  "Karmaşık siyasal ve yönetsel sorunlara yönelik özgün araştırma soruları geliştirir.",
  "Siyaset ve kamu yönetimi araştırmaları için özgün kuramsal modeller geliştirir.",
  "Karmaşık siyasal ve yönetsel verileri ileri araştırma yöntemleriyle analiz eder.",
  "Araştırma bulgularını güncel uluslararası alan yazını bağlamında eleştirel değerlendirir.",
  "Siyaset Bilimi ve Kamu Yönetiminde bağımsız bilimsel araştırmaları tasarlar ve yürütür.",
  "Özgün araştırma sonuçlarıyla siyaset ve kamu yönetimi alanına bilgi kazandırır.",
  "Siyasal ve yönetsel problemlerde farklı sosyal bilim yaklaşımlarını bütünleştirir.",
  "Araştırmalarda bilimsel etik, kamu yararı ve araştırma bütünlüğü ilkelerini uygular.",
  "Özgün araştırma sonuçlarını uluslararası yayınlarda ve akademik ortamlarda savunur.",
  "Karmaşık kamu sorunlarına yönelik kanıta dayalı politika ve stratejiler geliştirir."
];
const official =`)
  .replace('x.level === "Tezli Yüksek Lisans"', 'x.level === "Doktora"')
  .replace('const common = /^(DAN80[12]|SKY80[1-8]|SKY89[89])$/u,', 'const common = /^(DAN90[12]|SKY90[1-9]|SKY910|SKY91[1-8])$/u,')
  .replace('.filter((o) => !common.test(o.code))', '.filter((o) => !common.test(o.code) && o.code !== "SKY998")')
  .replaceAll('level: "Tezli Yüksek Lisans"', 'level: "Doktora"')
  .replace('!source && i === 1', '!source && (i === 1 || i === 20)')
  .replace('alanındaki kuramsal yaklaşımları, ampirik kanıtları ve politika sonuçlarını lisansüstü düzeyde değerlendirme yetkinliği kazandırmayı amaçlamaktadır.', 'alanındaki ileri kuramsal yaklaşımları, özgün araştırma problemlerini ve kanıta dayalı politika sonuçlarını doktora düzeyinde eleştirel değerlendirme yetkinliği kazandırmayı amaçlamaktadır.')
  .replace('"Dersin gerçek OBS kaynakları; güncel siyaset bilimi ve kamu yönetimi literatürü, hakemli makaleler ve ilgili ulusal/uluslararası veri kaynakları."', 'c?.source_url ? "Dersin gerçek OBS kaynakları; güncel siyaset bilimi ve kamu yönetimi literatürü, hakemli makaleler ve ilgili ulusal/uluslararası veri kaynakları." : "Güncel siyaset bilimi ve kamu yönetimi literatürü, hakemli makaleler ve ilgili ulusal/uluslararası veri kaynakları; kesin kaynak seçimi öğretim elemanı tarafından doğrulanmalıdır."')
  .replace(/const commonSpecs = \[[\s\S]*?\];\nconst processStages =/, `const generatedOverrides = {
  BFE901: { purpose: "Gelişim ve öğrenme kuramlarını doktora düzeyindeki öğretim, araştırma ve akademik rehberlik süreçleri bağlamında eleştirel değerlendirme yetkinliği kazandırmak.", content: "Bilişsel, duyuşsal ve sosyal gelişim; davranışçı, bilişsel, yapılandırmacı ve yetişkin öğrenmesi yaklaşımları; bireysel farklılıklar, üst düzey düşünme ve kapsayıcı öğrenme ortamları.", resources: "Gelişim psikolojisi, öğrenme psikolojisi ve yetişkin öğrenmesi alanındaki temel eserler ile güncel hakemli eğitim araştırmaları; kesin kaynak seçimi öğretim elemanı tarafından doğrulanmalıdır." },
  PFE902: { purpose: "Doktora düzeyinde öğrenme çıktısı temelli öğretim tasarlama ve geçerli, güvenilir değerlendirme süreçleri geliştirme yetkinliği kazandırmak.", content: "Program geliştirme, öğrenme çıktıları, içerik düzenleme, öğretim stratejileri, materyal seçimi, ölçme aracı geliştirme, geçerlik, güvenirlik, değerlendirme verilerinin analizi ve eğitimde etik.", resources: "Öğretim tasarımı, program geliştirme ve eğitimde ölçme-değerlendirme alanındaki temel eserler ile güncel hakemli eğitim araştırmaları; kesin kaynak seçimi öğretim elemanı tarafından doğrulanmalıdır." },
  SKY932: { weeklyTopics: ["Osmanlı İmparatorluğu'nda ordu teşkilatlanması","Osmanlı İmparatorluğu'nda askerî modernleşme hareketleri","Osmanlı İmparatorluğu'nda askerî okullar ve siyasal düşünce","Tek parti döneminde ordu ve siyaset","Demokrat Parti döneminde sivil-asker ilişkileri","27 Mayıs 1960 askerî müdahalesinin siyasal sonuçları","Talat Aydemir girişimleri ve askerî vesayet tartışmaları","Yön-Devrim hareketi bağlamında sol siyaset ve ordu","1960'lar Türkiye'sinde sivil-asker ilişkilerinin kurumsal yapısı","12 Mart 1971 muhtırası ve siyasal sistem","12 Eylül 1980 müdahalesi ve kurumsal dönüşüm","28 Şubat süreci ve postmodern müdahale tartışmaları","Avrupa Birliği reformları ve sivil denetim","15 Temmuz 2016 girişimi ve güvenlik yönetişimi","Türkiye'de asker-siyaset ilişkilerinin karşılaştırmalı değerlendirilmesi"] },
  SKY999: { aliases: ["SKY999", "SKY998"], weeklyTopics: ["Bilimsel bilgi üretimi ve araştırma etiğinin temelleri","Siyaset ve kamu yönetiminde araştırma probleminin kurulması","Kuramsal çerçeve ve kavramsallaştırma","Literatür tarama ve kanıtların eleştirel değerlendirilmesi","Nitel araştırma desenleri","Nicel araştırma desenleri","Karma yöntem araştırma tasarımı","Örnekleme stratejileri ve saha erişimi","Veri toplama araçlarının geçerlik ve güvenirliği","Nitel veri çözümleme yaklaşımları","Nicel veri çözümleme yaklaşımları","Araştırma bulgularının yorumlanması","Kaynak gösterme, yayın etiği ve intihalin önlenmesi","Araştırma bütünlüğü, açık bilim ve veri yönetimi","Bilimsel raporlama ve araştırma tasarımının bütünleştirilmesi"] },
  SKY934: { name: "AB ve Türkiye'de Yerelleşme ve Yerel Yönetimler", purpose: "Avrupa Birliği ve Türkiye'deki yerelleşme süreçlerini, çok düzeyli yönetişim yapılarını ve yerel yönetim reformlarını doktora düzeyinde karşılaştırmalı değerlendirme yetkinliği kazandırmak.", content: "Yerelleşme kuramları, Avrupa Yerel Yönetimler Özerklik Şartı, AB çok düzeyli yönetişimi, Türkiye'de yerel yönetim reformları, mali ve idari özerklik, katılım, subsidiarite ve karşılaştırmalı yerel politika analizi.", weeklyTopics: ["Yerelleşme kuramları ve kavramsal çerçeve","Avrupa'da yerel yönetim gelenekleri","Avrupa Yerel Yönetimler Özerklik Şartı","Avrupa Birliği'nde çok düzeyli yönetişim","Subsidiarite ilkesi ve yetki paylaşımı","Yerel yönetimlerde mali özerklik","Yerel demokrasi ve katılım mekanizmaları","Türkiye'de yerel yönetim sisteminin tarihsel gelişimi","Türkiye'de belediye reformları","Büyükşehir yönetimi ve ölçek tartışmaları","Merkez–yerel ilişkilerinin karşılaştırılması","Yerel hizmetlerde performans ve hesap verebilirlik","AB uyum sürecinin yerel yönetimlere etkisi","Yerelleşme politikalarının toplumsal sonuçları","AB ve Türkiye yerel yönetim modellerinin bütünleştirilmesi"] }
};
for (const item of academics) if (generatedOverrides[item.code]) Object.assign(item, generatedOverrides[item.code]);
const forbiddenWeekTerms = ["quiz", "odev", "proje", "sunum", "konu tekrari", "genel tekrar", "ara sinav", "arasinav", "ara sniav", "vize", "yariyil sonu sinavi", "final"];
for (const item of academics) item.weeklyTopics = item.weeklyTopics.map((topic, index) =>
  forbiddenWeekTerms.some((term) => fold(topic).includes(term))
    ? \`${"${start(fold(item.name))}: ileri kuramsal ve uygulamalı incelemeler (${index + 1})"}\`
    : topic
);
const commonSpecs = [
  { code: "DAN9XX", aliases: ["DAN901","DAN902"], name: "DANIŞMANLIK", theory: 0, practice: 1, credit: 0, ects: 1, core: [2,6,9,10,7] },
  { code: "SKY9XX", aliases: ["SKY901","SKY902","SKY903","SKY904","SKY905","SKY906","SKY907","SKY908"], name: "UZMANLIK ALAN DERSİ", theory: 4, practice: 0, credit: 0, ects: 5, core: [1,3,5,6,7] },
  { code: "SKY909", aliases: ["SKY909","SKY910"], name: "SEMİNER", theory: 0, practice: 0, credit: 0, ects: 6, core: [2,5,8,10,7] },
  { code: "SKY917", aliases: ["SKY917","SKY918"], name: "DOKTORA YETERLİK", theory: 0, practice: 0, credit: 0, ects: 24, core: [1,2,3,4,10] },
  { code: "SKY91X", aliases: ["SKY911","SKY912","SKY913","SKY914","SKY915","SKY916"], name: "TEZ ÇALIŞMASI", theory: 0, practice: 0, credit: 0, ects: 24, core: [2,6,7,9,10] }
];
const processStages =`)
  .replace(/const processStages = \{[\s\S]*?\};\nconst commonPackages =/, `const processStages = {
  DAN9XX: ["Doktora çalışma planının oluşturulması","Siyaset bilimi ve kamu yönetimi uzmanlık alanının sınırlandırılması","İleri literatür tarama stratejisinin değerlendirilmesi","Özgün araştırma probleminin netleştirilmesi","Etik ve kamu yararı gerekliliklerinin değerlendirilmesi","Kuramsal çerçeve ve araştırma tasarımının gözden geçirilmesi","Nitel veya nicel çalışma planının değerlendirilmesi","Araştırma kayıtları ve kalite güvencesi","Bulguların eleştirel ön değerlendirmesi","İleri analiz yaklaşımının gözden geçirilmesi","Bilimsel yayın planının oluşturulması","Kaynak ve araştırma bütünlüğü denetimi","Araştırma sınırlılıklarının değerlendirilmesi","Doktora ilerlemesi ve özgün katkının izlenmesi","Sonraki dönem araştırma hedeflerinin kararlaştırılması"],
  SKY9XX: ["Doktora tez alanının bilimsel kapsamı","Güncel siyaset bilimi ve kamu yönetimi literatürünün eleştirel sınıflandırılması","Kuramsal ve yöntemsel yaklaşımların sentezlenmesi","Uluslararası alan yazınında araştırma boşluğunun belirlenmesi","Özgün araştırma sorularının geliştirilmesi","Hipotezlerin siyasal ve yönetsel kuramlarla temellendirilmesi","İleri nitel ve nicel yöntemlerin karşılaştırılması","Araştırma tasarımının değerlendirilmesi","Siyasal ve yönetsel veri kaynaklarının doğrulanması","Veri kalitesi, geçerlik ve tekrarlanabilirlik","İleri analiz seçeneklerinin karşılaştırılması","Bulguların siyasal ve yönetsel açıdan yorumlanması","Kamu yararı, etik ve toplumsal riskler","Özgün katkı ve sınırlılıkların tartışılması","Kuramsal ve yöntemsel çerçevenin bütünleştirilmesi"],
  SKY909: ["Seminer konusunun özgünlük ve kapsam bakımından belirlenmesi","İleri araştırma sorusunun geliştirilmesi","Sistematik literatür tarama stratejisinin kurulması","Kaynakların kanıt düzeyi bakımından değerlendirilmesi","Literatürün kavramsal sınıflandırılması","Kuramsal ve ampirik kanıtların karşılaştırılması","Seminer metninin bilimsel yapısının oluşturulması","Yöntem ve bulguların eleştirel sentezi","Tablo ve göstergelerin bilimsel düzenlenmesi","Doktora düzeyinde tartışmanın yapılandırılması","Özgün politika ve yönetim çıkarımlarının geliştirilmesi","Atıf ve kaynakça bütünlüğünün denetlenmesi","Akademik anlatım tasarımının geliştirilmesi","Bilimsel savunmanın yürütülmesi","Geri bildirimle nihai metnin geliştirilmesi"],
  SKY917: ["Yeterlik kapsamındaki siyaset ve kamu yönetimi alanlarının belirlenmesi","İleri alan bilgisinin sistematik incelenmesi","Siyaset bilimi ve kamu yönetimi alt alanlarının sentezi","Karmaşık kamu sorunlarının bilimsel çözümlemesi","Özgün araştırma sorusu geliştirme","Hipotezlerin eleştirel değerlendirilmesi","Kuramsal modellerin karşılaştırılması","Nitel ve nicel yöntem seçimi","Geçerlik, güvenirlik ve etik ölçütler","İleri siyasal ve yönetsel veri çözümleme","Bulguların uluslararası alan yazını bağlamında yorumlanması","Bilimsel etik, kamu yararı ve araştırma bütünlüğü","Toplumsal ve yönetsel etkilerin değerlendirilmesi","Bilimsel argümanın yazılı yapılandırılması","Bilimsel argümanın sözlü savunulması"],
  SKY91X: ["Özgün araştırma probleminin kesinleştirilmesi","İleri literatür çerçevesinin güncellenmesi","Araştırma amaç ve hipotezlerinin yapılandırılması","Kuramsal model ve yöntem planının kesinleştirilmesi","Etik ve kurumsal gerekliliklerin tamamlanması","Veri üretim sürecinin planlanması","Araştırma kayıtları ve kalite kontrolü","Nitel veya nicel çözümlemenin yürütülmesi","Verilerin düzenlenmesi ve doğrulanması","İleri analizlerin yürütülmesi","Bulguların siyasal ve yönetsel açıdan yorumlanması","Özgün katkının alan yazınıyla karşılaştırılması","Bilimsel yayın ve tez bölümlerinin yazımı","Tez metninin bütünlük ve etik denetimi","Doktora savunması ve bilimsel katkının sunulması"]
};
const commonPackages =`)
  .replace('s.code === "SKY899"', 'false')
  .replaceAll('s.code === "SKY899" ? "Yüz Yüze" : "Bireysel Çalışma"', '"Bireysel Çalışma"')
  .replaceAll('s.code === "SKY899" ? "Prof. Dr. SUSRAN ERKAN EROĞLU" : "Öğrencinin Danışmanı"', '"Öğrencinin Danışmanı"')
  .replaceAll('siyasetKamuYonetimiTezliCoursePackages.ts', 'siyasetKamuYonetimiDoktoraCoursePackages.ts')
  .replaceAll('siyasetKamuYonetimiCommonCoursePackages.ts', 'siyasetKamuYonetimiDoktoraCommonCoursePackages.ts')
  .replaceAll('siyasetKamuYonetimiTezliCoursePackages', 'siyasetKamuYonetimiDoktoraCoursePackages')
  .replaceAll('siyasetKamuYonetimiCommonCoursePackages', 'siyasetKamuYonetimiDoktoraCommonCoursePackages');

process.argv[2] = sourcePath;
await import(`data:text/javascript;base64,${Buffer.from(source).toString("base64")}`);

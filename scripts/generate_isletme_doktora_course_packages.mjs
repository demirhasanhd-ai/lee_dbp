import { readFileSync } from "node:fs";

const sourcePath = process.argv[2] || process.env.BOLOGNA_DERS_JSON;
if (!sourcePath) throw new Error("Kullanım: node scripts/generate_isletme_doktora_course_packages.mjs <ders-verileri.json>");

let source = readFileSync(new URL("./generate_isletme_tezli_course_packages.mjs", import.meta.url), "utf8");
source = source
  .replace('fold(x.name)==="isletme tezli yuksek lisans"', 'fold(x.name)==="isletme doktora"')
  .replace('İşletme Tezli Yüksek Lisans programı bulunamadı.', 'İşletme Doktora programı bulunamadı.')
  .replace(/const pc=\[[\s\S]*?\];\nconst official=/, `const pc=[
"İleri işletme bilgilerini özgün araştırma problemlerinin çözümünde eleştirel biçimde sentezler.",
"Karmaşık işletme sorunlarına yönelik özgün araştırma soruları ve hipotezler geliştirir.",
"İşletme araştırmaları için yenilikçi kuramsal modeller ve yöntemler geliştirir.",
"Karmaşık işletme verilerini ileri nicel ve nitel yöntemlerle analiz eder.",
"Araştırma bulgularını güncel uluslararası işletme literatürü bağlamında eleştirel değerlendirir.",
"İşletme alanında bağımsız ve özgün bilimsel araştırmaları tasarlar ve yürütür.",
"Özgün araştırma sonuçlarıyla işletme bilim alanına yeni bilgi kazandırır.",
"Karmaşık işletme problemlerinde farklı disiplinlerin bilgi ve yöntemlerini bütünleştirir.",
"Araştırmalarda bilimsel etik, sosyal sorumluluk ve araştırma bütünlüğü ilkelerini uygular.",
"Özgün araştırma sonuçlarını uluslararası yayınlarda ve akademik ortamlarda savunur.",
"Dijital dönüşüm ve sürdürülebilirliğe yönelik özgün işletme stratejileri geliştirir."
];
const official=`)
  .replace('x.level==="Tezli Yüksek Lisans"', 'x.level==="Doktora"')
  .replace('const common=/^(DAN80[12]|ISL80[1-8]|ISL(885|888))$/u', 'const common=/^(DAN90[1-8]|ISL90[1-9]|ISL910|ISL91[1-8])$/u')
  .replace('const academics=official.filter', 'const academics=official.filter')
  .replace('const common=/^(DAN90[1-8]|ISL90[1-9]|ISL910|ISL91[1-8])$/u,forbidden=/(quiz|ödev|proje|sunum|konu tekrarı|genel tekrar|ara\\s*sınav|arasınav|yarıyıl sonu sınavı)/iu;', 'const common=/^(DAN90[1-8]|ISL90[1-9]|ISL910|ISL91[1-8])$/u,forbidden=/^(quiz|ödev|proje|sunum|konu tekrarı|genel tekrar|ara\\s*sınav|arasınav|vize(?: sınavı)?|yarıyıl sonu sınavı|final(?: sınavı)?)$/iu;')
  .replaceAll('level:"Tezli Yüksek Lisans"', 'level:"Doktora"')
  .replace('const outcomes=(name,d)=>{const s=clean(name).toLocaleLowerCase("tr-TR");return[`${start(s)} kapsamındaki ileri kuramsal bilgileri analiz eder.`,`${start(d.label)} yaklaşımlarını karşılaştırır.`,`${start(s)} kapsamında uygun iktisadi modeli uygular.`,`${start(s)} bulgularını ekonomik ve toplumsal etkileriyle değerlendirir.`,`${start(s)} alanındaki kanıtlara dayalı politika çıkarımları geliştirir.`]};', 'const outcomes=(name,d)=>{const s=clean(name).toLocaleLowerCase("tr-TR");return[`${start(s)} kapsamındaki ileri kuramsal yaklaşımları eleştirel biçimde analiz eder.`,`${start(d.label)} alanındaki modelleri karşılaştırarak özgün araştırma problemleri geliştirir.`,`${start(s)} kapsamında uygun araştırma modelini tasarlar ve uygular.`,`${start(s)} bulgularını yönetsel, toplumsal ve etik etkileriyle değerlendirir.`,`${start(s)} alanındaki bilimsel kanıtlardan özgün strateji ve araştırma çıkarımları geliştirir.`]};')
  .replace('alanındaki kuramsal yaklaşımları, ampirik kanıtları ve politika sonuçlarını lisansüstü düzeyde değerlendirme yetkinliği kazandırmayı amaçlamaktadır.', 'alanındaki kuramsal yaklaşımları ve güncel bilimsel kanıtları doktora düzeyinde eleştirel değerlendirme ve özgün araştırma problemi geliştirme yetkinliği kazandırmayı amaçlamaktadır.')
  .replace('Dersin gerçek OBS kaynakları; güncel iktisat literatürü, hakemli makaleler ve ilgili ulusal/uluslararası veri kaynakları.', 'Dersin gerçek OBS kaynakları; güncel işletme literatürü, hakemli makaleler ve ilgili ulusal/uluslararası veri kaynakları.')
  .replace('!source&&i===1?"Doğrulanmalı"', '!source&&(i===1||i===20)?"Doğrulanmalı"')
  .replace('const commonSpecs=[', `const generatedOverrides={
"PFE901":{purpose:"Gelişim ve öğrenme kuramlarını doktora düzeyindeki öğretim, araştırma ve akademik rehberlik süreçleri bağlamında eleştirel değerlendirme yetkinliği kazandırmak.",content:"Bilişsel, duyuşsal ve sosyal gelişim; davranışçı, bilişsel, yapılandırmacı ve yetişkin öğrenmesi yaklaşımları; bireysel farklılıklar, üst düzey düşünme ve kapsayıcı öğrenme ortamları.",methods:"Kuramsal anlatım, karşılaştırmalı kuram incelemesi, akademik tartışma, vaka analizi ve bilimsel kaynak değerlendirmesi.",resources:"Gelişim psikolojisi, öğrenme psikolojisi ve yetişkin öğrenmesi alanındaki temel eserler ile güncel hakemli eğitim araştırmaları.",outcomes:["Gelişim ve öğrenme kuramlarını doktora düzeyinde eleştirel karşılaştırır.","Bireysel farklılıkların öğrenme süreçlerine etkilerini analiz eder.","Üst düzey düşünmeyi destekleyen öğrenme yaklaşımlarını değerlendirir.","Kapsayıcı öğrenme ortamları için bilimsel gerekçeli stratejiler geliştirir.","Öğrenme araştırmalarını etik ve yöntemsel ölçütlerle yorumlar."]},
"PFE902":{purpose:"Doktora düzeyinde öğrenme çıktısı temelli öğretim tasarlama ve geçerli, güvenilir değerlendirme süreçleri geliştirme yetkinliği kazandırmak.",content:"Öğretim tasarımı, öğrenme çıktıları, program ve ders planlama, öğretim stratejileri, ölçme aracı geliştirme, geçerlik, güvenirlik, değerlendirme verilerinin analizi ve kalite iyileştirme.",methods:"Kuramsal anlatım, öğretim tasarımı incelemesi, ölçme aracı çözümlemesi, veri yorumlama, vaka analizi ve akademik tartışma.",resources:"Öğretim tasarımı, program geliştirme ve eğitimde ölçme-değerlendirme alanındaki temel eserler ile güncel hakemli eğitim araştırmaları.",outcomes:["Öğrenme çıktısı temelli öğretim tasarımlarını eleştirel değerlendirir.","Program amaçlarıyla uyumlu öğretim stratejileri geliştirir.","Geçerli ve güvenilir ölçme araçlarının özelliklerini analiz eder.","Değerlendirme verilerini öğretim kalitesini geliştirmek için yorumlar.","Doktora düzeyine uygun bir ders ve değerlendirme planı tasarlar."]},
"ISL978":{purpose:"İşletme alanındaki özgün araştırmaları bilimsel yöntem, araştırma bütünlüğü ve yayın etiği ilkelerine uygun biçimde tasarlama ve değerlendirme yetkinliği kazandırmak.",content:"Araştırma problemi ve hipotez, nicel ve nitel araştırma tasarımları, örnekleme, veri analizi, bilimsel yazım, araştırma bütünlüğü, yazarlık, hakemlik ve yayın etiği.",methods:"Kuramsal anlatım, araştırma tasarımı çözümlemesi, makale incelemesi, veri yorumlama, etik vaka analizi ve akademik tartışma.",resources:"İşletme araştırma yöntemleri kaynakları; araştırma bütünlüğü ve yayın etiği kılavuzları; güncel hakemli işletme literatürü.",outcomes:["Özgün işletme araştırma problemleri ve hipotezleri geliştirir.","Nicel ve nitel araştırma tasarımlarını eleştirel değerlendirir.","Örnekleme ve veri analizi yöntemlerinin geçerlik ölçütlerini analiz eder.","Araştırma bulgularını bilimsel raporlama ilkelerine göre yorumlar.","Araştırma ve yayın süreçlerinde etik ilkeleri gerekçelendirerek uygular."]}
};
for(const item of academics){if(generatedOverrides[item.code])Object.assign(item,generatedOverrides[item.code]);}
const commonSpecs=[`)
  .replace(/const commonSpecs=\[[\s\S]*?\];\nconst processStages=/, `const commonSpecs=[
{code:"DAN9XX",aliases:["DAN901","DAN902","DAN903","DAN904","DAN905","DAN906","DAN907","DAN908"],name:"DANIŞMANLIK",theory:0,practice:1,credit:0,ects:1},
{code:"ISL9XX",aliases:["ISL901","ISL902","ISL903","ISL904","ISL905","ISL906","ISL907","ISL908"],name:"UZMANLIK ALAN DERSİ",theory:4,practice:0,credit:0,ects:5},
{code:"ISL909",aliases:["ISL909","ISL910"],name:"SEMİNER",theory:0,practice:0,credit:0,ects:6},
{code:"ISL917",aliases:["ISL917","ISL918"],name:"DOKTORA YETERLİK",theory:0,practice:0,credit:0,ects:24},
{code:"ISL91X",aliases:["ISL911","ISL912","ISL913","ISL914","ISL915","ISL916"],name:"TEZ ÇALIŞMASI",theory:0,practice:0,credit:0,ects:24}
];
const processStages=`)
  .replace(/const processStages=\{[\s\S]*?\};\nconst commonPackages=/, `const processStages={
DAN9XX:["Doktora çalışma planının oluşturulması","İşletme uzmanlık alanının sınırlandırılması","İleri literatür tarama stratejisinin değerlendirilmesi","Özgün araştırma probleminin netleştirilmesi","Kuramsal çerçevenin eleştirel değerlendirilmesi","Yöntem seçiminin gözden geçirilmesi","Veri kaynakları ve araştırma etiğinin değerlendirilmesi","Araştırma kayıtları ile kalite güvencesinin izlenmesi","Bulguların eleştirel ön değerlendirmesi","İleri analiz yaklaşımının gözden geçirilmesi","Bilimsel yayın planının oluşturulması","Kaynak ve araştırma bütünlüğü denetimi","Araştırma sınırlılıklarının değerlendirilmesi","Doktora ilerlemesi ve özgün katkının izlenmesi","Sonraki dönem araştırma hedeflerinin kararlaştırılması"],
ISL9XX:["Doktora tez alanının bilimsel kapsamı","Güncel işletme literatürünün eleştirel sınıflandırılması","Kuramsal yaklaşımların sentezlenmesi","Uluslararası literatürde araştırma boşluğunun belirlenmesi","Özgün araştırma sorularının geliştirilmesi","Hipotezlerin kuramsal temellendirilmesi","İleri nicel ve nitel yöntemlerin karşılaştırılması","Araştırma tasarımının değerlendirilmesi","Veri kaynakları ve veri üretim yöntemleri","Geçerlik, güvenirlik ve araştırma kalitesi","İleri analiz seçeneklerinin karşılaştırılması","Bulguların işletme bilimi açısından yorumlanması","Etik, sosyal sorumluluk ve sürdürülebilirlik","Özgün katkı ve sınırlılıkların tartışılması","Kuramsal ve yöntemsel çerçevenin bütünleştirilmesi"],
ISL909:["Seminer konusunun özgünlük ve kapsam bakımından belirlenmesi","İleri araştırma sorusunun geliştirilmesi","Sistematik literatür tarama stratejisinin kurulması","Kaynakların kanıt düzeyi bakımından değerlendirilmesi","Literatürün kavramsal sınıflandırılması","Kuramsal ve ampirik kanıtların karşılaştırılması","Seminer metninin bilimsel yapısının oluşturulması","Yöntem ve bulguların eleştirel sentezi","Tablo ve görsellerin bilimsel düzenlenmesi","Doktora düzeyinde tartışmanın yapılandırılması","Özgün işletme çıkarımlarının geliştirilmesi","Atıf ve kaynakça bütünlüğünün denetlenmesi","Akademik anlatım tasarımının geliştirilmesi","Bilimsel savunmanın yürütülmesi","Geri bildirimle nihai metnin geliştirilmesi"],
ISL917:["Yeterlik kapsamındaki işletme alanlarının belirlenmesi","İleri işletme bilgisinin sistematik incelenmesi","İşletme alt alanlarının disiplinler arası sentezi","Karmaşık işletme problemlerinin bilimsel çözümlemesi","Özgün araştırma sorusu geliştirme","Hipotezlerin eleştirel değerlendirilmesi","Kuramsal modellerin karşılaştırılması","Nicel ve nitel yöntem seçimi","Geçerlik ve güvenirlik ölçütleri","İleri veri çözümleme yaklaşımları","Bulguların uluslararası literatür bağlamında yorumlanması","Bilimsel etik ve araştırma bütünlüğü","Dijital dönüşüm ve sürdürülebilirlik etkileri","Bilimsel argümanın yazılı yapılandırılması","Bilimsel argümanın sözlü savunulması"],
ISL91X:["Özgün araştırma probleminin kesinleştirilmesi","İleri literatür çerçevesinin güncellenmesi","Araştırma amaç ve hipotezlerinin yapılandırılması","Kuramsal model ve yöntem planının kesinleştirilmesi","Etik ve kurumsal izin süreçleri","Veri üretim sürecinin planlanması","Araştırma kayıtları ve kalite kontrolü","Ampirik veya kuramsal çözümlemenin yürütülmesi","Verilerin düzenlenmesi ve doğrulanması","İleri analizlerin yürütülmesi","Bulguların işletme bilimi açısından yorumlanması","Özgün katkının literatürle karşılaştırılması","Bilimsel yayın ve tez bölümlerinin yazımı","Tez metninin bütünlük ve etik denetimi","Doktora savunması ve bilimsel katkının sunulması"]
};
const commonPackages=`)
  .replace('s.code==="ISL885"', 'false')
  .replace('s.code==="ISL885"?', 'false?')
  .replaceAll('isletmeTezliCoursePackages.ts', 'isletmeDoktoraCoursePackages.ts')
  .replaceAll('isletmeCommonCoursePackages.ts', 'isletmeDoktoraCommonCoursePackages.ts')
  .replaceAll('isletmeTezliCoursePackages', 'isletmeDoktoraCoursePackages')
  .replaceAll('isletmeCommonCoursePackages', 'isletmeDoktoraCommonCoursePackages');

process.argv[2] = sourcePath;
await import(`data:text/javascript;base64,${Buffer.from(source).toString("base64")}`);

import { readFileSync } from "node:fs";

// Enerji Sistemleri Mühendisliği tezli YL üreticisindeki kaynak okuma,
// 15 haftalık plan, AKTS ve kalite kurallarını doktora programına uygular.
// Program profili ve mevcut PÇ kayıtları değiştirilmez.
const sourcePath = process.argv[2] || process.env.BOLOGNA_DERS_JSON;
if (!sourcePath) throw new Error("Kullanım: node scripts/generate_enerji_sistemleri_doktora_course_packages.mjs <ders-verileri.json>");

let source = readFileSync(new URL("./generate_enerji_sistemleri_tezli_course_packages.mjs", import.meta.url), "utf8");
source = source
  .replace('fold(p.name)==="enerji sistemleri muhendisligi tezli yuksek lisans"', 'fold(p.name)==="enerji sistemleri muhendisligi doktora"')
  .replace(
    /const pcs=\[[\s\S]*?\];\nconst raw=/,
    `const pcs=[
"İleri enerji bilgilerini karmaşık mühendislik problemlerinin çözümünde eleştirel biçimde sentezler.",
"Enerji sistemlerine yönelik özgün araştırma soruları ve test edilebilir hipotezler geliştirir.",
"Enerji araştırmaları için yenilikçi modelleme, deneysel tasarım ve yöntemler geliştirir.",
"Karmaşık enerji verilerini ileri analitik ve sayısal yöntemlerle analiz eder.",
"Araştırma bulgularını güncel uluslararası enerji literatürü bağlamında eleştirel olarak değerlendirir.",
"Enerji sistemleri alanında bağımsız ve özgün bilimsel araştırmaları tasarlar ve yürütür.",
"Özgün araştırma sonuçlarıyla enerji sistemleri mühendisliği alanına yeni bilgi kazandırır.",
"Karmaşık enerji problemlerinde farklı mühendislik disiplinlerinin bilgi ve yöntemlerini bütünleştirir.",
"Araştırmalarda bilimsel etik, sürdürülebilirlik ve araştırma bütünlüğü ilkelerini uygular.",
"Özgün araştırma sonuçlarını uluslararası bilimsel yayınlarda ve akademik ortamlarda savunur.",
"Enerji teknolojilerinin çevresel, ekonomik ve toplumsal etkilerine yönelik stratejiler geliştirir."
];
const raw=`,
  )
  .replace('l.includes(\'level: "Tezli Yüksek Lisans"\')', 'l.includes(\'level: "Doktora"\')')
  .replace('const common=/^(DAN80[1-4]|EMB80[1-8]|EMB829|EMB834)$/u;', 'const common=/^(DAN90[1-8]|EMB90[1-9]|EMB910|EMB91[2-8])$/u;')
  .replaceAll('level:"Tezli Yüksek Lisans"', 'level:"Doktora"')
  .replace('instructor:detail(c,"dersi verenler")||o.instructor||"Atama Bekliyor"', 'instructor:clean((detail(c,"dersi verenler")||o.instructor||"Atama Bekliyor").replace(/https?:\\/\\/\\S+|\\S+@\\S+/gu,""))')
  .replace(
    /const specs=\[[\s\S]*?\n\];\nconst commons=/,
    `const specs=[
{code:"DAN9XX",name:"DANIŞMANLIK",theory:0,practice:1,credit:0,ects:1,purpose:"Öğrencinin doktora araştırmasını bilimsel özgünlük, yöntem, etik, yayın ve zaman yönetimi bakımından yönlendirmek.",content:"Doktora araştırma planı, ileri literatür, özgün problem, yöntem geliştirme, veri yönetimi, araştırma bütünlüğü, yayın stratejisi ve ilerleme izlemesi.",stages:["Doktora çalışma planının oluşturulması","Uzmanlık alanının ve araştırma sınırlarının belirlenmesi","İleri literatür tarama stratejisinin değerlendirilmesi","Özgün araştırma probleminin netleştirilmesi","Etik ve güvenlik gerekliliklerinin incelenmesi","Hipotez ve araştırma tasarımının değerlendirilmesi","Veri üretim planının izlenmesi","Araştırma kayıtları ve kalite güvencesi","Bulguların eleştirel ön değerlendirmesi","İleri analiz yaklaşımının gözden geçirilmesi","Bilimsel yayın planının oluşturulması","Kaynak, atıf ve araştırma bütünlüğü denetimi","Araştırma sınırlılıklarının değerlendirilmesi","Doktora ilerlemesi ve bilimsel katkının izlenmesi","Sonraki dönem araştırma hedeflerinin kararlaştırılması"]},
{code:"EMB9XX",name:"UZMANLIK ALAN DERSİ",theory:4,practice:0,credit:0,ects:5,purpose:"Öğrencinin doktora tez alanındaki güncel enerji sistemleri literatürünü eleştirel biçimde sentezlemesini ve özgün araştırmasının kuramsal ve yöntemsel temelini geliştirmesini sağlamak.",content:"Doktora tez alanına özgü enerji kuramları, araştırma boşluğu, ileri modelleme ve deney yöntemleri, veri analizi, bilimsel özgünlük, sürdürülebilirlik ve araştırma etiği.",stages:["Doktora tez alanının bilimsel kapsamı","Güncel enerji literatürünün eleştirel sınıflandırılması","Kuramsal yaklaşımların sentezlenmesi","Uluslararası literatürde araştırma boşluğunun belirlenmesi","Özgün araştırma sorularının geliştirilmesi","Hipotezlerin bilimsel temellendirilmesi","İleri modelleme yaklaşımlarının karşılaştırılması","Deneysel araştırma tasarımının değerlendirilmesi","Ölçüm ve veri üretim yöntemlerinin geliştirilmesi","Veri kalitesi ve tekrarlanabilirlik ölçütleri","İleri analiz seçeneklerinin karşılaştırılması","Enerji performansı sonuçlarının yorumlanması","Etik ve sürdürülebilirlik risklerinin değerlendirilmesi","Özgün katkı ve sınırlılıkların tartışılması","Kuramsal ve yöntemsel çerçevenin bütünleştirilmesi"]},
{code:"EMB909",name:"SEMİNER",theory:0,practice:0,credit:0,ects:6,purpose:"Enerji sistemleri mühendisliğindeki ileri bir bilimsel problemi eleştirel literatür senteziyle inceleme, akademik metne dönüştürme ve doktora düzeyinde savunma becerisi kazandırmak.",content:"İleri literatür tarama, kanıt değerlendirme, özgün enerji problemi, bilimsel metin, bulguların sentezi, akademik tartışma ve bilimsel iletişim.",stages:["Seminer konusunun özgünlük ve kapsam bakımından belirlenmesi","İleri araştırma sorusunun geliştirilmesi","Sistematik literatür tarama stratejisinin kurulması","Kaynakların kanıt düzeyi bakımından değerlendirilmesi","Literatürün kavramsal sınıflandırılması","Çelişen enerji araştırmalarının karşılaştırılması","Seminer metninin bilimsel yapısının oluşturulması","Yöntem ve bulguların eleştirel sentezi","Tablo ve görsellerin bilimsel düzenlenmesi","Doktora düzeyinde tartışmanın yapılandırılması","Özgün mühendislik çıkarımlarının geliştirilmesi","Atıf ve kaynakça bütünlüğünün denetlenmesi","Akademik anlatım tasarımının geliştirilmesi","Bilimsel savunmanın uygulanması","Geri bildirimle nihai metnin geliştirilmesi"]},
{code:"EMB917",name:"DOKTORA YETERLİK",theory:0,practice:0,credit:0,ects:24,purpose:"Öğrencinin enerji sistemlerinde ileri bilgi, bilimsel problem çözme, özgün araştırma tasarlama ve bağımsız araştırma yürütme yeterliliğini bütüncül olarak geliştirmek.",content:"İleri enerji kuramları, disiplinler arası sentez, özgün problem ve hipotez, modelleme ve deney tasarımı, ileri veri analizi, etik, sürdürülebilirlik ve bilimsel savunma.",stages:["Yeterlik kapsamındaki enerji alanlarının belirlenmesi","İleri kuramsal bilginin sistematik incelenmesi","Disiplinler arası enerji ilişkilerinin sentezi","Karmaşık problemlerin bilimsel çözümlemesi","Özgün araştırma sorusu geliştirme","Hipotezlerin eleştirel değerlendirilmesi","Modelleme yaklaşımlarının karşılaştırılması","Deney ve ölçüm yöntemlerinin seçimi","Veri kalitesi ve geçerlik ölçütleri","İleri analitik ve sayısal yöntemler","Bulguların enerji sistemi bağlamında yorumlanması","Bilimsel etik ve araştırma bütünlüğü","Sürdürülebilirlik ve toplumsal etkilerin değerlendirilmesi","Bilimsel argümanın yazılı yapılandırılması","Bilimsel argümanın sözlü savunulması"]},
{code:"EMB91X",name:"TEZ ÇALIŞMASI",theory:0,practice:0,credit:0,ects:24,purpose:"Öğrencinin enerji sistemleri mühendisliği alanında özgün ve bağımsız bir doktora araştırmasını etik ilkelere uygun biçimde yürütmesi, yayımlaması ve savunmasını sağlamak.",content:"Özgün enerji araştırma problemi, ileri literatür sentezi, yöntem geliştirme, modelleme veya deney, veri üretimi, ileri analiz, sürdürülebilirlik, bilimsel yayın, tez yazımı ve savunma.",stages:["Özgün araştırma probleminin kesinleştirilmesi","İleri literatür çerçevesinin güncellenmesi","Araştırma amaç ve hipotezlerinin yapılandırılması","Yenilikçi model veya deney planının kesinleştirilmesi","Etik ve sürdürülebilirlik süreçlerinin tamamlanması","Veri üretim sürecinin planlanması","Araştırma kayıtları ve kalite kontrolünün yürütülmesi","Deney veya benzetim sürecinin izlenmesi","Verilerin düzenlenmesi ve doğrulanması","İleri analizlerin yürütülmesi","Bulguların enerji performansı açısından yorumlanması","Özgün katkının literatürle karşılaştırılması","Bilimsel yayın ve tez bölümlerinin yazımı","Tez metninin bütünlük ve etik denetimi","Doktora savunması ve bilimsel katkının sunulması"]}
];
const commons=`,
  )
  .replace('s.code==="EMB806"', 's.code==="EMB909"')
  .replaceAll('enerjiSistemleriTezliCoursePackages.ts', 'enerjiSistemleriDoktoraCoursePackages.ts')
  .replaceAll('enerjiSistemleriCommonCoursePackages.ts', 'enerjiSistemleriDoktoraCommonCoursePackages.ts')
  .replaceAll('enerjiSistemleriTezliCoursePackages', 'enerjiSistemleriDoktoraCoursePackages')
  .replaceAll('enerjiSistemleriCommonCoursePackages', 'enerjiSistemleriDoktoraCommonCoursePackages');

process.argv[2] = sourcePath;
await import(`data:text/javascript;base64,${Buffer.from(source).toString("base64")}`);

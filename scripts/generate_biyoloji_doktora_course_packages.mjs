import { readFileSync } from "node:fs";

// Biyoloji tezli YL üreticisindeki ortak kaynak okuma ve kalite kurallarını
// doktora programına uygular. Program profili ile PÇ kayıtlarını değiştirmez.
const sourcePath = process.argv[2] || process.env.BOLOGNA_DERS_JSON;
if (!sourcePath) throw new Error("Kullanım: node scripts/generate_biyoloji_doktora_course_packages.mjs <ders-verileri.json>");

let source = readFileSync(new URL("./generate_biyoloji_tezli_course_packages.mjs", import.meta.url), "utf8");
source = source
  .replace(
    'const program = data.programs.find((item) => fold(item.name) === "biyoloji tezli yuksek lisans");',
    'const program = data.programs.find((item) => fold(item.name) === "biyoloji doktora");',
  )
  .replace('if (!program) throw new Error("Biyoloji Tezli Yüksek Lisans programı bulunamadı.");', 'if (!program) throw new Error("Biyoloji Doktora programı bulunamadı.");')
  .replace(
    /const programOutcomes = \[[\s\S]*?\n\];\nconst nameOverrides/,
    `const programOutcomes = [
  "İleri biyolojik bilgileri özgün araştırma problemlerinin çözümünde eleştirel biçimde sentezler.",
  "Karmaşık biyolojik süreçlere yönelik özgün araştırma soruları ve hipotezler geliştirir.",
  "Biyolojik araştırmalar için yenilikçi deneysel tasarım ve yöntemler geliştirir ve uygular.",
  "İleri biyolojik verileri uygun istatistiksel ve biyoinformatik yöntemlerle analiz eder.",
  "Araştırma bulgularını güncel biyoloji literatürü bağlamında eleştirel olarak değerlendirir.",
  "Biyoloji alanında bağımsız ve özgün bir bilimsel araştırmayı tasarlar ve yürütür.",
  "Özgün araştırma sonuçlarıyla biyoloji bilim alanına yeni bilgi kazandırır.",
  "Biyolojik problemlerin çözümünde farklı bilim alanlarının yaklaşımlarını bütünleştirerek kullanır.",
  "Araştırma süreçlerinde bilimsel etik, biyogüvenlik ve araştırma bütünlüğü ilkelerini uygular.",
  "Bilimsel sonuçlarını ulusal ve uluslararası akademik ortamlarda yayımlar ve savunur.",
  "Biyolojik araştırmaların çevresel ve toplumsal etkilerine yönelik stratejiler geliştirir.",
];
const nameOverrides`,
  )
  .replace("line.includes('level: \"Tezli Yüksek Lisans\"')", "line.includes('level: \"Doktora\"')")
  .replace('const commonRawCodes = /^(BİO80[1-9]|BİO810|DAN80[1-4])$/u;', 'const commonRawCodes = /^(BİO90[1-9]|BİO910|BİO91[2-8]|DAN90[1-8])$/u;')
  .replaceAll('level:"Tezli Yüksek Lisans"', 'level:"Doktora"')
  .replaceAll('level:"Tezli Yüksek Lisans"', 'level:"Doktora"')
  .replace(
    /const commonSpecs = \[[\s\S]*?\n\];\nconst commonPackages/,
    `const commonSpecs = [
  {code:"DAN9XX",name:"DANIŞMANLIK",theory:0,practice:1,credit:0,ects:1,purpose:"Öğrencinin doktora araştırmasını bilimsel özgünlük, yöntem, etik, yayın ve zaman yönetimi bakımından yönlendirmek.",content:"Doktora araştırma planı, ileri literatür, özgün problem, yöntem geliştirme, veri yönetimi, araştırma bütünlüğü, yayın stratejisi ve ilerleme izlemesi.",methods:"Danışmanlık görüşmesi, eleştirel literatür değerlendirmesi, araştırma planı incelemesi ve ilerleme izlemesi.",stages:["Doktora çalışma planının oluşturulması","Uzmanlık alanının ve araştırma sınırlarının belirlenmesi","İleri literatür tarama stratejisinin değerlendirilmesi","Özgün araştırma probleminin netleştirilmesi","Etik ve biyogüvenlik gerekliliklerinin incelenmesi","Hipotez ve araştırma tasarımının değerlendirilmesi","Veri üretim planının izlenmesi","Araştırma kayıtları ve kalite güvencesi","Bulguların eleştirel ön değerlendirmesi","İleri analiz yaklaşımının gözden geçirilmesi","Bilimsel yayın planının oluşturulması","Kaynak, atıf ve araştırma bütünlüğü denetimi","Araştırma sınırlılıklarının değerlendirilmesi","Doktora ilerlemesi ve bilimsel katkının izlenmesi","Sonraki dönem araştırma hedeflerinin kararlaştırılması"]},
  {code:"BİO9XX",name:"UZMANLIK ALAN DERSİ",theory:4,practice:0,credit:0,ects:5,purpose:"Öğrencinin doktora tez alanındaki güncel ve ileri literatürü eleştirel biçimde sentezlemesini ve özgün araştırmasının kuramsal-yöntemsel temelini geliştirmesini sağlamak.",content:"Doktora tez alanına özgü kuramlar, araştırma boşluğu, yenilikçi yöntemler, ileri veri analizi, bilimsel özgünlük, araştırma etiği ve uluslararası literatüre katkı.",methods:"Bireysel araştırma, ileri makale incelemesi, yöntem geliştirme, veri yorumlama ve akademik tartışma.",stages:["Doktora tez alanının bilimsel kapsamı","Temel ve güncel literatürün eleştirel sınıflandırılması","Kuramsal yaklaşımların sentezlenmesi","Uluslararası literatürde araştırma boşluğunun belirlenmesi","Özgün araştırma sorularının geliştirilmesi","Hipotezlerin bilimsel temellendirilmesi","İleri araştırma desenlerinin karşılaştırılması","Örnekleme stratejisinin değerlendirilmesi","Ölçüm ve gözlem yöntemlerinin geliştirilmesi","Veri kalite ve tekrarlanabilirlik ölçütleri","İleri analiz seçeneklerinin karşılaştırılması","Bulgular için biyolojik yorum çerçevesi","Etik ve biyogüvenlik risklerinin değerlendirilmesi","Özgün katkı ve sınırlılıkların tartışılması","Kuramsal ve yöntemsel çerçevenin bütünleştirilmesi"]},
  {code:"BİO909",name:"SEMİNER",theory:0,practice:0,credit:0,ects:6,purpose:"Biyoloji alanındaki ileri bir bilimsel problemi eleştirel literatür senteziyle inceleme, akademik metne dönüştürme ve doktora düzeyinde savunma becerisi kazandırmak.",content:"İleri literatür tarama, kanıt değerlendirme, özgün problem, bilimsel metin, bulguların sentezi, akademik tartışma ve bilimsel iletişim.",methods:"Eleştirel literatür incelemesi, bilimsel yazım, akademik sunum, akran değerlendirmesi ve tartışma.",stages:["Seminer konusunun özgünlük ve kapsam bakımından belirlenmesi","İleri araştırma sorusunun geliştirilmesi","Sistematik literatür tarama stratejisinin kurulması","Kaynakların kanıt düzeyi bakımından değerlendirilmesi","Literatürün kavramsal sınıflandırılması","Çelişen biyolojik kanıtların karşılaştırılması","Seminer metninin bilimsel yapısının oluşturulması","Yöntem ve bulguların eleştirel sentezi","Tablo ve görsellerin bilimsel düzenlenmesi","Doktora düzeyinde tartışmanın yapılandırılması","Özgün çıkarımların geliştirilmesi","Atıf ve kaynakça bütünlüğünün denetlenmesi","Akademik anlatım tasarımının geliştirilmesi","Bilimsel savunmanın uygulanması","Geri bildirimle nihai metnin geliştirilmesi"]},
  {code:"BİO917",name:"DOKTORA YETERLİK",theory:0,practice:0,credit:0,ects:24,purpose:"Öğrencinin biyolojide ileri bilgi, bilimsel problem çözme, özgün araştırma tasarlama ve bağımsız araştırma yürütme yeterliliğini bütüncül olarak geliştirmek.",content:"İleri biyoloji kuramları, disiplinler arası sentez, özgün problem ve hipotez, yöntem geliştirme, ileri veri analizi, etik, biyogüvenlik ve bilimsel savunma.",methods:"İleri kaynak incelemesi, problem çözümleme, araştırma tasarımı, yazılı ve sözlü bilimsel tartışma.",stages:["Yeterlik kapsamındaki biyoloji alanlarının belirlenmesi","İleri kuramsal bilginin sistematik incelenmesi","Disiplinler arası biyolojik ilişkilerin sentezi","Karmaşık problemlerin bilimsel çözümlemesi","Özgün araştırma sorusu geliştirme","Hipotezlerin eleştirel değerlendirilmesi","Deneysel ve gözlemsel tasarımların karşılaştırılması","İleri yöntem ve araçların seçimi","Veri kalite ve geçerlik ölçütleri","İstatistiksel ve biyoinformatik analiz yaklaşımları","Bulguların biyolojik bağlamda yorumlanması","Bilimsel etik ve araştırma bütünlüğü","Biyogüvenlik ve toplumsal etkilerin değerlendirilmesi","Bilimsel argümanın yazılı yapılandırılması","Bilimsel argümanın sözlü savunulması"]},
  {code:"BİO91X",name:"TEZ ÇALIŞMASI",theory:0,practice:0,credit:0,ects:24,purpose:"Öğrencinin biyoloji alanında özgün ve bağımsız bir doktora araştırmasını etik ilkelere uygun biçimde yürütmesi, yayımlaması ve savunmasını sağlamak.",content:"Özgün biyolojik araştırma problemi, ileri literatür sentezi, yöntem geliştirme, etik ve biyogüvenlik, veri üretimi, ileri analiz, bilimsel yayın, tez yazımı ve savunma.",methods:"Bağımsız araştırma, laboratuvar veya saha çalışması, ileri veri analizi, bilimsel yayın hazırlığı ve danışmanlık görüşmesi.",stages:["Özgün araştırma probleminin kesinleştirilmesi","İleri literatür çerçevesinin güncellenmesi","Araştırma amaç ve hipotezlerinin yapılandırılması","Yenilikçi yöntem ve örnekleme planının kesinleştirilmesi","Etik ve biyogüvenlik süreçlerinin tamamlanması","Veri üretim sürecinin planlanması","Araştırma kayıtları ve kalite kontrolünün yürütülmesi","Veri toplama sürecinin izlenmesi","Verilerin düzenlenmesi ve doğrulanması","İleri analizlerin yürütülmesi","Bulguların biyolojik olarak yorumlanması","Özgün katkının literatürle karşılaştırılması","Bilimsel yayın ve tez bölümlerinin yazımı","Tez metninin bütünlük ve etik denetimi","Doktora savunması ve bilimsel katkının sunulması"]},
];
const commonPackages`,
  )
  .replace('spec.code === "BİO806"', 'spec.code === "BİO909"')
  .replace('spec.code === "BİO809"', 'spec.code === "BİO917"')
  .replace('spec.code === "BİO809"', 'spec.code === "BİO917"')
  .replace('"Prof. Dr. ABDULLAH MART" : "Öğrencinin Danışmanı"', '"Öğrencinin Danışmanı" : "Öğrencinin Danışmanı"')
  .replaceAll('biyolojiTezliCoursePackages.ts', 'biyolojiDoktoraCoursePackages.ts')
  .replaceAll('biyolojiCommonCoursePackages.ts', 'biyolojiDoktoraCommonCoursePackages.ts')
  .replaceAll('biyolojiTezliCoursePackages', 'biyolojiDoktoraCoursePackages')
  .replaceAll('biyolojiCommonCoursePackages', 'biyolojiDoktoraCommonCoursePackages');

process.argv[2] = sourcePath;
await import(`data:text/javascript;base64,${Buffer.from(source).toString("base64")}`);

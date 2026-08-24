import { readFileSync } from "node:fs";

const sourcePath = process.argv[2] || process.env.BOLOGNA_DERS_JSON;
if (!sourcePath) throw new Error("Kullanım: node scripts/generate_insaat_muhendisligi_doktora_course_packages.mjs <ders-verileri.json>");

let source = readFileSync(new URL("./generate_insaat_muhendisligi_tezli_course_packages.mjs", import.meta.url), "utf8");
source = source
  .replace('fold(x.name)==="insaat muhendisligi tezli yuksek lisans"', 'fold(x.name)==="insaat muhendisligi doktora"')
  .replace(/const pc=\[[\s\S]*?\];\nconst official=/, `const pc=[
"İleri inşaat mühendisliği bilgilerini özgün araştırma problemlerinde eleştirel biçimde sentezler.",
"Karmaşık mühendislik sorunlarına yönelik özgün araştırma soruları ve hipotezler geliştirir.",
"İnşaat mühendisliği araştırmaları için yenilikçi modelleme ve deneysel yöntemler geliştirir.",
"Karmaşık mühendislik verilerini ileri sayısal ve istatistiksel yöntemlerle analiz eder.",
"Araştırma bulgularını güncel uluslararası inşaat mühendisliği literatüründe eleştirel değerlendirir.",
"İnşaat mühendisliği alanında bağımsız ve özgün bilimsel araştırmaları tasarlar ve yürütür.",
"Özgün araştırma sonuçlarıyla inşaat mühendisliği bilim alanına yeni bilgi kazandırır.",
"Karmaşık altyapı problemlerinde farklı mühendislik disiplinlerinin yöntemlerini bütünleştirir.",
"Araştırmalarda bilimsel etik, güvenlik ve araştırma bütünlüğü ilkelerini uygular.",
"Özgün araştırma sonuçlarını uluslararası yayınlarda ve akademik ortamlarda savunur.",
"Sürdürülebilir ve dirençli yapı sistemlerine yönelik yenilikçi stratejiler geliştirir."
];
const official=`)
  .replace('x.level==="Tezli Yüksek Lisans"', 'x.level==="Doktora"')
  .replace('const common=/^(DAN80[1-4]|İNŞ80[1-8]|İNŞ89[78])$/u,forbidden=', 'const common=/^(DAN90[1-8]|İNŞ90[1-9]|İNŞ910|İNŞ91[2-8])$/u,forbidden=')
  .replaceAll('level:"Tezli Yüksek Lisans"', 'level:"Doktora"')
  .replace('!source&&i===1?"Doğrulanmalı"', '!source&&(i===1||i===20)?"Doğrulanmalı"')
  .replace('const forbidden=/(quiz|ödev|proje|sunum|konu tekrarı|genel tekrar|ara\\s*sınav|arasınav|yarıyıl sonu sınavı)/iu;', 'const forbidden=/(quiz|ödev|proje|sunum|konu\\s+tekrarı|genel\\s+tekrar|ara\\s*sınav|arasınav|yarıyıl\\s+sonu\\s+sınavı)/iu;')
  .replace('`${start(s)} alanında politika seçenekleri`', '`${start(s)} alanında tasarım ve çözüm seçeneklerinin değerlendirilmesi`')
  .replace('`${start(s)} uygulamalarının toplumsal etkileri`', '`${start(s)} uygulamalarının güvenlik, çevre ve sürdürülebilirlik etkileri`')
  .replace('const weeks=(name,d)=>', 'const courseLabel=(name)=>clean(name).toLocaleLowerCase("tr-TR").split(" ").map((part)=>part==="ı"?"I":part==="ıı"?"II":part==="ııı"?"III":part).join(" ");\nconst weeks=(name,d)=>')
  .replaceAll('const s=clean(name).toLocaleLowerCase("tr-TR")', 'const s=courseLabel(name)')
  .replaceAll('o.name.toLocaleLowerCase("tr-TR")', 'courseLabel(o.name)')
  .replace(/const outcomes=\(name,d\)=>\{[\s\S]*?\};\nconst matrix=/, `const outcomes=(name,d)=>{const s=courseLabel(name);return[
\`${'${start(s)}'} kapsamındaki ileri kuramsal bilgileri eleştirel biçimde analiz eder.\`,
\`${'${start(d.label)}'} problemlerine uygun analitik, sayısal veya deneysel yöntemleri karşılaştırır.\`,
\`${'${start(s)}'} için bilimsel gerekçeli bir model ya da araştırma yaklaşımı geliştirir.\`,
\`${'${start(s)}'} bulgularını güvenlik, çevre ve sürdürülebilirlik ölçütleriyle değerlendirir.\`,
\`${'${start(s)}'} alanındaki araştırma sonuçlarını bilimsel bütünlük içinde yorumlar ve savunur.\`
]};
const matrix=`)
  .replace('const matrix=(d)=>[[d.core[0],2],[d.core[1],7],[d.core[2],3,4],[5,10,11],[5,6,8]].map((targets,r)=>({outcome:`DÖÇ${r+1}`,values:pc.map((_,i)=>targets.includes(i+1)?(r===2?5:4):((i+r)%3===0?3:(i+r)%2+1))}));', 'const matrix=(d)=>[[d.core[0],2,5],[d.core[1],3,4],[d.core[2],3,6],[5,8,11],[6,7,9,10]].map((targets,r)=>({outcome:`DÖÇ${r+1}`,values:pc.map((_,i)=>targets.includes(i+1)?5:(d.core.includes(i+1)?4:((i+r)%3===0?3:(i+r)%2+1)))}));')
  .replace('purpose:detail(c,"dersin amaci")||`${start(courseLabel(o.name))} alanındaki kuramsal yaklaşımları, ampirik kanıtları ve politika sonuçlarını lisansüstü düzeyde değerlendirme yetkinliği kazandırmayı amaçlamaktadır.`', 'purpose:detail(c,"dersin amaci")||`${start(courseLabel(o.name))} alanındaki ileri kuramsal yaklaşımları, mühendislik kanıtlarını ve çözüm yöntemlerini doktora düzeyinde eleştirel değerlendirme yetkinliği kazandırmak.`')
  .replace('resources:"Dersin gerçek OBS kaynakları; güncel iktisat literatürü, hakemli makaleler ve ilgili ulusal/uluslararası veri kaynakları."', 'resources:c?.source_url?"Dersin gerçek OBS kaynakları; güncel inşaat mühendisliği literatürü, hakemli makaleler ve ilgili ulusal/uluslararası standartlar.":"Güncel inşaat mühendisliği literatürü, hakemli makaleler ve ilgili ulusal/uluslararası standartlar; kesin kaynak seçimi öğretim elemanı tarafından doğrulanmalıdır."')
  .replace(/const commonSpecs=\[[\s\S]*?\];\nconst processStages=/, `const commonSpecs=[
{code:"DAN9XX",name:"DANIŞMANLIK",theory:0,practice:1,credit:0,ects:1},
{code:"İNŞ9XX",name:"UZMANLIK ALAN DERSİ",theory:4,practice:0,credit:0,ects:5},
{code:"İNŞ909",name:"SEMİNER",theory:0,practice:0,credit:0,ects:6},
{code:"İNŞ917",name:"DOKTORA YETERLİK",theory:0,practice:0,credit:0,ects:24},
{code:"İNŞ91X",name:"TEZ ÇALIŞMASI",theory:0,practice:0,credit:0,ects:24}
];
const processStages=`)
  .replace(/const processStages=\{[\s\S]*?\};\nconst commonPackages=/, `const processStages={
DAN9XX:["Doktora çalışma planının oluşturulması","İnşaat mühendisliği uzmanlık alanının sınırlandırılması","İleri literatür tarama stratejisinin değerlendirilmesi","Özgün araştırma probleminin netleştirilmesi","Etik ve güvenlik gerekliliklerinin değerlendirilmesi","Hipotez ve araştırma tasarımının gözden geçirilmesi","Deneysel veya sayısal çalışma planının değerlendirilmesi","Araştırma kayıtları ve kalite güvencesi","Bulguların eleştirel ön değerlendirmesi","İleri analiz yaklaşımının gözden geçirilmesi","Bilimsel yayın planının oluşturulması","Kaynak ve araştırma bütünlüğü denetimi","Araştırma sınırlılıklarının değerlendirilmesi","Doktora ilerlemesi ve özgün katkının izlenmesi","Sonraki dönem araştırma hedeflerinin kararlaştırılması"],
İNŞ9XX:["Doktora tez alanının bilimsel kapsamı","Güncel inşaat mühendisliği literatürünün eleştirel sınıflandırılması","Kuramsal ve teknolojik yaklaşımların sentezlenmesi","Uluslararası literatürde araştırma boşluğunun belirlenmesi","Özgün araştırma sorularının geliştirilmesi","Hipotezlerin mühendislik ilkeleriyle temellendirilmesi","İleri modelleme ve deneysel yöntemlerin karşılaştırılması","Araştırma tasarımının değerlendirilmesi","Ölçüm, veri üretimi ve doğrulama yöntemleri","Belirsizlik, veri kalitesi ve tekrarlanabilirlik","İleri analiz seçeneklerinin karşılaştırılması","Bulguların mühendislik açısından yorumlanması","Güvenlik, sürdürülebilirlik ve etik riskler","Özgün katkı ve sınırlılıkların tartışılması","Kuramsal ve yöntemsel çerçevenin bütünleştirilmesi"],
İNŞ909:["Seminer konusunun özgünlük ve kapsam bakımından belirlenmesi","İleri araştırma sorusunun geliştirilmesi","Sistematik literatür tarama stratejisinin kurulması","Kaynakların kanıt düzeyi bakımından değerlendirilmesi","Literatürün kavramsal sınıflandırılması","Sayısal ve deneysel kanıtların karşılaştırılması","Seminer metninin bilimsel yapısının oluşturulması","Yöntem ve bulguların eleştirel sentezi","Tablo ve görsellerin bilimsel düzenlenmesi","Doktora düzeyinde tartışmanın yapılandırılması","Özgün mühendislik çıkarımlarının geliştirilmesi","Atıf ve kaynakça bütünlüğünün denetlenmesi","Akademik anlatım tasarımının geliştirilmesi","Bilimsel savunmanın uygulanması","Geri bildirimle nihai metnin geliştirilmesi"],
İNŞ917:["Yeterlik kapsamındaki inşaat mühendisliği alanlarının belirlenmesi","İleri alan bilgisinin sistematik incelenmesi","İnşaat mühendisliği alt alanlarının sentezi","Karmaşık altyapı problemlerinin bilimsel çözümlemesi","Özgün araştırma sorusu geliştirme","Hipotezlerin eleştirel değerlendirilmesi","Modelleme yaklaşımlarının karşılaştırılması","Deneysel yöntem ve örnekleme seçimi","Ölçüm belirsizliği ve geçerlik ölçütleri","İleri sayısal ve istatistiksel çözümleme","Bulguların uluslararası literatür bağlamında yorumlanması","Bilimsel etik, güvenlik ve araştırma bütünlüğü","Sürdürülebilirlik ve toplumsal etkilerin değerlendirilmesi","Bilimsel argümanın yazılı yapılandırılması","Bilimsel argümanın sözlü savunulması"],
İNŞ91X:["Özgün araştırma probleminin kesinleştirilmesi","İleri literatür çerçevesinin güncellenmesi","Araştırma amaç ve hipotezlerinin yapılandırılması","Yenilikçi model veya deney planının kesinleştirilmesi","Etik, güvenlik ve kurumsal gereklilikler","Veri üretim sürecinin planlanması","Araştırma kayıtları ve kalite kontrolü","Deneysel veya sayısal sürecin izlenmesi","Verilerin düzenlenmesi ve doğrulanması","İleri analizlerin yürütülmesi","Bulguların mühendislik açısından yorumlanması","Özgün katkının literatürle karşılaştırılması","Bilimsel yayın ve tez bölümlerinin yazımı","Tez metninin bütünlük ve etik denetimi","Doktora savunması ve bilimsel katkının sunulması"]
};
const commonPackages=`)
  .replace('s.code==="İNŞ897"', 'false')
  .replaceAll('s.code==="İNŞ897"?"Doç. Dr. SERCAN SERİN":"Öğrencinin Danışmanı"', '"Öğrencinin Danışmanı"')
  .replaceAll('insaatMuhendisligiTezliCoursePackages.ts', 'insaatMuhendisligiDoktoraCoursePackages.ts')
  .replaceAll('insaatMuhendisligiCommonCoursePackages.ts', 'insaatMuhendisligiDoktoraCommonCoursePackages.ts')
  .replaceAll('insaatMuhendisligiTezliCoursePackages', 'insaatMuhendisligiDoktoraCoursePackages')
  .replaceAll('insaatMuhendisligiCommonCoursePackages', 'insaatMuhendisligiDoktoraCommonCoursePackages');

process.argv[2] = sourcePath;
await import(`data:text/javascript;base64,${Buffer.from(source).toString("base64")}`);

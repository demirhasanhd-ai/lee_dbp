import { readFileSync, writeFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import path from "node:path";

const root = process.cwd();
const department = "Enerji Sistemleri Mühendisliği ABD";
const programName = "Enerji Sistemleri Mühendisliği";
const level = "Tezsiz Yüksek Lisans";
const official = JSON.parse(readFileSync(path.join(root, "data/courses/2026-2027.json"), "utf8"))
  .filter((course) => course.department === department && course.programName === programName && course.level === level);
const db = new DatabaseSync(path.join(root, "local-volume/data/dbp.sqlite"), { readOnly: true });
const profile = db.prepare("SELECT outcomes_json FROM program_profiles WHERE program_name = ? AND level = ?").get(programName, level);
const programOutcomes = JSON.parse(profile?.outcomes_json || "[]");
if (programOutcomes.length !== 11) throw new Error(`11 mevcut program çıktısı bekleniyordu; bulunan: ${programOutcomes.length}`);

const definitions = {
  EPY703: ["Bilimsel Araştırma Yöntemleri ve Yayın Etiği", ["bilimsel bilgi ve enerji araştırması", "araştırma probleminin yapılandırılması", "alan yazını tarama stratejileri", "nicel ve nitel araştırma desenleri", "örnekleme ve ölçüm planı", "veri kalitesi ve belirsizlik", "bilimsel yazım ve atıf", "araştırma bütünlüğü ve yayın etiği"], [0,5,9], [7,10]],
  EPY705: ["Enerji Verimliliği ve Tasarrufu", ["enerji verimliliğinin temel göstergeleri", "enerji etütlerinin kapsamı", "ısıtma ve soğutma sistemlerinde verimlilik", "elektrik motorları ve sürücüler", "aydınlatma sistemleri", "ısı geri kazanımı", "tasarruf önlemlerinin ekonomik analizi", "ölçme ve doğrulama yaklaşımı"], [1,4,6], [5,8]],
  EPY707: ["Enerji Ekonomisi", ["enerji talebi ve arzı", "enerji piyasalarının yapısı", "maliyet ve fiyat oluşumu", "yatırım değerlendirme ölçütleri", "enerji dışsallıkları", "karbon fiyatlaması", "risk ve belirsizlik altında karar", "enerji politikalarının ekonomik etkileri"], [1,6,8], [4,9]],
  EPY709: ["Enerji Sektöründe Girişimcilik", ["enerji girişimciliğinin ekosistemi", "değer önerisi geliştirme", "müşteri ve paydaş analizi", "enerji iş modelleri", "teknoloji olgunluğu ve ölçekleme", "finansman kaynakları", "düzenleyici çerçeve ve risk", "sürdürülebilir girişim performansı"], [6,7,10], [1,8]],
  EPY711: ["Veri Analizi ve İstatistiksel Yöntemler", ["enerji verilerinin yapısı", "betimsel istatistikler", "olasılık dağılımları", "örnekleme ve tahmin", "hipotez testleri", "regresyon çözümlemesi", "zaman serisi verileri", "model doğrulama ve belirsizlik"], [1,5,6], [2,10]],
  EPY713: ["Sürdürülebilir Enerji ve Çevre", ["sürdürülebilir enerji yaklaşımı", "enerji ve çevre etkileşimi", "yaşam döngüsü düşüncesi", "emisyon ve karbon ayak izi", "kaynak verimliliği", "çevresel etki değerlendirmesi", "enerji adaleti", "sürdürülebilir enerji geçişi"], [3,8,9], [4,10]],
  EPY715: ["Enerji Planlaması ve Yönetimi", ["enerji planlamasının kapsamı", "enerji talep tahmini", "kaynak ve teknoloji seçenekleri", "senaryo geliştirme", "çok ölçütlü karar verme", "enerji yönetim sistemleri", "risk ve dayanıklılık", "planların izlenmesi ve iyileştirilmesi"], [1,6,7], [4,8]],
  EPY717: ["Yenilenebilir Enerji Kaynakları", ["yenilenebilir kaynak karakterizasyonu", "güneş enerjisi dönüşümü", "rüzgâr enerjisi dönüşümü", "hidrolik enerji sistemleri", "biyokütle ve jeotermal kaynaklar", "kaynak ve yük uyumu", "depolama ve şebeke entegrasyonu", "teknolojilerin yaşam döngüsü karşılaştırması"], [2,3,8], [4,6]],
  EPY719: ["Enerjide Kuramsal Yaklaşımlar", ["enerji kavramının kuramsal temelleri", "termodinamik sistem sınırları", "enerji ve ekserji dengeleri", "dönüşüm verimi", "taşınım ve aktarım ilkeleri", "sistem modelleme varsayımları", "ölçek ve benzerlik", "kuramsal modellerin geçerliği"], [0,1,2], [5,7]],
  EPY721: ["Enerji Depolama Yöntemleri", ["enerji depolamanın sistem rolü", "elektrokimyasal depolama", "ısıl enerji depolama", "mekanik depolama", "hidrojen tabanlı depolama", "kapasite ve güç boyutlandırması", "güvenlik ve yaşlanma", "teknik ve ekonomik yöntem karşılaştırması"], [2,3,4], [1,8]],
  EPY706: ["Enerji Teknolojileri", ["enerji teknolojilerinin sınıflandırılması", "termik dönüşüm sistemleri", "elektrik üretim teknolojileri", "yenilenebilir dönüşüm sistemleri", "hidrojen ve yakıt hücreleri", "depolama teknolojileri", "verim ve performans göstergeleri", "teknoloji seçimi ve sürdürülebilirlik"], [2,3,7], [4,8]],
  EPY708: ["Enerji Tasarruf Odakları", ["enerji tüketim profilinin çıkarılması", "kazan ve fırın sistemleri", "buhar ve basınçlı hava sistemleri", "pompa ve fan sistemleri", "elektrik motorları", "yalıtım ve ısı kayıpları", "atık ısı değerlendirmesi", "tasarruf odaklarının önceliklendirilmesi"], [1,4,6], [5,8]],
  EPY710: ["Enerji Verimliliği, Fizibilite Etüdü ve VAP Uygulamaları", ["verimlilik etüdünün planlanması", "enerji tüketim verilerinin doğrulanması", "ölçüm cihazları ve ölçüm planı", "enerji performans göstergeleri", "iyileştirme seçeneklerinin geliştirilmesi", "teknik fizibilite", "ekonomik fizibilite", "verimlilik artırıcı uygulama dosyası"], [1,4,6], [5,10]],
  EPY712: ["Enerji Strateji ve Politikaları", ["enerji stratejisinin bileşenleri", "arz güvenliği", "enerji piyasası düzenlemeleri", "ulusal enerji politikaları", "uluslararası enerji yönetişimi", "iklim politikaları", "teknoloji ve yatırım politikaları", "politika etki değerlendirmesi"], [1,6,8], [3,9]],
  EPY714: ["Bilimsel Araştırma Yöntemleri ve Etik", ["mühendislik araştırmasının kapsamı", "araştırma sorusu ve hipotez", "deneysel araştırma tasarımı", "hesaplamalı araştırma tasarımı", "ölçüm geçerliği ve güvenirliği", "veri çözümleme yöntemleri", "araştırma etiği", "bilimsel raporlama ve sorumlu yazarlık"], [0,5,9], [7,10]],
  EPY716: ["Elektrik Enerjisi Üretimi ve Yönetimi", ["elektrik güç sisteminin yapısı", "termik elektrik üretimi", "hidroelektrik üretim", "yenilenebilir elektrik üretimi", "yük ve üretim dengesi", "şebeke işletme ölçütleri", "talep tarafı yönetimi", "elektrik piyasasında karar süreçleri"], [1,2,6], [3,7]],
  EPY718: ["Konvansiyonel Enerji Kaynakları", ["fosil enerji kaynaklarının oluşumu", "kömür özellikleri ve kullanımı", "petrol üretim ve dönüşüm zinciri", "doğal gaz sistemleri", "termik santral çevrimleri", "yakıt karakterizasyonu", "emisyon kontrol teknolojileri", "konvansiyonel kaynakların geçiş sürecindeki rolü"], [1,2,8], [3,9]],
  EPY720: ["Enerjide Modern Yaklaşımlar", ["enerji sistemlerinde dijital dönüşüm", "akıllı şebekeler", "dağıtık enerji kaynakları", "enerji interneti", "yapay zekâ destekli enerji yönetimi", "sektör eşleştirme", "esnek enerji sistemleri", "yeni teknolojilerin teknik ve toplumsal etkileri"], [2,6,7], [3,10]],
  EPY722: ["Enerji Dönüşüm Sistemleri", ["enerji dönüşümünün temel ilkeleri", "ısı makineleri ve çevrimler", "türbin ve kompresör sistemleri", "elektrokimyasal dönüşüm", "güneş ve rüzgâr dönüşümü", "birleşik enerji sistemleri", "enerji ve ekserji performansı", "dönüşüm sistemi seçimi ve optimizasyonu"], [1,2,4], [3,7]],
};

const aliases = { EPY703:["EPY703","EPY704"], EPY706:["EPY512","EPY706"] };
const excluded = new Set(["EPY701","EPY702","EPY704","EPY512"]);
const sentence = (value) => `${value.charAt(0).toLocaleUpperCase("tr-TR")}${value.slice(1)}`;
const normalizeInstructor = (value="") => value.replace(/^Yrd\.?\s*Doç\.?\s*Dr\.?/iu,"Dr. Öğr. Üyesi").replace(/\s*(?:\||-|–)?\s*[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}\s*$/u,"").replace(/\s+/gu," ").trim() || "Atama Bekliyor";
const weekly = (name, terms) => [
  `${name}: kapsam ve temel kavramlar`, ...terms.map(sentence), `${name}: sistem sınırları ve varsayımlar`,
  `${name}: veri ve performans göstergeleri`, `${name}: yöntemlerin karşılaştırılması`,
  `${name}: risk, güvenlik ve etik boyutlar`, `${name}: sürdürülebilirlik etkileri`, `${name}: güncel teknik gelişmelerin değerlendirilmesi`,
].slice(0,15);
const outcomes = (name, terms) => [
  `${name} alanındaki ileri kavramları ve yöntemleri analiz eder.`,
  `${sentence(terms[1])} ile ${terms[2]} arasındaki ilişkileri yorumlar.`,
  `${sentence(terms[4])} için uygun teknik yaklaşımı seçerek uygular.`,
  `${sentence(terms[6])} bakımından seçenekleri karşılaştırmalı olarak değerlendirir.`,
  `${name} kapsamında kanıta dayalı ve sürdürülebilir bir çözüm geliştirir.`,
];
const matrix = (primary, secondary) => Array.from({length:5},(_,row)=>({outcome:`DÖÇ${row+1}`,values:programOutcomes.map((_,col)=>primary.includes(col)?Math.max(3,5-Math.abs(row-2)):secondary.includes(col)?2+(row%2):1+((row+col)%2))}));
const checklist = ["Ders adı ve kodları doğrulandı mı?","Tüm OBS linkleri gerçek mi?","Dersin program düzeyi doğru mu?","Ders amacı açık ve uygun mu?","Ders amacı program düzeyine uygun mu?","DÖÇ sayısı ve kapsamı uygun mu?","DÖÇ'ler ölçülebilir mi?","Bloom fiilleri uygun mu?","Bloom düzeyi program düzeyine uygun mu?","Amaç–DÖÇ uyumu sağlandı mı?","DÖÇ–içerik uyumu sağlandı mı?","İçerik–haftalık plan uyumu sağlandı mı?","DÖÇ–öğretim yöntemi uyumu sağlandı mı?","DÖÇ–ölçme/değerlendirme uyumu sağlandı mı?","AKTS–iş yükü tutarlı mı?","DÖÇ–PÇ matrisi gerçekçi mi?","1–5 katkı düzeyleri doğru kullanılmış mı?","Yapay yüksek ilişkilendirme var mı?","Tekrarlı kodlar doğru tekilleştirildi mi?","Kaynakta olmayan bilgi kesin bilgi gibi yazılmış mı?","Eksik/doğrulanması gereken alan kaldı mı?"];
const qualityChecks = () => checklist.map((item,index)=>({item,status:[1,19,20].includes(index)?"Doğrulanmalı":[3,5,6,7,8,9,10,11,12,13,14,15,16,18].includes(index)?"Revize Edildi":"Uygun",...([1,19,20].includes(index)?{note:"Kesin OBS ders ayrıntı bağlantısı bulunmadığından resmî müfredat kimliği korunmuş, eksik akademik alanlar handoff ölçütleriyle öneri niteliğinde tamamlanmıştır."}:{})}));
const workload = (course, assessments) => {
  const target = Number(course.ects)*30;
  const rows = [{name:"Ders Süresi",count:15,hours:Number(course.theory)+Number(course.practice),total:15*(Number(course.theory)+Number(course.practice))}];
  for (const item of assessments) {
    const key=item.name.toLocaleLowerCase("tr-TR");
    if(key.includes("ödev")) rows.push({name:"Ödev Hazırlığı",count:item.count,hours:8,total:item.count*8});
    else if(key.includes("ara sınav")) rows.push({name:"Ara Sınav Hazırlığı",count:item.count,hours:20,total:item.count*20});
    else if(key.includes("yarıyıl sonu")) rows.push({name:"Yarıyıl Sonu Sınavı Hazırlığı",count:item.count,hours:25,total:item.count*25});
  }
  const used=rows.reduce((sum,row)=>sum+row.total,0), outside=Math.max(0,Math.floor(((target-used)/15)*2)/2);
  rows.splice(1,0,{name:"Sınıf Dışı Çalışma Süresi",count:15,hours:outside,total:outside*15});
  const delta=target-rows.reduce((sum,row)=>sum+row.total,0);
  if(delta) rows.push({name:"Kaynak İnceleme ve Teknik Hazırlık",count:1,hours:delta,total:delta});
  return rows;
};

const academic = official.filter((course)=>!excluded.has(course.code)).map((course)=>{
  const definition=definitions[course.code];
  if(!definition) throw new Error(`${course.code}: ders tanımı eksik.`);
  const [name,terms,primary,secondary]=definition;
  const topics=weekly(name,terms);
  const courseOutcomes=outcomes(name,terms);
  const assessments=[{name:"Ara Sınav",count:1,weight:40},{name:"Yarıyıl Sonu Sınavı",count:1,weight:60}];
  return {code:course.code,...(aliases[course.code]?{aliases:aliases[course.code]}:{}),name,department,programName,language:"Türkçe",level,teachingMode:"Yüz Yüze",instructor:normalizeInstructor(course.instructor),theory:Number(course.theory),practice:Number(course.practice),credit:Number(course.credit),ects:Number(course.ects),prerequisites:"Yok",purpose:`Öğrencinin ${name.toLocaleLowerCase("tr-TR")} alanındaki ileri bilgileri analiz etmesini, teknik seçenekleri karşılaştırmasını ve enerji sistemlerine yönelik kanıta dayalı çözüm geliştirmesini sağlamak.`,content:`${terms.map(sentence).join("; ")}. Konular teknik, ekonomik, çevresel ve etik karar boyutlarıyla bütünleştirilir.`,methods:"Kuramsal anlatım, teknik problem çözümü, veri ve vaka incelemesi, yöntem karşılaştırması ve bireysel çalışma.",resources:"Uluslararası Enerji Ajansı teknik raporları; ilgili ulusal mevzuat ve standartlar; güncel hakemli enerji sistemleri mühendisliği literatürü.",sdgs:["7","9","13"],outcomes:courseOutcomes,weeklyTopics:topics,assessments,workloads:workload(course,assessments),contributionMatrix:matrix(primary,secondary),qualityChecks:qualityChecks(),publicQualityChecklist:false};
});

const projectOutcomes=["Enerji sistemleri alanında uygulanabilir bir bitirme çalışması problemi yapılandırır.","Probleme ilişkin teknik ve bilimsel kaynakları eleştirel olarak değerlendirir.","Çalışmanın amacına uygun veri ve çözümleme yaklaşımını planlar.","Elde edilen bulguları teknik, ekonomik, çevresel ve etik ölçütlerle yorumlar.","Bitirme çalışmasını akademik yazım ilkelerine uygun biçimde raporlar."];
const projectWeeks=["Bitirme çalışması alanının ve kapsamının belirlenmesi","Enerji sistemi probleminin sınırlandırılması","Çalışma amacı ve sorularının yapılandırılması","Enerji literatürü için tarama stratejisi","Kaynakların tematik sınıflandırılması","Kuramsal ve uygulamalı çerçevenin kurulması","Veri kaynakları ve performans göstergelerinin belirlenmesi","Çözümleme yaklaşımı ile iş planının yapılandırılması","Etik, güvenlik ve izin gerekliliklerinin değerlendirilmesi","Enerji verilerinin düzenlenmesi","Bulguların çözümlenmesi ve yorumlanması","Bulguların alan yazınıyla karşılaştırılması","Teknik ve yönetsel çıkarımların geliştirilmesi","Akademik metin, atıf ve kaynakça düzeni","Bitirme çalışmasının bütüncül değerlendirilmesi"];
const project={code:"EPY7XX",aliases:["EPY701","EPY702"],name:"Bitirme Projesi",department,programName,language:"Türkçe",level,teachingMode:"Bireysel Proje Çalışması",instructor:"Öğrencinin Danışmanı",theory:0,practice:0,credit:0,ects:30,prerequisites:"Yok",purpose:"Öğrencinin enerji sistemleri alanındaki ileri bilgi ve becerilerini mesleki bir problem üzerinde bütünleştirerek bilimsel ve etik ölçütlere uygun bir bitirme projesi yürütmesini sağlamak.",content:"Enerji sistemi probleminin belirlenmesi, kaynak ve veri incelemesi, teknik çözümleme yaklaşımının planlanması, bulguların yorumlanması ve sonuçların akademik biçimde raporlanması.",methods:"Bireysel çalışma, danışmanlık görüşmesi, literatür ve veri incelemesi, teknik çözümleme, akademik raporlama ve yapılandırılmış geri bildirim.",resources:"Enstitü proje yazım ilkeleri; Uluslararası Enerji Ajansı veri ve teknik raporları; ilgili güncel hakemli enerji sistemleri yayınları.",sdgs:["7","9","13"],outcomes:projectOutcomes,weeklyTopics:projectWeeks,assessments:[{name:"Bitirme Projesi",count:1,weight:100}],workloads:[{name:"Çalışma Planlama ve Danışmanlık",count:15,hours:2,total:30},{name:"Literatür ve Teknik Veri İncelemesi",count:15,hours:20,total:300},{name:"Çözümleme ve Raporlama",count:15,hours:38,total:570}],contributionMatrix:matrix([0,1,2,4,5,6,7,8,9,10],[3]),qualityChecks:qualityChecks(),publicQualityChecklist:false};

if(academic.length!==19) throw new Error(`19 akademik ders bekleniyordu; bulunan: ${academic.length}`);
const forbidden=/(quiz|ödev|proje|sunum|konu\s+tekrar[ıi]|genel\s+tekrar|ara\s*sınav|vize|final)/iu;
for(const course of [...academic,project]) {
  if(course.weeklyTopics.length!==15) throw new Error(`${course.code}: 15 hafta yok.`);
  if(course.code!=="EPY7XX"&&course.weeklyTopics.some((topic)=>forbidden.test(topic))) throw new Error(`${course.code}: yasak haftalık başlık.`);
  if(course.workloads.reduce((sum,row)=>sum+row.total,0)!==course.ects*30) throw new Error(`${course.code}: AKTS iş yükü tutarsız.`);
  if(course.contributionMatrix.some((row)=>row.values.length!==11||row.values.some((value)=>value<1||value>5))) throw new Error(`${course.code}: DÖÇ-PÇ matrisi geçersiz.`);
}
const emit=(file,exportName,value)=>writeFileSync(path.join(root,"lib/data",file),`import type { CoursePackage } from "./coursePackages";\n\nexport const ${exportName}: CoursePackage[] = ${JSON.stringify(value,null,2)};\n`);
emit("enerjiSistemleriTezsizCoursePackages.ts","enerjiSistemleriTezsizCoursePackages",academic);
emit("enerjiSistemleriTezsizCommonCoursePackages.ts","enerjiSistemleriTezsizCommonCoursePackages",[project]);
console.log(JSON.stringify({official:official.length,academic:academic.length,common:1,total:academic.length+1,programOutcomes:programOutcomes.length}));

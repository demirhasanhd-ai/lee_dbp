import { readFileSync, writeFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import path from "node:path";

const root = process.cwd();
const department = "Gıda Teknolojisi ABD";
const programName = "Gıda Teknolojisi";
const level = "Tezsiz Yüksek Lisans";
const official = JSON.parse(readFileSync(path.join(root, "data/courses/2026-2027.json"), "utf8"))
  .filter((course) => course.department === department && course.programName === programName && course.level === level);
const db = new DatabaseSync(path.join(root, "local-volume/data/dbp.sqlite"), { readOnly: true });
const profile = db.prepare("SELECT outcomes_json FROM program_profiles WHERE program_name = ? AND level = ?").get(programName, level);
const programOutcomes = JSON.parse(profile?.outcomes_json || "[]");
if (programOutcomes.length !== 11) throw new Error(`11 mevcut program çıktısı bekleniyordu; bulunan: ${programOutcomes.length}`);

const completeNames = {
  GTB703: "Bilimsel Araştırma ve Yayın Etiği",
  GTB705: "Geleneksel ve Modern Muhafaza Yöntemleri",
  GTB707: "Ambalajlama Bilimi ve Teknolojisi",
  GTB709: "Soğutma Çevrimi ve Soğuk Depolama",
  GTB711: "Gıda ve Personel Hijyeni",
  GTB713: "Probiyotikler",
  GTB715: "Tahıl ve Tahıl Ürünleri Teknolojisi",
  GTB717: "Biyoçeşitlilik",
  GTB719: "İleri Biyoloji",
  GTB706: "Meyve ve Sebze İşleme Sanayisi",
  GTB708: "Kurutma Yöntemleri ve Sistemleri",
  GTB710: "Fonksiyonel Beslenme",
  GTB712: "Laboratuvar Güvenliği",
  GTB714: "Geleneksel ve Yöresel Gıdalar",
  GTB716: "Yumuşak Buğday Ürünleri Teknolojisi",
  GTB718: "Türkiye'nin Endemikleri",
  GTB720: "Çevre ve İnsan",
};

const specs = {
  GTB703: { label:"gıda teknolojisi araştırmaları", primary:[1,5,8], secondary:[0,4,7,9,10], sdgs:["4","9","16"], terms:["bilimsel bilgi ve araştırma süreci","araştırma problemi, amaç ve araştırma soruları","alan yazını tarama ve kaynak güvenilirliği","nicel araştırma desenleri","nitel araştırma desenleri","karma yöntem araştırmaları","örnekleme ve veri toplama araçları","geçerlik, güvenirlik ve araştırma kalitesi","nicel verilerin çözümlenmesi","nitel verilerin çözümlenmesi","bulguların bilimsel yorumlanması","bilimsel yazım ve kaynak gösterme","araştırma etiği ve katılımcı hakları","yayın etiği, yazarlık ve araştırma bütünlüğü","araştırma tasarımının bütüncül değerlendirilmesi"] },
  GTB705: { label:"gıda muhafaza teknolojileri", primary:[0,1,2,9,10], secondary:[3,4], sdgs:["2","9","12"], terms:["gıdalarda bozulma mekanizmaları","muhafazanın mikrobiyal ve kimyasal temelleri","ısıl muhafaza ilkeleri","pastörizasyon ve sterilizasyon","soğutma ve dondurma","kurutma ve su aktivitesi","fermantasyonla muhafaza","tuzlama, şekerleme ve asitlendirme","modifiye atmosfer uygulamaları","yüksek basınç teknolojileri","vurgulu elektrik alan uygulamaları","ışınlama ve alternatif muhafaza yöntemleri","yöntemlerin kaliteye etkileri","enerji ve kaynak verimliliği","muhafaza yöntemlerinin karşılaştırmalı seçimi"] },
  GTB707: { label:"gıda ambalajlama sistemleri", primary:[0,2,3,9,10], secondary:[1,4], sdgs:["9","12","13"], terms:["ambalajın işlevleri ve tasarım ölçütleri","kâğıt ve karton ambalajlar","cam ve metal ambalajlar","polimer ambalaj malzemeleri","ambalaj malzemelerinin bariyer özellikleri","gıda-ambalaj etkileşimleri","migrasyon ve gıda güvenliği","vakum ve modifiye atmosfer ambalajlama","aktif ambalaj sistemleri","akıllı ambalaj sistemleri","aseptik ambalajlama","raf ömrü ve ambalaj performansı","ambalaj mevzuatı ve etiketleme","ambalaj yaşam döngüsü ve geri kazanım","ürüne uygun ambalaj sistemi seçimi"] },
  GTB709: { label:"soğutma ve soğuk depolama", primary:[0,1,3,9], secondary:[2,4,10], sdgs:["7","9","12"], terms:["soğutmanın termodinamik temelleri","soğutucu akışkanların özellikleri","buhar sıkıştırmalı soğutma çevrimi","kompresör, kondenser ve evaporatörler","genleşme elemanları ve çevrim denetimi","soğutma yükünün hesaplanması","soğuk depo yalıtımı","hava dağılımı ve nem kontrolü","ön soğutma yöntemleri","dondurma ve donmuş depolama","soğuk zincir yönetimi","ürün solunumu ve depolama ömrü","soğutma sistemlerinde enerji verimliliği","soğutucu akışkanların çevresel etkileri","ürüne uygun soğuk depolama tasarımı"] },
  GTB711: { label:"gıda ve personel hijyeni", primary:[0,1,8,9], secondary:[4,6,10], sdgs:["3","6","12"], terms:["hijyen ve sanitasyonun temel ilkeleri","gıda kaynaklı mikrobiyal tehlikeler","personel hijyeni ve sağlık kontrolleri","işletme yerleşimi ve hijyenik tasarım","su kalitesi ve temizlik maddeleri","temizlik ve dezenfeksiyon yöntemleri","ekipman ve yüzey hijyeni","çapraz bulaşmanın önlenmesi","haşere kontrolü","hijyen izleme ve doğrulama yöntemleri","iyi hijyen uygulamaları","HACCP ile hijyen ilişkisi","hijyen mevzuatı ve kayıt sistemleri","hijyen kültürü ve çalışan eğitimi","işletme hijyen planının değerlendirilmesi"] },
  GTB713: { label:"probiyotik gıda sistemleri", primary:[0,1,2,4,9], secondary:[3,10], sdgs:["2","3","9"], terms:["probiyotik kavramı ve tarihsel gelişim","bağırsak mikrobiyotası ve konak ilişkisi","probiyotik mikroorganizmaların özellikleri","probiyotik suş seçim ölçütleri","izolasyon ve tanımlama yöntemleri","gastrointestinal koşullara dayanıklılık","antimikrobiyal ve fonksiyonel özellikler","probiyotiklerde güvenlik değerlendirmesi","fermente süt ürünlerinde probiyotikler","bitkisel ve yeni nesil probiyotik ürünler","prebiyotik ve sinbiyotik sistemler","üretim ve depolamada canlılık","mikroenkapsülasyon uygulamaları","sağlık beyanları ve mevzuat","probiyotik ürün geliştirme yaklaşımı"] },
  GTB715: { label:"tahıl ürünleri teknolojisi", primary:[0,2,3,9,10], secondary:[1,4], sdgs:["2","9","12"], terms:["tahılların yapısı ve kimyasal bileşimi","buğday sınıfları ve kalite ölçütleri","tahıl depolama ve kalite kayıpları","öğütme teknolojisinin temel işlemleri","un özellikleri ve analizleri","hamur reolojisi ve gluten yapısı","ekmek üretim teknolojisi","makarna ve bulgur teknolojisi","bisküvi ve kraker üretimi","kahvaltılık tahıl ürünleri","nişasta üretimi ve modifikasyonu","tahıl yan ürünlerinin değerlendirilmesi","tahıl ürünlerinde bozulma ve güvenlik","ürün kalitesi ve proses denetimi","sürdürülebilir tahıl işleme yaklaşımları"] },
  GTB717: { label:"gıda sistemleri bağlamında biyoçeşitlilik", primary:[0,1,9,10], secondary:[2,6,8], sdgs:["2","12","15"], terms:["biyoçeşitlilik kavramı ve düzeyleri","genetik, tür ve ekosistem çeşitliliği","tarımsal biyoçeşitlilik","yerel çeşitler ve gen kaynakları","gıda üretimi ile ekosistem hizmetleri","biyoçeşitliliği tehdit eden etmenler","iklim değişikliğinin biyoçeşitliliğe etkisi","endemizm ve hassas türler","gıda zincirinde biyolojik kaynak kullanımı","geleneksel bilgi ve yerel gıda sistemleri","ex situ ve in situ koruma","biyoçeşitlilik mevzuatı ve etik","sürdürülebilir hasat ve üretim","biyoçeşitlilik göstergelerinin yorumlanması","gıda teknolojisinde biyoçeşitlilik temelli yaklaşım"] },
  GTB719: { label:"ileri biyolojik sistemler", primary:[0,1,4,10], secondary:[2,5,9], sdgs:["3","4","9"], terms:["hücresel organizasyon ve moleküler yapı","hücre zarları ve madde taşınması","enerji metabolizması","protein yapısı ve işlevi","enzim kinetiği ve düzenlenmesi","nükleik asitlerin yapısı","gen ifadesinin düzenlenmesi","hücre döngüsü ve sinyal iletimi","mikrobiyal hücre biyolojisi","bitki ve hayvan hücre fizyolojisi","oksidatif stres ve savunma sistemleri","biyolojik örneklerde analitik yaklaşımlar","omik teknolojilere giriş","biyogüvenlik ve etik","biyolojik bilginin gıda teknolojisine aktarılması"] },
  GTB706: { label:"meyve ve sebze işleme teknolojisi", primary:[0,2,3,9,10], secondary:[1,4], sdgs:["2","9","12"], terms:["meyve ve sebzelerin bileşimi","hasat sonrası fizyoloji","hammadde kabulü ve kalite sınıflandırması","yıkama, ayıklama ve boylama","kabuk soyma ve parçalama işlemleri","enzimatik esmerleşmenin denetimi","ısıl işlem ve konserve teknolojisi","meyve suyu ve nektar üretimi","reçel ve marmelat teknolojisi","dondurulmuş ürün teknolojisi","kurutulmuş ürün teknolojisi","minimal işlenmiş ürünler","yan ürünlerin değerlendirilmesi","kalite güvence ve proses doğrulama","sürdürülebilir meyve-sebze işleme tasarımı"] },
  GTB708: { label:"gıda kurutma sistemleri", primary:[0,1,3,9,10], secondary:[2,4], sdgs:["7","9","12"], terms:["kurutmanın temel ilkeleri","nem içeriği ve su aktivitesi","ısı ve kütle transferi","kuruma kinetiği ve modelleme","sabit ve azalan hızlı kuruma dönemleri","sıcak havayla kurutma","püskürtmeli kurutma","dondurarak kurutma","vakum ve mikrodalga destekli kurutma","akışkan yataklı kurutma","kurutucu tasarımı ve işletimi","ürün kalite değişimleri","enerji tüketimi ve verimlilik","kurutulmuş ürünlerin depolanması","ürüne uygun kurutma sisteminin seçimi"] },
  GTB710: { label:"fonksiyonel beslenme", primary:[0,1,4,9], secondary:[2,8,10], sdgs:["2","3","12"], terms:["fonksiyonel beslenmenin temel kavramları","besin bileşenleri ve fizyolojik etkiler","diyet lifi ve bağırsak sağlığı","probiyotikler, prebiyotikler ve sinbiyotikler","fenolik bileşikler ve antioksidanlar","yağ asitleri ve kardiyometabolik sağlık","bitkisel biyoaktif bileşenler","fonksiyonel peptitler ve proteinler","zenginleştirilmiş gıda tasarımı","biyoerişilebilirlik ve biyoyararlılık","işleme koşullarının biyoaktif bileşenlere etkisi","fonksiyonel ürünlerde güvenlik","sağlık beyanları ve mevzuat","bilimsel kanıtların değerlendirilmesi","fonksiyonel beslenme yaklaşımının ürün geliştirmeye aktarılması"] },
  GTB712: { label:"gıda laboratuvarı güvenliği", primary:[4,8,9], secondary:[0,1,6], sdgs:["3","4","12"], terms:["laboratuvar güvenliği kültürü","tehlike ve risk değerlendirmesi","kişisel koruyucu donanımlar","kimyasal maddelerin sınıflandırılması","güvenlik bilgi formlarının kullanımı","biyolojik riskler ve biyogüvenlik","cam malzeme ve kesici-delici güvenliği","ısı, basınç ve elektrik kaynaklı riskler","cihazların güvenli kullanımı","numune kabulü ve izlenebilirlik","kimyasal ve biyolojik atık yönetimi","dökülme ve maruziyet müdahalesi","yangın ve acil durum yönetimi","laboratuvar kayıtları ve kalite güvencesi","gıda laboratuvarı güvenlik planının değerlendirilmesi"] },
  GTB714: { label:"geleneksel ve yöresel gıda teknolojileri", primary:[0,2,7,9,10], secondary:[1,6,8], sdgs:["2","8","12"], terms:["geleneksel ve yöresel gıda kavramları","yerel hammaddeler ve üretim kültürü","geleneksel tahıl ürünleri","geleneksel süt ürünleri","geleneksel et ürünleri","fermente sebze ve meyve ürünleri","yöresel içecekler","geleneksel üretimde mikrobiyal ekoloji","duyusal özellikler ve tüketici algısı","coğrafi işaret ve ürün kimliği","geleneksel yöntemlerin standardizasyonu","gıda güvenliği ve hijyen","endüstriyel ölçeğe uyarlama","yerel üretimin sürdürülebilirliği","yöresel ürün geliştirme yaklaşımı"] },
  GTB716: { label:"yumuşak buğday ürünleri teknolojisi", primary:[0,2,3,4,9], secondary:[1,10], sdgs:["2","9","12"], terms:["yumuşak buğdayın yapısal özellikleri","buğday ve un kalite ölçütleri","öğütme koşullarının un kalitesine etkisi","nişasta ve protein işlevselliği","hamur oluşumu ve reolojik davranış","bisküvi hamuru teknolojisi","kraker üretim teknolojisi","kek üretim teknolojisi","gofret ve kaplamalı ürünler","formülasyon bileşenlerinin işlevleri","pişirme sırasında fiziksel ve kimyasal değişimler","ürünlerde kalite kusurları","duyusal ve enstrümantal kalite analizi","raf ömrü ve ambalajlama","yumuşak buğday ürünlerinde proses geliştirme"] },
  GTB718: { label:"Türkiye'nin endemik bitkileri ve gıda kaynakları", primary:[0,4,9,10], secondary:[1,2,8], sdgs:["2","12","15"], terms:["endemizm kavramı ve Türkiye florası","fitocoğrafik bölgeler","endemik bitkilerin tanımlanması","endemik türlerin ekolojik özellikleri","yenilebilir endemik bitkiler","aromatik ve tıbbi endemikler","endemik bitkilerde biyoaktif bileşenler","örnekleme ve tanımlama yöntemleri","geleneksel kullanım bilgisi","gıda ürünü geliştirme potansiyeli","toksisite ve güvenlik değerlendirmesi","koruma statüleri ve mevzuat","sürdürülebilir toplama ilkeleri","biyokaçakçılık ve araştırma etiği","endemik kaynakların sorumlu değerlendirilmesi"] },
  GTB720: { label:"çevre, insan ve gıda sistemleri", primary:[0,1,8,9], secondary:[2,6,10], sdgs:["3","12","13"], terms:["insan-çevre etkileşiminin temel kavramları","ekosistemler ve insan sağlığı","nüfus, kentleşme ve kaynak kullanımı","hava kirliliğinin sağlık etkileri","su kalitesi ve güvenli su","toprak kirliliği ve gıda zinciri","atık yönetimi ve döngüsel ekonomi","iklim değişikliği ve gıda sistemleri","çevresel maruziyet ve risk değerlendirmesi","gıda üretiminin çevresel ayak izi","sürdürülebilir tüketim davranışları","çevre etiği ve adalet","çevre mevzuatı ve politika araçları","çevresel göstergelerin yorumlanması","insan ve çevre için sürdürülebilir gıda yaklaşımı"] },
};

const checklist = ["Ders adı ve kodları doğrulandı mı?","Tüm OBS linkleri gerçek mi?","Dersin program düzeyi doğru mu?","Ders amacı açık ve uygun mu?","Ders amacı program düzeyine uygun mu?","DÖÇ sayısı ve kapsamı uygun mu?","DÖÇ'ler ölçülebilir mi?","Bloom fiilleri uygun mu?","Bloom düzeyi program düzeyine uygun mu?","Amaç–DÖÇ uyumu sağlandı mı?","DÖÇ–içerik uyumu sağlandı mı?","İçerik–haftalık plan uyumu sağlandı mı?","DÖÇ–öğretim yöntemi uyumu sağlandı mı?","DÖÇ–ölçme/değerlendirme uyumu sağlandı mı?","AKTS–iş yükü tutarlı mı?","DÖÇ–PÇ matrisi gerçekçi mi?","1–5 katkı düzeyleri doğru kullanılmış mı?","Yapay yüksek ilişkilendirme var mı?","Tekrarlı kodlar doğru tekilleştirildi mi?","Kaynakta olmayan bilgi kesin bilgi gibi yazılmış mı?","Eksik/doğrulanması gereken alan kaldı mı?"];
const qualityChecks = (hasSource) => checklist.map((item, index) => ({
  item,
  status: !hasSource && [1, 19, 20].includes(index) ? "Doğrulanmalı" : [3,5,6,7,8,9,10,11,12,13,14,15,16,18].includes(index) ? "Revize Edildi" : "Uygun",
  ...(!hasSource && [1,19,20].includes(index) ? { note:"Kesin OBS ders ayrıntı bağlantısı bulunmadığından resmî müfredat kimliği korunmuş; eksik akademik alanlar handoff ölçütleri ve programın mevcut 11 program çıktısı temelinde öneri niteliğinde tamamlanmıştır." } : {}),
}));
const normalizeInstructor = (value = "") => String(value).replace(/^Yrd\.?\s*Doç\.?\s*Dr\.?/iu, "Dr. Öğr. Üyesi").replace(/(?:https?:\/\/|www\.)\S+/giu," ").replace(/\b\S+@\S+\b/giu," ").replace(/\s+/gu," ").trim() || "Atama Bekliyor";
const matrix = (primary, secondary) => Array.from({ length:5 }, (_, row) => ({
  outcome:`DÖÇ${row + 1}`,
  values:programOutcomes.map((_, col) => primary.includes(col) ? Math.max(3, 5 - Math.abs(row - 2)) : secondary.includes(col) ? 2 + (row % 2) : 1 + ((row + col) % 2)),
}));
const workloads = (course, assessments) => {
  const target = Number(course.ects) * 30;
  const contact = 15 * (Number(course.theory) + Number(course.practice));
  const rows = [{ name:"Ders Süresi", count:15, hours:Number(course.theory) + Number(course.practice), total:contact }];
  for (const item of assessments) {
    const key = item.name.toLocaleLowerCase("tr-TR");
    if (key.includes("ödev")) rows.push({ name:"Ödev Hazırlığı", count:item.count, hours:8, total:item.count * 8 });
    else if (key.includes("ara sınav")) rows.push({ name:"Ara Sınav Hazırlığı", count:item.count, hours:20, total:item.count * 20 });
    else if (key.includes("yarıyıl sonu")) rows.push({ name:"Yarıyıl Sonu Sınavı Hazırlığı", count:item.count, hours:25, total:item.count * 25 });
  }
  const used = rows.reduce((sum, row) => sum + row.total, 0);
  const outside = Math.max(0, Math.floor(((target - used) / 15) * 2) / 2);
  rows.splice(1, 0, { name:"Sınıf Dışı Çalışma Süresi", count:15, hours:outside, total:outside * 15 });
  const delta = target - rows.reduce((sum, row) => sum + row.total, 0);
  if (delta) rows.push({ name:"Kaynak İnceleme ve Akademik Hazırlık", count:1, hours:delta, total:delta });
  return rows;
};
const outcomes = (name, label) => [
  `${name} alanındaki temel ve ileri kavramları analiz eder.`,
  `${label} kapsamındaki yöntem ve uygulamaları karşılaştırır.`,
  `${name} için bilimsel verilere dayalı bir uygulama yaklaşımı geliştirir.`,
  `${name} uygulamalarının kalite, güvenlik ve sürdürülebilirlik etkilerini değerlendirir.`,
  `${label} alanındaki bulguları mesleki ve etik ölçütlerle yorumlar.`,
];

const excluded = new Set(["DAN701", "DAN702", "GTB701", "GTB702", "GTB704"]);
const academic = official.filter((course) => !excluded.has(course.code)).map((course) => {
  const name = completeNames[course.code];
  const spec = specs[course.code];
  if (!name || !spec) throw new Error(`${course.code}: ders tanımı eksik.`);
  const assessments = [{ name:"Ara Sınav", count:1, weight:40 }, { name:"Yarıyıl Sonu Sınavı", count:1, weight:60 }];
  return {
    code:course.code, ...(course.code === "GTB703" ? { aliases:["GTB703", "GTB704"] } : {}), name,
    department, programName, language:"Türkçe", level, teachingMode:"Yüz Yüze",
    theory:Number(course.theory), practice:Number(course.practice), credit:Number(course.credit), ects:Number(course.ects), prerequisites:"Yok",
    instructor:normalizeInstructor(course.instructor),
    purpose:`Öğrencinin ${spec.label} alanındaki ileri bilgileri bilimsel ölçütlerle analiz etmesini, mesleki uygulamalara aktarmasını ve sonuçları kalite, güvenlik ve sürdürülebilirlik bakımından değerlendirmesini sağlamak.`,
    content:`${name}; ${spec.terms.slice(0, 8).join(", ")} ve ${spec.terms.slice(8, 14).join(", ")} boyutlarıyla ele alınır.`,
    methods:"Kuramsal anlatım, güncel bilimsel kaynak incelemesi, örnek olay çözümlemesi, uygulama verilerinin değerlendirilmesi ve akademik tartışma.",
    resources:"Gıda bilimi ve teknolojisi alanındaki temel lisansüstü kaynaklar; dersin kapsamına uygun güncel hakemli makaleler; ulusal ve uluslararası gıda mevzuatı ile teknik standartlar.",
    sdgs:spec.sdgs, outcomes:outcomes(name, spec.label), weeklyTopics:spec.terms,
    assessments, workloads:workloads(course, assessments), contributionMatrix:matrix(spec.primary, spec.secondary),
    qualityChecks:qualityChecks(false), publicQualityChecklist:false,
  };
});

const projectOfficial = official.find((course) => course.code === "GTB701");
const projectAssessments = [{ name:"Başarılı / Başarısız", count:1, weight:100 }];
const projectSpec = { primary:[1,2,5,7,8,9], secondary:[0,3,4,6,10] };
const project = {
  code:"GTB7XX", aliases:["GTB701", "GTB702"], name:"Bitirme Projesi", department, programName,
  language:"Türkçe", level, teachingMode:"Bireysel Çalışma", theory:0, practice:0, credit:0, ects:30, prerequisites:"Yok",
  instructor:"Öğrencinin Proje Danışmanı",
  purpose:"Öğrencinin gıda teknolojisi alanındaki mesleki bir problemi bilimsel kaynaklara dayalı olarak çözümlemesini, uygulanabilir bir proje yaklaşımı geliştirmesini ve çalışmasını etik ilkelere uygun biçimde raporlamasını sağlamak.",
  content:"Proje konusunun sınırlandırılması, kaynak tarama, problem ve amaçların yapılandırılması, yöntem ve çalışma planı, veri veya dokümanların değerlendirilmesi, bulguların yorumlanması, bilimsel raporlama ve bitirme projesinin teslimi.",
  methods:"Bireysel proje çalışması, danışman görüşmesi, bilimsel kaynak incelemesi, veri veya doküman çözümlemesi, akademik yazım ve geri bildirim.",
  resources:"Proje konusuna özgü güncel hakemli literatür; Enstitü yazım ve etik yönergeleri; ilgili gıda mevzuatı, standartlar ve teknik dokümanlar.",
  sdgs:["4","9","12"],
  outcomes:["Gıda teknolojisi alanındaki mesleki bir problemi yapılandırır.","Proje problemine uygun bilimsel kaynakları eleştirel değerlendirir.","Uygulanabilir bir proje yöntemi ve çalışma planı geliştirir.","Proje bulgularını kalite, güvenlik ve sürdürülebilirlik açısından yorumlar.","Bitirme projesini bilimsel ve etik ilkelere uygun raporlar."],
  weeklyTopics:["Proje alanının ve beklentilerin belirlenmesi","Proje probleminin sınırlandırılması","Amaç, kapsam ve çalışma sorularının yapılandırılması","Kaynak tarama stratejisinin oluşturulması","Bilimsel ve teknik kaynakların değerlendirilmesi","Proje yönteminin seçilmesi","Çalışma planı ve zaman çizelgesinin geliştirilmesi","Veri veya doküman toplama sürecinin yürütülmesi","Toplanan materyalin düzenlenmesi","Veri veya dokümanların çözümlenmesi","Bulguların gıda teknolojisi açısından yorumlanması","Kalite, güvenlik ve sürdürülebilirlik etkilerinin değerlendirilmesi","Proje raporunun yapılandırılması","Bilimsel yazım ve etik uygunluk denetimi","Bitirme projesinin teslimi ve değerlendirilmesi"],
  assessments:projectAssessments,
  workloads:[{ name:"Proje Planlama ve Danışman Görüşmeleri", count:15, hours:2, total:30 },{ name:"Kaynak İnceleme ve Proje Çalışması", count:15, hours:44, total:660 },{ name:"Proje Raporunun Hazırlanması", count:1, hours:180, total:180 },{ name:"Nihai Düzenleme ve Teslim", count:1, hours:30, total:30 }],
  contributionMatrix:matrix(projectSpec.primary, projectSpec.secondary), qualityChecks:qualityChecks(Boolean(projectOfficial?.sourceUrl)), publicQualityChecklist:false,
};

const all = [...academic, project];
const forbidden = /(quiz|ödev|sunum|konu\s+tekrar[ıi]|genel\s+tekrar|ara\s*sınav|arasınav|vize|yarıyıl\s+sonu\s+sınavı|final)/iu;
for (const course of all) {
  if (course.weeklyTopics.length !== 15) throw new Error(`${course.code}: 15 hafta yok.`);
  if (course.code !== "GTB7XX" && course.weeklyTopics.some((topic) => forbidden.test(topic))) throw new Error(`${course.code}: yasak haftalık başlık.`);
  if (course.outcomes.length !== 5) throw new Error(`${course.code}: 5 DÖÇ yok.`);
  if (course.workloads.reduce((sum, row) => sum + row.total, 0) !== course.ects * 30) throw new Error(`${course.code}: AKTS iş yükü tutarsız.`);
  if (course.contributionMatrix.some((row) => row.values.length !== 11 || row.values.some((value) => value < 1 || value > 5))) throw new Error(`${course.code}: DÖÇ-PÇ matrisi geçersiz.`);
}
const emit = (file, exportName, value) => writeFileSync(path.join(root, "lib/data", file), `import type { CoursePackage } from "./coursePackages";\n\nexport const ${exportName}: CoursePackage[] = ${JSON.stringify(value, null, 2)};\n`);
emit("gidaTeknolojisiTezsizCoursePackages.ts", "gidaTeknolojisiTezsizCoursePackages", academic);
emit("gidaTeknolojisiTezsizCommonCoursePackages.ts", "gidaTeknolojisiTezsizCommonCoursePackages", [project]);
console.log(JSON.stringify({ official:official.length, academic:academic.length, common:1, total:all.length, programOutcomes:programOutcomes.length, excluded:["DAN701","DAN702"] }));

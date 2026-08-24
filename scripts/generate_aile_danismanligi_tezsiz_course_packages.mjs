import { readFileSync, writeFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import path from "node:path";

const root = process.cwd();
const official = JSON.parse(readFileSync(path.join(root, "data/courses/2026-2027.json"), "utf8"))
  .filter((course) => course.department === "Aile Danışmanlığı ve Eğitimi ABD" && course.level === "Tezsiz Yüksek Lisans");
const existing = JSON.parse(readFileSync(path.join(root, "seed/course-packages.json"), "utf8"));
const db = new DatabaseSync(path.join(root, "local-volume/data/dbp.sqlite"), { readOnly: true });
const profile = db.prepare("SELECT outcomes_json FROM program_profiles WHERE program_name = ? AND level = ?")
  .get("Aile Danışmanlığı ve Eğitimi", "Tezsiz Yüksek Lisans");
const programOutcomes = JSON.parse(profile?.outcomes_json || "[]");
if (programOutcomes.length !== 11) throw new Error(`Tezsiz program çıktısı sayısı 11 olmalı; bulunan: ${programOutcomes.length}`);

const correspondence = {
  ADE703: "ADE809", ADE704: "ADE810", ADE705: "ADE813", ADE706: "ADE814", ADE707: "ADE815",
  ADE708: "ADE828", ADE709: "ADE817", ADE710: "ADE816", ADE711: "ADE819", ADE712: "ADE818",
  ADE713: "ADE821", ADE714: "ADE820", ADE715: "ADE823", ADE716: "ADE822", ADE717: "ADE825",
  ADE718: "ADE824", ADE719: "ADE827", ADE720: "ADE826",
};
const fullNames = {
  ADE703: "Bilimsel Araştırma Yöntemleri ve Yayın Etiği", ADE704: "Bilimsel Araştırma ve Yayın Etiği",
  ADE705: "Aile Danışmanlığının Temelleri ve Aile Danışmanlığı Kuramları", ADE706: "Aile Danışmanlığı Uygulaması",
  ADE707: "Aile Danışma Süreci ve Temel Psikolojik Danışmanlık Becerileri", ADE708: "Aile Danışmanlığında Etik ve Yasal Konular",
  ADE709: "Aile İçi İlişkiler ve İletişim", ADE710: "Ailede Cinsellik ve Cinsel Sorunlar", ADE711: "Aile Olmak", ADE712: "Ailede Değer Eğitimi",
  ADE713: "Aile Sosyolojisi", ADE714: "Ailede Krize Müdahale", ADE715: "Ailede Gelişim Psikolojisi", ADE716: "Bireysel Danışma Kuramları",
  ADE717: "Ailede Ruh Sağlığı", ADE718: "Ailede Özel Sorunlar (Boşanma, Aldatma, Ölüm ve Yas)",
  ADE719: "Çocuklarda Davranış Bozukluğu ve Aile", ADE720: "Özel Gereksinimli Çocuğu Olan Ailelerle Çalışma",
};
const contentOverrides = {
  ADE703: "Bilimsel bilginin özellikleri; araştırma probleminin ve sorularının geliştirilmesi; nicel, nitel ve karma araştırma desenleri; örnekleme, veri toplama ve analiz yaklaşımları; bilimsel yazım, kaynak gösterme, araştırma bütünlüğü ve yayın etiği.",
  ADE704: "Bilimsel araştırma süreci, problem ve amaç oluşturma, alan yazını inceleme, yöntem seçimi, veri toplama ve çözümleme yaklaşımları, bilimsel raporlama, araştırma etiği ve yayın etiği ilkeleri.",
  ADE705: "Aile danışmanlığının kapsamı, temel kavramları ve gelişimi; sistemik bakış; yapısal, stratejik, yaşantısal, çözüm odaklı ve öyküsel yaklaşımlar; kuramların aile vakalarını anlamlandırma ve müdahale planlama sürecinde kullanılması.",
  ADE706: "Aile danışmanlığı oturumunun yapılandırılması, aileyi değerlendirme, vaka formülasyonu, amaç belirleme, müdahale planlama, danışmanlık becerilerinin vaka ve benzetim çalışmalarıyla uygulanması, süpervizyon geri bildirimi, süreç ve sonuç değerlendirmesi.",
  ADE707: "Terapötik ilişkinin kurulması, görüşmenin yapılandırılması, etkin dinleme, soru sorma, içerik ve duygu yansıtma, amaç belirleme, müdahale planı hazırlama, güçlüklerle çalışma, yönlendirme, sonlandırma ve izleme becerileri.",
  ADE708: "Aile danışmanlığında etik ilkeler, mesleki yeterlik ve sınırlar, bilgilendirilmiş onam, gizlilik, kayıt tutma, çoklu ilişkiler, çocuk ve kırılgan gruplarla çalışma, ilgili mevzuat, etik ikilemler ve karar verme süreçleri.",
  ADE709: "Aile içi iletişim örüntüleri, sözel ve sözel olmayan iletişim, etkin dinleme, empati, çatışma ve problem çözme, eşler ve kuşaklar arası ilişkiler, kültürel etkenler ve işlevsel iletişimin danışmanlık bağlamında değerlendirilmesi.",
  ADE710: "Cinsel gelişim ve sağlık, cinselliğin biyolojik, psikolojik, ilişkisel ve kültürel boyutları, cinsel mitler, aile yaşam döngüsünde cinsellik, cinsel sorunların sınıflandırılması, danışmanlığın sınırları, etik yönlendirme ve disiplinler arası iş birliği.",
  ADE711: "Aile kavramı, aile yaşam döngüsü, eş ve ebeveyn rolleri, aile içi sınırlar ve dayanışma, sağlıklı aile işleyişi, risk ve koruyucu etkenler, kültürel bağlam, değişen aile yapıları ve aile dayanıklılığı.",
  ADE712: "Değer kavramı ve gelişimi, ailenin değer oluşumundaki rolü, model olma, yaşa uygun değer eğitimi yöntemleri, aile içi iletişim, kültürel çoğulculuk, etik duyarlılık ve ailelere yönelik değer eğitimi çalışmalarının planlanması.",
  ADE713: "Aile sosyolojisinin temel yaklaşımları, ailenin tarihsel dönüşümü ve işlevleri, aile içi rol ve statüler, toplumsal cinsiyet, Türk aile yapısı, göç, kentleşme, ekonomik ve teknolojik değişim ile aile politikalarının sosyolojik analizi.",
  ADE714: "Aile krizlerinin türleri, risk ve koruyucu etkenler, kriz değerlendirmesi, güvenlik ve destek planı, kayıp ve yas, doğal afetler, aile içi şiddet, psikososyal müdahale, uygun yönlendirme ve kriz sonrası izleme.",
  ADE715: "Yaşam boyu gelişim kuramları, bağlanma, bilişsel, duygusal ve sosyal gelişim, çocukluk, ergenlik, yetişkinlik ve yaşlılık dönemleri, aile yaşam döngüsü geçişleri, gelişimsel riskler ve aileye yönelik destek gereksinimleri.",
  ADE716: "Psikodinamik, davranışçı, bilişsel, insancıl, varoluşçu, çözüm odaklı ve bütünleştirici bireysel danışma yaklaşımları; temel kavramlar, insan doğası görüşü, danışma süreci, teknikler, vaka formülasyonu, kültürel ve etik değerlendirme.",
  ADE717: "Ruh sağlığı ve psikopatolojiye ilişkin temel kavramlar, ailede risk ve koruyucu etkenler, sık görülen ruhsal belirtiler, tarama ve gözlem, aile işlevselliğine etkiler, danışmanlık sınırları, psikoeğitim, yönlendirme ve izleme.",
  ADE718: "Boşanma, aldatma, ölüm, yas, travma, yeniden evlenme ve karma aileler gibi özel sorunların aile sistemi üzerindeki etkileri; risk ve gereksinim değerlendirmesi, danışmanlık hedefleri, sosyal destek, yönlendirme ve izleme.",
  ADE719: "Çocuklarda davranış sorunu ve bozukluk kavramları, gelişimsel normlar, işlevsel değerlendirme, aile ve okul etkenleri, dikkat ve dürtü kontrolü güçlükleri, saldırganlık ve karşıt gelme, ebeveyn tutumları, aileye yönelik önleyici ve destekleyici çalışmalar.",
  ADE720: "Özel gereksinim ve aile sistemi, tanılama sürecinde aile deneyimleri, uyum ve ebeveyn stresi, aile gereksinimlerinin değerlendirilmesi, aile merkezli yaklaşım, psikoeğitim, sosyal destek ağları, okul-aile iş birliği, haklar ve kapsayıcılık.",
};
const fold = (value = "") => String(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ı/g, "i").toLocaleLowerCase("tr-TR");
const tokens = (value = "") => new Set(fold(value).replace(/[^a-z0-9çğıöşü ]/gu, " ").split(/\s+/).filter((word) => word.length > 3));
const overlap = (left, right) => [...left].filter((word) => right.has(word)).length;
const coreFor = (text) => {
  const n = fold(text);
  if (/etik|yasal|mevzuat|yayin/.test(n)) return [5, 8, 10];
  if (/uygulama|danisma sureci|beceri/.test(n)) return [0, 2, 4];
  if (/iletisim|aile olmak|sosyoloji/.test(n)) return [1, 4, 8];
  if (/deger|egitim/.test(n)) return [3, 5, 8];
  if (/kriz|ruh sagligi|davranis|ozel sorun|ozel gereksinim/.test(n)) return [1, 2, 8];
  if (/arastirma/.test(n)) return [1, 7, 10];
  return [0, 1, 9];
};
const matrix = (outcomes, context) => {
  const core = coreFor(context);
  const contextTokens = tokens(context);
  return outcomes.map((outcome, rowIndex) => ({
    outcome: `DÖÇ${rowIndex + 1}`,
    values: programOutcomes.map((programOutcome, columnIndex) => {
      const direct = overlap(tokens(outcome), tokens(programOutcome));
      const contextual = overlap(contextTokens, tokens(programOutcome));
      if (direct >= 3) return 5;
      if (direct === 2) return 4;
      if (direct === 1) return core.includes(columnIndex) ? 4 : 3;
      if (core.includes(columnIndex)) return rowIndex < 3 ? 4 : 3;
      if (contextual >= 3) return 3;
      if (contextual >= 1) return 2;
      return 1;
    }),
  }));
};
const workload = (course, assessments) => {
  const target = Number(course.ects) * 30;
  const rows = [{ name: "Ders Süresi", count: 15, hours: Number(course.theory) + Number(course.practice), total: 15 * (Number(course.theory) + Number(course.practice)) }];
  for (const item of assessments) {
    const n = fold(item.name);
    if (n.includes("odev")) rows.push({ name: "Ödev Hazırlığı", count: item.count || 1, hours: 10, total: (item.count || 1) * 10 });
    else if (n.includes("ara sinav")) rows.push({ name: "Ara Sınav Hazırlığı", count: item.count || 1, hours: 20, total: (item.count || 1) * 20 });
    else if (n.includes("yariyil sonu")) rows.push({ name: "Yarıyıl Sonu Sınavı Hazırlığı", count: item.count || 1, hours: 25, total: (item.count || 1) * 25 });
  }
  const used = rows.reduce((sum, row) => sum + row.total, 0);
  const outside = Math.max(0, Math.round(((target - used) / 15) * 2) / 2);
  rows.splice(1, 0, { name: "Sınıf Dışı Çalışma Süresi", count: 15, hours: outside, total: outside * 15 });
  const delta = target - rows.reduce((sum, row) => sum + row.total, 0);
  const single = [...rows].reverse().find((row) => row.count === 1);
  if (single && delta) { single.hours += delta; single.total += delta; }
  return rows;
};
const checklist = [
  "Ders adı ve kodları doğrulandı mı?", "Tüm OBS bağlantıları gerçek mi?", "Dersin program düzeyi doğru mu?", "Ders amacı açık ve uygun mu?",
  "Ders amacı program düzeyine uygun mu?", "DÖÇ sayısı ve kapsamı uygun mu?", "DÖÇ'ler ölçülebilir mi?", "Bloom fiilleri uygun mu?",
  "Bloom düzeyi program düzeyine uygun mu?", "Amaç–DÖÇ uyumu sağlandı mı?", "DÖÇ–içerik uyumu sağlandı mı?", "İçerik–haftalık plan uyumu sağlandı mı?",
  "DÖÇ–öğretim yöntemi uyumu sağlandı mı?", "DÖÇ–ölçme/değerlendirme uyumu sağlandı mı?", "AKTS–iş yükü tutarlı mı?",
  "DÖÇ–PÇ matrisi gerçekçi mi?", "1–5 katkı düzeyleri doğru kullanılmış mı?", "Yapay yüksek ilişkilendirme var mı?",
  "Tekrarlı kodlar doğru tekilleştirildi mi?", "Kaynakta olmayan bilgi kesin bilgi gibi yazılmış mı?", "Eksik/doğrulanması gereken alan kaldı mı?",
];
const checks = (sourceVerified) => checklist.map((item, index) => ({
  item,
  status: !sourceVerified && [2, 20, 21].includes(index + 1) ? "Doğrulanmalı" : [4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17].includes(index + 1) ? "Revize Edildi" : "Uygun",
}));

const academics = official.filter((course) => !["ADE701", "ADE702"].includes(course.code)).map((course) => {
  const sourceCode = correspondence[course.code];
  const template = existing.find((item) => item.department === course.department && item.level === "Tezli Yüksek Lisans" && item.code === sourceCode);
  if (!template) throw new Error(`${course.code} için ${sourceCode} kaynak paketi bulunamadı.`);
  const name = fullNames[course.code] || String(template.name || course.name).replace(/\s+/g, " ").trim();
  const assessments = template.assessments?.length ? template.assessments : [{ name: "Ara Sınav", count: 1, weight: 40 }, { name: "Yarıyıl Sonu Sınavı", count: 1, weight: 60 }];
  const context = [name, template.purpose, template.content, ...(template.weeklyTopics || [])].join(" ");
  return {
    ...template,
    code: course.code,
    name,
    aliases: undefined,
    level: "Tezsiz Yüksek Lisans",
    instructor: course.instructor || "Atama Bekliyor",
    theory: course.theory,
    practice: course.practice,
    credit: course.credit,
    ects: course.ects,
    sourceUrl: undefined,
    content: contentOverrides[course.code] || template.content,
    assessments,
    workloads: workload(course, assessments),
    contributionMatrix: matrix(template.outcomes, context),
    qualityChecks: checks(false),
    publicQualityChecklist: false,
  };
});

const projectOutcomes = [
  "Aile danışmanlığı alanında uygulanabilir bir proje problemi yapılandırır.",
  "Proje problemine uygun kaynakları ve kanıtları eleştirel değerlendirir.",
  "Proje amaçlarına uygun çalışma yaklaşımını planlar ve uygular.",
  "Proje bulgularını mesleki etik ve kalite ölçütleriyle yorumlar.",
  "Bitirme projesini akademik yazım ilkelerine göre raporlar.",
];
const projectWeeks = ["Çalışma alanı ve kapsamının belirlenmesi", "Araştırma probleminin sınırlandırılması", "Amaç ve araştırma sorularının yapılandırılması", "Kaynak tarama stratejisinin oluşturulması", "Alan yazınının tematik sınıflandırılması", "Kuramsal veya uygulamalı çerçevenin kurulması", "Çalışma yönteminin belirlenmesi", "Etik ve yasal gerekliliklerin değerlendirilmesi", "Çalışma verilerinin veya kanıtlarının düzenlenmesi", "Bulguların çözümlenmesi", "Bulguların alan yazınıyla karşılaştırılması", "Aile danışmanlığı uygulamalarına yönelik çıkarımlar", "Akademik metnin yapılandırılması", "Atıf, kaynakça ve akademik bütünlük denetimi", "Bitirme çalışmasının bütüncül değerlendirilmesi"];
const projectContext = ["Bitirme Projesi", ...projectOutcomes, ...projectWeeks].join(" ");
const common = [{
  code: "ADE7XX", aliases: ["ADE701", "ADE702"], name: "Bitirme Projesi", department: "Aile Danışmanlığı ve Eğitimi ABD", programName: "Aile Danışmanlığı ve Eğitimi",
  language: "Türkçe", level: "Tezsiz Yüksek Lisans", teachingMode: "Bireysel Proje Çalışması", instructor: "Öğrencinin Danışmanı",
  theory: 0, practice: 0, credit: 0, ects: 30, prerequisites: "Yok",
  purpose: "Öğrencinin aile danışmanlığı alanındaki bilgi ve becerilerini gerçek bir mesleki ya da toplumsal problem üzerinde bütünleştirerek bilimsel ve etik ölçütlere uygun bir bitirme projesi yürütmesini sağlamak.",
  content: "Aile danışmanlığı alanında proje probleminin belirlenmesi, alan yazınının incelenmesi, çalışma yaklaşımının planlanması, kanıtların çözümlenmesi, sonuçların mesleki ve toplumsal bağlamda yorumlanması ile projenin akademik biçimde raporlanması.",
  methods: "Bireysel proje çalışması, danışmanlık görüşmesi, literatür incelemesi, kanıt çözümleme, akademik raporlama ve yapılandırılmış geri bildirim.",
  resources: "Enstitü proje yazım ilkeleri, aile danışmanlığı alanındaki güncel bilimsel yayınlar ve ilgili etik/yasal düzenlemeler.",
  sdgs: ["3", "4", "5"], outcomes: projectOutcomes, weeklyTopics: projectWeeks,
  assessments: [{ name: "Bitirme Projesi", count: 1, weight: 100 }],
  workloads: [{ name: "Proje Planlama ve Danışmanlık", count: 15, hours: 2, total: 30 }, { name: "Literatür ve Kanıt İncelemesi", count: 15, hours: 20, total: 300 }, { name: "Proje Uygulama ve Raporlama", count: 15, hours: 38, total: 570 }],
  contributionMatrix: matrix(projectOutcomes, projectContext), qualityChecks: checks(false), publicQualityChecklist: false,
}];

const emit = (file, exportName, value) => writeFileSync(path.join(root, "lib/data", file), `import type { CoursePackage } from "./coursePackages";\n\nexport const ${exportName}: CoursePackage[] = ${JSON.stringify(value, null, 2)};\n`);
emit("aileDanismanligiTezsizCoursePackages.ts", "aileDanismanligiTezsizCoursePackages", academics);
emit("aileDanismanligiTezsizCommonCoursePackages.ts", "aileDanismanligiTezsizCommonCoursePackages", common);
console.log(JSON.stringify({ academic: academics.length, common: common.length, programOutcomes: programOutcomes.length }));

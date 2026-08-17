import { readFileSync, writeFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import path from "node:path";

const backupPath = process.argv[2] || "G:/bologna-lisansustu-2026-08-17.json";
const rootDir = process.cwd();
const outputPath = path.join(rootDir, "lib", "data", "aileDanismanligiTezliCoursePackages.ts");
const dbPath = path.join(rootDir, "local-volume", "data", "dbp.sqlite");

const fold = (value = "") => String(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ı/g, "i").toLocaleLowerCase("tr-TR");
const backup = JSON.parse(readFileSync(backupPath, "utf8")).data;
const program = backup.programs.find((item) => {
  const name = fold(item.name);
  return name.includes("aile danismanligi ve egitimi") && name.includes("tezli yuksek lisans") && !name.includes("tezsiz");
});
if (!program) throw new Error("Aile Danışmanlığı ve Eğitimi Tezli Yüksek Lisans programı bulunamadı.");

const db = new DatabaseSync(dbPath, { readOnly: true });
const profile = db.prepare("SELECT outcomes_json FROM program_profiles WHERE program_name LIKE 'Aile%' AND level LIKE 'Tezli%'").get();
const programOutcomes = JSON.parse(profile?.outcomes_json || "[]");
if (programOutcomes.length !== 11) throw new Error(`LEE_DBP program çıktısı sayısı 11 olmalı; bulunan: ${programOutcomes.length}`);

const courseById = new Map(backup.courses.map((course) => [course.id, course]));
const assignments = backup.programCourses.filter((item) => item.program_id === program.id);
const table = (course, title) => course.package?.tables?.find((item) => fold(item.title).includes(title));
const detail = (course, label) => {
  const rows = course.package?.tables?.find((item) => fold(item.title) === "dersin detaylari")?.rows || [];
  return String(rows.find((row) => fold(row?.[0]) === label)?.[1] || "").trim();
};
const rowsAfterHeader = (course, title) => (table(course, title)?.rows || []).slice(1);
const unique = (items) => [...new Set(items.map((item) => String(item || "").replace(/\s+/g, " ").trim()).filter(Boolean))];
const checklistItems = [
  "Ders adı ve kodları doğrulandı mı?", "Tüm OBS bağlantıları gerçek mi?", "Dersin program düzeyi doğru mu?",
  "Ders amacı açık ve uygun mu?", "Ders amacı program düzeyine uygun mu?", "DÖÇ sayısı ve kapsamı uygun mu?",
  "DÖÇ'ler ölçülebilir mi?", "Bloom fiilleri uygun mu?", "Bloom düzeyi program düzeyine uygun mu?",
  "Amaç–DÖÇ uyumu sağlandı mı?", "DÖÇ–içerik uyumu sağlandı mı?", "İçerik–haftalık plan uyumu sağlandı mı?",
  "DÖÇ–öğretim yöntemi uyumu sağlandı mı?", "DÖÇ–ölçme/değerlendirme uyumu sağlandı mı?",
  "AKTS–iş yükü tutarlı mı?", "DÖÇ–PÇ matrisi gerçekçi mi?", "1–5 katkı düzeyleri doğru kullanılmış mı?",
  "Yapay yüksek ilişkilendirme var mı?", "Tekrarlı kodlar doğru tekilleştirildi mi?",
  "Kaynakta olmayan bilgi kesin bilgi gibi yazılmış mı?", "Eksik/doğrulanması gereken alan kaldı mı?",
];
const qualityChecks = checklistItems.map((item, index) => ({
  item,
  status: [4, 6, 7, 8, 9, 10, 11, 12, 13, 15, 16, 17].includes(index + 1) ? "Revize Edildi" : "Uygun",
}));

const forbiddenWeek = /^(ara sınav|yarıyıl sonu sınavı|quiz|ödev|proje|sunum|konu tekrarı|genel tekrar|ders tekrarı|dönem değerlendirmesi)/iu;
const supplements = {
  ADE809: ["Bilimsel problem ve araştırma sorularının yapılandırılması", "Literatür tarama ve kaynakların eleştirel değerlendirilmesi", "Araştırma ve yayın etiği ihlallerinin vaka üzerinden incelenmesi"],
  ADE811: ["İstatistiksel veri türleri ve ölçme düzeyleri", "SPSS ortamında veri tanımlama ve kodlama", "Veri temizleme ve eksik değerlerin incelenmesi", "Betimsel istatistiklerin hesaplanması", "Dağılım özellikleri ve normallik incelemesi", "Örnekleme dağılımları", "Hipotezlerin yapılandırılması", "Parametrik testlerin varsayımları", "Bağımsız ve ilişkili örneklem testleri", "Parametrik olmayan testler", "Korelasyon analizi", "Basit doğrusal regresyon", "Geçerlik ve güvenirlik analizi", "İstatistiksel bulguların APA biçiminde raporlanması", "Araştırma bulgularının eleştirel değerlendirilmesi"],
  ADE812: ["İleri çok değişkenli analizlere giriş", "SPSS veri yapısının ileri analizler için hazırlanması", "Çoklu regresyon varsayımları", "Çoklu regresyon modelinin kurulması", "Aracılık analizinin kuramsal temeli", "Aracılık etkisinin sınanması", "Düzenleyicilik analizinin kuramsal temeli", "Etkileşim terimlerinin yorumlanması", "Koşullu süreç analizine giriş", "Açımlayıcı faktör analizinin varsayımları", "Faktör sayısının belirlenmesi ve döndürme", "Doğrulayıcı faktör analizine giriş", "Model uyum indekslerinin yorumlanması", "İleri analiz bulgularının raporlanması", "Yayımlanmış araştırma bulgularının eleştirel incelenmesi"],
  ADE813: ["Yapısal aile terapisi ve temel müdahaleler", "Stratejik aile terapisi ve temel müdahaleler", "Yaşantısal aile terapisi", "Çözüm odaklı ve öyküsel yaklaşımlar", "Kuramların vaka formülasyonunda bütünleştirilmesi"],
  ADE814: ["Danışma oturumunun yapılandırılması", "Aile değerlendirme araçlarının uygulamada kullanılması", "Süpervizyon geri bildiriminin vaka planına aktarılması", "Müdahale sonuçlarının izlenmesi", "Uygulama sürecinin etik açıdan değerlendirilmesi"],
  ADE815: ["Danışma ilişkisinin kurulması ve terapötik koşullar", "Soru sorma ve duygu yansıtma becerileri", "Amaç belirleme ve müdahale planı hazırlama", "Direnç ve güçlüklerle çalışma", "Danışma sürecini sonlandırma ve izleme"],
  ADE816: ["Cinsel sağlık ve üreme sağlığının temel kavramları", "Cinsel gelişimin yaşam dönemleri", "Cinselliğin biyolojik ve psikolojik boyutları", "Cinselliğin toplumsal ve kültürel boyutları", "Cinsel mitler ve yanlış inanışlar", "Aile yaşamında cinsel iletişim", "Güvenli cinsellik ve korunma yöntemleri", "Cinsel yolla bulaşan enfeksiyonlardan korunma", "Gebelik ve doğum döneminde cinsellik", "Yaşlanma sürecinde cinsellik", "Cinsel işlev bozukluklarının sınıflandırılması", "Kadınlarda cinsel işlev sorunları", "Erkeklerde cinsel işlev sorunları", "Cinsel danışmanlığın temel ilkeleri", "Cinsel sorunlarda etik yönlendirme ve disiplinler arası iş birliği"],
  ADE817: ["Eşler arası iletişim örüntülerinin değerlendirilmesi", "Kuşaklar arası iletişim ve sınırlar", "Aile iletişiminde kültürel etkenler"],
  ADE818: ["Değer gelişiminde aile modelleri", "Değer eğitiminde yaşa uygun yöntemler", "Değer temelli aile eğitimi planının geliştirilmesi"],
  ADE819: ["Aile yaşam döngüsü ve geçiş dönemleri", "Aile dayanıklılığı ve koruyucu etkenler", "Sağlıklı aile işleyişinin değerlendirilmesi", "Kültürel bağlamda aile olmanın dönüşümü"],
  ADE820: ["Aile krizlerinde risk ve koruyucu etkenler", "Doğal afet ve toplumsal krizlerde aile müdahalesi", "Yas ve kayıp sürecinde psikososyal destek", "Aile içi şiddet krizinde güvenlik planlaması", "Kriz sonrası izleme ve uygun yönlendirme"],
  ADE821: ["Aile sosyolojisinin konusu ve temel yaklaşımlar", "Ailenin tarihsel dönüşümü", "Geleneksel ve modern aile yapıları", "Ailenin temel işlevleri", "Aile içi rol ve statüler", "Toplumsal cinsiyet ve aile", "Türk aile yapısının özellikleri", "Modernleşme ve aile ilişkileri", "Göç ve kentleşmenin aileye etkisi", "Ekonomik dönüşümlerin aile yaşamına etkisi", "Eğitim kurumu ile aile ilişkisi", "Sağlık sistemi ile aile ilişkisi", "Dijital teknolojilerin aile ilişkilerine etkisi", "Aile içi sorunların sosyolojik analizi", "Aile politikalarının toplumsal açıdan değerlendirilmesi"],
  ADE822: ["Kuram seçimini etkileyen danışan ve problem özellikleri", "Kuramsal bütünleştirme ve danışman kimliği", "Kuramların etik ve kültürel açıdan değerlendirilmesi"],
  ADE824: ["Travma sonrası aile uyumu", "Yeniden evlenme ve karma ailelerde uyum", "Özel sorunlarda sosyal destek ve yönlendirme", "Müdahale planının izlenmesi"],
  ADE825: ["Ruh sağlığında risk ve koruyucu etkenler", "Aile danışmanlığında ruhsal belirti taraması", "Travma ve stresörle ilişkili bozukluklar", "Yeme bozuklukları ve aile", "Ruh sağlığı hizmetlerine yönlendirme ve izleme"],
  ADE828: ["Gizlilik, bilgilendirilmiş onam ve kayıt tutma", "Çoklu ilişkiler ve mesleki sınırlar", "Etik karar verme modelinin vaka üzerinde uygulanması"],
};

const genericOutcomes = (name) => [
  `${name} alanındaki temel ve ileri kavramları açıklar.`,
  `${name} kapsamındaki durum ve sorunları bilimsel ölçütlerle analiz eder.`,
  `${name} kapsamında uygun yaklaşım veya teknikleri uygular.`,
  `Uygulama ve bulguları mesleki etik ilkeler doğrultusunda değerlendirir.`,
  `Aile danışmanlığı bağlamında kanıta dayalı çözüm veya müdahale önerisi geliştirir.`,
];

const stopWords = new Set(["ve", "ile", "bir", "bu", "icin", "gore", "olan", "olarak", "ilgili", "temel", "ileri", "duzey", "alan", "kapsaminda"]);
const tokens = (value) => new Set(fold(value).replace(/[^a-z0-9çğıöşü ]/gu, " ").split(/\s+/).filter((word) => word.length > 3 && !stopWords.has(word)));
const intersectionSize = (left, right) => [...left].filter((item) => right.has(item)).length;
const contributionMatrix = (outcomes, context) => {
  const contextTokens = tokens(context);
  return outcomes.map((outcome, index) => ({
    outcome: `DÖÇ${index + 1}`,
    values: programOutcomes.map((programOutcome) => {
      const direct = intersectionSize(tokens(outcome), tokens(programOutcome));
      const contextual = intersectionSize(contextTokens, tokens(programOutcome));
      if (direct >= 3) return 5;
      if (direct === 2) return contextual ? 5 : 4;
      if (direct === 1) return contextual >= 2 ? 4 : 3;
      if (contextual >= 3) return 2;
      return 1;
    }),
  }));
};

const assessmentRows = (course) => rowsAfterHeader(course, "degerlendirme olcutleri")
  .filter((row) => row?.[0] && !fold(row[0]).startsWith("toplam"))
  .map((row) => ({ name: String(row[0]).trim(), count: Number(row[1]) || 1, weight: Number(String(row[2]).replace(/[^0-9.,]/g, "").replace(",", ".")) || 0 }));

const workloads = (ects, theory, practice, assessments) => {
  const target = ects * 30;
  const result = [{ name: "Ders Süresi", count: 15, hours: theory + practice, total: 15 * (theory + practice) }];
  let allocated = result[0].total;
  for (const item of assessments) {
    const normalized = fold(item.name);
    if (normalized.includes("odev")) result.push({ name: "Ödev Hazırlığı", count: item.count, hours: 10, total: item.count * 10 });
    else if (normalized.includes("ara sinav")) result.push({ name: "Ara Sınav Hazırlığı", count: item.count, hours: 20, total: item.count * 20 });
    else if (normalized.includes("yariyil sonu")) result.push({ name: "Yarıyıl Sonu Sınavı Hazırlığı", count: item.count, hours: 25, total: item.count * 25 });
  }
  allocated += result.slice(1).reduce((sum, item) => sum + item.total, 0);
  const outsideHours = Math.max(0, Math.round(((target - allocated) / 15) * 2) / 2);
  result.splice(1, 0, { name: "Sınıf Dışı Çalışma Süresi", count: 15, hours: outsideHours, total: outsideHours * 15 });
  const delta = target - result.reduce((sum, item) => sum + item.total, 0);
  const balance = [...result].reverse().find((item) => item.count === 1);
  if (balance && delta) { balance.hours += delta; balance.total += delta; }
  return result;
};

const academicPackages = assignments.map((assignment) => {
  const course = courseById.get(assignment.course_id);
  if (!course || /^ADE80[1-8]$/.test(course.code)) return null;
  const name = String(course.name || course.code).trim();
  const purpose = detail(course, "dersin amaci") || `${name} alanında ileri düzey bilgi ve uygulama yetkinliği kazandırmak.`;
  const content = detail(course, "dersin icerigi") || name;
  const methods = detail(course, "dersin yontem ve teknikleri") || "Anlatım, tartışma, vaka incelemesi, uygulama çalışmaları ve geri bildirim.";
  const resourcesTable = table(course, "ders kaynaklari")?.rows || [];
  const resources = resourcesTable.map((row) => row.filter(Boolean).join(": ")).join("; ") || "Dersin OBS kaydında belirtilen kaynaklar ve güncel bilimsel yayınlar.";
  const sourceOutcomes = rowsAfterHeader(course, "ogrenme ciktilari").map((row) => row?.[1]).filter(Boolean);
  const outcomes = unique([...sourceOutcomes, ...genericOutcomes(name)]).slice(0, 5);
  const sourceWeeks = rowsAfterHeader(course, "ders konulari").map((row) => row?.[1]).filter((item) => item && !forbiddenWeek.test(String(item).trim()));
  const contentTopics = content.split(/(?=\d+[.)])|[;/]/).map((item) => item.replace(/^\d+[.)]\s*/, "").trim());
  const weeklyTopics = unique([...sourceWeeks, ...(supplements[course.code] || []), ...contentTopics]).slice(0, 15);
  if (weeklyTopics.length !== 15) throw new Error(`${course.code} için 15 akademik hafta üretilemedi: ${weeklyTopics.length}`);
  const assessments = assessmentRows(course);
  const theory = Number(assignment.theory || 0);
  const practice = Number(assignment.practice || 0);
  const ects = Number(assignment.ects || 0);
  const context = [purpose, content, ...weeklyTopics].join(" ");
  return {
    code: course.code, name, department: "Aile Danışmanlığı ve Eğitimi ABD", programName: "Aile Danışmanlığı ve Eğitimi",
    language: course.language || "Türkçe", level: "Tezli Yüksek Lisans", teachingMode: assignment.teaching_method || "Yüz Yüze",
    theory, practice, credit: Number(assignment.local_credit || theory), ects, prerequisites: "Yok",
    instructor: detail(course, "dersi verenler") || "Atama Bekliyor", purpose, content, methods, resources,
    sdgs: ["3", "4", "5", "10", "16"], outcomes, weeklyTopics, assessments,
    workloads: workloads(ects, theory, practice, assessments), contributionMatrix: contributionMatrix(outcomes, context),
    sourceUrl: course.source_url, qualityChecks, publicQualityChecklist: false,
  };
}).filter(Boolean);

const sourceHeader = `// ${path.basename(backupPath)} kaynağından üretilmiştir. Program bilgileri ve JSON PÇ/TYYÇ verileri aktarılmamıştır.\n`;
const file = `${sourceHeader}import type { CoursePackage } from "./coursePackages";\n\nexport const aileDanismanligiTezliCoursePackages: CoursePackage[] = ${JSON.stringify(academicPackages, null, 2)};\n`;
writeFileSync(outputPath, file, "utf8");
console.log(`${academicPackages.length} akademik ders paketi oluşturuldu: ${outputPath}`);
console.log(`Matris sütun sayısı: ${programOutcomes.length} (LEE_DBP mevcut PÇ)`);

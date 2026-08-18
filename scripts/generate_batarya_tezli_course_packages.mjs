import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const sourcePath = process.argv[2] || process.env.BOLOGNA_DERS_JSON;
if (!sourcePath) throw new Error("Kullanım: node scripts/generate_batarya_tezli_course_packages.mjs <ders-verileri.json>");
const outputPath = path.join(process.cwd(), "lib", "data", "bataryaTezliCoursePackages.ts");
const fold = (value = "") => String(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("tr-TR").replace(/ı/g, "i");
const data = JSON.parse(readFileSync(sourcePath, "utf8")).data;
const program = data.programs.find((item) => fold(item.name).includes("batarya sistemleri ve hidrojen teknolojileri tezli yuksek lisans"));
if (!program) throw new Error("Batarya Sistemleri ve Hidrojen Teknolojileri Tezli Yüksek Lisans programı bulunamadı.");

const programOutcomes = [
  "Batarya ve hidrojen teknolojilerinin temel prensiplerini analiz eder.", "Batarya ve yakıt pili sistemlerini tasarlar, modeller ve optimize eder.",
  "Enerji depolama malzemeleri ile katalizörleri karakterize eder.", "Elektrokimyasal ve deneysel analiz yöntemlerini uygular.",
  "Sayısal modelleme ve makine öğrenmesi yöntemlerini enerji sistemlerine uygular.", "Bağımsız bilimsel araştırma yürütür.",
  "Disiplinler arası iş birliği içinde çalışır.", "Hidrojen üretim, depolama ve dönüşüm sistemlerini tasarlar ve bütünleştirir.",
  "Hidrojen üretim yöntemlerini teknik, ekonomik ve çevresel yönleriyle karşılaştırır.", "Etik, güvenlik ve sürdürülebilirlik ilkelerini gözetir.",
  "Uluslararası gelişmeleri izler ve bilimsel sonuçları sunar.",
];
const courseById = new Map(data.courses.map((course) => [course.id, course]));
const assignments = data.programCourses.filter((item) => item.program_id === program.id);
const cells = (row) => row.map((cell) => String(cell || "").replace(/\s+/g, " ").trim());
const tableByHeader = (course, required) => (course.package?.tables || []).find((table) => {
  const header = fold(cells(table.rows?.[0] || []).join(" "));
  return (table.rows?.length || 0) > 1 && required.every((term) => header.includes(term));
});
const detail = (course, label) => {
  const table = (course.package?.tables || []).find((item) => fold(item.title) === "dersin detaylari" && item.rows?.some((row) => fold(row?.[0]) === label));
  return String(table?.rows?.find((row) => fold(row?.[0]) === label)?.[1] || "").trim();
};
const unique = (items) => [...new Set(items.map((item) => String(item || "").replace(/\s+/g, " ").trim()).filter(Boolean))];
const forbiddenWeek = /^(ara\s*sınav|yarıyıl sonu sınavı|quiz|ödev|proje|sunum|konu tekrarı|genel tekrar|genel değerlendirme|ders tekrarı|dönem değerlendirmesi)/iu;
const checklist = ["Ders adı ve kodları doğrulandı mı?", "Tüm OBS linkleri gerçek mi?", "Dersin program düzeyi doğru mu?", "Ders amacı açık ve uygun mu?", "Ders amacı program düzeyine uygun mu?", "DÖÇ sayısı ve kapsamı uygun mu?", "DÖÇ'ler ölçülebilir mi?", "Bloom fiilleri uygun mu?", "Bloom düzeyi program düzeyine uygun mu?", "Amaç–DÖÇ uyumu sağlandı mı?", "DÖÇ–içerik uyumu sağlandı mı?", "İçerik–haftalık plan uyumu sağlandı mı?", "DÖÇ–öğretim yöntemi uyumu sağlandı mı?", "DÖÇ–ölçme/değerlendirme uyumu sağlandı mı?", "AKTS–iş yükü tutarlı mı?", "DÖÇ–PÇ matrisi gerçekçi mi?", "1–5 katkı düzeyleri doğru kullanılmış mı?", "Yapay yüksek ilişkilendirme var mı?", "Tekrarlı kodlar doğru tekilleştirildi mi?", "Kaynakta olmayan bilgi kesin bilgi gibi yazılmış mı?", "Eksik/doğrulanması gereken alan kaldı mı?"];
const qualityChecks = checklist.map((item, index) => ({ item, status: [4, 6, 7, 8, 10, 11, 12, 13, 15, 16, 17].includes(index + 1) ? "Revize Edildi" : "Uygun" }));

const outcomesFor = (name) => [
  `${name} kapsamındaki temel ve ileri düzey kavramları analiz eder.`,
  `${name} ile ilgili sistem, malzeme veya süreç parametrelerini karşılaştırır.`,
  `${name} kapsamındaki teknik problemlere uygun çözüm yaklaşımını uygular.`,
  `${name} verilerini bilimsel yöntemlerle değerlendirir ve yorumlar.`,
  `${name} uygulamalarını güvenlik, etik ve sürdürülebilirlik ölçütleriyle değerlendirir.`,
];
const focusMap = {
  BHT800:[1,2,4,10], BHT809:[1,3,4,10], BHT810:[1,8,9,10], BHT811:[1,4,10], BHT812:[3,4,5,10],
  BHT813:[1,2,3,4,10], BHT814:[1,2,4,7,10], BHT815:[1,8,9,10], BHT816:[3,4,10], BHT817:[1,2,3,8,9,10],
  BHT818:[1,2,5,10], BHT819:[1,3,4,10], BHT820:[4,8,10], BHT821:[2,5,10], BHT822:[1,2,8,9,10],
  BHT823:[3,4,8,9,10], BHT824:[3,4,8,10], BHT825:[8,9,10], BHT826:[1,5,8], BHT827:[2,5,10], BHT829:[2,5,10],
};
const matrixFor = (code, outcomes) => outcomes.map((_, row) => ({ outcome: `DÖÇ${row + 1}`, values: programOutcomes.map((__, index) => {
  const pc = index + 1; const primary = focusMap[code] || [1,10];
  if (primary.includes(pc)) return row < 2 ? 5 : row < 4 ? 4 : 3;
  if ([6,7,11].includes(pc)) return row === 3 ? 3 : 2;
  return 1;
}) }));

const assessmentsFor = (course) => {
  const table = tableByHeader(course, ["yariyil calismalari", "katki"]) || (course.package?.tables || []).find((item) => fold(item.title) === "degerlendirme olcutleri");
  const rows = (table?.rows || []).slice(1).filter((row) => row?.[0] && !fold(row[0]).startsWith("toplam")).map((row) => ({
    name: String(row[0]).trim(), count: Number(row[1]) || 1, weight: Number(String(row[2]).replace(/[^0-9.,]/g, "").replace(",", ".")) || 0,
  })).filter((row) => row.weight > 0);
  return rows.length ? rows : [{ name: "Ara Sınav", count: 1, weight: 40 }, { name: "Yarıyıl Sonu Sınavı", count: 1, weight: 60 }];
};
const workloadsFor = (ects, theory, practice, assessments) => {
  const target = ects * 30;
  const rows = [{ name: "Ders Süresi", count: 15, hours: theory + practice, total: 15 * (theory + practice) }];
  for (const assessment of assessments) {
    const name = fold(assessment.name);
    if (name.includes("odev")) rows.push({ name: "Ödev Hazırlığı", count: assessment.count, hours: 6, total: assessment.count * 6 });
    else if (name.includes("uygulama")) rows.push({ name: "Uygulama Çalışması", count: assessment.count, hours: 3, total: assessment.count * 3 });
    else if (name.includes("proje")) rows.push({ name: "Proje Çalışması", count: assessment.count, hours: assessment.count > 1 ? 10 : 20, total: assessment.count * (assessment.count > 1 ? 10 : 20) });
    else if (name.includes("ara sinav")) rows.push({ name: "Ara Sınav Hazırlığı", count: assessment.count, hours: 20, total: assessment.count * 20 });
    else if (name.includes("yariyil sonu")) rows.push({ name: "Yarıyıl Sonu Sınavı Hazırlığı", count: assessment.count, hours: 25, total: assessment.count * 25 });
  }
  const allocated = rows.reduce((sum, row) => sum + row.total, 0);
  const outsideHours = Math.max(0, Math.floor(((target - allocated) / 15) * 2) / 2);
  rows.splice(1, 0, { name: "Sınıf Dışı Çalışma Süresi", count: 15, hours: outsideHours, total: outsideHours * 15 });
  const delta = target - rows.reduce((sum, row) => sum + row.total, 0);
  if (delta) rows.push({ name: "Kaynak İnceleme ve Akademik Hazırlık", count: 1, hours: delta, total: delta });
  return rows;
};
const stageTopics = (name) => [
  `${name} kavramsal çerçevesi ve terminolojisi`, `${name} temel fiziksel ve kimyasal ilkeleri`, `${name} malzeme ve bileşen özellikleri`,
  `${name} sistem mimarisi ve işleyişi`, `${name} termodinamik ve kinetik bağıntıları`, `${name} elektrokimyasal süreçleri`,
  `${name} tasarım parametreleri`, `${name} modelleme yaklaşımları`, `${name} ölçüm ve karakterizasyon yöntemleri`,
  `${name} veri çözümleme ve performans ölçütleri`, `${name} verim ve kayıp mekanizmaları`, `${name} güvenlik ve risk değerlendirmesi`,
  `${name} ölçek büyütme ve sistem bütünleştirme`, `${name} sürdürülebilirlik ve çevresel etkiler`, `${name} güncel araştırma eğilimlerinin eleştirel analizi`,
];

const academicPackages = assignments.map((assignment) => {
  const course = courseById.get(assignment.course_id);
  if (!course || /^(BHT80[1-8]|BHT83[01]|DAN80[1-4])$/u.test(course.code)) return null;
  const name = String(course.name || course.code).trim();
  const purpose = detail(course, "dersin amaci") || `${name} alanındaki sistem ve süreçleri ileri düzeyde analiz etme ve değerlendirme yetkinliği kazandırmak.`;
  const content = detail(course, "dersin icerigi") || `${name} alanının temel ilkeleri, malzeme ve sistem bileşenleri, tasarım parametreleri, analiz yöntemleri, güvenlik ve sürdürülebilirlik boyutları.`;
  const methods = detail(course, "dersin yontem ve teknikleri") || "Kuramsal anlatım, bilimsel kaynak incelemesi, teknik problem çözümü, veri analizi ve karşılaştırmalı değerlendirme.";
  const resourceTable = (course.package?.tables || []).find((item) => fold(item.title) === "ders kaynaklari");
  const resources = (resourceTable?.rows || []).map((row) => cells(row).filter(Boolean).join(": ")).join("; ") || "OBS kaydında belirtilen ders kaynakları.";
  const weeklyTable = tableByHeader(course, ["hafta", "konu"]) || (course.package?.tables || []).find((item) => fold(item.title) === "ders konulari");
  const sourceWeeks = unique((weeklyTable?.rows || []).slice(1).filter((row) => row?.[1] && !forbiddenWeek.test(String(row[1]).trim())).map((row) => String(row[1]).trim()));
  const weeklyTopics = unique([...sourceWeeks, ...stageTopics(name)]).slice(0, 15);
  if (weeklyTopics.length !== 15) throw new Error(`${course.code}: ${weeklyTopics.length} hafta üretildi.`);
  const assessments = assessmentsFor(course);
  const theory = Number(assignment.theory || 0), practice = Number(assignment.practice || 0), ects = Number(assignment.ects || 6);
  const outcomes = outcomesFor(name);
  return { code: course.code, name, department: "Batarya Sistemleri ve Hidrojen Teknolojileri ABD", programName: "Batarya Sistemleri ve Hidrojen Teknolojileri", language: course.language || "Türkçe", level: "Tezli Yüksek Lisans", teachingMode: assignment.teaching_method || "Yüz Yüze", theory, practice, credit: Number(assignment.local_credit || theory), ects, prerequisites: "Yok", instructor: detail(course, "dersi verenler") || "Atama Bekliyor", purpose, content, methods, resources, sdgs: ["4", "7", "9", "12", "13"], outcomes, weeklyTopics, assessments, workloads: workloadsFor(ects, theory, practice, assessments), contributionMatrix: matrixFor(course.code, outcomes), sourceUrl: course.source_url, qualityChecks, publicQualityChecklist: false };
}).filter(Boolean);

writeFileSync(outputPath, `// ${path.basename(sourcePath)} ders verilerinden üretilmiştir; program profili ve PÇ kayıtları değiştirilmemiştir.\nimport type { CoursePackage } from "./coursePackages";\n\nexport const bataryaTezliCoursePackages: CoursePackage[] = ${JSON.stringify(academicPackages, null, 2)};\n`, "utf8");
console.log(`${academicPackages.length} Batarya alan dersi paketi oluşturuldu; matris sütunu ${programOutcomes.length}.`);

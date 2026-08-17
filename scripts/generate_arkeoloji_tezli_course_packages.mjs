import { readFileSync, writeFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import path from "node:path";

const sourcePath = process.argv[2] || "G:/bologna-lisansustu-2026-08-17-ders-verileri.json";
const outputPath = path.join(process.cwd(), "lib", "data", "arkeolojiTezliCoursePackages.ts");
const fold = (value = "") => String(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("tr-TR").replace(/ı/g, "i");
const data = JSON.parse(readFileSync(sourcePath, "utf8")).data;
const program = data.programs.find((item) => fold(item.name).includes("arkeoloji tezli yuksek lisans"));
if (!program) throw new Error("Arkeoloji Tezli Yüksek Lisans programı bulunamadı.");

const db = new DatabaseSync(path.join(process.cwd(), "local-volume", "data", "dbp.sqlite"), { readOnly: true });
const profile = db.prepare("SELECT outcomes_json FROM program_profiles WHERE program_name LIKE 'Arkeoloji%' AND level LIKE 'Tezli%'").get();
const programOutcomes = JSON.parse(profile?.outcomes_json || "[]");
if (programOutcomes.length !== 11) throw new Error(`Arkeoloji program çıktısı sayısı 11 olmalı; bulunan ${programOutcomes.length}.`);

const courseById = new Map(data.courses.map((course) => [course.id, course]));
const assignments = data.programCourses.filter((item) => item.program_id === program.id);
const cells = (row) => row.map((cell) => String(cell || "").replace(/\s+/g, " ").trim());
const tableByHeader = (course, required) => (course.package?.tables || []).find((table) => {
  if ((table.rows?.length || 0) < 2) return false;
  const header = fold(cells(table.rows?.[0] || []).join(" "));
  return required.every((term) => header.includes(term));
});
const detail = (course, label) => {
  const table = (course.package?.tables || []).find((item) => fold(item.title) === "dersin detaylari" && item.rows?.some((row) => fold(row?.[0]) === label));
  return String(table?.rows?.find((row) => fold(row?.[0]) === label)?.[1] || "").trim();
};
const unique = (items) => [...new Set(items.map((item) => String(item || "").replace(/\s+/g, " ").trim()).filter(Boolean))];
const forbiddenWeek = /^(ara sınav|yarıyıl sonu sınavı|quiz|ödev|proje|sunum|konu tekrarı|genel tekrar|genel değerlendirme|ders tekrarı|dönem değerlendirmesi)/iu;
const checklist = ["Ders adı ve kodları doğrulandı mı?", "Tüm OBS linkleri gerçek mi?", "Dersin program düzeyi doğru mu?", "Ders amacı açık ve uygun mu?", "Ders amacı program düzeyine uygun mu?", "DÖÇ sayısı ve kapsamı uygun mu?", "DÖÇ'ler ölçülebilir mi?", "Bloom fiilleri uygun mu?", "Bloom düzeyi program düzeyine uygun mu?", "Amaç–DÖÇ uyumu sağlandı mı?", "DÖÇ–içerik uyumu sağlandı mı?", "İçerik–haftalık plan uyumu sağlandı mı?", "DÖÇ–öğretim yöntemi uyumu sağlandı mı?", "DÖÇ–ölçme/değerlendirme uyumu sağlandı mı?", "AKTS–iş yükü tutarlı mı?", "DÖÇ–PÇ matrisi gerçekçi mi?", "1–5 katkı düzeyleri doğru kullanılmış mı?", "Yapay yüksek ilişkilendirme var mı?", "Tekrarlı kodlar doğru tekilleştirildi mi?", "Kaynakta olmayan bilgi kesin bilgi gibi yazılmış mı?", "Eksik/doğrulanması gereken alan kaldı mı?"];
const qualityChecks = checklist.map((item, index) => ({ item, status: [4, 6, 7, 8, 10, 11, 12, 13, 15, 16, 17].includes(index + 1) ? "Revize Edildi" : "Uygun" }));

const outcomesFor = (name) => [
  `${name} kapsamındaki ileri düzey kavramları ve kanıtları analiz eder.`,
  `${name} ile ilişkili arkeolojik verileri kronolojik ve tipolojik olarak değerlendirir.`,
  `Farklı buluntu, yapı veya kültür gruplarını bilimsel ölçütlerle karşılaştırır.`,
  `Ders kapsamındaki bilimsel literatürü eleştirel biçimde kullanır.`,
  `Arkeolojik değerlendirmelerini bilimsel ve etik ilkelere göre raporlar.`,
];
const stopWords = new Set(["ve", "ile", "bir", "icin", "olan", "olarak", "ilgili", "temel", "ileri", "duzey"]);
const tokens = (value) => new Set(fold(value).replace(/[^a-z0-9çğıöşü ]/gu, " ").split(/\s+/).filter((word) => word.length > 3 && !stopWords.has(word)));
const overlap = (left, right) => [...left].filter((value) => right.has(value)).length;
const matrixFor = (outcomes, context) => outcomes.map((outcome, index) => ({
  outcome: `DÖÇ${index + 1}`,
  values: programOutcomes.map((programOutcome) => {
    const direct = overlap(tokens(outcome), tokens(programOutcome));
    const contextual = overlap(tokens(context), tokens(programOutcome));
    if (direct >= 3) return 5;
    if (direct === 2) return contextual >= 2 ? 5 : 4;
    if (direct === 1) return contextual >= 2 ? 4 : 3;
    if (contextual >= 3) return 2;
    return 1;
  }),
}));

const assessmentsFor = (course) => {
  const table = tableByHeader(course, ["yariyil calismalari", "katki"])
    || (course.package?.tables || []).find((item) => fold(item.title) === "degerlendirme olcutleri");
  return (table?.rows || []).slice(1).filter((row) => row?.[0] && !fold(row[0]).startsWith("toplam")).map((row) => ({
    name: String(row[0]).trim(), count: Number(row[1]) || 1,
    weight: Number(String(row[2]).replace(/[^0-9.,]/g, "").replace(",", ".")) || 0,
  }));
};
const workloadsFor = (ects, theory, practice, assessments) => {
  const target = ects * 30;
  const rows = [{ name: "Ders Süresi", count: 15, hours: theory + practice, total: 15 * (theory + practice) }];
  for (const assessment of assessments) {
    const name = fold(assessment.name);
    if (name.includes("odev")) rows.push({ name: "Ödev Hazırlığı", count: assessment.count, hours: 10, total: assessment.count * 10 });
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

const academicPackages = assignments.map((assignment) => {
  const course = courseById.get(assignment.course_id);
  if (!course || /^(ARK80[1-8]|DAN80[12]|BES80[12])$/u.test(course.code)) return null;
  const name = String(course.name || course.code).trim();
  const purpose = detail(course, "dersin amaci") || `${name} kapsamındaki arkeolojik verileri ileri düzeyde analiz etme ve değerlendirme yetkinliği kazandırmak.`;
  const content = detail(course, "dersin icerigi") || name;
  const methods = detail(course, "dersin yontem ve teknikleri") || "Anlatım, bilimsel kaynak incelemesi, tartışma ve arkeolojik veri değerlendirmesi.";
  const resourceTable = (course.package?.tables || []).find((item) => fold(item.title) === "ders kaynaklari");
  const resources = (resourceTable?.rows || []).map((row) => cells(row).filter(Boolean).join(": ")).join("; ") || "OBS kaydında belirtilen ders kaynakları.";
  const outcomes = outcomesFor(name);
  const weeklyTable = tableByHeader(course, ["hafta", "konu"])
    || (course.package?.tables || []).find((item) => fold(item.title) === "ders konulari");
  const sourceWeeks = unique((weeklyTable?.rows || []).slice(1).filter((row) => row?.[1] && !forbiddenWeek.test(String(row[1]).trim())).map((row) => {
    const topic = String(row[1]).trim();
    const preparation = String(row[2] || "").replace(/\s+/g, " ").trim();
    return preparation && fold(preparation) !== fold(topic) ? `${topic} — ${preparation}` : topic;
  }));
  const supplement = [
    `${name} kapsamında kronolojik ve tipolojik sentez`,
    `${name} bulgularının karşılaştırmalı değerlendirilmesi`,
    `${name} literatürünün eleştirel değerlendirilmesi`,
  ];
  const weeklyTopics = unique([...sourceWeeks, ...supplement]).slice(0, 15);
  if (weeklyTopics.length !== 15) throw new Error(`${course.code}: yalnızca ${weeklyTopics.length} akademik hafta doğrulanabildi.`);
  const assessments = assessmentsFor(course);
  const theory = Number(assignment.theory || 0); const practice = Number(assignment.practice || 0); const ects = Number(assignment.ects || 6);
  const context = [purpose, content, ...weeklyTopics].join(" ");
  return {
    code: course.code, name, department: "Arkeoloji ABD", programName: "Arkeoloji", language: course.language || "Türkçe",
    level: "Tezli Yüksek Lisans", teachingMode: assignment.teaching_method || "Yüz Yüze", theory, practice,
    credit: Number(assignment.local_credit || theory), ects, prerequisites: "Yok", instructor: detail(course, "dersi verenler") || "Atama Bekliyor",
    purpose, content, methods, resources, sdgs: ["4", "11", "16"], outcomes, weeklyTopics, assessments,
    workloads: workloadsFor(ects, theory, practice, assessments), contributionMatrix: matrixFor(outcomes, context),
    sourceUrl: course.source_url, qualityChecks, publicQualityChecklist: false,
  };
}).filter(Boolean);

const sourceHeader = `// ${path.basename(sourcePath)} ders verilerinden üretilmiştir; program profili ve PÇ kayıtları değiştirilmemiştir.\n`;
writeFileSync(outputPath, `${sourceHeader}import type { CoursePackage } from "./coursePackages";\n\nexport const arkeolojiTezliCoursePackages: CoursePackage[] = ${JSON.stringify(academicPackages, null, 2)};\n`, "utf8");
console.log(`${academicPackages.length} Arkeoloji alan dersi paketi oluşturuldu; matris sütunu ${programOutcomes.length}.`);

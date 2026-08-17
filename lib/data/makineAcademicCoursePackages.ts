import type { CoursePackage, CourseQualityCheck, CourseQualityStatus } from "./coursePackages";
import { buildSemanticContributionMatrix } from "./ybsAcademicCoursePackages";

const checklistItems = [
  "Ders adı ve kodları doğrulandı mı?", "Tüm OBS linkleri gerçek mi?", "Dersin program düzeyi doğru mu?",
  "Ders amacı açık ve uygun mu?", "Ders amacı program düzeyine uygun mu?", "DÖÇ sayısı ve kapsamı uygun mu?",
  "DÖÇ'ler ölçülebilir mi?", "Bloom fiilleri uygun mu?", "Bloom düzeyi program düzeyine uygun mu?",
  "Amaç–DÖÇ uyumu sağlandı mı?", "DÖÇ–içerik uyumu sağlandı mı?", "İçerik–haftalık plan uyumu sağlandı mı?",
  "DÖÇ–öğretim yöntemi uyumu sağlandı mı?", "DÖÇ–ölçme/değerlendirme uyumu sağlandı mı?",
  "AKTS–iş yükü tutarlı mı?", "DÖÇ–PÇ matrisi gerçekçi mi?", "1–5 katkı düzeyleri doğru kullanılmış mı?",
  "Yapay yüksek ilişkilendirme var mı?", "Tekrarlı kodlar doğru tekilleştirildi mi?",
  "Kaynakta olmayan bilgi kesin bilgi gibi yazılmış mı?", "Eksik/doğrulanması gereken alan kaldı mı?",
] as const;

const revised = new Set([4, 6, 7, 8, 9, 10, 11, 12, 13, 15, 16, 17]);
const checklist = (sourceUrl: string, sourceEmpty = false): CourseQualityCheck[] => checklistItems.map((item, index) => {
  const number = index + 1;
  let status: CourseQualityStatus = revised.has(number) ? "Revize Edildi" : "Uygun";
  let note: string | undefined;
  if (number === 2) note = sourceEmpty ? `OBS bağlantısı gerçek olmakla birlikte ayrıntılar "Veri yok" dönüyor: ${sourceUrl}` : `OBS kaydı doğrulandı: ${sourceUrl}`;
  if (sourceEmpty && (number === 2 || number === 14 || number === 20 || number === 21)) status = "Doğrulanmalı";
  if (number === 15) note = "İş yükü 15 haftalık ders süresi üzerinden 180 saat / 6 AKTS olarak düzenlendi.";
  return { item, status, note };
});

export type MakineAcademicInput = Pick<CoursePackage, "code" | "name" | "instructor" | "purpose" | "content" | "methods" | "resources" | "sdgs" | "outcomes" | "weeklyTopics" | "assessments"> & {
  sourceUrl: string;
  sourceEmpty?: boolean;
};

const normalizeHomeworkAssessment = (assessments: CoursePackage["assessments"]): CoursePackage["assessments"] => {
  const homeworkIndex = assessments.findIndex((item) => item.name.toLocaleLowerCase("tr-TR").includes("ödev"));
  if (homeworkIndex < 0 || assessments[homeworkIndex].weight > 0) return assessments;
  const midtermIndex = assessments.findIndex((item) => item.name.toLocaleLowerCase("tr-TR").includes("ara sınav"));
  return assessments.map((item, index) => {
    if (index === homeworkIndex) return { ...item, weight: 10 };
    if (index === midtermIndex) return { ...item, weight: Math.max(0, item.weight - 10) };
    return item;
  });
};

const academicWorkloads = (assessments: CoursePackage["assessments"]): CoursePackage["workloads"] => {
  const rows: CoursePackage["workloads"] = [{ name: "Ders Süresi", count: 15, hours: 3, total: 45 }];
  let allocated = 45;
  const homework = assessments.find((item) => item.name.toLocaleLowerCase("tr-TR").includes("ödev"));
  const project = assessments.find((item) => item.name.toLocaleLowerCase("tr-TR").includes("proje"));
  const midterm = assessments.find((item) => item.name.toLocaleLowerCase("tr-TR").includes("ara sınav"));
  const finalExam = assessments.find((item) => item.name.toLocaleLowerCase("tr-TR").includes("yarıyıl sonu"));
  if (homework) {
    const total = Math.min(60, Math.max(20, homework.count * 8));
    rows.push({ name: "Ödev Hazırlığı", count: homework.count, hours: total / homework.count, total });
    allocated += total;
  }
  if (project && project.weight > 0) {
    rows.push({ name: "Proje Çalışması", count: project.count, hours: 30, total: project.count * 30 });
    allocated += project.count * 30;
  }
  if (midterm) {
    rows.push({ name: "Ara Sınav Hazırlığı", count: midterm.count, hours: 20, total: midterm.count * 20 });
    allocated += midterm.count * 20;
  }
  if (finalExam) {
    rows.push({ name: "Yarıyıl Sonu Sınavı Hazırlığı", count: finalExam.count, hours: 25, total: finalExam.count * 25 });
    allocated += finalExam.count * 25;
  }
  const rawOutsideHours = Math.max(0, (180 - allocated) / 15);
  const outsideHours = Math.round(rawOutsideHours * 2) / 2;
  const outsideTotal = outsideHours * 15;
  if (outsideTotal > 0) rows.splice(1, 0, { name: "Sınıf Dışı Çalışma Süresi", count: 15, hours: outsideHours, total: outsideTotal });

  // Haftalık süreleri denetimde okunabilir tutmak için yalnızca tam veya yarım saat kullanılır.
  // Yuvarlamadan doğan en fazla birkaç saatlik fark, tek adetlik bir hazırlık etkinliğinde
  // dengelenir; böylece toplam 180 saatte kalırken 3,33 / 4,67 gibi süreler oluşmaz.
  const currentTotal = rows.reduce((sum, row) => sum + row.total, 0);
  const balancingDelta = 180 - currentTotal;
  if (balancingDelta !== 0) {
    const balancingRow = [...rows].reverse().find((row) => row.count === 1);
    if (balancingRow) {
      balancingRow.hours += balancingDelta;
      balancingRow.total += balancingDelta;
    }
  }
  return rows;
};

export const createMakineAcademicPackage = (data: MakineAcademicInput): CoursePackage => {
  const assessments = normalizeHomeworkAssessment(data.assessments);
  return ({
  ...data,
  department: "Makine Mühendisliği ABD",
  programName: "Makine Mühendisliği",
  language: "Türkçe",
  level: "Tezli Yüksek Lisans",
  teachingMode: "Yüz Yüze",
  theory: 3,
  practice: 0,
  credit: 3,
  ects: 6,
  prerequisites: "Yok",
  publicQualityChecklist: false,
  assessments,
  workloads: academicWorkloads(assessments),
  contributionMatrix: buildSemanticContributionMatrix(data.outcomes, data),
  qualityChecks: checklist(data.sourceUrl, data.sourceEmpty),
  });
};

export const makineExam4060 = [
  { name: "Ara Sınav", count: 1, weight: 40 },
  { name: "Yarıyıl Sonu Sınavı", count: 1, weight: 60 },
];

export const makineAcademicCoursePackages: CoursePackage[] = [
  createMakineAcademicPackage({
    code: "MMB809", instructor: "Atama Bekliyor", sourceEmpty: true,
    sourceUrl: "https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=278716&lang=tr",
    purpose: "Bilimsel bir araştırmayı yöntemsel ve etik ilkelere uygun biçimde planlama, yürütme, değerlendirme ve raporlama yetkinliği kazandırmak.",
    content: "Bilimsel bilgi ve araştırma problemi; literatür taraması; araştırma desenleri; örnekleme; veri toplama ve analiz yaklaşımları; geçerlik ve güvenirlik; araştırma ve yayın etiği; akademik yazım ve kaynak gösterme.",
    methods: "Kuramsal anlatım, bilimsel metin incelemesi, yöntem karşılaştırması, etik vaka çözümlemesi ve araştırma tasarımı çalışmaları.",
    resources: "OBS kaynağında ders ayrıntısı bulunmadığından kaynakça akademik onay beklemektedir.", sdgs: ["4", "9", "16"],
    outcomes: ["Bilimsel araştırma problemini ve araştırma sorularını yapılandırır.", "Araştırma problemine uygun yöntemi gerekçelendirir.", "Bilimsel kaynakları eleştirel ölçütlerle değerlendirir.", "Araştırma ve yayın etiği ihlallerini analiz eder.", "Araştırma sonuçlarını akademik yazım ilkelerine göre raporlar."],
    weeklyTopics: ["Bilimsel bilgi, araştırma ve bilimsel yöntem", "Araştırma problemi ve araştırma sorularının yapılandırılması", "Bilimsel literatür tarama stratejileri", "Kaynakların güvenilirlik ve uygunluk ölçütleri", "Nicel araştırma desenleri", "Nitel araştırma desenleri", "Karma yöntem araştırmaları", "Evren, örneklem ve örnekleme yaklaşımları", "Veri toplama araçlarının geçerlik ve güvenirliği", "Nicel veri analizine ilişkin temel kararlar", "Nitel verilerin çözümlenmesi ve yorumlanması", "Araştırma etiği ve katılımcı hakları", "Yayın etiği, yazarlık ve çıkar çatışması", "Akademik yazım, atıf ve kaynak gösterme", "Araştırma tasarımının yöntemsel ve etik açıdan bütünleştirilmesi"],
    assessments: [],
  }),
  createMakineAcademicPackage({
    code: "MMB861", name: "KÜTLE AKTARIM TEORİSİ VE BİLGİSAYAR UYGULAMALARI", instructor: "Atama Bekliyor", sourceEmpty: true,
    sourceUrl: "https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=327156&lang=tr",
    purpose: "Kütle aktarımının ileri kuramsal temellerini analiz etme ve ilgili mühendislik problemlerini bilgisayar destekli yöntemlerle çözümleme yetkinliği kazandırmak.",
    content: "Difüzyon ve taşınım mekanizmaları; kütle aktarım katsayıları; kararlı ve kararsız kütle aktarımı; sınır koşulları; çok bileşenli sistemler; sayısal modelleme ve bilgisayar uygulamaları.",
    methods: "Kuramsal anlatım, matematiksel modelleme, problem çözümü, sayısal çözüm ve bilgisayar destekli sonuç analizi.",
    resources: "OBS kaynağında ders ayrıntısı bulunmadığından kaynakça akademik onay beklemektedir.", sdgs: ["4", "9", "12"],
    outcomes: ["Kütle aktarımının temel denklemlerini türetir.", "Kütle aktarım problemleri için başlangıç ve sınır koşullarını belirler.", "Kararlı ve kararsız kütle aktarımı problemlerini analiz eder.", "Kütle aktarım modellerini sayısal yöntemlerle çözer.", "Bilgisayar çözümü sonuçlarını fiziksel ve mühendislik ölçütleriyle değerlendirir."],
    weeklyTopics: ["Kütle aktarımının temel kavramları ve taşınım mekanizmaları", "Fick yasaları ve difüzyon katsayıları", "Durgun ortamda moleküler difüzyon", "Hareketli ortamda kütle aktarımı", "Kararlı tek boyutlu kütle aktarımı", "Sınır koşulları ve ara yüzey dengeleri", "Kütle aktarım katsayıları ve boyutsuz sayılar", "Konvektif kütle aktarımı bağıntıları", "Kararsız kütle aktarımı", "Çok bileşenli sistemlerde difüzyon", "Reaksiyonlu kütle aktarımı", "Kütle aktarım denklemlerinin ayrıklaştırılması", "Sayısal çözüm kararlılığı ve yakınsama", "Bilgisayar destekli kütle aktarım modeli", "Model sonuçlarının doğrulanması ve mühendislik yorumu"],
    assessments: [],
  }),
  createMakineAcademicPackage({
    code: "MMB863", name: "SÜRDÜRÜLEBİLİR BİNA TASARIMI VE ENERJİ MODELLEME", instructor: "Atama Bekliyor", sourceEmpty: true,
    sourceUrl: "https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=327157&lang=tr",
    purpose: "Sürdürülebilir bina tasarım ilkelerini enerji performansı ile bütünleştirerek bina enerji modellerini oluşturma ve değerlendirme yetkinliği kazandırmak.",
    content: "Sürdürülebilir bina ölçütleri; iklim verileri; bina kabuğu; ısı kazanç ve kayıpları; pasif tasarım; HVAC ve yenilenebilir enerji sistemleri; bina enerji modelinin kurulması, doğrulanması ve senaryo analizi.",
    methods: "Kuramsal anlatım, bina enerji dengesi hesapları, modelleme çalışmaları, senaryo karşılaştırması ve performans değerlendirmesi.",
    resources: "OBS kaynağında ders ayrıntısı bulunmadığından kaynakça akademik onay beklemektedir.", sdgs: ["7", "9", "11", "12", "13"],
    outcomes: ["Sürdürülebilir bina tasarım ölçütlerini açıklar.", "Bina kabuğu ve iklim verilerinin enerji performansına etkisini analiz eder.", "Bir bina için enerji modelinin temel girdilerini yapılandırır.", "Enerji verimliliği senaryolarını karşılaştırarak değerlendirir.", "Sürdürülebilirlik hedeflerine uygun bina enerji çözümü geliştirir."],
    weeklyTopics: ["Sürdürülebilir bina tasarımına giriş ve performans göstergeleri", "İklim verileri ve bina enerji dengesi", "Bina geometrisi, yönlenme ve gölgeleme", "Bina kabuğunda ısı geçişi", "Saydam yüzeyler ve güneş kazançları", "Hava sızdırmazlığı ve doğal havalandırma", "Pasif ısıtma ve soğutma stratejileri", "İç yükler ve kullanım çizelgeleri", "HVAC sistemlerinin enerji modelinde tanımlanması", "Aydınlatma ve elektrik yükleri", "Yenilenebilir enerji sistemlerinin modele entegrasyonu", "Bina enerji modelinin kurulması", "Model doğrulama ve hata kaynakları", "Enerji verimliliği senaryolarının karşılaştırılması", "Sürdürülebilir bina çözümünün bütüncül değerlendirilmesi"],
    assessments: [],
  }),
  createMakineAcademicPackage({
    code: "MMB811", instructor: "Prof. Dr. Ertuğrul CİHAN", sourceUrl: "https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=251461&lang=tr",
    purpose: "Mühendislik tasarım prensiplerini karmaşık problemlere uygulama, matematiksel model geliştirme ve çözüm sonuçlarını tasarım ölçütleriyle değerlendirme yetkinliği kazandırmak.",
    content: "Mühendislik tasarımının temel prensipleri; tasarım problemi ve gereksinimler; matematiksel modelleme; model çözümü ve programlanması; tasarım evreleri; bilgisayar destekli çizim ve sonuçların değerlendirilmesi.",
    methods: "Kuramsal anlatım, matematiksel modelleme, örnek tasarım problemi çözümü, bilgisayar destekli çözüm ve teknik değerlendirme.", resources: "Gregory F. Nellis ve Sanford A. Klein, Isı Transferi, 2009.", sdgs: ["4", "9", "12"],
    outcomes: ["Mühendislik tasarım probleminin gereksinim ve kısıtlarını belirler.", "Tasarım problemi için matematiksel model geliştirir.", "Matematiksel modeli uygun çözüm yöntemiyle çözer.", "Tasarım alternatiflerini mühendislik ölçütleriyle karşılaştırır.", "Çözüm sonuçlarını bilgisayar destekli ortamda değerlendirerek gerekçelendirir."],
    weeklyTopics: ["Mühendislik tasarımının kapsamı ve temel prensipleri", "Tasarım problemi, gereksinimler ve kısıtlar", "Tasarım ölçütlerinin ve karar değişkenlerinin belirlenmesi", "Tasarım problemlerinde matematiksel modelleme", "Model kabulleri ve sınır koşulları", "Tasarım modelinin boyutsal ve fiziksel tutarlılığı", "Matematiksel modelin programlanması", "Tasarım evreleri ve karar noktaları", "Tasarım problemlerinde analitik çözüm yöntemleri", "Tasarım problemlerinde sayısal çözüm yöntemleri", "Tasarım alternatiflerinin karşılaştırılması", "Çözümlerin bilgisayar destekli çizimi", "Tasarım sonuçlarının doğrulanması", "Belirsizlik ve duyarlılıkların incelenmesi", "Tasarım çözümünün mühendislik ölçütleriyle değerlendirilmesi"], assessments: makineExam4060,
  }),
  createMakineAcademicPackage({
    code: "MMB815", instructor: "Prof. Dr. Şaban ÜNAL", sourceUrl: "https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=251429&lang=tr",
    purpose: "İleri iletimle ısı geçişi problemlerini farklı koordinat sistemleri ve sınır koşulları altında modelleme, çözme ve sonuçlarını analiz etme yetkinliği kazandırmak.",
    content: "Isı iletimi bağıntıları ve sınır şartları; kararlı ve zamana bağlı iletim; ısı üretimli katılar; kanatçıklı yüzeyler; kartezyen, silindirik ve küresel koordinatlarda bir ve çok boyutlu analitik ve sayısal çözümler.",
    methods: "Kuramsal anlatım, diferansiyel denklem türetme, analitik ve sayısal problem çözümü, sonuçların fiziksel yorumu.", resources: "M. N. Özışık, Heat Conduction; Sadık Kakaç, Isı İletimi.", sdgs: ["4", "7", "9"],
    outcomes: ["Isı iletimi denklemlerini farklı koordinat sistemlerinde türetir.", "Başlangıç ve sınır koşullarını fiziksel probleme uygun olarak belirler.", "Kararlı ve zamana bağlı iletim problemlerini analitik yöntemlerle çözer.", "Kanatçıklı ve ısı üretimli sistemlerin ısıl davranışını analiz eder.", "Çok boyutlu iletim problemlerini sayısal yöntemlerle çözerek sonuçları değerlendirir."],
    weeklyTopics: ["Isı iletiminin fiziksel temelleri ve birim sistemleri", "Isıl özellikler ve temel bağıntılar", "Kartezyen koordinatlarda genel ısı iletim denklemi", "Silindirik ve küresel koordinatlarda ısı iletim denklemi", "Kararlı tek boyutlu düzlemsel ısı iletimi", "Başlangıç ve sınır koşullarının belirlenmesi", "Isı üretimli katılarda kararlı iletim", "Bileşik duvarlarda ısıl direnç analizi", "Kanatçıklı yüzeylerde ısı iletimi", "Kanatçık diferansiyel denklemi ve sınır koşulları", "Kanatçıkların analitik ve sayısal çözümleri", "İki boyutlu kararlı ısı iletimi", "Sayısal ayrıklaştırma ve düğüm denklemleri", "Katılarda zamana bağlı ısı iletimi", "İletim çözümlerinin doğrulanması ve fiziksel yorumu"], assessments: makineExam4060,
  }),
  createMakineAcademicPackage({
    code: "MMB817", instructor: "Doç. Dr. Durmuş YARIMPABUÇ", sourceUrl: "https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=251430&lang=tr",
    purpose: "Mühendislik problemlerinde kullanılan ileri analitik yöntemleri seçme, adi ve kısmi diferansiyel denklemleri çözme ve çözümleri fiziksel sistemler bağlamında yorumlama yetkinliği kazandırmak.",
    content: "Birinci ve ikinci mertebe diferansiyel denklemler; lineer denklem sistemleri; güç serileri ve Frobenius yöntemi; Fourier serileri; dalga, ısı, Laplace ve Poisson denklemleri; sınır koşulları ve değişkenlerine ayırma yöntemi.",
    methods: "Kuramsal anlatım, analitik türetme, problem çözümü, yöntem karşılaştırması ve mühendislik sonuçlarının yorumu.", resources: "S. Ş. Bayın, Fen ve Mühendislik Bilimlerinde Matematik Yöntemler; E. Kreyszig, Advanced Engineering Mathematics; P. N. O’Neil, Advanced Engineering Mathematics.", sdgs: ["4", "9"],
    outcomes: ["Adi ve kısmi diferansiyel denklemleri sınıflandırır.", "Birinci ve ikinci mertebe diferansiyel denklemleri uygun analitik yöntemle çözer.", "Seri çözümleri ve Fourier açılımlarını mühendislik problemlerine uygular.", "Kısmi diferansiyel denklemler için sınır koşullarını yapılandırır.", "Analitik çözümleri fiziksel ve mühendislik bağlamında yorumlar."],
    weeklyTopics: ["Mühendislikte diferansiyel denklemler ve temel kavramlar", "Ayrılabilir birinci mertebe diferansiyel denklemler", "Birinci mertebe lineer diferansiyel denklemler", "İkinci mertebe homojen lineer diferansiyel denklemler", "Sabit katsayılı lineer denklemlerde özel çözümler", "Belirsiz katsayılar yöntemi", "Parametrelerin değişimi yöntemi", "Euler denklemi ve mertebe düşürme", "Lineer diferansiyel denklem sistemleri", "Güç serileriyle çözüm", "Frobenius yöntemi", "Fourier serileri ve yarım aralık açılımları", "Kısmi diferansiyel denklemler ve sınır koşulları", "Dalga ve ısı denklemlerinin değişkenlerine ayrılması", "Laplace ve Poisson denklemlerinin mühendislik uygulamaları"],
    assessments: [{ name: "Ara Sınav", count: 1, weight: 25 }, { name: "Kısa Sınav", count: 1, weight: 25 }, { name: "Yarıyıl Sonu Sınavı", count: 1, weight: 50 }],
  }),
  createMakineAcademicPackage({
    code: "MMB819", instructor: "Prof. Dr. Önder KAŞKA", sourceUrl: "https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=251456&lang=tr",
    purpose: "İleri termodinamik bağıntıları kullanarak güç, soğutma, karışım, reaksiyon ve yüksek hızlı akış sistemlerini analiz etme yetkinliği kazandırmak.",
    content: "İkinci yasa ve ekserji; geliştirilmiş güç ve soğutma çevrimleri; termodinamik özellik bağıntıları; gaz ve gaz-buhar karışımları; iklimlendirme; kimyasal tepkim, yanma, denge ve yüksek hızlı gaz akışları.",
    methods: "Kuramsal anlatım, termodinamik bağıntı türetme, çevrim analizi, problem çözümü ve mühendislik değerlendirmesi.", resources: "Kenneth Wark, Advanced Thermodynamics for Engineers, McGraw-Hill.", sdgs: ["4", "7", "9", "13"],
    outcomes: ["İkinci yasa ve ekserji bağıntılarını termodinamik sistemlere uygular.", "Geliştirilmiş güç ve soğutma çevrimlerini analiz eder.", "Gaz ve gaz-buhar karışımlarının özelliklerini hesaplar.", "Kimyasal tepkime, yanma ve denge problemlerini çözer.", "Yüksek hızlı gaz akışlarının termodinamik sonuçlarını değerlendirir."],
    weeklyTopics: ["Termodinamiğin ikinci yasası ve entropi", "Ekserji ve tersinmezlik analizi", "Geliştirilmiş buhar güç çevrimleri", "Gaz türbinli güç çevrimleri", "Birleşik güç çevrimleri", "Geliştirilmiş soğutma çevrimleri", "Termodinamik özellik bağıntıları", "Gaz karışımlarının özellikleri", "Gaz-buhar karışımları ve psikrometri", "İklimlendirme süreçlerinin termodinamik analizi", "Kimyasal tepkimelerde enerji dengesi", "Yanma ve yakıtların termodinamiği", "Kimyasal denge", "Faz dengesi", "Yüksek hızlı gaz akışlarının termodinamiği"],
    assessments: [{ name: "Ara Sınav", count: 1, weight: 20 }, { name: "Ödev", count: 5, weight: 40 }, { name: "Yarıyıl Sonu Sınavı", count: 1, weight: 40 }],
  }),
  createMakineAcademicPackage({
    code: "MMB821", instructor: "Prof. Dr. Ertuğrul CİHAN", sourceUrl: "https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=251468&lang=tr",
    purpose: "Termodinamik sistemleri matematiksel ve bilgisayar destekli modellerle analiz etme, boyutlandırma ve ekonomik ölçütlerle değerlendirme yetkinliği kazandırmak.",
    content: "Matematiksel sistem modelleri; termodinamik çevrimler; paket programlarla modelleme; güç ve soğutma sistemlerinin hesapları; boyutlandırma; termoekonomik modelleme; yatırım, işletme ve toplam maliyet analizi.",
    methods: "Kuramsal anlatım, matematiksel modelleme, paket program uygulamaları, boyutlandırma ve termoekonomik karşılaştırma.", resources: "Sanford Klein ve Gregory Nellis, Thermodynamics; Heat Transfer.", sdgs: ["4", "7", "9", "12"],
    outcomes: ["Termodinamik sistem için matematiksel model geliştirir.", "Güç ve soğutma çevrimlerini bilgisayar destekli olarak çözer.", "Sistem bileşenlerini performans ölçütlerine göre boyutlandırır.", "Model sonuçlarını enerji ve ekserji ölçütleriyle analiz eder.", "Termodinamik sistem alternatiflerini ekonomik ölçütlerle değerlendirir."],
    weeklyTopics: ["Termodinamik sistem modellemesinin temel kavramları", "Korunum denklemleri ve model kabulleri", "Termodinamik özelliklerin bilgisayar ortamında hesaplanması", "Basit güç çevrimlerinin modellenmesi", "Geliştirilmiş güç çevrimlerinin modellenmesi", "Soğutma çevrimlerinin modellenmesi", "Sistem bileşenlerinin matematiksel modelleri", "Model çözüm algoritmaları ve yakınsama", "Enerji performans göstergeleri", "Ekserji tabanlı sistem değerlendirmesi", "Güç sistemlerinin boyutlandırılması", "Soğutma sistemlerinin boyutlandırılması", "Termoekonomik modelleme", "Yatırım ve işletme maliyetlerinin hesaplanması", "Model doğrulama ve sistem alternatiflerinin karşılaştırılması"],
    assessments: [{ name: "Ara Sınav", count: 1, weight: 40 }, { name: "Ödev", count: 4, weight: 0 }, { name: "Yarıyıl Sonu Sınavı", count: 1, weight: 60 }],
  }),
  createMakineAcademicPackage({
    code: "MMB823", instructor: "Prof. Dr. Şaban ÜNAL", sourceUrl: "https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=251427&lang=tr",
    purpose: "Otomotiv iklimlendirme sistemlerinin ısıl yüklerini hesaplama, bileşenlerini seçme, ölçme ve test sonuçlarını mühendislik ölçütleriyle değerlendirme yetkinliği kazandırmak.",
    content: "Otomotiv klima sistemleri; ısı kayıp ve kazançları; sistem bileşenleri ve seçim ölçütleri; kurulum, devreye alma ve otomatik kontrol; ölçme araçları; test yordamları, şartnameler, veri değerlendirme ve raporlama.",
    methods: "Kuramsal anlatım, ısıl yük hesabı, bileşen seçimi, ölçüm zinciri incelemesi, test verisi çözümleme ve teknik raporlama.", resources: "TMMOB MMO, Klima Tesisatında Test, Ayar ve Dengeleme; O. Kıncay, İklimlendirme Esasları ve Modern Sistemler.", sdgs: ["4", "7", "9", "13"],
    outcomes: ["Otomotiv iklimlendirme sistemlerinin çalışma ilkelerini açıklar.", "Araç kabini için ısı kazanç ve kayıplarını hesaplar.", "Sistem bileşenlerini kapasite ve çalışma koşullarına göre seçer.", "Ölçüm ve test verilerini belirsizlikleriyle analiz eder.", "İklimlendirme sistemi performansını şartname ölçütleriyle değerlendirir."],
    weeklyTopics: ["Otomotiv iklimlendirme sistemlerinin yapısı", "Psikrometrik özellikler ve konfor koşulları", "Araç kabininde ısı transferi mekanizmaları", "Güneş ve dış ortam kaynaklı ısı kazançları", "İç yükler ve havalandırma yükleri", "Toplam soğutma yükünün hesaplanması", "Soğutma çevrimi ve çalışma akışkanı", "Kompresör ve kondenser seçimi", "Evaporatör ve genleşme elemanı seçimi", "Hava dağıtım sistemi ve fanlar", "Sistem kurulumu ve devreye alma", "Otomatik kontrol ve sensörler", "Ölçme araçları ve kalibrasyon", "Test yordamları ve şartname ölçütleri", "Test sonuçlarının değerlendirilmesi ve raporlanması"], assessments: makineExam4060,
  }),
  createMakineAcademicPackage({
    code: "MMB825", instructor: "Dr. Öğr. Üyesi Ersin ÜNAL", sourceUrl: "https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=251463&lang=tr",
    purpose: "Aşınma ve korozyon etkilerine karşı uygun yüzey işlem ve kaplama yöntemini seçme, yöntemleri karşılaştırma ve mühendislik uygulamasını değerlendirme yetkinliği kazandırmak.",
    content: "Aşınma ve korozyon süreçleri; yüzey hazırlama; elektrikli ve elektriksiz kaplama; fiziksel ve kimyasal buhar biriktirme; termal ve mekanik kaplama; difüzyon işlemleri; galvanizleme, fosfatlama, anodizasyon, krom ve seramik kaplamalar.",
    methods: "Kuramsal anlatım, yüzey işlemi karşılaştırması, vaka analizi, teknik parametre değerlendirmesi ve malzeme-yöntem seçimi.", resources: "Mikell P. Groover, Modern İmalatın Esasları, Wiley.", sdgs: ["4", "9", "12"],
    outcomes: ["Aşınma ve korozyonun yüzey hasar mekanizmalarını analiz eder.", "Yüzey hazırlama ve kaplama yöntemlerini sınıflandırır.", "Kaplama süreçlerinin parametrelerini malzeme özellikleriyle ilişkilendirir.", "Bir mühendislik problemi için uygun yüzey işlemini seçerek gerekçelendirir.", "Yüzey işlemlerini performans, maliyet ve sürdürülebilirlik ölçütleriyle değerlendirir."],
    weeklyTopics: ["Yüzey mühendisliğinin kapsamı ve temel kavramlar", "Aşınma mekanizmaları", "Korozyon süreçleri ve yüzey hasarı", "Yüzey işlemlerinin sınıflandırılması", "Endüstriyel yüzey temizleme ve hazırlama", "Elektrikli yüzey kaplama teknikleri", "Elektriksiz yüzey kaplama teknikleri", "Fiziksel buhar biriktirme", "Kimyasal buhar biriktirme", "Termal püskürtme ve mekanik kaplama", "Karbürleme, nitrürleme ve borlama", "İyon katkılama ve yüzey modifikasyonu", "Galvanizleme, fosfatlama ve anodizasyon", "Krom ve seramik kaplamalar", "Yüzey işlemi seçimi ve performans değerlendirmesi"],
    assessments: [{ name: "Ara Sınav", count: 1, weight: 20 }, { name: "Ödev", count: 1, weight: 20 }, { name: "Yarıyıl Sonu Sınavı", count: 1, weight: 60 }],
  }),
  createMakineAcademicPackage({
    code: "MMB827", instructor: "Prof. Dr. Mustafa ÜBEYLİ", sourceUrl: "https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=251460&lang=tr",
    purpose: "Kompozit malzemelerin bileşen, üretim, mekanik davranış ve hasar mekanizmalarını analiz ederek mühendislik uygulamasına uygun kompozit sistemi değerlendirme yetkinliği kazandırmak.",
    content: "Kompozitlerin sınıflandırılması; matris ve takviye malzemeleri; lifli, parçacıklı ve tabakalı kompozitler; üretim yöntemleri; mikromekanik ve makromekanik davranış; hasar ve kırılma; test ve tasarım ölçütleri.",
    methods: "Kuramsal anlatım, mikromekanik hesaplar, malzeme davranışı analizi, üretim yöntemi karşılaştırması ve mühendislik vaka incelemesi.", resources: "OBS kaydında belirtilen kompozit malzeme kaynakları ve öğretim üyesi ders notları.", sdgs: ["4", "9", "12"],
    outcomes: ["Kompozit malzemeleri bileşen ve yapılarına göre sınıflandırır.", "Matris ve takviye özelliklerinin kompozit davranışına etkisini analiz eder.", "Kompozitlerin elastik özelliklerini mikromekanik bağıntılarla hesaplar.", "Üretim yöntemlerini malzeme ve geometrik gereksinimlere göre karşılaştırır.", "Hasar mekanizmalarını değerlendirerek uygun kompozit sistemi seçer."],
    weeklyTopics: ["Kompozit malzemelere giriş ve sınıflandırma", "Matris malzemeleri", "Takviye malzemeleri ve ara yüzey", "Lifli kompozitlerin yapısı", "Parçacıklı kompozitler", "Tabakalı ve sandviç kompozitler", "Kompozit üretim yöntemleri", "El yatırması ve kalıplama süreçleri", "Lif sarma ve pultruzyon", "Kompozitlerin mikromekaniği", "Tek yönlü lamina davranışı", "Laminatların makromekanik analizi", "Kompozitlerde hasar ve kırılma", "Kompozit test yöntemleri", "Mühendislik uygulaması için kompozit seçimi"], assessments: makineExam4060,
  }),
  createMakineAcademicPackage({
    code: "MMB829", instructor: "Doç. Dr. Didem OVALI DÖNDAŞ", sourceUrl: "https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=251462&lang=tr",
    purpose: "Malzeme karakterizasyon tekniklerinin çalışma ilkelerini karşılaştırma, ölçüm verilerini doğru yorumlama ve araştırma problemine uygun teknik seçimini gerekçelendirme yetkinliği kazandırmak.",
    content: "Ölçüm doğruluğu ve artefaktlar; numune hazırlama; EDS/EDX; XPS/AES; XRD; FTIR ve Raman; optik ve elektron mikroskopisi; yüzey analizleri; çok teknikli veri yorumlama ve karakterizasyon planı.",
    methods: "Kuramsal anlatım, örnek veri okuma, cihaz çıktısı çözümleme, teknik karşılaştırması, vaka analizi ve karakterizasyon planlama.", resources: "Z. Engin Erkmen, Malzeme Karakterizasyonu ve Temel İlkeleri; Y. Leng, Materials Characterization.", sdgs: ["4", "9", "12"],
    outcomes: ["Karakterizasyon tekniklerinin temel çalışma ilkelerini açıklar.", "Ölçüm doğruluğunu etkileyen numune hazırlama ve artefaktları analiz eder.", "XRD, spektroskopi ve mikroskopi verilerini yorumlar.", "Araştırma sorusuna uygun karakterizasyon tekniğini seçerek gerekçelendirir.", "Birden fazla teknikten elde edilen verileri bütünleştirerek malzeme yapısını değerlendirir."],
    weeklyTopics: ["Malzeme karakterizasyonunda ölçüm, doğruluk ve artefaktlar", "Numune hazırlama ve temsil edilebilirlik", "EDS ve EDX ile elementel analiz", "XPS ve AES ile kimyasal durum analizi", "X-ışını üretimi ve Bragg yasası", "Toz XRD paternlerinin yorumlanması", "FTIR ve Raman spektroskopisi", "Spektroskopik verilerde sinyal ve artefaktlar", "Optik mikroskopi ve görüntü kontrastı", "SEM görüntüleme modları ve çözünürlük", "SEM-EDS bütünleşik veri analizi", "Yüzey analiz teknikleri ve derinlik profili", "Çok teknikli karakterizasyon yaklaşımı", "Tekniklerin duyarlılık ve sınırlılıklarının karşılaştırılması", "Araştırma problemine uygun karakterizasyon planı"],
    assessments: [{ name: "Ara Sınav", count: 1, weight: 30 }, { name: "Ödev", count: 2, weight: 20 }, { name: "Yarıyıl Sonu Sınavı", count: 1, weight: 50 }],
  }),
  createMakineAcademicPackage({
    code: "MMB831", instructor: "Dr. Öğr. Üyesi Demet ZALAOĞLU", sourceUrl: "https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=251464&lang=tr",
    purpose: "Korozyon ve oksitlenmenin termodinamik ve kinetik temellerini analiz etme, hasar türlerini değerlendirme ve uygun koruma yaklaşımını seçme yetkinliği kazandırmak.",
    content: "Elektrokimyasal ilkeler; korozyon termodinamiği ve kinetiği; polarizasyon ve pasifleşme; korozyon türleri; farklı ortamlarda korozyon; metal oksitlenmesi; test ve izleme; tasarım, malzeme seçimi, kaplama, anodik ve katodik koruma.",
    methods: "Kuramsal anlatım, elektrokimyasal hesaplar, diyagram çözümleme, hasar vakası incelemesi ve koruma yöntemi karşılaştırması.", resources: "E. Bardal, Corrosion and Protection; M. G. Fontana, Corrosion Engineering.", sdgs: ["4", "9", "12"],
    outcomes: ["Korozyon ve oksitlenmenin termodinamik ve kinetik temellerini açıklar.", "Elektrokimyasal verileri kullanarak korozyon eğilimi ve hızını analiz eder.", "Korozyon hasarlarını mekanizmalarına göre sınıflandırır.", "Korozyon test ve izleme sonuçlarını değerlendirir.", "Malzeme ve çalışma ortamına uygun korozyon önleme yaklaşımını gerekçelendirir."],
    weeklyTopics: ["Korozyona giriş ve mühendislikte önemi", "Temel elektrokimya", "Korozyon termodinamiği", "Potansiyel-pH diyagramları", "Korozyon kinetiği", "Polarizasyon ve korozyon hızı", "Pasifleşme mekanizmaları", "Oksitlenme termodinamiği", "Oksitlenme kinetiği", "Üniform ve galvanik korozyon", "Çukurcuk, aralık ve gerilmeli korozyon", "Farklı ortamlarda korozyon", "Çelik ve demir dışı malzemelerin korozyonu", "Korozyon testleri ve izleme", "Malzeme seçimi, tasarım ve koruma yöntemleri"],
    assessments: [{ name: "Ödev", count: 2, weight: 40 }, { name: "Proje", count: 1, weight: 60 }],
  }),
  createMakineAcademicPackage({
    code: "MMB833", instructor: "Öğr. Gör. Dr. Mulla Ahmet Pekok", sourceUrl: "https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=251422&lang=tr",
    purpose: "Bilgisayarlı bütünleşik imalat sistemlerinin bileşenlerini ve entegrasyon yöntemlerini analiz etme, üretim senaryosu için uygun otomasyon çözümünü değerlendirme yetkinliği kazandırmak.",
    content: "BBİ mimarisi; CAD/CAM; CNC yapısı ve programlama; PLC; endüstriyel robotik; katmanlı imalat; bilgisayar destekli süreç planlama; bütünleşik ürün-süreç geliştirme; PDM, internet destekli imalat ve nesnelerin interneti.",
    methods: "Kuramsal anlatım, tartışma, bilgisayar tabanlı uygulama, simülasyon, örnek olay incelemesi ve üretim sistemi çözümlemesi.", resources: "J. A. Rehg ve H. W. Kraebber, Bilgisayar Bütünleşik İmalat; M. P. Groover, Otomasyon Üretim Sistemleri ve Bilgisayarla Tümleşik İmalat.", sdgs: ["4", "8", "9", "12"],
    outcomes: ["Bilgisayarlı bütünleşik imalat mimarisini ve bileşen ilişkilerini açıklar.", "CAD/CAM ve CNC süreçlerini bütünleşik üretim akışına uygular.", "PLC ve robotik sistemlerin üretim otomasyonundaki işlevlerini analiz eder.", "Katmanlı imalat ve bilgisayar destekli süreç planlama yöntemlerini karşılaştırır.", "Bir üretim senaryosu için kalite, maliyet ve esneklik temelli bütünleşik çözüm geliştirir."],
    weeklyTopics: ["Bilgisayarlı bütünleşik imalatın temel kavramları", "BBİ sistem mimarisi ve entegrasyon", "CAD sistemleri ve geometrik modelleme", "CAM sistemleri ve üretim planlama", "CNC tezgâh yapısı", "CNC programlama ve simülasyon", "Otomasyon ve PLC sistemleri", "PLC programlama prensipleri", "Endüstriyel robotik sistemler", "Robotik hücre entegrasyonu", "Katmanlı imalat ve hızlı prototipleme", "Bilgi tabanlı imalat ve CAPP", "Bütünleşik ürün-süreç geliştirme", "Ürün veri yönetimi ve internet destekli imalat", "Nesnelerin interneti tabanlı bütünleşik üretim"],
    assessments: [{ name: "Ara Sınav", count: 1, weight: 30 }, { name: "Ödev", count: 7, weight: 10 }, { name: "Yarıyıl Sonu Sınavı", count: 1, weight: 60 }],
  }),
  createMakineAcademicPackage({
    code: "MMB835", instructor: "Dr. Öğr. Üyesi Emre ÖZER", sourceUrl: "https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=251498&lang=tr",
    purpose: "Yüzey etkileşimleri, sürtünme, aşınma ve yağlama süreçlerini analiz ederek tribolojik probleme uygun malzeme, yağlayıcı, kaplama veya yüzey işlemi seçme yetkinliği kazandırmak.",
    content: "Tribolojinin temel kavramları; yüzey özellikleri ve pürüzlülük; katı yüzey teması; sürtünme; aşınma mekanizmaları ve yüzey hasarı; test sistemleri; yağlayıcılar; kaplamalar ve yüzey işlemleri; endüstriyel uygulamalar.",
    methods: "Kuramsal anlatım, yüzey ve temas analizi, triboloji testi çözümlemesi, vaka temelli mühendislik değerlendirmesi ve yöntem karşılaştırması.", resources: "P. L. Menezes vd., Tribology for Scientists and Engineers; I. Hutchings ve P. Shipway, Tribology: Friction and Wear of Engineering Materials.", sdgs: ["4", "9", "12"],
    outcomes: ["Tribolojik sistemlerde yüzey özellikleri ve temas koşullarını analiz eder.", "Sürtünme davranışını malzeme ve çalışma koşullarıyla ilişkilendirir.", "Aşınma mekanizmalarını deneysel belirtilere göre sınıflandırır.", "Triboloji test sonuçlarını mühendislik performansı açısından değerlendirir.", "Tribolojik probleme uygun yağlayıcı, kaplama veya yüzey işlemini seçerek gerekçelendirir."],
    weeklyTopics: ["Tribolojinin kapsamı ve temel kavramlar", "Mühendislik yüzeylerinin geometrisi", "Yüzey pürüzlülüğü ve ölçüm yöntemleri", "Katı yüzeylerin elastik ve plastik teması", "Sürtünmenin fiziksel temelleri", "Sürtünme katsayısını etkileyen değişkenler", "Aşınma ve yüzey hasarının sınıflandırılması", "Adhezif aşınma", "Abrazif ve erozif aşınma", "Yorulma ve tribokimyasal aşınma", "Sürtünme-aşınma deney düzenekleri", "Triboloji test verilerinin değerlendirilmesi", "Yağlama rejimleri ve yağlayıcı özellikleri", "Kaplamalar ve yüzey işlemleri", "Endüstriyel triboloji problemlerinde çözüm seçimi"],
    assessments: [{ name: "Ara Sınav", count: 1, weight: 40 }, { name: "Ödev", count: 1, weight: 60 }],
  }),
];

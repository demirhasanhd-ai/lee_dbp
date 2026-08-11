export type CourseAssessment = { name: string; count: number; weight: number };
export type CourseWorkload = { name: string; count: number; hours: number; total: number };
export type CourseContributionRow = { outcome: string; values: number[] };

export type CoursePackage = {
  code: string;
  language: string;
  level: string;
  teachingMode: string;
  purpose: string;
  content: string;
  methods: string;
  prerequisites: string;
  resources: string;
  outcomes: string[];
  weeklyTopics: string[];
  assessments: CourseAssessment[];
  workloads: CourseWorkload[];
  contributionMatrix: CourseContributionRow[];
};

const ybs919: CoursePackage = {
  code: "YBS919",
  language: "Türkçe",
  level: "Doktora",
  teachingMode: "Yüz Yüze",
  purpose: "İleri yöneylem araştırması tekniklerini analiz ederek karmaşık yönetim ve bilişim karar problemlerine uygun model ve çözüm yaklaşımları geliştirme yetkinliği kazandırmak.",
  content: "Kesirli Programlama, Sezgisel Yöntemler, Bulanık mantık teorisi, Analitik Ağ Süreci (ANP), Analitik Hiyerarşi Süreci (AHP), Veri Zarflama Analizi, Çoklu Parametrik Programlama.",
  methods: "OBS'de mevcut değil / doğrulanamadı.",
  prerequisites: "Yok",
  resources: "Öğretim üyesi tarafından hazırlanan ders notları; Bronson, R. ve Naadimuthu, G., Operations Research, Schaum's Outlines, Second Edition.",
  outcomes: [
    "Karmaşık karar problemlerini doğrusal ve doğrusal olmayan modellerle çözümler.",
    "Optimizasyon modellerinin duyarlılık sonuçlarını analiz eder ve yorumlar.",
    "AHP ve ANP yöntemlerini karar problemlerinde karşılaştırarak uygular.",
    "Veri Zarflama Analiziyle karar birimlerinin göreli etkinliğini değerlendirir.",
    "Probleme uygun sezgisel veya optimizasyon yöntemini seçerek gerekçelendirir.",
  ],
  weeklyTopics: [
    "Giriş",
    "Doğrusal Programlama",
    "Duyarlılık Analizi",
    "Şebeke Modelleri",
    "Doğrusal Olmayan Programlama",
    "Karar Analizi",
    "Kesirli Programlama",
    "Kesirli Programlama",
    "Sezgisel Yöntemler",
    "Sezgisel Yöntemler",
    "Analitik Ağ Süreci",
    "Analitik Hiyerarşik Süreç",
    "Veri Zarflama Analizi",
    "Veri Zarflama Analizi",
  ],
  assessments: [
    { name: "Ara Sınav", count: 1, weight: 40 },
    { name: "Yarıyıl Sonu Sınavı", count: 1, weight: 60 },
  ],
  workloads: [
    { name: "Ders Süresi", count: 14, hours: 3, total: 42 },
    { name: "Sınıf Dışı Çalışma Süresi", count: 14, hours: 6, total: 84 },
    { name: "Ara Sınav", count: 1, hours: 20, total: 20 },
    { name: "Yarıyıl Sonu Sınavı", count: 1, hours: 25, total: 25 },
  ],
  contributionMatrix: [
    { outcome: "DÖÇ1", values: [2, 4, 4, 5, 3, 3, 1, 4, 1, 1, 3] },
    { outcome: "DÖÇ2", values: [3, 3, 3, 5, 4, 3, 1, 3, 1, 2, 3] },
    { outcome: "DÖÇ3", values: [2, 4, 4, 4, 3, 3, 1, 4, 1, 2, 4] },
    { outcome: "DÖÇ4", values: [2, 3, 3, 5, 4, 3, 2, 4, 2, 2, 3] },
    { outcome: "DÖÇ5", values: [3, 4, 5, 4, 4, 4, 2, 4, 2, 3, 4] },
  ],
};

const coursePackages = [ybs919];

export const getCoursePackage = (code: string) =>
  coursePackages.find((coursePackage) => coursePackage.code === code.trim().toLocaleUpperCase("tr-TR"));

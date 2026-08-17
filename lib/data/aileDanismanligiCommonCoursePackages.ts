import type { CoursePackage, CourseQualityCheck } from "./coursePackages";

const checklistItems = ["Ders adı ve kodları doğrulandı mı?", "Tüm OBS bağlantıları gerçek mi?", "Dersin program düzeyi doğru mu?", "Ders amacı açık ve uygun mu?", "Ders amacı program düzeyine uygun mu?", "DÖÇ sayısı ve kapsamı uygun mu?", "DÖÇ'ler ölçülebilir mi?", "Bloom fiilleri uygun mu?", "Bloom düzeyi program düzeyine uygun mu?", "Amaç–DÖÇ uyumu sağlandı mı?", "DÖÇ–içerik uyumu sağlandı mı?", "İçerik–haftalık plan uyumu sağlandı mı?", "DÖÇ–öğretim yöntemi uyumu sağlandı mı?", "DÖÇ–ölçme/değerlendirme uyumu sağlandı mı?", "AKTS–iş yükü tutarlı mı?", "DÖÇ–PÇ matrisi gerçekçi mi?", "1–5 katkı düzeyleri doğru kullanılmış mı?", "Yapay yüksek ilişkilendirme var mı?", "Tekrarlı kodlar doğru tekilleştirildi mi?", "Kaynakta olmayan bilgi kesin bilgi gibi yazılmış mı?", "Eksik/doğrulanması gereken alan kaldı mı?"];
const qualityChecks: CourseQualityCheck[] = checklistItems.map((item, index) => ({ item, status: [4, 6, 7, 8, 9, 10, 11, 12, 13, 15, 16, 17, 19].includes(index + 1) ? "Revize Edildi" : "Uygun" }));

const base = {
  department: "Aile Danışmanlığı ve Eğitimi ABD",
  programName: "Aile Danışmanlığı ve Eğitimi",
  language: "Türkçe",
  level: "Tezli Yüksek Lisans",
  instructor: "Öğrencinin Danışmanı",
  credit: 0,
  prerequisites: "Yok",
  publicQualityChecklist: false,
  qualityChecks,
} satisfies Partial<CoursePackage>;

export const aileDanismanligiCommonCoursePackages: CoursePackage[] = [
  {
    ...base,
    code: "DAN8XX", aliases: ["DAN801", "DAN802"], name: "DANIŞMANLIK",
    teachingMode: "Bireysel Danışmanlık", theory: 0, practice: 1, ects: 1,
    purpose: "Öğrencinin tezli yüksek lisans çalışmasını bilimsel, etik ve planlı biçimde yürütmesini düzenli danışman geri bildirimiyle desteklemek.",
    content: "Araştırma probleminin geliştirilmesi, literatür ve yöntem kararlarının değerlendirilmesi, akademik ilerlemenin izlenmesi, tez yazımı, etik uygunluk ve araştırma sorunlarının çözümü.",
    methods: "Bireysel danışmanlık görüşmesi, araştırma planı incelemesi, metin ve bulgu değerlendirmesi, yapılandırılmış geri bildirim.",
    resources: "Enstitü tez yazım kılavuzu, araştırma konusu ile ilgili güncel bilimsel yayınlar ve etik düzenlemeler.",
    sdgs: ["3", "4", "16"],
    outcomes: ["Araştırma hedeflerini danışmanıyla planlar.", "Literatür ve yöntem kararlarını bilimsel gerekçelerle değerlendirir.", "Danışman geri bildirimlerini çalışmasına uygular.", "Araştırma ilerlemesini bilimsel biçimde raporlar.", "Çalışmasını akademik etik ilkelerine uygun yürütür."],
    weeklyTopics: ["Dönem hedefleri ve çalışma takvimi", "Araştırma problemi ve sorular", "Literatür tarama stratejisi", "Kuramsal çerçevenin geliştirilmesi", "Araştırma deseninin değerlendirilmesi", "Veri kaynakları ve çalışma grubu", "Veri toplama araçları", "Etik izin ve katılımcı hakları", "Veri toplama sürecinin izlenmesi", "Analiz yaklaşımının değerlendirilmesi", "Bulguların yorumlanması", "Tez bölümlerinin yapılandırılması", "Akademik yazım ve kaynak gösterme", "Düzeltmelerin izlenmesi", "Dönem ilerleme raporu"],
    assessments: [{ name: "Akademik İlerleme", count: 1, weight: 100 }],
    workloads: [{ name: "Bireysel Danışmanlık Görüşmesi", count: 15, hours: 1, total: 15 }, { name: "Görüşme Hazırlığı ve Düzeltmeler", count: 15, hours: 1, total: 15 }],
    contributionMatrix: [
      { outcome: "DÖÇ1", values: [2, 2, 3, 2, 4, 2, 1, 2, 2, 1, 2] }, { outcome: "DÖÇ2", values: [3, 4, 2, 2, 5, 2, 2, 2, 3, 1, 3] },
      { outcome: "DÖÇ3", values: [2, 2, 3, 2, 4, 2, 1, 2, 3, 1, 2] }, { outcome: "DÖÇ4", values: [2, 3, 2, 2, 5, 2, 2, 4, 2, 1, 3] },
      { outcome: "DÖÇ5", values: [2, 2, 2, 1, 5, 2, 1, 2, 5, 2, 3] },
    ],
  },
  {
    ...base,
    code: "ADE8XX", aliases: ["ADE801", "ADE802", "ADE803", "ADE804"], name: "UZMANLIK ALAN DERSİ",
    teachingMode: "Bireysel Çalışma", theory: 4, practice: 0, ects: 5,
    purpose: "Öğrencinin aile danışmanlığı alanındaki uzmanlık bilgisini tez konusu doğrultusunda derinleştirmesini ve bağımsız araştırma yetkinliği geliştirmesini sağlamak.",
    content: "Tez alanına ilişkin güncel kuramlar ve araştırmalar, eleştirel literatür incelemesi, araştırma probleminin derinleştirilmesi, bilimsel yöntem ve akademik yazım.",
    methods: "Bireysel çalışma, danışman yönlendirmesi, bilimsel makale incelemesi, kavramsal çözümleme ve araştırma raporlama.",
    resources: "Tez konusu ile ilgili güncel ulusal ve uluslararası bilimsel yayınlar.", sdgs: ["3", "4", "5", "10", "16"],
    outcomes: ["Uzmanlık alanındaki kuram ve araştırmaları analiz eder.", "Tez problemiyle ilgili literatürü eleştirel biçimde değerlendirir.", "Alan bilgilerini araştırma problemiyle bütünleştirir.", "Bilimsel kaynaklardan özgün araştırma önerileri geliştirir.", "Uzmanlık çalışmasını bilimsel ve etik ilkelere göre raporlar."],
    weeklyTopics: ["Uzmanlık alanının kapsamı ve araştırma gündemi", "Tez konusu ile ilgili temel kuramlar", "Literatür tarama stratejileri", "Ulusal alan yazınının incelenmesi", "Uluslararası alan yazınının incelenmesi", "Araştırma boşluklarının belirlenmesi", "Kavramsal çerçevenin yapılandırılması", "Araştırma probleminin geliştirilmesi", "Yöntemsel yaklaşımların karşılaştırılması", "Etik ve kültürel duyarlılık", "Kanıtların eleştirel değerlendirilmesi", "Kuramsal bilgilerin bütünleştirilmesi", "Bilimsel yazım ve atıf", "Araştırma önerisinin geliştirilmesi", "Uzmanlık raporunun değerlendirilmesi"],
    assessments: [{ name: "Uzmanlık Alanı Çalışması", count: 1, weight: 100 }],
    workloads: [{ name: "Ders Süresi", count: 15, hours: 4, total: 60 }, { name: "Literatür ve Araştırma Çalışması", count: 15, hours: 6, total: 90 }],
    contributionMatrix: [
      { outcome: "DÖÇ1", values: [5, 3, 2, 2, 4, 1, 1, 2, 2, 2, 5] }, { outcome: "DÖÇ2", values: [4, 5, 2, 2, 5, 1, 1, 2, 2, 2, 5] },
      { outcome: "DÖÇ3", values: [5, 4, 3, 3, 5, 2, 1, 2, 2, 2, 4] }, { outcome: "DÖÇ4", values: [4, 4, 2, 3, 5, 1, 2, 3, 2, 2, 5] },
      { outcome: "DÖÇ5", values: [3, 3, 2, 2, 5, 1, 2, 4, 5, 2, 4] },
    ],
  },
  {
    ...base,
    code: "ADE806", aliases: ["ADE805"], name: "SEMİNER",
    teachingMode: "Yüz Yüze", theory: 0, practice: 0, ects: 6,
    purpose: "Öğrencinin bilimsel bir konuyu araştırma, yapılandırma ve akademik ölçütlere uygun biçimde sözlü ve yazılı sunma yetkinliği kazanmasını sağlamak.",
    content: "Seminer konusu seçimi, bilimsel kaynak taraması, araştırma sorusunun geliştirilmesi, bilginin sentezlenmesi, akademik rapor ve sunum hazırlama, bilimsel tartışma ve etik.",
    methods: "Literatür taraması, bireysel araştırma, akademik rapor yazımı, sözlü sunum ve yapılandırılmış geri bildirim.", resources: "Güncel bilimsel yayınlar, akademik yazım kaynakları ve Enstitü seminer esasları.", sdgs: ["3", "4", "16"],
    outcomes: ["Seminer konusuna uygun bilimsel kaynakları değerlendirir.", "Araştırma sorusunu ve kapsamını yapılandırır.", "Bilimsel bilgileri eleştirel biçimde sentezler.", "Seminer çalışmasını akademik yazım ilkelerine göre raporlar.", "Çalışmasını etkili biçimde sunar ve bilimsel tartışmada savunur."],
    weeklyTopics: ["Seminer çalışmasının kapsamı", "Konu seçimi ve sınırlandırma", "Araştırma sorusunun geliştirilmesi", "Literatür tarama stratejisi", "Kaynak güvenilirliğinin değerlendirilmesi", "Kuramsal çerçevenin oluşturulması", "Bilgilerin sınıflandırılması", "Eleştirel sentez", "Akademik rapor yapısı", "Bilimsel anlatım ve tutarlılık", "Atıf ve kaynak gösterme", "Araştırma ve yayın etiği", "Sunum tasarımı", "Bilimsel tartışma ve geri bildirim", "Seminer raporunun bütüncül değerlendirilmesi"],
    assessments: [{ name: "Seminer Raporu ve Sunumu", count: 1, weight: 100 }],
    workloads: [{ name: "Seminer Çalışması", count: 15, hours: 12, total: 180 }],
    contributionMatrix: [
      { outcome: "DÖÇ1", values: [4, 3, 2, 2, 5, 1, 2, 2, 2, 1, 5] }, { outcome: "DÖÇ2", values: [3, 4, 2, 2, 5, 1, 1, 2, 2, 1, 4] },
      { outcome: "DÖÇ3", values: [4, 5, 2, 2, 5, 1, 2, 3, 2, 2, 5] }, { outcome: "DÖÇ4", values: [3, 3, 2, 2, 5, 1, 2, 5, 4, 1, 4] },
      { outcome: "DÖÇ5", values: [3, 3, 2, 2, 4, 2, 2, 5, 4, 2, 4] },
    ],
  },
  {
    ...base,
    code: "ADE81X", aliases: ["ADE807", "ADE808"], name: "TEZ ÇALIŞMASI",
    teachingMode: "Bireysel Araştırma", theory: 0, practice: 0, ects: 24,
    purpose: "Öğrencinin aile danışmanlığı alanında bağımsız bir bilimsel araştırmayı tasarlaması, yürütmesi, raporlaması ve savunması.",
    content: "Tez problemi, literatür, kuramsal çerçeve, araştırma yöntemi, etik izinler, veri toplama ve analiz, bulguların yorumlanması, tez yazımı ve savunma.",
    methods: "Bağımsız araştırma, danışmanlık, veri toplama ve analiz, akademik yazım, bilimsel tartışma ve tez savunması hazırlığı.", resources: "Enstitü tez yazım kılavuzu, araştırma etiği düzenlemeleri ve tez konusu ile ilgili bilimsel yayınlar.", sdgs: ["3", "4", "5", "10", "16"],
    outcomes: ["Özgün bir araştırma problemini yapılandırır.", "Araştırma problemine uygun yöntemi tasarlar.", "Araştırmayı bilimsel ve etik ilkelere göre yürütür.", "Bulguları analiz ederek alan yazınla ilişkilendirir.", "Tez çalışmasını akademik biçimde raporlar ve savunur."],
    weeklyTopics: ["Tez problemi ve kapsam", "Araştırma soruları", "Literatür tarama planı", "Kuramsal çerçeve", "Araştırma deseni", "Çalışma grubu ve örnekleme", "Veri toplama araçları", "Etik izin ve uygulama planı", "Veri toplama", "Verilerin düzenlenmesi", "Veri analizi", "Bulguların yorumlanması", "Tartışma ve sonuç", "Tez yazım bütünlüğü", "Savunma hazırlığı"],
    assessments: [{ name: "Tez Çalışması", count: 1, weight: 100 }],
    workloads: [{ name: "Bağımsız Tez Araştırması", count: 15, hours: 48, total: 720 }],
    contributionMatrix: [
      { outcome: "DÖÇ1", values: [4, 5, 2, 2, 5, 1, 1, 2, 2, 2, 4] }, { outcome: "DÖÇ2", values: [3, 5, 2, 2, 5, 1, 2, 2, 3, 2, 4] },
      { outcome: "DÖÇ3", values: [3, 4, 3, 2, 5, 2, 2, 2, 5, 3, 4] }, { outcome: "DÖÇ4", values: [4, 5, 3, 2, 5, 1, 3, 3, 3, 3, 5] },
      { outcome: "DÖÇ5", values: [3, 4, 2, 2, 5, 2, 2, 5, 4, 2, 5] },
    ],
  },
];

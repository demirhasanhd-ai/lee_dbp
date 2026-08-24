export type CourseAssessment = { name: string; count: number; weight: number };
export type CourseWorkload = { name: string; count: number; hours: number; total: number };
export type CourseContributionRow = { outcome: string; values: number[] };
export type CourseQualityStatus = "Uygun" | "Revize Edildi" | "Doğrulanmalı";
export type CourseQualityCheck = {
  item: string;
  status: CourseQualityStatus;
  note?: string;
};

export type CoursePackage = {
  code: string;
  name?: string;
  aliases?: string[];
  department?: string;
  programName?: string;
  publicQualityChecklist?: boolean;
  sourceUrl?: string;
  language: string;
  level: string;
  teachingMode: string;
  instructor?: string;
  theory?: number;
  practice?: number;
  credit?: number;
  ects?: number;
  purpose: string;
  content: string;
  methods: string;
  prerequisites: string;
  resources: string;
  sdgs: string[];
  outcomes: string[];
  weeklyTopics: string[];
  assessments: CourseAssessment[];
  workloads: CourseWorkload[];
  contributionMatrix: CourseContributionRow[];
  qualityChecks?: CourseQualityCheck[];
};

export const sanitizeInstructorName = (value = "") => value
  .replace(/\bYrd\.?\s*Doç\.?\s*Dr\.?\b/giu, "Dr. Öğr. Üyesi")
  .replace(/(?:https?:\/\/|www\.)\S+/giu, " ")
  .replace(/\b(?:akbis\.)?osmaniye\.edu\.tr\/\S+/giu, " ")
  .replace(/\b\S+@\S+\b/giu, " ")
  .replace(/\s+\b(?:yok|null|undefined)\b\s*$/giu, "")
  .replace(/\s+/g, " ")
  .trim();

import { buildSemanticContributionMatrix, ybsAcademicCoursePackages } from "./ybsAcademicCoursePackages";
import { makineCommonCoursePackages } from "./makineCommonCoursePackages";
import { makineAcademicCoursePackages } from "./makineAcademicCoursePackages";
import { makineAcademicCoursePackages2 } from "./makineAcademicCoursePackages2";
import { makineAcademicCoursePackages3 } from "./makineAcademicCoursePackages3";
import { aileDanismanligiTezliCoursePackages } from "./aileDanismanligiTezliCoursePackages";
import { aileDanismanligiCommonCoursePackages } from "./aileDanismanligiCommonCoursePackages";
import { aileDanismanligiMissingCoursePackages } from "./aileDanismanligiMissingCoursePackages";
import { aileDanismanligiTezsizCoursePackages } from "./aileDanismanligiTezsizCoursePackages";
import { aileDanismanligiTezsizCommonCoursePackages } from "./aileDanismanligiTezsizCommonCoursePackages";
import { arkeolojiTezliCoursePackages } from "./arkeolojiTezliCoursePackages";
import { arkeolojiCommonCoursePackages } from "./arkeolojiCommonCoursePackages";
import { arkeolojiMissingCoursePackages } from "./arkeolojiMissingCoursePackages";
import { bataryaTezliCoursePackages } from "./bataryaTezliCoursePackages";
import { bataryaCommonCoursePackages } from "./bataryaCommonCoursePackages";
import { bedenTezliCoursePackages } from "./bedenTezliCoursePackages";
import { bedenCommonCoursePackages } from "./bedenCommonCoursePackages";
import { bedenTezsizCoursePackages } from "./bedenTezsizCoursePackages";
import { bedenTezsizCommonCoursePackages } from "./bedenTezsizCommonCoursePackages";
import { biyolojiTezliCoursePackages } from "./biyolojiTezliCoursePackages";
import { biyolojiCommonCoursePackages } from "./biyolojiCommonCoursePackages";
import { biyolojiTezsizCoursePackages } from "./biyolojiTezsizCoursePackages";
import { biyolojiTezsizCommonCoursePackages } from "./biyolojiTezsizCommonCoursePackages";
import { ekonomiFinansTezsizCoursePackages } from "./ekonomiFinansTezsizCoursePackages";
import { ekonomiFinansTezsizCommonCoursePackages } from "./ekonomiFinansTezsizCommonCoursePackages";
import { biyolojiDoktoraCoursePackages } from "./biyolojiDoktoraCoursePackages";
import { biyolojiDoktoraCommonCoursePackages } from "./biyolojiDoktoraCommonCoursePackages";
import { ebelikTezliCoursePackages } from "./ebelikTezliCoursePackages";
import { ebelikCommonCoursePackages } from "./ebelikCommonCoursePackages";
import { ekoturizmTezliCoursePackages } from "./ekoturizmTezliCoursePackages";
import { ekoturizmCommonCoursePackages } from "./ekoturizmCommonCoursePackages";
import { elektrikElektronikTezliCoursePackages } from "./elektrikElektronikTezliCoursePackages";
import { elektrikElektronikCommonCoursePackages } from "./elektrikElektronikCommonCoursePackages";
import { enerjiSistemleriTezliCoursePackages } from "./enerjiSistemleriTezliCoursePackages";
import { enerjiSistemleriCommonCoursePackages } from "./enerjiSistemleriCommonCoursePackages";
import { enerjiSistemleriDoktoraCoursePackages } from "./enerjiSistemleriDoktoraCoursePackages";
import { enerjiSistemleriDoktoraCommonCoursePackages } from "./enerjiSistemleriDoktoraCommonCoursePackages";
import { felsefeDinTezliCoursePackages } from "./felsefeDinTezliCoursePackages";
import { felsefeDinCommonCoursePackages } from "./felsefeDinCommonCoursePackages";
import { fizikTezliCoursePackages } from "./fizikTezliCoursePackages";
import { fizikCommonCoursePackages } from "./fizikCommonCoursePackages";
import { fizikDoktoraCoursePackages } from "./fizikDoktoraCoursePackages";
import { fizikDoktoraCommonCoursePackages } from "./fizikDoktoraCommonCoursePackages";
import { gastronomiTezliCoursePackages } from "./gastronomiTezliCoursePackages";
import { gastronomiCommonCoursePackages } from "./gastronomiCommonCoursePackages";
import { gidaMuhendisligiTezliCoursePackages } from "./gidaMuhendisligiTezliCoursePackages";
import { gidaMuhendisligiCommonCoursePackages } from "./gidaMuhendisligiCommonCoursePackages";
import { gidaMuhendisligiDoktoraCoursePackages } from "./gidaMuhendisligiDoktoraCoursePackages";
import { gidaMuhendisligiDoktoraCommonCoursePackages } from "./gidaMuhendisligiDoktoraCommonCoursePackages";
import { gidaTeknolojisiTezliCoursePackages } from "./gidaTeknolojisiTezliCoursePackages";
import { gidaTeknolojisiCommonCoursePackages } from "./gidaTeknolojisiCommonCoursePackages";
import { haritaMuhendisligiTezliCoursePackages } from "./haritaMuhendisligiTezliCoursePackages";
import { haritaMuhendisligiCommonCoursePackages } from "./haritaMuhendisligiCommonCoursePackages";
import { icHastaliklariHemsireligiTezliCoursePackages } from "./icHastaliklariHemsireligiTezliCoursePackages";
import { icHastaliklariHemsireligiCommonCoursePackages } from "./icHastaliklariHemsireligiCommonCoursePackages";
import { iktisatTezliCoursePackages } from "./iktisatTezliCoursePackages";
import { iktisatCommonCoursePackages } from "./iktisatCommonCoursePackages";
import { insaatMuhendisligiTezliCoursePackages } from "./insaatMuhendisligiTezliCoursePackages";
import { insaatMuhendisligiCommonCoursePackages } from "./insaatMuhendisligiCommonCoursePackages";
import { insaatMuhendisligiDoktoraCoursePackages } from "./insaatMuhendisligiDoktoraCoursePackages";
import { insaatMuhendisligiDoktoraCommonCoursePackages } from "./insaatMuhendisligiDoktoraCommonCoursePackages";
import { isletmeTezliCoursePackages } from "./isletmeTezliCoursePackages";
import { isletmeCommonCoursePackages } from "./isletmeCommonCoursePackages";
import { isletmeDoktoraCoursePackages } from "./isletmeDoktoraCoursePackages";
import { isletmeDoktoraCommonCoursePackages } from "./isletmeDoktoraCommonCoursePackages";
import { kimyaTezliCoursePackages } from "./kimyaTezliCoursePackages";
import { kimyaCommonCoursePackages } from "./kimyaCommonCoursePackages";
import { kimyaDoktoraCoursePackages } from "./kimyaDoktoraCoursePackages";
import { kimyaDoktoraCommonCoursePackages } from "./kimyaDoktoraCommonCoursePackages";
import { makineMuhendisligiDoktoraCoursePackages } from "./makineMuhendisligiDoktoraCoursePackages";
import { makineMuhendisligiDoktoraCommonCoursePackages } from "./makineMuhendisligiDoktoraCommonCoursePackages";
import { matematikTezliCoursePackages } from "./matematikTezliCoursePackages";
import { matematikCommonCoursePackages } from "./matematikCommonCoursePackages";
import { muhasebeFinansmanTezliCoursePackages } from "./muhasebeFinansmanTezliCoursePackages";
import { muhasebeFinansmanCommonCoursePackages } from "./muhasebeFinansmanCommonCoursePackages";
import { organikTarimIsletmeciligiTezliCoursePackages } from "./organikTarimIsletmeciligiTezliCoursePackages";
import { organikTarimIsletmeciligiCommonCoursePackages } from "./organikTarimIsletmeciligiCommonCoursePackages";
import { resimTezliCoursePackages } from "./resimTezliCoursePackages";
import { resimCommonCoursePackages } from "./resimCommonCoursePackages";
import { siyasetKamuYonetimiTezliCoursePackages } from "./siyasetKamuYonetimiTezliCoursePackages";
import { siyasetKamuYonetimiCommonCoursePackages } from "./siyasetKamuYonetimiCommonCoursePackages";
import { siyasetKamuYonetimiDoktoraCoursePackages } from "./siyasetKamuYonetimiDoktoraCoursePackages";
import { siyasetKamuYonetimiDoktoraCommonCoursePackages } from "./siyasetKamuYonetimiDoktoraCommonCoursePackages";
import { tarihTezliCoursePackages } from "./tarihTezliCoursePackages";
import { tarihCommonCoursePackages } from "./tarihCommonCoursePackages";
import { temelIslamBilimleriTezliCoursePackages } from "./temelIslamBilimleriTezliCoursePackages";
import { temelIslamBilimleriCommonCoursePackages } from "./temelIslamBilimleriCommonCoursePackages";
import { turkDiliEdebiyatiTezliCoursePackages } from "./turkDiliEdebiyatiTezliCoursePackages";
import { turkDiliEdebiyatiCommonCoursePackages } from "./turkDiliEdebiyatiCommonCoursePackages";
import { turkDiliEdebiyatiDoktoraCoursePackages } from "./turkDiliEdebiyatiDoktoraCoursePackages";
import { turkDiliEdebiyatiDoktoraCommonCoursePackages } from "./turkDiliEdebiyatiDoktoraCommonCoursePackages";
import { ybsTezliCoursePackages } from "./ybsTezliCoursePackages";
import { ybsTezliCommonCoursePackages } from "./ybsTezliCommonCoursePackages";
import { yonetimOrganizasyonCoursePackages } from "./yonetimOrganizasyonCoursePackages";
import { yonetimOrganizasyonCommonCoursePackages } from "./yonetimOrganizasyonCommonCoursePackages";

const ybs919: CoursePackage = {
  code: "YBS919",
  theory: 3,
  practice: 0,
  credit: 3,
  ects: 6,
  language: "Türkçe",
  level: "Doktora",
  teachingMode: "Yüz Yüze",
  purpose: "İleri yöneylem araştırması tekniklerini analiz ederek karmaşık yönetim ve bilişim karar problemlerine uygun model ve çözüm yaklaşımları geliştirme yetkinliği kazandırmak.",
  content: "Kesirli Programlama, Sezgisel Yöntemler, Bulanık mantık teorisi, Analitik Ağ Süreci (ANP), Analitik Hiyerarşi Süreci (AHP), Veri Zarflama Analizi, Çoklu Parametrik Programlama.",
  methods: "Kuramsal anlatım, matematiksel modelleme, örnek problem çözümü, yöntem karşılaştırması, duyarlılık analizi ve çözüm sonuçlarının bilimsel tartışması.",
  prerequisites: "Yok",
  resources: "Öğretim üyesi tarafından hazırlanan ders notları; Bronson, R. ve Naadimuthu, G., Operations Research, Schaum's Outlines, Second Edition.",
  sdgs: ["4", "8", "9"],
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
    "Genel değerlendirme ve dönem sonu çalışmaları",
  ],
  assessments: [
    { name: "Ara Sınav", count: 1, weight: 40 },
    { name: "Yarıyıl Sonu Sınavı", count: 1, weight: 60 },
  ],
  workloads: [
    { name: "Ders Süresi", count: 15, hours: 3, total: 45 },
    { name: "Sınıf Dışı Çalışma Süresi", count: 15, hours: 6, total: 90 },
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

const ybs921: CoursePackage = {
  code: "YBS921",
  theory: 3,
  practice: 0,
  credit: 3,
  ects: 6,
  language: "Türkçe",
  level: "Doktora",
  teachingMode: "Yüz Yüze",
  purpose: "Doktora düzeyinde proje yönetiminin ileri kuramsal yaklaşımlarını eleştirel biçimde değerlendirme; karmaşık, belirsizlik içeren ve çok paydaşlı projeleri bilimsel temelde analiz etme; proje süreçlerini stratejik, yenilikçi ve araştırma odaklı biçimde planlama yetkinliği kazandırmak.",
  content: "Proje yönetiminin kuramsal temelleri; proje yaşam döngüsü; kapsam, zaman ve maliyet yönetimi; risk ve belirsizlik yönetimi; paydaş analizi; kaynak optimizasyonu; proje portföy yönetimi ve yönetişim yaklaşımları; Agile, Scrum, PRINCE2 ve PMBOK metodolojileri; veri temelli karar verme teknikleri; araştırma odaklı proje değerlendirme modelleri; literatür tartışmaları, eleştirel analizler, vaka çalışmaları ile model ve çerçeve geliştirme çalışmaları.",
  methods: "Etkinlikler, değerlendirme ve iş yükü hesaplaması bölümlerinde tanımlanan ders, sınıf dışı çalışma ve sınav faaliyetleri üzerinden yürütülür.",
  prerequisites: "Yok",
  resources: "E. S. Andersen, K. V. Grude ve T. Haug, Goal Directed Project Management, 2. Baskı, 1995; Project Management Institute, A Guide to the Project Management Body of Knowledge (PMBOK Guide), 7. Baskı, 2021.",
  sdgs: ["4", "8", "9"],
  outcomes: [
    "Karmaşık projelerin yaşam döngüsü ve yönetişim yapılarını eleştirel değerlendirir.",
    "Proje ağlarını PERT ve CPM teknikleriyle analiz eder.",
    "Zaman, maliyet ve kaynak kısıtlarını bütünleştiren proje planları geliştirir.",
    "Proje riskleri ile belirsizliklerini veri temelli yöntemlerle değerlendirir.",
    "Proje kalite, kültür ve kontrol süreçleri için araştırma temelli çözümler geliştirir.",
  ],
  weeklyTopics: [
    "Giriş ve projeler",
    "Ağ planı kavramının geliştirilmesi, PERT ve CPM",
    "Ağ planı kavramının geliştirilmesi, PERT ve CPM",
    "Proje nitelikleri",
    "Proje yönetiminde görünmez tehlikeler",
    "Zaman tahmini",
    "Zaman-maliyet çelişkisi",
    "Proje planlamada olasılık ve maliyet",
    "Planlama aşamaları ve düzenleme",
    "Detaylı planlama ve detaylı organizasyon",
    "Proje kontrolü",
    "Proje çalışmasında kalite",
    "Proje kültürü",
    "Proje kültürü",
    "Genel değerlendirme ve dönem sonu çalışmaları",
  ],
  assessments: [
    { name: "Ara Sınav", count: 1, weight: 40 },
    { name: "Yarıyıl Sonu Sınavı", count: 1, weight: 60 },
  ],
  workloads: [
    { name: "Ders Süresi", count: 15, hours: 3, total: 45 },
    { name: "Sınıf Dışı Çalışma Süresi", count: 15, hours: 6, total: 90 },
    { name: "Ara Sınav Hazırlığı", count: 1, hours: 20, total: 20 },
    { name: "Yarıyıl Sonu Sınavı Hazırlığı", count: 1, hours: 25, total: 25 },
  ],
  contributionMatrix: [
    { outcome: "DÖÇ1", values: [4, 3, 3, 3, 4, 3, 2, 4, 3, 2, 4] },
    { outcome: "DÖÇ2", values: [3, 4, 4, 5, 3, 3, 1, 4, 2, 2, 3] },
    { outcome: "DÖÇ3", values: [3, 4, 5, 4, 3, 4, 2, 5, 2, 2, 5] },
    { outcome: "DÖÇ4", values: [3, 4, 4, 5, 4, 4, 2, 4, 3, 2, 4] },
    { outcome: "DÖÇ5", values: [3, 4, 5, 4, 4, 4, 3, 4, 4, 3, 5] },
  ],
};

const ybs923: CoursePackage = {
  code: "YBS923",
  theory: 3,
  practice: 0,
  credit: 3,
  ects: 6,
  language: "Türkçe",
  level: "Doktora",
  teachingMode: "Yüz Yüze",
  purpose: "Çok amaçlı karar problemlerini matematiksel olarak modelleme, farklı etkin çözüm kavramlarını eleştirel biçimde karşılaştırma ve probleme uygun optimizasyon yaklaşımını seçip sonuçlarını analiz etme yetkinliği kazandırmak.",
  content: "Çok amaçlı karar vermenin temelleri; farklı etkin çözüm kavramları; Pareto optimal noktalar ve Pareto etkin çözümler; klasik çözüm teknikleri; hedef programlama; etkileşimli yaklaşımlar ve meta sezgisel yaklaşımlar.",
  methods: "Etkinlikler, değerlendirme ve iş yükü hesaplaması bölümlerinde tanımlanan ders, sınıf dışı çalışma ve sınav faaliyetleri üzerinden yürütülür.",
  prerequisites: "Yok",
  resources: "Öğretim üyesi tarafından hazırlanan ders notları; M. K. Mandal, S. Mukhopadhyay ve P. Dutta, Multi-Objective Optimization, Springer Singapore.",
  sdgs: ["4", "9", "12"],
  outcomes: [
    "Çok amaçlı optimizasyon problemlerini matematiksel olarak modeller.",
    "Baskınlık ve Pareto optimalite kavramlarını çözüm kümelerinde analiz eder.",
    "Klasik ve hedef programlama tekniklerini karar problemlerine uygular.",
    "Etkileşimli ve meta sezgisel yaklaşımları eleştirel biçimde karşılaştırır.",
    "Çözüm sonuçlarını karar ölçütleri doğrultusunda değerlendirerek gerekçelendirir.",
  ],
  weeklyTopics: [
    "Giriş",
    "Tanımlar: baskınlık, Pareto optimalite, derecelendirme ve ağırlıklandırma",
    "Klasik çözüm teknikleri",
    "Klasik çözüm teknikleri",
    "Hedef programlama teknikleri",
    "Hedef programlama teknikleri",
    "Etkileşimli yaklaşımlar",
    "Etkileşimli yaklaşımlar",
    "Etkileşimli yaklaşımlar",
    "Etkileşimli yaklaşımlar",
    "Meta sezgisel yaklaşımlar",
    "Meta sezgisel yaklaşımlar",
    "Meta sezgisel yaklaşımlar",
    "Meta sezgisel yaklaşımlar",
    "Genel değerlendirme ve dönem sonu çalışmaları",
  ],
  assessments: [
    { name: "Ara Sınav", count: 1, weight: 40 },
    { name: "Yarıyıl Sonu Sınavı", count: 1, weight: 60 },
  ],
  workloads: [
    { name: "Ders Süresi", count: 15, hours: 3, total: 45 },
    { name: "Sınıf Dışı Çalışma Süresi", count: 15, hours: 6, total: 90 },
    { name: "Ara Sınav Hazırlığı", count: 1, hours: 20, total: 20 },
    { name: "Yarıyıl Sonu Sınavı Hazırlığı", count: 1, hours: 25, total: 25 },
  ],
  contributionMatrix: [
    { outcome: "DÖÇ1", values: [3, 5, 5, 4, 3, 4, 2, 5, 2, 2, 4] },
    { outcome: "DÖÇ2", values: [4, 4, 3, 5, 4, 3, 2, 4, 2, 2, 3] },
    { outcome: "DÖÇ3", values: [3, 4, 4, 5, 3, 3, 1, 4, 2, 2, 4] },
    { outcome: "DÖÇ4", values: [4, 4, 4, 5, 5, 4, 2, 5, 3, 3, 4] },
    { outcome: "DÖÇ5", values: [3, 4, 4, 5, 5, 4, 3, 4, 4, 3, 5] },
  ],
};

const ybsSpecialization: CoursePackage = {
  code: "YBS9XX",
  aliases: ["YBS901", "YBS902", "YBS903", "YBS904", "YBS905", "YBS906", "YBS907", "YBS908"],
  language: "Türkçe",
  level: "Doktora",
  teachingMode: "Yüz Yüze / Bireysel Çalışma",
  instructor: "Öğrencinin Danışmanı",
  theory: 4,
  practice: 0,
  credit: 0,
  ects: 5,
  purpose: "Öğrencinin Yönetim Bilişim Sistemleri uzmanlık alanındaki güncel ve ileri araştırmaları eleştirel biçimde incelemesini, tez çalışmasıyla ilişkili bilimsel problemi derinleştirmesini ve bağımsız araştırma yetkinliğini geliştirmesini sağlamak.",
  content: "Öğrencinin tez ve uzmanlık alanına göre güncel YBS literatürünün izlenmesi; yönetim, bilişim ve karar bilimleri yaklaşımlarının bütünleştirilmesi; araştırma probleminin, kuramsal çerçevenin ve yöntemin geliştirilmesi; veri, model ve bulguların danışman eşliğinde değerlendirilmesi; bilimsel raporlama ve yayın hazırlığı.",
  methods: "Bireysel araştırma, danışman görüşmeleri, eleştirel literatür incelemesi, araştırma tasarımı geliştirme, veri/model değerlendirme ve akademik geri bildirim.",
  prerequisites: "Yok",
  resources: "Öğrencinin uzmanlık alanı ve tez konusu ile ilgili güncel ulusal ve uluslararası kitaplar, hakemli makaleler, veri kaynakları ve yöntemsel çalışmalar.",
  sdgs: ["4", "9", "17"],
  outcomes: [
    "Uzmanlık alanındaki güncel YBS literatürünü eleştirel biçimde sentezler.",
    "Tez problemiyle ilişkili özgün araştırma soruları geliştirir.",
    "Yönetim ve bilişim yöntemlerini araştırma tasarımında bütünleştirir.",
    "Araştırma verileri ile modellerini bilimsel ölçütlerle değerlendirir.",
    "Araştırma ilerlemesini etik ilkelere uygun biçimde raporlar.",
  ],
  weeklyTopics: [
    "Uzmanlık alanı ve araştırma hedeflerinin belirlenmesi",
    "Güncel YBS literatürünün sistematik taranması",
    "Temel kuram ve kavramların eleştirel incelenmesi",
    "Araştırma boşluğunun ve problemin tanımlanması",
    "Araştırma sorularının geliştirilmesi",
    "Kuramsal çerçevenin yapılandırılması",
    "Yöntemsel seçeneklerin karşılaştırılması",
    "Araştırma tasarımının geliştirilmesi",
    "Veri kaynakları ve ölçüm yaklaşımının değerlendirilmesi",
    "Analiz veya modelleme yaklaşımının geliştirilmesi",
    "Ön bulguların danışmanla değerlendirilmesi",
    "Bulguların güncel literatür bağlamında yorumlanması",
    "Bilimsel rapor veya yayın taslağının hazırlanması",
    "Etik, kaynak gösterme ve araştırma bütünlüğü kontrolü",
    "Dönem çalışmasının genel değerlendirmesi ve ilerleme raporu",
  ],
  assessments: [{ name: "Araştırma Süreci ve İlerleme Raporu", count: 1, weight: 100 }],
  workloads: [
    { name: "Danışman Eşliğinde Uzmanlık Çalışması", count: 15, hours: 3, total: 45 },
    { name: "Bireysel Araştırma ve Literatür Çalışması", count: 15, hours: 6, total: 90 },
    { name: "İlerleme Raporu Hazırlama", count: 1, hours: 15, total: 15 },
  ],
  contributionMatrix: [
    { outcome: "DÖÇ1", values: [5, 3, 3, 3, 5, 4, 3, 4, 3, 3, 3] },
    { outcome: "DÖÇ2", values: [4, 5, 4, 3, 4, 5, 4, 4, 3, 3, 4] },
    { outcome: "DÖÇ3", values: [4, 4, 5, 4, 3, 4, 4, 5, 3, 2, 5] },
    { outcome: "DÖÇ4", values: [4, 4, 4, 5, 5, 4, 3, 4, 3, 3, 4] },
    { outcome: "DÖÇ5", values: [3, 3, 3, 3, 4, 5, 4, 3, 5, 4, 3] },
  ],
};

const ybsResearchEthics: CoursePackage = {
  code: "YBS999",
  language: "Türkçe",
  level: "Doktora",
  teachingMode: "Yüz Yüze",
  theory: 3,
  practice: 0,
  credit: 3,
  ects: 6,
  purpose: "Yönetim Bilişim Sistemleri alanında özgün bir bilimsel araştırmayı tasarlama, yürütme, analiz etme ve bilimsel etik ile araştırma bütünlüğü ilkelerine uygun biçimde raporlama yetkinliği kazandırmak.",
  content: "Bilim ve sosyal bilimlerde araştırma; problem tanımlama; kuramsal çerçeve; hipotezler; nicel, nitel ve karma araştırma tasarımları; ölçeklendirme, geçerlilik ve güvenilirlik; veri toplama ve örnekleme; nicel ve nitel veri analizi; YBS bağlamında veri ambarlama, veri madenciliği ve yöneylem araştırması; bilimsel raporlama; yayın etiği, yazarlık, bilimsel yanıltma ve etik kurul süreçleri.",
  methods: "Anlatım, araştırma tasarımı incelemesi, yöntem karşılaştırması, örnek olay ve etik ihlal analizi, veri analizi uygulamaları ve bilimsel rapor değerlendirmesi.",
  prerequisites: "Yok",
  resources: "Sekaran, U. ve Bougie, R. (2010), Research Methods for Business: A Skill-Building Approach; güncel YBS araştırma yöntemleri ve yayın etiği kaynakları.",
  sdgs: ["4", "9", "16"],
  outcomes: [
    "YBS alanına uygun özgün bir araştırma problemi geliştirir.",
    "Araştırma sorularına uygun yöntem ve örnekleme yaklaşımını gerekçelendirir.",
    "Nicel ve nitel verileri uygun analiz teknikleriyle değerlendirir.",
    "Araştırma bulgularını bilimsel yazım ilkelerine göre raporlar.",
    "Bilimsel etik ve araştırma bütünlüğü sorunlarını eleştirel değerlendirir.",
  ],
  weeklyTopics: [
    "Bilimin tanımı ve sosyal bilimlerde araştırma",
    "Araştırma süreci ve problem tanımlama",
    "Literatür taraması ve kuramsal çerçeve",
    "Araştırma soruları, hipotezler ve test mantığı",
    "Nicel, nitel ve karma araştırma tasarımları",
    "Araştırma tasarımının temel unsurları",
    "Ölçeklendirme, geçerlilik ve güvenilirlik",
    "Veri toplama yöntemleri",
    "Evren, örnekleme ve örneklem büyüklüğü",
    "Nicel veri analizi",
    "YBS araştırmalarında veri ambarlama, veri madenciliği ve yöneylem araştırması",
    "Nitel veri analizi",
    "Bilimsel raporlama ve kaynak gösterme",
    "Yayın etiği, yazarlık, bilimsel yanıltma ve etik kurullar",
    "Araştırma tasarımının genel değerlendirmesi",
  ],
  assessments: [
    { name: "Ara Sınav", count: 1, weight: 40 },
    { name: "Yarıyıl Sonu Sınavı", count: 1, weight: 60 },
  ],
  workloads: [
    { name: "Ders Süresi", count: 15, hours: 3, total: 45 },
    { name: "Sınıf Dışı Çalışma Süresi", count: 15, hours: 6, total: 90 },
    { name: "Ara Sınav Hazırlığı", count: 1, hours: 20, total: 20 },
    { name: "Yarıyıl Sonu Sınavı Hazırlığı", count: 1, hours: 25, total: 25 },
  ],
  contributionMatrix: [
    { outcome: "DÖÇ1", values: [4, 5, 4, 3, 3, 5, 4, 3, 4, 3, 3] },
    { outcome: "DÖÇ2", values: [4, 4, 4, 4, 3, 5, 3, 4, 4, 2, 3] },
    { outcome: "DÖÇ3", values: [3, 4, 3, 5, 5, 4, 3, 4, 4, 2, 4] },
    { outcome: "DÖÇ4", values: [3, 3, 3, 4, 5, 4, 4, 3, 5, 5, 3] },
    { outcome: "DÖÇ5", values: [3, 3, 2, 3, 5, 4, 3, 2, 5, 4, 3] },
  ],
};

const ybsAdvising: CoursePackage = {
  code: "DAN902",
  language: "Türkçe",
  level: "Doktora",
  teachingMode: "Bireysel Danışmanlık",
  instructor: "Öğrencinin Danışmanı",
  theory: 0,
  practice: 1,
  credit: 0,
  ects: 1,
  purpose: "Öğrencinin Yönetim Bilişim Sistemleri alanındaki doktora araştırmasını planlı, etik ve yöntemsel olarak tutarlı biçimde yürütmesini; akademik ilerlemesini düzenli geri bildirimle yönetmesini sağlamak.",
  content: "Tez konusu ve araştırma sorularının geliştirilmesi; kuramsal çerçeve ve yöntem seçimi; veri toplama, analiz ve yorumlama süreçlerinin izlenmesi; etik ve araştırma bütünlüğü kontrolü; tez yazımı, yayın planı ve akademik ilerleme değerlendirmeleri.",
  methods: "Birebir danışmanlık görüşmeleri, araştırma planı incelemesi, taslak ve veri/model değerlendirmesi, düzenli geri bildirim ve ilerleme izleme.",
  prerequisites: "Yok",
  resources: "Tez konusu ile ilgili güncel alan yazını; Booth, Colomb ve Williams, The Craft of Research; Creswell, Research Design; Enstitü tez yazım ve etik yönergeleri.",
  sdgs: ["4", "9", "17"],
  outcomes: [
    "Doktora araştırmasının amaç ve aşamalarını danışmanıyla planlar.",
    "Kuramsal ve yöntemsel tercihlerini bilimsel gerekçelerle savunur.",
    "Araştırma ilerlemesini kanıta dayalı biçimde değerlendirir.",
    "Danışman geri bildirimlerini tez çalışmasına sistematik olarak uygular.",
    "Araştırmasını etik ve akademik standartlara uygun biçimde yürütür.",
  ],
  weeklyTopics: [
    "Dönem araştırma hedeflerinin belirlenmesi",
    "Tez problemi ve araştırma sorularının gözden geçirilmesi",
    "Literatür tarama stratejisinin değerlendirilmesi",
    "Kuramsal çerçevenin değerlendirilmesi",
    "Araştırma tasarımının gözden geçirilmesi",
    "Veri kaynakları ve veri yönetimi planının değerlendirilmesi",
    "Ölçüm, geçerlilik ve güvenilirlik konularının incelenmesi",
    "Araştırma etiği ve gerekli izinlerin kontrolü",
    "Veri toplama veya model geliştirme ilerlemesinin değerlendirilmesi",
    "Analiz yaklaşımının değerlendirilmesi",
    "Ön bulguların tartışılması",
    "Tez yazım planı ve bölüm taslaklarının değerlendirilmesi",
    "Yayın ve bilimsel paylaşım planının değerlendirilmesi",
    "Düzeltmelerin ve araştırma risklerinin gözden geçirilmesi",
    "Dönem ilerleme raporunun değerlendirilmesi",
  ],
  assessments: [{ name: "Akademik İlerleme ve Danışmanlık Süreci", count: 1, weight: 100 }],
  workloads: [
    { name: "Bireysel Danışmanlık Görüşmesi", count: 15, hours: 1, total: 15 },
    { name: "Görüşme Hazırlığı ve Düzeltmeler", count: 10, hours: 1, total: 10 },
    { name: "İlerleme Raporu", count: 1, hours: 5, total: 5 },
  ],
  contributionMatrix: [
    { outcome: "DÖÇ1", values: [3, 4, 3, 3, 2, 5, 3, 3, 3, 2, 3] },
    { outcome: "DÖÇ2", values: [4, 4, 4, 4, 4, 4, 3, 4, 4, 3, 4] },
    { outcome: "DÖÇ3", values: [3, 3, 3, 4, 5, 5, 3, 3, 3, 2, 3] },
    { outcome: "DÖÇ4", values: [3, 3, 3, 3, 4, 5, 4, 3, 4, 3, 3] },
    { outcome: "DÖÇ5", values: [3, 3, 2, 3, 4, 5, 3, 2, 5, 3, 3] },
  ],
};

const ybsSeminar: CoursePackage = {
  code: "YBS910",
  aliases: ["YBS909"],
  language: "Türkçe",
  level: "Doktora",
  teachingMode: "Yüz Yüze / Bireysel Çalışma",
  instructor: "Öğrencinin Danışmanı",
  theory: 0,
  practice: 0,
  credit: 0,
  ects: 6,
  purpose: "Öğrencinin Yönetim Bilişim Sistemleri alanında güncel bir araştırma problemini bilimsel kaynaklara dayalı olarak incelemesini, akademik bir metne dönüştürmesini ve uzman bir topluluk önünde etkili biçimde savunmasını sağlamak.",
  content: "Seminer konusu belirleme; sistematik literatür taraması; problem ve amaç geliştirme; kuramsal ve yöntemsel çerçeve; bulguların sentezi; akademik yazım, kaynak gösterme ve görsel sunum; bilimsel tartışma, soru yanıtlama ve jüri değerlendirmesi.",
  methods: "Bireysel araştırma, danışman geri bildirimi, literatür sentezi, akademik rapor yazımı, prova sunumu ve jüri önünde sözlü sunum.",
  prerequisites: "Yok",
  resources: "Seminer konusu ile ilgili güncel YBS kitap ve makaleleri; bilimsel yazım, kaynak gösterme ve etkili akademik sunum kaynakları.",
  sdgs: ["4", "9", "17"],
  outcomes: [
    "Güncel bir YBS araştırma problemini bilimsel olarak yapılandırır.",
    "Alan yazınını eleştirel biçimde inceleyerek sentezler.",
    "Araştırma sonuçlarını akademik bir rapora dönüştürür.",
    "Bilimsel içeriği etkili görsel ve sözlü yöntemlerle sunar.",
    "Eleştiri ve soruları bilimsel kanıtlara dayanarak yanıtlar.",
  ],
  weeklyTopics: [
    "Seminer konusunun ve kapsamının belirlenmesi",
    "Araştırma problemi ve amacının geliştirilmesi",
    "Literatür tarama stratejisinin oluşturulması",
    "Temel kaynakların toplanması ve sınıflandırılması",
    "Kuramsal çerçevenin oluşturulması",
    "Literatürün eleştirel değerlendirilmesi",
    "Bulguların tematik olarak sentezlenmesi",
    "Seminer raporu taslağının oluşturulması",
    "Akademik yazım ve kaynak gösterme kontrolü",
    "Rapor bölümlerinin geliştirilmesi",
    "Görsel sunumun tasarlanması",
    "Sunum anlatısı ve zaman yönetimi çalışması",
    "Danışman geri bildirimi ve düzeltmeler",
    "Prova sunumu ve son hazırlık",
    "Jüri önünde seminer sunumu ve değerlendirme",
  ],
  assessments: [{ name: "Seminer Raporu ve Jüri Sunumu", count: 1, weight: 100 }],
  workloads: [
    { name: "Seminer Çalışmaları", count: 15, hours: 3, total: 45 },
    { name: "Literatür Araştırması", count: 10, hours: 6, total: 60 },
    { name: "Seminer Raporu Hazırlama", count: 1, hours: 52, total: 52 },
    { name: "Sunum Hazırlığı ve Sunum", count: 1, hours: 23, total: 23 },
  ],
  contributionMatrix: [
    { outcome: "DÖÇ1", values: [4, 5, 3, 3, 3, 4, 3, 3, 3, 3, 3] },
    { outcome: "DÖÇ2", values: [5, 4, 3, 3, 5, 4, 3, 4, 3, 3, 3] },
    { outcome: "DÖÇ3", values: [4, 3, 3, 3, 5, 4, 4, 3, 5, 4, 3] },
    { outcome: "DÖÇ4", values: [3, 3, 2, 2, 4, 3, 3, 3, 3, 5, 3] },
    { outcome: "DÖÇ5", values: [3, 3, 2, 3, 4, 3, 3, 3, 4, 5, 3] },
  ],
};

const ybsQualification: CoursePackage = {
  code: "YBS917",
  aliases: ["YBS918"],
  language: "Türkçe",
  level: "Doktora",
  teachingMode: "Yeterlik Çalışması",
  instructor: "Öğrencinin Danışmanı",
  theory: 0,
  practice: 0,
  credit: 0,
  ects: 6,
  purpose: "Öğrencinin Yönetim Bilişim Sistemleri alanındaki temel, ileri ve güncel bilgi birikimini; araştırma problemi geliştirme, yöntemsel karar verme, eleştirel analiz ve bilimsel savunma yeterliğini bütüncül olarak değerlendirmek.",
  content: "Yönetim Bilişim Sistemleri kuramları; yönetim, bilişim ve karar bilimleri; araştırma yöntemleri; veri analitiği ve bilgi sistemi modelleri; bilimsel etik; alan yazınının eleştirel değerlendirilmesi; özgün araştırma sorusu geliştirme ve yazılı/sözlü bilimsel savunma.",
  methods: "Bağımsız alan yazını çalışması, kuramsal ve yöntemsel problem çözme, deneme sınavları, yazılı ve sözlü yeterlik değerlendirmesi.",
  prerequisites: "Doktora ders yükü ve ilgili Enstitü yeterlik koşullarının tamamlanması.",
  resources: "YBS alanının temel ve güncel uluslararası kitapları, hakemli makaleleri, araştırma yöntemleri kaynakları ve öğrencinin uzmanlık alanına ilişkin çalışmalar.",
  sdgs: ["4", "9", "16"],
  outcomes: [
    "İleri YBS bilgi ve kuramlarını eleştirel biçimde sentezler.",
    "Karmaşık yönetim ve bilişim problemlerini bilimsel olarak analiz eder.",
    "Araştırma problemlerine uygun yöntemsel yaklaşımları gerekçelendirir.",
    "Alan yazınındaki bulguları özgün araştırma önerilerine dönüştürür.",
    "Bilimsel görüşlerini yazılı ve sözlü olarak savunur.",
  ],
  weeklyTopics: [
    "Yeterlik kapsamı ve çalışma planının oluşturulması",
    "YBS kuramlarının gözden geçirilmesi",
    "Yönetim ve organizasyon kuramlarının gözden geçirilmesi",
    "Bilgi sistemleri kuram ve modellerinin incelenmesi",
    "Karar bilimleri ve optimizasyon yaklaşımlarının incelenmesi",
    "Veri analitiği ve araştırma yöntemlerinin incelenmesi",
    "Nicel araştırma tasarımlarının değerlendirilmesi",
    "Nitel ve karma araştırma tasarımlarının değerlendirilmesi",
    "Bilimsel etik ve araştırma bütünlüğünün gözden geçirilmesi",
    "Güncel YBS literatürünün eleştirel sentezi",
    "Araştırma problemi ve yöntem eşleştirme çalışmaları",
    "Kuramsal ve uygulamalı problem çözme çalışmaları",
    "Yazılı bilimsel anlatım ve deneme değerlendirmesi",
    "Sözlü bilimsel savunma hazırlığı",
    "Yazılı ve sözlü doktora yeterlik değerlendirmesi",
  ],
  assessments: [{ name: "Doktora Yeterlik Sınavı", count: 1, weight: 100 }],
  workloads: [
    { name: "Alan Yazını ve Kuramsal Hazırlık", count: 1, hours: 75, total: 75 },
    { name: "Yöntem ve Problem Çözme Hazırlığı", count: 1, hours: 75, total: 75 },
    { name: "Yazılı ve Sözlü Yeterlik Değerlendirmesi", count: 1, hours: 30, total: 30 },
  ],
  contributionMatrix: [
    { outcome: "DÖÇ1", values: [5, 4, 4, 4, 5, 4, 4, 5, 3, 4, 4] },
    { outcome: "DÖÇ2", values: [4, 5, 4, 5, 4, 4, 3, 5, 3, 3, 5] },
    { outcome: "DÖÇ3", values: [4, 4, 5, 5, 4, 5, 3, 5, 4, 3, 4] },
    { outcome: "DÖÇ4", values: [5, 5, 5, 4, 5, 5, 5, 5, 4, 4, 5] },
    { outcome: "DÖÇ5", values: [4, 4, 3, 3, 5, 4, 4, 3, 5, 5, 3] },
  ],
};

const ybsThesis: CoursePackage = {
  code: "YBS91X",
  aliases: ["YBS911", "YBS912", "YBS913", "YBS914", "YBS915", "YBS916"],
  language: "Türkçe",
  level: "Doktora",
  teachingMode: "Bağımsız Araştırma / Danışmanlık",
  instructor: "Öğrencinin Danışmanı",
  theory: 0,
  practice: 0,
  credit: 0,
  ects: 24,
  purpose: "Yönetim Bilişim Sistemleri alanında bilime yenilik getiren, yeni bir yöntem geliştiren veya bilinen bir yöntemi yeni bir probleme uygulayan özgün bir araştırmayı bağımsız olarak yürütme, tez hâline getirme ve bilimsel olarak savunma yetkinliği kazandırmak.",
  content: "Özgün tez problemi ve araştırma soruları; ileri literatür incelemesi; kuramsal model ve araştırma tasarımı; etik izinler ve veri yönetimi; veri toplama, model geliştirme ve analiz; bulguların eleştirel yorumlanması; özgün katkının ortaya konulması; tez ve bilimsel yayın yazımı; tez izleme, düzeltme ve savunma süreçleri.",
  methods: "Bağımsız bilimsel araştırma, danışmanlık görüşmeleri, tez izleme, veri/model analizi, akademik yazım, bilimsel yayın hazırlığı ve jüri önünde savunma.",
  prerequisites: "Doktora yeterlik sınavında başarılı olunması ve tez önerisinin kabul edilmesi.",
  resources: "Doktora tez konusu ile ilgili güncel ulusal ve uluslararası kitaplar, hakemli makaleler, veri kaynakları, yöntemsel çalışmalar ve Enstitü tez yazım kılavuzu.",
  sdgs: ["4", "9", "16"],
  outcomes: [
    "YBS alanına özgün katkı sağlayan bir araştırmayı bağımsız yürütür.",
    "İleri kuram ve yöntemleri tez probleminde bütünleştirir.",
    "Araştırma verileri ile bulgularını eleştirel biçimde değerlendirir.",
    "Özgün araştırma sonuçlarını bilimsel yayın ve tez formatında raporlar.",
    "Tezinin yöntemini, bulgularını ve özgün katkısını bilimsel olarak savunur.",
  ],
  weeklyTopics: [
    "Tez araştırmasının dönem hedeflerinin belirlenmesi",
    "Araştırma problemi ve özgün katkının gözden geçirilmesi",
    "Güncel literatürün sistematik olarak güncellenmesi",
    "Kuramsal çerçeve veya modelin geliştirilmesi",
    "Araştırma tasarımı ve yöntemsel kararların değerlendirilmesi",
    "Etik izinler ve veri yönetimi süreçlerinin yürütülmesi",
    "Veri toplama veya model geliştirme çalışmaları",
    "Veri toplama veya model geliştirme çalışmalarının sürdürülmesi",
    "Veri analizi ve bulguların oluşturulması",
    "Bulguların geçerlilik ve güvenilirlik açısından değerlendirilmesi",
    "Bulguların YBS literatürü bağlamında tartışılması",
    "Tezin özgün katkısı ve sonuçlarının yapılandırılması",
    "Tez bölümleri ve bilimsel yayın taslağının hazırlanması",
    "Danışman veya tez izleme geri bildirimlerinin uygulanması",
    "Dönem ilerlemesinin raporlanması ve sonraki aşamanın planlanması",
  ],
  assessments: [{ name: "Tez Çalışması ve İlerleme Değerlendirmesi", count: 1, weight: 100 }],
  workloads: [
    { name: "Araştırma, Veri Toplama ve Model Geliştirme", count: 1, hours: 400, total: 400 },
    { name: "Analiz ve Bulguların Değerlendirilmesi", count: 1, hours: 200, total: 200 },
    { name: "Tez ve Bilimsel Yayın Yazımı", count: 1, hours: 120, total: 120 },
  ],
  contributionMatrix: [
    { outcome: "DÖÇ1", values: [5, 5, 5, 4, 4, 5, 5, 5, 4, 4, 5] },
    { outcome: "DÖÇ2", values: [5, 4, 5, 5, 4, 5, 5, 5, 4, 3, 5] },
    { outcome: "DÖÇ3", values: [4, 4, 4, 5, 5, 5, 5, 4, 4, 3, 4] },
    { outcome: "DÖÇ4", values: [4, 3, 3, 4, 5, 5, 5, 3, 5, 5, 4] },
    { outcome: "DÖÇ5", values: [4, 4, 4, 4, 5, 5, 5, 4, 5, 5, 4] },
  ],
};

export const COURSE_PACKAGES: CoursePackage[] = [
  ...ybsAcademicCoursePackages,
  ...makineCommonCoursePackages,
  ...makineAcademicCoursePackages,
  ...makineAcademicCoursePackages2,
  ...makineAcademicCoursePackages3,
  ...aileDanismanligiTezliCoursePackages,
  ...aileDanismanligiMissingCoursePackages,
  ...aileDanismanligiCommonCoursePackages,
  ...aileDanismanligiTezsizCoursePackages,
  ...aileDanismanligiTezsizCommonCoursePackages,
  ...arkeolojiTezliCoursePackages,
  ...arkeolojiMissingCoursePackages,
  ...bataryaTezliCoursePackages,
  ...bataryaCommonCoursePackages,
  ...bedenTezliCoursePackages,
  ...bedenCommonCoursePackages,
  ...bedenTezsizCoursePackages,
  ...bedenTezsizCommonCoursePackages,
  ...biyolojiTezliCoursePackages,
  ...biyolojiCommonCoursePackages,
  ...biyolojiTezsizCoursePackages,
  ...biyolojiTezsizCommonCoursePackages,
  ...ekonomiFinansTezsizCoursePackages,
  ...ekonomiFinansTezsizCommonCoursePackages,
  ...biyolojiDoktoraCoursePackages,
  ...biyolojiDoktoraCommonCoursePackages,
  ...ebelikTezliCoursePackages,
  ...ebelikCommonCoursePackages,
  ...ekoturizmTezliCoursePackages,
  ...ekoturizmCommonCoursePackages,
  ...elektrikElektronikTezliCoursePackages,
  ...elektrikElektronikCommonCoursePackages,
  ...enerjiSistemleriTezliCoursePackages,
  ...enerjiSistemleriCommonCoursePackages,
  ...enerjiSistemleriDoktoraCoursePackages,
  ...enerjiSistemleriDoktoraCommonCoursePackages,
  ...felsefeDinTezliCoursePackages,
  ...felsefeDinCommonCoursePackages,
  ...fizikTezliCoursePackages,
  ...fizikCommonCoursePackages,
  ...fizikDoktoraCoursePackages,
  ...fizikDoktoraCommonCoursePackages,
  ...gastronomiTezliCoursePackages,
  ...gastronomiCommonCoursePackages,
  ...gidaMuhendisligiTezliCoursePackages,
  ...gidaMuhendisligiCommonCoursePackages,
  ...gidaMuhendisligiDoktoraCoursePackages,
  ...gidaMuhendisligiDoktoraCommonCoursePackages,
  ...gidaTeknolojisiTezliCoursePackages,
  ...gidaTeknolojisiCommonCoursePackages,
  ...haritaMuhendisligiTezliCoursePackages,
  ...haritaMuhendisligiCommonCoursePackages,
  ...icHastaliklariHemsireligiTezliCoursePackages,
  ...icHastaliklariHemsireligiCommonCoursePackages,
  ...iktisatTezliCoursePackages,
  ...iktisatCommonCoursePackages,
  ...insaatMuhendisligiTezliCoursePackages,
  ...insaatMuhendisligiCommonCoursePackages,
  ...insaatMuhendisligiDoktoraCoursePackages,
  ...insaatMuhendisligiDoktoraCommonCoursePackages,
  ...isletmeTezliCoursePackages,
  ...isletmeCommonCoursePackages,
  ...isletmeDoktoraCoursePackages,
  ...isletmeDoktoraCommonCoursePackages,
  ...kimyaTezliCoursePackages,
  ...kimyaCommonCoursePackages,
  ...kimyaDoktoraCoursePackages,
  ...kimyaDoktoraCommonCoursePackages,
  ...makineMuhendisligiDoktoraCoursePackages,
  ...makineMuhendisligiDoktoraCommonCoursePackages,
  ...matematikTezliCoursePackages,
  ...matematikCommonCoursePackages,
  ...muhasebeFinansmanTezliCoursePackages,
  ...muhasebeFinansmanCommonCoursePackages,
  ...organikTarimIsletmeciligiTezliCoursePackages,
  ...organikTarimIsletmeciligiCommonCoursePackages,
  ...resimTezliCoursePackages,
  ...resimCommonCoursePackages,
  ...siyasetKamuYonetimiTezliCoursePackages,
  ...siyasetKamuYonetimiCommonCoursePackages,
  ...siyasetKamuYonetimiDoktoraCoursePackages,
  ...siyasetKamuYonetimiDoktoraCommonCoursePackages,
  ...tarihTezliCoursePackages,
  ...tarihCommonCoursePackages,
  ...temelIslamBilimleriTezliCoursePackages,
  ...temelIslamBilimleriCommonCoursePackages,
  ...turkDiliEdebiyatiTezliCoursePackages,
  ...turkDiliEdebiyatiCommonCoursePackages,
  ...turkDiliEdebiyatiDoktoraCoursePackages,
  ...turkDiliEdebiyatiDoktoraCommonCoursePackages,
  ...ybsTezliCoursePackages,
  ...ybsTezliCommonCoursePackages,
  ...yonetimOrganizasyonCoursePackages,
  ...yonetimOrganizasyonCommonCoursePackages,
  ...arkeolojiCommonCoursePackages,
  ybs919,
  ybs921,
  ybs923,
  ybsSpecialization,
  ybsResearchEthics,
  ybsAdvising,
  ybsSeminar,
  ybsQualification,
  ybsThesis,
].map((coursePackage) => ({
  ...coursePackage,
  instructor: sanitizeInstructorName(coursePackage.instructor || ""),
  contributionMatrix: ["Arkeoloji ABD", "Biyoloji ABD", "Ebelik ABD", "Ekoturizm Rehberliği ABD", "Elektrik Elektronik Mühendisliği ABD", "Enerji Sistemleri Mühendisliği ABD", "Felsefe ve Din Bilimleri ABD", "Fizik ABD", "Gastronomi ve Mutfak Sanatları ABD", "Gıda Mühendisliği ABD", "Gıda Teknolojisi ABD", "Harita Mühendisliği ABD", "Hemşirelik ABD", "İktisat ABD", "İnşaat Mühendisliği ABD", "İşletme", "Kimya ABD", "Matematik ABD", "Muhasebe ve Finansman", "Organik Tarım İşletmeciliği ABD", "Resim ASD", "Siyaset Bilimi ve Kamu Yönetimi ABD", "Tarih ABD", "Temel İslam Bilimleri ABD", "Türk Dili ve Edebiyatı ABD", "Yönetim Bilişim Sistemleri ABD", "Yönetim Organizasyon"].includes(coursePackage.department || "")
    ? coursePackage.contributionMatrix
    : buildSemanticContributionMatrix(coursePackage.outcomes, coursePackage),
}));

export const getCoursePackage = (code: string, department = "", programName = "") =>
  COURSE_PACKAGES.find((coursePackage) => {
    const normalizedCode = code.trim().toLocaleUpperCase("tr-TR");
    const codeMatches = coursePackage.code === normalizedCode || coursePackage.aliases?.includes(normalizedCode);
    const departmentMatches = !coursePackage.department || coursePackage.department === department;
    const programMatches = !coursePackage.programName || coursePackage.programName === programName;
    return codeMatches && departmentMatches && programMatches;
  });

import type { CoursePackage, CourseQualityCheck } from "./coursePackages";

type Definition = {
  code: string;
  name: string;
  instructor?: string;
  purpose: string;
  content: string;
  outcomes: string[];
  topics: string[];
  matrix: number[][];
  sdgs: string[];
};

const qualityChecks: CourseQualityCheck[] = [
  "Ders adı ve kodları doğrulandı mı?", "Tüm OBS linkleri gerçek mi?", "Dersin program düzeyi doğru mu?",
  "Ders amacı açık ve uygun mu?", "Ders amacı program düzeyine uygun mu?", "DÖÇ sayısı ve kapsamı uygun mu?",
  "DÖÇ'ler ölçülebilir mi?", "Bloom fiilleri uygun mu?", "Bloom düzeyi program düzeyine uygun mu?",
  "Amaç–DÖÇ uyumu sağlandı mı?", "DÖÇ–içerik uyumu sağlandı mı?", "İçerik–haftalık plan uyumu sağlandı mı?",
  "DÖÇ–öğretim yöntemi uyumu sağlandı mı?", "DÖÇ–ölçme/değerlendirme uyumu sağlandı mı?",
  "AKTS–iş yükü tutarlı mı?", "DÖÇ–PÇ matrisi gerçekçi mi?", "1–5 katkı düzeyleri doğru kullanılmış mı?",
  "Yapay yüksek ilişkilendirme var mı?", "Tekrarlı kodlar doğru tekilleştirildi mi?",
  "Kaynakta olmayan bilgi kesin bilgi gibi yazılmış mı?", "Eksik/doğrulanması gereken alan kaldı mı?",
].map((item, index) => ({
  item,
  status: index === 1 || index === 20 ? "Doğrulanmalı" : [3, 5, 6, 7, 9, 10, 11, 12, 14, 15, 16].includes(index) ? "Revize Edildi" : "Uygun",
}));

const definitions: Definition[] = [
  {
    code: "ADE810", name: "BİLİMSEL ARAŞTIRMA VE YAYIN ETİĞİ", sdgs: ["4", "10", "16"],
    purpose: "Aile danışmanlığı ve eğitimi alanındaki araştırma problemlerini bilimsel yöntemlerle yapılandırma, uygun araştırma yaklaşımını gerekçelendirme ve araştırma-yayın etiği ilkelerini uygulama yetkinliği kazandırmak.",
    content: "Bilimsel araştırma süreci; aile araştırmalarında problem ve soru geliştirme; nicel, nitel ve karma yöntem tasarımları; örnekleme, veri toplama ve analiz; geçerlik-güvenirlik; bilimsel yazım, etik kurul, bilgilendirilmiş onam, gizlilik, araştırma bütünlüğü ve yayın etiği.",
    outcomes: [
      "Aile araştırmalarına uygun araştırma problemini ve sorularını yapılandırır.",
      "Araştırma problemine uygun yöntemi ve örnekleme yaklaşımını gerekçelendirir.",
      "Veri toplama ve analiz süreçlerinin bilimsel niteliğini değerlendirir.",
      "Araştırma sonuçlarını akademik yazım ilkelerine göre raporlar.",
      "Araştırma ve yayın etiği ilkelerini aile çalışmalarına uygular.",
    ],
    topics: ["Bilimsel bilgi ve aile araştırmalarının kapsamı", "Araştırma problemi ve amaç", "Araştırma soruları ve hipotezler", "Alan yazını tarama ve kaynak değerlendirme", "Nicel araştırma desenleri", "Nitel araştırma desenleri", "Karma yöntem araştırmaları", "Evren, örneklem ve çalışma grubu", "Aile araştırmalarında veri toplama araçları", "Nicel veri analizinin temel ilkeleri", "Nitel veri analizinin temel ilkeleri", "Geçerlik, güvenirlik ve inandırıcılık", "Bilimsel yazım ve kaynak gösterme", "Etik kurul, onam, gizlilik ve hassas gruplar", "Araştırma bütünlüğü ve yayın etiği"],
    matrix: [[3,4,2,2,5,2,2,3,3,3,4],[2,4,3,2,5,3,2,2,3,3,4],[2,5,3,2,5,2,3,3,3,3,4],[2,3,2,2,4,2,2,5,4,3,4],[2,3,2,2,4,3,2,4,5,5,4]],
  },
  {
    code: "ADE823", name: "AİLEDE GELİŞİM PSİKOLOJİSİ", sdgs: ["3", "4", "10"],
    purpose: "Bireyin yaşam boyu gelişimini aile sistemi ve aile yaşam döngüsü bağlamında analiz ederek gelişimsel gereksinimlere uygun aile danışmanlığı değerlendirmeleri yapma yetkinliği kazandırmak.",
    content: "Yaşam boyu gelişim kuramları; bağlanma, bilişsel, duygusal, sosyal ve ahlaki gelişim; çocukluk, ergenlik, yetişkinlik ve yaşlılık dönemlerinde aile ilişkileri; aile yaşam döngüsü, gelişimsel geçişler, risk ve koruyucu etmenler.",
    outcomes: [
      "Yaşam boyu gelişim kuramlarını aile sistemi bağlamında analiz eder.",
      "Gelişim dönemlerinin aile ilişkilerine etkilerini karşılaştırır.",
      "Aile yaşam döngüsündeki geçiş ve krizleri gelişimsel açıdan değerlendirir.",
      "Risk ve koruyucu etmenleri gelişimsel gereksinimlerle ilişkilendirir.",
      "Gelişimsel verilere dayalı aile danışmanlığı hedefleri oluşturur.",
    ],
    topics: ["Yaşam boyu gelişim ve aile sistemi", "Gelişim kuramlarının aileye yansımaları", "Bağlanma gelişimi ve bakım veren ilişkileri", "Bebeklik döneminde aile etkileşimi", "Erken çocuklukta bilişsel ve duygusal gelişim", "Okul döneminde sosyal gelişim ve aile", "Ergenlikte kimlik gelişimi", "Ergenlik döneminde ebeveyn-çocuk ilişkileri", "Genç yetişkinlik ve aileden ayrışma", "Eş seçimi, yakın ilişkiler ve evlilik", "Ebeveynliğe geçiş ve aile rolleri", "Orta yetişkinlikte aile yaşamı", "Yaşlılık, kuşaklar arası ilişkiler ve bakım", "Gelişimsel krizlerde risk ve koruyucu etmenler", "Aile yaşam döngüsünün bütüncül değerlendirilmesi"],
    matrix: [[5,4,3,3,2,3,2,2,3,4,4],[4,5,4,3,2,3,2,2,3,5,4],[4,5,4,4,2,3,2,3,3,5,4],[3,5,4,4,3,4,2,3,4,5,4],[4,4,4,5,2,3,2,3,4,5,4]],
  },
  {
    code: "ADE826", name: "ÖZEL GEREKSİNİMLİ ÇOCUĞU OLAN AİLELERLE ÇALIŞMA", instructor: "Dr. Öğr. Üyesi CANAN BÜYÜKAŞIK ÇOLAK", sdgs: ["3", "4", "10"],
    purpose: "Özel gereksinimli çocuğu olan ailelerin psikososyal gereksinimlerini aile sistemi içinde değerlendirme ve aile merkezli, hak temelli destek süreçleri planlama yetkinliği kazandırmak.",
    content: "Özel gereksinim ve aile sistemi; tanı sürecine aile tepkileri, stres ve uyum, ebeveyn ve kardeş deneyimleri, aile gereksinimlerinin değerlendirilmesi, aile merkezli danışmanlık, sosyal destek, eğitim kurumlarıyla iş birliği, haklar, kapsayıcılık ve etik duyarlılık.",
    outcomes: [
      "Özel gereksinimin aile sistemi üzerindeki etkilerini analiz eder.",
      "Ailenin psikososyal gereksinimlerini çok boyutlu olarak değerlendirir.",
      "Aile merkezli danışmanlık hedeflerini gereksinimlere göre planlar.",
      "Aile, okul ve destek kurumları arasındaki iş birliğini yapılandırır.",
      "Destek süreçlerini etik, hak temelli ve kültürel duyarlılıkla değerlendirir.",
    ],
    topics: ["Özel gereksinim kavramı ve aile sistemi", "Tanılama sürecinde aile deneyimleri", "Kayıp, yas, kabul ve uyum süreçleri", "Ebeveyn stresi ve baş etme kaynakları", "Aile içi roller ve ilişkiler", "Kardeşlerin deneyimleri ve gereksinimleri", "Aile gereksinimlerini değerlendirme", "Aile merkezli yaklaşımın ilkeleri", "Aile danışmanlığında hedef belirleme", "Ebeveyn güçlendirme ve psikoeğitim", "Sosyal destek ağları ve toplumsal kaynaklar", "Okul-aile iş birliği", "Geçiş dönemleri ve yaşam boyu planlama", "Engelli hakları, kapsayıcılık ve erişilebilirlik", "Etik ve kültürel duyarlılıkla aile destek planı"],
    matrix: [[5,5,4,3,2,4,2,3,4,5,4],[4,5,4,3,2,4,2,3,4,5,4],[4,5,5,5,2,4,2,3,4,5,4],[3,4,4,5,2,5,3,4,4,5,4],[4,4,4,4,2,4,2,4,5,5,4]],
  },
  {
    code: "ADE827", name: "ÇOCUKLARDA DAVRANIŞ BOZUKLUĞU VE AİLE", sdgs: ["3", "4", "16"],
    purpose: "Çocuklarda görülen davranış sorunlarını gelişimsel ve aile sistemik etmenlerle birlikte değerlendirme ve aileye yönelik önleyici-destekleyici danışmanlık hedefleri geliştirme yetkinliği kazandırmak.",
    content: "Davranış sorunu ve bozukluk ayrımı; gelişimsel değerlendirme, risk ve koruyucu etmenler; dışa ve içe yönelim sorunları; ebeveyn tutumları, aile iletişimi, okul ve akran bağlamı; işlevsel davranış değerlendirmesi, aileyle görüşme ve yönlendirme sınırları.",
    outcomes: [
      "Çocuk davranışlarını gelişimsel ve bağlamsal ölçütlerle analiz eder.",
      "Davranış sorunlarında ailevi risk ve koruyucu etmenleri değerlendirir.",
      "Davranışın işlevi ile aile etkileşim örüntülerini ilişkilendirir.",
      "Aileye yönelik önleyici ve destekleyici danışmanlık hedefleri geliştirir.",
      "Mesleki sınırlar içinde uygun iş birliği ve yönlendirmeyi gerekçelendirir.",
    ],
    topics: ["Çocuklarda davranış sorunu ve bozukluk kavramları", "Gelişimsel normlar ve davranışın bağlamı", "Davranışın işlevsel değerlendirilmesi", "Aile sistemi ve davranış örüntüleri", "Ebeveyn tutumları ve disiplin yaklaşımları", "Karşı gelme ve öfke davranışları", "Saldırganlık ve akran ilişkileri", "Dikkat ve dürtü kontrolü sorunları", "Kaygı ve içe yönelim davranışları", "Okul reddi ve okul-aile etkileşimi", "Ekran kullanımı ve davranış düzenleme", "Aileyle görüşme ve bilgi toplama", "Olumlu davranış desteği ve ebeveyn rehberliği", "Okul ve uzmanlarla iş birliği", "Etik sınırlar, risk durumları ve yönlendirme"],
    matrix: [[5,5,4,3,2,3,2,3,4,5,4],[4,5,4,3,2,4,2,3,4,5,4],[4,5,5,4,2,3,2,3,4,4,4],[4,4,5,5,2,3,2,3,4,5,4],[3,4,4,4,2,5,2,4,5,5,4]],
  },
];

export const aileDanismanligiMissingCoursePackages: CoursePackage[] = definitions.map((course) => ({
  code: course.code, name: course.name, department: "Aile Danışmanlığı ve Eğitimi ABD",
  programName: "Aile Danışmanlığı ve Eğitimi", language: "Türkçe", level: "Tezli Yüksek Lisans",
  teachingMode: "Yüz Yüze", instructor: course.instructor || "Atama Bekliyor", theory: 3, practice: 0,
  credit: 3, ects: 6, prerequisites: "Yok", purpose: course.purpose, content: course.content,
  methods: course.code === "ADE810"
    ? "Anlatım, araştırma örneği inceleme, yöntem karşılaştırma, makale çözümleme ve akademik tartışma."
    : "Anlatım, alan yazını incelemesi, vaka temelli çözümleme, karşılaştırmalı değerlendirme ve akademik tartışma.",
  resources: "Dersin kapsamına uygun güncel aile danışmanlığı, psikoloji ve eğitim bilimleri yayınları ile öğretim elemanının belirleyeceği temel kaynaklar.",
  sdgs: course.sdgs, outcomes: course.outcomes, weeklyTopics: course.topics,
  assessments: [{ name: "Ara Sınav", count: 1, weight: 40 }, { name: "Yarıyıl Sonu Sınavı", count: 1, weight: 60 }],
  workloads: [
    { name: "Ders Süresi", count: 15, hours: 3, total: 45 },
    { name: "Sınıf Dışı Çalışma Süresi", count: 15, hours: 6, total: 90 },
    { name: "Ara Sınav Hazırlığı", count: 1, hours: 20, total: 20 },
    { name: "Yarıyıl Sonu Sınavı Hazırlığı", count: 1, hours: 25, total: 25 },
  ],
  contributionMatrix: course.matrix.map((values, index) => ({ outcome: `DÖÇ${index + 1}`, values })),
  qualityChecks, publicQualityChecklist: false,
}));

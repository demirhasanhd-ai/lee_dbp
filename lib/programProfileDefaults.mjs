// Preserve the original generic profile as seed data, never as a display fallback.
export const defaultProgramOutcomes = [
  "Alanındaki ileri düzey bilgileri bilimsel araştırma süreçlerinde kullanır.",
  "Disiplinler arası yaklaşımla problem tanımlar ve çözüm önerileri geliştirir.",
  "Araştırma sonuçlarını etik ilkeler doğrultusunda değerlendirir ve raporlar.",
  "Alanındaki güncel gelişmeleri izler, yorumlar ve uygulamaya aktarır.",
  "Akademik ve mesleki ortamlarda etkili iletişim kurar.",
  "Yaşam boyu öğrenme yaklaşımıyla mesleki gelişimini sürdürür.",
];

export const defaultProgramSections = [
  ["Program Tarihçesi", "Program, Osmaniye Korkut Ata Üniversitesi Lisansüstü Eğitim Enstitüsü bünyesinde alanında uzman araştırmacılar yetiştirmek amacıyla yapılandırılmıştır. Eğitim-öğretim, bilimsel araştırma ve toplumsal katkı faaliyetleri enstitü kalite süreçleriyle uyumlu biçimde yürütülür."],
  ["Program Profili", "Program; kuramsal bilgi, araştırma yöntemi, uygulama becerisi ve etik sorumlulukları birlikte ele alan lisansüstü bir akademik yapı sunar. Öğrencilerin alanlarında derinleşmeleri, özgün araştırma yapmaları ve bilimsel üretime katkı sağlamaları hedeflenir."],
  ["Ders Yapısı ve Kredileri", "Programda zorunlu ve seçmeli dersler, seminer/uzmanlık alan dersleri ve ilgili düzeye göre proje ya da tez çalışmaları yer alır. Dersler güz ve bahar yarıyıllarında yürütülür; AKTS yükleri öğrenci iş yükü esas alınarak tanımlanır."],
  ["Mezuniyet Koşulları", "Öğrencinin programda tanımlı dersleri, AKTS yükünü, seminer/proje/tez yükümlülüklerini ve enstitü yönetmeliğinde belirtilen başarı koşullarını tamamlaması gerekir."],
  ["Ölçme ve Değerlendirme", "Her ders için ölçme ve değerlendirme yöntemleri ders bilgi paketinde belirtilir. Ara sınav, yarıyıl sonu sınavı, ödev, proje, sunum ve uygulama çalışmaları ilgili öğretim elemanı tarafından tanımlanır."],
  ["Üst Derece Programlarına Geçiş", "Programı başarıyla tamamlayan mezunlar, ilgili mevzuat ve başvuru koşullarını sağlamaları halinde üst derece programlara başvurabilir."],
  ["Önceki Öğrenmenin Tanınması", "Muafiyet, intibak ve önceki öğrenmenin tanınmasına ilişkin işlemler enstitü mevzuatı, ilgili kurul kararları ve akademik birim değerlendirmeleri doğrultusunda yürütülür."],
  ["Mezunların Mesleki Profilleri", "Mezunlar; akademi, kamu kurumları, özel sektör, araştırma merkezleri ve alanlarıyla ilişkili uzmanlık gerektiren görevlerde çalışabilir."],
  ["Kabul ve Kayıt Koşulları", "Programa kabul; diploma, ALES, yabancı dil, bilim sınavı veya mülakat gibi enstitü tarafından ilan edilen koşullar çerçevesinde yapılır. Kesin kayıt işlemleri ilgili mevzuata göre tamamlanır."],
];

export function defaultProgramProfile(programName, level) {
  const doctorate = level === "Doktora";
  return {
    programName,
    level,
    degree: `${programName} ${doctorate ? "Doktora" : "Yüksek Lisans"} Derecesi`,
    manager: "",
    language: "Türkçe",
    qualificationRules: doctorate ? "4 yıl, 8 yarıyıl ve ilgili doktora yeterlilik/tez süreçleri" : "2 yıl, 4 yarıyıl ve toplam 120 AKTS",
    sections: defaultProgramSections.map(([title, text]) => ({ title, text })),
    outcomes: [...defaultProgramOutcomes],
    tyycRows: [],
  };
}

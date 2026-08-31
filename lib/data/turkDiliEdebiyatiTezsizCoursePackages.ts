// Türk Dili ve Edebiyatı tezsiz resmî müfredatı ve mevcut 11 LEE_DBP PÇ'si temel alınmıştır; program profili değiştirilmemiştir.
import type { CoursePackage } from "./coursePackages";

export const turkDiliEdebiyatiTezsizCoursePackages: CoursePackage[] = [
  {
    "code": "TDE703",
    "name": "Bilimsel araştırma yöntemleri ve yayın etiği",
    "department": "Türk Dili ve Edebiyatı ABD",
    "programName": "Türk Dili ve Edebiyatı",
    "language": "Türkçe",
    "level": "Tezsiz Yüksek Lisans",
    "teachingMode": "Yüz Yüze",
    "instructor": "Prof. Dr. AHMET DEMİRTAŞ",
    "theory": 3,
    "practice": 0,
    "credit": 3,
    "ects": 6,
    "prerequisites": "Yok",
    "purpose": "Öğrencinin bilimsel bilgi ve araştırma etiği, araştırma probleminin yapılandırılması ve kaynak, veri ve metin çözümleme alanlarında ileri düzey çözümleme, karşılaştırma ve yorumlama becerisi geliştirmesini sağlamak.",
    "content": "Ders; bilimsel bilgi ve araştırma etiği, araştırma probleminin yapılandırılması, nitel ve nicel araştırma yaklaşımları, kaynak, veri ve metin çözümleme, akademik yazım ve yayın etiği konularını Türk dili ve edebiyatı araştırmalarının tarihsel, kültürel ve kuramsal bağlamlarıyla ilişkilendirerek ele alır.",
    "methods": "Kuramsal anlatım, yönlendirilmiş tartışma, kaynak ve metin incelemesi, karşılaştırmalı çözümleme, bireysel çalışma ve yapılandırılmış geri bildirim.",
    "resources": "Türk Dil Kurumu yayınları ve sözlükleri; Türkiye Yazma Eserler Kurumu Başkanlığı koleksiyonları; alanın temel başvuru eserleri; TÜBİTAK ULAKBİM TR Dizin ve güncel hakemli Türk dili ve edebiyatı araştırmaları.",
    "sdgs": [
      "4",
      "10",
      "11"
    ],
    "outcomes": [
      "Bilimsel bilgi ve araştırma etiği ile ilgili ileri kavramları analiz eder.",
      "Araştırma probleminin yapılandırılması kapsamında kaynak ve metinleri eleştirel değerlendirir.",
      "Nitel ve nicel araştırma yaklaşımları ile ilişkili dilsel veya edebî örnekleri karşılaştırır.",
      "Kaynak, veri ve metin çözümleme için uygun çözümleme yaklaşımını uygular.",
      "Akademik yazım ve yayın etiği temelinde gerekçeli akademik yorum geliştirir."
    ],
    "weeklyTopics": [
      "Bilimsel bilgi ve araştırma etiği: kapsam ve temel kavramlar",
      "Bilimsel bilgi ve araştırma etiği: tarihsel ve kuramsal çerçeve",
      "Bilimsel bilgi ve araştırma etiği: kaynak ve metin türleri",
      "Araştırma probleminin yapılandırılması: temel ilkeler",
      "Araştırma probleminin yapılandırılması: örneklerin çözümlenmesi",
      "Araştırma probleminin yapılandırılması: farklı yaklaşımların karşılaştırılması",
      "Nitel ve nicel araştırma yaklaşımları: kavramsal yapı",
      "Nitel ve nicel araştırma yaklaşımları: metin veya dil verilerine uygulama",
      "Nitel ve nicel araştırma yaklaşımları: bulguların yorumlanması",
      "Kaynak, veri ve metin çözümleme: yöntem ve teknikler",
      "Kaynak, veri ve metin çözümleme: seçilmiş örneklerin incelenmesi",
      "Kaynak, veri ve metin çözümleme: bağlam ve işlev ilişkisi",
      "Akademik yazım ve yayın etiği: güncel tartışmalar",
      "Akademik yazım ve yayın etiği: etik ve kültürel boyutlar",
      "Akademik yazım ve yayın etiği: bütüncül akademik değerlendirme"
    ],
    "assessments": [
      {
        "name": "Ara Sınav",
        "count": 1,
        "weight": 40
      },
      {
        "name": "Yarıyıl Sonu Sınavı",
        "count": 1,
        "weight": 60
      }
    ],
    "workloads": [
      {
        "name": "Ders Süresi",
        "count": 15,
        "hours": 3,
        "total": 45
      },
      {
        "name": "Sınıf Dışı Çalışma Süresi",
        "count": 15,
        "hours": 6,
        "total": 90
      },
      {
        "name": "Ara Sınav Hazırlığı",
        "count": 1,
        "hours": 20,
        "total": 20
      },
      {
        "name": "Yarıyıl Sonu Sınavı Hazırlığı",
        "count": 1,
        "hours": 25,
        "total": 25
      }
    ],
    "contributionMatrix": [
      {
        "outcome": "DÖÇ1",
        "values": [
          2,
          2,
          4,
          4,
          2,
          2,
          4,
          4,
          4,
          4,
          4
        ]
      },
      {
        "outcome": "DÖÇ2",
        "values": [
          3,
          3,
          4,
          4,
          3,
          3,
          4,
          4,
          4,
          4,
          4
        ]
      },
      {
        "outcome": "DÖÇ3",
        "values": [
          2,
          2,
          5,
          5,
          2,
          2,
          5,
          5,
          5,
          5,
          5
        ]
      },
      {
        "outcome": "DÖÇ4",
        "values": [
          3,
          3,
          4,
          4,
          3,
          3,
          4,
          4,
          4,
          4,
          4
        ]
      },
      {
        "outcome": "DÖÇ5",
        "values": [
          2,
          2,
          5,
          5,
          2,
          2,
          5,
          5,
          5,
          5,
          5
        ]
      }
    ],
    "qualityChecks": [
      {
        "item": "Ders adı ve kodları doğrulandı mı?",
        "status": "Uygun"
      },
      {
        "item": "Tüm OBS bağlantıları gerçek mi?",
        "status": "Doğrulanmalı",
        "note": "Kesin OBS ders paketi bağlantısı bulunmadığından resmî müfredat kimliği korunmuş; eksik akademik alanlar handoff ölçütleri ve LEE_DBP'deki güncel 11 PÇ temelinde öneri niteliğinde tamamlanmıştır."
      },
      {
        "item": "Dersin program düzeyi doğru mu?",
        "status": "Uygun"
      },
      {
        "item": "Ders amacı açık ve uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "Ders amacı program düzeyine uygun mu?",
        "status": "Uygun"
      },
      {
        "item": "DÖÇ sayısı ve kapsamı uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ'ler ölçülebilir mi?",
        "status": "Revize Edildi"
      },
      {
        "item": "Bloom fiilleri uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "Bloom düzeyi program düzeyine uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "Amaç–DÖÇ uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–içerik uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "İçerik–haftalık plan uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–öğretim yöntemi uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–ölçme/değerlendirme uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "AKTS–iş yükü tutarlı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–PÇ matrisi gerçekçi mi?",
        "status": "Revize Edildi"
      },
      {
        "item": "1–5 katkı düzeyleri doğru kullanılmış mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "Yapay yüksek ilişkilendirme var mı?",
        "status": "Uygun"
      },
      {
        "item": "Tekrarlı kodlar doğru tekilleştirildi mi?",
        "status": "Revize Edildi"
      },
      {
        "item": "Kaynakta olmayan bilgi kesin bilgi gibi yazılmış mı?",
        "status": "Doğrulanmalı",
        "note": "Kesin OBS ders paketi bağlantısı bulunmadığından resmî müfredat kimliği korunmuş; eksik akademik alanlar handoff ölçütleri ve LEE_DBP'deki güncel 11 PÇ temelinde öneri niteliğinde tamamlanmıştır."
      },
      {
        "item": "Eksik/doğrulanması gereken alan kaldı mı?",
        "status": "Doğrulanmalı",
        "note": "Kesin OBS ders paketi bağlantısı bulunmadığından resmî müfredat kimliği korunmuş; eksik akademik alanlar handoff ölçütleri ve LEE_DBP'deki güncel 11 PÇ temelinde öneri niteliğinde tamamlanmıştır."
      }
    ],
    "publicQualityChecklist": false
  },
  {
    "code": "TDE705",
    "name": "Sözlü anlatım türleri ve eğitimi-ı",
    "department": "Türk Dili ve Edebiyatı ABD",
    "programName": "Türk Dili ve Edebiyatı",
    "language": "Türkçe",
    "level": "Tezsiz Yüksek Lisans",
    "teachingMode": "Yüz Yüze",
    "instructor": "Prof. Dr. CENGİZ GÖKŞEN",
    "theory": 3,
    "practice": 0,
    "credit": 3,
    "ects": 6,
    "prerequisites": "Yok",
    "purpose": "Öğrencinin sözlü anlatım geleneği ve türleri, anlatıcı, icra ortamı ve dinleyici ilişkisi ve alan araştırması ve metin çözümleme alanlarında ileri düzey çözümleme, karşılaştırma ve yorumlama becerisi geliştirmesini sağlamak.",
    "content": "Ders; sözlü anlatım geleneği ve türleri, anlatıcı, icra ortamı ve dinleyici ilişkisi, sözlü anlatıların yapı ve işlevleri, alan araştırması ve metin çözümleme, sözlü kültür ürünlerinin eğitim ve aktarımı konularını Türk dili ve edebiyatı araştırmalarının tarihsel, kültürel ve kuramsal bağlamlarıyla ilişkilendirerek ele alır.",
    "methods": "Kuramsal anlatım, yönlendirilmiş tartışma, kaynak ve metin incelemesi, karşılaştırmalı çözümleme, bireysel çalışma ve yapılandırılmış geri bildirim.",
    "resources": "Türk Dil Kurumu yayınları ve sözlükleri; Türkiye Yazma Eserler Kurumu Başkanlığı koleksiyonları; alanın temel başvuru eserleri; TÜBİTAK ULAKBİM TR Dizin ve güncel hakemli Türk dili ve edebiyatı araştırmaları.",
    "sdgs": [
      "4",
      "10",
      "11"
    ],
    "outcomes": [
      "Sözlü anlatım geleneği ve türleri ile ilgili ileri kavramları analiz eder.",
      "Anlatıcı, icra ortamı ve dinleyici ilişkisi kapsamında kaynak ve metinleri eleştirel değerlendirir.",
      "Sözlü anlatıların yapı ve işlevleri ile ilişkili dilsel veya edebî örnekleri karşılaştırır.",
      "Alan araştırması ve metin çözümleme için uygun çözümleme yaklaşımını uygular.",
      "Sözlü kültür ürünlerinin eğitim ve aktarımı temelinde gerekçeli akademik yorum geliştirir."
    ],
    "weeklyTopics": [
      "Sözlü anlatım geleneği ve türleri: kapsam ve temel kavramlar",
      "Sözlü anlatım geleneği ve türleri: tarihsel ve kuramsal çerçeve",
      "Sözlü anlatım geleneği ve türleri: kaynak ve metin türleri",
      "Anlatıcı, icra ortamı ve dinleyici ilişkisi: temel ilkeler",
      "Anlatıcı, icra ortamı ve dinleyici ilişkisi: örneklerin çözümlenmesi",
      "Anlatıcı, icra ortamı ve dinleyici ilişkisi: farklı yaklaşımların karşılaştırılması",
      "Sözlü anlatıların yapı ve işlevleri: kavramsal yapı",
      "Sözlü anlatıların yapı ve işlevleri: metin veya dil verilerine uygulama",
      "Sözlü anlatıların yapı ve işlevleri: bulguların yorumlanması",
      "Alan araştırması ve metin çözümleme: yöntem ve teknikler",
      "Alan araştırması ve metin çözümleme: seçilmiş örneklerin incelenmesi",
      "Alan araştırması ve metin çözümleme: bağlam ve işlev ilişkisi",
      "Sözlü kültür ürünlerinin eğitim ve aktarımı: güncel tartışmalar",
      "Sözlü kültür ürünlerinin eğitim ve aktarımı: etik ve kültürel boyutlar",
      "Sözlü kültür ürünlerinin eğitim ve aktarımı: bütüncül akademik değerlendirme"
    ],
    "assessments": [
      {
        "name": "Ara Sınav",
        "count": 1,
        "weight": 40
      },
      {
        "name": "Yarıyıl Sonu Sınavı",
        "count": 1,
        "weight": 60
      }
    ],
    "workloads": [
      {
        "name": "Ders Süresi",
        "count": 15,
        "hours": 3,
        "total": 45
      },
      {
        "name": "Sınıf Dışı Çalışma Süresi",
        "count": 15,
        "hours": 6,
        "total": 90
      },
      {
        "name": "Ara Sınav Hazırlığı",
        "count": 1,
        "hours": 20,
        "total": 20
      },
      {
        "name": "Yarıyıl Sonu Sınavı Hazırlığı",
        "count": 1,
        "hours": 25,
        "total": 25
      }
    ],
    "contributionMatrix": [
      {
        "outcome": "DÖÇ1",
        "values": [
          4,
          4,
          4,
          4,
          4,
          4,
          2,
          4,
          2,
          4,
          2
        ]
      },
      {
        "outcome": "DÖÇ2",
        "values": [
          4,
          4,
          4,
          4,
          4,
          4,
          3,
          4,
          3,
          4,
          3
        ]
      },
      {
        "outcome": "DÖÇ3",
        "values": [
          5,
          5,
          5,
          5,
          5,
          5,
          2,
          5,
          2,
          5,
          2
        ]
      },
      {
        "outcome": "DÖÇ4",
        "values": [
          4,
          4,
          4,
          4,
          4,
          4,
          3,
          4,
          3,
          4,
          3
        ]
      },
      {
        "outcome": "DÖÇ5",
        "values": [
          5,
          5,
          5,
          5,
          5,
          5,
          2,
          5,
          2,
          5,
          2
        ]
      }
    ],
    "qualityChecks": [
      {
        "item": "Ders adı ve kodları doğrulandı mı?",
        "status": "Uygun"
      },
      {
        "item": "Tüm OBS bağlantıları gerçek mi?",
        "status": "Doğrulanmalı",
        "note": "Kesin OBS ders paketi bağlantısı bulunmadığından resmî müfredat kimliği korunmuş; eksik akademik alanlar handoff ölçütleri ve LEE_DBP'deki güncel 11 PÇ temelinde öneri niteliğinde tamamlanmıştır."
      },
      {
        "item": "Dersin program düzeyi doğru mu?",
        "status": "Uygun"
      },
      {
        "item": "Ders amacı açık ve uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "Ders amacı program düzeyine uygun mu?",
        "status": "Uygun"
      },
      {
        "item": "DÖÇ sayısı ve kapsamı uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ'ler ölçülebilir mi?",
        "status": "Revize Edildi"
      },
      {
        "item": "Bloom fiilleri uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "Bloom düzeyi program düzeyine uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "Amaç–DÖÇ uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–içerik uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "İçerik–haftalık plan uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–öğretim yöntemi uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–ölçme/değerlendirme uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "AKTS–iş yükü tutarlı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–PÇ matrisi gerçekçi mi?",
        "status": "Revize Edildi"
      },
      {
        "item": "1–5 katkı düzeyleri doğru kullanılmış mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "Yapay yüksek ilişkilendirme var mı?",
        "status": "Uygun"
      },
      {
        "item": "Tekrarlı kodlar doğru tekilleştirildi mi?",
        "status": "Revize Edildi"
      },
      {
        "item": "Kaynakta olmayan bilgi kesin bilgi gibi yazılmış mı?",
        "status": "Doğrulanmalı",
        "note": "Kesin OBS ders paketi bağlantısı bulunmadığından resmî müfredat kimliği korunmuş; eksik akademik alanlar handoff ölçütleri ve LEE_DBP'deki güncel 11 PÇ temelinde öneri niteliğinde tamamlanmıştır."
      },
      {
        "item": "Eksik/doğrulanması gereken alan kaldı mı?",
        "status": "Doğrulanmalı",
        "note": "Kesin OBS ders paketi bağlantısı bulunmadığından resmî müfredat kimliği korunmuş; eksik akademik alanlar handoff ölçütleri ve LEE_DBP'deki güncel 11 PÇ temelinde öneri niteliğinde tamamlanmıştır."
      }
    ],
    "publicQualityChecklist": false
  },
  {
    "code": "TDE707",
    "name": "Osmanlı türkçesi grameri",
    "department": "Türk Dili ve Edebiyatı ABD",
    "programName": "Türk Dili ve Edebiyatı",
    "language": "Türkçe",
    "level": "Tezsiz Yüksek Lisans",
    "teachingMode": "Yüz Yüze",
    "instructor": "Dr. Öğr. Üyesi ABDULLAH DEMİRAL",
    "theory": 3,
    "practice": 0,
    "credit": 3,
    "ects": 6,
    "prerequisites": "Yok",
    "purpose": "Öğrencinin Osmanlı Türkçesinin yazı sistemi, ses, şekil ve söz varlığı özellikleri ve farklı türlerde Osmanlı Türkçesi metinleri alanlarında ileri düzey çözümleme, karşılaştırma ve yorumlama becerisi geliştirmesini sağlamak.",
    "content": "Ders; Osmanlı Türkçesinin yazı sistemi, ses, şekil ve söz varlığı özellikleri, gramer yapıları ve söz dizimi, farklı türlerde Osmanlı Türkçesi metinleri, çeviri yazı ve metin çözümleme ilkeleri konularını Türk dili ve edebiyatı araştırmalarının tarihsel, kültürel ve kuramsal bağlamlarıyla ilişkilendirerek ele alır.",
    "methods": "Kuramsal anlatım, yönlendirilmiş tartışma, kaynak ve metin incelemesi, karşılaştırmalı çözümleme, bireysel çalışma ve yapılandırılmış geri bildirim.",
    "resources": "Türk Dil Kurumu yayınları ve sözlükleri; Türkiye Yazma Eserler Kurumu Başkanlığı koleksiyonları; alanın temel başvuru eserleri; TÜBİTAK ULAKBİM TR Dizin ve güncel hakemli Türk dili ve edebiyatı araştırmaları.",
    "sdgs": [
      "4",
      "10",
      "11"
    ],
    "outcomes": [
      "Osmanlı Türkçesinin yazı sistemi ile ilgili ileri kavramları analiz eder.",
      "Ses, şekil ve söz varlığı özellikleri kapsamında kaynak ve metinleri eleştirel değerlendirir.",
      "Gramer yapıları ve söz dizimi ile ilişkili dilsel veya edebî örnekleri karşılaştırır.",
      "Farklı türlerde Osmanlı Türkçesi metinleri için uygun çözümleme yaklaşımını uygular.",
      "Çeviri yazı ve metin çözümleme ilkeleri temelinde gerekçeli akademik yorum geliştirir."
    ],
    "weeklyTopics": [
      "Osmanlı Türkçesinin yazı sistemi: kapsam ve temel kavramlar",
      "Osmanlı Türkçesinin yazı sistemi: tarihsel ve kuramsal çerçeve",
      "Osmanlı Türkçesinin yazı sistemi: kaynak ve metin türleri",
      "Ses, şekil ve söz varlığı özellikleri: temel ilkeler",
      "Ses, şekil ve söz varlığı özellikleri: örneklerin çözümlenmesi",
      "Ses, şekil ve söz varlığı özellikleri: farklı yaklaşımların karşılaştırılması",
      "Gramer yapıları ve söz dizimi: kavramsal yapı",
      "Gramer yapıları ve söz dizimi: metin veya dil verilerine uygulama",
      "Gramer yapıları ve söz dizimi: bulguların yorumlanması",
      "Farklı türlerde Osmanlı Türkçesi metinleri: yöntem ve teknikler",
      "Farklı türlerde Osmanlı Türkçesi metinleri: seçilmiş örneklerin incelenmesi",
      "Farklı türlerde Osmanlı Türkçesi metinleri: bağlam ve işlev ilişkisi",
      "Çeviri yazı ve metin çözümleme ilkeleri: güncel tartışmalar",
      "Çeviri yazı ve metin çözümleme ilkeleri: etik ve kültürel boyutlar",
      "Çeviri yazı ve metin çözümleme ilkeleri: bütüncül akademik değerlendirme"
    ],
    "assessments": [
      {
        "name": "Ara Sınav",
        "count": 1,
        "weight": 40
      },
      {
        "name": "Yarıyıl Sonu Sınavı",
        "count": 1,
        "weight": 60
      }
    ],
    "workloads": [
      {
        "name": "Ders Süresi",
        "count": 15,
        "hours": 3,
        "total": 45
      },
      {
        "name": "Sınıf Dışı Çalışma Süresi",
        "count": 15,
        "hours": 6,
        "total": 90
      },
      {
        "name": "Ara Sınav Hazırlığı",
        "count": 1,
        "hours": 20,
        "total": 20
      },
      {
        "name": "Yarıyıl Sonu Sınavı Hazırlığı",
        "count": 1,
        "hours": 25,
        "total": 25
      }
    ],
    "contributionMatrix": [
      {
        "outcome": "DÖÇ1",
        "values": [
          4,
          4,
          4,
          4,
          4,
          4,
          2,
          4,
          2,
          4,
          2
        ]
      },
      {
        "outcome": "DÖÇ2",
        "values": [
          4,
          4,
          4,
          4,
          4,
          4,
          3,
          4,
          3,
          4,
          3
        ]
      },
      {
        "outcome": "DÖÇ3",
        "values": [
          5,
          5,
          5,
          5,
          5,
          5,
          2,
          5,
          2,
          5,
          2
        ]
      },
      {
        "outcome": "DÖÇ4",
        "values": [
          4,
          4,
          4,
          4,
          4,
          4,
          3,
          4,
          3,
          4,
          3
        ]
      },
      {
        "outcome": "DÖÇ5",
        "values": [
          5,
          5,
          5,
          5,
          5,
          5,
          2,
          5,
          2,
          5,
          2
        ]
      }
    ],
    "qualityChecks": [
      {
        "item": "Ders adı ve kodları doğrulandı mı?",
        "status": "Uygun"
      },
      {
        "item": "Tüm OBS bağlantıları gerçek mi?",
        "status": "Doğrulanmalı",
        "note": "Kesin OBS ders paketi bağlantısı bulunmadığından resmî müfredat kimliği korunmuş; eksik akademik alanlar handoff ölçütleri ve LEE_DBP'deki güncel 11 PÇ temelinde öneri niteliğinde tamamlanmıştır."
      },
      {
        "item": "Dersin program düzeyi doğru mu?",
        "status": "Uygun"
      },
      {
        "item": "Ders amacı açık ve uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "Ders amacı program düzeyine uygun mu?",
        "status": "Uygun"
      },
      {
        "item": "DÖÇ sayısı ve kapsamı uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ'ler ölçülebilir mi?",
        "status": "Revize Edildi"
      },
      {
        "item": "Bloom fiilleri uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "Bloom düzeyi program düzeyine uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "Amaç–DÖÇ uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–içerik uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "İçerik–haftalık plan uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–öğretim yöntemi uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–ölçme/değerlendirme uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "AKTS–iş yükü tutarlı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–PÇ matrisi gerçekçi mi?",
        "status": "Revize Edildi"
      },
      {
        "item": "1–5 katkı düzeyleri doğru kullanılmış mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "Yapay yüksek ilişkilendirme var mı?",
        "status": "Uygun"
      },
      {
        "item": "Tekrarlı kodlar doğru tekilleştirildi mi?",
        "status": "Revize Edildi"
      },
      {
        "item": "Kaynakta olmayan bilgi kesin bilgi gibi yazılmış mı?",
        "status": "Doğrulanmalı",
        "note": "Kesin OBS ders paketi bağlantısı bulunmadığından resmî müfredat kimliği korunmuş; eksik akademik alanlar handoff ölçütleri ve LEE_DBP'deki güncel 11 PÇ temelinde öneri niteliğinde tamamlanmıştır."
      },
      {
        "item": "Eksik/doğrulanması gereken alan kaldı mı?",
        "status": "Doğrulanmalı",
        "note": "Kesin OBS ders paketi bağlantısı bulunmadığından resmî müfredat kimliği korunmuş; eksik akademik alanlar handoff ölçütleri ve LEE_DBP'deki güncel 11 PÇ temelinde öneri niteliğinde tamamlanmıştır."
      }
    ],
    "publicQualityChecklist": false
  },
  {
    "code": "TDE709",
    "name": "Eski türk edebiyatı manzum metin incelemeleri...",
    "department": "Türk Dili ve Edebiyatı ABD",
    "programName": "Türk Dili ve Edebiyatı",
    "language": "Türkçe",
    "level": "Tezsiz Yüksek Lisans",
    "teachingMode": "Yüz Yüze",
    "instructor": "Prof. Dr. YUNUS KAPLAN",
    "theory": 3,
    "practice": 0,
    "credit": 3,
    "ects": 6,
    "prerequisites": "Yok",
    "purpose": "Öğrencinin klasik Türk şiirinin estetik ve tarihsel çerçevesi, nazım şekilleri, türler ve söz sanatları ve manzum metinlerin şerh ve tahlili alanlarında ileri düzey çözümleme, karşılaştırma ve yorumlama becerisi geliştirmesini sağlamak.",
    "content": "Ders; klasik Türk şiirinin estetik ve tarihsel çerçevesi, nazım şekilleri, türler ve söz sanatları, şair, metin ve dönem ilişkisi, manzum metinlerin şerh ve tahlili, klasik edebiyat metinlerinin karşılaştırmalı yorumu konularını Türk dili ve edebiyatı araştırmalarının tarihsel, kültürel ve kuramsal bağlamlarıyla ilişkilendirerek ele alır.",
    "methods": "Kuramsal anlatım, yönlendirilmiş tartışma, kaynak ve metin incelemesi, karşılaştırmalı çözümleme, bireysel çalışma ve yapılandırılmış geri bildirim.",
    "resources": "Türk Dil Kurumu yayınları ve sözlükleri; Türkiye Yazma Eserler Kurumu Başkanlığı koleksiyonları; alanın temel başvuru eserleri; TÜBİTAK ULAKBİM TR Dizin ve güncel hakemli Türk dili ve edebiyatı araştırmaları.",
    "sdgs": [
      "4",
      "10",
      "11"
    ],
    "outcomes": [
      "Klasik Türk şiirinin estetik ve tarihsel çerçevesi ile ilgili ileri kavramları analiz eder.",
      "Nazım şekilleri, türler ve söz sanatları kapsamında kaynak ve metinleri eleştirel değerlendirir.",
      "Şair, metin ve dönem ilişkisi ile ilişkili dilsel veya edebî örnekleri karşılaştırır.",
      "Manzum metinlerin şerh ve tahlili için uygun çözümleme yaklaşımını uygular.",
      "Klasik edebiyat metinlerinin karşılaştırmalı yorumu temelinde gerekçeli akademik yorum geliştirir."
    ],
    "weeklyTopics": [
      "Klasik Türk şiirinin estetik ve tarihsel çerçevesi: kapsam ve temel kavramlar",
      "Klasik Türk şiirinin estetik ve tarihsel çerçevesi: tarihsel ve kuramsal çerçeve",
      "Klasik Türk şiirinin estetik ve tarihsel çerçevesi: kaynak ve metin türleri",
      "Nazım şekilleri, türler ve söz sanatları: temel ilkeler",
      "Nazım şekilleri, türler ve söz sanatları: örneklerin çözümlenmesi",
      "Nazım şekilleri, türler ve söz sanatları: farklı yaklaşımların karşılaştırılması",
      "Şair, metin ve dönem ilişkisi: kavramsal yapı",
      "Şair, metin ve dönem ilişkisi: metin veya dil verilerine uygulama",
      "Şair, metin ve dönem ilişkisi: bulguların yorumlanması",
      "Manzum metinlerin şerh ve tahlili: yöntem ve teknikler",
      "Manzum metinlerin şerh ve tahlili: seçilmiş örneklerin incelenmesi",
      "Manzum metinlerin şerh ve tahlili: bağlam ve işlev ilişkisi",
      "Klasik edebiyat metinlerinin karşılaştırmalı yorumu: güncel tartışmalar",
      "Klasik edebiyat metinlerinin karşılaştırmalı yorumu: etik ve kültürel boyutlar",
      "Klasik edebiyat metinlerinin karşılaştırmalı yorumu: bütüncül akademik değerlendirme"
    ],
    "assessments": [
      {
        "name": "Ara Sınav",
        "count": 1,
        "weight": 40
      },
      {
        "name": "Yarıyıl Sonu Sınavı",
        "count": 1,
        "weight": 60
      }
    ],
    "workloads": [
      {
        "name": "Ders Süresi",
        "count": 15,
        "hours": 3,
        "total": 45
      },
      {
        "name": "Sınıf Dışı Çalışma Süresi",
        "count": 15,
        "hours": 6,
        "total": 90
      },
      {
        "name": "Ara Sınav Hazırlığı",
        "count": 1,
        "hours": 20,
        "total": 20
      },
      {
        "name": "Yarıyıl Sonu Sınavı Hazırlığı",
        "count": 1,
        "hours": 25,
        "total": 25
      }
    ],
    "contributionMatrix": [
      {
        "outcome": "DÖÇ1",
        "values": [
          4,
          4,
          4,
          4,
          4,
          4,
          2,
          4,
          2,
          4,
          2
        ]
      },
      {
        "outcome": "DÖÇ2",
        "values": [
          4,
          4,
          4,
          4,
          4,
          4,
          3,
          4,
          3,
          4,
          3
        ]
      },
      {
        "outcome": "DÖÇ3",
        "values": [
          5,
          5,
          5,
          5,
          5,
          5,
          2,
          5,
          2,
          5,
          2
        ]
      },
      {
        "outcome": "DÖÇ4",
        "values": [
          4,
          4,
          4,
          4,
          4,
          4,
          3,
          4,
          3,
          4,
          3
        ]
      },
      {
        "outcome": "DÖÇ5",
        "values": [
          5,
          5,
          5,
          5,
          5,
          5,
          2,
          5,
          2,
          5,
          2
        ]
      }
    ],
    "qualityChecks": [
      {
        "item": "Ders adı ve kodları doğrulandı mı?",
        "status": "Uygun"
      },
      {
        "item": "Tüm OBS bağlantıları gerçek mi?",
        "status": "Doğrulanmalı",
        "note": "Kesin OBS ders paketi bağlantısı bulunmadığından resmî müfredat kimliği korunmuş; eksik akademik alanlar handoff ölçütleri ve LEE_DBP'deki güncel 11 PÇ temelinde öneri niteliğinde tamamlanmıştır."
      },
      {
        "item": "Dersin program düzeyi doğru mu?",
        "status": "Uygun"
      },
      {
        "item": "Ders amacı açık ve uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "Ders amacı program düzeyine uygun mu?",
        "status": "Uygun"
      },
      {
        "item": "DÖÇ sayısı ve kapsamı uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ'ler ölçülebilir mi?",
        "status": "Revize Edildi"
      },
      {
        "item": "Bloom fiilleri uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "Bloom düzeyi program düzeyine uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "Amaç–DÖÇ uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–içerik uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "İçerik–haftalık plan uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–öğretim yöntemi uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–ölçme/değerlendirme uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "AKTS–iş yükü tutarlı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–PÇ matrisi gerçekçi mi?",
        "status": "Revize Edildi"
      },
      {
        "item": "1–5 katkı düzeyleri doğru kullanılmış mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "Yapay yüksek ilişkilendirme var mı?",
        "status": "Uygun"
      },
      {
        "item": "Tekrarlı kodlar doğru tekilleştirildi mi?",
        "status": "Revize Edildi"
      },
      {
        "item": "Kaynakta olmayan bilgi kesin bilgi gibi yazılmış mı?",
        "status": "Doğrulanmalı",
        "note": "Kesin OBS ders paketi bağlantısı bulunmadığından resmî müfredat kimliği korunmuş; eksik akademik alanlar handoff ölçütleri ve LEE_DBP'deki güncel 11 PÇ temelinde öneri niteliğinde tamamlanmıştır."
      },
      {
        "item": "Eksik/doğrulanması gereken alan kaldı mı?",
        "status": "Doğrulanmalı",
        "note": "Kesin OBS ders paketi bağlantısı bulunmadığından resmî müfredat kimliği korunmuş; eksik akademik alanlar handoff ölçütleri ve LEE_DBP'deki güncel 11 PÇ temelinde öneri niteliğinde tamamlanmıştır."
      }
    ],
    "publicQualityChecklist": false
  },
  {
    "code": "TDE711",
    "name": "Türkçenin ses ve şekil bilgisi",
    "department": "Türk Dili ve Edebiyatı ABD",
    "programName": "Türk Dili ve Edebiyatı",
    "language": "Türkçe",
    "level": "Tezsiz Yüksek Lisans",
    "teachingMode": "Yüz Yüze",
    "instructor": "Atama Bekliyor",
    "theory": 3,
    "practice": 0,
    "credit": 3,
    "ects": 6,
    "prerequisites": "Yok",
    "purpose": "Öğrencinin Türkçenin dil bilgisel yapısı, ses ve şekil bilgisi süreçleri ve dil verilerinin sınıflandırılması alanlarında ileri düzey çözümleme, karşılaştırma ve yorumlama becerisi geliştirmesini sağlamak.",
    "content": "Ders; Türkçenin dil bilgisel yapısı, ses ve şekil bilgisi süreçleri, sözcük bilgisi ve söz dizimi, dil verilerinin sınıflandırılması, Türkçe örneklerin bilimsel çözümlemesi konularını Türk dili ve edebiyatı araştırmalarının tarihsel, kültürel ve kuramsal bağlamlarıyla ilişkilendirerek ele alır.",
    "methods": "Kuramsal anlatım, yönlendirilmiş tartışma, kaynak ve metin incelemesi, karşılaştırmalı çözümleme, bireysel çalışma ve yapılandırılmış geri bildirim.",
    "resources": "Türk Dil Kurumu yayınları ve sözlükleri; Türkiye Yazma Eserler Kurumu Başkanlığı koleksiyonları; alanın temel başvuru eserleri; TÜBİTAK ULAKBİM TR Dizin ve güncel hakemli Türk dili ve edebiyatı araştırmaları.",
    "sdgs": [
      "4",
      "10",
      "11"
    ],
    "outcomes": [
      "Türkçenin dil bilgisel yapısı ile ilgili ileri kavramları analiz eder.",
      "Ses ve şekil bilgisi süreçleri kapsamında kaynak ve metinleri eleştirel değerlendirir.",
      "Sözcük bilgisi ve söz dizimi ile ilişkili dilsel veya edebî örnekleri karşılaştırır.",
      "Dil verilerinin sınıflandırılması için uygun çözümleme yaklaşımını uygular.",
      "Türkçe örneklerin bilimsel çözümlemesi temelinde gerekçeli akademik yorum geliştirir."
    ],
    "weeklyTopics": [
      "Türkçenin dil bilgisel yapısı: kapsam ve temel kavramlar",
      "Türkçenin dil bilgisel yapısı: tarihsel ve kuramsal çerçeve",
      "Türkçenin dil bilgisel yapısı: kaynak ve metin türleri",
      "Ses ve şekil bilgisi süreçleri: temel ilkeler",
      "Ses ve şekil bilgisi süreçleri: örneklerin çözümlenmesi",
      "Ses ve şekil bilgisi süreçleri: farklı yaklaşımların karşılaştırılması",
      "Sözcük bilgisi ve söz dizimi: kavramsal yapı",
      "Sözcük bilgisi ve söz dizimi: metin veya dil verilerine uygulama",
      "Sözcük bilgisi ve söz dizimi: bulguların yorumlanması",
      "Dil verilerinin sınıflandırılması: yöntem ve teknikler",
      "Dil verilerinin sınıflandırılması: seçilmiş örneklerin incelenmesi",
      "Dil verilerinin sınıflandırılması: bağlam ve işlev ilişkisi",
      "Türkçe örneklerin bilimsel çözümlemesi: güncel tartışmalar",
      "Türkçe örneklerin bilimsel çözümlemesi: etik ve kültürel boyutlar",
      "Türkçe örneklerin bilimsel çözümlemesi: bütüncül akademik değerlendirme"
    ],
    "assessments": [
      {
        "name": "Ara Sınav",
        "count": 1,
        "weight": 40
      },
      {
        "name": "Yarıyıl Sonu Sınavı",
        "count": 1,
        "weight": 60
      }
    ],
    "workloads": [
      {
        "name": "Ders Süresi",
        "count": 15,
        "hours": 3,
        "total": 45
      },
      {
        "name": "Sınıf Dışı Çalışma Süresi",
        "count": 15,
        "hours": 6,
        "total": 90
      },
      {
        "name": "Ara Sınav Hazırlığı",
        "count": 1,
        "hours": 20,
        "total": 20
      },
      {
        "name": "Yarıyıl Sonu Sınavı Hazırlığı",
        "count": 1,
        "hours": 25,
        "total": 25
      }
    ],
    "contributionMatrix": [
      {
        "outcome": "DÖÇ1",
        "values": [
          4,
          2,
          2,
          4,
          2,
          4,
          2,
          4,
          2,
          4,
          2
        ]
      },
      {
        "outcome": "DÖÇ2",
        "values": [
          4,
          3,
          3,
          4,
          3,
          4,
          3,
          4,
          3,
          4,
          3
        ]
      },
      {
        "outcome": "DÖÇ3",
        "values": [
          5,
          2,
          2,
          5,
          2,
          5,
          2,
          5,
          2,
          5,
          2
        ]
      },
      {
        "outcome": "DÖÇ4",
        "values": [
          4,
          3,
          3,
          4,
          3,
          4,
          3,
          4,
          3,
          4,
          3
        ]
      },
      {
        "outcome": "DÖÇ5",
        "values": [
          5,
          2,
          2,
          5,
          2,
          5,
          2,
          5,
          2,
          5,
          2
        ]
      }
    ],
    "qualityChecks": [
      {
        "item": "Ders adı ve kodları doğrulandı mı?",
        "status": "Uygun"
      },
      {
        "item": "Tüm OBS bağlantıları gerçek mi?",
        "status": "Doğrulanmalı",
        "note": "Kesin OBS ders paketi bağlantısı bulunmadığından resmî müfredat kimliği korunmuş; eksik akademik alanlar handoff ölçütleri ve LEE_DBP'deki güncel 11 PÇ temelinde öneri niteliğinde tamamlanmıştır."
      },
      {
        "item": "Dersin program düzeyi doğru mu?",
        "status": "Uygun"
      },
      {
        "item": "Ders amacı açık ve uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "Ders amacı program düzeyine uygun mu?",
        "status": "Uygun"
      },
      {
        "item": "DÖÇ sayısı ve kapsamı uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ'ler ölçülebilir mi?",
        "status": "Revize Edildi"
      },
      {
        "item": "Bloom fiilleri uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "Bloom düzeyi program düzeyine uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "Amaç–DÖÇ uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–içerik uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "İçerik–haftalık plan uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–öğretim yöntemi uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–ölçme/değerlendirme uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "AKTS–iş yükü tutarlı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–PÇ matrisi gerçekçi mi?",
        "status": "Revize Edildi"
      },
      {
        "item": "1–5 katkı düzeyleri doğru kullanılmış mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "Yapay yüksek ilişkilendirme var mı?",
        "status": "Uygun"
      },
      {
        "item": "Tekrarlı kodlar doğru tekilleştirildi mi?",
        "status": "Revize Edildi"
      },
      {
        "item": "Kaynakta olmayan bilgi kesin bilgi gibi yazılmış mı?",
        "status": "Doğrulanmalı",
        "note": "Kesin OBS ders paketi bağlantısı bulunmadığından resmî müfredat kimliği korunmuş; eksik akademik alanlar handoff ölçütleri ve LEE_DBP'deki güncel 11 PÇ temelinde öneri niteliğinde tamamlanmıştır."
      },
      {
        "item": "Eksik/doğrulanması gereken alan kaldı mı?",
        "status": "Doğrulanmalı",
        "note": "Kesin OBS ders paketi bağlantısı bulunmadığından resmî müfredat kimliği korunmuş; eksik akademik alanlar handoff ölçütleri ve LEE_DBP'deki güncel 11 PÇ temelinde öneri niteliğinde tamamlanmıştır."
      }
    ],
    "publicQualityChecklist": false
  },
  {
    "code": "TDE713",
    "name": "Türk mitolojisi",
    "department": "Türk Dili ve Edebiyatı ABD",
    "programName": "Türk Dili ve Edebiyatı",
    "language": "Türkçe",
    "level": "Tezsiz Yüksek Lisans",
    "teachingMode": "Yüz Yüze",
    "instructor": "Doç. Dr. ALİ DOĞANER",
    "theory": 3,
    "practice": 0,
    "credit": 3,
    "ects": 6,
    "prerequisites": "Yok",
    "purpose": "Öğrencinin Türk mitolojisinin kavramsal çerçevesi, mit, ritüel ve sembol ilişkisi ve mitolojik unsurların metinlerdeki işlevi alanlarında ileri düzey çözümleme, karşılaştırma ve yorumlama becerisi geliştirmesini sağlamak.",
    "content": "Ders; Türk mitolojisinin kavramsal çerçevesi, mit, ritüel ve sembol ilişkisi, Türk destan geleneği ve tipleri, mitolojik unsurların metinlerdeki işlevi, mit ve destanların kültürel sürekliliği konularını Türk dili ve edebiyatı araştırmalarının tarihsel, kültürel ve kuramsal bağlamlarıyla ilişkilendirerek ele alır.",
    "methods": "Kuramsal anlatım, yönlendirilmiş tartışma, kaynak ve metin incelemesi, karşılaştırmalı çözümleme, bireysel çalışma ve yapılandırılmış geri bildirim.",
    "resources": "Türk Dil Kurumu yayınları ve sözlükleri; Türkiye Yazma Eserler Kurumu Başkanlığı koleksiyonları; alanın temel başvuru eserleri; TÜBİTAK ULAKBİM TR Dizin ve güncel hakemli Türk dili ve edebiyatı araştırmaları.",
    "sdgs": [
      "4",
      "10",
      "11"
    ],
    "outcomes": [
      "Türk mitolojisinin kavramsal çerçevesi ile ilgili ileri kavramları analiz eder.",
      "Mit, ritüel ve sembol ilişkisi kapsamında kaynak ve metinleri eleştirel değerlendirir.",
      "Türk destan geleneği ve tipleri ile ilişkili dilsel veya edebî örnekleri karşılaştırır.",
      "Mitolojik unsurların metinlerdeki işlevi için uygun çözümleme yaklaşımını uygular.",
      "Mit ve destanların kültürel sürekliliği temelinde gerekçeli akademik yorum geliştirir."
    ],
    "weeklyTopics": [
      "Türk mitolojisinin kavramsal çerçevesi: kapsam ve temel kavramlar",
      "Türk mitolojisinin kavramsal çerçevesi: tarihsel ve kuramsal çerçeve",
      "Türk mitolojisinin kavramsal çerçevesi: kaynak ve metin türleri",
      "Mit, ritüel ve sembol ilişkisi: temel ilkeler",
      "Mit, ritüel ve sembol ilişkisi: örneklerin çözümlenmesi",
      "Mit, ritüel ve sembol ilişkisi: farklı yaklaşımların karşılaştırılması",
      "Türk destan geleneği ve tipleri: kavramsal yapı",
      "Türk destan geleneği ve tipleri: metin veya dil verilerine uygulama",
      "Türk destan geleneği ve tipleri: bulguların yorumlanması",
      "Mitolojik unsurların metinlerdeki işlevi: yöntem ve teknikler",
      "Mitolojik unsurların metinlerdeki işlevi: seçilmiş örneklerin incelenmesi",
      "Mitolojik unsurların metinlerdeki işlevi: bağlam ve işlev ilişkisi",
      "Mit ve destanların kültürel sürekliliği: güncel tartışmalar",
      "Mit ve destanların kültürel sürekliliği: etik ve kültürel boyutlar",
      "Mit ve destanların kültürel sürekliliği: bütüncül akademik değerlendirme"
    ],
    "assessments": [
      {
        "name": "Ara Sınav",
        "count": 1,
        "weight": 40
      },
      {
        "name": "Yarıyıl Sonu Sınavı",
        "count": 1,
        "weight": 60
      }
    ],
    "workloads": [
      {
        "name": "Ders Süresi",
        "count": 15,
        "hours": 3,
        "total": 45
      },
      {
        "name": "Sınıf Dışı Çalışma Süresi",
        "count": 15,
        "hours": 6,
        "total": 90
      },
      {
        "name": "Ara Sınav Hazırlığı",
        "count": 1,
        "hours": 20,
        "total": 20
      },
      {
        "name": "Yarıyıl Sonu Sınavı Hazırlığı",
        "count": 1,
        "hours": 25,
        "total": 25
      }
    ],
    "contributionMatrix": [
      {
        "outcome": "DÖÇ1",
        "values": [
          2,
          4,
          4,
          2,
          4,
          4,
          2,
          4,
          2,
          2,
          4
        ]
      },
      {
        "outcome": "DÖÇ2",
        "values": [
          3,
          4,
          4,
          3,
          4,
          4,
          3,
          4,
          3,
          3,
          4
        ]
      },
      {
        "outcome": "DÖÇ3",
        "values": [
          2,
          5,
          5,
          2,
          5,
          5,
          2,
          5,
          2,
          2,
          5
        ]
      },
      {
        "outcome": "DÖÇ4",
        "values": [
          3,
          4,
          4,
          3,
          4,
          4,
          3,
          4,
          3,
          3,
          4
        ]
      },
      {
        "outcome": "DÖÇ5",
        "values": [
          2,
          5,
          5,
          2,
          5,
          5,
          2,
          5,
          2,
          2,
          5
        ]
      }
    ],
    "qualityChecks": [
      {
        "item": "Ders adı ve kodları doğrulandı mı?",
        "status": "Uygun"
      },
      {
        "item": "Tüm OBS bağlantıları gerçek mi?",
        "status": "Doğrulanmalı",
        "note": "Kesin OBS ders paketi bağlantısı bulunmadığından resmî müfredat kimliği korunmuş; eksik akademik alanlar handoff ölçütleri ve LEE_DBP'deki güncel 11 PÇ temelinde öneri niteliğinde tamamlanmıştır."
      },
      {
        "item": "Dersin program düzeyi doğru mu?",
        "status": "Uygun"
      },
      {
        "item": "Ders amacı açık ve uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "Ders amacı program düzeyine uygun mu?",
        "status": "Uygun"
      },
      {
        "item": "DÖÇ sayısı ve kapsamı uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ'ler ölçülebilir mi?",
        "status": "Revize Edildi"
      },
      {
        "item": "Bloom fiilleri uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "Bloom düzeyi program düzeyine uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "Amaç–DÖÇ uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–içerik uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "İçerik–haftalık plan uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–öğretim yöntemi uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–ölçme/değerlendirme uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "AKTS–iş yükü tutarlı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–PÇ matrisi gerçekçi mi?",
        "status": "Revize Edildi"
      },
      {
        "item": "1–5 katkı düzeyleri doğru kullanılmış mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "Yapay yüksek ilişkilendirme var mı?",
        "status": "Uygun"
      },
      {
        "item": "Tekrarlı kodlar doğru tekilleştirildi mi?",
        "status": "Revize Edildi"
      },
      {
        "item": "Kaynakta olmayan bilgi kesin bilgi gibi yazılmış mı?",
        "status": "Doğrulanmalı",
        "note": "Kesin OBS ders paketi bağlantısı bulunmadığından resmî müfredat kimliği korunmuş; eksik akademik alanlar handoff ölçütleri ve LEE_DBP'deki güncel 11 PÇ temelinde öneri niteliğinde tamamlanmıştır."
      },
      {
        "item": "Eksik/doğrulanması gereken alan kaldı mı?",
        "status": "Doğrulanmalı",
        "note": "Kesin OBS ders paketi bağlantısı bulunmadığından resmî müfredat kimliği korunmuş; eksik akademik alanlar handoff ölçütleri ve LEE_DBP'deki güncel 11 PÇ temelinde öneri niteliğinde tamamlanmıştır."
      }
    ],
    "publicQualityChecklist": false
  },
  {
    "code": "TDE715",
    "name": "Türk dilinin gelişim evreleri-ı",
    "department": "Türk Dili ve Edebiyatı ABD",
    "programName": "Türk Dili ve Edebiyatı",
    "language": "Türkçe",
    "level": "Tezsiz Yüksek Lisans",
    "teachingMode": "Yüz Yüze",
    "instructor": "Prof. Dr. MUSTAFA TANÇ",
    "theory": 3,
    "practice": 0,
    "credit": 3,
    "ects": 6,
    "prerequisites": "Yok",
    "purpose": "Öğrencinin Türk dilinin tarihsel dönemleri, tarihî lehçe ve yazı dilleri ve tarihî metinlerin karşılaştırılması alanlarında ileri düzey çözümleme, karşılaştırma ve yorumlama becerisi geliştirmesini sağlamak.",
    "content": "Ders; Türk dilinin tarihsel dönemleri, tarihî lehçe ve yazı dilleri, ses, şekil ve söz varlığı değişmeleri, tarihî metinlerin karşılaştırılması, Türk dilinin gelişimindeki süreklilik ve dönüşüm konularını Türk dili ve edebiyatı araştırmalarının tarihsel, kültürel ve kuramsal bağlamlarıyla ilişkilendirerek ele alır.",
    "methods": "Kuramsal anlatım, yönlendirilmiş tartışma, kaynak ve metin incelemesi, karşılaştırmalı çözümleme, bireysel çalışma ve yapılandırılmış geri bildirim.",
    "resources": "Türk Dil Kurumu yayınları ve sözlükleri; Türkiye Yazma Eserler Kurumu Başkanlığı koleksiyonları; alanın temel başvuru eserleri; TÜBİTAK ULAKBİM TR Dizin ve güncel hakemli Türk dili ve edebiyatı araştırmaları.",
    "sdgs": [
      "4",
      "10",
      "11"
    ],
    "outcomes": [
      "Türk dilinin tarihsel dönemleri ile ilgili ileri kavramları analiz eder.",
      "Tarihî lehçe ve yazı dilleri kapsamında kaynak ve metinleri eleştirel değerlendirir.",
      "Ses, şekil ve söz varlığı değişmeleri ile ilişkili dilsel veya edebî örnekleri karşılaştırır.",
      "Tarihî metinlerin karşılaştırılması için uygun çözümleme yaklaşımını uygular.",
      "Türk dilinin gelişimindeki süreklilik ve dönüşüm temelinde gerekçeli akademik yorum geliştirir."
    ],
    "weeklyTopics": [
      "Türk dilinin tarihsel dönemleri: kapsam ve temel kavramlar",
      "Türk dilinin tarihsel dönemleri: tarihsel ve kuramsal çerçeve",
      "Türk dilinin tarihsel dönemleri: kaynak ve metin türleri",
      "Tarihî lehçe ve yazı dilleri: temel ilkeler",
      "Tarihî lehçe ve yazı dilleri: örneklerin çözümlenmesi",
      "Tarihî lehçe ve yazı dilleri: farklı yaklaşımların karşılaştırılması",
      "Ses, şekil ve söz varlığı değişmeleri: kavramsal yapı",
      "Ses, şekil ve söz varlığı değişmeleri: metin veya dil verilerine uygulama",
      "Ses, şekil ve söz varlığı değişmeleri: bulguların yorumlanması",
      "Tarihî metinlerin karşılaştırılması: yöntem ve teknikler",
      "Tarihî metinlerin karşılaştırılması: seçilmiş örneklerin incelenmesi",
      "Tarihî metinlerin karşılaştırılması: bağlam ve işlev ilişkisi",
      "Türk dilinin gelişimindeki süreklilik ve dönüşüm: güncel tartışmalar",
      "Türk dilinin gelişimindeki süreklilik ve dönüşüm: etik ve kültürel boyutlar",
      "Türk dilinin gelişimindeki süreklilik ve dönüşüm: bütüncül akademik değerlendirme"
    ],
    "assessments": [
      {
        "name": "Ara Sınav",
        "count": 1,
        "weight": 40
      },
      {
        "name": "Yarıyıl Sonu Sınavı",
        "count": 1,
        "weight": 60
      }
    ],
    "workloads": [
      {
        "name": "Ders Süresi",
        "count": 15,
        "hours": 3,
        "total": 45
      },
      {
        "name": "Sınıf Dışı Çalışma Süresi",
        "count": 15,
        "hours": 6,
        "total": 90
      },
      {
        "name": "Ara Sınav Hazırlığı",
        "count": 1,
        "hours": 20,
        "total": 20
      },
      {
        "name": "Yarıyıl Sonu Sınavı Hazırlığı",
        "count": 1,
        "hours": 25,
        "total": 25
      }
    ],
    "contributionMatrix": [
      {
        "outcome": "DÖÇ1",
        "values": [
          4,
          4,
          4,
          4,
          4,
          4,
          2,
          4,
          2,
          4,
          2
        ]
      },
      {
        "outcome": "DÖÇ2",
        "values": [
          4,
          4,
          4,
          4,
          4,
          4,
          3,
          4,
          3,
          4,
          3
        ]
      },
      {
        "outcome": "DÖÇ3",
        "values": [
          5,
          5,
          5,
          5,
          5,
          5,
          2,
          5,
          2,
          5,
          2
        ]
      },
      {
        "outcome": "DÖÇ4",
        "values": [
          4,
          4,
          4,
          4,
          4,
          4,
          3,
          4,
          3,
          4,
          3
        ]
      },
      {
        "outcome": "DÖÇ5",
        "values": [
          5,
          5,
          5,
          5,
          5,
          5,
          2,
          5,
          2,
          5,
          2
        ]
      }
    ],
    "qualityChecks": [
      {
        "item": "Ders adı ve kodları doğrulandı mı?",
        "status": "Uygun"
      },
      {
        "item": "Tüm OBS bağlantıları gerçek mi?",
        "status": "Doğrulanmalı",
        "note": "Kesin OBS ders paketi bağlantısı bulunmadığından resmî müfredat kimliği korunmuş; eksik akademik alanlar handoff ölçütleri ve LEE_DBP'deki güncel 11 PÇ temelinde öneri niteliğinde tamamlanmıştır."
      },
      {
        "item": "Dersin program düzeyi doğru mu?",
        "status": "Uygun"
      },
      {
        "item": "Ders amacı açık ve uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "Ders amacı program düzeyine uygun mu?",
        "status": "Uygun"
      },
      {
        "item": "DÖÇ sayısı ve kapsamı uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ'ler ölçülebilir mi?",
        "status": "Revize Edildi"
      },
      {
        "item": "Bloom fiilleri uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "Bloom düzeyi program düzeyine uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "Amaç–DÖÇ uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–içerik uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "İçerik–haftalık plan uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–öğretim yöntemi uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–ölçme/değerlendirme uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "AKTS–iş yükü tutarlı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–PÇ matrisi gerçekçi mi?",
        "status": "Revize Edildi"
      },
      {
        "item": "1–5 katkı düzeyleri doğru kullanılmış mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "Yapay yüksek ilişkilendirme var mı?",
        "status": "Uygun"
      },
      {
        "item": "Tekrarlı kodlar doğru tekilleştirildi mi?",
        "status": "Revize Edildi"
      },
      {
        "item": "Kaynakta olmayan bilgi kesin bilgi gibi yazılmış mı?",
        "status": "Doğrulanmalı",
        "note": "Kesin OBS ders paketi bağlantısı bulunmadığından resmî müfredat kimliği korunmuş; eksik akademik alanlar handoff ölçütleri ve LEE_DBP'deki güncel 11 PÇ temelinde öneri niteliğinde tamamlanmıştır."
      },
      {
        "item": "Eksik/doğrulanması gereken alan kaldı mı?",
        "status": "Doğrulanmalı",
        "note": "Kesin OBS ders paketi bağlantısı bulunmadığından resmî müfredat kimliği korunmuş; eksik akademik alanlar handoff ölçütleri ve LEE_DBP'deki güncel 11 PÇ temelinde öneri niteliğinde tamamlanmıştır."
      }
    ],
    "publicQualityChecklist": false
  },
  {
    "code": "TDE717",
    "name": "Karşılaştırmalı edebiyat ı",
    "department": "Türk Dili ve Edebiyatı ABD",
    "programName": "Türk Dili ve Edebiyatı",
    "language": "Türkçe",
    "level": "Tezsiz Yüksek Lisans",
    "teachingMode": "Yüz Yüze",
    "instructor": "Atama Bekliyor",
    "theory": 3,
    "practice": 0,
    "credit": 3,
    "ects": 6,
    "prerequisites": "Yok",
    "purpose": "Öğrencinin karşılaştırmalı edebiyatın kuramsal temelleri, metinler arası ilişkiler ve etkilenme ve ulusal ve dünya edebiyatı bağlamları alanlarında ileri düzey çözümleme, karşılaştırma ve yorumlama becerisi geliştirmesini sağlamak.",
    "content": "Ders; karşılaştırmalı edebiyatın kuramsal temelleri, metinler arası ilişkiler ve etkilenme, tema, tür ve biçim karşılaştırmaları, ulusal ve dünya edebiyatı bağlamları, karşılaştırmalı çözümleme ve yorum konularını Türk dili ve edebiyatı araştırmalarının tarihsel, kültürel ve kuramsal bağlamlarıyla ilişkilendirerek ele alır.",
    "methods": "Kuramsal anlatım, yönlendirilmiş tartışma, kaynak ve metin incelemesi, karşılaştırmalı çözümleme, bireysel çalışma ve yapılandırılmış geri bildirim.",
    "resources": "Türk Dil Kurumu yayınları ve sözlükleri; Türkiye Yazma Eserler Kurumu Başkanlığı koleksiyonları; alanın temel başvuru eserleri; TÜBİTAK ULAKBİM TR Dizin ve güncel hakemli Türk dili ve edebiyatı araştırmaları.",
    "sdgs": [
      "4",
      "10",
      "11"
    ],
    "outcomes": [
      "Karşılaştırmalı edebiyatın kuramsal temelleri ile ilgili ileri kavramları analiz eder.",
      "Metinler arası ilişkiler ve etkilenme kapsamında kaynak ve metinleri eleştirel değerlendirir.",
      "Tema, tür ve biçim karşılaştırmaları ile ilişkili dilsel veya edebî örnekleri karşılaştırır.",
      "Ulusal ve dünya edebiyatı bağlamları için uygun çözümleme yaklaşımını uygular.",
      "Karşılaştırmalı çözümleme ve yorum temelinde gerekçeli akademik yorum geliştirir."
    ],
    "weeklyTopics": [
      "Karşılaştırmalı edebiyatın kuramsal temelleri: kapsam ve temel kavramlar",
      "Karşılaştırmalı edebiyatın kuramsal temelleri: tarihsel ve kuramsal çerçeve",
      "Karşılaştırmalı edebiyatın kuramsal temelleri: kaynak ve metin türleri",
      "Metinler arası ilişkiler ve etkilenme: temel ilkeler",
      "Metinler arası ilişkiler ve etkilenme: örneklerin çözümlenmesi",
      "Metinler arası ilişkiler ve etkilenme: farklı yaklaşımların karşılaştırılması",
      "Tema, tür ve biçim karşılaştırmaları: kavramsal yapı",
      "Tema, tür ve biçim karşılaştırmaları: metin veya dil verilerine uygulama",
      "Tema, tür ve biçim karşılaştırmaları: bulguların yorumlanması",
      "Ulusal ve dünya edebiyatı bağlamları: yöntem ve teknikler",
      "Ulusal ve dünya edebiyatı bağlamları: seçilmiş örneklerin incelenmesi",
      "Ulusal ve dünya edebiyatı bağlamları: bağlam ve işlev ilişkisi",
      "Karşılaştırmalı çözümleme ve yorum: güncel tartışmalar",
      "Karşılaştırmalı çözümleme ve yorum: etik ve kültürel boyutlar",
      "Karşılaştırmalı çözümleme ve yorum: bütüncül akademik değerlendirme"
    ],
    "assessments": [
      {
        "name": "Ara Sınav",
        "count": 1,
        "weight": 40
      },
      {
        "name": "Yarıyıl Sonu Sınavı",
        "count": 1,
        "weight": 60
      }
    ],
    "workloads": [
      {
        "name": "Ders Süresi",
        "count": 15,
        "hours": 3,
        "total": 45
      },
      {
        "name": "Sınıf Dışı Çalışma Süresi",
        "count": 15,
        "hours": 6,
        "total": 90
      },
      {
        "name": "Ara Sınav Hazırlığı",
        "count": 1,
        "hours": 20,
        "total": 20
      },
      {
        "name": "Yarıyıl Sonu Sınavı Hazırlığı",
        "count": 1,
        "hours": 25,
        "total": 25
      }
    ],
    "contributionMatrix": [
      {
        "outcome": "DÖÇ1",
        "values": [
          2,
          4,
          4,
          2,
          4,
          4,
          2,
          4,
          2,
          2,
          4
        ]
      },
      {
        "outcome": "DÖÇ2",
        "values": [
          3,
          4,
          4,
          3,
          4,
          4,
          3,
          4,
          3,
          3,
          4
        ]
      },
      {
        "outcome": "DÖÇ3",
        "values": [
          2,
          5,
          5,
          2,
          5,
          5,
          2,
          5,
          2,
          2,
          5
        ]
      },
      {
        "outcome": "DÖÇ4",
        "values": [
          3,
          4,
          4,
          3,
          4,
          4,
          3,
          4,
          3,
          3,
          4
        ]
      },
      {
        "outcome": "DÖÇ5",
        "values": [
          2,
          5,
          5,
          2,
          5,
          5,
          2,
          5,
          2,
          2,
          5
        ]
      }
    ],
    "qualityChecks": [
      {
        "item": "Ders adı ve kodları doğrulandı mı?",
        "status": "Uygun"
      },
      {
        "item": "Tüm OBS bağlantıları gerçek mi?",
        "status": "Doğrulanmalı",
        "note": "Kesin OBS ders paketi bağlantısı bulunmadığından resmî müfredat kimliği korunmuş; eksik akademik alanlar handoff ölçütleri ve LEE_DBP'deki güncel 11 PÇ temelinde öneri niteliğinde tamamlanmıştır."
      },
      {
        "item": "Dersin program düzeyi doğru mu?",
        "status": "Uygun"
      },
      {
        "item": "Ders amacı açık ve uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "Ders amacı program düzeyine uygun mu?",
        "status": "Uygun"
      },
      {
        "item": "DÖÇ sayısı ve kapsamı uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ'ler ölçülebilir mi?",
        "status": "Revize Edildi"
      },
      {
        "item": "Bloom fiilleri uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "Bloom düzeyi program düzeyine uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "Amaç–DÖÇ uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–içerik uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "İçerik–haftalık plan uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–öğretim yöntemi uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–ölçme/değerlendirme uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "AKTS–iş yükü tutarlı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–PÇ matrisi gerçekçi mi?",
        "status": "Revize Edildi"
      },
      {
        "item": "1–5 katkı düzeyleri doğru kullanılmış mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "Yapay yüksek ilişkilendirme var mı?",
        "status": "Uygun"
      },
      {
        "item": "Tekrarlı kodlar doğru tekilleştirildi mi?",
        "status": "Revize Edildi"
      },
      {
        "item": "Kaynakta olmayan bilgi kesin bilgi gibi yazılmış mı?",
        "status": "Doğrulanmalı",
        "note": "Kesin OBS ders paketi bağlantısı bulunmadığından resmî müfredat kimliği korunmuş; eksik akademik alanlar handoff ölçütleri ve LEE_DBP'deki güncel 11 PÇ temelinde öneri niteliğinde tamamlanmıştır."
      },
      {
        "item": "Eksik/doğrulanması gereken alan kaldı mı?",
        "status": "Doğrulanmalı",
        "note": "Kesin OBS ders paketi bağlantısı bulunmadığından resmî müfredat kimliği korunmuş; eksik akademik alanlar handoff ölçütleri ve LEE_DBP'deki güncel 11 PÇ temelinde öneri niteliğinde tamamlanmıştır."
      }
    ],
    "publicQualityChecklist": false
  },
  {
    "code": "TDE719",
    "name": "Genel dilbilim ı",
    "department": "Türk Dili ve Edebiyatı ABD",
    "programName": "Türk Dili ve Edebiyatı",
    "language": "Türkçe",
    "level": "Tezsiz Yüksek Lisans",
    "teachingMode": "Yüz Yüze",
    "instructor": "Atama Bekliyor",
    "theory": 3,
    "practice": 0,
    "credit": 3,
    "ects": 6,
    "prerequisites": "Yok",
    "purpose": "Öğrencinin dilbilimin temel kavram ve kuramları, dilin ses, biçim ve söz dizimi düzeyleri ve dil verilerinde çözümleme yöntemleri alanlarında ileri düzey çözümleme, karşılaştırma ve yorumlama becerisi geliştirmesini sağlamak.",
    "content": "Ders; dilbilimin temel kavram ve kuramları, dilin ses, biçim ve söz dizimi düzeyleri, anlam, kullanım ve söylem ilişkileri, dil verilerinde çözümleme yöntemleri, dilbilimsel bulguların yorumlanması konularını Türk dili ve edebiyatı araştırmalarının tarihsel, kültürel ve kuramsal bağlamlarıyla ilişkilendirerek ele alır.",
    "methods": "Kuramsal anlatım, yönlendirilmiş tartışma, kaynak ve metin incelemesi, karşılaştırmalı çözümleme, bireysel çalışma ve yapılandırılmış geri bildirim.",
    "resources": "Türk Dil Kurumu yayınları ve sözlükleri; Türkiye Yazma Eserler Kurumu Başkanlığı koleksiyonları; alanın temel başvuru eserleri; TÜBİTAK ULAKBİM TR Dizin ve güncel hakemli Türk dili ve edebiyatı araştırmaları.",
    "sdgs": [
      "4",
      "10",
      "11"
    ],
    "outcomes": [
      "Dilbilimin temel kavram ve kuramları ile ilgili ileri kavramları analiz eder.",
      "Dilin ses, biçim ve söz dizimi düzeyleri kapsamında kaynak ve metinleri eleştirel değerlendirir.",
      "Anlam, kullanım ve söylem ilişkileri ile ilişkili dilsel veya edebî örnekleri karşılaştırır.",
      "Dil verilerinde çözümleme yöntemleri için uygun çözümleme yaklaşımını uygular.",
      "Dilbilimsel bulguların yorumlanması temelinde gerekçeli akademik yorum geliştirir."
    ],
    "weeklyTopics": [
      "Dilbilimin temel kavram ve kuramları: kapsam ve temel kavramlar",
      "Dilbilimin temel kavram ve kuramları: tarihsel ve kuramsal çerçeve",
      "Dilbilimin temel kavram ve kuramları: kaynak ve metin türleri",
      "Dilin ses, biçim ve söz dizimi düzeyleri: temel ilkeler",
      "Dilin ses, biçim ve söz dizimi düzeyleri: örneklerin çözümlenmesi",
      "Dilin ses, biçim ve söz dizimi düzeyleri: farklı yaklaşımların karşılaştırılması",
      "Anlam, kullanım ve söylem ilişkileri: kavramsal yapı",
      "Anlam, kullanım ve söylem ilişkileri: metin veya dil verilerine uygulama",
      "Anlam, kullanım ve söylem ilişkileri: bulguların yorumlanması",
      "Dil verilerinde çözümleme yöntemleri: yöntem ve teknikler",
      "Dil verilerinde çözümleme yöntemleri: seçilmiş örneklerin incelenmesi",
      "Dil verilerinde çözümleme yöntemleri: bağlam ve işlev ilişkisi",
      "Dilbilimsel bulguların yorumlanması: güncel tartışmalar",
      "Dilbilimsel bulguların yorumlanması: etik ve kültürel boyutlar",
      "Dilbilimsel bulguların yorumlanması: bütüncül akademik değerlendirme"
    ],
    "assessments": [
      {
        "name": "Ara Sınav",
        "count": 1,
        "weight": 40
      },
      {
        "name": "Yarıyıl Sonu Sınavı",
        "count": 1,
        "weight": 60
      }
    ],
    "workloads": [
      {
        "name": "Ders Süresi",
        "count": 15,
        "hours": 3,
        "total": 45
      },
      {
        "name": "Sınıf Dışı Çalışma Süresi",
        "count": 15,
        "hours": 6,
        "total": 90
      },
      {
        "name": "Ara Sınav Hazırlığı",
        "count": 1,
        "hours": 20,
        "total": 20
      },
      {
        "name": "Yarıyıl Sonu Sınavı Hazırlığı",
        "count": 1,
        "hours": 25,
        "total": 25
      }
    ],
    "contributionMatrix": [
      {
        "outcome": "DÖÇ1",
        "values": [
          4,
          2,
          2,
          4,
          2,
          4,
          2,
          4,
          2,
          4,
          2
        ]
      },
      {
        "outcome": "DÖÇ2",
        "values": [
          4,
          3,
          3,
          4,
          3,
          4,
          3,
          4,
          3,
          4,
          3
        ]
      },
      {
        "outcome": "DÖÇ3",
        "values": [
          5,
          2,
          2,
          5,
          2,
          5,
          2,
          5,
          2,
          5,
          2
        ]
      },
      {
        "outcome": "DÖÇ4",
        "values": [
          4,
          3,
          3,
          4,
          3,
          4,
          3,
          4,
          3,
          4,
          3
        ]
      },
      {
        "outcome": "DÖÇ5",
        "values": [
          5,
          2,
          2,
          5,
          2,
          5,
          2,
          5,
          2,
          5,
          2
        ]
      }
    ],
    "qualityChecks": [
      {
        "item": "Ders adı ve kodları doğrulandı mı?",
        "status": "Uygun"
      },
      {
        "item": "Tüm OBS bağlantıları gerçek mi?",
        "status": "Doğrulanmalı",
        "note": "Kesin OBS ders paketi bağlantısı bulunmadığından resmî müfredat kimliği korunmuş; eksik akademik alanlar handoff ölçütleri ve LEE_DBP'deki güncel 11 PÇ temelinde öneri niteliğinde tamamlanmıştır."
      },
      {
        "item": "Dersin program düzeyi doğru mu?",
        "status": "Uygun"
      },
      {
        "item": "Ders amacı açık ve uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "Ders amacı program düzeyine uygun mu?",
        "status": "Uygun"
      },
      {
        "item": "DÖÇ sayısı ve kapsamı uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ'ler ölçülebilir mi?",
        "status": "Revize Edildi"
      },
      {
        "item": "Bloom fiilleri uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "Bloom düzeyi program düzeyine uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "Amaç–DÖÇ uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–içerik uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "İçerik–haftalık plan uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–öğretim yöntemi uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–ölçme/değerlendirme uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "AKTS–iş yükü tutarlı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–PÇ matrisi gerçekçi mi?",
        "status": "Revize Edildi"
      },
      {
        "item": "1–5 katkı düzeyleri doğru kullanılmış mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "Yapay yüksek ilişkilendirme var mı?",
        "status": "Uygun"
      },
      {
        "item": "Tekrarlı kodlar doğru tekilleştirildi mi?",
        "status": "Revize Edildi"
      },
      {
        "item": "Kaynakta olmayan bilgi kesin bilgi gibi yazılmış mı?",
        "status": "Doğrulanmalı",
        "note": "Kesin OBS ders paketi bağlantısı bulunmadığından resmî müfredat kimliği korunmuş; eksik akademik alanlar handoff ölçütleri ve LEE_DBP'deki güncel 11 PÇ temelinde öneri niteliğinde tamamlanmıştır."
      },
      {
        "item": "Eksik/doğrulanması gereken alan kaldı mı?",
        "status": "Doğrulanmalı",
        "note": "Kesin OBS ders paketi bağlantısı bulunmadığından resmî müfredat kimliği korunmuş; eksik akademik alanlar handoff ölçütleri ve LEE_DBP'deki güncel 11 PÇ temelinde öneri niteliğinde tamamlanmıştır."
      }
    ],
    "publicQualityChecklist": false
  },
  {
    "code": "TDE721",
    "name": "Edebi erimler ve kuramları ı",
    "department": "Türk Dili ve Edebiyatı ABD",
    "programName": "Türk Dili ve Edebiyatı",
    "language": "Türkçe",
    "level": "Tezsiz Yüksek Lisans",
    "teachingMode": "Yüz Yüze",
    "instructor": "Doç. Dr. TANER TURAN",
    "theory": 3,
    "practice": 0,
    "credit": 3,
    "ects": 6,
    "prerequisites": "Yok",
    "purpose": "Öğrencinin edebiyat biliminin temel kavramları, edebî tür, biçim ve anlatım teknikleri ve kuramsal kavramların metne uygulanması alanlarında ileri düzey çözümleme, karşılaştırma ve yorumlama becerisi geliştirmesini sağlamak.",
    "content": "Ders; edebiyat biliminin temel kavramları, edebî tür, biçim ve anlatım teknikleri, edebiyat kuramları ve eleştiri yaklaşımları, kuramsal kavramların metne uygulanması, edebî yorumların karşılaştırılması konularını Türk dili ve edebiyatı araştırmalarının tarihsel, kültürel ve kuramsal bağlamlarıyla ilişkilendirerek ele alır.",
    "methods": "Kuramsal anlatım, yönlendirilmiş tartışma, kaynak ve metin incelemesi, karşılaştırmalı çözümleme, bireysel çalışma ve yapılandırılmış geri bildirim.",
    "resources": "Türk Dil Kurumu yayınları ve sözlükleri; Türkiye Yazma Eserler Kurumu Başkanlığı koleksiyonları; alanın temel başvuru eserleri; TÜBİTAK ULAKBİM TR Dizin ve güncel hakemli Türk dili ve edebiyatı araştırmaları.",
    "sdgs": [
      "4",
      "10",
      "11"
    ],
    "outcomes": [
      "Edebiyat biliminin temel kavramları ile ilgili ileri kavramları analiz eder.",
      "Edebî tür, biçim ve anlatım teknikleri kapsamında kaynak ve metinleri eleştirel değerlendirir.",
      "Edebiyat kuramları ve eleştiri yaklaşımları ile ilişkili dilsel veya edebî örnekleri karşılaştırır.",
      "Kuramsal kavramların metne uygulanması için uygun çözümleme yaklaşımını uygular.",
      "Edebî yorumların karşılaştırılması temelinde gerekçeli akademik yorum geliştirir."
    ],
    "weeklyTopics": [
      "Edebiyat biliminin temel kavramları: kapsam ve temel kavramlar",
      "Edebiyat biliminin temel kavramları: tarihsel ve kuramsal çerçeve",
      "Edebiyat biliminin temel kavramları: kaynak ve metin türleri",
      "Edebî tür, biçim ve anlatım teknikleri: temel ilkeler",
      "Edebî tür, biçim ve anlatım teknikleri: örneklerin çözümlenmesi",
      "Edebî tür, biçim ve anlatım teknikleri: farklı yaklaşımların karşılaştırılması",
      "Edebiyat kuramları ve eleştiri yaklaşımları: kavramsal yapı",
      "Edebiyat kuramları ve eleştiri yaklaşımları: metin veya dil verilerine uygulama",
      "Edebiyat kuramları ve eleştiri yaklaşımları: bulguların yorumlanması",
      "Kuramsal kavramların metne uygulanması: yöntem ve teknikler",
      "Kuramsal kavramların metne uygulanması: seçilmiş örneklerin incelenmesi",
      "Kuramsal kavramların metne uygulanması: bağlam ve işlev ilişkisi",
      "Edebî yorumların karşılaştırılması: güncel tartışmalar",
      "Edebî yorumların karşılaştırılması: etik ve kültürel boyutlar",
      "Edebî yorumların karşılaştırılması: bütüncül akademik değerlendirme"
    ],
    "assessments": [
      {
        "name": "Ara Sınav",
        "count": 1,
        "weight": 40
      },
      {
        "name": "Yarıyıl Sonu Sınavı",
        "count": 1,
        "weight": 60
      }
    ],
    "workloads": [
      {
        "name": "Ders Süresi",
        "count": 15,
        "hours": 3,
        "total": 45
      },
      {
        "name": "Sınıf Dışı Çalışma Süresi",
        "count": 15,
        "hours": 6,
        "total": 90
      },
      {
        "name": "Ara Sınav Hazırlığı",
        "count": 1,
        "hours": 20,
        "total": 20
      },
      {
        "name": "Yarıyıl Sonu Sınavı Hazırlığı",
        "count": 1,
        "hours": 25,
        "total": 25
      }
    ],
    "contributionMatrix": [
      {
        "outcome": "DÖÇ1",
        "values": [
          4,
          4,
          4,
          4,
          4,
          4,
          2,
          4,
          2,
          4,
          2
        ]
      },
      {
        "outcome": "DÖÇ2",
        "values": [
          4,
          4,
          4,
          4,
          4,
          4,
          3,
          4,
          3,
          4,
          3
        ]
      },
      {
        "outcome": "DÖÇ3",
        "values": [
          5,
          5,
          5,
          5,
          5,
          5,
          2,
          5,
          2,
          5,
          2
        ]
      },
      {
        "outcome": "DÖÇ4",
        "values": [
          4,
          4,
          4,
          4,
          4,
          4,
          3,
          4,
          3,
          4,
          3
        ]
      },
      {
        "outcome": "DÖÇ5",
        "values": [
          5,
          5,
          5,
          5,
          5,
          5,
          2,
          5,
          2,
          5,
          2
        ]
      }
    ],
    "qualityChecks": [
      {
        "item": "Ders adı ve kodları doğrulandı mı?",
        "status": "Uygun"
      },
      {
        "item": "Tüm OBS bağlantıları gerçek mi?",
        "status": "Doğrulanmalı",
        "note": "Kesin OBS ders paketi bağlantısı bulunmadığından resmî müfredat kimliği korunmuş; eksik akademik alanlar handoff ölçütleri ve LEE_DBP'deki güncel 11 PÇ temelinde öneri niteliğinde tamamlanmıştır."
      },
      {
        "item": "Dersin program düzeyi doğru mu?",
        "status": "Uygun"
      },
      {
        "item": "Ders amacı açık ve uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "Ders amacı program düzeyine uygun mu?",
        "status": "Uygun"
      },
      {
        "item": "DÖÇ sayısı ve kapsamı uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ'ler ölçülebilir mi?",
        "status": "Revize Edildi"
      },
      {
        "item": "Bloom fiilleri uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "Bloom düzeyi program düzeyine uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "Amaç–DÖÇ uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–içerik uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "İçerik–haftalık plan uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–öğretim yöntemi uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–ölçme/değerlendirme uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "AKTS–iş yükü tutarlı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–PÇ matrisi gerçekçi mi?",
        "status": "Revize Edildi"
      },
      {
        "item": "1–5 katkı düzeyleri doğru kullanılmış mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "Yapay yüksek ilişkilendirme var mı?",
        "status": "Uygun"
      },
      {
        "item": "Tekrarlı kodlar doğru tekilleştirildi mi?",
        "status": "Revize Edildi"
      },
      {
        "item": "Kaynakta olmayan bilgi kesin bilgi gibi yazılmış mı?",
        "status": "Doğrulanmalı",
        "note": "Kesin OBS ders paketi bağlantısı bulunmadığından resmî müfredat kimliği korunmuş; eksik akademik alanlar handoff ölçütleri ve LEE_DBP'deki güncel 11 PÇ temelinde öneri niteliğinde tamamlanmıştır."
      },
      {
        "item": "Eksik/doğrulanması gereken alan kaldı mı?",
        "status": "Doğrulanmalı",
        "note": "Kesin OBS ders paketi bağlantısı bulunmadığından resmî müfredat kimliği korunmuş; eksik akademik alanlar handoff ölçütleri ve LEE_DBP'deki güncel 11 PÇ temelinde öneri niteliğinde tamamlanmıştır."
      }
    ],
    "publicQualityChecklist": false
  },
  {
    "code": "TDE723",
    "name": "Batı edebiyatında edebi akımlar",
    "department": "Türk Dili ve Edebiyatı ABD",
    "programName": "Türk Dili ve Edebiyatı",
    "language": "Türkçe",
    "level": "Tezsiz Yüksek Lisans",
    "teachingMode": "Yüz Yüze",
    "instructor": "Prof. Dr. SEMA ÖZHER",
    "theory": 3,
    "practice": 0,
    "credit": 3,
    "ects": 6,
    "prerequisites": "Yok",
    "purpose": "Öğrencinin Batı edebiyatındaki düşünsel ve estetik dönüşümler, edebî akımların tarihsel koşulları ve akımların tür ve biçim üzerindeki etkileri alanlarında ileri düzey çözümleme, karşılaştırma ve yorumlama becerisi geliştirmesini sağlamak.",
    "content": "Ders; Batı edebiyatındaki düşünsel ve estetik dönüşümler, edebî akımların tarihsel koşulları, akımların temel kavram ve temsilcileri, akımların tür ve biçim üzerindeki etkileri, Türk ve Batı edebiyatları arasındaki etkileşim konularını Türk dili ve edebiyatı araştırmalarının tarihsel, kültürel ve kuramsal bağlamlarıyla ilişkilendirerek ele alır.",
    "methods": "Kuramsal anlatım, yönlendirilmiş tartışma, kaynak ve metin incelemesi, karşılaştırmalı çözümleme, bireysel çalışma ve yapılandırılmış geri bildirim.",
    "resources": "Türk Dil Kurumu yayınları ve sözlükleri; Türkiye Yazma Eserler Kurumu Başkanlığı koleksiyonları; alanın temel başvuru eserleri; TÜBİTAK ULAKBİM TR Dizin ve güncel hakemli Türk dili ve edebiyatı araştırmaları.",
    "sdgs": [
      "4",
      "10",
      "11"
    ],
    "outcomes": [
      "Batı edebiyatındaki düşünsel ve estetik dönüşümler ile ilgili ileri kavramları analiz eder.",
      "Edebî akımların tarihsel koşulları kapsamında kaynak ve metinleri eleştirel değerlendirir.",
      "Akımların temel kavram ve temsilcileri ile ilişkili dilsel veya edebî örnekleri karşılaştırır.",
      "Akımların tür ve biçim üzerindeki etkileri için uygun çözümleme yaklaşımını uygular.",
      "Türk ve Batı edebiyatları arasındaki etkileşim temelinde gerekçeli akademik yorum geliştirir."
    ],
    "weeklyTopics": [
      "Batı edebiyatındaki düşünsel ve estetik dönüşümler: kapsam ve temel kavramlar",
      "Batı edebiyatındaki düşünsel ve estetik dönüşümler: tarihsel ve kuramsal çerçeve",
      "Batı edebiyatındaki düşünsel ve estetik dönüşümler: kaynak ve metin türleri",
      "Edebî akımların tarihsel koşulları: temel ilkeler",
      "Edebî akımların tarihsel koşulları: örneklerin çözümlenmesi",
      "Edebî akımların tarihsel koşulları: farklı yaklaşımların karşılaştırılması",
      "Akımların temel kavram ve temsilcileri: kavramsal yapı",
      "Akımların temel kavram ve temsilcileri: metin veya dil verilerine uygulama",
      "Akımların temel kavram ve temsilcileri: bulguların yorumlanması",
      "Akımların tür ve biçim üzerindeki etkileri: yöntem ve teknikler",
      "Akımların tür ve biçim üzerindeki etkileri: seçilmiş örneklerin incelenmesi",
      "Akımların tür ve biçim üzerindeki etkileri: bağlam ve işlev ilişkisi",
      "Türk ve Batı edebiyatları arasındaki etkileşim: güncel tartışmalar",
      "Türk ve Batı edebiyatları arasındaki etkileşim: etik ve kültürel boyutlar",
      "Türk ve Batı edebiyatları arasındaki etkileşim: bütüncül akademik değerlendirme"
    ],
    "assessments": [
      {
        "name": "Ara Sınav",
        "count": 1,
        "weight": 40
      },
      {
        "name": "Yarıyıl Sonu Sınavı",
        "count": 1,
        "weight": 60
      }
    ],
    "workloads": [
      {
        "name": "Ders Süresi",
        "count": 15,
        "hours": 3,
        "total": 45
      },
      {
        "name": "Sınıf Dışı Çalışma Süresi",
        "count": 15,
        "hours": 6,
        "total": 90
      },
      {
        "name": "Ara Sınav Hazırlığı",
        "count": 1,
        "hours": 20,
        "total": 20
      },
      {
        "name": "Yarıyıl Sonu Sınavı Hazırlığı",
        "count": 1,
        "hours": 25,
        "total": 25
      }
    ],
    "contributionMatrix": [
      {
        "outcome": "DÖÇ1",
        "values": [
          4,
          4,
          4,
          4,
          4,
          4,
          2,
          4,
          2,
          4,
          2
        ]
      },
      {
        "outcome": "DÖÇ2",
        "values": [
          4,
          4,
          4,
          4,
          4,
          4,
          3,
          4,
          3,
          4,
          3
        ]
      },
      {
        "outcome": "DÖÇ3",
        "values": [
          5,
          5,
          5,
          5,
          5,
          5,
          2,
          5,
          2,
          5,
          2
        ]
      },
      {
        "outcome": "DÖÇ4",
        "values": [
          4,
          4,
          4,
          4,
          4,
          4,
          3,
          4,
          3,
          4,
          3
        ]
      },
      {
        "outcome": "DÖÇ5",
        "values": [
          5,
          5,
          5,
          5,
          5,
          5,
          2,
          5,
          2,
          5,
          2
        ]
      }
    ],
    "qualityChecks": [
      {
        "item": "Ders adı ve kodları doğrulandı mı?",
        "status": "Uygun"
      },
      {
        "item": "Tüm OBS bağlantıları gerçek mi?",
        "status": "Doğrulanmalı",
        "note": "Kesin OBS ders paketi bağlantısı bulunmadığından resmî müfredat kimliği korunmuş; eksik akademik alanlar handoff ölçütleri ve LEE_DBP'deki güncel 11 PÇ temelinde öneri niteliğinde tamamlanmıştır."
      },
      {
        "item": "Dersin program düzeyi doğru mu?",
        "status": "Uygun"
      },
      {
        "item": "Ders amacı açık ve uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "Ders amacı program düzeyine uygun mu?",
        "status": "Uygun"
      },
      {
        "item": "DÖÇ sayısı ve kapsamı uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ'ler ölçülebilir mi?",
        "status": "Revize Edildi"
      },
      {
        "item": "Bloom fiilleri uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "Bloom düzeyi program düzeyine uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "Amaç–DÖÇ uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–içerik uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "İçerik–haftalık plan uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–öğretim yöntemi uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–ölçme/değerlendirme uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "AKTS–iş yükü tutarlı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–PÇ matrisi gerçekçi mi?",
        "status": "Revize Edildi"
      },
      {
        "item": "1–5 katkı düzeyleri doğru kullanılmış mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "Yapay yüksek ilişkilendirme var mı?",
        "status": "Uygun"
      },
      {
        "item": "Tekrarlı kodlar doğru tekilleştirildi mi?",
        "status": "Revize Edildi"
      },
      {
        "item": "Kaynakta olmayan bilgi kesin bilgi gibi yazılmış mı?",
        "status": "Doğrulanmalı",
        "note": "Kesin OBS ders paketi bağlantısı bulunmadığından resmî müfredat kimliği korunmuş; eksik akademik alanlar handoff ölçütleri ve LEE_DBP'deki güncel 11 PÇ temelinde öneri niteliğinde tamamlanmıştır."
      },
      {
        "item": "Eksik/doğrulanması gereken alan kaldı mı?",
        "status": "Doğrulanmalı",
        "note": "Kesin OBS ders paketi bağlantısı bulunmadığından resmî müfredat kimliği korunmuş; eksik akademik alanlar handoff ölçütleri ve LEE_DBP'deki güncel 11 PÇ temelinde öneri niteliğinde tamamlanmıştır."
      }
    ],
    "publicQualityChecklist": false
  },
  {
    "code": "TDE704",
    "name": "Bilimsel araştırma yöntemleri ve yayın etiği",
    "department": "Türk Dili ve Edebiyatı ABD",
    "programName": "Türk Dili ve Edebiyatı",
    "language": "Türkçe",
    "level": "Tezsiz Yüksek Lisans",
    "teachingMode": "Yüz Yüze",
    "instructor": "Prof. Dr. AHMET DEMİRTAŞ",
    "theory": 3,
    "practice": 0,
    "credit": 3,
    "ects": 6,
    "prerequisites": "Yok",
    "purpose": "Öğrencinin bilimsel bilgi ve araştırma etiği, araştırma probleminin yapılandırılması ve kaynak, veri ve metin çözümleme alanlarında ileri düzey çözümleme, karşılaştırma ve yorumlama becerisi geliştirmesini sağlamak.",
    "content": "Ders; bilimsel bilgi ve araştırma etiği, araştırma probleminin yapılandırılması, nitel ve nicel araştırma yaklaşımları, kaynak, veri ve metin çözümleme, akademik yazım ve yayın etiği konularını Türk dili ve edebiyatı araştırmalarının tarihsel, kültürel ve kuramsal bağlamlarıyla ilişkilendirerek ele alır.",
    "methods": "Kuramsal anlatım, yönlendirilmiş tartışma, kaynak ve metin incelemesi, karşılaştırmalı çözümleme, bireysel çalışma ve yapılandırılmış geri bildirim.",
    "resources": "Türk Dil Kurumu yayınları ve sözlükleri; Türkiye Yazma Eserler Kurumu Başkanlığı koleksiyonları; alanın temel başvuru eserleri; TÜBİTAK ULAKBİM TR Dizin ve güncel hakemli Türk dili ve edebiyatı araştırmaları.",
    "sdgs": [
      "4",
      "10",
      "11"
    ],
    "outcomes": [
      "Bilimsel bilgi ve araştırma etiği ile ilgili ileri kavramları analiz eder.",
      "Araştırma probleminin yapılandırılması kapsamında kaynak ve metinleri eleştirel değerlendirir.",
      "Nitel ve nicel araştırma yaklaşımları ile ilişkili dilsel veya edebî örnekleri karşılaştırır.",
      "Kaynak, veri ve metin çözümleme için uygun çözümleme yaklaşımını uygular.",
      "Akademik yazım ve yayın etiği temelinde gerekçeli akademik yorum geliştirir."
    ],
    "weeklyTopics": [
      "Bilimsel bilgi ve araştırma etiği: kapsam ve temel kavramlar",
      "Bilimsel bilgi ve araştırma etiği: tarihsel ve kuramsal çerçeve",
      "Bilimsel bilgi ve araştırma etiği: kaynak ve metin türleri",
      "Araştırma probleminin yapılandırılması: temel ilkeler",
      "Araştırma probleminin yapılandırılması: örneklerin çözümlenmesi",
      "Araştırma probleminin yapılandırılması: farklı yaklaşımların karşılaştırılması",
      "Nitel ve nicel araştırma yaklaşımları: kavramsal yapı",
      "Nitel ve nicel araştırma yaklaşımları: metin veya dil verilerine uygulama",
      "Nitel ve nicel araştırma yaklaşımları: bulguların yorumlanması",
      "Kaynak, veri ve metin çözümleme: yöntem ve teknikler",
      "Kaynak, veri ve metin çözümleme: seçilmiş örneklerin incelenmesi",
      "Kaynak, veri ve metin çözümleme: bağlam ve işlev ilişkisi",
      "Akademik yazım ve yayın etiği: güncel tartışmalar",
      "Akademik yazım ve yayın etiği: etik ve kültürel boyutlar",
      "Akademik yazım ve yayın etiği: bütüncül akademik değerlendirme"
    ],
    "assessments": [
      {
        "name": "Ara Sınav",
        "count": 1,
        "weight": 40
      },
      {
        "name": "Yarıyıl Sonu Sınavı",
        "count": 1,
        "weight": 60
      }
    ],
    "workloads": [
      {
        "name": "Ders Süresi",
        "count": 15,
        "hours": 3,
        "total": 45
      },
      {
        "name": "Sınıf Dışı Çalışma Süresi",
        "count": 15,
        "hours": 6,
        "total": 90
      },
      {
        "name": "Ara Sınav Hazırlığı",
        "count": 1,
        "hours": 20,
        "total": 20
      },
      {
        "name": "Yarıyıl Sonu Sınavı Hazırlığı",
        "count": 1,
        "hours": 25,
        "total": 25
      }
    ],
    "contributionMatrix": [
      {
        "outcome": "DÖÇ1",
        "values": [
          2,
          2,
          4,
          4,
          2,
          2,
          4,
          4,
          4,
          4,
          4
        ]
      },
      {
        "outcome": "DÖÇ2",
        "values": [
          3,
          3,
          4,
          4,
          3,
          3,
          4,
          4,
          4,
          4,
          4
        ]
      },
      {
        "outcome": "DÖÇ3",
        "values": [
          2,
          2,
          5,
          5,
          2,
          2,
          5,
          5,
          5,
          5,
          5
        ]
      },
      {
        "outcome": "DÖÇ4",
        "values": [
          3,
          3,
          4,
          4,
          3,
          3,
          4,
          4,
          4,
          4,
          4
        ]
      },
      {
        "outcome": "DÖÇ5",
        "values": [
          2,
          2,
          5,
          5,
          2,
          2,
          5,
          5,
          5,
          5,
          5
        ]
      }
    ],
    "qualityChecks": [
      {
        "item": "Ders adı ve kodları doğrulandı mı?",
        "status": "Uygun"
      },
      {
        "item": "Tüm OBS bağlantıları gerçek mi?",
        "status": "Doğrulanmalı",
        "note": "Kesin OBS ders paketi bağlantısı bulunmadığından resmî müfredat kimliği korunmuş; eksik akademik alanlar handoff ölçütleri ve LEE_DBP'deki güncel 11 PÇ temelinde öneri niteliğinde tamamlanmıştır."
      },
      {
        "item": "Dersin program düzeyi doğru mu?",
        "status": "Uygun"
      },
      {
        "item": "Ders amacı açık ve uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "Ders amacı program düzeyine uygun mu?",
        "status": "Uygun"
      },
      {
        "item": "DÖÇ sayısı ve kapsamı uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ'ler ölçülebilir mi?",
        "status": "Revize Edildi"
      },
      {
        "item": "Bloom fiilleri uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "Bloom düzeyi program düzeyine uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "Amaç–DÖÇ uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–içerik uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "İçerik–haftalık plan uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–öğretim yöntemi uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–ölçme/değerlendirme uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "AKTS–iş yükü tutarlı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–PÇ matrisi gerçekçi mi?",
        "status": "Revize Edildi"
      },
      {
        "item": "1–5 katkı düzeyleri doğru kullanılmış mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "Yapay yüksek ilişkilendirme var mı?",
        "status": "Uygun"
      },
      {
        "item": "Tekrarlı kodlar doğru tekilleştirildi mi?",
        "status": "Revize Edildi"
      },
      {
        "item": "Kaynakta olmayan bilgi kesin bilgi gibi yazılmış mı?",
        "status": "Doğrulanmalı",
        "note": "Kesin OBS ders paketi bağlantısı bulunmadığından resmî müfredat kimliği korunmuş; eksik akademik alanlar handoff ölçütleri ve LEE_DBP'deki güncel 11 PÇ temelinde öneri niteliğinde tamamlanmıştır."
      },
      {
        "item": "Eksik/doğrulanması gereken alan kaldı mı?",
        "status": "Doğrulanmalı",
        "note": "Kesin OBS ders paketi bağlantısı bulunmadığından resmî müfredat kimliği korunmuş; eksik akademik alanlar handoff ölçütleri ve LEE_DBP'deki güncel 11 PÇ temelinde öneri niteliğinde tamamlanmıştır."
      }
    ],
    "publicQualityChecklist": false
  },
  {
    "code": "TDE706",
    "name": "Sözlü anlatım türleri ve eğitim ıı",
    "department": "Türk Dili ve Edebiyatı ABD",
    "programName": "Türk Dili ve Edebiyatı",
    "language": "Türkçe",
    "level": "Tezsiz Yüksek Lisans",
    "teachingMode": "Yüz Yüze",
    "instructor": "Prof. Dr. AHMET DEMİRTAŞ",
    "theory": 3,
    "practice": 0,
    "credit": 3,
    "ects": 6,
    "prerequisites": "Yok",
    "purpose": "Öğrencinin sözlü anlatım geleneği ve türleri, anlatıcı, icra ortamı ve dinleyici ilişkisi ve alan araştırması ve metin çözümleme alanlarında ileri düzey çözümleme, karşılaştırma ve yorumlama becerisi geliştirmesini sağlamak.",
    "content": "Ders; sözlü anlatım geleneği ve türleri, anlatıcı, icra ortamı ve dinleyici ilişkisi, sözlü anlatıların yapı ve işlevleri, alan araştırması ve metin çözümleme, sözlü kültür ürünlerinin eğitim ve aktarımı konularını Türk dili ve edebiyatı araştırmalarının tarihsel, kültürel ve kuramsal bağlamlarıyla ilişkilendirerek ele alır.",
    "methods": "Kuramsal anlatım, yönlendirilmiş tartışma, kaynak ve metin incelemesi, karşılaştırmalı çözümleme, bireysel çalışma ve yapılandırılmış geri bildirim.",
    "resources": "Türk Dil Kurumu yayınları ve sözlükleri; Türkiye Yazma Eserler Kurumu Başkanlığı koleksiyonları; alanın temel başvuru eserleri; TÜBİTAK ULAKBİM TR Dizin ve güncel hakemli Türk dili ve edebiyatı araştırmaları.",
    "sdgs": [
      "4",
      "10",
      "11"
    ],
    "outcomes": [
      "Sözlü anlatım geleneği ve türleri ile ilgili ileri kavramları analiz eder.",
      "Anlatıcı, icra ortamı ve dinleyici ilişkisi kapsamında kaynak ve metinleri eleştirel değerlendirir.",
      "Sözlü anlatıların yapı ve işlevleri ile ilişkili dilsel veya edebî örnekleri karşılaştırır.",
      "Alan araştırması ve metin çözümleme için uygun çözümleme yaklaşımını uygular.",
      "Sözlü kültür ürünlerinin eğitim ve aktarımı temelinde gerekçeli akademik yorum geliştirir."
    ],
    "weeklyTopics": [
      "Sözlü anlatım geleneği ve türleri: kapsam ve temel kavramlar",
      "Sözlü anlatım geleneği ve türleri: tarihsel ve kuramsal çerçeve",
      "Sözlü anlatım geleneği ve türleri: kaynak ve metin türleri",
      "Anlatıcı, icra ortamı ve dinleyici ilişkisi: temel ilkeler",
      "Anlatıcı, icra ortamı ve dinleyici ilişkisi: örneklerin çözümlenmesi",
      "Anlatıcı, icra ortamı ve dinleyici ilişkisi: farklı yaklaşımların karşılaştırılması",
      "Sözlü anlatıların yapı ve işlevleri: kavramsal yapı",
      "Sözlü anlatıların yapı ve işlevleri: metin veya dil verilerine uygulama",
      "Sözlü anlatıların yapı ve işlevleri: bulguların yorumlanması",
      "Alan araştırması ve metin çözümleme: yöntem ve teknikler",
      "Alan araştırması ve metin çözümleme: seçilmiş örneklerin incelenmesi",
      "Alan araştırması ve metin çözümleme: bağlam ve işlev ilişkisi",
      "Sözlü kültür ürünlerinin eğitim ve aktarımı: güncel tartışmalar",
      "Sözlü kültür ürünlerinin eğitim ve aktarımı: etik ve kültürel boyutlar",
      "Sözlü kültür ürünlerinin eğitim ve aktarımı: bütüncül akademik değerlendirme"
    ],
    "assessments": [
      {
        "name": "Ara Sınav",
        "count": 1,
        "weight": 40
      },
      {
        "name": "Yarıyıl Sonu Sınavı",
        "count": 1,
        "weight": 60
      }
    ],
    "workloads": [
      {
        "name": "Ders Süresi",
        "count": 15,
        "hours": 3,
        "total": 45
      },
      {
        "name": "Sınıf Dışı Çalışma Süresi",
        "count": 15,
        "hours": 6,
        "total": 90
      },
      {
        "name": "Ara Sınav Hazırlığı",
        "count": 1,
        "hours": 20,
        "total": 20
      },
      {
        "name": "Yarıyıl Sonu Sınavı Hazırlığı",
        "count": 1,
        "hours": 25,
        "total": 25
      }
    ],
    "contributionMatrix": [
      {
        "outcome": "DÖÇ1",
        "values": [
          4,
          4,
          4,
          4,
          4,
          4,
          2,
          4,
          2,
          4,
          2
        ]
      },
      {
        "outcome": "DÖÇ2",
        "values": [
          4,
          4,
          4,
          4,
          4,
          4,
          3,
          4,
          3,
          4,
          3
        ]
      },
      {
        "outcome": "DÖÇ3",
        "values": [
          5,
          5,
          5,
          5,
          5,
          5,
          2,
          5,
          2,
          5,
          2
        ]
      },
      {
        "outcome": "DÖÇ4",
        "values": [
          4,
          4,
          4,
          4,
          4,
          4,
          3,
          4,
          3,
          4,
          3
        ]
      },
      {
        "outcome": "DÖÇ5",
        "values": [
          5,
          5,
          5,
          5,
          5,
          5,
          2,
          5,
          2,
          5,
          2
        ]
      }
    ],
    "qualityChecks": [
      {
        "item": "Ders adı ve kodları doğrulandı mı?",
        "status": "Uygun"
      },
      {
        "item": "Tüm OBS bağlantıları gerçek mi?",
        "status": "Doğrulanmalı",
        "note": "Kesin OBS ders paketi bağlantısı bulunmadığından resmî müfredat kimliği korunmuş; eksik akademik alanlar handoff ölçütleri ve LEE_DBP'deki güncel 11 PÇ temelinde öneri niteliğinde tamamlanmıştır."
      },
      {
        "item": "Dersin program düzeyi doğru mu?",
        "status": "Uygun"
      },
      {
        "item": "Ders amacı açık ve uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "Ders amacı program düzeyine uygun mu?",
        "status": "Uygun"
      },
      {
        "item": "DÖÇ sayısı ve kapsamı uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ'ler ölçülebilir mi?",
        "status": "Revize Edildi"
      },
      {
        "item": "Bloom fiilleri uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "Bloom düzeyi program düzeyine uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "Amaç–DÖÇ uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–içerik uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "İçerik–haftalık plan uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–öğretim yöntemi uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–ölçme/değerlendirme uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "AKTS–iş yükü tutarlı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–PÇ matrisi gerçekçi mi?",
        "status": "Revize Edildi"
      },
      {
        "item": "1–5 katkı düzeyleri doğru kullanılmış mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "Yapay yüksek ilişkilendirme var mı?",
        "status": "Uygun"
      },
      {
        "item": "Tekrarlı kodlar doğru tekilleştirildi mi?",
        "status": "Revize Edildi"
      },
      {
        "item": "Kaynakta olmayan bilgi kesin bilgi gibi yazılmış mı?",
        "status": "Doğrulanmalı",
        "note": "Kesin OBS ders paketi bağlantısı bulunmadığından resmî müfredat kimliği korunmuş; eksik akademik alanlar handoff ölçütleri ve LEE_DBP'deki güncel 11 PÇ temelinde öneri niteliğinde tamamlanmıştır."
      },
      {
        "item": "Eksik/doğrulanması gereken alan kaldı mı?",
        "status": "Doğrulanmalı",
        "note": "Kesin OBS ders paketi bağlantısı bulunmadığından resmî müfredat kimliği korunmuş; eksik akademik alanlar handoff ölçütleri ve LEE_DBP'deki güncel 11 PÇ temelinde öneri niteliğinde tamamlanmıştır."
      }
    ],
    "publicQualityChecklist": false
  },
  {
    "code": "TDE708",
    "name": "Osmanlı türkçesi",
    "department": "Türk Dili ve Edebiyatı ABD",
    "programName": "Türk Dili ve Edebiyatı",
    "language": "Türkçe",
    "level": "Tezsiz Yüksek Lisans",
    "teachingMode": "Yüz Yüze",
    "instructor": "Prof. Dr. AHMET DEMİRTAŞ",
    "theory": 3,
    "practice": 0,
    "credit": 3,
    "ects": 6,
    "prerequisites": "Yok",
    "purpose": "Öğrencinin Osmanlı Türkçesinin yazı sistemi, ses, şekil ve söz varlığı özellikleri ve farklı türlerde Osmanlı Türkçesi metinleri alanlarında ileri düzey çözümleme, karşılaştırma ve yorumlama becerisi geliştirmesini sağlamak.",
    "content": "Ders; Osmanlı Türkçesinin yazı sistemi, ses, şekil ve söz varlığı özellikleri, gramer yapıları ve söz dizimi, farklı türlerde Osmanlı Türkçesi metinleri, çeviri yazı ve metin çözümleme ilkeleri konularını Türk dili ve edebiyatı araştırmalarının tarihsel, kültürel ve kuramsal bağlamlarıyla ilişkilendirerek ele alır.",
    "methods": "Kuramsal anlatım, yönlendirilmiş tartışma, kaynak ve metin incelemesi, karşılaştırmalı çözümleme, bireysel çalışma ve yapılandırılmış geri bildirim.",
    "resources": "Türk Dil Kurumu yayınları ve sözlükleri; Türkiye Yazma Eserler Kurumu Başkanlığı koleksiyonları; alanın temel başvuru eserleri; TÜBİTAK ULAKBİM TR Dizin ve güncel hakemli Türk dili ve edebiyatı araştırmaları.",
    "sdgs": [
      "4",
      "10",
      "11"
    ],
    "outcomes": [
      "Osmanlı Türkçesinin yazı sistemi ile ilgili ileri kavramları analiz eder.",
      "Ses, şekil ve söz varlığı özellikleri kapsamında kaynak ve metinleri eleştirel değerlendirir.",
      "Gramer yapıları ve söz dizimi ile ilişkili dilsel veya edebî örnekleri karşılaştırır.",
      "Farklı türlerde Osmanlı Türkçesi metinleri için uygun çözümleme yaklaşımını uygular.",
      "Çeviri yazı ve metin çözümleme ilkeleri temelinde gerekçeli akademik yorum geliştirir."
    ],
    "weeklyTopics": [
      "Osmanlı Türkçesinin yazı sistemi: kapsam ve temel kavramlar",
      "Osmanlı Türkçesinin yazı sistemi: tarihsel ve kuramsal çerçeve",
      "Osmanlı Türkçesinin yazı sistemi: kaynak ve metin türleri",
      "Ses, şekil ve söz varlığı özellikleri: temel ilkeler",
      "Ses, şekil ve söz varlığı özellikleri: örneklerin çözümlenmesi",
      "Ses, şekil ve söz varlığı özellikleri: farklı yaklaşımların karşılaştırılması",
      "Gramer yapıları ve söz dizimi: kavramsal yapı",
      "Gramer yapıları ve söz dizimi: metin veya dil verilerine uygulama",
      "Gramer yapıları ve söz dizimi: bulguların yorumlanması",
      "Farklı türlerde Osmanlı Türkçesi metinleri: yöntem ve teknikler",
      "Farklı türlerde Osmanlı Türkçesi metinleri: seçilmiş örneklerin incelenmesi",
      "Farklı türlerde Osmanlı Türkçesi metinleri: bağlam ve işlev ilişkisi",
      "Çeviri yazı ve metin çözümleme ilkeleri: güncel tartışmalar",
      "Çeviri yazı ve metin çözümleme ilkeleri: etik ve kültürel boyutlar",
      "Çeviri yazı ve metin çözümleme ilkeleri: bütüncül akademik değerlendirme"
    ],
    "assessments": [
      {
        "name": "Ara Sınav",
        "count": 1,
        "weight": 40
      },
      {
        "name": "Yarıyıl Sonu Sınavı",
        "count": 1,
        "weight": 60
      }
    ],
    "workloads": [
      {
        "name": "Ders Süresi",
        "count": 15,
        "hours": 3,
        "total": 45
      },
      {
        "name": "Sınıf Dışı Çalışma Süresi",
        "count": 15,
        "hours": 6,
        "total": 90
      },
      {
        "name": "Ara Sınav Hazırlığı",
        "count": 1,
        "hours": 20,
        "total": 20
      },
      {
        "name": "Yarıyıl Sonu Sınavı Hazırlığı",
        "count": 1,
        "hours": 25,
        "total": 25
      }
    ],
    "contributionMatrix": [
      {
        "outcome": "DÖÇ1",
        "values": [
          4,
          4,
          4,
          4,
          4,
          4,
          2,
          4,
          2,
          4,
          2
        ]
      },
      {
        "outcome": "DÖÇ2",
        "values": [
          4,
          4,
          4,
          4,
          4,
          4,
          3,
          4,
          3,
          4,
          3
        ]
      },
      {
        "outcome": "DÖÇ3",
        "values": [
          5,
          5,
          5,
          5,
          5,
          5,
          2,
          5,
          2,
          5,
          2
        ]
      },
      {
        "outcome": "DÖÇ4",
        "values": [
          4,
          4,
          4,
          4,
          4,
          4,
          3,
          4,
          3,
          4,
          3
        ]
      },
      {
        "outcome": "DÖÇ5",
        "values": [
          5,
          5,
          5,
          5,
          5,
          5,
          2,
          5,
          2,
          5,
          2
        ]
      }
    ],
    "qualityChecks": [
      {
        "item": "Ders adı ve kodları doğrulandı mı?",
        "status": "Uygun"
      },
      {
        "item": "Tüm OBS bağlantıları gerçek mi?",
        "status": "Doğrulanmalı",
        "note": "Kesin OBS ders paketi bağlantısı bulunmadığından resmî müfredat kimliği korunmuş; eksik akademik alanlar handoff ölçütleri ve LEE_DBP'deki güncel 11 PÇ temelinde öneri niteliğinde tamamlanmıştır."
      },
      {
        "item": "Dersin program düzeyi doğru mu?",
        "status": "Uygun"
      },
      {
        "item": "Ders amacı açık ve uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "Ders amacı program düzeyine uygun mu?",
        "status": "Uygun"
      },
      {
        "item": "DÖÇ sayısı ve kapsamı uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ'ler ölçülebilir mi?",
        "status": "Revize Edildi"
      },
      {
        "item": "Bloom fiilleri uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "Bloom düzeyi program düzeyine uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "Amaç–DÖÇ uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–içerik uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "İçerik–haftalık plan uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–öğretim yöntemi uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–ölçme/değerlendirme uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "AKTS–iş yükü tutarlı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–PÇ matrisi gerçekçi mi?",
        "status": "Revize Edildi"
      },
      {
        "item": "1–5 katkı düzeyleri doğru kullanılmış mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "Yapay yüksek ilişkilendirme var mı?",
        "status": "Uygun"
      },
      {
        "item": "Tekrarlı kodlar doğru tekilleştirildi mi?",
        "status": "Revize Edildi"
      },
      {
        "item": "Kaynakta olmayan bilgi kesin bilgi gibi yazılmış mı?",
        "status": "Doğrulanmalı",
        "note": "Kesin OBS ders paketi bağlantısı bulunmadığından resmî müfredat kimliği korunmuş; eksik akademik alanlar handoff ölçütleri ve LEE_DBP'deki güncel 11 PÇ temelinde öneri niteliğinde tamamlanmıştır."
      },
      {
        "item": "Eksik/doğrulanması gereken alan kaldı mı?",
        "status": "Doğrulanmalı",
        "note": "Kesin OBS ders paketi bağlantısı bulunmadığından resmî müfredat kimliği korunmuş; eksik akademik alanlar handoff ölçütleri ve LEE_DBP'deki güncel 11 PÇ temelinde öneri niteliğinde tamamlanmıştır."
      }
    ],
    "publicQualityChecklist": false
  },
  {
    "code": "TDE710",
    "name": "Eski türk edebiyatı manzum metin incelemeleri...",
    "department": "Türk Dili ve Edebiyatı ABD",
    "programName": "Türk Dili ve Edebiyatı",
    "language": "Türkçe",
    "level": "Tezsiz Yüksek Lisans",
    "teachingMode": "Yüz Yüze",
    "instructor": "Prof. Dr. YUNUS KAPLAN",
    "theory": 3,
    "practice": 0,
    "credit": 3,
    "ects": 6,
    "prerequisites": "Yok",
    "purpose": "Öğrencinin klasik Türk şiirinin estetik ve tarihsel çerçevesi, nazım şekilleri, türler ve söz sanatları ve manzum metinlerin şerh ve tahlili alanlarında ileri düzey çözümleme, karşılaştırma ve yorumlama becerisi geliştirmesini sağlamak.",
    "content": "Ders; klasik Türk şiirinin estetik ve tarihsel çerçevesi, nazım şekilleri, türler ve söz sanatları, şair, metin ve dönem ilişkisi, manzum metinlerin şerh ve tahlili, klasik edebiyat metinlerinin karşılaştırmalı yorumu konularını Türk dili ve edebiyatı araştırmalarının tarihsel, kültürel ve kuramsal bağlamlarıyla ilişkilendirerek ele alır.",
    "methods": "Kuramsal anlatım, yönlendirilmiş tartışma, kaynak ve metin incelemesi, karşılaştırmalı çözümleme, bireysel çalışma ve yapılandırılmış geri bildirim.",
    "resources": "Türk Dil Kurumu yayınları ve sözlükleri; Türkiye Yazma Eserler Kurumu Başkanlığı koleksiyonları; alanın temel başvuru eserleri; TÜBİTAK ULAKBİM TR Dizin ve güncel hakemli Türk dili ve edebiyatı araştırmaları.",
    "sdgs": [
      "4",
      "10",
      "11"
    ],
    "outcomes": [
      "Klasik Türk şiirinin estetik ve tarihsel çerçevesi ile ilgili ileri kavramları analiz eder.",
      "Nazım şekilleri, türler ve söz sanatları kapsamında kaynak ve metinleri eleştirel değerlendirir.",
      "Şair, metin ve dönem ilişkisi ile ilişkili dilsel veya edebî örnekleri karşılaştırır.",
      "Manzum metinlerin şerh ve tahlili için uygun çözümleme yaklaşımını uygular.",
      "Klasik edebiyat metinlerinin karşılaştırmalı yorumu temelinde gerekçeli akademik yorum geliştirir."
    ],
    "weeklyTopics": [
      "Klasik Türk şiirinin estetik ve tarihsel çerçevesi: kapsam ve temel kavramlar",
      "Klasik Türk şiirinin estetik ve tarihsel çerçevesi: tarihsel ve kuramsal çerçeve",
      "Klasik Türk şiirinin estetik ve tarihsel çerçevesi: kaynak ve metin türleri",
      "Nazım şekilleri, türler ve söz sanatları: temel ilkeler",
      "Nazım şekilleri, türler ve söz sanatları: örneklerin çözümlenmesi",
      "Nazım şekilleri, türler ve söz sanatları: farklı yaklaşımların karşılaştırılması",
      "Şair, metin ve dönem ilişkisi: kavramsal yapı",
      "Şair, metin ve dönem ilişkisi: metin veya dil verilerine uygulama",
      "Şair, metin ve dönem ilişkisi: bulguların yorumlanması",
      "Manzum metinlerin şerh ve tahlili: yöntem ve teknikler",
      "Manzum metinlerin şerh ve tahlili: seçilmiş örneklerin incelenmesi",
      "Manzum metinlerin şerh ve tahlili: bağlam ve işlev ilişkisi",
      "Klasik edebiyat metinlerinin karşılaştırmalı yorumu: güncel tartışmalar",
      "Klasik edebiyat metinlerinin karşılaştırmalı yorumu: etik ve kültürel boyutlar",
      "Klasik edebiyat metinlerinin karşılaştırmalı yorumu: bütüncül akademik değerlendirme"
    ],
    "assessments": [
      {
        "name": "Ara Sınav",
        "count": 1,
        "weight": 40
      },
      {
        "name": "Yarıyıl Sonu Sınavı",
        "count": 1,
        "weight": 60
      }
    ],
    "workloads": [
      {
        "name": "Ders Süresi",
        "count": 15,
        "hours": 3,
        "total": 45
      },
      {
        "name": "Sınıf Dışı Çalışma Süresi",
        "count": 15,
        "hours": 6,
        "total": 90
      },
      {
        "name": "Ara Sınav Hazırlığı",
        "count": 1,
        "hours": 20,
        "total": 20
      },
      {
        "name": "Yarıyıl Sonu Sınavı Hazırlığı",
        "count": 1,
        "hours": 25,
        "total": 25
      }
    ],
    "contributionMatrix": [
      {
        "outcome": "DÖÇ1",
        "values": [
          4,
          4,
          4,
          4,
          4,
          4,
          2,
          4,
          2,
          4,
          2
        ]
      },
      {
        "outcome": "DÖÇ2",
        "values": [
          4,
          4,
          4,
          4,
          4,
          4,
          3,
          4,
          3,
          4,
          3
        ]
      },
      {
        "outcome": "DÖÇ3",
        "values": [
          5,
          5,
          5,
          5,
          5,
          5,
          2,
          5,
          2,
          5,
          2
        ]
      },
      {
        "outcome": "DÖÇ4",
        "values": [
          4,
          4,
          4,
          4,
          4,
          4,
          3,
          4,
          3,
          4,
          3
        ]
      },
      {
        "outcome": "DÖÇ5",
        "values": [
          5,
          5,
          5,
          5,
          5,
          5,
          2,
          5,
          2,
          5,
          2
        ]
      }
    ],
    "qualityChecks": [
      {
        "item": "Ders adı ve kodları doğrulandı mı?",
        "status": "Uygun"
      },
      {
        "item": "Tüm OBS bağlantıları gerçek mi?",
        "status": "Doğrulanmalı",
        "note": "Kesin OBS ders paketi bağlantısı bulunmadığından resmî müfredat kimliği korunmuş; eksik akademik alanlar handoff ölçütleri ve LEE_DBP'deki güncel 11 PÇ temelinde öneri niteliğinde tamamlanmıştır."
      },
      {
        "item": "Dersin program düzeyi doğru mu?",
        "status": "Uygun"
      },
      {
        "item": "Ders amacı açık ve uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "Ders amacı program düzeyine uygun mu?",
        "status": "Uygun"
      },
      {
        "item": "DÖÇ sayısı ve kapsamı uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ'ler ölçülebilir mi?",
        "status": "Revize Edildi"
      },
      {
        "item": "Bloom fiilleri uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "Bloom düzeyi program düzeyine uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "Amaç–DÖÇ uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–içerik uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "İçerik–haftalık plan uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–öğretim yöntemi uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–ölçme/değerlendirme uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "AKTS–iş yükü tutarlı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–PÇ matrisi gerçekçi mi?",
        "status": "Revize Edildi"
      },
      {
        "item": "1–5 katkı düzeyleri doğru kullanılmış mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "Yapay yüksek ilişkilendirme var mı?",
        "status": "Uygun"
      },
      {
        "item": "Tekrarlı kodlar doğru tekilleştirildi mi?",
        "status": "Revize Edildi"
      },
      {
        "item": "Kaynakta olmayan bilgi kesin bilgi gibi yazılmış mı?",
        "status": "Doğrulanmalı",
        "note": "Kesin OBS ders paketi bağlantısı bulunmadığından resmî müfredat kimliği korunmuş; eksik akademik alanlar handoff ölçütleri ve LEE_DBP'deki güncel 11 PÇ temelinde öneri niteliğinde tamamlanmıştır."
      },
      {
        "item": "Eksik/doğrulanması gereken alan kaldı mı?",
        "status": "Doğrulanmalı",
        "note": "Kesin OBS ders paketi bağlantısı bulunmadığından resmî müfredat kimliği korunmuş; eksik akademik alanlar handoff ölçütleri ve LEE_DBP'deki güncel 11 PÇ temelinde öneri niteliğinde tamamlanmıştır."
      }
    ],
    "publicQualityChecklist": false
  },
  {
    "code": "TDE712",
    "name": "Türkçenin sözcük bilgisi ve söz dizimi",
    "department": "Türk Dili ve Edebiyatı ABD",
    "programName": "Türk Dili ve Edebiyatı",
    "language": "Türkçe",
    "level": "Tezsiz Yüksek Lisans",
    "teachingMode": "Yüz Yüze",
    "instructor": "Prof. Dr. AHMET DEMİRTAŞ",
    "theory": 3,
    "practice": 0,
    "credit": 3,
    "ects": 6,
    "prerequisites": "Yok",
    "purpose": "Öğrencinin Türkçenin dil bilgisel yapısı, ses ve şekil bilgisi süreçleri ve dil verilerinin sınıflandırılması alanlarında ileri düzey çözümleme, karşılaştırma ve yorumlama becerisi geliştirmesini sağlamak.",
    "content": "Ders; Türkçenin dil bilgisel yapısı, ses ve şekil bilgisi süreçleri, sözcük bilgisi ve söz dizimi, dil verilerinin sınıflandırılması, Türkçe örneklerin bilimsel çözümlemesi konularını Türk dili ve edebiyatı araştırmalarının tarihsel, kültürel ve kuramsal bağlamlarıyla ilişkilendirerek ele alır.",
    "methods": "Kuramsal anlatım, yönlendirilmiş tartışma, kaynak ve metin incelemesi, karşılaştırmalı çözümleme, bireysel çalışma ve yapılandırılmış geri bildirim.",
    "resources": "Türk Dil Kurumu yayınları ve sözlükleri; Türkiye Yazma Eserler Kurumu Başkanlığı koleksiyonları; alanın temel başvuru eserleri; TÜBİTAK ULAKBİM TR Dizin ve güncel hakemli Türk dili ve edebiyatı araştırmaları.",
    "sdgs": [
      "4",
      "10",
      "11"
    ],
    "outcomes": [
      "Türkçenin dil bilgisel yapısı ile ilgili ileri kavramları analiz eder.",
      "Ses ve şekil bilgisi süreçleri kapsamında kaynak ve metinleri eleştirel değerlendirir.",
      "Sözcük bilgisi ve söz dizimi ile ilişkili dilsel veya edebî örnekleri karşılaştırır.",
      "Dil verilerinin sınıflandırılması için uygun çözümleme yaklaşımını uygular.",
      "Türkçe örneklerin bilimsel çözümlemesi temelinde gerekçeli akademik yorum geliştirir."
    ],
    "weeklyTopics": [
      "Türkçenin dil bilgisel yapısı: kapsam ve temel kavramlar",
      "Türkçenin dil bilgisel yapısı: tarihsel ve kuramsal çerçeve",
      "Türkçenin dil bilgisel yapısı: kaynak ve metin türleri",
      "Ses ve şekil bilgisi süreçleri: temel ilkeler",
      "Ses ve şekil bilgisi süreçleri: örneklerin çözümlenmesi",
      "Ses ve şekil bilgisi süreçleri: farklı yaklaşımların karşılaştırılması",
      "Sözcük bilgisi ve söz dizimi: kavramsal yapı",
      "Sözcük bilgisi ve söz dizimi: metin veya dil verilerine uygulama",
      "Sözcük bilgisi ve söz dizimi: bulguların yorumlanması",
      "Dil verilerinin sınıflandırılması: yöntem ve teknikler",
      "Dil verilerinin sınıflandırılması: seçilmiş örneklerin incelenmesi",
      "Dil verilerinin sınıflandırılması: bağlam ve işlev ilişkisi",
      "Türkçe örneklerin bilimsel çözümlemesi: güncel tartışmalar",
      "Türkçe örneklerin bilimsel çözümlemesi: etik ve kültürel boyutlar",
      "Türkçe örneklerin bilimsel çözümlemesi: bütüncül akademik değerlendirme"
    ],
    "assessments": [
      {
        "name": "Ara Sınav",
        "count": 1,
        "weight": 40
      },
      {
        "name": "Yarıyıl Sonu Sınavı",
        "count": 1,
        "weight": 60
      }
    ],
    "workloads": [
      {
        "name": "Ders Süresi",
        "count": 15,
        "hours": 3,
        "total": 45
      },
      {
        "name": "Sınıf Dışı Çalışma Süresi",
        "count": 15,
        "hours": 6,
        "total": 90
      },
      {
        "name": "Ara Sınav Hazırlığı",
        "count": 1,
        "hours": 20,
        "total": 20
      },
      {
        "name": "Yarıyıl Sonu Sınavı Hazırlığı",
        "count": 1,
        "hours": 25,
        "total": 25
      }
    ],
    "contributionMatrix": [
      {
        "outcome": "DÖÇ1",
        "values": [
          4,
          2,
          2,
          4,
          2,
          4,
          2,
          4,
          2,
          4,
          2
        ]
      },
      {
        "outcome": "DÖÇ2",
        "values": [
          4,
          3,
          3,
          4,
          3,
          4,
          3,
          4,
          3,
          4,
          3
        ]
      },
      {
        "outcome": "DÖÇ3",
        "values": [
          5,
          2,
          2,
          5,
          2,
          5,
          2,
          5,
          2,
          5,
          2
        ]
      },
      {
        "outcome": "DÖÇ4",
        "values": [
          4,
          3,
          3,
          4,
          3,
          4,
          3,
          4,
          3,
          4,
          3
        ]
      },
      {
        "outcome": "DÖÇ5",
        "values": [
          5,
          2,
          2,
          5,
          2,
          5,
          2,
          5,
          2,
          5,
          2
        ]
      }
    ],
    "qualityChecks": [
      {
        "item": "Ders adı ve kodları doğrulandı mı?",
        "status": "Uygun"
      },
      {
        "item": "Tüm OBS bağlantıları gerçek mi?",
        "status": "Doğrulanmalı",
        "note": "Kesin OBS ders paketi bağlantısı bulunmadığından resmî müfredat kimliği korunmuş; eksik akademik alanlar handoff ölçütleri ve LEE_DBP'deki güncel 11 PÇ temelinde öneri niteliğinde tamamlanmıştır."
      },
      {
        "item": "Dersin program düzeyi doğru mu?",
        "status": "Uygun"
      },
      {
        "item": "Ders amacı açık ve uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "Ders amacı program düzeyine uygun mu?",
        "status": "Uygun"
      },
      {
        "item": "DÖÇ sayısı ve kapsamı uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ'ler ölçülebilir mi?",
        "status": "Revize Edildi"
      },
      {
        "item": "Bloom fiilleri uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "Bloom düzeyi program düzeyine uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "Amaç–DÖÇ uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–içerik uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "İçerik–haftalık plan uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–öğretim yöntemi uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–ölçme/değerlendirme uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "AKTS–iş yükü tutarlı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–PÇ matrisi gerçekçi mi?",
        "status": "Revize Edildi"
      },
      {
        "item": "1–5 katkı düzeyleri doğru kullanılmış mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "Yapay yüksek ilişkilendirme var mı?",
        "status": "Uygun"
      },
      {
        "item": "Tekrarlı kodlar doğru tekilleştirildi mi?",
        "status": "Revize Edildi"
      },
      {
        "item": "Kaynakta olmayan bilgi kesin bilgi gibi yazılmış mı?",
        "status": "Doğrulanmalı",
        "note": "Kesin OBS ders paketi bağlantısı bulunmadığından resmî müfredat kimliği korunmuş; eksik akademik alanlar handoff ölçütleri ve LEE_DBP'deki güncel 11 PÇ temelinde öneri niteliğinde tamamlanmıştır."
      },
      {
        "item": "Eksik/doğrulanması gereken alan kaldı mı?",
        "status": "Doğrulanmalı",
        "note": "Kesin OBS ders paketi bağlantısı bulunmadığından resmî müfredat kimliği korunmuş; eksik akademik alanlar handoff ölçütleri ve LEE_DBP'deki güncel 11 PÇ temelinde öneri niteliğinde tamamlanmıştır."
      }
    ],
    "publicQualityChecklist": false
  },
  {
    "code": "TDE714",
    "name": "Türk destanları",
    "department": "Türk Dili ve Edebiyatı ABD",
    "programName": "Türk Dili ve Edebiyatı",
    "language": "Türkçe",
    "level": "Tezsiz Yüksek Lisans",
    "teachingMode": "Yüz Yüze",
    "instructor": "Doç. Dr. ALİ DOĞANER",
    "theory": 3,
    "practice": 0,
    "credit": 3,
    "ects": 6,
    "prerequisites": "Yok",
    "purpose": "Öğrencinin Türk mitolojisinin kavramsal çerçevesi, mit, ritüel ve sembol ilişkisi ve mitolojik unsurların metinlerdeki işlevi alanlarında ileri düzey çözümleme, karşılaştırma ve yorumlama becerisi geliştirmesini sağlamak.",
    "content": "Ders; Türk mitolojisinin kavramsal çerçevesi, mit, ritüel ve sembol ilişkisi, Türk destan geleneği ve tipleri, mitolojik unsurların metinlerdeki işlevi, mit ve destanların kültürel sürekliliği konularını Türk dili ve edebiyatı araştırmalarının tarihsel, kültürel ve kuramsal bağlamlarıyla ilişkilendirerek ele alır.",
    "methods": "Kuramsal anlatım, yönlendirilmiş tartışma, kaynak ve metin incelemesi, karşılaştırmalı çözümleme, bireysel çalışma ve yapılandırılmış geri bildirim.",
    "resources": "Türk Dil Kurumu yayınları ve sözlükleri; Türkiye Yazma Eserler Kurumu Başkanlığı koleksiyonları; alanın temel başvuru eserleri; TÜBİTAK ULAKBİM TR Dizin ve güncel hakemli Türk dili ve edebiyatı araştırmaları.",
    "sdgs": [
      "4",
      "10",
      "11"
    ],
    "outcomes": [
      "Türk mitolojisinin kavramsal çerçevesi ile ilgili ileri kavramları analiz eder.",
      "Mit, ritüel ve sembol ilişkisi kapsamında kaynak ve metinleri eleştirel değerlendirir.",
      "Türk destan geleneği ve tipleri ile ilişkili dilsel veya edebî örnekleri karşılaştırır.",
      "Mitolojik unsurların metinlerdeki işlevi için uygun çözümleme yaklaşımını uygular.",
      "Mit ve destanların kültürel sürekliliği temelinde gerekçeli akademik yorum geliştirir."
    ],
    "weeklyTopics": [
      "Türk mitolojisinin kavramsal çerçevesi: kapsam ve temel kavramlar",
      "Türk mitolojisinin kavramsal çerçevesi: tarihsel ve kuramsal çerçeve",
      "Türk mitolojisinin kavramsal çerçevesi: kaynak ve metin türleri",
      "Mit, ritüel ve sembol ilişkisi: temel ilkeler",
      "Mit, ritüel ve sembol ilişkisi: örneklerin çözümlenmesi",
      "Mit, ritüel ve sembol ilişkisi: farklı yaklaşımların karşılaştırılması",
      "Türk destan geleneği ve tipleri: kavramsal yapı",
      "Türk destan geleneği ve tipleri: metin veya dil verilerine uygulama",
      "Türk destan geleneği ve tipleri: bulguların yorumlanması",
      "Mitolojik unsurların metinlerdeki işlevi: yöntem ve teknikler",
      "Mitolojik unsurların metinlerdeki işlevi: seçilmiş örneklerin incelenmesi",
      "Mitolojik unsurların metinlerdeki işlevi: bağlam ve işlev ilişkisi",
      "Mit ve destanların kültürel sürekliliği: güncel tartışmalar",
      "Mit ve destanların kültürel sürekliliği: etik ve kültürel boyutlar",
      "Mit ve destanların kültürel sürekliliği: bütüncül akademik değerlendirme"
    ],
    "assessments": [
      {
        "name": "Ara Sınav",
        "count": 1,
        "weight": 40
      },
      {
        "name": "Yarıyıl Sonu Sınavı",
        "count": 1,
        "weight": 60
      }
    ],
    "workloads": [
      {
        "name": "Ders Süresi",
        "count": 15,
        "hours": 3,
        "total": 45
      },
      {
        "name": "Sınıf Dışı Çalışma Süresi",
        "count": 15,
        "hours": 6,
        "total": 90
      },
      {
        "name": "Ara Sınav Hazırlığı",
        "count": 1,
        "hours": 20,
        "total": 20
      },
      {
        "name": "Yarıyıl Sonu Sınavı Hazırlığı",
        "count": 1,
        "hours": 25,
        "total": 25
      }
    ],
    "contributionMatrix": [
      {
        "outcome": "DÖÇ1",
        "values": [
          2,
          4,
          4,
          2,
          4,
          4,
          2,
          4,
          2,
          2,
          4
        ]
      },
      {
        "outcome": "DÖÇ2",
        "values": [
          3,
          4,
          4,
          3,
          4,
          4,
          3,
          4,
          3,
          3,
          4
        ]
      },
      {
        "outcome": "DÖÇ3",
        "values": [
          2,
          5,
          5,
          2,
          5,
          5,
          2,
          5,
          2,
          2,
          5
        ]
      },
      {
        "outcome": "DÖÇ4",
        "values": [
          3,
          4,
          4,
          3,
          4,
          4,
          3,
          4,
          3,
          3,
          4
        ]
      },
      {
        "outcome": "DÖÇ5",
        "values": [
          2,
          5,
          5,
          2,
          5,
          5,
          2,
          5,
          2,
          2,
          5
        ]
      }
    ],
    "qualityChecks": [
      {
        "item": "Ders adı ve kodları doğrulandı mı?",
        "status": "Uygun"
      },
      {
        "item": "Tüm OBS bağlantıları gerçek mi?",
        "status": "Doğrulanmalı",
        "note": "Kesin OBS ders paketi bağlantısı bulunmadığından resmî müfredat kimliği korunmuş; eksik akademik alanlar handoff ölçütleri ve LEE_DBP'deki güncel 11 PÇ temelinde öneri niteliğinde tamamlanmıştır."
      },
      {
        "item": "Dersin program düzeyi doğru mu?",
        "status": "Uygun"
      },
      {
        "item": "Ders amacı açık ve uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "Ders amacı program düzeyine uygun mu?",
        "status": "Uygun"
      },
      {
        "item": "DÖÇ sayısı ve kapsamı uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ'ler ölçülebilir mi?",
        "status": "Revize Edildi"
      },
      {
        "item": "Bloom fiilleri uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "Bloom düzeyi program düzeyine uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "Amaç–DÖÇ uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–içerik uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "İçerik–haftalık plan uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–öğretim yöntemi uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–ölçme/değerlendirme uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "AKTS–iş yükü tutarlı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–PÇ matrisi gerçekçi mi?",
        "status": "Revize Edildi"
      },
      {
        "item": "1–5 katkı düzeyleri doğru kullanılmış mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "Yapay yüksek ilişkilendirme var mı?",
        "status": "Uygun"
      },
      {
        "item": "Tekrarlı kodlar doğru tekilleştirildi mi?",
        "status": "Revize Edildi"
      },
      {
        "item": "Kaynakta olmayan bilgi kesin bilgi gibi yazılmış mı?",
        "status": "Doğrulanmalı",
        "note": "Kesin OBS ders paketi bağlantısı bulunmadığından resmî müfredat kimliği korunmuş; eksik akademik alanlar handoff ölçütleri ve LEE_DBP'deki güncel 11 PÇ temelinde öneri niteliğinde tamamlanmıştır."
      },
      {
        "item": "Eksik/doğrulanması gereken alan kaldı mı?",
        "status": "Doğrulanmalı",
        "note": "Kesin OBS ders paketi bağlantısı bulunmadığından resmî müfredat kimliği korunmuş; eksik akademik alanlar handoff ölçütleri ve LEE_DBP'deki güncel 11 PÇ temelinde öneri niteliğinde tamamlanmıştır."
      }
    ],
    "publicQualityChecklist": false
  },
  {
    "code": "TDE716",
    "name": "Türk dilinin gelişim evreleri ıı",
    "department": "Türk Dili ve Edebiyatı ABD",
    "programName": "Türk Dili ve Edebiyatı",
    "language": "Türkçe",
    "level": "Tezsiz Yüksek Lisans",
    "teachingMode": "Yüz Yüze",
    "instructor": "Dr. Öğr. Üyesi MURAT DOĞAN",
    "theory": 3,
    "practice": 0,
    "credit": 3,
    "ects": 6,
    "prerequisites": "Yok",
    "purpose": "Öğrencinin Türk dilinin tarihsel dönemleri, tarihî lehçe ve yazı dilleri ve tarihî metinlerin karşılaştırılması alanlarında ileri düzey çözümleme, karşılaştırma ve yorumlama becerisi geliştirmesini sağlamak.",
    "content": "Ders; Türk dilinin tarihsel dönemleri, tarihî lehçe ve yazı dilleri, ses, şekil ve söz varlığı değişmeleri, tarihî metinlerin karşılaştırılması, Türk dilinin gelişimindeki süreklilik ve dönüşüm konularını Türk dili ve edebiyatı araştırmalarının tarihsel, kültürel ve kuramsal bağlamlarıyla ilişkilendirerek ele alır.",
    "methods": "Kuramsal anlatım, yönlendirilmiş tartışma, kaynak ve metin incelemesi, karşılaştırmalı çözümleme, bireysel çalışma ve yapılandırılmış geri bildirim.",
    "resources": "Türk Dil Kurumu yayınları ve sözlükleri; Türkiye Yazma Eserler Kurumu Başkanlığı koleksiyonları; alanın temel başvuru eserleri; TÜBİTAK ULAKBİM TR Dizin ve güncel hakemli Türk dili ve edebiyatı araştırmaları.",
    "sdgs": [
      "4",
      "10",
      "11"
    ],
    "outcomes": [
      "Türk dilinin tarihsel dönemleri ile ilgili ileri kavramları analiz eder.",
      "Tarihî lehçe ve yazı dilleri kapsamında kaynak ve metinleri eleştirel değerlendirir.",
      "Ses, şekil ve söz varlığı değişmeleri ile ilişkili dilsel veya edebî örnekleri karşılaştırır.",
      "Tarihî metinlerin karşılaştırılması için uygun çözümleme yaklaşımını uygular.",
      "Türk dilinin gelişimindeki süreklilik ve dönüşüm temelinde gerekçeli akademik yorum geliştirir."
    ],
    "weeklyTopics": [
      "Türk dilinin tarihsel dönemleri: kapsam ve temel kavramlar",
      "Türk dilinin tarihsel dönemleri: tarihsel ve kuramsal çerçeve",
      "Türk dilinin tarihsel dönemleri: kaynak ve metin türleri",
      "Tarihî lehçe ve yazı dilleri: temel ilkeler",
      "Tarihî lehçe ve yazı dilleri: örneklerin çözümlenmesi",
      "Tarihî lehçe ve yazı dilleri: farklı yaklaşımların karşılaştırılması",
      "Ses, şekil ve söz varlığı değişmeleri: kavramsal yapı",
      "Ses, şekil ve söz varlığı değişmeleri: metin veya dil verilerine uygulama",
      "Ses, şekil ve söz varlığı değişmeleri: bulguların yorumlanması",
      "Tarihî metinlerin karşılaştırılması: yöntem ve teknikler",
      "Tarihî metinlerin karşılaştırılması: seçilmiş örneklerin incelenmesi",
      "Tarihî metinlerin karşılaştırılması: bağlam ve işlev ilişkisi",
      "Türk dilinin gelişimindeki süreklilik ve dönüşüm: güncel tartışmalar",
      "Türk dilinin gelişimindeki süreklilik ve dönüşüm: etik ve kültürel boyutlar",
      "Türk dilinin gelişimindeki süreklilik ve dönüşüm: bütüncül akademik değerlendirme"
    ],
    "assessments": [
      {
        "name": "Ara Sınav",
        "count": 1,
        "weight": 40
      },
      {
        "name": "Yarıyıl Sonu Sınavı",
        "count": 1,
        "weight": 60
      }
    ],
    "workloads": [
      {
        "name": "Ders Süresi",
        "count": 15,
        "hours": 3,
        "total": 45
      },
      {
        "name": "Sınıf Dışı Çalışma Süresi",
        "count": 15,
        "hours": 6,
        "total": 90
      },
      {
        "name": "Ara Sınav Hazırlığı",
        "count": 1,
        "hours": 20,
        "total": 20
      },
      {
        "name": "Yarıyıl Sonu Sınavı Hazırlığı",
        "count": 1,
        "hours": 25,
        "total": 25
      }
    ],
    "contributionMatrix": [
      {
        "outcome": "DÖÇ1",
        "values": [
          4,
          4,
          4,
          4,
          4,
          4,
          2,
          4,
          2,
          4,
          2
        ]
      },
      {
        "outcome": "DÖÇ2",
        "values": [
          4,
          4,
          4,
          4,
          4,
          4,
          3,
          4,
          3,
          4,
          3
        ]
      },
      {
        "outcome": "DÖÇ3",
        "values": [
          5,
          5,
          5,
          5,
          5,
          5,
          2,
          5,
          2,
          5,
          2
        ]
      },
      {
        "outcome": "DÖÇ4",
        "values": [
          4,
          4,
          4,
          4,
          4,
          4,
          3,
          4,
          3,
          4,
          3
        ]
      },
      {
        "outcome": "DÖÇ5",
        "values": [
          5,
          5,
          5,
          5,
          5,
          5,
          2,
          5,
          2,
          5,
          2
        ]
      }
    ],
    "qualityChecks": [
      {
        "item": "Ders adı ve kodları doğrulandı mı?",
        "status": "Uygun"
      },
      {
        "item": "Tüm OBS bağlantıları gerçek mi?",
        "status": "Doğrulanmalı",
        "note": "Kesin OBS ders paketi bağlantısı bulunmadığından resmî müfredat kimliği korunmuş; eksik akademik alanlar handoff ölçütleri ve LEE_DBP'deki güncel 11 PÇ temelinde öneri niteliğinde tamamlanmıştır."
      },
      {
        "item": "Dersin program düzeyi doğru mu?",
        "status": "Uygun"
      },
      {
        "item": "Ders amacı açık ve uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "Ders amacı program düzeyine uygun mu?",
        "status": "Uygun"
      },
      {
        "item": "DÖÇ sayısı ve kapsamı uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ'ler ölçülebilir mi?",
        "status": "Revize Edildi"
      },
      {
        "item": "Bloom fiilleri uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "Bloom düzeyi program düzeyine uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "Amaç–DÖÇ uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–içerik uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "İçerik–haftalık plan uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–öğretim yöntemi uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–ölçme/değerlendirme uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "AKTS–iş yükü tutarlı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–PÇ matrisi gerçekçi mi?",
        "status": "Revize Edildi"
      },
      {
        "item": "1–5 katkı düzeyleri doğru kullanılmış mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "Yapay yüksek ilişkilendirme var mı?",
        "status": "Uygun"
      },
      {
        "item": "Tekrarlı kodlar doğru tekilleştirildi mi?",
        "status": "Revize Edildi"
      },
      {
        "item": "Kaynakta olmayan bilgi kesin bilgi gibi yazılmış mı?",
        "status": "Doğrulanmalı",
        "note": "Kesin OBS ders paketi bağlantısı bulunmadığından resmî müfredat kimliği korunmuş; eksik akademik alanlar handoff ölçütleri ve LEE_DBP'deki güncel 11 PÇ temelinde öneri niteliğinde tamamlanmıştır."
      },
      {
        "item": "Eksik/doğrulanması gereken alan kaldı mı?",
        "status": "Doğrulanmalı",
        "note": "Kesin OBS ders paketi bağlantısı bulunmadığından resmî müfredat kimliği korunmuş; eksik akademik alanlar handoff ölçütleri ve LEE_DBP'deki güncel 11 PÇ temelinde öneri niteliğinde tamamlanmıştır."
      }
    ],
    "publicQualityChecklist": false
  },
  {
    "code": "TDE718",
    "name": "Dil ve kültür araştırmaları",
    "department": "Türk Dili ve Edebiyatı ABD",
    "programName": "Türk Dili ve Edebiyatı",
    "language": "Türkçe",
    "level": "Tezsiz Yüksek Lisans",
    "teachingMode": "Yüz Yüze",
    "instructor": "Prof. Dr. AHMET DEMİRTAŞ",
    "theory": 3,
    "practice": 0,
    "credit": 3,
    "ects": 6,
    "prerequisites": "Yok",
    "purpose": "Öğrencinin dil ile kültür arasındaki karşılıklı ilişki, dilsel göstergeler ve kültürel anlam ve kültürel verilerin dil üzerinden çözümlenmesi alanlarında ileri düzey çözümleme, karşılaştırma ve yorumlama becerisi geliştirmesini sağlamak.",
    "content": "Ders; dil ile kültür arasındaki karşılıklı ilişki, dilsel göstergeler ve kültürel anlam, kimlik, bellek ve söylem, kültürel verilerin dil üzerinden çözümlenmesi, dil ve kültür araştırmalarında güncel yaklaşımlar konularını Türk dili ve edebiyatı araştırmalarının tarihsel, kültürel ve kuramsal bağlamlarıyla ilişkilendirerek ele alır.",
    "methods": "Kuramsal anlatım, yönlendirilmiş tartışma, kaynak ve metin incelemesi, karşılaştırmalı çözümleme, bireysel çalışma ve yapılandırılmış geri bildirim.",
    "resources": "Türk Dil Kurumu yayınları ve sözlükleri; Türkiye Yazma Eserler Kurumu Başkanlığı koleksiyonları; alanın temel başvuru eserleri; TÜBİTAK ULAKBİM TR Dizin ve güncel hakemli Türk dili ve edebiyatı araştırmaları.",
    "sdgs": [
      "4",
      "10",
      "11"
    ],
    "outcomes": [
      "Dil ile kültür arasındaki karşılıklı ilişki ile ilgili ileri kavramları analiz eder.",
      "Dilsel göstergeler ve kültürel anlam kapsamında kaynak ve metinleri eleştirel değerlendirir.",
      "Kimlik, bellek ve söylem ile ilişkili dilsel veya edebî örnekleri karşılaştırır.",
      "Kültürel verilerin dil üzerinden çözümlenmesi için uygun çözümleme yaklaşımını uygular.",
      "Dil ve kültür araştırmalarında güncel yaklaşımlar temelinde gerekçeli akademik yorum geliştirir."
    ],
    "weeklyTopics": [
      "Dil ile kültür arasındaki karşılıklı ilişki: kapsam ve temel kavramlar",
      "Dil ile kültür arasındaki karşılıklı ilişki: tarihsel ve kuramsal çerçeve",
      "Dil ile kültür arasındaki karşılıklı ilişki: kaynak ve metin türleri",
      "Dilsel göstergeler ve kültürel anlam: temel ilkeler",
      "Dilsel göstergeler ve kültürel anlam: örneklerin çözümlenmesi",
      "Dilsel göstergeler ve kültürel anlam: farklı yaklaşımların karşılaştırılması",
      "Kimlik, bellek ve söylem: kavramsal yapı",
      "Kimlik, bellek ve söylem: metin veya dil verilerine uygulama",
      "Kimlik, bellek ve söylem: bulguların yorumlanması",
      "Kültürel verilerin dil üzerinden çözümlenmesi: yöntem ve teknikler",
      "Kültürel verilerin dil üzerinden çözümlenmesi: seçilmiş örneklerin incelenmesi",
      "Kültürel verilerin dil üzerinden çözümlenmesi: bağlam ve işlev ilişkisi",
      "Dil ve kültür araştırmalarında güncel yaklaşımlar: güncel tartışmalar",
      "Dil ve kültür araştırmalarında güncel yaklaşımlar: etik ve kültürel boyutlar",
      "Dil ve kültür araştırmalarında güncel yaklaşımlar: bütüncül akademik değerlendirme"
    ],
    "assessments": [
      {
        "name": "Ara Sınav",
        "count": 1,
        "weight": 40
      },
      {
        "name": "Yarıyıl Sonu Sınavı",
        "count": 1,
        "weight": 60
      }
    ],
    "workloads": [
      {
        "name": "Ders Süresi",
        "count": 15,
        "hours": 3,
        "total": 45
      },
      {
        "name": "Sınıf Dışı Çalışma Süresi",
        "count": 15,
        "hours": 6,
        "total": 90
      },
      {
        "name": "Ara Sınav Hazırlığı",
        "count": 1,
        "hours": 20,
        "total": 20
      },
      {
        "name": "Yarıyıl Sonu Sınavı Hazırlığı",
        "count": 1,
        "hours": 25,
        "total": 25
      }
    ],
    "contributionMatrix": [
      {
        "outcome": "DÖÇ1",
        "values": [
          2,
          4,
          4,
          2,
          4,
          4,
          2,
          4,
          2,
          2,
          4
        ]
      },
      {
        "outcome": "DÖÇ2",
        "values": [
          3,
          4,
          4,
          3,
          4,
          4,
          3,
          4,
          3,
          3,
          4
        ]
      },
      {
        "outcome": "DÖÇ3",
        "values": [
          2,
          5,
          5,
          2,
          5,
          5,
          2,
          5,
          2,
          2,
          5
        ]
      },
      {
        "outcome": "DÖÇ4",
        "values": [
          3,
          4,
          4,
          3,
          4,
          4,
          3,
          4,
          3,
          3,
          4
        ]
      },
      {
        "outcome": "DÖÇ5",
        "values": [
          2,
          5,
          5,
          2,
          5,
          5,
          2,
          5,
          2,
          2,
          5
        ]
      }
    ],
    "qualityChecks": [
      {
        "item": "Ders adı ve kodları doğrulandı mı?",
        "status": "Uygun"
      },
      {
        "item": "Tüm OBS bağlantıları gerçek mi?",
        "status": "Doğrulanmalı",
        "note": "Kesin OBS ders paketi bağlantısı bulunmadığından resmî müfredat kimliği korunmuş; eksik akademik alanlar handoff ölçütleri ve LEE_DBP'deki güncel 11 PÇ temelinde öneri niteliğinde tamamlanmıştır."
      },
      {
        "item": "Dersin program düzeyi doğru mu?",
        "status": "Uygun"
      },
      {
        "item": "Ders amacı açık ve uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "Ders amacı program düzeyine uygun mu?",
        "status": "Uygun"
      },
      {
        "item": "DÖÇ sayısı ve kapsamı uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ'ler ölçülebilir mi?",
        "status": "Revize Edildi"
      },
      {
        "item": "Bloom fiilleri uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "Bloom düzeyi program düzeyine uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "Amaç–DÖÇ uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–içerik uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "İçerik–haftalık plan uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–öğretim yöntemi uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–ölçme/değerlendirme uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "AKTS–iş yükü tutarlı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–PÇ matrisi gerçekçi mi?",
        "status": "Revize Edildi"
      },
      {
        "item": "1–5 katkı düzeyleri doğru kullanılmış mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "Yapay yüksek ilişkilendirme var mı?",
        "status": "Uygun"
      },
      {
        "item": "Tekrarlı kodlar doğru tekilleştirildi mi?",
        "status": "Revize Edildi"
      },
      {
        "item": "Kaynakta olmayan bilgi kesin bilgi gibi yazılmış mı?",
        "status": "Doğrulanmalı",
        "note": "Kesin OBS ders paketi bağlantısı bulunmadığından resmî müfredat kimliği korunmuş; eksik akademik alanlar handoff ölçütleri ve LEE_DBP'deki güncel 11 PÇ temelinde öneri niteliğinde tamamlanmıştır."
      },
      {
        "item": "Eksik/doğrulanması gereken alan kaldı mı?",
        "status": "Doğrulanmalı",
        "note": "Kesin OBS ders paketi bağlantısı bulunmadığından resmî müfredat kimliği korunmuş; eksik akademik alanlar handoff ölçütleri ve LEE_DBP'deki güncel 11 PÇ temelinde öneri niteliğinde tamamlanmıştır."
      }
    ],
    "publicQualityChecklist": false
  },
  {
    "code": "TDE720",
    "name": "Karşılaştırmalı edebiyat ıı",
    "department": "Türk Dili ve Edebiyatı ABD",
    "programName": "Türk Dili ve Edebiyatı",
    "language": "Türkçe",
    "level": "Tezsiz Yüksek Lisans",
    "teachingMode": "Yüz Yüze",
    "instructor": "Prof. Dr. AHMET DEMİRTAŞ",
    "theory": 3,
    "practice": 0,
    "credit": 3,
    "ects": 6,
    "prerequisites": "Yok",
    "purpose": "Öğrencinin karşılaştırmalı edebiyatın kuramsal temelleri, metinler arası ilişkiler ve etkilenme ve ulusal ve dünya edebiyatı bağlamları alanlarında ileri düzey çözümleme, karşılaştırma ve yorumlama becerisi geliştirmesini sağlamak.",
    "content": "Ders; karşılaştırmalı edebiyatın kuramsal temelleri, metinler arası ilişkiler ve etkilenme, tema, tür ve biçim karşılaştırmaları, ulusal ve dünya edebiyatı bağlamları, karşılaştırmalı çözümleme ve yorum konularını Türk dili ve edebiyatı araştırmalarının tarihsel, kültürel ve kuramsal bağlamlarıyla ilişkilendirerek ele alır.",
    "methods": "Kuramsal anlatım, yönlendirilmiş tartışma, kaynak ve metin incelemesi, karşılaştırmalı çözümleme, bireysel çalışma ve yapılandırılmış geri bildirim.",
    "resources": "Türk Dil Kurumu yayınları ve sözlükleri; Türkiye Yazma Eserler Kurumu Başkanlığı koleksiyonları; alanın temel başvuru eserleri; TÜBİTAK ULAKBİM TR Dizin ve güncel hakemli Türk dili ve edebiyatı araştırmaları.",
    "sdgs": [
      "4",
      "10",
      "11"
    ],
    "outcomes": [
      "Karşılaştırmalı edebiyatın kuramsal temelleri ile ilgili ileri kavramları analiz eder.",
      "Metinler arası ilişkiler ve etkilenme kapsamında kaynak ve metinleri eleştirel değerlendirir.",
      "Tema, tür ve biçim karşılaştırmaları ile ilişkili dilsel veya edebî örnekleri karşılaştırır.",
      "Ulusal ve dünya edebiyatı bağlamları için uygun çözümleme yaklaşımını uygular.",
      "Karşılaştırmalı çözümleme ve yorum temelinde gerekçeli akademik yorum geliştirir."
    ],
    "weeklyTopics": [
      "Karşılaştırmalı edebiyatın kuramsal temelleri: kapsam ve temel kavramlar",
      "Karşılaştırmalı edebiyatın kuramsal temelleri: tarihsel ve kuramsal çerçeve",
      "Karşılaştırmalı edebiyatın kuramsal temelleri: kaynak ve metin türleri",
      "Metinler arası ilişkiler ve etkilenme: temel ilkeler",
      "Metinler arası ilişkiler ve etkilenme: örneklerin çözümlenmesi",
      "Metinler arası ilişkiler ve etkilenme: farklı yaklaşımların karşılaştırılması",
      "Tema, tür ve biçim karşılaştırmaları: kavramsal yapı",
      "Tema, tür ve biçim karşılaştırmaları: metin veya dil verilerine uygulama",
      "Tema, tür ve biçim karşılaştırmaları: bulguların yorumlanması",
      "Ulusal ve dünya edebiyatı bağlamları: yöntem ve teknikler",
      "Ulusal ve dünya edebiyatı bağlamları: seçilmiş örneklerin incelenmesi",
      "Ulusal ve dünya edebiyatı bağlamları: bağlam ve işlev ilişkisi",
      "Karşılaştırmalı çözümleme ve yorum: güncel tartışmalar",
      "Karşılaştırmalı çözümleme ve yorum: etik ve kültürel boyutlar",
      "Karşılaştırmalı çözümleme ve yorum: bütüncül akademik değerlendirme"
    ],
    "assessments": [
      {
        "name": "Ara Sınav",
        "count": 1,
        "weight": 40
      },
      {
        "name": "Yarıyıl Sonu Sınavı",
        "count": 1,
        "weight": 60
      }
    ],
    "workloads": [
      {
        "name": "Ders Süresi",
        "count": 15,
        "hours": 3,
        "total": 45
      },
      {
        "name": "Sınıf Dışı Çalışma Süresi",
        "count": 15,
        "hours": 6,
        "total": 90
      },
      {
        "name": "Ara Sınav Hazırlığı",
        "count": 1,
        "hours": 20,
        "total": 20
      },
      {
        "name": "Yarıyıl Sonu Sınavı Hazırlığı",
        "count": 1,
        "hours": 25,
        "total": 25
      }
    ],
    "contributionMatrix": [
      {
        "outcome": "DÖÇ1",
        "values": [
          2,
          4,
          4,
          2,
          4,
          4,
          2,
          4,
          2,
          2,
          4
        ]
      },
      {
        "outcome": "DÖÇ2",
        "values": [
          3,
          4,
          4,
          3,
          4,
          4,
          3,
          4,
          3,
          3,
          4
        ]
      },
      {
        "outcome": "DÖÇ3",
        "values": [
          2,
          5,
          5,
          2,
          5,
          5,
          2,
          5,
          2,
          2,
          5
        ]
      },
      {
        "outcome": "DÖÇ4",
        "values": [
          3,
          4,
          4,
          3,
          4,
          4,
          3,
          4,
          3,
          3,
          4
        ]
      },
      {
        "outcome": "DÖÇ5",
        "values": [
          2,
          5,
          5,
          2,
          5,
          5,
          2,
          5,
          2,
          2,
          5
        ]
      }
    ],
    "qualityChecks": [
      {
        "item": "Ders adı ve kodları doğrulandı mı?",
        "status": "Uygun"
      },
      {
        "item": "Tüm OBS bağlantıları gerçek mi?",
        "status": "Doğrulanmalı",
        "note": "Kesin OBS ders paketi bağlantısı bulunmadığından resmî müfredat kimliği korunmuş; eksik akademik alanlar handoff ölçütleri ve LEE_DBP'deki güncel 11 PÇ temelinde öneri niteliğinde tamamlanmıştır."
      },
      {
        "item": "Dersin program düzeyi doğru mu?",
        "status": "Uygun"
      },
      {
        "item": "Ders amacı açık ve uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "Ders amacı program düzeyine uygun mu?",
        "status": "Uygun"
      },
      {
        "item": "DÖÇ sayısı ve kapsamı uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ'ler ölçülebilir mi?",
        "status": "Revize Edildi"
      },
      {
        "item": "Bloom fiilleri uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "Bloom düzeyi program düzeyine uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "Amaç–DÖÇ uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–içerik uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "İçerik–haftalık plan uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–öğretim yöntemi uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–ölçme/değerlendirme uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "AKTS–iş yükü tutarlı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–PÇ matrisi gerçekçi mi?",
        "status": "Revize Edildi"
      },
      {
        "item": "1–5 katkı düzeyleri doğru kullanılmış mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "Yapay yüksek ilişkilendirme var mı?",
        "status": "Uygun"
      },
      {
        "item": "Tekrarlı kodlar doğru tekilleştirildi mi?",
        "status": "Revize Edildi"
      },
      {
        "item": "Kaynakta olmayan bilgi kesin bilgi gibi yazılmış mı?",
        "status": "Doğrulanmalı",
        "note": "Kesin OBS ders paketi bağlantısı bulunmadığından resmî müfredat kimliği korunmuş; eksik akademik alanlar handoff ölçütleri ve LEE_DBP'deki güncel 11 PÇ temelinde öneri niteliğinde tamamlanmıştır."
      },
      {
        "item": "Eksik/doğrulanması gereken alan kaldı mı?",
        "status": "Doğrulanmalı",
        "note": "Kesin OBS ders paketi bağlantısı bulunmadığından resmî müfredat kimliği korunmuş; eksik akademik alanlar handoff ölçütleri ve LEE_DBP'deki güncel 11 PÇ temelinde öneri niteliğinde tamamlanmıştır."
      }
    ],
    "publicQualityChecklist": false
  },
  {
    "code": "TDE722",
    "name": "Genel dilbilim ıı",
    "department": "Türk Dili ve Edebiyatı ABD",
    "programName": "Türk Dili ve Edebiyatı",
    "language": "Türkçe",
    "level": "Tezsiz Yüksek Lisans",
    "teachingMode": "Yüz Yüze",
    "instructor": "Doç. Dr. TANER TURAN",
    "theory": 3,
    "practice": 0,
    "credit": 3,
    "ects": 6,
    "prerequisites": "Yok",
    "purpose": "Öğrencinin dilbilimin temel kavram ve kuramları, dilin ses, biçim ve söz dizimi düzeyleri ve dil verilerinde çözümleme yöntemleri alanlarında ileri düzey çözümleme, karşılaştırma ve yorumlama becerisi geliştirmesini sağlamak.",
    "content": "Ders; dilbilimin temel kavram ve kuramları, dilin ses, biçim ve söz dizimi düzeyleri, anlam, kullanım ve söylem ilişkileri, dil verilerinde çözümleme yöntemleri, dilbilimsel bulguların yorumlanması konularını Türk dili ve edebiyatı araştırmalarının tarihsel, kültürel ve kuramsal bağlamlarıyla ilişkilendirerek ele alır.",
    "methods": "Kuramsal anlatım, yönlendirilmiş tartışma, kaynak ve metin incelemesi, karşılaştırmalı çözümleme, bireysel çalışma ve yapılandırılmış geri bildirim.",
    "resources": "Türk Dil Kurumu yayınları ve sözlükleri; Türkiye Yazma Eserler Kurumu Başkanlığı koleksiyonları; alanın temel başvuru eserleri; TÜBİTAK ULAKBİM TR Dizin ve güncel hakemli Türk dili ve edebiyatı araştırmaları.",
    "sdgs": [
      "4",
      "10",
      "11"
    ],
    "outcomes": [
      "Dilbilimin temel kavram ve kuramları ile ilgili ileri kavramları analiz eder.",
      "Dilin ses, biçim ve söz dizimi düzeyleri kapsamında kaynak ve metinleri eleştirel değerlendirir.",
      "Anlam, kullanım ve söylem ilişkileri ile ilişkili dilsel veya edebî örnekleri karşılaştırır.",
      "Dil verilerinde çözümleme yöntemleri için uygun çözümleme yaklaşımını uygular.",
      "Dilbilimsel bulguların yorumlanması temelinde gerekçeli akademik yorum geliştirir."
    ],
    "weeklyTopics": [
      "Dilbilimin temel kavram ve kuramları: kapsam ve temel kavramlar",
      "Dilbilimin temel kavram ve kuramları: tarihsel ve kuramsal çerçeve",
      "Dilbilimin temel kavram ve kuramları: kaynak ve metin türleri",
      "Dilin ses, biçim ve söz dizimi düzeyleri: temel ilkeler",
      "Dilin ses, biçim ve söz dizimi düzeyleri: örneklerin çözümlenmesi",
      "Dilin ses, biçim ve söz dizimi düzeyleri: farklı yaklaşımların karşılaştırılması",
      "Anlam, kullanım ve söylem ilişkileri: kavramsal yapı",
      "Anlam, kullanım ve söylem ilişkileri: metin veya dil verilerine uygulama",
      "Anlam, kullanım ve söylem ilişkileri: bulguların yorumlanması",
      "Dil verilerinde çözümleme yöntemleri: yöntem ve teknikler",
      "Dil verilerinde çözümleme yöntemleri: seçilmiş örneklerin incelenmesi",
      "Dil verilerinde çözümleme yöntemleri: bağlam ve işlev ilişkisi",
      "Dilbilimsel bulguların yorumlanması: güncel tartışmalar",
      "Dilbilimsel bulguların yorumlanması: etik ve kültürel boyutlar",
      "Dilbilimsel bulguların yorumlanması: bütüncül akademik değerlendirme"
    ],
    "assessments": [
      {
        "name": "Ara Sınav",
        "count": 1,
        "weight": 40
      },
      {
        "name": "Yarıyıl Sonu Sınavı",
        "count": 1,
        "weight": 60
      }
    ],
    "workloads": [
      {
        "name": "Ders Süresi",
        "count": 15,
        "hours": 3,
        "total": 45
      },
      {
        "name": "Sınıf Dışı Çalışma Süresi",
        "count": 15,
        "hours": 6,
        "total": 90
      },
      {
        "name": "Ara Sınav Hazırlığı",
        "count": 1,
        "hours": 20,
        "total": 20
      },
      {
        "name": "Yarıyıl Sonu Sınavı Hazırlığı",
        "count": 1,
        "hours": 25,
        "total": 25
      }
    ],
    "contributionMatrix": [
      {
        "outcome": "DÖÇ1",
        "values": [
          4,
          2,
          2,
          4,
          2,
          4,
          2,
          4,
          2,
          4,
          2
        ]
      },
      {
        "outcome": "DÖÇ2",
        "values": [
          4,
          3,
          3,
          4,
          3,
          4,
          3,
          4,
          3,
          4,
          3
        ]
      },
      {
        "outcome": "DÖÇ3",
        "values": [
          5,
          2,
          2,
          5,
          2,
          5,
          2,
          5,
          2,
          5,
          2
        ]
      },
      {
        "outcome": "DÖÇ4",
        "values": [
          4,
          3,
          3,
          4,
          3,
          4,
          3,
          4,
          3,
          4,
          3
        ]
      },
      {
        "outcome": "DÖÇ5",
        "values": [
          5,
          2,
          2,
          5,
          2,
          5,
          2,
          5,
          2,
          5,
          2
        ]
      }
    ],
    "qualityChecks": [
      {
        "item": "Ders adı ve kodları doğrulandı mı?",
        "status": "Uygun"
      },
      {
        "item": "Tüm OBS bağlantıları gerçek mi?",
        "status": "Doğrulanmalı",
        "note": "Kesin OBS ders paketi bağlantısı bulunmadığından resmî müfredat kimliği korunmuş; eksik akademik alanlar handoff ölçütleri ve LEE_DBP'deki güncel 11 PÇ temelinde öneri niteliğinde tamamlanmıştır."
      },
      {
        "item": "Dersin program düzeyi doğru mu?",
        "status": "Uygun"
      },
      {
        "item": "Ders amacı açık ve uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "Ders amacı program düzeyine uygun mu?",
        "status": "Uygun"
      },
      {
        "item": "DÖÇ sayısı ve kapsamı uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ'ler ölçülebilir mi?",
        "status": "Revize Edildi"
      },
      {
        "item": "Bloom fiilleri uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "Bloom düzeyi program düzeyine uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "Amaç–DÖÇ uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–içerik uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "İçerik–haftalık plan uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–öğretim yöntemi uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–ölçme/değerlendirme uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "AKTS–iş yükü tutarlı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–PÇ matrisi gerçekçi mi?",
        "status": "Revize Edildi"
      },
      {
        "item": "1–5 katkı düzeyleri doğru kullanılmış mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "Yapay yüksek ilişkilendirme var mı?",
        "status": "Uygun"
      },
      {
        "item": "Tekrarlı kodlar doğru tekilleştirildi mi?",
        "status": "Revize Edildi"
      },
      {
        "item": "Kaynakta olmayan bilgi kesin bilgi gibi yazılmış mı?",
        "status": "Doğrulanmalı",
        "note": "Kesin OBS ders paketi bağlantısı bulunmadığından resmî müfredat kimliği korunmuş; eksik akademik alanlar handoff ölçütleri ve LEE_DBP'deki güncel 11 PÇ temelinde öneri niteliğinde tamamlanmıştır."
      },
      {
        "item": "Eksik/doğrulanması gereken alan kaldı mı?",
        "status": "Doğrulanmalı",
        "note": "Kesin OBS ders paketi bağlantısı bulunmadığından resmî müfredat kimliği korunmuş; eksik akademik alanlar handoff ölçütleri ve LEE_DBP'deki güncel 11 PÇ temelinde öneri niteliğinde tamamlanmıştır."
      }
    ],
    "publicQualityChecklist": false
  },
  {
    "code": "TDE724",
    "name": "Edebi terimler ve kuramları ıı",
    "department": "Türk Dili ve Edebiyatı ABD",
    "programName": "Türk Dili ve Edebiyatı",
    "language": "Türkçe",
    "level": "Tezsiz Yüksek Lisans",
    "teachingMode": "Yüz Yüze",
    "instructor": "Doç. Dr. TANER TURAN",
    "theory": 3,
    "practice": 0,
    "credit": 3,
    "ects": 6,
    "prerequisites": "Yok",
    "purpose": "Öğrencinin edebiyat biliminin temel kavramları, edebî tür, biçim ve anlatım teknikleri ve kuramsal kavramların metne uygulanması alanlarında ileri düzey çözümleme, karşılaştırma ve yorumlama becerisi geliştirmesini sağlamak.",
    "content": "Ders; edebiyat biliminin temel kavramları, edebî tür, biçim ve anlatım teknikleri, edebiyat kuramları ve eleştiri yaklaşımları, kuramsal kavramların metne uygulanması, edebî yorumların karşılaştırılması konularını Türk dili ve edebiyatı araştırmalarının tarihsel, kültürel ve kuramsal bağlamlarıyla ilişkilendirerek ele alır.",
    "methods": "Kuramsal anlatım, yönlendirilmiş tartışma, kaynak ve metin incelemesi, karşılaştırmalı çözümleme, bireysel çalışma ve yapılandırılmış geri bildirim.",
    "resources": "Türk Dil Kurumu yayınları ve sözlükleri; Türkiye Yazma Eserler Kurumu Başkanlığı koleksiyonları; alanın temel başvuru eserleri; TÜBİTAK ULAKBİM TR Dizin ve güncel hakemli Türk dili ve edebiyatı araştırmaları.",
    "sdgs": [
      "4",
      "10",
      "11"
    ],
    "outcomes": [
      "Edebiyat biliminin temel kavramları ile ilgili ileri kavramları analiz eder.",
      "Edebî tür, biçim ve anlatım teknikleri kapsamında kaynak ve metinleri eleştirel değerlendirir.",
      "Edebiyat kuramları ve eleştiri yaklaşımları ile ilişkili dilsel veya edebî örnekleri karşılaştırır.",
      "Kuramsal kavramların metne uygulanması için uygun çözümleme yaklaşımını uygular.",
      "Edebî yorumların karşılaştırılması temelinde gerekçeli akademik yorum geliştirir."
    ],
    "weeklyTopics": [
      "Edebiyat biliminin temel kavramları: kapsam ve temel kavramlar",
      "Edebiyat biliminin temel kavramları: tarihsel ve kuramsal çerçeve",
      "Edebiyat biliminin temel kavramları: kaynak ve metin türleri",
      "Edebî tür, biçim ve anlatım teknikleri: temel ilkeler",
      "Edebî tür, biçim ve anlatım teknikleri: örneklerin çözümlenmesi",
      "Edebî tür, biçim ve anlatım teknikleri: farklı yaklaşımların karşılaştırılması",
      "Edebiyat kuramları ve eleştiri yaklaşımları: kavramsal yapı",
      "Edebiyat kuramları ve eleştiri yaklaşımları: metin veya dil verilerine uygulama",
      "Edebiyat kuramları ve eleştiri yaklaşımları: bulguların yorumlanması",
      "Kuramsal kavramların metne uygulanması: yöntem ve teknikler",
      "Kuramsal kavramların metne uygulanması: seçilmiş örneklerin incelenmesi",
      "Kuramsal kavramların metne uygulanması: bağlam ve işlev ilişkisi",
      "Edebî yorumların karşılaştırılması: güncel tartışmalar",
      "Edebî yorumların karşılaştırılması: etik ve kültürel boyutlar",
      "Edebî yorumların karşılaştırılması: bütüncül akademik değerlendirme"
    ],
    "assessments": [
      {
        "name": "Ara Sınav",
        "count": 1,
        "weight": 40
      },
      {
        "name": "Yarıyıl Sonu Sınavı",
        "count": 1,
        "weight": 60
      }
    ],
    "workloads": [
      {
        "name": "Ders Süresi",
        "count": 15,
        "hours": 3,
        "total": 45
      },
      {
        "name": "Sınıf Dışı Çalışma Süresi",
        "count": 15,
        "hours": 6,
        "total": 90
      },
      {
        "name": "Ara Sınav Hazırlığı",
        "count": 1,
        "hours": 20,
        "total": 20
      },
      {
        "name": "Yarıyıl Sonu Sınavı Hazırlığı",
        "count": 1,
        "hours": 25,
        "total": 25
      }
    ],
    "contributionMatrix": [
      {
        "outcome": "DÖÇ1",
        "values": [
          4,
          4,
          4,
          4,
          4,
          4,
          2,
          4,
          2,
          4,
          2
        ]
      },
      {
        "outcome": "DÖÇ2",
        "values": [
          4,
          4,
          4,
          4,
          4,
          4,
          3,
          4,
          3,
          4,
          3
        ]
      },
      {
        "outcome": "DÖÇ3",
        "values": [
          5,
          5,
          5,
          5,
          5,
          5,
          2,
          5,
          2,
          5,
          2
        ]
      },
      {
        "outcome": "DÖÇ4",
        "values": [
          4,
          4,
          4,
          4,
          4,
          4,
          3,
          4,
          3,
          4,
          3
        ]
      },
      {
        "outcome": "DÖÇ5",
        "values": [
          5,
          5,
          5,
          5,
          5,
          5,
          2,
          5,
          2,
          5,
          2
        ]
      }
    ],
    "qualityChecks": [
      {
        "item": "Ders adı ve kodları doğrulandı mı?",
        "status": "Uygun"
      },
      {
        "item": "Tüm OBS bağlantıları gerçek mi?",
        "status": "Doğrulanmalı",
        "note": "Kesin OBS ders paketi bağlantısı bulunmadığından resmî müfredat kimliği korunmuş; eksik akademik alanlar handoff ölçütleri ve LEE_DBP'deki güncel 11 PÇ temelinde öneri niteliğinde tamamlanmıştır."
      },
      {
        "item": "Dersin program düzeyi doğru mu?",
        "status": "Uygun"
      },
      {
        "item": "Ders amacı açık ve uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "Ders amacı program düzeyine uygun mu?",
        "status": "Uygun"
      },
      {
        "item": "DÖÇ sayısı ve kapsamı uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ'ler ölçülebilir mi?",
        "status": "Revize Edildi"
      },
      {
        "item": "Bloom fiilleri uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "Bloom düzeyi program düzeyine uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "Amaç–DÖÇ uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–içerik uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "İçerik–haftalık plan uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–öğretim yöntemi uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–ölçme/değerlendirme uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "AKTS–iş yükü tutarlı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–PÇ matrisi gerçekçi mi?",
        "status": "Revize Edildi"
      },
      {
        "item": "1–5 katkı düzeyleri doğru kullanılmış mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "Yapay yüksek ilişkilendirme var mı?",
        "status": "Uygun"
      },
      {
        "item": "Tekrarlı kodlar doğru tekilleştirildi mi?",
        "status": "Revize Edildi"
      },
      {
        "item": "Kaynakta olmayan bilgi kesin bilgi gibi yazılmış mı?",
        "status": "Doğrulanmalı",
        "note": "Kesin OBS ders paketi bağlantısı bulunmadığından resmî müfredat kimliği korunmuş; eksik akademik alanlar handoff ölçütleri ve LEE_DBP'deki güncel 11 PÇ temelinde öneri niteliğinde tamamlanmıştır."
      },
      {
        "item": "Eksik/doğrulanması gereken alan kaldı mı?",
        "status": "Doğrulanmalı",
        "note": "Kesin OBS ders paketi bağlantısı bulunmadığından resmî müfredat kimliği korunmuş; eksik akademik alanlar handoff ölçütleri ve LEE_DBP'deki güncel 11 PÇ temelinde öneri niteliğinde tamamlanmıştır."
      }
    ],
    "publicQualityChecklist": false
  },
  {
    "code": "TDE726",
    "name": "Şiir tahlilleri",
    "department": "Türk Dili ve Edebiyatı ABD",
    "programName": "Türk Dili ve Edebiyatı",
    "language": "Türkçe",
    "level": "Tezsiz Yüksek Lisans",
    "teachingMode": "Yüz Yüze",
    "instructor": "Prof. Dr. SEMA ÖZHER",
    "theory": 3,
    "practice": 0,
    "credit": 3,
    "ects": 6,
    "prerequisites": "Yok",
    "purpose": "Öğrencinin şiir çözümlemesinin kavramsal araçları, ses, ritim, imge ve söz sanatları ve farklı dönemlerden şiir örneklerinin tahlili alanlarında ileri düzey çözümleme, karşılaştırma ve yorumlama becerisi geliştirmesini sağlamak.",
    "content": "Ders; şiir çözümlemesinin kavramsal araçları, ses, ritim, imge ve söz sanatları, şiirde yapı, tema ve söyleyiş, farklı dönemlerden şiir örneklerinin tahlili, şiir yorumlarının gerekçelendirilmesi konularını Türk dili ve edebiyatı araştırmalarının tarihsel, kültürel ve kuramsal bağlamlarıyla ilişkilendirerek ele alır.",
    "methods": "Kuramsal anlatım, yönlendirilmiş tartışma, kaynak ve metin incelemesi, karşılaştırmalı çözümleme, bireysel çalışma ve yapılandırılmış geri bildirim.",
    "resources": "Türk Dil Kurumu yayınları ve sözlükleri; Türkiye Yazma Eserler Kurumu Başkanlığı koleksiyonları; alanın temel başvuru eserleri; TÜBİTAK ULAKBİM TR Dizin ve güncel hakemli Türk dili ve edebiyatı araştırmaları.",
    "sdgs": [
      "4",
      "10",
      "11"
    ],
    "outcomes": [
      "Şiir çözümlemesinin kavramsal araçları ile ilgili ileri kavramları analiz eder.",
      "Ses, ritim, imge ve söz sanatları kapsamında kaynak ve metinleri eleştirel değerlendirir.",
      "Şiirde yapı, tema ve söyleyiş ile ilişkili dilsel veya edebî örnekleri karşılaştırır.",
      "Farklı dönemlerden şiir örneklerinin tahlili için uygun çözümleme yaklaşımını uygular.",
      "Şiir yorumlarının gerekçelendirilmesi temelinde gerekçeli akademik yorum geliştirir."
    ],
    "weeklyTopics": [
      "Şiir çözümlemesinin kavramsal araçları: kapsam ve temel kavramlar",
      "Şiir çözümlemesinin kavramsal araçları: tarihsel ve kuramsal çerçeve",
      "Şiir çözümlemesinin kavramsal araçları: kaynak ve metin türleri",
      "Ses, ritim, imge ve söz sanatları: temel ilkeler",
      "Ses, ritim, imge ve söz sanatları: örneklerin çözümlenmesi",
      "Ses, ritim, imge ve söz sanatları: farklı yaklaşımların karşılaştırılması",
      "Şiirde yapı, tema ve söyleyiş: kavramsal yapı",
      "Şiirde yapı, tema ve söyleyiş: metin veya dil verilerine uygulama",
      "Şiirde yapı, tema ve söyleyiş: bulguların yorumlanması",
      "Farklı dönemlerden şiir örneklerinin tahlili: yöntem ve teknikler",
      "Farklı dönemlerden şiir örneklerinin tahlili: seçilmiş örneklerin incelenmesi",
      "Farklı dönemlerden şiir örneklerinin tahlili: bağlam ve işlev ilişkisi",
      "Şiir yorumlarının gerekçelendirilmesi: güncel tartışmalar",
      "Şiir yorumlarının gerekçelendirilmesi: etik ve kültürel boyutlar",
      "Şiir yorumlarının gerekçelendirilmesi: bütüncül akademik değerlendirme"
    ],
    "assessments": [
      {
        "name": "Ara Sınav",
        "count": 1,
        "weight": 40
      },
      {
        "name": "Yarıyıl Sonu Sınavı",
        "count": 1,
        "weight": 60
      }
    ],
    "workloads": [
      {
        "name": "Ders Süresi",
        "count": 15,
        "hours": 3,
        "total": 45
      },
      {
        "name": "Sınıf Dışı Çalışma Süresi",
        "count": 15,
        "hours": 6,
        "total": 90
      },
      {
        "name": "Ara Sınav Hazırlığı",
        "count": 1,
        "hours": 20,
        "total": 20
      },
      {
        "name": "Yarıyıl Sonu Sınavı Hazırlığı",
        "count": 1,
        "hours": 25,
        "total": 25
      }
    ],
    "contributionMatrix": [
      {
        "outcome": "DÖÇ1",
        "values": [
          4,
          4,
          4,
          4,
          4,
          4,
          2,
          4,
          2,
          4,
          2
        ]
      },
      {
        "outcome": "DÖÇ2",
        "values": [
          4,
          4,
          4,
          4,
          4,
          4,
          3,
          4,
          3,
          4,
          3
        ]
      },
      {
        "outcome": "DÖÇ3",
        "values": [
          5,
          5,
          5,
          5,
          5,
          5,
          2,
          5,
          2,
          5,
          2
        ]
      },
      {
        "outcome": "DÖÇ4",
        "values": [
          4,
          4,
          4,
          4,
          4,
          4,
          3,
          4,
          3,
          4,
          3
        ]
      },
      {
        "outcome": "DÖÇ5",
        "values": [
          5,
          5,
          5,
          5,
          5,
          5,
          2,
          5,
          2,
          5,
          2
        ]
      }
    ],
    "qualityChecks": [
      {
        "item": "Ders adı ve kodları doğrulandı mı?",
        "status": "Uygun"
      },
      {
        "item": "Tüm OBS bağlantıları gerçek mi?",
        "status": "Doğrulanmalı",
        "note": "Kesin OBS ders paketi bağlantısı bulunmadığından resmî müfredat kimliği korunmuş; eksik akademik alanlar handoff ölçütleri ve LEE_DBP'deki güncel 11 PÇ temelinde öneri niteliğinde tamamlanmıştır."
      },
      {
        "item": "Dersin program düzeyi doğru mu?",
        "status": "Uygun"
      },
      {
        "item": "Ders amacı açık ve uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "Ders amacı program düzeyine uygun mu?",
        "status": "Uygun"
      },
      {
        "item": "DÖÇ sayısı ve kapsamı uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ'ler ölçülebilir mi?",
        "status": "Revize Edildi"
      },
      {
        "item": "Bloom fiilleri uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "Bloom düzeyi program düzeyine uygun mu?",
        "status": "Revize Edildi"
      },
      {
        "item": "Amaç–DÖÇ uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–içerik uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "İçerik–haftalık plan uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–öğretim yöntemi uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–ölçme/değerlendirme uyumu sağlandı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "AKTS–iş yükü tutarlı mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "DÖÇ–PÇ matrisi gerçekçi mi?",
        "status": "Revize Edildi"
      },
      {
        "item": "1–5 katkı düzeyleri doğru kullanılmış mı?",
        "status": "Revize Edildi"
      },
      {
        "item": "Yapay yüksek ilişkilendirme var mı?",
        "status": "Uygun"
      },
      {
        "item": "Tekrarlı kodlar doğru tekilleştirildi mi?",
        "status": "Revize Edildi"
      },
      {
        "item": "Kaynakta olmayan bilgi kesin bilgi gibi yazılmış mı?",
        "status": "Doğrulanmalı",
        "note": "Kesin OBS ders paketi bağlantısı bulunmadığından resmî müfredat kimliği korunmuş; eksik akademik alanlar handoff ölçütleri ve LEE_DBP'deki güncel 11 PÇ temelinde öneri niteliğinde tamamlanmıştır."
      },
      {
        "item": "Eksik/doğrulanması gereken alan kaldı mı?",
        "status": "Doğrulanmalı",
        "note": "Kesin OBS ders paketi bağlantısı bulunmadığından resmî müfredat kimliği korunmuş; eksik akademik alanlar handoff ölçütleri ve LEE_DBP'deki güncel 11 PÇ temelinde öneri niteliğinde tamamlanmıştır."
      }
    ],
    "publicQualityChecklist": false
  }
];

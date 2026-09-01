// YBS tezsiz resmî müfredatı, gerçek OBS paketleri ve mevcut 11 LEE_DBP PÇ'si temel alınmıştır; program profili değiştirilmemiştir.
import type { CoursePackage } from "./coursePackages";

export const ybsTezsizCommonCoursePackages: CoursePackage[] = [
  {
    "code": "YBS7XX",
    "aliases": [
      "YBS701",
      "YBS702"
    ],
    "name": "Bitirme Projesi",
    "department": "Yönetim Bilişim Sistemleri ABD",
    "programName": "Yönetim Bilişim Sistemleri",
    "language": "Türkçe",
    "level": "Tezsiz Yüksek Lisans",
    "teachingMode": "Bireysel Proje Çalışması",
    "instructor": "Öğrencinin Danışmanı",
    "theory": 0,
    "practice": 0,
    "credit": 0,
    "ects": 30,
    "prerequisites": "Yok",
    "purpose": "Öğrencinin yönetim ve bilişim alanındaki ileri bilgi ve çözümleme becerilerini örgütsel bir problem üzerinde bütünleştirerek bilimsel ve etik ölçütlere uygun bir bitirme projesi yürütmesini sağlamak.",
    "content": "YBS probleminin belirlenmesi, kaynak ve veri incelemesi, yöntem ile çalışma planının geliştirilmesi, yönetsel ve bilişimsel bulguların çözümlenmesi, sonuçların örgütsel bağlamda yorumlanması ve projenin akademik biçimde raporlanması.",
    "methods": "Bireysel proje çalışması, danışman görüşmesi, literatür ve veri incelemesi, süreç veya sistem çözümlemesi, akademik yazım ve yapılandırılmış geri bildirim.",
    "resources": "Kaynaklar: J R Meredith and S J Mantel Jr (1995). Project Planning - a Managerial Approach. John Wiley and Sons. 9780470400265; Ders Notları: J R Meredith and S J Mantel Jr (1995). Project Planning - a Managerial Approach. John Wiley and Sons. 9780470400265; Dökümanlar: J R Meredith and S J Mantel Jr (1995). Project Planning - a Managerial Approach. John Wiley and Sons. 9780470400265",
    "sdgs": [
      "4",
      "8",
      "9"
    ],
    "outcomes": [
      "Örgütsel bir bilişim problemini uygulanabilir proje sorusuna dönüştürür.",
      "Proje problemine ilişkin akademik ve mesleki kaynakları eleştirel değerlendirir.",
      "Projenin amacına uygun veri, yöntem ve çalışma planı geliştirir.",
      "Yönetsel ve bilişimsel bulguları örgütsel bağlamda yorumlar.",
      "Bitirme projesini bilimsel yazım ve etik ilkelerine uygun raporlar."
    ],
    "weeklyTopics": [
      "Proje alanının ve kapsamının belirlenmesi",
      "Örgütsel bilişim probleminin sınırlandırılması",
      "Amaç ve proje sorularının geliştirilmesi",
      "Literatür tarama stratejisinin oluşturulması",
      "Kuramsal ve mesleki kaynakların değerlendirilmesi",
      "Paydaş, süreç ve bilgi gereksinimlerinin belirlenmesi",
      "Yöntem ile çalışma planının geliştirilmesi",
      "Veri kaynaklarının ve çözümleme birimlerinin yapılandırılması",
      "Etik, gizlilik ve veri güvenliği gereksinimlerinin değerlendirilmesi",
      "Yönetsel ve bilişimsel verilerin düzenlenmesi",
      "Bulguların çözümlenmesi ve yorumlanması",
      "Bulguların alan yazını ve örgütsel gereksinimlerle karşılaştırılması",
      "Çözüm önerileri ve mesleki çıkarımların geliştirilmesi",
      "Akademik metin, atıf ve kaynakça düzeninin denetlenmesi",
      "Bitirme projesinin teslimi ve değerlendirilmesi"
    ],
    "assessments": [
      {
        "name": "Başarılı / Başarısız",
        "count": 1,
        "weight": 100
      }
    ],
    "workloads": [
      {
        "name": "Proje Planlama ve Danışman Görüşmeleri",
        "count": 15,
        "hours": 2,
        "total": 30
      },
      {
        "name": "Literatür ve Veri İncelemesi",
        "count": 15,
        "hours": 20,
        "total": 300
      },
      {
        "name": "Çözümleme ve Raporlama",
        "count": 15,
        "hours": 36,
        "total": 540
      },
      {
        "name": "Nihai Düzenleme ve Teslim",
        "count": 1,
        "hours": 30,
        "total": 30
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
          2,
          1,
          2,
          4,
          2,
          2,
          2
        ]
      },
      {
        "outcome": "DÖÇ2",
        "values": [
          5,
          5,
          5,
          5,
          3,
          2,
          3,
          5,
          3,
          3,
          3
        ]
      },
      {
        "outcome": "DÖÇ3",
        "values": [
          4,
          4,
          4,
          4,
          3,
          1,
          3,
          4,
          3,
          3,
          3
        ]
      },
      {
        "outcome": "DÖÇ4",
        "values": [
          4,
          4,
          4,
          4,
          2,
          2,
          2,
          4,
          2,
          2,
          2
        ]
      },
      {
        "outcome": "DÖÇ5",
        "values": [
          5,
          5,
          5,
          5,
          3,
          1,
          3,
          5,
          3,
          3,
          3
        ]
      }
    ],
    "sourceUrl": "https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=241919&lang=tr",
    "qualityChecks": [
      {
        "item": "Ders adı ve kodları doğrulandı mı?",
        "status": "Uygun"
      },
      {
        "item": "Tüm OBS linkleri gerçek mi?",
        "status": "Uygun"
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
        "status": "Uygun"
      },
      {
        "item": "Eksik/doğrulanması gereken alan kaldı mı?",
        "status": "Uygun"
      }
    ],
    "publicQualityChecklist": false
  }
];

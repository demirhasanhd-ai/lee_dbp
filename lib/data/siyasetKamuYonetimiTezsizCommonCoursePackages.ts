// Hedef programın gerçek OBS dersleri ve mevcut LEE_DBP PÇ yapısı temel alınmıştır; program profili değiştirilmemiştir.
import type { CoursePackage } from "./coursePackages";

export const siyasetKamuYonetimiTezsizCommonCoursePackages: CoursePackage[] = [
  {
    "code": "SKY7XX",
    "aliases": [
      "SKY701",
      "SKY702"
    ],
    "name": "Bitirme Projesi",
    "department": "Siyaset Bilimi ve Kamu Yönetimi ABD",
    "programName": "Siyaset Bilimi ve Kamu Yönetimi",
    "language": "Türkçe",
    "level": "Tezsiz Yüksek Lisans",
    "teachingMode": "Bireysel Proje Çalışması",
    "instructor": "Öğrencinin Danışmanı",
    "theory": 0,
    "practice": 0,
    "credit": 0,
    "ects": 30,
    "prerequisites": "Yok",
    "purpose": "Öğrencinin siyaset bilimi ve kamu yönetimi alanındaki bilgi ve becerilerini mesleki bir problem üzerinde bütünleştirerek bilimsel, etik ve kamu yararı odaklı bir bitirme projesi yürütmesini sağlamak.",
    "content": "Proje probleminin belirlenmesi, literatür ve veri incelemesi, yöntem ve çalışma planının geliştirilmesi, bulguların siyasal-yönetsel bağlamda yorumlanması ve sonuçların akademik biçimde raporlanması.",
    "methods": "Bireysel proje çalışması, danışman görüşmesi, bilimsel kaynak incelemesi, veri veya doküman çözümlemesi, akademik yazım ve yapılandırılmış geri bildirim.",
    "resources": "Enstitü bitirme projesi ilkeleri; proje konusuna ilişkin mevzuat, resmi raporlar, açık veri kaynakları ve güncel hakemli çalışmalar.",
    "sdgs": [
      "4",
      "16",
      "17"
    ],
    "outcomes": [
      "Siyaset bilimi ve kamu yönetimi alanında uygulanabilir bir proje problemi yapılandırır.",
      "Proje problemine ilişkin bilimsel ve kurumsal kaynakları eleştirel değerlendirir.",
      "Proje amacına uygun veri, yöntem ve çalışma planı geliştirir.",
      "Proje bulgularını siyasal, yönetsel ve toplumsal etkileriyle yorumlar.",
      "Bitirme projesini bilimsel yazım ve etik ilkelerine uygun biçimde raporlar."
    ],
    "weeklyTopics": [
      "Proje alanının ve kapsamının belirlenmesi",
      "Siyasal veya yönetsel problemin sınırlandırılması",
      "Proje amacı ve sorularının geliştirilmesi",
      "Literatür tarama stratejisinin oluşturulması",
      "Bilimsel ve kurumsal kaynakların değerlendirilmesi",
      "Yöntem ve veri kaynaklarının seçilmesi",
      "Çalışma planı ve zaman çizelgesinin geliştirilmesi",
      "Veri veya doküman toplama sürecinin yürütülmesi",
      "Toplanan materyalin düzenlenmesi",
      "Veri veya dokümanların çözümlenmesi",
      "Bulguların siyasal ve yönetsel bağlamda yorumlanması",
      "Etik, kamu yararı ve uygulanabilirlik etkilerinin değerlendirilmesi",
      "Proje raporunun yapılandırılması",
      "Bilimsel yazım ve kaynak gösterme denetimi",
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
        "name": "Kaynak ve Veri İnceleme",
        "count": 15,
        "hours": 20,
        "total": 300
      },
      {
        "name": "Çözümleme ve Proje Raporlama",
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
          2,
          4,
          2,
          2,
          1,
          2,
          4,
          2
        ]
      },
      {
        "outcome": "DÖÇ2",
        "values": [
          5,
          5,
          5,
          3,
          5,
          3,
          3,
          2,
          3,
          5,
          3
        ]
      },
      {
        "outcome": "DÖÇ3",
        "values": [
          4,
          4,
          4,
          3,
          4,
          3,
          3,
          1,
          3,
          4,
          3
        ]
      },
      {
        "outcome": "DÖÇ4",
        "values": [
          5,
          5,
          5,
          2,
          5,
          2,
          2,
          2,
          2,
          5,
          2
        ]
      },
      {
        "outcome": "DÖÇ5",
        "values": [
          4,
          4,
          4,
          3,
          4,
          3,
          3,
          1,
          3,
          4,
          3
        ]
      }
    ],
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
        "status": "Uygun"
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

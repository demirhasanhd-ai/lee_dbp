// Tarih tezsiz resmî müfredatı, gerçek OBS paketleri ve mevcut 11 LEE_DBP PÇ'si temel alınmıştır; program profili değiştirilmemiştir.
import type { CoursePackage } from "./coursePackages";

export const tarihTezsizCommonCoursePackages: CoursePackage[] = [
  {
    "code": "TTS7XX",
    "aliases": [
      "TTS701",
      "TTS702"
    ],
    "name": "Bitirme Projesi",
    "department": "Tarih ABD",
    "programName": "Tarih",
    "language": "Türkçe",
    "level": "Tezsiz Yüksek Lisans",
    "teachingMode": "Bireysel Proje Çalışması",
    "instructor": "Öğrencinin Danışmanı",
    "theory": 0,
    "practice": 0,
    "credit": 0,
    "ects": 30,
    "prerequisites": "Yok",
    "purpose": "Öğrencinin tarih alanındaki ileri bilgi ve kaynak kullanma becerilerini mesleki bir problem üzerinde bütünleştirerek bilimsel ve etik ölçütlere uygun bir bitirme projesi yürütmesini sağlamak.",
    "content": "Tarihsel problemin sınırlandırılması, literatür ve birincil kaynakların değerlendirilmesi, yöntem ve çalışma planının geliştirilmesi, tarihsel kanıtların çözümlenmesi, sonuçların bağlam içinde yorumlanması ve projenin akademik biçimde raporlanması.",
    "methods": "Bireysel proje çalışması, danışman görüşmesi, literatür ve arşiv araştırması, kaynak eleştirisi, tarihsel çözümleme, akademik yazım ve yapılandırılmış geri bildirim.",
    "resources": "Enstitü bitirme projesi ilkeleri; Cumhurbaşkanlığı Devlet Arşivleri Başkanlığı katalogları; konuya ilişkin birincil kaynaklar ve güncel hakemli tarih araştırmaları.",
    "sdgs": [
      "4",
      "11",
      "16"
    ],
    "outcomes": [
      "Tarih alanında uygulanabilir bir mesleki proje problemi yapılandırır.",
      "Proje problemine ilişkin birincil ve ikincil kaynakları eleştirel değerlendirir.",
      "Projenin amacına uygun yöntem ve çalışma planı geliştirir.",
      "Tarihsel kanıtları bağlam, değişim ve süreklilik açısından yorumlar.",
      "Bitirme projesini bilimsel yazım ve etik ilkelerine uygun raporlar."
    ],
    "weeklyTopics": [
      "Proje alanının ve kapsamının belirlenmesi",
      "Tarihsel problemin sınırlandırılması",
      "Amaç ve araştırma sorularının geliştirilmesi",
      "Literatür tarama stratejisinin oluşturulması",
      "Birincil kaynakların belirlenmesi",
      "Kaynakların dış ve iç tenkidinin planlanması",
      "Yöntem ve çalışma planının geliştirilmesi",
      "Kaynak ve veri toplama sürecinin yürütülmesi",
      "Tarihsel kanıtların sınıflandırılması",
      "Kanıtların çözümlenmesi",
      "Bulguların tarihsel bağlamda yorumlanması",
      "Değişim, süreklilik ve karşılaştırma boyutlarının değerlendirilmesi",
      "Proje raporunun yapılandırılması",
      "Bilimsel yazım, atıf ve etik uygunluk denetimi",
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
        "name": "Literatür ve Kaynak İncelemesi",
        "count": 15,
        "hours": 20,
        "total": 300
      },
      {
        "name": "Tarihsel Çözümleme ve Raporlama",
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
          2,
          2,
          4,
          4,
          1,
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
          3,
          3,
          5,
          5,
          2,
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
          3,
          3,
          4,
          4,
          1,
          1,
          3,
          4,
          3
        ]
      },
      {
        "outcome": "DÖÇ4",
        "values": [
          4,
          4,
          2,
          2,
          4,
          4,
          2,
          2,
          2,
          4,
          2
        ]
      },
      {
        "outcome": "DÖÇ5",
        "values": [
          5,
          5,
          3,
          3,
          5,
          5,
          1,
          1,
          3,
          5,
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

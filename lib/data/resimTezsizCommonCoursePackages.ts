// Mevcut LEE_DBP müfredatı ve bologna-lisansustu-2026-08-17-ders-verileri.json yardımcı ders içeriği temel alınmıştır; program profili ve PÇ kayıtları değiştirilmemiştir.
import type { CoursePackage } from "./coursePackages";

export const resimTezsizCommonCoursePackages: CoursePackage[] = [
  {
    "department": "Resim ASD",
    "programName": "Resim",
    "level": "Tezsiz Yüksek Lisans",
    "code": "RES7XX",
    "aliases": [
      "RES701",
      "RES702"
    ],
    "name": "Bitirme Projesi",
    "credit": 0,
    "ects": 30,
    "theory": 0,
    "practice": 0,
    "language": "Türkçe",
    "teachingMode": "Bireysel Proje Çalışması",
    "prerequisites": "Yok",
    "instructor": "Öğrencinin Proje Danışmanı",
    "purpose": "Öğrencinin resim alanındaki bilgi, beceri ve sanatsal yaklaşımını özgün bir bitirme çalışmasında bütünleştirerek bilimsel, sanatsal ve etik ölçütlere uygun biçimde yürütmesini sağlamak.",
    "content": "Sanatsal problemin belirlenmesi, görsel ve kuramsal kaynakların incelenmesi, uygulama yönteminin geliştirilmesi, yapıt üretimi, sürecin belgelenmesi ve sonuçların akademik biçimde raporlanması.",
    "methods": "Bireysel sanat çalışması, danışman görüşmesi, görsel ve kuramsal kaynak incelemesi, atölye uygulaması, süreç günlüğü ve yapılandırılmış geri bildirim.",
    "resources": "Enstitü bitirme projesi ilkeleri; resim alanına özgü güncel sanat yayınları, müze ve galeri katalogları, görsel arşivler ve proje konusuna ilişkin hakemli çalışmalar.",
    "sdgs": [
      "4",
      "8",
      "11"
    ],
    "outcomes": [
      "Resim alanında özgün bir sanatsal problem yapılandırır.",
      "Proje problemine ilişkin görsel ve kuramsal kaynakları eleştirel değerlendirir.",
      "Amaca uygun malzeme, teknik ve çalışma planı geliştirir.",
      "Sanatsal üretim sürecini belgeler ve elde edilen yapıtları bağlamı içinde yorumlar.",
      "Bitirme projesini sanatsal, akademik ve etik ölçütlere uygun biçimde raporlar."
    ],
    "weeklyTopics": [
      "Proje alanının ve kapsamının belirlenmesi",
      "Sanatsal problemin sınırlandırılması",
      "Proje amacı ve üretim sorularının geliştirilmesi",
      "Görsel ve kuramsal kaynak taraması",
      "Kaynakların eleştirel değerlendirilmesi",
      "Malzeme ve teknik seçeneklerinin araştırılması",
      "Eskiz ve ön uygulamaların geliştirilmesi",
      "Çalışma planının uygulanması",
      "Sanatsal üretimin sürdürülmesi",
      "Üretim sürecinin belgelenmesi",
      "Yapıtların biçimsel ve kavramsal değerlendirilmesi",
      "Yapıt seçkisinin oluşturulması",
      "Proje raporunun yapılandırılması",
      "Sanatsal ve akademik uygunluk denetimi",
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
        "name": "Görsel ve Kuramsal Kaynak İnceleme",
        "count": 15,
        "hours": 12,
        "total": 180
      },
      {
        "name": "Atölye Uygulaması ve Yapıt Üretimi",
        "count": 15,
        "hours": 42,
        "total": 630
      },
      {
        "name": "Raporlama ve Teslim",
        "count": 1,
        "hours": 60,
        "total": 60
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
          2,
          4,
          2,
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
          5,
          3,
          3,
          5,
          3,
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
          4,
          3,
          3,
          4,
          3,
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
          5,
          2,
          2,
          5,
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
          4,
          3,
          3,
          4,
          3,
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
        "status": "Doğrulanmalı"
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
        "status": "Revize Edildi"
      },
      {
        "item": "Eksik/doğrulanması gereken alan kaldı mı?",
        "status": "Doğrulanmalı"
      }
    ],
    "publicQualityChecklist": false
  }
];

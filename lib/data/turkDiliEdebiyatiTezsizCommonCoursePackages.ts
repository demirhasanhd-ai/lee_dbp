// Türk Dili ve Edebiyatı tezsiz resmî müfredatı ve mevcut 11 LEE_DBP PÇ'si temel alınmıştır; program profili değiştirilmemiştir.
import type { CoursePackage } from "./coursePackages";

export const turkDiliEdebiyatiTezsizCommonCoursePackages: CoursePackage[] = [
  {
    "code": "TDE7XX",
    "aliases": [
      "TDE701",
      "TDE702"
    ],
    "name": "Bitirme Projesi",
    "department": "Türk Dili ve Edebiyatı ABD",
    "programName": "Türk Dili ve Edebiyatı",
    "language": "Türkçe",
    "level": "Tezsiz Yüksek Lisans",
    "teachingMode": "Bireysel Proje Çalışması",
    "instructor": "Öğrencinin Danışmanı",
    "theory": 0,
    "practice": 0,
    "credit": 0,
    "ects": 30,
    "prerequisites": "Yok",
    "purpose": "Öğrencinin Türk dili ve edebiyatı alanındaki ileri bilgi, kaynak kullanma ve çözümleme becerilerini mesleki bir problem üzerinde bütünleştirerek bilimsel ve etik ölçütlere uygun bir bitirme projesi yürütmesini sağlamak.",
    "content": "Proje probleminin belirlenmesi, alan yazını ve kaynakların değerlendirilmesi, yöntem ile çalışma planının geliştirilmesi, dilsel veya edebî verilerin çözümlenmesi, sonuçların tarihsel ve kültürel bağlamda yorumlanması ve projenin akademik biçimde raporlanması.",
    "methods": "Bireysel proje çalışması, danışman görüşmesi, kaynak ve metin incelemesi, dilsel veya edebî çözümleme, akademik yazım ve yapılandırılmış geri bildirim.",
    "resources": "Enstitü bitirme projesi ilkeleri; Türk Dil Kurumu ve Türkiye Yazma Eserler Kurumu Başkanlığı kaynakları; konuya ilişkin birincil metinler ve güncel hakemli araştırmalar.",
    "sdgs": [
      "4",
      "10",
      "11"
    ],
    "outcomes": [
      "Türk dili veya edebiyatı alanında uygulanabilir bir proje problemi yapılandırır.",
      "Proje problemine ilişkin birincil ve ikincil kaynakları eleştirel değerlendirir.",
      "Projenin amacına uygun yöntem ve çalışma planı geliştirir.",
      "Dilsel veya edebî bulguları tarihsel ve kültürel bağlamda yorumlar.",
      "Bitirme projesini bilimsel yazım ve etik ilkelerine uygun raporlar."
    ],
    "weeklyTopics": [
      "Proje alanının ve kapsamının belirlenmesi",
      "Dilsel veya edebî problemin sınırlandırılması",
      "Amaç ve araştırma sorularının geliştirilmesi",
      "Alan yazını tarama stratejisinin oluşturulması",
      "Birincil metin ve kaynakların belirlenmesi",
      "Kaynakların eleştirel değerlendirilmesi",
      "Kuramsal çerçeve ile yöntemin geliştirilmesi",
      "Çalışma planının ve çözümleme birimlerinin yapılandırılması",
      "Metin veya dil verilerinin toplanması",
      "Dilsel veya edebî verilerin çözümlenmesi",
      "Bulguların tarihsel ve kültürel bağlamda yorumlanması",
      "Bulguların alan yazınıyla karşılaştırılması",
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
        "name": "Kaynak ve Metin İncelemesi",
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
  }
];

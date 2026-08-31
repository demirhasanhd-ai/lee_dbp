// Hedef programın gerçek OBS dersleri ve mevcut LEE_DBP PÇ yapısı temel alınmıştır; program profili değiştirilmemiştir.
import type { CoursePackage } from "./coursePackages";

export const siyasetKamuYonetimiTezsizCoursePackages: CoursePackage[] = [
  {
    "department": "Siyaset Bilimi ve Kamu Yönetimi ABD",
    "programName": "Siyaset Bilimi ve Kamu Yönetimi",
    "level": "Tezsiz Yüksek Lisans",
    "code": "SKY703",
    "name": "Bilimsel araştırma yöntemleri ve yayın etiği",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Prof. Dr. SUSRAN ERKAN EROĞLU",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Öğrencinin sosyal bilim araştırma yöntemleri alanındaki ileri kuramsal bilgileri siyasal ve yönetsel sorunların çözümünde kullanmasını sağlamak.",
    "content": "Bilimsel araştırma yöntemleri ve yayın etiği; bilimsel bilgi ve araştırma etiği, araştırma problemi ve soru geliştirme, kuramsal çerçeve oluşturma, literatür tarama ve kaynak değerlendirme, nitel araştırma tasarımları, nicel araştırma tasarımları, örnekleme ve veri toplama, ölçme, geçerlik ve güvenirlik, nitel veri çözümleme, nicel veri çözümleme boyutlarıyla ele alınır.",
    "methods": "Kuramsal anlatım, bilimsel kaynak incelemesi, örnek olay çözümlemesi, karşılaştırmalı analiz ve yapılandırılmış akademik tartışma.",
    "resources": "Ders kapsamına uygun güncel kitaplar, hakemli siyaset bilimi ve kamu yönetimi literatürü, mevzuat, resmi raporlar ve açık veri kaynakları.",
    "sdgs": [
      "4",
      "16",
      "17"
    ],
    "outcomes": [
      "Bilimsel araştırma yöntemleri ve yayın etiği kapsamındaki ileri kavram ve yaklaşımları analiz eder.",
      "literatür tarama ve kaynak değerlendirme ile ilişkili kurum ve uygulamaları karşılaştırır.",
      "ölçme, geçerlik ve güvenirlik bağlamındaki veri ve kanıtları yorumlar.",
      "bulguların yorumlanması için uygun analiz yaklaşımını uygular.",
      "Bilimsel araştırma yöntemleri ve yayın etiği alanındaki sorunlara etik ve kamu yararı odaklı öneriler geliştirir."
    ],
    "weeklyTopics": [
      "bilimsel bilgi ve araştırma etiği",
      "araştırma problemi ve soru geliştirme",
      "kuramsal çerçeve oluşturma",
      "literatür tarama ve kaynak değerlendirme",
      "nitel araştırma tasarımları",
      "nicel araştırma tasarımları",
      "örnekleme ve veri toplama",
      "ölçme, geçerlik ve güvenirlik",
      "nitel veri çözümleme",
      "nicel veri çözümleme",
      "bulguların yorumlanması",
      "bilimsel yazım ve kaynak gösterme",
      "yayın etiği ve araştırma bütünlüğü",
      "araştırma raporunun yapılandırılması",
      "araştırma sonuçlarının bütüncül değerlendirilmesi"
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
          2,
          4,
          2,
          2,
          2,
          1,
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
          5,
          3,
          3,
          3,
          2,
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
          4,
          3,
          3,
          3,
          1,
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
          5,
          2,
          2,
          2,
          2,
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
          4,
          3,
          3,
          3,
          1,
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
        "status": "Doğrulanmalı"
      },
      {
        "item": "Eksik/doğrulanması gereken alan kaldı mı?",
        "status": "Doğrulanmalı"
      }
    ],
    "publicQualityChecklist": false
  },
  {
    "department": "Siyaset Bilimi ve Kamu Yönetimi ABD",
    "programName": "Siyaset Bilimi ve Kamu Yönetimi",
    "level": "Tezsiz Yüksek Lisans",
    "code": "SKY705",
    "name": "Kamu yönetimi",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Doç. Dr. DEMET DÖNMEZ",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Bu dersin amacı, kamu yönetimi alanının kuramsal temellerini, güncel yönetişim yaklaşımlarını ve kamu kurumlarının işleyişine yön veren etik, hukuki ve yönetsel normları ileri düzeyde analiz edebilen uzmanlar yetiştirmektir.",
    "content": "Kamu yönetimi kuramları, bürokrasi modelleri, kamu politikası analiz yöntemleri ve kamu kurumlarında karar alma süreçleri ayrıntılı olarak incelenir.",
    "methods": "Yüze yüze",
    "resources": "Kaynaklar: Kamu Yönetimi Hasan Hüseyin ÇEVİK; Ders Notları: Geçmişten Günümüze Kamu Yönetiminin Sözlü Tarihi. :Ed: Mete YILDIZ, Cenay BABAOĞLU., Türk İdari Araştırmaları Vakfı yayını, 2022.",
    "sdgs": [
      "4",
      "16",
      "17"
    ],
    "outcomes": [
      "Kamu yönetimi kapsamındaki ileri kavram ve yaklaşımları analiz eder.",
      "bürokrasi ve yönetsel davranış ile ilişkili kurum ve uygulamaları karşılaştırır.",
      "yönetişim aktörleri ve katılım bağlamındaki veri ve kanıtları yorumlar.",
      "karar süreçleri ve uygulama sorunları için uygun analiz yaklaşımını uygular.",
      "Kamu yönetimi alanındaki sorunlara etik ve kamu yararı odaklı öneriler geliştirir."
    ],
    "weeklyTopics": [
      "Kamu yönetiminin tanımı ve kamu yönetimi disiplininin tarihsel gelişimi",
      "Klasik ve modern yönetim teorileri",
      "Kamu yönetiminin örgütlenmesinde anayasal ilkeler",
      "Yeni Kamu Yönetimi Anlayışı ( New Public Management)",
      "Yönetişim kavramı ve modelleri",
      "Kamu politikası döngüsü ve politika analizi",
      "Kamu yönetiminde stratejik planlama ve performans yönetimi",
      "Kamu yönetimi reformları ve değişim süreçleri",
      "Dijitalleşme ve E-Devlet uygulamaları",
      "İnsan kaynakları yönetimi ve liderlik",
      "Mali yönetim ve bütçe süreçleri",
      "Kamu politikalarında paydaş yönetimi",
      "Küresel yönetişim ve uluslararası kamu yönetimi",
      "Kamu yönetiminde sürdürülebilirlik ve etik",
      "kamu yönetiminin kapsamı ve temel kavramları"
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
    "sourceUrl": "https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=243725&lang=tr",
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
  },
  {
    "department": "Siyaset Bilimi ve Kamu Yönetimi ABD",
    "programName": "Siyaset Bilimi ve Kamu Yönetimi",
    "level": "Tezsiz Yüksek Lisans",
    "code": "SKY707",
    "name": "Kamuda toplam kalite yönetimi",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Atama Bekliyor",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Öğrencinin kamu yönetimi ve yönetişim alanındaki ileri kuramsal bilgileri siyasal ve yönetsel sorunların çözümünde kullanmasını sağlamak.",
    "content": "Kamuda toplam kalite yönetimi; kamu yönetiminin kapsamı ve temel kavramları, klasik ve çağdaş yönetim yaklaşımları, kamu örgütlerinin yapısı, bürokrasi ve yönetsel davranış, kamu personel sistemi, stratejik yönetim ve planlama, performans, kalite ve hesap verebilirlik, yönetişim aktörleri ve katılım, idari reform ve kurumsal değişim, kamu hizmetlerinde dijital dönüşüm boyutlarıyla ele alınır.",
    "methods": "Kuramsal anlatım, bilimsel kaynak incelemesi, örnek olay çözümlemesi, karşılaştırmalı analiz ve yapılandırılmış akademik tartışma.",
    "resources": "Ders kapsamına uygun güncel kitaplar, hakemli siyaset bilimi ve kamu yönetimi literatürü, mevzuat, resmi raporlar ve açık veri kaynakları.",
    "sdgs": [
      "4",
      "16",
      "17"
    ],
    "outcomes": [
      "Kamuda toplam kalite yönetimi kapsamındaki ileri kavram ve yaklaşımları analiz eder.",
      "bürokrasi ve yönetsel davranış ile ilişkili kurum ve uygulamaları karşılaştırır.",
      "yönetişim aktörleri ve katılım bağlamındaki veri ve kanıtları yorumlar.",
      "karar süreçleri ve uygulama sorunları için uygun analiz yaklaşımını uygular.",
      "Kamuda toplam kalite yönetimi alanındaki sorunlara etik ve kamu yararı odaklı öneriler geliştirir."
    ],
    "weeklyTopics": [
      "kamu yönetiminin kapsamı ve temel kavramları",
      "klasik ve çağdaş yönetim yaklaşımları",
      "kamu örgütlerinin yapısı",
      "bürokrasi ve yönetsel davranış",
      "kamu personel sistemi",
      "stratejik yönetim ve planlama",
      "performans, kalite ve hesap verebilirlik",
      "yönetişim aktörleri ve katılım",
      "idari reform ve kurumsal değişim",
      "kamu hizmetlerinde dijital dönüşüm",
      "karar süreçleri ve uygulama sorunları",
      "karşılaştırmalı yönetim örnekleri",
      "etik ve kamu yararı",
      "güncel yönetsel sorunların analizi",
      "yönetim yaklaşımlarının bütüncül değerlendirilmesi"
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
        "status": "Doğrulanmalı"
      },
      {
        "item": "Eksik/doğrulanması gereken alan kaldı mı?",
        "status": "Doğrulanmalı"
      }
    ],
    "publicQualityChecklist": false
  },
  {
    "department": "Siyaset Bilimi ve Kamu Yönetimi ABD",
    "programName": "Siyaset Bilimi ve Kamu Yönetimi",
    "level": "Tezsiz Yüksek Lisans",
    "code": "SKY709",
    "name": "Siyaset bilimi",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Atama Bekliyor",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Öğrencinin siyaset kuramı ve siyasal sistemler alanındaki ileri kuramsal bilgileri siyasal ve yönetsel sorunların çözümünde kullanmasını sağlamak.",
    "content": "Siyaset bilimi; siyasetin kapsamı ve temel kavramları, iktidar, otorite ve meşruiyet, devlet kuramları, demokrasi yaklaşımları, siyasal ideolojiler, partiler ve seçim sistemleri, siyasal kültür ve toplumsallaşma, milliyetçilik ve kimlik siyaseti, modernleşme ve siyasal değişim, karşılaştırmalı siyasal sistemler boyutlarıyla ele alınır.",
    "methods": "Kuramsal anlatım, bilimsel kaynak incelemesi, örnek olay çözümlemesi, karşılaştırmalı analiz ve yapılandırılmış akademik tartışma.",
    "resources": "Ders kapsamına uygun güncel kitaplar, hakemli siyaset bilimi ve kamu yönetimi literatürü, mevzuat, resmi raporlar ve açık veri kaynakları.",
    "sdgs": [
      "4",
      "10",
      "16"
    ],
    "outcomes": [
      "Siyaset bilimi kapsamındaki ileri kavram ve yaklaşımları analiz eder.",
      "demokrasi yaklaşımları ile ilişkili kurum ve uygulamaları karşılaştırır.",
      "milliyetçilik ve kimlik siyaseti bağlamındaki veri ve kanıtları yorumlar.",
      "siyasal aktörler ve karar süreçleri için uygun analiz yaklaşımını uygular.",
      "Siyaset bilimi alanındaki sorunlara etik ve kamu yararı odaklı öneriler geliştirir."
    ],
    "weeklyTopics": [
      "siyasetin kapsamı ve temel kavramları",
      "iktidar, otorite ve meşruiyet",
      "devlet kuramları",
      "demokrasi yaklaşımları",
      "siyasal ideolojiler",
      "partiler ve seçim sistemleri",
      "siyasal kültür ve toplumsallaşma",
      "milliyetçilik ve kimlik siyaseti",
      "modernleşme ve siyasal değişim",
      "karşılaştırmalı siyasal sistemler",
      "siyasal aktörler ve karar süreçleri",
      "Türkiye'de siyasal düşüncenin gelişimi",
      "haklar, özgürlükler ve etik",
      "güncel siyasal tartışmaların analizi",
      "siyasal kuramların bütüncül değerlendirilmesi"
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
          2,
          1,
          4,
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
          3,
          2,
          5,
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
          3,
          1,
          4,
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
          2,
          2,
          5,
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
          3,
          1,
          4,
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
        "status": "Doğrulanmalı"
      },
      {
        "item": "Eksik/doğrulanması gereken alan kaldı mı?",
        "status": "Doğrulanmalı"
      }
    ],
    "publicQualityChecklist": false
  },
  {
    "department": "Siyaset Bilimi ve Kamu Yönetimi ABD",
    "programName": "Siyaset Bilimi ve Kamu Yönetimi",
    "level": "Tezsiz Yüksek Lisans",
    "code": "SKY711",
    "name": "Siyasal ideolojiler",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Prof. Dr. SUSRAN ERKAN EROĞLU",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Bu ders öğrenciye daha önceki dönemlerde üretilmiş siyasal düşüncenin ışığınıda 20. yüzyılda üretilmiş olan siyasal düşünceyi vermek ve der ayrıca çağdaş siyasal düşünce-çağdaş siyasal ideolojiler arasındaki ilişkiyi ortaya koymayı hedeflemektedir",
    "content": "Liberalizm ve türleri, sosyal demokrasi ve dönüşümü, muhafazakarlık ve yeni muhafazakarlık, demokrasi-kapitalizm ilişkisi, Rawls, Hayek ve Nozick",
    "methods": "Kuramsal anlatım, bilimsel kaynak incelemesi, örnek olay çözümlemesi, karşılaştırmalı analiz ve yapılandırılmış akademik tartışma.",
    "resources": "Kaynaklar: Mümtazer Türköne (Editör)(2006), Siyaset, Lotus, Ankara, ss.357-358.",
    "sdgs": [
      "4",
      "10",
      "16"
    ],
    "outcomes": [
      "Siyasal ideolojiler kapsamındaki ileri kavram ve yaklaşımları analiz eder.",
      "demokrasi yaklaşımları ile ilişkili kurum ve uygulamaları karşılaştırır.",
      "milliyetçilik ve kimlik siyaseti bağlamındaki veri ve kanıtları yorumlar.",
      "siyasal aktörler ve karar süreçleri için uygun analiz yaklaşımını uygular.",
      "Siyasal ideolojiler alanındaki sorunlara etik ve kamu yararı odaklı öneriler geliştirir."
    ],
    "weeklyTopics": [
      "Siyaset bilimi, siyaset felsefesi ve siyasal düşünce tarihi: Benzerlikler ve farklılıklar",
      "Liberalizm ve liberal demokrasi",
      "Sosyalizm ve sosyal demokrasi",
      "Muhafazakarlık ve yeni muhafazakarlık",
      "Demokrasi-kapitalist gelişme ilişkisi",
      "Yeni demokrasi modeli arayışları",
      "Radikal demokrasi",
      "Toplulukçu düşünce",
      "Hayek",
      "Rawls I",
      "Rawls II",
      "Nozick",
      "Arendt",
      "siyasetin kapsamı ve temel kavramları",
      "iktidar, otorite ve meşruiyet"
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
          2,
          1,
          4,
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
          3,
          2,
          5,
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
          3,
          1,
          4,
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
          2,
          2,
          5,
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
          3,
          1,
          4,
          3,
          4,
          3,
          3,
          4,
          3
        ]
      }
    ],
    "sourceUrl": "https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=243697&lang=tr",
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
  },
  {
    "department": "Siyaset Bilimi ve Kamu Yönetimi ABD",
    "programName": "Siyaset Bilimi ve Kamu Yönetimi",
    "level": "Tezsiz Yüksek Lisans",
    "code": "SKY713",
    "name": "KAMUOYU ve PROPAGANDA",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Prof. Dr. MÜJDAT AVCI",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Bu dersin amacı kamuoyu kavramı tanımlanmakta ve kamusal alan, rıza üretimi, propaganda, algı yönetimi tartışmalarıyla ilişkilendirilmektedir.",
    "content": "Bu dersin içeriği kamuoyu kavramı, tarihsel süreci ile propaganda kavramı ve toplumsal kontrol olgusu arasındaki ilişkiden oluşmaktadır.",
    "methods": "Anlatım, Soru - Cevap",
    "resources": "Kaynaklar: Kitle ve İktidar Elias Canetti Ayrıntı Yayınları, İstanbul: 1998Kamuoyu Elisabeth Noelle- Neumann Dost Kitabevi, Ankara, 1996Siyaset Yönetim Halkla İlişkiler Birkan Uysal Türkiye ve Ortadoğu AmmKamuoyu Alim Şerif Onaran Filiz Kitabevi, İstanbul: 1984; Ders Notları: Bektaş, Arsev, 2000, Kamuoyu, İletişim ve Demokrasi, Bağlam Yayınları. Özsoy, Osman, 1998, Propaganda ve Kamuoyu Oluşturma, Alfa Basım Yayın. Mutlu, Erol (der.), 2005, Kitle İletişim Kuramları, Ütopya. Bernays, Edward L., 1928, Propaganda, Horace Liveright. Lippmann, Walter, 1922, Public Opinion, Harcourt, Brace & Co., New York. Lippmann, Walter, 1925, The Phantom Public, Harcourt, Brace & Co. Dewey, John, 1927, The Public and Its Problems, Henry Holt and Company. Ellul, Jacques, 1965, Propaganda: The Formation of Men’s Attitudes, Alfred A. Knopf (İng. çeviri). Herman, Edward S.; Chomsky, Noam, 1988, Manufacturing Consent: The Political Economy of the Mass Media, Pantheon Books. Lasswell, Harold D., 1927, Propaganda Technique in the World War, A. A. Knopf. Jowett, Garth S.; O’Donnell, Victoria, 1986, Propaganda and Persuasion, SAGE Publications. Gallup, George; Rae, Saul F., 1940, The Pulse of Democracy: The Public-Opinion Poll and How It Works, Simon & Schuster.",
    "sdgs": [
      "4",
      "10",
      "16"
    ],
    "outcomes": [
      "KAMUOYU ve PROPAGANDA kapsamındaki ileri kavram ve yaklaşımları analiz eder.",
      "retorik ve ikna kuramları ile ilişkili kurum ve uygulamaları karşılaştırır.",
      "dijital medya ve siyasal katılım bağlamındaki veri ve kanıtları yorumlar.",
      "iletişim kampanyalarının çözümlemesi için uygun analiz yaklaşımını uygular.",
      "KAMUOYU ve PROPAGANDA alanındaki sorunlara etik ve kamu yararı odaklı öneriler geliştirir."
    ],
    "weeklyTopics": [
      "Kamuoyu",
      "Kamuoyunun Tarihsel Gelişimi",
      "Kamuoyu ve Oluşum Süreçleri",
      "Kamuoyu ve Kuramsal Çerçeve",
      "Kamuoyu ve Rıza Üretimi",
      "Kamuoyu ve Kamusal Alan",
      "Kamuoyu ve İdeoloji",
      "Kamuoyu, İletişim ve Halkla İlişkiler",
      "Kamuoyu ve Propaganda",
      "Kamuoyu ve Algı Yönetimi",
      "Stratejik İletişim ve Kamuoyu",
      "Küreselleşme ve Kamuoyu",
      "Genel değerlendirme",
      "iletişim ve siyaset ilişkisinin kavramsal temelleri",
      "kamusal alan ve kamuoyu"
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
          2,
          1,
          2,
          2,
          4,
          4,
          2,
          4,
          4
        ]
      },
      {
        "outcome": "DÖÇ2",
        "values": [
          3,
          5,
          3,
          2,
          3,
          3,
          5,
          5,
          3,
          5,
          5
        ]
      },
      {
        "outcome": "DÖÇ3",
        "values": [
          3,
          4,
          3,
          1,
          3,
          3,
          4,
          4,
          3,
          4,
          4
        ]
      },
      {
        "outcome": "DÖÇ4",
        "values": [
          2,
          5,
          2,
          2,
          2,
          2,
          5,
          5,
          2,
          5,
          5
        ]
      },
      {
        "outcome": "DÖÇ5",
        "values": [
          3,
          4,
          3,
          1,
          3,
          3,
          4,
          4,
          3,
          4,
          4
        ]
      }
    ],
    "sourceUrl": "https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=243729&lang=tr",
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
  },
  {
    "department": "Siyaset Bilimi ve Kamu Yönetimi ABD",
    "programName": "Siyaset Bilimi ve Kamu Yönetimi",
    "level": "Tezsiz Yüksek Lisans",
    "code": "SKY715",
    "name": "Kurumsal iletişim yönetimi",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Atama Bekliyor",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Öğrencinin siyasal iletişim ve medya alanındaki ileri kuramsal bilgileri siyasal ve yönetsel sorunların çözümünde kullanmasını sağlamak.",
    "content": "Kurumsal iletişim yönetimi; iletişim ve siyaset ilişkisinin kavramsal temelleri, kamusal alan ve kamuoyu, medya sistemleri ve siyasal aktörler, retorik ve ikna kuramları, propaganda modelleri, söylem çözümleme yaklaşımları, kurumsal iletişim ve itibar, dijital medya ve siyasal katılım, nefret söylemi ve ayrımcılık, kriz iletişimi boyutlarıyla ele alınır.",
    "methods": "Kuramsal anlatım, bilimsel kaynak incelemesi, örnek olay çözümlemesi, karşılaştırmalı analiz ve yapılandırılmış akademik tartışma.",
    "resources": "Ders kapsamına uygun güncel kitaplar, hakemli siyaset bilimi ve kamu yönetimi literatürü, mevzuat, resmi raporlar ve açık veri kaynakları.",
    "sdgs": [
      "4",
      "10",
      "16"
    ],
    "outcomes": [
      "Kurumsal iletişim yönetimi kapsamındaki ileri kavram ve yaklaşımları analiz eder.",
      "retorik ve ikna kuramları ile ilişkili kurum ve uygulamaları karşılaştırır.",
      "dijital medya ve siyasal katılım bağlamındaki veri ve kanıtları yorumlar.",
      "iletişim kampanyalarının çözümlemesi için uygun analiz yaklaşımını uygular.",
      "Kurumsal iletişim yönetimi alanındaki sorunlara etik ve kamu yararı odaklı öneriler geliştirir."
    ],
    "weeklyTopics": [
      "iletişim ve siyaset ilişkisinin kavramsal temelleri",
      "kamusal alan ve kamuoyu",
      "medya sistemleri ve siyasal aktörler",
      "retorik ve ikna kuramları",
      "propaganda modelleri",
      "söylem çözümleme yaklaşımları",
      "kurumsal iletişim ve itibar",
      "dijital medya ve siyasal katılım",
      "nefret söylemi ve ayrımcılık",
      "kriz iletişimi",
      "iletişim kampanyalarının çözümlemesi",
      "medya metinlerinin karşılaştırılması",
      "ifade özgürlüğü ve iletişim etiği",
      "güncel iletişim örneklerinin değerlendirilmesi",
      "siyasal iletişim süreçlerinin bütüncül analizi"
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
          2,
          1,
          2,
          2,
          4,
          4,
          2,
          4,
          4
        ]
      },
      {
        "outcome": "DÖÇ2",
        "values": [
          3,
          5,
          3,
          2,
          3,
          3,
          5,
          5,
          3,
          5,
          5
        ]
      },
      {
        "outcome": "DÖÇ3",
        "values": [
          3,
          4,
          3,
          1,
          3,
          3,
          4,
          4,
          3,
          4,
          4
        ]
      },
      {
        "outcome": "DÖÇ4",
        "values": [
          2,
          5,
          2,
          2,
          2,
          2,
          5,
          5,
          2,
          5,
          5
        ]
      },
      {
        "outcome": "DÖÇ5",
        "values": [
          3,
          4,
          3,
          1,
          3,
          3,
          4,
          4,
          3,
          4,
          4
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
        "status": "Doğrulanmalı"
      },
      {
        "item": "Eksik/doğrulanması gereken alan kaldı mı?",
        "status": "Doğrulanmalı"
      }
    ],
    "publicQualityChecklist": false
  },
  {
    "department": "Siyaset Bilimi ve Kamu Yönetimi ABD",
    "programName": "Siyaset Bilimi ve Kamu Yönetimi",
    "level": "Tezsiz Yüksek Lisans",
    "code": "SKY717",
    "name": "Modern türkiye'de politik düşünce",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Dr. Öğr. Üyesi LEVENT BÖRKLÜOĞLU",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Bu dersin amacı modern Türkiye’nin doğuş sürecinde etkili olmuş felsefi ve siyasal düşünce akımlarını ortaya koymak ve belli başlı düşünürlerin fikirlerini değerlendirmektir.",
    "content": "Modernlik ve Batı dışı toplumların modernleşme serüvenleri. Osmanlı-Türk modernleşmesinin tarihsel-siyasal arka planı. Temel siyasal tutumlar ve fikir akımları akımları: Osmanlıcılık, Batıcılık, Milliyetçilik, İslamcılık, Kemalizm, Liberalizm ve Sosyalizm.",
    "methods": "Yüz yüze anlatım ve tartışma.",
    "resources": "Kaynaklar: BERKES, Niyazi (2025). Türkiye'de Çağdaşlaşma, Yapı Kredi Yayınları: İstanbul.; Ders Notları: ÜLKEN, Hilmi Ziya (2013). Türkiye'de Çağdaş Düşünce Tarihi, İş Bankası Kültür Yayınları: İstanbul.",
    "sdgs": [
      "4",
      "10",
      "16"
    ],
    "outcomes": [
      "Modern türkiye'de politik düşünce kapsamındaki ileri kavram ve yaklaşımları analiz eder.",
      "demokrasi yaklaşımları ile ilişkili kurum ve uygulamaları karşılaştırır.",
      "milliyetçilik ve kimlik siyaseti bağlamındaki veri ve kanıtları yorumlar.",
      "siyasal aktörler ve karar süreçleri için uygun analiz yaklaşımını uygular.",
      "Modern türkiye'de politik düşünce alanındaki sorunlara etik ve kamu yararı odaklı öneriler geliştirir."
    ],
    "weeklyTopics": [
      "Modernleşme Kavramının Analizi",
      "Batı-dışı Toplumların Modernleşme Süreci",
      "Osmanlı-Türk Modernleşmesinin Tarihsel Serüveni",
      "Tanzimat Modernleşmesi",
      "II. Meşrutiyet Sonrası Temel Siyasal ve Felsefi Görüşler",
      "Türk Düşünce Hayatında Osmanlıcılık",
      "Türk Düşünce Hayatında İslamcılık",
      "Türk Düşünce Hayatında Batıcılık",
      "Türk Düşünce Hayatında Milliyetçilik",
      "Türk Düşünce Hayatında Kemalizm",
      "Türk Düşünce Hayatında Muhafazakârlık",
      "Türk Düşünce Hayatında Liberalizm",
      "Türk Düşünce Hayatında Sosyalizm",
      "siyasetin kapsamı ve temel kavramları",
      "iktidar, otorite ve meşruiyet"
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
          2,
          1,
          4,
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
          3,
          2,
          5,
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
          3,
          1,
          4,
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
          2,
          2,
          5,
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
          3,
          1,
          4,
          3,
          4,
          3,
          3,
          4,
          3
        ]
      }
    ],
    "sourceUrl": "https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=243733&lang=tr",
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
  },
  {
    "department": "Siyaset Bilimi ve Kamu Yönetimi ABD",
    "programName": "Siyaset Bilimi ve Kamu Yönetimi",
    "level": "Tezsiz Yüksek Lisans",
    "code": "SKY719",
    "name": "Türk siyasal modernleşmesi",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Prof. Dr. MÜJDAT AVCI",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Türkiye'deki modernleşme süreci hakkında bilgi sahibi olmak.",
    "content": "Modernleşme kavramı, Osmanlıda yenileşme düşüncesinin ortaya çıkışı ve Cumhuriyet Dönemi modernleşme çabaları.",
    "methods": "Anlatım, Soru - Cevap",
    "resources": "Kaynaklar: Şerif Mardin, Türk Modernleşmesi, İletişim YayınlarıBernard Lewis, Modern Türkiye’nin Doğuşu, Türk Tarih Kurumu YayınlarıKemal Karpat, Osmanlı Modernleşmesi, İmge Kitabevi; Ders Notları: Kırık, Hikmet — Türk Siyasal Modernleşmesi: Cumhuriyetin Demokratik Kökenleri, 2020, Doruk Yayınları. Mardin, Şerif — Türk Modernleşmesi, (ilk baskı yılı belirtilmemiş), İmge Yayınları. Durgun, Şenol — Modernleşme ve Siyaset, 2013, A Kitap Yayınevi. Akın, Mahmut Hakkı — Türkiye’de Modernleşme: Din, Siyaset ve Toplumsal Değişme, 2021, Türkiye Notları Yayınları. Kolektif — Türk Siyasal Hayatı: Osmanlı Modernleşmesinden Günümüze, 2018 ya da 2019, Nobel Akademik Yayıncılık. Kolektif — Modern Türkiye’de Siyasî Düşünce Cilt 9: Dönemler ve Zihniyetler, 2009, İletişim Yayınları. Yavaşgel, Emine (Derleyen) — Siyasal Modernleşme: Türk Siyasetinde Kadının Temsil Sorunu, 2014, Derin Yayınları. Yetim, Fahri — Türkiye’de Modernleşme, Düşünce ve Zihniyet, (2024), Kadim Yayınları. Akın, Mahmut Hakkı — Türkiye’de Modernleşme – Din, Siyaset ve Toplumsal Değişme (Makale derlemesi), 2022, Türkiye Notları Yayınları. [Ek kaynak olarak] İletişim Yayınları derlemesi — Modern Türkiye’de Siyasî Düşünce: Modernleşme ve Batıcılık, 2012, İletişim Yayınları.",
    "sdgs": [
      "4",
      "10",
      "16"
    ],
    "outcomes": [
      "Türk siyasal modernleşmesi kapsamındaki ileri kavram ve yaklaşımları analiz eder.",
      "demokrasi yaklaşımları ile ilişkili kurum ve uygulamaları karşılaştırır.",
      "milliyetçilik ve kimlik siyaseti bağlamındaki veri ve kanıtları yorumlar.",
      "siyasal aktörler ve karar süreçleri için uygun analiz yaklaşımını uygular.",
      "Türk siyasal modernleşmesi alanındaki sorunlara etik ve kamu yararı odaklı öneriler geliştirir."
    ],
    "weeklyTopics": [
      "Modernleşme kavramı",
      "Osmanlıda yenileşme düşüncesinin ortaya çıkışı",
      "Lale Devri",
      "III.Selim ve II.Mahmut dönemleri",
      "Tanzimat döneminde idare, maliye ve orduda modernleşme",
      "Tanzimat devrinde eğitim ve kültür alanında modernleşme",
      "I. Meşrutiyet ve II. Meşrutiyet Dönemleri",
      "Cumhuriyet Dönemi Modernleşmesine giriş",
      "Cumhuriyet Döneminde yapılan idari değişiklikler",
      "Cumhuriyet Dönemindeki eğitsel ve sosyal değişimler",
      "Batıda modernleşme süreci",
      "Batı ve Türkiye'deki modernleşmenin karşılaştırılması",
      "Modernleşme hakkında sosyolojik tartışmalar",
      "siyasetin kapsamı ve temel kavramları",
      "iktidar, otorite ve meşruiyet"
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
          2,
          1,
          4,
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
          3,
          2,
          5,
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
          3,
          1,
          4,
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
          2,
          2,
          5,
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
          3,
          1,
          4,
          3,
          4,
          3,
          3,
          4,
          3
        ]
      }
    ],
    "sourceUrl": "https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=243701&lang=tr",
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
  },
  {
    "department": "Siyaset Bilimi ve Kamu Yönetimi ABD",
    "programName": "Siyaset Bilimi ve Kamu Yönetimi",
    "level": "Tezsiz Yüksek Lisans",
    "code": "SKY721",
    "name": "Kamu yönetiminde etik",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Atama Bekliyor",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Öğrencinin kamu yönetimi ve yönetişim alanındaki ileri kuramsal bilgileri siyasal ve yönetsel sorunların çözümünde kullanmasını sağlamak.",
    "content": "Kamu yönetiminde etik; kamu yönetiminin kapsamı ve temel kavramları, klasik ve çağdaş yönetim yaklaşımları, kamu örgütlerinin yapısı, bürokrasi ve yönetsel davranış, kamu personel sistemi, stratejik yönetim ve planlama, performans, kalite ve hesap verebilirlik, yönetişim aktörleri ve katılım, idari reform ve kurumsal değişim, kamu hizmetlerinde dijital dönüşüm boyutlarıyla ele alınır.",
    "methods": "Kuramsal anlatım, bilimsel kaynak incelemesi, örnek olay çözümlemesi, karşılaştırmalı analiz ve yapılandırılmış akademik tartışma.",
    "resources": "Ders kapsamına uygun güncel kitaplar, hakemli siyaset bilimi ve kamu yönetimi literatürü, mevzuat, resmi raporlar ve açık veri kaynakları.",
    "sdgs": [
      "4",
      "16",
      "17"
    ],
    "outcomes": [
      "Kamu yönetiminde etik kapsamındaki ileri kavram ve yaklaşımları analiz eder.",
      "bürokrasi ve yönetsel davranış ile ilişkili kurum ve uygulamaları karşılaştırır.",
      "yönetişim aktörleri ve katılım bağlamındaki veri ve kanıtları yorumlar.",
      "karar süreçleri ve uygulama sorunları için uygun analiz yaklaşımını uygular.",
      "Kamu yönetiminde etik alanındaki sorunlara etik ve kamu yararı odaklı öneriler geliştirir."
    ],
    "weeklyTopics": [
      "kamu yönetiminin kapsamı ve temel kavramları",
      "klasik ve çağdaş yönetim yaklaşımları",
      "kamu örgütlerinin yapısı",
      "bürokrasi ve yönetsel davranış",
      "kamu personel sistemi",
      "stratejik yönetim ve planlama",
      "performans, kalite ve hesap verebilirlik",
      "yönetişim aktörleri ve katılım",
      "idari reform ve kurumsal değişim",
      "kamu hizmetlerinde dijital dönüşüm",
      "karar süreçleri ve uygulama sorunları",
      "karşılaştırmalı yönetim örnekleri",
      "etik ve kamu yararı",
      "güncel yönetsel sorunların analizi",
      "yönetim yaklaşımlarının bütüncül değerlendirilmesi"
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
        "status": "Doğrulanmalı"
      },
      {
        "item": "Eksik/doğrulanması gereken alan kaldı mı?",
        "status": "Doğrulanmalı"
      }
    ],
    "publicQualityChecklist": false
  },
  {
    "department": "Siyaset Bilimi ve Kamu Yönetimi ABD",
    "programName": "Siyaset Bilimi ve Kamu Yönetimi",
    "level": "Tezsiz Yüksek Lisans",
    "code": "SKY723",
    "name": "İdari reform analizleri",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Prof. Dr. SELİM COŞKUN",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "İdari reformları analiz etmek için kullanılacak bir teorik çerçeve ortaya koymak ve bu teorik çerçeve aracılığıyla öğrencinin çeşitli ülkelerde gerçekleştirilen idari reformları analiz edebilmesini sağlamaktır.",
    "content": "İdari Reform: Kavramsal Çerçeve Günümüzde İdari Reformun İçsel Nedenleri Günümüzde İdari Reformun Dışsal Nedenleri Bir Reform Hareketi Olarak Yeni Kamu İşletmeciliği Bir Yönetim Tarzı Olarak Yönetişim İdari Gelenekler İdari Reform Analizi İçin Bir Çerçeve Gelişmiş Ülkelerde İdari Reformların Analizi Gelişmekte Olan Ülkelerde İdari Reformların Analizi Az Gelişmiş Ülkelerde İdari Reformların Analizi Asya Ülkelerinde İdari Reformlar Uzakdoğu Ülkelerinde İdari Reformlar Latin Amerika Ülkelerinde İdari Reformlar İdari Reformların Etkileri Üzerine Genel Bir Değerlendirme: Bağlamsal Faktörlerin Önemi",
    "methods": "Kuramsal anlatım, bilimsel kaynak incelemesi, örnek olay çözümlemesi, karşılaştırmalı analiz ve yapılandırılmış akademik tartışma.",
    "resources": "Kaynaklar: M. Zahid SOBACI, İdari Reform ve Politika Transferi, Turhan Kitabevi, Ankara, 2009.POLLIT, Christopher; VAN THIEL, Sandra; HOMBURG, Vincent (Ed.). New Public Management in Europe: Adaptation and Alternatives, Palgrave Macmillan, 2007.; Ders Notları: M. Zahid SOBACI, İdari Reform ve Politika Transferi, Turhan Kitabevi, Ankara, 2009.POLLIT, Christopher; VAN THIEL, Sandra; HOMBURG, Vincent (Ed.). New Public Management in Europe: Adaptation and Alternatives, Palgrave Macmillan, 2007.PAINTER, Martin; PETERS, B. Guy (Ed.). Tradition and Public Administration, Palgrave Macmillan, 2010.",
    "sdgs": [
      "4",
      "16",
      "17"
    ],
    "outcomes": [
      "İdari reform analizleri kapsamındaki ileri kavram ve yaklaşımları analiz eder.",
      "bürokrasi ve yönetsel davranış ile ilişkili kurum ve uygulamaları karşılaştırır.",
      "yönetişim aktörleri ve katılım bağlamındaki veri ve kanıtları yorumlar.",
      "karar süreçleri ve uygulama sorunları için uygun analiz yaklaşımını uygular.",
      "İdari reform analizleri alanındaki sorunlara etik ve kamu yararı odaklı öneriler geliştirir."
    ],
    "weeklyTopics": [
      "İdari Reform: Kavramsal Çerçeve",
      "Günümüzde İdari Reformun İçsel Nedenleri",
      "Günümüzde İdari Reformun Dışsal Nedenleri",
      "Bir Reform Hareketi Olarak Yeni Kamu İşletmeciliği",
      "Bir Yönetim Tarzı Olarak Yönetişim",
      "İdari Gelenekler",
      "İdari Reform Analizi İçin Bir Çerçeve",
      "Gelişmiş Ülkelerde İdari Reformların Analizi",
      "Gelişmekte Olan Ülkelerde İdari Reformların Analizi",
      "Az Gelişmiş Ülkelerde İdari Reformların Analizi",
      "Asya Ülkelerinde İdari Reformlar",
      "Uzakdoğu Ülkelerinde İdari Reformlar",
      "Latin Amerika Ülkelerinde İdari Reformlar",
      "İdari Reformların Etkileri Üzerine Genel Bir Değerlendirme: Bağlamsal Faktörlerin Önemi",
      "kamu yönetiminin kapsamı ve temel kavramları"
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
    "sourceUrl": "https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=243724&lang=tr",
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
  },
  {
    "department": "Siyaset Bilimi ve Kamu Yönetimi ABD",
    "programName": "Siyaset Bilimi ve Kamu Yönetimi",
    "level": "Tezsiz Yüksek Lisans",
    "code": "SKY725",
    "name": "Yerel politikalar",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Prof. Dr. MEHMET BURHANETTİN COŞKUN",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Kamu yönetiminin önemli bir bölümünü oluşturan yerel yönetimlerin teorik arka planını ve dayandığı değerleri ele almak ve bu çerçevede ülkemizdeki yerel yönetim birimlerini görev, yetki, kuruluş, örgüt yapısı, teşkilatı, mali yapısı, yönetimlerarası ilişkiler vb. bütün yönleri ile incelemektir.",
    "content": "Yerel yönetimlerin tanımı, önemi, dayandığı değerler; yerinden yönetim ve mahalli idareler, Anayasalarda yerel yönetimler ve yerel demokrasi, yerel yönetim kuruluşlarının tarihi gelişimi, görevleri, organları, teşkilatlanması, insan kaynakları ve yönetimi, yerel yönetim birlikleri, yerel yönetimlerde hizmet yöntemleri, yönetimlerarası ilişkiler, yerel yönetimlerle ilgili güncel sorunlar.",
    "methods": "Yüz yüze",
    "resources": "Kaynaklar: - Ramazan Şengül (2013), Yerel Yönetimler, Umuttepe Yayınları, Kocaeli. - Kemal Görmez (1997), Yerel Demokrasi ve Türkiye, Vadi Yayınları, Ankara - Mustafa Ökmen (2013), Yerel Yönetimler, Orion Kitabevi, Ankara. - Selahattin Yıldırım (1990), “Yerel Yönetim ve Demokrasi”, Türk Belediyeciliğinde 60 Yıl Uluslararası Sempozyumu, Ankara, 23-24 Kasım, s. 12-25. - Bilal Eryılmaz (2013), Kamu Yönetimi, Umuttepe Yayınları, Kocaeli. - Hüseyin Özgür ve Murat Okçu (2013), Dünyada Yerel Yönetimler, Örnekler ve Uygulamalar, Seçkin Yayıncılık, Ankara.; Ders Notları: -",
    "sdgs": [
      "10",
      "11",
      "16"
    ],
    "outcomes": [
      "Yerel politikalar kapsamındaki ileri kavram ve yaklaşımları analiz eder.",
      "yerel mali yapı ve kaynaklar ile ilişkili kurum ve uygulamaları karşılaştırır.",
      "sivil toplum ve katılım bağlamındaki veri ve kanıtları yorumlar.",
      "karşılaştırmalı yerel yönetim örnekleri için uygun analiz yaklaşımını uygular.",
      "Yerel politikalar alanındaki sorunlara etik ve kamu yararı odaklı öneriler geliştirir."
    ],
    "weeklyTopics": [
      "Kentlerin ve yerel yönetimlerin ortaya çıkışı, gelişimi ve önemi",
      "Yerel yönetimlerle ilgili temel yönetim ve örgütlenme ilkeleri",
      "Anayasalarımızda yerel yönetimlere ilişkin düzenlemeler",
      "Türkiye´de yerel yönetimler: İl özel idaresi",
      "Türkiye´de yerel yönetimler: Belediye",
      "Türkiye´de yerel yönetimler: Büyükşehir belediyesi",
      "Yerel yönetimlerde hizmet yöntemleri",
      "Güncel Gelişmeler Üzerine Tartışmalar",
      "Türkiye´de yerel yönetimler: Köyler",
      "Yerel yönetim birlikleri",
      "Teknik gezi",
      "Yerel yönetimler maliyesi",
      "Karşılaştırmalı yerel yönetimler",
      "Yerel yönetimlerde güncel sorunlar",
      "yerel yönetimlerin temel kavramları"
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
          4,
          1,
          4,
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
          3,
          5,
          2,
          5,
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
          3,
          4,
          1,
          4,
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
          2,
          5,
          2,
          5,
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
          3,
          4,
          1,
          4,
          3,
          4,
          3,
          3,
          4,
          3
        ]
      }
    ],
    "sourceUrl": "https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=243704&lang=tr",
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
  },
  {
    "department": "Siyaset Bilimi ve Kamu Yönetimi ABD",
    "programName": "Siyaset Bilimi ve Kamu Yönetimi",
    "level": "Tezsiz Yüksek Lisans",
    "code": "SKY727",
    "name": "Karşılaştırmalı siyasal sistemler",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Prof. Dr. MEHMET BURHANETTİN COŞKUN",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Bu dersin amacı ülkelerin siyasal rejimleri hakkında karşılşatırmalı bilgi sunmaktır.",
    "content": "Çağdaş Siyasal Rejimlerin Karakteristiği Olarak Kuvvetler Ayrılığı, Genel Olarak Başkanlık Sistemleri, Başkanlık Sistemlerinde Devlet Başkanları: Başkanın Statüsü, Başkanlık Sistemlerinde Devlet Başkanları: Başkanın Sorumluluğu ve Sorumsuzluğu, Başkanlık Sistemlerinde Devlet Başkanları: Başkanın Görev ve Yetkileri, Yarı-Başkanlık Sistemi: Yapısı ve Devlet Başkanının Statüsü, Yarı-Başkanlık Sistemlerinde Devlet Başkanının Sorumluluğu ve Sorumsuzluğu, Genel Olarak Parlamenter Hükümet Sistemleri.",
    "methods": "Yüz yüze",
    "resources": "Kaynaklar: GÖZLER, Kemal (2001), Devlet Başkanları: Bir Karşılaştırmalı Anayasa Hukuku İncelmesi, Ekin Kitabevi, Bursa.ATAÖV, Türkkaya (2011), Federasyon, Başkanlık, Yarı-Başkanlık, Destek Yayınları, İstanbul.; Ders Notları: -; Dökümanlar: ROSKİN, Mİchael (2013), Çağdaş Devlet Sistemleri, (Çev. Bahattin Seçilmişoğlu), 4. Basım, Adres Yayınları, Ankara.",
    "sdgs": [
      "4",
      "10",
      "16"
    ],
    "outcomes": [
      "Karşılaştırmalı siyasal sistemler kapsamındaki ileri kavram ve yaklaşımları analiz eder.",
      "demokrasi yaklaşımları ile ilişkili kurum ve uygulamaları karşılaştırır.",
      "milliyetçilik ve kimlik siyaseti bağlamındaki veri ve kanıtları yorumlar.",
      "siyasal aktörler ve karar süreçleri için uygun analiz yaklaşımını uygular.",
      "Karşılaştırmalı siyasal sistemler alanındaki sorunlara etik ve kamu yararı odaklı öneriler geliştirir."
    ],
    "weeklyTopics": [
      "Kuvvetler Ayrılığı",
      "Genel Olarak Başkanlık Sistemleri",
      "Başkanlık Sisteminde Devlet Başkanları: Başkanın Statüsü",
      "Başkanlık Sisteminde Devlet Başkanları: Başkanın Sorumluluğu ve Sorumsuzluğu",
      "Başkanlık Sisteminde Devlet Başkanları: Başkanın Görev ve Yetkileri",
      "Yarı Başkanlık Sistemi: Yapısı ve Devlet Başkanının Statüsü",
      "Yarı Başkanlık Sisteminde Devlet Başkanının Sorumluluğu ve Sorumsuzluğu",
      "Yarı Başkanlık Sisteminde Devlet Başkanının Görev ve Yetkileri",
      "Güncel Gelişmeler Üzerine Tartışmalar",
      "Genel Olarak Parlamenter Hükümet Sistemleri",
      "Parlamenter Hükümet Sisteminde Devlet Başkanlarının Statüsü",
      "Parlamenter Hükümet Sisteminde Devlet Başkanlarının Sorumluluğu ve Sorumsuzluğu",
      "Parlamenter Hükümet Devlet Başkanlarının Görev ve Yetkileri",
      "Parlamenter Devlet Sistemlerinde Devlet Başkanı - Hükümet Çatışması",
      "siyasetin kapsamı ve temel kavramları"
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
          2,
          1,
          4,
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
          3,
          2,
          5,
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
          3,
          1,
          4,
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
          2,
          2,
          5,
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
          3,
          1,
          4,
          3,
          4,
          3,
          3,
          4,
          3
        ]
      }
    ],
    "sourceUrl": "https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=243730&lang=tr",
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
  },
  {
    "department": "Siyaset Bilimi ve Kamu Yönetimi ABD",
    "programName": "Siyaset Bilimi ve Kamu Yönetimi",
    "level": "Tezsiz Yüksek Lisans",
    "code": "SKY729",
    "name": "TÜRK YÖNETİM TARİHİ ve TEŞKİLATI",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Prof. Dr. SELİM COŞKUN",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Türk yönetim tarihini anlamak",
    "content": "Yonetım, turk yonetım kulturu, turk devlet gelenegı",
    "methods": "Kuramsal anlatım, bilimsel kaynak incelemesi, örnek olay çözümlemesi, karşılaştırmalı analiz ve yapılandırılmış akademik tartışma.",
    "resources": "Kaynaklar: Metin İşçiTürk Yönetim TarihiDer Yayınları; Ders Notları: NIZAMUL-MULK, SİYASETNAME, IBNI HALDUN MUKADDIME",
    "sdgs": [
      "4",
      "16",
      "17"
    ],
    "outcomes": [
      "TÜRK YÖNETİM TARİHİ ve TEŞKİLATI kapsamındaki ileri kavram ve yaklaşımları analiz eder.",
      "bürokrasi ve yönetsel davranış ile ilişkili kurum ve uygulamaları karşılaştırır.",
      "yönetişim aktörleri ve katılım bağlamındaki veri ve kanıtları yorumlar.",
      "karar süreçleri ve uygulama sorunları için uygun analiz yaklaşımını uygular.",
      "TÜRK YÖNETİM TARİHİ ve TEŞKİLATI alanındaki sorunlara etik ve kamu yararı odaklı öneriler geliştirir."
    ],
    "weeklyTopics": [
      "Yonetım",
      "Yonetım-ısletme ayrımı",
      "Turk yonetım dusuncesı",
      "Sıyasetname",
      "Ibnı haldun, mukaddıme",
      "Katıp celebı",
      "kamu yönetiminin kapsamı ve temel kavramları",
      "klasik ve çağdaş yönetim yaklaşımları",
      "kamu örgütlerinin yapısı",
      "bürokrasi ve yönetsel davranış",
      "kamu personel sistemi",
      "stratejik yönetim ve planlama",
      "performans, kalite ve hesap verebilirlik",
      "yönetişim aktörleri ve katılım",
      "idari reform ve kurumsal değişim"
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
    "sourceUrl": "https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=243702&lang=tr",
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
  },
  {
    "department": "Siyaset Bilimi ve Kamu Yönetimi ABD",
    "programName": "Siyaset Bilimi ve Kamu Yönetimi",
    "level": "Tezsiz Yüksek Lisans",
    "code": "SKY731",
    "name": "Politik ekonomi",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Doç. Dr. MEHMET ELA",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Siyaset ve ekonomi arasındaki etkileşim ekonomistlerin ilgisini her zaman çekmektedir. Nitekim siyasetin ekonomi politikalarının seçimi ve performansı üzerindeki etkisi açıkça görüldükten sonra bu alanda ki çalışmalar hızlı bir şekilde artmıştır. Bu dersin amacı siyaset ve ekonomi arasındaki ilişkinin anlaşılmasın sağlamaktır.",
    "content": "Politik ekonomi; siyasal ekonominin temel kavramları, devlet-piyasa ilişkileri, kapitalizmin kurumsal yapısı, kamu ekonomisi ve maliye politikası, bölüşüm ve eşitsizlik, vergileme ve kamu gelirleri, yerel yönetim maliyesi, küresel siyasal ekonomi, krizler ve kurumsal dönüşüm, düzenleyici politikalar boyutlarıyla ele alınır.",
    "methods": "Kuramsal anlatım, bilimsel kaynak incelemesi, örnek olay çözümlemesi, karşılaştırmalı analiz ve yapılandırılmış akademik tartışma.",
    "resources": "Kaynaklar: Dennis C. Mueller “Perspectives on public choice”",
    "sdgs": [
      "8",
      "10",
      "16"
    ],
    "outcomes": [
      "Politik ekonomi kapsamındaki ileri kavram ve yaklaşımları analiz eder.",
      "kamu ekonomisi ve maliye politikası ile ilişkili kurum ve uygulamaları karşılaştırır.",
      "küresel siyasal ekonomi bağlamındaki veri ve kanıtları yorumlar.",
      "ekonomik göstergelerin yorumlanması için uygun analiz yaklaşımını uygular.",
      "Politik ekonomi alanındaki sorunlara etik ve kamu yararı odaklı öneriler geliştirir."
    ],
    "weeklyTopics": [
      "Kamu Kesiminin Başarısızlığı ve Kamu Tercihi",
      "Kamusal Tercih Teorisinin Gelişimi",
      "Kamu Tercihi ve Mülkiyet Haklar",
      "Regülasyon, Vergilendirme ve Kamu Girişimi",
      "Piyasa Başarısızlığı ve Politik Başarısızlık",
      "Karar Alma Süreçlerinin Ekonomik Analizi",
      "Oylama Paradoksu",
      "Medyan Seçim Teorisi",
      "Çıkar Grupları / Bürokrasi Teorisi",
      "Rant Kollama Teorisi",
      "Kamu Tercihine Eleştiriler",
      "Anayasal İktisat",
      "Anayasal İktisadın Teorik Temelleri",
      "siyasal ekonominin temel kavramları",
      "devlet-piyasa ilişkileri"
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
          4,
          1,
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
          3,
          5,
          2,
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
          3,
          4,
          1,
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
          2,
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
          3,
          4,
          1,
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
    "sourceUrl": "https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=243696&lang=tr",
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
  },
  {
    "department": "Siyaset Bilimi ve Kamu Yönetimi ABD",
    "programName": "Siyaset Bilimi ve Kamu Yönetimi",
    "level": "Tezsiz Yüksek Lisans",
    "code": "SKY733",
    "name": "Türkiye'de demokrasinin gelişimi",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Prof. Dr. TURGAY UZUN",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Öğrencinin Türk Demokrasi Tarihi hakkında bilgi sahibi olması sağlamaktır.",
    "content": "Türkiye'de demokrasinin gelişimi; siyasetin kapsamı ve temel kavramları, iktidar, otorite ve meşruiyet, devlet kuramları, demokrasi yaklaşımları, siyasal ideolojiler, partiler ve seçim sistemleri, siyasal kültür ve toplumsallaşma, milliyetçilik ve kimlik siyaseti, modernleşme ve siyasal değişim, karşılaştırmalı siyasal sistemler boyutlarıyla ele alınır.",
    "methods": "Kuramsal anlatım, bilimsel kaynak incelemesi, örnek olay çözümlemesi, karşılaştırmalı analiz ve yapılandırılmış akademik tartışma.",
    "resources": "Kaynaklar: Kemal Karpat, Türk Demokrasi Tarihi",
    "sdgs": [
      "4",
      "10",
      "16"
    ],
    "outcomes": [
      "Türkiye'de demokrasinin gelişimi kapsamındaki ileri kavram ve yaklaşımları analiz eder.",
      "demokrasi yaklaşımları ile ilişkili kurum ve uygulamaları karşılaştırır.",
      "milliyetçilik ve kimlik siyaseti bağlamındaki veri ve kanıtları yorumlar.",
      "siyasal aktörler ve karar süreçleri için uygun analiz yaklaşımını uygular.",
      "Türkiye'de demokrasinin gelişimi alanındaki sorunlara etik ve kamu yararı odaklı öneriler geliştirir."
    ],
    "weeklyTopics": [
      "Türkiye'de Demokrasi Tarihi Üzerine Genel Görüş",
      "Osmanlı İmpararatorluğu'nda reform hareketleri.",
      "Cumhuriyetin kuruluşu ve gelişmesi",
      "Cumhuriyet dönemi ekonomik ve toplumsal gelişmeler.",
      "Cumhuriyet dönemi toplumsal sınıflar.",
      "Çok partili sisteme geçiş süreci",
      "Muhalefetin doğuşu",
      "İktidar mücadelesi",
      "Milliyetçilik akımları",
      "Laiklik, din ve politika",
      "Devletçilik ve iktisadi gelişmeler",
      "Halkçılık ve sosyal sınıflar",
      "Batılılaşma ve davranış değişimleri",
      "Siyasi rejim ve siyasi partiler",
      "siyasetin kapsamı ve temel kavramları"
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
          2,
          1,
          4,
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
          3,
          2,
          5,
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
          3,
          1,
          4,
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
          2,
          2,
          5,
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
          3,
          1,
          4,
          3,
          4,
          3,
          3,
          4,
          3
        ]
      }
    ],
    "sourceUrl": "https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=243703&lang=tr",
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
  },
  {
    "department": "Siyaset Bilimi ve Kamu Yönetimi ABD",
    "programName": "Siyaset Bilimi ve Kamu Yönetimi",
    "level": "Tezsiz Yüksek Lisans",
    "code": "SKY735",
    "name": "Kamu yönetimi kuramları",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Prof. Dr. SELİM COŞKUN",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Bu dersin amacı öğrencinin kamu yönetimi kuramları konusunda bilgilendirilmesidir.",
    "content": "Kamu yönetimi kuramları, klasik kamu yönetimi kuramları, neo-klasik kamu yönetimi kuramları, bürokrasiiçeriği kuramı, yeni kamu yönetimi, yeni kamu işletmeciliği, eleştirel kuram",
    "methods": "Kuramsal anlatım, bilimsel kaynak incelemesi, örnek olay çözümlemesi, karşılaştırmalı analiz ve yapılandırılmış akademik tartışma.",
    "resources": "Kaynaklar: Ates, H. (2020), Kamu Yonetimi Teorileri: Geleneksel Teorilerden Yeni Yaklasimlara, Ankara: Savas Yaymevi.; Ders Notları: Ates, H. (2020), Kamu Yonetimi Teorileri: Geleneksel Teorilerden Yeni Yaklasimlara, Ankara: SavasYaymevi.",
    "sdgs": [
      "4",
      "16",
      "17"
    ],
    "outcomes": [
      "Kamu yönetimi kuramları kapsamındaki ileri kavram ve yaklaşımları analiz eder.",
      "bürokrasi ve yönetsel davranış ile ilişkili kurum ve uygulamaları karşılaştırır.",
      "yönetişim aktörleri ve katılım bağlamındaki veri ve kanıtları yorumlar.",
      "karar süreçleri ve uygulama sorunları için uygun analiz yaklaşımını uygular.",
      "Kamu yönetimi kuramları alanındaki sorunlara etik ve kamu yararı odaklı öneriler geliştirir."
    ],
    "weeklyTopics": [
      "Dersin Amacı ve Planlama",
      "Kavram, Kuram ve Yöntem",
      "Kamu Yönetimi Kuramlar - Genel Bir Bakış",
      "Weber ve Bürokrasi",
      "Bilimsel Yönetim",
      "İnsan ilişkileri Yaklaşımı",
      "Yeni Kamu Yönetimi",
      "Post-modern Kamu Yönetimi",
      "Eleştirel Kuram",
      "Devleti Yeniden icat Etme",
      "Kamu Tercihi Okulu",
      "Yeni Kamu İşletmeciliği",
      "Türkiye'de Kamu İşletmeciliği",
      "Genel Değerlendirme",
      "Genel Sınav"
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
    "sourceUrl": "https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=243726&lang=tr",
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
  },
  {
    "department": "Siyaset Bilimi ve Kamu Yönetimi ABD",
    "programName": "Siyaset Bilimi ve Kamu Yönetimi",
    "level": "Tezsiz Yüksek Lisans",
    "code": "SKY737",
    "name": "Milliyetçilik ve kimlik politikaları",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Dr. Öğr. Üyesi CİHAN UZUNÇAYIR",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Bu dersin amacı, milliyetçilik ve kimlik politikalarıyla ilgili temel kavramları, teorileri ve güncel tartışmaları sunmaktır.",
    "content": "Irk, Etnisite, Ulus, Milliyetçilik; Milliyetçiliğin Temel Teorileri; Banal ve Gündelik Milliyetçilik; Etnik ve Sivil Milliyetçilik Ayrımı; Milliyetçilik, Uluslararası İlişkiler ve Devlet Siyaseti; Kimlik Politikaları ve Azınlık Hakları; Göçmen Karşıtlığı ve Yabancı Düşmanlığı; Popülizm ve Milliyetçilik",
    "methods": "Ders, yüz yüze anlatım ve öğrenci sunumlarıyla yürütülmektedir.",
    "resources": "Kaynaklar: 1. Umut ÖZKIRIMLI, Milliyetçilik Kuramları Eleştirel Bir Bakış, Doğu-Batı Yayınları.5. Craig Calhoun, Milliyetçilik, İstanbul Bilgi Üniversitesi Yayınları.2. Eric J. Hobsbawm, Milletler ve Milliyetçilik, Ayrıntı Yayınları.3. Benedict Anderson, Hayali Cemaatler, Metis Yayınları.4. Anthony D. Smith, Milli Kimlik, İletişim Yayınları.",
    "sdgs": [
      "4",
      "10",
      "16"
    ],
    "outcomes": [
      "Milliyetçilik ve kimlik politikaları kapsamındaki ileri kavram ve yaklaşımları analiz eder.",
      "demokrasi yaklaşımları ile ilişkili kurum ve uygulamaları karşılaştırır.",
      "milliyetçilik ve kimlik siyaseti bağlamındaki veri ve kanıtları yorumlar.",
      "siyasal aktörler ve karar süreçleri için uygun analiz yaklaşımını uygular.",
      "Milliyetçilik ve kimlik politikaları alanındaki sorunlara etik ve kamu yararı odaklı öneriler geliştirir."
    ],
    "weeklyTopics": [
      "Giriş ve Dersin Tanıtımı",
      "Temel Kavramlar: Irk, Etnisite, Ulus, Milliyetçilik",
      "Milliyetçiliğin Temel Teorileri: Primordialist Yaklaşımlar",
      "Modernist Yaklaşımlar",
      "Etno-sembolist Yaklaşımlar",
      "Banal ve Gündelik Milliyetçilik",
      "Etnik ve Sivil Milliyetçilik Ayrımı",
      "Milliyetçilik, Uluslararası İlişkiler ve Devlet Siyaseti",
      "Kimlik Politikaları ve Azınlık Hakları",
      "Göçmen Karşıtlığı ve Yabancı Düşmanlığı",
      "Popülizm ve Milliyetçilik",
      "Milliyetçiliğin Geleceği Tartışması ve Genel Değerlendirme",
      "siyasetin kapsamı ve temel kavramları",
      "iktidar, otorite ve meşruiyet",
      "devlet kuramları"
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
          2,
          1,
          4,
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
          3,
          2,
          5,
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
          3,
          1,
          4,
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
          2,
          2,
          5,
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
          3,
          1,
          4,
          3,
          4,
          3,
          3,
          4,
          3
        ]
      }
    ],
    "sourceUrl": "https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=243732&lang=tr",
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
  },
  {
    "department": "Siyaset Bilimi ve Kamu Yönetimi ABD",
    "programName": "Siyaset Bilimi ve Kamu Yönetimi",
    "level": "Tezsiz Yüksek Lisans",
    "code": "SKY739",
    "name": "Temel hak ve özgürlükler",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Dr. Öğr. Üyesi AHMET BAĞRIAÇIK",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Kamu hukukunun öteden beri en temel meselelerinden birini teşkil eden insan hakları kavramına gerek kuramsal bir çerçeveden gerek güncel gelişmeler ışığında bakmak",
    "content": "İnsan haklarının doğuşu, gelişimi ve günümüzde kazandığı veçhe, hukuksal bir perspektiften ele alınmaktadır. Bu bakımdan öncelikle, insan hakları kavramının doğuşu ve evrimi, Eskiçağ, Ortaçağ ve Aydınlanma Çağında etki bırakan düşünürlerin insan haklarına ilişkin fikirleri ve ortaya attıkları tezler etrafında irdelenmekte; sonrasında ise bilhassa II. Dünya Savaşı sonrası bu kavramın nasıl işlerlik kazandığı meselesi insan haklarına ilişkin ulusal ve uluslararası belgeler dikkate alınarak incelenmektedir. Hukuksal açıdan ise insan hakları mefhumu, temel hak ve özgürlüklerden bağımsız şekilde ele alınamayacağından temel hakların süjeleri, sınıflandırma ve sınırlandırma sistemleri, kullanımındaki usul ve sistemler ile olağanüstü hallerde temel hak ve özgürlüklerin ne şekilde sınırlandırılabileceği benzeri sorunlara bu derste yoğun şekilde değinilmektedir. Ders temelde, bir yandan insan hakları kavramının anlam ve öneminin öğrencilerce kavranmasına hizmet etmekteyken; öte yandan öğrencilere insan hakları hukukuna dair genel bir bakış açısı kazandırma işlevi taşımaktadır.",
    "methods": "Teorik ders anlatımı ve öğrenci sunumu",
    "resources": "Kaynaklar: Kemal Gözler, İnsan Hakları Hukuku, Ekin Yayınevi Münci Kapani, Kamu Hürriyetleri, Yetkin Yayınevi Bülent Tanör, Türkiye'nin İnsan Hakları Sorunu, BDS Yayınları; Dökümanlar: Kemal Gözler, İnsan Hakları Hukuku, Ekin Yayınevi Münci Kapani, Kamu Hürriyetleri, Yetkin Yayınevi Bülent Tanör, Türkiye'nin İnsan Hakları Sorunu, BDS Yayınları",
    "sdgs": [
      "10",
      "16",
      "17"
    ],
    "outcomes": [
      "Temel hak ve özgürlükler kapsamındaki ileri kavram ve yaklaşımları analiz eder.",
      "idarenin sorumluluğu ile ilişkili kurum ve uygulamaları karşılaştırır.",
      "adil yargılanma hakkı bağlamındaki veri ve kanıtları yorumlar.",
      "vergi sistemi ve güncel gelişmeler için uygun analiz yaklaşımını uygular.",
      "Temel hak ve özgürlükler alanındaki sorunlara etik ve kamu yararı odaklı öneriler geliştirir."
    ],
    "weeklyTopics": [
      "İnsan Haklarının Tarihsel ve Düşünsel Gelişimi - I",
      "İnsan Haklarının Tasnifi",
      "Temel Hak ve Hürriyetlerin Özneleri",
      "Temel Hak ve Hürriyetlerin Yükümlüleri",
      "Temel Hak ve Hürriyetlerin Düzenlenmesinde Sistemler",
      "Temel Hak ve Hürriyetlerin Sınırlandırılması",
      "Olağanüstü Hallerde Temel Hak ve Hürriyetlerin Sınırlandırılması",
      "Hak ve Hürriyetlerin Çatışması",
      "Temel Hak ve Hürriyetlerin Kötüye Kullanılması Yasağı",
      "1982 Anayasasında Temel Hak ve Özgürlükler",
      "hukuk devleti ve kamu hukuku ilkeleri",
      "idarenin kuruluşu ve görevleri",
      "idari işlem ve eylemler",
      "idarenin sorumluluğu",
      "temel hak ve özgürlükler"
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
          4,
          1,
          4,
          2,
          2,
          1,
          4,
          4,
          2
        ]
      },
      {
        "outcome": "DÖÇ2",
        "values": [
          5,
          3,
          5,
          2,
          5,
          3,
          3,
          2,
          5,
          5,
          3
        ]
      },
      {
        "outcome": "DÖÇ3",
        "values": [
          4,
          3,
          4,
          1,
          4,
          3,
          3,
          1,
          4,
          4,
          3
        ]
      },
      {
        "outcome": "DÖÇ4",
        "values": [
          5,
          2,
          5,
          2,
          5,
          2,
          2,
          2,
          5,
          5,
          2
        ]
      },
      {
        "outcome": "DÖÇ5",
        "values": [
          4,
          3,
          4,
          1,
          4,
          3,
          3,
          1,
          4,
          4,
          3
        ]
      }
    ],
    "sourceUrl": "https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=243700&lang=tr",
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
  },
  {
    "department": "Siyaset Bilimi ve Kamu Yönetimi ABD",
    "programName": "Siyaset Bilimi ve Kamu Yönetimi",
    "level": "Tezsiz Yüksek Lisans",
    "code": "SKY741",
    "name": "Hukuk ve toplum",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Prof. Dr. MÜJDAT AVCI",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Bu dersin amacı, hukukun toplumsal boyutunu vurgulamak ve bu çerçevede hukuk ile toplumun çok yönlü ilişkisini gözler önüne sermektir.",
    "content": "Hukuk Sistemlerinin Evrimi, Hukuk ve Toplum Teorileri, Hukuk ve Toplum Alanında Güncel Yaklaşımlar, Hukuk ve Sosyal Kontrol, Hukuk ve Sosyal Değişim, Sosyal Değişim Aracı Olarak Hukukun Avantajları ve Sınırları, Hukuk Eliyle Değişime Direnişin Sosyal, Kültürel, Psikolojik ve Ekonomik Nedenleri, Sivil İtaatsizlik, Hukuk ve Mahremiyet-Panopticon Toplumu.",
    "methods": "Anlatım, Soru - Cevap",
    "resources": "Kaynaklar: Vago, S. ve Barkan, E. S. (2018) Law and Society, Routledge, 11. Baskı.Tyler, T. (2006) Why People Obey The Law, Princeton University Press.Lippman, M., (2015) Law and Society, Sage, s. 499-510.Powers, D. S. (2014). Hukuk Toplum ve Kültür, (Çev.: İ. Eriş). Yayınevi: Klasik Yayınları; Ders Notları: Vago, S. ve Barkan, E. S. (2018) Law and Society, Routledge, 11. Baskı.Tyler, T. (2006) Why People Obey The Law, Princeton University Press.Lippman, M., (2015) Law and Society, Sage, s. 499-510.Uzun, E. (2022). Hukuk ve Toplum El Kitabı, Islık Yayınları.Powers, D. S. (2014). Hukuk Toplum ve Kültür, (Çev.: İ. Eriş). Yayınevi: Klasik Yayınları",
    "sdgs": [
      "10",
      "16",
      "17"
    ],
    "outcomes": [
      "Hukuk ve toplum kapsamındaki ileri kavram ve yaklaşımları analiz eder.",
      "idarenin sorumluluğu ile ilişkili kurum ve uygulamaları karşılaştırır.",
      "adil yargılanma hakkı bağlamındaki veri ve kanıtları yorumlar.",
      "vergi sistemi ve güncel gelişmeler için uygun analiz yaklaşımını uygular.",
      "Hukuk ve toplum alanındaki sorunlara etik ve kamu yararı odaklı öneriler geliştirir."
    ],
    "weeklyTopics": [
      "Dersin Amacı ve Planlama: Ders gerekçesi, içeriği, planı ve işleniş biçiminin tanıtılması, ders kaynaklarının tanıtılması, ders çıktılarının önemi hakkında bilgi verilecek.",
      "Hukukun Temel Toplumsal İşlevleri ve Toplum Teorileri",
      "Hukuk Sistemlerinin Evrimi",
      "Hukuk ve Toplum Teorileri",
      "Hukuk ve Toplum Alanında Güncel Yaklaşımlar-İşlevselci Yaklaşım ve Çatışmacı/Marksist Yaklaşım",
      "Hukuk ve Toplum Alanında Güncel Yaklaşımlar-Eleştirel Hukuk Çalışmaları,",
      "Hukuk ve Sosyal Kontrol",
      "Hukuk, Devlet ve İktidar",
      "Hukuk ve Sosyal Değişim",
      "Sosyal Değişim Aracı Olarak Hukukun Avantajları ve Sınırları",
      "Hukuk Eliyle Değişime Direnişin Sosyal, Kültürel, Psikolojik ve Ekonomik Nedenleri- Türk Hukuk Resepsiyonu Örneği",
      "Hukuka Neden Uyarız?",
      "Sivil İtaatsizlik",
      "Hukuk ve Mahremiyet-Panopticon Toplumu",
      "hukuk devleti ve kamu hukuku ilkeleri"
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
          4,
          1,
          4,
          2,
          2,
          1,
          4,
          4,
          2
        ]
      },
      {
        "outcome": "DÖÇ2",
        "values": [
          5,
          3,
          5,
          2,
          5,
          3,
          3,
          2,
          5,
          5,
          3
        ]
      },
      {
        "outcome": "DÖÇ3",
        "values": [
          4,
          3,
          4,
          1,
          4,
          3,
          3,
          1,
          4,
          4,
          3
        ]
      },
      {
        "outcome": "DÖÇ4",
        "values": [
          5,
          2,
          5,
          2,
          5,
          2,
          2,
          2,
          5,
          5,
          2
        ]
      },
      {
        "outcome": "DÖÇ5",
        "values": [
          4,
          3,
          4,
          1,
          4,
          3,
          3,
          1,
          4,
          4,
          3
        ]
      }
    ],
    "sourceUrl": "https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=243734&lang=tr",
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
  },
  {
    "department": "Siyaset Bilimi ve Kamu Yönetimi ABD",
    "programName": "Siyaset Bilimi ve Kamu Yönetimi",
    "level": "Tezsiz Yüksek Lisans",
    "code": "SKY743",
    "name": "İdarenin mali sorumluluğu",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Dr. Öğr. Üyesi CİHAN UZUNÇAYIR",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Bu derste, idarenin mali sorumluluğunun temel ilkeleri ve kuralları incelenmektedir.",
    "content": "1 İdarenin mali sorumluluğunun tarihsel gelişimi 2 İdari kusur kavramı 3 Hizmet kusuru kavramı 4 Hizmet kusuru kavramı ile ilgili yargı kararları 5 Kişisel kusur kavramı 6 Rücu davaları 7 Kişisel kusur kavramı ile ilgili yargı kararları 8 Risk ilkesi 9 Risk ilkesi ile ilgili yargı kararları 10 Fedakarlığın denkleştirilmesi ilkesi 11 Fedakarlığın denkleştirilmesi ilkesi ile ilgili yargı kararları 12 İdarenin mali sorumluluğunun azaltan ya da kaldıran durumlar 13 İdarenin mali sorumluluğunun şartları 14 Zararın tazminine ilişkin genel esaslar",
    "methods": "Teorik ders anlatımı ve öğrenci sunumu",
    "resources": "Kaynaklar: B. AKYILMAZ, M. SEZGİNER, C. KAYA, Açıklamalı İçtihatlı Türk İdari Yargılama Hukuku, Ankara, Savaş, 2019.K. GÖZLER, İdare Hukuku, 2. Cilt, Bursa, Ekin, 3. Baskı, 2019.; Ders Notları: K. GÖZLER, İdare Hukuku, 2. Cilt, Bursa, Ekin, 3. Baskı, 2019.B. AKYILMAZ, M. SEZGİNER, C. KAYA, Açıklamalı İçtihatlı Türk İdari Yargılama Hukuku, Ankara, Savaş, 2019.",
    "sdgs": [
      "10",
      "16",
      "17"
    ],
    "outcomes": [
      "İdarenin mali sorumluluğu kapsamındaki ileri kavram ve yaklaşımları analiz eder.",
      "idarenin sorumluluğu ile ilişkili kurum ve uygulamaları karşılaştırır.",
      "adil yargılanma hakkı bağlamındaki veri ve kanıtları yorumlar.",
      "vergi sistemi ve güncel gelişmeler için uygun analiz yaklaşımını uygular.",
      "İdarenin mali sorumluluğu alanındaki sorunlara etik ve kamu yararı odaklı öneriler geliştirir."
    ],
    "weeklyTopics": [
      "İdarenin mali sorumluluğunun tarihsel gelişimi",
      "İdari kusur kavramı",
      "Hizmet kusuru kavramı",
      "Hizmet kusuru kavramı ile ilgili yargı kararları",
      "Kişisel kusur kavramı",
      "Rücu davaları",
      "Kişisel kusur kavramı ile ilgili yargı kararları",
      "Risk ilkesi",
      "Risk ilkesi ile ilgili yargı kararları",
      "Fedakarlığın denkleştirilmesi ilkesi",
      "hukuk devleti ve kamu hukuku ilkeleri",
      "idarenin kuruluşu ve görevleri",
      "idari işlem ve eylemler",
      "idarenin sorumluluğu",
      "temel hak ve özgürlükler"
    ],
    "assessments": [
      {
        "name": "Uygulama",
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
        "hours": 7,
        "total": 105
      },
      {
        "name": "Yarıyıl Sonu Sınavı Hazırlığı",
        "count": 1,
        "hours": 25,
        "total": 25
      },
      {
        "name": "Kaynak İnceleme ve Akademik Hazırlık",
        "count": 1,
        "hours": 5,
        "total": 5
      }
    ],
    "contributionMatrix": [
      {
        "outcome": "DÖÇ1",
        "values": [
          4,
          2,
          4,
          1,
          4,
          2,
          2,
          1,
          4,
          4,
          2
        ]
      },
      {
        "outcome": "DÖÇ2",
        "values": [
          5,
          3,
          5,
          2,
          5,
          3,
          3,
          2,
          5,
          5,
          3
        ]
      },
      {
        "outcome": "DÖÇ3",
        "values": [
          4,
          3,
          4,
          1,
          4,
          3,
          3,
          1,
          4,
          4,
          3
        ]
      },
      {
        "outcome": "DÖÇ4",
        "values": [
          5,
          2,
          5,
          2,
          5,
          2,
          2,
          2,
          5,
          5,
          2
        ]
      },
      {
        "outcome": "DÖÇ5",
        "values": [
          4,
          3,
          4,
          1,
          4,
          3,
          3,
          1,
          4,
          4,
          3
        ]
      }
    ],
    "sourceUrl": "https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=243735&lang=tr",
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
  },
  {
    "department": "Siyaset Bilimi ve Kamu Yönetimi ABD",
    "programName": "Siyaset Bilimi ve Kamu Yönetimi",
    "level": "Tezsiz Yüksek Lisans",
    "code": "SKY745",
    "name": "İdari yargılama hukuku",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Dr. Öğr. Üyesi AHMET BAĞRIAÇIK",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "İdari yargıya ilişkin temel ilkelerin ve bu alandaki hukuk kurallarının hukuk devleti ilkesi özümsenerek yorumlanmasına yönelik analitik becerilerin aktarılması.",
    "content": "Bu derste, Türk idari yargı sisteminin yapısı ve anayasal kapsamı, idari yargılama usulünün temel ilkeleri, ilk derece mahkemelerinin kararlarına karşı başvurulabilcek kanun yolları ve temyiz usulü incelenmektedir. İptal ve Tam Yargı ( Tazminat ) davalarının unsurları tetkik edilmektedir.",
    "methods": "Konu anlatımı ve öğrenci sunumları",
    "resources": "Kaynaklar: Şeref GÖZÜBÜYÜK, Turgut TAN, İdari Yargılama Hukuku, Turhan Kitabevi, Ankara 2010. DİĞER KAYNAKLAR Turan YILDIRIM, İdari Yargı, Beta, İstanbul 2010.; Ders Notları: -; Dökümanlar: Şeref GÖZÜBÜYÜK, Turgut TAN, İdari Yargılama Hukuku, Turhan Kitabevi, Ankara 2010. Turan YILDIRIM, İdari Yargı, Beta, İstanbul 2010.",
    "sdgs": [
      "10",
      "16",
      "17"
    ],
    "outcomes": [
      "İdari yargılama hukuku kapsamındaki ileri kavram ve yaklaşımları analiz eder.",
      "idarenin sorumluluğu ile ilişkili kurum ve uygulamaları karşılaştırır.",
      "adil yargılanma hakkı bağlamındaki veri ve kanıtları yorumlar.",
      "vergi sistemi ve güncel gelişmeler için uygun analiz yaklaşımını uygular.",
      "İdari yargılama hukuku alanındaki sorunlara etik ve kamu yararı odaklı öneriler geliştirir."
    ],
    "weeklyTopics": [
      "İdari yargı örgütü",
      "İdari yargılamanın amacı",
      "İdari yargının görev alanı",
      "İdari yargılamada dava türleri (iptal davası)",
      "İdari yargılamada dava türleri (tam yargı davası)",
      "İDARİ YARGILAMA USULÜ ve İLKELERİ",
      "İdari yargıda kanun yolları",
      "İdari yargıda kararların uygulanması",
      "Pratik çalışmalar-ders tekrarı",
      "hukuk devleti ve kamu hukuku ilkeleri",
      "idarenin kuruluşu ve görevleri",
      "idari işlem ve eylemler",
      "idarenin sorumluluğu",
      "temel hak ve özgürlükler",
      "idari yargının yapısı"
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
          4,
          1,
          4,
          2,
          2,
          1,
          4,
          4,
          2
        ]
      },
      {
        "outcome": "DÖÇ2",
        "values": [
          5,
          3,
          5,
          2,
          5,
          3,
          3,
          2,
          5,
          5,
          3
        ]
      },
      {
        "outcome": "DÖÇ3",
        "values": [
          4,
          3,
          4,
          1,
          4,
          3,
          3,
          1,
          4,
          4,
          3
        ]
      },
      {
        "outcome": "DÖÇ4",
        "values": [
          5,
          2,
          5,
          2,
          5,
          2,
          2,
          2,
          5,
          5,
          2
        ]
      },
      {
        "outcome": "DÖÇ5",
        "values": [
          4,
          3,
          4,
          1,
          4,
          3,
          3,
          1,
          4,
          4,
          3
        ]
      }
    ],
    "sourceUrl": "https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=243736&lang=tr",
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
  },
  {
    "department": "Siyaset Bilimi ve Kamu Yönetimi ABD",
    "programName": "Siyaset Bilimi ve Kamu Yönetimi",
    "level": "Tezsiz Yüksek Lisans",
    "code": "SKY747",
    "name": "Türk vergi sistemi ve analizi",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Doç. Dr. ONUR UÇAR",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Bu dersin amacı, Türk vergi sisteminin genel yapısının analizi ile ilgili bilgi ve beceri kazandırmak; gelir, harcama ve servet vergilerini yorumlama yeteneği ile donatmak, çeşitli vergilerin analizi ile ilgili muhakeme gücü edindirmektir.",
    "content": "Türk vergi sisteminin genel yapısının analizi, gelir vergisinin yapısı, özellikleri, işleyişi ve gelir vergisinin analizi, gelir vergisi açısından Ar-Ge harcaması, geçici vergi, bağış ve yardımlar), gelir vergisinde vergi güvenlik müesseselerinin incelenmesi, kurumlar vergisinin yapısı, özellikleri, işleyişi ve analizi, kurumlar vergisinde mükellefiyet çeşitleri ve dar mükellef kurumların vergilendirilmesi, katma değer vergisinin yapısı, özellikleri, işleyişi ve Türkiye uygulamasının analizi, özel tüketim vergisinin yapısı, özellikleri, işleyişi ve Türkiye uygulamasının analizi, KDV ve ÖTV’de özel konular (ihracat istisnası, tecil ve terkin uygulamaları), emlak vergisinin yapısı, özellikleri, işleyişi ve analizi, motorlu taşıtlar vergisinin yapısı, özellikleri, işleyişi ve analizi, banka ve sigorta muamale vergisinin yapısı, özellikleri, işleyişi ve analizi, gümrük vergilerinin yapısı, özellikleri, işleyişi ve analizi, diğer vergilerin yapısı, özellikleri, işleyişi ve analizi",
    "methods": "Dersler yüz yüze ve interaktif bir öğretim yöntemiyle yürütülmektedir.",
    "resources": "Kaynaklar: 1. Doğan Şenyüz – Mehmet Yüce – Adnan Gerçek, Türk Vergi Sistemi, Bursa: Ekin Yayınları, 2025. 2. Abdurrahman Akdoğan, Türk Vergi Sistemi, Ankara: Gazi Kitabevi, 2011 3.Nihat Edizdoğan – Ali Çelikkaya, Vergilerin Ekonomik Analizi, Bursa: Dora Yayınları, 2010; Ders Notları: Türk Vergi Sistemi, (Şenyüz, Yüce ve Gerçek), Ekin Kitabevi",
    "sdgs": [
      "10",
      "16",
      "17"
    ],
    "outcomes": [
      "Türk vergi sistemi ve analizi kapsamındaki ileri kavram ve yaklaşımları analiz eder.",
      "idarenin sorumluluğu ile ilişkili kurum ve uygulamaları karşılaştırır.",
      "adil yargılanma hakkı bağlamındaki veri ve kanıtları yorumlar.",
      "vergi sistemi ve güncel gelişmeler için uygun analiz yaklaşımını uygular.",
      "Türk vergi sistemi ve analizi alanındaki sorunlara etik ve kamu yararı odaklı öneriler geliştirir."
    ],
    "weeklyTopics": [
      "Kurumlar vergisinin yapısı, özellikleri, işleyişi ve Türk kurumlar vergisinin analizi",
      "Türk Vergi Sisteminin Genel Yapısının Analizi",
      "Gelir vergisinin yapısı, özellikleri, işleyişi ve Türk gelir Vergisinin analizi",
      "Gelir Vergisinde Özel Konular (Ar-Ge Harcaması, Geçici Vergi, Bağış ve Yardımlar)",
      "Gelir vergisinde vergi güvenlik müesseselerinin incelenmesi",
      "Kurumlar vergisinde mükellefiyet çeşitleri ve dar mükellef kurumların vergilendirilmesi",
      "Katma değer vergisinin yapısı, özellikleri, işleyişi ve Türkiye uygulamasının analizi",
      "Özel tüketim vergisinin yapısı, özellikleri, işleyişi ve Türkiye uygulamasının analizi",
      "KDV ve ÖTV’de özel konular: ihracat istisnası, tecil ve terkin uygulamaları",
      "Emlak vergisinin yapısı, özellikleri, işleyişi ve analizi",
      "Motorlu taşıtlar vergisinin yapısı, özellikleri, işleyişi ve analizi",
      "BSMV’nin yapısı, özellikleri, işleyişi ve analizi",
      "Gümrük vergilerinin yapısı, özellikleri, işleyişi ve analizi",
      "Diğer vergilerin yapısı, özellikleri, işleyişi ve analizi",
      "hukuk devleti ve kamu hukuku ilkeleri"
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
          4,
          1,
          4,
          2,
          2,
          1,
          4,
          4,
          2
        ]
      },
      {
        "outcome": "DÖÇ2",
        "values": [
          5,
          3,
          5,
          2,
          5,
          3,
          3,
          2,
          5,
          5,
          3
        ]
      },
      {
        "outcome": "DÖÇ3",
        "values": [
          4,
          3,
          4,
          1,
          4,
          3,
          3,
          1,
          4,
          4,
          3
        ]
      },
      {
        "outcome": "DÖÇ4",
        "values": [
          5,
          2,
          5,
          2,
          5,
          2,
          2,
          2,
          5,
          5,
          2
        ]
      },
      {
        "outcome": "DÖÇ5",
        "values": [
          4,
          3,
          4,
          1,
          4,
          3,
          3,
          1,
          4,
          4,
          3
        ]
      }
    ],
    "sourceUrl": "https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=295696&lang=tr",
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
  },
  {
    "department": "Siyaset Bilimi ve Kamu Yönetimi ABD",
    "programName": "Siyaset Bilimi ve Kamu Yönetimi",
    "level": "Tezsiz Yüksek Lisans",
    "code": "SKY749",
    "name": "Siyasette güncel sorunlar",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Dr. Öğr. Üyesi CİHAN UZUNÇAYIR",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "“Siyasette Güncel Sorunlar” dersi, öğrencilerin hem uluslararası hem de ulusal ölçekte ortaya çıkan siyasal gelişmeleri eleştirel bir perspektifle değerlendirebilmelerini hedeflemektedir. Ayrıca ders, siyasal süreçlerdeki dönüşümün arka planını anlamaya yönelik teorik yaklaşımlarla güncel gelişmeler arasında köprü kurarak öğrencilerin siyasal analiz yetkinliklerini geliştirmeyi amaçlar.",
    "content": "Popülizm, otoriterleşme ve demokrasi krizi; Küresel eşitsizlikler ve sosyal adalet talepleri; Kimlik siyaseti: Etnik, dini ve cinsiyet temelli talepler; Kutuplaşma ve medya: Algı yönetimi, dezenformasyon ve siyasi manipülasyon; Göç, mülteciler ve siyasal etkileri; Çevre siyaseti: İklim değişikliği, sürdürülebilirlik ve siyasal karar alma; Sosyal hareketlerin dönüşümü: Yeni direniş biçimleri ve dijital aktivizm; Türkiye’de güncel siyasal gelişmeler; Dış politikada dönüşüm ve çoklu kriz yönetimi; Gelecek projeksiyonları: Demokrasi nereye gidiyor?",
    "methods": "Yüz yüze yürütülecek derste anlatım, tartışma ve vaka analizi yöntemleri kullanılacaktır.",
    "resources": "Kaynaklar: Snarr, Michael T. & Snarr, D. Neil (der.) (2021). Introducing Global Issues. 7. baskı. Boulder, CO: Lynne Rienner Publishers.; Ders Notları: Payne, Richard J. Global Issues: Politics, Economics, and Culture. 5. baskı, Pearson, 2016.",
    "sdgs": [
      "4",
      "10",
      "16"
    ],
    "outcomes": [
      "Siyasette güncel sorunlar kapsamındaki ileri kavram ve yaklaşımları analiz eder.",
      "demokrasi yaklaşımları ile ilişkili kurum ve uygulamaları karşılaştırır.",
      "milliyetçilik ve kimlik siyaseti bağlamındaki veri ve kanıtları yorumlar.",
      "siyasal aktörler ve karar süreçleri için uygun analiz yaklaşımını uygular.",
      "Siyasette güncel sorunlar alanındaki sorunlara etik ve kamu yararı odaklı öneriler geliştirir."
    ],
    "weeklyTopics": [
      "Dersin Amacı ve Planlama: Ders gerekçesi, içeriği, planı ve işleniş biçiminin tanıtılması, Ders kaynaklarının tanıtılması, Ders çıktılarının önemi, Ders konularıyla ilgili güncel hususlar.",
      "Güncel tartışma nedir? Siyasette \"güncel\" olanın teorik önemi",
      "Demokratik rejimlerin gerilemesi, seçimli otoriterlik, küresel eğilimler",
      "Popülizmin yükselişi, sağ ve sol popülizmler, liderlik ve temsil sorunları",
      "Kutuplaşma ve medya: Algı yönetimi, dezenformasyon ve siyasi manipülasyon",
      "Göç, mülteciler ve siyasal etkileri",
      "Çevre siyaseti: İklim değişikliği, sürdürülebilirlik ve siyasal karar alma",
      "Sosyal hareketlerin dönüşümü: Yeni direniş biçimleri ve dijital aktivizm",
      "Türkiye’de güncel siyasal gelişmeler I",
      "Türkiye’de güncel siyasal gelişmeler II",
      "Dış politikada dönüşüm ve çoklu kriz yönetimi",
      "Genel Sınav",
      "siyasetin kapsamı ve temel kavramları",
      "iktidar, otorite ve meşruiyet",
      "devlet kuramları"
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
          2,
          1,
          4,
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
          3,
          2,
          5,
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
          3,
          1,
          4,
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
          2,
          2,
          5,
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
          3,
          1,
          4,
          3,
          4,
          3,
          3,
          4,
          3
        ]
      }
    ],
    "sourceUrl": "https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=295698&lang=tr",
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
  },
  {
    "department": "Siyaset Bilimi ve Kamu Yönetimi ABD",
    "programName": "Siyaset Bilimi ve Kamu Yönetimi",
    "level": "Tezsiz Yüksek Lisans",
    "code": "SKY751",
    "name": "Siayset teorisinde temel kavramlar",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Dr. Öğr. Üyesi LEVENT BÖRKLÜOĞLU",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Siyaseti bilimi disiplininin teorik içeriğini inşa eden temel kavramların öğrenciye öğretilmesidir.",
    "content": "Devlet, iktidar, adalet, egemenlik, eşitlik, demokrasi, bağımsızlık, ideoloji, kamuoyu, sivil toplum vb. kavram setleri.",
    "methods": "Yüz yüze anlatım ve tartışma yürütme.",
    "resources": "Kaynaklar: ARDA, Erhan (2003), Sosyal Bilimler El Sözlüğü, ALFA Yayınları: İstanbul.; Ders Notları: HEYWOOD, Andrew (2012), Siyasetin Temel Kavramları, Adres Yayınları: İstanbul.",
    "sdgs": [
      "4",
      "10",
      "16"
    ],
    "outcomes": [
      "Siayset teorisinde temel kavramlar kapsamındaki ileri kavram ve yaklaşımları analiz eder.",
      "demokrasi yaklaşımları ile ilişkili kurum ve uygulamaları karşılaştırır.",
      "milliyetçilik ve kimlik siyaseti bağlamındaki veri ve kanıtları yorumlar.",
      "siyasal aktörler ve karar süreçleri için uygun analiz yaklaşımını uygular.",
      "Siayset teorisinde temel kavramlar alanındaki sorunlara etik ve kamu yararı odaklı öneriler geliştirir."
    ],
    "weeklyTopics": [
      "Devlet",
      "Siyasal İktidar",
      "Adalet",
      "Eşitlik",
      "Bağımsızlık",
      "Egemenlik",
      "Demokrasi",
      "Kamuoyu",
      "Sivil Toplum",
      "Siyasi Parti",
      "İdeoloji",
      "Siyasal Elit",
      "Siyasal Kültür",
      "Meşruiyet",
      "siyasetin kapsamı ve temel kavramları"
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
          2,
          1,
          4,
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
          3,
          2,
          5,
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
          3,
          1,
          4,
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
          2,
          2,
          5,
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
          3,
          1,
          4,
          3,
          4,
          3,
          3,
          4,
          3
        ]
      }
    ],
    "sourceUrl": "https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=295697&lang=tr",
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
  },
  {
    "department": "Siyaset Bilimi ve Kamu Yönetimi ABD",
    "programName": "Siyaset Bilimi ve Kamu Yönetimi",
    "level": "Tezsiz Yüksek Lisans",
    "code": "SKY704",
    "name": "Bilimsel araştırma yöntemleri ve yayın etiği",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Dr. Öğr. Üyesi CİHAN UZUNÇAYIR",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Öğrencinin sosyal bilim araştırma yöntemleri alanındaki ileri kuramsal bilgileri siyasal ve yönetsel sorunların çözümünde kullanmasını sağlamak.",
    "content": "Bilimsel araştırma yöntemleri ve yayın etiği; bilimsel bilgi ve araştırma etiği, araştırma problemi ve soru geliştirme, kuramsal çerçeve oluşturma, literatür tarama ve kaynak değerlendirme, nitel araştırma tasarımları, nicel araştırma tasarımları, örnekleme ve veri toplama, ölçme, geçerlik ve güvenirlik, nitel veri çözümleme, nicel veri çözümleme boyutlarıyla ele alınır.",
    "methods": "Kuramsal anlatım, bilimsel kaynak incelemesi, örnek olay çözümlemesi, karşılaştırmalı analiz ve yapılandırılmış akademik tartışma.",
    "resources": "Ders kapsamına uygun güncel kitaplar, hakemli siyaset bilimi ve kamu yönetimi literatürü, mevzuat, resmi raporlar ve açık veri kaynakları.",
    "sdgs": [
      "4",
      "16",
      "17"
    ],
    "outcomes": [
      "Bilimsel araştırma yöntemleri ve yayın etiği kapsamındaki ileri kavram ve yaklaşımları analiz eder.",
      "literatür tarama ve kaynak değerlendirme ile ilişkili kurum ve uygulamaları karşılaştırır.",
      "ölçme, geçerlik ve güvenirlik bağlamındaki veri ve kanıtları yorumlar.",
      "bulguların yorumlanması için uygun analiz yaklaşımını uygular.",
      "Bilimsel araştırma yöntemleri ve yayın etiği alanındaki sorunlara etik ve kamu yararı odaklı öneriler geliştirir."
    ],
    "weeklyTopics": [
      "bilimsel bilgi ve araştırma etiği",
      "araştırma problemi ve soru geliştirme",
      "kuramsal çerçeve oluşturma",
      "literatür tarama ve kaynak değerlendirme",
      "nitel araştırma tasarımları",
      "nicel araştırma tasarımları",
      "örnekleme ve veri toplama",
      "ölçme, geçerlik ve güvenirlik",
      "nitel veri çözümleme",
      "nicel veri çözümleme",
      "bulguların yorumlanması",
      "bilimsel yazım ve kaynak gösterme",
      "yayın etiği ve araştırma bütünlüğü",
      "araştırma raporunun yapılandırılması",
      "araştırma sonuçlarının bütüncül değerlendirilmesi"
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
          2,
          4,
          2,
          2,
          2,
          1,
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
          5,
          3,
          3,
          3,
          2,
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
          4,
          3,
          3,
          3,
          1,
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
          5,
          2,
          2,
          2,
          2,
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
          4,
          3,
          3,
          3,
          1,
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
        "status": "Doğrulanmalı"
      },
      {
        "item": "Eksik/doğrulanması gereken alan kaldı mı?",
        "status": "Doğrulanmalı"
      }
    ],
    "publicQualityChecklist": false
  },
  {
    "department": "Siyaset Bilimi ve Kamu Yönetimi ABD",
    "programName": "Siyaset Bilimi ve Kamu Yönetimi",
    "level": "Tezsiz Yüksek Lisans",
    "code": "SKY744",
    "name": "Siyasi partiler ve parti sistemleri",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Dr. Öğr. Üyesi CİHAN UZUNÇAYIR",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Öğrencinin siyaset kuramı ve siyasal sistemler alanındaki ileri kuramsal bilgileri siyasal ve yönetsel sorunların çözümünde kullanmasını sağlamak.",
    "content": "Siyasi partiler ve parti sistemleri; siyasetin kapsamı ve temel kavramları, iktidar, otorite ve meşruiyet, devlet kuramları, demokrasi yaklaşımları, siyasal ideolojiler, partiler ve seçim sistemleri, siyasal kültür ve toplumsallaşma, milliyetçilik ve kimlik siyaseti, modernleşme ve siyasal değişim, karşılaştırmalı siyasal sistemler boyutlarıyla ele alınır.",
    "methods": "Kuramsal anlatım, bilimsel kaynak incelemesi, örnek olay çözümlemesi, karşılaştırmalı analiz ve yapılandırılmış akademik tartışma.",
    "resources": "Ders kapsamına uygun güncel kitaplar, hakemli siyaset bilimi ve kamu yönetimi literatürü, mevzuat, resmi raporlar ve açık veri kaynakları.",
    "sdgs": [
      "4",
      "10",
      "16"
    ],
    "outcomes": [
      "Siyasi partiler ve parti sistemleri kapsamındaki ileri kavram ve yaklaşımları analiz eder.",
      "demokrasi yaklaşımları ile ilişkili kurum ve uygulamaları karşılaştırır.",
      "milliyetçilik ve kimlik siyaseti bağlamındaki veri ve kanıtları yorumlar.",
      "siyasal aktörler ve karar süreçleri için uygun analiz yaklaşımını uygular.",
      "Siyasi partiler ve parti sistemleri alanındaki sorunlara etik ve kamu yararı odaklı öneriler geliştirir."
    ],
    "weeklyTopics": [
      "siyasetin kapsamı ve temel kavramları",
      "iktidar, otorite ve meşruiyet",
      "devlet kuramları",
      "demokrasi yaklaşımları",
      "siyasal ideolojiler",
      "partiler ve seçim sistemleri",
      "siyasal kültür ve toplumsallaşma",
      "milliyetçilik ve kimlik siyaseti",
      "modernleşme ve siyasal değişim",
      "karşılaştırmalı siyasal sistemler",
      "siyasal aktörler ve karar süreçleri",
      "Türkiye'de siyasal düşüncenin gelişimi",
      "haklar, özgürlükler ve etik",
      "güncel siyasal tartışmaların analizi",
      "siyasal kuramların bütüncül değerlendirilmesi"
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
          2,
          1,
          4,
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
          3,
          2,
          5,
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
          3,
          1,
          4,
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
          2,
          2,
          5,
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
          3,
          1,
          4,
          3,
          4,
          3,
          3,
          4,
          3
        ]
      }
    ],
    "sourceUrl": "https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=308702&lang=tr",
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
  },
  {
    "department": "Siyaset Bilimi ve Kamu Yönetimi ABD",
    "programName": "Siyaset Bilimi ve Kamu Yönetimi",
    "level": "Tezsiz Yüksek Lisans",
    "code": "SKY746",
    "name": "Devlet şekilleri ve hükümet sistemleri",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Dr. Öğr. Üyesi AHMET BAĞRIAÇIK",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Öğrencilere devletin tarihsel gelişimi, devlet şekilleri ve hükümet sistemleri arasındaki farkları kavratmak; kuvvetler ayrılığı ilkesinin farklı uygulama biçimlerini analiz etme yetisi kazandırmaktır.",
    "content": "Devlet kavramı, egemenlik, monarşi-cumhuriyet ayrımı, üniter ve bileşik devletler, kuvvetler ayrılığı teorisi, parlamenter sistem, başkanlık sistemi, yarı-başkanlık sistemi ve meclis hükümeti sistemi.",
    "methods": "Teorik anlatım ve sınıf içi tartışmalar.",
    "resources": "Kaynaklar: Kemal Gözler, Anayasa Hukukunun Genel EsaslarıErgun Özbudun, Anayasa Hukuku Genel Esaslarİbrahim Kaboğlu, Anayasa Hukuku Dersleri (Genel Esaslar); Ders Notları: -",
    "sdgs": [
      "4",
      "10",
      "16"
    ],
    "outcomes": [
      "Devlet şekilleri ve hükümet sistemleri kapsamındaki ileri kavram ve yaklaşımları analiz eder.",
      "demokrasi yaklaşımları ile ilişkili kurum ve uygulamaları karşılaştırır.",
      "milliyetçilik ve kimlik siyaseti bağlamındaki veri ve kanıtları yorumlar.",
      "siyasal aktörler ve karar süreçleri için uygun analiz yaklaşımını uygular.",
      "Devlet şekilleri ve hükümet sistemleri alanındaki sorunlara etik ve kamu yararı odaklı öneriler geliştirir."
    ],
    "weeklyTopics": [
      "Devlet Kavramı ve Devletin Unsurları",
      "Egemenlik Kaynağına Göre Devlet Şekilleri (Monarşi, Cumhuriyet)",
      "Yapılarına Göre Devlet Şekilleri: Üniter Devlet",
      "Bileşik Devletler: Konfederasyon ve Federasyon",
      "Kuvvetler Ayrılığı Teorisi: Sert ve Yumuşak Ayrım",
      "Parlamenter Sistem: Tanımı, Özellikleri ve Uygulaması",
      "Başkanlık Sistemi: Tanımı, Özellikleri ve ABD Örneği",
      "Yarı-Başkanlık Sistemi: Tanımı ve Fransa Örneği",
      "Meclis Hükümeti Sistemi ve Diğer Karma Sistemler",
      "Hükümet Sistemlerinde Güncel Eğilimler ve Krizler",
      "Türkiye’nin Hükümet Sistemi Serüveni ve Mevcut Durum",
      "siyasetin kapsamı ve temel kavramları",
      "iktidar, otorite ve meşruiyet",
      "devlet kuramları",
      "demokrasi yaklaşımları"
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
          2,
          1,
          4,
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
          3,
          2,
          5,
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
          3,
          1,
          4,
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
          2,
          2,
          5,
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
          3,
          1,
          4,
          3,
          4,
          3,
          3,
          4,
          3
        ]
      }
    ],
    "sourceUrl": "https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=308703&lang=tr",
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
  },
  {
    "department": "Siyaset Bilimi ve Kamu Yönetimi ABD",
    "programName": "Siyaset Bilimi ve Kamu Yönetimi",
    "level": "Tezsiz Yüksek Lisans",
    "code": "SKY748",
    "name": "Vergilendirmede yeni gelişmeler",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Doç. Dr. ONUR UÇAR",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Bu dersin amacı: vergileme alanındaki yeni gelişmeler ile ilgili bilgi ve beceri kazandırmak, Vergi hukukundaki yeni gelişmeleri yorumlama yeteneği ile donatmak, son vergileme düzenlemelerinin yorumlanması ve uygulanması ile ilgili muhakeme gücü edindirmektir.",
    "content": "Vergi hukuku kaynakları içinde yeni düzenleyici işlemlerin değerlendirilmesi, vergileme ile ilgili yeni Anayasa Mahkemesi, Danıştay kararlarının incelenmesi ve değerlendirilmesi, Türkiye Muhasebe Standartları ve Bağımsız Denetimin vergilemeye ilişkin düzenlemelerinin irdelenmesi, Özel Kanunların (TTK, BK vb.) vergilemeye ilişkin düzenlemelerinin incelenmesi, Gelir ve kurumlar vergisinde yeni düzenlemeler: Ar-Ge İstisnası, Ar-Ge Harcaması, Yatırım indirimi vs konularının incelenmesi, Kurumlar vergisinde Örtülü sermaye, Kontrol edilen yabancı kurum kazancı ve Transfer fiyatlandırması konularının değerlendirilmesi, Gelir Vergisi Kanunu'nda yeni vergi güvenlik önlemlerinin ele alınması, Vergi Usul Kanununda getirilen yeni vergi düzenlemelerin incelenmesi ve değerlendirilmesi, Vergi idaresinin ve denetim faaliyetlerinin yeniden yapılandırılmasına yönelik düzenlemelerin değerlendirilmesi, “Ombudsmanlık” kurumunun Türk vergi sistemi içindeki yeri ve rolünün incelenmesi, Dünyada vergi idareleri arasında işbirliği ve bilgi değişimi anlaşmaları ve içeriklerinin incelenmesi.",
    "methods": "Dersler yüz yüze ve interaktif bir öğretim yöntemiyle yürütülmektedir.",
    "resources": "Kaynaklar: 1. Anayasa Mahkemesi ve Danıştay Kararları, en son yayınlanan kararlar. 2. Gelir İdaresi Başkanlığı, Stratejik Planı ve Faaliyet Raporları, Çeşitli Yıllar, www.gib.gov.tr. 3. Şahin Karabulut, Vergi Anlayışı ve Uygulamalarının Biçimsel ve Yapısal Karakterleri: Magna Carta’dan Günümüze Yaşanan Gelişmeler, İstanbul: Legal Yayıncılık, 2020. 4. Mustafa Çolak, Elektronik Vergileme Hukuku, 1.Baskı, İstanbul: Seçkin Yayıncılık, 2020. 5. Coşkun Can Aktan, Ahmet Kesik, Dilek Dileyici, “YENİ” Maliye Değişim Çağında Kamu Maliyesi: Yeni Trendler, Yeni Paradigmalar Yeni Öğretiler, Yeni Perspektifler, Ankara: Maliye Bakanlığı Strateji Geliştirme Başkanlığı, 2012. 6. Yusuf Artar, Dijital Ekonomide Vergilendirme, Finansal Raporlama ve Denetim: Sorunlar ve Çözüm Önerileri, İstanbul: Legal Yayıncılık, 2019. 7. A. Gerçek – M.A. Sarılı – K. Tezcan, 5345 Sayılı Kanun Çerçevesinde Gelir İdaresi ile Vergi Denetiminin Yeniden Yapılandırılmasının Değerlendirilmesi ve Öneriler, Ankara: Gelirler Kontrolörleri De; Ders Notları: Türk Vergi Sistemi (Şenyüz, Yüce, Gerçek, Ekin Yayınevi, 2024), Derse dair güncel kitap, makale ve yargı kararları",
    "sdgs": [
      "10",
      "16",
      "17"
    ],
    "outcomes": [
      "Vergilendirmede yeni gelişmeler kapsamındaki ileri kavram ve yaklaşımları analiz eder.",
      "idarenin sorumluluğu ile ilişkili kurum ve uygulamaları karşılaştırır.",
      "adil yargılanma hakkı bağlamındaki veri ve kanıtları yorumlar.",
      "vergi sistemi ve güncel gelişmeler için uygun analiz yaklaşımını uygular.",
      "Vergilendirmede yeni gelişmeler alanındaki sorunlara etik ve kamu yararı odaklı öneriler geliştirir."
    ],
    "weeklyTopics": [
      "Vergi hukuku kaynakları içinde yeni düzenleyici işlemlerin değerlendirilmesi",
      "Vergileme ile ilgili yeni Anayasa Mahkemesi kararlarının incelenmesi ve değerlendirilmesi",
      "Vergileme ile ilgili yeni Danıştay kararlarının incelenmesi ve değerlendirilmesi",
      "Türkiye Muhasebe Standartları ve Bağımsız Denetimin vergilemeye ilişkin düzenlemeleri",
      "Özel Kanunların (TTK, BK vb.) vergilemeye ilişkin düzenlemelerinin incelenmesi",
      "Kurumlar vergisinde Örtülü sermaye, Kontrol edilen yabancı kurum kazancı ve Transfer fiyatlandırması",
      "Gelir Vergisi Kanununda yeni vergi güvenlik önlemleri: Ortalama FAVÖK Oranı, Asgari Gayrisafi Satış Hasılatı, Gelir ve Gider Bildirimi, Emsal Kira Bedeli",
      "Vergi Usul Kanununda getirilen yeni vergi düzenlemelerin incelenmesi ve değerlendirilmesi",
      "Vergi idaresinin yeniden yapılandırılmasına yönelik düzenlemelerin değerlendirilmesi",
      "Vergi denetiminin yeniden yapılandırılmasına yönelik çalışmaların değerlendirilmesi",
      "“Ombudsmanlık” kurumunun Türk vergi sistemi içindeki yeri ve rolünün incelenmesi",
      "Dünyada vergi idareleri arasında işbirliği ve bilgi değişimi anlaşmaları ve içeriklerinin incelenmesi",
      "Vergi idaresinin otomasyonuna yönelik yeni uygulamaların incelenmesi ve değerlendirilmesi",
      "hukuk devleti ve kamu hukuku ilkeleri",
      "idarenin kuruluşu ve görevleri"
    ],
    "assessments": [
      {
        "name": "Ödev",
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
        "hours": 6.5,
        "total": 97.5
      },
      {
        "name": "Ödev Hazırlığı",
        "count": 1,
        "hours": 8,
        "total": 8
      },
      {
        "name": "Yarıyıl Sonu Sınavı Hazırlığı",
        "count": 1,
        "hours": 25,
        "total": 25
      },
      {
        "name": "Kaynak İnceleme ve Akademik Hazırlık",
        "count": 1,
        "hours": 4.5,
        "total": 4.5
      }
    ],
    "contributionMatrix": [
      {
        "outcome": "DÖÇ1",
        "values": [
          4,
          2,
          4,
          1,
          4,
          2,
          2,
          1,
          4,
          4,
          2
        ]
      },
      {
        "outcome": "DÖÇ2",
        "values": [
          5,
          3,
          5,
          2,
          5,
          3,
          3,
          2,
          5,
          5,
          3
        ]
      },
      {
        "outcome": "DÖÇ3",
        "values": [
          4,
          3,
          4,
          1,
          4,
          3,
          3,
          1,
          4,
          4,
          3
        ]
      },
      {
        "outcome": "DÖÇ4",
        "values": [
          5,
          2,
          5,
          2,
          5,
          2,
          2,
          2,
          5,
          5,
          2
        ]
      },
      {
        "outcome": "DÖÇ5",
        "values": [
          4,
          3,
          4,
          1,
          4,
          3,
          3,
          1,
          4,
          4,
          3
        ]
      }
    ],
    "sourceUrl": "https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=308701&lang=tr",
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
  },
  {
    "department": "Siyaset Bilimi ve Kamu Yönetimi ABD",
    "programName": "Siyaset Bilimi ve Kamu Yönetimi",
    "level": "Tezsiz Yüksek Lisans",
    "code": "SKY750",
    "name": "Kriz yönetimi",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Doç. Dr. DEMET DÖNMEZ",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Bu dersin amacı, kamu kurumları, özel sektör ve sivil toplum kuruluşlarında ortaya çıkabilecek kriz durumlarını önceden öngörebilen, kriz süreçlerini analiz edebilen ve etkili müdahale stratejileri geliştirebilen bireyler yetiştirmektir.",
    "content": "Bu ders, örgütlerde, kamu kurumlarında ve toplum genelinde ortaya çıkabilecek krizlerin nedenlerini, türlerini ve etkilerini ele almaktadır.",
    "methods": "yüz yüze",
    "resources": "Kaynaklar: Kriz Yönetimi-Norman R. Augustine; Ders Notları: Kriz Yönetimi, Kavram, Kuram ve Uygulamalar, Veysel EREN, Nobel Akademik Yayıncılık, 2022.",
    "sdgs": [
      "4",
      "16",
      "17"
    ],
    "outcomes": [
      "Kriz yönetimi kapsamındaki ileri kavram ve yaklaşımları analiz eder.",
      "bürokrasi ve yönetsel davranış ile ilişkili kurum ve uygulamaları karşılaştırır.",
      "yönetişim aktörleri ve katılım bağlamındaki veri ve kanıtları yorumlar.",
      "karar süreçleri ve uygulama sorunları için uygun analiz yaklaşımını uygular.",
      "Kriz yönetimi alanındaki sorunlara etik ve kamu yararı odaklı öneriler geliştirir."
    ],
    "weeklyTopics": [
      "Kriz, kriz yönetimi kavramı, kriz yaratan durumlar",
      "Kriz yönetiminin temel ilkeleri, kriz döngüsü",
      "Türk Kamu Yönetiminde kriz yönetiminin tarihsel gelişimi, kriz yönetimine ilişkin mevzuat",
      "Kriz yönetimi süreçleri ve modelleri",
      "Kriz yönetimi yaklaşımları ve örgütlenmesi",
      "Kriz yönetiminde aktörler ve yönetişim",
      "Örgütlerde risk analizi ve kriz önleme",
      "Kriz planlaması ve kriz eylem planı hazırlama",
      "Kriz iletişimi ilkeleri",
      "Kriz yönetiminde liderlik",
      "Dijital çağda kriz iletişimi",
      "Kriz psikolojisi",
      "Kurumsal kriz yönetimi ve kurumsal itibar",
      "Afet yönetimi ve kamu kurumlarında kriz yönetimi",
      "kamu yönetiminin kapsamı ve temel kavramları"
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
    "sourceUrl": "https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=308700&lang=tr",
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
  },
  {
    "department": "Siyaset Bilimi ve Kamu Yönetimi ABD",
    "programName": "Siyaset Bilimi ve Kamu Yönetimi",
    "level": "Tezsiz Yüksek Lisans",
    "code": "SKY706",
    "name": "Yönetim bilimi",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Doç. Dr. DEMET DÖNMEZ",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Bu dersin amacı, yönetim biliminin kuramsal temellerini, çağdaş yönetsel yaklaşımları ve örgütsel süreçleri ileri düzeyde analiz edebilen, stratejik düşünme ve araştırma yetkinliğine sahip uzmanlar yetiştirmektir.",
    "content": "Yönetim düşüncesinin klasik, neo-klasik ve modern kuramları; örgüt teorileri; yönetsel süreçler ve karar verme mekanizmaları derinlemesine incelenir. Liderlik, motivasyon, örgütsel davranış, örgüt kültürü, çatışma yönetimi ve iletişim gibi yönetsel dinamikler analitik bir çerçevede değerlendirilir.",
    "methods": "Yüz yüze",
    "resources": "Kaynaklar: Baransel, Atilla (1979), Çağdaş Yönetim Düşüncesinin Evrimi; Eryılmaz, Bilal (2011), Kamu Yönetimi, Güncellenmiş ve İlaveli 4. Baskı, Okutman Yayıncılık, Ankara; Tortop, Nuri, Eyüp g. İsbir ve diğerleri (2010), Yönetim Bilimi, Gözden Geçirilmiş 8. Baskı, Nobel Yayın Dağıtım,Ankara. Parlak, Bekir (2011), Yönetim Bilimi ve Çağdaş Yönetim Teknikleri, Beta Yayıncılık, İstanbul. Öztekin, Ali (2010), Yönetim Bilimi, Gözden Geçirilmiş 4. Baskı, Siyasal Kitabevi, Ankara.Tortop, Nuri, Eyüp g. İsbir ve diğerleri (2010), Yönetim Bilimi, Gözden Geçirilmiş 8. Baskı, Nobel Yayın Dağıtım,Ankara. Parlak, Bekir (2011), Yönetim Bilimi ve Çağdaş Yönetim Teknikleri, Beta Yayıncılık, İstanbul. Öztekin, Ali (2010), Yönetim Bilimi, Gözden Geçirilmiş 4. Baskı, Siyasal Kitabevi, Ankara.Tortop, Nuri, Eyüp g. İsbir ve diğerleri (2010), Yönetim Bilimi, Gözden Geçirilmiş 8. Baskı, Nobel Yayın Dağıtım,Ankara. Parlak, Bekir (2011), Yönetim Bilimi ve Çağdaş Yönetim Teknikleri, Beta Yayıncılık, İstanbul. Öztekin, Ali (2010), Yönetim Bilimi, Gözden Geçirilmiş 4. Baskı, Siyasal Kitabevi, Ankara.; Ders Notları: 1. Yönetim Bilimi, Ali Öztekin, Siyasal Kitabevi 2. Yönetim Bilimi İçin Yeni Kavram ve Kuram Önerileri - Editör: Muhammet Hamdi Mücevher (2025), Özgür Yayınları",
    "sdgs": [
      "4",
      "16",
      "17"
    ],
    "outcomes": [
      "Yönetim bilimi kapsamındaki ileri kavram ve yaklaşımları analiz eder.",
      "bürokrasi ve yönetsel davranış ile ilişkili kurum ve uygulamaları karşılaştırır.",
      "yönetişim aktörleri ve katılım bağlamındaki veri ve kanıtları yorumlar.",
      "karar süreçleri ve uygulama sorunları için uygun analiz yaklaşımını uygular.",
      "Yönetim bilimi alanındaki sorunlara etik ve kamu yararı odaklı öneriler geliştirir."
    ],
    "weeklyTopics": [
      "Yönetim biliminin tanımı, kapsamı ve gelişim süreci, yönetim teorilerinin tarihsel evrimi (Klasik–Neo Klasik–Modern Yaklaşımlar)",
      "Sistem yaklaşımı ve yönetimde bütünsel analiz",
      "Karar verme süreçleri ve kantitatif yöntemler",
      "Stratejik yönetim ve kurumsal analiz",
      "Örgütsel yapı, tasarım ve yeniden yapılanma",
      "Liderlik teorileri ve yönetici davranışları",
      "Örgütsel davranış ve motivasyon kuramları",
      "Örgütsel kültür ve iklim",
      "Kamu yönetimi ve özel sektör yönetiminde karşılaştırmalı yaklaşımlar",
      "Politika analizi ve karar destek sistemleri",
      "Yenilik yönetimi ve dijital dönüşüm",
      "Performans yönetimi ve kurumsal yönetim",
      "Değişim yönetimi ve örgütsel dönüşüm",
      "Genel ders değerlendirmesi",
      "kamu yönetiminin kapsamı ve temel kavramları"
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
    "sourceUrl": "https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=243722&lang=tr",
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
  },
  {
    "department": "Siyaset Bilimi ve Kamu Yönetimi ABD",
    "programName": "Siyaset Bilimi ve Kamu Yönetimi",
    "level": "Tezsiz Yüksek Lisans",
    "code": "SKY708",
    "name": "Kamu yönetiminde stratejik planlama",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Prof. Dr. SELİM COŞKUN",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Stratejik düşünme, planlama ve projelendirebilme yeteneğini kamu yöneticilerine kazandırmak, mevzuat düzenlemelerindeki stratejik yaklaşımların farkındalığını sağlamak, analiz etmek amaçlanmaktadır.",
    "content": "Stratejik Planlamanın Kavramsal Çerçevesi, Tarihsel Gelişimi, Stratejik Planlamanın Önemi, Yararları ve Diğer Planlardan Ayrılan Özellikleri Kamu Yönetimi Disiplini ve Stratejik Planlama İlişkisi Türkiye de Kamu Yönetimi Reform Çalışmaları ve Stratejik Planlama İlişkisi Türkiye de Stratejik Plan Olgusunun Yönetsel, Hukuksal ve Finansal Kaynakları Kamu Mali Yönetimi ve Kontrol Kanunu, Kamu İdarelerinde Stratejik Planlamaya İlişkin Usul Ve Esaslar Hakkında Yönetmelik Stratejik Yönetim Araştırması (DPT&TÜİK) Yerel Yönetimler ve Stratejik Planlama (Genel İlkeler, Örnek Uygulamalar) Stratejik Planlama Aşamalar I-Teorik (Durum Analizi-Gelecek Analizi-Temel Değerler) Stratejik Planlama Aşamalar II- Teorik (Amaçlar-Hedefler-Stratejiler-Performans)",
    "methods": "Kuramsal anlatım, bilimsel kaynak incelemesi, örnek olay çözümlemesi, karşılaştırmalı analiz ve yapılandırılmış akademik tartışma.",
    "resources": "Kaynaklar: SONGÜR, Neşe; Kamu Yönetiminde Stratejik Planlama, TODAİE Yayınları, 2011.",
    "sdgs": [
      "4",
      "16",
      "17"
    ],
    "outcomes": [
      "Kamu yönetiminde stratejik planlama kapsamındaki ileri kavram ve yaklaşımları analiz eder.",
      "bürokrasi ve yönetsel davranış ile ilişkili kurum ve uygulamaları karşılaştırır.",
      "yönetişim aktörleri ve katılım bağlamındaki veri ve kanıtları yorumlar.",
      "karar süreçleri ve uygulama sorunları için uygun analiz yaklaşımını uygular.",
      "Kamu yönetiminde stratejik planlama alanındaki sorunlara etik ve kamu yararı odaklı öneriler geliştirir."
    ],
    "weeklyTopics": [
      "Kamu yönetimi ve yerel yönetimlerde dönüşüm ve değişim süreci.",
      "Kamu yönetimi ve yerel yönetimlerde yeni yönetim anlayışı ve bu alandaki reformlar.",
      "Kamu yönetiminde stratejik yönetime geçiş. Bu süreci etkileyen unsurlar ve gereklilikler",
      "Strateji, stratejik yönetim ve stratejik planlama kavramları. Stratejik plan kavramının, plan, politika ve taktik kavramları ile karşılaştırılması",
      "Kamu ve yerel yönetimlerde stratejik planlamanın kanuni dayanakları",
      "kamu yönetiminin kapsamı ve temel kavramları",
      "klasik ve çağdaş yönetim yaklaşımları",
      "kamu örgütlerinin yapısı",
      "bürokrasi ve yönetsel davranış",
      "kamu personel sistemi",
      "stratejik yönetim ve planlama",
      "performans, kalite ve hesap verebilirlik",
      "yönetişim aktörleri ve katılım",
      "idari reform ve kurumsal değişim",
      "kamu hizmetlerinde dijital dönüşüm"
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
    "sourceUrl": "https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=243709&lang=tr",
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
  },
  {
    "department": "Siyaset Bilimi ve Kamu Yönetimi ABD",
    "programName": "Siyaset Bilimi ve Kamu Yönetimi",
    "level": "Tezsiz Yüksek Lisans",
    "code": "SKY710",
    "name": "Türk siyasal hayatı",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Prof. Dr. TURGAY UZUN",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Bu ders, modernleşme sürecinin başladığı 19. Yüzyıl Osmanlı İmparatorluğu’ndan günümüze kadar uzanan bir dönemde, Türkiye siyasetinin temel toplumsal dinamiklerini, temel çatışma eksenlerini, tarihsel süreklilikleri ve kopuşları ve temel sorun alanlarını kuramsal ve tarihsel bir perspektifle analiz etmeyi hedeflemektedir.",
    "content": "“Türk Siyasal Hayatı” dersi 19. yüzyıl Osmanlı İmparatorluğu’ndan bugüne uzanan bir tarihsel dönemi kapsamaktadır. Dersin yapısı ve içeriği tarihsel olguların kronolojik bir anlatımından ziyade söz konusu dönemlerde Osmanlı ve Türkiye toplumlarında modern siyasal iktidar alanının oluşum sürecini sınıf, toplumsal cinsiyet, sosyo-kültürel kimlikler, eksenli iktidar ilişkileri, ideolojileri ve pratikleri ile toplumsal ve siyasal hareketler üzerinden analitik olarak incelemeye yöneliktir. Ders planı ve okumalar Türkiye’de sosyo-politik iktidar ilişkilerini anlamaya yönelik tarihsel-ampirik analizleri olduğu kadar farklı kuramsal yaklaşımları da tartışmaya yöneliktir.",
    "methods": "Kuramsal anlatım, bilimsel kaynak incelemesi, örnek olay çözümlemesi, karşılaştırmalı analiz ve yapılandırılmış akademik tartışma.",
    "resources": "Kaynaklar: Türk Siyasal Hayatı-Yusuf Tekin-Çağatay Okutan; Ders Notları: Ersin KALAYCIOĞLU ve Ali Yaşar SARIBAY, Türk Siyasal Hayatı, SentezYayıncılık, Ankara, 2014.",
    "sdgs": [
      "4",
      "10",
      "16"
    ],
    "outcomes": [
      "Türk siyasal hayatı kapsamındaki ileri kavram ve yaklaşımları analiz eder.",
      "demokrasi yaklaşımları ile ilişkili kurum ve uygulamaları karşılaştırır.",
      "milliyetçilik ve kimlik siyaseti bağlamındaki veri ve kanıtları yorumlar.",
      "siyasal aktörler ve karar süreçleri için uygun analiz yaklaşımını uygular.",
      "Türk siyasal hayatı alanındaki sorunlara etik ve kamu yararı odaklı öneriler geliştirir."
    ],
    "weeklyTopics": [
      "Temel Yaklaşımlar ve Eleştirel Değerlendirmeleri",
      "Osmanlı toplumsal ve Siyasal Yapısı",
      "Osmanlı Modernleşme Süreci",
      "Kurtuluş Savaşı Dönemi",
      "Tek Parti dönemi (1923-1930)",
      "Tek Parti Dönemi (1930-1946)",
      "Çok Partili Hayata Geçiş",
      "Demokrat Parti Dönemi",
      "1960-1970 Dönemi",
      "1970-1980 Dönemi",
      "1980 Sonrası Siyasi Süreç",
      "2000'li Yıllar",
      "Genel Değerlendirme",
      "siyasetin kapsamı ve temel kavramları",
      "iktidar, otorite ve meşruiyet"
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
          2,
          1,
          4,
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
          3,
          2,
          5,
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
          3,
          1,
          4,
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
          2,
          2,
          5,
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
          3,
          1,
          4,
          3,
          4,
          3,
          3,
          4,
          3
        ]
      }
    ],
    "sourceUrl": "https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=243719&lang=tr",
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
  },
  {
    "department": "Siyaset Bilimi ve Kamu Yönetimi ABD",
    "programName": "Siyaset Bilimi ve Kamu Yönetimi",
    "level": "Tezsiz Yüksek Lisans",
    "code": "SKY712",
    "name": "Demokrasi kuramında güncel tartışmalar",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Dr. Öğr. Üyesi AHMET BAĞRIAÇIK",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Bu dersin amacı, demokrasi kuramının tarihsel gelişimini, temel kavramlarını ve çağdaş tartışmalarını eleştirel bir perspektiften inceleyerek öğrencilerin demokratik düşünceye ilişkin kuramsal ve analitik bilgi birikimi kazanmalarını sağlamaktır. Ders, klasik ve çağdaş demokrasi modelleri arasındaki farklılıkları, güncel demokrasi krizlerini, popülizm, katılım, temsil ve meşruiyet gibi konuları disiplinlerarası bir bakışla değerlendirmeyi hedefler.",
    "content": "Bu ders, demokrasinin tarihsel kökenlerinden başlayarak çağdaş siyasal düşünce içindeki konumuna kadar uzanan geniş bir kuramsal çerçeveyi ele almaktadır. Klasik liberal, cumhuriyetçi ve çoğulcu demokrasi modelleri temel alınarak, modern dönemde ortaya çıkan katılımcı ve müzakereci demokrasi yaklaşımlarının kuramsal dayanakları ve uygulamadaki yansımaları incelenir. Ders boyunca popülizm, temsil krizi, demokratik meşruiyetin aşınması, otoriterleşme eğilimleri ve demokratik gerileme gibi güncel siyasal sorunların demokrasi kuramı açısından nasıl kavramsallaştırıldığı tartışılır. Ayrıca dijitalleşme, sosyal medya ve yeni iletişim teknolojilerinin demokrasi üzerindeki etkileri değerlendirilerek, küreselleşmenin yarattığı fırsatlar ve tehditler teorik metinler ve vaka analizleri üzerinden ele alınır. Öğrenciler, hem klasik hem de çağdaş akademik literatürden seçilmiş metinleri tartışarak günümüz dünyasında demokrasinin karşı karşıya olduğu dönüşümleri çok yönlü bir bakış açısıyla analiz etme imkânı bulurlar.",
    "methods": "Konu anlatımı ve öğrenci sunumu",
    "resources": "Kaynaklar: David Held, Models of Democracy, Polity Press, 2006. Frank Cunningham, Theories of Democracy: A Critical Introduction, Routledge, 2002.; Ders Notları: -; Dökümanlar: Gavonni Sartori-Demokrasi teorisine geri dönüş",
    "sdgs": [
      "4",
      "10",
      "16"
    ],
    "outcomes": [
      "Demokrasi kuramında güncel tartışmalar kapsamındaki ileri kavram ve yaklaşımları analiz eder.",
      "demokrasi yaklaşımları ile ilişkili kurum ve uygulamaları karşılaştırır.",
      "milliyetçilik ve kimlik siyaseti bağlamındaki veri ve kanıtları yorumlar.",
      "siyasal aktörler ve karar süreçleri için uygun analiz yaklaşımını uygular.",
      "Demokrasi kuramında güncel tartışmalar alanındaki sorunlara etik ve kamu yararı odaklı öneriler geliştirir."
    ],
    "weeklyTopics": [
      "Klasik modeller",
      "Cumhuriyetçilik",
      "Liberal demokrasi - I",
      "Liberal demokrasi - II",
      "Liberal demokrasi - III",
      "Doğrudan demokrasi",
      "Rekabetçi seçkincilik",
      "Çoğulculuk",
      "Meşruiyet krizi kuramları",
      "Müzakereci demokrasi",
      "Özerklik",
      "Demokrasi ve küresel sistem",
      "Genel değerlendirme",
      "siyasetin kapsamı ve temel kavramları",
      "iktidar, otorite ve meşruiyet"
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
          2,
          1,
          4,
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
          3,
          2,
          5,
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
          3,
          1,
          4,
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
          2,
          2,
          5,
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
          3,
          1,
          4,
          3,
          4,
          3,
          3,
          4,
          3
        ]
      }
    ],
    "sourceUrl": "https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=243706&lang=tr",
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
  },
  {
    "department": "Siyaset Bilimi ve Kamu Yönetimi ABD",
    "programName": "Siyaset Bilimi ve Kamu Yönetimi",
    "level": "Tezsiz Yüksek Lisans",
    "code": "SKY714",
    "name": "RETORİKSEL İNCELEMELER ve SÖYLEM KURAMLARI",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Atama Bekliyor",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Öğrencinin siyasal iletişim ve medya alanındaki ileri kuramsal bilgileri siyasal ve yönetsel sorunların çözümünde kullanmasını sağlamak.",
    "content": "RETORİKSEL İNCELEMELER ve SÖYLEM KURAMLARI; iletişim ve siyaset ilişkisinin kavramsal temelleri, kamusal alan ve kamuoyu, medya sistemleri ve siyasal aktörler, retorik ve ikna kuramları, propaganda modelleri, söylem çözümleme yaklaşımları, kurumsal iletişim ve itibar, dijital medya ve siyasal katılım, nefret söylemi ve ayrımcılık, kriz iletişimi boyutlarıyla ele alınır.",
    "methods": "Kuramsal anlatım, bilimsel kaynak incelemesi, örnek olay çözümlemesi, karşılaştırmalı analiz ve yapılandırılmış akademik tartışma.",
    "resources": "Ders kapsamına uygun güncel kitaplar, hakemli siyaset bilimi ve kamu yönetimi literatürü, mevzuat, resmi raporlar ve açık veri kaynakları.",
    "sdgs": [
      "4",
      "10",
      "16"
    ],
    "outcomes": [
      "RETORİKSEL İNCELEMELER ve SÖYLEM KURAMLARI kapsamındaki ileri kavram ve yaklaşımları analiz eder.",
      "retorik ve ikna kuramları ile ilişkili kurum ve uygulamaları karşılaştırır.",
      "dijital medya ve siyasal katılım bağlamındaki veri ve kanıtları yorumlar.",
      "iletişim kampanyalarının çözümlemesi için uygun analiz yaklaşımını uygular.",
      "RETORİKSEL İNCELEMELER ve SÖYLEM KURAMLARI alanındaki sorunlara etik ve kamu yararı odaklı öneriler geliştirir."
    ],
    "weeklyTopics": [
      "iletişim ve siyaset ilişkisinin kavramsal temelleri",
      "kamusal alan ve kamuoyu",
      "medya sistemleri ve siyasal aktörler",
      "retorik ve ikna kuramları",
      "propaganda modelleri",
      "söylem çözümleme yaklaşımları",
      "kurumsal iletişim ve itibar",
      "dijital medya ve siyasal katılım",
      "nefret söylemi ve ayrımcılık",
      "kriz iletişimi",
      "iletişim kampanyalarının çözümlemesi",
      "medya metinlerinin karşılaştırılması",
      "ifade özgürlüğü ve iletişim etiği",
      "güncel iletişim örneklerinin değerlendirilmesi",
      "siyasal iletişim süreçlerinin bütüncül analizi"
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
          2,
          1,
          2,
          2,
          4,
          4,
          2,
          4,
          4
        ]
      },
      {
        "outcome": "DÖÇ2",
        "values": [
          3,
          5,
          3,
          2,
          3,
          3,
          5,
          5,
          3,
          5,
          5
        ]
      },
      {
        "outcome": "DÖÇ3",
        "values": [
          3,
          4,
          3,
          1,
          3,
          3,
          4,
          4,
          3,
          4,
          4
        ]
      },
      {
        "outcome": "DÖÇ4",
        "values": [
          2,
          5,
          2,
          2,
          2,
          2,
          5,
          5,
          2,
          5,
          5
        ]
      },
      {
        "outcome": "DÖÇ5",
        "values": [
          3,
          4,
          3,
          1,
          3,
          3,
          4,
          4,
          3,
          4,
          4
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
        "status": "Doğrulanmalı"
      },
      {
        "item": "Eksik/doğrulanması gereken alan kaldı mı?",
        "status": "Doğrulanmalı"
      }
    ],
    "publicQualityChecklist": false
  },
  {
    "department": "Siyaset Bilimi ve Kamu Yönetimi ABD",
    "programName": "Siyaset Bilimi ve Kamu Yönetimi",
    "level": "Tezsiz Yüksek Lisans",
    "code": "SKY716",
    "name": "NEFRET SÖYLEMİ ve MEDYA",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Doç. Dr. AYŞE ASLI SEZGİN",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Türkiye'de de, özellikle kimlik ve sınıf temelli sosyal dinamiklerin yeniden aktif hale gelmeye başladığı son yıllarda, ayrımcılıkla ve nefret söylemiyle ilgili tartışmalar artmış, konu azımsanmayacak bir akademik ilgiye mazhar olmuştur. Bu dersin temel amacı, öğrencilerin, özellikle medya yoluyla üretilen/yeniden üretilen nefret söylemi konusunda farkındalığını oluşturmak ve/veya yükseltmek, medya içeriğini bu bağlamda analiz edebilme becerisini geliştirmek ve en önemlisi, üretim sürecinde daha duyarlı bir yaklaşım sergileyebilmelerine yardımcı olmaktır.",
    "content": "Bu derste öncelikle öğrencilere ayrımcılık ve nefret söylemi kavramları örneklerle tanıtılacak ve bu olguların ortaya çıkma, meşrulaştırılma ve gelişme süreçleri sosyal psikolojik bir bağlamda ele alınacaktır. Daha sonra ayrımcılık, nefret söylemi, nefret suçu, hoşgörü/hoşgörüsüzlük, ifade özgürlüğü ve sınırları gibi kavramlar derinlemesine irdelenecek ve bu kavramların birbirleriyle olan ilişkileri tartışılacaktır. Dersin ilerleyen haftalarında medya ve nefret söylemi arasındaki ilişki öncelikle dil-söylem-anlamın yeniden üretimi bağlamında ele alınacak; daha sonra habercilik, sinema, belgesel, reklam, televizyon, internet gibi mecralar ve alternatif medya ortamları incelenecek, örnekler üzerinde derinlemesine analizler yapılacaktır. Dersin sonunda ise ayrımcılıkla ve nefret söylemiyle mücadele için yapılabilecekler; ayrımcılığın zihinsel arkaplanıyla mücadele yöntemleri, ayrımcılığın görünür kılınması gibi alt başlıklarla tartışılacaktır.",
    "methods": "Kuramsal anlatım, bilimsel kaynak incelemesi, örnek olay çözümlemesi, karşılaştırmalı analiz ve yapılandırılmış akademik tartışma.",
    "resources": "Kaynaklar: Siyasal Nefret Söylemi; Ders Notları: Nefret Söylemi ve Medya",
    "sdgs": [
      "4",
      "10",
      "16"
    ],
    "outcomes": [
      "NEFRET SÖYLEMİ ve MEDYA kapsamındaki ileri kavram ve yaklaşımları analiz eder.",
      "retorik ve ikna kuramları ile ilişkili kurum ve uygulamaları karşılaştırır.",
      "dijital medya ve siyasal katılım bağlamındaki veri ve kanıtları yorumlar.",
      "iletişim kampanyalarının çözümlemesi için uygun analiz yaklaşımını uygular.",
      "NEFRET SÖYLEMİ ve MEDYA alanındaki sorunlara etik ve kamu yararı odaklı öneriler geliştirir."
    ],
    "weeklyTopics": [
      "iletişim ve siyaset ilişkisinin kavramsal temelleri",
      "kamusal alan ve kamuoyu",
      "medya sistemleri ve siyasal aktörler",
      "retorik ve ikna kuramları",
      "propaganda modelleri",
      "söylem çözümleme yaklaşımları",
      "kurumsal iletişim ve itibar",
      "dijital medya ve siyasal katılım",
      "nefret söylemi ve ayrımcılık",
      "kriz iletişimi",
      "iletişim kampanyalarının çözümlemesi",
      "medya metinlerinin karşılaştırılması",
      "ifade özgürlüğü ve iletişim etiği",
      "güncel iletişim örneklerinin değerlendirilmesi",
      "siyasal iletişim süreçlerinin bütüncül analizi"
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
          2,
          1,
          2,
          2,
          4,
          4,
          2,
          4,
          4
        ]
      },
      {
        "outcome": "DÖÇ2",
        "values": [
          3,
          5,
          3,
          2,
          3,
          3,
          5,
          5,
          3,
          5,
          5
        ]
      },
      {
        "outcome": "DÖÇ3",
        "values": [
          3,
          4,
          3,
          1,
          3,
          3,
          4,
          4,
          3,
          4,
          4
        ]
      },
      {
        "outcome": "DÖÇ4",
        "values": [
          2,
          5,
          2,
          2,
          2,
          2,
          5,
          5,
          2,
          5,
          5
        ]
      },
      {
        "outcome": "DÖÇ5",
        "values": [
          3,
          4,
          3,
          1,
          3,
          3,
          4,
          4,
          3,
          4,
          4
        ]
      }
    ],
    "sourceUrl": "https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=243715&lang=tr",
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
  },
  {
    "department": "Siyaset Bilimi ve Kamu Yönetimi ABD",
    "programName": "Siyaset Bilimi ve Kamu Yönetimi",
    "level": "Tezsiz Yüksek Lisans",
    "code": "SKY718",
    "name": "Türkiye'de asker-siyaset ilişkileri",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Dr. Öğr. Üyesi LEVENT BÖRKLÜOĞLU",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Ordunun Türk siyasetindeki gücü ve önemi hakkında öğrenciyi analiz yapmayı sağlayacak bilgi ve kuramsal araçlarla donatmaktır.",
    "content": "Osmanlı İmparatorluğunda ordu ve siyaset, tek parti döneminde ordu ve, siyaset, çok partili hayata geçişte ordu ve siyaset, askeri darbeler.",
    "methods": "Kuramsal anlatım, bilimsel kaynak incelemesi, örnek olay çözümlemesi, karşılaştırmalı analiz ve yapılandırılmış akademik tartışma.",
    "resources": "Kaynaklar: William Hale, Türkiye'de Ordu ve Siyaset, (Çev. Ahmet Fethi), Alfa Yayınları, İstanbul, 2014.Levent Börklüoğlu, Erken Cumhuriyetten Çok Partili Hayata Geçişte Türkiye'de Asker ve İdeoloji, Kriter Yayınları, İstanbul, 2018.; Dökümanlar: Kemal Karpat, Osmanlıdan Günümüze Asker ve Siyaset, Timaş Yayınları, İstanbul, 2015.",
    "sdgs": [
      "4",
      "10",
      "16"
    ],
    "outcomes": [
      "Türkiye'de asker-siyaset ilişkileri kapsamındaki ileri kavram ve yaklaşımları analiz eder.",
      "demokrasi yaklaşımları ile ilişkili kurum ve uygulamaları karşılaştırır.",
      "milliyetçilik ve kimlik siyaseti bağlamındaki veri ve kanıtları yorumlar.",
      "siyasal aktörler ve karar süreçleri için uygun analiz yaklaşımını uygular.",
      "Türkiye'de asker-siyaset ilişkileri alanındaki sorunlara etik ve kamu yararı odaklı öneriler geliştirir."
    ],
    "weeklyTopics": [
      "Osmanlı İmparatorluğunda Ordu Teşkilatlanması",
      "Osmanlı İmparatorluğunda Askeri Modernleşme Hareketleri",
      "Osmanlı İmparatorluğunda Askeri Okullar",
      "Tek Parti Döneminde Ordu ve Siyaset",
      "Demokrat Parti Döneminde Ordu ve Siyaset",
      "27 Mayıs 1960 Askeri Darbesi",
      "Albay Talat Aydemir'in Askeri Darbe Girişimleri",
      "Sol Siyasetin Ordu ile İlişkisi: Yön/Devrim Hareketi",
      "Ara snıav",
      "12 Mart 1971 Askeri Muhtırası",
      "12 Eylül 1980 Askeri Darbesi",
      "28 Şubat 1997 Askeri Muhtırası",
      "Adalet ve Kalkınma Partisi Döneminde Ordu ve Siyaset",
      "15 Temmuz 2016 Askeri Darbe Girişimi ve Sonuçları",
      "siyasetin kapsamı ve temel kavramları"
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
          2,
          1,
          4,
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
          3,
          2,
          5,
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
          3,
          1,
          4,
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
          2,
          2,
          5,
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
          3,
          1,
          4,
          3,
          4,
          3,
          3,
          4,
          3
        ]
      }
    ],
    "sourceUrl": "https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=243720&lang=tr",
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
  },
  {
    "department": "Siyaset Bilimi ve Kamu Yönetimi ABD",
    "programName": "Siyaset Bilimi ve Kamu Yönetimi",
    "level": "Tezsiz Yüksek Lisans",
    "code": "SKY720",
    "name": "AB ve TÜRKİYE'DE YERELLEŞME ve YEREL YÖNETİML...",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Atama Bekliyor",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Öğrencinin yerel yönetimler, kent ve kamu politikası alanındaki ileri kuramsal bilgileri siyasal ve yönetsel sorunların çözümünde kullanmasını sağlamak.",
    "content": "AB ve TÜRKİYE'DE YERELLEŞME ve YEREL YÖNETİML...; yerel yönetimlerin temel kavramları, yerel yönetim sistemlerinin gelişimi, merkez-yerel ilişkileri, yerel mali yapı ve kaynaklar, kentleşme dinamikleri, çevre sorunları ve politikaları, yerelleşme ve çok düzeyli yönetişim, sivil toplum ve katılım, kamu politikası süreci, politika aktörleri ve araçları boyutlarıyla ele alınır.",
    "methods": "Kuramsal anlatım, bilimsel kaynak incelemesi, örnek olay çözümlemesi, karşılaştırmalı analiz ve yapılandırılmış akademik tartışma.",
    "resources": "Ders kapsamına uygun güncel kitaplar, hakemli siyaset bilimi ve kamu yönetimi literatürü, mevzuat, resmi raporlar ve açık veri kaynakları.",
    "sdgs": [
      "10",
      "11",
      "16"
    ],
    "outcomes": [
      "AB ve TÜRKİYE'DE YERELLEŞME ve YEREL YÖNETİML... kapsamındaki ileri kavram ve yaklaşımları analiz eder.",
      "yerel mali yapı ve kaynaklar ile ilişkili kurum ve uygulamaları karşılaştırır.",
      "sivil toplum ve katılım bağlamındaki veri ve kanıtları yorumlar.",
      "karşılaştırmalı yerel yönetim örnekleri için uygun analiz yaklaşımını uygular.",
      "AB ve TÜRKİYE'DE YERELLEŞME ve YEREL YÖNETİML... alanındaki sorunlara etik ve kamu yararı odaklı öneriler geliştirir."
    ],
    "weeklyTopics": [
      "yerel yönetimlerin temel kavramları",
      "yerel yönetim sistemlerinin gelişimi",
      "merkez-yerel ilişkileri",
      "yerel mali yapı ve kaynaklar",
      "kentleşme dinamikleri",
      "çevre sorunları ve politikaları",
      "yerelleşme ve çok düzeyli yönetişim",
      "sivil toplum ve katılım",
      "kamu politikası süreci",
      "politika aktörleri ve araçları",
      "karşılaştırmalı yerel yönetim örnekleri",
      "politika uygulama ve değerlendirme",
      "sürdürülebilirlik ve kamu yararı",
      "güncel yerel sorunların analizi",
      "yerel politika seçeneklerinin bütüncül değerlendirilmesi"
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
          4,
          1,
          4,
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
          3,
          5,
          2,
          5,
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
          3,
          4,
          1,
          4,
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
          2,
          5,
          2,
          5,
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
          3,
          4,
          1,
          4,
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
        "status": "Doğrulanmalı"
      },
      {
        "item": "Eksik/doğrulanması gereken alan kaldı mı?",
        "status": "Doğrulanmalı"
      }
    ],
    "publicQualityChecklist": false
  },
  {
    "department": "Siyaset Bilimi ve Kamu Yönetimi ABD",
    "programName": "Siyaset Bilimi ve Kamu Yönetimi",
    "level": "Tezsiz Yüksek Lisans",
    "code": "SKY722",
    "name": "Postmodern dönemde kamu yönetimi",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Prof. Dr. MEHMET BURHANETTİN COŞKUN",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Modern, modernite, post modernite kavramlarının çözümlenmesi. Modern siyasal düşünceden post modern siyasal düşünceye geçişin nedenlerinin sorgulanması",
    "content": "Modern devlet, post modern devlet ikileminin değerlendirilmesi ve kamu yönetimlerinin bu bağlamda yeniden sorgulanması. Post- modern devlet ve kamu yönetiminin işlevleri, farklılıkları ve getirdiği değişimler çerçevesinde ayrıntılı olarak incelenmesi. Yeni kamu işletmeciliği ve yönetişim ile ilgili yeni yönetim anlayışının irdelenmesi. Türkiye’de post-modern kamu yönetimi ve yeni yönetim süreçlerinin eleştirel bir gözle değerlendirilmesi.",
    "methods": "Yüz Yüze",
    "resources": "Kaynaklar: Kamu Yönetiminde Çağdaş Yaklaşımlar,Seçkin Yayınları,2. Baskı,Ankara,2008.; Ders Notları: Tom Christensen and Per Laegreid,Trancending New Public Management: The Transformation of Public Sector Reforms,Ashgate,2007.ISBN:978-0754670711 B-Referanslar: Ewan Ferlie,Laurence E.Lynn,Christopher Pollitt,The Oxford Handbook of Public Management,Oxford University Pres,2007,ISBN:978-0199226443. Ed:Eran Vigoda,Public Administration an Interdisciplinary Critical Analysis,Marcel Deliker Inc,2002. H.George Frederichson,Kevin B. Smith,The Public Administration Theory Primer,Westviev Pres,2003. Jan-Erik Lane, New Public Management,Routledge,2000. H.George Frederichson,The Spirit of Public Administration,Jossey-Bass Publishers,1997. Charles J.Fox,Hugt T.Miller,Post-Modern Public Administration,Sage Publications,1996. Abdullah Yılmaz,Yavuz Bozkurt, Küresel Esintiler ve Yerel Etkiler SarmalındaTürk Kamu Yönetimi,Gazi Kitabevi,2007. Muhittin Acar ,Hüseyin Özgür,Çağdaş Kamı Yönetimi I-II,Nobel Yayın Dağıtım,2003. Hamza Al,Yeni Kamu Yönetimi,Değişim Yayınları,2008. Bekir Parlak,Kamu Yönetiminde Yeni Vizyonlar.Turhan Kitabevi,2008. Abdullah Yılmaz,Mustafa Ökmen,Kmu Yönetimi,Gazi Kitabevi. Ed: Asım Balcı,Ahmet Nohutçu,Namık Kemal Öztürk,Bayram Coşkun,Kamu Yönetiminde Çağdaş Yaklaşımlar,Seçkin Yayınları,2. Baskı,Ankar,2008.",
    "sdgs": [
      "4",
      "16",
      "17"
    ],
    "outcomes": [
      "Postmodern dönemde kamu yönetimi kapsamındaki ileri kavram ve yaklaşımları analiz eder.",
      "bürokrasi ve yönetsel davranış ile ilişkili kurum ve uygulamaları karşılaştırır.",
      "yönetişim aktörleri ve katılım bağlamındaki veri ve kanıtları yorumlar.",
      "karar süreçleri ve uygulama sorunları için uygun analiz yaklaşımını uygular.",
      "Postmodern dönemde kamu yönetimi alanındaki sorunlara etik ve kamu yararı odaklı öneriler geliştirir."
    ],
    "weeklyTopics": [
      "Modernite ve Modernizm",
      "Modernden Post-Moderne Siyasal Düşüncenin Evrimi",
      "Modern Devletten Post-Modern Devlete Yönetim Teorilerinde Dönüşüm",
      "Post-Modern Devlet ve Kamu Yönetimi",
      "Post-Modern Kamu Yönetiminin Öncülleri ve Kritiği",
      "Yeni Kamu İşletmeciliği",
      "Yeni Yönetim Teorisi: Yönetişim",
      "Post-Modern Kamu Yönetimi ve Dünya Örnekleri",
      "Türkiye’de Post-Modern Kamu Yönetiminin Yansımaları ve Reform Hareketleri",
      "Post-Modern Dönemde Türkiye’de Yeni Kamu Yönetimi Anlayışı ve Uygulamaları",
      "Yönetsel Reformların Çıktıları ve Eleştiriler",
      "kamu yönetiminin kapsamı ve temel kavramları",
      "klasik ve çağdaş yönetim yaklaşımları",
      "kamu örgütlerinin yapısı",
      "bürokrasi ve yönetsel davranış"
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
    "sourceUrl": "https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=243716&lang=tr",
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
  },
  {
    "department": "Siyaset Bilimi ve Kamu Yönetimi ABD",
    "programName": "Siyaset Bilimi ve Kamu Yönetimi",
    "level": "Tezsiz Yüksek Lisans",
    "code": "SKY724",
    "name": "Karşılaştırmalı kamu politikası",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Prof. Dr. MEHMET BURHANETTİN COŞKUN",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Öğrencinin yerel yönetimler, kent ve kamu politikası alanındaki ileri kuramsal bilgileri siyasal ve yönetsel sorunların çözümünde kullanmasını sağlamak.",
    "content": "Karşılaştırmalı kamu politikası; yerel yönetimlerin temel kavramları, yerel yönetim sistemlerinin gelişimi, merkez-yerel ilişkileri, yerel mali yapı ve kaynaklar, kentleşme dinamikleri, çevre sorunları ve politikaları, yerelleşme ve çok düzeyli yönetişim, sivil toplum ve katılım, kamu politikası süreci, politika aktörleri ve araçları boyutlarıyla ele alınır.",
    "methods": "Kuramsal anlatım, bilimsel kaynak incelemesi, örnek olay çözümlemesi, karşılaştırmalı analiz ve yapılandırılmış akademik tartışma.",
    "resources": "Ders kapsamına uygun güncel kitaplar, hakemli siyaset bilimi ve kamu yönetimi literatürü, mevzuat, resmi raporlar ve açık veri kaynakları.",
    "sdgs": [
      "10",
      "11",
      "16"
    ],
    "outcomes": [
      "Karşılaştırmalı kamu politikası kapsamındaki ileri kavram ve yaklaşımları analiz eder.",
      "yerel mali yapı ve kaynaklar ile ilişkili kurum ve uygulamaları karşılaştırır.",
      "sivil toplum ve katılım bağlamındaki veri ve kanıtları yorumlar.",
      "karşılaştırmalı yerel yönetim örnekleri için uygun analiz yaklaşımını uygular.",
      "Karşılaştırmalı kamu politikası alanındaki sorunlara etik ve kamu yararı odaklı öneriler geliştirir."
    ],
    "weeklyTopics": [
      "yerel yönetimlerin temel kavramları",
      "yerel yönetim sistemlerinin gelişimi",
      "merkez-yerel ilişkileri",
      "yerel mali yapı ve kaynaklar",
      "kentleşme dinamikleri",
      "çevre sorunları ve politikaları",
      "yerelleşme ve çok düzeyli yönetişim",
      "sivil toplum ve katılım",
      "kamu politikası süreci",
      "politika aktörleri ve araçları",
      "karşılaştırmalı yerel yönetim örnekleri",
      "politika uygulama ve değerlendirme",
      "sürdürülebilirlik ve kamu yararı",
      "güncel yerel sorunların analizi",
      "yerel politika seçeneklerinin bütüncül değerlendirilmesi"
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
          4,
          1,
          4,
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
          3,
          5,
          2,
          5,
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
          3,
          4,
          1,
          4,
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
          2,
          5,
          2,
          5,
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
          3,
          4,
          1,
          4,
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
        "status": "Doğrulanmalı"
      },
      {
        "item": "Eksik/doğrulanması gereken alan kaldı mı?",
        "status": "Doğrulanmalı"
      }
    ],
    "publicQualityChecklist": false
  },
  {
    "department": "Siyaset Bilimi ve Kamu Yönetimi ABD",
    "programName": "Siyaset Bilimi ve Kamu Yönetimi",
    "level": "Tezsiz Yüksek Lisans",
    "code": "SKY726",
    "name": "Dünyada ve türkiye'de sivil toplum",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Dr. Öğr. Üyesi FATİH ÇELİK",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Sivil toplum üzerine temel kuramsal tartışmaları tanımlayabilmek.Dünyadaki sivil toplum gelişimini örneklendirmek.Türkiye’deki sivil toplumun gelişimine tarihsel perspektiften bakabilmek.Sivil toplum kuruluşları ve aktörlerini tanımak.",
    "content": "Devlet ve toplum arasındaki ilişkiyi Türkiye ve Dünya perspektifinde ele alan bu derste sivil topluma dair temel kavramlar tanıtılacaktır. Özel alan, kamusal alan, kimlik, ulus, milliyetçilik, çok kültürlülük ve etnisite kavramları etrafında Türkiye siyasal ve toplumsal hayatı işlenecektir. Osmanlı tarihinden günümüze kadar olan süreçte sivil toplumun gelişimi aktarılacaktır.",
    "methods": "Ders, yüz yüze anlatım ve öğrenci sunumlarıyla yürütülmektedir.",
    "resources": "Kaynaklar: Refractions of Civil Society in Turkey, Daniella Kuzmanovic, Palgrave, 1st Edition, 2012.; Ders Notları: Refractions of Civil Society in Turkey, Daniella Kuzmanovic, Palgrave, 1st Edition, 2012.",
    "sdgs": [
      "10",
      "11",
      "16"
    ],
    "outcomes": [
      "Dünyada ve türkiye'de sivil toplum kapsamındaki ileri kavram ve yaklaşımları analiz eder.",
      "yerel mali yapı ve kaynaklar ile ilişkili kurum ve uygulamaları karşılaştırır.",
      "sivil toplum ve katılım bağlamındaki veri ve kanıtları yorumlar.",
      "karşılaştırmalı yerel yönetim örnekleri için uygun analiz yaklaşımını uygular.",
      "Dünyada ve türkiye'de sivil toplum alanındaki sorunlara etik ve kamu yararı odaklı öneriler geliştirir."
    ],
    "weeklyTopics": [
      "Giriş",
      "Sivil Toplum Kavramının Analizi",
      "Siyasal Kuramda Sivil Toplum Üzerine Farklı Yaklaşımlar",
      "Liberal ve Sosyalist Toplumlarda Sivil Toplum",
      "Küreselleşme ve Sivil Toplum",
      "Postmodernite, Sivil Toplum ve Din",
      "Modernleşme, Sivil Toplum ve Tarihsel Yaklaşım",
      "Tek Parti Döneminde Türkiye’de Sivil Toplum",
      "Demokrasiye Geçiş ve Sivil Toplumun Gelişmesi",
      "Türkiye’de Kadın Hareketi ve Kadın Sivil Toplum Kuruluşları",
      "Din, Kültürel Farklılık ve Sivil Toplum",
      "Sivil Toplum ve Kamusal Alan",
      "yerel yönetimlerin temel kavramları",
      "yerel yönetim sistemlerinin gelişimi",
      "merkez-yerel ilişkileri"
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
          4,
          1,
          4,
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
          3,
          5,
          2,
          5,
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
          3,
          4,
          1,
          4,
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
          2,
          5,
          2,
          5,
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
          3,
          4,
          1,
          4,
          3,
          4,
          3,
          3,
          4,
          3
        ]
      }
    ],
    "sourceUrl": "https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=243707&lang=tr",
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
  },
  {
    "department": "Siyaset Bilimi ve Kamu Yönetimi ABD",
    "programName": "Siyaset Bilimi ve Kamu Yönetimi",
    "level": "Tezsiz Yüksek Lisans",
    "code": "SKY728",
    "name": "KENTLEŞME ve ÇEVRE SORUNLARI",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Prof. Dr. SUSRAN ERKAN EROĞLU",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Ders,öğrencilerine kenti anlamayı ve okumayı öğretmeyi amaçlamaktadır. Kamu yönetimi bölümü mezunlarının bir çoğunun gelecekte kentin yöneticileri olacağı kabulüyle bu öğrencilere kentin tanımı, kapsamı, kentleşme sorunları ve çözümleri, kentleşme politikaları, kent hukuku gibi konularda temel bilgiler verilmesi amaçlanmaktadır.",
    "content": "Kent Kavramı (Kentin Farklı Disiplinler Açısından Tanımı, Kent Kuramları, Feodal Kent-Sanayileşmekte Olan Kent-Sanayi Kenti), Kentleşme Kavramı (Kentleşmenin Kavramsal Tanımı, Kentleşme Nedenleri, Kentleşmenin Boyutları), Dünyada Kentleşme Süreçleri (19. yy. da Kentler, 2. Dünya Savaşı Sonrası Kentler, Küreselleşme Sürecinde Kentler), Kent Politikaları (Kentsel Koruma, Kentsel Sürdürülebilirlik ve Kentsel Yenileme Politikaları), Türkiye'de Kentleşme Süreçleri (Tetikleyici Nedenler, Kent Politikaları, İmar Planlama Süreçleri), Türkiye'de Kent Planlaması Kavramı ( Planlamanın Tanımı, İmar Planları), Türk İmar Mevzuatı ( İmar Kanunu ve İlgili Yönetmelikler, Diğer İlgili Yasa ve Yönetmelikler, Örnek Olaylar), Ülkemizde Kentleşme ve Planlama Sorunları ( Kentleşme Sorunları, Planlama Sorunları), Konut Kavramı ( Konutun Tanımı ve Türleri), Konut Politikaları (Türkiye'de Konut Politikaları, Konut Üretim Sürecinde Rol Oynayan Aktörler, Konut Geliştirme Politikaları), Konut ile İlgili Mevzuat ( Toplu Konut Kanunu, Gecekondu Kanunu)",
    "methods": "Kuramsal anlatım, bilimsel kaynak incelemesi, örnek olay çözümlemesi, karşılaştırmalı analiz ve yapılandırılmış akademik tartışma.",
    "resources": "Kaynaklar: Özden Pelin Pınar “Türkiye’de Kentsel Dönüşümün Uygulanabilirliği Üzerine Düşünceler”, İ.Ü. Siyasal Bilgiler Fakültesi Dergisi, Sayı: 35., Ekim 2006., 215-233, İstanbul (2007) Özden Pelin Pınar, “Kentsel Yenileme Uygulamalarında Yerel Yönetimlerin Rolü Üzerine Düşünceler ve İstanbul Örneği; Ders Notları: Kitaplar - der: Alkan Ayten, Duru Bülent, 20. Yüzyıl Kenti, 2002 - Ersoy Melih, Kentsel Planlama Kuramları, İmge Yay., Ankara 2007 - Harvey D., Sosyal Adalet ve Şehir, Metis Yay., 2009 - Keleş Ruşen, Kentleşme Politikası, 12. Bs., İmge Yay., Ankara 2012 - Mumford L., Tarih Boyunca Kent, Ayrıntı Yay., 2007",
    "sdgs": [
      "10",
      "11",
      "16"
    ],
    "outcomes": [
      "KENTLEŞME ve ÇEVRE SORUNLARI kapsamındaki ileri kavram ve yaklaşımları analiz eder.",
      "yerel mali yapı ve kaynaklar ile ilişkili kurum ve uygulamaları karşılaştırır.",
      "sivil toplum ve katılım bağlamındaki veri ve kanıtları yorumlar.",
      "karşılaştırmalı yerel yönetim örnekleri için uygun analiz yaklaşımını uygular.",
      "KENTLEŞME ve ÇEVRE SORUNLARI alanındaki sorunlara etik ve kamu yararı odaklı öneriler geliştirir."
    ],
    "weeklyTopics": [
      "Kent Kavramı",
      "Kentleşme Kavramı",
      "Dünyada Kentleşme Süreçleri",
      "Kent Politikaları",
      "yerel yönetimlerin temel kavramları",
      "yerel yönetim sistemlerinin gelişimi",
      "merkez-yerel ilişkileri",
      "yerel mali yapı ve kaynaklar",
      "kentleşme dinamikleri",
      "çevre sorunları ve politikaları",
      "yerelleşme ve çok düzeyli yönetişim",
      "sivil toplum ve katılım",
      "kamu politikası süreci",
      "politika aktörleri ve araçları",
      "karşılaştırmalı yerel yönetim örnekleri"
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
          4,
          1,
          4,
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
          3,
          5,
          2,
          5,
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
          3,
          4,
          1,
          4,
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
          2,
          5,
          2,
          5,
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
          3,
          4,
          1,
          4,
          3,
          4,
          3,
          3,
          4,
          3
        ]
      }
    ],
    "sourceUrl": "https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=243712&lang=tr",
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
  },
  {
    "department": "Siyaset Bilimi ve Kamu Yönetimi ABD",
    "programName": "Siyaset Bilimi ve Kamu Yönetimi",
    "level": "Tezsiz Yüksek Lisans",
    "code": "SKY730",
    "name": "Mahalli idareler maliyesi",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Doç. Dr. MEHMET ELA",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Mahalli idarelerin varlık nedenlerinden yola çıkarak mali yapılarını öğrenmek, mahalli idarelerin mali sorunlarını tespit ederek çözüm üretmek",
    "content": "Mahalli idareleri özellikleri ve yapısını dikkate alarak incelemek, gelir-harcama kalemlerini analiz etmek",
    "methods": "Anlatım, soru cevap",
    "resources": "Kaynaklar: Mali Yerinden Yönetim: Teori, Kavramsal Açıklamalar ve Türkiye'ye İlişkin Değerlendirmeler, Ed. Mustafa Sakal, Ahmet Kesik ve Tekin Akdemir, Nobel Akademik Yayıncılık, Ankara, 2014.; Ders Notları: Özhan Çetinkaya, Mahalli İdareler Maliyesi, Ekin Yayınevi, Bursa, 2020.Mahalli İdareler Maliyesi Üzerine Yazılar, Ed. Fiğen Altuğ, Özhan Çetinkaya ve Selçuk İpek, Ekin Yayınevi, Bursa, 2010.Mali Yerinden Yönetim: Teori, Kavramsal Açıklamalar ve Türkiye'ye İlişkin Değerlendirmeler, Ed. Mustafa Sakal, Ahmet Kesik ve Tekin Akdemir, Nobel Akademik Yayıncılık, Ankara, 2014.Belediye Kanunu-Büyükşehir Belediyesi Kanunu-İl Özel İdaresi Kanunu",
    "sdgs": [
      "10",
      "11",
      "16"
    ],
    "outcomes": [
      "Mahalli idareler maliyesi kapsamındaki ileri kavram ve yaklaşımları analiz eder.",
      "yerel mali yapı ve kaynaklar ile ilişkili kurum ve uygulamaları karşılaştırır.",
      "sivil toplum ve katılım bağlamındaki veri ve kanıtları yorumlar.",
      "karşılaştırmalı yerel yönetim örnekleri için uygun analiz yaklaşımını uygular.",
      "Mahalli idareler maliyesi alanındaki sorunlara etik ve kamu yararı odaklı öneriler geliştirir."
    ],
    "weeklyTopics": [
      "Toplumsal İhtiyaçlar ve Üretici Birimler",
      "Çeşitli Mahalli İdare Kuruluşları ve Kapsamı",
      "Mahalli idare Kavramı ve Mahalli İdare Türleri",
      "Mahalli İdarelerin Varlık Nedenlerini Açıklayan Yaklaşımlar",
      "Merkez ve Mahalli İdare Arasındaki İlişkiler ve Düzenlenmesi",
      "Mahalli İdareler ve Optimum Hizmet Alanının Tespiti",
      "Mahalli İdarelerde Gelir Kaynakları",
      "Mahalli İdarelerce Görülen Hizmetler",
      "Türkiye’de Mahalli İdareler; Belediyeler ve Büyükşehir Belediyeleri",
      "Türkiye’de Mahalli İdareler ; İl Özel İdareleri ve Köyler",
      "Türkiye’de Mahalli İdarelerde Borçlanma ve Özelleştirme Uygulamaları",
      "Dünya’da Seçilmiş Ülkelerde Mahalli İdare Uygulamaları",
      "Mahalli İdarelerde Karşılaşılan Sorunlar",
      "Türkiye’deki Mahalli İdarelerin Değerlendirilmesi ve Tartışılması",
      "yerel yönetimlerin temel kavramları"
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
          4,
          1,
          4,
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
          3,
          5,
          2,
          5,
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
          3,
          4,
          1,
          4,
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
          2,
          5,
          2,
          5,
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
          3,
          4,
          1,
          4,
          3,
          4,
          3,
          3,
          4,
          3
        ]
      }
    ],
    "sourceUrl": "https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=243713&lang=tr",
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
  },
  {
    "department": "Siyaset Bilimi ve Kamu Yönetimi ABD",
    "programName": "Siyaset Bilimi ve Kamu Yönetimi",
    "level": "Tezsiz Yüksek Lisans",
    "code": "SKY732",
    "name": "Türkiye'de siyaset ve eğitim",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Prof. Dr. MÜJDAT AVCI",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Bu dersin temel amacı Osmanlının son dönemlerinde başlayan ve Cumhuriyet tarihi boyunca devam eden eğitim alanındaki yenileşme hareketlerini tüm boyutları ile incelemek ve günümüzde eğitim alanında yaşanan sorunların neler olduğunu ortaya koymaktır.",
    "content": "Osmanlının son dönemlerinden başlayıp Cumhuriyetle devam eden ve günümüze kadar süren eğitim alanındaki yenileşme hareketleri ve eğitim kurumunun bu süreçte yaşadığı sorunlar ve siyaset kurumunun eğitimi şekillendirmesi dersin içeriğini oluşturmaktadır.",
    "methods": "Anlatım, Soru - Cevap",
    "resources": "Kaynaklar: 1. Akyüz, Y. (2016). Türk Eğitim Tarihi, 29. Baskı, PEGEM Akademi Yayıncılık. 2. Berkes, N. (2023). Türkiye’de Çağdaşlaşma, Yapı Kredi Yayınları. 3. Zencirkıran, M. (Edt.) (2020). Dünden Bugüne Türkiye’nin Toplumsal Yapısı, 7. Baskı, Dora Yayınları. 4. Celkan, H. Y. (2020). Eğitim Sosyolojisi, 2. Baskı, ASOS Yayınevi. 5. Sağlam, V. (1996). Eğitim, Siyaset ve Din, İnsan Yayınları. 6. Gökçe, B. (2019). Türkiye’nin Toplumsal Yapısı ve Toplumsal Kurumlar, Savaş Yayınları. 7. Doğan, İ. (2019). Osmanlı’dan Cumhuriyete Türkiye’nin Toplumsal Yapısı, 2. Baskı, Astana Yayınları. 8. Mardin, Ş. (2021). Türk Modernleşmesi, İletişim Yayınları. 9. Lewis, B. (2015). Modern Türkiye’nin Doğuşu, (Çev.: B. Turna), Arkadaş Yayınları. 10. Adem, M. (2000). Atatürkçü Düşünce Işığında Eğitim Politikamız, Cumhuriyet Yayınları. 11. Başaran, M. (2014). Özgürleşme Eylemi; Köy Enstitüleri, Cumhuriyet Kitapları.; Ders Notları: Balcı, Esergül – 2023 – Türkiye’de Eğitim Politikaları II. Cilt (1980-2023) – Detay Yayıncılık. Balcı, Esergül – 2020 – Türkiye’de Eğitim Politikaları (1923-1980) I. Cilt – Pegem Akademi Yayıncılık. İnal, Kemal – 2019 – Türkiye’de Eğitim ve Politika – Töz Yayınları. Yılmaz, Bülent – 2004 – Türkiye’de Eğitim Politikası ve Kütüphane – Türk Kütüphaneciler Derneği Yayınları. Sağlam, Vedat – 1996 – Eğitim, Siyaset ve Din – İnsan Yayınları. (Alternatif / tamamlayıcı) – Kolektif – 2017 – Türkiye’de Eğitim Politikaları – Nobel Akademik Yayıncılık.",
    "sdgs": [
      "4",
      "10",
      "16"
    ],
    "outcomes": [
      "Türkiye'de siyaset ve eğitim kapsamındaki ileri kavram ve yaklaşımları analiz eder.",
      "demokrasi yaklaşımları ile ilişkili kurum ve uygulamaları karşılaştırır.",
      "milliyetçilik ve kimlik siyaseti bağlamındaki veri ve kanıtları yorumlar.",
      "siyasal aktörler ve karar süreçleri için uygun analiz yaklaşımını uygular.",
      "Türkiye'de siyaset ve eğitim alanındaki sorunlara etik ve kamu yararı odaklı öneriler geliştirir."
    ],
    "weeklyTopics": [
      "Dersin Amacı ve Planlama: Ders gerekçesi, içeriği, planı ve işleniş biçiminin tanıtılması, ders kaynaklarının tanıtılması, ders çıktılarının önemi hakkında bilgi verilecek.",
      "Osmanlıda Eğitim: Kuruluştan Eğitimde İlk Yenileşme Hareketlerine Kadar (1299-1776)",
      "Eğitimde İlk Yenileşme Hareketleri (1776-1839)",
      "Tanzimat Dönemi (1839-1876)",
      "I. Meşrutiyet Dönemi (1876 – 1878)",
      "Mutlakıyet Dönemi (1878 – 1908)",
      "II. Meşrutiyet Dönemi (23 Temmuz 1908 - 11 Nisan 1920)",
      "Kurtuluş Savaşı Dönemi",
      "Türkiye Cumhuriyeti",
      "Köy Enstitülerinin Kuruluşu",
      "Eğitimde Fırsat ve İmkan Eşitliği ve Türkiye",
      "Neoliberal Küreselleşmenin Türk Eğitim Sistemine Etkisi",
      "Türk Eğitim Sistemindeki Sorunlar",
      "2002 - 2020 Yılları Arasında Siyaset ve Eğitim",
      "siyasetin kapsamı ve temel kavramları"
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
          2,
          1,
          4,
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
          3,
          2,
          5,
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
          3,
          1,
          4,
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
          2,
          2,
          5,
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
          3,
          1,
          4,
          3,
          4,
          3,
          3,
          4,
          3
        ]
      }
    ],
    "sourceUrl": "https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=243721&lang=tr",
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
  },
  {
    "department": "Siyaset Bilimi ve Kamu Yönetimi ABD",
    "programName": "Siyaset Bilimi ve Kamu Yönetimi",
    "level": "Tezsiz Yüksek Lisans",
    "code": "SKY734",
    "name": "Karşılaştırmalı kamu yönetimi",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Prof. Dr. SELİM COŞKUN",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Çesitli ilkelerin kamu yönetimi sistemlerini, yönetsel uygulamaları ve reform tecrübelerinikarsılaştırmalı olarak incelemek.",
    "content": "Sosyal bilimlerde karsılastırma, karşılaştırmanın onemi üzerinde durulacaktır. Karşılaştırmalı Kamu Yönetiminin ne oldugu ve kamu yönetimi disiplini içindeki yeri tartışılacaktır. Devlet biçimleri ve hükümetsistemleri anlatildiktan sonra dünyada hakim yönetim gelenekleri üzerinde durulacaktır.",
    "methods": "Kuramsal anlatım, bilimsel kaynak incelemesi, örnek olay çözümlemesi, karşılaştırmalı analiz ve yapılandırılmış akademik tartışma.",
    "resources": "Kaynaklar: J. Ernre, C. (1997). Kar~lla~tJrmall Kamu Yonetimi, Ankara: Siyasal Kitabevi. 2. Kutlu, O. (2006). Kar~lla~tlrmah Kamu Yonetimi, Konya: <;izgi Kitabevi.",
    "sdgs": [
      "4",
      "16",
      "17"
    ],
    "outcomes": [
      "Karşılaştırmalı kamu yönetimi kapsamındaki ileri kavram ve yaklaşımları analiz eder.",
      "bürokrasi ve yönetsel davranış ile ilişkili kurum ve uygulamaları karşılaştırır.",
      "yönetişim aktörleri ve katılım bağlamındaki veri ve kanıtları yorumlar.",
      "karar süreçleri ve uygulama sorunları için uygun analiz yaklaşımını uygular.",
      "Karşılaştırmalı kamu yönetimi alanındaki sorunlara etik ve kamu yararı odaklı öneriler geliştirir."
    ],
    "weeklyTopics": [
      "1.Dersin Amacı ve Planlama 2.Genel Perspektif ve Dersin Tanıtımı 3.Karşılaştırmalı Yöntem-Karşılaştırmalı Kamu Yönetimi Nedir?",
      "kamu yönetiminin kapsamı ve temel kavramları",
      "klasik ve çağdaş yönetim yaklaşımları",
      "kamu örgütlerinin yapısı",
      "bürokrasi ve yönetsel davranış",
      "kamu personel sistemi",
      "stratejik yönetim ve planlama",
      "performans, kalite ve hesap verebilirlik",
      "yönetişim aktörleri ve katılım",
      "idari reform ve kurumsal değişim",
      "kamu hizmetlerinde dijital dönüşüm",
      "karar süreçleri ve uygulama sorunları",
      "karşılaştırmalı yönetim örnekleri",
      "etik ve kamu yararı",
      "güncel yönetsel sorunların analizi"
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
    "sourceUrl": "https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=243711&lang=tr",
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
  },
  {
    "department": "Siyaset Bilimi ve Kamu Yönetimi ABD",
    "programName": "Siyaset Bilimi ve Kamu Yönetimi",
    "level": "Tezsiz Yüksek Lisans",
    "code": "SKY736",
    "name": "Modern siyaset teorisi",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Dr. Öğr. Üyesi CİHAN UZUNÇAYIR",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Bu dersin temel amacı, öğrencilere siyasi sistemleri ve süreçleri eleştirel olarak değerlendirmek ve yorumlamak için bir dizi analitik ve teorik araç sağlamaktır.",
    "content": "İnsan Doğası, Birey ve Toplum; Siyaset, Yönetim ve Devlet; Güç, Otorite ve Meşruiyet, Hukuk, Düzen ve Adalet; Demokrasi ve Temsil; Eşitlik, Sosyal Adalet ve Refah; Mülkiyet, Planlama ve Piyasa; Popülizm, Halk ve Demokrasi; Siyaset ve Şiddet.",
    "methods": "Ders, yüz yüze anlatım ve öğrenci sunumlarıyla yürütülmektedir.",
    "resources": "Kaynaklar: 2. Norman P. Barry, Modern Siyaset Teorisi, (çev. Mustafa Erdoğan), Liberte Yayınları.5. Muhammed Ağcan (der), Çağdaş Siyaset Teorisi, İstanbul Bilgi Üniversitesi Yayınları, 2022.4. Martin Carnoy, Devlet ve Siyaset Teorisi, (çev. Simten Coşar vd.), Dipnot Yayınları.1. Andrew Heywood, Siyaset Teorisine Giriş, (çev. Hızır Murat Köse), Küre Yayınları.3. Pete Woodcock, Siyaset Teorisi, (çev. Aydın Çavdar), Ayrıntı Yayınları.",
    "sdgs": [
      "4",
      "10",
      "16"
    ],
    "outcomes": [
      "Modern siyaset teorisi kapsamındaki ileri kavram ve yaklaşımları analiz eder.",
      "demokrasi yaklaşımları ile ilişkili kurum ve uygulamaları karşılaştırır.",
      "milliyetçilik ve kimlik siyaseti bağlamındaki veri ve kanıtları yorumlar.",
      "siyasal aktörler ve karar süreçleri için uygun analiz yaklaşımını uygular.",
      "Modern siyaset teorisi alanındaki sorunlara etik ve kamu yararı odaklı öneriler geliştirir."
    ],
    "weeklyTopics": [
      "Giriş ve Dersin Tanıtımı",
      "Temel Kavramlar: Siyaset Teorisi ve Kavramlar",
      "İnsan Doğası, Birey ve Toplum",
      "Siyaset, Yönetim ve Devlet",
      "Güç, Otorite ve Meşruiyet",
      "Hukuk, Düzen ve Adalet",
      "Demokrasi ve Temsil",
      "Eşitlik, Sosyal Adalet ve Refah",
      "Mülkiyet, Planlama ve Piyasa",
      "Popülizm, Halk ve Demokrasi",
      "Siyaset ve Şiddet",
      "Genel Değerlendirme ve Tartışmalar",
      "siyasetin kapsamı ve temel kavramları",
      "iktidar, otorite ve meşruiyet",
      "devlet kuramları"
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
          2,
          1,
          4,
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
          3,
          2,
          5,
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
          3,
          1,
          4,
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
          2,
          2,
          5,
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
          3,
          1,
          4,
          3,
          4,
          3,
          3,
          4,
          3
        ]
      }
    ],
    "sourceUrl": "https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=243714&lang=tr",
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
  },
  {
    "department": "Siyaset Bilimi ve Kamu Yönetimi ABD",
    "programName": "Siyaset Bilimi ve Kamu Yönetimi",
    "level": "Tezsiz Yüksek Lisans",
    "code": "SKY738",
    "name": "Kamu personel rejimi",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Dr. Öğr. Üyesi AHMET BAĞRIAÇIK",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Bu dersin amacı, kamu personel sisteminin kuramsal temelini, tarihsel gelişimini, hukuki çerçevesini ve uygulamadaki işleyişini kavratarak öğrencilerin kamu görevlilerinin statüsü, hakları, yükümlülükleri ve personel yönetim süreçleri hakkında kapsamlı bir bilgi birikimi edinmesini sağlamaktır. Ders, Türkiye’de ve dünyada kamu personel rejimine ilişkin farklı modelleri karşılaştırmalı olarak ele alarak öğrencilerin kamu yönetimi alanındaki analitik ve profesyonel yetkinliklerini güçlendirmeyi amaçlar.",
    "content": "Bu ders, kamu personel rejiminin tarihsel gelişimini ve temel ilkelerini inceleyerek başlar. Devletin yönetim yapısı içinde kamu görevlilerinin hukuki statüsü, atanma süreçleri, yükselme ve kariyer sistemi, disiplin hükümleri, özlük hakları ve kamu hizmetlerinin yürütülmesindeki sorumlulukları ayrıntılı biçimde ele alınır. Merkeziyetçi ve adem-i merkeziyetçi personel sistemleri karşılaştırılarak Türkiye’deki mevcut uygulamanın dünyadaki örneklerle benzerlikleri ve farklılıkları değerlendirilir. Ayrıca liyakat sistemi, performans yönetimi, etik kurallar, kamu personel politikalarında güncel reform tartışmaları ve kamu istihdamının değişen koşulları dersin temel odak noktaları arasındadır. Öğrenciler, hukuki belgeler, politika metinleri ve ülke karşılaştırmaları üzerinden kamu personel rejiminin nasıl şekillendiğini analiz etme fırsatı bulur.",
    "methods": "Konu anlatımı ve öğrenci sunumu",
    "resources": "Kaynaklar: Tayfun Akgüner (2009), Kamu Personel Yönetimi, Der Yayınları, İstanbul.Birgül Ayman Güler (2005), Kamu Personeli: Sistem ve Yönetim, İmge Kitabevi, Ankara.; Ders Notları: -; Dökümanlar: 1- Tayfun Akgüner (2009), Kamu Personel Yönetimi, Der Yayınları, İstanbul. 2- Birgül Ayman Güler (2005), Kamu Personeli: Sistem ve Yönetim, İmge Kitabevi, Ankara. Önerilen Kaynaklar: Devlet Memurları Kanunu",
    "sdgs": [
      "4",
      "16",
      "17"
    ],
    "outcomes": [
      "Kamu personel rejimi kapsamındaki ileri kavram ve yaklaşımları analiz eder.",
      "bürokrasi ve yönetsel davranış ile ilişkili kurum ve uygulamaları karşılaştırır.",
      "yönetişim aktörleri ve katılım bağlamındaki veri ve kanıtları yorumlar.",
      "karar süreçleri ve uygulama sorunları için uygun analiz yaklaşımını uygular.",
      "Kamu personel rejimi alanındaki sorunlara etik ve kamu yararı odaklı öneriler geliştirir."
    ],
    "weeklyTopics": [
      "Türk kamu personel yönetiminin tarihçesi",
      "Modern kamu personel yönetimine egemen olan ilkeler",
      "Devlet memurluğu, tanımlar ve sınıflandırmalar",
      "Devlet memurlarının yükümlülükleri ve bağlı oldukları yasaklar",
      "Devlet memurlarının hakları",
      "Devlet memurlarının değerlendirilmesi (Sicil ve Tezkiye İşlemleri) Memurların ücret rejimi ve yükselmeleri",
      "Memurlar hakkında disiplin soruşturması",
      "Disiplin cezaları ve ceza kovuşturması",
      "Memurların mali sorumluluğu",
      "Memurluğun sona ermesi",
      "kamu yönetiminin kapsamı ve temel kavramları",
      "klasik ve çağdaş yönetim yaklaşımları",
      "kamu örgütlerinin yapısı",
      "bürokrasi ve yönetsel davranış",
      "kamu personel sistemi"
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
    "sourceUrl": "https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=243708&lang=tr",
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
  },
  {
    "department": "Siyaset Bilimi ve Kamu Yönetimi ABD",
    "programName": "Siyaset Bilimi ve Kamu Yönetimi",
    "level": "Tezsiz Yüksek Lisans",
    "code": "SKY740",
    "name": "İdari yargıda adil yargılama hakkı",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Dr. Öğr. Üyesi AHMET BAĞRIAÇIK",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Hak arama özgürlüğü çerçevesinde idari yargıya özgü kurumların incelenmesi",
    "content": "Anayasada ve Avrupa İnsan Hakları Sözleşmesinde yer alan hak arama özgürlüğü çerçevesinde idari yargının görev alanı ve kapsamı, yargılama hukukunda yer alan kurallar ile başvuru mekanizmaları ve ilgili mahkeme kararları.",
    "methods": "Konu anlatımı ve öğrenci sunumları",
    "resources": "Kaynaklar: Sibel İnceoğlu, İnsan Hakları Avrupa Mahkemesi Kararlarında Adil Yargılanma Hakkı, 2013; Ders Notları: -; Dökümanlar: 1. Nurcan Yılmaz Özel, Adil Yargılanma Hakkı Kriterlerinin Türk İdari Yargılama Hukuku Açısından Muhtemel ve Gerçekleşen Etkileri, On İki Levha Yayıncılık, İstanbul, 2016 2. Zühal Aysun Sunay, İdari Yargılama Hukukunda İptal Davalarında Gerekçeli Karar Hakkı, Seçkin, Ankara, 2016. 3. Sibel İnceoğlu, İnsan Hakları Avrupa Mahkemesi Kararlarında Adil Yargılanma Hakkı: Kamu ve Özel Hukuk Alanlarında Ortak Yargısal Hak ve İlkeler, Beta, İstanbul, 2013. 4. Burak Öztürk, Hak Arama Özgürlüğü Çerçevesind",
    "sdgs": [
      "10",
      "16",
      "17"
    ],
    "outcomes": [
      "İdari yargıda adil yargılama hakkı kapsamındaki ileri kavram ve yaklaşımları analiz eder.",
      "idarenin sorumluluğu ile ilişkili kurum ve uygulamaları karşılaştırır.",
      "adil yargılanma hakkı bağlamındaki veri ve kanıtları yorumlar.",
      "vergi sistemi ve güncel gelişmeler için uygun analiz yaklaşımını uygular.",
      "İdari yargıda adil yargılama hakkı alanındaki sorunlara etik ve kamu yararı odaklı öneriler geliştirir."
    ],
    "weeklyTopics": [
      "Adil yargılanma hakkı ve adil yargılanma hakkının önemi",
      "Yasayla kurulmuş bağımsız ve tarafsız bir mahkemede yargılanma hakkı",
      "Silahların eşitliği ve çelişmeli muhakeme",
      "Kendisine yüklenen suçu öğrenme, susma ve kendisini suçlamama hakkı",
      "Müdafi yardımından yararlanma hakkı",
      "Masumiyet karinesi (Lekelenmeme hakkı)",
      "Delillere ve delillerin değerlendirilmesine ilişkin temel kurallar",
      "hukuk devleti ve kamu hukuku ilkeleri",
      "idarenin kuruluşu ve görevleri",
      "idari işlem ve eylemler",
      "idarenin sorumluluğu",
      "temel hak ve özgürlükler",
      "idari yargının yapısı",
      "dava türleri ve başvuru yolları",
      "adil yargılanma hakkı"
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
          4,
          1,
          4,
          2,
          2,
          1,
          4,
          4,
          2
        ]
      },
      {
        "outcome": "DÖÇ2",
        "values": [
          5,
          3,
          5,
          2,
          5,
          3,
          3,
          2,
          5,
          5,
          3
        ]
      },
      {
        "outcome": "DÖÇ3",
        "values": [
          4,
          3,
          4,
          1,
          4,
          3,
          3,
          1,
          4,
          4,
          3
        ]
      },
      {
        "outcome": "DÖÇ4",
        "values": [
          5,
          2,
          5,
          2,
          5,
          2,
          2,
          2,
          5,
          5,
          2
        ]
      },
      {
        "outcome": "DÖÇ5",
        "values": [
          4,
          3,
          4,
          1,
          4,
          3,
          3,
          1,
          4,
          4,
          3
        ]
      }
    ],
    "sourceUrl": "https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=243740&lang=tr",
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
  },
  {
    "department": "Siyaset Bilimi ve Kamu Yönetimi ABD",
    "programName": "Siyaset Bilimi ve Kamu Yönetimi",
    "level": "Tezsiz Yüksek Lisans",
    "code": "SKY742",
    "name": "İdari yargıda kanun yolları",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Dr. Öğr. Üyesi AHMET BAĞRIAÇIK",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Bu dersin amacı, idarî yargı sisteminde uygulanan kanun yollarının kapsamını, işleyişini ve hukuki dayanaklarını ayrıntılı biçimde inceleyerek öğrencilerin idarî uyuşmazlıkların çözüm süreçlerini bütüncül bir bakışla kavrayabilmelerini sağlamaktır. Öğrencilerin, itiraz, istinaf ve temyiz gibi kanun yollarının temel işlevlerini, usul kurallarını, yargısal denetimin sınırlarını ve kararların hukuki sonuçlarını analiz edebilecek düzeyde bilgi ve beceri kazanmaları hedeflenmektedir.",
    "content": "Bu ders, Türkiye’de idarî yargı sisteminin yapısını ve işleyişini ele alarak başlar. İdarî uyuşmazlıkların çözümünde uygulanan kanun yollarının tarihsel gelişimi, hukuki dayanakları ve genel ilkeleri incelenir. İtiraz, istinaf ve temyiz mekanizmalarının başvuru şartları, süresi, inceleme kapsamı, karar türleri ve yargısal denetim sınırları ayrıntılı olarak değerlendirilir. Danıştay’ın temyiz mercii olarak rolü, bölge idare mahkemelerinin istinaf sürecindeki konumu ve ilk derece mahkemeleriyle kurulan ilişki dersin temel odak noktalarındandır. Ayrıca yürütmenin durdurulması, hükmün kesinliği, düzeltme yolu, kararların uygulanması ve idarî yargıda güncel sorunlara ilişkin yargısal içtihatlar da ders kapsamında ele alınır. Öğrenciler, gerçek dava dosyaları, yüksek yargı kararları ve karşılaştırmalı örnekler üzerinden idarî kanun yollarının hem teorik hem pratik boyutlarını analiz eder.",
    "methods": "Konu anlatımı ve öğrenci sunumları",
    "resources": "Kaynaklar: ÇAĞLAYAN, Ramazan, İdari Yargı Kararlarına Karşı Başvuru Yolları, 1. Baskı, Seçkin, 2017; AKYILMAZ, Bahtiyar; SEZGİNER, Murat; KAYA, Cemil, Açıklamalı İçtihatlı Türk İdari Yargılama Hukuku, 1. Baskı, Savaş, 2019; GÖZÜBÜYÜK, Şeref, TAN, Turgut, İdare Hukuku Cilt 2 İdari Yargılama Hukuku, 9. Baskı, 2017.; Ders Notları: -; Dökümanlar: 1. Nurcan Yılmaz Özel, Adil Yargılanma Hakkı Kriterlerinin Türk İdari Yargılama Hukuku Açısından Muhtemel ve Gerçekleşen Etkileri, On İki Levha Yayıncılık, İstanbul, 2016 2. Zühal Aysun Sunay, İdari Yargılama Hukukunda İptal Davalarında Gerekçeli Karar Hakkı, Seçkin, Ankara, 2016. 3. Sibel İnceoğlu, İnsan Hakları Avrupa Mahkemesi Kararlarında Adil Yargılanma Hakkı: Kamu ve Özel Hukuk Alanlarında Ortak Yargısal Hak ve İlkeler, Beta, İstanbul, 2013. 4. Burak Öztürk, Hak Arama Özgürlüğü Çerçevesind",
    "sdgs": [
      "10",
      "16",
      "17"
    ],
    "outcomes": [
      "İdari yargıda kanun yolları kapsamındaki ileri kavram ve yaklaşımları analiz eder.",
      "idarenin sorumluluğu ile ilişkili kurum ve uygulamaları karşılaştırır.",
      "adil yargılanma hakkı bağlamındaki veri ve kanıtları yorumlar.",
      "vergi sistemi ve güncel gelişmeler için uygun analiz yaklaşımını uygular.",
      "İdari yargıda kanun yolları alanındaki sorunlara etik ve kamu yararı odaklı öneriler geliştirir."
    ],
    "weeklyTopics": [
      "Kanun Yolu Kavramı ve Amacı",
      "Kesin Hüküm Etkisi ve Kanun Yoluna Başvuru İlişkisi",
      "Olağan – Olağanüstü Kanun Yolu Ayrımı",
      "Türkiye’de Kanun Yollarının Ortaya Çıkışı ve Dönüşümü",
      "İstinaf Kanun Yolu ve Başvuru Şartları",
      "İstinaf İncelemesinin Kapsamı",
      "Doğrudan Temyize Başvurulacak Durumlar (Danıştay Kanunu m.24-25, İYUK m.20/A ve 20/B’de Yer Alan Hükümler)",
      "Temyiz Kanun Yolu ve Başvuru Şartları",
      "Temyiz İncelemesinin Kapsamı",
      "İstinaf ve Temyiz Aşamasında Yürütmenin Durdurulması",
      "Yargılamanın Yenilenmesi",
      "Kanun Yararına Temyiz",
      "hukuk devleti ve kamu hukuku ilkeleri",
      "idarenin kuruluşu ve görevleri",
      "idari işlem ve eylemler"
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
          4,
          1,
          4,
          2,
          2,
          1,
          4,
          4,
          2
        ]
      },
      {
        "outcome": "DÖÇ2",
        "values": [
          5,
          3,
          5,
          2,
          5,
          3,
          3,
          2,
          5,
          5,
          3
        ]
      },
      {
        "outcome": "DÖÇ3",
        "values": [
          4,
          3,
          4,
          1,
          4,
          3,
          3,
          1,
          4,
          4,
          3
        ]
      },
      {
        "outcome": "DÖÇ4",
        "values": [
          5,
          2,
          5,
          2,
          5,
          2,
          2,
          2,
          5,
          5,
          2
        ]
      },
      {
        "outcome": "DÖÇ5",
        "values": [
          4,
          3,
          4,
          1,
          4,
          3,
          3,
          1,
          4,
          4,
          3
        ]
      }
    ],
    "sourceUrl": "https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=243741&lang=tr",
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

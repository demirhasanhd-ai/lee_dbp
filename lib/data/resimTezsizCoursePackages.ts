// Mevcut LEE_DBP müfredatı ve bologna-lisansustu-2026-08-17-ders-verileri.json yardımcı ders içeriği temel alınmıştır; program profili ve PÇ kayıtları değiştirilmemiştir.
import type { CoursePackage } from "./coursePackages";

export const resimTezsizCoursePackages: CoursePackage[] = [
  {
    "department": "Resim ASD",
    "programName": "Resim",
    "level": "Tezsiz Yüksek Lisans",
    "code": "RES703",
    "name": "Bilimsel araştırma yöntemleri ve yayın etiği",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Doç. AŞKIN BAHADIR",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "- Bilimsel araştırma süreciyle ilgili temel kavramları tanımak- Bilimin ve bilimsel araştırmanın önemini kavramak- Bilimle ve bilimsel araştırmayla ilgili farklı kaynakları tanımak- Bilimsel araştırma süreci hakkında bilgilenmek",
    "content": "1. Bilimsel Araştırma, bilimsel araştırma süreçleri ve etik2. Bilimsel araştırmalarda temel kavramlar3. Ölçme ve değerlendirme/Ölçme aracında bulunması gereken nitelikler 4. Araştırma teknikleri ve modeller5. Nitel Araştırmalar (Testler)6. Nicel Araştırmalar (Test dışı teknikler)7. Evren-Örneklem, Örnekleme Yöntemleri8. Veri Toplama Araçları (Testler ve test dışı teknikler)9. Bilimsel Yöntemin Aşamaları10. Araştırma Önerisi Hazırlama",
    "methods": "Anlatım, görsel kaynak incelemesi, yapıt çözümlemesi, atölye veya örnek olay uygulamaları ve yapılandırılmış akademik tartışma.",
    "resources": "Dersin kapsamına uygun güncel kitaplar, hakemli sanat ve tasarım literatürü, müze ve koleksiyon katalogları ile görsel arşivler.",
    "sdgs": [
      "4",
      "8",
      "11"
    ],
    "outcomes": [
      "Bilimsel araştırma yöntemleri ve yayın etiği alanındaki ileri kavram ve yaklaşımları analiz eder.",
      "kaynak tarama ve eleştirel okuma ile ilişkili örnekleri uygun ölçütlerle karşılaştırır.",
      "veri çözümleme ve yorumlama bağlamında görsel veya kuramsal verileri yorumlar.",
      "sanat araştırmalarında özgünlük doğrultusunda özgün çözüm ya da değerlendirme geliştirir.",
      "Bilimsel araştırma yöntemleri ve yayın etiği kapsamındaki çalışmaları sanatsal, mesleki ve etik ölçütlerle değerlendirir."
    ],
    "weeklyTopics": [
      "Bilimsel Araştırma, bilimsel araştırma süreçleri ve etik",
      "Bilimsel araştırmalarda temel kavramlar",
      "Ölçme ve değerlendirme",
      "Ölçme aracında bulunması gereken nitelikler",
      "Araştırma teknikleri ve modeller",
      "Nicel Araştırmalar (Test dışı teknikler)",
      "Nitel araştırmalar",
      "Evren-Örneklem, Örnekleme Yöntemleri",
      "Veri Toplama Araçları (Testler ve test dışı teknikler)",
      "Bilimsel Yöntemin Aşamaları (Problemin belirlenmesi ve Başlık oluşturma)",
      "Bilimsel Yöntemin Aşamaları (Giriş ve Yöntem)",
      "Bilimsel Yöntemin Aşamaları (Bulgular, tartışma)",
      "Bilimsel Yöntemin Aşamaları (Kaynakça ve APA)",
      "Araştırma Önerisi Hazırlama",
      "bilimsel bilgi ve sanat araştırmasının kapsamı"
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
          1,
          2,
          1,
          4,
          4,
          2,
          2,
          4,
          1,
          4
        ]
      },
      {
        "outcome": "DÖÇ2",
        "values": [
          3,
          2,
          3,
          2,
          5,
          5,
          3,
          3,
          5,
          2,
          5
        ]
      },
      {
        "outcome": "DÖÇ3",
        "values": [
          3,
          1,
          3,
          1,
          4,
          4,
          3,
          3,
          4,
          1,
          4
        ]
      },
      {
        "outcome": "DÖÇ4",
        "values": [
          2,
          2,
          2,
          2,
          5,
          5,
          2,
          2,
          5,
          2,
          5
        ]
      },
      {
        "outcome": "DÖÇ5",
        "values": [
          3,
          1,
          3,
          1,
          4,
          4,
          3,
          3,
          4,
          1,
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
        "status": "Revize Edildi"
      },
      {
        "item": "Eksik/doğrulanması gereken alan kaldı mı?",
        "status": "Doğrulanmalı"
      }
    ],
    "publicQualityChecklist": false
  },
  {
    "department": "Resim ASD",
    "programName": "Resim",
    "level": "Tezsiz Yüksek Lisans",
    "code": "RES705",
    "name": "Resim atölye",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Prof. Dr. OSMAN ALTINTAŞ",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Plastik sanatlar alanında nesne kavramı üzerinde durarak görme biçimlerini geliştirmek. Bireyin kreatif alanlar doğrultusunda gelişimini sağlamak.",
    "content": "Öğrenciden lisans döneminde edindiği bilgi ve deneyimlerle senteze varması, kendine özgü bir dille kendi görsel dünyasını kurması, bu doğrultuda yetkinleşmesi beklenir. Bireysel temalar ekseninde çalışmalar ortaya koyan öğrencinin kişisel eğilim ve yeğlemelerinin özgünleşmesi ve yetkinleşmesi için referans ve eleştirilerle yetkinleşmesi sağlanır.",
    "methods": "Anlatım, görsel kaynak incelemesi, yapıt çözümlemesi, atölye veya örnek olay uygulamaları ve yapılandırılmış akademik tartışma.",
    "resources": "Dersin kapsamına uygun güncel kitaplar, hakemli sanat ve tasarım literatürü, müze ve koleksiyon katalogları ile görsel arşivler.",
    "sdgs": [
      "4",
      "8",
      "11"
    ],
    "outcomes": [
      "Resim atölye alanındaki ileri kavram ve yaklaşımları analiz eder.",
      "malzeme olanaklarının araştırılması ile ilişkili örnekleri uygun ölçütlerle karşılaştırır.",
      "deneysel üretim yaklaşımları bağlamında görsel veya kuramsal verileri yorumlar.",
      "atölye çalışmalarının eleştirel çözümlemesi doğrultusunda özgün çözüm ya da değerlendirme geliştirir.",
      "Resim atölye kapsamındaki çalışmaları sanatsal, mesleki ve etik ölçütlerle değerlendirir."
    ],
    "weeklyTopics": [
      "Öğrencilerle tanışmak ve dönem planı üzerinde karşılıklı değerlendirmeler yapmak.",
      "Nesne - obje kavramları üzerinde tartışmak; görme biçimleri üzerine kaynaklar üzerinden uygulama alanlarını belirlemek.",
      "Kişisel üslup yaratma önemi üzerinden grup projeleri - uygulamaları yapmak.",
      "Atölye uygulaması.",
      "Pentürel renk uygulamaları ve yüzey çözümlemeleri üzerine tartışma - uygulama.",
      "Nesnenin çizgisel serüveni ve biçim algılaması.",
      "Eser İncelemesi",
      "Eser eleştirisi.",
      "Eser analizinde güncel üslupsal yaklaşımlar.",
      "Artistik desen - biçimsel kurgu.",
      "Değerlendirme ve eleştiri.",
      "atölye uygulamalarında amaç ve görsel problem",
      "kompozisyon ve görsel örgütleme",
      "renk, biçim ve yüzey ilişkileri",
      "malzeme olanaklarının araştırılması"
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
  },
  {
    "department": "Resim ASD",
    "programName": "Resim",
    "level": "Tezsiz Yüksek Lisans",
    "code": "RES707",
    "name": "Çağdaş sanat felsefesi",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Prof. ALİ ASKER BAL",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Öğrencinin sanat kuramı ve eleştirisi alanındaki ileri bilgi ve yaklaşımları sanatsal üretim ve eleştirel değerlendirme süreçlerinde kullanmasını sağlamak.",
    "content": "Çağdaş sanat felsefesi; temel kavramlar ve tarihsel bağlam, sanat yapıtı ve estetik deneyim, modern ve çağdaş kuramsal yaklaşımlar, sanatçı, yapıt ve izleyici ilişkisi, biçim ve içerik tartışmaları, temsiliyet ve anlam üretimi, eleştirel çözümleme yöntemleri, görsel kültür ve toplumsal bağlam, mekân, kimlik ve bellek, disiplinler arası kuramsal ilişkiler boyutlarıyla ele alınır.",
    "methods": "Anlatım, görsel kaynak incelemesi, yapıt çözümlemesi, atölye veya örnek olay uygulamaları ve yapılandırılmış akademik tartışma.",
    "resources": "Dersin kapsamına uygun güncel kitaplar, hakemli sanat ve tasarım literatürü, müze ve koleksiyon katalogları ile görsel arşivler.",
    "sdgs": [
      "4",
      "8",
      "11"
    ],
    "outcomes": [
      "Çağdaş sanat felsefesi alanındaki ileri kavram ve yaklaşımları analiz eder.",
      "sanatçı, yapıt ve izleyici ilişkisi ile ilişkili örnekleri uygun ölçütlerle karşılaştırır.",
      "görsel kültür ve toplumsal bağlam bağlamında görsel veya kuramsal verileri yorumlar.",
      "seçilmiş yapıtların karşılaştırılması doğrultusunda özgün çözüm ya da değerlendirme geliştirir.",
      "Çağdaş sanat felsefesi kapsamındaki çalışmaları sanatsal, mesleki ve etik ölçütlerle değerlendirir."
    ],
    "weeklyTopics": [
      "temel kavramlar ve tarihsel bağlam",
      "sanat yapıtı ve estetik deneyim",
      "modern ve çağdaş kuramsal yaklaşımlar",
      "sanatçı, yapıt ve izleyici ilişkisi",
      "biçim ve içerik tartışmaları",
      "temsiliyet ve anlam üretimi",
      "eleştirel çözümleme yöntemleri",
      "görsel kültür ve toplumsal bağlam",
      "mekân, kimlik ve bellek",
      "disiplinler arası kuramsal ilişkiler",
      "seçilmiş yapıtların karşılaştırılması",
      "güncel sanat tartışmaları",
      "etik, kültürel miras ve telif boyutu",
      "kuramsal metinlerin eleştirel değerlendirilmesi",
      "sanat kuramının üretim pratiğiyle ilişkilendirilmesi"
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
          1,
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
          3,
          5,
          2,
          5,
          5,
          3,
          5,
          3,
          3,
          5
        ]
      },
      {
        "outcome": "DÖÇ3",
        "values": [
          3,
          3,
          4,
          1,
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
        "outcome": "DÖÇ4",
        "values": [
          2,
          2,
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
        "outcome": "DÖÇ5",
        "values": [
          3,
          3,
          4,
          1,
          4,
          4,
          3,
          4,
          3,
          3,
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
        "status": "Revize Edildi"
      },
      {
        "item": "Eksik/doğrulanması gereken alan kaldı mı?",
        "status": "Doğrulanmalı"
      }
    ],
    "publicQualityChecklist": false
  },
  {
    "department": "Resim ASD",
    "programName": "Resim",
    "level": "Tezsiz Yüksek Lisans",
    "code": "RES709",
    "name": "Çağdaş türk resim sanatı",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Doç. SELMA ŞAHİN",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Öğrencinin Türk resim sanatı ve sanat tarihi alanındaki ileri bilgi ve yaklaşımları sanatsal üretim ve eleştirel değerlendirme süreçlerinde kullanmasını sağlamak.",
    "content": "Çağdaş türk resim sanatı; dönemin tarihsel ve kültürel çerçevesi, sanatsal dönüşümün temel dinamikleri, başlıca sanatçılar ve eğilimler, üslup, teknik ve malzeme özellikleri, kurumlar, sergiler ve sanat ortamı, toplumsal değişim ve görsel temsil, seçilmiş yapıtların biçimsel çözümlemesi, seçilmiş yapıtların bağlamsal çözümlemesi, yerel ve uluslararası etkileşimler, modernleşme ve kimlik tartışmaları boyutlarıyla ele alınır.",
    "methods": "Anlatım, görsel kaynak incelemesi, yapıt çözümlemesi, atölye veya örnek olay uygulamaları ve yapılandırılmış akademik tartışma.",
    "resources": "Dersin kapsamına uygun güncel kitaplar, hakemli sanat ve tasarım literatürü, müze ve koleksiyon katalogları ile görsel arşivler.",
    "sdgs": [
      "4",
      "8",
      "11"
    ],
    "outcomes": [
      "Çağdaş türk resim sanatı alanındaki ileri kavram ve yaklaşımları analiz eder.",
      "üslup, teknik ve malzeme özellikleri ile ilişkili örnekleri uygun ölçütlerle karşılaştırır.",
      "seçilmiş yapıtların bağlamsal çözümlemesi bağlamında görsel veya kuramsal verileri yorumlar.",
      "eleştiri yazını ve sanat tarihi anlatıları doğrultusunda özgün çözüm ya da değerlendirme geliştirir.",
      "Çağdaş türk resim sanatı kapsamındaki çalışmaları sanatsal, mesleki ve etik ölçütlerle değerlendirir."
    ],
    "weeklyTopics": [
      "dönemin tarihsel ve kültürel çerçevesi",
      "sanatsal dönüşümün temel dinamikleri",
      "başlıca sanatçılar ve eğilimler",
      "üslup, teknik ve malzeme özellikleri",
      "kurumlar, sergiler ve sanat ortamı",
      "toplumsal değişim ve görsel temsil",
      "seçilmiş yapıtların biçimsel çözümlemesi",
      "seçilmiş yapıtların bağlamsal çözümlemesi",
      "yerel ve uluslararası etkileşimler",
      "modernleşme ve kimlik tartışmaları",
      "eleştiri yazını ve sanat tarihi anlatıları",
      "dönemler arası karşılaştırmalar",
      "güncel yorum ve yeniden okumalar",
      "koruma, telif ve etik sorumluluklar",
      "Türk resim sanatının bütüncül değerlendirilmesi"
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
          4,
          2,
          2,
          2,
          2,
          4
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
          5,
          3,
          3,
          3,
          3,
          5
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
          4,
          3,
          3,
          3,
          3,
          4
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
          5,
          2,
          2,
          2,
          2,
          5
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
          4,
          3,
          3,
          3,
          3,
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
        "status": "Revize Edildi"
      },
      {
        "item": "Eksik/doğrulanması gereken alan kaldı mı?",
        "status": "Doğrulanmalı"
      }
    ],
    "publicQualityChecklist": false
  },
  {
    "department": "Resim ASD",
    "programName": "Resim",
    "level": "Tezsiz Yüksek Lisans",
    "code": "RES711",
    "name": "Sanat, tasarım ve kent",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Doç. SELMA ŞAHİN",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Öğrencinin sanat kuramı ve eleştirisi alanındaki ileri bilgi ve yaklaşımları sanatsal üretim ve eleştirel değerlendirme süreçlerinde kullanmasını sağlamak.",
    "content": "Sanat, tasarım ve kent; temel kavramlar ve tarihsel bağlam, sanat yapıtı ve estetik deneyim, modern ve çağdaş kuramsal yaklaşımlar, sanatçı, yapıt ve izleyici ilişkisi, biçim ve içerik tartışmaları, temsiliyet ve anlam üretimi, eleştirel çözümleme yöntemleri, görsel kültür ve toplumsal bağlam, mekân, kimlik ve bellek, disiplinler arası kuramsal ilişkiler boyutlarıyla ele alınır.",
    "methods": "Anlatım, görsel kaynak incelemesi, yapıt çözümlemesi, atölye veya örnek olay uygulamaları ve yapılandırılmış akademik tartışma.",
    "resources": "Dersin kapsamına uygun güncel kitaplar, hakemli sanat ve tasarım literatürü, müze ve koleksiyon katalogları ile görsel arşivler.",
    "sdgs": [
      "4",
      "8",
      "11"
    ],
    "outcomes": [
      "Sanat, tasarım ve kent alanındaki ileri kavram ve yaklaşımları analiz eder.",
      "sanatçı, yapıt ve izleyici ilişkisi ile ilişkili örnekleri uygun ölçütlerle karşılaştırır.",
      "görsel kültür ve toplumsal bağlam bağlamında görsel veya kuramsal verileri yorumlar.",
      "seçilmiş yapıtların karşılaştırılması doğrultusunda özgün çözüm ya da değerlendirme geliştirir.",
      "Sanat, tasarım ve kent kapsamındaki çalışmaları sanatsal, mesleki ve etik ölçütlerle değerlendirir."
    ],
    "weeklyTopics": [
      "temel kavramlar ve tarihsel bağlam",
      "sanat yapıtı ve estetik deneyim",
      "modern ve çağdaş kuramsal yaklaşımlar",
      "sanatçı, yapıt ve izleyici ilişkisi",
      "biçim ve içerik tartışmaları",
      "temsiliyet ve anlam üretimi",
      "eleştirel çözümleme yöntemleri",
      "görsel kültür ve toplumsal bağlam",
      "mekân, kimlik ve bellek",
      "disiplinler arası kuramsal ilişkiler",
      "seçilmiş yapıtların karşılaştırılması",
      "güncel sanat tartışmaları",
      "etik, kültürel miras ve telif boyutu",
      "kuramsal metinlerin eleştirel değerlendirilmesi",
      "sanat kuramının üretim pratiğiyle ilişkilendirilmesi"
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
          1,
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
          3,
          5,
          2,
          5,
          5,
          3,
          5,
          3,
          3,
          5
        ]
      },
      {
        "outcome": "DÖÇ3",
        "values": [
          3,
          3,
          4,
          1,
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
        "outcome": "DÖÇ4",
        "values": [
          2,
          2,
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
        "outcome": "DÖÇ5",
        "values": [
          3,
          3,
          4,
          1,
          4,
          4,
          3,
          4,
          3,
          3,
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
        "status": "Revize Edildi"
      },
      {
        "item": "Eksik/doğrulanması gereken alan kaldı mı?",
        "status": "Doğrulanmalı"
      }
    ],
    "publicQualityChecklist": false
  },
  {
    "department": "Resim ASD",
    "programName": "Resim",
    "level": "Tezsiz Yüksek Lisans",
    "code": "RES713",
    "name": "Resim sanatında yapıt çözümlemeleri",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Prof. ALİ ASKER BAL",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Öğrencinin sanat kuramı ve eleştirisi alanındaki ileri bilgi ve yaklaşımları sanatsal üretim ve eleştirel değerlendirme süreçlerinde kullanmasını sağlamak.",
    "content": "Resim sanatında yapıt çözümlemeleri; temel kavramlar ve tarihsel bağlam, sanat yapıtı ve estetik deneyim, modern ve çağdaş kuramsal yaklaşımlar, sanatçı, yapıt ve izleyici ilişkisi, biçim ve içerik tartışmaları, temsiliyet ve anlam üretimi, eleştirel çözümleme yöntemleri, görsel kültür ve toplumsal bağlam, mekân, kimlik ve bellek, disiplinler arası kuramsal ilişkiler boyutlarıyla ele alınır.",
    "methods": "Anlatım, görsel kaynak incelemesi, yapıt çözümlemesi, atölye veya örnek olay uygulamaları ve yapılandırılmış akademik tartışma.",
    "resources": "Dersin kapsamına uygun güncel kitaplar, hakemli sanat ve tasarım literatürü, müze ve koleksiyon katalogları ile görsel arşivler.",
    "sdgs": [
      "4",
      "8",
      "11"
    ],
    "outcomes": [
      "Resim sanatında yapıt çözümlemeleri alanındaki ileri kavram ve yaklaşımları analiz eder.",
      "sanatçı, yapıt ve izleyici ilişkisi ile ilişkili örnekleri uygun ölçütlerle karşılaştırır.",
      "görsel kültür ve toplumsal bağlam bağlamında görsel veya kuramsal verileri yorumlar.",
      "seçilmiş yapıtların karşılaştırılması doğrultusunda özgün çözüm ya da değerlendirme geliştirir.",
      "Resim sanatında yapıt çözümlemeleri kapsamındaki çalışmaları sanatsal, mesleki ve etik ölçütlerle değerlendirir."
    ],
    "weeklyTopics": [
      "temel kavramlar ve tarihsel bağlam",
      "sanat yapıtı ve estetik deneyim",
      "modern ve çağdaş kuramsal yaklaşımlar",
      "sanatçı, yapıt ve izleyici ilişkisi",
      "biçim ve içerik tartışmaları",
      "temsiliyet ve anlam üretimi",
      "eleştirel çözümleme yöntemleri",
      "görsel kültür ve toplumsal bağlam",
      "mekân, kimlik ve bellek",
      "disiplinler arası kuramsal ilişkiler",
      "seçilmiş yapıtların karşılaştırılması",
      "güncel sanat tartışmaları",
      "etik, kültürel miras ve telif boyutu",
      "kuramsal metinlerin eleştirel değerlendirilmesi",
      "sanat kuramının üretim pratiğiyle ilişkilendirilmesi"
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
          1,
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
          3,
          5,
          2,
          5,
          5,
          3,
          5,
          3,
          3,
          5
        ]
      },
      {
        "outcome": "DÖÇ3",
        "values": [
          3,
          3,
          4,
          1,
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
        "outcome": "DÖÇ4",
        "values": [
          2,
          2,
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
        "outcome": "DÖÇ5",
        "values": [
          3,
          3,
          4,
          1,
          4,
          4,
          3,
          4,
          3,
          3,
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
        "status": "Revize Edildi"
      },
      {
        "item": "Eksik/doğrulanması gereken alan kaldı mı?",
        "status": "Doğrulanmalı"
      }
    ],
    "publicQualityChecklist": false
  },
  {
    "department": "Resim ASD",
    "programName": "Resim",
    "level": "Tezsiz Yüksek Lisans",
    "code": "RES715",
    "name": "Güzel sanatlar alanında telif uygulamaları ve...",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Prof. Dr. OSMAN ALTINTAŞ",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Öğrencinin sanat hukuku ve telif uygulamaları alanındaki ileri bilgi ve yaklaşımları sanatsal üretim ve eleştirel değerlendirme süreçlerinde kullanmasını sağlamak.",
    "content": "Güzel sanatlar alanında telif uygulamaları ve...; fikri mülkiyetin temel kavramları, eser ve eser sahibi kavramı, mali ve manevi haklar, telif hakkının doğumu ve süresi, çoğaltma, yayma ve temsil hakları, dijital ortamda sanat ve telif, alıntı, esinlenme ve intihal ayrımı, lisanslama ve sözleşme ilkeleri, sergi ve yayın uygulamalarında haklar, koleksiyon, müze ve galeri sorumlulukları boyutlarıyla ele alınır.",
    "methods": "Anlatım, görsel kaynak incelemesi, yapıt çözümlemesi, atölye veya örnek olay uygulamaları ve yapılandırılmış akademik tartışma.",
    "resources": "Dersin kapsamına uygun güncel kitaplar, hakemli sanat ve tasarım literatürü, müze ve koleksiyon katalogları ile görsel arşivler.",
    "sdgs": [
      "4",
      "8",
      "11"
    ],
    "outcomes": [
      "Güzel sanatlar alanında telif uygulamaları ve... alanındaki ileri kavram ve yaklaşımları analiz eder.",
      "telif hakkının doğumu ve süresi ile ilişkili örnekleri uygun ölçütlerle karşılaştırır.",
      "lisanslama ve sözleşme ilkeleri bağlamında görsel veya kuramsal verileri yorumlar.",
      "görsel örnekler üzerinden uyuşmazlık çözümlemesi doğrultusunda özgün çözüm ya da değerlendirme geliştirir.",
      "Güzel sanatlar alanında telif uygulamaları ve... kapsamındaki çalışmaları sanatsal, mesleki ve etik ölçütlerle değerlendirir."
    ],
    "weeklyTopics": [
      "fikri mülkiyetin temel kavramları",
      "eser ve eser sahibi kavramı",
      "mali ve manevi haklar",
      "telif hakkının doğumu ve süresi",
      "çoğaltma, yayma ve temsil hakları",
      "dijital ortamda sanat ve telif",
      "alıntı, esinlenme ve intihal ayrımı",
      "lisanslama ve sözleşme ilkeleri",
      "sergi ve yayın uygulamalarında haklar",
      "koleksiyon, müze ve galeri sorumlulukları",
      "görsel örnekler üzerinden uyuşmazlık çözümlemesi",
      "yapay zekâ ve güncel telif tartışmaları",
      "mesleki etik ve sanatçı sorumluluğu",
      "hak ihlaline karşı başvuru yolları",
      "telif uygulamalarının bütüncül değerlendirilmesi"
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
          1,
          2,
          1,
          1,
          2,
          2,
          4,
          1,
          4,
          4,
          2
        ]
      },
      {
        "outcome": "DÖÇ2",
        "values": [
          2,
          3,
          2,
          2,
          3,
          3,
          5,
          2,
          5,
          5,
          3
        ]
      },
      {
        "outcome": "DÖÇ3",
        "values": [
          1,
          3,
          1,
          1,
          3,
          3,
          4,
          1,
          4,
          4,
          3
        ]
      },
      {
        "outcome": "DÖÇ4",
        "values": [
          2,
          2,
          2,
          2,
          2,
          2,
          5,
          2,
          5,
          5,
          2
        ]
      },
      {
        "outcome": "DÖÇ5",
        "values": [
          1,
          3,
          1,
          1,
          3,
          3,
          4,
          1,
          4,
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
  },
  {
    "department": "Resim ASD",
    "programName": "Resim",
    "level": "Tezsiz Yüksek Lisans",
    "code": "RES717",
    "name": "Görsel algılama renk ve biçim",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "instructor": "Atama Bekliyor",
    "purpose": "Öğrencinin görsel algı, renk ve biçim alanındaki ileri bilgi ve yaklaşımları sanatsal üretim ve eleştirel değerlendirme süreçlerinde kullanmasını sağlamak.",
    "content": "Görsel algılama renk ve biçim; görsel algının temel ilkeleri, figür-zemin ve örgütleme, renk kuramları ve renk sistemleri, renk karşıtlıkları ve armoni, biçim, oran ve ritim, ışık, ton ve derinlik algısı, mekânsal örgütleme, görsel hiyerarşi ve odak, algı yanılsamaları, renk ve biçimin anlatımsal işlevi boyutlarıyla ele alınır.",
    "methods": "Anlatım, görsel kaynak incelemesi, yapıt çözümlemesi, atölye veya örnek olay uygulamaları ve yapılandırılmış akademik tartışma.",
    "resources": "Dersin kapsamına uygun güncel kitaplar, hakemli sanat ve tasarım literatürü, müze ve koleksiyon katalogları ile görsel arşivler.",
    "sdgs": [
      "4",
      "8",
      "11"
    ],
    "outcomes": [
      "Görsel algılama renk ve biçim alanındaki ileri kavram ve yaklaşımları analiz eder.",
      "renk karşıtlıkları ve armoni ile ilişkili örnekleri uygun ölçütlerle karşılaştırır.",
      "görsel hiyerarşi ve odak bağlamında görsel veya kuramsal verileri yorumlar.",
      "seçilmiş yapıtların algısal çözümlemesi doğrultusunda özgün çözüm ya da değerlendirme geliştirir.",
      "Görsel algılama renk ve biçim kapsamındaki çalışmaları sanatsal, mesleki ve etik ölçütlerle değerlendirir."
    ],
    "weeklyTopics": [
      "görsel algının temel ilkeleri",
      "figür-zemin ve örgütleme",
      "renk kuramları ve renk sistemleri",
      "renk karşıtlıkları ve armoni",
      "biçim, oran ve ritim",
      "ışık, ton ve derinlik algısı",
      "mekânsal örgütleme",
      "görsel hiyerarşi ve odak",
      "algı yanılsamaları",
      "renk ve biçimin anlatımsal işlevi",
      "seçilmiş yapıtların algısal çözümlemesi",
      "malzeme ve yüzey etkileri",
      "dijital araçlarda renk yönetimi",
      "özgün görsel düzenlemelerin geliştirilmesi",
      "algısal kararların sanatsal değerlendirilmesi"
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
          4,
          2,
          4,
          2,
          2,
          1,
          1,
          2
        ]
      },
      {
        "outcome": "DÖÇ2",
        "values": [
          3,
          5,
          5,
          5,
          3,
          5,
          3,
          3,
          2,
          2,
          3
        ]
      },
      {
        "outcome": "DÖÇ3",
        "values": [
          3,
          4,
          4,
          4,
          3,
          4,
          3,
          3,
          1,
          1,
          3
        ]
      },
      {
        "outcome": "DÖÇ4",
        "values": [
          2,
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
          3,
          4,
          4,
          4,
          3,
          4,
          3,
          3,
          1,
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
        "status": "Revize Edildi"
      },
      {
        "item": "Eksik/doğrulanması gereken alan kaldı mı?",
        "status": "Doğrulanmalı"
      }
    ],
    "publicQualityChecklist": false
  },
  {
    "department": "Resim ASD",
    "programName": "Resim",
    "level": "Tezsiz Yüksek Lisans",
    "code": "RES719",
    "name": "Sanat sosyolojisi",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "instructor": "Atama Bekliyor",
    "purpose": "Sanatın toplumsal bir süreç ve olgu olarak kavranması ve tartışılması.",
    "content": "Sanatın sosyolojik anlamı ve önemi. Sanat sosyolojisinde kullanılan temel metodolojik yaklaşımlar. Sanatın kurumsal yapısı ve sosyal sınırları. Sanatın temel sosyal fonksiyonları. Sanatın milliliği ve evrenselliği. Sanat ve toplum ilişkisi. Sanatın çevreye, çevrenin sanata etkisi. Sanatın temelleri. Sanat ve insan duyguları. Sanatın felsefesi. Sanatın toplumsal kaynağı. Din-sanat ilişkisi. Sanatın kültür içindeki yeri. Sanatçı ve sanatta kişilik. Sanat akımları.",
    "methods": "Anlatım, görsel kaynak incelemesi, yapıt çözümlemesi, atölye veya örnek olay uygulamaları ve yapılandırılmış akademik tartışma.",
    "resources": "Dersin kapsamına uygun güncel kitaplar, hakemli sanat ve tasarım literatürü, müze ve koleksiyon katalogları ile görsel arşivler.",
    "sdgs": [
      "4",
      "8",
      "11"
    ],
    "outcomes": [
      "Sanat sosyolojisi alanındaki ileri kavram ve yaklaşımları analiz eder.",
      "sanatçı, yapıt ve izleyici ilişkisi ile ilişkili örnekleri uygun ölçütlerle karşılaştırır.",
      "görsel kültür ve toplumsal bağlam bağlamında görsel veya kuramsal verileri yorumlar.",
      "seçilmiş yapıtların karşılaştırılması doğrultusunda özgün çözüm ya da değerlendirme geliştirir.",
      "Sanat sosyolojisi kapsamındaki çalışmaları sanatsal, mesleki ve etik ölçütlerle değerlendirir."
    ],
    "weeklyTopics": [
      "Ders tanımı, işlenişi ve notlandırma, çalışma bilgisi",
      "Sosyolojinin konusu olarak sanat. Sanatta değişim",
      "Sanat ve toplum ilişkisi.",
      "Sanat eseri ve sanat kuramları",
      "Sanatın sosyal işlevi",
      "Eser incelemesi",
      "Sanatın sosyolojik yönü; sanat ve kültür kavramları.",
      "Sanat nesnesinin sosyolojik okuması",
      "Sosyoloji tartışmaları ve sanat. Ulusallık evrensellik yerellik sorunsalı.",
      "Örnek sanat eserlerinin içerik olarak incelenmesi",
      "temel kavramlar ve tarihsel bağlam",
      "sanat yapıtı ve estetik deneyim",
      "modern ve çağdaş kuramsal yaklaşımlar",
      "sanatçı, yapıt ve izleyici ilişkisi",
      "biçim ve içerik tartışmaları"
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
          1,
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
          3,
          5,
          2,
          5,
          5,
          3,
          5,
          3,
          3,
          5
        ]
      },
      {
        "outcome": "DÖÇ3",
        "values": [
          3,
          3,
          4,
          1,
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
        "outcome": "DÖÇ4",
        "values": [
          2,
          2,
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
        "outcome": "DÖÇ5",
        "values": [
          3,
          3,
          4,
          1,
          4,
          4,
          3,
          4,
          3,
          3,
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
        "status": "Revize Edildi"
      },
      {
        "item": "Eksik/doğrulanması gereken alan kaldı mı?",
        "status": "Doğrulanmalı"
      }
    ],
    "publicQualityChecklist": false
  },
  {
    "department": "Resim ASD",
    "programName": "Resim",
    "level": "Tezsiz Yüksek Lisans",
    "code": "RES721",
    "name": "Sanat ontolojisi",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "instructor": "Atama Bekliyor",
    "purpose": "Sanat yapıtının ontolojik analizi. Sanat yapıtının varlık tabakaları. Sanatçı ve sanat alımlayıcısının yapıtı anlamlandırmadaki rolleri.",
    "content": "Ontolojiye giriş ve temel kavramlar. Klasik ontoloji, modern ontoloji. Sanat ontolojisinin temel kavramları. Estetik obje analizi.",
    "methods": "Anlatım, görsel kaynak incelemesi, yapıt çözümlemesi, atölye veya örnek olay uygulamaları ve yapılandırılmış akademik tartışma.",
    "resources": "Dersin kapsamına uygun güncel kitaplar, hakemli sanat ve tasarım literatürü, müze ve koleksiyon katalogları ile görsel arşivler.",
    "sdgs": [
      "4",
      "8",
      "11"
    ],
    "outcomes": [
      "Sanat ontolojisi alanındaki ileri kavram ve yaklaşımları analiz eder.",
      "sanatçı, yapıt ve izleyici ilişkisi ile ilişkili örnekleri uygun ölçütlerle karşılaştırır.",
      "görsel kültür ve toplumsal bağlam bağlamında görsel veya kuramsal verileri yorumlar.",
      "seçilmiş yapıtların karşılaştırılması doğrultusunda özgün çözüm ya da değerlendirme geliştirir.",
      "Sanat ontolojisi kapsamındaki çalışmaları sanatsal, mesleki ve etik ölçütlerle değerlendirir."
    ],
    "weeklyTopics": [
      "Ontolojiye giriş.",
      "Klasik ontoloji, modern ontoloji",
      "Ontolojinin var olan kavrayışı",
      "Varlık tabakaları",
      "Varlık kategorileri",
      "Varlık tarzlarının verilişi",
      "Sanat ontolojisinin kuruluşu",
      "Nicolai Hartmann’ın estetik obje analizi",
      "Roman İngarden’in estetik obje analizi",
      "Estetik obje analizi",
      "Sanat yapıtının varlık tabakaları",
      "Resimde varlık tabakaları",
      "Sanat yapıtının ontik yapısı ve estetik değer",
      "Estetik değerin kavranması",
      "temel kavramlar ve tarihsel bağlam"
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
          1,
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
          3,
          5,
          2,
          5,
          5,
          3,
          5,
          3,
          3,
          5
        ]
      },
      {
        "outcome": "DÖÇ3",
        "values": [
          3,
          3,
          4,
          1,
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
        "outcome": "DÖÇ4",
        "values": [
          2,
          2,
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
        "outcome": "DÖÇ5",
        "values": [
          3,
          3,
          4,
          1,
          4,
          4,
          3,
          4,
          3,
          3,
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
        "status": "Revize Edildi"
      },
      {
        "item": "Eksik/doğrulanması gereken alan kaldı mı?",
        "status": "Doğrulanmalı"
      }
    ],
    "publicQualityChecklist": false
  },
  {
    "department": "Resim ASD",
    "programName": "Resim",
    "level": "Tezsiz Yüksek Lisans",
    "code": "RES723",
    "name": "Çağdaş müzecilik ve kuramları",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "instructor": "Atama Bekliyor",
    "purpose": "Öğrencinin çağdaş müzecilik ve sergileme alanındaki ileri bilgi ve yaklaşımları sanatsal üretim ve eleştirel değerlendirme süreçlerinde kullanmasını sağlamak.",
    "content": "Çağdaş müzecilik ve kuramları; müze kavramının tarihsel dönüşümü, çağdaş müzecilik kuramları, koleksiyon geliştirme ve yönetimi, belgeleme ve envanter ilkeleri, koruma ve bakım sorumlulukları, küratöryel yaklaşım ve seçki oluşturma, sergileme tasarımı ve mekân, izleyici geliştirme ve erişilebilirlik, eğitim ve kamusal programlar, dijital müzecilik uygulamaları boyutlarıyla ele alınır.",
    "methods": "Anlatım, görsel kaynak incelemesi, yapıt çözümlemesi, atölye veya örnek olay uygulamaları ve yapılandırılmış akademik tartışma.",
    "resources": "Dersin kapsamına uygun güncel kitaplar, hakemli sanat ve tasarım literatürü, müze ve koleksiyon katalogları ile görsel arşivler.",
    "sdgs": [
      "4",
      "8",
      "11"
    ],
    "outcomes": [
      "Çağdaş müzecilik ve kuramları alanındaki ileri kavram ve yaklaşımları analiz eder.",
      "belgeleme ve envanter ilkeleri ile ilişkili örnekleri uygun ölçütlerle karşılaştırır.",
      "izleyici geliştirme ve erişilebilirlik bağlamında görsel veya kuramsal verileri yorumlar.",
      "müze iletişimi ve yorumlama doğrultusunda özgün çözüm ya da değerlendirme geliştirir.",
      "Çağdaş müzecilik ve kuramları kapsamındaki çalışmaları sanatsal, mesleki ve etik ölçütlerle değerlendirir."
    ],
    "weeklyTopics": [
      "müze kavramının tarihsel dönüşümü",
      "çağdaş müzecilik kuramları",
      "koleksiyon geliştirme ve yönetimi",
      "belgeleme ve envanter ilkeleri",
      "koruma ve bakım sorumlulukları",
      "küratöryel yaklaşım ve seçki oluşturma",
      "sergileme tasarımı ve mekân",
      "izleyici geliştirme ve erişilebilirlik",
      "eğitim ve kamusal programlar",
      "dijital müzecilik uygulamaları",
      "müze iletişimi ve yorumlama",
      "etik, köken araştırması ve kültürel miras",
      "çağdaş müze örneklerinin karşılaştırılması",
      "sergi değerlendirme ölçütleri",
      "müzecilikte güncel yönelimlerin değerlendirilmesi"
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
          1,
          2,
          2,
          1,
          4,
          2,
          4,
          2,
          4,
          4,
          4
        ]
      },
      {
        "outcome": "DÖÇ2",
        "values": [
          2,
          3,
          3,
          2,
          5,
          3,
          5,
          3,
          5,
          5,
          5
        ]
      },
      {
        "outcome": "DÖÇ3",
        "values": [
          1,
          3,
          3,
          1,
          4,
          3,
          4,
          3,
          4,
          4,
          4
        ]
      },
      {
        "outcome": "DÖÇ4",
        "values": [
          2,
          2,
          2,
          2,
          5,
          2,
          5,
          2,
          5,
          5,
          5
        ]
      },
      {
        "outcome": "DÖÇ5",
        "values": [
          1,
          3,
          3,
          1,
          4,
          3,
          4,
          3,
          4,
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
        "status": "Revize Edildi"
      },
      {
        "item": "Eksik/doğrulanması gereken alan kaldı mı?",
        "status": "Doğrulanmalı"
      }
    ],
    "publicQualityChecklist": false
  },
  {
    "department": "Resim ASD",
    "programName": "Resim",
    "level": "Tezsiz Yüksek Lisans",
    "code": "RES704",
    "name": "Bilimsel araştırma yöntemleri ve yayın etiği",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "instructor": "Atama Bekliyor",
    "purpose": "- Bilimsel araştırma süreciyle ilgili temel kavramları tanımak- Bilimin ve bilimsel araştırmanın önemini kavramak- Bilimle ve bilimsel araştırmayla ilgili farklı kaynakları tanımak- Bilimsel araştırma süreci hakkında bilgilenmek",
    "content": "1. Bilimsel Araştırma, bilimsel araştırma süreçleri ve etik2. Bilimsel araştırmalarda temel kavramlar3. Ölçme ve değerlendirme/Ölçme aracında bulunması gereken nitelikler 4. Araştırma teknikleri ve modeller5. Nitel Araştırmalar (Testler)6. Nicel Araştırmalar (Test dışı teknikler)7. Evren-Örneklem, Örnekleme Yöntemleri8. Veri Toplama Araçları (Testler ve test dışı teknikler)9. Bilimsel Yöntemin Aşamaları10. Araştırma Önerisi Hazırlama",
    "methods": "Anlatım, görsel kaynak incelemesi, yapıt çözümlemesi, atölye veya örnek olay uygulamaları ve yapılandırılmış akademik tartışma.",
    "resources": "Dersin kapsamına uygun güncel kitaplar, hakemli sanat ve tasarım literatürü, müze ve koleksiyon katalogları ile görsel arşivler.",
    "sdgs": [
      "4",
      "8",
      "11"
    ],
    "outcomes": [
      "Bilimsel araştırma yöntemleri ve yayın etiği alanındaki ileri kavram ve yaklaşımları analiz eder.",
      "kaynak tarama ve eleştirel okuma ile ilişkili örnekleri uygun ölçütlerle karşılaştırır.",
      "veri çözümleme ve yorumlama bağlamında görsel veya kuramsal verileri yorumlar.",
      "sanat araştırmalarında özgünlük doğrultusunda özgün çözüm ya da değerlendirme geliştirir.",
      "Bilimsel araştırma yöntemleri ve yayın etiği kapsamındaki çalışmaları sanatsal, mesleki ve etik ölçütlerle değerlendirir."
    ],
    "weeklyTopics": [
      "Bilimsel Araştırma, bilimsel araştırma süreçleri ve etik",
      "Bilimsel araştırmalarda temel kavramlar",
      "Ölçme ve değerlendirme",
      "Ölçme aracında bulunması gereken nitelikler",
      "Araştırma teknikleri ve modeller",
      "Nicel Araştırmalar (Test dışı teknikler)",
      "Nitel araştırmalar",
      "Evren-Örneklem, Örnekleme Yöntemleri",
      "Veri Toplama Araçları (Testler ve test dışı teknikler)",
      "Bilimsel Yöntemin Aşamaları (Problemin belirlenmesi ve Başlık oluşturma)",
      "Bilimsel Yöntemin Aşamaları (Giriş ve Yöntem)",
      "Bilimsel Yöntemin Aşamaları (Bulgular, tartışma)",
      "Bilimsel Yöntemin Aşamaları (Kaynakça ve APA)",
      "Araştırma Önerisi Hazırlama",
      "bilimsel bilgi ve sanat araştırmasının kapsamı"
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
          1,
          2,
          1,
          4,
          4,
          2,
          2,
          4,
          1,
          4
        ]
      },
      {
        "outcome": "DÖÇ2",
        "values": [
          3,
          2,
          3,
          2,
          5,
          5,
          3,
          3,
          5,
          2,
          5
        ]
      },
      {
        "outcome": "DÖÇ3",
        "values": [
          3,
          1,
          3,
          1,
          4,
          4,
          3,
          3,
          4,
          1,
          4
        ]
      },
      {
        "outcome": "DÖÇ4",
        "values": [
          2,
          2,
          2,
          2,
          5,
          5,
          2,
          2,
          5,
          2,
          5
        ]
      },
      {
        "outcome": "DÖÇ5",
        "values": [
          3,
          1,
          3,
          1,
          4,
          4,
          3,
          3,
          4,
          1,
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
        "status": "Revize Edildi"
      },
      {
        "item": "Eksik/doğrulanması gereken alan kaldı mı?",
        "status": "Doğrulanmalı"
      }
    ],
    "publicQualityChecklist": false
  },
  {
    "department": "Resim ASD",
    "programName": "Resim",
    "level": "Tezsiz Yüksek Lisans",
    "code": "RES706",
    "name": "Akademik yazı ve metin inceleme",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Doç. SELMA ŞAHİN",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Öğrencinin sanat araştırmaları ve akademik yazım alanındaki ileri bilgi ve yaklaşımları sanatsal üretim ve eleştirel değerlendirme süreçlerinde kullanmasını sağlamak.",
    "content": "Akademik yazı ve metin inceleme; bilimsel bilgi ve sanat araştırmasının kapsamı, araştırma problemi ve soru geliştirme, nitel ve nicel araştırma yaklaşımları, kaynak tarama ve eleştirel okuma, araştırma deseni ve örneklem, veri toplama araçları, görsel verinin belgelenmesi, veri çözümleme ve yorumlama, bilimsel yazım ve kaynak gösterme, yayın etiği ve araştırmacı sorumluluğu boyutlarıyla ele alınır.",
    "methods": "Anlatım, görsel kaynak incelemesi, yapıt çözümlemesi, atölye veya örnek olay uygulamaları ve yapılandırılmış akademik tartışma.",
    "resources": "Dersin kapsamına uygun güncel kitaplar, hakemli sanat ve tasarım literatürü, müze ve koleksiyon katalogları ile görsel arşivler.",
    "sdgs": [
      "4",
      "8",
      "11"
    ],
    "outcomes": [
      "Akademik yazı ve metin inceleme alanındaki ileri kavram ve yaklaşımları analiz eder.",
      "kaynak tarama ve eleştirel okuma ile ilişkili örnekleri uygun ölçütlerle karşılaştırır.",
      "veri çözümleme ve yorumlama bağlamında görsel veya kuramsal verileri yorumlar.",
      "sanat araştırmalarında özgünlük doğrultusunda özgün çözüm ya da değerlendirme geliştirir.",
      "Akademik yazı ve metin inceleme kapsamındaki çalışmaları sanatsal, mesleki ve etik ölçütlerle değerlendirir."
    ],
    "weeklyTopics": [
      "bilimsel bilgi ve sanat araştırmasının kapsamı",
      "araştırma problemi ve soru geliştirme",
      "nitel ve nicel araştırma yaklaşımları",
      "kaynak tarama ve eleştirel okuma",
      "araştırma deseni ve örneklem",
      "veri toplama araçları",
      "görsel verinin belgelenmesi",
      "veri çözümleme ve yorumlama",
      "bilimsel yazım ve kaynak gösterme",
      "yayın etiği ve araştırmacı sorumluluğu",
      "sanat araştırmalarında özgünlük",
      "araştırma raporunun yapılandırılması",
      "güncel sanat araştırmalarının karşılaştırılması",
      "etik uygunluk ve kalite güvencesi",
      "araştırma bulgularının bütüncül değerlendirilmesi"
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
          1,
          2,
          1,
          4,
          4,
          2,
          2,
          4,
          1,
          4
        ]
      },
      {
        "outcome": "DÖÇ2",
        "values": [
          3,
          2,
          3,
          2,
          5,
          5,
          3,
          3,
          5,
          2,
          5
        ]
      },
      {
        "outcome": "DÖÇ3",
        "values": [
          3,
          1,
          3,
          1,
          4,
          4,
          3,
          3,
          4,
          1,
          4
        ]
      },
      {
        "outcome": "DÖÇ4",
        "values": [
          2,
          2,
          2,
          2,
          5,
          5,
          2,
          2,
          5,
          2,
          5
        ]
      },
      {
        "outcome": "DÖÇ5",
        "values": [
          3,
          1,
          3,
          1,
          4,
          4,
          3,
          3,
          4,
          1,
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
        "status": "Revize Edildi"
      },
      {
        "item": "Eksik/doğrulanması gereken alan kaldı mı?",
        "status": "Doğrulanmalı"
      }
    ],
    "publicQualityChecklist": false
  },
  {
    "department": "Resim ASD",
    "programName": "Resim",
    "level": "Tezsiz Yüksek Lisans",
    "code": "RES708",
    "name": "Çağdaş sanat felsefesi ıı",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "instructor": "Atama Bekliyor",
    "purpose": "Öğrencinin sanat kuramı ve eleştirisi alanındaki ileri bilgi ve yaklaşımları sanatsal üretim ve eleştirel değerlendirme süreçlerinde kullanmasını sağlamak.",
    "content": "Çağdaş sanat felsefesi ıı; temel kavramlar ve tarihsel bağlam, sanat yapıtı ve estetik deneyim, modern ve çağdaş kuramsal yaklaşımlar, sanatçı, yapıt ve izleyici ilişkisi, biçim ve içerik tartışmaları, temsiliyet ve anlam üretimi, eleştirel çözümleme yöntemleri, görsel kültür ve toplumsal bağlam, mekân, kimlik ve bellek, disiplinler arası kuramsal ilişkiler boyutlarıyla ele alınır.",
    "methods": "Anlatım, görsel kaynak incelemesi, yapıt çözümlemesi, atölye veya örnek olay uygulamaları ve yapılandırılmış akademik tartışma.",
    "resources": "Dersin kapsamına uygun güncel kitaplar, hakemli sanat ve tasarım literatürü, müze ve koleksiyon katalogları ile görsel arşivler.",
    "sdgs": [
      "4",
      "8",
      "11"
    ],
    "outcomes": [
      "Çağdaş sanat felsefesi ıı alanındaki ileri kavram ve yaklaşımları analiz eder.",
      "sanatçı, yapıt ve izleyici ilişkisi ile ilişkili örnekleri uygun ölçütlerle karşılaştırır.",
      "görsel kültür ve toplumsal bağlam bağlamında görsel veya kuramsal verileri yorumlar.",
      "seçilmiş yapıtların karşılaştırılması doğrultusunda özgün çözüm ya da değerlendirme geliştirir.",
      "Çağdaş sanat felsefesi ıı kapsamındaki çalışmaları sanatsal, mesleki ve etik ölçütlerle değerlendirir."
    ],
    "weeklyTopics": [
      "temel kavramlar ve tarihsel bağlam",
      "sanat yapıtı ve estetik deneyim",
      "modern ve çağdaş kuramsal yaklaşımlar",
      "sanatçı, yapıt ve izleyici ilişkisi",
      "biçim ve içerik tartışmaları",
      "temsiliyet ve anlam üretimi",
      "eleştirel çözümleme yöntemleri",
      "görsel kültür ve toplumsal bağlam",
      "mekân, kimlik ve bellek",
      "disiplinler arası kuramsal ilişkiler",
      "seçilmiş yapıtların karşılaştırılması",
      "güncel sanat tartışmaları",
      "etik, kültürel miras ve telif boyutu",
      "kuramsal metinlerin eleştirel değerlendirilmesi",
      "sanat kuramının üretim pratiğiyle ilişkilendirilmesi"
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
          1,
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
          3,
          5,
          2,
          5,
          5,
          3,
          5,
          3,
          3,
          5
        ]
      },
      {
        "outcome": "DÖÇ3",
        "values": [
          3,
          3,
          4,
          1,
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
        "outcome": "DÖÇ4",
        "values": [
          2,
          2,
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
        "outcome": "DÖÇ5",
        "values": [
          3,
          3,
          4,
          1,
          4,
          4,
          3,
          4,
          3,
          3,
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
        "status": "Revize Edildi"
      },
      {
        "item": "Eksik/doğrulanması gereken alan kaldı mı?",
        "status": "Doğrulanmalı"
      }
    ],
    "publicQualityChecklist": false
  },
  {
    "department": "Resim ASD",
    "programName": "Resim",
    "level": "Tezsiz Yüksek Lisans",
    "code": "RES710",
    "name": "Çağdaş türk resim sanatı ıı",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Doç. SELMA ŞAHİN",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Öğrencinin Türk resim sanatı ve sanat tarihi alanındaki ileri bilgi ve yaklaşımları sanatsal üretim ve eleştirel değerlendirme süreçlerinde kullanmasını sağlamak.",
    "content": "Çağdaş türk resim sanatı ıı; dönemin tarihsel ve kültürel çerçevesi, sanatsal dönüşümün temel dinamikleri, başlıca sanatçılar ve eğilimler, üslup, teknik ve malzeme özellikleri, kurumlar, sergiler ve sanat ortamı, toplumsal değişim ve görsel temsil, seçilmiş yapıtların biçimsel çözümlemesi, seçilmiş yapıtların bağlamsal çözümlemesi, yerel ve uluslararası etkileşimler, modernleşme ve kimlik tartışmaları boyutlarıyla ele alınır.",
    "methods": "Anlatım, görsel kaynak incelemesi, yapıt çözümlemesi, atölye veya örnek olay uygulamaları ve yapılandırılmış akademik tartışma.",
    "resources": "Dersin kapsamına uygun güncel kitaplar, hakemli sanat ve tasarım literatürü, müze ve koleksiyon katalogları ile görsel arşivler.",
    "sdgs": [
      "4",
      "8",
      "11"
    ],
    "outcomes": [
      "Çağdaş türk resim sanatı ıı alanındaki ileri kavram ve yaklaşımları analiz eder.",
      "üslup, teknik ve malzeme özellikleri ile ilişkili örnekleri uygun ölçütlerle karşılaştırır.",
      "seçilmiş yapıtların bağlamsal çözümlemesi bağlamında görsel veya kuramsal verileri yorumlar.",
      "eleştiri yazını ve sanat tarihi anlatıları doğrultusunda özgün çözüm ya da değerlendirme geliştirir.",
      "Çağdaş türk resim sanatı ıı kapsamındaki çalışmaları sanatsal, mesleki ve etik ölçütlerle değerlendirir."
    ],
    "weeklyTopics": [
      "dönemin tarihsel ve kültürel çerçevesi",
      "sanatsal dönüşümün temel dinamikleri",
      "başlıca sanatçılar ve eğilimler",
      "üslup, teknik ve malzeme özellikleri",
      "kurumlar, sergiler ve sanat ortamı",
      "toplumsal değişim ve görsel temsil",
      "seçilmiş yapıtların biçimsel çözümlemesi",
      "seçilmiş yapıtların bağlamsal çözümlemesi",
      "yerel ve uluslararası etkileşimler",
      "modernleşme ve kimlik tartışmaları",
      "eleştiri yazını ve sanat tarihi anlatıları",
      "dönemler arası karşılaştırmalar",
      "güncel yorum ve yeniden okumalar",
      "koruma, telif ve etik sorumluluklar",
      "Türk resim sanatının bütüncül değerlendirilmesi"
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
          4,
          2,
          2,
          2,
          2,
          4
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
          5,
          3,
          3,
          3,
          3,
          5
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
          4,
          3,
          3,
          3,
          3,
          4
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
          5,
          2,
          2,
          2,
          2,
          5
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
          4,
          3,
          3,
          3,
          3,
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
        "status": "Revize Edildi"
      },
      {
        "item": "Eksik/doğrulanması gereken alan kaldı mı?",
        "status": "Doğrulanmalı"
      }
    ],
    "publicQualityChecklist": false
  },
  {
    "department": "Resim ASD",
    "programName": "Resim",
    "level": "Tezsiz Yüksek Lisans",
    "code": "RES712",
    "name": "Resim sanatında yapıt çözümlemeleri ıı",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Prof. ALİ ASKER BAL",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Öğrencinin sanat kuramı ve eleştirisi alanındaki ileri bilgi ve yaklaşımları sanatsal üretim ve eleştirel değerlendirme süreçlerinde kullanmasını sağlamak.",
    "content": "Resim sanatında yapıt çözümlemeleri ıı; temel kavramlar ve tarihsel bağlam, sanat yapıtı ve estetik deneyim, modern ve çağdaş kuramsal yaklaşımlar, sanatçı, yapıt ve izleyici ilişkisi, biçim ve içerik tartışmaları, temsiliyet ve anlam üretimi, eleştirel çözümleme yöntemleri, görsel kültür ve toplumsal bağlam, mekân, kimlik ve bellek, disiplinler arası kuramsal ilişkiler boyutlarıyla ele alınır.",
    "methods": "Anlatım, görsel kaynak incelemesi, yapıt çözümlemesi, atölye veya örnek olay uygulamaları ve yapılandırılmış akademik tartışma.",
    "resources": "Dersin kapsamına uygun güncel kitaplar, hakemli sanat ve tasarım literatürü, müze ve koleksiyon katalogları ile görsel arşivler.",
    "sdgs": [
      "4",
      "8",
      "11"
    ],
    "outcomes": [
      "Resim sanatında yapıt çözümlemeleri ıı alanındaki ileri kavram ve yaklaşımları analiz eder.",
      "sanatçı, yapıt ve izleyici ilişkisi ile ilişkili örnekleri uygun ölçütlerle karşılaştırır.",
      "görsel kültür ve toplumsal bağlam bağlamında görsel veya kuramsal verileri yorumlar.",
      "seçilmiş yapıtların karşılaştırılması doğrultusunda özgün çözüm ya da değerlendirme geliştirir.",
      "Resim sanatında yapıt çözümlemeleri ıı kapsamındaki çalışmaları sanatsal, mesleki ve etik ölçütlerle değerlendirir."
    ],
    "weeklyTopics": [
      "temel kavramlar ve tarihsel bağlam",
      "sanat yapıtı ve estetik deneyim",
      "modern ve çağdaş kuramsal yaklaşımlar",
      "sanatçı, yapıt ve izleyici ilişkisi",
      "biçim ve içerik tartışmaları",
      "temsiliyet ve anlam üretimi",
      "eleştirel çözümleme yöntemleri",
      "görsel kültür ve toplumsal bağlam",
      "mekân, kimlik ve bellek",
      "disiplinler arası kuramsal ilişkiler",
      "seçilmiş yapıtların karşılaştırılması",
      "güncel sanat tartışmaları",
      "etik, kültürel miras ve telif boyutu",
      "kuramsal metinlerin eleştirel değerlendirilmesi",
      "sanat kuramının üretim pratiğiyle ilişkilendirilmesi"
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
          1,
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
          3,
          5,
          2,
          5,
          5,
          3,
          5,
          3,
          3,
          5
        ]
      },
      {
        "outcome": "DÖÇ3",
        "values": [
          3,
          3,
          4,
          1,
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
        "outcome": "DÖÇ4",
        "values": [
          2,
          2,
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
        "outcome": "DÖÇ5",
        "values": [
          3,
          3,
          4,
          1,
          4,
          4,
          3,
          4,
          3,
          3,
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
        "status": "Revize Edildi"
      },
      {
        "item": "Eksik/doğrulanması gereken alan kaldı mı?",
        "status": "Doğrulanmalı"
      }
    ],
    "publicQualityChecklist": false
  },
  {
    "department": "Resim ASD",
    "programName": "Resim",
    "level": "Tezsiz Yüksek Lisans",
    "code": "RES716",
    "name": "Sanat,tasarım ve kent ıı",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "instructor": "Atama Bekliyor",
    "purpose": "Öğrencinin sanat kuramı ve eleştirisi alanındaki ileri bilgi ve yaklaşımları sanatsal üretim ve eleştirel değerlendirme süreçlerinde kullanmasını sağlamak.",
    "content": "Sanat,tasarım ve kent ıı; temel kavramlar ve tarihsel bağlam, sanat yapıtı ve estetik deneyim, modern ve çağdaş kuramsal yaklaşımlar, sanatçı, yapıt ve izleyici ilişkisi, biçim ve içerik tartışmaları, temsiliyet ve anlam üretimi, eleştirel çözümleme yöntemleri, görsel kültür ve toplumsal bağlam, mekân, kimlik ve bellek, disiplinler arası kuramsal ilişkiler boyutlarıyla ele alınır.",
    "methods": "Anlatım, görsel kaynak incelemesi, yapıt çözümlemesi, atölye veya örnek olay uygulamaları ve yapılandırılmış akademik tartışma.",
    "resources": "Dersin kapsamına uygun güncel kitaplar, hakemli sanat ve tasarım literatürü, müze ve koleksiyon katalogları ile görsel arşivler.",
    "sdgs": [
      "4",
      "8",
      "11"
    ],
    "outcomes": [
      "Sanat,tasarım ve kent ıı alanındaki ileri kavram ve yaklaşımları analiz eder.",
      "sanatçı, yapıt ve izleyici ilişkisi ile ilişkili örnekleri uygun ölçütlerle karşılaştırır.",
      "görsel kültür ve toplumsal bağlam bağlamında görsel veya kuramsal verileri yorumlar.",
      "seçilmiş yapıtların karşılaştırılması doğrultusunda özgün çözüm ya da değerlendirme geliştirir.",
      "Sanat,tasarım ve kent ıı kapsamındaki çalışmaları sanatsal, mesleki ve etik ölçütlerle değerlendirir."
    ],
    "weeklyTopics": [
      "temel kavramlar ve tarihsel bağlam",
      "sanat yapıtı ve estetik deneyim",
      "modern ve çağdaş kuramsal yaklaşımlar",
      "sanatçı, yapıt ve izleyici ilişkisi",
      "biçim ve içerik tartışmaları",
      "temsiliyet ve anlam üretimi",
      "eleştirel çözümleme yöntemleri",
      "görsel kültür ve toplumsal bağlam",
      "mekân, kimlik ve bellek",
      "disiplinler arası kuramsal ilişkiler",
      "seçilmiş yapıtların karşılaştırılması",
      "güncel sanat tartışmaları",
      "etik, kültürel miras ve telif boyutu",
      "kuramsal metinlerin eleştirel değerlendirilmesi",
      "sanat kuramının üretim pratiğiyle ilişkilendirilmesi"
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
          1,
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
          3,
          5,
          2,
          5,
          5,
          3,
          5,
          3,
          3,
          5
        ]
      },
      {
        "outcome": "DÖÇ3",
        "values": [
          3,
          3,
          4,
          1,
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
        "outcome": "DÖÇ4",
        "values": [
          2,
          2,
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
        "outcome": "DÖÇ5",
        "values": [
          3,
          3,
          4,
          1,
          4,
          4,
          3,
          4,
          3,
          3,
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
        "status": "Revize Edildi"
      },
      {
        "item": "Eksik/doğrulanması gereken alan kaldı mı?",
        "status": "Doğrulanmalı"
      }
    ],
    "publicQualityChecklist": false
  },
  {
    "department": "Resim ASD",
    "programName": "Resim",
    "level": "Tezsiz Yüksek Lisans",
    "code": "RES718",
    "name": "Güzel sanatlar alanında telif uygulamaları v...",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Prof. Dr. OSMAN ALTINTAŞ",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Öğrencinin sanat hukuku ve telif uygulamaları alanındaki ileri bilgi ve yaklaşımları sanatsal üretim ve eleştirel değerlendirme süreçlerinde kullanmasını sağlamak.",
    "content": "Güzel sanatlar alanında telif uygulamaları v...; fikri mülkiyetin temel kavramları, eser ve eser sahibi kavramı, mali ve manevi haklar, telif hakkının doğumu ve süresi, çoğaltma, yayma ve temsil hakları, dijital ortamda sanat ve telif, alıntı, esinlenme ve intihal ayrımı, lisanslama ve sözleşme ilkeleri, sergi ve yayın uygulamalarında haklar, koleksiyon, müze ve galeri sorumlulukları boyutlarıyla ele alınır.",
    "methods": "Anlatım, görsel kaynak incelemesi, yapıt çözümlemesi, atölye veya örnek olay uygulamaları ve yapılandırılmış akademik tartışma.",
    "resources": "Dersin kapsamına uygun güncel kitaplar, hakemli sanat ve tasarım literatürü, müze ve koleksiyon katalogları ile görsel arşivler.",
    "sdgs": [
      "4",
      "8",
      "11"
    ],
    "outcomes": [
      "Güzel sanatlar alanında telif uygulamaları v... alanındaki ileri kavram ve yaklaşımları analiz eder.",
      "telif hakkının doğumu ve süresi ile ilişkili örnekleri uygun ölçütlerle karşılaştırır.",
      "lisanslama ve sözleşme ilkeleri bağlamında görsel veya kuramsal verileri yorumlar.",
      "görsel örnekler üzerinden uyuşmazlık çözümlemesi doğrultusunda özgün çözüm ya da değerlendirme geliştirir.",
      "Güzel sanatlar alanında telif uygulamaları v... kapsamındaki çalışmaları sanatsal, mesleki ve etik ölçütlerle değerlendirir."
    ],
    "weeklyTopics": [
      "fikri mülkiyetin temel kavramları",
      "eser ve eser sahibi kavramı",
      "mali ve manevi haklar",
      "telif hakkının doğumu ve süresi",
      "çoğaltma, yayma ve temsil hakları",
      "dijital ortamda sanat ve telif",
      "alıntı, esinlenme ve intihal ayrımı",
      "lisanslama ve sözleşme ilkeleri",
      "sergi ve yayın uygulamalarında haklar",
      "koleksiyon, müze ve galeri sorumlulukları",
      "görsel örnekler üzerinden uyuşmazlık çözümlemesi",
      "yapay zekâ ve güncel telif tartışmaları",
      "mesleki etik ve sanatçı sorumluluğu",
      "hak ihlaline karşı başvuru yolları",
      "telif uygulamalarının bütüncül değerlendirilmesi"
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
          1,
          2,
          1,
          1,
          2,
          2,
          4,
          1,
          4,
          4,
          2
        ]
      },
      {
        "outcome": "DÖÇ2",
        "values": [
          2,
          3,
          2,
          2,
          3,
          3,
          5,
          2,
          5,
          5,
          3
        ]
      },
      {
        "outcome": "DÖÇ3",
        "values": [
          1,
          3,
          1,
          1,
          3,
          3,
          4,
          1,
          4,
          4,
          3
        ]
      },
      {
        "outcome": "DÖÇ4",
        "values": [
          2,
          2,
          2,
          2,
          2,
          2,
          5,
          2,
          5,
          5,
          2
        ]
      },
      {
        "outcome": "DÖÇ5",
        "values": [
          1,
          3,
          1,
          1,
          3,
          3,
          4,
          1,
          4,
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
  },
  {
    "department": "Resim ASD",
    "programName": "Resim",
    "level": "Tezsiz Yüksek Lisans",
    "code": "RES720",
    "name": "Görsel algılama renk ve biçim 2",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Prof. Dr. OSMAN ALTINTAŞ",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Öğrencinin görsel algı, renk ve biçim alanındaki ileri bilgi ve yaklaşımları sanatsal üretim ve eleştirel değerlendirme süreçlerinde kullanmasını sağlamak.",
    "content": "Görsel algılama renk ve biçim 2; görsel algının temel ilkeleri, figür-zemin ve örgütleme, renk kuramları ve renk sistemleri, renk karşıtlıkları ve armoni, biçim, oran ve ritim, ışık, ton ve derinlik algısı, mekânsal örgütleme, görsel hiyerarşi ve odak, algı yanılsamaları, renk ve biçimin anlatımsal işlevi boyutlarıyla ele alınır.",
    "methods": "Anlatım, görsel kaynak incelemesi, yapıt çözümlemesi, atölye veya örnek olay uygulamaları ve yapılandırılmış akademik tartışma.",
    "resources": "Dersin kapsamına uygun güncel kitaplar, hakemli sanat ve tasarım literatürü, müze ve koleksiyon katalogları ile görsel arşivler.",
    "sdgs": [
      "4",
      "8",
      "11"
    ],
    "outcomes": [
      "Görsel algılama renk ve biçim 2 alanındaki ileri kavram ve yaklaşımları analiz eder.",
      "renk karşıtlıkları ve armoni ile ilişkili örnekleri uygun ölçütlerle karşılaştırır.",
      "görsel hiyerarşi ve odak bağlamında görsel veya kuramsal verileri yorumlar.",
      "seçilmiş yapıtların algısal çözümlemesi doğrultusunda özgün çözüm ya da değerlendirme geliştirir.",
      "Görsel algılama renk ve biçim 2 kapsamındaki çalışmaları sanatsal, mesleki ve etik ölçütlerle değerlendirir."
    ],
    "weeklyTopics": [
      "görsel algının temel ilkeleri",
      "figür-zemin ve örgütleme",
      "renk kuramları ve renk sistemleri",
      "renk karşıtlıkları ve armoni",
      "biçim, oran ve ritim",
      "ışık, ton ve derinlik algısı",
      "mekânsal örgütleme",
      "görsel hiyerarşi ve odak",
      "algı yanılsamaları",
      "renk ve biçimin anlatımsal işlevi",
      "seçilmiş yapıtların algısal çözümlemesi",
      "malzeme ve yüzey etkileri",
      "dijital araçlarda renk yönetimi",
      "özgün görsel düzenlemelerin geliştirilmesi",
      "algısal kararların sanatsal değerlendirilmesi"
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
          4,
          2,
          4,
          2,
          2,
          1,
          1,
          2
        ]
      },
      {
        "outcome": "DÖÇ2",
        "values": [
          3,
          5,
          5,
          5,
          3,
          5,
          3,
          3,
          2,
          2,
          3
        ]
      },
      {
        "outcome": "DÖÇ3",
        "values": [
          3,
          4,
          4,
          4,
          3,
          4,
          3,
          3,
          1,
          1,
          3
        ]
      },
      {
        "outcome": "DÖÇ4",
        "values": [
          2,
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
          3,
          4,
          4,
          4,
          3,
          4,
          3,
          3,
          1,
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
        "status": "Revize Edildi"
      },
      {
        "item": "Eksik/doğrulanması gereken alan kaldı mı?",
        "status": "Doğrulanmalı"
      }
    ],
    "publicQualityChecklist": false
  },
  {
    "department": "Resim ASD",
    "programName": "Resim",
    "level": "Tezsiz Yüksek Lisans",
    "code": "RES722",
    "name": "Sanat sosyolojisi",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "instructor": "Atama Bekliyor",
    "purpose": "Sanatın toplumsal bir süreç ve olgu olarak kavranması ve tartışılması.",
    "content": "Sanatın sosyolojik anlamı ve önemi. Sanat sosyolojisinde kullanılan temel metodolojik yaklaşımlar. Sanatın kurumsal yapısı ve sosyal sınırları. Sanatın temel sosyal fonksiyonları. Sanatın milliliği ve evrenselliği. Sanat ve toplum ilişkisi. Sanatın çevreye, çevrenin sanata etkisi. Sanatın temelleri. Sanat ve insan duyguları. Sanatın felsefesi. Sanatın toplumsal kaynağı. Din-sanat ilişkisi. Sanatın kültür içindeki yeri. Sanatçı ve sanatta kişilik. Sanat akımları.",
    "methods": "Anlatım, görsel kaynak incelemesi, yapıt çözümlemesi, atölye veya örnek olay uygulamaları ve yapılandırılmış akademik tartışma.",
    "resources": "Dersin kapsamına uygun güncel kitaplar, hakemli sanat ve tasarım literatürü, müze ve koleksiyon katalogları ile görsel arşivler.",
    "sdgs": [
      "4",
      "8",
      "11"
    ],
    "outcomes": [
      "Sanat sosyolojisi alanındaki ileri kavram ve yaklaşımları analiz eder.",
      "sanatçı, yapıt ve izleyici ilişkisi ile ilişkili örnekleri uygun ölçütlerle karşılaştırır.",
      "görsel kültür ve toplumsal bağlam bağlamında görsel veya kuramsal verileri yorumlar.",
      "seçilmiş yapıtların karşılaştırılması doğrultusunda özgün çözüm ya da değerlendirme geliştirir.",
      "Sanat sosyolojisi kapsamındaki çalışmaları sanatsal, mesleki ve etik ölçütlerle değerlendirir."
    ],
    "weeklyTopics": [
      "Ders tanımı, işlenişi ve notlandırma, çalışma bilgisi",
      "Sosyolojinin konusu olarak sanat. Sanatta değişim",
      "Sanat ve toplum ilişkisi.",
      "Sanat eseri ve sanat kuramları",
      "Sanatın sosyal işlevi",
      "Eser incelemesi",
      "Sanatın sosyolojik yönü; sanat ve kültür kavramları.",
      "Sanat nesnesinin sosyolojik okuması",
      "Sosyoloji tartışmaları ve sanat. Ulusallık evrensellik yerellik sorunsalı.",
      "Örnek sanat eserlerinin içerik olarak incelenmesi",
      "temel kavramlar ve tarihsel bağlam",
      "sanat yapıtı ve estetik deneyim",
      "modern ve çağdaş kuramsal yaklaşımlar",
      "sanatçı, yapıt ve izleyici ilişkisi",
      "biçim ve içerik tartışmaları"
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
          1,
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
          3,
          5,
          2,
          5,
          5,
          3,
          5,
          3,
          3,
          5
        ]
      },
      {
        "outcome": "DÖÇ3",
        "values": [
          3,
          3,
          4,
          1,
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
        "outcome": "DÖÇ4",
        "values": [
          2,
          2,
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
        "outcome": "DÖÇ5",
        "values": [
          3,
          3,
          4,
          1,
          4,
          4,
          3,
          4,
          3,
          3,
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
        "status": "Revize Edildi"
      },
      {
        "item": "Eksik/doğrulanması gereken alan kaldı mı?",
        "status": "Doğrulanmalı"
      }
    ],
    "publicQualityChecklist": false
  },
  {
    "department": "Resim ASD",
    "programName": "Resim",
    "level": "Tezsiz Yüksek Lisans",
    "code": "RES724",
    "name": "Sanat ontolojisi ıı",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "instructor": "Atama Bekliyor",
    "purpose": "Sanat yapıtının ontolojik analizi. Sanat yapıtının varlık tabakaları. Sanatçı ve sanat alımlayıcısının yapıtı anlamlandırmadaki rolleri.",
    "content": "Ontolojiye giriş ve temel kavramlar. Klasik ontoloji, modern ontoloji. Sanat ontolojisinin temel kavramları. Estetik obje analizi.",
    "methods": "Anlatım, görsel kaynak incelemesi, yapıt çözümlemesi, atölye veya örnek olay uygulamaları ve yapılandırılmış akademik tartışma.",
    "resources": "Dersin kapsamına uygun güncel kitaplar, hakemli sanat ve tasarım literatürü, müze ve koleksiyon katalogları ile görsel arşivler.",
    "sdgs": [
      "4",
      "8",
      "11"
    ],
    "outcomes": [
      "Sanat ontolojisi ıı alanındaki ileri kavram ve yaklaşımları analiz eder.",
      "sanatçı, yapıt ve izleyici ilişkisi ile ilişkili örnekleri uygun ölçütlerle karşılaştırır.",
      "görsel kültür ve toplumsal bağlam bağlamında görsel veya kuramsal verileri yorumlar.",
      "seçilmiş yapıtların karşılaştırılması doğrultusunda özgün çözüm ya da değerlendirme geliştirir.",
      "Sanat ontolojisi ıı kapsamındaki çalışmaları sanatsal, mesleki ve etik ölçütlerle değerlendirir."
    ],
    "weeklyTopics": [
      "Ontolojiye giriş.",
      "Klasik ontoloji, modern ontoloji",
      "Ontolojinin var olan kavrayışı",
      "Varlık tabakaları",
      "Varlık kategorileri",
      "Varlık tarzlarının verilişi",
      "Sanat ontolojisinin kuruluşu",
      "Nicolai Hartmann’ın estetik obje analizi",
      "Roman İngarden’in estetik obje analizi",
      "Estetik obje analizi",
      "Sanat yapıtının varlık tabakaları",
      "Resimde varlık tabakaları",
      "Sanat yapıtının ontik yapısı ve estetik değer",
      "Estetik değerin kavranması",
      "temel kavramlar ve tarihsel bağlam"
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
          1,
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
          3,
          5,
          2,
          5,
          5,
          3,
          5,
          3,
          3,
          5
        ]
      },
      {
        "outcome": "DÖÇ3",
        "values": [
          3,
          3,
          4,
          1,
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
        "outcome": "DÖÇ4",
        "values": [
          2,
          2,
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
        "outcome": "DÖÇ5",
        "values": [
          3,
          3,
          4,
          1,
          4,
          4,
          3,
          4,
          3,
          3,
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
        "status": "Revize Edildi"
      },
      {
        "item": "Eksik/doğrulanması gereken alan kaldı mı?",
        "status": "Doğrulanmalı"
      }
    ],
    "publicQualityChecklist": false
  },
  {
    "department": "Resim ASD",
    "programName": "Resim",
    "level": "Tezsiz Yüksek Lisans",
    "code": "RES726",
    "name": "Çağdaş müzecilik ve kuramları ıı",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "instructor": "Atama Bekliyor",
    "purpose": "Öğrencinin çağdaş müzecilik ve sergileme alanındaki ileri bilgi ve yaklaşımları sanatsal üretim ve eleştirel değerlendirme süreçlerinde kullanmasını sağlamak.",
    "content": "Çağdaş müzecilik ve kuramları ıı; müze kavramının tarihsel dönüşümü, çağdaş müzecilik kuramları, koleksiyon geliştirme ve yönetimi, belgeleme ve envanter ilkeleri, koruma ve bakım sorumlulukları, küratöryel yaklaşım ve seçki oluşturma, sergileme tasarımı ve mekân, izleyici geliştirme ve erişilebilirlik, eğitim ve kamusal programlar, dijital müzecilik uygulamaları boyutlarıyla ele alınır.",
    "methods": "Anlatım, görsel kaynak incelemesi, yapıt çözümlemesi, atölye veya örnek olay uygulamaları ve yapılandırılmış akademik tartışma.",
    "resources": "Dersin kapsamına uygun güncel kitaplar, hakemli sanat ve tasarım literatürü, müze ve koleksiyon katalogları ile görsel arşivler.",
    "sdgs": [
      "4",
      "8",
      "11"
    ],
    "outcomes": [
      "Çağdaş müzecilik ve kuramları ıı alanındaki ileri kavram ve yaklaşımları analiz eder.",
      "belgeleme ve envanter ilkeleri ile ilişkili örnekleri uygun ölçütlerle karşılaştırır.",
      "izleyici geliştirme ve erişilebilirlik bağlamında görsel veya kuramsal verileri yorumlar.",
      "müze iletişimi ve yorumlama doğrultusunda özgün çözüm ya da değerlendirme geliştirir.",
      "Çağdaş müzecilik ve kuramları ıı kapsamındaki çalışmaları sanatsal, mesleki ve etik ölçütlerle değerlendirir."
    ],
    "weeklyTopics": [
      "müze kavramının tarihsel dönüşümü",
      "çağdaş müzecilik kuramları",
      "koleksiyon geliştirme ve yönetimi",
      "belgeleme ve envanter ilkeleri",
      "koruma ve bakım sorumlulukları",
      "küratöryel yaklaşım ve seçki oluşturma",
      "sergileme tasarımı ve mekân",
      "izleyici geliştirme ve erişilebilirlik",
      "eğitim ve kamusal programlar",
      "dijital müzecilik uygulamaları",
      "müze iletişimi ve yorumlama",
      "etik, köken araştırması ve kültürel miras",
      "çağdaş müze örneklerinin karşılaştırılması",
      "sergi değerlendirme ölçütleri",
      "müzecilikte güncel yönelimlerin değerlendirilmesi"
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
          1,
          2,
          2,
          1,
          4,
          2,
          4,
          2,
          4,
          4,
          4
        ]
      },
      {
        "outcome": "DÖÇ2",
        "values": [
          2,
          3,
          3,
          2,
          5,
          3,
          5,
          3,
          5,
          5,
          5
        ]
      },
      {
        "outcome": "DÖÇ3",
        "values": [
          1,
          3,
          3,
          1,
          4,
          3,
          4,
          3,
          4,
          4,
          4
        ]
      },
      {
        "outcome": "DÖÇ4",
        "values": [
          2,
          2,
          2,
          2,
          5,
          2,
          5,
          2,
          5,
          5,
          5
        ]
      },
      {
        "outcome": "DÖÇ5",
        "values": [
          1,
          3,
          3,
          1,
          4,
          3,
          4,
          3,
          4,
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
        "status": "Revize Edildi"
      },
      {
        "item": "Eksik/doğrulanması gereken alan kaldı mı?",
        "status": "Doğrulanmalı"
      }
    ],
    "publicQualityChecklist": false
  },
  {
    "department": "Resim ASD",
    "programName": "Resim",
    "level": "Tezsiz Yüksek Lisans",
    "code": "RES728",
    "name": "Desen",
    "credit": 3,
    "ects": 6,
    "theory": 1,
    "practice": 2,
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "instructor": "Atama Bekliyor",
    "purpose": "Nesne - obje kavramları üzerinde, yaklaşımların çizgisel anlatım tekniğinde yeniden yaratılması. Biçimsel ve estetik olarak kavranması ve ifade edilmesi.",
    "content": "Her öğrenci seçtiği konuya ilişkin deneysel çalışmalar ve uygulamalar yapar.",
    "methods": "Anlatım, görsel kaynak incelemesi, yapıt çözümlemesi, atölye veya örnek olay uygulamaları ve yapılandırılmış akademik tartışma.",
    "resources": "Dersin kapsamına uygun güncel kitaplar, hakemli sanat ve tasarım literatürü, müze ve koleksiyon katalogları ile görsel arşivler.",
    "sdgs": [
      "4",
      "8",
      "11"
    ],
    "outcomes": [
      "Desen alanındaki ileri kavram ve yaklaşımları analiz eder.",
      "biçimsel araştırma ve eskiz ile ilişkili örnekleri uygun ölçütlerle karşılaştırır.",
      "çok katmanlı üretim süreçleri bağlamında görsel veya kuramsal verileri yorumlar.",
      "üretim sürecinin belgelenmesi doğrultusunda özgün çözüm ya da değerlendirme geliştirir.",
      "Desen kapsamındaki çalışmaları sanatsal, mesleki ve etik ölçütlerle değerlendirir."
    ],
    "weeklyTopics": [
      "Dersin Uygulaması hakkında öğrencilerle karşılıklı tartışma.",
      "Model üzerinde canlı performans.",
      "Desen çizimleri ve bireysel uygulamalar üzerine eleştiri.",
      "Değişen nesne çizimleri üzerinden bireysel yaklaşımlar.",
      "Biçim ifade teknikleri.",
      "Nesne etütleri",
      "Canlı modelden etüt",
      "Canlı model performansı.",
      "Canlı Model Performansı.",
      "Desende sağlamlık ve gerçekçilik üzerine tartışma.",
      "Üslupsal arayışlar ve sanatçı görüşleri.",
      "Uygulanan projeler sunulur, tartışılır ve değerlendirilir.",
      "Proje revizyon",
      "uygulama alanının tarihsel gelişimi",
      "malzeme, araç ve güvenli çalışma"
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
          3,
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
          3,
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
          2,
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
          3,
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
  },
  {
    "department": "Resim ASD",
    "programName": "Resim",
    "level": "Tezsiz Yüksek Lisans",
    "code": "RES730",
    "name": "Baskı resim",
    "credit": 3,
    "ects": 6,
    "theory": 1,
    "practice": 2,
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "instructor": "Atama Bekliyor",
    "purpose": "Özgün Baskı Resim Sanatında kullanılan sanatsal üretim tekniklerinin neler olduğunun kavratılması tekniklerin kullanım alanlarının araştırılması ve deneysel baskı uygulamalarının yapılması.",
    "content": "Baskı Resmin tarihsel gelişimi, baskı resim teknikleri, deneysel baskı çalışmalarından örnekler, baskı resim sanatına ilişkin makale yazılması ve deneysel baskı uygulamaları",
    "methods": "Anlatım, görsel kaynak incelemesi, yapıt çözümlemesi, atölye veya örnek olay uygulamaları ve yapılandırılmış akademik tartışma.",
    "resources": "Dersin kapsamına uygun güncel kitaplar, hakemli sanat ve tasarım literatürü, müze ve koleksiyon katalogları ile görsel arşivler.",
    "sdgs": [
      "4",
      "8",
      "11"
    ],
    "outcomes": [
      "Baskı resim alanındaki ileri kavram ve yaklaşımları analiz eder.",
      "biçimsel araştırma ve eskiz ile ilişkili örnekleri uygun ölçütlerle karşılaştırır.",
      "çok katmanlı üretim süreçleri bağlamında görsel veya kuramsal verileri yorumlar.",
      "üretim sürecinin belgelenmesi doğrultusunda özgün çözüm ya da değerlendirme geliştirir.",
      "Baskı resim kapsamındaki çalışmaları sanatsal, mesleki ve etik ölçütlerle değerlendirir."
    ],
    "weeklyTopics": [
      "Tanışma ve dersin içeriği hakkında bilgilendirme. Derste kullanılacak araç, gereç ve malzeme hakkında bilgilendirme.",
      "Baskı Resmin Dünyada ve Türkiye’de Tarihsel Gelişimi",
      "Baskı Resim Teknikleri (Yüksek Baskı, Çukur Baskı, Litografi/Taş Baskı",
      "Baskı Resim Teknikleri (Elek Baskı/Serigrafi, Mono Baskı, Kollograf Baskı",
      "Baskı Resim Sanatında Deneysel Yaklaşımlar, Sanatçı Eserlerinden Örnekler Baskı Resim Teknikleri İle Deneysel Uygulamalar",
      "Seçilen Baskı Resim Teknikleri ile Deneysel Uygulamalar",
      "Makale Konusu Belirleme ( Baskı Resim Teknikleri, Baskı Resim Sanatçıları ve Eserleri, Günümüzde Baskı Resmin Kullanım Alanları, Baskı Resim Sanatında Deneysel Yaklaşımlar vb.)",
      "Baskı Resim Sanatı İle İlgili Makalelerin İncelenmesi",
      "Baskı Resimle İlgili Makale İncelemelerine Devam Edilmesi",
      "Seçilen Makale Konularının İçeriklerinin İncelenmesi, tartışılması",
      "Seçilen Makale Konularının, Başlı ve İçeriklerinin Oluşturulması",
      "Makalelerin Yazılması, Değerlendirilmesi",
      "Çalışmaların Değerlendirilmesi",
      "uygulama alanının tarihsel gelişimi",
      "malzeme, araç ve güvenli çalışma"
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
          3,
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
          3,
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
          2,
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
          3,
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
  },
  {
    "department": "Resim ASD",
    "programName": "Resim",
    "level": "Tezsiz Yüksek Lisans",
    "code": "RES732",
    "name": "Disiplinlerarası sanatta yeni yaklaşımlar ve ...",
    "credit": 3,
    "ects": 6,
    "theory": 1,
    "practice": 2,
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "instructor": "Atama Bekliyor",
    "purpose": "Öğrencinin uygulamalı sanat üretimi alanındaki ileri bilgi ve yaklaşımları sanatsal üretim ve eleştirel değerlendirme süreçlerinde kullanmasını sağlamak.",
    "content": "Disiplinlerarası sanatta yeni yaklaşımlar ve ...; uygulama alanının tarihsel gelişimi, malzeme, araç ve güvenli çalışma, temel teknikler ve yüzey hazırlığı, biçimsel araştırma ve eskiz, kompozisyon geliştirme, kalıp, iz veya çizgisel yapı, renk ve doku denemeleri, çok katmanlı üretim süreçleri, deneysel tekniklerin karşılaştırılması, özgün uygulama tasarımı boyutlarıyla ele alınır.",
    "methods": "Anlatım, görsel kaynak incelemesi, yapıt çözümlemesi, atölye veya örnek olay uygulamaları ve yapılandırılmış akademik tartışma.",
    "resources": "Dersin kapsamına uygun güncel kitaplar, hakemli sanat ve tasarım literatürü, müze ve koleksiyon katalogları ile görsel arşivler.",
    "sdgs": [
      "4",
      "8",
      "11"
    ],
    "outcomes": [
      "Disiplinlerarası sanatta yeni yaklaşımlar ve ... alanındaki ileri kavram ve yaklaşımları analiz eder.",
      "biçimsel araştırma ve eskiz ile ilişkili örnekleri uygun ölçütlerle karşılaştırır.",
      "çok katmanlı üretim süreçleri bağlamında görsel veya kuramsal verileri yorumlar.",
      "üretim sürecinin belgelenmesi doğrultusunda özgün çözüm ya da değerlendirme geliştirir.",
      "Disiplinlerarası sanatta yeni yaklaşımlar ve ... kapsamındaki çalışmaları sanatsal, mesleki ve etik ölçütlerle değerlendirir."
    ],
    "weeklyTopics": [
      "uygulama alanının tarihsel gelişimi",
      "malzeme, araç ve güvenli çalışma",
      "temel teknikler ve yüzey hazırlığı",
      "biçimsel araştırma ve eskiz",
      "kompozisyon geliştirme",
      "kalıp, iz veya çizgisel yapı",
      "renk ve doku denemeleri",
      "çok katmanlı üretim süreçleri",
      "deneysel tekniklerin karşılaştırılması",
      "özgün uygulama tasarımı",
      "üretim sürecinin belgelenmesi",
      "yapıtların eleştirel değerlendirilmesi",
      "teknik sorunların giderilmesi",
      "sergileme düzeni ve izleyici ilişkisi",
      "uygulamaların bütüncül sanatsal değerlendirilmesi"
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
          3,
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
          3,
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
          2,
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
          3,
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
        "status": "Doğrulanmalı"
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
  },
  {
    "department": "Resim ASD",
    "programName": "Resim",
    "level": "Tezsiz Yüksek Lisans",
    "code": "RES734",
    "name": "Kavramsal sanat ve enstalasyon",
    "credit": 3,
    "ects": 6,
    "theory": 1,
    "practice": 2,
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "instructor": "Atama Bekliyor",
    "purpose": "Öğrencinin uygulamalı sanat üretimi alanındaki ileri bilgi ve yaklaşımları sanatsal üretim ve eleştirel değerlendirme süreçlerinde kullanmasını sağlamak.",
    "content": "Kavramsal sanat ve enstalasyon; uygulama alanının tarihsel gelişimi, malzeme, araç ve güvenli çalışma, temel teknikler ve yüzey hazırlığı, biçimsel araştırma ve eskiz, kompozisyon geliştirme, kalıp, iz veya çizgisel yapı, renk ve doku denemeleri, çok katmanlı üretim süreçleri, deneysel tekniklerin karşılaştırılması, özgün uygulama tasarımı boyutlarıyla ele alınır.",
    "methods": "Anlatım, görsel kaynak incelemesi, yapıt çözümlemesi, atölye veya örnek olay uygulamaları ve yapılandırılmış akademik tartışma.",
    "resources": "Dersin kapsamına uygun güncel kitaplar, hakemli sanat ve tasarım literatürü, müze ve koleksiyon katalogları ile görsel arşivler.",
    "sdgs": [
      "4",
      "8",
      "11"
    ],
    "outcomes": [
      "Kavramsal sanat ve enstalasyon alanındaki ileri kavram ve yaklaşımları analiz eder.",
      "biçimsel araştırma ve eskiz ile ilişkili örnekleri uygun ölçütlerle karşılaştırır.",
      "çok katmanlı üretim süreçleri bağlamında görsel veya kuramsal verileri yorumlar.",
      "üretim sürecinin belgelenmesi doğrultusunda özgün çözüm ya da değerlendirme geliştirir.",
      "Kavramsal sanat ve enstalasyon kapsamındaki çalışmaları sanatsal, mesleki ve etik ölçütlerle değerlendirir."
    ],
    "weeklyTopics": [
      "uygulama alanının tarihsel gelişimi",
      "malzeme, araç ve güvenli çalışma",
      "temel teknikler ve yüzey hazırlığı",
      "biçimsel araştırma ve eskiz",
      "kompozisyon geliştirme",
      "kalıp, iz veya çizgisel yapı",
      "renk ve doku denemeleri",
      "çok katmanlı üretim süreçleri",
      "deneysel tekniklerin karşılaştırılması",
      "özgün uygulama tasarımı",
      "üretim sürecinin belgelenmesi",
      "yapıtların eleştirel değerlendirilmesi",
      "teknik sorunların giderilmesi",
      "sergileme düzeni ve izleyici ilişkisi",
      "uygulamaların bütüncül sanatsal değerlendirilmesi"
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
          3,
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
          3,
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
          2,
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
          3,
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

// Tarih tezsiz resmî müfredatı, gerçek OBS paketleri ve mevcut 11 LEE_DBP PÇ'si temel alınmıştır; program profili değiştirilmemiştir.
import type { CoursePackage } from "./coursePackages";

export const tarihTezsizCoursePackages: CoursePackage[] = [
  {
    "department": "Tarih ABD",
    "programName": "Tarih",
    "level": "Tezsiz Yüksek Lisans",
    "code": "TTS703",
    "name": "Bilimsel araştırma yöntemleri ve yayın etiği",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Dr. Öğr. Üyesi SEHER YÜCETÜRK",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Bu dersin, öğrencilerin tarih araştırma yöntemleri alanındaki ileri bilgileri kaynak temelli ve eleştirel bir yaklaşımla çözümlemelerine katkı sağlaması amaçlanmaktadır.",
    "content": "Bilimsel bilgi ve tarih araştırmasının niteliği; Araştırma problemi ile tarihsel soru geliştirme; Literatür tarama stratejileri; Birincil ve ikincil kaynakların ayrımı; Kaynak eleştirisi ve kanıt değerlendirme; Tarih araştırmalarında yöntem seçimi; Arşiv, katalog ve dijital veri tabanı kullanımı; Tarihsel verilerin sınıflandırılması; Karşılaştırmalı ve bağlamsal çözümleme; Tarih yazımında nedensellik ve yorum başlıkları tarihsel bağlam, kaynak eleştirisi ve karşılaştırmalı yorum çerçevesinde ele alınmaktadır.",
    "methods": "Kuramsal anlatım, birincil ve ikincil kaynak incelemesi, belge veya metin çözümlemesi, karşılaştırmalı analiz ve yapılandırılmış akademik tartışma.",
    "resources": "Marc Bloch, Tarih Savunusu; E. H. Carr, Tarih Nedir?; John Tosh, Tarihin Peşinde; konuya ilişkin birincil kaynaklar ve güncel hakemli çalışmalar.",
    "sdgs": [
      "4",
      "16",
      "17"
    ],
    "outcomes": [
      "Bilimsel bilgi ve tarih araştırmasının niteliği ile ilgili ileri kavramları analiz eder.",
      "Literatür tarama stratejileri bağlamındaki kaynak ve kanıtları eleştirel değerlendirir.",
      "Tarihsel verilerin sınıflandırılması ile ilişkili tarihsel örnekleri karşılaştırır.",
      "Araştırma etiği ve yayın bütünlüğü için uygun tarihsel çözümleme yaklaşımını uygular.",
      "Yöntemsel kararların bütüncül değerlendirilmesi temelinde gerekçeli sonuçlar geliştirir."
    ],
    "weeklyTopics": [
      "Bilimsel bilgi ve tarih araştırmasının niteliği",
      "Araştırma problemi ile tarihsel soru geliştirme",
      "Literatür tarama stratejileri",
      "Birincil ve ikincil kaynakların ayrımı",
      "Kaynak eleştirisi ve kanıt değerlendirme",
      "Tarih araştırmalarında yöntem seçimi",
      "Arşiv, katalog ve dijital veri tabanı kullanımı",
      "Tarihsel verilerin sınıflandırılması",
      "Karşılaştırmalı ve bağlamsal çözümleme",
      "Tarih yazımında nedensellik ve yorum",
      "Atıf, kaynakça ve akademik yazım",
      "Araştırma etiği ve yayın bütünlüğü",
      "Tarihsel bulguların gerekçelendirilmesi",
      "Araştırma raporunun yapılandırılması",
      "Yöntemsel kararların bütüncül değerlendirilmesi"
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
          1,
          2,
          4,
          4,
          1,
          2,
          4,
          4,
          2
        ]
      },
      {
        "outcome": "DÖÇ2",
        "values": [
          3,
          5,
          2,
          3,
          5,
          5,
          2,
          3,
          5,
          5,
          3
        ]
      },
      {
        "outcome": "DÖÇ3",
        "values": [
          3,
          4,
          1,
          3,
          4,
          4,
          1,
          3,
          4,
          4,
          3
        ]
      },
      {
        "outcome": "DÖÇ4",
        "values": [
          2,
          4,
          2,
          2,
          4,
          4,
          2,
          2,
          4,
          4,
          2
        ]
      },
      {
        "outcome": "DÖÇ5",
        "values": [
          3,
          5,
          1,
          3,
          5,
          5,
          1,
          3,
          5,
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
    "department": "Tarih ABD",
    "programName": "Tarih",
    "level": "Tezsiz Yüksek Lisans",
    "code": "TTS727",
    "name": "Ortaçağ tarihi kaynakları",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Atama Bekliyor",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Bu dersin, öğrencilerin tarihsel kaynaklar ve kaynak eleştirisi alanındaki ileri bilgileri kaynak temelli ve eleştirel bir yaklaşımla çözümlemelerine katkı sağlaması amaçlanmaktadır.",
    "content": "Kaynak alanının kapsamı ve terminolojisi; Kaynakların oluştuğu tarihsel bağlam; Birincil kaynak türlerinin sınıflandırılması; Yazılı ve maddi kaynakların özellikleri; Müellif, kurum ve üretim amacı; Metin, belge ve kayıtların dış tenkidi; Kaynakların iç tenkidi ve güvenilirlik; Kronoloji, mekân ve aktörlerin belirlenmesi; Farklı kaynakların karşılaştırılması; Arşiv ve katalog düzenlerinin kullanımı başlıkları tarihsel bağlam, kaynak eleştirisi ve karşılaştırmalı yorum çerçevesinde ele alınmaktadır.",
    "methods": "Kuramsal anlatım, birincil ve ikincil kaynak incelemesi, belge veya metin çözümlemesi, karşılaştırmalı analiz ve yapılandırılmış akademik tartışma.",
    "resources": "Marc Bloch, Tarih Savunusu; E. H. Carr, Tarih Nedir?; John Tosh, Tarihin Peşinde; konuya ilişkin birincil kaynaklar ve güncel hakemli çalışmalar.",
    "sdgs": [
      "4",
      "11",
      "16"
    ],
    "outcomes": [
      "Kaynak alanının kapsamı ve terminolojisi ile ilgili ileri kavramları analiz eder.",
      "Birincil kaynak türlerinin sınıflandırılması bağlamındaki kaynak ve kanıtları eleştirel değerlendirir.",
      "Kronoloji, mekân ve aktörlerin belirlenmesi ile ilişkili tarihsel örnekleri karşılaştırır.",
      "Tarihsel verinin çözümlenmesi için uygun tarihsel çözümleme yaklaşımını uygular.",
      "Kaynak temelli tarihsel yorum geliştirme temelinde gerekçeli sonuçlar geliştirir."
    ],
    "weeklyTopics": [
      "Kaynak alanının kapsamı ve terminolojisi",
      "Kaynakların oluştuğu tarihsel bağlam",
      "Birincil kaynak türlerinin sınıflandırılması",
      "Yazılı ve maddi kaynakların özellikleri",
      "Müellif, kurum ve üretim amacı",
      "Metin, belge ve kayıtların dış tenkidi",
      "Kaynakların iç tenkidi ve güvenilirlik",
      "Kronoloji, mekân ve aktörlerin belirlenmesi",
      "Farklı kaynakların karşılaştırılması",
      "Arşiv ve katalog düzenlerinin kullanımı",
      "Kaynaklardaki temsil ve sessizlikler",
      "Tarihsel verinin çözümlenmesi",
      "Kanıtların literatürle ilişkilendirilmesi",
      "Etik kullanım ve doğru kaynak gösterme",
      "Kaynak temelli tarihsel yorum geliştirme"
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
    "department": "Tarih ABD",
    "programName": "Tarih",
    "level": "Tezsiz Yüksek Lisans",
    "code": "TTS729",
    "name": "Ortaçağ'da iran tarihi",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Atama Bekliyor",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Bu dersin, öğrencilerin Orta Çağ, Selçuklu ve erken Türk-İslam tarihi alanındaki ileri bilgileri kaynak temelli ve eleştirel bir yaklaşımla çözümlemelerine katkı sağlaması amaçlanmaktadır.",
    "content": "Orta Çağ dünyasının kronolojik ve coğrafi çerçevesi; Döneme ilişkin temel kaynak grupları; Siyasal oluşumlar ve hanedan yapıları; Devlet teşkilatı ve yönetim gelenekleri; Toplum, hukuk ve dinî kurumlar; Göçler, fetihler ve yerleşme süreçleri; Eğitim, bilim ve kültür hayatı; Şehirler, ticaret ve ekonomik ilişkiler; Diplomasi ve komşu güçlerle ilişkiler; Türk-İslam dünyasında kimlik ve meşruiyet başlıkları tarihsel bağlam, kaynak eleştirisi ve karşılaştırmalı yorum çerçevesinde ele alınmaktadır.",
    "methods": "Kuramsal anlatım, birincil ve ikincil kaynak incelemesi, belge veya metin çözümlemesi, karşılaştırmalı analiz ve yapılandırılmış akademik tartışma.",
    "resources": "Osman Turan, Selçuklular Tarihi ve Türk-İslam Medeniyeti; Claude Cahen, Osmanlılardan Önce Anadolu; döneme ilişkin seçilmiş kronikler ve güncel hakemli çalışmalar.",
    "sdgs": [
      "4",
      "10",
      "16"
    ],
    "outcomes": [
      "Orta Çağ dünyasının kronolojik ve coğrafi çerçevesi ile ilgili ileri kavramları analiz eder.",
      "Siyasal oluşumlar ve hanedan yapıları bağlamındaki kaynak ve kanıtları eleştirel değerlendirir.",
      "Şehirler, ticaret ve ekonomik ilişkiler ile ilişkili tarihsel örnekleri karşılaştırır.",
      "Anadolu ve çevre bölgelerin karşılaştırılması için uygun tarihsel çözümleme yaklaşımını uygular.",
      "Dönemin tarihsel mirasının değerlendirilmesi temelinde gerekçeli sonuçlar geliştirir."
    ],
    "weeklyTopics": [
      "Orta Çağ dünyasının kronolojik ve coğrafi çerçevesi",
      "Döneme ilişkin temel kaynak grupları",
      "Siyasal oluşumlar ve hanedan yapıları",
      "Devlet teşkilatı ve yönetim gelenekleri",
      "Toplum, hukuk ve dinî kurumlar",
      "Göçler, fetihler ve yerleşme süreçleri",
      "Eğitim, bilim ve kültür hayatı",
      "Şehirler, ticaret ve ekonomik ilişkiler",
      "Diplomasi ve komşu güçlerle ilişkiler",
      "Türk-İslam dünyasında kimlik ve meşruiyet",
      "Kroniklerin ve anlatı kaynaklarının eleştirisi",
      "Anadolu ve çevre bölgelerin karşılaştırılması",
      "Siyasal ve toplumsal dönüşümler",
      "Literatürdeki temel tartışmalar",
      "Dönemin tarihsel mirasının değerlendirilmesi"
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
          1,
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
          2,
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
          1,
          3,
          3,
          1,
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
          4,
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
          5,
          5,
          5,
          5,
          3,
          5,
          1,
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
    "department": "Tarih ABD",
    "programName": "Tarih",
    "level": "Tezsiz Yüksek Lisans",
    "code": "TTS705",
    "name": "Tarih felsefesi",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Doç. Dr. MUHAMMED FAZIL HİMMETOĞLU",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Tarihin anlamına ve tarihsel süreci anlamaya, tarihi yöneten genel yasalara yönelik felsefe yapmayı amaçlar.",
    "content": "Tarihi olaylar üzerinden felsefe yapmak.",
    "methods": "Okuma tartışma",
    "resources": "Kaynaklar: güncel kaynaklar; Ders Notları: Karl Popper; Dökümanlar: Gordon Child; Ödevler: 1; Sınavlar: vize, final",
    "sdgs": [
      "4",
      "10",
      "16"
    ],
    "outcomes": [
      "Osmanlı tarihinin dönemlendirilmesi ve kaynakları ile ilgili ileri kavramları analiz eder.",
      "Saray, bürokrasi ve karar süreçleri bağlamındaki kaynak ve kanıtları eleştirel değerlendirir.",
      "Eğitim, kültür ve düşünce hayatı ile ilişkili tarihsel örnekleri karşılaştırır.",
      "Bölgesel örneklerin karşılaştırılması için uygun tarihsel çözümleme yaklaşımını uygular.",
      "Dönemin çok boyutlu tarihsel değerlendirmesi temelinde gerekçeli sonuçlar geliştirir."
    ],
    "weeklyTopics": [
      "Tarih",
      "tarih ve blim",
      "tarih ve siyaset",
      "kültür",
      "medeniyet",
      "tarih ve çevre",
      "tarih ve devlet",
      "tarih ve kozmoloji",
      "tarih ve evrim",
      "tarih ve din",
      "tarih ve insan",
      "Osmanlı tarihinin dönemlendirilmesi ve kaynakları",
      "Merkez ve taşra teşkilatının yapısı",
      "Saray, bürokrasi ve karar süreçleri",
      "Toplumsal gruplar ve gündelik hayat"
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
          1,
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
          2,
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
          1,
          3,
          3,
          1,
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
          4,
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
          5,
          5,
          5,
          5,
          3,
          5,
          1,
          3,
          3,
          1,
          3
        ]
      }
    ],
    "sourceUrl": "https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=246711&lang=tr",
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
    "department": "Tarih ABD",
    "programName": "Tarih",
    "level": "Tezsiz Yüksek Lisans",
    "code": "TTS707",
    "name": "Göktürkler ve uygurlar",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Doç. Dr. AYSEL ERDOĞAN",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "İslam Öncesi Orta Asya Türklerinin siyasi, iktisadi ve toplumsal hayatının incelenmesi.",
    "content": "İslam Öncesi Orta Asya Türk Devletleri, Tarihi süreç içinde oluşan kültürel değerler.",
    "methods": "AnlatımSoru-CevapTartışmaKaynak İncelemesiBireysel AraştırmaSunumProje Hazırlama",
    "resources": "Kaynaklar: İbrahim Kafesoğlu, Türk Milli Kültürü, Boğaziçi Yayınları, İstanbul, 1991.Sadettin Gömeç, Köktürk Tarihi, Akçağ Yayıncılık, Ankara, 1999.Bahaeddin Ögel, Büyük Hun İmparatorluğu Tarihi, 2 cilt, Kültür Bakanlığı Yayınları, Ankara, 1981.Sadettin Gömeç, Uygur Türkleri Tarihi ve Kültürü, Akçağ Yayıncılık, Ankara, 1999.Bahaeddin Ögel, Türk Kültürünün Gelişme Çağları, İstanbul 1998.Bahaaddin Ögel, Türk Devlet Anlayışı, Ankara 1982. Şerafettin Turan, Türk Kültür Tarihi, İstanbul 1990.Salim Koca, Türk Kültürünün Temelleri 2, Ankara 2003.Özkan İzgi, Uygurların Siyasi ve Kültiirel Tarihi, Ankara 1987. Jean Paul Roux, Türkler’in Tarihi, Milliyet Yayınları, 3. baskı Mart 1991.; Ders Notları: Orhun Abideleri (Göktürk Yazıtları)Çin Yıllıklarıİslam Kaynakları: Arap ve Fars seyyahlar ile coğrafyacılarının (İbn Fadlan, El-Cahiz, Kaşgarlı Mahmud) eserleriV. V. Barthold: Orta Asya Türk Tarihi Bahaeddin Ögel: İslamiyetten Önce Türk Kültür Tarihi Zeki Velidî Togan: Umumî Türk Tarihine Girişİbrahim Kafesoğlu: Türk Milli Kültürü Ahmet Taşağıl: Göktürkler serisi ve Bozkırın Kağanları; Sınavlar: 100",
    "sdgs": [
      "4",
      "10",
      "16"
    ],
    "outcomes": [
      "Orta Çağ dünyasının kronolojik ve coğrafi çerçevesi ile ilgili ileri kavramları analiz eder.",
      "Siyasal oluşumlar ve hanedan yapıları bağlamındaki kaynak ve kanıtları eleştirel değerlendirir.",
      "Şehirler, ticaret ve ekonomik ilişkiler ile ilişkili tarihsel örnekleri karşılaştırır.",
      "Anadolu ve çevre bölgelerin karşılaştırılması için uygun tarihsel çözümleme yaklaşımını uygular.",
      "Dönemin tarihsel mirasının değerlendirilmesi temelinde gerekçeli sonuçlar geliştirir."
    ],
    "weeklyTopics": [
      "Dersin Amacı, kaynakları, tespit ve tanımlar, kültürün önemi ve değeri, Türk milli kültürünün safhaları ve atlı göçebe kültürün temel özellikleri, Türk kültürünün etki gücü",
      "Türklerin ilk anayurdu ve yayılmaları, Orta Asyada tabiat ve iklim şartları, Orta Asyanın en eski kültürleri ve Türklerin yayılma safhaları, Türk karakteri, Eski Türk hayat tarzı",
      "Tarihte Türk adı; Türk kültürünün ortaya çıkışı",
      "Türklerin göçleri ve yayılma alanları",
      "Büyük Hun Devletinin kuruluş ve yükseliş dönemi",
      "Hun-Çin üstünlük mücadelesi.",
      "Büyük Hun Devletinin ikiye ayrılması ve yıkılışı.",
      "Ak Hunlar, Batı Hun İmparatorluğu ve Tabgaçlar.",
      "Hunlar devrinde sanat, din ve kültürel hayat.",
      "Birinci Göktürk Devleti Doğu ve Batı Göktürkleri.",
      "İkinci Göktürk Devleti.",
      "Göktürkler devrinde sanat, din ve kültürel hayat",
      "Sonuç ve Değerlendirme.",
      "Orta Çağ dünyasının kronolojik ve coğrafi çerçevesi",
      "Döneme ilişkin temel kaynak grupları"
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
          1,
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
          2,
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
          1,
          3,
          3,
          1,
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
          4,
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
          5,
          5,
          5,
          5,
          3,
          5,
          1,
          3,
          3,
          1,
          3
        ]
      }
    ],
    "sourceUrl": "https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=246705&lang=tr",
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
    "department": "Tarih ABD",
    "programName": "Tarih",
    "level": "Tezsiz Yüksek Lisans",
    "code": "TTS715",
    "name": "Türk yenileşme tarihi",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Doç. Dr. ŞENAY ATAM",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Türk modernleşme tarihinde siyasi hareketlerin nasıl başladığı, kurulan komite ve fırkaların birbirlerini ne derecede etkilediği ortaya konularak, söz konusu mevzularda öğrencilerin analiz yeteneklerini geliştirmek.",
    "content": "II. Meşrutiyet'in İlanı sürecinde yaşanan siyasi gelişmeler, Osmanlı Devleti'nin durumu, Osmanlı döneminde kurulan ve Türk siyasi hayatını etkileyen belli başlı siyasi yapılar incelenecek ve değerlendirilecektir.",
    "methods": "Anlatım, Tartışma, Değerlendirme",
    "resources": "Kaynaklar: Tarık Zafer Tunaya, Türkiye’de Siyasal Gelişmeler, İstanbul 2001.Florian Riedler, Osmanlı İmparatorluğu’nda Muhalefet ve Meşruiyet: Siyasi Kültür ve Komplolar, Çeviren Azize F. Çakır, İstanbul: Picus Yayıncılık, 2012Erik Jan Zürcher, Modernleşen Türkiye’nin Tarihi, İletişim Yayınları, İstanbul 2000.",
    "sdgs": [
      "4",
      "10",
      "16"
    ],
    "outcomes": [
      "Osmanlı tarihinin dönemlendirilmesi ve kaynakları ile ilgili ileri kavramları analiz eder.",
      "Saray, bürokrasi ve karar süreçleri bağlamındaki kaynak ve kanıtları eleştirel değerlendirir.",
      "Eğitim, kültür ve düşünce hayatı ile ilişkili tarihsel örnekleri karşılaştırır.",
      "Bölgesel örneklerin karşılaştırılması için uygun tarihsel çözümleme yaklaşımını uygular.",
      "Dönemin çok boyutlu tarihsel değerlendirmesi temelinde gerekçeli sonuçlar geliştirir."
    ],
    "weeklyTopics": [
      "Çalışılacak dönemle ilgili eser ve kaynakların değerlendirilmesi",
      "Dönemin genel özellikleri, dahili ve harici gelişmeler",
      "Fransız İhtilali ve etkileri",
      "Sened-i İttifak, Tanzimat ve Islahat Fermanları",
      "Genç Osmanlılar ve fikri akımlar",
      "Meşruti sisteme geçiş süreci",
      "I. Meşrutiyet Dönemi ve Kanun-i Esasi",
      "İttihat ve Terakki Fırkası'nın Teşkili",
      "İttihat ve Terakki Fırkası",
      "II. Meşrutiyet Döneminde Kurulan Siyasi Partiler",
      "31 Mart Vakası ve II. Mşrutiyet Döneminde Yaşanan İktidar Çekişmeleri",
      "Osmanlı'nın Son Döneminde Yaşanan Siyasi Gelişmeler",
      "Osmanlı tarihinin dönemlendirilmesi ve kaynakları",
      "Merkez ve taşra teşkilatının yapısı",
      "Saray, bürokrasi ve karar süreçleri"
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
          1,
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
          2,
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
          1,
          3,
          3,
          1,
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
          4,
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
          5,
          5,
          5,
          5,
          3,
          5,
          1,
          3,
          3,
          1,
          3
        ]
      }
    ],
    "sourceUrl": "https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=246715&lang=tr",
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
    "department": "Tarih ABD",
    "programName": "Tarih",
    "level": "Tezsiz Yüksek Lisans",
    "code": "TTS723",
    "name": "Büyük selçuklu imparatorluğu tarihi",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Doç. Dr. AYŞE ATICI ARAYANCAN",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Selçuklu Devleti’nin tarihteki rolünü ve önemini incelemek;",
    "content": "Büyük Selçuklu Devletinin Siyasi Tarihi Değerlendirilecektir",
    "methods": "Anlatım, Soru ve cevap",
    "resources": "Kaynaklar: İbrahim Kafesoğlu, Sultan Melikşah Döneminde Büyük Selçuklu İmparatorluğuMehmet Altay Köymen, Büyük Selçuklu İmparatorluğu Tarihi III, (Alparslan ve Zamanı)Erdoğan Merçil, Büyük Selçuklu DevletiG. M. Kurpalidis, Büyük Selçuklu Devletinin İdari, Sosyal ve Ekonomik TarihiOsman Gazi Özgüdenli, Büyük Selçuklu Tarihi, İsam Yayınları, I. Abdülkerim Özaydın, Sultan Berkyaruk Devri Selçuklu Tarihi.Abdülkerim Özaydın, Sultan Muhammed Tapar Devri Selçuklu TarihiErgin Ayan, Selçuklular, Tuğrul Bey,Necmettin Erbakan Üniversitesi Yayınları, Konya 2021.Diyanet İslam Ansiklopedisi Tuğrul Bey,Çağrı,Alpasrlan maddesi.; Ders Notları: Büyük Selçuklular Tarihi Seti (7 kitap) ed. Mehmet Şimşir-Mehmet Ali Kapar, Necmettin Erbakan Üniversitesi Yayınları, Konya 2021; Ali Öngül, Büyük Selçuklu Tarihi, İstanbul, 2011; Osman Gazi Özgüdenli, Büyük Selçuklular, İSAM Yayınları, 2013.",
    "sdgs": [
      "4",
      "10",
      "16"
    ],
    "outcomes": [
      "Orta Çağ dünyasının kronolojik ve coğrafi çerçevesi ile ilgili ileri kavramları analiz eder.",
      "Siyasal oluşumlar ve hanedan yapıları bağlamındaki kaynak ve kanıtları eleştirel değerlendirir.",
      "Şehirler, ticaret ve ekonomik ilişkiler ile ilişkili tarihsel örnekleri karşılaştırır.",
      "Anadolu ve çevre bölgelerin karşılaştırılması için uygun tarihsel çözümleme yaklaşımını uygular.",
      "Dönemin tarihsel mirasının değerlendirilmesi temelinde gerekçeli sonuçlar geliştirir."
    ],
    "weeklyTopics": [
      "Selçukluların Menşei ve Oğuzlar",
      "Selçuk Bey’in Cend’e göçü ve Selçukluların Maveraünnehir’deki Faaliyetleri",
      "Tuğrul ve Çağrı Bey’in Devlet Kurma mücadeleleri ve Dandanakan Savaşı",
      "Tuğrul Bey Dönemi",
      "Sultan Alparslan Dönemi",
      "Sultan Melikşah Dönemi",
      "Selçukluların Buhran Dönemi: Berkyaruk ve Muhammed Tapar Mücadelesi",
      "Sultan Muhammed Tapar Dönemi",
      "Selçuklu-Haçlı Mücadelesi",
      "Sultan Sencer Dönemi",
      "Oğuz İsyanı ve Devletin Yıkılışı",
      "Selçuklu Devlet Teşkilatı",
      "Selçuklu Devleti Askeri Teşkilat",
      "Selçukluların Kültürel ve Medeni Mirası",
      "Selçuklu Devletinin Türk Tarihi ve Kültürü için Önemi"
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
          1,
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
          2,
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
          1,
          3,
          3,
          1,
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
          4,
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
          5,
          5,
          5,
          5,
          3,
          5,
          1,
          3,
          3,
          1,
          3
        ]
      }
    ],
    "sourceUrl": "https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=246704&lang=tr",
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
    "department": "Tarih ABD",
    "programName": "Tarih",
    "level": "Tezsiz Yüksek Lisans",
    "code": "TTS725",
    "name": "Türklerin islamiyeti kabulu",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Atama Bekliyor",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Bu dersin, öğrencilerin Orta Çağ, Selçuklu ve erken Türk-İslam tarihi alanındaki ileri bilgileri kaynak temelli ve eleştirel bir yaklaşımla çözümlemelerine katkı sağlaması amaçlanmaktadır.",
    "content": "Orta Çağ dünyasının kronolojik ve coğrafi çerçevesi; Döneme ilişkin temel kaynak grupları; Siyasal oluşumlar ve hanedan yapıları; Devlet teşkilatı ve yönetim gelenekleri; Toplum, hukuk ve dinî kurumlar; Göçler, fetihler ve yerleşme süreçleri; Eğitim, bilim ve kültür hayatı; Şehirler, ticaret ve ekonomik ilişkiler; Diplomasi ve komşu güçlerle ilişkiler; Türk-İslam dünyasında kimlik ve meşruiyet başlıkları tarihsel bağlam, kaynak eleştirisi ve karşılaştırmalı yorum çerçevesinde ele alınmaktadır.",
    "methods": "Kuramsal anlatım, birincil ve ikincil kaynak incelemesi, belge veya metin çözümlemesi, karşılaştırmalı analiz ve yapılandırılmış akademik tartışma.",
    "resources": "Osman Turan, Selçuklular Tarihi ve Türk-İslam Medeniyeti; Claude Cahen, Osmanlılardan Önce Anadolu; döneme ilişkin seçilmiş kronikler ve güncel hakemli çalışmalar.",
    "sdgs": [
      "4",
      "10",
      "16"
    ],
    "outcomes": [
      "Orta Çağ dünyasının kronolojik ve coğrafi çerçevesi ile ilgili ileri kavramları analiz eder.",
      "Siyasal oluşumlar ve hanedan yapıları bağlamındaki kaynak ve kanıtları eleştirel değerlendirir.",
      "Şehirler, ticaret ve ekonomik ilişkiler ile ilişkili tarihsel örnekleri karşılaştırır.",
      "Anadolu ve çevre bölgelerin karşılaştırılması için uygun tarihsel çözümleme yaklaşımını uygular.",
      "Dönemin tarihsel mirasının değerlendirilmesi temelinde gerekçeli sonuçlar geliştirir."
    ],
    "weeklyTopics": [
      "Orta Çağ dünyasının kronolojik ve coğrafi çerçevesi",
      "Döneme ilişkin temel kaynak grupları",
      "Siyasal oluşumlar ve hanedan yapıları",
      "Devlet teşkilatı ve yönetim gelenekleri",
      "Toplum, hukuk ve dinî kurumlar",
      "Göçler, fetihler ve yerleşme süreçleri",
      "Eğitim, bilim ve kültür hayatı",
      "Şehirler, ticaret ve ekonomik ilişkiler",
      "Diplomasi ve komşu güçlerle ilişkiler",
      "Türk-İslam dünyasında kimlik ve meşruiyet",
      "Kroniklerin ve anlatı kaynaklarının eleştirisi",
      "Anadolu ve çevre bölgelerin karşılaştırılması",
      "Siyasal ve toplumsal dönüşümler",
      "Literatürdeki temel tartışmalar",
      "Dönemin tarihsel mirasının değerlendirilmesi"
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
          1,
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
          2,
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
          1,
          3,
          3,
          1,
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
          4,
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
          5,
          5,
          5,
          5,
          3,
          5,
          1,
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
    "department": "Tarih ABD",
    "programName": "Tarih",
    "level": "Tezsiz Yüksek Lisans",
    "code": "TTS737",
    "name": "Osmanlıda gündelik yaşam",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Dr. Öğr. Üyesi SEHER YÜCETÜRK",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Klasik Dönem Osmanlı toplum yapısının hukuki, örfi ve kanunlar çerçevesinde şekillenmesi ve şekillenirken alt değişkenlerinin aktarılması. Gündelik yaşamın nelerin etkisi altında olduğunun ifade edilmeye çalışılması.",
    "content": "Gündelik yaşamın yazılı olmayan fakat sözlü şekilde herkesin uyguladığı kurallar üzerinden değerlendirilmesi. Gündelik yaşama hukuki, örfi ve kanunlar çerçevesinde temas etmek bu yolla klasik dönem toplum yapısı hakkında bilgi vermek.",
    "methods": "Anlatım, analiz, soru cevap.",
    "resources": "Kaynaklar: Suraıya Faroqhı, Osmanlı Kültürü ve Gündelik Yaşam Orta Çağdan Yirminci Yüzyıla, Çev:Elif Kılıç, Tarih Vakfı Yurt Yayınları.",
    "sdgs": [
      "4",
      "10",
      "11"
    ],
    "outcomes": [
      "Sosyal ve kültürel tarihin kavramsal çerçevesi ile ilgili ileri kavramları analiz eder.",
      "Toplumsal tabakalar ve kimlikler bağlamındaki kaynak ve kanıtları eleştirel değerlendirir.",
      "Kent, mekân ve yerel toplum ile ilişkili tarihsel örnekleri karşılaştırır.",
      "Belge ve anlatıların karşılaştırılması için uygun tarihsel çözümleme yaklaşımını uygular.",
      "Sosyal tarih bulgularının bütüncül yorumlanması temelinde gerekçeli sonuçlar geliştirir."
    ],
    "weeklyTopics": [
      "Kültür ve medeniyet kavramları.",
      "Kültürün tarihi",
      "Kültürün yayılışı",
      "Kültürün farklı kültürlerle etkileşimi",
      "Klasik dönem örf, adetler ve kanunlar",
      "Klasik dönemde mahalle kavramı.",
      "Mahalle kavramı üzerinden kültürün temas noktaları.",
      "Ekonomik ve sosyal yapının kültüre etkisi",
      "10. Zaman mefhumunun kültüre ve gündelik yaşama etkisi",
      "Bir kültür unsuru olarak kadının toplumdaki yeri.",
      "Sanatın kültür ve gündelik yaşama etkisi.",
      "Değişen ve dönüşen kültürel başlıkların topluma etkisi.",
      "Birlikte yaşama kültürünün ortak paydaları.",
      "Sosyal ve kültürel tarihin kavramsal çerçevesi",
      "Gündelik hayatı inceleyen kaynak türleri"
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
          1,
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
          2,
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
          1,
          1,
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
          4,
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
          5,
          5,
          5,
          5,
          3,
          5,
          3,
          3,
          1,
          1,
          3
        ]
      }
    ],
    "sourceUrl": "https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=246710&lang=tr",
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
    "department": "Tarih ABD",
    "programName": "Tarih",
    "level": "Tezsiz Yüksek Lisans",
    "code": "TTS709",
    "name": "Selçuklularda eğitim",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Atama Bekliyor",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Bu dersin, öğrencilerin Orta Çağ, Selçuklu ve erken Türk-İslam tarihi alanındaki ileri bilgileri kaynak temelli ve eleştirel bir yaklaşımla çözümlemelerine katkı sağlaması amaçlanmaktadır.",
    "content": "Orta Çağ dünyasının kronolojik ve coğrafi çerçevesi; Döneme ilişkin temel kaynak grupları; Siyasal oluşumlar ve hanedan yapıları; Devlet teşkilatı ve yönetim gelenekleri; Toplum, hukuk ve dinî kurumlar; Göçler, fetihler ve yerleşme süreçleri; Eğitim, bilim ve kültür hayatı; Şehirler, ticaret ve ekonomik ilişkiler; Diplomasi ve komşu güçlerle ilişkiler; Türk-İslam dünyasında kimlik ve meşruiyet başlıkları tarihsel bağlam, kaynak eleştirisi ve karşılaştırmalı yorum çerçevesinde ele alınmaktadır.",
    "methods": "Kuramsal anlatım, birincil ve ikincil kaynak incelemesi, belge veya metin çözümlemesi, karşılaştırmalı analiz ve yapılandırılmış akademik tartışma.",
    "resources": "Osman Turan, Selçuklular Tarihi ve Türk-İslam Medeniyeti; Claude Cahen, Osmanlılardan Önce Anadolu; döneme ilişkin seçilmiş kronikler ve güncel hakemli çalışmalar.",
    "sdgs": [
      "4",
      "10",
      "16"
    ],
    "outcomes": [
      "Orta Çağ dünyasının kronolojik ve coğrafi çerçevesi ile ilgili ileri kavramları analiz eder.",
      "Siyasal oluşumlar ve hanedan yapıları bağlamındaki kaynak ve kanıtları eleştirel değerlendirir.",
      "Şehirler, ticaret ve ekonomik ilişkiler ile ilişkili tarihsel örnekleri karşılaştırır.",
      "Anadolu ve çevre bölgelerin karşılaştırılması için uygun tarihsel çözümleme yaklaşımını uygular.",
      "Dönemin tarihsel mirasının değerlendirilmesi temelinde gerekçeli sonuçlar geliştirir."
    ],
    "weeklyTopics": [
      "Orta Çağ dünyasının kronolojik ve coğrafi çerçevesi",
      "Döneme ilişkin temel kaynak grupları",
      "Siyasal oluşumlar ve hanedan yapıları",
      "Devlet teşkilatı ve yönetim gelenekleri",
      "Toplum, hukuk ve dinî kurumlar",
      "Göçler, fetihler ve yerleşme süreçleri",
      "Eğitim, bilim ve kültür hayatı",
      "Şehirler, ticaret ve ekonomik ilişkiler",
      "Diplomasi ve komşu güçlerle ilişkiler",
      "Türk-İslam dünyasında kimlik ve meşruiyet",
      "Kroniklerin ve anlatı kaynaklarının eleştirisi",
      "Anadolu ve çevre bölgelerin karşılaştırılması",
      "Siyasal ve toplumsal dönüşümler",
      "Literatürdeki temel tartışmalar",
      "Dönemin tarihsel mirasının değerlendirilmesi"
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
          1,
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
          2,
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
          1,
          3,
          3,
          1,
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
          4,
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
          5,
          5,
          5,
          5,
          3,
          5,
          1,
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
    "department": "Tarih ABD",
    "programName": "Tarih",
    "level": "Tezsiz Yüksek Lisans",
    "code": "TTS711",
    "name": "Osmanlı basını'nın doğuşu ve gelişimi",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Atama Bekliyor",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Bu dersin, öğrencilerin sosyal, ekonomik ve kültürel tarih alanındaki ileri bilgileri kaynak temelli ve eleştirel bir yaklaşımla çözümlemelerine katkı sağlaması amaçlanmaktadır.",
    "content": "Sosyal ve kültürel tarihin kavramsal çerçevesi; Gündelik hayatı inceleyen kaynak türleri; Toplumsal tabakalar ve kimlikler; Aile, kadın ve toplumsal cinsiyet; Eğitim, yardım ve dayanışma kurumları; Üretim, tüketim ve ekonomik ilişkiler; Para, fiyat ve yaşam standartları; Kent, mekân ve yerel toplum; Basın, kültür ve kamusal alan; Dinî hayat, tasavvuf ve topluluklar başlıkları tarihsel bağlam, kaynak eleştirisi ve karşılaştırmalı yorum çerçevesinde ele alınmaktadır.",
    "methods": "Kuramsal anlatım, birincil ve ikincil kaynak incelemesi, belge veya metin çözümlemesi, karşılaştırmalı analiz ve yapılandırılmış akademik tartışma.",
    "resources": "Halil İnalcık, Osmanlı İmparatorluğu Klasik Çağ; Suraiya Faroqhi, Osmanlı Kültürü ve Gündelik Yaşam; Cumhurbaşkanlığı Devlet Arşivleri Başkanlığı katalog ve belge seçkileri.",
    "sdgs": [
      "4",
      "10",
      "11"
    ],
    "outcomes": [
      "Sosyal ve kültürel tarihin kavramsal çerçevesi ile ilgili ileri kavramları analiz eder.",
      "Toplumsal tabakalar ve kimlikler bağlamındaki kaynak ve kanıtları eleştirel değerlendirir.",
      "Kent, mekân ve yerel toplum ile ilişkili tarihsel örnekleri karşılaştırır.",
      "Belge ve anlatıların karşılaştırılması için uygun tarihsel çözümleme yaklaşımını uygular.",
      "Sosyal tarih bulgularının bütüncül yorumlanması temelinde gerekçeli sonuçlar geliştirir."
    ],
    "weeklyTopics": [
      "Sosyal ve kültürel tarihin kavramsal çerçevesi",
      "Gündelik hayatı inceleyen kaynak türleri",
      "Toplumsal tabakalar ve kimlikler",
      "Aile, kadın ve toplumsal cinsiyet",
      "Eğitim, yardım ve dayanışma kurumları",
      "Üretim, tüketim ve ekonomik ilişkiler",
      "Para, fiyat ve yaşam standartları",
      "Kent, mekân ve yerel toplum",
      "Basın, kültür ve kamusal alan",
      "Dinî hayat, tasavvuf ve topluluklar",
      "Nüfus, göç ve toplumsal hareketlilik",
      "Belge ve anlatıların karşılaştırılması",
      "Toplumsal değişim ve süreklilik",
      "Yerel örneklerin geniş bağlamla ilişkilendirilmesi",
      "Sosyal tarih bulgularının bütüncül yorumlanması"
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
          1,
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
          2,
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
          1,
          1,
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
          4,
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
          5,
          5,
          5,
          5,
          3,
          5,
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
    "department": "Tarih ABD",
    "programName": "Tarih",
    "level": "Tezsiz Yüksek Lisans",
    "code": "TTS713",
    "name": "Osmanlı müesseseleri ve medeniyeti tarihi",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Atama Bekliyor",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Bu dersin, öğrencilerin Osmanlı tarihi alanındaki ileri bilgileri kaynak temelli ve eleştirel bir yaklaşımla çözümlemelerine katkı sağlaması amaçlanmaktadır.",
    "content": "Osmanlı tarihinin dönemlendirilmesi ve kaynakları; Merkez ve taşra teşkilatının yapısı; Saray, bürokrasi ve karar süreçleri; Toplumsal gruplar ve gündelik hayat; Hukuk, millet düzeni ve dinî kurumlar; Toprak, üretim ve mali yapı; Şehirler, ulaşım ve haberleşme ağları; Eğitim, kültür ve düşünce hayatı; Diplomasi ve dış ilişkiler; Reform, değişim ve süreklilik başlıkları tarihsel bağlam, kaynak eleştirisi ve karşılaştırmalı yorum çerçevesinde ele alınmaktadır.",
    "methods": "Kuramsal anlatım, birincil ve ikincil kaynak incelemesi, belge veya metin çözümlemesi, karşılaştırmalı analiz ve yapılandırılmış akademik tartışma.",
    "resources": "Halil İnalcık, Osmanlı İmparatorluğu Klasik Çağ; Suraiya Faroqhi, Osmanlı Kültürü ve Gündelik Yaşam; Cumhurbaşkanlığı Devlet Arşivleri Başkanlığı katalog ve belge seçkileri.",
    "sdgs": [
      "4",
      "10",
      "16"
    ],
    "outcomes": [
      "Osmanlı tarihinin dönemlendirilmesi ve kaynakları ile ilgili ileri kavramları analiz eder.",
      "Saray, bürokrasi ve karar süreçleri bağlamındaki kaynak ve kanıtları eleştirel değerlendirir.",
      "Eğitim, kültür ve düşünce hayatı ile ilişkili tarihsel örnekleri karşılaştırır.",
      "Bölgesel örneklerin karşılaştırılması için uygun tarihsel çözümleme yaklaşımını uygular.",
      "Dönemin çok boyutlu tarihsel değerlendirmesi temelinde gerekçeli sonuçlar geliştirir."
    ],
    "weeklyTopics": [
      "Osmanlı tarihinin dönemlendirilmesi ve kaynakları",
      "Merkez ve taşra teşkilatının yapısı",
      "Saray, bürokrasi ve karar süreçleri",
      "Toplumsal gruplar ve gündelik hayat",
      "Hukuk, millet düzeni ve dinî kurumlar",
      "Toprak, üretim ve mali yapı",
      "Şehirler, ulaşım ve haberleşme ağları",
      "Eğitim, kültür ve düşünce hayatı",
      "Diplomasi ve dış ilişkiler",
      "Reform, değişim ve süreklilik",
      "Arşiv belgeleri ve kroniklerin eleştirisi",
      "Bölgesel örneklerin karşılaştırılması",
      "Toplumsal ve ekonomik dönüşümlerin analizi",
      "Osmanlı tarih yazımındaki tartışmalar",
      "Dönemin çok boyutlu tarihsel değerlendirmesi"
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
          1,
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
          2,
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
          1,
          3,
          3,
          1,
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
          4,
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
          5,
          5,
          5,
          5,
          3,
          5,
          1,
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
    "department": "Tarih ABD",
    "programName": "Tarih",
    "level": "Tezsiz Yüksek Lisans",
    "code": "TTS717",
    "name": "Tarihte ermeni sorunu",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Atama Bekliyor",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Bu dersin, öğrencilerin sosyal, ekonomik ve kültürel tarih alanındaki ileri bilgileri kaynak temelli ve eleştirel bir yaklaşımla çözümlemelerine katkı sağlaması amaçlanmaktadır.",
    "content": "Sosyal ve kültürel tarihin kavramsal çerçevesi; Gündelik hayatı inceleyen kaynak türleri; Toplumsal tabakalar ve kimlikler; Aile, kadın ve toplumsal cinsiyet; Eğitim, yardım ve dayanışma kurumları; Üretim, tüketim ve ekonomik ilişkiler; Para, fiyat ve yaşam standartları; Kent, mekân ve yerel toplum; Basın, kültür ve kamusal alan; Dinî hayat, tasavvuf ve topluluklar başlıkları tarihsel bağlam, kaynak eleştirisi ve karşılaştırmalı yorum çerçevesinde ele alınmaktadır.",
    "methods": "Kuramsal anlatım, birincil ve ikincil kaynak incelemesi, belge veya metin çözümlemesi, karşılaştırmalı analiz ve yapılandırılmış akademik tartışma.",
    "resources": "Halil İnalcık, Osmanlı İmparatorluğu Klasik Çağ; Suraiya Faroqhi, Osmanlı Kültürü ve Gündelik Yaşam; Cumhurbaşkanlığı Devlet Arşivleri Başkanlığı katalog ve belge seçkileri.",
    "sdgs": [
      "4",
      "10",
      "11"
    ],
    "outcomes": [
      "Sosyal ve kültürel tarihin kavramsal çerçevesi ile ilgili ileri kavramları analiz eder.",
      "Toplumsal tabakalar ve kimlikler bağlamındaki kaynak ve kanıtları eleştirel değerlendirir.",
      "Kent, mekân ve yerel toplum ile ilişkili tarihsel örnekleri karşılaştırır.",
      "Belge ve anlatıların karşılaştırılması için uygun tarihsel çözümleme yaklaşımını uygular.",
      "Sosyal tarih bulgularının bütüncül yorumlanması temelinde gerekçeli sonuçlar geliştirir."
    ],
    "weeklyTopics": [
      "Sosyal ve kültürel tarihin kavramsal çerçevesi",
      "Gündelik hayatı inceleyen kaynak türleri",
      "Toplumsal tabakalar ve kimlikler",
      "Aile, kadın ve toplumsal cinsiyet",
      "Eğitim, yardım ve dayanışma kurumları",
      "Üretim, tüketim ve ekonomik ilişkiler",
      "Para, fiyat ve yaşam standartları",
      "Kent, mekân ve yerel toplum",
      "Basın, kültür ve kamusal alan",
      "Dinî hayat, tasavvuf ve topluluklar",
      "Nüfus, göç ve toplumsal hareketlilik",
      "Belge ve anlatıların karşılaştırılması",
      "Toplumsal değişim ve süreklilik",
      "Yerel örneklerin geniş bağlamla ilişkilendirilmesi",
      "Sosyal tarih bulgularının bütüncül yorumlanması"
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
          1,
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
          2,
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
          1,
          1,
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
          4,
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
          5,
          5,
          5,
          5,
          3,
          5,
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
    "department": "Tarih ABD",
    "programName": "Tarih",
    "level": "Tezsiz Yüksek Lisans",
    "code": "TTS719",
    "name": "Türk eğitim tarihi",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Atama Bekliyor",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Bu dersin, öğrencilerin sosyal, ekonomik ve kültürel tarih alanındaki ileri bilgileri kaynak temelli ve eleştirel bir yaklaşımla çözümlemelerine katkı sağlaması amaçlanmaktadır.",
    "content": "Sosyal ve kültürel tarihin kavramsal çerçevesi; Gündelik hayatı inceleyen kaynak türleri; Toplumsal tabakalar ve kimlikler; Aile, kadın ve toplumsal cinsiyet; Eğitim, yardım ve dayanışma kurumları; Üretim, tüketim ve ekonomik ilişkiler; Para, fiyat ve yaşam standartları; Kent, mekân ve yerel toplum; Basın, kültür ve kamusal alan; Dinî hayat, tasavvuf ve topluluklar başlıkları tarihsel bağlam, kaynak eleştirisi ve karşılaştırmalı yorum çerçevesinde ele alınmaktadır.",
    "methods": "Kuramsal anlatım, birincil ve ikincil kaynak incelemesi, belge veya metin çözümlemesi, karşılaştırmalı analiz ve yapılandırılmış akademik tartışma.",
    "resources": "Halil İnalcık, Osmanlı İmparatorluğu Klasik Çağ; Suraiya Faroqhi, Osmanlı Kültürü ve Gündelik Yaşam; Cumhurbaşkanlığı Devlet Arşivleri Başkanlığı katalog ve belge seçkileri.",
    "sdgs": [
      "4",
      "10",
      "11"
    ],
    "outcomes": [
      "Sosyal ve kültürel tarihin kavramsal çerçevesi ile ilgili ileri kavramları analiz eder.",
      "Toplumsal tabakalar ve kimlikler bağlamındaki kaynak ve kanıtları eleştirel değerlendirir.",
      "Kent, mekân ve yerel toplum ile ilişkili tarihsel örnekleri karşılaştırır.",
      "Belge ve anlatıların karşılaştırılması için uygun tarihsel çözümleme yaklaşımını uygular.",
      "Sosyal tarih bulgularının bütüncül yorumlanması temelinde gerekçeli sonuçlar geliştirir."
    ],
    "weeklyTopics": [
      "Sosyal ve kültürel tarihin kavramsal çerçevesi",
      "Gündelik hayatı inceleyen kaynak türleri",
      "Toplumsal tabakalar ve kimlikler",
      "Aile, kadın ve toplumsal cinsiyet",
      "Eğitim, yardım ve dayanışma kurumları",
      "Üretim, tüketim ve ekonomik ilişkiler",
      "Para, fiyat ve yaşam standartları",
      "Kent, mekân ve yerel toplum",
      "Basın, kültür ve kamusal alan",
      "Dinî hayat, tasavvuf ve topluluklar",
      "Nüfus, göç ve toplumsal hareketlilik",
      "Belge ve anlatıların karşılaştırılması",
      "Toplumsal değişim ve süreklilik",
      "Yerel örneklerin geniş bağlamla ilişkilendirilmesi",
      "Sosyal tarih bulgularının bütüncül yorumlanması"
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
          1,
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
          2,
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
          1,
          1,
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
          4,
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
          5,
          5,
          5,
          5,
          3,
          5,
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
    "department": "Tarih ABD",
    "programName": "Tarih",
    "level": "Tezsiz Yüksek Lisans",
    "code": "TTS721",
    "name": "Orta asya türk siyasi tarihi",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Atama Bekliyor",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Bu dersin, öğrencilerin Orta Çağ, Selçuklu ve erken Türk-İslam tarihi alanındaki ileri bilgileri kaynak temelli ve eleştirel bir yaklaşımla çözümlemelerine katkı sağlaması amaçlanmaktadır.",
    "content": "Orta Çağ dünyasının kronolojik ve coğrafi çerçevesi; Döneme ilişkin temel kaynak grupları; Siyasal oluşumlar ve hanedan yapıları; Devlet teşkilatı ve yönetim gelenekleri; Toplum, hukuk ve dinî kurumlar; Göçler, fetihler ve yerleşme süreçleri; Eğitim, bilim ve kültür hayatı; Şehirler, ticaret ve ekonomik ilişkiler; Diplomasi ve komşu güçlerle ilişkiler; Türk-İslam dünyasında kimlik ve meşruiyet başlıkları tarihsel bağlam, kaynak eleştirisi ve karşılaştırmalı yorum çerçevesinde ele alınmaktadır.",
    "methods": "Kuramsal anlatım, birincil ve ikincil kaynak incelemesi, belge veya metin çözümlemesi, karşılaştırmalı analiz ve yapılandırılmış akademik tartışma.",
    "resources": "Osman Turan, Selçuklular Tarihi ve Türk-İslam Medeniyeti; Claude Cahen, Osmanlılardan Önce Anadolu; döneme ilişkin seçilmiş kronikler ve güncel hakemli çalışmalar.",
    "sdgs": [
      "4",
      "10",
      "16"
    ],
    "outcomes": [
      "Orta Çağ dünyasının kronolojik ve coğrafi çerçevesi ile ilgili ileri kavramları analiz eder.",
      "Siyasal oluşumlar ve hanedan yapıları bağlamındaki kaynak ve kanıtları eleştirel değerlendirir.",
      "Şehirler, ticaret ve ekonomik ilişkiler ile ilişkili tarihsel örnekleri karşılaştırır.",
      "Anadolu ve çevre bölgelerin karşılaştırılması için uygun tarihsel çözümleme yaklaşımını uygular.",
      "Dönemin tarihsel mirasının değerlendirilmesi temelinde gerekçeli sonuçlar geliştirir."
    ],
    "weeklyTopics": [
      "Orta Çağ dünyasının kronolojik ve coğrafi çerçevesi",
      "Döneme ilişkin temel kaynak grupları",
      "Siyasal oluşumlar ve hanedan yapıları",
      "Devlet teşkilatı ve yönetim gelenekleri",
      "Toplum, hukuk ve dinî kurumlar",
      "Göçler, fetihler ve yerleşme süreçleri",
      "Eğitim, bilim ve kültür hayatı",
      "Şehirler, ticaret ve ekonomik ilişkiler",
      "Diplomasi ve komşu güçlerle ilişkiler",
      "Türk-İslam dünyasında kimlik ve meşruiyet",
      "Kroniklerin ve anlatı kaynaklarının eleştirisi",
      "Anadolu ve çevre bölgelerin karşılaştırılması",
      "Siyasal ve toplumsal dönüşümler",
      "Literatürdeki temel tartışmalar",
      "Dönemin tarihsel mirasının değerlendirilmesi"
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
          1,
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
          2,
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
          1,
          3,
          3,
          1,
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
          4,
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
          5,
          5,
          5,
          5,
          3,
          5,
          1,
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
    "department": "Tarih ABD",
    "programName": "Tarih",
    "level": "Tezsiz Yüksek Lisans",
    "code": "TTS731",
    "name": "Haçlı seferleri tarihi",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Atama Bekliyor",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Bu dersin, öğrencilerin Orta Çağ, Selçuklu ve erken Türk-İslam tarihi alanındaki ileri bilgileri kaynak temelli ve eleştirel bir yaklaşımla çözümlemelerine katkı sağlaması amaçlanmaktadır.",
    "content": "Orta Çağ dünyasının kronolojik ve coğrafi çerçevesi; Döneme ilişkin temel kaynak grupları; Siyasal oluşumlar ve hanedan yapıları; Devlet teşkilatı ve yönetim gelenekleri; Toplum, hukuk ve dinî kurumlar; Göçler, fetihler ve yerleşme süreçleri; Eğitim, bilim ve kültür hayatı; Şehirler, ticaret ve ekonomik ilişkiler; Diplomasi ve komşu güçlerle ilişkiler; Türk-İslam dünyasında kimlik ve meşruiyet başlıkları tarihsel bağlam, kaynak eleştirisi ve karşılaştırmalı yorum çerçevesinde ele alınmaktadır.",
    "methods": "Kuramsal anlatım, birincil ve ikincil kaynak incelemesi, belge veya metin çözümlemesi, karşılaştırmalı analiz ve yapılandırılmış akademik tartışma.",
    "resources": "Osman Turan, Selçuklular Tarihi ve Türk-İslam Medeniyeti; Claude Cahen, Osmanlılardan Önce Anadolu; döneme ilişkin seçilmiş kronikler ve güncel hakemli çalışmalar.",
    "sdgs": [
      "4",
      "10",
      "16"
    ],
    "outcomes": [
      "Orta Çağ dünyasının kronolojik ve coğrafi çerçevesi ile ilgili ileri kavramları analiz eder.",
      "Siyasal oluşumlar ve hanedan yapıları bağlamındaki kaynak ve kanıtları eleştirel değerlendirir.",
      "Şehirler, ticaret ve ekonomik ilişkiler ile ilişkili tarihsel örnekleri karşılaştırır.",
      "Anadolu ve çevre bölgelerin karşılaştırılması için uygun tarihsel çözümleme yaklaşımını uygular.",
      "Dönemin tarihsel mirasının değerlendirilmesi temelinde gerekçeli sonuçlar geliştirir."
    ],
    "weeklyTopics": [
      "Orta Çağ dünyasının kronolojik ve coğrafi çerçevesi",
      "Döneme ilişkin temel kaynak grupları",
      "Siyasal oluşumlar ve hanedan yapıları",
      "Devlet teşkilatı ve yönetim gelenekleri",
      "Toplum, hukuk ve dinî kurumlar",
      "Göçler, fetihler ve yerleşme süreçleri",
      "Eğitim, bilim ve kültür hayatı",
      "Şehirler, ticaret ve ekonomik ilişkiler",
      "Diplomasi ve komşu güçlerle ilişkiler",
      "Türk-İslam dünyasında kimlik ve meşruiyet",
      "Kroniklerin ve anlatı kaynaklarının eleştirisi",
      "Anadolu ve çevre bölgelerin karşılaştırılması",
      "Siyasal ve toplumsal dönüşümler",
      "Literatürdeki temel tartışmalar",
      "Dönemin tarihsel mirasının değerlendirilmesi"
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
          1,
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
          2,
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
          1,
          3,
          3,
          1,
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
          4,
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
          5,
          5,
          5,
          5,
          3,
          5,
          1,
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
    "department": "Tarih ABD",
    "programName": "Tarih",
    "level": "Tezsiz Yüksek Lisans",
    "code": "TTS733",
    "name": "Osmanlı devleti'nde millet sistemi ve gayrimüslimler",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Doç. Dr. ŞENAY ATAM",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Osmanlı Devletin toplumsal yapısı içerisinde önemli bir yer tutan ve devletin önemli bir müessesesi olan millet sisteminin işleyişi ve bu çerçevede Osmanlı devleti ve gayrimüslim tebaası arasındaki ilişkileri öğretmek.",
    "content": "Osmanlı Devletin toplumsal ve siyasal yapısı, ırk esasına göre değil de düşünce ve inanç temeline göre örgütlenmişti. Bu açıdan önce millet kavramı açıklanacak, bu kavramın temelleri araştırılarak, Osmanlı devletindeki işleyişi incelenecektir. Daha sonra gayrimüslim tebaanın hukuku hakkında bilgi verilecektir.",
    "methods": "Kuramsal anlatım, birincil ve ikincil kaynak incelemesi, belge veya metin çözümlemesi, karşılaştırmalı analiz ve yapılandırılmış akademik tartışma.",
    "resources": "Kaynaklar: Necla Günay, Osmanlı Toplum Yapısı ve Millet Sistemi, Nobel Yay., İstanbul 2020.Uğur Kurtaran, OSMANLI İMPARATORLUĞU’NDA MİLLET SİSTEMİ, Sosyal Bilimler Enstitüsü Dergisi , S. 8, 2011.; Ders Notları: Osmanlı Millet Sistemi ve Gayrimüslimleri hakkında yazılmış makale ve tetkik eserler.",
    "sdgs": [
      "4",
      "10",
      "16"
    ],
    "outcomes": [
      "Osmanlı tarihinin dönemlendirilmesi ve kaynakları ile ilgili ileri kavramları analiz eder.",
      "Saray, bürokrasi ve karar süreçleri bağlamındaki kaynak ve kanıtları eleştirel değerlendirir.",
      "Eğitim, kültür ve düşünce hayatı ile ilişkili tarihsel örnekleri karşılaştırır.",
      "Bölgesel örneklerin karşılaştırılması için uygun tarihsel çözümleme yaklaşımını uygular.",
      "Dönemin çok boyutlu tarihsel değerlendirmesi temelinde gerekçeli sonuçlar geliştirir."
    ],
    "weeklyTopics": [
      "Dersin amacı ve kaynaklarının tanıtımı",
      "Millet, darülislam, darülharb, zimmet zımmi, fıkıh vb. ders içeriğiyle ilgili terimlerin tanımlanması",
      "Gayrimüslimlerin Osmanlıda coğrafi dağılımları ve nüfusları",
      "XIX. yüzyıla kadar Osmanlı hukuku içinde Gayrimüslimler (kanunnamelerde ve Fetvalarda)",
      "Gayrimüslimlerin ticaret yaşamı",
      "Gayrimüslimlerin dinsel yaşamı",
      "Gayrimüslimlerin sosyal yaşamı",
      "Müslümanlar ve Gayrimüslimler arası ilişkiler",
      "XIX. yüzyıl boyunca Osmanlı hukukundaki değişmeler",
      "Gayrimüslimlerin yeni hukuk düzenine göre durumları",
      "Tanzimat ve Islahat Fermanlarının Gayri Müslimler üzerindeki etkisi",
      "19. yüzyıl boyunca gayrimüslimlerin yaşamları (nüfusu, ticari, sosyal dini)",
      "Osmanlı tarihinin dönemlendirilmesi ve kaynakları",
      "Merkez ve taşra teşkilatının yapısı",
      "Saray, bürokrasi ve karar süreçleri"
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
          1,
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
          2,
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
          1,
          3,
          3,
          1,
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
          4,
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
          5,
          5,
          5,
          5,
          3,
          5,
          1,
          3,
          3,
          1,
          3
        ]
      }
    ],
    "sourceUrl": "https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=258893&lang=tr",
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
    "department": "Tarih ABD",
    "programName": "Tarih",
    "level": "Tezsiz Yüksek Lisans",
    "code": "TTS735",
    "name": "Yeniçağ osmanlı sosya-ekonomik tarihi",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Doç. Dr. MURAT ALANDAĞLI",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Yeni Çağ Osmanlı sosyo-ekonomik yapısının oluşumu, gelişimi hakkında öğrencilerin bilgilnemesi",
    "content": "Dönemsel olarak Yeni Çağ kavramı ve Osmanlı idari yapısındaki yeri ile önemi, kurumsal ve sosyal müesseseler ile bunlara ait kaynak serisinin tanıtımı",
    "methods": "Sözel anlatım, karşılaştırmalı aktarım.",
    "resources": "Kaynaklar: Halil İnalcık, Osmanlı İmparatorluğu’nun Ekonomik ve Sosyal Tarihi, İstanbul, 2000Oktay Özel-Mehmet Öz, Söğütten İstanbul’a Osmanlı Devleti’nin Kuruluşu Üzerine Tartışmalar), Ankara: İmge Yayınevi, 2000.İNALCIK, Halil, Osmanlı İmparatorluğu Klasik Çağ (1300-1600), İstanbul, 2003. İHSANOĞLU, Ekmeleddin, (Ed.), Osmanlı Devleti ve Medeniyeti Tarihi-I, İstanbul, 1994.Mustafa Akdağ, Türk Halkının Dirlik ve Düzenlik Kavgası “Celâlî İsyanları” Yapı Kredi Yayınları, İstanbul, 2009.Ahmet Yaşar, Ocak, Osmanlı İmparatorluğunda Marjinal Sûfîlik: Kalenderîler (XIV-XVII. Yüzyıllar), Ankara, 1992.; Ders Notları: Oktay Özel-Mehmet Öz, Söğütten İstanbul’a Osmanlı Devleti’nin Kuruluşu Üzerine Tartışmalar), Ankara: İmge Yayınevi, 2000.İNALCIK, Halil, (Osmanlı İmparatorluğu Klasik Çağ (1300-1600), İstanbul, 2003. İHSANOĞLU, Ekmeleddin, (Ed.), Osmanlı Devleti ve Medeniyeti Tarihi-I, İstanbul, 1994.; Dökümanlar: Oktay Özel-Mehmet Öz, Söğütten İstanbul’a Osmanlı Devleti’nin Kuruluşu Üzerine Tartışmalar), Ankara: İmge Yayınevi, 2000. İNALCIK, Halil, Osmanlı İmparatorluğu Klasik Çağ (1300-1600), İstanbul, 2003. İHSANOĞLU, Ekmeleddin, (Ed.), Osmanlı Devleti ve Medeniyeti Tarihi-I, İstanbul, 1994.",
    "sdgs": [
      "4",
      "10",
      "11"
    ],
    "outcomes": [
      "Sosyal ve kültürel tarihin kavramsal çerçevesi ile ilgili ileri kavramları analiz eder.",
      "Toplumsal tabakalar ve kimlikler bağlamındaki kaynak ve kanıtları eleştirel değerlendirir.",
      "Kent, mekân ve yerel toplum ile ilişkili tarihsel örnekleri karşılaştırır.",
      "Belge ve anlatıların karşılaştırılması için uygun tarihsel çözümleme yaklaşımını uygular.",
      "Sosyal tarih bulgularının bütüncül yorumlanması temelinde gerekçeli sonuçlar geliştirir."
    ],
    "weeklyTopics": [
      "Yeni Çağ Osmanlı İmparatorluğu sosyol ve ekonomik tarihi dersinin lisans programı düzeyindeki yeri ve önemi ile amaç, kapsam ve hedef erekleri hakkında bilgiler verilir",
      "Yeni Çağ Osmanlı İmparatorluğu'nun siyasî, sosyal ve kültürel yapısına dair izahlar yapılır.",
      "Yeni Çağ Osmanlı merkez idaresi ve kaynakları hakkında bilgi verilir.",
      "Yeni Çağ Osmanlı taşra idaresi ve kaynakları hakkında bilgiler verilir.",
      "Yeni Çağ Osmanlı toplum yapısı, bilişenleri ve dinamikleri hakkında bilgiler verilir",
      "Yeni Çağ Osmanlı kırsalındaki dinamikler: Köylüler ve Göçerler. Fermanlar, kanunnameler ışığında toplum yapısındaki değişim ve dönüşümler",
      "Yeni Çağ Osmanlıda ilim ve medrese eğitim ile Ortodoks inanç öğeleri ile marjinal gruplar.",
      "Yeni Çağ Osmanlı Malî yapısı ve dinamikleri ve zihnî altyapısına dair bilgiler verilir.",
      "Tahrir Sistemi: Yapılış amacı, şekli ve sonuçları. Yeni Çağ tarihinin mali kaynakları bağlamından önemi.",
      "Yeni Çağ Osmanlı Tarihi'nin malî kaynakları bağlamında evkâf defterleri ve önemi",
      "Yeni Çağ Osmanlı İmparatorluğu'nun sosyal ve malî kaynakları bağlamında şer'iye sicilleri ve önemi",
      "Yeni Çağ Osmanlı İmparatorluğu'nun merkez ve merkez-kaç isyanlar ile bunların siyasî ve toplumsal sonuçları",
      "Yeni Çağ Osmanlı İmparatorluğu'nun malî ve sosyal kaynakları bağlamında Avarız defterlerinin önemi",
      "Sosyal ve kültürel tarihin kavramsal çerçevesi",
      "Gündelik hayatı inceleyen kaynak türleri"
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
          1,
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
          2,
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
          1,
          1,
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
          4,
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
          5,
          5,
          5,
          5,
          3,
          5,
          3,
          3,
          1,
          1,
          3
        ]
      }
    ],
    "sourceUrl": "https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=258897&lang=tr",
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
    "department": "Tarih ABD",
    "programName": "Tarih",
    "level": "Tezsiz Yüksek Lisans",
    "code": "TTS739",
    "name": "Osmanlı arşiv belgeleri",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Atama Bekliyor",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Bu dersin, öğrencilerin tarihsel kaynaklar ve kaynak eleştirisi alanındaki ileri bilgileri kaynak temelli ve eleştirel bir yaklaşımla çözümlemelerine katkı sağlaması amaçlanmaktadır.",
    "content": "Kaynak alanının kapsamı ve terminolojisi; Kaynakların oluştuğu tarihsel bağlam; Birincil kaynak türlerinin sınıflandırılması; Yazılı ve maddi kaynakların özellikleri; Müellif, kurum ve üretim amacı; Metin, belge ve kayıtların dış tenkidi; Kaynakların iç tenkidi ve güvenilirlik; Kronoloji, mekân ve aktörlerin belirlenmesi; Farklı kaynakların karşılaştırılması; Arşiv ve katalog düzenlerinin kullanımı başlıkları tarihsel bağlam, kaynak eleştirisi ve karşılaştırmalı yorum çerçevesinde ele alınmaktadır.",
    "methods": "Kuramsal anlatım, birincil ve ikincil kaynak incelemesi, belge veya metin çözümlemesi, karşılaştırmalı analiz ve yapılandırılmış akademik tartışma.",
    "resources": "Marc Bloch, Tarih Savunusu; E. H. Carr, Tarih Nedir?; John Tosh, Tarihin Peşinde; konuya ilişkin birincil kaynaklar ve güncel hakemli çalışmalar.",
    "sdgs": [
      "4",
      "11",
      "16"
    ],
    "outcomes": [
      "Kaynak alanının kapsamı ve terminolojisi ile ilgili ileri kavramları analiz eder.",
      "Birincil kaynak türlerinin sınıflandırılması bağlamındaki kaynak ve kanıtları eleştirel değerlendirir.",
      "Kronoloji, mekân ve aktörlerin belirlenmesi ile ilişkili tarihsel örnekleri karşılaştırır.",
      "Tarihsel verinin çözümlenmesi için uygun tarihsel çözümleme yaklaşımını uygular.",
      "Kaynak temelli tarihsel yorum geliştirme temelinde gerekçeli sonuçlar geliştirir."
    ],
    "weeklyTopics": [
      "Kaynak alanının kapsamı ve terminolojisi",
      "Kaynakların oluştuğu tarihsel bağlam",
      "Birincil kaynak türlerinin sınıflandırılması",
      "Yazılı ve maddi kaynakların özellikleri",
      "Müellif, kurum ve üretim amacı",
      "Metin, belge ve kayıtların dış tenkidi",
      "Kaynakların iç tenkidi ve güvenilirlik",
      "Kronoloji, mekân ve aktörlerin belirlenmesi",
      "Farklı kaynakların karşılaştırılması",
      "Arşiv ve katalog düzenlerinin kullanımı",
      "Kaynaklardaki temsil ve sessizlikler",
      "Tarihsel verinin çözümlenmesi",
      "Kanıtların literatürle ilişkilendirilmesi",
      "Etik kullanım ve doğru kaynak gösterme",
      "Kaynak temelli tarihsel yorum geliştirme"
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
    "department": "Tarih ABD",
    "programName": "Tarih",
    "level": "Tezsiz Yüksek Lisans",
    "code": "TTS741",
    "name": "Osmanlı tarihinin kaynakları",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Atama Bekliyor",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Bu dersin, öğrencilerin tarihsel kaynaklar ve kaynak eleştirisi alanındaki ileri bilgileri kaynak temelli ve eleştirel bir yaklaşımla çözümlemelerine katkı sağlaması amaçlanmaktadır.",
    "content": "Kaynak alanının kapsamı ve terminolojisi; Kaynakların oluştuğu tarihsel bağlam; Birincil kaynak türlerinin sınıflandırılması; Yazılı ve maddi kaynakların özellikleri; Müellif, kurum ve üretim amacı; Metin, belge ve kayıtların dış tenkidi; Kaynakların iç tenkidi ve güvenilirlik; Kronoloji, mekân ve aktörlerin belirlenmesi; Farklı kaynakların karşılaştırılması; Arşiv ve katalog düzenlerinin kullanımı başlıkları tarihsel bağlam, kaynak eleştirisi ve karşılaştırmalı yorum çerçevesinde ele alınmaktadır.",
    "methods": "Kuramsal anlatım, birincil ve ikincil kaynak incelemesi, belge veya metin çözümlemesi, karşılaştırmalı analiz ve yapılandırılmış akademik tartışma.",
    "resources": "Marc Bloch, Tarih Savunusu; E. H. Carr, Tarih Nedir?; John Tosh, Tarihin Peşinde; konuya ilişkin birincil kaynaklar ve güncel hakemli çalışmalar.",
    "sdgs": [
      "4",
      "11",
      "16"
    ],
    "outcomes": [
      "Kaynak alanının kapsamı ve terminolojisi ile ilgili ileri kavramları analiz eder.",
      "Birincil kaynak türlerinin sınıflandırılması bağlamındaki kaynak ve kanıtları eleştirel değerlendirir.",
      "Kronoloji, mekân ve aktörlerin belirlenmesi ile ilişkili tarihsel örnekleri karşılaştırır.",
      "Tarihsel verinin çözümlenmesi için uygun tarihsel çözümleme yaklaşımını uygular.",
      "Kaynak temelli tarihsel yorum geliştirme temelinde gerekçeli sonuçlar geliştirir."
    ],
    "weeklyTopics": [
      "Kaynak alanının kapsamı ve terminolojisi",
      "Kaynakların oluştuğu tarihsel bağlam",
      "Birincil kaynak türlerinin sınıflandırılması",
      "Yazılı ve maddi kaynakların özellikleri",
      "Müellif, kurum ve üretim amacı",
      "Metin, belge ve kayıtların dış tenkidi",
      "Kaynakların iç tenkidi ve güvenilirlik",
      "Kronoloji, mekân ve aktörlerin belirlenmesi",
      "Farklı kaynakların karşılaştırılması",
      "Arşiv ve katalog düzenlerinin kullanımı",
      "Kaynaklardaki temsil ve sessizlikler",
      "Tarihsel verinin çözümlenmesi",
      "Kanıtların literatürle ilişkilendirilmesi",
      "Etik kullanım ve doğru kaynak gösterme",
      "Kaynak temelli tarihsel yorum geliştirme"
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
    "department": "Tarih ABD",
    "programName": "Tarih",
    "level": "Tezsiz Yüksek Lisans",
    "code": "TTS743",
    "name": "Osmanlıda tasavvuf ve tarikatlar",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Atama Bekliyor",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Bu dersin, öğrencilerin sosyal, ekonomik ve kültürel tarih alanındaki ileri bilgileri kaynak temelli ve eleştirel bir yaklaşımla çözümlemelerine katkı sağlaması amaçlanmaktadır.",
    "content": "Sosyal ve kültürel tarihin kavramsal çerçevesi; Gündelik hayatı inceleyen kaynak türleri; Toplumsal tabakalar ve kimlikler; Aile, kadın ve toplumsal cinsiyet; Eğitim, yardım ve dayanışma kurumları; Üretim, tüketim ve ekonomik ilişkiler; Para, fiyat ve yaşam standartları; Kent, mekân ve yerel toplum; Basın, kültür ve kamusal alan; Dinî hayat, tasavvuf ve topluluklar başlıkları tarihsel bağlam, kaynak eleştirisi ve karşılaştırmalı yorum çerçevesinde ele alınmaktadır.",
    "methods": "Kuramsal anlatım, birincil ve ikincil kaynak incelemesi, belge veya metin çözümlemesi, karşılaştırmalı analiz ve yapılandırılmış akademik tartışma.",
    "resources": "Halil İnalcık, Osmanlı İmparatorluğu Klasik Çağ; Suraiya Faroqhi, Osmanlı Kültürü ve Gündelik Yaşam; Cumhurbaşkanlığı Devlet Arşivleri Başkanlığı katalog ve belge seçkileri.",
    "sdgs": [
      "4",
      "10",
      "11"
    ],
    "outcomes": [
      "Sosyal ve kültürel tarihin kavramsal çerçevesi ile ilgili ileri kavramları analiz eder.",
      "Toplumsal tabakalar ve kimlikler bağlamındaki kaynak ve kanıtları eleştirel değerlendirir.",
      "Kent, mekân ve yerel toplum ile ilişkili tarihsel örnekleri karşılaştırır.",
      "Belge ve anlatıların karşılaştırılması için uygun tarihsel çözümleme yaklaşımını uygular.",
      "Sosyal tarih bulgularının bütüncül yorumlanması temelinde gerekçeli sonuçlar geliştirir."
    ],
    "weeklyTopics": [
      "Sosyal ve kültürel tarihin kavramsal çerçevesi",
      "Gündelik hayatı inceleyen kaynak türleri",
      "Toplumsal tabakalar ve kimlikler",
      "Aile, kadın ve toplumsal cinsiyet",
      "Eğitim, yardım ve dayanışma kurumları",
      "Üretim, tüketim ve ekonomik ilişkiler",
      "Para, fiyat ve yaşam standartları",
      "Kent, mekân ve yerel toplum",
      "Basın, kültür ve kamusal alan",
      "Dinî hayat, tasavvuf ve topluluklar",
      "Nüfus, göç ve toplumsal hareketlilik",
      "Belge ve anlatıların karşılaştırılması",
      "Toplumsal değişim ve süreklilik",
      "Yerel örneklerin geniş bağlamla ilişkilendirilmesi",
      "Sosyal tarih bulgularının bütüncül yorumlanması"
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
          1,
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
          2,
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
          1,
          1,
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
          4,
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
          5,
          5,
          5,
          5,
          3,
          5,
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
    "department": "Tarih ABD",
    "programName": "Tarih",
    "level": "Tezsiz Yüksek Lisans",
    "code": "TTS745",
    "name": "19. yüzyılda avrupadaki gelişmeler ve osmanlı...",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Atama Bekliyor",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Bu dersin, öğrencilerin Yakın Çağ, Avrupa ve diplomasi tarihi alanındaki ileri bilgileri kaynak temelli ve eleştirel bir yaklaşımla çözümlemelerine katkı sağlaması amaçlanmaktadır.",
    "content": "Yakın Çağ tarihinin dönemlendirilmesi; Devrimler ve siyasal meşruiyet; Ulus-devletlerin oluşumu; Sanayileşme ve toplumsal dönüşüm; Emperyalizm ve sömürgecilik; Diplomasi sistemi ve güç dengesi; Milliyetçilik ve kimlik hareketleri; Savaşlar ve uluslararası düzen; Toplumsal hareketler ve siyasal katılım; Osmanlı Devleti ile Avrupa ilişkileri başlıkları tarihsel bağlam, kaynak eleştirisi ve karşılaştırmalı yorum çerçevesinde ele alınmaktadır.",
    "methods": "Kuramsal anlatım, birincil ve ikincil kaynak incelemesi, belge veya metin çözümlemesi, karşılaştırmalı analiz ve yapılandırılmış akademik tartışma.",
    "resources": "Erik Jan Zürcher, Modernleşen Türkiye'nin Tarihi; Feroz Ahmad, Modern Türkiye'nin Oluşumu; TBMM arşivi, süreli yayın koleksiyonları ve güncel hakemli çalışmalar.",
    "sdgs": [
      "4",
      "10",
      "16"
    ],
    "outcomes": [
      "Yakın Çağ tarihinin dönemlendirilmesi ile ilgili ileri kavramları analiz eder.",
      "Ulus-devletlerin oluşumu bağlamındaki kaynak ve kanıtları eleştirel değerlendirir.",
      "Savaşlar ve uluslararası düzen ile ilişkili tarihsel örnekleri karşılaştırır.",
      "Karşılaştırmalı ülke ve bölge örnekleri için uygun tarihsel çözümleme yaklaşımını uygular.",
      "Modern dünyanın tarihsel mirasının değerlendirilmesi temelinde gerekçeli sonuçlar geliştirir."
    ],
    "weeklyTopics": [
      "Yakın Çağ tarihinin dönemlendirilmesi",
      "Devrimler ve siyasal meşruiyet",
      "Ulus-devletlerin oluşumu",
      "Sanayileşme ve toplumsal dönüşüm",
      "Emperyalizm ve sömürgecilik",
      "Diplomasi sistemi ve güç dengesi",
      "Milliyetçilik ve kimlik hareketleri",
      "Savaşlar ve uluslararası düzen",
      "Toplumsal hareketler ve siyasal katılım",
      "Osmanlı Devleti ile Avrupa ilişkileri",
      "Birincil diplomatik kaynakların incelenmesi",
      "Karşılaştırmalı ülke ve bölge örnekleri",
      "Yirminci yüzyılın siyasal kırılmaları",
      "Uluslararası örgütlerin gelişimi",
      "Modern dünyanın tarihsel mirasının değerlendirilmesi"
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
          1,
          2,
          1,
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
          5,
          2,
          3,
          2,
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
          4,
          1,
          3,
          1,
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
          4,
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
          5,
          5,
          5,
          5,
          3,
          5,
          1,
          3,
          1,
          3,
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
    "department": "Tarih ABD",
    "programName": "Tarih",
    "level": "Tezsiz Yüksek Lisans",
    "code": "TTS749",
    "name": "20. yüzyıl siyasi tarihi",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Atama Bekliyor",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Bu dersin, öğrencilerin Türkiye Cumhuriyeti ve Millî Mücadele tarihi alanındaki ileri bilgileri kaynak temelli ve eleştirel bir yaklaşımla çözümlemelerine katkı sağlaması amaçlanmaktadır.",
    "content": "Geç Osmanlı mirası ve dönüşüm dinamikleri; Millî Mücadele'nin siyasal ve toplumsal koşulları; Kongreler, örgütlenme ve temsil; TBMM'nin kuruluşu ve yeni siyasal düzen; Cumhuriyet'in ilanı ve kurumsal dönüşüm; Hukuki, toplumsal ve kültürel reformlar; Ekonomi politikaları ve toplumsal yapı; Tek parti döneminin siyasal dinamikleri; Çok partili hayata geçiş; İç ve dış politika etkileşimi başlıkları tarihsel bağlam, kaynak eleştirisi ve karşılaştırmalı yorum çerçevesinde ele alınmaktadır.",
    "methods": "Kuramsal anlatım, birincil ve ikincil kaynak incelemesi, belge veya metin çözümlemesi, karşılaştırmalı analiz ve yapılandırılmış akademik tartışma.",
    "resources": "Erik Jan Zürcher, Modernleşen Türkiye'nin Tarihi; Feroz Ahmad, Modern Türkiye'nin Oluşumu; TBMM arşivi, süreli yayın koleksiyonları ve güncel hakemli çalışmalar.",
    "sdgs": [
      "4",
      "10",
      "16"
    ],
    "outcomes": [
      "Geç Osmanlı mirası ve dönüşüm dinamikleri ile ilgili ileri kavramları analiz eder.",
      "Kongreler, örgütlenme ve temsil bağlamındaki kaynak ve kanıtları eleştirel değerlendirir.",
      "Tek parti döneminin siyasal dinamikleri ile ilişkili tarihsel örnekleri karşılaştırır.",
      "Belge, hatırat ve süreli yayınların eleştirisi için uygun tarihsel çözümleme yaklaşımını uygular.",
      "Cumhuriyet tarihinin süreklilik ve değişim açısından analizi temelinde gerekçeli sonuçlar geliştirir."
    ],
    "weeklyTopics": [
      "Geç Osmanlı mirası ve dönüşüm dinamikleri",
      "Millî Mücadele'nin siyasal ve toplumsal koşulları",
      "Kongreler, örgütlenme ve temsil",
      "TBMM'nin kuruluşu ve yeni siyasal düzen",
      "Cumhuriyet'in ilanı ve kurumsal dönüşüm",
      "Hukuki, toplumsal ve kültürel reformlar",
      "Ekonomi politikaları ve toplumsal yapı",
      "Tek parti döneminin siyasal dinamikleri",
      "Çok partili hayata geçiş",
      "İç ve dış politika etkileşimi",
      "Basın, kamuoyu ve siyasal iletişim",
      "Belge, hatırat ve süreli yayınların eleştirisi",
      "Toplumsal hareketler ve krizler",
      "Literatürdeki farklı tarihsel yorumlar",
      "Cumhuriyet tarihinin süreklilik ve değişim açısından analizi"
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
          1,
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
          2,
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
          1,
          3,
          3,
          1,
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
          4,
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
          5,
          5,
          5,
          5,
          3,
          5,
          1,
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
    "department": "Tarih ABD",
    "programName": "Tarih",
    "level": "Tezsiz Yüksek Lisans",
    "code": "TTS751",
    "name": "Milli mücadele ve türkiye cumhuriyeti tarihin...",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Atama Bekliyor",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Bu dersin, öğrencilerin Türkiye Cumhuriyeti ve Millî Mücadele tarihi alanındaki ileri bilgileri kaynak temelli ve eleştirel bir yaklaşımla çözümlemelerine katkı sağlaması amaçlanmaktadır.",
    "content": "Geç Osmanlı mirası ve dönüşüm dinamikleri; Millî Mücadele'nin siyasal ve toplumsal koşulları; Kongreler, örgütlenme ve temsil; TBMM'nin kuruluşu ve yeni siyasal düzen; Cumhuriyet'in ilanı ve kurumsal dönüşüm; Hukuki, toplumsal ve kültürel reformlar; Ekonomi politikaları ve toplumsal yapı; Tek parti döneminin siyasal dinamikleri; Çok partili hayata geçiş; İç ve dış politika etkileşimi başlıkları tarihsel bağlam, kaynak eleştirisi ve karşılaştırmalı yorum çerçevesinde ele alınmaktadır.",
    "methods": "Kuramsal anlatım, birincil ve ikincil kaynak incelemesi, belge veya metin çözümlemesi, karşılaştırmalı analiz ve yapılandırılmış akademik tartışma.",
    "resources": "Erik Jan Zürcher, Modernleşen Türkiye'nin Tarihi; Feroz Ahmad, Modern Türkiye'nin Oluşumu; TBMM arşivi, süreli yayın koleksiyonları ve güncel hakemli çalışmalar.",
    "sdgs": [
      "4",
      "10",
      "16"
    ],
    "outcomes": [
      "Geç Osmanlı mirası ve dönüşüm dinamikleri ile ilgili ileri kavramları analiz eder.",
      "Kongreler, örgütlenme ve temsil bağlamındaki kaynak ve kanıtları eleştirel değerlendirir.",
      "Tek parti döneminin siyasal dinamikleri ile ilişkili tarihsel örnekleri karşılaştırır.",
      "Belge, hatırat ve süreli yayınların eleştirisi için uygun tarihsel çözümleme yaklaşımını uygular.",
      "Cumhuriyet tarihinin süreklilik ve değişim açısından analizi temelinde gerekçeli sonuçlar geliştirir."
    ],
    "weeklyTopics": [
      "Geç Osmanlı mirası ve dönüşüm dinamikleri",
      "Millî Mücadele'nin siyasal ve toplumsal koşulları",
      "Kongreler, örgütlenme ve temsil",
      "TBMM'nin kuruluşu ve yeni siyasal düzen",
      "Cumhuriyet'in ilanı ve kurumsal dönüşüm",
      "Hukuki, toplumsal ve kültürel reformlar",
      "Ekonomi politikaları ve toplumsal yapı",
      "Tek parti döneminin siyasal dinamikleri",
      "Çok partili hayata geçiş",
      "İç ve dış politika etkileşimi",
      "Basın, kamuoyu ve siyasal iletişim",
      "Belge, hatırat ve süreli yayınların eleştirisi",
      "Toplumsal hareketler ve krizler",
      "Literatürdeki farklı tarihsel yorumlar",
      "Cumhuriyet tarihinin süreklilik ve değişim açısından analizi"
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
          1,
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
          2,
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
          1,
          3,
          3,
          1,
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
          4,
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
          5,
          5,
          5,
          5,
          3,
          5,
          1,
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
    "department": "Tarih ABD",
    "programName": "Tarih",
    "level": "Tezsiz Yüksek Lisans",
    "code": "TTS753",
    "name": "Cumhuriyet dönemi tarihi vesikalar",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Atama Bekliyor",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Bu dersin, öğrencilerin tarihsel kaynaklar ve kaynak eleştirisi alanındaki ileri bilgileri kaynak temelli ve eleştirel bir yaklaşımla çözümlemelerine katkı sağlaması amaçlanmaktadır.",
    "content": "Kaynak alanının kapsamı ve terminolojisi; Kaynakların oluştuğu tarihsel bağlam; Birincil kaynak türlerinin sınıflandırılması; Yazılı ve maddi kaynakların özellikleri; Müellif, kurum ve üretim amacı; Metin, belge ve kayıtların dış tenkidi; Kaynakların iç tenkidi ve güvenilirlik; Kronoloji, mekân ve aktörlerin belirlenmesi; Farklı kaynakların karşılaştırılması; Arşiv ve katalog düzenlerinin kullanımı başlıkları tarihsel bağlam, kaynak eleştirisi ve karşılaştırmalı yorum çerçevesinde ele alınmaktadır.",
    "methods": "Kuramsal anlatım, birincil ve ikincil kaynak incelemesi, belge veya metin çözümlemesi, karşılaştırmalı analiz ve yapılandırılmış akademik tartışma.",
    "resources": "Marc Bloch, Tarih Savunusu; E. H. Carr, Tarih Nedir?; John Tosh, Tarihin Peşinde; konuya ilişkin birincil kaynaklar ve güncel hakemli çalışmalar.",
    "sdgs": [
      "4",
      "11",
      "16"
    ],
    "outcomes": [
      "Kaynak alanının kapsamı ve terminolojisi ile ilgili ileri kavramları analiz eder.",
      "Birincil kaynak türlerinin sınıflandırılması bağlamındaki kaynak ve kanıtları eleştirel değerlendirir.",
      "Kronoloji, mekân ve aktörlerin belirlenmesi ile ilişkili tarihsel örnekleri karşılaştırır.",
      "Tarihsel verinin çözümlenmesi için uygun tarihsel çözümleme yaklaşımını uygular.",
      "Kaynak temelli tarihsel yorum geliştirme temelinde gerekçeli sonuçlar geliştirir."
    ],
    "weeklyTopics": [
      "Kaynak alanının kapsamı ve terminolojisi",
      "Kaynakların oluştuğu tarihsel bağlam",
      "Birincil kaynak türlerinin sınıflandırılması",
      "Yazılı ve maddi kaynakların özellikleri",
      "Müellif, kurum ve üretim amacı",
      "Metin, belge ve kayıtların dış tenkidi",
      "Kaynakların iç tenkidi ve güvenilirlik",
      "Kronoloji, mekân ve aktörlerin belirlenmesi",
      "Farklı kaynakların karşılaştırılması",
      "Arşiv ve katalog düzenlerinin kullanımı",
      "Kaynaklardaki temsil ve sessizlikler",
      "Tarihsel verinin çözümlenmesi",
      "Kanıtların literatürle ilişkilendirilmesi",
      "Etik kullanım ve doğru kaynak gösterme",
      "Kaynak temelli tarihsel yorum geliştirme"
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
    "department": "Tarih ABD",
    "programName": "Tarih",
    "level": "Tezsiz Yüksek Lisans",
    "code": "TTS755",
    "name": "Cumhuriyet dönemi dış politika tarihi",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Doç. Dr. ÜMMÜGÜLSÜM CANDEĞER",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Türk Dış Politikasının temelleri ve bu temeller çerçevesinde nasıl şekillendiğinin anlaşılması ve açıklanabilmesidir. Kronolojik olarak dersin içeriğinin oluşturulması ve yaşanan gelişmelerin anlaşılması hedeflenmiştir.",
    "content": "Bu ders Türk Dış Politikası tarihini inceleyen bir derstir. Osmanlı Devleti son döneminden başlayarak 1980`li yıllara kadar olan zamanda Türkiye'nin diğer devletlerle olan ilişkisini kapsamaktadır. .",
    "methods": "Sözlü sunum",
    "resources": "Kaynaklar: 1. Baskın Oran, ed. Türk Dış Politikası: Kurtuluş Savaşı?ndan Bugüne Olgular, Belgeler, Yorumlar, Cilt I,II ve III, İletişim Yayınları, İstanbul 2003. 2. Faruk Sönmezoğlu, ed. Türk Dış Politikasının Analizi, Der Yayınları: İstanbul 2004. 3. William Hale, Türk Dış Politikası (1774- 2000), Mozaik Yayınları, İstanbul 2003. 4. Hüseyin Bağcı vd, eds., Türk Dış Politikası I-II, Anadolu Üniversitesi Yayınları, Eskişehir 2013.; Ders Notları: 1. Baskın Oran, ed. Türk Dış Politikası: Kurtuluş Savaşı?ndan Bugüne Olgular, Belgeler, Yorumlar, Cilt I ve II, İletişim Yayınları, İstanbul 2003.2. Faruk Sönmezoğlu, ed. Türk Dış Politikasının Analizi, Der Yayınları: İstanbul 2004.3. William Hale, Türk Dış Politikası (1774- 2000), Mozaik Yayınları, İstanbul 2003.4. Hüseyin Bağcı vd, eds., Türk Dış Politikası I-II, Anadolu Üniversitesi Yayınları, Eskişehir 2013.",
    "sdgs": [
      "4",
      "10",
      "16"
    ],
    "outcomes": [
      "Geç Osmanlı mirası ve dönüşüm dinamikleri ile ilgili ileri kavramları analiz eder.",
      "Kongreler, örgütlenme ve temsil bağlamındaki kaynak ve kanıtları eleştirel değerlendirir.",
      "Tek parti döneminin siyasal dinamikleri ile ilişkili tarihsel örnekleri karşılaştırır.",
      "Belge, hatırat ve süreli yayınların eleştirisi için uygun tarihsel çözümleme yaklaşımını uygular.",
      "Cumhuriyet tarihinin süreklilik ve değişim açısından analizi temelinde gerekçeli sonuçlar geliştirir."
    ],
    "weeklyTopics": [
      "Derse Giriş ve kaynakların tanıtılması",
      "Türk Dış Politikasının Tarihsel Kökenleri ve Genel Özellikleri",
      "20. yüzyıl başında Türk Dış Politikası",
      "1919-1923: Kurtuluş Savaşı Yılları",
      "Atatürk Dönemi Türk Dış Politikası",
      "İnönü Dönemi Türk Dış Politikası",
      "Soğuk Savaş Dönemi Türk Dış Politikası",
      "Soğuk Savaş Sonrası Türk Dış Politikası",
      "Dönemin genel değerlendirmesi",
      "Geç Osmanlı mirası ve dönüşüm dinamikleri",
      "Millî Mücadele'nin siyasal ve toplumsal koşulları",
      "Kongreler, örgütlenme ve temsil",
      "TBMM'nin kuruluşu ve yeni siyasal düzen",
      "Cumhuriyet'in ilanı ve kurumsal dönüşüm",
      "Hukuki, toplumsal ve kültürel reformlar"
    ],
    "assessments": [
      {
        "name": "Yarıyıl Sonu Sınavı",
        "count": 1,
        "weight": 100
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
          4,
          4,
          4,
          2,
          4,
          1,
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
          2,
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
          1,
          3,
          3,
          1,
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
          4,
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
          5,
          5,
          5,
          5,
          3,
          5,
          1,
          3,
          3,
          1,
          3
        ]
      }
    ],
    "sourceUrl": "https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=258911&lang=tr",
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
    "department": "Tarih ABD",
    "programName": "Tarih",
    "level": "Tezsiz Yüksek Lisans",
    "code": "TTS757",
    "name": "Meşrutiyet'ten cumhuriyet'e sosyal yardım pol...",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Atama Bekliyor",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Bu dersin, öğrencilerin Türkiye Cumhuriyeti ve Millî Mücadele tarihi alanındaki ileri bilgileri kaynak temelli ve eleştirel bir yaklaşımla çözümlemelerine katkı sağlaması amaçlanmaktadır.",
    "content": "Geç Osmanlı mirası ve dönüşüm dinamikleri; Millî Mücadele'nin siyasal ve toplumsal koşulları; Kongreler, örgütlenme ve temsil; TBMM'nin kuruluşu ve yeni siyasal düzen; Cumhuriyet'in ilanı ve kurumsal dönüşüm; Hukuki, toplumsal ve kültürel reformlar; Ekonomi politikaları ve toplumsal yapı; Tek parti döneminin siyasal dinamikleri; Çok partili hayata geçiş; İç ve dış politika etkileşimi başlıkları tarihsel bağlam, kaynak eleştirisi ve karşılaştırmalı yorum çerçevesinde ele alınmaktadır.",
    "methods": "Kuramsal anlatım, birincil ve ikincil kaynak incelemesi, belge veya metin çözümlemesi, karşılaştırmalı analiz ve yapılandırılmış akademik tartışma.",
    "resources": "Erik Jan Zürcher, Modernleşen Türkiye'nin Tarihi; Feroz Ahmad, Modern Türkiye'nin Oluşumu; TBMM arşivi, süreli yayın koleksiyonları ve güncel hakemli çalışmalar.",
    "sdgs": [
      "4",
      "10",
      "16"
    ],
    "outcomes": [
      "Geç Osmanlı mirası ve dönüşüm dinamikleri ile ilgili ileri kavramları analiz eder.",
      "Kongreler, örgütlenme ve temsil bağlamındaki kaynak ve kanıtları eleştirel değerlendirir.",
      "Tek parti döneminin siyasal dinamikleri ile ilişkili tarihsel örnekleri karşılaştırır.",
      "Belge, hatırat ve süreli yayınların eleştirisi için uygun tarihsel çözümleme yaklaşımını uygular.",
      "Cumhuriyet tarihinin süreklilik ve değişim açısından analizi temelinde gerekçeli sonuçlar geliştirir."
    ],
    "weeklyTopics": [
      "Geç Osmanlı mirası ve dönüşüm dinamikleri",
      "Millî Mücadele'nin siyasal ve toplumsal koşulları",
      "Kongreler, örgütlenme ve temsil",
      "TBMM'nin kuruluşu ve yeni siyasal düzen",
      "Cumhuriyet'in ilanı ve kurumsal dönüşüm",
      "Hukuki, toplumsal ve kültürel reformlar",
      "Ekonomi politikaları ve toplumsal yapı",
      "Tek parti döneminin siyasal dinamikleri",
      "Çok partili hayata geçiş",
      "İç ve dış politika etkileşimi",
      "Basın, kamuoyu ve siyasal iletişim",
      "Belge, hatırat ve süreli yayınların eleştirisi",
      "Toplumsal hareketler ve krizler",
      "Literatürdeki farklı tarihsel yorumlar",
      "Cumhuriyet tarihinin süreklilik ve değişim açısından analizi"
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
          1,
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
          2,
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
          1,
          3,
          3,
          1,
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
          4,
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
          5,
          5,
          5,
          5,
          3,
          5,
          1,
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
    "department": "Tarih ABD",
    "programName": "Tarih",
    "level": "Tezsiz Yüksek Lisans",
    "code": "TTS759",
    "name": "Türk diplomasi tarihi",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Atama Bekliyor",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Bu dersin, öğrencilerin Yakın Çağ, Avrupa ve diplomasi tarihi alanındaki ileri bilgileri kaynak temelli ve eleştirel bir yaklaşımla çözümlemelerine katkı sağlaması amaçlanmaktadır.",
    "content": "Yakın Çağ tarihinin dönemlendirilmesi; Devrimler ve siyasal meşruiyet; Ulus-devletlerin oluşumu; Sanayileşme ve toplumsal dönüşüm; Emperyalizm ve sömürgecilik; Diplomasi sistemi ve güç dengesi; Milliyetçilik ve kimlik hareketleri; Savaşlar ve uluslararası düzen; Toplumsal hareketler ve siyasal katılım; Osmanlı Devleti ile Avrupa ilişkileri başlıkları tarihsel bağlam, kaynak eleştirisi ve karşılaştırmalı yorum çerçevesinde ele alınmaktadır.",
    "methods": "Kuramsal anlatım, birincil ve ikincil kaynak incelemesi, belge veya metin çözümlemesi, karşılaştırmalı analiz ve yapılandırılmış akademik tartışma.",
    "resources": "Erik Jan Zürcher, Modernleşen Türkiye'nin Tarihi; Feroz Ahmad, Modern Türkiye'nin Oluşumu; TBMM arşivi, süreli yayın koleksiyonları ve güncel hakemli çalışmalar.",
    "sdgs": [
      "4",
      "10",
      "16"
    ],
    "outcomes": [
      "Yakın Çağ tarihinin dönemlendirilmesi ile ilgili ileri kavramları analiz eder.",
      "Ulus-devletlerin oluşumu bağlamındaki kaynak ve kanıtları eleştirel değerlendirir.",
      "Savaşlar ve uluslararası düzen ile ilişkili tarihsel örnekleri karşılaştırır.",
      "Karşılaştırmalı ülke ve bölge örnekleri için uygun tarihsel çözümleme yaklaşımını uygular.",
      "Modern dünyanın tarihsel mirasının değerlendirilmesi temelinde gerekçeli sonuçlar geliştirir."
    ],
    "weeklyTopics": [
      "Yakın Çağ tarihinin dönemlendirilmesi",
      "Devrimler ve siyasal meşruiyet",
      "Ulus-devletlerin oluşumu",
      "Sanayileşme ve toplumsal dönüşüm",
      "Emperyalizm ve sömürgecilik",
      "Diplomasi sistemi ve güç dengesi",
      "Milliyetçilik ve kimlik hareketleri",
      "Savaşlar ve uluslararası düzen",
      "Toplumsal hareketler ve siyasal katılım",
      "Osmanlı Devleti ile Avrupa ilişkileri",
      "Birincil diplomatik kaynakların incelenmesi",
      "Karşılaştırmalı ülke ve bölge örnekleri",
      "Yirminci yüzyılın siyasal kırılmaları",
      "Uluslararası örgütlerin gelişimi",
      "Modern dünyanın tarihsel mirasının değerlendirilmesi"
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
          1,
          2,
          1,
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
          5,
          2,
          3,
          2,
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
          4,
          1,
          3,
          1,
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
          4,
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
          5,
          5,
          5,
          5,
          3,
          5,
          1,
          3,
          1,
          3,
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
    "department": "Tarih ABD",
    "programName": "Tarih",
    "level": "Tezsiz Yüksek Lisans",
    "code": "TTS761",
    "name": "Arşivler ve müzecilik tarihi",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Atama Bekliyor",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Bu dersin, öğrencilerin tarihsel kaynaklar ve kaynak eleştirisi alanındaki ileri bilgileri kaynak temelli ve eleştirel bir yaklaşımla çözümlemelerine katkı sağlaması amaçlanmaktadır.",
    "content": "Kaynak alanının kapsamı ve terminolojisi; Kaynakların oluştuğu tarihsel bağlam; Birincil kaynak türlerinin sınıflandırılması; Yazılı ve maddi kaynakların özellikleri; Müellif, kurum ve üretim amacı; Metin, belge ve kayıtların dış tenkidi; Kaynakların iç tenkidi ve güvenilirlik; Kronoloji, mekân ve aktörlerin belirlenmesi; Farklı kaynakların karşılaştırılması; Arşiv ve katalog düzenlerinin kullanımı başlıkları tarihsel bağlam, kaynak eleştirisi ve karşılaştırmalı yorum çerçevesinde ele alınmaktadır.",
    "methods": "Kuramsal anlatım, birincil ve ikincil kaynak incelemesi, belge veya metin çözümlemesi, karşılaştırmalı analiz ve yapılandırılmış akademik tartışma.",
    "resources": "Marc Bloch, Tarih Savunusu; E. H. Carr, Tarih Nedir?; John Tosh, Tarihin Peşinde; konuya ilişkin birincil kaynaklar ve güncel hakemli çalışmalar.",
    "sdgs": [
      "4",
      "11",
      "16"
    ],
    "outcomes": [
      "Kaynak alanının kapsamı ve terminolojisi ile ilgili ileri kavramları analiz eder.",
      "Birincil kaynak türlerinin sınıflandırılması bağlamındaki kaynak ve kanıtları eleştirel değerlendirir.",
      "Kronoloji, mekân ve aktörlerin belirlenmesi ile ilişkili tarihsel örnekleri karşılaştırır.",
      "Tarihsel verinin çözümlenmesi için uygun tarihsel çözümleme yaklaşımını uygular.",
      "Kaynak temelli tarihsel yorum geliştirme temelinde gerekçeli sonuçlar geliştirir."
    ],
    "weeklyTopics": [
      "Kaynak alanının kapsamı ve terminolojisi",
      "Kaynakların oluştuğu tarihsel bağlam",
      "Birincil kaynak türlerinin sınıflandırılması",
      "Yazılı ve maddi kaynakların özellikleri",
      "Müellif, kurum ve üretim amacı",
      "Metin, belge ve kayıtların dış tenkidi",
      "Kaynakların iç tenkidi ve güvenilirlik",
      "Kronoloji, mekân ve aktörlerin belirlenmesi",
      "Farklı kaynakların karşılaştırılması",
      "Arşiv ve katalog düzenlerinin kullanımı",
      "Kaynaklardaki temsil ve sessizlikler",
      "Tarihsel verinin çözümlenmesi",
      "Kanıtların literatürle ilişkilendirilmesi",
      "Etik kullanım ve doğru kaynak gösterme",
      "Kaynak temelli tarihsel yorum geliştirme"
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
    "department": "Tarih ABD",
    "programName": "Tarih",
    "level": "Tezsiz Yüksek Lisans",
    "code": "TTS763",
    "name": "Türk basın tarihi",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Atama Bekliyor",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Bu dersin, öğrencilerin sosyal, ekonomik ve kültürel tarih alanındaki ileri bilgileri kaynak temelli ve eleştirel bir yaklaşımla çözümlemelerine katkı sağlaması amaçlanmaktadır.",
    "content": "Sosyal ve kültürel tarihin kavramsal çerçevesi; Gündelik hayatı inceleyen kaynak türleri; Toplumsal tabakalar ve kimlikler; Aile, kadın ve toplumsal cinsiyet; Eğitim, yardım ve dayanışma kurumları; Üretim, tüketim ve ekonomik ilişkiler; Para, fiyat ve yaşam standartları; Kent, mekân ve yerel toplum; Basın, kültür ve kamusal alan; Dinî hayat, tasavvuf ve topluluklar başlıkları tarihsel bağlam, kaynak eleştirisi ve karşılaştırmalı yorum çerçevesinde ele alınmaktadır.",
    "methods": "Kuramsal anlatım, birincil ve ikincil kaynak incelemesi, belge veya metin çözümlemesi, karşılaştırmalı analiz ve yapılandırılmış akademik tartışma.",
    "resources": "Halil İnalcık, Osmanlı İmparatorluğu Klasik Çağ; Suraiya Faroqhi, Osmanlı Kültürü ve Gündelik Yaşam; Cumhurbaşkanlığı Devlet Arşivleri Başkanlığı katalog ve belge seçkileri.",
    "sdgs": [
      "4",
      "10",
      "11"
    ],
    "outcomes": [
      "Sosyal ve kültürel tarihin kavramsal çerçevesi ile ilgili ileri kavramları analiz eder.",
      "Toplumsal tabakalar ve kimlikler bağlamındaki kaynak ve kanıtları eleştirel değerlendirir.",
      "Kent, mekân ve yerel toplum ile ilişkili tarihsel örnekleri karşılaştırır.",
      "Belge ve anlatıların karşılaştırılması için uygun tarihsel çözümleme yaklaşımını uygular.",
      "Sosyal tarih bulgularının bütüncül yorumlanması temelinde gerekçeli sonuçlar geliştirir."
    ],
    "weeklyTopics": [
      "Sosyal ve kültürel tarihin kavramsal çerçevesi",
      "Gündelik hayatı inceleyen kaynak türleri",
      "Toplumsal tabakalar ve kimlikler",
      "Aile, kadın ve toplumsal cinsiyet",
      "Eğitim, yardım ve dayanışma kurumları",
      "Üretim, tüketim ve ekonomik ilişkiler",
      "Para, fiyat ve yaşam standartları",
      "Kent, mekân ve yerel toplum",
      "Basın, kültür ve kamusal alan",
      "Dinî hayat, tasavvuf ve topluluklar",
      "Nüfus, göç ve toplumsal hareketlilik",
      "Belge ve anlatıların karşılaştırılması",
      "Toplumsal değişim ve süreklilik",
      "Yerel örneklerin geniş bağlamla ilişkilendirilmesi",
      "Sosyal tarih bulgularının bütüncül yorumlanması"
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
          1,
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
          2,
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
          1,
          1,
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
          4,
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
          5,
          5,
          5,
          5,
          3,
          5,
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
    "department": "Tarih ABD",
    "programName": "Tarih",
    "level": "Tezsiz Yüksek Lisans",
    "code": "TTS765",
    "name": "Çukurova bölgesinde türk-ermeni ilişkileri",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Atama Bekliyor",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Bu dersin, öğrencilerin sosyal, ekonomik ve kültürel tarih alanındaki ileri bilgileri kaynak temelli ve eleştirel bir yaklaşımla çözümlemelerine katkı sağlaması amaçlanmaktadır.",
    "content": "Sosyal ve kültürel tarihin kavramsal çerçevesi; Gündelik hayatı inceleyen kaynak türleri; Toplumsal tabakalar ve kimlikler; Aile, kadın ve toplumsal cinsiyet; Eğitim, yardım ve dayanışma kurumları; Üretim, tüketim ve ekonomik ilişkiler; Para, fiyat ve yaşam standartları; Kent, mekân ve yerel toplum; Basın, kültür ve kamusal alan; Dinî hayat, tasavvuf ve topluluklar başlıkları tarihsel bağlam, kaynak eleştirisi ve karşılaştırmalı yorum çerçevesinde ele alınmaktadır.",
    "methods": "Kuramsal anlatım, birincil ve ikincil kaynak incelemesi, belge veya metin çözümlemesi, karşılaştırmalı analiz ve yapılandırılmış akademik tartışma.",
    "resources": "Halil İnalcık, Osmanlı İmparatorluğu Klasik Çağ; Suraiya Faroqhi, Osmanlı Kültürü ve Gündelik Yaşam; Cumhurbaşkanlığı Devlet Arşivleri Başkanlığı katalog ve belge seçkileri.",
    "sdgs": [
      "4",
      "10",
      "11"
    ],
    "outcomes": [
      "Sosyal ve kültürel tarihin kavramsal çerçevesi ile ilgili ileri kavramları analiz eder.",
      "Toplumsal tabakalar ve kimlikler bağlamındaki kaynak ve kanıtları eleştirel değerlendirir.",
      "Kent, mekân ve yerel toplum ile ilişkili tarihsel örnekleri karşılaştırır.",
      "Belge ve anlatıların karşılaştırılması için uygun tarihsel çözümleme yaklaşımını uygular.",
      "Sosyal tarih bulgularının bütüncül yorumlanması temelinde gerekçeli sonuçlar geliştirir."
    ],
    "weeklyTopics": [
      "Sosyal ve kültürel tarihin kavramsal çerçevesi",
      "Gündelik hayatı inceleyen kaynak türleri",
      "Toplumsal tabakalar ve kimlikler",
      "Aile, kadın ve toplumsal cinsiyet",
      "Eğitim, yardım ve dayanışma kurumları",
      "Üretim, tüketim ve ekonomik ilişkiler",
      "Para, fiyat ve yaşam standartları",
      "Kent, mekân ve yerel toplum",
      "Basın, kültür ve kamusal alan",
      "Dinî hayat, tasavvuf ve topluluklar",
      "Nüfus, göç ve toplumsal hareketlilik",
      "Belge ve anlatıların karşılaştırılması",
      "Toplumsal değişim ve süreklilik",
      "Yerel örneklerin geniş bağlamla ilişkilendirilmesi",
      "Sosyal tarih bulgularının bütüncül yorumlanması"
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
          1,
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
          2,
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
          1,
          1,
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
          4,
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
          5,
          5,
          5,
          5,
          3,
          5,
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
    "department": "Tarih ABD",
    "programName": "Tarih",
    "level": "Tezsiz Yüksek Lisans",
    "code": "TTS767",
    "name": "Cumhuriyet döneminde iç karışıklıklar",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Atama Bekliyor",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Bu dersin, öğrencilerin Türkiye Cumhuriyeti ve Millî Mücadele tarihi alanındaki ileri bilgileri kaynak temelli ve eleştirel bir yaklaşımla çözümlemelerine katkı sağlaması amaçlanmaktadır.",
    "content": "Geç Osmanlı mirası ve dönüşüm dinamikleri; Millî Mücadele'nin siyasal ve toplumsal koşulları; Kongreler, örgütlenme ve temsil; TBMM'nin kuruluşu ve yeni siyasal düzen; Cumhuriyet'in ilanı ve kurumsal dönüşüm; Hukuki, toplumsal ve kültürel reformlar; Ekonomi politikaları ve toplumsal yapı; Tek parti döneminin siyasal dinamikleri; Çok partili hayata geçiş; İç ve dış politika etkileşimi başlıkları tarihsel bağlam, kaynak eleştirisi ve karşılaştırmalı yorum çerçevesinde ele alınmaktadır.",
    "methods": "Kuramsal anlatım, birincil ve ikincil kaynak incelemesi, belge veya metin çözümlemesi, karşılaştırmalı analiz ve yapılandırılmış akademik tartışma.",
    "resources": "Erik Jan Zürcher, Modernleşen Türkiye'nin Tarihi; Feroz Ahmad, Modern Türkiye'nin Oluşumu; TBMM arşivi, süreli yayın koleksiyonları ve güncel hakemli çalışmalar.",
    "sdgs": [
      "4",
      "10",
      "16"
    ],
    "outcomes": [
      "Geç Osmanlı mirası ve dönüşüm dinamikleri ile ilgili ileri kavramları analiz eder.",
      "Kongreler, örgütlenme ve temsil bağlamındaki kaynak ve kanıtları eleştirel değerlendirir.",
      "Tek parti döneminin siyasal dinamikleri ile ilişkili tarihsel örnekleri karşılaştırır.",
      "Belge, hatırat ve süreli yayınların eleştirisi için uygun tarihsel çözümleme yaklaşımını uygular.",
      "Cumhuriyet tarihinin süreklilik ve değişim açısından analizi temelinde gerekçeli sonuçlar geliştirir."
    ],
    "weeklyTopics": [
      "Geç Osmanlı mirası ve dönüşüm dinamikleri",
      "Millî Mücadele'nin siyasal ve toplumsal koşulları",
      "Kongreler, örgütlenme ve temsil",
      "TBMM'nin kuruluşu ve yeni siyasal düzen",
      "Cumhuriyet'in ilanı ve kurumsal dönüşüm",
      "Hukuki, toplumsal ve kültürel reformlar",
      "Ekonomi politikaları ve toplumsal yapı",
      "Tek parti döneminin siyasal dinamikleri",
      "Çok partili hayata geçiş",
      "İç ve dış politika etkileşimi",
      "Basın, kamuoyu ve siyasal iletişim",
      "Belge, hatırat ve süreli yayınların eleştirisi",
      "Toplumsal hareketler ve krizler",
      "Literatürdeki farklı tarihsel yorumlar",
      "Cumhuriyet tarihinin süreklilik ve değişim açısından analizi"
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
          1,
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
          2,
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
          1,
          3,
          3,
          1,
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
          4,
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
          5,
          5,
          5,
          5,
          3,
          5,
          1,
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
    "department": "Tarih ABD",
    "programName": "Tarih",
    "level": "Tezsiz Yüksek Lisans",
    "code": "TTS769",
    "name": "Milli mücadele döneminde kongreler",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Atama Bekliyor",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Bu dersin, öğrencilerin Türkiye Cumhuriyeti ve Millî Mücadele tarihi alanındaki ileri bilgileri kaynak temelli ve eleştirel bir yaklaşımla çözümlemelerine katkı sağlaması amaçlanmaktadır.",
    "content": "Geç Osmanlı mirası ve dönüşüm dinamikleri; Millî Mücadele'nin siyasal ve toplumsal koşulları; Kongreler, örgütlenme ve temsil; TBMM'nin kuruluşu ve yeni siyasal düzen; Cumhuriyet'in ilanı ve kurumsal dönüşüm; Hukuki, toplumsal ve kültürel reformlar; Ekonomi politikaları ve toplumsal yapı; Tek parti döneminin siyasal dinamikleri; Çok partili hayata geçiş; İç ve dış politika etkileşimi başlıkları tarihsel bağlam, kaynak eleştirisi ve karşılaştırmalı yorum çerçevesinde ele alınmaktadır.",
    "methods": "Kuramsal anlatım, birincil ve ikincil kaynak incelemesi, belge veya metin çözümlemesi, karşılaştırmalı analiz ve yapılandırılmış akademik tartışma.",
    "resources": "Erik Jan Zürcher, Modernleşen Türkiye'nin Tarihi; Feroz Ahmad, Modern Türkiye'nin Oluşumu; TBMM arşivi, süreli yayın koleksiyonları ve güncel hakemli çalışmalar.",
    "sdgs": [
      "4",
      "10",
      "16"
    ],
    "outcomes": [
      "Geç Osmanlı mirası ve dönüşüm dinamikleri ile ilgili ileri kavramları analiz eder.",
      "Kongreler, örgütlenme ve temsil bağlamındaki kaynak ve kanıtları eleştirel değerlendirir.",
      "Tek parti döneminin siyasal dinamikleri ile ilişkili tarihsel örnekleri karşılaştırır.",
      "Belge, hatırat ve süreli yayınların eleştirisi için uygun tarihsel çözümleme yaklaşımını uygular.",
      "Cumhuriyet tarihinin süreklilik ve değişim açısından analizi temelinde gerekçeli sonuçlar geliştirir."
    ],
    "weeklyTopics": [
      "Geç Osmanlı mirası ve dönüşüm dinamikleri",
      "Millî Mücadele'nin siyasal ve toplumsal koşulları",
      "Kongreler, örgütlenme ve temsil",
      "TBMM'nin kuruluşu ve yeni siyasal düzen",
      "Cumhuriyet'in ilanı ve kurumsal dönüşüm",
      "Hukuki, toplumsal ve kültürel reformlar",
      "Ekonomi politikaları ve toplumsal yapı",
      "Tek parti döneminin siyasal dinamikleri",
      "Çok partili hayata geçiş",
      "İç ve dış politika etkileşimi",
      "Basın, kamuoyu ve siyasal iletişim",
      "Belge, hatırat ve süreli yayınların eleştirisi",
      "Toplumsal hareketler ve krizler",
      "Literatürdeki farklı tarihsel yorumlar",
      "Cumhuriyet tarihinin süreklilik ve değişim açısından analizi"
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
          1,
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
          2,
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
          1,
          3,
          3,
          1,
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
          4,
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
          5,
          5,
          5,
          5,
          3,
          5,
          1,
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
    "department": "Tarih ABD",
    "programName": "Tarih",
    "level": "Tezsiz Yüksek Lisans",
    "code": "TTS771",
    "name": "Nutuk ve temel öğretileri",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Atama Bekliyor",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Bu dersin, öğrencilerin tarihsel kaynaklar ve kaynak eleştirisi alanındaki ileri bilgileri kaynak temelli ve eleştirel bir yaklaşımla çözümlemelerine katkı sağlaması amaçlanmaktadır.",
    "content": "Kaynak alanının kapsamı ve terminolojisi; Kaynakların oluştuğu tarihsel bağlam; Birincil kaynak türlerinin sınıflandırılması; Yazılı ve maddi kaynakların özellikleri; Müellif, kurum ve üretim amacı; Metin, belge ve kayıtların dış tenkidi; Kaynakların iç tenkidi ve güvenilirlik; Kronoloji, mekân ve aktörlerin belirlenmesi; Farklı kaynakların karşılaştırılması; Arşiv ve katalog düzenlerinin kullanımı başlıkları tarihsel bağlam, kaynak eleştirisi ve karşılaştırmalı yorum çerçevesinde ele alınmaktadır.",
    "methods": "Kuramsal anlatım, birincil ve ikincil kaynak incelemesi, belge veya metin çözümlemesi, karşılaştırmalı analiz ve yapılandırılmış akademik tartışma.",
    "resources": "Marc Bloch, Tarih Savunusu; E. H. Carr, Tarih Nedir?; John Tosh, Tarihin Peşinde; konuya ilişkin birincil kaynaklar ve güncel hakemli çalışmalar.",
    "sdgs": [
      "4",
      "11",
      "16"
    ],
    "outcomes": [
      "Kaynak alanının kapsamı ve terminolojisi ile ilgili ileri kavramları analiz eder.",
      "Birincil kaynak türlerinin sınıflandırılması bağlamındaki kaynak ve kanıtları eleştirel değerlendirir.",
      "Kronoloji, mekân ve aktörlerin belirlenmesi ile ilişkili tarihsel örnekleri karşılaştırır.",
      "Tarihsel verinin çözümlenmesi için uygun tarihsel çözümleme yaklaşımını uygular.",
      "Kaynak temelli tarihsel yorum geliştirme temelinde gerekçeli sonuçlar geliştirir."
    ],
    "weeklyTopics": [
      "Kaynak alanının kapsamı ve terminolojisi",
      "Kaynakların oluştuğu tarihsel bağlam",
      "Birincil kaynak türlerinin sınıflandırılması",
      "Yazılı ve maddi kaynakların özellikleri",
      "Müellif, kurum ve üretim amacı",
      "Metin, belge ve kayıtların dış tenkidi",
      "Kaynakların iç tenkidi ve güvenilirlik",
      "Kronoloji, mekân ve aktörlerin belirlenmesi",
      "Farklı kaynakların karşılaştırılması",
      "Arşiv ve katalog düzenlerinin kullanımı",
      "Kaynaklardaki temsil ve sessizlikler",
      "Tarihsel verinin çözümlenmesi",
      "Kanıtların literatürle ilişkilendirilmesi",
      "Etik kullanım ve doğru kaynak gösterme",
      "Kaynak temelli tarihsel yorum geliştirme"
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
    "department": "Tarih ABD",
    "programName": "Tarih",
    "level": "Tezsiz Yüksek Lisans",
    "code": "TTS773",
    "name": "Eski çağ tarihi kaynakları ve metodolojisi",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Atama Bekliyor",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Bu dersin, öğrencilerin tarihsel kaynaklar ve kaynak eleştirisi alanındaki ileri bilgileri kaynak temelli ve eleştirel bir yaklaşımla çözümlemelerine katkı sağlaması amaçlanmaktadır.",
    "content": "Kaynak alanının kapsamı ve terminolojisi; Kaynakların oluştuğu tarihsel bağlam; Birincil kaynak türlerinin sınıflandırılması; Yazılı ve maddi kaynakların özellikleri; Müellif, kurum ve üretim amacı; Metin, belge ve kayıtların dış tenkidi; Kaynakların iç tenkidi ve güvenilirlik; Kronoloji, mekân ve aktörlerin belirlenmesi; Farklı kaynakların karşılaştırılması; Arşiv ve katalog düzenlerinin kullanımı başlıkları tarihsel bağlam, kaynak eleştirisi ve karşılaştırmalı yorum çerçevesinde ele alınmaktadır.",
    "methods": "Kuramsal anlatım, birincil ve ikincil kaynak incelemesi, belge veya metin çözümlemesi, karşılaştırmalı analiz ve yapılandırılmış akademik tartışma.",
    "resources": "Marc Bloch, Tarih Savunusu; E. H. Carr, Tarih Nedir?; John Tosh, Tarihin Peşinde; konuya ilişkin birincil kaynaklar ve güncel hakemli çalışmalar.",
    "sdgs": [
      "4",
      "11",
      "16"
    ],
    "outcomes": [
      "Kaynak alanının kapsamı ve terminolojisi ile ilgili ileri kavramları analiz eder.",
      "Birincil kaynak türlerinin sınıflandırılması bağlamındaki kaynak ve kanıtları eleştirel değerlendirir.",
      "Kronoloji, mekân ve aktörlerin belirlenmesi ile ilişkili tarihsel örnekleri karşılaştırır.",
      "Tarihsel verinin çözümlenmesi için uygun tarihsel çözümleme yaklaşımını uygular.",
      "Kaynak temelli tarihsel yorum geliştirme temelinde gerekçeli sonuçlar geliştirir."
    ],
    "weeklyTopics": [
      "Kaynak alanının kapsamı ve terminolojisi",
      "Kaynakların oluştuğu tarihsel bağlam",
      "Birincil kaynak türlerinin sınıflandırılması",
      "Yazılı ve maddi kaynakların özellikleri",
      "Müellif, kurum ve üretim amacı",
      "Metin, belge ve kayıtların dış tenkidi",
      "Kaynakların iç tenkidi ve güvenilirlik",
      "Kronoloji, mekân ve aktörlerin belirlenmesi",
      "Farklı kaynakların karşılaştırılması",
      "Arşiv ve katalog düzenlerinin kullanımı",
      "Kaynaklardaki temsil ve sessizlikler",
      "Tarihsel verinin çözümlenmesi",
      "Kanıtların literatürle ilişkilendirilmesi",
      "Etik kullanım ve doğru kaynak gösterme",
      "Kaynak temelli tarihsel yorum geliştirme"
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
    "department": "Tarih ABD",
    "programName": "Tarih",
    "level": "Tezsiz Yüksek Lisans",
    "code": "TTS775",
    "name": "Mö ıı.binde anadolu tarihi",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Atama Bekliyor",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Bu dersin, öğrencilerin Eski Çağ ve Anadolu tarihi alanındaki ileri bilgileri kaynak temelli ve eleştirel bir yaklaşımla çözümlemelerine katkı sağlaması amaçlanmaktadır.",
    "content": "Eski Çağ kronolojisi ve coğrafi çerçeve; Arkeolojik ve yazılı kaynak türleri; Anadolu'nun erken siyasal oluşumları; Devlet, yönetim ve toplumsal yapı; Ekonomi, üretim ve değişim ağları; İnanç sistemleri ve ritüeller; Hukuk, diplomasi ve antlaşmalar; Kentleşme ve maddi kültür; Bölgesel güçler arasındaki ilişkiler; Savaş, göç ve nüfus hareketleri başlıkları tarihsel bağlam, kaynak eleştirisi ve karşılaştırmalı yorum çerçevesinde ele alınmaktadır.",
    "methods": "Kuramsal anlatım, birincil ve ikincil kaynak incelemesi, belge veya metin çözümlemesi, karşılaştırmalı analiz ve yapılandırılmış akademik tartışma.",
    "resources": "Marc Bloch, Tarih Savunusu; E. H. Carr, Tarih Nedir?; John Tosh, Tarihin Peşinde; konuya ilişkin birincil kaynaklar ve güncel hakemli çalışmalar.",
    "sdgs": [
      "4",
      "11",
      "16"
    ],
    "outcomes": [
      "Eski Çağ kronolojisi ve coğrafi çerçeve ile ilgili ileri kavramları analiz eder.",
      "Anadolu'nun erken siyasal oluşumları bağlamındaki kaynak ve kanıtları eleştirel değerlendirir.",
      "Kentleşme ve maddi kültür ile ilişkili tarihsel örnekleri karşılaştırır.",
      "Siyasal ve kültürel dönüşümler için uygun tarihsel çözümleme yaklaşımını uygular.",
      "Dönemin süreklilik ve değişim açısından yorumlanması temelinde gerekçeli sonuçlar geliştirir."
    ],
    "weeklyTopics": [
      "Eski Çağ kronolojisi ve coğrafi çerçeve",
      "Arkeolojik ve yazılı kaynak türleri",
      "Anadolu'nun erken siyasal oluşumları",
      "Devlet, yönetim ve toplumsal yapı",
      "Ekonomi, üretim ve değişim ağları",
      "İnanç sistemleri ve ritüeller",
      "Hukuk, diplomasi ve antlaşmalar",
      "Kentleşme ve maddi kültür",
      "Bölgesel güçler arasındaki ilişkiler",
      "Savaş, göç ve nüfus hareketleri",
      "Kaynakların karşılaştırmalı incelenmesi",
      "Siyasal ve kültürel dönüşümler",
      "Anadolu'nun çevre uygarlıklarla ilişkileri",
      "Tarih yazımındaki güncel yaklaşımlar",
      "Dönemin süreklilik ve değişim açısından yorumlanması"
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
          1,
          2,
          1,
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
          5,
          2,
          3,
          2,
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
          4,
          1,
          3,
          1,
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
          4,
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
          5,
          5,
          5,
          5,
          3,
          5,
          1,
          3,
          1,
          3,
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
    "department": "Tarih ABD",
    "programName": "Tarih",
    "level": "Tezsiz Yüksek Lisans",
    "code": "TTS777",
    "name": "Genel türk tarihinin kaynakları",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Atama Bekliyor",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Bu dersin, öğrencilerin tarihsel kaynaklar ve kaynak eleştirisi alanındaki ileri bilgileri kaynak temelli ve eleştirel bir yaklaşımla çözümlemelerine katkı sağlaması amaçlanmaktadır.",
    "content": "Kaynak alanının kapsamı ve terminolojisi; Kaynakların oluştuğu tarihsel bağlam; Birincil kaynak türlerinin sınıflandırılması; Yazılı ve maddi kaynakların özellikleri; Müellif, kurum ve üretim amacı; Metin, belge ve kayıtların dış tenkidi; Kaynakların iç tenkidi ve güvenilirlik; Kronoloji, mekân ve aktörlerin belirlenmesi; Farklı kaynakların karşılaştırılması; Arşiv ve katalog düzenlerinin kullanımı başlıkları tarihsel bağlam, kaynak eleştirisi ve karşılaştırmalı yorum çerçevesinde ele alınmaktadır.",
    "methods": "Kuramsal anlatım, birincil ve ikincil kaynak incelemesi, belge veya metin çözümlemesi, karşılaştırmalı analiz ve yapılandırılmış akademik tartışma.",
    "resources": "Marc Bloch, Tarih Savunusu; E. H. Carr, Tarih Nedir?; John Tosh, Tarihin Peşinde; konuya ilişkin birincil kaynaklar ve güncel hakemli çalışmalar.",
    "sdgs": [
      "4",
      "11",
      "16"
    ],
    "outcomes": [
      "Kaynak alanının kapsamı ve terminolojisi ile ilgili ileri kavramları analiz eder.",
      "Birincil kaynak türlerinin sınıflandırılması bağlamındaki kaynak ve kanıtları eleştirel değerlendirir.",
      "Kronoloji, mekân ve aktörlerin belirlenmesi ile ilişkili tarihsel örnekleri karşılaştırır.",
      "Tarihsel verinin çözümlenmesi için uygun tarihsel çözümleme yaklaşımını uygular.",
      "Kaynak temelli tarihsel yorum geliştirme temelinde gerekçeli sonuçlar geliştirir."
    ],
    "weeklyTopics": [
      "Kaynak alanının kapsamı ve terminolojisi",
      "Kaynakların oluştuğu tarihsel bağlam",
      "Birincil kaynak türlerinin sınıflandırılması",
      "Yazılı ve maddi kaynakların özellikleri",
      "Müellif, kurum ve üretim amacı",
      "Metin, belge ve kayıtların dış tenkidi",
      "Kaynakların iç tenkidi ve güvenilirlik",
      "Kronoloji, mekân ve aktörlerin belirlenmesi",
      "Farklı kaynakların karşılaştırılması",
      "Arşiv ve katalog düzenlerinin kullanımı",
      "Kaynaklardaki temsil ve sessizlikler",
      "Tarihsel verinin çözümlenmesi",
      "Kanıtların literatürle ilişkilendirilmesi",
      "Etik kullanım ve doğru kaynak gösterme",
      "Kaynak temelli tarihsel yorum geliştirme"
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
    "department": "Tarih ABD",
    "programName": "Tarih",
    "level": "Tezsiz Yüksek Lisans",
    "code": "TTS779",
    "name": "Türk-rus ilişkileri tarihi",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Atama Bekliyor",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Bu dersin, öğrencilerin Yakın Çağ, Avrupa ve diplomasi tarihi alanındaki ileri bilgileri kaynak temelli ve eleştirel bir yaklaşımla çözümlemelerine katkı sağlaması amaçlanmaktadır.",
    "content": "Yakın Çağ tarihinin dönemlendirilmesi; Devrimler ve siyasal meşruiyet; Ulus-devletlerin oluşumu; Sanayileşme ve toplumsal dönüşüm; Emperyalizm ve sömürgecilik; Diplomasi sistemi ve güç dengesi; Milliyetçilik ve kimlik hareketleri; Savaşlar ve uluslararası düzen; Toplumsal hareketler ve siyasal katılım; Osmanlı Devleti ile Avrupa ilişkileri başlıkları tarihsel bağlam, kaynak eleştirisi ve karşılaştırmalı yorum çerçevesinde ele alınmaktadır.",
    "methods": "Kuramsal anlatım, birincil ve ikincil kaynak incelemesi, belge veya metin çözümlemesi, karşılaştırmalı analiz ve yapılandırılmış akademik tartışma.",
    "resources": "Erik Jan Zürcher, Modernleşen Türkiye'nin Tarihi; Feroz Ahmad, Modern Türkiye'nin Oluşumu; TBMM arşivi, süreli yayın koleksiyonları ve güncel hakemli çalışmalar.",
    "sdgs": [
      "4",
      "10",
      "16"
    ],
    "outcomes": [
      "Yakın Çağ tarihinin dönemlendirilmesi ile ilgili ileri kavramları analiz eder.",
      "Ulus-devletlerin oluşumu bağlamındaki kaynak ve kanıtları eleştirel değerlendirir.",
      "Savaşlar ve uluslararası düzen ile ilişkili tarihsel örnekleri karşılaştırır.",
      "Karşılaştırmalı ülke ve bölge örnekleri için uygun tarihsel çözümleme yaklaşımını uygular.",
      "Modern dünyanın tarihsel mirasının değerlendirilmesi temelinde gerekçeli sonuçlar geliştirir."
    ],
    "weeklyTopics": [
      "Yakın Çağ tarihinin dönemlendirilmesi",
      "Devrimler ve siyasal meşruiyet",
      "Ulus-devletlerin oluşumu",
      "Sanayileşme ve toplumsal dönüşüm",
      "Emperyalizm ve sömürgecilik",
      "Diplomasi sistemi ve güç dengesi",
      "Milliyetçilik ve kimlik hareketleri",
      "Savaşlar ve uluslararası düzen",
      "Toplumsal hareketler ve siyasal katılım",
      "Osmanlı Devleti ile Avrupa ilişkileri",
      "Birincil diplomatik kaynakların incelenmesi",
      "Karşılaştırmalı ülke ve bölge örnekleri",
      "Yirminci yüzyılın siyasal kırılmaları",
      "Uluslararası örgütlerin gelişimi",
      "Modern dünyanın tarihsel mirasının değerlendirilmesi"
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
          1,
          2,
          1,
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
          5,
          2,
          3,
          2,
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
          4,
          1,
          3,
          1,
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
          4,
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
          5,
          5,
          5,
          5,
          3,
          5,
          1,
          3,
          1,
          3,
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
    "department": "Tarih ABD",
    "programName": "Tarih",
    "level": "Tezsiz Yüksek Lisans",
    "code": "TTS781",
    "name": "Osmanlı devleti'nde yerel yönetim",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Dr. Öğr. Üyesi AHMET CANER ÇATAL",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Osmanlı Devleti'nde Tanzimat Dönemi'nden Türkiye Cumhuriyeti Devleti'ne kadar geçen süre içerisinde mahalli idarelerin (Belediye Teşkilatı) kavratılmasıdır.",
    "content": "Osmanlı Devleti'nde Yerel Yönetim Geleneği, Avrupa'nın Reform İstekleri ve Bab-ı Ali'nin Karşı Önlemleri, Vilayet Yönetiminde İdare Meclisleri, Osmanlı Devleti'nde Modern Belediyeler, Tanzimat'tan sonra Belediyelerin kuruluşu, Altıncı Daire-i Belediye, Osmanlı Taşra Vilayetlerinde Modern Belediyeler ve Kent Hizmetleri.",
    "methods": "Düz Anlatı, Tartışma, Soru-Cevap.",
    "resources": "Kaynaklar: İlber Ortaylı (2011), Tanzimat Devrinde Osmanlı Mahalli İdareleri (1840-1880), Ankara. İlber Ortaylı (2008), Türkiye Teşkilat ve İdare Tarihi, Ankara. Osman Nuri Ergin (1995), Mecelle-i Umur-ı Belediyye, C.1-9, İstanbul.; Ders Notları: İlber Ortaylı (2011), Tanzimat Devrinde Osmanlı Mahalli İdareleri (1840-1880), Ankara. İlber Ortaylı (2008), Türkiye Teşkilat ve İdare Tarihi, Ankara.Osman Nuri Ergin (1995), Mecelle-i Umur-ı Belediyye, C.1-9, İstanbul.",
    "sdgs": [
      "4",
      "10",
      "16"
    ],
    "outcomes": [
      "Osmanlı tarihinin dönemlendirilmesi ve kaynakları ile ilgili ileri kavramları analiz eder.",
      "Saray, bürokrasi ve karar süreçleri bağlamındaki kaynak ve kanıtları eleştirel değerlendirir.",
      "Eğitim, kültür ve düşünce hayatı ile ilişkili tarihsel örnekleri karşılaştırır.",
      "Bölgesel örneklerin karşılaştırılması için uygun tarihsel çözümleme yaklaşımını uygular.",
      "Dönemin çok boyutlu tarihsel değerlendirmesi temelinde gerekçeli sonuçlar geliştirir."
    ],
    "weeklyTopics": [
      "Tanışma, Osmanlı Devleti'nde yerel yönetimlere dair genel bilgi ve kaynakların tanıtımı.",
      "Osmanlı Klasik Dönemi'nde yönetim geleneği ve kurumlar.",
      "Merkeziyetçilik çağında Osmanlı'da yerel yönetimin gelişmesi.",
      "Tanzimat Fermanı ve Meclislerin oluşturulması, Islahat Fermanı ve getirdiği reformlar.",
      "Lübnan Olayları ve Lübnan Nizamnamesi, 1864 ve 1871 Vilayet Nizamnameleri.",
      "Osmanlı Devleti'nde Modern Belediyeler, Tanzimat'tan sonra Belediyelerin Kuruluş nedenleri, geleneksel Osmanlı şehir yönetiminden modern belediyeye geçiş, İhtisap Nazırlığı.",
      "Tanzimat yöneticilerinin modern belediye anlayışı, İstanbul'da Şehremanet'nin kurulması, Şehremaneti'nin organları, Mali durumu ve personeli.",
      "Altıncı Daire-yi Belediye, Beyoğlu Semtinde Modern Belediye, belediye organları ve görevleri,",
      "Altıncı Dairenin kolluk ve yargı işleri, Altıncı Dairenin mali durumu ve faaliyetleri.",
      "Dersaadet belediye kanunu ve belediyelerin görev ve sorumlulukları.",
      "Osmanlı vilayetlerinde modern belediyeler, 1871 Vilayet Nizamnamesine göre Belediye İdareleri, Osmanlı Şehirlerinde ilk örgütlü belediyeler.",
      "1877 Vilayetler belediye kanunu ve getirdiği kamusal yapı, belediye seçimi ve belediye personeli, belediyelerin mali güçsüzlüğü.",
      "Modern Osmanlı Belediyeleri ve Kent Hizmetleri, Belediyelerin imar denetimi ve kentsel altyapı kurma çabaları, Osmanlı belediyelerinin kolluk sorunu, beledi ceza ve fiyat kontrolü.",
      "Osmanlı Belediyeleri ve şehir hizmetleri.",
      "Osmanlı tarihinin dönemlendirilmesi ve kaynakları"
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
          1,
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
          2,
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
          1,
          3,
          3,
          1,
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
          4,
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
          5,
          5,
          5,
          5,
          3,
          5,
          1,
          3,
          3,
          1,
          3
        ]
      }
    ],
    "sourceUrl": "https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=258924&lang=tr",
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
    "department": "Tarih ABD",
    "programName": "Tarih",
    "level": "Tezsiz Yüksek Lisans",
    "code": "TTS783",
    "name": "Fransız ihtilali ve avrupa",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Atama Bekliyor",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Bu dersin, öğrencilerin Yakın Çağ, Avrupa ve diplomasi tarihi alanındaki ileri bilgileri kaynak temelli ve eleştirel bir yaklaşımla çözümlemelerine katkı sağlaması amaçlanmaktadır.",
    "content": "Yakın Çağ tarihinin dönemlendirilmesi; Devrimler ve siyasal meşruiyet; Ulus-devletlerin oluşumu; Sanayileşme ve toplumsal dönüşüm; Emperyalizm ve sömürgecilik; Diplomasi sistemi ve güç dengesi; Milliyetçilik ve kimlik hareketleri; Savaşlar ve uluslararası düzen; Toplumsal hareketler ve siyasal katılım; Osmanlı Devleti ile Avrupa ilişkileri başlıkları tarihsel bağlam, kaynak eleştirisi ve karşılaştırmalı yorum çerçevesinde ele alınmaktadır.",
    "methods": "Kuramsal anlatım, birincil ve ikincil kaynak incelemesi, belge veya metin çözümlemesi, karşılaştırmalı analiz ve yapılandırılmış akademik tartışma.",
    "resources": "Erik Jan Zürcher, Modernleşen Türkiye'nin Tarihi; Feroz Ahmad, Modern Türkiye'nin Oluşumu; TBMM arşivi, süreli yayın koleksiyonları ve güncel hakemli çalışmalar.",
    "sdgs": [
      "4",
      "10",
      "16"
    ],
    "outcomes": [
      "Yakın Çağ tarihinin dönemlendirilmesi ile ilgili ileri kavramları analiz eder.",
      "Ulus-devletlerin oluşumu bağlamındaki kaynak ve kanıtları eleştirel değerlendirir.",
      "Savaşlar ve uluslararası düzen ile ilişkili tarihsel örnekleri karşılaştırır.",
      "Karşılaştırmalı ülke ve bölge örnekleri için uygun tarihsel çözümleme yaklaşımını uygular.",
      "Modern dünyanın tarihsel mirasının değerlendirilmesi temelinde gerekçeli sonuçlar geliştirir."
    ],
    "weeklyTopics": [
      "Yakın Çağ tarihinin dönemlendirilmesi",
      "Devrimler ve siyasal meşruiyet",
      "Ulus-devletlerin oluşumu",
      "Sanayileşme ve toplumsal dönüşüm",
      "Emperyalizm ve sömürgecilik",
      "Diplomasi sistemi ve güç dengesi",
      "Milliyetçilik ve kimlik hareketleri",
      "Savaşlar ve uluslararası düzen",
      "Toplumsal hareketler ve siyasal katılım",
      "Osmanlı Devleti ile Avrupa ilişkileri",
      "Birincil diplomatik kaynakların incelenmesi",
      "Karşılaştırmalı ülke ve bölge örnekleri",
      "Yirminci yüzyılın siyasal kırılmaları",
      "Uluslararası örgütlerin gelişimi",
      "Modern dünyanın tarihsel mirasının değerlendirilmesi"
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
          1,
          2,
          1,
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
          5,
          2,
          3,
          2,
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
          4,
          1,
          3,
          1,
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
          4,
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
          5,
          5,
          5,
          5,
          3,
          5,
          1,
          3,
          1,
          3,
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
    "department": "Tarih ABD",
    "programName": "Tarih",
    "level": "Tezsiz Yüksek Lisans",
    "code": "TTS785",
    "name": "Yakınçağ siyasi tarih metinleri ve tahlili",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Atama Bekliyor",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Bu dersin, öğrencilerin Yakın Çağ, Avrupa ve diplomasi tarihi alanındaki ileri bilgileri kaynak temelli ve eleştirel bir yaklaşımla çözümlemelerine katkı sağlaması amaçlanmaktadır.",
    "content": "Yakın Çağ tarihinin dönemlendirilmesi; Devrimler ve siyasal meşruiyet; Ulus-devletlerin oluşumu; Sanayileşme ve toplumsal dönüşüm; Emperyalizm ve sömürgecilik; Diplomasi sistemi ve güç dengesi; Milliyetçilik ve kimlik hareketleri; Savaşlar ve uluslararası düzen; Toplumsal hareketler ve siyasal katılım; Osmanlı Devleti ile Avrupa ilişkileri başlıkları tarihsel bağlam, kaynak eleştirisi ve karşılaştırmalı yorum çerçevesinde ele alınmaktadır.",
    "methods": "Kuramsal anlatım, birincil ve ikincil kaynak incelemesi, belge veya metin çözümlemesi, karşılaştırmalı analiz ve yapılandırılmış akademik tartışma.",
    "resources": "Erik Jan Zürcher, Modernleşen Türkiye'nin Tarihi; Feroz Ahmad, Modern Türkiye'nin Oluşumu; TBMM arşivi, süreli yayın koleksiyonları ve güncel hakemli çalışmalar.",
    "sdgs": [
      "4",
      "10",
      "16"
    ],
    "outcomes": [
      "Yakın Çağ tarihinin dönemlendirilmesi ile ilgili ileri kavramları analiz eder.",
      "Ulus-devletlerin oluşumu bağlamındaki kaynak ve kanıtları eleştirel değerlendirir.",
      "Savaşlar ve uluslararası düzen ile ilişkili tarihsel örnekleri karşılaştırır.",
      "Karşılaştırmalı ülke ve bölge örnekleri için uygun tarihsel çözümleme yaklaşımını uygular.",
      "Modern dünyanın tarihsel mirasının değerlendirilmesi temelinde gerekçeli sonuçlar geliştirir."
    ],
    "weeklyTopics": [
      "Yakın Çağ tarihinin dönemlendirilmesi",
      "Devrimler ve siyasal meşruiyet",
      "Ulus-devletlerin oluşumu",
      "Sanayileşme ve toplumsal dönüşüm",
      "Emperyalizm ve sömürgecilik",
      "Diplomasi sistemi ve güç dengesi",
      "Milliyetçilik ve kimlik hareketleri",
      "Savaşlar ve uluslararası düzen",
      "Toplumsal hareketler ve siyasal katılım",
      "Osmanlı Devleti ile Avrupa ilişkileri",
      "Birincil diplomatik kaynakların incelenmesi",
      "Karşılaştırmalı ülke ve bölge örnekleri",
      "Yirminci yüzyılın siyasal kırılmaları",
      "Uluslararası örgütlerin gelişimi",
      "Modern dünyanın tarihsel mirasının değerlendirilmesi"
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
          1,
          2,
          1,
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
          5,
          2,
          3,
          2,
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
          4,
          1,
          3,
          1,
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
          4,
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
          5,
          5,
          5,
          5,
          3,
          5,
          1,
          3,
          1,
          3,
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
    "department": "Tarih ABD",
    "programName": "Tarih",
    "level": "Tezsiz Yüksek Lisans",
    "code": "TTS787",
    "name": "Osmanlı dönemi akdeniz tarihi",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Atama Bekliyor",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Bu dersin, öğrencilerin Osmanlı tarihi alanındaki ileri bilgileri kaynak temelli ve eleştirel bir yaklaşımla çözümlemelerine katkı sağlaması amaçlanmaktadır.",
    "content": "Osmanlı tarihinin dönemlendirilmesi ve kaynakları; Merkez ve taşra teşkilatının yapısı; Saray, bürokrasi ve karar süreçleri; Toplumsal gruplar ve gündelik hayat; Hukuk, millet düzeni ve dinî kurumlar; Toprak, üretim ve mali yapı; Şehirler, ulaşım ve haberleşme ağları; Eğitim, kültür ve düşünce hayatı; Diplomasi ve dış ilişkiler; Reform, değişim ve süreklilik başlıkları tarihsel bağlam, kaynak eleştirisi ve karşılaştırmalı yorum çerçevesinde ele alınmaktadır.",
    "methods": "Kuramsal anlatım, birincil ve ikincil kaynak incelemesi, belge veya metin çözümlemesi, karşılaştırmalı analiz ve yapılandırılmış akademik tartışma.",
    "resources": "Halil İnalcık, Osmanlı İmparatorluğu Klasik Çağ; Suraiya Faroqhi, Osmanlı Kültürü ve Gündelik Yaşam; Cumhurbaşkanlığı Devlet Arşivleri Başkanlığı katalog ve belge seçkileri.",
    "sdgs": [
      "4",
      "10",
      "16"
    ],
    "outcomes": [
      "Osmanlı tarihinin dönemlendirilmesi ve kaynakları ile ilgili ileri kavramları analiz eder.",
      "Saray, bürokrasi ve karar süreçleri bağlamındaki kaynak ve kanıtları eleştirel değerlendirir.",
      "Eğitim, kültür ve düşünce hayatı ile ilişkili tarihsel örnekleri karşılaştırır.",
      "Bölgesel örneklerin karşılaştırılması için uygun tarihsel çözümleme yaklaşımını uygular.",
      "Dönemin çok boyutlu tarihsel değerlendirmesi temelinde gerekçeli sonuçlar geliştirir."
    ],
    "weeklyTopics": [
      "Osmanlı tarihinin dönemlendirilmesi ve kaynakları",
      "Merkez ve taşra teşkilatının yapısı",
      "Saray, bürokrasi ve karar süreçleri",
      "Toplumsal gruplar ve gündelik hayat",
      "Hukuk, millet düzeni ve dinî kurumlar",
      "Toprak, üretim ve mali yapı",
      "Şehirler, ulaşım ve haberleşme ağları",
      "Eğitim, kültür ve düşünce hayatı",
      "Diplomasi ve dış ilişkiler",
      "Reform, değişim ve süreklilik",
      "Arşiv belgeleri ve kroniklerin eleştirisi",
      "Bölgesel örneklerin karşılaştırılması",
      "Toplumsal ve ekonomik dönüşümlerin analizi",
      "Osmanlı tarih yazımındaki tartışmalar",
      "Dönemin çok boyutlu tarihsel değerlendirmesi"
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
          1,
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
          2,
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
          1,
          3,
          3,
          1,
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
          4,
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
          5,
          5,
          5,
          5,
          3,
          5,
          1,
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
    "department": "Tarih ABD",
    "programName": "Tarih",
    "level": "Tezsiz Yüksek Lisans",
    "code": "TTS789",
    "name": "Osmanlı dönemi şehircilik tarihi",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Atama Bekliyor",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Bu dersin, öğrencilerin sosyal, ekonomik ve kültürel tarih alanındaki ileri bilgileri kaynak temelli ve eleştirel bir yaklaşımla çözümlemelerine katkı sağlaması amaçlanmaktadır.",
    "content": "Sosyal ve kültürel tarihin kavramsal çerçevesi; Gündelik hayatı inceleyen kaynak türleri; Toplumsal tabakalar ve kimlikler; Aile, kadın ve toplumsal cinsiyet; Eğitim, yardım ve dayanışma kurumları; Üretim, tüketim ve ekonomik ilişkiler; Para, fiyat ve yaşam standartları; Kent, mekân ve yerel toplum; Basın, kültür ve kamusal alan; Dinî hayat, tasavvuf ve topluluklar başlıkları tarihsel bağlam, kaynak eleştirisi ve karşılaştırmalı yorum çerçevesinde ele alınmaktadır.",
    "methods": "Kuramsal anlatım, birincil ve ikincil kaynak incelemesi, belge veya metin çözümlemesi, karşılaştırmalı analiz ve yapılandırılmış akademik tartışma.",
    "resources": "Halil İnalcık, Osmanlı İmparatorluğu Klasik Çağ; Suraiya Faroqhi, Osmanlı Kültürü ve Gündelik Yaşam; Cumhurbaşkanlığı Devlet Arşivleri Başkanlığı katalog ve belge seçkileri.",
    "sdgs": [
      "4",
      "10",
      "11"
    ],
    "outcomes": [
      "Sosyal ve kültürel tarihin kavramsal çerçevesi ile ilgili ileri kavramları analiz eder.",
      "Toplumsal tabakalar ve kimlikler bağlamındaki kaynak ve kanıtları eleştirel değerlendirir.",
      "Kent, mekân ve yerel toplum ile ilişkili tarihsel örnekleri karşılaştırır.",
      "Belge ve anlatıların karşılaştırılması için uygun tarihsel çözümleme yaklaşımını uygular.",
      "Sosyal tarih bulgularının bütüncül yorumlanması temelinde gerekçeli sonuçlar geliştirir."
    ],
    "weeklyTopics": [
      "Sosyal ve kültürel tarihin kavramsal çerçevesi",
      "Gündelik hayatı inceleyen kaynak türleri",
      "Toplumsal tabakalar ve kimlikler",
      "Aile, kadın ve toplumsal cinsiyet",
      "Eğitim, yardım ve dayanışma kurumları",
      "Üretim, tüketim ve ekonomik ilişkiler",
      "Para, fiyat ve yaşam standartları",
      "Kent, mekân ve yerel toplum",
      "Basın, kültür ve kamusal alan",
      "Dinî hayat, tasavvuf ve topluluklar",
      "Nüfus, göç ve toplumsal hareketlilik",
      "Belge ve anlatıların karşılaştırılması",
      "Toplumsal değişim ve süreklilik",
      "Yerel örneklerin geniş bağlamla ilişkilendirilmesi",
      "Sosyal tarih bulgularının bütüncül yorumlanması"
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
          1,
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
          2,
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
          1,
          1,
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
          4,
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
          5,
          5,
          5,
          5,
          3,
          5,
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
    "department": "Tarih ABD",
    "programName": "Tarih",
    "level": "Tezsiz Yüksek Lisans",
    "code": "TTS791",
    "name": "Tanzimat sonrası osmanlı taşra idaresi",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Atama Bekliyor",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Bu dersin, öğrencilerin Osmanlı tarihi alanındaki ileri bilgileri kaynak temelli ve eleştirel bir yaklaşımla çözümlemelerine katkı sağlaması amaçlanmaktadır.",
    "content": "Osmanlı tarihinin dönemlendirilmesi ve kaynakları; Merkez ve taşra teşkilatının yapısı; Saray, bürokrasi ve karar süreçleri; Toplumsal gruplar ve gündelik hayat; Hukuk, millet düzeni ve dinî kurumlar; Toprak, üretim ve mali yapı; Şehirler, ulaşım ve haberleşme ağları; Eğitim, kültür ve düşünce hayatı; Diplomasi ve dış ilişkiler; Reform, değişim ve süreklilik başlıkları tarihsel bağlam, kaynak eleştirisi ve karşılaştırmalı yorum çerçevesinde ele alınmaktadır.",
    "methods": "Kuramsal anlatım, birincil ve ikincil kaynak incelemesi, belge veya metin çözümlemesi, karşılaştırmalı analiz ve yapılandırılmış akademik tartışma.",
    "resources": "Halil İnalcık, Osmanlı İmparatorluğu Klasik Çağ; Suraiya Faroqhi, Osmanlı Kültürü ve Gündelik Yaşam; Cumhurbaşkanlığı Devlet Arşivleri Başkanlığı katalog ve belge seçkileri.",
    "sdgs": [
      "4",
      "10",
      "16"
    ],
    "outcomes": [
      "Osmanlı tarihinin dönemlendirilmesi ve kaynakları ile ilgili ileri kavramları analiz eder.",
      "Saray, bürokrasi ve karar süreçleri bağlamındaki kaynak ve kanıtları eleştirel değerlendirir.",
      "Eğitim, kültür ve düşünce hayatı ile ilişkili tarihsel örnekleri karşılaştırır.",
      "Bölgesel örneklerin karşılaştırılması için uygun tarihsel çözümleme yaklaşımını uygular.",
      "Dönemin çok boyutlu tarihsel değerlendirmesi temelinde gerekçeli sonuçlar geliştirir."
    ],
    "weeklyTopics": [
      "Osmanlı tarihinin dönemlendirilmesi ve kaynakları",
      "Merkez ve taşra teşkilatının yapısı",
      "Saray, bürokrasi ve karar süreçleri",
      "Toplumsal gruplar ve gündelik hayat",
      "Hukuk, millet düzeni ve dinî kurumlar",
      "Toprak, üretim ve mali yapı",
      "Şehirler, ulaşım ve haberleşme ağları",
      "Eğitim, kültür ve düşünce hayatı",
      "Diplomasi ve dış ilişkiler",
      "Reform, değişim ve süreklilik",
      "Arşiv belgeleri ve kroniklerin eleştirisi",
      "Bölgesel örneklerin karşılaştırılması",
      "Toplumsal ve ekonomik dönüşümlerin analizi",
      "Osmanlı tarih yazımındaki tartışmalar",
      "Dönemin çok boyutlu tarihsel değerlendirmesi"
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
          1,
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
          2,
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
          1,
          3,
          3,
          1,
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
          4,
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
          5,
          5,
          5,
          5,
          3,
          5,
          1,
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
    "department": "Tarih ABD",
    "programName": "Tarih",
    "level": "Tezsiz Yüksek Lisans",
    "code": "TTS793",
    "name": "Uluslararası örgütler ve türkiye",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Atama Bekliyor",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Bu dersin, öğrencilerin Yakın Çağ, Avrupa ve diplomasi tarihi alanındaki ileri bilgileri kaynak temelli ve eleştirel bir yaklaşımla çözümlemelerine katkı sağlaması amaçlanmaktadır.",
    "content": "Yakın Çağ tarihinin dönemlendirilmesi; Devrimler ve siyasal meşruiyet; Ulus-devletlerin oluşumu; Sanayileşme ve toplumsal dönüşüm; Emperyalizm ve sömürgecilik; Diplomasi sistemi ve güç dengesi; Milliyetçilik ve kimlik hareketleri; Savaşlar ve uluslararası düzen; Toplumsal hareketler ve siyasal katılım; Osmanlı Devleti ile Avrupa ilişkileri başlıkları tarihsel bağlam, kaynak eleştirisi ve karşılaştırmalı yorum çerçevesinde ele alınmaktadır.",
    "methods": "Kuramsal anlatım, birincil ve ikincil kaynak incelemesi, belge veya metin çözümlemesi, karşılaştırmalı analiz ve yapılandırılmış akademik tartışma.",
    "resources": "Erik Jan Zürcher, Modernleşen Türkiye'nin Tarihi; Feroz Ahmad, Modern Türkiye'nin Oluşumu; TBMM arşivi, süreli yayın koleksiyonları ve güncel hakemli çalışmalar.",
    "sdgs": [
      "4",
      "10",
      "16"
    ],
    "outcomes": [
      "Yakın Çağ tarihinin dönemlendirilmesi ile ilgili ileri kavramları analiz eder.",
      "Ulus-devletlerin oluşumu bağlamındaki kaynak ve kanıtları eleştirel değerlendirir.",
      "Savaşlar ve uluslararası düzen ile ilişkili tarihsel örnekleri karşılaştırır.",
      "Karşılaştırmalı ülke ve bölge örnekleri için uygun tarihsel çözümleme yaklaşımını uygular.",
      "Modern dünyanın tarihsel mirasının değerlendirilmesi temelinde gerekçeli sonuçlar geliştirir."
    ],
    "weeklyTopics": [
      "Yakın Çağ tarihinin dönemlendirilmesi",
      "Devrimler ve siyasal meşruiyet",
      "Ulus-devletlerin oluşumu",
      "Sanayileşme ve toplumsal dönüşüm",
      "Emperyalizm ve sömürgecilik",
      "Diplomasi sistemi ve güç dengesi",
      "Milliyetçilik ve kimlik hareketleri",
      "Savaşlar ve uluslararası düzen",
      "Toplumsal hareketler ve siyasal katılım",
      "Osmanlı Devleti ile Avrupa ilişkileri",
      "Birincil diplomatik kaynakların incelenmesi",
      "Karşılaştırmalı ülke ve bölge örnekleri",
      "Yirminci yüzyılın siyasal kırılmaları",
      "Uluslararası örgütlerin gelişimi",
      "Modern dünyanın tarihsel mirasının değerlendirilmesi"
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
          1,
          2,
          1,
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
          5,
          2,
          3,
          2,
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
          4,
          1,
          3,
          1,
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
          4,
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
          5,
          5,
          5,
          5,
          3,
          5,
          1,
          3,
          1,
          3,
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
    "department": "Tarih ABD",
    "programName": "Tarih",
    "level": "Tezsiz Yüksek Lisans",
    "code": "TTS795",
    "name": "Osmaniye tarihi ı",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Atama Bekliyor",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Bu dersin, öğrencilerin Osmanlı tarihi alanındaki ileri bilgileri kaynak temelli ve eleştirel bir yaklaşımla çözümlemelerine katkı sağlaması amaçlanmaktadır.",
    "content": "Osmanlı tarihinin dönemlendirilmesi ve kaynakları; Merkez ve taşra teşkilatının yapısı; Saray, bürokrasi ve karar süreçleri; Toplumsal gruplar ve gündelik hayat; Hukuk, millet düzeni ve dinî kurumlar; Toprak, üretim ve mali yapı; Şehirler, ulaşım ve haberleşme ağları; Eğitim, kültür ve düşünce hayatı; Diplomasi ve dış ilişkiler; Reform, değişim ve süreklilik başlıkları tarihsel bağlam, kaynak eleştirisi ve karşılaştırmalı yorum çerçevesinde ele alınmaktadır.",
    "methods": "Kuramsal anlatım, birincil ve ikincil kaynak incelemesi, belge veya metin çözümlemesi, karşılaştırmalı analiz ve yapılandırılmış akademik tartışma.",
    "resources": "Halil İnalcık, Osmanlı İmparatorluğu Klasik Çağ; Suraiya Faroqhi, Osmanlı Kültürü ve Gündelik Yaşam; Cumhurbaşkanlığı Devlet Arşivleri Başkanlığı katalog ve belge seçkileri.",
    "sdgs": [
      "4",
      "10",
      "16"
    ],
    "outcomes": [
      "Osmanlı tarihinin dönemlendirilmesi ve kaynakları ile ilgili ileri kavramları analiz eder.",
      "Saray, bürokrasi ve karar süreçleri bağlamındaki kaynak ve kanıtları eleştirel değerlendirir.",
      "Eğitim, kültür ve düşünce hayatı ile ilişkili tarihsel örnekleri karşılaştırır.",
      "Bölgesel örneklerin karşılaştırılması için uygun tarihsel çözümleme yaklaşımını uygular.",
      "Dönemin çok boyutlu tarihsel değerlendirmesi temelinde gerekçeli sonuçlar geliştirir."
    ],
    "weeklyTopics": [
      "Osmanlı tarihinin dönemlendirilmesi ve kaynakları",
      "Merkez ve taşra teşkilatının yapısı",
      "Saray, bürokrasi ve karar süreçleri",
      "Toplumsal gruplar ve gündelik hayat",
      "Hukuk, millet düzeni ve dinî kurumlar",
      "Toprak, üretim ve mali yapı",
      "Şehirler, ulaşım ve haberleşme ağları",
      "Eğitim, kültür ve düşünce hayatı",
      "Diplomasi ve dış ilişkiler",
      "Reform, değişim ve süreklilik",
      "Arşiv belgeleri ve kroniklerin eleştirisi",
      "Bölgesel örneklerin karşılaştırılması",
      "Toplumsal ve ekonomik dönüşümlerin analizi",
      "Osmanlı tarih yazımındaki tartışmalar",
      "Dönemin çok boyutlu tarihsel değerlendirmesi"
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
          1,
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
          2,
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
          1,
          3,
          3,
          1,
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
          4,
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
          5,
          5,
          5,
          5,
          3,
          5,
          1,
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
    "department": "Tarih ABD",
    "programName": "Tarih",
    "level": "Tezsiz Yüksek Lisans",
    "code": "TTS797",
    "name": "Tarihsel süreçten günümüze ermeni meselesi",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Prof. Dr. EBRU GÜHER",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Tarihsel Süreçten Günümüze Ermeni Meselesi” dersi, Osmanlı’dan günümüze uzanan Ermeni meselesinin tarihsel arka planını, diplomatik gelişmelerini ve uluslararası politikadaki yansımalarını nesnel ve çok yönlü bir bakışla ele almayı amaçlar. Bu ders, öğrencilerin konuyu tarihsel belgeler, siyasi dinamikler ve farklı bakış açıları üzerinden değerlendirerek güncel tartışmaların temellerini daha sağlıklı bir şekilde anlamalarını sağlar.",
    "content": "Bu ders, Osmanlı İmparatorluğu dönemindeki Ermeni toplumunun siyasi, sosyal ve kültürel yapısından başlayarak 19. yüzyıldaki uluslararası gelişmeler, misyoner faaliyetleri ve büyük güçlerin politikaları ışığında Ermeni meselesinin ortaya çıkışını inceler; Birinci Dünya Savaşı sürecindeki olayları, Cumhuriyet dönemindeki yaklaşımları ve günümüzde uluslararası arenadaki yansımaları kapsamlı bir biçimde ele alır. Öğrenciler, tarihsel belgeler ve akademik kaynaklar üzerinden konuyu çok yönlü olarak değerlendirme imkânı bulur.",
    "methods": "Bu derste, öğrencilerin Ermeni meselesini tarihsel belgeler, akademik metinler ve farklı yorumlar üzerinden inceleyebilmesi için anlatım, tartışma, soru-cevap, belge analizi, grup çalışmaları ve örnek olay çözümlemeleri gibi yöntemler uygulanır. Bu teknikler, konunun çok boyutlu yapısını daha iyi kavramalarına ve eleştirel bir değerlendirme becerisi geliştirmelerine katkı sağlar.",
    "resources": "Kaynaklar: Lewy, Guenter. 1915: Osmanlı Ermenilerine Ne Oldu? Ankara: Liberte Yayınları, 2009.Shaw, Stanford J. Osmanlı İmparatorluğu ve Modern Türkiye Cilt II. İstanbul: E Yayınları, 2014.Öke, Mim Kemal. Ermeni Sorunu 1914–1923. İstanbul: İz Yayıncılık, 2012.Halaçoğlu, Yusuf. Ermeni Tehciri ve Gerçekler. Ankara: Türk Tarih Kurumu Yayınları, 2019.Ortaylı, İlber. Osmanlı İmparatorluğu’nda Millet Sistemi. İstanbul: Kronik Kitap, 2020.Erickson, Edward J. Ottomans and Armenians: A Study in Counterinsurgency. New York: Palgrave Macmillan, 2013.Kurat, Akdes Nimet. Birinci Dünya Savaşı ve Türkiye. Ankara: BilgeSu Yayıncılık, 2017.Dündar, Fuat. Modern Türkiye’nin Şifresi: İttihat ve Terakki’nin Etnisite Mühendisliği. İstanbul: İletişim Yayınları, 2021.Gürün, Kamuran. Ermeni Dosyası. Ankara: Remzi Kitabevi, 2015.Suny, Ronald Grigor. They Can Live in the Desert but Nowhere Else. Princeton: Princeton University Press, 2015.; Ders Notları: Sonyel, Salahi R. Osmanlı Ermenileri: İsyan, Göç ve Tehcir. Ankara: Türk Tarih Kurumu Yayınları, 2018.McCarthy, Justin. Ölüm ve Sürgün: Osmanlı Müslümanlarının Etnik Kıyımı. İstanbul: İnkılap Kitabevi, 2020.Kasım, Kamer. Ermeni Sorunu’nun Uluslararası Boyutu. Ankara: USAK Yayınları, 2015.",
    "sdgs": [
      "4",
      "10",
      "11"
    ],
    "outcomes": [
      "Sosyal ve kültürel tarihin kavramsal çerçevesi ile ilgili ileri kavramları analiz eder.",
      "Toplumsal tabakalar ve kimlikler bağlamındaki kaynak ve kanıtları eleştirel değerlendirir.",
      "Kent, mekân ve yerel toplum ile ilişkili tarihsel örnekleri karşılaştırır.",
      "Belge ve anlatıların karşılaştırılması için uygun tarihsel çözümleme yaklaşımını uygular.",
      "Sosyal tarih bulgularının bütüncül yorumlanması temelinde gerekçeli sonuçlar geliştirir."
    ],
    "weeklyTopics": [
      "Dersin tanıtımı, amaç ve kapsamın açıklanması",
      "Osmanlı’da Ermeni toplumunun sosyal, kültürel ve siyasi yapısı",
      "19. yüzyılda Osmanlı’daki reformlar ve Ermeni toplumuna etkileri",
      "Misyoner faaliyetleri ve büyük güçlerin bölgedeki politikaları",
      "Ermeni meselesinin ortaya çıkışı ve ilk siyasi hareketlenmeler",
      "1890’lar olayları ve uluslararası kamuoyunun rolü",
      "I. Dünya Savaşı öncesi gelişmeler",
      "I. Dünya Savaşı sürecinde yaşananlar ve tehcir uygulaması",
      "Savaş sonrası dönem ve Paris Barış Konferansı tartışmaları",
      "Cumhuriyet’in ilk yıllarında Ermeni meselesine yaklaşım",
      "Soğuk Savaş dönemi ve diasporanın politik etkisi",
      "Günümüzde Ermeni meselesi ve uluslararası platformlardaki tartışmalar",
      "Farklı tarihsel yaklaşımların değerlendirilmesi",
      "Genel değerlendirme, tartışmalar ve sonuçlandırma",
      "Sosyal ve kültürel tarihin kavramsal çerçevesi"
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
          1,
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
          2,
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
          1,
          1,
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
          4,
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
          5,
          5,
          5,
          5,
          3,
          5,
          3,
          3,
          1,
          1,
          3
        ]
      }
    ],
    "sourceUrl": "https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=258931&lang=tr",
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
    "department": "Tarih ABD",
    "programName": "Tarih",
    "level": "Tezsiz Yüksek Lisans",
    "code": "TTS799",
    "name": "Milli mücadele'nin sosyo-ekonomik yapısı",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Atama Bekliyor",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Bu dersin, öğrencilerin Türkiye Cumhuriyeti ve Millî Mücadele tarihi alanındaki ileri bilgileri kaynak temelli ve eleştirel bir yaklaşımla çözümlemelerine katkı sağlaması amaçlanmaktadır.",
    "content": "Geç Osmanlı mirası ve dönüşüm dinamikleri; Millî Mücadele'nin siyasal ve toplumsal koşulları; Kongreler, örgütlenme ve temsil; TBMM'nin kuruluşu ve yeni siyasal düzen; Cumhuriyet'in ilanı ve kurumsal dönüşüm; Hukuki, toplumsal ve kültürel reformlar; Ekonomi politikaları ve toplumsal yapı; Tek parti döneminin siyasal dinamikleri; Çok partili hayata geçiş; İç ve dış politika etkileşimi başlıkları tarihsel bağlam, kaynak eleştirisi ve karşılaştırmalı yorum çerçevesinde ele alınmaktadır.",
    "methods": "Kuramsal anlatım, birincil ve ikincil kaynak incelemesi, belge veya metin çözümlemesi, karşılaştırmalı analiz ve yapılandırılmış akademik tartışma.",
    "resources": "Erik Jan Zürcher, Modernleşen Türkiye'nin Tarihi; Feroz Ahmad, Modern Türkiye'nin Oluşumu; TBMM arşivi, süreli yayın koleksiyonları ve güncel hakemli çalışmalar.",
    "sdgs": [
      "4",
      "10",
      "16"
    ],
    "outcomes": [
      "Geç Osmanlı mirası ve dönüşüm dinamikleri ile ilgili ileri kavramları analiz eder.",
      "Kongreler, örgütlenme ve temsil bağlamındaki kaynak ve kanıtları eleştirel değerlendirir.",
      "Tek parti döneminin siyasal dinamikleri ile ilişkili tarihsel örnekleri karşılaştırır.",
      "Belge, hatırat ve süreli yayınların eleştirisi için uygun tarihsel çözümleme yaklaşımını uygular.",
      "Cumhuriyet tarihinin süreklilik ve değişim açısından analizi temelinde gerekçeli sonuçlar geliştirir."
    ],
    "weeklyTopics": [
      "Geç Osmanlı mirası ve dönüşüm dinamikleri",
      "Millî Mücadele'nin siyasal ve toplumsal koşulları",
      "Kongreler, örgütlenme ve temsil",
      "TBMM'nin kuruluşu ve yeni siyasal düzen",
      "Cumhuriyet'in ilanı ve kurumsal dönüşüm",
      "Hukuki, toplumsal ve kültürel reformlar",
      "Ekonomi politikaları ve toplumsal yapı",
      "Tek parti döneminin siyasal dinamikleri",
      "Çok partili hayata geçiş",
      "İç ve dış politika etkileşimi",
      "Basın, kamuoyu ve siyasal iletişim",
      "Belge, hatırat ve süreli yayınların eleştirisi",
      "Toplumsal hareketler ve krizler",
      "Literatürdeki farklı tarihsel yorumlar",
      "Cumhuriyet tarihinin süreklilik ve değişim açısından analizi"
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
          1,
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
          2,
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
          1,
          3,
          3,
          1,
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
          4,
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
          5,
          5,
          5,
          5,
          3,
          5,
          1,
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
    "department": "Tarih ABD",
    "programName": "Tarih",
    "level": "Tezsiz Yüksek Lisans",
    "code": "TRH704",
    "name": "Bilimsel araştırma yöntemleri ve yayın etiği",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Doç. Dr. MURAT ALANDAĞLI",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Öğrencilerin bilimsel araştırma, etik kavramı ve etik teorileri, araştırma ve yayın etiği kavramlarını, araştırma ve yayın sürecinde etik dışı davranışlar ve etik ihlalleri hakkında bilgi sahibi olmalarını sağlamak .",
    "content": "Öğrencilerin bilim, bilimin doğası, gelişimi ve bilimsel araştırma; etik kavramı ve etik teorileri; araştırma ve yayın etiği; araştırma sürecinde etik dışı davranışlar ve etik ihlalleri; yazarlık ve telifle ilgili etik sorunlar; taraflı yayın, editörlük, hakemlik ve etik; yayın etiği ve yayın sürecinde etik dışı davranışlar; araştırma ve yayın etiğiyle ilgili yasal mevzuat ve kurullar; etik ihlallerinde karşılaşılacak durumlar hakkında bilgiler",
    "methods": "Sözel anlatım ve karşılaştırmalı izah",
    "resources": "Kaynaklar: Cemaloğlu, N. (2020). Bilimsel Araştırma Teknikleri ve Etik, Pegem Akademi, Ankara. Doğan, M. Araştırma Teknikleri ve Bilimsel İletişimin Temelleri Ders Notları, Afyon Kocatepe Üniversitesi Fen-Edebiyat Fakültesi Fizik Bölümü, AfyonRuacan, Ş. (2005). Bilimsel araştırma ve yayınlarda etik ilkeler. Gazi Tıp Dergisi, 16(4), 147-149.Toplu, M. (2012). Bilim etiği: İnternetin bilim etiği üzerine etkileri. Türk Kütüphaneciliği, 26(4), 654-698.Türkiye Bilimler Akademisi (2002). Bilimsel araştırmada etik ve sorunları. Türkiye Bilimler Akademisi Yayınları: Ankara; Ders Notları: CEMALOĞLU, N. (2020). Bilimsel Araştırma Teknikleri ve Etik, Pegem Akademi, Ankara K2- DOĞAN, M. Araştırma Teknikleri ve Bilimsel İletişimin Temelleri Ders Notları, Afyon Kocatepe Üniversitesi Fen-Edebiyat Fakültesi Fizik Bölümü, AfyonRuacan, Ş. (2005). Bilimsel araştırma ve yayınlarda etik ilkeler. Gazi Tıp Dergisi, 16(4), 147-149.Toplu, M. (2012). Bilim etiği: İnternetin bilim etiği üzerine etkileri. Türk Kütüphaneciliği, 26(4), 654-698.; Dökümanlar: Cemaloğlu, N. (2020). Bilimsel Araştırma Teknikleri ve Etik, Pegem Akademi, Ankara K2- DOĞAN, M. Araştırma Teknikleri ve Bilimsel İletişimin Temelleri Ders Notları, Afyon Kocatepe Üniversitesi Fen-Edebiyat Fakültesi Fizik Bölümü, Afyon • Ruacan, Ş. (2005). Bilimsel araştırma ve yayınlarda etik ilkeler. Gazi Tıp Dergisi, 16(4), 147-149. • Toplu, M. (2012). Bilim etiği: İnternetin bilim etiği üzerine etkileri. Türk Kütüphaneciliği, 26(4), 654-698.",
    "sdgs": [
      "4",
      "16",
      "17"
    ],
    "outcomes": [
      "Bilimsel bilgi ve tarih araştırmasının niteliği ile ilgili ileri kavramları analiz eder.",
      "Literatür tarama stratejileri bağlamındaki kaynak ve kanıtları eleştirel değerlendirir.",
      "Tarihsel verilerin sınıflandırılması ile ilişkili tarihsel örnekleri karşılaştırır.",
      "Araştırma etiği ve yayın bütünlüğü için uygun tarihsel çözümleme yaklaşımını uygular.",
      "Yöntemsel kararların bütüncül değerlendirilmesi temelinde gerekçeli sonuçlar geliştirir."
    ],
    "weeklyTopics": [
      "Deresin amaç, kapsam ve eğitim ile bilim dünyasındaki yerinin tespitine dair izahlar",
      "Bilim, Bilimin Doğası ve Bilimsel Araştırma konularının açıklanması",
      "Etik Konusuna Giriş ve Bilimsel Etik hakkında bilgilerin verilmesi",
      "Bilimsel Araştırmalarda Etik kavramı, nedir, nasıl okunmalıdır, ele alınmalıdır?",
      "Kullanılacak kaynakların etik değerleri ve bunlar ile ile İlgili Etik Kurallar",
      "Akademik çalışmalarda İntihal konusu",
      "Bilimsel İhmal kavramı ve dikkat edilecek olan hususlar.",
      "Kaynak Taraması ve Kaynak Gösterme hususlarında dikkat edilecek olan hususlar",
      "Akademik anlamda çalışmanın yazarı olmak ve Yayın Etiği noktasındaki duruşu",
      "Akademik çalışmalarda internetin Bilim Etiği Üzerine Etkileri hakkında dikkat edilecek olan hususlar",
      "Akademik çalışmalarda Etik Dışı Davranışların Nedenleri ve Çözüm Önerileri hakkındaki hususlar",
      "Tarihçilik alanında yapılacak olan yayın ve etik ihlallerinin önlenmesine dair yaklaşımlar",
      "Tarihçilik alanında yapılacak olan yayın ve etik ihlallerinin önlenmesine dair yaklaşımlar ve bazı örnekler",
      "Bilimsel bilgi ve tarih araştırmasının niteliği",
      "Araştırma problemi ile tarihsel soru geliştirme"
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
          1,
          2,
          4,
          4,
          1,
          2,
          4,
          4,
          2
        ]
      },
      {
        "outcome": "DÖÇ2",
        "values": [
          3,
          5,
          2,
          3,
          5,
          5,
          2,
          3,
          5,
          5,
          3
        ]
      },
      {
        "outcome": "DÖÇ3",
        "values": [
          3,
          4,
          1,
          3,
          4,
          4,
          1,
          3,
          4,
          4,
          3
        ]
      },
      {
        "outcome": "DÖÇ4",
        "values": [
          2,
          4,
          2,
          2,
          4,
          4,
          2,
          2,
          4,
          4,
          2
        ]
      },
      {
        "outcome": "DÖÇ5",
        "values": [
          3,
          5,
          1,
          3,
          5,
          5,
          1,
          3,
          5,
          5,
          3
        ]
      }
    ],
    "sourceUrl": "https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=271734&lang=tr",
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
    "department": "Tarih ABD",
    "programName": "Tarih",
    "level": "Tezsiz Yüksek Lisans",
    "code": "TRHTZ522",
    "name": "Türkiye selçukluları tarihi",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Doç. Dr. AYŞE ATICI ARAYANCAN",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Türkiye tarihinde Selçuklu dönemini ele almak",
    "content": "Türkiye Selçuklu Devletinin kuruluşu. Türkiye Selçuklu Devletinin siyasi süreci, Bizans ve Haçlılarla mücadeleler. Türkiye Selçuklu Devletinin yıkılışı",
    "methods": "Anlatım, Soru ve Cevap",
    "resources": "Kaynaklar: T. Baykara, Gıyaseddin Keyhusrev (1164-1211) Gazi- Şehit, Ankara 1997. 11) 15) Ebru Altan, Myriokephalon (Karamık-beli) Savaşı´nın Anadolu Türk Tarihindeki Ye¬ri\", Türkler VI, , An-kara 2002. 16) N. Kaymaz, Anadolu Selçuklularının İnhitatında İdari Mekanizmasının Rolü, Ankara 2011. 17) M. Ali Hacıgökmen, ?Türkiye Selçuklu Devlet Adamlarından Esededdin Ayaz?, S.Ü Türkiyat Araştırmaları Der. Bahar 2010/ 27, s. 471-488. 18) M. Ali Hacıgökmen ?I. Alaeddin Keykubat Dönemi Emirlerinden Atabey Bedreddin Gühertaş (Gevhertas) (D. ?-Ö. 1262)?, A.Ü., DTCF, Tarih Arastırmaları Dergisi, XXX/ 50, An; Ders Notları: İ. Kafesoğlu Anadolu Selçuklu Devleti Hangi Tarihte Kuruldu??, İ.Ü. Edebiyat Fakültesi Tarih Enstitüsü Dergisi, Sayı:10-11 (1981), s. 1-28. 1) 2) Mustafa Kafalı,¨Anadolu´nun Fethi ve Türkleşmesi¨, Türkler,VI, Ankara 2002, s. 177. 2) 3) M. Altay Köymen, ?Anadolu´nun Fethi?, Diyanet İşleri Başkanlığı Dergisi, II (1961), s. 89-122. 3) 4) M. Altay Köymen, ?Süleymanşah ve Selçuklu Devletinin Kuruluşu?, Belleten, 57/218 (1993), s.71-79. 4) 5) M. Fuad Köprülü, ?Anadolu Selçukluları Tarihinin Yerli Kaynakları?, Belleten, VII/27 (1943), s. 379- 485, 5) 6) M. Ali Hacıgökmen, ?Türkiye Selçukluları Zamanında Konya´nın Devlet Merkezi Oluşu? S.Ü. Türkiyat Araştırmaları Der. Bahar 2011/ 25, s. 231-261. 6) 7) Osman Turan, Selçuklular Zamanında Türkiye, İstanbul 1971. 7) 8) Işın Demirkent, Türkiye Selçuklu Hükümdarı Sultan I. Kılıç Arslan, Ankara 1996. 8) 9) Işın Demirkent, Haçlı Seferleri, İstanbul, 1997 10) Işın Demirkent, Urfa Haçlı Kontluğu I-II, Ankara, 1994 9) 11) Fikret Işıltan, Haçlı Seferleri Tarihi,I-II-III (Runciman´dan Çeviri), Ankara 1992 10) 12)B. Umar, ?Myriokephalon Savaşının Yeri: Çivril yakınında Kufî Çayı vadisi?, Belleten, LIV/209, (1990), 99-116. 13) Selim Kaya, I. Gıyaseddin Keyhüsrev ve II. Süleyman-şah Dönemi Selçuklu Tarihi (1192-1211) Ankara 2006.",
    "sdgs": [
      "4",
      "10",
      "16"
    ],
    "outcomes": [
      "Orta Çağ dünyasının kronolojik ve coğrafi çerçevesi ile ilgili ileri kavramları analiz eder.",
      "Siyasal oluşumlar ve hanedan yapıları bağlamındaki kaynak ve kanıtları eleştirel değerlendirir.",
      "Şehirler, ticaret ve ekonomik ilişkiler ile ilişkili tarihsel örnekleri karşılaştırır.",
      "Anadolu ve çevre bölgelerin karşılaştırılması için uygun tarihsel çözümleme yaklaşımını uygular.",
      "Dönemin tarihsel mirasının değerlendirilmesi temelinde gerekçeli sonuçlar geliştirir."
    ],
    "weeklyTopics": [
      "Türklerin Anadolu'yu Fethi",
      "Türkiye Selçuklu Devleti'nin Kuruluşu ve Süleymanşah Dönemi",
      "Selçuk Bey ve Oğulları: Selçuklu Devleti'nin Kuruluşu",
      "Sultan I. Kılıçaraslan Dönemi ve Türkiye Selçuklu Tahtında Saltanat Mücadelesi",
      "Sultan I. Mesud Dönemi",
      "Sultan II. Kılıçarslan Dönemi ve Mryakephalon Zaferi",
      "Izzeddin keykavus",
      "Gıyâseddin Keyhüsrev Dönemi ve Kösedağ Savaşı",
      "Kösedağ Savaşı'ndan Yıkılışa Kadar Türkiye Selçuklu Devleti",
      "Gıyaseddin keyhusrev ve Moğol İstilası",
      "Selçuklu Hanedanlığının Sonu ve İkinci Beylikler",
      "Türkiye Selçuklu Devlet Teşkilatı, Kültür ve Medeniyet",
      "Askeri Teşkilat",
      "Genel Değerlendirme",
      "Orta Çağ dünyasının kronolojik ve coğrafi çerçevesi"
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
          1,
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
          2,
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
          1,
          3,
          3,
          1,
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
          4,
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
          5,
          5,
          5,
          5,
          3,
          5,
          1,
          3,
          3,
          1,
          3
        ]
      }
    ],
    "sourceUrl": "https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=246700&lang=tr",
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
    "department": "Tarih ABD",
    "programName": "Tarih",
    "level": "Tezsiz Yüksek Lisans",
    "code": "TRHTZ564",
    "name": "Milli ve evrensel bakışla insan ve lider atatürk",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Prof. Dr. EBRU GÜHER",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Millî ve Evrensel Bakışla İnsan ve Lider Atatürk” dersi, Atatürk’ün hem ulusal değerlerle şekillenen yönünü hem de evrensel ilkelere dayanan liderliğini bütüncül bir çerçevede incelemeyi amaçlar. Bu ders, öğrencilerin Atatürk’ün insani yönünü, düşünce dünyasını ve liderlik anlayışını daha derin bir bakışla kavramasını; aynı zamanda onun çağdaş uygarlığa katkılarını yorumlayarak bugünün dünyasında taşıdığı anlamı değerlendirmesini sağlar.",
    "content": "Bu ders, Atatürk’ün yaşamı, düşünsel gelişimi, liderlik özellikleri ve toplumsal dönüşümlere yön veren ilkeleri üzerine odaklanır; aynı zamanda millî egemenlik, çağdaşlaşma, bilim ve eğitim anlayışı gibi temel kavramları tarihsel bağlamıyla ele alır. Öğrenciler, Atatürk’ün dünya liderleri arasındaki konumunu, evrensel değerlere katkısını ve günümüz toplumları için taşıdığı anlamı tartışarak kapsamlı bir bakış kazanır.",
    "methods": "Bu derste, öğrencilerin Atatürk’ün yaşamı ve liderlik anlayışını çok yönlü bir bakışla kavrayabilmesi için anlatım, tartışma, soru-cevap, belge ve metin incelemesi, görsel materyal kullanımı, grup çalışmaları ve örnek olay analizleri gibi yöntem ve teknikler uygulanır. Böylece öğrenciler, hem tarihsel bağlamı daha iyi kavrar hem de eleştirel düşünme ve yorumlama becerilerini geliştirir.",
    "resources": "Kaynaklar: Atatürk, Mustafa Kemal. Nutuk. İstanbul: Türkiye İş Bankası Kültür Yayınları, 2023Kinross, Patrick. Atatürk: Bir Milletin Yeniden Doğuşu. İstanbul: Altın Kitaplar, 2018.Aydın, Suavi. Atatürk'ün Düşünce Dünyası. Ankara: Phoenix Yayınları, 2021.Mango, Andrew. Atatürk. İstanbul: Remzi Kitabevi, 2020.Sarınay, Yusuf. Atatürk ve Türk Devrimi. Ankara: Atatürk Araştırma Merkezi Yayınları, 2019.Zürcher, Erik Jan. Modernleşen Türkiye’nin Tarihi. İstanbul: İletişim Yayınları, 2022.Kili, Suna. Atatürk Devrimi: Bir Çağdaşlaşma Modeli. Ankara: Türkiye İş Bankası Kültür Yayınları, 2020.Arı, Kemal. Atatürk’ün Liderlik Sırları. İzmir: Yakın Kitabevi, 2017.; Ders Notları: Atatürk, Mustafa Kemal. Nutuk. İstanbul: Türkiye İş Bankası Kültür Yayınları, 2023.Kinross, Patrick. Atatürk: Bir Milletin Yeniden Doğuşu. İstanbul: Altın Kitaplar, 2018.Aydın, Suavi. Atatürk'ün Düşünce Dünyası. Ankara: Phoenix Yayınları, 2021.Mango, Andrew. Atatürk. İstanbul: Remzi Kitabevi, 2020.",
    "sdgs": [
      "4",
      "10",
      "16"
    ],
    "outcomes": [
      "Geç Osmanlı mirası ve dönüşüm dinamikleri ile ilgili ileri kavramları analiz eder.",
      "Kongreler, örgütlenme ve temsil bağlamındaki kaynak ve kanıtları eleştirel değerlendirir.",
      "Tek parti döneminin siyasal dinamikleri ile ilişkili tarihsel örnekleri karşılaştırır.",
      "Belge, hatırat ve süreli yayınların eleştirisi için uygun tarihsel çözümleme yaklaşımını uygular.",
      "Cumhuriyet tarihinin süreklilik ve değişim açısından analizi temelinde gerekçeli sonuçlar geliştirir."
    ],
    "weeklyTopics": [
      "Dersin tanıtımı, amaç ve kapsamın açıklanması",
      "Atatürk’ün yaşamı: çocukluk dönemi ve kişilik oluşumu",
      "Askerî eğitim yılları ve liderlik becerilerinin gelişimi",
      "I. Dünya Savaşı dönemi ve Atatürk’ün rolü",
      "Milli Mücadele’nin örgütlenmesi ve liderlik süreci",
      "Türkiye Büyük Millet Meclisi’nin açılışı ve yeni bir devletin temelleri",
      "Atatürk'ün millî egemenlik anlayışı",
      "Atatürk ilke ve inkılapları: genel çerçeve",
      "Toplumsal ve kültürel dönüşümler",
      "Eğitim, bilim ve modernleşme vizyonu",
      "Atatürk'ün dış politika anlayışı ve dünya barışına katkıları",
      "Atatürk’ün evrensel değerlere yaklaşımı",
      "Atatürk’ün liderlik modeli ve çağdaş liderlik teorileri",
      "Genel değerlendirme, tartışmalar ve kapanış",
      "Geç Osmanlı mirası ve dönüşüm dinamikleri"
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
          1,
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
          2,
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
          1,
          3,
          3,
          1,
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
          4,
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
          5,
          5,
          5,
          5,
          3,
          5,
          1,
          3,
          3,
          1,
          3
        ]
      }
    ],
    "sourceUrl": "https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=246702&lang=tr",
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
    "department": "Tarih ABD",
    "programName": "Tarih",
    "level": "Tezsiz Yüksek Lisans",
    "code": "TRHTZ580",
    "name": "Osmanlı para ve fiyat tarihi",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Doç. Dr. ŞENAY ATAM",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Osmanlı para tarihi ile ilgili temel kavram ve meselelerin anlaşılmasını sağlamak, Osmanlı para tarihinin dünya para tarihi içindeki yerini ortaya koymaktır.",
    "content": "Osmanlı para sistemiyle ilgili temel meselelerin incelenmesi, dünya ekonomisindeki gelişmelerin Osmanlı ekonomisi ve para sistemine yansımalarının ele alınması",
    "methods": "Tartışma, Soru-Cevap",
    "resources": "Kaynaklar: Ali Akyıldız, Osmanlı İmparatorluğu'nda Kağıt Para, Maliye ve Toplum, İstanbul 2003Şevket Pamuk, Osmanlı İmparatorluğu'nda Paranın Tarihi, İstanbul 2017Ömer Faruk Bölükbaşı, XVIII. Yüzyılın İkinci Yarısında Darbhane-i Amire, İstanbul 2013",
    "sdgs": [
      "4",
      "10",
      "11"
    ],
    "outcomes": [
      "Sosyal ve kültürel tarihin kavramsal çerçevesi ile ilgili ileri kavramları analiz eder.",
      "Toplumsal tabakalar ve kimlikler bağlamındaki kaynak ve kanıtları eleştirel değerlendirir.",
      "Kent, mekân ve yerel toplum ile ilişkili tarihsel örnekleri karşılaştırır.",
      "Belge ve anlatıların karşılaştırılması için uygun tarihsel çözümleme yaklaşımını uygular.",
      "Sosyal tarih bulgularının bütüncül yorumlanması temelinde gerekçeli sonuçlar geliştirir."
    ],
    "weeklyTopics": [
      "Dünya ve Osmanlı ekonomisinde paranın yeri ve önemi",
      "İlk Osmanlı sikkesi",
      "Kuruluş döneminde Osmanlı para sistemi",
      "Amerikan gümüşü ve Osmanlı para sistemi",
      "XVII. yüzyılda Osmanlı para sistemi",
      "1690-1719 yılları arasında Osmanlı para sisteminde yapılan reformlar",
      "Tağşişler ve Osmanlı para sistemine etkisi",
      "Tashih-i Ayar",
      "XIX. yüzyılda Osmanlı para sisteminde yaşanan gelişmeler",
      "Kağıt Para tecrübesi",
      "Sosyal ve kültürel tarihin kavramsal çerçevesi",
      "Gündelik hayatı inceleyen kaynak türleri",
      "Toplumsal tabakalar ve kimlikler",
      "Aile, kadın ve toplumsal cinsiyet",
      "Eğitim, yardım ve dayanışma kurumları"
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
          1,
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
          2,
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
          1,
          1,
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
          4,
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
          5,
          5,
          5,
          5,
          3,
          5,
          3,
          3,
          1,
          1,
          3
        ]
      }
    ],
    "sourceUrl": "https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=246718&lang=tr",
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
    "department": "Tarih ABD",
    "programName": "Tarih",
    "level": "Tezsiz Yüksek Lisans",
    "code": "TTS706",
    "name": "Uygarlık tarihi",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Doç. Dr. MUHAMMED FAZIL HİMMETOĞLU",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Bu dersin amacı, başlangıcından 13. yüzyıla kadar, antik uygarlıklar üzerinde yoğunlaşarak, toplumları ve kültürleri öğrenciye tanıtmaktır. Sosyal, ekonomik, politik ve dini kurumlar tarihsel bir bağlam içinde ele alınacaktır.",
    "content": "Paleolitik Dönemden Bizansa kadar uygarlık tarihi",
    "methods": "Okuma",
    "resources": "Kaynaklar: gordon chidl, tarihte neler oldu; Ders Notları: Server Tanilli, Uygarlık Tarihi, Cumhuriyet Kitapları, İstanbul.Fernand Braudel, Uygarlıkların Grameri, çev: M. Ali Kılıçbay, İmge Kitabevi Yayınları, Ankara, 2006.Charles Freeman, Mısır, Yunan ve Roma: Antik Akdeniz Uygarlıkları, Dost Kitabevi Yayınları, Ankara, 2010.A.W.F. Blunt, Batı Uygarlığının Temelleri, çev: Müzehher Erim, İstanbul Üniversitesi Edebiyat Fakültesi Yayınları, İstanbul, 1984.; Dökümanlar: . Ali Kılıçbay, İmge Kitabevi Yayınları, Ankara, 2006. Charles Freeman, Mısır, Yunan ve Roma: Antik Akdeniz Uygarlıkları, Dost Kitabevi Yayınları, Ankara, 2010. A.W.F. Blunt, Batı Uygarlığının Temelleri, çev: Müzehher Erim, İstanbul Üniversitesi Edebiyat Fakültesi Yayınları, İstanbul, 1984.; Ödevler: yok; Sınavlar: vize final",
    "sdgs": [
      "4",
      "10",
      "16"
    ],
    "outcomes": [
      "Osmanlı tarihinin dönemlendirilmesi ve kaynakları ile ilgili ileri kavramları analiz eder.",
      "Saray, bürokrasi ve karar süreçleri bağlamındaki kaynak ve kanıtları eleştirel değerlendirir.",
      "Eğitim, kültür ve düşünce hayatı ile ilişkili tarihsel örnekleri karşılaştırır.",
      "Bölgesel örneklerin karşılaştırılması için uygun tarihsel çözümleme yaklaşımını uygular.",
      "Dönemin çok boyutlu tarihsel değerlendirmesi temelinde gerekçeli sonuçlar geliştirir."
    ],
    "weeklyTopics": [
      "Uygarlık kavramının tanımı ve içeriği",
      "İnsanlık Tarihinin Dönüm Noktası: Neolitik Devrim",
      "Antik Yakındoğu Uygarlıkları: Mısır",
      "Antik Yakındoğu Uygarlıkları: Mezopotamya",
      "Antik Yakındoğu Uygarlıkları: Anadolu",
      "Antik Yunan Uygarlığı",
      "Ortaçağ Batı Uygarlığı",
      "Uygarlık tarihinde din olgusu",
      "Yönetim Şekilleri. Demokrasinin Kökenleri ve Gelişimi",
      "Roma Hukuku ve Günümüze Etkileri",
      "Antik Uzakdoğu Uygarlıkları: Çin",
      "Antik Uzakdoğu Uygarlıkları: Hindistan",
      "Amerika Uygarlıkları: İnka, Aztek ve Maya",
      "Genel Değerlendirme ve Tartışma",
      "Osmanlı tarihinin dönemlendirilmesi ve kaynakları"
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
          1,
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
          2,
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
          1,
          3,
          3,
          1,
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
          4,
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
          5,
          5,
          5,
          5,
          3,
          5,
          1,
          3,
          3,
          1,
          3
        ]
      }
    ],
    "sourceUrl": "https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=246717&lang=tr",
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
    "department": "Tarih ABD",
    "programName": "Tarih",
    "level": "Tezsiz Yüksek Lisans",
    "code": "TTS714",
    "name": "Osmanlı tarihinin yazarları",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Doç. Dr. MURAT ALANDAĞLI",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Osmanlı İmparatorluğu'nun kuruluşu, yükselişi ve duraklaması hakkında yazılmış kaynaklar başta olmak üzere idarî, malî ve sosyo-kültürel yapısına ait bilgiler içeren kaynak serisinin tanıtılması",
    "content": "Osmanlı'da tarih yazımının başlaması, kuruluş dönemi kaynakları, kronikler, tevârihler, yükselme dönemi eser ve yazarları, tahrir, şer'iye sicilleri, avarız, nüfus ve temettuat defterleri",
    "methods": "Sözel anlatım, karşılaştırmalı tenkit",
    "resources": "Kaynaklar: Osmanlı, ed. Kemal Çiçek, Cem Oğuz, c. XII, Yeni Türkiye Yayınları, Ankara, 1999.Suraiya Faroqhi, Osmanlı Tarihi Nasıl İncelenir? çev. Zeynep Altok, İstanbul, 2009.Ahmed Cevdet Paşa, Tarih-i Cevdet, 12 cilt, İstanbul, 1884-1891.Franz Babinger, Osmanlı Tarih Yazarları ve Eserleri, çev. Coşkun Üçok, Ankara, 2000.Âşıkpaşazâde, Tevârîh-i Âl-i Osman Âşıkpaşazâde Tarihi, (neşr. Âlî Bey), Matbaa-i Âmire, İstanbul, 1332.; Ders Notları: Âşıkpaşazâde, Tevârîh-i Âl-i Osman Âşıkpaşazâde Tarihi, (neşr. Âlî Bey), Matbaa-i Âmire, İstanbul, 1332.Ahmed Cevdet Paşa, Tarih-i Cevdet, 12 cilt, İstanbul, 1884-1891.Suraiya Faroqhi, Osmanlı Tarihi Nasıl İncelenir? çev. Zeynep Altok, İstanbul, 2009.Franz Babinger, Osmanlı Tarih Yazarları ve Eserleri, çev. Coşkun Üçok, Ankara, 2000.Osmanlı, ed. Kemal Çiçek, Cem Oğuz, c. XII, Yeni Türkiye Yayınları, Ankara, 1999.; Dökümanlar: Âşıkpaşazâde, Tevârîh-i Âl-i Osman Âşıkpaşazâde Tarihi, (neşr. Âlî Bey), Matbaa-i Âmire, İstanbul, 1332. Ahmed Cevdet Paşa, Tarih-i Cevdet, 12 cilt, İstanbul, 1884-1891. Suraiya Faroqhi, Osmanlı Tarihi Nasıl İncelenir? çev. Zeynep Altok, İstanbul, 2009. Franz Babinger, Osmanlı Tarih Yazarları ve Eserleri, çev. Coşkun Üçok, Ankara, 2000. Osmanlı, ed. Kemal Çiçek, Cem Oğuz, c. XII, Yeni Türkiye Yayınları, Ankara, 1999.",
    "sdgs": [
      "4",
      "10",
      "16"
    ],
    "outcomes": [
      "Osmanlı tarihinin dönemlendirilmesi ve kaynakları ile ilgili ileri kavramları analiz eder.",
      "Saray, bürokrasi ve karar süreçleri bağlamındaki kaynak ve kanıtları eleştirel değerlendirir.",
      "Eğitim, kültür ve düşünce hayatı ile ilişkili tarihsel örnekleri karşılaştırır.",
      "Bölgesel örneklerin karşılaştırılması için uygun tarihsel çözümleme yaklaşımını uygular.",
      "Dönemin çok boyutlu tarihsel değerlendirmesi temelinde gerekçeli sonuçlar geliştirir."
    ],
    "weeklyTopics": [
      "Osmanlı İmparatorluğu'nda tarihi metin yazma geleneği ve dersin önemi ile muhtevası",
      "Osmanlı kroniklerinin tahlil edilmesi",
      "Tevarih-i Âl-i Osman metinlerinin incelenmesi",
      "Menakıbname metinleri ve Osmanlı tarihinin incelenmesi noktasındaki önemi",
      "Kuruluş dönemi kaynakları hakkında mukayeseli değerlendirme (Kronikler, Tevarihler ve Menakıpnameler)",
      "Osmanlı tahrir sistemi ve tahrir defterlerinin önemi ile Osmanlı tarihinin bir kaynak serisi olma hususiyetini bilir",
      "Şer'iye Sicilleri, muhtevası, önemi ve Osmanlı tarihinin önemli bir kaynak serisi olma nedenlerini kavrar",
      "Avarız kayıtları ve bu kayıtların Osmanlı tarihinin araştırılmasındaki önemini kavrar",
      "Derdest, Ruznamçe ve diğer bazı defter serisini tanır, Osmanlı tarihinin kaynağı olma nedenleri tartışılır",
      "Osmanlı vakıf sistemi, oluşumu, gelişimi ve öneminin yanı sıra vakfiye ve evkaf defterlerinin Osmanlı tarihinin kaynağı olması üzerinde tartışılır",
      "Nüfus kayıtları ve bu kayıtların Osmanlı tarihinin ana kaynaklarından biri olmasının nedenleri üzerinde durulur",
      "XIX. yüzyıl Osmanlı vergi sistemi ve bunun sonucu hazırlanmış olan Temettuat defterlerinin Osmanlı tarihinin kaynak serisi içerisinde yer alması hususiyeti tartışılır",
      "Salnameler, haritalar ve bazı anı, seyahatname metinlerinin Osmanlı tarihinin kaynakları olma hususiyetinin tartşılması",
      "Osmanlı tarihinin dönemlendirilmesi ve kaynakları",
      "Merkez ve taşra teşkilatının yapısı"
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
          1,
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
          2,
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
          1,
          3,
          3,
          1,
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
          4,
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
          5,
          5,
          5,
          5,
          3,
          5,
          1,
          3,
          3,
          1,
          3
        ]
      }
    ],
    "sourceUrl": "https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=269707&lang=tr",
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
    "department": "Tarih ABD",
    "programName": "Tarih",
    "level": "Tezsiz Yüksek Lisans",
    "code": "TTS742",
    "name": "Iı. meşrutiyet dönemi siyasi faaliyetleri",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Doç. Dr. ŞENAY ATAM",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Türk modernleşme tarihinde siyasi hareketlerin nasıl başladığı, kurulan komite ve fırkaların birbirlerini ne derecede etkilediği ortaya konularak, söz konusu mevzularda öğrencilerin analiz yeteneklerini geliştirmek.",
    "content": "II. Meşrutiyet'in İlanı sürecinde yaşanan siyasi gelişmeler, Osmanlı Devleti'nin durumu, Osmanlı döneminde kurulan ve Türk siyasi hayatını etkileyen belli başlı siyasi yapılar incelenecek ve değerlendirilecektir.",
    "methods": "Anlatım, Tartışma, Değerlendirme",
    "resources": "Kaynaklar: Tarık Zafer Tunaya, Türkiye’de Siyasal Gelişmeler, İstanbul 2001.Florian Riedler, Osmanlı İmparatorluğu’nda Muhalefet ve Meşruiyet: Siyasi Kültür ve Komplolar, Çeviren Azize F. Çakır, İstanbul: Picus Yayıncılık, 2012Erik Jan Zürcher, Modernleşen Türkiye’nin Tarihi, İletişim Yayınları, İstanbul 2000.",
    "sdgs": [
      "4",
      "10",
      "16"
    ],
    "outcomes": [
      "Osmanlı tarihinin dönemlendirilmesi ve kaynakları ile ilgili ileri kavramları analiz eder.",
      "Saray, bürokrasi ve karar süreçleri bağlamındaki kaynak ve kanıtları eleştirel değerlendirir.",
      "Eğitim, kültür ve düşünce hayatı ile ilişkili tarihsel örnekleri karşılaştırır.",
      "Bölgesel örneklerin karşılaştırılması için uygun tarihsel çözümleme yaklaşımını uygular.",
      "Dönemin çok boyutlu tarihsel değerlendirmesi temelinde gerekçeli sonuçlar geliştirir."
    ],
    "weeklyTopics": [
      "Çalışılacak dönemle ilgili eser ve kaynakların değerlendirilmesi",
      "Dönemin genel özellikleri, dahili ve harici gelişmeler",
      "Fransız İhtilali ve etkileri",
      "Sened-i İttifak, Tanzimat ve Islahat Fermanları",
      "Genç Osmanlılar ve fikri akımlar",
      "Meşruti sisteme geçiş süreci",
      "I. Meşrutiyet Dönemi ve Kanun-i Esasi",
      "İttihat ve Terakki Fırkası'nın Teşkili",
      "İttihat ve Terakki Fırkası",
      "II. Meşrutiyet Döneminde Kurulan Siyasi Partiler",
      "31 Mart Vakası ve II. Mşrutiyet Döneminde Yaşanan İktidar Çekişmeleri",
      "Osmanlı'nın Son Döneminde Yaşanan Siyasi Gelişmeler",
      "Osmanlı tarihinin dönemlendirilmesi ve kaynakları",
      "Merkez ve taşra teşkilatının yapısı",
      "Saray, bürokrasi ve karar süreçleri"
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
          1,
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
          2,
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
          1,
          3,
          3,
          1,
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
          4,
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
          5,
          5,
          5,
          5,
          3,
          5,
          1,
          3,
          3,
          1,
          3
        ]
      }
    ],
    "sourceUrl": "https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=258906&lang=tr",
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
    "department": "Tarih ABD",
    "programName": "Tarih",
    "level": "Tezsiz Yüksek Lisans",
    "code": "TTS754",
    "name": "20.yüzyıl türkiyesin'den portreler",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Doç. Dr. ÜMMÜGÜLSÜM CANDEĞER",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "20. yüzyıl Türkiye'sinin siyasi, ekonomik, sosyal, bilimsel, sanatsal alanlarında ön plana çıkmış olan kişilerin hayatlarının incelenmesi",
    "content": "20. Yüzyıl Türkiyes'sinde ön plana çıkmış şahıslarla ilgili öğrenci ilgisi baz alınarak biyografiler hazırlamak.",
    "methods": "Sözlü anlatım, Biyografi Yazım Uygulaması",
    "resources": "Kaynaklar: Unutulmayanlar: 20. Yüzyılın Portreleri, Tarih Vakfı yurt Yayınları Yılmaz Öztuna- Türk Tarihinden PortrelerÇeşitli kaynaklar; Ders Notları: K1- Unutulmayanlar: 20. Yüzyılın Portreleri, Tarih Vakfı yurt YayınlarıK2- Yılmaz Öztuna- Türk Tarihinden Portreler",
    "sdgs": [
      "4",
      "10",
      "16"
    ],
    "outcomes": [
      "Osmanlı tarihinin dönemlendirilmesi ve kaynakları ile ilgili ileri kavramları analiz eder.",
      "Saray, bürokrasi ve karar süreçleri bağlamındaki kaynak ve kanıtları eleştirel değerlendirir.",
      "Eğitim, kültür ve düşünce hayatı ile ilişkili tarihsel örnekleri karşılaştırır.",
      "Bölgesel örneklerin karşılaştırılması için uygun tarihsel çözümleme yaklaşımını uygular.",
      "Dönemin çok boyutlu tarihsel değerlendirmesi temelinde gerekçeli sonuçlar geliştirir."
    ],
    "weeklyTopics": [
      "Dersin tanımı yapılması, öğrencilerle tanışma",
      "Gazi Mustafa Kemal Atatürk",
      "Siyasal alanda ön plana çıkmış kişilerin biyografileri",
      "Tarihçilik alanında ön plana çıkmış kişilerin biyografileri",
      "Edebiyat alanında ön plana çıkmış kişilerin biyografileri",
      "Bilim alanında ön plana çıkmış kişilerin biyografileri",
      "Sanat alanında ön plana çıkmış kişilerin biyografileri",
      "Biyografi örneği yazımı",
      "Osmanlı tarihinin dönemlendirilmesi ve kaynakları",
      "Merkez ve taşra teşkilatının yapısı",
      "Saray, bürokrasi ve karar süreçleri",
      "Toplumsal gruplar ve gündelik hayat",
      "Hukuk, millet düzeni ve dinî kurumlar",
      "Toprak, üretim ve mali yapı",
      "Şehirler, ulaşım ve haberleşme ağları"
    ],
    "assessments": [
      {
        "name": "Yarıyıl Sonu Sınavı",
        "count": 1,
        "weight": 100
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
          4,
          4,
          4,
          2,
          4,
          1,
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
          2,
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
          1,
          3,
          3,
          1,
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
          4,
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
          5,
          5,
          5,
          5,
          3,
          5,
          1,
          3,
          3,
          1,
          3
        ]
      }
    ],
    "sourceUrl": "https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=246699&lang=tr",
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
    "department": "Tarih ABD",
    "programName": "Tarih",
    "level": "Tezsiz Yüksek Lisans",
    "code": "TTS756",
    "name": "Geç osmanlı devrinden cumhuriyetin ilk yıllarında gündelik yaşam ve kadın",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Dr. Öğr. Üyesi SEHER YÜCETÜRK",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Osmanlı Devletinde toplum yapısının önemli bir unsuru olan kadın ve kadının içinde yer aldığı gündelik yaşamın tanıtılması. Gündelik yaşamın hangi değişkenlerin etrafında çeşitlendiğinin tespit edilmesi. Gündelik yaşamın artı ve eksi yönlerinin tanıtılması.",
    "content": "Gündelik yaşamın bilinmeyen yönlerinin kültür ekseni etrafında etraflıca irdelenmesi. Özellikle çok uluslu bir yapıya sahip olan Osmanlı Devleti için gündelik yaşamın bağlı olduğu kuralların ifade edilmesi.",
    "methods": "Anlatım, analiz, soru cevap.",
    "resources": "Kaynaklar: Suraıya Faroqhı, Osmanlı Kültürü ve Gündelik Yaşam Orta Çağdan Yirminci Yüzyıla, Çev:Elif Kılıç, Tarih Vakfı Yurt Yayınları",
    "sdgs": [
      "4",
      "10",
      "16"
    ],
    "outcomes": [
      "Geç Osmanlı mirası ve dönüşüm dinamikleri ile ilgili ileri kavramları analiz eder.",
      "Kongreler, örgütlenme ve temsil bağlamındaki kaynak ve kanıtları eleştirel değerlendirir.",
      "Tek parti döneminin siyasal dinamikleri ile ilişkili tarihsel örnekleri karşılaştırır.",
      "Belge, hatırat ve süreli yayınların eleştirisi için uygun tarihsel çözümleme yaklaşımını uygular.",
      "Cumhuriyet tarihinin süreklilik ve değişim açısından analizi temelinde gerekçeli sonuçlar geliştirir."
    ],
    "weeklyTopics": [
      "Kültür ve Medeniyet kavramları.",
      "Bir kültür unsuru olarak mahalle",
      "Klasik dönemde mahalle de yaşama kuralları",
      "Mahalle kavramına kadınların entegre olma şekilleri",
      "Kadınlar için klasik dönemde giyim kuşam ölçütleri",
      "Kadınların mahalle içerisinde ve dışında seyahat şartları",
      "Kadınların gündelik yaşama katkısı",
      "Kadınların iş gücüne katkısı",
      "Kadınların nikah, evlenme, boşanma gibi sorunsallarının belgeler üzerinden değerlendirilmesi",
      "Kadınların özlük haklarının değerlendirilmesi",
      "Kadınların miras alım satım gibi mali alan konularındaki rolleri",
      "Kadınların ticaretteki rolleri",
      "Kadınların geç döneme doğru değişen hayat şartları",
      "Geç Osmanlı mirası ve dönüşüm dinamikleri",
      "Millî Mücadele'nin siyasal ve toplumsal koşulları"
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
          1,
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
          2,
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
          1,
          3,
          3,
          1,
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
          4,
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
          5,
          5,
          5,
          5,
          3,
          5,
          1,
          3,
          3,
          1,
          3
        ]
      }
    ],
    "sourceUrl": "https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=269708&lang=tr",
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
    "department": "Tarih ABD",
    "programName": "Tarih",
    "level": "Tezsiz Yüksek Lisans",
    "code": "TTS776",
    "name": "Osmanlı devletinde ulaşım ve haberleşme",
    "credit": 3,
    "ects": 6,
    "theory": 3,
    "practice": 0,
    "instructor": "Dr. Öğr. Üyesi AHMET CANER ÇATAL",
    "language": "Türkçe",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "purpose": "Osmanlı Devleti'nin kuruluşundan yıkılışına geçen süre içerisinde karayolu, denizyolu, demiryolu ve havayolu ulaşımının nasıl geliştiği, hangi yüzyıllarda ne tür yolların kullanıldığı hakkında bilgi sahibi olunması sağlamaktır.",
    "content": "Osmanlı'nın Klasik Devrinde Karayolu Ulaşımı ve Yollar, 19. Yüzyılda Osmanlı Devleti Karayolları, Osmanlı Devrinde Hac Yolları, İstanbul'da Şehiriçi Toplu Taşımacılığı, İstanbul'da Şehiriçi Kara Ulaşımı, Buharlı Gemiler Çağında Osmanlı Deniz ve Nehiryolu Ulaşımı, Sultan Abdülmecid Devrinde Bir Osmanlı Maden Müdürünün Kızılırmak Projesi, Tarih Boyunca Kadıköy, Adalar ve Haliç'te Deniz Ulaşımı, Şirket-i Hayriye, Sultan II. Abdülhamid Han'ın Boğaziçi'ne Köprü ve Tüp Geçit Projeleri, Osmanlı'nın Demiryolu Çağına Girişi, Rumeli Demiryolları, Hicaz Demiryolları.",
    "methods": "Düz Anlatım, Tartışma, Soru-Cevap.",
    "resources": "Kaynaklar: Ali Akyıldız (1987,), İzmir-Aydın Demiryolu, Basılmamış Yüksek Lisans Tezi. Vahdettin Engin-Ahmet Uçar-Osman Doğan (2013), Osmanlı'da Ulaşım, Çamlıca Yay, İstanbul. Yusuf Halaçoğlu (2002), Osmanlılarda Ulaşım ve Haberleşme (Menziller), PTT Genel Müdürlüğü Yay. Ankara.; Ders Notları: Vahdettin Engin-Ahmet Uçar-Osman Doğan (2013), Osmanlı'da Ulaşım, Çamlıca Yay, İstanbul. Yusuf Halaçoğlu (2002), Osmanlılarda Ulaşım ve Haberleşme (Menziller), PTT Genel Müdürlüğü Yay. Ankara.",
    "sdgs": [
      "4",
      "10",
      "16"
    ],
    "outcomes": [
      "Osmanlı tarihinin dönemlendirilmesi ve kaynakları ile ilgili ileri kavramları analiz eder.",
      "Saray, bürokrasi ve karar süreçleri bağlamındaki kaynak ve kanıtları eleştirel değerlendirir.",
      "Eğitim, kültür ve düşünce hayatı ile ilişkili tarihsel örnekleri karşılaştırır.",
      "Bölgesel örneklerin karşılaştırılması için uygun tarihsel çözümleme yaklaşımını uygular.",
      "Dönemin çok boyutlu tarihsel değerlendirmesi temelinde gerekçeli sonuçlar geliştirir."
    ],
    "weeklyTopics": [
      "Klasik Devirde Osmanlı'da Karayolu Ulaşımı ve Yollar",
      "19. Yüzyılda Osmanlı Devleti Karayolları",
      "Osmanlı Devrinde Hac Yolları",
      "İstanbul'da Şehiriçi Toplu Taşımacılığının Bir Unsuru Olarak Omnimüsler",
      "İstanbul'da Şehiriçi Kara Ulaşımı: At Arabalarından Otomobile",
      "Buharlı Gemiler Çağında Osmanlı Deniz ve Nehiryolu Ulaşımı",
      "Tarih Boyunca Kadıköy, Adalar ve Haliç'te Deniz Ulaşımı.",
      "Boğaziçi'nde Deniz Ulaşımı: Şirket-i Hayriye",
      "Osmanlı'nın Demiryolu Çağına Girişi",
      "Rumeli Demiryolları, Hicaz Demiryolları",
      "Osmanlı Devrinde Anadolu ve Bağdat Demiryolları",
      "Osmanlı'da Havayolu",
      "Osmanlı tarihinin dönemlendirilmesi ve kaynakları",
      "Merkez ve taşra teşkilatının yapısı",
      "Saray, bürokrasi ve karar süreçleri"
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
          1,
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
          2,
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
          1,
          3,
          3,
          1,
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
          4,
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
          5,
          5,
          5,
          5,
          3,
          5,
          1,
          3,
          3,
          1,
          3
        ]
      }
    ],
    "sourceUrl": "https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=246701&lang=tr",
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

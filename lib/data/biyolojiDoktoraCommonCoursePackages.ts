// bologna-lisansustu-2026-08-17-ders-verileri.json ve resmi LEE_DBP ders kataloğundan üretilmiştir; program profili ve PÇ kayıtları değiştirilmemiştir.
import type { CoursePackage } from "./coursePackages";

export const biyolojiDoktoraCommonCoursePackages: CoursePackage[] = [
  {
    "code": "DAN9XX",
    "name": "DANIŞMANLIK",
    "theory": 0,
    "practice": 1,
    "credit": 0,
    "ects": 1,
    "purpose": "Öğrencinin doktora araştırmasını bilimsel özgünlük, yöntem, etik, yayın ve zaman yönetimi bakımından yönlendirmek.",
    "content": "Doktora araştırma planı, ileri literatür, özgün problem, yöntem geliştirme, veri yönetimi, araştırma bütünlüğü, yayın stratejisi ve ilerleme izlemesi.",
    "methods": "Danışmanlık görüşmesi, eleştirel literatür değerlendirmesi, araştırma planı incelemesi ve ilerleme izlemesi.",
    "stages": [
      "Doktora çalışma planının oluşturulması",
      "Uzmanlık alanının ve araştırma sınırlarının belirlenmesi",
      "İleri literatür tarama stratejisinin değerlendirilmesi",
      "Özgün araştırma probleminin netleştirilmesi",
      "Etik ve biyogüvenlik gerekliliklerinin incelenmesi",
      "Hipotez ve araştırma tasarımının değerlendirilmesi",
      "Veri üretim planının izlenmesi",
      "Araştırma kayıtları ve kalite güvencesi",
      "Bulguların eleştirel ön değerlendirmesi",
      "İleri analiz yaklaşımının gözden geçirilmesi",
      "Bilimsel yayın planının oluşturulması",
      "Kaynak, atıf ve araştırma bütünlüğü denetimi",
      "Araştırma sınırlılıklarının değerlendirilmesi",
      "Doktora ilerlemesi ve bilimsel katkının izlenmesi",
      "Sonraki dönem araştırma hedeflerinin kararlaştırılması"
    ],
    "department": "Biyoloji ABD",
    "programName": "Biyoloji",
    "language": "Türkçe",
    "level": "Doktora",
    "teachingMode": "Bireysel Çalışma",
    "prerequisites": "Yok",
    "instructor": "Öğrencinin Danışmanı",
    "resources": "Biyoloji alanına özgü güncel hakemli literatür; Enstitü tez yazım ve etik yönergeleri; ders sorumlusunun önerdiği bilimsel kaynaklar.",
    "sdgs": [
      "4",
      "9",
      "15"
    ],
    "outcomes": [
      "Danışmanlık kapsamındaki ileri biyolojik kavramları analiz eder.",
      "ileri biyoloji araştırmaları alanındaki bilimsel yaklaşımları karşılaştırır.",
      "Danışmanlık için uygun araştırma veya inceleme yöntemini uygular.",
      "Danışmanlık verilerini bilimsel ölçütlerle değerlendirir.",
      "Danışmanlık bulgularını etik ve biyolojik bağlamda yorumlar."
    ],
    "weeklyTopics": [
      "Doktora çalışma planının oluşturulması",
      "Uzmanlık alanının ve araştırma sınırlarının belirlenmesi",
      "İleri literatür tarama stratejisinin değerlendirilmesi",
      "Özgün araştırma probleminin netleştirilmesi",
      "Etik ve biyogüvenlik gerekliliklerinin incelenmesi",
      "Hipotez ve araştırma tasarımının değerlendirilmesi",
      "Veri üretim planının izlenmesi",
      "Araştırma kayıtları ve kalite güvencesi",
      "Bulguların eleştirel ön değerlendirmesi",
      "İleri analiz yaklaşımının gözden geçirilmesi",
      "Bilimsel yayın planının oluşturulması",
      "Kaynak, atıf ve araştırma bütünlüğü denetimi",
      "Araştırma sınırlılıklarının değerlendirilmesi",
      "Doktora ilerlemesi ve bilimsel katkının izlenmesi",
      "Sonraki dönem araştırma hedeflerinin kararlaştırılması"
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
        "name": "Ders Süresi",
        "count": 15,
        "hours": 1,
        "total": 15
      },
      {
        "name": "Sınıf Dışı Çalışma Süresi",
        "count": 15,
        "hours": 1,
        "total": 15
      }
    ],
    "contributionMatrix": [
      {
        "outcome": "DÖÇ1",
        "values": [
          4,
          3,
          2,
          2,
          3,
          2,
          4,
          2,
          2,
          2,
          2
        ]
      },
      {
        "outcome": "DÖÇ2",
        "values": [
          3,
          4,
          2,
          2,
          3,
          2,
          4,
          3,
          2,
          2,
          4
        ]
      },
      {
        "outcome": "DÖÇ3",
        "values": [
          3,
          3,
          5,
          5,
          3,
          2,
          3,
          2,
          2,
          2,
          2
        ]
      },
      {
        "outcome": "DÖÇ4",
        "values": [
          3,
          4,
          3,
          2,
          4,
          4,
          2,
          2,
          2,
          2,
          3
        ]
      },
      {
        "outcome": "DÖÇ5",
        "values": [
          2,
          2,
          3,
          3,
          2,
          2,
          3,
          4,
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
        "status": "Uygun"
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
        "status": "Uygun"
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
    "code": "BİO9XX",
    "name": "UZMANLIK ALAN DERSİ",
    "theory": 4,
    "practice": 0,
    "credit": 0,
    "ects": 5,
    "purpose": "Öğrencinin doktora tez alanındaki güncel ve ileri literatürü eleştirel biçimde sentezlemesini ve özgün araştırmasının kuramsal-yöntemsel temelini geliştirmesini sağlamak.",
    "content": "Doktora tez alanına özgü kuramlar, araştırma boşluğu, yenilikçi yöntemler, ileri veri analizi, bilimsel özgünlük, araştırma etiği ve uluslararası literatüre katkı.",
    "methods": "Bireysel araştırma, ileri makale incelemesi, yöntem geliştirme, veri yorumlama ve akademik tartışma.",
    "stages": [
      "Doktora tez alanının bilimsel kapsamı",
      "Temel ve güncel literatürün eleştirel sınıflandırılması",
      "Kuramsal yaklaşımların sentezlenmesi",
      "Uluslararası literatürde araştırma boşluğunun belirlenmesi",
      "Özgün araştırma sorularının geliştirilmesi",
      "Hipotezlerin bilimsel temellendirilmesi",
      "İleri araştırma desenlerinin karşılaştırılması",
      "Örnekleme stratejisinin değerlendirilmesi",
      "Ölçüm ve gözlem yöntemlerinin geliştirilmesi",
      "Veri kalite ve tekrarlanabilirlik ölçütleri",
      "İleri analiz seçeneklerinin karşılaştırılması",
      "Bulgular için biyolojik yorum çerçevesi",
      "Etik ve biyogüvenlik risklerinin değerlendirilmesi",
      "Özgün katkı ve sınırlılıkların tartışılması",
      "Kuramsal ve yöntemsel çerçevenin bütünleştirilmesi"
    ],
    "department": "Biyoloji ABD",
    "programName": "Biyoloji",
    "language": "Türkçe",
    "level": "Doktora",
    "teachingMode": "Bireysel Çalışma",
    "prerequisites": "Yok",
    "instructor": "Öğrencinin Danışmanı",
    "resources": "Biyoloji alanına özgü güncel hakemli literatür; Enstitü tez yazım ve etik yönergeleri; ders sorumlusunun önerdiği bilimsel kaynaklar.",
    "sdgs": [
      "4",
      "9",
      "15"
    ],
    "outcomes": [
      "Uzmanlık alan dersi kapsamındaki ileri biyolojik kavramları analiz eder.",
      "ileri biyoloji araştırmaları alanındaki bilimsel yaklaşımları karşılaştırır.",
      "Uzmanlık alan dersi için uygun araştırma veya inceleme yöntemini uygular.",
      "Uzmanlık alan dersi verilerini bilimsel ölçütlerle değerlendirir.",
      "Uzmanlık alan dersi bulgularını etik ve biyolojik bağlamda yorumlar."
    ],
    "weeklyTopics": [
      "Doktora tez alanının bilimsel kapsamı",
      "Temel ve güncel literatürün eleştirel sınıflandırılması",
      "Kuramsal yaklaşımların sentezlenmesi",
      "Uluslararası literatürde araştırma boşluğunun belirlenmesi",
      "Özgün araştırma sorularının geliştirilmesi",
      "Hipotezlerin bilimsel temellendirilmesi",
      "İleri araştırma desenlerinin karşılaştırılması",
      "Örnekleme stratejisinin değerlendirilmesi",
      "Ölçüm ve gözlem yöntemlerinin geliştirilmesi",
      "Veri kalite ve tekrarlanabilirlik ölçütleri",
      "İleri analiz seçeneklerinin karşılaştırılması",
      "Bulgular için biyolojik yorum çerçevesi",
      "Etik ve biyogüvenlik risklerinin değerlendirilmesi",
      "Özgün katkı ve sınırlılıkların tartışılması",
      "Kuramsal ve yöntemsel çerçevenin bütünleştirilmesi"
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
        "name": "Ders Süresi",
        "count": 15,
        "hours": 4,
        "total": 60
      },
      {
        "name": "Sınıf Dışı Çalışma Süresi",
        "count": 15,
        "hours": 6,
        "total": 90
      }
    ],
    "contributionMatrix": [
      {
        "outcome": "DÖÇ1",
        "values": [
          4,
          3,
          2,
          2,
          3,
          2,
          4,
          2,
          2,
          2,
          2
        ]
      },
      {
        "outcome": "DÖÇ2",
        "values": [
          3,
          4,
          2,
          2,
          3,
          2,
          4,
          3,
          2,
          2,
          4
        ]
      },
      {
        "outcome": "DÖÇ3",
        "values": [
          3,
          3,
          5,
          5,
          3,
          2,
          3,
          2,
          2,
          2,
          2
        ]
      },
      {
        "outcome": "DÖÇ4",
        "values": [
          3,
          4,
          3,
          2,
          4,
          4,
          2,
          2,
          2,
          2,
          3
        ]
      },
      {
        "outcome": "DÖÇ5",
        "values": [
          2,
          2,
          3,
          3,
          2,
          2,
          3,
          4,
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
        "status": "Uygun"
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
        "status": "Uygun"
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
    "code": "BİO909",
    "name": "SEMİNER",
    "theory": 0,
    "practice": 0,
    "credit": 0,
    "ects": 6,
    "purpose": "Biyoloji alanındaki ileri bir bilimsel problemi eleştirel literatür senteziyle inceleme, akademik metne dönüştürme ve doktora düzeyinde savunma becerisi kazandırmak.",
    "content": "İleri literatür tarama, kanıt değerlendirme, özgün problem, bilimsel metin, bulguların sentezi, akademik tartışma ve bilimsel iletişim.",
    "methods": "Eleştirel literatür incelemesi, bilimsel yazım, akademik sunum, akran değerlendirmesi ve tartışma.",
    "stages": [
      "Seminer konusunun özgünlük ve kapsam bakımından belirlenmesi",
      "İleri araştırma sorusunun geliştirilmesi",
      "Sistematik literatür tarama stratejisinin kurulması",
      "Kaynakların kanıt düzeyi bakımından değerlendirilmesi",
      "Literatürün kavramsal sınıflandırılması",
      "Çelişen biyolojik kanıtların karşılaştırılması",
      "Seminer metninin bilimsel yapısının oluşturulması",
      "Yöntem ve bulguların eleştirel sentezi",
      "Tablo ve görsellerin bilimsel düzenlenmesi",
      "Doktora düzeyinde tartışmanın yapılandırılması",
      "Özgün çıkarımların geliştirilmesi",
      "Atıf ve kaynakça bütünlüğünün denetlenmesi",
      "Akademik anlatım tasarımının geliştirilmesi",
      "Bilimsel savunmanın uygulanması",
      "Geri bildirimle nihai metnin geliştirilmesi"
    ],
    "department": "Biyoloji ABD",
    "programName": "Biyoloji",
    "language": "Türkçe",
    "level": "Doktora",
    "teachingMode": "Bireysel Çalışma",
    "prerequisites": "Yok",
    "instructor": "Öğrencinin Danışmanı",
    "resources": "Biyoloji alanına özgü güncel hakemli literatür; Enstitü tez yazım ve etik yönergeleri; ders sorumlusunun önerdiği bilimsel kaynaklar.",
    "sdgs": [
      "4",
      "9",
      "15"
    ],
    "outcomes": [
      "Seminer kapsamındaki ileri biyolojik kavramları analiz eder.",
      "ileri biyoloji araştırmaları alanındaki bilimsel yaklaşımları karşılaştırır.",
      "Seminer için uygun araştırma veya inceleme yöntemini uygular.",
      "Seminer verilerini bilimsel ölçütlerle değerlendirir.",
      "Seminer bulgularını etik ve biyolojik bağlamda yorumlar."
    ],
    "weeklyTopics": [
      "Seminer konusunun özgünlük ve kapsam bakımından belirlenmesi",
      "İleri araştırma sorusunun geliştirilmesi",
      "Sistematik literatür tarama stratejisinin kurulması",
      "Kaynakların kanıt düzeyi bakımından değerlendirilmesi",
      "Literatürün kavramsal sınıflandırılması",
      "Çelişen biyolojik kanıtların karşılaştırılması",
      "Seminer metninin bilimsel yapısının oluşturulması",
      "Yöntem ve bulguların eleştirel sentezi",
      "Tablo ve görsellerin bilimsel düzenlenmesi",
      "Doktora düzeyinde tartışmanın yapılandırılması",
      "Özgün çıkarımların geliştirilmesi",
      "Atıf ve kaynakça bütünlüğünün denetlenmesi",
      "Akademik anlatım tasarımının geliştirilmesi",
      "Bilimsel savunmanın uygulanması",
      "Geri bildirimle nihai metnin geliştirilmesi"
    ],
    "assessments": [
      {
        "name": "Seminer Metni ve Sunumu",
        "count": 1,
        "weight": 100
      }
    ],
    "workloads": [
      {
        "name": "Ders Süresi",
        "count": 15,
        "hours": 0,
        "total": 0
      },
      {
        "name": "Sınıf Dışı Çalışma Süresi",
        "count": 15,
        "hours": 12,
        "total": 180
      }
    ],
    "contributionMatrix": [
      {
        "outcome": "DÖÇ1",
        "values": [
          4,
          3,
          2,
          2,
          3,
          2,
          4,
          2,
          2,
          2,
          2
        ]
      },
      {
        "outcome": "DÖÇ2",
        "values": [
          3,
          4,
          2,
          2,
          3,
          2,
          4,
          3,
          2,
          2,
          4
        ]
      },
      {
        "outcome": "DÖÇ3",
        "values": [
          3,
          3,
          5,
          5,
          3,
          2,
          3,
          2,
          2,
          2,
          2
        ]
      },
      {
        "outcome": "DÖÇ4",
        "values": [
          3,
          4,
          3,
          2,
          4,
          4,
          2,
          2,
          2,
          2,
          3
        ]
      },
      {
        "outcome": "DÖÇ5",
        "values": [
          2,
          2,
          3,
          3,
          2,
          2,
          3,
          4,
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
        "status": "Uygun"
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
        "status": "Uygun"
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
    "code": "BİO917",
    "name": "DOKTORA YETERLİK",
    "theory": 0,
    "practice": 0,
    "credit": 0,
    "ects": 24,
    "purpose": "Öğrencinin biyolojide ileri bilgi, bilimsel problem çözme, özgün araştırma tasarlama ve bağımsız araştırma yürütme yeterliliğini bütüncül olarak geliştirmek.",
    "content": "İleri biyoloji kuramları, disiplinler arası sentez, özgün problem ve hipotez, yöntem geliştirme, ileri veri analizi, etik, biyogüvenlik ve bilimsel savunma.",
    "methods": "İleri kaynak incelemesi, problem çözümleme, araştırma tasarımı, yazılı ve sözlü bilimsel tartışma.",
    "stages": [
      "Yeterlik kapsamındaki biyoloji alanlarının belirlenmesi",
      "İleri kuramsal bilginin sistematik incelenmesi",
      "Disiplinler arası biyolojik ilişkilerin sentezi",
      "Karmaşık problemlerin bilimsel çözümlemesi",
      "Özgün araştırma sorusu geliştirme",
      "Hipotezlerin eleştirel değerlendirilmesi",
      "Deneysel ve gözlemsel tasarımların karşılaştırılması",
      "İleri yöntem ve araçların seçimi",
      "Veri kalite ve geçerlik ölçütleri",
      "İstatistiksel ve biyoinformatik analiz yaklaşımları",
      "Bulguların biyolojik bağlamda yorumlanması",
      "Bilimsel etik ve araştırma bütünlüğü",
      "Biyogüvenlik ve toplumsal etkilerin değerlendirilmesi",
      "Bilimsel argümanın yazılı yapılandırılması",
      "Bilimsel argümanın sözlü savunulması"
    ],
    "department": "Biyoloji ABD",
    "programName": "Biyoloji",
    "language": "Türkçe",
    "level": "Doktora",
    "teachingMode": "Yüz Yüze",
    "prerequisites": "Yok",
    "instructor": "Öğrencinin Danışmanı",
    "resources": "Biyoloji alanına özgü güncel hakemli literatür; Enstitü tez yazım ve etik yönergeleri; ders sorumlusunun önerdiği bilimsel kaynaklar.",
    "sdgs": [
      "4",
      "9",
      "15"
    ],
    "outcomes": [
      "Doktora yeterlik kapsamındaki ileri biyolojik kavramları analiz eder.",
      "ileri biyoloji araştırmaları alanındaki bilimsel yaklaşımları karşılaştırır.",
      "Doktora yeterlik için uygun araştırma veya inceleme yöntemini uygular.",
      "Doktora yeterlik verilerini bilimsel ölçütlerle değerlendirir.",
      "Doktora yeterlik bulgularını etik ve biyolojik bağlamda yorumlar."
    ],
    "weeklyTopics": [
      "Yeterlik kapsamındaki biyoloji alanlarının belirlenmesi",
      "İleri kuramsal bilginin sistematik incelenmesi",
      "Disiplinler arası biyolojik ilişkilerin sentezi",
      "Karmaşık problemlerin bilimsel çözümlemesi",
      "Özgün araştırma sorusu geliştirme",
      "Hipotezlerin eleştirel değerlendirilmesi",
      "Deneysel ve gözlemsel tasarımların karşılaştırılması",
      "İleri yöntem ve araçların seçimi",
      "Veri kalite ve geçerlik ölçütleri",
      "İstatistiksel ve biyoinformatik analiz yaklaşımları",
      "Bulguların biyolojik bağlamda yorumlanması",
      "Bilimsel etik ve araştırma bütünlüğü",
      "Biyogüvenlik ve toplumsal etkilerin değerlendirilmesi",
      "Bilimsel argümanın yazılı yapılandırılması",
      "Bilimsel argümanın sözlü savunulması"
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
        "hours": 0,
        "total": 0
      },
      {
        "name": "Sınıf Dışı Çalışma Süresi",
        "count": 15,
        "hours": 45,
        "total": 675
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
          3,
          2,
          2,
          3,
          2,
          4,
          2,
          2,
          2,
          2
        ]
      },
      {
        "outcome": "DÖÇ2",
        "values": [
          3,
          4,
          2,
          2,
          3,
          2,
          4,
          3,
          2,
          2,
          4
        ]
      },
      {
        "outcome": "DÖÇ3",
        "values": [
          3,
          3,
          5,
          5,
          3,
          2,
          3,
          2,
          2,
          2,
          2
        ]
      },
      {
        "outcome": "DÖÇ4",
        "values": [
          3,
          4,
          3,
          2,
          4,
          4,
          2,
          2,
          2,
          2,
          3
        ]
      },
      {
        "outcome": "DÖÇ5",
        "values": [
          2,
          2,
          3,
          3,
          2,
          2,
          3,
          4,
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
        "status": "Uygun"
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
        "status": "Uygun"
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
    "code": "BİO91X",
    "name": "TEZ ÇALIŞMASI",
    "theory": 0,
    "practice": 0,
    "credit": 0,
    "ects": 24,
    "purpose": "Öğrencinin biyoloji alanında özgün ve bağımsız bir doktora araştırmasını etik ilkelere uygun biçimde yürütmesi, yayımlaması ve savunmasını sağlamak.",
    "content": "Özgün biyolojik araştırma problemi, ileri literatür sentezi, yöntem geliştirme, etik ve biyogüvenlik, veri üretimi, ileri analiz, bilimsel yayın, tez yazımı ve savunma.",
    "methods": "Bağımsız araştırma, laboratuvar veya saha çalışması, ileri veri analizi, bilimsel yayın hazırlığı ve danışmanlık görüşmesi.",
    "stages": [
      "Özgün araştırma probleminin kesinleştirilmesi",
      "İleri literatür çerçevesinin güncellenmesi",
      "Araştırma amaç ve hipotezlerinin yapılandırılması",
      "Yenilikçi yöntem ve örnekleme planının kesinleştirilmesi",
      "Etik ve biyogüvenlik süreçlerinin tamamlanması",
      "Veri üretim sürecinin planlanması",
      "Araştırma kayıtları ve kalite kontrolünün yürütülmesi",
      "Veri toplama sürecinin izlenmesi",
      "Verilerin düzenlenmesi ve doğrulanması",
      "İleri analizlerin yürütülmesi",
      "Bulguların biyolojik olarak yorumlanması",
      "Özgün katkının literatürle karşılaştırılması",
      "Bilimsel yayın ve tez bölümlerinin yazımı",
      "Tez metninin bütünlük ve etik denetimi",
      "Doktora savunması ve bilimsel katkının sunulması"
    ],
    "department": "Biyoloji ABD",
    "programName": "Biyoloji",
    "language": "Türkçe",
    "level": "Doktora",
    "teachingMode": "Bireysel Çalışma",
    "prerequisites": "Yok",
    "instructor": "Öğrencinin Danışmanı",
    "resources": "Biyoloji alanına özgü güncel hakemli literatür; Enstitü tez yazım ve etik yönergeleri; ders sorumlusunun önerdiği bilimsel kaynaklar.",
    "sdgs": [
      "4",
      "9",
      "15"
    ],
    "outcomes": [
      "Tez çalışması kapsamındaki ileri biyolojik kavramları analiz eder.",
      "ileri biyoloji araştırmaları alanındaki bilimsel yaklaşımları karşılaştırır.",
      "Tez çalışması için uygun araştırma veya inceleme yöntemini uygular.",
      "Tez çalışması verilerini bilimsel ölçütlerle değerlendirir.",
      "Tez çalışması bulgularını etik ve biyolojik bağlamda yorumlar."
    ],
    "weeklyTopics": [
      "Özgün araştırma probleminin kesinleştirilmesi",
      "İleri literatür çerçevesinin güncellenmesi",
      "Araştırma amaç ve hipotezlerinin yapılandırılması",
      "Yenilikçi yöntem ve örnekleme planının kesinleştirilmesi",
      "Etik ve biyogüvenlik süreçlerinin tamamlanması",
      "Veri üretim sürecinin planlanması",
      "Araştırma kayıtları ve kalite kontrolünün yürütülmesi",
      "Veri toplama sürecinin izlenmesi",
      "Verilerin düzenlenmesi ve doğrulanması",
      "İleri analizlerin yürütülmesi",
      "Bulguların biyolojik olarak yorumlanması",
      "Özgün katkının literatürle karşılaştırılması",
      "Bilimsel yayın ve tez bölümlerinin yazımı",
      "Tez metninin bütünlük ve etik denetimi",
      "Doktora savunması ve bilimsel katkının sunulması"
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
        "name": "Ders Süresi",
        "count": 15,
        "hours": 0,
        "total": 0
      },
      {
        "name": "Sınıf Dışı Çalışma Süresi",
        "count": 15,
        "hours": 48,
        "total": 720
      }
    ],
    "contributionMatrix": [
      {
        "outcome": "DÖÇ1",
        "values": [
          4,
          3,
          2,
          2,
          3,
          2,
          4,
          2,
          2,
          2,
          2
        ]
      },
      {
        "outcome": "DÖÇ2",
        "values": [
          3,
          4,
          2,
          2,
          3,
          2,
          4,
          3,
          2,
          2,
          4
        ]
      },
      {
        "outcome": "DÖÇ3",
        "values": [
          3,
          3,
          5,
          5,
          3,
          2,
          3,
          2,
          2,
          2,
          2
        ]
      },
      {
        "outcome": "DÖÇ4",
        "values": [
          3,
          4,
          3,
          2,
          4,
          4,
          2,
          2,
          2,
          2,
          3
        ]
      },
      {
        "outcome": "DÖÇ5",
        "values": [
          2,
          2,
          3,
          3,
          2,
          2,
          3,
          4,
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
        "status": "Uygun"
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
        "status": "Uygun"
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

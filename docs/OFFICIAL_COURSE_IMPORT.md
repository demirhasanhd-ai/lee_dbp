# Resmi ders verisi aktarım notu

Bu projede demo dersler silinmez; yalnızca resmi ders verisi varsa demo verinin önüne geçer.

## Güvenli veri katmanı

- Program/düzey/dönem için resmi ders varsa sistem onu gösterir.
- Resmi ders yoksa mevcut demo ders üretimi çalışmaya devam eder.
- Böylece tasarım, rol/yetki akışı, public görünüm, görüntüle/yazdır bağlantıları bozulmadan yeni programlar parça parça eklenebilir.

## Excel başlık eşlemesi

Örnek `7801` program kodu için:

- `Ders Kodu_7801` → `code`
- `Ders Adı_7801` → `name`
- `Z_7801` → `type` (`Z` = Zorunlu, `S` = Seçmeli)
- `Krd_7801` → `credit`
- `AKTS_7801` → `ects`
- `Teo_7801` → `theory`
- `Uyg_7801` → `practice`
- `D_7801` → `term` (`G` = Güz, `B` = Bahar)
- `Öğretim Elemanı_7801` → `instructor`

Öğretim elemanı boşsa kayıt korunur ve durum `Atama Bekliyor` olarak tutulur.

## Dosya yerleşimi

Ana uygulama resmi ders kaynağı:

- `lib/data/officialCourses.ts`

Local preview resmi ders kaynağı:

- `local-preview/program-data-local.js`

## Public link mantığı

Public ders bilgi paketi linklerinde program kodu ayrıca taşınır:

- `programKodu=7801`
- `ders=ADE701`
- `ad=...`
- `duzey=Tezsiz YL / Tezsiz Yüksek Lisans`

Bu sayede aynı ders kodu başka programlarda tekrar etse bile program kodu ile ayrıştırılabilir.

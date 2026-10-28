# Ders adı ve kodu yönetimi — 28.10.2026

Akademisyen, ders bilgi paketinde ders adı/kodu değiştiremez. Alanlar salt okunurdur; OBS aktarımı da bu alanları değiştirmez. Paket kaydetme API'si, istemcinin gönderdiği ad/kod yerine idari ders kaydındaki kimliği kullanır. Eski paket kimlikleri okunurken güncel idari ad/kod gösterilir; geçmiş sürümlerin JSON içeriği topluca değiştirilmez.

Admin, LEE Öğrenci İşleri ve Enstitü Yöneticisi **Ders Düzenleme → Mevcut Ders** ekranından ders adı/kodu değiştirebilir. Mevcut kayıt kimliği kullanılır. Yalnız değişen alanlar gönderilir; boş eski dönemler ad/kod düzeltmesini engellemez ve kendiliğinden doldurulmaz. Eski atama ekranının gönderdiği `name:null` istekleri adı değiştirmez.

## Mevcut verilerin korunması

- Ders silinip yeniden oluşturulmaz. Kimlik, oluşturulma tarihi, akademik içerik, taslak/yayımlanmış paket JSON'u, hoca ve atama kimlik bilgileri, dönem, onay/yayın durumu korunur. Kullanıcı ayrıca dönem/hoca değiştirmişse yalnız o alanlar da güncellenir.
- Ad/kod değişikliği ve eski kod eşleştirmesi aynı SQLite transaction'ında kaydedilir. Hata veya çakışmada tamamı geri alınır. Başka bir kullanıcı tarafından değiştirilmiş form yeniden kaydedilirse 409 döner.
- Onay taleplerinin hedefi ve komisyon atamaları yeniden yazılmaz. Yeni kod eski onay hedefiyle ilişkilendirilir; bekleyen sürece aynı atamalarla devam edilir.
- Yeni kod altında ders/içerik görünürlüğü mevcut etkin değerlerle korunur. Daha önce kullanılan bir koda dönüldüğünde eski, geçersiz görünürlük tercihi geri gelmez. Programın görünürlük ayarları değiştirilmez.
- Önceki kodlarla ders bağlantıları ve paket/PDF okumaları çalışır. Aynı program ve düzeyde kullanılan veya eski bağlantıya ayrılmış kodla çakışma reddedilir. Toplu yeni ders importu da eski kodu yeniden oluşturamaz.
- Eşleştirme, mevcut `metadata` tablosundaki `course_identity_edits_v1` anahtarında tutulur. Şema değişikliği veya mevcut dersleri dönüştüren yeni bir başlangıç migration'ı yoktur. Mevcut JSON yedekleme/geri yükleme eşleştirmeyi de taşır.
- Başlangıç katalog senkronizasyonu mevcut kayıtları güncellemez; yalnız eksik dersleri ekler. Mevcut ders adı, dönem, hoca, paket veya yayın durumu başlangıç verileriyle ezilmez. İdari kimliği değiştirilmiş dersler mevcut paket seed geçişlerinden de korunur.

## Doğrulama

Testler bellek içi SQLite, yalnız test için oluşturulan geçici veritabanları ve yerel tarayıcı yanıtlarıyla yürütülür. `server.mjs` uygulama olarak başlatılmaz; canlı veritabanı veya harici servis kullanılmaz.

- `npm run build`: başarılı.
- Veri koruma, ad/kod yetkisi, onay süreci, eski bağlantılar, PDF kimliği, yayın görünürlüğü, geri alma, yeniden açma, başlangıç senkronizasyonu, yedekleme ve import testleri başarılı.
- Tarayıcıda akademisyenin salt okunur alanları ve OBS aktarımı; yetkili rolün mevcut ad/kodu düzenlemesi ve değişmeyen dönem/hocayı göndermemesi doğrulandı.
- Genel testlerde bu değişiklikle ilgisiz, mevcut bir tez URL testi başarısız: `tests/thesis-oai-parser.test.mjs:39`, `hdl.handle.net` beklerken mevcut kod `openaccess.osmaniye.edu.tr` adresini döndürüyor. İlgili kaynak ve test dosyası değiştirilmedi.
- Projenin tam TypeScript kontrolünde mevcut veri/model ve Cloudflare tiplerinden kaynaklanan 1076 tanı var; `app/` dosyalarında tanı yok. Değiştirilen sunucu/form/test dosyalarında ESLint hatası yok. `DemoCoursePackage.tsx` ve `RoleDashboard.tsx` dosyalarının önceki sürümlerinde de bulunan lint sorunları ayrı değerlendirilmelidir.

## Canlıya geçiş

Bu çalışma sırasında canlı veritabanı açılmadı, veri importu/reseti yapılmadı ve uygulama yayına alınmadı. Yayına alırken mevcut kalıcı veritabanı yolu ve veri diski korunmalıdır; veritabanı değiştirme, reset veya başlangıç verilerini yeniden yükleme işlemi gerekmez.

## Ders Düzenleme ekranının panel sayfasına taşınması

- Ders Düzenleme artık modal pencere yerine panelin sağ içerik alanında açılır. Sol menüde seçili olarak gösterilir; diğer bir menüye geçildiğinde bu sayfa kapanır.
- Yeni Ders, Mevcut Ders ve Liste ile Atama Yap sekmeleri ayrı kartlar olarak düzenlendi. Seçili sekme belirgindir; klavye okları/Home/End tuşları desteklenir. Dar ekranlarda sekmeler ve form alanları alt alta yerleşir.
- Açık ve koyu tema, mobil başlık ve yan menü yerleşimi kontrol edildi. Sayfa doğal olarak kayar; modal yüksekliği veya iç içe kaydırma alanı kullanılmaz.
- Kayıt sonrası sayfada sonuç mesajı gösterilir. Kod değişince güncellenen ders seçili kalır; katalog yenilenirken dönem/hoca alanlarının boş kalması önlendi.
- Bu görünüm düzenlemesinde sunucu, veritabanı, şema ve başlangıç veri dosyaları değiştirilmedi. Yetki kapsamı ve kayıt API'leri korunur.
- `npm run build` başarılı; 15 tarayıcı testi ve 29 ilgili veri/kimlik/import/panel testi geçti. Değişen arayüz dosyalarında ESLint hatası yok; RoleDashboard'ın önceden bulunan üç uyarısı sürüyor.
- Görsel kontroller: `local-volume/course-management/desktop.png`, `desktop-dark.png`, `mobile.png`. Tarayıcı testleri üç yetkili rolü ve yalnız yerel test yanıtlarını kullanır; canlıya yazılmaz.

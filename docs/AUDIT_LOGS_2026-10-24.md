# Denetim Kayıtları

Admin panelindeki **Denetim Kayıtları** modülü kullanıcı, işlem anındaki rol, Türkiye saatiyle tarih, ders/program/birim, işlem ve sonuç bilgilerini gösterir. Diğer rollerin ekran ve API erişimi kapalıdır; yetki matrisinden başka bir role açılamaz.

## Kapsam

- DBP oturumunun ilk kullanımı, panel girişi, modül görüntüleme ve e-Enstitüye dönüş.
- Ders paketini görüntüleme/kaydetme/onaya gönderme, komisyon veya ABD onayı, düzeltmeye gönderme, yayımlama ve adminin resen durum değiştirmesi.
- Ders oluşturma, atama, dönem düzeltme, toplu işlem önizlemesi/uygulaması, komisyon ve program bilgileri, yayın görünürlüğü, rol ve modül yetkileri.
- Yedekleme, JSON dışa aktarma, içe aktarma, geri yükleme, sıfırlama, veri ve gösterge yenilemeleri.
- Başarısız istekler ve erişim reddi; doğrulanmış oturum varsa kullanıcı ve rol, yoksa kimliği doğrulanmamış olay olarak.
- Doğrulanmış oturum çereziyle açılan HTML sayfaları ve PDF/Excel/CSV dosyaları. Ön yüklemeler ve RSC istekleri sayılmaz. Tarayıcının kapanışı güvenilir bir çıkış olayı değildir; mevcut e-Enstitüye dönüş bağlantısı ayrı olaydır.

Ders içerikleri ve alanların eski/yeni değerleri kaydedilmez. İzleme katmanı istek gövdelerinden yalnız ders/program kimliği, durum, yönlendirme, açıklama ve işlem özetini seçer; içerik paketi, yüklenen dosya ve oturum imzasını kayda kopyalamaz.

Mevcut `audit_logs` tablosu korunur. Yeni kimlik/rol/istek/sonuç bilgileri `payload_json._audit` içinde saklanır. Önceki kayıtların tutulmamış bilgileri **Kayıtlı değil** görünür. Mevcut iş akışı kayıtlarının tutulması devam eder.

## Kullanım

Tarih, kullanıcı, rol, işlem, sonuç, ABD/ASD, ders kodu ve serbest arama filtreleri birlikte kullanılabilir. Türkçe arama büyük/küçük harf ve aksan farklarına duyarlı değildir. Liste ve zaman çizelgesi aynı filtreleri kullanır. Ayrıntı penceresinde açıklama, süreç yönü, istek bilgisi, IP ve kimlik kaynağı incelenebilir.

CSV ve Excel indirmeleri yalnız ekrandaki sayfayı değil uygulanan filtrelerin bütün sonuçlarını içerir. Tek indirme sınırı 50.000 kayıttır; sınır aşılırsa kullanıcıdan filtreyi daraltması istenir, kayıtlar sessizce kesilmez. CSV UTF-8 BOM ve noktalı virgül ayırıcı kullanır; formül olarak yorumlanabilecek hücreler etkisizleştirilir. Excel mevcut uygulama XLSX üreticisini kullanır. İndirme işlemi, biçimi, kayıt sayısı ve kullanılan filtreler de kaydedilir.

Sayfalama ve indirme, listenin alındığı andaki kayıt üst sınırını paylaşır. Bu sırada yeni kayıtların oluşması veya adminin listeyi görüntülemesinin kaydedilmesi, sayfalar arasında satırların kaymasına yol açmaz. **Yenile**, filtre uygulama ve filtre temizleme yeni kayıtları da listeye alır.

## Oturum doğrulaması

e-Enstitü tarafından doğrulanmış geçiş oturumuna sunucu HMAC imzası eklenir. API, istemcinin bildirdiği değiştirilmiş kullanıcı/rol bilgisini kabul etmez; imza ve süreyi doğrular. İlk API kullanımından sonra HttpOnly, SameSite=Lax bir DBP çerezi de oluşturulur. HTTPS ortamında Secure niteliği kullanılır.

İmza anahtarı isteğe bağlı `DBP_SESSION_SECRET` ortam değişkeninden veya kalıcı `DBP_DATA_DIR/.session-secret` dosyasından alınır. Dosya otomatik üretilir, Git'e ve JSON veri yedeğine girmez. Renderer ve API aynı kalıcı veri dizinini kullanmalıdır. Anahtar değişirse kullanıcılar e-Enstitü üzerinden yeniden giriş yapar. Güncelleme öncesindeki imzasız üretim oturumları da yeniden giriş gerektirir.

İmzasız geliştirme oturumu yalnız `DBP_LOCAL_DEV=1`, doğrudan loopback bağlantısı ve localhost hedefi birlikte sağlanırsa kabul edilir; kayıtta **Yerel geliştirme oturumu** olarak belirtilir.

## Sıfırlama ve yedek

İstenen mevcut davranış korunmuştur: sıfırlama denetim kayıtlarını da siler, ardından sıfırlama olayını yazar. Genel JSON dışa aktarımı/yedekleme denetim kayıtlarını içerir; geri yükleme bu kayıtları ayrıntılarıyla geri getirir. Uygulama verisini sıfırlamak veya yeniden seed yüklemek gerekmez. Başlangıçta yalnız sorgu indeksleri eklenir.

## Doğrulama

`tests/audit-trail.test.mjs` bellek içi SQLite ile kimlik/rol değiştirme girişimlerini, admin sınırını, eşzamanlı kullanıcıların ayrılmasını, içerik kaydedilmemesini, Türkiye tarih sınırlarını, filtreleri, indirmeleri ve gerçek dışa aktarma/sıfırlama/geri yükleme fonksiyonlarını test eder.

`tests/public-browser.test.mjs` içindeki denetim senaryosu filtreleme, sayfalama, ayrıntı/ESC, zaman çizelgesi, tam CSV/Excel indirme, boş sonuç ve mobil genişliği doğrular. Tarayıcı testleri yalnız test verileri kullanır; canlı veritabanını veya e-Enstitü servisini açmaz.

Son doğrulama: üretim derlemesi başarılı; bütün test paketi **265/265** geçti. Yeni denetim modülü dosyaları ve testleri ESLint kontrolünde hatasızdır. Denetim paneli ve SSO dosyasının bağımsız strict TypeScript kontrolü de geçti. Proje genelindeki TypeScript kontrolünde mevcut ders verisi `CoursePackage` alanları ve Cloudflare türleriyle ilgili hatalar bulunuyor; bu kontrol bütünüyle temiz değildir. Değişen dosyaların proje tanıları içinde yeni tip hatası görülmedi.

Yerel doğrulama çıktıları: `local-volume/audit-module/build.log`, `full-tests.log`, `desktop.png`, `mobile.png` ve `timeline-dark.png`. Bu dosyalar test verisi içerir ve Git dışında tutulur.

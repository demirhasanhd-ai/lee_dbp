# SQLite yedekleri

Veri Tabanı Yönetimi ekranında JSON ve SQLite için ayrı kartlar bulunur.
JSON içe/dışa aktarma desteği korunur. JSON listesinde bakım raporları yerine
uygulamanın dışa aktarma başlığını taşıyan dosyalar gösterilir.

SQLite kartındaki işlemler:

- **Yedek Al:** `DBP_BACKUP_DIR` altında tarihli, benzersiz `.sqlite` dosyası oluşturur.
- **SQLite İndir:** güncel veritabanının geçici bir SQLite yedeğini indirir;
  bu dosya kalıcı yedek listesine eklenmez, indirme akışı kapanınca temizlenir.
- **Dosyadan Yükle:** en fazla 512 MiB büyüklüğünde bağımsız bir SQLite dosyasını
  yükler, doğrular ve mevcut veritabanına geri yükler.
- **Yedeği İndir / Geri Yükle / Yedeği Sil:** yalnız SQLite listesindeki seçimi kullanır.

Yedekleme, `node:sqlite` Backup API ile yapılır. Kaynak bağlantısının WAL'daki
güncel verileri de kapsanır. Oluşturulan yedekler, yardımcı WAL/SHM dosyalarına
ihtiyaç duymayan tek dosya olarak saklanır. Yedek; JSON dışa aktarma listesine
bağlı olmadan bütün veritabanını, indeksleri ve tetikleyicileri içerir.
Veritabanı dışında tutulan dosyalar ve oturum imzalama anahtarı bu yedeğin
parçası değildir; volume'un tamamının yedeği ayrıca alınmalıdır.

Geri yüklemeden önce SQLite başlığı, `integrity_check`, yabancı anahtarlar,
sayfa boyutu ve mevcut uygulamanın tablo/indeks/tetikleyici tanımları kontrol edilir.
Uyumsuz eski sürüm yedekleri otomatik dönüştürülmez; hata gösterilir ve mevcut
veritabanı korunur. Devam eden istatistik/veri yenileme işi varsa işlem reddedilir;
iş bittikten sonra tekrar denenebilir.

Doğrulama geçince `dbp-before-restore-*.sqlite` güvenlik yedeği oluşturulur.
Güvenlik yedeği ve geri yükleme arasında uygulamanın JavaScript yazıcıları
bekler. Geri yükleme, yardımcı Node sürecinde SQLite Backup API'nin hedef
işlemiyle yapılır; sunucunun açık bağlantısı kapatılmaz ve dosya elle kopyalanmaz.
Bellekteki veritabanına bağlı önbellekler yenilenir. İşlemler mevcut admin
yetkisiyle sınırlandırılır ve denetim kayıtlarına `format: "sqlite"` bilgisiyle yazılır.

Doğrulama komutları:

```sh
node --test tests/sqlite-backups.test.mjs tests/sqlite-backup-api.test.mjs tests/audit-trail.test.mjs
npm run build
node --test tests/database-admin-browser.test.mjs
```

Testler geçici veritabanları veya sahte tarayıcı yanıtları kullanır; canlı
veritabanı açılmaz. Docker imajı `lib/` dizinini zaten içerdiği için yeni
yardımcı modüller mevcut paketleme akışına dahildir.

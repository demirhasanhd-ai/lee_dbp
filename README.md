# lee_dbp

LEE Ders Bilgi Paketi; akademisyenlerin Bologna bilgilerini hazırladığı, koordinatörlerin incelediği ve onaylı ders bilgilerinin public yayımlandığı bağımsız uygulamadır.

## Adlandırma

- Yerel proje: `D:\\Documents\\ENSTİTÜ\\LEE_DBP`
- GitHub deposu: `lee_dbp`
- Public alan adı: `dbp.osmaniye.edu.tr`
- Üst Bologna portalı: `bologna.universite.edu.tr`

## Temel ilke

e-Enstitü ile dosya veya veritabanı paylaşılmaz. Gerekli akademisyen, program ve ders referansları salt okunur API ile eşitlenir.

## Yerel çalışma

Windows'ta projeyi çift tıklayarak açmak için:

```text
web_run_home-UA.bat
```

Program gerekli bağımlılıkları kontrol eder, LEE DBP'yi `http://localhost:8081/dbp/` adresinde geliştirme modunda başlatır ve varsayılan tarayıcıyı otomatik açar. React, metin ve CSS değişiklikleri kaydedilince Vite üzerinden tarayıcıya otomatik yansır; her değişiklikte build veya F5 gerekmez. API/sunucu kodu değişikliklerinde Node izleyicisi sunucuyu yeniden başlatır. `8081` portu e-Enstitü'nün `8080` portuyla çakışmaması için seçilmiştir. Mevcut `local-volume/data/dbp.sqlite` ve API uçları kullanılmaya devam eder.

Eski üretim sunucusu açıksa ilk geçişte onun penceresini Ctrl+C ile kapatıp başlatıcıyı yeniden açın. Başlatıcı eski modu algılarsa sessizce eski sunucuyu kullanmak yerine bu bilgiyi gösterir.

Komut satırından çalıştırmak için:

```bash
npm run dev
```

Yerelde üretim derlemesini kontrol etmek için `npm run start:local:production` kullanılır. Üretim dağıtımı `npm run build` ve `npm start` ile aynı şekilde devam eder; geliştirme sunucusu `dist` çıktısını kullanmaz veya değiştirmez.

## Testler

Node.js 24 veya üzeri ile ilk kurulumda:

```bash
npm ci
npm run test:browser:install
npm test
```

Linux CI ortamında Chromium sistem bağımlılıkları da gerekiyorsa `npx playwright install --with-deps chromium` kullanılabilir. `npm test` build sonrası tüm birim, HTML ve Chromium testlerini çalıştırır. Yalnız birim testleri için `npm run test:unit` kullanılır; bu komut tarayıcı veya build gerektirmez.

Tarayıcı testleri yalnız `127.0.0.1` üzerinde geçici bir sunucu ve bellek içi SQLite test verileri kullanır. API istekleri test içinde karşılanır, dış adresler engellenir. Üretim `server.mjs` dosyası test sunucusu olarak başlatılmaz; test sunucusu `.env` dosyası yüklemez ve `DBP_SQLITE_PATH` ile belirtilen canlı veri dosyalarını açmaz. Playwright geliştirme bağımlılığıdır ve üretim imajının `npm ci --omit=dev` kurulumuna dahil edilmez.

Veri koruma testleri taslak, komisyon/ABD onayı bekleyen ve yayımlanmış paketlerin seed güncellemelerinden etkilenmediğini; yayımlanan sürümle yeni taslağın birlikte saklandığını; başlangıç paket migrasyonunun öğretim elemanı ve onay geçmişini koruduğunu doğrular. Dağıtımda mevcut `DBP_DATA_DIR` / `DBP_SQLITE_PATH` ve bağlı veri volume’u korunmalıdır; bu test düzeltmeleri veri sıfırlama, içe aktarma veya yeni seed yükleme gerektirmez.

## Ders ve kalite istatistiklerinin yenilenmesi

Ders listesi, öğretim elemanı ataması ve yayımlanan paket içeriği sonraki istekte güncel veritabanı kaydından okunur. Taslak kaydı, onaya gönderme, komisyon/ABD onayı, yeni ders oluşturma, tekli/toplu atama ve görünürlük kaydı toplu istatistik hesabı başlatmaz.

Ana sayfa istatistikleri ile enstitü/program kalite göstergeleri her gün Türkiye saatiyle (`Europe/Istanbul`) 03.00'te yenilenir. Saat `DBP_HOME_STATS_CACHE_WARMUP_HOUR` ile değiştirilebilir. Kalite anlık görüntüsü veritabanında saklanır; sunucu yeniden başladığında 24 saatten genç görüntü yeniden hesaplanmadan kullanılır. Eksik görüntü ilk kullanımda hazırlanır. Süresi dolmuş veriler arka planda yenilenirken önceki değerler sunulmaya devam eder; eşzamanlı yenilemeler aynı hesabı paylaşır.

Yönetici panelindeki elle kalite yenileme ve veri içe aktarma/geri yükleme/sıfırlama/seed işlemleri istisna olarak yeniden hesaplama başlatır. Ana sayfa cache geçerlilik süresi `DBP_HOME_STATS_CACHE_TTL_MS` ile ayarlanabilir (varsayılan 24 saat; `0` cache'i kapatır). İşlem sonrası 30 saniyelik warmup kaldırıldığı için `DBP_HOME_STATS_CACHE_WARMUP_DEBOUNCE_MS` artık kullanılmaz. Tez, öğrenci ve bibliyometri kaynaklarının güncelleme takvimleri bağımsızdır.

## Ana sayfa ziyaret sayımı

Ana sayfanın başarılı HTML açılışı aynı tarayıcı oturumunda bir kez sayılır. Ana sayfayı yenilemek, ders kataloğu için ana sayfadaki bölüme gitmek veya diğer sayfalardan geri dönmek bu sayacı artırmaz. Ders, ABD/ASD ve gösterge sayfaları kendi kategorilerinde görüntülenme olarak sayılmaya devam eder. Doğrudan bir alt sayfaya girilmesi ana sayfa ziyareti oluşturmaz.

Oturum kimliği `HttpOnly` ve `SameSite=Lax` nitelikli bir oturum çerezinde tutulur; sabit ömürlü kalıcı çerez kullanılmaz. Aynı oturumun ana sayfa olayı mevcut benzersiz `event_uuid` alanıyla tekilleştirilir; sunucu yeniden başlasa da tekrar sayılmaz. Bu metrik aynı kişinin farklı cihazlarını tek kişiye indiren bir kişi sayacı değildir.

API/arka plan istekleri, RSC, ön yüklemeler, bilinen tarayıcı botları, sağlık kontrolleri, HEAD ve başarısız/HTML olmayan yanıtlar görüntülenme sayılmaz. Docker sağlık kontrolü ana sayfa yerine `/dbp/api/dbp/health` adresini kullanır. Oturum çerezi taşıyan ana sayfa yanıtları paylaşılan önbelleğe alınmaz.

Geçmiş olaylar ve aylık özetler otomatik silinmez veya yeniden yazılmaz; önceki şişmiş kayıtlar korunur. Yeni kural sürüm yayınlandıktan sonraki ziyaretlere uygulanır. Veritabanı şeması veya migration gerekmez.

## Excel ile toplu yeni ders ekleme

**Ders Düzenleme → Yeni Ders** sekmesinde ABD/ASD, program ve düzey seçildikten sonra **Excel ile Toplu Yeni Ders** alanı kullanılabilir. **Boş Şablon** düğmesi ders kodu/adı, dönem, zorunlu-seçmeli, teorik/uygulama, kredi, AKTS ve danışman T.C./unvan/isim/e-posta sütunlarını içeren `.xlsx` dosyasını indirir. Program seçimi dosyanın tüm satırları için geçerlidir. Dönem ve ders bilgileri zorunludur; danışman bilgileri boş bırakılabilir ve bu dersler **Atama bekliyor** görünür. T.C. ve ders kodu alanları Excel'de metin biçimindedir.

Yükleme en fazla 1000 ders satırı ve 5 MB dosya içindir. **Önizle** kayıt değiştirmez; yeni, mevcut ve hatalı satırları gösterir. **Yeni Dersi Ekle** yalnız geçerli yeni dersleri taslak olarak ekler. Mevcut dersler ve hatalı/tekrarlanan satırlar atlanır. Kaydetme sırasında kayıtlar yeniden kontrol edilir; aynı dosyanın tekrar yüklenmesi mevcut dersleri değiştirmez. İşlem tek veritabanı transaction'ında yürür; hata olursa o işlemin eklemeleri geri alınır. Mevcut ders paketleri, onay durumları ve öğretim elemanı atamaları korunur. Ders oluşturma istatistik warmup'ı başlatmaz.

Bu özellik şema/migration, veritabanı sıfırlama veya seed yüklemesi gerektirmez. Şablon `public/yeni-ders-sablonu.xlsx` dosyasından build çıktısına dahil edilir; üretimde ek Excel kütüphanesi gerekmez.

## Canlı Scopus ortam değişkenleri

Bibliyometrik Göstergeler sayfasının canlı sunucuda veri çekebilmesi için dağıtım ortamında aşağıdaki sunucu değişkenleri tanımlanır. API anahtarı repoya veya istemci koduna yazılmaz.

```ini
SCOPUS_API_KEY=...
SCOPUS_AFFILIATION_ID=60088374
SCOPUS_INSTTOKEN=...
```

`SCOPUS_API_KEY` zorunludur. `SCOPUS_INSTTOKEN` yalnız kurum aboneliği bunu gerektiriyorsa tanımlanır.

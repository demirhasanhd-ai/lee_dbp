# Test düzeltmeleri ve veri koruma doğrulaması

Tarih: 16 Ekim 2026. [İlk inceleme raporundaki](F:/WEB_PROJELER/DBP_HD/docs/TEST_LINT_INCELEME_2026-10-16.md) 35 başarısız test ve iki lint hatası giderildi. Canlıya dağıtım yapılmadı.

## Sonuç

| Kontrol | Sonuç |
|---|---|
| `npm test` — build ve tüm test dosyaları | **212 başarılı, 0 başarısız, 0 atlanan** |
| Son build | Başarılı |
| Değişen uygulama, sunucu ve test dosyalarının ESLint denetimi | **0 hata** |
| Kalan ESLint uyarıları | Önceden bulunan 3 kullanılmayan fonksiyon |
| 12 seed / şema / migration kaynak dosyasının SHA-256 karşılaştırması | Build öncesiyle aynı |
| Canlı veritabanı / dağıtım | Erişim veya dağıtım yapılmadı |

## Düzeltilen testler

- API’den yüklenen ders listeleri ve paket içerikleri artık Chromium içinde, veri yüklemesi tamamlandıktan sonra kontrol ediliyor. İlk HTML testleri ayrı kalıyor.
- Paket tabloları, haftalar ve mevcut 11 PÇ içeren katkı matrisi gerçek DOM’da doğrulanıyor. Aynı DÖÇ etiketinin farklı tablolarda görünmesi yanlış sayılmıyor.
- Türkçe ders adları görünür içerikte, Türkçe büyük/küçük harf dönüşümüyle karşılaştırılıyor. Script içeriği bu kontrole dahil edilmiyor.
- Eski bağlantı, ekran metni ve SQL yazımı beklentileri güncel davranışa uyarlandı.
- Bibliyometri test verisine gerçekçi tez kimlikleri ve yayın–tez ilişkileri eklendi; tez kohortları ile yayın yılları ayrı doğrulanıyor.
- Scopus testi takip edilmeyen `.env.example` dosyasını okumuyor. Takip edilen dokümantasyon ve uygulamanın ortam değişkeni sözleşmesi kontrol ediliyor. Sunucudaki gerçek anahtar değiştirilmedi veya okunmadı.
- Standart `npm test` komutuna bütün birim testleri ve yeni tarayıcı kontrolleri dahil edildi.
- DC / DIM istekleri, sayfalama ve önceden saklanmış ilgisiz tez kayıtlarının korunması sahte HTTP yanıtlarıyla test ediliyor.

## Tarayıcı kontrollerinin ortaya çıkardığı iki gösterim hatası

1. **BES801 kapsamı:** Kodun Tarih/Türk Dili programlarında ortak ders olması, Arkeoloji’de de ortak sayılmasına neden oluyordu. Gruplama artık bölüm bağlamını dikkate alıyor. Arkeoloji’de BES801 güz, BES802 bahar bölümünde kalıyor; Tarih’te ortak ders davranışı korunuyor. Liste ve XLSX çıktısı aynı kuralı kullanıyor.
2. **Kısa bağlantılarda düzey:** `/dbp/ybs/dr` için sunucunun seçtiği doktora düzeyi, eski bir effect tarafından tezsiz düzeye çevrilebiliyordu. Başlangıç seçimi sunucudan alınarak korunuyor. Program/düzey değişiminde ilgili profil yeniden başlatılıp kendi API verisini yüklüyor. Doktora, tezli ve tezsiz kısa bağlantıları ile profil geçişi tarayıcıda doğrulandı.

Bu değişiklikler kamuya açık gösterimi etkiler; ders kayıtlarını, öğretim elemanı atamalarını veya onay durumlarını değiştiren yeni bir veritabanı işlemi eklemez.

## Veri koruma sınırı ve kanıtları

- Üretim `server.mjs` dosyası test sunucusu olarak başlatılmadı. Canlı veritabanı açılmadı; gerçek kullanıcı kaydı okunup yazılmadı.
- Tarayıcı testleri `127.0.0.1` üzerinde geçici bir port, ayrı Chromium bağlamları ve `:memory:` SQLite kullanıyor. API yanıtları test içinde karşılanıyor; dış adresler engelleniyor ve API isteklerinin GET olması zorunlu tutuluyor.
- Dosya tabanlı kalıcılık kontrolü yalnız testin oluşturduğu geçici SQLite dosyasında yapılıyor.
- Seed güncelleme sorguları; taslak, komisyon onayı bekleyen, ABD onayı bekleyen ve yayımlanmış kayıtlar üzerinde denendi. Kaydedilmiş paket JSON’u, durum ve güncelleme zamanı korunuyor. Yeni taslakla eski yayımlanmış sürümün birlikte bulunduğu durum da kapsanıyor.
- Başlangıç paket migrasyonu iki kez çalıştırıldı. Ders içerikleri, öğretim elemanları, süreç durumları, iş akışı geçmişi ve komisyon görevlendirmeleri değişmedi.
- Uygulamanın şema, migration dosyaları ve seed girdileri değiştirilmedi. Build’in yeniden ürettiği seed çıktısı dahil 12 dosyanın içeriği hash karşılaştırmasıyla aynı bulundu.
- Bu aşamada sunucu kodundaki iki `module` döngü değişkeni yeniden adlandırıldı; ilgili SQL ve yetkilendirme işlemlerinin anlamı korunuyor. Önceki günlük cache düzenlemeleri korunuyor.

Bu doğrulamalar düzeltmelerin veri koruma davranışını test ortamında sınar. Canlı sunucunun disk/volume yapılandırmasını denetlemiş veya canlı veritabanını yedeklemiş sayılmaz. Dağıtımda mevcut `DBP_DATA_DIR`, `DBP_SQLITE_PATH` ve veri volume’u aynen korunmalıdır. Bu düzeltmeler reset, restore, import veya seed yükleme gerektirmez.

## Testlerin çalıştırılması

```bash
npm ci
npm run test:browser:install
npm test
```

Yalnız birim testleri: `npm run test:unit`. Linux CI’da Chromium sistem bağımlılıkları için gerektiğinde `npx playwright install --with-deps chromium` kullanılır. Playwright yalnız geliştirme bağımlılığıdır; üretimdeki `npm ci --omit=dev` kurulumuna dahil olmaz.

Yerel tam çıktı: [final-npm-test.log](F:/WEB_PROJELER/DBP_HD/local-volume/test-failure-audit/final-npm-test.log). Bu dosya Git dışında tutulur; doğrulama özeti bu raporda kalıcıdır.

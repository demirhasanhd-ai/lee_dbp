# Taslak ders kaynaklarındaki OBS metinlerinin temizlenmesi

Bakım aracı `dbp-backup-2026-11-18T14-30-35-527Z.json` yedeğinde incelenen **647 ders** için hazırlanmıştır. Hedef kayıtlar ve 17 kaynak şablonu `lib/data/draft-resource-obs-cleanup-2026-11-18.json` içinde sabittir.

Yeni kaynak metni:

> Ders alanına ilişkin güncel kitaplar, hakemli makaleler ve ilgili diğer bilimsel kaynaklar. Kesin kaynak listesi dersi veren öğretim elemanı tarafından eklenmelidir.

Yalnız hem ana durumu hem varsa paket durumu tam olarak `Taslak` olan hedefler işlenir. Ana durumu Taslak olup paket içinde komisyon/ABD onayı bekleyen 32 kayıt listeye alınmamıştır. Diğer yayımlanmış, incelemede, onay bekleyen ve düzeltme istenen kayıtlar kapsam dışıdır. Kaynakçası yazılmış dersler veya listede bulunmayan yeni dersler değiştirilmez.

Her hedefin ID'si, akademik yılı, ABD'si, programı, düzeyi, kodu, adı, son güncelleme zamanı ve bütün paket metninin SHA-256 değeri yeniden kontrol edilir. İnceleme sonrası değişen kayıtlar atlanır ve nedenleri raporlanır. `published` paketi korunur. Yalnız mevcut `detailFields.resources` ve varsa `fields["Ders Kaynakları"]` alanları değiştirilir. Diğer ders sütunları, paket alanları, zaman damgaları ve iş akışı kayıtları korunur.

## Çalıştırma

Uygulama Node.js 24+ kullanır. Bu araç sunucuyu başlatmaz, ortam dosyalarını yüklemez ve başlangıç verisi aktarması yapmaz. `lib/` klasörü mevcut Dockerfile tarafından çalışma imajına dahil edilir. Uygulama başlarken otomatik çalışmaz; bakım komutu ayrıca çalıştırılır.

İncelenen JSON yedeği üzerinde salt okunur önizleme:

```powershell
node lib/draftResourceObsCleanup.mjs --from-backup "D:\HDD\WEB_PROJELER\Web_Yedekler\dbp-backup-2026-11-18T14-30-35-527Z.json"
```

Sunucuda gerçek kalıcı veritabanı yolu kullanılarak önce önizleme:

```sh
node /app/lib/draftResourceObsCleanup.mjs --db /app/data/dbp.sqlite
```

Ardından uygulama:

```sh
node /app/lib/draftResourceObsCleanup.mjs --db /app/data/dbp.sqlite --apply
```

Docker kullanılıyorsa komutlar doğru DBP konteynerinde `docker exec KONTEYNER_ADI ...` ile çalıştırılır. `/app/data/dbp.sqlite` bu projenin Dockerfile varsayılanıdır; dağıtımda farklı bir kalıcı yol tanımlıysa o yol kullanılmalıdır.

`--apply` olmadan veritabanı salt okunur açılır; yedek veya rapor dosyası oluşturulmaz. `--apply` ile, değiştirilecek kayıt varsa:

1. Veritabanının `backups/` klasörüne SQLite yedekleme API'siyle tutarlı bir `.sqlite` yedeği alınır.
2. `BEGIN IMMEDIATE` içinde güncel kayıtlar yeniden denetlenir ve kaynak alanları güncellenir.
3. Değişen kayıtların tam eski/yeni paket JSON'ları ve atlananların nedenleri bir `.json` geri dönüş raporuna yazılır. Rapor yazılamazsa bütün değişiklikler geri alınır.
4. Tek `course.package.migrate` denetim kaydıyla işlem tamamlanır. Rapor durumu `committed` olarak güncellenir. `prepared` durumu, sonucun raporlanması tamamlanmadan kesinti olduğunu gösterir; güncel paketlerle karşılaştırılmalıdır.

Yedek/rapor klasörü `--report-dir /kalici/klasor` ile değiştirilebilir. Çıktı dosyaların tam yollarını gösterir. Önceden değiştirilen kaynaklar ikinci çalıştırmada `already-updated` olarak atlanır; tekrar audit kaydı eklenmez.

## Geri dönüş

Rapor her değişen kaydın `beforePackageJson` ve `afterPackageJson` değerlerini içerir. Seçici geri dönüşte yalnız güncel paket hâlâ `afterPackageJson` ile aynı ve kayıt/paket hâlâ Taslak ise eski paket kullanılmalıdır; işlem sonrası öğretim elemanı değişiklikleri üzerine yazılmamalıdır. Tam SQLite yedeğini geri yüklemek, yedekten sonra yapılan başka işlemleri de geri alır; bu nedenle seçici geri dönüş tercih edilir.

Bu bakım çalışması canlı veritabanına bağlanmayı veya dağıtımı kendiliğinden yapmaz. Yedek JSON dosyası hiçbir modda değiştirilmez.

## Doğrulama

İncelenen yedeğin 118.768 satır içeren ayrı bir SQLite kopyasında gerçek CLI önizleme ve uygulama modları çalıştırıldı. 647 dersin 651 kaynak alanı değişti; diğer 2.613 ders ve derslerin kaynak dışındaki tüm alanları aynı kaldı. Diğer tablolar korundu; yalnız bir bakım denetim kaydı eklendi. İşlem öncesi SQLite yedeği yedekteki bütün tablolarla, geri dönüş raporundaki 647 eski/yeni paket de işlem öncesi/sonrası kayıtlarla karşılaştırıldı. Her iki SQLite dosyasının `quick_check` sonucu `ok`. İkinci uygulama 0 değişiklik yaptı. Özgün JSON yedeğinin SHA-256 değeri korundu.

`node --test tests/draft-resource-obs-cleanup.test.mjs tests/course-package-persistence.test.mjs` ile 9 test geçti. Bunlar iki durum kontrolünü, güncel kaynakça eklenen kayıtların korunmasını, yayımlanmış sürümün korunmasını, liste dışındaki dersleri, işlem geri almayı ve tekrar çalıştırmayı kapsar. Yeni JavaScript dosyaları ESLint kontrolünden geçti. Canlı veritabanında uygulama bu doğrulamadan ayrı bir adımdır.

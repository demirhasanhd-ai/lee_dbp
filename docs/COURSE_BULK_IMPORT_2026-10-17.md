# Excel ile toplu yeni ders — 17.10.2026

## Kullanım

1. **Ders Düzenleme → Yeni Ders** sekmesinde ABD/ASD, program ve düzey seçilir.
2. **Excel ile Toplu Yeni Ders → Boş Şablon** ile dosya indirilir. Her satır seçili program/düzeyde bir dersi temsil eder.
3. Ders kodu, adı, dönem, zorunlu/seçmeli, teorik, uygulama, kredi ve AKTS doldurulur. Dönem seçenekleri Güz, Bahar ve Güz ve Bahar'dır.
4. Danışman T.C., unvan, isim ve e-posta isteğe bağlıdır. Danışman bilgileri tamamen boşsa ders atamasız kaydedilir; ekranlar **Atama bekliyor** gösterir. Diğer danışman alanları girilmişse isim de gereklidir.
5. Dosya yüklenip **Önizle** seçilir. Yeni, mevcut ve hatalı satırlar gösterilir. Önizleme veritabanına yazmaz.
6. **… Yeni Dersi Ekle** geçerli yeni satırları taslak olarak ekler. En fazla 1000 ders ve 5 MB dosya desteklenir.

Excel'de dönem ve zorunlu/seçmeli açılır listeleri vardır. Kimlik ve ders kodu sütunları metin biçimindedir. Tekli ders ekleme ve Liste ile Atama Yap sekmesi korunmuştur.

## Veri koruması

- Mevcut kayıtlar güncellenmez veya silinmez. Öğretim elemanı, kaydedilmiş paket, onay durumu ve komisyon kayıtları korunur.
- Aynı kodun boşluklu/boşluksuz yazımları aynı program ve düzeyde mevcut ders sayılır. Dosya içi tekrarlanan kodlar hata olarak gösterilir.
- Kaydetme, dosyayı istemciden gelen önizleme satırlarına güvenmeden yeniden okur ve doğrular.
- `BEGIN IMMEDIATE` içinde güncel kayıtlar tekrar kontrol edilir; önizleme sonrasında başka kullanıcı aynı dersi eklemişse o satır atlanır. Dosyanın tekrar yüklenmesi mevcut dersleri değiştirmez.
- Veritabanı hatasında bu işlemin tüm eklemeleri geri alınır.
- Yeni dersler `Taslak` ve boş paketle oluşturulur. İstatistik/kalite warmup'ı tetiklenmez.
- Canlı veritabanı açılmadı. Yayına alma, şema/migration, seed veya veri sıfırlama işlemi yapılmadı.

## Doğrulama

- Build başarılı; indirilebilir şablon dağıtım dosyasına aynı içerikle kopyalandı.
- Genel testler: **227 geçti, 0 başarısız, 0 atlanan**.
- 7 API/dosya testi: doğrulamalar, tekrar yükleme, eşzamanlı ekleme, transaction rollback, veri koruması ve önceki atama şablonunun uyumluluğu.
- 1 tarayıcı testi: şablon indirme, gerçek API mantığına bağlı bellek içi veritabanında önizleme ve ekleme, boş danışman, mevcut/hatalı satırların atlanması ve mobil taşma kontrolü.
- Değişen form, sunucu ve test dosyalarının lint kontrolünde hata yok; sunucudaki önceki üç kullanılmayan fonksiyon uyarısı duruyor.
- Şema, migration ve seed dosyalarının 12 korunan SHA-256 değeri değişmedi. `git diff --check` ve sunucu sözdizimi kontrolü başarılı.
- Şablon Artifact Tool ile üretildi; kaydedilmiş dosyanın başlıkları, boş satırları, hücre biçimleri, açılır listeleri ve sabit başlığı bağımsız olarak kontrol edildi. Artifact Tool görsel oluşturucusu Vulkan hatası verdiğinden dosyanın kayıtlı değer ve stillerinden oluşturulan tarayıcı önizlemesi incelendi. Microsoft Excel üzerinde doğrudan çalıştırma yapılmadı.

Testler üretim `server.mjs` dosyasını başlatmaz; geçici yerel tarayıcı sunucusu ve bellek içi SQLite kullanır. Yeni bir üretim Excel bağımlılığı eklenmedi; şablon statik dosyadır.

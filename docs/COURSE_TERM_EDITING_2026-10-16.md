# Ders dönemi düzenleme — 16.10.2026

Yeni ders oluşturma API'si `courses.term` alanına boş değer yazıyordu. Genel ders listesi boş dönemi Güz kabul ettiği için yeni Bahar dersleri de Güz bölümünde görünüyordu.

## Değişiklikler

- Menü ve pencere başlığı **Ders Düzenleme**, sekmeler **Yeni Ders** ve **Mevcut Ders** oldu.
- Yeni derste **Güz**, **Bahar**, **Güz ve Bahar** seçeneklerinden biri zorunludur; varsayılan dönem atanmaz. Sunucu da eksik/geçersiz dönemi reddeder.
- Mevcut ders seçilince kayıtlı dönem ve öğretim elemanı gösterilir. Dönemi boş eski kayıtlar kullanıcıdan seçim ister.
- Yalnızca dönem değiştirildiğinde istemci öğretim elemanı alanlarını göndermez; sunucu yalnız `term` ve `updated_at` alanlarını günceller. Öğretim elemanı kimliği, e-posta, atama kaynağı ve atama tarihi korunur.
- Önceki yalnız hoca atayan API istekleri dönem göndermeden çalışmaya devam eder ve dönemi korur.
- Enstitü Yöneticisi, LEE Öğrenci İşleri ve Admin rolleri menüyü kullanabilir. Aynı pencerenin toplu atama API'leri de Enstitü Yöneticisine açıldı. Diğer rollerin erişimi genişletilmedi.
- Enstitü Yöneticisinin mevcut varsayılan `my_courses` erişimi kullanılır; kayıtlı özel yetki matrisi değiştirilmez.
- Dönem değişikliği istatistik/kalite warmup'ı tetiklemez. Genel ders listesi sonraki istekte güncel dönemi kullanır.

## Doğrulama

- `npm run build`: başarılı.
- `node scripts/run-tests.mjs`: **218 geçti, 0 başarısız, 0 atlanan**.
- Sonradan eklenen Matematik genel ders listesi testi ayrıca çalıştırıldı: **1 geçti**. Toplam **219 farklı test** başarıyla doğrulandı.
- Yeni 5 API testi bellek içi SQLite ile dönem doğrulamasını, yetkileri, öğretim elemanı bilgilerinin korunmasını, paket/onay kayıtlarının ve diğer derslerin değişmemesini doğrular.
- Yeni panel tarayıcı testi gerçek formu kullanır; tüm API istekleri yerel test yanıtlarıyla karşılanır. Canlı uygulamaya yazma yapılmaz.
- Matematik liste testi Güz → Bahar → Güz ve Bahar geçişinde liste gruplarını doğrular.
- Değişen form, API ve test dosyalarının lint kontrolünde hata yoktur; sunucudaki mevcut üç kullanılmayan fonksiyon uyarısı korunmuştur.
- `RoleDashboard.tsx` için ayrıca kontrol edildi: mevcut oturum yükleme effect'inde 1 lint hatası ve 3 uyarı vardır. `git show HEAD:app/panel/RoleDashboard.tsx` çıktısı aynı ESLint ayarlarıyla kontrol edilerek bunların bu değişiklikten önce de bulunduğu doğrulandı. Bu dosyada yalnız menü adı ve ders düzenleyebilen roller değişti.
- `node --check server.mjs` ve `git diff --check`: başarılı.
- Şema, migration ve seed dosyalarından oluşan 12 korunan dosyanın SHA-256 değerleri önceki doğrulanmış değerlerle aynıdır.

## Canlı veriler

Canlı veritabanı açılmadı ve yayına alma yapılmadı. Bu özellik için veritabanı migration'ı, reset, import veya seed yenilemesi gerekmez. Mevcut veritabanı yolu ve kalıcı veri diski korunmalıdır.

MAT864, MAT866 ve MAT868 dahil mevcut dersler kendiliğinden değiştirilmez. Yeni sürüm yayınlandıktan sonra **Ders Düzenleme → Mevcut Ders → Matematik ABD → Matematik / Tezli Yüksek Lisans** üzerinden ders seçilip **Bahar** kaydedilebilir. Bu işlem dersin paketini veya onay durumunu değiştirmez.

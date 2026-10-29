# ÖBS Bologna araması ve içerik aktarımı

Ders düzenleyicisindeki **OBS'den Doldur** düğmesi iki yöntem sunar:

- **ÖBS’de ara:** ders kodu/adıyla seçilen ÖBS programının müfredatlarını tarar.
- **Bağlantıyla getir:** mevcut `progCourseDetails.aspx?curCourse=…` bağlantısını okuyarak aynı ayrıntılı önizlemeyi açar.

Bu özellik yalnızca kamuya açık ÖBS Bologna sayfalarını okur. Proliz REST erişimi, yeni bir anahtar veya E_Enstitu/BOLOGNA_WEB uygulamalarında değişiklik gerektirmez.

## Arama

Program listesi öğrenim düzeyine göre alınır. Program adı ve tezli/tezsiz ayrımı tek bir karşılık veriyorsa program otomatik seçilir; belirsizlikte kullanıcı seçer. Kullanıcı düzeyi, programı, ders kodunu ve adını değiştirebilir.

Müfredat seçimi ASP.NET formunun güncel gizli alanları ve oturum çerezleriyle yapılır. Ders detay adresi güncel sayfalardaki `prolizOpenCourseDetails(id)` tıklama bilgisinden çıkarılır. Eski postback/yönlendirme yöntemi de desteklenir. Listede görünen fakat detayında kayıt bulunmayan dersler tarama notlarında gösterilir.

Adaylar program + müfredat + ÖBS ders kimliğiyle ayrılır. Önce ders kodu eşleşmesi, ardından öğretim elemanının adının sayfada geçmesi, müfredat yılı ve güncelleme tarihi dikkate alınır. Adın sayfada bulunması dönemlik görevlendirme olarak sunulmaz. Ders adındaki Roma rakamları ve sayılar benzer ad aramasında korunur.

## Önizleme ve aktarım

Önizleme genel bilgileri, amaç/içerik/yöntemi, öğrenme çıktılarını, haftaları, değerlendirmeyi, iş yükünü, kaynakları, ders yapısını ve ÖÇ–PÇ matrisini gösterir. Önizleme veya pencereyi kapatma ders formunu ve kayıtlı kaynak bilgisini değiştirmez.

**Boş Alanları Doldur** mevcut aktarım kurallarını kullanır. **Tümünü Değiştir** için kullanıcı mevcut içeriğin değiştirilmesini önizleme ekranında onaylar. Dersin idari kodu ve adı korunur. Formun ayrıca taslak olarak kaydedilmesi veya onaya gönderilmesi gerekir.

Katkı matrisi varsayılan olarak aktarılmaz. Kaynakta 11 PÇ sütunu ve öğrenme çıktılarıyla aynı sayıda matris satırı varsa, kullanıcı PÇ metinlerini karşılaştırdığını belirterek matris aktarımını seçebilir. Boş alan aktarımı mevcut dolu matrisi korur. Kaynak URL, program, müfredat, kaynak güncelleme tarihi ve aktarım zamanı paketle birlikte saklanır.

## İşletim sınırları

- Program listeleri, müfredat indeksleri ve okunabilen paketler süreç belleğinde 30 dakika saklanır. **Yeniden tara** müfredat ve ders detay önbelleğini atlar.
- Tarama işleri yalnızca işi başlatan doğrulanmış oturum tarafından okunabilir/iptal edilebilir. Her kullanıcı için tek, uygulama sürecinde en fazla dört etkin tarama vardır.
- Bir arama en fazla 40 müfredat ve 60 eşleşen kaydı inceler. Sınır aşımı ve kısmi erişim hataları kullanıcıya bildirilir.
- Tek istek 20 saniye, toplam tarama 5 dakika ile sınırlıdır. Tarama işleri 15 dakika sonra temizlenir. Sunucu yeniden başlarsa tarama yeniden başlatılmalıdır.
- ÖBS HTML yapısı değişirse ayrıştırıcıların güncellenmesi gerekebilir. Dış adresler ve ÖBS dışına yönlendirmeler kabul edilmez.

## Kontroller

`node --test tests/obs-bologna.test.mjs` ayrıştırma, müfredat seçimi, önbellek, kısmi sonuç, eski bağlantı yöntemi ve oturum sınırlarını kontrol eder.

Üretim derlemesinden sonra `node --test tests/obs-import-browser.test.mjs` arama, masaüstü/mobil önizleme, aktarım onayı, matris seçimi ve kaynak bilgisinin korunmasını gerçek tarayıcıda kontrol eder. Testler kayıtlı uygulama verisini değiştirmez.

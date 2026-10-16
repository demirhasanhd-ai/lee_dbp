# Test ve lint inceleme raporu

Bu belge düzeltme öncesi bulguları kaydeder. Tamamlanan çalışma ve veri koruma sonuçları: [Düzeltme doğrulama raporu](F:/WEB_PROJELER/DBP_HD/docs/TEST_FIX_VALIDATION_2026-10-16.md).

Tarih: 16 Ekim 2026. Kapsam: önceki doğrulamada başarısız olan 35 genel test ve server.mjs içindeki 2 lint hatası. Bu incelemede uygulama kodu ve asıl test dosyaları değiştirilmedi. Önceki cache çalışmasındaki değişiklikler korundu.

## Sonuç

35 başarısız testin her biri incelendi. Başarısız kontroller, mevcut veri yükleme biçimiyle uyuşmayan test yaklaşımına, eski URL/metin/kaynak kodu beklentilerine, eski API test verisine ve Git dışında kalan bir ortam dosyasına ayrılıyor. Bu bulgular 35 ayrı uygulama arızasını kanıtlamıyor. Buna karşılık mevcut testlerin önemli bir bölümü tarayıcıda verinin gerçekten yüklenmesini doğrulayamadığı için uygulamanın bütün akışlarının sağlıklı olduğu sonucuna da varılamaz.

| Kategori | Başarısız test | Değerlendirme |
|---|---:|---|
| A1. Ders listesini API yüklenmeden ilk HTML’de arama | 18 | Test yöntemi mevcut istemci veri yüklemesine uymuyor |
| A2. Paket içeriğini yayın kontrolü tamamlanmadan ilk HTML’de arama | 9 | Test yöntemi mevcut yayın kontrolüne uymuyor; bir testte ek URL beklentisi de var |
| B. Eski query parametreli bağlantıyı zorunlu tutma | 1 | Güncel kısa URL doğru program/düzeye gidiyor |
| C. Eski kaynak kodu, ekran metni veya markup beklentisi | 5 | Uygulama ile test beklentisi ayrışmış; bazıları ürün tercihiyle netleştirilmeli |
| D. Güncel API sözleşmesine uymayan test verisi | 1 | Test gerekli tez kayıtlarını ve ilişkileri göndermiyor |
| E. Takip edilmeyen yerel ortam dosyasına bağımlılık | 1 | Test farklı bilgisayarlarda farklı sonuç verebilir |
| **Toplam** | **35** | |

Sayım test bazındadır. Bir testin birden fazla başarısız kontrolü olabilir. Özellikle A2 grubundaki “every merged YBS process package keeps the program sidebar” testi hem paket yükleme hem eski URL beklentilerinden etkileniyor.

## Doğrulama yöntemi ve sonuçları

- Mevcut build ile 174 genel test yeniden çalıştırıldı: **139 geçti, 35 başarısız**. Başarısız test adları önceki raporla aynı.
- rendered-html dışındaki tüm test dosyaları çalıştırıldı: **29 testin tamamı geçti**. Bunlar paket kalıcılığı, iş yükü/değerlendirme, cache, panel hook sırası, tez puanlama, yayın istatistikleri, OAI ayrıştırma ve tez-yayın eşleştirmesini kapsıyor.
- Önceki çalışma sırasında build başarıyla tamamlanmıştı. Bu inceleme build’i değiştirmedi; mevcut üretilmiş çıktıyla yapıldı.
- İlk başarısız kontrolün sonrasındaki beklentiler, yalnız tanılama amacıyla oluşturulan ayrı bir test kopyasında hata toplayarak incelendi. Bu kopyada hatalara devam edilmesi, testlerin geçmiş sayıldığı anlamına gelmez; normal test sonucu yukarıdaki 139/35’tir.
- Ana sayfa, YBS paket sayfası, YBS doktora ders listesi ve Aile Danışmanlığı tezsiz ders listesi ayrıca render edilerek gerçek ilk HTML incelendi.
- Lint kuralının yerel kaynak kodu okundu. Hata verilen iki rol yetkilendirme fonksiyonu ayrıca bellek içi SQLite ile çalıştırıldı.
- Canlı sunucuda değişiklik, dış kaynaklardan veri toplama veya gerçek kullanıcı verisine yazma yapılmadı. Tarayıcıda hydration ve canlı API ile uçtan uca doğrulama bu incelemede yapılmadı.

## A1 — 18 ders listesi testi neden başarısız?

[Program sayfası](F:/WEB_PROJELER/DBP_HD/app/programlar/[slug]/page.tsx:23) dersleri boş diziyle başlatıyor. [ProgramCourses](F:/WEB_PROJELER/DBP_HD/app/programlar/[slug]/ProgramCourses.tsx:275), bileşen tarayıcıda açıldıktan sonra useEffect içinde /api/dbp/courses isteğini yapıyor ve dönen derslerle listeyi oluşturuyor.

[Testteki render yardımcısı](F:/WEB_PROJELER/DBP_HD/tests/rendered-html.test.mjs:15) dist/server/index.js dosyasını doğrudan çağırıyor ve yalnız HTML yanıtını okuyor. Tarayıcı JavaScript’ini çalıştırmıyor, useEffect’i işletmiyor ve Node sunucusundaki server.mjs API zincirini uçtan uca kurmuyor.

Doğrudan gözlem: YBS doktora ve Aile Danışmanlığı tezsiz program sayfaları HTTP 200 dönüyor; ilk HTML’de “Ders listesi veritabanından yükleniyor” yazıyor. Ders satırı henüz yok. Test ise bu aşamada YBS9XX, DAN8XX, ADE7XX veya “Ortak / Süreç Dersleri” başlığını arıyor.

Etkilenen alanlar: YBS doktora, Makine tezli YL, Arkeoloji tezli YL ve 15 tezsiz program listesi. Her program ayrı bir arızaya işaret etmiyor; aynı test yaklaşımı farklı programlarda tekrar ediyor.

Sonuç: Derslerin veritabanında kaybolduğu veya kanonik kod birleştirmenin bozulduğu kanıtlanmış değil. API verisi geldikten sonraki listeyi ölçen bir kontrol gerekiyor. Salt ilk HTML’de “yükleniyor” beklemek, derslerin gerçekten doğru geldiğini doğrulamaya yetmez.

## A2 — 9 paket testi neden başarısız?

[DemoCoursePackage](F:/WEB_PROJELER/DBP_HD/app/katalog/DemoCoursePackage.tsx:146) başlangıçta saved=null tutuyor. Dersin tam program kimliği varsa, yayımlanan içeriği /api/dbp/course-package?public=1 üzerinden sorguluyor. [Yayın kontrolü tamamlanmadan](F:/WEB_PROJELER/DBP_HD/app/katalog/DemoCoursePackage.tsx:178) haftalık plan, Bloom tablosu, iş yükü veya DÖÇ–PÇ matrisi gösterilmiyor.

Doğrudan gözlem: YBS921 sayfası HTTP 200 dönüyor ve doğru ABD yan menüsünü oluşturuyor; içerikte “Ders bilgi paketi hazırlanıyor / Yayın durumu kontrol ediliyor” var. Bu aşamada hafta tablosu sayısı 0. Testlerin 15 hafta, 5 DÖÇ satırı ve 180 saat araması bu nedenle başarısız.

Bu, yayın kontrolünü atlayıp statik paketi göstermemiz gerektiği anlamına gelmiyor. Taslak içeriğin kamuya açılmaması için mevcut kontrol korunmalı. Doğru test, kontrollü bir yayımlanmış paket yanıtı sağladıktan sonra içerik tablolarını doğrulamalı; yayımlanmamış paket için de gizleme davranışını ayrıca kontrol etmeli.

Ek test verisi sorunu: “YBS common course aliases…” testinin URL’sinde bolum=yonetim-bilisim-sistemleri ve program=doktora kullanılıyor. Güncel sorgu gerçek ABD adı, program adı ve ayrı düzey alanını bekliyor. Tarayıcı testine geçilirken bu kimlik verileri de düzeltilmeli; yalnız bekleme eklemek yeterli olmayabilir.

## B — Eski URL beklentisi

[Test](F:/WEB_PROJELER/DBP_HD/tests/rendered-html.test.mjs:290), yan menüde programKey=… ve duzey=Doktora metinlerini arıyor. Ancak [programViewHref](F:/WEB_PROJELER/DBP_HD/lib/data/programNavigation.ts:35) ve [publicProgramHref](F:/WEB_PROJELER/DBP_HD/lib/data/publicRoutes.ts:76) uygun programlarda kısa adres üretiyor.

Gözlenen güncel adresler: /dbp/ybs/dr ve /dbp/ybs/dr?sekme=courses#program-dersleri. Yan menü başlığı Yönetim Bilişim Sistemleri ABD. Yani doğru bağlam mevcut; test eski URL’nin iç yazımını zorunlu tutuyor. Aynı beklenti ek listedeki 11. testte de bulunuyor.

İlerideki kontrol, URL’nin doğru program ve düzeyi açmasını ölçmeli. Eski bağlantılara geriye dönük destek ayrı bir test konusu olarak korunabilir.

## C — 5 kaynak/metin beklentisi

### C1. OAI-PMH / DIM

[Test](F:/WEB_PROJELER/DBP_HD/tests/rendered-html.test.mjs:99) kaynakta metadataPrefix parametresinin doğrudan dim sabitiyle atanmasını arıyor. [Gerçek kod](F:/WEB_PROJELER/DBP_HD/lib/thesisSdg.mjs:214), parametreyi harvestFormat(metadataPrefix) yardımcısından alıyor ve oai_dc ile dim için iki ayrı çağrı yapıyor. Fonksiyonel davranış kaynak regex’inin varsaydığı yazım biçiminden farklı. Tanılama kopyasında bu testin diğer kontrolleri geçti.

Bu başarısızlık DIM desteğinin kalktığını göstermiyor. Daha sağlam kontrol, sahte HTTP yanıtlarıyla iki formatın da istenmesini ve kayıtların birleştirilmesini doğrulamak olur. Gerçek DSpace servisine bu incelemede istek yapılmadı.

### C2. Tez performans ekranının başlıkları

[Test](F:/WEB_PROJELER/DBP_HD/tests/rendered-html.test.mjs:150) beş eski metni bekliyor. [Güncel ekran](F:/WEB_PROJELER/DBP_HD/app/article/tez/page.tsx:138) örneğin “Yıllara göre yayınlar” yerine “Yıllara göre tez kaynaklı yayınlar”, “Bilim alanlarına göre yayın dağılımı” yerine “Fen, Sosyal ve Sağlık Bilimleri yayın sayıları” kullanıyor. SCImago kontrolü de büyük/küçük harf duyarlı; kaynakta SCIMAGO var.

Ekran artık dönüşüm oranı, tez kohortları, indeksler ve yayın performansı bölümleri içeriyor. Eski metinleri uygulamaya geri eklemek teknik bir gereklilik değil. İstenen ürün içeriği güncel ekran ise test bu sözleşmeye uyarlanmalı; eski metinler özellikle isteniyorsa bu ayrı bir ürün kararıdır.

### C3. Paket iş akışında somut SQL metni

[Test](F:/WEB_PROJELER/DBP_HD/tests/rendered-html.test.mjs:488) kaynakta SET status = 'Taslak' ifadesini arıyor. Güncel paket saklama modeli published/draft ayrımı ve parametreli SQL kullanıyor. Aynı testin diğer kaynak kontrolleri tanılama kopyasında geçti. İki ayrı kalıcılık testi de yayımlanan içerikle taslağın korunmasını doğruluyor.

Yalnız testi geçirmek için başlangıçta paketleri taslağa çeviren SQL eklemek doğru olmaz. Kayıtların yeniden açılışta korunması ve kamuya yalnız yayımlanan sürümün verilmesi davranış üzerinden sınanmalı.

### C4. Ana sayfa title

[Test](F:/WEB_PROJELER/DBP_HD/tests/rendered-html.test.mjs:1118) LEE Ders Bilgi Paketi | LEE DBP bekliyor. [Layout](F:/WEB_PROJELER/DBP_HD/app/layout.tsx:5) ve gerçek HTML LEE Bilgi Sistemi üretiyor; ana başlık da aynı adla uyumlu. HTTP 200 ve diğer ana sayfa kontrolleri geçti.

Bu bir başlık beklentisi farkıdır. Hangi marka metninin kullanılacağına karar verilmeli; test hatası tek başına sayfanın çalışmadığı anlamına gelmez.

### C5. Kalite ekranında unvan bazlı ders yükü

[Test](F:/WEB_PROJELER/DBP_HD/tests/rendered-html.test.mjs:2114), panelin kaynakta isInstitute koşuluyla çevrilmesini bekliyor. [Güncel ekran](F:/WEB_PROJELER/DBP_HD/app/kalite/page.tsx:220) hem enstitü hem seçili program kapsamında unvan bazlı toplulaştırılmış değerleri gösteriyor; metni kapsama göre değiştiriyor. Kaynakta kişi adı veya e-posta gösteren bir liste yok. Tanılama kopyasında testin kalan kontrolleri geçti.

Bu panelin yalnız enstitüde görünmesi özellikle isteniyorsa uygulama davranışı ayrıca değiştirilebilir. Mevcut iki kapsamlı gösterim isteniyorsa eski koşul beklentisi güncellenmeli.

## D — Sayısal test: puanlamadan önce veri sözleşmesi uyuşmazlığı

[Testin](F:/WEB_PROJELER/DBP_HD/tests/rendered-html.test.mjs:182) adı faaliyet katsayısı ve EK-2 rubrik sınırlarını içeriyor. Bu testte katsayı, faaliyet puanı, kriter sayısı, faaliyet üst sınırı ve jüri rubriği kontrolleri geçiyor. İlk hata, en sonda çağrılan publicThesisBibliometrics sonucunun yılları kontrol edilirken oluşuyor.

[İşlev](F:/WEB_PROJELER/DBP_HD/lib/thesisBibliometrics.mjs:259) artık yayımları theses dizisindeki gerçek tezlerle thesis_identifier üzerinden ilişkilendiriyor. Eski test ne theses dizisini ne bu bağlantı kimliklerini gönderiyor. Dolayısıyla eşleşen yayın kalmıyor; yayın toplamları 0 oluyor. yearly artık tez kohortlarını ve yayına dönüşümü temsil ediyor; eski testte beklenen cumulative alanı yok. Yayın yılları yearlyPublications alanında sunuluyor.

Kontrollü deneyde aynı üç yayın satırı üç tez kaydına bağlandı: tekil yayın 2, yüksek lisans yayın sayısı 1, doktora yayın sayısı 2 elde edildi. Bu, eski testin verisi güncel sözleşmeye bağlandığında beklenen yayın toplamlarının üretildiğini gösteriyor. Ayrı tez puanlama ve yayın istatistiği testleri de geçti.

Öneri: Tek testte puanlama ile bibliyometriyi birleştirmek yerine bağımsız kontroller; açık tez kimlikleri ve sabit tarihli test verileri kullanılmalı. Mevcut başarısızlık EK-2 puan hesabında bir arıza kanıtı değildir.

## E — Scopus testinin yerel dosyaya bağımlılığı

[Test](F:/WEB_PROJELER/DBP_HD/tests/rendered-html.test.mjs:233) .env.example içinde SCOPUS_API_KEY= satırı arıyor. Çalışma alanındaki dosya bu satırı içermiyor. Daha önemlisi git ls-files çıktısında dosya yok; git check-ignore sonucu dosyanın yok sayıldığını gösteriyor. Temiz bir checkout’ta bu test dosya bulunamadı hatasına da dönüşebilir.

Bu sonuç canlı sunucuda gerçek API anahtarının eksik olduğunu söylemez. Gerçek anahtarların değerleri incelenmedi. Uygulama SCOPUS_API_KEY’i ortamdan okuyor; README gerekli değişkenleri zaten açıklıyor.

Karar önerisi: Ya gizli değer içermeyen bir örnek yapılandırma dosyası sürüm kontrolüne açıkça alınmalı ya da test yerel dosya yerine takip edilen dokümantasyon/yapılandırma sözleşmesini sınamalı. Gerçek anahtar test veya rapora konulmamalı.

## İki lint hatası

| Konum | Kural | Gerçek neden | Çalışma zamanı bulgusu |
|---|---|---|---|
| [seedDefaultRoleAccess](F:/WEB_PROJELER/DBP_HD/server.mjs:5334) | @next/next/no-assign-module-variable | Döngü değişkeninin adı module | Blok kapsamında yerel değişken; fonksiyon bellek içi SQLite ile çalıştı |
| [replaceRoleAccess](F:/WEB_PROJELER/DBP_HD/server.mjs:5413) | @next/next/no-assign-module-variable | Aynı değişken adı | Yetki kaydı güncellendi; yeniden seed sonrası yönetici tercihi korundu |

Yerel ESLint kuralı, module adlı her değişken bildirimini raporluyor; gerçekten CommonJS module nesnesine yazıldığını analiz etmiyor. Bu .mjs dosyasında yerel const değişkenleri söz konusu. Node çalıştırma hatası üretmediler. Kurala uygun çözüm, ileride yalnız değişken adını örneğin moduleKey yapmak olur; SQL’deki module kolonunun adı değiştirilmemeli ve kuralı kapatmaya ihtiyaç yok.

Ayrıca 3 uyarı var: readEnvValue (455), displayLevelFromProgramName (1275), publicThesisPublicationRows (7325) kullanılmıyor. Bunlar 2 hata sayısına dahil değil. İki lint hatası daha önce denetlenen dosya grubunun/server.mjs çıktısıdır; bu rapor tüm depoda yalnızca iki lint hatası olduğunu iddia etmez.

## Test düzenindeki somut boşluklar

1. [npm test](F:/WEB_PROJELER/DBP_HD/package.json:14), build’den sonra yalnız rendered-html.test.mjs dosyasını çalıştırıyor. Bu incelemede geçen diğer 29 test standart komuta dahil değil.
2. Derslerin hiç yüklenmediği ilk HTML’de “eski kod görünmüyor” gibi olumsuz kontroller kolayca geçebiliyor. Bu, kanonik birleştirme veya taslak gizleme davranışının gerçekten sınandığı anlamına gelmiyor.
3. Kaynak regex’leri işlev aynı kalırken yardımcı fonksiyona taşıma, değişken kullanma veya başlık değiştirme nedeniyle kırılabiliyor.
4. Asıl açık, tarayıcıda API yanıtından sonra liste ve yayımlanan paketin oluşmasının doğrulanmaması. Bu 35 hatanın düzeltilmesinde yalnız beklentileri gevşetmek yeterli değildir.

## Önerilen sıra — henüz uygulanmadı

1. Test sözleşmesini netleştirmek: ilk HTML’de yükleme görünümü; API sonrası güncel liste/yayımlanan paket; yayımlanmamış pakette içerik gizleme. İstenen davranış bu ise üretim ekranlarını statik seed’e döndürmeden test altyapısı uyarlanmalı.
2. İlişkili tez verileriyle bibliyometri testlerini güncellemek; puanlama kontrollerini ayrı tutmak. Standart test komutuna birim testleri de katmak.
3. Eski URL ve kaynak kodu beklentilerini davranış kontrollerine dönüştürmek; marka başlığı ve kalite panelinin kapsamını ürün tercihi olarak netleştirmek.
4. Örnek ortam dosyasının takip edilmesi konusunda karar verip Scopus testini taşınabilir yapmak.
5. İki module değişkenini yeniden adlandırmak. Kullanılmayan fonksiyon uyarılarını ihtiyaç doğrulandıktan sonra ayrı değerlendirmek.

## Ek — 35 testin tamamı

| No | Başarısız test ve konumu | Grup | Açıklama |
|---|---|---|---|
| 1 | [TEZ_SKA canlı OAI-PMH anlık görüntüsünü kullanır ve çeyreklik takvimi korur](F:/WEB_PROJELER/DBP_HD/tests/rendered-html.test.mjs:99) | C — Kaynak/metin beklentisi | DIM istek parametresi artık yardımcı fonksiyonun argümanından geliyor. |
| 2 | [Lisansüstü tez tabanlı göstergeler yayın kırılımlarını ve admin rubriğini ayırır](F:/WEB_PROJELER/DBP_HD/tests/rendered-html.test.mjs:150) | C — Kaynak/metin beklentisi | Yeni tez performans ekranının başlıkları ve SCIMAGO yazımı farklı. |
| 3 | [tez faaliyet katsayısı ve EK-2 rubrik sınırları doğru hesaplanır](F:/WEB_PROJELER/DBP_HD/tests/rendered-html.test.mjs:182) | D — Eski API test verisi | Tez kayıtları ve thesis_identifier bağlantıları gönderilmiyor; yearly alanının anlamı değişti. |
| 4 | [Scopus bibliyometrisi yayınları çeyreklik, atıfları haftalık günceller](F:/WEB_PROJELER/DBP_HD/tests/rendered-html.test.mjs:233) | E — Yerel ortam dosyası | .env.example takip edilmiyor ve yerel dosyada SCOPUS_API_KEY örneği yok. |
| 5 | [course package sidebar resolves the YBS doctorate context](F:/WEB_PROJELER/DBP_HD/tests/rendered-html.test.mjs:290) | B — Eski bağlantı beklentisi | Yan menü doğru bağlamda /dbp/ybs/dr adresi üretiyor; eski query parametreleri aranmamalı. |
| 6 | [YBS common course aliases keep their code and share the complete package](F:/WEB_PROJELER/DBP_HD/tests/rendered-html.test.mjs:318) | A2 — İlk HTML / paket | İlk HTML paket yükleme durumudur; ayrıca bolum/program değerleri gerçek kimlik biçiminde değil. |
| 7 | [YBS doctorate public catalog contains one canonical record per repeated process course](F:/WEB_PROJELER/DBP_HD/tests/rendered-html.test.mjs:342) | A1 — İlk HTML / ders listesi | Sunucunun ilk HTML’inde veri yerine yükleniyor durumu var; useEffect çalıştırılmıyor. |
| 8 | [Makine tezli YL ortak dersleri tekilleştirilmiş kanonik kodlarla listelenir](F:/WEB_PROJELER/DBP_HD/tests/rendered-html.test.mjs:354) | A1 — İlk HTML / ders listesi | Sunucunun ilk HTML’inde veri yerine yükleniyor durumu var; useEffect çalıştırılmıyor. |
| 9 | [Makine ortak ders paketleri 15 hafta, 1-5 matris ve AKTS iş yükü içerir; iç kontrol publicte görünmez](F:/WEB_PROJELER/DBP_HD/tests/rendered-html.test.mjs:366) | A2 — İlk HTML / paket | Sunucunun ilk HTML’inde yayın kontrolü sürüyor; API sonucu ve tarayıcı render’ı beklenmiyor. |
| 10 | [course editing and public display use the persisted package workflow](F:/WEB_PROJELER/DBP_HD/tests/rendered-html.test.mjs:488) | C — Kaynak/metin beklentisi | Test somut SQL metni arıyor; sürümlü yayın/taslak modeli farklı SQL kullanıyor. |
| 11 | [every merged YBS process package keeps the program sidebar](F:/WEB_PROJELER/DBP_HD/tests/rendered-html.test.mjs:511) | A2 — İlk HTML / paket | Paket içeriği API sonrası gelir; aynı testte eski bağlantı beklentileri de var. |
| 12 | [previous YBS doctorate academic packages keep the complete public structure](F:/WEB_PROJELER/DBP_HD/tests/rendered-html.test.mjs:532) | A2 — İlk HTML / paket | Sunucunun ilk HTML’inde yayın kontrolü sürüyor; API sonucu ve tarayıcı render’ı beklenmiyor. |
| 13 | [all handoff 15 YBS courses render uniform workload totals without the internal checklist](F:/WEB_PROJELER/DBP_HD/tests/rendered-html.test.mjs:551) | A2 — İlk HTML / paket | Sunucunun ilk HTML’inde yayın kontrolü sürüyor; API sonucu ve tarayıcı render’ı beklenmiyor. |
| 14 | [all handoff 15-2 YBS courses render 15 weeks and uniform workload totals](F:/WEB_PROJELER/DBP_HD/tests/rendered-html.test.mjs:572) | A2 — İlk HTML / paket | Sunucunun ilk HTML’inde yayın kontrolü sürüyor; API sonucu ve tarayıcı render’ı beklenmiyor. |
| 15 | [all handoff 15-3 YBS courses render 15 weeks and uniform workload totals](F:/WEB_PROJELER/DBP_HD/tests/rendered-html.test.mjs:593) | A2 — İlk HTML / paket | Sunucunun ilk HTML’inde yayın kontrolü sürüyor; API sonucu ve tarayıcı render’ı beklenmiyor. |
| 16 | [handoff 15-1 Makine courses render 15 weeks and semantic 1-5 matrices without the internal checklist](F:/WEB_PROJELER/DBP_HD/tests/rendered-html.test.mjs:613) | A2 — İlk HTML / paket | Sunucunun ilk HTML’inde yayın kontrolü sürüyor; API sonucu ve tarayıcı render’ı beklenmiyor. |
| 17 | [handoff 15-2 Makine courses preserve DB-backed public package requirements](F:/WEB_PROJELER/DBP_HD/tests/rendered-html.test.mjs:639) | A2 — İlk HTML / paket | Sunucunun ilk HTML’inde yayın kontrolü sürüyor; API sonucu ve tarayıcı render’ı beklenmiyor. |
| 18 | [Arkeoloji ortak süreç dersleri tek havuzda ve ABD başkanı düzenleme alanında kalır](F:/WEB_PROJELER/DBP_HD/tests/rendered-html.test.mjs:815) | A1 — İlk HTML / ders listesi | Sunucunun ilk HTML’inde veri yerine yükleniyor durumu var; useEffect çalıştırılmıyor. |
| 19 | [server-renders the public home page](F:/WEB_PROJELER/DBP_HD/tests/rendered-html.test.mjs:1118) | C — Kaynak/metin beklentisi | Beklenen eski title yerine LEE Bilgi Sistemi üretiliyor. |
| 20 | [Aile Danışmanlığı tezsiz public listesi bitirme projesini tek ortak süreç dersi olarak gösterir](F:/WEB_PROJELER/DBP_HD/tests/rendered-html.test.mjs:1404) | A1 — İlk HTML / ders listesi | Sunucunun ilk HTML’inde veri yerine yükleniyor durumu var; useEffect çalıştırılmıyor. |
| 21 | [Beden Eğitimi ve Spor tezsiz public listesi ortak dersleri tekilleştirir](F:/WEB_PROJELER/DBP_HD/tests/rendered-html.test.mjs:1449) | A1 — İlk HTML / ders listesi | Sunucunun ilk HTML’inde veri yerine yükleniyor durumu var; useEffect çalıştırılmıyor. |
| 22 | [Biyoloji tezsiz public listesi yalnız Bitirme Projesini ortak süreçte gösterir](F:/WEB_PROJELER/DBP_HD/tests/rendered-html.test.mjs:1499) | A1 — İlk HTML / ders listesi | Sunucunun ilk HTML’inde veri yerine yükleniyor durumu var; useEffect çalıştırılmıyor. |
| 23 | [Ekonomi ve Finans tezsiz public listesi paketleri ve tek Bitirme Projesini gösterir](F:/WEB_PROJELER/DBP_HD/tests/rendered-html.test.mjs:1551) | A1 — İlk HTML / ders listesi | Sunucunun ilk HTML’inde veri yerine yükleniyor durumu var; useEffect çalıştırılmıyor. |
| 24 | [Enerji Sistemleri Mühendisliği tezsiz public listesi tekilleştirilmiş dersleri gösterir](F:/WEB_PROJELER/DBP_HD/tests/rendered-html.test.mjs:1596) | A1 — İlk HTML / ders listesi | Sunucunun ilk HTML’inde veri yerine yükleniyor durumu var; useEffect çalıştırılmıyor. |
| 25 | [Gastronomi ve Mutfak Sanatları tezsiz public listesi tekilleştirilmiş dersleri gösterir](F:/WEB_PROJELER/DBP_HD/tests/rendered-html.test.mjs:1640) | A1 — İlk HTML / ders listesi | Sunucunun ilk HTML’inde veri yerine yükleniyor durumu var; useEffect çalıştırılmıyor. |
| 26 | [Gıda Teknolojisi tezsiz public listesi tekilleştirilmiş dersleri gösterir](F:/WEB_PROJELER/DBP_HD/tests/rendered-html.test.mjs:1685) | A1 — İlk HTML / ders listesi | Sunucunun ilk HTML’inde veri yerine yükleniyor durumu var; useEffect çalıştırılmıyor. |
| 27 | [İşletme tezsiz public listesi tekilleştirilmiş dersleri gösterir](F:/WEB_PROJELER/DBP_HD/tests/rendered-html.test.mjs:1730) | A1 — İlk HTML / ders listesi | Sunucunun ilk HTML’inde veri yerine yükleniyor durumu var; useEffect çalıştırılmıyor. |
| 28 | [Organik Tarım İşletmeciliği tezsiz public listesi yalnız kanonik Bitirme Projesini gösterir](F:/WEB_PROJELER/DBP_HD/tests/rendered-html.test.mjs:1807) | A1 — İlk HTML / ders listesi | Sunucunun ilk HTML’inde veri yerine yükleniyor durumu var; useEffect çalıştırılmıyor. |
| 29 | [Resim tezsiz public listesi yalnız kanonik Bitirme Projesini gösterir](F:/WEB_PROJELER/DBP_HD/tests/rendered-html.test.mjs:1852) | A1 — İlk HTML / ders listesi | Sunucunun ilk HTML’inde veri yerine yükleniyor durumu var; useEffect çalıştırılmıyor. |
| 30 | [Siyaset Bilimi ve Kamu Yönetimi tezsiz public listesi yalnız kanonik Bitirme Projesini gösterir](F:/WEB_PROJELER/DBP_HD/tests/rendered-html.test.mjs:1898) | A1 — İlk HTML / ders listesi | Sunucunun ilk HTML’inde veri yerine yükleniyor durumu var; useEffect çalıştırılmıyor. |
| 31 | [Tarih tezsiz public listesi yalnız kanonik Bitirme Projesini gösterir](F:/WEB_PROJELER/DBP_HD/tests/rendered-html.test.mjs:1945) | A1 — İlk HTML / ders listesi | Sunucunun ilk HTML’inde veri yerine yükleniyor durumu var; useEffect çalıştırılmıyor. |
| 32 | [Türk Dili ve Edebiyatı tezsiz public listesi yalnız kanonik Bitirme Projesini gösterir](F:/WEB_PROJELER/DBP_HD/tests/rendered-html.test.mjs:1992) | A1 — İlk HTML / ders listesi | Sunucunun ilk HTML’inde veri yerine yükleniyor durumu var; useEffect çalıştırılmıyor. |
| 33 | [Yönetim Bilişim Sistemleri tezsiz public listesi kanonik dersleri gösterir](F:/WEB_PROJELER/DBP_HD/tests/rendered-html.test.mjs:2041) | A1 — İlk HTML / ders listesi | Sunucunun ilk HTML’inde veri yerine yükleniyor durumu var; useEffect çalıştırılmıyor. |
| 34 | [Yönetim ve Organizasyon tezsiz public listesi kanonik dersleri gösterir](F:/WEB_PROJELER/DBP_HD/tests/rendered-html.test.mjs:2094) | A1 — İlk HTML / ders listesi | Sunucunun ilk HTML’inde veri yerine yükleniyor durumu var; useEffect çalıştırılmıyor. |
| 35 | [kalite göstergeleri enstitü ve program kapsamını canlı DB anlık görüntüsünden sunar](F:/WEB_PROJELER/DBP_HD/tests/rendered-html.test.mjs:2114) | C — Kaynak/metin beklentisi | Unvan bazlı toplulaştırılmış ders yükü artık hem enstitü hem program kapsamında sunuluyor. |

## Yerel kanıt dosyaları

- [Normal test sonucu](F:/WEB_PROJELER/DBP_HD/local-volume/test-failure-audit/normal-results.json)
- [İlk hata sonrasındaki kontrol gözlemleri](F:/WEB_PROJELER/DBP_HD/local-volume/test-failure-audit/all-assertions.json)
- [İlk HTML gözlemleri](F:/WEB_PROJELER/DBP_HD/local-volume/test-failure-audit/render-observations.json)
- [Bağlantılı tez/yayın test verisi sonucu](F:/WEB_PROJELER/DBP_HD/local-volume/test-failure-audit/linked-fixture-observations.json)
- [Rol yetkilendirme fonksiyonlarının SQLite deneyi](F:/WEB_PROJELER/DBP_HD/local-volume/test-failure-audit/role-runtime-observations.json)
- [Lint çıktısı](F:/WEB_PROJELER/DBP_HD/local-volume/test-failure-audit/lint-results.json)

Kanıt dosyaları local-volume altında ve Git dışında tutuluyor; bu Markdown raporu sonuçları kalıcı olarak özetliyor.

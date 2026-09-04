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

Program gerekli bağımlılıkları kontrol eder, LEE DBP'yi `http://localhost:8081` adresinde başlatır ve varsayılan tarayıcıyı otomatik açar. `8081` portu e-Enstitü'nün `8080` portuyla çakışmaması için seçilmiştir.

Komut satırından çalıştırmak için:

```bash
npm run dev
npm run build
```

## Canlı Scopus ortam değişkenleri

Bibliyometrik Göstergeler sayfasının canlı sunucuda veri çekebilmesi için dağıtım ortamında aşağıdaki sunucu değişkenleri tanımlanır. API anahtarı repoya veya istemci koduna yazılmaz.

```ini
SCOPUS_API_KEY=...
SCOPUS_AFFILIATION_ID=60088374
SCOPUS_INSTTOKEN=...
```

`SCOPUS_API_KEY` zorunludur. `SCOPUS_INSTTOKEN` yalnız kurum aboneliği bunu gerektiriyorsa tanımlanır.

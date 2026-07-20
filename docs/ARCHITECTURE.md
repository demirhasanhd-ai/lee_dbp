# LEE DBP mimarisi

## Sistem sınırı

LEE DBP, e-Enstitü'den bağımsız bir uygulamadır. Ortak klasör, veritabanı veya dosya havuzu kullanmaz. Entegrasyon yalnızca sürümlü REST API üzerinden yapılır.

## Veri sahipliği

| Veri | Ana sistem |
| --- | --- |
| Akademisyen, program, temel ders tanımı | e-Enstitü / kurumsal sistem |
| Bologna içeriği, AKTS, çıktılar, haftalık plan | LEE DBP |
| Onay, revizyon ve yayın geçmişi | LEE DBP |
| Public ders kataloğu | LEE DBP |

## Uygulama alanları

- `/`: public tanıtım ve arama
- `/katalog`: onaylanmış dersler
- `/yonetim`: akademisyen ve koordinatör alanı
- `/api/v1/integrations/e-enstitu/*`: ileride kurulacak kontrollü entegrasyon sınırı

## Durum akışı

`TASLAK -> INCELEMEDE -> DUZELTME_ISTENDI -> ONAYLANDI -> YAYINLANDI -> ARSIVLENDI`

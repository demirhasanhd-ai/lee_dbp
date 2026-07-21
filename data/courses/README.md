# LEE DBP resmi ders veri kaynağı

Bu klasör uygulamanın resmi müfredat derslerini tutar. Amaç, Excel ders yüklemelerinde React/TypeScript ekran kodlarına dokunmamaktır.

## Akış

1. Excel dosyası `scripts/import_curriculum_excel.py` ile `data/courses/2026-2027.json` dosyasına aktarılır.
2. `scripts/generate_course_data.py` bu JSON'dan şu dosyaları üretir:
   - `lib/data/officialCourses.ts`
   - `local-preview/program-data-local.js` içindeki resmi ders listesi
3. `scripts/validate_course_data.py` program/düzey eşleşmelerini, zorunlu alanları, Türkçe dönem/tür değerlerini ve `7801` gibi rapor kodlarının programa yazılmadığını kontrol eder.
4. `scripts/generate_public_course_pdfs.py` aynı JSON'dan public yazdır PDF'lerini üretir.

## Önerilen komut sırası

```powershell
python scripts/import_curriculum_excel.py "C:\...\dersler.xlsx" --config "data\import-configs\ornek.json"
npm.cmd run dbp:generate-data
npm.cmd run dbp:validate
python scripts/generate_public_course_pdfs.py
npm.cmd run build
```

PDF üretiminde `reportlab`, Excel importunda `pandas` ve `openpyxl` gerekir. Eksikse `requirements-dbp.txt` kurulmalıdır.

## Import mantığı

- Excel kolon sonlarındaki `_7801` gibi ekler rapor kodu kabul edilir; programa kod olarak yazılmaz.
- Aynı Excel tekrar yüklendiğinde yalnızca config'te hedeflenen program/düzeyin dersleri yenilenir.
- Öğretim elemanı boşsa kayıt korunur ve durum `Atama Bekliyor` olur.
- Öğretim elemanı doluysa durum `İncelemede` olur.

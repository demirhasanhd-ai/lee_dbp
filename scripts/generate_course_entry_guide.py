#!/usr/bin/env python3
"""Build the downloadable course-entry guide from the current outcome rules.

Run with the bundled Python runtime and pass the bundled Node executable via
--node. The button in RoleDashboard serves the stable public output path.
"""

from __future__ import annotations

import argparse
import json
import subprocess
from collections import defaultdict
from html import escape
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    PageBreak, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
REVISION = "24.11.2026"
INK = colors.HexColor("#19232D")
MUTED = colors.HexColor("#536170")
RED = colors.HexColor("#A71930")
LINE = colors.HexColor("#D9DDE2")
EXAMPLES = [
    ("Alanıyla ilgili temel kavramları tanımlar.", "good", "Kabul edilen fiil: tanımlar. En az dört kelimelik tek eylemli bir cümledir."),
    ("Temel istatistiksel ölçüleri veri üzerinden hesaplar.", "good", "Hesaplar kabul edilen fiiller arasındadır. Modeller ve çözer de kabul edilir."),
    ("Çevresindeki temel güvenlik risklerini fark eder.", "good", "Fark eder, psikomotor alan tablosu esas alınarak kabul edilir."),
    ("Temel ilke, kural, yöntem ve araçları açıklar.", "good", "Tek eylem açıklar ifadesidir. Virgüller ve ve bağlacı ek eylem sayılmaz."),
    ("Bu dersin temel ilkelerini açıklar ve uygular.", "warning", "İki eylem vardır: açıklar ve uygular. Ayrı çıktı maddelerine bölün."),
    ("Alanındaki temel ilkeleri bilir.", "error", "Bilir belirsiz ifadedir; ayrıca kabul edilen bir aktif fiil bulunmamaktadır. Davranışa uygun bir fiil seçin."),
    ("Ders kapsamında temel ilkeleri açıklar.", "warning", "Ders kapsamında ifadesi öğretici odaklı olarak işaretlenir. Örneğin: Alanındaki temel ilkeleri örneklerle açıklar."),
    ("Alanındaki temel ilkeleri açıklayabilir.", "warning", "Açıklayabilir kabul listesinde yoktur. Listedeki açıklar biçimini kullanın."),
    ("Temel ilkeleri açıklar.", "warning", "Üç kelimedir. En az dört kelimeye tamamlayın: Alanındaki temel ilkeleri açıklar."),
]


def load_rules(node: str) -> dict:
    script = """
      import * as rules from './lib/quality/outcomeRules.mjs';
      import { COURSE_STRUCTURE_LABELS } from './lib/courseStructures.mjs';
      const examples = JSON.parse(process.argv[1]);
      console.log(JSON.stringify({
        minimum: rules.MIN_COURSE_LEARNING_OUTCOMES,
        minWords: rules.MIN_OUTCOME_WORDS,
        maxCharacters: rules.MAX_OUTCOME_CHARACTERS,
        accepted: [...rules.measurableOutcomeVerbs].sort((a,b) => a.localeCompare(b, 'tr-TR')),
        vague: rules.vagueOutcomeVerbs,
        structures: COURSE_STRUCTURE_LABELS,
        examples: examples.map(text => rules.evaluateOutcomeQuality(text, 'course')),
      }));
    """
    result = subprocess.run(
        [node, "--input-type=module", "--eval", script,
         json.dumps([row[0] for row in EXAMPLES], ensure_ascii=False)],
        cwd=ROOT, capture_output=True, text=True, encoding="utf-8", check=True,
    )
    rules = json.loads(result.stdout)
    for (text, expected, _), actual in zip(EXAMPLES, rules["examples"], strict=True):
        if actual["status"] != expected:
            raise ValueError(f"Guide example no longer matches application: {text}: {actual}")
    return rules


def build_pdf(output: Path, rules: dict) -> None:
    font_dir = ROOT / "public/fonts/noto-sans"
    pdfmetrics.registerFont(TTFont("GuideSans", str(font_dir / "NotoSans-Regular.ttf")))
    pdfmetrics.registerFont(TTFont("GuideSans-Bold", str(font_dir / "NotoSans-Bold.ttf")))
    pdfmetrics.registerFontFamily("GuideSans", normal="GuideSans", bold="GuideSans-Bold")
    styles = getSampleStyleSheet()
    body = ParagraphStyle("GuideBody", parent=styles["BodyText"], fontName="GuideSans",
                          fontSize=10, leading=14.7, textColor=INK, spaceAfter=7)
    title = ParagraphStyle("GuideTitle", parent=body, fontName="GuideSans-Bold",
                           fontSize=21, leading=27, spaceAfter=12)
    heading = ParagraphStyle("GuideHeading", parent=body, fontName="GuideSans-Bold",
                             fontSize=15, leading=20, spaceBefore=8, spaceAfter=10,
                             keepWithNext=True)
    subheading = ParagraphStyle("GuideSubheading", parent=body, fontName="GuideSans-Bold",
                                fontSize=11, leading=15, spaceBefore=9, spaceAfter=5,
                                keepWithNext=True)
    small = ParagraphStyle("GuideSmall", parent=body, fontSize=9, leading=13, textColor=MUTED)
    bullet = ParagraphStyle("GuideBullet", parent=body, leftIndent=12, firstLineIndent=-9,
                            spaceAfter=5)
    cell = ParagraphStyle("GuideCell", parent=body, fontSize=9.1, leading=13, spaceAfter=0)
    cell_head = ParagraphStyle("GuideCellHead", parent=cell, fontName="GuideSans-Bold")
    vocabulary = ParagraphStyle("GuideVocabulary", parent=body, fontSize=9.5, leading=14,
                                spaceAfter=7)
    story = []

    def p(text: str, style=body) -> None:
        story.append(Paragraph(text, style))

    def h(text: str) -> None:
        p(text, subheading)

    def bullets(items: list[str]) -> None:
        for item in items:
            p("• " + item, bullet)

    def page(text: str) -> None:
        if story:
            story.append(PageBreak())
        p(text, heading)

    def table(rows: list[list[str]], widths: list[float]) -> None:
        data = [[Paragraph(value, cell_head if i == 0 else cell) for value in row]
                for i, row in enumerate(rows)]
        item = Table(data, colWidths=widths, repeatRows=1, hAlign="LEFT")
        item.setStyle(TableStyle([
            ("GRID", (0, 0), (-1, -1), 0.5, LINE),
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#EDF0F3")),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ("LEFTPADDING", (0, 0), (-1, -1), 8),
            ("RIGHTPADDING", (0, 0), (-1, -1), 8),
            ("TOPPADDING", (0, 0), (-1, -1), 7),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
        ]))
        story.append(item)
        story.append(Spacer(1, 7))

    # 1: Entry and approval workflow.
    p("Ders bilgi girişi<br/>kullanım kılavuzu", title)
    p("Osmaniye Korkut Ata Üniversitesi<br/>Lisansüstü Eğitim Enstitüsü", small)
    p(f"Güncelleme tarihi: {REVISION}", small)
    p("Bu kılavuz, <b>Ders Bilgi Paketlerim</b> ekranından ders bilgi paketi hazırlayan öğretim elemanları içindir. Alanları doldurma, öğrenme çıktısı yazma ve paketi onaya gönderme koşullarını açıklar.")
    p(f"<b>Güncel öğrenme çıktısı kuralı:</b> En az {rules['minimum']} çıktı yazılır. Eklenen 6., 7. ve sonraki bütün maddeler aynı kurallarla denetlenir. Kabul edilen fiiller, açıklayıcı uyarılar ve örnekler bu kılavuzda yer alır.")
    h("Taslak kaydetme ve onaya gönderme")
    bullets([
        "<b>Taslağı Kaydet:</b> Eksik veya düzeltilmesi gereken içerikle çalışmanızı kaydedebilirsiniz. Taslak kaydetmek onay sürecini başlatmaz.",
        "<b>Onaya gönder:</b> Öğrenme çıktıları dahil bütün zorunlu kontroller sağlandığında etkinleşir. Eksik/hatalı bölüm listesini açarak gerekçeleri görebilirsiniz.",
        "Komisyon Onayı Bekliyor veya ABD Son Onayı Bekliyor durumundaki paket yeniden kaydedilemez ya da gönderilemez. Düzeltme istendiğinde gerekli değişiklikler yapılıp yeniden gönderilebilir.",
    ])
    h("Derse erişim ve inceleme")
    p("Akademisyenler kendilerine atanmış dersleri düzenler. ABD/ASD başkanları kendilerine tanımlanan düzenleme yetkileri kapsamındaki derslerde işlem yapar. Ders listesinden ilgili dersi açın; kayıtlı içerikleri kontrol ederek ilerleyin.")
    h("Kılavuzdaki bölümler")
    p("2. sayfa: Dersin temel bilgileri<br/>3. sayfa: Öğrenme çıktısı kuralları<br/>4. sayfa: Doğru ifadeler ve düzeltme örnekleri<br/>5. sayfa: Ders yapısı, değerlendirme ve haftalık plan<br/>6. sayfa: İş yükü, ÖÇ-PÇ matrisi ve SKA<br/>7. sayfa: Kabul edilen fiillerin tam listesi", small)

    # 2: General form fields.
    page("Dersin temel bilgileri")
    h("Ders kimliği ve seçim alanları")
    bullets([
        "Ders adı ve ders kodu boş bırakılamaz. Ders kodu program düzeyiyle uyumlu olmalıdır: 7 ile başlayan kodlar Tezsiz Yüksek Lisans, 8 ile başlayanlar Tezli Yüksek Lisans, 9 ile başlayanlar Doktora içindir.",
        "Teorik saat, uygulama saati ve kredi bilgilerini sayısal olarak girin. Dersin türünü Zorunlu veya Seçmeli; öğrenim dilini Türkçe veya İngilizce olarak seçin.",
        "AKTS kredisi, AKTS / İş Yükü Tablosundaki sürelerden otomatik hesaplanır. İş yükü ve AKTS açıklaması 6. sayfadadır.",
    ])
    h("Açıklama alanları")
    p("Dersin Amacı, Dersin İçeriği, Dersin Yöntem ve Teknikleri ve Ders Kaynakları alanlarının her biri <b>en az 20 karakter ve en az 4 kelime</b> içeren anlamlı bir açıklama olmalıdır. Yalnızca noktalama işaretlerinden oluşan parçalar kelime sayılmaz.")
    table([
        ["Alan", "Nasıl doldurulur"],
        ["Dersin Amacı", "Ders sonunda öğrenciye kazandırılması hedeflenen genel bilgi ve becerileri açıklayın."],
        ["Dersin İçeriği", "Dersin kapsadığı konuları anlaşılır bir özet halinde belirtin."],
        ["Dersin Yöntem ve Teknikleri", "Anlatım, uygulama, örnek olay, proje ve benzeri yöntemleri derse uygun biçimde açıklayın."],
        ["Ders Kaynakları", "Kullanılacak temel ve yardımcı kaynakları belirtin."],
    ], [44 * mm, 126 * mm])
    h("Sorumlular ve diğer bilgiler")
    bullets([
        "Dersin Koordinatörü ile Dersi Veren Öğretim Elemanı / Elemanları alanları doldurulmalıdır.",
        "Ön Koşulları ve Dersin Yardımcıları alanlarını boş bırakmayın. Ön koşul veya yardımcı bulunmuyorsa ilgili alana <b>Yok</b> yazın.",
    ])
    p("Öğrenme çıktıları için ayrıca fiil, uzunluk, tek eylem ve öğrenci odağı kuralları uygulanır. Bu kurallar sonraki sayfada açıklanmıştır.", small)

    # 3: Every enforced outcome rule and the complete blocked phrase lists.
    page("Öğrenme çıktısı kuralları")
    p(f"<b>En az {rules['minimum']} öğrenme çıktısı zorunludur.</b> ÖÇ Ekle ile yeni maddeler ekleyebilirsiniz. Beş çıktı kaldığında silme düğmeleri pasif olur. Çıktı sayısı için uygulamada ayrıca bir üst sınır bulunmaz.")
    p("<b>Bütün çıktılar denetlenir.</b> İlk beş madde ile sonradan eklenen 6., 7. ve sonraki maddeler arasında kontrol farkı yoktur. Eklenen bir maddeyi boş bırakmayın; doldurun veya en az beş çıktı kalacak şekilde kaldırın.")
    bullets([
        f"Her çıktı boş olmayan, <b>en az {rules['minWords']} kelimelik</b> tam bir kazanım cümlesi olmalıdır.",
        f"Her çıktı <b>en fazla {rules['maxCharacters']} karakter</b> olmalıdır. Boşluklar ve noktalama işaretleri de karakter sayısına dahildir.",
        "<b>Kabul listesindeki bir fiili kullanmak zorunludur.</b> Liste dışında bir fiil kullanıldığında ölçülebilir fiil bulunamadığı açıklanır. Örneğin açıklar tanınır; açıklayabilir kabul listesinde değildir.",
        "<b>Tek fiil ve tek yargı/yüklem kullanın.</b> Açıklar ve uygular iki eylemdir. Virgül, ve veya ile bulunması tek başına çoklu eylem sayılmaz. Problem çözer ve sentez yapar gibi birleşik ifadeler birer eylem sayılır.",
        "Çıktı, öğretim elemanının anlatacağı içeriği değil, öğrencinin ders sonunda yapacağı davranışı göstermelidir.",
    ])
    h("Belirsiz kabul edilen ifadeler")
    p(escape(", ".join(rules["vague"])) + ". Bu ifadelerden biri bulunursa hangi ifade olduğu uyarıda belirtilir.")
    p("<b>Fark eder kabul edilir.</b> Kılavuzun psikomotor alan tablosu esas alınmıştır; belirsiz ifadeler listesinde değildir.")
    h("Öğretici odaklı olarak işaretlenen ifadeler")
    p("kazandırmak, öğretmek, anlatmak, tanıtmak, vermek, öğrenciye, ders kapsamında. Bu ifadeler öğrenme çıktısı içinde geçtiğinde öğrenci davranışını öne çıkaracak biçimde cümleyi yeniden yazın.")
    h("Kutunun altındaki bilgilendirmeyi kullanma")
    p("Uygun maddelerde <b>Uygun</b> görünür. Sorunlu maddelerde <b>Düzenlenmeli</b>, boş maddelerde <b>Boş çıktı</b> başlığı ve bütün gerekçeler gösterilir. Sorunlu kelimeler, bulunan eylemler ve kelime/karakter sayıları açıklanır. <b>Kabul edilen fiiller</b> başlığını açarak tam listeyi görebilirsiniz.")
    p("Herhangi bir çıktı kurala uymuyorsa Onaya gönder düğmesi pasif kalır. Formun altındaki listede sorunlu madde ÖÇ6 veya ÖÇ7 gibi numarasıyla belirtilir. Taslak kaydetme olanağı devam eder.", small)

    # 4: Examples validated against the same application evaluator.
    page("Doğru ifadeler ve düzeltme örnekleri")
    p("Aşağıdaki örnekler güncel öğrenme çıktısı kontrolüne göre hazırlanmıştır. Bir maddede birden fazla sorun varsa kutunun altında bütün nedenleri okuyup birlikte düzeltin.")
    rows = [["Öğrenme çıktısı ve sonuç", "Açıklama veya düzeltme"]]
    for text, result, explanation in EXAMPLES:
        label = "Uygun" if result == "good" else "Düzenlenmeli"
        rows.append([f"<b>{label}</b><br/>{escape(text)}", escape(explanation)])
    table(rows, [82 * mm, 88 * mm])
    p("Boş bırakılan yeni maddede doldurma veya kaldırma yönlendirmesi görünür. Başka bir maddede sorunsuz bir fiil bulunması, boş veya hatalı maddeyi geçerli hale getirmez.", small)

    # 5: Existing guide topics, corrected to match today's form.
    page("Ders yapısı ve haftalık plan")
    h("Ders yapısı yüzdeleri")
    p("Dersin yapısını aşağıdaki sekiz alana dağıtın. Her alan 0-100 aralığında yüzde olarak girilir. <b>Toplam tam olarak %100</b> olmalıdır; %99 veya %101 ile onaya gönderilemez.")
    bullets([escape(label) for label in rules["structures"]])
    h("Değerlendirme sistemi")
    bullets([
        "Başlangıçta Ara Sınav (%40) ve Yarıyıl Sonu Sınavı (%60) satırları vardır. En az iki değerlendirme türü bulunmalı ve bütün türlerin adları dolu olmalıdır.",
        "İlk iki satır silinemez; adları, sayıları ve katkıları düzenlenebilir. Değerlendirme Ekle ile yeni satır ekleyebilir, sonradan eklenen satırları kaldırabilirsiniz.",
        "Katkılar 0-100 aralığında girilir ve toplamları tam olarak %100 olmalıdır. Sayısı 0 yapılan değerlendirmenin katkısı 0 olur; katkı alanı pasifleşir ve kalan katkılar yeniden dağıtılır.",
        "Değerlendirme ekleme, ad değiştirme, sayı değiştirme veya silme sonrasında ilişkili hazırlık iş yüklerini ve katkı toplamını yeniden kontrol edin.",
    ])
    h("Haftalık konu programı")
    p("Program <b>15 haftadır</b>; hafta eklenmez veya silinmez. Her haftanın konusu en az <b>12 karakter ve 3 kelime</b> içeren anlamlı bir açıklama olmalıdır. Onaya göndermeden önce 15 haftanın tamamını doldurun.")

    # 6: Workload, dynamic program matrix and final submission.
    page("İş yükü ve program çıktısı ilişkisi")
    h("AKTS ve iş yükü")
    p("Her etkinlik için sayı ve süreyi saat cinsinden girin. Etkinlik iş yükü <b>sayı × süre</b>, toplam iş yükü ise bütün etkinliklerin iş yükleri toplamıdır. AKTS, toplam iş yükünün 30'a bölünüp <b>en yakın tam sayıya yuvarlanmasıyla</b> hesaplanır. Örneğin 180 saat iş yükü 6 AKTS'dir.")
    bullets([
        "Ders Süresi, Sınıf Dışı Çalışma ve sınav hazırlığı gibi mevcut satırları dersin gerçek iş yüküne göre kontrol edin. İş Yükü Ekle ile yeni etkinlik eklenebilir; özel eklenen satırların adı değiştirilebilir ve bu satırlar silinebilir.",
        "Onaya göndermek için toplam iş yükü ve hesaplanan AKTS sıfırdan büyük olmalıdır. Sınav veya değerlendirme satırlarında değişiklik yaptıysanız ilişkili iş yüklerini yeniden gözden geçirin.",
    ])
    h("ÖÇ-PÇ katkı matrisi")
    p("Matrisin sütunları, seçilen program ve düzey için kayıtlı program çıktılarından oluşur. <b>Program çıktısı sayısı 11'de sabit değildir.</b> Ekranda gösterilen PÇ metinlerini okuyarak eşleştirme yapın.")
    bullets([
        "Her öğrenme çıktısı en az bir program çıktısına katkı sağlamalıdır. Katkı puanları 1, 2, 3, 4 veya 5 olarak seçilir; 0 seçeneği yoktur.",
        "Yeni ÖÇ eklediğinizde onun katkı satırını da doldurun. Program çıktısı bulunmuyorsa ilgili program ve düzeyin çıktıları kaydedilmeden matris tamamlanamaz.",
    ])
    h("Sürdürülebilir Kalkınma Amaçları")
    p("17 SKA arasından dersle ilişkili <b>en az bir amaç</b> seçin. Aynı amaç iki farklı satırda seçilemez. Yeni satır eklenebilir; gereksiz satırlar kaldırılabilir.")
    h("Onaya göndermeden önce")
    p("Genel bilgiler, bütün öğrenme çıktıları, 15 haftalık plan, değerlendirme toplamı, ders yapısı toplamı, iş yükü, ÖÇ-PÇ matrisi ve SKA seçimini kontrol edin. Formun altındaki <b>Yayın için ... eksik veya hatalı bölüm var</b> listesindeki nedenleri giderin. Kontroller tamamlanınca <b>Onaya gönder</b> etkinleşir; gönderim onayından sonra paket inceleme sürecine alınır.")
    p("Komisyon bulunan birimlerde komisyon incelemesini ABD/ASD son onayı izler. Komisyon bulunmayan birimlerde paket doğrudan ABD/ASD son onayına yönlendirilebilir.", small)

    # 7: One complete, alphabetized allowlist imported from the application.
    page("Kabul edilen fiillerin tam listesi")
    p(f"Güncel uygulamada <b>{len(rules['accepted'])} fiil/ifade</b> kabul edilir. Öğrenme çıktısında bu listeden tek bir fiil kullanın. Farklı fiil çekimleri kendiliğinden kabul edilmez; listedeki biçimi esas alın.")
    groups = defaultdict(list)
    for verb in rules["accepted"]:
        initial = verb[0].replace("i", "İ").replace("ı", "I").upper()
        groups[initial].append(verb)
    for initial, verbs in groups.items():
        p(f"<b>{escape(initial)}</b> &nbsp; " + escape("; ".join(verbs)) + ".", vocabulary)
    p("Liste, OKÜ Ders Bilgi Paketi Hazırlama Kılavuzu'nun (Mart 2026) genel yazım açıklamaları ile Tablo 4, 5 ve 6'daki fiilleri, uygulamanın önceden kabul ettiği fiilleri ve bazı standart yazım karşılıklarını birlikte içerir. Fark eder ifadesinde psikomotor alan tablosu esas alınır.", small)

    def decorate(canvas, doc):
        width, height = A4
        canvas.saveState()
        canvas.setFont("GuideSans-Bold", 8)
        canvas.setFillColor(RED)
        canvas.drawString(20 * mm, height - 16 * mm, "OKÜ  |  LİSANSÜSTÜ EĞİTİM ENSTİTÜSÜ")
        canvas.setStrokeColor(LINE)
        canvas.line(20 * mm, height - 20 * mm, width - 20 * mm, height - 20 * mm)
        canvas.line(20 * mm, 17 * mm, width - 20 * mm, 17 * mm)
        canvas.setFont("GuideSans", 8)
        canvas.setFillColor(MUTED)
        canvas.drawString(20 * mm, 12 * mm, f"Ders bilgi girişi kullanım kılavuzu  |  {REVISION}")
        canvas.drawRightString(width - 20 * mm, 12 * mm, str(doc.page))
        canvas.restoreState()

    output.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(str(output), pagesize=A4,
                            leftMargin=20 * mm, rightMargin=20 * mm,
                            topMargin=25 * mm, bottomMargin=23 * mm,
                            title="Ders Bilgi Girişi Kullanım Kılavuzu",
                            author="Osmaniye Korkut Ata Üniversitesi - Lisansüstü Eğitim Enstitüsü",
                            subject=f"Güncel ders bilgi girişi ve öğrenme çıktısı kuralları - {REVISION}")
    doc.build(story, onFirstPage=decorate, onLaterPages=decorate)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--node", required=True, help="Absolute path to the bundled Node.js executable")
    parser.add_argument("--output", type=Path, default=ROOT / "public/ders-bilgi-girisi-kullanim-kilavuzu.pdf")
    args = parser.parse_args()
    rules = load_rules(args.node)
    build_pdf(args.output.resolve(), rules)
    print(f"Generated {args.output.resolve()} ({len(rules['accepted'])} accepted verbs)")


if __name__ == "__main__":
    main()

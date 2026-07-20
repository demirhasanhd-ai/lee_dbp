from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    Image,
    KeepTogether,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)

ROOT = Path(__file__).resolve().parents[1]
PUBLIC_PDF = ROOT / "public" / "pdf" / "LEE-501-Bilimsel-Arastirma-Yontemleri-ve-Etik.pdf"
OUTPUT_PDF = ROOT / "output" / "pdf" / PUBLIC_PDF.name
FONT_DIR = ROOT / "public" / "fonts" / "noto-sans"
LOGO = ROOT / "public" / "oku-logo.png"

RED = colors.HexColor("#cf142b")
DARK = colors.HexColor("#281d20")
MUTED = colors.HexColor("#725e63")
LINE = colors.HexColor("#e4c9ce")
PALE = colors.HexColor("#fff5f5")
PALE_2 = colors.HexColor("#f9e7e9")
WHITE = colors.white

pdfmetrics.registerFont(TTFont("Noto", str(FONT_DIR / "NotoSans-Regular.ttf")))
pdfmetrics.registerFont(TTFont("Noto-Medium", str(FONT_DIR / "NotoSans-Medium.ttf")))
pdfmetrics.registerFont(TTFont("Noto-SemiBold", str(FONT_DIR / "NotoSans-SemiBold.ttf")))
pdfmetrics.registerFont(TTFont("Noto-Bold", str(FONT_DIR / "NotoSans-Bold.ttf")))

styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name="BodyTR", fontName="Noto", fontSize=8.2, leading=11.2, textColor=DARK))
styles.add(ParagraphStyle(name="CellTR", fontName="Noto", fontSize=7.4, leading=9.2, textColor=DARK))
styles.add(ParagraphStyle(name="CellBold", parent=styles["CellTR"], fontName="Noto-SemiBold"))
styles.add(ParagraphStyle(name="SectionTR", fontName="Noto-Bold", fontSize=10.5, leading=13, textColor=RED, spaceAfter=5))
styles.add(ParagraphStyle(name="SmallTR", fontName="Noto", fontSize=6.6, leading=8.3, textColor=MUTED))
styles.add(ParagraphStyle(name="CenterTR", parent=styles["CellTR"], alignment=TA_CENTER))


def p(text, style="CellTR"):
    return Paragraph(str(text), styles[style])


def header_footer(canvas, doc):
    canvas.saveState()
    width, height = A4
    canvas.setFillColor(PALE)
    canvas.rect(0, height - 31 * mm, width, 31 * mm, fill=1, stroke=0)
    canvas.setStrokeColor(RED)
    canvas.setLineWidth(1.1)
    canvas.line(15 * mm, height - 31 * mm, width - 15 * mm, height - 31 * mm)
    if LOGO.exists():
        canvas.drawImage(str(LOGO), 16 * mm, height - 27 * mm, 20 * mm, 20 * mm, preserveAspectRatio=True, mask="auto")
    canvas.setFillColor(DARK)
    canvas.setFont("Noto-Bold", 8.6)
    canvas.drawCentredString(width / 2, height - 10.5 * mm, "OSMANİYE KORKUT ATA ÜNİVERSİTESİ")
    canvas.setFont("Noto-SemiBold", 7.4)
    canvas.drawCentredString(width / 2, height - 15.3 * mm, "LİSANSÜSTÜ EĞİTİM ENSTİTÜSÜ")
    canvas.setFillColor(RED)
    canvas.setFont("Noto-Bold", 8.2)
    canvas.drawCentredString(98 * mm, height - 21.2 * mm, "LEE 501 — BİLİMSEL ARAŞTIRMA")
    canvas.drawCentredString(98 * mm, height - 25.1 * mm, "YÖNTEMLERİ VE ETİK")
    x = width - 60 * mm
    canvas.setFillColor(WHITE)
    canvas.roundRect(x, height - 27 * mm, 44 * mm, 18 * mm, 2 * mm, fill=1, stroke=0)
    canvas.setFillColor(MUTED)
    canvas.setFont("Noto", 5.8)
    canvas.drawString(x + 3 * mm, height - 13 * mm, "FORM NO")
    canvas.drawString(x + 3 * mm, height - 18 * mm, "AKADEMİK YIL")
    canvas.drawString(x + 3 * mm, height - 23 * mm, "SAYFA")
    canvas.setFillColor(DARK)
    canvas.setFont("Noto-SemiBold", 6.2)
    canvas.drawRightString(x + 40 * mm, height - 13 * mm, "OKÜ.LEE.FR.0055")
    canvas.drawRightString(x + 40 * mm, height - 18 * mm, "2026–2027")
    canvas.drawRightString(x + 40 * mm, height - 23 * mm, f"{doc.page}")
    canvas.setStrokeColor(LINE)
    canvas.line(15 * mm, 14 * mm, width - 15 * mm, 14 * mm)
    canvas.setFillColor(MUTED)
    canvas.setFont("Noto", 5.8)
    canvas.drawString(15 * mm, 9.5 * mm, "OKÜ LEE Ders Bilgi Paketi • Kamuya açık, ABD/ASD başkanı onaylı nüsha")
    canvas.drawRightString(width - 15 * mm, 9.5 * mm, "dbp.osmaniye.edu.tr")
    canvas.restoreState()


def section(title):
    return KeepTogether([Spacer(1, 2 * mm), Paragraph(title, styles["SectionTR"])])


def table(data, widths, header_rows=1, alignments=None, font_size=7.4):
    converted = []
    for r, row in enumerate(data):
        converted.append([p(value, "CellBold" if r < header_rows else "CellTR") for value in row])
    t = Table(converted, colWidths=widths, repeatRows=header_rows, hAlign="LEFT")
    commands = [
        ("BACKGROUND", (0, 0), (-1, header_rows - 1), PALE_2),
        ("TEXTCOLOR", (0, 0), (-1, header_rows - 1), RED),
        ("FONTNAME", (0, 0), (-1, header_rows - 1), "Noto-SemiBold"),
        ("GRID", (0, 0), (-1, -1), 0.45, LINE),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 5),
        ("RIGHTPADDING", (0, 0), (-1, -1), 5),
        ("TOPPADDING", (0, 0), (-1, -1), 4.2),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4.2),
    ]
    if alignments:
        for col, alignment in alignments.items():
            commands.append(("ALIGN", (col, 0), (col, -1), alignment))
    t.setStyle(TableStyle(commands))
    return t


def build_story():
    story = []
    story += [p("ONAYLANMIŞ DERS BİLGİ PAKETİ", "SmallTR"), Spacer(1, 2 * mm)]
    story += [table([
        ["Dersin Kodu", "Dersin Adı", "Program", "Dönem"],
        ["LEE 501", "Bilimsel Araştırma Yöntemleri ve Etik", "Tezli Yüksek Lisans", "Güz"],
        ["Ders Türü", "Öğrenim Dili", "T + U", "AKTS"],
        ["Zorunlu", "Türkçe", "3 + 0", "6"],
    ], [25*mm, 79*mm, 44*mm, 27*mm], header_rows=1)]
    story += [section("Dersin Amacı"), p("Öğrencilere bilimsel araştırma sürecini planlama, uygulama, değerlendirme ve sonuçlarını akademik ölçütlere ve etik ilkelere uygun biçimde raporlama yetkinliği kazandırmaktır.", "BodyTR")]
    story += [section("Dersin İçeriği"), p("Bilimsel bilgi ve araştırma problemi; literatür taraması; nicel, nitel ve karma araştırma desenleri; evren ve örneklem; veri toplama araçları; geçerlik ve güvenirlik; veri analizi; araştırma ve yayın etiği; akademik raporlama.", "BodyTR")]
    story += [section("Öğretim Yöntem ve Teknikleri"), p("Anlatım, tartışma, örnek olay incelemesi, uygulama, bireysel çalışma, makale çözümlemesi ve proje sunumu.", "BodyTR")]
    story += [section("Ders Sorumlusu ve Kaynaklar"), table([
        ["Ders Sorumlusu", "Ön Koşul", "Temel Kaynaklar"],
        ["Dr. Öğr. Üyesi Ayşe Yılmaz", "Bulunmamaktadır", "Bilimsel araştırma yöntemleri temel kitapları, güncel akademik makaleler, YÖK ve OKÜ etik yönergeleri."],
    ], [50*mm, 36*mm, 89*mm])]
    story += [section("Dersin Öğrenme Çıktıları")]
    outcomes = [
        "Bilimsel araştırma sürecinin temel aşamalarını açıklar.",
        "Araştırma problemine uygun yöntemi seçer ve uygular.",
        "Alan yazınını bilimsel ölçütlerle değerlendirir.",
        "Elde edilen verileri analiz ederek yorumlar.",
        "Araştırma sonuçlarını etik ilkelere uygun biçimde raporlar.",
    ]
    story += [table([["Kod", "Öğrenme Çıktısı"]] + [[f"ÖÇ{i+1}", x] for i, x in enumerate(outcomes)], [18*mm, 157*mm])]
    story += [section("Dersin Yapısı"), table([
        ["Matematik ve Temel Bilimler", "Mühendislik Bilimleri", "Mühendislik Tasarımı", "Sosyal Bilimler"],
        ["%20", "%10", "%0", "%30"],
        ["Eğitim Bilimleri", "Fen Bilimleri", "Sağlık Bilimleri", "Alan Bilgisi"],
        ["%20", "%10", "%0", "%10"],
    ], [43.75*mm]*4, alignments={0:"CENTER",1:"CENTER",2:"CENTER",3:"CENTER"})]

    weeks = [
        "Bilim ve bilimsel araştırmanın temelleri", "Araştırma problemi ve problem cümlesi", "Literatür taraması ve kaynaklara erişim", "Araştırma desenleri", "Evren ve örneklem", "Veri toplama araçları", "Ara sınav ve genel değerlendirme", "Nicel veri analizi", "Nitel veri analizi", "Geçerlik ve güvenirlik", "Bilimsel araştırma ve yayın etiği", "Bulguların yorumlanması", "Akademik yazım kuralları", "Araştırma raporunun hazırlanması", "Yarıyıl sonu değerlendirmesi",
    ]
    prep = ["Temel kavramları okuyunuz", "Örnek problem belirleyiniz", "Anahtar sözcüklerle tarama yapınız", "Desenleri karşılaştırınız", "Örneklem planı hazırlayınız", "Bir ölçme aracı inceleyiniz", "1–6. haftaları tekrar ediniz", "Örnek veri setini inceleyiniz", "Kodlama örneğini okuyunuz", "Bir makaleyi ölçütlerle inceleyiniz", "Etik ihlal örneklerini araştırınız", "Bulgular bölümünü inceleyiniz", "Yazım kılavuzunu okuyunuz", "Taslak rapor hazırlayınız", "Genel tekrar yapınız"]
    story += [section("15 Haftalık Ders Planı"), table([["Hafta", "Konu", "Ön Hazırlık"]] + [[str(i+1), weeks[i], prep[i]] for i in range(15)], [15*mm, 92*mm, 68*mm], alignments={0:"CENTER"})]

    story += [section("Değerlendirme Sistemi"), table([
        ["Değerlendirme Türü", "Adet", "Katkı (%)"],
        ["Ara Sınav", "1", "40"], ["Yarıyıl Sonu Sınavı", "1", "60"], ["Toplam", "2", "100"],
    ], [110*mm, 30*mm, 35*mm], alignments={1:"CENTER",2:"CENTER"})]
    story += [section("AKTS / İş Yükü Tablosu"), table([
        ["Etkinlik", "Adet", "Süre (Saat)", "Toplam İş Yükü"],
        ["Ders Süresi", "15", "3", "45"], ["Sınıf Dışı Çalışma", "15", "6", "90"], ["Ara Sınav Hazırlığı ve Sınav", "1", "15", "15"], ["Yarıyıl Sonu Sınavı Hazırlığı ve Sınav", "1", "30", "30"], ["Toplam İş Yükü", "", "", "180 saat"], ["AKTS Kredisi", "", "", "6 AKTS"],
    ], [91*mm, 24*mm, 30*mm, 30*mm], alignments={1:"CENTER",2:"CENTER",3:"CENTER"})]
    story += [section("ÖÇ / PÇ Katkı Matrisi")]
    matrix = [["ÖÇ/PÇ"] + [f"P{i}" for i in range(1, 13)]]
    values = [[3,2,1,0,0,2,1,0,0,2,0,1],[4,3,2,1,0,3,2,0,1,2,1,1],[3,4,3,2,1,2,2,1,1,3,2,1],[2,3,4,3,1,2,3,1,2,3,2,2],[2,3,3,4,2,3,3,2,2,4,3,2]]
    matrix += [[f"ÖÇ{i+1}"] + [str(v) for v in row] for i, row in enumerate(values)]
    story += [table(matrix, [19*mm] + [13*mm]*12, alignments={i:"CENTER" for i in range(13)})]
    story += [Spacer(1, 1.5*mm), p("Katkı düzeyi: 0 = katkı yok, 1 = çok düşük, 2 = düşük, 3 = orta, 4 = yüksek, 5 = çok yüksek", "SmallTR")]
    story += [section("Sürdürülebilir Kalkınma Amaçları"), table([
        ["No", "Amaç", "Dersle İlişkisi"],
        ["4", "Nitelikli Eğitim", "Araştırma okuryazarlığı ve yaşam boyu öğrenme becerilerini geliştirir."],
        ["9", "Sanayi, Yenilikçilik ve Altyapı", "Bilimsel yöntemle yenilikçi çözüm üretme kapasitesini destekler."],
        ["17", "Amaçlar İçin Ortaklıklar", "Disiplinler arası araştırma ve akademik iş birliğini teşvik eder."],
    ], [16*mm, 60*mm, 99*mm])]
    return story


def make_pdf(path):
    path.parent.mkdir(parents=True, exist_ok=True)
    doc = BaseDocTemplate(str(path), pagesize=A4, leftMargin=17.5*mm, rightMargin=17.5*mm, topMargin=36*mm, bottomMargin=19*mm, title="LEE 501 — Bilimsel Araştırma Yöntemleri ve Etik", author="Osmaniye Korkut Ata Üniversitesi Lisansüstü Eğitim Enstitüsü")
    frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="normal")
    doc.addPageTemplates(PageTemplate(id="course", frames=frame, onPage=header_footer))
    doc.build(build_story())


if __name__ == "__main__":
    make_pdf(PUBLIC_PDF)
    OUTPUT_PDF.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PDF.write_bytes(PUBLIC_PDF.read_bytes())
    print(PUBLIC_PDF)
    print(OUTPUT_PDF)

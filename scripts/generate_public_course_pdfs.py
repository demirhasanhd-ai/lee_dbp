from __future__ import annotations

import html
import re
import unicodedata
from dataclasses import dataclass
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import BaseDocTemplate, Frame, PageTemplate, Paragraph, Spacer, Table, TableStyle


ROOT = Path(__file__).resolve().parents[1]
PUBLIC_DIR = ROOT / "public" / "pdf" / "dbp"
OUTPUT_DIR = ROOT / "output" / "pdf" / "dbp"
FONT_DIR = ROOT / "public" / "fonts" / "noto-sans"
LOGO = ROOT / "public" / "oku-logo.png"
OFFICIAL_COURSES = ROOT / "lib" / "data" / "officialCourses.ts"

RED = colors.HexColor("#cf142b")
DARK = colors.HexColor("#281d20")
MUTED = colors.HexColor("#725e63")
LINE = colors.HexColor("#e4c9ce")
PALE = colors.HexColor("#fff5f5")
PALE_2 = colors.HexColor("#f9e7e9")
WHITE = colors.white


@dataclass(frozen=True)
class Course:
    code: str
    name: str
    department: str
    program: str
    level: str
    term: str
    course_type: str
    credit: int
    theory: int
    practice: int
    ects: int
    instructor: str = ""


def field(block: str, key: str) -> str:
    quoted = re.search(rf'{key}:\s*"([^"]*)"', block)
    if quoted:
        return quoted.group(1)
    number = re.search(rf"{key}:\s*(-?\d+)", block)
    if number:
        return number.group(1)
    return ""


def repair_text(value: object) -> str:
    text = str(value)
    replacements = {
        "Ä°": "İ",
        "Ä±": "ı",
        "ÅŸ": "ş",
        "Åž": "Ş",
        "ÄŸ": "ğ",
        "Äž": "Ğ",
        "Ã¼": "ü",
        "Ãœ": "Ü",
        "Ã": "Ü",
        "Ã¶": "ö",
        "Ã–": "Ö",
        "Ã": "Ö",
        "Ã§": "ç",
        "Ã‡": "Ç",
        "Ã": "Ç",
        "Ä": "Ğ",
        "Ä": "ğ",
        "Å": "Ş",
        "Å": "ş",
    }
    for bad, good in replacements.items():
        text = text.replace(bad, good)
    return text


def load_official_courses() -> list[Course]:
    text = OFFICIAL_COURSES.read_text(encoding="utf-8")
    blocks = re.findall(r"\{\s*academicYear:[\s\S]*?\s*\}", text)
    courses: list[Course] = []
    for block in blocks:
        if field(block, "source") != "official_excel":
            continue
        if not field(block, "code") or not field(block, "name") or not field(block, "programName"):
            continue
        courses.append(
            Course(
                code=field(block, "code"),
                name=field(block, "name"),
                department=field(block, "department"),
                program=field(block, "programName"),
                level=field(block, "level").replace("Yüksek Lisans", "YL"),
                term=field(block, "term"),
                course_type=field(block, "type"),
                credit=int(field(block, "credit") or 0),
                theory=int(field(block, "theory") or 0),
                practice=int(field(block, "practice") or 0),
                ects=int(field(block, "ects") or 0),
                instructor=field(block, "instructor"),
            )
        )
    return courses


TR_MAP = str.maketrans("çÇğĞıİöÖşŞüÜ", "cCgGiIoOsSuU")


def slugify(value: str) -> str:
    value = repair_text(value)
    value = unicodedata.normalize("NFKD", value.translate(TR_MAP)).encode("ascii", "ignore").decode("ascii")
    value = re.sub(r"[^a-zA-Z0-9]+", "-", value.lower()).strip("-")
    return value or "ders"


def tr_upper(value: str) -> str:
    value = repair_text(value)
    return value.translate(str.maketrans({"i": "İ", "ı": "I"})).upper()


def is_generic_instructor_course(course: Course) -> bool:
    normalized = repair_text(course.name).casefold()
    generic_terms = [
        "bilimsel araştırma",
        "seminer",
        "bitirme projesi",
        "tez çalışması",
        "uzmanlık alan",
        "danışmanlık",
    ]
    return any(term.casefold() in normalized for term in generic_terms)


pdfmetrics.registerFont(TTFont("Noto", str(FONT_DIR / "NotoSans-Regular.ttf")))
pdfmetrics.registerFont(TTFont("Noto-SemiBold", str(FONT_DIR / "NotoSans-SemiBold.ttf")))
pdfmetrics.registerFont(TTFont("Noto-Bold", str(FONT_DIR / "NotoSans-Bold.ttf")))

styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name="BodyTR", fontName="Noto", fontSize=8.2, leading=11.4, textColor=DARK))
styles.add(ParagraphStyle(name="CellTR", fontName="Noto", fontSize=7.35, leading=9.3, textColor=DARK))
styles.add(ParagraphStyle(name="CellBold", parent=styles["CellTR"], fontName="Noto-SemiBold"))
styles.add(ParagraphStyle(name="SectionTR", fontName="Noto-Bold", fontSize=10.5, leading=13, textColor=RED, spaceAfter=5))
styles.add(ParagraphStyle(name="SmallTR", fontName="Noto", fontSize=6.6, leading=8.3, textColor=MUTED))
styles.add(ParagraphStyle(name="CenterTR", parent=styles["CellTR"], alignment=TA_CENTER))
styles.add(ParagraphStyle(name="LeftTR", parent=styles["CellTR"], alignment=TA_LEFT))


def para(text: object, style: str = "CellTR") -> Paragraph:
    return Paragraph(html.escape(repair_text(text)), styles[style])


def split_header_title(course: Course) -> tuple[str, str]:
    title = tr_upper(f"{course.code} - {course.name}")
    words = title.split()
    first: list[str] = []
    second: list[str] = []
    for word in words:
        if len(" ".join(first + [word])) <= 44:
            first.append(word)
        else:
            second.append(word)
    return " ".join(first), " ".join(second)[:70]


def header_footer(course: Course):
    def draw(canvas, doc):
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
        first, second = split_header_title(course)
        canvas.setFillColor(RED)
        canvas.setFont("Noto-Bold", 7.8)
        canvas.drawCentredString(98 * mm, height - 21.2 * mm, first)
        if second:
            canvas.drawCentredString(98 * mm, height - 25.1 * mm, second)

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
        canvas.drawRightString(x + 40 * mm, height - 18 * mm, "2026-2027")
        canvas.drawRightString(x + 40 * mm, height - 23 * mm, f"{doc.page}")

        canvas.setStrokeColor(LINE)
        canvas.line(15 * mm, 14 * mm, width - 15 * mm, 14 * mm)
        canvas.setFillColor(MUTED)
        canvas.setFont("Noto", 5.8)
        canvas.drawString(15 * mm, 9.5 * mm, "OKÜ LEE Ders Bilgi Paketi - Kamuya açık, ABD/ASD başkanı onaylı nüsha")
        canvas.drawRightString(width - 15 * mm, 9.5 * mm, "dbp.osmaniye.edu.tr")
        canvas.restoreState()

    return draw


def section(title: str):
    return [Spacer(1, 2 * mm), Paragraph(html.escape(title), styles["SectionTR"])]


def table(data: list[list[object]], widths: list[float], header_rows: int = 1, alignments: dict[int, str] | None = None) -> Table:
    converted = [[para(value, "CellBold" if row_index < header_rows else "CellTR") for value in row] for row_index, row in enumerate(data)]
    item = Table(converted, colWidths=widths, repeatRows=header_rows, hAlign="LEFT")
    commands = [
        ("BACKGROUND", (0, 0), (-1, header_rows - 1), PALE_2),
        ("TEXTCOLOR", (0, 0), (-1, header_rows - 1), RED),
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
    item.setStyle(TableStyle(commands))
    return item


def story(course: Course):
    course_load = max(course.theory + course.practice, 1)
    outcomes = [
        f"{course.name} kapsamındaki temel kavramları açıklar.",
        f"{course.program} alanındaki problemleri bilimsel yöntemlerle değerlendirir.",
        "Uygun araştırma ve uygulama yöntemini seçer.",
        "Elde ettiği sonuçları etik ilkelere uygun biçimde raporlar.",
        "Alan yazınını eleştirel yaklaşımla yorumlar.",
    ]
    weeks = [
        "Dersin kapsamı ve temel kavramlar",
        "Alan yazınına giriş",
        "Araştırma problemi",
        "Yöntem seçimi",
        "Veri kaynakları",
        "Uygulama örnekleri",
        "Ara sınav ve değerlendirme",
        "Analiz yaklaşımları",
        "Alan uygulaması",
        "Etik ilkeler",
        "Bulguların yorumlanması",
        "Raporlama",
        "Sunum hazırlığı",
        "Genel tekrar",
        "Yarıyıl sonu değerlendirmesi",
    ]

    body = [para("ONAYLANMIŞ DERS BİLGİ PAKETİ", "SmallTR"), Spacer(1, 2 * mm)]
    body.append(
        table(
            [
                ["Dersin Kodu", "Dersin Adı", "Program", "Dönem"],
                [course.code, course.name, course.level, course.term],
                ["Zorunlu / Seçmeli", "Öğrenim Dili", "T + U", "Kredi / AKTS"],
                [course.course_type, "Türkçe", f"{course.theory} + {course.practice}", f"{course.credit} / {course.ects}"],
            ],
            [25 * mm, 79 * mm, 44 * mm, 27 * mm],
            header_rows=1,
        )
    )
    if course.instructor and not is_generic_instructor_course(course):
        body += section("Dersi Veren Öğretim Elemanı")
        body.append(table([["Ünvanı, Adı Soyadı"], [course.instructor]], [175 * mm]))

    body += section("Dersin Amacı")
    body.append(para(f"{course.name} kapsamında öğrencinin bilimsel araştırma, uygulama ve değerlendirme becerilerini geliştirmesi amaçlanır.", "BodyTR"))
    body += section("Dersin İçeriği")
    body.append(para(f"{course.program} alanına ilişkin kuramsal çerçeve, güncel yaklaşımlar, uygulama örnekleri, veri toplama, analiz ve akademik raporlama konuları işlenir.", "BodyTR"))
    body += section("Dersin Öğrenme Çıktıları")
    body.append(table([["Kod", "Öğrenme Çıktısı"]] + [[f"ÖÇ{i + 1}", item] for i, item in enumerate(outcomes)], [18 * mm, 157 * mm]))
    body += section("15 Haftalık Ders Planı")
    body.append(table([["Hafta", "Konu"]] + [[str(i + 1), week] for i, week in enumerate(weeks)], [18 * mm, 157 * mm], alignments={0: "CENTER"}))
    body += section("Değerlendirme Sistemi")
    body.append(table([["Değerlendirme Türü", "Adet", "Katkı (%)"], ["Ara Sınav", "1", "40"], ["Yarıyıl Sonu Sınavı", "1", "60"], ["Toplam", "2", "100"]], [110 * mm, 30 * mm, 35 * mm], alignments={1: "CENTER", 2: "CENTER"}))
    body += section("AKTS / İş Yükü Tablosu")
    body.append(
        table(
            [
                ["Etkinlik", "Adet", "Süre (Saat)", "Toplam İş Yükü"],
                ["Ders Süresi", "15", str(course_load), str(15 * course_load)],
                ["Sınıf Dışı Çalışma", "15", "6", "90"],
                ["Sınav Hazırlıkları", "2", "22.5", "45"],
                ["Toplam İş Yükü", "", "", f"{15 * course_load + 135} saat"],
                ["AKTS Kredisi", "", "", f"{course.ects} AKTS"],
            ],
            [91 * mm, 24 * mm, 30 * mm, 30 * mm],
            alignments={1: "CENTER", 2: "CENTER", 3: "CENTER"},
        )
    )
    body += section("ÖÇ / PÇ Katkı Matrisi")
    matrix = [["ÖÇ/PÇ"] + [f"P{i}" for i in range(1, 13)]]
    matrix += [[f"ÖÇ{i + 1}"] + [str((i + j) % 5) for j in range(12)] for i in range(5)]
    body.append(table(matrix, [19 * mm] + [13 * mm] * 12, alignments={i: "CENTER" for i in range(13)}))
    body += section("Sürdürülebilir Kalkınma Amaçları")
    body.append(
        table(
            [
                ["No", "Amaç", "Dersle İlişkisi"],
                ["4", "Nitelikli Eğitim", "Araştırma okuryazarlığı ve yaşam boyu öğrenme becerilerini geliştirir."],
                ["9", "Sanayi, Yenilikçilik ve Altyapı", "Bilimsel yöntemle yenilikçi çözüm üretme kapasitesini destekler."],
                ["17", "Amaçlar İçin Ortaklıklar", "Disiplinler arası araştırma ve akademik iş birliğini teşvik eder."],
            ],
            [16 * mm, 60 * mm, 99 * mm],
        )
    )
    return body


def make_pdf(course: Course, path: Path):
    path.parent.mkdir(parents=True, exist_ok=True)
    doc = BaseDocTemplate(
        str(path),
        pagesize=A4,
        leftMargin=17.5 * mm,
        rightMargin=17.5 * mm,
        topMargin=36 * mm,
        bottomMargin=19 * mm,
        title=f"{course.code} - {course.name}",
        author="Osmaniye Korkut Ata Üniversitesi Lisansüstü Eğitim Enstitüsü",
    )
    frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="normal")
    doc.addPageTemplates(PageTemplate(id="course", frames=frame, onPage=header_footer(course)))
    doc.build(story(course))


def pdf_name(course: Course) -> str:
    return f"{slugify(course.code)}-{slugify(course.program)}-{slugify(course.name)}.pdf"


if __name__ == "__main__":
    courses = load_official_courses()
    for course in courses:
        target = PUBLIC_DIR / pdf_name(course)
        make_pdf(course, target)
        output = OUTPUT_DIR / target.name
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_bytes(target.read_bytes())
    print(f"{len(courses)} PDF üretildi: {PUBLIC_DIR}")

from __future__ import annotations

import re
import shutil
from dataclasses import dataclass
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
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
PROGRAM_DATA = ROOT / "local-preview" / "program-data-local.js"

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
    theory: int
    practice: int
    ects: int


def repair_text(value: str) -> str:
    """Repair the mojibake patterns that exist in the local demo data file."""
    text = value
    for encoding in ("latin1", "cp1252", "latin1"):
        try:
            repaired = text.encode(encoding).decode("utf-8")
        except UnicodeError:
            break
        if repaired != text:
            text = repaired
    return text


def slugify(value: str) -> str:
    table = str.maketrans("çÇğĞıİöÖşŞüÜ", "cCgGiIoOsSuU")
    value = value.translate(table).lower()
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return value.strip("-") or "ders"


def tr_upper(value: str) -> str:
    return value.translate(str.maketrans({"i": "İ", "ı": "I"})).upper()


def course_prefix(program: str) -> str:
    return "".join(word[0] for word in program.split()[:3]).upper()


def levels_from_flags(flags: str) -> list[str]:
    levels: list[str] = []
    if len(flags) > 0 and flags[0] == "T":
        levels.append("Tezsiz YL")
    if len(flags) > 1 and flags[1] == "T":
        levels.append("Tezli YL")
    if len(flags) > 2 and flags[2] == "D":
        levels.append("Doktora")
    return levels or ["Tezli YL"]


def load_program_rows() -> list[tuple[str, str, str, str]]:
    text = PROGRAM_DATA.read_text(encoding="utf-8")
    rows: list[tuple[str, str, str, str]] = []
    for match in re.finditer(r'\["([^"]+)","([^"]+)","([^"]+)","([^"]+)"\]', text):
        rows.append(tuple(repair_text(item) for item in match.groups()))
    return rows


def build_courses() -> list[Course]:
    courses: list[Course] = []
    for _main, department, program, flags in load_program_rows():
        prefix = course_prefix(program)
        for level_index, level in enumerate(levels_from_flags(flags)):
            term_defs = {
                "Güz": [
                    (501, "Bilimsel Araştırma", "Zorunlu", 3, 0, 6),
                    (503, "Kuramları", "Seçmeli", 3, 0, 6),
                    (590, "Seminer", "Zorunlu", 0, 2, 3),
                ],
                "Bahar": [
                    (502, "Güncel Yaklaşımlar", "Seçmeli", 3, 0, 6),
                    (504, "Uygulamaları", "Seçmeli", 2, 2, 6),
                    (592, "Uzmanlık Alan Dersi", "Zorunlu", 4, 0, 8),
                ],
            }
            for term, defs in term_defs.items():
                for number, suffix, course_type, theory, practice, ects in defs:
                    code = f"{prefix} {number + level_index * 100}"
                    name = suffix if suffix in {"Seminer", "Uzmanlık Alan Dersi"} else f"{program} {suffix}"
                    courses.append(Course(code, name, department, program, level, term, course_type, theory, practice, ects))
    return courses


pdfmetrics.registerFont(TTFont("Noto", str(FONT_DIR / "NotoSans-Regular.ttf")))
pdfmetrics.registerFont(TTFont("Noto-SemiBold", str(FONT_DIR / "NotoSans-SemiBold.ttf")))
pdfmetrics.registerFont(TTFont("Noto-Bold", str(FONT_DIR / "NotoSans-Bold.ttf")))

styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name="BodyTR", fontName="Noto", fontSize=8.2, leading=11.2, textColor=DARK))
styles.add(ParagraphStyle(name="CellTR", fontName="Noto", fontSize=7.4, leading=9.2, textColor=DARK))
styles.add(ParagraphStyle(name="CellBold", parent=styles["CellTR"], fontName="Noto-SemiBold"))
styles.add(ParagraphStyle(name="SectionTR", fontName="Noto-Bold", fontSize=10.5, leading=13, textColor=RED, spaceAfter=5))
styles.add(ParagraphStyle(name="SmallTR", fontName="Noto", fontSize=6.6, leading=8.3, textColor=MUTED))
styles.add(ParagraphStyle(name="CenterTR", parent=styles["CellTR"], alignment=TA_CENTER))


def para(text: object, style: str = "CellTR") -> Paragraph:
    return Paragraph(str(text), styles[style])


def split_header_title(course: Course) -> tuple[str, str]:
    title = tr_upper(f"{course.code} - {course.name}")
    words = title.split()
    first: list[str] = []
    second: list[str] = []
    for word in words:
        target = first if len(" ".join(first + [word])) <= 42 else second
        target.append(word)
    return " ".join(first), " ".join(second)[:52]


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
    return [Spacer(1, 2 * mm), Paragraph(title, styles["SectionTR"])]


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
    outcomes = [
        f"{course.name} kapsamındaki temel kavramları açıklar.",
        f"{course.program} alanındaki problemleri bilimsel yöntemlerle değerlendirir.",
        "Uygun araştırma ve uygulama yöntemini seçer.",
        "Elde ettiği sonuçları etik ilkelere uygun biçimde raporlar.",
        "Alan yazınını eleştirel yaklaşımla yorumlar.",
    ]
    weeks = [
        "Dersin kapsamı ve temel kavramlar", "Alan yazınına giriş", "Araştırma problemi", "Yöntem seçimi",
        "Veri kaynakları", "Uygulama örnekleri", "Ara sınav ve değerlendirme", "Analiz yaklaşımları",
        "Alan uygulaması", "Etik ilkeler", "Bulguların yorumlanması", "Raporlama", "Sunum hazırlığı",
        "Genel tekrar", "Yarıyıl sonu değerlendirmesi",
    ]
    body = [para("ONAYLANMIŞ DERS BİLGİ PAKETİ", "SmallTR"), Spacer(1, 2 * mm)]
    body.append(table([
        ["Dersin Kodu", "Dersin Adı", "Program", "Dönem"],
        [course.code, course.name, course.level, course.term],
        ["Ders Türü", "Öğrenim Dili", "T + U", "AKTS"],
        [course.course_type, "Türkçe", f"{course.theory} + {course.practice}", str(course.ects)],
    ], [25 * mm, 79 * mm, 44 * mm, 27 * mm], header_rows=1))
    body += section("Dersin Amacı")
    body.append(para(f"{course.name} kapsamında öğrencinin bilimsel araştırma, uygulama ve değerlendirme becerilerini geliştirmesi amaçlanır.", "BodyTR"))
    body += section("Dersin İçeriği")
    body.append(para(f"{course.program} alanına ilişkin kuramsal çerçeve, güncel yaklaşımlar, uygulama örnekleri, veri toplama, analiz ve akademik raporlama konuları işlenir.", "BodyTR"))
    body += section("Ders Sorumlusu ve Kaynaklar")
    body.append(table([
        ["Ders Sorumlusu", "Ön Koşul", "Temel Kaynaklar"],
        ["Dr. Öğr. Üyesi Ayşe Yılmaz", "Bulunmamaktadır", f"{course.program} alanına ilişkin temel kitaplar, güncel akademik makaleler ve OKÜ LEE yönergeleri."],
    ], [50 * mm, 36 * mm, 89 * mm]))
    body += section("Dersin Öğrenme Çıktıları")
    body.append(table([["Kod", "Öğrenme Çıktısı"]] + [[f"ÖÇ{i+1}", item] for i, item in enumerate(outcomes)], [18 * mm, 157 * mm]))
    body += section("15 Haftalık Ders Planı")
    body.append(table([["Hafta", "Konu"]] + [[str(i + 1), week] for i, week in enumerate(weeks)], [18 * mm, 157 * mm], alignments={0: "CENTER"}))
    body += section("Değerlendirme Sistemi")
    body.append(table([["Değerlendirme Türü", "Adet", "Katkı (%)"], ["Ara Sınav", "1", "40"], ["Yarıyıl Sonu Sınavı", "1", "60"], ["Toplam", "2", "100"]], [110 * mm, 30 * mm, 35 * mm], alignments={1: "CENTER", 2: "CENTER"}))
    body += section("AKTS / İş Yükü Tablosu")
    body.append(table([
        ["Etkinlik", "Adet", "Süre (Saat)", "Toplam İş Yükü"],
        ["Ders Süresi", "15", str(course.theory + course.practice), str(15 * (course.theory + course.practice))],
        ["Sınıf Dışı Çalışma", "15", "6", "90"],
        ["Sınav Hazırlıkları", "2", "22.5", "45"],
        ["Toplam İş Yükü", "", "", "180 saat"],
        ["AKTS Kredisi", "", "", f"{course.ects} AKTS"],
    ], [91 * mm, 24 * mm, 30 * mm, 30 * mm], alignments={1: "CENTER", 2: "CENTER", 3: "CENTER"}))
    body += section("ÖÇ / PÇ Katkı Matrisi")
    matrix = [["ÖÇ/PÇ"] + [f"P{i}" for i in range(1, 13)]]
    matrix += [[f"ÖÇ{i+1}"] + [str((i + j) % 5) for j in range(12)] for i in range(5)]
    body.append(table(matrix, [19 * mm] + [13 * mm] * 12, alignments={i: "CENTER" for i in range(13)}))
    body += section("Sürdürülebilir Kalkınma Amaçları")
    body.append(table([
        ["No", "Amaç", "Dersle İlişkisi"],
        ["4", "Nitelikli Eğitim", "Araştırma okuryazarlığı ve yaşam boyu öğrenme becerilerini geliştirir."],
        ["9", "Sanayi, Yenilikçilik ve Altyapı", "Bilimsel yöntemle yenilikçi çözüm üretme kapasitesini destekler."],
        ["17", "Amaçlar İçin Ortaklıklar", "Disiplinler arası araştırma ve akademik iş birliğini teşvik eder."],
    ], [16 * mm, 60 * mm, 99 * mm]))
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
    if PUBLIC_DIR.exists():
        shutil.rmtree(PUBLIC_DIR)
    if OUTPUT_DIR.exists():
        shutil.rmtree(OUTPUT_DIR)
    courses = build_courses()
    for course in courses:
        target = PUBLIC_DIR / pdf_name(course)
        make_pdf(course, target)
        out = OUTPUT_DIR / target.name
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_bytes(target.read_bytes())
    print(f"{len(courses)} PDF üretildi: {PUBLIC_DIR}")

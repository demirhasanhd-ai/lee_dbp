from __future__ import annotations

import html
import json
import re
import unicodedata
import argparse
import os
from dataclasses import dataclass
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import BaseDocTemplate, Frame, Image, PageTemplate, Paragraph, Spacer, Table, TableStyle


ROOT = Path(__file__).resolve().parents[1]
PUBLIC_DIR = ROOT / "public" / "pdf" / "dbp"
OUTPUT_DIR = ROOT / "output" / "pdf" / "dbp"
FONT_DIR = ROOT / "public" / "fonts" / "noto-sans"
LOGO = ROOT / "public" / "oku-logo.png"
SDG_ASSET_DIR = ROOT / "public" / "sdg"
SDG_LOGO = SDG_ASSET_DIR / "sdg_logo.png"
COURSE_DATA = Path(os.environ.get("DBP_COURSE_DATA_FILE", str(ROOT / "data" / "courses" / "2026-2027.json")))
OFFICIAL_COURSES = Path(os.environ.get("DBP_OFFICIAL_COURSES_FILE", str(ROOT / "lib" / "data" / "officialCourses.ts")))
PUBLIC_DBP_URL = "https://e-enstitu.osmaniye.edu.tr/dbp/"

RED = colors.HexColor("#cf142b")
DARK = colors.HexColor("#281d20")
MUTED = colors.HexColor("#725e63")
LINE = colors.HexColor("#e4c9ce")
PALE = colors.HexColor("#fff5f5")
PALE_2 = colors.HexColor("#f9e7e9")
WHITE = colors.white

DEFAULT_SDG_IDS = ("4", "9", "17")
SDG_GOALS = {
    "1": "Yoksullu\u011fa Son",
    "2": "A\u00e7l\u0131\u011fa Son",
    "3": "Sa\u011fl\u0131k ve Kaliteli Ya\u015fam",
    "4": "Nitelikli E\u011fitim",
    "5": "Toplumsal Cinsiyet E\u015fitli\u011fi",
    "6": "Temiz Su ve Sanitasyon",
    "7": "Eri\u015filebilir ve Temiz Enerji",
    "8": "\u0130nsana Yak\u0131\u015f\u0131r \u0130\u015f ve Ekonomik B\u00fcy\u00fcme",
    "9": "Sanayi, Yenilik\u00e7ilik ve Altyap\u0131",
    "10": "E\u015fitsizliklerin Azalt\u0131lmas\u0131",
    "11": "S\u00fcrd\u00fcr\u00fclebilir \u015eehirler ve Topluluklar",
    "12": "Sorumlu \u00dcretim ve T\u00fcketim",
    "13": "\u0130klim Eylemi",
    "14": "Sudaki Ya\u015fam",
    "15": "Karasal Ya\u015fam",
    "16": "Bar\u0131\u015f, Adalet ve G\u00fc\u00e7l\u00fc Kurumlar",
    "17": "Ama\u00e7lar i\u00e7in Ortakl\u0131klar",
}


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
    if COURSE_DATA.exists():
        rows = json.loads(COURSE_DATA.read_text(encoding="utf-8"))
        return [
            Course(
                code=row["code"],
                name=row["name"],
                department=row["department"],
                program=row["programName"],
                level=row["level"].replace("Yüksek Lisans", "YL"),
                term=row["term"],
                course_type=row["type"],
                credit=int(row["credit"]),
                theory=int(row["theory"]),
                practice=int(row["practice"]),
                ects=int(row["ects"]),
                instructor=row.get("instructor", ""),
            )
            for row in rows
        ]

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


TR_MAP = str.maketrans("\u00e7\u00c7\u011f\u011e\u0131\u0130\u00f6\u00d6\u015f\u015e\u00fc\u00dc", "cCgGiIoOsSuU")


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
styles.add(ParagraphStyle(name="SdgCardTitle", fontName="Noto-Bold", fontSize=7.2, leading=8.8, textColor=DARK))


def para(text: object, style: str = "CellTR") -> Paragraph:
    return Paragraph(html.escape(repair_text(text)), styles[style])


def pdf_image(path: Path, size: float) -> Image | str:
    if not path.exists():
        return ""
    image = Image(str(path), width=size, height=size)
    image.hAlign = "CENTER"
    return image


def sdg_title():
    if not SDG_LOGO.exists():
        return section("Sürdürülebilir Kalkınma Amaçları")
    return [
        Spacer(1, 2 * mm),
        Table(
            [[pdf_image(SDG_LOGO, 11 * mm), Paragraph("Sürdürülebilir Kalkınma Amaçları", styles["SectionTR"])]],
            colWidths=[14 * mm, 161 * mm],
            hAlign="LEFT",
            style=TableStyle([
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 4),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
            ]),
        ),
    ]


def sdg_card(goal_id: str) -> Table:
    title = f"{goal_id} \u00b7 {SDG_GOALS.get(goal_id, f'SKA {goal_id}')}"
    card = Table(
        [
            [pdf_image(SDG_ASSET_DIR / f"sdg_{goal_id}.png", 25 * mm)],
            [Paragraph(html.escape(repair_text(title)), styles["SdgCardTitle"])],
        ],
        colWidths=[32 * mm],
        hAlign="LEFT",
    )
    card.setStyle(TableStyle([
        ("BOX", (0, 0), (-1, -1), 0.45, LINE),
        ("BACKGROUND", (0, 0), (-1, -1), colors.white),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("ALIGN", (0, 0), (0, 0), "CENTER"),
        ("LEFTPADDING", (0, 0), (-1, -1), 4),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4),
        ("TOPPADDING", (0, 0), (0, 0), 4),
        ("BOTTOMPADDING", (0, 0), (0, 0), 3),
        ("TOPPADDING", (0, 1), (0, 1), 5),
        ("BOTTOMPADDING", (0, 1), (0, 1), 6),
    ]))
    return card


def sdg_grid(goal_ids: list[str]) -> Table:
    columns = 3
    rows: list[list[object]] = []
    for index in range(0, len(goal_ids), columns):
        cards: list[object] = [sdg_card(goal_id) for goal_id in goal_ids[index:index + columns]]
        cards.extend([""] * (columns - len(cards)))
        rows.append(cards)
    grid = Table(rows, colWidths=[36 * mm, 36 * mm, 36 * mm], hAlign="LEFT")
    grid.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]))
    return grid


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
        footer_url_x = width - 15 * mm
        footer_url_y = 9.5 * mm
        footer_url_width = canvas.stringWidth(PUBLIC_DBP_URL, "Noto", 5.8)
        canvas.drawRightString(footer_url_x, footer_url_y, PUBLIC_DBP_URL)
        canvas.linkURL(
            PUBLIC_DBP_URL,
            (
                footer_url_x - footer_url_width - 1 * mm,
                footer_url_y - 1 * mm,
                footer_url_x + 0.5 * mm,
                footer_url_y + 3 * mm,
            ),
            relative=0,
            thickness=0,
        )
        canvas.restoreState()

    return draw


def section(title: str):
    return [Spacer(1, 2 * mm), Paragraph(html.escape(title), styles["SectionTR"])]


def table(
    data: list[list[object]],
    widths: list[float],
    header_rows: int = 1,
    alignments: dict[int, str] | None = None,
    header_row_indices: set[int] | None = None,
) -> Table:
    styled_header_rows = header_row_indices if header_row_indices is not None else set(range(header_rows))
    converted = [
        [value if hasattr(value, "wrapOn") else para(value, "CellBold" if row_index in styled_header_rows else "CellTR") for value in row]
        for row_index, row in enumerate(data)
    ]
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
    for row_index in sorted(styled_header_rows - set(range(header_rows))):
        commands.extend([
            ("BACKGROUND", (0, row_index), (-1, row_index), PALE_2),
            ("TEXTCOLOR", (0, row_index), (-1, row_index), RED),
        ])
    if alignments:
        for col, alignment in alignments.items():
            commands.append(("ALIGN", (col, 0), (col, -1), alignment))
    item.setStyle(TableStyle(commands))
    return item


def key_value_table(data: list[list[object]], widths: list[float]) -> Table:
    converted = []
    for row in data:
        converted.append([
            para(row[0], "CellBold"),
            para(row[1], "CellTR"),
            para(row[2], "CellBold"),
            para(row[3], "CellTR"),
        ])
    item = Table(converted, colWidths=widths, hAlign="LEFT")
    item.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (0, -1), PALE_2),
        ("BACKGROUND", (2, 0), (2, -1), PALE_2),
        ("TEXTCOLOR", (0, 0), (0, -1), RED),
        ("TEXTCOLOR", (2, 0), (2, -1), RED),
        ("GRID", (0, 0), (-1, -1), 0.45, LINE),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 5),
        ("RIGHTPADDING", (0, 0), (-1, -1), 5),
        ("TOPPADDING", (0, 0), (-1, -1), 4.2),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4.2),
    ]))
    return item


def number(value: object, fallback: float = 0) -> float:
    try:
        return float(value)
    except (TypeError, ValueError):
        return fallback


def format_number(value: object) -> str:
    numeric = number(value)
    return str(int(numeric)) if numeric.is_integer() else f"{numeric:g}"


def clean_items(values: object) -> list[str]:
    if not isinstance(values, list):
        return []
    return [repair_text(item).strip() for item in values if repair_text(item).strip()]


def package_weekly_topics(package_data: dict) -> list[str]:
    weekly = package_data.get("weeklyTopics")
    if isinstance(weekly, dict):
        return [
            repair_text(value).strip()
            for _, value in sorted(weekly.items(), key=lambda item: number(item[0]))
            if repair_text(value).strip()
        ]
    return clean_items(weekly)


def package_assessment_rows(package_data: dict) -> list[list[object]]:
    rows = []
    for item in package_data.get("assessments") or []:
        if not isinstance(item, dict):
            continue
        name = repair_text(item.get("name") or "").strip()
        if name:
            rows.append([name, item.get("count", ""), item.get("weight", "")])
    return rows


def package_workload_rows(package_data: dict) -> tuple[list[list[object]], float]:
    workloads = package_data.get("workloads")
    rows: list[list[object]] = []
    if isinstance(workloads, dict):
        iterable = workloads.items()
    elif isinstance(workloads, list):
        iterable = ((item.get("name", ""), item) for item in workloads if isinstance(item, dict))
    else:
        iterable = []
    total = 0.0
    for name, item in iterable:
        if not isinstance(item, dict):
            continue
        count = number(item.get("count"))
        hours = number(item.get("hours"))
        row_total = number(item.get("total"), count * hours)
        total += row_total
        rows.append([repair_text(name), count, hours, row_total])
    return rows, total


def package_matrix_rows(package_data: dict, outcome_count: int) -> list[list[object]]:
    matrix = package_data.get("contributionMatrix")
    if not isinstance(matrix, list):
        return []
    rows = []
    for index, item in enumerate(matrix[:outcome_count]):
        if not isinstance(item, dict):
            continue
        rows.append([f"ÖÇ{index + 1}"] + [str(int(number(item.get(f"P{pc}")))) for pc in range(1, 12)])
    return rows


def resolve_bloom_level(outcome: str) -> str:
    normalized = repair_text(outcome).lower()
    if re.search(r"tasarlar|geliştirir|oluşturur|üretir|yapılandırır|dönüştürür|modeller|bütünleştirir|sentezler|önerir|hazırlar", normalized):
        return "Yaratma"
    if re.search(r"değerlendirir|eleştirir|savunur|gerekçelendirir|yorumlar|seçer|tartışır|önceliklendirir|kanıtlar", normalized):
        return "Değerlendirme"
    if re.search(r"analiz eder|çözümler|karşılaştırır|ayırt eder|inceler", normalized):
        return "Analiz"
    if re.search(r"uygular|kullanır|yürütür|hesaplar|planlar|raporlar|sunar|yanıtlar|belirler|görselleştirir|düzenler|ayırır|haritalar|test eder|yapar", normalized):
        return "Uygulama"
    if re.search(r"açıklar|özetler|sınıflandırır|ilişkilendirir", normalized):
        return "Anlama"
    return "Değerlendirme"


def load_package_payload(path: str) -> dict | None:
    if not path:
        return None
    payload = json.loads(Path(path).read_text(encoding="utf-8"))
    return payload if isinstance(payload, dict) else None


def course_from_payload(course: Course, payload: dict | None) -> Course:
    if not payload:
        return course
    row = payload.get("course") if isinstance(payload.get("course"), dict) else {}
    package_data = payload.get("package") if isinstance(payload.get("package"), dict) else {}
    identity = package_data.get("identity") if isinstance(package_data.get("identity"), dict) else {}
    details = package_data.get("detailFields") if isinstance(package_data.get("detailFields"), dict) else {}
    return Course(
        code=repair_text(identity.get("code") or row.get("code") or course.code),
        name=repair_text(identity.get("name") or row.get("name") or course.name),
        department=repair_text(row.get("department") or course.department),
        program=repair_text(row.get("programName") or course.program),
        level=repair_text(identity.get("level") or row.get("level") or course.level),
        term=repair_text(row.get("term") or course.term),
        course_type=repair_text(identity.get("type") or row.get("type") or course.course_type),
        credit=int(number(identity.get("credit"), number(row.get("credit"), course.credit))),
        theory=int(number(identity.get("theory"), number(row.get("theory"), course.theory))),
        practice=int(number(identity.get("practice"), number(row.get("practice"), course.practice))),
        ects=int(number(package_data.get("ects"), number(row.get("ects"), course.ects))),
        instructor=repair_text(details.get("instructors") or row.get("instructor") or course.instructor),
    )


def story(course: Course, package_data: dict | None = None):
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
    details = package_data.get("detailFields") if isinstance(package_data, dict) and isinstance(package_data.get("detailFields"), dict) else {}
    identity = package_data.get("identity") if isinstance(package_data, dict) and isinstance(package_data.get("identity"), dict) else {}
    package_outcomes = clean_items(package_data.get("outcomes")) if isinstance(package_data, dict) else []
    package_weeks = package_weekly_topics(package_data) if isinstance(package_data, dict) else []
    if package_outcomes:
        outcomes = package_outcomes
    if package_weeks:
        weeks = package_weeks
    language = repair_text(identity.get("language") or "Türkçe")
    purpose = repair_text(details.get("purpose") or f"{course.name} kapsamında öğrencinin bilimsel araştırma, uygulama ve değerlendirme becerilerini geliştirmesi amaçlanır.")
    content = repair_text(details.get("content") or f"{course.program} alanına ilişkin kuramsal çerçeve, güncel yaklaşımlar, uygulama örnekleri, veri toplama, analiz ve akademik raporlama konuları işlenir.")
    methods = repair_text(details.get("methods") or "")
    prerequisites = repair_text(details.get("prerequisites") or "")
    resources = repair_text(details.get("resources") or "")
    teaching_mode = repair_text(identity.get("teachingMode") or "Yüz Yüze")

    body = [para("ONAYLANMIŞ DERS BİLGİ PAKETİ", "SmallTR"), Spacer(1, 2 * mm)]
    body += section("Ders Genel Bilgileri")
    body.append(
        key_value_table(
            [
                ["Dersin Adı", course.name, "Ders Kodu", course.code],
                ["Öğrenim Dili", language, "Ders Düzeyi", course.level],
                ["Öğretim Şekli", teaching_mode, "Ders Türü", course.course_type],
                ["Teorik", format_number(course.theory), "Uygulama", format_number(course.practice)],
                ["Kredi", format_number(course.credit), "AKTS", format_number(course.ects)],
            ],
            [35 * mm, 60 * mm, 35 * mm, 45 * mm],
        )
    )
    if course.instructor and not is_generic_instructor_course(course):
        body += section("Dersi Veren Öğretim Elemanı")
        body.append(table([["Ünvanı, Adı Soyadı"], [course.instructor]], [175 * mm]))

    body += section("Dersin Amacı")
    body.append(para(purpose, "BodyTR"))
    body += section("Dersin İçeriği")
    body.append(para(content, "BodyTR"))
    if methods or resources or prerequisites:
        body += section("Öğretim Yöntemleri ve Kaynaklar")
        body.append(table([["Öğretim Yöntemleri", "Ön Koşul", "Kaynaklar"], [methods, prerequisites or "Yok", resources]], [58 * mm, 32 * mm, 85 * mm]))
    body += section("Dersin Öğrenme Çıktıları ve Bloom Düzeyleri")
    body.append(table(
        [["Kod", "Öğrenme Çıktısı", "Bloom Düzeyi"]] + [[f"ÖÇ{i + 1}", item, resolve_bloom_level(item)] for i, item in enumerate(outcomes)],
        [18 * mm, 122 * mm, 35 * mm],
    ))
    body += section("15 Haftalık Ders Planı")
    body.append(table([["Hafta", "Konu"]] + [[str(i + 1), week] for i, week in enumerate(weeks)], [18 * mm, 157 * mm], alignments={0: "CENTER"}))
    body += section("Değerlendirme Sistemi")
    assessment_rows = package_assessment_rows(package_data) if isinstance(package_data, dict) else []
    if not assessment_rows:
        assessment_rows = [["Ara Sınav", "1", "40"], ["Yarıyıl Sonu Sınavı", "1", "60"], ["Toplam", "2", "100"]]
    body.append(table([["Değerlendirme Türü", "Adet", "Katkı (%)"]] + assessment_rows, [110 * mm, 30 * mm, 35 * mm], alignments={1: "CENTER", 2: "CENTER"}))
    body += section("AKTS / İş Yükü Tablosu")
    workload_rows, workload_total = package_workload_rows(package_data) if isinstance(package_data, dict) else ([], 0)
    if workload_rows:
        workload_table_rows = [["Etkinlik", "Adet", "Süre (Saat)", "Toplam İş Yükü"]] + [
            [name, format_number(count), format_number(hours), format_number(total)]
            for name, count, hours, total in workload_rows
        ] + [["Toplam İş Yükü", "", "", format_number(workload_total)], ["AKTS Kredisi", "", "", f"{course.ects} AKTS"]]
    else:
        workload_table_rows = [
            ["Etkinlik", "Adet", "Süre (Saat)", "Toplam İş Yükü"],
            ["Ders Süresi", "15", str(course_load), str(15 * course_load)],
            ["Sınıf Dışı Çalışma", "15", "6", "90"],
            ["Sınav Hazırlıkları", "2", "22.5", "45"],
            ["Toplam İş Yükü", "", "", f"{15 * course_load + 135} saat"],
            ["AKTS Kredisi", "", "", f"{course.ects} AKTS"],
        ]
    body.append(
        table(
            workload_table_rows,
            [91 * mm, 24 * mm, 30 * mm, 30 * mm],
            alignments={1: "CENTER", 2: "CENTER", 3: "CENTER"},
        )
    )
    body += section("ÖÇ / PÇ Katkı Matrisi")
    matrix = [["ÖÇ/PÇ"] + [f"PÇ{i}" for i in range(1, 12)]]
    matrix_rows = package_matrix_rows(package_data, len(outcomes)) if isinstance(package_data, dict) else []
    if not matrix_rows:
        matrix_rows = [[f"ÖÇ{i + 1}"] + [str((i + j) % 5) for j in range(11)] for i in range(5)]
    matrix += matrix_rows
    body.append(table(matrix, [19 * mm] + [14.18 * mm] * 11, alignments={i: "CENTER" for i in range(12)}))
    body += sdg_title()
    sdg_ids = clean_items(package_data.get("sdgs")) if isinstance(package_data, dict) else []
    if not sdg_ids:
        sdg_ids = list(DEFAULT_SDG_IDS)
    body.append(sdg_grid(sdg_ids))
    return body


def make_pdf(course: Course, path: Path, package_data: dict | None = None):
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
    doc.build(story(course, package_data))


def pdf_name(course: Course) -> str:
    return f"{slugify(course.code)}-{slugify(course.program)}-{slugify(course.name)}.pdf"


def normalized_code(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "", slugify(value))


def find_course(courses: list[Course], code: str, program: str = "", name: str = "") -> Course | None:
    code_key = normalized_code(code)
    program_key = slugify(program) if program else ""
    name_key = slugify(name) if name else ""
    matches = [course for course in courses if normalized_code(course.code) == code_key]
    if program_key:
        matches = [course for course in matches if slugify(course.program) == program_key]
    if name_key:
        named = [course for course in matches if slugify(course.name) == name_key]
        if named:
            matches = named
    return matches[0] if len(matches) == 1 else None


def synthetic_course(code: str, name: str) -> Course:
    return Course(
        code=code,
        name=name or "Ders Bilgi Paketi",
        department="Lisansüstü Eğitim Enstitüsü",
        program="Ortak Dersler",
        level="Lisansüstü",
        term="Güz",
        course_type="Zorunlu",
        credit=3,
        theory=3,
        practice=0,
        ects=6,
    )


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="DBP ders PDF üreticisi")
    parser.add_argument("--single", action="store_true", help="Yalnızca tek bir ders PDF'i üretir.")
    parser.add_argument("--code", default="", help="Ders kodu")
    parser.add_argument("--program", default="", help="Program adı")
    parser.add_argument("--name", default="", help="Ders adı")
    parser.add_argument("--output", default="", help="Tek ders PDF hedef yolu")
    parser.add_argument("--department", default="", help="ABD / ASD adı")
    parser.add_argument("--level", default="", help="Program düzeyi")
    parser.add_argument("--package-json", default="", help="Veritabanından gelen ders paketi JSON dosyası")
    parser.add_argument("--all-static", action="store_true", help="Tüm dersler için statik PDF havuzunu yeniden üretir.")
    return parser.parse_args()


if __name__ == "__main__":
    args = parse_args()
    courses = load_official_courses()
    if args.single:
        if not args.code or not args.output:
            raise SystemExit("--single için --code ve --output zorunludur.")
        course = find_course(courses, args.code, args.program, args.name)
        if course is None and args.name:
            course = synthetic_course(args.code, args.name)
        if course is None:
            raise SystemExit(f"Ders bulunamadı: {args.code}")
        payload = load_package_payload(args.package_json)
        package_data = payload.get("package") if isinstance(payload, dict) and isinstance(payload.get("package"), dict) else None
        course = course_from_payload(course, payload)
        target = Path(args.output)
        make_pdf(course, target, package_data)
        print(target)
        raise SystemExit(0)

    if not args.all_static:
        print("Statik PDF toplu üretimi devre dışı. Dinamik üretim için --single kullanın.")
        raise SystemExit(0)

    for course in courses:
        target = PUBLIC_DIR / pdf_name(course)
        make_pdf(course, target)
        output = OUTPUT_DIR / target.name
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_bytes(target.read_bytes())
    print(f"{len(courses)} PDF üretildi: {PUBLIC_DIR}")

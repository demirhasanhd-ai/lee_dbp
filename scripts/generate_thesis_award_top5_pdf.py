#!/usr/bin/env python3
"""Generate the selected thesis-award category's top-five PDF list."""

from __future__ import annotations

import argparse
import json
from datetime import datetime
from html import escape
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle


PRIMARY = colors.HexColor("#D3132A")
INK = colors.HexColor("#251417")
MUTED = colors.HexColor("#775F64")
BORDER = colors.HexColor("#E8C8CC")
SOFT = colors.HexColor("#FBF1F2")
GOLD = colors.HexColor("#C68B00")


def register_fonts() -> tuple[str, str]:
    project_root = Path(__file__).resolve().parents[1]
    regular_candidates = [
        project_root / "public" / "fonts" / "noto-sans" / "NotoSans-Regular.ttf",
        Path("C:/Windows/Fonts/arial.ttf"),
        Path("C:/Windows/Fonts/DejaVuSans.ttf"),
        Path("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"),
    ]
    bold_candidates = [
        project_root / "public" / "fonts" / "noto-sans" / "NotoSans-Bold.ttf",
        Path("C:/Windows/Fonts/arialbd.ttf"),
        Path("C:/Windows/Fonts/DejaVuSans-Bold.ttf"),
        Path("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"),
    ]
    regular = next((path for path in regular_candidates if path.exists()), None)
    bold = next((path for path in bold_candidates if path.exists()), None)
    if not regular or not bold:
        raise RuntimeError("Türkçe karakterleri destekleyen Arial veya DejaVu Sans yazı tipi bulunamadı.")
    pdfmetrics.registerFont(TTFont("AwardSans", str(regular)))
    pdfmetrics.registerFont(TTFont("AwardSans-Bold", str(bold)))
    return "AwardSans", "AwardSans-Bold"


def tr_number(value: object) -> str:
    number = float(value or 0)
    if number.is_integer():
        return f"{int(number)}"
    return f"{number:.2f}".rstrip("0").rstrip(".").replace(".", ",")


def tr_datetime(value: str) -> str:
    try:
        parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
        return parsed.astimezone().strftime("%d.%m.%Y %H:%M")
    except (TypeError, ValueError):
        return value or "-"


def paragraph(value: object, style: ParagraphStyle) -> Paragraph:
    return Paragraph(escape(str(value or "-")), style)


def build_pdf(payload: dict, output: Path) -> None:
    regular, bold = register_fonts()
    output.parent.mkdir(parents=True, exist_ok=True)
    page_size = landscape(A4)
    doc = SimpleDocTemplate(
        str(output),
        pagesize=page_size,
        leftMargin=10 * mm,
        rightMargin=10 * mm,
        topMargin=11 * mm,
        bottomMargin=12 * mm,
        title=payload.get("title", "Tez Ödülü İlk 5 Aday Listesi"),
        author="Osmaniye Korkut Ata Üniversitesi - Lisansüstü Eğitim Enstitüsü",
    )

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        "AwardTitle", parent=styles["Title"], fontName=bold, fontSize=17,
        leading=21, textColor=INK, alignment=TA_LEFT, spaceAfter=3,
    )
    eyebrow_style = ParagraphStyle(
        "AwardEyebrow", parent=styles["Normal"], fontName=bold, fontSize=7,
        leading=9, textColor=PRIMARY, tracking=1.1,
    )
    meta_style = ParagraphStyle(
        "AwardMeta", parent=styles["Normal"], fontName=regular, fontSize=8,
        leading=11, textColor=MUTED,
    )
    cell_style = ParagraphStyle(
        "AwardCell", parent=styles["Normal"], fontName=regular, fontSize=7.2,
        leading=9.2, textColor=INK, alignment=TA_LEFT,
    )
    cell_bold_style = ParagraphStyle(
        "AwardCellBold", parent=cell_style, fontName=bold, fontSize=7.5,
    )
    score_style = ParagraphStyle(
        "AwardScore", parent=cell_style, fontName=bold, fontSize=9,
        leading=11, alignment=TA_CENTER, textColor=INK,
    )
    rank_style = ParagraphStyle(
        "AwardRank", parent=score_style, fontSize=11, textColor=GOLD,
    )
    header_style = ParagraphStyle(
        "AwardHeader", parent=cell_style, fontName=bold, fontSize=7,
        leading=8.5, textColor=INK, alignment=TA_CENTER,
    )

    story = [
        Paragraph("OSMANİYE KORKUT ATA ÜNİVERSİTESİ - LİSANSÜSTÜ EĞİTİM ENSTİTÜSÜ", eyebrow_style),
        Paragraph(escape(payload.get("title", "Tez Ödülü İlk 5 Aday Listesi")), title_style),
        Paragraph(
            f"{int(payload.get('year', 0))} tezleri | {escape(payload.get('field', '-'))} | "
            f"{escape(payload.get('degreeLabel', '-'))} | Oluşturulma: {escape(tr_datetime(payload.get('generatedAt', '')))}",
            meta_style,
        ),
        Spacer(1, 5 * mm),
    ]

    rows = [[
        Paragraph("Sıra", header_style),
        Paragraph("Öğrenci", header_style),
        Paragraph("Tezin adı", header_style),
        Paragraph("Tez danışmanı / danışmanları", header_style),
        Paragraph("ABD / ASD", header_style),
        Paragraph("EK-1", header_style),
        Paragraph("EK-2", header_style),
        Paragraph("Toplam", header_style),
    ]]
    for candidate in payload.get("candidates", [])[:5]:
        advisors = ", ".join(candidate.get("advisors") or []) or "Danışman bilgisi yok"
        rows.append([
            paragraph(candidate.get("rank", "-"), rank_style),
            paragraph(candidate.get("studentName"), cell_bold_style),
            paragraph(candidate.get("thesisTitle"), cell_style),
            paragraph(advisors, cell_style),
            paragraph(candidate.get("department"), cell_style),
            paragraph(tr_number(candidate.get("activityScore")), score_style),
            paragraph(tr_number(candidate.get("juryScore")), score_style),
            paragraph(tr_number(candidate.get("totalScore")), score_style),
        ])

    table = Table(
        rows,
        colWidths=[13 * mm, 30 * mm, 72 * mm, 47 * mm, 42 * mm, 20 * mm, 20 * mm, 22 * mm],
        repeatRows=1,
        hAlign="LEFT",
    )
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), SOFT),
        ("TEXTCOLOR", (0, 0), (-1, 0), INK),
        ("BOX", (0, 0), (-1, -1), 0.65, BORDER),
        ("INNERGRID", (0, 0), (-1, -1), 0.35, BORDER),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("ALIGN", (0, 0), (0, -1), "CENTER"),
        ("ALIGN", (-3, 1), (-1, -1), "CENTER"),
        ("LEFTPADDING", (0, 0), (-1, -1), 5),
        ("RIGHTPADDING", (0, 0), (-1, -1), 5),
        ("TOPPADDING", (0, 0), (-1, 0), 7),
        ("BOTTOMPADDING", (0, 0), (-1, 0), 7),
        ("TOPPADDING", (0, 1), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 1), (-1, -1), 8),
        ("BACKGROUND", (0, 1), (-1, -1), colors.white),
        ("BACKGROUND", (-1, 1), (-1, -1), colors.HexColor("#FFF3F4")),
        ("TEXTCOLOR", (-1, 1), (-1, -1), PRIMARY),
    ]))
    story.append(table)

    def footer(canvas, document):
        canvas.saveState()
        canvas.setStrokeColor(BORDER)
        canvas.setLineWidth(0.5)
        canvas.line(10 * mm, 8 * mm, page_size[0] - 10 * mm, 8 * mm)
        canvas.setFont(regular, 7)
        canvas.setFillColor(MUTED)
        canvas.drawString(10 * mm, 4.7 * mm, "LEE DBP - Tez Ödülü Değerlendirme Listesi")
        canvas.drawRightString(page_size[0] - 10 * mm, 4.7 * mm, f"Sayfa {document.page}")
        canvas.restoreState()

    doc.build(story, onFirstPage=footer, onLaterPages=footer)


def main() -> None:
    parser = argparse.ArgumentParser(description="Tez Ödülü ilk 5 aday PDF üreticisi")
    parser.add_argument("--input", required=True, help="Aday verilerini içeren JSON dosyası")
    parser.add_argument("--output", required=True, help="Oluşturulacak PDF dosyası")
    args = parser.parse_args()
    payload = json.loads(Path(args.input).read_text(encoding="utf-8"))
    build_pdf(payload, Path(args.output))


if __name__ == "__main__":
    main()

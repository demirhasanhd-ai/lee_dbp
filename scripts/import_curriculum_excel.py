from __future__ import annotations

import argparse
import json
import re
import sys
from collections import Counter
from datetime import datetime
from pathlib import Path
from typing import Any

import pandas as pd


ROOT = Path(__file__).resolve().parents[1]
COURSE_DATA = ROOT / "data" / "courses" / "2026-2027.json"
REPORT_DIR = ROOT / "data" / "import-reports"

COLUMN_PREFIXES = {
    "code": "Ders Kodu",
    "name": "Ders Adı",
    "type": "Z",
    "credit": "Krd",
    "ects": "AKTS",
    "theory": "Teo",
    "practice": "Uyg",
    "term": "D",
    "instructor": "Öğretim Elemanı",
}

LEVEL_ALIASES = {
    "tezsiz yl": "Tezsiz Yüksek Lisans",
    "tezsiz yüksek lisans": "Tezsiz Yüksek Lisans",
    "tezli yl": "Tezli Yüksek Lisans",
    "tezli yüksek lisans": "Tezli Yüksek Lisans",
    "doktora": "Doktora",
    "dr": "Doktora",
}


def clean(value: Any) -> str:
    if value is None or pd.isna(value):
        return ""
    text = str(value).strip()
    return "" if text.lower() == "nan" else text


def number(value: Any) -> int:
    text = clean(value).replace(",", ".")
    if not text:
        return 0
    return int(float(text))


def norm_key(value: str) -> str:
    return re.sub(r"\s+", " ", value.strip()).casefold()


def find_columns(columns: list[str]) -> dict[str, str]:
    mapping: dict[str, str] = {}
    for key, prefix in COLUMN_PREFIXES.items():
        matches = [col for col in columns if col == prefix or col.startswith(prefix + "_")]
        if matches:
            mapping[key] = matches[0]
    missing = [key for key in COLUMN_PREFIXES if key not in mapping]
    if missing:
        readable = ", ".join(COLUMN_PREFIXES[key] for key in missing)
        raise ValueError(f"Eksik kolon: {readable}")
    return mapping


def normalize_type(value: Any) -> str:
    text = norm_key(clean(value))
    if text in {"z", "zorunlu"}:
        return "Zorunlu"
    if text in {"s", "seçmeli", "seçmeli", "secmeli"}:
        return "Seçmeli"
    return "Zorunlu" if text.startswith("z") else "Seçmeli"


def normalize_term(value: Any) -> str:
    text = norm_key(clean(value))
    if text in {"g", "güz", "guz"}:
        return "Güz"
    if text in {"b", "bahar"}:
        return "Bahar"
    return "Güz"


def normalize_level(value: str) -> str:
    key = norm_key(value)
    if key not in LEVEL_ALIASES:
        raise ValueError(f"Program düzeyi tanınmadı: {value}")
    return LEVEL_ALIASES[key]


def sheet_config_from_args(args: argparse.Namespace) -> dict[str, dict[str, str]]:
    if args.config:
        return json.loads(Path(args.config).read_text(encoding="utf-8"))
    if not (args.department and args.program and args.level):
        raise ValueError("Config yoksa --department, --program ve --level verilmelidir.")
    return {
        "*": {
            "department": args.department,
            "programName": args.program,
            "level": normalize_level(args.level),
        }
    }


def sheet_lookup_key(value: str) -> str:
    return re.sub(r"[\W_]+", " ", value, flags=re.UNICODE).strip().casefold()


def import_excel(args: argparse.Namespace) -> dict[str, Any]:
    xlsx = Path(args.excel)
    if not xlsx.exists():
        raise FileNotFoundError(xlsx)

    existing = json.loads(COURSE_DATA.read_text(encoding="utf-8")) if COURSE_DATA.exists() else []
    sheet_config = sheet_config_from_args(args)
    normalized_sheet_config = {
        sheet_lookup_key(sheet_name): config
        for sheet_name, config in sheet_config.items()
        if sheet_name != "*"
    }
    imported: list[dict[str, Any]] = []
    warnings: list[str] = []

    workbook = pd.ExcelFile(xlsx)
    for sheet_name in workbook.sheet_names:
        config = sheet_config.get(sheet_name) or normalized_sheet_config.get(sheet_lookup_key(sheet_name)) or sheet_config.get("*")
        if not config:
            warnings.append(f"{sheet_name}: config olmadığı için atlandı.")
            continue
        frame = pd.read_excel(workbook, sheet_name=sheet_name)
        frame = frame.dropna(how="all")
        columns = [clean(col) for col in frame.columns]
        frame.columns = columns
        col = find_columns(columns)

        for _, row in frame.iterrows():
            code = clean(row[col["code"]]).upper()
            name = clean(row[col["name"]])
            if not code or not name:
                continue
            instructor = clean(row[col["instructor"]])
            record: dict[str, Any] = {
                "academicYear": args.academic_year,
                "programCode": "",
                "department": config["department"],
                "programName": config["programName"],
                "level": normalize_level(config["level"]),
                "code": code,
                "name": name,
                "type": normalize_type(row[col["type"]]),
                "credit": number(row[col["credit"]]),
                "ects": number(row[col["ects"]]),
                "theory": number(row[col["theory"]]),
                "practice": number(row[col["practice"]]),
                "term": normalize_term(row[col["term"]]),
                "status": "İncelemede" if instructor else "Atama Bekliyor",
                "source": "official_excel",
            }
            if instructor:
                record["instructor"] = instructor
            imported.append(record)

    replace_keys = {
        (item["department"], item["programName"], item["level"])
        for item in imported
    }
    kept = [
        item for item in existing
        if (item["department"], item["programName"], item["level"]) not in replace_keys
    ]
    merged = kept + imported
    COURSE_DATA.parent.mkdir(parents=True, exist_ok=True)
    COURSE_DATA.write_text(json.dumps(merged, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    REPORT_DIR.mkdir(parents=True, exist_ok=True)
    counts = Counter((r["department"], r["programName"], r["level"]) for r in imported)
    report = {
        "importedAt": datetime.now().isoformat(timespec="seconds"),
        "excel": str(xlsx),
        "academicYear": args.academic_year,
        "importedCourseCount": len(imported),
        "totalCourseCount": len(merged),
        "replacedProgramBuckets": [
            {"department": key[0], "programName": key[1], "level": key[2], "count": value}
            for key, value in sorted(counts.items())
        ],
        "blankInstructorCount": sum(1 for r in imported if not r.get("instructor")),
        "warnings": warnings,
    }
    stamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    report_path = REPORT_DIR / f"{stamp}-{xlsx.stem}.json"
    report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return report


def main() -> int:
    parser = argparse.ArgumentParser(description="LEE DBP Excel müfredat import aracı.")
    parser.add_argument("excel", help="İçe aktarılacak .xlsx dosyası")
    parser.add_argument("--config", help="Sheet adlarını programlara eşleyen JSON dosyası")
    parser.add_argument("--department", help="Config yoksa ABD/ASD adı")
    parser.add_argument("--program", help="Config yoksa program adı")
    parser.add_argument("--level", help="Config yoksa program düzeyi")
    parser.add_argument("--academic-year", default="2026-2027")
    args = parser.parse_args()

    try:
        report = import_excel(args)
    except Exception as exc:
        print(f"Import başarısız: {exc}", file=sys.stderr)
        return 1
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())

from __future__ import annotations

import json
import re
import sys
from collections import Counter
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
COURSE_DATA = ROOT / "data" / "courses" / "2026-2027.json"
PROGRAMS_TS = ROOT / "lib" / "data" / "programs.ts"

LEVELS = {"Tezsiz Yüksek Lisans", "Tezli Yüksek Lisans", "Doktora"}
TYPES = {"Zorunlu", "Seçmeli"}
TERMS = {"Güz", "Bahar"}
STATUSES = {"Taslak", "İncelemede", "Onaylandı", "Atama Bekliyor"}
REQUIRED = {
    "academicYear",
    "programCode",
    "department",
    "programName",
    "level",
    "code",
    "name",
    "type",
    "credit",
    "ects",
    "theory",
    "practice",
    "term",
    "status",
    "source",
}


def read_program_keys() -> set[tuple[str, str, str]]:
    text = PROGRAMS_TS.read_text(encoding="utf-8")
    keys: set[tuple[str, str, str]] = set()
    pattern = r'\["([^"]+)","([^"]+)","([^"]+)",L\((true|false),(true|false),(true|false)\)\]'
    for row in re.findall(pattern, text):
        _main_department, department, program_name, tezsiz, tezli, doktora = row
        if tezsiz == "true":
            keys.add((department, program_name, "Tezsiz Yüksek Lisans"))
        if tezli == "true":
            keys.add((department, program_name, "Tezli Yüksek Lisans"))
        if doktora == "true":
            keys.add((department, program_name, "Doktora"))
    return keys


def main() -> int:
    errors: list[str] = []
    courses = json.loads(COURSE_DATA.read_text(encoding="utf-8"))
    program_keys = read_program_keys()
    seen = Counter()

    for index, course in enumerate(courses, start=1):
        missing = sorted(key for key in REQUIRED if key not in course)
        if missing:
            errors.append(f"{index}. satır eksik alan: {', '.join(missing)}")
            continue

        if course["programCode"] == "7801":
            errors.append(f"{index}. satır programCode 7801 olamaz; rapor kodu importta yok sayılmalı.")
        if course["level"] not in LEVELS:
            errors.append(f"{index}. satır geçersiz program düzeyi: {course['level']}")
        if course["type"] not in TYPES:
            errors.append(f"{index}. satır geçersiz zorunlu/seçmeli değeri: {course['type']}")
        if course["term"] not in TERMS:
            errors.append(f"{index}. satır geçersiz dönem: {course['term']}")
        if course["status"] not in STATUSES:
            errors.append(f"{index}. satır geçersiz durum: {course['status']}")
        for numeric in ("credit", "ects", "theory", "practice"):
            if not isinstance(course[numeric], int):
                errors.append(f"{index}. satır {numeric} sayısal değil: {course[numeric]!r}")

        key = (course["department"], course["programName"], course["level"])
        if key not in program_keys:
            errors.append(f"{index}. satır program listesinde yok: {key}")
        seen[(course["department"], course["programName"], course["level"], course["code"], course["term"])] += 1

    duplicates = [key for key, count in seen.items() if count > 1]
    for key in duplicates[:25]:
        errors.append(f"Tekrarlı ders anahtarı: {key}")
    if len(duplicates) > 25:
        errors.append(f"{len(duplicates) - 25} ek tekrar daha var.")

    summary = {
        "courseCount": len(courses),
        "programBuckets": len({(c["department"], c["programName"], c["level"]) for c in courses}),
        "blankInstructorCount": sum(1 for c in courses if not c.get("instructor")),
    }

    if errors:
        print(json.dumps({"ok": False, "summary": summary, "errors": errors}, ensure_ascii=False, indent=2))
        return 1

    print(json.dumps({"ok": True, "summary": summary}, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())

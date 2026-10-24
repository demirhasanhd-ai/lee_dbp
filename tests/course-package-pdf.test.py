import runpy
import tempfile
import unittest
from pathlib import Path

from pypdf import PdfReader


ROOT = Path(__file__).resolve().parents[1]
generator = runpy.run_path(str(ROOT / "scripts" / "generate_public_course_pdfs.py"))


class CoursePackagePdfTests(unittest.TestCase):
    def render_text(self, details, name="DANIŞMANLIK"):
        payload = {
            "course": {
                "code": "DAN8XX",
                "name": name,
                "instructor": "Dr. Öğr. Üyesi İbrahim Öztürk",
                "programName": "Elektrik Elektronik Mühendisliği",
            },
            "package": {"detailFields": details},
        }
        course = generator["course_from_payload"](
            generator["synthetic_course"]("DAN8XX", name), payload
        )
        with tempfile.TemporaryDirectory() as directory:
            target = Path(directory) / "course.pdf"
            generator["make_pdf"](course, target, payload["package"])
            return " ".join(
                " ".join(page.extract_text().split())
                for page in PdfReader(target).pages
            )

    def test_common_course_prints_both_approved_advisor_fields(self):
        text = self.render_text({
            "coordinator": "Öğrencinin Danışmanı",
            "instructors": "Öğrencinin Danışmanı",
        })
        self.assertIn("Dersin Koordinatörü Öğrencinin Danışmanı", text)
        self.assertIn("Dersi Veren Öğretim Elemanı / Elemanları Öğrencinin Danışmanı", text)
        self.assertEqual(text.count("Öğrencinin Danışmanı"), 2)
        self.assertNotIn("İbrahim", text)
        self.assertNotIn("Öztürk", text)

    def test_coordinator_and_multiple_instructors_are_independent(self):
        text = self.render_text({
            "coordinator": "Prof. Dr. Koordinatör",
            "instructors": "Dr. Birinci Hoca; Dr. İkinci Hoca",
        })
        self.assertIn("Dersin Koordinatörü Prof. Dr. Koordinatör", text)
        self.assertIn("Dr. Birinci Hoca; Dr. İkinci Hoca", text)
        self.assertNotIn("İbrahim", text)

    def test_explicit_empty_fields_do_not_reintroduce_assignment(self):
        text = self.render_text({"coordinator": "", "instructors": ""}, "DEVRE ANALİZİ")
        self.assertIn("Dersin Koordinatörü", text)
        self.assertIn("Dersi Veren Öğretim Elemanı / Elemanları", text)
        self.assertNotIn("İbrahim", text)

    def test_legacy_course_without_package_fields_keeps_instructor(self):
        text = self.render_text({}, "DEVRE ANALİZİ")
        self.assertIn("Dr. Öğr. Üyesi İbrahim Öztürk", text)


if __name__ == "__main__":
    unittest.main()

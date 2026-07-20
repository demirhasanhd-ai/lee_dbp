import type { LeeProgram, ProgramLevel } from "./programs";

export type OfficialCourse = {
  academicYear: "2026-2027";
  programCode: string;
  department: string;
  programName: string;
  level: ProgramLevel;
  code: string;
  name: string;
  type: "Zorunlu" | "Seçmeli";
  credit: number;
  ects: number;
  theory: number;
  practice: number;
  term: "Güz" | "Bahar";
  instructor?: string;
  status: "Taslak" | "İncelemede" | "Onaylandı" | "Atama Bekliyor";
  source: "official_excel";
};

const AILE_TEZSIZ_2026_2027: OfficialCourse[] = [
  { academicYear: "2026-2027", programCode: "7801", department: "Aile Danışmanlığı ve Eğitimi ABD", programName: "Aile Danışmanlığı ve Eğitimi", level: "Tezsiz Yüksek Lisans", code: "ADE701", name: "BİTİRME PROJESİ", type: "Zorunlu", credit: 0, ects: 30, theory: 0, practice: 0, term: "Güz", instructor: "Prof. Dr. OĞUZHAN ÇOLAKKADIOĞLU", status: "İncelemede", source: "official_excel" },
  { academicYear: "2026-2027", programCode: "7801", department: "Aile Danışmanlığı ve Eğitimi ABD", programName: "Aile Danışmanlığı ve Eğitimi", level: "Tezsiz Yüksek Lisans", code: "ADE703", name: "BİLİMSEL ARAŞTIRMA YÖNTEMLERİ ve YAYIN ETİĞİ", type: "Zorunlu", credit: 3, ects: 6, theory: 3, practice: 0, term: "Güz", instructor: "Dr. Öğr. Üyesi GÜLŞAH CANDEMİR", status: "İncelemede", source: "official_excel" },
  { academicYear: "2026-2027", programCode: "7801", department: "Aile Danışmanlığı ve Eğitimi ABD", programName: "Aile Danışmanlığı ve Eğitimi", level: "Tezsiz Yüksek Lisans", code: "ADE705", name: "AİLE DANIŞMANLIĞININ TEMELLERİ ve AİLE DANIŞM...", type: "Zorunlu", credit: 3, ects: 6, theory: 3, practice: 0, term: "Güz", instructor: "Prof. Dr. OĞUZHAN ÇOLAKKADIOĞLU", status: "İncelemede", source: "official_excel" },
  { academicYear: "2026-2027", programCode: "7801", department: "Aile Danışmanlığı ve Eğitimi ABD", programName: "Aile Danışmanlığı ve Eğitimi", level: "Tezsiz Yüksek Lisans", code: "ADE707", name: "AİLE DANIŞMA SÜRECİ ve TEMEL PSİKOLOJİK DANIŞ...", type: "Zorunlu", credit: 3, ects: 6, theory: 3, practice: 0, term: "Güz", instructor: "Prof. Dr. OĞUZHAN ÇOLAKKADIOĞLU", status: "İncelemede", source: "official_excel" },
  { academicYear: "2026-2027", programCode: "7801", department: "Aile Danışmanlığı ve Eğitimi ABD", programName: "Aile Danışmanlığı ve Eğitimi", level: "Tezsiz Yüksek Lisans", code: "ADE709", name: "AİLE İÇİ İLİŞKİLER ve İLETİŞİM", type: "Seçmeli", credit: 3, ects: 6, theory: 3, practice: 0, term: "Güz", instructor: "Prof. Dr. MÜJDAT AVCI", status: "İncelemede", source: "official_excel" },
  { academicYear: "2026-2027", programCode: "7801", department: "Aile Danışmanlığı ve Eğitimi ABD", programName: "Aile Danışmanlığı ve Eğitimi", level: "Tezsiz Yüksek Lisans", code: "ADE711", name: "AİLE OLMAK", type: "Seçmeli", credit: 3, ects: 6, theory: 3, practice: 0, term: "Güz", instructor: "Prof. Dr. MAHMUT HAMİL NAZİK", status: "İncelemede", source: "official_excel" },
  { academicYear: "2026-2027", programCode: "7801", department: "Aile Danışmanlığı ve Eğitimi ABD", programName: "Aile Danışmanlığı ve Eğitimi", level: "Tezsiz Yüksek Lisans", code: "ADE713", name: "AİLE SOSYOLOJİSİ", type: "Seçmeli", credit: 3, ects: 6, theory: 3, practice: 0, term: "Güz", instructor: "Doç. Dr. ZEYNEP TEKİN BABUÇ", status: "İncelemede", source: "official_excel" },
  { academicYear: "2026-2027", programCode: "7801", department: "Aile Danışmanlığı ve Eğitimi ABD", programName: "Aile Danışmanlığı ve Eğitimi", level: "Tezsiz Yüksek Lisans", code: "ADE715", name: "AİLEDE GELİŞİM PSİKOLOJİSİ", type: "Seçmeli", credit: 3, ects: 6, theory: 3, practice: 0, term: "Güz", instructor: "Dr. Öğr. Üyesi CANAN BÜYÜKAŞIK ÇOLAK", status: "İncelemede", source: "official_excel" },
  { academicYear: "2026-2027", programCode: "7801", department: "Aile Danışmanlığı ve Eğitimi ABD", programName: "Aile Danışmanlığı ve Eğitimi", level: "Tezsiz Yüksek Lisans", code: "ADE717", name: "AİLEDE RUH SAĞLIĞI", type: "Seçmeli", credit: 3, ects: 6, theory: 3, practice: 0, term: "Güz", instructor: "Doç. Dr. AYŞE İNEL MANAV", status: "İncelemede", source: "official_excel" },
  { academicYear: "2026-2027", programCode: "7801", department: "Aile Danışmanlığı ve Eğitimi ABD", programName: "Aile Danışmanlığı ve Eğitimi", level: "Tezsiz Yüksek Lisans", code: "ADE719", name: "ÇOCUKLARDA DAVRANIŞ BOZUKLUĞU ve AİLE", type: "Seçmeli", credit: 3, ects: 6, theory: 3, practice: 0, term: "Güz", instructor: "Dr. Öğr. Üyesi MOHAMMAD ALMAHMOUD", status: "İncelemede", source: "official_excel" },
  { academicYear: "2026-2027", programCode: "7801", department: "Aile Danışmanlığı ve Eğitimi ABD", programName: "Aile Danışmanlığı ve Eğitimi", level: "Tezsiz Yüksek Lisans", code: "ADE702", name: "BİTİRME PROJESİ", type: "Zorunlu", credit: 0, ects: 30, theory: 0, practice: 0, term: "Bahar", instructor: "Prof. Dr. OĞUZHAN ÇOLAKKADIOĞLU", status: "İncelemede", source: "official_excel" },
  { academicYear: "2026-2027", programCode: "7801", department: "Aile Danışmanlığı ve Eğitimi ABD", programName: "Aile Danışmanlığı ve Eğitimi", level: "Tezsiz Yüksek Lisans", code: "ADE704", name: "BİLİMSEL ARAŞTIRMA VE YAYIN ETİĞİ", type: "Zorunlu", credit: 3, ects: 6, theory: 3, practice: 0, term: "Bahar", status: "Atama Bekliyor", source: "official_excel" },
  { academicYear: "2026-2027", programCode: "7801", department: "Aile Danışmanlığı ve Eğitimi ABD", programName: "Aile Danışmanlığı ve Eğitimi", level: "Tezsiz Yüksek Lisans", code: "ADE706", name: "AİLE DANIŞMANLIĞI UYGULAMASI", type: "Zorunlu", credit: 2, ects: 6, theory: 2, practice: 2, term: "Bahar", instructor: "Prof. Dr. OĞUZHAN ÇOLAKKADIOĞLU", status: "İncelemede", source: "official_excel" },
  { academicYear: "2026-2027", programCode: "7801", department: "Aile Danışmanlığı ve Eğitimi ABD", programName: "Aile Danışmanlığı ve Eğitimi", level: "Tezsiz Yüksek Lisans", code: "ADE708", name: "AİLE DANIŞMANLIĞINDA ETİK ve YASAL KONULAR", type: "Zorunlu", credit: 3, ects: 6, theory: 3, practice: 0, term: "Bahar", instructor: "Dr. Öğr. Üyesi GÜLŞAH CANDEMİR", status: "İncelemede", source: "official_excel" },
  { academicYear: "2026-2027", programCode: "7801", department: "Aile Danışmanlığı ve Eğitimi ABD", programName: "Aile Danışmanlığı ve Eğitimi", level: "Tezsiz Yüksek Lisans", code: "ADE710", name: "AİLEDE CİNSELLİK ve CİNSEL SORUNLAR", type: "Seçmeli", credit: 3, ects: 6, theory: 3, practice: 0, term: "Bahar", instructor: "Doç. Dr. ZEYNEP TEKİN BABUÇ", status: "İncelemede", source: "official_excel" },
  { academicYear: "2026-2027", programCode: "7801", department: "Aile Danışmanlığı ve Eğitimi ABD", programName: "Aile Danışmanlığı ve Eğitimi", level: "Tezsiz Yüksek Lisans", code: "ADE712", name: "AİLEDE DEĞER EĞİTİMİ", type: "Seçmeli", credit: 3, ects: 6, theory: 3, practice: 0, term: "Bahar", instructor: "Prof. Dr. MÜJDAT AVCI", status: "İncelemede", source: "official_excel" },
  { academicYear: "2026-2027", programCode: "7801", department: "Aile Danışmanlığı ve Eğitimi ABD", programName: "Aile Danışmanlığı ve Eğitimi", level: "Tezsiz Yüksek Lisans", code: "ADE714", name: "AİLEDE KRİZE MÜDAHALE", type: "Seçmeli", credit: 3, ects: 6, theory: 3, practice: 0, term: "Bahar", instructor: "Doç. Dr. AYŞE İNEL MANAV", status: "İncelemede", source: "official_excel" },
  { academicYear: "2026-2027", programCode: "7801", department: "Aile Danışmanlığı ve Eğitimi ABD", programName: "Aile Danışmanlığı ve Eğitimi", level: "Tezsiz Yüksek Lisans", code: "ADE716", name: "BİREYSEL DANIŞMA KURAMLARI", type: "Seçmeli", credit: 3, ects: 6, theory: 3, practice: 0, term: "Bahar", instructor: "Prof. Dr. OĞUZHAN ÇOLAKKADIOĞLU", status: "İncelemede", source: "official_excel" },
  { academicYear: "2026-2027", programCode: "7801", department: "Aile Danışmanlığı ve Eğitimi ABD", programName: "Aile Danışmanlığı ve Eğitimi", level: "Tezsiz Yüksek Lisans", code: "ADE718", name: "AİLEDE ÖZEL SORUNLAR (BOŞANMA, ALDATMA, ÖLÜM ...", type: "Seçmeli", credit: 3, ects: 6, theory: 3, practice: 0, term: "Bahar", instructor: "Prof. Dr. MAHMUT HAMİL NAZİK", status: "İncelemede", source: "official_excel" },
  { academicYear: "2026-2027", programCode: "7801", department: "Aile Danışmanlığı ve Eğitimi ABD", programName: "Aile Danışmanlığı ve Eğitimi", level: "Tezsiz Yüksek Lisans", code: "ADE720", name: "ÖZEL GEREKSİNİMLİ ÇOCUĞU OLAN AİLELERLE ÇALIŞ...", type: "Seçmeli", credit: 3, ects: 6, theory: 3, practice: 0, term: "Bahar", instructor: "Dr. Öğr. Üyesi CANAN BÜYÜKAŞIK ÇOLAK", status: "İncelemede", source: "official_excel" },
];

export const OFFICIAL_COURSES: OfficialCourse[] = [
  ...AILE_TEZSIZ_2026_2027,
];

const same = (left: string, right: string) =>
  left.trim().toLocaleLowerCase("tr-TR") === right.trim().toLocaleLowerCase("tr-TR");

export const officialCoursesForProgram = (program: LeeProgram) =>
  OFFICIAL_COURSES.filter((course) =>
    same(course.department, program.department) &&
    same(course.programName, program.programName),
  );

export const hasOfficialCoursesForProgram = (program: LeeProgram) =>
  officialCoursesForProgram(program).length > 0;

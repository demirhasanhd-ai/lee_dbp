import type { LeeProgram } from "./programs";
import {
  OFFICIAL_COURSES as OBS_OFFICIAL_COURSES,
  type OfficialCourse,
} from "./officialCourses";

const YBS_SPECIALIZATION_CODES = new Set([
  "YBS901",
  "YBS902",
  "YBS903",
  "YBS904",
  "YBS905",
  "YBS906",
  "YBS907",
  "YBS908",
]);

const YBS_THESIS_CODES = new Set([
  "YBS911",
  "YBS912",
  "YBS913",
  "YBS914",
  "YBS915",
  "YBS916",
]);

const MAKINE_YL_ADVISORY_CODES = new Set(["DAN801", "DAN802", "DAN803", "DAN804"]);
const MAKINE_YL_SPECIALIZATION_CODES = new Set(["MMB801", "MMB802", "MMB803", "MMB804"]);
const MAKINE_YL_SEMINAR_CODES = new Set(["MMB805", "MMB806"]);
const MAKINE_YL_THESIS_CODES = new Set(["MMB807", "MMB808"]);
const ARKEOLOJI_YL_ADVISORY_CODES = new Set(["DAN801", "DAN802"]);
const ARKEOLOJI_YL_SPECIALIZATION_CODES = new Set(["ARK801", "ARK802", "ARK803", "ARK804"]);
const ARKEOLOJI_YL_SEMINAR_CODES = new Set(["ARK805", "ARK806"]);
const ARKEOLOJI_YL_THESIS_CODES = new Set(["ARK807", "ARK808"]);
const BATARYA_YL_ADVISORY_CODES = new Set(["DAN801", "DAN802", "DAN803", "DAN804"]);
const BATARYA_YL_SPECIALIZATION_CODES = new Set(["BHT801", "BHT802", "BHT803", "BHT804"]);
const BATARYA_YL_SEMINAR_CODES = new Set(["BHT805", "BHT806"]);
const BATARYA_YL_RESEARCH_CODES = new Set(["BHT830", "BHT831"]);
const BATARYA_YL_THESIS_CODES = new Set(["BHT807", "BHT808"]);
const BEDEN_YL_ADVISORY_CODES = new Set(["DAN801", "DAN802"]);
const BEDEN_YL_SPECIALIZATION_CODES = new Set(["BES801", "BES802", "BES803", "BES804"]);
const BEDEN_YL_SEMINAR_CODES = new Set(["BES805", "BES806"]);
const BEDEN_YL_RESEARCH_CODES = new Set(["BEF801", "BEF802"]);
const BEDEN_YL_THESIS_CODES = new Set(["BES807", "BES808"]);
const BIYOLOJI_YL_ADVISORY_CODES = new Set(["DAN801", "DAN802", "DAN803", "DAN804"]);
const BIYOLOJI_YL_SPECIALIZATION_CODES = new Set(["BİO801", "BİO802", "BİO803", "BİO804"]);
const BIYOLOJI_YL_SEMINAR_CODES = new Set(["BİO805", "BİO806"]);
const BIYOLOJI_YL_RESEARCH_CODES = new Set(["BİO809", "BİO810"]);
const BIYOLOJI_YL_THESIS_CODES = new Set(["BİO807", "BİO808"]);
const EBELIK_YL_ADVISORY_CODES = new Set(["DAN801", "DAN802", "DAN803", "DAN804"]);
const EBELIK_YL_SPECIALIZATION_CODES = new Set(["EBE801", "EBE802", "EBE803", "EBE804"]);
const EBELIK_YL_SEMINAR_CODES = new Set(["EBE805", "EBE806"]);
const EBELIK_YL_RESEARCH_CODES = new Set(["EBE809", "EBE810"]);
const EBELIK_YL_THESIS_CODES = new Set(["EBE807", "EBE808"]);
const EKOTURIZM_YL_ADVISORY_CODES = new Set(["DAN801", "DAN802"]);
const EKOTURIZM_YL_SPECIALIZATION_CODES = new Set(["ETR801", "ETR802", "ETR803", "ETR804"]);
const EKOTURIZM_YL_SEMINAR_CODES = new Set(["ETR805", "ETR806"]);
const EKOTURIZM_YL_RESEARCH_CODES = new Set(["ETR855", "ETR856", "BES802"]);
const EKOTURIZM_YL_THESIS_CODES = new Set(["ETR807", "ETR808"]);
const ELEKTRIK_YL_ADVISORY_CODES = new Set(["DAN801", "DAN802", "DAN803", "DAN804"]);
const ELEKTRIK_YL_SPECIALIZATION_CODES = new Set(["EEM801", "EEM802", "EEM803", "EEM804"]);
const ELEKTRIK_YL_SEMINAR_CODES = new Set(["EEM805", "EEM806"]);
const ELEKTRIK_YL_THESIS_CODES = new Set(["EEM807", "EEM808"]);
const ENERJI_YL_ADVISORY_CODES = new Set(["DAN801", "DAN802", "DAN803", "DAN804"]);
const ENERJI_YL_SPECIALIZATION_CODES = new Set(["EMB801", "EMB802", "EMB803", "EMB804"]);
const ENERJI_YL_SEMINAR_CODES = new Set(["EMB805", "EMB806"]);
const ENERJI_YL_RESEARCH_CODES = new Set(["EMB829", "EMB834"]);
const ENERJI_YL_THESIS_CODES = new Set(["EMB807", "EMB808"]);
const FELSEFE_DIN_YL_ADVISORY_CODES = new Set(["DAN801", "DAN802", "DAN803", "DAN804"]);
const FELSEFE_DIN_YL_SPECIALIZATION_CODES = new Set(["FDB801", "FDB802", "FDB803", "FDB804"]);
const FELSEFE_DIN_YL_SEMINAR_CODES = new Set(["FDB805", "FDB806"]);
const FELSEFE_DIN_YL_RESEARCH_CODES = new Set(["BES801", "BES802"]);
const FELSEFE_DIN_YL_THESIS_CODES = new Set(["FDB807", "FDB808"]);

const withAdvisor = (course: OfficialCourse): OfficialCourse => ({
  ...course,
  instructor: "Öğrencinin Danışmanı",
});

const normalizeYbsDoctorateCourse = (course: OfficialCourse): OfficialCourse | null => {
  if (course.code === "YBS925") return { ...course, instructor: "Doç. Dr. Emre YAKUT", status: "İncelemede" };
  if (YBS_SPECIALIZATION_CODES.has(course.code)) {
    if (course.code !== "YBS901") return null;
    return withAdvisor({
      ...course,
      code: "YBS9XX",
      name: "UZMANLIK ALAN DERSİ",
      ects: 5,
    });
  }

  if (YBS_THESIS_CODES.has(course.code)) {
    if (course.code !== "YBS911") return null;
    return withAdvisor({
      ...course,
      code: "YBS91X",
      name: "DOKTORA TEZİ",
      ects: 24,
    });
  }

  if (course.code === "DAN902") return withAdvisor({ ...course, ects: 1 });
  if (course.code === "YBS909") return null;
  if (course.code === "YBS910") return withAdvisor({ ...course, ects: 6 });
  if (course.code === "YBS917") return withAdvisor({ ...course, ects: 6 });
  if (course.code === "YBS918") return null;
  return course;
};

const normalizeMakineTezliCourse = (course: OfficialCourse): OfficialCourse | null => {
  const isMakineTezli = course.department === "Makine Mühendisliği ABD" &&
    course.programName === "Makine Mühendisliği" && course.level === "Tezli Yüksek Lisans";
  if (!isMakineTezli) return course;
  if (MAKINE_YL_ADVISORY_CODES.has(course.code)) {
    if (course.code !== "DAN801") return null;
    return withAdvisor({ ...course, code: "DAN8XX", name: "DANIŞMANLIK", ects: 1 });
  }
  if (MAKINE_YL_SPECIALIZATION_CODES.has(course.code)) {
    if (course.code !== "MMB801") return null;
    return withAdvisor({ ...course, code: "MMB8XX", name: "UZMANLIK ALAN DERSİ", ects: 5 });
  }
  if (MAKINE_YL_SEMINAR_CODES.has(course.code)) {
    if (course.code !== "MMB806") return null;
    return withAdvisor({ ...course, code: "MMB806", name: "SEMİNER", ects: 6 });
  }
  if (MAKINE_YL_THESIS_CODES.has(course.code)) {
    if (course.code !== "MMB807") return null;
    return withAdvisor({ ...course, code: "MMB81X", name: "TEZ ÇALIŞMASI", ects: 24 });
  }
  return course;
};

const normalizeArkeolojiTezliCourse = (course: OfficialCourse): OfficialCourse | null => {
  const isArkeolojiTezli = course.department === "Arkeoloji ABD" &&
    course.programName === "Arkeoloji" && course.level === "Tezli Yüksek Lisans";
  if (!isArkeolojiTezli) return course;
  if (ARKEOLOJI_YL_ADVISORY_CODES.has(course.code)) {
    if (course.code !== "DAN801") return null;
    return withAdvisor({ ...course, code: "DAN8XX", name: "DANIŞMANLIK", ects: 1 });
  }
  if (ARKEOLOJI_YL_SPECIALIZATION_CODES.has(course.code)) {
    if (course.code !== "ARK801") return null;
    return withAdvisor({ ...course, code: "ARK8XX", name: "UZMANLIK ALAN DERSİ", ects: 5 });
  }
  if (ARKEOLOJI_YL_SEMINAR_CODES.has(course.code)) {
    if (course.code !== "ARK806") return null;
    return withAdvisor({ ...course, code: "ARK806", name: "YÜKSEK LİSANS SEMİNER", ects: 6 });
  }
  if (ARKEOLOJI_YL_THESIS_CODES.has(course.code)) {
    if (course.code !== "ARK807") return null;
    return withAdvisor({ ...course, code: "ARK81X", name: "TEZ ÇALIŞMASI", ects: 24 });
  }
  return course;
};

const normalizeBataryaTezliCourse = (course: OfficialCourse): OfficialCourse | null => {
  const applies = course.department === "Batarya Sistemleri ve Hidrojen Teknolojileri ABD" && course.programName === "Batarya Sistemleri ve Hidrojen Teknolojileri" && course.level === "Tezli Yüksek Lisans";
  if (!applies) return course;
  if (BATARYA_YL_ADVISORY_CODES.has(course.code)) return course.code === "DAN801" ? withAdvisor({ ...course, code: "DAN8XX", name: "DANIŞMANLIK", ects: 1 }) : null;
  if (BATARYA_YL_SPECIALIZATION_CODES.has(course.code)) return course.code === "BHT801" ? withAdvisor({ ...course, code: "BHT8XX", name: "UZMANLIK ALAN DERSİ", ects: 5 }) : null;
  if (BATARYA_YL_SEMINAR_CODES.has(course.code)) return course.code === "BHT806" ? withAdvisor({ ...course, code: "BHT806", name: "SEMİNER", ects: 6 }) : null;
  if (BATARYA_YL_RESEARCH_CODES.has(course.code)) return course.code === "BHT831" ? { ...course, code: "BHT831", name: "BİLİMSEL ARAŞTIRMA YÖNTEMLERİ VE YAYIN ETİĞİ", ects: 6 } : null;
  if (BATARYA_YL_THESIS_CODES.has(course.code)) return course.code === "BHT807" ? withAdvisor({ ...course, code: "BHT81X", name: "TEZ ÇALIŞMASI", ects: 24 }) : null;
  return course;
};

const normalizeBedenTezliCourse = (course: OfficialCourse): OfficialCourse | null => {
  const applies = course.department === "Beden Eğitimi ve Spor ABD" && course.programName === "Beden Eğitimi ve Spor" && course.level === "Tezli Yüksek Lisans";
  if (!applies) return course;
  if (BEDEN_YL_ADVISORY_CODES.has(course.code)) return course.code === "DAN801" ? withAdvisor({ ...course, code:"DAN8XX", name:"DANIŞMANLIK", ects:1 }) : null;
  if (BEDEN_YL_SPECIALIZATION_CODES.has(course.code)) return course.code === "BES801" ? withAdvisor({ ...course, code:"BES8XX", name:"UZMANLIK ALAN DERSİ", ects:5 }) : null;
  if (BEDEN_YL_SEMINAR_CODES.has(course.code)) return course.code === "BES806" ? withAdvisor({ ...course, code:"BES806", name:"SEMİNER", ects:6 }) : null;
  if (BEDEN_YL_RESEARCH_CODES.has(course.code)) return course.code === "BEF801" ? { ...course, code:"BEF801", name:"BİLİMSEL ARAŞTIRMA YÖNTEMLERİ VE YAYIN ETİĞİ", ects:6 } : null;
  if (BEDEN_YL_THESIS_CODES.has(course.code)) return course.code === "BES807" ? withAdvisor({ ...course, code:"BES81X", name:"TEZ ÇALIŞMASI", ects:24 }) : null;
  return course;
};

const normalizeBiyolojiTezliCourse = (course: OfficialCourse): OfficialCourse | null => {
  const applies = course.department === "Biyoloji ABD" && course.programName === "Biyoloji" && course.level === "Tezli Yüksek Lisans";
  if (!applies) return course;
  if (BIYOLOJI_YL_ADVISORY_CODES.has(course.code)) return course.code === "DAN801" ? withAdvisor({ ...course, code:"DAN8XX", name:"DANIŞMANLIK", ects:1 }) : null;
  if (BIYOLOJI_YL_SPECIALIZATION_CODES.has(course.code)) return course.code === "BİO801" ? withAdvisor({ ...course, code:"BİO8XX", name:"UZMANLIK ALAN DERSİ", ects:5 }) : null;
  if (BIYOLOJI_YL_SEMINAR_CODES.has(course.code)) return course.code === "BİO806" ? withAdvisor({ ...course, code:"BİO806", name:"SEMİNER", ects:6 }) : null;
  if (BIYOLOJI_YL_RESEARCH_CODES.has(course.code)) return course.code === "BİO809" ? { ...course, code:"BİO809", name:"BİLİMSEL ARAŞTIRMA YÖNTEMLERİ VE YAYIN ETİĞİ", ects:6 } : null;
  if (BIYOLOJI_YL_THESIS_CODES.has(course.code)) return course.code === "BİO807" ? withAdvisor({ ...course, code:"BİO81X", name:"TEZ ÇALIŞMASI", ects:24 }) : null;
  return course;
};

const normalizeEbelikTezliCourse = (course: OfficialCourse): OfficialCourse | null => {
  const applies = course.department === "Ebelik ABD" && course.programName === "Ebelik" && course.level === "Tezli Yüksek Lisans";
  if (!applies) return course;
  if (EBELIK_YL_ADVISORY_CODES.has(course.code)) return course.code === "DAN801" ? withAdvisor({ ...course, code:"DAN8XX", name:"DANIŞMANLIK", ects:1 }) : null;
  if (EBELIK_YL_SPECIALIZATION_CODES.has(course.code)) return course.code === "EBE801" ? withAdvisor({ ...course, code:"EBE8XX", name:"UZMANLIK ALAN DERSİ", ects:5 }) : null;
  if (EBELIK_YL_SEMINAR_CODES.has(course.code)) return course.code === "EBE806" ? withAdvisor({ ...course, code:"EBE806", name:"SEMİNER", ects:6 }) : null;
  if (EBELIK_YL_RESEARCH_CODES.has(course.code)) return course.code === "EBE809" ? { ...course, code:"EBE809", name:"BİLİMSEL ARAŞTIRMA YÖNTEMLERİ VE YAYIN ETİĞİ", ects:6 } : null;
  if (EBELIK_YL_THESIS_CODES.has(course.code)) return course.code === "EBE807" ? withAdvisor({ ...course, code:"EBE81X", name:"TEZ ÇALIŞMASI", ects:24 }) : null;
  return course;
};

const normalizeEkoturizmTezliCourse = (course: OfficialCourse): OfficialCourse | null => {
  const applies = course.department === "Ekoturizm Rehberliği ABD" && course.programName === "Ekoturizm Rehberliği" && course.level === "Tezli Yüksek Lisans";
  if (!applies) return course;
  if (course.code === "EKOTURİZM SEÇ-2") return null;
  if (EKOTURIZM_YL_ADVISORY_CODES.has(course.code)) return course.code === "DAN801" ? withAdvisor({ ...course, code:"DAN8XX", name:"DANIŞMANLIK", ects:1 }) : null;
  if (EKOTURIZM_YL_SPECIALIZATION_CODES.has(course.code)) return course.code === "ETR801" ? withAdvisor({ ...course, code:"ETR8XX", name:"UZMANLIK ALAN DERSİ", ects:5 }) : null;
  if (EKOTURIZM_YL_SEMINAR_CODES.has(course.code)) return course.code === "ETR806" ? withAdvisor({ ...course, code:"ETR806", name:"SEMİNER", ects:6 }) : null;
  if (EKOTURIZM_YL_RESEARCH_CODES.has(course.code)) return course.code === "ETR855" ? { ...course, code:"ETR855", name:"BİLİMSEL ARAŞTIRMA YÖNTEMLERİ VE YAYIN ETİĞİ", ects:6 } : null;
  if (EKOTURIZM_YL_THESIS_CODES.has(course.code)) return course.code === "ETR807" ? withAdvisor({ ...course, code:"ETR81X", name:"TEZ ÇALIŞMASI", ects:24 }) : null;
  return course;
};

const normalizeElektrikTezliCourse = (course: OfficialCourse): OfficialCourse | null => {
  const applies = course.department === "Elektrik Elektronik Mühendisliği ABD" && course.programName === "Elektrik Elektronik Mühendisliği" && course.level === "Tezli Yüksek Lisans";
  if (!applies) return course;
  if (ELEKTRIK_YL_ADVISORY_CODES.has(course.code)) return course.code === "DAN801" ? withAdvisor({ ...course, code:"DAN8XX", name:"DANIŞMANLIK", ects:1 }) : null;
  if (ELEKTRIK_YL_SPECIALIZATION_CODES.has(course.code)) return course.code === "EEM801" ? withAdvisor({ ...course, code:"EEM8XX", name:"UZMANLIK ALAN DERSİ", ects:5 }) : null;
  if (ELEKTRIK_YL_SEMINAR_CODES.has(course.code)) return course.code === "EEM806" ? withAdvisor({ ...course, code:"EEM806", name:"SEMİNER", ects:6 }) : null;
  if (ELEKTRIK_YL_THESIS_CODES.has(course.code)) return course.code === "EEM807" ? withAdvisor({ ...course, code:"EEM81X", name:"TEZ ÇALIŞMASI", ects:24 }) : null;
  return course;
};

const normalizeEnerjiTezliCourse = (course: OfficialCourse): OfficialCourse | null => {
  const applies = course.department === "Enerji Sistemleri Mühendisliği ABD" && course.programName === "Enerji Sistemleri Mühendisliği" && course.level === "Tezli Yüksek Lisans";
  if (!applies) return course;
  if (ENERJI_YL_ADVISORY_CODES.has(course.code)) return course.code === "DAN801" ? withAdvisor({ ...course, code:"DAN8XX", name:"DANIŞMANLIK", ects:1 }) : null;
  if (ENERJI_YL_SPECIALIZATION_CODES.has(course.code)) return course.code === "EMB801" ? withAdvisor({ ...course, code:"EMB8XX", name:"UZMANLIK ALAN DERSİ", ects:5 }) : null;
  if (ENERJI_YL_SEMINAR_CODES.has(course.code)) return course.code === "EMB806" ? withAdvisor({ ...course, code:"EMB806", name:"SEMİNER", ects:6 }) : null;
  if (ENERJI_YL_RESEARCH_CODES.has(course.code)) return course.code === "EMB829" ? { ...course, code:"EMB829", name:"BİLİMSEL ARAŞTIRMA YÖNTEMLERİ VE YAYIN ETİĞİ", ects:6 } : null;
  if (ENERJI_YL_THESIS_CODES.has(course.code)) return course.code === "EMB807" ? withAdvisor({ ...course, code:"EMB81X", name:"YÜKSEK LİSANS TEZİ", ects:24 }) : null;
  return course;
};

const normalizeFelsefeDinTezliCourse = (course: OfficialCourse): OfficialCourse | null => {
  const applies = course.department === "Felsefe ve Din Bilimleri ABD" && course.programName === "Felsefe ve Din Bilimleri" && course.level === "Tezli Yüksek Lisans";
  if (!applies) return course;
  if (FELSEFE_DIN_YL_ADVISORY_CODES.has(course.code)) return course.code === "DAN801" ? withAdvisor({ ...course, code:"DAN8XX", name:"DANIŞMANLIK", ects:1 }) : null;
  if (FELSEFE_DIN_YL_SPECIALIZATION_CODES.has(course.code)) return course.code === "FDB801" ? withAdvisor({ ...course, code:"FDB8XX", name:"UZMANLIK ALAN DERSİ", ects:5 }) : null;
  if (FELSEFE_DIN_YL_SEMINAR_CODES.has(course.code)) return course.code === "FDB806" ? withAdvisor({ ...course, code:"FDB806", name:"SEMİNER", ects:6 }) : null;
  if (FELSEFE_DIN_YL_RESEARCH_CODES.has(course.code)) return course.code === "BES801" ? { ...course, code:"BES801", name:"BİLİMSEL ARAŞTIRMA YÖNTEMLERİ VE YAYIN ETİĞİ", ects:6 } : null;
  if (FELSEFE_DIN_YL_THESIS_CODES.has(course.code)) return course.code === "FDB807" ? withAdvisor({ ...course, code:"FDB81X", name:"YÜKSEK LİSANS TEZİ", ects:24 }) : null;
  return course;
};

export const OFFICIAL_COURSES: OfficialCourse[] = OBS_OFFICIAL_COURSES.flatMap((course) => {
  const makineCourse = normalizeMakineTezliCourse(course);
  if (!makineCourse) return [];
  course = makineCourse;
  const arkeolojiCourse = normalizeArkeolojiTezliCourse(course);
  if (!arkeolojiCourse) return [];
  course = arkeolojiCourse;
  const bataryaCourse = normalizeBataryaTezliCourse(course);
  if (!bataryaCourse) return [];
  course = bataryaCourse;
  const bedenCourse = normalizeBedenTezliCourse(course);
  if (!bedenCourse) return [];
  course = bedenCourse;
  const biyolojiCourse = normalizeBiyolojiTezliCourse(course);
  if (!biyolojiCourse) return [];
  course = biyolojiCourse;
  const ebelikCourse = normalizeEbelikTezliCourse(course);
  if (!ebelikCourse) return [];
  course = ebelikCourse;
  const ekoturizmCourse = normalizeEkoturizmTezliCourse(course);
  if (!ekoturizmCourse) return [];
  course = ekoturizmCourse;
  const elektrikCourse = normalizeElektrikTezliCourse(course);
  if (!elektrikCourse) return [];
  course = elektrikCourse;
  const enerjiCourse = normalizeEnerjiTezliCourse(course);
  if (!enerjiCourse) return [];
  course = enerjiCourse;
  const felsefeDinCourse = normalizeFelsefeDinTezliCourse(course);
  if (!felsefeDinCourse) return [];
  course = felsefeDinCourse;
  const isYbsDoctorate =
    course.level === "Doktora" &&
    (course.code.startsWith("YBS") ||
      (course.code === "DAN902" &&
        (course.programName.includes("Yönetim Bilişim") ||
          course.programName.includes("YÃ¶netim BiliÅŸim"))));
  if (!isYbsDoctorate) return [course];
  const normalized = normalizeYbsDoctorateCourse(course);
  return normalized ? [normalized] : [];
});

const same = (left: string, right: string) =>
  left.trim().toLocaleLowerCase("tr-TR") === right.trim().toLocaleLowerCase("tr-TR");

export const officialCoursesForProgram = (program: LeeProgram) =>
  OFFICIAL_COURSES.filter(
    (course) =>
      same(course.department, program.department) &&
      same(course.programName, program.programName),
  );

const normalizeCourseName = (name: string) =>
  name
    .toLocaleUpperCase("tr-TR")
    .replaceAll("Ã‡", "Ç")
    .replaceAll("Ä°", "İ")
    .replaceAll("ÄŸ", "ğ")
    .replaceAll("Åž", "Ş");

export const isDepartmentPoolCourse = (course: Pick<OfficialCourse, "name" | "code">) => {
  const name = normalizeCourseName(course.name);
  if (course.code === "BHT831") return true;
  if (course.code === "BEF801" && normalizeCourseName(course.name).includes("BİLİMSEL ARAŞTIRMA")) return true;
  if (course.code === "BİO809" && normalizeCourseName(course.name).includes("BİLİMSEL ARAŞTIRMA")) return true;
  if (name.includes("BİLİMSEL ARAŞTIRMA")) return false;
  return /^(?:DANIŞMANLIK|UZMANLIK ALAN DERSİ|(?:YÜKSEK LİSANS |DOKTORA )?SEMİNER|DOKTORA YETERLİK|DOKTORA TEZİ|TEZ ÇALIŞMASI)$/u.test(name);
};

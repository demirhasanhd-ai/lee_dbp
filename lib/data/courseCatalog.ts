import type { LeeProgram } from "./programs";
import {
  OFFICIAL_COURSES as OBS_OFFICIAL_COURSES,
  type OfficialCourse,
} from "./officialCourses";

const sanitizeInstructorName = (value = "") => value
  .replace(/\bYrd\.?\s*Doç\.?\s*Dr\.?\b/giu, "Dr. Öğr. Üyesi")
  .replace(/(?:https?:\/\/|www\.)\S+/giu, " ")
  .replace(/\b(?:akbis\.)?osmaniye\.edu\.tr\/\S+/giu, " ")
  .replace(/\b\S+@\S+\b/giu, " ")
  .replace(/\s+\b(?:yok|null|undefined)\b\s*$/giu, "")
  .replace(/\s+/g, " ")
  .trim();

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
const BIYOLOJI_DR_ADVISORY_CODES = new Set(["DAN901", "DAN902", "DAN903", "DAN904", "DAN905", "DAN906", "DAN907", "DAN908"]);
const BIYOLOJI_DR_SPECIALIZATION_CODES = new Set(["BİO901", "BİO902", "BİO903", "BİO904", "BİO905", "BİO906", "BİO907", "BİO908"]);
const BIYOLOJI_DR_SEMINAR_CODES = new Set(["BİO909", "BİO910"]);
const BIYOLOJI_DR_QUALIFYING_CODES = new Set(["BİO917", "BİO918"]);
const BIYOLOJI_DR_THESIS_CODES = new Set(["BİO912", "BİO913", "BİO914", "BİO915", "BİO916"]);
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
const ENERJI_DR_ADVISORY_CODES = new Set(["DAN901", "DAN902", "DAN903", "DAN904", "DAN905", "DAN906", "DAN907", "DAN908"]);
const ENERJI_DR_SPECIALIZATION_CODES = new Set(["EMB901", "EMB902", "EMB903", "EMB904", "EMB905", "EMB906", "EMB907", "EMB908"]);
const ENERJI_DR_SEMINAR_CODES = new Set(["EMB909", "EMB910"]);
const ENERJI_DR_QUALIFYING_CODES = new Set(["EMB917", "EMB918"]);
const ENERJI_DR_THESIS_CODES = new Set(["EMB912", "EMB913", "EMB914", "EMB915", "EMB916"]);
const FELSEFE_DIN_YL_ADVISORY_CODES = new Set(["DAN801", "DAN802", "DAN803", "DAN804"]);
const FELSEFE_DIN_YL_SPECIALIZATION_CODES = new Set(["FDB801", "FDB802", "FDB803", "FDB804"]);
const FELSEFE_DIN_YL_SEMINAR_CODES = new Set(["FDB805", "FDB806"]);
const FELSEFE_DIN_YL_RESEARCH_CODES = new Set(["BES801", "BES802"]);
const FELSEFE_DIN_YL_THESIS_CODES = new Set(["FDB807", "FDB808"]);
const FIZIK_YL_ADVISORY_CODES = new Set(["DAN801", "DAN802", "DAN803", "DAN804"]);
const FIZIK_YL_SPECIALIZATION_CODES = new Set(["FZK801", "FZK802", "FZK803", "FZK804"]);
const FIZIK_YL_SEMINAR_CODES = new Set(["FZK805", "FZK806"]);
const FIZIK_YL_RESEARCH_CODES = new Set(["FZK898", "FZK899"]);
const FIZIK_YL_THESIS_CODES = new Set(["FZK807", "FZK808"]);
const FIZIK_DR_ADVISORY_CODES = new Set(["DAN901", "DAN902", "DAN903", "DAN904", "DAN905", "DAN906", "DAN907", "DAN908"]);
const FIZIK_DR_SPECIALIZATION_CODES = new Set(["FZK901", "FZK902", "FZK903", "FZK904", "FZK905", "FZK906", "FZK907", "FZK908"]);
const FIZIK_DR_SEMINAR_CODES = new Set(["FZK909", "FZK910"]);
const FIZIK_DR_QUALIFYING_CODES = new Set(["FZK917", "FZK918"]);
const FIZIK_DR_THESIS_CODES = new Set(["FZK912", "FZK913", "FZK914", "FZK915", "FZK916"]);
const GASTRONOMI_YL_ADVISORY_CODES = new Set(["DAN801", "DAN802"]);
const GASTRONOMI_YL_SPECIALIZATION_CODES = new Set(["GMS801", "GMS802", "GMS803", "GMS804"]);
const GASTRONOMI_YL_SEMINAR_CODES = new Set(["GMS805", "GMS806"]);
const GASTRONOMI_YL_RESEARCH_CODES = new Set(["GMS851", "GMS852"]);
const GASTRONOMI_YL_THESIS_CODES = new Set(["GMS807", "GMS808"]);
const GIDA_MUHENDISLIGI_YL_ADVISORY_CODES = new Set(["DAN801", "DAN802", "DAN803", "DAN804"]);
const GIDA_MUHENDISLIGI_YL_SPECIALIZATION_CODES = new Set(["GMB801", "GMB802", "GMB803", "GMB804"]);
const GIDA_MUHENDISLIGI_YL_SEMINAR_CODES = new Set(["GMB805", "GMB806"]);
const GIDA_MUHENDISLIGI_YL_RESEARCH_CODES = new Set(["GMB853", "GMB856"]);
const GIDA_MUHENDISLIGI_YL_THESIS_CODES = new Set(["GMB807", "GMB808"]);
const GIDA_MUHENDISLIGI_DR_ADVISORY_CODES = new Set(["DAN901", "DAN902", "DAN903", "DAN904", "DAN905", "DAN906", "DAN907", "DAN908"]);
const GIDA_MUHENDISLIGI_DR_SPECIALIZATION_CODES = new Set(["GMB901", "GMB902", "GMB903", "GMB904", "GMB905", "GMB906", "GMB907", "GMB908"]);
const GIDA_MUHENDISLIGI_DR_SEMINAR_CODES = new Set(["GMB909", "GMB910"]);
const GIDA_MUHENDISLIGI_DR_QUALIFYING_CODES = new Set(["GMB917", "GMB918"]);
const GIDA_MUHENDISLIGI_DR_THESIS_CODES = new Set(["GMB912", "GMB913", "GMB914", "GMB915", "GMB916"]);
const INSAAT_MUHENDISLIGI_DR_ADVISORY_CODES = new Set(["DAN901", "DAN902", "DAN903", "DAN904", "DAN905", "DAN906", "DAN907", "DAN908"]);
const INSAAT_MUHENDISLIGI_DR_SPECIALIZATION_CODES = new Set(["İNŞ901", "İNŞ902", "İNŞ903", "İNŞ904", "İNŞ905", "İNŞ906", "İNŞ907", "İNŞ908"]);
const INSAAT_MUHENDISLIGI_DR_SEMINAR_CODES = new Set(["İNŞ909", "İNŞ910"]);
const INSAAT_MUHENDISLIGI_DR_QUALIFYING_CODES = new Set(["İNŞ917", "İNŞ918"]);
const INSAAT_MUHENDISLIGI_DR_THESIS_CODES = new Set(["İNŞ912", "İNŞ913", "İNŞ914", "İNŞ915", "İNŞ916"]);
const ISLETME_DR_ADVISORY_CODES = new Set(["DAN901", "DAN902", "DAN903", "DAN904", "DAN905", "DAN906", "DAN907", "DAN908"]);
const ISLETME_DR_SPECIALIZATION_CODES = new Set(["ISL901", "ISL902", "ISL903", "ISL904", "ISL905", "ISL906", "ISL907", "ISL908"]);
const ISLETME_DR_SEMINAR_CODES = new Set(["ISL909", "ISL910"]);
const ISLETME_DR_QUALIFYING_CODES = new Set(["ISL917", "ISL918"]);
const ISLETME_DR_THESIS_CODES = new Set(["ISL911", "ISL912", "ISL913", "ISL914", "ISL915", "ISL916"]);
const KIMYA_DR_ADVISORY_CODES = new Set(["DAN901", "DAN902", "DAN903", "DAN904", "DAN905", "DAN906", "DAN907", "DAN908"]);
const KIMYA_DR_SPECIALIZATION_CODES = new Set(["KİM901", "KİM902", "KİM903", "KİM904", "KİM905", "KİM906", "KİM907", "KİM908"]);
const KIMYA_DR_SEMINAR_CODES = new Set(["KİM909", "KİM910"]);
const KIMYA_DR_RESEARCH_CODES = new Set(["KİM931", "KİM932"]);
const KIMYA_DR_QUALIFYING_CODES = new Set(["KİM917", "KİM918"]);
const KIMYA_DR_THESIS_CODES = new Set(["KİM912", "KİM913", "KİM914", "KİM915", "KİM916"]);
const GIDA_TEKNOLOJISI_YL_ADVISORY_CODES = new Set(["DAN801", "DAN802", "DAN803", "DAN804"]);
const GIDA_TEKNOLOJISI_YL_SPECIALIZATION_CODES = new Set(["GTB801", "GTB802", "GTB803", "GTB804"]);
const GIDA_TEKNOLOJISI_YL_SEMINAR_CODES = new Set(["GTB805", "GTB806"]);
const GIDA_TEKNOLOJISI_YL_RESEARCH_CODES = new Set(["GTB828", "GTB829"]);
const GIDA_TEKNOLOJISI_YL_THESIS_CODES = new Set(["GTB807", "GTB808"]);
const HARITA_YL_ADVISORY_CODES = new Set(["DAN801", "DAN802", "DAN803", "DAN804"]);
const HARITA_YL_SPECIALIZATION_CODES = new Set(["HRM801", "HRM802", "HRM803", "HRM804"]);
const HARITA_YL_SEMINAR_CODES = new Set(["HRM805", "HRM806"]);
const HARITA_YL_THESIS_CODES = new Set(["HRM807", "HRM808"]);
const IC_HASTALIKLARI_YL_ADVISORY_CODES = new Set(["DAN801", "DAN802", "DAN803", "DAN804"]);
const IC_HASTALIKLARI_YL_SPECIALIZATION_CODES = new Set(["İHH801", "İHH802", "İHH803", "İHH804"]);
const IC_HASTALIKLARI_YL_SEMINAR_CODES = new Set(["İHH805", "İHH806"]);
const IC_HASTALIKLARI_YL_RESEARCH_CODES = new Set(["İHH809", "İHH810"]);
const IC_HASTALIKLARI_YL_THESIS_CODES = new Set(["İHH807", "İHH808"]);
const IKTISAT_YL_ADVISORY_CODES = new Set(["DAN801", "DAN802"]);
const IKTISAT_YL_SPECIALIZATION_CODES = new Set(["İKT801", "İKT802", "İKT803", "İKT804"]);
const IKTISAT_YL_SEMINAR_CODES = new Set(["İKT805", "İKT806"]);
const IKTISAT_YL_RESEARCH_CODES = new Set(["İKT897", "İKT898"]);
const IKTISAT_YL_THESIS_CODES = new Set(["İKT807", "İKT808"]);
const INSAAT_YL_ADVISORY_CODES = new Set(["DAN801", "DAN802", "DAN803", "DAN804"]);
const INSAAT_YL_SPECIALIZATION_CODES = new Set(["İNŞ801", "İNŞ802", "İNŞ803", "İNŞ804"]);
const INSAAT_YL_SEMINAR_CODES = new Set(["İNŞ805", "İNŞ806"]);
const INSAAT_YL_RESEARCH_CODES = new Set(["İNŞ897", "İNŞ898"]);
const INSAAT_YL_THESIS_CODES = new Set(["İNŞ807", "İNŞ808"]);
const ISLETME_YL_ADVISORY_CODES = new Set(["DAN801", "DAN802"]);
const ISLETME_YL_SPECIALIZATION_CODES = new Set(["ISL801", "ISL802", "ISL803", "ISL804"]);
const ISLETME_YL_SEMINAR_CODES = new Set(["ISL805", "ISL806"]);
const ISLETME_YL_RESEARCH_CODES = new Set(["ISL885", "ISL888"]);
const ISLETME_YL_THESIS_CODES = new Set(["ISL807", "ISL808"]);
const KIMYA_YL_ADVISORY_CODES = new Set(["DAN801", "DAN802", "DAN803", "DAN804"]);
const KIMYA_YL_SPECIALIZATION_CODES = new Set(["KİM801", "KİM802", "KİM803", "KİM804"]);
const KIMYA_YL_SEMINAR_CODES = new Set(["KİM805", "KİM806"]);
const KIMYA_YL_RESEARCH_CODES = new Set(["KİM839", "KİM840"]);
const KIMYA_YL_THESIS_CODES = new Set(["KİM807", "KİM808"]);
const MATEMATIK_YL_ADVISORY_CODES = new Set(["DAN801", "DAN802", "DAN803", "DAN804"]);
const MATEMATIK_YL_SPECIALIZATION_CODES = new Set(["MAT801", "MAT802", "MAT803", "MAT804"]);
const MATEMATIK_YL_SEMINAR_CODES = new Set(["MAT805", "MAT806"]);
const MATEMATIK_YL_RESEARCH_CODES = new Set(["MAT862", "MAT863"]);
const MATEMATIK_YL_THESIS_CODES = new Set(["MAT807", "MAT808"]);
const MUHASEBE_FINANSMAN_YL_ADVISORY_CODES = new Set(["DAN801", "DAN802"]);
const MUHASEBE_FINANSMAN_YL_SPECIALIZATION_CODES = new Set(["MUF801", "MUF802", "MUF803", "MUF804"]);
const MUHASEBE_FINANSMAN_YL_SEMINAR_CODES = new Set(["MUF805", "MUF806"]);
const MUHASEBE_FINANSMAN_YL_RESEARCH_CODES = new Set(["MUF849", "MUF852"]);
const MUHASEBE_FINANSMAN_YL_THESIS_CODES = new Set(["MUF807", "MUF808"]);
const ORGANIK_TARIM_YL_ADVISORY_CODES = new Set(["DAN801", "DAN802", "DAN803", "DAN804"]);
const ORGANIK_TARIM_YL_SPECIALIZATION_CODES = new Set(["OTİ801", "OTİ802", "OTİ803", "OTİ804"]);
const ORGANIK_TARIM_YL_SEMINAR_CODES = new Set(["OTİ805", "OTİ806"]);
const ORGANIK_TARIM_YL_RESEARCH_CODES = new Set(["OTİ841", "OTİ844"]);
const ORGANIK_TARIM_YL_THESIS_CODES = new Set(["OTİ807", "OTİ808"]);
const RESIM_YL_ADVISORY_CODES = new Set(["DAN801", "DAN802"]);
const RESIM_YL_SPECIALIZATION_CODES = new Set(["RES801", "RES802", "RES803", "RES804"]);
const RESIM_YL_SEMINAR_CODES = new Set(["RES805", "RES806"]);
const RESIM_YL_RESEARCH_CODES = new Set(["RES881", "RES882"]);
const RESIM_YL_THESIS_CODES = new Set(["RES807", "RES808"]);
const SIYASET_KAMU_YL_ADVISORY_CODES = new Set(["DAN801", "DAN802"]);
const SIYASET_KAMU_YL_SPECIALIZATION_CODES = new Set(["SKY801", "SKY802", "SKY803", "SKY804"]);
const SIYASET_KAMU_YL_SEMINAR_CODES = new Set(["SKY805", "SKY806"]);
const SIYASET_KAMU_YL_RESEARCH_CODES = new Set(["SKY898", "SKY899"]);
const SIYASET_KAMU_YL_THESIS_CODES = new Set(["SKY807", "SKY808"]);
const TARIH_YL_RESEARCH_CODES = new Set(["BES801", "BES802"]);
const TARIH_YL_ADVISORY_CODES = new Set(["DAN801", "DAN802"]);
const TARIH_YL_SPECIALIZATION_CODES = new Set(["TTZ801", "TTZ802", "TTZ803", "TTZ804", "TTZ897"]);
const TARIH_YL_SEMINAR_CODES = new Set(["TTZ805", "TTZ806"]);
const TARIH_YL_THESIS_CODES = new Set(["TTZ807", "TTZ808"]);
const TEMEL_ISLAM_YL_RESEARCH_CODES = new Set(["TİB879"]);
const TEMEL_ISLAM_YL_ADVISORY_CODES = new Set(["DAN801", "DAN802"]);
const TEMEL_ISLAM_YL_SPECIALIZATION_CODES = new Set(["TİB801", "TİB802", "TİB803", "TİB804"]);
const TEMEL_ISLAM_YL_SEMINAR_CODES = new Set(["TİB805", "TİB806"]);
const TEMEL_ISLAM_YL_THESIS_CODES = new Set(["TİB807", "TİB808"]);
const TDE_YL_RESEARCH_CODES = new Set(["BES801"]);
const TDE_YL_ADVISORY_CODES = new Set(["DAN801", "DAN802"]);
const TDE_YL_SPECIALIZATION_CODES = new Set(["TDE801", "TDE802", "TDE803", "TDE804"]);
const TDE_YL_SEMINAR_CODES = new Set(["TDE805", "TDE806"]);
const TDE_YL_THESIS_CODES = new Set(["TDE807", "TDE808"]);
const YBS_YL_RESEARCH_CODES = new Set(["BES801", "BES802"]);
const YBS_YL_ADVISORY_CODES = new Set(["DAN801", "DAN802"]);
const YBS_YL_SPECIALIZATION_CODES = new Set(["YBS801", "YBS802", "YBS803", "YBS804"]);
const YBS_YL_SEMINAR_CODES = new Set(["YBS805", "YBS806"]);
const YBS_YL_THESIS_CODES = new Set(["YBS807", "YBS808"]);
const YONETIM_ORGANIZASYON_YL_RESEARCH_CODES = new Set(["YON841", "BES802"]);
const YONETIM_ORGANIZASYON_YL_ADVISORY_CODES = new Set(["DAN801", "DAN802"]);
const YONETIM_ORGANIZASYON_YL_SPECIALIZATION_CODES = new Set(["YON801", "YON802", "YON803", "YON804"]);
const YONETIM_ORGANIZASYON_YL_SEMINAR_CODES = new Set(["YON805", "YON806"]);
const YONETIM_ORGANIZASYON_YL_THESIS_CODES = new Set(["YON807", "YON808"]);

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

const normalizeBiyolojiDoktoraCourse = (course: OfficialCourse): OfficialCourse | null => {
  const applies = course.department === "Biyoloji ABD" && course.programName === "Biyoloji" && course.level === "Doktora";
  if (!applies) return course;
  if (BIYOLOJI_DR_ADVISORY_CODES.has(course.code)) return course.code === "DAN901" ? withAdvisor({ ...course, code:"DAN9XX", name:"DANIŞMANLIK", ects:1 }) : null;
  if (BIYOLOJI_DR_SPECIALIZATION_CODES.has(course.code)) return course.code === "BİO901" ? withAdvisor({ ...course, code:"BİO9XX", name:"UZMANLIK ALAN DERSİ", ects:5 }) : null;
  if (BIYOLOJI_DR_SEMINAR_CODES.has(course.code)) return course.code === "BİO909" ? withAdvisor({ ...course, code:"BİO909", name:"SEMİNER", ects:6 }) : null;
  if (BIYOLOJI_DR_QUALIFYING_CODES.has(course.code)) return course.code === "BİO917" ? withAdvisor({ ...course, code:"BİO917", name:"DOKTORA YETERLİK", ects:24 }) : null;
  if (BIYOLOJI_DR_THESIS_CODES.has(course.code)) return course.code === "BİO912" ? withAdvisor({ ...course, code:"BİO91X", name:"TEZ ÇALIŞMASI", ects:24 }) : null;
  return course;
};

const normalizeEnerjiDoktoraCourse = (course: OfficialCourse): OfficialCourse | null => {
  const applies = course.department === "Enerji Sistemleri Mühendisliği ABD" && course.programName === "Enerji Sistemleri Mühendisliği" && course.level === "Doktora";
  if (!applies) return course;
  if (ENERJI_DR_ADVISORY_CODES.has(course.code)) return course.code === "DAN901" ? withAdvisor({ ...course, code:"DAN9XX", name:"DANIŞMANLIK", ects:1 }) : null;
  if (ENERJI_DR_SPECIALIZATION_CODES.has(course.code)) return course.code === "EMB901" ? withAdvisor({ ...course, code:"EMB9XX", name:"UZMANLIK ALAN DERSİ", ects:5 }) : null;
  if (ENERJI_DR_SEMINAR_CODES.has(course.code)) return course.code === "EMB909" ? withAdvisor({ ...course, code:"EMB909", name:"SEMİNER", ects:6 }) : null;
  if (ENERJI_DR_QUALIFYING_CODES.has(course.code)) return course.code === "EMB917" ? withAdvisor({ ...course, code:"EMB917", name:"DOKTORA YETERLİK", ects:24 }) : null;
  if (ENERJI_DR_THESIS_CODES.has(course.code)) return course.code === "EMB912" ? withAdvisor({ ...course, code:"EMB91X", name:"TEZ ÇALIŞMASI", ects:24 }) : null;
  return course;
};

const normalizeFizikDoktoraCourse = (course: OfficialCourse): OfficialCourse | null => {
  const applies = course.department === "Fizik ABD" && course.programName === "Fizik" && course.level === "Doktora";
  if (!applies) return course;
  if (FIZIK_DR_ADVISORY_CODES.has(course.code)) return course.code === "DAN901" ? withAdvisor({ ...course, code:"DAN9XX", name:"DANIŞMANLIK", ects:1 }) : null;
  if (FIZIK_DR_SPECIALIZATION_CODES.has(course.code)) return course.code === "FZK901" ? withAdvisor({ ...course, code:"FZK9XX", name:"UZMANLIK ALAN DERSİ", ects:5 }) : null;
  if (FIZIK_DR_SEMINAR_CODES.has(course.code)) return course.code === "FZK909" ? withAdvisor({ ...course, code:"FZK909", name:"SEMİNER", ects:6 }) : null;
  if (FIZIK_DR_QUALIFYING_CODES.has(course.code)) return course.code === "FZK917" ? withAdvisor({ ...course, code:"FZK917", name:"DOKTORA YETERLİK", ects:24 }) : null;
  if (FIZIK_DR_THESIS_CODES.has(course.code)) return course.code === "FZK912" ? withAdvisor({ ...course, code:"FZK91X", name:"TEZ ÇALIŞMASI", ects:24 }) : null;
  return course;
};

const normalizeGidaMuhendisligiDoktoraCourse = (course: OfficialCourse): OfficialCourse | null => {
  const applies = course.department === "Gıda Mühendisliği ABD" && course.programName === "Gıda Mühendisliği" && course.level === "Doktora";
  if (!applies) return course;
  if (GIDA_MUHENDISLIGI_DR_ADVISORY_CODES.has(course.code)) return course.code === "DAN901" ? withAdvisor({ ...course, code:"DAN9XX", name:"DANIŞMANLIK", ects:1 }) : null;
  if (GIDA_MUHENDISLIGI_DR_SPECIALIZATION_CODES.has(course.code)) return course.code === "GMB901" ? withAdvisor({ ...course, code:"GMB9XX", name:"UZMANLIK ALAN DERSİ", ects:5 }) : null;
  if (GIDA_MUHENDISLIGI_DR_SEMINAR_CODES.has(course.code)) return course.code === "GMB909" ? withAdvisor({ ...course, code:"GMB909", name:"SEMİNER", ects:6 }) : null;
  if (GIDA_MUHENDISLIGI_DR_QUALIFYING_CODES.has(course.code)) return course.code === "GMB917" ? withAdvisor({ ...course, code:"GMB917", name:"DOKTORA YETERLİK", ects:24 }) : null;
  if (GIDA_MUHENDISLIGI_DR_THESIS_CODES.has(course.code)) return course.code === "GMB912" ? withAdvisor({ ...course, code:"GMB91X", name:"TEZ ÇALIŞMASI", ects:24 }) : null;
  return course;
};

const normalizeInsaatMuhendisligiDoktoraCourse = (course: OfficialCourse): OfficialCourse | null => {
  const applies = course.department === "İnşaat Mühendisliği ABD" && course.programName === "İnşaat Mühendisliği" && course.level === "Doktora";
  if (!applies) return course;
  if (INSAAT_MUHENDISLIGI_DR_ADVISORY_CODES.has(course.code)) return course.code === "DAN901" ? withAdvisor({ ...course, code:"DAN9XX", name:"DANIŞMANLIK", ects:1 }) : null;
  if (INSAAT_MUHENDISLIGI_DR_SPECIALIZATION_CODES.has(course.code)) return course.code === "İNŞ901" ? withAdvisor({ ...course, code:"İNŞ9XX", name:"UZMANLIK ALAN DERSİ", ects:5 }) : null;
  if (INSAAT_MUHENDISLIGI_DR_SEMINAR_CODES.has(course.code)) return course.code === "İNŞ909" ? withAdvisor({ ...course, code:"İNŞ909", name:"SEMİNER", ects:6 }) : null;
  if (INSAAT_MUHENDISLIGI_DR_QUALIFYING_CODES.has(course.code)) return course.code === "İNŞ917" ? withAdvisor({ ...course, code:"İNŞ917", name:"DOKTORA YETERLİK", ects:24 }) : null;
  if (INSAAT_MUHENDISLIGI_DR_THESIS_CODES.has(course.code)) return course.code === "İNŞ912" ? withAdvisor({ ...course, code:"İNŞ91X", name:"TEZ ÇALIŞMASI", ects:24 }) : null;
  return course;
};

const normalizeIsletmeDoktoraCourse = (course: OfficialCourse): OfficialCourse | null => {
  const applies = course.department === "İşletme" && course.programName === "İşletme" && course.level === "Doktora";
  if (!applies) return course;
  if (ISLETME_DR_ADVISORY_CODES.has(course.code)) return course.code === "DAN901" ? withAdvisor({ ...course, code:"DAN9XX", name:"DANIŞMANLIK", ects:1 }) : null;
  if (ISLETME_DR_SPECIALIZATION_CODES.has(course.code)) return course.code === "ISL901" ? withAdvisor({ ...course, code:"ISL9XX", name:"UZMANLIK ALAN DERSİ", ects:5 }) : null;
  if (ISLETME_DR_SEMINAR_CODES.has(course.code)) return course.code === "ISL909" ? withAdvisor({ ...course, code:"ISL909", name:"SEMİNER", ects:6 }) : null;
  if (ISLETME_DR_QUALIFYING_CODES.has(course.code)) return course.code === "ISL917" ? withAdvisor({ ...course, code:"ISL917", name:"DOKTORA YETERLİK", ects:24 }) : null;
  if (ISLETME_DR_THESIS_CODES.has(course.code)) return course.code === "ISL912" ? withAdvisor({ ...course, code:"ISL91X", name:"TEZ ÇALIŞMASI", ects:24 }) : null;
  return course;
};

const normalizeKimyaDoktoraCourse = (course: OfficialCourse): OfficialCourse | null => {
  const applies = course.department === "Kimya ABD" && course.programName === "Kimya" && course.level === "Doktora";
  if (!applies) return course;
  if (KIMYA_DR_ADVISORY_CODES.has(course.code)) return course.code === "DAN901" ? withAdvisor({ ...course, code:"DAN9XX", name:"DANIŞMANLIK", ects:1 }) : null;
  if (KIMYA_DR_SPECIALIZATION_CODES.has(course.code)) return course.code === "KİM901" ? withAdvisor({ ...course, code:"KİM9XX", name:"UZMANLIK ALAN DERSİ", ects:5 }) : null;
  if (KIMYA_DR_SEMINAR_CODES.has(course.code)) return course.code === "KİM909" ? withAdvisor({ ...course, code:"KİM909", name:"SEMİNER", ects:6 }) : null;
  if (KIMYA_DR_RESEARCH_CODES.has(course.code)) return course.code === "KİM931" ? { ...course, code:"KİM931", name:"BİLİMSEL ARAŞTIRMA YÖNTEMLERİ VE YAYIN ETİĞİ", ects:6 } : null;
  if (KIMYA_DR_QUALIFYING_CODES.has(course.code)) return course.code === "KİM917" ? withAdvisor({ ...course, code:"KİM917", name:"DOKTORA YETERLİK", ects:24 }) : null;
  if (KIMYA_DR_THESIS_CODES.has(course.code)) return course.code === "KİM912" ? withAdvisor({ ...course, code:"KİM91X", name:"TEZ ÇALIŞMASI", ects:24 }) : null;
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

const normalizeFizikTezliCourse = (course: OfficialCourse): OfficialCourse | null => {
  const applies = course.department === "Fizik ABD" && course.programName === "Fizik" && course.level === "Tezli Yüksek Lisans";
  if (!applies) return course;
  if (FIZIK_YL_ADVISORY_CODES.has(course.code)) return course.code === "DAN801" ? withAdvisor({ ...course, code:"DAN8XX", name:"DANIŞMANLIK", ects:1 }) : null;
  if (FIZIK_YL_SPECIALIZATION_CODES.has(course.code)) return course.code === "FZK801" ? withAdvisor({ ...course, code:"FZK8XX", name:"UZMANLIK ALAN DERSİ", ects:5 }) : null;
  if (FIZIK_YL_SEMINAR_CODES.has(course.code)) return course.code === "FZK806" ? withAdvisor({ ...course, code:"FZK806", name:"SEMİNER", ects:6 }) : null;
  if (FIZIK_YL_RESEARCH_CODES.has(course.code)) return course.code === "FZK899" ? { ...course, code:"FZK899", name:"BİLİMSEL ARAŞTIRMA YÖNTEMLERİ VE YAYIN ETİĞİ", ects:6 } : null;
  if (FIZIK_YL_THESIS_CODES.has(course.code)) return course.code === "FZK807" ? withAdvisor({ ...course, code:"FZK81X", name:"YÜKSEK LİSANS TEZİ", ects:24 }) : null;
  return course;
};

const normalizeGastronomiTezliCourse = (course: OfficialCourse): OfficialCourse | null => {
  const applies = course.department === "Gastronomi ve Mutfak Sanatları ABD" && course.programName === "Gastronomi ve Mutfak Sanatları" && course.level === "Tezli Yüksek Lisans";
  if (!applies) return course;
  if (GASTRONOMI_YL_ADVISORY_CODES.has(course.code)) return course.code === "DAN801" ? withAdvisor({ ...course, code:"DAN8XX", name:"DANIŞMANLIK", ects:1 }) : null;
  if (GASTRONOMI_YL_SPECIALIZATION_CODES.has(course.code)) return course.code === "GMS801" ? withAdvisor({ ...course, code:"GMS8XX", name:"UZMANLIK ALAN DERSİ", ects:6 }) : null;
  if (GASTRONOMI_YL_SEMINAR_CODES.has(course.code)) return course.code === "GMS805" ? withAdvisor({ ...course, code:"GMS806", name:"SEMİNER", ects:6 }) : null;
  if (GASTRONOMI_YL_RESEARCH_CODES.has(course.code)) return course.code === "GMS851" ? { ...course, code:"GMS85X", name:"BİLİMSEL ARAŞTIRMA YÖNTEMLERİ VE YAYIN ETİĞİ", ects:6 } : null;
  if (GASTRONOMI_YL_THESIS_CODES.has(course.code)) return course.code === "GMS807" ? withAdvisor({ ...course, code:"GMS81X", name:"TEZ ÇALIŞMASI", ects:24 }) : null;
  return course;
};

const normalizeGidaMuhendisligiTezliCourse = (course: OfficialCourse): OfficialCourse | null => {
  const applies = course.department === "Gıda Mühendisliği ABD" && course.programName === "Gıda Mühendisliği" && course.level === "Tezli Yüksek Lisans";
  if (!applies) return course;
  if (GIDA_MUHENDISLIGI_YL_ADVISORY_CODES.has(course.code)) return course.code === "DAN801" ? withAdvisor({ ...course, code:"DAN8XX", name:"DANIŞMANLIK", ects:1 }) : null;
  if (GIDA_MUHENDISLIGI_YL_SPECIALIZATION_CODES.has(course.code)) return course.code === "GMB801" ? withAdvisor({ ...course, code:"GMB8XX", name:"UZMANLIK ALAN DERSİ", ects:5 }) : null;
  if (GIDA_MUHENDISLIGI_YL_SEMINAR_CODES.has(course.code)) return course.code === "GMB805" ? withAdvisor({ ...course, code:"GMB806", name:"SEMİNER", ects:6 }) : null;
  if (GIDA_MUHENDISLIGI_YL_RESEARCH_CODES.has(course.code)) return course.code === "GMB853" ? { ...course, code:"GMB85X", name:"BİLİMSEL ARAŞTIRMA YÖNTEMLERİ VE YAYIN ETİĞİ", ects:6 } : null;
  if (GIDA_MUHENDISLIGI_YL_THESIS_CODES.has(course.code)) return course.code === "GMB807" ? withAdvisor({ ...course, code:"GMB81X", name:"TEZ ÇALIŞMASI", ects:24 }) : null;
  return course;
};

const normalizeGidaTeknolojisiTezliCourse = (course: OfficialCourse): OfficialCourse | null => {
  const applies = course.department === "Gıda Teknolojisi ABD" && course.programName === "Gıda Teknolojisi" && course.level === "Tezli Yüksek Lisans";
  if (!applies) return course;
  if (GIDA_TEKNOLOJISI_YL_ADVISORY_CODES.has(course.code)) return course.code === "DAN801" ? withAdvisor({ ...course, code:"DAN8XX", name:"DANIŞMANLIK", ects:1 }) : null;
  if (GIDA_TEKNOLOJISI_YL_SPECIALIZATION_CODES.has(course.code)) return course.code === "GTB801" ? withAdvisor({ ...course, code:"GTB8XX", name:"UZMANLIK ALAN DERSİ", ects:5 }) : null;
  if (GIDA_TEKNOLOJISI_YL_SEMINAR_CODES.has(course.code)) return course.code === "GTB805" ? withAdvisor({ ...course, code:"GTB806", name:"SEMİNER", ects:6 }) : null;
  if (GIDA_TEKNOLOJISI_YL_RESEARCH_CODES.has(course.code)) return course.code === "GTB829" ? { ...course, code:"GTB82X", name:"BİLİMSEL ARAŞTIRMA YÖNTEMLERİ VE YAYIN ETİĞİ", ects:6 } : null;
  if (GIDA_TEKNOLOJISI_YL_THESIS_CODES.has(course.code)) return course.code === "GTB807" ? withAdvisor({ ...course, code:"GTB81X", name:"TEZ ÇALIŞMASI", ects:24 }) : null;
  return course;
};

const normalizeHaritaTezliCourse = (course: OfficialCourse): OfficialCourse | null => {
  const applies = course.department === "Harita Mühendisliği ABD" && course.programName === "Harita Mühendisliği" && course.level === "Tezli Yüksek Lisans";
  if (!applies) return course;
  if (HARITA_YL_ADVISORY_CODES.has(course.code)) return course.code === "DAN801" ? withAdvisor({ ...course, code:"DAN8XX", name:"DANIŞMANLIK", ects:1 }) : null;
  if (HARITA_YL_SPECIALIZATION_CODES.has(course.code)) return course.code === "HRM801" ? withAdvisor({ ...course, code:"HRM8XX", name:"UZMANLIK ALAN DERSİ", ects:5 }) : null;
  if (HARITA_YL_SEMINAR_CODES.has(course.code)) return course.code === "HRM805" ? withAdvisor({ ...course, code:"HRM806", name:"SEMİNER", ects:6 }) : null;
  if (HARITA_YL_THESIS_CODES.has(course.code)) return course.code === "HRM807" ? withAdvisor({ ...course, code:"HRM81X", name:"TEZ ÇALIŞMASI", ects:24 }) : null;
  return course;
};

const normalizeIcHastaliklariTezliCourse = (course: OfficialCourse): OfficialCourse | null => {
  const applies = course.department === "Hemşirelik ABD" && course.programName === "İç Hastalıkları Hemşireliği" && course.level === "Tezli Yüksek Lisans";
  if (!applies) return course;
  if (IC_HASTALIKLARI_YL_ADVISORY_CODES.has(course.code)) return course.code === "DAN801" ? withAdvisor({ ...course, code:"DAN8XX", name:"DANIŞMANLIK", ects:1 }) : null;
  if (IC_HASTALIKLARI_YL_SPECIALIZATION_CODES.has(course.code)) return course.code === "İHH801" ? withAdvisor({ ...course, code:"İHH8XX", name:"UZMANLIK ALAN DERSİ", ects:5 }) : null;
  if (IC_HASTALIKLARI_YL_SEMINAR_CODES.has(course.code)) return course.code === "İHH805" ? withAdvisor({ ...course, code:"İHH806", name:"SEMİNER", ects:6 }) : null;
  if (IC_HASTALIKLARI_YL_RESEARCH_CODES.has(course.code)) return course.code === "İHH809" ? { ...course, code:"İHH809", name:"BİLİMSEL ARAŞTIRMA YÖNTEMLERİ VE YAYIN ETİĞİ", ects:6 } : null;
  if (IC_HASTALIKLARI_YL_THESIS_CODES.has(course.code)) return course.code === "İHH807" ? withAdvisor({ ...course, code:"İHH81X", name:"TEZ ÇALIŞMASI", ects:24 }) : null;
  return course;
};

const normalizeIktisatTezliCourse = (course: OfficialCourse): OfficialCourse | null => {
  const applies = course.department === "İktisat ABD" && course.programName === "İktisat" && course.level === "Tezli Yüksek Lisans";
  if (!applies) return course;
  if (IKTISAT_YL_ADVISORY_CODES.has(course.code)) return course.code === "DAN801" ? withAdvisor({ ...course, code:"DAN8XX", name:"DANIŞMANLIK", ects:1 }) : null;
  if (IKTISAT_YL_SPECIALIZATION_CODES.has(course.code)) return course.code === "İKT801" ? withAdvisor({ ...course, code:"İKT8XX", name:"UZMANLIK ALAN DERSİ", ects:5 }) : null;
  if (IKTISAT_YL_SEMINAR_CODES.has(course.code)) return course.code === "İKT805" ? withAdvisor({ ...course, code:"İKT806", name:"SEMİNER", ects:6 }) : null;
  if (IKTISAT_YL_RESEARCH_CODES.has(course.code)) return course.code === "İKT897" ? { ...course, code:"İKT897", name:"BİLİMSEL ARAŞTIRMA YÖNTEMLERİ VE YAYIN ETİĞİ", ects:6 } : null;
  if (IKTISAT_YL_THESIS_CODES.has(course.code)) return course.code === "İKT807" ? withAdvisor({ ...course, code:"İKT81X", name:"TEZ ÇALIŞMASI", ects:24 }) : null;
  return course;
};

const normalizeInsaatTezliCourse = (course: OfficialCourse): OfficialCourse | null => {
  const applies = course.department === "İnşaat Mühendisliği ABD" && course.programName === "İnşaat Mühendisliği" && course.level === "Tezli Yüksek Lisans";
  if (!applies) return course;
  if (INSAAT_YL_ADVISORY_CODES.has(course.code)) return course.code === "DAN801" ? withAdvisor({ ...course, code:"DAN8XX", name:"DANIŞMANLIK", ects:1 }) : null;
  if (INSAAT_YL_SPECIALIZATION_CODES.has(course.code)) return course.code === "İNŞ801" ? withAdvisor({ ...course, code:"İNŞ8XX", name:"UZMANLIK ALAN DERSİ", ects:5 }) : null;
  if (INSAAT_YL_SEMINAR_CODES.has(course.code)) return course.code === "İNŞ805" ? withAdvisor({ ...course, code:"İNŞ806", name:"SEMİNER", ects:6 }) : null;
  if (INSAAT_YL_RESEARCH_CODES.has(course.code)) return course.code === "İNŞ897" ? { ...course, code:"İNŞ897", name:"BİLİMSEL ARAŞTIRMA YÖNTEMLERİ VE YAYIN ETİĞİ", ects:6 } : null;
  if (INSAAT_YL_THESIS_CODES.has(course.code)) return course.code === "İNŞ807" ? withAdvisor({ ...course, code:"İNŞ81X", name:"TEZ ÇALIŞMASI", ects:24 }) : null;
  return course;
};

const normalizeIsletmeTezliCourse = (course: OfficialCourse): OfficialCourse | null => {
  const applies = course.department === "İşletme" && course.programName === "İşletme" && course.level === "Tezli Yüksek Lisans";
  if (!applies) return course;
  if (ISLETME_YL_ADVISORY_CODES.has(course.code)) return course.code === "DAN801" ? withAdvisor({ ...course, code:"DAN8XX", name:"DANIŞMANLIK", ects:1 }) : null;
  if (ISLETME_YL_SPECIALIZATION_CODES.has(course.code)) return course.code === "ISL801" ? withAdvisor({ ...course, code:"ISL8XX", name:"UZMANLIK ALAN DERSİ", ects:5 }) : null;
  if (ISLETME_YL_SEMINAR_CODES.has(course.code)) return course.code === "ISL805" ? withAdvisor({ ...course, code:"ISL806", name:"SEMİNER", ects:6 }) : null;
  if (ISLETME_YL_RESEARCH_CODES.has(course.code)) return course.code === "ISL885" ? { ...course, code:"ISL885", name:"BİLİMSEL ARAŞTIRMA YÖNTEMLERİ VE YAYIN ETİĞİ", ects:6 } : null;
  if (ISLETME_YL_THESIS_CODES.has(course.code)) return course.code === "ISL807" ? withAdvisor({ ...course, code:"ISL81X", name:"TEZ ÇALIŞMASI", ects:24 }) : null;
  return course;
};

const normalizeKimyaTezliCourse = (course: OfficialCourse): OfficialCourse | null => {
  const applies = course.department === "Kimya ABD" && course.programName === "Kimya" && course.level === "Tezli Yüksek Lisans";
  if (!applies) return course;
  if (KIMYA_YL_ADVISORY_CODES.has(course.code)) return course.code === "DAN801" ? withAdvisor({ ...course, code:"DAN8XX", name:"DANIŞMANLIK", ects:1 }) : null;
  if (KIMYA_YL_SPECIALIZATION_CODES.has(course.code)) return course.code === "KİM801" ? withAdvisor({ ...course, code:"KİM8XX", name:"UZMANLIK ALAN DERSİ", ects:5 }) : null;
  if (KIMYA_YL_SEMINAR_CODES.has(course.code)) return course.code === "KİM805" ? withAdvisor({ ...course, code:"KİM806", name:"SEMİNER", ects:6 }) : null;
  if (KIMYA_YL_RESEARCH_CODES.has(course.code)) return course.code === "KİM839" ? { ...course, code:"KİM839", name:"BİLİMSEL ARAŞTIRMA YÖNTEMLERİ VE YAYIN ETİĞİ", ects:6 } : null;
  if (KIMYA_YL_THESIS_CODES.has(course.code)) return course.code === "KİM807" ? withAdvisor({ ...course, code:"KİM81X", name:"TEZ ÇALIŞMASI", ects:24 }) : null;
  return course;
};

const normalizeMatematikTezliCourse = (course: OfficialCourse): OfficialCourse | null => {
  const applies = course.department === "Matematik ABD" && course.programName === "Matematik" && course.level === "Tezli Yüksek Lisans";
  if (!applies) return course;
  if (MATEMATIK_YL_ADVISORY_CODES.has(course.code)) return course.code === "DAN801" ? withAdvisor({ ...course, code:"DAN8XX", name:"DANIŞMANLIK", ects:1 }) : null;
  if (MATEMATIK_YL_SPECIALIZATION_CODES.has(course.code)) return course.code === "MAT801" ? withAdvisor({ ...course, code:"MAT8XX", name:"UZMANLIK ALAN DERSİ", ects:5 }) : null;
  if (MATEMATIK_YL_SEMINAR_CODES.has(course.code)) return course.code === "MAT805" ? withAdvisor({ ...course, code:"MAT805", name:"SEMİNER", ects:6 }) : null;
  if (MATEMATIK_YL_RESEARCH_CODES.has(course.code)) return course.code === "MAT863" ? { ...course, code:"MAT863", name:"BİLİMSEL ARAŞTIRMA YÖNTEMLERİ VE YAYIN ETİĞİ", ects:6 } : null;
  if (MATEMATIK_YL_THESIS_CODES.has(course.code)) return course.code === "MAT807" ? withAdvisor({ ...course, code:"MAT81X", name:"TEZ ÇALIŞMASI", ects:24 }) : null;
  return course;
};

const normalizeMuhasebeFinansmanTezliCourse = (course: OfficialCourse): OfficialCourse | null => {
  const applies = course.department === "Muhasebe ve Finansman" && course.programName === "Muhasebe ve Finansman" && course.level === "Tezli Yüksek Lisans";
  if (!applies) return course;
  if (MUHASEBE_FINANSMAN_YL_ADVISORY_CODES.has(course.code)) return course.code === "DAN801" ? withAdvisor({ ...course, code:"DAN8XX", name:"DANIŞMANLIK", ects:1 }) : null;
  if (MUHASEBE_FINANSMAN_YL_SPECIALIZATION_CODES.has(course.code)) return course.code === "MUF801" ? withAdvisor({ ...course, code:"MUF8XX", name:"UZMANLIK ALAN DERSİ", ects:5 }) : null;
  if (MUHASEBE_FINANSMAN_YL_SEMINAR_CODES.has(course.code)) return course.code === "MUF805" ? withAdvisor({ ...course, code:"MUF805", name:"SEMİNER", ects:6 }) : null;
  if (MUHASEBE_FINANSMAN_YL_RESEARCH_CODES.has(course.code)) return course.code === "MUF849" ? { ...course, code:"MUF849", name:"BİLİMSEL ARAŞTIRMA YÖNTEMLERİ VE YAYIN ETİĞİ", ects:6 } : null;
  if (MUHASEBE_FINANSMAN_YL_THESIS_CODES.has(course.code)) return course.code === "MUF807" ? withAdvisor({ ...course, code:"MUF81X", name:"TEZ ÇALIŞMASI", ects:24 }) : null;
  return course;
};

const normalizeOrganikTarimTezliCourse = (course: OfficialCourse): OfficialCourse | null => {
  const applies = course.department === "Organik Tarım İşletmeciliği ABD" && course.programName === "Organik Tarım İşletmeciliği" && course.level === "Tezli Yüksek Lisans";
  if (!applies) return course;
  if (ORGANIK_TARIM_YL_ADVISORY_CODES.has(course.code)) return course.code === "DAN801" ? withAdvisor({ ...course, code:"DAN8XX", name:"DANIŞMANLIK", ects:1 }) : null;
  if (ORGANIK_TARIM_YL_SPECIALIZATION_CODES.has(course.code)) return course.code === "OTİ801" ? withAdvisor({ ...course, code:"OTİ8XX", name:"UZMANLIK ALAN DERSİ", ects:5 }) : null;
  if (ORGANIK_TARIM_YL_SEMINAR_CODES.has(course.code)) return course.code === "OTİ805" ? withAdvisor({ ...course, code:"OTİ805", name:"SEMİNER", ects:6 }) : null;
  if (ORGANIK_TARIM_YL_RESEARCH_CODES.has(course.code)) return course.code === "OTİ841" ? { ...course, code:"OTİ841", name:"BİLİMSEL ARAŞTIRMA YÖNTEMLERİ VE YAYIN ETİĞİ", ects:6 } : null;
  if (ORGANIK_TARIM_YL_THESIS_CODES.has(course.code)) return course.code === "OTİ807" ? withAdvisor({ ...course, code:"OTİ81X", name:"TEZ ÇALIŞMASI", ects:24 }) : null;
  return course;
};

const normalizeResimTezliCourse = (course: OfficialCourse): OfficialCourse | null => {
  const applies = course.department === "Resim ASD" && course.programName === "Resim" && course.level === "Tezli Yüksek Lisans";
  if (!applies) return course;
  if (RESIM_YL_ADVISORY_CODES.has(course.code)) return course.code === "DAN801" ? withAdvisor({ ...course, code:"DAN8XX", name:"DANIŞMANLIK", ects:1 }) : null;
  if (RESIM_YL_SPECIALIZATION_CODES.has(course.code)) return course.code === "RES801" ? withAdvisor({ ...course, code:"RES8XX", name:"UZMANLIK ALAN DERSİ", ects:5 }) : null;
  if (RESIM_YL_SEMINAR_CODES.has(course.code)) return course.code === "RES805" ? withAdvisor({ ...course, code:"RES805", name:"SEMİNER", ects:6 }) : null;
  if (RESIM_YL_RESEARCH_CODES.has(course.code)) return course.code === "RES881" ? { ...course, code:"RES881", name:"BİLİMSEL ARAŞTIRMA YÖNTEMLERİ VE YAYIN ETİĞİ", ects:6 } : null;
  if (RESIM_YL_THESIS_CODES.has(course.code)) return course.code === "RES807" ? withAdvisor({ ...course, code:"RES81X", name:"TEZ ÇALIŞMASI", ects:24 }) : null;
  return course;
};

const normalizeSiyasetKamuYonetimiTezliCourse = (course: OfficialCourse): OfficialCourse | null => {
  const applies = course.department === "Siyaset Bilimi ve Kamu Yönetimi ABD" && course.programName === "Siyaset Bilimi ve Kamu Yönetimi" && course.level === "Tezli Yüksek Lisans";
  if (!applies) return course;
  if (SIYASET_KAMU_YL_ADVISORY_CODES.has(course.code)) return course.code === "DAN801" ? withAdvisor({ ...course, code:"DAN8XX", name:"DANIŞMANLIK", ects:1 }) : null;
  if (SIYASET_KAMU_YL_SPECIALIZATION_CODES.has(course.code)) return course.code === "SKY801" ? withAdvisor({ ...course, code:"SKY8XX", name:"UZMANLIK ALAN DERSİ", ects:5 }) : null;
  if (SIYASET_KAMU_YL_SEMINAR_CODES.has(course.code)) return course.code === "SKY805" ? withAdvisor({ ...course, code:"SKY805", name:"SEMİNER", ects:6 }) : null;
  if (SIYASET_KAMU_YL_RESEARCH_CODES.has(course.code)) return course.code === "SKY899" ? { ...course, code:"SKY899", name:"BİLİMSEL ARAŞTIRMA VE YAYIN ETİĞİ", ects:6 } : null;
  if (SIYASET_KAMU_YL_THESIS_CODES.has(course.code)) return course.code === "SKY807" ? withAdvisor({ ...course, code:"SKY81X", name:"TEZ ÇALIŞMASI", ects:24 }) : null;
  return course;
};

const normalizeTarihTezliCourse = (course: OfficialCourse): OfficialCourse | null => {
  const applies = course.department === "Tarih ABD" && course.programName === "Tarih" && course.level === "Tezli Yüksek Lisans";
  if (!applies) return course;
  if (TARIH_YL_RESEARCH_CODES.has(course.code)) return course.code === "BES801" ? { ...course, code:"BES801", name:"BİLİMSEL ARAŞTIRMA YÖNTEMLERİ VE YAYIN ETİĞİ", ects:6 } : null;
  if (TARIH_YL_ADVISORY_CODES.has(course.code)) return course.code === "DAN801" ? withAdvisor({ ...course, code:"DAN8XX", name:"DANIŞMANLIK", ects:1 }) : null;
  if (TARIH_YL_SPECIALIZATION_CODES.has(course.code)) return course.code === "TTZ801" ? withAdvisor({ ...course, code:"TTZ8XX", name:"UZMANLIK ALAN DERSİ", ects:5 }) : null;
  if (TARIH_YL_SEMINAR_CODES.has(course.code)) return course.code === "TTZ805" ? withAdvisor({ ...course, code:"TTZ805", name:"SEMİNER", ects:6 }) : null;
  if (TARIH_YL_THESIS_CODES.has(course.code)) return course.code === "TTZ807" ? withAdvisor({ ...course, code:"TTZ81X", name:"TEZ ÇALIŞMASI", ects:24 }) : null;
  return course;
};

const normalizeTemelIslamTezliCourse = (course: OfficialCourse): OfficialCourse | null => {
  const applies = course.department === "Temel İslam Bilimleri ABD" && course.programName === "Temel İslam Bilimleri" && course.level === "Tezli Yüksek Lisans";
  if (!applies) return course;
  if (TEMEL_ISLAM_YL_RESEARCH_CODES.has(course.code)) return { ...course, code:"TİB879", name:"BİLİMSEL ARAŞTIRMA YÖNTEMLERİ VE YAYIN ETİĞİ", ects:6 };
  if (TEMEL_ISLAM_YL_ADVISORY_CODES.has(course.code)) return course.code === "DAN801" ? withAdvisor({ ...course, code:"DAN8XX", name:"DANIŞMANLIK", ects:1 }) : null;
  if (TEMEL_ISLAM_YL_SPECIALIZATION_CODES.has(course.code)) return course.code === "TİB801" ? withAdvisor({ ...course, code:"TİB8XX", name:"UZMANLIK ALAN DERSİ", ects:5 }) : null;
  if (TEMEL_ISLAM_YL_SEMINAR_CODES.has(course.code)) return course.code === "TİB805" ? withAdvisor({ ...course, code:"TİB805", name:"SEMİNER", ects:6 }) : null;
  if (TEMEL_ISLAM_YL_THESIS_CODES.has(course.code)) return course.code === "TİB807" ? withAdvisor({ ...course, code:"TİB81X", name:"TEZ ÇALIŞMASI", ects:24 }) : null;
  return course;
};

const normalizeTurkDiliEdebiyatiTezliCourse = (course: OfficialCourse): OfficialCourse | null => {
  const applies = course.department === "Türk Dili ve Edebiyatı ABD" && course.programName === "Türk Dili ve Edebiyatı" && course.level === "Tezli Yüksek Lisans";
  if (!applies) return course;
  if (TDE_YL_RESEARCH_CODES.has(course.code)) return { ...course, code:"BES801", name:"BİLİMSEL ARAŞTIRMA YÖNTEMLERİ VE YAYIN ETİĞİ", ects:6 };
  if (TDE_YL_ADVISORY_CODES.has(course.code)) return course.code === "DAN801" ? withAdvisor({ ...course, code:"DAN8XX", name:"DANIŞMANLIK", ects:1 }) : null;
  if (TDE_YL_SPECIALIZATION_CODES.has(course.code)) return course.code === "TDE801" ? withAdvisor({ ...course, code:"TDE8XX", name:"UZMANLIK ALAN DERSİ", ects:5 }) : null;
  if (TDE_YL_SEMINAR_CODES.has(course.code)) return course.code === "TDE805" ? withAdvisor({ ...course, code:"TDE805", name:"SEMİNER", ects:6 }) : null;
  if (TDE_YL_THESIS_CODES.has(course.code)) return course.code === "TDE807" ? withAdvisor({ ...course, code:"TDE81X", name:"TEZ ÇALIŞMASI", ects:24 }) : null;
  return course;
};

const normalizeYbsTezliCourse = (course: OfficialCourse): OfficialCourse | null => {
  const applies = course.department === "Yönetim Bilişim Sistemleri ABD" && course.programName === "Yönetim Bilişim Sistemleri" && course.level === "Tezli Yüksek Lisans";
  if (!applies) return course;
  if (YBS_YL_RESEARCH_CODES.has(course.code)) return course.code === "BES801" ? { ...course, code:"BES801", name:"BİLİMSEL ARAŞTIRMA YÖNTEMLERİ VE YAYIN ETİĞİ", ects:6 } : null;
  if (YBS_YL_ADVISORY_CODES.has(course.code)) return course.code === "DAN801" ? withAdvisor({ ...course, code:"DAN8XX", name:"DANIŞMANLIK", ects:1 }) : null;
  if (YBS_YL_SPECIALIZATION_CODES.has(course.code)) return course.code === "YBS801" ? withAdvisor({ ...course, code:"YBS8XX", name:"UZMANLIK ALAN DERSİ", ects:5 }) : null;
  if (YBS_YL_SEMINAR_CODES.has(course.code)) return course.code === "YBS805" ? withAdvisor({ ...course, code:"YBS805", name:"SEMİNER", ects:6 }) : null;
  if (YBS_YL_THESIS_CODES.has(course.code)) return course.code === "YBS807" ? withAdvisor({ ...course, code:"YBS81X", name:"TEZ ÇALIŞMASI", ects:24 }) : null;
  return course;
};

const normalizeYonetimOrganizasyonTezliCourse = (course: OfficialCourse): OfficialCourse | null => {
  const applies = course.department === "Yönetim Organizasyon" && course.programName === "Yönetim Organizasyon" && course.level === "Tezli Yüksek Lisans";
  if (!applies) return course;
  if (YONETIM_ORGANIZASYON_YL_RESEARCH_CODES.has(course.code)) return course.code === "YON841" ? { ...course, code:"YON841", name:"BİLİMSEL ARAŞTIRMA YÖNTEMLERİ VE YAYIN ETİĞİ", ects:6 } : null;
  if (YONETIM_ORGANIZASYON_YL_ADVISORY_CODES.has(course.code)) return course.code === "DAN801" ? withAdvisor({ ...course, code:"DAN8XX", name:"DANIŞMANLIK", ects:1 }) : null;
  if (YONETIM_ORGANIZASYON_YL_SPECIALIZATION_CODES.has(course.code)) return course.code === "YON801" ? withAdvisor({ ...course, code:"YON8XX", name:"UZMANLIK ALAN DERSİ", ects:5 }) : null;
  if (YONETIM_ORGANIZASYON_YL_SEMINAR_CODES.has(course.code)) return course.code === "YON805" ? withAdvisor({ ...course, code:"YON805", name:"SEMİNER", ects:6 }) : null;
  if (YONETIM_ORGANIZASYON_YL_THESIS_CODES.has(course.code)) return course.code === "YON807" ? withAdvisor({ ...course, code:"YON81X", name:"TEZ ÇALIŞMASI", ects:24 }) : null;
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
  const biyolojiDoktoraCourse = normalizeBiyolojiDoktoraCourse(course);
  if (!biyolojiDoktoraCourse) return [];
  course = biyolojiDoktoraCourse;
  const enerjiDoktoraCourse = normalizeEnerjiDoktoraCourse(course);
  if (!enerjiDoktoraCourse) return [];
  course = enerjiDoktoraCourse;
  const fizikDoktoraCourse = normalizeFizikDoktoraCourse(course);
  if (!fizikDoktoraCourse) return [];
  course = fizikDoktoraCourse;
  const gidaMuhendisligiDoktoraCourse = normalizeGidaMuhendisligiDoktoraCourse(course);
  if (!gidaMuhendisligiDoktoraCourse) return [];
  course = gidaMuhendisligiDoktoraCourse;
  const insaatMuhendisligiDoktoraCourse = normalizeInsaatMuhendisligiDoktoraCourse(course);
  if (!insaatMuhendisligiDoktoraCourse) return [];
  course = insaatMuhendisligiDoktoraCourse;
  const isletmeDoktoraCourse = normalizeIsletmeDoktoraCourse(course);
  if (!isletmeDoktoraCourse) return [];
  course = isletmeDoktoraCourse;
  const kimyaDoktoraCourse = normalizeKimyaDoktoraCourse(course);
  if (!kimyaDoktoraCourse) return [];
  course = kimyaDoktoraCourse;
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
  const fizikCourse = normalizeFizikTezliCourse(course);
  if (!fizikCourse) return [];
  course = fizikCourse;
  const gastronomiCourse = normalizeGastronomiTezliCourse(course);
  if (!gastronomiCourse) return [];
  course = gastronomiCourse;
  const gidaMuhendisligiCourse = normalizeGidaMuhendisligiTezliCourse(course);
  if (!gidaMuhendisligiCourse) return [];
  course = gidaMuhendisligiCourse;
  const gidaTeknolojisiCourse = normalizeGidaTeknolojisiTezliCourse(course);
  if (!gidaTeknolojisiCourse) return [];
  course = gidaTeknolojisiCourse;
  const haritaCourse = normalizeHaritaTezliCourse(course);
  if (!haritaCourse) return [];
  course = haritaCourse;
  const icHastaliklariCourse = normalizeIcHastaliklariTezliCourse(course);
  if (!icHastaliklariCourse) return [];
  course = icHastaliklariCourse;
  const iktisatCourse = normalizeIktisatTezliCourse(course);
  if (!iktisatCourse) return [];
  course = iktisatCourse;
  const insaatCourse = normalizeInsaatTezliCourse(course);
  if (!insaatCourse) return [];
  course = insaatCourse;
  const isletmeCourse = normalizeIsletmeTezliCourse(course);
  if (!isletmeCourse) return [];
  course = isletmeCourse;
  const kimyaCourse = normalizeKimyaTezliCourse(course);
  if (!kimyaCourse) return [];
  course = kimyaCourse;
  const matematikCourse = normalizeMatematikTezliCourse(course);
  if (!matematikCourse) return [];
  course = matematikCourse;
  const muhasebeFinansmanCourse = normalizeMuhasebeFinansmanTezliCourse(course);
  if (!muhasebeFinansmanCourse) return [];
  course = muhasebeFinansmanCourse;
  const organikTarimCourse = normalizeOrganikTarimTezliCourse(course);
  if (!organikTarimCourse) return [];
  course = organikTarimCourse;
  const resimCourse = normalizeResimTezliCourse(course);
  if (!resimCourse) return [];
  course = resimCourse;
  const siyasetKamuCourse = normalizeSiyasetKamuYonetimiTezliCourse(course);
  if (!siyasetKamuCourse) return [];
  course = siyasetKamuCourse;
  const tarihCourse = normalizeTarihTezliCourse(course);
  if (!tarihCourse) return [];
  course = tarihCourse;
  const temelIslamCourse = normalizeTemelIslamTezliCourse(course);
  if (!temelIslamCourse) return [];
  course = temelIslamCourse;
  const turkDiliEdebiyatiCourse = normalizeTurkDiliEdebiyatiTezliCourse(course);
  if (!turkDiliEdebiyatiCourse) return [];
  course = turkDiliEdebiyatiCourse;
  const ybsTezliCourse = normalizeYbsTezliCourse(course);
  if (!ybsTezliCourse) return [];
  course = ybsTezliCourse;
  const yonetimOrganizasyonCourse = normalizeYonetimOrganizasyonTezliCourse(course);
  if (!yonetimOrganizasyonCourse) return [];
  course = yonetimOrganizasyonCourse;
  const isYbsDoctorate =
    course.level === "Doktora" &&
    (course.code.startsWith("YBS") ||
      (course.code === "DAN902" &&
        (course.programName.includes("Yönetim Bilişim") ||
          course.programName.includes("YÃ¶netim BiliÅŸim"))));
  if (!isYbsDoctorate) return [{ ...course, instructor: sanitizeInstructorName(course.instructor || "") }];
  const normalized = normalizeYbsDoctorateCourse(course);
  return normalized ? [{ ...normalized, instructor: sanitizeInstructorName(normalized.instructor || "") }] : [];
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

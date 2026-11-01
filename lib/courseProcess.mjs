// Fallback for records that predate the persisted course group.
const legacyProcessCourseCodes = new Set([
  "YBS9XX", "YBS91X", "DAN902", "YBS910", "YBS917", "SKY9XX", "SKY909", "SKY917", "SKY91X",
  "DAN8XX", "ADE7XX", "ADE8XX", "ADE806", "ADE81X", "TDE9XX", "TDE910", "TDE917", "TDE91X",
  "ARK8XX", "ARK806", "ARK81X",
  "MMB8XX", "MMB806", "MMB81X",
  "BHT8XX", "BHT806", "BHT831", "BHT81X",
  "BES8XX", "BES806", "BEF801", "BES81X",
  "BES7XX", "BEF7XX", "BİO7XX", "İKT7XX", "EPY7XX", "GMS7XX", "GTB7XX", "ISL7XX", "MUF7XX", "MTY7XX", "OTİ7XX", "RES7XX", "SKY7XX", "TTS7XX", "TDE7XX", "YBS7XX", "YON7XX",
  "BİO8XX", "BİO806", "BİO809", "BİO81X", "DAN9XX", "BİO9XX", "BİO909", "BİO917", "BİO91X", "EMB9XX", "EMB909", "EMB917", "EMB91X", "FZK9XX", "FZK909", "FZK917", "FZK91X", "GMB9XX", "GMB909", "GMB917", "GMB91X", "İNŞ9XX", "İNŞ909", "İNŞ917", "İNŞ91X", "ISL9XX", "ISL909", "ISL917", "ISL91X", "KİM9XX", "KİM909", "KİM917", "KİM91X", "MMB9XX", "MMB909", "MMB917", "MMB91X",
  "EBE8XX", "EBE806", "EBE809", "EBE81X",
  "ETR8XX", "ETR806", "ETR855", "ETR81X",
  "EEM8XX", "EEM806", "EEM885", "EEM81X",
  "EMB8XX", "EMB806", "EMB829", "EMB81X",
  "FDB8XX", "FDB806", "FDB81X",
  "FZK8XX", "FZK806", "FZK899", "FZK81X",
  "GMS8XX", "GMS806", "GMS85X", "GMS81X",
  "GMB8XX", "GMB806", "GMB85X", "GMB81X",
  "GTB8XX", "GTB806", "GTB82X", "GTB81X",
  "HRM8XX", "HRM806", "HRM809", "HRM81X",
  "İHH8XX", "İHH806", "İHH809", "İHH81X",
  "İKT8XX", "İKT806", "İKT897", "İKT81X",
  "İNŞ8XX", "İNŞ806", "İNŞ897", "İNŞ81X",
  "ISL8XX", "ISL806", "ISL885", "ISL81X",
  "KİM8XX", "KİM806", "KİM839", "KİM81X",
  "MAT8XX", "MAT805", "MAT863", "MAT81X",
  "MUF8XX", "MUF805", "MUF849", "MUF81X",
  "OTİ8XX", "OTİ805", "OTİ841", "OTİ81X",
  "RES8XX", "RES805", "RES881", "RES81X",
  "SKY8XX", "SKY805", "SKY899", "SKY81X",
  "TTZ8XX", "TTZ805", "BES801", "TTZ81X",
  "TİB8XX", "TİB805", "TİB879", "TİB81X",
  "TDE8XX", "TDE805", "BES801", "TDE81X",
  "YBS8XX", "YBS805", "YBS81X",
  "YON8XX", "YON805", "YON841", "YON81X",
]);

/** @param {{ code?: string, department?: string, isProcessCourse?: boolean | null }} [course] */
export function isProcessCourse(course = {}) {
  // An explicit false must win over the legacy list.
  if (typeof course.isProcessCourse === "boolean") return course.isProcessCourse;
  if (course.code === "BES801") {
    return ["Tarih ABD", "Türk Dili ve Edebiyatı ABD"].includes(course.department || "");
  }
  return legacyProcessCourseCodes.has(course.code || "");
}

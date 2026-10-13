const normalizeCourseName = (name: string) =>
  name
    .toLocaleUpperCase("tr-TR")
    .replaceAll("Ã‡", "Ç")
    .replaceAll("Ä°", "İ")
    .replaceAll("ÄŸ", "ğ")
    .replaceAll("Åž", "Ş");

export const isDepartmentPoolCourse = (course: Pick<{ name: string; code: string }, "name" | "code">) => {
  const name = normalizeCourseName(course.name);
  if (["BES7XX", "BEF7XX", "BİO7XX", "İKT7XX", "EPY7XX", "GMS7XX", "GTB7XX"].includes(course.code)) return true;
  if (course.code === "BHT831") return true;
  if (course.code === "BEF801" && normalizeCourseName(course.name).includes("BİLİMSEL ARAŞTIRMA")) return true;
  if (course.code === "BİO809" && normalizeCourseName(course.name).includes("BİLİMSEL ARAŞTIRMA")) return true;
  if (name.includes("BİLİMSEL ARAŞTIRMA")) return false;
  return /^(?:DANIŞMANLIK|UZMANLIK ALAN DERSİ|(?:YÜKSEK LİSANS |DOKTORA )?SEMİNER|BİTİRME PROJESİ|DOKTORA YETERLİK|DOKTORA TEZİ|TEZ ÇALIŞMASI)$/u.test(name);
};

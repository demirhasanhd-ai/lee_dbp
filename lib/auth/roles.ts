export const DBP_ROLES = {
  akademisyen: {
    label: "Akademisyen",
    description: "Yetkili oldugu derslerin Bologna bilgilerini hazirlar ve onaya gonderir.",
    permissions: ["course.read.assigned", "course.edit.assigned", "course.submit.assigned"],
  },
  abd_asd_baskani: {
    label: "ABD / ASD Baskani",
    description: "Anabilim veya anasanat dalindaki dersleri inceler ve program onayi verir.",
    permissions: ["course.read.department", "course.review.department", "course.approve.department"],
  },
  abd_sekreteri: {
    label: "ABD / ASD Sekreteri",
    description: "ABD / ASD kapsamindaki DBP kayitlarini goruntuler ve surece destek verir.",
    permissions: ["course.read.department", "program.read.department", "workflow.support"],
  },
  lee_ogrenci_isleri: {
    label: "LEE Ogrenci Isleri",
    description: "Ders, program ve gorevlendirme kayitlarinin idari kontrolunu yurutur.",
    permissions: ["course.read.all", "program.read.all", "assignment.manage"],
  },
  enstitu_sekreteri: {
    label: "Enstitu Sekreteri",
    description: "Enstitu genelindeki idari isleyisi ve yayin hazirligini denetler.",
    permissions: ["course.read.all", "workflow.monitor", "report.read"],
  },
  enstitu_yoneticisi: {
    label: "Enstitu Yoneticisi",
    description: "Onayli ders bilgi paketlerini yayimlar ve kalite surecini yonetir.",
    permissions: ["course.read.all", "course.approve.all", "course.publish", "report.read"],
  },
  admin: {
    label: "Admin",
    description: "Kullanici, rol, entegrasyon ve sistem ayarlarini yonetir.",
    permissions: ["system.admin"],
  },
} as const;

export type DbpRole = keyof typeof DBP_ROLES;
export const DBP_ROLE_KEYS = Object.keys(DBP_ROLES) as DbpRole[];

export const DEMO_USERS: Array<{
  id: string;
  name: string;
  username: string;
  password: string;
  role: DbpRole;
  department?: string;
}> = [
  { id: "demo-akademisyen", name: "Dr. Ogr. Uyesi Ayse Yilmaz", username: "demo.akademisyen", password: "1453", role: "akademisyen", department: "Bilgisayar Muhendisligi" },
  { id: "demo-abd", name: "Prof. Dr. Mehmet Kaya", username: "demo.abd.baskani", password: "1453", role: "abd_asd_baskani", department: "Isletme ABD" },
  { id: "demo-abd-sekreteri", name: "ABD Sekreteri Demo", username: "demo.abd.sekreteri", password: "1453", role: "abd_sekreteri", department: "Isletme ABD" },
  { id: "demo-ogrenci-isleri", name: "LEE Ogrenci Isleri", username: "demo.ogrenci.isleri", password: "1453", role: "lee_ogrenci_isleri" },
  { id: "demo-sekreter", name: "Enstitu Sekreteri", username: "demo.enstitu.sekreteri", password: "1453", role: "enstitu_sekreteri" },
  { id: "demo-yonetici", name: "Enstitu Yoneticisi", username: "demo.enstitu.yoneticisi", password: "1453", role: "enstitu_yoneticisi" },
  { id: "demo-admin", name: "Sistem Yoneticisi", username: "demo.admin", password: "1453", role: "admin" },
];

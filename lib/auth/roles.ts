export const DBP_ROLES = {
  akademisyen: {
    label: "Akademisyen",
    description: "Yetkili olduğu derslerin Bologna bilgilerini hazırlar ve onaya gönderir.",
    permissions: ["course.read.assigned", "course.edit.assigned", "course.submit.assigned"],
  },
  abd_asd_baskani: {
    label: "ABD / ASD Başkanı",
    description: "Anabilim veya anasanat dalındaki dersleri inceler ve program onayı verir.",
    permissions: ["course.read.department", "course.review.department", "course.approve.department"],
  },
  lee_ogrenci_isleri: {
    label: "LEE Öğrenci İşleri",
    description: "Ders, program ve görevlendirme kayıtlarının idari kontrolünü yürütür.",
    permissions: ["course.read.all", "program.read.all", "assignment.manage"],
  },
  enstitu_sekreteri: {
    label: "Enstitü Sekreteri",
    description: "Enstitü genelindeki idari işleyişi ve yayın hazırlığını denetler.",
    permissions: ["course.read.all", "workflow.monitor", "report.read"],
  },
  enstitu_yoneticisi: {
    label: "Enstitü Yöneticisi",
    description: "Onaylı ders bilgi paketlerini yayımlar ve kalite sürecini yönetir.",
    permissions: ["course.read.all", "course.approve.all", "course.publish", "report.read"],
  },
  admin: {
    label: "Admin",
    description: "Kullanıcı, rol, entegrasyon ve sistem ayarlarını yönetir.",
    permissions: ["system.admin"],
  },
} as const;

export type DbpRole = keyof typeof DBP_ROLES;
export const DBP_ROLE_KEYS = Object.keys(DBP_ROLES) as DbpRole[];

export const DEMO_USERS: Array<{ id: string; name: string; username: string; password: string; role: DbpRole; department?: string }> = [
  { id: "demo-akademisyen", name: "Dr. Öğr. Üyesi Ayşe Yılmaz", username: "demo.akademisyen", password: "1453", role: "akademisyen", department: "Bilgisayar Mühendisliği" },
  { id: "demo-abd", name: "Prof. Dr. Mehmet Kaya", username: "demo.abd.baskani", password: "1453", role: "abd_asd_baskani", department: "İşletme ABD" },
  { id: "demo-ogrenci-isleri", name: "LEE Öğrenci İşleri", username: "demo.ogrenci.isleri", password: "1453", role: "lee_ogrenci_isleri" },
  { id: "demo-sekreter", name: "Enstitü Sekreteri", username: "demo.enstitu.sekreteri", password: "1453", role: "enstitu_sekreteri" },
  { id: "demo-yonetici", name: "Enstitü Yöneticisi", username: "demo.enstitu.yoneticisi", password: "1453", role: "enstitu_yoneticisi" },
  { id: "demo-admin", name: "Sistem Yöneticisi", username: "demo.admin", password: "1453", role: "admin" },
];

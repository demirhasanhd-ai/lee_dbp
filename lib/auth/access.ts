import type { DbpRole } from "./roles";
export const DBP_MODULES={my_courses:"Ders Bilgi Paketlerim",program_profile:"Program Bilgileri",review_queue:"Kontrol ve Düzeltme",publish_control:"Yayın Kontrolü",user_roles:"Kullanıcı ve Rol Yönetimi",permission_matrix:"Yetki Dağılımı"} as const;
export type DbpModule=keyof typeof DBP_MODULES;
export const DEFAULT_ROLE_ACCESS:Record<DbpRole,DbpModule[]>={akademisyen:["my_courses"],abd_asd_baskani:["program_profile","review_queue"],lee_ogrenci_isleri:["my_courses","program_profile"],enstitu_sekreteri:["my_courses","program_profile","publish_control"],enstitu_yoneticisi:["my_courses","program_profile","publish_control"],admin:["my_courses","program_profile","publish_control","user_roles","permission_matrix"]};

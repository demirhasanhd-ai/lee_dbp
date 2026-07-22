"use client";

import { useEffect, useMemo, useState } from "react";
import { FileText, Printer } from "lucide-react";
import { readProgramVisibility } from "../../../lib/data/publicVisibility";
import { PublicProgramSidebar } from "../../PublicProgramSidebar";

export type PublicCourse = {
  code: string;
  name: string;
  level: string;
  term: "Güz" | "Bahar";
  type: "Zorunlu" | "Seçmeli";
  theory: number;
  practice: number;
  ects: number;
  credit?: number;
  instructor?: string;
  programCode?: string;
};

type Props = {
  visibilityKey: string;
  department: string;
  programName: string;
  levels: string[];
  courses: PublicCourse[];
  programItems?: PublicProgramMenuItem[];
};
type PublicProgramMenuItem = {
  visibilityKey: string;
  programName: string;
  levels: string[];
  courses: PublicCourse[];
};
type ViewState = { programKey: string; level: string; tab: "profile" | "courses" };

const columns = ["12%", "36%", "14%", "5%", "5%", "6%", "12%", "10%"];
const outcomes = [
  "Alanındaki ileri düzey bilgileri bilimsel araştırma süreçlerinde kullanır.",
  "Disiplinler arası yaklaşımla problem tanımlar ve çözüm önerileri geliştirir.",
  "Araştırma sonuçlarını etik ilkeler doğrultusunda değerlendirir ve raporlar.",
  "Alanındaki güncel gelişmeleri izler, yorumlar ve uygulamaya aktarır.",
  "Akademik ve mesleki ortamlarda etkili iletişim kurar.",
  "Yaşam boyu öğrenme yaklaşımıyla mesleki gelişimini sürdürür.",
];

const profileSections = [
  ["Program Tarihçesi", "Program, Osmaniye Korkut Ata Üniversitesi Lisansüstü Eğitim Enstitüsü bünyesinde alanında uzman araştırmacılar yetiştirmek amacıyla yapılandırılmıştır. Eğitim-öğretim, bilimsel araştırma ve toplumsal katkı faaliyetleri enstitü kalite süreçleriyle uyumlu biçimde yürütülür."],
  ["Program Profili", "Program; kuramsal bilgi, araştırma yöntemi, uygulama becerisi ve etik sorumlulukları birlikte ele alan lisansüstü bir akademik yapı sunar. Öğrencilerin alanlarında derinleşmeleri, özgün araştırma yapmaları ve bilimsel üretime katkı sağlamaları hedeflenir."],
  ["Ders Yapısı ve Kredileri", "Programda zorunlu ve seçmeli dersler, seminer/uzmanlık alan dersleri ve ilgili düzeye göre proje ya da tez çalışmaları yer alır. Dersler güz ve bahar yarıyıllarında yürütülür; AKTS yükleri öğrenci iş yükü esas alınarak tanımlanır."],
  ["Mezuniyet Koşulları", "Öğrencinin programda tanımlı dersleri, AKTS yükünü, seminer/proje/tez yükümlülüklerini ve enstitü yönetmeliğinde belirtilen başarı koşullarını tamamlaması gerekir."],
  ["Ölçme ve Değerlendirme", "Her ders için ölçme ve değerlendirme yöntemleri ders bilgi paketinde belirtilir. Ara sınav, yarıyıl sonu sınavı, ödev, proje, sunum ve uygulama çalışmaları ilgili öğretim elemanı tarafından tanımlanır."],
  ["Üst Derece Programlarına Geçiş", "Programı başarıyla tamamlayan mezunlar, ilgili mevzuat ve başvuru koşullarını sağlamaları halinde üst derece programlara başvurabilir."],
  ["Önceki Öğrenmenin Tanınması", "Muafiyet, intibak ve önceki öğrenmenin tanınmasına ilişkin işlemler enstitü mevzuatı, ilgili kurul kararları ve akademik birim değerlendirmeleri doğrultusunda yürütülür."],
  ["Mezunların Mesleki Profilleri", "Mezunlar; akademi, kamu kurumları, özel sektör, araştırma merkezleri ve alanlarıyla ilişkili uzmanlık gerektiren görevlerde çalışabilir."],
  ["Kabul ve Kayıt Koşulları", "Programa kabul; diploma, ALES, yabancı dil, bilim sınavı veya mülakat gibi enstitü tarafından ilan edilen koşullar çerçevesinde yapılır. Kesin kayıt işlemleri ilgili mevzuata göre tamamlanır."],
] as const;

const repairText = (value: string) =>
  value
    .replaceAll("Ä°", "İ")
    .replaceAll("Ä±", "ı")
    .replaceAll("ÅŸ", "ş")
    .replaceAll("Åž", "Ş")
    .replaceAll("ÄŸ", "ğ")
    .replaceAll("Äž", "Ğ")
    .replaceAll("Å", "Ş")
    .replaceAll("Å", "ş")
    .replaceAll("Ä", "Ğ")
    .replaceAll("Ä", "ğ")
    .replaceAll("Ã¼", "ü")
    .replaceAll("Ãœ", "Ü")
    .replaceAll("Ã", "Ü")
    .replaceAll("Ã¶", "ö")
    .replaceAll("Ã–", "Ö")
    .replaceAll("Ã", "Ö")
    .replaceAll("Ã§", "ç")
    .replaceAll("Ã‡", "Ç")
    .replaceAll("Ã", "Ç");

function ProgramProfile({ department, programName, activeLevel }: { department: string; programName: string; activeLevel: string }) {
  const isDoctorate = activeLevel === "Doktora";
  return (
    <section className="public-program-profile" aria-label="Program genel bilgileri">
      <div className="public-profile-title">
        <small>LİSANSÜSTÜ EĞİTİM ENSTİTÜSÜ</small>
        <h2>{programName}</h2>
        <p>{department} programına ait kamuya açık Bologna program bilgileri.</p>
      </div>
      <div className="public-profile-summary">
        <div><span>Program Düzeyi</span><b>{activeLevel}</b></div>
        <div><span>Kazanılan Derece</span><b>{programName} {isDoctorate ? "Doktora" : "Yüksek Lisans"} Derecesi</b></div>
        <div><span>Program Yöneticisi</span><b>Prof. Dr. Program Yöneticisi</b></div>
        <div><span>Öğrenim Dili</span><b>Türkçe</b></div>
        <div className="wide"><span>Yeterlilik Koşulları ve Kuralları</span><b>{isDoctorate ? "4 yıl, 8 yarıyıl ve ilgili doktora yeterlilik/tez süreçleri" : "2 yıl, 4 yarıyıl ve toplam 120 AKTS"}</b></div>
      </div>
      <div className="public-profile-grid">
        {profileSections.slice(0, 2).map(([title, text]) => <article className="wide" key={title}><h3>{title}</h3><p>{text}</p></article>)}
      </div>
      <article className="public-profile-card">
        <div className="profile-card-heading"><h3>Program Çıktıları / Öğrenme Kazanımları</h3><span>{outcomes.length} çıktı</span></div>
        <ol className="public-outcomes">{outcomes.map((outcome, index) => <li key={outcome}><b>PÇ{index + 1}</b><span>{outcome}</span></li>)}</ol>
      </article>
      <div className="public-profile-grid">
        {profileSections.slice(8, 9).map(([title, text]) => <article className="wide" key={title}><h3>{title}</h3><p>{text}</p></article>)}
        {profileSections.slice(2, 8).map(([title, text]) => <article key={title}><h3>{title}</h3><p>{text}</p></article>)}
      </div>
    </section>
  );
}

export function ProgramCourses({ visibilityKey, department, programName, levels, courses, programItems }: Props) {
  const allProgramItems = useMemo(
    () => (programItems?.length ? programItems : [{ visibilityKey, programName, levels, courses }]),
    [courses, levels, programItems, programName, visibilityKey],
  );
  const [activeView, setActiveView] = useState<ViewState>({ programKey: visibilityKey, level: levels[0], tab: "profile" });
  const [visibleLevelsByProgram, setVisibleLevelsByProgram] = useState<Record<string, string[]>>(
    Object.fromEntries(allProgramItems.map((item) => [item.visibilityKey, item.levels])),
  );
  const activeProgram = allProgramItems.find((item) => item.visibilityKey === activeView.programKey) ?? allProgramItems[0];
  const levelVisibilityKey = (itemKey: string, level: string) => `${itemKey}__${level.toLocaleLowerCase("tr-TR").replace(/\s+/g, "-")}`;
  useEffect(() => {
    const sync = () => {
      const visibility = readProgramVisibility();
      const nextByProgram = Object.fromEntries(allProgramItems.map((item) => [
        item.visibilityKey,
        item.levels.filter((level) => {
          const key = levelVisibilityKey(item.visibilityKey, level);
          return key in visibility ? visibility[key] !== false : visibility[item.visibilityKey] !== false;
        }),
      ]));
      setVisibleLevelsByProgram(nextByProgram);
      const currentLevels = nextByProgram[activeView.programKey] ?? [];
      if (!currentLevels.some((level) => level === activeView.level)) {
        const fallbackProgram = allProgramItems.find((item) => (nextByProgram[item.visibilityKey] ?? [])[0]);
        if (fallbackProgram) {
          setActiveView((current) => ({ ...current, programKey: fallbackProgram.visibilityKey, level: nextByProgram[fallbackProgram.visibilityKey][0] }));
        }
      }
    };
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("lee-dbp-public-visibility-change", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("lee-dbp-public-visibility-change", sync);
    };
  }, [activeView.level, activeView.programKey, allProgramItems]);
  const activeLevel = activeView.level;
  const activeVisibleLevels = visibleLevelsByProgram[activeProgram.visibilityKey] ?? [];
  const visible = activeProgram.courses.filter((course) => course.level === activeLevel);
  const sidebarItems = allProgramItems.flatMap((item) =>
    (visibleLevelsByProgram[item.visibilityKey] ?? []).map((level) => ({
      level,
      label: level
        .replace("Tezsiz Yüksek Lisans", "Tezsiz YL")
        .replace("Tezli Yüksek Lisans", "Tezli YL")
        .replace("Tezsiz YÃ¼ksek Lisans", "Tezsiz YL")
        .replace("Tezli YÃ¼ksek Lisans", "Tezli YL"),
      caption: allProgramItems.length > 1 ? repairText(item.programName) : undefined,
      programKey: item.visibilityKey,
    })),
  );
  const packageUrl = (course: PublicCourse) => {
    const query = new URLSearchParams({
      ders: course.code,
      ad: repairText(course.name),
      bolum: department,
      program: activeProgram.programName,
      duzey: course.level,
      tur: repairText(course.type),
      t: String(course.theory),
      u: String(course.practice),
      kredi: String(course.credit ?? course.theory + course.practice),
      akts: String(course.ects),
    });
    if (course.programCode) query.set("programKodu", course.programCode);
    if (course.instructor) query.set("ogretimElemani", course.instructor);
    return `/katalog?${query.toString()}`;
  };
  const slugify = (value: string) =>
    repairText(value).toLocaleLowerCase("tr-TR")
      .replace(/[çÇ]/g, "c").replace(/[ğĞ]/g, "g").replace(/[ıİ]/g, "i")
      .replace(/[öÖ]/g, "o").replace(/[şŞ]/g, "s").replace(/[üÜ]/g, "u")
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "ders";
  const pdfUrl = (course: PublicCourse) =>
    `/pdf/dbp/${slugify(course.code)}-${slugify(activeProgram.programName)}-${slugify(course.name)}.pdf`;

  if (!sidebarItems.length) {
    return (
      <div className="public-program-layout">
        <section className="public-program-main">
          <div className="public-hidden-notice">
            <small>PUBLIC YAYIN KONTROLÜ</small>
            <h2>{programName} şu anda kamuya açık yayında değil</h2>
            <p>Bu program, Enstitü Sekreteri / Enstitü Yöneticisi / Admin tarafından public katalogdan gizlenmiştir.</p>
            <a href="/#programlar">Programlara dön</a>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="public-program-layout">
      <section className="public-program-main">
        {activeView.tab === "profile" ? (
          <ProgramProfile department={department} programName={activeProgram.programName} activeLevel={activeLevel}/>
        ) : (
          <>
            <div className="public-course-title">
              <div><small>2026-2027 AKADEMİK YILI</small><h2>{activeLevel} Dersleri</h2></div>
            </div>
            {(["Güz", "Bahar"] as const).map((term) => (
              <section className="public-course-group" key={term}>
                <h3>{term} Yarıyılı</h3>
                <div className="course-table-wrap">
                  <table className="public-course-table">
                    <colgroup>{columns.map((width, index) => <col style={{ width }} key={index} />)}</colgroup>
                    <thead><tr><th>Dersin Kodu</th><th>Dersin Adı</th><th>Zorunlu / Seçmeli</th><th>T</th><th>U</th><th>AKTS</th><th>Bilgi Paketi</th><th>Yazdır</th></tr></thead>
                    <tbody>
                      {visible.filter((course) => repairText(course.term) === repairText(term)).map((course) => (
                        <tr key={course.code}>
                          <td><b>{course.code}</b></td><td>{repairText(course.name)}</td>
                          <td><span className={`course-type ${repairText(course.type) === "Zorunlu" ? "required" : "elective"}`}>{repairText(course.type)}</span></td>
                          <td>{course.theory}</td><td>{course.practice}</td><td><b>{course.ects}</b></td>
                          <td><a className="table-action primary" href={packageUrl(course)}><FileText size={15}/><span>Görüntüle</span></a></td>
                          <td><a className="table-action" href={pdfUrl(course)} target="_blank" rel="noreferrer" aria-label={`${course.code} ders bilgi paketini PDF olarak aç`}><Printer size={15}/><span>Yazdır</span></a></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            ))}
          </>
        )}
      </section>
      <PublicProgramSidebar
        department={department}
        levels={activeVisibleLevels}
        activeLevel={activeLevel}
        activeProgramKey={activeProgram.visibilityKey}
        items={sidebarItems}
        view={activeView}
        programHref={`/programlar/${visibilityKey}`}
        onViewChange={(next) => setActiveView({ programKey: next.programKey ?? activeProgram.visibilityKey, level: next.level, tab: next.tab })}
      />
    </div>
  );
}

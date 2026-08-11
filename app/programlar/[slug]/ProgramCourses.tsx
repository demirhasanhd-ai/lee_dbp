"use client";

import { useEffect, useMemo, useState } from "react";
import { FileText, Printer } from "lucide-react";
import {
  fetchProgramVisibility,
  isProgramVisibilityKeyPublic,
  programLevelVisibilityKeyFromKey,
  readProgramVisibility,
} from "../../../lib/data/publicVisibility";
import { PublicProgramSidebar } from "../../PublicProgramSidebar";
import { dbpPath } from "../../../lib/dbpPath";
import { coursePdfHref } from "../../../lib/coursePdf";
import { DEFAULT_COURSE_SDG_IDS } from "../../../lib/sdgGoals";
import { fetchProgramProfile, getProgramProfile } from "../../../lib/data/programProfiles";
import type { ProgramTyycRow } from "../../../lib/data/programProfiles";

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
const defaultOutcomes = [
  "Alanındaki ileri düzey bilgileri bilimsel araştırma süreçlerinde kullanır.",
  "Disiplinler arası yaklaşımla problem tanımlar ve çözüm önerileri geliştirir.",
  "Araştırma sonuçlarını etik ilkeler doğrultusunda değerlendirir ve raporlar.",
  "Alanındaki güncel gelişmeleri izler, yorumlar ve uygulamaya aktarır.",
  "Akademik ve mesleki ortamlarda etkili iletişim kurar.",
  "Yaşam boyu öğrenme yaklaşımıyla mesleki gelişimini sürdürür.",
];

const defaultProfileSections = [
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

const renderInlineProfileText = (text: string) =>
  text.split("**").map((part, index) =>
    index % 2 === 1 ? <strong key={`${part}-${index}`}>{part}</strong> : part,
  );

function ProfileText({ text }: { text: string }) {
  const blocks = text.trim().split(/\n\s*\n/);
  if (blocks.length === 1 && !text.includes("**")) return <p>{text}</p>;

  return (
    <div className="public-profile-copy">
      {blocks.map((block, blockIndex) => {
        const lines = block.split("\n").filter(Boolean);
        if (lines.every((line) => line.startsWith("* "))) {
          return (
            <ul key={`list-${blockIndex}`}>
              {lines.map((line, lineIndex) => (
                <li key={`${line}-${lineIndex}`}>{renderInlineProfileText(line.slice(2))}</li>
              ))}
            </ul>
          );
        }
        return <p key={`paragraph-${blockIndex}`}>{renderInlineProfileText(block)}</p>;
      })}
    </div>
  );
}

function PublicTyycMatrix({ rows, outcomeCount, level }: { rows: ProgramTyycRow[]; outcomeCount: number; level: string }) {
  if (!rows.length) return null;
  return (
    <article className="public-profile-card public-tyyc-card">
      <div className="profile-card-heading">
        <h3>PÇ–TYYÇ İlişki Matrisi</h3>
        <span>0 Yok · 1 Düşük · 2 Orta · 3 Güçlü</span>
      </div>
      <div className="public-tyyc-scroll">
        <table className="public-tyyc-table">
          <thead><tr><th>TYYÇ {level === "Doktora" ? 8 : 7}. Düzey Yeterlilikleri</th>{Array.from({ length: outcomeCount }, (_, index) => <th key={index}>PÇ{index + 1}</th>)}</tr></thead>
          <tbody>{rows.map((row) => <tr key={row.code}><th><b>{row.code}</b><span>{row.title}</span></th>{row.values.slice(0, outcomeCount).map((value, index) => <td data-level={value} key={index}>{value}</td>)}</tr>)}</tbody>
        </table>
      </div>
    </article>
  );
}

function ProgramProfile({ department, programName, activeLevel }: { department: string; programName: string; activeLevel: string }) {
  const isDoctorate = activeLevel === "Doktora";
  const repairedProgramName = repairText(programName);
  const repairedLevel = repairText(activeLevel);
  const [profile, setProfile] = useState(() => getProgramProfile(repairedProgramName, repairedLevel));
  useEffect(() => {
    let cancelled = false;
    setProfile(getProgramProfile(repairedProgramName, repairedLevel));
    fetchProgramProfile(repairedProgramName, repairedLevel).then((nextProfile) => {
      if (!cancelled) setProfile(nextProfile);
    });
    return () => {
      cancelled = true;
    };
  }, [repairedProgramName, repairedLevel]);
  const outcomes = profile?.outcomes ?? defaultOutcomes;
  const profileSections = profile?.sections ?? defaultProfileSections.map(([title, text]) => ({ title, text }));
  return (
    <section className="public-program-profile" aria-label="Program genel bilgileri">
      <div className="public-profile-title">
        <small>LİSANSÜSTÜ EĞİTİM ENSTİTÜSÜ</small>
        <h2>{programName}</h2>
        <p>{department} programına ait kamuya açık Bologna program bilgileri.</p>
      </div>
      <div className="public-profile-summary">
        <div><span>Program Düzeyi</span><b>{activeLevel}</b></div>
        <div><span>Kazanılan Derece</span><b>{profile?.degree ?? `${programName} ${isDoctorate ? "Doktora" : "Yüksek Lisans"} Derecesi`}</b></div>
        <div><span>Program Yöneticisi</span><b>{profile?.manager || "—"}</b></div>
        <div><span>Öğrenim Dili</span><b>{profile?.language ?? "Türkçe"}</b></div>
        <div className="wide qualification"><span>Yeterlilik Koşulları ve Kuralları</span><p>{profile?.qualificationRules ?? (isDoctorate ? "4 yıl, 8 yarıyıl ve ilgili doktora yeterlilik/tez süreçleri" : "2 yıl, 4 yarıyıl ve toplam 120 AKTS")}</p></div>
      </div>
      <div className="public-profile-grid">
        {profileSections.slice(0, 2).map(({ title, text }) => <article className="wide" key={title}><h3>{title}</h3><ProfileText text={text}/></article>)}
      </div>
      <article className="public-profile-card">
        <div className="profile-card-heading"><h3>Program Çıktıları / Öğrenme Kazanımları</h3><span>{outcomes.length} çıktı</span></div>
        <ol className="public-outcomes">{outcomes.map((outcome, index) => <li key={outcome}><b>PÇ{index + 1}</b><span>{outcome}</span></li>)}</ol>
      </article>
      <PublicTyycMatrix rows={profile?.tyycRows ?? []} outcomeCount={outcomes.length} level={activeLevel}/>
      <div className="public-profile-grid">
        {profileSections.slice(8, 9).map(({ title, text }) => <article className="wide" key={title}><h3>{title}</h3><ProfileText text={text}/></article>)}
        {profileSections.slice(2, 8).map(({ title, text }) => <article key={title}><h3>{title}</h3><ProfileText text={text}/></article>)}
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
  const visibleLevelsForItems = (visibility: Record<string, boolean>) =>
    Object.fromEntries(allProgramItems.map((item) => [
      item.visibilityKey,
      item.levels.filter((level) => {
        const key = programLevelVisibilityKeyFromKey(item.visibilityKey, level);
        return key in visibility ? visibility[key] !== false : isProgramVisibilityKeyPublic(item.visibilityKey, visibility);
      }),
    ]));
  const [visibleLevelsByProgram, setVisibleLevelsByProgram] = useState<Record<string, string[]>>(
    () => visibleLevelsForItems({}),
  );
  const activeProgram = allProgramItems.find((item) => item.visibilityKey === activeView.programKey) ?? allProgramItems[0];
  useEffect(() => {
    const sync = () => {
      const visibility = readProgramVisibility();
      const nextByProgram = visibleLevelsForItems(visibility);
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
    fetchProgramVisibility().then((serverVisibility) => {
      const nextByProgram = visibleLevelsForItems({ ...serverVisibility, ...readProgramVisibility() });
      setVisibleLevelsByProgram(nextByProgram);
    });
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
      sdg: DEFAULT_COURSE_SDG_IDS.join(","),
    });
    query.set("pdf", pdfUrl(course));
    if (course.programCode) query.set("programKodu", course.programCode);
    if (course.instructor) query.set("ogretimElemani", course.instructor);
    return dbpPath(`/katalog?${query.toString()}`);
  };
  const pdfUrl = (course: PublicCourse) =>
    coursePdfHref({ code: course.code, name: repairText(course.name), program: repairText(activeProgram.programName) }) ?? "#";

  if (!sidebarItems.length) {
    return (
      <div className="public-program-layout">
        <section className="public-program-main">
          <div className="public-hidden-notice">
            <small>PUBLIC YAYIN KONTROLÜ</small>
            <h2>{programName} şu anda kamuya açık yayında değil</h2>
            <p>Bu program, Enstitü Sekreteri / Enstitü Yöneticisi / Admin tarafından public katalogdan gizlenmiştir.</p>
            <a href={dbpPath("/#programlar")}>Programlara dön</a>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="public-program-layout">
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
    </div>
  );
}

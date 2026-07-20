import { PublicSiteHeader } from "../PublicSiteHeader";

type DemoCoursePackageProps = {
  code: string;
  name: string;
  type?: string;
  theory?: string;
  practice?: string;
  credit?: string;
  ects?: string;
  instructor?: string;
};

const outcomes = [
  "Bilimsel araştırma sürecinin temel aşamalarını açıklar.",
  "Uygun araştırma yöntemini seçer ve uygular.",
  "Alan yazınını bilimsel ölçütlerle değerlendirir.",
  "Elde edilen verileri analiz ederek yorumlar.",
  "Araştırma sonuçlarını etik ilkelere uygun raporlar.",
];

const weeks = [
  "Bilim ve bilimsel araştırmanın temelleri",
  "Araştırma problemi ve problem cümlesi",
  "Literatür taraması ve kaynaklara erişim",
  "Araştırma desenleri",
  "Evren ve örneklem",
  "Veri toplama araçları",
  "Ara sınav ve genel değerlendirme",
  "Nicel veri analizi",
  "Nitel veri analizi",
  "Geçerlik ve güvenirlik",
  "Bilimsel araştırma etiği",
  "Bulguların yorumlanması",
  "Akademik yazım kuralları",
  "Araştırma raporunun hazırlanması",
  "Yarıyıl sonu değerlendirmesi",
];

const genericInstructorCourseTerms = [
  "bilimsel araştırma",
  "seminer",
  "bitirme projesi",
  "tez çalışması",
  "uzmanlık alan",
  "danışmanlık dersi",
  "danışmanlık çalışması",
];

const shouldShowInstructor = (name: string, instructor?: string) => {
  if (!instructor?.trim()) return false;
  const normalized = name.toLocaleLowerCase("tr-TR");
  return !genericInstructorCourseTerms.some((term) => normalized.includes(term));
};

export function DemoCoursePackage({
  code,
  name,
  type = "Seçmeli",
  theory = "3",
  practice = "0",
  credit = "3",
  ects = "6",
  instructor,
}: DemoCoursePackageProps) {
  const showInstructor = shouldShowInstructor(name, instructor);
  return (
    <main className="demo-package-page">
      <PublicSiteHeader />
      <div className="demo-package-shell">
        <div className="package-breadcrumb">
          <a href="/">Ana Sayfa</a><span>/</span><a href="/katalog">Ders Kataloğu</a><span>/</span><b>{code}</b>
        </div>
        <header className="package-title">
          <div><small>2026–2027 DERS BİLGİ PAKETİ</small><h1>{code} — {name}</h1></div>
        </header>
        {showInstructor && (
          <section className="package-instructor-card" aria-label="Dersi veren öğretim elemanı">
            <span>Dersi Veren Öğretim Elemanı</span>
            <strong>{instructor}</strong>
          </section>
        )}
        <section className="package-card">
          <h2>Ders Genel Bilgileri</h2>
          <div className="package-fields">
            <Field label="Dersin Adı" value={name} wide />
            <Field label="Ders Kodu" value={code} />
            <Field label="Öğrenim Dili" value="Türkçe" />
            <Field label="Zorunlu / Seçmeli" value={type} />
            <Field label="Teorik" value={theory} />
            <Field label="Uygulama" value={practice} />
            <Field label="Kredi" value={credit} />
            <Field label="AKTS" value={ects} />
          </div>
        </section>
        <section className="package-card two">
          <TextBlock title="Dersin Amacı" text={`${name} kapsamında öğrencinin bilimsel araştırma, uygulama ve değerlendirme becerilerini geliştirmesi amaçlanır.`} />
          <TextBlock title="Dersin İçeriği" text="Ders alanına ilişkin kuramsal çerçeve, güncel yaklaşımlar, uygulama örnekleri, veri toplama, analiz ve akademik raporlama konuları işlenir." />
        </section>
        <section className="package-card"><h2>Dersin Öğrenme Çıktıları</h2><ol className="outcome-list">{outcomes.map((item, index) => <li key={item}><b>ÖÇ{index + 1}</b><span>{item}</span></li>)}</ol></section>
        <section className="package-card"><h2>Haftalık Ders Planı</h2><div className="week-grid">{weeks.map((week, index) => <div key={week}><b>{index + 1}. Hafta</b><span>{week}</span></div>)}</div></section>
        <section className="package-card two"><TextBlock title="Öğretim Yöntemleri" text="Anlatım, tartışma, örnek olay incelemesi, uygulama, bireysel çalışma ve proje sunumu." /><TextBlock title="Kaynaklar" text="Bilimsel araştırma yöntemleri temel kaynakları, güncel akademik makaleler ve ilgili etik yönergeler." /></section>
        <section className="package-card"><h2>Değerlendirme Sistemi</h2><table className="package-table"><thead><tr><th>Değerlendirme</th><th>Adet</th><th>Katkı</th></tr></thead><tbody><tr><td>Ara Sınav</td><td>1</td><td>%40</td></tr><tr><td>Yarıyıl Sonu Sınavı</td><td>1</td><td>%60</td></tr></tbody></table></section>
        <section className="package-card"><h2>AKTS İş Yükü</h2><table className="package-table"><thead><tr><th>Etkinlik</th><th>Adet</th><th>Süre</th><th>Toplam</th></tr></thead><tbody><tr><td>Ders Süresi</td><td>15</td><td>{theory}</td><td>{15 * Number(theory || 0)}</td></tr><tr><td>Sınıf Dışı Çalışma</td><td>15</td><td>6</td><td>90</td></tr><tr><td>Ara Sınav</td><td>1</td><td>15</td><td>15</td></tr><tr><td>Yarıyıl Sonu Sınavı</td><td>1</td><td>30</td><td>30</td></tr></tbody><tfoot><tr><th colSpan={3}>AKTS</th><th>{ects}</th></tr></tfoot></table></section>
        <section className="package-card"><h2>Sürdürülebilir Kalkınma Amaçları</h2><div className="sdg-list"><span>4 · Nitelikli Eğitim</span><span>9 · Sanayi, Yenilikçilik ve Altyapı</span><span>17 · Amaçlar için Ortaklıklar</span></div></section>
      </div>
    </main>
  );
}

function Field({ label, value, wide }: { label: string; value: string; wide?: boolean }) {
  return <div className={`package-field${wide ? " wide" : ""}`}><span>{label}</span><strong>{value}</strong></div>;
}

function TextBlock({ title, text }: { title: string; text: string }) {
  return <article className="package-text"><h2>{title}</h2><p>{text}</p></article>;
}

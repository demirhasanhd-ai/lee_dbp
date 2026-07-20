"use client";
import { CheckCircle2, Eye, MessageSquareWarning, X } from "lucide-react";
import { useState } from "react";
import type { DbpRole } from "../../lib/auth/roles";
type ReviewCourse = { code: string; name: string; status: string };
export function ReviewQueue({
  courses,
  role,
  onAction,
}: {
  courses: ReviewCourse[];
  role: DbpRole;
  onAction: () => void;
}) {
  const [preview, setPreview] = useState<ReviewCourse | null>(null);
  const [correction, setCorrection] = useState<ReviewCourse | null>(null);
  const [note, setNote] = useState("");
  const canApprove = role === "abd_asd_baskani";
  const approveCourse = (course: ReviewCourse) => { localStorage.setItem("lee-dbp-course-status", "public"); localStorage.setItem("lee-dbp-review-queue", JSON.stringify({ code: course.code, status: "Yayımlandı", public: true })); onAction(); };
  return (
    <section>
      <div className="panel-intro">
        <div>
          <h2>İnceleme kuyruğu</h2>
          <p>
            Ders paketini ön izleyin; gerekiyorsa açıklama yazarak düzeltme
            isteyin.
          </p>
        </div>
        <span>{courses.length} kayıt</span>
      </div>
      <div className="review-table">
        <div className="review-head review-head-v2">
          <span>Kayıt</span>
          <span>Sorumlu</span>
          <span>Durum</span>
          <span>İşlem</span>
        </div>
        {courses.map((course) => (
          <div className="review-row review-row-v2" key={course.code}>
            <span>
              <b>{course.code}</b>
              <small>{course.name}</small>
            </span>
            <span>Dr. Ayşe Yılmaz</span>
            <span className="status-pill">İncelemede</span>
            <span className="review-actions">
              <button onClick={() => setPreview(course)}>
                <Eye size={14} />
                Ön İzleme
              </button>
              <button
                onClick={() => {
                  setCorrection(course);
                  setNote("");
                }}
              >
                <MessageSquareWarning size={14} />
                Düzeltme İste
              </button>
              {canApprove && (
                <button className="approve" onClick={() => approveCourse(course)}>
                  <CheckCircle2 size={14} />
                  Onayla
                </button>
              )}
            </span>
          </div>
        ))}
      </div>
      {preview && (
        <div className="review-modal-backdrop">
          <section className="review-preview-modal">
            <header>
              <div>
                <small>DERS BİLGİ PAKETİ ÖN İZLEME</small>
                <h2>
                  {preview.code} — {preview.name}
                </h2>
              </div>
              <button onClick={() => setPreview(null)} aria-label="Kapat">
                <X size={17} />
              </button>
            </header>
            <div className="preview-summary">
              <article className="wide"><span>Genel bilgiler</span><p>Ders kodu: {preview.code} · Teorik/Uygulama: 3/0 · Kredi: 3 · Öğrenim dili: Türkçe · Ders türü: Seçmeli</p></article>
              <article>
                <span>Dersin amacı</span>
                <p>
                  Bilimsel araştırma sürecinin temel kavramlarını ve
                  uygulamalarını kazandırmak.
                </p>
              </article>
              <article>
                <span>Dersin içeriği</span>
                <p>
                  Araştırma problemi, literatür taraması, yöntem, veri analizi
                  ve bilimsel etik.
                </p>
              </article>
              <article>
                <span>Öğrenme çıktıları</span>
                <ol>
                  <li>Araştırma problemini tanımlar.</li>
                  <li>Uygun araştırma yöntemini seçer.</li>
                  <li>Bilimsel sonuçları raporlar.</li>
                </ol>
              </article>
              <article>
                <span>AKTS / İş yükü</span>
                <p>Toplam 180 saat — 6 AKTS</p>
              </article>
              <article><span>Öğretim yöntemleri</span><p>Anlatım, tartışma, örnek olay, uygulama ve proje.</p></article>
              <article><span>Ön koşullar ve kaynaklar</span><p>Ön koşul yoktur. Temel ve yardımcı ders kaynakları tanımlanmıştır.</p></article>
              <article className="wide"><span>15 haftalık ders planı</span><p>1. Bilim ve araştırma · 2. Araştırma problemi · 3. Literatür taraması · 4. Araştırma desenleri · 5. Örnekleme · 6. Veri toplama · 7. Ara sınav · 8–14. Analiz, raporlama ve etik · 15. Yarıyıl sonu değerlendirmesi</p></article>
              <article><span>Değerlendirme sistemi</span><p>Ara sınav: %40 · Yarıyıl sonu sınavı: %60</p></article>
              <article><span>Dersin yapısı</span><p>Alan bilgisi %60 · Fen bilimleri %20 · Sosyal bilimler %20</p></article>
              <article className="wide"><span>ÖÇ–PÇ katkı matrisi</span><p>ÖÇ1–ÖÇ5 ile P1–P13 arasındaki 0–5 katkı değerleri tanımlanmıştır.</p></article>
              <article className="wide"><span>Sürdürülebilir Kalkınma Amaçları</span><p>Nitelikli Eğitim · Sanayi, Yenilikçilik ve Altyapı · Amaçlar için Ortaklıklar</p></article>
            </div>
            <footer>
              <button
                onClick={() => {
                  setPreview(null);
                  setCorrection(preview);
                }}
              >
                <MessageSquareWarning size={14} />
                Düzeltme İste
              </button>
              {canApprove && (
                <button
                  className="approve"
                  onClick={() => {
                    approveCourse(preview);
                    setPreview(null);
                  }}
                >
                  <CheckCircle2 size={14} />
                  Onayla
                </button>
              )}
            </footer>
          </section>
        </div>
      )}
      {correction && (
        <div className="review-modal-backdrop">
          <section className="correction-modal">
            <header>
              <div>
                <small>DÜZELTME TALEBİ</small>
                <h2>
                  {correction.code} — {correction.name}
                </h2>
              </div>
              <button onClick={() => setCorrection(null)} aria-label="Kapat">
                <X size={17} />
              </button>
            </header>
            <div className="correction-package-preview"><b>İncelenen ders paketinin tamamı</b><span>Genel bilgiler · amaç ve içerik · öğretim yöntemleri · öğrenme çıktıları · ders yapısı · değerlendirme sistemi · 15 haftalık plan · AKTS/iş yükü · ÖÇ–PÇ matrisi · SKA</span></div>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                const notifications = JSON.parse(localStorage.getItem("lee-dbp-notifications") || "[]") as Array<Record<string, string>>;
                notifications.unshift({
                  kind: "Ders bilgi paketi",
                  target: `${correction.code} ${correction.name}`,
                  route: role === "abd_asd_baskani" ? "ABD/ASD Başkanı → Akademisyen" : "Enstitü rolü → ABD/ASD Başkanı → Akademisyen",
                  note,
                  date: new Date().toISOString(),
                  status: "Düzeltme istendi",
                });
                localStorage.setItem("lee-dbp-notifications", JSON.stringify(notifications));
                onAction();
                setCorrection(null);
              }}
            >
              <label>
                <span>Düzeltilecek alan ve açıklama</span>
                <textarea
                  required
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder="Örn. 6. haftanın konusu ile ÖÇ3 arasındaki ilişkiyi açıklayın; AKTS iş yükü toplamını kontrol edin."
                />
              </label>
              <small>
                Bu açıklama dersin akademisyenine düzeltme notu olarak
                iletilecektir.
              </small>
              <footer>
                <button type="button" onClick={() => setCorrection(null)}>
                  Vazgeç
                </button>
                <button className="request" type="submit">
                  <MessageSquareWarning size={14} />
                  Düzeltme Talebini Gönder
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}
    </section>
  );
}

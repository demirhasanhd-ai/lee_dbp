"use client";
import { Plus, Save, Send, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { OutcomeQualityHint } from "./outcomeQuality";

type Assessment = {
  id: number;
  name: string;
  count: number;
  weight: number;
  fixed?: boolean;
};
type Workload = { count: number; hours: number };
const weeks = Array.from({ length: 15 }, (_, index) => index + 1);
const structures = [
  "Matematik ve Temel Bilimler",
  "Mühendislik Bilimleri",
  "Mühendislik Tasarımı",
  "Sosyal Bilimler",
  "Eğitim Bilimleri",
  "Fen Bilimleri",
  "Sağlık Bilimleri",
  "Alan Bilgisi",
];

export function CourseBolognaEditor({ onSave, onPublish }: { onSave: () => void; onPublish: () => void }) {
  const [workflowStatus, setWorkflowStatus] = useState("Taslak");
  const [outcomes, setOutcomes] = useState(["", "", "", "", ""]);
  const [assessments, setAssessments] = useState<Assessment[]>([
    { id: 1, name: "Ara Sınav", count: 1, weight: 40, fixed: true },
    { id: 2, name: "Yarıyıl Sonu Sınavı", count: 1, weight: 60, fixed: true },
  ]);
  const [nextAssessment, setNextAssessment] = useState(3);
  const [workloads, setWorkloads] = useState<Record<string, Workload>>({
    "Ders Süresi": { count: 15, hours: 3 },
    "Sınıf Dışı Çalışma": { count: 15, hours: 2 },
    "Ara Sınav": { count: 1, hours: 2 },
    "Yarıyıl Sonu Sınavı": { count: 1, hours: 2 },
  });
  const [sdgs, setSdgs] = useState(["", "", ""]);
  const workloadNames = useMemo(
    () => [
      "Ders Süresi",
      "Sınıf Dışı Çalışma",
      ...assessments.map((item) => item.name),
    ],
    [assessments],
  );
  const totalWorkload = workloadNames.reduce((total, name) => {
    const row = workloads[name] ?? { count: 0, hours: 0 };
    return total + row.count * row.hours;
  }, 0);
  const ects = (totalWorkload / 30).toFixed(1);
  const updateWorkload = (name: string, key: keyof Workload, value: number) =>
    setWorkloads((current) => ({
      ...current,
      [name]: { ...(current[name] ?? { count: 0, hours: 0 }), [key]: value },
    }));
  const addAssessment = () => {
    const name = `Yeni Değerlendirme ${nextAssessment - 2}`;
    setAssessments((current) => [
      ...current,
      { id: nextAssessment, name, count: 1, weight: 0 },
    ]);
    setWorkloads((current) => ({ ...current, [name]: { count: 1, hours: 1 } }));
    setNextAssessment((value) => value + 1);
  };
  const removeAssessment = (item: Assessment) => {
    if (item.fixed) return;
    setAssessments((current) => current.filter((row) => row.id !== item.id));
    setWorkloads((current) => {
      const copy = { ...current };
      delete copy[item.name];
      return copy;
    });
  };
  return (
    <form
      className="course-bologna-form"
      onSubmit={(event) => {
        event.preventDefault();
        setWorkflowStatus("ABD Onayı Bekliyor");
        localStorage.setItem("lee-dbp-course-status", "abd_onayi_bekliyor");
        onPublish();
      }}
    >
      <section className="course-form-card">
        <header>
          <div>
            <small>BLM 501</small>
            <h2>Bilimsel Araştırma Yöntemleri</h2>
          </div>
          <span>{workflowStatus}</span>
        </header>
        <h3>Ders Genel Bilgileri</h3>
        <div className="course-general-grid">
          <label className="name">
            <span>Dersin Adı</span>
            <input defaultValue="Bilimsel Araştırma Yöntemleri" />
          </label>
          <label>
            <span>Kodu</span>
            <input defaultValue="BLM 501" />
          </label>
          <label>
            <span>Teorik saat</span>
            <input type="number" defaultValue="3" />
          </label>
          <label>
            <span>Uygulama saat</span>
            <input type="number" defaultValue="0" />
          </label>
          <label>
            <span>Kredi</span>
            <input type="number" defaultValue="3" />
          </label>
          <label>
            <span>AKTS</span>
            <input value={ects} readOnly />
          </label>
        </div>
      </section>
      <section className="course-form-card">
        <h3>Ders Bilgileri</h3>
        <div className="course-info-grid">
          <label>
            <span>Dersin seviyesi</span>
            <select defaultValue="Yüksek Lisans">
              <option>Yüksek Lisans</option>
              <option>Doktora</option>
              <option>Tezsiz Yüksek Lisans</option>
            </select>
          </label>
          <label>
            <span>Dersin türü</span>
            <select>
              <option>Zorunlu</option>
              <option>Seçmeli</option>
            </select>
          </label>
          <label>
            <span>Öğrenim dili</span>
            <select defaultValue="Türkçe">
              <option>Türkçe</option>
              <option>İngilizce</option>
            </select>
          </label>
        </div>
        {[
          [
            "Dersin Amacı",
            "Bilimsel araştırma sürecinin temel kavramlarını kazandırmak.",
          ],
          [
            "Dersin İçeriği",
            "Araştırma problemi, literatür taraması, yöntem, analiz ve etik.",
          ],
          [
            "Dersin Yöntem ve Teknikleri",
            "Anlatım, tartışma, örnek olay, uygulama ve proje.",
          ],
          ["Ön Koşulları", "Yok"],
          ["Dersin Koordinatörü", "Dr. Öğr. Üyesi Ayşe Yılmaz"],
          [
            "Dersi Veren Öğretim Elemanı / Elemanları",
            "Dr. Öğr. Üyesi Ayşe Yılmaz",
          ],
          ["Dersin Yardımcıları", "Yok"],
          ["Ders Kaynakları", "Temel ve yardımcı kaynakları girin."],
        ].map(([label, value]) => (
          <label className="long-field" key={label}>
            <span>{label}</span>
            <textarea defaultValue={value} />
          </label>
        ))}
      </section>
      <section className="course-form-card">
        <div className="section-title">
          <h3>Dersin Öğrenme Çıktıları</h3>
          <button
            type="button"
            onClick={() => setOutcomes((current) => [...current, ""])}
          >
            <Plus size={14} /> ÖÇ Ekle
          </button>
        </div>
        <div className="learning-outcomes">
          {outcomes.map((value, index) => (
            <div key={index}>
              <span>ÖÇ{index + 1}</span>
              <div className="outcome-input-wrap">
                <textarea
                  value={value}
                  onChange={(event) =>
                    setOutcomes((current) =>
                      current.map((item, i) =>
                        i === index ? event.target.value : item,
                      ),
                    )
                  }
                  placeholder="Öğrenme çıktısını yazın"
                />
                <OutcomeQualityHint text={value} kind="course" />
              </div>
              <button
                type="button"
                aria-label={`ÖÇ ${index + 1} sil`}
                onClick={() =>
                  setOutcomes((current) =>
                    current.filter((_, i) => i !== index),
                  )
                }
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </section>
      <section className="course-form-card">
        <h3>Ders Yapısı</h3>
        <div className="structure-grid">
          {structures.map((item) => (
            <label key={item}>
              <span>{item}</span>
              <div>
                <input type="number" min="0" max="100" defaultValue="0" />
                <b>%</b>
              </div>
            </label>
          ))}
        </div>
      </section>
      <section className="course-form-card">
        <div className="section-title">
          <h3>Değerlendirme Sistemi</h3>
          <button type="button" onClick={addAssessment}>
            <Plus size={14} /> Değerlendirme Ekle
          </button>
        </div>
        <div className="data-table assessment-table">
          <div className="table-head">
            <span>Değerlendirme türü</span>
            <span>Sayısı</span>
            <span>Katkı (%)</span>
            <span />
          </div>
          {assessments.map((item) => (
            <div key={item.id}>
              <input
                value={item.name}
                readOnly={item.fixed}
                onChange={(event) =>
                  setAssessments((current) =>
                    current.map((row) =>
                      row.id === item.id
                        ? { ...row, name: event.target.value }
                        : row,
                    ),
                  )
                }
              />
              <input
                type="number"
                min="0"
                value={item.count}
                onChange={(event) => {
                  const count = Number(event.target.value);
                  setAssessments((current) =>
                    current.map((row) =>
                      row.id === item.id ? { ...row, count } : row,
                    ),
                  );
                  updateWorkload(item.name, "count", count);
                }}
              />
              <input
                type="number"
                min="0"
                max="100"
                value={item.weight}
                onChange={(event) =>
                  setAssessments((current) =>
                    current.map((row) =>
                      row.id === item.id
                        ? { ...row, weight: Number(event.target.value) }
                        : row,
                    ),
                  )
                }
              />
              {!item.fixed ? (
                <button type="button" onClick={() => removeAssessment(item)}>
                  <Trash2 size={14} />
                </button>
              ) : (
                <span />
              )}
            </div>
          ))}
        </div>
      </section>
      <section className="course-form-card">
        <h3>Haftalık Konu Programı</h3>
        <div className="weekly-grid">
          <div className="table-head">
            <span>Hafta</span>
            <span>Haftalık konu</span>
          </div>
          {weeks.map((week) => (
            <div key={week}>
              <b>{week}</b>
              <textarea aria-label={`${week}. hafta konusu`} />
            </div>
          ))}
        </div>
      </section>
      <section className="course-form-card">
        <h3>AKTS / İş Yükü Tablosu</h3>
        <div className="data-table workload-table">
          <div className="table-head">
            <span>Etkinlik</span>
            <span>Sayısı</span>
            <span>Süresi (Saat)</span>
            <span>Toplam İş Yükü</span>
          </div>
          {workloadNames.map((name) => {
            const row = workloads[name] ?? { count: 0, hours: 0 };
            return (
              <div key={name}>
                <b>{name}</b>
                <input
                  type="number"
                  min="0"
                  value={row.count}
                  onChange={(event) =>
                    updateWorkload(name, "count", Number(event.target.value))
                  }
                />
                <input
                  type="number"
                  min="0"
                  value={row.hours}
                  onChange={(event) =>
                    updateWorkload(name, "hours", Number(event.target.value))
                  }
                />
                <input value={row.count * row.hours} readOnly />
              </div>
            );
          })}
          <div className="total-row">
            <b>Toplam İş Yükü / AKTS Kredisi</b>
            <span />
            <span />
            <strong>
              {totalWorkload} saat / {ects} AKTS
            </strong>
          </div>
        </div>
      </section>
      <section className="course-form-card">
        <h3>Dersin Program Çıktılarına Katkısı</h3>
        <p className="form-help">
          Her öğrenme çıktısının P1–P13 program çıktılarına katkısını 0–5
          arasında belirtin.
        </p>
        <div className="contribution-wrap">
          <table>
            <thead>
              <tr>
                <th>ÖÇ / PÇ</th>
                {Array.from({ length: 13 }, (_, i) => (
                  <th key={i}>P{i + 1}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {outcomes.map((_, outcome) => (
                <tr key={outcome}>
                  <th>ÖÇ{outcome + 1}</th>
                  {Array.from({ length: 13 }, (_, i) => (
                    <td key={i}>
                      <select
                        aria-label={`ÖÇ${outcome + 1} P${i + 1} katkısı`}
                        defaultValue="0"
                      >
                        <option>0</option>
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                      </select>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="course-form-card">
        <div className="section-title">
          <h3>Sürdürülebilir Kalkınma Amaçları</h3>
          <button
            type="button"
            onClick={() => setSdgs((current) => [...current, ""])}
          >
            <Plus size={14} /> SKA Ekle
          </button>
        </div>
        {sdgs.map((value, index) => (
          <label className="sdg-row" key={index}>
            <span>{index + 1}</span>
            <input
              value={value}
              onChange={(event) =>
                setSdgs((current) =>
                  current.map((item, i) =>
                    i === index ? event.target.value : item,
                  ),
                )
              }
              placeholder="Sürdürülebilir kalkınma amacını seçin veya yazın"
            />
            <button
              type="button"
              onClick={() =>
                setSdgs((current) => current.filter((_, i) => i !== index))
              }
            >
              <Trash2 size={14} />
            </button>
          </label>
        ))}
      </section>
      <div className="course-save-bar">
        <span>{workflowStatus === "Taslak" ? "Çalışmanızı taslak olarak kaydedebilir veya ABD/ASD onayına gönderebilirsiniz." : "Paket ABD/ASD başkanının onayını bekliyor; onaylanmadan public görünmez."}</span>
        <div className="course-submit-actions">
          <button type="button" className="draft" onClick={() => { setWorkflowStatus("Taslak"); localStorage.setItem("lee-dbp-course-status", "taslak"); onSave(); }}><Save size={15} />Taslağı Kaydet</button>
          <button type="submit" className="publish"><Send size={15} />Yayınla</button>
        </div>
      </div>
    </form>
  );
}

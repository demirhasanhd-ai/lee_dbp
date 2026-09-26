"use client";

import { Download, Eye, RefreshCw, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { dbpPath } from "../../lib/dbpPath";
import { storedDbpSessionHeader } from "../../lib/dbpSessionHeader";

type ViewStatsPayload = {
  totalEvents: number;
  months: string[];
  totals: Array<{ viewType: string; label: string; count: number }>;
};

function sessionHeader() {
  return storedDbpSessionHeader();
}

async function downloadFile(url: string, fileName: string) {
  const response = await fetch(dbpPath(url), {
    headers: { "X-DBP-Session": sessionHeader() },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || "Dosya indirilemedi.");
  }
  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(objectUrl);
}

export function ViewStatsAdminPanel() {
  const [summary, setSummary] = useState<ViewStatsPayload | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const loadSummary = async () => {
    const response = await fetch(dbpPath("/api/dbp/view-stats"), { cache: "no-store" });
    if (!response.ok) throw new Error("Görüntülenme özeti alınamadı.");
    setSummary(await response.json() as ViewStatsPayload);
  };

  useEffect(() => {
    loadSummary().catch((error) => setMessage(error instanceof Error ? error.message : "Özet yüklenemedi."));
  }, []);

  const run = async (success: string, action: () => Promise<void>) => {
    setBusy(true);
    setMessage("");
    try {
      await action();
      await loadSummary();
      setMessage(success);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "İşlem tamamlanamadı.");
    } finally {
      setBusy(false);
    }
  };

  const importJson = (file?: File) =>
    run("Yedek eklendi; aylık özetler yeniden hesaplandı.", async () => {
      if (!file) throw new Error("JSON yedek dosyası seçin.");
      const payload = JSON.parse(await file.text());
      const response = await fetch(dbpPath("/api/dbp/view-stats/import"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-DBP-Session": sessionHeader(),
        },
        body: JSON.stringify(payload),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.message || "Yedek yüklenemedi.");
      const inserted = body.result?.inserted ?? 0;
      const skipped = body.result?.skipped ?? 0;
      setMessage(`${inserted} yeni kayıt eklendi, ${skipped} kayıt atlandı.`);
    });

  return (
    <section className="database-admin">
      <div className="panel-intro">
        <div>
          <h2>Görüntülenme İstatistikleri</h2>
          <p>Site görüntülenme kayıtlarını indirin veya JSON yedeğini mevcut verinin üzerine eklemeden içe aktarın.</p>
        </div>
        <button className="primary-action" onClick={() => run("Özet yenilendi.", loadSummary)} disabled={busy}>
          <RefreshCw size={14} />
          Yenile
        </button>
      </div>

      {message && <div className="database-message">{message}</div>}

      <div className="database-stats">
        <article>
          <Eye size={18} />
          <b>{(summary?.totalEvents || 0).toLocaleString("tr-TR")}</b>
          <span>Ham kayıt</span>
        </article>
        <article>
          <RefreshCw size={18} />
          <b>{summary?.months.length || 0}</b>
          <span>Aylık dönem</span>
        </article>
        <article>
          <Download size={18} />
          <b>{summary?.totals.length || 0}</b>
          <span>Kategori</span>
        </article>
      </div>

      <div className="database-grid">
        <section className="database-panel">
          <header>
            <h3>Dışa Aktarma</h3>
            <small>JSON geri yükleme, CSV raporlama için kullanılır.</small>
          </header>
          <div className="database-actions">
            <button disabled={busy} onClick={() => run("JSON yedeği indirildi.", () => downloadFile("/api/dbp/view-stats/export.json", `dbp-view-stats-${new Date().toISOString().slice(0, 10)}.json`))}>
              <Download size={15} />
              JSON İndir
            </button>
            <button disabled={busy} onClick={() => run("CSV raporu indirildi.", () => downloadFile("/api/dbp/view-stats/export.csv", `dbp-view-stats-${new Date().toISOString().slice(0, 10)}.csv`))}>
              <Download size={15} />
              CSV İndir
            </button>
          </div>
        </section>

        <section className="database-panel">
          <header>
            <h3>Yedekten Yükleme</h3>
            <small>Varsayılan davranış eklemelidir; aynı kayıtlar UUID ile atlanır.</small>
          </header>
          <div className="database-actions">
            <label>
              <Upload size={15} />
              JSON Yedek Yükle
              <input type="file" accept="application/json,.json" onChange={(event) => importJson(event.target.files?.[0])} />
            </label>
          </div>
        </section>
      </div>
    </section>
  );
}

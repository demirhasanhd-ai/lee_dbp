"use client";

import {
  Archive,
  Database,
  Download,
  HardDrive,
  RefreshCw,
  RotateCcw,
  TableProperties,
  Trash2,
  Upload,
} from "lucide-react";
import { useEffect, useState } from "react";
import { dbpPath } from "../../lib/dbpPath";
import { storedDbpSessionHeader } from "../../lib/dbpSessionHeader";

type BackupInfo = {
  fileName: string;
  size: number;
  createdAt: string;
};

type DbSummary = {
  dbPath: string;
  dataDir: string;
  backupDir: string;
  size: number;
  counts: Record<string, number>;
  statusRows: { status: string; count: number }[];
  latestCourses: {
    id: number;
    code: string;
    name: string;
    department: string;
    program_name: string;
    level: string;
    status: string;
    instructor: string;
    updated_at: string;
  }[];
  latestPrograms: {
    id: number;
    main_department: string;
    department: string;
    program_name: string;
    levels: string[];
    updated_at: string;
  }[];
  backups: BackupInfo[];
  qualitySnapshot: {
    generatedAt: string;
    nextRefreshAt: string;
    schedule: string[];
  };
};

function formatBytes(value = 0) {
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / 1024 / 1024).toFixed(2)} MB`;
}

function sessionHeader() {
  return storedDbpSessionHeader();
}

function jsonHeaders() {
  return {
    "Content-Type": "application/json",
    "X-DBP-Session": sessionHeader(),
  };
}

export function DatabaseAdminPanel() {
  const [summary, setSummary] = useState<DbSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedBackup, setSelectedBackup] = useState("");
  const [resetConfirm, setResetConfirm] = useState("");

  const loadSummary = async () => {
    setLoading(true);
    const response = await fetch(dbpPath("/api/dbp/admin/summary"), {
      headers: { "X-DBP-Session": sessionHeader() },
    });
    if (!response.ok) throw new Error("Veri tabani ozeti alinamadi.");
    const data = (await response.json()) as DbSummary;
    setSummary(data);
    setSelectedBackup((current) => current || data.backups[0]?.fileName || "");
    setLoading(false);
  };

  useEffect(() => {
    loadSummary().catch((error) => {
      setMessage(error instanceof Error ? error.message : "Veri tabani yuklenemedi.");
      setLoading(false);
    });
  }, []);

  const runAction = async (label: string, action: () => Promise<void>) => {
    setBusy(true);
    setMessage("");
    try {
      await action();
      await loadSummary();
      setMessage(label);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Islem tamamlanamadi.");
    } finally {
      setBusy(false);
    }
  };

  const createBackup = () =>
    runAction("Yedek olusturuldu.", async () => {
      const response = await fetch(dbpPath("/api/dbp/admin/backup"), {
        method: "POST",
        headers: jsonHeaders(),
      });
      if (!response.ok) throw new Error("Yedek alinamadi.");
    });

  const downloadExport = async () => {
    const response = await fetch(dbpPath("/api/dbp/admin/export"), {
      headers: { "X-DBP-Session": sessionHeader() },
    });
    if (!response.ok) throw new Error("Yedek indirilemedi.");
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `dbp-export-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const restoreSelected = () =>
    runAction("Secili yedek geri yuklendi.", async () => {
      if (!selectedBackup) throw new Error("Once bir yedek secin.");
      const response = await fetch(dbpPath("/api/dbp/admin/restore"), {
        method: "POST",
        headers: jsonHeaders(),
        body: JSON.stringify({ fileName: selectedBackup }),
      });
      if (!response.ok) throw new Error("Yedekten geri donulemedi.");
    });

  const importFile = (file?: File) =>
    runAction("Dosyadan veri yuklendi.", async () => {
      if (!file) throw new Error("JSON yedek dosyasi secin.");
      const text = await file.text();
      const payload = JSON.parse(text);
      const response = await fetch(dbpPath("/api/dbp/admin/import"), {
        method: "POST",
        headers: jsonHeaders(),
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Dosyadan veri yuklenemedi.");
    });

  const resetEmpty = () =>
    runAction("Veri tabani bos olarak resetlendi.", async () => {
      const response = await fetch(dbpPath("/api/dbp/admin/reset"), {
        method: "POST",
        headers: jsonHeaders(),
        body: JSON.stringify({ confirm: resetConfirm }),
      });
      if (!response.ok) throw new Error("Reset icin DBP_RESET yazmalisiniz.");
      setResetConfirm("");
    });

  const reseed = () =>
    runAction("Mevcut ders verisi yeniden yuklendi.", async () => {
      const response = await fetch(dbpPath("/api/dbp/admin/seed"), {
        method: "POST",
        headers: jsonHeaders(),
      });
      if (!response.ok) throw new Error("Baslangic verisi yuklenemedi.");
    });

  const refreshQualityIndicators = () =>
    runAction("Kalite ve SKA göstergeleri canlı veriden yenilendi.", async () => {
      const response = await fetch(dbpPath("/api/dbp/admin/quality-refresh"), {
        method: "POST",
        headers: jsonHeaders(),
      });
      if (!response.ok) throw new Error("Kalite göstergeleri yenilenemedi.");
    });

  return (
    <section className="database-admin">
      <div className="panel-intro">
        <div>
          <h2>Veri Tabanı Yönetimi</h2>
          <p>DBP verisini, yedeklerini ve volume kalıcılığını buradan yönetin.</p>
        </div>
        <button className="primary-action" onClick={() => loadSummary()} disabled={busy}>
          <RefreshCw size={14} />
          Yenile
        </button>
      </div>

      {message && <div className="database-message">{message}</div>}
      {loading && <div className="database-message">Veri tabanı okunuyor...</div>}

      {summary && (
        <>
          <div className="database-stats">
            <article>
              <Database size={18} />
              <b>{summary.counts.programs}</b>
              <span>Program</span>
            </article>
            <article>
              <TableProperties size={18} />
              <b>{summary.counts.courses}</b>
              <span>Ders</span>
            </article>
            <article>
              <Archive size={18} />
              <b>{summary.counts.backups}</b>
              <span>Yedek</span>
            </article>
            <article>
              <HardDrive size={18} />
              <b>{formatBytes(summary.size)}</b>
              <span>DB boyutu</span>
            </article>
          </div>

          <div className="database-grid">
            <section className="database-panel">
              <header>
                <h3>Kalıcı Konum</h3>
                <small>Portainer volume bu dizine bağlanmalı.</small>
              </header>
              <dl className="database-paths">
                <div><dt>DB</dt><dd>{summary.dbPath}</dd></div>
                <div><dt>Data</dt><dd>{summary.dataDir}</dd></div>
                <div><dt>Yedek</dt><dd>{summary.backupDir}</dd></div>
              </dl>
            </section>

            <section className="database-panel">
              <header>
                <h3>Yedek ve Geri Yükleme</h3>
                <small>İçe aktarma ve reset öncesinde otomatik yedek alınır.</small>
              </header>
              <div className="database-actions">
                <button onClick={createBackup} disabled={busy}><Archive size={15} /> Yedek Al</button>
                <button onClick={() => runAction("JSON yedegi indirildi.", downloadExport)} disabled={busy}><Download size={15} /> JSON İndir</button>
                <label>
                  <Upload size={15} />
                  Dosyadan Yükle
                  <input type="file" accept="application/json,.json" onChange={(event) => importFile(event.target.files?.[0])} />
                </label>
              </div>
              <div className="database-restore-row">
                <select value={selectedBackup} onChange={(event) => setSelectedBackup(event.target.value)}>
                  <option value="">Yedek seçiniz</option>
                  {summary.backups.map((backup) => (
                    <option key={backup.fileName} value={backup.fileName}>
                      {backup.fileName} ({formatBytes(backup.size)})
                    </option>
                  ))}
                </select>
                <button onClick={restoreSelected} disabled={busy || !selectedBackup}><RotateCcw size={15} /> Geri Yükle</button>
              </div>
            </section>

            <section className="database-panel">
              <header>
                <h3>Bakım</h3>
                <small>Riskli işlemler öncesinde yedek alınır.</small>
              </header>
              <div className="database-actions">
                <button onClick={reseed} disabled={busy}><RefreshCw size={15} /> Mevcut Veriyi Yeniden Yükle</button>
                <button onClick={refreshQualityIndicators} disabled={busy}><RefreshCw size={15} /> Kalite ve SKA Göstergelerini Yenile</button>
              </div>
              <div className="database-quality-schedule">
                <b>Kalite göstergesi takvimi</b>
                <span>Son yenileme: {summary.qualitySnapshot.generatedAt ? new Date(summary.qualitySnapshot.generatedAt).toLocaleString("tr-TR") : "Henüz oluşturulmadı"}</span>
                <span>Sonraki otomatik yenileme: {summary.qualitySnapshot.nextRefreshAt ? new Date(summary.qualitySnapshot.nextRefreshAt).toLocaleString("tr-TR") : "Planlanmadı"}</span>
              </div>
              <div className="database-reset">
                <input value={resetConfirm} onChange={(event) => setResetConfirm(event.target.value)} placeholder="DBP_RESET yazın" />
                <button onClick={resetEmpty} disabled={busy || resetConfirm !== "DBP_RESET"}><Trash2 size={15} /> Boş Reset</button>
              </div>
            </section>

            <section className="database-panel">
              <header>
                <h3>Ders Durumları</h3>
                <small>Veri tabanındaki son durum dağılımı.</small>
              </header>
              <div className="database-status-list">
                {summary.statusRows.map((row) => (
                  <p key={row.status}><span>{row.status || "Belirsiz"}</span><b>{row.count}</b></p>
                ))}
              </div>
            </section>
          </div>

          <div className="database-tables">
            <section className="database-panel">
              <header>
                <h3>Son Programlar</h3>
                <small>DB kayıtlarından örnek görünüm.</small>
              </header>
              <div className="database-mini-table">
                {summary.latestPrograms.map((program) => (
                  <article key={program.id}>
                    <b>{program.department}</b>
                    <span>{program.program_name}</span>
                    <small>{program.levels.join(", ")}</small>
                  </article>
                ))}
              </div>
            </section>
            <section className="database-panel">
              <header>
                <h3>Son Dersler</h3>
                <small>DB kayıtlarından örnek görünüm.</small>
              </header>
              <div className="database-mini-table">
                {summary.latestCourses.map((course) => (
                  <article key={course.id}>
                    <b>{course.code} - {course.name}</b>
                    <span>{course.program_name}</span>
                    <small>{course.level} / {course.status}</small>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </>
      )}
    </section>
  );
}

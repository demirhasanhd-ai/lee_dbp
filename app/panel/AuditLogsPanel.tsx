"use client";

import { Download, Filter, RefreshCw, Search, ShieldCheck, X } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { dbpPath } from "../../lib/dbpPath";
import { storedDbpSessionHeader } from "../../lib/dbpSessionHeader";
import { downloadXlsx } from "../../lib/downloadXlsx";
import { DBP_MODULES } from "../../lib/auth/access";
import { auditActionLabel, auditRoleLabels, auditResultLabels } from "../../lib/auditLabels.mjs";
import "../audit-logs.css";

type AuditRow = {
  id: number; action: string; actor: string; createdAt: string; username: string; displayName: string;
  role: string; result: string; department: string; programName: string; code: string; level: string;
  path: string; method: string; httpStatus?: number; ip: string; userAgent: string; identitySource: string;
  requestId: string; details: Record<string, unknown>;
};
type AuditData = { rows: AuditRow[]; total: number; page: number; limit: number; actions: string[]; snapshotId: number };
type Filters = { from: string; to: string; user: string; role: string; action: string; result: string; department: string; code: string; q: string };
const emptyFilters: Filters = { from: "", to: "", user: "", role: "", action: "", result: "", department: "", code: "", q: "" };
const roleLabels: Record<string, string> = auditRoleLabels;
const resultLabels: Record<string, string> = auditResultLabels;
const moduleLabels: Record<string, string> = DBP_MODULES;
const dateLabel = (value: string) => new Date(value).toLocaleString("tr-TR", { timeZone: "Europe/Istanbul", dateStyle: "short", timeStyle: "medium" });
const detailLabels: Record<string, string> = {
  code: "Ders kodu", name: "Ad", department: "ABD / ASD", programName: "Program", level: "Düzey", status: "Durum",
  route: "Süreç yönü", note: "Açıklama", fileName: "Dosya", term: "Dönem", module: "Modül", rows: "Etkilenen kayıt",
  count: "Kayıt sayısı", keys: "Görünürlük ayarı sayısı", force: "Resen işlem", operation: "İstenen işlem", message: "Sonuç açıklaması",
  itemCount: "Satır sayısı", created: "Oluşturulan", existing: "Mevcut", invalid: "Geçersiz", updated: "Güncellenen",
  expiresAt: "Oturum bitişi", generatedAt: "Veri tarihi", access: "Rol ve modül yetkileri", event: "Olay",
  totalStudents: "Öğrenci sayısı", programs: "Program sayısı", courses: "Ders sayısı", id: "Kayıt numarası",
  thesisIdentifier: "Tez kimliği", relationStatus: "İlişki durumu", publicationYear: "Yayın yılı",
  pageTitle: "Sayfa",
  filters: "Uygulanan filtreler", from: "Başlangıç tarihi", to: "Bitiş tarihi", user: "Kullanıcı", role: "Rol", action: "İşlem", result: "Sonuç", q: "Arama", format: "İndirme biçimi",
  asOf: "Liste üst kayıt numarası",
};

function detailValue(key: string, value: unknown): string {
  if (key === "operation" && typeof value === "string") return auditActionLabel(value);
  if (key === "action" && typeof value === "string") return auditActionLabel(value);
  if (key === "role" && typeof value === "string") return roleLabels[value] || value;
  if (key === "result" && typeof value === "string") return resultLabels[value] || value;
  if (key === "module" && typeof value === "string") return moduleLabels[value] || value;
  if (typeof value === "boolean") return value ? "Evet" : "Hayır";
  if (value === null || value === undefined) return "—";
  if (["expiresAt", "generatedAt"].includes(key) && typeof value === "string" && Number.isFinite(Date.parse(value))) return dateLabel(value);
  if (Array.isArray(value)) return value.map((item) => typeof item === "string" ? moduleLabels[item] || item : JSON.stringify(item)).join(", ");
  if (typeof value === "object") return Object.entries(value).map(([name, entry]) => `${roleLabels[name] || detailLabels[name] || name}: ${detailValue(name, entry)}`).join("\n");
  return String(value);
}

function RecordDetails({ row, onClose }: { row: AuditRow; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => { ref.current?.showModal(); }, []);
  return <dialog ref={ref} className="audit-dialog" onCancel={onClose} aria-labelledby="audit-detail-title">
    <header><div><small>Kayıt #{row.id}</small><h3 id="audit-detail-title">{auditActionLabel(row.action)}</h3></div><button type="button" onClick={onClose} aria-label="Ayrıntıyı kapat"><X size={20} /></button></header>
    <dl>
      {[
        ["Tarih (Türkiye)", dateLabel(row.createdAt)], ["Kullanıcı", [row.displayName, row.username].filter(Boolean).join(" / ") || "Kimliği doğrulanmamış"],
        ["İşlem anındaki rol", roleLabels[row.role] || row.role || "Kayıtlı değil"], ["Sonuç", resultLabels[row.result] || "Kayıtlı değil"],
        ["Kimlik kaynağı", ({ sso: "Doğrulanmış e-Enstitü oturumu", local: "Yerel geliştirme oturumu", system: "Sistem işlemi", anonymous: "Kimliği doğrulanmamış" } as Record<string, string>)[row.identitySource] || "Kayıtlı değil"],
        ...Object.entries(row.details).map(([key, value]) => [detailLabels[key] || key, detailValue(key, value)]),
        ["İstek", [row.method, row.path].filter(Boolean).join(" ") || "Kayıtlı değil"], ["HTTP durumu", row.httpStatus || "Kayıtlı değil"],
        ["IP adresi", row.ip || "Kayıtlı değil"], ["Tarayıcı", row.userAgent || "Kayıtlı değil"], ["İstek kimliği", row.requestId || "Kayıtlı değil"],
      ].map(([label, value], index) => <div key={`${label}-${index}`}><dt>{label}</dt><dd>{value}</dd></div>)}
    </dl>
    <footer><button type="button" onClick={onClose}>Kapat</button></footer>
  </dialog>;
}

export function AuditLogsPanel() {
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [applied, setApplied] = useState<Filters>(emptyFilters);
  const [page, setPage] = useState(1);
  const [refresh, setRefresh] = useState(0);
  const [data, setData] = useState<AuditData | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<AuditRow | null>(null);
  const [view, setView] = useState<"table" | "timeline">("table");
  const snapshot = useRef<{ query: string; refresh: number; id: number } | null>(null);
  const makeQuery = (values: Filters) => new URLSearchParams(Object.entries(values).filter(([, value]) => value.trim()).map(([key, value]) => [key, value.trim()]));
  const query = makeQuery(applied).toString();

  useEffect(() => {
    const controller = new AbortController();
    const currentSnapshot = snapshot.current;
    const snapshotParam = currentSnapshot?.query === query && currentSnapshot.refresh === refresh ? `&asOf=${currentSnapshot.id}` : "";
    fetch(dbpPath(`/api/dbp/admin/audit-logs?${query}&page=${page}${snapshotParam}`), { headers: { "X-DBP-Session": storedDbpSessionHeader() }, signal: controller.signal })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.message || "Denetim kayıtları alınamadı.");
        if (!controller.signal.aborted) {
          snapshot.current = { query, refresh, id: payload.snapshotId };
          setData(payload);
        }
      }).catch((cause) => {
        if (!controller.signal.aborted) { setError(cause instanceof Error ? cause.message : "Kayıtlar alınamadı."); setData(null); }
      }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [query, page, refresh]);

  const beginLoad = () => { setLoading(true); setError(""); };
  const apply = (event: FormEvent) => { event.preventDefault(); beginLoad(); setApplied({ ...filters }); setPage(1); setRefresh((value) => value + 1); };
  const field = (name: keyof Filters, value: string) => setFilters((current) => ({ ...current, [name]: value }));
  const download = async (format: "csv" | "xlsx") => {
    setDownloading(true);
    setError("");
    try {
      const response = await fetch(dbpPath(`/api/dbp/admin/audit-logs/export?${query}&format=${format}&asOf=${data?.snapshotId ?? 0}`), { headers: { "X-DBP-Session": storedDbpSessionHeader() } });
      if (!response.ok) throw new Error((await response.json()).message || "Kayıtlar indirilemedi.");
      const stamp = new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Istanbul" });
      if (format === "xlsx") {
        const payload = await response.json();
        downloadXlsx([payload.headers, ...payload.rows], `dbp-denetim-${stamp}.xlsx`, "Denetim Kayıtları");
      } else {
        const url = URL.createObjectURL(await response.blob());
        const link = document.createElement("a");
        link.href = url; link.download = `dbp-denetim-${stamp}.csv`; document.body.appendChild(link); link.click(); link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Kayıtlar indirilemedi."); }
    finally { setDownloading(false); }
  };

  return <section className="audit-panel" aria-busy={loading}>
    <div className="panel-intro"><div><h2><ShieldCheck size={23} /> Denetim Kayıtları</h2><p>Kullanıcıların erişimlerini ve işlem geçmişini inceleyin. Tarih ve saatler Türkiye saatidir.</p></div><button className="primary-action" onClick={() => { beginLoad(); setRefresh((value) => value + 1); }} disabled={loading}><RefreshCw size={15} /> Yenile</button></div>
    <form className="audit-filters" onSubmit={apply}>
      <label>Başlangıç tarihi<input type="date" value={filters.from} max={filters.to || undefined} onChange={(event) => field("from", event.target.value)} /></label>
      <label>Bitiş tarihi<input type="date" value={filters.to} min={filters.from || undefined} onChange={(event) => field("to", event.target.value)} /></label>
      <label>Kullanıcı<input placeholder="Kullanıcı adı veya ad soyad" value={filters.user} onChange={(event) => field("user", event.target.value)} /></label>
      <label>Rol<select aria-label="Rol" value={filters.role} onChange={(event) => field("role", event.target.value)}><option value="">Tüm roller</option>{Object.entries(roleLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label>
      <label>İşlem<select aria-label="İşlem" value={filters.action} onChange={(event) => field("action", event.target.value)}><option value="">Tüm işlemler</option>{data?.actions.map((action) => <option key={action} value={action}>{auditActionLabel(action)}</option>)}</select></label>
      <label>Sonuç<select aria-label="Sonuç" value={filters.result} onChange={(event) => field("result", event.target.value)}><option value="">Tüm sonuçlar</option>{Object.entries(resultLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label>
      <label>ABD / ASD<input placeholder="Birim adı" value={filters.department} onChange={(event) => field("department", event.target.value)} /></label>
      <label>Ders kodu<input placeholder="Örn. YBS801" value={filters.code} onChange={(event) => field("code", event.target.value)} /></label>
      <label className="audit-search">Kayıtlarda ara<div><Search size={16} /><input placeholder="Program, açıklama veya işlem" value={filters.q} onChange={(event) => field("q", event.target.value)} /></div></label>
      <div className="audit-filter-actions"><button className="primary-action" type="submit" disabled={loading}><Filter size={15} /> Filtrele</button><button type="button" disabled={loading} onClick={() => { beginLoad(); setFilters(emptyFilters); setApplied(emptyFilters); setPage(1); setRefresh((value) => value + 1); }}>Temizle</button></div>
    </form>
    {error && <p className="audit-error" role="alert">{error}</p>}
    <div className="audit-toolbar"><div aria-live="polite">{loading ? "Kayıtlar yükleniyor…" : <><b>{(data?.total || 0).toLocaleString("tr-TR")}</b> kayıt{data?.total ? ` · ${((data.page - 1) * data.limit + 1).toLocaleString("tr-TR")}–${Math.min(data.page * data.limit, data.total).toLocaleString("tr-TR")} gösteriliyor` : ""}</>}</div><div><button onClick={() => void download("csv")} disabled={loading || downloading || !data?.total}><Download size={15} /> CSV İndir</button><button onClick={() => void download("xlsx")} disabled={loading || downloading || !data?.total}><Download size={15} /> Excel İndir</button></div></div>
    <div className="audit-view-switch" aria-label="Görünüm"><button aria-pressed={view === "table"} onClick={() => setView("table")}>Liste</button><button aria-pressed={view === "timeline"} onClick={() => setView("timeline")}>Zaman çizelgesi</button></div>
    {view === "timeline" ? <ol className="audit-timeline" aria-label="İşlem zaman çizelgesi">{data?.rows.map((row) => <li key={row.id}><time dateTime={row.createdAt}>{dateLabel(row.createdAt)}</time><div><strong>{auditActionLabel(row.action)}</strong><p>{row.displayName || row.username || "Kimliği doğrulanmamış"} · {roleLabels[row.role] || row.role || "Rol kayıtlı değil"}</p><p>{[row.code, row.department, row.programName, row.level, row.details.status ? String(row.details.status) : ""].filter(Boolean).join(" · ")}</p><span className={`audit-result ${row.result}`}>{resultLabels[row.result] || "Kayıtlı değil"}</span> <button onClick={() => setSelected(row)}>Ayrıntı</button></div></li>)}{!loading && !data?.rows.length && <li>Eşleşen kayıt bulunamadı.</li>}</ol> : <div className="audit-table-wrap"><table><thead><tr><th>Tarih</th><th>Kullanıcı</th><th>Rol</th><th>İşlem</th><th>İlgili kayıt</th><th>Sonuç</th><th>Ayrıntı</th></tr></thead><tbody>
      {data?.rows.map((row) => <tr key={row.id}><td className="audit-date">{dateLabel(row.createdAt)}</td><td><strong>{row.displayName || row.username || "Kimliği doğrulanmamış"}</strong>{row.displayName && <small>{row.username}</small>}</td><td>{roleLabels[row.role] || row.role || <span className="audit-muted">Kayıtlı değil</span>}</td><td><strong>{auditActionLabel(row.action)}</strong>{row.details.module ? <small>{moduleLabels[String(row.details.module)] || String(row.details.module)}</small> : null}{row.details.status ? <small>{String(row.details.status)}</small> : null}</td><td><strong>{row.code || row.programName || "—"}</strong><small>{[row.department, row.level].filter(Boolean).join(" · ")}</small></td><td><span className={`audit-result ${row.result}`}>{resultLabels[row.result] || "Kayıtlı değil"}</span></td><td><button type="button" onClick={() => setSelected(row)} aria-label={`Kayıt ${row.id} ayrıntısı`}>Ayrıntı</button></td></tr>)}
      {!loading && !data?.rows.length && <tr><td colSpan={7} className="audit-empty">{error ? "Kayıtlar gösterilemiyor." : "Seçtiğiniz filtrelerle eşleşen kayıt bulunamadı."}</td></tr>}
    </tbody></table></div>}
    <div className="audit-pagination"><p>İndirmeler uygulanan filtrelerin tüm sonuçlarını içerir.</p><div><button disabled={loading || !data || data.page <= 1} onClick={() => { beginLoad(); setPage(Math.max(1, (data?.page || 1) - 1)); }}>Önceki</button><span>Sayfa {data?.page || 1} / {Math.max(1, Math.ceil((data?.total || 0) / (data?.limit || 25)))}</span><button disabled={loading || !data || data.page * data.limit >= data.total} onClick={() => { beginLoad(); setPage((data?.page || 1) + 1); }}>Sonraki</button></div></div>
    <p className="audit-legacy-note">Yeni olayları almak için Yenile’yi kullanın. Eski kayıtlarda tutulmamış bilgiler “Kayıtlı değil” olarak gösterilir.</p>
    {selected && <RecordDetails row={selected} onClose={() => setSelected(null)} />}
  </section>;
}

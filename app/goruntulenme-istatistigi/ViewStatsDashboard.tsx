"use client";

import { AlertTriangle, BarChart3, CalendarDays, Eye, ListFilter, RefreshCw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { dbpPath } from "../../lib/dbpPath";

type TotalRow = { viewType: string; label: string; count: number };
type MonthlyRow = {
  yearMonth: string;
  viewType: string;
  label: string;
  itemId: string;
  itemTitle: string;
  count: number;
};
type ViewStatsPayload = {
  generatedAt: string;
  labels: Record<string, string>;
  totalEvents: number;
  totals: TotalRow[];
  months: string[];
  monthly: MonthlyRow[];
  topItems: MonthlyRow[];
};

const number = (value: number) => value.toLocaleString("tr-TR");
const monthLabel = (value: string) => {
  const [year, month] = value.split("-").map(Number);
  if (!year || !month) return value || "Tüm aylar";
  return new Intl.DateTimeFormat("tr-TR", { month: "long", year: "numeric" }).format(new Date(Date.UTC(year, month - 1, 1)));
};

export function ViewStatsDashboard() {
  const [data, setData] = useState<ViewStatsPayload | null>(null);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    fetch(dbpPath("/api/dbp/view-stats"), { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        const body = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(body.message || "Görüntülenme istatistikleri alınamadı.");
        return body as ViewStatsPayload;
      })
      .then((body) => {
        setData(body);
        setError("");
        setSelectedMonth((current) => current || body.months[0] || "");
      })
      .catch((reason: unknown) => {
        if (reason instanceof Error && reason.name !== "AbortError") setError(reason.message);
      });
    return () => controller.abort();
  }, [retry]);

  const monthRows = useMemo(
    () => (data?.monthly || []).filter((row) => !selectedMonth || row.yearMonth === selectedMonth),
    [data, selectedMonth],
  );
  const monthTotals = useMemo(() => {
    const map = new Map<string, TotalRow>();
    for (const row of monthRows) {
      const current = map.get(row.viewType) || { viewType: row.viewType, label: row.label, count: 0 };
      current.count += row.count;
      map.set(row.viewType, current);
    }
    return [...map.values()].sort((a, b) => b.count - a.count);
  }, [monthRows]);
  const maxTotal = Math.max(1, ...monthTotals.map((row) => row.count));
  const topDepartments = monthRows.filter((row) => row.viewType === "anabilimdali").sort((a, b) => b.count - a.count).slice(0, 12);
  const topCourses = monthRows.filter((row) => row.viewType === "ders").sort((a, b) => b.count - a.count).slice(0, 12);
  const monthlyTrend = useMemo(() => {
    const byMonth = new Map<string, number>();
    for (const row of data?.monthly || []) byMonth.set(row.yearMonth, (byMonth.get(row.yearMonth) || 0) + row.count);
    return [...byMonth.entries()].sort((a, b) => a[0].localeCompare(b[0])).slice(-12);
  }, [data]);
  const maxTrend = Math.max(1, ...monthlyTrend.map(([, count]) => count));

  if (error) {
    return <section className="quality-error"><AlertTriangle size={18} /><span>{error}</span><button type="button" onClick={() => setRetry((value) => value + 1)}><RefreshCw size={15} />Yeniden dene</button></section>;
  }

  if (!data) return <section className="quality-loading">Görüntülenme istatistikleri hazırlanıyor...</section>;

  return (
    <>
      <section className="view-stats-toolbar">
        <label>
          <ListFilter size={16} />
          <span>Ay</span>
          <select value={selectedMonth} onChange={(event) => setSelectedMonth(event.target.value)}>
            <option value="">Tüm aylar</option>
            {data.months.map((month) => <option key={month} value={month}>{monthLabel(month)}</option>)}
          </select>
        </label>
        <span><CalendarDays size={16} />Son güncelleme: {new Date(data.generatedAt).toLocaleString("tr-TR")}</span>
      </section>

      <section className="view-stats-kpis">
        <article><Eye /><span>Toplam görüntülenme</span><strong>{number(selectedMonth ? monthRows.reduce((sum, row) => sum + row.count, 0) : data.totalEvents)}</strong></article>
        <article><BarChart3 /><span>İzlenen kategori</span><strong>{number(monthTotals.length)}</strong></article>
        <article><CalendarDays /><span>Ay kapsamı</span><strong>{selectedMonth ? monthLabel(selectedMonth) : `${data.months.length} ay`}</strong></article>
      </section>

      <section className="view-stats-grid">
        <article className="quality-panel">
          <header><div><small>KATEGORİLER</small><h2>{selectedMonth ? monthLabel(selectedMonth) : "Tüm dönem"} dağılımı</h2></div></header>
          <div className="view-stat-bars">
            {monthTotals.map((row) => (
              <div key={row.viewType}>
                <span>{row.label}</span>
                <i><em style={{ width: `${Math.max(4, row.count / maxTotal * 100)}%` }} /></i>
                <b>{number(row.count)}</b>
              </div>
            ))}
          </div>
        </article>
        <article className="quality-panel">
          <header><div><small>AYLIK TOPLAM</small><h2>Son 12 ay</h2></div></header>
          <div className="view-stat-trend">
            {monthlyTrend.map(([month, count]) => (
              <button key={month} type="button" onClick={() => setSelectedMonth(month)} className={selectedMonth === month ? "selected" : ""}>
                <span style={{ height: `${Math.max(8, count / maxTrend * 100)}%` }}><b>{number(count)}</b></span>
                <small>{month.slice(5)}</small>
              </button>
            ))}
          </div>
        </article>
      </section>

      <section className="view-stats-grid">
        <StatsTable title="En çok görüntülenen ABD / ASD sayfaları" rows={topDepartments} empty="Bu ay için ABD / ASD görüntülenmesi yok." />
        <StatsTable title="En çok görüntülenen dersler" rows={topCourses} empty="Bu ay için ders görüntülenmesi yok." />
      </section>
    </>
  );
}

function StatsTable({ title, rows, empty }: { title: string; rows: MonthlyRow[]; empty: string }) {
  return (
    <article className="quality-panel">
      <header><div><small>İÇERİK</small><h2>{title}</h2></div></header>
      {rows.length ? (
        <div className="view-stat-table">
          {rows.map((row) => (
            <p key={`${row.yearMonth}-${row.viewType}-${row.itemId || row.itemTitle}`}>
              <span>{row.itemTitle || row.label}</span>
              <b>{number(row.count)}</b>
            </p>
          ))}
        </div>
      ) : <div className="quality-loading compact">{empty}</div>}
    </article>
  );
}

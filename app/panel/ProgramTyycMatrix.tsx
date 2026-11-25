"use client";

import { ChevronDown, Info } from "lucide-react";
import { programTyycGroups } from "../../lib/programTyycMatrix.mjs";
import type { ProgramTyycRow } from "../../lib/data/programProfiles";

export function ProgramTyycMatrix({ outcomeCount, programLevel = "Tezli Yüksek Lisans", initialRows = [], onRowsChange, error = "" }: { outcomeCount: number; programLevel?: string; initialRows?: ProgramTyycRow[]; onRowsChange: (rows: ProgramTyycRow[]) => void; error?: string }) {
  const tyycLevel = programLevel === "Doktora" ? 8 : 7;
  const groups = programTyycGroups(programLevel, initialRows);
  const columns = Array.from({ length: outcomeCount }, (_, index) => `PÇ${index + 1}`);
  const rows: ProgramTyycRow[] = groups.flatMap((group) => group.items.map((item) => ({
    ...item,
    values: Array.from({ length: outcomeCount }, (_, index) => initialRows.find((row) => row.code === item.code)?.values[index] ?? null),
  })));
  const relations = Object.fromEntries(rows.map((row) => [row.code, row.values]));
  const setRelation = (code: string, index: number, value: number | null) => {
    onRowsChange(rows.map((row) => row.code === code
      ? { ...row, values: row.values.map((current, itemIndex) => itemIndex === index ? value : current) }
      : row));
  };

  return <section className="program-content-card tyyc-card">
    <div className="tyyc-heading">
      <div><label>PÇ-TYYÇ İlişki Matrisi</label><small>Her hücre için ilişki düzeyi seçin. İlişki yoksa 0 (Yok) seçin; boş hücrelerle kayıt yapılamaz.</small></div>
      <span>TYYÇ Seviye {tyycLevel} · {programLevel}</span>
    </div>
    {error && <p className="tyyc-error" role="alert">{error}</p>}
    <div className="tyyc-legend" aria-label="İlişki düzeyi açıklaması">
      <Info size={14}/><b>İlişki düzeyi:</b><i className="level-0">0</i><span>Yok</span><i className="level-1">1</i><span>Düşük</span><i className="level-2">2</i><span>Orta</span><i className="level-3">3</i><span>Güçlü</span>
    </div>
    <div className="tyyc-scroll">
      <div className="tyyc-column-head" style={{ "--pc-count": outcomeCount } as React.CSSProperties}>
        <strong>TYYÇ yeterliliği</strong>{columns.map((column) => <b key={column}>{column}</b>)}
      </div>
      {groups.map((group, groupIndex) => <details className="tyyc-group" open={groupIndex === 0 || Boolean(error && group.items.some((item) => relations[item.code].some((value) => value === null)))} key={group.id}>
        <summary><span>{group.title}</span><small>{group.items.length} yeterlilik · {group.items.reduce((total, item) => total + (relations[item.code]?.slice(0, outcomeCount).filter(Boolean).length ?? 0), 0)} ilişki</small><ChevronDown size={16}/></summary>
        <div className="tyyc-rows">
          {group.items.map((item) => <div className="tyyc-row" style={{ "--pc-count": outcomeCount } as React.CSSProperties} key={item.code}>
            <div><b>{item.code}</b><span>{item.title}</span></div>
            {columns.map((column, index) => {
              const value = relations[item.code]?.[index] ?? null;
              return <select className={`relation-select level-${value ?? "empty"}`} value={value ?? ""} onChange={(event) => setRelation(item.code, index, event.target.value === "" ? null : Number(event.target.value))} aria-invalid={Boolean(error && value === null)} aria-label={`${item.code} ile ${column} ilişki düzeyi`} key={column}>
                <option value="">Seçiniz</option>
                <option value="0">0</option><option value="1">1</option><option value="2">2</option><option value="3">3</option>
              </select>;
            })}
          </div>)}
        </div>
      </details>)}
    </div>
  </section>;
}

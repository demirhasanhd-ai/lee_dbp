"use client";

import { Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { dbpPath } from "../lib/dbpPath";

export function FooterVisitCount() {
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch(dbpPath("/api/dbp/view-stats"), {
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) return null;
        const data = await response.json() as { totals?: Array<{ viewType: string; count: number }> };
        if (!Array.isArray(data.totals)) return null;
        const home = data.totals?.find((row) => row.viewType === "home");
        return typeof home?.count === "number" ? home.count : 0;
      })
      .then((value) => {
        if (value !== null) setTotal(value);
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);

  if (total === null) return null;

  return (
    <span className="footer-visit-count">
      <Eye size={13} />
      Ana sayfa ziyareti: <b>{total.toLocaleString("tr-TR")}</b>
    </span>
  );
}

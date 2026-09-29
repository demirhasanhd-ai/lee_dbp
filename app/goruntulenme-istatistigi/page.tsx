import type { Metadata } from "next";
import { PublicSiteHeader } from "../PublicSiteHeader";
import { ViewStatsDashboard } from "./ViewStatsDashboard";

export const metadata: Metadata = { title: "Görüntülenme İstatistiği" };

export default function PageViewStatsPage() {
  return (
    <main className="dbp-page quality-page view-stats-page">
      <PublicSiteHeader active="viewStats" />
      <section className="quality-hero">
        <div>
          <small>SİTE KULLANIM GÖRÜNÜMÜ</small>
          <h1>Görüntülenme İstatistiği</h1>
          <p>Ana sayfa, ABD / ASD, ders, kalite, TEZ_SKA ve bibliyometrik gösterge sayfalarının aylık erişim sayıları.</p>
        </div>
      </section>
      <ViewStatsDashboard />
    </main>
  );
}

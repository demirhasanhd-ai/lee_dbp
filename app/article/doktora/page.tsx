import { Construction } from "lucide-react";
import { PublicSiteHeader } from "../../PublicSiteHeader";

export default function DoctorateBibliometricsPage() {
  return <main className="dbp-page quality-page article-page"><PublicSiteHeader active="bibliometrics" bibliometricsSource="doctorate" /><section className="quality-hero article-hero"><div><small>DOKTORA TABANLI · GELİŞTİRME AŞAMASINDA</small><h1>Doktora Tabanlı Bibliyometrik Göstergeler</h1><p>Doktora programları ve tezleriyle ilişkilendirilecek bibliyometrik analiz ekranı hazırlanıyor.</p></div><span><Construction size={18} />Hazırlanıyor</span></section><section className="quality-loading"><Construction size={24} />Under construction · Bu sayfaya veri bağlanmadı.</section></main>;
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "LEE Ders Bilgi Paketi", template: "%s | LEE DBP" },
  description: "Lisansüstü Eğitim Enstitüsü Ders Bilgi Paketi ve Bologna kataloğu.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="tr" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: `try{document.documentElement.dataset.theme=localStorage.getItem("lee-dbp-theme")==="dark"?"dark":"light"}catch(e){document.documentElement.dataset.theme="light"}` }}/></head><body>{children}</body></html>;
}

"use client";

import { BookOpenCheck, Info, ListChecks } from "lucide-react";
import type { ReactNode } from "react";

type SidebarView = { level: string; tab: "profile" | "courses" };
type SidebarItem = {
  level: string;
  label?: string;
  caption?: string;
  programKey?: string;
};

const shortLevel = (level: string) =>
  level
    .replace("Tezsiz Yüksek Lisans", "Tezsiz YL")
    .replace("Tezli Yüksek Lisans", "Tezli YL")
    .replace("Tezsiz YÃ¼ksek Lisans", "Tezsiz YL")
    .replace("Tezli YÃ¼ksek Lisans", "Tezli YL");

export function PublicProgramSidebar({
  department,
  levels,
  activeLevel,
  activeProgramKey,
  items,
  view,
  activeTab = "courses",
  programHref,
  onViewChange,
}: {
  department: string;
  levels: string[];
  activeLevel: string;
  activeProgramKey?: string;
  items?: SidebarItem[];
  view?: SidebarView;
  activeTab?: "profile" | "courses";
  programHref: string;
  onViewChange?: (view: SidebarView & { programKey?: string }) => void;
}) {
  const selectedTab = view?.tab ?? activeTab;
  const menuItems = items?.length ? items : levels.map((level) => ({ level, label: shortLevel(level) }));

  const isActiveItem = (item: SidebarItem) =>
    activeLevel === item.level && (!item.programKey || !activeProgramKey || activeProgramKey === item.programKey);

  const action = (item: SidebarItem, tab: "profile" | "courses", label: string, icon: ReactNode) => {
    const active = isActiveItem(item) && selectedTab === tab;
    if (onViewChange) {
      return (
        <button
          className={active ? "active" : ""}
          type="button"
          onClick={() => onViewChange({ level: item.level, tab, programKey: item.programKey })}
        >
          {icon}
          {label}
        </button>
      );
    }
    return (
      <a className={active ? "active" : ""} href={programHref}>
        {icon}
        {label}
      </a>
    );
  };

  return (
    <aside className="public-left-sidebar merged public-program-sidebar-fixed">
      <div className="left-program-block">
        <h2>{department}</h2>
        <div className="sidebar-divider" />
        <strong>Programlar</strong>
        <nav className="left-level-links">
          {menuItems.map((item) => (
            <div
              className={isActiveItem(item) ? "program-menu-card active" : "program-menu-card"}
              key={`${item.programKey ?? "program"}-${item.level}`}
            >
              <div className="program-menu-title">
                <b>{item.label ?? shortLevel(item.level)}</b>
                {item.caption ? <small>{item.caption}</small> : null}
              </div>
              <div className="program-menu-actions">
                {action(item, "profile", "Bilgiler", <Info size={13} />)}
                {action(item, "courses", "Dersler", <ListChecks size={13} />)}
              </div>
            </div>
          ))}
        </nav>
      </div>
      <a className="left-home-link" href="/#programlar">
        <BookOpenCheck size={15} />
        {"Programlara d\u00f6n"}
      </a>
    </aside>
  );
}

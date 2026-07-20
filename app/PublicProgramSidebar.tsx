"use client";

import { BookOpenCheck, Info, ListChecks } from "lucide-react";
import type { ReactNode } from "react";

type SidebarView = { level: string; tab: "profile" | "courses" };

export function PublicProgramSidebar({
  department,
  levels,
  activeLevel,
  view,
  activeTab = "courses",
  programHref,
  onViewChange,
}: {
  department: string;
  levels: string[];
  activeLevel: string;
  view?: SidebarView;
  activeTab?: "profile" | "courses";
  programHref: string;
  onViewChange?: (view: SidebarView) => void;
}) {
  const selectedTab = view?.tab ?? activeTab;

  const action = (level: string, tab: "profile" | "courses", label: string, icon: ReactNode) => {
    const active = activeLevel === level && selectedTab === tab;
    if (onViewChange) {
      return (
        <button className={active ? "active" : ""} type="button" onClick={() => onViewChange({ level, tab })}>
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
          {levels.map((level) => (
            <div className={activeLevel === level ? "program-menu-card active" : "program-menu-card"} key={level}>
              <div className="program-menu-title">
                <b>{level}</b>
              </div>
              <div className="program-menu-actions">
                {action(level, "profile", "Bilgiler", <Info size={13} />)}
                {action(level, "courses", "Dersler", <ListChecks size={13} />)}
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

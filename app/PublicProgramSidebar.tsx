"use client";

import { BookOpenCheck, Info, ListChecks } from "lucide-react";
import type { MouseEvent, ReactNode } from "react";
import { dbpPath } from "../lib/dbpPath";
import { programSlug } from "../lib/data/programs";
import { programViewHref } from "../lib/data/programNavigation";

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
  const menuItems: SidebarItem[] = items?.length
    ? items
    : levels.map((level) => ({ level, label: shortLevel(level) }));

  const isActiveItem = (item: SidebarItem) =>
    activeLevel === item.level && (!item.programKey || !activeProgramKey || activeProgramKey === item.programKey);

  const itemProgramKey = (item: SidebarItem) =>
    item.programKey ?? activeProgramKey ?? programSlug({ department, programName: department.replace(/\s+(ABD|ASD)$/u, "") });

  const itemHref = (item: SidebarItem, tab: "profile" | "courses") => {
    const key = itemProgramKey(item);
    return dbpPath(key ? programViewHref(key, item.level, tab) : programHref);
  };

  const action = (item: SidebarItem, tab: "profile" | "courses", label: string, icon: ReactNode) => {
    const active = isActiveItem(item) && selectedTab === tab;
    return (
      <a
        className={active ? "active" : ""}
        href={itemHref(item, tab)}
        onClick={onViewChange ? (event: MouseEvent<HTMLAnchorElement>) => {
          event.preventDefault();
          onViewChange({ level: item.level, tab, programKey: item.programKey });
        } : undefined}
      >
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
              <a
                className="program-menu-title program-menu-title-link"
                href={itemHref(item, "profile")}
                onClick={onViewChange ? (event: MouseEvent<HTMLAnchorElement>) => {
                  event.preventDefault();
                  onViewChange({ level: item.level, tab: "profile", programKey: item.programKey });
                } : undefined}
                aria-label={`${item.label ?? shortLevel(item.level)} program bilgilerini göster`}
              >
                <b>{item.label ?? shortLevel(item.level)}</b>
                {item.caption ? <small>{item.caption}</small> : null}
              </a>
              <div className="program-menu-actions">
                {action(item, "profile", "Bilgiler", <Info size={13} />)}
                {action(item, "courses", "Dersler", <ListChecks size={13} />)}
              </div>
            </div>
          ))}
        </nav>
      </div>
      <a className="left-home-link" href={dbpPath("/#programlar")}>
        <BookOpenCheck size={15} />
        {"Programlara d\u00f6n"}
      </a>
    </aside>
  );
}

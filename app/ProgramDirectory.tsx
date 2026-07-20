"use client";

import { useEffect, useMemo, useState } from "react";
import { Building2, ChevronDown, Search } from "lucide-react";
import { LEE_PROGRAMS, MAIN_DEPARTMENTS, programSlug } from "../lib/data/programs";
import {
  publicLevelsForProgram,
  readProgramVisibility,
  type ProgramVisibilityMap,
} from "../lib/data/publicVisibility";

export function ProgramDirectory() {
  const [query, setQuery] = useState("");
  const [visibility, setVisibility] = useState<ProgramVisibilityMap>({});

  useEffect(() => {
    const sync = () => setVisibility(readProgramVisibility());
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("lee-dbp-public-visibility-change", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("lee-dbp-public-visibility-change", sync);
    };
  }, []);

  const publicPrograms = useMemo(
    () => LEE_PROGRAMS.filter((item) => publicLevelsForProgram(item, visibility).length > 0),
    [visibility],
  );

  const visibleDepartments = useMemo(() => {
    const q = query.toLocaleLowerCase("tr-TR");
    return MAIN_DEPARTMENTS.filter((main) => {
      const children = publicPrograms.filter((item) => item.mainDepartment === main);
      if (!children.length) return false;
      return !q || main.toLocaleLowerCase("tr-TR").includes(q) || children.some((item) =>
        `${item.department} ${item.programName} ${item.levels.join(" ")}`.toLocaleLowerCase("tr-TR").includes(q),
      );
    });
  }, [query, publicPrograms]);

  const totals = {
    mainDepartments: visibleDepartments.length,
    tezsiz: publicPrograms.filter((x) => publicLevelsForProgram(x, visibility).some((level) => level.startsWith("Tezsiz"))).length,
    tezli: publicPrograms.filter((x) => publicLevelsForProgram(x, visibility).some((level) => level.startsWith("Tezli"))).length,
    doktora: publicPrograms.filter((x) => publicLevelsForProgram(x, visibility).includes("Doktora")).length,
  };

  return (
    <div className="program-directory">
      <div className="directory-summary">
        <div><b>{totals.mainDepartments}</b><span>Ana ABD / ASD</span></div>
        <div><b>{totals.tezsiz}</b><span>Tezsiz YL</span></div>
        <div><b>{totals.tezli}</b><span>Tezli YL</span></div>
        <div><b>{totals.doktora}</b><span>Doktora</span></div>
        <label><Search size={17}/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ABD, program veya düzey ara..."/></label>
      </div>
      <div className="department-accordion">
        {visibleDepartments.map((main, index) => {
          const children = publicPrograms.filter((item) => item.mainDepartment === main);
          return (
            <details key={main} open={index < 2 && query === ""}>
              <summary>
                <span className="department-icon"><Building2 size={18}/></span>
                <span><b>{main}</b><small>{children.length} public program birimi</small></span>
                <ChevronDown size={17}/>
              </summary>
              <div className="department-programs">
                {children.map((item) => (
                  <a href={`/programlar/${programSlug(item)}`} key={`${item.department}-${item.programName}`}>
                    <div><b>{item.department}</b>{item.department !== item.programName && <small>{item.programName}</small>}</div>
                    <p>{publicLevelsForProgram(item, visibility).map((level) => <span className={level.startsWith("Tezsiz") ? "non-thesis" : level.startsWith("Tezli") ? "thesis" : "doctorate"} key={level}>{level}</span>)}</p>
                  </a>
                ))}
              </div>
            </details>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import { Eye, EyeOff, Save, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { LEE_PROGRAMS, MAIN_DEPARTMENTS } from "../../lib/data/programs";
import {
  isProgramLevelPublic,
  programLevelVisibilityKey,
  readProgramVisibility,
  writeProgramVisibility,
  type ProgramVisibilityMap,
} from "../../lib/data/publicVisibility";

export function ProgramPublishControl({ onSave }: { onSave: () => void }) {
  const [visibility, setVisibility] = useState<ProgramVisibilityMap>(() => readProgramVisibility());
  const [query, setQuery] = useState("");
  const totalLevelCount = LEE_PROGRAMS.reduce((total, program) => total + program.levels.length, 0);
  const visibleCount = LEE_PROGRAMS.reduce(
    (total, program) =>
      total + program.levels.filter((level) => isProgramLevelPublic(program, level, visibility)).length,
    0,
  );
  const filteredDepartments = useMemo(() => {
    const q = query.toLocaleLowerCase("tr-TR");
    return MAIN_DEPARTMENTS.filter((department) => {
      if (!q) return true;
      return department.toLocaleLowerCase("tr-TR").includes(q) || LEE_PROGRAMS.some((program) =>
        program.mainDepartment === department &&
        `${program.department} ${program.programName} ${program.levels.join(" ")}`.toLocaleLowerCase("tr-TR").includes(q),
      );
    });
  }, [query]);

  const toggle = (key: string) => {
    setVisibility((current) => ({ ...current, [key]: current[key] === false }));
  };

  const save = () => {
    writeProgramVisibility(visibility);
    onSave();
  };

  return (
    <section className="publish-control">
      <div className="panel-intro">
        <div>
          <h2>Public program görünürlüğü</h2>
          <p>ABD/ASD programlarının kamuya açık katalogda ve public sol menüde görünüp görünmeyeceğini belirleyin.</p>
        </div>
        <button className="primary-action" onClick={save}>
          <Save size={14} />
          Görünürlüğü Kaydet
        </button>
      </div>
      <div className="publish-summary">
        <div><b>{visibleCount}</b><span>Publicte Görünen Düzey</span></div>
        <div><b>{totalLevelCount - visibleCount}</b><span>Gizlenen Düzey</span></div>
        <label><Search size={16}/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ABD, program veya düzey ara..."/></label>
      </div>
      <div className="publish-department-list">
        {filteredDepartments.map((department) => {
          const programs = LEE_PROGRAMS.filter((program) => program.mainDepartment === department);
          return (
            <section className="publish-department" key={department}>
              <header>
                <b>{department}</b>
                <span>
                  {programs.reduce(
                    (total, program) =>
                      total + program.levels.filter((level) => isProgramLevelPublic(program, level, visibility)).length,
                    0,
                  )}
                  /{programs.reduce((total, program) => total + program.levels.length, 0)} public
                </span>
              </header>
              <div>
                {programs.flatMap((program) => program.levels.map((level) => {
                  const key = programLevelVisibilityKey(program, level);
                  const publicVisible = isProgramLevelPublic(program, level, visibility);
                  return (
                    <article className={publicVisible ? "is-public" : "is-hidden"} key={key}>
                      <div>
                        <b>{program.department}</b>
                        {program.department !== program.programName && <small>{program.programName}</small>}
                        <p><span>{level}</span></p>
                      </div>
                      <button onClick={() => toggle(key)} type="button">
                        {publicVisible ? <Eye size={15}/> : <EyeOff size={15}/>}
                        {publicVisible ? "Publicten Gizle" : "Publicte Göster"}
                      </button>
                    </article>
                  );
                }))}
              </div>
            </section>
          );
        })}
      </div>
    </section>
  );
}

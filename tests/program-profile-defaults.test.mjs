import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import vm from "node:vm";
import test from "node:test";
import { defaultProgramProfile, defaultProgramOutcomes } from "../lib/programProfileDefaults.mjs";

const source = readFileSync(new URL("../server.mjs", import.meta.url), "utf8");
const declarations = new Map([...source.matchAll(/^function (\w+)\([^\n]*\) \{[\s\S]*?^\}/gm)].map((match) => [match[1], match[0]]));

test("startup seeds missing profiles, preserves chair edits and never changes approved course packages", () => {
  const db = new DatabaseSync(":memory:");
  try {
    db.exec("CREATE TABLE metadata (key TEXT PRIMARY KEY, value TEXT)");
    for (const table of ["programs", "program_profiles"]) {
      const schema = source.match(new RegExp(`CREATE TABLE IF NOT EXISTS ${table} \\([\\s\\S]*?\\n    \\);`));
      assert.ok(schema, table);
      db.exec(schema[0]);
    }
    db.exec("CREATE TABLE courses (id INTEGER PRIMARY KEY, status TEXT, package_json TEXT, updated_at TEXT)");
    const published = JSON.stringify({ published: { package: { contributionMatrix: [{ P1: 5 }], detailFields: { purpose: "Approved" } } } });
    db.prepare("INSERT INTO courses VALUES (1, 'Yayımlandı', ?, 'approved-at')").run(published);
    const context = vm.createContext({ db, readFileSync, defaultProgramProfile,
      programProfilesSeedFile: new URL("../seed/program-profiles.json", import.meta.url),
      repairText: (value) => String(value ?? ""), repairObject: (value) => value, audit() {},
    });
    for (const name of ["normalizeProfileLevel", "parseJsonField", "normalizeProgramProfilePayload", "seedProgramProfiles"]) vm.runInContext(declarations.get(name), context);
    const insert = db.prepare("INSERT INTO programs(main_department, department, program_name, flags, levels_json, created_at, updated_at) VALUES ('ABD', 'ABD', ?, '', ?, 'old', 'old')");
    insert.run("Matematik", JSON.stringify(["Tezli YL"]));
    insert.run("İşletme", JSON.stringify(["Doktora"]));
    const chair = defaultProgramProfile("İşletme", "Doktora");
    chair.outcomes = Array.from({ length: 12 }, (_, index) => `Başkanın çıktısı ${index + 1}`);
    db.prepare("INSERT INTO program_profiles(program_name, level, degree, manager, language, qualification_rules, sections_json, outcomes_json, tyyc_rows_json, created_at, updated_at, updated_by) VALUES (?, ?, '', '', '', '', '[]', ?, '[]', 'old', 'chair-date', 'chair')")
      .run(chair.programName, chair.level, JSON.stringify(chair.outcomes));
    const beforeChair = db.prepare("SELECT * FROM program_profiles WHERE program_name = 'İşletme'").get();
    const beforeCourses = db.prepare("SELECT * FROM courses").all();
    context.seedProgramProfiles();
    const math = db.prepare("SELECT * FROM program_profiles WHERE program_name = 'Matematik'").get();
    assert.deepEqual(JSON.parse(math.outcomes_json), defaultProgramOutcomes);
    assert.equal(math.level, "Tezli Yüksek Lisans");
    assert.equal(math.updated_by, "seed");
    const biology = db.prepare("SELECT * FROM program_profiles WHERE program_name = 'Biyoloji' AND level = 'Doktora'").get();
    assert.equal(JSON.parse(biology.outcomes_json).length, 11, "specific seed data must take precedence over generic defaults");
    assert.deepEqual(db.prepare("SELECT * FROM program_profiles WHERE program_name = 'İşletme'").get(), beforeChair);
    assert.deepEqual(db.prepare("SELECT * FROM courses").all(), beforeCourses);
    // An intentionally empty saved profile also belongs to its chair.
    db.prepare("UPDATE program_profiles SET outcomes_json = '[]', updated_by = 'chair', updated_at = 'edited' WHERE program_name = 'Matematik'").run();
    const snapshot = db.prepare("SELECT * FROM program_profiles ORDER BY id").all();
    context.seedProgramProfiles();
    assert.deepEqual(db.prepare("SELECT * FROM program_profiles ORDER BY id").all(), snapshot, "restarts must not overwrite any profile");
    assert.deepEqual(db.prepare("SELECT * FROM courses").all(), beforeCourses);
  } finally { db.close(); }
});

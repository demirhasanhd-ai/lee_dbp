import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { stripTypeScriptTypes } from "node:module";
import test from "node:test";
import vm from "node:vm";
import { COURSE_STRUCTURE_LABELS, courseStructureTotal, normalizeCourseStructures } from "../lib/courseStructures.mjs";
import { parseObsCourseDraft } from "../lib/obsBologna.mjs";

test("GTB811 legacy hidden share is excluded while the teacher's visible percentages survive", () => {
  const saved = { "Fen Bilimleri": 15, "Alan Bilgisi": 60, "Laboratuvar / Araştırma": 25 };
  const before = JSON.stringify(saved);
  const editable = normalizeCourseStructures(saved);
  assert.equal(courseStructureTotal(saved), 75);
  assert.equal(courseStructureTotal(editable), 75);
  assert.equal(editable["Fen Bilimleri"], 15);
  assert.equal(editable["Alan Bilgisi"], 60);
  assert.deepEqual(Object.keys(editable), COURSE_STRUCTURE_LABELS);
  assert.equal(courseStructureTotal({ ...editable, "Matematik ve Temel Bilimler": 25 }), 100);
  assert.equal(JSON.stringify(saved), before, "opening the editor must not mutate the stored revision");
});

test("all affected department defaults retain their visible shares without adding hidden categories", () => {
  const source = readFileSync(new URL("../app/panel/CourseBolognaEditor.tsx", import.meta.url), "utf8");
  const defaults = source.slice(source.indexOf("const emptyStructures ="), source.indexOf("const defaultDetailFields ="));
  const context = vm.createContext({ normalizeCourseStructures });
  vm.runInContext(stripTypeScriptTypes(defaults + "\nglobalThis.defaults = structuresForCourse;"), context);
  for (const [department, programName, expectedTotal] of [
    ["Gıda Teknolojisi ABD", "Gıda Teknolojisi", 75],
    ["Biyoloji ABD", "Biyoloji", 70],
    ["Gıda Mühendisliği ABD", "Gıda Mühendisliği", 85],
    ["Harita Mühendisliği ABD", "Harita Mühendisliği", 90],
    ["Hemşirelik ABD", "İç Hastalıkları Hemşireliği", 85],
    ["Gastronomi ve Mutfak Sanatları ABD", "Gastronomi ve Mutfak Sanatları", 80],
    ["Batarya Sistemleri ABD", "Batarya Sistemleri", 100],
  ]) {
    const values = context.defaults({ department, programName });
    assert.deepEqual(Object.keys(values), COURSE_STRUCTURE_LABELS, department);
    assert.equal(courseStructureTotal(values), expectedTotal, department);
  }
});

test("OBS import shares the eight editor categories and cannot reintroduce a legacy hidden share", () => {
  const html = "<table>" + [...COURSE_STRUCTURE_LABELS, "Laboratuvar / Araştırma"]
    .map((label) => `<tr><td>${label}</td><td>${label === "Alan Bilgisi" ? 100 : label === "Laboratuvar / Araştırma" ? 25 : 0}</td></tr>`).join("") + "</table>";
  const draft = parseObsCourseDraft(html, "https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=123");
  assert.deepEqual(Object.keys(draft.structures), COURSE_STRUCTURE_LABELS);
  const merged = normalizeCourseStructures({ "Fen Bilimleri": 15, "Laboratuvar / Araştırma": 25, ...draft.structures });
  assert.equal(courseStructureTotal(merged), 100);
  assert.equal(merged["Alan Bilgisi"], 100);
  assert.equal(merged["Fen Bilimleri"], 0);
  assert.equal(merged["Laboratuvar / Araştırma"], undefined);
});

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

const panel = readFileSync(new URL("../app/panel/RoleDashboard.tsx", import.meta.url), "utf8");
const catalogSource = readFileSync(new URL("../lib/data/programs.ts", import.meta.url), "utf8");
const catalogModule = { exports: {} };
vm.runInNewContext(ts.transpileModule(catalogSource, {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText, { exports: catalogModule.exports });
const { LEE_PROGRAMS } = catalogModule.exports;

// Exercise the panel's actual normalization and filtering against its real catalog.
const normalization = panel.slice(panel.indexOf("const foldTurkishText ="), panel.indexOf("const normalizePersonName ="));
const filtering = panel.slice(panel.indexOf("  const scopedPrograms ="), panel.indexOf("  const activeProfileProgram ="));
const scopeScript = ts.transpileModule(`${normalization}\n${filtering}\nscopedPrograms;`, {}).outputText;
const scopedPrograms = (department, isCentralRole = false, displayedCatalogPrograms = LEE_PROGRAMS) => vm.runInNewContext(scopeScript, {
  session: { department }, isCentralRole, displayedCatalogPrograms, repairText: (value) => value,
});

test("İşletme ABD chair can select all seven program levels, including both child branches", () => {
  for (const department of ["İşletme ABD", "İŞLETME ANABİLİM DALI", "isletme"]) {
    const programs = scopedPrograms(department);
    assert.deepEqual(Array.from(programs, (program) => program.programName), [
      "İşletme", "Muhasebe ve Finansman", "Yönetim Organizasyon",
    ]);
    assert.equal(programs.flatMap((program) => program.levels).length, 7);
    assert.ok(programs.every((program) => program.mainDepartment === "İşletme ABD"));
  }
});

test("child branch scope stays within that branch and does not grant parent or sibling access", () => {
  const programs = scopedPrograms("Muhasebe ve Finansman");
  assert.deepEqual(Array.from(programs, (program) => program.programName), ["Muhasebe ve Finansman"]);
  assert.equal(programs.flatMap((program) => program.levels).length, 2);
});

test("other ABDs remain isolated and empty or unknown scopes grant no programs", () => {
  assert.deepEqual(Array.from(scopedPrograms("İktisat ABD"), (program) => program.programName), ["Ekonomi ve Finans", "İktisat"]);
  for (const scope of ["", "ABD", "Bilinmeyen ABD"]) assert.equal(scopedPrograms(scope).length, 0);
  assert.equal(scopedPrograms("LEE", true).length, LEE_PROGRAMS.length);
});

test("committee panel shows all seven child program levels under one ABD committee", () => {
  const committeeFiltering = panel.slice(panel.indexOf("  const committeeScopeSet ="), panel.indexOf("  const committeeProgram ="));
  const displayedCatalogCourses = LEE_PROGRAMS.flatMap((program) => program.levels.map((level) => ({
    department: program.department, programName: program.programName, level,
  })));
  const courses = vm.runInNewContext(ts.transpileModule(`${normalization}\n${committeeFiltering}\ncommitteeCourses;`, {}).outputText, {
    session: { role: "akademisyen" }, committeeMemberships: [{ department: "İşletme" }],
    displayedCatalogPrograms: LEE_PROGRAMS, displayedCatalogCourses, repairText: (value) => value,
  });
  assert.equal(courses.length, 7);
  assert.deepEqual([...new Set(Array.from(courses, (course) => course.programName))], ["İşletme", "Muhasebe ve Finansman", "Yönetim Organizasyon"]);

  const optionsSource = panel.slice(panel.indexOf("  const committeeScopeOptions ="), panel.indexOf("  const allReviewCourses ="));
  const options = vm.runInNewContext(ts.transpileModule(`${normalization}\n${optionsSource}\ncommitteeScopeOptions;`, {
    compilerOptions: { target: ts.ScriptTarget.ES2022 },
  }).outputText, {
    scopedPrograms: scopedPrograms("İşletme ABD"), repairText: (value) => value,
  });
  assert.deepEqual(Array.from(options, (option) => option.department), ["İşletme ABD"]);
});

test("İktisat chair sees both programs and a newly registered branch appears without changing the static catalog", () => {
  assert.deepEqual(Array.from(scopedPrograms("İktisat ABD"), (program) => program.programName), ["Ekonomi ve Finans", "İktisat"]);
  const added = { mainDepartment: "Makine Mühendisliği ABD", department: "İmalat Sistemleri", programName: "İmalat Sistemleri", levels: ["Tezli Yüksek Lisans"] };
  const programs = scopedPrograms("Makine Mühendisliği ABD", false, [...LEE_PROGRAMS, added]);
  assert.deepEqual(Array.from(programs, (program) => program.programName), ["Makine Mühendisliği", "İmalat Sistemleri"]);
  assert.equal(scopedPrograms("İktisat ABD", false, [...LEE_PROGRAMS, added]).some((program) => program === added), false);
  assert.doesNotMatch(panel, /\bLEE_PROGRAMS\b/);
  assert.match(panel, /fetchDbpPrograms\(init\)/);
});

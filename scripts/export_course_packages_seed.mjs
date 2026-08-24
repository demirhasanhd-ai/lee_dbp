import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import ts from "typescript";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputFile = path.join(rootDir, "seed", "course-packages.json");
const sourceFiles = new Map([
  ["./coursePackages", path.join(rootDir, "lib", "data", "coursePackages.ts")],
  ["./ybsAcademicCoursePackages", path.join(rootDir, "lib", "data", "ybsAcademicCoursePackages.ts")],
  ["./makineCommonCoursePackages", path.join(rootDir, "lib", "data", "makineCommonCoursePackages.ts")],
  ["./makineAcademicCoursePackages", path.join(rootDir, "lib", "data", "makineAcademicCoursePackages.ts")],
  ["./makineAcademicCoursePackages2", path.join(rootDir, "lib", "data", "makineAcademicCoursePackages2.ts")],
  ["./makineAcademicCoursePackages3", path.join(rootDir, "lib", "data", "makineAcademicCoursePackages3.ts")],
  ["./aileDanismanligiTezliCoursePackages", path.join(rootDir, "lib", "data", "aileDanismanligiTezliCoursePackages.ts")],
  ["./aileDanismanligiCommonCoursePackages", path.join(rootDir, "lib", "data", "aileDanismanligiCommonCoursePackages.ts")],
  ["./aileDanismanligiMissingCoursePackages", path.join(rootDir, "lib", "data", "aileDanismanligiMissingCoursePackages.ts")],
  ["./aileDanismanligiTezsizCoursePackages", path.join(rootDir, "lib", "data", "aileDanismanligiTezsizCoursePackages.ts")],
  ["./aileDanismanligiTezsizCommonCoursePackages", path.join(rootDir, "lib", "data", "aileDanismanligiTezsizCommonCoursePackages.ts")],
  ["./arkeolojiTezliCoursePackages", path.join(rootDir, "lib", "data", "arkeolojiTezliCoursePackages.ts")],
  ["./arkeolojiCommonCoursePackages", path.join(rootDir, "lib", "data", "arkeolojiCommonCoursePackages.ts")],
  ["./arkeolojiMissingCoursePackages", path.join(rootDir, "lib", "data", "arkeolojiMissingCoursePackages.ts")],
  ["./bataryaTezliCoursePackages", path.join(rootDir, "lib", "data", "bataryaTezliCoursePackages.ts")],
  ["./bataryaCommonCoursePackages", path.join(rootDir, "lib", "data", "bataryaCommonCoursePackages.ts")],
  ["./bedenTezliCoursePackages", path.join(rootDir, "lib", "data", "bedenTezliCoursePackages.ts")],
  ["./bedenCommonCoursePackages", path.join(rootDir, "lib", "data", "bedenCommonCoursePackages.ts")],
  ["./biyolojiTezliCoursePackages", path.join(rootDir, "lib", "data", "biyolojiTezliCoursePackages.ts")],
  ["./biyolojiCommonCoursePackages", path.join(rootDir, "lib", "data", "biyolojiCommonCoursePackages.ts")],
  ["./biyolojiDoktoraCoursePackages", path.join(rootDir, "lib", "data", "biyolojiDoktoraCoursePackages.ts")],
  ["./biyolojiDoktoraCommonCoursePackages", path.join(rootDir, "lib", "data", "biyolojiDoktoraCommonCoursePackages.ts")],
  ["./ebelikTezliCoursePackages", path.join(rootDir, "lib", "data", "ebelikTezliCoursePackages.ts")],
  ["./ebelikCommonCoursePackages", path.join(rootDir, "lib", "data", "ebelikCommonCoursePackages.ts")],
  ["./ekoturizmTezliCoursePackages", path.join(rootDir, "lib", "data", "ekoturizmTezliCoursePackages.ts")],
  ["./elektrikElektronikTezliCoursePackages", path.join(rootDir, "lib", "data", "elektrikElektronikTezliCoursePackages.ts")],
  ["./elektrikElektronikCommonCoursePackages", path.join(rootDir, "lib", "data", "elektrikElektronikCommonCoursePackages.ts")],
  ["./enerjiSistemleriTezliCoursePackages", path.join(rootDir, "lib", "data", "enerjiSistemleriTezliCoursePackages.ts")],
  ["./enerjiSistemleriCommonCoursePackages", path.join(rootDir, "lib", "data", "enerjiSistemleriCommonCoursePackages.ts")],
  ["./enerjiSistemleriDoktoraCoursePackages", path.join(rootDir, "lib", "data", "enerjiSistemleriDoktoraCoursePackages.ts")],
  ["./enerjiSistemleriDoktoraCommonCoursePackages", path.join(rootDir, "lib", "data", "enerjiSistemleriDoktoraCommonCoursePackages.ts")],
  ["./felsefeDinTezliCoursePackages", path.join(rootDir, "lib", "data", "felsefeDinTezliCoursePackages.ts")],
  ["./felsefeDinCommonCoursePackages", path.join(rootDir, "lib", "data", "felsefeDinCommonCoursePackages.ts")],
  ["./fizikTezliCoursePackages", path.join(rootDir, "lib", "data", "fizikTezliCoursePackages.ts")],
  ["./fizikCommonCoursePackages", path.join(rootDir, "lib", "data", "fizikCommonCoursePackages.ts")],
  ["./fizikDoktoraCoursePackages", path.join(rootDir, "lib", "data", "fizikDoktoraCoursePackages.ts")],
  ["./fizikDoktoraCommonCoursePackages", path.join(rootDir, "lib", "data", "fizikDoktoraCommonCoursePackages.ts")],
  ["./gastronomiTezliCoursePackages", path.join(rootDir, "lib", "data", "gastronomiTezliCoursePackages.ts")],
  ["./gastronomiCommonCoursePackages", path.join(rootDir, "lib", "data", "gastronomiCommonCoursePackages.ts")],
  ["./gidaMuhendisligiTezliCoursePackages", path.join(rootDir, "lib", "data", "gidaMuhendisligiTezliCoursePackages.ts")],
  ["./gidaMuhendisligiCommonCoursePackages", path.join(rootDir, "lib", "data", "gidaMuhendisligiCommonCoursePackages.ts")],
  ["./gidaMuhendisligiDoktoraCoursePackages", path.join(rootDir, "lib", "data", "gidaMuhendisligiDoktoraCoursePackages.ts")],
  ["./gidaMuhendisligiDoktoraCommonCoursePackages", path.join(rootDir, "lib", "data", "gidaMuhendisligiDoktoraCommonCoursePackages.ts")],
  ["./gidaTeknolojisiTezliCoursePackages", path.join(rootDir, "lib", "data", "gidaTeknolojisiTezliCoursePackages.ts")],
  ["./gidaTeknolojisiCommonCoursePackages", path.join(rootDir, "lib", "data", "gidaTeknolojisiCommonCoursePackages.ts")],
  ["./haritaMuhendisligiTezliCoursePackages", path.join(rootDir, "lib", "data", "haritaMuhendisligiTezliCoursePackages.ts")],
  ["./haritaMuhendisligiCommonCoursePackages", path.join(rootDir, "lib", "data", "haritaMuhendisligiCommonCoursePackages.ts")],
  ["./icHastaliklariHemsireligiTezliCoursePackages", path.join(rootDir, "lib", "data", "icHastaliklariHemsireligiTezliCoursePackages.ts")],
  ["./icHastaliklariHemsireligiCommonCoursePackages", path.join(rootDir, "lib", "data", "icHastaliklariHemsireligiCommonCoursePackages.ts")],
  ["./iktisatTezliCoursePackages", path.join(rootDir, "lib", "data", "iktisatTezliCoursePackages.ts")],
  ["./iktisatCommonCoursePackages", path.join(rootDir, "lib", "data", "iktisatCommonCoursePackages.ts")],
  ["./insaatMuhendisligiTezliCoursePackages", path.join(rootDir, "lib", "data", "insaatMuhendisligiTezliCoursePackages.ts")],
  ["./insaatMuhendisligiCommonCoursePackages", path.join(rootDir, "lib", "data", "insaatMuhendisligiCommonCoursePackages.ts")],
  ["./insaatMuhendisligiDoktoraCoursePackages", path.join(rootDir, "lib", "data", "insaatMuhendisligiDoktoraCoursePackages.ts")],
  ["./insaatMuhendisligiDoktoraCommonCoursePackages", path.join(rootDir, "lib", "data", "insaatMuhendisligiDoktoraCommonCoursePackages.ts")],
  ["./isletmeTezliCoursePackages", path.join(rootDir, "lib", "data", "isletmeTezliCoursePackages.ts")],
  ["./isletmeCommonCoursePackages", path.join(rootDir, "lib", "data", "isletmeCommonCoursePackages.ts")],
  ["./isletmeDoktoraCoursePackages", path.join(rootDir, "lib", "data", "isletmeDoktoraCoursePackages.ts")],
  ["./isletmeDoktoraCommonCoursePackages", path.join(rootDir, "lib", "data", "isletmeDoktoraCommonCoursePackages.ts")],
  ["./kimyaTezliCoursePackages", path.join(rootDir, "lib", "data", "kimyaTezliCoursePackages.ts")],
  ["./kimyaCommonCoursePackages", path.join(rootDir, "lib", "data", "kimyaCommonCoursePackages.ts")],
  ["./kimyaDoktoraCoursePackages", path.join(rootDir, "lib", "data", "kimyaDoktoraCoursePackages.ts")],
  ["./kimyaDoktoraCommonCoursePackages", path.join(rootDir, "lib", "data", "kimyaDoktoraCommonCoursePackages.ts")],
  ["./makineMuhendisligiDoktoraCoursePackages", path.join(rootDir, "lib", "data", "makineMuhendisligiDoktoraCoursePackages.ts")],
  ["./makineMuhendisligiDoktoraCommonCoursePackages", path.join(rootDir, "lib", "data", "makineMuhendisligiDoktoraCommonCoursePackages.ts")],
  ["./matematikTezliCoursePackages", path.join(rootDir, "lib", "data", "matematikTezliCoursePackages.ts")],
  ["./matematikCommonCoursePackages", path.join(rootDir, "lib", "data", "matematikCommonCoursePackages.ts")],
  ["./muhasebeFinansmanTezliCoursePackages", path.join(rootDir, "lib", "data", "muhasebeFinansmanTezliCoursePackages.ts")],
  ["./muhasebeFinansmanCommonCoursePackages", path.join(rootDir, "lib", "data", "muhasebeFinansmanCommonCoursePackages.ts")],
  ["./organikTarimIsletmeciligiTezliCoursePackages", path.join(rootDir, "lib", "data", "organikTarimIsletmeciligiTezliCoursePackages.ts")],
  ["./organikTarimIsletmeciligiCommonCoursePackages", path.join(rootDir, "lib", "data", "organikTarimIsletmeciligiCommonCoursePackages.ts")],
  ["./resimTezliCoursePackages", path.join(rootDir, "lib", "data", "resimTezliCoursePackages.ts")],
  ["./resimCommonCoursePackages", path.join(rootDir, "lib", "data", "resimCommonCoursePackages.ts")],
  ["./siyasetKamuYonetimiTezliCoursePackages", path.join(rootDir, "lib", "data", "siyasetKamuYonetimiTezliCoursePackages.ts")],
  ["./siyasetKamuYonetimiCommonCoursePackages", path.join(rootDir, "lib", "data", "siyasetKamuYonetimiCommonCoursePackages.ts")],
  ["./siyasetKamuYonetimiDoktoraCoursePackages", path.join(rootDir, "lib", "data", "siyasetKamuYonetimiDoktoraCoursePackages.ts")],
  ["./siyasetKamuYonetimiDoktoraCommonCoursePackages", path.join(rootDir, "lib", "data", "siyasetKamuYonetimiDoktoraCommonCoursePackages.ts")],
  ["./tarihTezliCoursePackages", path.join(rootDir, "lib", "data", "tarihTezliCoursePackages.ts")],
  ["./tarihCommonCoursePackages", path.join(rootDir, "lib", "data", "tarihCommonCoursePackages.ts")],
  ["./temelIslamBilimleriTezliCoursePackages", path.join(rootDir, "lib", "data", "temelIslamBilimleriTezliCoursePackages.ts")],
  ["./temelIslamBilimleriCommonCoursePackages", path.join(rootDir, "lib", "data", "temelIslamBilimleriCommonCoursePackages.ts")],
  ["./turkDiliEdebiyatiTezliCoursePackages", path.join(rootDir, "lib", "data", "turkDiliEdebiyatiTezliCoursePackages.ts")],
  ["./turkDiliEdebiyatiCommonCoursePackages", path.join(rootDir, "lib", "data", "turkDiliEdebiyatiCommonCoursePackages.ts")],
  ["./turkDiliEdebiyatiDoktoraCoursePackages", path.join(rootDir, "lib", "data", "turkDiliEdebiyatiDoktoraCoursePackages.ts")],
  ["./turkDiliEdebiyatiDoktoraCommonCoursePackages", path.join(rootDir, "lib", "data", "turkDiliEdebiyatiDoktoraCommonCoursePackages.ts")],
  ["./ybsTezliCoursePackages", path.join(rootDir, "lib", "data", "ybsTezliCoursePackages.ts")],
  ["./ybsTezliCommonCoursePackages", path.join(rootDir, "lib", "data", "ybsTezliCommonCoursePackages.ts")],
  ["./yonetimOrganizasyonCoursePackages", path.join(rootDir, "lib", "data", "yonetimOrganizasyonCoursePackages.ts")],
  ["./yonetimOrganizasyonCommonCoursePackages", path.join(rootDir, "lib", "data", "yonetimOrganizasyonCommonCoursePackages.ts")],
  ["./ekoturizmCommonCoursePackages", path.join(rootDir, "lib", "data", "ekoturizmCommonCoursePackages.ts")],
]);
const moduleCache = new Map();

function transpile(filePath) {
  const source = readFileSync(filePath, "utf8");
  return ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
      importsNotUsedAsValues: ts.ImportsNotUsedAsValues.Remove,
    },
    fileName: filePath,
  }).outputText;
}

function loadModule(specifier) {
  const filePath = sourceFiles.get(specifier);
  if (!filePath) {
    throw new Error(`Unsupported seed export import: ${specifier}`);
  }
  if (moduleCache.has(filePath)) return moduleCache.get(filePath).exports;

  const module = { exports: {} };
  moduleCache.set(filePath, module);
  const dirname = path.dirname(filePath);
  const code = transpile(filePath);
  const context = {
    exports: module.exports,
    module,
    require: (nextSpecifier) => loadModule(nextSpecifier),
    console,
    __dirname: dirname,
    __filename: filePath,
  };
  vm.runInNewContext(code, context, { filename: filePath });
  return module.exports;
}

const { COURSE_PACKAGES } = loadModule("./coursePackages");
if (!Array.isArray(COURSE_PACKAGES)) {
  throw new Error("COURSE_PACKAGES export could not be resolved.");
}

mkdirSync(path.dirname(outputFile), { recursive: true });
writeFileSync(outputFile, `${JSON.stringify(COURSE_PACKAGES, null, 2)}\n`, "utf8");
console.log(`Exported ${COURSE_PACKAGES.length} course packages to ${path.relative(rootDir, outputFile)}.`);

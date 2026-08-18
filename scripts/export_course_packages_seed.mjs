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
  ["./arkeolojiTezliCoursePackages", path.join(rootDir, "lib", "data", "arkeolojiTezliCoursePackages.ts")],
  ["./arkeolojiCommonCoursePackages", path.join(rootDir, "lib", "data", "arkeolojiCommonCoursePackages.ts")],
  ["./arkeolojiMissingCoursePackages", path.join(rootDir, "lib", "data", "arkeolojiMissingCoursePackages.ts")],
  ["./bataryaTezliCoursePackages", path.join(rootDir, "lib", "data", "bataryaTezliCoursePackages.ts")],
  ["./bataryaCommonCoursePackages", path.join(rootDir, "lib", "data", "bataryaCommonCoursePackages.ts")],
  ["./bedenTezliCoursePackages", path.join(rootDir, "lib", "data", "bedenTezliCoursePackages.ts")],
  ["./bedenCommonCoursePackages", path.join(rootDir, "lib", "data", "bedenCommonCoursePackages.ts")],
  ["./biyolojiTezliCoursePackages", path.join(rootDir, "lib", "data", "biyolojiTezliCoursePackages.ts")],
  ["./biyolojiCommonCoursePackages", path.join(rootDir, "lib", "data", "biyolojiCommonCoursePackages.ts")],
  ["./ebelikTezliCoursePackages", path.join(rootDir, "lib", "data", "ebelikTezliCoursePackages.ts")],
  ["./ebelikCommonCoursePackages", path.join(rootDir, "lib", "data", "ebelikCommonCoursePackages.ts")],
  ["./ekoturizmTezliCoursePackages", path.join(rootDir, "lib", "data", "ekoturizmTezliCoursePackages.ts")],
  ["./elektrikElektronikTezliCoursePackages", path.join(rootDir, "lib", "data", "elektrikElektronikTezliCoursePackages.ts")],
  ["./elektrikElektronikCommonCoursePackages", path.join(rootDir, "lib", "data", "elektrikElektronikCommonCoursePackages.ts")],
  ["./enerjiSistemleriTezliCoursePackages", path.join(rootDir, "lib", "data", "enerjiSistemleriTezliCoursePackages.ts")],
  ["./enerjiSistemleriCommonCoursePackages", path.join(rootDir, "lib", "data", "enerjiSistemleriCommonCoursePackages.ts")],
  ["./felsefeDinTezliCoursePackages", path.join(rootDir, "lib", "data", "felsefeDinTezliCoursePackages.ts")],
  ["./felsefeDinCommonCoursePackages", path.join(rootDir, "lib", "data", "felsefeDinCommonCoursePackages.ts")],
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

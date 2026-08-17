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

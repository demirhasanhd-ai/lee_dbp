import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import { deflateRawSync, inflateRawSync } from "node:zlib";
import vm from "node:vm";

const source = readFileSync(new URL("../../server.mjs", import.meta.url), "utf8");
const declarations = new Map([...source.matchAll(/^(?:async )?function (\w+)\([^\n]*\) \{[\s\S]*?^\}/gm)].map((match) => [match[1], match[0]]));
const template = readFileSync(new URL("../../public/yeni-ders-sablonu.xlsx", import.meta.url));
export const newCourseImportScope = { department: "Matematik ABD", programName: "Matematik", level: "Tezli Yüksek Lisans" };
export const newCourseImportColumns = ["Ders Kodu", "Ders Adı", "Dönem", "Zorunlu / Seçmeli", "Teorik", "Uygulama", "Kredi", "AKTS", "Danışman T.C.", "Danışman Unvan", "Danışman İsim", "Danışman E-posta"];
export const newCourseImportRow = (code, fields = {}) => ({ "Ders Kodu": code, "Ders Adı": "REEL ANALİZ", "Dönem": "Bahar", "Zorunlu / Seçmeli": "Seçmeli", "Teorik": "3", "Uygulama": "0", "Kredi": "3", "AKTS": "6", ...fields });

export function newCourseImportFixture(t) {
  const db = new DatabaseSync(":memory:");
  t.after(() => db.close());
  db.exec(`CREATE TABLE courses (id INTEGER PRIMARY KEY, academic_year TEXT, program_code TEXT, department TEXT, program_name TEXT,
    level TEXT, code TEXT, name TEXT, type TEXT, credit REAL, ects REAL, theory REAL, practice REAL, term TEXT,
    status TEXT, instructor TEXT, instructor_tc_kimlik TEXT, instructor_email TEXT, instructor_title TEXT,
    instructor_source TEXT, instructor_assigned_at TEXT, source TEXT, package_json TEXT, created_at TEXT, updated_at TEXT);
    CREATE TABLE workflow_requests (id INTEGER PRIMARY KEY, course_id INTEGER, status TEXT);
    CREATE TABLE course_review_assignees (id INTEGER PRIMARY KEY, course_id INTEGER, name TEXT);
    INSERT INTO workflow_requests VALUES (1, 1, 'Komisyon Onayı Bekliyor');
    INSERT INTO course_review_assignees VALUES (1, 1, 'Reviewer');`);
  const oldPackage = JSON.stringify({ published: { package: { purpose: "Published content" } }, draft: { package: { purpose: "Latest saved edits" } } });
  db.prepare(`INSERT INTO courses (id, department, program_name, level, code, name, status, instructor, term, package_json, updated_at)
    VALUES (1, ?, ?, ?, 'MAT 864', 'Existing course', 'Komisyon Onayı Bekliyor', 'Existing teacher', 'Güz', ?, 'original-time')`)
    .run(newCourseImportScope.department, newCourseImportScope.programName, newCourseImportScope.level, oldPackage);
  const trap = () => assert.fail("new-course imports must not start statistics work");
  const context = vm.createContext({
    Buffer, deflateRawSync, inflateRawSync, db, URL, Response, console,
    newCourseTemplateHeaders: newCourseImportColumns,
    courseAssignmentTemplateHeaders: ["Ders Kodu", "Ders Adı", "Danışman T.C.", "Danışman Unvan", "Danışman İsim", "Danışman E-posta"],
    crc32Table: Array.from({ length: 256 }, (_, index) => {
      let value = index;
      for (let bit = 0; bit < 8; bit++) value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
      return value >>> 0;
    }),
    repairText: (value) => value,
    normalizeScope: (value = "") => String(value).toLocaleLowerCase("tr-TR").replaceAll("ı", "i").replaceAll("ü", "u").replaceAll("ş", "s").replaceAll("ğ", "g").replaceAll("ö", "o").replaceAll("ç", "c").trim(),
    sanitizeInstructorName: (value) => value.trim(),
    isMeaningfulInstructorName: (value) => value && !["Atama bekliyor", "-"] .includes(value),
    normalizeEmail: (value) => value.toLowerCase().trim(),
    normalizeTcKimlik: (value) => value.replace(/\D+/gu, ""),
    displayLevel: (value) => value, levelKey: (value) => value,
    courseCodeMatchesLevel: (code, level) => code.match(/\d/)?.[0] === ({ "Tezli Yüksek Lisans": "8", Doktora: "9", "Tezsiz Yüksek Lisans": "7" })[level],
    audit() {}, ensureDb() {}, stripBasePath: (pathname) => pathname.replace(/^\/dbp/u, ""),
    readJsonBody: (request) => request.json(), jsonResponse: (data, init) => Response.json(data, init),
    requireDbpSession: () => ({ session: { role: "enstitu_yoneticisi", username: "test-manager" } }),
    invalidateHomeStatsCache: trap, warmHomeStatsCache: trap, queueHomeStatsCacheRefresh: trap,
    queueQualitySnapshotRefresh: trap, refreshQualitySnapshot: trap, refreshHomeInstructorCount: trap, setTimeout: trap,
  });
  for (const name of ["decodeXmlText", "xmlAttributes", "findZipEndOfCentralDirectory", "readXlsxZipEntries", "xmlTextRuns", "parseXlsxSharedStrings", "worksheetColumnIndex", "resolveXlsxPath", "firstWorksheetPath", "parseXlsxWorksheetRows", "readFirstXlsxSheetRows", "normalizeExcelHeader", "readNewCourseWorkbook", "newCourseImportScope", "courseIdentityEdits", "buildNewCourseImportPreview", "applyNewCourseImport", "crc32", "zipEntryDate", "createZip", "xlsxColumnName", "xmlEscape", "createCourseAssignmentTemplateWorkbook", "readCourseAssignmentWorkbook", "handleDbpApi"]) {
    assert.ok(declarations.has(name), name);
    vm.runInContext(declarations.get(name), context);
  }
  const excel = (rows, headers = newCourseImportColumns) => {
    const entries = context.readXlsxZipEntries(template);
    const sheetPath = context.firstWorksheetPath(entries);
    const xmlRow = (values, index) => `<row r="${index + 1}">${values.map((value, col) => `<c r="${context.xlsxColumnName(col)}${index + 1}" t="inlineStr"><is><t>${context.xmlEscape(value)}</t></is></c>`).join("")}</row>`;
    const data = [headers, ...rows.map((record) => headers.map((column) => record[column] ?? ""))].map(xmlRow).join("");
    entries.set(sheetPath, Buffer.from(`<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>${data}</sheetData></worksheet>`));
    return context.createZip([...entries].map(([name, data]) => ({ name, data }))).toString("base64");
  };
  const request = (fileBase64, endpoint = "preview", extra = {}) => context.handleDbpApi(new Request(`http://localhost/dbp/api/dbp/course-create-import/${endpoint}`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...newCourseImportScope, fileBase64, ...extra }),
  }));
  return { context, db, excel, request };
}

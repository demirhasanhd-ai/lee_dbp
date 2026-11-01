import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { isProcessCourse } from "../lib/courseProcess.mjs";
import { ensureCourseProcessColumn, backfillCourseProcessFlags } from "../lib/courseProcessMigration.mjs";

test("legacy classification preserves department exceptions and respects both explicit choices", () => {
  for (const code of ["DAN9XX", "MMB909", "MMB917", "MMB91X", "MMB9XX", "HRM809", "YBS7XX"]) {
    assert.equal(isProcessCourse({ code }), true, code);
    assert.equal(isProcessCourse({ code, isProcessCourse: null }), true);
    assert.equal(isProcessCourse({ code, isProcessCourse: false }), false);
  }
  for (const department of ["Tarih ABD", "Türk Dili ve Edebiyatı ABD", "Beden Eğitimi ve Spor ABD"]) {
    assert.equal(isProcessCourse({ code: "BES801", department }), department !== "Beden Eğitimi ve Spor ABD");
  }
  assert.equal(isProcessCourse({ code: "MAT864", isProcessCourse: true }), true);
  assert.equal(isProcessCourse({ code: "MAT864" }), false);
  assert.equal(isProcessCourse({ code: "MAT864", isProcessCourse: null }), false);
});

test("old databases retain groups, canonical code aliases, saved choices and all unrelated fields after restart", (t) => {
  const directory = mkdtempSync(path.join(tmpdir(), "dbp-course-group-"));
  const filename = path.join(directory, "legacy.sqlite");
  let db = new DatabaseSync(filename);
  t.after(() => { if (db.isOpen) db.close(); rmSync(directory, { recursive: true, force: true }); });
  db.exec(`CREATE TABLE courses (id INTEGER PRIMARY KEY, code TEXT, department TEXT, term TEXT, status TEXT, package_json TEXT, updated_at TEXT);
    INSERT INTO courses VALUES
      (1, 'MMB909', 'Makine Mühendisliği ABD', 'Bahar', 'Yayımlandı', '{"published":"saved"}', 'old-time'),
      (2, 'MMB921', 'Makine Mühendisliği ABD', 'Güz', 'Taslak', '{"draft":"saved"}', 'old-time'),
      (3, 'BES801', 'Tarih ABD', 'Güz ve Bahar', 'Public', '{}', 'old-time'),
      (4, 'BES801', 'Beden Eğitimi ve Spor ABD', 'Güz', 'Public', '{}', 'old-time'),
      (5, 'MMB951', 'Makine Mühendisliği ABD', 'Bahar', 'Public', '{}', 'old-time')`);
  const originals = db.prepare("SELECT * FROM courses ORDER BY id").all();
  const normalize = (row) => ({ code: row.code === "MMB951" ? "MMB91X" : row.code, department: row.department });
  ensureCourseProcessColumn(db);
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM courses WHERE is_process_course IS NULL").get().n, 5);
  assert.equal(backfillCourseProcessFlags(db, normalize), 5);
  const migrated = db.prepare("SELECT * FROM courses ORDER BY id").all();
  assert.deepEqual(migrated.map((row) => row.is_process_course), [1, 0, 1, 0, 1]);
  assert.deepEqual(migrated.map((row) => Object.fromEntries(Object.entries(row).filter(([key]) => key !== "is_process_course"))), originals.map((row) => ({ ...row })));
  db.exec("UPDATE courses SET is_process_course = 0 WHERE id = 1; UPDATE courses SET is_process_course = 1 WHERE id = 2");
  db.close();
  db = new DatabaseSync(filename);
  ensureCourseProcessColumn(db);
  assert.equal(backfillCourseProcessFlags(db, normalize), 0);
  assert.deepEqual(db.prepare("SELECT is_process_course FROM courses ORDER BY id").all().map((row) => row.is_process_course), [0, 1, 1, 0, 1]);
  db.exec("INSERT INTO courses(id, code, department) VALUES (6, 'MMB9XX', 'Makine Mühendisliği ABD')");
  assert.equal(backfillCourseProcessFlags(db, normalize), 1);
  assert.equal(db.prepare("SELECT is_process_course FROM courses WHERE id = 6").get().is_process_course, 1);
});

test("a failed legacy migration rolls back every group and can safely retry", (t) => {
  const db = new DatabaseSync(":memory:");
  t.after(() => db.close());
  db.exec("CREATE TABLE courses (id INTEGER PRIMARY KEY, code TEXT); INSERT INTO courses VALUES (1, 'MMB909'), (2, 'MMB917')");
  ensureCourseProcessColumn(db);
  assert.throws(() => backfillCourseProcessFlags(db, (row) => {
    if (row.id === 2) throw new Error("normalization failed");
    return row;
  }), /normalization failed/);
  assert.equal(db.isTransaction, false);
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM courses WHERE is_process_course IS NULL").get().n, 2);
  assert.equal(backfillCourseProcessFlags(db, (row) => row), 2);
});

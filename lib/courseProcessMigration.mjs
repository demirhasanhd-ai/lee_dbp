import { isProcessCourse } from "./courseProcess.mjs";

export function ensureCourseProcessColumn(db) {
  if (!db.prepare("PRAGMA table_info(courses)").all().some((column) => column.name === "is_process_course")) {
    // NULL identifies legacy records; a default of 0 would lose their grouping.
    db.exec("ALTER TABLE courses ADD COLUMN is_process_course INTEGER CHECK (is_process_course IN (0, 1))");
  }
}

export function backfillCourseProcessFlags(db, normalizeCourse) {
  db.exec("BEGIN IMMEDIATE");
  try {
    const rows = db.prepare("SELECT * FROM courses WHERE is_process_course IS NULL").all();
    const update = db.prepare("UPDATE courses SET is_process_course = ? WHERE id = ? AND is_process_course IS NULL");
    for (const row of rows) {
      // Use the same canonical codes and department names as the public list.
      const course = normalizeCourse(row);
      update.run(Number(isProcessCourse(course || { code: row.code, department: row.department })), row.id);
    }
    db.exec("COMMIT");
    return rows.length;
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

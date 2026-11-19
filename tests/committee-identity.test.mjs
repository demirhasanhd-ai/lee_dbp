import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";
import vm from "node:vm";

const source = readFileSync(new URL("../server.mjs", import.meta.url), "utf8");
const names = new Set([
  "repairText", "normalizeScope", "normalizePerson", "normalizeTcKimlik", "normalizeEmail",
  "memberIdentityKeys", "sessionMatchesReviewAssignee", "committeeMembershipsForSession",
  "courseReviewAssignmentMembershipsForSession", "committeeDepartmentName",
  "committeeMembersForDepartment", "isCommitteeMemberForCourse", "canManageCommittee",
  "departmentScopeNames", "departmentScopeIncludes",
]);
const declarations = [...source.matchAll(/^function (\w+)\([^\n]*\) \{[\s\S]*?^\}/gm)]
  .filter((match) => names.has(match[1])).map(([declaration]) => declaration).join("\n");
const tcKimlik = "10000000001";
const publicInstructorId = createHash("md5").update(`${tcKimlik}:dbp-instructor`).digest("hex");
const department = "Makine Mühendisliği ABD";

function fixture(t) {
  const db = new DatabaseSync(":memory:");
  t.after(() => db.close());
  for (const table of ["committee_members", "course_review_assignees", "programs"]) {
    const schema = source.match(new RegExp(`CREATE TABLE IF NOT EXISTS ${table} \\([\\s\\S]*?\\n    \\);`));
    assert.ok(schema, table);
    db.exec(schema[0]);
  }
  let assignees = [];
  const context = vm.createContext({ db, createHash, courseReviewAssigneesForTarget: () => assignees });
  vm.runInContext(source.match(/const textRepairPairs = \[[\s\S]*?\r?\n\];/)[0] + "\n" + declarations, context);
  const add = (fields = {}, frozen = false) => {
    const row = {
      member_key: "ars ornek akademisyen", member_username: publicInstructorId, member_tc_kimlik: "",
      member_name: "Arş. Gör. Dr. Örnek Akademisyen", member_email: "ornek.akademisyen@example.edu.tr",
      ...fields,
    };
    const columns = ["department_scope", "department", "program_name", ...Object.keys(row)];
    const values = [context.normalizeScope(department), department, "Makine Mühendisliği", ...Object.values(row)];
    if (frozen) {
      columns.push("target", "stage", "assigned_at", "active");
      values.push("test-course", "committee", "now", 1);
    } else {
      columns.push("created_at");
      values.push("now");
    }
    db.prepare(`INSERT INTO ${frozen ? "course_review_assignees" : "committee_members"} (${columns.join(",")}) VALUES (${values.map(() => "?").join(",")})`).run(...values);
    assignees = frozen ? [{
      memberKey: row.member_key, username: row.member_username, tcKimlik: row.member_tc_kimlik,
      name: row.member_name, email: row.member_email,
    }] : [];
  };
  const memberships = (session) => Array.from(context.committeeMembershipsForSession(session), (row) => row.department);
  return { db, context, add, memberships };
}

test("public instructor ID derived from login T.C. recognizes both membership and frozen review assignments", (t) => {
  for (const frozen of [false, true]) {
    const { context, add, memberships } = fixture(t);
    add({ member_name: "Farklı Gösterilen İsim", member_email: "" }, frozen);
    const session = { username: "login-name", name: "Oturum İsmi", tcKimlik, role: "akademisyen" };
    assert.deepEqual(memberships(session), [department]);
    assert.equal(context.isCommitteeMemberForCourse(session, { department }), true);
    assert.deepEqual(memberships({ ...session, tcKimlik: "10000000002" }), []);
    assert.equal(context.isCommitteeMemberForCourse({ ...session, tcKimlik: "10000000002" }, { department }), false);
  }
});

test("email-only identities preserve punctuation and tolerate surrounding whitespace and case", (t) => {
  for (const frozen of [false, true]) {
    const { context, add, memberships } = fixture(t);
    add({ member_name: "Kayıt İsmi", member_email: "  ornek.akademisyen@example.edu.tr  " }, frozen);
    const session = { username: "login", name: "Oturum İsmi", email: "ORNEK.AKADEMISYEN@EXAMPLE.EDU.TR" };
    assert.deepEqual(memberships(session), [department]);
    assert.equal(context.isCommitteeMemberForCourse(session, { department }), true);
    const other = { ...session, email: "ornek@akademisyen.example.edu.tr" };
    assert.deepEqual(memberships(other), []);
    assert.equal(context.isCommitteeMemberForCourse(other, { department }), false);
  }
});

test("research assistant title is ignored for identity while displayed member name stays intact", (t) => {
  for (const title of ["Arş. Gör. Dr.", "Dr. Arş. Gör."]) {
    const { context, add, memberships } = fixture(t);
    const name = `${title} Örnek Akademisyen`;
    add({ member_name: name, member_username: "", member_email: "" });
    assert.deepEqual(memberships({ name: "Örnek Akademisyen" }), [department]);
    assert.equal(context.committeeMembersForDepartment(department).at(-1).name, name);
  }
});

test("existing username and name identities remain recognized and raw T.C. fields are supported", (t) => {
  for (const frozen of [false, true]) {
    for (const [fields, session] of [
      [{ member_username: "reviewer", member_name: "Kayıt İsmi", member_email: "" }, { username: "reviewer" }],
      [{ member_username: "", member_name: "Prof. Dr. Mevcut Üye", member_email: "" }, { name: "Mevcut Üye" }],
      [{ member_username: tcKimlik, member_email: "" }, { tcKimlik }],
      [{ member_username: "", member_tc_kimlik: tcKimlik, member_email: "" }, { tcKimlik }],
    ]) {
      const { context, add, memberships } = fixture(t);
      add(fields, frozen);
      assert.deepEqual(memberships(session), [department]);
      assert.equal(context.isCommitteeMemberForCourse(session, { department }), true);
    }
  }
});

test("committee membership does not change the selected role or grant chair powers to academics", (t) => {
  const { context, add, memberships } = fixture(t);
  add();
  for (const role of ["akademisyen", "abd_asd_baskani", "abd_sekreteri", "enstitu_yoneticisi", "admin"]) {
    const session = Object.freeze({ username: "multi-role-user", name: "Oturum İsmi", tcKimlik, role, department });
    assert.deepEqual(memberships(session), [department]);
    assert.equal(context.canManageCommittee(session, department), ["admin", "abd_asd_baskani"].includes(role));
    assert.equal(session.role, role);
  }
  const unrelated = { username: "other-user", name: "Başka Kişi", tcKimlik: "10000000002", email: "other@example.edu.tr", role: "akademisyen", department };
  assert.deepEqual(memberships(unrelated), []);
  assert.equal(context.isCommitteeMemberForCourse(unrelated, { department }), false);
  assert.deepEqual(memberships({}), []);
});

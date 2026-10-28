import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import test from "node:test";

const source = readFileSync(new URL("../server.mjs", import.meta.url), "utf8");
const declaration = source.match(/^function modulesForRole\([^\n]*\) \{[\s\S]*?^\}/m)[0];

test("legacy role-screen grants open the permission matrix once without rewriting stored permissions", () => {
  const access = {
    admin: ["user_roles", "permission_matrix", "audit_logs", "database_admin"],
    abd_asd_baskani: ["user_roles", "my_courses", "review_queue"],
    akademisyen: ["my_courses", "audit_logs", "thesis_evaluations", "thesis_awards"],
    enstitu_yoneticisi: ["my_courses", "thesis_awards"],
  };
  const original = structuredClone(access);
  const context = vm.createContext({ roleAccessMap: () => access });
  vm.runInContext(declaration, context);
  assert.deepEqual(Array.from(context.modulesForRole("admin")), ["permission_matrix", "audit_logs", "database_admin"]);
  assert.deepEqual(Array.from(context.modulesForRole("abd_asd_baskani")), ["permission_matrix", "my_courses", "review_queue"]);
  assert.deepEqual(Array.from(context.modulesForRole("akademisyen")), ["my_courses"], "existing restrictions must still apply");
  assert.deepEqual(Array.from(context.modulesForRole("enstitu_yoneticisi")), ["my_courses", "thesis_awards"]);
  assert.deepEqual(Array.from(context.modulesForRole("unknown")), []);
  assert.deepEqual(access, original);
});

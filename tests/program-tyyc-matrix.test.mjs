import assert from "node:assert/strict";
import test from "node:test";
import { programTyycGroups, programTyycValidationMessage } from "../lib/programTyycMatrix.mjs";

test("new profiles require every level-specific TYYÇ row and accept 0 as an explicit selection", () => {
  for (const level of ["Tezli Yüksek Lisans", "Tezsiz Yüksek Lisans", "Doktora"]) {
    const profile = { level, outcomes: ["Çıktı 1", "Çıktı 2"], tyycRows: [] };
    assert.match(programTyycValidationMessage(profile), /B1: PÇ1, PÇ2/);
    profile.tyycRows = programTyycGroups(level).flatMap((group) => group.items.map((item) => ({ ...item, values: [0, 3] })));
    assert.equal(programTyycValidationMessage(profile), "");
    const missingRow = profile.tyycRows.pop();
    assert.ok(programTyycValidationMessage(profile).includes(`${missingRow.code}: PÇ1, PÇ2`));
  }
});

test("null, sparse and short cells remain missing; invalid scores and duplicate rows are rejected", () => {
  const savedRows = [{ code: "T1", title: "Yeterlilik", values: [1, 2, 3] }];
  const profile = { level: "Doktora", outcomes: ["1", "2", "3"], tyycRows: [] };
  for (const values of [[0], [0, null, null], [0, , ], [0, "", undefined]]) {
    profile.tyycRows = [{ ...savedRows[0], values }];
    assert.match(programTyycValidationMessage(profile, savedRows), /T1: PÇ2, PÇ3 için ilişki düzeyi seçilmemiş/);
  }
  for (const invalid of [-1, 4, 1.5, "0", false, NaN, Infinity]) {
    profile.tyycRows = [{ ...savedRows[0], values: [0, invalid, 3] }];
    assert.match(programTyycValidationMessage(profile, savedRows), /T1: PÇ2 için 0–3/);
  }
  profile.tyycRows = [savedRows[0], savedRows[0]];
  assert.match(programTyycValidationMessage(profile, savedRows), /birden fazla/);
  profile.tyycRows = [{ ...savedRows[0], values: [0, 1, 2, 3] }];
  assert.match(programTyycValidationMessage(profile, savedRows), /fazla sütun/);
  assert.ok(programTyycValidationMessage({ ...profile, outcomes: [] }, savedRows));
});

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";
import { renderToStaticMarkup } from "react-dom/server";
import * as rules from "../lib/quality/outcomeRules.mjs";
import { evaluateOutcomeText, measurableOutcomeVerbs, vagueOutcomeVerbs } from "../lib/quality/dbpQualityRules.ts";

const evaluate = (text) => rules.evaluateOutcomeQuality(text, "course");
const valid = "Alanındaki temel kavramları örneklerle açıklar.";

test("guide verbs across all three domains, old verbs and standard spellings are accepted", () => {
  for (const verb of [
    "tanımlar", "hesaplar", "modeller", "çözer", "örnek verir", "çalıştırır",
    "örüntü çıkarır", "yazar", "özetler", "test eder", "sentezler",
    "işbirliği yapar", "iş birliği yapar", "gözlemler", "liderlik yapar",
    "ölçer", "ayırt eder", "fark eder", "farkına varır", "sentez yapar",
    "simule eder", "simüle eder", "pozisyonalır", "pozisyon alır",
    "fomüle eder", "formüle eder", "raporlar", "yürütür", "sunar",
  ]) assert.equal(evaluate(`Öğrenci bu çalışma sonunda ${verb}.`).status, "good", verb);
  assert.equal(evaluate("Üslü sayılar, köklü sayılar, logaritma ve mutlak değer gibi temel matematik konularına ait problemleri çözer.").status, "good");
  assert.equal(measurableOutcomeVerbs, rules.measurableOutcomeVerbs);
  assert.equal(vagueOutcomeVerbs, rules.vagueOutcomeVerbs);
  assert.equal(vagueOutcomeVerbs.includes("fark eder"), false);
});

test("unlisted verbs remain invalid and Turkish word boundaries and whitespace are respected", () => {
  for (const text of ["Alanındaki yeni sorunları kavramsallaştırır.", "Alanındaki temel ilkeleri açıklayabilir."]) {
    assert.ok(rules.evaluateOutcomeRules(text).some(({ code }) => code === "missing-verb"), text);
  }
  assert.equal(evaluate("TEMEL İSTATİSTİK YÖNTEMLERİNİ ANALİZ  EDER.").status, "good");
  assert.equal(evaluate("Alanındaki bilinmeyen temel sorunları çözer.").status, "good");
});

test("vague and instructor-centered phrases are named individually", () => {
  const result = evaluate("Ders kapsamında temel ilkeleri bilir, öğrenir ve açıklar.");
  assert.equal(result.status, "error");
  assert.ok(result.messages.some((message) => message.includes("“bilir”") && message.includes("“öğrenir”")));
  assert.ok(result.messages.some((message) => message.includes("“ders kapsamında”")));
  assert.deepEqual(evaluateOutcomeText("Ders kapsamında temel ilkeleri bilir, öğrenir ve açıklar.").map(({ message }) => message), result.messages);
});

test("the single-action rule counts verb occurrences, not commas, ve or ile", () => {
  for (const text of [
    "Temel ilke, kural, yöntem ve araçları açıklar.",
    "Temel ilkeleri örnekler ile açıklar.",
  ]) assert.equal(evaluate(text).status, "good", text);
  for (const text of [
    "Bu dersin temel ilkelerini açıklar ve uygular.",
    "Bu dersin temel ilkelerini açıklar, uygular.",
    "İlkeleri açıklar; yöntemleri örneklerle açıklar.",
  ]) assert.ok(rules.evaluateOutcomeRules(text).some(({ code, message }) => code === "multiple-actions" && message.includes("2 eylem")), text);
  const messages = evaluate("Bu dersin temel ilkelerini açıklar ve uygular.").messages.join(" ");
  assert.match(messages, /“açıklar”.*“uygular”/u);
});

test("compound verbs count once, but separate actions on either side still count", () => {
  for (const verb of ["problem çözer", "sentez yapar", "bağlantı kurar", "yeniden düzenler", "yeniden yazar", "hedef belirler", "taslak oluşturur", "bağımsız uygular", "hazırlık yapar"]) {
    assert.equal(evaluate(`Öğrenci bu çalışma sonunda ${verb}.`).status, "good", verb);
  }
  assert.match(evaluate("Öğrenci kurar ve bağlantı kurar.").messages.join(" "), /2 eylem/u);
});

test("length and empty rules explain actual counts and limits", () => {
  assert.match(evaluate("Temel ilkeleri açıklar.").messages.join(" "), /3 kelimeden.*en az 4/u);
  const long = `Alanındaki ${"önemli ".repeat(25)}temel ilkeleri açıklar.`;
  assert.ok(evaluate(long).messages.some((message) => message.includes(`${long.length} karakter`) && message.includes("180 karakter")));
  assert.equal(evaluate(" \n ").status, "empty");
  assert.match(evaluate("").messages[0], /boş bırakılamaz.*doldurun.*kaldırın/u);
});

test("submission checks the sixth, seventh and every subsequent outcome, including blanks", () => {
  const outcomes = Array(7).fill(valid);
  assert.deepEqual(rules.courseOutcomePublishIssues(outcomes), []);
  outcomes[5] = "Alanındaki temel ilkeleri bilir.";
  outcomes[6] = "";
  const issues = rules.courseOutcomePublishIssues(outcomes);
  assert.equal(issues.length, 2);
  assert.match(issues[0], /^ÖÇ6:.*“bilir”/u);
  assert.match(issues[1], /^ÖÇ7:.*boş bırakılamaz/u);
  assert.match(rules.courseOutcomePublishIssues(Array(4).fill(valid))[0], /En az 5.*mevcut: 4/u);
  assert.deepEqual(rules.courseOutcomePublishIssues(Array(5).fill(valid)), []);
});

test("outcome hints render every reason and the expandable accepted list under the field", () => {
  const source = readFileSync(new URL("../app/panel/outcomeQuality.tsx", import.meta.url), "utf8");
  const compiledModule = { exports: {} };
  const require = createRequire(import.meta.url);
  vm.runInNewContext(ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  }).outputText, { module: compiledModule, exports: compiledModule.exports, require: (name) => name.endsWith("outcomeRules.mjs") ? rules : require(name) });
  const text = "Ders kapsamında bilir.";
  const html = renderToStaticMarkup(compiledModule.exports.OutcomeQualityHint({ text, kind: "course" }));
  for (const message of evaluate(text).messages) assert.ok(html.includes(message), message);
  assert.match(html, /<details class="outcome-accepted-verbs">/u);
  assert.match(html, /Kabul edilen fiiller/u);
  assert.match(html, /fark eder/u);
  assert.equal(html.includes("Gözden geçirilmeli"), false);
});

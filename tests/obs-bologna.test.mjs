import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import { createObsSearchService, normalizeObsUrl, obsCourseMatch, obsInstructorMatches, parseObsCourseDraft, parseObsCurriculumPage, parseObsPrograms, suggestObsProgram } from "../lib/obsBologna.mjs";

const base = "https://obs.osmaniye.edu.tr/oibs/bologna/";
const programs = '<a href="#x04">Lisansüstü Eğitim Enstitüsü</a><div id="x04"><a href="index.aspx?curUnit=04&curSunit=5782">Makine Mühendisliği Tezli Yüksek Lisans</a><a href="index.aspx?curUnit=04&curSunit=5783">Makine Mühendisliği Tezsiz Yüksek Lisans</a></div>';
const courseRow = (id, code = "MMB 809", name = "Bilimsel Araştırma Yöntemleri") => `<tr><td><a id="grdBolognaDersler_btnDersAyrinti_1" onclick="return prolizOpenCourseDetails(${id});" href="javascript:__doPostBack('grdBolognaDersler$ctl05$btnDersAyrinti','')">i</a></td><td><a id="grdBolognaDersler_btnDersKod_1">${code}</a></td><td><span id="grdBolognaDersler_lblDersAd_1">${name}</span></td></tr>`;
const curriculum = (selected = "2026", id = "601") => `<input type="hidden" name="__VIEWSTATE" value="state-${selected}"><input type="hidden" name="__EVENTVALIDATION" value="valid-${selected}"><select name="cmbYillar">${["2026", "2025"].map((year) => `<option value="${year}" ${selected === year ? "selected" : ""}>${year} Müfredatı</option>`).join("")}</select><table id="grdBolognaDersler">${courseRow(id)}</table>`;
const table = (rows) => `<table>${rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("")}</table>`;
const courseDetail = (name = "Bilimsel Araştırma Yöntemleri", instructors = "Dr. Öğr. Üyesi UĞUR ACAR") => [
  table([["Yarıyıl", "Kodu", "Adı", "T+U+L", "Kredi", "AKTS", "Son Güncelleme Tarihi"], ["1", "MMB809", name, "3+0+0", "3", "6", "29.10.2026"]]),
  table([["Dersin Dili", "Türkçe"], ["Bölümü / Programı", "Makine Mühendisliği"], ["Dersin Amacı", "Araştırma etiği"], ["Dersin İçeriği", "Yöntem ve yayın"], ["Dersi Verenler", instructors], ["Kaynaklar", "Kaynak bir"]]),
  table([["Sıra No", "Açıklama"], ["Bilgi", ""], ["1", "Birinci çıktı"]]),
  table([["Sıra No", "Açıklama"], ["Beceri", ""], ["1", "İkinci çıktı"]]),
  table([["Hafta", "Konu", "Ön Hazırlık", "Dokümanlar"], ["1", "Etik", "Okuma", "Belge"]]),
  table([["Yarıyıl Çalışmaları", "Sayısı", "Katkı"], ["Ara Sınav", "1", "%40"], ["Final", "1", "%60"], ["Toplam", "2", "%100"]]),
  table([["İş Yükü", "Sayısı", "Süre"], ["Ders Süresi", "14", "3"], ["Toplam İş Yükü", "", "42"]]),
  table([["", "P1", "P2"], ["Tüm", "4", "5"], ["Ö1", "2", "3"], ["Ö2", "4", "5"]]),
].join("");

function fixture({ missing = false, failOld = false, legacy = false } = {}) {
  const requests = [];
  const service = createObsSearchService({ requestDelayMs: 0, fetcher: async (input, init = {}) => {
    const url = new URL(input); requests.push({ url, init });
    assert.equal(url.origin, new URL(base).origin);
    if (url.pathname.endsWith("unitSelection.aspx")) return new Response(programs);
    if (url.pathname.endsWith("progCourses.aspx")) {
      if (init.method === "POST") {
        const form = new URLSearchParams(init.body);
        assert.match(init.headers.Cookie || "", /session=fixture/);
        if (form.get("__EVENTTARGET") === "cmbYillar") {
          assert.equal(form.get("__EVENTVALIDATION"), "valid-2026");
          assert.equal(form.get("__VIEWSTATE"), "state-2026");
          assert.equal(form.get("cmbYillar"), "2025");
          return failOld ? new Response("unavailable", { status: 503 }) : new Response(curriculum("2025", "602"));
        }
        return new Response(null, { status: 302, headers: { Location: "progCourseDetails.aspx?curCourse=601&lang=tr" } });
      }
      let html = curriculum();
      if (legacy) html = html.replaceAll(/ onclick="[^"]*"/g, "");
      return new Response(html, { headers: { "Set-Cookie": "session=fixture; Path=/" } });
    }
    if (url.pathname.endsWith("progCourseDetails.aspx")) return new Response(missing && url.searchParams.get("curCourse") === "602" ? table([["Kayıt Yok..."]]) : courseDetail());
    throw new Error(`Unexpected request ${url}`);
  } });
  const target = { programId: "5782", educationLevel: "yls", code: "MMB809", name: "Bilimsel Araştırma Yöntemleri", instructorName: "Uğur Acar" };
  const done = async (job) => {
    for (let i = 0; i < 200; i++) {
      const state = service.get(job.id, "teacher");
      if (state.status !== "running") return state;
      await new Promise((resolve) => setTimeout(resolve, 2));
    }
    throw new Error("Search did not complete");
  };
  return { service, target, requests, done };
}

test("discovers scoped programs without confusing thesis and non-thesis degrees", () => {
  const list = parseObsPrograms(programs);
  assert.equal(list[0].faculty, "Lisansüstü Eğitim Enstitüsü");
  assert.equal(suggestObsProgram(list, { programName: "Makine Mühendisliği", level: "Tezli Yüksek Lisans" }), "5782");
  assert.equal(suggestObsProgram(list, { department: "Makine Mühendisliği ABD", level: "Tezsiz Yüksek Lisans" }), "5783");
  assert.equal(suggestObsProgram(list, { programName: "Bilinmeyen", level: "Doktora" }), "");
});

test("reads JavaScript detail identities and all outcomes, including split category tables", () => {
  const parsed = parseObsCurriculumPage(curriculum());
  assert.equal(parsed.courses[0].sourceUrl, `${base}progCourseDetails.aspx?curCourse=601&lang=tr`);
  assert.equal(parsed.hidden.__VIEWSTATE, "state-2026");
  const draft = parseObsCourseDraft(courseDetail(), `${base}progCourseDetails.aspx?curCourse=601`);
  assert.deepEqual(draft.outcomes, ["Birinci çıktı", "İkinci çıktı"]);
  assert.equal(draft.assessments[1].name, "Yarıyıl Sonu Sınavı");
  assert.equal(draft.totalWorkload, 42);
  assert.equal(draft.weeklyTopics[1], "Etik\nÖn Hazırlık: Okuma\nDokümanlar: Belge");
  assert.deepEqual(draft.contributionMatrix, [{ P1: 2, P2: 3 }, { P1: 4, P2: 5 }]);
});

test("code normalization and instructor ranking preserve course-series distinctions", () => {
  assert.equal(obsCourseMatch({ code: "MMB 809" }, { code: "MMB809" }).score, 100);
  assert.equal(obsCourseMatch({ code: "OLD", name: "Matematik II" }, { code: "NEW", name: "Matematik I" }), null);
  assert.equal(obsInstructorMatches("Prof. Dr. AYKUT EMNİYET Dr. Öğr. Üyesi UĞUR ACAR", "Dr. Öğr. Üyesi Uğur Acar"), true);
  assert.equal(obsInstructorMatches("Uğur Acarlı", "Uğur Acar"), false);
  assert.equal(obsInstructorMatches("Uğur Acar", "Acar"), false);
});

test("only canonical public OBS detail URLs are accepted", () => {
  for (const url of ["https://evil.test/oibs/bologna/progCourseDetails.aspx?curCourse=1", `${base}progCourseDetails.aspx?curCourse=abc`, `https://user:pass@obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=1`, `https://obs.osmaniye.edu.tr:444/oibs/bologna/progCourseDetails.aspx?curCourse=1`, `file://${base}progCourseDetails.aspx?curCourse=1`]) assert.throws(() => normalizeObsUrl(url));
  assert.equal(normalizeObsUrl(`${base}progCourseDetails.aspx?curCourse=123&lang=en&extra=foo#bar`).href, `${base}progCourseDetails.aspx?curCourse=123&lang=tr`);
});

test("search visits old curricula with viewstate and cookies, keeps separate candidates and caches repeat scans", async () => {
  const { service, target, requests, done } = fixture();
  const result = await done(await service.start(target, "teacher"));
  assert.equal(result.status, "completed"); assert.deepEqual(result.warnings, []);
  assert.equal(result.candidates.length, 2);
  assert.deepEqual(result.candidates.map((item) => item.curriculum.year), [2026, 2025]);
  assert.ok(result.candidates.every((item) => item.instructorMatch && item.summary.outcomes === 2));
  assert.notEqual(result.candidates[0].id, result.candidates[1].id);
  const count = requests.length;
  await done(await service.start(target, "teacher")); assert.equal(requests.length, count);
  await done(await service.start({ ...target, refresh: true }, "teacher")); assert.ok(requests.length > count);
});

test("missing packages and failed curriculum selections produce visible partial results", async () => {
  const missing = fixture({ missing: true });
  const result = await missing.done(await missing.service.start(missing.target, "teacher"));
  assert.equal(result.candidates.length, 1); assert.match(result.warnings[0], /2025.*kayıt bulunamadı/);
  const partial = fixture({ failOld: true });
  const state = await partial.done(await partial.service.start(partial.target, "teacher"));
  assert.equal(state.status, "completed"); assert.equal(state.candidates.length, 1); assert.match(state.warnings[0], /2025.*503/);
});

test("legacy postback redirects still resolve details, and jobs are private and cancellable", async () => {
  const f = fixture({ legacy: true });
  const state = await f.done(await f.service.start(f.target, "teacher"));
  assert.equal(state.status, "completed"); assert.equal(state.candidates.length, 2);
  assert.equal(f.service.get(state.id, "another-teacher"), null);
  assert.equal(f.service.cancel(state.id, "another-teacher"), null);
  const job = await f.service.start({ ...f.target, refresh: true }, "teacher");
  assert.equal(f.service.cancel(job.id, "teacher").status, "cancelled");
  await new Promise((resolve) => setTimeout(resolve, 10));
  assert.equal(f.service.get(job.id, "teacher").status, "cancelled");
});

test("API requires a session, scopes job access and uses the authenticated instructor name", async () => {
  const source = readFileSync(new URL("../server.mjs", import.meta.url), "utf8");
  const handler = source.match(/^async function handleDbpApi\(request\) \{[\s\S]*?^\}/m)?.[0];
  assert.ok(handler);
  let auth = { error: new Response("Unauthorized", { status: 401 }) }; let target; let owner;
  const context = vm.createContext({ URL, Response, ensureDb: async () => {}, stripBasePath: (value) => value,
    requireDbpSession: () => auth, jsonResponse: (value, options) => Response.json(value, options),
    readJsonBody: (request) => request.json(), audit() {},
    obsSearchService: { start: async (value, user) => { target = value; owner = user; return { id: "job" }; }, get: (_id, user) => user === "teacher" ? { id: "job" } : null },
  });
  vm.runInContext(handler, context);
  const request = (path, options) => context.handleDbpApi(new Request(`http://local/api/dbp/${path}`, options));
  assert.equal((await request("obs-course-search")).status, 401);
  auth = { session: { username: "teacher", name: "Doğrulanmış Hoca" } };
  assert.equal((await request("obs-course-search", { method: "POST", body: JSON.stringify({ code: "MMB809", instructorName: "Spoofed Name" }) })).status, 202);
  assert.equal(target.instructorName, "Doğrulanmış Hoca"); assert.equal(owner, "teacher");
  auth = { session: { username: "another-teacher" } };
  assert.equal((await request("obs-course-search?id=job")).status, 404);
});

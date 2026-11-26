import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync, mkdirSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import { queryAudit, auditCsv, auditExportHeaders, auditExportRows } from "../lib/auditTrail.mjs";
import { withPublicPage } from "./helpers/hydrated-public-page.mjs";
import { newCourseImportFixture, newCourseImportRow } from "./helpers/course-create-fixtures.mjs";
import { viewStatisticsTestServer } from "./helpers/view-statistics-fixtures.mjs";
import { adminQualityFixture } from "./helpers/admin-quality-fixtures.mjs";
import { publishedHoursFixture, publishedHoursScope } from "./helpers/course-published-hours-fixtures.mjs";

const query = new URLSearchParams({
  ders: "YBS921", bolum: "Yönetim Bilişim Sistemleri ABD",
  program: "Yönetim Bilişim Sistemleri", duzey: "Doktora",
});
const packagePath = `/dbp/katalog?${query}`;
const programPath = "/dbp/programlar/yonetim-bilisim-sistemleri-abd-yonetim-bilisim-sistemleri?duzey=Doktora&sekme=courses";

test("central panels load courses only after program selection and export the complete catalog on demand", async () => {
  for (const role of ["admin", "enstitu_yoneticisi", "enstitu_sekreteri", "lee_ogrenci_isleri"]) {
    const courses = [
      { code: "MAT801", department: "Matematik ABD", programName: "Matematik", level: "Tezli Yüksek Lisans" },
      { code: "MAT901", department: "Matematik ABD", programName: "Matematik", level: "Doktora" },
      { code: "FZK801", department: "Fizik ABD", programName: "Fizik", level: "Tezli Yüksek Lisans" },
    ].map((course) => ({ ...course, name: `Örnek ${course.code} dersi`, status: "Taslak", term: "Güz", instructor: "Test Hoca" }));
    const requests = [];
    await withPublicPage("/dbp/panel", {
      preparePage: async (page) => {
        await page.addInitScript((role) => localStorage.setItem("lee-dbp-session", JSON.stringify({ name: "Test Yönetici", username: "test.manager", role, department: "LEE" })), role);
        await page.route("**/dbp/api/dbp/**", async (route) => {
          const url = new URL(route.request().url());
          const endpoint = url.pathname.split("/").pop();
          const modules = ["my_courses", "program_profile"];
          let payload = { events: { ok: true }, access: { modules }, "role-module-access": { access: { [role]: modules } }, memberships: { memberships: [] },
            programs: { programs: [
              { mainDepartment: "Matematik ABD", department: "Matematik ABD", programName: "Matematik", levels: ["Tezli Yüksek Lisans", "Doktora"] },
              { mainDepartment: "Fizik ABD", department: "Fizik ABD", programName: "Fizik", levels: ["Tezli Yüksek Lisans"] },
            ] } }[endpoint];
          if (endpoint === "courses") {
            requests.push(url.searchParams);
            const selected = courses.filter((course) => !url.searchParams.has("department") ||
              (course.department === url.searchParams.get("department") && course.programName === url.searchParams.get("programName")));
            payload = { courses: selected, total: selected.length, source: "database" };
          }
          assert.ok(payload, `Unexpected central panel API: ${endpoint}`);
          return route.fulfill({ contentType: "application/json", body: JSON.stringify(payload) });
        });
      },
    }, async ({ page }) => {
      await page.getByRole("button", { name: "Dersleri Aç: Matematik", exact: true }).waitFor();
      assert.equal(requests.length, 0, "opening a central panel must not load any courses");
      await page.locator(".panel-sidebar").getByRole("button", { name: "Program Bilgileri", exact: true }).click();
      await page.getByRole("button", { name: "Programı Aç: Matematik", exact: true }).waitFor();
      assert.equal(requests.length, 0, "program information does not need course lists");
      await page.locator(".panel-sidebar").getByRole("button", { name: "Ders Bilgi Paketlerim", exact: true }).click();
      await page.getByRole("button", { name: "Dersleri Aç: Matematik", exact: true }).click();
      for (const code of ["MAT801", "MAT901"]) await page.locator(".program-course-list").getByText(code, { exact: true }).waitFor();
      assert.equal(requests.length, 1);
      assert.equal(requests[0].get("scope"), "program");
      assert.equal(requests[0].get("department"), "Matematik ABD");
      assert.equal(requests[0].get("programName"), "Matematik");
      assert.equal(requests[0].has("publicVisible"), false, "management must also receive unpublished courses");
      assert.equal(await page.locator(".program-course-list").getByText("FZK801", { exact: true }).count(), 0);
      await page.getByRole("button", { name: "Programlara Dön", exact: true }).click();
      if (role !== "enstitu_sekreteri") {
        const downloading = page.waitForEvent("download");
        await page.getByRole("button", { name: "Ders listesini indir", exact: true }).click();
        const download = await downloading;
        const chunks = [];
        for await (const chunk of await download.createReadStream()) chunks.push(chunk);
        const workbook = Buffer.concat(chunks).toString("utf8");
        for (const course of courses) assert.ok(workbook.includes(course.code), "the download must contain every program and level");
        assert.equal(requests.length, 2);
        assert.equal(requests[1].has("scope"), false);
        assert.equal(requests[1].has("department"), false);
        assert.equal(requests[1].has("limit"), false, "the complete download must not be truncated");
      }
    });
  }
});

test("central program switching ignores a late response from the previous selection", async () => {
  let releaseSlow;
  const slow = new Promise((resolve) => { releaseSlow = resolve; });
  let finishSlow;
  const finished = new Promise((resolve) => { finishSlow = resolve; });
  await withPublicPage("/dbp/panel", {
    preparePage: async (page) => {
      await page.addInitScript(() => localStorage.setItem("lee-dbp-session", JSON.stringify({ name: "Test Yönetici", username: "test.manager", role: "enstitu_yoneticisi", department: "LEE" })));
      await page.route("**/dbp/api/dbp/**", async (route) => {
        const url = new URL(route.request().url());
        const endpoint = url.pathname.split("/").pop();
        const programs = ["Matematik", "Fizik"].map((name) => ({ mainDepartment: "Matematik ABD", department: `${name} ABD`, programName: name, levels: ["Tezli Yüksek Lisans"] }));
        if (endpoint === "courses") {
          assert.equal(url.searchParams.get("scope"), "program");
          const name = url.searchParams.get("programName");
          if (name === "Matematik") await slow;
          try {
            await route.fulfill({ contentType: "application/json", body: JSON.stringify({ courses: [{ code: name === "Matematik" ? "MAT801" : "FZK801", name, department: `${name} ABD`, programName: name, level: "Tezli Yüksek Lisans", status: "Taslak" }], total: 1 }) });
          } finally {
            if (name === "Matematik") finishSlow();
          }
          return;
        }
        const payload = { events: { ok: true }, access: { modules: ["my_courses"] }, memberships: { memberships: [] }, programs: { programs } }[endpoint];
        assert.ok(payload, `Unexpected switching API: ${endpoint}`);
        return route.fulfill({ contentType: "application/json", body: JSON.stringify(payload) });
      });
    },
  }, async ({ page }) => {
    const started = page.waitForRequest((request) => new URL(request.url()).searchParams.get("programName") === "Matematik");
    await page.getByRole("button", { name: "Dersleri Aç: Matematik", exact: true }).click();
    await started;
    await page.getByRole("button", { name: "Programlara Dön", exact: true }).click();
    await page.getByRole("button", { name: "Dersleri Aç: Fizik", exact: true }).click();
    await page.locator(".program-course-list").getByText("FZK801", { exact: true }).waitFor();
    releaseSlow();
    await finished;
    assert.equal(await page.locator(".program-course-list").getByText("MAT801", { exact: true }).count(), 0);
    assert.equal(await page.locator(".program-course-list").getByText("FZK801", { exact: true }).count(), 1);
  });
});

test("permission matrix has one menu and one aligned checkbox per cell, with preserved legacy grants", async () => {
  const ts = await import("typescript");
  const vm = await import("node:vm");
  const accessModule = { exports: {} };
  const rolesModule = { exports: {} };
  for (const [file, module] of [["access", accessModule], ["roles", rolesModule]]) {
    vm.runInNewContext(ts.transpileModule(readFileSync(new URL(`../lib/auth/${file}.ts`, import.meta.url), "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS },
    }).outputText, { exports: module.exports });
  }
  const { DBP_MODULES, DEFAULT_ROLE_ACCESS } = accessModule.exports;
  const { DBP_ROLES } = rolesModule.exports;
  const visibleModules = Object.keys(DBP_MODULES).filter((key) => key !== "user_roles");
  let stored = structuredClone(DEFAULT_ROLE_ACCESS);
  stored.akademisyen = ["my_courses", "program_profile"];
  stored.abd_sekreteri = ["review_queue", "user_roles"];
  const original = structuredClone(stored);
  const writes = [];
  mkdirSync("local-volume/role-permissions", { recursive: true });
  await withPublicPage("/dbp/panel", {
    preparePage: async (page) => {
      await page.setViewportSize({ width: 1910, height: 1000 });
      await page.addInitScript(() => localStorage.setItem("lee-dbp-session", JSON.stringify({ name: "Test Admin", username: "test.admin", role: "admin", department: "LEE" })));
      await page.route("**/dbp/api/dbp/**", async (route) => {
        const request = route.request();
        const endpoint = new URL(request.url()).pathname.split("/").pop();
        let payload;
        if (endpoint === "role-module-access") {
          if (request.method() === "PUT") {
            stored = request.postDataJSON().access;
            writes.push(structuredClone(stored));
          } else assert.equal(request.method(), "GET");
          payload = { access: stored };
        } else {
          const responses = { events: { ok: true }, courses: { courses: [], total: 0 }, programs: { programs: [] }, memberships: { memberships: [] } };
          payload = responses[endpoint];
          assert.ok(payload, `Unexpected permission API: ${endpoint}`);
          assert.ok(request.method() === "GET" || endpoint === "events");
        }
        return route.fulfill({ contentType: "application/json", body: JSON.stringify(payload) });
      });
    },
  }, async ({ page }) => {
    const nav = page.locator(".panel-sidebar nav");
    assert.equal(await nav.getByRole("button", { name: "Kullanıcı ve Rol Yönetimi", exact: true }).count(), 0);
    const matrixMenu = nav.getByRole("button", { name: "Yetki Dağılımı", exact: true });
    assert.equal(await matrixMenu.count(), 1);
    await matrixMenu.click();
    const scroll = page.getByRole("region", { name: "Rol ve modül yetkileri" });
    const table = scroll.getByRole("table");
    await table.waitFor();
    assert.equal(await table.getByRole("columnheader").count(), visibleModules.length + 1);
    assert.deepEqual(await table.getByRole("columnheader").allTextContents(), ["Rol", ...visibleModules.map((module) => DBP_MODULES[module])]);
    assert.equal(await table.getByRole("rowheader").count(), Object.keys(DBP_ROLES).length);
    assert.equal(await table.getByRole("checkbox").count(), visibleModules.length * Object.keys(DBP_ROLES).length);
    const layout = await table.evaluate((element) => {
      const headers = [...element.tHead.rows[0].cells].slice(1).map((cell) => cell.getBoundingClientRect().x);
      return [...element.tBodies[0].rows].map((row) => ({
        columns: [...row.cells].slice(1).map((cell) => cell.getBoundingClientRect().x),
        tops: [...row.querySelectorAll('input[type="checkbox"]')].map((input) => input.getBoundingClientRect().top),
        counts: [...row.cells].slice(1).map((cell) => cell.querySelectorAll('input[type="checkbox"]').length),
        headers,
      }));
    });
    for (const row of layout) {
      assert.ok(row.counts.every((count) => count === 1));
      assert.ok(Math.max(...row.tops) - Math.min(...row.tops) < 1, "all checkboxes must stay on one line");
      assert.ok(row.columns.every((x, index) => Math.abs(x - row.headers[index]) < 1), "every checkbox column must align with its heading");
    }
    assert.equal(await table.getByRole("checkbox", { name: "Akademisyen: Denetim Kayıtları", exact: true }).isDisabled(), true);
    const legacyCheckbox = table.getByRole("checkbox", { name: `${DBP_ROLES.abd_sekreteri.label}: Yetki Dağılımı`, exact: true });
    assert.equal(await legacyCheckbox.isChecked(), true);
    assert.equal(writes.length, 0);
    await page.screenshot({ path: "local-volume/role-permissions/desktop.png", fullPage: true });
    await page.locator(".panel-main .theme-toggle").click();
    await page.screenshot({ path: "local-volume/role-permissions/desktop-dark.png", fullPage: true });
    await page.locator(".panel-main .theme-toggle").click();
    assert.equal(await scroll.evaluate((element) => element.scrollWidth > element.clientWidth), true);
    const before = await table.getByRole("rowheader").first().boundingBox();
    await scroll.evaluate((element) => { element.scrollLeft = element.scrollWidth; });
    const after = await table.getByRole("rowheader").first().boundingBox();
    assert.ok(Math.abs(before.x - after.x) < 1, "role labels must remain visible during horizontal scrolling");
    await page.screenshot({ path: "local-volume/role-permissions/desktop-scrolled.png", fullPage: true });
    await page.setViewportSize({ width: 390, height: 844 });
    await scroll.evaluate((element) => { element.scrollLeft = 0; });
    await page.evaluate(() => window.scrollTo(0, 0));
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, "only the table should scroll horizontally on mobile");
    await page.screenshot({ path: "local-volume/role-permissions/mobile.png", fullPage: true });
    await page.setViewportSize({ width: 1910, height: 1000 });
    await table.getByRole("checkbox", { name: "Akademisyen: Program Bilgileri", exact: true }).click();
    const save = page.getByRole("button", { name: "Değişiklikleri Kaydet", exact: true });
    await save.click();
    await page.getByText("Yetki dagilimi veri tabanina kaydedildi.", { exact: true }).waitFor();
    const expected = structuredClone(original);
    expected.akademisyen = ["my_courses"];
    assert.deepEqual(writes[0], expected, "an unrelated checkbox edit must preserve all other grants, including hidden legacy grants");
    await legacyCheckbox.click();
    await save.click();
    await page.getByText("Yetki dagilimi veri tabanina kaydedildi.", { exact: true }).waitFor();
    expected.abd_sekreteri = ["review_queue"];
    assert.deepEqual(writes[1], expected, "explicitly revoking the shared screen must also revoke its old alias");
    stored.admin = ["user_roles"];
    await page.reload({ waitUntil: "networkidle" });
    await page.getByRole("region", { name: "Rol ve modül yetkileri" }).waitFor();
    assert.equal(await nav.getByRole("button", { name: "Yetki Dağılımı", exact: true }).count(), 1);
    assert.equal(await nav.getByRole("button", { name: "Kullanıcı ve Rol Yönetimi", exact: true }).count(), 0);
    assert.deepEqual(stored.admin, ["user_roles"], "opening an old configuration must not rewrite it");
    assert.equal(writes.length, 2);
  });
});

test("admin audit module filters and pages records, shows details and timeline, and downloads all filtered records", async (t) => {
  const db = new DatabaseSync(":memory:");
  t.after(() => db.close());
  db.exec("CREATE TABLE audit_logs(id INTEGER PRIMARY KEY, action TEXT, actor TEXT, payload_json TEXT, created_at TEXT)");
  const insert = db.prepare("INSERT INTO audit_logs VALUES (?, ?, ?, ?, ?)");
  for (let index = 1; index <= 31; index++) insert.run(index, "course.package.save", "test.teacher", JSON.stringify({
    code: "MAT801", department: "Matematik ABD", programName: "Matematik", level: "Tezli Yüksek Lisans", note: "Kontrol için kaydedildi.",
    _audit: { username: "test.teacher", displayName: "Test Öğretim Üyesi", role: "akademisyen", result: "success", identitySource: "sso" },
  }), `2026-10-23T10:00:${String(index).padStart(2, "0")}.000Z`);
  insert.run(32, "backup.create", "system", "{}", "2026-10-23T11:00:00.000Z");
  mkdirSync("local-volume/audit-module", { recursive: true });
  await withPublicPage("/dbp/panel", {
    preparePage: async (page) => {
      await page.addInitScript(() => localStorage.setItem("lee-dbp-session", JSON.stringify({ name: "Test Admin", username: "test.admin", role: "admin", department: "LEE" })));
      await page.route("**/dbp/api/dbp/**", async (route) => {
        const url = new URL(route.request().url());
        if (url.pathname.includes("/admin/audit-logs")) {
          const exporting = url.pathname.endsWith("/export");
          const data = queryAudit(db, url.searchParams, { exportAll: exporting });
          if (exporting && url.searchParams.get("format") === "csv") return route.fulfill({ contentType: "text/csv; charset=utf-8", body: auditCsv(data.rows) });
          return route.fulfill({ contentType: "application/json", body: JSON.stringify(exporting ? { headers: auditExportHeaders, rows: auditExportRows(data.rows), total: data.total } : data) });
        }
        const payload = url.pathname.endsWith("/role-module-access") ? { access: { admin: ["audit_logs"] } } : { ok: true, courses: [], programs: [], memberships: [] };
        return route.fulfill({ contentType: "application/json", body: JSON.stringify(payload) });
      });
    },
  }, async ({ page }) => {
    const panel = page.locator(".audit-panel");
    await panel.getByRole("heading", { name: "Denetim Kayıtları" }).waitFor();
    await panel.getByText("32", { exact: true }).waitFor();
    assert.equal(await panel.locator("tbody tr").count(), 25);
    await panel.getByRole("button", { name: "Sonraki", exact: true }).click();
    await panel.getByText("Sayfa 2 / 2", { exact: true }).waitFor();
    assert.equal(await panel.locator("tbody tr").count(), 7);
    await panel.getByLabel("Ders kodu", { exact: true }).fill("MAT801");
    await panel.getByLabel("Rol", { exact: true }).selectOption("akademisyen");
    await panel.getByRole("button", { name: "Filtrele", exact: true }).click();
    await panel.getByText("31", { exact: true }).waitFor();
    assert.equal(await panel.locator("tbody tr").count(), 25);
    await panel.getByRole("button", { name: /Kayıt .* ayrıntısı/u }).first().click();
    const dialog = page.getByRole("dialog");
    await dialog.getByText("Kontrol için kaydedildi.", { exact: true }).waitFor();
    assert.equal(await dialog.getByText("Doğrulanmış e-Enstitü oturumu", { exact: true }).count(), 1);
    await page.keyboard.press("Escape");
    assert.equal(await dialog.count(), 0);
    await panel.getByRole("button", { name: "Zaman çizelgesi", exact: true }).click();
    assert.equal(await panel.locator(".audit-timeline li").count(), 25);
    await panel.getByRole("button", { name: "Liste", exact: true }).click();
    const csvPromise = page.waitForEvent("download");
    await panel.getByRole("button", { name: "CSV İndir", exact: true }).click();
    const csv = await csvPromise;
    assert.match(csv.suggestedFilename(), /^dbp-denetim-.*\.csv$/u);
    assert.equal(readFileSync(await csv.path(), "utf8").split("\r\n").length, 32);
    const xlsxPromise = page.waitForEvent("download");
    await panel.getByRole("button", { name: "Excel İndir", exact: true }).click();
    const xlsx = await xlsxPromise;
    assert.match(xlsx.suggestedFilename(), /\.xlsx$/u);
    assert.ok(readFileSync(await xlsx.path()).includes(Buffer.from("xl/worksheets/sheet1.xml")));
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: "local-volume/audit-module/desktop.png" });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: "local-volume/audit-module/mobile.png" });
    const widths = await page.evaluate(() => ({ viewport: window.innerWidth, document: document.documentElement.scrollWidth }));
    assert.equal(widths.document <= widths.viewport, true, `audit panel must fit mobile: ${JSON.stringify(widths)}`);
    await panel.getByLabel("Ders kodu", { exact: true }).fill("NO-SUCH-COURSE");
    await panel.getByRole("button", { name: "Filtrele", exact: true }).click();
    await panel.getByText("Seçtiğiniz filtrelerle eşleşen kayıt bulunamadı.", { exact: true }).waitFor();
    assert.equal(await panel.getByRole("button", { name: "CSV İndir", exact: true }).isDisabled(), true);
    await panel.getByRole("button", { name: "Temizle", exact: true }).click();
    await panel.getByText("32", { exact: true }).waitFor();
    await panel.getByRole("button", { name: "Zaman çizelgesi", exact: true }).click();
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.getByRole("button", { name: "Koyu temaya geç", exact: true }).click();
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: "local-volume/audit-module/timeline-dark.png" });
  });
});

test("browser sessions count home once while content navigation and reloads keep their own statistics", async (t) => {
  const { chromium } = await import("playwright");
  const { origin, totals } = await viewStatisticsTestServer(t);
  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(`${origin}/dbp/`);
    assert.equal(totals().home, 1);
    await page.getByRole("link", { name: "Kalite", exact: true }).click();
    await page.waitForURL("**/dbp/kalite");
    assert.equal(totals().home, 1);
    assert.equal(totals().kalite_gostergeleri, 1);
    await page.getByRole("link", { name: "Ders Kataloğu", exact: true }).click();
    await page.waitForURL("**/dbp/#programlar");
    await page.reload();
    assert.equal(totals().home, 1);
    await page.getByRole("link", { name: "Ders", exact: true }).click();
    await page.waitForURL("**/dbp/mat/tezli/mat864");
    await page.getByRole("link", { name: "Ana Sayfa", exact: true }).click();
    await page.waitForURL("**/dbp/");
    assert.equal(totals().home, 1);
    assert.equal(totals().ders, 1);
    const cookie = (await context.cookies()).find((item) => item.name === "lee_dbp_home_visit");
    assert.equal(cookie.httpOnly, true);
    assert.equal(cookie.expires, -1, "a session cookie must not persist for a fixed number of days");
    await page.evaluate(async () => { await fetch("/dbp/"); });
    assert.equal(totals().home, 1, "background fetches must not count as a visit");
    const separateSession = await browser.newContext();
    await (await separateSession.newPage()).goto(`${origin}/dbp/`);
    assert.equal(totals().home, 2);
    await context.close();
    await separateSession.close();
  } finally { await browser.close(); }
});

test("public mobile navigation starts collapsed, exposes all links and supports dismissal without changing desktop navigation", async () => {
  await withPublicPage("/dbp/", {
    preparePage: async (page) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.route("**/dbp/api/dbp/home-stats", (route) => {
        assert.equal(route.request().method(), "GET");
        return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ totalCourses: 2609, totalPrograms: 59, source: "database", levels: { tezli: 30, tezsiz: 20, doktora: 9 } }) });
      });
      await page.route("**/dbp/api/dbp/view-stats", (route) => {
        assert.equal(route.request().method(), "GET");
        return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ totals: [{ viewType: "home", count: 100 }] }) });
      });
    },
  }, async ({ page }) => {
    const header = page.locator(".oku-header");
    const nav = header.locator('nav[aria-label="Ana menü"]');
    const toggle = header.locator(".mobile-menu-toggle");
    assert.equal(await toggle.getAttribute("aria-expanded"), "false");
    assert.equal(await toggle.getAttribute("aria-controls"), await nav.getAttribute("id"));
    assert.equal(await nav.isVisible(), false);
    assert.equal(await header.getByRole("link", { name: /LEE Bilgi Sistemi/u }).isVisible(), true);
    assert.ok((await header.boundingBox()).height < 150, "closed mobile header should leave room for page content");
    await page.screenshot({ path: "local-volume/test-failure-audit/mobile-menu-closed.png" });
    await header.getByRole("button", { name: "Menüyü aç", exact: true }).click();
    assert.equal(await toggle.getAttribute("aria-expanded"), "true");
    for (const label of ["Ana Sayfa", "Ders Kataloğu", "Kalite Göstergeleri", "Öğrenci Göstergeleri", "TEZ_SKA Analiz", "Görüntülenme İstatistiği"]) {
      assert.equal(await nav.getByRole("link", { name: label, exact: true }).isVisible(), true, label);
    }
    const bibliography = nav.locator(".bibliometrics-menu");
    await bibliography.locator("summary").click();
    assert.equal(await bibliography.getByRole("link", { name: /SCOPUS Tabanlı/u }).isVisible(), true);
    assert.equal(await bibliography.getByRole("link", { name: /TR DİZİN Tabanlı/u }).isVisible(), true);
    assert.equal(await bibliography.getByRole("link", { name: /Lisansüstü Tez Tabanlı/u }).isVisible(), true);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    await page.screenshot({ path: "local-volume/test-failure-audit/mobile-menu-open.png" });
    await page.keyboard.press("Escape");
    assert.equal(await nav.isVisible(), false);
    assert.equal(await toggle.evaluate((button) => button === document.activeElement), true);
    await toggle.click();
    assert.equal(await bibliography.getAttribute("open"), null);
    await page.mouse.click(5, 5);
    assert.equal(await nav.isVisible(), false);
    await toggle.click();
    await nav.getByRole("link", { name: "Ders Kataloğu", exact: true }).click();
    await page.waitForURL("**/#programlar");
    assert.equal(await nav.isVisible(), false, "following a page-section link closes the mobile menu");
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.evaluate(() => scrollTo(0, 0));
    assert.equal(await toggle.isVisible(), false);
    assert.equal(await nav.isVisible(), true);
    assert.equal(await nav.getByRole("link", { name: "Ana Sayfa", exact: true }).isVisible(), true);
    await page.screenshot({ path: "local-volume/test-failure-audit/mobile-menu-desktop.png" });
    await page.setViewportSize({ width: 320, height: 844 });
    assert.equal(await nav.isVisible(), false);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    const brand = await header.locator(".oku-brand").boundingBox();
    const button = await toggle.boundingBox();
    assert.ok(brand.x + brand.width <= button.x && Math.abs(brand.y - button.y) < 10, "brand and hamburger stay on the same row at 320px");
    await page.screenshot({ path: "local-volume/test-failure-audit/mobile-menu-320.png" });
  });
});

test("new-course Excel panel downloads the template, previews without writes and inserts only new courses", async (t) => {
  const { db, excel, request } = newCourseImportFixture(t);
  const original = db.prepare("SELECT * FROM courses WHERE id = 1").get();
  const fileBase64 = excel([
    newCourseImportRow("MAT864"), newCourseImportRow("MAT866"),
    newCourseImportRow("MAT868", { "Danışman İsim": "Test Akademisyeni", "Danışman T.C.": "01234567890", "Danışman Unvan": "Prof. Dr.", "Danışman E-posta": "test@example.test" }),
    newCourseImportRow("MAT870", { "Dönem": "" }),
  ]);
  await withPublicPage("/dbp/panel", {
    preparePage: async (page) => {
      await page.addInitScript(() => localStorage.setItem("lee-dbp-session", JSON.stringify({ name: "Test Yönetici", username: "test.manager", role: "enstitu_yoneticisi", department: "LEE" })));
      await page.route("**/dbp/api/dbp/**", async (route) => {
        const url = new URL(route.request().url());
        assert.equal(url.hostname, "127.0.0.1");
        if (url.pathname.includes("/course-create-import/")) {
          const body = route.request().postDataJSON();
          const response = await request(body.fileBase64, url.pathname.split("/").pop(), body);
          return route.fulfill({ status: response.status, contentType: "application/json", body: await response.text() });
        }
        let payload;
        switch (url.pathname.split("/").pop()) {
          case "events": {
            assert.ok(["panel.enter", "module.view", "session.return"].includes(route.request().postDataJSON().event));
            payload = { ok: true }; break;
          }
          case "access": payload = { modules: ["my_courses"] }; break;
          case "programs": payload = { programs: [{ mainDepartment: "Matematik ABD", department: "Matematik ABD", programName: "Matematik", flags: "", levels: ["Tezli Yüksek Lisans"] }] }; break;
          case "memberships": payload = { memberships: [] }; break;
          case "instructors": payload = { instructors: [], source: "e_enstitu_api" }; break;
          case "courses": {
            const courses = db.prepare("SELECT * FROM courses").all().map((course) => ({ ...course, programName: course.program_name, ects: course.ects || 6, theory: course.theory || 3, practice: course.practice || 0 }));
            payload = { courses, total: courses.length, source: "database" };
            break;
          }
          default: assert.fail(`Unexpected panel API: ${url.pathname}`);
        }
        return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(payload) });
      });
    },
  }, async ({ page }) => {
    await page.locator(".sidebar-course-create").click();
    const dialog = page.getByRole("region", { name: "Ders düzenleme işlemleri" });
    const panel = dialog.getByRole("region", { name: "Excel ile toplu yeni ders" });
    await panel.waitFor();
    assert.equal(await panel.getByRole("button", { name: "Önizle" }).isDisabled(), true);
    const downloading = page.waitForEvent("download");
    await panel.getByRole("link", { name: "Boş Şablon" }).click();
    const download = await downloading;
    assert.equal(download.suggestedFilename(), "yeni-ders-sablonu.xlsx");
    assert.deepEqual(readFileSync(await download.path()), readFileSync(new URL("../public/yeni-ders-sablonu.xlsx", import.meta.url)));
    await dialog.getByLabel("Ana ABD / ASD Başkanlığı").selectOption({ label: "Matematik ABD" });
    await dialog.getByLabel("İlgili ABD / ASD ve program").selectOption("Matematik ABD||Matematik");
    await panel.getByLabel("Yeni ders Excel dosyası").setInputFiles({ name: "yeni-dersler.xlsx", mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", buffer: Buffer.from(fileBase64, "base64") });
    await panel.getByRole("button", { name: "Önizle" }).click();
    await panel.getByText("2 yeni ders", { exact: true }).waitFor();
    assert.equal(db.prepare("SELECT COUNT(*) AS count FROM courses").get().count, 1);
    assert.equal(await panel.getByText("1 mevcut / atlanacak", { exact: true }).count(), 1);
    assert.equal(await panel.getByText("1 hatalı / atlanacak", { exact: true }).count(), 1);
    assert.equal(await panel.getByRole("cell", { name: "Atama bekliyor", exact: true }).count(), 3);
    await page.setViewportSize({ width: 390, height: 844 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true, "the import panel must fit mobile without page overflow");
    const box = await dialog.boundingBox();
    assert.ok(box.x >= 0 && box.x + box.width <= 390, "the full page form stays within the content column");
    assert.equal(await dialog.evaluate((element) => getComputedStyle(element).position), "static");
    await page.screenshot({ path: "local-volume/test-failure-audit/course-import-mobile.png" });
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.screenshot({ path: "local-volume/test-failure-audit/course-import-desktop.png" });
    await panel.getByRole("button", { name: "2 Yeni Dersi Ekle", exact: true }).click();
    await panel.getByRole("status").filter({ hasText: "2 yeni ders eklendi." }).waitFor();
    assert.equal(db.prepare("SELECT COUNT(*) AS count FROM courses").get().count, 3);
    assert.equal(db.prepare("SELECT instructor FROM courses WHERE code = 'MAT866'").get().instructor, "");
    assert.equal(db.prepare("SELECT instructor_tc_kimlik FROM courses WHERE code = 'MAT868'").get().instructor_tc_kimlik, "01234567890");
    assert.deepEqual(db.prepare("SELECT * FROM courses WHERE id = 1").get(), original);
    await dialog.getByRole("tab", { name: "Liste ile Atama Yap", exact: true }).click();
    assert.equal(await dialog.getByRole("region", { name: "Excel ile toplu yeni ders" }).count(), 0);
  });
});

test("institute manager creates courses with explicit terms and corrects existing terms without resending the instructor", async () => {
  const courses = [
    { code: "MAT864", name: "ANALİZDEN SEÇME KONULAR II", term: "", instructor: "Prof. Dr. Mevcut Hoca" },
    { code: "MAT866", name: "CEBİRSEL TOPOLOJİYE GİRİŞ", term: "Bahar", instructor: "Doç. Dr. Diğer Hoca", isProcessCourse: true },
  ].map((course, index) => ({ id: index + 1, ...course, department: "Matematik ABD", programName: "Matematik", level: "Tezli Yüksek Lisans", status: "Komisyon Onayı Bekliyor", type: "Seçmeli", credit: 3, theory: 3, practice: 0, ects: 6 }));
  const writes = [];
  await withPublicPage("/dbp/panel", {
    preparePage: async (page) => {
      await page.addInitScript(() => localStorage.setItem("lee-dbp-session", JSON.stringify({
        name: "Test Yönetici", username: "test.manager", role: "enstitu_yoneticisi", department: "LEE",
      })));
      // All panel requests, including writes, are fulfilled locally; server.mjs is never started.
      await page.route("**/dbp/api/dbp/**", async (route) => {
        const request = route.request();
        const url = new URL(request.url());
        assert.equal(url.hostname, "127.0.0.1");
        let payload;
        switch (url.pathname.split("/").pop()) {
          case "events": {
            assert.ok(["panel.enter", "module.view", "session.return"].includes(request.postDataJSON().event));
            payload = { ok: true }; break;
          }
          case "access": payload = { modules: ["my_courses"] }; break;
          case "programs": payload = { programs: [{ mainDepartment: "Matematik ABD", department: "Matematik ABD", programName: "Matematik", flags: "", levels: ["Tezli Yüksek Lisans"] }] }; break;
          case "memberships": payload = { memberships: [] }; break;
          case "courses": {
            assert.equal(url.searchParams.get("scope"), "program");
            assert.equal(url.searchParams.get("department"), "Matematik ABD");
            assert.equal(url.searchParams.get("programName"), "Matematik");
            assert.equal(url.searchParams.get("level"), "Tezli Yüksek Lisans");
            assert.equal(url.searchParams.has("limit"), false);
            payload = { courses, total: courses.length, source: "database" }; break;
          }
          case "instructors": payload = { instructors: [], source: "e_enstitu_api" }; break;
          case "course-management": {
            assert.equal(request.method(), "POST");
            const body = request.postDataJSON();
            writes.push(body);
            if (body.action === "assign") Object.assign(courses.find((course) => course.code === body.code), {
              ...(body.term ? { term: body.term } : {}),
              ...(body.newCode ? { code: body.newCode } : {}),
              ...(body.name ? { name: body.name } : {}),
              ...(Object.hasOwn(body, "isProcessCourse") ? { isProcessCourse: body.isProcessCourse } : {}),
              ...(Object.hasOwn(body, "type") ? { type: body.type } : {}),
              ...(Object.hasOwn(body, "credit") ? { credit: Number(body.credit) } : {}),
            });
            payload = { ok: true };
            break;
          }
          default: assert.fail(`Unexpected panel API: ${url.pathname}`);
        }
        await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(payload) });
      });
    },
  }, async ({ page }) => {
    const open = () => page.locator(".sidebar-course-create").click();
    await page.locator(".sidebar-course-create").waitFor();
    assert.equal(await page.locator(".sidebar-course-create").innerText(), "Ders Düzenleme");
    await open();
    const dialog = page.getByRole("region", { name: "Ders düzenleme işlemleri" });
    await dialog.getByLabel("Ana ABD / ASD Başkanlığı").selectOption({ label: "Matematik ABD" });
    await dialog.getByLabel("İlgili ABD / ASD ve program").selectOption("Matematik ABD||Matematik");
    await dialog.getByRole("tab", { name: "Mevcut Ders", exact: true }).click();
    await dialog.getByLabel("Müfredattaki ders").selectOption("MAT864");
    assert.equal(await dialog.getByLabel("Ders grubu").inputValue(), "false");
    assert.equal(await dialog.getByLabel("Dersin dönemi").inputValue(), "");
    assert.equal(await dialog.getByLabel("Dersi veren öğretim elemanı").inputValue(), "Prof. Dr. Mevcut Hoca");
    await dialog.getByRole("button", { name: "Değişiklikleri Kaydet" }).click();
    assert.equal(writes.length, 0, "a missing term must not silently become fall");
    await dialog.getByLabel("Müfredattaki ders").selectOption("MAT866");
    assert.equal(await dialog.getByLabel("Ders grubu").inputValue(), "true");
    assert.equal(await dialog.getByLabel("Dersin dönemi").inputValue(), "Bahar");
    assert.equal(await dialog.getByLabel("Dersi veren öğretim elemanı").inputValue(), "Doç. Dr. Diğer Hoca");
    await dialog.getByLabel("Müfredattaki ders").selectOption("MAT864");
    await dialog.getByLabel("Dersin dönemi").selectOption("Bahar");
    await dialog.getByRole("button", { name: "Değişiklikleri Kaydet" }).click();
    await dialog.getByRole("status").getByText("Ders bilgileri kaydedildi.", { exact: true }).waitFor();
    assert.equal(writes[0].term, "Bahar");
    assert.equal(Object.hasOwn(writes[0], "instructor"), false, "term-only edits preserve the latest instructor and identity fields");
    assert.equal(Object.hasOwn(writes[0], "isProcessCourse"), false, "unrelated edits preserve the latest group");
    assert.equal(Object.hasOwn(writes[0], "type"), false);
    assert.equal(Object.hasOwn(writes[0], "credit"), false);
    await open();
    assert.equal(await dialog.getByLabel("Dersin dönemi").inputValue(), "Bahar");
    await dialog.getByRole("tab", { name: "Yeni Ders", exact: true }).click();
    assert.equal(await dialog.getByLabel("Dersin dönemi").inputValue(), "");
    await dialog.getByLabel("Ders kodu", { exact: true }).fill("MAT868");
    await dialog.getByLabel("Ders adı", { exact: true }).fill("REEL ANALİZ");
    for (const label of ["Teorik", "Kredi"]) await dialog.getByLabel(label, { exact: true }).fill("3");
    await dialog.getByLabel("Uygulama", { exact: true }).fill("0");
    await dialog.getByLabel("AKTS", { exact: true }).fill("6");
    await dialog.getByLabel("Dersi veren öğretim elemanı").fill("Şimdilik boş / atama bekliyor");
    await dialog.getByLabel("Dersin dönemi").selectOption("Güz ve Bahar");
    await dialog.getByLabel("Ders grubu").selectOption("true");
    await dialog.getByRole("button", { name: "Dersi Oluştur" }).click();
    await dialog.getByRole("status").getByText("Yeni ders oluşturuldu.", { exact: true }).waitFor();
    assert.equal(writes[1].term, "Güz ve Bahar");
    assert.equal(writes[1].instructor, "");
    assert.equal(writes[1].isProcessCourse, true);
    await open();
    await dialog.getByRole("tab", { name: "Mevcut Ders", exact: true }).click();
    await dialog.getByLabel("Müfredattaki ders").selectOption("MAT866");
    assert.equal(await dialog.getByLabel("Ders kodu", { exact: true }).inputValue(), "MAT866");
    assert.equal(await dialog.getByLabel("Ders adı", { exact: true }).inputValue(), "CEBİRSEL TOPOLOJİYE GİRİŞ");
    await dialog.getByLabel("Ders kodu", { exact: true }).fill("MAT870");
    await dialog.getByLabel("Ders adı", { exact: true }).fill("Yeni İdari Ders Adı");
    await dialog.getByRole("button", { name: "Değişiklikleri Kaydet" }).click();
    await dialog.getByRole("status").getByText("Ders bilgileri kaydedildi.", { exact: true }).waitFor();
    assert.equal(writes[2].courseId, 2);
    assert.equal(writes[2].code, "MAT866");
    assert.equal(writes[2].newCode, "MAT870");
    assert.equal(writes[2].name, "Yeni İdari Ders Adı");
    assert.equal(writes[2].expectedName, "CEBİRSEL TOPOLOJİYE GİRİŞ");
    assert.equal(Object.hasOwn(writes[2], "instructor"), false);
    assert.equal(Object.hasOwn(writes[2], "term"), false);
    await open();
    await dialog.getByLabel("Müfredattaki ders").selectOption("MAT870");
    assert.equal(await dialog.getByLabel("Ders adı", { exact: true }).inputValue(), "Yeni İdari Ders Adı");
    assert.equal(await dialog.getByLabel("Dersin dönemi").inputValue(), "Bahar");
    assert.equal(await dialog.getByLabel("Dersi veren öğretim elemanı").inputValue(), "Doç. Dr. Diğer Hoca");
    assert.equal(await dialog.getByLabel("Ders grubu").inputValue(), "true");
    await dialog.getByLabel("Ders grubu").selectOption("false");
    await dialog.getByRole("button", { name: "Değişiklikleri Kaydet" }).click();
    await dialog.getByRole("status").getByText("Ders bilgileri kaydedildi.", { exact: true }).waitFor();
    assert.equal(writes[3].isProcessCourse, false);
    assert.equal(Object.hasOwn(writes[3], "term"), false);
    assert.equal(Object.hasOwn(writes[3], "instructor"), false);
    await open();
    assert.equal(await dialog.getByLabel("Ders grubu").inputValue(), "false");
    assert.equal(await dialog.getByLabel("Dersin dönemi").inputValue(), "Bahar");
    await dialog.getByLabel("Ders grubu").selectOption("true");
    await dialog.getByRole("button", { name: "Değişiklikleri Kaydet" }).click();
    await dialog.getByRole("status").getByText("Ders bilgileri kaydedildi.", { exact: true }).waitFor();
    assert.equal(writes[4].isProcessCourse, true);
    await open();
    assert.equal(await dialog.getByLabel("Ders grubu").inputValue(), "true");
    assert.equal(await dialog.getByLabel("Zorunlu / Seçmeli").inputValue(), "Seçmeli");
    assert.equal(await dialog.getByLabel("Kredi", { exact: true }).inputValue(), "3");
    await dialog.getByLabel("Zorunlu / Seçmeli").selectOption("Zorunlu");
    await dialog.getByLabel("Kredi", { exact: true }).fill("0");
    await dialog.getByRole("button", { name: "Değişiklikleri Kaydet" }).click();
    await dialog.getByRole("status").getByText("Ders bilgileri kaydedildi.", { exact: true }).waitFor();
    assert.equal(writes[5].type, "Zorunlu");
    assert.equal(Number(writes[5].credit), 0);
    assert.equal(Object.hasOwn(writes[5], "instructor"), false);
    assert.equal(Object.hasOwn(writes[5], "term"), false);
    await open();
    assert.equal(await dialog.getByLabel("Zorunlu / Seçmeli").inputValue(), "Zorunlu");
    assert.equal(await dialog.getByLabel("Kredi", { exact: true }).inputValue(), "0");
  });
});

test("persisted course groups override legacy codes while keeping saved terms on public pages", async () => {
  await withPublicPage(programPath, {
    courseTransform: (course) => course.level !== "Doktora" ? course
      : course.code === "YBS921" ? { ...course, isProcessCourse: true, term: "Bahar" }
      : course.code === "YBS917" ? { ...course, isProcessCourse: false, term: "Güz ve Bahar" }
      : course,
  }, async ({ page }) => {
    const common = page.locator(".public-course-group").filter({ has: page.getByRole("heading", { name: "Ortak / Süreç Dersleri", exact: true }) });
    await common.getByText("YBS921", { exact: true }).waitFor();
    assert.equal(await page.locator(".public-course-table tbody tr").filter({ has: page.getByText("YBS921", { exact: true }) }).count(), 1);
    assert.equal(await common.getByText("YBS917", { exact: true }).count(), 0);
    assert.equal(await common.getByText("YBS9XX", { exact: true }).count(), 1, "missing flags retain the legacy common group");
    for (const title of ["Güz Yarıyılı", "Bahar Yarıyılı"]) {
      const group = page.locator(".public-course-group").filter({ has: page.getByRole("heading", { name: title, exact: true }) });
      const row = group.locator("tbody tr").filter({ has: page.getByText("YBS917", { exact: true }) });
      assert.equal(await row.count(), 1);
      assert.equal(await row.locator("td").nth(2).innerText(), "Güz ve Bahar");
    }
  });
});

test("course management opens in the right panel for all authorized roles, with clear desktop and mobile tabs", async () => {
  mkdirSync("local-volume/course-management", { recursive: true });
  for (const role of ["admin", "enstitu_yoneticisi", "lee_ogrenci_isleri"]) {
    const course = { id: 1, code: "MAT864", name: "ANALİZDEN SEÇME KONULAR II", term: "Bahar", department: "Matematik ABD", programName: "Matematik", level: "Tezli Yüksek Lisans", instructor: "Prof. Dr. Mevcut Hoca", status: "Yayımlandı" };
    const writes = [];
    await withPublicPage("/dbp/panel", {
      preparePage: async (page) => {
        await page.setViewportSize({ width: 1440, height: 1000 });
        await page.addInitScript((role) => localStorage.setItem("lee-dbp-session", JSON.stringify({ name: "Test Yönetici", username: "test.manager", role, department: "LEE" })), role);
        await page.route("**/dbp/api/dbp/**", async (route) => {
          const request = route.request();
          const endpoint = new URL(request.url()).pathname.split("/").pop();
          if (request.method() !== "GET" && endpoint !== "events") writes.push(endpoint);
          const modules = ["my_courses", "program_profile"];
          const payload = {
            "role-module-access": { access: { [role]: modules } },
            access: { modules },
            programs: { programs: [{ ...course, mainDepartment: course.department, levels: [course.level] }] },
            courses: { courses: [course], total: 1, source: "database" },
            memberships: { memberships: [] },
            instructors: { instructors: [], source: "e_enstitu_api" },
            events: { ok: true },
          }[endpoint];
          assert.ok(payload, `Unexpected course management API: ${endpoint}`);
          return route.fulfill({ contentType: "application/json", body: JSON.stringify(payload) });
        });
      },
    }, async ({ page }) => {
      const menu = page.locator(".sidebar-course-create");
      await menu.click();
      const editor = page.getByRole("region", { name: "Ders düzenleme işlemleri" });
      await editor.waitFor();
      assert.equal(await page.getByRole("dialog").count(), 0);
      assert.equal(await page.locator(".course-dialog-backdrop").count(), 0);
      assert.equal(await page.locator(".panel-main").getByRole("heading", { level: 1 }).innerText(), "Ders Düzenleme");
      assert.equal(await menu.getAttribute("aria-current"), "page");
      assert.equal(await page.locator(".panel-main .publish-department-list").count(), 0);
      const tabs = editor.getByRole("tablist", { name: "Ders yönetimi" });
      assert.equal(await tabs.getByRole("tab").count(), 3);
      await tabs.getByRole("tab", { name: "Yeni Ders", exact: true }).focus();
      await page.keyboard.press("ArrowRight");
      const existing = tabs.getByRole("tab", { name: "Mevcut Ders", exact: true });
      assert.equal(await existing.getAttribute("aria-selected"), "true");
      assert.equal(await existing.evaluate((button) => button === document.activeElement), true);
      await editor.getByLabel("Ana ABD / ASD Başkanlığı").selectOption({ label: "Matematik ABD" });
      await editor.getByLabel("İlgili ABD / ASD ve program").selectOption("Matematik ABD||Matematik");
      await editor.getByLabel("Müfredattaki ders").selectOption(course.code);
      assert.equal(await editor.getByLabel("Ders adı", { exact: true }).inputValue(), course.name);
      const selectedBorder = await existing.evaluate((button) => getComputedStyle(button).borderColor);
      const inactiveBorder = await tabs.getByRole("tab", { name: "Yeni Ders", exact: true }).evaluate((button) => getComputedStyle(button).borderColor);
      assert.notEqual(selectedBorder, inactiveBorder, "selected tab must be visibly distinct");
      if (role === "admin") {
        await page.screenshot({ path: "local-volume/course-management/desktop.png", fullPage: true });
        await page.locator(".panel-main .theme-toggle").click();
        await page.screenshot({ path: "local-volume/course-management/desktop-dark.png", fullPage: true });
        await page.locator(".panel-main .theme-toggle").click();
      }
      await page.setViewportSize({ width: 390, height: 844 });
      await page.evaluate(() => window.scrollTo(0, 0));
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, "course management must fit the mobile viewport");
      const boxes = await tabs.getByRole("tab").evaluateAll((buttons) => buttons.map((button) => { const box = button.getBoundingClientRect(); return { top: box.top, bottom: box.bottom, width: box.width }; }));
      assert.ok(boxes.every((box) => box.width > 200));
      assert.ok(boxes[1].top >= boxes[0].bottom && boxes[2].top >= boxes[1].bottom, "mobile tabs must have separate rows");
      if (role === "admin") await page.screenshot({ path: "local-volume/course-management/mobile.png", fullPage: true });
      await editor.getByRole("button", { name: "Ders Listesine Dön", exact: true }).click();
      await editor.waitFor({ state: "hidden" });
      assert.equal(await menu.getAttribute("aria-current"), null);
      await menu.click();
      await editor.waitFor();
      await page.locator(".panel-sidebar").getByRole("button", { name: "Program Bilgileri", exact: true }).click();
      await editor.waitFor({ state: "hidden" });
      assert.equal(await page.locator(".panel-main").getByRole("heading", { level: 1 }).innerText(), "Program Bilgileri");
      assert.deepEqual(writes, [], "opening, switching tabs and navigating must not write course data");
    });
  }
});

test("academic identity fields stay read-only after loading a package and importing OBS content", async () => {
  const course = { id: 1, code: "MAT864", name: "İdari Ders Adı", department: "Matematik ABD", programName: "Matematik", level: "Tezli Yüksek Lisans", instructor: "Test Akademisyen", status: "Taslak" };
  await withPublicPage("/dbp/panel", {
    preparePage: async (page) => {
      await page.addInitScript(() => localStorage.setItem("lee-dbp-session", JSON.stringify({ name: "Test Akademisyen", username: "test.teacher", role: "akademisyen", department: "Matematik ABD" })));
      await page.route("**/dbp/api/dbp/**", async (route) => {
        const endpoint = new URL(route.request().url()).pathname.split("/").pop();
        let payload;
        switch (endpoint) {
          case "events": payload = { ok: true }; break;
          case "access": payload = { modules: ["my_courses"] }; break;
          case "programs": payload = { programs: [{ ...course, mainDepartment: course.department, levels: [course.level] }] }; break;
          case "memberships": payload = { memberships: [] }; break;
          case "my-courses": payload = { courses: [course], total: 1, source: "database" }; break;
          case "course-package": payload = { package: { identity: { name: course.name, code: course.code, language: "Türkçe" }, detailFields: { purpose: "Saved purpose" } }, status: "Taslak" }; break;
          case "obs-programs": payload = { programs: [], suggestedProgramId: "" }; break;
          case "obs-course-draft": payload = { draft: { sourceUrl: "https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=1&lang=tr", obsCourseId: "1", code: "OTHER801", name: "OBS Başka Ders", theory: 3, practice: 0, lab: 0, credit: 3, ects: 6, totalWorkload: 0, details: { purpose: "OBS purpose" }, outcomes: [], assessments: [], workloads: {}, weeklyTopics: {}, structures: {}, contributionMatrix: [] } }; break;
          default: assert.fail(`Unexpected academic API: ${endpoint}`);
        }
        return route.fulfill({ contentType: "application/json", body: JSON.stringify(payload) });
      });
    },
  }, async ({ page }) => {
    await page.locator(".role-course-sections").getByRole("button", { name: "Görüntüle", exact: true }).first().click();
    const form = page.locator(".course-bologna-form");
    const name = form.getByLabel("Dersin Adı", { exact: true });
    const code = form.getByLabel("Kodu", { exact: true });
    await name.waitFor();
    assert.equal(await name.inputValue(), course.name);
    assert.equal(await code.inputValue(), course.code);
    assert.equal(await name.isEditable(), false);
    assert.equal(await code.isEditable(), false);
    await form.getByRole("button", { name: /OBS.den Doldur/u }).click();
    await page.getByRole("tab", { name: "Bağlantıyla getir" }).click();
    await page.getByLabel("ÖBS ders detay bağlantısı").fill("https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=1");
    await page.getByRole("button", { name: "Dersi Getir ve Önizle", exact: true }).click();
    await page.getByLabel("Aktarılan bölümlerde mevcut içeriğin değiştirilmesini onaylıyorum.").check();
    await page.getByRole("button", { name: "Tümünü Değiştir", exact: true }).click();
    assert.equal(await name.inputValue(), course.name);
    assert.equal(await code.inputValue(), course.code);
    assert.equal(await name.isEditable(), false);
    assert.equal(await code.isEditable(), false);
  });
});

test("public package waits for approval lookup before rendering its academic content", async () => {
  let release;
  const apiGate = new Promise((resolve) => { release = resolve; });
  await withPublicPage(packagePath, { apiGate, waitUntil: "domcontentloaded" }, async ({ page }) => {
    try {
      await page.getByText("Yayın durumu kontrol ediliyor.", { exact: true }).waitFor();
      assert.equal(await page.locator(".week-grid").count(), 0);
    } finally { release(); }
    await page.locator(".week-grid").waitFor();
    assert.equal(await page.locator(".week-grid b").count(), 15);
  });
});

test("draft-only package never exposes the static seed as approved public content", async () => {
  await withPublicPage(packagePath, { published: false }, async ({ page }) => {
    await page.getByRole("heading", { name: "Ders bilgi paketi onay sürecinde" }).waitFor();
    assert.equal(await page.locator(".week-grid, .contribution-table").count(), 0);
  });
});

test("an approved package stays public while a new revision is awaiting committee approval", async () => {
  const approved = "APPROVED_REVISION_FROM_PUBLIC_API";
  await withPublicPage(packagePath, {
    status: "Komisyon Onayı Bekliyor",
    packageTransform: (stored) => ({ ...stored, detailFields: { ...stored.detailFields, purpose: approved } }),
  }, async ({ page }) => {
    await page.getByText(approved, { exact: true }).waitFor();
    assert.equal(await page.locator(".week-grid b").count(), 15);
    assert.equal(await page.getByRole("heading", { name: "Ders bilgi paketi onay sürecinde" }).count(), 0);
  });
});

test("public list and package show the same managed type and credit after changes, ignoring old package values", async () => {
  let type = "Zorunlu", credit = 0;
  const options = {
    courseTransform: (course) => course.code === "YBS921" ? { ...course, type, credit } : course,
    packageTransform: (stored) => ({ ...stored, identity: { ...stored.identity, type: "Seçmeli", credit: "9" } }),
  };
  await withPublicPage(programPath, options, async ({ page }) => {
    const row = page.locator(".public-course-table tbody tr").filter({ has: page.getByText("YBS921", { exact: true }) }).first();
    await row.waitFor();
    assert.equal(await row.locator(".course-type").innerText(), "Zorunlu");
    type = "Seçmeli";
    credit = 2.5;
    await page.reload({ waitUntil: "networkidle" });
    await row.waitFor();
    assert.equal(await row.locator(".course-type").innerText(), "Seçmeli");
  });
  await withPublicPage(packagePath, options, async ({ page }) => {
    const field = (label) => page.locator(".package-field").filter({ has: page.getByText(label, { exact: true }) }).first().locator("strong");
    await page.locator(".week-grid").waitFor();
    assert.equal(await field("Ders Türü").innerText(), "Seçmeli");
    assert.equal(await field("Kredi").innerText(), "2.5");
    type = "Zorunlu";
    credit = 0;
    await page.reload({ waitUntil: "networkidle" });
    await page.locator(".week-grid").waitFor();
    assert.equal(await field("Ders Türü").innerText(), "Zorunlu");
    assert.equal(await field("Kredi").innerText(), "0");
  });
});

test("reopening the public course list reads updated instructor assignments from the API", async () => {
  let instructor = "Dr. Öğr. Üyesi İlk Test Akademisyeni";
  const options = { courseTransform: (course) => course.code === "YBS921" ? { ...course, instructor } : course };
  await withPublicPage(programPath, options, async ({ page, apiRequests }) => {
    const row = page.locator(".public-course-table tbody tr").filter({ has: page.getByText("YBS921", { exact: true }) }).first();
    await row.waitFor();
    assert.match(await row.innerText(), /İlk Test Akademisyeni/u);
    instructor = "Doç. Dr. Güncellenmiş Test Akademisyeni";
    await page.reload({ waitUntil: "networkidle" });
    await row.waitFor();
    assert.match(await row.innerText(), /Güncellenmiş Test Akademisyeni/u);
    assert.doesNotMatch(await row.innerText(), /İlk Test Akademisyeni/u);
    assert.equal(apiRequests.filter((pathname) => pathname.endsWith("/courses")).length, 2);
  });
});

test("program T/U columns read the approved database package after final approval and preserve it during the next draft", async (t) => {
  const { context, row, save } = publishedHoursFixture(t);
  const published = { identity: { theory: "3", practice: "0" } };
  const revision = { identity: { theory: "4", practice: "2" } };
  save(context.packageJsonForDraft(JSON.stringify(published), revision, "Komisyon Onayı Bekliyor", "teacher", "now", "Public"), "Komisyon Onayı Bekliyor");
  await withPublicPage("/dbp/mat/tezli?sekme=courses", {
    preparePage: async (page) => {
      await page.route("**/dbp/api/dbp/courses?**", async (route) => {
        const response = await context.handleDbpApi(new Request(route.request().url()));
        await route.fulfill({ status: response.status, headers: Object.fromEntries(response.headers), body: await response.text() });
      });
    },
  }, async ({ page }) => {
    const courseRow = page.locator(".public-course-table tbody tr").filter({ has: page.getByText(publishedHoursScope.code, { exact: true }) }).first();
    const expectHours = async (theory, practice) => {
      await courseRow.waitFor();
      assert.equal(await courseRow.locator("td").nth(5).innerText(), theory);
      assert.equal(await courseRow.locator("td").nth(6).innerText(), practice);
    };
    await expectHours("3", "0");
    assert.equal(await courseRow.locator(".approval-badge.approved").count(), 1);
    assert.equal(context.transitionCoursePackageStatus(publishedHoursScope, "ABD Son Onayı Bekliyor", "committee").ok, true);
    await page.reload({ waitUntil: "networkidle" });
    await expectHours("3", "0");
    assert.equal(context.transitionCoursePackageStatus(publishedHoursScope, "Yayımlandı", "chair").ok, true);
    await page.reload({ waitUntil: "networkidle" });
    await expectHours("4", "2");
    save(context.packageJsonForDraft(row().package_json, { identity: { theory: "9", practice: "8" } }, "Taslak", "teacher", "later", "Yayımlandı"), "Taslak");
    await page.reload({ waitUntil: "networkidle" });
    await expectHours("4", "2");
    assert.equal(await courseRow.locator(".approval-badge.approved").count(), 1, "ordinary improvements retain the approved public badge");
    const withdrawn = JSON.parse(row().package_json);
    withdrawn.outcomeCountChange = { previousCount: 11, currentCount: 15, changedAt: "later", changedBy: "chair" };
    save(withdrawn, "Taslak");
    await page.reload({ waitUntil: "networkidle" });
    await courseRow.waitFor();
    assert.equal(await courseRow.locator(".approval-badge.approved").count(), 0);
    assert.equal(await courseRow.locator(".approval-badge.pending").count(), 1, "a count reset removes the approved public badge");
  });
});

test("Matematik public list uses the saved term on the next request, including courses offered in both terms", async () => {
  let term = "Güz";
  await withPublicPage("/dbp/mat/tezli?sekme=courses", {
    courseTransform: (course) => course.code === "MAT809" ? { ...course, code: "MAT864", name: "ANALİZDEN SEÇME KONULAR II", term } : course,
  }, async ({ page }) => {
    const rows = page.locator(".public-course-table tbody tr").filter({ has: page.getByText("MAT864", { exact: true }) });
    await rows.first().waitFor();
    assert.equal(await rows.count(), 1);
    assert.equal(await rows.locator("td").nth(2).innerText(), "Güz");
    term = "Bahar";
    await page.reload({ waitUntil: "networkidle" });
    await rows.first().waitFor();
    assert.equal(await rows.count(), 1);
    assert.equal(await rows.locator("td").nth(2).innerText(), "Bahar");
    assert.equal(await rows.locator("xpath=ancestor::section[1]").getByRole("heading", { level: 3 }).innerText(), "Bahar Yarıyılı");
    term = "Güz ve Bahar";
    await page.reload({ waitUntil: "networkidle" });
    await rows.first().waitFor();
    assert.equal(await rows.count(), 2);
    for (const row of await rows.all()) assert.equal(await row.locator("td").nth(2).innerText(), "Güz ve Bahar");
    assert.deepEqual(await Promise.all((await rows.all()).map((row) => row.locator("xpath=ancestor::section[1]").getByRole("heading", { level: 3 }).innerText())), ["Güz Yarıyılı", "Bahar Yarıyılı"]);
  });
});

test("common process courses show the saved term after reload and in the downloaded Excel list", async (t) => {
  const { context } = newCourseImportFixture(t);
  const codes = ["HRM809", "DAN8XX"];
  let term = "Güz";
  await withPublicPage("/dbp/hrt/tezli?sekme=courses", {
    courseTransform: (course) => codes.includes(course.code) ? { ...course, term } : course,
  }, async ({ page }) => {
    for (const savedTerm of ["Güz", "Bahar", "Güz ve Bahar"]) {
      term = savedTerm;
      await page.reload({ waitUntil: "networkidle" });
      for (const code of codes) {
        const row = page.locator(".public-course-table tbody tr").filter({ has: page.getByText(code, { exact: true }) });
        await row.waitFor();
        assert.equal(await row.count(), 1);
        assert.equal(await row.locator("td").nth(2).innerText(), savedTerm);
        assert.equal(await row.locator("xpath=ancestor::section[1]").getByRole("heading", { level: 3 }).innerText(), "Ortak / Süreç Dersleri");
      }
      const downloaded = page.waitForEvent("download");
      await page.getByRole("button", { name: "Ders listesini indir", exact: true }).click();
      const download = await downloaded;
      assert.match(download.suggestedFilename(), /\.xlsx$/u);
      const chunks = [];
      for await (const chunk of await download.createReadStream()) chunks.push(chunk);
      const rows = context.readFirstXlsxSheetRows(Buffer.concat(chunks));
      for (const code of codes) {
        const exported = rows.filter((row) => row[0] === code);
        assert.equal(exported.length, 1);
        assert.equal(exported[0][2], savedTerm);
      }
    }
  });
});

test("the same BES801 code keeps its department-specific group while respecting the saved term", async () => {
  for (const [slug, section, term] of [
    ["arkeoloji-abd-arkeoloji", "Güz Yarıyılı", "Güz"],
    ["tarih-abd-tarih", "Ortak / Süreç Dersleri", "Bahar"],
  ]) {
    const params = new URLSearchParams({ duzey: "Tezli Yüksek Lisans", sekme: "courses" });
    await withPublicPage(`/dbp/programlar/${slug}?${params}`, {
      courseTransform: (course) => course.code === "BES801" ? { ...course, term } : course,
    }, async ({ page }) => {
      const row = page.locator(".public-course-table tbody tr").filter({ has: page.getByText("BES801", { exact: true }) });
      await row.waitFor();
      assert.equal(await row.count(), 1);
      assert.equal(await row.locator("xpath=ancestor::section[1]").getByRole("heading", { level: 3 }).innerText(), section);
      assert.equal(await row.locator("td").nth(2).innerText(), term);
    });
  }
});

test("short program URLs preserve the selected level after the API response", async () => {
  for (const [level, heading] of [["dr", "Doktora Dersleri"], ["tezli", "Tezli Yüksek Lisans Dersleri"], ["tezsiz", "Tezsiz Yüksek Lisans Dersleri"]]) {
    await withPublicPage(`/dbp/ybs/${level}?sekme=courses`, {}, async ({ page }) => {
      await page.locator(".public-course-table").first().waitFor();
      assert.equal(await page.locator(".public-course-title h2").innerText(), heading);
    });
  }
});

test("public profiles wait for the database and never display defaults on missing records or request failures", async () => {
  let releaseProfile;
  const profileGate = new Promise((resolve) => { releaseProfile = resolve; });
  let mode = "saved";
  const outcomes = Array.from({ length: 12 }, (_, index) => `Başkanın kayıtlı çıktısı ${index + 1}`);
  await withPublicPage("/dbp/isl/dr", {
    waitUntil: "domcontentloaded",
    preparePage: async (page) => {
      await page.route("**/dbp/api/dbp/program-profile?**", async (route) => {
        await profileGate;
        return route.fulfill({ status: mode === "error" ? 503 : 200, contentType: "application/json", body: JSON.stringify({
          profile: mode === "saved" ? { programName: "İşletme", level: "Doktora", degree: "Kayıtlı doktora derecesi", manager: "", language: "", qualificationRules: "", sections: [], outcomes, tyycRows: [] } : null,
        }) });
      });
    },
  }, async ({ page }) => {
    try {
      await page.getByText("Kayıtlı program bilgileri yükleniyor…", { exact: true }).waitFor();
      assert.equal(await page.locator(".public-outcomes li").count(), 0, "the static 11-outcome profile must not flash before the request completes");
    } finally { releaseProfile(); }
    await page.getByText("Kayıtlı doktora derecesi", { exact: true }).waitFor();
    assert.deepEqual(await page.locator(".public-outcomes li span").allTextContents(), outcomes);
    assert.equal(await page.locator(".public-profile-summary .qualification p").innerText(), "—", "intentionally empty database fields must not be replaced by defaults");
    mode = "missing";
    await page.reload({ waitUntil: "networkidle" });
    await page.getByText("Bu program ve düzey için kayıtlı program bilgisi bulunamadı.", { exact: true }).waitFor();
    assert.equal(await page.locator(".public-outcomes li").count(), 0);
    mode = "error";
    await page.reload({ waitUntil: "networkidle" });
    await page.getByRole("alert").getByText("Kayıtlı program bilgileri yüklenemedi.", { exact: true }).waitFor();
    assert.equal(await page.locator(".public-outcomes li").count(), 0);
  });
});

test("program TYYÇ matrix blocks untouched new columns and saves only after every cell is selected", async () => {
  const scope = { mainDepartment: "İşletme ABD", department: "İşletme ABD", programName: "İşletme", levels: ["Doktora"] };
  let profile = {
    programName: scope.programName, level: "Doktora", degree: "Doktora", manager: "", language: "Türkçe", qualificationRules: "",
    sections: Array.from({ length: 9 }, (_, index) => ({ title: `Bölüm ${index + 1}`, text: "Açıklama" })),
    outcomes: Array.from({ length: 11 }, (_, index) => `Alan bilgisini değerlendirir ${index + 1}.`),
    outcomeIds: Array.from({ length: 11 }, (_, index) => `pc-${index + 1}`),
    tyycRows: ["T1", "T2"].map((code) => ({ code, title: `${code} yeterliliği`, values: Array.from({ length: 11 }, () => 2) })),
    updatedAt: "seed",
  };
  const writes = [];
  await withPublicPage("/dbp/panel", { preparePage: async (page) => {
    await page.addInitScript(() => localStorage.setItem("lee-dbp-session", JSON.stringify({ name: "Test Başkan", username: "test.chair", role: "abd_asd_baskani", department: "İşletme ABD" })));
    await page.route("**/dbp/api/dbp/**", async (route) => {
      const request = route.request();
      const endpoint = new URL(request.url()).pathname.split("/").pop();
      let payload;
      if (endpoint === "program-profile") {
        if (request.method() === "PUT") {
          profile = request.postDataJSON().profile;
          writes.push(structuredClone(profile));
          profile.updatedAt = "saved";
        }
        payload = { profile };
      } else payload = {
        events: { ok: true }, access: { modules: ["program_profile"] }, memberships: { memberships: [] },
        programs: { programs: [scope] }, "my-courses": { courses: [], total: 0 },
        courses: { courses: [], total: 0 }, instructors: { instructors: [] },
      }[endpoint];
      assert.ok(payload, `Unexpected profile API: ${endpoint}`);
      return route.fulfill({ contentType: "application/json", body: JSON.stringify(payload) });
    });
  } }, async ({ page }) => {
    await page.locator(".panel-sidebar nav").getByRole("button", { name: "Program Bilgileri", exact: true }).click();
    await page.getByLabel("T1 ile PÇ11 ilişki düzeyi", { exact: true }).waitFor();
    for (let index = 0; index < 4; index++) await page.getByRole("button", { name: "Çıktı Ekle", exact: true }).click();
    for (let index = 11; index < 15; index++) await page.locator(".outcomes-card textarea").nth(index).fill(`Alan bilgisini değerlendirir ${index + 1}.`);
    assert.equal(await page.getByLabel("T1 ile PÇ12 ilişki düzeyi", { exact: true }).inputValue(), "");
    assert.equal(await page.getByLabel("T1 ile PÇ11 ilişki düzeyi", { exact: true }).inputValue(), "2");
    await page.getByRole("button", { name: "Kaydet", exact: true }).click();
    await page.locator(".tyyc-error").waitFor();
    assert.match(await page.locator(".tyyc-error").innerText(), /T1: PÇ12, PÇ13, PÇ14, PÇ15/);
    assert.equal(writes.length, 0);
    assert.equal(await page.locator('.relation-select[aria-invalid="true"]').count(), 8);
    await page.getByLabel("T1 ile PÇ12 ilişki düzeyi", { exact: true }).selectOption("0");
    await page.getByRole("button", { name: "Kaydet", exact: true }).click();
    assert.match(await page.locator(".tyyc-error").innerText(), /T1: PÇ13, PÇ14, PÇ15/);
    assert.equal(writes.length, 0, "one edit must not silently fill the remaining cells with zero");
    for (const code of ["T1", "T2"]) {
      for (let column = 12; column <= 15; column++) await page.getByLabel(`${code} ile PÇ${column} ilişki düzeyi`, { exact: true }).selectOption("0");
    }
    const response = page.waitForResponse((value) => value.url().includes("/program-profile") && value.request().method() === "PUT");
    await page.getByRole("button", { name: "Kaydet", exact: true }).click();
    await response;
    assert.equal(writes.length, 1);
    assert.equal(writes[0].outcomes.length, 15);
    assert.deepEqual(writes[0].tyycRows.map((row) => row.values), [
      [...Array(11).fill(2), 0, 0, 0, 0], [...Array(11).fill(2), 0, 0, 0, 0],
    ]);
    await page.reload({ waitUntil: "networkidle" });
    await page.locator(".panel-sidebar nav").getByRole("button", { name: "Program Bilgileri", exact: true }).click();
    await page.getByLabel("T2 ile PÇ15 ilişki düzeyi", { exact: true }).waitFor();
    assert.equal(await page.getByLabel("T2 ile PÇ15 ilişki düzeyi", { exact: true }).inputValue(), "0");
    await page.getByRole("button", { name: "12. çıktıyı sil", exact: true }).click();
    const removedResponse = page.waitForResponse((value) => value.url().includes("/program-profile") && value.request().method() === "PUT");
    await page.getByRole("button", { name: "Kaydet", exact: true }).click();
    await removedResponse;
    assert.equal(writes[1].outcomes.length, 14);
    assert.ok(writes[1].tyycRows.every((row) => row.values.length === 14));
  });
});

test("legacy draft matrix suggestions use current columns once and preserve the teacher's saved blanks", async () => {
  const course = { id: 1, code: "ISL901", name: "Taslak Matris Dersi", department: "İşletme", programName: "İşletme", level: "Doktora", instructor: "Test Akademisyen", status: "Taslak" };
  const originalMatrix = [Object.fromEntries(Array.from({ length: 11 }, (_, index) => [`P${index + 1}`, index % 5 + 1]))];
  let stored = { outcomes: ["Dersin öğrenme çıktısını bilimsel araştırmalarda uygular."], contributionMatrix: originalMatrix };
  let count = 12;
  let outcomeCountChange = null;
  const writes = [];
  await withPublicPage("/dbp/panel", { preparePage: async (page) => {
    await page.addInitScript((department) => localStorage.setItem("lee-dbp-session", JSON.stringify({ name: "Test Akademisyen", username: "test.teacher", role: "akademisyen", department })), course.department);
    await page.route("**/dbp/api/dbp/**", async (route) => {
      const request = route.request();
      const endpoint = new URL(request.url()).pathname.split("/").pop();
      let payload;
      if (endpoint === "course-package") {
        if (request.method() === "POST") {
          const body = request.postDataJSON();
          writes.push(body);
          stored = body.package;
          payload = { ok: true, status: "Taslak" };
        } else payload = { package: stored, status: "Taslak", outcomeCountChange, programOutcomes: Array.from({ length: count }, (_, index) => ({ id: `legacy-pc-${index + 1}`, text: `Başkanın çıktısı ${index + 1}` })) };
      } else payload = {
        events: { ok: true }, access: { modules: ["my_courses"] }, memberships: { memberships: [] },
        programs: { programs: [{ ...course, mainDepartment: "İşletme ABD", levels: [course.level] }] },
        "my-courses": { courses: [course], total: 1, source: "database" },
      }[endpoint];
      assert.ok(payload, `Unexpected matrix API: ${endpoint}`);
      return route.fulfill({ contentType: "application/json", body: JSON.stringify(payload) });
    });
  } }, async ({ page }) => {
    const open = async () => {
      await page.locator(".role-course-sections").getByRole("button", { name: "Görüntüle", exact: true }).first().click();
      await page.locator(".contribution-wrap select").first().waitFor();
    };
    await open();
    assert.deepEqual(await page.locator(".contribution-wrap select").evaluateAll((elements) => elements.map((element) => element.value)), [...Object.values(originalMatrix[0]).map(String), ""]);
    assert.equal(writes.length, 0, "loading suggestions must not write to the database");
    await page.getByLabel("ÖÇ1 P1 katkısı", { exact: true }).selectOption("");
    await page.getByLabel("ÖÇ1 P2 katkısı", { exact: true }).selectOption("5");
    const savedResponse = page.waitForResponse((response) => response.url().includes("/course-package") && response.request().method() === "POST");
    await page.getByRole("button", { name: "Taslağı Kaydet", exact: true }).click();
    await savedResponse;
    assert.equal(writes[0].package.programOutcomes.length, 12);
    assert.equal(writes[0].package.contributionMatrix[0]["legacy-pc-1"], undefined);
    assert.equal(writes[0].package.contributionMatrix[0]["legacy-pc-2"], 5);
    await page.reload({ waitUntil: "networkidle" });
    await open();
    assert.equal(await page.getByLabel("ÖÇ1 P1 katkısı", { exact: true }).inputValue(), "");
    assert.equal(await page.getByLabel("ÖÇ1 P2 katkısı", { exact: true }).inputValue(), "5");
    assert.equal(await page.getByLabel("ÖÇ1 P12 katkısı", { exact: true }).inputValue(), "");
    // A different old draft with seven current outcomes gets only seven suggestions.
    stored = { outcomes: ["Dersin öğrenme çıktısını bilimsel araştırmalarda uygular."], contributionMatrix: originalMatrix };
    count = 7;
    await page.reload({ waitUntil: "networkidle" });
    await open();
    assert.deepEqual(await page.locator(".contribution-wrap select").evaluateAll((elements) => elements.map((element) => element.value)), Object.values(originalMatrix[0]).slice(0, 7).map(String));
    // A future count reset keeps old scores but requires coverage of the new PÇ column.
    count = 12;
    outcomeCountChange = { previousCount: 11, currentCount: 12 };
    stored = {
      outcomes: ["Dersin öğrenme çıktısını bilimsel araştırmalarda uygular."],
      programOutcomes: Array.from({ length: 11 }, (_, index) => ({ id: `legacy-pc-${index + 1}`, text: `Başkanın çıktısı ${index + 1}` })),
      contributionMatrix: [Object.fromEntries(Object.values(originalMatrix[0]).map((score, index) => [`legacy-pc-${index + 1}`, score]))],
    };
    await page.reload({ waitUntil: "networkidle" });
    await open();
    assert.match(await page.locator(".course-bologna-form").innerText(), /11 → 12/);
    assert.equal(await page.getByLabel("ÖÇ1 P12 katkısı", { exact: true }).inputValue(), "");
    await page.locator(".publish-validation summary").click();
    assert.match(await page.locator(".publish-validation").innerText(), /PÇ12 hiçbir ders öğrenme çıktısıyla eşleştirilmemiş/);
    assert.equal(await page.getByRole("button", { name: "Onaya gönder", exact: true }).isDisabled(), true);
    await page.getByLabel("ÖÇ1 P12 katkısı", { exact: true }).selectOption("4");
    assert.doesNotMatch(await page.locator(".publish-validation").innerText(), /PÇ12 hiçbir ders öğrenme çıktısıyla eşleştirilmemiş/);
    assert.equal(await page.getByLabel("ÖÇ1 P2 katkısı", { exact: true }).inputValue(), "2");
    // Empty course packages must not acquire positional template scores after a count change.
    stored = null;
    await page.reload({ waitUntil: "networkidle" });
    await open();
    assert.ok((await page.locator(".contribution-wrap select").evaluateAll((elements) => elements.map((element) => element.value))).every((value) => value === ""));
  });
});

test("switching program levels loads the matching saved public profile", async () => {
  await withPublicPage("/dbp/ybs/dr", {
    profileFor: (url) => ({
      programName: url.searchParams.get("programName"), level: url.searchParams.get("level"),
      degree: `API degree: ${url.searchParams.get("level")}`, sections: [], outcomes: [], tyycRows: [],
    }),
  }, async ({ page }) => {
    await page.getByText("API degree: Doktora", { exact: true }).waitFor();
    await page.locator('.public-left-sidebar a[href="/dbp/ybs/tezli"]').first().click();
    await page.getByText("API degree: Tezli Yüksek Lisans", { exact: true }).waitFor();
    assert.equal(await page.getByText("API degree: Doktora", { exact: true }).count(), 0);
  });
});

async function advisorQualitySnapshot(program) {
  const { context } = adminQualityFixture();
  const snapshot = JSON.parse(JSON.stringify(await context.buildQualitySnapshot()));
  snapshot.nextRefreshAt = "2026-11-25T00:00:00.000Z";
  snapshot.programs = [
    { ...program, key: "doctorate", level: "Doktora" },
    { ...program, key: "masters", level: "Tezli Yüksek Lisans" },
    { ...program, key: "non-thesis", level: "Tezsiz Yüksek Lisans" },
    { ...program, key: "empty", programName: "Verisiz Program", level: "Doktora" },
  ].map((scope) => ({ ...scope, label: `${scope.programName} · ${scope.level}`, stats: snapshot.institute }));
  snapshot.filterScopes = ["", program.department].flatMap((mainDepartment) => ["", "Doktora", "Tezli Yüksek Lisans", "Tezsiz Yüksek Lisans"].map((level) => ({ mainDepartment, level, stats: snapshot.institute })));
  snapshot.filterScopes.push({ mainDepartment: "Verisiz ABD", level: "", stats: snapshot.institute }, { mainDepartment: "Verisiz ABD", level: "Doktora", stats: snapshot.institute });
  return snapshot;
}

test("quality filters group parent ABD programs and update every visible section", async () => {
  const { context, catalog, courses } = adminQualityFixture();
  catalog[0].levels.push("Doktora");
  const fullPackage = {
    detailFields: { purpose: "Amaç", content: "İçerik", methods: "Yöntem", resources: "Kaynakça" },
    outcomes: ["Analiz eder"], weeklyTopics: Array(15).fill("Konu"),
    programOutcomes: [{ id: "P1" }], contributionMatrix: [{ P1: 3 }],
    workloads: [{ count: 30, hours: 6 }], assessments: [{ name: "Final", percentage: 100 }], ects: 6,
  };
  courses[0].packageData = { ...fullPackage, sdgs: ["4", "9"] };
  courses[7].packageData = { ...fullPackage, sdgs: ["4"] };
  courses.push({ ...courses[0], code: "ISL9", level: "Doktora", term: "Bahar", status: "Taslak", packageData: { ...fullPackage, sdgs: ["13"] } });
  const qualitySnapshot = JSON.parse(JSON.stringify(await context.buildQualitySnapshot()));
  qualitySnapshot.nextRefreshAt = "2026-11-25T00:00:00.000Z";
  const requests = [];
  const ratio = (value, total) => total ? Math.round(value / total * 1000) / 10 : 0;
  await withPublicPage("/dbp/kalite", {
    qualitySnapshot,
    advisorWorkloadFor: (url) => {
      requests.push(Object.fromEntries(url.searchParams));
      return { generatedAt: qualitySnapshot.generatedAt, summary: { activeStudents: 0, advisorCount: 0, studentsPerAdvisor: null } };
    },
  }, async ({ page }) => {
    const department = page.getByRole("combobox", { name: "ABD / ASD", exact: true });
    const level = page.getByRole("combobox", { name: "Program türü", exact: true });
    await department.waitFor();
    assert.deepEqual(await department.locator("option").allTextContents(), ["Tüm ABD / ASD", "Boş ASD", "İşletme ABD", "Matematik ABD"]);
    assert.equal(await department.locator('option[value="Muhasebe ve Finansman"]').count(), 0);
    const check = async (mainDepartment, track) => {
      const stats = !mainDepartment && !track ? qualitySnapshot.institute
        : qualitySnapshot.filterScopes.find((item) => item.mainDepartment === mainDepartment && item.level === track).stats;
      assert.match(await page.locator(".quality-context-banner").innerText(), new RegExp(`${stats.totalCourses} ders`));
      assert.deepEqual(await page.locator(".quality-kpis article p").allTextContents(), [
        `${stats.completePackages}/${stats.totalCourses} ders`, `${stats.workloadConsistent}/${stats.packagedCourses} paket`,
        `${stats.matrixComplete}/${stats.packagedCourses} paket`, `${stats.weeklyPlanComplete}/${stats.packagedCourses} paket`,
        `${stats.assessmentComplete}/${stats.packagedCourses} paket`, `${stats.sdgCoverageCourses}/${stats.packagedCourses} paket`,
      ]);
      assert.deepEqual(await page.locator(".quality-kpis article strong").allTextContents(), [
        [stats.completePackages, stats.totalCourses], [stats.workloadConsistent, stats.packagedCourses], [stats.matrixComplete, stats.packagedCourses],
        [stats.weeklyPlanComplete, stats.packagedCourses], [stats.assessmentComplete, stats.packagedCourses], [stats.sdgCoverageCourses, stats.packagedCourses],
      ].map(([value, total]) => `%${ratio(value, total)}`));
      for (const [index, values] of [stats.termCounts, stats.levelCounts, stats.typeCounts].entries()) {
        assert.deepEqual(await page.locator(".donut-chart").nth(index).locator("li b").allTextContents(), Object.values(values).filter((value) => value > 0).sort((a, b) => b - a).slice(0, 5).map(String));
      }
      assert.deepEqual(await page.locator(".quality-overview-grid .course-status-summary b").allTextContents(), [stats.approvedCourses, stats.unapprovedCourses, stats.awaitingAssignmentCourses].map(String));
      assert.deepEqual(await page.locator(".evidence-bars article b").allTextContents(), [
        `${stats.completePackages}/${stats.totalCourses}`, ...[stats.outcomesComplete, stats.weeklyPlanComplete, stats.workloadConsistent, stats.matrixComplete, stats.resourcesComplete].map((value) => `${value}/${stats.packagedCourses}`),
      ]);
      assert.deepEqual(await page.locator(".sdg-goal-grid strong").allTextContents(), stats.sdgGoals.map((item) => String(item.count)));
      assert.deepEqual(await page.locator(".instructor-panel tbody tr").evaluateAll((rows) => rows.map((row) => [...row.cells].map((cell) => cell.textContent))), stats.titleLoads.map((row) => [row.title, row.academics, row.assignedCourses, row.theory, row.practice, row.weeklyHours].map(String)));
      assert.deepEqual(await page.locator(".warning-list article > b").allTextContents(), stats.warnings.map((item) => item.code));
      await page.locator(".advisor-panel .course-status-summary").waitFor();
      assert.deepEqual(requests.at(-1), { ...(mainDepartment ? { mainDepartment } : {}), ...(track ? { level: track } : {}) });
    };
    await check("", "");
    await department.selectOption("İşletme ABD");
    await check("İşletme ABD", "");
    await level.selectOption("Tezli Yüksek Lisans");
    await check("İşletme ABD", "Tezli Yüksek Lisans");
    assert.equal(await page.locator(".instructor-panel tbody tr").first().locator("td").nth(1).innerText(), "1", "the same teacher across branches is counted once");
    await level.selectOption("Doktora");
    await check("İşletme ABD", "Doktora");
    await department.selectOption("");
    await check("", "Doktora");
    await department.selectOption("Matematik ABD");
    assert.equal(await level.inputValue(), "", "an unavailable type resets to all types");
    assert.deepEqual(await level.locator("option").allTextContents(), ["Tüm program türleri", "Tezli Yüksek Lisans"]);
    await check("Matematik ABD", "");
    await department.selectOption("Boş ASD");
    await check("Boş ASD", "");
    assert.ok((await page.locator(".quality-kpis article strong").allTextContents()).every((item) => item === "%0"));
    await department.selectOption("İşletme ABD");
    await check("İşletme ABD", "");
    mkdirSync("local-volume/quality-filters", { recursive: true });
    for (const width of [1440, 1000, 390]) {
      await page.setViewportSize({ width, height: 1000 });
      const sizes = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth }));
      assert.ok(sizes.document <= sizes.viewport, JSON.stringify(sizes));
      await page.screenshot({ path: `local-volume/quality-filters/${width}.png`, fullPage: width === 1440 });
    }
  });
});

test("quality advisor statistics follow report scope and appear below instructor loads", async () => {
  const program = { department: "Yönetim Bilişim Sistemleri ABD", programName: "Yönetim Bilişim Sistemleri" };
  const qualitySnapshot = await advisorQualitySnapshot(program);
  const requests = [];
  await withPublicPage("/dbp/kalite", {
    qualitySnapshot,
    advisorWorkloadFor: (url) => {
      requests.push(Object.fromEntries(url.searchParams));
      const level = url.searchParams.get("level");
      const activeStudents = url.searchParams.get("mainDepartment") === "Verisiz ABD" ? 0
        : level === "Doktora" ? 4 : level === "Tezli Yüksek Lisans" ? 10 : level === "Tezsiz Yüksek Lisans" ? 1 : 15;
      const advisorCount = activeStudents === 0 ? 0 : level === "Tezsiz Yüksek Lisans" ? 1 : level ? 2 : 3;
      return { generatedAt: "2026-11-24T12:00:00.000Z", privateAdvisorName: "Never publish this advisor",
        summary: { activeStudents, advisorCount, studentsPerAdvisor: advisorCount ? activeStudents / advisorCount : null } };
    },
  }, async ({ page, apiRequests }) => {
    const card = page.getByRole("region", { name: "Güncel öğrenci ve danışman istatistikleri" });
    const metrics = card.locator(".course-status-summary article b");
    await metrics.first().waitFor();
    assert.equal(await card.evaluate((element) => element.previousElementSibling.classList.contains("instructor-panel")), true);
    assert.deepEqual(await metrics.allTextContents(), ["15", "3", "5,00"]);
    const department = page.getByRole("combobox", { name: "ABD / ASD", exact: true });
    const scope = page.getByRole("combobox", { name: "Program türü", exact: true });
    await department.selectOption(program.department);
    await scope.selectOption("Doktora");
    await card.getByText("2,00", { exact: true }).waitFor();
    assert.deepEqual(await metrics.allTextContents(), ["4", "2", "2,00"]);
    assert.deepEqual(requests.at(-1), { mainDepartment: program.department, level: "Doktora" });
    await scope.selectOption("Tezli Yüksek Lisans");
    await card.getByText("10", { exact: true }).waitFor();
    assert.deepEqual(await metrics.allTextContents(), ["10", "2", "5,00"]);
    await department.selectOption("Verisiz ABD");
    await card.getByText("Bu kapsamda aktif öğrencisi bulunan danışman yok.", { exact: true }).waitFor();
    assert.deepEqual(await metrics.allTextContents(), ["0", "0", "—"]);
    await department.selectOption(program.department);
    await scope.selectOption("Tezsiz Yüksek Lisans");
    await card.getByText("1,00", { exact: true }).waitFor();
    assert.deepEqual(await metrics.allTextContents(), ["1", "1", "1,00"]);
    await department.selectOption("");
    await scope.selectOption("");
    await card.getByText("15", { exact: true }).waitFor();
    assert.deepEqual(await metrics.allTextContents(), ["15", "3", "5,00"]);
    assert.deepEqual(requests.at(-1), {});
    assert.equal(apiRequests.filter((path) => path.endsWith("/student-statistics")).length, 0);
    assert.ok(!(await card.innerText()).includes("Never publish this advisor"));
    await page.setViewportSize({ width: 390, height: 844 });
    const widths = await page.evaluate(() => ({ viewport: window.innerWidth, document: document.documentElement.scrollWidth }));
    assert.ok(widths.document <= widths.viewport, JSON.stringify(widths));
    mkdirSync("local-volume/quality-advisor-statistics", { recursive: true });
    await card.screenshot({ path: "local-volume/quality-advisor-statistics/mobile.png" });
    await page.setViewportSize({ width: 1440, height: 1000 });
    await card.screenshot({ path: "local-volume/quality-advisor-statistics/desktop.png", style: ".oku-header { visibility: hidden; }" });
  });
  await withPublicPage("/dbp/ybs/dr", {}, async ({ page, apiRequests }) => {
    assert.equal(await page.locator(".advisor-panel").count(), 0);
    assert.equal(apiRequests.filter((path) => path.endsWith("/advisor-workload")).length, 0);
  });
});

test("quality advisor statistics preserve error recovery and show actual zero counts", async () => {
  const qualitySnapshot = await advisorQualitySnapshot({ department: "Test ABD", programName: "Test" });
  let fail = true;
  await withPublicPage("/dbp/kalite", {
    qualitySnapshot,
    preparePage: async (page) => {
      await page.route("**/dbp/api/dbp/advisor-workload", (route) => route.fulfill({
        status: fail ? 503 : 200, contentType: "application/json",
        body: JSON.stringify(fail ? { message: "Kaynak servise ulaşılamadı." } : {
          generatedAt: "2026-11-24T12:00:00.000Z", summary: { activeStudents: 0, advisorCount: 0, studentsPerAdvisor: null },
        }),
      }));
    },
  }, async ({ page }) => {
    const card = page.getByRole("region", { name: "Güncel öğrenci ve danışman istatistikleri" });
    await card.getByRole("alert").waitFor();
    assert.match(await card.getByRole("alert").innerText(), /Kaynak servise ulaşılamadı/u);
    assert.equal(await card.locator(".course-status-summary").count(), 0);
    fail = false;
    await card.getByRole("button", { name: "Yeniden dene" }).click();
    await card.getByText("Bu kapsamda aktif öğrencisi bulunan danışman yok.", { exact: true }).waitFor();
    assert.deepEqual(await card.locator(".course-status-summary b").allTextContents(), ["0", "0", "—"]);
  });
});

test("quality advisor scope changes hide old metrics while loading and ignore late responses", async () => {
  const qualitySnapshot = await advisorQualitySnapshot({ department: "Test ABD", programName: "Test" });
  let release, requested, completed;
  const gate = new Promise((resolve) => { release = resolve; });
  const started = new Promise((resolve) => { requested = resolve; });
  const done = new Promise((resolve) => { completed = resolve; });
  await withPublicPage("/dbp/kalite", {
    qualitySnapshot,
    preparePage: async (page) => {
      await page.route("**/dbp/api/dbp/advisor-workload**", async (route) => {
        const level = new URL(route.request().url()).searchParams.get("level");
        if (level === "Tezli Yüksek Lisans") { requested(); await gate; }
        const count = level === "Doktora" ? 4 : 10;
        try {
          await route.fulfill({ contentType: "application/json", body: JSON.stringify({
            generatedAt: "2026-11-24T12:00:00.000Z",
            summary: { activeStudents: count, advisorCount: 2, studentsPerAdvisor: count / 2 },
          }) });
        } finally { if (level === "Tezli Yüksek Lisans") completed(); }
      });
    },
  }, async ({ page }) => {
    const card = page.getByRole("region", { name: "Güncel öğrenci ve danışman istatistikleri" });
    await card.getByText("10", { exact: true }).waitFor();
    const scope = page.getByRole("combobox", { name: "Program türü", exact: true });
    try {
      await scope.selectOption("Tezli Yüksek Lisans");
      await started;
      await card.getByRole("status").waitFor();
      assert.equal(await card.locator(".course-status-summary").count(), 0);
      await scope.selectOption("Doktora");
      await card.getByText("4", { exact: true }).waitFor();
      release();
      await done;
      assert.deepEqual(await card.locator(".course-status-summary b").allTextContents(), ["4", "2", "2,00"]);
    } finally { release(); }
  });
});

test("admin quality report shows every ABD, exports numeric Excel data and fits desktop and mobile", async () => {
  const { context } = adminQualityFixture();
  const report = JSON.parse(JSON.stringify(await context.currentAdminQualityReport()));
  let failReport = false;
  mkdirSync("local-volume/admin-quality-report", { recursive: true });
  await withPublicPage("/dbp/panel", {
    preparePage: async (page) => {
      await page.setViewportSize({ width: 1440, height: 1000 });
      await page.addInitScript(() => localStorage.setItem("lee-dbp-session", JSON.stringify({ name: "Test Admin", username: "test.admin", role: "admin", department: "LEE" })));
      await page.route("**/dbp/api/dbp/**", async (route) => {
        const endpoint = new URL(route.request().url()).pathname.split("/").pop();
        if (endpoint === "quality-report") {
          assert.ok(route.request().headers()["x-dbp-session"]);
          return route.fulfill({ status: failReport ? 503 : 200, contentType: "application/json", body: JSON.stringify(failReport ? { message: "Test rapor hatası" } : report) });
        }
        const payloads = {
          events: { ok: true }, courses: { courses: [], total: 0 }, programs: { programs: report.programCatalog },
          memberships: { memberships: [] }, "role-module-access": { access: { admin: ["my_courses", "quality_reports"] } },
        };
        assert.ok(payloads[endpoint], `Unexpected API: ${endpoint}`);
        return route.fulfill({ contentType: "application/json", body: JSON.stringify(payloads[endpoint]) });
      });
    },
  }, async ({ page }) => {
    await page.locator(".panel-sidebar nav").getByRole("button", { name: "Kalite Kontrol Raporları", exact: true }).click();
    const table = page.locator(".quality-department-table");
    await table.waitFor();
    assert.deepEqual(await page.locator(".quality-stats article b").allTextContents().then((values) => values.slice(0, 6)), ["11", "2", "9", "4", "3", "6"]);
    assert.equal(await table.locator("tbody tr").count(), report.departments.length);
    assert.equal(await table.getByRole("columnheader", { name: "Komisyon Onayı Bekliyor", exact: true }).count(), 1);
    assert.equal(await table.getByRole("rowheader", { name: "Boş ASD", exact: true }).count(), 1);
    const downloadEvent = page.waitForEvent("download");
    await page.getByRole("button", { name: "Excel indir", exact: true }).click();
    const download = await downloadEvent;
    assert.match(download.suggestedFilename(), /^dbp-abd-kalite-raporu-\d{4}-\d{2}-\d{2}\.xlsx$/u);
    await download.saveAs("local-volume/admin-quality-report/report.xlsx");
    const buffer = readFileSync("local-volume/admin-quality-report/report.xlsx");
    assert.equal(buffer.subarray(0, 2).toString(), "PK");
    assert.match(buffer.toString(), /Enstitü toplamı/u);
    const overflow = () => page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    assert.equal(await overflow(), false, "desktop page must fit the viewport");
    await page.screenshot({ path: "local-volume/admin-quality-report/desktop.png", fullPage: true });
    const scroll = page.getByRole("region", { name: "ABD / ASD ders ve onay tablosu", exact: true });
    const first = table.getByRole("rowheader").first();
    const before = await first.boundingBox();
    await scroll.evaluate((element) => { element.scrollLeft = element.scrollWidth; });
    const after = await first.boundingBox();
    assert.ok(Math.abs(before.x - after.x) < 1, "ABD names must remain visible when scrolling status columns");
    await page.locator(".panel-main .theme-toggle").click();
    await page.screenshot({ path: "local-volume/admin-quality-report/dark.png", fullPage: true });
    await page.locator(".panel-main .theme-toggle").click();
    await page.setViewportSize({ width: 390, height: 844 });
    assert.equal(await overflow(), false, "mobile page must fit the viewport");
    const mobileHeader = await page.locator(".panel-header").boundingBox();
    const mobileIntro = await page.locator(".quality-report .panel-intro").boundingBox();
    assert.ok(mobileHeader.y + mobileHeader.height <= mobileIntro.y, "mobile title and report introduction must not overlap");
    await scroll.evaluate((element) => { element.scrollLeft = 0; });
    await page.screenshot({ path: "local-volume/admin-quality-report/mobile.png", fullPage: true });
    await page.screenshot({ path: "local-volume/admin-quality-report/mobile-top.png" });
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.locator(".panel-sidebar nav").getByRole("button", { name: "Ders Bilgi Paketlerim", exact: true }).click();
    failReport = true;
    await page.locator(".panel-sidebar nav").getByRole("button", { name: "Kalite Kontrol Raporları", exact: true }).click();
    await page.getByRole("alert").getByText("Test rapor hatası", { exact: true }).waitFor();
    assert.equal(await table.count(), 0, "failed requests must not display misleading zero counts");
    failReport = false;
    await page.getByRole("button", { name: "Tekrar dene", exact: true }).click();
    await table.waitFor();
  });
});

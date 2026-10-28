import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync, mkdirSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import { queryAudit, auditCsv, auditExportHeaders, auditExportRows } from "../lib/auditTrail.mjs";
import { withPublicPage } from "./helpers/hydrated-public-page.mjs";
import { newCourseImportFixture, newCourseImportRow } from "./helpers/course-create-fixtures.mjs";
import { viewStatisticsTestServer } from "./helpers/view-statistics-fixtures.mjs";

const query = new URLSearchParams({
  ders: "YBS921", bolum: "Yönetim Bilişim Sistemleri ABD",
  program: "Yönetim Bilişim Sistemleri", duzey: "Doktora",
});
const packagePath = `/dbp/katalog?${query}`;
const programPath = "/dbp/programlar/yonetim-bilisim-sistemleri-abd-yonetim-bilisim-sistemleri?duzey=Doktora&sekme=courses";

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
    { code: "MAT866", name: "CEBİRSEL TOPOLOJİYE GİRİŞ", term: "Bahar", instructor: "Doç. Dr. Diğer Hoca" },
  ].map((course, index) => ({ id: index + 1, ...course, department: "Matematik ABD", programName: "Matematik", level: "Tezli Yüksek Lisans", status: "Komisyon Onayı Bekliyor", type: "Seçmeli", theory: 3, practice: 0, ects: 6 }));
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
          case "courses": payload = { courses, total: courses.length, source: "database" }; break;
          case "instructors": payload = { instructors: [], source: "e_enstitu_api" }; break;
          case "course-management": {
            assert.equal(request.method(), "POST");
            const body = request.postDataJSON();
            writes.push(body);
            if (body.action === "assign") Object.assign(courses.find((course) => course.code === body.code), {
              ...(body.term ? { term: body.term } : {}),
              ...(body.newCode ? { code: body.newCode } : {}),
              ...(body.name ? { name: body.name } : {}),
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
    assert.equal(await dialog.getByLabel("Dersin dönemi").inputValue(), "");
    assert.equal(await dialog.getByLabel("Dersi veren öğretim elemanı").inputValue(), "Prof. Dr. Mevcut Hoca");
    await dialog.getByRole("button", { name: "Değişiklikleri Kaydet" }).click();
    assert.equal(writes.length, 0, "a missing term must not silently become fall");
    await dialog.getByLabel("Müfredattaki ders").selectOption("MAT866");
    assert.equal(await dialog.getByLabel("Dersin dönemi").inputValue(), "Bahar");
    assert.equal(await dialog.getByLabel("Dersi veren öğretim elemanı").inputValue(), "Doç. Dr. Diğer Hoca");
    await dialog.getByLabel("Müfredattaki ders").selectOption("MAT864");
    await dialog.getByLabel("Dersin dönemi").selectOption("Bahar");
    await dialog.getByRole("button", { name: "Değişiklikleri Kaydet" }).click();
    await dialog.getByRole("status").getByText("Ders bilgileri kaydedildi.", { exact: true }).waitFor();
    assert.equal(writes[0].term, "Bahar");
    assert.equal(Object.hasOwn(writes[0], "instructor"), false, "term-only edits preserve the latest instructor and identity fields");
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
    await dialog.getByRole("button", { name: "Dersi Oluştur" }).click();
    await dialog.getByRole("status").getByText("Yeni ders oluşturuldu.", { exact: true }).waitFor();
    assert.equal(writes[1].term, "Güz ve Bahar");
    assert.equal(writes[1].instructor, "");
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
          case "obs-course-draft": payload = { draft: { code: "OTHER801", name: "OBS Başka Ders", details: { purpose: "OBS purpose" }, outcomes: [], assessments: [], workloads: {}, weeklyTopics: {}, structures: {}, contributionMatrix: [], sdgs: [] } }; break;
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
    await page.getByLabel("OBS ders detay linki").fill("https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=1");
    await page.getByRole("button", { name: "Dersi Getir", exact: true }).click();
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

test("the same BES801 code keeps its department-specific group and term", async () => {
  for (const [slug, section, term] of [
    ["arkeoloji-abd-arkeoloji", "Güz Yarıyılı", "Güz"],
    ["tarih-abd-tarih", "Ortak / Süreç Dersleri", "Güz ve Bahar"],
  ]) {
    const params = new URLSearchParams({ duzey: "Tezli Yüksek Lisans", sekme: "courses" });
    await withPublicPage(`/dbp/programlar/${slug}?${params}`, {}, async ({ page }) => {
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

import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { withPublicPage } from "./helpers/hydrated-public-page.mjs";
import { newCourseImportFixture, newCourseImportRow } from "./helpers/course-create-fixtures.mjs";

const query = new URLSearchParams({
  ders: "YBS921", bolum: "Yönetim Bilişim Sistemleri ABD",
  program: "Yönetim Bilişim Sistemleri", duzey: "Doktora",
});
const packagePath = `/dbp/katalog?${query}`;
const programPath = "/dbp/programlar/yonetim-bilisim-sistemleri-abd-yonetim-bilisim-sistemleri?duzey=Doktora&sekme=courses";

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
          case "access": payload = { modules: ["my_courses"] }; break;
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
    const dialog = page.getByRole("dialog", { name: "Ders Düzenleme" });
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
    assert.ok(box.y >= 0 && box.y + box.height <= 844);
    await page.screenshot({ path: "local-volume/test-failure-audit/course-import-mobile.png" });
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.screenshot({ path: "local-volume/test-failure-audit/course-import-desktop.png" });
    await panel.getByRole("button", { name: "2 Yeni Dersi Ekle", exact: true }).click();
    await panel.getByRole("status").filter({ hasText: "2 yeni ders eklendi." }).waitFor();
    assert.equal(db.prepare("SELECT COUNT(*) AS count FROM courses").get().count, 3);
    assert.equal(db.prepare("SELECT instructor FROM courses WHERE code = 'MAT866'").get().instructor, "");
    assert.equal(db.prepare("SELECT instructor_tc_kimlik FROM courses WHERE code = 'MAT868'").get().instructor_tc_kimlik, "01234567890");
    assert.deepEqual(db.prepare("SELECT * FROM courses WHERE id = 1").get(), original);
    await dialog.getByRole("button", { name: "Liste ile Atama Yap", exact: true }).click();
    assert.equal(await dialog.getByRole("region", { name: "Excel ile toplu yeni ders" }).count(), 0);
  });
});

test("institute manager creates courses with explicit terms and corrects existing terms without resending the instructor", async () => {
  const courses = [
    { code: "MAT864", name: "ANALİZDEN SEÇME KONULAR II", term: "", instructor: "Prof. Dr. Mevcut Hoca" },
    { code: "MAT866", name: "CEBİRSEL TOPOLOJİYE GİRİŞ", term: "Bahar", instructor: "Doç. Dr. Diğer Hoca" },
  ].map((course) => ({ ...course, department: "Matematik ABD", programName: "Matematik", level: "Tezli Yüksek Lisans", status: "Komisyon Onayı Bekliyor", type: "Seçmeli", theory: 3, practice: 0, ects: 6 }));
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
          case "access": payload = { modules: ["my_courses"] }; break;
          case "memberships": payload = { memberships: [] }; break;
          case "courses": payload = { courses, total: courses.length, source: "database" }; break;
          case "instructors": payload = { instructors: [], source: "e_enstitu_api" }; break;
          case "course-management": {
            assert.equal(request.method(), "POST");
            const body = request.postDataJSON();
            writes.push(body);
            if (body.action === "assign") Object.assign(courses.find((course) => course.code === body.code), { term: body.term });
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
    const dialog = page.getByRole("dialog", { name: "Ders Düzenleme" });
    await dialog.getByLabel("Ana ABD / ASD Başkanlığı").selectOption({ label: "Matematik ABD" });
    await dialog.getByLabel("İlgili ABD / ASD ve program").selectOption("Matematik ABD||Matematik");
    await dialog.getByRole("button", { name: "Mevcut Ders", exact: true }).click();
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
    await dialog.waitFor({ state: "hidden" });
    assert.equal(writes[0].term, "Bahar");
    assert.equal(Object.hasOwn(writes[0], "instructor"), false, "term-only edits preserve the latest instructor and identity fields");
    await open();
    assert.equal(await dialog.getByLabel("Dersin dönemi").inputValue(), "Bahar");
    await dialog.getByRole("button", { name: "Yeni Ders", exact: true }).click();
    assert.equal(await dialog.getByLabel("Dersin dönemi").inputValue(), "");
    await dialog.getByLabel("Ders kodu", { exact: true }).fill("MAT868");
    await dialog.getByLabel("Ders adı", { exact: true }).fill("REEL ANALİZ");
    for (const label of ["Teorik", "Kredi"]) await dialog.getByLabel(label, { exact: true }).fill("3");
    await dialog.getByLabel("Uygulama", { exact: true }).fill("0");
    await dialog.getByLabel("AKTS", { exact: true }).fill("6");
    await dialog.getByLabel("Dersi veren öğretim elemanı").fill("Şimdilik boş / atama bekliyor");
    await dialog.getByLabel("Dersin dönemi").selectOption("Güz ve Bahar");
    await dialog.getByRole("button", { name: "Dersi Oluştur" }).click();
    await dialog.waitFor({ state: "hidden" });
    assert.equal(writes[1].term, "Güz ve Bahar");
    assert.equal(writes[1].instructor, "");
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

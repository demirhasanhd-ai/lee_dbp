import assert from "node:assert/strict";
import test from "node:test";
import { mkdirSync } from "node:fs";
import { withPublicPage } from "./helpers/hydrated-public-page.mjs";

test("OBS search previews full content without writes, imports only after approval and preserves provenance", async () => {
  const course = { id: 1, code: "MAT864", name: "Araştırma Yöntemleri", department: "Matematik ABD", programName: "Matematik", level: "Tezli Yüksek Lisans", instructor: "Test Akademisyen", status: "Taslak" };
  const program = { id: "1", name: "Matematik Tezli Yüksek Lisans", faculty: "Lisansüstü Eğitim Enstitüsü", facultyId: "04" };
  const draft = { sourceUrl: "https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=123&lang=tr", obsCourseId: "123", code: course.code, name: course.name,
    semester: 1, theory: 3, practice: 0, lab: 0, credit: 3, ects: 6, updatedAt: "29.10.2026", totalWorkload: 180,
    details: { program: program.name, language: "Türkçe", level: "Yüksek Lisans", type: "Seçmeli", teachingMode: "Yüz Yüze", purpose: "ÖBS araştırma amacı", content: "Bilimsel yöntem ve araştırma etiği", methods: "Anlatım ve uygulama", prerequisites: "Yok", instructors: "Dr. Öğr. Üyesi Test Akademisyen", coordinator: "Test Akademisyen", assistants: "Yok" },
    outcomes: ["Araştırma tasarlar.", "Etik ilkeleri uygular."], assessments: [{ id: 1, name: "Ara Sınav", count: 1, weight: 40, fixed: true }, { id: 2, name: "Yarıyıl Sonu Sınavı", count: 1, weight: 60, fixed: true }],
    workloads: { "Ders Süresi": { count: 15, hours: 3 }, "Sınıf Dışı Çalışma": { count: 15, hours: 9 } },
    weeklyTopics: { 1: "ÖBS birinci hafta\nÖn Hazırlık: Makale okuma", 2: "Araştırma etiği" }, structures: { "Alan Bilgisi": 100 }, resources: "ÖBS kaynak kitabı",
    contributionMatrix: [Object.fromEntries(Array.from({ length: 11 }, (_, i) => [`P${i + 1}`, 5])), Object.fromEntries(Array.from({ length: 11 }, (_, i) => [`P${i + 1}`, 4]))],
  };
  const candidate = { id: "1:2026:123", sourceUrl: draft.sourceUrl, obsCourseId: "123", code: course.code, name: course.name, program,
    curriculum: { value: "2026", name: "2026 Matematik Müfredatı", year: 2026, current: true }, updatedAt: draft.updatedAt, ects: 6,
    instructors: draft.details.instructors, instructorMatch: true, matchReason: "Ders kodu eşleşiyor", matchScore: 100,
    summary: { outcomes: 2, weeks: 2, matrix: true, assessments: 2, workloads: 2, purpose: true, content: true } };
  const job = { id: "test-job", status: "completed", program, progress: { phase: "done", message: "2 aday ders bulundu.", completed: 2, total: 2 },
    candidates: [candidate, { ...candidate, id: "1:2025:124", sourceUrl: draft.sourceUrl.replace("123", "124"), curriculum: { value: "2025", name: "2025 Matematik Müfredatı", year: 2025, current: false } }], warnings: ["2024 müfredatındaki bir dersin detayı boş."], scannedAt: "2026-10-29T10:00:00Z" };
  const originalMatrix = [{ P1: 2, P2: 3 }];
  let stored = { identity: { code: course.code, name: course.name, theory: "3", practice: "0", credit: "3", level: course.level, type: "Seçmeli", language: "Türkçe" },
    detailFields: { purpose: "Önceden yazılmış amaç", content: "", methods: "", prerequisites: "", instructors: "", coordinator: "", assistants: "", resources: "" },
    outcomes: ["", ""], contributionMatrix: originalMatrix };
  const writes = [];
  let polls = 0;
  await withPublicPage("/dbp/panel", { preparePage: async (page) => {
    await page.addInitScript(() => localStorage.setItem("lee-dbp-session", JSON.stringify({ name: "Test Akademisyen", username: "test.teacher", role: "akademisyen", department: "Matematik ABD" })));
    await page.route("**/dbp/api/dbp/**", async (route) => {
      const request = route.request(); const url = new URL(request.url()); const endpoint = url.pathname.split("/").pop();
      let payload;
      switch (endpoint) {
        case "events": payload = { ok: true }; break;
        case "access": payload = { modules: ["my_courses"] }; break;
        case "programs": payload = { programs: [{ ...course, mainDepartment: course.department, levels: [course.level] }] }; break;
        case "memberships": payload = { memberships: [] }; break;
        case "my-courses": payload = { courses: [course], total: 1, source: "database" }; break;
        case "course-package":
          if (request.method() === "POST") { const body = request.postDataJSON(); writes.push(body); stored = body.package; payload = { ok: true, status: "Taslak" }; }
          else payload = { package: stored, status: "Taslak" };
          break;
        case "obs-programs": payload = { programs: [program], suggestedProgramId: program.id }; break;
        case "obs-course-search":
          if (request.method() === "POST") { assert.equal(request.postDataJSON().programId, "1"); polls = 0; payload = { job: { ...job, status: "running", candidates: [], progress: { phase: "curricula", message: "Müfredatlar okunuyor…", completed: 0, total: 2 } } }; }
          else if (request.method() === "DELETE") payload = { job: { ...job, status: "cancelled" } };
          else { polls++; payload = { job }; }
          break;
        case "obs-course-draft": payload = { draft: { ...draft, sourceUrl: request.postDataJSON().url } }; break;
        default: assert.fail(`Unexpected API ${endpoint}`);
      }
      await route.fulfill({ contentType: "application/json", body: JSON.stringify(payload) });
    });
  } }, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.locator(".role-course-sections").getByRole("button", { name: "Görüntüle", exact: true }).first().click();
    const form = page.locator(".course-bologna-form");
    const open = form.getByRole("button", { name: /OBS.den Doldur/u });
    await open.click();
    const dialog = page.getByRole("dialog");
    await page.getByRole("button", { name: "ÖBS’de Bu Dersi Ara", exact: true }).click();
    await page.getByRole("heading", { name: "2 aday ders" }).waitFor();
    assert.ok(polls > 0);
    assert.equal(writes.length, 0);
    assert.equal(await page.locator(".obs-candidate").count(), 2);
    mkdirSync("outputs/obs-import", { recursive: true });
    await page.screenshot({ path: "outputs/obs-import/search-desktop.png" });
    await page.getByRole("button", { name: "İçeriği Önizle", exact: true }).first().click();
    await page.getByRole("heading", { name: "Ders içeriği önizlemesi" }).waitFor();
    assert.equal(await form.locator('textarea[name="Dersin Amacı"]').inputValue(), "Önceden yazılmış amaç");
    assert.equal(writes.length, 0);
    for (const text of ["ÖBS araştırma amacı", "ÖBS kaynak kitabı", "Araştırma tasarlar.", "Makale okuma"]) assert.ok((await dialog.textContent()).includes(text));
    assert.equal(await dialog.getByRole("button", { name: "Tümünü Değiştir", exact: true }).isDisabled(), true);
    const matrix = page.getByLabel("Kaynak ve hedef programın PÇ metinlerini karşılaştırdım; bu katkı matrisini de aktar.");
    assert.equal(await matrix.isChecked(), false);
    await page.screenshot({ path: "outputs/obs-import/preview-desktop.png" });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: "outputs/obs-import/preview-mobile.png" });
    const mobile = await page.evaluate(() => ({ width: innerWidth, document: document.documentElement.scrollWidth, dialog: document.querySelector('.obs-browser')?.getBoundingClientRect().width,
      wide: [...document.querySelectorAll('.obs-browser *')].filter((element) => element.getBoundingClientRect().right > innerWidth + 1).slice(0, 8).map((element) => ({ tag: element.tagName, class: element.className, width: element.getBoundingClientRect().width })) }));
    assert.equal(mobile.dialog, mobile.width, JSON.stringify(mobile));
    assert.equal(await dialog.evaluate((element) => element.scrollWidth <= element.clientWidth), true);
    await page.screenshot({ path: "outputs/obs-import/preview-mobile.png" });
    // Empty-only import preserves the teacher's text and the existing program matrix.
    await page.getByRole("button", { name: "Boş Alanları Doldur", exact: true }).click();
    assert.equal(await page.getByRole("dialog").count(), 0);
    assert.equal(await form.locator('textarea[name="Dersin Amacı"]').inputValue(), "Önceden yazılmış amaç");
    assert.equal(await form.locator('textarea[name="Dersin İçeriği"]').inputValue(), draft.details.content);
    assert.equal(writes.length, 0);
    await page.setViewportSize({ width: 1440, height: 1000 });
    await form.getByRole("button", { name: "Taslağı Kaydet", exact: true }).click();
    await page.waitForFunction(() => !document.querySelector('.course-submit-actions button.draft')?.disabled);
    assert.equal(writes.length, 1);
    assert.equal(writes[0].package.obsSourceUrl, draft.sourceUrl);
    assert.equal(writes[0].package.obsImportSource.curriculum, candidate.curriculum.name);
    assert.equal(writes[0].package.contributionMatrix[0].P1, 2);
    // Merely previewing another source must not replace the already imported source.
    await open.click(); await page.getByRole("tab", { name: "Bağlantıyla getir" }).click();
    await page.getByLabel("ÖBS ders detay bağlantısı").fill(draft.sourceUrl.replace("123", "999"));
    await page.getByRole("button", { name: "Dersi Getir ve Önizle" }).click();
    await page.getByRole("heading", { name: "Ders içeriği önizlemesi" }).waitFor();
    await page.keyboard.press("Escape");
    await form.getByRole("button", { name: "Taslağı Kaydet", exact: true }).click();
    await page.waitForFunction(() => !document.querySelector('.course-submit-actions button.draft')?.disabled);
    assert.equal(writes.length, 2); assert.equal(writes[1].package.obsSourceUrl, draft.sourceUrl);
    // Full replacement requires explicit confirmation and can include a compatible matrix.
    await open.click(); await page.getByRole("tab", { name: "Bağlantıyla getir" }).click();
    await page.getByLabel("ÖBS ders detay bağlantısı").fill(draft.sourceUrl);
    await page.getByRole("button", { name: "Dersi Getir ve Önizle" }).click();
    await page.getByRole("heading", { name: "Ders içeriği önizlemesi" }).waitFor();
    await matrix.check();
    await page.getByLabel("Aktarılan bölümlerde mevcut içeriğin değiştirilmesini onaylıyorum.").check();
    await page.getByRole("button", { name: "Tümünü Değiştir", exact: true }).click();
    assert.equal(await form.locator('textarea[name="Dersin Amacı"]').inputValue(), draft.details.purpose);
    assert.equal(await form.getByLabel("Kodu", { exact: true }).inputValue(), course.code);
    await form.getByRole("button", { name: "Taslağı Kaydet", exact: true }).click();
    await page.waitForFunction(() => !document.querySelector('.course-submit-actions button.draft')?.disabled);
    assert.equal(writes[2].package.contributionMatrix[0].P1, 5);
    assert.equal(writes[2].package.obsImportSource.matrixIncluded, true);
  });
});

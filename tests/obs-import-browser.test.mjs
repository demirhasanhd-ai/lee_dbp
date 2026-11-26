import assert from "node:assert/strict";
import test from "node:test";
import { mkdirSync } from "node:fs";
import { withPublicPage } from "./helpers/hydrated-public-page.mjs";
import { COURSE_STRUCTURE_LABELS } from "../lib/courseStructures.mjs";

test("all added learning outcomes block submission until every field meets the shared rules", async () => {
  const course = { id: 1, code: "GTB811", name: "Öğrenme Çıktısı Deneme Dersi", department: "Gıda Teknolojisi ABD", programName: "Gıda Teknolojisi", level: "Tezli Yüksek Lisans", instructor: "Test Akademisyen", status: "Taslak" };
  const stored = {
    identity: { code: course.code, name: course.name, theory: "3", practice: "0", credit: "3", level: course.level, type: "Seçmeli", language: "Türkçe" },
    detailFields: {
      purpose: "Temel araştırma yöntemlerini uygulama becerisi kazandırmak.",
      content: "Temel araştırma yöntemleri ve bilimsel etik ilkeleri.",
      methods: "Anlatım ve örnek olay incelemesi.", resources: "Temel bilimsel araştırma yöntemleri kitabı.",
      prerequisites: "Yok", instructors: "Test Akademisyen", coordinator: "Test Akademisyen", assistants: "Yok",
    },
    outcomes: Array(5).fill("Alanındaki temel kavramları örneklerle açıklar."),
    contributionMatrix: Array.from({ length: 5 }, () => ({ P1: 3 })),
    assessments: [{ id: 1, name: "Ara Sınav", count: 1, weight: 40 }, { id: 2, name: "Yarıyıl Sonu Sınavı", count: 1, weight: 60 }],
    workloads: { "Ders Süresi": { count: 15, hours: 3 }, "Sınıf Dışı Çalışma": { count: 15, hours: 9 } },
    weeklyTopics: Object.fromEntries(Array.from({ length: 15 }, (_, i) => [i + 1, "Temel araştırma yöntemleri incelemesi"])),
    structureValues: { "Alan Bilgisi": 100 }, sdgs: ["4"],
  };
  let writes = 0;
  await withPublicPage("/dbp/panel", { preparePage: async (page) => {
    await page.addInitScript((department) => localStorage.setItem("lee-dbp-session", JSON.stringify({ name: "Test Akademisyen", username: "test.teacher", role: "akademisyen", department })), course.department);
    await page.route("**/dbp/api/dbp/**", async (route) => {
      const request = route.request();
      const endpoint = new URL(request.url()).pathname.split("/").pop();
      if (endpoint === "course-package" && request.method() !== "GET") writes++;
      const payloads = {
        events: { ok: true }, access: { modules: ["my_courses"] }, memberships: { memberships: [] },
        programs: { programs: [{ ...course, mainDepartment: course.department, levels: [course.level] }] },
        "my-courses": { courses: [course], total: 1, source: "database" },
        "course-package": { package: stored, status: "Taslak", programOutcomes: [{ id: "P1", text: "Alanındaki temel bilgileri uygular." }] },
      };
      assert.ok(payloads[endpoint], `Unexpected API ${endpoint}`);
      await route.fulfill({ contentType: "application/json", body: JSON.stringify(payloads[endpoint]) });
    });
  } }, async ({ page }) => {
    await page.locator(".role-course-sections").getByRole("button", { name: "Görüntüle", exact: true }).first().click();
    const form = page.locator(".course-bologna-form");
    const submit = form.getByRole("button", { name: "Onaya gönder", exact: true });
    await form.locator('.outcome-quality.good').nth(4).waitFor();
    assert.equal(await submit.isEnabled(), true, (await form.locator('.publish-validation').allTextContents()).join(" "));

    await form.getByRole("button", { name: "ÖÇ Ekle", exact: true }).click();
    const sixth = form.locator('.learning-outcomes>div').nth(5);
    assert.equal(await submit.isDisabled(), true);
    assert.match(await sixth.textContent(), /boş bırakılamaz/u);
    await sixth.locator('textarea').fill("Ders kapsamında temel ilkeleri bilir ve öğrenir.");
    for (const phrase of ["“bilir”", "“öğrenir”", "“ders kapsamında”", "Kabul edilen ölçülebilir fiillerden biri bulunamadı"]) {
      assert.ok((await sixth.locator('.outcome-quality-messages').textContent()).includes(phrase), phrase);
    }
    assert.equal(await sixth.locator('.outcome-quality-messages>p').count(), 3);
    await sixth.getByText(/Kabul edilen fiiller/).click();
    assert.ok((await sixth.locator('.outcome-accepted-verbs').textContent()).includes("fark eder"));

    await form.getByRole("button", { name: "ÖÇ Ekle", exact: true }).click();
    const seventh = form.locator('.learning-outcomes>div').nth(6);
    await seventh.locator('textarea').fill("Bu dersin temel ilkelerini açıklar ve uygular.");
    assert.match(await seventh.textContent(), /2 eylem.*“açıklar”.*“uygular”/u);
    assert.equal(await form.locator('.publish-validation li').filter({ hasText: /^ÖÇ6:/ }).count(), 1);
    assert.equal(await form.locator('.publish-validation li').filter({ hasText: /^ÖÇ7:/ }).count(), 1);
    assert.equal(await submit.isDisabled(), true);

    await sixth.locator('textarea').fill("Çevresindeki temel güvenlik risklerini fark eder.");
    await seventh.locator('textarea').fill("Temel ilke, kural, yöntem ve araçları açıklar.");
    await form.getByLabel("ÖÇ6 P1 katkısı", { exact: true }).selectOption("3");
    await form.getByLabel("ÖÇ7 P1 katkısı", { exact: true }).selectOption("3");
    assert.equal(await form.locator('.outcome-quality.good').count(), 7);
    assert.equal(await submit.isEnabled(), true);

    await form.getByRole("button", { name: "ÖÇ Ekle", exact: true }).click();
    assert.equal(await submit.isDisabled(), true);
    await form.getByRole("button", { name: "ÖÇ 8 sil", exact: true }).click();
    assert.equal(await submit.isEnabled(), true);
    await form.getByRole("button", { name: "ÖÇ 7 sil", exact: true }).click();
    await form.getByRole("button", { name: "ÖÇ 6 sil", exact: true }).click();
    assert.equal(await form.locator('.learning-outcomes textarea').count(), 5);
    assert.equal(await form.getByRole("button", { name: "ÖÇ 5 sil", exact: true }).isDisabled(), true);
    assert.equal(await submit.isEnabled(), true);
    assert.equal(writes, 0, "validation must not save or submit application data");
  });
});

test("OBS search previews full content without writes, imports only after approval and preserves provenance", async () => {
  const course = { id: 1, code: "GTB811", name: "Gıdalardaki Pestisit Kalıntıları ve Risk Değerlendirmesi", department: "Gıda Teknolojisi ABD", programName: "Gıda Teknolojisi", level: "Tezli Yüksek Lisans", instructor: "Test Akademisyen", status: "Taslak", type: "Zorunlu", credit: 0 };
  const program = { id: "1", name: "Gıda Teknolojisi Tezli Yüksek Lisans", faculty: "Lisansüstü Eğitim Enstitüsü", facultyId: "04" };
  const draft = { sourceUrl: "https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=123&lang=tr", obsCourseId: "123", code: course.code, name: course.name,
    semester: 1, theory: 3, practice: 0, lab: 0, credit: 3, ects: 6, updatedAt: "29.10.2026", totalWorkload: 180,
    details: { program: program.name, language: "Türkçe", level: "Yüksek Lisans", type: "Seçmeli", teachingMode: "Yüz Yüze", purpose: "ÖBS araştırma amacı", content: "Bilimsel yöntem ve araştırma etiği", methods: "Anlatım ve uygulama", prerequisites: "Yok", instructors: "Dr. Öğr. Üyesi Test Akademisyen", coordinator: "Test Akademisyen", assistants: "Yok" },
    outcomes: ["Araştırma tasarlar.", "Etik ilkeleri uygular."], assessments: [{ id: 1, name: "Ara Sınav", count: 1, weight: 40, fixed: true }, { id: 2, name: "Yarıyıl Sonu Sınavı", count: 1, weight: 60, fixed: true }],
    workloads: { "Ders Süresi": { count: 15, hours: 3 }, "Sınıf Dışı Çalışma": { count: 15, hours: 9 } },
    weeklyTopics: { 1: "ÖBS birinci hafta\nÖn Hazırlık: Makale okuma", 2: "Araştırma etiği" }, structures: Object.fromEntries(COURSE_STRUCTURE_LABELS.map((label) => [label, label === "Alan Bilgisi" ? 100 : 0])), resources: "ÖBS kaynak kitabı",
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
    outcomes: ["", ""], contributionMatrix: originalMatrix,
    structureValues: { "Fen Bilimleri": 15, "Alan Bilgisi": 60, "Laboratuvar / Araştırma": 25 } };
  const writes = [];
  let polls = 0;
  let programOutcomeCount = 11;
  await withPublicPage("/dbp/panel", { preparePage: async (page) => {
    await page.addInitScript((department) => localStorage.setItem("lee-dbp-session", JSON.stringify({ name: "Test Akademisyen", username: "test.teacher", role: "akademisyen", department })), course.department);
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
          else payload = {
            package: stored, course, status: "Taslak",
            programOutcomes: Array.from({ length: programOutcomeCount }, (_, i) => ({ id: `P${i + 1}`, text: `Program çıktısı ${i + 1}` })),
          };
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
    const structureIssue = form.getByText("Ders yapısı oranlarının toplamı %100 olmalıdır (mevcut: %75).", { exact: true });
    await structureIssue.waitFor({ state: "attached" });
    assert.equal(await form.locator('.structure-grid input').count(), 8);
    assert.equal(await form.locator('input[name="Fen Bilimleri"]').inputValue(), "15");
    assert.equal(await form.locator('input[name="Alan Bilgisi"]').inputValue(), "60");
    assert.equal(await form.getByRole("button", { name: "Onaya gönder", exact: true }).isDisabled(), true);
    assert.equal(writes.length, 0, "opening an existing package must not save it");
    assert.equal(await form.locator('input[name="Dersin türü"]').inputValue(), "Zorunlu");
    assert.equal(await form.locator('input[name="Dersin türü"]').getAttribute("readonly"), "");
    assert.equal(await form.locator('input[name="Kredi"]').inputValue(), "0");
    assert.equal(await form.locator('input[name="Kredi"]').getAttribute("readonly"), "");
    await form.locator('input[name="Matematik ve Temel Bilimler"]').fill("25");
    assert.equal(await form.getByText(/Ders yapısı oranlarının toplamı/).count(), 0);
    await form.locator('input[name="Matematik ve Temel Bilimler"]').fill("0");
    await structureIssue.waitFor({ state: "attached" });
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
    assert.equal(writes[0].package.identity.type, "Zorunlu", "OBS cannot override the managed course type");
    assert.equal(writes[0].package.identity.credit, "0", "OBS cannot override zero credit");
    assert.deepEqual(Object.keys(writes[0].package.structureValues), COURSE_STRUCTURE_LABELS);
    assert.equal(writes[0].package.structureValues["Fen Bilimleri"], 15);
    assert.equal(writes[0].package.structureValues["Alan Bilgisi"], 60);
    assert.equal(Object.values(writes[0].package.structureValues).reduce((sum, value) => sum + value, 0), 75);
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
    assert.equal(await form.getByText(/Ders yapısı oranlarının toplamı/).count(), 0);
    assert.equal(await form.locator('textarea[name="Dersin Amacı"]').inputValue(), draft.details.purpose);
    assert.equal(await form.getByLabel("Kodu", { exact: true }).inputValue(), course.code);
    await form.getByRole("button", { name: "Taslağı Kaydet", exact: true }).click();
    await page.waitForFunction(() => !document.querySelector('.course-submit-actions button.draft')?.disabled);
    assert.equal(writes[2].package.contributionMatrix[0].P1, 5);
    assert.equal(writes[2].package.obsImportSource.matrixIncluded, true);
    assert.equal(writes[2].package.structureValues["Laboratuvar / Araştırma"], undefined);
    assert.equal(Object.values(writes[2].package.structureValues).reduce((sum, value) => sum + value, 0), 100);

    programOutcomeCount = 12;
    await page.reload();
    await page.locator(".role-course-sections").getByRole("button", { name: "Görüntüle", exact: true }).first().click();
    const added = form.getByLabel("ÖÇ1 P12 katkısı", { exact: true });
    assert.equal(await added.inputValue(), "");
    assert.equal(await form.getByLabel("ÖÇ1 P1 katkısı", { exact: true }).inputValue(), "5");
    assert.equal(await form.getByRole("columnheader", { name: "PÇ12", exact: true }).getAttribute("title"), "Program çıktısı 12");
    await added.selectOption("4");
    await form.getByRole("button", { name: "Taslağı Kaydet", exact: true }).click();
    await page.waitForFunction(() => !document.querySelector('.course-submit-actions button.draft')?.disabled);
    assert.equal(writes[3].package.contributionMatrix[0].P12, 4);
  });
});

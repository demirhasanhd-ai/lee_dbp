import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const okuWebsiteFooterLink =
  /<a(?=[^>]*\bhref=["']https:\/\/osmaniye\.edu\.tr["'])(?=[^>]*\btarget=["']_blank["'])(?=[^>]*\brel=["']noopener noreferrer["'])[^>]*>\s*OKÜ Web Sitesi\s*<\/a>/i;

async function packageVersion() {
  const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
  return packageJson.version;
}

async function render(environment = {}, path = "/dbp/") {
  const previousEnvironment = new Map();
  for (const [key, value] of Object.entries(environment)) {
    previousEnvironment.set(key, process.env[key]);
    process.env[key] = value;
  }

  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  try {
    const { default: worker } = await import(workerUrl.href);

    return await worker.fetch(
      new Request(`http://localhost${path}`, {
        headers: { accept: "text/html" },
      }),
      {
        ASSETS: {
          fetch: async () => new Response("Not found", { status: 404 }),
        },
      },
      {
        waitUntil() {},
        passThroughOnException() {},
      },
    );
  } finally {
    for (const [key, value] of previousEnvironment) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
}

test("course package sidebar resolves the YBS doctorate context", async () => {
  const path = "/dbp/katalog?ders=YBS921&bolum=Y%C3%B6netim%20Bili%C5%9Fim%20Sistemleri%20ABD&program=Y%C3%B6netim%20Bili%C5%9Fim%20Sistemleri&duzey=Doktora";
  const response = await render({}, path);
  const html = await response.text();

  assert.match(html, /Y\u00f6netim Bili\u015fim Sistemleri ABD/u);
  assert.doesNotMatch(html, /Aile Dan\u0131\u015fmanl\u0131\u011f\u0131 ve E\u011fitimi ABD/u);
  assert.match(html, /programKey=yonetim-bilisim-sistemleri-abd-yonetim-bilisim-sistemleri/);
  assert.match(html, /duzey=Doktora/);
});

test("duplicate course codes keep their department context", async () => {
  const familyPath = "/dbp/katalog?ders=DAN801&bolum=Aile%20Dan%C4%B1%C5%9Fmanl%C4%B1%C4%9F%C4%B1%20ve%20E%C4%9Fitimi%20ABD&program=Aile%20Dan%C4%B1%C5%9Fmanl%C4%B1%C4%9F%C4%B1%20ve%20E%C4%9Fitimi&duzey=Tezli%20Y%C3%BCksek%20Lisans";
  const biologyPath = "/dbp/katalog?ders=DAN801&bolum=Biyoloji%20ABD&program=Biyoloji&duzey=Tezli%20Y%C3%BCksek%20Lisans";
  const [familyResponse, biologyResponse] = await Promise.all([
    render({}, familyPath),
    render({}, biologyPath),
  ]);
  const [familyHtml, biologyHtml] = await Promise.all([
    familyResponse.text(),
    biologyResponse.text(),
  ]);

  assert.match(familyHtml, /Aile Dan\u0131\u015fmanl\u0131\u011f\u0131 ve E\u011fitimi ABD/u);
  assert.match(biologyHtml, /Biyoloji ABD/);
  assert.doesNotMatch(biologyHtml, /Aile Dan\u0131\u015fmanl\u0131\u011f\u0131 ve E\u011fitimi ABD/u);
});

test("YBS common course aliases keep their code and share the complete package", async () => {
  const context = "&bolum=yonetim-bilisim-sistemleri&program=doktora&duzey=Doktora";
  const [specializationOne, specializationTwo, thesisOne, thesisTwo] = await Promise.all([
    render({}, `/dbp/katalog?ders=YBS901${context}`),
    render({}, `/dbp/katalog?ders=YBS904${context}`),
    render({}, `/dbp/katalog?ders=YBS912${context}`),
    render({}, `/dbp/katalog?ders=YBS916${context}`),
  ]);
  const pages = await Promise.all(
    [specializationOne, specializationTwo, thesisOne, thesisTwo].map((response) => response.text()),
  );

  assert.match(pages[0], /YBS901/);
  assert.match(pages[1], /YBS904/);
  assert.match(pages[0], /Uzmanlık alanı ve araştırma hedeflerinin belirlenmesi/u);
  assert.match(pages[1], /Uzmanlık alanı ve araştırma hedeflerinin belirlenmesi/u);
  assert.match(pages[0], /Dönem çalışmasının genel değerlendirmesi ve ilerleme raporu/u);
  assert.match(pages[1], /Dönem çalışmasının genel değerlendirmesi ve ilerleme raporu/u);
  assert.match(pages[2], /YBS912/);
  assert.match(pages[3], /YBS916/);
  assert.match(pages[2], /Dönem ilerlemesinin raporlanması ve sonraki aşamanın planlanması/u);
  assert.match(pages[3], /Dönem ilerlemesinin raporlanması ve sonraki aşamanın planlanması/u);
});

test("YBS doctorate public catalog contains one canonical record per repeated process course", async () => {
  const path = "/dbp/programlar/yonetim-bilisim-sistemleri-abd-yonetim-bilisim-sistemleri?programKey=yonetim-bilisim-sistemleri-abd-yonetim-bilisim-sistemleri&duzey=Doktora&sekme=courses";
  const response = await render({}, path);
  const html = await response.text();

  assert.match(html, /YBS9XX/);
  assert.match(html, /YBS91X/);
  assert.doesNotMatch(html, /YBS90[1-9]/);
  assert.doesNotMatch(html, /YBS91[1-6]|YBS918/);
  assert.match(html, /DAN902/);
});

test("Makine tezli YL ortak dersleri tekilleştirilmiş kanonik kodlarla listelenir", async () => {
  const path = "/dbp/programlar/makine-muhendisligi-abd-makine-muhendisligi?programKey=makine-muhendisligi-abd-makine-muhendisligi&duzey=Tezli%20Y%C3%BCksek%20Lisans&sekme=courses";
  const response = await render({}, path);
  const html = await response.text();

  assert.match(html, /DAN8XX/);
  assert.match(html, /MMB8XX/);
  assert.match(html, /MMB806/);
  assert.match(html, /MMB81X/);
  assert.doesNotMatch(html, /DAN80[1-4]|MMB80[1-5]|MMB80[78]/);
});

test("Makine ortak ders paketleri 15 hafta, 1-5 matris ve AKTS iş yükü içerir; iç kontrol publicte görünmez", async () => {
  const context = "&bolum=Makine%20M%C3%BChendisli%C4%9Fi%20ABD&program=Makine%20M%C3%BChendisli%C4%9Fi&duzey=Tezli%20Y%C3%BCksek%20Lisans";
  const expected = new Map([
    ["DAN8XX", { workload: 30, ects: 1 }],
    ["MMB8XX", { workload: 150, ects: 5 }],
    ["MMB806", { workload: 180, ects: 6 }],
    ["MMB81X", { workload: 720, ects: 24 }],
  ]);
  const responses = await Promise.all([...expected.keys()].map((code) => render({}, `/dbp/katalog?ders=${code}${context}`)));
  const pages = await Promise.all(responses.map((response) => response.text()));

  for (const [index, [code, totals]] of [...expected.entries()].entries()) {
    const html = pages[index];
    const normalizedHtml = html.replaceAll("<!-- -->", "");
    const weeklyPlan = html.match(/class="week-grid"[\s\S]*?<\/section>/u)?.[0] ?? "";
    assert.equal((html.match(/<b>\d+(?:<!-- -->)?\. Hafta<\/b>/g) ?? []).length, 15, `${code} 15 haftalık plan içermeli`);
    assert.doesNotMatch(weeklyPlan, /Quiz|Ödev|Proje|Sunum|Konu Tekrarı|Genel Tekrar/iu, `${code} haftalık konu başlıklarında yasak ifadeler bulunmamalı`);
    assert.match(normalizedHtml, new RegExp(`<tfoot><tr><th[^>]*>[^<]+<\\/th><th>${totals.workload}<\\/th>`, "u"));
    assert.match(normalizedHtml, new RegExp(`<tr><th[^>]*>AKTS<\\/th><th>${totals.ects}<\\/th>`, "u"));
    assert.equal((html.match(/<th>DÖÇ\d<\/th>/gu) ?? []).length, 5, `${code} 5x11 katkı matrisi içermeli`);
    assert.doesNotMatch(html, /contribution-table[\s\S]*?<td>0<\/td>/u, `${code} matrisi 0 içermemeli`);
    assert.doesNotMatch(html, /quality-checklist-table|YÖKAK Ders Bilgi Paketi Kontrol Tablosu/u);
  }
});

test("public program UI promotes merged process courses and shows term and instructor", async () => {
  const source = await readFile(
    new URL("../app/programlar/[slug]/ProgramCourses.tsx", import.meta.url),
    "utf8",
  );
  assert.match(source, /Ortak \/ Süreç Dersleri/u);
  assert.match(source, /"YBS9XX", "YBS91X", "DAN902", "YBS910", "YBS917"/);
  assert.match(source, /Güz ve Bahar/u);
  assert.match(source, /<th>Dönem<\/th>/u);
  assert.match(source, /<th>Öğretim Elemanı<\/th>/u);
});

test("ABD chair course workspace separates instructor assignments from the department pool", async () => {
  const source = await readFile(new URL("../app/panel/RoleDashboard.tsx", import.meta.url), "utf8");
  assert.match(source, /title: "Verdiğim Dersler"/u);
  assert.match(source, /title: "ABD Ortak Ders Havuzu"/u);
  assert.match(source, /courses: myAssignedCourses/u);
  assert.match(source, /courses: departmentPoolCourses/u);
});

test("course editing and public display use the persisted package workflow", async () => {
  const editor = await readFile(new URL("../app/panel/CourseBolognaEditor.tsx", import.meta.url), "utf8");
  const publicPackage = await readFile(new URL("../app/katalog/DemoCoursePackage.tsx", import.meta.url), "utf8");
  const server = await readFile(new URL("../server.mjs", import.meta.url), "utf8");
  assert.match(editor, /getCoursePackage\(course\.code, course\.department, course\.programName\)/u);
  assert.match(editor, /api\/dbp\/course-package/u);
  assert.match(editor, /length: 11/u);
  assert.doesNotMatch(editor, /P1-P13|length: 13/u);
  assert.match(publicPackage, /public: "1"/u);
  assert.match(server, /canEditCoursePackage/u);
  assert.match(server, /course\.package\.status/u);
});

test("every merged YBS process package keeps the program sidebar", async () => {
  const context = "&bolum=Y%C3%B6netim%20Bili%C5%9Fim%20Sistemleri%20ABD&program=Y%C3%B6netim%20Bili%C5%9Fim%20Sistemleri&duzey=Doktora";
  const codes = ["YBS9XX", "YBS999", "YBS91X", "DAN902", "YBS910", "YBS917"];
  const responses = await Promise.all(
    codes.map((code) => render({}, `/dbp/katalog?ders=${code}${context}`)),
  );
  const pages = await Promise.all(responses.map((response) => response.text()));

  for (const [index, html] of pages.entries()) {
    assert.match(html, /Yönetim Bilişim Sistemleri ABD/u, `${codes[index]} sidebar ABD adını göstermeli`);
    assert.match(html, /programKey=yonetim-bilisim-sistemleri-abd-yonetim-bilisim-sistemleri/);
    assert.match(html, /duzey=Doktora/);
    assert.match(html, /Bloom Düzeyleri/u, `${codes[index]} Bloom düzeylerini göstermeli`);
    assert.equal((html.match(/<b>\d+(?:<!-- -->)?\. Hafta<\/b>/g) ?? []).length, 15, `${codes[index]} 15 aşama veya hafta içermeli`);
    assert.equal((html.match(/<th>DÖÇ\d<\/th>/g) ?? []).length, 5, `${codes[index]} 5x11 katkı matrisi içermeli`);
    assert.doesNotMatch(html, /contribution-table[\s\S]*?<td>0<\/td>/u, `${codes[index]} YBS doktora matrisinde 0 içermemeli`);
    assert.match(html, /contribution-table[\s\S]*?<td>1<\/td>/u, `${codes[index]} en düşük katkıyı 1 göstermeli`);
    assert.match(html, /contribution-table[\s\S]*?<td>5<\/td>/u, `${codes[index]} doğrudan PÇ katkısını göstermeli`);
  }
});

test("previous YBS doctorate academic packages keep the complete public structure", async () => {
  const codes = ["YBS919", "YBS921", "YBS923"];
  const context = "&bolum=Y%C3%B6netim%20Bili%C5%9Fim%20Sistemleri%20ABD&program=Y%C3%B6netim%20Bili%C5%9Fim%20Sistemleri&duzey=Doktora";
  const responses = await Promise.all(codes.map((code) => render({}, `/dbp/katalog?ders=${code}${context}`)));
  const pages = await Promise.all(responses.map((response) => response.text()));

  for (const [index, html] of pages.entries()) {
    const normalizedHtml = html.replaceAll("<!-- -->", "");
    assert.match(html, /Bloom Düzeyleri/u, `${codes[index]} Bloom düzeylerini göstermeli`);
    assert.equal((html.match(/<b>\d+(?:<!-- -->)?\. Hafta<\/b>/g) ?? []).length, 15, `${codes[index]} 15 haftalık plan içermeli`);
    assert.match(normalizedHtml, /<tfoot><tr><th[^>]*>[^<]+<\/th><th>180<\/th>/u);
    assert.match(normalizedHtml, /<tr><th[^>]*>AKTS<\/th><th>6<\/th>/u);
    assert.equal((html.match(/<th>DÖÇ\d<\/th>/g) ?? []).length, 5, `${codes[index]} 5x11 katkı matrisi içermeli`);
    assert.doesNotMatch(html, /contribution-table[\s\S]*?<td>0<\/td>/u);
    assert.match(html, /contribution-table[\s\S]*?<td>1<\/td>/u);
    assert.match(html, /contribution-table[\s\S]*?<td>5<\/td>/u);
  }
});

test("all handoff 15 YBS courses render uniform workload totals without the internal checklist", async () => {
  const codes = [
    "YBS925", "YBS927", "YBS929", "YBS931", "YBS933",
    "YBS935", "YBS937", "YBS939", "YBS941", "YBS943",
    "YBS945", "YBS947", "YBS949", "YBS951", "YBS953",
  ];
  const context = "&bolum=Y%C3%B6netim%20Bili%C5%9Fim%20Sistemleri%20ABD&program=Y%C3%B6netim%20Bili%C5%9Fim%20Sistemleri&duzey=Doktora";
  const responses = await Promise.all(codes.map((code) => render({}, `/dbp/katalog?ders=${code}${context}`)));
  const pages = await Promise.all(responses.map((response) => response.text()));

  for (const [index, html] of pages.entries()) {
    const normalizedHtml = html.replaceAll("<!-- -->", "");
    assert.equal((html.match(/class="week-grid"/g) ?? []).length, 1, `${codes[index]} haftalÄ±k planÄ± gÃ¶stermeli`);
    assert.match(html, /Bloom Düzeyleri/u);
    assert.match(normalizedHtml, /<tfoot><tr><th[^>]*>[^<]+<\/th><th>180<\/th>/u);
    assert.match(normalizedHtml, /<tr><th[^>]*>AKTS<\/th><th>6<\/th>/u);
    assert.doesNotMatch(html, /contribution-table[\s\S]*?<td>0<\/td>/u);
    assert.doesNotMatch(html, /data-quality-check=|YÃ–KAK Ders Bilgi Paketi Kontrol Tablosu/u);
  }
});

test("all handoff 15-2 YBS courses render 15 weeks and uniform workload totals", async () => {
  const codes = [
    "YBS955", "YBS957", "YBS959", "YBS961", "YBS963",
    "YBS965", "YBS967", "YBS969", "YBS920", "YBS922",
    "YBS924", "YBS926", "YBS928", "YBS930", "YBS932",
  ];
  const context = "&bolum=Y%C3%B6netim%20Bili%C5%9Fim%20Sistemleri%20ABD&program=Y%C3%B6netim%20Bili%C5%9Fim%20Sistemleri&duzey=Doktora";
  const responses = await Promise.all(codes.map((code) => render({}, `/dbp/katalog?ders=${code}${context}`)));
  const pages = await Promise.all(responses.map((response) => response.text()));

  for (const [index, html] of pages.entries()) {
    const normalizedHtml = html.replaceAll("<!-- -->", "");
    assert.equal((html.match(/<b>\d+(?:<!-- -->)?\. Hafta<\/b>/g) ?? []).length, 15, `${codes[index]} 15 haftalık plan içermeli`);
    assert.match(html, /Bloom Düzeyleri/u);
    assert.match(normalizedHtml, /<tfoot><tr><th[^>]*>[^<]+<\/th><th>180<\/th>/u);
    assert.match(normalizedHtml, /<tr><th[^>]*>AKTS<\/th><th>6<\/th>/u);
    assert.doesNotMatch(html, /contribution-table[\s\S]*?<td>0<\/td>/u);
    assert.doesNotMatch(html, /data-quality-check=|YÃ–KAK Ders Bilgi Paketi Kontrol Tablosu/u);
  }
});

test("all handoff 15-3 YBS courses render 15 weeks and uniform workload totals", async () => {
  const codes = [
    "YBS934", "YBS936", "YBS938", "YBS940", "YBS942", "YBS944", "YBS946", "YBS948",
    "YBS950", "YBS952", "YBS954", "YBS956", "YBS958", "YBS960", "YBS962", "YBS964",
  ];
  const context = "&bolum=Y%C3%B6netim%20Bili%C5%9Fim%20Sistemleri%20ABD&program=Y%C3%B6netim%20Bili%C5%9Fim%20Sistemleri&duzey=Doktora";
  const responses = await Promise.all(codes.map((code) => render({}, `/dbp/katalog?ders=${code}${context}`)));
  const pages = await Promise.all(responses.map((response) => response.text()));

  for (const [index, html] of pages.entries()) {
    const normalizedHtml = html.replaceAll("<!-- -->", "");
    assert.equal((html.match(/<b>\d+(?:<!-- -->)?\. Hafta<\/b>/g) ?? []).length, 15, `${codes[index]} 15 haftalık plan içermeli`);
    assert.match(html, /Bloom Düzeyleri/u);
    assert.match(normalizedHtml, /<tfoot><tr><th[^>]*>[^<]+<\/th><th>180<\/th>/u);
    assert.match(normalizedHtml, /<tr><th[^>]*>AKTS<\/th><th>6<\/th>/u);
    assert.doesNotMatch(html, /contribution-table[\s\S]*?<td>0<\/td>/u);
    assert.doesNotMatch(html, /data-quality-check=|YÃ–KAK Ders Bilgi Paketi Kontrol Tablosu/u);
  }
});

test("handoff 15-1 Makine courses render 15 weeks and semantic 1-5 matrices without the internal checklist", async () => {
  const codes = [
    "MMB809", "MMB861", "MMB863", "MMB811", "MMB815",
    "MMB817", "MMB819", "MMB821", "MMB823", "MMB825",
    "MMB827", "MMB829", "MMB831", "MMB833", "MMB835",
  ];
  const context = "&bolum=Makine%20M%C3%BChendisli%C4%9Fi%20ABD&program=Makine%20M%C3%BChendisli%C4%9Fi&duzey=Tezli%20Y%C3%BCksek%20Lisans";
  const responses = await Promise.all(codes.map((code) => render({}, `/dbp/katalog?ders=${code}${context}`)));
  const pages = await Promise.all(responses.map((response) => response.text()));
  const forbiddenWeekTitle = /(?:Quiz|Ã–dev|Proje|Sunum|Konu TekrarÄ±|Genel Tekrar)/iu;

  for (const [index, html] of pages.entries()) {
    const normalizedHtml = html.replaceAll("<!-- -->", "");
    const weekCount = (html.match(/<b>\d+(?:<!-- -->)?\. Hafta<\/b>/g) ?? []).length;
    const weeklyStart = normalizedHtml.indexOf("HaftalÄ±k Ders PlanÄ±");
    const weeklyEnd = normalizedHtml.indexOf("Ã–lÃ§me ve DeÄŸerlendirme", weeklyStart);
    const weeklySection = normalizedHtml.slice(weeklyStart, weeklyEnd > weeklyStart ? weeklyEnd : undefined);
    assert.equal(weekCount, 15, `${codes[index]} 15 haftalÄ±k plan iÃ§ermeli`);
    assert.equal(forbiddenWeekTitle.test(weeklySection), false, `${codes[index]} yasak haftalÄ±k baÅŸlÄ±k iÃ§ermemeli`);
    assert.match(normalizedHtml, /<tfoot><tr><th[^>]*>[^<]+<\/th><th>180<\/th>/u);
    assert.match(normalizedHtml, /<tr><th[^>]*>AKTS<\/th><th>6<\/th>/u);
    assert.doesNotMatch(html, /contribution-table[\s\S]*?<td>0<\/td>/u);
    assert.doesNotMatch(html, /quality-checklist-table|YÃ–KAK Ders Bilgi Paketi Kontrol Tablosu/u);
  }
});

test("handoff 15-2 Makine courses preserve DB-backed public package requirements", async () => {
  const codes = [
    "MMB837", "MMB839", "MMB841", "MMB843", "MMB847",
    "MMB849", "MMB851", "MMB853", "MMB855", "MMB857",
    "MMB859", "MMB812", "MMB814", "MMB818", "MMB820",
  ];
  const context = "&bolum=Makine%20M%C3%BChendisli%C4%9Fi%20ABD&program=Makine%20M%C3%BChendisli%C4%9Fi&duzey=Tezli%20Y%C3%BCksek%20Lisans";
  const responses = await Promise.all(codes.map((code) => render({}, `/dbp/katalog?ders=${code}${context}`)));
  const pages = await Promise.all(responses.map((response) => response.text()));
  const forbiddenWeekTitle = /(?:Quiz|Ã–dev|Proje|Sunum|Konu TekrarÄ±|Genel Tekrar)/iu;

  for (const [index, html] of pages.entries()) {
    const normalizedHtml = html.replaceAll("<!-- -->", "");
    const weekCount = (html.match(/<b>\d+(?:<!-- -->)?\. Hafta<\/b>/g) ?? []).length;
    const weeklyStart = normalizedHtml.indexOf("HaftalÄ±k Ders PlanÄ±");
    const weeklyEnd = normalizedHtml.indexOf("Ã–lÃ§me ve DeÄŸerlendirme", weeklyStart);
    const weeklySection = normalizedHtml.slice(weeklyStart, weeklyEnd > weeklyStart ? weeklyEnd : undefined);
    assert.equal(weekCount, 15, `${codes[index]} 15 haftalÄ±k plan iÃ§ermeli`);
    assert.equal(forbiddenWeekTitle.test(weeklySection), false, `${codes[index]} yasak haftalÄ±k baÅŸlÄ±k iÃ§ermemeli`);
    assert.match(normalizedHtml, /<tfoot><tr><th[^>]*>[^<]+<\/th><th>180<\/th>/u);
    assert.match(normalizedHtml, /<tr><th[^>]*>AKTS<\/th><th>6<\/th>/u);
    assert.doesNotMatch(html, /contribution-table[\s\S]*?<td>0<\/td>/u);
    assert.doesNotMatch(html, /quality-checklist-table|YÃ–KAK Ders Bilgi Paketi Kontrol Tablosu/u);
  }
});

test("latest Makine handoff courses keep 15 academic weeks, semantic matrices and homework-aware workloads", async () => {
  const codes = [
    "MMB822", "MMB824", "MMB826", "MMB828", "MMB830", "MMB832",
    "MMB834", "MMB836", "MMB838", "MMB840", "MMB844", "MMB846",
    "MMB848", "MMB850", "MMB854", "MMB858", "MMB860", "MMB862",
  ];
  const seed = JSON.parse(await readFile(new URL("../seed/course-packages.json", import.meta.url), "utf8"));
  const forbiddenWeekTitle = /^(?:Quiz|Ödev|Proje|Sunum|Konu Tekrarı|Genel Tekrar)(?:\b|\s|$)/iu;

  for (const code of codes) {
    const course = seed.find((item) => item.code === code);
    assert.ok(course, `${code} seed paketinde bulunmalı`);
    assert.equal(course.weeklyTopics.length, 15, `${code} 15 haftalık plan içermeli`);
    assert.equal(course.weeklyTopics.some((topic) => forbiddenWeekTitle.test(topic)), false, `${code} yasak haftalık başlık içermemeli`);
    assert.equal(course.workloads.reduce((sum, row) => sum + row.total, 0), 180, `${code} iş yükü 180 saat olmalı`);
    assert.equal(course.workloads.every((row) => Number.isInteger(row.hours * 2)), true, `${code} süreleri tam veya yarım saat olmalı`);
    assert.equal(course.ects, 6, `${code} 6 AKTS olmalı`);
    assert.equal(course.contributionMatrix.flatMap((row) => row.values).every((value) => value >= 1 && value <= 5), true, `${code} matrisi 1-5 arasında olmalı`);
    assert.equal(course.publicQualityChecklist, false, `${code} iç kontrol listesini publicte göstermemeli`);
  }
});

test("Makine homework assessment rule preserves declared weights and normalizes zero-weight homework", async () => {
  const seed = JSON.parse(await readFile(new URL("../seed/course-packages.json", import.meta.url), "utf8"));
  const weights = (code) => Object.fromEntries(seed.find((item) => item.code === code).assessments.map((item) => [item.name, item.weight]));
  const workloadNames = (code) => seed.find((item) => item.code === code).workloads.map((item) => item.name);

  assert.deepEqual(weights("MMB821"), { "Ara Sınav": 30, "Ödev": 10, "Yarıyıl Sonu Sınavı": 60 });
  assert.deepEqual(weights("MMB822"), { "Ara Sınav": 30, "Ödev": 10, "Yarıyıl Sonu Sınavı": 60 });
  assert.deepEqual(weights("MMB838"), { "Ara Sınav": 30, "Ödev": 10, "Yarıyıl Sonu Sınavı": 60 });
  assert.deepEqual(weights("MMB854"), { "Ara Sınav": 10, "Ödev": 10, "Uygulama": 20, "Yarıyıl Sonu Sınavı": 60 });
  assert.deepEqual(weights("MMB828"), { "Ara Sınav": 30, "Ödev": 30, "Yarıyıl Sonu Sınavı": 40 });
  for (const code of ["MMB821", "MMB822", "MMB838", "MMB854", "MMB828"]) {
    assert.ok(workloadNames(code).includes("Ödev Hazırlığı"), `${code} AKTS iş yükünde ödevi içermeli`);
  }
});

test("generic course pages also render both workload and ECTS totals", async () => {
  const response = await render({}, "/dbp/katalog?ders=ADE801");
  const html = (await response.text()).replaceAll("<!-- -->", "");

  assert.match(html, /<tfoot><tr><th[^>]*>[^<]+<\/th><th>\d+(?:[.,]\d+)?<\/th>/u);
  assert.match(html, /<tr><th[^>]*>AKTS<\/th><th>\d+(?:[.,]\d+)?<\/th>/u);
  assert.doesNotMatch(html, /data-quality-check=|YÃ–KAK Ders Bilgi Paketi Kontrol Tablosu/u);
});

test("generic YBS package pages render the contribution matrix on the web page", async () => {
  const response = await render({}, "/dbp/katalog?ders=YBS711&ad=Y%C3%96NET%C4%B0M%20B%C4%B0L%C4%B0%C5%9E%C4%B0M%20S%C4%B0STEMLER%C4%B0&t=3&u=0&kredi=3&akts=6&duzey=Tezsiz%20Y%C3%BCksek%20Lisans");
  const html = await response.text();

  assert.match(html, /YBS711/);
  assert.match(html, /contribution-table/u);
  assert.equal((html.match(/<th>D(?:<!-- -->)?ÖÇ\d<\/th>|<th>D(?:<!-- -->)?Ã–Ã‡\d<\/th>/g) ?? []).length, 5);
});

test("server-renders the public home page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>LEE Ders Bilgi Paketi \| LEE DBP<\/title>/i);
  assert.match(html, /Ders Kataloğu/);
  assert.doesNotMatch(html, /Yönetim Alanı|Giriş Yap|\/dbp\/yonetim/i);
  assert.doesNotMatch(html, /Your site is taking shape|Codex is working/i);
});

test("footer OKÜ Web Sitesi link opens in a new tab", async () => {
  const response = await render();
  const html = await response.text();
  assert.match(html, okuWebsiteFooterLink);
});

test("server footer renders the package version", async () => {
  const response = await render();
  const html = (await response.text()).replaceAll("<!-- -->", "");
  const escapedVersion = (await packageVersion()).replaceAll(".", "\\.");
  assert.match(html, new RegExp(`Versiyon:\\s*${escapedVersion}`));
});

test("production server port does not turn the e-Enstitu link into localhost", async () => {
  const response = await render({ NODE_ENV: "production", PORT: "8081" });
  const html = await response.text();

  assert.match(
    html,
    /<a(?=[^>]*\bclass=["'][^"']*\breturn-link\b[^"']*["'])(?=[^>]*\bhref=["']https:\/\/e-enstitu\.osmaniye\.edu\.tr\/#["'])[^>]*>/i,
  );
  assert.doesNotMatch(html, /href=["']http:\/\/localhost:8080/i);
});

test("local preview footer OKÜ Web Sitesi link opens in a new tab", async () => {
  const html = await readFile(new URL("../local-preview/index.html", import.meta.url), "utf8");
  assert.match(html, okuWebsiteFooterLink);
});

test("local preview loads version from the package endpoint", async () => {
  const html = await readFile(new URL("../local-preview/index.html", import.meta.url), "utf8");
  assert.match(html, /<script\s+src=["']\/app-version\.js["']\s+defer><\/script>/i);
  assert.match(html, /\bdata-app-version\b/);
  assert.doesNotMatch(html, /Versiyon:\s*\d/);
});

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

test("Aile Danışmanlığı tezli YL dersleri mevcut 11 LEE_DBP PÇ ile paketlenir", async () => {
  const codes = [
    "ADE809", "ADE811", "ADE812", "ADE813", "ADE814", "ADE815", "ADE816", "ADE817",
    "ADE810", "ADE818", "ADE819", "ADE820", "ADE821", "ADE822", "ADE823", "ADE824", "ADE825", "ADE826", "ADE827", "ADE828",
    "DAN8XX", "ADE8XX", "ADE806", "ADE81X",
  ];
  const seed = JSON.parse(await readFile(new URL("../seed/course-packages.json", import.meta.url), "utf8"));
  for (const code of codes) {
    const course = seed.find((item) => item.code === code && item.department === "Aile Danışmanlığı ve Eğitimi ABD");
    assert.ok(course, `${code} Aile Danışmanlığı paketinde bulunmalı`);
    assert.equal(course.weeklyTopics.length, 15, `${code} 15 akademik hafta içermeli`);
    assert.equal(course.contributionMatrix.every((row) => row.values.length === 11), true, `${code} matrisi mevcut 11 PÇ'yi kullanmalı`);
    assert.equal(course.contributionMatrix.flatMap((row) => row.values).every((value) => value >= 1 && value <= 5), true, `${code} matrisi 1-5 arasında olmalı`);
    assert.equal(course.publicQualityChecklist, false, `${code} iç kontrolü publicte göstermemeli`);
    assert.equal(course.qualityChecks.length, 21, `${code} 21 maddelik iç kontrol listesi taşımalı`);
  }
  assert.equal(seed.find((item) => item.code === "DAN8XX" && item.department === "Aile Danışmanlığı ve Eğitimi ABD").ects, 1);
  assert.equal(seed.find((item) => item.code === "ADE8XX" && item.department === "Aile Danışmanlığı ve Eğitimi ABD").ects, 5);
});

test("Aile Danışmanlığı kaynakta bulunmayan dört ders için ada özgü içerik taşır", async () => {
  const seed = JSON.parse(await readFile(new URL("../seed/course-packages.json", import.meta.url), "utf8"));
  for (const code of ["ADE810", "ADE823", "ADE826", "ADE827"]) {
    const course = seed.find((item) => item.code === code && item.department === "Aile Danışmanlığı ve Eğitimi ABD");
    assert.ok(course, `${code} paketi bulunmalı`);
    assert.equal(course.weeklyTopics.length, 15);
    assert.equal(course.outcomes.length, 5);
    assert.equal(course.contributionMatrix.length, 5);
    assert.equal(course.contributionMatrix.every((row) => row.values.length === 11 && row.values.every((value) => value >= 1 && value <= 5)), true);
    assert.equal(course.workloads.reduce((sum, row) => sum + row.total, 0), 180);
    assert.equal(course.publicQualityChecklist, false);
  }
  assert.match(seed.find((item) => item.code === "ADE823" && item.department === "Aile Danışmanlığı ve Eğitimi ABD").content, /yaşam boyu gelişim/i);
  assert.match(seed.find((item) => item.code === "ADE826" && item.department === "Aile Danışmanlığı ve Eğitimi ABD").content, /özel gereksinim/i);
  assert.match(seed.find((item) => item.code === "ADE827" && item.department === "Aile Danışmanlığı ve Eğitimi ABD").content, /davranış sorunu/i);
});

test("Aile Danışmanlığı tezli YL ortak dersleri tek kanonik bölümde listelenir", async () => {
  const seed = JSON.parse(await readFile(new URL("../seed/course-packages.json", import.meta.url), "utf8"));
  const aileCodes = seed
    .filter((item) => item.department === "Aile Danışmanlığı ve Eğitimi ABD")
    .map((item) => item.code);
  for (const code of ["DAN8XX", "ADE8XX", "ADE806", "ADE81X"]) {
    assert.equal(aileCodes.filter((item) => item === code).length, 1, `${code} tek kanonik paket olmalı`);
  }
  assert.equal(aileCodes.some((code) => /DAN80[12]|ADE80[1-5]|ADE80[78]/u.test(code)), false);
  const serverSource = await readFile(new URL("../server.mjs", import.meta.url), "utf8");
  assert.match(serverSource, /DAN801.*DAN8XX/su);
  assert.match(serverSource, /ADE801.*ADE8XX/su);
  const publicProgramSource = await readFile(new URL("../app/programlar/[slug]/ProgramCourses.tsx", import.meta.url), "utf8");
  for (const code of ["DAN8XX", "ADE8XX", "ADE806", "ADE81X"]) {
    assert.match(publicProgramSource, new RegExp(`mergedProcessCourseCodes[\\s\\S]*${code}`));
  }
});

test("Aile Danışmanlığı JSON üreticisi program profilini değiştirmez", async () => {
  const source = await readFile(new URL("../scripts/generate_aile_tezli_course_packages.mjs", import.meta.url), "utf8");
  assert.match(source, /SELECT outcomes_json FROM program_profiles/u);
  assert.doesNotMatch(source, /(?:INSERT|UPDATE|DELETE)\s+(?:INTO\s+)?program_profiles/iu);
  assert.doesNotMatch(source, /tyyc_rows_json/u);
});

test("Arkeoloji tezli YL paketleri 15 hafta, 11 PÇ ve iç kalite kontrolü taşır", async () => {
  const seed = JSON.parse(await readFile(new URL("../seed/course-packages.json", import.meta.url), "utf8"));
  const packages = seed.filter((item) => item.department === "Arkeoloji ABD");
  assert.equal(packages.length, 27);
  const forbidden = /^(Quiz|Ödev|Proje|Sunum|Konu Tekrarı|Genel Tekrar|Genel Değerlendirme)(\s|$)/iu;
  for (const course of packages) {
    assert.equal(course.weeklyTopics.length, 15, `${course.code} 15 hafta olmalı`);
    assert.equal(course.weeklyTopics.some((topic) => forbidden.test(topic)), false, `${course.code} yasak hafta başlığı içeremez`);
    assert.equal(course.contributionMatrix.every((row) => row.values.length === 11 && row.values.every((value) => value >= 1 && value <= 5)), true);
    assert.equal(course.workloads.reduce((sum, row) => sum + row.total, 0), course.ects * 30);
    assert.equal(course.qualityChecks.length, 21);
    assert.equal(course.publicQualityChecklist, false);
  }
});

test("Arkeoloji eksik alan dersleri adlarına özgü paketlenir ve etik dersi metnini kopyalamaz", async () => {
  const seed = JSON.parse(await readFile(new URL("../seed/course-packages.json", import.meta.url), "utf8"));
  const codes = ["ARK811", "ARK812", "ARK813", "ARK814", "ARK817", "ARK818", "ARK819", "ARK820", "ARK823", "ARK824", "ARK826", "ARK829", "ARK830"];
  for (const code of codes) {
    const coursePackage = seed.find((item) => item.code === code && item.department === "Arkeoloji ABD");
    assert.ok(coursePackage, `${code} paketi bulunmalı`);
    assert.equal(coursePackage.weeklyTopics.length, 15, `${code} 15 akademik hafta içermeli`);
    assert.equal(coursePackage.outcomes.length, 5, `${code} beş DÖÇ içermeli`);
    assert.equal(coursePackage.contributionMatrix.length, 5, `${code} DÖÇ–PÇ matrisi içermeli`);
    assert.ok(coursePackage.contributionMatrix.every((row) => row.values.length === 11 && row.values.every((value) => value >= 1 && value <= 5)), `${code} matrisi 11 sütunlu ve 1–5 aralığında olmalı`);
    assert.equal(coursePackage.workloads.reduce((sum, row) => sum + row.total, 0), 180, `${code} iş yükü 180 saat olmalı`);
    assert.doesNotMatch(`${coursePackage.purpose} ${coursePackage.content}`, /araştırma ve yayın etiği|bilimsel araştırma süreci/i, `${code} BES801 içeriğini taşımamalı`);
    assert.equal(coursePackage.publicQualityChecklist, false, `${code} iç kontrolü publicte göstermemeli`);
  }
});

test("Arkeoloji ortak süreç dersleri tek havuzda ve ABD başkanı düzenleme alanında kalır", async () => {
  const seed = JSON.parse(await readFile(new URL("../seed/course-packages.json", import.meta.url), "utf8"));
  const codes = seed.filter((item) => item.department === "Arkeoloji ABD").map((item) => item.code);
  for (const code of ["DAN8XX", "ARK8XX", "ARK806", "ARK81X"]) assert.equal(codes.filter((item) => item === code).length, 1);
  const publicSource = await readFile(new URL("../app/programlar/[slug]/ProgramCourses.tsx", import.meta.url), "utf8");
  const serverSource = await readFile(new URL("../server.mjs", import.meta.url), "utf8");
  for (const code of ["DAN8XX", "ARK8XX", "ARK806", "ARK81X"]) {
    assert.match(publicSource, new RegExp(`mergedProcessCourseCodes[\\s\\S]*${code}`));
    assert.match(serverSource, new RegExp(`trustedMergedPoolCodes[\\s\\S]*${code}`));
  }
  assert.match(serverSource, /session\.role === "akademisyen"\) return assignedToUser/u);
  assert.match(serverSource, /return assignedToUser \|\| \(departmentMatches && poolCourse\)/u);
  const path = "/dbp/programlar/arkeoloji-abd-arkeoloji?programKey=arkeoloji-abd-arkeoloji&duzey=Tezli%20Y%C3%BCksek%20Lisans&sekme=courses";
  const html = await (await render({}, path)).text();
  for (const code of ["DAN8XX", "ARK8XX", "ARK806", "ARK81X", "BES801", "BES802"]) assert.match(html, new RegExp(code));
  assert.doesNotMatch(html, /DAN80[12]|ARK80[1-5]|ARK80[78]/u);
  assert.ok(html.lastIndexOf("BES801") > html.indexOf("Güz Yarıyılı"), "BES801 Güz yarıyılında listelenmeli");
  assert.ok(html.lastIndexOf("BES802") > html.indexOf("Bahar Yarıyılı"), "BES802 Bahar yarıyılında listelenmeli");
});

test("Batarya tezli YL paketleri handoff, ortak havuz ve rol kurallarını korur", async () => {
  const seed = JSON.parse(await readFile(new URL("../seed/course-packages.json", import.meta.url), "utf8"));
  const packages = seed.filter((item) => item.department === "Batarya Sistemleri ve Hidrojen Teknolojileri ABD" && item.programName === "Batarya Sistemleri ve Hidrojen Teknolojileri");
  assert.equal(packages.length, 26);
  for (const coursePackage of packages) {
    assert.equal(coursePackage.weeklyTopics.length, 15, `${coursePackage.code}: 15 hafta`);
    assert.equal(coursePackage.outcomes.length, 5, `${coursePackage.code}: beş DÖÇ`);
    assert.ok(coursePackage.contributionMatrix.every((row) => row.values.length === 11 && row.values.every((value) => value >= 1 && value <= 5)), `${coursePackage.code}: 11 PÇ ve 1–5 katkı`);
    assert.equal(coursePackage.workloads.reduce((sum, row) => sum + row.total, 0), coursePackage.ects * 30, `${coursePackage.code}: AKTS iş yükü`);
    assert.equal(coursePackage.qualityChecks.length, 21, `${coursePackage.code}: iç kontrol`);
    assert.equal(coursePackage.publicQualityChecklist, false, `${coursePackage.code}: iç kontrol public değil`);
    assert.ok(coursePackage.weeklyTopics.every((topic) => !/^(quiz|ödev|proje|sunum|konu tekrarı|genel tekrar)/iu.test(topic)), `${coursePackage.code}: akademik hafta başlıkları`);
  }
  for (const code of ["DAN8XX", "BHT8XX", "BHT806", "BHT831", "BHT81X"]) assert.equal(packages.filter((item) => item.code === code).length, 1, `${code} tekilleştirilmeli`);
  for (const code of ["BHT800","BHT811","BHT812","BHT813","BHT814","BHT816","BHT817","BHT818","BHT823","BHT824","BHT826","BHT827","BHT829"]) {
    const coursePackage = packages.find((item) => item.code === code);
    assert.ok(coursePackage.assessments.some((item) => /Ödev/u.test(item.name)), `${code}: kaynak ödevi korunmalı`);
    assert.ok(coursePackage.workloads.some((item) => /Ödev/u.test(item.name)), `${code}: ödev AKTS'ye katılmalı`);
  }
  const publicSource = await readFile(new URL("../app/programlar/[slug]/ProgramCourses.tsx", import.meta.url), "utf8");
  const serverSource = await readFile(new URL("../server.mjs", import.meta.url), "utf8");
  for (const code of ["BHT8XX", "BHT806", "BHT831", "BHT81X"]) {
    assert.match(publicSource, new RegExp(`mergedProcessCourseCodes[\\s\\S]*${code}`));
    assert.match(serverSource, new RegExp(`trustedMergedPoolCodes[\\s\\S]*${code}`));
  }
  assert.match(serverSource, /session\.role === "akademisyen"\) return assignedToUser/u);
  assert.match(serverSource, /return assignedToUser \|\| \(departmentMatches && poolCourse\)/u);
});

test("Beden Eğitimi ve Spor tezli YL paketleri handoff ve mevcut 11 PÇ yapısını korur", async () => {
  const seed = JSON.parse(await readFile(new URL("../seed/course-packages.json", import.meta.url), "utf8"));
  const packages = seed.filter((item) => item.department === "Beden Eğitimi ve Spor ABD" && item.programName === "Beden Eğitimi ve Spor");
  const forbidden = /^(quiz|ödev|proje|sunum|konu tekrarı|genel tekrar|ara sınav|yarıyıl sonu sınavı)(?:\b|\s|$)/iu;
  assert.equal(packages.length, 36, "31 alan ve 5 ortak/süreç paketi bulunmalı");
  for (const coursePackage of packages) {
    assert.equal(coursePackage.weeklyTopics.length, 15, `${coursePackage.code}: 15 akademik hafta`);
    assert.equal(coursePackage.weeklyTopics.some((topic) => forbidden.test(topic)), false, `${coursePackage.code}: yasak hafta başlığı yok`);
    assert.equal(coursePackage.outcomes.length, 5, `${coursePackage.code}: beş ölçülebilir DÖÇ`);
    assert.ok(coursePackage.contributionMatrix.every((row) => row.values.length === 11 && row.values.every((value) => value >= 1 && value <= 5)), `${coursePackage.code}: mevcut 11 PÇ ve 1–5 katkı`);
    assert.equal(coursePackage.workloads.reduce((sum, row) => sum + row.total, 0), coursePackage.ects * 30, `${coursePackage.code}: AKTS iş yükü`);
    assert.equal(coursePackage.workloads.every((row) => Number.isInteger(row.hours * 2)), true, `${coursePackage.code}: anlamlı tam/yarım saat`);
    assert.equal(coursePackage.qualityChecks.length, 21, `${coursePackage.code}: iç kontrol`);
    assert.equal(coursePackage.publicQualityChecklist, false, `${coursePackage.code}: iç kontrol public değil`);
  }
  for (const code of ["DAN8XX", "BES8XX", "BES806", "BEF801", "BES81X"]) {
    assert.equal(packages.filter((item) => item.code === code).length, 1, `${code}: ortak havuzda tek olmalı`);
  }
  const sourceMissing = packages.filter((item) => !item.sourceUrl && !["DAN8XX", "BES8XX", "BES806", "BEF801", "BES81X"].includes(item.code));
  assert.equal(sourceMissing.length, 7, "kaynakta bulunmayan yedi resmi ders ayrıca üretilmeli");
  assert.ok(sourceMissing.every((item) => item.qualityChecks.some((check) => check.status === "Doğrulanmalı")), "kaynak dışı paketler iç kontrolde işaretlenmeli");
});

test("Beden Eğitimi ve Spor ortak havuzu ile ABD başkanı ve danışman yetkileri ayrıdır", async () => {
  const seed = JSON.parse(await readFile(new URL("../seed/course-packages.json", import.meta.url), "utf8"));
  const packages = seed.filter((item) => item.department === "Beden Eğitimi ve Spor ABD" && item.programName === "Beden Eğitimi ve Spor");
  const homeworkPackages = packages.filter((item) => item.assessments.some((assessment) => /Ödev/iu.test(assessment.name)));
  assert.ok(homeworkPackages.every((item) => item.workloads.some((row) => /Ödev/iu.test(row.name))), "ödevler AKTS iş yüküne katılmalı");
  const publicSource = await readFile(new URL("../app/programlar/[slug]/ProgramCourses.tsx", import.meta.url), "utf8");
  const serverSource = await readFile(new URL("../server.mjs", import.meta.url), "utf8");
  for (const code of ["BES8XX", "BES806", "BEF801", "BES81X"]) {
    assert.match(publicSource, new RegExp(`mergedProcessCourseCodes[\\s\\S]*${code}`));
    assert.match(serverSource, new RegExp(`trustedMergedPoolCodes[\\s\\S]*${code}`));
  }
  assert.match(serverSource, /session\.role === "akademisyen"\) return assignedToUser/u);
  assert.match(serverSource, /return assignedToUser \|\| \(departmentMatches && poolCourse\)/u);
});

test("Biyoloji tezli YL paketleri handoff, 15 hafta ve mevcut 11 PÇ yapısını korur", async () => {
  const seed = JSON.parse(await readFile(new URL("../seed/course-packages.json", import.meta.url), "utf8"));
  const packages = seed.filter((item) => item.department === "Biyoloji ABD" && item.programName === "Biyoloji" && item.level === "Tezli Yüksek Lisans");
  const forbidden = /^(quiz|ödev|proje|sunum|konu tekrarı|genel tekrar|ara sınav|yarıyıl sonu sınavı)(?:\b|\s|$)/iu;
  assert.equal(packages.length, 88, "83 alan ve 5 ortak/süreç paketi bulunmalı");
  for (const coursePackage of packages) {
    assert.equal(coursePackage.weeklyTopics.length, 15, `${coursePackage.code}: 15 akademik hafta`);
    assert.equal(coursePackage.weeklyTopics.some((topic) => forbidden.test(topic)), false, `${coursePackage.code}: yasak hafta başlığı yok`);
    assert.equal(coursePackage.outcomes.length, 5, `${coursePackage.code}: beş ölçülebilir DÖÇ`);
    assert.ok(coursePackage.contributionMatrix.every((row) => row.values.length === 11 && row.values.every((value) => value >= 1 && value <= 5)), `${coursePackage.code}: 11 PÇ ve 1–5 katkı`);
    assert.equal(coursePackage.workloads.reduce((sum, row) => sum + row.total, 0), coursePackage.ects * 30, `${coursePackage.code}: AKTS iş yükü`);
    assert.equal(coursePackage.workloads.every((row) => row.hours >= 0 && Number.isInteger(row.hours * 2)), true, `${coursePackage.code}: negatif olmayan tam/yarım saat`);
    assert.equal(coursePackage.qualityChecks.length, 21, `${coursePackage.code}: iç kontrol`);
    assert.equal(coursePackage.publicQualityChecklist, false, `${coursePackage.code}: iç kontrol public değil`);
  }
  for (const code of ["DAN8XX", "BİO8XX", "BİO806", "BİO809", "BİO81X"]) assert.equal(packages.filter((item) => item.code === code).length, 1, `${code}: tek kanonik paket`);
  const rawAliases = /^(?:DAN80[1-4]|BİO80[1-5]|BİO80[7-8]|BİO810)$/u;
  assert.equal(packages.some((item) => rawAliases.test(item.code)), false, "dönemsel ortak ders kodları listede kalmamalı");
});

test("Biyoloji kaynak dışı resmi dersleri işaretlenir; ödevler AKTS'ye katılır ve roller ayrılır", async () => {
  const seed = JSON.parse(await readFile(new URL("../seed/course-packages.json", import.meta.url), "utf8"));
  const packages = seed.filter((item) => item.department === "Biyoloji ABD" && item.programName === "Biyoloji" && item.level === "Tezli Yüksek Lisans");
  const common = new Set(["DAN8XX", "BİO8XX", "BİO806", "BİO809", "BİO81X"]);
  const missing = packages.filter((item) => !common.has(item.code) && !item.sourceUrl);
  assert.deepEqual(missing.map((item) => item.code).sort(), ["BİO813","BİO814","BİO829","BİO867","BİO868","BİO869","BİO875","BİO877","BİO881","BİO883","BİO885"].sort());
  assert.ok(missing.every((item) => item.qualityChecks.some((check) => check.status === "Doğrulanmalı")), "kaynak dışı dersler doğrulama beklemeli");
  const homeworkPackages = packages.filter((item) => item.assessments.some((assessment) => /Ödev/iu.test(assessment.name)));
  assert.ok(homeworkPackages.every((item) => item.workloads.some((row) => /Ödev/iu.test(row.name))), "tanımlı ödev AKTS iş yüküne katılmalı");
  const publicSource = await readFile(new URL("../app/programlar/[slug]/ProgramCourses.tsx", import.meta.url), "utf8");
  const serverSource = await readFile(new URL("../server.mjs", import.meta.url), "utf8");
  for (const code of ["BİO8XX", "BİO806", "BİO809", "BİO81X"]) {
    assert.match(publicSource, new RegExp(`mergedProcessCourseCodes[\\s\\S]*${code}`));
    assert.match(serverSource, new RegExp(`trustedMergedPoolCodes[\\s\\S]*${code}`));
  }
  assert.match(serverSource, /session\.role === "akademisyen"\) return assignedToUser/u);
  assert.match(serverSource, /return assignedToUser \|\| \(departmentMatches && poolCourse\)/u);
});

test("Ebelik tezli YL paketleri 29 adımlık handoff ve mevcut 11 PÇ yapısını korur", async () => {
  const seed = JSON.parse(await readFile(new URL("../seed/course-packages.json", import.meta.url), "utf8"));
  const packages = seed.filter((item) => item.department === "Ebelik ABD" && item.programName === "Ebelik" && item.level === "Tezli Yüksek Lisans");
  const forbidden = /^(quiz|ödev|proje|sunum|konu tekrarı|genel tekrar|ara sınav|yarıyıl sonu sınavı)(?:\b|\s|$)/iu;
  assert.equal(packages.length, 20, "15 alan ve 5 ortak/süreç paketi bulunmalı");
  for (const coursePackage of packages) {
    assert.equal(coursePackage.weeklyTopics.length, 15, `${coursePackage.code}: 15 akademik hafta`);
    assert.equal(coursePackage.weeklyTopics.some((topic) => forbidden.test(topic)), false, `${coursePackage.code}: yasak hafta başlığı yok`);
    assert.equal(coursePackage.outcomes.length, 5, `${coursePackage.code}: beş ölçülebilir DÖÇ`);
    assert.ok(coursePackage.contributionMatrix.every((row) => row.values.length === 11 && row.values.every((value) => value >= 1 && value <= 5)), `${coursePackage.code}: 11 PÇ ve 1–5 katkı`);
    assert.equal(coursePackage.workloads.reduce((sum, row) => sum + row.total, 0), coursePackage.ects * 30, `${coursePackage.code}: AKTS iş yükü`);
    assert.equal(coursePackage.workloads.every((row) => row.hours >= 0 && Number.isInteger(row.hours * 2)), true, `${coursePackage.code}: tam/yarım saat`);
    assert.equal(coursePackage.qualityChecks.length, 21, `${coursePackage.code}: iç kontrol`);
    assert.equal(coursePackage.publicQualityChecklist, false, `${coursePackage.code}: iç kontrol public değil`);
  }
  for (const code of ["DAN8XX", "EBE8XX", "EBE806", "EBE809", "EBE81X"]) assert.equal(packages.filter((item) => item.code === code).length, 1, `${code}: tek kanonik paket`);
  assert.equal(packages.some((item) => /^(?:DAN80[1-4]|EBE80[1-5]|EBE80[7-8]|EBE810)$/u.test(item.code)), false, "ortak ders aliasları kalmamalı");
  assert.equal(packages.filter((item) => !new Set(["DAN8XX", "EBE8XX", "EBE806", "EBE809", "EBE81X"]).has(item.code) && !item.sourceUrl).length, 0, "tüm alan derslerinin gerçek OBS kaydı olmalı");
});

test("Ebelik ortak havuzu ile ABD başkanı ve akademisyen yetkileri ayrıdır", async () => {
  const seed = JSON.parse(await readFile(new URL("../seed/course-packages.json", import.meta.url), "utf8"));
  const packages = seed.filter((item) => item.department === "Ebelik ABD" && item.programName === "Ebelik" && item.level === "Tezli Yüksek Lisans");
  const homeworkPackages = packages.filter((item) => item.assessments.some((assessment) => /Ödev/iu.test(assessment.name)));
  assert.ok(homeworkPackages.every((item) => item.workloads.some((row) => /Ödev/iu.test(row.name))), "tanımlı ödev AKTS iş yüküne katılmalı");
  const publicSource = await readFile(new URL("../app/programlar/[slug]/ProgramCourses.tsx", import.meta.url), "utf8");
  const serverSource = await readFile(new URL("../server.mjs", import.meta.url), "utf8");
  for (const code of ["EBE8XX", "EBE806", "EBE809", "EBE81X"]) {
    assert.match(publicSource, new RegExp(`mergedProcessCourseCodes[\\s\\S]*${code}`));
    assert.match(serverSource, new RegExp(`trustedMergedPoolCodes[\\s\\S]*${code}`));
  }
  assert.match(serverSource, /session\.role === "akademisyen"\) return assignedToUser/u);
  assert.match(serverSource, /return assignedToUser \|\| \(departmentMatches && poolCourse\)/u);
});

test("Ekoturizm Rehberliği tezli YL paketleri handoff, 15 hafta ve 11 PÇ yapısını korur", async () => {
  const seed=JSON.parse(await readFile(new URL("../seed/course-packages.json",import.meta.url),"utf8"));const packages=seed.filter((x)=>x.department==="Ekoturizm Rehberliği ABD"&&x.programName==="Ekoturizm Rehberliği"&&x.level==="Tezli Yüksek Lisans");const forbidden=/^(quiz|ödev|proje|sunum|konu tekrarı|genel tekrar|ara sınav|yarıyıl sonu sınavı)(?:\b|\s|$)/iu;
  assert.equal(packages.length,44,"39 alan ve 5 ortak paket");for(const p of packages){assert.equal(p.weeklyTopics.length,15,`${p.code}: 15 hafta`);assert.equal(p.weeklyTopics.some((x)=>forbidden.test(x)),false,`${p.code}: yasak başlık yok`);assert.equal(p.outcomes.length,5);assert.ok(p.contributionMatrix.every((r)=>r.values.length===11&&r.values.every((v)=>v>=1&&v<=5)));assert.equal(p.workloads.reduce((s,r)=>s+r.total,0),p.ects*30);assert.equal(p.qualityChecks.length,21);assert.equal(p.publicQualityChecklist,false)}
  for(const code of ["DAN8XX","ETR8XX","ETR806","ETR855","ETR81X"])assert.equal(packages.filter((x)=>x.code===code).length,1,`${code}: tek kanonik paket`);assert.equal(packages.some((x)=>x.code==="EKOTURİZM SEÇ-2"),false,"seçim grubu ders değildir");assert.equal(packages.filter((x)=>!["DAN8XX","ETR8XX","ETR806","ETR855","ETR81X"].includes(x.code)&&!x.sourceUrl).length,0,"alan derslerinin OBS kaydı var");
});

test("Ekoturizm ortak havuzu ile ABD başkanı ve akademisyen yetkileri ayrıdır",async()=>{const seed=JSON.parse(await readFile(new URL("../seed/course-packages.json",import.meta.url),"utf8"));const packages=seed.filter((x)=>x.department==="Ekoturizm Rehberliği ABD"&&x.programName==="Ekoturizm Rehberliği");const homework=packages.filter((x)=>x.assessments.some((a)=>/Ödev/iu.test(a.name)));assert.ok(homework.every((x)=>x.workloads.some((r)=>/Ödev/iu.test(r.name))));const publicSource=await readFile(new URL("../app/programlar/[slug]/ProgramCourses.tsx",import.meta.url),"utf8"),serverSource=await readFile(new URL("../server.mjs",import.meta.url),"utf8");for(const code of ["ETR8XX","ETR806","ETR855","ETR81X"]){assert.match(publicSource,new RegExp(`mergedProcessCourseCodes[\\s\\S]*${code}`));assert.match(serverSource,new RegExp(`trustedMergedPoolCodes[\\s\\S]*${code}`))}assert.match(serverSource,/session\.role === "akademisyen"\) return assignedToUser/u);assert.match(serverSource,/return assignedToUser \|\| \(departmentMatches && poolCourse\)/u)});

test("Elektrik Elektronik tezli YL paketleri handoff kalite kurallarını karşılar",async()=>{const seed=JSON.parse(await readFile(new URL("../seed/course-packages.json",import.meta.url),"utf8"));const packages=seed.filter((x)=>x.department==="Elektrik Elektronik Mühendisliği ABD"&&x.programName==="Elektrik Elektronik Mühendisliği"&&x.level==="Tezli Yüksek Lisans");const forbidden=/^(quiz|ödev|proje|sunum|konu tekrarı|genel tekrar|ara sınav|yarıyıl sonu sınavı)(?:\b|\s|$)/iu;assert.equal(packages.length,87);for(const code of ["DAN8XX","EEM8XX","EEM806","EEM885","EEM81X"])assert.equal(packages.filter((x)=>x.code===code).length,1,`${code}: tek kanonik paket`);for(const p of packages){assert.equal(p.weeklyTopics.length,15,`${p.code}: 15 hafta`);assert.equal(p.weeklyTopics.some((x)=>forbidden.test(x)),false,`${p.code}: akademik konu`);assert.equal(p.outcomes.length,5,`${p.code}: 5 DÖÇ`);assert.equal(p.contributionMatrix.length,5,`${p.code}: 5 matris satırı`);assert.ok(p.contributionMatrix.every((r)=>r.values.length===11&&r.values.every((v)=>v>=1&&v<=5)),`${p.code}: 1-5 matris`);assert.equal(p.workloads.reduce((s,r)=>s+r.total,0),p.ects*30,`${p.code}: AKTS`);assert.equal(p.publicQualityChecklist,false,`${p.code}: kontrol listesi gizli`)}assert.equal(packages.filter((x)=>!["DAN8XX","EEM8XX","EEM806","EEM885","EEM81X"].includes(x.code)&&!x.sourceUrl).map((x)=>x.code).join(","),"EEM837")});

test("Elektrik Elektronik ortak havuzu ile ABD başkanı ve akademisyen yetkileri ayrıdır",async()=>{const seed=JSON.parse(await readFile(new URL("../seed/course-packages.json",import.meta.url),"utf8"));const packages=seed.filter((x)=>x.department==="Elektrik Elektronik Mühendisliği ABD"&&x.programName==="Elektrik Elektronik Mühendisliği");const homework=packages.filter((x)=>x.assessments.some((a)=>/Ödev/iu.test(a.name)));assert.ok(homework.every((x)=>x.workloads.some((r)=>/Ödev/iu.test(r.name))));const publicSource=await readFile(new URL("../app/programlar/[slug]/ProgramCourses.tsx",import.meta.url),"utf8"),serverSource=await readFile(new URL("../server.mjs",import.meta.url),"utf8");for(const code of ["EEM8XX","EEM806","EEM885","EEM81X"]){assert.match(publicSource,new RegExp(`mergedProcessCourseCodes[\\s\\S]*${code}`));assert.match(serverSource,new RegExp(`trustedMergedPoolCodes[\\s\\S]*${code}`))}assert.match(serverSource,/session\.role === "akademisyen"\) return assignedToUser/u);assert.match(serverSource,/return assignedToUser \|\| \(departmentMatches && poolCourse\)/u)});

test("Enerji Sistemleri tezli YL paketleri handoff kalite kurallarını karşılar",async()=>{const seed=JSON.parse(await readFile(new URL("../seed/course-packages.json",import.meta.url),"utf8"));const packages=seed.filter((x)=>x.department==="Enerji Sistemleri Mühendisliği ABD"&&x.programName==="Enerji Sistemleri Mühendisliği"&&x.level==="Tezli Yüksek Lisans");const forbidden=/^(quiz|ödev|proje|sunum|konu tekrarı|genel tekrar|ara sınav|yarıyıl sonu sınavı)(?:\b|\s|$)/iu;assert.equal(packages.length,28);for(const code of ["DAN8XX","EMB8XX","EMB806","EMB829","EMB81X"])assert.equal(packages.filter((x)=>x.code===code).length,1,`${code}: tek kanonik paket`);for(const p of packages){assert.equal(p.weeklyTopics.length,15,`${p.code}: 15 hafta`);assert.equal(p.weeklyTopics.some((x)=>forbidden.test(x)),false,`${p.code}: akademik konu`);assert.equal(p.outcomes.length,5,`${p.code}: 5 DÖÇ`);assert.equal(p.contributionMatrix.length,5,`${p.code}: 5 matris satırı`);assert.ok(p.contributionMatrix.every((r)=>r.values.length===11&&r.values.every((v)=>v>=1&&v<=5)),`${p.code}: 1-5 matris`);assert.equal(p.workloads.reduce((s,r)=>s+r.total,0),p.ects*30,`${p.code}: AKTS`);assert.equal(p.publicQualityChecklist,false,`${p.code}: kontrol listesi gizli`)}assert.deepEqual(packages.filter((x)=>!["DAN8XX","EMB8XX","EMB806","EMB829","EMB81X"].includes(x.code)&&!x.sourceUrl).map((x)=>x.code).sort(),["EMB821","EMB822","EMB832"])});

test("Enerji Sistemleri ortak havuzu ile ABD başkanı ve akademisyen yetkileri ayrıdır",async()=>{const seed=JSON.parse(await readFile(new URL("../seed/course-packages.json",import.meta.url),"utf8"));const packages=seed.filter((x)=>x.department==="Enerji Sistemleri Mühendisliği ABD"&&x.programName==="Enerji Sistemleri Mühendisliği");const homework=packages.filter((x)=>x.assessments.some((a)=>/Ödev/iu.test(a.name)));assert.ok(homework.every((x)=>x.workloads.some((r)=>/Ödev/iu.test(r.name))));const publicSource=await readFile(new URL("../app/programlar/[slug]/ProgramCourses.tsx",import.meta.url),"utf8"),serverSource=await readFile(new URL("../server.mjs",import.meta.url),"utf8");for(const code of ["EMB8XX","EMB806","EMB829","EMB81X"]){assert.match(publicSource,new RegExp(`mergedProcessCourseCodes[\\s\\S]*${code}`));assert.match(serverSource,new RegExp(`trustedMergedPoolCodes[\\s\\S]*${code}`))}assert.match(serverSource,/session\.role === "akademisyen"\) return assignedToUser/u);assert.match(serverSource,/return assignedToUser \|\| \(departmentMatches && poolCourse\)/u)});

test("Felsefe ve Din Bilimleri tezli YL paketleri handoff kalite kurallarını karşılar",async()=>{const seed=JSON.parse(await readFile(new URL("../seed/course-packages.json",import.meta.url),"utf8"));const packages=seed.filter((x)=>x.department==="Felsefe ve Din Bilimleri ABD"&&x.programName==="Felsefe ve Din Bilimleri"&&x.level==="Tezli Yüksek Lisans");const forbidden=/^(quiz|ödev|proje|sunum|konu tekrarı|genel tekrar|ara sınav|yarıyıl sonu sınavı)(?:\b|\s|$)/iu;assert.equal(packages.length,55);for(const code of ["DAN8XX","FDB8XX","FDB806","BES801","FDB81X"])assert.equal(packages.filter((x)=>x.code===code).length,1,`${code}: tek kanonik paket`);for(const p of packages){assert.equal(p.weeklyTopics.length,15,`${p.code}: 15 hafta`);assert.equal(p.weeklyTopics.some((x)=>forbidden.test(x)),false,`${p.code}: akademik konu`);assert.equal(p.outcomes.length,5,`${p.code}: 5 DÖÇ`);assert.equal(p.contributionMatrix.length,5,`${p.code}: 5 matris satırı`);assert.ok(p.contributionMatrix.every((r)=>r.values.length===11&&r.values.every((v)=>v>=1&&v<=5)),`${p.code}: 1-5 matris`);assert.equal(p.workloads.reduce((s,r)=>s+r.total,0),p.ects*30,`${p.code}: AKTS`);assert.equal(p.publicQualityChecklist,false,`${p.code}: kontrol listesi gizli`)}assert.deepEqual(packages.filter((x)=>!["DAN8XX","FDB8XX","FDB806","BES801","FDB81X"].includes(x.code)&&!x.sourceUrl).map((x)=>x.code).sort(),["FDB815","FDB817","FDB819","FDB821","FDB823","FDB825","FDB833","FDB835","FDB843","FDB845","FDB861"])});

test("Felsefe ve Din Bilimleri ortak havuzu ile rol yetkileri ayrıdır",async()=>{const seed=JSON.parse(await readFile(new URL("../seed/course-packages.json",import.meta.url),"utf8"));const packages=seed.filter((x)=>x.department==="Felsefe ve Din Bilimleri ABD"&&x.programName==="Felsefe ve Din Bilimleri");const homework=packages.filter((x)=>x.assessments.some((a)=>/Ödev/iu.test(a.name)));assert.ok(homework.every((x)=>x.workloads.some((r)=>/Ödev/iu.test(r.name))));const publicSource=await readFile(new URL("../app/programlar/[slug]/ProgramCourses.tsx",import.meta.url),"utf8"),serverSource=await readFile(new URL("../server.mjs",import.meta.url),"utf8");for(const code of ["FDB8XX","FDB806","FDB81X"]){assert.match(publicSource,new RegExp(`mergedProcessCourseCodes[\\s\\S]*${code}`));assert.match(serverSource,new RegExp(`trustedMergedPoolCodes[\\s\\S]*${code}`))}assert.match(serverSource,/session\.role === "akademisyen"\) return assignedToUser/u);assert.match(serverSource,/return assignedToUser \|\| \(departmentMatches && poolCourse\)/u)});

test("Fizik tezli YL paketleri handoff kalite kurallarını karşılar",async()=>{const seed=JSON.parse(await readFile(new URL("../seed/course-packages.json",import.meta.url),"utf8"));const packages=seed.filter((x)=>x.department==="Fizik ABD"&&x.programName==="Fizik"&&x.level==="Tezli Yüksek Lisans");const forbidden=/^(quiz|ödev|proje|sunum|konu tekrarı|genel tekrar|ara sınav|yarıyıl sonu sınavı)(?:\b|\s|$)/iu;assert.equal(packages.length,73);for(const code of ["DAN8XX","FZK8XX","FZK806","FZK899","FZK81X"])assert.equal(packages.filter((x)=>x.code===code).length,1,`${code}: tek kanonik paket`);for(const p of packages){assert.equal(p.weeklyTopics.length,15,`${p.code}: 15 hafta`);assert.equal(p.weeklyTopics.some((x)=>forbidden.test(x)),false,`${p.code}: akademik konu`);assert.equal(p.outcomes.length,5,`${p.code}: 5 DÖÇ`);assert.equal(p.contributionMatrix.length,5,`${p.code}: 5 matris satırı`);assert.ok(p.contributionMatrix.every((r)=>r.values.length===11&&r.values.every((v)=>v>=1&&v<=5)),`${p.code}: 1-5 matris`);assert.equal(p.workloads.reduce((s,r)=>s+r.total,0),p.ects*30,`${p.code}: AKTS`);assert.equal(p.publicQualityChecklist,false,`${p.code}: kontrol listesi gizli`)}assert.deepEqual(packages.filter((x)=>!["DAN8XX","FZK8XX","FZK806","FZK899","FZK81X"].includes(x.code)&&!x.sourceUrl).map((x)=>x.code).sort(),["FZK867"])});

test("Fizik ortak havuzu ile ABD başkanı ve akademisyen yetkileri ayrıdır",async()=>{const seed=JSON.parse(await readFile(new URL("../seed/course-packages.json",import.meta.url),"utf8"));const packages=seed.filter((x)=>x.department==="Fizik ABD"&&x.programName==="Fizik");const homework=packages.filter((x)=>x.assessments.some((a)=>/Ödev/iu.test(a.name)));assert.ok(homework.every((x)=>x.workloads.some((r)=>/Ödev/iu.test(r.name))));const publicSource=await readFile(new URL("../app/programlar/[slug]/ProgramCourses.tsx",import.meta.url),"utf8"),serverSource=await readFile(new URL("../server.mjs",import.meta.url),"utf8");for(const code of ["FZK8XX","FZK806","FZK899","FZK81X"]){assert.match(publicSource,new RegExp(`mergedProcessCourseCodes[\\s\\S]*${code}`));assert.match(serverSource,new RegExp(`trustedMergedPoolCodes[\\s\\S]*${code}`))}assert.match(serverSource,/session\.role === "akademisyen"\) return assignedToUser/u);assert.match(serverSource,/return assignedToUser \|\| \(departmentMatches && poolCourse\)/u)});

test("Gastronomi tezli YL paketleri handoff kalite kurallarını karşılar",async()=>{const seed=JSON.parse(await readFile(new URL("../seed/course-packages.json",import.meta.url),"utf8"));const packages=seed.filter((x)=>x.department==="Gastronomi ve Mutfak Sanatları ABD"&&x.programName==="Gastronomi ve Mutfak Sanatları"&&x.level==="Tezli Yüksek Lisans");const forbidden=/(quiz|ödev|proje|sunum|konu tekrarı|genel tekrar|ara sınav|yarıyıl sonu sınavı)/iu;assert.equal(packages.length,30);for(const code of ["DAN8XX","GMS8XX","GMS806","GMS85X","GMS81X"])assert.equal(packages.filter((x)=>x.code===code).length,1,`${code}: tek kanonik paket`);for(const p of packages){assert.equal(p.weeklyTopics.length,15,`${p.code}: 15 hafta`);assert.equal(p.weeklyTopics.some((x)=>forbidden.test(x)),false,`${p.code}: akademik konu`);assert.equal(p.outcomes.length,5,`${p.code}: 5 DÖÇ`);assert.equal(p.contributionMatrix.length,5,`${p.code}: 5 matris satırı`);assert.ok(p.contributionMatrix.every((r)=>r.values.length===11&&r.values.every((v)=>v>=1&&v<=5)),`${p.code}: 1-5 matris`);assert.equal(p.workloads.reduce((s,r)=>s+r.total,0),p.ects*30,`${p.code}: AKTS`);assert.equal(p.publicQualityChecklist,false,`${p.code}: kontrol listesi gizli`)}assert.deepEqual(packages.filter((x)=>!["DAN8XX","GMS8XX","GMS806","GMS85X","GMS81X"].includes(x.code)&&!x.sourceUrl).map((x)=>x.code).sort(),[])});

test("Gastronomi ortak havuzu ile ABD başkanı ve akademisyen yetkileri ayrıdır",async()=>{const seed=JSON.parse(await readFile(new URL("../seed/course-packages.json",import.meta.url),"utf8"));const packages=seed.filter((x)=>x.department==="Gastronomi ve Mutfak Sanatları ABD"&&x.programName==="Gastronomi ve Mutfak Sanatları");const homework=packages.filter((x)=>x.assessments.some((a)=>/Ödev/iu.test(a.name)));assert.ok(homework.every((x)=>x.workloads.some((r)=>/Ödev/iu.test(r.name))));const publicSource=await readFile(new URL("../app/programlar/[slug]/ProgramCourses.tsx",import.meta.url),"utf8"),serverSource=await readFile(new URL("../server.mjs",import.meta.url),"utf8");for(const code of ["GMS8XX","GMS806","GMS85X","GMS81X"]){assert.match(publicSource,new RegExp(`mergedProcessCourseCodes[\\s\\S]*${code}`));assert.match(serverSource,new RegExp(`trustedMergedPoolCodes[\\s\\S]*${code}`))}assert.match(serverSource,/session\.role === "akademisyen"\) return assignedToUser/u);assert.match(serverSource,/return assignedToUser \|\| \(departmentMatches && poolCourse\)/u)});

test("Gıda Mühendisliği tezli YL paketleri handoff kalite kurallarını karşılar",async()=>{const seed=JSON.parse(await readFile(new URL("../seed/course-packages.json",import.meta.url),"utf8"));const packages=seed.filter((x)=>x.department==="Gıda Mühendisliği ABD"&&x.programName==="Gıda Mühendisliği"&&x.level==="Tezli Yüksek Lisans");const forbidden=/(quiz|ödev|proje|sunum|konu tekrarı|genel tekrar|ara\s*sınav|yarıyıl sonu sınavı)/iu;assert.equal(packages.length,52);for(const code of ["DAN8XX","GMB8XX","GMB806","GMB85X","GMB81X"])assert.equal(packages.filter((x)=>x.code===code).length,1,`${code}: tek kanonik paket`);for(const p of packages){assert.equal(p.weeklyTopics.length,15,`${p.code}: 15 hafta`);assert.equal(p.weeklyTopics.some((x)=>forbidden.test(x)),false,`${p.code}: akademik konu`);assert.equal(p.outcomes.length,5,`${p.code}: 5 DÖÇ`);assert.equal(p.contributionMatrix.length,5,`${p.code}: 5 matris satırı`);assert.ok(p.contributionMatrix.every((r)=>r.values.length===11&&r.values.every((v)=>v>=1&&v<=5)),`${p.code}: 1-5 matris`);assert.equal(p.workloads.reduce((s,r)=>s+r.total,0),p.ects*30,`${p.code}: AKTS`);assert.equal(p.workloads.every((r)=>Number.isInteger(r.hours*2)),true,`${p.code}: tam/yarım saat`);assert.equal(p.qualityChecks.length,21,`${p.code}: iç kontrol`);assert.equal(p.publicQualityChecklist,false,`${p.code}: kontrol listesi gizli`)}assert.deepEqual(packages.filter((x)=>!["DAN8XX","GMB8XX","GMB806","GMB85X","GMB81X"].includes(x.code)&&!x.sourceUrl).map((x)=>x.code).sort(),["FIZ-5271","FIZ-5285","GMB852"])});

test("Gıda Mühendisliği ortak havuzu ile ABD başkanı ve akademisyen yetkileri ayrıdır",async()=>{const seed=JSON.parse(await readFile(new URL("../seed/course-packages.json",import.meta.url),"utf8"));const packages=seed.filter((x)=>x.department==="Gıda Mühendisliği ABD"&&x.programName==="Gıda Mühendisliği");const homework=packages.filter((x)=>x.assessments.some((a)=>/Ödev/iu.test(a.name)));assert.ok(homework.every((x)=>x.workloads.some((r)=>/Ödev/iu.test(r.name))));const publicSource=await readFile(new URL("../app/programlar/[slug]/ProgramCourses.tsx",import.meta.url),"utf8"),serverSource=await readFile(new URL("../server.mjs",import.meta.url),"utf8");for(const code of ["GMB8XX","GMB806","GMB85X","GMB81X"]){assert.match(publicSource,new RegExp(`mergedProcessCourseCodes[\\s\\S]*${code}`));assert.match(serverSource,new RegExp(`trustedMergedPoolCodes[\\s\\S]*${code}`))}assert.match(serverSource,/session\.role === "akademisyen"\) return assignedToUser/u);assert.match(serverSource,/return assignedToUser \|\| \(departmentMatches && poolCourse\)/u)});

test("Gıda Teknolojisi tezli YL paketleri handoff kalite kurallarını karşılar",async()=>{const seed=JSON.parse(await readFile(new URL("../seed/course-packages.json",import.meta.url),"utf8"));const packages=seed.filter((x)=>x.department==="Gıda Teknolojisi ABD"&&x.programName==="Gıda Teknolojisi"&&x.level==="Tezli Yüksek Lisans");const forbidden=/(quiz|ödev|proje|sunum|konu tekrarı|genel tekrar|ara\s*sınav|yarıyıl sonu sınavı)/iu;assert.equal(packages.length,32);for(const code of ["DAN8XX","GTB8XX","GTB806","GTB82X","GTB81X"])assert.equal(packages.filter((x)=>x.code===code).length,1,`${code}: tek kanonik paket`);for(const p of packages){assert.equal(p.weeklyTopics.length,15,`${p.code}: 15 hafta`);assert.equal(p.weeklyTopics.some((x)=>forbidden.test(x)),false,`${p.code}: akademik konu`);assert.equal(p.outcomes.length,5,`${p.code}: 5 DÖÇ`);assert.equal(p.contributionMatrix.length,5,`${p.code}: 5 matris satırı`);assert.ok(p.contributionMatrix.every((r)=>r.values.length===11&&r.values.every((v)=>v>=1&&v<=5)),`${p.code}: 1-5 matris`);assert.equal(p.workloads.reduce((s,r)=>s+r.total,0),p.ects*30,`${p.code}: AKTS`);assert.equal(p.workloads.every((r)=>Number.isInteger(r.hours*2)),true,`${p.code}: tam/yarım saat`);assert.equal(p.qualityChecks.length,21,`${p.code}: iç kontrol`);assert.equal(p.publicQualityChecklist,false,`${p.code}: kontrol listesi gizli`)}assert.equal(packages.filter((x)=>!["DAN8XX","GTB8XX","GTB806","GTB82X","GTB81X"].includes(x.code)&&!x.sourceUrl).length,0)});

test("Gıda Teknolojisi ortak havuzu ile ABD başkanı ve akademisyen yetkileri ayrıdır",async()=>{const seed=JSON.parse(await readFile(new URL("../seed/course-packages.json",import.meta.url),"utf8"));const packages=seed.filter((x)=>x.department==="Gıda Teknolojisi ABD"&&x.programName==="Gıda Teknolojisi");const homework=packages.filter((x)=>x.assessments.some((a)=>/Ödev/iu.test(a.name)));assert.ok(homework.every((x)=>x.workloads.some((r)=>/Ödev/iu.test(r.name))));const publicSource=await readFile(new URL("../app/programlar/[slug]/ProgramCourses.tsx",import.meta.url),"utf8"),serverSource=await readFile(new URL("../server.mjs",import.meta.url),"utf8");for(const code of ["GTB8XX","GTB806","GTB82X","GTB81X"]){assert.match(publicSource,new RegExp(`mergedProcessCourseCodes[\\s\\S]*${code}`));assert.match(serverSource,new RegExp(`trustedMergedPoolCodes[\\s\\S]*${code}`))}assert.match(serverSource,/session\.role === "akademisyen"\) return assignedToUser/u);assert.match(serverSource,/return assignedToUser \|\| \(departmentMatches && poolCourse\)/u)});

test("Harita Mühendisliği tezli YL paketleri handoff kalite kurallarını karşılar",async()=>{const seed=JSON.parse(await readFile(new URL("../seed/course-packages.json",import.meta.url),"utf8"));const packages=seed.filter((x)=>x.department==="Harita Mühendisliği ABD"&&x.programName==="Harita Mühendisliği"&&x.level==="Tezli Yüksek Lisans");const forbidden=/(quiz|ödev|proje|sunum|konu tekrarı|genel tekrar|ara\s*sınav|yarıyıl sonu sınavı)/iu;assert.equal(packages.length,28);for(const code of ["DAN8XX","HRM8XX","HRM806","HRM809","HRM81X"])assert.equal(packages.filter((x)=>x.code===code).length,1,`${code}: tek kanonik paket`);for(const p of packages){assert.equal(p.weeklyTopics.length,15,`${p.code}: 15 hafta`);assert.equal(p.weeklyTopics.some((x)=>forbidden.test(x)),false,`${p.code}: akademik konu`);assert.equal(p.outcomes.length,5);assert.ok(p.contributionMatrix.every((r)=>r.values.length===11&&r.values.every((v)=>v>=1&&v<=5)));assert.equal(p.workloads.reduce((s,r)=>s+r.total,0),p.ects*30);assert.equal(p.workloads.every((r)=>Number.isInteger(r.hours*2)),true);assert.equal(p.qualityChecks.length,21);assert.equal(p.publicQualityChecklist,false)}assert.equal(packages.filter((x)=>!["DAN8XX","HRM8XX","HRM806","HRM809","HRM81X"].includes(x.code)&&!x.sourceUrl).length,0)});

test("Harita Mühendisliği ortak havuzu ile rol yetkileri ayrıdır",async()=>{const seed=JSON.parse(await readFile(new URL("../seed/course-packages.json",import.meta.url),"utf8"));const packages=seed.filter((x)=>x.department==="Harita Mühendisliği ABD"&&x.programName==="Harita Mühendisliği");const homework=packages.filter((x)=>x.assessments.some((a)=>/Ödev/iu.test(a.name)));assert.ok(homework.every((x)=>x.workloads.some((r)=>/Ödev/iu.test(r.name))));const publicSource=await readFile(new URL("../app/programlar/[slug]/ProgramCourses.tsx",import.meta.url),"utf8"),serverSource=await readFile(new URL("../server.mjs",import.meta.url),"utf8");for(const code of ["HRM8XX","HRM806","HRM809","HRM81X"]){assert.match(publicSource,new RegExp(`mergedProcessCourseCodes[\\s\\S]*${code}`));assert.match(serverSource,new RegExp(`trustedMergedPoolCodes[\\s\\S]*${code}`))}assert.match(serverSource,/session\.role === "akademisyen"\) return assignedToUser/u);assert.match(serverSource,/return assignedToUser \|\| \(departmentMatches && poolCourse\)/u)});

test("İç Hastalıkları Hemşireliği tezli YL paketleri handoff kalite kurallarını karşılar",async()=>{const seed=JSON.parse(await readFile(new URL("../seed/course-packages.json",import.meta.url),"utf8"));const packages=seed.filter((x)=>x.department==="Hemşirelik ABD"&&x.programName==="İç Hastalıkları Hemşireliği"&&x.level==="Tezli Yüksek Lisans");const forbidden=/(quiz|ödev|proje|sunum|konu tekrarı|genel tekrar|ara\s*sınav|yarıyıl sonu sınavı)/iu;assert.equal(packages.length,20);for(const code of ["DAN8XX","İHH8XX","İHH806","İHH809","İHH81X"])assert.equal(packages.filter((x)=>x.code===code).length,1,`${code}: tek kanonik paket`);for(const p of packages){assert.equal(p.weeklyTopics.length,15,`${p.code}: 15 hafta`);assert.equal(p.weeklyTopics.some((x)=>forbidden.test(x)),false,`${p.code}: akademik konu`);assert.equal(p.outcomes.length,5,`${p.code}: 5 DÖÇ`);assert.equal(p.contributionMatrix.length,5,`${p.code}: 5 matris satırı`);assert.ok(p.contributionMatrix.every((r)=>r.values.length===11&&r.values.every((v)=>v>=1&&v<=5)),`${p.code}: 1-5 matris`);assert.equal(p.workloads.reduce((s,r)=>s+r.total,0),p.ects*30,`${p.code}: AKTS`);assert.equal(p.workloads.every((r)=>Number.isInteger(r.hours*2)),true,`${p.code}: tam/yarım saat`);assert.equal(p.qualityChecks.length,21,`${p.code}: iç kontrol`);assert.equal(p.publicQualityChecklist,false,`${p.code}: kontrol listesi gizli`)}assert.equal(packages.filter((x)=>!["DAN8XX","İHH8XX","İHH806","İHH809","İHH81X"].includes(x.code)&&!x.sourceUrl).length,0)});

test("İç Hastalıkları Hemşireliği ortak havuzu ile rol yetkileri ayrıdır",async()=>{const seed=JSON.parse(await readFile(new URL("../seed/course-packages.json",import.meta.url),"utf8"));const packages=seed.filter((x)=>x.department==="Hemşirelik ABD"&&x.programName==="İç Hastalıkları Hemşireliği");const homework=packages.filter((x)=>x.assessments.some((a)=>/Ödev/iu.test(a.name)));assert.ok(homework.every((x)=>x.workloads.some((r)=>/Ödev/iu.test(r.name))));const publicSource=await readFile(new URL("../app/programlar/[slug]/ProgramCourses.tsx",import.meta.url),"utf8"),serverSource=await readFile(new URL("../server.mjs",import.meta.url),"utf8");for(const code of ["İHH8XX","İHH806","İHH809","İHH81X"]){assert.match(publicSource,new RegExp(`mergedProcessCourseCodes[\\s\\S]*${code}`));assert.match(serverSource,new RegExp(`trustedMergedPoolCodes[\\s\\S]*${code}`))}assert.match(serverSource,/session\.role === "akademisyen"\) return assignedToUser/u);assert.match(serverSource,/return assignedToUser \|\| \(departmentMatches && poolCourse\)/u)});

test("İktisat tezli YL paketleri handoff kalite kurallarını karşılar",async()=>{const seed=JSON.parse(await readFile(new URL("../seed/course-packages.json",import.meta.url),"utf8"));const packages=seed.filter((x)=>x.department==="İktisat ABD"&&x.programName==="İktisat"&&x.level==="Tezli Yüksek Lisans");const forbidden=/(quiz|ödev|proje|sunum|konu tekrarı|genel tekrar|ara\s*sınav|yarıyıl sonu sınavı)/iu;assert.equal(packages.length,32);for(const code of ["DAN8XX","İKT8XX","İKT806","İKT897","İKT81X"])assert.equal(packages.filter((x)=>x.code===code).length,1,`${code}: tek kanonik paket`);for(const p of packages){assert.equal(p.weeklyTopics.length,15,`${p.code}: 15 hafta`);assert.equal(p.weeklyTopics.some((x)=>forbidden.test(x)),false,`${p.code}: akademik konu`);assert.equal(p.outcomes.length,5,`${p.code}: 5 DÖÇ`);assert.equal(p.contributionMatrix.length,5,`${p.code}: 5 matris satırı`);assert.ok(p.contributionMatrix.every((r)=>r.values.length===11&&r.values.every((v)=>v>=1&&v<=5)),`${p.code}: 1-5 matris`);assert.equal(p.workloads.reduce((s,r)=>s+r.total,0),p.ects*30,`${p.code}: AKTS`);assert.equal(p.workloads.every((r)=>Number.isInteger(r.hours*2)),true,`${p.code}: tam/yarım saat`);assert.equal(p.qualityChecks.length,21,`${p.code}: iç kontrol`);assert.equal(p.publicQualityChecklist,false,`${p.code}: kontrol listesi gizli`)}assert.deepEqual(packages.filter((x)=>!["DAN8XX","İKT8XX","İKT806","İKT897","İKT81X"].includes(x.code)&&!x.sourceUrl).map((x)=>x.code).sort(),["İKT809","İKT811"])});

test("İktisat ortak havuzu ile ABD başkanı ve akademisyen yetkileri ayrıdır",async()=>{const seed=JSON.parse(await readFile(new URL("../seed/course-packages.json",import.meta.url),"utf8"));const packages=seed.filter((x)=>x.department==="İktisat ABD"&&x.programName==="İktisat");const homework=packages.filter((x)=>x.assessments.some((a)=>/Ödev/iu.test(a.name)));assert.ok(homework.every((x)=>x.workloads.some((r)=>/Ödev/iu.test(r.name))));const publicSource=await readFile(new URL("../app/programlar/[slug]/ProgramCourses.tsx",import.meta.url),"utf8"),serverSource=await readFile(new URL("../server.mjs",import.meta.url),"utf8");for(const code of ["İKT8XX","İKT806","İKT897","İKT81X"]){assert.match(publicSource,new RegExp(`mergedProcessCourseCodes[\\s\\S]*${code}`));assert.match(serverSource,new RegExp(`trustedMergedPoolCodes[\\s\\S]*${code}`))}assert.match(serverSource,/session\.role === "akademisyen"\) return assignedToUser/u);assert.match(serverSource,/return assignedToUser \|\| \(departmentMatches && poolCourse\)/u)});

test("İnşaat Mühendisliği tezli YL paketleri handoff kalite kurallarını karşılar",async()=>{const seed=JSON.parse(await readFile(new URL("../seed/course-packages.json",import.meta.url),"utf8"));const packages=seed.filter((x)=>x.department==="İnşaat Mühendisliği ABD"&&x.programName==="İnşaat Mühendisliği"&&x.level==="Tezli Yüksek Lisans");const forbidden=/^(quiz|ödev|proje|sunum|konu tekrarı|genel tekrar|ara\s*sınav|yarıyıl sonu sınavı)$/iu;assert.equal(packages.length,66);for(const code of ["DAN8XX","İNŞ8XX","İNŞ806","İNŞ897","İNŞ81X"])assert.equal(packages.filter((x)=>x.code===code).length,1,`${code}: tek kanonik paket`);for(const p of packages){assert.equal(p.weeklyTopics.length,15,`${p.code}: 15 hafta`);assert.equal(p.weeklyTopics.some((x)=>forbidden.test(x)),false,`${p.code}: akademik konu`);assert.equal(p.outcomes.length,5,`${p.code}: 5 DÖÇ`);assert.equal(p.contributionMatrix.length,5,`${p.code}: 5 matris satırı`);assert.ok(p.contributionMatrix.every((r)=>r.values.length===11&&r.values.every((v)=>v>=1&&v<=5)),`${p.code}: 1-5 matris`);assert.equal(p.workloads.reduce((s,r)=>s+r.total,0),p.ects*30,`${p.code}: AKTS`);assert.equal(p.workloads.every((r)=>Number.isInteger(r.hours*2)),true,`${p.code}: tam/yarım saat`);assert.equal(p.qualityChecks.length,21,`${p.code}: iç kontrol`);assert.equal(p.publicQualityChecklist,false,`${p.code}: kontrol listesi gizli`)}assert.deepEqual(packages.filter((x)=>!["DAN8XX","İNŞ8XX","İNŞ806","İNŞ897","İNŞ81X"].includes(x.code)&&!x.sourceUrl).map((x)=>x.code).sort(),["İNŞ827","İNŞ832","İNŞ833","İNŞ836","İNŞ849","İNŞ850","İNŞ866","İNŞ868","İNŞ871","İNŞ885"].sort())});

test("İnşaat Mühendisliği ortak havuzu ile ABD başkanı ve akademisyen yetkileri ayrıdır",async()=>{const seed=JSON.parse(await readFile(new URL("../seed/course-packages.json",import.meta.url),"utf8"));const packages=seed.filter((x)=>x.department==="İnşaat Mühendisliği ABD"&&x.programName==="İnşaat Mühendisliği");const homework=packages.filter((x)=>x.assessments.some((a)=>/Ödev/iu.test(a.name)));assert.ok(homework.every((x)=>x.workloads.some((r)=>/Ödev/iu.test(r.name))));const publicSource=await readFile(new URL("../app/programlar/[slug]/ProgramCourses.tsx",import.meta.url),"utf8"),serverSource=await readFile(new URL("../server.mjs",import.meta.url),"utf8");for(const code of ["İNŞ8XX","İNŞ806","İNŞ897","İNŞ81X"]){assert.match(publicSource,new RegExp(`mergedProcessCourseCodes[\\s\\S]*${code}`));assert.match(serverSource,new RegExp(`trustedMergedPoolCodes[\\s\\S]*${code}`))}assert.match(serverSource,/session\.role === "akademisyen"\) return assignedToUser/u);assert.match(serverSource,/return assignedToUser \|\| \(departmentMatches && poolCourse\)/u)});

test("İşletme tezli YL paketleri handoff kalite kurallarını karşılar",async()=>{const seed=JSON.parse(await readFile(new URL("../seed/course-packages.json",import.meta.url),"utf8"));const packages=seed.filter((x)=>x.department==="İşletme"&&x.programName==="İşletme"&&x.level==="Tezli Yüksek Lisans");const forbidden=/^(quiz|ödev|proje|sunum|konu tekrarı|genel tekrar|ara\s*sınav|yarıyıl sonu sınavı)$/iu;assert.equal(packages.length,82);for(const code of ["DAN8XX","ISL8XX","ISL806","ISL885","ISL81X"])assert.equal(packages.filter((x)=>x.code===code).length,1,`${code}: tek kanonik paket`);for(const p of packages){assert.equal(p.weeklyTopics.length,15,`${p.code}: 15 hafta`);assert.equal(p.weeklyTopics.some((x)=>forbidden.test(x)),false,`${p.code}: akademik konu`);assert.equal(p.outcomes.length,5);assert.equal(p.contributionMatrix.length,5);assert.ok(p.contributionMatrix.every((r)=>r.values.length===11&&r.values.every((v)=>v>=1&&v<=5)));assert.equal(p.workloads.reduce((s,r)=>s+r.total,0),p.ects*30);assert.equal(p.workloads.every((r)=>Number.isInteger(r.hours*2)),true);assert.equal(p.qualityChecks.length,21);assert.equal(p.publicQualityChecklist,false)}assert.deepEqual(packages.filter((x)=>!["DAN8XX","ISL8XX","ISL806","ISL885","ISL81X"].includes(x.code)&&!x.sourceUrl).map((x)=>x.code),["ISL837"])});

test("İşletme ortak havuzu ile ABD başkanı ve akademisyen yetkileri ayrıdır",async()=>{const seed=JSON.parse(await readFile(new URL("../seed/course-packages.json",import.meta.url),"utf8"));const packages=seed.filter((x)=>x.department==="İşletme"&&x.programName==="İşletme"&&x.level==="Tezli Yüksek Lisans");const homework=packages.filter((x)=>x.assessments.some((a)=>/Ödev/iu.test(a.name)));assert.ok(homework.every((x)=>x.workloads.some((r)=>/Ödev/iu.test(r.name))));const publicSource=await readFile(new URL("../app/programlar/[slug]/ProgramCourses.tsx",import.meta.url),"utf8"),serverSource=await readFile(new URL("../server.mjs",import.meta.url),"utf8");for(const code of ["ISL8XX","ISL806","ISL885","ISL81X"]){assert.match(publicSource,new RegExp(`mergedProcessCourseCodes[\\s\\S]*${code}`));assert.match(serverSource,new RegExp(`trustedMergedPoolCodes[\\s\\S]*${code}`))}assert.match(serverSource,/session\.role === "akademisyen"\) return assignedToUser/u);assert.match(serverSource,/return assignedToUser \|\| \(departmentMatches && poolCourse\)/u)});

test("Kimya tezli YL paketleri handoff kalite kurallarını karşılar",async()=>{const seed=JSON.parse(await readFile(new URL("../seed/course-packages.json",import.meta.url),"utf8"));const packages=seed.filter((x)=>x.department==="Kimya ABD"&&x.programName==="Kimya"&&x.level==="Tezli Yüksek Lisans");const forbidden=/^(quiz|ödev|proje|sunum|konu tekrarı|genel tekrar|ara\s*sınav|yarıyıl sonu sınavı)$/iu;assert.equal(packages.length,36);for(const code of ["DAN8XX","KİM8XX","KİM806","KİM839","KİM81X"])assert.equal(packages.filter((x)=>x.code===code).length,1);for(const p of packages){assert.equal(p.weeklyTopics.length,15,`${p.code}: 15 hafta`);assert.equal(p.weeklyTopics.some((x)=>forbidden.test(x)),false);assert.equal(p.outcomes.length,5);assert.equal(p.contributionMatrix.length,5);assert.ok(p.contributionMatrix.every((r)=>r.values.length===11&&r.values.every((v)=>v>=1&&v<=5)));assert.equal(p.workloads.reduce((s,r)=>s+r.total,0),p.ects*30);assert.equal(p.workloads.every((r)=>Number.isInteger(r.hours*2)),true);assert.equal(p.qualityChecks.length,21);assert.equal(p.publicQualityChecklist,false)}assert.equal(packages.filter((x)=>!["DAN8XX","KİM8XX","KİM806","KİM839","KİM81X"].includes(x.code)&&!x.sourceUrl).length,0)});

test("Kimya ortak havuzu ile ABD başkanı ve akademisyen yetkileri ayrıdır",async()=>{const seed=JSON.parse(await readFile(new URL("../seed/course-packages.json",import.meta.url),"utf8"));const packages=seed.filter((x)=>x.department==="Kimya ABD"&&x.programName==="Kimya"&&x.level==="Tezli Yüksek Lisans");const homework=packages.filter((x)=>x.assessments.some((a)=>/Ödev/iu.test(a.name)));assert.ok(homework.every((x)=>x.workloads.some((r)=>/Ödev/iu.test(r.name))));const publicSource=await readFile(new URL("../app/programlar/[slug]/ProgramCourses.tsx",import.meta.url),"utf8"),serverSource=await readFile(new URL("../server.mjs",import.meta.url),"utf8");for(const code of ["KİM8XX","KİM806","KİM839","KİM81X"]){assert.match(publicSource,new RegExp(`mergedProcessCourseCodes[\\s\\S]*${code}`));assert.match(serverSource,new RegExp(`trustedMergedPoolCodes[\\s\\S]*${code}`))}assert.match(serverSource,/session\.role === "akademisyen"\) return assignedToUser/u);assert.match(serverSource,/return assignedToUser \|\| \(departmentMatches && poolCourse\)/u)});

test("Matematik tezli YL paketleri handoff kalite kurallarını karşılar",async()=>{const seed=JSON.parse(await readFile(new URL("../seed/course-packages.json",import.meta.url),"utf8"));const packages=seed.filter((x)=>x.department==="Matematik ABD"&&x.programName==="Matematik"&&x.level==="Tezli Yüksek Lisans");const forbidden=/^(quiz|ödev|proje|sunum|konu tekrarı|genel tekrar|ara\s*sınav|yarıyıl sonu sınavı)$/iu;assert.equal(packages.length,58);for(const code of ["DAN8XX","MAT8XX","MAT805","MAT863","MAT81X"])assert.equal(packages.filter((x)=>x.code===code).length,1);for(const p of packages){assert.equal(p.weeklyTopics.length,15,`${p.code}: 15 hafta`);assert.equal(p.weeklyTopics.some((x)=>forbidden.test(x)),false);assert.equal(p.outcomes.length,5);assert.equal(p.contributionMatrix.length,5);assert.ok(p.contributionMatrix.every((r)=>r.values.length===11&&r.values.every((v)=>v>=1&&v<=5)));assert.equal(p.workloads.reduce((s,r)=>s+r.total,0),p.ects*30);assert.equal(p.workloads.every((r)=>Number.isInteger(r.hours*2)),true);assert.equal(p.qualityChecks.length,21);assert.equal(p.publicQualityChecklist,false)}assert.deepEqual(packages.filter((x)=>!["DAN8XX","MAT8XX","MAT805","MAT863","MAT81X"].includes(x.code)&&!x.sourceUrl).map((x)=>x.code).sort(),["MAT815","MAT816","MAT824","MAT825","MAT831","MAT848","MAT849","MAT858","MAT859"])});

test("Matematik ortak havuzu ile ABD başkanı ve akademisyen yetkileri ayrıdır",async()=>{const seed=JSON.parse(await readFile(new URL("../seed/course-packages.json",import.meta.url),"utf8"));const packages=seed.filter((x)=>x.department==="Matematik ABD"&&x.programName==="Matematik"&&x.level==="Tezli Yüksek Lisans");const homework=packages.filter((x)=>x.assessments.some((a)=>/Ödev/iu.test(a.name)));assert.ok(homework.every((x)=>x.workloads.some((r)=>/Ödev/iu.test(r.name))));const publicSource=await readFile(new URL("../app/programlar/[slug]/ProgramCourses.tsx",import.meta.url),"utf8"),serverSource=await readFile(new URL("../server.mjs",import.meta.url),"utf8");for(const code of ["MAT8XX","MAT805","MAT863","MAT81X"]){assert.match(publicSource,new RegExp(`mergedProcessCourseCodes[\\s\\S]*${code}`));assert.match(serverSource,new RegExp(`trustedMergedPoolCodes[\\s\\S]*${code}`))}assert.match(serverSource,/session\.role === "akademisyen"\) return assignedToUser/u);assert.match(serverSource,/return assignedToUser \|\| \(departmentMatches && poolCourse\)/u)});

test("Muhasebe ve Finansman tezli YL paketleri handoff kalite kurallarını karşılar",async()=>{const seed=JSON.parse(await readFile(new URL("../seed/course-packages.json",import.meta.url),"utf8"));const packages=seed.filter((x)=>x.department==="Muhasebe ve Finansman"&&x.programName==="Muhasebe ve Finansman"&&x.level==="Tezli Yüksek Lisans");const forbidden=/^(quiz|ödev|proje|sunum|konu tekrarı|genel tekrar|ara\s*sınav|yarıyıl sonu sınavı)$/iu;assert.equal(packages.length,46);for(const code of ["DAN8XX","MUF8XX","MUF805","MUF849","MUF81X"])assert.equal(packages.filter((x)=>x.code===code).length,1);for(const p of packages){assert.equal(p.weeklyTopics.length,15,`${p.code}: 15 hafta`);assert.equal(p.weeklyTopics.some((x)=>forbidden.test(x)),false);assert.equal(p.outcomes.length,5);assert.equal(p.contributionMatrix.length,5);assert.ok(p.contributionMatrix.every((r)=>r.values.length===11&&r.values.every((v)=>v>=1&&v<=5)));assert.equal(p.workloads.reduce((s,r)=>s+r.total,0),p.ects*30);assert.equal(p.workloads.every((r)=>Number.isInteger(r.hours*2)),true);assert.equal(p.qualityChecks.length,21);assert.equal(p.publicQualityChecklist,false)}assert.equal(packages.filter((x)=>!["DAN8XX","MUF8XX","MUF805","MUF849","MUF81X"].includes(x.code)&&!x.sourceUrl).length,0)});

test("Muhasebe ve Finansman ortak havuzu ile ABD başkanı ve akademisyen yetkileri ayrıdır",async()=>{const seed=JSON.parse(await readFile(new URL("../seed/course-packages.json",import.meta.url),"utf8"));const packages=seed.filter((x)=>x.department==="Muhasebe ve Finansman"&&x.programName==="Muhasebe ve Finansman"&&x.level==="Tezli Yüksek Lisans");const homework=packages.filter((x)=>x.assessments.some((a)=>/Ödev/iu.test(a.name)));assert.ok(homework.every((x)=>x.workloads.some((r)=>/Ödev/iu.test(r.name))));const publicSource=await readFile(new URL("../app/programlar/[slug]/ProgramCourses.tsx",import.meta.url),"utf8"),serverSource=await readFile(new URL("../server.mjs",import.meta.url),"utf8");for(const code of ["MUF8XX","MUF805","MUF849","MUF81X"]){assert.match(publicSource,new RegExp(`mergedProcessCourseCodes[\\s\\S]*${code}`));assert.match(serverSource,new RegExp(`trustedMergedPoolCodes[\\s\\S]*${code}`))}assert.match(serverSource,/session\.role === "akademisyen"\) return assignedToUser/u);assert.match(serverSource,/return assignedToUser \|\| \(departmentMatches && poolCourse\)/u)});

test("Organik Tarım İşletmeciliği tezli YL paketleri handoff kalite kurallarını karşılar",async()=>{const seed=JSON.parse(await readFile(new URL("../seed/course-packages.json",import.meta.url),"utf8"));const packages=seed.filter((x)=>x.department==="Organik Tarım İşletmeciliği ABD"&&x.programName==="Organik Tarım İşletmeciliği"&&x.level==="Tezli Yüksek Lisans");const forbidden=/^(quiz|ödev|proje|sunum|konu tekrarı|genel tekrar|ara\s*sınav|yarıyıl sonu sınavı)$/iu;assert.equal(packages.length,44);for(const code of ["DAN8XX","OTİ8XX","OTİ805","OTİ841","OTİ81X"])assert.equal(packages.filter((x)=>x.code===code).length,1);for(const p of packages){assert.equal(p.weeklyTopics.length,15,`${p.code}: 15 hafta`);assert.equal(p.weeklyTopics.some((x)=>forbidden.test(x)),false);assert.equal(p.outcomes.length,5);assert.equal(p.contributionMatrix.length,5);assert.ok(p.contributionMatrix.every((r)=>r.values.length===11&&r.values.every((v)=>v>=1&&v<=5)));assert.equal(p.workloads.reduce((s,r)=>s+r.total,0),p.ects*30);assert.equal(p.workloads.every((r)=>Number.isInteger(r.hours*2)),true);assert.equal(p.qualityChecks.length,21);assert.equal(p.publicQualityChecklist,false)}assert.equal(packages.filter((x)=>!["DAN8XX","OTİ8XX","OTİ805","OTİ841","OTİ81X"].includes(x.code)&&!x.sourceUrl).length,0)});

test("Organik Tarım ortak havuzu ile ABD başkanı ve akademisyen yetkileri ayrıdır",async()=>{const seed=JSON.parse(await readFile(new URL("../seed/course-packages.json",import.meta.url),"utf8"));const packages=seed.filter((x)=>x.department==="Organik Tarım İşletmeciliği ABD"&&x.programName==="Organik Tarım İşletmeciliği"&&x.level==="Tezli Yüksek Lisans");const homework=packages.filter((x)=>x.assessments.some((a)=>/Ödev/iu.test(a.name)));assert.ok(homework.every((x)=>x.workloads.some((r)=>/Ödev/iu.test(r.name))));const publicSource=await readFile(new URL("../app/programlar/[slug]/ProgramCourses.tsx",import.meta.url),"utf8"),serverSource=await readFile(new URL("../server.mjs",import.meta.url),"utf8");for(const code of ["OTİ8XX","OTİ805","OTİ841","OTİ81X"]){assert.match(publicSource,new RegExp(`mergedProcessCourseCodes[\\s\\S]*${code}`));assert.match(serverSource,new RegExp(`trustedMergedPoolCodes[\\s\\S]*${code}`))}assert.match(serverSource,/session\.role === "akademisyen"\) return assignedToUser/u);assert.match(serverSource,/return assignedToUser \|\| \(departmentMatches && poolCourse\)/u)});

test("Resim tezli YL paketleri handoff kalite kurallarını karşılar",async()=>{const seed=JSON.parse(await readFile(new URL("../seed/course-packages.json",import.meta.url),"utf8"));const packages=seed.filter((x)=>x.department==="Resim ASD"&&x.programName==="Resim"&&x.level==="Tezli Yüksek Lisans");const forbidden=/^(quiz|ödev|proje|sunum|konu tekrarı|genel tekrar|ara\s*sınav|yarıyıl sonu sınavı)$/iu;assert.equal(packages.length,21);for(const code of ["DAN8XX","RES8XX","RES805","RES881","RES81X"])assert.equal(packages.filter((x)=>x.code===code).length,1);for(const p of packages){assert.equal(p.weeklyTopics.length,15,`${p.code}: 15 hafta`);assert.equal(p.weeklyTopics.some((x)=>forbidden.test(x)),false);assert.equal(p.outcomes.length,5);assert.equal(p.contributionMatrix.length,5);assert.ok(p.contributionMatrix.every((r)=>r.values.length===11&&r.values.every((v)=>v>=1&&v<=5)));assert.equal(p.workloads.reduce((s,r)=>s+r.total,0),p.ects*30);assert.equal(p.workloads.every((r)=>Number.isInteger(r.hours*2)),true);assert.equal(p.qualityChecks.length,21);assert.equal(p.publicQualityChecklist,false)}assert.deepEqual(packages.filter((x)=>!["DAN8XX","RES8XX","RES805","RES881","RES81X"].includes(x.code)&&!x.sourceUrl).map((x)=>x.code),["RES818"])});

test("Resim ortak havuzu ile ASD başkanı ve akademisyen yetkileri ayrıdır",async()=>{const seed=JSON.parse(await readFile(new URL("../seed/course-packages.json",import.meta.url),"utf8"));const packages=seed.filter((x)=>x.department==="Resim ASD"&&x.programName==="Resim"&&x.level==="Tezli Yüksek Lisans");const homework=packages.filter((x)=>x.assessments.some((a)=>/Ödev/iu.test(a.name)));assert.ok(homework.every((x)=>x.workloads.some((r)=>/Ödev/iu.test(r.name))));const publicSource=await readFile(new URL("../app/programlar/[slug]/ProgramCourses.tsx",import.meta.url),"utf8"),serverSource=await readFile(new URL("../server.mjs",import.meta.url),"utf8");for(const code of ["RES8XX","RES805","RES881","RES81X"]){assert.match(publicSource,new RegExp(`mergedProcessCourseCodes[\\s\\S]*${code}`));assert.match(serverSource,new RegExp(`trustedMergedPoolCodes[\\s\\S]*${code}`))}assert.match(serverSource,/session\.role === "akademisyen"\) return assignedToUser/u);assert.match(serverSource,/return assignedToUser \|\| \(departmentMatches && poolCourse\)/u)});

test("Siyaset Bilimi ve Kamu Yönetimi tezli YL paketleri handoff kalite kurallarını karşılar",async()=>{const seed=JSON.parse(await readFile(new URL("../seed/course-packages.json",import.meta.url),"utf8"));const packages=seed.filter((x)=>x.department==="Siyaset Bilimi ve Kamu Yönetimi ABD"&&x.programName==="Siyaset Bilimi ve Kamu Yönetimi"&&x.level==="Tezli Yüksek Lisans");const forbidden=/^(quiz|ödev|proje|sunum|konu tekrarı|genel tekrar|ara\s*sınav|yarıyıl sonu sınavı)$/iu;assert.equal(packages.length,50);for(const code of ["DAN8XX","SKY8XX","SKY805","SKY899","SKY81X"])assert.equal(packages.filter((x)=>x.code===code).length,1);for(const p of packages){assert.equal(p.weeklyTopics.length,15,`${p.code}: 15 hafta`);assert.equal(p.weeklyTopics.some((x)=>forbidden.test(x)),false);assert.equal(p.outcomes.length,5);assert.equal(p.contributionMatrix.length,5);assert.ok(p.contributionMatrix.every((r)=>r.values.length===11&&r.values.every((v)=>v>=1&&v<=5)));assert.equal(p.workloads.reduce((s,r)=>s+r.total,0),p.ects*30);assert.equal(p.workloads.every((r)=>Number.isInteger(r.hours*2)),true);assert.equal(p.qualityChecks.length,21);assert.equal(p.publicQualityChecklist,false)}assert.deepEqual(packages.filter((x)=>!["DAN8XX","SKY8XX","SKY805","SKY899","SKY81X"].includes(x.code)&&!x.sourceUrl).map((x)=>x.code),["SKY811","SKY813","SKY819","SKY825","SKY833","SKY835","SKY837","SKY841","SKY814","SKY818","SKY820","SKY824","SKY828","SKY834","SKY838"])});

test("Siyaset Bilimi ve Kamu Yönetimi ortak havuzu ile ABD başkanı ve akademisyen yetkileri ayrıdır",async()=>{const seed=JSON.parse(await readFile(new URL("../seed/course-packages.json",import.meta.url),"utf8"));const packages=seed.filter((x)=>x.department==="Siyaset Bilimi ve Kamu Yönetimi ABD"&&x.programName==="Siyaset Bilimi ve Kamu Yönetimi"&&x.level==="Tezli Yüksek Lisans");const homework=packages.filter((x)=>x.assessments.some((a)=>/Ödev/iu.test(a.name)));assert.ok(homework.every((x)=>x.workloads.some((r)=>/Ödev/iu.test(r.name))));const publicSource=await readFile(new URL("../app/programlar/[slug]/ProgramCourses.tsx",import.meta.url),"utf8"),serverSource=await readFile(new URL("../server.mjs",import.meta.url),"utf8");for(const code of ["SKY8XX","SKY805","SKY899","SKY81X"]){assert.match(publicSource,new RegExp(`mergedProcessCourseCodes[\\s\\S]*${code}`));assert.match(serverSource,new RegExp(`trustedMergedPoolCodes[\\s\\S]*${code}`))}assert.match(serverSource,/session\.role === "akademisyen"\) return assignedToUser/u);assert.match(serverSource,/return assignedToUser \|\| \(departmentMatches && poolCourse\)/u)});

test("Tarih tezli YL paketleri handoff kalite kurallarını karşılar",async()=>{const seed=JSON.parse(await readFile(new URL("../seed/course-packages.json",import.meta.url),"utf8"));const packages=seed.filter((x)=>x.department==="Tarih ABD"&&x.programName==="Tarih"&&x.level==="Tezli Yüksek Lisans");const forbidden=/^(quiz|ödev|proje|sunum|konu tekrarı|genel tekrar|ara\s*sınav|yarıyıl sonu sınavı)$/iu;assert.equal(packages.length,94);for(const code of ["DAN8XX","TTZ8XX","TTZ805","BES801","TTZ81X"])assert.equal(packages.filter((x)=>x.code===code).length,1);for(const p of packages){assert.equal(p.weeklyTopics.length,15,`${p.code}: 15 hafta`);assert.equal(p.weeklyTopics.some((x)=>forbidden.test(x)),false);assert.equal(p.outcomes.length,5);assert.equal(p.contributionMatrix.length,5);assert.ok(p.contributionMatrix.every((r)=>r.values.length===11&&r.values.every((v)=>v>=1&&v<=5)));assert.equal(p.workloads.reduce((s,r)=>s+r.total,0),p.ects*30);assert.equal(p.workloads.every((r)=>Number.isInteger(r.hours*2)),true);assert.equal(p.qualityChecks.length,21);assert.equal(p.publicQualityChecklist,false)}assert.equal(packages.filter((x)=>!["DAN8XX","TTZ8XX","TTZ805","BES801","TTZ81X"].includes(x.code)&&!x.sourceUrl).length,45)});

test("Tarih ortak havuzu ile ABD başkanı ve akademisyen yetkileri ayrıdır",async()=>{const seed=JSON.parse(await readFile(new URL("../seed/course-packages.json",import.meta.url),"utf8"));const packages=seed.filter((x)=>x.department==="Tarih ABD"&&x.programName==="Tarih"&&x.level==="Tezli Yüksek Lisans");const homework=packages.filter((x)=>x.assessments.some((a)=>/Ödev/iu.test(a.name)));assert.ok(homework.every((x)=>x.workloads.some((r)=>/Ödev/iu.test(r.name))));const publicSource=await readFile(new URL("../app/programlar/[slug]/ProgramCourses.tsx",import.meta.url),"utf8"),serverSource=await readFile(new URL("../server.mjs",import.meta.url),"utf8");for(const code of ["TTZ8XX","TTZ805","BES801","TTZ81X"]){assert.match(publicSource,new RegExp(`mergedProcessCourseCodes[\\s\\S]*${code}`));assert.match(serverSource,new RegExp(`trustedMergedPoolCodes[\\s\\S]*${code}`))}assert.match(serverSource,/session\.role === "akademisyen"\) return assignedToUser/u);assert.match(serverSource,/return assignedToUser \|\| \(departmentMatches && poolCourse\)/u)});

test("Temel İslam Bilimleri tezli YL paketleri handoff kalite kurallarını karşılar",async()=>{const seed=JSON.parse(await readFile(new URL("../seed/course-packages.json",import.meta.url),"utf8"));const packages=seed.filter((x)=>x.department==="Temel İslam Bilimleri ABD"&&x.programName==="Temel İslam Bilimleri"&&x.level==="Tezli Yüksek Lisans");const forbidden=/^(quiz|ödev|proje|sunum|konu tekrarı|genel tekrar|ara\s*sınav|yarıyıl sonu sınavı)$/iu;assert.equal(packages.length,58);for(const code of ["DAN8XX","TİB8XX","TİB805","TİB879","TİB81X"])assert.equal(packages.filter((x)=>x.code===code).length,1);for(const p of packages){assert.equal(p.weeklyTopics.length,15,`${p.code}: 15 hafta`);assert.equal(p.weeklyTopics.some((x)=>forbidden.test(x)),false);assert.equal(p.outcomes.length,5);assert.equal(p.contributionMatrix.length,5);assert.ok(p.contributionMatrix.every((r)=>r.values.length===11&&r.values.every((v)=>v>=1&&v<=5)));assert.equal(p.workloads.reduce((s,r)=>s+r.total,0),p.ects*30);assert.equal(p.workloads.every((r)=>Number.isInteger(r.hours*2)),true);assert.equal(p.qualityChecks.length,21);assert.equal(p.publicQualityChecklist,false)}assert.equal(packages.filter((x)=>!["DAN8XX","TİB8XX","TİB805","TİB879","TİB81X"].includes(x.code)&&!x.sourceUrl).length,14)});

test("Temel İslam Bilimleri ortak havuzu ile ABD başkanı ve akademisyen yetkileri ayrıdır",async()=>{const seed=JSON.parse(await readFile(new URL("../seed/course-packages.json",import.meta.url),"utf8"));const packages=seed.filter((x)=>x.department==="Temel İslam Bilimleri ABD"&&x.programName==="Temel İslam Bilimleri"&&x.level==="Tezli Yüksek Lisans");const homework=packages.filter((x)=>x.assessments.some((a)=>/Ödev/iu.test(a.name)));assert.ok(homework.every((x)=>x.workloads.some((r)=>/Ödev/iu.test(r.name))));const publicSource=await readFile(new URL("../app/programlar/[slug]/ProgramCourses.tsx",import.meta.url),"utf8"),serverSource=await readFile(new URL("../server.mjs",import.meta.url),"utf8");for(const code of ["TİB8XX","TİB805","TİB879","TİB81X"]){assert.match(publicSource,new RegExp(`mergedProcessCourseCodes[\\s\\S]*${code}`));assert.match(serverSource,new RegExp(`trustedMergedPoolCodes[\\s\\S]*${code}`))}assert.match(serverSource,/session\.role === "akademisyen"\) return assignedToUser/u);assert.match(serverSource,/return assignedToUser \|\| \(departmentMatches && poolCourse\)/u)});

test("Türk Dili ve Edebiyatı tezli YL paketleri handoff kalite kurallarını karşılar",async()=>{const seed=JSON.parse(await readFile(new URL("../seed/course-packages.json",import.meta.url),"utf8"));const packages=seed.filter((x)=>x.department==="Türk Dili ve Edebiyatı ABD"&&x.programName==="Türk Dili ve Edebiyatı"&&x.level==="Tezli Yüksek Lisans");const forbidden=/^(quiz|ödev|proje|sunum|konu tekrarı|genel tekrar|ara\s*sınav|yarıyıl sonu sınavı)$/iu;assert.equal(packages.length,94);for(const code of ["DAN8XX","TDE8XX","TDE805","BES801","TDE81X"])assert.equal(packages.filter((x)=>x.code===code).length,1);for(const p of packages){assert.equal(p.weeklyTopics.length,15,`${p.code}: 15 hafta`);assert.equal(p.weeklyTopics.some((x)=>forbidden.test(x)),false);assert.equal(p.outcomes.length,5);assert.equal(p.contributionMatrix.length,5);assert.ok(p.contributionMatrix.every((r)=>r.values.length===11&&r.values.every((v)=>v>=1&&v<=5)));assert.equal(p.workloads.reduce((s,r)=>s+r.total,0),p.ects*30);assert.equal(p.workloads.every((r)=>Number.isInteger(r.hours*2)),true);assert.equal(p.qualityChecks.length,21);assert.equal(p.publicQualityChecklist,false)}assert.equal(packages.filter((x)=>!["DAN8XX","TDE8XX","TDE805","BES801","TDE81X"].includes(x.code)&&!x.sourceUrl).length,40)});

test("Türk Dili ve Edebiyatı ortak havuzu ile ABD başkanı ve akademisyen yetkileri ayrıdır",async()=>{const seed=JSON.parse(await readFile(new URL("../seed/course-packages.json",import.meta.url),"utf8"));const packages=seed.filter((x)=>x.department==="Türk Dili ve Edebiyatı ABD"&&x.programName==="Türk Dili ve Edebiyatı"&&x.level==="Tezli Yüksek Lisans");const homework=packages.filter((x)=>x.assessments.some((a)=>/Ödev/iu.test(a.name)));assert.ok(homework.every((x)=>x.workloads.some((r)=>/Ödev/iu.test(r.name))));const publicSource=await readFile(new URL("../app/programlar/[slug]/ProgramCourses.tsx",import.meta.url),"utf8"),serverSource=await readFile(new URL("../server.mjs",import.meta.url),"utf8");for(const code of ["TDE8XX","TDE805","TDE81X"]){assert.match(publicSource,new RegExp(`mergedProcessCourseCodes[\\s\\S]*${code}`));assert.match(serverSource,new RegExp(`trustedMergedPoolCodes[\\s\\S]*${code}`))}assert.match(serverSource,/session\.role === "akademisyen"\) return assignedToUser/u);assert.match(serverSource,/return assignedToUser \|\| \(departmentMatches && poolCourse\)/u)});

test("Yönetim Bilişim Sistemleri tezli YL paketleri handoff kalite kurallarını karşılar",async()=>{const seed=JSON.parse(await readFile(new URL("../seed/course-packages.json",import.meta.url),"utf8"));const packages=seed.filter((x)=>x.department==="Yönetim Bilişim Sistemleri ABD"&&x.programName==="Yönetim Bilişim Sistemleri"&&x.level==="Tezli Yüksek Lisans");const forbidden=/^(quiz|ödev|proje|sunum|konu tekrarı|genel tekrar|ara\s*sınav|yarıyıl sonu sınavı)$/iu;assert.equal(packages.length,31);for(const code of ["DAN8XX","YBS8XX","YBS805","BES801","YBS81X"])assert.equal(packages.filter((x)=>x.code===code).length,1);for(const p of packages){assert.equal(p.weeklyTopics.length,15,`${p.code}: 15 hafta`);assert.equal(p.weeklyTopics.some((x)=>forbidden.test(x)),false);assert.equal(p.outcomes.length,5);assert.equal(p.contributionMatrix.length,5);assert.ok(p.contributionMatrix.every((r)=>r.values.length===11&&r.values.every((v)=>v>=1&&v<=5)));assert.equal(p.workloads.reduce((s,r)=>s+r.total,0),p.ects*30);assert.equal(p.workloads.every((r)=>Number.isInteger(r.hours*2)),true);assert.equal(p.qualityChecks.length,21);assert.equal(p.publicQualityChecklist,false)}assert.equal(packages.filter((x)=>!["DAN8XX","YBS8XX","YBS805","BES801","YBS81X"].includes(x.code)&&!x.sourceUrl).length,0)});

test("YBS tezli YL ortak havuzu ile ABD başkanı ve akademisyen yetkileri ayrıdır",async()=>{const seed=JSON.parse(await readFile(new URL("../seed/course-packages.json",import.meta.url),"utf8"));const packages=seed.filter((x)=>x.department==="Yönetim Bilişim Sistemleri ABD"&&x.programName==="Yönetim Bilişim Sistemleri"&&x.level==="Tezli Yüksek Lisans");const homework=packages.filter((x)=>x.assessments.some((a)=>/Ödev/iu.test(a.name)));assert.ok(homework.every((x)=>x.workloads.some((r)=>/Ödev/iu.test(r.name))));const publicSource=await readFile(new URL("../app/programlar/[slug]/ProgramCourses.tsx",import.meta.url),"utf8"),serverSource=await readFile(new URL("../server.mjs",import.meta.url),"utf8");for(const code of ["YBS8XX","YBS805","YBS81X"]){assert.match(publicSource,new RegExp(`mergedProcessCourseCodes[\\s\\S]*${code}`));assert.match(serverSource,new RegExp(`trustedMergedPoolCodes[\\s\\S]*${code}`))}assert.match(serverSource,/session\.role === "akademisyen"\) return assignedToUser/u);assert.match(serverSource,/return assignedToUser \|\| \(departmentMatches && poolCourse\)/u)});

test("Yönetim Organizasyon tezli YL paketleri handoff kalite kurallarını karşılar",async()=>{const seed=JSON.parse(await readFile(new URL("../seed/course-packages.json",import.meta.url),"utf8"));const packages=seed.filter((x)=>x.department==="Yönetim Organizasyon"&&x.programName==="Yönetim Organizasyon"&&x.level==="Tezli Yüksek Lisans");const forbidden=/^(quiz|ödev|proje|sunum|konu tekrarı|genel tekrar|ara\s*sınav|yarıyıl sonu sınavı|final)$/iu;assert.equal(packages.length,42);for(const code of ["DAN8XX","YON8XX","YON805","YON841","YON81X"])assert.equal(packages.filter((x)=>x.code===code).length,1);for(const p of packages){assert.equal(p.weeklyTopics.length,15,`${p.code}: 15 hafta`);assert.equal(p.weeklyTopics.some((x)=>forbidden.test(x)),false);assert.equal(p.outcomes.length,5);assert.equal(p.contributionMatrix.length,5);assert.ok(p.contributionMatrix.every((r)=>r.values.length===11&&r.values.every((v)=>v>=1&&v<=5)));assert.equal(p.workloads.reduce((s,r)=>s+r.total,0),p.ects*30);assert.equal(p.workloads.every((r)=>Number.isInteger(r.hours*2)),true);assert.equal(p.qualityChecks.length,21);assert.equal(p.publicQualityChecklist,false)}assert.equal(packages.filter((x)=>!["DAN8XX","YON8XX","YON805","YON841","YON81X"].includes(x.code)&&!x.sourceUrl).length,0)});

test("Yönetim Organizasyon ortak havuzu ile ABD başkanı ve akademisyen yetkileri ayrıdır",async()=>{const seed=JSON.parse(await readFile(new URL("../seed/course-packages.json",import.meta.url),"utf8"));const packages=seed.filter((x)=>x.department==="Yönetim Organizasyon"&&x.programName==="Yönetim Organizasyon"&&x.level==="Tezli Yüksek Lisans");const homework=packages.filter((x)=>x.assessments.some((a)=>/Ödev/iu.test(a.name)));assert.ok(homework.every((x)=>x.workloads.some((r)=>/Ödev/iu.test(r.name))));const publicSource=await readFile(new URL("../app/programlar/[slug]/ProgramCourses.tsx",import.meta.url),"utf8"),serverSource=await readFile(new URL("../server.mjs",import.meta.url),"utf8");for(const code of ["YON8XX","YON805","YON841","YON81X"]){assert.match(publicSource,new RegExp(`mergedProcessCourseCodes[\\s\\S]*${code}`));assert.match(serverSource,new RegExp(`trustedMergedPoolCodes[\\s\\S]*${code}`))}assert.match(serverSource,/session\.role === "akademisyen"\) return assignedToUser/u);assert.match(serverSource,/return assignedToUser \|\| \(departmentMatches && poolCourse\)/u)});

test("Biyoloji doktora paketleri handoff kalite kurallarını karşılar",async()=>{const seed=JSON.parse(await readFile(new URL("../seed/course-packages.json",import.meta.url),"utf8"));const packages=seed.filter((x)=>x.department==="Biyoloji ABD"&&x.programName==="Biyoloji"&&x.level==="Doktora");const forbidden=/^(quiz|ödev|proje|sunum|konu tekrarı|genel tekrar|ara\s*sınav|yarıyıl sonu sınavı|final)$/iu;assert.equal(packages.length,55);for(const code of ["DAN9XX","BİO9XX","BİO909","BİO917","BİO91X"])assert.equal(packages.filter((x)=>x.code===code).length,1);for(const p of packages){assert.equal(p.weeklyTopics.length,15,`${p.code}: 15 hafta`);assert.equal(p.weeklyTopics.some((x)=>forbidden.test(x)),false,`${p.code}: akademik konu`);assert.equal(p.outcomes.length,5);assert.equal(p.contributionMatrix.length,5);assert.ok(p.contributionMatrix.every((r)=>r.values.length===11&&r.values.every((v)=>v>=1&&v<=5)));assert.equal(p.workloads.reduce((s,r)=>s+r.total,0),p.ects*30);assert.equal(p.workloads.every((r)=>Number.isInteger(r.hours*2)),true);assert.equal(p.qualityChecks.length,21);assert.equal(p.publicQualityChecklist,false);assert.equal(/https?:|@/u.test(p.instructor||""),false)}assert.deepEqual(packages.filter((x)=>!["DAN9XX","BİO9XX","BİO909","BİO917","BİO91X"].includes(x.code)&&!x.sourceUrl).map((x)=>x.code).sort(),["BİO934","BİO936","BİO938","BİO941","BİO944","BİO953","BİO955","BİO960","PFE901"].sort())});

test("Biyoloji doktora ortak havuzu ile ABD başkanı ve akademisyen yetkileri ayrıdır",async()=>{const seed=JSON.parse(await readFile(new URL("../seed/course-packages.json",import.meta.url),"utf8"));const packages=seed.filter((x)=>x.department==="Biyoloji ABD"&&x.programName==="Biyoloji"&&x.level==="Doktora");const homework=packages.filter((x)=>x.assessments.some((a)=>/Ödev/iu.test(a.name)));assert.ok(homework.every((x)=>x.workloads.some((r)=>/Ödev/iu.test(r.name))));const publicSource=await readFile(new URL("../app/programlar/[slug]/ProgramCourses.tsx",import.meta.url),"utf8"),serverSource=await readFile(new URL("../server.mjs",import.meta.url),"utf8");for(const code of ["DAN9XX","BİO9XX","BİO909","BİO917","BİO91X"]){assert.match(publicSource,new RegExp(`mergedProcessCourseCodes[\\s\\S]*${code}`));assert.match(serverSource,new RegExp(`trustedMergedPoolCodes[\\s\\S]*${code}`))}assert.match(serverSource,/session\.role === "akademisyen"\) return assignedToUser/u);assert.match(serverSource,/return assignedToUser \|\| \(departmentMatches && poolCourse\)/u)});

test("Enerji Sistemleri doktora paketleri handoff kalite kurallarını karşılar",async()=>{const seed=JSON.parse(await readFile(new URL("../seed/course-packages.json",import.meta.url),"utf8"));const packages=seed.filter((x)=>x.department==="Enerji Sistemleri Mühendisliği ABD"&&x.programName==="Enerji Sistemleri Mühendisliği"&&x.level==="Doktora");const forbidden=/^(quiz|ödev|proje|sunum|konu tekrarı|genel tekrar|ara\s*sınav|yarıyıl sonu sınavı|final)$/iu;assert.equal(packages.length,28);for(const code of ["DAN9XX","EMB9XX","EMB909","EMB917","EMB91X"])assert.equal(packages.filter((x)=>x.code===code).length,1);for(const p of packages){assert.equal(p.weeklyTopics.length,15,`${p.code}: 15 hafta`);assert.equal(p.weeklyTopics.some((x)=>forbidden.test(x)),false,`${p.code}: akademik konu`);assert.equal(p.outcomes.length,5);assert.equal(p.contributionMatrix.length,5);assert.ok(p.contributionMatrix.every((r)=>r.values.length===11&&r.values.every((v)=>v>=1&&v<=5)));assert.equal(p.workloads.reduce((s,r)=>s+r.total,0),p.ects*30);assert.equal(p.workloads.every((r)=>Number.isInteger(r.hours*2)),true);assert.equal(p.qualityChecks.length,21);assert.equal(p.publicQualityChecklist,false);assert.equal(/https?:|@/u.test(p.instructor||""),false)}assert.deepEqual(packages.filter((x)=>!["DAN9XX","EMB9XX","EMB909","EMB917","EMB91X"].includes(x.code)&&!x.sourceUrl).map((x)=>x.code).sort(),["PFE901","EMB925","EMB900","PFE902","EMB926","EMB934","EMB936","EMB938"].sort())});

test("Enerji Sistemleri doktora ortak havuzu ile ABD başkanı ve akademisyen yetkileri ayrıdır",async()=>{const seed=JSON.parse(await readFile(new URL("../seed/course-packages.json",import.meta.url),"utf8"));const packages=seed.filter((x)=>x.department==="Enerji Sistemleri Mühendisliği ABD"&&x.programName==="Enerji Sistemleri Mühendisliği"&&x.level==="Doktora");const homework=packages.filter((x)=>x.assessments.some((a)=>/Ödev/iu.test(a.name)));assert.ok(homework.every((x)=>x.workloads.some((r)=>/Ödev/iu.test(r.name))));const publicSource=await readFile(new URL("../app/programlar/[slug]/ProgramCourses.tsx",import.meta.url),"utf8"),serverSource=await readFile(new URL("../server.mjs",import.meta.url),"utf8");for(const code of ["DAN9XX","EMB9XX","EMB909","EMB917","EMB91X"]){assert.match(publicSource,new RegExp(`mergedProcessCourseCodes[\\s\\S]*${code}`));assert.match(serverSource,new RegExp(`trustedMergedPoolCodes[\\s\\S]*${code}`))}assert.match(serverSource,/session\.role === "akademisyen"\) return assignedToUser/u);assert.match(serverSource,/return assignedToUser \|\| \(departmentMatches && poolCourse\)/u)});

test("Fizik doktora paketleri handoff kalite kurallarını karşılar",async()=>{const seed=JSON.parse(await readFile(new URL("../seed/course-packages.json",import.meta.url),"utf8"));const packages=seed.filter((x)=>x.department==="Fizik ABD"&&x.programName==="Fizik"&&x.level==="Doktora");const forbidden=/^(quiz|ödev|proje|sunum|konu tekrarı|genel tekrar|ara\s*sınav|yarıyıl sonu sınavı|final)$/iu;assert.equal(packages.length,43);for(const code of ["DAN9XX","FZK9XX","FZK909","FZK917","FZK91X"])assert.equal(packages.filter((x)=>x.code===code).length,1);for(const p of packages){assert.equal(p.weeklyTopics.length,15,`${p.code}: 15 hafta`);assert.equal(p.weeklyTopics.some((x)=>forbidden.test(x)),false,`${p.code}: akademik konu`);assert.equal(p.outcomes.length,5);assert.equal(p.contributionMatrix.length,5);assert.ok(p.contributionMatrix.every((r)=>r.values.length===11&&r.values.every((v)=>v>=1&&v<=5)));assert.equal(p.workloads.reduce((s,r)=>s+r.total,0),p.ects*30);assert.equal(p.workloads.every((r)=>Number.isInteger(r.hours*2)),true);assert.equal(p.qualityChecks.length,21);assert.equal(p.publicQualityChecklist,false);assert.equal(/https?:|@/u.test(p.instructor||""),false)}assert.deepEqual(packages.filter((x)=>!["DAN9XX","FZK9XX","FZK909","FZK917","FZK91X"].includes(x.code)&&!x.sourceUrl).map((x)=>x.code).sort(),["PFE901","FZK998","PFE902"].sort())});

test("Fizik doktora ortak havuzu ile ABD başkanı ve akademisyen yetkileri ayrıdır",async()=>{const seed=JSON.parse(await readFile(new URL("../seed/course-packages.json",import.meta.url),"utf8"));const packages=seed.filter((x)=>x.department==="Fizik ABD"&&x.programName==="Fizik"&&x.level==="Doktora");const homework=packages.filter((x)=>x.assessments.some((a)=>/Ödev/iu.test(a.name)));assert.ok(homework.every((x)=>x.workloads.some((r)=>/Ödev/iu.test(r.name))));const publicSource=await readFile(new URL("../app/programlar/[slug]/ProgramCourses.tsx",import.meta.url),"utf8"),serverSource=await readFile(new URL("../server.mjs",import.meta.url),"utf8");for(const code of ["DAN9XX","FZK9XX","FZK909","FZK917","FZK91X"]){assert.match(publicSource,new RegExp(`mergedProcessCourseCodes[\\s\\S]*${code}`));assert.match(serverSource,new RegExp(`trustedMergedPoolCodes[\\s\\S]*${code}`))}assert.match(serverSource,/session\.role === "akademisyen"\) return assignedToUser/u);assert.match(serverSource,/return assignedToUser \|\| \(departmentMatches && poolCourse\)/u)});

test("öğretim elemanı alanları güncel unvan ve yalnız ad-soyad bilgisi taşır",async()=>{const seed=JSON.parse(await readFile(new URL("../seed/course-packages.json",import.meta.url),"utf8"));for(const p of seed){assert.equal(/\bYrd\.?\s*Doç\.?\s*Dr\.?\b/iu.test(p.instructor||""),false,`${p.code}: eski unvan`);assert.equal(/https?:\/\/|www\.|\S+@\S+|(?:akbis\.)?osmaniye\.edu\.tr\//iu.test(p.instructor||""),false,`${p.code}: iletişim bilgisi`)}});

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

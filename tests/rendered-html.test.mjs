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
  assert.match(editor, /getCoursePackage\(course\.code\)/u);
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
    assert.match(html, /contribution-table[\s\S]*?<td>0<\/td>/u, `${codes[index]} ilişkisiz PÇ hücrelerini 0 göstermeli`);
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
    assert.match(html, /contribution-table[\s\S]*?<td>0<\/td>/u);
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
    assert.match(html, /contribution-table[\s\S]*?<td>0<\/td>/u);
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
    assert.match(html, /contribution-table[\s\S]*?<td>0<\/td>/u);
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
    assert.match(html, /contribution-table[\s\S]*?<td>0<\/td>/u);
    assert.doesNotMatch(html, /data-quality-check=|YÃ–KAK Ders Bilgi Paketi Kontrol Tablosu/u);
  }
});

test("generic course pages also render both workload and ECTS totals", async () => {
  const response = await render({}, "/dbp/katalog?ders=ADE801");
  const html = (await response.text()).replaceAll("<!-- -->", "");

  assert.match(html, /<tfoot><tr><th[^>]*>[^<]+<\/th><th>\d+(?:[.,]\d+)?<\/th>/u);
  assert.match(html, /<tr><th[^>]*>AKTS<\/th><th>\d+(?:[.,]\d+)?<\/th>/u);
  assert.doesNotMatch(html, /data-quality-check=|YÃ–KAK Ders Bilgi Paketi Kontrol Tablosu/u);
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

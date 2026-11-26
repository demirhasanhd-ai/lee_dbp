import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { withPublicPage } from "./helpers/hydrated-public-page.mjs";

test("JSON and SQLite cards keep independent selections and support native backup, download, restore, upload and delete", { timeout: 90_000 }, async () => {
  const jsonName = "dbp-backup-2026-11-25T17-56-24-655Z.json";
  const firstSqlite = "dbp-backup-2026-11-26T08-00-00-000Z-12345678.sqlite";
  const secondSqlite = "dbp-backup-2026-11-25T08-00-00-000Z-12345678.sqlite";
  const newSqlite = "dbp-backup-2026-11-26T09-00-00-000Z-12345678.sqlite";
  const originalBytes = Buffer.from("SQLite format 3\0original backup");
  const exportBytes = Buffer.from("SQLite format 3\0current database");
  const jsonBytes = '{"current":"Güncel JSON"}';
  const operations = [];
  let files = [firstSqlite, secondSqlite];
  await withPublicPage("/dbp/panel", {
    preparePage: async (page) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.addInitScript(() => localStorage.setItem("lee-dbp-session", JSON.stringify({ name: "Test Admin", username: "test.admin", role: "admin", department: "LEE" })));
      await page.route("**/dbp/api/dbp/**", async (route) => {
        const req = route.request();
        const url = new URL(req.url());
        const endpoint = url.pathname.replace("/dbp/api/dbp/", "");
        const info = (fileName) => ({ fileName, size: 92_000_000, createdAt: "2026-11-26T08:00:00Z" });
        let data;
        if (endpoint === "admin/role-module-access") data = { access: { admin: ["my_courses", "database_admin"] } };
        else if (endpoint === "admin/summary") data = {
          dbPath: "/app/data/dbp.sqlite", dataDir: "/app/data", backupDir: "/app/data/backups", size: 92_254_208,
          counts: { programs: 34, courses: 3262, backups: files.length + 1, jsonBackups: 1, sqliteBackups: files.length },
          statusRows: [], latestCourses: [], latestPrograms: [], backups: [info(jsonName)], sqliteBackups: files.map(info),
          qualitySnapshot: { generatedAt: "", nextRefreshAt: "", schedule: [] },
        };
        else if (endpoint === "admin/sqlite/backup" && req.method() === "POST") {
          operations.push("create"); files.unshift(newSqlite); data = { backup: info(newSqlite) };
        } else if (endpoint === "admin/sqlite/backup/download") {
          operations.push(`download:${url.searchParams.get("fileName")}`);
          return route.fulfill({ contentType: "application/vnd.sqlite3", body: originalBytes });
        } else if (endpoint === "admin/sqlite/export") {
          operations.push("export");
          return route.fulfill({ contentType: "application/vnd.sqlite3", headers: { "Content-Disposition": 'attachment; filename="dbp-current.sqlite"' }, body: exportBytes });
        } else if (endpoint === "admin/sqlite/restore") {
          operations.push(`restore:${req.postDataJSON().fileName}`); data = { ok: true };
        } else if (endpoint === "admin/sqlite/import") {
          assert.deepEqual(req.postDataBuffer(), exportBytes);
          assert.equal(req.headers()["content-type"], "application/octet-stream");
          operations.push("import"); data = { ok: true };
        } else if (endpoint === "admin/sqlite/backup" && req.method() === "DELETE") {
          const fileName = req.postDataJSON().fileName;
          operations.push(`delete:${fileName}`); files = files.filter((name) => name !== fileName); data = { ok: true };
        } else if (endpoint === "admin/export") {
          operations.push("json-export");
          return route.fulfill({ contentType: "application/json", body: jsonBytes });
        } else data = ({ "session/events": { ok: true }, courses: { courses: [], total: 0 }, programs: { programs: [] }, "committee/memberships": { memberships: [] } })[endpoint];
        assert.ok(data, `Unexpected API: ${req.method()} ${endpoint}`);
        return route.fulfill({ contentType: "application/json", body: JSON.stringify(data) });
      });
    },
  }, async ({ page }) => {
    await page.locator(".panel-sidebar nav").getByRole("button", { name: "Veri Tabanı Yönetimi", exact: true }).click();
    const json = page.getByRole("region", { name: "JSON Yedek ve Geri Yükleme", exact: true });
    const sqlite = page.getByRole("region", { name: "SQLite Yedek ve Geri Yükleme", exact: true });
    const selection = sqlite.getByRole("combobox");
    await selection.selectOption(secondSqlite);
    await sqlite.getByRole("button", { name: "Yedek Al", exact: true }).click();
    await page.getByText("SQLite yedeği oluşturuldu.", { exact: true }).waitFor();
    assert.equal(await selection.inputValue(), secondSqlite);
    assert.equal(await json.getByRole("combobox").inputValue(), jsonName);
    assert.equal(await selection.locator("option").count(), 4);

    let pending = page.waitForEvent("download");
    await sqlite.getByRole("button", { name: "Yedeği İndir", exact: true }).click();
    let downloaded = await pending;
    assert.equal(downloaded.suggestedFilename(), secondSqlite);
    assert.deepEqual(await readFile(await downloaded.path()), originalBytes);
    await page.getByText("Seçili SQLite yedeği için indirme başlatıldı.", { exact: true }).waitFor();

    pending = page.waitForEvent("download");
    await sqlite.getByRole("button", { name: "SQLite İndir", exact: true }).click();
    downloaded = await pending;
    assert.equal(downloaded.suggestedFilename(), "dbp-current.sqlite");
    assert.deepEqual(await readFile(await downloaded.path()), exportBytes);
    await page.getByText("Güncel SQLite yedeği için indirme başlatıldı.", { exact: true }).waitFor();

    page.once("dialog", (dialog) => dialog.dismiss());
    await sqlite.getByRole("button", { name: "Geri Yükle", exact: true }).click();
    assert.equal(operations.some((operation) => operation.startsWith("restore:")), false);
    page.once("dialog", (dialog) => dialog.accept());
    await sqlite.getByRole("button", { name: "Geri Yükle", exact: true }).click();
    await page.getByText("SQLite yedeği geri yüklendi. İşlem öncesindeki durum da SQLite yedek listesine kaydedildi.", { exact: true }).waitFor();

    page.once("dialog", (dialog) => dialog.accept());
    await sqlite.locator('input[type="file"]').setInputFiles({ name: "uploaded.sqlite", mimeType: "application/vnd.sqlite3", buffer: exportBytes });
    await page.getByText("SQLite dosyası geri yüklendi. İşlem öncesindeki durum da SQLite yedek listesine kaydedildi.", { exact: true }).waitFor();
    page.once("dialog", (dialog) => dialog.accept());
    await sqlite.getByRole("button", { name: "Yedeği Sil", exact: true }).click();
    await page.getByText("Seçili SQLite yedeği silindi.", { exact: true }).waitFor();
    assert.equal(await selection.locator(`option[value="${secondSqlite}"]`).count(), 0);
    assert.equal(await json.getByRole("combobox").inputValue(), jsonName);

    pending = page.waitForEvent("download");
    await json.getByRole("button", { name: "JSON İndir", exact: true }).click();
    downloaded = await pending;
    assert.equal(await readFile(await downloaded.path(), "utf8"), jsonBytes);
    await page.getByText("JSON yedegi indirildi.", { exact: true }).waitFor();

    for (const width of [1920, 1280, 1024, 720, 390]) {
      await page.setViewportSize({ width, height: 1080 });
      for (const card of [json, sqlite]) {
        await card.scrollIntoViewIfNeeded();
        assert.equal(await card.evaluate((element) => element.scrollWidth <= element.clientWidth), true, `card overflow at ${width}`);
        assert.equal(await card.locator(".database-restore-row").evaluate((element) => element.scrollWidth <= element.clientWidth), true, `controls overflow at ${width}`);
        assert.ok((await card.getByRole("combobox").boundingBox()).width >= 150);
      }
      if ([1920, 390].includes(width)) await page.screenshot({ path: `local-volume/sqlite-backup-${width}.png`, fullPage: true });
    }
    await selection.selectOption("");
    assert.equal(await sqlite.getByRole("button", { name: "Geri Yükle", exact: true }).isDisabled(), true);
    assert.deepEqual(operations, ["create", `download:${secondSqlite}`, "export", `restore:${secondSqlite}`, "import", `delete:${secondSqlite}`, "json-export"]);
  });
});

import assert from "node:assert/strict";
import test from "node:test";
import { DatabaseSync } from "node:sqlite";
import { harvestTheses, parseOaiPage, THESIS_SNAPSHOT_KEY } from "../lib/thesisSdg.mjs";

test("parses thesis student, advisor and continuation token from oai_dc", () => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <OAI-PMH xmlns="http://www.openarchives.org/OAI/2.0/"
      xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/"
      xmlns:dc="http://purl.org/dc/elements/1.1/">
      <ListRecords>
        <record>
          <header><identifier>oai:openaccess.osmaniye.edu.tr:20.500.12502/42</identifier><datestamp>2026-10-12T10:00:00Z</datestamp></header>
          <metadata><oai_dc:dc>
            <dc:title>Örnek tez başlığı</dc:title>
            <dc:title>Example thesis title</dc:title>
            <dc:creator>Öğrenci, Ayşe</dc:creator>
            <dc:contributor>Danışman, Mehmet</dc:contributor>
            <dc:subject>Makine Mühendisliği</dc:subject>
            <dc:description>Lisansüstü Eğitim Enstitüsü, Makine Mühendisliği Ana Bilim Dalı</dc:description>
            <dc:date>2023</dc:date>
            <dc:type>Master Thesis</dc:type>
            <dc:identifier>https://hdl.handle.net/20.500.12502/42</dc:identifier>
          </oai_dc:dc></metadata>
        </record>
        <resumptionToken completeListSize="142">next-page</resumptionToken>
      </ListRecords>
    </OAI-PMH>`;

  const page = parseOaiPage(xml, "oai_dc");
  assert.equal(page.token, "next-page");
  assert.equal(page.completeListSize, 142);
  assert.equal(page.records.length, 1);
  assert.deepEqual(page.records[0].authors, ["Öğrenci, Ayşe"]);
  assert.deepEqual(page.records[0].advisors, ["Danışman, Mehmet"]);
  assert.equal(page.records[0].publicationYear, 2023);
  assert.equal(page.records[0].degreeType, "Master Thesis");
  assert.equal(page.records[0].department, "Lisansüstü Eğitim Enstitüsü, Makine Mühendisliği Ana Bilim Dalı");
  assert.equal(page.records[0].sourceUrl, "https://hdl.handle.net/20.500.12502/42");
});

test("keeps deleted DSpace records as tombstones", () => {
  const xml = `<?xml version="1.0"?><OAI-PMH xmlns="http://www.openarchives.org/OAI/2.0/"><ListRecords>
    <record><header status="deleted"><identifier>oai:test:deleted</identifier><datestamp>2026-10-12T10:00:00Z</datestamp></header></record>
  </ListRecords></OAI-PMH>`;
  assert.deepEqual(parseOaiPage(xml, "oai_dc").records[0], {
    identifier: "oai:test:deleted",
    datestamp: "2026-10-12T10:00:00Z",
    status: "deleted",
  });
});

test("harvest requests DC and DIM, follows pagination and preserves unrelated stored records", async (t) => {
  const db = new DatabaseSync(":memory:");
  t.after(() => db.close());
  db.exec("CREATE TABLE metadata(key TEXT PRIMARY KEY, value TEXT); CREATE TABLE audit_logs(action TEXT, actor TEXT, payload_json TEXT, created_at TEXT)");
  db.prepare("INSERT INTO metadata VALUES (?, ?)").run(THESIS_SNAPSHOT_KEY, JSON.stringify({
    lastSuccessfulHarvestAt: "2026-10-15T12:00:00.000Z",
    records: [
      { identifier: "old", title: "Deleted thesis", status: "active", publicationYear: 2022 },
      { identifier: "retained", title: "Previously stored thesis", status: "active", publicationYear: 2024 },
    ],
  }));
  const header = (identifier, status = "") => `<header${status ? ` status="${status}"` : ""}><identifier>${identifier}</identifier><datestamp>2026-10-16T10:00:00Z</datestamp></header>`;
  const xml = (records, token = "") => `<OAI-PMH xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dim="http://www.dspace.org/xmlns/dspace/dim"><ListRecords>${records}${token}</ListRecords></OAI-PMH>`;
  const requests = [];
  t.mock.method(globalThis, "fetch", async (input) => {
    const url = new URL(input);
    requests.push(url);
    if (url.searchParams.has("resumptionToken")) {
      assert.equal(url.searchParams.get("resumptionToken"), "next-page");
      assert.equal(url.searchParams.has("metadataPrefix"), false);
      return new Response(xml(`<record>${header("old", "deleted")}</record>`));
    }
    if (url.searchParams.get("metadataPrefix") === "oai_dc") return new Response(xml(
      `<record>${header("new")}<metadata><dc:title>Battery research thesis</dc:title><dc:creator>Student Person</dc:creator><dc:date>2023</dc:date></metadata></record>`,
      '<resumptionToken completeListSize="2">next-page</resumptionToken>',
    ));
    assert.equal(url.searchParams.get("metadataPrefix"), "dim");
    return new Response(xml(`<record>${header("new")}<metadata><dim:dim><dim:field element="contributor" qualifier="advisor">Advisor Person</dim:field><dim:field element="department">Enerji Sistemleri Mühendisliği ABD</dim:field><dim:field element="type">Master Thesis</dim:field></dim:dim></metadata></record>`));
  });
  const snapshot = await harvestTheses(db, { actor: "test" });
  assert.equal(requests.length, 3);
  assert.deepEqual(requests.filter((url) => url.searchParams.has("metadataPrefix")).map((url) => url.searchParams.get("metadataPrefix")), ["oai_dc", "dim"]);
  const merged = snapshot.records.find((record) => record.identifier === "new");
  assert.deepEqual(merged.authors, ["Student Person"]);
  assert.deepEqual(merged.advisors, ["Advisor Person"]);
  assert.equal(merged.department, "Enerji Sistemleri Mühendisliği ABD");
  assert.equal(snapshot.records.find((record) => record.identifier === "old").status, "deleted");
  assert.equal(snapshot.records.find((record) => record.identifier === "retained").title, "Previously stored thesis");
  assert.equal(JSON.parse(db.prepare("SELECT value FROM metadata WHERE key = ?").get(THESIS_SNAPSHOT_KEY).value).records.length, 3);
});

import assert from "node:assert/strict";
import test from "node:test";
import { parseOaiPage } from "../lib/thesisSdg.mjs";

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

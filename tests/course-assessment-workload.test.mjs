import assert from "node:assert/strict";
import test from "node:test";
import {
  assessmentWorkloadName,
  linkedWorkloadNames,
  rebalanceAssessmentWeights,
  redistributeRemovedWorkload,
  workloadTotalHours,
} from "../app/panel/courseAssessmentWorkload.ts";

test("sıfırlanan değerlendirme katkısı kalan değerlendirmelere dağıtılır", () => {
  const result = rebalanceAssessmentWeights([
    { id: 1, name: "Ara Sınav", count: 0, weight: 40, fixed: true },
    { id: 2, name: "Yarıyıl Sonu Sınavı", count: 1, weight: 60, fixed: true },
  ]);

  assert.deepEqual(result.map(({ count, weight }) => ({ count, weight })), [
    { count: 0, weight: 0 },
    { count: 1, weight: 100 },
  ]);
});

test("hazırlık satırı kaldırıldığında toplam iş yükü ve AKTS korunur", () => {
  const workloads = {
    "Ders Süresi": { count: 15, hours: 3 },
    "Sınıf Dışı Çalışma Süresi": { count: 15, hours: 3 },
    "Ödev Hazırlığı": { count: 2, hours: 10 },
    "Ara Sınav Hazırlığı": { count: 1, hours: 15 },
    "Proje Çalışması": { count: 1, hours: 30 },
    "Yarıyıl Sonu Sınavı Hazırlığı": { count: 1, hours: 25 },
    "Ara Sınav": { count: 0, hours: 0 },
  };
  const linked = linkedWorkloadNames(workloads, "Ara Sınav");
  const result = redistributeRemovedWorkload(workloads, linked);

  assert.deepEqual(linked.sort(), ["Ara Sınav", "Ara Sınav Hazırlığı"].sort());
  assert.equal(result["Ara Sınav"], undefined);
  assert.equal(result["Ara Sınav Hazırlığı"], undefined);
  assert.equal(workloadTotalHours(result), 180);
  assert.equal(Object.values(result).every((row) => Number.isInteger(row.hours * 2)), true);
});

test("yeni değerlendirme için hazırlık iş yükü adı oluşturulur", () => {
  assert.equal(assessmentWorkloadName("Sunum"), "Sunum Hazırlığı");
});

document.head.insertAdjacentHTML(
  "beforeend",
  '<link rel="stylesheet" href="/course-tabs-local.css">',
);
document.head.insertAdjacentHTML(
  "beforeend",
  '<link rel="stylesheet" href="/course-columns-local.css">',
);
document.head.insertAdjacentHTML(
  "beforeend",
  '<link rel="stylesheet" href="/course-columns-v2-local.css">',
);
document.head.insertAdjacentHTML(
  "beforeend",
  '<link rel="stylesheet" href="/course-columns-v3-local.css">',
);
document.head.insertAdjacentHTML(
  "beforeend",
  '<link rel="stylesheet" href="/structure-compact-local.css">',
);
document.head.insertAdjacentHTML(
  "beforeend",
  '<link rel="stylesheet" href="/course-create-local.css">',
);
document.head.insertAdjacentHTML(
  "beforeend",
  '<link rel="stylesheet" href="/typography-clarity-local.css">',
);
document.head.insertAdjacentHTML(
  "beforeend",
  '<link rel="stylesheet" href="/typography-clarity-v2-local.css">',
);
document.head.insertAdjacentHTML(
  "beforeend",
  '<link rel="stylesheet" href="/review-workflow-local.css">',
);
document.head.insertAdjacentHTML("beforeend", '<link rel="stylesheet" href="/course-publish-local.css">');
const cf = (label, area = false) =>
  `<label><span>${label}</span>${area ? "<textarea></textarea>" : "<input>"}</label>`;
const fixedOutcomeCount = 5;
const state = {
  outcomes: fixedOutcomeCount,
  assessments: [
    { name: "Ara Sınav", fixed: true },
    { name: "Yarıyıl Sonu Sınavı", fixed: true },
  ],
  sdgs: 3,
};
const table = (heads, body, cls = "") =>
  `<div class="table-scroll"><table class="${cls}"><thead><tr>${heads.map((x) => `<th>${x}</th>`).join("")}</tr></thead><tbody>${body}</tbody></table></div>`;
function renderDynamic() {
  const form = document.querySelector(".word-course-editor");
  if (!form) return;
  const outcomes = form.querySelector("#cf-outcomes");
  outcomes.innerHTML = Array.from(
    { length: state.outcomes },
    (_, i) =>
      `<tr><th>ÖÇ${i + 1}</th><td><textarea></textarea></td><td><button type="button" data-remove-outcome="${i}" ${state.outcomes <= fixedOutcomeCount ? "disabled" : ""} title="LEE DBP standardında ders öğrenme çıktısı 5 maddede tutulur.">Sil</button></td></tr>`,
  ).join("");
  const assessment = form.querySelector("#cf-assessments");
  assessment.innerHTML = state.assessments
    .map(
      (x, i) =>
        `<tr><td><input value="${x.name}" ${x.fixed ? "readonly" : ""}></td><td><input class="assessment-count" type="number" min="0" value="1"></td><td><input type="number" min="0" max="100" value="${i ? 60 : 40}"></td><td>${x.fixed ? "" : `<button type="button" data-remove-assessment="${i}">Sil</button>`}</td></tr>`,
    )
    .join("");
  const workload = form.querySelector("#cf-workload");
  workload.innerHTML = [
    "Ders Süresi",
    "Sınıf Dışı Çalışma",
    ...state.assessments.map((x) => x.name),
  ]
    .map(
      (x, i) =>
        `<tr><th>${x}</th><td><input class="wl-count" type="number" min="0" value="${i < 2 ? 15 : 1}"></td><td><input class="wl-hours" type="number" min="0" value="${i === 0 ? 3 : i === 1 ? 2 : 1}"></td><td><input class="wl-total" readonly></td></tr>`,
    )
    .join("");
  const matrix = form.querySelector("#cf-matrix");
  matrix.innerHTML = Array.from(
    { length: state.outcomes },
    (_, i) =>
      `<tr><th>ÖÇ${i + 1}</th>${Array.from({ length: 13 }, () => "<td><select><option>0</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select></td>").join("")}</tr>`,
  ).join("");
  const sdgs = form.querySelector("#cf-sdgs");
  sdgs.innerHTML = Array.from(
    { length: state.sdgs },
    (_, i) =>
      `<label><span>SKA ${i + 1}</span><input><button type="button" data-remove-sdg="${i}">Sil</button></label>`,
  ).join("");
  calculateWorkload();
}
function calculateWorkload() {
  let total = 0;
  document.querySelectorAll("#cf-workload tr").forEach((row) => {
    const count = Number(row.querySelector(".wl-count").value) || 0,
      hours = Number(row.querySelector(".wl-hours").value) || 0;
    row.querySelector(".wl-total").value = count * hours;
    total += count * hours;
  });
  const totalEl = document.querySelector("#cf-total");
  if (totalEl)
    totalEl.textContent = `${total} saat / ${(total / 30).toFixed(1)} AKTS`;
  const ects = document.querySelector("#cf-ects");
  if (ects) ects.value = (total / 30).toFixed(1);
}
function courseForm() {
  const weeks = Array.from(
    { length: 15 },
    (_, i) => `<tr><th>${i + 1}</th><td><input></td></tr>`,
  ).join("");
  return `<form class="word-course-editor"><header><div><small>AKADEMİSYEN DERS BİLGİ GİRİŞİ</small><h2>BLM 501 — Bilimsel Araştırma Yöntemleri</h2></div><span class="status">Taslak</span></header>
 <section><h3>Dersin Genel Bilgileri</h3><div class="field-grid">${["Dersin adı", "Ders kodu", "Teorik saat", "Uygulama saati", "Kredi"].map((x) => cf(x)).join("")}<label><span>AKTS</span><input id="cf-ects" readonly></label></div></section>
 <section><h3>Ders Bilgileri</h3><div class="field-grid">${cf("Ders düzeyi")}${cf("Ders türü")}<label><span>Öğrenim dili</span><select><option>Türkçe</option><option>İngilizce</option></select></label>${["Ders koordinatörü", "Dersi veren öğretim elemanları", "Yardımcı öğretim elemanları", "Ön koşullar"].map((x) => cf(x)).join("")}</div><div class="stack compact">${["Dersin amacı", "Dersin içeriği", "Öğretim yöntemleri", "Kaynaklar"].map((x) => cf(x, true)).join("")}</div></section>
 <section><div class="cf-title"><h3>Ders Öğrenme Çıktıları</h3><button type="button" id="add-outcome" ${state.outcomes >= fixedOutcomeCount ? "disabled" : ""} title="LEE DBP standardında ders öğrenme çıktısı 5 maddede tutulur.">+ ÖÇ Ekle</button></div>${table(["ÖÇ", "Öğrenme çıktısı", ""], "<tbody-placeholder>")}<script-placeholder></section>
 <section><h3>Dersin Yapısı</h3><div class="compact-structure">${["Matematik ve temel bilimler", "Mühendislik bilimleri", "Mühendislik tasarımı", "Sosyal bilimler", "Eğitim bilimleri", "Fen bilimleri", "Sağlık bilimleri", "Alan bilgisi"].map((x) => `<label><span>${x}</span><input type="number" min="0" max="100"><b>%</b></label>`).join("")}</div></section>
 <section><div class="cf-title"><h3>Değerlendirme Sistemi</h3><button type="button" id="add-assessment">+ Değerlendirme Ekle</button></div><div class="table-scroll"><table><thead><tr><th>Etkinlik</th><th>Adet</th><th>Katkı (%)</th><th></th></tr></thead><tbody id="cf-assessments"></tbody></table></div></section>
 <section><h3>Haftalık Ders Planı</h3>${table(["Hafta", "Haftalık konu"], weeks)}</section>
 <section><h3>AKTS / İş Yükü</h3><div class="table-scroll"><table><thead><tr><th>Etkinlik</th><th>Adet</th><th>Süre (saat)</th><th>Toplam</th></tr></thead><tbody id="cf-workload"></tbody></table></div><strong id="cf-total"></strong></section>
 <section><h3>ÖÇ – PÇ Katkı Matrisi</h3><div class="table-scroll"><table class="matrix"><thead><tr><th>ÖÇ / PÇ</th>${Array.from({ length: 13 }, (_, i) => `<th>P${i + 1}</th>`).join("")}</tr></thead><tbody id="cf-matrix"></tbody></table></div></section>
 <section><div class="cf-title"><h3>Sürdürülebilir Kalkınma Amaçları</h3><button type="button" id="add-sdg">+ SKA Ekle</button></div><div id="cf-sdgs" class="stack"></div></section><div class="course-save"><span id="course-workflow-message">Çalışmanızı taslak olarak kaydedebilir veya ABD/ASD onayına gönderebilirsiniz.</span><div class="local-submit-actions"><button type="button" id="save-draft">Taslağı Kaydet</button><button type="button" id="publish-course">Yayınla</button></div></div></form>`
    .replace("<tbody-placeholder>", "")
    .replace("<script-placeholder>", "")
    .replace("<tbody></tbody>", '<tbody id="cf-outcomes"></tbody>');
}
function bindCourse() {
  renderDynamic();
  const form = document.querySelector(".word-course-editor");
  form.onclick = (e) => {
    const t = e.target.closest("button");
    if (!t) return;
    if (t.id === "save-draft") { localStorage.setItem("lee-dbp-course-status", "taslak"); document.querySelector(".status").textContent = "Taslak"; alert("Taslak kaydedildi"); }
    if (t.id === "publish-course") { localStorage.setItem("lee-dbp-course-status", "abd_onayi_bekliyor"); localStorage.setItem("lee-dbp-review-queue", JSON.stringify({code:"BLM 501",status:"ABD Onayı Bekliyor",public:false})); document.querySelector(".status").textContent = "ABD Onayı Bekliyor"; document.getElementById("course-workflow-message").textContent = "Paket ABD/ASD başkanının onayını bekliyor; onaylanmadan public görünmez."; alert("Ders bilgi paketi ABD/ASD başkanının onayına gönderildi"); }
    if (t.id === "add-outcome") {
      state.outcomes = Math.min(fixedOutcomeCount, state.outcomes + 1);
      renderDynamic();
    }
    if (t.dataset.removeOutcome !== undefined) {
      state.outcomes = Math.max(fixedOutcomeCount, state.outcomes - 1);
      renderDynamic();
    }
    if (t.id === "add-assessment") {
      state.assessments.push({
        name: `Yeni Değerlendirme ${state.assessments.length - 1}`,
        fixed: false,
      });
      renderDynamic();
    }
    if (t.dataset.removeAssessment !== undefined) {
      state.assessments.splice(Number(t.dataset.removeAssessment), 1);
      renderDynamic();
    }
    if (t.id === "add-sdg") {
      state.sdgs++;
      renderDynamic();
    }
    if (t.dataset.removeSdg !== undefined) {
      state.sdgs = Math.max(0, state.sdgs - 1);
      renderDynamic();
    }
  };
  form.oninput = (e) => {
    if (e.target.matches("#cf-workload input")) calculateWorkload();
  };
}
const localGroups = [
  [
    "Tezsiz Yüksek Lisans",
    "Tezsiz YL",
    [["BLM 598", "Yüksek Lisans Semineri", "Onaylandı"]],
  ],
  [
    "Tezli Yüksek Lisans",
    "Tezli YL",
    [["BLM 501", "Bilimsel Araştırma Yöntemleri", "Taslak"]],
  ],
  [
    "Doktora",
    "Doktora",
    [["BLM 512", "İleri Algoritma Analizi", "Düzeltme İstendi"]],
  ],
];
function courseList() {
  return `<div class="local-program-columns">${localGroups.map((group, index) => `<section class="local-tone-${index + 1}"><header><h3>${group[1]}</h3></header><div>${group[2].map((course) => `<article><b>${course[0]}</b><span><strong>${course[1]}</strong><small>${course[2]}</small></span><button type="button" data-course="${course[0]}">Güncelle</button></article>`).join("")}</div></section>`).join("")}</div>`;
}
function bindCourseList() {
  document.querySelectorAll("[data-course]").forEach(
    (button) =>
      (button.onclick = () => {
        document.getElementById("page-title").textContent =
          `${button.dataset.course} Ders Bilgi Girişi`;
        document.getElementById("panel-content").innerHTML =
          `<button class="local-back">← Derslerime Dön</button>${courseForm()}`;
        document.querySelector(".local-back").onclick = () => {
          document.getElementById("page-title").textContent = "Derslerim";
          document.getElementById("panel-content").innerHTML =
            `<div class="intro"><h2>Derslerim</h2><p>Görevlendirildiğiniz dersleri program düzeylerine göre görüntüleyin.</p></div>${courseList()}`;
          bindCourseList();
        };
        bindCourse();
      }),
  );
}
function upgradeCourseEditor() {
  const workspace = document.querySelector(".workspace");
  if (
    workspace &&
    !document.querySelector(".local-course-groups") &&
    !document.querySelector(".word-course-editor")
  ) {
    workspace.outerHTML = courseList();
    bindCourseList();
  }
}
const courseObserver = new MutationObserver(upgradeCourseEditor);
courseObserver.observe(document.getElementById("panel-content"), {
  childList: true,
  subtree: true,
});
upgradeCourseEditor();
const instituteRoles = [
  "lee_ogrenci_isleri",
  "enstitu_sekreteri",
  "enstitu_yoneticisi",
  "admin",
];
try {
  const instituteSession = JSON.parse(
    localStorage.getItem("lee-dbp-session") || "null",
  );
  if (instituteRoles.includes(instituteSession?.role)) {
    const action = document.createElement("button");
    action.className = "local-create-course";
    action.textContent = "+ ABD / ASD Adına Ders Ekle";
    const panelNav = document.getElementById("panel-nav");
    const reviewButton = [...panelNav.querySelectorAll("button")].find((button) =>
      button.textContent.includes("Kontrol"),
    );
    if (reviewButton) reviewButton.after(action);
    else panelNav.appendChild(action);
    action.onclick = () => {
      const modal = document.createElement("div");
      modal.className = "local-course-modal";
      modal.innerHTML = `<section><header><div><small>ENSTİTÜ YETKİLİ İŞLEMİ</small><h2>ABD / ASD Adına Ders Ekle</h2></div><button type="button" data-close>×</button></header><form><label>ABD / ASD<select required><option>Bilgisayar Mühendisliği ABD</option><option>İşletme ABD</option><option>Biyoloji ABD</option><option>Müzik ASD</option></select></label><label>Program düzeyi<select><option>Tezsiz Yüksek Lisans</option><option>Tezli Yüksek Lisans</option><option>Doktora</option></select></label><label class="wide">İlgili program<select><option>Bilgisayar Mühendisliği Tezli Yüksek Lisans</option><option>İşletme Tezsiz Yüksek Lisans</option><option>Biyoloji Doktora</option></select></label><label>Ders kodu<input required placeholder="Örn. BLM 505"></label><label>Ders adı<input required></label><label class="wide">Görevlendirilen akademisyen<select><option>Dr. Öğr. Üyesi Ayşe Yılmaz</option><option>Prof. Dr. Mehmet Kaya</option></select></label><footer><button type="button" data-close>Vazgeç</button><button type="submit">Dersi Oluştur</button></footer></form></section>`;
      document.body.appendChild(modal);
      modal
        .querySelectorAll("[data-close]")
        .forEach((x) => (x.onclick = () => modal.remove()));
      modal.querySelector("form").onsubmit = (e) => {
        e.preventDefault();
        alert("Ders ilgili ABD / ASD programı adına oluşturuldu");
        modal.remove();
      };
    };
  }
} catch {}
function openLocalReviewModal(kind,title,canApprove){const modal=document.createElement("div");modal.className="local-review-backdrop";const fullPackage=`<div class="local-preview-grid"><article class="wide"><b>Genel bilgiler</b><p>Ders kodu, ders adı, teorik/uygulama saati, kredi, AKTS, düzey, tür ve öğrenim dili</p></article><article><b>Dersin amacı ve içeriği</b><p>Amaç, içerik, öğretim yöntemleri, ön koşullar, koordinatör, öğretim elemanları ve kaynaklar</p></article><article><b>Öğrenme çıktıları</b><p>Tanımlanan tüm ÖÇ maddeleri</p></article><article><b>Dersin yapısı</b><p>Bilim alanlarının yüzde dağılımları</p></article><article><b>Değerlendirme sistemi</b><p>Ara sınav, yarıyıl sonu ve eklenen tüm değerlendirmeler</p></article><article class="wide"><b>15 haftalık ders planı</b><p>Hafta 1–15 için tanımlanan bütün konu başlıkları</p></article><article><b>AKTS / İş yükü</b><p>Tüm etkinlikler, adet, süre, toplam 180 saat ve 6 AKTS</p></article><article><b>ÖÇ–PÇ matrisi</b><p>Tanımlı tüm ÖÇ ve PÇ katkı değerleri</p></article><article class="wide"><b>Sürdürülebilir Kalkınma Amaçları</b><p>Dersle ilişkilendirilen bütün SKA kayıtları</p></article></div>`;modal.innerHTML=kind==="preview"?`<section class="local-review-preview"><header><div><small>DERS BİLGİ PAKETİ TAM ÖN İZLEME</small><h2>${title}</h2></div><button data-close>×</button></header>${fullPackage}<footer><button data-correction>Düzeltme İste</button>${canApprove?'<button data-approve>Onayla</button>':''}</footer></section>`:`<section class="local-correction"><header><div><small>DÜZELTME TALEBİ</small><h2>${title}</h2></div><button data-close>×</button></header>${fullPackage}<form><label>Düzeltilecek alan ve açıklama<textarea required placeholder="Düzeltilmesi gereken alanı ve gerekçesini yazın."></textarea></label><small>Bu açıklama akademisyene iletilecektir.</small><footer><button type="button" data-close>Vazgeç</button><button type="submit">Düzeltme Talebini Gönder</button></footer></form></section>`;document.body.appendChild(modal);modal.querySelectorAll("[data-close]").forEach(x=>x.onclick=()=>modal.remove());modal.querySelector("[data-correction]")?.addEventListener("click",()=>{modal.remove();openLocalReviewModal("correction",title,canApprove)});modal.querySelector("[data-approve]")?.addEventListener("click",()=>{alert("Ders bilgi paketi onaylandı");modal.remove()});modal.querySelector("form")?.addEventListener("submit",e=>{e.preventDefault();alert("Düzeltme talebi akademisyene gönderildi");modal.remove()})}
function enhanceReviewQueue(){const review=document.querySelector(".review");if(!review||review.dataset.enhanced)return;review.dataset.enhanced="true";let role="";try{role=JSON.parse(localStorage.getItem("lee-dbp-session")||"null")?.role||""}catch{}const canApprove=role==="abd_asd_baskani";review.querySelectorAll(":scope>div").forEach(row=>{const title=row.querySelector("b")?.textContent||"Ders Bilgi Paketi";const actions=row.querySelector("p");if(!actions)return;actions.innerHTML=`<button data-preview>Ön İzleme</button><button data-correction>Düzeltme İste</button>${canApprove?'<button data-approve>Onayla</button>':''}`;actions.querySelector("[data-preview]").onclick=()=>openLocalReviewModal("preview",title,canApprove);actions.querySelector("[data-correction]").onclick=()=>openLocalReviewModal("correction",title,canApprove);actions.querySelector("[data-approve]")?.addEventListener("click",()=>alert("Ders bilgi paketi onaylandı"))})}
const reviewObserver=new MutationObserver(enhanceReviewQueue);reviewObserver.observe(document.getElementById("panel-content"),{childList:true,subtree:true});enhanceReviewQueue();

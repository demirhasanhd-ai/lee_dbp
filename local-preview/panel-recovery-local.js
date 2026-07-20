(() => {
  const roleLabels = {
    akademisyen: "Akademisyen",
    abd_asd_baskani: "ABD / ASD Başkanı",
    lee_ogrenci_isleri: "LEE Öğrenci İşleri",
    enstitu_sekreteri: "Enstitü Sekreteri",
    enstitu_yoneticisi: "Enstitü Yöneticisi",
    admin: "Admin",
  };
  const access = {
    akademisyen: [["courses", "Ders Bilgi Paketlerim"]],
    abd_asd_baskani: [["program", "Program Bilgileri"], ["review", "Kontrol ve Düzeltme"]],
    lee_ogrenci_isleri: [["review", "Kontrol ve Düzeltme"]],
    enstitu_sekreteri: [["review", "Kontrol ve Düzeltme"], ["publish", "Yayın Kontrolü"]],
    enstitu_yoneticisi: [["review", "Kontrol ve Düzeltme"], ["publish", "Yayın Kontrolü"]],
    admin: [["courses", "Ders Bilgi Paketleri"], ["program", "Program Bilgileri"], ["review", "Kontrol ve Düzeltme"], ["publish", "Yayın Kontrolü"], ["permissions", "Yetki Dağılımı"]],
  };
  const roleByUsername = {
    "demo.akademisyen": "akademisyen",
    "demo.abd.baskani": "abd_asd_baskani",
    "demo.ogrenci.isleri": "lee_ogrenci_isleri",
    "demo.enstitu.sekreteri": "enstitu_sekreteri",
    "demo.enstitu.yoneticisi": "enstitu_yoneticisi",
    "demo.admin": "admin",
  };
  const readSession = () => {
    try {
      const session = JSON.parse(localStorage.getItem("lee-dbp-session") || "{}") || {};
      const hint = `${session.name || ""} ${session.department || ""}`.toLocaleLowerCase("tr-TR");
      const role =
        access[session.role] ? session.role :
        roleByUsername[session.username] ||
        (hint.includes("abd") || hint.includes("asd") || hint.includes("başkan") || hint.includes("baskan") ? "abd_asd_baskani" :
        hint.includes("öğrenci") || hint.includes("ogrenci") ? "lee_ogrenci_isleri" :
        hint.includes("sekreter") ? "enstitu_sekreteri" :
        hint.includes("admin") || hint.includes("sistem") ? "admin" :
        hint.includes("yönetici") || hint.includes("yonetici") ? "enstitu_yoneticisi" : "akademisyen");
      return {
        name: session.name || session.username || "Kullanıcı",
        username: session.username || "",
        department: session.department || "LEE",
        role,
      };
    } catch {
      return { name: "Kullanıcı", username: "", department: "LEE", role: "akademisyen" };
    }
  };
  const courses = () => `<div class="intro"><h2>Derslerim</h2><p>Görevlendirildiğiniz dersleri program düzeylerine göre görüntüleyin.</p></div><div class="local-program-columns"><section class="local-tone-1"><header><h3>Tezsiz YL</h3></header><div><article><b>BLM 598</b><span><strong>Yüksek Lisans Semineri</strong><small>Onaylandı</small></span><button type="button" data-recovery-course>Güncelle</button></article></div></section><section class="local-tone-2"><header><h3>Tezli YL</h3></header><div><article><b>BLM 501</b><span><strong>Bilimsel Araştırma Yöntemleri</strong><small>Taslak</small></span><button type="button" data-recovery-course>Güncelle</button></article></div></section><section class="local-tone-3"><header><h3>Doktora</h3></header><div><article><b>BLM 512</b><span><strong>İleri Algoritma Analizi</strong><small>Düzeltme İstendi</small></span><button type="button" data-recovery-course>Güncelle</button></article></div></section></div>`;
  const courseEditor = () => `<button class="local-back" type="button">← Derslerime Dön</button><form class="word-course-editor"><header><div><small>AKADEMİSYEN DERS BİLGİ GİRİŞİ</small><h2>BLM 501 — Bilimsel Araştırma Yöntemleri</h2></div><span class="status">Taslak</span></header><section><div class="cf-title"><h3>Ders Öğrenme Çıktıları</h3><button type="button">+ ÖÇ Ekle</button></div><div class="table-scroll"><table><thead><tr><th>ÖÇ</th><th>Öğrenme çıktısı</th><th></th></tr></thead><tbody id="cf-outcomes">${Array.from({length:5},(_,i)=>`<tr><th>ÖÇ${i+1}</th><td><textarea>${i===0?"Bilimsel araştırma sürecinin temel aşamalarını açıklar.":""}</textarea></td><td><button type="button">Sil</button></td></tr>`).join("")}</tbody></table></div></section><div class="course-save"><span>Çalışmanızı taslak olarak kaydedebilir veya ABD/ASD onayına gönderebilirsiniz.</span><div class="local-submit-actions"><button type="button">Taslağı Kaydet</button><button type="button">Yayınla</button></div></div></form>`;
  const program = () => `<div class="intro"><h2>Program genel bilgileri</h2><p>ABD/ASD programının public Bologna profilini düzenleyin.</p></div><form class="profile-editor"><section class="profile-card outcomes"><header><div><label>Program Çıktıları / Öğrenme Kazanımları</label><small>Çıktılar kural tabanlı olarak denetlenir.</small></div><button id="add-outcome" type="button">+ Çıktı Ekle</button></header><ol id="outcome-list">${Array.from({length:12},(_,i)=>`<li><span>${i+1}</span><textarea>${i===0?"Alanındaki ileri düzey bilgileri değerlendirir.":""}</textarea><button type="button">Sil</button></li>`).join("")}</ol></section><div class="save-bar"><span>Değişiklikler taslak olarak kaydedilir.</span><button type="button">Program Bilgilerini Kaydet</button></div></form>`;
  const review = (canApprove) => `<div class="intro"><h2>İnceleme kuyruğu</h2><p>Ön izleyin, düzeltme isteyin${canApprove ? " veya onaylayın" : ""}.</p></div><div class="review">${["BLM 501 — Bilimsel Araştırma","BLM 512 — İleri Algoritma","İŞL 603 — Stratejik Yönetim"].map((x)=>`<div><b>${x}</b><span>İncelemede</span><p><button type="button">Ön İzleme</button><button type="button">Düzeltme İste</button>${canApprove?'<button type="button" class="approve">Onayla</button>':""}</p></div>`).join("")}</div>`;
  const publish = () => `<div class="intro"><h2>Public program görünürlüğü</h2><p>Programların public katalogda görünüp görünmeyeceğini belirleyin.</p></div><div class="publish-summary local"><div><b>42</b><span>Publicte Görünen</span></div><div><b>0</b><span>Gizlenen</span></div></div>`;
  const permissions = () => `<div class="intro"><h2>Rol ve yetki dağılımı</h2><p>Modül erişimlerini rol bazında yönetin.</p></div><div class="matrix">${Object.values(roleLabels).map((x)=>`<div><b>${x}</b><label><input type="checkbox" checked> Görüntüle</label><label><input type="checkbox"> Düzenle</label><label><input type="checkbox"> Onayla</label></div>`).join("")}</div>`;
  const render = () => {
    const nav = document.getElementById("panel-nav");
    const content = document.getElementById("panel-content");
    const title = document.getElementById("page-title");
    if (!nav || !content || content.textContent.trim()) return;
    nav.innerHTML = "";
    const session = readSession();
    localStorage.setItem("lee-dbp-session", JSON.stringify(session));
    document.getElementById("user-name").textContent = session.name;
    document.getElementById("role-name").textContent = roleLabels[session.role] || "Akademisyen";
    document.getElementById("department").textContent = session.department;
    document.getElementById("avatar").textContent = String(session.name).slice(0, 2).toUpperCase();
    document.getElementById("logout").onclick = () => {
      localStorage.removeItem("lee-dbp-session");
      location.href = "/yonetim/";
    };
    const open = (id, label, button) => {
      title.textContent = label;
      nav.querySelectorAll("button").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      content.innerHTML = id === "courses" ? courses() : id === "program" ? program() : id === "publish" ? publish() : id === "permissions" ? permissions() : review(session.role === "abd_asd_baskani");
      content.querySelectorAll("[data-recovery-course]").forEach((item) => item.onclick = () => {
        title.textContent = "BLM 501 Ders Bilgi Girişi";
        content.innerHTML = courseEditor();
        content.querySelector(".local-back").onclick = () => open("courses", "Ders Bilgi Paketlerim", button);
        window.LEE_DBP_RENDER_OUTCOME_QUALITY?.();
      });
      window.LEE_DBP_RENDER_OUTCOME_QUALITY?.();
    };
    access[session.role].forEach(([id, label], index) => {
      const button = document.createElement("button");
      button.textContent = label;
      button.onclick = () => open(id, label, button);
      nav.appendChild(button);
      if (index === 0) open(id, label, button);
    });
  };
  setTimeout(render, 300);
  setTimeout(render, 1200);
})();

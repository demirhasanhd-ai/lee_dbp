(() => {
  const sheet = document.createElement("link");
  sheet.rel = "stylesheet";
  sheet.href = "/outcome-quality-local.css?v=1";
  document.head.appendChild(sheet);

  const vague = ["bilir", "anlar", "fark eder", "kavrar", "haberdar olur", "bilgi sahibi olur", "aşina olur"];
  const active = ["açıklar", "uygular", "tasarlar", "değerlendirir", "karşılaştırır", "analiz eder", "çözümler", "problem çözer", "ilişkilendirir", "kullanır", "sıralar", "listeler", "gösterir", "çizer", "eleştirir", "yorumlar", "raporlar", "geliştirir", "üretir", "seçer", "planlar", "yürütür", "sunar"];
  const instructor = ["kazandırmak", "öğretmek", "anlatmak", "tanıtmak", "vermek", "öğrenciye", "ders kapsamında"];
  const norm = (value) => String(value || "").toLocaleLowerCase("tr-TR").replace(/\s+/g, " ").trim();
  const has = (text, list) => list.some((item) => text.includes(item));
  const countActions = (text) => active.filter((verb) => text.includes(verb)).length + (text.match(/\sve\s|\sile\s|,\s/g)?.length || 0);
  const evaluate = (value, kind) => {
    const text = norm(value);
    if (!text) return ["empty", "Boş", "Çıktı maddesi yazıldığında otomatik denetlenecek."];
    const messages = [];
    if (has(text, vague)) messages.push("Belirsiz fiil kullanılmış; ölçülebilir aktif fiil seçin.");
    if (!has(text, active)) messages.push("Ölçülebilir aktif fiil bulunamadı. Örn. açıklar, uygular, değerlendirir.");
    if (text.split(" ").length < 4) messages.push("İfade konu başlığı gibi duruyor; tam kazanım cümlesi yazın.");
    if (String(value).length > 180) messages.push("Cümle uzun; daha sade ve tek davranışa odaklı yazın.");
    if (countActions(text) > 3) messages.push("Birden fazla eylem olabilir; her çıktıda tek yargı kullanın.");
    if (has(text, instructor)) messages.push(kind === "program" ? "Program çıktısı öğrencinin süreç sonunda yapabileceklerini göstermeli." : "Öğrenme çıktısı öğrencinin yapacaklarını göstermeli.");
    if (kind === "program" && !/(yetkin|beceri|bilgi|alan|araştır|etik|çözüm|değerlendir)/.test(text)) messages.push("TYYÇ bağlamı, bilgi, beceri veya yetkinlik daha görünür olmalı.");
    if (!messages.length) return ["good", "Uygun", "Açık, ölçülebilir ve öğrenci odaklı görünüyor."];
    return [messages.length > 1 ? "error" : "warning", messages.length > 1 ? "Düzenlenmeli" : "Gözden geçirilmeli", messages[0]];
  };
  const renderOne = (textarea, kind) => {
    const parent = textarea.parentElement;
    if (!parent) return;
    let hint = parent.querySelector(":scope > .outcome-quality-local");
    if (!hint) {
      hint = document.createElement("div");
      hint.className = "outcome-quality-local";
      textarea.insertAdjacentElement("afterend", hint);
      textarea.addEventListener("input", () => renderOne(textarea, kind));
    }
    const [status, title, message] = evaluate(textarea.value, kind);
    const nextClass = `outcome-quality-local ${status}`;
    const nextHtml = `<strong>${title}</strong><span>${message}</span>`;
    if (hint.className !== nextClass) hint.className = nextClass;
    if (hint.innerHTML !== nextHtml) hint.innerHTML = nextHtml;
  };
  const renderAll = () => {
    document.querySelectorAll("#outcome-list textarea").forEach((item) => renderOne(item, "program"));
    document.querySelectorAll("#cf-outcomes textarea").forEach((item) => renderOne(item, "course"));
  };
  window.LEE_DBP_RENDER_OUTCOME_QUALITY = renderAll;
  new MutationObserver(renderAll).observe(document.body, { childList: true, subtree: true });
  renderAll();
})();

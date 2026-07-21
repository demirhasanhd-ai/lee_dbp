(() => {
  document.head.insertAdjacentHTML("beforeend", '<link rel="stylesheet" href="/header-typography-local.css">');
  document.head.insertAdjacentHTML("beforeend", '<link rel="stylesheet" href="/header-typography-v2-local.css">');
  document.head.insertAdjacentHTML("beforeend", '<link rel="stylesheet" href="/header-icons-local.css">');
  document.head.insertAdjacentHTML("beforeend", '<link rel="stylesheet" href="/sidebar-consistency-local.css">');
  document.head.insertAdjacentHTML("beforeend", '<link rel="stylesheet" href="/responsive-type-scale-local.css">');
  const key = "lee-dbp-theme";
  const root = document.documentElement;
  const button = document.getElementById("theme-toggle");

  const apply = (theme) => {
    root.dataset.theme = theme;
    if (!button) return;
    const dark = theme === "dark";
    const label = button.querySelector(".theme-label");
    const icon = button.querySelector(".theme-icon");
    if (label) label.textContent = dark ? "Açık Tema" : "Koyu Tema";
    if (icon) icon.textContent = dark ? "☀" : "●";
    button.setAttribute("aria-label", dark ? "Açık temaya geç" : "Koyu temaya geç");
  };

  apply(localStorage.getItem(key) === "dark" ? "dark" : "light");
  if (!button) return;
  button.addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem(key, next);
    apply(next);
  });
})();

(() => {
  const submit=document.getElementById("login-submit"),select=document.getElementById("demo-user"),demoTab=document.getElementById("demo-tab");
  if(!submit||!select||!demoTab)return;
  const roles={"Akademisyen":"akademisyen","ABD / ASD Başkanı":"abd_asd_baskani","LEE Öğrenci İşleri":"lee_ogrenci_isleri","Enstitü Sekreteri":"enstitu_sekreteri","Enstitü Yöneticisi":"enstitu_yoneticisi","Admin":"admin"};
  const roleByUsername={"demo.akademisyen":"akademisyen","demo.abd.baskani":"abd_asd_baskani","demo.ogrenci.isleri":"lee_ogrenci_isleri","demo.enstitu.sekreteri":"enstitu_sekreteri","demo.enstitu.yoneticisi":"enstitu_yoneticisi","demo.admin":"admin"};
  submit.addEventListener("click",()=>{if(!demoTab.classList.contains("active")||!select.value)return;const option=select.options[select.selectedIndex];const label=option.dataset.role||"Akademisyen";const username=option.dataset.user||"";const parts=option.textContent.split(" — ");const role=roleByUsername[username]||roles[label]||"akademisyen";localStorage.setItem("lee-dbp-session",JSON.stringify({name:parts[0]||"Kullanıcı",username,role,department:parts[1]||"LEE"}));location.href="/panel/"});
})();




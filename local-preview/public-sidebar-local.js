(() => {
  if (!location.pathname.startsWith("/katalog")) return;
  const shell = document.querySelector(".demo-local-shell");
  if (!shell) return;

  ["/package-sidebar-local.css", "/package-program-context-local.css", "/sidebar-consistency-local.css", "/program-public-sidebar-fix-local.css"].forEach((href) => {
    const versionedHref = `${href}?v=20260719-sidebar-4`;
    if (document.querySelector(`link[href="${versionedHref}"]`)) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = versionedHref;
    document.head.appendChild(link);
  });

  document.querySelectorAll(".demo-package-left.program-context").forEach((item) => item.remove());

  const params = new URLSearchParams(location.search);
  const department = params.get("bolum") || "Aile Danışmanlığı ve Eğitimi ABD";
  const program = params.get("program") || department.replace(/\sABD$/i, "");
  const activeLevel = params.get("duzey") || "Tezsiz YL";
  const programHref = `/programlar/?program=${encodeURIComponent(`${department}|${program}`)}`;
  const programRows = window.LEE_DBP_PROGRAM_ROWS || [];
  const normalize = (value) => String(value || "").trim().toLocaleLowerCase("tr-TR");
  const row = programRows.find((item) => normalize(item[1]) === normalize(department) && normalize(item[2]) === normalize(program))
    || programRows.find((item) => normalize(item[1]) === normalize(department))
    || programRows.find((item) => normalize(item[2]) === normalize(program));
  const levels = window.LEE_DBP_LEVELS_FROM_FLAGS?.(row?.[3]) || [activeLevel];

  const sidebar = document.createElement("aside");
  sidebar.className = "demo-package-left program-context";
  sidebar.innerHTML = `
    <h2>${department}</h2>
    <hr>
    <strong>Programlar</strong>
    <nav>
      ${levels.map((level) => {
        const active = level === activeLevel;
        return `
          <div class="program-menu-card ${active ? "active" : ""}">
            <div class="program-menu-title"><b>${level}</b></div>
            <div class="program-menu-actions">
              <a href="${programHref}">&#9432; Bilgiler</a>
              <a class="${active ? "active" : ""}" href="${programHref}">&#9636; Dersler</a>
            </div>
          </div>
        `;
      }).join("")}
    </nav>
  `;
  document.body.insertAdjacentElement("afterbegin", sidebar);
  shell.classList.add("with-package-left");
})();

(() => {
  const courses = Array.isArray(window.LEE_DBP_OFFICIAL_COURSES)
    ? window.LEE_DBP_OFFICIAL_COURSES
    : [];
  if (!courses.length) return;

  const formatter = new Intl.NumberFormat("tr-TR");
  const unique = (values) => new Set(values.map((value) => String(value || "").trim()).filter(Boolean));
  const programKey = (course) => `${course.department}|${course.programName}|${course.level}`;
  const programKeys = unique(courses.map(programKey));
  const instructors = unique(courses.map((course) => course.instructor));
  const assigned = courses.filter((course) => String(course.instructor || "").trim()).length;
  const assignmentRate = Math.round((assigned / courses.length) * 100);
  const stats = {
    totalCourses: courses.length,
    totalPrograms: programKeys.size,
    mainDepartments: unique(courses.map((course) => course.department)).size,
    instructors: instructors.size,
    unassigned: courses.length - assigned,
    assignmentRate,
    compulsory: courses.filter((course) => course.type === "Zorunlu").length,
    elective: courses.filter((course) => course.type === "Seçmeli").length,
    fall: courses.filter((course) => course.term === "Güz").length,
    spring: courses.filter((course) => course.term === "Bahar").length,
    tezsiz: [...programKeys].filter((key) => key.includes("Tezsiz")).length,
    tezli: [...programKeys].filter((key) => key.includes("Tezli")).length,
    doktora: [...programKeys].filter((key) => key.includes("Doktora")).length,
  };

  const boardNumber = document.querySelector(".board-main strong");
  const boardLabel = document.querySelector(".board-main span");
  const boardStats = document.querySelector(".board-stats");
  const boardHeading = document.querySelector(".board-heading > span");
  if (boardNumber) boardNumber.textContent = formatter.format(stats.totalCourses);
  if (boardLabel) boardLabel.textContent = "Excel importlarından gelen ders kaydı";
  if (boardHeading) boardHeading.textContent = "Resmi müfredat";
  if (boardStats) {
    boardStats.innerHTML = `
      <div><b>${stats.totalPrograms}</b><span>Program paketi</span></div>
      <div><b>${stats.assignmentRate}%</b><span>Hoca atama oranı</span></div>
      <div><b>${stats.instructors}</b><span>Akademisyen</span></div>
    `;
  }

  const bannerContent = document.querySelector(".banner-content");
  if (!bannerContent || document.querySelector(".hero-stats")) return;
  bannerContent.insertAdjacentHTML("beforeend", `
    <div class="hero-stats" aria-label="2026–2027 müfredat istatistikleri">
      <article><small>Ders havuzu</small><strong>${formatter.format(stats.totalCourses)}</strong><span>${stats.mainDepartments} ABD / ASD</span></article>
      <article><small>Program düzeyi</small><strong>${stats.totalPrograms}</strong><span>${stats.tezsiz} tezsiz · ${stats.tezli} tezli · ${stats.doktora} doktora</span></article>
      <article><small>Ders türü</small><strong>${formatter.format(stats.elective)}</strong><span>${formatter.format(stats.compulsory)} zorunlu · ${formatter.format(stats.elective)} seçmeli</span></article>
      <article><small>Yarıyıl</small><strong>${formatter.format(stats.fall)}</strong><span>${formatter.format(stats.fall)} güz · ${formatter.format(stats.spring)} bahar</span></article>
      <article><small>Öğretim elemanı</small><strong>${formatter.format(stats.instructors)}</strong><span>${formatter.format(stats.unassigned)} atama bekliyor</span></article>
    </div>
  `);
})();

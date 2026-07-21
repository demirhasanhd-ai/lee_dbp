const extraSheets=[
  "/program-sidebar-local.css",
  "/program-left-local.css",
  "/program-merged-left.css",
  "/program-polish-local.css",
  "/course-table-proportions-local.css",
  "/course-table-fit-local.css",
  "/sidebar-consistency-local.css",
  "/program-public-sidebar-fix-local.css",
  "/program-public-fixed-header-local.css",
];
extraSheets.forEach((href)=>{const link=document.createElement("link");link.rel="stylesheet";link.href=`${href}?v=20260719-sidebar-4`;document.head.appendChild(link)});
document.documentElement.style.overflowX="hidden";
document.body.style.overflowX="hidden";

const params=new URLSearchParams(location.search);
const parts=(params.get("program")||"İşletme|İşletme").split("|");
const department=parts[0];
const program=parts[1]||parts[0];
const normalizeText=(value)=>String(value||"").trim().toLocaleLowerCase("tr-TR");
const programRows=window.LEE_DBP_PROGRAM_ROWS||[];
const programRow=programRows.find((row)=>
  normalizeText(row[1])===normalizeText(department)&&normalizeText(row[2])===normalizeText(program)
)||programRows.find((row)=>
  normalizeText(row[0])===normalizeText(department)&&normalizeText(row[2])===normalizeText(program)
)||programRows.find((row)=>
  normalizeText(row[1])===normalizeText(department)
)||programRows.find((row)=>
  normalizeText(row[2])===normalizeText(program)
);
const allLevels=(window.LEE_DBP_LEVELS_FROM_FLAGS?.(programRow?.[3])||["Tezli YL"]);
const levels=programRow?(window.LEE_DBP_PUBLIC_LEVELS?.(programRow)||allLevels):allLevels;
const publicVisible=levels.length>0;
const prefix=program.split(/\s+/).slice(0,3).map((word)=>word[0]).join("").toLocaleUpperCase("tr-TR");
const officialCourses=programRow?(window.LEE_DBP_OFFICIAL_COURSES_FOR_ROW?.(programRow)||[]):[];
const left=document.querySelector(".public-local-left");
document.title=`${program} | LEE DBP`;
document.getElementById("crumb").textContent=program;

const outcomes=[
  "Alanındaki ileri düzey bilgileri bilimsel araştırma süreçlerinde kullanır.",
  "Disiplinler arası yaklaşımla problem tanımlar ve çözüm önerileri geliştirir.",
  "Araştırma sonuçlarını etik ilkeler doğrultusunda değerlendirir ve raporlar.",
  "Alanındaki güncel gelişmeleri izler, yorumlar ve uygulamaya aktarır.",
  "Akademik ve mesleki ortamlarda etkili iletişim kurar.",
  "Yaşam boyu öğrenme yaklaşımıyla mesleki gelişimini sürdürür.",
];
const sections=[
  ["Program Tarihçesi","Program, Osmaniye Korkut Ata Üniversitesi Lisansüstü Eğitim Enstitüsü bünyesinde alanında uzman araştırmacılar yetiştirmek amacıyla yapılandırılmıştır."],
  ["Program Profili","Program; kuramsal bilgi, araştırma yöntemi, uygulama becerisi ve etik sorumlulukları birlikte ele alan lisansüstü bir akademik yapı sunar."],
  ["Ders Yapısı ve Kredileri","Programda zorunlu ve seçmeli dersler, seminer/uzmanlık alan dersleri ve ilgili düzeye göre proje ya da tez çalışmaları yer alır."],
  ["Mezuniyet Koşulları","Öğrencinin programda tanımlı dersleri, AKTS yükünü, seminer/proje/tez yükümlülüklerini ve başarı koşullarını tamamlaması gerekir."],
  ["Ölçme ve Değerlendirme","Her ders için ölçme ve değerlendirme yöntemleri ders bilgi paketinde belirtilir."],
  ["Üst Derece Programlarına Geçiş","Programı başarıyla tamamlayan mezunlar, ilgili mevzuat ve başvuru koşullarını sağlamaları halinde üst derece programlara başvurabilir."],
  ["Önceki Öğrenmenin Tanınması","Muafiyet, intibak ve önceki öğrenmenin tanınmasına ilişkin işlemler enstitü mevzuatı ve kurul kararları doğrultusunda yürütülür."],
  ["Mezunların Mesleki Profilleri","Mezunlar; akademi, kamu kurumları, özel sektör, araştırma merkezleri ve uzmanlık gerektiren görevlerde çalışabilir."],
  ["Kabul ve Kayıt Koşulları","Programa kabul; diploma, ALES, yabancı dil, bilim sınavı veya mülakat gibi enstitü tarafından ilan edilen koşullar çerçevesinde yapılır."],
];

function normalizeLevel(level){return level==="Doktora"?"Doktora":level==="Tezsiz YL"?"Tezsiz Yüksek Lisans":"Tezli Yüksek Lisans"}
function renderSidebar(active){
  left.innerHTML=`<div class="public-local-sidebar"><h2>${department}</h2><hr><strong>Programlar</strong><nav>${levels.map((level)=>`<div class="program-menu-card ${active.level===level?"active":""}"><div class="program-menu-title"><b>${level}</b></div><div class="program-menu-actions"><button data-level="${level}" data-tab="profile" class="${active.level===level&&active.tab==="profile"?"active":""}">ⓘ Bilgiler</button><button data-level="${level}" data-tab="courses" class="${active.level===level&&active.tab==="courses"?"active":""}">▤ Dersler</button></div></div>`).join("")}</nav></div><a class="demo-package-home" href="/#programlar">← Programlara Dön</a>`;
  left.querySelectorAll("button").forEach((button)=>button.onclick=()=>show({level:button.dataset.level,tab:button.dataset.tab}));
}
function profileHtml(rawLevel){
  const level=normalizeLevel(rawLevel);
  return `<section class="public-program-profile"><div class="public-profile-title"><small>LİSANSÜSTÜ EĞİTİM ENSTİTÜSÜ</small><h2>${program}</h2><p>${department} programına ait kamuya açık Bologna program bilgileri.</p></div><div class="public-profile-summary"><div><span>Program Düzeyi</span><b>${level}</b></div><div><span>Kazanılan Derece</span><b>${program} ${level==="Doktora"?"Doktora":"Yüksek Lisans"} Derecesi</b></div><div><span>Program Yöneticisi</span><b>Prof. Dr. Program Yöneticisi</b></div><div><span>Öğrenim Dili</span><b>Türkçe</b></div><div class="wide"><span>Yeterlilik Koşulları ve Kuralları</span><b>${level==="Doktora"?"4 yıl, 8 yarıyıl ve doktora yeterlilik/tez süreçleri":"2 yıl, 4 yarıyıl ve toplam 120 AKTS"}</b></div></div><div class="public-profile-grid">${sections.slice(0,2).map(([title,text])=>`<article class="wide"><h3>${title}</h3><p>${text}</p></article>`).join("")}</div><article class="public-profile-card"><div class="profile-card-heading"><h3>Program Çıktıları / Öğrenme Kazanımları</h3><span>${outcomes.length} çıktı</span></div><ol class="public-outcomes">${outcomes.map((outcome,index)=>`<li><b>PÇ${index+1}</b><span>${outcome}</span></li>`).join("")}</ol></article><div class="public-profile-grid"><article class="wide"><h3>${sections[8][0]}</h3><p>${sections[8][1]}</p></article>${sections.slice(2,8).map(([title,text])=>`<article><h3>${title}</h3><p>${text}</p></article>`).join("")}</div></section>`;
}
function courseUrl(course){
  const q=new URLSearchParams({
    ders: course.code,
    ad: course.name,
    bolum: department,
    program,
    duzey: course.level,
    tur: course.type,
    t: String(course.theory),
    u: String(course.practice),
    kredi: String(course.credit ?? course.theory + course.practice),
    akts: String(course.ects),
  });
  if(course.programCode) q.set("programKodu",course.programCode);
  if(course.instructor) q.set("ogretimElemani",course.instructor);
  return `/katalog/?${q.toString()}`;
}
function slugify(value){
  return String(value||"").toLocaleLowerCase("tr-TR")
    .replace(/[çÇ]/g,"c").replace(/[ğĞ]/g,"g").replace(/[ıİ]/g,"i")
    .replace(/[öÖ]/g,"o").replace(/[şŞ]/g,"s").replace(/[üÜ]/g,"u")
    .normalize("NFD").replace(/[\u0300-\u036f]/g,"")
    .replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")||"ders";
}
function coursePdfUrl(course){
  return `/pdf/dbp/${slugify(course.code)}-${slugify(program)}-${slugify(course.name)}.pdf`;
}
function coursePrintUrl(course){
  return `${courseUrl(course)}&print=1`;
}
function rows(term,index){
  const official=officialCourses.filter((course)=>course.level===(levels[index]||levels[0])&&course.term===term);
  if(official.length){
    return official.map((course)=>`<tr><td><b>${course.code}</b></td><td>${course.name}</td><td><span class="course-type ${course.type==="Zorunlu"?"required":"elective"}">${course.type}</span></td><td>${course.theory}</td><td>${course.practice}</td><td><b>${course.ects}</b></td><td><a class="local-table-action primary" href="${courseUrl(course)}">▣ <span>Görüntüle</span></a></td><td><a class="local-table-action" href="${coursePrintUrl(course)}" target="_blank" rel="noreferrer">▧ <span>Yazdır</span></a></td></tr>`).join("");
  }
  const defs=term==="Güz"?[[501,"Bilimsel Araştırma","Zorunlu",3,0,6],[503,"Kuramları","Seçmeli",3,0,6],[590,"Seminer","Zorunlu",0,2,3]]:[[502,"Güncel Yaklaşımlar","Seçmeli",3,0,6],[504,"Uygulamaları","Seçmeli",2,2,6],[592,"Uzmanlık Alan Dersi","Zorunlu",4,0,8]];
  return defs.map(([number,name,type,theory,practice,ects])=>{
    const code=`${prefix} ${Number(number)+index*100}`;
    const courseName=["Seminer","Uzmanlık Alan Dersi"].includes(String(name))?String(name):`${program} ${name}`;
    const course={code,name:courseName,level:levels[index]||levels[0],type,theory,practice,ects};
    return `<tr><td><b>${code}</b></td><td>${courseName}</td><td><span class="course-type ${type==="Zorunlu"?"required":"elective"}">${type}</span></td><td>${theory}</td><td>${practice}</td><td><b>${ects}</b></td><td><a class="local-table-action primary" href="${courseUrl(course)}">▣ <span>Görüntüle</span></a></td><td><a class="local-table-action" href="${coursePrintUrl(course)}" target="_blank" rel="noreferrer">▧ <span>Yazdır</span></a></td></tr>`;
  }).join("");
}
function coursesHtml(level){
  const index=levels.indexOf(level);
  return `<section class="public-local-course-main"><div class="public-local-heading"><small>2026-2027 AKADEMİK YILI</small><h2>${level} Dersleri</h2></div><div id="course-groups">${["Güz","Bahar"].map((term)=>`<section><h3>${term} Yarıyılı</h3><div class="public-local-table-wrap"><table><thead><tr><th>Dersin Kodu</th><th>Dersin Adı</th><th>Zorunlu / Seçmeli</th><th>T</th><th>U</th><th>AKTS</th><th>Bilgi Paketi</th><th>Yazdır</th></tr></thead><tbody>${rows(term,index)}</tbody></table></div></section>`).join("")}</div></section>`;
}
function show(view={level:levels[0],tab:"profile"}){
  renderSidebar(view);
  document.getElementById("program-dersleri").innerHTML=view.tab==="profile"?profileHtml(view.level):coursesHtml(view.level);
}
if(!publicVisible){
  left.innerHTML="";
  document.getElementById("program-dersleri").innerHTML=`<div class="public-hidden-notice"><small>PUBLIC YAYIN KONTROLÜ</small><h2>${program} şu anda kamuya açık yayında değil</h2><p>Bu program Enstitü Sekreteri / Enstitü Yöneticisi / Admin tarafından public katalogdan gizlenmiştir.</p><a href="/#programlar">Programlara dön</a></div>`;
}else{
  show({level:levels[0],tab:"profile"});
}

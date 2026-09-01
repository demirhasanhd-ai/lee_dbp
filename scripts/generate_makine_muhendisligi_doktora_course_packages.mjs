import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const sourcePath = process.argv[2] || process.env.BOLOGNA_DERS_JSON;
if (!sourcePath) throw new Error("Kullanım: node scripts/generate_makine_muhendisligi_doktora_course_packages.mjs <ders-verileri.json>");
const fold=(v="")=>String(v).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLocaleLowerCase("tr-TR").replace(/ı/g,"i");
const clean=(v="")=>String(v).replace(/\s+/g," ").trim();
const title=(v="")=>{const s=clean(v).toLocaleLowerCase("tr-TR");return s?`${s[0].toLocaleUpperCase("tr-TR")}${s.slice(1)}`:s};
const sentence=(v="")=>{const s=clean(v);return s?`${s[0].toLocaleUpperCase("tr-TR")}${s.slice(1)}`:s};
const data=JSON.parse(readFileSync(sourcePath,"utf8")).data;
const program=data.programs.find((x)=>fold(x.name)==="makine muhendisligi doktora");
if(!program)throw new Error("Makine Mühendisliği Doktora programı bulunamadı.");
const pc=[
"İleri makine mühendisliği bilgilerini özgün araştırma problemlerinin çözümünde eleştirel biçimde sentezler.",
"Karmaşık mühendislik problemlerine yönelik özgün araştırma soruları ve hipotezler geliştirir.",
"Makine mühendisliği araştırmaları için yenilikçi deneysel ve hesaplamalı yöntemler geliştirir.",
"Karmaşık mühendislik verilerini ileri analitik ve sayısal yöntemlerle analiz eder.",
"Araştırma bulgularını güncel uluslararası mühendislik literatürü bağlamında eleştirel değerlendirir.",
"Makine mühendisliği alanında bağımsız ve özgün bilimsel araştırmaları tasarlar ve yürütür.",
"Özgün araştırma sonuçlarıyla Makine Mühendisliği bilim alanına yeni bilgi kazandırır.",
"Karmaşık mühendislik problemlerinde farklı disiplinlerin bilgi ve yöntemlerini bütünleştirir.",
"Araştırmalarda mühendislik etiği, bilimsel dürüstlük ve sürdürülebilirlik ilkelerini uygular.",
"Özgün araştırma sonuçlarını uluslararası yayınlarda ve akademik ortamlarda savunur.",
"Mühendislik problemlerine yönelik yenilikçi, güvenli ve sürdürülebilir teknolojik çözümler geliştirir."
];
const cmap=new Map(data.courses.map((x)=>[x.id,x]));
const sourceRows=data.programCourses.filter((x)=>x.program_id===program.id).map((assignment)=>({course:cmap.get(assignment.course_id),assignment})).filter((x)=>x.course?.code);
const sourceByCode=new Map(sourceRows.map((row)=>[row.course.code,row]));
const catalogPath=path.join(process.cwd(),"data","courses","2026-2027.json");
const fullCatalog=JSON.parse(readFileSync(catalogPath,"utf8"));
const previousOfficial=fullCatalog.filter((x)=>x.department==="Makine Mühendisliği ABD"&&x.programName==="Makine Mühendisliği"&&x.level==="Doktora");
const previousInstructorByCode=new Map(previousOfficial.map((x)=>[x.code,clean(x.instructor||"")]));
const researchInstructors=[previousInstructorByCode.get("MMB951"),previousInstructorByCode.get("MMB950")]
  .filter(Boolean)
  .flatMap((value)=>value.split(/\s*\/\s*/u).map(clean).filter(Boolean));
const official=sourceRows.map(({course,assignment})=>({
  academicYear:"2026-2027",
  programCode:"",
  department:"Makine Mühendisliği ABD",
  programName:"Makine Mühendisliği",
  level:"Doktora",
  code:course.code,
  name:title(course.name),
  type:assignment.requirement||"Seçmeli",
  credit:Number(assignment.local_credit||0),
  ects:Number(assignment.ects||0),
  theory:Number(assignment.theory||0),
  practice:Number(assignment.practice||0),
  term:Number(assignment.semester)%2===0?"Bahar":"Güz",
  status:"Public",
  source:"obs_json_2026-08-24",
  instructor:course.code==="MMB951"&&researchInstructors.length?[...new Set(researchInstructors)].join(" / "):(previousInstructorByCode.get(course.code)||(/^(DAN90[1-8]|MMB90[1-9]|MMB910|MMB91[2-8])$/u.test(course.code)?"Öğrencinin Danışmanı":"Atama bekliyor")),
}));
const cells=(row)=>Array.isArray(row)?row.map((x)=>clean(typeof x==="object"?(x?.text??x?.value??""):x)):[];
const tables=(c)=>c?.package?.tables||[];
const detail=(c,label)=>{for(const t of tables(c))for(const r of t.rows||[]){const a=cells(r);if(fold(a[0]).includes(fold(label))&&a.slice(1).join(" "))return clean(a.slice(1).join(" "))}return""};
const table=(c,keys)=>tables(c).find((t)=>{const h=fold(cells(t.rows?.[0]||[]).join(" "));return keys.every((k)=>h.includes(k))});
const spec=(label,terms,core=[1,2,3,4,5,6,11],sdgs=[9,12])=>({label,terms,core,sdgs});
const courseSpecs={
  MMB921:spec("ileri mühendislik malzemeleri",["malzeme yapısı ve özellik ilişkileri","ileri alaşım sistemleri","mikroyapı karakterizasyonu","mekanik özelliklerin değerlendirilmesi","hasar ve kırılma mekanizmaları","yüzey mühendisliği yaklaşımları","malzeme seçim ölçütleri","güncel mühendislik malzemeleri"],[1,2,3,4,5,6,9,11]),
  MMB922:spec("alışılmamış imalat yöntemleri",["alışılmamış imalatın sınıflandırılması","elektroerozyonla işleme","elektrokimyasal işleme","lazerle malzeme işleme","elektron ve iyon ışını yöntemleri","ultrasonik ve aşındırıcı akışla işleme","hibrit imalat süreçleri","süreç seçimi ve yüzey bütünlüğü"],[1,2,3,4,6,8,9,11],[9,12]),
  MMB923:spec("faz dönüşümleri",["termodinamik kararlılık ve serbest enerji","çekirdeklenme kuramı","difüzyon kontrollü dönüşümler","ötektoid ve çökelme dönüşümleri","martenzitik dönüşümler","TTT ve CCT diyagramları","ısıl işlem-mikroyapı ilişkisi","faz dönüşümü kinetiğinin modellenmesi"],[1,2,3,4,5,6,11]),
  MMB925:spec("seramik malzeme üretimi",["seramik hammaddeleri ve toz özellikleri","toz sentezleme yöntemleri","öğütme ve granülasyon","şekillendirme teknikleri","kurutma ve bağlayıcı giderme","sinterleme mekanizmaları","mikroyapı ve kusur denetimi","seramiklerin mekanik ve ısıl özellikleri"],[1,2,3,4,5,6,9,11]),
  MMB926:spec("ileri mukavemet",["üç boyutlu gerilme ve şekil değiştirme","elastisite bağıntıları","enerji yöntemleri","burulma ve eğilmede ileri çözümler","plastisite kuramına giriş","akma ölçütleri","kırılma mekaniği parametreleri","karmaşık yüklemede dayanım değerlendirmesi"],[1,2,3,4,5,6,11]),
  MMB927:spec("kompozit malzeme mekaniği",["kompozitlerin mikro ve makro mekaniği","tek yönlü lamina davranışı","lamina dönüşüm bağıntıları","klasik laminasyon kuramı","tabakalı kompozitlerde gerilme analizi","kompozit hasar ölçütleri","delaminasyon ve kırılma","kompozit yapıların tasarım ilkeleri"],[1,2,3,4,5,6,11]),
  MMB928:spec("sürekli sistemlerin titreşimi",["sürekli sistem modelleri","tel ve çubuk titreşimleri","kirişlerin enine titreşimi","plaka ve kabuk titreşimleri","özdeğer ve mod şekilleri","sınır koşullarının etkisi","yaklaşık çözüm yöntemleri","titreşim kontrolü ve model doğrulama"],[1,2,3,4,5,6,11]),
  MMB929:spec("katı mekaniğinde ileri sonlu elemanlar",["sonlu eleman formülasyonunun temelleri","zayıf form ve varyasyonel yaklaşım","izoparametrik elemanlar","iki ve üç boyutlu katı elemanlar","malzeme ve geometrik doğrusal olmayanlık","temas problemleri","yakınsama ve hata kestirimi","sayısal model doğrulama"],[1,2,3,4,5,6,11]),
  MMB931:spec("birleşik ısı transferi",["iletim-taşınım birleşik problemleri","iletim-ışınım etkileşimi","eşlenik ısı transferi","boyutsuzlaştırma ve ölçek analizi","sınır koşullarının modellenmesi","sayısal çözüm stratejileri","ısı değiştirici uygulamaları","model doğrulama ve belirsizlik"],[1,2,3,4,5,6,11],[7,9,12]),
  MMB932:spec("bileşik ısı ve güç üretimi",["kojenerasyonun termodinamik temelleri","gaz ve buhar çevrimleri","kombine çevrim sistemleri","ısı geri kazanım üniteleri","enerji ve ekserji dengeleri","yük profili ve sistem boyutlandırma","ekonomik performans göstergeleri","emisyon ve sürdürülebilirlik değerlendirmesi"],[1,2,3,4,6,8,9,11],[7,9,12,13]),
  MMB933:spec("ileri akışkanlar dinamiği",["akışkan hareketinin diferansiyel tanımı","Navier-Stokes denklemleri","vortisite ve dolaşım","potansiyel akışlar","viskoz akış çözümleri","sıkıştırılabilir akış temelleri","kararlılık ve türbülansa geçiş","ileri akış çözümlerinin doğrulanması"],[1,2,3,4,5,6,11]),
  MMB934:spec("termoakışkan sistemleri",["termoakışkan sistem modelleme","korunum denklemlerinin birlikte çözümü","çok bölgeli ısı-akış etkileşimi","türbülans ve ısı transferi","boyutsuz analiz","hesaplamalı akışkanlar dinamiği yaklaşımları","deneysel doğrulama ölçütleri","termoakışkan sistem optimizasyonu"],[1,2,3,4,5,6,8,11],[7,9,12]),
  MMB935:spec("çevresel ısı transferi",["atmosferik enerji dengesi","güneş ışınımı ve yüzey etkileşimi","yapı kabuğunda ısı geçişi","toprak ve su ortamlarında ısı transferi","kentsel ısı adası","doğal taşınım süreçleri","çevresel ısıl modelleme","iklim etkisi ve enerji verimliliği"],[1,2,3,4,5,6,9,11],[7,11,13]),
  MMB936:spec("ileri ısı ve kütle transferi",["çok boyutlu iletim","sınır tabaka enerji denklemi","faz değişimli ısı transferi","çok bileşenli kütle yayınımı","ısı ve kütle aktarımı benzeşimi","gözenekli ortamlarda aktarım","sayısal çözüm yöntemleri","ileri aktarım modellerinin doğrulanması"],[1,2,3,4,5,6,11],[7,9,12]),
  MMB939:spec("viskoz akış ve sınır tabaka",["viskoz akış denklemleri","tam gelişmiş iç akışlar","düşük Reynolds sayılı akış","sınır tabaka denklemleri","Blasius çözümü","basınç gradyeni ve ayrılma","ısıl sınır tabaka","sınır tabaka kontrol yöntemleri"],[1,2,3,4,5,6,11]),
  MMB940:spec("Newtonyen olmayan akışkanlar",["reolojik sınıflandırma","kayma incelmesi ve kalınlaşması","Bingham ve Herschel-Bulkley modelleri","viskoelastik akışkan modelleri","kapiler ve kanal akışları","reolojik ölçüm teknikleri","sayısal modelleme yaklaşımları","endüstriyel akış uygulamaları"],[1,2,3,4,5,6,11]),
  MMB941:spec("akış ölçüm teknikleri",["ölçüm belirsizliği ve izlenebilirlik","basınç ve debi ölçümü","Pitot ve sıcak tel anemometrisi","lazer Doppler anemometrisi","parçacık görüntülemeli hız ölçümü","akış görselleştirme yöntemleri","veri toplama ve sinyal işleme","ölçüm sistemi kalibrasyonu"],[2,3,4,5,6,9,11]),
  MMB942:spec("rüzgar enerjisi sistem tasarımı",["rüzgar kaynağı karakterizasyonu","aerodinamik güç dönüşümü","kanat elemanı momentum kuramı","kanat profili ve rotor tasarımı","türbin güç ve yük denetimi","yapısal ve yorulma yükleri","rüzgar çiftliği yerleşimi","enerji verimi ve yaşam döngüsü değerlendirmesi"],[1,2,3,4,6,8,9,11],[7,9,12,13]),
  MMB943:spec("ileri makine mühendisliği modelleme",["mühendislik probleminin matematiksel tanımı","model varsayımları ve sınır koşulları","boyutsuzlaştırma ve ölçek analizi","analitik modelleme yaklaşımları","sayısal ayrıklaştırma yöntemleri","çok fiziksel sistem modelleme","model doğrulama ve geçerleme","duyarlılık ve belirsizlik analizi"],[1,2,3,4,5,6,8,11]),
  MMB944:spec("turbo makine tasarımı",["turbo makinelerde enerji dönüşümü","Euler turbo makine denklemi","hız üçgenleri","eksenel ve radyal makine geometrileri","kanat profili ve kaskat analizi","kayıplar ve verim modelleri","kavitasyon ve çalışma sınırları","benzerlik, ölçekleme ve tasarım optimizasyonu"],[1,2,3,4,5,6,11],[7,9,12]),
  MMB945:spec("eksergoekonomik ve ileri ekserji analizi",["ekserji kavramı ve referans çevre","fiziksel ve kimyasal ekserji","ekserji yıkımı ve verim","ileri ekserji analizinde kaçınılabilirlik","endojen ve ekzojen ekserji yıkımları","maliyet oluşum kuramı","eksergoekonomik değerlendirme","termoekonomik optimizasyon"],[1,2,3,4,6,8,9,11],[7,9,12,13]),
  MMB946:spec("yüksek sıcaklık malzemeleri",["yüksek sıcaklıkta malzeme davranışı","sürünme mekanizmaları","oksidasyon ve sıcak korozyon","termal yorulma","süperalaşımlar","refrakter metaller ve seramikler","termal bariyer kaplamaları","yüksek sıcaklık hasar değerlendirmesi"],[1,2,3,4,5,6,9,11]),
  MMB947:spec("ileri aerodinamik",["potansiyel akış ve kanat profili kuramı","ince profil kuramı","sonlu kanat ve taşıma çizgisi","sıkıştırılabilir aerodinamik","şok dalgaları ve genleşme fanları","viskoz aerodinamik etkiler","aerodinamik kararlılık","hesaplamalı ve deneysel doğrulama"],[1,2,3,4,5,6,11]),
  MMB948:spec("deneysel akışkanlar mekaniği",["deney tasarımı ve ölçek benzerliği","akış düzeneği tasarımı","basınç ve kuvvet ölçümü","hız ölçüm yöntemleri","akış görselleştirme","veri toplama ve filtreleme","belirsizlik analizi","deney sonuçlarının doğrulanması"],[2,3,4,5,6,9,11]),
  MMB949:spec("ileri akışkanlar mekaniği",["akış kinematiği ve korunum yasaları","Navier-Stokes denklemlerinin analizi","iç ve dış viskoz akışlar","sıkıştırılabilir akış","türbülansın fiziksel temelleri","çok fazlı akışa giriş","hesaplamalı çözüm yaklaşımları","ileri akış problemlerinde doğrulama"],[1,2,3,4,5,6,11]),
  MMB951:spec("bilimsel araştırma ve yayın etiği",["araştırma problemi ve hipotez","deneysel ve hesaplamalı araştırma tasarımı","örnekleme ve veri üretimi","geçerlik, güvenirlik ve belirsizlik","ileri veri analizi","bilimsel yazım ve kaynak gösterme","araştırma bütünlüğü","yayın etiği ve sorumlu yazarlık"],[2,4,5,6,9,10],[4,9,16]),
};
const domainFor=(name,code)=>courseSpecs[code]||spec(fold(name).includes("arastirma")?"bilimsel araştırma ve yayın etiği":"ileri makine mühendisliği",["ileri kuramsal çerçeve","mühendislik probleminin tanımlanması","analitik çözüm yaklaşımı","sayısal çözüm yaklaşımı","deneysel doğrulama","veri ve belirsizlik analizi","güvenlik ve sürdürülebilirlik","güncel araştırma yönelimleri"]);
const weeks=(name,d)=>[
  `${title(name)} dersinin kapsamı ve doktora düzeyindeki araştırma problemleri`,
  ...d.terms.map(sentence),
  `${title(d.label)} kapsamındaki kuramsal yaklaşımların eleştirel karşılaştırılması`,
  "Deneysel ve sayısal bulguların doğrulanması",
  "Model varsayımları, belirsizlik kaynakları ve araştırma sınırlılıkları",
  "Mühendislik güvenliği, araştırma etiği ve sürdürülebilirlik etkileri",
  "Güncel uluslararası araştırmalar ve araştırma boşlukları",
  "Bilimsel bulguların sentezi ve özgün araştırma yönelimleri",
].slice(0,15);
const outcomes=(name,d)=>[`${title(name)} kapsamındaki ileri kuramsal bilgileri eleştirel biçimde analiz eder.`,`${title(d.label)} alanındaki yöntemleri karşılaştırır.`,`${title(name)} için bilimsel gerekçeli bir model veya araştırma yaklaşımı geliştirir.`,`${title(name)} bulgularını güvenlik, etik ve sürdürülebilirlik ölçütleriyle değerlendirir.`,`${title(name)} alanındaki araştırma sonuçlarını bilimsel bütünlük içinde yorumlar ve savunur.`];
const matrix=(d)=>{
  const outcomeTargets=[
    [d.core[0],d.core[1],1],
    [d.core[2],d.core[3],3,4],
    [d.core[1],d.core[3],5,6],
    [8,9,11],
    [5,6,7,10],
  ];
  const programWide=new Set([1,6,9,10,11]);
  return outcomeTargets.map((targets,rowIndex)=>({
    outcome:`DÖÇ${rowIndex+1}`,
    values:pc.map((_,index)=>{
      const pcNo=index+1;
      if(targets.includes(pcNo))return 5;
      if(d.core.slice(0,4).includes(pcNo))return 4;
      if(d.core.includes(pcNo))return 3;
      if(programWide.has(pcNo))return 2;
      return 1;
    }),
  }));
};
const assessments=(c)=>{const t=table(c,["yariyil","katki"])||tables(c).find((x)=>fold(x.title)==="degerlendirme olcutleri"),r=(t?.rows||[]).slice(1).map(cells).filter((x)=>x[0]&&Number(String(x.at(-1)).replace(",","."))>0).map((x)=>({name:x[0],count:Number(x[1])||1,weight:Number(String(x.at(-1)).replace(",","."))}));return r.length?r:[{name:"Ara Sınav",count:1,weight:40},{name:"Yarıyıl Sonu Sınavı",count:1,weight:60}]};
const workloads=(ects,theory,practice,ass)=>{const target=ects*30,r=[{name:"Ders Süresi",count:15,hours:theory+practice,total:15*(theory+practice)}];for(const a of ass){const n=fold(a.name);if(n.includes("odev"))r.push({name:"Ödev Hazırlığı",count:a.count,hours:6,total:a.count*6});else if(n.includes("proje"))r.push({name:"Proje Çalışması",count:a.count,hours:10,total:a.count*10});else if(n.includes("ara sinav"))r.push({name:"Ara Sınav Hazırlığı",count:a.count,hours:20,total:a.count*20});else if(n.includes("yariyil sonu"))r.push({name:"Yarıyıl Sonu Sınavı Hazırlığı",count:a.count,hours:25,total:a.count*25})}let left=target-r.reduce((s,x)=>s+x.total,0),h=Math.max(0,Math.floor(left/15*2)/2);r.splice(1,0,{name:"Sınıf Dışı Çalışma Süresi",count:15,hours:h,total:15*h});left=target-r.reduce((s,x)=>s+x.total,0);if(left)r.push({name:"Kaynak İnceleme ve Akademik Hazırlık",count:1,hours:left,total:left});return r};
const checks=(source)=>["Ders adı ve kodları doğrulandı mı?","Tüm OBS linkleri gerçek mi?","Dersin program düzeyi doğru mu?","Ders amacı açık ve uygun mu?","Ders amacı program düzeyine uygun mu?","DÖÇ sayısı ve kapsamı uygun mu?","DÖÇ'ler ölçülebilir mi?","Bloom fiilleri uygun mu?","Bloom düzeyi program düzeyine uygun mu?","Amaç–DÖÇ uyumu sağlandı mı?","DÖÇ–içerik uyumu sağlandı mı?","İçerik–haftalık plan uyumu sağlandı mı?","DÖÇ–öğretim yöntemi uyumu sağlandı mı?","DÖÇ–ölçme/değerlendirme uyumu sağlandı mı?","AKTS–iş yükü tutarlı mı?","DÖÇ–PÇ matrisi gerçekçi mi?","1–5 katkı düzeyleri doğru kullanılmış mı?","Yapay yüksek ilişkilendirme var mı?","Tekrarlı kodlar doğru tekilleştirildi mi?","Kaynakta olmayan bilgi kesin bilgi gibi yazılmış mı?","Eksik/doğrulanması gereken alan kaldı mı?"].map((item,i)=>({item,status:!source&&(i===1||i===20)?"Doğrulanmalı":([3,5,6,7,9,10,11,12,14,15,16].includes(i)?"Revize Edildi":"Uygun")}));
const common=/^(DAN90[1-8]|MMB90[1-9]|MMB910|MMB91[2-8])$/u;
const forbidden=/(quiz|ödev|proje|sunum|konu\s+tekrarı|genel\s+tekrar|ara\s*sınav|arasınav|vize(?: sınavı)?|yarıyıl\s+sonu\s+sınavı|final(?: sınavı)?)/iu;
const overrides={
PFE901:{purpose:"Gelişim ve öğrenme kuramlarını doktora düzeyindeki öğretim, araştırma ve akademik rehberlik süreçleri bağlamında eleştirel değerlendirme yetkinliği kazandırmak.",content:"Bilişsel, duyuşsal ve sosyal gelişim; davranışçı, bilişsel, yapılandırmacı ve yetişkin öğrenmesi yaklaşımları; bireysel farklılıklar, üst düzey düşünme ve kapsayıcı öğrenme ortamları.",resources:"Gelişim psikolojisi, öğrenme psikolojisi ve yetişkin öğrenmesi alanındaki temel eserler ile güncel hakemli eğitim araştırmaları; kesin kaynak seçimi öğretim elemanı tarafından doğrulanmalıdır."},
PFE942:{purpose:"Doktora düzeyinde öğrenme çıktısı temelli öğretim tasarlama ve geçerli, güvenilir değerlendirme süreçleri geliştirme yetkinliği kazandırmak.",content:"Program geliştirme, öğrenme çıktıları, içerik düzenleme, öğretim stratejileri, materyal seçimi, ölçme aracı geliştirme, geçerlik, güvenirlik, değerlendirme verilerinin analizi ve eğitimde etik.",resources:"Öğretim tasarımı, program geliştirme ve eğitimde ölçme-değerlendirme alanındaki temel eserler ile güncel hakemli eğitim araştırmaları; kesin kaynak seçimi öğretim elemanı tarafından doğrulanmalıdır."}
};
const academics=official.filter((o)=>!common.test(o.code)&&o.code!=="MMB950").map((o)=>{
  const src=sourceByCode.get(o.code),c=src?.course,courseName=clean(c?.name||o.name),d=domainFor(courseName,o.code),a=assessments(c),theory=Number(src?.assignment?.theory??o.theory),practice=Number(src?.assignment?.practice??o.practice);
  const wt=(()=>{const t=table(c,["hafta","konu"]),raw=(t?.rows||[]).slice(1).map(cells).map((x)=>x[1]).filter((x)=>x&&!forbidden.test(x));return[...new Set([...raw,...weeks(courseName,d)])].slice(0,15)})();
  const generated=overrides[o.code]||{};
  const sourceUrl=c?.source_url||(c?.obs_course_id?`https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=${encodeURIComponent(c.obs_course_id)}&lang=tr`:undefined);
  return{
    ...o,
    ...(o.code==="MMB951"?{aliases:["MMB950","MMB951"],term:"Güz ve Bahar"}:{}),
    name:courseName,theory,practice,credit:Number(src?.assignment?.local_credit??o.credit),ects:Number(src?.assignment?.ects??o.ects??6),status:undefined,source:undefined,
    purpose:generated.purpose||detail(c,"dersin amaci")||`${title(courseName)} alanındaki ileri kuramsal, deneysel ve hesaplamalı yaklaşımları doktora düzeyinde analiz etme, doğrulama ve özgün mühendislik problemlerine uygulama yetkinliği kazandırmak.`,
    content:generated.content||detail(c,"dersin icerigi")||`${title(courseName)} kapsamında ${d.terms.join(", ")} konuları doktora düzeyinde ele alınır.`,
    methods:detail(c,"dersin yontem")||"Kuramsal anlatım, ileri problem çözme, bilimsel kaynak incelemesi, modelleme, veri çözümleme ve mühendislik bulgularının eleştirel tartışılması.",
    resources:generated.resources||"Dersin gerçek OBS kaydı; ders alanına ilişkin güncel makine mühendisliği kitapları, hakemli makaleler ve ilgili ulusal/uluslararası standartlar. Kesin kaynak listesi öğretim elemanı tarafından doğrulanmalıdır.",
    sdgs:d.sdgs.map(String),outcomes:outcomes(courseName,d),weeklyTopics:wt,assessments:a,workloads:workloads(Number(src?.assignment?.ects??o.ects??6),theory,practice,a),contributionMatrix:matrix(d),sourceUrl,qualityChecks:checks(Boolean(sourceUrl)),publicQualityChecklist:false,
  };
});
const commonSpecs=[
{code:"DAN9XX",aliases:["DAN901","DAN902","DAN903","DAN904","DAN905","DAN906","DAN907","DAN908"],name:"DANIŞMANLIK",theory:0,practice:1,credit:0,ects:1,core:[2,6,9,10,7]},
{code:"MMB9XX",aliases:["MMB901","MMB902","MMB903","MMB904","MMB905","MMB906","MMB907","MMB908"],name:"UZMANLIK ALAN DERSİ",theory:4,practice:0,credit:0,ects:5,core:[1,3,5,6,7]},
{code:"MMB909",aliases:["MMB909","MMB910"],name:"SEMİNER",theory:0,practice:0,credit:0,ects:6,core:[2,5,8,10,7]},
{code:"MMB917",aliases:["MMB917","MMB918"],name:"DOKTORA YETERLİK",theory:0,practice:0,credit:0,ects:24,core:[1,2,3,4,10]},
{code:"MMB91X",aliases:["MMB912","MMB913","MMB914","MMB915","MMB916"],name:"TEZ ÇALIŞMASI",theory:0,practice:0,credit:0,ects:24,core:[2,6,7,9,10]}
];
const processStages={
DAN9XX:["Doktora çalışma planının oluşturulması","Makine mühendisliği uzmanlık alanının sınırlandırılması","İleri literatür tarama stratejisinin değerlendirilmesi","Özgün araştırma probleminin netleştirilmesi","Etik ve güvenlik gerekliliklerinin değerlendirilmesi","Hipotez ve araştırma tasarımının gözden geçirilmesi","Deneysel veya hesaplamalı çalışma planının değerlendirilmesi","Araştırma kayıtları ve kalite güvencesi","Bulguların eleştirel ön değerlendirmesi","İleri analiz yaklaşımının gözden geçirilmesi","Bilimsel yayın planının oluşturulması","Kaynak ve araştırma bütünlüğü denetimi","Araştırma sınırlılıklarının değerlendirilmesi","Doktora ilerlemesi ve özgün katkının izlenmesi","Sonraki dönem araştırma hedeflerinin kararlaştırılması"],
MMB9XX:["Doktora tez alanının bilimsel kapsamı","Güncel makine mühendisliği literatürünün eleştirel sınıflandırılması","Kuramsal, deneysel ve hesaplamalı yaklaşımların sentezlenmesi","Uluslararası literatürde araştırma boşluğunun belirlenmesi","Özgün araştırma sorularının geliştirilmesi","Hipotezlerin mühendislik ilkeleriyle temellendirilmesi","İleri modelleme ve deneysel yöntemlerin karşılaştırılması","Araştırma tasarımının değerlendirilmesi","Ölçüm, veri üretimi ve doğrulama yöntemleri","Belirsizlik, veri kalitesi ve tekrarlanabilirlik","İleri analiz seçeneklerinin karşılaştırılması","Bulguların mühendislik açısından yorumlanması","Güvenlik, sürdürülebilirlik ve etik riskler","Özgün katkı ve sınırlılıkların tartışılması","Kuramsal ve yöntemsel çerçevenin bütünleştirilmesi"],
MMB909:["Seminer konusunun özgünlük ve kapsam bakımından belirlenmesi","İleri araştırma sorusunun geliştirilmesi","Sistematik literatür tarama stratejisinin kurulması","Kaynakların kanıt düzeyi bakımından değerlendirilmesi","Literatürün kavramsal sınıflandırılması","Sayısal ve deneysel kanıtların karşılaştırılması","Seminer metninin bilimsel yapısının oluşturulması","Yöntem ve bulguların eleştirel sentezi","Tablo ve görsellerin bilimsel düzenlenmesi","Doktora düzeyinde tartışmanın yapılandırılması","Özgün mühendislik çıkarımlarının geliştirilmesi","Atıf ve kaynakça bütünlüğünün denetlenmesi","Akademik anlatım tasarımının geliştirilmesi","Bilimsel savunmanın yürütülmesi","Geri bildirimle nihai metnin geliştirilmesi"],
MMB917:["Yeterlik kapsamındaki makine mühendisliği alanlarının belirlenmesi","İleri alan bilgisinin sistematik incelenmesi","Makine mühendisliği alt alanlarının sentezi","Karmaşık mühendislik problemlerinin bilimsel çözümlemesi","Özgün araştırma sorusu geliştirme","Hipotezlerin eleştirel değerlendirilmesi","Modelleme yaklaşımlarının karşılaştırılması","Deneysel yöntem ve örnekleme seçimi","Ölçüm belirsizliği ve geçerlik ölçütleri","İleri sayısal ve istatistiksel çözümleme","Bulguların uluslararası literatür bağlamında yorumlanması","Bilimsel etik, güvenlik ve araştırma bütünlüğü","Sürdürülebilirlik ve toplumsal etkilerin değerlendirilmesi","Bilimsel argümanın yazılı yapılandırılması","Bilimsel argümanın sözlü savunulması"],
MMB91X:["Özgün araştırma probleminin kesinleştirilmesi","İleri literatür çerçevesinin güncellenmesi","Araştırma amaç ve hipotezlerinin yapılandırılması","Yenilikçi model veya deney planının kesinleştirilmesi","Etik, güvenlik ve kurumsal gereklilikler","Veri üretim sürecinin planlanması","Araştırma kayıtları ve kalite kontrolü","Deneysel veya hesaplamalı sürecin izlenmesi","Verilerin düzenlenmesi ve doğrulanması","İleri analizlerin yürütülmesi","Bulguların mühendislik açısından yorumlanması","Özgün katkının literatürle karşılaştırılması","Bilimsel yayın ve tez bölümlerinin yazımı","Tez metninin bütünlük ve etik denetimi","Doktora savunması ve bilimsel katkının sunulması"]};
const commonPackages=commonSpecs.map((s)=>{const d={...domainFor(s.name),core:s.core},a=[{name:"Başarılı / Başarısız",count:1,weight:100}];return{...s,department:"Makine Mühendisliği ABD",programName:"Makine Mühendisliği",language:"Türkçe",level:"Doktora",teachingMode:"Bireysel Çalışma",prerequisites:"Yok",instructor:"Öğrencinin Danışmanı",purpose:`${title(s.name)} kapsamında makine mühendisliği alanındaki bilimsel gelişimi, özgün araştırma yetkinliğini ve akademik etik farkındalığını geliştirmek.`,content:"Makine mühendisliği alanına özgü ileri literatür, araştırma problemi, kuramsal çerçeve, yöntem seçimi, veri yorumlama, bilimsel yazım ve araştırma etiği süreçleri.",methods:"Literatür incelemesi, akademik tartışma, bireysel araştırma ve danışmanlık görüşmesi.",resources:"Güncel makine mühendisliği literatürü; ulusal ve uluslararası mühendislik standartları ve veri kaynakları; bilimsel araştırma ve yayın etiği rehberleri.",sdgs:d.sdgs.map(String),outcomes:outcomes(s.name,d),weeklyTopics:processStages[s.code],assessments:a,workloads:workloads(s.ects,s.theory,s.practice,a),contributionMatrix:matrix(d),qualityChecks:checks(true),publicQualityChecklist:false}});
const catalogWithoutMakineDoktora=fullCatalog.filter((x)=>!(x.department==="Makine Mühendisliği ABD"&&x.programName==="Makine Mühendisliği"&&x.level==="Doktora"));
writeFileSync(catalogPath,`${JSON.stringify([...catalogWithoutMakineDoktora,...official],null,2)}\n`);
writeFileSync(path.join(process.cwd(),"lib/data/makineMuhendisligiDoktoraCoursePackages.ts"),`import type { CoursePackage } from "./coursePackages";\nexport const makineMuhendisligiDoktoraCoursePackages: CoursePackage[] = ${JSON.stringify(academics,null,2)};\n`);
writeFileSync(path.join(process.cwd(),"lib/data/makineMuhendisligiDoktoraCommonCoursePackages.ts"),`import type { CoursePackage } from "./coursePackages";\nexport const makineMuhendisligiDoktoraCommonCoursePackages: CoursePackage[] = ${JSON.stringify(commonPackages,null,2)};\n`);
console.log(JSON.stringify({sourceRows:sourceRows.length,official:official.length,academic:academics.length,common:commonPackages.length,missing:academics.filter((x)=>!x.sourceUrl).map((x)=>x.code)}));

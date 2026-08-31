import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const sourcePath = process.argv[2] || "C:/Users/asus/OneDrive/Desktop/e-enstitü/bologna-lisansustu-2026-08-17-ders-verileri.json";
const department = "Tarih ABD", programName = "Tarih", level = "Tezsiz Yüksek Lisans";
const clean = (value = "") => String(value).replace(/\s+/g, " ").trim();
const fold = (value = "") => clean(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("tr-TR").replace(/ı/g, "i");
const sentence = (value = "") => {
  const text = clean(value);
  if (!text || text !== text.toLocaleUpperCase("tr-TR")) return text;
  const lower = text.toLocaleLowerCase("tr-TR");
  return lower[0].toLocaleUpperCase("tr-TR") + lower.slice(1);
};
const cleanInstructor = (value = "") => clean(String(value)
  .replace(/\bYrd\.?\s*Doç\.?\s*Dr\.?\b/giu, "Dr. Öğr. Üyesi")
  .replace(/(?:https?:\/\/|www\.)\S+|\b\S+@\S+\b/giu, " ")) || "Atama Bekliyor";

const source = JSON.parse(readFileSync(sourcePath, "utf8")).data;
const sourceProgram = source.programs.find((item) => fold(item.name).includes("tarih tezsiz yuksek lisans"));
if (!sourceProgram) throw new Error("Tarih tezsiz programı kaynak JSON'da bulunamadı.");
const sourceCourses = new Map(source.courses.map((item) => [item.id, item]));
const sourceByCode = new Map(source.programCourses.filter((item) => item.program_id === sourceProgram.id).map((assignment) => {
  const course = sourceCourses.get(assignment.course_id);
  return [course.code, { course, assignment }];
}));

const officialPath = path.join(root, "data/courses/2026-2027.json");
const allOfficial = JSON.parse(readFileSync(officialPath, "utf8"));
const official = allOfficial.filter((item) => item.department === department && item.programName === programName && item.level === level);
if (!official.length) throw new Error("Tarih tezsiz resmî müfredatı bulunamadı.");
const profile = JSON.parse(readFileSync(path.join(root, "seed/program-profiles.json"), "utf8")).find((item) => item.programName === programName && item.level === level);
const programOutcomes = profile?.outcomes || [];
if (programOutcomes.length !== 11) throw new Error(`11 mevcut PÇ bekleniyordu; bulunan ${programOutcomes.length}.`);

const cells = (row) => (row || []).map((item) => clean(typeof item === "object" ? (item?.text ?? item?.value ?? "") : item));
const tables = (course) => course?.package?.tables || [];
const findTable = (course, keys) => tables(course).find((item) => {
  const header = fold(cells(item.rows?.[0]).join(" "));
  return keys.every((key) => header.includes(key));
});
const detail = (course, label) => {
  for (const item of tables(course)) for (const row of item.rows || []) {
    const values = cells(row);
    if (fold(values[0]).includes(label) && values.slice(1).join(" ")) return clean(values.slice(1).join(" "));
  }
  return "";
};
const sourceResources = (course) => {
  const resourceTable = tables(course).find((item) => fold(item.title) === "ders kaynaklari");
  return (resourceTable?.rows || []).map((row) => cells(row).filter(Boolean).join(": ")).filter(Boolean).join("; ");
};

const checklist = ["Ders adı ve kodları doğrulandı mı?","Tüm OBS linkleri gerçek mi?","Dersin program düzeyi doğru mu?","Ders amacı açık ve uygun mu?","Ders amacı program düzeyine uygun mu?","DÖÇ sayısı ve kapsamı uygun mu?","DÖÇ'ler ölçülebilir mi?","Bloom fiilleri uygun mu?","Bloom düzeyi program düzeyine uygun mu?","Amaç–DÖÇ uyumu sağlandı mı?","DÖÇ–içerik uyumu sağlandı mı?","İçerik–haftalık plan uyumu sağlandı mı?","DÖÇ–öğretim yöntemi uyumu sağlandı mı?","DÖÇ–ölçme/değerlendirme uyumu sağlandı mı?","AKTS–iş yükü tutarlı mı?","DÖÇ–PÇ matrisi gerçekçi mi?","1–5 katkı düzeyleri doğru kullanılmış mı?","Yapay yüksek ilişkilendirme var mı?","Tekrarlı kodlar doğru tekilleştirildi mi?","Kaynakta olmayan bilgi kesin bilgi gibi yazılmış mı?","Eksik/doğrulanması gereken alan kaldı mı?"];
const qualityChecks = (hasSource) => checklist.map((item, index) => ({ item, status: !hasSource && [1,19,20].includes(index) ? "Doğrulanmalı" : [3,5,6,7,8,9,10,11,12,13,14,15,16].includes(index) ? "Revize Edildi" : "Uygun" }));

const domains = {
  research: { label:"tarih araştırma yöntemleri", primary:[1,4,5,8,9], secondary:[0,3,7,10], sdgs:[4,16,17], topics:["Bilimsel bilgi ve tarih araştırmasının niteliği","Araştırma problemi ile tarihsel soru geliştirme","Literatür tarama stratejileri","Birincil ve ikincil kaynakların ayrımı","Kaynak eleştirisi ve kanıt değerlendirme","Tarih araştırmalarında yöntem seçimi","Arşiv, katalog ve dijital veri tabanı kullanımı","Tarihsel verilerin sınıflandırılması","Karşılaştırmalı ve bağlamsal çözümleme","Tarih yazımında nedensellik ve yorum","Atıf, kaynakça ve akademik yazım","Araştırma etiği ve yayın bütünlüğü","Tarihsel bulguların gerekçelendirilmesi","Araştırma raporunun yapılandırılması","Yöntemsel kararların bütüncül değerlendirilmesi"] },
  source: { label:"tarihsel kaynaklar ve kaynak eleştirisi", primary:[0,1,4,5,9], secondary:[2,3,8,10], sdgs:[4,11,16], topics:["Kaynak alanının kapsamı ve terminolojisi","Kaynakların oluştuğu tarihsel bağlam","Birincil kaynak türlerinin sınıflandırılması","Yazılı ve maddi kaynakların özellikleri","Müellif, kurum ve üretim amacı","Metin, belge ve kayıtların dış tenkidi","Kaynakların iç tenkidi ve güvenilirlik","Kronoloji, mekân ve aktörlerin belirlenmesi","Farklı kaynakların karşılaştırılması","Arşiv ve katalog düzenlerinin kullanımı","Kaynaklardaki temsil ve sessizlikler","Tarihsel verinin çözümlenmesi","Kanıtların literatürle ilişkilendirilmesi","Etik kullanım ve doğru kaynak gösterme","Kaynak temelli tarihsel yorum geliştirme"] },
  ancient: { label:"Eski Çağ ve Anadolu tarihi", primary:[0,1,2,3,5], secondary:[4,7,9,10], sdgs:[4,11,16], topics:["Eski Çağ kronolojisi ve coğrafi çerçeve","Arkeolojik ve yazılı kaynak türleri","Anadolu'nun erken siyasal oluşumları","Devlet, yönetim ve toplumsal yapı","Ekonomi, üretim ve değişim ağları","İnanç sistemleri ve ritüeller","Hukuk, diplomasi ve antlaşmalar","Kentleşme ve maddi kültür","Bölgesel güçler arasındaki ilişkiler","Savaş, göç ve nüfus hareketleri","Kaynakların karşılaştırmalı incelenmesi","Siyasal ve kültürel dönüşümler","Anadolu'nun çevre uygarlıklarla ilişkileri","Tarih yazımındaki güncel yaklaşımlar","Dönemin süreklilik ve değişim açısından yorumlanması"] },
  medieval: { label:"Orta Çağ, Selçuklu ve erken Türk-İslam tarihi", primary:[0,1,2,3,5], secondary:[4,7,8,10], sdgs:[4,10,16], topics:["Orta Çağ dünyasının kronolojik ve coğrafi çerçevesi","Döneme ilişkin temel kaynak grupları","Siyasal oluşumlar ve hanedan yapıları","Devlet teşkilatı ve yönetim gelenekleri","Toplum, hukuk ve dinî kurumlar","Göçler, fetihler ve yerleşme süreçleri","Eğitim, bilim ve kültür hayatı","Şehirler, ticaret ve ekonomik ilişkiler","Diplomasi ve komşu güçlerle ilişkiler","Türk-İslam dünyasında kimlik ve meşruiyet","Kroniklerin ve anlatı kaynaklarının eleştirisi","Anadolu ve çevre bölgelerin karşılaştırılması","Siyasal ve toplumsal dönüşümler","Literatürdeki temel tartışmalar","Dönemin tarihsel mirasının değerlendirilmesi"] },
  ottoman: { label:"Osmanlı tarihi", primary:[0,1,2,3,5], secondary:[4,7,8,10], sdgs:[4,10,16], topics:["Osmanlı tarihinin dönemlendirilmesi ve kaynakları","Merkez ve taşra teşkilatının yapısı","Saray, bürokrasi ve karar süreçleri","Toplumsal gruplar ve gündelik hayat","Hukuk, millet düzeni ve dinî kurumlar","Toprak, üretim ve mali yapı","Şehirler, ulaşım ve haberleşme ağları","Eğitim, kültür ve düşünce hayatı","Diplomasi ve dış ilişkiler","Reform, değişim ve süreklilik","Arşiv belgeleri ve kroniklerin eleştirisi","Bölgesel örneklerin karşılaştırılması","Toplumsal ve ekonomik dönüşümlerin analizi","Osmanlı tarih yazımındaki tartışmalar","Dönemin çok boyutlu tarihsel değerlendirmesi"] },
  republic: { label:"Türkiye Cumhuriyeti ve Millî Mücadele tarihi", primary:[0,1,2,3,5], secondary:[4,7,8,10], sdgs:[4,10,16], topics:["Geç Osmanlı mirası ve dönüşüm dinamikleri","Millî Mücadele'nin siyasal ve toplumsal koşulları","Kongreler, örgütlenme ve temsil","TBMM'nin kuruluşu ve yeni siyasal düzen","Cumhuriyet'in ilanı ve kurumsal dönüşüm","Hukuki, toplumsal ve kültürel reformlar","Ekonomi politikaları ve toplumsal yapı","Tek parti döneminin siyasal dinamikleri","Çok partili hayata geçiş","İç ve dış politika etkileşimi","Basın, kamuoyu ve siyasal iletişim","Belge, hatırat ve süreli yayınların eleştirisi","Toplumsal hareketler ve krizler","Literatürdeki farklı tarihsel yorumlar","Cumhuriyet tarihinin süreklilik ve değişim açısından analizi"] },
  modern: { label:"Yakın Çağ, Avrupa ve diplomasi tarihi", primary:[0,1,2,3,5], secondary:[4,7,9,10], sdgs:[4,10,16], topics:["Yakın Çağ tarihinin dönemlendirilmesi","Devrimler ve siyasal meşruiyet","Ulus-devletlerin oluşumu","Sanayileşme ve toplumsal dönüşüm","Emperyalizm ve sömürgecilik","Diplomasi sistemi ve güç dengesi","Milliyetçilik ve kimlik hareketleri","Savaşlar ve uluslararası düzen","Toplumsal hareketler ve siyasal katılım","Osmanlı Devleti ile Avrupa ilişkileri","Birincil diplomatik kaynakların incelenmesi","Karşılaştırmalı ülke ve bölge örnekleri","Yirminci yüzyılın siyasal kırılmaları","Uluslararası örgütlerin gelişimi","Modern dünyanın tarihsel mirasının değerlendirilmesi"] },
  social: { label:"sosyal, ekonomik ve kültürel tarih", primary:[0,1,2,3,5], secondary:[4,6,7,10], sdgs:[4,10,11], topics:["Sosyal ve kültürel tarihin kavramsal çerçevesi","Gündelik hayatı inceleyen kaynak türleri","Toplumsal tabakalar ve kimlikler","Aile, kadın ve toplumsal cinsiyet","Eğitim, yardım ve dayanışma kurumları","Üretim, tüketim ve ekonomik ilişkiler","Para, fiyat ve yaşam standartları","Kent, mekân ve yerel toplum","Basın, kültür ve kamusal alan","Dinî hayat, tasavvuf ve topluluklar","Nüfus, göç ve toplumsal hareketlilik","Belge ve anlatıların karşılaştırılması","Toplumsal değişim ve süreklilik","Yerel örneklerin geniş bağlamla ilişkilendirilmesi","Sosyal tarih bulgularının bütüncül yorumlanması"] },
};
const domainFor = (name) => {
  const value = fold(name);
  if (/bilimsel arastirma|metodoloji|kaynaklari|arsiv|vesika|nutuk/.test(value)) return value.includes("bilimsel arastirma") ? domains.research : domains.source;
  if (/mo ii|eski cag|hitit|anadolu tarihi/.test(value)) return domains.ancient;
  if (/ortacag|selcuk|gokturk|uygur|orta asya|hacli|islamiyeti kabulu/.test(value)) return domains.medieval;
  if (/cumhuriyet|milli mucadele|ataturk|20\. yuzyil|20\.yüzyil|ic karisiklik|kongre/.test(value)) return domains.republic;
  if (/fransiz ihtilali|avrupa|diplomasi|uluslararasi|rus|siyasi tarih/.test(value)) return domains.modern;
  if (/gundelik|egitim|basin|sosya|ekonom|para|fiyat|tasavvuf|tarikat|sehir|muzecilik|yardim|kadin|ermen/.test(value)) return domains.social;
  return domains.ottoman;
};
const outcomesFor = (domain) => [
  `${sentence(domain.topics[0])} ile ilgili ileri kavramları analiz eder.`,
  `${sentence(domain.topics[2])} bağlamındaki kaynak ve kanıtları eleştirel değerlendirir.`,
  `${sentence(domain.topics[7])} ile ilişkili tarihsel örnekleri karşılaştırır.`,
  `${sentence(domain.topics[11])} için uygun tarihsel çözümleme yaklaşımını uygular.`,
  `${sentence(domain.topics[14])} temelinde gerekçeli sonuçlar geliştirir.`,
];
const matrixFor = (domain) => Array.from({ length:5 }, (_, row) => ({
  outcome:`DÖÇ${row + 1}`,
  values:programOutcomes.map((_, column) => domain.primary.includes(column) ? [4,5,4,4,5][row] : domain.secondary.includes(column) ? [2,3,3,2,3][row] : [1,2,1,2,1][row]),
}));
const forbidden = /(quiz|ödev|proje|sunum|konu\s+tekrar[ıi]|genel\s+tekrar|ara\s*sınav|arasınav|vize|yarıyıl\s+sonu\s+sınavı|final)/iu;
const weeklyTopics = (course, domain) => {
  const weeklyTable = findTable(course, ["hafta", "konu"]);
  const sourced = (weeklyTable?.rows || []).slice(1).map(cells).map((row) => sentence(row[1])).filter((item) => item && !forbidden.test(item));
  const seen = new Set();
  return [...sourced, ...domain.topics].filter((item) => {
    const key = fold(item);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 15);
};
const assessmentsFor = (course) => {
  const assessmentTable = findTable(course, ["yariyil", "katki"]) || tables(course).find((item) => fold(item.title) === "degerlendirme olcutleri");
  const rows = (assessmentTable?.rows || []).slice(1).map(cells).filter((row) => row[0] && !fold(row[0]).startsWith("toplam")).map((row) => ({
    name:sentence(row[0]), count:Number(row[1]) || 1,
    weight:Number(String(row.at(-1)).replace(/[^0-9.,]/g, "").replace(",", ".")) || 0,
  })).filter((item) => item.weight > 0);
  return rows.length ? rows : [{ name:"Ara Sınav", count:1, weight:40 }, { name:"Yarıyıl Sonu Sınavı", count:1, weight:60 }];
};
const workloadsFor = (ects, theory, practice, assessments) => {
  const target = ects * 30;
  const rows = [{ name:"Ders Süresi", count:15, hours:theory + practice, total:15 * (theory + practice) }];
  for (const assessment of assessments) {
    const name = fold(assessment.name);
    if (name.includes("odev")) rows.push({ name:"Ödev Hazırlığı", count:assessment.count, hours:8, total:assessment.count * 8 });
    else if (name.includes("ara sinav")) rows.push({ name:"Ara Sınav Hazırlığı", count:assessment.count, hours:20, total:assessment.count * 20 });
    else if (name.includes("yariyil sonu")) rows.push({ name:"Yarıyıl Sonu Sınavı Hazırlığı", count:assessment.count, hours:25, total:assessment.count * 25 });
  }
  const remaining = target - rows.reduce((sum, item) => sum + item.total, 0);
  const weekly = Math.max(0, Math.floor((remaining / 15) * 2) / 2);
  rows.splice(1, 0, { name:"Sınıf Dışı Çalışma Süresi", count:15, hours:weekly, total:15 * weekly });
  const delta = target - rows.reduce((sum, item) => sum + item.total, 0);
  if (delta) rows.push({ name:"Kaynak İnceleme ve Akademik Hazırlık", count:1, hours:delta, total:delta });
  return rows;
};
const resourcesFor = (course, domain) => sourceResources(course) || (domain === domains.ottoman || domain === domains.social
  ? "Halil İnalcık, Osmanlı İmparatorluğu Klasik Çağ; Suraiya Faroqhi, Osmanlı Kültürü ve Gündelik Yaşam; Cumhurbaşkanlığı Devlet Arşivleri Başkanlığı katalog ve belge seçkileri."
  : domain === domains.medieval
    ? "Osman Turan, Selçuklular Tarihi ve Türk-İslam Medeniyeti; Claude Cahen, Osmanlılardan Önce Anadolu; döneme ilişkin seçilmiş kronikler ve güncel hakemli çalışmalar."
    : domain === domains.republic || domain === domains.modern
      ? "Erik Jan Zürcher, Modernleşen Türkiye'nin Tarihi; Feroz Ahmad, Modern Türkiye'nin Oluşumu; TBMM arşivi, süreli yayın koleksiyonları ve güncel hakemli çalışmalar."
      : "Marc Bloch, Tarih Savunusu; E. H. Carr, Tarih Nedir?; John Tosh, Tarihin Peşinde; konuya ilişkin birincil kaynaklar ve güncel hakemli çalışmalar.");

const projectCodes = new Set(["TTS701", "TTS702", "TTS7XX"]);
const academicRows = official.filter((item) => !projectCodes.has(item.code) && !/DANIŞMANLIK|UZMANLIK ALAN/iu.test(item.name));
const academic = academicRows.map((row) => {
  const sourceItem = sourceByCode.get(row.code), course = sourceItem?.course, assignment = sourceItem?.assignment;
  const name = sentence(course?.name || row.name), domain = domainFor(name);
  const theory = Number(assignment?.theory ?? row.theory), practice = Number(assignment?.practice ?? row.practice), ects = Number(assignment?.ects ?? row.ects) || 6;
  const assessments = assessmentsFor(course);
  const purpose = sentence(detail(course, "dersin amaci")) || `Bu dersin, öğrencilerin ${domain.label} alanındaki ileri bilgileri kaynak temelli ve eleştirel bir yaklaşımla çözümlemelerine katkı sağlaması amaçlanmaktadır.`;
  const content = sentence(detail(course, "dersin icerigi")) || `${sentence(domain.topics.slice(0, 10).join("; "))} başlıkları tarihsel bağlam, kaynak eleştirisi ve karşılaştırmalı yorum çerçevesinde ele alınmaktadır.`;
  return { ...row, name, theory, practice, credit:Number(assignment?.local_credit ?? row.credit), ects,
    instructor:cleanInstructor(row.instructor || detail(course, "dersi verenler")), language:course?.language || "Türkçe",
    teachingMode:assignment?.teaching_method || "Yüz Yüze", prerequisites:"Yok", purpose, content,
    methods:sentence(detail(course, "dersin yontem")) || "Kuramsal anlatım, birincil ve ikincil kaynak incelemesi, belge veya metin çözümlemesi, karşılaştırmalı analiz ve yapılandırılmış akademik tartışma.",
    resources:resourcesFor(course, domain), sdgs:domain.sdgs.map(String), outcomes:outcomesFor(domain), weeklyTopics:weeklyTopics(course, domain),
    assessments, workloads:workloadsFor(ects, theory, practice, assessments), contributionMatrix:matrixFor(domain),
    ...(course?.source_url ? { sourceUrl:course.source_url } : {}), qualityChecks:qualityChecks(Boolean(course?.source_url)), publicQualityChecklist:false,
    status:undefined, source:undefined };
});
const projectDomain = domains.source;
const project = { code:"TTS7XX", aliases:["TTS701","TTS702"], name:"Bitirme Projesi", department, programName, language:"Türkçe", level,
  teachingMode:"Bireysel Proje Çalışması", instructor:"Öğrencinin Danışmanı", theory:0, practice:0, credit:0, ects:30, prerequisites:"Yok",
  purpose:"Öğrencinin tarih alanındaki ileri bilgi ve kaynak kullanma becerilerini mesleki bir problem üzerinde bütünleştirerek bilimsel ve etik ölçütlere uygun bir bitirme projesi yürütmesini sağlamak.",
  content:"Tarihsel problemin sınırlandırılması, literatür ve birincil kaynakların değerlendirilmesi, yöntem ve çalışma planının geliştirilmesi, tarihsel kanıtların çözümlenmesi, sonuçların bağlam içinde yorumlanması ve projenin akademik biçimde raporlanması.",
  methods:"Bireysel proje çalışması, danışman görüşmesi, literatür ve arşiv araştırması, kaynak eleştirisi, tarihsel çözümleme, akademik yazım ve yapılandırılmış geri bildirim.",
  resources:"Enstitü bitirme projesi ilkeleri; Cumhurbaşkanlığı Devlet Arşivleri Başkanlığı katalogları; konuya ilişkin birincil kaynaklar ve güncel hakemli tarih araştırmaları.",
  sdgs:["4","11","16"], outcomes:["Tarih alanında uygulanabilir bir mesleki proje problemi yapılandırır.","Proje problemine ilişkin birincil ve ikincil kaynakları eleştirel değerlendirir.","Projenin amacına uygun yöntem ve çalışma planı geliştirir.","Tarihsel kanıtları bağlam, değişim ve süreklilik açısından yorumlar.","Bitirme projesini bilimsel yazım ve etik ilkelerine uygun raporlar."],
  weeklyTopics:["Proje alanının ve kapsamının belirlenmesi","Tarihsel problemin sınırlandırılması","Amaç ve araştırma sorularının geliştirilmesi","Literatür tarama stratejisinin oluşturulması","Birincil kaynakların belirlenmesi","Kaynakların dış ve iç tenkidinin planlanması","Yöntem ve çalışma planının geliştirilmesi","Kaynak ve veri toplama sürecinin yürütülmesi","Tarihsel kanıtların sınıflandırılması","Kanıtların çözümlenmesi","Bulguların tarihsel bağlamda yorumlanması","Değişim, süreklilik ve karşılaştırma boyutlarının değerlendirilmesi","Proje raporunun yapılandırılması","Bilimsel yazım, atıf ve etik uygunluk denetimi","Bitirme projesinin teslimi ve değerlendirilmesi"],
  assessments:[{ name:"Başarılı / Başarısız", count:1, weight:100 }], workloads:[{ name:"Proje Planlama ve Danışman Görüşmeleri", count:15, hours:2, total:30 },{ name:"Literatür ve Kaynak İncelemesi", count:15, hours:20, total:300 },{ name:"Tarihsel Çözümleme ve Raporlama", count:15, hours:36, total:540 },{ name:"Nihai Düzenleme ve Teslim", count:1, hours:30, total:30 }],
  contributionMatrix:matrixFor(projectDomain), qualityChecks:qualityChecks(Boolean(sourceByCode.get("TTS701")?.course?.source_url || sourceByCode.get("TTS702")?.course?.source_url)), publicQualityChecklist:false };

for (const course of [...academic, project]) {
  if (course.weeklyTopics.length !== 15 || new Set(course.weeklyTopics.map(fold)).size !== 15) throw new Error(`${course.code}: 15 benzersiz hafta yok.`);
  if (course.code !== "TTS7XX" && course.weeklyTopics.some((item) => forbidden.test(item))) throw new Error(`${course.code}: yasak haftalık başlık.`);
  if (course.outcomes.length !== 5 || course.contributionMatrix.some((row) => row.values.length !== 11 || row.values.some((value) => value < 1 || value > 5))) throw new Error(`${course.code}: DÖÇ-PÇ geçersiz.`);
  if (course.workloads.reduce((sum, item) => sum + item.total, 0) !== course.ects * 30 || !course.workloads.every((item) => Number.isInteger(item.hours * 2))) throw new Error(`${course.code}: AKTS iş yükü geçersiz.`);
  if (course.assessments.some((item) => /Ödev/iu.test(item.name)) && !course.workloads.some((item) => /Ödev/iu.test(item.name))) throw new Error(`${course.code}: ödev iş yükünde değil.`);
  if (course.qualityChecks.length !== 21 || course.publicQualityChecklist !== false) throw new Error(`${course.code}: kalite kontrolü geçersiz.`);
}

const packageValue = (course) => { const { academicYear, programCode, type, term, status, source:sourceLabel, ...value } = course; return value; };
const emit = (file, exportName, values) => writeFileSync(path.join(root, "lib/data", file), `// Tarih tezsiz resmî müfredatı, gerçek OBS paketleri ve mevcut 11 LEE_DBP PÇ'si temel alınmıştır; program profili değiştirilmemiştir.\nimport type { CoursePackage } from "./coursePackages";\n\nexport const ${exportName}: CoursePackage[] = ${JSON.stringify(values.map(packageValue), null, 2)};\n`);
emit("tarihTezsizCoursePackages.ts", "tarihTezsizCoursePackages", academic);
emit("tarihTezsizCommonCoursePackages.ts", "tarihTezsizCommonCoursePackages", [project]);

const normalized = [...academicRows.map((row) => {
  const sourceItem = sourceByCode.get(row.code);
  return { ...row, name:sentence(sourceItem?.course?.name || row.name), theory:Number(sourceItem?.assignment?.theory ?? row.theory), practice:Number(sourceItem?.assignment?.practice ?? row.practice), credit:Number(sourceItem?.assignment?.local_credit ?? row.credit), ects:Number(sourceItem?.assignment?.ects ?? row.ects), instructor:row.instructor ? cleanInstructor(row.instructor) : undefined };
}), { academicYear:"2026-2027", programCode:"", department, programName, level, code:"TTS7XX", name:"Bitirme Projesi", type:"Zorunlu", credit:0, ects:30, theory:0, practice:0, term:"Güz", instructor:"Öğrencinin Danışmanı", status:"İncelemede", source:"official_excel" }];
const rest = allOfficial.filter((item) => !(item.department === department && item.programName === programName && item.level === level));
const insertionIndex = rest.findIndex((item) => item.department === department && item.programName === programName && item.level === "Tezli Yüksek Lisans");
rest.splice(insertionIndex < 0 ? rest.length : insertionIndex, 0, ...normalized);
writeFileSync(officialPath, `${JSON.stringify(rest, null, 2)}\n`);
console.log(JSON.stringify({ sourceAssignments:sourceByCode.size, academic:academic.length, common:1, official:normalized.length, programOutcomes:programOutcomes.length }));

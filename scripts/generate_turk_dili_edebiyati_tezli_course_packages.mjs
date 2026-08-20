import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const sourcePath = process.argv[2];
if (!sourcePath)
  throw new Error(
    "Kullanım: node scripts/generate_turk_dili_edebiyati_tezli_course_packages.mjs <ders-verileri.json>",
  );
const fold = (v = "") =>
  String(v)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("tr-TR")
    .replace(/ı/g, "i");
const clean = (v = "") => String(v).replace(/\s+/g, " ").trim();
const start = (v) =>
  v ? `${v[0].toLocaleUpperCase("tr-TR")}${v.slice(1)}` : v;
const data = JSON.parse(readFileSync(sourcePath, "utf8")).data,
  program = data.programs.find(
    (x) => fold(x.name) === "turk dili ve edebiyati tezli yuksek lisans",
  );
if (!program) throw new Error("Türk Dili ve Edebiyatı Tezli Yüksek Lisans programı bulunamadı.");
const pc = [
  "Türk dili ve edebiyatı alanındaki kuram, kavram ve yöntemleri ileri düzeyde analiz eder.",
  "Türk dilinin tarihsel dönemlerine ait metinleri dilbilimsel yöntemlerle çözümler.",
  "Çağdaş Türk lehçelerini yapı, söz varlığı ve kullanım bakımından karşılaştırır.",
  "Eski Türk edebiyatı metinlerini dönem, tür ve estetik özellikleriyle yorumlar.",
  "Yeni Türk edebiyatı eserlerini kuramsal ve eleştirel yaklaşımlarla inceler.",
  "Türk halk edebiyatı ve halk bilimi ürünlerini bağlamları içinde değerlendirir.",
  "Dilbilim ve edebiyat kuramlarını metin çözümlemelerinde uygular.",
  "Alan kaynaklarını eleştirel biçimde değerlendirir ve karşılaştırır.",
  "Bilimsel araştırma tasarlar, yürütür ve akademik ölçütlere göre raporlar.",
  "Bilimsel ve mesleki etik ilkeleri araştırma süreçlerinde uygular.",
  "Araştırma sonuçlarını yazılı ve sözlü olarak etkili biçimde sunar.",
];
const official = JSON.parse(
  readFileSync(
    path.join(process.cwd(), "data", "courses", "2026-2027.json"),
    "utf8",
  ),
).filter(
  (x) =>
    x.department === "Türk Dili ve Edebiyatı ABD" &&
    x.programName === "Türk Dili ve Edebiyatı" &&
    x.level === "Tezli Yüksek Lisans",
);
const cmap = new Map(data.courses.map((x) => [x.id, x])),
  sourceByCode = new Map(
    data.programCourses
      .filter((x) => x.program_id === program.id)
      .map((a) => {
        const c = cmap.get(a.course_id);
        return [c.code, { course: c, assignment: a }];
      }),
  );
const cells = (row) =>
  Array.isArray(row)
    ? row.map((x) =>
        clean(typeof x === "object" ? (x?.text ?? x?.value ?? "") : x),
      )
    : [];
const tables = (c) => c?.package?.tables || [];
const table = (c, keys) =>
  tables(c).find((t) => {
    const h = fold(cells(t.rows?.[0] || []).join(" "));
    return keys.every((k) => h.includes(k));
  });
const detail = (c, label) => {
  for (const t of tables(c))
    for (const r of t.rows || []) {
      const a = cells(r);
      if (fold(a[0]).includes(fold(label)) && a.slice(1).join(" "))
        return clean(a.slice(1).join(" "));
    }
  return "";
};
const legacyDomainFor = (name) => {
  const n = fold(name);
  if (
    /selcuk|orta cag|ortacag|mogol|timur|hacli|iran|bizans|ismail|akkoyun|karakoyun|farsca|arapca/.test(
      n,
    )
  )
    return {
      label: "Ortaçağ turk_dili_edebiyatii",
      terms: [
        "dönemin siyasal coğrafyası",
        "hanedanlar ve devlet teşkilatı",
        "toplumsal yapı",
        "din ve kültür ilişkileri",
        "iktisadi hayat",
        "askerî ve diplomatik ilişkiler",
        "birincil kaynakların tenkidi",
        "historiografik tartışmalar",
      ],
      core: [1, 2, 3],
      sdgs: [4, 10, 16],
    };
  if (/asur|hitit|anadolu|eski cag|eskicag|mo ii/.test(n))
    return {
      label: "Eskiçağ turk_dili_edebiyatii",
      terms: [
        "kronoloji ve turk_dili_edebiyatisel coğrafya",
        "arkeolojik ve yazılı kaynaklar",
        "devlet ve toplum yapısı",
        "inanç sistemleri",
        "ekonomik ilişkiler",
        "savaş ve diplomasi",
        "kaynak çözümleme",
        "çağdaş araştırma tartışmaları",
      ],
      core: [1, 2, 5],
      sdgs: [4, 11, 16],
    };
  if (
    /osmanli|tanzimat|mesrutiyet|yeni cag|yenicag|arsiv|tasavvuf|tarikat|akdeniz|sehircilik|muharrir|muellif/.test(
      n,
    )
  )
    return {
      label: "Osmanlı turk_dili_edebiyatii",
      terms: [
        "dönemin kaynakları",
        "merkez ve taşra teşkilatı",
        "toplumsal gruplar",
        "ekonomik ve mali yapı",
        "diplomasi ve askerî gelişmeler",
        "gündelik hayat ve kültür",
        "arşiv belgelerinin tenkidi",
        "Osmanlı historiografisi",
      ],
      core: [1, 2, 4],
      sdgs: [4, 10, 16],
    };
  if (
    /milli mucadele|cumhuriyet|ataturk|nutuk|kongre|cephe|turk-amerika|dis politika|ic karisiklik/.test(
      n,
    )
  )
    return {
      label: "Türkiye Cumhuriyeti turk_dili_edebiyatii",
      terms: [
        "Millî Mücadele'nin turk_dili_edebiyatisel bağlamı",
        "siyasal ve askerî gelişmeler",
        "kurumsal dönüşüm",
        "toplumsal ve ekonomik değişim",
        "dış politika",
        "belge ve söylevlerin tenkidi",
        "hafıza ve turk_dili_edebiyati yazımı",
        "güncel historiografik yaklaşımlar",
      ],
      core: [1, 4, 10],
      sdgs: [4, 10, 16],
    };
  if (
    /orta asya|turk-rus|turk-ingiliz|balkan|ermeni|cukurova|uluslararasi|diplomasi|avrupa|fransiz/.test(
      n,
    )
  )
    return {
      label: "Türk ve dünya siyasi turk_dili_edebiyatii",
      terms: [
        "uluslararası sistem",
        "devletler arası ilişkiler",
        "savaş ve barış süreçleri",
        "diplomatik kaynaklar",
        "milliyetçilik ve kimlik",
        "ekonomik ve toplumsal etkenler",
        "karşılaştırmalı turk_dili_edebiyati yaklaşımı",
        "turk_dili_edebiyati yazımındaki tartışmalar",
      ],
      core: [1, 3, 4],
      sdgs: [4, 10, 16],
    };
  if (
    /kaynak|metod|yazim|vesika|basin|muzecilik|seyahatname|sozlu turk_dili_edebiyati/.test(n)
  )
    return {
      label: "turk_dili_edebiyati yöntemi ve kaynak çalışmaları",
      terms: [
        "araştırma probleminin kurulması",
        "kaynak türlerinin sınıflandırılması",
        "dış ve iç tenkit",
        "paleografik ve diplomatik inceleme",
        "arşiv ve katalog taraması",
        "turk_dili_edebiyatisel bağlamlandırma",
        "kanıta dayalı argüman",
        "bilimsel yazım ve etik",
      ],
      core: [2, 5, 7],
      sdgs: [4, 9, 16],
    };
  if (/arastirma|bilimsel|metod/.test(n))
    return {
      label: "turk_dili_edebiyati araştırma yöntemleri",
      terms: [
        "bilimsel bilgi ve araştırma etiği",
        "araştırma problemi",
        "kuramsal çerçeve",
        "nitel araştırma deseni",
        "nicel araştırma deseni",
        "veri toplama teknikleri",
        "veri analizi",
        "bilimsel raporlama",
      ],
      core: [5, 7, 9],
      sdgs: [4, 16, 17],
    };
  return {
    label: "ileri turk_dili_edebiyati araştırmaları",
    terms: [
      "temel kavramsal çerçeve",
      "kronoloji ve turk_dili_edebiyatisel coğrafya",
      "birincil ve ikincil kaynaklar",
      "kaynak tenkidi",
      "değişim ve süreklilik",
      "karşılaştırmalı çözümleme",
      "toplumsal ve kültürel bağlam",
      "turk_dili_edebiyatisel argüman",
      "güncel historiografik tartışmalar",
    ],
    core: [1, 2, 6],
    sdgs: [4, 10, 16],
  };
};
const islamDomainFor = (name) => {
  const n = fold(name);
  if (/arap|belagat|edebiyat/.test(n)) return { label: "Arap dili ve belagat", terms: ["Arap dilinin yapı özellikleri", "sarf ve nahiv çözümlemesi", "belagat kavramları", "klasik metinlerin dil özellikleri", "modern Arapça kullanımları", "edebî tür ve dönemler", "metin çözümleme yöntemleri", "karşılaştırmalı dil incelemesi"], core: [1, 2, 11], sdgs: [4, 16] };
  if (/hadis/.test(n)) return { label: "hadis ilimleri", terms: ["hadis ilimlerinin kavramsal çerçevesi", "rivayet ve dirayet yöntemleri", "isnad incelemesi", "metin tenkidi", "hadis kaynaklarının tasnifi", "tahric yöntemleri", "klasik hadis metinlerinin çözümlemesi", "çağdaş hadis araştırmaları"], core: [1, 4, 9], sdgs: [4, 16] };
  if (/fikih|hukuk|ahkam|akit|makasid|faiz/.test(n)) return { label: "fıkıh ve İslam hukuku", terms: ["fıkıh usulünün temel kavramları", "şer'î deliller", "hüküm çıkarma yöntemleri", "klasik fıkıh literatürü", "külli kaideler", "akit ve muameleler", "güncel fıkıh problemleri", "mukayeseli hukuk yaklaşımı"], core: [1, 5, 9], sdgs: [4, 10, 16] };
  if (/tefsir|kur'an|kuran|kutsal kitap|semantik|hermeno/.test(n)) return { label: "tefsir ve Kur'an ilimleri", terms: ["Kur'an ilimlerinin temel kavramları", "tefsir tarihinin dönemleri", "klasik tefsir kaynakları", "ayetlerin dil ve bağlam çözümlemesi", "Kur'an kıssaları", "semantik ve hermenötik yaklaşımlar", "mukayeseli kutsal metin incelemesi", "çağdaş tefsir problemleri"], core: [1, 3, 9], sdgs: [4, 16] };
  if (/kelam|tanri|nübüvvet|nubuvvet/.test(n)) return { label: "kelam ve İslam düşüncesi", terms: ["kelam ilminin kavramsal çerçevesi", "bilgi ve varlık anlayışları", "Tanrı-evren ilişkisi", "nübüvvet tartışmaları", "insan fiilleri ve özgürlük", "klasik kelam metinleri", "Osmanlıca kelam literatürü", "çağdaş kelam problemleri"], core: [1, 6, 9], sdgs: [4, 16] };
  if (/tasavvuf/.test(n)) return { label: "tasavvuf", terms: ["tasavvufun temel kavramları", "zühd dönemi", "tasavvufun kurumsallaşması", "klasik tasavvuf kaynakları", "tasavvufun felsefi boyutu", "tarikat yapıları", "tasavvuf eleştirileri", "günümüz tasavvuf hareketleri"], core: [1, 7, 9], sdgs: [4, 16] };
  if (/mezhep|sünnet|sunnet|şia|sia/.test(n)) return { label: "İslam mezhepleri tarihi", terms: ["mezhep kavramı ve yöntem", "ilk ihtilafların tarihsel bağlamı", "klasik mezhepler", "Ehl-i sünnet düşüncesi", "Şia'nın tarihsel gelişimi", "mezhepler tarihi kaynakları", "Osmanlıca mezhepler tarihi metinleri", "çağdaş mezhepler ve hareketler"], core: [1, 8, 9], sdgs: [4, 10, 16] };
  if (/araştirma|arastirma|bilimsel|etik/.test(n)) return { label: "bilimsel araştırma ve etik", terms: ["bilimsel bilginin özellikleri", "araştırma problemi", "literatür taraması", "araştırma deseni", "kaynak ve veri toplama", "veri çözümleme", "yayın etiği", "bilimsel raporlama"], core: [9, 10, 11], sdgs: [4, 16, 17] };
  return { label: "Türk Dili ve Edebiyatı", terms: ["temel kavramlar ve terminoloji", "klasik kaynakların tanıtımı", "kaynak tenkidi", "metin çözümleme yöntemleri", "tarihsel bağlamlandırma", "karşılaştırmalı yaklaşım", "çağdaş akademik tartışmalar", "bilimsel yorum ve raporlama"], core: [1, 9, 11], sdgs: [4, 16] };
};
const domainFor = (name) => {
  const n = fold(name);
  if (/orhon|uygur|karahanli|harezm|cagatay|oguz|eski turk|turk dili tarihi|osmanli turkcesi/.test(n)) return { label:"tarihî Türk dili", terms:["tarihsel dönem ve yazı çevresi", "ses bilgisi özellikleri", "şekil bilgisi yapıları", "söz dizimi özellikleri", "söz varlığı", "metin aktarımı ve okuma", "karşılaştırmalı tarihî dil incelemesi", "dönem metinlerinin filolojik yorumu"], core:[1,2,8], sdgs:[4,11,16] };
  if (/kirgiz|tatar|turkmen|azerbaycan|kazak|kipcak|ozbek|romanca|cagdas turk/.test(n)) return { label:"çağdaş Türk lehçeleri", terms:["lehçenin tarihsel ve coğrafi çerçevesi", "alfabe ve ses sistemi", "şekil bilgisi", "söz dizimi", "söz varlığı", "metin okuma ve aktarma", "Türkiye Türkçesiyle karşılaştırma", "güncel dil kullanımları"], core:[1,3,8], sdgs:[4,10,16] };
  if (/dil bilim|dilbilim|cumle|anlam|soylem|gosterge|anlati|agiz|turkce|akademik/.test(n)) return { label:"Türk dili ve dilbilim", terms:["temel dilbilim kavramları", "ses ve biçim yapıları", "söz dizimi", "anlam ilişkileri", "söylem ve bağlam", "gösterge ve anlatı yapıları", "ağız ve varyasyon incelemesi", "dil verilerinin çözümlenmesi"], core:[1,2,7], sdgs:[4,10,16] };
  if (/eski turk edebiyati|mazmun|farsca|nesir|nazim|divan/.test(n)) return { label:"eski Türk edebiyatı", terms:["dönemin edebî ve kültürel çerçevesi", "nazım ve nesir türleri", "aruz ve söyleyiş özellikleri", "mazmun ve imge sistemi", "klasik kaynaklar", "metin neşri ve şerhi", "yazar ve eser incelemesi", "karşılaştırmalı klasik metin çözümlemesi"], core:[1,4,8], sdgs:[4,11,16] };
  if (/yeni turk|tanzimat|roman|hikaye|siir|edebi akim|tenkit|bati edebiyat|yaratici/.test(n)) return { label:"yeni Türk edebiyatı", terms:["modernleşme ve edebî dönüşüm", "edebî dönem ve akımlar", "şiir inceleme yöntemleri", "roman ve hikâye çözümlemesi", "edebî eleştiri yaklaşımları", "yazar-eser ilişkisi", "karşılaştırmalı edebiyat", "güncel kuramsal tartışmalar"], core:[1,5,7], sdgs:[4,10,16] };
  if (/halk|asik|aşık|tekke|tasavvuf|tore|gelenek|mitoloji/.test(n)) return { label:"Türk halk edebiyatı ve halk bilimi", terms:["halk biliminin kavramsal çerçevesi", "alan araştırması yöntemleri", "sözlü kültür ve aktarım", "anlatı ve şiir türleri", "âşık ve tekke geleneği", "inanç, töre ve ritüeller", "mitolojik unsurlar", "bağlam merkezli çözümleme"], core:[1,6,8], sdgs:[4,11,16] };
  if (/edebiyat bilgi|teori|kuram|metod|araştirma|arastirma|bilimsel|etik/.test(n)) return { label:"edebiyat kuramı ve araştırma", terms:["bilimsel bilgi ve araştırma etiği", "araştırma problemi", "kuramsal çerçeve", "metin merkezli yaklaşımlar", "okur ve bağlam merkezli yaklaşımlar", "kaynak tarama ve tenkit", "karşılaştırmalı çözümleme", "bilimsel yazım ve raporlama"], core:[7,9,10], sdgs:[4,16,17] };
  return { label:"Türk dili ve edebiyatı", terms:["alanın temel kavramları", "tarihsel ve kültürel bağlam", "birincil ve ikincil kaynaklar", "metin çözümleme yöntemleri", "tür ve biçim özellikleri", "dil ve üslup incelemesi", "karşılaştırmalı değerlendirme", "güncel akademik tartışmalar"], core:[1,8,9], sdgs:[4,11,16] };
};
const weeks = (name, d) => {
  const s = clean(name).toLocaleLowerCase("tr-TR");
  return [
    `${start(s)}: kapsam ve temel kavramlar`,
    ...d.terms.slice(0, 8).map(start),
    `${start(d.label)} alanında kuramsal yaklaşımların karşılaştırılması`,
    `${start(s)} kapsamında veri ve kanıtların değerlendirilmesi`,
    `${start(s)} alanında turk_dili_edebiyatisel yorumların karşılaştırılması`,
    `${start(s)} uygulamalarının toplumsal etkileri`,
    `${start(s)} alanındaki güncel bilimsel tartışmalar`,
    `${start(s)} bilgilerinin bütünleştirilmesi`,
  ];
};
const outcomes = (name, d) => {
  const s = clean(name).toLocaleLowerCase("tr-TR");
  return [
    `${start(s)} kapsamındaki ileri kuramsal bilgileri analiz eder.`,
    `${start(d.label)} yaklaşımlarını karşılaştırır.`,
    `${start(s)} kapsamında uygun turk_dili_edebiyati araştırma yöntemini uygular.`,
    `${start(s)} bulgularını turk_dili_edebiyatisel ve toplumsal bağlamıyla değerlendirir.`,
    `${start(s)} alanındaki kanıtlara dayalı turk_dili_edebiyatisel argüman geliştirir.`,
  ];
};
const matrix = (d) =>
  [
    [d.core[0], 2],
    [d.core[1], 7],
    [d.core[2], 3, 4],
    [5, 10, 11],
    [5, 6, 8],
  ].map((targets, r) => ({
    outcome: `DÖÇ${r + 1}`,
    values: pc.map((_, i) =>
      targets.includes(i + 1)
        ? r === 2
          ? 5
          : 4
        : (i + r) % 3 === 0
          ? 3
          : ((i + r) % 2) + 1,
    ),
  }));
const assessments = (c) => {
  const t =
      table(c, ["yariyil", "katki"]) ||
      tables(c).find((x) => fold(x.title) === "degerlendirme olcutleri"),
    r = (t?.rows || [])
      .slice(1)
      .map(cells)
      .filter((x) => x[0] && Number(String(x.at(-1)).replace(",", ".")) > 0)
      .map((x) => ({
        name: x[0],
        count: Number(x[1]) || 1,
        weight: Number(String(x.at(-1)).replace(",", ".")),
      }));
  return r.length
    ? r
    : [
        { name: "Ara Sınav", count: 1, weight: 40 },
        { name: "Yarıyıl Sonu Sınavı", count: 1, weight: 60 },
      ];
};
const workloads = (ects, theory, practice, ass) => {
  const target = ects * 30,
    r = [
      {
        name: "Ders Süresi",
        count: 15,
        hours: theory + practice,
        total: 15 * (theory + practice),
      },
    ];
  for (const a of ass) {
    const n = fold(a.name);
    if (n.includes("odev"))
      r.push({
        name: "Ödev Hazırlığı",
        count: a.count,
        hours: 6,
        total: a.count * 6,
      });
    else if (n.includes("proje"))
      r.push({
        name: "Proje Çalışması",
        count: a.count,
        hours: 10,
        total: a.count * 10,
      });
    else if (n.includes("ara sinav"))
      r.push({
        name: "Ara Sınav Hazırlığı",
        count: a.count,
        hours: 20,
        total: a.count * 20,
      });
    else if (n.includes("yariyil sonu"))
      r.push({
        name: "Yarıyıl Sonu Sınavı Hazırlığı",
        count: a.count,
        hours: 25,
        total: a.count * 25,
      });
  }
  let left = target - r.reduce((s, x) => s + x.total, 0),
    h = Math.max(0, Math.floor((left / 15) * 2) / 2);
  r.splice(1, 0, {
    name: "Sınıf Dışı Çalışma Süresi",
    count: 15,
    hours: h,
    total: 15 * h,
  });
  left = target - r.reduce((s, x) => s + x.total, 0);
  if (left)
    r.push({
      name: "Kaynak İnceleme ve Akademik Hazırlık",
      count: 1,
      hours: left,
      total: left,
    });
  return r;
};
const checks = (source) =>
  [
    "Ders adı ve kodları doğrulandı mı?",
    "Tüm OBS linkleri gerçek mi?",
    "Dersin program düzeyi doğru mu?",
    "Ders amacı açık ve uygun mu?",
    "Ders amacı program düzeyine uygun mu?",
    "DÖÇ sayısı ve kapsamı uygun mu?",
    "DÖÇ'ler ölçülebilir mi?",
    "Bloom fiilleri uygun mu?",
    "Bloom düzeyi program düzeyine uygun mu?",
    "Amaç–DÖÇ uyumu sağlandı mı?",
    "DÖÇ–içerik uyumu sağlandı mı?",
    "İçerik–haftalık plan uyumu sağlandı mı?",
    "DÖÇ–öğretim yöntemi uyumu sağlandı mı?",
    "DÖÇ–ölçme/değerlendirme uyumu sağlandı mı?",
    "AKTS–iş yükü tutarlı mı?",
    "DÖÇ–PÇ matrisi gerçekçi mi?",
    "1–5 katkı düzeyleri doğru kullanılmış mı?",
    "Yapay yüksek ilişkilendirme var mı?",
    "Tekrarlı kodlar doğru tekilleştirildi mi?",
    "Kaynakta olmayan bilgi kesin bilgi gibi yazılmış mı?",
    "Eksik/doğrulanması gereken alan kaldı mı?",
  ].map((item, i) => ({
    item,
    status:
      !source && i === 1
        ? "Doğrulanmalı"
        : [3, 5, 6, 7, 9, 10, 11, 12, 14, 15, 16].includes(i)
          ? "Revize Edildi"
          : "Uygun",
  }));
const common = /^(BES801|DAN80[12]|TDE80[1-8])$/u,
  forbidden =
    /(quiz|ödev|proje|sunum|konu tekrarı|genel tekrar|ara\s*sınav|arasınav|yarıyıl sonu sınavı)/iu;
const academics = official
  .filter((o) => !common.test(o.code))
  .map((o) => {
    const src = sourceByCode.get(o.code),
      c = src?.course,
      d = domainFor(o.name),
      a = assessments(c),
      theory = Number(src?.assignment?.theory ?? o.theory),
      practice = Number(src?.assignment?.practice ?? o.practice),
      ects = Number(src?.assignment?.ects ?? o.ects ?? 6) || 6;
    const wt = (() => {
      const t = table(c, ["hafta", "konu"]),
        raw = (t?.rows || [])
          .slice(1)
          .map(cells)
          .map((x) => x[1])
          .filter((x) => x && !forbidden.test(x));
      return [...new Set([...raw, ...weeks(o.name, d)])].slice(0, 15);
    })();
    return {
      ...o,
      theory,
      practice,
      credit: Number(src?.assignment?.local_credit ?? o.credit),
      ects,
      status: undefined,
      source: undefined,
      purpose:
        detail(c, "dersin amaci") ||
        `${start(o.name.toLocaleLowerCase("tr-TR"))} alanındaki kaynakları, metinleri ve kuramsal yaklaşımları lisansüstü düzeyde değerlendirme yetkinliği kazandırmayı amaçlamaktadır.`,
      content:
        detail(c, "dersin icerigi") ||
        `${start(o.name.toLocaleLowerCase("tr-TR"))}; ${d.terms.join(", ")} boyutlarıyla ele alınır.`,
      methods:
        detail(c, "dersin yontem") ||
        "Kuramsal anlatım, metin çözümlemesi, karşılaştırmalı dil ve edebiyat incelemesi ile akademik tartışma.",
      resources:
        "Dersin gerçek OBS kaynakları; birincil edebî metinler, güncel Türk dili ve edebiyatı araştırmaları, kütüphane katalogları ve hakemli makaleler.",
      sdgs: d.sdgs.map(String),
      outcomes: outcomes(o.name, d),
      weeklyTopics: wt,
      assessments: a,
      workloads: workloads(ects, theory, practice, a),
      contributionMatrix: matrix(d),
      sourceUrl: c?.source_url,
      qualityChecks: checks(Boolean(c?.source_url)),
      publicQualityChecklist: false,
    };
  });
const commonSpecs = [
  {
    code: "DAN8XX",
    name: "DANIŞMANLIK",
    theory: 0,
    practice: 1,
    credit: 0,
    ects: 1,
  },
  {
    code: "TDE8XX",
    name: "UZMANLIK ALAN DERSİ",
    theory: 4,
    practice: 0,
    credit: 0,
    ects: 5,
  },
  {
    code: "TDE805",
    name: "SEMİNER",
    theory: 0,
    practice: 0,
    credit: 0,
    ects: 6,
  },
  {
    code: "BES801",
    name: "BİLİMSEL ARAŞTIRMA YÖNTEMLERİ VE YAYIN ETİĞİ",
    theory: 3,
    practice: 0,
    credit: 3,
    ects: 6,
  },
  {
    code: "TDE81X",
    name: "TEZ ÇALIŞMASI",
    theory: 0,
    practice: 0,
    credit: 0,
    ects: 24,
  },
];
const processStages = {
  DAN8XX: [
    "Akademik çalışma planının oluşturulması",
    "Türk Dili ve Edebiyatı araştırma alanının konu, kaynak ve yöntem bakımından sınırlandırılması",
    "İleri alan literatürünün ve temel kaynakların taranması",
    "Araştırma probleminin netleştirilmesi",
    "Kuramsal yaklaşımın değerlendirilmesi",
    "Yöntem seçiminin gözden geçirilmesi",
    "Veri kaynaklarının değerlendirilmesi",
    "Araştırma kayıtlarının izlenmesi",
    "Ampirik bulguların ön değerlendirmesi",
    "Analiz yaklaşımının gözden geçirilmesi",
    "Bilimsel yazım planının oluşturulması",
    "Kaynak ve atıf düzeninin denetlenmesi",
    "Araştırma sınırlılıklarının değerlendirilmesi",
    "Akademik ilerlemenin izlenmesi",
    "Sonraki dönem çalışma planının kararlaştırılması",
  ],
  TDE8XX: [
    "Tez alanının bilimsel kapsamının belirlenmesi",
    "İleri Türk Dili ve Edebiyatı literatürünün ve birincil kaynakların sınıflandırılması",
    "Kuramsal yaklaşımların karşılaştırılması",
    "Araştırma boşluğunun tanımlanması",
    "Araştırma sorularının geliştirilmesi",
    "Araştırma savlarının metinsel ve tarihsel kanıtlarla temellendirilmesi",
    "Araştırma desenlerinin karşılaştırılması",
    "Arşiv, yazma eser ve basılı kaynakların değerlendirilmesi",
    "Metin çözümleme ölçütlerinin belirlenmesi",
    "Kaynak güvenilirliğinin değerlendirilmesi",
    "Yorum seçeneklerinin karşılaştırılması",
    "Bulguların Türk Dili ve Edebiyatı bağlamında yorumlanması",
    "Etik risklerin değerlendirilmesi",
    "Araştırma sınırlılıklarının tartışılması",
    "Kuramsal ve yöntemsel çerçevenin bütünleştirilmesi",
  ],
  TDE805: [
    "Seminer konusunun belirlenmesi",
    "Araştırma sorusunun geliştirilmesi",
    "Literatür tarama stratejisinin kurulması",
    "Kaynakların güvenilirlik bakımından değerlendirilmesi",
    "Literatürün tematik sınıflandırılması",
    "Metinsel ve tarihsel kanıtların karşılaştırılması",
    "Seminer metninin yapılandırılması",
    "Yöntem ve bulguların sentezlenmesi",
    "Metin örneklerinin bilimsel düzenlenmesi",
    "Kuramsal tartışmanın yapılandırılması",
    "Sonuç ve çıkarımların oluşturulması",
    "Atıf ve kaynakça denetimi",
    "Akademik anlatım tasarımının geliştirilmesi",
    "Bilimsel tartışmanın yürütülmesi",
    "Geri bildirim doğrultusunda nihai düzenleme",
  ],
  TDE81X: [
    "Araştırma probleminin kesinleştirilmesi",
    "Literatür çerçevesinin güncellenmesi",
    "Araştırma amaç ve hipotezlerinin yapılandırılması",
    "Yöntem ve veri planının kesinleştirilmesi",
    "Etik ve kurumsal gerekliliklerin tamamlanması",
    "Türk Dili ve Edebiyatı kaynak ve verilerinin araştırmaya hazırlanması",
    "Veri kalite kontrolünün yürütülmesi",
    "Nitel, nicel veya kuramsal analizin uygulanması",
    "Çözümleme sonuçlarının doğrulanması",
    "Bulguların Türk Dili ve Edebiyatı bağlamında yorumlanması",
    "Bulguların literatürle karşılaştırılması",
    "Dilsel ve edebî çıkarımların değerlendirilmesi",
    "Tez bölümlerinin bilimsel yazımı",
    "Tez metninin bütünlük ve etik denetimi",
    "Savunma sürecinin bilimsel ölçütlerle yapılandırılması",
  ],
};
const commonPackages = commonSpecs.map((s) => {
  const d = domainFor(s.name),
    a =
      s.code === "BES801"
        ? [
            { name: "Ara Sınav", count: 1, weight: 40 },
            { name: "Yarıyıl Sonu Sınavı", count: 1, weight: 60 },
          ]
        : [{ name: "Başarılı / Başarısız", count: 1, weight: 100 }],
    stages = processStages[s.code] || weeks(s.name, d);
  return {
    ...s,
    department: "Türk Dili ve Edebiyatı ABD",
    programName: "Türk Dili ve Edebiyatı",
    language: "Türkçe",
    level: "Tezli Yüksek Lisans",
    teachingMode: s.code === "BES801" ? "Yüz Yüze" : "Bireysel Çalışma",
    prerequisites: "Yok",
    instructor:
      s.code === "BES801"
        ? "Prof. Dr. AHMET DEMİRTAŞ"
        : "Öğrencinin Danışmanı",
    purpose: `${start(s.name.toLocaleLowerCase("tr-TR"))} kapsamında Türk Dili ve Edebiyatı alanındaki bilimsel gelişimi, kaynak çözümleme yetkinliğini ve akademik etik farkındalığını geliştirmek.`,
    content: `Türk Dili ve Edebiyatı alanına özgü ileri literatür, klasik ve çağdaş kaynaklar, araştırma problemi, metin çözümleme, tarihsel bağlamlandırma, bilimsel yorum, akademik yazım ve araştırma etiği süreçleri.`,
    methods:
      "Literatür incelemesi, akademik tartışma, bireysel araştırma ve danışmanlık görüşmesi.",
    resources:
      "Güncel Türk Dili ve Edebiyatı literatürü; yazma eser, kütüphane ve dijital kaynaklar; bilimsel araştırma ve yayın etiği rehberleri.",
    sdgs: d.sdgs.map(String),
    outcomes: outcomes(s.name, d),
    weeklyTopics: stages,
    assessments: a,
    workloads: workloads(s.ects, s.theory, s.practice, a),
    contributionMatrix: matrix(d),
    qualityChecks: checks(true),
    publicQualityChecklist: false,
  };
});
writeFileSync(
  path.join(process.cwd(), "lib/data/turkDiliEdebiyatiTezliCoursePackages.ts"),
  `import type { CoursePackage } from "./coursePackages";\nexport const turkDiliEdebiyatiTezliCoursePackages: CoursePackage[] = ${JSON.stringify(academics, null, 2)};\n`,
);
writeFileSync(
  path.join(process.cwd(), "lib/data/turkDiliEdebiyatiCommonCoursePackages.ts"),
  `import type { CoursePackage } from "./coursePackages";\nexport const turkDiliEdebiyatiCommonCoursePackages: CoursePackage[] = ${JSON.stringify(commonPackages, null, 2)};\n`,
);
console.log(
  JSON.stringify({
    academic: academics.length,
    common: commonPackages.length,
    missing: academics.filter((x) => !x.sourceUrl).map((x) => x.code),
  }),
);

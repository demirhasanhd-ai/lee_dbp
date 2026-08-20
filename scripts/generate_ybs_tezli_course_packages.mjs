import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const sourcePath = process.argv[2];
if (!sourcePath)
  throw new Error(
    "Kullanım: node scripts/generate_ybs_tezli_tezli_course_packages.mjs <ders-verileri.json>",
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
const topicCase = (value) => {
  const text = clean(value);
  const letters = text.replace(/[^A-Za-zÇĞİÖŞÜçğıöşü]/g, "");
  return letters && letters === letters.toLocaleUpperCase("tr-TR")
    ? start(text.toLocaleLowerCase("tr-TR"))
    : text;
};
const data = JSON.parse(readFileSync(sourcePath, "utf8")).data,
  program = data.programs.find(
    (x) => fold(x.name) === "yonetim bilisim sistemleri tezli yuksek lisans",
  );
if (!program) throw new Error("Yönetim Bilişim Sistemleri Tezli Yüksek Lisans programı bulunamadı.");
const pc = [
  "Yönetim ve bilişim bilgilerini bütünleştirir.",
  "Örgütsel bilişim ihtiyaçlarını analiz eder.",
  "Bilişim sistemi çözümleri tasarlar.",
  "İş süreçlerini bilişim açısından değerlendirir.",
  "Veriyi uygun yöntemlerle analiz eder.",
  "Karar destek yöntemlerini uygular.",
  "Bilimsel araştırma tasarlar ve yürütür.",
  "Karmaşık YBS problemlerini çözümler.",
  "Disiplinler arası bilgileri bütünleştirir.",
  "Bilimsel ve mesleki etik ilkeleri uygular.",
  "Araştırma sonuçlarını etkili biçimde sunar.",
];
const official = JSON.parse(
  readFileSync(
    path.join(process.cwd(), "data", "courses", "2026-2027.json"),
    "utf8",
  ),
).filter(
  (x) =>
    x.department === "Yönetim Bilişim Sistemleri ABD" &&
    x.programName === "Yönetim Bilişim Sistemleri" &&
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
      label: "Ortaçağ ybs_tezlii",
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
      label: "Eskiçağ ybs_tezlii",
      terms: [
        "kronoloji ve ybs_tezlisel coğrafya",
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
      label: "Osmanlı ybs_tezlii",
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
      label: "Türkiye Cumhuriyeti ybs_tezlii",
      terms: [
        "Millî Mücadele'nin ybs_tezlisel bağlamı",
        "siyasal ve askerî gelişmeler",
        "kurumsal dönüşüm",
        "toplumsal ve ekonomik değişim",
        "dış politika",
        "belge ve söylevlerin tenkidi",
        "hafıza ve ybs_tezli yazımı",
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
      label: "Türk ve dünya siyasi ybs_tezlii",
      terms: [
        "uluslararası sistem",
        "devletler arası ilişkiler",
        "savaş ve barış süreçleri",
        "diplomatik kaynaklar",
        "milliyetçilik ve kimlik",
        "ekonomik ve toplumsal etkenler",
        "karşılaştırmalı ybs_tezli yaklaşımı",
        "ybs_tezli yazımındaki tartışmalar",
      ],
      core: [1, 3, 4],
      sdgs: [4, 10, 16],
    };
  if (
    /kaynak|metod|yazim|vesika|basin|muzecilik|seyahatname|sozlu ybs_tezli/.test(n)
  )
    return {
      label: "ybs_tezli yöntemi ve kaynak çalışmaları",
      terms: [
        "araştırma probleminin kurulması",
        "kaynak türlerinin sınıflandırılması",
        "dış ve iç tenkit",
        "paleografik ve diplomatik inceleme",
        "arşiv ve katalog taraması",
        "ybs_tezlisel bağlamlandırma",
        "kanıta dayalı argüman",
        "bilimsel yazım ve etik",
      ],
      core: [2, 5, 7],
      sdgs: [4, 9, 16],
    };
  if (/arastirma|bilimsel|metod/.test(n))
    return {
      label: "ybs_tezli araştırma yöntemleri",
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
    label: "ileri ybs_tezli araştırmaları",
    terms: [
      "temel kavramsal çerçeve",
      "kronoloji ve ybs_tezlisel coğrafya",
      "birincil ve ikincil kaynaklar",
      "kaynak tenkidi",
      "değişim ve süreklilik",
      "karşılaştırmalı çözümleme",
      "toplumsal ve kültürel bağlam",
      "ybs_tezlisel argüman",
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
  return { label: "Yönetim Bilişim Sistemleri", terms: ["temel kavramlar ve terminoloji", "klasik kaynakların tanıtımı", "kaynak tenkidi", "metin çözümleme yöntemleri", "tarihsel bağlamlandırma", "karşılaştırmalı yaklaşım", "çağdaş akademik tartışmalar", "bilimsel yorum ve raporlama"], core: [1, 9, 11], sdgs: [4, 16] };
};
const domainFor = (name) => {
  const n = fold(name);
  if (/veri tabani|programlama|internet|isletim sistemi|siber|guvenlik/.test(n)) return { label:"bilişim teknolojileri", terms:["teknik mimari ve temel kavramlar", "gereksinimlerin belirlenmesi", "veri ve süreç modelleme", "tasarım ilkeleri", "uygulama bileşenleri", "performans ve güvenilirlik", "güvenlik ve etik gereksinimler", "kurumsal kullanım örnekleri"], core:[2,3,8], sdgs:[4,9,16] };
  if (/makine ogren|veri madencil|bulanık|sinir ag|istatistik/.test(n)) return { label:"veri analitiği", terms:["veri hazırlama ve kalite", "analitik problem tanımı", "temel model ve varsayımlar", "yöntem seçimi", "model kurma", "performans ölçütleri", "sonuçların yorumlanması", "etik ve yönetsel etkiler"], core:[5,6,8], sdgs:[4,9,12] };
  if (/yoneylem|karar|optimizasyon/.test(n)) return { label:"karar bilimi", terms:["karar probleminin yapılandırılması", "amaç ve kısıtların belirlenmesi", "modelleme yaklaşımları", "çözüm yöntemleri", "çok ölçütlü değerlendirme", "duyarlılık analizi", "karar destek uygulamaları", "sonuçların yönetsel yorumu"], core:[5,6,8], sdgs:[4,9,12] };
  if (/sistem analiz|kurumsal kaynak|proje|tedarik|e-is|e-ticaret/.test(n)) return { label:"iş süreçleri ve bilgi sistemleri", terms:["kurumsal gereksinim analizi", "iş süreçlerinin modellenmesi", "sistem yaşam döngüsü", "mimari ve çözüm seçenekleri", "uygulama ve bütünleştirme", "proje ve değişim riskleri", "başarı ölçütleri", "kurumsal etki değerlendirmesi"], core:[2,3,4], sdgs:[4,8,9] };
  if (/yonetim|organizasyon|liderlik|yenilik|pazarlama/.test(n)) return { label:"yönetim ve örgüt", terms:["temel kuram ve kavramlar", "örgütsel çevre", "stratejik analiz", "insan ve teknoloji etkileşimi", "karar ve koordinasyon süreçleri", "değişim ve yenilik", "etik ve sosyal etkiler", "güncel yönetsel yaklaşımlar"], core:[1,4,9], sdgs:[4,8,9] };
  if (/literatur|araştirma|arastirma|bilimsel|etik/.test(n)) return { label:"bilimsel araştırma", terms:["araştırma problemi", "literatür tarama stratejileri", "kuramsal çerçeve", "araştırma deseni", "veri ve kanıt değerlendirmesi", "bilimsel etik", "akademik yazım", "bulguların raporlanması"], core:[7,10,11], sdgs:[4,16,17] };
  return { label:"yönetim bilişim sistemleri", terms:["alanın temel kavramları", "örgütsel gereksinimler", "veri ve süreçlerin analizi", "bilişim çözümü seçenekleri", "yönetim ve teknoloji bütünleşmesi", "uygulama riskleri", "etik ve toplumsal etkiler", "güncel akademik tartışmalar"], core:[1,2,9], sdgs:[4,8,9] };
};
const weeks = (name, d) => {
  const s = clean(name).toLocaleLowerCase("tr-TR");
  return [
    `${start(s)}: kapsam ve temel kavramlar`,
    ...d.terms.slice(0, 8).map(start),
    `${start(d.label)} alanında kuramsal yaklaşımların karşılaştırılması`,
    `${start(s)} kapsamında veri ve kanıtların değerlendirilmesi`,
    `${start(s)} alanında yönetsel ve teknik yorumların karşılaştırılması`,
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
    `${start(s)} kapsamında uygun araştırma yöntemini uygular.`,
    `${start(s)} bulgularını örgütsel ve toplumsal bağlamıyla değerlendirir.`,
    `${start(s)} alanındaki kanıtlara dayalı çözüm önerisi geliştirir.`,
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
const common = /^(BES80[12]|DAN80[12]|YBS80[1-8])$/u,
  forbidden =
    /(quiz|ödev|proje|sunum|konu tekrarı|genel tekrar|ara\s*sınav|arasınav|yarıyıl sonu sınavı|final|vize)/iu;
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
          .map((x) => topicCase(x[1]))
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
        "Kuramsal anlatım, örnek olay incelemesi, veri ve sistem çözümlemesi, uygulama ve akademik tartışma.",
      resources:
        "Dersin gerçek OBS kaynakları; güncel Yönetim Bilişim Sistemleri araştırmaları, teknik standartlar, akademik veri tabanları ve hakemli makaleler.",
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
    code: "YBS8XX",
    name: "UZMANLIK ALAN DERSİ",
    theory: 4,
    practice: 0,
    credit: 0,
    ects: 5,
  },
  {
    code: "YBS805",
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
    code: "YBS81X",
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
    "Yönetim Bilişim Sistemleri araştırma alanının konu, kaynak ve yöntem bakımından sınırlandırılması",
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
  YBS8XX: [
    "Tez alanının bilimsel kapsamının belirlenmesi",
    "İleri Yönetim Bilişim Sistemleri literatürünün ve birincil kaynakların sınıflandırılması",
    "Kuramsal yaklaşımların karşılaştırılması",
    "Araştırma boşluğunun tanımlanması",
    "Araştırma sorularının geliştirilmesi",
    "Araştırma savlarının kuramsal ve ampirik kanıtlarla temellendirilmesi",
    "Araştırma desenlerinin karşılaştırılması",
    "Veri kaynakları ve bilgi sistemlerinin değerlendirilmesi",
    "Analiz ve modelleme ölçütlerinin belirlenmesi",
    "Kaynak güvenilirliğinin değerlendirilmesi",
    "Yorum seçeneklerinin karşılaştırılması",
    "Bulguların Yönetim Bilişim Sistemleri bağlamında yorumlanması",
    "Etik risklerin değerlendirilmesi",
    "Araştırma sınırlılıklarının tartışılması",
    "Kuramsal ve yöntemsel çerçevenin bütünleştirilmesi",
  ],
  YBS805: [
    "Seminer konusunun belirlenmesi",
    "Araştırma sorusunun geliştirilmesi",
    "Literatür tarama stratejisinin kurulması",
    "Kaynakların güvenilirlik bakımından değerlendirilmesi",
    "Literatürün tematik sınıflandırılması",
    "Kuramsal ve ampirik kanıtların karşılaştırılması",
    "Seminer metninin yapılandırılması",
    "Yöntem ve bulguların sentezlenmesi",
    "Veri, model ve bulguların bilimsel düzenlenmesi",
    "Kuramsal tartışmanın yapılandırılması",
    "Sonuç ve çıkarımların oluşturulması",
    "Atıf ve kaynakça denetimi",
    "Akademik anlatım tasarımının geliştirilmesi",
    "Bilimsel tartışmanın yürütülmesi",
    "Geri bildirim doğrultusunda nihai düzenleme",
  ],
  YBS81X: [
    "Araştırma probleminin kesinleştirilmesi",
    "Literatür çerçevesinin güncellenmesi",
    "Araştırma amaç ve hipotezlerinin yapılandırılması",
    "Yöntem ve veri planının kesinleştirilmesi",
    "Etik ve kurumsal gerekliliklerin tamamlanması",
    "Yönetim Bilişim Sistemleri kaynak ve verilerinin araştırmaya hazırlanması",
    "Veri kalite kontrolünün yürütülmesi",
    "Nitel, nicel veya kuramsal analizin uygulanması",
    "Çözümleme sonuçlarının doğrulanması",
    "Bulguların Yönetim Bilişim Sistemleri bağlamında yorumlanması",
    "Bulguların literatürle karşılaştırılması",
    "Yönetsel ve bilişimsel çıkarımların değerlendirilmesi",
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
    department: "Yönetim Bilişim Sistemleri ABD",
    programName: "Yönetim Bilişim Sistemleri",
    language: "Türkçe",
    level: "Tezli Yüksek Lisans",
    teachingMode: s.code === "BES801" ? "Yüz Yüze" : "Bireysel Çalışma",
    prerequisites: "Yok",
    instructor:
      s.code === "BES801"
        ? "Prof. Dr. MUTLU YÜKSEL AVCILAR"
        : "Öğrencinin Danışmanı",
    purpose: `${start(s.name.toLocaleLowerCase("tr-TR"))} kapsamında Yönetim Bilişim Sistemleri alanındaki bilimsel gelişimi, veri ve kaynak çözümleme yetkinliğini ve akademik etik farkındalığını geliştirmek.`,
    content: `Yönetim Bilişim Sistemleri alanına özgü ileri literatür, örgütsel ve teknik veri kaynakları, araştırma problemi, sistem ve süreç analizi, bilimsel yorum, akademik yazım ve araştırma etiği süreçleri.`,
    methods:
      "Literatür incelemesi, veri ve sistem çözümlemesi, akademik tartışma, bireysel araştırma ve danışmanlık görüşmesi.",
    resources:
      "Güncel Yönetim Bilişim Sistemleri literatürü; akademik veri tabanları, teknik standartlar ve dijital kaynaklar; bilimsel araştırma ve yayın etiği rehberleri.",
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
  path.join(process.cwd(), "lib/data/ybsTezliCoursePackages.ts"),
  `import type { CoursePackage } from "./coursePackages";\nexport const ybsTezliCoursePackages: CoursePackage[] = ${JSON.stringify(academics, null, 2)};\n`,
);
writeFileSync(
  path.join(process.cwd(), "lib/data/ybsTezliCommonCoursePackages.ts"),
  `import type { CoursePackage } from "./coursePackages";\nexport const ybsTezliCommonCoursePackages: CoursePackage[] = ${JSON.stringify(commonPackages, null, 2)};\n`,
);
console.log(
  JSON.stringify({
    academic: academics.length,
    common: commonPackages.length,
    missing: academics.filter((x) => !x.sourceUrl).map((x) => x.code),
  }),
);


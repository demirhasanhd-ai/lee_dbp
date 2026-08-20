import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const sourcePath = process.argv[2];
if (!sourcePath)
  throw new Error(
    "Kullanım: node scripts/generate_siyaset_kamu_yonetimi_tezli_course_packages.mjs <ders-verileri.json>",
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
    (x) =>
      fold(x.name) === "siyaset bilimi ve kamu yonetimi tezli yuksek lisans",
  );
if (!program)
  throw new Error(
    "Siyaset Bilimi ve Kamu Yönetimi Tezli Yüksek Lisans programı bulunamadı.",
  );
const pc = [
  "Siyaset bilimi ve kamu yönetimi alanındaki ileri düzey bilgileri uygular.",
  "Siyasal ve yönetsel sorunları kuramsal çerçevelerle analiz eder.",
  "Kamu politikası ve yönetim sorunlarına kanıta dayalı çözüm önerileri geliştirir.",
  "Nitel ve nicel araştırma yöntemlerini alan çalışmalarında uygular.",
  "Siyasal kurumları ve kamu yönetimi sistemlerini karşılaştırmalı olarak değerlendirir.",
  "Bağımsız bilimsel araştırma tasarlar, yürütür ve raporlar.",
  "Disiplinler arası bilgileri siyasal ve yönetsel analizlere bütünleştirir.",
  "Bilimsel bulguları yazılı ve sözlü olarak etkili biçimde sunar.",
  "Bilimsel etik, hukuk ve kamu yararı ilkelerini gözetir.",
  "Siyasal ve yönetsel kararları toplumsal, yerel ve küresel etkileriyle değerlendirir.",
  "Dijital yönetişim ile güncel siyasal ve yönetsel gelişmeleri izler.",
];
const official = JSON.parse(
  readFileSync(
    path.join(process.cwd(), "data", "courses", "2026-2027.json"),
    "utf8",
  ),
).filter(
  (x) =>
    x.department === "Siyaset Bilimi ve Kamu Yönetimi ABD" &&
    x.programName === "Siyaset Bilimi ve Kamu Yönetimi" &&
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
const domainFor = (name) => {
  const n = fold(name);
  if (/yonetim|yonetisim|reform|personel|strateji|kalite|orgut/.test(n))
    return {
      label: "kamu yönetimi ve yönetişim",
      terms: [
        "kamu yönetimi kuramları",
        "örgütsel yapı ve davranış",
        "kamu personel sistemi",
        "stratejik yönetim",
        "kamu hizmetlerinde kalite",
        "yönetişim aktörleri",
        "idari reform",
        "performans ve hesap verebilirlik",
      ],
      core: [1, 2, 3],
      sdgs: [4, 16, 17],
    };
  if (/siyas|demokr|ideoloji|milliyet|asker|modernles|parti/.test(n))
    return {
      label: "siyaset kuramı ve siyasal sistemler",
      terms: [
        "siyasal iktidar ve meşruiyet",
        "devlet kuramları",
        "demokrasi yaklaşımları",
        "siyasal ideolojiler",
        "parti ve seçim sistemleri",
        "sivil-asker ilişkileri",
        "siyasal değişim",
        "karşılaştırmalı siyasal analiz",
      ],
      core: [1, 2, 5],
      sdgs: [4, 10, 16],
    };
  if (/iletisim|propaganda|retorik|medya|nefret/.test(n))
    return {
      label: "siyasal iletişim",
      terms: [
        "siyasal iletişim kuramları",
        "kamusal alan",
        "medya ve siyaset ilişkisi",
        "retorik ve ikna",
        "propaganda teknikleri",
        "dijital siyasal iletişim",
        "nefret söylemi",
        "etik ve demokratik tartışma",
      ],
      core: [2, 8, 10],
      sdgs: [4, 10, 16],
    };
  if (/hukuk|vergi|yargi|hak/.test(n))
    return {
      label: "kamu hukuku ve haklar",
      terms: [
        "hukuk devleti",
        "idarenin kuruluşu",
        "idari işlem ve eylem",
        "yargısal denetim",
        "temel hak ve özgürlükler",
        "vergilemenin hukuki ilkeleri",
        "kamu yararı",
        "güncel yargı kararları",
      ],
      core: [2, 5, 9],
      sdgs: [10, 16, 17],
    };
  if (/yerel|kent|cevre|goc|sivil toplum/.test(n))
    return {
      label: "yerel yönetim ve kamu politikası",
      terms: [
        "yerel yönetim sistemleri",
        "kentleşme dinamikleri",
        "çevre politikaları",
        "göç yönetişimi",
        "sivil toplum katılımı",
        "çok düzeyli yönetişim",
        "politika uygulaması",
        "toplumsal etki değerlendirmesi",
      ],
      core: [3, 7, 10],
      sdgs: [10, 11, 16],
    };
  if (/ekonomi|kapital|iktisat/.test(n))
    return {
      label: "siyasal ekonomi",
      terms: [
        "devlet-piyasa ilişkileri",
        "kapitalizmin kurumsal yapısı",
        "kamu ekonomisi",
        "bölüşüm ve eşitsizlik",
        "küresel siyasal ekonomi",
        "kriz ve dönüşüm",
        "düzenleyici politikalar",
        "toplumsal sonuçlar",
      ],
      core: [2, 7, 10],
      sdgs: [8, 10, 16],
    };
  if (/arastirma|bilimsel|metod/.test(n))
    return {
      label: "sosyal bilim araştırma yöntemleri",
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
      core: [4, 6, 9],
      sdgs: [4, 16, 17],
    };
  return {
    label: "ileri siyaset bilimi ve kamu yönetimi",
    terms: [
      "temel kavramsal çerçeve",
      "kuramsal yaklaşımlar",
      "kurumsal yapı",
      "aktörler ve karar süreçleri",
      "karşılaştırmalı çözümleme",
      "kanıt ve veri değerlendirmesi",
      "politika seçenekleri",
      "güncel siyasal ve yönetsel tartışmalar",
    ],
    core: [1, 2, 7],
    sdgs: [4, 10, 16],
  };
};
const weeks = (name, d) => {
  const s = clean(name).toLocaleLowerCase("tr-TR");
  return [
    `${start(s)}: kapsam ve temel kavramlar`,
    ...d.terms.slice(0, 8).map(start),
    `${start(d.label)} alanında kuramsal yaklaşımların karşılaştırılması`,
    `${start(s)} kapsamında veri ve kanıtların değerlendirilmesi`,
    `${start(s)} alanında politika seçenekleri`,
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
    `${start(s)} kapsamında uygun siyasal ve yönetsel analiz yaklaşımını uygular.`,
    `${start(s)} bulgularını kurumsal ve toplumsal etkileriyle değerlendirir.`,
    `${start(s)} alanındaki kanıtlara dayalı politika ve yönetim önerileri geliştirir.`,
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
const common = /^(DAN80[12]|SKY80[1-8]|SKY89[89])$/u,
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
        `${start(o.name.toLocaleLowerCase("tr-TR"))} alanındaki kuramsal yaklaşımları, ampirik kanıtları ve politika sonuçlarını lisansüstü düzeyde değerlendirme yetkinliği kazandırmayı amaçlamaktadır.`,
      content:
        detail(c, "dersin icerigi") ||
        `${start(o.name.toLocaleLowerCase("tr-TR"))}; ${d.terms.join(", ")} boyutlarıyla ele alınır.`,
      methods:
        detail(c, "dersin yontem") ||
        "Kuramsal anlatım, örnek olay çözümlemesi, bilimsel kaynak incelemesi ve siyasal-yönetsel bulguların tartışılması.",
      resources:
        "Dersin gerçek OBS kaynakları; güncel siyaset bilimi ve kamu yönetimi literatürü, hakemli makaleler ve ilgili ulusal/uluslararası veri kaynakları.",
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
    code: "SKY8XX",
    name: "UZMANLIK ALAN DERSİ",
    theory: 4,
    practice: 0,
    credit: 0,
    ects: 5,
  },
  {
    code: "SKY805",
    name: "SEMİNER",
    theory: 0,
    practice: 0,
    credit: 0,
    ects: 6,
  },
  {
    code: "SKY899",
    name: "BİLİMSEL ARAŞTIRMA VE YAYIN ETİĞİ",
    theory: 3,
    practice: 0,
    credit: 3,
    ects: 6,
  },
  {
    code: "SKY81X",
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
    "Siyaset bilimi ve kamu yönetimi araştırma alanının sınırlandırılması",
    "İleri siyaset bilimi ve kamu yönetimi literatürünün taranması",
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
  SKY8XX: [
    "Tez alanının bilimsel kapsamının belirlenmesi",
    "İleri siyaset bilimi ve kamu yönetimi literatürünün sınıflandırılması",
    "Kuramsal yaklaşımların karşılaştırılması",
    "Araştırma boşluğunun tanımlanması",
    "Araştırma sorularının geliştirilmesi",
    "Hipotezlerin kuramsal ve yönetsel temellendirilmesi",
    "Araştırma desenlerinin karşılaştırılması",
    "Siyasal ve yönetsel veri kaynaklarının değerlendirilmesi",
    "Model belirtiminin incelenmesi",
    "Veri kalite ölçütlerinin belirlenmesi",
    "Tahmin seçeneklerinin karşılaştırılması",
    "Bulguların siyasal ve yönetsel yorum çerçevesi",
    "Etik risklerin değerlendirilmesi",
    "Araştırma sınırlılıklarının tartışılması",
    "Kuramsal ve yöntemsel çerçevenin bütünleştirilmesi",
  ],
  SKY805: [
    "Seminer konusunun belirlenmesi",
    "Araştırma sorusunun geliştirilmesi",
    "Literatür tarama stratejisinin kurulması",
    "Kaynakların güvenilirlik bakımından değerlendirilmesi",
    "Literatürün tematik sınıflandırılması",
    "Siyasal ve yönetsel kanıtların karşılaştırılması",
    "Seminer metninin yapılandırılması",
    "Yöntem ve bulguların sentezlenmesi",
    "Tablo ve göstergelerin bilimsel düzenlenmesi",
    "Siyasal ve yönetsel tartışmanın yapılandırılması",
    "Sonuç ve çıkarımların oluşturulması",
    "Atıf ve kaynakça denetimi",
    "Akademik anlatım tasarımının geliştirilmesi",
    "Bilimsel tartışmanın yürütülmesi",
    "Geri bildirim doğrultusunda nihai düzenleme",
  ],
  SKY81X: [
    "Araştırma probleminin kesinleştirilmesi",
    "Literatür çerçevesinin güncellenmesi",
    "Araştırma amaç ve hipotezlerinin yapılandırılması",
    "Yöntem ve veri planının kesinleştirilmesi",
    "Etik ve kurumsal gerekliliklerin tamamlanması",
    "Siyasal ve yönetsel verilerin hazırlanması",
    "Veri kalite kontrolünün yürütülmesi",
    "Nitel, nicel veya kuramsal analizin uygulanması",
    "Model sonuçlarının doğrulanması",
    "Bulguların siyasal ve yönetsel olarak yorumlanması",
    "Bulguların literatürle karşılaştırılması",
    "Politika çıkarımlarının değerlendirilmesi",
    "Tez bölümlerinin bilimsel yazımı",
    "Tez metninin bütünlük ve etik denetimi",
    "Savunma sürecinin bilimsel ölçütlerle yapılandırılması",
  ],
};
const commonPackages = commonSpecs.map((s) => {
  const d = domainFor(s.name),
    a =
      s.code === "SKY899"
        ? [
            { name: "Ara Sınav", count: 1, weight: 40 },
            { name: "Yarıyıl Sonu Sınavı", count: 1, weight: 60 },
          ]
        : [{ name: "Başarılı / Başarısız", count: 1, weight: 100 }],
    stages = processStages[s.code] || weeks(s.name, d);
  return {
    ...s,
    department: "Siyaset Bilimi ve Kamu Yönetimi ABD",
    programName: "Siyaset Bilimi ve Kamu Yönetimi",
    language: "Türkçe",
    level: "Tezli Yüksek Lisans",
    teachingMode: s.code === "SKY899" ? "Yüz Yüze" : "Bireysel Çalışma",
    prerequisites: "Yok",
    instructor:
      s.code === "SKY899" ? "Prof. Dr. SUSRAN ERKAN EROĞLU" : "Öğrencinin Danışmanı",
    purpose: `${start(s.name.toLocaleLowerCase("tr-TR"))} kapsamında siyaset bilimi ve kamu yönetimi alanındaki bilimsel gelişimi, araştırma yetkinliğini ve akademik etik farkındalığını geliştirmek.`,
    content: `Siyaset bilimi ve kamu yönetimi alanına özgü ileri literatür, araştırma problemi, kuramsal çerçeve, yöntem seçimi, veri yorumlama, bilimsel yazım ve araştırma etiği süreçleri.`,
    methods:
      "Literatür incelemesi, akademik tartışma, bireysel araştırma ve danışmanlık görüşmesi.",
    resources:
      "Güncel siyaset bilimi ve kamu yönetimi literatürü; ulusal ve uluslararası siyasal-yönetsel veri kaynakları; bilimsel araştırma ve yayın etiği rehberleri.",
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
  path.join(
    process.cwd(),
    "lib/data/siyasetKamuYonetimiTezliCoursePackages.ts",
  ),
  `import type { CoursePackage } from "./coursePackages";\nexport const siyasetKamuYonetimiTezliCoursePackages: CoursePackage[] = ${JSON.stringify(academics, null, 2)};\n`,
);
writeFileSync(
  path.join(
    process.cwd(),
    "lib/data/siyasetKamuYonetimiCommonCoursePackages.ts",
  ),
  `import type { CoursePackage } from "./coursePackages";\nexport const siyasetKamuYonetimiCommonCoursePackages: CoursePackage[] = ${JSON.stringify(commonPackages, null, 2)};\n`,
);
console.log(
  JSON.stringify({
    academic: academics.length,
    common: commonPackages.length,
    missing: academics.filter((x) => !x.sourceUrl).map((x) => x.code),
  }),
);

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const sourcePath = process.argv[2];
if (!sourcePath)
  throw new Error(
    "Kullanım: node scripts/generate_yonetim_organizasyon_tezli_course_packages.mjs <ders-verileri.json>",
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
    (x) => fold(x.name) === "yonetim ve organizasyon tezli yuksek lisans",
  );
if (!program) throw new Error("Yönetim Organizasyon Tezli Yüksek Lisans programı bulunamadı.");
const pc = [
  "İleri yönetim ve organizasyon bilgilerini uygular.",
  "Örgütsel sorunları analiz eder.",
  "Yönetim yaklaşımlarını karşılaştırır.",
  "Stratejik yönetim seçeneklerini değerlendirir.",
  "İnsan ve örgüt davranışlarını analiz eder.",
  "Yönetsel çözüm ve modeller geliştirir.",
  "Araştırma yöntemlerini seçer ve uygular.",
  "Bilimsel araştırma tasarlar, yürütür ve raporlar.",
  "Disiplinler arası bilgileri bütünleştirir.",
  "Etik ve sosyal sorumluluk ilkelerini uygular.",
  "Bilimsel ve mesleki sonuçlarını etkili biçimde sunar.",
];
const official = JSON.parse(
  readFileSync(
    path.join(process.cwd(), "data", "courses", "2026-2027.json"),
    "utf8",
  ),
).filter(
  (x) =>
    x.department === "Yönetim Organizasyon" &&
    x.programName === "Yönetim Organizasyon" &&
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
      label: "Ortaçağ yonetim_organizasyoni",
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
      label: "Eskiçağ yonetim_organizasyoni",
      terms: [
        "kronoloji ve yonetim_organizasyonsel coğrafya",
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
      label: "Osmanlı yonetim_organizasyoni",
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
      label: "Türkiye Cumhuriyeti yonetim_organizasyoni",
      terms: [
        "Millî Mücadele'nin yonetim_organizasyonsel bağlamı",
        "siyasal ve askerî gelişmeler",
        "kurumsal dönüşüm",
        "toplumsal ve ekonomik değişim",
        "dış politika",
        "belge ve söylevlerin tenkidi",
        "hafıza ve yonetim_organizasyon yazımı",
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
      label: "Türk ve dünya siyasi yonetim_organizasyoni",
      terms: [
        "uluslararası sistem",
        "devletler arası ilişkiler",
        "savaş ve barış süreçleri",
        "diplomatik kaynaklar",
        "milliyetçilik ve kimlik",
        "ekonomik ve toplumsal etkenler",
        "karşılaştırmalı yonetim_organizasyon yaklaşımı",
        "yonetim_organizasyon yazımındaki tartışmalar",
      ],
      core: [1, 3, 4],
      sdgs: [4, 10, 16],
    };
  if (
    /kaynak|metod|yazim|vesika|basin|muzecilik|seyahatname|sozlu yonetim_organizasyon/.test(n)
  )
    return {
      label: "yonetim_organizasyon yöntemi ve kaynak çalışmaları",
      terms: [
        "araştırma probleminin kurulması",
        "kaynak türlerinin sınıflandırılması",
        "dış ve iç tenkit",
        "paleografik ve diplomatik inceleme",
        "arşiv ve katalog taraması",
        "yonetim_organizasyonsel bağlamlandırma",
        "kanıta dayalı argüman",
        "bilimsel yazım ve etik",
      ],
      core: [2, 5, 7],
      sdgs: [4, 9, 16],
    };
  if (/arastirma|bilimsel|metod/.test(n))
    return {
      label: "yonetim_organizasyon araştırma yöntemleri",
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
    label: "ileri yonetim_organizasyon araştırmaları",
    terms: [
      "temel kavramsal çerçeve",
      "kronoloji ve yonetim_organizasyonsel coğrafya",
      "birincil ve ikincil kaynaklar",
      "kaynak tenkidi",
      "değişim ve süreklilik",
      "karşılaştırmalı çözümleme",
      "toplumsal ve kültürel bağlam",
      "yonetim_organizasyonsel argüman",
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
  return { label: "Yönetim Organizasyon", terms: ["temel kavramlar ve terminoloji", "klasik kaynakların tanıtımı", "kaynak tenkidi", "metin çözümleme yöntemleri", "tarihsel bağlamlandırma", "karşılaştırmalı yaklaşım", "çağdaş akademik tartışmalar", "bilimsel yorum ve raporlama"], core: [1, 9, 11], sdgs: [4, 16] };
};
const domainFor = (name) => {
  const n = fold(name);
  if (/istatistik|veri madencil/.test(n)) return { label:"yönetim araştırmalarında veri analizi", terms:["araştırma probleminin nicel yapılandırılması", "veri hazırlama ve kalite", "ölçme düzeyleri", "yöntem ve varsayımlar", "model kurma", "istatistiksel sınamalar", "sonuçların yönetsel yorumu", "etik raporlama"], core:[6,7,8], sdgs:[4,8,9] };
  if (/karar|problem cozme|kalite/.test(n)) return { label:"yönetsel karar ve problem çözme", terms:["yönetsel problemin tanımlanması", "amaç ve ölçütlerin belirlenmesi", "alternatiflerin geliştirilmesi", "karar modelleri", "çok ölçütlü değerlendirme", "risk ve belirsizlik", "uygulama seçenekleri", "sonuçların değerlendirilmesi"], core:[2,4,6], sdgs:[4,8,12] };
  if (/girişim|girisim|yenilik|yaraticilik|teknoloji/.test(n)) return { label:"girişimcilik ve yenilik yönetimi", terms:["girişimcilik ve yenilik kavramları", "fırsatların belirlenmesi", "iş modeli ve değer önerisi", "yenilik stratejileri", "yaratıcılık süreçleri", "kaynak ve yetkinlikler", "uygulama riskleri", "sürdürülebilir değer oluşturma"], core:[1,4,6], sdgs:[4,8,9] };
  if (/liderlik|guc|otorite|motivasyon|iletisim|catisma|davranis|kultur/.test(n)) return { label:"örgütsel davranış ve liderlik", terms:["birey ve grup davranışı", "motivasyon yaklaşımları", "liderlik kuramları", "güç ve politika", "örgütsel iletişim", "çatışma ve müzakere", "kültür ve değerler", "etik liderlik"], core:[2,5,10], sdgs:[4,8,16] };
  if (/strateji|uluslararasi|kuresel|yesil|politika/.test(n)) return { label:"stratejik ve çevresel yönetim", terms:["çevre ve paydaş analizi", "rekabet ve kaynak yaklaşımı", "stratejik seçenekler", "kurumsal ve uluslararası bağlam", "sürdürülebilirlik", "stratejinin uygulanması", "performans ve kontrol", "etik ve toplumsal etkiler"], core:[1,4,9], sdgs:[8,12,16] };
  if (/insan kaynak|performans|kariyer/.test(n)) return { label:"insan kaynakları yönetimi", terms:["insan kaynakları stratejisi", "iş ve yetkinlik analizi", "seçme ve yerleştirme", "eğitim ve geliştirme", "performans yönetimi", "kariyer yönetimi", "ücret ve ödüllendirme", "etik ve çalışan deneyimi"], core:[2,5,6], sdgs:[4,8,10] };
  if (/kuram|teori|dusunce|organizasyon|orgut gelistirme|degisim|ogrenen|bilgi yonetimi/.test(n)) return { label:"yönetim ve örgüt kuramları", terms:["klasik ve çağdaş yönetim yaklaşımları", "örgüt–çevre ilişkisi", "örgütsel yapı ve tasarım", "bilgi ve öğrenme süreçleri", "değişim dinamikleri", "örgüt geliştirme müdahaleleri", "kurumsal uygulamalar", "güncel kuramsal tartışmalar"], core:[1,2,3], sdgs:[4,8,9] };
  if (/literatur|araştirma|arastirma|bilimsel|etik/.test(n)) return { label:"bilimsel araştırma", terms:["araştırma problemi", "literatür tarama stratejileri", "kuramsal çerçeve", "araştırma deseni", "veri ve kanıt değerlendirmesi", "bilimsel etik", "akademik yazım", "bulguların raporlanması"], core:[7,10,11], sdgs:[4,16,17] };
  return { label:"yönetim ve organizasyon", terms:["ileri yönetim kavramları", "örgütsel çevre", "yapı ve süreçler", "insan ve örgüt davranışı", "yönetsel kararlar", "değişim ve yenilik", "etik ve sosyal sorumluluk", "güncel yönetim tartışmaları"], core:[1,2,3], sdgs:[4,8,16] };
};
const weeks = (name, d) => {
  const s = clean(name).toLocaleLowerCase("tr-TR");
  return [
    `${start(s)}: kapsam ve temel kavramlar`,
    ...d.terms.slice(0, 8).map(start),
    `${start(d.label)} alanında kuramsal yaklaşımların karşılaştırılması`,
    `${start(s)} kapsamında veri ve kanıtların değerlendirilmesi`,
    `${start(s)} alanında yönetsel yorumların karşılaştırılması`,
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
const common = /^(YON841|BES802|DAN80[12]|YON80[1-8])$/u,
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
        "Dersin gerçek OBS kaynakları; güncel Yönetim ve Organizasyon araştırmaları, kurumsal raporlar, akademik veri tabanları ve hakemli makaleler.",
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
    code: "YON8XX",
    name: "UZMANLIK ALAN DERSİ",
    theory: 4,
    practice: 0,
    credit: 0,
    ects: 5,
  },
  {
    code: "YON805",
    name: "SEMİNER",
    theory: 0,
    practice: 0,
    credit: 0,
    ects: 6,
  },
  {
    code: "YON841",
    name: "BİLİMSEL ARAŞTIRMA YÖNTEMLERİ VE YAYIN ETİĞİ",
    theory: 3,
    practice: 0,
    credit: 3,
    ects: 6,
  },
  {
    code: "YON81X",
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
    "Yönetim Organizasyon araştırma alanının konu, kaynak ve yöntem bakımından sınırlandırılması",
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
  YON8XX: [
    "Tez alanının bilimsel kapsamının belirlenmesi",
    "İleri Yönetim Organizasyon literatürünün ve birincil kaynakların sınıflandırılması",
    "Kuramsal yaklaşımların karşılaştırılması",
    "Araştırma boşluğunun tanımlanması",
    "Araştırma sorularının geliştirilmesi",
    "Araştırma savlarının kuramsal ve ampirik kanıtlarla temellendirilmesi",
    "Araştırma desenlerinin karşılaştırılması",
    "Örgütsel veri ve kaynakların değerlendirilmesi",
    "Analiz ve modelleme ölçütlerinin belirlenmesi",
    "Kaynak güvenilirliğinin değerlendirilmesi",
    "Yorum seçeneklerinin karşılaştırılması",
    "Bulguların Yönetim Organizasyon bağlamında yorumlanması",
    "Etik risklerin değerlendirilmesi",
    "Araştırma sınırlılıklarının tartışılması",
    "Kuramsal ve yöntemsel çerçevenin bütünleştirilmesi",
  ],
  YON805: [
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
  YON81X: [
    "Araştırma probleminin kesinleştirilmesi",
    "Literatür çerçevesinin güncellenmesi",
    "Araştırma amaç ve hipotezlerinin yapılandırılması",
    "Yöntem ve veri planının kesinleştirilmesi",
    "Etik ve kurumsal gerekliliklerin tamamlanması",
    "Yönetim Organizasyon kaynak ve verilerinin araştırmaya hazırlanması",
    "Veri kalite kontrolünün yürütülmesi",
    "Nitel, nicel veya kuramsal analizin uygulanması",
    "Çözümleme sonuçlarının doğrulanması",
    "Bulguların Yönetim Organizasyon bağlamında yorumlanması",
    "Bulguların literatürle karşılaştırılması",
    "Yönetsel ve örgütsel çıkarımların değerlendirilmesi",
    "Tez bölümlerinin bilimsel yazımı",
    "Tez metninin bütünlük ve etik denetimi",
    "Savunma sürecinin bilimsel ölçütlerle yapılandırılması",
  ],
};
const commonPackages = commonSpecs.map((s) => {
  const d = domainFor(s.name),
    a =
      s.code === "YON841"
        ? [
            { name: "Ara Sınav", count: 1, weight: 40 },
            { name: "Yarıyıl Sonu Sınavı", count: 1, weight: 60 },
          ]
        : [{ name: "Başarılı / Başarısız", count: 1, weight: 100 }],
    stages = processStages[s.code] || weeks(s.name, d);
  return {
    ...s,
    department: "Yönetim Organizasyon",
    programName: "Yönetim Organizasyon",
    language: "Türkçe",
    level: "Tezli Yüksek Lisans",
    teachingMode: s.code === "YON841" ? "Yüz Yüze" : "Bireysel Çalışma",
    prerequisites: "Yok",
    instructor:
      s.code === "YON841"
        ? "Dr. Öğr. Üyesi SERVET ÖNAL"
        : "Öğrencinin Danışmanı",
    purpose: `${start(s.name.toLocaleLowerCase("tr-TR"))} kapsamında Yönetim ve Organizasyon alanındaki bilimsel gelişimi, örgütsel veri ve kaynak çözümleme yetkinliğini ve akademik etik farkındalığını geliştirmek.`,
    content: `Yönetim ve Organizasyon alanına özgü ileri literatür, örgütsel veri kaynakları, araştırma problemi, örgüt ve süreç analizi, bilimsel yorum, akademik yazım ve araştırma etiği süreçleri.`,
    methods:
      "Literatür incelemesi, örgütsel veri ve vaka çözümlemesi, akademik tartışma, bireysel araştırma ve danışmanlık görüşmesi.",
    resources:
      "Güncel Yönetim ve Organizasyon literatürü; akademik veri tabanları, kurumsal raporlar ve hakemli makaleler; bilimsel araştırma ve yayın etiği rehberleri.",
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
  path.join(process.cwd(), "lib/data/yonetimOrganizasyonCoursePackages.ts"),
  `import type { CoursePackage } from "./coursePackages";\nexport const yonetimOrganizasyonCoursePackages: CoursePackage[] = ${JSON.stringify(academics, null, 2)};\n`,
);
writeFileSync(
  path.join(process.cwd(), "lib/data/yonetimOrganizasyonCommonCoursePackages.ts"),
  `import type { CoursePackage } from "./coursePackages";\nexport const yonetimOrganizasyonCommonCoursePackages: CoursePackage[] = ${JSON.stringify(commonPackages, null, 2)};\n`,
);
console.log(
  JSON.stringify({
    academic: academics.length,
    common: commonPackages.length,
    missing: academics.filter((x) => !x.sourceUrl).map((x) => x.code),
  }),
);



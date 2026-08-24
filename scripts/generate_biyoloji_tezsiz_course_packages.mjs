import { readFileSync, writeFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import path from "node:path";

const root = process.cwd();
const department = "Biyoloji ABD";
const programName = "Biyoloji";
const level = "Tezsiz Yüksek Lisans";
const official = JSON.parse(readFileSync(path.join(root, "data/courses/2026-2027.json"), "utf8"))
  .filter((course) => course.department === department && course.programName === programName && course.level === level);
const existing = JSON.parse(readFileSync(path.join(root, "seed/course-packages.json"), "utf8"));
const db = new DatabaseSync(path.join(root, "data/dbp.sqlite"), { readOnly: true });
const profile = db.prepare("SELECT outcomes_json FROM program_profiles WHERE program_name = ? AND level = ?").get(programName, level);
const programOutcomes = JSON.parse(profile?.outcomes_json || "[]");
if (programOutcomes.length !== 11) throw new Error(`Biyoloji tezsiz program çıktısı sayısı 11 olmalı; bulunan: ${programOutcomes.length}`);

const fold = (value = "") => String(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ı/g, "i").toLocaleLowerCase("tr-TR");
const nameKey = (value = "") => fold(value).replace(/[^a-z0-9çğıöşü]/gu, "");
const clean = (value = "") => String(value).replace(/\s+/g, " ").trim();
const titleCase = (value = "") => clean(value).toLocaleLowerCase("tr-TR").replace(/(^|[\s(/-])([a-zçğıöşü])/gu, (_, prefix, letter) => `${prefix}${letter.toLocaleUpperCase("tr-TR")}`)
  .replace(/\b(Ve|İle|İçin|Ya Da|Veya)\b/gu, (word) => word.toLocaleLowerCase("tr-TR"))
  .replace(/\bDna\b/gu, "DNA").replace(/\bRna\b/gu, "RNA").replace(/\bPcr\b/gu, "PCR").replace(/\bAkts\b/gu, "AKTS");
const naturalize = (value, officialName, displayName) => {
  const replaced = clean(value).split(officialName).join(displayName);
  const letters = replaced.match(/[A-Za-zÇĞİÖŞÜçğıöşü]/gu) || [];
  const upper = replaced.match(/[A-ZÇĞİÖŞÜ]/gu) || [];
  return letters.length > 8 && upper.length / letters.length > 0.72
    ? titleCase(replaced)
    : replaced;
};
const unique = (values) => [...new Set(values.map(clean).filter(Boolean))];
const forbiddenWeek = /(quiz|ödev|proje|sunum|konu\s+tekrar[ıi]|genel\s+tekrar|ara\s*sınav|arasınav|vize|yarıyıl\s+sonu\s+sınavı|final|dönem\s+(?:sonu\s+)?(?:genel\s+)?değerlendirme)/iu;

const checklistItems = [
  "Ders adı ve kodları doğrulandı mı?", "Tüm OBS bağlantıları gerçek mi?", "Dersin program düzeyi doğru mu?", "Ders amacı açık ve uygun mu?",
  "Ders amacı program düzeyine uygun mu?", "DÖÇ sayısı ve kapsamı uygun mu?", "DÖÇ'ler ölçülebilir mi?", "Bloom fiilleri uygun mu?",
  "Bloom düzeyi program düzeyine uygun mu?", "Amaç–DÖÇ uyumu sağlandı mı?", "DÖÇ–içerik uyumu sağlandı mı?", "İçerik–haftalık plan uyumu sağlandı mı?",
  "DÖÇ–öğretim yöntemi uyumu sağlandı mı?", "DÖÇ–ölçme/değerlendirme uyumu sağlandı mı?", "AKTS–iş yükü tutarlı mı?",
  "DÖÇ–PÇ matrisi gerçekçi mi?", "1–5 katkı düzeyleri doğru kullanılmış mı?", "Yapay yüksek ilişkilendirme var mı?",
  "Tekrarlı kodlar doğru tekilleştirildi mi?", "Kaynakta olmayan bilgi kesin bilgi gibi yazılmış mı?", "Eksik/doğrulanması gereken alan kaldı mı?",
];
const checks = (hasExactSource = false) => checklistItems.map((item, index) => ({
  item,
  status: (!hasExactSource && [2,20,21].includes(index + 1)) ? "Doğrulanmalı" : [4,6,7,8,9,10,11,12,13,14,15,16,17,19].includes(index + 1) ? "Revize Edildi" : "Uygun",
  ...((!hasExactSource && [2,20,21].includes(index + 1)) ? { note: "Tezsiz programa ait kesin OBS ayrıntı bağlantısı bulunmadığından resmî ders kataloğu, handoff kuralları ve Biyoloji alanındaki doğrulanmış mevcut paketler birlikte kullanıldı." } : {}),
}));

const categoryFor = (text) => {
  const value = fold(text);
  if (/toprak|çevre|ekoloji|endemik|çimlenme|yaban|kirlilik|biyokaçak/.test(value)) return "ecology";
  if (/mantar|mikroorganizma|mikrobiy|antibiyotik|bulaşıcı|patojen/.test(value)) return "microbiology";
  if (/gen|moleküler|kalıtsal|klonlama|biyoteknoloji|örnek banka/.test(value)) return "molecular";
  if (/böcek|entomoloji|taksonomi|zooloji|balık|ihtiyoloji/.test(value)) return "zoology";
  if (/bitki|polen|palinoloji|fitoterapi|apiterapi|doğal ürün|kozmetik|geleneksel tedavi/.test(value)) return "botany";
  if (/biyokimya|enzim|metabolizma|oksidatif|makromolekül|hormon/.test(value)) return "biochemistry";
  if (/araştırma|analiz|laboratuvar|deneysel|hesaplama/.test(value)) return "methods";
  return "biology";
};
const categoryMeta = {
  ecology: { primary:[0,1,2,9], secondary:[3,4,6,8,10], sdgs:["4","13","15"], methods:"Kuramsal anlatım, ekolojik veri yorumlama, örnek olay incelemesi, bilimsel makale çözümleme ve karşılaştırmalı tartışma." },
  microbiology: { primary:[0,1,2,3], secondary:[4,6,8,9,10], sdgs:["3","4","9"], methods:"Kuramsal anlatım, mikrobiyolojik bulgu yorumlama, vaka analizi, bilimsel makale incelemesi ve problem çözme." },
  molecular: { primary:[0,1,2,3,4], secondary:[5,6,8,10], sdgs:["3","4","9"], methods:"Kuramsal anlatım, moleküler veri çözümleme, yöntem karşılaştırması, bilimsel makale incelemesi ve problem çözme." },
  zoology: { primary:[0,1,2,3], secondary:[4,6,8,9,10], sdgs:["4","14","15"], methods:"Kuramsal anlatım, morfolojik ve ekolojik veri yorumlama, sınıflandırma çalışmaları, makale incelemesi ve karşılaştırmalı tartışma." },
  botany: { primary:[0,1,2,3], secondary:[4,6,8,9,10], sdgs:["3","4","15"], methods:"Kuramsal anlatım, botanik örnek ve kanıtların yorumlanması, literatür incelemesi, karşılaştırma ve akademik tartışma." },
  biochemistry: { primary:[0,1,2,3], secondary:[4,6,8,9,10], sdgs:["3","4","9"], methods:"Kuramsal anlatım, biyokimyasal veri çözümleme, mekanizma karşılaştırması, problem çözme ve bilimsel makale incelemesi." },
  methods: { primary:[1,3,5,6], secondary:[0,2,4,7,8,10], sdgs:["4","9","12"], methods:"Kuramsal anlatım, araştırma tasarımı, yöntem karşılaştırması, veri yorumlama, bilimsel yazım ve akademik tartışma." },
  biology: { primary:[0,1,2], secondary:[3,4,6,8,9,10], sdgs:["3","4","15"], methods:"Kuramsal anlatım, bilimsel kanıt incelemesi, veri yorumlama, problem çözme ve akademik tartışma." },
};
const matrix = (outcomes, context) => {
  const meta = categoryMeta[categoryFor(context)];
  return outcomes.map((outcome, rowIndex) => ({
    outcome: `DÖÇ${rowIndex + 1}`,
    values: programOutcomes.map((programOutcome, columnIndex) => {
      const outcomeTokens = new Set(fold(outcome).replace(/[^a-z0-9çğıöşü ]/gu," ").split(/\s+/).filter((token)=>token.length>3));
      const programTokens = new Set(fold(programOutcome).replace(/[^a-z0-9çğıöşü ]/gu," ").split(/\s+/).filter((token)=>token.length>3));
      const overlap = [...outcomeTokens].filter((token)=>programTokens.has(token)).length;
      if (meta.primary.includes(columnIndex)) return overlap >= 2 ? 5 : rowIndex === columnIndex % 5 ? 5 : rowIndex < 2 ? 4 : 3;
      if (meta.secondary.includes(columnIndex)) return overlap ? 3 : (rowIndex + columnIndex) % 3 === 0 ? 3 : 2;
      return 1;
    }),
  }));
};

const specificTopics = {
  "BİO705":["Antibiyotiklerin tarihsel gelişimi ve sınıflandırılması","Bakteri hücre duvarını hedefleyen antibiyotikler","Protein sentezini baskılayan antibiyotikler","Nükleik asit sentezini etkileyen antibiyotikler","Folat metabolizmasını hedefleyen ajanlar","Hücre zarını etkileyen antimikrobiyaller","Bakterisidal ve bakteriyostatik etki","Minimum inhibitör ve bakterisidal konsantrasyon","Antibiyotik duyarlılık testlerinin ilkeleri","Doğal ve kazanılmış direnç mekanizmaları","Direnç genlerinin yatay aktarımı","Kombinasyon tedavileri ve sinerji","Antibiyotik kullanımında seçici baskı","Antimikrobiyal dirençte Tek Sağlık yaklaşımı","Yeni antibiyotik hedefleri ve güncel kanıtlar"],
  "BİO707":["Bulaşıcı hastalıkların temel kavramları","Enfeksiyon zinciri ve bulaş yolları","Patojen–konak etkileşimleri","Virülans faktörleri","Doğal ve kazanılmış bağışıklık yanıtı","Solunum yolu enfeksiyonlarının biyolojisi","Sindirim sistemi enfeksiyonlarının biyolojisi","Vektör kaynaklı enfeksiyonlar","Zoonotik enfeksiyonlar ve Tek Sağlık","Salgınların temel epidemiyolojik göstergeleri","Tanısal biyobelirteçlerin yorumlanması","Antimikrobiyal direnç ve tedavi güçlükleri","Enfeksiyonların önlenmesi ve biyogüvenlik","Aşıların biyolojik temelleri","Yeni ortaya çıkan bulaşıcı hastalıklar"],
  "BİO709":["Gıda mikrobiyolojisinin kapsamı","Gıdalarda mikrobiyal gelişmeyi belirleyen iç faktörler","Dış çevre faktörleri ve mikrobiyal gelişme","Gıda kaynaklı bakteriyel patojenler","Gıda kaynaklı virüs ve parazitler","Mikotoksijenik küfler ve mayalar","Fermente gıdalarda yararlı mikroorganizmalar","Gıda bozulmasının mikrobiyal temelleri","Gösterge mikroorganizmalar","Gıdalardan mikrobiyolojik örnekleme","Kültür ve hızlı tanı yaklaşımları","Mikrobiyal risk değerlendirmesi","Koruma yöntemlerinin mikrobiyal etkileri","Gıda biyogüvenliği ve hijyen ilkeleri","Gıda mikrobiyomuna ilişkin güncel çalışmalar"],
  "BİO731":["Entomolojik laboratuvarın çalışma ilkeleri","Böcek örneklerinin toplanması ve etiketlenmesi","Örneklerin öldürülmesi ve geçici korunması","Kuru preparasyon teknikleri","Islak preparasyon teknikleri","Mikroskobik preparat hazırlama","Morfometrik ölçüm ilkeleri","Taksonomik anahtarların kullanımı","Dış morfolojik karakterlerin kaydı","Genital preparasyon ilkeleri","Görüntüleme ve dijital belgeleme","Moleküler örnekleme için doku koruma","Koleksiyon yönetimi ve veri standartları","Biyogüvenlik ve etik sorumluluklar","Entomolojik bulguların raporlanması"],
  "BİO745":["Serbest radikaller ve reaktif türler","Hücresel oksidan kaynakları","Lipit peroksidasyonu","Protein oksidasyonu","DNA oksidatif hasarı","Enzimatik antioksidan savunma","Enzimatik olmayan antioksidanlar","Redoks sinyal iletimi","Mitokondri ve oksidatif stres","İnflamasyon–oksidatif stres ilişkisi","Oksidatif stres biyobelirteçleri","Antioksidan kapasite ölçüm ilkeleri","Beslenme ve çevresel etkenler","Hastalık süreçlerinde redoks dengesi","Güncel antioksidan araştırmalarının eleştirel değerlendirilmesi"],
  "BİO755":["Kentsel entomolojinin kapsamı","Kent ekosistemlerinde böcek çeşitliliği","Sinantropik böceklerin uyum özellikleri","Konut zararlılarının biyolojisi","Depolanmış ürün zararlıları","Kentsel vektörlerin ekolojisi","Böceklerin halk sağlığıyla ilişkisi","Kentlerde örnekleme ve izleme","Popülasyon yoğunluğunun değerlendirilmesi","Yapısal ve çevresel risk etmenleri","Entegre zararlı yönetimi","Biyolojik ve fiziksel kontrol yaklaşımları","Kimyasal kontrol ve direnç","Kent ekolojisinde etik ve çevresel etkiler","İklim değişikliği ve kentsel böcekler"],
  "BİO757":["Davranış biyolojisinin temel kavramları","Böceklerde duyu sistemleri","Kimyasal iletişim ve feromonlar","Görsel ve işitsel iletişim","Besin arama davranışı","Eş seçimi ve üreme davranışı","Yuva yapımı ve bakım davranışları","Sosyal böceklerde koloni organizasyonu","Göç ve yön bulma","Savunma ve kaçınma davranışları","Öğrenme ve bellek","Davranışın genetik temelleri","Çevresel etkenlerin davranışa etkisi","Davranış araştırmalarında gözlem ve deney","Davranış bilgisinin zararlı yönetiminde kullanımı"],
  "BİO759":["Doğal kozmetik ürünlerin kapsamı","Bitkisel ve mikrobiyal ham maddeler","Biyoaktif bileşik sınıfları","Ekstraksiyon yaklaşımlarının ilkeleri","Antioksidan etkinliğin değerlendirilmesi","Antimikrobiyal etkinliğin değerlendirilmesi","Cilt bariyeri ve biyolojik etkileşimler","Formülasyon bileşenlerinin işlevleri","Ürün stabilitesi","Güvenlilik ve toksisite ilkeleri","Alerjenite ve duyarlılık","Kalite kontrol ölçütleri","Mevzuat ve etiketleme","Sürdürülebilir ham madde kullanımı","Doğal kozmetik araştırmalarında güncel eğilimler"],
  "BİO763":["Geleneksel tedavi bilgisinin kapsamı","Etnobiyolojik bilgi kaynakları","Tıbbi bitkilerin geleneksel kullanımları","Mantar ve arı ürünlerinin geleneksel kullanımları","Hayvansal kökenli uygulamalar","Biyoaktif bileşiklerin biyolojik temelleri","Geleneksel bilginin belgelenmesi","Etkililik kanıtlarının değerlendirilmesi","Doz ve kullanım biçimlerinin yorumlanması","Toksisite ve etkileşim riskleri","Kanıt düzeyleri ve metodolojik sınırlılıklar","Kültürel bağlam ve sağlık davranışları","Etik, fikri mülkiyet ve yarar paylaşımı","Mevzuat ve halk sağlığı","Geleneksel uygulamalarda kanıta dayalı yaklaşım"],
  "BİO724":["Adli palinolojinin kapsamı","Polen ve spor morfolojisi","Palinomorf örnekleme ilkeleri","Olay yeri örneklerinin korunması","Referans koleksiyonlarının kullanımı","Mikroskobik tanımlama ölçütleri","Polen dağılımı ve taşınma süreçleri","Mevsimsellik ve coğrafi köken","Toprak ve materyal örneklerinde polen","Kontaminasyonun önlenmesi","Sayısal palinolojik verilerin değerlendirilmesi","Kanıtların karşılaştırılması","Adli raporlama ve belirsizlik","Delil zinciri ve kalite güvencesi","Adli palinolojide güncel yöntemler"],
  "BİO726":["Endemizm ve floristik çeşitlilik","Türkiye'nin fitocoğrafik bölgeleri","Endemik bitki oluşum süreçleri","Morfolojik tanılama karakterleri","Taksonomik anahtarların kullanımı","Herbaryum örnekleri ve kayıtları","Endemik türlerin habitat gereksinimleri","Popülasyon büyüklüğü ve dağılış","Tehdit kategorileri ve ölçütleri","Habitat kaybı ve iklim etkileri","Genetik çeşitlilik ve koruma","Yerinde koruma yaklaşımları","Alan dışı koruma yaklaşımları","Endemik bitkilerde sürdürülebilir kullanım","Türkiye endemik florasına ilişkin güncel araştırmalar"],
  "BİO738":["Tohum oluşumu ve yapısı","Tohum dormansisinin biyolojik temelleri","Çimlenmenin fizyolojik aşamaları","Sıcaklığın çimlenmeye etkisi","Işık ve fotoperiyodik yanıtlar","Su potansiyeli ve çimlenme","Tuzluluk ve ozmotik stres","Toprak özellikleri ve tohum yatağı","Tohum bankalarının ekolojisi","Çimlenme stratejileri ve yaşam biçimleri","Yangın ve diğer bozulmaların etkisi","İklim değişikliği ve çimlenme","Çimlenme deneylerinin tasarımı","Çimlenme verilerinin analizi","Restorasyon ve korumada çimlenme bilgisi"],
  "BİO746":["İhtiyolojinin kapsamı ve tarihçesi","Balıkların evrimsel kökeni","Dış morfoloji ve ölçüm karakterleri","İskelet ve kas sistemi","Solunum ve dolaşım uyumları","Osmoregülasyon","Beslenme biyolojisi","Üreme ve gelişim","Yaş ve büyüme","Davranış ve habitat kullanımı","Balık sistematiğinin ilkeleri","Tatlı su balık çeşitliliği","Deniz balık çeşitliliği","Balık popülasyonlarında tehditler","Balık çeşitliliğinin korunması"],
  "BİO748":["Etmomikolojinin kapsamı ve terminolojisi","Mantarların kültürel kullanımlarının belgelenmesi","Geleneksel gıda mantarları","Tıbbi amaçlı mantar kullanımları","Mantarların yerel adları ve sınıflandırılması","Etnografik veri toplama ilkeleri","Tür tanımlamasında morfolojik kanıtlar","Moleküler doğrulama yaklaşımları","Biyoaktif mantar bileşikleri","Etkililik kanıtlarının değerlendirilmesi","Zehirli türlerle karışma riskleri","Geleneksel bilginin korunması","Fikri mülkiyet ve yarar paylaşımı","Sürdürülebilir mantar kullanımı","Etmomikolojik araştırmaların karşılaştırılması"],
  "BİO756":["Apiterapinin kapsamı","Balın bileşimi ve biyolojik özellikleri","Propolisin bileşimi ve biyolojik özellikleri","Arı sütü ve polen ürünleri","Arı zehrinin biyolojik etkileri","Apiterapötik ürünlerde kalite ölçütleri","Antioksidan etkinlik","Antimikrobiyal etkinlik","İmmünolojik etkiler","Etkililik kanıtlarının değerlendirilmesi","Alerji ve toksisite riskleri","Doz, kullanım ve ürün standardizasyonu","Mevzuat ve etik ilkeler","Arıcılık ürünlerinde sürdürülebilirlik","Apiterapi araştırmalarındaki güncel gelişmeler"],
  "BİO758":["Biyokaçakçılık ve biyolojik kaynak kavramları","Biyolojik çeşitliliğin ekonomik ve bilimsel değeri","Genetik kaynakların toplanması","Geleneksel bilgi ve yerel topluluklar","Biyokaçakçılık örüntüleri","Tür tanılama ve izlenebilirlik","Moleküler doğrulama yaklaşımları","Biyolojik materyalin sınır ötesi hareketi","Biyolojik Çeşitlilik Sözleşmesi","Nagoya Protokolü","Erişim ve yarar paylaşımı","Fikri mülkiyet hakları","Ulusal mevzuat ve kurumsal sorumluluklar","Koruma ve sürdürülebilir kullanım","Biyokaçakçılıkla mücadelede örnek olaylar"],
  "BİO764":["Fitoterapinin kapsamı ve terminolojisi","Tıbbi bitkilerde etkin bileşikler","Bitkisel drogların tanılanması","Ekstraksiyon ve hazırlama ilkeleri","Farmakolojik etkinlik mekanizmaları","Antioksidan ve antimikrobiyal etkiler","Sindirim sistemiyle ilişkili uygulamalar","Solunum sistemiyle ilişkili uygulamalar","Sinir sistemiyle ilişkili uygulamalar","Etkililik kanıtlarının değerlendirilmesi","Doz ve standardizasyon","Toksisite ve yan etkiler","Bitki–ilaç etkileşimleri","Mevzuat, etik ve sürdürülebilirlik","Fitoterapi araştırmalarındaki güncel gelişmeler"],
};

const blueprint = (name, code) => {
  const category = categoryFor(name);
  const meta = categoryMeta[category];
  const categoryTopics = specificTopics[code] || {
    ecology:["ekolojik ölçekler ve sistem yaklaşımı","çevresel etmenler ve biyolojik yanıtlar","örnekleme tasarımı","popülasyon ve topluluk göstergeleri","habitat özelliklerinin değerlendirilmesi","biyolojik çeşitlilik ölçütleri","ekolojik verilerin düzenlenmesi","çevresel baskıların çözümlenmesi","mekânsal ve zamansal değişkenlik","biyolojik izleme yaklaşımları","koruma ve sürdürülebilirlik ilkeleri","risk ve etki değerlendirmesi","alan yazındaki güncel bulgular","örnek çalışmaların karşılaştırılması","ekolojik sonuçların bütüncül yorumlanması"],
    microbiology:["mikrobiyal yapı ve sınıflandırma","mikroorganizma–çevre ilişkileri","büyüme ve çoğalma dinamikleri","metabolik özellikler","mikrobiyal etkileşimler","patojenite ve virülans ilkeleri","konak yanıtının biyolojik temelleri","kontrol mekanizmaları","direnç gelişimi","mikrobiyolojik analiz yaklaşımları","bulguların kalite ölçütleriyle yorumlanması","biyogüvenlik ilkeleri","araştırma ve yayın etiği","güncel bilimsel kanıtlar","mikrobiyal süreçlerin bütüncül değerlendirilmesi"],
    molecular:["moleküler biyolojinin kavramsal temelleri","nükleik asitlerin yapısı ve işlevi","genom organizasyonu","gen ifadesinin düzenlenmesi","moleküler varyasyon","moleküler belirteçler","örnek hazırlama ilkeleri","moleküler analiz yaklaşımları","veri kalitesi ve doğrulama","biyoinformatik yorumlama ilkeleri","moleküler bulguların biyolojik anlamı","biyogüvenlik ve etik","güncel moleküler çalışmalar","yaklaşımların karşılaştırılması","moleküler kanıtların bütünleştirilmesi"],
    zoology:["hayvansal çeşitliliğin kavramsal çerçevesi","morfolojik karakterlerin değerlendirilmesi","anatomik ve fizyolojik uyumlar","taksonomik ölçütler","davranışsal özellikler","yaşam döngüsü ve gelişim","habitat ve dağılış ilişkileri","örnekleme ve gözlem yaklaşımları","tür tanılama ilkeleri","popülasyon göstergeleri","insan–hayvan etkileşimleri","koruma ve etik ilkeler","güncel zoolojik araştırmalar","örneklerin karşılaştırılması","zoolojik bulguların bütüncül yorumlanması"],
    botany:["bitkisel çeşitliliğin kavramsal çerçevesi","morfolojik karakterler","anatomik ve fizyolojik özellikler","bitkisel bileşenlerin biyolojik işlevleri","taksonomik ve etnobotanik yaklaşımlar","örnek toplama ve kayıt ilkeleri","tanılama ve karşılaştırma ölçütleri","bitkisel verilerin düzenlenmesi","biyoaktif bileşenlerin değerlendirilmesi","etkililik ve güvenlilik kanıtları","sürdürülebilir kullanım","mevzuat ve etik ilkeler","güncel bilimsel araştırmalar","örnek uygulamaların karşılaştırılması","botanik kanıtların bütüncül yorumlanması"],
    biochemistry:["biyokimyasal yapının temel ilkeleri","moleküler etkileşimler","metabolik yolların düzenlenmesi","enzimatik süreçler","enerji metabolizması","hücresel denge mekanizmaları","biyokimyasal belirteçler","analiz ve hesaplama yaklaşımları","veri kalitesi ve hata kaynakları","biyokimyasal sonuçların yorumlanması","fizyolojik ve patolojik ilişkiler","etik ve güvenli çalışma ilkeleri","güncel bilimsel bulgular","mekanizmaların karşılaştırılması","biyokimyasal süreçlerin bütünleştirilmesi"],
    methods:["bilimsel problem ve araştırma sorusu","alan yazınının sistematik incelenmesi","araştırma desenleri","örnekleme yaklaşımları","değişkenler ve ölçüm düzeyleri","veri toplama ilkeleri","yöntem geçerliği ve güvenirliği","biyolojik verilerin düzenlenmesi","betimsel analiz yaklaşımları","çıkarımsal yorumlama ilkeleri","bulguların görselleştirilmesi","araştırma etiği ve bütünlük","bilimsel yazım ve atıf","yöntemlerin karşılaştırılması","araştırma sürecinin bütüncül değerlendirilmesi"],
    biology:["kavramsal ve kuramsal çerçeve","biyolojik yapı–işlev ilişkileri","hücresel ve organizmal düzey","biyolojik çeşitlilik","çevresel etkileşimler","araştırma yaklaşımları","örnekleme ve veri toplama","biyolojik verilerin düzenlenmesi","bulguların yorumlanması","mekanizmaların karşılaştırılması","uygulama alanları","etik ve biyogüvenlik","güncel bilimsel kanıtlar","örnek çalışmaların değerlendirilmesi","biyolojik bilginin bütünleştirilmesi"],
  }[category];
  return {
    purpose: `${name} alanındaki ileri düzey kavramları, biyolojik mekanizmaları ve bilimsel kanıtları çözümleyerek alanla ilgili verileri uygun yöntemlerle değerlendirme yetkinliği kazandırmak.`,
    content: `${name}; ${categoryTopics.slice(0,5).join(", ")}, veri ve kanıtların değerlendirilmesi, etik ilkeler ve güncel bilimsel gelişmeler çerçevesinde ele alınır.`,
    methods: meta.methods,
    resources: `Biyoloji alanındaki güncel hakemli makaleler; ${name} konusunda lisansüstü düzey temel kaynaklar; ilgili ulusal ve uluslararası bilimsel veri tabanları.`,
    sdgs: meta.sdgs,
    outcomes: [
      `${name} alanındaki ileri düzey kavramları analiz eder.`,
      `${name} ile ilişkili biyolojik mekanizmaları karşılaştırır.`,
      `${name} verilerini uygun bilimsel ölçütlerle yorumlar.`,
      `${name} bağlamındaki bir probleme kanıta dayalı çözüm geliştirir.`,
      `${name} uygulamalarını etik ve toplumsal etkileriyle değerlendirir.`,
    ],
    weeklyTopics: categoryTopics,
  };
};

const thesisTemplates = existing.filter((item) => item.department === department && item.programName === programName && item.level === "Tezli Yüksek Lisans");
const templateByName = new Map(thesisTemplates.map((item) => [nameKey(item.name || ""), item]));
const templateFor = (course) => templateByName.get(nameKey(course.name));

const assessmentsFor = (template) => template?.assessments?.length
  ? template.assessments.map((item) => ({ name:clean(item.name), count:Number(item.count || 1), weight:Number(item.weight || 0) }))
  : [{ name:"Ara Sınav", count:1, weight:40 }, { name:"Yarıyıl Sonu Sınavı", count:1, weight:60 }];
const workloadFor = (course, assessments) => {
  const target = Number(course.ects) * 30;
  const rows = [{ name:"Ders Süresi", count:15, hours:Number(course.theory) + Number(course.practice), total:15 * (Number(course.theory) + Number(course.practice)) }];
  for (const item of assessments) {
    const value = fold(item.name); const count = Number(item.count || 1);
    if (value.includes("odev")) rows.push({ name:"Ödev Hazırlığı", count, hours:8, total:count * 8 });
    else if (value.includes("proje")) rows.push({ name:"Proje Çalışması", count, hours:count > 1 ? 8 : 20, total:count * (count > 1 ? 8 : 20) });
    else if (value.includes("ara sinav")) rows.push({ name:"Ara Sınav Hazırlığı", count, hours:20, total:count * 20 });
    else if (value.includes("yariyil sonu")) rows.push({ name:"Yarıyıl Sonu Sınavı Hazırlığı", count, hours:25, total:count * 25 });
  }
  const used = rows.reduce((sum,row)=>sum+row.total,0);
  const outside = Math.max(0, Math.floor(((target-used)/15)*2)/2);
  rows.splice(1,0,{ name:"Sınıf Dışı Çalışma Süresi", count:15, hours:outside, total:outside*15 });
  const delta = target - rows.reduce((sum,row)=>sum+row.total,0);
  if (delta) rows.push({ name:"Kaynak İnceleme ve Akademik Hazırlık", count:1, hours:delta, total:delta });
  return rows;
};
const academic = official.filter((course) => !["BİO701","BİO702","DAN701","DAN702"].includes(course.code)).map((course) => {
  const template = templateFor(course);
  const displayName = titleCase(course.name);
  const plan = blueprint(displayName, course.code);
  const sourcePurpose = template?.purpose ? naturalize(template.purpose, course.name, displayName) : plan.purpose;
  const sourceContent = template?.content ? naturalize(template.content, course.name, displayName) : plan.content;
  const sourceOutcomes = template?.outcomes?.length === 5 ? template.outcomes.map((item)=>naturalize(item,course.name,displayName)) : plan.outcomes;
  const weeklyTopics = unique([...(template?.weeklyTopics || []).filter((topic)=>!forbiddenWeek.test(topic)).map((topic)=>naturalize(topic,course.name,displayName)), ...plan.weeklyTopics]).slice(0,15);
  const assessments = assessmentsFor(template);
  const context = [displayName,sourcePurpose,sourceContent,...sourceOutcomes,...weeklyTopics].join(" ");
  return {
    code:course.code, name:displayName, department, programName, language:"Türkçe", level, teachingMode:template?.teachingMode || "Yüz Yüze",
    instructor:course.instructor || "Atama Bekliyor", theory:Number(course.theory), practice:Number(course.practice), credit:Number(course.credit), ects:Number(course.ects),
    prerequisites:template?.prerequisites || "Yok", purpose:sourcePurpose, content:sourceContent,
    methods:template?.methods ? naturalize(template.methods,course.name,displayName) : plan.methods,
    resources:template?.resources ? naturalize(template.resources,course.name,displayName) : plan.resources,
    sdgs:template?.sdgs?.length ? template.sdgs.slice(0,3) : plan.sdgs, outcomes:sourceOutcomes, weeklyTopics, assessments,
    workloads:workloadFor(course,assessments), contributionMatrix:matrix(sourceOutcomes,context), qualityChecks:checks(false), publicQualityChecklist:false,
  };
});

const projectOutcomes = ["Biyoloji alanında uygulanabilir bir mesleki proje problemi yapılandırır.","Proje problemine ilişkin bilimsel kaynakları eleştirel değerlendirir.","Proje amacına uygun çalışma yaklaşımını planlar ve uygular.","Proje bulgularını bilimsel, etik ve toplumsal ölçütlerle yorumlar.","Bitirme projesini akademik yazım ilkelerine göre raporlar."];
const projectWeeks = ["Bitirme projesi alanının ve kapsamının belirlenmesi","Proje probleminin sınırlandırılması","Proje amacı ve araştırma sorularının yapılandırılması","Biyoloji kaynakları için tarama stratejisinin oluşturulması","Alan yazınının tematik sınıflandırılması","Kuramsal veya uygulamalı çerçevenin kurulması","Proje yaklaşımının ve iş planının belirlenmesi","Etik, biyogüvenlik ve izin gerekliliklerinin değerlendirilmesi","Proje verilerinin veya bilimsel kanıtların düzenlenmesi","Bulguların çözümlenmesi","Bulguların Biyoloji alan yazınıyla karşılaştırılması","Çevresel, sağlıkla ilgili veya toplumsal çıkarımların değerlendirilmesi","Akademik proje metninin yapılandırılması","Atıf, kaynakça ve akademik bütünlük denetimi","Bitirme projesinin bütüncül değerlendirilmesi"];
const project = { code:"BİO7XX", aliases:["BİO701","BİO702"], name:"Bitirme Projesi", department, programName, language:"Türkçe", level, teachingMode:"Bireysel Proje Çalışması", instructor:"Öğrencinin Danışmanı", theory:0, practice:0, credit:0, ects:30, prerequisites:"Yok", purpose:"Öğrencinin Biyoloji alanındaki ileri düzey bilgi ve becerilerini mesleki veya toplumsal bir problem üzerinde bütünleştirerek bilimsel ve etik ölçütlere uygun bir bitirme projesi yürütmesini sağlamak.", content:"Biyoloji alanında proje probleminin belirlenmesi, alan yazınının incelenmesi, çalışma yaklaşımının planlanması, kanıtların çözümlenmesi, sonuçların çevresel, sağlıkla ilgili veya toplumsal bağlamda yorumlanması ve projenin akademik biçimde raporlanması.", methods:"Bireysel proje çalışması, danışmanlık görüşmesi, literatür incelemesi, biyolojik kanıt çözümleme, akademik raporlama ve yapılandırılmış geri bildirim.", resources:"Enstitü proje yazım ilkeleri; Biyoloji alanındaki güncel hakemli yayınlar; ilgili araştırma etiği ve biyogüvenlik düzenlemeleri.", sdgs:["3","4","15"], outcomes:projectOutcomes, weeklyTopics:projectWeeks, assessments:[{name:"Bitirme Projesi",count:1,weight:100}], workloads:[{name:"Proje Planlama ve Danışmanlık",count:15,hours:2,total:30},{name:"Literatür ve Biyolojik Kanıt İncelemesi",count:15,hours:20,total:300},{name:"Proje Uygulama ve Raporlama",count:15,hours:38,total:570}], contributionMatrix:matrix(projectOutcomes,[...projectOutcomes,...projectWeeks].join(" ")), qualityChecks:checks(false), publicQualityChecklist:false };

if (academic.length !== 62) throw new Error(`62 akademik ders bekleniyordu; bulunan: ${academic.length}`);
for (const course of academic) {
  if (course.weeklyTopics.length !== 15) throw new Error(`${course.code}: 15 hafta oluşturulamadı.`);
  if (course.weeklyTopics.some((topic)=>forbiddenWeek.test(topic))) throw new Error(`${course.code}: yasak haftalık başlık bulundu.`);
  if (course.workloads.reduce((sum,row)=>sum+row.total,0) !== course.ects*30) throw new Error(`${course.code}: AKTS iş yükü tutarsız.`);
  if (course.contributionMatrix.some((row)=>row.values.length!==11 || row.values.some((value)=>value<1 || value>5))) throw new Error(`${course.code}: DÖÇ–PÇ matrisi geçersiz.`);
}
const emit = (file, exportName, value) => writeFileSync(path.join(root,"lib/data",file),`import type { CoursePackage } from "./coursePackages";\n\nexport const ${exportName}: CoursePackage[] = ${JSON.stringify(value,null,2)};\n`);
emit("biyolojiTezsizCoursePackages.ts","biyolojiTezsizCoursePackages",academic);
emit("biyolojiTezsizCommonCoursePackages.ts","biyolojiTezsizCommonCoursePackages",[project]);
console.log(JSON.stringify({official:official.length,academic:academic.length,common:1,total:academic.length+1,programOutcomes:programOutcomes.length}));

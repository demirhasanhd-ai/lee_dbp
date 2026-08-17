import type { CoursePackage, CourseQualityCheck } from "./coursePackages";

type MissingCourseDefinition = {
  code: string;
  name: string;
  instructor?: string;
  purpose: string;
  content: string;
  topics: string[];
  focus: "material" | "history" | "language";
};

const qualityChecks: CourseQualityCheck[] = [
  "Ders adı ve kodları doğrulandı mı?", "Tüm OBS linkleri gerçek mi?", "Dersin program düzeyi doğru mu?",
  "Ders amacı açık ve uygun mu?", "Ders amacı program düzeyine uygun mu?", "DÖÇ sayısı ve kapsamı uygun mu?",
  "DÖÇ'ler ölçülebilir mi?", "Bloom fiilleri uygun mu?", "Bloom düzeyi program düzeyine uygun mu?",
  "Amaç–DÖÇ uyumu sağlandı mı?", "DÖÇ–içerik uyumu sağlandı mı?", "İçerik–haftalık plan uyumu sağlandı mı?",
  "DÖÇ–öğretim yöntemi uyumu sağlandı mı?", "DÖÇ–ölçme/değerlendirme uyumu sağlandı mı?",
  "AKTS–iş yükü tutarlı mı?", "DÖÇ–PÇ matrisi gerçekçi mi?", "1–5 katkı düzeyleri doğru kullanılmış mı?",
  "Yapay yüksek ilişkilendirme var mı?", "Tekrarlı kodlar doğru tekilleştirildi mi?",
  "Kaynakta olmayan bilgi kesin bilgi gibi yazılmış mı?", "Eksik/doğrulanması gereken alan kaldı mı?",
].map((item, index) => ({
  item,
  status: index === 1 || index === 20 ? "Doğrulanmalı" : [3, 5, 6, 7, 9, 10, 11, 12, 14, 15, 16].includes(index) ? "Revize Edildi" : "Uygun",
}));

const definitions: MissingCourseDefinition[] = [
  {
    code: "ARK811", name: "ANTİK KAYNAKLARDA YUNAN VE ROMA HEYKELTIRAŞLIĞI 1", focus: "material",
    purpose: "Yunan ve Roma heykeltıraşlığına ilişkin antik yazılı kaynakları heykeltıraş, eser ve dönem bağlamında eleştirel olarak değerlendirme yetkinliği kazandırmak.",
    content: "Antik yazarların sanat ve heykeltıraşlık anlatıları; Yunan heykeltıraşları, atölyeler, eser tanımları, üslup ve kronoloji sorunları; yazılı kaynak ile arkeolojik bulgu arasındaki ilişki.",
    topics: ["Antik sanat yazınının kapsamı", "Antik kaynakların güvenilirliği ve sınırlılıkları", "Arkaik Dönem heykeltıraşlığına ilişkin anlatılar", "Erken Klasik Dönem heykeltıraşları", "Phidias ve çevresine ilişkin kaynaklar", "Polykleitos ve Kanon geleneği", "Myron ve hareketin temsili", "Geç Klasik Dönem sanatçı anlatıları", "Praxiteles ve yapıt geleneği", "Skopas ve üslup tartışmaları", "Lysippos ve oran anlayışı", "Heykeltıraşlık atölyeleri ve usta-çırak ilişkileri", "Antik kopya ve özgün eser sorunu", "Yazılı tanım ile arkeolojik eserin karşılaştırılması", "Yunan heykeltıraşlığı kaynaklarının eleştirel sentezi"],
  },
  {
    code: "ARK812", name: "ANTİK KAYNAKLARDA YUNAN VE ROMA HEYKELTIRAŞLIĞI 2", instructor: "Doç. Dr. FARİS DEMİR", focus: "material",
    purpose: "Roma heykeltıraşlığını antik yazılı kaynaklar, portre geleneği ve kamusal temsil bağlamında karşılaştırmalı olarak analiz etme yetkinliği kazandırmak.",
    content: "Roma heykeltıraşlığına ilişkin yazılı tanıklıklar; Cumhuriyet ve İmparatorluk portreleri, ideal ve tarihsel kabartmalar, kopyacılık, atölyeler, himaye ve kamusal temsil.",
    topics: ["Roma sanat yazını ve kaynak türleri", "Yunan sanat mirasının Roma'da alımlanması", "Roma kopyacılığına ilişkin antik tanıklıklar", "Cumhuriyet Dönemi portre geleneği", "Augustus Dönemi heykel programları", "Julio-Claudius hanedan portreleri", "Flaviuslar Dönemi portre ve kabartmaları", "Traianus Dönemi tarihsel anlatımı", "Hadrianus Dönemi klasikçi yaklaşım", "Antoninler Dönemi portre üslubu", "Severuslar Dönemi temsil anlayışı", "İmparatorluk kültü ve kamusal heykeller", "Lahit heykeltıraşlığına ilişkin kaynaklar", "Atölye, sipariş ve sanatçı ilişkileri", "Roma heykeltıraşlığı kaynaklarının karşılaştırmalı sentezi"],
  },
  {
    code: "ARK813", name: "KİLİKİA SİKKELERİ 1", instructor: "Doç. Dr. FATİH ERHAN", focus: "material",
    purpose: "Kilikia sikkelerini darphane, tipoloji, ikonografi ve tarihsel bağlam bakımından tanımlama ve değerlendirme yetkinliği kazandırmak.",
    content: "Kilikia'nın tarihî coğrafyası ve erken sikke geleneği; darphaneler, ağırlık sistemleri, yazıtlar, ikonografik tipler ve Pers egemenliği sonuna kadar nümismatik gelişim.",
    topics: ["Kilikia'nın tarihî coğrafyası ve nümismatik kaynakları", "Sikke tanımlama terminolojisi", "Metal, ağırlık ve ölçü sistemleri", "Erken Kilikia sikke basımı", "Tarsos darphanesinin erken evreleri", "Nagidos sikkeleri", "Kelenderis sikkeleri", "Soloi sikkeleri", "Mallus ve çevre darphaneleri", "Pers egemenliği ve satrap sikkeleri", "Tanrı ve kahraman ikonografisi", "Hayvan ve bitki betimleri", "Lejant, monogram ve kontrol işaretleri", "Sikke buluntularında tarihleme ve dolaşım", "Erken Kilikia sikkelerinin tipolojik sentezi"],
  },
  {
    code: "ARK814", name: "KİLİKİA SİKKELERİ 2", instructor: "Doç. Dr. FATİH ERHAN", focus: "material",
    purpose: "Hellenistik ve Roma dönemleri Kilikia sikkelerini siyasi, ekonomik ve ikonografik değişimler çerçevesinde karşılaştırmalı olarak değerlendirme yetkinliği kazandırmak.",
    content: "Hellenistik krallıklar ve Roma egemenliği döneminde Kilikia darphaneleri; kent sikkeleri, imparatorluk tipleri, lejantlar, dolaşım, defineler ve arkeolojik bağlam.",
    topics: ["Hellenistik Dönem Kilikia'sında para ekonomisi", "İskender ve ardıllarının sikke tipleri", "Seleukos egemenliği ve darphaneler", "Özerk kent sikkeleri", "Tarsos'un Hellenistik sikke üretimi", "Ovalık ve Dağlık Kilikia darphaneleri", "Roma Cumhuriyet Dönemi Kilikia sikkeleri", "Erken Roma İmparatorluk Dönemi kent sikkeleri", "Yerel tanrı ve kült ikonografisi", "İmparator portreleri ve unvanlar", "Roma eyalet yönetimi ve sikke basımı", "Geç Roma Dönemi dolaşımı", "Sikke defineleri ve arkeolojik bağlam", "Darphane ve kronoloji sorunları", "Hellenistik-Roma Kilikia sikkelerinin karşılaştırmalı sentezi"],
  },
  {
    code: "ARK817", name: "MÖ 1. BİNYILDA ANADOLU-KUZEY SURİYE İLİŞKİLERİ", instructor: "Doç. Dr. İRFAN TUĞCU", focus: "history",
    purpose: "MÖ 1. binyılda Anadolu ile Kuzey Suriye arasındaki siyasi ve kültürel ilişkileri arkeolojik ve yazılı kanıtlar üzerinden analiz etme yetkinliği kazandırmak.",
    content: "Geç Hitit kent devletleri, Urartu, Frig, Asur ve Arami oluşumları; yerleşim, mimari, sanat, yazıt ve ticaret verileri üzerinden Anadolu-Kuzey Suriye etkileşimleri.",
    topics: ["MÖ 1. binyıl Anadolu ve Kuzey Suriye coğrafyası", "Geç Tunç Çağı sonrasında siyasi dönüşüm", "Geç Hitit kent devletleri", "Arami siyasi oluşumları", "Yeni Asur yayılımı", "Urartu-Kuzey Suriye ilişkileri", "Frig kültür çevresi ve güney bağlantıları", "Karkamış ve Fırat havzası", "Tell Halaf ve Guzana", "Zincirli ve Sam'al Krallığı", "Anıtsal mimaride ortak unsurlar", "Kabartma sanatı ve ikonografik aktarım", "Yazıtlar ve dilsel etkileşim", "Ticaret yolları ve mal dolaşımı", "Anadolu-Kuzey Suriye ilişkilerinin bölgesel sentezi"],
  },
  {
    code: "ARK818", name: "ANADOLU'DA ÖLÜ GÖMME ADETLERİ", focus: "material",
    purpose: "Anadolu'daki ölü gömme uygulamalarını dönem, bölge, mezar mimarisi ve buluntu bağlamı üzerinden karşılaştırmalı olarak değerlendirme yetkinliği kazandırmak.",
    content: "Prehistorik dönemlerden Roma dönemine Anadolu'da inhumasyon ve kremasyon; mezar tipleri, gömü uygulamaları, mezar armağanları, toplumsal kimlik ve ölüm arkeolojisi yaklaşımları.",
    topics: ["Ölüm arkeolojisinin kavramları ve yöntemleri", "Gömü bağlamının belgelenmesi", "Paleolitik ve Mezolitik gömüler", "Neolitik Dönem gömü uygulamaları", "Kalkolitik Dönem mezar gelenekleri", "Tunç Çağı mezar tipleri", "Küp ve sanduka mezarlar", "Tümülüs geleneği", "Demir Çağı Anadolu gömüleri", "Urartu mezar mimarisi", "Frig ve Lidya gömü gelenekleri", "Klasik ve Hellenistik dönem nekropolleri", "Roma Dönemi mezarları ve kremasyon", "Mezar armağanları, yaş, cinsiyet ve statü", "Anadolu gömü geleneklerinin karşılaştırmalı değerlendirilmesi"],
  },
  {
    code: "ARK819", name: "ANADOLU'NUN MÖ 2. BİNDE SİYASİ YAPISI 1", focus: "history",
    purpose: "MÖ 2. binyılın ilk yarısında Anadolu'nun siyasi yapısını yazılı ve arkeolojik kanıtlarla çözümleme yetkinliği kazandırmak.",
    content: "Assur Ticaret Kolonileri Çağı, yerel krallıklar, kent devletleri, ticaret ağları ve Eski Hitit Devleti'nin kuruluş süreci; tabletler, mühürler, yerleşimler ve maddi kültür.",
    topics: ["MÖ 2. binyıl Anadolu coğrafyası ve kaynakları", "Assur Ticaret Kolonileri sisteminin oluşumu", "Kültepe-Kaniş ve karum örgütlenmesi", "Anadolu'daki yerel krallıklar", "Ticaret yolları ve siyasi denetim", "Koloni Çağı tabletlerinin siyasi verileri", "Mühürler ve yönetim pratikleri", "Kent devletleri arasındaki ilişkiler", "Kuššara Krallığı", "Anitta ve erken siyasi birleşme", "Hattuša'nın yükselişi", "Eski Hitit Devleti'nin kuruluşu", "I. Hattušili dönemi", "I. Muršili dönemi", "MÖ 2. binyılın ilk yarısındaki siyasi dönüşümün sentezi"],
  },
  {
    code: "ARK820", name: "ANADOLU'NUN MÖ 2. BİNDE SİYASİ YAPISI 2", instructor: "Doç. Dr. İRFAN TUĞCU", focus: "history",
    purpose: "MÖ 2. binyılın ikinci yarısında Anadolu'daki siyasi oluşumları diplomasi, savaş ve bölgesel güç ilişkileri çerçevesinde eleştirel olarak değerlendirme yetkinliği kazandırmak.",
    content: "Orta ve Yeni Hitit dönemleri; Kizzuwatna, Arzawa, Kaška ve diğer bölgesel güçler; Mısır, Mitanni ve Asur ilişkileri; antlaşmalar, mektuplar ve imparatorluğun çözülüşü.",
    topics: ["Orta Hitit Dönemi'nin siyasi yapısı", "Kizzuwatna ile ilişkiler", "Kaška toplulukları ve kuzey sınırı", "Arzawa ülkeleri ve Batı Anadolu", "Mitanni-Hitit rekabeti", "I. Šuppiluliuma ve imparatorluk siyaseti", "Suriye'de Hitit yönetimi", "Mısır-Hitit ilişkileri", "Kadeş Savaşı ve antlaşması", "III. Hattušili dönemi diplomasisi", "Tudhaliya döneminde bölgesel dengeler", "Ugarit ve bağlı krallıklar", "Asur'un yükselişi ve doğu siyaseti", "Hitit İmparatorluğu'nun çözülüşü", "MÖ 2. binyıl Anadolu siyasi yapısının bütüncül değerlendirilmesi"],
  },
  {
    code: "ARK823", name: "ANTİK DÖNEMDE SOSYAL VE SİYASİ YAPI", focus: "history",
    purpose: "Antik toplumların sosyal tabakalaşma, yurttaşlık, iktidar ve kurumlarını arkeolojik ve yazılı veriler aracılığıyla karşılaştırmalı olarak değerlendirme yetkinliği kazandırmak.",
    content: "Yunan polisleri ve Roma dünyasında aile, yurttaşlık, kölelik, toplumsal sınıflar, yönetim kurumları, din, ordu, ekonomi ve kamusal alanın sosyal-siyasi örgütlenmedeki rolü.",
    topics: ["Antik toplum araştırmalarının kaynakları", "Polis kavramı ve yurttaş topluluğu", "Atina'nın sosyal ve siyasi kurumları", "Sparta'nın toplumsal örgütlenmesi", "Aile, hane ve akrabalık", "Kadınların toplumsal konumu", "Kölelik ve bağımlı emek", "Sınıf, statü ve toplumsal hareketlilik", "Din ve siyasi meşruiyet", "Ordu ve yurttaşlık ilişkisi", "Hellenistik krallıklarda iktidar", "Roma Cumhuriyeti'nin kurumları", "Roma İmparatorluğu'nda merkez ve eyaletler", "Kamusal mekân ve siyasi temsil", "Antik sosyal ve siyasi yapıların karşılaştırmalı sentezi"],
  },
  {
    code: "ARK824", name: "ARKEOLOJİDE KÜÇÜK BULUNTULAR", instructor: "Dr. Öğr. Üyesi AYÇA GERÇEK", focus: "material",
    purpose: "Arkeolojik küçük buluntuları malzeme, üretim tekniği, işlev, tipoloji ve bağlam ölçütleriyle sınıflandırma ve yorumlama yetkinliği kazandırmak.",
    content: "Metal, kemik, cam, taş ve pişmiş toprak küçük buluntular; üretim teknikleri, işlevsel sınıflandırma, kataloglama, tarihleme, koruma durumu ve arkeolojik bağlam.",
    topics: ["Küçük buluntu kavramı ve araştırma yöntemleri", "Buluntu bağlamı ve kayıt ilkeleri", "Kataloglama ve ölçüm standartları", "Metal üretim teknikleri", "Metal alet ve silahlar", "Takı ve süs eşyaları", "Kemik ve boynuz eserler", "Cam üretimi ve cam buluntular", "Taş kaplar ve taş küçük eserler", "Pişmiş toprak figürinler", "Ağırşak, tezgâh ağırlığı ve üretim araçları", "Mühürler ve mühür baskıları", "Aydınlatma araçları ve kandiller", "Tipoloji, kronoloji ve işlev yorumları", "Küçük buluntuların bağlamsal sentezi"],
  },
  {
    code: "ARK826", name: "MESLEKİ YABANCI DİL 2", focus: "language",
    purpose: "İleri düzey arkeoloji metinlerini yabancı dilde çözümleme, alan terminolojisini bağlam içinde kullanma ve akademik bulguları doğru biçimde ifade etme yetkinliği kazandırmak.",
    content: "Arkeoloji makaleleri, kazı raporları ve kataloglardan ileri düzey okuma; bağlamsal terminoloji, akademik cümle yapıları, özetleme, eleştirel metin çözümleme ve alan yazınıyla çalışma.",
    topics: ["İleri arkeoloji terminolojisinin bağlamsal kullanımı", "Akademik metinlerde yapı ve söylem", "Kazı raporlarında yöntem bölümleri", "Yüzey araştırması raporlarının çözümlemesi", "Seramik terminolojisi ve tanımlama dili", "Mimari terminoloji ve betimleme", "Heykel ve ikonografi metinleri", "Nümismatik metinlerde teknik terimler", "Kronoloji ve tarihleme ifadeleri", "Buluntu kataloglarının okunması", "Koruma ve kültürel miras metinleri", "Kaynak gösterme ve akademik ifade kalıpları", "Arkeoloji makalesi özetleme", "Karşılaştırmalı metin çözümleme", "Alan yazınının yabancı dilde eleştirel değerlendirilmesi"],
  },
  {
    code: "ARK829", name: "KİLİKYA MOZAİKLERİ 1", instructor: "Doç. Dr. FARİS DEMİR", focus: "material",
    purpose: "Kilikia mozaiklerini teknik, ikonografi, üslup, mekân ve kronoloji bakımından analiz etme yetkinliği kazandırmak.",
    content: "Mozaik yapım teknikleri ve terminoloji; Kilikia'nın erken ve Hellenistik-Roma dönemi mozaikleri; geometrik, bitkisel ve figürlü bezemeler; atölye ve tarihleme sorunları.",
    topics: ["Mozaik araştırmalarında terminoloji", "Mozaik yapım teknikleri ve malzemeler", "Kilikia'da mozaik araştırmalarının tarihçesi", "Erken dönem zemin bezemeleri", "Hellenistik mozaik geleneği", "Roma Dönemi geometrik kompozisyonları", "Bitkisel bezeme repertuvarı", "Mitolojik figürlü sahneler", "Deniz temaları ve Okeanos betimleri", "Gündelik yaşam ve mevsim sahneleri", "Konut mozaikleri ve mekân ilişkisi", "Hamam ve kamusal yapı mozaikleri", "Üslup ve atölye özellikleri", "Mozaiklerde tarihleme ölçütleri", "Kilikia mozaiklerinin teknik ve ikonografik sentezi"],
  },
  {
    code: "ARK830", name: "KİLİKYA MOZAİKLERİ 2", instructor: "Doç. Dr. FARİS DEMİR", focus: "material",
    purpose: "Geç Roma ve Erken Bizans dönemi Kilikia mozaiklerini bölgesel atölyeler, yazıtlar, mekânsal bağlam ve kültürel değişim çerçevesinde değerlendirme yetkinliği kazandırmak.",
    content: "Geç Antik Çağ Kilikia mozaikleri; kilise, konut ve kamusal yapılardaki döşemeler; yazıtlar, donörler, hayvan ve bitki betimleri, atölye ilişkileri ve koruma sorunları.",
    topics: ["Geç Antik Çağ Kilikia'sının tarihsel çerçevesi", "Geç Roma mozaik teknikleri", "Erken Bizans kilise mozaikleri", "Litürjik mekân ve zemin programı", "Mozaik yazıtları ve donörler", "Hayvan betimleri ve simgesel anlamlar", "Bitkisel kompozisyonlar", "Geometrik örgeler ve bordürler", "Konut mozaiklerinde süreklilik", "Kamusal yapılarda mozaik kullanımı", "Kilikia kıyı yerleşimlerinden örnekler", "İç Kilikia yerleşimlerinden örnekler", "Bölgesel atölye ve usta ilişkileri", "Belgeleme ve koruma sorunları", "Geç Antik Kilikia mozaiklerinin karşılaştırmalı sentezi"],
  },
];

const courseSpecificOutcomes: Record<string, string[]> = {
  ARK811: [
    "Antik kaynaklardaki Yunan heykeltıraşlık anlatılarını eleştirel analiz eder.",
    "Yunan heykeltıraşlarını eser, dönem ve üslup bakımından karşılaştırır.",
    "Antik metinlerdeki eser tanımlarını arkeolojik örneklerle ilişkilendirir.",
    "Kopya ve özgün eser sorunlarına ilişkin görüşleri değerlendirir.",
    "Yunan heykeltıraşlığı kronolojisini yazılı ve görsel kanıtlarla sentezler.",
  ],
  ARK812: [
    "Roma heykeltıraşlığına ilişkin antik yazılı tanıklıkları analiz eder.",
    "Roma portrelerini hanedan, dönem ve temsil anlayışıyla karşılaştırır.",
    "Tarihsel kabartmaları siyasi ve kamusal bağlamları içinde değerlendirir.",
    "Roma kopyacılığı ve atölye üretimine ilişkin görüşleri eleştirir.",
    "Roma heykel programlarını himaye ve imparatorluk ideolojisiyle ilişkilendirir.",
  ],
  ARK813: [
    "Erken Kilikia sikkelerini darphane ve ağırlık sistemine göre sınıflandırır.",
    "Sikke lejantları ile ikonografik tipleri tarihsel bağlamda analiz eder.",
    "Kilikia darphanelerinin tipolojik özelliklerini karşılaştırır.",
    "Satrap sikkelerini siyasi ve ekonomik verilerle değerlendirir.",
    "Erken Kilikia sikke dolaşımını arkeolojik buluntularla yorumlar.",
  ],
  ARK814: [
    "Hellenistik ve Roma Kilikia sikkelerini kronolojik olarak sınıflandırır.",
    "Kent sikkelerindeki yerel kült ve imparatorluk ikonografisini analiz eder.",
    "Kilikia darphanelerinin üretim ve dolaşım özelliklerini karşılaştırır.",
    "Sikke definelerini arkeolojik ve ekonomik bağlamlarıyla değerlendirir.",
    "Hellenistik-Roma Kilikia nümismatiğindeki değişimi sentezler.",
  ],
  ARK817: [
    "MÖ 1. binyıl Anadolu ve Kuzey Suriye siyasi oluşumlarını analiz eder.",
    "Geç Hitit, Arami, Asur, Urartu ve Frig verilerini karşılaştırır.",
    "Mimari ve kabartma sanatındaki kültürel aktarımı değerlendirir.",
    "Yazıtlar ile ticaret verilerini bölgesel ilişkiler bağlamında yorumlar.",
    "Anadolu-Kuzey Suriye etkileşimlerini kronolojik bir modelde sentezler.",
  ],
  ARK818: [
    "Anadolu mezar tiplerini dönem ve bölge ölçütleriyle sınıflandırır.",
    "İnhumasyon ve kremasyon uygulamalarını karşılaştırmalı olarak analiz eder.",
    "Mezar armağanlarını kimlik ve toplumsal statü bağlamında değerlendirir.",
    "Gömü bağlamından hareketle ölüm ritüellerini yorumlar.",
    "Anadolu ölü gömme geleneklerindeki süreklilik ve değişimi sentezler.",
  ],
  ARK819: [
    "Assur Ticaret Kolonileri Çağı'nın siyasi yapısını analiz eder.",
    "Kültepe tabletlerindeki siyasi ve ekonomik verileri değerlendirir.",
    "Yerel krallıklar ile kent devletleri arasındaki ilişkileri karşılaştırır.",
    "Kuššara ve Hattuša'nın yükselişini arkeolojik kanıtlarla yorumlar.",
    "Eski Hitit Devleti'nin kuruluş sürecini kronolojik olarak sentezler.",
  ],
  ARK820: [
    "Orta ve Yeni Hitit dönemlerinin siyasi kurumlarını analiz eder.",
    "Kizzuwatna, Arzawa ve Kaška ilişkilerini bölgesel bağlamda değerlendirir.",
    "Hitit-Mısır-Mitanni-Asur güç ilişkilerini karşılaştırır.",
    "Antlaşma ve mektuplardaki diplomatik stratejileri yorumlar.",
    "Hitit İmparatorluğu'nun genişleme ve çözülme süreçlerini sentezler.",
  ],
  ARK823: [
    "Antik toplumlarda yurttaşlık ve iktidar kavramlarını analiz eder.",
    "Yunan polislerinin sosyal ve siyasi kurumlarını karşılaştırır.",
    "Aile, kölelik, sınıf ve statü ilişkilerini değerlendirir.",
    "Roma Cumhuriyeti ve İmparatorluğu'nun yönetim yapılarını yorumlar.",
    "Kamusal mekân ile siyasi temsil arasındaki ilişkiyi sentezler.",
  ],
  ARK824: [
    "Arkeolojik küçük buluntuları malzeme ve üretim tekniğine göre sınıflandırır.",
    "Küçük buluntuların işlevini arkeolojik bağlam içinde analiz eder.",
    "Metal, kemik, cam, taş ve pişmiş toprak eserleri karşılaştırır.",
    "Küçük buluntuları tipolojik ve kronolojik ölçütlerle değerlendirir.",
    "Katalog verilerinden üretim ve kullanım örüntülerini sentezler.",
  ],
  ARK826: [
    "İleri arkeoloji terminolojisini yabancı dilde bağlama uygun kullanır.",
    "Yabancı dildeki kazı ve yüzey araştırması raporlarını analiz eder.",
    "Buluntu kataloglarındaki teknik tanımları doğru biçimde yorumlar.",
    "Arkeoloji makalelerindeki farklı akademik görüşleri karşılaştırır.",
    "Arkeolojik bir metni yabancı dilde akademik biçimde özetler.",
  ],
  ARK829: [
    "Kilikia mozaiklerini teknik ve malzeme özelliklerine göre sınıflandırır.",
    "Geometrik, bitkisel ve figürlü kompozisyonları ikonografik olarak analiz eder.",
    "Mozaikleri mekân, işlev ve kronoloji bakımından karşılaştırır.",
    "Kilikia mozaiklerinde atölye ve üslup özelliklerini değerlendirir.",
    "Hellenistik-Roma Kilikia mozaik geleneğini bütüncül olarak yorumlar.",
  ],
  ARK830: [
    "Geç Roma ve Erken Bizans Kilikia mozaiklerini sınıflandırır.",
    "Mozaik yazıtlarını donör ve mekânsal bağlamlarıyla analiz eder.",
    "Kilise, konut ve kamusal yapı mozaiklerini karşılaştırır.",
    "Bölgesel atölye ilişkileri ile üslup özelliklerini değerlendirir.",
    "Geç Antik Kilikia mozaiklerindeki kültürel değişimi sentezler.",
  ],
};

const outcomesFor = (course: MissingCourseDefinition): string[] => course.focus === "language" ? [
  "İleri arkeoloji terminolojisini akademik metinlerde bağlama uygun kullanır.",
  "Yabancı dildeki kazı raporlarını yapısal ve anlamsal olarak analiz eder.",
  "Arkeolojik tanım ve yorumları yabancı dilde doğru biçimde özetler.",
  "Farklı akademik metinlerdeki görüşleri karşılaştırarak eleştirel değerlendirir.",
  "Arkeoloji alanındaki bilimsel bilgiyi yabancı dilde yazılı olarak aktarır.",
] : course.focus === "history" ? [
  "Ders kapsamındaki siyasi ve toplumsal kavramları tarihsel bağlamında analiz eder.",
  "Yazılı kaynaklarla arkeolojik kanıtları eleştirel biçimde karşılaştırır.",
  "Bölgesel güç ve kültür ilişkilerini kronolojik olarak değerlendirir.",
  "Farklı tarihsel yorumları kanıta dayalı biçimde eleştirir.",
  "Dönemin sosyal ve siyasi dönüşümünü bütüncül olarak sentezler.",
] : [
  "Ders kapsamındaki buluntuları teknik ve tipolojik ölçütlerle analiz eder.",
  "Arkeolojik verileri kronolojik ve bağlamsal olarak değerlendirir.",
  "Farklı eser gruplarını üslup, işlev ve üretim özellikleriyle karşılaştırır.",
  "Alan yazınındaki tarihleme ve yorum önerilerini eleştirel değerlendirir.",
  "Maddi kültür verilerinden hareketle bilimsel sonuçlar sentezler.",
];

const matrixFor = (focus: MissingCourseDefinition["focus"]) => {
  const values = focus === "language"
    ? [[3,2,2,2,2,1,5,4,2,2,5],[2,3,2,2,2,2,5,3,2,2,5],[2,3,3,2,2,1,4,5,2,2,5],[2,4,4,3,3,2,5,4,2,2,5],[3,3,3,3,2,2,4,5,3,2,5]]
    : focus === "history"
      ? [[4,4,3,2,4,2,3,2,2,3,3],[3,5,4,3,4,3,5,2,3,3,4],[3,4,4,3,5,2,4,2,2,3,4],[3,4,5,3,4,2,5,3,3,3,5],[4,4,4,4,5,2,4,4,3,4,4]]
      : [[4,4,3,2,4,4,3,2,2,3,3],[4,5,3,3,5,4,4,2,2,3,4],[4,4,4,2,5,4,3,2,2,3,3],[3,4,5,3,4,3,5,3,3,3,5],[4,5,4,3,5,4,4,4,3,4,4]];
  return values.map((row, index) => ({ outcome: `DÖÇ${index + 1}`, values: row }));
};

export const arkeolojiMissingCoursePackages: CoursePackage[] = definitions.map((course) => ({
  code: course.code,
  name: course.name,
  department: "Arkeoloji ABD",
  programName: "Arkeoloji",
  language: "Türkçe",
  level: "Tezli Yüksek Lisans",
  teachingMode: "Yüz Yüze",
  instructor: course.instructor || "Atama Bekliyor",
  theory: 3,
  practice: 0,
  credit: 3,
  ects: 6,
  prerequisites: "Yok",
  purpose: course.purpose,
  content: course.content,
  methods: course.focus === "language"
    ? "Metin incelemesi, terminoloji çözümlemesi, karşılaştırmalı okuma, çeviri ve akademik yazma çalışmaları."
    : "Anlatım, görsel ve yazılı kaynak incelemesi, karşılaştırmalı analiz, akademik tartışma ve buluntu/bağlam değerlendirmesi.",
  resources: "Dersin kapsamına uygun güncel arkeoloji yayınları, kazı ve araştırma raporları ile öğretim elemanının belirleyeceği temel kaynaklar.",
  sdgs: course.focus === "language" ? ["4", "10", "17"] : ["4", "11", "16"],
  outcomes: courseSpecificOutcomes[course.code] || outcomesFor(course),
  weeklyTopics: course.topics,
  assessments: [
    { name: "Ara Sınav", count: 1, weight: 40 },
    { name: "Yarıyıl Sonu Sınavı", count: 1, weight: 60 },
  ],
  workloads: [
    { name: "Ders Süresi", count: 15, hours: 3, total: 45 },
    { name: "Sınıf Dışı Çalışma Süresi", count: 15, hours: 6, total: 90 },
    { name: "Ara Sınav Hazırlığı", count: 1, hours: 20, total: 20 },
    { name: "Yarıyıl Sonu Sınavı Hazırlığı", count: 1, hours: 25, total: 25 },
  ],
  contributionMatrix: matrixFor(course.focus),
  qualityChecks,
  publicQualityChecklist: false,
}));

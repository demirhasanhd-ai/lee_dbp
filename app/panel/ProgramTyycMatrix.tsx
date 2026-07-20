"use client";

import { ChevronDown, Info } from "lucide-react";
import { useMemo, useState } from "react";

type TyycLevel = 7 | 8;
type TyycItem = { code: string; title: string };
type TyycGroup = { id: string; title: string; items: TyycItem[] };

const tyycGroups: Record<TyycLevel, TyycGroup[]> = {
  7: [
    {
      id: "bilgi",
      title: "Bilgi",
      items: [
        { code: "B1", title: "Alanındaki güncel ve ileri düzey kuramsal bilgileri uzmanlık düzeyinde geliştirir ve derinleştirir." },
        { code: "B2", title: "Alanıyla ilişkili disiplinler arası bilgileri bütünleştirir, yorumlar ve yeni bilgiler üretir." },
      ],
    },
    {
      id: "beceriler",
      title: "Beceriler",
      items: [
        { code: "BE1", title: "Alanında edindiği bilgileri kullanarak karşılaştığı sorunları araştırma yöntemleriyle çözümler." },
        { code: "BE2", title: "Alanındaki uzmanlık gerektiren bir çalışmayı bağımsız olarak planlar, yürütür ve değerlendirir." },
        { code: "BE3", title: "Yeni ve karmaşık fikirleri sistematik biçimde analiz eder, sentezler ve uygulamaya aktarır." },
      ],
    },
    {
      id: "bagimsiz",
      title: "Bağımsız Çalışabilme ve Sorumluluk Alabilme",
      items: [
        { code: "BS1", title: "Alanıyla ilgili uzmanlık gerektiren bir çalışmayı bağımsız olarak yürütür." },
        { code: "BS2", title: "Uygulamada karşılaşılan karmaşık sorunların çözümü için sorumluluk alır." },
        { code: "BS3", title: "Alanıyla ilgili ekip çalışmalarında liderlik yapar ve çözüm yaklaşımları geliştirir." },
      ],
    },
    {
      id: "ogrenme",
      title: "Öğrenme Yetkinliği",
      items: [
        { code: "ÖY1", title: "Alanındaki bilgileri eleştirel bir yaklaşımla değerlendirir ve öğrenmesini yönlendirir." },
        { code: "ÖY2", title: "Yaşam boyu öğrenmeye ilişkin farkındalık geliştirir ve akademik gelişimini sürdürür." },
      ],
    },
    {
      id: "iletisim",
      title: "İletişim ve Sosyal Yetkinlik",
      items: [
        { code: "İS1", title: "Alanındaki güncel gelişmeleri ve kendi çalışmalarını yazılı, sözlü ve görsel olarak aktarır." },
        { code: "İS2", title: "Sosyal ilişkileri ve bu ilişkileri yönlendiren normları eleştirel bakışla inceler." },
        { code: "İS3", title: "Bir yabancı dili kullanarak alanındaki bilgileri izler ve meslektaşlarıyla iletişim kurar." },
        { code: "İS4", title: "Alanının gerektirdiği bilişim ve iletişim teknolojilerini ileri düzeyde kullanır." },
      ],
    },
    {
      id: "alanaozgu",
      title: "Alana Özgü Yetkinlik",
      items: [
        { code: "AY1", title: "Alanıyla ilgili verileri toplarken, yorumlarken ve paylaşırken etik değerleri gözetir." },
        { code: "AY2", title: "Alanındaki uygulamaları toplumsal, bilimsel, kültürel ve etik değerler açısından denetler." },
        { code: "AY3", title: "Alanıyla ilgili strateji, politika ve uygulama planları geliştirir ve sonuçlarını değerlendirir." },
      ],
    },
  ],
  8: [
    {
      id: "bilgi",
      title: "Bilgi",
      items: [
        { code: "B1", title: "Alanındaki güncel ve ileri düzey bilgileri özgün düşünce ve araştırmayla uzmanlık düzeyinde geliştirir." },
        { code: "B2", title: "Alanına yenilik getirecek özgün tanım, yöntem, tasarım veya uygulamalar geliştirir." },
      ],
    },
    {
      id: "beceriler",
      title: "Beceriler",
      items: [
        { code: "BE1", title: "Alanındaki yeni bilgileri sistematik yaklaşımla değerlendirir ve kullanır." },
        { code: "BE2", title: "Özgün bir konuyu araştırır, kavrar, tasarlar, uyarlar ve uygular." },
      ],
    },
    {
      id: "bagimsiz",
      title: "Bağımsız Çalışabilme ve Sorumluluk Alabilme",
      items: [
        { code: "BS1", title: "Bilime yenilik getiren veya bilinen yöntemi yeni alana uygulayan özgün bir çalışma yürütür." },
        { code: "BS2", title: "Özgün araştırma sürecinde bağımsız çalışır ve akademik sorumluluk üstlenir." },
        { code: "BS3", title: "Alanındaki sorunların çözümünde yaratıcı ve eleştirel kararlar geliştirir." },
        { code: "BS4", title: "Bilimsel çalışmaları ulusal veya uluslararası düzeyde yayımlanabilir niteliğe taşır." },
      ],
    },
    {
      id: "ogrenme",
      title: "Öğrenme Yetkinliği",
      items: [
        { code: "ÖY1", title: "Yaratıcı ve eleştirel düşünme, problem çözme ve karar verme süreçleriyle yeni düşünceler geliştirir." },
        { code: "ÖY2", title: "Alanında üst düzey öğrenme süreçlerini bağımsız ve sürekli biçimde yönetir." },
      ],
    },
    {
      id: "iletisim",
      title: "İletişim ve Sosyal Yetkinlik",
      items: [
        { code: "İS1", title: "Uzman kişilerle alanındaki konuları tartışır ve özgün görüşlerini savunur." },
        { code: "İS2", title: "Alanındaki bilimsel ve teknolojik gelişmeleri toplumsal bağlamda değerlendirir." },
        { code: "İS3", title: "Bir yabancı dili kullanarak ileri düzey yazılı, sözlü ve görsel iletişim kurar." },
        { code: "İS4", title: "Alanıyla ilgili uluslararası platformlarda etkili iletişim ve iş birliği yürütür." },
      ],
    },
    {
      id: "alanaozgu",
      title: "Alana Özgü Yetkinlik",
      items: [
        { code: "AY1", title: "Akademik ve mesleki bağlamda etik ilkelerin gelişimine katkı sağlar." },
        { code: "AY2", title: "Alanıyla ilgili sorunların çözümünde stratejik karar süreçlerini kullanır." },
        { code: "AY3", title: "Toplumsal, bilimsel ve mesleki gelişime katkı sağlayacak özgün uygulamalar geliştirir." },
      ],
    },
  ],
};

const makeSeed = (items: TyycItem[]) => Object.fromEntries(
  items.map((item, rowIndex) => [
    item.code,
    Array.from({ length: 18 }, (_, columnIndex) => {
      if ((columnIndex + rowIndex) % 6 === 0) return 3;
      if ((columnIndex + rowIndex) % 4 === 0) return 2;
      if ((columnIndex + rowIndex) % 3 === 0) return 1;
      return 0;
    }),
  ]),
);

export function ProgramTyycMatrix({ outcomeCount, programLevel = "Tezli Yüksek Lisans" }: { outcomeCount: number; programLevel?: string }) {
  const tyycLevel: TyycLevel = programLevel === "Doktora" ? 8 : 7;
  const groups = tyycGroups[tyycLevel];
  const [relations, setRelations] = useState<Record<string, number[]>>(() => makeSeed([...tyycGroups[7], ...tyycGroups[8]].flatMap((group) => group.items)));
  const columns = useMemo(() => Array.from({ length: outcomeCount }, (_, index) => `PÇ${index + 1}`), [outcomeCount]);
  const setRelation = (code: string, index: number, value: number) => setRelations((current) => ({
    ...current,
    [code]: Array.from({ length: outcomeCount }, (_, itemIndex) => itemIndex === index ? value : (current[code]?.[itemIndex] ?? 0)),
  }));

  return <section className="program-content-card tyyc-card">
    <div className="tyyc-heading">
      <div><label>PÇ-TYYÇ İlişki Matrisi</label><small>Her TYYÇ yeterliliğinin program çıktılarıyla ilişki düzeyini tanımlayın.</small></div>
      <span>TYYÇ Seviye {tyycLevel} · {programLevel}</span>
    </div>
    <div className="tyyc-legend" aria-label="İlişki düzeyi açıklaması">
      <Info size={14}/><b>İlişki düzeyi:</b><i className="level-0">0</i><span>Yok</span><i className="level-1">1</i><span>Düşük</span><i className="level-2">2</i><span>Orta</span><i className="level-3">3</i><span>Güçlü</span>
    </div>
    <div className="tyyc-scroll">
      <div className="tyyc-column-head" style={{ "--pc-count": outcomeCount } as React.CSSProperties}>
        <strong>TYYÇ yeterliliği</strong>{columns.map((column) => <b key={column}>{column}</b>)}
      </div>
      {groups.map((group, groupIndex) => <details className="tyyc-group" open={groupIndex === 0} key={group.id}>
        <summary><span>{group.title}</span><small>{group.items.length} yeterlilik · {group.items.reduce((total, item) => total + (relations[item.code]?.slice(0, outcomeCount).filter(Boolean).length ?? 0), 0)} ilişki</small><ChevronDown size={16}/></summary>
        <div className="tyyc-rows">
          {group.items.map((item) => <div className="tyyc-row" style={{ "--pc-count": outcomeCount } as React.CSSProperties} key={item.code}>
            <div><b>{item.code}</b><span>{item.title}</span></div>
            {columns.map((column, index) => {
              const value = relations[item.code]?.[index] ?? 0;
              return <select className={`relation-select level-${value}`} value={value} onChange={(event) => setRelation(item.code, index, Number(event.target.value))} aria-label={`${item.code} ile ${column} ilişki düzeyi`} key={column}>
                <option value="0">0</option><option value="1">1</option><option value="2">2</option><option value="3">3</option>
              </select>;
            })}
          </div>)}
        </div>
      </details>)}
    </div>
  </section>;
}

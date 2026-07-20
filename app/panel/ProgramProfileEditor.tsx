"use client";
import { MessageSquareWarning, Plus, Save, Trash2, X } from "lucide-react";
import { useState } from "react";
import { ProgramTyycMatrix } from "./ProgramTyycMatrix";
import { OutcomeQualityHint } from "./outcomeQuality";

const initialOutcomes=["Alanındaki güncel ve ileri düzey bilgileri uzmanlık düzeyinde geliştirir.","Bilimsel araştırma yöntemlerini etkin biçimde kullanır.","Alanındaki bir problemi bağımsız olarak kurgular ve çözümler.","Araştırma sonuçlarını bilimsel etik kurallarına uygun raporlar.","Disiplinler arası çalışmalarda sorumluluk üstlenir.","Alan uygulamalarında karşılaşılan sorunlara özgün çözümler geliştirir.","Bilimsel ve teknolojik gelişmeleri eleştirel yaklaşımla değerlendirir.","Mesleki bilgilerini ulusal ve uluslararası platformlarda paylaşır.","Alanına ilişkin verileri toplar, yorumlar ve uygular.","Yaşam boyu öğrenme yaklaşımını benimser.","Toplumsal, bilimsel ve etik değerlere uygun hareket eder.","Yabancı dil kullanarak alan yazınını takip eder ve iletişim kurar."];

const sections=[
 ["Program Tarihçesi (Kuruluş Tarihi, Programın Genel Yapısı)","Program, lisansüstü eğitim ve araştırma faaliyetlerini yürütmek amacıyla açılmıştır. Kuruluş tarihi, gelişim süreci ve programın genel akademik yapısı bu alanda açıklanır."],
 ["Program Profili (Programın Amacı, Programın Yapısı ve Süresi, Uzmanlık Alanları, Bölüm Olanakları)","Program; alanında ileri düzey bilgi, araştırma ve uygulama becerilerine sahip uzmanlar yetiştirmeyi amaçlar. Programın yapısı, süresi, uzmanlık alanları ve bölüm olanakları burada açıklanır."],
 ["Ders Yapısı ve Kredileri","Programın zorunlu ve seçmeli ders yapısı, kredi dağılımı, seminer, uzmanlık alan dersi ve tez çalışmasına ilişkin esaslar burada açıklanır."],
 ["Mezuniyet Koşulları","Öğrencinin tamamlaması gereken toplam kredi ve AKTS, asgari not ortalaması, seminer, tez ve savunma koşulları burada açıklanır."],
 ["Sınavlar, Ölçme ve Değerlendirme","Derslerde kullanılan sınav, ödev, proje, sunum ve diğer ölçme-değerlendirme yöntemleri ile başarı koşulları burada açıklanır."],
 ["Üst Derece Programlarına Geçiş","Programı başarıyla tamamlayan mezunların başvurabileceği üst derece programları ve koşulları burada açıklanır."],
 ["Önceki Öğrenmenin Tanınması","Yatay geçiş, muafiyet ve intibak işlemleri ile önceki öğrenmelerin tanınmasına ilişkin esaslar burada açıklanır."],
 ["Mezunların Mesleki Profilleri","Mezunların kamu, özel sektör, akademi ve diğer çalışma alanlarındaki mesleki olanakları burada açıklanır."],
 ["Kabul ve Kayıt Koşulları","Diploma, ALES, yabancı dil, bilim sınavı, değerlendirme ve kesin kayıt koşulları burada açıklanır."],
] as const;

export function ProgramProfileEditor({
 department,
 onSave,
 programName = "Biyoloji",
 initialLevel = "Tezli Yüksek Lisans",
 mode = "edit",
 availableLevels = [initialLevel],
}:{department:string;onSave:()=>void;programName?:string;initialLevel?:string;mode?:"edit"|"review"|"admin";availableLevels?:string[]}){
 const[outcomes,setOutcomes]=useState(initialOutcomes);
 const[programLevel,setProgramLevel]=useState(initialLevel);
 const[correctionOpen,setCorrectionOpen]=useState(false);
 const[correctionNote,setCorrectionNote]=useState("");
 const addOutcome=()=>setOutcomes(items=>[...items,""]);
 const updateOutcome=(index:number,value:string)=>setOutcomes(items=>items.map((item,itemIndex)=>itemIndex===index?value:item));
 const removeOutcome=(index:number)=>setOutcomes(items=>items.filter((_,itemIndex)=>itemIndex!==index));
 return <section className="program-editor"><div className="panel-intro"><div><h2>Program genel bilgileri</h2><p>{mode==="review"?"Program bilgilerini inceleyin; gerekiyorsa ABD/ASD başkanından düzeltme isteyin.":"ABD/ASD programının public Bologna profilinde yayımlanacak bilgileri düzenleyin."}</p><div className="program-level-strip">{availableLevels.map((level)=><button type="button" className={programLevel===level?"active":""} onClick={()=>setProgramLevel(level)} key={level}>{level.replace("Yüksek Lisans","YL")}</button>)}</div></div><span>{department}</span></div><form onSubmit={event=>{event.preventDefault();onSave()}}>
  <section className="program-summary-card"><h2>{programName} {programLevel==="Doktora"?"Doktora":"Yüksek Lisans"}</h2><div className="program-summary-grid"><label><span>Program adı</span><input defaultValue={`${programName} ${programLevel==="Doktora"?"Doktora":"Yüksek Lisans"}`}/></label><label><span>Program düzeyi</span><select value={programLevel} onChange={event=>setProgramLevel(event.target.value)}><option>Tezsiz Yüksek Lisans</option><option>Tezli Yüksek Lisans</option><option>Doktora</option></select></label><label><span>Kazanılan derece</span><input defaultValue={`${programName} ${programLevel==="Doktora"?"Doktora":"Yüksek Lisans"} Derecesi`}/></label><label><span>Program yöneticisi</span><input defaultValue="Prof. Dr. Program Yöneticisi"/></label><label className="wide"><span>Yeterlilik koşulları ve kuralları</span><input defaultValue={programLevel==="Doktora"?"4 yıl, 8 yarıyıl ve doktora yeterlilik/tez süreçleri":"2 yıl (120 AKTS), 4 yarıyıl, her yarıyılda 16–18 hafta"}/></label><label><span>Öğrenim dili</span><select defaultValue="Türkçe"><option>Türkçe</option><option>İngilizce</option><option>Türkçe / İngilizce</option></select></label></div></section>
  {sections.slice(0,2).map(([title,value])=><section className="program-content-card" key={title}><label>{title}</label><textarea defaultValue={value}/></section>)}
  <section className="program-content-card outcomes-card"><div className="card-title-row"><div><label>Program Çıktıları / Öğrenme Kazanımları</label><small>Başlangıçta 12 çıktı tanımlıdır. Gerektiğinde yeni madde ekleyebilir veya silebilirsiniz.</small></div><button type="button" onClick={addOutcome}><Plus size={14}/>Çıktı Ekle</button></div><ol>{outcomes.map((outcome,index)=><li key={index}><span>{index+1}</span><div className="outcome-input-wrap"><textarea value={outcome} onChange={event=>updateOutcome(index,event.target.value)}/><OutcomeQualityHint text={outcome} kind="program"/></div><button type="button" onClick={()=>removeOutcome(index)} aria-label={`${index+1}. çıktıyı sil`}><Trash2 size={14}/></button></li>)}</ol></section>
  <section className="program-content-card"><label>{sections[8][0]}</label><textarea defaultValue={sections[8][1]}/></section>
  {sections.slice(2,8).map(([title,value])=><section className="program-content-card" key={title}><label>{title}</label><textarea defaultValue={value}/></section>)}
  <ProgramTyycMatrix outcomeCount={outcomes.length} programLevel={programLevel}/>
  <div className="sticky-save"><span>{mode==="admin"?"Admin müdahalesi istisnai durumlar için kullanılmalıdır.":mode==="review"?"Enstitü rolleri bilgiyi doğrudan değiştirmez; düzeltme isteği oluşturur.":"Değişiklikler taslak olarak kaydedilir."}</span><div className="sticky-save-actions">{mode==="admin"?<><button type="button" onClick={()=>setCorrectionOpen(true)}><MessageSquareWarning size={15}/>Düzeltme İste</button><button><Save size={15}/>Kaydet</button></>:mode==="review"?<button type="button" onClick={()=>setCorrectionOpen(true)}><MessageSquareWarning size={15}/>Düzeltme İste</button>:<button><Save size={15}/>Kaydet</button>}</div></div>
 </form>{correctionOpen&&<div className="review-modal-backdrop"><section className="correction-modal"><header><div><small>PROGRAM BİLGİSİ DÜZELTME TALEBİ</small><h2>{programName}</h2></div><button onClick={()=>setCorrectionOpen(false)} aria-label="Kapat"><X size={17}/></button></header><form onSubmit={(event)=>{event.preventDefault();const notifications=JSON.parse(localStorage.getItem("lee-dbp-notifications")||"[]") as Array<Record<string,string>>;notifications.unshift({kind:"Program bilgisi",target:programName,route:"Enstitü rolü → ABD/ASD Başkanı",note:correctionNote,date:new Date().toISOString(),status:"Düzeltme istendi"});localStorage.setItem("lee-dbp-notifications",JSON.stringify(notifications));setCorrectionOpen(false);setCorrectionNote("");onSave();}}><label><span>Düzeltme nedeni ve açıklaması</span><textarea required value={correctionNote} onChange={(event)=>setCorrectionNote(event.target.value)} placeholder="Hangi alanın neden düzeltilmesi gerektiğini yazın. Örn. Program çıktısı 4 ölçülebilir değil; kabul koşulları güncel mevzuatla uyumlu olmalı."/></label><small>Bu talep ABD/ASD başkanı çalışma alanına bildirim olarak düşer.</small><footer><button type="button" onClick={()=>setCorrectionOpen(false)}>Vazgeç</button><button className="request" type="submit"><MessageSquareWarning size={14}/>Düzeltme Talebini Gönder</button></footer></form></section></div>}</section>;
}

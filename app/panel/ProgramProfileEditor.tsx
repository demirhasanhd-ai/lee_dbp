"use client";
import { MessageSquareWarning, Plus, Save, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { fetchProgramProfile, getProgramProfile, saveProgramProfile } from "../../lib/data/programProfiles";
import type { ProgramProfile, ProgramTyycRow } from "../../lib/data/programProfiles";
import { ProgramTyycMatrix } from "./ProgramTyycMatrix";
import { OutcomeQualityHint } from "./outcomeQuality";

const initialOutcomes=["Alanındaki güncel ve ileri düzey bilgileri uzmanlık düzeyinde geliştirir.","Bilimsel araştırma yöntemlerini etkin biçimde kullanır.","Alanındaki bir problemi bağımsız olarak kurgular ve çözümler.","Araştırma sonuçlarını bilimsel etik kurallarına uygun raporlar.","Disiplinler arası çalışmalarda sorumluluk üstlenir.","Alan uygulamalarında karşılaşılan sorunlara özgün çözümler geliştirir.","Bilimsel ve teknolojik gelişmeleri eleştirel yaklaşımla değerlendirir.","Mesleki bilgilerini ulusal ve uluslararası platformlarda paylaşır.","Alanına ilişkin verileri toplar, yorumlar ve uygular.","Yaşam boyu öğrenme yaklaşımını benimser.","Toplumsal, bilimsel ve etik değerlere uygun hareket eder.","Yabancı dil kullanarak alan yazınını takip eder ve iletişim kurar."];

const defaultSections=[
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
 const initialProfile=getProgramProfile(programName,initialLevel);
 const[outcomes,setOutcomes]=useState(()=>initialProfile?.outcomes??initialOutcomes);
 const[profile,setProfile]=useState<ProgramProfile|undefined>(()=>initialProfile);
 const[tyycRows,setTyycRows]=useState<ProgramTyycRow[]>(()=>initialProfile?.tyycRows??[]);
 const[saveError,setSaveError]=useState("");
 const[programLevel,setProgramLevel]=useState(initialLevel);
 const[correctionOpen,setCorrectionOpen]=useState(false);
 const[correctionNote,setCorrectionNote]=useState("");
 const sections=profile?.sections??defaultSections.map(([title,text])=>({title,text}));
 useEffect(()=>{let cancelled=false;const fallback=getProgramProfile(programName,programLevel);setProfile(fallback);setOutcomes(fallback?.outcomes??initialOutcomes);setTyycRows(fallback?.tyycRows??[]);fetchProgramProfile(programName,programLevel).then((nextProfile)=>{if(cancelled)return;setProfile(nextProfile);setOutcomes(nextProfile?.outcomes??initialOutcomes);setTyycRows(nextProfile?.tyycRows??[]);});return()=>{cancelled=true}},[programName,programLevel]);
 const selectLevel=(level:string)=>{setProgramLevel(level);setSaveError("")};
 const addOutcome=()=>setOutcomes(items=>[...items,""]);
 const updateOutcome=(index:number,value:string)=>setOutcomes(items=>items.map((item,itemIndex)=>itemIndex===index?value:item));
 const removeOutcome=(index:number)=>setOutcomes(items=>items.filter((_,itemIndex)=>itemIndex!==index));
 const persistProfile=async(event:FormEvent<HTMLFormElement>)=>{event.preventDefault();setSaveError("");const data=new FormData(event.currentTarget);try{const saved=await saveProgramProfile({programName,level:programLevel,degree:String(data.get("degree")??""),manager:String(data.get("manager")??""),language:String(data.get("language")??"Türkçe"),qualificationRules:String(data.get("qualificationRules")??""),sections:sections.map((section,index)=>({...section,text:String(data.get(`section-${index}`)??section.text)})),outcomes,tyycRows});setProfile(saved);setTyycRows(saved.tyycRows);onSave()}catch(error){setSaveError(error instanceof Error?error.message:"Program profili kaydedilemedi.")}};
 return <section className="program-editor"><div className="panel-intro"><div><h2>Program genel bilgileri</h2><p>{mode==="review"?"Program bilgilerini inceleyin; gerekiyorsa ABD/ASD başkanından düzeltme isteyin.":"ABD/ASD programının public Bologna profilinde yayımlanacak bilgileri düzenleyin."}</p><div className="program-level-strip">{availableLevels.map((level)=><button type="button" className={programLevel===level?"active":""} onClick={()=>selectLevel(level)} key={level}>{level.replace("Yüksek Lisans","YL")}</button>)}</div></div><span>{department}</span></div><form key={`${programName}-${programLevel}-${profile?.updatedAt??"seed"}`} onSubmit={persistProfile}>
  <section className="program-summary-card"><h2>{programName} {programLevel==="Doktora"?"Doktora":"Yüksek Lisans"}</h2><div className="program-summary-grid"><label><span>Program adı</span><input readOnly defaultValue={profile?`${profile.programName} ${profile.level}`:`${programName} ${programLevel==="Doktora"?"Doktora":"Yüksek Lisans"}`}/></label><label><span>Program düzeyi</span><select value={programLevel} onChange={event=>selectLevel(event.target.value)}>{availableLevels.map((level)=><option key={level}>{level}</option>)}</select></label><label><span>Kazanılan derece</span><input name="degree" defaultValue={profile?.degree??`${programName} ${programLevel==="Doktora"?"Doktora":"Yüksek Lisans"} Derecesi`}/></label><label><span>Program yöneticisi</span><input name="manager" defaultValue={profile?.manager??"Prof. Dr. Program Yöneticisi"}/></label><label className="wide"><span>Yeterlilik koşulları ve kuralları</span><textarea className="qualification-rules-input" name="qualificationRules" defaultValue={profile?.qualificationRules??(programLevel==="Doktora"?"4 yıl, 8 yarıyıl ve doktora yeterlilik/tez süreçleri":"2 yıl (120 AKTS), 4 yarıyıl, her yarıyılda 16–18 hafta")}/></label><label><span>Öğrenim dili</span><select name="language" defaultValue={profile?.language??"Türkçe"}><option>Türkçe</option><option>İngilizce</option><option>Türkçe / İngilizce</option></select></label></div></section>
  {sections.slice(0,2).map(({title,text},index)=><section className="program-content-card" key={title}><label>{title}</label><textarea name={`section-${index}`} defaultValue={text}/></section>)}
  <section className="program-content-card outcomes-card"><div className="card-title-row"><div><label>Program Çıktıları / Öğrenme Kazanımları</label><small>Başlangıçta 12 çıktı tanımlıdır. Gerektiğinde yeni madde ekleyebilir veya silebilirsiniz.</small></div><button type="button" onClick={addOutcome}><Plus size={14}/>Çıktı Ekle</button></div><ol>{outcomes.map((outcome,index)=><li key={index}><span>{index+1}</span><div className="outcome-input-wrap"><textarea value={outcome} onChange={event=>updateOutcome(index,event.target.value)}/><OutcomeQualityHint text={outcome} kind="program"/></div><button type="button" onClick={()=>removeOutcome(index)} aria-label={`${index+1}. çıktıyı sil`}><Trash2 size={14}/></button></li>)}</ol></section>
  <section className="program-content-card"><label>{sections[8].title}</label><textarea name="section-8" defaultValue={sections[8].text}/></section>
  {sections.slice(2,8).map(({title,text},offset)=><section className="program-content-card" key={title}><label>{title}</label><textarea name={`section-${offset+2}`} defaultValue={text}/></section>)}
  <ProgramTyycMatrix key={`${programName}-${programLevel}-${profile?.updatedAt??"seed"}`} outcomeCount={outcomes.length} programLevel={programLevel} initialRows={tyycRows.length?tyycRows:profile?.tyycRows} onRowsChange={setTyycRows}/>
  <div className="sticky-save"><span>{saveError|| (mode==="admin"?"Admin müdahalesi istisnai durumlar için kullanılmalıdır.":mode==="review"?"Enstitü rolleri bilgiyi doğrudan değiştirmez; düzeltme isteği oluşturur.":"Değişiklikler veri tabanına kaydedilir.")}</span><div className="sticky-save-actions">{mode==="admin"?<><button type="button" onClick={()=>setCorrectionOpen(true)}><MessageSquareWarning size={15}/>Düzeltme İste</button><button><Save size={15}/>Kaydet</button></>:mode==="review"?<button type="button" onClick={()=>setCorrectionOpen(true)}><MessageSquareWarning size={15}/>Düzeltme İste</button>:<button><Save size={15}/>Kaydet</button>}</div></div>
 </form>{correctionOpen&&<div className="review-modal-backdrop"><section className="correction-modal"><header><div><small>PROGRAM BİLGİSİ DÜZELTME TALEBİ</small><h2>{programName}</h2></div><button onClick={()=>setCorrectionOpen(false)} aria-label="Kapat"><X size={17}/></button></header><form onSubmit={(event)=>{event.preventDefault();const notifications=JSON.parse(localStorage.getItem("lee-dbp-notifications")||"[]") as Array<Record<string,string>>;notifications.unshift({kind:"Program bilgisi",target:programName,route:"Enstitü rolü → ABD/ASD Başkanı",note:correctionNote,date:new Date().toISOString(),status:"Düzeltme istendi"});localStorage.setItem("lee-dbp-notifications",JSON.stringify(notifications));setCorrectionOpen(false);setCorrectionNote("");onSave();}}><label><span>Düzeltme nedeni ve açıklaması</span><textarea required value={correctionNote} onChange={(event)=>setCorrectionNote(event.target.value)} placeholder="Hangi alanın neden düzeltilmesi gerektiğini yazın. Örn. Program çıktısı 4 ölçülebilir değil; kabul koşulları güncel mevzuatla uyumlu olmalı."/></label><small>Bu talep ABD/ASD başkanı çalışma alanına bildirim olarak düşer.</small><footer><button type="button" onClick={()=>setCorrectionOpen(false)}>Vazgeç</button><button className="request" type="submit"><MessageSquareWarning size={14}/>Düzeltme Talebini Gönder</button></footer></form></section></div>}</section>;
}

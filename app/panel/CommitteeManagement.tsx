"use client";
import { Save, Trash2, UserPlus, Users } from "lucide-react";
import { useEffect, useId, useMemo, useState } from "react";
import { dbpPath } from "../../lib/dbpPath";
import { dbpSessionHeader } from "../../lib/dbpSessionHeader";

type CommitteeSession = {
  username: string;
  name: string;
  role: string;
  department: string;
  email?: string;
  tcKimlik?: string;
};

type InstructorOption = {
  id: string;
  name: string;
  title?: string | null;
  email?: string | null;
  departmentNames?: string[];
  source?: string;
};

type CommitteeMember = {
  username?: string;
  tcKimlik?: string;
  name: string;
  email?: string;
};

const trustedInstructorSources = new Set(["e_enstitu_api", "e_enstitu_database", "dbp_course_catalog"]);
const sameText = (left = "", right = "") =>
  left.trim().toLocaleLowerCase("tr-TR") === right.trim().toLocaleLowerCase("tr-TR");

export function CommitteeManagement({
  session,
  department,
  programName,
  onSave,
}: {
  session: CommitteeSession;
  department: string;
  programName: string;
  onSave: () => void;
}) {
  const [members, setMembers] = useState<CommitteeMember[]>([]);
  const [selectedInstructorName, setSelectedInstructorName] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [instructors, setInstructors] = useState<InstructorOption[]>([]);
  const [instructorsBusy, setInstructorsBusy] = useState(false);
  const instructorListId = useId();

  useEffect(() => {
    const controller = new AbortController();
    setMessage("");
    fetch(dbpPath(`/api/dbp/committee?department=${encodeURIComponent(department)}`), {
      headers: { "X-DBP-Session": dbpSessionHeader(session) },
      signal: controller.signal,
    })
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.message || "Komisyon listesi alınamadı.");
        setMembers(Array.isArray(data.members) ? data.members : []);
      })
      .catch((error) => {
        if (!controller.signal.aborted) setMessage(error instanceof Error ? error.message : "Komisyon listesi alınamadı.");
      });
    return () => controller.abort();
  }, [department, session.username, session.role, session.department]);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams();
    if (department) params.set("department", department);
    if (programName) params.set("programName", programName);
    setInstructorsBusy(true);
    fetch(dbpPath(`/api/dbp/instructors?${params.toString()}`), {
      headers: { "X-DBP-Session": dbpSessionHeader(session) },
      signal: controller.signal,
    })
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.message || "Akademisyen listesi alınamadı.");
        return data as { instructors?: InstructorOption[]; source?: string };
      })
      .then((data) => {
        setInstructors(Array.isArray(data.instructors) ? data.instructors : []);
        if (data.source && !trustedInstructorSources.has(data.source)) {
          setMessage("e-Enstitü veritabanına ulaşılamadığı için yedek akademisyen kaynağı kullanılıyor.");
        }
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setInstructors([]);
          setMessage(error instanceof Error ? error.message : "Akademisyen listesi alınamadı.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setInstructorsBusy(false);
      });
    return () => controller.abort();
  }, [department, programName, session]);

  const selectableInstructors = useMemo(() => {
    return instructors.filter((item) => item.name && !members.some((member) => sameText(member.name, item.name)));
  }, [instructors, members]);

  const addSelectedInstructor = () => {
    const selected = instructors.find((item) => sameText(item.name, selectedInstructorName));
    if (!selected) {
      setMessage("Komisyon üyesi eklemek için e-Enstitü akademisyen listesinden bir personel seçin.");
      return;
    }
    setMembers((current) => [
      ...current,
      {
        username: selected.id,
        name: selected.name,
        email: selected.email || "",
      },
    ]);
    setSelectedInstructorName("");
    setMessage("");
  };

  const saveMembers = async () => {
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch(dbpPath("/api/dbp/committee"), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-DBP-Session": dbpSessionHeader(session),
        },
        body: JSON.stringify({ department, programName, members }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "Komisyon kaydedilemedi.");
      setMembers(Array.isArray(data.members) ? data.members : members);
      setMessage("DBP komisyonu kaydedildi.");
      onSave();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Komisyon kaydedilemedi.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="committee-management">
      <div className="panel-intro">
        <div>
          <h2>Ders Bilgi Paketi Komisyonu</h2>
          <p>{department} kapsamındaki ders güncelleme talepleri önce bu komisyonun önüne düşer.</p>
        </div>
        <button className="primary-action" type="button" onClick={saveMembers} disabled={busy}>
          <Save size={14} />
          {busy ? "Kaydediliyor" : "Komisyonu Kaydet"}
        </button>
      </div>
      {message && <div className="database-message">{message}</div>}
      <div className="committee-grid">
        <section className="committee-picker">
          <header>
            <Users size={18} />
            <div>
              <b>Üye Ekle</b>
              <small>Akademisyen listesinden komisyon üyesi seçin.</small>
            </div>
          </header>
          <div className="committee-add-row">
            <input
              list={instructorListId}
              value={selectedInstructorName}
              onChange={(event) => setSelectedInstructorName(event.currentTarget.value)}
              disabled={instructorsBusy}
              placeholder={instructorsBusy ? "Akademisyenler yükleniyor" : "İsim yazın veya listeden seçin"}
              autoComplete="off"
            />
            <datalist id={instructorListId}>
              {selectableInstructors.map((item) => (
                <option
                  key={item.id}
                  value={item.name}
                  label={item.departmentNames?.length ? item.departmentNames.slice(0, 2).join(", ") : undefined}
                />
              ))}
            </datalist>
            <button type="button" onClick={addSelectedInstructor} disabled={!selectedInstructorName.trim() || instructorsBusy}>
              <UserPlus size={14} />
              Ekle
            </button>
          </div>
        </section>
        <section className="committee-list">
          <header>
            <b>Komisyon Üyeleri</b>
            <span>{members.length} kişi</span>
          </header>
          {members.length === 0 ? (
            <div className="committee-empty">Bu ABD / ASD için henüz komisyon üyesi eklenmedi.</div>
          ) : (
            members.map((member) => (
              <article key={`${member.name}-${member.email || member.username || ""}`}>
                <div>
                  <b>{member.name}</b>
                  <small>{member.email || "E-posta bilgisi yok"}</small>
                </div>
                <button
                  type="button"
                  aria-label={`${member.name} komisyon üyeliğinden çıkar`}
                  onClick={() => setMembers((current) => current.filter((item) => item !== member))}
                >
                  <Trash2 size={14} />
                </button>
              </article>
            ))
          )}
        </section>
      </div>
    </section>
  );
}

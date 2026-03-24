import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Toast from "../components/Toast";
import { glassBase, glassCard, glassCardLight, glassInput, glassBtnPrimary, glassBtnSecondary } from "../styles/glassStyles";

const DAYS_PT = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
const MONTHS_PT = ["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"];

function getWeekDays(ref) {
  const date = new Date(ref);
  const sunday = new Date(date);
  sunday.setDate(date.getDate() - date.getDay());
  return Array.from({ length: 7 }, (_, i) => { const d = new Date(sunday); d.setDate(sunday.getDate() + i); return d; });
}

function toISO(date) { return date.toISOString().split("T")[0]; }
const emptyForm = { patient: "", date: "", time: "", notes: "" };

export default function Agenda() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [reference, setReference] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(toISO(new Date()));
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const a = localStorage.getItem("appointments"); if (a) setAppointments(JSON.parse(a));
    const p = localStorage.getItem("patients"); if (p) setPatients(JSON.parse(p));
  }, []);
  useEffect(() => { localStorage.setItem("appointments", JSON.stringify(appointments)); }, [appointments]);

  function showToast(message, type = "success") { setToast({ message, type }); }
  const weekDays = getWeekDays(reference);
  function prevWeek() { const d = new Date(reference); d.setDate(d.getDate() - 7); setReference(d); }
  function nextWeek() { const d = new Date(reference); d.setDate(d.getDate() + 7); setReference(d); }
  function openModal() { setForm({ ...emptyForm, date: selectedDay }); setModalOpen(true); }
  function closeModal() { setModalOpen(false); setForm(emptyForm); }
  function handleField(f, v) { setForm((prev) => ({ ...prev, [f]: v })); }

  function saveAppointment() {
    if (!form.patient) return alert("Selecione um paciente.");
    if (!form.date) return alert("Selecione uma data.");
    if (!form.time) return alert("Selecione um horário.");
    setAppointments((prev) => [...prev, { ...form, id: Date.now() }]);
    showToast("Consulta agendada com sucesso!");
    closeModal();
  }

  function removeAppointment(id) {
    if (window.confirm("Remover esta consulta?")) {
      setAppointments((prev) => prev.filter((a) => a.id !== id));
      showToast("Consulta removida.", "info");
    }
  }

  const selectedDayAppts = appointments.filter((a) => a.date === selectedDay).sort((a, b) => a.time.localeCompare(b.time));
  const selectedDate = new Date(selectedDay + "T00:00:00");
  const selectedLabel = `${DAYS_PT[selectedDate.getDay()]}a, ${selectedDate.getDate()} de ${MONTHS_PT[selectedDate.getMonth()]}`;
  const monthYear = `${MONTHS_PT[weekDays[0].getMonth()]} de ${weekDays[0].getFullYear()}`;

  return (
    <div className="glass-page">
      <style>{glassBase}</style>
      <Sidebar />
      <div style={{ flex: 1, padding: "28px 32px", overflowY: "auto", position: "relative", zIndex: 1 }}>
        <div className="card-0" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
          <div>
            <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#fff", margin: 0 }}>Agenda</h1>
            <p style={{ margin: "4px 0 0", fontSize: "13px", color: "rgba(255,255,255,0.45)" }}>Gerencie suas consultas</p>
          </div>
          <button className="glass-btn-primary" onClick={openModal} style={{ ...glassBtnPrimary, padding: "10px 20px", fontSize: "14px" }}>+ Nova Consulta</button>
        </div>

        {/* Calendário */}
        <div className="card-1" style={{ ...glassCard, padding: "20px", marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <button onClick={prevWeek} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "8px", width: 32, height: 32, fontSize: "18px", cursor: "pointer", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>‹</button>
            <span style={{ fontWeight: 600, color: "#fff", fontSize: "15px", textTransform: "capitalize" }}>{monthYear}</span>
            <button onClick={nextWeek} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "8px", width: 32, height: 32, fontSize: "18px", cursor: "pointer", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>›</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "8px" }}>
            {weekDays.map((day) => {
              const iso = toISO(day);
              const isSelected = iso === selectedDay;
              const isToday = iso === toISO(new Date());
              const hasApp = appointments.some((a) => a.date === iso);
              return (
                <div key={iso} className="day-cell-glass" onClick={() => setSelectedDay(iso)}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "10px 4px", background: isSelected ? "rgba(33,150,243,0.3)" : isToday ? "rgba(255,255,255,0.08)" : "transparent", border: isSelected ? "1px solid rgba(33,150,243,0.5)" : "1px solid transparent" }}>
                  <span style={{ fontSize: "11px", fontWeight: 500, color: isSelected ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.4)", marginBottom: "6px" }}>{DAYS_PT[day.getDay()]}</span>
                  <span style={{ fontSize: "18px", fontWeight: 700, color: isSelected ? "#fff" : isToday ? "#60a5fa" : "rgba(255,255,255,0.8)" }}>{day.getDate()}</span>
                  {hasApp && <div style={{ width: 5, height: 5, borderRadius: "50%", background: isSelected ? "#fff" : "#60a5fa", marginTop: 4 }} />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Lista */}
        <div className="card-2" style={{ ...glassCard, padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#fff", margin: 0, textTransform: "capitalize" }}>{selectedLabel}</h2>
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", background: "rgba(255,255,255,0.08)", padding: "2px 8px", borderRadius: "20px" }}>{selectedDayAppts.length} consulta{selectedDayAppts.length !== 1 ? "s" : ""}</span>
          </div>
          {selectedDayAppts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: "rgba(255,255,255,0.3)" }}>
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>🕐</div>
              <p style={{ margin: 0, fontSize: "14px" }}>Nenhuma consulta neste dia</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {selectedDayAppts.map((a) => (
                <div key={a.id} className="appt-card-glass" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <div style={{ background: "rgba(33,150,243,0.2)", color: "#60a5fa", borderRadius: "8px", padding: "8px 12px", fontWeight: 700, fontSize: "13px", minWidth: "52px", textAlign: "center", border: "1px solid rgba(33,150,243,0.3)" }}>{a.time}</div>
                    <div>
                      <strong style={{ fontSize: "14px", color: "#fff" }}>{a.patient}</strong>
                      {a.notes && <p style={{ margin: 0, fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>{a.notes}</p>}
                    </div>
                  </div>
                  <button onClick={() => removeAppointment(a.id)} style={{ background: "rgba(239,68,68,0.15)", color: "#f87171", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "8px", padding: "6px 12px", cursor: "pointer", fontSize: "13px", fontWeight: 500 }}>Remover</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {modalOpen && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}>
          <div className="modal-box" style={{ ...glassCardLight, width: "100%", maxWidth: "460px", padding: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "22px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#fff", margin: 0 }}>Nova Consulta</h2>
              <button onClick={closeModal} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "8px", width: 32, height: 32, cursor: "pointer", color: "rgba(255,255,255,0.7)", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <Field label="Paciente" required>
                <select className="glass-input-field" value={form.patient} onChange={(e) => handleField("patient", e.target.value)} style={{ ...glassInput, colorScheme: "dark" }}>
                  <option value="" style={{ background: "#0d2144" }}>Selecionar paciente</option>
                  {patients.map((p) => <option key={p.id} value={p.name} style={{ background: "#0d2144" }}>{p.name}</option>)}
                </select>
              </Field>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <Field label="Data" required><input className="glass-input-field" type="date" value={form.date} onChange={(e) => handleField("date", e.target.value)} style={{ ...glassInput, colorScheme: "dark" }} /></Field>
                <Field label="Horário" required><input className="glass-input-field" type="time" value={form.time} onChange={(e) => handleField("time", e.target.value)} style={{ ...glassInput, colorScheme: "dark" }} /></Field>
              </div>
              <Field label="Observações"><textarea className="glass-input-field" placeholder="Detalhes da consulta..." value={form.notes} onChange={(e) => handleField("notes", e.target.value)} style={{ ...glassInput, minHeight: "80px", resize: "vertical" }} /></Field>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "22px", paddingTop: "18px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
              <button onClick={closeModal} style={{ ...glassBtnSecondary, padding: "9px 20px", fontSize: "14px" }}>Cancelar</button>
              <button onClick={saveAppointment} style={{ ...glassBtnPrimary, padding: "9px 22px", fontSize: "14px" }}>Agendar</button>
            </div>
          </div>
        </div>
      )}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
      <label style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>{label}{required && <span style={{ color: "#60a5fa", marginLeft: 2 }}>*</span>}</label>
      {children}
    </div>
  );
}
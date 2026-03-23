import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";

const animStyle = `
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideScale { from { opacity: 0; transform: translateY(24px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
  .modal-overlay { animation: fadeIn 0.2s ease; }
  .modal-box { animation: slideScale 0.25s cubic-bezier(0.34,1.56,0.64,1); }
  .input-field { transition: border-color 0.2s, box-shadow 0.2s; }
  .input-field:focus { border-color: #2563eb !important; box-shadow: 0 0 0 3px rgba(37,99,235,0.12) !important; outline: none; }
  .btn-primary-anim { transition: background 0.15s, transform 0.1s; }
  .btn-primary-anim:hover { background: #1d4ed8 !important; }
  .btn-primary-anim:active { transform: scale(0.97); }
  .btn-cancel-anim { transition: background 0.15s; }
  .btn-cancel-anim:hover { background: #f4f6f8 !important; }
  .day-cell { transition: background 0.15s, transform 0.1s; cursor: pointer; }
  .day-cell:hover { transform: scale(1.05); }
  .appt-card { transition: box-shadow 0.15s, transform 0.15s; }
  .appt-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08); transform: translateY(-1px); }
`;

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

  useEffect(() => {
    const a = localStorage.getItem("appointments"); if (a) setAppointments(JSON.parse(a));
    const p = localStorage.getItem("patients"); if (p) setPatients(JSON.parse(p));
  }, []);

  useEffect(() => { localStorage.setItem("appointments", JSON.stringify(appointments)); }, [appointments]);

  const weekDays = getWeekDays(reference);
  function prevWeek() { const d = new Date(reference); d.setDate(d.getDate() - 7); setReference(d); }
  function nextWeek() { const d = new Date(reference); d.setDate(d.getDate() + 7); setReference(d); }
  function openModal() { setForm({ ...emptyForm, date: selectedDay }); setModalOpen(true); }
  function closeModal() { setModalOpen(false); setForm(emptyForm); }
  function handleField(field, value) { setForm((f) => ({ ...f, [field]: value })); }

  function saveAppointment() {
    if (!form.patient) return alert("Selecione um paciente.");
    if (!form.date) return alert("Selecione uma data.");
    if (!form.time) return alert("Selecione um horário.");
    setAppointments((prev) => [...prev, { ...form, id: Date.now() }]);
    closeModal();
  }

  function removeAppointment(id) {
    if (window.confirm("Deseja remover esta consulta?"))
      setAppointments((prev) => prev.filter((a) => a.id !== id));
  }

  const selectedDayAppointments = appointments.filter((a) => a.date === selectedDay).sort((a, b) => a.time.localeCompare(b.time));
  const selectedDate = new Date(selectedDay + "T00:00:00");
  const selectedLabel = `${DAYS_PT[selectedDate.getDay()]}a, ${selectedDate.getDate()} de ${MONTHS_PT[selectedDate.getMonth()]}`;
  const monthYear = `${MONTHS_PT[weekDays[0].getMonth()]} de ${weekDays[0].getFullYear()}`;

  return (
    <div style={{ display: "flex", background: "#f0f4f8", minHeight: "100vh" }}>
      <style>{animStyle}</style>
      <Sidebar />

      <div style={{ flex: 1, padding: "28px 32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
          <div>
            <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#1a1a2e", margin: 0 }}>Agenda</h1>
            <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#888" }}>Gerencie suas consultas</p>
          </div>
          <button className="btn-primary-anim" onClick={openModal} style={{ background: "#2563eb", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "8px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>+ Nova Consulta</button>
        </div>

        {/* Calendário */}
        <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "20px", marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <button onClick={prevWeek} style={{ background: "transparent", border: "1px solid #e2e8f0", borderRadius: "6px", width: 32, height: 32, fontSize: "18px", cursor: "pointer", color: "#555" }}>‹</button>
            <span style={{ fontWeight: 600, color: "#1e3a8a", fontSize: "15px", textTransform: "capitalize" }}>{monthYear}</span>
            <button onClick={nextWeek} style={{ background: "transparent", border: "1px solid #e2e8f0", borderRadius: "6px", width: 32, height: 32, fontSize: "18px", cursor: "pointer", color: "#555" }}>›</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "8px" }}>
            {weekDays.map((day) => {
              const iso = toISO(day);
              const isSelected = iso === selectedDay;
              const isToday = iso === toISO(new Date());
              const hasApp = appointments.some((a) => a.date === iso);
              return (
                <div key={iso} className="day-cell" onClick={() => setSelectedDay(iso)}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "10px 6px", borderRadius: "10px", background: isSelected ? "#2563eb" : isToday ? "#eff6ff" : "transparent" }}>
                  <span style={{ fontSize: "11px", fontWeight: 500, color: isSelected ? "rgba(255,255,255,0.8)" : "#888", marginBottom: "6px" }}>{DAYS_PT[day.getDay()]}</span>
                  <span style={{ fontSize: "18px", fontWeight: 700, color: isSelected ? "#fff" : isToday ? "#2563eb" : "#1a1a2e" }}>{day.getDate()}</span>
                  {hasApp && <div style={{ width: 6, height: 6, borderRadius: "50%", background: isSelected ? "#fff" : "#2563eb", marginTop: 4 }} />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Lista */}
        <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#1e3a8a", margin: 0, textTransform: "capitalize" }}>{selectedLabel}</h2>
            <span style={{ fontSize: "13px", color: "#aaa" }}>({selectedDayAppointments.length} consulta{selectedDayAppointments.length !== 1 ? "s" : ""})</span>
          </div>
          {selectedDayAppointments.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#aaa" }}>
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>🕐</div>
              <p style={{ margin: 0, fontSize: "14px" }}>Nenhuma consulta neste dia</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {selectedDayAppointments.map((a) => (
                <div key={a.id} className="appt-card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderRadius: "10px", border: "1px solid #e2e8f0", background: "#f8f9fc" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <div style={{ background: "#dbeafe", color: "#2563eb", borderRadius: "8px", padding: "8px 12px", fontWeight: 700, fontSize: "14px", minWidth: "52px", textAlign: "center" }}>{a.time}</div>
                    <div>
                      <strong style={{ fontSize: "14px", color: "#1a1a2e" }}>{a.patient}</strong>
                      {a.notes && <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>{a.notes}</p>}
                    </div>
                  </div>
                  <button onClick={() => removeAppointment(a.id)} style={{ background: "#fee2e2", color: "#ef4444", border: "none", borderRadius: "6px", padding: "6px 12px", cursor: "pointer", fontSize: "13px", fontWeight: 500 }}>Remover</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}>
          <div className="modal-box" style={{ background: "#fff", borderRadius: "14px", width: "100%", maxWidth: "460px", padding: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "22px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#1a1a2e", margin: 0 }}>Nova Consulta</h2>
              <button onClick={closeModal} style={{ background: "transparent", border: "none", fontSize: "20px", cursor: "pointer", color: "#888" }}>✕</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <Field label="Paciente" required>
                <select className="input-field" value={form.patient} onChange={(e) => handleField("patient", e.target.value)} style={inputStyle}>
                  <option value="">Selecionar paciente</option>
                  {patients.map((p) => <option key={p.id} value={p.name}>{p.name}</option>)}
                </select>
              </Field>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <Field label="Data" required><input className="input-field" type="date" value={form.date} onChange={(e) => handleField("date", e.target.value)} style={inputStyle} /></Field>
                <Field label="Horário" required><input className="input-field" type="time" value={form.time} onChange={(e) => handleField("time", e.target.value)} style={inputStyle} /></Field>
              </div>
              <Field label="Observações"><textarea className="input-field" placeholder="Detalhes da consulta..." value={form.notes} onChange={(e) => handleField("notes", e.target.value)} style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }} /></Field>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "22px", paddingTop: "18px", borderTop: "1px solid #e8eaef" }}>
              <button className="btn-cancel-anim" onClick={closeModal} style={{ padding: "9px 20px", borderRadius: "7px", border: "1.5px solid #dde1ea", background: "#fff", fontSize: "14px", fontWeight: 600, color: "#555", cursor: "pointer" }}>Cancelar</button>
              <button className="btn-primary-anim" onClick={saveAppointment} style={{ padding: "9px 22px", borderRadius: "7px", border: "none", background: "#2563eb", color: "#fff", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>Agendar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
      <label style={{ fontSize: "13px", fontWeight: 600, color: "#444" }}>{label}{required && <span style={{ color: "#2563eb", marginLeft: 2 }}>*</span>}</label>
      {children}
    </div>
  );
}

const inputStyle = { background: "#f8f9fc", border: "1.5px solid #e2e5ee", borderRadius: "7px", padding: "10px 12px", fontSize: "14px", color: "#1a1a2e", fontFamily: "inherit", width: "100%", boxSizing: "border-box" };
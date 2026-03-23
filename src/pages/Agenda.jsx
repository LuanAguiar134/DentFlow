import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";

const DAYS_PT = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
const MONTHS_PT = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

function getWeekDays(referenceDate) {
  const date = new Date(referenceDate);
  const day = date.getDay();
  const sunday = new Date(date);
  sunday.setDate(date.getDate() - day);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i);
    return d;
  });
}

function toISO(date) {
  return date.toISOString().split("T")[0];
}

const emptyForm = { patient: "", date: "", time: "", procedure: "", obs: "" };

export default function Agenda() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [reference, setReference] = useState(new Date());
  const [selected, setSelected] = useState(toISO(new Date()));
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    const saved = localStorage.getItem("appointments");
    if (saved) setAppointments(JSON.parse(saved));

    const savedPatients = localStorage.getItem("patients");
    if (savedPatients) setPatients(JSON.parse(savedPatients));
  }, []);

  useEffect(() => {
    localStorage.setItem("appointments", JSON.stringify(appointments));
  }, [appointments]);

  const weekDays = getWeekDays(reference);

  function prevWeek() {
    const d = new Date(reference);
    d.setDate(d.getDate() - 7);
    setReference(d);
  }

  function nextWeek() {
    const d = new Date(reference);
    d.setDate(d.getDate() + 7);
    setReference(d);
  }

  function openModal() {
    setForm({ ...emptyForm, date: selected });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setForm(emptyForm);
  }

  function handleField(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

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

  const selectedDate = new Date(selected + "T00:00:00");
  const selectedLabel = `${DAYS_PT[selectedDate.getDay()]}, ${selectedDate.getDate()} de ${MONTHS_PT[selectedDate.getMonth()]}`;
  const dayAppointments = appointments
    .filter((a) => a.date === selected)
    .sort((a, b) => a.time.localeCompare(b.time));

  const monthLabel = `${MONTHS_PT[weekDays[0].getMonth()]} de ${weekDays[0].getFullYear()}`;

  return (
    <div style={{ display: "flex", background: "#f4f6f8", minHeight: "100vh" }}>
      <Sidebar />

      <div style={{ flex: 1, padding: "28px 32px" }}>
        {/* Topbar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
          <div>
            <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#1e3a8a", margin: 0 }}>Agenda</h1>
            <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#888" }}>Gerencie suas consultas</p>
          </div>
          <button onClick={openModal} style={btnPrimary}>
            + Nova Consulta
          </button>
        </div>

        {/* Calendário semanal */}
        <div style={{
          background: "white",
          borderRadius: "12px",
          border: "1px solid #e8edf5",
          padding: "20px",
          marginBottom: "20px",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <button onClick={prevWeek} style={navBtn}>‹</button>
            <span style={{ fontWeight: 600, fontSize: "15px", color: "#1e3a8a", textTransform: "capitalize" }}>
              {monthLabel}
            </span>
            <button onClick={nextWeek} style={navBtn}>›</button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "8px" }}>
            {weekDays.map((d) => {
              const iso = toISO(d);
              const isSelected = iso === selected;
              const isToday = iso === toISO(new Date());
              const hasAppt = appointments.some((a) => a.date === iso);

              return (
                <div
                  key={iso}
                  onClick={() => setSelected(iso)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: "10px 6px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    background: isSelected ? "#2563eb" : "transparent",
                    transition: "background 0.15s",
                  }}
                >
                  <span style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: isSelected ? "rgba(255,255,255,0.8)" : "#999",
                    marginBottom: "6px",
                  }}>
                    {DAYS_PT[d.getDay()]}
                  </span>
                  <span style={{
                    fontSize: "18px",
                    fontWeight: 700,
                    color: isSelected ? "#fff" : isToday ? "#2563eb" : "#1a1a2e",
                  }}>
                    {d.getDate()}
                  </span>
                  {hasAppt && (
                    <div style={{
                      width: 6, height: 6,
                      borderRadius: "50%",
                      background: isSelected ? "#fff" : "#2563eb",
                      marginTop: 4,
                    }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Consultas do dia */}
        <div style={{
          background: "white",
          borderRadius: "12px",
          border: "1px solid #e8edf5",
          padding: "20px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#1e3a8a", margin: 0, textTransform: "capitalize" }}>
              {selectedLabel}
            </h2>
            <span style={{
              background: "#f0f4ff",
              color: "#2563eb",
              fontSize: "12px",
              fontWeight: 600,
              padding: "2px 10px",
              borderRadius: "20px",
            }}>
              {dayAppointments.length} consulta{dayAppointments.length !== 1 ? "s" : ""}
            </span>
          </div>

          {dayAppointments.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 20px", color: "#bbb" }}>
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>🕐</div>
              <p style={{ margin: 0, fontSize: "14px" }}>Nenhuma consulta neste dia</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {dayAppointments.map((a) => (
                <div key={a.id} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "14px 16px",
                  borderRadius: "10px",
                  border: "1px solid #e8edf5",
                  background: "#fafbff",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <div style={{
                      background: "#dbeafe",
                      color: "#2563eb",
                      borderRadius: "8px",
                      padding: "8px 12px",
                      fontSize: "13px",
                      fontWeight: 700,
                      minWidth: "56px",
                      textAlign: "center",
                    }}>
                      {a.time}
                    </div>
                    <div>
                      <strong style={{ fontSize: "14px", color: "#1a1a2e" }}>{a.patient}</strong>
                      {a.procedure && (
                        <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>{a.procedure}</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => removeAppointment(a.id)}
                    style={{
                      background: "#fee2e2", color: "#ef4444",
                      border: "none", borderRadius: "6px",
                      padding: "6px 12px", fontSize: "12px",
                      fontWeight: 600, cursor: "pointer",
                    }}
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div
          onClick={(e) => e.target === e.currentTarget && closeModal()}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,0.45)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 999,
          }}
        >
          <div style={{
            background: "#fff", borderRadius: "14px",
            width: "100%", maxWidth: "480px", padding: "28px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "22px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#1a1a2e", margin: 0 }}>Nova Consulta</h2>
              <button onClick={closeModal} style={{ background: "transparent", border: "none", fontSize: "20px", cursor: "pointer", color: "#888" }}>✕</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <Field label="Paciente" required>
                <select
                  value={form.patient}
                  onChange={(e) => handleField("patient", e.target.value)}
                  style={inputStyle}
                >
                  <option value="">Selecionar paciente</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </Field>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <Field label="Data" required>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => handleField("date", e.target.value)}
                    style={inputStyle}
                  />
                </Field>
                <Field label="Horário" required>
                  <input
                    type="time"
                    value={form.time}
                    onChange={(e) => handleField("time", e.target.value)}
                    style={inputStyle}
                  />
                </Field>
              </div>

              <Field label="Procedimento">
                <input
                  type="text"
                  placeholder="Ex: Limpeza, Extração..."
                  value={form.procedure}
                  onChange={(e) => handleField("procedure", e.target.value)}
                  style={inputStyle}
                />
              </Field>

              <Field label="Observações">
                <textarea
                  placeholder="Observações adicionais..."
                  value={form.obs}
                  onChange={(e) => handleField("obs", e.target.value)}
                  style={{ ...inputStyle, minHeight: "70px", resize: "vertical" }}
                />
              </Field>
            </div>

            <div style={{
              display: "flex", justifyContent: "flex-end", gap: "10px",
              marginTop: "22px", paddingTop: "18px", borderTop: "1px solid #e8eaef",
            }}>
              <button onClick={closeModal} style={btnCancel}>Cancelar</button>
              <button onClick={saveAppointment} style={btnSubmit}>Agendar</button>
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
      <label style={{ fontSize: "13px", fontWeight: 600, color: "#444" }}>
        {label}{required && <span style={{ color: "#2563eb", marginLeft: 2 }}>*</span>}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  background: "#f8f9fc",
  border: "1.5px solid #e2e5ee",
  borderRadius: "7px",
  padding: "10px 12px",
  fontSize: "14px",
  color: "#1a1a2e",
  outline: "none",
  fontFamily: "inherit",
  width: "100%",
  boxSizing: "border-box",
};

const btnPrimary = {
  display: "flex", alignItems: "center", gap: "7px",
  background: "#2563eb", color: "#fff",
  border: "none", padding: "10px 20px",
  borderRadius: "8px", fontSize: "14px",
  fontWeight: 600, cursor: "pointer",
};

const navBtn = {
  background: "transparent", border: "1px solid #e2e8f0",
  borderRadius: "6px", width: "32px", height: "32px",
  cursor: "pointer", fontSize: "18px", color: "#555",
};

const btnCancel = {
  padding: "9px 20px", borderRadius: "7px",
  border: "1.5px solid #dde1ea", background: "#fff",
  fontSize: "14px", fontWeight: 600, color: "#555", cursor: "pointer",
};

const btnSubmit = {
  padding: "9px 22px", borderRadius: "7px",
  border: "none", background: "#2563eb",
  color: "#fff", fontSize: "14px",
  fontWeight: 600, cursor: "pointer",
};
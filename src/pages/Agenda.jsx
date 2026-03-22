import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";

export default function Agenda() {
  const [appointments, setAppointments] = useState([]);
  const [patient, setPatient] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("appointments");
    if (saved) setAppointments(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("appointments", JSON.stringify(appointments));
  }, [appointments]);

  function addAppointment(e) {
    e.preventDefault();

    if (!patient || !date || !time) return;

    const newAppointment = {
      id: Date.now(),
      patient,
      date,
      time,
    };

    setAppointments([...appointments, newAppointment]);

    setPatient("");
    setDate("");
    setTime("");
  }

  function removeAppointment(id) {
    setAppointments(appointments.filter((a) => a.id !== id));
  }

  return (
    <div style={{ display: "flex", background: "#f4f6f8", minHeight: "100vh" }}>
      <Sidebar />

      <div style={{ padding: "20px", width: "100%" }}>
        <h1 style={{ fontSize: "24px", marginBottom: "20px", color: "#1e3a8a" }}>
          Agenda
        </h1>

        {/* FORM */}
        <form
          onSubmit={addAppointment}
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "10px",
            marginBottom: "20px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ marginBottom: "10px" }}>Agendar Consulta</h2>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <input
              type="text"
              placeholder="Paciente"
              value={patient}
              onChange={(e) => setPatient(e.target.value)}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />

            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              style={{
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />

            <button
              type="submit"
              style={{
                background: "#2563eb",
                color: "white",
                border: "none",
                padding: "10px 15px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Agendar
            </button>
          </div>
        </form>

        {/* LISTA */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {appointments.length === 0 ? (
            <p style={{ color: "#777" }}>Nenhuma consulta agendada.</p>
          ) : (
            appointments.map((a) => (
              <div
                key={a.id}
                style={{
                  background: "white",
                  padding: "15px",
                  borderRadius: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                }}
              >
                <div>
                  <strong>{a.patient}</strong>
                  <p style={{ margin: 0, color: "#555" }}>
                    {a.date} às {a.time}
                  </p>
                </div>

                <button
                  onClick={() => removeAppointment(a.id)}
                  style={{
                    background: "#ef4444",
                    color: "white",
                    border: "none",
                    padding: "8px 12px",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Remover
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
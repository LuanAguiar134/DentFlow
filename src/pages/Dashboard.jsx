import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

export default function Dashboard() {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const savedPatients = localStorage.getItem("patients");
    if (savedPatients) {
      setPatients(JSON.parse(savedPatients));
    }

    const savedAppointments = localStorage.getItem("appointments");
    if (savedAppointments) {
      setAppointments(JSON.parse(savedAppointments));
    }
  }, []);

  const totalPatients = patients.length;

  // pegar data de hoje
  const today = new Date().toISOString().split("T")[0];

  // filtrar consultas de hoje
  const todayAppointments = appointments.filter(
    (a) => a.date === today
  );

  const recentPatients = patients.slice(-3).reverse();

  return (
    <div style={{ display: "flex", background: "#f4f6f8", minHeight: "100vh" }}>
      <Sidebar />

      <div style={{ padding: "20px", width: "100%" }}>
        <h1 style={{ fontSize: "24px", marginBottom: "20px", color: "#1e3a8a" }}>
          Dashboard
        </h1>

        {/* CARDS */}
        <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              minWidth: "200px",
            }}
          >
            <h3>Total de Pacientes</h3>
            <p style={{ fontSize: "28px", fontWeight: "bold", color: "#2563eb" }}>
              {totalPatients}
            </p>
          </div>

          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              minWidth: "200px",
            }}
          >
            <h3>Consultas Hoje</h3>
            <p style={{ fontSize: "28px", fontWeight: "bold", color: "#16a34a" }}>
              {todayAppointments.length}
            </p>
          </div>
        </div>

        {/* PACIENTES RECENTES */}
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            marginBottom: "20px",
          }}
        >
          <h2 style={{ marginBottom: "15px" }}>Pacientes Recentes</h2>

          {recentPatients.length === 0 ? (
            <p style={{ color: "#777" }}>
              Nenhum paciente cadastrado ainda.
            </p>
          ) : (
            recentPatients.map((p) => (
              <div
                key={p.id}
                style={{
                  borderBottom: "1px solid #eee",
                  padding: "10px 0",
                }}
              >
                <strong>{p.name}</strong>
                <p style={{ margin: 0, color: "#555" }}>
                  {p.age} anos
                </p>
              </div>
            ))
          )}
        </div>

        {/* CONSULTAS DE HOJE */}
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ marginBottom: "15px" }}>Consultas de Hoje</h2>

          {todayAppointments.length === 0 ? (
            <p style={{ color: "#777" }}>
              Nenhuma consulta para hoje.
            </p>
          ) : (
            todayAppointments.map((a) => (
              <div
                key={a.id}
                style={{
                  borderBottom: "1px solid #eee",
                  padding: "10px 0",
                }}
              >
                <strong>{a.patient}</strong>
                <p style={{ margin: 0, color: "#555" }}>
                  {a.time}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
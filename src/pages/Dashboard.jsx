import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

export default function Dashboard() {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const savedPatients = localStorage.getItem("patients");
    if (savedPatients) setPatients(JSON.parse(savedPatients));

    const savedAppointments = localStorage.getItem("appointments");
    if (savedAppointments) setAppointments(JSON.parse(savedAppointments));
  }, []);

  const today = new Date().toISOString().split("T")[0];
  const todayAppointments = appointments.filter((a) => a.date === today);
  const recentPatients = patients.slice(-3).reverse();

  const todayFormatted = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div style={{ display: "flex", background: "#f4f6f8", minHeight: "100vh" }}>
      <Sidebar />

      <div style={{ flex: 1, padding: "28px 32px" }}>
        {/* Topbar */}
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#1e3a8a", margin: 0 }}>
            Dashboard
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#888", textTransform: "capitalize" }}>
            {todayFormatted}
          </p>
        </div>

        {/* Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "28px" }}>
          <Card
            label="Total de Pacientes"
            value={patients.length}
            color="#2563eb"
            icon="👤"
          />
          <Card
            label="Consultas Hoje"
            value={todayAppointments.length}
            color="#16a34a"
            icon="📅"
          />
          <Card
            label="Total de Consultas"
            value={appointments.length}
            color="#9333ea"
            icon="📋"
          />
        </div>

        {/* Bottom grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          {/* Pacientes recentes */}
          <div style={cardStyle}>
            <h2 style={sectionTitle}>Pacientes Recentes</h2>

            {recentPatients.length === 0 ? (
              <p style={emptyText}>Nenhum paciente cadastrado ainda.</p>
            ) : (
              recentPatients.map((p) => (
                <div key={p.id} style={listItem}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: "#dbeafe",
                      color: "#2563eb",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: "14px",
                      flexShrink: 0,
                    }}
                  >
                    {p.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <strong style={{ fontSize: "14px", color: "#1a1a2e" }}>{p.name}</strong>
                    <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>
                      {p.phone || "Sem telefone"}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Consultas de hoje */}
          <div style={cardStyle}>
            <h2 style={sectionTitle}>Consultas de Hoje</h2>

            {todayAppointments.length === 0 ? (
              <p style={emptyText}>Nenhuma consulta para hoje.</p>
            ) : (
              todayAppointments.map((a) => (
                <div key={a.id} style={listItem}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: "#dcfce7",
                      color: "#16a34a",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "16px",
                      flexShrink: 0,
                    }}
                  >
                    🕐
                  </div>
                  <div>
                    <strong style={{ fontSize: "14px", color: "#1a1a2e" }}>{a.patient}</strong>
                    <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>{a.time}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ label, value, color, icon }) {
  return (
    <div style={cardStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p style={{ margin: 0, fontSize: "13px", color: "#888", fontWeight: 500 }}>{label}</p>
          <p style={{ margin: "8px 0 0", fontSize: "32px", fontWeight: 700, color }}>{value}</p>
        </div>
        <span style={{ fontSize: "28px" }}>{icon}</span>
      </div>
    </div>
  );
}

const cardStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
  border: "1px solid #e8edf5",
};

const sectionTitle = {
  fontSize: "16px",
  fontWeight: 700,
  color: "#1e3a8a",
  marginBottom: "16px",
  marginTop: 0,
};

const listItem = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "10px 0",
  borderBottom: "1px solid #f0f4f8",
};

const emptyText = {
  color: "#aaa",
  fontSize: "14px",
  margin: 0,
};
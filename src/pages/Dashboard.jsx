import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const DAYS_PT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export default function Dashboard() {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const p = localStorage.getItem("patients");
    if (p) setPatients(JSON.parse(p));
    const a = localStorage.getItem("appointments");
    if (a) setAppointments(JSON.parse(a));
    const f = localStorage.getItem("payments");
    if (f) setPayments(JSON.parse(f));
  }, []);

  const today = new Date().toISOString().split("T")[0];
  const todayAppointments = appointments.filter((a) => a.date === today);

  const thisMonth = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`;
  const receitaMes = payments
    .filter((p) => p.status === "Pago" && p.date && p.date.startsWith(thisMonth))
    .reduce((acc, p) => acc + Number(p.amount), 0);

  const taxaPresenca = todayAppointments.length > 0
    ? Math.round((todayAppointments.filter((a) => a.status === "concluida").length / todayAppointments.length) * 100)
    : 100;

  const weekData = DAYS_PT.map((day, i) => {
    const date = new Date();
    const diff = i - date.getDay();
    const d = new Date(date);
    d.setDate(date.getDate() + diff);
    const iso = d.toISOString().split("T")[0];
    return { day, consultas: appointments.filter((a) => a.date === iso).length };
  });

  return (
    <div style={{ display: "flex", background: "#f0f4f8", minHeight: "100vh" }}>
      <Sidebar />

      <div style={{ flex: 1, padding: "28px 32px" }}>
        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#1a1a2e", margin: 0 }}>Dashboard</h1>
          <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#888" }}>Visão geral do seu consultório</p>
        </div>

        {/* 4 Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
          <Card label="Consultas Hoje" value={todayAppointments.length} sub={`${todayAppointments.length} concluídas`} iconBg="#e3f2fd" iconColor="#1976d2"
            icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>}
          />
          <Card label="Total de Pacientes" value={patients.length} sub="Cadastrados" iconBg="#e8f5e9" iconColor="#388e3c"
            icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>}
          />
          <Card label="Receita do Mês" value={receitaMes.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} sub="Pagamentos confirmados" iconBg="#fff8e1" iconColor="#f59e0b"
            icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>}
          />
          <Card label="Taxa de Presença" value={`${taxaPresenca}%`} sub="Nos últimos registros" iconBg="#fce4ec" iconColor="#e91e63"
            icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>}
          />
        </div>

        {/* Bottom */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          {/* Consultas hoje */}
          <div style={cardStyle}>
            {todayAppointments.length === 0 ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "220px", gap: "10px" }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <p style={{ color: "#aaa", fontSize: "14px", margin: 0, fontWeight: 500 }}>Nenhuma consulta hoje</p>
                <p style={{ color: "#ccc", fontSize: "12px", margin: 0 }}>Aproveite o dia livre!</p>
              </div>
            ) : (
              <>
                <h2 style={sectionTitle}>Consultas de Hoje</h2>
                {todayAppointments.map((a) => (
                  <div key={a.id} style={listItem}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#e3f2fd", color: "#1976d2", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "14px", flexShrink: 0 }}>
                      {a.patient?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <strong style={{ fontSize: "14px", color: "#1a1a2e" }}>{a.patient}</strong>
                      <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>{a.time}</p>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Gráfico */}
          <div style={cardStyle}>
            <h2 style={sectionTitle}>Consultas da Semana</h2>
            <p style={{ fontSize: "12px", color: "#aaa", margin: "-12px 0 16px" }}>Visão geral semanal</p>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={weekData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#aaa" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#aaa" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="consultas" stroke="#2196f3" strokeWidth={2} dot={{ fill: "#2196f3", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ label, value, sub, iconBg, iconColor, icon }) {
  return (
    <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e8edf5", padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div>
        <p style={{ margin: 0, fontSize: "13px", color: "#888", fontWeight: 500 }}>{label}</p>
        <p style={{ margin: "8px 0 4px", fontSize: "28px", fontWeight: 700, color: "#1a1a2e" }}>{value}</p>
        <p style={{ margin: 0, fontSize: "12px", color: "#aaa" }}>{sub}</p>
      </div>
      <div style={{ width: 44, height: 44, borderRadius: "10px", background: iconBg, color: iconColor, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {icon}
      </div>
    </div>
  );
}

const cardStyle = { background: "#fff", borderRadius: "12px", border: "1px solid #e8edf5", padding: "20px" };
const sectionTitle = { fontSize: "16px", fontWeight: 700, color: "#1a1a2e", margin: "0 0 16px" };
const listItem = { display: "flex", alignItems: "center", gap: "12px", padding: "10px 0", borderBottom: "1px solid #f0f4f8" };
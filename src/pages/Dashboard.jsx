import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { getAuth } from "../App";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const dashStyle = `
  @keyframes cardIn {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes progressFill {
    from { width: 0%; }
    to   { width: var(--fill); }
  }
  .card-0 { animation: cardIn 0.4s ease 0.05s both; }
  .card-1 { animation: cardIn 0.4s ease 0.15s both; }
  .card-2 { animation: cardIn 0.4s ease 0.25s both; }
  .card-3 { animation: cardIn 0.4s ease 0.35s both; }
  .card-4 { animation: cardIn 0.4s ease 0.45s both; }
  .card-5 { animation: cardIn 0.4s ease 0.55s both; }
  .summary-card { transition: box-shadow 0.2s, transform 0.2s; }
  .summary-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.1); transform: translateY(-3px); }
  .appt-item { transition: background 0.15s; border-radius: 10px; }
  .appt-item:hover { background: #f0f7ff !important; }
`;

const DAYS_PT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTHS_PT = ["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return { text: "Bom dia", emoji: "☀️" };
  if (h < 18) return { text: "Boa tarde", emoji: "🌤️" };
  return { text: "Boa noite", emoji: "🌙" };
}

export default function Dashboard() {
  const auth = getAuth();
  const isDentista = auth?.role === "dentista";
  return isDentista ? <DashboardDentista auth={auth} /> : <DashboardPaciente auth={auth} />;
}

function DashboardDentista({ auth }) {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const p = localStorage.getItem("patients"); if (p) setPatients(JSON.parse(p));
    const a = localStorage.getItem("appointments"); if (a) setAppointments(JSON.parse(a));
    const f = localStorage.getItem("payments"); if (f) setPayments(JSON.parse(f));
  }, []);

  const today = new Date().toISOString().split("T")[0];
  const todayAppointments = appointments.filter((a) => a.date === today);
  const thisMonth = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`;
  const receitaMes = payments.filter((p) => p.status === "Pago" && p.date?.startsWith(thisMonth)).reduce((acc, p) => acc + Number(p.amount), 0);
  const taxaPresenca = todayAppointments.length > 0
    ? Math.round((todayAppointments.filter((a) => a.status === "concluida").length / todayAppointments.length) * 100)
    : 100;

  const weekData = DAYS_PT.map((day, i) => {
    const date = new Date();
    const d = new Date(date);
    d.setDate(date.getDate() + (i - date.getDay()));
    return { day, consultas: appointments.filter((a) => a.date === d.toISOString().split("T")[0]).length };
  });

  const greeting = getGreeting();
  const now = new Date();
  const dateLabel = `${DAYS_PT[now.getDay()]}, ${now.getDate()} de ${MONTHS_PT[now.getMonth()]} de ${now.getFullYear()}`;
  const displayName = auth?.name || auth?.user || "Doutor";

  return (
    <div style={{ display: "flex", background: "#f0f4f8", minHeight: "100vh" }}>
      <style>{dashStyle}</style>
      <Sidebar />
      <div style={{ flex: 1, padding: "28px 32px", overflowY: "auto" }}>

        {/* Header com saudação */}
        <div className="card-0" style={{ marginBottom: "28px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <h1 style={{ fontSize: "26px", fontWeight: 700, color: "#1a1a2e", margin: 0 }}>
                {greeting.text}, {displayName}! {greeting.emoji}
              </h1>
              <p style={{ margin: "6px 0 0", fontSize: "14px", color: "#888", textTransform: "capitalize" }}>{dateLabel}</p>
            </div>
            <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e8edf5", padding: "12px 20px", textAlign: "center" }}>
              <p style={{ margin: 0, fontSize: "12px", color: "#aaa", fontWeight: 500 }}>Consultas hoje</p>
              <p style={{ margin: "4px 0 0", fontSize: "28px", fontWeight: 700, color: todayAppointments.length > 0 ? "#2563eb" : "#ccc" }}>{todayAppointments.length}</p>
            </div>
          </div>

          {/* Barra de progresso do dia */}
          {todayAppointments.length > 0 && (
            <div style={{ marginTop: "16px", background: "#fff", borderRadius: "12px", border: "1px solid #e8edf5", padding: "14px 20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontSize: "13px", fontWeight: 600, color: "#555" }}>Progresso do dia</span>
                <span style={{ fontSize: "13px", color: "#888" }}>{todayAppointments.filter(a => a.status === "concluida").length} de {todayAppointments.length} concluídas</span>
              </div>
              <div style={{ background: "#f0f4f8", borderRadius: "20px", height: "8px", overflow: "hidden" }}>
                <div style={{
                  height: "100%", borderRadius: "20px",
                  background: "linear-gradient(90deg, #2196f3, #42a5f5)",
                  width: `${taxaPresenca}%`,
                  transition: "width 1s ease",
                }} />
              </div>
            </div>
          )}
        </div>

        {/* 4 Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
          {[
            { label: "Consultas Hoje", value: todayAppointments.length, sub: `${todayAppointments.length} agendadas`, iconBg: "#e3f2fd", iconColor: "#1976d2", icon: <CalIcon />, cls: "card-1" },
            { label: "Total de Pacientes", value: patients.length, sub: "Cadastrados", iconBg: "#e8f5e9", iconColor: "#388e3c", icon: <UserIcon />, cls: "card-2" },
            { label: "Receita do Mês", value: receitaMes.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }), sub: "Pagamentos confirmados", iconBg: "#fff8e1", iconColor: "#f59e0b", icon: <MoneyIcon />, cls: "card-3" },
            { label: "Taxa de Presença", value: `${taxaPresenca}%`, sub: "Nos últimos registros", iconBg: "#fce4ec", iconColor: "#e91e63", icon: <TrendIcon />, cls: "card-4" },
          ].map((c) => (
            <div key={c.label} className={`summary-card ${c.cls}`} style={{ background: "#fff", borderRadius: "14px", border: "1px solid #e8edf5", padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ margin: 0, fontSize: "13px", color: "#888", fontWeight: 500 }}>{c.label}</p>
                <p style={{ margin: "8px 0 4px", fontSize: "26px", fontWeight: 700, color: "#1a1a2e" }}>{c.value}</p>
                <p style={{ margin: 0, fontSize: "12px", color: "#aaa" }}>{c.sub}</p>
              </div>
              <div style={{ width: 44, height: 44, borderRadius: "12px", background: c.iconBg, color: c.iconColor, display: "flex", alignItems: "center", justifyContent: "center" }}>{c.icon}</div>
            </div>
          ))}
        </div>

        {/* Bottom grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          {/* Consultas hoje */}
          <div className="card-5" style={cardStyle}>
            <h2 style={sectionTitle}>Consultas de Hoje</h2>
            {todayAppointments.length === 0 ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "180px", gap: "10px" }}>
                <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <p style={{ color: "#bbb", fontSize: "14px", margin: 0, fontWeight: 500 }}>Nenhuma consulta hoje</p>
                <p style={{ color: "#ccc", fontSize: "12px", margin: 0 }}>Aproveite o dia livre! 🎉</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {todayAppointments.map((a) => (
                  <div key={a.id} className="appt-item" style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 8px" }}>
                    <div style={{ width: 38, height: 38, borderRadius: "10px", background: "#e3f2fd", color: "#1976d2", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "13px", flexShrink: 0 }}>
                      {a.time}
                    </div>
                    <div style={{ flex: 1 }}>
                      <strong style={{ fontSize: "14px", color: "#1a1a2e" }}>{a.patient}</strong>
                      {a.notes && <p style={{ margin: 0, fontSize: "12px", color: "#aaa" }}>{a.notes}</p>}
                    </div>
                    <span style={{ fontSize: "11px", fontWeight: 600, background: "#dcfce7", color: "#16a34a", padding: "3px 8px", borderRadius: "20px" }}>Agendado</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Gráfico */}
          <div className="card-5" style={cardStyle}>
            <h2 style={sectionTitle}>Consultas da Semana</h2>
            <p style={{ fontSize: "12px", color: "#aaa", margin: "-12px 0 16px" }}>Visão geral semanal</p>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={weekData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#aaa" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#aaa" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: "10px", border: "1px solid #e8edf5", fontSize: "13px" }} />
                <Line type="monotone" dataKey="consultas" stroke="#2196f3" strokeWidth={2.5} dot={{ fill: "#2196f3", r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardPaciente({ auth }) {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const a = localStorage.getItem("appointments"); if (a) setAppointments(JSON.parse(a));
  }, []);

  const today = new Date().toISOString().split("T")[0];
  const greeting = getGreeting();
  const displayName = auth?.name || auth?.user || "Paciente";
  const minhasConsultas = appointments.filter((a) => a.patient === auth?.user || a.patient === auth?.name);
  const proximasConsultas = minhasConsultas.filter((a) => a.date >= today).sort((a, b) => a.date.localeCompare(b.date));
  const consultasHoje = minhasConsultas.filter((a) => a.date === today);

  function formatDate(val) {
    if (!val) return "—";
    const [y, m, d] = val.split("-");
    return `${d}/${m}/${y}`;
  }

  return (
    <div style={{ display: "flex", background: "#f0f4f8", minHeight: "100vh" }}>
      <style>{dashStyle}</style>
      <Sidebar />
      <div style={{ flex: 1, padding: "28px 32px" }}>
        <div className="card-0" style={{ marginBottom: "28px" }}>
          <h1 style={{ fontSize: "26px", fontWeight: 700, color: "#1a1a2e", margin: 0 }}>
            {greeting.text}, {displayName}! {greeting.emoji}
          </h1>
          <p style={{ margin: "6px 0 0", fontSize: "14px", color: "#888" }}>Bem-vindo à sua área de paciente</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "24px" }}>
          {[
            { label: "Consultas Hoje", value: consultasHoje.length, sub: "Agendadas para hoje", iconBg: "#e3f2fd", iconColor: "#1976d2", icon: <CalIcon />, cls: "card-1" },
            { label: "Próximas Consultas", value: proximasConsultas.length, sub: "Agendadas", iconBg: "#e8f5e9", iconColor: "#388e3c", icon: <UserIcon />, cls: "card-2" },
            { label: "Total de Consultas", value: minhasConsultas.length, sub: "No histórico", iconBg: "#fff8e1", iconColor: "#f59e0b", icon: <TrendIcon />, cls: "card-3" },
          ].map((c) => (
            <div key={c.label} className={`summary-card ${c.cls}`} style={{ background: "#fff", borderRadius: "14px", border: "1px solid #e8edf5", padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ margin: 0, fontSize: "13px", color: "#888", fontWeight: 500 }}>{c.label}</p>
                <p style={{ margin: "8px 0 4px", fontSize: "26px", fontWeight: 700, color: "#1a1a2e" }}>{c.value}</p>
                <p style={{ margin: 0, fontSize: "12px", color: "#aaa" }}>{c.sub}</p>
              </div>
              <div style={{ width: 44, height: 44, borderRadius: "12px", background: c.iconBg, color: c.iconColor, display: "flex", alignItems: "center", justifyContent: "center" }}>{c.icon}</div>
            </div>
          ))}
        </div>

        <div className="card-4" style={cardStyle}>
          <h2 style={sectionTitle}>Próximas Consultas</h2>
          {proximasConsultas.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#aaa" }}>
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>📅</div>
              <p style={{ margin: 0, fontSize: "14px" }}>Nenhuma consulta agendada</p>
            </div>
          ) : (
            proximasConsultas.map((a) => (
              <div key={a.id} className="appt-item" style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 8px" }}>
                <div style={{ width: 44, height: 44, borderRadius: "10px", background: "#dbeafe", color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "13px", flexShrink: 0 }}>{a.time}</div>
                <div>
                  <strong style={{ fontSize: "14px", color: "#1a1a2e" }}>{formatDate(a.date)}</strong>
                  {a.notes && <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>{a.notes}</p>}
                </div>
                <span style={{ marginLeft: "auto", fontSize: "11px", fontWeight: 600, background: a.date === today ? "#dcfce7" : "#eff6ff", color: a.date === today ? "#16a34a" : "#2563eb", padding: "3px 10px", borderRadius: "20px" }}>
                  {a.date === today ? "Hoje" : "Agendado"}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function CalIcon() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>; }
function UserIcon() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>; }
function MoneyIcon() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>; }
function TrendIcon() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>; }

const cardStyle = { background: "#fff", borderRadius: "14px", border: "1px solid #e8edf5", padding: "20px" };
const sectionTitle = { fontSize: "16px", fontWeight: 700, color: "#1a1a2e", margin: "0 0 16px" };
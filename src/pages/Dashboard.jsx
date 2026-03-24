import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { getAuth } from "../App";
import { glassBase, glassCard, glassCardLight, glassText } from "../styles/glassStyles";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

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
  const dateLabel = `${DAYS_PT[now.getDay()]}, ${now.getDate()} de ${MONTHS_PT[now.getMonth()]}`;
  const displayName = auth?.name || auth?.user || "Doutor";

  return (
    <div className="glass-page">
      <style>{glassBase}</style>
      <Sidebar />
      <div style={{ flex: 1, padding: "28px 32px", overflowY: "auto", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div className="card-0" style={{ marginBottom: "28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ fontSize: "26px", fontWeight: 700, color: "#fff", margin: 0 }}>
              {greeting.text}, {displayName}! {greeting.emoji}
            </h1>
            <p style={{ margin: "6px 0 0", fontSize: "14px", color: "rgba(255,255,255,0.5)", textTransform: "capitalize" }}>{dateLabel}</p>
          </div>
          <div style={{ ...glassCardLight, padding: "14px 24px", textAlign: "center" }}>
            <p style={{ margin: 0, fontSize: "12px", color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>Consultas hoje</p>
            <p style={{ margin: "4px 0 0", fontSize: "30px", fontWeight: 700, color: todayAppointments.length > 0 ? "#60a5fa" : "rgba(255,255,255,0.3)" }}>{todayAppointments.length}</p>
          </div>
        </div>

        {/* Barra de progresso */}
        {todayAppointments.length > 0 && (
          <div className="card-1" style={{ ...glassCard, padding: "16px 20px", marginBottom: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
              <span style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>Progresso do dia</span>
              <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)" }}>{todayAppointments.filter(a => a.status === "concluida").length} de {todayAppointments.length} concluídas</span>
            </div>
            <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: "20px", height: "8px", overflow: "hidden" }}>
              <div style={{ height: "100%", borderRadius: "20px", background: "linear-gradient(90deg, #2196f3, #42a5f5)", width: `${taxaPresenca}%`, transition: "width 1s ease" }} />
            </div>
          </div>
        )}

        {/* 4 Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
          {[
            { label: "Consultas Hoje", value: todayAppointments.length, sub: "Agendadas", iconBg: "rgba(33,150,243,0.2)", iconColor: "#60a5fa", icon: <CalIcon />, cls: "card-2" },
            { label: "Total de Pacientes", value: patients.length, sub: "Cadastrados", iconBg: "rgba(52,193,122,0.2)", iconColor: "#4ade80", icon: <UserIcon />, cls: "card-3" },
            { label: "Receita do Mês", value: receitaMes.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }), sub: "Confirmados", iconBg: "rgba(245,158,11,0.2)", iconColor: "#fbbf24", icon: <MoneyIcon />, cls: "card-4" },
            { label: "Taxa de Presença", value: `${taxaPresenca}%`, sub: "Últimos registros", iconBg: "rgba(236,72,153,0.2)", iconColor: "#f472b6", icon: <TrendIcon />, cls: "card-5" },
          ].map((c) => (
            <div key={c.label} className={`hover-lift ${c.cls}`} style={{ ...glassCard, padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ margin: 0, fontSize: "12px", color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>{c.label}</p>
                <p style={{ margin: "8px 0 4px", fontSize: "24px", fontWeight: 700, color: "#fff" }}>{c.value}</p>
                <p style={{ margin: 0, fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>{c.sub}</p>
              </div>
              <div style={{ width: 42, height: 42, borderRadius: "12px", background: c.iconBg, color: c.iconColor, display: "flex", alignItems: "center", justifyContent: "center" }}>{c.icon}</div>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <div style={{ ...glassCard, padding: "22px" }}>
            <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#fff", margin: "0 0 16px" }}>Consultas de Hoje</h2>
            {todayAppointments.length === 0 ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "160px", gap: "10px" }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "14px", margin: 0 }}>Nenhuma consulta hoje</p>
                <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "12px", margin: 0 }}>Aproveite o dia livre! 🎉</p>
              </div>
            ) : (
              todayAppointments.map((a) => (
                <div key={a.id} className="appt-card-glass" style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 8px", background: "rgba(255,255,255,0.04)", marginBottom: "6px" }}>
                  <div style={{ width: 40, height: 40, borderRadius: "10px", background: "rgba(33,150,243,0.2)", color: "#60a5fa", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "12px", flexShrink: 0 }}>{a.time}</div>
                  <div style={{ flex: 1 }}>
                    <strong style={{ fontSize: "14px", color: "#fff" }}>{a.patient}</strong>
                    {a.notes && <p style={{ margin: 0, fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>{a.notes}</p>}
                  </div>
                  <span style={{ fontSize: "11px", fontWeight: 600, background: "rgba(74,222,128,0.15)", color: "#4ade80", padding: "3px 8px", borderRadius: "20px", border: "1px solid rgba(74,222,128,0.3)" }}>Agendado</span>
                </div>
              ))
            )}
          </div>

          <div style={{ ...glassCard, padding: "22px" }}>
            <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#fff", margin: "0 0 4px" }}>Consultas da Semana</h2>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", margin: "0 0 16px" }}>Visão geral semanal</p>
            <ResponsiveContainer width="100%" height={190}>
              <LineChart data={weekData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "rgba(255,255,255,0.4)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "rgba(255,255,255,0.4)" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ background: "rgba(10,22,40,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "#fff", fontSize: "13px" }} />
                <Line type="monotone" dataKey="consultas" stroke="#60a5fa" strokeWidth={2.5} dot={{ fill: "#60a5fa", r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} />
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
    <div className="glass-page">
      <style>{glassBase}</style>
      <Sidebar />
      <div style={{ flex: 1, padding: "28px 32px", position: "relative", zIndex: 1 }}>
        <div className="card-0" style={{ marginBottom: "28px" }}>
          <h1 style={{ fontSize: "26px", fontWeight: 700, color: "#fff", margin: 0 }}>{greeting.text}, {displayName}! {greeting.emoji}</h1>
          <p style={{ margin: "6px 0 0", fontSize: "14px", color: "rgba(255,255,255,0.5)" }}>Bem-vindo à sua área</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "24px" }}>
          {[
            { label: "Consultas Hoje", value: consultasHoje.length, iconBg: "rgba(33,150,243,0.2)", iconColor: "#60a5fa", icon: <CalIcon />, cls: "card-1" },
            { label: "Próximas Consultas", value: proximasConsultas.length, iconBg: "rgba(52,193,122,0.2)", iconColor: "#4ade80", icon: <UserIcon />, cls: "card-2" },
            { label: "Total de Consultas", value: minhasConsultas.length, iconBg: "rgba(245,158,11,0.2)", iconColor: "#fbbf24", icon: <TrendIcon />, cls: "card-3" },
          ].map((c) => (
            <div key={c.label} className={`hover-lift ${c.cls}`} style={{ ...glassCard, padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ margin: 0, fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>{c.label}</p>
                <p style={{ margin: "8px 0 0", fontSize: "28px", fontWeight: 700, color: "#fff" }}>{c.value}</p>
              </div>
              <div style={{ width: 42, height: 42, borderRadius: "12px", background: c.iconBg, color: c.iconColor, display: "flex", alignItems: "center", justifyContent: "center" }}>{c.icon}</div>
            </div>
          ))}
        </div>

        <div className="card-4" style={{ ...glassCard, padding: "22px" }}>
          <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#fff", margin: "0 0 16px" }}>Próximas Consultas</h2>
          {proximasConsultas.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: "rgba(255,255,255,0.3)" }}>
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>📅</div>
              <p style={{ margin: 0, fontSize: "14px" }}>Nenhuma consulta agendada</p>
            </div>
          ) : (
            proximasConsultas.map((a) => (
              <div key={a.id} className="appt-card-glass" style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 8px", background: "rgba(255,255,255,0.04)", marginBottom: "6px" }}>
                <div style={{ width: 44, height: 44, borderRadius: "10px", background: "rgba(33,150,243,0.2)", color: "#60a5fa", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "13px", flexShrink: 0 }}>{a.time}</div>
                <div>
                  <strong style={{ fontSize: "14px", color: "#fff" }}>{formatDate(a.date)}</strong>
                  {a.notes && <p style={{ margin: 0, fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>{a.notes}</p>}
                </div>
                <span style={{ marginLeft: "auto", fontSize: "11px", fontWeight: 600, background: a.date === today ? "rgba(74,222,128,0.15)" : "rgba(33,150,243,0.15)", color: a.date === today ? "#4ade80" : "#60a5fa", padding: "3px 10px", borderRadius: "20px", border: `1px solid ${a.date === today ? "rgba(74,222,128,0.3)" : "rgba(33,150,243,0.3)"}` }}>
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

function CalIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>; }
function UserIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>; }
function MoneyIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>; }
function TrendIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>; }
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { getAuth } from "../App";
import { glassBase, glassCard, glassCardLight } from "../styles/glassStyles";
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
  return auth?.role === "dentista" ? <DashboardDentista auth={auth} /> : <DashboardPaciente auth={auth} />;
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
  const todayAppts = appointments.filter((a) => a.date === today);
  const thisMonth = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`;
  const receitaMes = payments.filter((p) => p.status === "Pago" && p.date?.startsWith(thisMonth)).reduce((acc, p) => acc + Number(p.amount), 0);
  const taxaPresenca = todayAppts.length > 0
    ? Math.round((todayAppts.filter((a) => a.status === "concluida").length / todayAppts.length) * 100)
    : 100;

  const weekData = DAYS_PT.map((day, i) => {
    const d = new Date();
    d.setDate(d.getDate() + (i - d.getDay()));
    return { day, consultas: appointments.filter((a) => a.date === d.toISOString().split("T")[0]).length };
  });

  const greeting = getGreeting();
  const now = new Date();
  const dateLabel = `${DAYS_PT[now.getDay()]}, ${now.getDate()} de ${MONTHS_PT[now.getMonth()]}`;
  const displayName = auth?.name || auth?.user || "Doutor";

  const stats = [
    { label: "Consultas Hoje", value: todayAppts.length, sub: "agendadas", color: "#60a5fa", bg: "rgba(96,165,250,0.15)", border: "rgba(96,165,250,0.25)", icon: <CalIcon /> },
    { label: "Pacientes", value: patients.length, sub: "cadastrados", color: "#4ade80", bg: "rgba(74,222,128,0.15)", border: "rgba(74,222,128,0.25)", icon: <UserIcon /> },
    { label: "Receita do Mês", value: receitaMes.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }), sub: "confirmados", color: "#fbbf24", bg: "rgba(251,191,36,0.15)", border: "rgba(251,191,36,0.25)", icon: <MoneyIcon /> },
    { label: "Taxa de Presença", value: `${taxaPresenca}%`, sub: "últimos registros", color: "#f472b6", bg: "rgba(244,114,182,0.15)", border: "rgba(244,114,182,0.25)", icon: <TrendIcon /> },
  ];

  return (
    <div className="glass-page">
      <style>{glassBase}</style>
      <Sidebar />

      <div style={{ flex: 1, padding: "28px 32px", overflowY: "auto", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div className="card-0" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px" }}>
          <div>
            <h1 style={{ fontSize: "26px", fontWeight: 700, color: "#fff", margin: 0, letterSpacing: "-0.3px" }}>
              {greeting.text}, {displayName}! {greeting.emoji}
            </h1>
            <p style={{ margin: "6px 0 0", fontSize: "14px", color: "rgba(255,255,255,0.45)", textTransform: "capitalize" }}>{dateLabel}</p>
          </div>
          <div style={{ ...glassCard, padding: "14px 24px", textAlign: "center" }}>
            <p style={{ margin: 0, fontSize: "11px", color: "rgba(255,255,255,0.4)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Hoje</p>
            <p style={{ margin: "4px 0 0", fontSize: "32px", fontWeight: 700, color: todayAppts.length > 0 ? "#60a5fa" : "rgba(255,255,255,0.2)", lineHeight: 1 }}>{todayAppts.length}</p>
            <p style={{ margin: "4px 0 0", fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>consultas</p>
          </div>
        </div>

        {/* Barra de progresso */}
        {todayAppts.length > 0 && (
          <div className="card-1" style={{ ...glassCard, padding: "16px 20px", marginBottom: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
              <span style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>Progresso do dia</span>
              <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)" }}>
                {todayAppts.filter(a => a.status === "concluida").length} de {todayAppts.length} concluídas
              </span>
            </div>
            <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: "20px", height: "6px", overflow: "hidden" }}>
              <div style={{ height: "100%", borderRadius: "20px", background: "linear-gradient(90deg, #2196f3, #60a5fa)", width: `${taxaPresenca}%`, transition: "width 1s ease" }} />
            </div>
          </div>
        )}

        {/* 4 Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "24px" }}>
          {stats.map((s, i) => (
            <div key={s.label} className={`hover-lift card-${i + 2}`} style={{
              background: s.bg,
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: `1px solid ${s.border}`,
              borderRadius: "16px",
              padding: "18px 20px",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                <p style={{ margin: 0, fontSize: "12px", color: "rgba(255,255,255,0.55)", fontWeight: 500 }}>{s.label}</p>
                <div style={{ width: 36, height: 36, borderRadius: "10px", background: "rgba(255,255,255,0.1)", color: s.color, display: "flex", alignItems: "center", justifyContent: "center" }}>{s.icon}</div>
              </div>
              <p style={{ margin: 0, fontSize: "22px", fontWeight: 700, color: "#fff", lineHeight: 1 }}>{s.value}</p>
              <p style={{ margin: "6px 0 0", fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Bottom grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: "20px" }}>

          {/* Consultas hoje */}
          <div className="card-5" style={{ ...glassCard, padding: "22px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <h2 style={{ fontSize: "14px", fontWeight: 700, color: "#fff", margin: 0, textTransform: "uppercase", letterSpacing: "0.06em" }}>Consultas de Hoje</h2>
              <span style={{ fontSize: "11px", background: "rgba(96,165,250,0.15)", color: "#60a5fa", padding: "3px 10px", borderRadius: "20px", border: "1px solid rgba(96,165,250,0.3)" }}>{todayAppts.length} agendadas</span>
            </div>

            {todayAppts.length === 0 ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "160px", gap: "10px" }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "13px", margin: 0 }}>Nenhuma consulta hoje</p>
                <p style={{ color: "rgba(255,255,255,0.15)", fontSize: "12px", margin: 0 }}>Dia livre! 🎉</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {todayAppts.map((a) => (
                  <div key={a.id} className="appt-card-glass" style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ width: 40, height: 40, borderRadius: "10px", background: "rgba(96,165,250,0.15)", color: "#60a5fa", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "12px", flexShrink: 0, border: "1px solid rgba(96,165,250,0.2)" }}>{a.time}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <strong style={{ fontSize: "14px", color: "#fff", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.patient}</strong>
                      {a.notes && <p style={{ margin: 0, fontSize: "12px", color: "rgba(255,255,255,0.35)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.notes}</p>}
                    </div>
                    <span style={{ fontSize: "11px", fontWeight: 600, background: "rgba(74,222,128,0.12)", color: "#4ade80", padding: "3px 8px", borderRadius: "20px", border: "1px solid rgba(74,222,128,0.25)", flexShrink: 0 }}>OK</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Gráfico */}
          <div className="card-5" style={{ ...glassCard, padding: "22px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
              <h2 style={{ fontSize: "14px", fontWeight: 700, color: "#fff", margin: 0, textTransform: "uppercase", letterSpacing: "0.06em" }}>Consultas da Semana</h2>
            </div>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", margin: "0 0 16px" }}>Visão geral semanal</p>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={weekData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "rgba(255,255,255,0.35)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "rgba(255,255,255,0.35)" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ background: "rgba(10,22,40,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "#fff", fontSize: "13px" }} cursor={{ stroke: "rgba(255,255,255,0.1)" }} />
                <Line type="monotone" dataKey="consultas" stroke="#60a5fa" strokeWidth={2.5} dot={{ fill: "#60a5fa", r: 4, strokeWidth: 0 }} activeDot={{ r: 6, fill: "#93c5fd" }} />
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
  const minhas = appointments.filter((a) => a.patient === auth?.user || a.patient === auth?.name);
  const proximas = minhas.filter((a) => a.date >= today).sort((a, b) => a.date.localeCompare(b.date));
  const hoje = minhas.filter((a) => a.date === today);

  function formatDate(val) {
    if (!val) return "—";
    const [y, m, d] = val.split("-");
    return `${d}/${m}/${y}`;
  }

  const stats = [
    { label: "Hoje", value: hoje.length, color: "#60a5fa", bg: "rgba(96,165,250,0.15)", border: "rgba(96,165,250,0.25)", icon: <CalIcon /> },
    { label: "Próximas", value: proximas.length, color: "#4ade80", bg: "rgba(74,222,128,0.15)", border: "rgba(74,222,128,0.25)", icon: <UserIcon /> },
    { label: "Total", value: minhas.length, color: "#fbbf24", bg: "rgba(251,191,36,0.15)", border: "rgba(251,191,36,0.25)", icon: <TrendIcon /> },
  ];

  return (
    <div className="glass-page">
      <style>{glassBase}</style>
      <Sidebar />
      <div style={{ flex: 1, padding: "28px 32px", position: "relative", zIndex: 1 }}>
        <div className="card-0" style={{ marginBottom: "28px" }}>
          <h1 style={{ fontSize: "26px", fontWeight: 700, color: "#fff", margin: 0 }}>{greeting.text}, {displayName}! {greeting.emoji}</h1>
          <p style={{ margin: "6px 0 0", fontSize: "14px", color: "rgba(255,255,255,0.45)" }}>Bem-vindo à sua área</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px", marginBottom: "24px" }}>
          {stats.map((s, i) => (
            <div key={s.label} className={`hover-lift card-${i + 1}`} style={{ background: s.bg, backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: `1px solid ${s.border}`, borderRadius: "16px", padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <p style={{ margin: 0, fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>{s.label}</p>
                <div style={{ color: s.color }}>{s.icon}</div>
              </div>
              <p style={{ margin: 0, fontSize: "28px", fontWeight: 700, color: "#fff" }}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="card-4" style={{ ...glassCard, padding: "22px" }}>
          <h2 style={{ fontSize: "14px", fontWeight: 700, color: "#fff", margin: "0 0 16px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Próximas Consultas</h2>
          {proximas.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: "rgba(255,255,255,0.25)" }}>
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>📅</div>
              <p style={{ margin: 0, fontSize: "14px" }}>Nenhuma consulta agendada</p>
            </div>
          ) : (
            proximas.map((a) => (
              <div key={a.id} className="appt-card-glass" style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", marginBottom: "6px" }}>
                <div style={{ width: 44, height: 44, borderRadius: "10px", background: "rgba(96,165,250,0.15)", color: "#60a5fa", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "13px", border: "1px solid rgba(96,165,250,0.2)", flexShrink: 0 }}>{a.time}</div>
                <div>
                  <strong style={{ fontSize: "14px", color: "#fff" }}>{formatDate(a.date)}</strong>
                  {a.notes && <p style={{ margin: 0, fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>{a.notes}</p>}
                </div>
                <span style={{ marginLeft: "auto", fontSize: "11px", fontWeight: 600, background: a.date === today ? "rgba(74,222,128,0.15)" : "rgba(96,165,250,0.15)", color: a.date === today ? "#4ade80" : "#60a5fa", padding: "3px 10px", borderRadius: "20px", border: `1px solid ${a.date === today ? "rgba(74,222,128,0.3)" : "rgba(96,165,250,0.3)"}` }}>
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

function CalIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>; }
function UserIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>; }
function MoneyIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>; }
function TrendIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>; }
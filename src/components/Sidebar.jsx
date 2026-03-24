import { Link, useLocation, useNavigate } from "react-router-dom";
import { glassBase } from "../styles/glassStyles";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    localStorage.removeItem("auth");
    sessionStorage.removeItem("auth");
    navigate("/login");
  }

  return (
    <>
      <style>{glassBase}</style>
      <div style={{
        width: "220px",
        height: "100vh",
        background: "rgba(10,22,40,0.6)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderRight: "1px solid rgba(255,255,255,0.08)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}>
        {/* Logo */}
        <div style={{ padding: "20px 16px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: 40, height: 40, background: "linear-gradient(135deg, #2196f3, #1565c0)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(33,150,243,0.4)" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: "16px", fontWeight: 700, color: "#fff" }}>DentFlow</div>
              <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.45)" }}>Gestão Odontológica</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "12px 10px", overflowY: "auto" }}>
          <NavItem to="/" label="Dashboard" active={location.pathname === "/"} icon={<DashIcon />} />
          <NavItem to="/agenda" label="Agenda" active={location.pathname === "/agenda"} icon={<CalIcon />} />
          <NavItem to="/patients" label="Pacientes" active={location.pathname === "/patients"} icon={<UserIcon />} />
          <NavItem to="/procedures" label="Procedimentos" active={location.pathname === "/procedures"} icon={<ProcIcon />} />
          <NavItem to="/financial" label="Financeiro" active={location.pathname === "/financial"} icon={<MoneyIcon />} />
        </nav>

        {/* Sair */}
        <div style={{ padding: "12px 10px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <button onClick={handleLogout} className="logout-btn-glass">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Sair
          </button>
        </div>
      </div>
    </>
  );
}

function NavItem({ to, label, active, icon }) {
  return (
    <Link to={to} className={`nav-item-glass${active ? " active" : ""}`}>
      <span style={{ display: "flex", opacity: active ? 1 : 0.7 }}>{icon}</span>
      {label}
    </Link>
  );
}

function DashIcon() { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>; }
function CalIcon() { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>; }
function UserIcon() { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>; }
function ProcIcon() { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>; }
function MoneyIcon() { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>; }
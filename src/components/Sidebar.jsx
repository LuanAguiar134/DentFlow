import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    localStorage.removeItem("auth");
    navigate("/login");
  }

  return (
    <div style={{ height: "100vh", width: "210px", background: "#fff", borderRight: "1px solid #e8edf5", display: "flex", flexDirection: "column", flexShrink: 0 }}>
      {/* Logo */}
      <div style={{ padding: "16px", borderBottom: "1px solid #e8edf5" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: 36, height: 36, background: "#2196f3", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
          </div>
          <div>
            <div style={{ fontSize: "15px", fontWeight: 700, color: "#1a1a2e" }}>DentFlow</div>
            <div style={{ fontSize: "11px", color: "#888" }}>Gestão Odontológica</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 8px" }}>
        <NavItem to="/" label="Dashboard" active={location.pathname === "/"} icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>} />
        <NavItem to="/agenda" label="Agenda" active={location.pathname === "/agenda"} icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>} />
        <NavItem to="/patients" label="Pacientes" active={location.pathname === "/patients"} icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>} />
        <NavItem to="/procedures" label="Procedimentos" active={location.pathname === "/procedures"} icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>} />
        <NavItem to="/financial" label="Financeiro" active={location.pathname === "/financial"} icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>} />
      </nav>

      {/* Sair */}
      <div style={{ padding: "12px 8px", borderTop: "1px solid #e8edf5" }}>
        <button onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", background: "transparent", border: "none", padding: "10px 12px", borderRadius: "8px", cursor: "pointer", color: "#888", fontSize: "14px", fontWeight: 500 }}
          onMouseEnter={(e) => e.currentTarget.style.background = "#f4f6f8"}
          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Sair
        </button>
      </div>
    </div>
  );
}

function NavItem({ to, label, active, icon }) {
  return (
    <Link to={to} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "8px", marginBottom: "2px", textDecoration: "none", fontSize: "14px", fontWeight: 500, background: active ? "#e3f2fd" : "transparent", color: active ? "#1976d2" : "#555" }}
      onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "#f4f6f8"; }}
      onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = active ? "#e3f2fd" : "transparent"; }}
    >
      <span style={{ color: active ? "#1976d2" : "#888", display: "flex" }}>{icon}</span>
      {label}
    </Link>
  );
}
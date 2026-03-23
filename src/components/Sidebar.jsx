import { Link, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("auth");
    navigate("/login");
  }

  return (
    <div
      style={{
        height: "100vh",
        width: "220px",
        background: "#1d4ed8",
        color: "white",
        display: "flex",
        flexDirection: "column",
        padding: "20px 12px",
        flexShrink: 0,
      }}
    >
      <h1 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "32px", paddingLeft: "8px" }}>
        DentFlow
      </h1>

      <nav style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
        <NavLink to="/">Dashboard</NavLink>
        <NavLink to="/agenda">Agenda</NavLink>
        <NavLink to="/patients">Pacientes</NavLink>
        <NavLink to="/procedures">Procedimentos</NavLink>
        <NavLink to="/financial">Financeiro</NavLink>
      </nav>

      <button
        onClick={handleLogout}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: "rgba(255,255,255,0.1)",
          border: "none",
          color: "white",
          padding: "10px 12px",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: 500,
          width: "100%",
          marginTop: "8px",
        }}
      >
        ← Sair
      </button>
    </div>
  );
}

function NavLink({ to, children }) {
  return (
    <Link
      to={to}
      style={{
        color: "white",
        textDecoration: "none",
        padding: "10px 12px",
        borderRadius: "6px",
        fontSize: "14px",
        fontWeight: 500,
        display: "block",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      {children}
    </Link>
  );
}
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CONTAS = {
  dentista: { user: "admin", senha: "1234" },
  paciente: { user: "paciente", senha: "1234" },
};

const loginStyle = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .login-card { animation: fadeUp 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
  .tab-btn { transition: background 0.2s, color 0.2s; cursor: pointer; }
  .input-login { transition: border-color 0.2s, box-shadow 0.2s; }
  .input-login:focus { border-color: #2563eb !important; box-shadow: 0 0 0 3px rgba(37,99,235,0.12) !important; outline: none; }
  .btn-login { transition: background 0.15s, transform 0.1s; }
  .btn-login:hover { background: #1d4ed8 !important; }
  .btn-login:active { transform: scale(0.98); }
`;

export default function Login() {
  const [role, setRole] = useState("dentista");
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleLogin(e) {
    e.preventDefault();

    if (!user || !password) { setError("Preencha todos os campos."); return; }

    const conta = CONTAS[role];
    if (user !== conta.user || password !== conta.senha) {
      setError("Usuário ou senha incorretos.");
      return;
    }

    localStorage.setItem("auth", JSON.stringify({ user, role }));
    navigate("/");
  }

  function switchRole(newRole) {
    setRole(newRole);
    setUser("");
    setPassword("");
    setError("");
  }

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      background: "linear-gradient(135deg, #e3f2fd 0%, #f0f4f8 50%, #e8f5e9 100%)",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
    }}>
      <style>{loginStyle}</style>

      <div className="login-card" style={{
        background: "#fff",
        borderRadius: "20px",
        boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
        width: "100%",
        maxWidth: "400px",
        overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg, #2196f3, #1976d2)",
          padding: "32px 32px 28px",
          textAlign: "center",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "8px" }}>
            <div style={{ width: 44, height: 44, background: "rgba(255,255,255,0.2)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </div>
            <div style={{ textAlign: "left" }}>
              <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#fff", margin: 0 }}>DentFlow</h1>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", margin: 0 }}>Gestão Odontológica</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", background: "#f4f6f8", margin: "24px 24px 0" , borderRadius: "10px", padding: "4px" }}>
          <button className="tab-btn" onClick={() => switchRole("dentista")}
            style={{ flex: 1, padding: "10px", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: 600,
              background: role === "dentista" ? "#fff" : "transparent",
              color: role === "dentista" ? "#2563eb" : "#888",
              boxShadow: role === "dentista" ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
            }}>
            🦷 Dentista
          </button>
          <button className="tab-btn" onClick={() => switchRole("paciente")}
            style={{ flex: 1, padding: "10px", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: 600,
              background: role === "paciente" ? "#fff" : "transparent",
              color: role === "paciente" ? "#2563eb" : "#888",
              boxShadow: role === "paciente" ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
            }}>
            👤 Paciente
          </button>
        </div>

        {/* Form */}
        <div style={{ padding: "24px" }}>
          <p style={{ fontSize: "13px", color: "#888", margin: "0 0 20px", textAlign: "center" }}>
            {role === "dentista" ? "Acesso completo ao sistema" : "Acesso à sua área de paciente"}
          </p>

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "#444" }}>Usuário</label>
              <input className="input-login" type="text"
                placeholder={role === "dentista" ? "admin" : "paciente"}
                value={user} onChange={(e) => { setUser(e.target.value); setError(""); }}
                style={inputStyle} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "#444" }}>Senha</label>
              <input className="input-login" type="password" placeholder="••••••"
                value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }}
                style={inputStyle} />
            </div>

            {error && (
              <div style={{ background: "#fee2e2", border: "1px solid #fecaca", borderRadius: "8px", padding: "10px 12px", fontSize: "13px", color: "#ef4444" }}>
                ⚠️ {error}
              </div>
            )}

            <button className="btn-login" type="submit" style={{
              width: "100%", padding: "12px", background: "#2563eb", color: "white",
              border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "15px",
              fontWeight: 600, marginTop: "4px",
            }}>
              Entrar
            </button>
          </form>

          <div style={{ marginTop: "16px", padding: "12px", background: "#f8f9fc", borderRadius: "8px", fontSize: "12px", color: "#aaa", textAlign: "center" }}>
            {role === "dentista"
              ? <>Usuário: <strong style={{ color: "#555" }}>admin</strong> · Senha: <strong style={{ color: "#555" }}>1234</strong></>
              : <>Usuário: <strong style={{ color: "#555" }}>paciente</strong> · Senha: <strong style={{ color: "#555" }}>1234</strong></>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "11px 12px", borderRadius: "8px",
  border: "1.5px solid #e2e5ee", fontSize: "14px", fontFamily: "inherit",
  boxSizing: "border-box", background: "#f8f9fc", color: "#1a1a2e",
};
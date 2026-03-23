import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Welcome from "../components/Welcome";

const loginStyle = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .login-card  { animation: fadeUp 0.4s cubic-bezier(0.25,0.46,0.45,0.94) forwards; }
  .tab-btn     { transition: background 0.2s, color 0.2s, box-shadow 0.2s; cursor: pointer; border: none; font-family: inherit; }
  .input-login { transition: border-color 0.2s, box-shadow 0.2s; }
  .input-login:focus { border-color: #2563eb !important; box-shadow: 0 0 0 3px rgba(37,99,235,0.12) !important; outline: none; }
  .btn-login   { transition: background 0.15s, transform 0.1s; }
  .btn-login:hover  { background: #1d4ed8 !important; }
  .btn-login:active { transform: scale(0.98); }
  .role-btn    { transition: all 0.2s; cursor: pointer; border: 2px solid transparent; }
  .role-btn:hover  { border-color: #2563eb; }
  .role-btn.selected { border-color: #2563eb; background: #eff6ff !important; }
`;

export default function Login() {
  const [tab, setTab] = useState("login"); // "login" | "register"
  const [role, setRole] = useState("dentista");
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Cadastro
  const [regName, setRegName] = useState("");
  const [regUser, setRegUser] = useState("");
  const [regPass, setRegPass] = useState("");
  const [regPass2, setRegPass2] = useState("");
  const [regRole, setRegRole] = useState("dentista");
  const [regError, setRegError] = useState("");

  const [welcome, setWelcome] = useState(null);
  const navigate = useNavigate();

  function getAccounts() {
    const saved = localStorage.getItem("accounts");
    if (saved) return JSON.parse(saved);
    return [
      { name: "Administrador", user: "admin", senha: "1234", role: "dentista" },
      { name: "Paciente Demo", user: "paciente", senha: "1234", role: "paciente" },
    ];
  }

  function saveAccounts(accounts) {
    localStorage.setItem("accounts", JSON.stringify(accounts));
  }

  function handleLogin(e) {
    e.preventDefault();
    if (!user || !password) { setError("Preencha todos os campos."); return; }

    const accounts = getAccounts();
    const found = accounts.find((a) => a.user === user && a.senha === password && a.role === role);

    if (!found) { setError("Usuário ou senha incorretos."); return; }

    localStorage.setItem("auth", JSON.stringify({ user: found.user, name: found.name, role: found.role }));
    setWelcome(found.name || found.user);
  }

  function handleRegister(e) {
    e.preventDefault();
    if (!regName || !regUser || !regPass || !regPass2) { setRegError("Preencha todos os campos."); return; }
    if (regPass !== regPass2) { setRegError("As senhas não coincidem."); return; }
    if (regPass.length < 4) { setRegError("Senha deve ter pelo menos 4 caracteres."); return; }

    const accounts = getAccounts();
    if (accounts.find((a) => a.user === regUser)) { setRegError("Este usuário já existe."); return; }

    const newAccount = { name: regName, user: regUser, senha: regPass, role: regRole };
    saveAccounts([...accounts, newAccount]);

    localStorage.setItem("auth", JSON.stringify({ user: regUser, name: regName, role: regRole }));
    setWelcome(regName);
  }

  function clearLogin() { setUser(""); setPassword(""); setError(""); }
  function clearRegister() { setRegName(""); setRegUser(""); setRegPass(""); setRegPass2(""); setRegError(""); }

  function switchTab(t) {
    setTab(t);
    clearLogin();
    clearRegister();
  }

  if (welcome) {
    return <Welcome name={welcome} onDone={() => navigate("/")} />;
  }

  return (
    <div style={{
      display: "flex", minHeight: "100vh",
      background: "linear-gradient(135deg, #e3f2fd 0%, #f0f4f8 50%, #e8f5e9 100%)",
      alignItems: "center", justifyContent: "center", padding: "20px",
    }}>
      <style>{loginStyle}</style>

      <div className="login-card" style={{
        background: "#fff", borderRadius: "20px",
        boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
        width: "100%", maxWidth: "420px", overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{ background: "linear-gradient(135deg, #2196f3, #1976d2)", padding: "28px 32px", textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px" }}>
            <div style={{ width: 44, height: 44, background: "rgba(255,255,255,0.2)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
            </div>
            <div style={{ textAlign: "left" }}>
              <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#fff", margin: 0 }}>DentFlow</h1>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", margin: 0 }}>Gestão Odontológica</p>
            </div>
          </div>
        </div>

        {/* Tabs Login/Cadastro */}
        <div style={{ display: "flex", background: "#f4f6f8", margin: "24px 24px 0", borderRadius: "10px", padding: "4px" }}>
          <button className="tab-btn" onClick={() => switchTab("login")} style={{
            flex: 1, padding: "10px", borderRadius: "8px", fontSize: "14px", fontWeight: 600,
            background: tab === "login" ? "#fff" : "transparent",
            color: tab === "login" ? "#2563eb" : "#888",
            boxShadow: tab === "login" ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
          }}>Entrar</button>
          <button className="tab-btn" onClick={() => switchTab("register")} style={{
            flex: 1, padding: "10px", borderRadius: "8px", fontSize: "14px", fontWeight: 600,
            background: tab === "register" ? "#fff" : "transparent",
            color: tab === "register" ? "#2563eb" : "#888",
            boxShadow: tab === "register" ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
          }}>Cadastrar</button>
        </div>

        <div style={{ padding: "24px" }}>
          {tab === "login" ? (
            <>
              {/* Role selector */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "20px" }}>
                {[
                  { value: "dentista", label: "🦷 Dentista", sub: "Acesso completo" },
                  { value: "paciente", label: "👤 Paciente", sub: "Minha área" },
                ].map((r) => (
                  <div key={r.value} className={`role-btn${role === r.value ? " selected" : ""}`}
                    onClick={() => { setRole(r.value); setError(""); }}
                    style={{ padding: "12px", borderRadius: "10px", background: "#f8f9fc", textAlign: "center", userSelect: "none" }}>
                    <div style={{ fontSize: "20px", marginBottom: "4px" }}>{r.label}</div>
                    <div style={{ fontSize: "11px", color: "#888" }}>{r.sub}</div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <Field label="Usuário">
                  <input className="input-login" type="text" placeholder={role === "dentista" ? "admin" : "paciente"}
                    value={user} onChange={(e) => { setUser(e.target.value); setError(""); }} style={inputStyle} />
                </Field>
                <Field label="Senha">
                  <input className="input-login" type="password" placeholder="••••••"
                    value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }} style={inputStyle} />
                </Field>
                {error && <ErrorBox message={error} />}
                <button className="btn-login" type="submit" style={btnStyle}>Entrar</button>
              </form>

              <div style={{ marginTop: "16px", padding: "12px", background: "#f8f9fc", borderRadius: "8px", fontSize: "12px", color: "#aaa", textAlign: "center" }}>
                Demo → Dentista: <strong style={{ color: "#555" }}>admin / 1234</strong> · Paciente: <strong style={{ color: "#555" }}>paciente / 1234</strong>
              </div>
            </>
          ) : (
            <>
              {/* Role selector cadastro */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "20px" }}>
                {[
                  { value: "dentista", label: "🦷 Dentista" },
                  { value: "paciente", label: "👤 Paciente" },
                ].map((r) => (
                  <div key={r.value} className={`role-btn${regRole === r.value ? " selected" : ""}`}
                    onClick={() => { setRegRole(r.value); setRegError(""); }}
                    style={{ padding: "12px", borderRadius: "10px", background: "#f8f9fc", textAlign: "center", userSelect: "none", fontSize: "14px", fontWeight: 600, color: "#555" }}>
                    {r.label}
                  </div>
                ))}
              </div>

              <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <Field label="Nome completo">
                  <input className="input-login" type="text" placeholder="Seu nome"
                    value={regName} onChange={(e) => { setRegName(e.target.value); setRegError(""); }} style={inputStyle} />
                </Field>
                <Field label="Usuário">
                  <input className="input-login" type="text" placeholder="Escolha um usuário"
                    value={regUser} onChange={(e) => { setRegUser(e.target.value); setRegError(""); }} style={inputStyle} />
                </Field>
                <Field label="Senha">
                  <input className="input-login" type="password" placeholder="Mínimo 4 caracteres"
                    value={regPass} onChange={(e) => { setRegPass(e.target.value); setRegError(""); }} style={inputStyle} />
                </Field>
                <Field label="Confirmar senha">
                  <input className="input-login" type="password" placeholder="Repita a senha"
                    value={regPass2} onChange={(e) => { setRegPass2(e.target.value); setRegError(""); }} style={inputStyle} />
                </Field>
                {regError && <ErrorBox message={regError} />}
                <button className="btn-login" type="submit" style={btnStyle}>Criar Conta</button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label style={{ fontSize: "13px", fontWeight: 600, color: "#444" }}>{label}</label>
      {children}
    </div>
  );
}

function ErrorBox({ message }) {
  return (
    <div style={{ background: "#fee2e2", border: "1px solid #fecaca", borderRadius: "8px", padding: "10px 12px", fontSize: "13px", color: "#ef4444" }}>
      ⚠️ {message}
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "11px 12px", borderRadius: "8px",
  border: "1.5px solid #e2e5ee", fontSize: "14px", fontFamily: "inherit",
  boxSizing: "border-box", background: "#f8f9fc", color: "#1a1a2e",
};

const btnStyle = {
  width: "100%", padding: "12px", background: "#2563eb", color: "white",
  border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "15px",
  fontWeight: 600, marginTop: "4px", fontFamily: "inherit",
};
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Welcome from "../components/Welcome";

const BG_IMAGE = "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1920&q=80&auto=format&fit=crop";

const loginStyle = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes tabEnter {
    from { opacity: 0; transform: translateX(20px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes tabEnterLeft {
    from { opacity: 0; transform: translateX(-20px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.5; }
  }
  .login-card        { animation: fadeUp 0.5s cubic-bezier(0.25,0.46,0.45,0.94) forwards; }
  .tab-content-right { animation: tabEnter 0.3s cubic-bezier(0.25,0.46,0.45,0.94) forwards; }
  .tab-content-left  { animation: tabEnterLeft 0.3s cubic-bezier(0.25,0.46,0.45,0.94) forwards; }
  .tab-btn { transition: all 0.2s; cursor: pointer; border: none; font-family: inherit; }
  .input-login { transition: border-color 0.2s, box-shadow 0.2s, background 0.2s; }
  .input-login:focus {
    border-color: rgba(96,165,250,0.8) !important;
    box-shadow: 0 0 0 3px rgba(96,165,250,0.2) !important;
    outline: none;
    background: rgba(255,255,255,0.15) !important;
  }
  .input-login::placeholder { color: rgba(255,255,255,0.35) !important; }
  .btn-login { transition: all 0.2s; }
  .btn-login:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(33,150,243,0.5) !important; }
  .btn-login:active { transform: scale(0.98); }
  .btn-demo {
    transition: all 0.2s;
    position: relative;
    overflow: hidden;
  }
  .btn-demo:hover { transform: translateY(-1px); background: rgba(251,191,36,0.15) !important; border-color: rgba(251,191,36,0.5) !important; }
  .btn-demo:active { transform: scale(0.98); }
  .demo-dot { animation: pulse 1.5s ease-in-out infinite; }
  .role-btn { transition: all 0.2s; cursor: pointer; }
  .role-btn:hover { border-color: rgba(96,165,250,0.5) !important; background: rgba(255,255,255,0.12) !important; }
  .role-btn.selected { border-color: rgba(96,165,250,0.8) !important; background: rgba(33,150,243,0.2) !important; }
  .remember-check { cursor: pointer; accent-color: #60a5fa; width: 16px; height: 16px; }
  .divider {
    display: flex;
    align-items: center;
    gap: 12px;
    color: rgba(255,255,255,0.2);
    font-size: 12px;
  }
  .divider::before, .divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(255,255,255,0.1);
  }
`;

export default function Login() {
  const [tab, setTab] = useState("login");
  const [prevTab, setPrevTab] = useState(null);
  const [role, setRole] = useState("dentista");
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");

  const [regName, setRegName] = useState("");
  const [regUser, setRegUser] = useState("");
  const [regPass, setRegPass] = useState("");
  const [regPass2, setRegPass2] = useState("");
  const [regRole, setRegRole] = useState("dentista");
  const [regError, setRegError] = useState("");

  const [welcome, setWelcome] = useState(null);
  const [isDemo, setIsDemo] = useState(false);
  const navigate = useNavigate();

  function getAccounts() {
    const saved = localStorage.getItem("accounts");
    if (saved) return JSON.parse(saved);
    return [
      { name: "Administrador", user: "admin", senha: "1234", role: "dentista" },
      { name: "Paciente Demo", user: "paciente", senha: "1234", role: "paciente" },
    ];
  }

  function handleLogin(e) {
    e.preventDefault();
    if (!user || !password) { setError("Preencha todos os campos."); return; }
    const accounts = getAccounts();
    const found = accounts.find((a) => a.user === user && a.senha === password && a.role === role);
    if (!found) { setError("Usuário ou senha incorretos."); return; }
    const authData = JSON.stringify({ user: found.user, name: found.name, role: found.role });
    if (remember) {
      localStorage.setItem("auth", authData);
    } else {
      sessionStorage.setItem("auth", authData);
      localStorage.removeItem("auth");
    }
    setIsDemo(false);
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
    localStorage.setItem("accounts", JSON.stringify([...accounts, newAccount]));
    sessionStorage.setItem("auth", JSON.stringify({ user: regUser, name: regName, role: regRole }));
    localStorage.removeItem("auth");
    setIsDemo(false);
    setWelcome(regName);
  }

  function handleDemo() {
    const authData = JSON.stringify({ user: "admin", name: "Demonstração", role: "dentista" });
    sessionStorage.setItem("auth", authData);
    localStorage.removeItem("auth");
    setIsDemo(true);
    setWelcome("Demonstração");
  }

  function switchTab(t) {
    if (t === tab) return;
    setPrevTab(tab);
    setTab(t);
    setUser(""); setPassword(""); setError("");
    setRegName(""); setRegUser(""); setRegPass(""); setRegPass2(""); setRegError("");
  }

  const animClass = prevTab === null ? "" : tab === "register" ? "tab-content-right" : "tab-content-left";

  if (welcome) {
    return <Welcome name={welcome} isDemo={isDemo} onDone={() => navigate("/dashboard")} />;
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", position: "relative", overflow: "hidden" }}>
      <style>{loginStyle}</style>

      {/* Imagem de fundo */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, backgroundImage: `url(${BG_IMAGE})`, backgroundSize: "cover", backgroundPosition: "center", filter: "brightness(0.5)" }} />
      <div style={{ position: "fixed", inset: 0, zIndex: 1, background: "linear-gradient(135deg, rgba(10,22,40,0.7) 0%, rgba(13,33,68,0.5) 50%, rgba(10,48,96,0.6) 100%)" }} />

      {/* Card */}
      <div className="login-card" style={{
        position: "relative", zIndex: 2,
        background: "rgba(255,255,255,0.08)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1px solid rgba(255,255,255,0.15)",
        borderRadius: "24px",
        width: "100%", maxWidth: "420px",
        overflow: "hidden",
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
      }}>
        {/* Header */}
        <div style={{ padding: "28px 28px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: 46, height: 46, background: "linear-gradient(135deg, #2196f3, #1565c0)", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 15px rgba(33,150,243,0.4)" }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="white"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
            </div>
            <div>
              <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#fff", margin: 0 }}>DentFlow</h1>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", margin: 0 }}>Gestão Odontológica</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", background: "rgba(255,255,255,0.05)", margin: "20px 20px 0", borderRadius: "12px", padding: "4px" }}>
          {["login", "register"].map((t) => (
            <button key={t} className="tab-btn" onClick={() => switchTab(t)} style={{
              flex: 1, padding: "10px", borderRadius: "10px", fontSize: "14px", fontWeight: 600,
              background: tab === t ? "rgba(255,255,255,0.12)" : "transparent",
              color: tab === t ? "#fff" : "rgba(255,255,255,0.45)",
              boxShadow: tab === t ? "0 2px 8px rgba(0,0,0,0.2)" : "none",
              border: tab === t ? "1px solid rgba(255,255,255,0.15)" : "1px solid transparent",
            }}>
              {t === "login" ? "Entrar" : "Cadastrar"}
            </button>
          ))}
        </div>

        {/* Conteúdo */}
        <div style={{ overflow: "hidden" }}>
          <div key={tab} className={animClass} style={{ padding: "20px" }}>
            {tab === "login" ? (
              <>
                {/* Role */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
                  {[
                    { value: "dentista", label: "🦷 Dentista", sub: "Acesso completo" },
                    { value: "paciente", label: "👤 Paciente", sub: "Minha área" },
                  ].map((r) => (
                    <div key={r.value} className={`role-btn${role === r.value ? " selected" : ""}`}
                      onClick={() => { setRole(r.value); setError(""); }}
                      style={{ padding: "12px", borderRadius: "12px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", textAlign: "center", userSelect: "none" }}>
                      <div style={{ fontSize: "18px", marginBottom: "4px" }}>{r.label}</div>
                      <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>{r.sub}</div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <Field label="Usuário">
                    <input className="input-login" type="text"
                      placeholder={role === "dentista" ? "admin" : "paciente"}
                      value={user} onChange={(e) => { setUser(e.target.value); setError(""); }} style={inputStyle} />
                  </Field>
                  <Field label="Senha">
                    <input className="input-login" type="password" placeholder="••••••"
                      value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }} style={inputStyle} />
                  </Field>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", userSelect: "none" }}>
                    <input type="checkbox" className="remember-check" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                    <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>Lembrar de mim</span>
                  </label>
                  {error && <ErrorBox message={error} />}
                  <button className="btn-login" type="submit" style={btnStyle}>Entrar</button>
                </form>

                {/* Divisor */}
                <div className="divider" style={{ margin: "16px 0" }}>ou</div>

                {/* Botão Demo */}
                <button className="btn-demo" onClick={handleDemo} style={{
                  width: "100%", padding: "12px", fontSize: "14px", fontWeight: 600,
                  fontFamily: "Inter, sans-serif", borderRadius: "10px", cursor: "pointer",
                  color: "#fbbf24", background: "rgba(251,191,36,0.08)",
                  border: "1px solid rgba(251,191,36,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                }}>
                  <span className="demo-dot" style={{ width: 7, height: 7, background: "#fbbf24", borderRadius: "50%", display: "inline-block" }} />
                  Entrar na versão Demo
                </button>

                <div style={{ marginTop: "14px", padding: "10px 14px", background: "rgba(255,255,255,0.05)", borderRadius: "10px", fontSize: "12px", color: "rgba(255,255,255,0.35)", textAlign: "center", border: "1px solid rgba(255,255,255,0.08)" }}>
                  Demo → <strong style={{ color: "rgba(255,255,255,0.6)" }}>admin / 1234</strong> · <strong style={{ color: "rgba(255,255,255,0.6)" }}>paciente / 1234</strong>
                </div>
              </>
            ) : (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
                  {[
                    { value: "dentista", label: "🦷 Dentista" },
                    { value: "paciente", label: "👤 Paciente" },
                  ].map((r) => (
                    <div key={r.value} className={`role-btn${regRole === r.value ? " selected" : ""}`}
                      onClick={() => { setRegRole(r.value); setRegError(""); }}
                      style={{ padding: "12px", borderRadius: "12px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", textAlign: "center", userSelect: "none", fontSize: "14px", fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>
                      {r.label}
                    </div>
                  ))}
                </div>

                <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
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
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
      <label style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.65)" }}>{label}</label>
      {children}
    </div>
  );
}

function ErrorBox({ message }) {
  return (
    <div style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "10px", padding: "10px 14px", fontSize: "13px", color: "#f87171" }}>
      ⚠️ {message}
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "11px 14px", borderRadius: "10px",
  border: "1px solid rgba(255,255,255,0.15)", fontSize: "14px",
  fontFamily: "Inter, sans-serif", boxSizing: "border-box",
  background: "rgba(255,255,255,0.08)", color: "#fff",
};

const btnStyle = {
  width: "100%", padding: "12px", fontSize: "15px", fontWeight: 600,
  fontFamily: "Inter, sans-serif", border: "none", borderRadius: "10px",
  cursor: "pointer", color: "#fff", marginTop: "4px",
  background: "linear-gradient(135deg, #2196f3, #1565c0)",
  boxShadow: "0 4px 15px rgba(33,150,243,0.4)",
};
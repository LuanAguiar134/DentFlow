import { useState } from "react";
import { useNavigate } from "react-router-dom";

const USUARIO = "admin";
const SENHA = "1234";

export default function Login() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleLogin(e) {
    e.preventDefault();

    if (!user || !password) {
      setError("Preencha todos os campos.");
      return;
    }

    if (user !== USUARIO || password !== SENHA) {
      setError("Usuário ou senha incorretos.");
      return;
    }

    localStorage.setItem("auth", JSON.stringify({ user }));
    navigate("/");
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#f4f6f8",
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          background: "white",
          padding: "36px 30px",
          borderRadius: "12px",
          boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
          width: "320px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "8px" }}>
          <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#1e3a8a", margin: 0 }}>
            DentFlow
          </h1>
          <p style={{ fontSize: "13px", color: "#888", margin: "4px 0 0" }}>
            Gestão Odontológica
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "13px", fontWeight: 600, color: "#444" }}>
            Usuário
          </label>
          <input
            type="text"
            placeholder="admin"
            value={user}
            onChange={(e) => { setUser(e.target.value); setError(""); }}
            style={inputStyle}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "13px", fontWeight: 600, color: "#444" }}>
            Senha
          </label>
          <input
            type="password"
            placeholder="••••"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(""); }}
            style={inputStyle}
          />
        </div>

        {error && (
          <p style={{ color: "#ef4444", fontSize: "13px", margin: 0 }}>
            {error}
          </p>
        )}

        <button type="submit" style={buttonStyle}>
          Entrar
        </button>

        <p style={{ fontSize: "12px", color: "#bbb", textAlign: "center", margin: 0 }}>
          Usuário: <strong>admin</strong> · Senha: <strong>1234</strong>
        </p>
      </form>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: "7px",
  border: "1.5px solid #e2e5ee",
  fontSize: "14px",
  outline: "none",
  fontFamily: "inherit",
  boxSizing: "border-box",
  background: "#f8f9fc",
  color: "#1a1a2e",
};

const buttonStyle = {
  width: "100%",
  padding: "11px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "7px",
  cursor: "pointer",
  fontSize: "15px",
  fontWeight: 600,
  marginTop: "4px",
};
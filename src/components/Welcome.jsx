import { useEffect, useState } from "react";

const welcomeStyle = `
  @keyframes logoFadeIn {
    from { opacity: 0; transform: scale(0.6); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes textFadeIn {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes subFadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes overlayFadeOut {
    from { opacity: 1; }
    to   { opacity: 0; }
  }
  .logo-anim  { animation: logoFadeIn 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.2s both; }
  .text-anim  { animation: textFadeIn 0.5s ease 0.7s both; }
  .sub-anim   { animation: subFadeIn 0.5s ease 1.1s both; }
  .fade-out   { animation: overlayFadeOut 0.5s ease forwards; }
`;

export default function Welcome({ name, onDone }) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setLeaving(true), 2200);
    const t2 = setTimeout(() => onDone(), 2700);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <>
      <style>{welcomeStyle}</style>
      <div className={leaving ? "fade-out" : ""} style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "linear-gradient(135deg, #1976d2 0%, #2196f3 50%, #42a5f5 100%)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: "24px",
      }}>
        {/* Logo */}
        <div className="logo-anim" style={{
          width: 90, height: 90,
          background: "rgba(255,255,255,0.2)",
          borderRadius: "24px",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
        }}>
          <svg width="52" height="52" viewBox="0 0 24 24" fill="white">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        </div>

        {/* Texto */}
        <div style={{ textAlign: "center" }}>
          <h1 className="text-anim" style={{
            fontSize: "32px", fontWeight: 700,
            color: "#fff", margin: 0, letterSpacing: "-0.5px",
          }}>
            Bem-vindo ao DentFlow
          </h1>
          <p className="sub-anim" style={{
            fontSize: "16px", color: "rgba(255,255,255,0.75)",
            margin: "8px 0 0",
          }}>
            Olá, {name}! 👋
          </p>
        </div>
      </div>
    </>
  );
}
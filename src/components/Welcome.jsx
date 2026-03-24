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
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  .logo-anim  { animation: logoFadeIn 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.2s both; }
  .text-anim  { animation: textFadeIn 0.5s ease 0.7s both; }
  .sub-anim   { animation: subFadeIn 0.5s ease 1.1s both; }
  .badge-anim { animation: subFadeIn 0.5s ease 1.3s both; }
  .fade-out   { animation: overlayFadeOut 0.5s ease forwards; }
  .shimmer-text {
    background: linear-gradient(90deg, #fbbf24, #f59e0b, #fde68a, #fbbf24);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shimmer 2s linear infinite;
  }
`;

export default function Welcome({ name, isDemo = false, onDone }) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setLeaving(true), 2400);
    const t2 = setTimeout(() => onDone(), 2900);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <>
      <style>{welcomeStyle}</style>
      <div className={leaving ? "fade-out" : ""} style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: isDemo
          ? "linear-gradient(135deg, #1a1200 0%, #2d1f00 50%, #1a1600 100%)"
          : "linear-gradient(135deg, #0a1628 0%, #0d2144 50%, #0a3060 100%)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: "24px",
      }}>
        {/* Logo */}
        <div className="logo-anim" style={{
          width: 90, height: 90,
          background: isDemo ? "rgba(251,191,36,0.1)" : "rgba(255,255,255,0.08)",
          backdropFilter: "blur(10px)",
          border: `1px solid ${isDemo ? "rgba(251,191,36,0.3)" : "rgba(255,255,255,0.15)"}`,
          borderRadius: "24px",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: isDemo ? "0 8px 32px rgba(251,191,36,0.2)" : "0 8px 32px rgba(0,0,0,0.4)",
        }}>
          <svg width="52" height="52" viewBox="0 0 24 24" fill={isDemo ? "#fbbf24" : "white"} opacity="0.9">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        </div>

        {/* Texto */}
        <div style={{ textAlign: "center" }}>
          {isDemo ? (
            <>
              <h1 className="text-anim shimmer-text" style={{
                fontSize: "32px", fontWeight: 700, margin: 0,
                letterSpacing: "-0.5px", fontFamily: "Inter, sans-serif",
              }}>
                Bem-vindo à Demonstração
              </h1>
              <p className="sub-anim" style={{
                fontSize: "15px", color: "rgba(255,255,255,0.45)",
                margin: "10px 0 0", fontFamily: "Inter, sans-serif",
              }}>
                Explore todas as funcionalidades do DentFlow! ✨
              </p>
            </>
          ) : (
            <>
              <h1 className="text-anim" style={{
                fontSize: "32px", fontWeight: 700, color: "#fff",
                margin: 0, letterSpacing: "-0.5px", fontFamily: "Inter, sans-serif",
              }}>
                Bem-vindo ao DentFlow
              </h1>
              <p className="sub-anim" style={{
                fontSize: "15px", color: "rgba(255,255,255,0.5)",
                margin: "10px 0 0", fontFamily: "Inter, sans-serif",
              }}>
                Olá, {name}! 👋
              </p>
            </>
          )}
        </div>

        {/* Badge demo */}
        {isDemo && (
          <div className="badge-anim" style={{
            background: "rgba(251,191,36,0.12)",
            border: "1px solid rgba(251,191,36,0.3)",
            borderRadius: "100px",
            padding: "6px 16px",
            fontSize: "12px",
            color: "#fbbf24",
            fontWeight: 600,
            fontFamily: "Inter, sans-serif",
          }}>
            🔓 Acesso completo liberado
          </div>
        )}

        {/* Pontinhos */}
        <div className="sub-anim" style={{ display: "flex", gap: "8px" }}>
          {[0,1,2].map((i) => (
            <div key={i} style={{
              width: 6, height: 6, borderRadius: "50%",
              background: isDemo
                ? `rgba(251,191,36,${0.3 + i * 0.2})`
                : `rgba(96,165,250,${0.3 + i * 0.2})`,
            }} />
          ))}
        </div>
      </div>
    </>
  );
}
import { useNavigate } from "react-router-dom";

const landingStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .landing-page {
    font-family: 'Inter', sans-serif;
    background: #0a1628;
    color: #fff;
    min-height: 100vh;
    overflow-x: hidden;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(30px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-10px); }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.6; }
  }

  .hero-title  { animation: fadeUp 0.7s ease 0.1s both; }
  .hero-sub    { animation: fadeUp 0.7s ease 0.3s both; }
  .hero-cta    { animation: fadeUp 0.7s ease 0.5s both; }
  .hero-badge  { animation: fadeUp 0.7s ease 0.0s both; }
  .hero-img    { animation: fadeIn 1s ease 0.4s both; }
  .float-card  { animation: float 4s ease-in-out infinite; }

  .feature-card {
    background: rgba(255,255,255,0.05);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px;
    padding: 28px;
    transition: all 0.3s;
    cursor: default;
  }

  .feature-card:hover {
    background: rgba(255,255,255,0.08);
    border-color: rgba(96,165,250,0.3);
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
  }

  .btn-primary-land {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: linear-gradient(135deg, #2196f3, #1565c0);
    color: #fff;
    border: none;
    border-radius: 12px;
    padding: 14px 28px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    transition: all 0.2s;
    box-shadow: 0 4px 20px rgba(33,150,243,0.4);
    text-decoration: none;
  }

  .btn-primary-land:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(33,150,243,0.5);
  }

  .btn-secondary-land {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(255,255,255,0.08);
    color: #fff;
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 12px;
    padding: 14px 28px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    transition: all 0.2s;
    text-decoration: none;
  }

  .btn-secondary-land:hover {
    background: rgba(255,255,255,0.14);
    transform: translateY(-2px);
  }

  .stat-card {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px;
    padding: 24px;
    text-align: center;
    transition: all 0.3s;
  }

  .stat-card:hover {
    background: rgba(255,255,255,0.08);
    transform: scale(1.03);
  }

  .pricing-card {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 24px;
    padding: 36px;
    transition: all 0.3s;
    position: relative;
  }

  .pricing-card.featured {
    background: rgba(33,150,243,0.12);
    border-color: rgba(96,165,250,0.4);
    box-shadow: 0 0 40px rgba(33,150,243,0.2);
  }

  .pricing-card:hover {
    transform: translateY(-4px);
  }

  .nav-link {
    color: rgba(255,255,255,0.6);
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    transition: color 0.2s;
    cursor: pointer;
  }

  .nav-link:hover { color: #fff; }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 10px; }
`;

const features = [
  {
    icon: "📅",
    color: "#60a5fa",
    bg: "rgba(96,165,250,0.15)",
    title: "Agenda Inteligente",
    desc: "Gerencie consultas com calendário semanal interativo. Visualize, agende e cancele consultas em poucos cliques.",
  },
  {
    icon: "👥",
    color: "#4ade80",
    bg: "rgba(74,222,128,0.15)",
    title: "Gestão de Pacientes",
    desc: "Cadastro completo com histórico médico, alergias, CPF, contato e acompanhamento de cada paciente.",
  },
  {
    icon: "💰",
    color: "#fbbf24",
    bg: "rgba(251,191,36,0.15)",
    title: "Controle Financeiro",
    desc: "Acompanhe receitas, pagamentos pendentes e confirmados. Relatórios mensais automáticos.",
  },
  {
    icon: "🦷",
    color: "#f472b6",
    bg: "rgba(244,114,182,0.15)",
    title: "Catálogo de Procedimentos",
    desc: "Liste todos os tratamentos com preços e duração. Facilite o orçamento para seus pacientes.",
  },
  {
    icon: "🔒",
    color: "#a78bfa",
    bg: "rgba(167,139,250,0.15)",
    title: "Acesso por Perfil",
    desc: "Dentistas têm acesso completo. Pacientes visualizam apenas suas próprias consultas e histórico.",
  },
  {
    icon: "📊",
    color: "#34d399",
    bg: "rgba(52,211,153,0.15)",
    title: "Dashboard em Tempo Real",
    desc: "Visão geral do consultório: consultas do dia, receita do mês, taxa de presença e gráfico semanal.",
  },
];

const steps = [
  { num: "01", title: "Cadastre sua clínica", desc: "Crie sua conta de dentista em segundos e configure o sistema." },
  { num: "02", title: "Adicione seus pacientes", desc: "Importe ou cadastre manualmente com histórico completo." },
  { num: "03", title: "Gerencie sua agenda", desc: "Agende consultas e acompanhe o dia a dia do consultório." },
  { num: "04", title: "Controle as finanças", desc: "Registre pagamentos e acompanhe a receita do mês." },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <style>{landingStyle}</style>

      {/* Fundo decorativo */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-20%", left: "-10%", width: 600, height: 600, background: "radial-gradient(circle, rgba(33,150,243,0.12) 0%, transparent 70%)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: "-10%", right: "-5%", width: 500, height: 500, background: "radial-gradient(circle, rgba(96,165,250,0.08) 0%, transparent 70%)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", top: "40%", right: "20%", width: 300, height: 300, background: "radial-gradient(circle, rgba(167,139,250,0.06) 0%, transparent 70%)", borderRadius: "50%" }} />
      </div>

      {/* ── NAVBAR ── */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(10,22,40,0.8)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: 36, height: 36, background: "linear-gradient(135deg, #2196f3, #1565c0)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
            </div>
            <span style={{ fontSize: "17px", fontWeight: 700, color: "#fff" }}>DentFlow</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
            <a className="nav-link" href="#features">Funcionalidades</a>
            <a className="nav-link" href="#como-funciona">Como funciona</a>
            <a className="nav-link" href="#planos">Planos</a>
            <button className="btn-primary-land" onClick={() => navigate("/login")} style={{ padding: "9px 20px", fontSize: "14px" }}>
              Acessar Sistema →
            </button>
          </div>
        </div>
      </nav>

      <div style={{ position: "relative", zIndex: 1 }}>

        {/* ── HERO ── */}
        <section style={{ maxWidth: 1200, margin: "0 auto", padding: "100px 24px 80px", textAlign: "center" }}>
          <div className="hero-badge" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(33,150,243,0.12)", border: "1px solid rgba(96,165,250,0.3)", borderRadius: "100px", padding: "6px 16px", fontSize: "13px", color: "#60a5fa", fontWeight: 500, marginBottom: "28px" }}>
            <span style={{ width: 6, height: 6, background: "#60a5fa", borderRadius: "50%", animation: "pulse 2s infinite" }} />
            Sistema completo para clínicas odontológicas
          </div>

          <h1 className="hero-title" style={{ fontSize: "clamp(36px, 6vw, 68px)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-1.5px", marginBottom: "24px" }}>
            Gerencie sua clínica
            <br />
            <span style={{ background: "linear-gradient(135deg, #60a5fa, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              com inteligência
            </span>
          </h1>

          <p className="hero-sub" style={{ fontSize: "18px", color: "rgba(255,255,255,0.55)", maxWidth: 560, margin: "0 auto 40px", lineHeight: 1.7 }}>
            Agenda de pacientes, controle financeiro, histórico de atendimentos e muito mais — tudo em um só lugar, moderno e fácil de usar.
          </p>

          <div className="hero-cta" style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn-primary-land" onClick={() => navigate("/login")}>
              Começar agora — é grátis
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
            <button className="btn-secondary-land" onClick={() => navigate("/login")}>
              Ver demonstração
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", maxWidth: 600, margin: "64px auto 0" }}>
            {[
              { value: "100%", label: "Web based" },
              { value: "2", label: "Perfis de acesso" },
              { value: "∞", label: "Pacientes" },
            ].map((s) => (
              <div key={s.label} className="stat-card">
                <p style={{ fontSize: "28px", fontWeight: 800, color: "#60a5fa", margin: 0 }}>{s.value}</p>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", margin: "6px 0 0" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── PREVIEW CARD ── */}
        <section style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 100px" }}>
          <div className="hero-img float-card" style={{
            background: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "24px",
            padding: "24px",
            boxShadow: "0 40px 80px rgba(0,0,0,0.5)",
          }}>
            {/* Fake dashboard preview */}
            <div style={{ display: "flex", gap: "16px" }}>
              {/* Fake sidebar */}
              <div style={{ width: 160, background: "rgba(0,0,0,0.3)", borderRadius: "14px", padding: "16px 12px", flexShrink: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
                  <div style={{ width: 28, height: 28, background: "#2196f3", borderRadius: "8px" }} />
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "#fff" }}>DentFlow</span>
                </div>
                {["Dashboard", "Agenda", "Pacientes", "Financeiro"].map((item, i) => (
                  <div key={item} style={{ padding: "8px 10px", borderRadius: "8px", marginBottom: "4px", background: i === 0 ? "rgba(33,150,243,0.25)" : "transparent", fontSize: "12px", color: i === 0 ? "#60a5fa" : "rgba(255,255,255,0.45)", fontWeight: i === 0 ? 600 : 400 }}>
                    {item}
                  </div>
                ))}
              </div>

              {/* Fake content */}
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "16px", fontWeight: 700, color: "#fff", marginBottom: "14px" }}>Bom dia, Doutor! ☀️</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginBottom: "14px" }}>
                  {[
                    { label: "Consultas Hoje", value: "8", color: "rgba(96,165,250,0.2)", text: "#60a5fa" },
                    { label: "Pacientes", value: "124", color: "rgba(74,222,128,0.2)", text: "#4ade80" },
                    { label: "Receita Mês", value: "R$ 8.4k", color: "rgba(251,191,36,0.2)", text: "#fbbf24" },
                  ].map((c) => (
                    <div key={c.label} style={{ background: c.color, border: `1px solid ${c.text}33`, borderRadius: "12px", padding: "12px" }}>
                      <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.5)", margin: "0 0 6px" }}>{c.label}</p>
                      <p style={{ fontSize: "18px", fontWeight: 700, color: c.text, margin: 0 }}>{c.value}</p>
                    </div>
                  ))}
                </div>
                {/* Fake chart bars */}
                <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: "12px", padding: "14px" }}>
                  <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", margin: "0 0 12px" }}>CONSULTAS DA SEMANA</p>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", height: "60px" }}>
                    {[30, 60, 45, 80, 55, 70, 40].map((h, i) => (
                      <div key={i} style={{ flex: 1, background: `rgba(96,165,250,${0.2 + (h / 100) * 0.5})`, borderRadius: "4px 4px 0 0", height: `${h}%`, border: "1px solid rgba(96,165,250,0.3)" }} />
                    ))}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
                    {["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"].map((d) => (
                      <span key={d} style={{ flex: 1, textAlign: "center", fontSize: "9px", color: "rgba(255,255,255,0.3)" }}>{d}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section id="features" style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <p style={{ fontSize: "13px", color: "#60a5fa", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px" }}>Funcionalidades</p>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, letterSpacing: "-0.5px", marginBottom: "16px" }}>
              Tudo que sua clínica precisa
            </h2>
            <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.5)", maxWidth: 480, margin: "0 auto" }}>
              Um sistema completo desenvolvido especialmente para dentistas e clínicas odontológicas.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
            {features.map((f) => (
              <div key={f.title} className="feature-card">
                <div style={{ width: 48, height: 48, borderRadius: "14px", background: f.bg, border: `1px solid ${f.color}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", marginBottom: "18px" }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#fff", marginBottom: "10px" }}>{f.title}</h3>
                <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── COMO FUNCIONA ── */}
        <section id="como-funciona" style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <p style={{ fontSize: "13px", color: "#60a5fa", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px" }}>Como funciona</p>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, letterSpacing: "-0.5px" }}>
              Simples de usar
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
            {steps.map((s, i) => (
              <div key={s.num} style={{ position: "relative" }}>
                {i < steps.length - 1 && (
                  <div style={{ position: "absolute", top: 28, left: "calc(50% + 32px)", width: "calc(100% - 32px)", height: "1px", background: "linear-gradient(90deg, rgba(96,165,250,0.4), rgba(96,165,250,0))", zIndex: 0 }} />
                )}
                <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "28px 20px", textAlign: "center", position: "relative", zIndex: 1 }}>
                  <div style={{ width: 52, height: 52, background: "rgba(33,150,243,0.15)", border: "1px solid rgba(96,165,250,0.3)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: "16px", fontWeight: 800, color: "#60a5fa" }}>{s.num}</div>
                  <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>{s.title}</h3>
                  <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── PLANOS ── */}
        <section id="planos" style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <p style={{ fontSize: "13px", color: "#60a5fa", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px" }}>Planos</p>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, letterSpacing: "-0.5px", marginBottom: "16px" }}>Escolha seu plano</h2>
            <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.5)" }}>Sem taxas escondidas. Cancele quando quiser.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px", maxWidth: 900, margin: "0 auto" }}>
            {[
              {
                name: "Básico", price: "Grátis", period: "para sempre",
                desc: "Ideal para dentistas autônomos",
                features: ["Até 50 pacientes", "Agenda completa", "Dashboard básico", "1 usuário"],
                cta: "Começar grátis", featured: false,
              },
              {
                name: "Pro", price: "R$ 49", period: "/mês",
                desc: "Para clínicas em crescimento",
                features: ["Pacientes ilimitados", "Controle financeiro", "Múltiplos dentistas", "Suporte prioritário", "Relatórios avançados"],
                cta: "Assinar Pro", featured: true,
              },
              {
                name: "Clínica", price: "R$ 99", period: "/mês",
                desc: "Para grandes clínicas",
                features: ["Tudo do Pro", "Multi-unidades", "API de integração", "Onboarding dedicado", "SLA garantido"],
                cta: "Falar com vendas", featured: false,
              },
            ].map((plan) => (
              <div key={plan.name} className={`pricing-card${plan.featured ? " featured" : ""}`}>
                {plan.featured && (
                  <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg, #2196f3, #1565c0)", color: "#fff", fontSize: "12px", fontWeight: 700, padding: "4px 16px", borderRadius: "100px", whiteSpace: "nowrap", boxShadow: "0 4px 12px rgba(33,150,243,0.4)" }}>
                    Mais popular
                  </div>
                )}
                <p style={{ fontSize: "14px", fontWeight: 600, color: "rgba(255,255,255,0.6)", marginBottom: "8px" }}>{plan.name}</p>
                <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "8px" }}>
                  <span style={{ fontSize: "36px", fontWeight: 800, color: "#fff" }}>{plan.price}</span>
                  <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)" }}>{plan.period}</span>
                </div>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", marginBottom: "24px" }}>{plan.desc}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "28px" }}>
                  {plan.features.map((f) => (
                    <div key={f} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "rgba(255,255,255,0.7)" }}>
                      <span style={{ color: "#4ade80", fontSize: "16px" }}>✓</span>
                      {f}
                    </div>
                  ))}
                </div>
                <button
                  className={plan.featured ? "btn-primary-land" : "btn-secondary-land"}
                  onClick={() => navigate("/login")}
                  style={{ width: "100%", justifyContent: "center", padding: "12px" }}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA FINAL ── */}
        <section style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px 120px" }}>
          <div style={{
            background: "linear-gradient(135deg, rgba(33,150,243,0.15), rgba(167,139,250,0.1))",
            border: "1px solid rgba(96,165,250,0.2)",
            borderRadius: "28px",
            padding: "64px 40px",
            textAlign: "center",
          }}>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, letterSpacing: "-0.5px", marginBottom: "16px" }}>
              Pronto para modernizar
              <br />sua clínica?
            </h2>
            <p style={{ fontSize: "17px", color: "rgba(255,255,255,0.5)", marginBottom: "36px", maxWidth: 480, margin: "0 auto 36px" }}>
              Comece gratuitamente hoje e veja como o DentFlow transforma a gestão do seu consultório.
            </p>
            <button className="btn-primary-land" onClick={() => navigate("/login")} style={{ fontSize: "17px", padding: "16px 36px" }}>
              Criar conta grátis
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "32px 24px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: 30, height: 30, background: "linear-gradient(135deg, #2196f3, #1565c0)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
              </div>
              <span style={{ fontSize: "15px", fontWeight: 700, color: "#fff" }}>DentFlow</span>
            </div>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)" }}>© 2026 DentFlow · Sistema de Gestão Odontológica</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
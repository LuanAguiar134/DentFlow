/* Glassmorphism global styles for DentFlow */

export const glassBase = `
  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: linear-gradient(135deg, #0a1628 0%, #0d2144 40%, #0a3060 70%, #1a4a7a 100%);
    min-height: 100vh;
    font-family: 'Inter', sans-serif;
  }

  .glass-page {
    display: flex;
    min-height: 100vh;
    background: linear-gradient(135deg, #0a1628 0%, #0d2144 40%, #0a3060 70%, #1a4a7a 100%);
    position: relative;
  }

  .glass-page::before {
    content: '';
    position: fixed;
    top: -20%;
    left: -10%;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(33,150,243,0.15) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  .glass-page::after {
    content: '';
    position: fixed;
    bottom: -10%;
    right: -5%;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(66,165,245,0.1) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  .glass-card {
    background: rgba(255, 255, 255, 0.07);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 16px;
  }

  .glass-card-light {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 16px;
  }

  .glass-input {
    background: rgba(255,255,255,0.08) !important;
    border: 1px solid rgba(255,255,255,0.15) !important;
    border-radius: 10px !important;
    color: #fff !important;
    font-family: 'Inter', sans-serif;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .glass-input::placeholder { color: rgba(255,255,255,0.35) !important; }

  .glass-input:focus {
    border-color: rgba(33,150,243,0.8) !important;
    box-shadow: 0 0 0 3px rgba(33,150,243,0.2) !important;
    outline: none !important;
    background: rgba(255,255,255,0.12) !important;
  }

  .glass-btn-primary {
    background: linear-gradient(135deg, #2196f3, #1976d2);
    border: none;
    border-radius: 10px;
    color: #fff;
    font-family: 'Inter', sans-serif;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 4px 15px rgba(33,150,243,0.3);
  }

  .glass-btn-primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(33,150,243,0.4);
  }

  .glass-btn-primary:active { transform: scale(0.97); }

  .glass-btn-secondary {
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 10px;
    color: rgba(255,255,255,0.8);
    font-family: 'Inter', sans-serif;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .glass-btn-secondary:hover {
    background: rgba(255,255,255,0.15);
    color: #fff;
  }

  @keyframes cardIn {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  @keyframes slideScale {
    from { opacity: 0; transform: translateY(24px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  .card-0 { animation: cardIn 0.4s ease 0.05s both; }
  .card-1 { animation: cardIn 0.4s ease 0.1s both; }
  .card-2 { animation: cardIn 0.4s ease 0.18s both; }
  .card-3 { animation: cardIn 0.4s ease 0.26s both; }
  .card-4 { animation: cardIn 0.4s ease 0.34s both; }
  .card-5 { animation: cardIn 0.4s ease 0.42s both; }

  .modal-overlay { animation: fadeIn 0.2s ease; }
  .modal-box { animation: slideScale 0.25s cubic-bezier(0.34,1.56,0.64,1); }

  .glass-input-field { transition: border-color 0.2s, box-shadow 0.2s; }
  .glass-input-field:focus {
    border-color: rgba(33,150,243,0.8) !important;
    box-shadow: 0 0 0 3px rgba(33,150,243,0.2) !important;
    outline: none;
  }

  .hover-lift { transition: transform 0.2s, box-shadow 0.2s; }
  .hover-lift:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,0,0,0.3) !important; }

  .icon-btn-glass {
    transition: background 0.15s, transform 0.1s;
    border: none;
    cursor: pointer;
  }
  .icon-btn-glass:hover { transform: scale(1.1); }

  .table-row-glass { transition: background 0.15s; }
  .table-row-glass:hover { background: rgba(255,255,255,0.05) !important; }

  .nav-item-glass {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    border-radius: 10px;
    margin-bottom: 4px;
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s;
    position: relative;
    color: rgba(255,255,255,0.6);
  }

  .nav-item-glass:hover {
    background: rgba(255,255,255,0.1);
    color: #fff;
    transform: translateX(3px);
  }

  .nav-item-glass.active {
    background: rgba(33,150,243,0.25);
    color: #fff;
    border: 1px solid rgba(33,150,243,0.4);
  }

  .nav-item-glass.active::before {
    content: '';
    position: absolute;
    left: -1px;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 60%;
    background: #2196f3;
    border-radius: 0 3px 3px 0;
  }

  .day-cell-glass {
    transition: background 0.15s, transform 0.1s;
    cursor: pointer;
    border-radius: 10px;
  }
  .day-cell-glass:hover { transform: scale(1.05); background: rgba(255,255,255,0.1) !important; }

  .appt-card-glass {
    transition: all 0.15s;
    border-radius: 12px;
  }
  .appt-card-glass:hover {
    background: rgba(255,255,255,0.12) !important;
    transform: translateY(-1px);
  }

  .proc-card-glass {
    transition: all 0.2s;
  }
  .proc-card-glass:hover {
    transform: translateY(-3px);
    border-color: rgba(33,150,243,0.4) !important;
    box-shadow: 0 8px 30px rgba(0,0,0,0.3);
  }

  .payment-row-glass {
    transition: all 0.15s;
    border-radius: 12px;
  }
  .payment-row-glass:hover {
    background: rgba(255,255,255,0.1) !important;
    transform: translateY(-1px);
  }

  .logout-btn-glass {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    background: transparent;
    border: none;
    padding: 10px 14px;
    border-radius: 10px;
    cursor: pointer;
    color: rgba(255,255,255,0.5);
    font-size: 14px;
    font-weight: 500;
    font-family: 'Inter', sans-serif;
    transition: all 0.2s;
  }

  .logout-btn-glass:hover {
    background: rgba(239,68,68,0.15);
    color: #f87171;
    transform: translateX(3px);
  }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 10px; }
`;

export const glassText = {
  primary: "#ffffff",
  secondary: "rgba(255,255,255,0.7)",
  muted: "rgba(255,255,255,0.4)",
  accent: "#60a5fa",
};

export const glassCard = {
  background: "rgba(255,255,255,0.07)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: "16px",
};

export const glassCardLight = {
  background: "rgba(255,255,255,0.1)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: "16px",
};

export const glassInput = {
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: "10px",
  color: "#fff",
  fontFamily: "Inter, sans-serif",
  width: "100%",
  boxSizing: "border-box",
  padding: "11px 14px",
  fontSize: "14px",
};

export const glassBtnPrimary = {
  background: "linear-gradient(135deg, #2196f3, #1976d2)",
  border: "none",
  borderRadius: "10px",
  color: "#fff",
  fontFamily: "Inter, sans-serif",
  fontWeight: 600,
  cursor: "pointer",
  boxShadow: "0 4px 15px rgba(33,150,243,0.3)",
};

export const glassBtnSecondary = {
  background: "rgba(255,255,255,0.1)",
  border: "1px solid rgba(255,255,255,0.2)",
  borderRadius: "10px",
  color: "rgba(255,255,255,0.8)",
  fontFamily: "Inter, sans-serif",
  fontWeight: 500,
  cursor: "pointer",
};
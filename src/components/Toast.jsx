import { useEffect } from "react";

const toastStyle = `
  @keyframes toastIn {
    from { opacity: 0; transform: translateX(100%); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes toastOut {
    from { opacity: 1; transform: translateX(0); }
    to   { opacity: 0; transform: translateX(100%); }
  }
  .toast-enter { animation: toastIn 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
  .toast-exit  { animation: toastOut 0.3s ease forwards; }
`;

const ICONS = {
  success: "✅",
  error: "❌",
  warning: "⚠️",
  info: "ℹ️",
};

const COLORS = {
  success: { bg: "#f0fdf4", border: "#86efac", color: "#16a34a" },
  error:   { bg: "#fef2f2", border: "#fca5a5", color: "#ef4444" },
  warning: { bg: "#fffbeb", border: "#fcd34d", color: "#ca8a04" },
  info:    { bg: "#eff6ff", border: "#93c5fd", color: "#2563eb" },
};

export default function Toast({ message, type = "success", onClose }) {
  const c = COLORS[type];

  useEffect(() => {
    const t = setTimeout(() => onClose(), 3000);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <style>{toastStyle}</style>
      <div className="toast-enter" style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 9999,
        background: c.bg,
        border: `1px solid ${c.border}`,
        borderRadius: "12px",
        padding: "14px 18px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        minWidth: "280px",
        maxWidth: "360px",
      }}>
        <span style={{ fontSize: "18px" }}>{ICONS[type]}</span>
        <span style={{ fontSize: "14px", fontWeight: 500, color: c.color, flex: 1 }}>{message}</span>
        <button onClick={onClose} style={{ background: "transparent", border: "none", cursor: "pointer", color: c.color, fontSize: "16px", lineHeight: 1 }}>✕</button>
      </div>
    </>
  );
}
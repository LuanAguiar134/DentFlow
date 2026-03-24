import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Toast from "../components/Toast";
import { glassBase, glassCard, glassCardLight, glassInput, glassBtnPrimary, glassBtnSecondary } from "../styles/glassStyles";

const emptyForm = { patient: "", amount: "", date: new Date().toISOString().split("T")[0], method: "PIX", status: "Pago", description: "" };
const METHODS = ["PIX","Cartão de Crédito","Cartão de Débito","Dinheiro","Transferência","Boleto"];

export default function Financial() {
  const [payments, setPayments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const p = localStorage.getItem("payments"); if (p) setPayments(JSON.parse(p));
    const pt = localStorage.getItem("patients"); if (pt) setPatients(JSON.parse(pt));
  }, []);
  useEffect(() => { localStorage.setItem("payments", JSON.stringify(payments)); }, [payments]);

  function showToast(message, type = "success") { setToast({ message, type }); }
  function openModal() { setForm({ ...emptyForm, date: new Date().toISOString().split("T")[0] }); setModalOpen(true); }
  function closeModal() { setModalOpen(false); setForm(emptyForm); }
  function handleField(f, v) { setForm((prev) => ({ ...prev, [f]: v })); }

  function savePayment() {
    if (!form.amount || Number(form.amount) <= 0) return alert("Informe um valor válido.");
    setPayments((prev) => [...prev, { ...form, id: Date.now(), amount: Number(form.amount) }]);
    showToast("Pagamento registrado com sucesso!");
    closeModal();
  }

  function removePayment(id) {
    if (window.confirm("Remover este pagamento?")) {
      setPayments((prev) => prev.filter((p) => p.id !== id));
      showToast("Pagamento removido.", "info");
    }
  }

  function formatBRL(val) { return Number(val).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }); }
  function formatDate(val) { if (!val) return "—"; const [y, m, d] = val.split("-"); return `${d}/${m}/${y}`; }

  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const monthPayments = payments.filter((p) => p.date?.startsWith(thisMonth));
  const recebido = monthPayments.filter((p) => p.status === "Pago").reduce((acc, p) => acc + p.amount, 0);
  const pendente = monthPayments.filter((p) => p.status === "Pendente").reduce((acc, p) => acc + p.amount, 0);
  const total = monthPayments.reduce((acc, p) => acc + p.amount, 0);
  const sorted = [...payments].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="glass-page">
      <style>{glassBase}</style>
      <Sidebar />
      <div style={{ flex: 1, padding: "28px 32px", overflowY: "auto", position: "relative", zIndex: 1 }}>
        <div className="card-0" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
          <div>
            <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#fff", margin: 0 }}>Financeiro</h1>
            <p style={{ margin: "4px 0 0", fontSize: "13px", color: "rgba(255,255,255,0.45)" }}>Controle de pagamentos e receita</p>
          </div>
          <button className="glass-btn-primary" onClick={openModal} style={{ ...glassBtnPrimary, padding: "10px 20px", fontSize: "14px" }}>+ Novo Pagamento</button>
        </div>

        {/* Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "24px" }}>
          {[
            { label: "Recebido (Mês)", value: formatBRL(recebido), iconBg: "rgba(74,222,128,0.2)", iconColor: "#4ade80", icon: "$", cls: "card-1" },
            { label: "Pendente", value: formatBRL(pendente), iconBg: "rgba(251,191,36,0.2)", iconColor: "#fbbf24", icon: "⏳", cls: "card-2" },
            { label: "Total (Mês)", value: formatBRL(total), iconBg: "rgba(33,150,243,0.2)", iconColor: "#60a5fa", icon: "↗", cls: "card-3" },
          ].map((c) => (
            <div key={c.label} className={`hover-lift ${c.cls}`} style={{ ...glassCard, padding: "20px", display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ width: 44, height: 44, borderRadius: "12px", background: c.iconBg, color: c.iconColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontWeight: 700, flexShrink: 0 }}>{c.icon}</div>
              <div>
                <p style={{ margin: 0, fontSize: "12px", color: "rgba(255,255,255,0.45)", fontWeight: 500 }}>{c.label}</p>
                <p style={{ margin: "4px 0 0", fontSize: "20px", fontWeight: 700, color: "#fff" }}>{c.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Lista */}
        <div className="card-4" style={{ ...glassCard, padding: "22px" }}>
          <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#fff", margin: "0 0 16px" }}>Últimos Pagamentos</h2>
          {sorted.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: "rgba(255,255,255,0.3)" }}>
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>💳</div>
              <p style={{ margin: 0, fontSize: "14px" }}>Nenhum pagamento registrado</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {sorted.map((p) => (
                <div key={p.id} className="payment-row-glass" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <div style={{ width: 40, height: 40, borderRadius: "10px", background: p.status === "Pago" ? "rgba(74,222,128,0.15)" : "rgba(251,191,36,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", border: `1px solid ${p.status === "Pago" ? "rgba(74,222,128,0.3)" : "rgba(251,191,36,0.3)"}` }}>
                      {p.status === "Pago" ? "✅" : "⏳"}
                    </div>
                    <div>
                      <strong style={{ fontSize: "14px", color: "#fff" }}>{p.patient || "Não informado"}</strong>
                      <p style={{ margin: 0, fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>{p.method} · {formatDate(p.date)}{p.description ? ` · ${p.description}` : ""}</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: 700, fontSize: "15px", color: p.status === "Pago" ? "#4ade80" : "#fbbf24" }}>{formatBRL(p.amount)}</div>
                      <span style={{ fontSize: "11px", fontWeight: 600, background: p.status === "Pago" ? "rgba(74,222,128,0.15)" : "rgba(251,191,36,0.15)", color: p.status === "Pago" ? "#4ade80" : "#fbbf24", padding: "2px 8px", borderRadius: "20px", border: `1px solid ${p.status === "Pago" ? "rgba(74,222,128,0.3)" : "rgba(251,191,36,0.3)"}` }}>{p.status}</span>
                    </div>
                    <button onClick={() => removePayment(p.id)} style={{ background: "rgba(239,68,68,0.15)", color: "#f87171", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "8px", padding: "6px 10px", cursor: "pointer", fontSize: "13px" }}>🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {modalOpen && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}>
          <div className="modal-box" style={{ ...glassCardLight, width: "100%", maxWidth: "460px", padding: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "22px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#fff", margin: 0 }}>Novo Pagamento</h2>
              <button onClick={closeModal} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "8px", width: 32, height: 32, cursor: "pointer", color: "rgba(255,255,255,0.7)", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <Field label="Paciente">
                <select className="glass-input-field" value={form.patient} onChange={(e) => handleField("patient", e.target.value)} style={{ ...glassInput, colorScheme: "dark" }}>
                  <option value="" style={{ background: "#0d2144" }}>Selecionar paciente</option>
                  {patients.map((p) => <option key={p.id} value={p.name} style={{ background: "#0d2144" }}>{p.name}</option>)}
                </select>
              </Field>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <Field label="Valor (R$)" required><input className="glass-input-field" type="number" placeholder="0" step="0.01" value={form.amount} onChange={(e) => handleField("amount", e.target.value)} style={glassInput} /></Field>
                <Field label="Data"><input className="glass-input-field" type="date" value={form.date} onChange={(e) => handleField("date", e.target.value)} style={{ ...glassInput, colorScheme: "dark" }} /></Field>
                <Field label="Forma de pagamento">
                  <select className="glass-input-field" value={form.method} onChange={(e) => handleField("method", e.target.value)} style={{ ...glassInput, colorScheme: "dark" }}>
                    {METHODS.map((m) => <option key={m} value={m} style={{ background: "#0d2144" }}>{m}</option>)}
                  </select>
                </Field>
                <Field label="Status">
                  <select className="glass-input-field" value={form.status} onChange={(e) => handleField("status", e.target.value)} style={{ ...glassInput, colorScheme: "dark" }}>
                    <option value="Pago" style={{ background: "#0d2144" }}>Pago</option>
                    <option value="Pendente" style={{ background: "#0d2144" }}>Pendente</option>
                  </select>
                </Field>
              </div>
              <Field label="Descrição"><textarea className="glass-input-field" placeholder="Detalhes do pagamento..." value={form.description} onChange={(e) => handleField("description", e.target.value)} style={{ ...glassInput, minHeight: "80px", resize: "vertical" }} /></Field>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "22px", paddingTop: "18px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
              <button onClick={closeModal} style={{ ...glassBtnSecondary, padding: "9px 20px", fontSize: "14px" }}>Cancelar</button>
              <button onClick={savePayment} style={{ ...glassBtnPrimary, padding: "9px 22px", fontSize: "14px" }}>Registrar</button>
            </div>
          </div>
        </div>
      )}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
      <label style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>{label}{required && <span style={{ color: "#60a5fa", marginLeft: 2 }}>*</span>}</label>
      {children}
    </div>
  );
}
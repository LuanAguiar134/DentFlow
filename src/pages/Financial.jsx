import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";

const emptyForm = { patient: "", amount: "", date: new Date().toISOString().split("T")[0], method: "PIX", status: "Pago", description: "" };
const METHODS = ["PIX", "Cartão de Crédito", "Cartão de Débito", "Dinheiro", "Transferência", "Boleto"];

export default function Financial() {
  const [payments, setPayments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    const saved = localStorage.getItem("payments");
    if (saved) setPayments(JSON.parse(saved));
    const savedP = localStorage.getItem("patients");
    if (savedP) setPatients(JSON.parse(savedP));
  }, []);

  useEffect(() => {
    localStorage.setItem("payments", JSON.stringify(payments));
  }, [payments]);

  function openModal() {
    setForm({ ...emptyForm, date: new Date().toISOString().split("T")[0] });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setForm(emptyForm);
  }

  function handleField(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function savePayment() {
    if (!form.amount || Number(form.amount) <= 0) return alert("Informe um valor válido.");
    if (!form.date) return alert("Informe a data.");
    setPayments((prev) => [...prev, { ...form, id: Date.now(), amount: Number(form.amount) }]);
    closeModal();
  }

  function removePayment(id) {
    if (window.confirm("Deseja remover este pagamento?"))
      setPayments((prev) => prev.filter((p) => p.id !== id));
  }

  function formatBRL(val) {
    return Number(val).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  function formatDate(val) {
    if (!val) return "—";
    const [y, m, d] = val.split("-");
    return `${d}/${m}/${y}`;
  }

  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const monthPayments = payments.filter((p) => p.date && p.date.startsWith(thisMonth));
  const recebido = monthPayments.filter((p) => p.status === "Pago").reduce((acc, p) => acc + p.amount, 0);
  const pendente = monthPayments.filter((p) => p.status === "Pendente").reduce((acc, p) => acc + p.amount, 0);
  const total = monthPayments.reduce((acc, p) => acc + p.amount, 0);

  const sorted = [...payments].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div style={{ display: "flex", background: "#f4f6f8", minHeight: "100vh" }}>
      <Sidebar />

      <div style={{ flex: 1, padding: "28px 32px" }}>
        {/* Topbar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
          <div>
            <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#1e3a8a", margin: 0 }}>Financeiro</h1>
            <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#888" }}>Controle de pagamentos e receita</p>
          </div>
          <button onClick={openModal} style={btnPrimary}>+ Novo Pagamento</button>
        </div>

        {/* Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "24px" }}>
          <SummaryCard icon="$" label="Recebido (Mês)" value={formatBRL(recebido)} iconBg="#dcfce7" iconColor="#16a34a" />
          <SummaryCard icon="⏳" label="Pendente" value={formatBRL(pendente)} iconBg="#fef9c3" iconColor="#ca8a04" />
          <SummaryCard icon="↗" label="Total (Mês)" value={formatBRL(total)} iconBg="#dbeafe" iconColor="#2563eb" />
        </div>

        {/* Lista de pagamentos */}
        <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "20px" }}>
          <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#1e3a8a", margin: "0 0 16px" }}>Últimos Pagamentos</h2>

          {sorted.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#aaa" }}>
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>💳</div>
              <p style={{ margin: 0, fontSize: "14px" }}>Nenhum pagamento registrado</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {sorted.map((p) => (
                <div key={p.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderRadius: "10px", border: "1px solid #f0f4f8", background: "#f8f9fc" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <div style={{ width: 40, height: 40, borderRadius: "10px", background: p.status === "Pago" ? "#dcfce7" : "#fef9c3", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>
                      {p.status === "Pago" ? "✅" : "⏳"}
                    </div>
                    <div>
                      <strong style={{ fontSize: "14px", color: "#1a1a2e" }}>{p.patient || "Paciente não informado"}</strong>
                      <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>
                        {p.method} · {formatDate(p.date)}{p.description ? ` · ${p.description}` : ""}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: 700, fontSize: "15px", color: p.status === "Pago" ? "#16a34a" : "#ca8a04" }}>
                        {formatBRL(p.amount)}
                      </div>
                      <span style={{ fontSize: "11px", fontWeight: 600, background: p.status === "Pago" ? "#dcfce7" : "#fef9c3", color: p.status === "Pago" ? "#16a34a" : "#ca8a04", padding: "2px 8px", borderRadius: "20px" }}>
                        {p.status}
                      </span>
                    </div>
                    <button onClick={() => removePayment(p.id)} style={{ background: "#fee2e2", color: "#ef4444", border: "none", borderRadius: "6px", padding: "6px 10px", cursor: "pointer", fontSize: "13px" }}>
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div
          onClick={(e) => e.target === e.currentTarget && closeModal()}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}
        >
          <div style={{ background: "#fff", borderRadius: "14px", width: "100%", maxWidth: "460px", padding: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "22px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#1a1a2e", margin: 0 }}>Novo Pagamento</h2>
              <button onClick={closeModal} style={{ background: "transparent", border: "none", fontSize: "20px", cursor: "pointer", color: "#888" }}>✕</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <Field label="Paciente">
                <select value={form.patient} onChange={(e) => handleField("patient", e.target.value)} style={inputStyle}>
                  <option value="">Selecionar paciente</option>
                  {patients.map((p) => <option key={p.id} value={p.name}>{p.name}</option>)}
                </select>
              </Field>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <Field label="Valor (R$)" required>
                  <input type="number" placeholder="0" step="0.01" value={form.amount} onChange={(e) => handleField("amount", e.target.value)} style={inputStyle} />
                </Field>
                <Field label="Data">
                  <input type="date" value={form.date} onChange={(e) => handleField("date", e.target.value)} style={inputStyle} />
                </Field>
                <Field label="Forma de pagamento">
                  <select value={form.method} onChange={(e) => handleField("method", e.target.value)} style={inputStyle}>
                    {METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </Field>
                <Field label="Status">
                  <select value={form.status} onChange={(e) => handleField("status", e.target.value)} style={inputStyle}>
                    <option value="Pago">Pago</option>
                    <option value="Pendente">Pendente</option>
                  </select>
                </Field>
              </div>

              <Field label="Descrição">
                <textarea placeholder="Detalhes do pagamento..." value={form.description} onChange={(e) => handleField("description", e.target.value)} style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }} />
              </Field>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "22px", paddingTop: "18px", borderTop: "1px solid #e8eaef" }}>
              <button onClick={closeModal} style={btnCancel}>Cancelar</button>
              <button onClick={savePayment} style={btnSubmit}>Registrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ icon, label, value, iconBg, iconColor }) {
  return (
    <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "20px", display: "flex", alignItems: "center", gap: "16px" }}>
      <div style={{ width: 44, height: 44, borderRadius: "10px", background: iconBg, color: iconColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontWeight: 700, flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <p style={{ margin: 0, fontSize: "13px", color: "#888", fontWeight: 500 }}>{label}</p>
        <p style={{ margin: "4px 0 0", fontSize: "20px", fontWeight: 700, color: "#1a1a2e" }}>{value}</p>
      </div>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
      <label style={{ fontSize: "13px", fontWeight: 600, color: "#444" }}>
        {label}{required && <span style={{ color: "#2563eb", marginLeft: 2 }}>*</span>}
      </label>
      {children}
    </div>
  );
}

const inputStyle = { background: "#f8f9fc", border: "1.5px solid #e2e5ee", borderRadius: "7px", padding: "10px 12px", fontSize: "14px", color: "#1a1a2e", outline: "none", fontFamily: "inherit", width: "100%", boxSizing: "border-box" };
const btnPrimary = { display: "flex", alignItems: "center", gap: "7px", background: "#2563eb", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "8px", fontSize: "14px", fontWeight: 600, cursor: "pointer" };
const btnCancel = { padding: "9px 20px", borderRadius: "7px", border: "1.5px solid #dde1ea", background: "#fff", fontSize: "14px", fontWeight: 600, color: "#555", cursor: "pointer" };
const btnSubmit = { padding: "9px 22px", borderRadius: "7px", border: "none", background: "#2563eb", color: "#fff", fontSize: "14px", fontWeight: 600, cursor: "pointer" };
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Toast from "../components/Toast";

const animStyle = `
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideScale { from { opacity: 0; transform: translateY(24px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
  .modal-overlay { animation: fadeIn 0.2s ease; }
  .modal-box { animation: slideScale 0.25s cubic-bezier(0.34,1.56,0.64,1); }
  .input-field { transition: border-color 0.2s, box-shadow 0.2s; }
  .input-field:focus { border-color: #2563eb !important; box-shadow: 0 0 0 3px rgba(37,99,235,0.12) !important; outline: none; }
  .btn-primary-anim { transition: background 0.15s, transform 0.1s; }
  .btn-primary-anim:hover { background: #1d4ed8 !important; }
  .btn-primary-anim:active { transform: scale(0.97); }
  .btn-cancel-anim { transition: background 0.15s; }
  .btn-cancel-anim:hover { background: #f4f6f8 !important; }
  .proc-card { transition: box-shadow 0.15s, transform 0.15s; }
  .proc-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.08); transform: translateY(-2px); }
  .icon-btn-anim { transition: transform 0.1s; }
  .icon-btn-anim:hover { transform: scale(1.1); }
`;

const emptyForm = { name: "", category: "", price: "", duration: "", description: "" };
const CATEGORIES = ["Diagnóstico","Prevenção","Dentística","Endodontia","Periodontia","Cirurgia","Ortodontia","Prótese","Outro"];

export default function Procedures() {
  const [procedures, setProcedures] = useState([]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => { const s = localStorage.getItem("procedures"); if (s) setProcedures(JSON.parse(s)); }, []);
  useEffect(() => { localStorage.setItem("procedures", JSON.stringify(procedures)); }, [procedures]);

  function showToast(message, type = "success") { setToast({ message, type }); }
  function openNew() { setForm(emptyForm); setEditingId(null); setModalOpen(true); }
  function openEdit(p) { setForm({ ...p }); setEditingId(p.id); setModalOpen(true); }
  function closeModal() { setModalOpen(false); setForm(emptyForm); setEditingId(null); }
  function handleField(field, value) { setForm((f) => ({ ...f, [field]: value })); }

  function saveProcedure() {
    if (!form.name.trim()) return alert("Nome do procedimento é obrigatório.");
    if (!form.price) return alert("Valor é obrigatório.");
    if (editingId) {
      setProcedures((prev) => prev.map((p) => p.id === editingId ? { ...form, id: editingId } : p));
      showToast("Procedimento atualizado com sucesso!");
    } else {
      setProcedures((prev) => [...prev, { ...form, id: Date.now() }]);
      showToast("Procedimento cadastrado com sucesso!");
    }
    closeModal();
  }

  function removeProcedure(id) {
    if (window.confirm("Deseja excluir este procedimento?")) {
      setProcedures((prev) => prev.filter((p) => p.id !== id));
      showToast("Procedimento removido.", "info");
    }
  }

  function formatPrice(val) {
    if (!val) return "R$ 0,00";
    return Number(val).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  const filtered = procedures.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) || (p.category || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: "flex", background: "#f0f4f8", minHeight: "100vh" }}>
      <style>{animStyle}</style>
      <Sidebar />
      <div style={{ flex: 1, padding: "28px 32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
          <div>
            <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#1a1a2e", margin: 0 }}>Procedimentos</h1>
            <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#888" }}>Catálogo de tratamentos e preços</p>
          </div>
          <button className="btn-primary-anim" onClick={openNew} style={{ background: "#2563eb", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "8px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>+ Novo Procedimento</button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "0 14px", marginBottom: "20px", maxWidth: "380px" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" placeholder="Buscar procedimento..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ flex: 1, border: "none", outline: "none", padding: "11px 0", fontSize: "14px", color: "#333", background: "transparent" }} />
        </div>

        {filtered.length === 0 && (
          <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "60px 20px", textAlign: "center" }}>
            <div style={{ fontSize: "36px", marginBottom: "10px" }}>🦷</div>
            <p style={{ fontWeight: 600, color: "#555", margin: 0 }}>Nenhum procedimento cadastrado</p>
            <p style={{ fontSize: "13px", color: "#aaa", margin: "6px 0 0" }}>{procedures.length === 0 ? 'Clique em "Novo Procedimento" para adicionar.' : "Tente outro termo de busca."}</p>
          </div>
        )}

        {filtered.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
            {filtered.map((p) => (
              <div key={p.id} className="proc-card" style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    {p.category && <span style={{ fontSize: "11px", fontWeight: 600, background: "#eff6ff", color: "#2563eb", padding: "2px 8px", borderRadius: "20px" }}>{p.category}</span>}
                    <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#1a1a2e", margin: "8px 0 0" }}>{p.name}</h3>
                  </div>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button className="icon-btn-anim" onClick={() => openEdit(p)} style={{ width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "6px", border: "1px solid #fde68a", background: "#fef9c3", cursor: "pointer", fontSize: "13px" }}>✏️</button>
                    <button className="icon-btn-anim" onClick={() => removeProcedure(p.id)} style={{ width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "6px", border: "1px solid #fecaca", background: "#fee2e2", cursor: "pointer", fontSize: "13px" }}>🗑️</button>
                  </div>
                </div>
                {p.description && <p style={{ fontSize: "13px", color: "#888", margin: "8px 0 0" }}>{p.description}</p>}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #f0f4f8" }}>
                  <span style={{ fontSize: "18px", fontWeight: 700, color: "#16a34a" }}>{formatPrice(p.price)}</span>
                  {p.duration && <span style={{ fontSize: "12px", color: "#888" }}>⏱ {p.duration} min</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}>
          <div className="modal-box" style={{ background: "#fff", borderRadius: "14px", width: "100%", maxWidth: "460px", padding: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "22px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#1a1a2e", margin: 0 }}>{editingId ? "Editar Procedimento" : "Novo Procedimento"}</h2>
              <button onClick={closeModal} style={{ background: "transparent", border: "none", fontSize: "20px", cursor: "pointer", color: "#888" }}>✕</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <Field label="Nome do procedimento" required><input className="input-field" type="text" placeholder="Ex: Limpeza dental" value={form.name} onChange={(e) => handleField("name", e.target.value)} style={inputStyle} /></Field>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <Field label="Categoria">
                  <select className="input-field" value={form.category} onChange={(e) => handleField("category", e.target.value)} style={inputStyle}>
                    <option value="">Selecionar</option>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Duração (min)"><input className="input-field" type="number" placeholder="60" value={form.duration} onChange={(e) => handleField("duration", e.target.value)} style={inputStyle} /></Field>
              </div>
              <Field label="Valor (R$)" required><input className="input-field" type="number" placeholder="0,00" step="0.01" value={form.price} onChange={(e) => handleField("price", e.target.value)} style={inputStyle} /></Field>
              <Field label="Descrição"><textarea className="input-field" placeholder="Detalhes do procedimento..." value={form.description} onChange={(e) => handleField("description", e.target.value)} style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }} /></Field>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "22px", paddingTop: "18px", borderTop: "1px solid #e8eaef" }}>
              <button className="btn-cancel-anim" onClick={closeModal} style={{ padding: "9px 20px", borderRadius: "7px", border: "1.5px solid #dde1ea", background: "#fff", fontSize: "14px", fontWeight: 600, color: "#555", cursor: "pointer" }}>Cancelar</button>
              <button className="btn-primary-anim" onClick={saveProcedure} style={{ padding: "9px 22px", borderRadius: "7px", border: "none", background: "#2563eb", color: "#fff", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>{editingId ? "Salvar" : "Cadastrar"}</button>
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
      <label style={{ fontSize: "13px", fontWeight: 600, color: "#444" }}>{label}{required && <span style={{ color: "#2563eb", marginLeft: 2 }}>*</span>}</label>
      {children}
    </div>
  );
}

const inputStyle = { background: "#f8f9fc", border: "1.5px solid #e2e5ee", borderRadius: "7px", padding: "10px 12px", fontSize: "14px", color: "#1a1a2e", fontFamily: "inherit", width: "100%", boxSizing: "border-box" };
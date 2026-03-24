import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Toast from "../components/Toast";
import { glassBase, glassCard, glassCardLight, glassInput, glassBtnPrimary, glassBtnSecondary } from "../styles/glassStyles";

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
  function handleField(f, v) { setForm((prev) => ({ ...prev, [f]: v })); }

  function saveProcedure() {
    if (!form.name.trim()) return alert("Nome é obrigatório.");
    if (!form.price) return alert("Valor é obrigatório.");
    if (editingId) {
      setProcedures((prev) => prev.map((p) => p.id === editingId ? { ...form, id: editingId } : p));
      showToast("Procedimento atualizado!");
    } else {
      setProcedures((prev) => [...prev, { ...form, id: Date.now() }]);
      showToast("Procedimento cadastrado com sucesso!");
    }
    closeModal();
  }

  function removeProcedure(id) {
    if (window.confirm("Deseja excluir?")) {
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
    <div className="glass-page">
      <style>{glassBase}</style>
      <Sidebar />
      <div style={{ flex: 1, padding: "28px 32px", overflowY: "auto", position: "relative", zIndex: 1 }}>
        <div className="card-0" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
          <div>
            <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#fff", margin: 0 }}>Procedimentos</h1>
            <p style={{ margin: "4px 0 0", fontSize: "13px", color: "rgba(255,255,255,0.45)" }}>Catálogo de tratamentos e preços</p>
          </div>
          <button className="glass-btn-primary" onClick={openNew} style={{ ...glassBtnPrimary, padding: "10px 20px", fontSize: "14px" }}>+ Novo Procedimento</button>
        </div>

        <div className="card-1" style={{ ...glassCard, display: "flex", alignItems: "center", gap: "10px", padding: "0 14px", marginBottom: "20px", maxWidth: "380px" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" placeholder="Buscar procedimento..." value={search} onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, background: "transparent", border: "none", outline: "none", padding: "12px 0", fontSize: "14px", color: "#fff" }} />
        </div>

        {filtered.length === 0 && (
          <div className="card-2" style={{ ...glassCard, padding: "60px 20px", textAlign: "center" }}>
            <div style={{ fontSize: "36px", marginBottom: "10px" }}>🦷</div>
            <p style={{ fontWeight: 600, color: "rgba(255,255,255,0.5)", margin: 0 }}>Nenhum procedimento cadastrado</p>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)", margin: "6px 0 0" }}>{procedures.length === 0 ? 'Clique em "Novo Procedimento" para adicionar.' : "Tente outro termo."}</p>
          </div>
        )}

        {filtered.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
            {filtered.map((p, i) => (
              <div key={p.id} className={`proc-card-glass card-${Math.min(i + 2, 5)}`} style={{ ...glassCard, padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    {p.category && <span style={{ fontSize: "11px", fontWeight: 600, background: "rgba(33,150,243,0.2)", color: "#60a5fa", padding: "2px 8px", borderRadius: "20px", border: "1px solid rgba(33,150,243,0.3)" }}>{p.category}</span>}
                    <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#fff", margin: "8px 0 0" }}>{p.name}</h3>
                  </div>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button className="icon-btn-glass" onClick={() => openEdit(p)} style={{ width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "8px", background: "rgba(251,191,36,0.15)", border: "1px solid rgba(251,191,36,0.3)", fontSize: "13px" }}>✏️</button>
                    <button className="icon-btn-glass" onClick={() => removeProcedure(p.id)} style={{ width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "8px", background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", fontSize: "13px" }}>🗑️</button>
                  </div>
                </div>
                {p.description && <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", margin: "8px 0 0" }}>{p.description}</p>}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "14px", paddingTop: "14px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                  <span style={{ fontSize: "18px", fontWeight: 700, color: "#4ade80" }}>{formatPrice(p.price)}</span>
                  {p.duration && <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>⏱ {p.duration} min</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}>
          <div className="modal-box" style={{ ...glassCardLight, width: "100%", maxWidth: "460px", padding: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "22px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#fff", margin: 0 }}>{editingId ? "Editar" : "Novo"} Procedimento</h2>
              <button onClick={closeModal} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "8px", width: 32, height: 32, cursor: "pointer", color: "rgba(255,255,255,0.7)", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <Field label="Nome do procedimento" required><input className="glass-input-field" type="text" placeholder="Ex: Limpeza dental" value={form.name} onChange={(e) => handleField("name", e.target.value)} style={glassInput} /></Field>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <Field label="Categoria">
                  <select className="glass-input-field" value={form.category} onChange={(e) => handleField("category", e.target.value)} style={{ ...glassInput, colorScheme: "dark" }}>
                    <option value="" style={{ background: "#0d2144" }}>Selecionar</option>
                    {CATEGORIES.map((c) => <option key={c} value={c} style={{ background: "#0d2144" }}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Duração (min)"><input className="glass-input-field" type="number" placeholder="60" value={form.duration} onChange={(e) => handleField("duration", e.target.value)} style={glassInput} /></Field>
              </div>
              <Field label="Valor (R$)" required><input className="glass-input-field" type="number" placeholder="0,00" step="0.01" value={form.price} onChange={(e) => handleField("price", e.target.value)} style={glassInput} /></Field>
              <Field label="Descrição"><textarea className="glass-input-field" placeholder="Detalhes do procedimento..." value={form.description} onChange={(e) => handleField("description", e.target.value)} style={{ ...glassInput, minHeight: "80px", resize: "vertical" }} /></Field>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "22px", paddingTop: "18px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
              <button onClick={closeModal} style={{ ...glassBtnSecondary, padding: "9px 20px", fontSize: "14px" }}>Cancelar</button>
              <button onClick={saveProcedure} style={{ ...glassBtnPrimary, padding: "9px 22px", fontSize: "14px" }}>{editingId ? "Salvar" : "Cadastrar"}</button>
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
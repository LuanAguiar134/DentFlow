import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Toast from "../components/Toast";
import { glassBase, glassCard, glassCardLight, glassInput, glassBtnPrimary, glassBtnSecondary } from "../styles/glassStyles";

const emptyForm = { name: "", phone: "", cpf: "", email: "", birth: "", address: "", allergies: "", history: "", obs: "" };

function maskPhone(v) {
  v = v.replace(/\D/g, "").slice(0, 11);
  if (v.length <= 10) return v.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
  return v.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
}

function maskCPF(v) {
  v = v.replace(/\D/g, "").slice(0, 11);
  return v.replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function formatBirth(val) {
  if (!val) return "—";
  const [y, m, d] = val.split("-");
  return `${d}/${m}/${y}`;
}

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => { const s = localStorage.getItem("patients"); if (s) setPatients(JSON.parse(s)); }, []);
  useEffect(() => { localStorage.setItem("patients", JSON.stringify(patients)); }, [patients]);

  function showToast(message, type = "success") { setToast({ message, type }); }
  function openNew() { setForm(emptyForm); setEditingId(null); setModalOpen(true); }
  function openEdit(p) { setForm({ ...p }); setEditingId(p.id); setModalOpen(true); }
  function closeModal() { setModalOpen(false); setForm(emptyForm); setEditingId(null); }
  function handleField(f, v) { setForm((prev) => ({ ...prev, [f]: v })); }

  function savePatient() {
    if (!form.name.trim()) return alert("Nome é obrigatório.");
    if (!form.phone.trim()) return alert("Telefone é obrigatório.");
    if (editingId) {
      setPatients((prev) => prev.map((p) => p.id === editingId ? { ...form, id: editingId } : p));
      showToast("Paciente atualizado com sucesso!");
    } else {
      setPatients((prev) => [...prev, { ...form, id: Date.now() }]);
      showToast("Paciente cadastrado com sucesso!");
    }
    closeModal();
  }

  function removePatient(id) {
    if (window.confirm("Deseja excluir este paciente?")) {
      setPatients((prev) => prev.filter((p) => p.id !== id));
      showToast("Paciente removido.", "info");
    }
  }

  const filtered = patients.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.phone.includes(search) || (p.cpf || "").includes(search)
  );

  return (
    <div className="glass-page">
      <style>{glassBase}</style>
      <Sidebar />

      <div style={{ flex: 1, padding: "28px 32px", overflowY: "auto", position: "relative", zIndex: 1 }}>
        {/* Topbar */}
        <div className="card-0" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
          <div>
            <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#fff", margin: 0 }}>Pacientes</h1>
            <p style={{ margin: "4px 0 0", fontSize: "13px", color: "rgba(255,255,255,0.45)" }}>{patients.length} paciente{patients.length !== 1 ? "s" : ""} cadastrado{patients.length !== 1 ? "s" : ""}</p>
          </div>
          <button className="glass-btn-primary" onClick={openNew} style={{ ...glassBtnPrimary, padding: "10px 20px", fontSize: "14px" }}>+ Novo Paciente</button>
        </div>

        {/* Search */}
        <div className="card-1" style={{ ...glassCard, display: "flex", alignItems: "center", gap: "10px", padding: "0 14px", marginBottom: "20px", maxWidth: "380px" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" placeholder="Buscar por nome, telefone ou CPF..." value={search} onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, background: "transparent", border: "none", outline: "none", padding: "12px 0", fontSize: "14px", color: "#fff" }} />
        </div>

        {/* Empty */}
        {filtered.length === 0 && (
          <div className="card-2" style={{ ...glassCard, padding: "60px 20px", textAlign: "center" }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" style={{ marginBottom: 12 }}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="16" y1="11" x2="22" y2="11"/></svg>
            <p style={{ fontWeight: 600, color: "rgba(255,255,255,0.5)", margin: 0 }}>Nenhum paciente encontrado</p>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)", margin: "6px 0 0" }}>{patients.length === 0 ? 'Clique em "Novo Paciente" para adicionar.' : "Tente outro termo."}</p>
          </div>
        )}

        {/* Table */}
        {filtered.length > 0 && (
          <div className="card-2" style={{ ...glassCard, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                  {["Paciente", "Telefone", "CPF", "Nascimento", "Status", ""].map((h) => (
                    <th key={h} style={{ textAlign: "left", padding: "12px 16px", color: "rgba(255,255,255,0.35)", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="table-row-glass" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ fontWeight: 600, color: "#fff" }}>{p.name}</div>
                      <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{p.email || "—"}</div>
                    </td>
                    <td style={{ padding: "14px 16px", color: "rgba(255,255,255,0.7)" }}>{p.phone}</td>
                    <td style={{ padding: "14px 16px", color: "rgba(255,255,255,0.7)" }}>{p.cpf || "—"}</td>
                    <td style={{ padding: "14px 16px", color: "rgba(255,255,255,0.7)" }}>{formatBirth(p.birth)}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{ background: "rgba(74,222,128,0.15)", color: "#4ade80", padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: 600, border: "1px solid rgba(74,222,128,0.3)" }}>Ativo</span>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button className="icon-btn-glass" onClick={() => openEdit(p)} style={{ width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "8px", background: "rgba(251,191,36,0.15)", border: "1px solid rgba(251,191,36,0.3)", fontSize: "13px" }}>✏️</button>
                        <button className="icon-btn-glass" onClick={() => removePatient(p.id)} style={{ width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "8px", background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", fontSize: "13px" }}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}>
          <div className="modal-box" style={{ ...glassCardLight, width: "100%", maxWidth: "540px", maxHeight: "90vh", overflowY: "auto", padding: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "22px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#fff", margin: 0 }}>{editingId ? "Editar Paciente" : "Novo Paciente"}</h2>
              <button onClick={closeModal} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "8px", width: 32, height: 32, cursor: "pointer", color: "rgba(255,255,255,0.7)", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <Field label="Nome completo" required><input className="glass-input-field" type="text" placeholder="Nome do paciente" value={form.name} onChange={(e) => handleField("name", e.target.value)} style={glassInput} /></Field>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <Field label="Telefone" required><input className="glass-input-field" type="text" placeholder="(00) 00000-0000" value={form.phone} onChange={(e) => handleField("phone", maskPhone(e.target.value))} style={glassInput} /></Field>
                <Field label="CPF"><input className="glass-input-field" type="text" placeholder="000.000.000-00" value={form.cpf} onChange={(e) => handleField("cpf", maskCPF(e.target.value))} style={glassInput} /></Field>
                <Field label="Email"><input className="glass-input-field" type="email" placeholder="email@exemplo.com" value={form.email} onChange={(e) => handleField("email", e.target.value)} style={glassInput} /></Field>
                <Field label="Data de nascimento"><input className="glass-input-field" type="date" value={form.birth} onChange={(e) => handleField("birth", e.target.value)} style={{ ...glassInput, colorScheme: "dark" }} /></Field>
              </div>
              <Field label="Endereço"><input className="glass-input-field" type="text" placeholder="Rua, número, bairro..." value={form.address} onChange={(e) => handleField("address", e.target.value)} style={glassInput} /></Field>
              <Field label="Alergias"><input className="glass-input-field" type="text" placeholder="Ex: Latex, Anestésicos..." value={form.allergies} onChange={(e) => handleField("allergies", e.target.value)} style={glassInput} /></Field>
              <Field label="Histórico médico"><textarea className="glass-input-field" placeholder="Condições relevantes..." value={form.history} onChange={(e) => handleField("history", e.target.value)} style={{ ...glassInput, minHeight: "80px", resize: "vertical" }} /></Field>
              <Field label="Observações"><textarea className="glass-input-field" placeholder="Observações adicionais..." value={form.obs} onChange={(e) => handleField("obs", e.target.value)} style={{ ...glassInput, minHeight: "80px", resize: "vertical" }} /></Field>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "22px", paddingTop: "18px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
              <button onClick={closeModal} style={{ ...glassBtnSecondary, padding: "9px 20px", fontSize: "14px" }}>Cancelar</button>
              <button onClick={savePatient} style={{ ...glassBtnPrimary, padding: "9px 22px", fontSize: "14px" }}>{editingId ? "Salvar" : "Cadastrar"}</button>
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
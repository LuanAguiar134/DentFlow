import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";

const animStyle = `
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideScale { from { opacity: 0; transform: translateY(24px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
  @keyframes fadeInRow { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: translateX(0); } }
  .modal-overlay { animation: fadeIn 0.2s ease; }
  .modal-box { animation: slideScale 0.25s cubic-bezier(0.34,1.56,0.64,1); }
  .input-field { transition: border-color 0.2s, box-shadow 0.2s; }
  .input-field:focus { border-color: #2563eb !important; box-shadow: 0 0 0 3px rgba(37,99,235,0.12) !important; outline: none; }
  .btn-primary-anim { transition: background 0.15s, transform 0.1s; }
  .btn-primary-anim:hover { background: #1d4ed8 !important; }
  .btn-primary-anim:active { transform: scale(0.97); }
  .btn-cancel-anim { transition: background 0.15s; }
  .btn-cancel-anim:hover { background: #f4f6f8 !important; }
  .table-row { animation: fadeInRow 0.2s ease; }
  .table-row:hover { background: #f8faff !important; }
  .icon-btn-anim { transition: background 0.15s, transform 0.1s; }
  .icon-btn-anim:hover { transform: scale(1.1); }
`;

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

  useEffect(() => {
    const saved = localStorage.getItem("patients");
    if (saved) setPatients(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("patients", JSON.stringify(patients));
  }, [patients]);

  function openNew() { setForm(emptyForm); setEditingId(null); setModalOpen(true); }
  function openEdit(p) { setForm({ ...p }); setEditingId(p.id); setModalOpen(true); }
  function closeModal() { setModalOpen(false); setForm(emptyForm); setEditingId(null); }
  function handleField(field, value) { setForm((f) => ({ ...f, [field]: value })); }

  function savePatient() {
    if (!form.name.trim()) return alert("Nome completo é obrigatório.");
    if (!form.phone.trim()) return alert("Telefone é obrigatório.");
    if (editingId) {
      setPatients((prev) => prev.map((p) => (p.id === editingId ? { ...form, id: editingId } : p)));
    } else {
      setPatients((prev) => [...prev, { ...form, id: Date.now() }]);
    }
    closeModal();
  }

  function removePatient(id) {
    if (window.confirm("Deseja excluir este paciente?"))
      setPatients((prev) => prev.filter((p) => p.id !== id));
  }

  const filtered = patients.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.phone.includes(search) || (p.cpf || "").includes(search)
  );

  return (
    <div style={{ display: "flex", background: "#f0f4f8", minHeight: "100vh" }}>
      <style>{animStyle}</style>
      <Sidebar />

      <div style={{ flex: 1, padding: "28px 32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
          <div>
            <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#1a1a2e", margin: 0 }}>Pacientes</h1>
            <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#888" }}>{patients.length} paciente{patients.length !== 1 ? "s" : ""} cadastrado{patients.length !== 1 ? "s" : ""}</p>
          </div>
          <button className="btn-primary-anim" onClick={openNew} style={{ background: "#2563eb", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "8px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>
            + Novo Paciente
          </button>
        </div>

        {/* Search */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "0 14px", marginBottom: "20px", maxWidth: "380px" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" placeholder="Buscar por nome, telefone ou CPF..." value={search} onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, border: "none", outline: "none", padding: "11px 0", fontSize: "14px", color: "#333", background: "transparent" }} />
        </div>

        {/* Empty */}
        {filtered.length === 0 && (
          <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "60px 20px", textAlign: "center" }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5" style={{ marginBottom: 12 }}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="16" y1="11" x2="22" y2="11"/></svg>
            <p style={{ fontWeight: 600, color: "#555", margin: 0 }}>Nenhum paciente encontrado</p>
            <p style={{ fontSize: "13px", color: "#aaa", margin: "6px 0 0" }}>{patients.length === 0 ? 'Clique em "Novo Paciente" para adicionar.' : "Tente outro termo de busca."}</p>
          </div>
        )}

        {/* Table */}
        {filtered.length > 0 && (
          <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                  {["Paciente", "Telefone", "CPF", "Nascimento", "Status", ""].map((h) => (
                    <th key={h} style={{ textAlign: "left", padding: "12px 16px", color: "#999", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="table-row" style={{ borderBottom: "1px solid #f0f4f8" }}>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ fontWeight: 600, color: "#1a1a2e" }}>{p.name}</div>
                      <div style={{ fontSize: "12px", color: "#aaa", marginTop: 2 }}>{p.email || "—"}</div>
                    </td>
                    <td style={{ padding: "14px 16px", color: "#444" }}>{p.phone}</td>
                    <td style={{ padding: "14px 16px", color: "#444" }}>{p.cpf || "—"}</td>
                    <td style={{ padding: "14px 16px", color: "#444" }}>{formatBirth(p.birth)}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{ background: "#d1fae5", color: "#065f46", padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: 600 }}>Ativo</span>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button className="icon-btn-anim" onClick={() => openEdit(p)} style={{ width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "6px", border: "1px solid #fde68a", background: "#fef9c3", cursor: "pointer", fontSize: "13px" }}>✏️</button>
                        <button className="icon-btn-anim" onClick={() => removePatient(p.id)} style={{ width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "6px", border: "1px solid #fecaca", background: "#fee2e2", cursor: "pointer", fontSize: "13px" }}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}>
          <div className="modal-box" style={{ background: "#fff", borderRadius: "14px", width: "100%", maxWidth: "540px", maxHeight: "90vh", overflowY: "auto", padding: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "22px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#1a1a2e", margin: 0 }}>{editingId ? "Editar Paciente" : "Novo Paciente"}</h2>
              <button onClick={closeModal} style={{ background: "transparent", border: "none", fontSize: "20px", cursor: "pointer", color: "#888" }}>✕</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <Field label="Nome completo" required>
                <input className="input-field" type="text" placeholder="Nome do paciente" value={form.name} onChange={(e) => handleField("name", e.target.value)} style={inputStyle} />
              </Field>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <Field label="Telefone" required>
                  <input className="input-field" type="text" placeholder="(00) 00000-0000" value={form.phone} onChange={(e) => handleField("phone", maskPhone(e.target.value))} style={inputStyle} />
                </Field>
                <Field label="CPF">
                  <input className="input-field" type="text" placeholder="000.000.000-00" value={form.cpf} onChange={(e) => handleField("cpf", maskCPF(e.target.value))} style={inputStyle} />
                </Field>
                <Field label="Email">
                  <input className="input-field" type="email" placeholder="email@exemplo.com" value={form.email} onChange={(e) => handleField("email", e.target.value)} style={inputStyle} />
                </Field>
                <Field label="Data de nascimento">
                  <input className="input-field" type="date" value={form.birth} onChange={(e) => handleField("birth", e.target.value)} style={inputStyle} />
                </Field>
              </div>
              <Field label="Endereço">
                <input className="input-field" type="text" placeholder="Rua, número, bairro..." value={form.address} onChange={(e) => handleField("address", e.target.value)} style={inputStyle} />
              </Field>
              <Field label="Alergias">
                <input className="input-field" type="text" placeholder="Ex: Latex, Anestésicos..." value={form.allergies} onChange={(e) => handleField("allergies", e.target.value)} style={inputStyle} />
              </Field>
              <Field label="Histórico médico">
                <textarea className="input-field" placeholder="Condições relevantes..." value={form.history} onChange={(e) => handleField("history", e.target.value)} style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }} />
              </Field>
              <Field label="Observações">
                <textarea className="input-field" placeholder="Observações adicionais..." value={form.obs} onChange={(e) => handleField("obs", e.target.value)} style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }} />
              </Field>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "22px", paddingTop: "18px", borderTop: "1px solid #e8eaef" }}>
              <button className="btn-cancel-anim" onClick={closeModal} style={{ padding: "9px 20px", borderRadius: "7px", border: "1.5px solid #dde1ea", background: "#fff", fontSize: "14px", fontWeight: 600, color: "#555", cursor: "pointer" }}>Cancelar</button>
              <button className="btn-primary-anim" onClick={savePatient} style={{ padding: "9px 22px", borderRadius: "7px", border: "none", background: "#2563eb", color: "#fff", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>{editingId ? "Salvar" : "Cadastrar"}</button>
            </div>
          </div>
        </div>
      )}
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

const inputStyle = { background: "#f8f9fc", border: "1.5px solid #e2e5ee", borderRadius: "7px", padding: "10px 12px", fontSize: "14px", color: "#1a1a2e", fontFamily: "inherit", width: "100%", boxSizing: "border-box" };
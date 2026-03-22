import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("patients");
    if (saved) setPatients(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("patients", JSON.stringify(patients));
  }, [patients]);

  function addOrUpdatePatient(e) {
    e.preventDefault();

    if (!name || !age) return;

    if (editingId) {
      // EDITAR
      const updated = patients.map((p) =>
        p.id === editingId ? { ...p, name, age } : p
      );
      setPatients(updated);
      setEditingId(null);
    } else {
      // ADICIONAR
      const newPatient = {
        id: Date.now(),
        name,
        age,
      };
      setPatients([...patients, newPatient]);
    }

    setName("");
    setAge("");
  }

  function removePatient(id) {
    setPatients(patients.filter((p) => p.id !== id));
  }

  function startEdit(patient) {
    setName(patient.name);
    setAge(patient.age);
    setEditingId(patient.id);
  }

  return (
    <div style={{ display: "flex", background: "#f4f6f8", minHeight: "100vh" }}>
      <Sidebar />

      <div style={{ padding: "20px", width: "100%" }}>
        <h1 style={{ fontSize: "24px", marginBottom: "20px", color: "#1e3a8a" }}>
          Pacientes
        </h1>

        <form
          onSubmit={addOrUpdatePatient}
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "10px",
            marginBottom: "20px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ marginBottom: "10px" }}>
            {editingId ? "Editar Paciente" : "Cadastrar Paciente"}
          </h2>

          <div style={{ display: "flex", gap: "10px" }}>
            <input
              type="text"
              placeholder="Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />

            <input
              type="number"
              placeholder="Idade"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              style={{
                width: "120px",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />

            <button
              type="submit"
              style={{
                background: "#2563eb",
                color: "white",
                border: "none",
                padding: "10px 15px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              {editingId ? "Salvar" : "Adicionar"}
            </button>
          </div>
        </form>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {patients.map((p) => (
            <div
              key={p.id}
              style={{
                background: "white",
                padding: "15px",
                borderRadius: "10px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              }}
            >
              <div>
                <strong>{p.name}</strong>
                <p style={{ margin: 0, color: "#555" }}>
                  {p.age} anos
                </p>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => startEdit(p)}
                  style={{
                    background: "#f59e0b",
                    color: "white",
                    border: "none",
                    padding: "8px 12px",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Editar
                </button>

                <button
                  onClick={() => removePatient(p.id)}
                  style={{
                    background: "#ef4444",
                    color: "white",
                    border: "none",
                    padding: "8px 12px",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Remover
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
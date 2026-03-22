import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";

export default function Financial() {
  const [transactions, setTransactions] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("entrada");

  useEffect(() => {
    const saved = localStorage.getItem("transactions");
    if (saved) setTransactions(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  function addTransaction(e) {
    e.preventDefault();

    if (!description || !amount) return;

    const newTransaction = {
      id: Date.now(),
      description,
      amount: Number(amount),
      type,
    };

    setTransactions([...transactions, newTransaction]);

    setDescription("");
    setAmount("");
    setType("entrada");
  }

  function removeTransaction(id) {
    setTransactions(transactions.filter((t) => t.id !== id));
  }

  // cálculos
  const totalIncome = transactions
    .filter((t) => t.type === "entrada")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "saida")
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = totalIncome - totalExpense;

  return (
    <div style={{ display: "flex", background: "#f4f6f8", minHeight: "100vh" }}>
      <Sidebar />

      <div style={{ padding: "20px", width: "100%" }}>
        <h1 style={{ fontSize: "24px", marginBottom: "20px", color: "#1e3a8a" }}>
          Financeiro
        </h1>

        {/* RESUMO */}
        <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
          <div style={cardStyle}>
            <h3>Entradas</h3>
            <p style={{ color: "#16a34a" }}>R$ {totalIncome}</p>
          </div>

          <div style={cardStyle}>
            <h3>Saídas</h3>
            <p style={{ color: "#ef4444" }}>R$ {totalExpense}</p>
          </div>

          <div style={cardStyle}>
            <h3>Saldo</h3>
            <p style={{ color: "#2563eb" }}>R$ {balance}</p>
          </div>
        </div>

        {/* FORM */}
        <form
          onSubmit={addTransaction}
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "10px",
            marginBottom: "20px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ marginBottom: "10px" }}>Nova Transação</h2>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <input
              type="text"
              placeholder="Descrição"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={inputStyle}
            />

            <input
              type="number"
              placeholder="Valor"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={inputStyle}
            />

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              style={inputStyle}
            >
              <option value="entrada">Entrada</option>
              <option value="saida">Saída</option>
            </select>

            <button type="submit" style={buttonStyle}>
              Adicionar
            </button>
          </div>
        </form>

        {/* LISTA */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {transactions.length === 0 ? (
            <p style={{ color: "#777" }}>Nenhuma transação registrada.</p>
          ) : (
            transactions.map((t) => (
              <div
                key={t.id}
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
                  <strong>{t.description}</strong>
                  <p style={{ margin: 0 }}>
                    R$ {t.amount} ({t.type})
                  </p>
                </div>

                <button
                  onClick={() => removeTransaction(t.id)}
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
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// estilos reutilizáveis
const cardStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  minWidth: "200px",
};

const inputStyle = {
  padding: "10px",
  borderRadius: "5px",
  border: "1px solid #ccc",
};

const buttonStyle = {
  background: "#2563eb",
  color: "white",
  border: "none",
  padding: "10px 15px",
  borderRadius: "5px",
  cursor: "pointer",
};
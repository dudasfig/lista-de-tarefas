import React, { useState } from "react";
import Modal from "react-modal";
import api from "../services/api";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    padding: "20px",
    borderRadius: "10px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    maxWidth: "500px",
    width: "90%",
  },
};

Modal.setAppElement("#root");

const FormularioTarefa = ({ tarefa = {}, onClose }) => {
  // Usa `tarefa || {}` como fallback para evitar erros de null
  const [nome, setNome] = useState(tarefa?.nome || "");
  const [custo, setCusto] = useState(tarefa?.custo || "");
  const [dataLimite, setDataLimite] = useState(
    tarefa?.dataLimite
      ? new Date(tarefa.dataLimite).toISOString().substr(0, 10)
      : ""
  );
  const [erro, setErro] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    try {
      if (tarefa?.id) {
        // Editar tarefa existente
        await api.put(`/tarefas/${tarefa.id}`, {
          nome,
          custo,
          dataLimite,
        });
      } else {
        // Criar nova tarefa
        await api.post("/tarefas", {
          nome,
          custo,
          dataLimite,
        });
      }
      onClose(); // Fecha o modal após a operação
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        "Erro ao salvar tarefa. Verifique os dados.";
      setErro(errorMessage);
    }
  };

  return (
    <Modal
      isOpen={true}
      onRequestClose={onClose}
      style={customStyles}
      contentLabel="Incluir/Editar Tarefa"
    >
      <form onSubmit={handleSubmit}>
        <h2>{tarefa?.id ? "Editar Tarefa" : "Incluir Tarefa"}</h2>

        {erro && <p style={{ color: "red" }}>{erro}</p>}

        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Nome:</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", borderRadius: "5px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Custo:
          </label>
          <input
            type="number"
            value={custo}
            onChange={(e) => setCusto(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", borderRadius: "5px" }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Data Limite:
          </label>
          <input
            type="date"
            value={dataLimite}
            onChange={(e) => setDataLimite(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", borderRadius: "5px" }}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button
            type="submit"
            style={{
              padding: "10px 20px",
              backgroundColor: "#4CAF50",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Salvar
          </button>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "10px 20px",
              backgroundColor: "#f44336",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Cancelar
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default FormularioTarefa;

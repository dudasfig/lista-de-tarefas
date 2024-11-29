import React, { useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { FaEdit, FaTrash } from "react-icons/fa";
import Modal from "react-modal";

const modalStyles = {
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
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    maxWidth: "400px",
    width: "90%",
    textAlign: "center",
  },
};

Modal.setAppElement("#root");

const Tarefa = ({ tarefa, index, onEdit, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const custoNumerico = Number(tarefa.custo);

  const estiloDestaque =
    custoNumerico >= 1000
      ? { backgroundColor: "#fff9c4", fontWeight: "bold" }
      : { backgroundColor: "#f0f0f0" };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    onDelete();
    closeModal();
  };

  return (
    <>
      <Draggable draggableId={tarefa.id.toString()} index={index}>
        {(provided) => (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              margin: "8px 0",
              padding: "16px",
              borderRadius: "4px",
              ...estiloDestaque,
              ...provided.draggableProps.style,
            }}
          >
            {/* Conteúdo da Tarefa */}
            <div style={{ textAlign: "left", flex: 1 }}>
              <h3 style={{ marginBottom: "8px" }}>{tarefa.nome}</h3>
              <p>ID: {tarefa.id}</p>
              <p>Custo: R$ {custoNumerico.toFixed(2)}</p>
              <p>Data Limite: {tarefa.dataLimite}</p>
            </div>

            {/* Botões */}
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={onEdit}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                }}
              >
                <FaEdit size={20} color="#4CAF50" title="Editar" />
              </button>
              <button
                onClick={openModal}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                }}
              >
                <FaTrash size={20} color="#f44336" title="Excluir" />
              </button>
            </div>
          </div>
        )}
      </Draggable>

      {/* Modal de Confirmação */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={modalStyles}
        contentLabel="Confirmar Exclusão"
      >
        <h2 style={{ color: "#f44336" }}>Confirmar Exclusão</h2>
        <p>Você tem certeza que deseja excluir a tarefa:</p>
        <p style={{ fontWeight: "bold" }}>{tarefa.nome}?</p>
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <button
            onClick={confirmDelete}
            style={{
              padding: "10px 20px",
              backgroundColor: "#4CAF50",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Confirmar
          </button>
          <button
            onClick={closeModal}
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
      </Modal>
    </>
  );
};

export default Tarefa;

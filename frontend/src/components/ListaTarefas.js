import React, { useEffect, useState } from "react";
import api from "../services/api";
import Tarefa from "./Tarefa";
import FormularioTarefa from "./FormularioTarefa";
import Modal from "react-modal";

import { DragDropContext, Droppable } from "@hello-pangea/dnd";

const modalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    padding: "30px",
    borderRadius: "12px",
    backgroundColor: "#f9f9f9",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    maxWidth: "500px",
    width: "90%",
  },
};

Modal.setAppElement("#root");

const ListaTarefas = () => {
  const [tarefas, setTarefas] = useState([]);
  const [editando, setEditando] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    fetchTarefas();
  }, []);

  const fetchTarefas = async () => {
    try {
      const response = await api.get("/tarefas");
      setTarefas(response.data);
    } catch (error) {
      console.error("Erro ao buscar tarefas", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/tarefas/${id}`);
      setTarefas((prevTarefas) =>
        prevTarefas.filter((tarefa) => tarefa.id !== id)
      ); // Atualiza a lista localmente
    } catch (error) {
      console.error("Erro ao excluir tarefa", error);
    }
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const itens = Array.from(tarefas);
    const [reordenado] = itens.splice(result.source.index, 1);
    itens.splice(result.destination.index, 0, reordenado);

    setTarefas(itens);

    try {
      await api.patch("/tarefas/reordenar", {
        ordem: itens.map((tarefa) => tarefa.id),
      });
    } catch (error) {
      console.error("Erro ao reordenar tarefas", error);
    }
  };

  const openModal = () => {
    setEditando({});
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setEditando(null);
    setModalIsOpen(false);
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1 style={{ marginBottom: "20px", color: "#333" }}>Lista de Tarefas</h1>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="tarefas">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {tarefas.map((tarefa, index) => (
                <Tarefa
                  key={tarefa.id}
                  tarefa={tarefa}
                  index={index}
                  onEdit={() => {
                    setEditando(tarefa);
                    setModalIsOpen(true);
                  }}
                  onDelete={() => handleDelete(tarefa.id)}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <button
        onClick={openModal}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#4CAF50",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          fontSize: "16px",
          cursor: "pointer",
          transition: "background-color 0.3s ease",
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#45a049")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#4CAF50")}
      >
        Incluir
      </button>

      {/* Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={modalStyles}
        contentLabel="Incluir/Editar Tarefa"
      >
        <FormularioTarefa
          tarefa={editando}
          onClose={() => {
            closeModal();
            fetchTarefas();
          }}
        />
      </Modal>
    </div>
  );
};

export default ListaTarefas;

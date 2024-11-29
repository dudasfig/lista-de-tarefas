const express = require("express");
const router = express.Router();
const pool = require("../models");
const Tarefa = require("../models/Tarefa")(pool);

router.get("/", async (req, res) => {
  try {
    const tarefas = await Tarefa.listarTarefas();
    res.json(tarefas);
  } catch (error) {
    console.error("Erro ao listar tarefas:", error);
    res.status(500).json({ error: "Erro ao listar tarefas" });
  }
});

router.post("/", async (req, res) => {
  const { nome, custo, dataLimite } = req.body;
  try {
    const tarefa = await Tarefa.criarTarefa(nome, custo, dataLimite);
    res.status(201).json(tarefa);
  } catch (error) {
    console.error("Erro ao criar tarefa:", error);
    res.status(400).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, custo, dataLimite } = req.body;
  try {
    const tarefa = await Tarefa.editarTarefa(id, nome, custo, dataLimite);
    res.json(tarefa);
  } catch (error) {
    console.error("Erro ao editar tarefa:", error);
    res.status(400).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const tarefa = await pool.query(
      "DELETE FROM tarefas WHERE id = $1 RETURNING *",
      [id]
    );
    if (tarefa.rowCount === 0) {
      return res.status(404).json({ error: "Tarefa não encontrada" });
    }
    res.json({ message: "Tarefa excluída com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir tarefa:", error);
    res.status(500).json({ error: "Erro ao excluir tarefa" });
  }
});

router.patch("/reordenar", async (req, res) => {
  const { ordem } = req.body;
  try {
    const result = await Tarefa.reordenarTarefas(ordem);
    res.json(result);
  } catch (error) {
    console.error("Erro ao reordenar tarefas:", error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;

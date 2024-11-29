module.exports = (pool) => {
  return {
    async listarTarefas() {
      const query = "SELECT * FROM tarefas ORDER BY ordem ASC";
      const { rows } = await pool.query(query);
      return rows;
    },

    async criarTarefa(nome, custo, dataLimite) {
      if (!nome || typeof nome !== "string") {
        throw new Error("Nome inválido");
      }
      if (!custo || isNaN(Number(custo)) || Number(custo) <= 0) {
        throw new Error("Custo inválido");
      }

      if (!dataLimite || isNaN(new Date(dataLimite).getTime())) {
        throw new Error("Data limite inválida");
      }

      const existeQuery = "SELECT * FROM tarefas WHERE nome = $1";
      const existeResult = await pool.query(existeQuery, [nome]);
      if (existeResult.rows.length > 0) {
        throw new Error("Nome da tarefa já existe");
      }

      const maxOrdemQuery = "SELECT MAX(ordem) AS max_ordem FROM tarefas";
      const maxOrdemResult = await pool.query(maxOrdemQuery);
      const novaOrdem = (maxOrdemResult.rows[0].max_ordem || 0) + 1;

      const insertQuery = `
        INSERT INTO tarefas (nome, custo, "dataLimite", ordem)
        VALUES ($1, $2, $3, $4)
        RETURNING *`;
      const { rows } = await pool.query(insertQuery, [
        nome,
        custo,
        dataLimite,
        novaOrdem,
      ]);
      return rows[0];
    },

    async editarTarefa(id, nome, custo, dataLimite) {
      const existeQuery = "SELECT * FROM tarefas WHERE id = $1";
      const existeResult = await pool.query(existeQuery, [id]);
      if (existeResult.rows.length === 0) {
        throw new Error("Tarefa não encontrada");
      }

      const nomeExisteQuery =
        "SELECT * FROM tarefas WHERE nome = $1 AND id != $2";
      const nomeExisteResult = await pool.query(nomeExisteQuery, [nome, id]);
      if (nomeExisteResult.rows.length > 0) {
        throw new Error("Nome da tarefa já existe");
      }

      const updateQuery = `
        UPDATE tarefas
        SET nome = $1, custo = $2, "dataLimite" = $3
        WHERE id = $4
        RETURNING *`;
      const { rows } = await pool.query(updateQuery, [
        nome,
        custo,
        dataLimite,
        id,
      ]);
      return rows[0];
    },

    async excluirTarefa(id) {
      const deleteQuery = "DELETE FROM tarefas WHERE id = $1 RETURNING *";
      const { rows } = await pool.query(deleteQuery, [id]);
      if (rows.length === 0) {
        throw new Error("Tarefa não encontrada");
      }
      return rows[0];
    },

    async reordenarTarefas(ordem) {
      const queries = ordem.map((id, index) => ({
        text: "UPDATE tarefas SET ordem = $1 WHERE id = $2",
        values: [index + 1, id],
      }));

      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        for (const query of queries) {
          await client.query(query);
        }
        await client.query("COMMIT");
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }

      return { message: "Tarefas reordenadas com sucesso" };
    },
  };
};

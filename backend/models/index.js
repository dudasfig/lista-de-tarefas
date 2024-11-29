const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USERNAME || "postgres",
  host: process.env.DB_HOST || "127.0.0.1",
  database: process.env.DB_NAME || "lista_tarefas",
  password: process.env.DB_PASSWORD || "postgres",
  port: process.env.DB_PORT || 5432,
});

(async () => {
  try {
    const client = await pool.connect();
    console.log("Conexão com o banco de dados estabelecida com sucesso.");
    client.release();
  } catch (error) {
    console.error("Não foi possível conectar ao banco de dados:", error);
    process.exit(1);
  }
})();

module.exports = pool;

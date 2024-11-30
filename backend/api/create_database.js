const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

const config = {
  user: "postgres",
  host: "localhost",
  password: "postgres",
  port: 5432,
};

const sqlFilePath = path.join(__dirname, "database", "create_database.sql");

const createDatabase = async () => {
  const client = new Client(config);

  try {
    console.log("Conectando ao PostgreSQL...");
    await client.connect();

    console.log("Lendo o script SQL...");
    const sql = fs.readFileSync(sqlFilePath, "utf-8");

    console.log("Executando o script SQL...");
    await client.query(sql);

    console.log("Banco de dados e tabela criados com sucesso!");
  } catch (error) {
    console.error("Erro ao criar o banco de dados:", error.message);
  } finally {
    await client.end();
    console.log("Conexão encerrada.");
  }
};

createDatabase();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const pool = require("./models"); // Importando a conexão configurada no models/index.js

const app = express();
app.use(cors());
app.use(bodyParser.json());

const tarefasRoutes = require("./routes/tarefas");
app.use("/tarefas", tarefasRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

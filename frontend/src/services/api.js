// frontend/src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://backend-lista-de-tarefas-pkey.onrender.com", // Verifique se esta URL está correta
});

export default api;

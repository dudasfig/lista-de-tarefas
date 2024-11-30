// frontend/src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://lista-de-tarefas-sandy-six.vercel.app/", // Verifique se esta URL está correta
});

export default api;

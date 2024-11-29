// frontend/src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001", // Verifique se esta URL está correta
});

export default api;

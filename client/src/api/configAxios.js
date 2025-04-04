import axios from "axios";

const configAxios = axios.create({
  baseURL: "http://localhost:3000/api", // Cambia esto si tu backend tiene otra URL base
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// No es necesario agregar el token manualmente, ya que las cookies se envían automáticamente
export default configAxios;
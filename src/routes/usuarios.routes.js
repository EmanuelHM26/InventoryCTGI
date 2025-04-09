import express from "express";
import {
  getUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario,
} from "../controllers/usuarios.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/usuarios", verifyToken, getUsuarios); // Obtener todos los usuarios
router.get("/usuarios/:id", verifyToken, getUsuarioById); // Obtener un usuario por ID
router.post("/usuarios", verifyToken, createUsuario); // Crear un nuevo usuario
router.put("/usuarios/:id", verifyToken, updateUsuario); // Actualizar un usuario
router.delete("/usuarios/:id", verifyToken, deleteUsuario); // Eliminar un usuario

export default router;
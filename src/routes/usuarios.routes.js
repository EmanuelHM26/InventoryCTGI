import express from "express";
import {
  getUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario,
} from "../controllers/usuarios.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { verifyRole } from "../middlewares/rol.middleware.js";

const router = express.Router();

router.get("/usuarios", verifyToken, verifyRole([1]), getUsuarios);
router.get("/usuarios/:id", verifyToken, verifyRole([1]), getUsuarioById);
router.post("/usuarios", verifyToken, verifyRole([1]), createUsuario);
router.put("/usuarios/:id", verifyToken, verifyRole([1]), updateUsuario);
router.delete("/usuarios/:id", verifyToken, verifyRole([1]), deleteUsuario);

export default router;

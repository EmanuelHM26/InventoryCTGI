import express from "express";
import { getRoles, createRole, updateRole, deleteRole } from "../controllers/rol.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { updateUserRole } from "../controllers/rol.controller.js"; // Importar el controlador
import { verifyRole } from "../middlewares/rol.middleware.js";
const router = express.Router();

router.get("/roles", getRoles); // Obtener todos los roles
router.post("/roles", createRole); // Crear un nuevo rol
router.put("/roles/:id", updateRole); // Actualizar un rol
router.delete("/roles/:id", deleteRole); // Eliminar un rol

router.put(
    "/users/:id/role",
    verifyToken,
    verifyRole(["Administrador"]), // Solo los administradores pueden cambiar roles
    updateUserRole
  );

export default router;
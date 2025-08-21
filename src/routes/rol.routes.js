import express from "express";
import {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
  updateUserRole
} from "../controllers/rol.controller.js";

import { verifyToken } from "../middlewares/auth.middleware.js";
import { verifyRole } from "../middlewares/rol.middleware.js";

const router = express.Router();

// Obtener todos los roles
router.get(
  "/roles",
  verifyToken,
  verifyRole([1]),
  getRoles
);

// Crear un nuevo rol
router.post(
  "/roles",
  verifyToken,
  verifyRole([1]),
  createRole
);

// Actualizar un rol
router.put(
  "/roles/:id",
  verifyToken,
  verifyRole([1]),
  updateRole
);

// Eliminar un rol
router.delete("/roles/:id",
  verifyToken,
  verifyRole([1]),
  deleteRole
);

// Cambiar el rol de un usuario
router.put(
  "/users/:id/role",
  verifyToken,
  verifyRole([1]),
  updateUserRole
);

export default router;

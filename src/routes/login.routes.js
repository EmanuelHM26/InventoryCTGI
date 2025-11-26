import express from "express";
import { getAuthenticatedUser } from "../controllers/authMe.controller.js";
import {
  createUser,
  getAllUsers,
  getUserById,
  loginUser,
  requestPasswordReset,
  validateResetToken,
  resetPassword,
  verifyToken,
  logoutUser,
  deleteUser,
  updateUser,
  verifyEmail,
  activateUser,
  changeUserRole,
  getPendingUsers,
  toggleUserActivation,
  getUsersByStatus,
  updatePasswordController,
  getAuthenticatedUserController
} from "../controllers/login.controller.js";

import { verifyToken as authMiddleware } from "../middlewares/auth.middleware.js";
import { verifyRole } from "../middlewares/rol.middleware.js";

const router = express.Router();

// Registro y Login
router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// Verificación de correo electrónico
router.get("/verify-email", verifyEmail);

// Usuarios (protegidos)
router.get("/users", authMiddleware, getAllUsers);
router.get("/users/:id", authMiddleware, getUserById);
router.put("/users/:id", authMiddleware, updateUser);
router.delete("/users/:id", authMiddleware, deleteUser);

// Restablecimiento de contraseña
router.post("/forgot-password", requestPasswordReset);
router.get("/validate-reset-token", validateResetToken);
router.post("/reset-password", resetPassword);

// Verificación de JWT
router.get("/verify-token", authMiddleware, verifyToken);
// Obtener usuario autenticado
router.get("/auth/me", authMiddleware, getAuthenticatedUser);

// Rutas para gestión de usuarios por administradores
router.get("/admin/users/pending", authMiddleware, verifyRole([1]), getPendingUsers);
router.put("/admin/users/:id/activate", authMiddleware, verifyRole([1]), activateUser);
router.put("/admin/users/:id/role", authMiddleware, verifyRole([1]), changeUserRole);

// Nuevas rutas para activación/desactivación y filtrado por estado
router.put("/admin/users/:id/toggle-activation", authMiddleware, verifyRole([1]), toggleUserActivation);
router.get("/admin/users/by-status", authMiddleware, verifyRole([1]), getUsersByStatus);

// Ruta para actualizar la contraseña del usuario autenticado
router.put("/users/password", authMiddleware, updatePasswordController);

export default router;
import express from "express";
import { 
    createUser, 
    getUsers,  
    getUserById, 
    loginUser, 
    requestPasswordReset, 
    validateResetToken, 
    resetPassword, 
    verifyTokenController,
    logoutUser, 
    deleteUser,
    updateUser, 
} from "../controllers/login.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { verifyEmail } from "../controllers/login.controller.js";


const router = express.Router();

router.post("/register", createUser);
router.get("/users", verifyToken, getUsers);
router.get("/users/:id", verifyToken, getUserById);
router.post("/login",loginUser);
router.post("/logout", logoutUser);
router.delete("/users/:id", verifyToken, deleteUser); // Ruta para eliminar un usuario
router.put("/users/:id", verifyToken, updateUser); // Ruta para actualizar un usuario

router.get("/verify-email", verifyEmail);

// Rutas de restablecimiento de contraseña
router.post("/forgot-password", requestPasswordReset);
router.get("/validate-reset-token", validateResetToken);
router.post("/reset-password", resetPassword);
router.get("/verify-token", verifyToken, verifyTokenController);

export default router;



import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { getAuthenticatedUser } from "../controllers/authMe.controller.js";

const router = express.Router();

// Endpoint para obtener los datos del usuario autenticado
router.get("/me", verifyToken, getAuthenticatedUser);

export default router;
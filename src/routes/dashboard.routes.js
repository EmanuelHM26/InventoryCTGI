import express from "express";
import { getDashboardData } from "../controllers/dashboard.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";


const router = express.Router();

// Ruta protegida para el dashboard
router.get("/", verifyToken, getDashboardData);

export default router;
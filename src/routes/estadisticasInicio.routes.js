import { getEstadisticasInicioController } from "../controllers/estadisticasInicio.controller.js";
import { Router } from "express";
import { verifyToken } from '../middlewares/auth.middleware.js';
import { verifyRole } from '../middlewares/rol.middleware.js';
const router = Router();

router.get("/contar-estadisticas", verifyToken, verifyRole([1]), getEstadisticasInicioController);

export default router;

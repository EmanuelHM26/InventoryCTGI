// movimientosConsumibles.routes.js (actualizado)
import express from 'express';
import {
  crearMovimientoHandler,
  obtenerMovimientosProductoHandler,
  obtenerHistorialHandler,
  obtenerHistorialCompletoHandler
} from '../controllers/movimientosConsumibles.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { verifyRole } from '../middlewares/rol.middleware.js';

const router = express.Router();

// Todos los movimientos requieren autenticación
router.post('/movimientosconsumibles', verifyToken, verifyRole([1, 2, 3]), crearMovimientoHandler);
router.get('/movimientosconsumibles/producto/:id', verifyToken, verifyRole([1, 2, 3]), obtenerMovimientosProductoHandler);
router.get('/movimientosconsumibles', verifyToken, verifyRole([1, 2, 3]), obtenerHistorialHandler);
router.get('/movimientosconsumibles/completo', verifyToken, verifyRole([1, 2]), obtenerHistorialCompletoHandler);

export default router;
import express from 'express';
import {
  createDetalleAsignacion,
  getAllDetallesAsignacion,
  getDetalleAsignacionById,
  getDetallesByAsignacionId,
  updateDetalleAsignacion,
  deleteDetalleAsignacion,
} from '../controllers/detalleAsignacion.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { verifyRole } from '../middlewares/rol.middleware.js';

const router = express.Router();

// Crear un nuevo detalle de asignación
router.post('/detalle-asignacion', verifyToken, verifyRole([1]), createDetalleAsignacion);

// Obtener todos los detalles de asignación
router.get('/detalle-asignacion', verifyToken, verifyRole([1]), getAllDetallesAsignacion);

// Obtener un detalle de asignación por ID
router.get('/detalle-asignacion/:id', verifyToken, verifyRole([1]), getDetalleAsignacionById);

// Obtener todos los detalles asociados a una asignación específica
router.get('/detalle-asignacion/asignacion/:idAsignacion', verifyToken, verifyRole([1]), getDetallesByAsignacionId);

// Actualizar un detalle de asignación
router.put('/detalle-asignacion/:id', verifyToken, verifyRole([1]), updateDetalleAsignacion);

// Eliminar un detalle de asignación
router.delete('/detalle-asignacion/:id', verifyToken, verifyRole([1]), deleteDetalleAsignacion);

export default router;
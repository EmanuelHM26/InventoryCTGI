import express from 'express';
import {
  createAsignacion,
  getAllAsignaciones,
  getAsignacionById,
  updateAsignacion,
  deleteAsignacion,
  getRecentAsignaciones,
} from '../controllers/asignaciones.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { verifyRole } from '../middlewares/rol.middleware.js';

const router = express.Router();

// Crear una nueva asignación
router.post('/asignaciones', verifyToken, verifyRole([1]), createAsignacion);

// Obtener todas las asignaciones
router.get('/asignaciones', verifyToken, verifyRole([1]), getAllAsignaciones);

// Obtener una asignación por ID
router.get('/asignaciones/:idAsignaciones', verifyToken, verifyRole([1]), getAsignacionById);

// Actualizar una asignación
router.put('/asignaciones/:idAsignaciones', verifyToken, verifyRole([1]), updateAsignacion);

// Eliminar una asignación
router.delete('/asignaciones/:idAsignaciones', verifyToken, verifyRole([1]), deleteAsignacion);

router.get('/asignaciones/recent', verifyToken, verifyRole([1]), getRecentAsignaciones);

export default router;
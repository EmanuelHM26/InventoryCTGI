import express from 'express';
import {
  createAsignacion,
  getAllAsignaciones,
  getAsignacionById,
  updateAsignacion,
  deleteAsignacion,
  getAsignacionesByDays,
  confirmarDevolucion
} from '../controllers/asignaciones.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { verifyRole } from '../middlewares/rol.middleware.js';

const router = express.Router();

// Crear una nueva asignación
router.post('/asignaciones', verifyToken, verifyRole([1,2,3]), createAsignacion);

// Obtener todas las asignaciones
router.get('/asignaciones', verifyToken, verifyRole([1,2,3]), getAllAsignaciones);

// Obtener asignaciones recientes
router.get('/asignaciones/recent', verifyToken, verifyRole([1,2,3]), getAsignacionesByDays);

// Confirmar devolución de una asignación
router.patch('/asignaciones/:idAsignaciones/confirmar-devolucion', verifyToken, verifyRole([1,2,3]), confirmarDevolucion);

// Obtener una asignación por ID
router.get('/asignaciones/:idAsignaciones', verifyToken, verifyRole([1,2,3]), getAsignacionById);

// Actualizar una asignación
router.put('/asignaciones/:idAsignaciones', verifyToken, verifyRole([1,2,3]), updateAsignacion);

// Eliminar una asignación
router.delete('/asignaciones/:idAsignaciones', verifyToken, verifyRole([1,2,3]), deleteAsignacion);


export default router;
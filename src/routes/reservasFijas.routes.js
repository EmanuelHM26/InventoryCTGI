import express from 'express';
import {
  getAllReservasFijas,
  getReservaFijaById,
  createReservaFija,
  updateReservaFija,
  deleteReservaFija,
} from '../controllers/reservasFijas.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { verifyRole } from '../middlewares/rol.middleware.js';

const router = express.Router();

// Crear una nueva reserva fija
router.post('/reservasfijas', verifyToken, verifyRole([1]), createReservaFija);

// Obtener todas las reservas fijas
router.get('/reservasfijas', verifyToken, verifyRole([1]), getAllReservasFijas);

// Obtener una reserva fija por ID
router.get('/reservasfijas/:id', verifyToken, verifyRole([1]), getReservaFijaById);

// Actualizar una reserva fija por ID
router.put('/reservasfijas/:id', verifyToken, verifyRole([1]), updateReservaFija);

// Eliminar una reserva fija por ID
router.delete('/reservasfijas/:id', verifyToken, verifyRole([1]), deleteReservaFija);

export default router;
import express from 'express';
import {
  createReservaDiaria,
  getAllReservasDiarias,
  getReservaDiariaById,
  updateReservaDiaria,
  deleteReservaDiaria,
  getReservasByFecha,
} from '../controllers/reservasDiarias.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { verifyRole } from '../middlewares/rol.middleware.js';

const router = express.Router();

// Crear una nueva reserva diaria
router.post('/reservas-diarias', verifyToken, verifyRole([1]), createReservaDiaria);

// Obtener todas las reservas diarias
router.get('/reservas-diarias', verifyToken, verifyRole([1]), getAllReservasDiarias);

// Obtener una reserva diaria por ID
router.get('/reservas-diarias/:idReservaDiaria', verifyToken, verifyRole([1]), getReservaDiariaById);

// Actualizar una reserva diaria
router.put('/reservas-diarias/:idReservaDiaria', verifyToken, verifyRole([1]), updateReservaDiaria);

// Eliminar una reserva diaria
router.delete('/reservas-diarias/:idReservaDiaria', verifyToken, verifyRole([1]), deleteReservaDiaria);

// Obtener reservas por fecha
router.get('/reservas-diarias/fecha/:fecha', verifyToken, verifyRole([1]), getReservasByFecha);

export default router;
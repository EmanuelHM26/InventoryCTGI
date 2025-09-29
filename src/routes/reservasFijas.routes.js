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

// Primero pasa por verifyToken (¿está autenticado?).
// Luego pasa por verifyRole([1,2,3]) (¿su rol está en la lista [1,2,3]?).
// Si todo ok → ejecuta la funcion (lógica del controlador). Y ASI HACE CON TODOS 

// Crear una nueva reserva fija
router.post('/reservasfijas', verifyToken, verifyRole([1,2,3]), createReservaFija);

// Obtener todas las reservas fijas
router.get('/reservasfijas', verifyToken, verifyRole([1,2,3]), getAllReservasFijas);

// Obtener una reserva fija por ID
router.get('/reservasfijas/:id', verifyToken, verifyRole([1,2,3]), getReservaFijaById);

// Actualizar una reserva fija por ID
router.put('/reservasfijas/:id', verifyToken, verifyRole([1,2,3]), updateReservaFija);

// Eliminar una reserva fija por ID
router.delete('/reservasfijas/:id', verifyToken, verifyRole([1,2,3]), deleteReservaFija);

export default router;
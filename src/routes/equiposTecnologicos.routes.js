import express from 'express';
import {
  getEquipos,
  getEquipo,
  createEquipoHandler,
  updateEquipoHandler,
  deleteEquipoHandler,
} from '../controllers/equiposTecnologicos.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { verifyRole } from '../middlewares/rol.middleware.js';

const router = express.Router();


// Primero pasa por verifyToken (¿está autenticado?).
// Luego pasa por verifyRole([1,2,3]) (¿su rol está en la lista [1,2,3]?).
// Si todo ok → ejecuta la funcion (lógica del controlador). Y ASI HACE CON TODOS 

// Crear un nuevo equipo tecnológico
router.post('/equipostecnologicos', verifyToken, verifyRole([1,2,3]), createEquipoHandler);

// Obtener todos los equipos tecnológicos
router.get('/equipostecnologicos', verifyToken, verifyRole([1,2,3]), getEquipos);

// Obtener un equipo tecnológico por ID
router.get('/equipostecnologicos/:id', verifyToken, verifyRole([1,2,3]), getEquipo);

// Actualizar un equipo tecnológico por ID
router.put('/equipostecnologicos/:id', verifyToken, verifyRole([1,2,3]), updateEquipoHandler);

// Eliminar un equipo tecnológico por ID
router.delete('/equipostecnologicos/:id', verifyToken, verifyRole([1,2,3]), deleteEquipoHandler);

export default router;
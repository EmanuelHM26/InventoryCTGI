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

// Crear un nuevo equipo tecnológico
router.post('/equipostecnologicos', verifyToken, verifyRole([1]), createEquipoHandler);

// Obtener todos los equipos tecnológicos
router.get('/equipostecnologicos', verifyToken, verifyRole([1]), getEquipos);

// Obtener un equipo tecnológico por ID
router.get('/equipostecnologicos/:id', verifyToken, verifyRole([1]), getEquipo);

// Actualizar un equipo tecnológico por ID
router.put('/equipostecnologicos/:id', verifyToken, verifyRole([1]), updateEquipoHandler);

// Eliminar un equipo tecnológico por ID
router.delete('/equipostecnologicos/:id', verifyToken, verifyRole([1]), deleteEquipoHandler);

export default router;
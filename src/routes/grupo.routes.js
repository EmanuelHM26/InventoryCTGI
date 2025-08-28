import express from 'express';
import {
    getGrupos,
    getGrupoById,
    createGrupo,
    updateGrupo,
    deleteGrupo,
} from '../controllers/grupo.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { verifyRole } from '../middlewares/rol.middleware.js';

const router = express.Router();

// Crear un nuevo grupo
router.post('/grupo', verifyToken, verifyRole([1]), createGrupo);

// Obtener todos los grupos
router.get('/grupo', verifyToken, verifyRole([1]), getGrupos);

// Obtener un grupo por ID
router.get('/grupo/:id', verifyToken, verifyRole([1]), getGrupoById);

// Actualizar un grupo por ID
router.put('/grupo/:id', verifyToken, verifyRole([1]), updateGrupo);

// Eliminar un grupo por ID
router.delete('/grupo/:id', verifyToken, verifyRole([1]), deleteGrupo);

export default router;
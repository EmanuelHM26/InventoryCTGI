import express from 'express';
import { getLogins, getLogin, addLogin } from '../controllers/loginController.js';

const router = express.Router();

router.get('/', getLogins);          // Obtener todos los registros
router.get('/:id', getLogin);        // Obtener un registro por ID
router.post('/', addLogin);          // Crear un nuevo registro

export default router;

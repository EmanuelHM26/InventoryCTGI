import express from 'express';
import { searchGlobal } from '../controllers/busqueda.controller.js';

const router = express.Router();

// Ruta para búsqueda global
router.get('/search', searchGlobal);

export default router;
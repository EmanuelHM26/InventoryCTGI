import express from 'express';
import {
  getUsuariosCount,
  getAsignacionesCount,
  getEquiposCount,
  getProductosCount,
} from '../controllers/countItems.controller.js';

const router = express.Router();

router.get('/usuarios/count', getUsuariosCount);
router.get('/asignaciones/count', getAsignacionesCount);
router.get('/equipos-tecnologicos/count', getEquiposCount);
router.get('/productos-consumibles/count', getProductosCount);

export default router;
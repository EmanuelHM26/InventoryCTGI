import express from 'express';
import {
  getProductos,
  getProducto,
  createProductoHandler,
  updateProductoHandler,
  deleteProductoHandler,
} from '../controllers/productosConsumibles.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { verifyRole } from '../middlewares/rol.middleware.js';

const router = express.Router();

// Crear un nuevo producto consumible
router.post('/productosconsumibles', verifyToken, verifyRole([1]), createProductoHandler);

// Obtener todos los productos consumibles
router.get('/productosconsumibles', verifyToken, verifyRole([1]), getProductos);

// Obtener un producto consumible por ID
router.get('/productosconsumibles/:id', verifyToken, verifyRole([1]), getProducto);

// Actualizar un producto consumible por ID
router.put('/productosconsumibles/:id', verifyToken, verifyRole([1]), updateProductoHandler);

// Eliminar un producto consumible por ID
router.delete('/productosconsumibles/:id', verifyToken, verifyRole([1]), deleteProductoHandler);

export default router;
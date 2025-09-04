// movimientosConsumibles.controller.js (ajustado)
import { registrarMovimiento, obtenerMovimientosPorProducto, obtenerHistorialMovimientos } from '../services/movimientosConsumibles.service.js';

export const crearMovimientoHandler = async (req, res) => {
  try {
    // Obtener el usuario autenticado de tu sistema
    // Basado en tu código de login, parece que usas req.user
    const usuarioAutenticado = req.user;
    
    const movimientoData = {
      ...req.body,
      Usuario: usuarioAutenticado.Usuario || usuarioAutenticado.Correo || 'Sistema'
    };

    const movimiento = await registrarMovimiento(movimientoData);
    res.status(201).json(movimiento);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const obtenerMovimientosProductoHandler = async (req, res) => {
  try {
    const movimientos = await obtenerMovimientosPorProducto(req.params.id);
    res.json(movimientos);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const obtenerHistorialHandler = async (req, res) => {
  try {
    const movimientos = await obtenerHistorialMovimientos(req.query);
    res.json(movimientos);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Nuevo endpoint para obtener el historial completo con paginación
export const obtenerHistorialCompletoHandler = async (req, res) => {
  try {
    const { page = 1, limit = 10, ...filters } = req.query;
    const offset = (page - 1) * limit;
    
    const movimientos = await obtenerHistorialMovimientos({
      ...filters,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    res.json(movimientos);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
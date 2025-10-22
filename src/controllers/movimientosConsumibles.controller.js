// movimientosConsumibles.controller.js (ajustado)
import {
  registrarMovimiento,
  obtenerMovimientosPorProducto,
  obtenerHistorialMovimientos,
} from "../services/movimientosConsumibles.service.js";

export const crearMovimientoHandler = async (req, res) => {
  try {
    // Obtener el usuario autenticado de tu sistema
    // Basado en tu código de login, parece que usas req.user
    const usuarioAutenticado = req.user;

    const movimientoData = {
      ...req.body,
      Usuario:
        usuarioAutenticado.Usuario || usuarioAutenticado.Correo || "Sistema",
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
    // Si no hay query params, devolver todos los movimientos
    const filtros = Object.keys(req.query).length > 0 ? req.query : {};

    const movimientos = await obtenerHistorialMovimientos(filtros);

    // Asegurarse de devolver siempre un objeto con rows y count
    if (Array.isArray(movimientos)) {
      res.json({ rows: movimientos, count: movimientos.length });
    } else {
      res.json(movimientos);
    }
  } catch (error) {
    console.error("Error en obtenerHistorialHandler:", error);
    res.status(500).json({ error: error.message });
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
      offset: parseInt(offset),
    });

    res.json(movimientos);
  } catch (error) {
    console.error("Error en obtenerHistorialCompletoHandler:", error);
    res.status(500).json({ error: error.message });
  }
};

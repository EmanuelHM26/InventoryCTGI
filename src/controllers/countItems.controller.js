import { countUsuarios, countAsignaciones, countEquipos, countProductos } from '../services/countItems.service.js';

// Obtener el conteo de usuarios
export const getUsuariosCount = async (req, res) => {
  try {
    const count = await countUsuarios();
    res.status(200).json({ count });
  } catch (error) {
    console.error("Error al obtener el conteo de usuarios:", error);
    res.status(500).json({ message: "Error al obtener el conteo de usuarios" });
  }
};

// Obtener el conteo de asignaciones
export const getAsignacionesCount = async (req, res) => {
  try {
    const count = await countAsignaciones();
    res.status(200).json({ count });
  } catch (error) {
    console.error("Error al obtener el conteo de asignaciones:", error);
    res.status(500).json({ message: "Error al obtener el conteo de asignaciones" });
  }
};

// Obtener el conteo de equipos tecnológicos
export const getEquiposCount = async (req, res) => {
  try {
    const count = await countEquipos();
    res.status(200).json({ count });
  } catch (error) {
    console.error("Error al obtener el conteo de equipos tecnológicos:", error);
    res.status(500).json({ message: "Error al obtener el conteo de equipos tecnológicos" });
  }
};

// Obtener el conteo de productos consumibles
export const getProductosCount = async (req, res) => {
  try {
    const count = await countProductos();
    res.status(200).json({ count });
  } catch (error) {
    console.error("Error al obtener el conteo de productos consumibles:", error);
    res.status(500).json({ message: "Error al obtener el conteo de productos consumibles" });
  }
};
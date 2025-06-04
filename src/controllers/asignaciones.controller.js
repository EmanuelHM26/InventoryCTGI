import {
  createAsignacionService,
  getAllAsignacionesService,
  getAsignacionByIdService,
  updateAsignacionService,
  deleteAsignacionService,
  getAsignacionesByDaysService,
  confirmarDevolucionService
} from '../services/asignaciones.service.js';

// Crear una nueva asignación
export const createAsignacion = async (req, res) => {
  try {
    const nuevaAsignacion = await createAsignacionService(req.body);
    res.status(201).json(nuevaAsignacion);
  } catch (error) {
    res.status(400).json({ message: `Error al crear la asignación: ${error.message}` });
  }
};

// Obtener todas las asignaciones
export const getAllAsignaciones = async (req, res) => {
  try {
    const asignaciones = await getAllAsignacionesService();
    res.status(200).json(asignaciones);
  } catch (error) {
    res.status(500).json({ message: `Error al obtener las asignaciones: ${error.message}` });
  }
};

// Obtener una asignación por ID
export const getAsignacionById = async (req, res) => {
  try {
    const { idAsignaciones } = req.params;
    const asignacion = await getAsignacionByIdService(idAsignaciones);
    if (!asignacion) {
      return res.status(404).json({ message: "Asignación no encontrada" });
    }
    res.status(200).json(asignacion);
  } catch (error) {
    res.status(500).json({ message: `Error al obtener la asignación: ${error.message}` });
  }
};

// Actualizar una asignación
export const updateAsignacion = async (req, res) => {
  try {
    const { idAsignaciones } = req.params;
    const asignacion = await updateAsignacionService(idAsignaciones, req.body);
    res.status(200).json(asignacion);
  } catch (error) {
    res.status(500).json({ message: `Error al actualizar la asignación: ${error.message}` });
  }
};

// Eliminar una asignación
export const deleteAsignacion = async (req, res) => {
  try {
    const { idAsignaciones } = req.params;
    const result = await deleteAsignacionService(idAsignaciones);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: `Error al eliminar la asignación: ${error.message}` });
  }
};

// Obtener asignaciones recientes
export const getAsignacionesByDays = async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const asignaciones = await getAsignacionesByDaysService(days);
    res.status(200).json(asignaciones);
  } catch (error) {
    res.status(500).json({ message: `Error al obtener las asignaciones recientes: ${error.message}` });
  }
};

// Confirmar devolución de una asignación
export const confirmarDevolucion = async (req, res) => {
  try {
    const { idAsignaciones } = req.params;
    const asignacion = await confirmarDevolucionService(idAsignaciones);
    res.status(200).json(asignacion);
  } catch (error) {
    res.status(500).json({ message: `Error al confirmar la devolución: ${error.message}` });
  }
};
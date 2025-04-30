import {
  createAsignacionService,
  getAllAsignacionesService,
  getAsignacionByIdService,
  updateAsignacionService,
  deleteAsignacionService,
  getRecentAsignacionesService,
} from '../services/asignaciones.service.js';

// Crear una nueva asignación
export const createAsignacion = async (req, res) => {
  try {
    const data = req.body;
    const nuevaAsignacion = await createAsignacionService(data);
    res.status(201).json(nuevaAsignacion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obtener todas las asignaciones
export const getAllAsignaciones = async (req, res) => {
  try {
    const asignaciones = await getAllAsignacionesService();
    res.status(200).json(asignaciones);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener una asignación por ID
export const getAsignacionById = async (req, res) => {
  try {
    const { idAsignaciones, fechaAsignacion } = req.params;
    const asignacion = await getAsignacionByIdService(idAsignaciones, fechaAsignacion);
    res.status(200).json(asignacion);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Actualizar una asignación
export const updateAsignacion = async (req, res) => {
  try {
    const { idAsignaciones, fechaAsignacion } = req.params;
    const data = req.body;
    const asignacionActualizada = await updateAsignacionService(idAsignaciones, fechaAsignacion, data);
    res.status(200).json(asignacionActualizada);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Eliminar una asignación
export const deleteAsignacion = async (req, res) => {
  try {
    const { idAsignaciones, fechaAsignacion } = req.params;
    const resultado = await deleteAsignacionService(idAsignaciones, fechaAsignacion);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Obtner asignaciones recientes

export const getRecentAsignaciones = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;
    const asignacionesRecientes = await getRecentAsignacionesService(fechaInicio, fechaFin);
    res.status(200).json(asignacionesRecientes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
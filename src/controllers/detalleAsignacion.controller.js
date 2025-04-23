import {
    createDetalleAsignacionService,
    getAllDetallesAsignacionService,
    getDetalleAsignacionByIdService,
    getDetallesByAsignacionIdService,
    updateDetalleAsignacionService,
    deleteDetalleAsignacionService,
  } from '../services/detalleAsignacion.service.js';
  
  // Crear un nuevo detalle de asignación
  export const createDetalleAsignacion = async (req, res) => {
    try {
      const data = req.body;
      const nuevoDetalle = await createDetalleAsignacionService(data);
      res.status(201).json(nuevoDetalle);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  // Obtener todos los detalles de asignación
  export const getAllDetallesAsignacion = async (req, res) => {
    try {
      const detalles = await getAllDetallesAsignacionService();
      res.status(200).json(detalles);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Obtener un detalle de asignación por ID
  export const getDetalleAsignacionById = async (req, res) => {
    try {
      const { id } = req.params;
      const detalle = await getDetalleAsignacionByIdService(id);
      res.status(200).json(detalle);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };
  
  // Obtener todos los detalles asociados a una asignación específica
  export const getDetallesByAsignacionId = async (req, res) => {
    try {
      const { idAsignacion } = req.params;
      const detalles = await getDetallesByAsignacionIdService(idAsignacion);
      res.status(200).json(detalles);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };
  
  // Actualizar un detalle de asignación
  export const updateDetalleAsignacion = async (req, res) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const detalleActualizado = await updateDetalleAsignacionService(id, data);
      res.status(200).json(detalleActualizado);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };
  
  // Eliminar un detalle de asignación
  export const deleteDetalleAsignacion = async (req, res) => {
    try {
      const { id } = req.params;
      const resultado = await deleteDetalleAsignacionService(id);
      res.status(200).json(resultado);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };
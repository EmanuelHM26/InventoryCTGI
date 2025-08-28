import {
    getAllEquiposService,
    getEquipoByIdService,
    createEquipoService,
    updateEquipoService,
    deleteEquipoService,
  } from '../services/equiposTecnologicos.service.js';
  
  export const getEquipos = async (req, res) => {
    try {
      const equipos = await getAllEquiposService();
      res.status(200).json(equipos);
    } catch (error) {
      console.error('Error al obtener equipos:', error);
      res.status(500).json({ message: 'Error al obtener equipos' });
    }
  };
  
  export const getEquipo = async (req, res) => {
    try {
      const { id } = req.params;
      const equipo = await getEquipoByIdService(id);
      if (!equipo) return res.status(404).json({ message: 'Equipo no encontrado' });
      res.status(200).json(equipo);
    } catch (error) {
      console.error('Error al obtener equipo:', error);
      res.status(500).json({ message: 'Error al obtener equipo' });
    }
  };
  
  export const createEquipoHandler = async (req, res) => {
    try {
      const equipo = await createEquipoService(req.body);
      res.status(201).json(equipo);
    } catch (error) {
      console.error('Error al crear equipo:', error);
      res.status(500).json({ message: 'Error al crear equipo' });
    }
  };
  
  export const updateEquipoHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const equipo = await updateEquipoService(id, req.body);
      res.status(200).json(equipo);
    } catch (error) {
      console.error('Error al actualizar equipo:', error);
      res.status(500).json({ message: 'Error al actualizar equipo' });
    }
  };
  
  export const deleteEquipoHandler = async (req, res) => {
    try {
      const { id } = req.params;
      await deleteEquipoService(id);
      res.status(204).send();
    } catch (error) {
      console.error('Error al eliminar equipo:', error);
      res.status(500).json({ message: 'Error al eliminar equipo' });
    }
  };
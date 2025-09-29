//IMPORTACION DE LOS SERVICIOS
import {
    getAllEquiposService,
    getEquipoByIdService,
    createEquipoService,
    updateEquipoService,
    deleteEquipoService,
  } from '../services/equiposTecnologicos.service.js';


// Obtener todos los equipos
  export const getEquipos = async (req, res) => {
    try {
      // 1. Llama al servicio que obtiene todos los equipos
      const equipos = await getAllEquiposService();

      // 2. Si todo sale bien, responde al cliente con código HTTP 200 (OK) 
    // y los datos en formato JSON
      res.status(200).json(equipos);
    } catch (error) {
      // 3. Si ocurre un error, lo muestra en la consola del servidor
      console.error('Error al obtener equipos:', error);

      // 4. Y responde al cliente con código 500 (Error interno del servidor)
    // más un mensaje en JSON
      res.status(500).json({ message: 'Error al obtener equipos' });
    }
  };
  

// Obtener un equipo por ID
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


// Crear un nuevo equipo
  export const createEquipoHandler = async (req, res) => {
    try {
      const equipo = await createEquipoService(req.body);
      res.status(201).json(equipo);
    } catch (error) {
      console.error('Error al crear equipo:', error);
      res.status(500).json({ message: 'Error al crear equipo' });
    }
  };


 // Actualizar un equipo existente 
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

  // Eliminar un equipo
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
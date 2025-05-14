import {
  getAllGruposService,
  getGrupoByIdService,
  createGrupoService,
  updateGrupoService,
  deleteGrupoService,
} from '../services/grupo.service.js';

// Obtener todos los grupos
export const getGrupos = async (req, res) => {
  try {
    const grupos = await getAllGruposService();
    res.status(200).json(grupos);
  } catch (error) {
    console.error('Error al obtener grupos:', error);
    res.status(500).json({ message: 'Error al obtener grupos' });
  }
};

// Obtener un grupo por ID
export const getGrupoById = async (req, res) => {
  try {
    const { id } = req.params;
    const grupo = await getGrupoByIdService(id);
    if (!grupo) return res.status(404).json({ message: 'Grupo no encontrado' });
    res.status(200).json(grupo);
  } catch (error) {
    console.error('Error al obtener grupo:', error);
    res.status(500).json({ message: 'Error al obtener grupo' });
  }
};

// Crear un nuevo grupo
export const createGrupo = async (req, res) => {
  try {
    console.log("Datos recibidos en el backend:", req.body); // Depuración
    const nuevoGrupo = await createGrupoService(req.body); // Llama al servicio para crear el grupo
    res.status(201).json(nuevoGrupo);
  } catch (error) {
    console.error("Error al crear grupo:", error); // Esto debería mostrar el error en los logs
    res.status(500).json({ message: "Error al crear grupo" });
  }
};

// Actualizar un grupo existente
export const updateGrupo = async (req, res) => {
  try {
    const { id } = req.params;
    const grupoActualizado = await updateGrupoService(id, req.body); 
    res.status(200).json(grupoActualizado);
  } catch (error) {
    console.error('Error al actualizar grupo:', error);
    res.status(500).json({ message: 'Error al actualizar grupo' });
  }
};

// Eliminar un grupo
export const deleteGrupo = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteGrupoService(id); 
    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar grupo:', error);
    res.status(500).json({ message: 'Error al eliminar grupo' });
  }
};
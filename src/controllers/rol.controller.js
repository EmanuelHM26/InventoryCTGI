import {
  getRolesService,
  createRoleService,
  updateRoleService,
  deleteRoleService,
  updateUserRoleService,
} from "../services/rol.service.js";

// Obtener todos los roles
export const getRoles = async (req, res) => {
  try {
    const roles = await getRolesService();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener roles", error: error.message });
  }
};

// Crear un nuevo rol
export const createRole = async (req, res) => {
  try {
    const { NombreRol } = req.body;
    const newRole = await createRoleService(NombreRol);
    res.status(201).json(newRole);
  } catch (error) {
    res.status(500).json({ message: "Error al crear rol", error: error.message });
  }
};

// Actualizar un rol
export const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { NombreRol } = req.body;
    const updatedRole = await updateRoleService(id, NombreRol);
    res.json(updatedRole);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar rol", error: error.message });
  }
};

// Eliminar un rol
export const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteRoleService(id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar rol", error: error.message });
  }
};

// Actualizar el rol de un usuario
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { IdRol } = req.body;
    const result = await updateUserRoleService(id, IdRol);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el rol", error: error.message });
  }
};

import Role from "../models/RolModel.js";
import RegistroLogin from "../models/LoginModel.js"; // Asegúrate de importar el modelo correcto

// Obtener todos los roles
export const getRoles = async (req, res) => {
  try {
    const roles = await Role.findAll();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener roles", error });
  }
};

// Crear un nuevo rol
export const createRole = async (req, res) => {
  try {
    const { NombreRol } = req.body;
    if (!NombreRol) {
      return res
        .status(400)
        .json({ message: "El nombre del rol es obligatorio" });
    }
    const newRole = await Role.create({ NombreRol });
    res.status(201).json(newRole);
  } catch (error) {
    res.status(500).json({ message: "Error al crear rol", error });
  }
};

// Actualizar un rol
export const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { NombreRol } = req.body;

    const role = await Role.findByPk(id);
    if (!role) {
      return res.status(404).json({ message: "Rol no encontrado" });
    }

    role.NombreRol = NombreRol;
    await role.save();

    res.json(role);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar rol", error });
  }
};

// Eliminar un rol
export const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;

    const role = await Role.findByPk(id);
    if (!role) {
      return res.status(404).json({ message: "Rol no encontrado" });
    }

    await role.destroy();
    res.json({ message: "Rol eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar rol", error });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params; // ID del usuario
    const { IdRol } = req.body; // Nuevo rol

    // Verificar que el rol exista
    const role = await Role.findByPk(IdRol);
    if (!role) {
      return res.status(400).json({ message: "El rol proporcionado no es válido" });
    }

    // Actualizar el rol del usuario
    const user = await RegistroLogin.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    user.IdRol = IdRol;
    await user.save();

    res.status(200).json({ message: "Rol actualizado exitosamente" });
  } catch (error) {
    console.error("Error en updateUserRole:", error);
    res.status(500).json({ message: "Error al actualizar el rol", error });
  }
};
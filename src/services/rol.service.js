import Role from "../models/RolModel.js";
import RegistroLogin from "../models/LoginModel.js";

// Obtener todos los roles
export const getRolesService = async () => {
  return await Role.findAll();
};

// Crear un nuevo rol
export const createRoleService = async (NombreRol) => {
  if (!NombreRol) throw new Error("El nombre del rol es obligatorio");
  return await Role.create({ NombreRol });
};

// Actualizar un rol
export const updateRoleService = async (id, NombreRol) => {
  const role = await Role.findByPk(id);
  if (!role) throw new Error("Rol no encontrado");

  role.NombreRol = NombreRol;
  await role.save();
  return role;
};

// Eliminar un rol
export const deleteRoleService = async (id) => {
  const role = await Role.findByPk(id);
  if (!role) throw new Error("Rol no encontrado");

  await role.destroy();
  return { message: "Rol eliminado correctamente" };
};

// Actualizar el rol de un usuario
export const updateUserRoleService = async (userId, IdRol) => {
  const role = await Role.findByPk(IdRol);
  if (!role) throw new Error("El rol proporcionado no es válido");

  const user = await RegistroLogin.findByPk(userId);
  if (!user) throw new Error("Usuario no encontrado");

  user.IdRol = IdRol;
  await user.save();

  return { message: "Rol actualizado exitosamente" };
};

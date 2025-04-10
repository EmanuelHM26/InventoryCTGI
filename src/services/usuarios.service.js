import Usuario from "../models/UsuariosModel.js";

// Obtener todos los usuarios
export const getUsuariosService = async () => {
  return await Usuario.findAll();
};

// Obtener un usuario por ID
export const getUsuarioByIdService = async (id) => {
  const usuario = await Usuario.findByPk(id);
  if (!usuario) throw new Error("Usuario no encontrado");
  return usuario;
};

// Crear un nuevo usuario
export const createUsuarioService = async (data) => {
  return await Usuario.create(data);
};

// Actualizar un usuario
export const updateUsuarioService = async (id, data) => {
  const usuario = await Usuario.findByPk(id);
  if (!usuario) throw new Error("Usuario no encontrado");

  await usuario.update(data);
  return usuario;
};

// Eliminar un usuario
export const deleteUsuarioService = async (id) => {
  const usuario = await Usuario.findByPk(id);
  if (!usuario) throw new Error("Usuario no encontrado");

  await usuario.destroy();
  return { message: "Usuario eliminado correctamente" };
};

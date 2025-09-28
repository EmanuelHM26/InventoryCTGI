import Usuario from "../models/UsuariosModel.js";

// Obtener todos los usuarios
export const getUsuariosService = async () => {
  return await Usuario.findAll();
};

// Obtener un usuario por ID
// throw = es para lanzar una excepcion, se detiene en el throw y pasa el control al bloque de manejo de errores (try...catch)
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
// ! = es el operador de negacion logica, en este caso significa NO EXISTE USUARIO
export const deleteUsuarioService = async (id) => {
  const usuario = await Usuario.findByPk(id);
  if (!usuario) throw new Error("Usuario no encontrado");

  await usuario.destroy();
  return { message: "Usuario eliminado correctamente" };
};


// funciones del ORM 
// findAll() funcion para hacer consultas para obtener todos los registros de la tabla 
//findByPk() para buscar un cliente por su clave primaria 
//destroy() lo elimina de la base de datos 
//update() para actualizar DATA(es la informacion nueva que quiero actualizar del usuarios viene normamente desde el req.body)




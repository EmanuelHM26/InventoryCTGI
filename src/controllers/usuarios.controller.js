import {
  getUsuariosService,
  getUsuarioByIdService,
  createUsuarioService,
  updateUsuarioService,
  deleteUsuarioService,
} from "../services/usuarios.service.js";

// Obtener todos los usuarios
export const getUsuarios = async (req, res) => {
  try {
    const usuarios = await getUsuariosService();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuarios", error: error.message });
  }
};

// Obtener un usuario por ID
export const getUsuarioById = async (req, res) => {
  try {
    const usuario = await getUsuarioByIdService(req.params.id);
    res.json(usuario);
  } catch (error) {
    res.status(404).json({ message: "Usuario no encontrado", error: error.message });
  }
};

// Crear un nuevo usuario
export const createUsuario = async (req, res) => {
  try {
    const nuevoUsuario = await createUsuarioService(req.body);
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    res.status(500).json({ message: "Error al crear usuario", error: error.message });
  }
};

// Actualizar un usuario
export const updateUsuario = async (req, res) => {
  try {
    const usuario = await updateUsuarioService(req.params.id, req.body);
    res.json({ message: "Usuario actualizado correctamente", usuario });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar usuario", error: error.message });
  }
};

// Eliminar un usuario
export const deleteUsuario = async (req, res) => {
  try {
    const result = await deleteUsuarioService(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar usuario", error: error.message });
  }
};

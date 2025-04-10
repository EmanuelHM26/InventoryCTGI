import {
  createUserService,
  loginUserService,
  verifyEmailService,
  requestPasswordResetService,
  validateResetTokenService,
  resetPasswordService,
  verifyTokenService,
  getAllUsersService,
  getUserByIdService,
  updateUserService,
  deleteUserService
} from "../services/login.service.js";

// ======================= REGISTRO =======================
export const createUser = async (req, res) => {
  try {
    const result = await createUserService(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: "Error al crear usuario", error: error.message });
  }
};

// ======================= LOGIN =======================
export const loginUser = async (req, res) => {
  try {
    const { token, Correo } = await loginUserService(req.body);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Inicio de sesión exitoso", Correo });
  } catch (error) {
    res.status(401).json({ message: "Error al iniciar sesión", error: error.message });
  }
};

// ======================= LOGOUT =======================
export const logoutUser = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0),
  });
  res.status(200).json({ message: "Sesión cerrada exitosamente" });
};

// ======================= VERIFICAR CORREO =======================
export const verifyEmail = async (req, res) => {
  try {
    const result = await verifyEmailService(req.query.token);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: "Error al verificar correo", error: error.message });
  }
};

// ======================= SOLICITAR RESTABLECIMIENTO =======================
export const requestPasswordReset = async (req, res) => {
  try {
    const result = await requestPasswordResetService(req.body.Correo);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: "Error al solicitar restablecimiento", error: error.message });
  }
};

// ======================= VALIDAR TOKEN DE RESET =======================
export const validateResetToken = async (req, res) => {
  try {
    const result = await validateResetTokenService(req.query.token);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: "Token inválido o expirado", error: error.message });
  }
};

// ======================= RESTABLECER CONTRASEÑA =======================
export const resetPassword = async (req, res) => {
  try {
    const result = await resetPasswordService(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: "Error al restablecer contraseña", error: error.message });
  }
};

// ======================= VERIFICAR TOKEN JWT =======================
export const verifyToken = async (req, res) => {
  try {
    const token = req.cookies.token;
    const decoded = await verifyTokenService(token);
    res.status(200).json(decoded);
  } catch (error) {
    res.status(401).json({ message: "Token inválido", error: error.message });
  }
};

// ======================= USUARIOS - CRUD =======================
export const getAllUsers = async (req, res) => {
  try {
    const users = await getAllUsersService();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuarios", error: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await getUserByIdService(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(404).json({ message: "Usuario no encontrado", error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const updated = await updateUserService(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar usuario", error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const result = await deleteUserService(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: "Error al eliminar usuario", error: error.message });
  }
};

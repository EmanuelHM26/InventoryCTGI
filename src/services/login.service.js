import RegistroLogin from "../models/LoginModel.js";
import Password from "../models/PasswordModel.js";
import VerificationToken from "../models/VerificacionTokenModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import ResetToken from "../models/ResetTokenModel.js";

dotenv.config();

// ======================= CREAR USUARIO =======================
export const createUserService = async ({ Usuario, Correo, PasswordTexto }) => {
  if (!Usuario || !Correo || !PasswordTexto) {
    throw new Error("Todos los campos son obligatorios");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(PasswordTexto, salt);

  const nuevaPassword = await Password.create({
    Password: hashedPassword,
    FechaCreacion: new Date(),
    FechaActualizacion: new Date(),
  });

  const rolPorDefecto = 1;

  const newUser = await RegistroLogin.create({
    Usuario,
    Correo,
    IdPassword: nuevaPassword.IdPassword,
    IdRol: rolPorDefecto,
  });

  const token = crypto.randomBytes(32).toString("hex");
  const expiration = new Date(Date.now() + 3600000);

  await VerificationToken.create({
    Token: token,
    UsuarioId: newUser.IdRegistroLogin,
    Expiration: expiration,
  });

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const verificationLink = `http://localhost:5173/verify-email?token=${token}`;
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: Correo,
    subject: "Verificación de correo electrónico",
    html: `<p>Gracias por registrarte. Haz clic en el siguiente enlace para verificar tu correo:</p>
           <a href="${verificationLink}">${verificationLink}</a>`,
  });

  return { message: "Usuario registrado exitosamente" };
};

// ======================= AUTENTICACIÓN =======================
export const loginUserService = async ({ Correo, PasswordTexto }) => {
  if (!Correo || !PasswordTexto) {
    throw new Error("Correo y contraseña son obligatorios");
  }

  const user = await RegistroLogin.findOne({ where: { Correo } });

  if (!user || !user.isVerified) {
    throw new Error("Debes verificar tu correo antes de iniciar sesión");
  }

  const password = await Password.findByPk(user.IdPassword);
  if (!password) {
    throw new Error("Correo o contraseña incorrectos");
  }

  const isMatch = await bcrypt.compare(PasswordTexto, password.Password);
  if (!isMatch) {
    throw new Error("Correo o contraseña incorrectos");
  }

  const token = jwt.sign(
    { id: user.IdRegistroLogin, Correo: user.Correo, Rol: user.IdRol },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );

  return { token, Correo: user.Correo };
};

// ======================= VERIFICAR CORREO =======================
export const verifyEmailService = async (token) => {
  const verificationToken = await VerificationToken.findOne({ where: { Token: token } });
  if (!verificationToken || verificationToken.Expiration < new Date()) {
    throw new Error("Token inválido o expirado");
  }

  const user = await RegistroLogin.findByPk(verificationToken.UsuarioId);
  if (!user) throw new Error("Usuario no encontrado");

  user.isVerified = true;
  await user.save();
  await verificationToken.destroy();

  return { message: "Correo verificado exitosamente" };
};

// ======================= SOLICITAR RESTABLECIMIENTO =======================
export const requestPasswordResetService= async (Correo) => {
  const user = await RegistroLogin.findOne({ where: { Correo } });
  if (!user) throw new Error("Usuario no encontrado");

  const token = crypto.randomBytes(32).toString("hex");
  const expiration = new Date(Date.now() + 3600000);

  await ResetToken.create({
    Token: token,
    UsuarioId: user.IdRegistroLogin,
    Expiration: expiration,
  });

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const resetLink = `http://localhost:5173/reset-password?token=${token}`;
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: Correo,
    subject: "Restablecimiento de contraseña",
    html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
           <a href="${resetLink}">${resetLink}</a>`,
  });

  return { message: "Correo de restablecimiento enviado" };
};

// ======================= VALIDAR TOKEN DE RESET =======================
export const validateResetTokenService = async (token) => {
  const resetToken = await ResetToken.findOne({ where: { Token: token } });
  if (!resetToken || resetToken.Expiration < new Date()) {
    throw new Error("Token inválido o expirado");
  }

  return { message: "Token válido" };
};

// ======================= RESTABLECER CONTRASEÑA =======================
export const resetPasswordService = async ({ token, nuevaPassword }) => {
  const resetToken = await ResetToken.findOne({ where: { Token: token } });
  if (!resetToken || resetToken.Expiration < new Date()) {
    throw new Error("Token inválido o expirado");
  }

  const user = await RegistroLogin.findByPk(resetToken.UsuarioId);
  if (!user) throw new Error("Usuario no encontrado");

  const password = await Password.findByPk(user.IdPassword);
  if (!password) throw new Error("Contraseña no encontrada");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(nuevaPassword, salt);

  password.Password = hashedPassword;
  password.FechaActualizacion = new Date();
  await password.save();

  await resetToken.destroy();

  return { message: "Contraseña actualizada exitosamente" };
};

// ======================= VERIFICAR TOKEN =======================
export const verifyTokenService = async (token) => {
    if (!token) {
      throw new Error("Token no proporcionado");
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded; // contiene el payload (id, correo, rol, etc.)
    } catch (error) {
      throw new Error("Token inválido o expirado");
    }
  };
  

// ======================= LISTADO / CRUD =======================
export const getAllUsersService = async () => {
  return await RegistroLogin.findAll();
};

export const getUserByIdService = async (id) => {
  const user = await RegistroLogin.findByPk(id, {
    attributes: [
      "IdRegistroLogin",
      "Usuario",
      "Correo",
      "Password",
      "IdPassword",
      "FechaInicioSesion",
      "FechaCerrarSesion",
      "HoraInicioSesion",
    ],
  });

  if (!user) throw new Error("Usuario no encontrado");
  return user;
};

export const updateUserService = async (id, data) => {
  const user = await RegistroLogin.findByPk(id);
  if (!user) throw new Error("Usuario no encontrado");

  user.Usuario = data.Usuario || user.Usuario;
  user.Correo = data.Correo || user.Correo;
  user.IdRol = data.IdRol || user.IdRol;
  await user.save();

  return user;
};

export const deleteUserService = async (id) => {
  const user = await RegistroLogin.findByPk(id);
  if (!user) throw new Error("Usuario no encontrado");

  await user.destroy();
  return { message: "Usuario eliminado correctamente" };
};

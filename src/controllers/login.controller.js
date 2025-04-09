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

// Crear usuario
export const createUser = async (req, res) => {
  try {
    const { Usuario, Correo, PasswordTexto } = req.body;

    if (!Usuario || !Correo || !PasswordTexto) {
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios" });
    }

    // Encriptar la contraseña antes de guardarla
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(PasswordTexto, salt);

    // Guardar en la tabla Password
    const nuevaPassword = await Password.create({
      Password: hashedPassword, // Se guarda la contraseña encriptada
      FechaCreacion: new Date(),
      FechaActualizacion: new Date(),
    });

    // Asignar un rol por defecto (por ejemplo, "Usuario")
    const rolPorDefecto = 1; // Cambia este valor según el IdRol de tu tabla `rol`

    // Guardar en la tabla RegistroLogin con la referencia a Password
    const newUser = await RegistroLogin.create({
      Usuario,
      Correo,
      IdPassword: nuevaPassword.IdPassword, // Relación con Password
      IdRol: rolPorDefecto, // Asignar rol por defecto
    });

    // Generar un token de verificación
    const token = crypto.randomBytes(32).toString("hex"); // Genera el token
    const expiration = new Date(Date.now() + 3600000); // 1 hora de validez

    // Guardar el token en la tabla VerificationToken
    await VerificationToken.create({
      Token: token,
      UsuarioId: newUser.IdRegistroLogin,
      Expiration: expiration,
    });

    // Configurar el transporte de correo
    const transporter = nodemailer.createTransport({
      service: "Gmail", // Cambia esto según tu proveedor de correo
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Enviar el correo de verificación
    const verificationLink = `http://localhost:5173/verify-email?token=${token}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: Correo,
      subject: "Verificación de correo electrónico",
      html: `<p>Gracias por registrarte. Haz clic en el siguiente enlace para verificar tu correo:</p>
             <a href="${verificationLink}">${verificationLink}</a>`,
    });
    console.log("Correo enviado a:", Correo);

    res.status(201).json({ message: "Usuario registrado exitosamente" });
  } catch (error) {
    console.error("Error en createUser:", error); // Agrega este log para depuración
    res.status(500).json({ message: "Error al registrar usuario", error });
  }
};

// Obtener todos los usuarios
export const getUsers = async (req, res) => {
  try {
    const users = await RegistroLogin.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuarios", error });
  }
};

// Obtener un usuario por ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params; // id viene de la URL
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

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuario", error });
  }
};

// Eliminar un usuario

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar el usuario por ID
    const user = await RegistroLogin.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Eliminar el usuario
    await user.destroy();
    res.status(200).json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({ message: "Error al eliminar usuario", error });
  }
};

// Actualizar un usuario

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { Usuario, Correo, IdRol } = req.body;

    // Buscar el usuario por ID
    const user = await RegistroLogin.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Actualizar los datos del usuario
    user.Usuario = Usuario || user.Usuario;
    user.Correo = Correo || user.Correo;
    user.IdRol = IdRol || user.IdRol;
    await user.save();

    res.status(200).json({ message: "Usuario actualizado correctamente", user });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ message: "Error al actualizar usuario", error });
  }
};

// Iniciar sesión
export const loginUser = async (req, res) => {
  try {
    const { Correo, PasswordTexto } = req.body;

    if (!Correo || !PasswordTexto) {
      return res
        .status(400)
        .json({ message: "Correo y contraseña son obligatorios" });
    }

    // Buscar el usuario por correo y hacer un INNER JOIN con la tabla Password
    const user = await RegistroLogin.findOne({ where: { Correo } });
    if (!user.isVerified) {
      return res
        .status(404)
        .json({ message: "Debes verificar tu correo antes de iniciar sesión" });
    }

    // Verificar la contraseña
    const password = await Password.findByPk(user.IdPassword);
    if (!password) {
      return res
        .status(404)
        .json({ message: "Correo o contraseña incorrectos" });
    }

    const isMatch = await bcrypt.compare(PasswordTexto, password.Password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Correo o contraseña incorrectos" });
    }

    // Si las credenciales son correctas
    const token = jwt.sign(
      { id: user.IdRegistroLogin, Correo: user.Correo, Rol: user.IdRol },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Configurar la cookie para el token
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Inicio de sesión exitoso",
      user: { Correo: user.Correo },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al iniciar sesión", error });
  }
};

// Cerrar sesión
export const logoutUser = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0), // Expira inmediatamente
  });
  res.status(200).json({ message: "Sesión cerrada exitosamente" });
};

//Verificación de correo electrónico
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: "El token es obligatorio" });
    }

    // Buscar el token en la base de datos
    const verificationToken = await VerificationToken.findOne({
      where: { Token: token },
    });

    if (!verificationToken || verificationToken.Expiration < new Date()) {
      return res.status(400).json({ message: "Token inválido o expirado" });
    }

    // Marcar al usuario como verificado
    const user = await RegistroLogin.findByPk(verificationToken.UsuarioId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    user.isVerified = true;
    await user.save();

    // Eliminar el token de la base de datos
    await verificationToken.destroy();

    res.status(200).json({ message: "Correo verificado exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al verificar el correo", error });
  }
};

//Restablecer contraseña

export const requestPasswordReset = async (req, res) => {
  try {
    const { Correo } = req.body;

    if (!Correo) {
      return res.status(400).json({ message: "El correo es obligatorio" });
    }

    // Buscar al usuario por correo
    const user = await RegistroLogin.findOne({ where: { Correo } });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Generar un token único
    const token = crypto.randomBytes(32).toString("hex");
    const expiration = new Date(Date.now() + 3600000); // 1 hora de validez

    // Guardar el token en la tabla resetTokens
    await ResetToken.create({
      Token: token,
      UsuarioId: user.IdRegistroLogin,
      Expiration: expiration,
    });

    // Configurar el transporte de correo
    const transporter = nodemailer.createTransport({
      service: "Gmail", // Cambia esto según tu proveedor de correo
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Enviar el correo con el enlace de restablecimiento
    const resetLink = `http://localhost:5173/reset-password?token=${token}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: Correo,
      subject: "Restablecimiento de contraseña",
      html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
             <a href="${resetLink}">${resetLink}</a>`,
    });

    res.status(200).json({ message: "Correo de restablecimiento enviado" });
  } catch (error) {
    console.error("Error en requestPasswordReset:", error);
    res
      .status(500)
      .json({
        message: "Error al solicitar restablecimiento de contraseña",
        error,
      });
  }
};

//Verificar token de restablecimiento de contraseña

export const validateResetToken = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: "El token es obligatorio" });
    }

    // Buscar el token en la base de datos
    const resetToken = await ResetToken.findOne({ where: { Token: token } });

    if (!resetToken || resetToken.Expiration < new Date()) {
      return res.status(400).json({ message: "Token inválido o expirado" });
    }

    res.status(200).json({ message: "Token válido" });
  } catch (error) {
    console.error("Error en validateResetToken:", error);
    res.status(500).json({ message: "Error al validar el token", error });
  }
};

//Permitir al usuario restablecer su contraseña

export const resetPassword = async (req, res) => {
  try {
    const { token, nuevaPassword } = req.body;

    if (!token || !nuevaPassword) {
      return res
        .status(400)
        .json({ message: "El token y la nueva contraseña son obligatorios" });
    }

    // Buscar el token en la base de datos
    const resetToken = await ResetToken.findOne({ where: { Token: token } });

    if (!resetToken || resetToken.Expiration < new Date()) {
      return res.status(400).json({ message: "Token inválido o expirado" });
    }

    // Buscar al usuario asociado al token
    const user = await RegistroLogin.findByPk(resetToken.UsuarioId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Encriptar la nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(nuevaPassword, salt);

    // Actualizar la contraseña en la tabla Password
    const password = await Password.findByPk(user.IdPassword);
    if (!password) {
      return res.status(404).json({ message: "Contraseña no encontrada" });
    }

    // Actualizar la contraseña en la tabla Password
    password.Password = hashedPassword;
    password.FechaActualizacion = new Date();
    await password.save();

    // Eliminar el token de la base de datos
    await resetToken.destroy();

    res.status(200).json({ message: "Contraseña actualizada exitosamente" });
  } catch (error) {
    console.error("Error en resetPassword:", error);
    res
      .status(500)
      .json({ message: "Error al restablecer la contraseña", error });
  }
};

export const verifyTokenController = (req, res) => {
  const user = req.user; // El middleware verifyToken ya agrega el usuario al request
  if (user) {
    return res.status(200).json({ user });
  }
  res.status(401).json({ message: "Token inválido o no proporcionado" });
};

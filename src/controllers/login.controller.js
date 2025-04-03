import RegistroLogin from "../models/LoginModel.js";
import Password from "../models/PasswordModel.js";
import bcrypt from "bcrypt";

// Crear usuario
export const createUser = async (req, res) => {
  try {
    const { Usuario, Correo, PasswordTexto } = req.body;

    if (!Usuario || !Correo || !PasswordTexto) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
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

    // Guardar en la tabla RegistroLogin con la referencia a Password
    const newUser = await RegistroLogin.create({
      Usuario,
      Correo,
      IdPassword: nuevaPassword.IdPassword, // Relación con Password
    });

    res.status(201).json({ message: "Usuario registrado exitosamente" });
  } catch (error) {
    console.error(error);
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
        "IdRegistroLogin", "Usuario", "Correo", "Password", "IdPassword",
        "FechaInicioSesion", "FechaCerrarSesion", "HoraInicioSesion"
      ]
    });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuario", error });
  }
};


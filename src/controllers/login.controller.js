import RegistroLogin from "../models/LoginModel.js";
import Password from "../models/PasswordModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

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

// Iniciar sesión
export const loginUser = async (req, res) => {
  try {
    const { Usuario, PasswordTexto } = req.body;

    if (!Usuario || !PasswordTexto) {
      return res.status(400).json({ message: "Usuario y contraseña son obligatorios" });
    }

    // Buscar el usuario y hacer un INNER JOIN con la tabla Password
    const user = await RegistroLogin.findOne({
      where: { Usuario },
      include: [
        {
          model: Password,
          attributes: ["Password"], // Solo necesitamos la contraseña encriptada
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Verificar la contraseña
    const passwordMatch = await bcrypt.compare(PasswordTexto, user.Password.Password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // Si las credenciales son correctas
    const token = jwt.sign(
      { id:  user.IdRegistroLogin, Usuario: user.Usuario },
      process.env.JWT_SECRET,
      {expiresIn: "24h"}
    ); 

    //Configurar la cookie para el token
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    })
    // Si las credenciales son correctas
    res.status(200).json({ 
      message: "Inicio de sesión exitoso", 
      user: { Usuario: user.Usuario, Password: user.Password.Password } 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al iniciar sesión", error });
  }
};


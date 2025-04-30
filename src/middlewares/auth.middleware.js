import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import RegistroLogin from "../models/LoginModel.js";
import Role from "../models/RolModel.js";

dotenv.config();

export const verifyToken = async (req, res, next) => {
  let token = req.cookies.token;

  if (!token && req.headers.authorization) {
    const authHeader = req.headers.authorization;
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
  }

  if (!token) {
    return res.status(403).json({ message: "Token no proporcionado" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Obtener el usuario con su rol
    const user = await RegistroLogin.findByPk(decoded.id, {
      include: [{
        model: Role,
        attributes: ["NombreRol"],
        as: "Rol"
      }]
    });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    req.user = {
      id: user.IdRegistroLogin,
      nombre: user.Usuario,
      rol: user.Rol?.NombreRol || "Sin rol",
      rolId: user.IdRol 
    };

    next();
  } catch (error) {
    console.error("Error en verifyToken:", error);
    res.status(401).json({ message: "Token inválido" });
  }
};

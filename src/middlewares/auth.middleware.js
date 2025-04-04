import jwt from "jsonwebtoken";
import dotenv  from "dotenv"

dotenv.config()

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token
  if (!token) {
    return res.status(403).json({ message: "Token no proporcionado" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Agregar los datos del usuario al request
    next();
  } catch (error) {
    res.status(401).json({ message: "Token inválido" });
  }
};
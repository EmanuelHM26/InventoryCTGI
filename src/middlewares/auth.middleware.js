import jwt from "jsonwebtoken";
import dotenv  from "dotenv"

dotenv.config()

export const verifyToken = (req, res, next) => {
  console.log("Cookies recibidas:", req.cookies);

  // Intentar obtener el token de las cookies
  let token = req.cookies.token;

  // Si no hay token en las cookies, buscar en el encabezado Authorization
  if (!token && req.headers.authorization) {
    const authHeader = req.headers.authorization;
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1]; // Extraer el token después de "Bearer"
    }
  }

  // Si no se encuentra el token en ninguna parte
  if (!token) {
    return res.status(403).json({ message: "Token no proporcionado" });
  }

  try {
    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Agregar los datos del usuario al request
    next();
  } catch (error) {
    res.status(401).json({ message: "Token inválido" });
  }
};

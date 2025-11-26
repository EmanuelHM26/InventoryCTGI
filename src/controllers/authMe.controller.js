import { getAuthenticatedUserService } from "../services/authMe.service.js";

export const getAuthenticatedUser = (req, res) => {
  try {
    console.log("📦 req.user completo:", req.user); // ✅ DEBUG
    
    const user = req.user; // viene del middleware verifyToken
    const authenticatedUser = getAuthenticatedUserService(user);
    
    console.log("✅ Datos enviados:", authenticatedUser); // ✅ DEBUG
    
    res.status(200).json(authenticatedUser);
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ message: "Error al obtener los datos del usuario" });
  }
};
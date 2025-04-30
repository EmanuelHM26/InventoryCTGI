import { getAuthenticatedUserService } from "../services/authMe.service.js";

export const getAuthenticatedUser = (req, res) => {
  try {
    const user = req.user; // `req.user` viene del middleware `verifyToken`
    const authenticatedUser = getAuthenticatedUserService(user);
    res.status(200).json(authenticatedUser);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los datos del usuario" });
  }
};
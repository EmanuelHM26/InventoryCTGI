export const getDashboardData = async (req, res) => {
    try {
      // Aquí puedes agregar lógica para obtener datos del inventario, asignaciones, etc.
      res.status(200).json({
        message: "Bienvenido al dashboard",
        user: req.user, // Información del usuario autenticado (si la pasas desde el middleware)
      });
    } catch (error) {
      console.error("Error al cargar el dashboard:", error);
      res.status(500).json({ message: "Error al cargar el dashboard", error });
    }
};
import { getEstadisticasInicioService } from "../services/estadisticasInicio.service.js";

export const getEstadisticasInicioController = async (req, res) => {
  try {
    const estadisticas = await getEstadisticasInicioService();
    
    // Agregar timestamp para debugging
    const response = {
      ...estadisticas,
      timestamp: new Date().toISOString()
    };
    
    res.json(response);
  } catch (error) {
    console.error("Error en el controlador de estadísticas de inicio:", error);
    res.status(500).json({ 
      message: "Error al obtener estadísticas de inicio.",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
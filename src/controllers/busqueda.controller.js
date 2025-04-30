import { searchGlobalService } from '../services/busqueda.service.js';

// Controlador para manejar la búsqueda global
export const searchGlobal = async (req, res) => {
  try {
    const { term } = req.query;
    
    if (!term) {
      return res.status(200).json({
        success: true,
        data: {
          usuarios: [],
          asignaciones: []
        }
      });
    }

    const results = await searchGlobalService(term);
    
    return res.status(200).json({
      success: true,
      data: results
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
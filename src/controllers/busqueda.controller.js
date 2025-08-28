import { searchGlobalService } from '../services/busqueda.service.js';

export const searchGlobal = async (req, res) => {
  try {
    const { term } = req.query;
    
    // Validar que se proporcione un término de búsqueda
    if (!term || term.trim() === '') {
      return res.status(200).json({
        success: true,
        message: 'Término de búsqueda vacío',
        data: { usuarios: [], asignaciones: [] }
      });
    }

    // Ejecutar búsqueda en el servicio
    const resultados = await searchGlobalService(term);
    
    // Responder con resultados
    return res.status(200).json({
      success: true,
      message: 'Búsqueda completada',
      data: resultados
    });
    
  } catch (error) {
    console.error('Error en el controlador de búsqueda global:', error);
    
    // Enviar respuesta de error con estructura correcta
    return res.status(500).json({
      success: false,
      message: 'Error al procesar la búsqueda',
      error: error.message,
      data: { usuarios: [], asignaciones: [] }
    });
  }
};
import Usuario from '../models/UsuariosModel.js';
import Asignaciones from '../models/AsignacionesModel.js';
import EquiposTecnologicos from '../models/EquiposTecnologicosModel.js';
import ProductosConsumibles from '../models/ProductosConsumiblesModel.js';

export const getEstadisticasInicioService = async () => {
  try {
    // Ejecutar todas las consultas en paralelo para mejor rendimiento
    const [
      totalUsuarios,
      totalAsignaciones,
      totalEquiposTecnologicos,
      totalProductosConsumibles
    ] = await Promise.all([
      Usuario.count(),
      Asignaciones.count(),
      EquiposTecnologicos.count(),
      ProductosConsumibles.count()
    ]);

    return {
      totalUsuarios,
      totalAsignaciones,
      totalEquiposTecnologicos,
      totalProductosConsumibles
    };
  } catch (error) {
    throw new Error('No se pudieron obtener las estadísticas: ' + error.message);
  }
}
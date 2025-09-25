import Usuario from '../models/UsuariosModel.js';
import Asignaciones from '../models/AsignacionesModel.js';
import ProductosConsumibles from '../models/ProductosConsumiblesModel.js';
import MovimientosConsumibles from '../models/MovimientosConsumiblesModel.js';

import { setupUsuarioAssociations } from '../models/UsuariosModel.js';
import { setupAsignacionesAssociations } from '../models/AsignacionesModel.js';
import { setupProductosConsumiblesAssociations } from '../models/ProductosConsumiblesModel.js';
import { setupMovimientosConsumiblesAssociations } from '../models/MovimientosConsumiblesModel.js';

// Objeto con todos los modelos
const models = {
  Usuario,
  Asignaciones,
  ProductosConsumibles,
  MovimientosConsumibles
};

// Configurar todas las asociaciones después de que todos los modelos estén definidos
const setupAssociations = () => {
  setupUsuarioAssociations(models);
  setupAsignacionesAssociations(models);
  setupProductosConsumiblesAssociations(models);
  setupMovimientosConsumiblesAssociations(models);
};

// Ejecutar la configuración de asociaciones
setupAssociations();

export {
  Usuario,
  Asignaciones,
  ProductosConsumibles,
  MovimientosConsumibles
};

export default models;
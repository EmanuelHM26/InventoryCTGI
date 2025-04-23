import Usuario from '../models/UsuariosModel.js';
import Asignaciones from '../models/AsignacionesModel.js';
import DetalleAsignacion from '../models/DetalleAsignacionModel.js';
import Item from '../models/ItemModel.js';  // Importa el nuevo modelo Item
import { setupUsuarioAssociations } from '../models/UsuariosModel.js';
import { setupAsignacionesAssociations } from '../models/AsignacionesModel.js';
import { setupDetalleAsignacionAssociations } from '../models/DetalleAsignacionModel.js';
import { setupItemAssociations } from '../models/ItemModel.js';  // Importa la función de asociación

// Objeto con todos los modelos
const models = {
  Usuario,
  Asignaciones,
  DetalleAsignacion,
  Item  // Añade el modelo Item al objeto
};

// Configurar todas las asociaciones después de que todos los modelos estén definidos
const setupAssociations = () => {
  setupUsuarioAssociations(models);
  setupAsignacionesAssociations(models);
  setupDetalleAsignacionAssociations(models);
  setupItemAssociations(models);  // Ejecuta la función de asociación de Item
};

// Ejecutar la configuración de asociaciones
setupAssociations();

export {
  Usuario,
  Asignaciones,
  DetalleAsignacion,
  Item  // Exporta el nuevo modelo
};

export default models;
import Usuario from '../models/UsuariosModel.js';
import Asignaciones from '../models/AsignacionesModel.js';
import { setupUsuarioAssociations } from '../models/UsuariosModel.js';
import { setupAsignacionesAssociations } from '../models/AsignacionesModel.js';

// Objeto con todos los modelos
const models = {
  Usuario,
  Asignaciones
};

// Configurar todas las asociaciones después de que todos los modelos estén definidos
const setupAssociations = () => {
  setupUsuarioAssociations(models);
  setupAsignacionesAssociations(models)
};

// Ejecutar la configuración de asociaciones
setupAssociations();

export {
  Usuario,
  Asignaciones
};

export default models;
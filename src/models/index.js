import RegistroLogin from '../models/LoginModel.js';
import Password from '../models/PasswordModel.js';
import RolModel from '../models/RolModel.js';
import EstadoModel from '../models/EstadoModel.js';
import GrupoModel from '../models/GrupoModel.js';
import VerificacionTokenModel from '../models/VerificacionTokenModel.js';
import ResetTokenModel from '../models/ResetTokenModel.js';

// models/index.js
import Usuario from '../models/UsuariosModel.js';
import Asignaciones from '../models/AsignacionesModel.js';
import ProductosConsumibles from '../models/ProductosConsumiblesModel.js';
import MovimientosConsumibles from '../models/MovimientosConsumiblesModel.js';

import EquiposTecnologicos from '../models/EquiposTecnologicosModel.js';
import Ambientes from '../models/AmbientesModel.js';
import ReservasDiarias from '../models/ReservasDiariasModel.js';
import ReservasFijas from '../models/ReservasFijasModel.js';


import { setupUsuarioAssociations } from '../models/UsuariosModel.js';
import { setupAsignacionesAssociations } from '../models/AsignacionesModel.js';
import { setupProductosConsumiblesAssociations } from '../models/ProductosConsumiblesModel.js';
import { setupMovimientosConsumiblesAssociations } from '../models/MovimientosConsumiblesModel.js';

// Objeto con todos los modelos
const models = {
  RegistroLogin,
  Password,
  RolModel,
  EstadoModel,
  GrupoModel,
  VerificacionTokenModel,
  ResetTokenModel,
  Usuario,
  Asignaciones,
  ProductosConsumibles,
  MovimientosConsumibles,
  EquiposTecnologicos,
  Ambientes,
  ReservasDiarias,
  ReservasFijas
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

export default models;

export {
  RegistroLogin,
  Password,
  RolModel,
  EstadoModel,
  Usuario,
  Asignaciones,
  ProductosConsumibles,
  MovimientosConsumibles,
  EquiposTecnologicos,
  Ambientes,
  ReservasDiarias,
  ReservasFijas
};

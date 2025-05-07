import Usuario from '../models/UsuariosModel.js';
import Asignaciones from '../models/AsignacionesModel.js';
import EquiposTecnologicos from '../models/EquiposTecnologicosModel.js';
import ProductosConsumibles from '../models/ProductosConsumiblesModel.js';

// Contar usuarios
export const countUsuarios = async () => {
  return await Usuario.count();
};

// Contar asignaciones
export const countAsignaciones = async () => {
  return await Asignaciones.count();
};

// Contar equipos tecnológicos
export const countEquipos = async () => {
  return await EquiposTecnologicos.count();
};

// Contar productos consumibles
export const countProductos = async () => {
  return await ProductosConsumibles.count();
};
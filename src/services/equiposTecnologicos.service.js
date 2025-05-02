import EquiposTecnologicos from '../models/EquiposTecnologicosModel.js';

export const getAllEquiposService = async () => {
  return await EquiposTecnologicos.findAll();
};

export const getEquipoByIdService = async (id) => {
  return await EquiposTecnologicos.findByPk(id);
};

export const createEquipoService = async (data) => {
  return await EquiposTecnologicos.create(data);
};

export const updateEquipoService = async (id, data) => {
  const equipo = await EquiposTecnologicos.findByPk(id);
  if (!equipo) throw new Error('Equipo no encontrado');
  return await equipo.update(data);
};

export const deleteEquipoService = async (id) => {
  const equipo = await EquiposTecnologicos.findByPk(id);
  if (!equipo) throw new Error('Equipo no encontrado');
  return await equipo.destroy();
};
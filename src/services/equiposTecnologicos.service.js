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

// id es el número o identificador único del equipo que se va buscar.
// data son los nuevos datos que quieres cambiarle a ese equipo.
export const updateEquipoService = async (id, data) => {
  const equipo = await EquiposTecnologicos.findByPk(id);
  if (!equipo) throw new Error('Equipo no encontrado');
  return await equipo.update(data);
};


// if (!equipo) significa “si no encontré ningún equipo con ese id”.
// throw new Error('Equipo no encontrado') significa lanza un error con ese mensaje.
export const deleteEquipoService = async (id) => {
  const equipo = await EquiposTecnologicos.findByPk(id);
  if (!equipo) throw new Error('Equipo no encontrado');
  return await equipo.destroy();
};
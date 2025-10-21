import Ambientes from "../models/AmbientesModel.js";

export const getAllAmbientesService = async () => {
  return await Ambientes.findAll({
    order: [['idAmbiente', 'ASC']]
  });
};

export const getAmbienteByIdService = async (id) => {
  const ambiente = await Ambientes.findByPk(id);
  if (!ambiente) throw { status: 404, message: "Ambiente no encontrado" };
  return ambiente;
};

export const createAmbienteService = async (payload) => {
  if (payload.nombre == null || payload.nombre.toString().trim() === "") {
    throw { status: 400, message: "El nombre es obligatorio" };
  }
  return await Ambientes.create(payload);
};

export const updateAmbienteService = async (id, payload) => {
  const ambiente = await Ambientes.findByPk(id);
  if (!ambiente) throw { status: 404, message: "Ambiente no encontrado" };
  return await ambiente.update(payload);
};

export const removeAmbienteService = async (id) => {
  const ambiente = await Ambientes.findByPk(id);
  if (!ambiente) throw { status: 404, message: "Ambiente no encontrado" };
  await ambiente.destroy();
  return true;
};

export default { 
  getAll: getAllAmbientesService, 
  getById: getAmbienteByIdService, 
  create: createAmbienteService, 
  update: updateAmbienteService, 
  remove: removeAmbienteService 
};
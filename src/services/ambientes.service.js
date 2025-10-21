import AmbientesModel from "../models/AmbientesModel.js";

export const getAll = async () => {
  return await AmbientesModel.findAll();
};

export const getById = async (id) => {
  const row = await AmbientesModel.findById(id);
  if (!row) throw { status: 404, message: "Ambiente no encontrado" };
  return row;
};

export const create = async (payload) => {
  if (payload.nombre == null || payload.nombre.toString().trim() === "") {
    throw { status: 400, message: "El nombre es obligatorio" };
  }
  return await AmbientesModel.create(payload);
};

export const update = async (id, payload) => {
  const existing = await AmbientesModel.findById(id);
  if (!existing) throw { status: 404, message: "Ambiente no encontrado" };
  return await AmbientesModel.updateById(id, payload);
};

export const remove = async (id) => {
  const ok = await AmbientesModel.remove(id);
  if (!ok) throw { status: 404, message: "Ambiente no encontrado o ya eliminado" };
  return true;
};

export default { getAll, getById, create, update, remove };
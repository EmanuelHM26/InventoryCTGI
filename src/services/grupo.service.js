import Grupo from '../models/GrupoModel.js';

export const getAllGruposService = async () => {
    return await Grupo.findAll();
};

export const getGrupoByIdService = async (id) => {
    return await Grupo.findByPk(id);
};

export const createGrupoService = async (data) => {
  return await Grupo.create(data);
};

export const updateGrupoService = async (id, data) => {
    const grupo = await Grupo.findByPk(id);
    if (!grupo) throw new Error('Grupo no encontrado');
    return await grupo.update(data);
};

export const deleteGrupoService = async (id) => {
    const grupo = await Grupo.findByPk(id);
    if (!grupo) throw new Error('Grupo no encontrado');
    return await grupo.destroy();
};
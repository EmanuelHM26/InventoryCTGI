import ReservasFijas from '../models/ReservasFijasModel.js';

export const getAllReservasFijasService = async () => {
  return await ReservasFijas.findAll();
};

export const getReservaFijaByIdService = async (id) => {
  return await ReservasFijas.findByPk(id);
};

export const createReservaFijaService = async (data) => {
  return await ReservasFijas.create(data);
};

export const updateReservaFijaService = async (id, data) => {
  const reserva = await ReservasFijas.findByPk(id);
  if (!reserva) throw new Error('Reserva fija no encontrada');
  return await reserva.update(data);
};

export const deleteReservaFijaService = async (id) => {
  const reserva = await ReservasFijas.findByPk(id);
  if (!reserva) throw new Error('Reserva fija no encontrada');
  return await reserva.destroy();
};
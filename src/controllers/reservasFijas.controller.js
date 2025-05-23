import {
  getAllReservasFijasService,
  getReservaFijaByIdService,
  createReservaFijaService,
  updateReservaFijaService,
  deleteReservaFijaService,
} from '../services/reservasFijas.service.js';

// Obtener todas las reservas fijas
export const getAllReservasFijas = async (req, res) => {
  try {
    const reservas = await getAllReservasFijasService();
    res.status(200).json(reservas);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener reservas fijas' });
  }
};

// Obtener una reserva fija por ID
export const getReservaFijaById = async (req, res) => {
  try {
    const { id } = req.params;
    const reserva = await getReservaFijaByIdService(id);
    if (!reserva) return res.status(404).json({ message: 'Reserva fija no encontrada' });
    res.status(200).json(reserva);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la reserva fija' });
  }
};

// Crear una nueva reserva fija
export const createReservaFija = async (req, res) => {
  try {
    const nuevaReserva = await createReservaFijaService(req.body);
    res.status(201).json(nuevaReserva);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la reserva fija' });
  }
};

// Actualizar una reserva fija existente
export const updateReservaFija = async (req, res) => {
  try {
    const { id } = req.params;
    const reservaActualizada = await updateReservaFijaService(id, req.body);
    res.status(200).json(reservaActualizada);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la reserva fija' });
  }
};

// Eliminar una reserva fija
export const deleteReservaFija = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteReservaFijaService(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la reserva fija' });
  }
};
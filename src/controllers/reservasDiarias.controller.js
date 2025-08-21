import {
  createReservaDiariaService,
  getAllReservasDiariasService,
  getReservaDiariaByIdService,
  updateReservaDiariaService,
  deleteReservaDiariaService,
  getReservasByFechaService,
} from '../services/reservasDiarias.service.js';

// Crear una nueva reserva diaria
export const createReservaDiaria = async (req, res) => {
  try {
    const data = req.body;
    const nuevaReserva = await createReservaDiariaService(data);
    res.status(201).json(nuevaReserva);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obtener todas las reservas diarias
export const getAllReservasDiarias = async (req, res) => {
  try {
    const reservas = await getAllReservasDiariasService();
    res.status(200).json(reservas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener una reserva diaria por ID
export const getReservaDiariaById = async (req, res) => {
  try {
    const { idReservaDiaria } = req.params;
    const reserva = await getReservaDiariaByIdService(idReservaDiaria);
    res.status(200).json(reserva);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Actualizar una reserva diaria
export const updateReservaDiaria = async (req, res) => {
  try {
    const { idReservaDiaria } = req.params;
    const data = req.body;
    const reservaActualizada = await updateReservaDiariaService(idReservaDiaria, data);
    res.status(200).json(reservaActualizada);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Eliminar una reserva diaria
export const deleteReservaDiaria = async (req, res) => {
  try {
    const { idReservaDiaria } = req.params;
    const resultado = await deleteReservaDiariaService(idReservaDiaria);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Obtener reservas por fecha
export const getReservasByFecha = async (req, res) => {
  try {
    const { fecha } = req.params;
    const reservas = await getReservasByFechaService(fecha);
    res.status(200).json(reservas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
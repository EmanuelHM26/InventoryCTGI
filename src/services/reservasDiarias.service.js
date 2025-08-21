import ReservasDiarias from '../models/ReservasDiariasModel.js';
import Usuario from '../models/UsuariosModel.js';

import { Op } from 'sequelize';

// Crear una nueva reserva diaria
export const createReservaDiariaService = async (data) => {
  try {
    // Verifica que el usuario exista antes de crear la reserva
    const usuario = await Usuario.findByPk(data.IdUsuario);
    if (!usuario) {
      throw new Error("El usuario especificado no existe");
    }

    // Crea la reserva diaria
    const nuevaReserva = await ReservasDiarias.create(data);
    return nuevaReserva;
  } catch (error) {
    throw new Error(`Error al crear la reserva diaria: ${error.message}`);
  }
};

// Obtener todas las reservas diarias
export const getAllReservasDiariasService = async () => {
  try {
    const reservas = await ReservasDiarias.findAll({
      include: [
        {
          model: Usuario,
          as: "Usuario",
          attributes: ["IdUsuario", "Usuario"],
        },
      ],
      order: [['fecha', 'DESC']]
    });
    return reservas;
  } catch (error) {
    throw new Error(`Error al obtener las reservas diarias: ${error.message}`);
  }
};

// Obtener una reserva diaria por ID
export const getReservaDiariaByIdService = async (idReservaDiaria) => {
  try {
    const reserva = await ReservasDiarias.findOne({
      where: {
        idReservaDiaria: idReservaDiaria,
      },
      include: [{ model: Usuario, as: "Usuario" }], // Incluye los datos del usuario relacionado
    });
    if (!reserva) {
      throw new Error("Reserva diaria no encontrada");
    }
    return reserva;
  } catch (error) {
    throw new Error(`Error al obtener la reserva diaria: ${error.message}`);
  }
};

// Actualizar una reserva diaria
export const updateReservaDiariaService = async (idReservaDiaria, data) => {
  try {
    const reserva = await ReservasDiarias.findOne({
      where: {
        idReservaDiaria: idReservaDiaria,
      },
    });
    if (!reserva) {
      throw new Error("Reserva diaria no encontrada");
    }
    await reserva.update(data);
    return reserva;
  } catch (error) {
    throw new Error(`Error al actualizar la reserva diaria: ${error.message}`);
  }
};

// Eliminar una reserva diaria
export const deleteReservaDiariaService = async (idReservaDiaria) => {
  try {
    const reserva = await ReservasDiarias.findOne({
      where: {
        idReservaDiaria: idReservaDiaria,
      },
    });
    if (!reserva) {
      throw new Error("Reserva diaria no encontrada");
    }
    await reserva.destroy();
    return { message: "Reserva diaria eliminada correctamente" };
  } catch (error) {
    throw new Error(`Error al eliminar la reserva diaria: ${error.message}`);
  }
};



// Obtener reservas por fecha
export const getReservasByFechaService = async (fecha) => {
  try {
    const reservas = await ReservasDiarias.findAll({
      where: { fecha: fecha },
      include: [
        {
          model: Usuario,
          as: "Usuario",
          attributes: ["IdUsuario", "Usuario"],
        },
      ],
      order: [['ficha', 'ASC']]
    });
    return reservas;
  } catch (error) {
    throw new Error(`Error al obtener las reservas por fecha: ${error.message}`);
  }
};



// NO SE SI PONER ESTE CODIGO
// Verificar disponibilidad de material en una fecha específica
// export const verificarDisponibilidadService = async (materialReservado, fecha) => {
//   try {
//     const reservasExistentes = await ReservasDiarias.findAll({
//       where: {
//         materialReservado: materialReservado,
//         fecha: fecha
//       },
//       include: [
//         {
//           model: Usuario,
//           as: "Usuario",
//           attributes: ["IdUsuario", "Nombre", "Apellido"],
//         },
//       ],
//     });
    
//     return {
//       disponible: reservasExistentes.length === 0,
//       reservasExistentes: reservasExistentes
//     };
//   } catch (error) {
//     throw new Error(`Error al verificar disponibilidad: ${error.message}`);
//   }
// };
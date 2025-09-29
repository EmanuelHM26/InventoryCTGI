import { Usuario, Asignaciones } from '../models/index.js';
import { Op } from "sequelize";

// Crear una nueva asignación
export const createAsignacionService = async (data) => {
  try {
    const usuario = await Usuario.findByPk(data.IdUsuario);
    if (!usuario) {
      throw new Error("El usuario especificado no existe");
    }
    if (!data.Estado) data.Estado = 'Activo';
    const nuevaAsignacion = await Asignaciones.create(data);
    return nuevaAsignacion;
  } catch (error) {
    throw new Error(`Error al crear la asignación: ${error.message}`);
  }
};

// Obtener todas las asignaciones
export const getAllAsignacionesService = async () => {
  try {
    const asignaciones = await Asignaciones.findAll({
      include: [
        {
          model: Usuario,
          as: "Usuario",
          attributes: ["IdUsuario", "Usuario", "Nombre", "Apellido"],
        },
      ],
      order: [["IdAsignaciones", "DESC"]]
    });
    return asignaciones;
  } catch (error) {
    throw new Error(`Error al obtener las asignaciones: ${error.message}`);
  }
};

// Obtener una asignación por ID
export const getAsignacionByIdService = async (idAsignaciones) => {
  try {
    const asignacion = await Asignaciones.findOne({
      where: {
        IdAsignaciones: idAsignaciones,
      },
      include: [{
        model: Usuario,
        as: "Usuario",
        attributes: ["IdUsuario", "Usuario", "Nombre", "Apellido"]
      }],
    });
    if (!asignacion) {
      throw new Error("Asignación no encontrada");
    }
    return asignacion;
  } catch (error) {
    throw new Error(`Error al obtener la asignación: ${error.message}`);
  }
};

// Actualizar una asignación - Permite actualizar campos individualmente o todos
export const updateAsignacionService = async (idAsignaciones, data) => {
  try {
    const asignacion = await Asignaciones.findOne({
      where: {
        IdAsignaciones: idAsignaciones,
      },
    });

    if (!asignacion) {
      throw new Error("Asignación no encontrada");
    }

    // Verificar que el usuario existe solo si se está actualizando el IdUsuario
    if (data.IdUsuario && data.IdUsuario !== asignacion.IdUsuario) {
      const usuario = await Usuario.findByPk(data.IdUsuario);
      if (!usuario) {
        throw new Error("El usuario especificado no existe");
      }
    }

    // Crear objeto con solo los campos que se van a actualizar (no vacíos/null/undefined)
    const camposActualizar = {};

    Object.keys(data).forEach(key => {
      if (data[key] !== undefined && data[key] !== null && data[key] !== '') {
        camposActualizar[key] = data[key];
      }
    });

    // Si no hay campos para actualizar, retornar la asignación actual
    if (Object.keys(camposActualizar).length === 0) {
      throw new Error("No se proporcionaron campos válidos para actualizar");
    }

    // Actualizar solo los campos proporcionados
    await asignacion.update(camposActualizar);

    // Retornar la asignación actualizada con los datos del usuario
    const asignacionActualizada = await Asignaciones.findOne({
      where: {
        IdAsignaciones: idAsignaciones,
      },
      include: [{
        model: Usuario,
        as: "Usuario",
        attributes: ["IdUsuario", "Usuario", "Nombre", "Apellido"]
      }],
    });

    return asignacionActualizada;
  } catch (error) {
    throw new Error(`Error al actualizar la asignación: ${error.message}`);
  }
};

// Eliminar una asignación
export const deleteAsignacionService = async (idAsignaciones) => {
  try {
    const asignacion = await Asignaciones.findOne({
      where: {
        IdAsignaciones: idAsignaciones,
      },
    });
    if (!asignacion) {
      throw new Error("Asignación no encontrada");
    }
    await asignacion.destroy();
    return { message: "Asignación eliminada correctamente" };
  } catch (error) {
    throw new Error(`Error al eliminar la asignación: ${error.message}`);
  }
};

// Obtener asignaciones recientes por días
export const getAsignacionesByDaysService = async (days = 7) => {
  try {
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() - parseInt(days));

    const asignaciones = await Asignaciones.findAll({
      where: {
        FechaAsignacion: {
          [Op.gte]: fechaLimite
        }
      },
      order: [["FechaAsignacion", "DESC"]],
      limit: 20,
      include: [
        {
          model: Usuario,
          as: "Usuario",
          attributes: ["IdUsuario", "Usuario", "Nombre", "Apellido"],
        },
      ],
    });
    return asignaciones;
  } catch (error) {
    throw new Error(`Error al obtener las asignaciones recientes: ${error.message}`);
  }
};



// new Date(): crea la fecha actual.
// getDate(): obtiene el día del mes actual.
// setDate(actual - days): resta los días indicados.
// Ejemplo: si hoy es 28 sep 2025 y days = 7, fechaLimite será 21 sep 2025.

//[Op.gte] = “greater than or equal” (mayor o igual que).
//order = Ordena resultados por fecha de asignación, de más reciente a más antigua


//Confirmar una asignación


//Confirmar una asignación - VERSIÓN CORREGIDA
export const confirmarDevolucionService = async (idAsignaciones, { FechaDevolucion, HoraDevolucion, Novedad }) => {
  try {
    const asignacion = await Asignaciones.findOne({
      where: {
        IdAsignaciones: idAsignaciones,
      },
    });

    if (!asignacion) {
      throw new Error("Asignación no encontrada");
    }

    if (asignacion.Estado === 'Inactivo') {
      throw new Error("Esta asignación ya ha sido devuelta");
    }

    await asignacion.update({
      FechaDevolucion,
      HoraDevolucion,
      Estado: 'Inactivo',
      Novedad: Novedad || null
    });

    // Retornar la asignación actualizada con los datos del usuario
    const asignacionActualizada = await Asignaciones.findOne({
      where: {
        IdAsignaciones: idAsignaciones,
      },
      include: [{
        model: Usuario,
        as: "Usuario",
        attributes: ["IdUsuario", "Usuario", "Nombre", "Apellido"]
      }],
    });

    return asignacionActualizada;
  } catch (error) {
    throw new Error(`Error al confirmar la devolución: ${error.message}`);
  }
};
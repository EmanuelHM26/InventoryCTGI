import { Usuario, Asignaciones } from '../models/index.js';

// Crear una nueva asignación
export const createAsignacionService = async (data) => {
  try {
    const usuario = await Usuario.findByPk(data.IdUsuario);
    if (!usuario) throw new Error("El usuario especificado no existe");
    if (!data.Estado) data.Estado = 'Activo'; // Valor por defecto si no viene del frontend
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
          attributes: ["IdUsuario", "Nombre", "Apellido"],
        },
      ],
    });
    return asignaciones;
  } catch (error) {
    throw new Error(`Error al obtener las asignaciones: ${error.message}`);
  }
};

// Obtener una asignación por ID
export const getAsignacionByIdService = async (
  idAsignaciones,
  fechaAsignacion
) => {
  try {
    const asignacion = await Asignaciones.findOne({
      where: {
        IdAsignaciones: idAsignaciones,
        FechaAsignacion: fechaAsignacion,
      },
      include: [{ model: Usuario, as: "Usuario" }], // Incluye los datos del usuario relacionado
    });
    if (!asignacion) {
      throw new Error("Asignación no encontrada");
    }
    return asignacion;
  } catch (error) {
    throw new Error(`Error al obtener la asignación: ${error.message}`);
  }
};

// Actualizar una asignación
export const updateAsignacionService = async (
  idAsignaciones,
  fechaAsignacion,
  data
) => {
  try {
    const asignacion = await Asignaciones.findOne({
      where: {
        IdAsignaciones: idAsignaciones,
        FechaAsignacion: fechaAsignacion,
      },
    });
    if (!asignacion) throw new Error("Asignación no encontrada");
    await asignacion.update(data);
    return asignacion;
  } catch (error) {
    throw new Error(`Error al actualizar la asignación: ${error.message}`);
  }
};

// Eliminar una asignación
export const deleteAsignacionService = async (
  idAsignaciones,
  fechaAsignacion
) => {
  try {
    const asignacion = await Asignaciones.findOne({
      where: {
        IdAsignaciones: idAsignaciones,
        FechaAsignacion: fechaAsignacion,
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

// Obtener asignaciones recientes

export const getRecentAsignacionesService = async () => {
  try {
    const asignaciones = await Asignaciones.findAll({
      order: [["FechaAsignacion", "DESC"]],
      limit: 6,
      include: [
        {
          model: Usuario,
          as: "Usuario",
          attributes: ["IdUsuario", "Nombre", "Apellido"],
        },
      ],
    });
    return asignaciones;
  } catch (error) {
    throw new Error(`Error al obtener las asignaciones recientes: ${error.message}`);
  }
}

import { Asignaciones, DetalleAsignacion, Item } from "../models/index.js";

// Crear un nuevo detalle de asignación
export const createDetalleAsignacionService = async (data) => {
  try {
    // Verificar que la asignación exista
    const asignacion = await Asignaciones.findByPk(data.IdAsignaciones);
    if (!asignacion) {
      throw new Error("La asignación especificada no existe");
    }

    // Verificar que el ítem exista
    const item = await Item.findByPk(data.IdItem);
    if (!item) {
      throw new Error("El ítem especificado no existe");
    }

    // Crear el detalle de asignación
    const nuevoDetalle = await DetalleAsignacion.create(data);
    return nuevoDetalle;
  } catch (error) {
    throw new Error(
      `Error al crear el detalle de asignación: ${error.message}`
    );
  }
};

// Obtener todos los detalles de asignación
export const getAllDetallesAsignacionService = async () => {
  try {
    const detalles = await DetalleAsignacion.findAll({
      include: [
        {
          model: Asignaciones,
          as: "Asignacion",
        },
        {
          model: Item,
          as: "Item",
        },
      ],
    });
    return detalles;
  } catch (error) {
    throw new Error(
      `Error al obtener los detalles de asignación: ${error.message}`
    );
  }
};

// Obtener un detalle de asignación por ID
export const getDetalleAsignacionByIdService = async (id) => {
  try {
    const detalle = await DetalleAsignacion.findByPk(id, {
      include: [
        {
          model: Asignaciones,
          as: "Asignacion",
        },
        {
          model: Item,
          as: "Item",
        },
      ],
    });

    if (!detalle) {
      throw new Error("Detalle de asignación no encontrado");
    }

    return detalle;
  } catch (error) {
    throw new Error(
      `Error al obtener el detalle de asignación: ${error.message}`
    );
  }
};

// Obtener todos los detalles asociados a una asignación específica
export const getDetallesByAsignacionIdService = async (idAsignacion) => {
  try {
    const detalles = await DetalleAsignacion.findAll({
      where: {
        IdAsignaciones: idAsignacion,
      },
      include: [
        {
          model: Item,
          as: "Item",
          attributes: ["IdItem", "Nombre", "TipoItem"], // Asegúrate de que estos campos existan en tu modelo Item
        },
      ],
    });

    console.log("Detalles encontrados:", JSON.stringify(detalles, null, 2)); // Log para depuración

    return detalles;
  } catch (error) {
    console.error("Error en getDetallesByAsignacionIdService:", error);
    throw new Error(
      `Error al obtener los detalles de la asignación: ${error.message}`
    );
  }
};

// Actualizar un detalle de asignación
export const updateDetalleAsignacionService = async (id, data) => {
  try {
    const detalle = await DetalleAsignacion.findByPk(id);

    if (!detalle) {
      throw new Error("Detalle de asignación no encontrado");
    }

    // Si se cambia el IdAsignaciones o IdItem, verificar que existan
    if (data.IdAsignaciones && data.IdAsignaciones !== detalle.IdAsignaciones) {
      const asignacion = await Asignaciones.findByPk(data.IdAsignaciones);
      if (!asignacion) {
        throw new Error("La asignación especificada no existe");
      }
    }

    if (data.IdItem && data.IdItem !== detalle.IdItem) {
      const item = await Item.findByPk(data.IdItem);
      if (!item) {
        throw new Error("El ítem especificado no existe");
      }
    }

    // Actualizar el detalle
    await detalle.update(data);
    return detalle;
  } catch (error) {
    throw new Error(
      `Error al actualizar el detalle de asignación: ${error.message}`
    );
  }
};

// Eliminar un detalle de asignación
export const deleteDetalleAsignacionService = async (id) => {
  try {
    const detalle = await DetalleAsignacion.findByPk(id);

    if (!detalle) {
      throw new Error("Detalle de asignación no encontrado");
    }

    await detalle.destroy();
    return { message: "Detalle de asignación eliminado correctamente" };
  } catch (error) {
    throw new Error(
      `Error al eliminar el detalle de asignación: ${error.message}`
    );
  }
};

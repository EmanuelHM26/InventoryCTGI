// movimientosConsumibles.service.js (ajustado)
import { MovimientosConsumibles, ProductosConsumibles } from "../models/index.js";
import sequelize from "../config/database.js";
import { Op } from 'sequelize'; 

export const registrarMovimiento = async (movimientoData) => {
  const transaction = await sequelize.transaction();

  try {
    // 1. Actualizar la cantidad disponible del producto
    const producto = await ProductosConsumibles.findByPk(
      movimientoData.IdProductoConsumible,
      { transaction }
    );

    if (!producto) {
      throw new Error("Producto no encontrado");
    }

    // Convertir a número para asegurar operaciones matemáticas
    const cantidad = parseInt(movimientoData.Cantidad);
    const cantidadActual = parseInt(producto.CantidadDisponible);

    if (movimientoData.TipoMovimiento === "entrada") {
      producto.CantidadDisponible = cantidadActual + cantidad;
    } else if (movimientoData.TipoMovimiento === "salida") {
      if (cantidadActual < cantidad) {
        throw new Error("Cantidad insuficiente en inventario");
      }
      producto.CantidadDisponible = cantidadActual - cantidad;
    } else if (movimientoData.TipoMovimiento === "ajuste") {
      producto.CantidadDisponible = cantidad;
    }

    await producto.save({ transaction });

    // 2. Registrar el movimiento
    const movimiento = await MovimientosConsumibles.create(
      {
        IdProductoConsumible: movimientoData.IdProductoConsumible,
        TipoMovimiento: movimientoData.TipoMovimiento,
        Cantidad: cantidad,
        Motivo: movimientoData.Motivo,
        Usuario: movimientoData.Usuario,
      },
      { transaction }
    );

    await transaction.commit();
    return movimiento;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const obtenerMovimientosPorProducto = async (
  idProducto,
  options = {}
) => {
  const { limit, offset } = options;

  return await MovimientosConsumibles.findAndCountAll({
    where: { IdProductoConsumible: idProducto },
    order: [["FechaMovimiento", "DESC"]],
    include: [
      {
        model: ProductosConsumibles,
        attributes: ["Nombre"],
      },
    ],
    limit,
    offset,
  });
};

export const obtenerHistorialMovimientos = async (filtros = {}) => {
  const { limit, offset, ...whereFilters } = filtros;
  const whereClause = {};

  if (whereFilters.IdProductoConsumible) {
    whereClause.IdProductoConsumible = whereFilters.IdProductoConsumible;
  }

  if (whereFilters.TipoMovimiento) {
    whereClause.TipoMovimiento = whereFilters.TipoMovimiento;
  }

  if (whereFilters.Usuario) {
    whereClause.Usuario = whereFilters.Usuario;
  }

  if (whereFilters.fechaInicio && whereFilters.fechaFin) {
    whereClause.FechaMovimiento = {
      [Op.between]: [whereFilters.fechaInicio, whereFilters.fechaFin],
    };
  }

  return await MovimientosConsumibles.findAndCountAll({
    where: whereClause,
    order: [["FechaMovimiento", "DESC"]],
    include: [
      {
        model: ProductosConsumibles,
        attributes: ["Nombre"],
      },
    ],
    limit: limit ? parseInt(limit) : undefined,
    offset: offset ? parseInt(offset) : undefined,
  });
};

// Obtener estadísticas de movimientos
export const obtenerEstadisticasMovimientos = async () => {
  const estadisticas = await MovimientosConsumibles.findAll({
    attributes: [
      "TipoMovimiento",
      [
        sequelize.fn("COUNT", sequelize.col("IdMovimiento")),
        "totalMovimientos",
      ],
      [sequelize.fn("SUM", sequelize.col("Cantidad")), "totalCantidad"],
    ],
    group: ["TipoMovimiento"],
  });

  return estadisticas;
};

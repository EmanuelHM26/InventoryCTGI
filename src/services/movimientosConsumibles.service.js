// movimientosConsumibles.service.js (ajustado)

// Importa los modelos necesarios y la instancia de la base de datos
import { MovimientosConsumibles, ProductosConsumibles } from "../models/index.js";
import sequelize from "../config/database.js";
import { Op } from 'sequelize'; 

/**
 * Registra un movimiento de consumible (entrada, salida o ajuste) y actualiza la cantidad disponible del producto.
 * Utiliza una transacción para asegurar la integridad de los datos.
 * Datos del movimiento a registrar
 * Movimiento registrado
 */
export const registrarMovimiento = async (movimientoData) => {
  //Permite agrupar varias operaciones de la BD y se asegura que todas se completen correctamente
  const transaction = await sequelize.transaction(); 

  try {
    // 1. Buscar el producto a modificar
    const producto = await ProductosConsumibles.findByPk(
      movimientoData.IdProductoConsumible,
      { transaction }
    );

    // Si el producto no existe, lanzar error
    if (!producto) {
      throw new Error("Producto no encontrado");
    }

    // Convertir cantidades a número para evitar errores de tipo
    const cantidad = parseInt(movimientoData.Cantidad);
    const cantidadActual = parseInt(producto.CantidadDisponible);

    // Actualizar la cantidad disponible según el tipo de movimiento
    if (movimientoData.TipoMovimiento === "entrada") {
      // Suma la cantidad al inventario
      producto.CantidadDisponible = cantidadActual + cantidad;
    } else if (movimientoData.TipoMovimiento === "salida") {
      // Resta la cantidad del inventario, validando que haya suficiente
      if (cantidadActual < cantidad) {
        throw new Error("Cantidad insuficiente en inventario");
      }
      producto.CantidadDisponible = cantidadActual - cantidad;
    } else if (movimientoData.TipoMovimiento === "ajuste") {
      // Ajusta la cantidad disponible a un valor específico
      producto.CantidadDisponible = cantidad;
    }

    // Guardar los cambios en el producto dentro de la transacción
    await producto.save({ transaction });

    // 2. Registrar el movimiento en la tabla de movimientos
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

    // Confirmar la transacción si todo salió bien
    await transaction.commit();
    return movimiento;
  } catch (error) {
    // Revertir la transacción en caso de error
    await transaction.rollback();
    throw error;
  }
};

/**
 * Obtiene los movimientos registrados para un producto específico, con paginación opcional.
 * ID del producto consumible
 * Opciones de paginación (limit, offset)
 * Movimientos encontrados y total
 */
export const obtenerMovimientosPorProducto = async (
  idProducto,
  options = {}
) => {
  const { limit, offset } = options;

  return await MovimientosConsumibles.findAndCountAll({
    where: { IdProductoConsumible: idProducto },
    order: [["FechaMovimiento", "DESC"]], // Ordena del más reciente al más antiguo
    include: [
      {
        model: ProductosConsumibles,
        attributes: ["Nombre"], // Solo trae el nombre del producto
      },
    ],
    limit,
    offset,
  });
};

/**
 * Obtiene el historial de movimientos filtrando por producto, tipo, usuario y rango de fechas.
 * Permite paginación.
 * Filtros de búsqueda y paginación
 * Movimientos encontrados y total
 */
export const obtenerHistorialMovimientos = async (filtros = {}) => {
  const { limit, offset, ...whereFilters } = filtros; // Extrae limit y offset, ...whereFilters extrae las demás propiedades que trae filtros
  const whereClause = {}; // 

  // Filtro por producto
  if (whereFilters.IdProductoConsumible) {
    whereClause.IdProductoConsumible = whereFilters.IdProductoConsumible;
  }

  // Filtro por tipo de movimiento
  if (whereFilters.TipoMovimiento) {
    whereClause.TipoMovimiento = whereFilters.TipoMovimiento;
  }

  // Filtro por usuario
  if (whereFilters.Usuario) {
    whereClause.Usuario = whereFilters.Usuario;
  }

  // Filtro por rango de fechas
  if (whereFilters.fechaInicio && whereFilters.fechaFin) {
    whereClause.FechaMovimiento = {
      [Op.between]: [whereFilters.fechaInicio, whereFilters.fechaFin],
    };
  }

  return await MovimientosConsumibles.findAndCountAll({
    where: whereClause,
    order: [["FechaMovimiento", "DESC"]], // Ordena del más reciente al más antiguo
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

/**
 * Obtiene estadísticas agrupadas por tipo de movimiento (entrada, salida, ajuste),
 * incluyendo el total de movimientos y la suma de cantidades por tipo.
 *  Estadísticas por tipo de movimiento
 */
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

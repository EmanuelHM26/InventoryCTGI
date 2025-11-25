import { Usuario, Asignaciones, AsignacionesEquiposDetalles, AsignacionesConsumiblesDetalles, ProductosConsumibles } from '../models/index.js';
import { Op } from "sequelize";
import { registrarMovimiento } from './movimientosConsumibles.service.js';

// Crear una nueva asignación
export const createAsignacionService = async (data) => {
  try {
    const usuario = await Usuario.findByPk(data.IdUsuario);
    if (!usuario) {
      throw new Error("El usuario especificado no existe");
    }
    if (!data.Estado) data.Estado = 'Activo';
    
    // Validar que si es Equipo Tecnológico, el ambiente sea obligatorio
    if (data.Item === 'Equipo Tecnologico' && (!data.Ambiente || !data.CodigoAmbiente)) {
      throw new Error("El ambiente es obligatorio para equipos tecnológicos");
    }

    // Si es Producto Consumible, el ambiente puede ser opcional (null)
    if (data.Item === 'Producto Consumible') {
      data.Ambiente = data.Ambiente || null;
      data.CodigoAmbiente = data.CodigoAmbiente || null;
    }
    
    // Crear la asignación
    const nuevaAsignacion = await Asignaciones.create(data);
    
    // Si hay detalles de equipos, crearlos
    if (data.Item === 'Equipo Tecnologico' && data.DetallesEquipos && Array.isArray(data.DetallesEquipos) && data.DetallesEquipos.length > 0) {
      const detallesEquipos = data.DetallesEquipos.map(detalle => ({
        IdAsignacion: nuevaAsignacion.IdAsignaciones,
        CodigoEquipo: detalle.CodigoEquipo,
        ObservacionInicial: detalle.ObservacionInicial || null,
      }));
      
      await AsignacionesEquiposDetalles.bulkCreate(detallesEquipos);
    }
    
    // Si hay detalles de consumibles, crearlos y registrar movimientos
    if (data.Item === 'Producto Consumible' && data.DetallesConsumibles && Array.isArray(data.DetallesConsumibles) && data.DetallesConsumibles.length > 0) {
      for (const detalle of data.DetallesConsumibles) {
        // Verificar stock disponible
        const producto = await ProductosConsumibles.findByPk(detalle.IdProductoConsumible);
        if (!producto) {
          throw new Error(`Producto con ID ${detalle.IdProductoConsumible} no encontrado`);
        }
        
        if (producto.CantidadDisponible < detalle.CantidadAsignada) {
          throw new Error(`Stock insuficiente para ${producto.Nombre}. Disponible: ${producto.CantidadDisponible}, Solicitado: ${detalle.CantidadAsignada}`);
        }

        // Crear el detalle de consumible
        await AsignacionesConsumiblesDetalles.create({
          IdAsignacion: nuevaAsignacion.IdAsignaciones,
          IdProductoConsumible: detalle.IdProductoConsumible,
          CantidadAsignada: detalle.CantidadAsignada,
          ObservacionInicial: detalle.ObservacionInicial || null,
        });

        // Registrar movimiento de salida
        await registrarMovimiento({
          IdProductoConsumible: detalle.IdProductoConsumible,
          TipoMovimiento: 'salida',
          Cantidad: detalle.CantidadAsignada,
          Motivo: `Asignación #${nuevaAsignacion.IdAsignaciones} a ${data.Nombre} ${data.Apellido}`,
          Usuario: 'Sistema'
        });
      }
    }
    
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
        {
          model: AsignacionesEquiposDetalles,
          as: "DetallesEquipos",
          attributes: ["IdDetalle", "CodigoEquipo", "ObservacionInicial", "NovedadDevolucion"],
        },
        {
          model: AsignacionesConsumiblesDetalles,
          as: "DetallesConsumibles",
          attributes: ["IdDetalle", "IdProductoConsumible", "CantidadAsignada", "CantidadDevuelta", "ObservacionInicial", "NovedadDevolucion"],
          include: [
            {
              model: ProductosConsumibles,
              as: "ProductoConsumible",
              attributes: ["IdProductosConsumibles", "Nombre", "UnidadMedida", "ValorMedida"]
            }
          ]
        }
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
      include: [
        {
          model: Usuario,
          as: "Usuario",
          attributes: ["IdUsuario", "Nombre", "Apellido"]
        },
        {
          model: AsignacionesEquiposDetalles,
          as: "DetallesEquipos",
          attributes: ["IdDetalle", "CodigoEquipo", "ObservacionInicial", "NovedadDevolucion"],
        },
        {
          model: AsignacionesConsumiblesDetalles,
          as: "DetallesConsumibles",
          attributes: ["IdDetalle", "IdProductoConsumible", "CantidadAsignada", "CantidadDevuelta", "ObservacionInicial", "NovedadDevolucion"],
          include: [
            {
              model: ProductosConsumibles,
              as: "ProductoConsumible",
              attributes: ["IdProductosConsumibles", "Nombre", "UnidadMedida", "ValorMedida"]
            }
          ]
        }
      ],
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

    // Si hay detalles de equipos para actualizar
    if (data.DetallesEquipos && Array.isArray(data.DetallesEquipos)) {
      for (const detalle of data.DetallesEquipos) {
        if (detalle.IdDetalle) {
          await AsignacionesEquiposDetalles.update(
            {
              ObservacionInicial: detalle.ObservacionInicial || null,
              NovedadDevolucion: detalle.NovedadDevolucion || null,
            },
            {
              where: { IdDetalle: detalle.IdDetalle }
            }
          );
        }
      }
    }

    // Si hay detalles de consumibles para actualizar
    if (data.DetallesConsumibles && Array.isArray(data.DetallesConsumibles)) {
      for (const detalle of data.DetallesConsumibles) {
        if (detalle.IdDetalle) {
          await AsignacionesConsumiblesDetalles.update(
            {
              ObservacionInicial: detalle.ObservacionInicial || null,
              NovedadDevolucion: detalle.NovedadDevolucion || null,
              CantidadDevuelta: detalle.CantidadDevuelta || null,
            },
            {
              where: { IdDetalle: detalle.IdDetalle }
            }
          );
        }
      }
    }

    // Retornar la asignación actualizada con los datos del usuario
    const asignacionActualizada = await Asignaciones.findOne({
      where: {
        IdAsignaciones: idAsignaciones,
      },
      include: [
        {
          model: Usuario,
          as: "Usuario",
          attributes: ["IdUsuario", "Nombre", "Apellido"]
        },
        {
          model: AsignacionesEquiposDetalles,
          as: "DetallesEquipos",
          attributes: ["IdDetalle", "CodigoEquipo", "ObservacionInicial", "NovedadDevolucion"],
        },
        {
          model: AsignacionesConsumiblesDetalles,
          as: "DetallesConsumibles",
          attributes: ["IdDetalle", "IdProductoConsumible", "CantidadAsignada", "CantidadDevuelta", "ObservacionInicial", "NovedadDevolucion"],
          include: [
            {
              model: ProductosConsumibles,
              as: "ProductoConsumible",
              attributes: ["IdProductosConsumibles", "Nombre"]
            }
          ]
        }
      ],
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
      include: [
        {
          model: AsignacionesConsumiblesDetalles,
          as: "DetallesConsumibles",
        }
      ]
    });

    if (!asignacion) {
      throw new Error("Asignación no encontrada");
    }

    // Si la asignación tiene consumibles y está activa, devolver el stock
    if (asignacion.Item === 'Producto Consumible' && asignacion.Estado === 'Activo' && asignacion.DetallesConsumibles) {
      for (const detalle of asignacion.DetallesConsumibles) {
        await registrarMovimiento({
          IdProductoConsumible: detalle.IdProductoConsumible,
          TipoMovimiento: 'entrada',
          Cantidad: detalle.CantidadAsignada,
          Motivo: `Eliminación de asignación #${idAsignaciones} - devolución automática`,
          Usuario: 'Sistema'
        });
      }
    }

    // Los detalles se eliminan automáticamente por el CASCADE
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
          attributes: ["IdUsuario", "Nombre", "Apellido"],
        },
        {
          model: AsignacionesEquiposDetalles,
          as: "DetallesEquipos",
          attributes: ["IdDetalle", "CodigoEquipo", "ObservacionInicial", "NovedadDevolucion"],
        },
        {
          model: AsignacionesConsumiblesDetalles,
          as: "DetallesConsumibles",
          attributes: ["IdDetalle", "IdProductoConsumible", "CantidadAsignada", "CantidadDevuelta", "ObservacionInicial", "NovedadDevolucion"],
          include: [
            {
              model: ProductosConsumibles,
              as: "ProductoConsumible",
              attributes: ["IdProductosConsumibles", "Nombre"]
            }
          ]
        }
      ],
    });
    return asignaciones;
  } catch (error) {
    throw new Error(`Error al obtener las asignaciones recientes: ${error.message}`);
  }
};

// Confirmar devolución con novedades por equipo o consumible
export const confirmarDevolucionService = async (idAsignaciones, { FechaDevolucion, HoraDevolucion, Novedad, DetallesEquipos, DetallesConsumibles }) => {
  try {
    const asignacion = await Asignaciones.findOne({
      where: {
        IdAsignaciones: idAsignaciones,
      },
      include: [
        {
          model: AsignacionesConsumiblesDetalles,
          as: "DetallesConsumibles",
        }
      ]
    });

    if (!asignacion) {
      throw new Error("Asignación no encontrada");
    }

    if (asignacion.Estado === 'Inactivo') {
      throw new Error("Esta asignación ya ha sido devuelta");
    }

    // Actualizar la asignación principal
    await asignacion.update({
      FechaDevolucion,
      HoraDevolucion,
      Estado: 'Inactivo',
      Novedad: Novedad || null
    });

    // Actualizar las novedades de cada equipo si se proporcionaron
    if (DetallesEquipos && Array.isArray(DetallesEquipos)) {
      for (const detalle of DetallesEquipos) {
        await AsignacionesEquiposDetalles.update(
          {
            NovedadDevolucion: detalle.NovedadDevolucion || null,
          },
          {
            where: { 
              IdAsignacion: idAsignaciones,
              CodigoEquipo: detalle.CodigoEquipo 
            }
          }
        );
      }
    }

    // Procesar devolución de consumibles
    if (DetallesConsumibles && Array.isArray(DetallesConsumibles)) {
      for (const detalle of DetallesConsumibles) {
        // Actualizar el detalle con la cantidad devuelta y novedad
        await AsignacionesConsumiblesDetalles.update(
          {
            CantidadDevuelta: detalle.CantidadDevuelta,
            NovedadDevolucion: detalle.NovedadDevolucion || null,
          },
          {
            where: { 
              IdAsignacion: idAsignaciones,
              IdProductoConsumible: detalle.IdProductoConsumible 
            }
          }
        );

        // Registrar movimiento de entrada por la cantidad devuelta
        if (detalle.CantidadDevuelta > 0) {
          const producto = await ProductosConsumibles.findByPk(detalle.IdProductoConsumible);
          await registrarMovimiento({
            IdProductoConsumible: detalle.IdProductoConsumible,
            TipoMovimiento: 'entrada',
            Cantidad: detalle.CantidadDevuelta,
            Motivo: `Devolución de asignación #${idAsignaciones} - ${detalle.NovedadDevolucion || 'Sin novedad'}`,
            Usuario: 'Sistema'
          });
        }
      }
    }

    // Retornar la asignación actualizada con los datos del usuario y detalles
    const asignacionActualizada = await Asignaciones.findOne({
      where: {
        IdAsignaciones: idAsignaciones,
      },
      include: [
        {
          model: Usuario,
          as: "Usuario",
          attributes: ["IdUsuario", "Nombre", "Apellido"]
        },
        {
          model: AsignacionesEquiposDetalles,
          as: "DetallesEquipos",
          attributes: ["IdDetalle", "CodigoEquipo", "ObservacionInicial", "NovedadDevolucion"],
        },
        {
          model: AsignacionesConsumiblesDetalles,
          as: "DetallesConsumibles",
          attributes: ["IdDetalle", "IdProductoConsumible", "CantidadAsignada", "CantidadDevuelta", "ObservacionInicial", "NovedadDevolucion"],
          include: [
            {
              model: ProductosConsumibles,
              as: "ProductoConsumible",
              attributes: ["IdProductosConsumibles", "Nombre"]
            }
          ]
        }
      ],
    });

    return asignacionActualizada;
  } catch (error) {
    throw new Error(`Error al confirmar la devolución: ${error.message}`);
  }
};
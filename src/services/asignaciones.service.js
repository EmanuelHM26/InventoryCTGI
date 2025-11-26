import {
  Usuario,
  Asignaciones,
  AsignacionesEquiposDetalles,
  AsignacionesConsumiblesDetalles,
  ProductosConsumibles,
  EquiposTecnologicos,
  Ambientes, // 👈 NUEVO: Importar modelo de Ambientes
} from "../models/index.js";
import { Op } from "sequelize";
import { registrarMovimiento } from "./movimientosConsumibles.service.js";

// ==================== CONSTANTES ====================
const ESTADOS_EQUIPOS = {
  DISPONIBLE: "Disponible",
  EN_PRESTAMO: "En Préstamo",
  DANADO: "Dañado",
  MANTENIMIENTO: "En Mantenimiento",
};

// 👇 NUEVO: Constantes para estados de ambientes
const ESTADOS_AMBIENTES = {
  DISPONIBLE: "Disponible",
  EN_PRESTAMO: "En Préstamo",
  MANTENIMIENTO: "En Mantenimiento",
  FUERA_DE_SERVICIO: "Fuera de Servicio",
};

// ==================== FUNCIONES DE VALIDACIÓN ====================

/**
 * Valida que el usuario exista en la base de datos
 */
const validarUsuarioExiste = async (idUsuario) => {
  const usuario = await Usuario.findByPk(idUsuario);
  if (!usuario) {
    throw new Error("El usuario especificado no existe");
  }
  return usuario;
};

/**
 * Valida que el ambiente sea obligatorio para equipos tecnológicos
 * 👇 MODIFICADO: Ahora también valida disponibilidad del ambiente
 */
const validarAmbiente = async (data) => {
  // aplicar la validación tanto a equipos como (opcionalmente) a consumibles
  if (data.Item !== "Equipo Tecnologico") return;

  if (!data.Ambiente || !data.CodigoAmbiente) {
    throw new Error("El ambiente es obligatorio para equipos tecnológicos.");
  }

  if (
    (data.Item === "Equipo Tecnologico" ||
      data.Item === "Producto Consumible") &&
    data.CodigoAmbiente
  ) {
    const ambiente = await Ambientes.findOne({
      where: { codigo: data.CodigoAmbiente },
    });

    if (!ambiente) {
      throw new Error(
        `❌ El ambiente con código ${data.CodigoAmbiente} no existe`
      );
    }

    if (ambiente.estado !== ESTADOS_AMBIENTES.DISPONIBLE) {
      throw new Error(
        `❌ El ambiente "${data.Ambiente}" no está disponible. Estado actual: ${ambiente.estado}`
      );
    }
  }

  // Si es Producto Consumible, antes venía poniendo null; mantener si aplica
  if (data.Item === "Producto Consumible") {
    data.Ambiente = data.Ambiente || null;
    data.CodigoAmbiente = data.CodigoAmbiente || null;
  }
};
/**
 * Valida que un equipo exista, esté disponible y no esté ya asignado
 */
const validarEquipoDisponible = async (codigoEquipo) => {
  // 1. Verificar que el equipo existe
  const equipo = await EquiposTecnologicos.findOne({
    where: { Codigo: codigoEquipo },
  });

  if (!equipo) {
    throw new Error(
      `❌ El equipo con código ${codigoEquipo} no existe en el inventario`
    );
  }

  // 2. Verificar que el equipo esté disponible
  if (equipo.Estado !== ESTADOS_EQUIPOS.DISPONIBLE) {
    throw new Error(
      `❌ El equipo ${codigoEquipo} no está disponible. Estado actual: ${equipo.Estado}`
    );
  }

  // 3. Verificar que el equipo no esté ya asignado en otra asignación activa
  const asignacionActiva = await Asignaciones.findOne({
    include: [
      {
        model: AsignacionesEquiposDetalles,
        as: "DetallesEquipos",
        where: { CodigoEquipo: codigoEquipo },
      },
    ],
    where: {
      Estado: "Activo",
      Item: "Equipo Tecnologico",
    },
  });

  if (asignacionActiva) {
    throw new Error(
      `❌ El equipo ${codigoEquipo} ya está asignado a ${asignacionActiva.Nombre} ${asignacionActiva.Apellido} (Asignación #${asignacionActiva.IdAsignaciones})`
    );
  }

  return equipo;
};

/**
 * Valida que un producto consumible exista y tenga stock suficiente
 */
const validarStockConsumible = async (idProducto, cantidadSolicitada) => {
  const producto = await ProductosConsumibles.findByPk(idProducto);

  if (!producto) {
    throw new Error(`❌ Producto con ID ${idProducto} no encontrado`);
  }

  if (producto.CantidadDisponible < cantidadSolicitada) {
    throw new Error(
      `❌ Stock insuficiente para ${producto.Nombre}. Disponible: ${producto.CantidadDisponible}, Solicitado: ${cantidadSolicitada}`
    );
  }

  return producto;
};

const validarEquiposParaAsignacion = async (detallesEquipos) => {
  const errores = [];
  const codigosUnicos = new Set();

  // Validar duplicados en la misma asignación
  for (const detalle of detallesEquipos) {
    if (codigosUnicos.has(detalle.CodigoEquipo)) {
      errores.push(
        `El equipo ${detalle.CodigoEquipo} está duplicado en esta asignación`
      );
    }
    codigosUnicos.add(detalle.CodigoEquipo);
  }

  // Validar disponibilidad de cada equipo
  for (const detalle of detallesEquipos) {
    try {
      await validarEquipoDisponible(detalle.CodigoEquipo);
    } catch (error) {
      errores.push(error.message);
    }
  }

  if (errores.length > 0) {
    throw new Error(errores.join("\n"));
  }
};

// ==================== SERVICIO: CREAR ASIGNACIÓN ====================

export const createAsignacionService = async (data) => {
  try {
    // VALIDACIÓN 1: Usuario existe
    await validarUsuarioExiste(data.IdUsuario);

    // VALIDACIÓN 2: Estado por defecto
    if (!data.Estado) data.Estado = "Activo";

    // VALIDACIÓN 3: Ambiente obligatorio para equipos + disponibilidad
    // 👇 MODIFICADO: Ahora valida disponibilidad del ambiente
    await validarAmbiente(data);

    // VALIDACIÓN 4: Equipos tecnológicos - Validar disponibilidad
    if (
      data.Item === "Equipo Tecnologico" &&
      data.DetallesEquipos?.length > 0
    ) {
      console.log(`🔍 Validando ${data.DetallesEquipos.length} equipos...`);
      await validarEquiposParaAsignacion(data.DetallesEquipos);
      console.log(`✅ Todos los equipos están disponibles`);
    }

    // VALIDACIÓN 5: Productos consumibles - Validar stock
    if (
      data.Item === "Producto Consumible" &&
      data.DetallesConsumibles?.length > 0
    ) {
      console.log(
        `🔍 Validando ${data.DetallesConsumibles.length} productos consumibles...`
      );

      for (const detalle of data.DetallesConsumibles) {
        await validarStockConsumible(
          detalle.IdProductoConsumible,
          detalle.CantidadAsignada
        );
      }

      console.log(`✅ Todos los productos tienen stock suficiente`);
    }

    // ==================== CREAR ASIGNACIÓN ====================
    const nuevaAsignacion = await Asignaciones.create(data);
    console.log(
      `✅ Asignación #${nuevaAsignacion.IdAsignaciones} creada exitosamente`
    );

    // ==================== PROCESAR EQUIPOS ====================
    if (
      data.Item === "Equipo Tecnologico" &&
      data.DetallesEquipos?.length > 0
    ) {
      const detallesEquipos = data.DetallesEquipos.map((detalle) => ({
        IdAsignacion: nuevaAsignacion.IdAsignaciones,
        CodigoEquipo: detalle.CodigoEquipo,
        ObservacionInicial: detalle.ObservacionInicial || null,
      }));

      await AsignacionesEquiposDetalles.bulkCreate(detallesEquipos);

      // Actualizar estados de equipos a "En Préstamo"
      for (const detalle of data.DetallesEquipos) {
        await EquiposTecnologicos.update(
          { Estado: ESTADOS_EQUIPOS.EN_PRESTAMO },
          { where: { Codigo: detalle.CodigoEquipo } }
        );
      }

      console.log(
        `✅ ${data.DetallesEquipos.length} equipos actualizados a "En Préstamo"`
      );

      // 👇 NUEVO: Actualizar estado del ambiente a "En Préstamo"
      if (data.CodigoAmbiente) {
        await Ambientes.update(
          { estado: ESTADOS_AMBIENTES.EN_PRESTAMO },
          { where: { codigo: data.CodigoAmbiente } }
        );
        console.log(
          `✅ Ambiente "${data.Ambiente}" actualizado a "En Préstamo"`
        );
      }
    }

    // ==================== PROCESAR CONSUMIBLES ====================
    if (
      data.Item === "Producto Consumible" &&
      data.DetallesConsumibles?.length > 0
    ) {
      for (const detalle of data.DetallesConsumibles) {
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
          TipoMovimiento: "salida",
          Cantidad: detalle.CantidadAsignada,
          Motivo: `Asignación #${nuevaAsignacion.IdAsignaciones} a ${data.Nombre} ${data.Apellido}`,
          Usuario: "Sistema",
        });
      }

      console.log(
        `✅ ${data.DetallesConsumibles.length} productos consumibles procesados`
      );
    }

    return nuevaAsignacion;
  } catch (error) {
    console.error(`❌ Error al crear asignación:`, error.message);
    throw new Error(error.message);
  }
};

// ==================== SERVICIO: OBTENER TODAS LAS ASIGNACIONES ====================

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
          attributes: [
            "IdDetalle",
            "CodigoEquipo",
            "ObservacionInicial",
            "NovedadDevolucion",
          ],
        },
        {
          model: AsignacionesConsumiblesDetalles,
          as: "DetallesConsumibles",
          attributes: [
            "IdDetalle",
            "IdProductoConsumible",
            "CantidadAsignada",
            "CantidadDevuelta",
            "ObservacionInicial",
            "NovedadDevolucion",
          ],
          include: [
            {
              model: ProductosConsumibles,
              as: "ProductoConsumible",
              attributes: [
                "IdProductosConsumibles",
                "Nombre",
                "UnidadMedida",
                "ValorMedida",
              ],
            },
          ],
        },
      ],
      order: [["IdAsignaciones", "DESC"]],
    });
    return asignaciones;
  } catch (error) {
    throw new Error(`Error al obtener las asignaciones: ${error.message}`);
  }
};

// ==================== SERVICIO: OBTENER ASIGNACIÓN POR ID ====================

export const getAsignacionByIdService = async (idAsignaciones) => {
  try {
    const asignacion = await Asignaciones.findOne({
      where: { IdAsignaciones: idAsignaciones },
      include: [
        {
          model: Usuario,
          as: "Usuario",
          attributes: ["IdUsuario", "Nombre", "Apellido"],
        },
        {
          model: AsignacionesEquiposDetalles,
          as: "DetallesEquipos",
          attributes: [
            "IdDetalle",
            "CodigoEquipo",
            "ObservacionInicial",
            "NovedadDevolucion",
          ],
        },
        {
          model: AsignacionesConsumiblesDetalles,
          as: "DetallesConsumibles",
          attributes: [
            "IdDetalle",
            "IdProductoConsumible",
            "CantidadAsignada",
            "CantidadDevuelta",
            "ObservacionInicial",
            "NovedadDevolucion",
          ],
          include: [
            {
              model: ProductosConsumibles,
              as: "ProductoConsumible",
              attributes: [
                "IdProductosConsumibles",
                "Nombre",
                "UnidadMedida",
                "ValorMedida",
              ],
            },
          ],
        },
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

// ==================== SERVICIO: ACTUALIZAR ASIGNACIÓN ====================

export const updateAsignacionService = async (idAsignaciones, data) => {
  try {
    const asignacion = await Asignaciones.findOne({
      where: { IdAsignaciones: idAsignaciones },
    });

    if (!asignacion) {
      throw new Error("Asignación no encontrada");
    }

    // Verificar que el usuario existe solo si se está actualizando el IdUsuario
    if (data.IdUsuario && data.IdUsuario !== asignacion.IdUsuario) {
      await validarUsuarioExiste(data.IdUsuario);
    }

    // Crear objeto con solo los campos que se van a actualizar
    const camposActualizar = {};
    Object.keys(data).forEach((key) => {
      if (data[key] !== undefined && data[key] !== null && data[key] !== "") {
        camposActualizar[key] = data[key];
      }
    });

    if (Object.keys(camposActualizar).length === 0) {
      throw new Error("No se proporcionaron campos válidos para actualizar");
    }

    await asignacion.update(camposActualizar);

    // Actualizar detalles de equipos si se proporcionaron
    if (data.DetallesEquipos?.length > 0) {
      for (const detalle of data.DetallesEquipos) {
        if (detalle.IdDetalle) {
          await AsignacionesEquiposDetalles.update(
            {
              ObservacionInicial: detalle.ObservacionInicial || null,
              NovedadDevolucion: detalle.NovedadDevolucion || null,
            },
            { where: { IdDetalle: detalle.IdDetalle } }
          );
        }
      }
    }

    // Actualizar detalles de consumibles si se proporcionaron
    if (data.DetallesConsumibles?.length > 0) {
      for (const detalle of data.DetallesConsumibles) {
        if (detalle.IdDetalle) {
          await AsignacionesConsumiblesDetalles.update(
            {
              ObservacionInicial: detalle.ObservacionInicial || null,
              NovedadDevolucion: detalle.NovedadDevolucion || null,
              CantidadDevuelta: detalle.CantidadDevuelta || null,
            },
            { where: { IdDetalle: detalle.IdDetalle } }
          );
        }
      }
    }

    // Retornar asignación actualizada
    return await getAsignacionByIdService(idAsignaciones);
  } catch (error) {
    throw new Error(`Error al actualizar la asignación: ${error.message}`);
  }
};

// ==================== SERVICIO: ELIMINAR ASIGNACIÓN ====================
// 👇 MODIFICADO: Ahora también restaura el estado del ambiente
export const deleteAsignacionService = async (idAsignaciones) => {
  try {
    const asignacion = await Asignaciones.findOne({
      where: { IdAsignaciones: idAsignaciones },
      include: [
        {
          model: AsignacionesEquiposDetalles,
          as: "DetallesEquipos",
        },
        {
          model: AsignacionesConsumiblesDetalles,
          as: "DetallesConsumibles",
        },
      ],
    });

    if (!asignacion) {
      throw new Error("Asignación no encontrada");
    }

    // Si tiene equipos activos, devolverlos a estado "Disponible"
    if (
      asignacion.Item === "Equipo Tecnologico" &&
      asignacion.Estado === "Activo" &&
      asignacion.DetallesEquipos
    ) {
      for (const detalle of asignacion.DetallesEquipos) {
        await EquiposTecnologicos.update(
          { Estado: ESTADOS_EQUIPOS.DISPONIBLE },
          { where: { Codigo: detalle.CodigoEquipo } }
        );
      }
      console.log(
        `✅ ${asignacion.DetallesEquipos.length} equipos devueltos a "Disponible"`
      );

      // 👇 NUEVO: Restaurar estado del ambiente a "Disponible"
      if (asignacion.CodigoAmbiente) {
        await Ambientes.update(
          { estado: ESTADOS_AMBIENTES.DISPONIBLE },
          { where: { codigo: asignacion.CodigoAmbiente } }
        );
        console.log(
          `✅ Ambiente "${asignacion.Ambiente}" restaurado a "Disponible"`
        );
      }
    }

    // Si tiene consumibles activos, devolver el stock
    if (
      asignacion.Item === "Producto Consumible" &&
      asignacion.Estado === "Activo" &&
      asignacion.DetallesConsumibles
    ) {
      for (const detalle of asignacion.DetallesConsumibles) {
        await registrarMovimiento({
          IdProductoConsumible: detalle.IdProductoConsumible,
          TipoMovimiento: "entrada",
          Cantidad: detalle.CantidadAsignada,
          Motivo: `Eliminación de asignación #${idAsignaciones} - devolución automática`,
          Usuario: "Sistema",
        });
      }
      console.log(
        `✅ Stock devuelto para ${asignacion.DetallesConsumibles.length} productos`
      );
    }

    await asignacion.destroy();
    return { message: "Asignación eliminada correctamente" };
  } catch (error) {
    throw new Error(`Error al eliminar la asignación: ${error.message}`);
  }
};

// ==================== SERVICIO: ASIGNACIONES RECIENTES ====================

export const getAsignacionesByDaysService = async (days = 7) => {
  try {
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() - parseInt(days));

    const asignaciones = await Asignaciones.findAll({
      where: {
        FechaAsignacion: { [Op.gte]: fechaLimite },
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
          attributes: [
            "IdDetalle",
            "CodigoEquipo",
            "ObservacionInicial",
            "NovedadDevolucion",
          ],
        },
        {
          model: AsignacionesConsumiblesDetalles,
          as: "DetallesConsumibles",
          attributes: [
            "IdDetalle",
            "IdProductoConsumible",
            "CantidadAsignada",
            "CantidadDevuelta",
            "ObservacionInicial",
            "NovedadDevolucion",
          ],
          include: [
            {
              model: ProductosConsumibles,
              as: "ProductoConsumible",
              attributes: ["IdProductosConsumibles", "Nombre"],
            },
          ],
        },
      ],
    });
    return asignaciones;
  } catch (error) {
    throw new Error(
      `Error al obtener las asignaciones recientes: ${error.message}`
    );
  }
};

// ==================== SERVICIO: CONFIRMAR DEVOLUCIÓN ====================
// 👇 MODIFICADO: Ahora también restaura el estado del ambiente
export const confirmarDevolucionService = async (
  idAsignaciones,
  {
    FechaDevolucion,
    HoraDevolucion,
    Novedad,
    DetallesEquipos,
    DetallesConsumibles,
    EquiposDanados = [],
  }
) => {
  try {
    const asignacion = await Asignaciones.findOne({
      where: { IdAsignaciones: idAsignaciones },
      include: [
        {
          model: AsignacionesEquiposDetalles,
          as: "DetallesEquipos",
        },
        {
          model: AsignacionesConsumiblesDetalles,
          as: "DetallesConsumibles",
        },
      ],
    });

    if (!asignacion) {
      throw new Error("Asignación no encontrada");
    }

    if (asignacion.Estado === "Inactivo") {
      throw new Error("Esta asignación ya ha sido devuelta");
    }

    // Actualizar asignación principal
    await asignacion.update({
      FechaDevolucion,
      HoraDevolucion,
      Estado: "Inactivo",
      Novedad: Novedad || null,
    });

    // ==================== PROCESAR DEVOLUCIÓN DE EQUIPOS ====================
    if (DetallesEquipos?.length > 0) {
      for (const detalle of DetallesEquipos) {
        // Actualizar novedad del equipo
        await AsignacionesEquiposDetalles.update(
          { NovedadDevolucion: detalle.NovedadDevolucion || null },
          {
            where: {
              IdAsignacion: idAsignaciones,
              CodigoEquipo: detalle.CodigoEquipo,
            },
          }
        );

        // Determinar nuevo estado del equipo
        let nuevoEstado = ESTADOS_EQUIPOS.DISPONIBLE;
        if (EquiposDanados.includes(detalle.CodigoEquipo)) {
          nuevoEstado = ESTADOS_EQUIPOS.DANADO;
          console.log(`⚠️ Equipo ${detalle.CodigoEquipo} marcado como DAÑADO`);
        }

        // Actualizar estado del equipo
        await EquiposTecnologicos.update(
          { Estado: nuevoEstado },
          { where: { Codigo: detalle.CodigoEquipo } }
        );
      }

      console.log(
        `✅ ${DetallesEquipos.length} equipos procesados en devolución`
      );

      // 👇 NUEVO: Restaurar estado del ambiente a "Disponible"
      if (asignacion.CodigoAmbiente) {
        await Ambientes.update(
          { estado: ESTADOS_AMBIENTES.DISPONIBLE },
          { where: { codigo: asignacion.CodigoAmbiente } }
        );
        console.log(
          `✅ Ambiente "${asignacion.Ambiente}" restaurado a "Disponible"`
        );
      }
    }

    // ==================== PROCESAR DEVOLUCIÓN DE CONSUMIBLES ====================
    if (DetallesConsumibles?.length > 0) {
      for (const detalle of DetallesConsumibles) {
        // Actualizar detalle con cantidad devuelta y novedad
        await AsignacionesConsumiblesDetalles.update(
          {
            CantidadDevuelta: detalle.CantidadDevuelta,
            NovedadDevolucion: detalle.NovedadDevolucion || null,
          },
          {
            where: {
              IdAsignacion: idAsignaciones,
              IdProductoConsumible: detalle.IdProductoConsumible,
            },
          }
        );

        // Registrar movimiento de entrada por cantidad devuelta
        if (detalle.CantidadDevuelta > 0) {
          await registrarMovimiento({
            IdProductoConsumible: detalle.IdProductoConsumible,
            TipoMovimiento: "entrada",
            Cantidad: detalle.CantidadDevuelta,
            Motivo: `Devolución de asignación #${idAsignaciones} - ${
              detalle.NovedadDevolucion || "Sin novedad"
            }`,
            Usuario: "Sistema",
          });
        }
      }

      console.log(
        `✅ ${DetallesConsumibles.length} productos consumibles procesados en devolución`
      );
    }

    // Retornar asignación actualizada
    return await getAsignacionByIdService(idAsignaciones);
  } catch (error) {
    console.error(`❌ Error al confirmar devolución:`, error.message);
    throw new Error(error.message);
  }
};

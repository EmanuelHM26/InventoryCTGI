import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import configAxios from "../api/configAxios";

export const useAsignaciones = (refreshAmbientes) => {
  const [asignaciones, setAsignaciones] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [ambientes, setAmbientes] = useState([]);
  const [showAmbientesPanel, setShowAmbientesPanel] = useState(false);
  const [ambienteSearchTerm, setAmbienteSearchTerm] = useState("");
  const [showNovedadModal, setShowNovedadModal] = useState(false);
  const [selectedNovedad, setSelectedNovedad] = useState("");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedAsignacion, setSelectedAsignacion] = useState(null);
  const [showEquipmentsModal, setShowEquipmentsModal] = useState(false);
  const [selectedEquipments, setSelectedEquipments] = useState([]);
  const [formTouched, setFormTouched] = useState(false);

  // Nuevos estados para observaciones y novedades por equipo
  const [showObservacionesModal, setShowObservacionesModal] = useState(false);
  const [showNovedadesDevolucionModal, setShowNovedadesDevolucionModal] =
    useState(false);
  const [equiposConDetalles, setEquiposConDetalles] = useState([]);

  // Nuevos estados para checkbox de equipos dañados
  const [equiposDanados, setEquiposDanados] = useState([]);

  // 👇 NUEVOS ESTADOS PARA CONSUMIBLES
  const [productosConsumibles, setProductosConsumibles] = useState([]);
  const [showConsumiblesPanel, setShowConsumiblesPanel] = useState(false);
  const [consumibleSearchTerm, setConsumibleSearchTerm] = useState("");
  const [selectedConsumibles, setSelectedConsumibles] = useState([]);
  const [
    showObservacionesConsumiblesModal,
    setShowObservacionesConsumiblesModal,
  ] = useState(false);
  const [showNovedadesConsumiblesModal, setShowNovedadesConsumiblesModal] =
    useState(false);
  const [consumiblesConDetalles, setConsumiblesConDetalles] = useState([]);

  const [newAsignacion, setNewAsignacion] = useState({
    IdUsuario: "",
    Nombre: "",
    Apellido: "",
    Documento: "",
    FechaAsignacion: "",
    HoraAsignacion: "",
    Observacion: "",
    Ambiente: "",
    CodigoAmbiente: "",
    FechaDevolucion: null,
    HoraDevolucion: null,
    Novedad: "",
    Cantidad: "",
    Item: "",
    Estado: "Activo",
  });

  const ESTADOS_EQUIPOS = {
    DISPONIBLE: "Disponible",
    EN_PRESTAMO: "En Préstamo",
    DANADO: "Dañado",
    MANTENIMIENTO: "En Mantenimiento",
  };

  // Estados para paginación y búsqueda
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "IdAsignaciones",
    direction: "ascending",
  });
  const itemsPerPage = 8;

  //Estados para el lector de código de barras
  const [barcodeMode, setBarcodeMode] = useState("user");
  const [scannedEquipment, setScannedEquipment] = useState([]);
  const [showBarcodeInstructions, setShowBarcodeInstructions] = useState(false);

  useEffect(() => {
    fetchAsignaciones();
    fetchUsuarios();
    fetchAmbientes();
    fetchProductosConsumibles();
  }, []);

  const fetchAsignaciones = async () => {
    try {
      const response = await configAxios.get("/api/asignaciones", {
        withCredentials: true,
      });
      setAsignaciones(response.data);
    } catch (error) {
      console.error("Error al obtener asignaciones:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar las asignaciones",
        showConfirmButton: true,
      });
    }
  };

  const fetchUsuarios = async () => {
    try {
      const response = await configAxios.get("/api/usuarios", {
        withCredentials: true,
      });
      setUsuarios(response.data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar los usuarios",
        showConfirmButton: true,
      });
    }
  };

  const fetchAmbientes = async () => {
    try {
      const response = await configAxios.get("/api/ambientes", {
        withCredentials: true,
      });
      setAmbientes(response.data);
      console.log(
        "🔄 Ambientes actualizados en useAsignaciones:",
        response.data
      );
    } catch (error) {
      console.error("Error al obtener ambientes:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar los ambientes",
        showConfirmButton: true,
      });
    }
  };

  // 👇 NUEVA FUNCIÓN PARA OBTENER PRODUCTOS CONSUMIBLES
  const fetchProductosConsumibles = async () => {
    try {
      const response = await configAxios.get("/api/productosconsumibles", {
        withCredentials: true,
      });
      setProductosConsumibles(response.data);
    } catch (error) {
      console.error("Error al obtener productos consumibles:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar los productos consumibles",
        showConfirmButton: true,
      });
    }
  };

  // 👇 FUNCIÓN MEJORADA: Verificar disponibilidad de ambiente contra la API
  const verificarDisponibilidadAmbienteAPI = async (codigoAmbiente) => {
    try {
      const response = await configAxios.get("/api/ambientes", {
        withCredentials: true,
      });

      const ambiente = response.data.find(
        (amb) => amb.codigo === codigoAmbiente
      );

      if (!ambiente) {
        return { disponible: false, mensaje: "Ambiente no encontrado" };
      }

      console.log(
        `🔍 Verificando ambiente ${codigoAmbiente}:`,
        ambiente.estado
      );

      return {
        disponible: ambiente.estado === "Disponible",
        estado: ambiente.estado,
        ambiente: ambiente,
      };
    } catch (error) {
      console.error("Error al verificar disponibilidad del ambiente:", error);
      return {
        disponible: false,
        mensaje: "Error al verificar disponibilidad",
      };
    }
  };

  // 👇 ACTUALIZAR handleSelectAmbiente con validación contra API
  const handleSelectAmbiente = async (ambiente) => {
    console.log(
      "🎯 Intentando seleccionar ambiente:",
      ambiente.codigo,
      ambiente.nombre
    );

    // Validar disponibilidad contra la API en tiempo real
    const verificacion = await verificarDisponibilidadAmbienteAPI(
      ambiente.codigo
    );

    console.log("✅ Resultado de verificación:", verificacion);

    if (!verificacion.disponible) {
      Swal.fire({
        icon: "error",
        title: "Ambiente no disponible",
        html: `
        <div class="text-left">
          <p class="font-semibold text-red-700 mb-2">
            El ambiente <strong>${ambiente.nombre}</strong> (Código: ${
          ambiente.codigo
        }) 
            está actualmente ${verificacion.estado || "en préstamo"}.
          </p>
          <p class="text-sm text-gray-600">
            Por favor, seleccione otro ambiente disponible.
          </p>
        </div>
      `,
        showConfirmButton: true,
        confirmButtonText: "Entendido",
      });
      return;
    }

    setNewAsignacion({
      ...newAsignacion,
      Ambiente: ambiente.nombre,
      CodigoAmbiente: ambiente.codigo,
    });
    setShowAmbientesPanel(false);

    Swal.fire({
      icon: "success",
      title: "Ambiente seleccionado",
      text: `${ambiente.nombre}`,
      timer: 2000,
      showConfirmButton: false,
    });
  };

  // 👇 NUEVA FUNCIÓN PARA SELECCIONAR CONSUMIBLE
  const handleSelectConsumible = (producto, cantidad) => {
    if (!cantidad || cantidad <= 0) {
      Swal.fire({
        icon: "warning",
        title: "Cantidad inválida",
        text: "Debe ingresar una cantidad mayor a 0",
        showConfirmButton: true,
      });
      return;
    }

    if (cantidad > producto.CantidadDisponible) {
      Swal.fire({
        icon: "warning",
        title: "Stock insuficiente",
        text: `Solo hay ${producto.CantidadDisponible} unidades disponibles de ${producto.Nombre}`,
        showConfirmButton: true,
      });
      return;
    }

    const yaSeleccionado = selectedConsumibles.find(
      (c) => c.IdProductoConsumible === producto.IdProductosConsumibles
    );

    if (yaSeleccionado) {
      Swal.fire({
        icon: "warning",
        title: "Producto ya seleccionado",
        text: "Este producto ya está en la lista",
        showConfirmButton: true,
      });
      return;
    }

    const nuevoConsumible = {
      IdProductoConsumible: producto.IdProductosConsumibles,
      Nombre: producto.Nombre,
      CantidadAsignada: parseInt(cantidad),
      CantidadDisponible: producto.CantidadDisponible,
      UnidadMedida: producto.UnidadMedida,
      ValorMedida: producto.ValorMedida,
      ObservacionInicial: "",
    };

    setSelectedConsumibles((prev) => [...prev, nuevoConsumible]);

    // Actualizar cantidad total
    const totalCantidad =
      selectedConsumibles.reduce((sum, c) => sum + c.CantidadAsignada, 0) +
      parseInt(cantidad);

    setNewAsignacion({
      ...newAsignacion,
      Cantidad: totalCantidad.toString(),
    });

    Swal.fire({
      icon: "success",
      title: "Producto agregado",
      text: `${cantidad} unidad(es) de ${producto.Nombre}`,
      timer: 2000,
      showConfirmButton: false,
    });
  };

  // 👇 FUNCIÓN PARA ELIMINAR CONSUMIBLE SELECCIONADO
  const handleRemoveConsumible = (idProducto) => {
    const updatedConsumibles = selectedConsumibles.filter(
      (c) => c.IdProductoConsumible !== idProducto
    );
    setSelectedConsumibles(updatedConsumibles);

    // Actualizar cantidad total
    const totalCantidad = updatedConsumibles.reduce(
      (sum, c) => sum + c.CantidadAsignada,
      0
    );
    setNewAsignacion({
      ...newAsignacion,
      Cantidad: totalCantidad.toString(),
    });

    Swal.fire({
      icon: "success",
      title: "Producto eliminado",
      text: "El producto fue eliminado de la lista",
      timer: 2000,
      showConfirmButton: false,
    });
  };

  // 👇 FILTRAR AMBIENTES: Mostrar solo disponibles
  const filteredAmbientes = ambientes.filter((amb) => {
    // Primero aplicar búsqueda por término
    const matchesSearch =
      amb.nombre?.toLowerCase().includes(ambienteSearchTerm.toLowerCase()) ||
      amb.codigo?.toString().includes(ambienteSearchTerm);

    if (!matchesSearch) return false;

    // 👇 CRÍTICO: Solo mostrar ambientes con estado "Disponible"
    console.log(`🔍 Filtrando ambiente ${amb.codigo}:`, amb.estado);
    return amb.estado === "Disponible";
  });

  // 👇 FILTRAR CONSUMIBLES POR BÚSQUEDA
  const filteredConsumibles = productosConsumibles.filter(
    (prod) =>
      prod.Nombre?.toLowerCase().includes(consumibleSearchTerm.toLowerCase()) &&
      prod.CantidadDisponible > 0
  );

  const validateEquipmentOnScan = async (scannedCode) => {
    try {
      // 1. Verificar que no esté ya escaneado
      const existingEquipment = scannedEquipment.find(
        (eq) => eq.code === scannedCode
      );
      if (existingEquipment) {
        return {
          success: false,
          message: `El equipo con código ${scannedCode} ya fue escaneado.`,
        };
      }

      // 2. Verificar disponibilidad en tiempo real
      const response = await configAxios.get("/api/equipostecnologicos", {
        withCredentials: true,
      });

      const equipos = response.data;
      const equipo = equipos.find((e) => e.Codigo === scannedCode);

      if (!equipo) {
        return {
          success: false,
          message: `❌ El equipo con código ${scannedCode} no existe en el inventario`,
        };
      }

      if (equipo.Estado !== ESTADOS_EQUIPOS.DISPONIBLE) {
        return {
          success: false,
          message: `❌ El equipo ${scannedCode} no está disponible. Estado actual: ${equipo.Estado}`,
        };
      }

      // 3. Verificar que no esté asignado en otra asignación activa
      const asignacionesResponse = await configAxios.get("/api/asignaciones", {
        withCredentials: true,
      });

      const asignacionActiva = asignacionesResponse.data.find(
        (asig) =>
          asig.Estado === "Activo" &&
          asig.Item === "Equipo Tecnologico" &&
          asig.DetallesEquipos?.some((det) => det.CodigoEquipo === scannedCode)
      );

      if (asignacionActiva) {
        return {
          success: false,
          message: `❌ El equipo ${scannedCode} ya está asignado a ${asignacionActiva.Nombre} ${asignacionActiva.Apellido} (Asignación #${asignacionActiva.IdAsignaciones})`,
        };
      }

      return { success: true, equipo };
    } catch (error) {
      return {
        success: false,
        message: "Error al verificar disponibilidad del equipo",
      };
    }
  };

  const handleBarcodeScan = async (scannedCode) => {
    if (!showModal) return;

    try {
      if (barcodeMode === "user") {
        // ... código existente para usuarios
      } else if (barcodeMode === "equipment") {
        // VALIDAR ANTES DE AGREGAR
        const validation = await validateEquipmentOnScan(scannedCode);

        if (!validation.success) {
          Swal.fire({
            icon: "error",
            title: "Equipo no disponible",
            html: `
            <div class="text-left">
              <p class="font-semibold text-red-700 mb-2">${validation.message}</p>
              <p class="text-sm text-gray-600">No se puede agregar este equipo a la asignación.</p>
            </div>
          `,
            showConfirmButton: true,
            confirmButtonText: "Entendido",
          });
          return;
        }

        // Si pasa validación, agregar al estado
        setScannedEquipment((prev) => [
          ...prev,
          { code: scannedCode, quantity: 1, observacionInicial: "" },
        ]);

        const totalQuantity = scannedEquipment.length + 1;
        setNewAsignacion({
          ...newAsignacion,
          Cantidad: totalQuantity.toString(),
        });

        Swal.fire({
          icon: "success",
          title: "✅ Equipo disponible",
          html: `
          <div class="text-left">
            <p class="font-semibold text-green-700">Equipo escaneado correctamente</p>
            <p class="text-sm text-gray-600 mt-1">Código: <code class="bg-gray-100 px-2 py-1 rounded">${scannedCode}</code></p>
            <p class="text-xs text-green-600 mt-2">✔️ Verificado y disponible para asignación</p>
          </div>
        `,
          showConfirmButton: true,
          confirmButtonText: "Continuar",
        });
      }
    } catch (error) {
      console.error("Error al procesar código de barras:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al procesar el código escaneado",
        showConfirmButton: true,
        confirmButtonText: "Cerrar",
      });
    }
  };

  const handleRemoveScannedEquipment = (codeToRemove) => {
    const updatedEquipment = scannedEquipment.filter(
      (eq) => eq.code !== codeToRemove
    );
    setScannedEquipment(updatedEquipment);

    const totalQuantity = updatedEquipment.length;
    setNewAsignacion({
      ...newAsignacion,
      Cantidad: totalQuantity.toString(),
    });

    Swal.fire({
      icon: "success",
      title: "Equipo eliminado",
      text: `Código ${codeToRemove} eliminado de la lista`,
      showConfirmButton: true,
      confirmButtonText: "Ok",
    });
  };

  const handleUsuarioChange = (e) => {
    const selectedId = e.target.value;
    const usuario = usuarios.find((u) => u.IdUsuario.toString() === selectedId);
    setNewAsignacion({
      ...newAsignacion,
      IdUsuario: selectedId,
      Nombre: usuario ? usuario.Nombre : "",
      Apellido: usuario ? usuario.Apellido : "",
      Documento: usuario ? usuario.NumeroDocumento || "" : "",
    });
  };

  // 👇 FUNCIÓN PARA ABRIR MODAL DE OBSERVACIONES DE EQUIPOS
  const handleOpenObservacionesModal = () => {
    if (scannedEquipment.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Sin equipos",
        text: "Primero debe escanear al menos un equipo",
        showConfirmButton: true,
      });
      return;
    }
    setShowObservacionesModal(true);
  };

  // 👇 NUEVA FUNCIÓN PARA ABRIR MODAL DE OBSERVACIONES DE CONSUMIBLES
  const handleOpenObservacionesConsumiblesModal = () => {
    if (selectedConsumibles.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Sin productos",
        text: "Primero debe seleccionar al menos un producto consumible",
        showConfirmButton: true,
      });
      return;
    }
    setShowObservacionesConsumiblesModal(true);
  };

  const handleUpdateObservacionEquipo = (codigoEquipo, observacion) => {
    setScannedEquipment((prev) =>
      prev.map((eq) =>
        eq.code === codigoEquipo
          ? { ...eq, observacionInicial: observacion }
          : eq
      )
    );
  };

  // 👇 NUEVA FUNCIÓN PARA ACTUALIZAR OBSERVACIÓN DE CONSUMIBLE
  const handleUpdateObservacionConsumible = (idProducto, observacion) => {
    setSelectedConsumibles((prev) =>
      prev.map((c) =>
        c.IdProductoConsumible === idProducto
          ? { ...c, ObservacionInicial: observacion }
          : c
      )
    );
  };

  // 👇 FUNCIÓN LOCAL: Verificar si un ambiente específico está disponible (para filtrado rápido)
  const verificarDisponibilidadAmbiente = (codigoAmbiente) => {
    const ambiente = ambientes.find((amb) => amb.codigo === codigoAmbiente);
    return ambiente?.estado === "Disponible";
  };

  // 👇 NUEVA FUNCIÓN PARA VERIFICAR DISPONIBILIDAD DE EQUIPOS
  const verificarDisponibilidadEquipos = async (codigosEquipos) => {
    try {
      // Obtener todos los equipos del sistema
      const response = await configAxios.get("/api/equipostecnologicos", {
        withCredentials: true,
      });

      const equipos = response.data;
      const errores = [];

      console.log(
        `🔍 Verificando disponibilidad de ${codigosEquipos.length} equipos...`
      );

      for (const codigo of codigosEquipos) {
        // VALIDACIÓN 1: Verificar que el equipo existe
        const equipo = equipos.find((e) => e.Codigo === codigo);

        if (!equipo) {
          errores.push({
            codigo: codigo,
            mensaje: `El equipo con código ${codigo} no existe en el inventario`,
            tipo: "no_existe",
          });
          console.error(`❌ Equipo ${codigo}: NO EXISTE`);
          continue;
        }

        // VALIDACIÓN 2: Verificar que el equipo esté disponible
        if (equipo.Estado !== ESTADOS_EQUIPOS.DISPONIBLE) {
          errores.push({
            codigo: codigo,
            mensaje: `El equipo ${codigo} no está disponible`,
            detalle: `Estado actual: ${equipo.Estado}`,
            tipo: "no_disponible",
          });
          console.error(`❌ Equipo ${codigo}: Estado = ${equipo.Estado}`);
          continue;
        }

        // VALIDACIÓN 3: Verificar que el equipo no esté ya asignado en otra asignación activa
        const asignacionActiva = asignaciones.find(
          (asig) =>
            asig.Estado === "Activo" &&
            asig.Item === "Equipo Tecnologico" &&
            asig.DetallesEquipos?.some((det) => det.CodigoEquipo === codigo)
        );

        if (asignacionActiva) {
          errores.push({
            codigo: codigo,
            mensaje: `El equipo ${codigo} ya está en préstamo`,
            detalle: `Asignado a: ${asignacionActiva.Nombre} ${asignacionActiva.Apellido}`,
            asignacionId: asignacionActiva.IdAsignaciones,
            tipo: "ya_asignado",
          });
          console.error(
            `❌ Equipo ${codigo}: Ya asignado a ${asignacionActiva.Nombre} ${asignacionActiva.Apellido}`
          );
          continue;
        }

        console.log(`✅ Equipo ${codigo}: DISPONIBLE`);
      }

      if (errores.length > 0) {
        console.error(
          `❌ ${errores.length} equipos con problemas de ${codigosEquipos.length} verificados`
        );
      } else {
        console.log(`✅ Todos los equipos están disponibles`);
      }

      return errores;
    } catch (error) {
      console.error("❌ Error al verificar disponibilidad:", error);
      return [
        {
          codigo: "ERROR",
          mensaje: "Error al verificar disponibilidad de equipos",
          detalle: error.message,
          tipo: "error_sistema",
        },
      ];
    }
  };

  const handleCreateAsignacion = async () => {
    // Validación de campos obligatorios
    const requiredFields = {
      IdUsuario: "Usuario",
      Nombre: "Nombre",
      Apellido: "Apellido",
      Documento: "Documento",
      Cantidad: "Cantidad",
      Item: "Item",
      Estado: "Estado",
    };

    const missingFields = [];
    for (const [field, label] of Object.entries(requiredFields)) {
      if (
        !newAsignacion[field] ||
        (field === "Cantidad" && newAsignacion[field] <= 0)
      ) {
        missingFields.push(label);
      }
    }

    if (!newAsignacion.Observacion || !newAsignacion.Observacion.trim()) {
      newAsignacion.Observacion = "ninguna observación";
    }

    if (missingFields.length > 0) {
      Swal.fire({
        icon: "warning",
        title: "Campos requeridos",
        text: `Por favor complete los siguientes campos: ${missingFields.join(
          ", "
        )}`,
        showConfirmButton: true,
        confirmButtonText: "Cerrar",
      });
      return;
    }

    // 👇 VALIDACIÓN ESPECÍFICA POR TIPO DE ITEM
    if (
      newAsignacion.Item === "Equipo Tecnologico" &&
      scannedEquipment.length === 0
    ) {
      Swal.fire({
        icon: "warning",
        title: "Sin equipos",
        text: "Debe escanear al menos un equipo tecnológico",
        showConfirmButton: true,
      });
      return;
    }

    if (
      newAsignacion.Item === "Producto Consumible" &&
      selectedConsumibles.length === 0
    ) {
      Swal.fire({
        icon: "warning",
        title: "Sin productos",
        text: "Debe seleccionar al menos un producto consumible",
        showConfirmButton: true,
      });
      return;
    }

    // 👇 NUEVA VALIDACIÓN: VERIFICAR DISPONIBILIDAD DE EQUIPOS
    if (
      newAsignacion.Item === "Equipo Tecnologico" &&
      scannedEquipment.length > 0
    ) {
      const codigosEquipos = scannedEquipment.map((eq) => eq.code);
      const erroresDisponibilidad = await verificarDisponibilidadEquipos(
        codigosEquipos
      );

      if (erroresDisponibilidad.length > 0) {
        // Agrupar errores por tipo para mejor visualización
        const erroresPorTipo = {
          no_existe: erroresDisponibilidad.filter(
            (e) => e.tipo === "no_existe"
          ),
          no_disponible: erroresDisponibilidad.filter(
            (e) => e.tipo === "no_disponible"
          ),
          ya_asignado: erroresDisponibilidad.filter(
            (e) => e.tipo === "ya_asignado"
          ),
          error_sistema: erroresDisponibilidad.filter(
            (e) => e.tipo === "error_sistema"
          ),
        };

        // Construir HTML del mensaje
        let mensajeHTML = '<div class="text-left space-y-4">';

        // Errores de equipos que no existen
        if (erroresPorTipo.no_existe.length > 0) {
          mensajeHTML += `
      <div class="bg-red-50 border-l-4 border-red-500 p-3 rounded">
        <p class="font-bold text-red-800 mb-2">❌ Equipos que no existen (${
          erroresPorTipo.no_existe.length
        }):</p>
        <ul class="list-disc list-inside space-y-1 text-sm text-red-700">
          ${erroresPorTipo.no_existe
            .map(
              (e) =>
                `<li><code class="bg-red-100 px-2 py-1 rounded">${e.codigo}</code> - ${e.mensaje}</li>`
            )
            .join("")}
        </ul>
      </div>
    `;
        }

        // Errores de equipos no disponibles
        if (erroresPorTipo.no_disponible.length > 0) {
          mensajeHTML += `
      <div class="bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded">
        <p class="font-bold text-yellow-800 mb-2">⚠️ Equipos no disponibles (${
          erroresPorTipo.no_disponible.length
        }):</p>
        <ul class="list-disc list-inside space-y-1 text-sm text-yellow-700">
          ${erroresPorTipo.no_disponible
            .map(
              (e) => `
            <li>
              <code class="bg-yellow-100 px-2 py-1 rounded">${
                e.codigo
              }</code> - ${e.mensaje}
              ${
                e.detalle
                  ? `<br><span class="ml-6 text-xs">${e.detalle}</span>`
                  : ""
              }
            </li>
          `
            )
            .join("")}
        </ul>
      </div>
    `;
        }

        // Errores de equipos ya asignados
        if (erroresPorTipo.ya_asignado.length > 0) {
          mensajeHTML += `
      <div class="bg-orange-50 border-l-4 border-orange-500 p-3 rounded">
        <p class="font-bold text-orange-800 mb-2">🔒 Equipos ya en préstamo (${
          erroresPorTipo.ya_asignado.length
        }):</p>
        <ul class="list-disc list-inside space-y-1 text-sm text-orange-700">
          ${erroresPorTipo.ya_asignado
            .map(
              (e) => `
            <li>
              <code class="bg-orange-100 px-2 py-1 rounded">${
                e.codigo
              }</code> - ${e.mensaje}
              ${
                e.detalle
                  ? `<br><span class="ml-6 text-xs">${e.detalle}</span>`
                  : ""
              }
              ${
                e.asignacionId
                  ? `<br><span class="ml-6 text-xs">Asignación #${e.asignacionId}</span>`
                  : ""
              }
            </li>`
            )
            .join("")}
        </ul>
      </div>
    `;
        }
        // Errores del sistema
        if (erroresPorTipo.error_sistema.length > 0) {
          mensajeHTML += `
  <div class="bg-gray-50 border-l-4 border-gray-500 p-3 rounded">
    <p class="font-bold text-gray-800 mb-2">⚙️ Errores del sistema:</p>
    <ul class="list-disc list-inside space-y-1 text-sm text-gray-700">
      ${erroresPorTipo.error_sistema
        .map((e) => `<li>${e.mensaje}</li>`)
        .join("")}
    </ul>
  </div>
`;
        }

        mensajeHTML += "</div>";

        // Mostrar alerta con SweetAlert2
        Swal.fire({
          icon: "error",
          title: "⚠️ No se puede crear la asignación",
          html: mensajeHTML,
          showConfirmButton: true,
          confirmButtonText: "Entendido",
          confirmButtonColor: "#EF4444",
          width: "600px",
          customClass: {
            popup: "text-left",
          },
        });

        return; // Detener la creación de la asignación
      }
    }

    if (newAsignacion.FechaDevolucion && newAsignacion.FechaAsignacion) {
      if (
        new Date(newAsignacion.FechaDevolucion) <
        new Date(newAsignacion.FechaAsignacion)
      ) {
        Swal.fire({
          icon: "warning",
          title: "Fecha inválida",
          text: "La fecha de devolución no puede ser anterior a la fecha de asignación",
          showConfirmButton: true,
        });
        return;
      }
    }

    try {
      if (newAsignacion.IdAsignaciones) {
        await configAxios.put(
          `/api/asignaciones/${newAsignacion.IdAsignaciones}`,
          newAsignacion,
          { withCredentials: true }
        );
        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: "Asignación actualizada correctamente",
          showConfirmButton: true,
          confirmButtonText: "Ok",
        });
      } else {
        const now = new Date();
        const today = now.toISOString().split("T")[0];
        const currentTime = now.toTimeString().split(" ")[0];

        let asignacionData = {
          ...newAsignacion,
          FechaAsignacion: today,
          HoraAsignacion: currentTime,
          FechaDevolucion: null,
          HoraDevolucion: null,
        };

        // 👇 PREPARAR DATOS SEGÚN EL TIPO DE ITEM
        if (newAsignacion.Item === "Equipo Tecnologico") {
          const detallesEquipos = scannedEquipment.map((eq) => ({
            CodigoEquipo: eq.code,
            ObservacionInicial: eq.observacionInicial || null,
          }));

          asignacionData = {
            ...asignacionData,
            CodigosEquipos: scannedEquipment.map((eq) => eq.code).join(","),
            DetallesEquipos: detallesEquipos,
          };
        } else if (newAsignacion.Item === "Producto Consumible") {
          const detallesConsumibles = selectedConsumibles.map((c) => ({
            IdProductoConsumible: c.IdProductoConsumible,
            CantidadAsignada: c.CantidadAsignada,
            ObservacionInicial: c.ObservacionInicial || null,
          }));

          asignacionData = {
            ...asignacionData,
            DetallesConsumibles: detallesConsumibles,
            Ambiente: newAsignacion.Ambiente || null,
            CodigoAmbiente: newAsignacion.CodigoAmbiente || null,
          };
        }

        await configAxios.post("/api/asignaciones", asignacionData, {
          withCredentials: true,
        });

        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: "Asignación creada correctamente",
          showConfirmButton: true,
          confirmButtonText: "Ok",
        });
      }

      // 👇 CRÍTICO: Refrescar estados INMEDIATAMENTE después de crear/editar
      await fetchAsignaciones();
      await fetchAmbientes();

      if (refreshAmbientes) {
        refreshAmbientes(); // Refrescar el hook de useAmbientes también
      }

      setScannedEquipment([]);
      setSelectedConsumibles([]);
      setEquiposDanados([]);
      setBarcodeMode("user");
      setShowModal(false);
      setShowObservacionesModal(false);
      setShowObservacionesConsumiblesModal(false);

      setNewAsignacion({
        IdUsuario: "",
        Nombre: "",
        Apellido: "",
        Documento: "",
        FechaAsignacion: "",
        HoraAsignacion: "",
        Observacion: "",
        Ambiente: "",
        CodigoAmbiente: "",
        FechaDevolucion: null,
        HoraDevolucion: null,
        Novedad: "",
        Cantidad: "",
        Item: "",
        Estado: "Activo",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message ||
          "Ocurrió un error al guardar la asignación",
        showConfirmButton: true,
        confirmButtonText: "Cerrar",
      });
      console.error(error);
    }
  };
  const handleToggleEquipoDanado = (codigoEquipo) => {
    setEquiposDanados((prev) => {
      if (prev.includes(codigoEquipo)) {
        return prev.filter((codigo) => codigo !== codigoEquipo);
      } else {
        return [...prev, codigoEquipo];
      }
    });
  };
  const handleEditAsignacion = async (asignacion) => {
    const formatDateForInput = (dateString) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toISOString().split("T")[0];
    };
    setNewAsignacion({
      ...asignacion,
      FechaAsignacion: formatDateForInput(asignacion.FechaAsignacion),
      FechaDevolucion: formatDateForInput(asignacion.FechaDevolucion),
    });

    setShowModal(true);

    Swal.fire({
      title: "Deseas editar esta asignación?",
      text: "Modo edición activado",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Sí, editar",
      cancelButtonText: "Cancelar",
    });
  };
  const handleDeleteAsignacion = async (id) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará la asignación permanentemente",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    });
    if (result.isConfirmed) {
      try {
        await configAxios.delete(`/api/asignaciones/${id}`, {
          withCredentials: true,
        });

        // 👇 CRÍTICO: Refrescar inmediatamente después de eliminar
        await fetchAsignaciones();
        await fetchAmbientes();

        if (refreshAmbientes) {
          refreshAmbientes();
        }

        Swal.fire({
          icon: "success",
          title: "¡Eliminado!",
          text: "Asignación eliminada correctamente",
          showConfirmButton: true,
          confirmButtonText: "Ok",
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Ocurrió un error al eliminar la asignación",
          showConfirmButton: true,
          confirmButtonText: "Cerrar",
        });
        console.error("Error al eliminar asignación:", error);
      }
    }
  };
  const handleConfirmarDevolucion = async (id) => {
    try {
      const response = await configAxios.get(`/api/asignaciones/${id}`, {
        withCredentials: true,
      });
      const asignacion = response.data;

      // 👇 PREPARAR SEGÚN EL TIPO DE ITEM
      if (asignacion.Item === "Equipo Tecnologico") {
        const equipos = asignacion.DetallesEquipos.map((detalle) => ({
          CodigoEquipo: detalle.CodigoEquipo,
          ObservacionInicial: detalle.ObservacionInicial,
          NovedadDevolucion: "",
          TieneNovedad: false,
        }));

        setEquiposConDetalles(equipos);
        setSelectedAsignacion(asignacion);
        setShowNovedadesDevolucionModal(true);
      } else if (asignacion.Item === "Producto Consumible") {
        const consumibles = asignacion.DetallesConsumibles.map((detalle) => ({
          IdProductoConsumible: detalle.IdProductoConsumible,
          Nombre: detalle.ProductoConsumible.Nombre,
          CantidadAsignada: detalle.CantidadAsignada,
          CantidadDevuelta: detalle.CantidadAsignada, // Por defecto devuelve todo
          ObservacionInicial: detalle.ObservacionInicial,
          NovedadDevolucion: "",
          TieneNovedad: false,
        }));

        setConsumiblesConDetalles(consumibles);
        setSelectedAsignacion(asignacion);
        setShowNovedadesConsumiblesModal(true);
      }
    } catch (error) {
      console.error("Error al obtener detalles de asignación:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar los detalles de la asignación",
        showConfirmButton: true,
      });
    }
  };
  const handleProcesarDevolucion = async (novedadGeneral) => {
    try {
      const now = new Date();
      const FechaDevolucion = getTodayLocal();
      const HoraDevolucion = now.toTimeString().split(" ")[0].substring(0, 8);
      const detallesEquipos = equiposConDetalles.map((eq) => ({
        CodigoEquipo: eq.CodigoEquipo,
        NovedadDevolucion: eq.TieneNovedad ? eq.NovedadDevolucion : null,
      }));

      await configAxios.patch(
        `/api/asignaciones/${selectedAsignacion.IdAsignaciones}/confirmar-devolucion`,
        {
          FechaDevolucion,
          HoraDevolucion,
          Estado: "Inactivo",
          Novedad: novedadGeneral || null,
          DetallesEquipos: detallesEquipos,
          EquiposDanados: equiposDanados,
        },
        { withCredentials: true }
      );

      // 👇 CRÍTICO: Refrescar inmediatamente después de devolución
      await fetchAsignaciones();
      await fetchAmbientes();

      if (refreshAmbientes) {
        refreshAmbientes();
      }

      setShowNovedadesDevolucionModal(false);
      setEquiposConDetalles([]);
      setEquiposDanados([]);

      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "Devolución registrada exitosamente",
        showConfirmButton: true,
        confirmButtonText: "Ok",
      });
    } catch (error) {
      console.error("Error completo:", error.response?.data);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Error al confirmar devolución",
        showConfirmButton: true,
      });
    }
  };
  // 👇 NUEVA FUNCIÓN PARA PROCESAR DEVOLUCIÓN DE CONSUMIBLES
  const handleProcesarDevolucionConsumibles = async (novedadGeneral) => {
    try {
      const now = new Date();
      const FechaDevolucion = getTodayLocal();
      const HoraDevolucion = now.toTimeString().split(" ")[0].substring(0, 8);
      const detallesConsumibles = consumiblesConDetalles.map((c) => ({
        IdProductoConsumible: c.IdProductoConsumible,
        CantidadDevuelta: parseInt(c.CantidadDevuelta),
        NovedadDevolucion: c.TieneNovedad ? c.NovedadDevolucion : null,
      }));

      await configAxios.patch(
        `/api/asignaciones/${selectedAsignacion.IdAsignaciones}/confirmar-devolucion`,
        {
          FechaDevolucion,
          HoraDevolucion,
          Estado: "Inactivo",
          Novedad: novedadGeneral || null,
          DetallesConsumibles: detallesConsumibles,
        },
        { withCredentials: true }
      );

      await fetchAsignaciones();
      await fetchProductosConsumibles(); // Actualizar stock
      setShowNovedadesConsumiblesModal(false);
      setConsumiblesConDetalles([]);

      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "Devolución registrada exitosamente",
        showConfirmButton: true,
        confirmButtonText: "Ok",
      });
    } catch (error) {
      console.error("Error completo:", error.response?.data);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Error al confirmar devolución",
        showConfirmButton: true,
      });
    }
  };
  const handleUpdateNovedadEquipo = (codigoEquipo, tieneNovedad, novedad) => {
    setEquiposConDetalles((prev) =>
      prev.map((eq) =>
        eq.CodigoEquipo === codigoEquipo
          ? { ...eq, TieneNovedad: tieneNovedad, NovedadDevolucion: novedad }
          : eq
      )
    );
  };
  const handleUpdateNovedadConsumible = (
    idProducto,
    tieneNovedad,
    novedad,
    cantidadDevuelta
  ) => {
    setConsumiblesConDetalles((prev) =>
      prev.map((c) =>
        c.IdProductoConsumible === idProducto
          ? {
              ...c,
              TieneNovedad: tieneNovedad,
              NovedadDevolucion: novedad,
              CantidadDevuelta:
                cantidadDevuelta !== undefined
                  ? cantidadDevuelta
                  : c.CantidadDevuelta,
            }
          : c
      )
    );
  };
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return dateString;
  };
  function getTodayLocal() {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    return today.toISOString().split("T")[0];
  }
  const truncateText = (text, maxLength = 10) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };
  const handleShowNovedad = (novedad) => {
    setSelectedNovedad(novedad || "Sin novedad registrada");
    setShowNovedadModal(true);
  };
  const handleShowDetails = (asignacion) => {
    setSelectedAsignacion(asignacion);
    setShowDetailsModal(true);
  };
  const handleShowEquipments = (asignacion) => {
    // 👇 MANEJAR PRODUCTOS CONSUMIBLES
    if (asignacion.Item === "Producto Consumible") {
      if (
        asignacion.DetallesConsumibles &&
        asignacion.DetallesConsumibles.length > 0
      ) {
        setSelectedEquipments(asignacion.DetallesConsumibles);
      } else {
        setSelectedEquipments([]);
      }
      setShowEquipmentsModal(true);
      return;
    }
    // 👇 MANEJAR EQUIPOS TECNOLÓGICOS (código original)
    if (asignacion.DetallesEquipos && asignacion.DetallesEquipos.length > 0) {
      setSelectedEquipments(asignacion.DetallesEquipos);
    } else {
      let equipmentCodes = [];
      if (asignacion.CodigosEquipos) {
        equipmentCodes = asignacion.CodigosEquipos.split(",").map((code) => ({
          CodigoEquipo: code.trim(),
          ObservacionInicial: null,
          NovedadDevolucion: null,
        }));
      }
      setSelectedEquipments(equipmentCodes);
    }
    setShowEquipmentsModal(true);
  };
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };
  const filteredAsignaciones = asignaciones.filter((asignacion) => {
    const searchTermLower = searchTerm.toLowerCase();
    if (!isNaN(searchTerm) && searchTerm.trim() !== "") {
      return asignacion.IdAsignaciones.toString() === searchTerm.trim();
    }
    const fullName = asignacion.Usuario
      ? `${asignacion.Usuario.Nombre || ""} ${
          asignacion.Usuario.Apellido || ""
        }`.toLowerCase()
      : "";

    return (
      asignacion.Observacion?.toLowerCase().includes(searchTermLower) ||
      (asignacion.FechaAsignacion &&
        formatDate(asignacion.FechaAsignacion).includes(searchTerm)) ||
      (asignacion.FechaDevolucion &&
        formatDate(asignacion.FechaDevolucion).includes(searchTerm)) ||
      fullName.includes(searchTermLower) ||
      asignacion.Item?.toLowerCase().includes(searchTermLower)
    );
  });
  const sortedAsignaciones = [...filteredAsignaciones].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAsignaciones = sortedAsignaciones.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(sortedAsignaciones.length / itemsPerPage);
  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };
  const exportToPDF = async () => {
    try {
      const getBase64FromUrl = async (url) => {
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      };
      const senaLogoBase64 = await getBase64FromUrl("/logosena.png");
      const doc = new jsPDF();
      doc.addImage(senaLogoBase64, "PNG", 15, 10, 30, 25);

      doc.setFontSize(22);
      doc.setTextColor(57, 181, 74);
      doc.setFont(undefined, "bold");
      doc.text("Inventario CTGI", 105, 25, { align: "center" });

      doc.setFontSize(18);
      doc.setTextColor(0, 0, 0);
      doc.setFont(undefined, "bold");
      doc.text("Historial de asignaciones", 15, 45);

      doc.setFontSize(12);
      doc.setFont(undefined, "bold");
      doc.text(`Fecha:`, 15, 55);
      doc.text(`Total:`, 15, 63);

      doc.setFont(undefined, "normal");
      doc.text(`${new Date().toLocaleDateString("es-ES")}`, 40, 55);
      doc.text(`${sortedAsignaciones.length}`, 40, 63);

      doc.setFontSize(13);
      doc.setFont(undefined, "bold");
      doc.text("Descripción:", 15, 73);
      doc.setFontSize(11);
      doc.setFont(undefined, "normal");
      doc.text(
        "Este reporte contiene el historial de asignaciones de equipos y productos a los usuarios, incluyendo fechas, cantidades, observaciones y estado.",
        15,
        80,
        { maxWidth: 180 }
      );

      const tableData = sortedAsignaciones.map((asig) => [
        String(asig.IdAsignaciones || ""),
        asig.Nombre || "",
        asig.Apellido || "",
        asig.Documento || "",
        asig.FechaAsignacion || "",
        asig.HoraAsignacion || "",
        asig.Observacion || "",
        asig.Item || "",
        asig.Cantidad || "",
        asig.Estado || "",
      ]);

      autoTable(doc, {
        head: [
          [
            "ID",
            "Nombre",
            "Apellido",
            "Documento",
            "Fecha Asign.",
            "Hora Asign.",
            "Observación",
            "Item",
            "Cantidad",
            "Estado",
          ],
        ],
        body: tableData,
        startY: 90,
        styles: {
          fontSize: 9,
          cellPadding: 2,
        },
        headStyles: {
          fillColor: [57, 181, 74],
          textColor: 255,
          fontStyle: "bold",
        },
      });

      const fileName = `asignaciones_${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      doc.save(fileName);

      Swal.fire({
        icon: "success",
        title: "PDF generado",
        text: "El archivo PDF se ha descargado correctamente",
        showConfirmButton: true,
        confirmButtonText: "Ok",
      });
    } catch (error) {
      console.error("Error detallado al generar PDF:", error);
      Swal.fire({
        icon: "error",
        title: "Error al generar PDF",
        text: `Error: ${error.message}`,
        showConfirmButton: true,
      });
    }
  };
  const exportToExcel = () => {
    try {
      const wsData = [
        [
          "ID",
          "Nombre",
          "Apellido",
          "Documento",
          "Fecha Asign.",
          "Hora Asign.",
          "Observación",
          "Item",
          "Cantidad",
          "Estado",
        ],
        ...sortedAsignaciones.map((asig) => [
          asig.IdAsignaciones || "",
          asig.Nombre || "",
          asig.Apellido || "",
          asig.Documento || "",
          asig.FechaAsignacion || "",
          asig.HoraAsignacion || "",
          asig.Observacion || "",
          asig.Item || "",
          asig.Cantidad || "",
          asig.Estado || "",
        ]),
      ];
      const worksheet = XLSX.utils.aoa_to_sheet(wsData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Asignaciones");
      const fileName = `asignaciones_${
        new Date().toISOString().split("T")[0]
      }.xlsx`;
      XLSX.writeFile(workbook, fileName);
      Swal.fire({
        icon: "success",
        title: "Excel generado",
        text: "El archivo Excel se ha descargado correctamente",
        showConfirmButton: true,
      });
    } catch (error) {
      console.error("Error al generar Excel:", error);
      Swal.fire({
        icon: "error",
        title: "Error al generar Excel",
        text: `Error: ${error.message}`,
        showConfirmButton: true,
      });
    }
  };
  return {
    // Estados existentes
    asignaciones,
    usuarios,
    showModal,
    ambientes,
    showNovedadModal,
    selectedNovedad,
    showDetailsModal,
    showAmbientesPanel,
    selectedAsignacion,
    formTouched,
    newAsignacion,
    currentPage,
    searchTerm,
    ambienteSearchTerm,
    filteredAmbientes,
    sortConfig,
    barcodeMode,
    scannedEquipment,
    showBarcodeInstructions,
    currentAsignaciones,
    sortedAsignaciones,
    indexOfFirstItem,
    indexOfLastItem,
    totalPages,
    showEquipmentsModal,
    selectedEquipments,
    showObservacionesModal,
    showNovedadesDevolucionModal,
    equiposConDetalles,
    verificarDisponibilidadAmbiente,
    // 👇 NUEVOS ESTADOS PARA CONSUMIBLES
    productosConsumibles,
    showConsumiblesPanel,
    consumibleSearchTerm,
    selectedConsumibles,
    filteredConsumibles,
    showObservacionesConsumiblesModal,
    showNovedadesConsumiblesModal,
    consumiblesConDetalles,
    equiposDanados,
    ESTADOS_EQUIPOS,
    // Funciones existentes
    setSearchTerm,
    setShowModal,
    setShowNovedadModal,
    setSelectedNovedad,
    setShowDetailsModal,
    setShowAmbientesPanel,
    setSelectedAsignacion,
    setAmbienteSearchTerm,
    setFormTouched,
    setNewAsignacion,
    setBarcodeMode,
    setScannedEquipment,
    setShowBarcodeInstructions,
    handleBarcodeScan,
    handleUsuarioChange,
    handleCreateAsignacion,
    handleEditAsignacion,
    handleDeleteAsignacion,
    handleConfirmarDevolucion,
    handleShowNovedad,
    handleShowDetails,
    handleSelectAmbiente,
    requestSort,
    paginate,
    exportToPDF,
    exportToExcel,
    getTodayLocal,
    formatDate,
    handleRemoveScannedEquipment,
    setShowEquipmentsModal,
    handleShowEquipments,
    setShowObservacionesModal,
    handleOpenObservacionesModal,
    handleUpdateObservacionEquipo,
    setShowNovedadesDevolucionModal,
    handleUpdateNovedadEquipo,
    handleProcesarDevolucion,

    // NUEVAS FUNCIONES PARA CONSUMIBLES
    setShowConsumiblesPanel,
    setConsumibleSearchTerm,
    setSelectedConsumibles,
    handleSelectConsumible,
    handleRemoveConsumible,
    setShowObservacionesConsumiblesModal,
    handleOpenObservacionesConsumiblesModal,
    handleUpdateObservacionConsumible,
    setShowNovedadesConsumiblesModal,
    handleUpdateNovedadConsumible,
    handleProcesarDevolucionConsumibles,

    // NUEVAS FUNCIONES PARA EQUIPOS DAÑADOS
    handleToggleEquipoDanado,
    verificarDisponibilidadEquipos,
  };
};

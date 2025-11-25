import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import configAxios from "../api/configAxios";

export const useAsignaciones = () => {
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
    fetchProductosConsumibles(); // 👈 NUEVO
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

  const handleSelectAmbiente = (ambiente) => {
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

  // Filtrar ambientes por búsqueda
  const filteredAmbientes = ambientes.filter(
    (amb) =>
      amb.nombre?.toLowerCase().includes(ambienteSearchTerm.toLowerCase()) ||
      amb.codigo?.toString().includes(ambienteSearchTerm)
  );

  // 👇 FILTRAR CONSUMIBLES POR BÚSQUEDA
  const filteredConsumibles = productosConsumibles.filter(
    (prod) =>
      prod.Nombre?.toLowerCase().includes(consumibleSearchTerm.toLowerCase()) &&
      prod.CantidadDisponible > 0
  );

  const handleBarcodeScan = async (scannedCode) => {
    if (!showModal) return;

    try {
      if (barcodeMode === "user") {
        const usuario = usuarios.find(
          (u) => String(u.NumeroDocumento).trim() === String(scannedCode).trim()
        );

        if (usuario) {
          setNewAsignacion({
            ...newAsignacion,
            IdUsuario: usuario.IdUsuario.toString(),
            Nombre: usuario.Nombre,
            Apellido: usuario.Apellido,
            Documento: usuario.NumeroDocumento || "",
          });

          Swal.fire({
            icon: "success",
            title: "Usuario encontrado",
            text: `${usuario.Nombre} ${usuario.Apellido}`,
            timer: 2000,
            showConfirmButton: false,
          });

          setBarcodeMode("equipment");
          setShowBarcodeInstructions(true);
          setTimeout(() => setShowBarcodeInstructions(false), 3000);
        } else {
          Swal.fire({
            icon: "warning",
            title: "Usuario no encontrado",
            text: "No se encontró un usuario con ese documento",
            showConfirmButton: true,
            confirmButtonText: "Cerrar",
          });
        }
      } else if (barcodeMode === "equipment") {
        const existingEquipment = scannedEquipment.find(
          (eq) => eq.code === scannedCode
        );

        if (existingEquipment) {
          Swal.fire({
            icon: "warning",
            title: "Equipo duplicado",
            text: `El equipo con código ${scannedCode} ya fue escaneado.`,
            showConfirmButton: true,
            confirmButtonText: "Cerrar",
          });
        } else {
          setScannedEquipment((prev) => [
            ...prev,
            { code: scannedCode, quantity: 1, observacionInicial: "" },
          ]);
        }

        const totalQuantity =
          scannedEquipment.reduce((sum, eq) => sum + eq.quantity, 0) + 1;
        setNewAsignacion({
          ...newAsignacion,
          Cantidad: totalQuantity.toString(),
        });

        Swal.fire({
          icon: "success",
          title: "Equipo escaneado",
          text: `Código: ${scannedCode}`,
          showConfirmButton: true,
          confirmButtonText: "Ok",
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

    // 👇 VALIDACIÓN CONDICIONAL DE AMBIENTE
    if (newAsignacion.Item === "Equipo Tecnologico") {
      requiredFields.Ambiente = "Ambiente";
    }

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

      setScannedEquipment([]);
      setSelectedConsumibles([]); // 👈 LIMPIAR CONSUMIBLES
      setBarcodeMode("user");
      setShowModal(false);
      setShowObservacionesModal(false);
      setShowObservacionesConsumiblesModal(false); // 👈 NUEVO
      fetchAsignaciones();
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
      confirmButtonText: "#3085d6",
      cancelButtonText: "#d33",
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
        fetchAsignaciones();
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
        },
        { withCredentials: true }
      );

      await fetchAsignaciones();
      setShowNovedadesDevolucionModal(false);
      setEquiposConDetalles([]);

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
    // 👇 NUEVOS ESTADOS PARA CONSUMIBLES
    productosConsumibles,
    showConsumiblesPanel,
    consumibleSearchTerm,
    selectedConsumibles,
    filteredConsumibles,
    showObservacionesConsumiblesModal,
    showNovedadesConsumiblesModal,
    consumiblesConDetalles,

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

    // 👇 NUEVAS FUNCIONES PARA CONSUMIBLES
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
  };
};

import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

export const useAsignaciones = () => {
  const [asignaciones, setAsignaciones] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showNovedadModal, setShowNovedadModal] = useState(false);
  const [selectedNovedad, setSelectedNovedad] = useState("");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedAsignacion, setSelectedAsignacion] = useState(null);
  const [formTouched, setFormTouched] = useState(false);
  const [newAsignacion, setNewAsignacion] = useState({
    IdUsuario: "",
    Usuario: "",
    Nombre: "",
    Apellido: "",
    Documento: "",
    FechaAsignacion: "",
    HoraAsignacion: "",
    Observacion: "",
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
  const [barcodeMode, setBarcodeMode] = useState("user"); // 'user' o 'equipment'
  const [scannedEquipment, setScannedEquipment] = useState([]);
  const [showBarcodeInstructions, setShowBarcodeInstructions] = useState(false);

  useEffect(() => {
    fetchAsignaciones();
    fetchUsuarios();
  }, []);

  const fetchAsignaciones = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/asignaciones",
        { withCredentials: true }
      );
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

  // Función para obtener los usuarios
  const fetchUsuarios = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/usuarios", {
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

  // Función para manejar códigos de barras escaneados
  const handleBarcodeScan = async (scannedCode) => {
    if (!showModal) return; // Solo procesar si el modal está abierto

    try {
      if (barcodeMode === "user") {
        // Buscar usuario por documento
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
            Usuario: usuario.Usuario || "",
          });

          Swal.fire({
            icon: "success",
            title: "Usuario encontrado",
            text: `${usuario.Nombre} ${usuario.Apellido}`,
            timer: 2000,
            showConfirmButton: false,
          });

          // Cambiar automáticamente a modo equipo después de escanear usuario
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
        // Agregar equipo escaneado a la lista
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
          // Agregar nuevo equipo
          setScannedEquipment((prev) => [
            ...prev,
            { code: scannedCode, quantity: 1 },
          ]);
        }

        // Actualizar cantidad total
        const totalQuantity = scannedEquipment.reduce((sum, eq) => sum + eq.quantity, 0) + 1;
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

  // Función para eliminar un equipo escaneado
  const handleRemoveScannedEquipment = (codeToRemove) => {
    const updatedEquipment = scannedEquipment.filter(eq => eq.code !== codeToRemove);
    setScannedEquipment(updatedEquipment);

    // Actualizar cantidad total (número de equipos únicos)
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

  // Llenar automáticamente Nombre, Apellido y Documento al seleccionar usuario
  const handleUsuarioChange = (e) => {
    const selectedId = e.target.value;
    const usuario = usuarios.find((u) => u.IdUsuario.toString() === selectedId);
    setNewAsignacion({
      ...newAsignacion,
      IdUsuario: selectedId,
      Nombre: usuario ? usuario.Nombre : "",
      Apellido: usuario ? usuario.Apellido : "",
      Documento: usuario ? usuario.NumeroDocumento || "" : "",
      Usuario: usuario ? usuario.Usuario || "" : "",
    });
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

    // Si Observacion está vacío, ponerle automáticamente "ninguna observación"
    if (!newAsignacion.Observacion || !newAsignacion.Observacion.trim()) {
      newAsignacion.Observacion = "ninguna observación";
    }

    if (missingFields.length > 0) {
      Swal.fire({
        icon: "warning",
        title: "Campos requeridos",
        text: `Por favor complete los siguientes campos: ${missingFields.join(", ")}`,
        showConfirmButton: true,
        confirmButtonText: "Cerrar",
      });
      return;
    }

    // Validación de fecha de devolución
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
        // Modo edición - mantener las fechas/horas existentes
        await axios.put(
          `http://localhost:3000/api/asignaciones/${newAsignacion.IdAsignaciones}`,
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
        // Modo creación - establecer fecha/hora actual automáticamente
        const now = new Date();

        // Formatear fecha como YYYY-MM-DD
        const today = now.toISOString().split('T')[0];
        // Formatear hora como HH:MM:SS
        const currentTime = now.toTimeString().split(' ')[0];

        const asignacionData = {
          ...newAsignacion,
          FechaAsignacion: today, // Se establece automáticamente
          HoraAsignacion: currentTime, // Se establece automáticamente
          FechaDevolucion: null, // Debe ser null al crear
          HoraDevolucion: null // Debe ser null al crear
        };

        await axios.post(
          "http://localhost:3000/api/asignaciones",
          asignacionData,
          { withCredentials: true }
        );
        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: "Asignación creada correctamente",
          showConfirmButton: true,
          confirmButtonText: "Ok",
        });
      }

      setScannedEquipment([]); // Limpiar equipos escaneados
      setBarcodeMode("user"); // Resetear modo
      setShowModal(false);
      fetchAsignaciones();
      setNewAsignacion({
        IdUsuario: "",
        Nombre: "",
        Apellido: "",
        Documento: "",
        FechaAsignacion: "",
        HoraAsignacion: "",
        Observacion: "",
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
        text: error.response?.data?.message || "Ocurrió un error al guardar la asignación",
        showConfirmButton: true,
        confirmButtonText: "Cerrar",
      });
      console.error(error);
    }
  };

  const handleEditAsignacion = async (asignacion) => {
    // Formatear las fechas para el input date
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
      confirmButtonText: "#d33",
      cancelButtonText: "#3085d6",
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
      reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:3000/api/asignaciones/${id}`, {
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

  // Función para confirmar devolución de una asignación
  const handleConfirmarDevolucion = async (id) => {
    const { value: hasNovedad } = await Swal.fire({
      title: "¿Hay alguna novedad que reportar?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "No",
      reverseButtons: true
    });

    let novedad = "";
    if (hasNovedad) {
      const { value: novedadInput } = await Swal.fire({
        title: "Describe la novedad",
        input: "textarea",
        inputLabel: "Novedad",
        inputPlaceholder: "Escribe aquí la novedad...",
        inputAttributes: {
          'aria-label': 'Escribe aquí la novedad'
        },
        showCancelButton: true,
        confirmButtonText: "Guardar",
        cancelButtonText: "Cancelar",
        inputValidator: (value) => {
          if (!value) {
            return "Debes escribir una novedad";
          }
        }
      });

      if (novedadInput) {
        novedad = novedadInput;
      } else {
        return; // Usuario canceló
      }
    }

    try {
      const now = new Date();
      const FechaDevolucion = getTodayLocal();
      const HoraDevolucion = now.toTimeString().split(" ")[0].substring(0, 8);

      await axios.patch(
        `http://localhost:3000/api/asignaciones/${id}/confirmar-devolucion`,
        {
          FechaDevolucion,
          HoraDevolucion,
          Estado: "Inactivo",
          Novedad: novedad || null,
        },
        { withCredentials: true }
      );

      await fetchAsignaciones();

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

  // Formatear fecha para mostrar en formato legible
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

  // Funciones para la tabla mejorada
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
      ? `${asignacion.Usuario.Nombre || ""} ${asignacion.Usuario.Apellido || ""
        }`.toLowerCase()
      : "";

    const userName = asignacion.Usuario?.Usuario?.toLowerCase() || "";

    return (
      asignacion.Observacion?.toLowerCase().includes(searchTermLower) ||
      (asignacion.FechaAsignacion &&
        formatDate(asignacion.FechaAsignacion).includes(searchTerm)) ||
      (asignacion.FechaDevolucion &&
        formatDate(asignacion.FechaDevolucion).includes(searchTerm)) ||
      fullName.includes(searchTermLower) ||
      userName.includes(searchTermLower) ||
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

  // Paginación
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
      // Cargar el logo y convertirlo a base64
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

      // --- LOGO SENA ---
      doc.addImage(senaLogoBase64, "PNG", 15, 10, 30, 25);

      // --- TÍTULO EN VERDE CENTRADO ---
      doc.setFontSize(22);
      doc.setTextColor(57, 181, 74); // Verde SENA
      doc.setFont(undefined, "bold");
      doc.text("Inventario CTGI", 105, 25, { align: "center" });

      // --- SUBTÍTULO EN NEGRO ---
      doc.setFontSize(18);
      doc.setTextColor(0, 0, 0);
      doc.setFont(undefined, "bold");
      doc.text("Historial de asignaciones", 15, 45);

      // --- FECHA Y TOTAL ---
      doc.setFontSize(12);
      doc.setFont(undefined, "bold");
      doc.text(`Fecha:`, 15, 55);
      doc.text(`Total:`, 15, 63);

      doc.setFont(undefined, "normal");
      doc.text(`${new Date().toLocaleDateString("es-ES")}`, 40, 55);
      doc.text(`${sortedAsignaciones.length}`, 40, 63);

      // --- DESCRIPCIÓN ---
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

      // --- TABLA ---
      const tableData = sortedAsignaciones.map((asig) => [
        String(asig.IdAsignaciones || ""),
        asig.Usuario?.Usuario || "",
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
            "Usuario",
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
          fillColor: [57, 181, 74], // Verde SENA
          textColor: 255,
          fontStyle: "bold",
        },
      });

      const fileName = `asignaciones_${new Date().toISOString().split("T")[0]
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
          "Usuario",
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
          asig.Usuario?.Usuario || "",
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

      const fileName = `asignaciones_${new Date().toISOString().split("T")[0]
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
    // Estados
    asignaciones,
    usuarios,
    showModal,
    showNovedadModal,
    selectedNovedad,
    showDetailsModal,
    selectedAsignacion,
    formTouched,
    newAsignacion,
    currentPage,
    searchTerm,
    sortConfig,
    barcodeMode,
    scannedEquipment,
    showBarcodeInstructions,
    currentAsignaciones,
    sortedAsignaciones,
    indexOfFirstItem,
    indexOfLastItem,
    totalPages,
    // Funciones
    setSearchTerm,
    setShowModal,
    setShowNovedadModal,
    setSelectedNovedad,
    setShowDetailsModal,
    setSelectedAsignacion,
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
    requestSort,
    paginate,
    exportToPDF,
    exportToExcel,
    getTodayLocal,
    formatDate,
    handleRemoveScannedEquipment,
  };
};
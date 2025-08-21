import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
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
    FechaDevolucion: "",
    HoraDevolucion: "",
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
      toast.error("Error al cargar las asignaciones", {
        position: "top-right",
        autoClose: 3000,
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
      toast.error("Error al cargar los usuarios", {
        position: "top-right",
        autoClose: 3000,
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

          toast.success(`Usuario encontrado: ${usuario.Nombre} ${usuario.Apellido}`, {
            position: "top-right",
            autoClose: 2000,
          });

          // Cambiar automáticamente a modo equipo después de escanear usuario
          setBarcodeMode("equipment");
          setShowBarcodeInstructions(true);
          setTimeout(() => setShowBarcodeInstructions(false), 3000);
        } else {
          toast.warning("No se encontró un usuario con ese documento", {
            position: "top-right",
            autoClose: 2500,
          });
        }
      } else if (barcodeMode === "equipment") {
        // Agregar equipo escaneado a la lista
        const existingEquipment = scannedEquipment.find(
          (eq) => eq.code === scannedCode
        );

        if (existingEquipment) {
          // Incrementar cantidad si ya existe
          setScannedEquipment((prev) =>
            prev.map((eq) =>
              eq.code === scannedCode
                ? { ...eq, quantity: eq.quantity + 1 }
                : eq
            )
          );
        } else {
          // Agregar nuevo equipo
          setScannedEquipment((prev) => [
            ...prev,
            { code: scannedCode, quantity: 1 },
          ]);
        }

        // Actualizar cantidad total
        const totalQuantity =
          scannedEquipment.reduce((sum, eq) => sum + eq.quantity, 0) + 1;
        setNewAsignacion({
          ...newAsignacion,
          Cantidad: totalQuantity.toString(),
        });

        toast.success(`Equipo escaneado: ${scannedCode}`, {
          position: "top-right",
          autoClose: 1500,
        });
      }
    } catch (error) {
      console.error("Error al procesar código de barras:", error);
      toast.error("Error al procesar el código escaneado", {
        position: "top-right",
        autoClose: 3000,
      });
    }
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
      Observacion: "Observación",
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

    if (missingFields.length > 0) {
      toast.warning(`Por favor complete los siguientes campos: ${missingFields.join(", ")}`, {
        position: "top-right",
        autoClose: 4000,
      });
      return;
    }

    // Validación de fecha de devolución
    if (newAsignacion.FechaDevolucion && newAsignacion.FechaAsignacion) {
      if (
        new Date(newAsignacion.FechaDevolucion) <
        new Date(newAsignacion.FechaAsignacion)
      ) {
        toast.warning("La fecha de devolución no puede ser anterior a la fecha de asignación", {
          position: "top-right",
          autoClose: 4000,
        });
        return;
      }
    }

    try {
      if (newAsignacion.IdAsignaciones) {
        await axios.put(
          `http://localhost:3000/api/asignaciones/${newAsignacion.IdAsignaciones}`,
          newAsignacion,
          { withCredentials: true }
        );
        toast.success("Asignación actualizada correctamente", {
          position: "top-right",
          autoClose: 2500,
        });
      } else {
        const now = new Date();
        newAsignacion.FechaAsignacion =
          newAsignacion.FechaAsignacion || now.toISOString().split("T")[0];
        newAsignacion.HoraAsignacion =
          newAsignacion.HoraAsignacion || now.toTimeString().split(" ")[0];

        await axios.post(
          "http://localhost:3000/api/asignaciones",
          newAsignacion,
          { withCredentials: true }
        );
        toast.success("Asignación creada correctamente", {
          position: "top-right",
          autoClose: 2500,
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
        FechaDevolucion: "",
        HoraDevolucion: "",
        Novedad: "",
        Cantidad: "",
        Item: "",
        Estado: "Activo",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Ocurrió un error al guardar la asignación", {
        position: "top-right",
        autoClose: 4000,
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

    toast.info("Modo edición activado", {
      position: "top-right",
      autoClose: 2000,
    });
  };
  
  const handleDeleteAsignacion = async (id) => {
    const confirmDelete = await new Promise((resolve) => {
      toast.warning(
        ({ closeToast }) => (
          <div>
            <p>¿Estás seguro de eliminar esta asignación?</p>
            <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
              <button
                onClick={() => {
                  resolve(true);
                  closeToast();
                }}
                style={{
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Sí, eliminar
              </button>
              <button
                onClick={() => {
                  resolve(false);
                  closeToast();
                }}
                style={{
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        ),
        {
          position: "top-right",
          autoClose: false,
          closeOnClick: false,
          draggable: false,
        }
      );
    });

    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:3000/api/asignaciones/${id}`, {
          withCredentials: true,
        });
        fetchAsignaciones();
        toast.success("Asignación eliminada correctamente", {
          position: "top-right",
          autoClose: 2500,
        });
      } catch (error) {
        toast.error("Ocurrió un error al eliminar la asignación", {
          position: "top-right",
          autoClose: 3000,
        });
        console.error("Error al eliminar asignación:", error);
      }
    }
  };

  // Función para confirmar devolución de una asignación
  const handleConfirmarDevolucion = async (id) => {
    const hasNovedad = await new Promise((resolve) => {
      toast.info(
        ({ closeToast }) => (
          <div>
            <p>¿Hay alguna novedad que reportar?</p>
            <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
              <button
                onClick={() => {
                  resolve(true);
                  closeToast();
                }}
                style={{
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Sí
              </button>
              <button
                onClick={() => {
                  resolve(false);
                  closeToast();
                }}
                style={{
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                No
              </button>
            </div>
          </div>
        ),
        {
          position: "top-right",
          autoClose: false,
          closeOnClick: false,
          draggable: false,
        }
      );
    });

    let novedad = "";
    if (hasNovedad) {
      novedad = await new Promise((resolve) => {
        let inputValue = "";
        toast.info(
          ({ closeToast }) => (
            <div>
              <p>Describe la novedad:</p>
              <textarea
                placeholder="Escribe aquí la novedad..."
                style={{
                  width: '100%',
                  minHeight: '60px',
                  margin: '10px 0',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ccc'
                }}
                onChange={(e) => { inputValue = e.target.value; }}
              />
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  onClick={() => {
                    resolve(inputValue);
                    closeToast();
                  }}
                  style={{
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Guardar
                </button>
                <button
                  onClick={() => {
                    resolve(null);
                    closeToast();
                  }}
                  style={{
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          ),
          {
            position: "top-right",
            autoClose: false,
            closeOnClick: false,
            draggable: false,
          }
        );
      });

      if (novedad === null) return; // Usuario canceló
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

      toast.success("Devolución registrada exitosamente", {
        position: "top-right",
        autoClose: 2500,
      });
    } catch (error) {
      console.error("Error completo:", error.response?.data);
      toast.error(error.response?.data?.message || "Error al confirmar devolución", {
        position: "top-right",
        autoClose: 3000,
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

      toast.success("PDF generado y descargado correctamente", {
        position: "top-right",
        autoClose: 2500,
      });
    } catch (error) {
      console.error("Error detallado al generar PDF:", error);
      toast.error(`Error al generar PDF: ${error.message}`, {
        position: "top-right",
        autoClose: 4000,
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

      toast.success("Excel generado y descargado correctamente", {
        position: "top-right",
        autoClose: 2500,
      });
    } catch (error) {
      console.error("Error al generar Excel:", error);
      toast.error(`Error al generar Excel: ${error.message}`, {
        position: "top-right",
        autoClose: 4000,
      });
    }
  };

  return {
    // Estados
    asignaciones, usuarios, showModal, showNovedadModal, selectedNovedad,
    showDetailsModal, selectedAsignacion, formTouched, newAsignacion,
    currentPage, searchTerm, sortConfig, barcodeMode, scannedEquipment,
    showBarcodeInstructions, currentAsignaciones, sortedAsignaciones,
    indexOfFirstItem, indexOfLastItem, totalPages,
    // Funciones
    setSearchTerm, setShowModal, setShowNovedadModal, setSelectedNovedad,
    setShowDetailsModal, setSelectedAsignacion, setFormTouched, setNewAsignacion,
    setBarcodeMode, setScannedEquipment, setShowBarcodeInstructions,
    handleBarcodeScan, handleUsuarioChange, handleCreateAsignacion,
    handleEditAsignacion, handleDeleteAsignacion, handleConfirmarDevolucion,
    handleShowNovedad, handleShowDetails, requestSort, paginate,
    exportToPDF, exportToExcel, getTodayLocal, formatDate
  };
};
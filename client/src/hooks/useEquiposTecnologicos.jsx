import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import axios from "axios";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";


// Hook personalizado para gestionar equipos tecnológicos
export const useEquiposTecnologicos = () => {

  // Estados del hook 
  const [equipos, setEquipos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: "idequipostecnologicos",
    direction: "ascending",
  });

  // Estados para paginación y búsqueda
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 8;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    setError,
    clearErrors
  } = useForm({
    defaultValues: {
      Codigo: "",
      Nombre: "",
      Marca: "",
      Modelo: "",
      Estado: "Activo" // Valor por defecto
    }
  });

  useEffect(() => {
    fetchEquipos();
  }, []);

  const fetchEquipos = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:3000/api/equipostecnologicos",
        { withCredentials: true }
      );
      setEquipos(response.data);
    } catch (error) {
      console.error("Error al obtener equipos tecnológicos:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar los equipos tecnológicos",
        showConfirmButton: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Función para verificar si el código ya existe
  const checkCodigoExists = async (codigo, excludeId = null) => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/equipostecnologicos",
        { withCredentials: true }
      );
      const equipos = response.data;
      const equipoExistente = equipos.find(
        equipo => 
          equipo.Codigo === codigo && 
          equipo.idequipostecnologicos !== excludeId
      );
      return !!equipoExistente;
    } catch (error) {
      console.error("Error al verificar código:", error);
      return false;
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      
      const equipoId = watch('idequipostecnologicos');
      // Eliminar espacios al inicio y final del código
      const codigo = data.Codigo.trim();

      // Verificar si el código ya existe (excepto para el equipo actual en edición)
      const codigoExiste = await checkCodigoExists(codigo, equipoId);
      
      if (codigoExiste) {
        setError('Codigo', {
          type: 'manual',
          message: 'Este código ya está en uso. Por favor ingrese un código único.'
        });
        setLoading(false);
        return;
      }

      // Limpiar error de código si existe
      clearErrors('Codigo');

      const equipoData = {
        Codigo: codigo,
        Nombre: data.Nombre.trim(),
        Marca: data.Marca.trim(),
        Modelo: data.Modelo.trim(),
        Estado: data.Estado || "Activo"
        // Se eliminaron IdCodigoBarras e IdEstado
      };

      if (equipoId) {
        // Modo edición
        await axios.put(
          `http://localhost:3000/api/equipostecnologicos/${equipoId}`,
          equipoData,
          { withCredentials: true }
        );
        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: "El equipo se actualizó correctamente.",
          showConfirmButton: false,
          timer: 2000
        });
      } else {
        // Modo creación
        await axios.post(
          "http://localhost:3000/api/equipostecnologicos",
          equipoData,
          { withCredentials: true }
        );
        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: "El equipo se creó correctamente.",
          showConfirmButton: false,
          timer: 2000
        });
      }
      
      handleCloseModal();
      fetchEquipos();
    } catch (error) {
      console.error("Error al guardar equipo:", error);
      
      let errorMessage = "Ocurrió un error al guardar el equipo.";
      
      if (error.response?.status === 400) {
        errorMessage = error.response.data?.message || "Datos inválidos. Verifique la información.";
      } else if (error.response?.status === 409) {
        errorMessage = "El código del equipo ya existe. Por favor use un código único.";
      } else if (error.response?.status === 500) {
        errorMessage = "Error del servidor. Intente nuevamente.";
      }
      
      // Mostrar mensaje de error específico
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        showConfirmButton: true,
      });

      // Si el error es por código duplicado, establecer error en el campo
    } finally {
      setLoading(false);
    }
  };

  const handleEditEquipo = (equipo) => {

    // Rellenar el formulario con los datos del equipo a editar
    reset({
      idequipostecnologicos: equipo.idequipostecnologicos,
      Codigo: equipo.Codigo || "",
      Nombre: equipo.Nombre || "",
      Marca: equipo.Marca || "",
      Modelo: equipo.Modelo || "",
      Estado: equipo.Estado || "Activo"
    });
    setShowModal(true);

  };


// Función para eliminar un equipo con confirmación
  const handleDeleteEquipo = async (id) => {
    // Mostrar alerta de confirmación
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer. El equipo será eliminado permanentemente.",
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
        setLoading(true);
        await axios.delete(
          `http://localhost:3000/api/equipostecnologicos/${id}`,
          { withCredentials: true }
        );
        
        Swal.fire({
          icon: "success",
          title: "¡Eliminado!",
          text: "El equipo fue eliminado correctamente.",
          showConfirmButton: false,
          timer: 1500
        });
        
        fetchEquipos();
      } catch (error) {
        console.error("Error al eliminar equipo:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data?.message || "No se pudo eliminar el equipo. Puede que esté en uso.",
          showConfirmButton: true,
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsScanning(false);
    reset();
    clearErrors();
  };

  const handleBarcodeScanned = (barcode) => {
    // Eliminar espacios en blanco y validar
    if (barcode && barcode.trim() !== '') {
      const codigoLimpio = barcode.trim();
      setValue('Codigo', codigoLimpio);
      setIsScanning(false);
      
      // Validar inmediatamente si el código existe
      checkCodigoExists(codigoLimpio).then(existe => {
        if (existe) {
          setError('Codigo', {
            type: 'manual',
            message: 'Este código ya está en uso. Escanee otro código.'
          });
          Swal.fire({
            icon: 'warning',
            title: 'Código Duplicado',
            text: `El código ${codigoLimpio} ya existe. Use un código único.`,
            timer: 3000,
            showConfirmButton: false
          });
        } else {
          clearErrors('Codigo');
          Swal.fire({
            icon: 'success',
            title: 'Código Escaneado',
            text: `Código: ${codigoLimpio}`,
            timer: 1500,
            showConfirmButton: false
          });
        }
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error de Escaneo',
        text: 'No se pudo leer el código. Inténtelo de nuevo.',
        timer: 2000,
        showConfirmButton: false
      });
    }
  };

  const handleNewEquipo = () => {
    reset({
      Codigo: "",
      Nombre: "",
      Marca: "",
      Modelo: "",
      Estado: "Activo"
    });
    clearErrors();
    setShowModal(true);
  };

  // Tabla y paginación
  const requestSort = (key) => {
    // Determinar la dirección de ordenamiento
    let direction = "ascending";

    // Si ya está ordenado por esta clave, invertir la dirección
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }

    // Actualizar el estado de ordenamiento
    setSortConfig({ key, direction });
  };


  // Filtrar equipos según el término de búsqueda
  const filteredEquipos = equipos.filter((equipo) => {
    if (!searchTerm) return true;
    

    // Convertir el término de búsqueda a minúsculas para comparación insensible a mayúsculas
    const searchTermLower = searchTerm.toLowerCase();
    return (

      // Verificar si el término de búsqueda está en alguno de los campos relevantes
      (equipo.Nombre?.toLowerCase().includes(searchTermLower)) ||
      (equipo.Marca?.toLowerCase().includes(searchTermLower)) ||
      (equipo.Modelo?.toLowerCase().includes(searchTermLower)) ||
      (equipo.Codigo?.toString().toLowerCase().includes(searchTermLower)) ||
      (equipo.Estado?.toLowerCase().includes(searchTermLower))
    );
  });


  // Ordenar los equipos filtrados según la configuración de ordenamiento
  const sortedEquipos = [...filteredEquipos].sort((a, b) => {
    if (!a[sortConfig.key] && !b[sortConfig.key]) return 0;
    if (!a[sortConfig.key]) return 1;
    if (!b[sortConfig.key]) return -1;
    

    // Comparar los valores para determinar el orden
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });


  // Calcular los índices para la paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEquipos = sortedEquipos.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedEquipos.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return {
    equipos: currentEquipos,
    showModal,
    handleCloseModal,
    handleSubmit,
    onSubmit,
    register,
    errors,
    handleEditEquipo,
    handleDeleteEquipo,
    handleNewEquipo,
    searchTerm,
    setSearchTerm,
    requestSort,
    sortConfig,
    currentPage,
    totalPages,
    paginate,
    isScanning,
    setIsScanning,
    handleBarcodeScanned,
    indexOfFirstItem,
    indexOfLastItem,
    sortedEquipos,
    watch,
    loading
    ,
    // Exportar a PDF
    exportToPDF: async () => {
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

        // --- LOGO SENA ---
        doc.addImage(senaLogoBase64, "PNG", 15, 10, 30, 25);

        // --- TÍTULO EN VERDE CENTRADO ---
        doc.setFontSize(22);
        doc.setTextColor(57, 181, 74);
        doc.setFont(undefined, "bold");
        doc.text("Inventario CTGI", 105, 25, { align: "center" });

        // --- SUBTÍTULO EN NEGRO ---
        doc.setFontSize(18);
        doc.setTextColor(0, 0, 0);
        doc.setFont(undefined, "bold");
        doc.text("Equipos tecnológicos", 15, 45);

        // --- FECHA Y TOTAL ---
        doc.setFontSize(12);
        doc.setFont(undefined, "bold");
        doc.text(`Fecha:`, 15, 55);
        doc.text(`Total:`, 15, 63);

        doc.setFont(undefined, "normal");
  doc.text(`${new Date().toLocaleDateString("es-ES")}`, 40, 55);
  doc.text(`${sortedEquipos.length}`, 40, 63);

        // --- DESCRIPCIÓN ---
        doc.setFontSize(13);
        doc.setFont(undefined, "bold");
        doc.text("Descripción:", 15, 73);
        doc.setFontSize(11);
        doc.setFont(undefined, "normal");
        doc.text(
          "Este reporte contiene la lista de equipos tecnológicos registrados en el sistema.",
          15,
          80,
          { maxWidth: 180 }
        );

        // --- TABLA ---
        const tableData = sortedEquipos.map((eq) => [
          String(eq.idequipostecnologicos || ""),
          eq.Codigo || "",
          eq.Nombre || "",
          eq.Marca || "",
          eq.Modelo || "",
          eq.Estado || ""
        ]);

        autoTable(doc, {
          head: [["ID", "Código", "Nombre", "Marca", "Modelo", "Estado"]],
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

        const fileName = `equipos_tecnologicos_${new Date().toISOString().split("T")[0]}.pdf`;
        doc.save(fileName);

        Swal.fire({
          icon: "success",
          title: "PDF generado",
          text: "El archivo PDF se ha descargado correctamente.",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error("Error al generar PDF:", error);
        Swal.fire({
          icon: "error",
          title: "Error al generar PDF",
          text: `Error: ${error.message}`,
          showConfirmButton: true,
        });
      }
    },
    // Exportar a Excel
    exportToExcel: () => {
      try {
        const wsData = [
          ["ID", "Código", "Nombre", "Marca", "Modelo", "Estado"],
          ...sortedEquipos.map((eq) => [
            eq.idequipostecnologicos || "",
            eq.Codigo || "",
            eq.Nombre || "",
            eq.Marca || "",
            eq.Modelo || "",
            eq.Estado || ""
          ]),
        ];

        const worksheet = XLSX.utils.aoa_to_sheet(wsData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "EquiposTecnologicos");

        const fileName = `equipos_tecnologicos_${new Date().toISOString().split("T")[0]}.xlsx`;
        XLSX.writeFile(workbook, fileName);

        Swal.fire({
          icon: "success",
          title: "Excel generado",
          text: "El archivo Excel se ha descargado correctamente.",
          timer: 2000,
          showConfirmButton: false,
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
    }
  };
};
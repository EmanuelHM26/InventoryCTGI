import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import configAxios from "../api/configAxios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useForm } from "react-hook-form";

export const useAmbientes = () => {
  const [ambientes, setAmbientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    trigger
  } = useForm({
    mode: "onChange",
    defaultValues: {
      codigo: "",
      nombre: ""
    }
  });

  useEffect(() => {
    fetchAmbientes();
  }, []);

  // Filtrado y paginación
  const filteredAmbientes = ambientes.filter(amb =>
    amb.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    amb.codigo?.toString().includes(searchTerm)
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAmbientes = filteredAmbientes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAmbientes.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  async function fetchAmbientes() {
    try {
      setLoading(true);
      const res = await configAxios.get("/api/ambientes");
      const ambientesConEstado = res.data.map(amb => ({
        ...amb,
        estado: amb.estado || "Disponible"
      }));
      setAmbientes(ambientesConEstado || []);
    } catch (err) {
      console.error("Error cargando ambientes:", err);
      Swal.fire({
        title: "No se pudieron cargar los ambientes.",
        text: err.response?.data?.message || err.message || "",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    } finally {
      setLoading(false);
    }
  }

  const openNew = () => {
    setEditing(null);
    reset({
      codigo: "",
      nombre: ""
    });
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setValue("codigo", item.codigo ?? "");
    setValue("nombre", item.nombre ?? "");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
    reset({
      codigo: "",
      nombre: ""
    });
  };

  const onSubmit = async (data) => {
    try {
      if (editing) {
        const payload = { 
          codigo: Number(data.codigo), 
          nombre: data.nombre.toString().trim()
        };
        const editingId = editing.idAmbiente || editing.id;
        await configAxios.put(`/api/ambientes/${editingId}`, payload);
        Swal.fire({ 
          title: "Ambiente actualizado", 
          text: `Se actualizó "${payload.nombre}"`, 
          icon: "success", 
          confirmButtonText: "Aceptar" 
        });
      } else {
        const payload = { 
          codigo: Number(data.codigo), 
          nombre: data.nombre.toString().trim(),
          estado: "Disponible"
        };
        await configAxios.post("/api/ambientes", payload);
        Swal.fire({ 
          title: "Ambiente creado", 
          text: `Se creó "${payload.nombre}"`, 
          icon: "success", 
          confirmButtonText: "Aceptar" 
        });
      }
      closeModal();
      fetchAmbientes();
    } catch (err) {
      console.error("Error guardando ambiente:", err);
      const serverMsg = err.response?.data?.message || err.message || "Error al guardar";
      Swal.fire({ 
        title: "Error al guardar", 
        text: `${err.response?.status || ""} - ${serverMsg}`, 
        icon: "error", 
        confirmButtonText: "Aceptar" 
      });
    }
  };

  const handleDelete = async (item) => {
    const result = await Swal.fire({
      title: "Eliminar ambiente",
      text: `¿Eliminar "${item.nombre}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "No",
    });
    if (!result.isConfirmed) return;
    try {
      const itemId = item.idAmbiente || item.id;
      await configAxios.delete(`/api/ambientes/${itemId}`);
      Swal.fire({ 
        title: "Ambiente eliminado", 
        text: `"${item.nombre}" eliminado.`, 
        icon: "success", 
        confirmButtonText: "Aceptar" 
      });
      setAmbientes(prev => prev.filter(a => (a.idAmbiente || a.id) !== itemId));
    } catch (err) {
      console.error("Error eliminando ambiente:", err);
      const serverMsg = err.response?.data?.message || err.message || "No se pudo eliminar";
      Swal.fire({ 
        title: "Error al eliminar", 
        text: serverMsg, 
        icon: "error", 
        confirmButtonText: "Aceptar" 
      });
    }
  };

  const getEstadoBadgeColor = (estado) => {
    const estadoNormalizado = estado || "Disponible";
    switch (estadoNormalizado) {
      case "Disponible":
        return "bg-green-100 text-green-800 border border-green-200";
      case "Asignado":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  // Funciones de exportación/importación
  const exportToExcel = () => {
    if (!ambientes || ambientes.length === 0) {
      Swal.fire("No hay datos", "No hay ambientes para exportar.", "info");
      return;
    }
    const data = ambientes.map(a => ({
      ID: a.idAmbiente ?? a.id,
      CODIGO: a.codigo,
      NOMBRE: a.nombre,
      ESTADO: a.estado || "Disponible"
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Ambientes");
    XLSX.writeFile(wb, `ambientes_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  const exportToPDF = () => {
    if (!ambientes || ambientes.length === 0) {
      Swal.fire("No hay datos", "No hay ambientes para exportar.", "info");
      return;
    }
    
    try {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text("Lista de Ambientes", 14, 15);
      
      const head = [["ID", "CÓDIGO", "NOMBRE", "ESTADO"]];
      const body = ambientes.map(a => [
        a.idAmbiente ?? a.id,
        a.codigo,
        a.nombre,
        a.estado || "Disponible"
      ]);
      
      autoTable(doc, {
        head: head,
        body: body,
        startY: 20,
        styles: { fontSize: 10 },
        headStyles: { 
          fillColor: [59, 130, 246],
          textColor: 255
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240]
        }
      });
      
      doc.save(`ambientes_${new Date().toISOString().slice(0,10)}.pdf`);
    } catch (error) {
      console.error("Error generando PDF:", error);
      Swal.fire("Error", "No se pudo generar el PDF.", "error");
    }
  };

  const importFromExcel = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validación de tipo de archivo
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      Swal.fire("Error", "Por favor, sube un archivo Excel válido (.xlsx, .xls, .csv)", "error");
      event.target.value = '';
      return;
    }

    // Validación de tamaño (5MB máximo)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      Swal.fire("Error", "El archivo es demasiado grande. Máximo 5MB permitido.", "error");
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);
        
        if (jsonData.length === 0) {
          Swal.fire("Archivo vacío", "El archivo Excel no contiene datos.", "warning");
          return;
        }
        
        processImportData(jsonData);
      } catch (error) {
        console.error("Error leyendo archivo Excel:", error);
        Swal.fire("Error", "No se pudo leer el archivo Excel.", "error");
      }
    };
    reader.readAsArrayBuffer(file);
    event.target.value = '';
  };

  const processImportData = async (jsonData) => {
    try {
      setLoading(true);
      let successCount = 0;
      let errorCount = 0;
      const errors = [];

      for (const item of jsonData) {
        try {
          const codigo = Number(item.CODIGO || item.codigo);
          const nombre = (item.NOMBRE || item.nombre)?.toString().trim();

          // Validaciones de importación
          if (!nombre) {
            errorCount++;
            errors.push(`Fila ${jsonData.indexOf(item) + 2}: Nombre es obligatorio`);
            continue;
          }

          if (nombre.length < 2 || nombre.length > 100) {
            errorCount++;
            errors.push(`Fila ${jsonData.indexOf(item) + 2}: El nombre debe tener entre 2 y 100 caracteres`);
            continue;
          }

          if (isNaN(codigo) || codigo < 0) {
            errorCount++;
            errors.push(`Fila ${jsonData.indexOf(item) + 2}: El código debe ser un número válido mayor o igual a 0`);
            continue;
          }

          const payload = {
            codigo: codigo,
            nombre: nombre,
            estado: "Disponible"
          };

          await configAxios.post("/api/ambientes", payload);
          successCount++;
        } catch (err) {
          errorCount++;
          const errorMsg = err.response?.data?.message || err.message || "Error desconocido";
          errors.push(`Fila ${jsonData.indexOf(item) + 2}: ${errorMsg}`);
        }
      }

      if (errorCount > 0) {
        Swal.fire({
          title: "Importación completada con errores",
          html: `
            <div>
              <p>✅ <strong>${successCount}</strong> ambientes importados correctamente</p>
              <p>❌ <strong>${errorCount}</strong> errores encontrados</p>
              ${errors.length > 0 ? `
                <details style="margin-top: 10px;">
                  <summary>Ver errores detallados</summary>
                  <div style="max-height: 200px; overflow-y: auto; margin-top: 10px; text-align: left;">
                    ${errors.map(err => `<p style="margin: 5px 0; font-size: 12px;">${err}</p>`).join('')}
                  </div>
                </details>
              ` : ''}
            </div>
          `,
          icon: "warning",
          confirmButtonText: "Aceptar"
        });
      } else {
        Swal.fire({
          title: "Importación exitosa",
          text: `${successCount} ambientes importados correctamente`,
          icon: "success",
          confirmButtonText: "Aceptar"
        });
      }

      fetchAmbientes();
    } catch (error) {
      console.error("Error en importación:", error);
      Swal.fire("Error", "Error durante la importación de datos.", "error");
    } finally {
      setLoading(false);
    }
  };

  const refreshAmbientes = () => {
  fetchAmbientes(); // Esto ya recarga los ambientes desde la API
};

  return {
    ambientes,
    loading,
    showModal,
    editing,
    searchTerm,
    currentPage,
    totalPages,
    currentAmbientes,
    setSearchTerm,
    setShowModal,
    setEditing,
    openNew,
    openEdit,
    closeModal,
    handleDelete,
    exportToPDF,
    exportToExcel,
    importFromExcel,
    paginate,
    getEstadoBadgeColor,
    filteredAmbientes,
    // React Hook Form
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    watch,
    refreshAmbientes,
    trigger
  };
};
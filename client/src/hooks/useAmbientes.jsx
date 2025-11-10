import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import configAxios from "../api/configAxios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const useAmbientes = () => {
  const [ambientes, setAmbientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ codigo: "", nombre: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
      const res = await configAxios.get("/ambientes");
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

  const cambiarEstadoAmbiente = async (ambiente) => {
    const nuevoEstado = ambiente.estado === "Disponible" ? "Asignado" : "Disponible";
    
    const result = await Swal.fire({
      title: `¿Cambiar estado a ${nuevoEstado}?`,
      text: `¿Estás seguro de que quieres cambiar el estado del ambiente "${ambiente.nombre}" a "${nuevoEstado}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, cambiar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        
        // Usar el ID correcto (idAmbiente es la primary key)
        const ambienteId = ambiente.idAmbiente || ambiente.id;
        
        const payload = {
          codigo: ambiente.codigo,
          nombre: ambiente.nombre,
          estado: nuevoEstado
        };

        await configAxios.put(`/ambientes/${ambienteId}`, payload);
        
        setAmbientes(prev => 
          prev.map(a => 
            (a.idAmbiente || a.id) === ambienteId 
              ? { ...a, estado: nuevoEstado }
              : a
          )
        );

        Swal.fire({
          title: "Estado actualizado",
          text: `El ambiente "${ambiente.nombre}" ahora está "${nuevoEstado}"`,
          icon: "success",
          confirmButtonText: "Aceptar"
        });

      } catch (err) {
        console.error("Error cambiando estado del ambiente:", err);
        const serverMsg = err.response?.data?.message || err.message || "Error al cambiar el estado";
        Swal.fire({ 
          title: "Error al cambiar estado", 
          text: serverMsg, 
          icon: "error", 
          confirmButtonText: "Aceptar" 
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const openNew = () => {
    setEditing(null);
    setForm({ codigo: "", nombre: "" });
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({ 
      codigo: item.codigo ?? "", 
      nombre: item.nombre ?? ""
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
    setForm({ codigo: "", nombre: "" });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nombre || form.nombre.toString().trim() === "") {
      Swal.fire({ title: "Formulario incompleto", text: "El campo Nombre es obligatorio.", icon: "warning", confirmButtonText: "Aceptar" });
      return;
    }

    const payload = { 
      codigo: Number(form.codigo), 
      nombre: form.nombre.toString().trim(),
      estado: "Disponible"
    };

    try {
      if (editing) {
        // Usar el ID correcto para edición
        const editingId = editing.idAmbiente || editing.id;
        await configAxios.put(`/ambientes/${editingId}`, payload);
        Swal.fire({ title: "Ambiente actualizado", text: `Se actualizó "${payload.nombre}"`, icon: "success", confirmButtonText: "Aceptar" });
      } else {
        await configAxios.post("/ambientes", payload);
        Swal.fire({ title: "Ambiente creado", text: `Se creó "${payload.nombre}"`, icon: "success", confirmButtonText: "Aceptar" });
      }
      closeModal();
      fetchAmbientes();
    } catch (err) {
      console.error("Error guardando ambiente:", err);
      const serverMsg = err.response?.data?.message || err.message || "Error al guardar";
      Swal.fire({ title: "Error al guardar", text: `${err.response?.status || ""} - ${serverMsg}`, icon: "error", confirmButtonText: "Aceptar" });
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
      // Usar el ID correcto para eliminación
      const itemId = item.idAmbiente || item.id;
      await configAxios.delete(`/ambientes/${itemId}`);
      Swal.fire({ title: "Ambiente eliminado", text: `"${item.nombre}" eliminado.`, icon: "success", confirmButtonText: "Aceptar" });
      setAmbientes(prev => prev.filter(a => (a.idAmbiente || a.id) !== itemId));
    } catch (err) {
      console.error("Error eliminando ambiente:", err);
      const serverMsg = err.response?.data?.message || err.message || "No se pudo eliminar";
      Swal.fire({ title: "Error al eliminar", text: serverMsg, icon: "error", confirmButtonText: "Aceptar" });
    }
  };

  const getEstadoBadgeColor = (estado) => {
    const estadoNormalizado = estado || "Disponible";
    switch (estadoNormalizado) {
      case "Disponible":
        return "bg-green-100 text-green-800 border border-green-200 hover:bg-green-200 cursor-pointer";
      case "Asignado":
        return "bg-blue-100 text-blue-800 border border-blue-200 hover:bg-blue-200 cursor-pointer";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200 cursor-pointer";
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
          const payload = {
            codigo: Number(item.CODIGO || item.codigo),
            nombre: (item.NOMBRE || item.nombre).toString().trim(),
            estado: (item.ESTADO || item.estado || "Disponible").toString()
          };

          if (!payload.nombre) {
            errorCount++;
            errors.push(`Fila ${jsonData.indexOf(item) + 2}: Nombre es obligatorio`);
            continue;
          }

          await configAxios.post("/ambientes", payload);
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

  return {
    ambientes,
    loading,
    showModal,
    editing,
    form,
    searchTerm,
    currentPage,
    totalPages,
    currentAmbientes,
    setSearchTerm,
    setShowModal,
    setEditing,
    setForm,
    openNew,
    openEdit,
    closeModal,
    handleChange,
    handleSubmit,
    handleDelete,
    cambiarEstadoAmbiente,
    exportToPDF,
    exportToExcel,
    importFromExcel,
    paginate,
    getEstadoBadgeColor
  };
};
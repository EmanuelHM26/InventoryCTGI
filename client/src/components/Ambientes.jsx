import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash2, FileText, Download, Upload } from "lucide-react";
import Swal from "sweetalert2";
import axios from "../api/configAxios";

// librerías para export/import
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Ambientes() {
  const [ambientes, setAmbientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ codigo: "", nombre: "" });

  useEffect(() => {
    fetchAmbientes();
  }, []);

  async function fetchAmbientes() {
    try {
      setLoading(true);
      const res = await axios.get("/ambientes");
      setAmbientes(res.data || []);
    } catch (err) {
      console.error("Error cargando ambientes (detalle):", err);
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

  // Función para importar desde Excel/CSV
  const importFromExcel = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    const validTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv'
    ];
    
    if (!validTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls|csv)$/)) {
      Swal.fire("Error", "Solo se permiten archivos Excel (.xlsx, .xls) o CSV (.csv)", "error");
      event.target.value = ''; // Limpiar input
      return;
    }

    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Tomar la primera hoja
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convertir a JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        console.log("Datos crudos del Excel:", jsonData); // Debug
        
        if (jsonData.length === 0) {
          Swal.fire("Error", "El archivo está vacío", "error");
          return;
        }

        // Mostrar todas las columnas disponibles para debug
        if (jsonData.length > 0) {
          const availableColumns = Object.keys(jsonData[0]);
          console.log("Columnas disponibles:", availableColumns);
        }

        // Mostrar preview y confirmar
        const previewContent = `
          <div>
            <p>Se encontraron <strong>${jsonData.length}</strong> registros:</p>
            <div style="max-height: 200px; overflow-y: auto; margin: 10px 0;">
              <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
                <thead>
                  <tr style="background: #f3f4f6;">
                    ${Object.keys(jsonData[0]).map(col => 
                      `<th style="border: 1px solid #ddd; padding: 5px;">${col}</th>`
                    ).join('')}
                  </tr>
                </thead>
                <tbody>
                  ${jsonData.slice(0, 5).map(row => `
                    <tr>
                      ${Object.values(row).map(value => 
                        `<td style="border: 1px solid #ddd; padding: 5px;">${value || ''}</td>`
                      ).join('')}
                    </tr>
                  `).join('')}
                  ${jsonData.length > 5 ? `<tr><td colspan="${Object.keys(jsonData[0]).length}" style="text-align: center; padding: 5px;">... y ${jsonData.length - 5} más</td></tr>` : ''}
                </tbody>
              </table>
            </div>
            <p><strong>¿Desea importar estos datos?</strong></p>
          </div>
        `;

        const result = await Swal.fire({
          title: 'Confirmar importación',
          html: previewContent,
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Sí, importar',
          cancelButtonText: 'Cancelar',
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          width: '600px'
        });

        if (result.isConfirmed) {
          await processImportData(jsonData);
        }

      } catch (error) {
        console.error("Error procesando archivo:", error);
        Swal.fire("Error", "No se pudo procesar el archivo", "error");
      }
      
      // Limpiar input
      event.target.value = '';
    };

    reader.onerror = () => {
      Swal.fire("Error", "Error al leer el archivo", "error");
      event.target.value = '';
    };

    reader.readAsArrayBuffer(file);
  };

  // Procesar y enviar datos a la API
  const processImportData = async (jsonData) => {
    try {
      setLoading(true);
      
      const ambientesToImport = [];
      const errors = [];

      // Validar y formatear datos
      jsonData.forEach((row, index) => {
        // Buscar código en diferentes formatos de columna
        const codigo = 
          row.CODIGO !== undefined ? row.CODIGO :
          row.Código !== undefined ? row.Código :
          row.codigo !== undefined ? row.codigo :
          row.CÓDIGO !== undefined ? row.CÓDIGO :
          row.Code !== undefined ? row.Code :
          row.code !== undefined ? row.code :
          null;

        // Buscar nombre en diferentes formatos de columna
        const nombre = 
          row.NOMBRE !== undefined ? row.NOMBRE :
          row.Nombre !== undefined ? row.Nombre :
          row.nombre !== undefined ? row.nombre :
          row.NOMBRE !== undefined ? row.NOMBRE :
          row.Name !== undefined ? row.Name :
          row.name !== undefined ? row.name :
          null;

        // Debug: mostrar qué se está encontrando
        console.log(`Fila ${index + 1}:`, { codigo, nombre, row });

        if (!nombre || nombre.toString().trim() === '') {
          errors.push(`Fila ${index + 2}: El nombre es obligatorio`);
          return;
        }

        // Convertir código a número, si está vacío usar 0 o generar uno
        let codigoNumero;
        if (codigo === null || codigo === undefined || codigo === '') {
          codigoNumero = 0;
        } else {
          codigoNumero = Number(codigo);
          if (isNaN(codigoNumero)) {
            errors.push(`Fila ${index + 2}: Código "${codigo}" no es un número válido`);
            return;
          }
        }

        ambientesToImport.push({
          codigo: codigoNumero,
          nombre: nombre.toString().trim()
        });
      });

      if (errors.length > 0) {
        const result = await Swal.fire({
          title: "Advertencias en los datos",
          html: `Se encontraron ${errors.length} advertencias:<br><small>${errors.slice(0, 10).join('<br>')}${errors.length > 10 ? `<br>... y ${errors.length - 10} más` : ''}</small><br><br>¿Desea continuar con la importación?`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: 'Sí, importar igual',
          cancelButtonText: 'Cancelar'
        });

        if (!result.isConfirmed) {
          setLoading(false);
          return;
        }
      }

      // Si no hay datos válidos después de las validaciones
      if (ambientesToImport.length === 0) {
        Swal.fire("Error", "No hay datos válidos para importar", "error");
        setLoading(false);
        return;
      }

      // Enviar datos a la API
      let successCount = 0;
      let errorCount = 0;
      const errorDetails = [];

      for (const ambiente of ambientesToImport) {
        try {
          await axios.post("/ambientes", ambiente);
          successCount++;
        } catch (error) {
          console.error(`Error creando ambiente ${ambiente.nombre}:`, error);
          errorCount++;
          errorDetails.push(`${ambiente.nombre}: ${error.response?.data?.message || error.message}`);
        }
      }

      // Mostrar resultados
      let resultMessage = `<strong>Importación completada:</strong><br>`;
      resultMessage += `✅ <strong>${successCount}</strong> ambientes creados exitosamente<br>`;
      if (errorCount > 0) {
        resultMessage += `❌ <strong>${errorCount}</strong> ambientes no pudieron crearse<br>`;
        resultMessage += `<small>${errorDetails.slice(0, 3).join('<br>')}${errorDetails.length > 3 ? `<br>... y ${errorDetails.length - 3} más` : ''}</small>`;
      }

      await Swal.fire({
        title: "Resultado de importación",
        html: resultMessage,
        icon: successCount > 0 ? "success" : "error"
      });

      // Recargar la lista
      fetchAmbientes();

    } catch (error) {
      console.error("Error en importación:", error);
      Swal.fire("Error", "Error durante la importación", "error");
    } finally {
      setLoading(false);
    }
  };

  function openNew() {
    setEditing(null);
    setForm({ codigo: "", nombre: "" });
    setShowModal(true);
  }

  function openEdit(item) {
    setEditing(item);
    setForm({ codigo: item.codigo ?? "", nombre: item.nombre ?? "" });
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditing(null);
    setForm({ codigo: "", nombre: "" });
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.nombre || form.nombre.toString().trim() === "") {
      Swal.fire({ title: "Formulario incompleto", text: "El campo Nombre es obligatorio.", icon: "warning", confirmButtonText: "Aceptar" });
      return;
    }

    const payload = { codigo: Number(form.codigo), nombre: form.nombre.toString().trim() };

    try {
      if (editing) {
        await axios.put(`/ambientes/${editing.idAmbiente ?? editing.id}`, payload);
        Swal.fire({ title: "Ambiente actualizado", text: `Se actualizó "${payload.nombre}"`, icon: "success", confirmButtonText: "Aceptar" });
      } else {
        await axios.post("/ambientes", payload);
        Swal.fire({ title: "Ambiente creado", text: `Se creó "${payload.nombre}"`, icon: "success", confirmButtonText: "Aceptar" });
      }
      closeModal();
      fetchAmbientes();
    } catch (err) {
      console.error("Error guardando ambiente (detalle):", err);
      const serverMsg = err.response?.data?.message || err.message || "Error al guardar";
      Swal.fire({ title: "Error al guardar", text: `${err.response?.status || ""} - ${serverMsg}`, icon: "error", confirmButtonText: "Aceptar" });
    }
  }

  async function handleDelete(item) {
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
      await axios.delete(`/ambientes/${item.idAmbiente ?? item.id}`);
      Swal.fire({ title: "Ambiente eliminado", text: `"${item.nombre}" eliminado.`, icon: "success", confirmButtonText: "Aceptar" });
      setAmbientes(prev => prev.filter(a => (a.idAmbiente ?? a.id) !== (item.idAmbiente ?? item.id)));
    } catch (err) {
      console.error("Error eliminando ambiente:", err);
      const serverMsg = err.response?.data?.message || err.message || "No se pudo eliminar";
      Swal.fire({ title: "Error al eliminar", text: serverMsg, icon: "error", confirmButtonText: "Aceptar" });
    }
  }

  // Exportar a Excel (SheetJS)
  const exportToExcel = () => {
    if (!ambientes || ambientes.length === 0) {
      Swal.fire("No hay datos", "No hay ambientes para exportar.", "info");
      return;
    }
    const data = ambientes.map(a => ({
      ID: a.idAmbiente ?? a.id,
      CODIGO: a.codigo,
      NOMBRE: a.nombre,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Ambientes");
    XLSX.writeFile(wb, `ambientes_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  // Exportar a PDF (jsPDF + autoTable)
  const exportToPDF = () => {
    if (!ambientes || ambientes.length === 0) {
      Swal.fire("No hay datos", "No hay ambientes para exportar.", "info");
      return;
    }
    
    try {
      const doc = new jsPDF();
      
      // Título
      doc.setFontSize(16);
      doc.text("Lista de Ambientes", 14, 15);
      
      // Datos para la tabla
      const head = [["ID", "CÓDIGO", "NOMBRE"]];
      const body = ambientes.map(a => [
        a.idAmbiente ?? a.id,
        a.codigo,
        a.nombre
      ]);
      
      // Usar autoTable correctamente
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

  return (
    <div className="px-4 py-20 md:px-8 lg:px-10 max-w-full bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 md:mb-0">Ambientes</h2>

          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
            <div className="flex gap-2">
              {/* Botón Importar Excel */}
              <label className="flex items-center justify-center bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200 shadow-sm cursor-pointer">
                <Upload size={16} className="mr-2" />
                Importar Excel
                <input 
                  type="file" 
                  accept=".xlsx,.xls,.csv"
                  onChange={importFromExcel}
                  className="hidden"
                />
              </label>

              <button
                onClick={exportToPDF}
                className="flex items-center justify-center bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-sm"
                title="Exportar a PDF"
              >
                <FileText size={16} className="mr-2" />
                PDF
              </button>
              <button
                onClick={exportToExcel}
                className="flex items-center justify-center bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-sm"
                title="Exportar a Excel"
              >
                <Download size={16} className="mr-2" />
                Excel
              </button>
            </div>

            <button
              onClick={openNew}
              className="flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
            >
              <Plus size={18} className="mr-2" />
              Nuevo ambiente
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan="4" className="px-4 py-8 text-center text-gray-500">Cargando...</td></tr>
              ) : ambientes.length === 0 ? (
                <tr><td colSpan="4" className="px-4 py-8 text-center text-gray-500">No hay ambientes.</td></tr>
              ) : (
                ambientes.map((a) => (
                  <tr key={a.idAmbiente ?? a.id} className="hover:bg-blue-50 transition-colors duration-150">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{a.idAmbiente ?? a.id}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{a.codigo}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{a.nombre}</td>

                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-right">
                      <div className="flex justify-end items-center space-x-2">
                        <button
                          onClick={() => openEdit(a)}
                          className="p-1 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 transition-colors duration-200"
                          title="Editar ambiente"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(a)}
                          className="p-1 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition-colors duration-200"
                          title="Eliminar ambiente"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded shadow-lg w-full max-w-lg p-6">
              <h3 className="text-lg font-medium mb-4">{editing ? "Editar ambiente" : "Nuevo ambiente"}</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Código</label>
                  <input name="codigo" value={form.codigo} onChange={handleChange} className="w-full border px-3 py-2 rounded" type="number" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Nombre</label>
                  <input name="nombre" value={form.nombre} onChange={handleChange} className="w-full border px-3 py-2 rounded" type="text" required />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={closeModal} className="px-4 py-2 rounded border">Cancelar</button>
                  <button type="submit" className="px-4 py-2 rounded bg-indigo-600 text-white">Guardar</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
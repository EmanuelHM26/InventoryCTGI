import React from "react";
import { useAmbientes } from "../hooks/useAmbientes";
import { Plus, Edit, Trash2, FileText, Download, Upload, Search, X } from "lucide-react";

const Ambientes = () => {
  const {
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
    handleSubmit,
    errors,
    watch,
    trigger
  } = useAmbientes();

  // Función para validar código único (podrías implementar una verificación contra la API si es necesario)
  const validateUniqueCode = (value) => {
    if (!value) return true;
    
    const currentCode = Number(value);
    const isDuplicate = ambientes.some(amb => 
      amb.codigo === currentCode && 
      (!editing || amb.idAmbiente !== editing.idAmbiente)
    );
    
    return !isDuplicate || "Este código ya está en uso";
  };

  return (
    <div className="px-4 py-20 md:px-8 lg:px-10 max-w-full bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 md:mb-0">Ambientes</h2>

          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar ambientes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={50}
              />
              <Search
                size={18}
                className="absolute left-3 top-2.5 text-gray-400"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  <X size={18} />
                </button>
              )}
            </div>

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

        {/* Tabla con columnas simétricas */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">ID</th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">Código</th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-2/6">Nombre</th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">Estado</th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">Acciones</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    Cargando...
                  </td>
                </tr>
              ) : currentAmbientes.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    {searchTerm ? "No se encontraron ambientes que coincidan con la búsqueda." : "No hay ambientes."}
                  </td>
                </tr>
              ) : (
                currentAmbientes.map((a) => (
                  <tr key={a.idAmbiente ?? a.id} className="hover:bg-blue-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center w-1/6">
                      {a.idAmbiente ?? a.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center w-1/6">
                      {a.codigo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center w-2/6">
                      {a.nombre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center w-1/6">
                      <span 
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full transition-colors duration-200 ${getEstadoBadgeColor(a.estado)}`}
                      >
                        {a.estado || "Disponible"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center w-1/6">
                      <div className="flex justify-center items-center space-x-3">
                        <button
                          onClick={() => openEdit(a)}
                          className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 transition-colors duration-200"
                          title="Editar ambiente"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(a)}
                          className="p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition-colors duration-200"
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

        {/* Paginación */}
        {ambientes.length > 0 && (
          <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
            <div>
              Mostrando {((currentPage - 1) * 10) + 1} a{" "}
              {Math.min(currentPage * 10, filteredAmbientes.length)} de{" "}
              {filteredAmbientes.length} ambientes
            </div>
            <div className="flex space-x-1">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-md ${
                  currentPage === 1
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                ←
              </button>
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => paginate(idx + 1)}
                  className={`w-10 h-10 rounded-md ${
                    currentPage === idx + 1
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-md ${
                  currentPage === totalPages
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                →
              </button>
            </div>
          </div>
        )}

        {/* Modal con validaciones */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded shadow-lg w-full max-w-lg p-6">
              <h3 className="text-lg font-medium mb-4">{editing ? "Editar ambiente" : "Nuevo ambiente"}</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Código
                    <span className="text-gray-500 text-xs ml-1">(Opcional)</span>
                  </label>
                  <input 
                    {...register("codigo", {
                      validate: {
                        positiveNumber: (value) => 
                          !value || (Number(value) >= 0) || "El código debe ser un número positivo",
                        uniqueCode: validateUniqueCode,
                        maxValue: (value) => 
                          !value || (Number(value) <= 999999) || "El código no puede ser mayor a 999999"
                      },
                      pattern: {
                        value: /^\d*$/,
                        message: "Solo se permiten números"
                      }
                    })}
                    className={`w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 ${
                      errors.codigo 
                        ? "border-red-500 focus:ring-red-200" 
                        : "border-gray-300 focus:ring-blue-200"
                    }`}
                    type="number" 
                    min="0"
                    max="999999"
                    placeholder="Ej: 101"
                  />
                  {errors.codigo && (
                    <p className="text-red-500 text-xs mt-1">{errors.codigo.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Nombre *
                  </label>
                  <input 
                    {...register("nombre", {
                      required: "El nombre es obligatorio",
                      minLength: {
                        value: 2,
                        message: "El nombre debe tener al menos 2 caracteres"
                      },
                      maxLength: {
                        value: 100,
                        message: "El nombre no puede tener más de 100 caracteres"
                      },
                      pattern: {
                        value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\-_.,()]+$/,
                        message: "Solo se permiten letras, números, espacios y los caracteres -_.,()"
                      },
                      validate: {
                        notOnlyNumbers: (value) => 
                          !/^\d+$/.test(value) || "El nombre no puede contener solo números",
                        notEmpty: (value) => 
                          value.trim().length > 0 || "El nombre no puede estar vacío"
                      }
                    })}
                    className={`w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 ${
                      errors.nombre 
                        ? "border-red-500 focus:ring-red-200" 
                        : "border-gray-300 focus:ring-blue-200"
                    }`}
                    type="text"
                    placeholder="Ej: Laboratorio de Computación A-101"
                    maxLength={100}
                  />
                  <div className="flex justify-between mt-1">
                    {errors.nombre ? (
                      <p className="text-red-500 text-xs">{errors.nombre.message}</p>
                    ) : (
                      <p className="text-gray-500 text-xs">
                        {watch("nombre")?.length || 0}/100 caracteres
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button 
                    type="button" 
                    onClick={closeModal} 
                    className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={Object.keys(errors).length > 0}
                  >
                    {editing ? "Actualizar" : "Crear"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Ambientes;
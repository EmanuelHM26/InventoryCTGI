import React from "react";
import { Search, Edit, Trash2, ChevronLeft, ChevronRight, Plus, X, FileText, Download } from "lucide-react";
import { useRoles } from "../hooks/useRoles";

const Roles = () => {
  const {
    showModal,
    setShowModal,
    newRole,
    setNewRole,
    currentPage,
    setCurrentPage,
    searchTerm,
    setSearchTerm,
    sortConfig,
    requestSort,
    sortedRoles,
    currentRoles,
    indexOfFirstItem,
    indexOfLastItem,
    totalPages,
    paginate,
    handleCreateRole,
    handleEditRole,
    handleDeleteRole,
    exportToPDF,
    exportToExcel,
  } = useRoles();

  return (
    <div className="px-4 py-20 md:px-8 lg:px-10 max-w-full bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Gestión de Roles</h1>

          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
            {/* Buscador */}
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar rol..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Botones de exportar */}
            <div className="flex gap-2">
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

            {/* Botón Nuevo Rol */}
            <button
              onClick={() => {
                setNewRole({ IdRol: "", NombreRol: "" });
                setShowModal(true);
              }}
              className="flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
            >
              <Plus size={18} className="mr-2" />
              Nuevo Rol
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {["ID", "Nombre del Rol", "Acciones"].map((header, index) => (
                  <th
                    key={index}
                    onClick={() => {
                      if (index < 2) {
                        const keys = ["IdRol", "NombreRol"];
                        requestSort(keys[index]);
                      }
                    }}
                    className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${index < 2 ? "cursor-pointer hover:bg-gray-100" : ""
                      }`}
                  >
                    <div className="flex items-center">
                      {header}
                      {index < 2 && (
                        <span className="ml-1">
                          {sortConfig.key === ["IdRol", "NombreRol"][index] && (
                            sortConfig.direction === "ascending" ? "↑" : "↓"
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentRoles.length > 0 ? (
                currentRoles.map((role, index) => (
                  <tr
                    key={role.IdRol}
                    className={`hover:bg-blue-50 transition-colors duration-150 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{role.IdRol}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{role.NombreRol}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditRole(role)}
                          className="p-1 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 transition-colors duration-200"
                          title="Editar rol"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteRole(role.IdRol)}
                          className="p-1 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition-colors duration-200"
                          title="Eliminar rol"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-4 py-8 text-center text-gray-500">
                    No se encontraron roles
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {sortedRoles.length > 0 && (
          <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
            <div>
              Mostrando {indexOfFirstItem + 1} a {Math.min(indexOfLastItem, sortedRoles.length)} de {sortedRoles.length} roles
            </div>
            <div className="flex space-x-1">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-md ${currentPage === 1
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-600 hover:bg-gray-100"
                  }`}
              >
                <ChevronLeft size={18} />
              </button>

              {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
                let pageNumber;
                if (totalPages <= 5) {
                  pageNumber = idx + 1;
                } else if (currentPage <= 3) {
                  pageNumber = idx + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + idx;
                } else {
                  pageNumber = currentPage - 2 + idx;
                }

                return (
                  <button
                    key={idx}
                    onClick={() => paginate(pageNumber)}
                    className={`w-10 h-10 rounded-md ${currentPage === pageNumber
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                      }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-md ${currentPage === totalPages
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-600 hover:bg-gray-100"
                  }`}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal para crear o editar un rol */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">
              {newRole.IdRol ? "Editar Rol" : "Crear Nuevo Rol"}
            </h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Rol <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newRole.NombreRol}
                onChange={(e) => {
                  // Solo permite letras, espacios y acentos, elimina números
                  const value = e.target.value.replace(/[0-9]/g, "");
                  setNewRole({ ...newRole, NombreRol: value });
                }}
                className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ingrese el nombre del rol"
                maxLength={50}
              />
              {showModal && !newRole.NombreRol.trim() && (
                <p className="text-red-500 text-xs mt-1">Este campo es obligatorio</p>
              )}
              {showModal && /[0-9]/.test(newRole.NombreRol) && (
                <p className="text-red-500 text-xs mt-1">No se permiten números en el nombre del rol</p>
              )}
              {showModal && !!newRole.NombreRol && !/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(newRole.NombreRol.trim()) && (
                <p className="text-red-500 text-xs mt-1">
                  El nombre del rol solo puede contener letras y espacios, no solo caracteres especiales.
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateRole}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                {newRole.IdRol ? "Actualizar" : "Crear"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Roles;
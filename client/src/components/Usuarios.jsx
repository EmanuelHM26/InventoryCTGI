import React, { useEffect } from "react";
import {
  Search,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  FileText,
  Download,
} from "lucide-react";
import { useUsuarios } from "../hooks/useUsuarios";

const Usuarios = () => {
  const {
    usuarios,
    roles,
    showModal,
    setShowModal,
    newUser,
    setNewUser,
    register,
    handleSubmit,
    errors,
    reset,
    setValue,
    watch,
    trigger,
    currentPage,
    setCurrentPage,
    searchTerm,
    setSearchTerm,
    sortConfig,
    setSortConfig,
    requestSort,
    sortedUsuarios,
    currentUsuarios,
    indexOfFirstItem,
    indexOfLastItem,
    totalPages,
    paginate,
    handleCreateUser,
    handleEditUser,
    handleOpenNewUserModal,
    handleDeleteUser,
    exportToPDF,
    exportToExcel,
    getRolName,
    itemsPerPage,
  } = useUsuarios();

   // Forzar validación de todos los campos al abrir el modal
  useEffect(() => {
    if (showModal) {
      setValue('IdRol', '');
      trigger();
    }
  }, [showModal, setValue, trigger]);


  return (
    <div className="px-4 py-20 md:px-8 lg:px-10 max-w-full bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
            Usuarios Registrados
          </h1>

          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar usuario..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

            {/* Botones de exportación con iconos de Lucide */}
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

            <button
              onClick={handleOpenNewUserModal}
              className="flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
            >
              <Plus size={18} className="mr-2" />
              Nuevo Usuario
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "ID",
                  "Nombre",
                  "Apellido",
                  "Tipo Doc.",
                  "Número Doc.",
                  "Usuario",
                  "Correo",
                  "Rol",
                  "Acciones",
                ].map((header, index) => (
                  <th
                    key={index}
                    onClick={() => {
                      if (index < 8) {
                        // Actualizar para incluir la nueva columna
                        const keys = [
                          "IdUsuario",
                          "Nombre",
                          "Apellido",
                          "TipoDocumento",
                          "NumeroDocumento",
                          "Usuario",
                          "Correo",
                          "IdRol",
                        ];
                        requestSort(keys[index]);
                      }
                    }}
                    className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                      index < 8 ? "cursor-pointer hover:bg-gray-100" : ""
                    }`}
                  >
                    <div className="flex items-center">
                      {header}
                      {index < 8 && (
                        <span className="ml-1">
                          {sortConfig.key ===
                            [
                              "IdUsuario",
                              "Nombre",
                              "Apellido",
                              "TipoDocumento",
                              "NumeroDocumento",
                              "Usuario",
                              "Correo",
                              "IdRol",
                            ][index] &&
                            (sortConfig.direction === "ascending" ? "↑" : "↓")}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentUsuarios.length > 0 ? (
                currentUsuarios.map((user, index) => (
                  <tr
                    key={user.IdUsuario}
                    className={`hover:bg-blue-50 transition-colors duration-150 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {user.IdUsuario || ""}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {user.Nombre || ""}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {user.Apellido || ""}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {user.TipoDocumento || ""}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {user.NumeroDocumento || ""}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {user.Usuario || ""}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {user.Correo || ""}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.IdRol === 1
                            ? "bg-red-100 text-red-800"
                            : user.IdRol === 2
                            ? "bg-blue-100 text-blue-800"
                            : user.IdRol === 3
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {getRolName(user.IdRol)}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="p-1 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 transition-colors duration-200"
                          title="Editar usuario"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.IdUsuario)}
                          className="p-1 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition-colors duration-200"
                          title="Eliminar usuario"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="9"
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No se encontraron usuarios
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {sortedUsuarios.length > 0 && (
          <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
            <div>
              Mostrando {indexOfFirstItem + 1} a{" "}
              {Math.min(indexOfLastItem, sortedUsuarios.length)} de{" "}
              {sortedUsuarios.length} usuarios
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
                    className={`w-10 h-10 rounded-md ${
                      currentPage === pageNumber
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
                className={`p-2 rounded-md ${
                  currentPage === totalPages
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

      {/* Modal para crear o editar un usuario */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg mx-4 max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">
              {newUser.IdUsuario ? "Editar Usuario" : "Crear Nuevo Usuario"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  {...register("Nombre", {
                    required: "El nombre es obligatorio",
                    minLength: {
                      value: 3,
                      message: "El nombre debe tener al menos 3 caracteres",
                    },
                    maxLength: {
                      value: 50,
                      message: "El nombre no puede exceder 50 caracteres",
                    },
                    pattern: {
                      value: /^(?! )[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/,
                      message:
                        "El nombre solo puede contener letras y espacios, y no puede iniciar con espacio",
                    },
                  })}
                  className={`border p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:border-transparent ${
                    errors.Nombre
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
                {errors.Nombre && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.Nombre.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Apellido
                </label>
                <input
                  type="text"
                  {...register("Apellido", {
                    required: "El apellido es obligatorio",
                    minLength: {
                      value: 3,
                      message: "El apellido debe tener al menos 3 caracteres",
                    },
                    maxLength: {
                      value: 50,
                      message: "El apellido no puede exceder 50 caracteres",
                    },
                    pattern: {
                      value: /^(?! )[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/,
                      message:
                        "El apellido solo puede contener letras y espacios, y no puede iniciar con espacio",
                    },
                  })}
                  className={`border p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:border-transparent ${
                    errors.Apellido
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
                {errors.Apellido && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.Apellido.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Documento
                </label>
                <select
                  {...register("TipoDocumento", {
                    required: "Debe seleccionar un tipo de documento",
                  })}
                  className={`border p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:border-transparent ${
                    errors.TipoDocumento
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                >
                  <option value="">Seleccionar tipo</option>
                  <option value="CC">CC - Cédula de Ciudadanía</option>
                  <option value="TI">TI - Tarjeta de Identidad</option>
                  <option value="TIE">TIE - Tarjeta de Extranjería</option>
                  <option value="CE">CE - Cédula de Extranjería</option>
                </select>
                {errors.TipoDocumento && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.TipoDocumento.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número de Documento
                </label>
                <input
                  type="text"
                  {...register("NumeroDocumento", {
                    required: "El número de documento es obligatorio",
                    pattern: {
                      value: /^\d{6,15}$/,
                      message:
                        "El número de documento debe tener entre 6 y 15 dígitos",
                    },
                  })}
                  className={`border p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:border-transparent ${
                    errors.NumeroDocumento
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
                {errors.NumeroDocumento && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.NumeroDocumento.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Usuario
                </label>
                <input
                  type="text"
                  {...register("Usuario", {
                    required: "El usuario es obligatorio",
                    minLength: {
                      value: 3,
                      message: "El usuario debe tener al menos 3 caracteres",
                    },
                    maxLength: {
                      value: 20,
                      message: "El usuario no puede exceder 20 caracteres",
                    },
                    pattern: {
                      value: /^[a-zA-Z0-9_]+$/,
                      message:
                        "El usuario solo puede contener letras, números y guiones bajos",
                    },
                    validate: value => {
                      if (/^\d+$/.test(value)) {
                        return "El usuario no puede ser solo números";
                      }
                      if (/^[_]+$/.test(value)) {
                        return "El usuario no puede ser solo guiones bajos";
                      }
                      if (/^[^a-zA-Z0-9]+$/.test(value)) {
                        return "El usuario no puede ser solo caracteres especiales";
                      }
                      return true;
                    },
                  })}
                  className={`border p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:border-transparent ${
                    errors.Usuario
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
                {errors.Usuario && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.Usuario.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Correo
                </label>
                <input
                  type="email"
                  {...register("Correo", {
                    required: "El correo es obligatorio",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Ingrese un correo electrónico válido",
                    },
                    validate: value => {
                      const username = value.split('@')[0];
                      if (/^\d+$/.test(username)) {
                        return "El correo no puede tener solo números antes de la @";
                      }
                      return true;
                    },
                  })}
                  className={`border p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:border-transparent ${
                    errors.Correo
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
                {errors.Correo && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.Correo.message}
                  </p>
                )}
              </div>
              {/* NUEVO CAMPO PARA ROL */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rol
                </label>
                <select
                  {...register("IdRol", {
                    required: "Debe seleccionar un rol",
                  })}
                  className={`border p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:border-transparent ${
                    errors.IdRol
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  defaultValue=""
                >
                  <option value="">Seleccione un rol</option>
                  {roles
                    .filter((rol) => rol.NombreRol === 'Instructor' || rol.NombreRol === 'Administrativo')
                    .map((rol) => (
                      <option key={rol.IdRol} value={rol.IdRol}>
                        {rol.NombreRol}
                      </option>
                    ))}
                </select>
                {errors.IdRol && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.IdRol.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateUser}
                disabled={Object.keys(errors).length > 0}
                className={`px-4 py-2 text-white rounded-lg transition-colors duration-200 ${
                  Object.keys(errors).length > 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {newUser.IdUsuario ? "Actualizar" : "Crear"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Usuarios;

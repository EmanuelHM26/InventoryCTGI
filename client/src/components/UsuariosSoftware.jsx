import React from "react";
import {
  UserPlus, Search, Edit, Trash2, ChevronLeft, ChevronRight, Plus, X, FileText, Download, Eye, EyeOff, Save
} from "lucide-react";
import { useUsuariosSoftware } from "../hooks/useUsuariosSoftware";

const UsuariosSoftware = () => {
  const {
    usuarios,
    roles,
    filteredUsuarios,
    searchTerm,
    setSearchTerm,
    newUser,
    setNewUser,
    editingUser,
    setEditingUser,
    currentPage,
    setCurrentPage,
    sortConfig,
    setSortConfig,
    showPassword,
    setShowPassword,
    formVisible,
    setFormVisible,
    itemsPerPage,
    register,
    handleSubmit,
    reset,
    errors,
    watch,
    setValue,
    validationErrors,
    setValidationErrors,
    isSubmitting,
    setIsSubmitting,
    editErrors,
    setEditErrors,
    handleCreateUser,
    handleDeleteUser,
    handleUpdateUser,
    cancelEdit,
    handleEditFieldChange,
    requestSort,
    sortedUsuarios,
    indexOfLastItem,
    indexOfFirstItem,
    currentUsuarios,
    totalPages,
    paginate,
    exportToPDF,
    exportToExcel,
    fetchUsuarios,
    fetchRoles,
  } = useUsuariosSoftware();

  return (
    <div className="px-4 py-20 md:px-8 lg:px-10 max-w-full bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Gestión de Usuarios del Software</h1>

          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
            {/* Buscador */}
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar usuario..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={50}
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

            {/* Botón Nuevo Usuario */}
            <button
              onClick={() => {
                setFormVisible(!formVisible);
                if (!formVisible) {
                  setValidationErrors({});
                  reset();
                }
              }}
              className="flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
            >
              <UserPlus size={18} className="mr-2" />
              {formVisible ? "Cancelar" : "Nuevo Usuario"}
            </button>
          </div>
        </div>

        {/* Formulario de creación de usuarios */}
        {formVisible && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">Crear Nuevo Usuario</h2>
            <form onSubmit={handleSubmit(handleCreateUser)}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Usuario */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Usuario <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("Usuario", {
                      required: "El usuario es obligatorio",
                      minLength: { value: 3, message: "Mínimo 3 caracteres" },
                      maxLength: { value: 20, message: "Máximo 20 caracteres" },
                      pattern: {
                        value: /^[A-Za-z0-9_]+$/,
                        message: "Solo letras, números y guión bajo"
                      },
                      validate: {
                        notOnlyNumbers: value => !/^\d+$/.test(value) || "No puede ser solo números",
                        notOnlyUnderscores: value => !/^_+$/.test(value) || "No puede ser solo guiones bajos"
                      }
                    })}
                    className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.Usuario || validationErrors.Usuario ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="Nombre de usuario"
                    maxLength={20}
                  />
                  {(errors.Usuario || validationErrors.Usuario) && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.Usuario?.message || validationErrors.Usuario}
                    </p>
                  )}
                </div>

                {/* Correo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Correo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    {...register("Correo", {
                      required: "El correo es obligatorio",
                      maxLength: { value: 100, message: "Máximo 100 caracteres" },
                      pattern: {
                        value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                        message: "Correo no válido"
                      }
                    })}
                    className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.Correo || validationErrors.Correo ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="correo@ejemplo.com"
                    maxLength={100}
                  />
                  {(errors.Correo || validationErrors.Correo) && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.Correo?.message || validationErrors.Correo}
                    </p>
                  )}
                </div>

                {/* Contraseña */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contraseña <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      {...register("PasswordTexto", {
                        required: "La contraseña es obligatoria",
                        minLength: { value: 6, message: "Mínimo 6 caracteres" },
                        maxLength: { value: 50, message: "Máximo 50 caracteres" },
                        validate: {
                          hasLetter: value => /[A-Za-z]/.test(value) || "Debe contener al menos una letra",
                          hasNumber: value => /\d/.test(value) || "Debe contener al menos un número",
                          noSpaces: value => !/\s/.test(value) || "No puede contener espacios"
                        }
                      })}
                      className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 ${errors.PasswordTexto || validationErrors.PasswordTexto ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="Contraseña"
                      maxLength={50}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-2.5 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {(errors.PasswordTexto || validationErrors.PasswordTexto) && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.PasswordTexto?.message || validationErrors.PasswordTexto}
                    </p>
                  )}
                </div>

                {/* Rol */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rol <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("IdRol", {
                      required: "Debe seleccionar un rol"
                    })}
                    className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.IdRol || validationErrors.IdRol ? 'border-red-500' : 'border-gray-300'
                      }`}
                  >
                    <option value="">Seleccionar Rol</option>
                    {roles.map((role) => (
                      <option key={role.IdRol} value={role.IdRol}>
                        {role.NombreRol}
                      </option>
                    ))}
                  </select>
                  {(errors.IdRol || validationErrors.IdRol) && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.IdRol?.message || validationErrors.IdRol}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-4 py-2 rounded-lg transition-colors duration-200 flex items-center ${isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700'
                    } text-white`}
                >
                  <Plus size={18} className="mr-2" />
                  {isSubmitting ? "Creando..." : "Crear Usuario"}
                </button>
              </div>
            </form>
          </div>
        )}


        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  onClick={() => requestSort("IdRegistroLogin")}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center">
                    ID
                    {sortConfig.key === "IdRegistroLogin" && (
                      <span className="ml-1">
                        {sortConfig.direction === "ascending" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  onClick={() => requestSort("Usuario")}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center">
                    Usuario
                    {sortConfig.key === "Usuario" && (
                      <span className="ml-1">
                        {sortConfig.direction === "ascending" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  onClick={() => requestSort("Correo")}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center">
                    Correo
                    {sortConfig.key === "Correo" && (
                      <span className="ml-1">
                        {sortConfig.direction === "ascending" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  onClick={() => requestSort("IdRol")}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center">
                    Rol
                    {sortConfig.key === "IdRol" && (
                      <span className="ml-1">
                        {sortConfig.direction === "ascending" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentUsuarios.length > 0 ? (
                currentUsuarios.map((user, index) => (
                  <tr
                    key={user.IdRegistroLogin}
                    className={`hover:bg-blue-50 transition-colors duration-150 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{user.IdRegistroLogin}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {editingUser?.IdRegistroLogin === user.IdRegistroLogin ? (
                        <input
                          type="text"
                          value={editingUser.Usuario}
                          onChange={(e) => setEditingUser({ ...editingUser, Usuario: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        user.Usuario
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {editingUser?.IdRegistroLogin === user.IdRegistroLogin ? (
                        <input
                          type="email"
                          value={editingUser.Correo}
                          onChange={(e) => setEditingUser({ ...editingUser, Correo: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        user.Correo
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {editingUser?.IdRegistroLogin === user.IdRegistroLogin ? (
                        <select
                          value={editingUser.IdRol}
                          onChange={(e) => setEditingUser({ ...editingUser, IdRol: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {roles.map((role) => (
                            <option key={role.IdRol} value={role.IdRol}>
                              {role.NombreRol}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          {roles.find((role) => role.IdRol === user.IdRol)?.NombreRol || "N/A"}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        {editingUser?.IdRegistroLogin === user.IdRegistroLogin ? (
                          <>
                            <button
                              onClick={handleUpdateUser}
                              className="p-1 rounded-full bg-green-100 hover:bg-green-200 text-green-600 transition-colors duration-200"
                              title="Confirmar edición"
                            >
                              <Check size={16} />
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors duration-200"
                              title="Cancelar edición"
                            >
                              <X size={16} />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => setEditingUser(user)}
                            className="p-1 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 transition-colors duration-200"
                            title="Editar usuario"
                          >
                            <Edit size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteUser(user.IdRegistroLogin)}
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
                  <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
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
              Mostrando {indexOfFirstItem + 1} a {Math.min(indexOfLastItem, sortedUsuarios.length)} de {sortedUsuarios.length} usuarios
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
    </div>
  );
};

export default UsuariosSoftware;
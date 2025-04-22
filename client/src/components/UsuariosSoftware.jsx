import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, Edit, Trash2, ChevronLeft, ChevronRight, Plus, UserPlus, X, Save, Eye, EyeOff } from "lucide-react";

const UsuariosSoftware = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newUser, setNewUser] = useState({
    Usuario: "",
    Correo: "",
    PasswordTexto: "",
    IdRol: "",
  });
  const [editingUser, setEditingUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: "IdRegistroLogin", direction: "ascending" });
  const [showPassword, setShowPassword] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchUsuarios();
    fetchRoles();
  }, []);

  useEffect(() => {
    const filtered = usuarios.filter(
      (user) =>
        user.Usuario?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.Correo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.IdRegistroLogin?.toString().includes(searchTerm)
    );
    setFilteredUsuarios(filtered);
    setCurrentPage(1);
  }, [searchTerm, usuarios]);

  axios.defaults.withCredentials = true;

  const fetchUsuarios = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/users");
      setUsuarios(response.data);
      setFilteredUsuarios(response.data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/roles");
      setRoles(response.data);
    } catch (error) {
      console.error("Error al obtener roles:", error);
    }
  };

  const handleCreateUser = async () => {
    if (!newUser.Usuario || !newUser.Correo || !newUser.PasswordTexto || !newUser.IdRol) {
      alert("Todos los campos son obligatorios");
      return;
    }
    
    try {
      await axios.post("http://localhost:3000/api/register", newUser);
      setNewUser({ Usuario: "", Correo: "", PasswordTexto: "", IdRol: "" });
      setFormVisible(false);
      fetchUsuarios();
    } catch (error) {
      console.error("Error al crear usuario:", error);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      try {
        await axios.delete(`http://localhost:3000/api/users/${id}`);
        fetchUsuarios();
      } catch (error) {
        console.error("Error al eliminar usuario:", error);
      }
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser) {
      alert("No hay usuario seleccionado para editar");
      return;
    }

    const updatedFields = {};
    if (editingUser.Usuario !== usuarios.find((u) => u.IdRegistroLogin === editingUser.IdRegistroLogin)?.Usuario) {
      updatedFields.Usuario = editingUser.Usuario;
    }
    if (editingUser.Correo !== usuarios.find((u) => u.IdRegistroLogin === editingUser.IdRegistroLogin)?.Correo) {
      updatedFields.Correo = editingUser.Correo;
    }
    if (editingUser.IdRol !== usuarios.find((u) => u.IdRegistroLogin === editingUser.IdRegistroLogin)?.IdRol) {
      updatedFields.IdRol = editingUser.IdRol;
    }

    if (Object.keys(updatedFields).length === 0) {
      alert("No se han realizado cambios");
      return;
    }

    try {
      await axios.put(`http://localhost:3000/api/users/${editingUser.IdRegistroLogin}`, updatedFields);
      setEditingUser(null);
      fetchUsuarios();
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
    }
  };

  const cancelEdit = () => {
    setEditingUser(null);
  };

  // Ordenamiento
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Aplicar ordenamiento
  const sortedUsuarios = [...filteredUsuarios].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  // Cálculos para paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsuarios = sortedUsuarios.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedUsuarios.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="px-4 py-20 md:px-8 lg:px-10 max-w-full bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Gestión de Usuarios del Software</h1>
          
          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar usuario..."
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
            
            <button
              onClick={() => setFormVisible(!formVisible)}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
                <input
                  type="text"
                  value={newUser.Usuario}
                  onChange={(e) => setNewUser({ ...newUser, Usuario: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nombre de usuario"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Correo</label>
                <input
                  type="email"
                  value={newUser.Correo}
                  onChange={(e) => setNewUser({ ...newUser, Correo: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="correo@ejemplo.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newUser.PasswordTexto}
                    onChange={(e) => setNewUser({ ...newUser, PasswordTexto: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Contraseña"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-2.5 text-gray-500"
                  >
                    {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                <select
                  value={newUser.IdRol}
                  onChange={(e) => setNewUser({ ...newUser, IdRol: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar Rol</option>
                  {roles.map((role) => (
                    <option key={role.IdRol} value={role.IdRol}>
                      {role.NombreRol}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleCreateUser}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center"
              >
                <Plus size={18} className="mr-2" />
                Crear Usuario
              </button>
            </div>
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
                    className={`hover:bg-blue-50 transition-colors duration-150 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
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
                              title="Guardar cambios"
                            >
                              <Save size={16} />
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
    </div>
  );
};

export default UsuariosSoftware;
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, Edit, Trash2, ChevronLeft, ChevronRight, Plus, Filter, X } from "lucide-react";

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({
    Nombre: "",
    Apellido: "",
    TipoDocumento: "",
    NumeroDocumento: "",
    Usuario: "",
    Correo: "",
    IdTiposDocumentos: "",
    IdRol: "",
  });
  
  // Estados para paginación y búsqueda
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "IdUsuario", direction: "ascending" });
  const itemsPerPage = 5;

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/usuarios", {
        withCredentials: true,
      });
      setUsuarios(response.data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };

  const handleCreateUser = async () => {
    try {
      if (newUser.IdUsuario) {
        await axios.put(
          `http://localhost:3000/api/usuarios/${newUser.IdUsuario}`,
          newUser,
          { withCredentials: true }
        );
      } else {
        await axios.post("http://localhost:3000/api/usuarios", newUser, {
          withCredentials: true,
        });
      }
      setShowModal(false);
      fetchUsuarios();
    } catch (error) {
      console.error(
        newUser.IdUsuario
          ? "Error al actualizar usuario:"
          : "Error al crear usuario:",
        error
      );
    }
  };

  const handleEditUser = (user) => {
    setNewUser(user);
    setShowModal(true);
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      try {
        await axios.delete(`http://localhost:3000/api/usuarios/${id}`, {
          withCredentials: true,
        });
        fetchUsuarios();
      } catch (error) {
        console.error("Error al eliminar usuario:", error);
      }
    }
  };

  // Funciones para la tabla mejorada
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const filteredUsuarios = usuarios.filter((user) => {
    return (
      user.Nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.Apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.Usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.Correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.NumeroDocumento.toString().includes(searchTerm)
    );
  });

  const sortedUsuarios = [...filteredUsuarios].sort((a, b) => {
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
          <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Usuarios Registrados</h1>
          
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
              onClick={() => {
                setNewUser({
                  Nombre: "",
                  Apellido: "",
                  TipoDocumento: "",
                  NumeroDocumento: "",
                  Usuario: "",
                  Correo: "",
                  IdTiposDocumentos: "",
                  IdRol: "",
                });
                setShowModal(true);
              }}
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
                {["ID", "Nombre", "Apellido", "Tipo Doc.", "Número Doc.", "Usuario", "Correo", "Acciones"].map((header, index) => (
                  <th 
                    key={index}
                    onClick={() => {
                      if (index < 7) { // No permitir ordenar por la columna de acciones
                        const keys = ["IdUsuario", "Nombre", "Apellido", "TipoDocumento", "NumeroDocumento", "Usuario", "Correo"];
                        requestSort(keys[index]);
                      }
                    }}
                    className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 ${
                      index < 7 ? "cursor-pointer" : ""
                    }`}
                  >
                    <div className="flex items-center">
                      {header}
                      {index < 7 && (
                        <span className="ml-1">
                          {sortConfig.key === ["IdUsuario", "Nombre", "Apellido", "TipoDocumento", "NumeroDocumento", "Usuario", "Correo"][index] && (
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
              {currentUsuarios.length > 0 ? (
                currentUsuarios.map((user, index) => (
                  <tr 
                    key={user.IdUsuario}
                    className={`hover:bg-blue-50 transition-colors duration-150 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{user.IdUsuario}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{user.Nombre}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{user.Apellido}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{user.TipoDocumento}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{user.NumeroDocumento}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{user.Usuario}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{user.Correo}</td>
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
                  <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
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

      {/* Modal para crear o editar un usuario */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg mx-4 max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">
              {newUser.IdUsuario ? "Editar Usuario" : "Crear Nuevo Usuario"}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  value={newUser.Nombre}
                  onChange={(e) => setNewUser({ ...newUser, Nombre: e.target.value })}
                  className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                <input
                  type="text"
                  value={newUser.Apellido}
                  onChange={(e) => setNewUser({ ...newUser, Apellido: e.target.value })}
                  className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Documento</label>
                <input
                  type="text"
                  value={newUser.TipoDocumento}
                  onChange={(e) => setNewUser({ ...newUser, TipoDocumento: e.target.value })}
                  className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Número de Documento</label>
                <input
                  type="number"
                  value={newUser.NumeroDocumento}
                  onChange={(e) => setNewUser({ ...newUser, NumeroDocumento: e.target.value })}
                  className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
                <input
                  type="text"
                  value={newUser.Usuario}
                  onChange={(e) => setNewUser({ ...newUser, Usuario: e.target.value })}
                  className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Correo</label>
                <input
                  type="email"
                  value={newUser.Correo}
                  onChange={(e) => setNewUser({ ...newUser, Correo: e.target.value })}
                  className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID Tipo Documento</label>
                <input
                  type="number"
                  value={newUser.IdTiposDocumentos}
                  onChange={(e) => setNewUser({ ...newUser, IdTiposDocumentos: e.target.value })}
                  className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID Rol</label>
                <input
                  type="number"
                  value={newUser.IdRol}
                  onChange={(e) => setNewUser({ ...newUser, IdRol: e.target.value })}
                  className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
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
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
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
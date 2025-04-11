import React, { useState, useEffect } from "react";
import axios from "axios";

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [showModal, setShowModal] = useState(false); // Controlar el modal
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

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/usuarios", {
        withCredentials: true, // Enviar cookies
      });
      setUsuarios(response.data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };

  const handleCreateUser = async () => {
    try {
      if (newUser.IdUsuario) {
        // Editar usuario existente
        await axios.put(
          `http://localhost:3000/api/usuarios/${newUser.IdUsuario}`,
          newUser,
          { withCredentials: true } // Enviar cookies
        );
      } else {
        // Crear nuevo usuario
        await axios.post("http://localhost:3000/api/usuarios", newUser, {
          withCredentials: true, // Enviar cookies
        });
      }
      setShowModal(false); // Cerrar el modal
      fetchUsuarios(); // Actualizar la lista de usuarios
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
    try {
      await axios.delete(`http://localhost:3000/api/usuarios/${id}`, {
        withCredentials: true, // Enviar cookies
      });
      fetchUsuarios(); // Actualizar la lista de usuarios
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    }
  };

  return (
    <div className="px-10 py-20 max-w-full">
      <h1 className="text-xl font-bold mb-4">Usuarios Registrados</h1>
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
        className="bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700 mb-4"
      >
        Nuevo Usuario
      </button>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-2 py-1">ID</th>
              <th className="border border-gray-300 px-2 py-1">Nombre</th>
              <th className="border border-gray-300 px-2 py-1">Apellido</th>
              <th className="border border-gray-300 px-2 py-1">
                Tipo Documento
              </th>
              <th className="border border-gray-300 px-2 py-1">
                Número Documento
              </th>
              <th className="border border-gray-300 px-2 py-1">Usuario</th>
              <th className="border border-gray-300 px-2 py-1">Correo</th>
              <th className="border border-gray-300 px-2 py-1">
                ID Tipo Documento
              </th>
              <th className="border border-gray-300 px-2 py-1">ID Rol</th>
              <th className="border border-gray-300 px-2 py-1">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((user) => (
              <tr key={user.IdUsuario}>
                <td className="border border-gray-300 px-2 py-1">
                  {user.IdUsuario}
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  {user.Nombre}
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  {user.Apellido}
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  {user.TipoDocumento}
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  {user.NumeroDocumento}
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  {user.Usuario}
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  {user.Correo}
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  {user.IdTiposDocumentos}
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  {user.IdRol}
                </td>
                <td className="flex border border-gray-300 px-2 py-1">
                  <button
                    onClick={() => handleEditUser(user)}
                    className="bg-blue-600 text-white text-sm px-2 py-1 rounded hover:bg-blue-800 mr-1"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.IdUsuario)}
                    className="bg-red-600 text-white text-sm px-2 py-1 rounded hover:bg-red-700"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para crear o editar un usuario */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow-lg w-1/3">
            <h2 className="text-lg font-bold mb-4">
              {newUser.IdUsuario ? "Editar Usuario" : "Crear Nuevo Usuario"}
            </h2>
            <div className="mb-2">
              <input
                type="text"
                placeholder="Nombre"
                value={newUser.Nombre}
                onChange={(e) =>
                  setNewUser({ ...newUser, Nombre: e.target.value })
                }
                className="border p-2 rounded w-full text-sm"
              />
            </div>
            <div className="mb-2">
              <input
                type="text"
                placeholder="Apellido"
                value={newUser.Apellido}
                onChange={(e) =>
                  setNewUser({ ...newUser, Apellido: e.target.value })
                }
                className="border p-2 rounded w-full text-sm"
              />
            </div>
            <div className="mb-2">
              <input
                type="text"
                placeholder="Tipo de Documento"
                value={newUser.TipoDocumento}
                onChange={(e) =>
                  setNewUser({ ...newUser, TipoDocumento: e.target.value })
                }
                className="border p-2 rounded w-full text-sm"
              />
            </div>
            <div className="mb-2">
              <input
                type="number"
                placeholder="Número de Documento"
                value={newUser.NumeroDocumento}
                onChange={(e) =>
                  setNewUser({ ...newUser, NumeroDocumento: e.target.value })
                }
                className="border p-2 rounded w-full text-sm"
              />
            </div>
            <div className="mb-2">
              <input
                type="text"
                placeholder="Usuario"
                value={newUser.Usuario}
                onChange={(e) =>
                  setNewUser({ ...newUser, Usuario: e.target.value })
                }
                className="border p-2 rounded w-full text-sm"
              />
            </div>
            <div className="mb-2">
              <input
                type="email"
                placeholder="Correo"
                value={newUser.Correo}
                onChange={(e) =>
                  setNewUser({ ...newUser, Correo: e.target.value })
                }
                className="border p-2 rounded w-full text-sm"
              />
            </div>
            <div className="mb-2">
              <input
                type="number"
                placeholder="ID Tipo Documento"
                value={newUser.IdTiposDocumentos}
                onChange={(e) =>
                  setNewUser({ ...newUser, IdTiposDocumentos: e.target.value })
                }
                className="border p-2 rounded w-full text-sm"
              />
            </div>
            <div className="mb-2">
              <input
                type="number"
                placeholder="ID Rol"
                value={newUser.IdRol}
                onChange={(e) =>
                  setNewUser({ ...newUser, IdRol: e.target.value })
                }
                className="border p-2 rounded w-full text-sm"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 text-white text-sm px-3 py-1 rounded hover:bg-gray-600 mr-2"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateUser}
                className="bg-green-600 text-white text-sm px-3 py-1 rounded hover:bg-green-700"
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

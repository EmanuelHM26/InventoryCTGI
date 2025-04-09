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
      await axios.post("http://localhost:3000/api/usuarios", newUser, {
        withCredentials: true, // Enviar cookies
      });
      setShowModal(false); // Cerrar el modal
      fetchUsuarios(); // Actualizar la lista de usuarios
    } catch (error) {
      console.error("Error al crear usuario:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Usuarios Registrados</h1>
      <button
        onClick={() => setShowModal(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Nuevo Usuario
      </button>
      <div className="grid grid-cols-4 gap-4 mt-6">
        {usuarios.map((user) => (
          <div
            key={user.IdUsuario}
            className="border p-4 rounded shadow-md bg-white"
          >
            <h2 className="text-lg font-bold">
              {user.Nombre} {user.Apellido}
            </h2>
            <p className="text-sm text-gray-600">{user.Correo}</p>
            <p className="text-sm text-gray-600">{user.Usuario}</p>
            <p className="text-sm text-gray-600">Rol: {user.IdRol}</p>
          </div>
        ))}
      </div>

      {/* Modal para crear un nuevo usuario */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">Crear Nuevo Usuario</h2>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Nombre"
                value={newUser.Nombre}
                onChange={(e) =>
                  setNewUser({ ...newUser, Nombre: e.target.value })
                }
                className="border p-2 rounded w-full"
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Apellido"
                value={newUser.Apellido}
                onChange={(e) =>
                  setNewUser({ ...newUser, Apellido: e.target.value })
                }
                className="border p-2 rounded w-full"
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Tipo de Documento"
                value={newUser.TipoDocumento}
                onChange={(e) =>
                  setNewUser({ ...newUser, TipoDocumento: e.target.value })
                }
                className="border p-2 rounded w-full"
              />
            </div>
            <div className="mb-4">
              <input
                type="number"
                placeholder="Número de Documento"
                value={newUser.NumeroDocumento}
                onChange={(e) =>
                  setNewUser({ ...newUser, NumeroDocumento: e.target.value })
                }
                className="border p-2 rounded w-full"
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Usuario"
                value={newUser.Usuario}
                onChange={(e) =>
                  setNewUser({ ...newUser, Usuario: e.target.value })
                }
                className="border p-2 rounded w-full"
              />
            </div>
            <div className="mb-4">
              <input
                type="email"
                placeholder="Correo"
                value={newUser.Correo}
                onChange={(e) =>
                  setNewUser({ ...newUser, Correo: e.target.value })
                }
                className="border p-2 rounded w-full"
              />
            </div>
            <div className="mb-4">
              <input
                type="number"
                placeholder="ID Tipo Documento"
                value={newUser.IdTiposDocumentos}
                onChange={(e) =>
                  setNewUser({ ...newUser, IdTiposDocumentos: e.target.value })
                }
                className="border p-2 rounded w-full"
              />
            </div>
            <div className="mb-4">
              <input
                type="number"
                placeholder="ID Rol"
                value={newUser.IdRol}
                onChange={(e) =>
                  setNewUser({ ...newUser, IdRol: e.target.value })
                }
                className="border p-2 rounded w-full"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mr-2"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateUser}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Crear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Usuarios;
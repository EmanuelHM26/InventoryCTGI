import React, { useState, useEffect } from "react";
import axios from "axios";

const UsuariosSoftware = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [newUser, setNewUser] = useState({
    Usuario: "",
    Correo: "",
    PasswordTexto: "",
    IdRol: "",
  });
  const [editingUser, setEditingUser] = useState(null); // Usuario que se está editando

  useEffect(() => {
    fetchUsuarios();
    fetchRoles();
  }, []);

  axios.defaults.withCredentials = true;

  const fetchUsuarios = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/users");
      setUsuarios(response.data);
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
      fetchUsuarios();
    } catch (error) {
      console.error("Error al crear usuario:", error);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/users/${id}`);
      fetchUsuarios();
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    }
  };

 

  const handleUpdateUser = async () => {
    if (!editingUser.Usuario || !editingUser.Correo || !editingUser.IdRol) {
      alert("Todos los campos son obligatorios");
      return;
    }
    try {
      await axios.put(`http://localhost:3000/api/users/${editingUser.IdRegistroLogin}`, {
        Usuario: editingUser.Usuario,
        Correo: editingUser.Correo,
        IdRol: editingUser.IdRol,
      });
      setEditingUser(null); // Cerrar el modo de edición
      fetchUsuarios();
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Usuarios del Software</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Usuario"
          value={newUser.Usuario}
          onChange={(e) => setNewUser({ ...newUser, Usuario: e.target.value })}
          className="border p-2 rounded mr-2"
        />
        <input
          type="email"
          placeholder="Correo"
          value={newUser.Correo}
          onChange={(e) => setNewUser({ ...newUser, Correo: e.target.value })}
          className="border p-2 rounded mr-2"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={newUser.PasswordTexto}
          onChange={(e) => setNewUser({ ...newUser, PasswordTexto: e.target.value })}
          className="border p-2 rounded mr-2"
        />
        <select
          value={newUser.IdRol}
          onChange={(e) => setNewUser({ ...newUser, IdRol: e.target.value })}
          className="border p-2 rounded mr-2"
        >
          <option value="">Seleccionar Rol</option>
          {roles.map((role) => (
            <option key={role.IdRol} value={role.IdRol}>
              {role.NombreRol}
            </option>
          ))}
        </select>
        <button
          onClick={handleCreateUser}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Crear Usuario
        </button>
      </div>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2">ID</th>
            <th className="border border-gray-300 px-4 py-2">Usuario</th>
            <th className="border border-gray-300 px-4 py-2">Correo</th>
            <th className="border border-gray-300 px-4 py-2">Rol</th>
            <th className="border border-gray-300 px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((user) => (
            <tr key={user.IdRegistroLogin}>
              <td className="border border-gray-300 px-4 py-2">{user.IdRegistroLogin}</td>
              <td className="border border-gray-300 px-4 py-2">
                {editingUser?.IdRegistroLogin === user.IdRegistroLogin ? (
                  <input
                    type="text"
                    value={editingUser.Usuario}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, Usuario: e.target.value })
                    }
                    className="border p-2 rounded"
                  />
                ) : (
                  user.Usuario
                )}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {editingUser?.IdRegistroLogin === user.IdRegistroLogin ? (
                  <input
                    type="email"
                    value={editingUser.Correo}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, Correo: e.target.value })
                    }
                    className="border p-2 rounded"
                  />
                ) : (
                  user.Correo
                )}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {editingUser?.IdRegistroLogin === user.IdRegistroLogin ? (
                  <select
                    value={editingUser.IdRol}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, IdRol: e.target.value })
                    }
                    className="border p-2 rounded"
                  >
                    {roles.map((role) => (
                      <option key={role.IdRol} value={role.IdRol}>
                        {role.NombreRol}
                      </option>
                    ))}
                  </select>
                ) : (
                  roles.find((role) => role.IdRol === user.IdRol)?.NombreRol || "N/A"
                )}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {editingUser?.IdRegistroLogin === user.IdRegistroLogin ? (
                  <button
                    onClick={handleUpdateUser}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2"
                  >
                    Guardar
                  </button>
                ) : (
                  <button
                    onClick={() => setEditingUser(user)}
                    className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 mr-2"
                  >
                    Editar
                  </button>
                )}
                <button
                  onClick={() => handleDeleteUser(user.IdRegistroLogin)}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsuariosSoftware;
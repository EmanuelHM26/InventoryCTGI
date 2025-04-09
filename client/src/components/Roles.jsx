import React, { useState, useEffect } from "react";
import axios from "axios";

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [newRole, setNewRole] = useState("");

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/roles");
      setRoles(response.data);
    } catch (error) {
      console.error("Error al obtener roles:", error);
    }
  };

  const handleCreateRole = async () => {
    if (!newRole) return;
    try {
      await axios.post("http://localhost:3000/api/roles", { NombreRol: newRole });
      setNewRole("");
      fetchRoles();
    } catch (error) {
      console.error("Error al crear rol:", error);
    }
  };

  const handleDeleteRole = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/roles/${id}`);
      fetchRoles();
    } catch (error) {
      console.error("Error al eliminar rol:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Roles</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Nuevo Rol"
          value={newRole}
          onChange={(e) => setNewRole(e.target.value)}
          className="border p-2 rounded mr-2"
        />
        <button
          onClick={handleCreateRole}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Agregar Rol
        </button>
      </div>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2">ID</th>
            <th className="border border-gray-300 px-4 py-2">Nombre</th>
            <th className="border border-gray-300 px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(roles) &&
            roles.map((role) => (
              <tr key={role.IdRol}>
                <td className="border border-gray-300 px-4 py-2">
                  {role.IdRol}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {role.NombreRol}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    onClick={() => handleDeleteRole(role.IdRol)}
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

export default Roles;

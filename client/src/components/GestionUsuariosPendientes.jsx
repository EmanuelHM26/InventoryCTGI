import React from "react";
import { useUsuariosSoftware } from "../hooks/useUsuariosSoftware";
import { CheckCircle, XCircle } from "lucide-react";

const GestionUsuariosPendientes = () => {
  const {
    usuarios,
    roles,
    toggleUserActivation,
    changeUserRole,
    fetchUsuarios, // Añadir fetchUsuarios para forzar actualización
  } = useUsuariosSoftware();

  // Estado local para manejar cambios de rol temporalmente
  const [selectedRoles, setSelectedRoles] = useState({});

  // Filtrar solo usuarios inactivos
  const usuariosPendientes = usuarios.filter((user) => !user.isVerified);

  const handleRoleChange = (userId, newRoleId) => {
    // Actualizar estado local inmediatamente
    setSelectedRoles((prev) => ({ ...prev, [userId]: parseInt(newRoleId) }));

    // Llamar a la función para cambiar el rol
    changeUserRole(userId, parseInt(newRoleId));
  };

  const handleActivateUser = async (userId, isCurrentlyActive) => {
    await toggleUserActivation(userId, isCurrentlyActive);
    // Forzar actualización después de activar
    setTimeout(() => {
      fetchUsuarios();
    }, 500);
  };

  if (usuariosPendientes.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-blue-50 px-6 py-3 border-b">
        <h2 className="text-lg font-semibold text-blue-800">
          Usuarios Pendientes de Activación ({usuariosPendientes.length})
        </h2>
        <p className="text-sm text-blue-600 mt-1">
          Estos usuarios requieren activación antes de poder iniciar sesión
        </p>
      </div>

<div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usuario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Correo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rol Actual
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {usuariosPendientes.map((user) => (
              <tr key={user.IdRegistroLogin} className="hover:bg-blue-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{user.Usuario}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{user.Correo}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {roles.find((role) => role.IdRol === user.IdRol)?.NombreRol || "Sin rol"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2 items-center">
                    <button
                      onClick={() => handleActivateUser(user.IdRegistroLogin, user.isVerified)}
                      className="flex items-center text-green-600 hover:text-green-800 px-3 py-1 bg-green-100 rounded-md transition-colors duration-200"
                      title="Activar usuario"
                    >
                      <CheckCircle size={16} className="mr-1" />
                      Activar
                    </button>
                    
                    <select
                      onChange={(e) => handleRoleChange(user.IdRegistroLogin, e.target.value)}
                      value={selectedRoles[user.IdRegistroLogin] || user.IdRol || ""}
                      className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      title="Cambiar rol"
                    >
                      <option value="">Seleccionar rol</option>
                      {roles.map((role) => (
                        <option key={role.IdRol} value={role.IdRol}>
                          {role.NombreRol}
                        </option>
                      ))}
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GestionUsuariosPendientes;

import React, { useState, useEffect } from "react";
import { useUsuariosSoftware } from "../hooks/useUsuariosSoftware";
import { CheckCircle, RefreshCw } from "lucide-react";

const GestionUsuariosPendientes = () => {
  const {
    usuarios,
    roles,
    toggleUserActivation,
    changeUserRole,
    forceRefresh,
    fetchUsuarios // Asegúrate de que esta función esté disponible en tu hook
  } = useUsuariosSoftware();

  const [selectedRoles, setSelectedRoles] = useState({});
  const [isLoading, setIsLoading] = useState({});
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Filtrar solo usuarios inactivos con correo verificado
  const usuariosPendientes = usuarios.filter(
    (user) => user.emailVerified && !user.isVerified
  );

  // Sincronizar selectedRoles con los datos actuales
  useEffect(() => {
    const initialRoles = {};
    usuariosPendientes.forEach(user => {
      initialRoles[user.IdRegistroLogin] = user.IdRol;
    });
    setSelectedRoles(initialRoles);
  }, [usuarios, refreshTrigger]);

  const handleRoleChange = async (userId, newRoleId) => {
    setIsLoading(prev => ({ ...prev, [userId]: true }));
    
    try {
      // Actualizar estado local inmediatamente para feedback visual
      setSelectedRoles(prev => ({ ...prev, [userId]: parseInt(newRoleId) }));
      
      // Cambiar el rol en la base de datos
      await changeUserRole(userId, parseInt(newRoleId));
      
      // Forzar actualización de datos
      await fetchUsuarios(); // Actualizar la lista completa
      setRefreshTrigger(prev => prev + 1); // Forzar re-render
      
    } catch (error) {
      console.error("Error cambiando rol:", error);
      // Revertir cambio visual si falla
      const originalRole = usuarios.find(u => u.IdRegistroLogin === userId)?.IdRol;
      setSelectedRoles(prev => ({ ...prev, [userId]: originalRole }));
    } finally {
      setIsLoading(prev => ({ ...prev, [userId]: false }));
    }
  };

  const handleActivateUser = async (userId) => {
    setIsLoading(prev => ({ ...prev, [userId]: true }));
    
    try {
      // Activar usuario
      await toggleUserActivation(userId, false); // false porque queremos activarlo
      
      // Forzar actualización completa
      await fetchUsuarios();
      setRefreshTrigger(prev => prev + 1);
      
    } catch (error) {
      console.error("Error activando usuario:", error);
    } finally {
      setIsLoading(prev => ({ ...prev, [userId]: false }));
    }
  };

  const handleManualRefresh = async () => {
    setIsLoading({ global: true });
    try {
      await fetchUsuarios();
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error("Error refrescando datos:", error);
    } finally {
      setIsLoading({ global: false });
    }
  };

  if (usuariosPendientes.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-blue-50 px-6 py-3 border-b flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-blue-800">
            Usuarios Pendientes de Activación ({usuariosPendientes.length})
          </h2>
          <p className="text-sm text-blue-600 mt-1">
            Estos usuarios han verificado su correo pero requieren activación administrativa
          </p>
        </div>
        <button
          onClick={handleManualRefresh}
          disabled={isLoading.global}
          className="flex items-center text-blue-600 hover:text-blue-800 px-3 py-1 bg-blue-100 rounded-md transition-colors duration-200 disabled:opacity-50"
          title="Actualizar lista"
        >
          <RefreshCw size={16} className={`mr-1 ${isLoading.global ? 'animate-spin' : ''}`} />
          Actualizar
        </button>
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
                Estado
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
                  <div className="text-sm font-medium text-gray-900">
                    {user.Usuario}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{user.Correo}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {roles.find((role) => role.IdRol === user.IdRol)
                      ?.NombreRol || "Sin rol"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                    Pendiente
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2 items-center">
                    <button
                      onClick={() => handleActivateUser(user.IdRegistroLogin)}
                      disabled={isLoading[user.IdRegistroLogin]}
                      className="flex items-center text-green-600 hover:text-green-800 px-3 py-1 bg-green-100 rounded-md transition-colors duration-200 disabled:opacity-50"
                      title="Activar usuario"
                    >
                      <CheckCircle size={16} className="mr-1" />
                      {isLoading[user.IdRegistroLogin] ? "Activando..." : "Activar"}
                    </button>

                    <select
                      onChange={(e) =>
                        handleRoleChange(user.IdRegistroLogin, e.target.value)
                      }
                      value={selectedRoles[user.IdRegistroLogin] || user.IdRol || ""}
                      disabled={isLoading[user.IdRegistroLogin]}
                      className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
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
import React, { useState } from "react";
import { useAuth } from "../context/authContext";

const Settings = () => {
  const { user, updatePassword, updateNotifications } = useAuth();
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    securityAlerts: true,
    weeklyReports: false
  });
  const [message, setMessage] = useState({ type: "", text: "" });

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationSettings(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: "error", text: "Las contraseñas no coinciden" });
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      setMessage({ type: "error", text: "La contraseña debe tener al menos 6 caracteres" });
      return;
    }
    
    try {
      await updatePassword(passwordForm.currentPassword, passwordForm.newPassword);
      setMessage({ type: "success", text: "Contraseña actualizada correctamente" });
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      setMessage({ type: "error", text: "Error al actualizar la contraseña. Verifique su contraseña actual." });
    }
  };

  const handleNotificationsSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateNotifications(notificationSettings);
      setMessage({ type: "success", text: "Preferencias de notificación actualizadas" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      setMessage({ type: "error", text: "Error al actualizar las preferencias" });
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Ajustes de Cuenta</h2>

      {message.text && (
        <div className={`mb-6 p-3 rounded-lg ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Cambio de contraseña */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Cambiar Contraseña</h3>
          
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña actual</label>
              <input
                type="password"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nueva contraseña</label>
              <input
                type="password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
                minLength={6}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar nueva contraseña</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
                minLength={6}
              />
            </div>
            
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Actualizar Contraseña
            </button>
          </form>
        </div>

        {/* Preferencias de notificación */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Preferencias de Notificación</h3>
          
          <form onSubmit={handleNotificationsSubmit} className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="emailNotifications"
                name="emailNotifications"
                checked={notificationSettings.emailNotifications}
                onChange={handleNotificationChange}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-700">
                Notificaciones por correo electrónico
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="pushNotifications"
                name="pushNotifications"
                checked={notificationSettings.pushNotifications}
                onChange={handleNotificationChange}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="pushNotifications" className="ml-2 block text-sm text-gray-700">
                Notificaciones push
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="securityAlerts"
                name="securityAlerts"
                checked={notificationSettings.securityAlerts}
                onChange={handleNotificationChange}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="securityAlerts" className="ml-2 block text-sm text-gray-700">
                Alertas de seguridad
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="weeklyReports"
                name="weeklyReports"
                checked={notificationSettings.weeklyReports}
                onChange={handleNotificationChange}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="weeklyReports" className="ml-2 block text-sm text-gray-700">
                Reportes semanales
              </label>
            </div>
            
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors mt-4"
            >
              Guardar Preferencias
            </button>
          </form>
        </div>
      </div>

      {/* Información de la cuenta */}
      <div className="mt-8 bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Información de la Cuenta</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Nombre de usuario</p>
            <p className="text-gray-800">{user?.nombre || "No especificado"}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Correo electrónico</p>
            <p className="text-gray-800">{user?.email || user?.Correo || "No especificado"}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Rol</p>
            <p className="text-gray-800">{user?.rol || "No especificado"}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Miembro desde</p>
            <p className="text-gray-800">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Fecha no disponible"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
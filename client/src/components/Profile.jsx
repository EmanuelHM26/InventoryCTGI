import React, { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || "",
        email: user.email || user.Correo || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      setMessage({ type: "success", text: "Perfil actualizado correctamente" });
      setIsEditing(false);
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      setMessage({ type: "error", text: "Error al actualizar el perfil" });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Restaurar los valores originales
    setFormData({
      nombre: user?.nombre || "",
      email: user?.email || user?.Correo || "",
    });
    setMessage({ type: "", text: "" });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header con título y botón */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
            <p className="text-gray-500 mt-1">Gestiona tu información personal</p>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 shadow-sm hover:shadow-md font-medium"
            >
              Editar Perfil
            </button>
          )}
        </div>

        {/* Mensaje de estado */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-xl border ${
            message.type === "success" 
              ? "bg-green-50 text-green-800 border-green-200" 
              : "bg-red-50 text-red-800 border-red-200"
          }`}>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                {message.type === "success" ? (
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                ) : (
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                )}
              </svg>
              {message.text}
            </div>
          </div>
        )}

        {/* Contenedor principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card del usuario - Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Banner decorativo */}
              <div className="h-24 bg-gradient-to-r from-green-500 to-green-600"></div>
              
              {/* Avatar y info básica */}
              <div className="px-6 pb-6">
                <div className="flex flex-col items-center -mt-12">
                  <div className="w-24 h-24 rounded-full bg-white p-1 shadow-lg">
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white text-3xl font-bold">
                      {user?.nombre ? user.nombre.charAt(0).toUpperCase() : "U"}
                    </div>
                  </div>
                  
                  <h2 className="mt-4 text-xl font-bold text-gray-900">{user?.nombre || "Usuario"}</h2>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 mt-2">
                    {user?.rol || "Rol"}
                  </span>
                </div>

                {/* Información de contacto */}
                <div className="mt-6 space-y-3">
                  <div className="flex items-start p-3 bg-gray-50 rounded-lg">
                    <svg className="w-5 h-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Correo electrónico</p>
                      <p className="text-sm text-gray-900 mt-1 break-words">
                        {user?.email || user?.Correo || "No especificado"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Información Personal - Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Información Personal</h3>
              
              {isEditing ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Campo de Nombre */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nombre completo
                      </label>
                      <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        placeholder="Ingresa tu nombre"
                        required
                      />
                    </div>
                    
                    {/* Campo de Email */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Correo electrónico
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        placeholder="correo@ejemplo.com"
                        required
                      />
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={handleSubmit}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                    >
                      Guardar Cambios
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Nombre completo
                      </p>
                      <p className="text-base font-medium text-gray-900">
                        {user?.nombre || "No especificado"}
                      </p>
                    </div>
                    <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Correo electrónico
                      </p>
                      <p className="text-base font-medium text-gray-900 break-words">
                        {user?.email || user?.Correo || "No especificado"}
                      </p>
                    </div>
                  </div>

                  {/* Información adicional */}
                  <div className="pt-6 border-t border-gray-200">
                    <div className="flex items-start p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-blue-900">
                          Mantén tu información actualizada
                        </p>
                        <p className="text-sm text-blue-700 mt-1">
                          Asegúrate de que tu correo electrónico sea correcto para recibir notificaciones importantes.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
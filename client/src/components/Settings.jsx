import React, { useState } from "react";
import { useAuth } from "../context/authContext";
import Swal from "sweetalert2";

const Settings = () => {
  const { user, updatePassword } = useAuth();
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: "error", text: "Las contraseñas no coinciden" });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setMessage({
        type: "error",
        text: "La contraseña debe tener al menos 6 caracteres",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await updatePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword
      );

      setMessage({
        type: "success",
        text: "Contraseña actualizada correctamente",
      });
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      await Swal.fire({
        icon: "success",
        title: "¡Contraseña actualizada!",
        text: "Tu contraseña ha sido actualizada exitosamente.",
        timer: 2000,
        showConfirmButton: false,
      });

      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      const errorMessage =
        error.error || error.message || "Error al actualizar la contraseña";
      setMessage({ type: "error", text: errorMessage });

      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        confirmButtonText: "Aceptar",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const PasswordStrength = ({ password }) => {
    const getStrength = () => {
      if (!password) return { level: 0, text: "", color: "" };
      if (password.length < 6)
        return { level: 1, text: "Débil", color: "bg-red-500" };
      if (password.length < 10)
        return { level: 2, text: "Media", color: "bg-yellow-500" };
      return { level: 3, text: "Fuerte", color: "bg-green-500" };
    };

    const strength = getStrength();
    if (!password) return null;

    return (
      <div className="mt-2">
        <div className="flex gap-1 mb-1">
          {[1, 2, 3].map((level) => (
            <div
              key={level}
              className={`h-1 flex-1 rounded-full transition-all ${
                level <= strength.level ? strength.color : "bg-gray-200"
              }`}
            />
          ))}
        </div>
        <p className="text-xs text-gray-600">Seguridad: {strength.text}</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Ajustes de Cuenta
          </h1>
          <p className="text-gray-500 mt-1">
            Gestiona tu seguridad y preferencias
          </p>
        </div>

        {/* Mensaje de estado */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-xl border ${
              message.type === "success"
                ? "bg-green-50 text-green-800 border-green-200"
                : "bg-red-50 text-red-800 border-red-200"
            }`}
          >
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-3 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                {message.type === "success" ? (
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                ) : (
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                )}
              </svg>
              <span>{message.text}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cambio de Contraseña - Principal */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center mr-3">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Cambiar Contraseña
                  </h3>
                  <p className="text-sm text-gray-500">
                    Actualiza tu contraseña periódicamente
                  </p>
                </div>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-5">
                {/* Contraseña actual */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Contraseña actual
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      name="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      placeholder="Ingresa tu contraseña actual"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showCurrentPassword ? (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Nueva contraseña */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nueva contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      placeholder="Mínimo 6 caracteres"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPassword ? (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                  <PasswordStrength password={passwordForm.newPassword} />
                </div>

                {/* Confirmar contraseña */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirmar nueva contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      placeholder="Repite tu nueva contraseña"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                  {passwordForm.confirmPassword &&
                    passwordForm.newPassword !==
                      passwordForm.confirmPassword && (
                      <p className="text-xs text-red-600 mt-1">
                        Las contraseñas no coinciden
                      </p>
                    )}
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full sm:w-auto px-6 py-3 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md ${
                      isSubmitting
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
                  >
                    {isSubmitting ? "Actualizando..." : "Actualizar Contraseña"}
                  </button>
                </div>

                {/* Tips de seguridad */}
                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <div className="flex items-start">
                    <svg
                      className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div>
                      <p className="text-sm font-semibold text-amber-900 mb-1">
                        Consejos de seguridad
                      </p>
                      <ul className="text-sm text-amber-800 space-y-1">
                        <li>• Usa al menos 10 caracteres</li>
                        <li>• Combina mayúsculas, minúsculas y números</li>
                        <li>• No uses información personal</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Información de la Cuenta - Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-5">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  Información de Cuenta
                </h3>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Usuario
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {user?.Usuario || user?.nombre || "Cargando..."}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Correo
                  </p>
                  <p className="text-sm font-medium text-gray-900 break-words">
                    {user?.Correo ||
                      user?.email ||
                      user?.correo ||
                      "Cargando..."}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Rol
                  </p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {user?.Rol || user?.rol || "Cargando..."}
                  </span>
                </div>
              </div>

              {/* Estadísticas adicionales */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Estado de la cuenta</span>
                  <span className="flex items-center text-green-600 font-medium">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Activa
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

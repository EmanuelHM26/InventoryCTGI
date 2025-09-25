import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/authContext";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const Login = () => {
  const { signin, user } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Estado para controlar la visibilidad de la contraseña
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const onSubmit = async (data) => {
    try {
      await signin({
        Correo: data.correo,
        PasswordTexto: data.password,
      });

      Swal.fire({
        icon: "success",
        title: "Inicio de sesión exitoso",
        text: "Has iniciado sesión correctamente",
        confirmButtonColor: "#22c55e",
      }).then(() => {
        navigate("/dashboard");
      });
    } catch (error) {
      console.error("Error al iniciar sesión:", error.message);

      // Manejo de errores específicos con mensajes más descriptivos
      let errorMsg =
        error.message || "La contraseña o el usuario son incorrectos";
      let errorTitle = "Error al iniciar sesión";
      let errorIcon = "error";

      if (error.message.includes("verificar tu correo")) {
        errorMsg =
          "Debes verificar tu correo electrónico antes de iniciar sesión. Revisa tu bandeja de entrada.";
        errorTitle = "Verificación requerida";
        errorIcon = "warning";
      } else if (error.message.includes("pendiente de activación")) {
        errorMsg =
          "Tu cuenta está pendiente de activación por un administrador. Contacta con el administrador del sistema.";
        errorTitle = "Activación pendiente";
        errorIcon = "info";
      } else if (error.message.includes("Correo o contraseña incorrectos")) {
        errorMsg =
          "Las credenciales ingresadas son incorrectas. Por favor, verifica tu correo y contraseña.";
        errorTitle = "Credenciales incorrectas";
        errorIcon = "error";
      }

      Swal.fire({
        icon: errorIcon,
        title: errorTitle,
        text: errorMsg,
        confirmButtonColor: "#ef4444",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="flex bg-white rounded-lg shadow-lg overflow-hidden w-4/5 max-w-4xl">
        {/* Sección Izquierda */}
        <div className="w-1/2 bg-green-600 text-white p-8 flex flex-col justify-center rounded-l-lg">
          <h2 className="text-2xl font-bold">
            Servicio Nacional de Aprendizaje
          </h2>
          <p className="mt-2">
            Plataforma de formación para el trabajo. Accede a nuestro sistema
            para gestionar tus cursos y programas de formación.
          </p>
        </div>
        {/* Sección Derecha */}
        <div className="w-1/2 p-12">
          <h2 className="text-2xl font-bold text-center text-green-600 mb-4">
            Iniciar Sesión
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label
                htmlFor="correo"
                className="block text-sm font-medium text-gray-700"
              >
                Correo
              </label>
              <input
                id="correo"
                type="email"
                placeholder="Ingrese su correo"
                {...register("correo", {
                  required: "El correo es obligatorio",
                })}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
              />
              {errors.correo && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.correo.message}
                </p>
              )}
            </div>

            {/* Campo Contraseña con icono de visualización */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Ingrese su contraseña"
                  {...register("password", {
                    required: "La contraseña es obligatoria",
                    minLength: {
                      value: 8,
                      message: "Debe tener al menos 8 caracteres",
                    },
                  })}
                  className="mt-1 block w-full px-4 py-2 pr-12 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? (
                    // Icono de ojo tachado (ocultar)
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.878 6.878M14.12 14.12l3 3m-6.364-6.364L12 12m-3.536-3.536l3.536 3.536M9.878 9.878l3.122 3.122m0 0L9.878 9.878"
                      />
                    </svg>
                  ) : (
                    // Icono de ojo normal (mostrar)
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
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
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition duration-300"
            >
              Iniciar Sesión
            </button>
            <p className="text-sm text-center text-green-600 mt-4 cursor-pointer hover:underline">
              <Link to="/forgot-password"> ¿Olvidaste tu contraseña?</Link>
            </p>

            <p className="text-xs text-gray-500 mt-4 text-center hover:underline">
              ¿No tienes cuenta?{" "}
              <Link to="/register" className="text-green-600">
                Regístrate aquí
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

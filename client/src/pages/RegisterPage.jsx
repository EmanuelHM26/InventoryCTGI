import { useForm } from "react-hook-form";
import { useAuth } from "../context/authContext";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useState } from "react";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const { signup } = useAuth();
  const navigate = useNavigate();

  // Estados para controlar la visibilidad de las contraseñas
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Observar el valor del campo password para compararlo con confirmPassword
  const watchPassword = watch("password");

  const onSubmit = async (data) => {
    try {
      console.log("Datos enviados al registro:", data);

      // Solo enviamos los campos necesarios al backend (sin confirmPassword)
      await signup({
        Usuario: data.usuario,
        Correo: data.correo,
        PasswordTexto: data.password,
      });

      Swal.fire({
        icon: "success",
        title: "Registro exitoso",
        text: "Usuario registrado exitosamente, Revisa tu correo para verificar tu cuenta.",
        confirmButtonColor: "#22c55e", // Color verde
      }).then(() => {
        navigate("/login");
      });
    } catch (error) {
      console.error("Error al registrar usuario:", error.message);

      Swal.fire({
        icon: "error",
        title: "Error en el registro",
        text: `Error al registrar usuario: ${error.message}`,
        confirmButtonColor: "#ef4444", // Color rojo
      }).then(() => {
        navigate("/register");
      });
    }
  };

  // Función para eliminar espacios en tiempo real
  const removeSpaces = (e) => {
    e.target.value = e.target.value.replace(/\s/g, "");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="flex bg-white rounded-lg shadow-lg overflow-hidden w-4/5 max-w-4xl">
        {/* Sección Izquierda */}
        <div className="w-1/2 bg-green-600 p-10 flex flex-col justify-center text-white">
          <h2 className="text-2xl font-bold">
            Servicio Nacional de Aprendizaje
          </h2>
          <p className="mt-2 text-sm">
            Plataforma de formación para el trabajo. Accede a nuestro sistema
            para gestionar tus cursos y programas de formación.
          </p>
        </div>

        {/* Sección Derecha */}
        <div className="w-1/2 p-10">
          <div className="flex justify-center border-b pb-2 mb-6">
            <button className="text-green-600 text-lg font-semibold border-b-2 border-green-600">
              Registrarse
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Usuario */}
            <div>
              <label
                htmlFor="usuario"
                className="block text-sm font-medium text-gray-700"
              >
                Usuario
              </label>
              <input
                id="usuario"
                type="text"
                placeholder="Cree un nombre de usuario"
                {...register("usuario", {
                  required: "El usuario es obligatorio",
                  validate: (value) =>
                    value.trim() !== "" ||
                    "No puede estar vacío o solo espacios",
                  pattern: {
                    value: /^\S+$/,
                    message: "No se permiten espacios",
                  },
                })}
                className="w-full px-4 py-2 border rounded-md focus:ring-green-500 focus:border-green-500"
                onInput={removeSpaces}
              />
              {errors.usuario && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.usuario.message}
                </p>
              )}
            </div>

            {/* Correo */}
            <div>
              <label
                htmlFor="correo"
                className="block text-sm font-medium text-gray-700"
              >
                Correo Electrónico
              </label>
              <input
                id="correo"
                type="email"
                placeholder="Ingrese su correo electrónico"
                {...register("correo", {
                  required: "El correo es obligatorio",
                  pattern: {
                    value: /^[^@\s]+@[^@\s]+\.[a-zA-Z]{2,}$/,
                    message: "Correo inválido o contiene espacios",
                  },
                  validate: (value) =>
                    value.trim() !== "" ||
                    "No puede estar vacío o solo espacios",
                })}
                className="w-full px-4 py-2 border rounded-md focus:ring-green-500 focus:border-green-500"
                onInput={removeSpaces}
              />
              {errors.correo && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.correo.message}
                </p>
              )}
            </div>

            {/* Contraseña */}
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
                  placeholder="Cree una contraseña"
                  {...register("password", {
                    required: "La contraseña es obligatoria",
                    minLength: {
                      value: 8,
                      message: "Debe tener al menos 8 caracteres",
                    },
                    pattern: {
                      value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                      message:
                        "Debe incluir letras, números y no tener espacios",
                    },
                    validate: (value) =>
                      value.trim() !== "" ||
                      "No puede estar vacía o solo espacios",
                  })}
                  className="w-full px-4 py-2 pr-12 border rounded-md focus:ring-green-500 focus:border-green-500"
                  onInput={removeSpaces}
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

            {/* Confirmar Contraseña */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirmar Contraseña
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirme su contraseña"
                  {...register("confirmPassword", {
                    required: "Debe confirmar la contraseña",
                    validate: (value) => {
                      if (value.trim() === "") {
                        return "No puede estar vacía o solo espacios";
                      }
                      if (/\s/.test(value)) {
                        return "No se permiten espacios";
                      }
                      if (value !== watchPassword) {
                        return "Las contraseñas no coinciden";
                      }
                      return true;
                    },
                  })}
                  className="w-full px-4 py-2 pr-12 border rounded-md focus:ring-green-500 focus:border-green-500"
                  onInput={removeSpaces}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showConfirmPassword ? (
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
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
            >
              Registrarse
            </button>
          </form>

          <p className="text-xs text-gray-500 mt-4 text-center">
            Al registrarte, aceptas nuestros{" "}
            <a href="#" className="text-green-600">
              Términos y Condiciones
            </a>
          </p>

          <p className="text-xs text-gray-500 mt-4 text-center  hover:underline">
            ¿Ya tienes una cuenta?{" "}
            <Link to="/login" className="text-green-600">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

import React, { useEffect } from "react";
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

      // Alerta de éxito
      Swal.fire({
        icon: "success",
        title: "Inicio de sesión exitoso",
        text: "Has iniciado sesión correctamente",
        confirmButtonColor: "#22c55e", // Color verde
      }).then(() => {
         navigate("/dashboard");
      });
    } catch (error) {
      console.error("Error al iniciar sesión:", error.message);

      // Alerta de error
      Swal.fire({
        icon: "error",
        title: "Error al iniciar sesión",
        text: "La contraseña o el usuario son incorrectos",
        // text: `Error: ${error.message}`,
        confirmButtonColor: "#ef4444", // Color rojo
      }).then(() => {
        navigate("/login");   
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
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                placeholder="Ingrese su contraseña"
                {...register("password", {
                  required: "La contraseña es obligatoria",
                  minLength: {
                    value: 8,
                    message: "Debe tener al menos 8 caracteres",
                  },
                })}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
              />
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

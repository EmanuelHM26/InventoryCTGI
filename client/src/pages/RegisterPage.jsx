import { useForm } from "react-hook-form";
import { useAuth } from "../context/authContext";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
// import { useState } from "react";

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { signup } = useAuth();

  const onSubmit = async (data) => {
    try {
      console.log("Datos enviados al registro:", data);
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
        timer: 2000, // Duración de 5 segundos
        timerProgressBar: true, // Mostrar barra de progreso
      });
    } catch (error) {
      console.error("Error al registrar usuario:", error.message);

      Swal.fire({
        icon: "error",
        title: "Error en el registro",
        text: `Error al registrar usuario: ${error.message}`,
        confirmButtonColor: "#ef4444", // Color rojo
        timer: 2000, // Duración de 5 segundos
        timerProgressBar: true, // Mostrar barra de progreso
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="flex bg-white rounded-lg shadow-lg overflow-hidden w-4/5 max-w-4xl">
        {/* Sección Izquierda */}
        <div className="w-1/2 bg-green-600 p-10 flex flex-col justify-center text-white">
          <h2 className="text-2xl font-bold">Servicio Nacional de Aprendizaje</h2>
          <p className="mt-2 text-sm">
            Plataforma de formación para el trabajo. Accede a nuestro sistema para gestionar tus cursos y programas de formación.
          </p>
        </div>

        {/* Sección Derecha */}
        <div className="w-1/2 p-10">
          <div className="flex justify-center border-b pb-2 mb-6">
            <button className="text-green-600 text-lg font-semibold border-b-2 border-green-600">Registrarse</button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="usuario" className="block text-sm font-medium text-gray-700">Usuario</label>
              <input
                id="usuario"
                type="text"
                placeholder="Cree un nombre de usuario"
                {...register("usuario", { required: "El usuario es obligatorio" })}
                className="w-full px-4 py-2 border rounded-md focus:ring-green-500 focus:border-green-500"
              />
              {errors.usuario && <p className="text-red-500 text-xs mt-1">{errors.usuario.message}</p>}
            </div>
            <div>
              <label htmlFor="correo" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
              <input
                id="correo"
                type="email"
                placeholder="Ingrese su correo electrónico"
                {...register("correo", { 
                  required: "El correo es obligatorio", 
                  pattern: { value: /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/, message: "Correo inválido" } 
                })}
                className="w-full px-4 py-2 border rounded-md focus:ring-green-500 focus:border-green-500"
              />
              {errors.correo && <p className="text-red-500 text-xs mt-1">{errors.correo.message}</p>}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
              <input
                id="password"
                type="password"
                placeholder="Cree una contraseña"
                {...register("password", { 
                  required: "La contraseña es obligatoria", 
                  minLength: { value: 8, message: "Debe tener al menos 8 caracteres" },
                  pattern: { value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, message: "Debe incluir letras y números" }
                })}
                className="w-full px-4 py-2 border rounded-md focus:ring-green-500 focus:border-green-500"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition">
              Registrarse
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-4 text-center">
            Al registrarte, aceptas nuestros <a href="#" className="text-green-600">Términos y Condiciones</a>
          </p>

          <p className="text-xs text-gray-500 mt-4 text-center  hover:underline">
            ¿Ya tienes una cuenta? <Link to="/login" className="text-green-600">Inicia sesión aquí</Link>
          </p> 

        </div>
      </div>
    </div>
  );
};

export default Register;
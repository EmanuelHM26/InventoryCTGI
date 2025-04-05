import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";

const ForgotPasswordPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      await axios.post("http://localhost:3000/api/forgot-password", { Correo: data.correo });

      Swal.fire({
        icon: "success",
        title: "Correo enviado",
        text: "Revisa tu correo para restablecer tu contraseña.",
        confirmButtonColor: "#22c55e",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Error al solicitar el restablecimiento de contraseña.",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-green-600 mb-4">Olvidé mi contraseña</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="correo" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
            <input
              id="correo"
              type="email"
              placeholder="Ingrese su correo"
              {...register("correo", { required: "El correo es obligatorio" })}
              className="w-full px-4 py-2 border rounded-md focus:ring-green-500 focus:border-green-500"
            />
            {errors.correo && <p className="text-red-500 text-xs mt-1">{errors.correo.message}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
          >
            Enviar enlace
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
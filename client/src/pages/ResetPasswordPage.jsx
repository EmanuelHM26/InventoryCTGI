import React from "react";
import { useForm } from "react-hook-form";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const ResetPasswordPage = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const token = searchParams.get("token");
    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "El token no es válido o no fue proporcionado.",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    try {
      await axios.post("http://localhost:3000/api/reset-password", {
        token,
        nuevaPassword: data.password,
      });

      Swal.fire({
        icon: "success",
        title: "Contraseña actualizada",
        text: "Tu contraseña ha sido actualizada exitosamente.",
        confirmButtonColor: "#22c55e",
      }).then(() => {
        navigate("/login");
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Error al restablecer la contraseña.",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-green-600 mb-4">Restablecer contraseña</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Nueva Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="Ingrese su nueva contraseña"
              {...register("password", {
                required: "La contraseña es obligatoria",
                minLength: { value: 8, message: "Debe tener al menos 8 caracteres" },
              })}
              className="w-full px-4 py-2 border rounded-md focus:ring-green-500 focus:border-green-500"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirmar Contraseña</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirme su nueva contraseña"
              {...register("confirmPassword", {
                required: "Debe confirmar la contraseña",
                validate: (value) => value === watch("password") || "Las contraseñas no coinciden",
              })}
              className="w-full px-4 py-2 border rounded-md focus:ring-green-500 focus:border-green-500"
            />
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
          >
            Restablecer contraseña
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");
      if (!token) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "El token es inválido o no fue proporcionado.",
          confirmButtonColor: "#ef4444", // Color del botón
        });
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3000/api/verify-email?token=${token}`);
        Swal.fire({
          icon: "success",
          title: "¡Correo verificado!",
          text: response.data.message,
          confirmButtonColor: "#22c55e", // Color del botón
        }).then(() => {
          navigate("/login"); // Redirige al usuario a la página de inicio de sesión
        });
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Error al verificar",
          text: err.response?.data?.message || "Error al verificar el correo.",
          confirmButtonColor: "#ef4444", // Color del botón
        });
      }
    };

    verifyEmail();
  }, [searchParams]);

  return null; // No necesitamos renderizar nada porque usamos SweetAlert2
};

export default VerifyEmailPage;
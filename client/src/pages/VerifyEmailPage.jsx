import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import configAxios from "../api/configAxios"; 
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
          confirmButtonColor: "#ef4444",
        });
        return;
      }

      try {
        // Usar configAxios en lugar de axios
        const response = await configAxios.get(`/api/verify-email?token=${token}`);
        Swal.fire({
          icon: "success",
          title: "¡Correo verificado!",
          text: response.data.message,
          confirmButtonColor: "#22c55e",
        }).then(() => {
          navigate("/login");
        });
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Error al verificar",
          text: err.response?.data?.message || "Error al verificar el correo.",
          confirmButtonColor: "#ef4444",
        });
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return null;
};

export default VerifyEmailPage;
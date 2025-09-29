import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  registerUser,
  loginUser,
  logoutUser,
  getAuthenticatedUser,
} from "../api/authenticatedLogin";
import Swal from "sweetalert2";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Función para cargar los datos del usuario
  const loadUserData = async () => {
    try {
      const userData = await getAuthenticatedUser();
      console.log("Datos del usuario obtenidos:", userData);

      // Asegurar compatibilidad con diferentes estructuras de respuesta
      setUser({
        id: userData.id || userData.IdRegistroLogin,
        nombre: userData.nombre || userData.Usuario,
        rol: userData.rol || userData.Rol,
        email: userData.email || userData.Correo,
      });

      return true;
    } catch (error) {
      console.error("Error al cargar datos del usuario:", error);
      setUser(null);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Verificar autenticación al cargar la página
  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      try {
        await loadUserData();
      } catch (error) {
        console.error("Error al verificar autenticación:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Registro de usuario
  const signup = async (userData) => {
    try {
      const response = await registerUser(userData);
      navigate("/login");
      return response;
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      throw error;
    }
  };

  // Inicio de sesión - CORREGIDA
  const signin = async (credentials) => {
    try {
      const response = await loginUser(credentials);
      console.log("Respuesta de inicio de sesión:", response);

      // Guardar el usuario en el estado directamente desde la respuesta
      setUser({
        id: response.id || response.IdRegistroLogin,
        nombre: response.Usuario || response.nombre,
        rol: response.Rol || response.rol,
        email: response.Correo || response.email,
      });

      // Navegar al dashboard
      navigate("/dashboard");

      return response;
    } catch (error) {
      console.error("Error al iniciar sesión:", error);

      // Propagar el error con el mensaje original para que LoginPage lo maneje
      throw error;
    }
  };

  // Cierre de sesión
  const logout = async () => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Deseas cerrar sesión?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      await logoutUser();
      setUser(null);
      navigate("/login");
      Swal.fire(
        "Sesión cerrada",
        "Has cerrado sesión exitosamente.",
        "success"
      );
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      Swal.fire("Error", "Hubo un problema al cerrar sesión.", "error");
    }
  };

  // Proveer el contexto de autenticación a los componentes hijos
  return (
    <AuthContext.Provider value={{ user, loading, signup, signin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

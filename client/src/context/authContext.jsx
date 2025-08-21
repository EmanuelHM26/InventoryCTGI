import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, loginUser, logoutUser, getAuthenticatedUser } from "../api/authenticatedLogin";
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
      
      // Importante: Asegurarse de que los datos tienen la estructura correcta
      setUser({
        id: userData.id,
        nombre: userData.nombre,
        rol: userData.rol
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


  const getAuthenticatedUser = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/auth/me", {
        withCredentials: true, // Asegúrate de incluir las cookies
      });
      return response.data;
    } catch (error) {
      console.error("Error al obtener datos del usuario:", error);
      throw error;
    }
  };
  
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

  // Inicio de sesión
  const signin = async (credentials) => {
    try {
      const response = await loginUser(credentials);
      console.log("Respuesta de inicio de sesión:", response);
      
      // Después de iniciar sesión, obtener los datos del usuario
      const success = await loadUserData();
      
      if (success) {
        navigate("/dashboard");
      }
      
      return response;
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
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
      Swal.fire("Sesión cerrada", "Has cerrado sesión exitosamente.", "success");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      Swal.fire("Error", "Hubo un problema al cerrar sesión.", "error");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, signin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
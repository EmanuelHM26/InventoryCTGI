import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  registerUser,
  loginUser,
  logoutUser,
  getAuthenticatedUser,
  updatePassword,
  updateProfile,
} from "../api/authenticatedLogin";
import Swal from "sweetalert2";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Función para cargar los datos del usuario
  const loadUserData = async () => {
    try {
      const userData = await getAuthenticatedUser();
      console.log("✅ Datos del usuario obtenidos:", userData);

      // Asegurar compatibilidad con diferentes estructuras de respuesta
      setUser({
         id: userData.id,
        nombre: userData.nombre,
        correo: userData.correo, 
        rol: userData.rol,
        email: userData.correo, 
        Usuario: userData.nombre, 
        Correo: userData.correo, 
        Rol: userData.rol,
      });

      return true;
    } catch (error) {
      console.error("❌ Error al cargar datos del usuario:", error);

      // Si es error 403 o 401, limpiar el usuario
      if (error.response?.status === 403 || error.response?.status === 401) {
        console.log("🔒 No autenticado - limpiando sesión");
        setUser(null);
      }

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

      Swal.fire({
        icon: "success",
        title: "✅ Registro exitoso",
        text: "Revisa tu correo para verificar tu cuenta",
        confirmButtonColor: "#22c55e",
      });

      navigate("/login");
      return response;
    } catch (error) {
      console.error("❌ Error al registrar usuario:", error);
      throw error;
    }
  };

  // Inicio de sesión
  const signin = async (credentials) => {
    try {
      const response = await loginUser(credentials);
      console.log("✅ Respuesta de inicio de sesión:", response);

      await loadUserData();
      
      // Guardar el usuario en el estado
      const userData = {
        id: response.id || response.IdRegistroLogin,
        nombre: response.Usuario || response.nombre,
        rol: response.Rol || response.rol,
        email: response.Correo || response.email,
      };
      
      setUser(userData);
      console.log("👤 Usuario establecido:", userData);
      
      // Navegar al dashboard
      navigate("/dashboard");
      
      return response;
    } catch (error) {
      console.error("❌ Error al iniciar sesión:", error);
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
      console.error("❌ Error al cerrar sesión:", error);

      // Aunque falle el logout en el servidor, limpiar estado local
      setUser(null);
      navigate("/login");

      Swal.fire("Sesión cerrada", "Se cerró la sesión localmente", "info");
    }
  };

  // Actualizar contraseña
  const handleUpdatePassword = async (currentPassword, newPassword) => {
    try {
      const response = await updatePassword(currentPassword, newPassword);
      return response;
    } catch (error) {
      console.error("❌ Error al actualizar contraseña:", error);
      throw error;
    }
  };

  // Actualizar perfil
  const handleUpdateProfile = async (profileData) => {
    try {
      const response = await updateProfile(profileData);

      // Actualizar el usuario en el estado
      setUser({
        ...user,
        nombre: profileData.nombre || user.nombre,
        email: profileData.email || user.email,
      });

      return response;
    } catch (error) {
      console.error("❌ Error al actualizar perfil:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        signup, 
        signin, 
        logout, 
        updatePassword: handleUpdatePassword, 
        updateProfile: handleUpdateProfile 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, loginUser, logoutUser, validateToken } from "../api/authenticatedLogin";
import Swal from "sweetalert2";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = async () => {
      try {
        const response = await validateToken();
        console.log("Token válido, usuario:", response);
        setUser(response); // Establece el usuario si el token es válido
      } catch (error) {
        console.error("Token inválido o no proporcionado:", error.message);
        setUser(null);
      } finally {
        setLoading(false); // Finaliza la carga inicial
      }
    };

    checkToken();
  }, []);

  if (loading) {
    return <div>Cargando...</div>; // Muestra un indicador de carga mientras se valida el token
  }

  // Registro de usuario
  const signup = async (userData) => {
    try {
      const response = await registerUser(userData);
      setUser(response.user); // Ajusta según la respuesta del backend
      navigate("/login");
    } catch (error) {
      console.error("Error al registrar usuario:", error.message);
      throw error;
    }
  };

  // Inicio de sesión
  const signin = async (credentials) => {
    try {
      const response = await loginUser(credentials);
      console.log("Respuesta del backend:", response);
      setUser({
        Usuario: response.Usuario,
        Rol: response.Rol,
        Correo:  response.Correo
      }); // Ajusta según la respuesta del backend
      navigate("/dashboard");
    } catch (error) {
      console.error("Error al iniciar sesión:", error.message);
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
      await logoutUser(); // Llama a la API para eliminar el token
      setUser(null); // Limpia el estado del usuario
      navigate("/login"); // Redirige al login
      Swal.fire("Sesión cerrada", "Has cerrado sesión exitosamente.", "success");
    } catch (error) {
      console.error("Error al cerrar sesión:", error.message);
      Swal.fire("Error", "Hubo un problema al cerrar sesión.", "error");
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, signup, signin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);


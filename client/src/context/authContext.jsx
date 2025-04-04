import { createContext, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, loginUser, logoutUser } from "../api/authenticatedLogin";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Registro de usuario
  const signup = async (userData) => {
    try {
      const response = await registerUser(userData);
      setUser(response.user); // Ajusta según la respuesta del backend
      navigate("/");
    } catch (error) {
      console.error("Error al registrar usuario:", error.message);
      throw error;
    }
  };

  // Inicio de sesión
  const signin = async (credentials) => {
    try {
      const response = await loginUser(credentials);
      setUser(response.user); // Ajusta según la respuesta del backend
      navigate("/");
    } catch (error) {
      console.error("Error al iniciar sesión:", error.message);
      throw error;
    }
  };

  // Cierre de sesión
  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error.message);
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
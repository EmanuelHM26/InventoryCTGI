import configAxios from "./configAxios";

// Registro de usuario
export const registerUser = async (userData) => {
  try {
    const response = await configAxios.post("/register", userData);
    return response.data;
  } catch (error) {
    console.error("Error al registrar usuario:", error.response?.data || error.message);
    throw error;
  }
};

// Inicio de sesión
export const loginUser = async (credentials) => {
  try {
    const response = await configAxios.post("/login", credentials);
    return response.data; // El token se guarda automáticamente en la cookie
  } catch (error) {
    console.error("Error al iniciar sesión:", error.response?.data || error.message);
    throw error;
  }
};

// Cerrar sesión
export const logoutUser = async () => {
  try {
    const response = await configAxios.post("/logout"); // Asegúrate de tener esta ruta en el backend
    return response.data;
  } catch (error) {
    console.error("Error al cerrar sesión:", error.response?.data || error.message);
    throw error;
  }
};
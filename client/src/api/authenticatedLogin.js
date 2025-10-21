import configAxios from "./configAxios";

// Registro de usuario
export const registerUser = async (userData) => {
  try {
    const response = await configAxios.post("/api/register", userData);
    return response.data;
  } catch (error) {
    console.error(
      "Error al registrar usuario:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Inicio de sesión
export const loginUser = async (credentials) => {
  try {
    const response = await configAxios.post("/api/login", credentials);
    return response.data;
  } catch (error) {
    console.error(
      "Error al iniciar sesión:",
      error.response?.data || error.message
    );

    // Propagamos el mensaje específico del backend
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Error al iniciar sesión");
    }
  }
};

// Cerrar sesión
export const logoutUser = async () => {
  try {
    const response = await configAxios.post("/api/logout", {});
    return response.data;
  } catch (error) {
    console.error(
      "Error al cerrar sesión:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Verificar token al refrescar página
export const validateToken = async () => {
  try {
    const response = await configAxios.get("/api/verify-token");
    return response.data;
  } catch (error) {
    console.error(
      "Error al validar el token:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Obtener usuario autenticado
export const getAuthenticatedUser = async () => {
  try {
    const response = await configAxios.get("/api/auth/me");
    return response.data;
  } catch (error) {
    console.error(
      "Error al obtener datos del usuario:",
      error.response?.data || error.message
    );
    throw error;
  }
};
import configAxios from "./configAxios";

// Registro de usuario
export const registerUser = async (userData) => {
  try {
    const response = await configAxios.post("/api/register", userData);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error al registrar usuario:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Inicio de sesión
export const loginUser = async (credentials) => {
  try {
    console.log("🔐 Intentando iniciar sesión con:", { 
      correo: credentials.Correo 
    });
    
    const response = await configAxios.post("/api/login", credentials);
    
    console.log("✅ Login exitoso:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error al iniciar sesión:",
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
      "❌ Error al cerrar sesión:",
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
      "❌ Error al validar el token:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Obtener usuario autenticado
export const getAuthenticatedUser = async () => {
  try {
    console.log("🔍 Obteniendo datos del usuario autenticado...");
    
    const response = await configAxios.get("/api/auth/me");
    
    console.log("✅ Usuario obtenido:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error al obtener datos del usuario:",
      {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      }
    );
    
    // Si es 403 o 401, no hay sesión válida
    if (error.response?.status === 403 || error.response?.status === 401) {
      console.log("🔒 Usuario no autenticado");
    }
    
    throw error;
  }
};

export const updatePassword = async (currentPassword, newPassword) => {
  try {
    const response = await configAxios.put('/api/users/password', {
      currentPassword,
      newPassword
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateProfile = async (profileData) => {
  try {
    const response = await configAxios.put('/api/users/profile', profileData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
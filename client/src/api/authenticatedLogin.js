import configAxios from "./configAxios";

// Registro de usuario
export const registerUser = async (userData) => {
  try {
    const response = await configAxios.post("/register", userData);
    return response.data;
  } catch (error) {
    // console.error("Error al registrar usuario:", error.response?.data || error.message);
    console.error(
      "Error al registrar usuario:",
      error.response?.data || error.message
    );
    res.status(500).json({ message: "Error al registrar usuario", error });
  }
};


// Inicio de sesión
export const loginUser = async (credentials) => {
  try {
    const response = await configAxios.post("/login", credentials);
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
    const response = await configAxios.post(
      "/logout",
      {},
      {
        withCredentials: true, // Asegúrate de incluir las cookies
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error al cerrar sesión:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Verificar token refrescar pagina

export const validateToken = async () => {
  try {
    const response = await configAxios.get("/verify-token", {
      withCredentials: true, // Asegúrate de incluir las cookies
    });
    return response.data; // Devuelve los datos del usuario si el token es válido
  } catch (error) {
    console.error(
      "Error al validar el token:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getAuthenticatedUser = async () => {
  try {
    const response = await configAxios.get("/auth/me", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error al obtener datos del usuario:",
      error.response?.data || error.message
    );
    throw error;
  }
};

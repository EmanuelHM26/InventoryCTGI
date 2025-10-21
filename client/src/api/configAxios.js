import axios from "axios";

// Configuración inteligente para todos los entornos
const getApiConfig = () => {
  const isDocker = import.meta.env.VITE_IS_DOCKER === 'true';
  const apiUrl = import.meta.env.VITE_API_URL;

  console.log("🔧 Configuración de entorno:");
  console.log("   - VITE_API_URL:", apiUrl);
  console.log("   - VITE_IS_DOCKER:", isDocker);
  console.log("   - Modo:", import.meta.env.MODE);

  // En Docker producción (rutas relativas)
  if (isDocker && apiUrl === '/api') {
    return {
      baseURL: '', // Nginx manejará el proxy a /api
      withCredentials: true
    };
  }

  // Desarrollo (Docker y local)
  return {
    baseURL: apiUrl || "http://localhost:3000",
    withCredentials: true
  };
};

const { baseURL, withCredentials } = getApiConfig();

console.log("🚀 Configuración final de API:");
console.log("   - BaseURL:", baseURL || '(rutas relativas)');

const configAxios = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials,
  timeout: 30000, // Aumentado para producción
});

// Interceptor para debug
configAxios.interceptors.request.use(
  (config) => {
    const fullUrl = `${config.baseURL || ''}${config.url}`;
    console.log(`🌐 ${config.method?.toUpperCase()} ${fullUrl}`);
    return config;
  },
  (error) => {
    console.error("🔴 Error en request:", error);
    return Promise.reject(error);
  }
);

// Interceptor de respuesta
configAxios.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error(`❌ ${error.response?.status || 'No response'} ${error.config?.method?.toUpperCase()} ${error.config?.url}`);
    return Promise.reject(error);
  }
);

export default configAxios;
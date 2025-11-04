import axios from "axios";

// Configuración inteligente para todos los entornos
const getApiConfig = () => {
  const isDocker = import.meta.env.VITE_IS_DOCKER === 'true';
  const apiUrl = import.meta.env.VITE_API_URL;
  const mode = import.meta.env.MODE;

  console.log("🔧 Configuración de entorno:");
  console.log("   - VITE_API_URL:", apiUrl);
  console.log("   - VITE_IS_DOCKER:", isDocker);
  console.log("   - MODE:", mode);

  // ⚠️ IMPORTANTE: El navegador NUNCA puede resolver "http://backend:3000"
  // Solo funciona dentro de la red Docker entre contenedores

  // Producción con Nginx (rutas relativas con proxy)
  if (mode === 'production' && apiUrl === '/api') {
    return {
      baseURL: '', // Nginx proxy: /api -> backend:3000
      withCredentials: true
    };
  }

  // Desarrollo (local o Docker)
  // En Docker, el backend DEBE exponerse en localhost:3000
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
  timeout: 30000,
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
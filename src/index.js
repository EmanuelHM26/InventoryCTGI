import app from './app.js'
import sequelize, { verificarSincronizacion } from "./config/database.js";
import models from './models/index.js';

const PORT = process.env.PORT || 3000;
const HOST = process.env.NODE_ENV === 'development' ? '0.0.0.0' : 'localhost';

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión a la base de datos establecida correctamente.");

    // ✅ Verificar sincronización de modelos
    await verificarSincronizacion();

    // NO sincronizar - las tablas ya existen
    console.log("✅ Usando tablas existentes de la base de datos");

    app.listen(PORT, HOST, () => {
      console.log(`🚀 Servidor corriendo en http://${HOST}:${PORT}`);
    });
  } catch (error) {
    console.error("❌ No se pudo conectar a la base de datos:", error);
    process.exit(1);
  }
})();
import app from './app.js'
import sequelize from "./config/database.js"; // Importar la conexión a la base de datos

const PORT = process.env.PORT || 3000;


// Verificar conexión a la base de datos y luego iniciar el servidor
(async () => {
  try {
    await sequelize.authenticate(); // Verificar conexión
    console.log("✅ Conexión a la base de datos establecida correctamente.");

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ No se pudo conectar a la base de datos:", error);
    process.exit(1); // Salir del proceso si no hay conexión
  }
})();
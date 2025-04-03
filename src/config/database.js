import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config(); // Cargar variables de entorno

// Configuración de Sequelize
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: "mysql",
  logging: false, // Desactivar logs en consola
});

// Verificación de conexión
try {
  await sequelize.authenticate();
  console.log("✅ Conexión a la base de datos establecida correctamente.");
} catch (error) {
  console.error("❌ Error al conectar con la base de datos:", error);
}

export default sequelize;

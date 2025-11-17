import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: "mysql",
  logging: false,
  // ✅ Opciones de reintento
  pool: {
    max: 5,
    min: 0,
    acquire: 60000, // 60 segundos
    idle: 10000
  },
  retry: {
    max: 10 // Reintentar hasta 10 veces
  }
});

// ✅ Función para conectar con reintentos
const conectarConReintentos = async (intentos = 10, delay = 3000) => {
  for (let i = 1; i <= intentos; i++) {
    try {
      await sequelize.authenticate();
      console.log("✅ Conexión a la base de datos establecida correctamente.");
      console.log(`📊 Base de datos: ${process.env.DB_NAME}`);
      console.log(`🏠 Host: ${process.env.DB_HOST}`);
      
      // Verificar tablas existentes
      const [tables] = await sequelize.query("SHOW TABLES");
      console.log("📋 Tablas en la base de datos:");
      tables.forEach(table => {
        const tableName = Object.values(table)[0];
        console.log(`   - ${tableName}`);
      });

      // Verificar si hay datos
      console.log("\n📊 Verificando datos en tablas clave:");
      try {
        const [usuarios] = await sequelize.query("SELECT COUNT(*) as count FROM usuarios");
        const [registros] = await sequelize.query("SELECT COUNT(*) as count FROM registrologin");
        const [asignaciones] = await sequelize.query("SELECT COUNT(*) as count FROM asignaciones");
        
        console.log(`   - Usuarios: ${usuarios[0].count} registros`);
        console.log(`   - RegistroLogin: ${registros[0].count} registros`);
        console.log(`   - Asignaciones: ${asignaciones[0].count} registros`);

        if (usuarios[0].count === 0 && registros[0].count === 0) {
          console.log("\n⚠️  ADVERTENCIA: Las tablas existen pero están VACÍAS");
        }
      } catch (err) {
        console.log("   ⚠️ Error al contar registros:", err.message);
      }
      
      return true; // Conexión exitosa
      
    } catch (error) {
      console.log(`⚠️  Intento ${i}/${intentos} fallido - ${error.message}`);
      
      if (i === intentos) {
        console.error("❌ No se pudo conectar a la base de datos después de múltiples intentos");
        throw error;
      }
      
      console.log(`⏳ Reintentando en ${delay/1000} segundos...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

// Ejecutar conexión con reintentos
try {
  await conectarConReintentos();
} catch (error) {
  console.error("❌ Error fatal al conectar con la base de datos:", error);
}

// ✅ Función para verificar sincronización de modelos
export const verificarSincronizacion = async () => {
  console.log("\n🔍 Validando sincronización de modelos...\n");
  
  const models = sequelize.models;
  const modelCount = Object.keys(models).length;
  
  console.log(`📦 Modelos registrados en Sequelize: ${modelCount}`);
  
  if (modelCount === 0) {
    console.log("⚠️  No hay modelos registrados aún");
    console.log("   Asegúrate de importar './models/index.js' ANTES de llamar esta función\n");
    return;
  }

  Object.keys(models).forEach(modelName => {
    console.log(`   - ${modelName}`);
  });

  // Comparar columnas de cada modelo con la BD
  console.log("\n📊 Comparando estructura de modelos con BD:\n");
  
  let modelosSinTabla = [];
  let modelosOK = 0;
  
  for (const modelName in models) {
    const model = models[modelName];
    const tableName = model.tableName || modelName.toLowerCase();
    
    try {
      const [columns] = await sequelize.query(
        `SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE, COLUMN_KEY 
         FROM INFORMATION_SCHEMA.COLUMNS 
         WHERE TABLE_NAME = '${tableName}' 
         AND TABLE_SCHEMA = '${process.env.DB_NAME}'
         ORDER BY ORDINAL_POSITION`
      );
      
      if (columns.length === 0) {
        console.log(`   ❌ ${modelName} (${tableName}): TABLA NO EXISTE EN LA BD`);
        modelosSinTabla.push(modelName);
      } else {
        console.log(`   ✅ ${modelName} (${tableName}): ${columns.length} columnas`);
        modelosOK++;
      }
    } catch (err) {
      console.log(`   ❌ ${modelName}: Error al verificar - ${err.message}`);
    }
  }

  // Resumen
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`✅ Modelos sincronizados correctamente: ${modelosOK}/${modelCount}`);
  if (modelosSinTabla.length > 0) {
    console.log(`❌ Modelos sin tabla en BD: ${modelosSinTabla.join(', ')}`);
  }
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
};

export default sequelize;
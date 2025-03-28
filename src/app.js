import express from 'express';
import dotenv from 'dotenv';
import loginRoutes from './routes/login.routes.js'; // Importa las rutas de login


dotenv.config();

const app = express();

// Middlewares
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.send("🚀 Servidor con ES Modules corriendo correctamente");
});

app.use('/api/logins', loginRoutes);


export default app;

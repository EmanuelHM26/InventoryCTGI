import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/database.js'; // Importa la conexión a la base de datos


dotenv.config(); // Cargar variables de entorno

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Ruta de prueba para verificar la conexión a la base de datos
app.get('/test-db', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT 1 + 1 AS result');
        res.json({ message: 'Conexión exitosa', result: rows[0].result });
    } catch (error) {
        console.error('Error conectando a la BD:', error);
        res.status(500).json({ message: 'Error en la conexión a la base de datos' });
    }
});



// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

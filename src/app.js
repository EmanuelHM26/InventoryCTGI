import express from "express";
import cors from "cors";
import loginRoutes from "./routes/login.routes.js"
import dashboardRoutes from "./routes/dashboard.routes.js";
import rolRoutes from "./routes/rol.routes.js";
import usuarioRoutes from "./routes/usuarios.routes.js"
import asignacionesRoutes from "./routes/asignaciones.routes.js";
import authRoutes from "./routes/authMe.routes.js";
import busquedaRoutes from "./routes/busqueda.routes.js";

import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// Aquí puedes agregar las rutas reales de tu proyecto
// import userRoutes from "./routes/user.routes.js";
//Ruta de autenticación
app.use("/api/auth", authRoutes); // Registrar las rutas de autenticación

// Ruta de login y dashboard
app.use("/api", loginRoutes);
app.use("/api/dashboard", dashboardRoutes); // Registrar las rutas del dashboard

app.use("/api", rolRoutes); // Registrar las rutas de roles
app.use("/api", usuarioRoutes)

app.use("/api", asignacionesRoutes)

app.use("/api", busquedaRoutes)

export default app;


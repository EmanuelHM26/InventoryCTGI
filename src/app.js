import express from "express";
import cors from "cors";
import loginRoutes from "./routes/login.routes.js"
import dashboardRoutes from "./routes/dashboard.routes.js";
import rolRoutes from "./routes/rol.routes.js";

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
app.use("/api", loginRoutes);
app.use("/api/dashboard", dashboardRoutes); // Registrar las rutas del dashboard

app.use("/api", rolRoutes); // Registrar las rutas de roles

export default app;


import express from "express";
import cors from "cors";
import loginRoutes from "./routes/login.routes.js"

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Aquí puedes agregar las rutas reales de tu proyecto
// import userRoutes from "./routes/user.routes.js";
app.use("/api", loginRoutes);

export default app;

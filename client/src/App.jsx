import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/authContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/DashboardLayout";
import Roles from "./components/Roles";
import UsuariosSoftware from "./components/UsuariosSoftware";
import Usuarios from "./components/Usuarios";
import Inicio from "./components/Inicio";
import Asignaciones from "./components/Asignaciones";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Navigate to="/register" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Rutas protegidas */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            {/* Ruta para /dashboard/inicio */}
            <Route index element={<Navigate to="inicio" />} />
            <Route path="inicio" element={<Inicio />} />
            <Route path="roles" element={<Roles />} />
            <Route path="usuarios-software" element={<UsuariosSoftware />} />
            <Route path="usuarios" element={<Usuarios />} />
            <Route path="asignaciones" element={<Asignaciones />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
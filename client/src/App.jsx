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
import Roles from "./components/Roles";
import UsuariosSoftware from "./components/UsuariosSoftware";
import Navbar from "./components/Navbar";
import Main from "./components/Main";



const App = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="flex">
          {/* Navbar siempre visible */}
          <Navbar />
          {/* Contenido dinámico al lado derecho */}
          <div className="flex-1 p-4">
            <Routes>
              <Route path="/" element={<Navigate to={"/register"} />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/verify-email" element={<VerifyEmailPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              {/* <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              /> */}
              <Route
                path="/dashboard/roles"
                element={
                  <ProtectedRoute>
                    <Roles />
                  </ProtectedRoute>
                }
              />

              <Route path="/dashboard" element={<Navigate to="/dashboard/usuarios-software" />} />
              <Route path="/dashboard/usuarios-software" element={<UsuariosSoftware />} />
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;

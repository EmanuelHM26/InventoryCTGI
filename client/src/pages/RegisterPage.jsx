import { useState } from "react";
import { useAuth } from "../context/authContext";

const Register = () => {
  const [usuario, setUsuario] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const { signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup({ Usuario: usuario, Correo: correo, PasswordTexto: password });
      console.log("Usuario registrado exitosamente");
    } catch (error) {
      console.error("Error al registrar usuario:", error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="flex bg-white rounded-lg shadow-lg overflow-hidden w-4/5 max-w-4xl">
        {/* Sección Izquierda */}
        <div className="w-1/2 bg-green-600 p-10 flex flex-col justify-center text-white">
          <h2 className="text-2xl font-bold">Servicio Nacional de Aprendizaje</h2>
          <p className="mt-2 text-sm">
            Plataforma de formación para el trabajo. Accede a nuestro sistema para gestionar tus cursos y programas de formación.
          </p>
        </div>

        {/* Sección Derecha */}
        <div className="w-1/2 p-10">
          <div className="flex justify-center border-b pb-2 mb-6">
            <button className="text-green-600 text-lg font-semibold border-b-2 border-green-600">Registrarse</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" >
            <div>
              <label htmlFor="usuario" className="block text-sm font-medium text-gray-700">Usuario</label>
              <input
                id="usuario" 
                type="text" 
                placeholder="Cree un nombre de usuario"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)} 
                className="w-full px-4 py-2 border rounded-md focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label htmlFor="correo" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
              <input
                id="correo"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)} 
                type="email" 
                placeholder="Ingrese su correo electrónico" 
                className="w-full px-4 py-2 border rounded-md focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
              <input 
                id="password"
                type="password" 
                placeholder="Cree una contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full px-4 py-2 border rounded-md focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition">
              Registrarse
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-4 text-center">
            Al registrarte, aceptas nuestros <a href="#" className="text-green-600">Términos y Condiciones</a>
          </p>
        </div>
      </div>
    </div>
  );
};


export default Register;
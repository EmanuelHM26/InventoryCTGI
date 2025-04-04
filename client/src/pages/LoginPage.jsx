import { useState } from "react";
import { useAuth } from "../context/authContext";

const Login = () => {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const { signin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signin({ Usuario: usuario, PasswordTexto: password });
      console.log("Inicio de sesión exitoso");
    } catch (error) {
      console.error("Error al iniciar sesión:", error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="flex bg-white rounded-lg shadow-lg overflow-hidden w-4/5 max-w-4xl">
        {/* Sección Izquierda */}
        <div className="w-1/2 bg-green-600 text-white p-8 flex flex-col justify-center rounded-l-lg">
          <h2 className="text-2xl font-bold">Servicio Nacional de Aprendizaje</h2>
          <p className="mt-2">
            Plataforma de formación para el trabajo. Accede a nuestro sistema para gestionar tus cursos y programas de formación.
          </p>
        </div>
        {/* Sección Derecha */}
        <div className="w-1/2 p-12"> {/* Aumentamos el padding para hacer el formulario más alto */}
          <h2 className="text-2xl font-bold text-center text-green-600 mb-4">Iniciar Sesión</h2>
          <form onSubmit={handleSubmit} className="space-y-6"> {/* Aumentamos el espacio entre los elementos */}
            <div>
              <label htmlFor="usuario" className="block text-sm font-medium text-gray-700">
                Usuario
              </label>
              <input
                id="usuario"
                type="text"
                placeholder="Ingrese su usuario"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                placeholder="Ingrese su contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition duration-300" 
            >
              Iniciar Sesión
            </button>
            <p className="text-sm text-center text-green-600 mt-4 cursor-pointer hover:underline"> 
              ¿Olvidaste tu contraseña?
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
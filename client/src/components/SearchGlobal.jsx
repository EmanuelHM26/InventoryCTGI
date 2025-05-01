import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SearchGlobal = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState({ usuarios: [], asignaciones: [] });
  const [error, setError] = useState(null);
  const searchRef = useRef(null);

  // Manejar clics fuera del componente de búsqueda
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setError(null); // Reiniciar el error al cambiar la búsqueda

    if (!term.trim()) {
      setResults({ usuarios: [], asignaciones: [] });
      onSearch({ usuarios: [], asignaciones: [] }, false); // Indicar que no se muestren resultados en la página
      setShowResults(false);
      return;
    }

    setIsLoading(true);
    try {
      // Realizar petición a la API con manejo de errores mejorado
      const response = await axios.get(`http://localhost:3000/api/search?term=${encodeURIComponent(term)}`);
      
      // Verificar la respuesta
      if (response && response.data) {
        if (response.data.success) {
          // Asegurarse de que data existe y tiene la estructura esperada
          const searchResults = response.data.data || { usuarios: [], asignaciones: [] };
          
          // Actualizar estados con los resultados
          setResults(searchResults);
          onSearch(searchResults, false); // Solo pasar resultados, pero no mostrarlos en página principal
          
          // Mostrar resultados solo si hay algo que mostrar
          const hasResults = 
            (searchResults.usuarios && searchResults.usuarios.length > 0) || 
            (searchResults.asignaciones && searchResults.asignaciones.length > 0);
          
          setShowResults(hasResults);
        } else {
          // Manejar respuesta no exitosa
          const errorMsg = response.data.message || response.data.error || 'Error desconocido en la búsqueda';
          setError(errorMsg);
          console.error('Error en la búsqueda:', errorMsg);
          setShowResults(false);
        }
      } else {
        throw new Error('Respuesta de API inválida');
      }
    } catch (error) {
      // Manejar errores de red o del servidor
      const errorMsg = error.response?.data?.message || 
                       error.response?.data?.error || 
                       error.message || 
                       'Error desconocido en la búsqueda';
      
      setError(errorMsg);
      console.error('Error al realizar la búsqueda:', errorMsg);
      setShowResults(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Navegar a la página de usuario
  const navigate = useNavigate();

  const navigateToUser = () => {
    // Navegación corregida para usar la ruta completa
    navigate(`/dashboard/usuarios`);
    setShowResults(false);
  };

  const navigateToAssignment = () => {
    // Navegación corregida para usar la ruta completa
    navigate(`/dashboard/asignaciones`);
    setShowResults(false);
  };

  return (
    <div className="relative" ref={searchRef}>
      <input
        type="text"
        placeholder="Buscar usuarios o asignaciones..."
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={() => {
          if (searchTerm.trim() && (results.usuarios.length > 0 || results.asignaciones.length > 0)) {
            setShowResults(true);
          }
        }}
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        aria-label="Campo de búsqueda"
      />
      
      {isLoading && (
        <div className="absolute right-3 top-3">
          <svg className="animate-spin h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}

      {/* Mostrar mensaje de error si existe */}
      {error && (
        <div className="mt-1 text-sm text-red-600 bg-red-50 p-2 rounded-md border border-red-200">
          {error}
        </div>
      )}

      {/* Dropdown de resultados */}
      {showResults && searchTerm.trim() && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {/* Resultados de usuarios */}
          {results.usuarios && results.usuarios.length > 0 && (
            <div className="p-2 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-600 mb-2">Usuarios</h3>
              <ul>
                {results.usuarios.map((usuario) => (
                  <li 
                    key={usuario.IdUsuario} 
                    className="p-2 hover:bg-gray-100 rounded-md cursor-pointer flex items-center"
                    onClick={() => navigateToUser(usuario.IdUsuario)}
                  >
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                      {usuario.Nombre ? usuario.Nombre.charAt(0) : 'U'}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{usuario.Nombre} {usuario.Apellido}</p>
                      <p className="text-xs text-gray-500">{usuario.Correo || 'Sin correo'}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Resultados de asignaciones */}
          {results.asignaciones && results.asignaciones.length > 0 && (
            <div className="p-2">
              <h3 className="text-sm font-semibold text-gray-600 mb-2">Asignaciones</h3>
              <ul>
                {results.asignaciones.map((asignacion) => (
                  <li 
                    key={asignacion.IdAsignaciones} 
                    className="p-2 hover:bg-gray-100 rounded-md cursor-pointer"
                    onClick={() => navigateToAssignment(asignacion.IdAsignaciones)}
                  >
                    <div className="flex justify-between mb-1">
                      <p className="text-sm font-medium text-gray-800">
                        {asignacion.Usuario ? `${asignacion.Usuario.Nombre} ${asignacion.Usuario.Apellido}` : 'Usuario desconocido'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(asignacion.FechaAsignacion).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-xs text-gray-600 truncate">{asignacion.Observacion || 'Sin observaciones'}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Mensaje si no hay resultados */}
          {(!results.usuarios || results.usuarios.length === 0) && 
           (!results.asignaciones || results.asignaciones.length === 0) && (
            <div className="p-4 text-center text-gray-500">
              No se encontraron resultados para "{searchTerm}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchGlobal;
import React, { useState, useEffect } from "react";
import axios from "axios";
import DashboardLayout from "../components/DashboardLayout";
import AsignacionesRecent from "../components/AsignacionesRecent";
import Card from "../components/Card";
import { BarChartOnValueChangeExample } from "../components/BarChart";
import { FaUsers, FaFileInvoice, FaUserFriends, FaTruck } from "react-icons/fa";
import SearchGlobal from "../components/SearchGlobal";

const Inicio = () => {
  const [cardData, setCardData] = useState([
    {
      iconClass: <FaUsers className="mr-1" />,
      title: "Total Usuarios",
      value: "0",
    },
    {
      iconClass: <FaFileInvoice className="mr-1" />,
      title: "Categorias",
      value: "0",
    },
    {
      iconClass: <FaUserFriends className="mr-1" />,
      title: "Total de Asignaciones",
      value: "0",
    },
    {
      iconClass: <FaTruck className="mr-1" />,
      title: "Equipos en Inventario",
      value: "0",
    },
  ]);

  const [asignacionesRecientes, setAsignacionesRecientes] = useState([]);
  const [searchResults, setSearchResults] = useState({
    usuarios: [],
    asignaciones: []
  });
  const [loading, setLoading] = useState(true);

  // Cargar datos del dashboard al iniciar el componente
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Obtener estadísticas para las tarjetas
        const [usuariosRes, asignacionesRes, categoriasRes, equiposRes] = await Promise.all([
          axios.get('/api/usuarios'),
          axios.get('/api/asignaciones'),
          axios.get('/api/categorias'),
          axios.get('/api/inventario')
        ]);

        // Actualizar las tarjetas con datos reales
        setCardData([
          {
            iconClass: <FaUsers className="mr-1" />,
            title: "Total Usuarios",
            value: usuariosRes.data.length.toString(),
          },
          {
            iconClass: <FaFileInvoice className="mr-1" />,
            title: "Categorias",
            value: categoriasRes.data.length.toString(),
          },
          {
            iconClass: <FaUserFriends className="mr-1" />,
            title: "Total de Asignaciones",
            value: asignacionesRes.data.length.toString(),
          },
          {
            iconClass: <FaTruck className="mr-1" />,
            title: "Equipos en Inventario",
            value: equiposRes.data.length.toString(),
          },
        ]);

        // Obtener asignaciones recientes
        const asignacionesRecientes = await axios.get('/api/asignaciones/recientes');
        setAsignacionesRecientes(asignacionesRecientes.data);
      } catch (error) {
        console.error("Error al cargar datos del dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Manejar resultados de búsqueda
  const handleSearch = (results) => {
    setSearchResults(results);
  };

  // Renderizar los resultados de búsqueda
  const renderSearchResults = () => {
    const hasUsuarios = searchResults.usuarios && searchResults.usuarios.length > 0;
    const hasAsignaciones = searchResults.asignaciones && searchResults.asignaciones.length > 0;
    
    if (!hasUsuarios && !hasAsignaciones) {
      return <p className="text-gray-500">No se encontraron resultados.</p>;
    }

    return (
      <div className="space-y-4">
        {hasUsuarios && (
          <div>
            <h4 className="text-md font-semibold text-gray-700 mb-2">Usuarios</h4>
            <ul className="border rounded-lg overflow-hidden divide-y divide-gray-200">
              {searchResults.usuarios.map((usuario) => (
                <li 
                  key={usuario.IdUsuario} 
                  className="p-3 hover:bg-gray-50 cursor-pointer flex items-center"
                  onClick={() => window.location.href = `/usuarios/${usuario.IdUsuario}`}
                >
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                    {usuario.Nombre.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{usuario.Nombre} {usuario.Apellido}</p>
                    <p className="text-xs text-gray-500">{usuario.Email || 'Sin correo'}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {hasAsignaciones && (
          <div>
            <h4 className="text-md font-semibold text-gray-700 mb-2">Asignaciones</h4>
            <ul className="border rounded-lg overflow-hidden divide-y divide-gray-200">
              {searchResults.asignaciones.map((asignacion) => (
                <li 
                  key={`${asignacion.IdAsignaciones}-${asignacion.FechaAsignacion}`} 
                  className="p-3 hover:bg-gray-50 cursor-pointer"
                  onClick={() => window.location.href = `/asignaciones/${asignacion.IdAsignaciones}/${asignacion.FechaAsignacion}`}
                >
                  <div className="flex justify-between mb-1">
                    <p className="text-sm font-medium text-gray-800">
                      {asignacion.Usuario ? `${asignacion.Usuario.Nombre} ${asignacion.Usuario.Apellido}` : 'Usuario desconocido'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(asignacion.FechaAsignacion).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-xs text-gray-600 truncate">{asignacion.Observacion}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      
      {/* Buscador global */}
      <div className="lg:col-span-4 bg-white p-6 mt-20 rounded-lg shadow-md">
        <SearchGlobal onSearch={handleSearch} />
        {/* Resultados de búsqueda */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-gray-700">Resultados de la búsqueda</h3>
          {renderSearchResults()}
        </div>
      </div>


      {/* Renderizar las tarjetas */}
      {cardData.map((card, index) => (
        <Card
          key={index}
          iconClass={card.iconClass}
          title={card.title}
          value={card.value}
          subtitle={card.subtitle}
        />
      ))}

      

      {/* Diagrama de barras */}
      <div className="lg:col-span-2">
        <BarChartOnValueChangeExample />
      </div>

      {/* Tabla de asignaciones recientes */}
      <div className="lg:col-span-2">
        <AsignacionesRecent asignaciones={asignacionesRecientes} />
      </div>
    </div>
  );
};

export default Inicio;
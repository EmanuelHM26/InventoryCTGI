import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import DashboardLayout from "../components/DashboardLayout";
import AsignacionesRecent from "../components/AsignacionesRecent";
import Card from "../components/Card";
import { FaUsers, FaFileInvoice, FaUserFriends, FaTruck } from "react-icons/fa";
import SearchGlobal from "../components/SearchGlobal";
import AccionesRapidas from "../components/AccionesRapidas";

const Inicio = () => {
  const [cardData, setCardData] = useState([]);
  const [asignacionesRecientes, setAsignacionesRecientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  // Función para obtener las estadísticas
  const fetchCardData = useCallback(async () => {
    try {
      setError(null);      
      // Asegúrate de que la URL coincida con tu configuración del servidor
      const res = await axios.get("http://localhost:3000/api/contar-estadisticas", {
        withCredentials: true,
        timeout: 10000 // Timeout de 10 segundos
      });
      
      const stats = res.data;
      // Actualizar las cards con los datos recibidos
      setCardData([
        {
          iconClass: <FaUsers className="text-white" size={32} />,
          title: "Total Usuarios",
          value: stats.totalUsuarios?.toString() || "0",
        },
        {
          iconClass: <FaUserFriends className="text-white" size={32} />,
          title: "Total Asignaciones",
          value: stats.totalAsignaciones?.toString() || "0",
        },
        {
          iconClass: <FaFileInvoice className="text-white" size={32} />,
          title: "Equipos Tecnológicos",
          value: stats.totalEquiposTecnologicos?.toString() || "0",
        },
        {
          iconClass: <FaTruck className="text-white" size={32} />,
          title: "Productos Consumibles",
          value: stats.totalProductosConsumibles?.toString() || "0",
        },
      ]);

      setLastUpdate(new Date().toLocaleTimeString());
      
      // Aquí puedes agregar lógica para asignaciones recientes si es necesario
      // setAsignacionesRecientes(stats.asignacionesRecientes || []);
      
    } catch (error) {
      console.error("Error al cargar datos del dashboard:", error);
      setError(error.response?.data?.message || error.message || "Error desconocido");
      
      // Mantener valores por defecto en caso de error
      if (cardData.length === 0) {
        setCardData([
          {
            iconClass: <FaUsers className="text-white" size={32} />,
            title: "Total Usuarios",
            value: "0",
          },
          {
            iconClass: <FaUserFriends className="text-white" size={32} />,
            title: "Total Asignaciones",
            value: "0",
          },
          {
            iconClass: <FaFileInvoice className="text-white" size={32} />,
            title: "Equipos Tecnológicos",
            value: "0",
          },
          {
            iconClass: <FaTruck className="text-white" size={32} />,
            title: "Productos Consumibles",
            value: "0",
          },
        ]);
      }
    } finally {
      setLoading(false);
    }
  }, [cardData.length]);

  useEffect(() => {
    // Cargar datos inicialmente
    fetchCardData();

    // Configurar actualización automática cada 30 segundos (más razonable que 5)
    const interval = setInterval(fetchCardData, 30000);

    // Limpiar intervalo al desmontar el componente
    return () => clearInterval(interval);
  }, [fetchCardData]);

  const handleSearch = (results) => {
    console.log("Resultados de búsqueda:", results);
    // Aquí puedes manejar los resultados de búsqueda si es necesario
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchCardData();
  };

  if (loading && cardData.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-800"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Buscador global */}
      <div className="lg:col-span-4 bg-white p-6 mt-20 rounded-lg shadow-md">
        <div className="mb-4">
          <SearchGlobal onSearch={handleSearch} />
        </div>
      </div>

      {/* Header con información de actualización */}
      <div className="lg:col-span-4 bg-white p-4 rounded-lg shadow-md mb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-800">Estadísticas del Sistema</h2>
            {lastUpdate && (
              <span className="text-sm text-gray-500">
                Última actualización: {lastUpdate}
              </span>
            )}
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="px-4 py-2 bg-green-800 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {loading ? "Actualizando..." : "Actualizar"}
          </button>
        </div>
        {error && (
          <div className="mt-2 p-3 bg-red-50 border-l-4 border-red-400 text-red-700">
            <p className="text-sm">Error: {error}</p>
          </div>
        )}
      </div>

      {/* Renderizar las tarjetas */}
      {cardData.map((card, index) => (
        <Card
          key={index}
          iconClass={card.iconClass}
          title={card.title}
          value={card.value}
        />
      ))}

      {/* Acciones rápidas */}
      <div className="lg:col-span-4 bg-white p-6 rounded-lg shadow-md mb-6">
        <AccionesRapidas />
      </div>

      {/* Tabla de asignaciones recientes */}
      <div className="lg:col-span-4">
        <AsignacionesRecent asignaciones={asignacionesRecientes} />
      </div>
    </div>
  );
};

export default Inicio;
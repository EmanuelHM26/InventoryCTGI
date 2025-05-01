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

  // Esta función se pasa a SearchGlobal pero ahora solo maneja notificaciones o logs
  const handleSearch = (results) => {
    // Solo registramos los resultados pero no mostramos un componente adicional
    console.log("Resultados de búsqueda:", results);
    // No mostramos SearchResults en la página principal
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      
      {/* Buscador global - ahora solo muestra el dropdown */}
      <div className="lg:col-span-4 bg-white p-6 mt-20 rounded-lg shadow-md">
        <div className="mb-4">
          <SearchGlobal onSearch={handleSearch} />
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
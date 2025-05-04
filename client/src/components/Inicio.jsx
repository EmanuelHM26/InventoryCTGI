import React, { useState, useEffect } from "react";
import axios from "axios";
import DashboardLayout from "../components/DashboardLayout";
import AsignacionesRecent from "../components/AsignacionesRecent";
import Card from "../components/Card";
import { BarChartOnValueChangeExample } from "../components/BarChart";
import { FaUsers, FaFileInvoice, FaUserFriends, FaTruck } from "react-icons/fa";
import SearchGlobal from "../components/SearchGlobal";
import AccionesRapidas from "../components/AccionesRapidas";

const Inicio = () => {
  const [cardData, setCardData] = useState([
    {
      iconClass: <FaUsers className="text-white" size={32} />,
      title: "Total Usuarios",
      value: "0",
    },
    {
      iconClass: <FaFileInvoice className="text-white" size={32} />,
      title: "Categorías",
      value: "0",
    },
    {
      iconClass: <FaUserFriends className="text-white" size={32} />,
      title: "Total de Asignaciones",
      value: "0",
    },
    {
      iconClass: <FaTruck className="text-white" size={32} />,
      title: "Equipos en Inventario",
      value: "0",
    },
  ]);

  const [asignacionesRecientes, setAsignacionesRecientes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Nueva función handleSearch
  const handleSearch = (results) => {
    return("Resultados de búsqueda:", results);
    // Aquí puedes manejar los resultados de búsqueda si es necesario
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [usuariosRes, asignacionesRes, categoriasRes, equiposRes] =
          await Promise.all([
            axios.get("/api/usuarios"),
            axios.get("/api/asignaciones"),
            axios.get("/api/categorias"),
            axios.get("/api/inventario"),
          ]);

        setCardData([
          {
            iconClass: <FaUsers className="text-white" size={32} />,
            title: "Total Usuarios",
            value: usuariosRes.data.length.toString(),
          },
          {
            iconClass: <FaFileInvoice className="text-white" size={32} />,
            title: "Categorías",
            value: categoriasRes.data.length.toString(),
          },
          {
            iconClass: <FaUserFriends className="text-white" size={32} />,
            title: "Total de Asignaciones",
            value: asignacionesRes.data.length.toString(),
          },
          {
            iconClass: <FaTruck className="text-white" size={32} />,
            title: "Equipos en Inventario",
            value: equiposRes.data.length.toString(),
          },
        ]);

        const asignacionesRecientes = await axios.get(
          "/api/asignaciones/recientes"
        );
        setAsignacionesRecientes(asignacionesRecientes.data);
      } catch (error) {
        console.error("Error al cargar datos del dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Buscador global */}
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

      {/* Diagrama de barras */}
      <div className="lg:col-span-4 bg-white p-6 rounded-lg shadow-md">
        <BarChartOnValueChangeExample />
      </div>
    </div>
  );
};

export default Inicio;
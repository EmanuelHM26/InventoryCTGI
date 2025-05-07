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
  const [cardData, setCardData] = useState([]);
  const [asignacionesRecientes, setAsignacionesRecientes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCardData = async () => {
      try {
        // Realizar las solicitudes a las APIs
        const [usuariosRes, asignacionesRes, equiposRes, productosRes] =
          await Promise.all([
            axios.get("/api/usuarios/count"),
            axios.get("/asignaciones/count"),
            axios.get("/equipos-tecnologicos/count"),
            axios.get("/productos-consumibles/count"),
          ]);

        // Validar que las respuestas contengan el campo `count`
        setCardData([
          {
            iconClass: <FaUsers className="text-white" size={32} />,
            title: "Total Usuarios",
            value: usuariosRes.data?.count?.toString() || "0",
          },
          {
            iconClass: <FaUserFriends className="text-white" size={32} />,
            title: "Total Asignaciones",
            value: asignacionesRes.data?.count?.toString() || "0",
          },
          {
            iconClass: <FaFileInvoice className="text-white" size={32} />,
            title: "Equipos Tecnológicos",
            value: equiposRes.data?.count?.toString() || "0",
          },
          {
            iconClass: <FaTruck className="text-white" size={32} />,
            title: "Productos Consumibles",
            value: productosRes.data?.count?.toString() || "0",
          },
        ]);

        // Obtener asignaciones recientes
        const asignacionesRecientesRes = await axios.get(
          "/api/asignaciones/recientes"
        );
        setAsignacionesRecientes(asignacionesRecientesRes.data || []);
      } catch (error) {
        console.error("Error al cargar datos del dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCardData(); // primera vez
    const interval = setInterval(fetchCardData, 5000); // cada 5 segundos

    return () => clearInterval(interval); // limpiar el intervalo al desmontar
  }, []);

  const handleSearch = (results) => {
    return("Resultados de búsqueda:", results);
    // Aquí puedes manejar los resultados de búsqueda si es necesario
  };

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
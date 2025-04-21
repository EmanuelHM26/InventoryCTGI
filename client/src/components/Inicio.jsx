import React from "react";
import DashboardLayout from "../components/DashboardLayout";
import Card from "../components/Card";
import { BarChartOnValueChangeExample } from "../components/BarChart"; // Importa el componente del diagrama de barras
import { FaUsers, FaFileInvoice, FaUserFriends, FaTruck } from "react-icons/fa"; // Importa los iconos necesarios

const cardData = [
  {
    iconClass: <FaUsers className="mr-1" />,
    title: "Total Usuarios",
    value: "20",
  },
  {
    iconClass: <FaFileInvoice className="mr-1" />,
    title: "Categorias",
    value: "2",
  },
  {
    iconClass: <FaUserFriends className="mr-1" />,
    title: "Total de Asignaciones",
    value: "5",
  },
  {
    iconClass: <FaTruck className="mr-1" />,
    title: "Equipos en Inventario",
    value: "50",
  },
];

const Inicio = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
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
    </div>
  );
};

export default Inicio;
import React from "react";
import DashboardLayout from "../components/DashboardLayout";
import Card from "../components/Card";
import { BarChartOnValueChangeExample } from "../components/BarChart"; // Importa el componente del diagrama de barras

const cardData = [
  {
    iconClass: "fas fa-yen-sign",
    title: "Payment amount",
    value: "8,992",
    subtitle: "Yesterday 8638",
  },
  {
    iconClass: "fas fa-file-invoice",
    title: "Payment order",
    value: "793",
    subtitle: "Yesterday 753",
  },
  {
    iconClass: "fas fa-users",
    title: "Paying customer",
    value: "280",
    subtitle: "Yesterday 320",
  },
  {
    iconClass: "fas fa-truck",
    title: "Pending orders",
    value: "480",
    subtitle: "Yesterday 470",
  },
];

const Inicio = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

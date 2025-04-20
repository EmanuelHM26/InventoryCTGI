import React from "react";
import DashboardLayout from "../components/DashboardLayout";
import Card from "../components/Card";

const cardData = [
  { iconClass: "fas fa-user", title: "Total Usuarios", value: "10" },
  { iconClass: "fas fa-th-large", title: "Categorías", value: "2" },
  { iconClass: "fas fa-edit", title: "Total Asignaciones", value: "25" },
  { iconClass: "fas fa-clipboard-list", title: "Inventario", value: "5" },
];

const DashboardPage = () => {
  return (
    <DashboardLayout>
      <div className="grid grid-cols-2 gap-6">
        {cardData.map((card, index) => (
          <Card
            key={index}
            iconClass={card.iconClass}
            title={card.title}
            value={card.value}
          />
        ))}
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
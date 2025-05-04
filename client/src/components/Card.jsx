import React from "react";

const Card = ({ iconClass, title, value }) => {
  return (
    <div className="bg-white p-6 mt-5 mb-5 rounded-lg shadow-md flex flex-col items-center justify-center space-y-4 hover:shadow-lg transition-shadow duration-300">
      {/* Contenedor del ícono */}
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-800">
        {iconClass}
      </div>
      {/* Título */}
      <h3 className="text-lg font-semibold text-gray-700 text-center">{title}</h3>
      {/* Valor */}
      <p className="text-4xl font-bold text-gray-800">{value}</p>
    </div>
  );
};

export default Card;
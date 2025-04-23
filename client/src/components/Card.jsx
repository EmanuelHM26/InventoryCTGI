import React from "react";

const Card = ({ iconClass, title, value  }) => {
  return (
    <div className="bg-white p-10 mt-20 mb-5 rounded-lg shadow-md flex flex-col justify-between space-y-4 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center space-x-4">
        {/* Ícono */}
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-800">
          <i className="icon text-2xl text-white">{iconClass}</i>
        </div>
        {/* Título y valor */}
        <div className="flex flex-col w-sm">
          <h3 className="text-base font-semibold text-gray-700">{title}</h3>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default Card;
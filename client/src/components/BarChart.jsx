"use client";

import React, { useState } from "react";
import { BarChart } from "@tremor/react"; // Cambiado para importar desde Tremor

const chartdata = [
  {
    name: "Computadores",
    "Porcentaje de productos almacenados": 1000,
  },
  {
    name: "Camaras",
    "Porcentaje de productos almacenados": 800,
  },
  {
    name: "Luces",
    "Porcentaje de productos almacenados": 600,
  },
  {
    name: "Microfonos",
    "Porcentaje de productos almacenados": 400,
  },
  {
    name: "Cables",
    "Porcentaje de productos almacenados": 200,
  },
  {
    name: "Mouses",
    "Porcentaje de productos almacenados": 100,
  },

];


export const BarChartOnValueChangeExample = () => {
  const [value, setValue] = useState(null);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <BarChart
        className="h-72 w-full"
        data={chartdata}
        index="name"
        categories={["Porcentaje de productos almacenados"]}
        colors={["red"]}
        yAxisWidth={45}
        onValueChange={(v) => setValue(v)}
      />
      <pre className="mt-8 rounded-md bg-gray-500 p-3 text-sm text-white">
        {value
          ? `Has seleccionado: ${value.name} con un porcentaje de ${value["Porcentaje de productos almacenados"]}`
          : "Selecciona un valor en el gráfico para ver los detalles."}
      </pre>
    </div>
  );
};

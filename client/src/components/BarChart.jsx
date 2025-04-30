"use client";

import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  Cell,
} from "recharts";
import "../static/css/barChart.css"; // Asegúrate de que la ruta sea correcta

// Datos con almacenado y asignado
const chartdata = [
  { name: "Computadores", almacenado: 1000, asignado: 300 },
  { name: "Camaras", almacenado: 800, asignado: 200 },
  { name: "Luces", almacenado: 600, asignado: 150 },
  { name: "Microfonos", almacenado: 400, asignado: 120 },
  { name: "Cables", almacenado: 200, asignado: 80 },
  { name: "Mouses", almacenado: 100, asignado: 50 },
];

// Tooltip personalizado
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-700 text-white p-3 rounded-md shadow">
        <p className="font-semibold">{payload[0].payload.name}</p>
        <p>Almacenado: {payload[0].payload.almacenado}</p>
        <p>Asignado: {payload[0].payload.asignado}</p>
      </div>
    );
  }
  return null;
};

export const BarChartOnValueChangeExample = () => {
  const [value, setValue] = useState(null);

  return (
    <div className="bg-white pt-10 pb-12 px-6 rounded-lg shadow-md">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartdata}
          margin={{ top: 10, right: 30, left: 0, bottom: 2 }}
          onClick={(e) => setValue(e?.activePayload?.[0]?.payload || null)}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 12, angle: 0, dy: 10 }} />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={26}
            wrapperStyle={{ paddingTop: "10px", paddingBottom: "20px" }}
            iconType="circle"
            payload={[
              { value: 'Almacenado', type: 'circle', color: '#86efac', id: 'almacenado', style: { color: 'black' } },
              { value: 'Asignado', type: 'circle', color: '#22c55e', id: 'asignado', style: { color: 'black' } },
            ]}
          />
          <Bar dataKey="almacenado" name="Almacenado">
            {chartdata.map((_, index) => (
              <Cell key={`cell-almacenado-${index}`} fill="#86efac" />
            ))}
          </Bar>
          <Bar dataKey="asignado" name="Asignado">
            {chartdata.map((_, index) => (
              <Cell key={`cell-asignado-${index}`} fill="#22c55e" />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <pre className="mt-8 rounded-md bg-gray-800 p-3 text-sm text-white">
        {value
          ? `Has seleccionado: ${value.name}\nAlmacenado: ${value.almacenado}\nAsignado: ${value.asignado}`
          : "Selecciona un valor en el gráfico para ver los detalles."}
      </pre>
    </div>
  );
};

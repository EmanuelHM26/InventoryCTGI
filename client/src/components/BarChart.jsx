"use client";

import React, { useState } from "react";
import { BarChart } from "@tremor/react"; // Cambiado para importar desde Tremor

const chartdata = [
  {
    name: "Amphibians",
    "Number of threatened species": 2488,
  },
  {
    name: "Birds",
    "Number of threatened species": 1445,
  },
  {
    name: "Crustaceans",
    "Number of threatened species": 743,
  },
  {
    name: "Ferns",
    "Number of threatened species": 281,
  },
  {
    name: "Arachnids",
    "Number of threatened species": 251,
  },
  {
    name: "Corals",
    "Number of threatened species": 232,
  },
  {
    name: "Algae",
    "Number of threatened species": 98,
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
        categories={["Number of threatened species"]}
        colors={["blue"]}
        yAxisWidth={45}
        onValueChange={(v) => setValue(v)}
      />
      <pre className="mt-8 rounded-md bg-gray-950 p-3 text-sm text-white dark:bg-gray-800">
        {JSON.stringify(value, null, 2)}
      </pre>
    </div>
  );
};

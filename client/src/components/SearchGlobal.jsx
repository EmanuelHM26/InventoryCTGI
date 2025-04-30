import React, { useState, useEffect } from "react";
import axios from "axios";

const SearchGlobal = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (!term.trim()) {
      onSearch({ usuarios: [], asignaciones: [] });
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:3000/api/search?term=${encodeURIComponent(term)}`);
      if (response.data.success) {
        onSearch(response.data.data);
      } else {
        console.error('Error en la respuesta de la API:', response.data.message);
      }
    } catch (error) {
      console.error('Error al realizar la búsqueda:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Buscar usuarios o asignaciones..."
        value={searchTerm}
        onChange={handleInputChange}
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      {isLoading && (
        <div className="absolute right-3 top-3">
          <svg className="animate-spin h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}
    </div>
  );
};

export default SearchGlobal;
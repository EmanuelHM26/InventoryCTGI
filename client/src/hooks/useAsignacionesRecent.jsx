import React, { useState, useEffect } from "react";
import axios from "axios";

export const useAsignacionesRecent = () => {
  const [asignaciones, setAsignaciones] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [diasFiltro, setDiasFiltro] = useState(7); // Por defecto últimos 7 días
  const itemsPerPage = 6;

  useEffect(() => {
    fetchRecentAsignaciones();
  }, [diasFiltro]);

  const fetchRecentAsignaciones = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/asignaciones/recent?days=${diasFiltro}`,
        { withCredentials: true }
      );
      setAsignaciones(response.data);
      setCurrentPage(1); // Resetear a la primera página cuando cambie el filtro
    } catch (error) {
      console.error("Error al obtener asignaciones recientes:", error);
    }
  };

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAsignaciones = asignaciones.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(asignaciones.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Formatear fecha para mostrar en formato legible
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Opciones de filtro por días
  const filtroOpciones = [
    { value: 1, label: "Hoy" },
    { value: 3, label: "Últimos 3 días" },
    { value: 7, label: "Última semana" },
    { value: 15, label: "Últimos 15 días" },
    { value: 30, label: "Último mes" },
  ];

  return {
    asignaciones: currentAsignaciones,
    currentPage,
    totalPages,
    diasFiltro,
    setDiasFiltro,
    paginate,
    formatDate,
    filtroOpciones,
    fetchRecentAsignaciones, // Exponer la función para recargar asignaciones
    itemsPerPage, // Exponer el número de elementos por página
    indexOfFirstItem, // Exponer el índice del primer elemento de la página actual
    indexOfLastItem, // Exponer el índice del último elemento de la página actual
    totalAsignaciones: asignaciones.length // Exponer el total de asignaciones obtenidas
  }
};

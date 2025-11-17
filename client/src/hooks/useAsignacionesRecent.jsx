import React, { useState, useEffect } from "react";
import axios from "axios";
import configAxios from "../api/configAxios";
// axios: para hacer la petición HTTP a tu backend.

export const useAsignacionesRecent = () => {
  const [asignaciones, setAsignaciones] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [diasFiltro, setDiasFiltro] = useState(7); // Por defecto últimos 7 días
  const itemsPerPage = 6;
//asignaciones → array con todas las asignaciones recientes que vienen del backend.
//currentPage → número de página actual en la paginación.
//diasFiltro → cuántos días hacia atrás se buscan asignaciones (ejemplo: 7 días por defecto).
//itemsPerPage → cantidad fija de asignaciones que se muestran por página (6).


  useEffect(() => {
    fetchRecentAsignaciones();
  }, [diasFiltro]);
  // Cada vez que diasFiltro cambie, se llama a fetchRecentAsignaciones para actualizar la lista.

  // Función para obtener asignaciones recientes desde el backend
  const fetchRecentAsignaciones = async () => {
    try {
      const response = await configAxios.get(`/api/asignaciones/recent?days=${diasFiltro}`,
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

//Calcula qué asignaciones mostrar en la página actual:
//indexOfLastItem: índice del último elemento de la página.
//indexOfFirstItem: índice del primer elemento de la página.
//currentAsignaciones: el "slice" (corte) de asignaciones a mostrar.
//totalPages: número total de páginas según cuántas asignaciones hay.

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };
  //Cambia la página actual, pero solo si está dentro del rango válido.

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

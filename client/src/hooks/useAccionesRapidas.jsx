// useState: hook de React para manejar estado dentro del componente.
//useNavigate: hook de React Router v6 que permite navegar programáticamente entre rutas.

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';



export const useAccionesRapidas = () => {
  const navigate = useNavigate();
//  isHovering: objeto que mantiene el estado de si el cursor está sobre cada botón.
  const [isHovering, setIsHovering] = useState({
    asignacion: false,
    usuario: false,
    equipoTecnologico: false,
    productoConsumible: false,
  });

  const handleMouseEnter = (button) => {
    setIsHovering((prev) => ({ ...prev, [button]: true }));
  };
//Recibe un button (ejemplo: "asignacion").
//Actualiza el estado poniendo esa propiedad en true.
//Usa prev y spread ...prev para no perder el resto de propiedades.

  const handleMouseLeave = (button) => {
    setIsHovering((prev) => ({ ...prev, [button]: false }));
  };
//ACA HACE LO MISMO PERO PONE EN FALSE

  const handleClick = (route) => {
    navigate(route);
  };
// navegate(route): navega a la ruta especificada (ejemplo: "/asignaciones/nueva").

  return {
    isHovering,
    handleMouseEnter,
    handleMouseLeave,
    handleClick,
  };
};

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAccionesRapidas = () => {
  const navigate = useNavigate();
  const [isHovering, setIsHovering] = useState({
    asignacion: false,
    usuario: false,
    equipoTecnologico: false,
    productoConsumible: false,
  });

  const handleMouseEnter = (button) => {
    setIsHovering((prev) => ({ ...prev, [button]: true }));
  };

  const handleMouseLeave = (button) => {
    setIsHovering((prev) => ({ ...prev, [button]: false }));
  };

  const handleClick = (route) => {
    navigate(route);
  };

  return {
    isHovering,
    handleMouseEnter,
    handleMouseLeave,
    handleClick,
  };
};

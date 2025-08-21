import { useState } from 'react';
import { PlusCircle, UserPlus, Laptop, Monitor, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AccionesRapidas = () => {
  const navigate = useNavigate();
  const [isHovering, setIsHovering] = useState({
    asignacion: false,
    usuario: false,
    equipoTecnologico: false,
    productoConsumible: false
  });

  const handleMouseEnter = (button) => {
    setIsHovering(prev => ({ ...prev, [button]: true }));
  };

  const handleMouseLeave = (button) => {
    setIsHovering(prev => ({ ...prev, [button]: false }));
  };

  const handleClick = (route) => {
    navigate(route);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <div className="flex items-center mb-4">
        <PlusCircle className="text-green-700 mr-2" size={24} />
        <h2 className="text-xl font-semibold text-gray-800">Acciones Rápidas</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          className={`flex items-center justify-center p-4 rounded-lg transition-all duration-200 ${
            isHovering.asignacion 
              ? 'bg-green-600 text-white' 
              : 'bg-green-100 text-green-700 hover:bg-green-200'
          }`}
          onClick={() => handleClick('/dashboard/asignaciones')}
          onMouseEnter={() => handleMouseEnter('asignacion')}
          onMouseLeave={() => handleMouseLeave('asignacion')}
        >
          <Laptop className="mr-2" size={20} />
          <span className="font-medium">Realizar Asignación</span>
        </button>
        
        <button
          className={`flex items-center justify-center p-4 rounded-lg transition-all duration-200 ${
            isHovering.usuario 
              ? 'bg-green-600 text-white' 
              : 'bg-green-100 text-green-700 hover:bg-green-200'
          }`}
          onClick={() => handleClick('/dashboard/usuarios')}
          onMouseEnter={() => handleMouseEnter('usuario')}
          onMouseLeave={() => handleMouseLeave('usuario')}
        >
          <UserPlus className="mr-2" size={20} />
          <span className="font-medium">Registrar Usuario</span>
        </button>
        
        <button
          className={`flex items-center justify-center p-4 rounded-lg transition-all duration-200 ${
            isHovering.equipoTecnologico 
              ? 'bg-green-600 text-white' 
              : 'bg-green-100 text-green-700 hover:bg-green-200'
          }`}
          onClick={() => handleClick('/dashboard/equipos-tecnologicos')}
          onMouseEnter={() => handleMouseEnter('equipoTecnologico')}
          onMouseLeave={() => handleMouseLeave('equipoTecnologico')}
        >
          <Monitor className="mr-2" size={20} />
          <span className="font-medium">Registrar Equipo Tecnológico</span>
        </button>
        
        <button
          className={`flex items-center justify-center p-4 rounded-lg transition-all duration-200 ${
            isHovering.productoConsumible 
              ? 'bg-green-600 text-white' 
              : 'bg-green-100 text-green-700 hover:bg-green-200'
          }`}
          onClick={() => handleClick('/dashboard/productos-consumibles')}
          onMouseEnter={() => handleMouseEnter('productoConsumible')}
          onMouseLeave={() => handleMouseLeave('productoConsumible')}
        >
          <Package className="mr-2" size={20} />
          <span className="font-medium">Registrar Producto Consumible</span>
        </button>
      </div>
    </div>
  );
};

export default AccionesRapidas;
import React, { useEffect, useRef } from 'react';

const BarcodeReader = ({ onScan, isActive = true }) => {
  const inputRef = useRef(null);
  const bufferRef = useRef('');
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!isActive) return;

    const handleKeyPress = (event) => {
      // Prevenir que el input se enfoque automáticamente
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA' || event.target.tagName === 'SELECT') {
        return;
      }

      const char = event.key;
      
      // Limpiar el timeout anterior
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Si es Enter, procesar el código escaneado
      if (char === 'Enter') {
        if (bufferRef.current.length > 0) {
          onScan(bufferRef.current.trim());
          bufferRef.current = '';
        }
        return;
      }

      // Agregar caracter al buffer si es válido
      if (char.length === 1) {
        bufferRef.current += char;
        
        // Establecer timeout para limpiar el buffer (en caso de que no llegue Enter)
        timeoutRef.current = setTimeout(() => {
          if (bufferRef.current.length > 0) {
            onScan(bufferRef.current.trim());
            bufferRef.current = '';
          }
        }, 100); // 100ms timeout
      }
    };

    // Agregar event listener
    document.addEventListener('keypress', handleKeyPress);

    // Cleanup
    return () => {
      document.removeEventListener('keypress', handleKeyPress);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isActive, onScan]);

  return (
    <div className="hidden">
      {/* Input oculto para mantener el foco si es necesario */}
      <input
        ref={inputRef}
        type="text"
        style={{ 
          position: 'absolute', 
          left: '-9999px', 
          opacity: 0,
          pointerEvents: 'none'
        }}
        tabIndex={-1}
      />
    </div>
  );
};

export default BarcodeReader;
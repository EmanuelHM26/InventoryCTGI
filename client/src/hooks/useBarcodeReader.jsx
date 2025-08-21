import { useEffect, useRef } from "react";

export const useBarcodeReader = (onScan, isActive = true) => {
  const inputRef = useRef(null);
  const bufferRef = useRef('');
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!isActive) return;

    const handleKeyPress = (event) => {
      if (
        event.target.tagName === 'INPUT' ||
        event.target.tagName === 'TEXTAREA' ||
        event.target.tagName === 'SELECT'
      ) {
        return;
      }

      const char = event.key;

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (char === 'Enter') {
        if (bufferRef.current.length > 0) {
          onScan(bufferRef.current.trim());
          bufferRef.current = '';
        }
        return;
      }

      if (char.length === 1) {
        bufferRef.current += char;

        timeoutRef.current = setTimeout(() => {
          if (bufferRef.current.length > 0) {
            onScan(bufferRef.current.trim());
            bufferRef.current = '';
          }
        }, 100);
      }
    };

    document.addEventListener('keypress', handleKeyPress);

    return () => {
      document.removeEventListener('keypress', handleKeyPress);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isActive, onScan]);

  return { inputRef };
};
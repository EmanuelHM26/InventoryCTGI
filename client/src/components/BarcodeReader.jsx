import React from 'react';
import { useBarcodeReader } from '../hooks/useBarcodeReader';

const BarcodeReader = ({ onScan, isActive = true }) => {
  const { inputRef } = useBarcodeReader(onScan, isActive);

  return (
    <div className="hidden">
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
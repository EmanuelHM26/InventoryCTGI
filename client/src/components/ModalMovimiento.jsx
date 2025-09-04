// components/ModalMovimiento.jsx
const ModalMovimiento = ({
  show,
  onClose,
  producto,
  tipo,
  onTipoChange,
  cantidad,
  onCantidadChange,
  motivo,
  onMotivoChange,
  onConfirm
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          {tipo === 'entrada' ? 'Agregar' : 'Retirar'} {producto?.Nombre}
        </h2>

        <div className="space-y-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Movimiento
            </label>
            <select
              value={tipo}
              onChange={(e) => onTipoChange(e.target.value)}
              className="border border-gray-300 p-2 rounded-lg w-full"
            >
              <option value="entrada">Entrada (Agregar)</option>
              <option value="salida">Salida (Retirar)</option>
              <option value="ajuste">Ajuste de Inventario</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cantidad
            </label>
            <input
              type="number"
              min="1"
              value={cantidad}
              onChange={(e) => onCantidadChange(e.target.value)}
              className="border border-gray-300 p-2 rounded-lg w-full"
              placeholder="Cantidad"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Motivo
            </label>
            <textarea
              value={motivo}
              onChange={(e) => onMotivoChange(e.target.value)}
              className="border border-gray-300 p-2 rounded-lg w-full"
              rows="3"
              placeholder="Motivo del movimiento"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalMovimiento
import {
  Search,
  Edit,
  Trash2,
  Plus,
  Minus, // AGREGAR ESTA IMPORTACIÓN
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { FileText, Download } from "lucide-react";
import { useProductosConsumibles } from "../hooks/useProductosConsumibles";
import { useMovimientosConsumibles } from "../hooks/useMovimientosConsumibles"; // IMPORTAR EL HOOK
import ModalMovimiento from "../components/ModalMovimiento"; // IMPORTAR EL MODAL

const ProductosConsumibles = () => {
  const {
    productos,
    showModal,
    setShowModal,
    newProducto,
    setNewProducto,
    fetchProductos,
    handleCreateProducto,
    handleEditProducto,
    handleDeleteProducto,
    searchTerm,
    setSearchTerm,
    currentPage,
    paginate,
    itemsPerPage,
    requestSort,
    sortedProductos,
    currentProductos,
    indexOfFirstItem,
    indexOfLastItem,
    totalPages,
    exportToPDF,
    exportToExcel,
    actualizarProductoLocal,
  } = useProductosConsumibles();

  // AGREGAR EL HOOK DE MOVIMIENTOS
  const {
    showModalMovimiento,
    setShowModalMovimiento,
    productoSeleccionado,
    tipoMovimiento,
    setTipoMovimiento,
    cantidadMovimiento,
    setCantidadMovimiento,
    motivoMovimiento,
    setMotivoMovimiento,
    realizarMovimiento,
    abrirModalMovimiento,
  } = useMovimientosConsumibles(actualizarProductoLocal);

  // FUNCIÓN PARA CONFIRMAR MOVIMIENTO
  const handleConfirmarMovimiento = async () => {
    if (!cantidadMovimiento || !motivoMovimiento.trim()) {
      alert("Por favor, complete todos los campos");
      return;
    }

    const exito = await realizarMovimiento(
      productoSeleccionado,
      tipoMovimiento,
      cantidadMovimiento,
      motivoMovimiento
    );

    if (exito) {
      setShowModalMovimiento(false);
    }
  };

  return (
    <div className="px-4 py-20 md:px-8 lg:px-10 max-w-full bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
            Productos Consumibles
          </h1>

          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
            {/* Buscador */}
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar producto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search
                size={18}
                className="absolute left-3 top-2.5 text-gray-400"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Botones de exportar */}
            <div className="flex gap-2">
              <button
                onClick={exportToPDF}
                className="flex items-center justify-center bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-sm"
                title="Exportar a PDF"
              >
                <FileText size={16} className="mr-2" />
                PDF
              </button>
              <button
                onClick={exportToExcel}
                className="flex items-center justify-center bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-sm"
                title="Exportar a Excel"
              >
                <Download size={16} className="mr-2" />
                Excel
              </button>
            </div>

            {/* Botón Nuevo Producto */}
            <button
              onClick={() => {
                setNewProducto({
                  Nombre: "",
                  CantidadDisponible: "",
                });
                setShowModal(true);
              }}
              className="flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
            >
              <Plus size={18} className="mr-2" />
              Nuevo Producto
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {["ID", "Nombre", "Cantidad", "Acciones"].map(
                  (header, index) => (
                    <th
                      key={index}
                      onClick={() => {
                        if (index < 3) {
                          const keys = [
                            "IdProductosConsumibles",
                            "Nombre",
                            "CantidadDisponible",
                          ];
                          requestSort(keys[index]);
                        }
                      }}
                      className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                        index < 3 ? "cursor-pointer hover:bg-gray-100" : ""
                      }`}
                    >
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentProductos.length > 0 ? (
                currentProductos.map((producto) => (
                  <tr
                    key={producto.IdProductosConsumibles}
                    className="hover:bg-blue-50 transition-colors duration-150"
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {producto.IdProductosConsumibles}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {producto.Nombre}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {producto.CantidadDisponible}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditProducto(producto)}
                          className="p-1 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600"
                          title="Editar producto"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() =>
                            abrirModalMovimiento(producto, "entrada")
                          }
                          className="p-1 rounded-full bg-green-100 hover:bg-green-200 text-green-600"
                          title="Agregar stock"
                        >
                          <Plus size={16} />
                        </button>
                        <button
                          onClick={() =>
                            abrirModalMovimiento(producto, "salida")
                          }
                          className="p-1 rounded-full bg-yellow-100 hover:bg-yellow-200 text-yellow-600"
                          title="Retirar stock"
                        >
                          <Minus size={16} />
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteProducto(
                              producto.IdProductosConsumibles
                            )
                          }
                          className="p-1 rounded-full bg-red-100 hover:bg-red-200 text-red-600"
                          title="Eliminar producto"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No se encontraron productos consumibles
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {sortedProductos.length > 0 && (
          <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
            <div>
              Mostrando {indexOfFirstItem + 1} a{" "}
              {Math.min(indexOfLastItem, sortedProductos.length)} de{" "}
              {sortedProductos.length} productos
            </div>
            <div className="flex space-x-1">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-md ${
                  currentPage === 1
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <ChevronLeft size={18} />
              </button>
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => paginate(idx + 1)}
                  className={`w-10 h-10 rounded-md ${
                    currentPage === idx + 1
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-md ${
                  currentPage === totalPages
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal para crear o editar un producto */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4 max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">
              {newProducto.IdProductosConsumibles
                ? "Editar Producto"
                : "Crear Nuevo Producto"}
            </h2>

            <div className="space-y-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  value={newProducto.Nombre}
                  onChange={(e) =>
                    setNewProducto({
                      ...newProducto,
                      Nombre: e.target.value,
                    })
                  }
                  className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cantidad Disponible
                </label>
                <input
                  type="text"
                  value={newProducto.CantidadDisponible}
                  onChange={(e) =>
                    setNewProducto({
                      ...newProducto,
                      CantidadDisponible: e.target.value,
                    })
                  }
                  className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateProducto}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                {newProducto.IdProductosConsumibles ? "Actualizar" : "Crear"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Movimientos */}
      <ModalMovimiento
        show={showModalMovimiento}
        onClose={() => setShowModalMovimiento(false)}
        producto={productoSeleccionado}
        tipo={tipoMovimiento}
        onTipoChange={setTipoMovimiento}
        cantidad={cantidadMovimiento}
        onCantidadChange={setCantidadMovimiento}
        motivo={motivoMovimiento}
        onMotivoChange={setMotivoMovimiento}
        onConfirm={handleConfirmarMovimiento}
      />
    </div>
  );
};

export default ProductosConsumibles;

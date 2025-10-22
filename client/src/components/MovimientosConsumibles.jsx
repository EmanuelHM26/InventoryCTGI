import {
  Search,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  FileText,
  Download,
  RefreshCw,
} from "lucide-react";
import { useMovimientos } from "../hooks/useMovimientos";

const MovimientosConsumibles = () => {
  const {
    productos,
    searchTerm,
    setSearchTerm,
    currentPage,
    paginate,
    requestSort,
    sortConfig,
    filtroTipo,
    setFiltroTipo,
    filtroProducto,
    setFiltroProducto,
    filtroFechaInicio,
    setFiltroFechaInicio,
    filtroFechaFin,
    setFiltroFechaFin,
    sortedMovimientos,
    currentMovimientos,
    totalPages,
    limpiarFiltros,
    exportToPDF,
    exportToExcel,
    indexOfFirstItem,
    indexOfLastItem,
  } = useMovimientos();

  const getTipoColor = (tipo) => {
    switch (tipo) {
      case "entrada":
        return "bg-green-100 text-green-800";
      case "salida":
        return "bg-red-100 text-red-800";
      case "ajuste":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="px-4 py-20 md:px-8 lg:px-10 max-w-full bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
            Historial de Movimientos
          </h1>

          <div className="flex flex-wrap gap-2">
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
        </div>

        {/* Filtros */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-600" />
              <h3 className="font-semibold text-gray-700">Filtros</h3>
            </div>
            <button
              onClick={limpiarFiltros}
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
            >
              <RefreshCw size={16} />
              Limpiar filtros
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Búsqueda */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Búsqueda
              </label>
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
              />
              <Search
                size={18}
                className="absolute left-3 top-9 text-gray-400"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Tipo de movimiento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Movimiento
              </label>
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos</option>
                <option value="entrada">Entrada</option>
                <option value="salida">Salida</option>
                <option value="ajuste">Ajuste</option>
              </select>
            </div>

            {/* Producto */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Producto
              </label>
              <select
                value={filtroProducto}
                onChange={(e) => setFiltroProducto(e.target.value)}
                className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos los productos</option>
                {productos.map((producto) => (
                  <option
                    key={producto.IdProductosConsumibles}
                    value={producto.IdProductosConsumibles}
                  >
                    {producto.Nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Rango de fechas */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Desde
                </label>
                <input
                  type="date"
                  value={filtroFechaInicio}
                  onChange={(e) => setFiltroFechaInicio(e.target.value)}
                  className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hasta
                </label>
                <input
                  type="date"
                  value={filtroFechaFin}
                  onChange={(e) => setFiltroFechaFin(e.target.value)}
                  className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tabla de movimientos */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  { key: "FechaMovimiento", label: "Fecha" },
                  { key: "Producto", label: "Producto" },
                  { key: "TipoMovimiento", label: "Tipo" },
                  { key: "Cantidad", label: "Cantidad" },
                  { key: "Motivo", label: "Motivo" },
                  { key: "Usuario", label: "Usuario" },
                ].map((header) => (
                  <th
                    key={header.key}
                    onClick={() => requestSort(header.key)}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center gap-2">
                      {header.label}
                      {sortConfig.key === header.key && (
                        <span>
                          {sortConfig.direction === "ascending" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentMovimientos.length > 0 ? (
                currentMovimientos.map((movimiento) => (
                  <tr
                    key={movimiento.IdMovimiento}
                    className="hover:bg-blue-50 transition-colors duration-150"
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {formatearFecha(
                        movimiento.createdAt || movimiento.FechaMovimiento
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {movimiento.Producto?.Nombre || "N/A"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${getTipoColor(
                          movimiento.TipoMovimiento
                        )}`}
                      >
                        {movimiento.TipoMovimiento}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-semibold">
                      {movimiento.TipoMovimiento === "salida" && "-"}
                      {movimiento.TipoMovimiento === "entrada" && "+"}
                      {movimiento.Cantidad}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate">
                      {movimiento.Motivo || "Sin motivo especificado"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {movimiento.Usuario || "Sistema"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No se encontraron movimientos
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {sortedMovimientos.length > 0 && (
          <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
            <div>
              Mostrando {indexOfFirstItem + 1} a{" "}
              {Math.min(indexOfLastItem, sortedMovimientos.length)} de{" "}
              {sortedMovimientos.length} movimientos
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

        {/* Resumen de estadísticas */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Entradas</p>
                <p className="text-2xl font-bold text-green-700">
                  {
                    sortedMovimientos.filter(
                      (m) => m.TipoMovimiento === "entrada"
                    ).length
                  }
                </p>
              </div>
              <div className="text-green-500 text-3xl">+</div>
            </div>
          </div>

          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 font-medium">Salidas</p>
                <p className="text-2xl font-bold text-red-700">
                  {
                    sortedMovimientos.filter(
                      (m) => m.TipoMovimiento === "salida"
                    ).length
                  }
                </p>
              </div>
              <div className="text-red-500 text-3xl">-</div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Ajustes</p>
                <p className="text-2xl font-bold text-blue-700">
                  {
                    sortedMovimientos.filter(
                      (m) => m.TipoMovimiento === "ajuste"
                    ).length
                  }
                </p>
              </div>
              <div className="text-blue-500 text-3xl">≈</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovimientosConsumibles;
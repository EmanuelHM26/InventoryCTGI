import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { useAsignacionesRecent } from "../hooks/useAsignacionesRecent";

const AsignacionesRecent = () => {
  const {
    asignaciones,
    currentPage,
    totalPages,
    diasFiltro,
    setDiasFiltro,
    paginate,
    formatDate,
    filtroOpciones,
    itemsPerPage,
    indexOfFirstItem,
    indexOfLastItem,
    totalAsignaciones
  } = useAsignacionesRecent();
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          Asignaciones Recientes
        </h2>
        
        {/* Filtro por días */}
        <div className="flex items-center space-x-2">
          <Calendar size={18} className="text-gray-500" />
          <select
            value={diasFiltro}
            onChange={(e) => setDiasFiltro(parseInt(e.target.value))}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {filtroOpciones.map((opcion) => (
              <option key={opcion.value} value={opcion.value}>
                {opcion.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {["ID", "Usuario", "Fecha Asignación", "Observación", "Fecha Devolución", "Cantidad", "Item", "Estado"].map(
                (header, index) => (
                  <th
                    key={index}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {asignaciones.length > 0 ? (
              asignaciones.map((asignacion) => (
                <tr
                  key={asignacion.IdAsignaciones}
                  className="hover:bg-blue-50 transition-colors duration-150"
                >
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {asignacion.IdAsignaciones}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {asignacion.Usuario?.Usuario || "N/A"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(asignacion.FechaAsignacion)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {asignacion.Observacion}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {asignacion.FechaDevolucion}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {asignacion.Cantidad}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {asignacion.Item}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      asignacion.Estado === 'Activo' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {asignacion.Estado}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="8"
                  className="px-4 py-8 text-center text-gray-500"
                >
                  No se encontraron asignaciones en los últimos {diasFiltro} días
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Información adicional */}
      {totalAsignaciones > 0 && (
        <div className="mt-4 text-sm text-gray-600">
          <p>Mostrando {totalAsignaciones} asignaciones de los últimos {diasFiltro} días</p>
        </div>
      )}

      {/* Paginación */}
      {totalAsignaciones > itemsPerPage && (
        <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
          <div>
            Mostrando {indexOfFirstItem + 1} a{" "}
            {Math.min(indexOfLastItem, totalAsignaciones)} de{" "}
            {totalAsignaciones} asignaciones
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
                    ? "bg-black text-white"
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
  );
};

export default AsignacionesRecent;
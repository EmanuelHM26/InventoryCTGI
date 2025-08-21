import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, Edit, Trash2, Plus, X, ChevronLeft, ChevronRight } from "lucide-react";
import Swal from "sweetalert2";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { FileText, Download } from "lucide-react";

const ProductosConsumibles = () => {
  const [productos, setProductos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newProducto, setNewProducto] = useState({
    Nombre: "",
    CantidadDisponible: "",
    IdOriginal: "",
    IdCodigoBarras: "",
  });

  // Estados para búsqueda, paginación y ordenación
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [sortConfig, setSortConfig] = useState({
    key: "IdProductosConsumibles",
    direction: "ascending",
  });

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/productosconsumibles",
        { withCredentials: true }
      );
      setProductos(response.data);
    } catch (error) {
      console.error("Error al obtener productos consumibles:", error);
    }
  };

  const handleCreateProducto = async () => {
    try {
      if (newProducto.IdProductosConsumibles) {
        await axios.put(
          `http://localhost:3000/api/productosconsumibles/${newProducto.IdProductosConsumibles}`,
          newProducto,
          { withCredentials: true }
        );
        Swal.fire({
          icon: "success",
          title: "Producto actualizado",
          text: "El producto se actualizó correctamente.",
          showConfirmButton: true,
        });
      } else {
        await axios.post(
          "http://localhost:3000/api/productosconsumibles",
          newProducto,
          { withCredentials: true }
        );
        Swal.fire({
          icon: "success",
          title: "Producto creado",
          text: "El producto se creó correctamente.",
          showConfirmButton: true,
        });
      }
      setShowModal(false);
      fetchProductos();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al guardar el producto.",
        showConfirmButton: true,
      });
      console.error("Error al guardar producto:", error);
    }
  };

  const handleEditProducto = (producto) => {
    setNewProducto(producto);
    setShowModal(true);
  };

  const handleDeleteProducto = async (id) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará el producto. ¿Deseas continuar?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(
          `http://localhost:3000/api/productosconsumibles/${id}`,
          { withCredentials: true }
        );
        fetchProductos();
        Swal.fire({
          icon: "success",
          title: "Eliminado",
          text: "El producto fue eliminado correctamente.",
          showConfirmButton: true,
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Ocurrió un error al eliminar el producto.",
          showConfirmButton: true,
        });
        console.error("Error al eliminar producto:", error);
      }
    }
  };

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const filteredProductos = productos.filter((producto) =>
    producto.Nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedProductos = [...filteredProductos].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProductos = sortedProductos.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedProductos.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const exportToPDF = async () => {
    try {
      // Cargar el logo y convertirlo a base64
      const getBase64FromUrl = async (url) => {
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      };

      const senaLogoBase64 = await getBase64FromUrl('/logosena.png');
      const doc = new jsPDF();

      // --- LOGO SENA ---
      doc.addImage(senaLogoBase64, 'PNG', 15, 10, 30, 25);

      // --- TÍTULO EN VERDE CENTRADO ---
      doc.setFontSize(22);
      doc.setTextColor(57, 181, 74); // Verde SENA
      doc.setFont(undefined, 'bold');
      doc.text('Inventario CTGI', 105, 25, { align: 'center' });

      // --- SUBTÍTULO EN NEGRO ---
      doc.setFontSize(18);
      doc.setTextColor(0, 0, 0);
      doc.setFont(undefined, 'bold');
      doc.text('Productos consumibles', 15, 45);

      // --- FECHA Y TOTAL ---
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text(`Fecha:`, 15, 55);
      doc.text(`Total:`, 15, 63);

      doc.setFont(undefined, 'normal');
      doc.text(`${new Date().toLocaleDateString('es-ES')}`, 40, 55);
      doc.text(`${sortedProductos.length}`, 40, 63);

      // --- DESCRIPCIÓN ---
      doc.setFontSize(13);
      doc.setFont(undefined, 'bold');
      doc.text('Descripción:', 15, 73);
      doc.setFontSize(11);
      doc.setFont(undefined, 'normal');
      doc.text('Este reporte contiene la lista de productos consumibles registrados en el sistema, mostrando su cantidad disponible y códigos asociados.', 15, 80, { maxWidth: 180 });

      // --- TABLA ---
      const tableData = sortedProductos.map(prod => [
        String(prod.IdProductosConsumibles || ''),
        prod.Nombre || '',
        prod.CantidadDisponible || '',
        prod.IdOriginal || '',
        prod.IdCodigoBarras || ''
      ]);

      autoTable(doc, {
        head: [['ID', 'Nombre', 'Cantidad', 'ID Original', 'ID Código Barras']],
        body: tableData,
        startY: 90,
        styles: {
          fontSize: 9,
          cellPadding: 2
        },
        headStyles: {
          fillColor: [57, 181, 74], // Verde SENA
          textColor: 255,
          fontStyle: 'bold'
        }
      });

      const fileName = `productos_consumibles_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);

      Swal.fire({
        icon: 'success',
        title: 'PDF generado',
        text: 'El archivo PDF se ha descargado correctamente.',
        timer: 2000,
        showConfirmButton: false
      });

    } catch (error) {
      console.error('Error detallado al generar PDF:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al generar PDF',
        text: `Error: ${error.message}`,
        showConfirmButton: true
      });
    }
  };

  const exportToExcel = () => {
    try {
      const wsData = [
        ['ID', 'Nombre', 'Cantidad', 'ID Original', 'ID Código Barras'],
        ...sortedProductos.map(prod => [
          prod.IdProductosConsumibles || '',
          prod.Nombre || '',
          prod.CantidadDisponible || '',
          prod.IdOriginal || '',
          prod.IdCodigoBarras || ''
        ])
      ];

      const worksheet = XLSX.utils.aoa_to_sheet(wsData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "ProductosConsumibles");

      const fileName = `productos_consumibles_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(workbook, fileName);

      Swal.fire({
        icon: 'success',
        title: 'Excel generado',
        text: 'El archivo Excel se ha descargado correctamente.',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error al generar Excel:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al generar Excel',
        text: `Error: ${error.message}`,
        showConfirmButton: true
      });
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
                  IdOriginal: "",
                  IdCodigoBarras: "",
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
                {["ID", "Nombre", "Cantidad", "ID Original", "Acciones"].map(
                  (header, index) => (
                    <th
                      key={index}
                      onClick={() => {
                        if (index < 4) {
                          const keys = [
                            "IdProductosConsumibles",
                            "Nombre",
                            "CantidadDisponible",
                            "IdOriginal",
                          ];
                          requestSort(keys[index]);
                        }
                      }}
                      className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${index < 4 ? "cursor-pointer hover:bg-gray-100" : ""
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
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {producto.IdOriginal}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditProducto(producto)}
                          className="p-1 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 transition-colors duration-200"
                          title="Editar producto"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteProducto(producto.IdProductosConsumibles)
                          }
                          className="p-1 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition-colors duration-200"
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
                    colSpan="5"
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
                className={`p-2 rounded-md ${currentPage === 1
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
                  className={`w-10 h-10 rounded-md ${currentPage === idx + 1
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
                className={`p-2 rounded-md ${currentPage === totalPages
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
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg mx-4 max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">
              {newProducto.IdProductosConsumibles
                ? "Editar Producto"
                : "Crear Nuevo Producto"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID Original
                </label>
                <input
                  type="text"
                  value={newProducto.IdOriginal}
                  onChange={(e) =>
                    setNewProducto({
                      ...newProducto,
                      IdOriginal: e.target.value,
                    })
                  }
                  className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID Código Barras
                </label>
                <input
                  type="text"
                  value={newProducto.IdCodigoBarras}
                  onChange={(e) =>
                    setNewProducto({
                      ...newProducto,
                      IdCodigoBarras: e.target.value,
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
    </div>
  );
};

export default ProductosConsumibles;
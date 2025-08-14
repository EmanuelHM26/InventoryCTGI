import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export const useProductosConsumibles = () => {
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

   return {
    productos,
    showModal,
    setShowModal,
    newProducto,
    setNewProducto,
    handleCreateProducto,
    handleEditProducto,
    handleDeleteProducto,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    requestSort,
    sortConfig,
    sortedProductos, // <-- CAMBIA ESTO
    currentProductos,
    totalPages,
    paginate,
    exportToPDF,
    exportToExcel
  };
}
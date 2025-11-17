import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import configAxios from "../api/configAxios";

export const useMovimientos = (actualizarProductoLocal) => {
  const [movimientos, setMovimientos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [showModalMovimiento, setShowModalMovimiento] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [tipoMovimiento, setTipoMovimiento] = useState("entrada");
  const [cantidadMovimiento, setCantidadMovimiento] = useState("");
  const [motivoMovimiento, setMotivoMovimiento] = useState("");

  // Estados para filtros y paginación
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtroProducto, setFiltroProducto] = useState("");
  const [filtroFechaInicio, setFiltroFechaInicio] = useState("");
  const [filtroFechaFin, setFiltroFechaFin] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "FechaMovimiento",
    direction: "descending",
  });

  useEffect(() => {
    fetchMovimientos();
    fetchProductos();
  }, []);

  const fetchMovimientos = async () => {
    try {
      const response = await configAxios.get(
        "/api/movimientosconsumibles",
        { withCredentials: true }
      );
      setMovimientos(response.data.rows || response.data);
    } catch (error) {
      console.error("Error al obtener movimientos:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar los movimientos.",
      });
    }
  };

  const fetchProductos = async () => {
    try {
      const response = await configAxios.get(
        "/api/productosconsumibles",
        { withCredentials: true }
      );
      setProductos(response.data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  const abrirModalMovimiento = (producto, tipo = "entrada") => {
    setProductoSeleccionado(producto);
    setTipoMovimiento(tipo);
    setCantidadMovimiento("");
    setMotivoMovimiento("");
    setShowModalMovimiento(true);
  };

  const realizarMovimiento = async (producto, tipo, cantidad, motivo) => {
    try {
      const movimientoData = {
        IdProductoConsumible: producto.IdProductosConsumibles,
        TipoMovimiento: tipo,
        Cantidad: parseInt(cantidad),
        Motivo: motivo,
      };

      await configAxios.post(
        "/api/movimientosconsumibles",
        movimientoData,
        { withCredentials: true }
      );

      // Actualizar el producto local si existe la función
      if (actualizarProductoLocal) {
        let nuevaCantidad = producto.CantidadDisponible;
        if (tipo === "entrada") {
          nuevaCantidad = parseInt(producto.CantidadDisponible) + parseInt(cantidad);
        } else if (tipo === "salida") {
          nuevaCantidad = parseInt(producto.CantidadDisponible) - parseInt(cantidad);
        } else if (tipo === "ajuste") {
          nuevaCantidad = parseInt(cantidad);
        }

        actualizarProductoLocal(producto.IdProductosConsumibles, {
          CantidadDisponible: nuevaCantidad,
        });
      }

      // Recargar movimientos
      await fetchMovimientos();

      Swal.fire({
        icon: "success",
        title: "Movimiento registrado",
        text: `El movimiento de ${tipo} se registró correctamente.`,
        timer: 2000,
        showConfirmButton: false,
      });

      return true;
    } catch (error) {
      console.error("Error al registrar movimiento:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "No se pudo registrar el movimiento.",
      });
      return false;
    }
  };

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Aplicar filtros
  const filteredMovimientos = movimientos.filter((movimiento) => {
    const productoNombre = movimiento.Producto?.Nombre || "";
    const cumpleBusqueda =
      productoNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movimiento.Motivo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movimiento.Usuario?.toLowerCase().includes(searchTerm.toLowerCase());

    const cumpleTipo = filtroTipo ? movimiento.TipoMovimiento === filtroTipo : true;
    const cumpleProducto = filtroProducto
      ? movimiento.IdProductoConsumible === parseInt(filtroProducto)
      : true;

    let cumpleFecha = true;
    if (filtroFechaInicio && filtroFechaFin) {
      const fechaMovimiento = new Date(movimiento.createdAt || movimiento.FechaMovimiento);
      const fechaInicio = new Date(filtroFechaInicio);
      const fechaFin = new Date(filtroFechaFin);
      cumpleFecha = fechaMovimiento >= fechaInicio && fechaMovimiento <= fechaFin;
    }

    return cumpleBusqueda && cumpleTipo && cumpleProducto && cumpleFecha;
  });

  // Ordenar movimientos
  const sortedMovimientos = [...filteredMovimientos].sort((a, b) => {
    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];

    // Para fechas
    if (sortConfig.key === "FechaMovimiento" || sortConfig.key === "createdAt") {
      aValue = new Date(a.createdAt || a.FechaMovimiento);
      bValue = new Date(b.createdAt || b.FechaMovimiento);
    }

    // Para nombres de productos
    if (sortConfig.key === "Producto") {
      aValue = a.ProductosConsumible?.Nombre || "";
      bValue = b.ProductosConsumible?.Nombre || "";
    }

    if (aValue < bValue) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMovimientos = sortedMovimientos.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedMovimientos.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= Math.max(1, totalPages)) {
      setCurrentPage(pageNumber);
    }
  };

  const limpiarFiltros = () => {
    setSearchTerm("");
    setFiltroTipo("");
    setFiltroProducto("");
    setFiltroFechaInicio("");
    setFiltroFechaFin("");
    setCurrentPage(1);
  };

  const exportToPDF = async () => {
    try {
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

      const senaLogoBase64 = await getBase64FromUrl("/logosena.png");
      const doc = new jsPDF();

      doc.addImage(senaLogoBase64, "PNG", 15, 10, 30, 25);

      doc.setFontSize(22);
      doc.setTextColor(57, 181, 74);
      doc.setFont(undefined, "bold");
      doc.text("Inventario CTGI", 105, 25, { align: "center" });

      doc.setFontSize(18);
      doc.setTextColor(0, 0, 0);
      doc.setFont(undefined, "bold");
      doc.text("Historial de Movimientos", 15, 45);

      doc.setFontSize(12);
      doc.setFont(undefined, "bold");
      doc.text(`Fecha:`, 15, 55);
      doc.text(`Total:`, 15, 63);

      doc.setFont(undefined, "normal");
      doc.text(`${new Date().toLocaleDateString("es-ES")}`, 40, 55);
      doc.text(`${sortedMovimientos.length}`, 40, 63);

      const tableData = sortedMovimientos.map((mov) => [
        new Date(mov.createdAt || mov.FechaMovimiento).toLocaleDateString("es-ES"),
        mov.Producto?.Nombre || "N/A",
        mov.TipoMovimiento,
        mov.Cantidad,
        mov.Motivo || "Sin motivo",
        mov.Usuario || "Sistema",
      ]);

      autoTable(doc, {
        head: [["Fecha", "Producto", "Tipo", "Cantidad", "Motivo", "Usuario"]],
        body: tableData,
        startY: 75,
        styles: {
          fontSize: 8,
          cellPadding: 2,
        },
        headStyles: {
          fillColor: [57, 181, 74],
          textColor: 255,
          fontStyle: "bold",
        },
      });

      const fileName = `movimientos_consumibles_${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      doc.save(fileName);

      Swal.fire({
        icon: "success",
        title: "PDF generado",
        text: "El archivo PDF se ha descargado correctamente.",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error al generar PDF:", error);
      Swal.fire({
        icon: "error",
        title: "Error al generar PDF",
        text: `Error: ${error.message}`,
      });
    }
  };

  const exportToExcel = () => {
    try {
      const wsData = [
        ["Fecha", "Producto", "Tipo", "Cantidad", "Motivo", "Usuario"],
        ...sortedMovimientos.map((mov) => [
          new Date(mov.createdAt || mov.FechaMovimiento).toLocaleDateString("es-ES"),
          mov.Producto?.Nombre || "N/A",
          mov.TipoMovimiento,
          mov.Cantidad,
          mov.Motivo || "Sin motivo",
          mov.Usuario || "Sistema",
        ]),
      ];

      const worksheet = XLSX.utils.aoa_to_sheet(wsData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Movimientos");

      const fileName = `movimientos_consumibles_${
        new Date().toISOString().split("T")[0]
      }.xlsx`;
      XLSX.writeFile(workbook, fileName);

      Swal.fire({
        icon: "success",
        title: "Excel generado",
        text: "El archivo Excel se ha descargado correctamente.",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error al generar Excel:", error);
      Swal.fire({
        icon: "error",
        title: "Error al generar Excel",
        text: `Error: ${error.message}`,
      });
    }
  };

  return {
    movimientos,
    productos,
    showModalMovimiento,
    setShowModalMovimiento,
    productoSeleccionado,
    tipoMovimiento,
    setTipoMovimiento,
    cantidadMovimiento,
    setCantidadMovimiento,
    motivoMovimiento,
    setMotivoMovimiento,
    abrirModalMovimiento,
    realizarMovimiento,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    itemsPerPage,
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
    paginate,
    limpiarFiltros,
    exportToPDF,
    exportToExcel,
    indexOfFirstItem,
    indexOfLastItem,
  };
};

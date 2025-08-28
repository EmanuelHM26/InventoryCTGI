import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export const useRoles = () => {
  const [roles, setRoles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newRole, setNewRole] = useState({ IdRol: "", NombreRol: "" });

  // Estados para paginación y búsqueda
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "IdRol", direction: "ascending" });
  const itemsPerPage = 5;

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/roles", {
        withCredentials: true,
      });
      setRoles(response.data);
    } catch (error) {
      console.error("Error al obtener roles:", error);
    }
  };

  const handleCreateRole = async () => {
    try {
      if (!newRole.NombreRol.trim()) {
        await Swal.fire({
          icon: "warning",
          title: "Campo obligatorio",
          text: "El nombre del rol es obligatorio.",
          confirmButtonText: "Aceptar"
        });
        return;
      }

      if (newRole.IdRol) {
        await axios.put(
          `http://localhost:3000/api/roles/${newRole.IdRol}`,
          { NombreRol: newRole.NombreRol },
          { withCredentials: true }
        );
        await Swal.fire({
          icon: "success",
          title: "Rol actualizado",
          text: "El rol se actualizó correctamente.",
          confirmButtonText: "Aceptar"
        });
      } else {
        await axios.post(
          "http://localhost:3000/api/roles",
          { NombreRol: newRole.NombreRol },
          { withCredentials: true }
        );
        await Swal.fire({
          icon: "success",
          title: "Rol creado",
          text: "El rol se creó correctamente.",
          confirmButtonText: "Aceptar"
        });
      }
      setShowModal(false);
      setNewRole({ IdRol: "", NombreRol: "" });
      fetchRoles();
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: newRole.IdRol
          ? "Ocurrió un error al actualizar el rol."
          : "Ocurrió un error al crear el rol.",
        confirmButtonText: "Aceptar"
      });
      console.error(
        newRole.IdRol
          ? "Error al actualizar rol:"
          : "Error al crear rol:",
        error
      );
    }
  };

  const handleEditRole = (role) => {
    setNewRole(role);
    setShowModal(true);
  };

  const handleDeleteRole = async (id) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará el rol. ¿Deseas continuar?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:3000/api/roles/${id}`, {
          withCredentials: true,
        });
        fetchRoles();
        await Swal.fire({
          icon: "success",
          title: "Eliminado",
          text: "El rol fue eliminado correctamente.",
          confirmButtonText: "Aceptar"
        });
      } catch (error) {
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: "Ocurrió un error al eliminar el rol.",
          confirmButtonText: "Aceptar"
        });
        console.error("Error al eliminar rol:", error);
      }
    }
  };

  // Tabla y paginación
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const filteredRoles = roles.filter((role) => {
    return (
      role.NombreRol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.IdRol.toString().includes(searchTerm)
    );
  });

  const sortedRoles = [...filteredRoles].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRoles = sortedRoles.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedRoles.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const exportToPDF = async () => {
    try {
      if (!sortedRoles || !Array.isArray(sortedRoles) || sortedRoles.length === 0) {
        Swal.fire({ icon: 'info', title: 'Sin datos', text: 'No hay roles para exportar.' });
        return;
      }
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
      doc.text('Gestión de Roles', 15, 45);

      // --- FECHA Y TOTAL ---
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text(`Fecha:`, 15, 55);
      doc.text(`Total:`, 15, 63);

      doc.setFont(undefined, 'normal');
      doc.text(`${new Date().toLocaleDateString('es-ES')}`, 40, 55);
      doc.text(`${sortedRoles.length}`, 40, 63);

      // --- DESCRIPCIÓN ---
      doc.setFontSize(13);
      doc.setFont(undefined, 'bold');
      doc.text('Descripción:', 15, 73);
      doc.setFontSize(11);
      doc.setFont(undefined, 'normal');
      doc.text('Este reporte contiene la lista de roles registrados en el sistema, los cuales definen los permisos y accesos de los usuarios.', 15, 80, { maxWidth: 180 });

      // --- TABLA ---
      const tableData = sortedRoles.map(role => [
        String(role.IdRol || ''),
        role.NombreRol || ''
      ]);

      autoTable(doc, {
        head: [['ID', 'Nombre del Rol']],
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

      const fileName = `roles_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);

      Swal.fire({
        icon: 'success',
        title: 'PDF generado',
        text: 'El archivo PDF se ha descargado correctamente.',
        timer: 2000,
        showConfirmButton: false
      });

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error al generar PDF',
        text: error.message,
        showConfirmButton: true
      });
    }
  };

  const exportToExcel = () => {
    try {
      const wsData = [
        ['ID', 'Nombre del Rol'],
        ...sortedRoles.map(role => [
          role.IdRol || '',
          role.NombreRol || ''
        ])
      ];

      const worksheet = XLSX.utils.aoa_to_sheet(wsData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Roles");

      const fileName = `roles_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(workbook, fileName);

      Swal.fire({
        icon: 'success',
        title: 'Excel generado',
        text: 'El archivo Excel se ha descargado correctamente.',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error al generar Excel',
        text: error.message,
        showConfirmButton: true
      });
    }
  };

  return {
    roles,
    showModal,
    setShowModal,
    newRole,
    setNewRole,
    currentPage,
    setCurrentPage,
    searchTerm,
    setSearchTerm,
    sortConfig,
    setSortConfig,
    requestSort,
    sortedRoles,
    currentRoles,
    indexOfFirstItem,
    indexOfLastItem,
    totalPages,
    paginate,
    handleCreateRole,
    handleEditRole,
    handleDeleteRole,
    exportToPDF,
    exportToExcel,
    itemsPerPage
  };


};
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";

export const useReservas = () => {
  const [reservasFijas, setReservasFijas] = useState([]);
  const [reservasDiarias, setReservasDiarias] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [activeTab, setActiveTab] = useState("fijas");
  const [showModal, setShowModal] = useState(false);
  const [newReserva, setNewReserva] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "id",
    direction: "ascending",
  });
  const itemsPerPage = 8;
  const [barcodeMode, setBarcodeMode] = useState("user");
  const [scannedEquipment, setScannedEquipment] = useState([]);
  const [showBarcodeInstructions, setShowBarcodeInstructions] = useState(false);
  const [scanBuffer, setScanBuffer] = useState("");
  const scanTimeout = useRef(null);

  useEffect(() => {
    fetchReservasFijas();
    fetchReservasDiarias();
    fetchUsuarios();
  }, []);

  const fetchReservasFijas = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/reservasfijas",
        { withCredentials: true }
      );
      setReservasFijas(response.data);
    } catch (error) {
      console.error("Error al obtener reservas fijas:", error);
    }
  };

  const fetchReservasDiarias = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/reservas-diarias",
        { withCredentials: true }
      );
      setReservasDiarias(response.data);
    } catch (error) {
      console.error("Error al obtener reservas diarias:", error);
    }
  };

  const fetchUsuarios = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/usuarios", {
        withCredentials: true,
      });
      setUsuarios(response.data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };

  const handleCreateReserva = async () => {
    try {
      if (activeTab === "fijas") {
        if (
          !newReserva.nombrePrograma ||
          !newReserva.ficha ||
          !newReserva.materialReservado
        ) {
          alert("Por favor, completa todos los campos de la reserva fija.");
          return;
        }
        const endpoint = "http://localhost:3000/api/reservasfijas";
        const reservaFija = {
          ...newReserva,
          Estado: "Disponible",
        };
        if (newReserva.idReservaFija) {
          await axios.put(
            `${endpoint}/${newReserva.idReservaFija}`,
            reservaFija,
            { withCredentials: true }
          );
        } else {
          await axios.post(endpoint, reservaFija, { withCredentials: true });
        }
        fetchReservasFijas();
      } else {
        const { IdUsuario, ficha, materialReservado, fecha } = newReserva;
        if (!IdUsuario || !ficha || !materialReservado || !fecha) {
          alert("Por favor, completa todos los campos de la reserva diaria.");
          return;
        }
        const endpoint = "http://localhost:3000/api/reservas-diarias";
        let fechaFormateada = fecha;
        if (fecha && fecha.includes("/")) {
          const [dia, mes, anio] = fecha.split("/");
          if (dia && mes && anio) {
            fechaFormateada = `${anio}-${mes.padStart(2, "0")}-${dia.padStart(
              2,
              "0"
            )}`;
          } else {
            fechaFormateada = "";
          }
        }
        const reservaData = {
          ...newReserva,
          fecha: fechaFormateada,
          materialesEscaneados: scannedEquipment,
        };
        if (newReserva.idReservaDiaria) {
          await axios.put(
            `${endpoint}/${newReserva.idReservaDiaria}`,
            newReserva,
            { withCredentials: true }
          );
        } else {
          await axios.post(endpoint, reservaData, { withCredentials: true });
        }
        fetchReservasDiarias();
      }
      setShowModal(false);
      setNewReserva({});
      setScannedEquipment([]);
      setScanBuffer("");
      setBarcodeMode("user");
      setShowBarcodeInstructions(false);
    } catch (error) {
      console.error("Error al procesar reserva:", error);
      alert(
        "Error al procesar reserva: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleEditReserva = (reserva) => {
    setNewReserva(reserva);
    setShowModal(true);
  };

  const handleDeleteReserva = async (id) => {
    if (activeTab === "fijas") {
      Swal.fire({
        title: "¿Estás seguro?",
        text: "¡Esta acción no se puede deshacer!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await axios.delete(
              `http://localhost:3000/api/reservasfijas/${id}`,
              { withCredentials: true }
            );
            fetchReservasFijas();
            Swal.fire(
              "¡Eliminado!",
              "La reserva fija ha sido eliminada.",
              "success"
            );
          } catch {
            Swal.fire("Error", "No se pudo eliminar la reserva fija.", "error");
          }
        }
      });
    } else {
      Swal.fire({
        title: "¿Estás seguro?",
        text: "¡Esta acción no se puede deshacer!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await axios.delete(
              `http://localhost:3000/api/reservas-diarias/${id}`,
              { withCredentials: true }
            );
            fetchReservasDiarias();
            Swal.fire(
              "¡Eliminado!",
              "La reserva diaria ha sido eliminada.",
              "success"
            );
          } catch {
            Swal.fire(
              "Error",
              "No se pudo eliminar la reserva diaria.",
              "error"
            );
          }
        }
      });
    }
  };

  const handleCheckReservaFija = async (reserva) => {
    const nuevoEstado =
      reserva.Estado === "Disponible" ? "Asignado" : "Disponible";
    Swal.fire({
      title: "¿Estás seguro?",
      text: `¿Quieres cambiar el estado a "${nuevoEstado}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, cambiar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.put(
            `http://localhost:3000/api/reservasfijas/${reserva.idReservaFija}`,
            { ...reserva, Estado: nuevoEstado },
            { withCredentials: true }
          );
          fetchReservasFijas();
          Swal.fire(
            "¡Actualizado!",
            `La reserva ahora está como "${nuevoEstado}".`,
            "success"
          );
        } catch (error) {
          Swal.fire("Error", "No se pudo cambiar el estado.", "error");
          console.error(error);
        }
      }
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      const [year, month, day] = dateString.split("-");
      return `${day}/${month}/${year}`;
    }
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getCurrentData = () => {
    return activeTab === "fijas" ? reservasFijas : reservasDiarias;
  };

  const filteredReservas = getCurrentData().filter((reserva) => {
    const searchTermLower = searchTerm.toLowerCase();
    if (activeTab === "fijas") {
      if (!isNaN(searchTerm) && searchTerm.trim() !== "") {
        return reserva.idReservaFija?.toString() === searchTerm.trim();
      }
      return (
        (reserva.nombrePrograma &&
          reserva.nombrePrograma.toLowerCase().includes(searchTermLower)) ||
        (reserva.ficha &&
          reserva.ficha.toLowerCase().includes(searchTermLower)) ||
        (reserva.materialReservado &&
          reserva.materialReservado.toLowerCase().includes(searchTermLower)) ||
        (reserva.Estado &&
          reserva.Estado.toLowerCase().includes(searchTermLower))
      );
    } else {
      if (!isNaN(searchTerm) && searchTerm.trim() !== "") {
        return reserva.idReservaDiaria?.toString() === searchTerm.trim();
      }
      const usuario = reserva.Usuario?.Usuario?.toLowerCase() || "";
      return (
        usuario.includes(searchTermLower) ||
        (reserva.ficha &&
          reserva.ficha.toLowerCase().includes(searchTermLower)) ||
        (reserva.materialReservado &&
          reserva.materialReservado.toLowerCase().includes(searchTermLower)) ||
        (reserva.fecha && formatDate(reserva.fecha).includes(searchTerm))
      );
    }
  });

  const sortedReservas = [...filteredReservas].sort((a, b) => {
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
  const currentReservas = sortedReservas.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(sortedReservas.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSearchTerm("");
    setNewReserva({});
    setBarcodeMode("user");
    setScannedEquipment([]);
    setShowBarcodeInstructions(false);
  };

  // Escucha global de teclado SOLO cuando el modal está abierto y hay modo de escaneo
  useEffect(() => {
    if (!showModal) return;
    if (barcodeMode !== "user") return;

    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        if (scanBuffer.length > 0) {
          handleScan(scanBuffer);
          setScanBuffer("");
        }
      } else if (/^[a-zA-Z0-9]$/.test(e.key)) {
        setScanBuffer((prev) => prev + e.key);
        clearTimeout(scanTimeout.current);
        scanTimeout.current = setTimeout(() => setScanBuffer(""), 500);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(scanTimeout.current);
    };
  }, [showModal, barcodeMode, scanBuffer]);

  // Procesar código escaneado
  const handleScan = (codigo) => {
    if (barcodeMode === "user") {
      const usuarioEncontrado = usuarios.find(
        (u) => String(u.NumeroDocumento) === codigo
      );
      if (usuarioEncontrado) {
        setNewReserva({
          ...newReserva,
          IdUsuario: usuarioEncontrado.IdUsuario,
        });
        setBarcodeMode("equipment");
        setShowBarcodeInstructions(true);
        setTimeout(() => setShowBarcodeInstructions(false), 2000);
      } else {
        alert("Usuario no encontrado");
      }
    } else if (barcodeMode === "equipment") {
      const existingEquipment = scannedEquipment.find(
        (eq) => eq.code === codigo
      );
      let nuevosEquipos;
      if (existingEquipment) {
        nuevosEquipos = scannedEquipment.map((eq) =>
          eq.code === codigo ? { ...eq, quantity: eq.quantity + 1 } : eq
        );
      } else {
        nuevosEquipos = [...scannedEquipment, { code: codigo, quantity: 1 }];
      }
      setScannedEquipment(nuevosEquipos);
      setNewReserva((prev) => ({
        ...prev,
        materialReservado: nuevosEquipos
          .map((eq) => `${eq.code} (x${eq.quantity})`)
          .join(", "),
      }));
    }
  };

  // Para el BarcodeReader (por compatibilidad)
  const handleBarcodeScan = (scannedCode) => {
    if (!showModal) return;
    if (barcodeMode === "user") {
      const usuario = usuarios.find(
        (u) => String(u.NumeroDocumento).trim() === String(scannedCode).trim()
      );
      if (usuario) {
        setNewReserva({
          ...newReserva,
          IdUsuario: usuario.IdUsuario,
        });
        setBarcodeMode("equipment");
        setShowBarcodeInstructions(true);
        setTimeout(() => setShowBarcodeInstructions(false), 2000);
      } else {
        setShowBarcodeInstructions(true);
        setTimeout(() => setShowBarcodeInstructions(false), 2000);
      }
    } else if (barcodeMode === "equipment") {
      const existingEquipment = scannedEquipment.find(
        (eq) => eq.code === scannedCode
      );
      let nuevosEquipos;
      if (existingEquipment) {
        nuevosEquipos = scannedEquipment.map((eq) =>
          eq.code === scannedCode ? { ...eq, quantity: eq.quantity + 1 } : eq
        );
      } else {
        nuevosEquipos = [
          ...scannedEquipment,
          { code: scannedCode, quantity: 1 },
        ];
      }
      setScannedEquipment(nuevosEquipos);
      const totalQuantity = nuevosEquipos.reduce(
        (sum, eq) => sum + eq.quantity,
        0
      );
      setNewReserva({
        ...newReserva,
        Cantidad: totalQuantity.toString(),
      });
    }
  };

  const getTableHeaders = () => {
    if (activeTab === "fijas") {
      return [
        "ID",
        "Nombre Programa",
        "Ficha",
        "Material Reservado",
        "Estado",
        "Acciones",
      ];
    } else {
      return [
        "ID",
        "Usuario",
        "Ficha",
        "Material Reservado",
        "Fecha",
        "Acciones",
      ];
    }
  };

  // Exportar a PDF
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
      doc.text(
        activeTab === "fijas" ? "Reservas Fijas" : "Reservas Diarias",
        15,
        45
      );

      doc.setFontSize(12);
      doc.setFont(undefined, "bold");
      doc.text(`Fecha:`, 15, 55);
      doc.text(`Total:`, 15, 63);

      doc.setFont(undefined, "normal");
      doc.text(`${new Date().toLocaleDateString("es-ES")}`, 40, 55);
      doc.text(`${sortedReservas.length}`, 40, 63);

      doc.setFontSize(13);
      doc.setFont(undefined, "bold");
      doc.text("Descripción:", 15, 73);
      doc.setFontSize(11);
      doc.setFont(undefined, "normal");
      doc.text(
        activeTab === "fijas"
          ? "Este reporte contiene la lista de reservas fijas de materiales, incluyendo programa, ficha, material y estado."
          : "Este reporte contiene la lista de reservas diarias de materiales, incluyendo usuario, ficha, material y fecha.",
        15,
        80,
        { maxWidth: 180 }
      );

      let tableData, head;
      if (activeTab === "fijas") {
        head = [
          ["ID", "Nombre Programa", "Ficha", "Material Reservado", "Estado"],
        ];
        tableData = sortedReservas.map((reserva) => [
          reserva.idReservaFija || "",
          reserva.nombrePrograma || "",
          reserva.ficha || "",
          reserva.materialReservado || "",
          reserva.Estado || "",
        ]);
      } else {
        head = [["ID", "Usuario", "Ficha", "Material Reservado", "Fecha"]];
        tableData = sortedReservas.map((reserva) => [
          reserva.idReservaDiaria || "",
          reserva.Usuario?.Usuario || "",
          reserva.ficha || "",
          reserva.materialReservado || "",
          reserva.fecha
            ? new Date(reserva.fecha).toLocaleDateString("es-ES")
            : "",
        ]);
      }

      autoTable(doc, {
        head,
        body: tableData,
        startY: 90,
        styles: {
          fontSize: 9,
          cellPadding: 2,
        },
        headStyles: {
          fillColor: [57, 181, 74],
          textColor: 255,
          fontStyle: "bold",
        },
      });

      const fileName = `reservas_${activeTab}_${
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
      Swal.fire({
        icon: "error",
        title: "Error al generar PDF",
        text: error.message,
        showConfirmButton: true,
      });
    }
  };

  // Exportar a Excel
  const exportToExcel = () => {
    try {
      let wsData;
      if (activeTab === "fijas") {
        wsData = [
          ["ID", "Nombre Programa", "Ficha", "Material Reservado", "Estado"],
          ...sortedReservas.map((reserva) => [
            reserva.idReservaFija || "",
            reserva.nombrePrograma || "",
            reserva.ficha || "",
            reserva.materialReservado || "",
            reserva.Estado || "",
          ]),
        ];
      } else {
        wsData = [
          ["ID", "Usuario", "Ficha", "Material Reservado", "Fecha"],
          ...sortedReservas.map((reserva) => [
            reserva.idReservaDiaria || "",
            reserva.Usuario?.Usuario || "",
            reserva.ficha || "",
            reserva.materialReservado || "",
            reserva.fecha
              ? new Date(reserva.fecha).toLocaleDateString("es-ES")
              : "",
          ]),
        ];
      }

      const worksheet = XLSX.utils.aoa_to_sheet(wsData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        activeTab === "fijas" ? "ReservasFijas" : "ReservasDiarias"
      );

      const fileName = `reservas_${activeTab}_${
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
      Swal.fire({
        icon: "error",
        title: "Error al generar Excel",
        text: error.message,
        showConfirmButton: true,
      });
    }
  };

  return {
    reservasFijas,
    reservasDiarias,
    usuarios,
    activeTab,
    setActiveTab,
    showModal,
    setShowModal,
    newReserva,
    setNewReserva,
    currentPage,
    setCurrentPage,
    searchTerm,
    setSearchTerm,
    sortConfig,
    setSortConfig,
    barcodeMode,
    setBarcodeMode,
    scannedEquipment,
    setScannedEquipment,
    showBarcodeInstructions,
    setShowBarcodeInstructions,
    scanBuffer,
    setScanBuffer,
    fetchReservasFijas,
    fetchReservasDiarias,
    fetchUsuarios,
    handleCreateReserva,
    handleEditReserva,
    handleDeleteReserva,
    handleCheckReservaFija,
    formatDate,
    requestSort,
    getCurrentData,
    filteredReservas,
    sortedReservas,
    indexOfFirstItem,
    indexOfLastItem,
    currentReservas,
    totalPages,
    paginate,
    handleTabChange,
    handleScan,
    handleBarcodeScan,
    getTableHeaders,
    exportToPDF,
    exportToExcel,
  };
};

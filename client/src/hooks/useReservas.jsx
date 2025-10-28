import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";

export const useReservas = () => {

  // Aquí se guardan las reservas fijas.
  const [reservasFijas, setReservasFijas] = useState([]);

  // Aquí se guardan las reservas diarias.
  const [reservasDiarias, setReservasDiarias] = useState([]);

  // Aquí se guardan los usuarios que hacen reservas.
  const [usuarios, setUsuarios] = useState([]);
  // Nuevos estados agregados:
  const [equiposTecnologicos, setEquiposTecnologicos] = useState([]);
  const [showEquiposModal, setShowEquiposModal] = useState(false);
  const [selectedReservaEquipos, setSelectedReservaEquipos] = useState(null);

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

  // Estados para el escaneo de códigos de barras
  const [barcodeMode, setBarcodeMode] = useState("user");

  // "user" para escanear usuario, "equipment" para escanear equipos
  const [scannedEquipment, setScannedEquipment] = useState([]);
  const [showBarcodeInstructions, setShowBarcodeInstructions] = useState(false);
  const [scanBuffer, setScanBuffer] = useState("");
  const scanTimeout = useRef(null);
  const [inputErrors, setInputErrors] = useState({});
  const [ambientes, setAmbientes] = useState([]);

  useEffect(() => {
    fetchReservasFijas();
    fetchReservasDiarias();
    fetchUsuarios();
    fetchEquiposTecnologicos();
    fetchAmbientes();
  }, []);

  const fetchAmbientes = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/ambientes", {
      withCredentials: true,
    });
    setAmbientes(response.data);
  } catch (error) {
    console.error("Error al obtener ambientes:", error);
  }
};

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


  // fetchReservasDiarias sirve para obtener las reservas diarias desde el backend.
  // Hace una petición GET a la API y actualiza el estado reservasDiarias con los datos recibidos.
  // Si hay un error, lo registra en la consola.
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


// fetchUsuarios sirve para obtener los usuarios desde el backend.
// Hace una petición GET a la API y actualiza el estado usuarios con los datos recibidos.
// Si hay un error, lo registra en la consola.
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


// fetchEquiposTecnologicos sirve para obtener los equipos tecnológicos desde el backend.
// Hace una petición GET a la API y actualiza el estado equiposTecnologicos con los datos recibidos.
// Si hay un error, lo registra en la consola.
  const fetchEquiposTecnologicos = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/equipostecnologicos",
        { withCredentials: true }
      );
      setEquiposTecnologicos(response.data);
    } catch (error) {
      console.error("Error al obtener equipos tecnológicos:", error);
    }
  };
  

  
// handleCreateReserva maneja la creación o edición de una reserva.

  const handleCreateReserva = async () => {
    try {
      console.log("handleCreateReserva called", { activeTab, newReserva, scannedEquipment });
      // Limpiar errores previos
      setInputErrors({});
      let errors = {};

      if (activeTab === "fijas") {
        // VALIDACIONES PARA RESERVAS FIJAS
  //nombreRegex permite letras (incluye acentos) y espacios
  //fichaRegex permite solo números
  const nombreRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/;
        const fichaRegex = /^[0-9]+$/;

        // Validar nombre programa
        if (!newReserva.nombrePrograma?.trim()) {
          errors.nombrePrograma = "El nombre del programa es requerido";
        } else if (!nombreRegex.test(newReserva.nombrePrograma.trim())) {
          errors.nombrePrograma =
            "Solo se permiten letras (A-Z, a-z) sin espacios ni caracteres especiales";
        }

        // La ficha para reservas diarias es opcional en la UI — si se provee, validar formato
        if (newReserva.ficha && newReserva.ficha.trim() !== "") {
          if (!fichaRegex.test(newReserva.ficha.trim())) {
            errors.ficha = "Solo se permiten números";
          }
        }

        // Validar material reservado (permitir letras acentuadas, números, espacios, comas, apóstrofos y guiones)
        if (!newReserva.materialReservado?.trim()) {
          errors.materialReservado = "El material reservado es requerido";
        } else {
          const materialRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü0-9\s,'" -]+$/;
          if (!materialRegex.test(newReserva.materialReservado.trim())) {
            errors.materialReservado =
              "Solo se permiten letras, números, espacios y los caracteres , ' \" -";
          }
        }

        // Si hay errores, mostrarlos y no continuar
        if (Object.keys(errors).length > 0) {
          setInputErrors(errors);
          // Mostrar un resumen visible al usuario para evitar que parezca que no hace nada
          const listHtml = Object.values(errors)
            .filter(Boolean)
            .map((m) => `<li>${m}</li>`)
            .join("");
          Swal.fire({
            icon: "error",
            title: "Errores en el formulario",
            html: `<ul style='text-align:left'>${listHtml}</ul>`,
            confirmButtonColor: "#3085d6",
          });
          return;
        }

        const endpoint = "http://localhost:3000/api/reservasfijas";
        const reservaFija = {
          ...newReserva,
          nombrePrograma: newReserva.nombrePrograma.trim(),
          ficha: newReserva.ficha.trim(),
          materialReservado: newReserva.materialReservado.trim(),
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
        // VALIDACIONES PARA RESERVAS DIARIAS
        const fichaRegex = /^[0-9]+$/;

        // Validar usuario
        if (!newReserva.IdUsuario) {
          errors.IdUsuario = "Debe seleccionar un usuario";
        }

        // Validar ambiente (se agregó la validación solicitada)
        if (!newReserva.IdAmbiente) {
          errors.IdAmbiente = "Debe seleccionar un ambiente";
        }

        // La ficha para reservas diarias es opcional — si se provee, validar formato
        if (newReserva.ficha && newReserva.ficha.trim() !== "") {
          if (!fichaRegex.test(newReserva.ficha.trim())) {
            errors.ficha = "Solo se permiten números";
          }
        }

        // Validar material reservado (debe haber al menos un equipo escaneado)
        if (scannedEquipment.length === 0) {
          errors.materialReservado = "Debe escanear al menos un equipo";
        }

        // Validar fecha
        if (!newReserva.fecha) {
          errors.fecha = "La fecha es requerida";
        } else {
          const fechaSeleccionada = new Date(newReserva.fecha);
          const fechaHoy = new Date();
          fechaHoy.setHours(0, 0, 0, 0);

          if (fechaSeleccionada < fechaHoy) {
            errors.fecha = "No se pueden seleccionar fechas pasadas";
          }
        }

        // Si hay errores, mostrarlos y no continuar
        if (Object.keys(errors).length > 0) {
          setInputErrors(errors);
          const listHtml = Object.values(errors)
            .filter(Boolean)
            .map((m) => `<li>${m}</li>`)
            .join("");
          Swal.fire({
            icon: "error",
            title: "Errores en el formulario",
            html: `<ul style='text-align:left'>${listHtml}</ul>`,
            confirmButtonColor: "#3085d6",
          });
          return;
        }

        const endpoint = "http://localhost:3000/api/reservas-diarias";
        let fechaFormateada = newReserva.fecha;
        if (newReserva.fecha && newReserva.fecha.includes("/")) {
          const [dia, mes, anio] = newReserva.fecha.split("/");
          if (dia && mes && anio) {
            fechaFormateada = `${anio}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
          }
        }

        // CAMBIO PRINCIPAL: Preparar datos con los equipos escaneados
        const equiposParaEnviar = scannedEquipment.map(eq => ({
          codigo: eq.code,
          idequipostecnologicos: eq.equipo.idequipostecnologicos,
          quantity: eq.quantity
        }));

        const reservaData = {
          IdUsuario: newReserva.IdUsuario,
          IdAmbiente: newReserva.IdAmbiente, // incluir ambiente seleccionado
          materialReservado: newReserva.materialReservado || scannedEquipment.map(eq => eq.code).join(', '),
          fecha: fechaFormateada,
          equiposEscaneados: equiposParaEnviar, // Enviar los equipos con sus IDs
        };
        // Incluir ficha solo si se proporcionó
        if (newReserva.ficha && newReserva.ficha.trim() !== "") {
          reservaData.ficha = newReserva.ficha.trim();
        }

        if (newReserva.idReservaDiaria) {
          await axios.put(
            `${endpoint}/${newReserva.idReservaDiaria}`,
            reservaData,
            { withCredentials: true }
          );
        } else {
          await axios.post(endpoint, reservaData, { withCredentials: true });
        }
        fetchReservasDiarias();
      }

      // Si llegamos aquí, todo salió bien
      setShowModal(false);
      setNewReserva({});
      setScannedEquipment([]);
      setScanBuffer("");
      setBarcodeMode("user");
      setShowBarcodeInstructions(false);
      setInputErrors({});
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

const handleScan = useCallback((codigo) => {
  if (barcodeMode === "user") {
    const usuarioEncontrado = usuarios.find(
      (u) => String(u.NumeroDocumento) === codigo
    );
    if (usuarioEncontrado) {
      setNewReserva((prev) => ({
        ...prev,
        IdUsuario: usuarioEncontrado.IdUsuario,
      }));
      setBarcodeMode("equipment");
      setShowBarcodeInstructions(true);
      setTimeout(() => setShowBarcodeInstructions(false), 2000);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Usuario no encontrado',
        text: `No se encontró un usuario con el documento: ${codigo}`,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Entendido',
        timer: 3000,
        timerProgressBar: true,
      });
    }
  } else if (barcodeMode === "equipment") {
    const equipoEncontrado = equiposTecnologicos.find(
      (equipo) => equipo.Codigo === codigo
    );

    if (equipoEncontrado) {
      const existingEquipment = scannedEquipment.find(
        (eq) => eq.code === codigo
      );
      let nuevosEquipos;
      if (existingEquipment) {
        nuevosEquipos = scannedEquipment.map((eq) =>
          eq.code === codigo
            ? { ...eq, quantity: eq.quantity + 1 }
            : eq
        );
      } else {
        nuevosEquipos = [
          ...scannedEquipment,
          {
            code: codigo,
            quantity: 1,
            equipo: equipoEncontrado,
          },
        ];
      }
      setScannedEquipment(nuevosEquipos);

      const codigosEscaneados = nuevosEquipos.map(eq => eq.code).join(', ');
      setNewReserva((prev) => ({
        ...prev,
        materialReservado: codigosEscaneados,
      }));
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Equipo no encontrado',
        html: `
          <div class="text-center">
            <p class="text-gray-700 mb-2">
              El equipo con código 
            </p>
            <p class="font-bold text-lg text-blue-600 mb-2">
              "${codigo}"
            </p>
            <p class="text-gray-600">
              no se encuentra registrado en el inventario.
            </p>
          </div>
        `,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Entendido',
        timer: 4000,
        timerProgressBar: true,
        footer: '<span class="text-sm text-gray-500">💡 Verifique el código e intente nuevamente</span>'
      });
    }
  }
}, [barcodeMode, usuarios, equiposTecnologicos, scannedEquipment]);

  // Escucha global de teclado SOLO cuando el modal está abierto y hay modo de escaneo
  useEffect(() => {
    if (!showModal) return;

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
  }, [showModal, barcodeMode, scanBuffer, handleScan]);
 
      
      

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
      Swal.fire({
        icon: 'error',
        title: 'Usuario no encontrado',
        text: `No se encontró un usuario con el documento: ${scannedCode}`,
        confirmButtonColor: '#3085d6',
      });
    }
  } else if (barcodeMode === "equipment") {
    const equipoEncontrado = equiposTecnologicos.find(
      (equipo) => String(equipo.Codigo).trim() === String(scannedCode).trim()
    );

    if (equipoEncontrado) {
      const existingEquipment = scannedEquipment.find(
        (eq) => String(eq.code).trim() === String(scannedCode).trim()
      );
      let nuevosEquipos;
      if (existingEquipment) {
        nuevosEquipos = scannedEquipment.map((eq) =>
          String(eq.code).trim() === String(scannedCode).trim() ? { ...eq, quantity: eq.quantity + 1 } : eq
        );
      } else {
        nuevosEquipos = [
          ...scannedEquipment,
          { 
            code: scannedCode.trim(), 
            quantity: 1,
            equipo: equipoEncontrado
          },
        ];
      }
      setScannedEquipment(nuevosEquipos);
      
      const codigosEscaneados = nuevosEquipos.map(eq => eq.code).join(', ');
      setNewReserva({
        ...newReserva,
        materialReservado: codigosEscaneados,
      });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Equipo no encontrado',
        html: `<p>El equipo con código <strong>"${scannedCode}"</strong> no se encuentra en el inventario.</p>`,
        confirmButtonColor: '#3085d6',
      });
    }
  }
};
  const getTableHeaders = () => {
    if (activeTab === "fijas") {
      return [
        "ID",
        "Nombre Programa",
        "Ficha",
        "Estado",
        "Acciones",
      ];
    } else {
      return [
        "ID",
          "Nombre",
          "Número de documento",
          "Ambiente",
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
  head = [["ID", "Nombre", "Número de documento", "Ficha", "Ambiente", "Material Reservado", "Fecha"]];
        tableData = sortedReservas.map((reserva) => [
          reserva.idReservaDiaria || "",
          reserva.Usuario ? `${reserva.Usuario.Nombre} ${reserva.Usuario.Apellido}` : "",
          reserva.Usuario?.NumeroDocumento || "",
          reserva.ficha || "",
          reserva.Ambiente?.nombre || "",
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
          ["ID", "Nombre", "Número de documento", "Ficha", "Ambiente", "Material Reservado", "Fecha"],
          ...sortedReservas.map((reserva) => [
            reserva.idReservaDiaria || "",
            reserva.Usuario ? `${reserva.Usuario.Nombre} ${reserva.Usuario.Apellido}` : "",
            reserva.Usuario?.NumeroDocumento || "",
            reserva.ficha || "",
            reserva.Ambiente?.nombre || "",
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

  const handleShowEquipos = async (reserva) => {
    // Conseguir la información detallada de cada equipo
    let equiposInfo = [];
    if (reserva.materialReservado) {
      const codigoEquipos = reserva.materialReservado.split(',').map(c => c.trim());
      equiposInfo = equiposTecnologicos.filter(eq => codigoEquipos.includes(eq.Codigo));
    }

    // Determinar si es una reserva fija o diaria para el ID correcto
    const reservaConInfo = {
      ...reserva,
      equiposInfo,
      // Si tiene idReservaFija es una reserva fija, si no, usa idReservaDiaria
      id: reserva.idReservaFija || reserva.idReservaDiaria,
      tipo: reserva.idReservaFija ? 'fija' : 'diaria'
    };

    setSelectedReservaEquipos(reservaConInfo);
    setShowEquiposModal(true);
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
    inputErrors,
    setInputErrors,
    equiposTecnologicos,
    showEquiposModal,
    setShowEquiposModal,
    selectedReservaEquipos,
    handleShowEquipos,
    fetchEquiposTecnologicos,
    ambientes,
    fetchAmbientes,
  };
};

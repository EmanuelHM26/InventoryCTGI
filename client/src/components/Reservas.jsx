import React, { useState, useEffect, useRef } from "react";
import BarcodeReader from "./BarcodeReader";
import axios from "axios";
import {
  Search,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Check,
  Eye,
} from "lucide-react";

const Reservas = () => {
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
  const [barcodeMode, setBarcodeMode] = useState('user'); // 'user' o 'equipment'
  const [scannedEquipment, setScannedEquipment] = useState([]);
  const [showBarcodeInstructions, setShowBarcodeInstructions] = useState(false);
  const [scanBuffer, setScanBuffer] = useState(""); // Para acumular el código escaneado
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
      const response = await axios.get(
        "http://localhost:3000/api/usuarios",
        { withCredentials: true }
      );
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
        if (
          !newReserva.IdUsuario ||
          !newReserva.ficha ||
          !newReserva.materialReservado ||
          !newReserva.fecha
        ) {
          alert("Por favor, completa todos los campos de la reserva diaria.");
          return;
        }
        const endpoint = "http://localhost:3000/api/reservas-diarias";
        if (newReserva.idReservaDiaria) {
          await axios.put(
            `${endpoint}/${newReserva.idReservaDiaria}`,
            newReserva,
            { withCredentials: true }
          );
        } else {
          await axios.post(endpoint, newReserva, { withCredentials: true });
        }
        fetchReservasDiarias();
      }
      setShowModal(false);
      setNewReserva({});
      setBarcodeMode('user');
      setScannedEquipment([]);
      setShowBarcodeInstructions(false);
    } catch (error) {
      console.error("Error al procesar reserva:", error);
      alert("Error al procesar reserva: " + (error.response?.data?.message || error.message));
    }
  };

  const handleEditReserva = (reserva) => {
    setNewReserva(reserva);
    setShowModal(true);
  };

  const handleDeleteReserva = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta reserva?")) {
      try {
        if (activeTab === "fijas") {
          await axios.delete(
            `http://localhost:3000/api/reservasfijas/${id}`,
            { withCredentials: true }
          );
          fetchReservasFijas();
        } else {
          await axios.delete(
            `http://localhost:3000/api/reservas-diarias/${id}`,
            { withCredentials: true }
          );
          fetchReservasDiarias();
        }
      } catch (error) {
        console.error("Error al eliminar reserva:", error);
      }
    }
  };

  // Alterna el estado entre Disponible y Asignado
  const handleCheckReservaFija = async (reserva) => {
    try {
      const nuevoEstado = reserva.Estado === "Disponible" ? "Asignado" : "Disponible";
      await axios.put(
        `http://localhost:3000/api/reservasfijas/${reserva.idReservaFija}`,
        { ...reserva, Estado: nuevoEstado },
        { withCredentials: true }
      );
      fetchReservasFijas();
    } catch (error) {
      alert("No se pudo cambiar el estado.");
      console.error(error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
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
        (reserva.nombrePrograma && reserva.nombrePrograma.toLowerCase().includes(searchTermLower)) ||
        (reserva.ficha && reserva.ficha.toLowerCase().includes(searchTermLower)) ||
        (reserva.materialReservado && reserva.materialReservado.toLowerCase().includes(searchTermLower)) ||
        (reserva.Estado && reserva.Estado.toLowerCase().includes(searchTermLower))
      );
    } else {
      if (!isNaN(searchTerm) && searchTerm.trim() !== "") {
        return reserva.idReservaDiaria?.toString() === searchTerm.trim();
      }
      const usuario = reserva.Usuario?.Usuario?.toLowerCase() || "";
      return (
        usuario.includes(searchTermLower) ||
        (reserva.ficha && reserva.ficha.toLowerCase().includes(searchTermLower)) ||
        (reserva.materialReservado && reserva.materialReservado.toLowerCase().includes(searchTermLower)) ||
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
  const currentReservas = sortedReservas.slice(indexOfFirstItem, indexOfLastItem);
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
    setBarcodeMode('user');
    setScannedEquipment([]);
    setShowBarcodeInstructions(false);
  };

  const getTableHeaders = () => {
    if (activeTab === "fijas") {
      return ["ID", "Nombre Programa", "Ficha", "Material Reservado", "Estado", "Acciones"];
    } else {
      return ["ID", "Usuario", "Ficha", "Material Reservado", "Fecha", "Acciones"];
    }
  };

  // Escucha global de teclado SOLO cuando el modal está abierto y hay modo de escaneo
  useEffect(() => {
    if (!showModal || !barcodeMode) return;

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

  // Función para procesar el código escaneado
  const handleScan = (codigo) => {
    if (barcodeMode === "user") {
      const usuarioEncontrado = usuarios.find(u => String(u.NumeroDocumento) === codigo);
      if (usuarioEncontrado) {
        setNewReserva({
          ...newReserva,
          IdUsuario: usuarioEncontrado.IdUsuario
        });
        setBarcodeMode('equipment');
        setShowBarcodeInstructions(true);
        setTimeout(() => setShowBarcodeInstructions(false), 2000);
      } else {
        alert("Usuario no encontrado");
      }
    } else if (barcodeMode === "equipment") {
      const existingEquipment = scannedEquipment.find(eq => eq.code === codigo);
      let nuevosEquipos;
      if (existingEquipment) {
        nuevosEquipos = scannedEquipment.map(eq =>
          eq.code === codigo
            ? { ...eq, quantity: eq.quantity + 1 }
            : eq
        );
      } else {
        nuevosEquipos = [...scannedEquipment, { code: codigo, quantity: 1 }];
      }
      setScannedEquipment(nuevosEquipos);
      setNewReserva({
        ...newReserva,
        materialReservado: nuevosEquipos.map(eq => eq.code).join(", "),
        cantidadMaterial: nuevosEquipos.reduce((sum, eq) => sum + eq.quantity, 0)
      });
    }
  };

  // Para el BarcodeReader (por compatibilidad)
  const handleBarcodeScan = (scannedCode) => {
    if (!showModal) return;
    if (barcodeMode === 'user') {
      const usuario = usuarios.find(
        u => String(u.NumeroDocumento).trim() === String(scannedCode).trim()
      );
      if (usuario) {
        setNewReserva({
          ...newReserva,
          IdUsuario: usuario.IdUsuario
        });
        setBarcodeMode('equipment');
        setShowBarcodeInstructions(true);
        setTimeout(() => setShowBarcodeInstructions(false), 2000);
      } else {
        setShowBarcodeInstructions(true);
        setTimeout(() => setShowBarcodeInstructions(false), 2000);
      }
    } else if (barcodeMode === 'equipment') {
      const existingEquipment = scannedEquipment.find(eq => eq.code === scannedCode);
      let nuevosEquipos;
      if (existingEquipment) {
        nuevosEquipos = scannedEquipment.map(eq =>
          eq.code === scannedCode
            ? { ...eq, quantity: eq.quantity + 1 }
            : eq
        );
      } else {
        nuevosEquipos = [...scannedEquipment, { code: scannedCode, quantity: 1 }];
      }
      setScannedEquipment(nuevosEquipos);
      const totalQuantity = nuevosEquipos.reduce((sum, eq) => sum + eq.quantity, 0);
      setNewReserva({
        ...newReserva,
        Cantidad: totalQuantity.toString()
      });
    }
  };

  const getFormFields = () => {
    if (activeTab === "fijas") {
      return (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Programa
            </label>
            <input
              type="text"
              value={newReserva.nombrePrograma || ""}
              onChange={(e) =>
                setNewReserva({
                  ...newReserva,
                  nombrePrograma: e.target.value,
                })
              }
              className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ficha
            </label>
            <input
              type="text"
              value={newReserva.ficha || ""}
              onChange={(e) =>
                setNewReserva({
                  ...newReserva,
                  ficha: e.target.value,
                })
              }
              className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Material Reservado
            </label>
            <input
              type="text"
              value={newReserva.materialReservado || ""}
              onChange={(e) =>
                setNewReserva({
                  ...newReserva,
                  materialReservado: e.target.value,
                })
              }
              className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex gap-2 mb-2">
              <button
                type="button"
                onClick={() => setBarcodeMode('user')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${barcodeMode === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  }`}
              >
                Escanear Usuario
              </button>
              <button
                type="button"
                onClick={() => setBarcodeMode('equipment')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${barcodeMode === 'equipment'
                  ? 'bg-green-600 text-white'
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
              >
                Escanear Material
              </button>
              <span className="ml-2 text-sm text-gray-500">
                Modo actual:
                <span className={`ml-1 ${barcodeMode === 'user' ? 'text-blue-600' : 'text-green-600'}`}>
                  {barcodeMode === 'user' ? 'Escaneando Usuario' : 'Escaneando Material'}
                </span>
              </span>
            </div>
            {showBarcodeInstructions && (
              <p className="text-xs mt-1 text-blue-600 animate-pulse">
                {barcodeMode === 'user'
                  ? 'Escanee el documento del usuario...'
                  : 'Escanee los códigos de los materiales...'}
              </p>
            )}
          </div>

          {scannedEquipment.length > 0 && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">Materiales Escaneados</h4>
              <div className="space-y-2">
                {scannedEquipment.map((equipment, index) => (
                  <div key={index} className="flex justify-between items-center bg-white p-2 rounded border">
                    <span className="text-sm font-mono">{equipment.code}</span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
                      x{equipment.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resto de campos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Usuario
            </label>
            <select
              value={newReserva.IdUsuario || ""}
              onChange={e =>
                setNewReserva({
                  ...newReserva,
                  IdUsuario: e.target.value,
                })
              }
              className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Seleccione un usuario</option>
              {usuarios.map((usuario) => (
                <option key={usuario.IdUsuario} value={usuario.IdUsuario}>
                  {usuario.Usuario}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ficha
            </label>
            <input
              type="text"
              value={newReserva.ficha || ""}
              onChange={e =>
                setNewReserva({
                  ...newReserva,
                  ficha: e.target.value,
                })
              }
              className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Material Reservado
            </label>
            <input
              type="text"
              value={scannedEquipment.reduce((sum, eq) => sum + eq.quantity, 0)}
              readOnly
              className="border border-gray-300 p-2 rounded-lg w-full bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha
            </label>
            <input
              type="date"
              value={newReserva.fecha || ""}
              onChange={e =>
                setNewReserva({
                  ...newReserva,
                  fecha: e.target.value,
                })
              }
              className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </>
      );
    }
  };

  return (
    <div className="px-4 py-20 md:px-8 lg:px-10 max-w-full bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Header */}
        <div className="flex items-center mb-6">
          <div className="flex items-center mr-8">
            <div className="bg-orange-500 text-white px-2 py-1 rounded text-sm font-bold mr-2">
              SENA
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              Reservas de Material
            </h1>
          </div>
        </div>
        {/* Tabs and New Button */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="flex border-b border-gray-200 mb-4 md:mb-0">
            <button
              onClick={() => handleTabChange("fijas")}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "fijas"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Reservas Fijas
            </button>
            <button
              onClick={() => handleTabChange("diarias")}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "diarias"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Reservas Diarias
            </button>
          </div>
          <button
            onClick={() => {
              setNewReserva({});
              setShowModal(true);
            }}
            className="flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
          >
            <Plus size={18} className="mr-2" />
            Nueva Reserva
          </button>
        </div>
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder={`Buscar ${activeTab === "fijas" ? "reserva fija" : "reserva diaria"}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
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
        </div>
        {/* Tabla de Reservas */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {getTableHeaders().map((header, index) => (
                  <th
                    key={index}
                    onClick={() => {
                      if (index < getTableHeaders().length - 1) {
                        const keys = activeTab === "fijas"
                          ? ["idReservaFija", "nombrePrograma", "ficha", "materialReservado", "Estado"]
                          : ["idReservaDiaria", "IdUsuario", "ficha", "materialReservado", "fecha"];
                        requestSort(keys[index]);
                      }
                    }}
                    className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                      index < getTableHeaders().length - 1 ? "cursor-pointer hover:bg-gray-100" : ""
                    }`}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentReservas.length > 0 ? (
                currentReservas.map((reserva) => {
                  if (activeTab === "fijas") {
                    return (
                      <tr key={reserva.idReservaFija} className="hover:bg-blue-50 transition-colors duration-150">
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {reserva.idReservaFija}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {reserva.nombrePrograma}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {reserva.ficha}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {reserva.materialReservado}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            reserva.Estado === "Disponible"
                              ? "bg-green-100 text-green-800"
                              : reserva.Estado === "Asignado"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-red-100 text-red-800"
                          }`}>
                            {reserva.Estado}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditReserva(reserva)}
                              className="p-1 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 transition-colors duration-200"
                              title="Editar reserva"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteReserva(reserva.idReservaFija)}
                              className="p-1 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition-colors duration-200"
                              title="Eliminar reserva"
                            >
                              <Trash2 size={16} />
                            </button>
                            <button
                              onClick={() => handleCheckReservaFija(reserva)}
                              className={`p-1 rounded-full ${
                                reserva.Estado === "Disponible"
                                  ? "bg-green-100 hover:bg-green-200 text-green-600"
                                  : "bg-blue-100 hover:bg-blue-200 text-blue-600"
                              } transition-colors duration-200`}
                              title={
                                reserva.Estado === "Disponible"
                                  ? "Marcar como Asignado"
                                  : "Marcar como Disponible"
                              }
                            >
                              <Check size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  } else {
                    return (
                      <tr key={reserva.idReservaDiaria} className="hover:bg-blue-50 transition-colors duration-150">
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {reserva.idReservaDiaria}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {reserva.Usuario?.Usuario || 'N/A'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {reserva.ficha}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {reserva.materialReservado}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(reserva.fecha)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditReserva(reserva)}
                              className="p-1 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 transition-colors duration-200"
                              title="Editar reserva"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteReserva(reserva.idReservaDiaria)}
                              className="p-1 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition-colors duration-200"
                              title="Eliminar reserva"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }
                })
              ) : (
                <tr>
                  <td
                    colSpan={getTableHeaders().length}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No se encontraron {activeTab === "fijas" ? "reservas fijas" : "reservas diarias"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        {sortedReservas.length > 0 && (
          <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
            <div>
              Mostrando {indexOfFirstItem + 1} a{" "}
              {Math.min(indexOfLastItem, sortedReservas.length)} de{" "}
              {sortedReservas.length} {activeTab === "fijas" ? "reservas fijas" : "reservas diarias"}
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
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl mx-4 max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">
              {activeTab === "fijas"
                ? (newReserva.idReservaFija ? "Editar Reserva Fija" : "Crear Nueva Reserva Fija")
                : (newReserva.idReservaDiaria ? "Editar Reserva Diaria" : "Crear Nueva Reserva Diaria")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {getFormFields()}
            </div>
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
              <button
                onClick={() => {
                  setShowModal(false);
                  setBarcodeMode('user');
                  setScannedEquipment([]);
                  setShowBarcodeInstructions(false);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateReserva}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                {activeTab === "fijas"
                  ? (newReserva.idReservaFija ? "Actualizar" : "Crear")
                  : (newReserva.idReservaDiaria ? "Actualizar" : "Crear")}
              </button>
            </div>
          </div>
        </div>
      )}

      <BarcodeReader
        onScan={handleBarcodeScan}
        isActive={showModal}
      />
    </div>
  );
};

export default Reservas;
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { useForm } from "react-hook-form";

export const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({
    Nombre: "",
    Apellido: "",
    TipoDocumento: "",
    NumeroDocumento: "",
    Usuario: "",
    Correo: "",
    IdTiposDocumentos: "",
    IdRol: 3,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    trigger,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      Nombre: "",
      Apellido: "",
      TipoDocumento: "",
      NumeroDocumento: "",
      Usuario: "",
      Correo: "",
      IdRol: 3,
    },
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "IdUsuario",
    direction: "ascending",
  });
  const itemsPerPage = 10;

  useEffect(() => {
    fetchUsuarios();
    fetchRoles();
  }, []);

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

  const fetchRoles = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/roles", {
        withCredentials: true,
      });
      setRoles(response.data);
    } catch (error) {
      setRoles([
        { IdRol: 1, NombreRol: "Administrador" },
        { IdRol: 2, NombreRol: "Instructor" },
        { IdRol: 3, NombreRol: "Aprendiz" },
        { IdRol: 4, NombreRol: "Invitado" },
      ]);
    }
  };

  const getRolName = (idRol) => {
    const rol = roles.find((r) => r.IdRol === idRol);
    return rol ? rol.NombreRol : "Sin asignar";
  };

  const getIdTipoDocumento = (tipoDoc) => {
    const tiposDocumento = {
      CC: 1,
      TI: 2,
      TIE: 3,
      CE: 4,
    };
    return tiposDocumento[tipoDoc] || 1;
  };

  const handleCreateUser = handleSubmit(async (data) => {
    try {
      const userData = {
        ...data,
        IdTiposDocumentos: getIdTipoDocumento(data.TipoDocumento),
      };

      if (newUser.IdUsuario) {
        await axios.put(
          `http://localhost:3000/api/usuarios/${newUser.IdUsuario}`,
          userData,
          { withCredentials: true }
        );
        Swal.fire({
          icon: "success",
          title: "Usuario actualizado",
          text: "El usuario se actualizó correctamente.",
          showConfirmButton: true,
        });
      } else {
        await axios.post("http://localhost:3000/api/usuarios", userData, {
          withCredentials: true,
        });
        Swal.fire({
          icon: "success",
          title: "Usuario creado",
          text: "El usuario se creó correctamente.",
          showConfirmButton: true,
        });
      }
      setShowModal(false);
      reset();
      setNewUser({
        Nombre: "",
        Apellido: "",
        TipoDocumento: "",
        NumeroDocumento: "",
        Usuario: "",
        Correo: "",
        IdTiposDocumentos: "",
        IdRol: 3,
      });
      fetchUsuarios();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al guardar el usuario.",
        showConfirmButton: true,
      });
      console.error(
        newUser.IdUsuario
          ? "Error al actualizar usuario:"
          : "Error al crear usuario:",
        error
      );
    }
  });

  const handleEditUser = (user) => {
    setNewUser(user);
    setValue("Nombre", user.Nombre);
    setValue("Apellido", user.Apellido);
    setValue("TipoDocumento", user.TipoDocumento);
    setValue("NumeroDocumento", user.NumeroDocumento);
    setValue("Usuario", user.Usuario);
    setValue("Correo", user.Correo);
    setValue("IdRol", user.IdRol);
    setShowModal(true);
    Swal.fire({
      icon: "info",
      title: "Modo edición",
      text: "Ahora puedes editar el usuario.",
      showConfirmButton: true,
    });
  };

  const handleOpenNewUserModal = () => {
    setNewUser({
      Nombre: "",
      Apellido: "",
      TipoDocumento: "",
      NumeroDocumento: "",
      Usuario: "",
      Correo: "",
      IdTiposDocumentos: "",
      IdRol: 3,
    });
    reset();
    setShowModal(true);
  };

  const handleDeleteUser = async (id) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará el usuario. ¿Deseas continuar?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:3000/api/usuarios/${id}`, {
          withCredentials: true,
        });
        fetchUsuarios();
        Swal.fire({
          icon: "success",
          title: "Eliminado",
          text: "El usuario fue eliminado correctamente.",
          showConfirmButton: true,
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Ocurrió un error al eliminar el usuario.",
        });
        console.error("Error al eliminar usuario:", error);
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

  const filteredUsuarios = usuarios.filter((user) => {
    const rolName = getRolName(user.IdRol);
    return (
      user.Nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.Apellido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.Usuario?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.Correo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.NumeroDocumento?.toString().includes(searchTerm) ||
      rolName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const sortedUsuarios = [...filteredUsuarios].sort((a, b) => {
    let aVal, bVal;
    if (sortConfig.key === "IdRol") {
      aVal = getRolName(a.IdRol);
      bVal = getRolName(b.IdRol);
    } else {
      aVal = a[sortConfig.key] || "";
      bVal = b[sortConfig.key] || "";
    }
    if (aVal < bVal) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (aVal > bVal) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsuarios = sortedUsuarios.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedUsuarios.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
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
      doc.text("Lista de usuarios", 15, 45);

      doc.setFontSize(12);
      doc.setFont(undefined, "bold");
      doc.text(`Fecha:`, 15, 55);
      doc.text(`Total:`, 15, 63);

      doc.setFont(undefined, "normal");
      doc.text(`${new Date().toLocaleDateString("es-ES")}`, 40, 55);
      doc.text(`${sortedUsuarios.length}`, 40, 63);

      doc.setFontSize(13);
      doc.setFont(undefined, "bold");
      doc.text("Descripción:", 15, 73);
      doc.setFontSize(11);
      doc.setFont(undefined, "normal");
      doc.text(
        "Este reporte contiene la lista de usuarios registrados en el sistema, incluyendo información básica y de contacto.",
        15,
        80,
        { maxWidth: 180 }
      );

      const tableData = sortedUsuarios.map((user) => [
        String(user.IdUsuario || ""),
        String(user.Nombre || ""),
        String(user.Apellido || ""),
        String(user.TipoDocumento || ""),
        String(user.NumeroDocumento || ""),
        String(user.Usuario || ""),
        String(user.Correo || ""),
        String(getRolName(user.IdRol)),
      ]);

      autoTable(doc, {
        head: [
          [
            "ID",
            "Nombre",
            "Apellido",
            "Tipo Doc.",
            "Núm. Doc.",
            "Usuario",
            "Correo",
            "Rol",
          ],
        ],
        body: tableData,
        startY: 90,
        styles: {
          fontSize: 8,
          cellPadding: 1.5,
        },
        headStyles: {
          fillColor: [57, 181, 74],
          textColor: 255,
          fontStyle: "bold",
        },
      });

      const fileName = `usuarios_${new Date().toISOString().split("T")[0]}.pdf`;
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
        text: `Error: ${error.message}`,
        showConfirmButton: true,
      });
    }
  };

  const exportToExcel = () => {
    try {
      const wsData = [
        [
          "ID",
          "Nombre",
          "Apellido",
          "Tipo Doc.",
          "Número Doc.",
          "Usuario",
          "Correo",
          "Rol",
        ],
        ...sortedUsuarios.map((user) => [
          user.IdUsuario || "",
          user.Nombre || "",
          user.Apellido || "",
          user.TipoDocumento || "",
          user.NumeroDocumento || "",
          user.Usuario || "",
          user.Correo || "",
          getRolName(user.IdRol) || "",
        ]),
      ];

      const worksheet = XLSX.utils.aoa_to_sheet(wsData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Usuarios");

      const fileName = `usuarios_${new Date().toISOString().split("T")[0]}.xlsx`;
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
        text: `Error: ${error.message}`,
        showConfirmButton: true,
      });
    }
  };

  return {
    usuarios,
    roles,
    showModal,
    setShowModal,
    newUser,
    setNewUser,
    register,
    handleSubmit,
    errors,
    reset,
    setValue,
    watch,
    trigger,
    currentPage,
    setCurrentPage,
    searchTerm,
    setSearchTerm,
    sortConfig,
    setSortConfig,
    requestSort,
    sortedUsuarios,
    currentUsuarios,
    indexOfFirstItem,
    indexOfLastItem,
    totalPages,
    paginate,
    handleCreateUser,
    handleEditUser,
    handleOpenNewUserModal,
    handleDeleteUser,
    exportToPDF,
    exportToExcel,
    getRolName,
    itemsPerPage
  };
};
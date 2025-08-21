import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
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
      toast.error("Error al cargar la lista de usuarios", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
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
      toast.warning("Se cargaron los roles por defecto", {
        position: "top-right",
        autoClose: 3000,
      });
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
        toast.success("Usuario actualizado correctamente", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        await axios.post("http://localhost:3000/api/usuarios", userData, {
          withCredentials: true,
        });
        toast.success("Usuario creado correctamente", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
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
      toast.error("Ocurrió un error al guardar el usuario", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
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
    toast.info("Modo edición activado", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
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
    const confirmDelete = await new Promise((resolve) => {
      toast.warning(
        ({ closeToast }) => (
          <div>
            <p>¿Estás seguro de eliminar este usuario?</p>
            <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
              <button
                onClick={() => {
                  resolve(true);
                  closeToast();
                }}
                style={{
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Eliminar
              </button>
              <button
                onClick={() => {
                  resolve(false);
                  closeToast();
                }}
                style={{
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        ),
        {
          position: "top-right",
          autoClose: false,
          closeOnClick: false,
          draggable: false,
        }
      );
    });

    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:3000/api/usuarios/${id}`, {
          withCredentials: true,
        });
        fetchUsuarios();
        toast.success("Usuario eliminado correctamente", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } catch (error) {
        toast.error("Error al eliminar el usuario", {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
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

      toast.success("PDF generado y descargado correctamente", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      toast.error(`Error al generar PDF: ${error.message}`, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
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

      toast.success("Excel generado y descargado correctamente", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      toast.error(`Error al generar Excel: ${error.message}`, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
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
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { useForm } from "react-hook-form";

export const useUsuariosSoftware = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newUser, setNewUser] = useState({
    Usuario: "",
    Correo: "",
    PasswordTexto: "",
    IdRol: "",
  });
  const [editingUser, setEditingUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: "IdRegistroLogin",
    direction: "ascending",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const itemsPerPage = 10;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    setValue,
  } = useForm();

  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editErrors, setEditErrors] = useState({});

  const [showInactive, setShowInactive] = useState(false);
  const [activationStatusFilter, setActivationStatusFilter] = useState("all");

  useEffect(() => {
    fetchUsuarios();
    fetchRoles();
  }, []);

  useEffect(() => {
    const filtered = usuarios.filter(
      (user) =>
        user.Usuario?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.Correo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.IdRegistroLogin?.toString().includes(searchTerm)
    );
    setFilteredUsuarios(filtered);
    setCurrentPage(1);
  }, [searchTerm, usuarios]);

  // Filtrar usuarios por estado de activación
  useEffect(() => {
    let filtered = usuarios;

    // Filtro por estado de activación
    if (activationStatusFilter === "active") {
      filtered = filtered.filter((user) => user.isVerified === true);
    } else if (activationStatusFilter === "inactive") {
      filtered = filtered.filter((user) => user.isVerified === false);
    }

    // Mantén el filtro de búsqueda también
    filtered = filtered.filter(
      (user) =>
        user.Usuario?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.Correo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.IdRegistroLogin?.toString().includes(searchTerm)
    );

    setFilteredUsuarios(filtered);
    setCurrentPage(1);
  }, [activationStatusFilter, searchTerm, usuarios]);

  axios.defaults.withCredentials = true;

  const fetchUsuarios = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/users");

      // Mapear los campos correctamente
      const usuariosConEstado = response.data.map((user) => ({
        ...user,
        emailVerified: user.emailVerified || false,
        isVerified: user.isVerified || false,
        Estado: user.isVerified ? "Activo" : "Inactivo",
      }));

      setUsuarios(usuariosConEstado);
      setFilteredUsuarios(usuariosConEstado);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      await Swal.fire({
        icon: "error",
        title: "Error de conexión",
        text: "No se pudieron cargar los usuarios. Verifique su conexión.",
        confirmButtonText: "Aceptar",
      });
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/roles");
      setRoles(response.data);
    } catch (error) {
      console.error("Error al obtener roles:", error);
      await Swal.fire({
        icon: "error",
        title: "Error de conexión",
        text: "No se pudieron cargar los roles. Verifique su conexión.",
        confirmButtonText: "Aceptar",
      });
    }
  };

  const validateField = (fieldName, value) => {
    let error = "";
    if (fieldName === "Usuario" && !value.trim())
      error = "El usuario es obligatorio";
    if (fieldName === "Correo" && !value.trim())
      error = "El correo es obligatorio";
    if (fieldName === "PasswordTexto" && !value.trim())
      error = "La contraseña es obligatoria";
    if (fieldName === "IdRol" && !value) error = "El rol es obligatorio";
    setValidationErrors((prev) => ({ ...prev, [fieldName]: error }));
    return error;
  };

  const validateForm = (data) => {
    const errors = {};
    if (!data.Usuario.trim()) errors.Usuario = "El usuario es obligatorio";
    if (!data.Correo.trim()) errors.Correo = "El correo es obligatorio";
    if (!data.PasswordTexto.trim())
      errors.PasswordTexto = "La contraseña es obligatoria";
    if (!data.IdRol) errors.IdRol = "El rol es obligatorio";
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const checkDuplicates = (usuario, correo, id) => {
    return usuarios.some(
      (u) =>
        (u.Usuario === usuario || u.Correo === correo) &&
        (id ? u.IdRegistroLogin !== id : true)
    );
  };

  const handleCreateUser = async (data) => {
    setIsSubmitting(true);
    if (!validateForm(data)) {
      setIsSubmitting(false);
      return;
    }
    if (checkDuplicates(data.Usuario, data.Correo)) {
      setValidationErrors({
        Usuario: "Usuario o correo ya existe",
        Correo: "Usuario o correo ya existe",
      });
      setIsSubmitting(false);
      return;
    }
    try {
      await axios.post("http://localhost:3000/api/users", data);
      await Swal.fire({
        icon: "success",
        title: "Usuario creado",
        text: "El usuario se creó correctamente.",
        timer: 1500,
        showConfirmButton: false,
      });
      fetchUsuarios();
      setFormVisible(false);
      reset();
      setNewUser({
        Usuario: "",
        Correo: "",
        PasswordTexto: "",
        IdRol: "",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo crear el usuario.",
      });
    }
    setIsSubmitting(false);
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
        await axios.delete(`http://localhost:3000/api/users/${id}`);
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
      }
    }
  };

  const handleUpdateUser = async () => {
   
    setIsSubmitting(true);

    // Validación específica para edición
    const editErrors = {};
    if (!editingUser.Usuario?.trim())
      editErrors.Usuario = "El usuario es obligatorio";
    if (!editingUser.Correo?.trim())
      editErrors.Correo = "El correo es obligatorio";
    if (!editingUser.IdRol) editErrors.IdRol = "El rol es obligatorio";

    setEditErrors(editErrors);

    if (Object.keys(editErrors).length > 0) {
      setIsSubmitting(false);
      return;
    }

    if (
      checkDuplicates(
        editingUser.Usuario,
        editingUser.Correo,
        editingUser.IdRegistroLogin
      )
    ) {
      setEditErrors({
        Usuario: "Usuario o correo ya existe",
        Correo: "Usuario o correo ya existe",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      await axios.put(
        `http://localhost:3000/api/users/${editingUser.IdRegistroLogin}`,
        {
          Usuario: editingUser.Usuario,
          Correo: editingUser.Correo,
          IdRol: editingUser.IdRol,
        }
      );

      // Actualizar el estado local inmediatamente
      setUsuarios((prevUsuarios) =>
        prevUsuarios.map((user) =>
          user.IdRegistroLogin === editingUser.IdRegistroLogin
            ? {
                ...user,
                Usuario: editingUser.Usuario,
                Correo: editingUser.Correo,
                IdRol: editingUser.IdRol,
              }
            : user
        )
      );

      setFilteredUsuarios((prev) =>
        prev.map((user) =>
          user.IdRegistroLogin === editingUser.IdRegistroLogin
            ? {
                ...user,
                Usuario: editingUser.Usuario,
                Correo: editingUser.Correo,
                IdRol: editingUser.IdRol,
              }
            : user
        )
      );

      await Swal.fire({
        icon: "success",
        title: "Usuario actualizado",
        text: "El usuario se actualizó correctamente.",
        timer: 1500,
        showConfirmButton: false,
      });

      setEditingUser(null);
      setFormVisible(false);
      reset();

      // También llamar a fetchUsuarios para asegurar consistencia
      fetchUsuarios();
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo actualizar el usuario.",
      });
    }
    setIsSubmitting(false);
  };

  const cancelEdit = () => {
    setEditingUser(null);
    setFormVisible(false);
    reset();
    setEditErrors({});
  };

  const handleEditFieldChange = (field, value) => {
    setEditingUser((prev) => ({ ...prev, [field]: value }));
    setEditErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedUsuarios = [...filteredUsuarios].sort((a, b) => {
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
  const currentUsuarios = sortedUsuarios.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(sortedUsuarios.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Función para activar/desactivar usuario
  const toggleUserActivation = async (userId, isCurrentlyActive) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/admin/users/${userId}/toggle-activation`, // ← Ruta corregida
        {
          activate: !isCurrentlyActive,
        },
        {
          withCredentials: true,
        }
      );

      // Actualizar ambos estados
      setUsuarios((prevUsuarios) =>
        prevUsuarios.map((user) =>
          user.IdRegistroLogin === userId
            ? {
                ...user,
                isVerified: !isCurrentlyActive,
                Estado: !isCurrentlyActive ? "Activo" : "Inactivo", // ← Actualizar ambos
              }
            : user
        )
      );

      // También actualizar filteredUsuarios - IMPORTANTE
      setFilteredUsuarios((prev) =>
        prev.map((user) =>
          user.IdRegistroLogin === userId
            ? {
                ...user,
                isVerified: !isCurrentlyActive,
                Estado: !isCurrentlyActive ? "Activo" : "Inactivo", // ← Actualizar ambos
              }
            : user
        )
      );

      Swal.fire({
        icon: "success",
        title: "Estado actualizado",
        text: `Usuario ${
          !isCurrentlyActive ? "activado" : "desactivado"
        } correctamente.`,
        timer: 1500,
        showConfirmButton: false,
      });

      // También llamar a fetchUsuarios para asegurar consistencia
      fetchUsuarios();
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo cambiar el estado del usuario.",
      });
    }
  };

  // Función para cambiar rol de usuario
  const changeUserRole = async (userId, newRoleId) => {
    try {
      await axios.put(
        `http://localhost:3000/api/admin/users/${userId}/role`,
        {
          newRoleId: parseInt(newRoleId),
        },
        {
          withCredentials: true,
        }
      );

      // Actualizar el estado local inmediatamente - CORREGIDO
      setUsuarios((prevUsuarios) =>
        prevUsuarios.map((user) =>
          user.IdRegistroLogin === userId
            ? {
                ...user,
                IdRol: parseInt(newRoleId),
              }
            : user
        )
      );

      // También actualizar filteredUsuarios - CRÍTICO
      setFilteredUsuarios((prev) =>
        prev.map((user) =>
          user.IdRegistroLogin === userId
            ? { ...user, IdRol: parseInt(newRoleId) }
            : user
        )
      );

      Swal.fire({
        icon: "success",
        title: "Rol actualizado",
        text: "Rol de usuario actualizado correctamente.",
        timer: 1500,
        showConfirmButton: false,
      });

      // También llamar a fetchUsuarios para asegurar consistencia
      fetchUsuarios();
    } catch (error) {
      console.error("Error al cambiar rol:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo cambiar el rol del usuario.",
      });
    }
  };

  const forceRefresh = () => {
    fetchUsuarios();
    fetchRoles();
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
      doc.text("Usuarios Software", 105, 25, { align: "center" });

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
        "Este reporte contiene la lista de usuarios de software registrados en el sistema.",
        15,
        80,
        { maxWidth: 180 }
      );

      const tableData = sortedUsuarios.map((user) => [
        String(user.IdRegistroLogin || ""),
        String(user.Usuario || ""),
        String(user.Correo || ""),
        String(user.IdRol || ""),
      ]);

      autoTable(doc, {
        head: [["ID", "Usuario", "Correo", "Rol"]],
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

      const fileName = `usuarios_software_${
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
        text: `Error: ${error.message}`,
        showConfirmButton: true,
      });
    }
  };

  const exportToExcel = () => {
    try {
      const wsData = [
        ["ID", "Usuario", "Correo", "Rol"],
        ...sortedUsuarios.map((user) => [
          user.IdRegistroLogin || "",
          user.Usuario || "",
          user.Correo || "",
          user.IdRol || "",
        ]),
      ];

      const worksheet = XLSX.utils.aoa_to_sheet(wsData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "UsuariosSoftware");

      const fileName = `usuarios_software_${
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
        text: `Error: ${error.message}`,
        showConfirmButton: true,
      });
    }
  };

  return {
    usuarios,
    roles,
    filteredUsuarios,
    searchTerm,
    setSearchTerm,
    newUser,
    setNewUser,
    editingUser,
    setEditingUser,
    currentPage,
    setCurrentPage,
    sortConfig,
    setSortConfig,
    showPassword,
    setShowPassword,
    formVisible,
    setFormVisible,
    itemsPerPage,
    register,
    handleSubmit,
    reset,
    errors,
    watch,
    setValue,
    validationErrors,
    setValidationErrors,
    isSubmitting,
    setIsSubmitting,
    editErrors,
    setEditErrors,
    handleCreateUser,
    handleDeleteUser,
    handleUpdateUser,
    cancelEdit,
    handleEditFieldChange,
    requestSort,
    sortedUsuarios,
    indexOfLastItem,
    indexOfFirstItem,
    currentUsuarios,
    totalPages,
    paginate,
    exportToPDF,
    exportToExcel,
    fetchUsuarios,
    fetchRoles,
    toggleUserActivation,
    showInactive,
    setShowInactive,
    activationStatusFilter,
    setActivationStatusFilter,
    forceRefresh,
    changeUserRole,
  };
};

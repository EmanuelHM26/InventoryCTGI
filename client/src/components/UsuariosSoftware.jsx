
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, Edit, Trash2, ChevronLeft, ChevronRight, Plus, UserPlus, X, Save, Eye, EyeOff, Check } from "lucide-react";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";

const UsuariosSoftware = () => {
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
  const [sortConfig, setSortConfig] = useState({ key: "IdRegistroLogin", direction: "ascending" });
  const [showPassword, setShowPassword] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const itemsPerPage = 10;
  const { register, handleSubmit, reset, formState: { errors }, watch, setValue } = useForm();

  // Estados para validaciones en tiempo real
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editErrors, setEditErrors] = useState({});

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

  axios.defaults.withCredentials = true;

  const fetchUsuarios = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/users");
      setUsuarios(response.data);
      setFilteredUsuarios(response.data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      await Swal.fire({
        icon: "error",
        title: "Error de conexión",
        text: "No se pudieron cargar los usuarios. Verifique su conexión.",
        confirmButtonText: "Aceptar"
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
        confirmButtonText: "Aceptar"
      });
    }
  };

  // Validaciones en tiempo real
  const validateField = (fieldName, value) => {
    const errors = {};

    switch (fieldName) {
      case 'Usuario':
        if (!value.trim()) {
          errors.Usuario = "El usuario es obligatorio";
        } else if (value.length < 3) {
          errors.Usuario = "El usuario debe tener al menos 3 caracteres";
        } else if (value.length > 20) {
          errors.Usuario = "El usuario no puede tener más de 20 caracteres";
        } else if (!/^[A-Za-z0-9_]+$/.test(value)) {
          errors.Usuario = "Solo se permiten letras, números y guión bajo";
        } else if (/^\d+$/.test(value)) {
          errors.Usuario = "El usuario no puede ser solo números";
        } else if (/^_+$/.test(value)) {
          errors.Usuario = "El usuario no puede ser solo guiones bajos";
        }
        break;

      case 'Correo':
        if (!value.trim()) {
          errors.Correo = "El correo es obligatorio";
        } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) {
          errors.Correo = "Formato de correo inválido";
        } else if (value.length > 100) {
          errors.Correo = "El correo es demasiado largo";
        }
        break;

      case 'PasswordTexto':
        if (!value) {
          errors.PasswordTexto = "La contraseña es obligatoria";
        } else if (value.length < 6) {
          errors.PasswordTexto = "La contraseña debe tener al menos 6 caracteres";
        } else if (value.length > 50) {
          errors.PasswordTexto = "La contraseña es demasiado larga";
        } else if (!/[A-Za-z]/.test(value)) {
          errors.PasswordTexto = "La contraseña debe contener al menos una letra";
        } else if (!/\d/.test(value)) {
          errors.PasswordTexto = "La contraseña debe contener al menos un número";
        } else if (/\s/.test(value)) {
          errors.PasswordTexto = "La contraseña no puede contener espacios";
        }
        break;

      case 'IdRol':
        if (!value) {
          errors.IdRol = "Debe seleccionar un rol";
        }
        break;

      default:
        break;
    }

    return errors;
  };

  // Validación completa del formulario
  const validateForm = (data) => {
    let allErrors = {};

    Object.keys(data).forEach(field => {
      const fieldErrors = validateField(field, data[field]);
      allErrors = { ...allErrors, ...fieldErrors };
    });

    return allErrors;
  };

  // Verificar duplicados
  const checkDuplicates = async (data, isEdit = false, currentId = null) => {
    const duplicateErrors = {};

    // Verificar usuario duplicado
    const userExists = usuarios.find(user =>
      user.Usuario.toLowerCase() === data.Usuario.toLowerCase() &&
      (!isEdit || user.IdRegistroLogin !== currentId)
    );

    if (userExists) {
      duplicateErrors.Usuario = "Este nombre de usuario ya existe";
    }

    // Verificar correo duplicado
    const emailExists = usuarios.find(user =>
      user.Correo.toLowerCase() === data.Correo.toLowerCase() &&
      (!isEdit || user.IdRegistroLogin !== currentId)
    );

    if (emailExists) {
      duplicateErrors.Correo = "Este correo ya está registrado";
    }

    return duplicateErrors;
  };

  // Validaciones para edición en línea
  const validateEditField = (fieldName, value, userId) => {
    const fieldErrors = validateField(fieldName, value);

    // Verificar duplicados para edición
    if (fieldName === 'Usuario' && !fieldErrors.Usuario) {
      const userExists = usuarios.find(user =>
        user.Usuario.toLowerCase() === value.toLowerCase() &&
        user.IdRegistroLogin !== userId
      );
      if (userExists) {
        fieldErrors.Usuario = "Este nombre de usuario ya existe";
      }
    }

    if (fieldName === 'Correo' && !fieldErrors.Correo) {
      const emailExists = usuarios.find(user =>
        user.Correo.toLowerCase() === value.toLowerCase() &&
        user.IdRegistroLogin !== userId
      );
      if (emailExists) {
        fieldErrors.Correo = "Este correo ya está registrado";
      }
    }

    return fieldErrors;
  };

  const handleCreateUser = async (data) => {
    setIsSubmitting(true);

    try {
      // Validaciones del formulario
      const formErrors = validateForm(data);
      if (Object.keys(formErrors).length > 0) {
        setValidationErrors(formErrors);
        await Swal.fire({
          icon: "warning",
          title: "Errores de validación",
          text: "Por favor, corrija los errores en el formulario.",
          confirmButtonText: "Aceptar"
        });
        setIsSubmitting(false);
        return;
      }

      // Verificar duplicados
      const duplicateErrors = await checkDuplicates(data);
      if (Object.keys(duplicateErrors).length > 0) {
        setValidationErrors(duplicateErrors);
        await Swal.fire({
          icon: "warning",
          title: "Datos duplicados",
          text: Object.values(duplicateErrors).join(". "),
          confirmButtonText: "Aceptar"
        });
        setIsSubmitting(false);
        return;
      }

      // Limpiar errores de validación
      setValidationErrors({});

      await axios.post("http://localhost:3000/api/register", data);
      reset();
      setFormVisible(false);
      fetchUsuarios();
      await Swal.fire({
        icon: "success",
        title: "Usuario creado",
        text: "El usuario se creó correctamente.",
        confirmButtonText: "Aceptar"
      });
    } catch (error) {
      let errorMessage = "Ocurrió un error al crear el usuario.";

      if (error.response) {
        if (error.response.status === 400) {
          errorMessage = "Datos inválidos. Verifique la información ingresada.";
        } else if (error.response.status === 409) {
          errorMessage = "El usuario o correo ya existe.";
        } else if (error.response.status === 500) {
          errorMessage = "Error interno del servidor.";
        }
      }

      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        confirmButtonText: "Aceptar"
      });
      console.error("Error al crear usuario:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!id) {
      await Swal.fire({
        icon: "warning",
        title: "Error",
        text: "ID de usuario inválido.",
        confirmButtonText: "Aceptar"
      });
      return;
    }

    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará el usuario permanentemente. ¿Deseas continuar?",
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
        await Swal.fire({
          icon: "success",
          title: "Eliminado",
          text: "El usuario fue eliminado correctamente.",
          confirmButtonText: "Aceptar"
        });
      } catch (error) {
        let errorMessage = "Ocurrió un error al eliminar el usuario.";

        if (error.response) {
          if (error.response.status === 404) {
            errorMessage = "Usuario no encontrado.";
          } else if (error.response.status === 403) {
            errorMessage = "No tiene permisos para eliminar este usuario.";
          } else if (error.response.status === 500) {
            errorMessage = "Error interno del servidor.";
          }
        }

        Swal.fire({
          icon: "error",
          title: "Error",
          text: errorMessage,
          confirmButtonText: "Aceptar"
        });
        console.error("Error al eliminar usuario:", error);
      }
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser) {
      Swal.fire({
        icon: "warning",
        title: "Sin selección",
        text: "No hay usuario seleccionado para editar.",
        confirmButtonText: "Aceptar"
      });
      return;
    }

    // Validar campos editados
    let hasErrors = false;
    const newEditErrors = {};

    // Validar Usuario
    const userErrors = validateEditField('Usuario', editingUser.Usuario, editingUser.IdRegistroLogin);
    if (Object.keys(userErrors).length > 0) {
      newEditErrors.Usuario = userErrors.Usuario;
      hasErrors = true;
    }

    // Validar Correo
    const emailErrors = validateEditField('Correo', editingUser.Correo, editingUser.IdRegistroLogin);
    if (Object.keys(emailErrors).length > 0) {
      newEditErrors.Correo = emailErrors.Correo;
      hasErrors = true;
    }

    // Validar Rol
    const rolErrors = validateEditField('IdRol', editingUser.IdRol, editingUser.IdRegistroLogin);
    if (Object.keys(rolErrors).length > 0) {
      newEditErrors.IdRol = rolErrors.IdRol;
      hasErrors = true;
    }

    setEditErrors(newEditErrors);

    if (hasErrors) {
      await Swal.fire({
        icon: "warning",
        title: "Errores de validación",
        text: "Por favor, corrija los errores antes de guardar.",
        confirmButtonText: "Aceptar"
      });
      return;
    }

    const originalUser = usuarios.find((u) => u.IdRegistroLogin === editingUser.IdRegistroLogin);
    const updatedFields = {};

    if (editingUser.Usuario !== originalUser?.Usuario) {
      updatedFields.Usuario = editingUser.Usuario;
    }
    if (editingUser.Correo !== originalUser?.Correo) {
      updatedFields.Correo = editingUser.Correo;
    }
    if (editingUser.IdRol !== originalUser?.IdRol) {
      updatedFields.IdRol = editingUser.IdRol;
    }

    if (Object.keys(updatedFields).length === 0) {
      await Swal.fire({
        icon: "info",
        title: "Sin cambios",
        text: "No se han realizado cambios.",
        confirmButtonText: "Aceptar"
      });
      setEditingUser(null);
      setEditErrors({});
      return;
    }

    try {
      await axios.put(`http://localhost:3000/api/users/${editingUser.IdRegistroLogin}`, updatedFields);
      setEditingUser(null);
      setEditErrors({});
      fetchUsuarios();
      await Swal.fire({
        icon: "success",
        title: "Usuario actualizado",
        text: "El usuario se actualizó correctamente.",
        confirmButtonText: "Aceptar"
      });
    } catch (error) {
      let errorMessage = "Ocurrió un error al actualizar el usuario.";

      if (error.response) {
        if (error.response.status === 400) {
          errorMessage = "Datos inválidos. Verifique la información ingresada.";
        } else if (error.response.status === 404) {
          errorMessage = "Usuario no encontrado.";
        } else if (error.response.status === 409) {
          errorMessage = "El usuario o correo ya existe.";
        } else if (error.response.status === 500) {
          errorMessage = "Error interno del servidor.";
        }
      }

      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        confirmButtonText: "Aceptar"
      });
      console.error("Error al actualizar usuario:", error);
    }
  };

  const cancelEdit = () => {
    setEditingUser(null);
    setEditErrors({});
  };

  const handleEditFieldChange = (field, value) => {
    const updatedUser = { ...editingUser, [field]: value };
    setEditingUser(updatedUser);

    // Validar en tiempo real
    const fieldErrors = validateEditField(field, value, editingUser.IdRegistroLogin);
    const newEditErrors = { ...editErrors };

    if (Object.keys(fieldErrors).length > 0) {
      newEditErrors[field] = fieldErrors[field];
    } else {
      delete newEditErrors[field];
    }

    setEditErrors(newEditErrors);
  };

  // Ordenamiento
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Aplicar ordenamiento
  const sortedUsuarios = [...filteredUsuarios].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  // Cálculos para paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsuarios = sortedUsuarios.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedUsuarios.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="px-4 py-20 md:px-8 lg:px-10 max-w-full bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Gestión de Usuarios del Software</h1>

          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar usuario..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={50}
              />
              <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            <button
              onClick={() => {
                setFormVisible(!formVisible);
                if (!formVisible) {
                  setValidationErrors({});
                  reset();
                }
              }}
              className="flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
            >
              <UserPlus size={18} className="mr-2" />
              {formVisible ? "Cancelar" : "Nuevo Usuario"}
            </button>
          </div>
        </div>

        {/* Formulario de creación de usuarios */}
        {formVisible && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">Crear Nuevo Usuario</h2>
            <form onSubmit={handleSubmit(handleCreateUser)}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Usuario */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Usuario <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("Usuario", {
                      required: "El usuario es obligatorio",
                      minLength: { value: 3, message: "Mínimo 3 caracteres" },
                      maxLength: { value: 20, message: "Máximo 20 caracteres" },
                      pattern: {
                        value: /^[A-Za-z0-9_]+$/,
                        message: "Solo letras, números y guión bajo"
                      },
                      validate: {
                        notOnlyNumbers: value => !/^\d+$/.test(value) || "No puede ser solo números",
                        notOnlyUnderscores: value => !/^_+$/.test(value) || "No puede ser solo guiones bajos"
                      }
                    })}
                    className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.Usuario || validationErrors.Usuario ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="Nombre de usuario"
                    maxLength={20}
                  />
                  {(errors.Usuario || validationErrors.Usuario) && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.Usuario?.message || validationErrors.Usuario}
                    </p>
                  )}
                </div>

                {/* Correo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Correo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    {...register("Correo", {
                      required: "El correo es obligatorio",
                      maxLength: { value: 100, message: "Máximo 100 caracteres" },
                      pattern: {
                        value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                        message: "Correo no válido"
                      }
                    })}
                    className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.Correo || validationErrors.Correo ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="correo@ejemplo.com"
                    maxLength={100}
                  />
                  {(errors.Correo || validationErrors.Correo) && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.Correo?.message || validationErrors.Correo}
                    </p>
                  )}
                </div>

                {/* Contraseña */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contraseña <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      {...register("PasswordTexto", {
                        required: "La contraseña es obligatoria",
                        minLength: { value: 6, message: "Mínimo 6 caracteres" },
                        maxLength: { value: 50, message: "Máximo 50 caracteres" },
                        validate: {
                          hasLetter: value => /[A-Za-z]/.test(value) || "Debe contener al menos una letra",
                          hasNumber: value => /\d/.test(value) || "Debe contener al menos un número",
                          noSpaces: value => !/\s/.test(value) || "No puede contener espacios"
                        }
                      })}
                      className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 ${errors.PasswordTexto || validationErrors.PasswordTexto ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="Contraseña"
                      maxLength={50}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-2.5 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {(errors.PasswordTexto || validationErrors.PasswordTexto) && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.PasswordTexto?.message || validationErrors.PasswordTexto}
                    </p>
                  )}
                </div>

                {/* Rol */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rol <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("IdRol", {
                      required: "Debe seleccionar un rol"
                    })}
                    className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.IdRol || validationErrors.IdRol ? 'border-red-500' : 'border-gray-300'
                      }`}
                  >
                    <option value="">Seleccionar Rol</option>
                    {roles.map((role) => (
                      <option key={role.IdRol} value={role.IdRol}>
                        {role.NombreRol}
                      </option>
                    ))}
                  </select>
                  {(errors.IdRol || validationErrors.IdRol) && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.IdRol?.message || validationErrors.IdRol}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-4 py-2 rounded-lg transition-colors duration-200 flex items-center ${isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700'
                    } text-white`}
                >
                  <Plus size={18} className="mr-2" />
                  {isSubmitting ? "Creando..." : "Crear Usuario"}
                </button>
              </div>
            </form>
          </div>
        )}


        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  onClick={() => requestSort("IdRegistroLogin")}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center">
                    ID
                    {sortConfig.key === "IdRegistroLogin" && (
                      <span className="ml-1">
                        {sortConfig.direction === "ascending" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  onClick={() => requestSort("Usuario")}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center">
                    Usuario
                    {sortConfig.key === "Usuario" && (
                      <span className="ml-1">
                        {sortConfig.direction === "ascending" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  onClick={() => requestSort("Correo")}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center">
                    Correo
                    {sortConfig.key === "Correo" && (
                      <span className="ml-1">
                        {sortConfig.direction === "ascending" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  onClick={() => requestSort("IdRol")}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center">
                    Rol
                    {sortConfig.key === "IdRol" && (
                      <span className="ml-1">
                        {sortConfig.direction === "ascending" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentUsuarios.length > 0 ? (
                currentUsuarios.map((user, index) => (
                  <tr
                    key={user.IdRegistroLogin}
                    className={`hover:bg-blue-50 transition-colors duration-150 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{user.IdRegistroLogin}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {editingUser?.IdRegistroLogin === user.IdRegistroLogin ? (
                        <input
                          type="text"
                          value={editingUser.Usuario}
                          onChange={(e) => setEditingUser({ ...editingUser, Usuario: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        user.Usuario
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {editingUser?.IdRegistroLogin === user.IdRegistroLogin ? (
                        <input
                          type="email"
                          value={editingUser.Correo}
                          onChange={(e) => setEditingUser({ ...editingUser, Correo: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        user.Correo
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {editingUser?.IdRegistroLogin === user.IdRegistroLogin ? (
                        <select
                          value={editingUser.IdRol}
                          onChange={(e) => setEditingUser({ ...editingUser, IdRol: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {roles.map((role) => (
                            <option key={role.IdRol} value={role.IdRol}>
                              {role.NombreRol}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          {roles.find((role) => role.IdRol === user.IdRol)?.NombreRol || "N/A"}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        {editingUser?.IdRegistroLogin === user.IdRegistroLogin ? (
                          <>
                            <button
                              onClick={handleUpdateUser}
                              className="p-1 rounded-full bg-green-100 hover:bg-green-200 text-green-600 transition-colors duration-200"
                              title="Confirmar edición"
                            >
                              <Check size={16} />
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors duration-200"
                              title="Cancelar edición"
                            >
                              <X size={16} />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => setEditingUser(user)}
                            className="p-1 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 transition-colors duration-200"
                            title="Editar usuario"
                          >
                            <Edit size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteUser(user.IdRegistroLogin)}
                          className="p-1 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition-colors duration-200"
                          title="Eliminar usuario"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                    No se encontraron usuarios
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {sortedUsuarios.length > 0 && (
          <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
            <div>
              Mostrando {indexOfFirstItem + 1} a {Math.min(indexOfLastItem, sortedUsuarios.length)} de {sortedUsuarios.length} usuarios
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

              {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
                let pageNumber;
                if (totalPages <= 5) {
                  pageNumber = idx + 1;
                } else if (currentPage <= 3) {
                  pageNumber = idx + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + idx;
                } else {
                  pageNumber = currentPage - 2 + idx;
                }

                return (
                  <button
                    key={idx}
                    onClick={() => paginate(pageNumber)}
                    className={`w-10 h-10 rounded-md ${currentPage === pageNumber
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                      }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}

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
    </div>
  );
};

export default UsuariosSoftware;
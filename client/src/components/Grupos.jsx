import React, { useState, useEffect } from "react";
import axios from "axios";
import { Edit, Trash2, Plus } from "lucide-react";

const Grupos = () => {
  const [grupos, setGrupos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newGrupo, setNewGrupo] = useState({
    id: "",
    nombreGrupo: "",
  });

  useEffect(() => {
    fetchGrupos();
  }, []);

 const fetchGrupos = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/grupo", {
      withCredentials: true,
    });
    
    const grupos = response.data.map((grupo) => ({
      id: grupo.IdGrupo,
      nombreGrupo: grupo.NombreGrupo,
    }));
    setGrupos(grupos);
  } catch (error) {
    console.error("Error al obtener grupos:", error);
  }
};

 
   const handleCreateOrUpdateGrupo = async () => {
  try {
    const payload = {
      NombreGrupo: newGrupo.nombreGrupo, // Solo envía el nombre del grupo
    };

    console.log("Payload enviado al backend:", payload); // Depuración

    if (newGrupo.id) {
      // Actualizar grupo
      await axios.put(
        `http://localhost:3000/api/grupo/${newGrupo.id}`,
        payload,
        { withCredentials: true }
      );
    } else {
      // Crear grupo
      await axios.post("http://localhost:3000/api/grupo", payload, {
        withCredentials: true,
      });
    }
    setShowModal(false);
    fetchGrupos(); // Refresca la lista de grupos
  } catch (error) {
    console.error(
      newGrupo.id
        ? "Error al actualizar grupo:"
        : "Error al crear grupo:",
      error
    );
  }
};

  const handleEditGrupo = (grupo) => {
    setNewGrupo(grupo);
    setShowModal(true);
  };

  const handleDeleteGrupo = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este grupo?")) {
      try {
        await axios.delete(`http://localhost:3000/api/grupo/${id}`, {
          withCredentials: true,
        });
        fetchGrupos();
      } catch (error) {
        console.error("Error al eliminar grupo:", error);
      }
    }
  };

  return (
    <div className="px-4 py-20 md:px-8 lg:px-10 max-w-full bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Grupos</h1>
          <button
            onClick={() => {
              setNewGrupo({ id: "", nombreGrupo: "" });
              setShowModal(true);
            }}
            className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            <Plus size={18} className="mr-2" />
            Nuevo Grupo
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {grupos.map((grupo) => (
            <div
              key={grupo.id}
              className="bg-white rounded-lg shadow-md p-4 border border-gray-200"
            >
              <h2 className="text-lg font-bold text-gray-800">
                {grupo.nombreGrupo}
              </h2>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={() => handleEditGrupo(grupo)}
                  className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600"
                  title="Editar grupo"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDeleteGrupo(grupo.id)}
                  className="p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600"
                  title="Eliminar grupo"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg mx-4">
            <h2 className="text-xl font-bold mb-6 text-gray-800">
              {newGrupo.id ? "Editar Grupo" : "Crear Nuevo Grupo"}
            </h2>
            <div className="grid grid-cols-1 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Grupo
                </label>
                <input
                  type="text"
                  value={newGrupo.nombreGrupo}
                  onChange={(e) =>
                    setNewGrupo({ ...newGrupo, nombreGrupo: e.target.value })
                  }
                  className="border border-gray-300 p-2 rounded-lg w-full"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateOrUpdateGrupo}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                {newGrupo.id ? "Actualizar" : "Crear"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Grupos;
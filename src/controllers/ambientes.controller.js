import service from "../services/ambientes.service.js";

export const create = async (req, res) => {
  try {
    console.log("POST /api/ambientes body:", req.body);
    const { codigo, nombre, estado } = req.body;

    if (codigo == null || nombre == null || nombre.toString().trim() === "") {
      return res.status(400).json({ message: "codigo y nombre son requeridos" });
    }
    const codigoNum = Number(codigo);
    if (Number.isNaN(codigoNum)) {
      return res.status(400).json({ message: "codigo debe ser un número" });
    }

    // Validar estado si se proporciona
    if (estado && !['Disponible', 'Asignado'].includes(estado)) {
      return res.status(400).json({ message: "Estado debe ser 'Disponible' o 'Asignado'" });
    }

    const created = await service.create({ 
      codigo: codigoNum, 
      nombre: nombre.toString().trim(),
      estado: estado || 'Disponible'
    });
    return res.status(201).json(created);
  } catch (err) {
    console.error("Error en controller.create ambientes:", {
      message: err.message,
      code: err.code,
      errno: err.errno,
      sqlMessage: err.sqlMessage,
      sql: err.sql,
      stack: err.stack,
    });
    const clientMsg = err.sqlMessage || err.message || "Error creando ambiente";
    return res.status(err.status || 500).json({ message: clientMsg, code: err.code });
  }
};

export const list = async (req, res) => {
  try {
    const rows = await service.getAll();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({ message: err.message || "Error listando ambientes" });
  }
};

export const getOne = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const item = await service.getById(id);
    res.json(item);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || "Error obteniendo ambiente" });
  }
};

export const update = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    
    // Validar estado si se proporciona
    if (req.body.estado && !['Disponible', 'Asignado'].includes(req.body.estado)) {
      return res.status(400).json({ message: "Estado debe ser 'Disponible' o 'Asignado'" });
    }

    const updated = await service.update(id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || "Error actualizando ambiente" });
  }
};

export const remove = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await service.remove(id);
    res.status(204).end();
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || "Error eliminando ambiente" });
  }
};

export default { create, list, getOne, update, remove };
import sequelize from "../config/database.js";
import { QueryTypes } from "sequelize";

const table = "ambientes";

export const findAll = async () => {
  const rows = await sequelize.query(
    `SELECT idAmbiente, codigo, nombre, estado FROM ${table} ORDER BY idAmbiente`,
    { type: QueryTypes.SELECT }
  );
  return rows;
};

export const findById = async (id) => {
  const rows = await sequelize.query(
    `SELECT idAmbiente, codigo, nombre, estado FROM ${table} WHERE idAmbiente = ?`,
    { replacements: [id], type: QueryTypes.SELECT }
  );
  return rows[0];
};

export const create = async ({ codigo, nombre, estado }) => {
  const sql = `INSERT INTO ${table} (codigo, nombre, estado) VALUES (?, ?, ?)`;
  const res = await sequelize.query(sql, { 
    replacements: [codigo, nombre, estado || 'Disponible'] 
  });
  
  let insertId = null;
  if (Array.isArray(res) && res[0] && typeof res[0].insertId !== "undefined") {
    insertId = res[0].insertId;
  } else if (res && typeof res.insertId !== "undefined") {
    insertId = res.insertId;
  } else if (Array.isArray(res) && res[1] && res[1].insertId) {
    insertId = res[1].insertId;
  }
  return { idAmbiente: insertId, codigo, nombre, estado: estado || 'Disponible' };
};

export const updateById = async (id, { codigo, nombre, estado }) => {
  const sql = `UPDATE ${table} SET codigo = ?, nombre = ?, estado = ? WHERE idAmbiente = ?`;
  await sequelize.query(sql, { 
    replacements: [codigo, nombre, estado || 'Disponible', id] 
  });
  return findById(id);
};

export const remove = async (id) => {
  const sql = `DELETE FROM ${table} WHERE idAmbiente = ?`;
  await sequelize.query(sql, { replacements: [id] });
  return true;
};

export default { findAll, findById, create, updateById, remove };
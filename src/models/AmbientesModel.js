import sequelize from "../config/database.js";
import { QueryTypes } from "sequelize";

const table = "ambientes";

export const findAll = async () => {
  const rows = await sequelize.query(
    `SELECT idAmbiente, codigo, nombre FROM ${table} ORDER BY idAmbiente`,
    { type: QueryTypes.SELECT }
  );
  return rows;
};

export const findById = async (id) => {
  const rows = await sequelize.query(
    `SELECT idAmbiente, codigo, nombre FROM ${table} WHERE idAmbiente = ?`,
    { replacements: [id], type: QueryTypes.SELECT }
  );
  return rows[0];
};

export const create = async ({ codigo, nombre }) => {
  const sql = `INSERT INTO ${table} (codigo, nombre) VALUES (?, ?)`;
  const res = await sequelize.query(sql, { replacements: [codigo, nombre] });
  // Respuesta puede variar según driver; intentar obtener insertId de forma segura
  let insertId = null;
  if (Array.isArray(res) && res[0] && typeof res[0].insertId !== "undefined") {
    insertId = res[0].insertId;
  } else if (res && typeof res.insertId !== "undefined") {
    insertId = res.insertId;
  } else if (Array.isArray(res) && res[1] && res[1].insertId) {
    insertId = res[1].insertId;
  }
  return { idAmbiente: insertId, codigo, nombre };
};

export const updateById = async (id, { codigo, nombre }) => {
  const sql = `UPDATE ${table} SET codigo = ?, nombre = ? WHERE idAmbiente = ?`;
  await sequelize.query(sql, { replacements: [codigo, nombre, id] });
  return findById(id);
};

export const remove = async (id) => {
  const sql = `DELETE FROM ${table} WHERE idAmbiente = ?`;
  await sequelize.query(sql, { replacements: [id] });
  // no easy affectedRows here — confirmar con un SELECT si lo necesitas
  return true;
};

export default { findAll, findById, create, updateById, remove };
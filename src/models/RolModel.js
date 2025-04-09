import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Role = sequelize.define("Role", {
  IdRol: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  NombreRol: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: "rol", // Nombre de la tabla en la base de datos
  timestamps: false, // Si no tienes columnas de timestamps como createdAt o updatedAt
});

export default Role;
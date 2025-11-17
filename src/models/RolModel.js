import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Role = sequelize.define("Role", {
  IdRol: {
    type: DataTypes.TINYINT, // ← TINYINT(4) como en BD
    primaryKey: true,
    autoIncrement: true,
    field: "idrol", // ← TODO MINÚSCULAS como en BD
  },
  NombreRol: {
    type: DataTypes.STRING(45),
    allowNull: false,
    field: "NombreRol",
  },
}, {
  tableName: "rol",
  timestamps: false,
  underscored: false,
});

export default Role;
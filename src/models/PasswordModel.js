import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Password = sequelize.define("Password", {
  IdPassword: {
    type: DataTypes.BIGINT, // ← BIGINT(20) como en BD
    primaryKey: true,
    autoIncrement: true,
    field: "idpassword", // ← TODO MINÚSCULAS como en BD
  },
  Password: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: "Password",
  },
  FechaCreacion: {
    type: DataTypes.DATE,
    allowNull: true,
    field: "FechaCreacion",
  },
  FechaActualizacion: {
    type: DataTypes.DATE,
    allowNull: true,
    field: "FechaActualizacion",
  },
  NewPassword: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: "NewPassword",
  },
}, {
  tableName: "password",
  timestamps: false,
  underscored: false,
});

export default Password;
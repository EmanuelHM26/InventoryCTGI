import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Password = sequelize.define("Password", {
    IdPassword: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Password: {
      type: DataTypes.STRING,
      allowNull: false, // Se guarda la contraseña encriptada
    },
    FechaCreacion: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    FechaActualizacion: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: "password",
    timestamps: false,
  });
  
  export default Password;
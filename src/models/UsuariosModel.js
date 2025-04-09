import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Usuario = sequelize.define("Usuario", {
    IdUsuario: {
      type: DataTypes.BIGINT(12),
      primaryKey: true,
      autoIncrement: true,
    },
    Nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    Apellido: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    TipoDocumento: {
      type: DataTypes.STRING(12),
      allowNull: false,
    },
    NumeroDocumento: {
      type: DataTypes.BIGINT(12),
      allowNull: false,
    },
    Usuario: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    Correo: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    IdTiposDocumentos: {
      type: DataTypes.TINYINT(12),
      allowNull: false,
    },
    IdRol: {
      type: DataTypes.TINYINT(4),
      allowNull: false,
    },
    FechaCreacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    FechaActualizacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    HoraCreacion: {
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: sequelize.literal("CURRENT_TIME"),
    },
    HoraActualizacion: {
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: sequelize.literal("CURRENT_TIME"),
    },
  },
  {
    tableName: "usuarios",
    timestamps: false,
  }

);
  
  export default Usuario;
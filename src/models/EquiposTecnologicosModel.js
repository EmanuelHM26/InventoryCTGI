import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const EquiposTecnologicos = sequelize.define(
  "EquiposTecnologicos",
  {
    idequipostecnologicos: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    Codigo: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    Nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    Marca: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    Modelo: {
      type: DataTypes.STRING(40),
      allowNull: false,
    },
    Estado: {
      type: DataTypes.STRING(45),
      allowNull: true,
      defaultValue: null,
    },
    // Se eliminaron IdCodigoBarras e IdEstado
    IdReservaDiaria: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    tableName: "equipostecnologicos",
    timestamps: false,
  }
);

export default EquiposTecnologicos;
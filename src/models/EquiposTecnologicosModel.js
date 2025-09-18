import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const EquiposTecnologicos = sequelize.define(
  "EquiposTecnologicos",
  {
    idequipostecnologicos: {   // usa el mismo nombre que en la BD
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
      type: DataTypes.STRING(100), // igual que en MySQL
      allowNull: false,
    },
    Marca: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    Modelo: {
      type: DataTypes.STRING(40), // igual que en MySQL
      allowNull: false,
    },
    Estado: {
      type: DataTypes.STRING(45), // este faltaba en tu modelo
      allowNull: true,
      defaultValue: null,
    },
    IdCodigoBarras: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
    IdEstado: {
      type: DataTypes.BIGINT,
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

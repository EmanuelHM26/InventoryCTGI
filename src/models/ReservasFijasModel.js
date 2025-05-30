import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const ReservasFijas = sequelize.define("ReservasFijas", {
  idReservaFija: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  nombrePrograma: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  ficha: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  materialReservado: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  Estado: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
}, {
  tableName: "reservasfijas",
  timestamps: false,
});

export default ReservasFijas;
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Usuario from "../models/UsuariosModel.js";

const ReservasDiarias = sequelize.define("ReservasDiarias", {
  idReservaDiaria: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  IdUsuario: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: 'usuarios', // nombre de la tabla referenciada
      key: 'IdUsuario', // llave primaria de la tabla referenciada
    },
  },
  ficha: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  materialReservado: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
}, {
  tableName: "reservasdiarias",
  timestamps: false,
});

// Cada reserva diaria pertenece a un usuario
ReservasDiarias.belongsTo(Usuario, {
  foreignKey: 'IdUsuario',
  targetKey: 'IdUsuario',
  as: 'Usuario'
});

export default ReservasDiarias;
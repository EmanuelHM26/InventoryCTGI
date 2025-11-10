import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Usuario from "../models/UsuariosModel.js";
import EquiposTecnologicos from "../models/EquiposTecnologicosModel.js";
import Ambiente from "../models/AmbientesModel.js";

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
  IdAmbiente: {
  type: DataTypes.INTEGER,
  allowNull: true,
  references: {
    model: 'ambientes',
    key: 'idAmbiente',
    },
  },
  ficha: {
    type: DataTypes.STRING(50),
    allowNull: true,
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



// Una reserva tiene muchos equipos.
// Ejemplo: "La reserva #1 tiene muchos equipos: laptop, proyector, tablet".

// hasOne → tiene uno
// belongsTo → pertenece a uno
// hasMany → tiene muchos
// belongsToMany → pertenece a muchos (muchos a muchos con tabla intermedia)

ReservasDiarias.hasMany(EquiposTecnologicos, {
  foreignKey: 'IdReservaDiaria',
  as: 'Equipos'
});

// Cada equipo tecnológico pertenece a una reserva diaria


// Al final del archivo, antes del export:
ReservasDiarias.belongsTo(Ambiente, {
  foreignKey: 'IdAmbiente',
  targetKey: 'idAmbiente',
  as: 'Ambiente'
});


export default ReservasDiarias;
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const EquiposTecnologicos = sequelize.define('EquiposTecnologicos', {
  IdEquiposTecnologicos: {
    type: DataTypes.BIGINT(9),
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  Cuentadante: {
    type: DataTypes.BIGINT(20),
    allowNull: false,
  },
  Nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  Regional: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  Costo: {
    type: DataTypes.BIGINT(15),
    allowNull: false,
  },
  Modelo: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  IdCodigoBarras: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
  },
  Descripcion: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  DescripcionActual: {
    type: DataTypes.STRING(300),
    allowNull: false,
  },
  Tipo: {
    type: DataTypes.BIGINT(10),
    allowNull: false,
  },
  Atributos: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  Fecha: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  Valor: {
    type: DataTypes.BIGINT(20),
    allowNull: false,
  },
}, {
  tableName: 'equipostecnologicos',
  timestamps: false,
  charset: 'utf8',
  collate: 'utf8_general_ci',
});

export default EquiposTecnologicos;
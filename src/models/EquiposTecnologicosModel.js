import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const EquiposTecnologicos = sequelize.define('EquiposTecnologicos', {
  IdEquiposTecnologicos: {
    type: DataTypes.BIGINT(20),
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  Codigo: {
    type: DataTypes.STRING, // Cambia de BIGINT a STRING
    allowNull: false,
    unique: true
  },
  Nombre: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  Marca: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  Modelo: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  IdCodigoBarras: {
    type: DataTypes.INTEGER(11),
    allowNull: true,
    defaultValue: null,
  },
  IdEstado: {
    type: DataTypes.BIGINT(20),
    allowNull: true,
    defaultValue: null,
  },
}, {
  tableName: 'equipostecnologicos',
  timestamps: false,
  charset: 'utf8',
  collate: 'utf8_general_ci',
});

export default EquiposTecnologicos;
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const EquiposTecnologicos = sequelize.define('EquiposTecnologicos', {
  IdEquiposTecnologicos: {
    type: DataTypes.BIGINT(9),
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  Codigo: {
    type: DataTypes.BIGINT(12),
    allowNull: false,
  },
  Nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  Marca: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  Estado: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  IdEstado: {
    type: DataTypes.BIGINT(9),
    allowNull: false,
  },
  IdCodigoBarras: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
  },
  IdGrupo: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
  },
}, {
  tableName: 'equipostecnologicos',
  timestamps: false,
  charset: 'utf8',
  collate: 'utf8_general_ci',
});

export default EquiposTecnologicos;
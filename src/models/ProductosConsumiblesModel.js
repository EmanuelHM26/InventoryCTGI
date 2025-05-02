import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const ProductosConsumibles = sequelize.define('ProductosConsumibles', {
  IdProductosConsumibles: {
    type: DataTypes.INTEGER(11),
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  Nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  CantidadDisponible: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  IdOriginal: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  IdCodigoBarras: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
  },
}, {
  tableName: 'productosconsumibles',
  timestamps: false,
  charset: 'utf8',
  collate: 'utf8_general_ci',
});

export default ProductosConsumibles;
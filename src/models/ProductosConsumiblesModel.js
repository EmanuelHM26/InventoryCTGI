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
    type: DataTypes.INTEGER(11),
    allowNull: false,
    defaultValue: 0,
  },
  UnidadMedida: {
    type: DataTypes.ENUM('unidad', 'gramaje'),
    allowNull: false,
    defaultValue: 'unidad'
  },
  ValorMedida: {
    type: DataTypes.STRING(50),
    allowNull: true, // Solo aplica para gramaje
  },
}, {
  tableName: 'productosconsumibles',
  timestamps: false,
  charset: 'utf8',
  collate: 'utf8_general_ci',
});

// Las asociaciones se mantienen igual
export const setupProductosConsumiblesAssociations = (models) => {
  ProductosConsumibles.hasMany(models.MovimientosConsumibles, {
    foreignKey: 'IdProductoConsumible',
    as: 'Movimientos'
  });
};

export default ProductosConsumibles;
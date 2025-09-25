import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const MovimientosConsumibles = sequelize.define('MovimientosConsumibles', {
  IdMovimiento: {
    type: DataTypes.INTEGER(11),
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  IdProductoConsumible: {
    type: DataTypes.BIGINT(20),
    allowNull: false,
    references: {
      model: 'productosconsumibles',
      key: 'idproductosconsumibles'
    }
  },
  TipoMovimiento: {
    type: DataTypes.ENUM('entrada', 'salida', 'ajuste'),
    allowNull: false,
  },
  Cantidad: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
  },
  Motivo: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  Usuario: {
    type: DataTypes.STRING(100),
    allowNull: false,
  }
}, {
  tableName: 'movimientosconsumibles',
  timestamps: true,
  charset: 'utf8',
  collate: 'utf8_general_ci',
});

// Función para configurar las asociaciones de MovimientosConsumibles
export const setupMovimientosConsumiblesAssociations = (models) => {
  MovimientosConsumibles.belongsTo(models.ProductosConsumibles, {
    foreignKey: 'IdProductoConsumible',
    as: 'Producto'
  });
};

export default MovimientosConsumibles;
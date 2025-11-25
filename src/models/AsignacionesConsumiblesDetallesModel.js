import { DataTypes } from 'sequelize';
import sequelize from "../config/database.js";

const AsignacionesConsumiblesDetalles = sequelize.define('AsignacionesConsumiblesDetalles', {
  IdDetalle: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  IdAsignacion: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'asignaciones',
      key: 'IdAsignaciones',
    },
  },
  IdProductoConsumible: {
    type: DataTypes.BIGINT(20),
    allowNull: false,
    references: {
      model: 'productosconsumibles',
      key: 'idproductosconsumibles',
    },
  },
  CantidadAsignada: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  CantidadDevuelta: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null,
  },
  ObservacionInicial: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: null,
  },
  NovedadDevolucion: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: null,
  },
  FechaCreacion: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  FechaActualizacion: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'asignaciones_consumibles_detalles',
  timestamps: true,
  createdAt: 'FechaCreacion',
  updatedAt: 'FechaActualizacion',
  charset: 'utf8',
  collate: 'utf8_general_ci',
});

export const setupAsignacionesConsumiblesDetallesAssociations = (models) => {
  AsignacionesConsumiblesDetalles.belongsTo(models.Asignaciones, {
    foreignKey: 'IdAsignacion',
    targetKey: 'IdAsignaciones',
    as: 'Asignacion'
  });

  AsignacionesConsumiblesDetalles.belongsTo(models.ProductosConsumibles, {
    foreignKey: 'IdProductoConsumible',
    targetKey: 'IdProductosConsumibles',
    as: 'ProductoConsumible'
  });
};

export default AsignacionesConsumiblesDetalles;
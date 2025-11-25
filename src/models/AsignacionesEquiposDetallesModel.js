import { DataTypes } from 'sequelize';
import sequelize from "../config/database.js";

const AsignacionesEquiposDetalles = sequelize.define('AsignacionesEquiposDetalles', {
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
  CodigoEquipo: {
    type: DataTypes.STRING(100),
    allowNull: false,
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
  tableName: 'asignaciones_equipos_detalles',
  timestamps: true,
  createdAt: 'FechaCreacion',
  updatedAt: 'FechaActualizacion',
  charset: 'utf8',
  collate: 'utf8_general_ci',
});

export const setupAsignacionesEquiposDetallesAssociations = (models) => {
  AsignacionesEquiposDetalles.belongsTo(models.Asignaciones, {
    foreignKey: 'IdAsignacion',
    targetKey: 'IdAsignaciones',
    as: 'Asignacion'
  });
};

export default AsignacionesEquiposDetalles;
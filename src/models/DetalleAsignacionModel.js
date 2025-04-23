import { DataTypes } from 'sequelize';
import sequelize from "../config/database.js";

const DetalleAsignacion = sequelize.define('DetalleAsignacion', {
  IdDetalleAsignacion: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  Cantidad: {
    type: DataTypes.INTEGER, // Cambié a INTEGER porque veo números en tu tabla
    allowNull: false,
  },
  IdAsignaciones: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'asignaciones',
      key: 'IdAsignaciones',
    },
  },
  IdItem: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'item',
      key: 'IdItem',
    },
  },
  IdOriginal: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
}, {
  tableName: 'detalleasignacion',
  timestamps: false,
  charset: 'utf8',
  collate: 'utf8_general_ci',
});

// Esta función se llamará después de definir todos los modelos
export const setupDetalleAsignacionAssociations = (models) => {
  DetalleAsignacion.belongsTo(models.Asignaciones, {
    foreignKey: 'IdAsignaciones',
    targetKey: 'IdAsignaciones',
    as: 'Asignacion'
  });
  
  DetalleAsignacion.belongsTo(models.Item, {
    foreignKey: 'IdItem',
    targetKey: 'IdItem',
    as: 'Item'
  });
};

export default DetalleAsignacion;
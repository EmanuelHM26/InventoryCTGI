import { DataTypes } from 'sequelize';
import sequelize from "../config/database.js";

const Item = sequelize.define('Item', {
  IdItem: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  Nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  TipoItem: {
    type: DataTypes.STRING(45),
    allowNull: true,
  },
  IdEquiposTecnologicos: {
    type: DataTypes.BIGINT(9),
    allowNull: false,
  },
  IdProductosConsumibles: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'item',
  timestamps: false,
  charset: 'utf8',
  collate: 'utf8_general_ci',
});

// Esta función se llamará después de definir todos los modelos
export const setupItemAssociations = (models) => {
  // Asociaciones con DetalleAsignacion
  Item.hasMany(models.DetalleAsignacion, {
    foreignKey: 'IdItem',
    sourceKey: 'IdItem',
    as: 'Detalles'
  });
  
  // Nota: Las asociaciones con EquiposTecnologicos y ProductosConsumibles no se implementan
  // ya que mencionaste que solo necesitas el modelo Item para DetalleAsignacion
};

export default Item;
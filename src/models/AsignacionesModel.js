import { DataTypes, STRING } from 'sequelize';
import sequelize from "../config/database.js";

const Asignaciones = sequelize.define('Asignaciones', {
  IdAsignaciones: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: false,
    allowNull: false,
  },
  IdUsuario: {
    type: DataTypes.BIGINT(12),
    allowNull: false,
    references: {
      model: 'usuarios', // Nombre de la tabla referenciada
      key: 'IdUsuario',  // Llave primaria de la tabla referenciada
    },
  },
  FechaAsignacion: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    primaryKey: true,
  },
  Observacion: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  FechaDevolucion: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  Cantidad:{
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  Item: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
}, {
  tableName: 'asignaciones',
  timestamps: false, // Desactiva createdAt y updatedAt si no están en la tabla
  charset: 'utf8',
  collate: 'utf8_general_ci',
});

// Esta función se llamará después de definir todos los modelos
export const setupAsignacionesAssociations = (models) => {
  Asignaciones.belongsTo(models.Usuario, {
    foreignKey: 'IdUsuario',
    targetKey: 'IdUsuario',
    as: 'Usuario'
  });
};

export default Asignaciones;
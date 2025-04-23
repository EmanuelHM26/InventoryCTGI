import { DataTypes } from 'sequelize';
import sequelize from "../config/database.js";

const Asignaciones = sequelize.define('Asignaciones', {
  IdAsignaciones: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
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
}, {
  tableName: 'asignaciones',
  timestamps: false, // Desactiva createdAt y updatedAt si no están en la tabla
  charset: 'utf8',
  collate: 'utf8_general_ci',
});

// Exporta una función para definir las relaciones
export const defineAsignacionesRelations = (Usuario) => {
  Asignaciones.belongsTo(Usuario, {
    foreignKey: 'IdUsuario', // Llave foránea en la tabla Asignaciones
    targetKey: 'IdUsuario',  // Llave primaria en la tabla Usuarios
    as: 'Usuario',           // Alias para la relación
  });
};

export default Asignaciones;
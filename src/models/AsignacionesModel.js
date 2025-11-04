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
    type: DataTypes.BIGINT(20),
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'IdUsuario',
    },
  },
  Nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  Apellido: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  Documento: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  FechaAsignacion: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  HoraAsignacion: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  Observacion: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  FechaDevolucion: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    defaultValue: null,
  },
  HoraDevolucion: {
    type: DataTypes.TIME,
    allowNull: true,
    defaultValue: null,
  },
  Novedad: {
    type: DataTypes.STRING(255),
    allowNull: true,
    defaultValue: null,
  },
  Cantidad: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  Item: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },

  Ambiente: {
  type: DataTypes.STRING(100),
  allowNull: false, 
},
CodigoAmbiente: {
  type: DataTypes.STRING(20),
  allowNull: false, 
},

  
CodigosEquipos: {
  type: DataTypes.TEXT,
  allowNull: true,
  defaultValue: null,
},
  Estado: {
    type: DataTypes.STRING(45),
    allowNull: false,
    defaultValue: 'Activo',
  },
}, {
  tableName: 'asignaciones',
  timestamps: false,
  charset: 'utf8',
  collate: 'utf8_general_ci',
});

export const setupAsignacionesAssociations = (models) => {
  Asignaciones.belongsTo(models.Usuario, {
    foreignKey: 'IdUsuario',
    targetKey: 'IdUsuario',
    as: 'Usuario'
  });
};

export default Asignaciones;
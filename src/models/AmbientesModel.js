import { DataTypes } from 'sequelize';
import sequelize from "../config/database.js";

const Ambientes = sequelize.define('Ambientes', {
  idAmbiente: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    field: 'idAmbiente'
  },
  codigo: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  estado: {
    type: DataTypes.STRING(45),
    allowNull: false,
    defaultValue: 'Disponible',
  },
}, {
  tableName: 'ambientes',
  timestamps: false,
  charset: 'utf8',
  collate: 'utf8_general_ci',
});

export const setupAmbientesAssociations = (models) => {
  // Definir relaciones si es necesario en el futuro
  // Ejemplo: Ambientes.hasMany(models.OtraTabla, { foreignKey: 'idAmbiente', as: 'otraTabla' });
};

export default Ambientes;
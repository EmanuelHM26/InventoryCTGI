import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Password from "../models/PasswordModel.js"; // Importa el modelo Password
import Role from "../models/RolModel.js";


const RegistroLogin = sequelize.define("RegistroLogin", {
  IdRegistroLogin: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Usuario: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  Correo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true, // Validación de correo electrónico
    }
  },
  IdPassword: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Password, // Relación con la tabla Password
      key: "IdPassword",
    },
  },
  FechaInicioSesion: {
    type: DataTypes.DATE,
    allowNull: true,  // Permite NULL hasta que el usuario inicie sesión
  },
  HoraInicioSesion: {
    type: DataTypes.TIME,
    allowNull: true,  // Permite NULL hasta que el usuario inicie sesión
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false, // Por defecto, no verificado
    allowNull: false,
  },
  IdRol: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Role,
      key: "IdRol",
    },
  },
}, {
  tableName: "registroLogin",
  timestamps: false,
});

// Relación con la tabla Password
RegistroLogin.belongsTo(Password, { foreignKey: "IdPassword" });
// Relación con la tabla Rol
RegistroLogin.belongsTo(Role, { foreignKey: "IdRol", as: "Rol" });


export default RegistroLogin;


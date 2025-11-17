import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Password from "../models/PasswordModel.js";
import Role from "../models/RolModel.js";

const RegistroLogin = sequelize.define("RegistroLogin", {
  IdRegistroLogin: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: "IdregistroLogin", // ← EXACTO como en BD
  },
  Usuario: {
    type: DataTypes.STRING(45),
    allowNull: false,
    unique: true,
    field: "Usuario",
  },
  Correo: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
    field: "Correo",
  },
  Password: {
    type: DataTypes.STRING(45),
    allowNull: true,
    field: "Password", // Campo de texto en la tabla
  },
  IdPassword: {
    type: DataTypes.BIGINT, // ← BIGINT como en BD
    allowNull: true,
    field: "IdPassword",
  },
  FechaInicioSesion: {
    type: DataTypes.DATE,
    allowNull: true,
    field: "FechaInicioSesion",
  },
  FechaCerrarSesion: {
    type: DataTypes.DATE,
    allowNull: true,
    field: "FechaCerrarSesion",
  },
  HoraInicioSesion: {
    type: DataTypes.TIME,
    allowNull: true,
    field: "HoraInicioSesion",
  },
  HoraCerrarSesion: {
    type: DataTypes.TIME,
    allowNull: true,
    field: "HoraCerrarSesion",
  },
  emailVerified: {
    type: DataTypes.TINYINT, // ← TINYINT(1) como en BD
    defaultValue: 0,
    allowNull: false,
    field: "emailVerified",
  },
  isVerified: {
    type: DataTypes.TINYINT, // ← TINYINT(1) como en BD
    defaultValue: 0,
    allowNull: false,
    field: "isVerified",
  },
  IdRol: {
    type: DataTypes.TINYINT, // ← TINYINT(4) como en BD
    allowNull: false,
    defaultValue: 1,
    field: "IdRol",
  },
}, {
  tableName: "registrologin",
  timestamps: false,
  underscored: false,
});

// Relaciones
RegistroLogin.belongsTo(Password, { 
  foreignKey: "IdPassword",
  targetKey: "IdPassword",
  as: "PasswordData"
});

RegistroLogin.belongsTo(Role, { 
  foreignKey: "IdRol",
  targetKey: "IdRol", 
  as: "Rol" 
});

export default RegistroLogin;
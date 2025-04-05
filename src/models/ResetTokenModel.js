import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import RegistroLogin from "./LoginModel.js";

const ResetToken = sequelize.define("ResetToken", {
  IdResetToken: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Token: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  UsuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: RegistroLogin,
      key: "IdRegistroLogin",
    },
  },
  Expiration: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  tableName: "resetTokens",
  timestamps: false,
});

// Relación con el modelo RegistroLogin
ResetToken.belongsTo(RegistroLogin, { foreignKey: "UsuarioId" });

export default ResetToken;
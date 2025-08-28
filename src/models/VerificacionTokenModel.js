import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import RegistroLogin from "./LoginModel.js";

const VerificationToken = sequelize.define("VerificationToken", {
  IdVerificationToken: {
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
  tableName: "verificationTokens",
  timestamps: false,
});

// Relación con el modelo RegistroLogin
VerificationToken.belongsTo(RegistroLogin, { foreignKey: "UsuarioId", onDelete: "CASCADE", });

export default VerificationToken;

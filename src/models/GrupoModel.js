import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Grupo = sequelize.define("Grupo", {
    IdGrupo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    NombreGrupo: {
        type: DataTypes.STRING(45),
        allowNull: false,
    },
}, {
    tableName: "grupo", 
    timestamps: false, 
});

export default Grupo;
import { DataTypes } from "sequelize";
import sequelize from "../config/database";

const Estado = sequelize.define("Estado", {
    IdEstado: {
        type: DataTypes.BIGINT(9),
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    Estado: {
        type: DataTypes.STRING(120),
        allowNull: false,
    },
    IdInventario: {
        type: DataTypes.MEDIUMINT(8),
        allowNull: false,
        // references temporarily removed as the "inventario" model is not implemented yet
    }
})

export default Estado;
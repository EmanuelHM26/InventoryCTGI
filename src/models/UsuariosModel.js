import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Usuario = sequelize.define("Usuario", {
    IdUsuario: {
      type: DataTypes.BIGINT(12),
      primaryKey: true,
      autoIncrement: true,
    },
    Nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    Apellido: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    TipoDocumento: {
      type: DataTypes.STRING(12),
      allowNull: false,
    },
    NumeroDocumento: {
      type: DataTypes.BIGINT(12),
      allowNull: false,
    },
    
    Correo: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    IdTiposDocumentos: {
      type: DataTypes.TINYINT(12),
      allowNull: false,
    },
    FechaCreacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    FechaActualizacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    HoraCreacion: {
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: sequelize.literal("CURRENT_TIME"),
    },
    HoraActualizacion: {
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: sequelize.literal("CURRENT_TIME"),
    },

    Celular: {
    type: DataTypes.STRING(15),
    allowNull: false,
},
  },
  {
    tableName: "usuarios",
    timestamps: false,
  }
);

// Esta función se llamará después de definir todos los modelos
// hasmany = tiene muchas 
// foreignKey = identificador de dos tablas 
export const setupUsuarioAssociations = (models) => {
  Usuario.hasMany(models.Asignaciones, {
    foreignKey: 'IdUsuario',
    sourceKey: 'IdUsuario',
    as: 'Asignaciones'
  });
};

export default Usuario;






// sourceKey es la opción que especifica el nombre del atributo o clave del modelo origen al que hace referencia la clave externa en una asociación. En otras palabras, si defines una asociación desde un modelo A a un modelo B, y quieres que la clave foránea en el modelo B apunte a un atributo específico en el modelo A en lugar de su ID principal, usarías sourceKey para indicar ese atributo.
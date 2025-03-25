'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    static associate(models) {
      Usuario.hasMany(models.Propiedad, {
        foreignKey: 'propietario_id',
        as: 'propiedades'
      });
      Usuario.hasMany(models.Propiedad, {
        foreignKey: 'agente_id',
        as: 'propiedadesAgente'
      });
      Usuario.hasMany(models.Visita, {
        foreignKey: 'cliente_id',
        as: 'visitas'
      });
    }
  }

  Usuario.init({
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    apellido: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    telefono: DataTypes.STRING(20),
    tipo: {
      type: DataTypes.ENUM('cliente', 'agente', 'admin'),
      defaultValue: 'cliente'
    },
    fecha_registro: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'Usuario',
    tableName: 'usuarios',
    timestamps: true,
    underscored: true
  });

  return Usuario;
}; 
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Direccion extends Model {
    static associate(models) {
      Direccion.hasMany(models.Propiedad, {
        foreignKey: 'direccion_id',
        as: 'propiedades',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }

  Direccion.init({
    calle: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 100]
      }
    },
    numero: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 10]
      }
    },
    piso: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [0, 10]
      }
    },
    departamento: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [0, 10]
      }
    },
    codigo_postal: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [0, 10]
      }
    },
    ciudad: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 100]
      }
    },
    provincia: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 100]
      }
    },
    pais: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: 'Argentina',
      validate: {
        notEmpty: true,
        len: [2, 100]
      }
    }
  }, {
    sequelize,
    modelName: 'Direccion',
    tableName: 'direcciones',
    timestamps: true,
    underscored: true,
    paranoid: true
  });

  return Direccion;
}; 
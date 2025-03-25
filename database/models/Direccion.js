'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Direccion extends Model {
    static associate(models) {
      Direccion.hasMany(models.Producto, {
        foreignKey: 'direccion_id'
      });
    }
  }

  Direccion.init({
    calle: {
      type: DataTypes.STRING,
      allowNull: false
    },
    numero: {
      type: DataTypes.STRING,
      allowNull: false
    },
    piso: DataTypes.STRING,
    departamento: DataTypes.STRING,
    codigo_postal: DataTypes.STRING,
    ciudad: {
      type: DataTypes.STRING,
      allowNull: false
    },
    provincia: {
      type: DataTypes.STRING,
      allowNull: false
    },
    pais: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: 'Argentina'
    }
  }, {
    sequelize,
    modelName: 'Direccion',
    tableName: 'direcciones',
    timestamps: true,
    underscored: true
  });

  return Direccion;
}; 
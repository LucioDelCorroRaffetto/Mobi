'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Zona extends Model {
    static associate(models) {
      Zona.hasMany(models.Barrio, {
        foreignKey: 'zona_id',
        as: 'barrios',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });
    }
  }

  Zona.init({
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 100]
      }
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: [0, 1000]
      }
    }
  }, {
    sequelize,
    modelName: 'Zona',
    tableName: 'zonas',
    timestamps: true,
    underscored: true,
    paranoid: true // Soft deletes
  });

  return Zona;
}; 
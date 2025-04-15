'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Caracteristica extends Model {
    static associate(models) {
      Caracteristica.belongsToMany(models.Propiedad, {
        through: 'propiedad_caracteristica',
        foreignKey: 'caracteristica_id',
        otherKey: 'propiedad_id',
        as: 'propiedades',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }

  Caracteristica.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 100]
      }
    },
    categoria: {
      type: DataTypes.ENUM('general','servicios','comodidades','seguridad'),
      allowNull: false,
      defaultValue: 'general'
    },
    icono: {
      type: DataTypes.STRING(50),
      allowNull: true,
      validate: {
        len: [0, 50]
      }
    },
    descripcion: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        len: [0, 255]
      }
    }
  }, {
    sequelize,
    modelName: 'Caracteristica',
    tableName: 'caracteristicas',
    timestamps: true,
    underscored: true,
    paranoid: true // Soft deletes
  });

  return Caracteristica;
}; 
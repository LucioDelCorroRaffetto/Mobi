'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Barrio extends Model {
    static associate(models) {
      Barrio.belongsTo(models.Zona, {
        foreignKey: 'zona_id',
        as: 'zona',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });
      Barrio.hasMany(models.Propiedad, {
        foreignKey: 'barrio_id',
        as: 'propiedades',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });
    }
  }

  Barrio.init({
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 100]
      }
    },
    zona_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'zonas',
        key: 'id'
      },
      validate: {
        isInt: true
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
    modelName: 'Barrio',
    tableName: 'barrios',
    timestamps: true,
    underscored: true,
    paranoid: true // Soft deletes
  });

  return Barrio;
}; 
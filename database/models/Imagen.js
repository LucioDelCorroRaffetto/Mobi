'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Imagen extends Model {
    static associate(models) {
      Imagen.belongsTo(models.Propiedad, {
        foreignKey: 'propiedad_id'
      });
    }
  }

  Imagen.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    url: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    descripcion: DataTypes.STRING(255),
    orden: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    es_principal: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Imagen',
    tableName: 'imagenes',
    timestamps: true,
    underscored: true
  });

  return Imagen;
}; 
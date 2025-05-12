'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Favorite extends Model {
    static associate(models) {
      Favorite.belongsTo(models.Usuario, {
        foreignKey: 'usuario_id',
        as: 'usuario'
      });
      Favorite.belongsTo(models.Propiedad, {
        foreignKey: 'propiedad_id',
        as: 'propiedad'
      });
    }
  }

  Favorite.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id'
      }
    },
    propiedad_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'propiedades',
        key: 'id'
      }
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Favorite',
    tableName: 'favorites',
    timestamps: false,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['usuario_id', 'propiedad_id']
      }
    ]
  });

  return Favorite;
}; 
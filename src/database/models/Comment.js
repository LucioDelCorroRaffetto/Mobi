'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      Comment.belongsTo(models.Usuario, {
        foreignKey: 'usuario_id',
        as: 'usuario',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
      Comment.belongsTo(models.Propiedad, {
        foreignKey: 'propiedad_id',
        as: 'propiedad',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }

  Comment.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    propiedad_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'propiedades',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    contenido: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Comment',
    tableName: 'comments',
    timestamps: false,
    underscored: true,
    indexes: [
      {
        fields: ['propiedad_id']
      },
      {
        fields: ['usuario_id']
      }
    ]
  });

  return Comment;
}; 
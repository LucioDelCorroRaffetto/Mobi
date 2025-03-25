'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Producto extends Model {
    static associate(models) {
      Producto.belongsTo(models.Usuario, {
        foreignKey: 'propietario_id',
        as: 'propietario'
      });
      Producto.belongsTo(models.Usuario, {
        foreignKey: 'agente_id',
        as: 'agente'
      });
      Producto.belongsTo(models.Direccion, {
        foreignKey: 'direccion_id'
      });
    }
  }

  Producto.init({
    direccion: {
      type: DataTypes.STRING,
      allowNull: false
    },
    barrio: {
      type: DataTypes.STRING,
      allowNull: false
    },
    zona: DataTypes.STRING,
    ambientes: DataTypes.INTEGER,
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    tipo: DataTypes.STRING,
    foto: DataTypes.STRING,
    m2: DataTypes.INTEGER,
    propietario_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'usuarios',
        key: 'id'
      }
    },
    agente_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'usuarios',
        key: 'id'
      }
    },
    direccion_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'direcciones',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Producto',
    tableName: 'productos',
    timestamps: true,
    underscored: true
  });

  return Producto;
}; 
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Propiedad extends Model {
    static associate(models) {
      Propiedad.belongsTo(models.Usuario, {
        foreignKey: 'propietario_id',
        as: 'propietario'
      });
      Propiedad.belongsTo(models.Usuario, {
        foreignKey: 'agente_id',
        as: 'agente'
      });
      Propiedad.belongsTo(models.Direccion, {
        foreignKey: 'direccion_id'
      });
      Propiedad.hasMany(models.Imagen, {
        foreignKey: 'propiedad_id',
        as: 'imagenes'
      });
    }
  }

  Propiedad.init({
    titulo: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    descripcion: DataTypes.TEXT,
    tipo: {
      type: DataTypes.ENUM('casa', 'departamento', 'terreno', 'oficina', 'local', 'garage'),
      allowNull: false
    },
    precio: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },
    moneda: {
      type: DataTypes.ENUM('ARS', 'USD'),
      defaultValue: 'USD'
    },
    ambientes: DataTypes.INTEGER,
    dormitorios: DataTypes.INTEGER,
    baños: DataTypes.INTEGER,
    orientacion: DataTypes.ENUM('norte', 'sur', 'este', 'oeste'),
    estado: {
      type: DataTypes.ENUM('disponible', 'reservada', 'vendida', 'alquilada'),
      defaultValue: 'disponible'
    },
    direccion_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'direcciones',
        key: 'id'
      }
    },
    propietario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id'
      }
    },
    agente_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Propiedad',
    tableName: 'propiedades',
    timestamps: true,
    underscored: true
  });

  return Propiedad;
}; 
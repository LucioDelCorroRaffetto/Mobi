'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Visita extends Model {
    static associate(models) {
      Visita.belongsTo(models.Propiedad, {
        foreignKey: 'propiedad_id',
        as: 'propiedad',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
      Visita.belongsTo(models.Usuario, {
        as: 'cliente',
        foreignKey: 'cliente_id',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });
      Visita.belongsTo(models.Usuario, {
        as: 'agente',
        foreignKey: 'agente_id',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });
    }
  }

  Visita.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    fecha_hora: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true
      }
    },
    estado: {
      type: DataTypes.ENUM('pendiente','confirmada','cancelada','realizada'),
      defaultValue: 'pendiente'
    },
    propiedad_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'propiedades',
        key: 'id'
      },
      validate: {
        isInt: true
      }
    },
    cliente_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id'
      },
      validate: {
        isInt: true
      }
    },
    agente_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id'
      },
      validate: {
        isInt: true
      }
    },
    notas: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: [0, 1000]
      }
    }
  }, {
    sequelize,
    modelName: 'Visita',
    tableName: 'visitas',
    timestamps: true,
    underscored: true,
    paranoid: true // Soft deletes
  });

  return Visita;
}; 
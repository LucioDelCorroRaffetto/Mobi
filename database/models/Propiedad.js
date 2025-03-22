const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Propiedad extends Model {}

Propiedad.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  titulo: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT
  },
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
  ambientes: {
    type: DataTypes.INTEGER
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
  }
}, {
  sequelize,
  modelName: 'Propiedad',
  tableName: 'propiedades',
  timestamps: true,
  underscored: true
});

module.exports = Propiedad; 
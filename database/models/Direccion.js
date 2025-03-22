const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Direccion extends Model {}

Direccion.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  calle: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  numero: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  piso: {
    type: DataTypes.STRING(10)
  },
  departamento: {
    type: DataTypes.STRING(10)
  },
  codigo_postal: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  ciudad: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  provincia: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  pais: {
    type: DataTypes.STRING(100),
    allowNull: false,
    defaultValue: 'Argentina'
  }
}, {
  sequelize,
  modelName: 'Direccion',
  tableName: 'direcciones',
  timestamps: false
});

module.exports = Direccion; 
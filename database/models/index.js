'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Relaciones Usuario-Propiedad
db.Usuario.hasMany(db.Propiedad, {
  foreignKey: 'propietario_id',
  as: 'propiedadesEnPropiedad'
});
db.Propiedad.belongsTo(db.Usuario, {
  foreignKey: 'propietario_id',
  as: 'propietario'
});

db.Usuario.hasMany(db.Propiedad, {
  foreignKey: 'agente_id',
  as: 'propiedadesAsignadas'
});
db.Propiedad.belongsTo(db.Usuario, {
  foreignKey: 'agente_id',
  as: 'agente'
});

// Relaciones Direccion-Propiedad
db.Direccion.hasOne(db.Propiedad, {
  foreignKey: 'direccion_id'
});
db.Propiedad.belongsTo(db.Direccion, {
  foreignKey: 'direccion_id'
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = {
  Usuario: db.Usuario,
  Direccion: db.Direccion,
  Propiedad: db.Propiedad
};

const sequelize = require('./database/config/database');

async function sincronizarDB() {
  try {
    await sequelize.sync({ force: true }); // ¡Cuidado! force: true borrará las tablas existentes
    console.log('Base de datos sincronizada');
  } catch (error) {
    console.error('Error al sincronizar:', error);
  }
}

const { Sequelize } = require('sequelize');
const config = require('./config/config.js');
const Comment = require('./models/Comment');
const Favorite = require('./models/Favorite');
const Propiedad = require('./models/Propiedad');
const Usuario = require('./models/Usuario');

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
        host: config.host,
        dialect: config.dialect,
        logging: false
    }
);

// Forzar sincronización de modelos
sequelize.sync({ force: false, alter: true })
    .then(() => {
        console.log('Base de datos sincronizada correctamente');
    })
    .catch(error => {
        console.error('Error al sincronizar la base de datos:', error);
    });

module.exports = sequelize; 
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('inmobiliaria_db', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
  define: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
    timestamps: true
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

module.exports = sequelize; 
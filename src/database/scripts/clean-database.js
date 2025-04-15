const { Sequelize } = require('sequelize');
const config = require('../config/config.js');

async function cleanDatabase() {
  const env = process.env.NODE_ENV || 'development';
  const sequelize = new Sequelize(config[env]);

  try {
    // Desactivar temporalmente las restricciones de clave foránea
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

    // Limpiar todas las tablas
    await sequelize.query('TRUNCATE TABLE propiedades');
    await sequelize.query('TRUNCATE TABLE usuarios');
    await sequelize.query('TRUNCATE TABLE direcciones');
    await sequelize.query('TRUNCATE TABLE caracteristicas');
    await sequelize.query('TRUNCATE TABLE barrios');
    await sequelize.query('TRUNCATE TABLE zonas');
    await sequelize.query('TRUNCATE TABLE categorias');

    // Reactivar las restricciones de clave foránea
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

    console.log('Base de datos limpiada exitosamente');
    await sequelize.close();
  } catch (error) {
    console.error('Error al limpiar la base de datos:', error);
    await sequelize.close();
    throw error;
  }
}

module.exports = cleanDatabase; 
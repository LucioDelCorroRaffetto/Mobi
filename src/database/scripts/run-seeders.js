"use strict";

const { Sequelize } = require('sequelize');
const config = require('../config/config.js').development;
const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect
});

async function runSeeders() {
  try {
    // 0. Limpiar la base de datos
    console.log('Limpiando la base de datos...');
    const cleanDatabase = require('./clean-database.js');
    await cleanDatabase();

    // 1. Datos iniciales (zonas, barrios, categorías)
    console.log('Ejecutando seeder de datos iniciales...');
    const datosIniciales = require('../seeders/20240320000002-datos-iniciales.js');
    await datosIniciales.up(sequelize.getQueryInterface(), Sequelize);

    // 2. Características
    console.log('Ejecutando seeder de características...');
    const caracteristicas = require('../seeders/20240320000002-caracteristicas.js');
    await caracteristicas.up(sequelize.getQueryInterface(), Sequelize);

    // 3. Direcciones
    console.log('Ejecutando seeder de direcciones...');
    const direcciones = require('../seeders/20240320000003-direcciones.js');
    await direcciones.up(sequelize.getQueryInterface(), Sequelize);

    // 4. Usuarios
    console.log('Ejecutando seeder de usuarios...');
    const usuarios = require('../seeders/20240320000001-usuarios.js');
    await usuarios.up(sequelize.getQueryInterface(), Sequelize);

    // 5. Propiedades
    console.log('Ejecutando seeder de propiedades...');
    const propiedades = require('../seeders/20240320000005-propiedades.js');
    await propiedades.up(sequelize.getQueryInterface(), Sequelize);

    // 6. Visitas y características de propiedades
    console.log('Ejecutando seeder de visitas y características...');
    const visitasCaracteristicas = require('../seeders/20240320000006-visitas-y-caracteristicas.js');
    await visitasCaracteristicas.up(sequelize.getQueryInterface(), Sequelize);

    // 7. Admin
    console.log('Ejecutando seeder de admin...');
    const admin = require('../seeders/20240320000008-create-admin-user.js');
    await admin.up(sequelize.getQueryInterface(), Sequelize);

    console.log('Todos los seeders se han ejecutado correctamente.');
  } catch (error) {
    console.error('Error al ejecutar los seeders:', error);
  } finally {
    await sequelize.close();
  }
}

// Ejecutar los seeders
runSeeders(); 
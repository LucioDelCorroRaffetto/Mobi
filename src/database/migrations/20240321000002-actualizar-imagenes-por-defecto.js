"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Actualizar los valores por defecto en la tabla de usuarios
    await queryInterface.changeColumn('usuarios', 'imagen', {
      type: Sequelize.STRING(255),
      allowNull: true,
      defaultValue: 'images/products/budapest.jpg'
    });

    // Actualizar los valores por defecto en la tabla de propiedades
    await queryInterface.changeColumn('propiedades', 'imagen', {
      type: Sequelize.STRING(255),
      allowNull: true,
      defaultValue: 'images/products/budapest.jpg'
    });

    // Actualizar los registros existentes que tengan valores por defecto antiguos
    await queryInterface.sequelize.query(`
      UPDATE usuarios 
      SET imagen = 'images/products/budapest.jpg' 
      WHERE imagen = 'default-user.jpg' OR imagen IS NULL
    `);

    await queryInterface.sequelize.query(`
      UPDATE propiedades 
      SET imagen = 'images/products/budapest.jpg' 
      WHERE imagen = 'default-property.jpg' OR imagen IS NULL
    `);
  },

  async down(queryInterface, Sequelize) {
    // Revertir los valores por defecto en la tabla de usuarios
    await queryInterface.changeColumn('usuarios', 'imagen', {
      type: Sequelize.STRING(255),
      allowNull: true,
      defaultValue: 'default-user.jpg'
    });

    // Revertir los valores por defecto en la tabla de propiedades
    await queryInterface.changeColumn('propiedades', 'imagen', {
      type: Sequelize.STRING(255),
      allowNull: true,
      defaultValue: 'default-property.jpg'
    });

    // Revertir los registros actualizados
    await queryInterface.sequelize.query(`
      UPDATE usuarios 
      SET imagen = 'default-user.jpg' 
      WHERE imagen = 'images/products/budapest.jpg'
    `);

    await queryInterface.sequelize.query(`
      UPDATE propiedades 
      SET imagen = 'default-property.jpg' 
      WHERE imagen = 'images/products/budapest.jpg'
    `);
  }
}; 
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      await queryInterface.renameColumn('propiedades', 'baños', 'banos');
    } catch (error) {
      console.error('Error al renombrar la columna:', error);
      // Si la columna no existe, creamos una nueva
      if (error.name === 'SequelizeDatabaseError') {
        await queryInterface.addColumn('propiedades', 'banos', {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0
        });
      } else {
        throw error;
      }
    }
  },

  async down (queryInterface, Sequelize) {
    try {
      await queryInterface.renameColumn('propiedades', 'banos', 'baños');
    } catch (error) {
      console.error('Error al revertir el cambio:', error);
      if (error.name === 'SequelizeDatabaseError') {
        await queryInterface.removeColumn('propiedades', 'banos');
      } else {
        throw error;
      }
    }
  }
}; 
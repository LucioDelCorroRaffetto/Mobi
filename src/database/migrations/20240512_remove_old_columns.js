'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /*
    // Aquí estaba el código para eliminar columnas antiguas
    await queryInterface.removeColumn('comments', 'product_id');
    await queryInterface.removeColumn('favorites', 'product_id');
    await queryInterface.removeColumn('favorites', 'user_id');
    */
  },

  down: async (queryInterface, Sequelize) => {
    /*
    // Aquí estaba el código para restaurar columnas antiguas
    await queryInterface.addColumn('comments', 'product_id', {
      type: Sequelize.INTEGER
    });
    await queryInterface.addColumn('favorites', 'product_id', {
      type: Sequelize.INTEGER
    });
    await queryInterface.addColumn('favorites', 'user_id', {
      type: Sequelize.INTEGER
    });
    */
  }
}; 
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Primero eliminamos la tabla existente
    await queryInterface.dropTable('favorites');

    // Creamos la tabla con la estructura correcta
    await queryInterface.createTable('favorites', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      propiedad_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'propiedades',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Creamos los índices
    await queryInterface.addIndex('favorites', ['usuario_id']);
    await queryInterface.addIndex('favorites', ['propiedad_id']);
    await queryInterface.addIndex('favorites', ['usuario_id', 'propiedad_id'], {
      unique: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('favorites');
  }
}; 
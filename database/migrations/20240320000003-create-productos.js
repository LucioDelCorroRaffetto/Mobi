'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('productos', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      direccion: {
        type: Sequelize.STRING,
        allowNull: false
      },
      barrio: {
        type: Sequelize.STRING,
        allowNull: false
      },
      zona: Sequelize.STRING,
      ambientes: Sequelize.INTEGER,
      precio: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      tipo: Sequelize.STRING,
      foto: Sequelize.STRING,
      m2: Sequelize.INTEGER,
      direccion_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'direcciones',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      propietario_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'usuarios',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      agente_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'usuarios',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('productos');
  }
}; 
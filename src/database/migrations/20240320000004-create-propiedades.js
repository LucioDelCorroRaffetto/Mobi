'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('propiedades', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      titulo: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      descripcion: Sequelize.TEXT,
      tipo: {
        type: Sequelize.ENUM('venta', 'alquiler'),
        allowNull: false
      },
      precio: {
        type: Sequelize.DECIMAL(12,2),
        allowNull: false
      },
      moneda: {
        type: Sequelize.ENUM('ARS','USD'),
        defaultValue: 'USD'
      },
      ambientes: Sequelize.INTEGER,
      dormitorios: Sequelize.INTEGER,
      baños: Sequelize.INTEGER,
      orientacion: Sequelize.ENUM('norte','sur','este','oeste'),
      estado: {
        type: Sequelize.ENUM('disponible','reservada','vendida','alquilada'),
        defaultValue: 'disponible'
      },
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
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      agente_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('propiedades');
  }
}; 
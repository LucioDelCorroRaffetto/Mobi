module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('propiedades', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      titulo: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      descripcion: Sequelize.TEXT,
      tipo: {
        type: Sequelize.ENUM('casa','departamento','terreno','oficina','local','garage'),
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
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('propiedades');
  }
}; 
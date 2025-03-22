'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Usuarios
    await queryInterface.createTable('usuarios', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      nombre: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      apellido: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      tipo: {
        type: Sequelize.ENUM('cliente', 'agente', 'admin'),
        defaultValue: 'cliente'
      },
      fecha_registro: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      activo: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Direcciones
    await queryInterface.createTable('direcciones', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      calle: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      numero: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      piso: {
        type: Sequelize.STRING(10),
        allowNull: true
      },
      departamento: {
        type: Sequelize.STRING(10),
        allowNull: true
      },
      codigo_postal: {
        type: Sequelize.STRING(10),
        allowNull: false
      },
      ciudad: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      provincia: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      pais: {
        type: Sequelize.STRING(100),
        allowNull: false,
        defaultValue: 'Argentina'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Propiedades
    await queryInterface.createTable('propiedades', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      titulo: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      tipo: {
        type: Sequelize.ENUM('casa', 'departamento', 'terreno', 'oficina', 'local', 'garage'),
        allowNull: false
      },
      precio: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false
      },
      moneda: {
        type: Sequelize.ENUM('ARS', 'USD'),
        defaultValue: 'USD'
      },
      superficie_total: {
        type: Sequelize.DECIMAL(8, 2),
        allowNull: true
      },
      superficie_cubierta: {
        type: Sequelize.DECIMAL(8, 2),
        allowNull: true
      },
      ambientes: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      cocheras: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      estado: {
        type: Sequelize.ENUM('disponible', 'reservada', 'vendida', 'alquilada'),
        defaultValue: 'disponible'
      },
      direccion_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'direcciones',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true
      },
      propietario_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'usuarios',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true
      },
      agente_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'usuarios',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('propiedades');
    await queryInterface.dropTable('direcciones');
    await queryInterface.dropTable('usuarios');
  }
};
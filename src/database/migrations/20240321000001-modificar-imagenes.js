"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Agregar columna de imagen a la tabla de usuarios si no existe
    const usuariosColumns = await queryInterface.describeTable('usuarios');
    if (!usuariosColumns.imagen) {
      await queryInterface.addColumn('usuarios', 'imagen', {
        type: Sequelize.STRING(255),
        allowNull: true,
        defaultValue: 'images/products/budapest.jpg'
      });
    }

    // 2. Agregar columna de imagen a la tabla de propiedades si no existe
    const propiedadesColumns = await queryInterface.describeTable('propiedades');
    if (!propiedadesColumns.imagen) {
      await queryInterface.addColumn('propiedades', 'imagen', {
        type: Sequelize.STRING(255),
        allowNull: true,
        defaultValue: 'images/products/budapest.jpg'
      });
    }

    // 3. Copiar las imágenes de la columna 'foto' a la columna 'imagen' en la tabla de propiedades
    if (propiedadesColumns.foto) {
      await queryInterface.sequelize.query(`
        UPDATE propiedades 
        SET imagen = foto 
        WHERE foto IS NOT NULL
      `);
    }

    // 4. Eliminar la tabla de imágenes si existe
    const tables = await queryInterface.sequelize.query(
      `SHOW TABLES LIKE 'imagenes'`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    
    if (tables.length > 0) {
      await queryInterface.dropTable('imagenes');
    }
  },

  async down(queryInterface, Sequelize) {
    // 1. Recrear la tabla de imágenes
    await queryInterface.createTable('imagenes', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      propiedad_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'propiedades',
          key: 'id'
        }
      },
      url: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      descripcion: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      orden: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      es_principal: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });

    // 2. Copiar las imágenes de propiedades a la tabla de imágenes
    await queryInterface.sequelize.query(`
      INSERT INTO imagenes (propiedad_id, url, descripcion, orden, es_principal, created_at, updated_at)
      SELECT id, imagen, 'Imagen principal', 0, 1, NOW(), NOW()
      FROM propiedades
      WHERE imagen IS NOT NULL
    `);

    // 3. Eliminar la columna de imagen de la tabla de propiedades
    await queryInterface.removeColumn('propiedades', 'imagen');

    // 4. Eliminar la columna de imagen de la tabla de usuarios
    await queryInterface.removeColumn('usuarios', 'imagen');
  }
}; 
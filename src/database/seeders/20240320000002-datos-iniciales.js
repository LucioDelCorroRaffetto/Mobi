"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Insertamos las zonas
    await queryInterface.bulkInsert(
      "zonas",
      [
        { 
          nombre: 'Norte', 
          created_at: new Date(), 
          updated_at: new Date() 
        },
        { 
          nombre: 'Sur', 
          created_at: new Date(), 
          updated_at: new Date() 
        },
        { 
          nombre: 'Este', 
          created_at: new Date(), 
          updated_at: new Date() 
        },
        { 
          nombre: 'Oeste', 
          created_at: new Date(), 
          updated_at: new Date() 
        },
        { 
          nombre: 'Centro', 
          created_at: new Date(), 
          updated_at: new Date() 
        }
      ],
      {}
    );

    // Insertamos los barrios
    await queryInterface.bulkInsert(
      "barrios",
      [
        { 
          nombre: 'Palermo', 
          zona_id: 1, 
          created_at: new Date(), 
          updated_at: new Date() 
        },
        { 
          nombre: 'Recoleta', 
          zona_id: 1, 
          created_at: new Date(), 
          updated_at: new Date() 
        },
        { 
          nombre: 'Belgrano', 
          zona_id: 1, 
          created_at: new Date(), 
          updated_at: new Date() 
        },
        { 
          nombre: 'Caballito', 
          zona_id: 2, 
          created_at: new Date(), 
          updated_at: new Date() 
        },
        { 
          nombre: 'Flores', 
          zona_id: 2, 
          created_at: new Date(), 
          updated_at: new Date() 
        },
        { 
          nombre: 'Puerto Madero', 
          zona_id: 3, 
          created_at: new Date(), 
          updated_at: new Date() 
        },
        { 
          nombre: 'Villa Crespo', 
          zona_id: 4, 
          created_at: new Date(), 
          updated_at: new Date() 
        },
        { 
          nombre: 'Almagro', 
          zona_id: 5, 
          created_at: new Date(), 
          updated_at: new Date() 
        }
      ],
      {}
    );

    // Insertamos las categorías
    await queryInterface.bulkInsert(
      "categorias",
      [
        { 
          nombre: 'Casa', 
          descripcion: 'Propiedades unifamiliares',
          created_at: new Date(), 
          updated_at: new Date() 
        },
        { 
          nombre: 'Departamento', 
          descripcion: 'Unidades en edificios',
          created_at: new Date(), 
          updated_at: new Date() 
        },
        { 
          nombre: 'Oficina', 
          descripcion: 'Espacios comerciales para oficinas',
          created_at: new Date(), 
          updated_at: new Date() 
        },
        { 
          nombre: 'Local', 
          descripcion: 'Espacios comerciales',
          created_at: new Date(), 
          updated_at: new Date() 
        },
        { 
          nombre: 'Terreno', 
          descripcion: 'Lotes para construcción',
          created_at: new Date(), 
          updated_at: new Date() 
        }
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("categorias", null, {});
    await queryInterface.bulkDelete("barrios", null, {});
    await queryInterface.bulkDelete("zonas", null, {});
  }
}; 
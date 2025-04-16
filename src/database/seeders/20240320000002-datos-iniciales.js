"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Insertamos las zonas
    await queryInterface.bulkInsert(
      "zonas",
      [
        { 
          nombre: 'Norte'
        },
        { 
          nombre: 'Sur'
        },
        { 
          nombre: 'Este'
        },
        { 
          nombre: 'Oeste'
        },
        { 
          nombre: 'Centro'
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
          zona_id: 1
        },
        { 
          nombre: 'Recoleta', 
          zona_id: 1
        },
        { 
          nombre: 'Belgrano', 
          zona_id: 1
        },
        { 
          nombre: 'Caballito', 
          zona_id: 2
        },
        { 
          nombre: 'Flores', 
          zona_id: 2
        },
        { 
          nombre: 'Puerto Madero', 
          zona_id: 3
        },
        { 
          nombre: 'Villa Crespo', 
          zona_id: 4
        },
        { 
          nombre: 'Almagro', 
          zona_id: 5
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
          descripcion: 'Propiedades unifamiliares'
        },
        { 
          nombre: 'Departamento', 
          descripcion: 'Unidades en edificios'
        },
        { 
          nombre: 'Oficina', 
          descripcion: 'Espacios comerciales para oficinas'
        },
        { 
          nombre: 'Local', 
          descripcion: 'Espacios comerciales'
        },
        { 
          nombre: 'Terreno', 
          descripcion: 'Lotes para construcción'
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
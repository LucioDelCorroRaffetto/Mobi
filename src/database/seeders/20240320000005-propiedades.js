"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Primero obtenemos los IDs de los usuarios
    const [usuarios] = await queryInterface.sequelize.query(
      `SELECT id, tipo FROM usuarios WHERE tipo IN ('cliente', 'agente')`
    );

    const cliente = usuarios.find(u => u.tipo === 'cliente');
    const agente = usuarios.find(u => u.tipo === 'agente');

    if (!cliente || !agente) {
      throw new Error('No se encontraron los usuarios necesarios');
    }

    await queryInterface.bulkInsert(
      "propiedades",
      [
        {
          titulo: 'Casa moderna en Palermo',
          descripcion: 'Hermosa casa moderna con amplio jardín',
          tipo: 'venta',
          precio: 250000,
          moneda: 'USD',
          ambientes: 4,
          dormitorios: 2,
          baños: 2,
          orientacion: 'norte',
          estado: 'disponible',
          direccion_id: 1,
          barrio_id: 1,
          propietario_id: cliente.id,
          agente_id: agente.id,
          categoria_id: 1,
          m2: 100,
          imagen: '/images/products/budapest.jpg',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          titulo: 'Departamento en Recoleta',
          descripcion: 'Lujoso departamento con vista panorámica',
          tipo: 'alquiler',
          precio: 1500,
          moneda: 'USD',
          ambientes: 5,
          dormitorios: 3,
          baños: 2,
          orientacion: 'este',
          estado: 'disponible',
          direccion_id: 1,
          barrio_id: 2,
          propietario_id: cliente.id,
          agente_id: agente.id,
          categoria_id: 2,
          m2: 120,
          imagen: '/images/products/budapest.jpg',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          titulo: 'Oficina en Belgrano',
          descripcion: 'Oficina moderna en zona comercial',
          tipo: 'venta',
          precio: 180000,
          moneda: 'USD',
          ambientes: 4,
          dormitorios: 2,
          baños: 2,
          orientacion: 'este',
          estado: 'disponible',
          direccion_id: 1,
          barrio_id: 3,
          propietario_id: cliente.id,
          agente_id: agente.id,
          categoria_id: 1,
          m2: 90,
          imagen: '/images/products/budapest.jpg',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          titulo: 'Local en Caballito',
          descripcion: 'Local comercial en zona de alto tránsito',
          tipo: 'alquiler',
          precio: 800,
          moneda: 'USD',
          ambientes: 3,
          dormitorios: 2,
          baños: 1,
          orientacion: 'oeste',
          estado: 'disponible',
          direccion_id: 1,
          barrio_id: 4,
          propietario_id: cliente.id,
          agente_id: agente.id,
          categoria_id: 2,
          m2: 75,
          imagen: '/images/products/budapest.jpg',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          titulo: 'Casa en Flores',
          descripcion: 'Casa familiar con patio',
          tipo: 'venta',
          precio: 120000,
          moneda: 'USD',
          ambientes: 4,
          dormitorios: 2,
          baños: 2,
          orientacion: 'sur',
          estado: 'disponible',
          direccion_id: 1,
          barrio_id: 5,
          propietario_id: cliente.id,
          agente_id: agente.id,
          categoria_id: 1,
          m2: 85,
          imagen: '/images/products/buenaSuerteCharlie.jpg',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          titulo: 'Departamento en Puerto Madero',
          descripcion: 'Departamento de lujo con vista al río',
          tipo: 'alquiler',
          precio: 2000,
          moneda: 'USD',
          ambientes: 6,
          dormitorios: 3,
          baños: 3,
          orientacion: 'este',
          estado: 'disponible',
          direccion_id: 1,
          barrio_id: 6,
          propietario_id: cliente.id,
          agente_id: agente.id,
          categoria_id: 2,
          m2: 140,
          imagen: '/images/products/principeBelAir.jpg',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          titulo: 'Casa en Villa Crespo',
          descripcion: 'Casa renovada con buen espacio',
          tipo: 'venta',
          precio: 160000,
          moneda: 'USD',
          ambientes: 4,
          dormitorios: 2,
          baños: 2,
          orientacion: 'sur',
          estado: 'disponible',
          direccion_id: 1,
          barrio_id: 7,
          propietario_id: cliente.id,
          agente_id: agente.id,
          categoria_id: 1,
          m2: 100,
          imagen: '/images/products/toretto.webp',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          titulo: 'Local en Almagro',
          descripcion: 'Local comercial en zona residencial',
          tipo: 'alquiler',
          precio: 600,
          moneda: 'USD',
          ambientes: 4,
          dormitorios: 2,
          baños: 2,
          orientacion: 'sur',
          estado: 'disponible',
          direccion_id: 1,
          barrio_id: 8,
          propietario_id: cliente.id,
          agente_id: agente.id,
          categoria_id: 2,
          m2: 75,
          imagen: '/images/products/budapest.jpg',
          created_at: new Date(),
          updated_at: new Date()
        }
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("propiedades", null, {});
  }
}; 
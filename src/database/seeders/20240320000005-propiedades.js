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

    // Datos de productos desde el JSON
    const productos = [
      {
        id: 2,
        direccion: "Av. Rivadavia 4567",
        barrio: "Almagro",
        zona: "Zona Oeste",
        ambientes: 2,
        precio: 120000,
        tipo: "casa",
        foto: "/images/products/budapest.jpg",
        m2: 50
      },
      {
        id: 3,
        direccion: "Calle Junín 890",
        barrio: "Recoleta",
        zona: "Zona Centro",
        ambientes: 5,
        precio: 250000,
        tipo: "departamento",
        foto: "/images/products/buenaSuerteCharlie.jpg",
        m2: 120
      },
      {
        id: 4,
        direccion: "Calle Pescadores 512",
        barrio: "San Telmo",
        zona: "Zona Sur",
        ambientes: 4,
        precio: 180000,
        tipo: "casa",
        foto: "/images/products/casadosConHijos.jpg",
        m2: 90
      },
      {
        id: 5,
        direccion: "Calle Moreno 304",
        barrio: "Villa Devoto",
        zona: "Zona Norte",
        ambientes: 3,
        precio: 95000,
        tipo: "departamento",
        foto: "/images/products/casaRosada.jpg",
        m2: 65
      },
      {
        id: 6,
        direccion: "Av. 9 de Julio 456",
        barrio: "Monserrat",
        zona: "Zona Centro",
        ambientes: 6,
        precio: 300000,
        tipo: "departamento",
        foto: "/images/products/principeBelAir.jpg",
        m2: 140
      },
      {
        id: 7,
        direccion: "Calle Tacuarí 780",
        barrio: "La Boca",
        zona: "Zona Sur",
        ambientes: 2,
        precio: 80000,
        tipo: "casa",
        foto: "/images/products/toretto.webp",
        m2: 55
      },
      {
        id: 8,
        direccion: "Calle Libertador 2345",
        barrio: "Palermo",
        zona: "Zona Norte",
        ambientes: 4,
        precio: 220000,
        tipo: "departamento",
        foto: "/images/products/breakinBad.webp",
        m2: 100
      },
      {
        id: 9,
        direccion: "Calle Azcuénaga 1010",
        barrio: "Caballito",
        zona: "Zona Oeste",
        ambientes: 3,
        precio: 110000,
        tipo: "departamento",
        foto: "/images/products/budapest.jpg",
        m2: 75
      },
      {
        id: 10,
        direccion: "Calle Pueyrredón 1401",
        barrio: "Barracas",
        zona: "Zona Sur",
        ambientes: 4,
        precio: 150000,
        tipo: "casa",
        foto: "/images/products/buenaSuerteCharlie.jpg",
        m2: 85
      }
    ];

    // Obtener IDs de barrios
    const [barrios] = await queryInterface.sequelize.query(
      `SELECT id, nombre FROM barrios`
    );

    // Obtener IDs de categorías
    const [categorias] = await queryInterface.sequelize.query(
      `SELECT id, nombre FROM categorias`
    );

    // Crear propiedades basadas en los productos
    const propiedades = productos.map(producto => {
      // Encontrar el barrio correspondiente
      const barrio = barrios.find(b => b.nombre.toLowerCase() === producto.barrio.toLowerCase());
      
      // Determinar la categoría basada en el tipo
      const categoria = categorias.find(c => 
        c.nombre.toLowerCase() === (producto.tipo === 'casa' ? 'residencial' : 'comercial')
      );

      // Determinar si es venta o alquiler (alternando para variedad)
      const operacion = producto.id % 2 === 0 ? 'venta' : 'alquiler';
      
      // Calcular precio de alquiler si corresponde (aproximadamente 0.5% del valor de venta)
      const precio = operacion === 'alquiler' ? Math.round(producto.precio * 0.005) : producto.precio;
      
      // Calcular dormitorios basados en ambientes
      const dormitorios = Math.max(1, Math.floor(producto.ambientes / 2));
      
      // Calcular baños basados en dormitorios
      const banos = Math.max(1, Math.floor(dormitorios / 2));

      return {
        titulo: `${producto.tipo.charAt(0).toUpperCase() + producto.tipo.slice(1)} en ${producto.barrio}`,
        descripcion: `${producto.tipo.charAt(0).toUpperCase() + producto.tipo.slice(1)} con ${producto.ambientes} ambientes en ${producto.zona}`,
        tipo: operacion,
        precio: precio,
        moneda: 'USD',
        ambientes: producto.ambientes,
        dormitorios: dormitorios,
        banos: banos,
        orientacion: ['norte', 'sur', 'este', 'oeste'][producto.id % 4],
        estado: 'disponible',
        direccion_id: 1, // Asumimos que existe una dirección con ID 1
        barrio_id: barrio ? barrio.id : 1,
        propietario_id: cliente.id,
        agente_id: agente.id,
        categoria_id: categoria ? categoria.id : 1,
        m2: producto.m2,
        imagen: producto.foto
      };
    });

    await queryInterface.bulkInsert("propiedades", propiedades, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("propiedades", null, {});
  }
}; 
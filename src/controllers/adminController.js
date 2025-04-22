const { Usuario, Propiedad, Direccion, Barrio, Categoria } = require('../database/models');
const productsController = require('./productsController');

const adminController = {
  // Formulario para agregar una propiedad
  showAddForm: async (req, res) => {
    try {
      const agentes = await Usuario.findAll({
        where: { tipo: 'agente', activo: true }
      });
      const barrios = await Barrio.findAll();
      const categorias = await Categoria.findAll();
      
      res.render('products/productAdd', { 
        title: 'Agregar Propiedad',
        agentes,
        barrios,
        categorias
      });
    } catch (error) {
      console.error('Error al mostrar el formulario de agregar:', error);
      req.flash('error', 'Error al cargar el formulario de agregar propiedad');
      return res.redirect('/inmuebles/admin');
    }
  },

  // Formulario para editar una propiedad  
  showEditForm: async (req, res) => {
    try {
      const propiedad = await Propiedad.findByPk(req.params.id, {
        include: [
          { model: Direccion, as: 'direccion' },
          { model: Barrio, as: 'barrio' },
          { model: Categoria, as: 'categoria' },
          { model: Usuario, as: 'propietario' },
          { model: Usuario, as: 'agente' }
        ],
        paranoid: false
      });
      
      if (!propiedad) {
        req.flash('error', 'La propiedad que intentas editar no existe');
        return res.redirect('/inmuebles/admin');
      }
      
      const agentes = await Usuario.findAll({
        where: { tipo: 'agente', activo: true }
      });
      const barrios = await Barrio.findAll();
      const categorias = await Categoria.findAll();
      
      res.render('products/productEdit', { 
        title: 'Editar Propiedad',
        product: propiedad,
        agentes,
        barrios,
        categorias
      });
    } catch (error) {
      console.error('Error al mostrar el formulario de edición:', error);
      req.flash('error', 'Error al cargar el formulario de edición');
      return res.redirect('/inmuebles/admin');
    }
  },

  // Listar todas las propiedades para la vista de administración
  listProperties: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 12;
      
      const { count, rows: propiedades } = await Propiedad.findAndCountAll({
        include: [
          { 
            model: Direccion, 
            as: "direccion",
            required: false,
            attributes: ['calle', 'numero', 'piso', 'departamento', 'codigo_postal', 'ciudad', 'provincia', 'pais']
          },
          { 
            model: Barrio, 
            as: "barrio",
            required: false,
            attributes: ['nombre']
          },
          { 
            model: Categoria, 
            as: "categoria",
            required: false,
            attributes: ['nombre']
          },
          { 
            model: Usuario, 
            as: "agente",
            required: false,
            attributes: ['nombre', 'apellido', 'email', 'telefono']
          }
        ],
        limit,
        offset: (page - 1) * limit,
        order: [['createdAt', 'DESC']],
        paranoid: false
      });

      const propiedadesConImagen = propiedades.map((propiedad) => {
        const propiedadJSON = propiedad.get({ plain: true });
        let imagenPath = propiedadJSON.imagen || "/images/imageDefault.png";
        
        if (!imagenPath.startsWith('/')) {
          imagenPath = `/${imagenPath}`;
        }
        
        if (imagenPath === '/images/imageDefault.png') {
          imagenPath = '/images/products/budapest.jpg';
        }
        
        return {
          ...propiedadJSON,
          foto: imagenPath,
          titulo: propiedadJSON.titulo || 'Propiedad sin título',
          precio: propiedadJSON.precio || 0,
          moneda: propiedadJSON.moneda || 'USD',
          ambientes: propiedadJSON.ambientes || 0,
          m2: propiedadJSON.m2 || 0,
          tipo: propiedadJSON.tipo || 'venta',
          barrio: propiedadJSON.barrio ? propiedadJSON.barrio.nombre : 'Sin barrio',
          direccion: propiedadJSON.direccion ? `${propiedadJSON.direccion.calle} ${propiedadJSON.direccion.numero}` : 'Sin dirección',
          categoria: propiedadJSON.categoria || { nombre: 'Sin categoría' }
        };
      });
      
      const totalPages = Math.ceil(count / limit);
      
      res.render('products/admin', {
        title: 'Administrar Propiedades',
        products: propiedadesConImagen,
        currentPage: page,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
        success_msg: req.flash('success'),
        error_msg: req.flash('error')
      });
    } catch (error) {
      console.error('Error al listar propiedades:', error);
      req.flash('error', 'Error al cargar las propiedades');
      return res.redirect('/inmuebles/admin');
    }
  },

  // Redirigir a la vista de administración después de cualquier operación CRUD
  redirectToAdmin: (req, res, message) => {
    return res.redirect(`/inmuebles/admin?message=${message}`);
  },

  // Envolver las funciones del productsController para redirigir a la vista de administración
  store: async (req, res) => {
    try {
      const result = await productsController.store(req, res);
      if (result.error) {
        req.flash('error', result.error);
        return res.redirect('/inmuebles/admin');
      }
      req.flash('success', 'Propiedad creada exitosamente');
      return res.redirect('/inmuebles/admin');
    } catch (error) {
      console.error('Error al crear la propiedad:', error);
      req.flash('error', 'Error al crear la propiedad');
      return res.redirect('/inmuebles/admin');
    }
  },

  update: async (req, res) => {
    try {
      const result = await productsController.update(req, res);
      if (result.error) {
        req.flash('error', result.error);
        return res.redirect('/inmuebles/admin');
      }
      req.flash('success', 'Propiedad actualizada exitosamente');
      return res.redirect('/inmuebles/admin');
    } catch (error) {
      console.error('Error al actualizar la propiedad:', error);
      req.flash('error', 'Error al actualizar la propiedad');
      return res.redirect('/inmuebles/admin');
    }
  },

  destroy: async (req, res) => {
    try {
      const result = await productsController.destroy(req, res);
      if (result.error) {
        req.flash('error', result.error);
        return res.redirect('/inmuebles/admin');
      }
      req.flash('success', 'Propiedad eliminada exitosamente');
      return res.redirect('/inmuebles/admin');
    } catch (error) {
      console.error('Error al eliminar la propiedad:', error);
      req.flash('error', 'Error al eliminar la propiedad');
      return res.redirect('/inmuebles/admin');
    }
  }
};

module.exports = adminController;
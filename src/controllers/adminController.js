const { Usuario, Propiedad, Direccion, Barrio, Categoria } = require('../database/models');

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
      res.status(500).render('error', {
        title: 'Error',
        message: 'Error al cargar el formulario',
        error: { status: 500 }
      });
    }
  },

  // Formulario para editar una propiedad  
  showEditForm: async (req, res) => {
    try {
      const propiedad = await Propiedad.findByPk(req.params.id, {
        include: ['direccion', 'barrio', 'categoria', 'propietario', 'agente']
      });
      
      if (!propiedad) {
        return res.status(404).render('error', {
          title: 'Propiedad no encontrada',
          message: 'La propiedad que intentas editar no existe o ha sido eliminada.',
          error: { status: 404 }
        });
      }
      
      const agentes = await Usuario.findAll({
        where: { tipo: 'agente', activo: true }
      });
      const barrios = await Barrio.findAll();
      const categorias = await Categoria.findAll();
      
      res.render('products/productEdit', { 
        title: 'Editar Propiedad',
        propiedad, 
        agentes,
        barrios,
        categorias
      });
    } catch (error) {
      console.error('Error al mostrar el formulario de edición:', error);
      res.status(500).render('error', {
        title: 'Error',
        message: 'Error al cargar el formulario',
        error: { status: 500 }
      });
    }
  },

  // Procesar la adición de una propiedad
  addProperty: async (req, res) => {
    try {
      // Primero crear la dirección
      const direccion = await Direccion.create({
        calle: req.body.calle,
        numero: req.body.numero,
        piso: req.body.piso,
        departamento: req.body.departamento,
        codigo_postal: req.body.codigo_postal,
        ciudad: req.body.ciudad,
        provincia: req.body.provincia,
        pais: req.body.pais || 'Argentina'
      });
      
      // Luego crear la propiedad
      await Propiedad.create({
        direccion_id: direccion.id,
        barrio_id: req.body.barrio_id,
        categoria_id: req.body.categoria_id,
        ambientes: parseInt(req.body.ambientes) || 0,
        precio: parseFloat(req.body.precio) || 0,
        m2: parseInt(req.body.m2) || 0,
        imagen: req.file ? `/images/products/${req.file.filename}` : '/images/imageDefault.png',
        maps_url: req.body.maps_url,
        propietario_id: req.body.propietario_id,
        agente_id: req.body.agente_id,
        estado: req.body.estado || 'disponible',
        descripcion: req.body.descripcion
      });
      
      res.redirect('/admin?message=Propiedad agregada exitosamente');
    } catch (error) {
      console.error('Error al agregar la propiedad:', error);
      res.status(500).render('error', {
        title: 'Error',
        message: 'Error al agregar la propiedad',
        error: { status: 500 }
      });
    }
  },

  // Procesar la edición de una propiedad
  updateProperty: async (req, res) => {
    try {
      const propiedad = await Propiedad.findByPk(req.params.id, {
        include: ['direccion']
      });
      
      if (!propiedad) {
        return res.status(404).render('error', {
          title: 'Propiedad no encontrada',
          message: 'La propiedad que intentas editar no existe o ha sido eliminada.',
          error: { status: 404 }
        });
      }
      
      // Actualizar la dirección
      await propiedad.direccion.update({
        calle: req.body.calle,
        numero: req.body.numero,
        piso: req.body.piso,
        departamento: req.body.departamento,
        codigo_postal: req.body.codigo_postal,
        ciudad: req.body.ciudad,
        provincia: req.body.provincia,
        pais: req.body.pais || 'Argentina'
      });
      
      // Actualizar la propiedad
      const updateData = {
        barrio_id: req.body.barrio_id,
        categoria_id: req.body.categoria_id,
        ambientes: parseInt(req.body.ambientes) || 0,
        precio: parseFloat(req.body.precio) || 0,
        m2: parseInt(req.body.m2) || 0,
        maps_url: req.body.maps_url,
        estado: req.body.estado || 'disponible',
        descripcion: req.body.descripcion
      };
      
      // Si se subió una nueva imagen, actualizar la ruta
      if (req.file) {
        updateData.imagen = `/images/products/${req.file.filename}`;
      }
      
      await propiedad.update(updateData);
      
      res.redirect('/admin?message=Propiedad actualizada exitosamente');
    } catch (error) {
      console.error('Error al actualizar la propiedad:', error);
      res.status(500).render('error', {
        title: 'Error',
        message: 'Error al actualizar la propiedad',
        error: { status: 500 }
      });
    }
  },
  
  // Listar todas las propiedades
  listProperties: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 10;
      
      const { count, rows: propiedades } = await Propiedad.findAndCountAll({
        include: ['propietario', 'agente', 'barrio', 'categoria', 'direccion'],
        limit,
        offset: (page - 1) * limit,
        order: [['createdAt', 'DESC']]
      });
      
      const totalPages = Math.ceil(count / limit);
      
      res.render('products/admin', {
        title: 'Administrar Propiedades',
        propiedades,
        currentPage: page,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
        message: req.query.message
      });
    } catch (error) {
      console.error('Error al listar propiedades:', error);
      res.status(500).render('error', {
        title: 'Error',
        message: 'Error al cargar las propiedades',
        error: { status: 500 }
      });
    }
  },
  
  // Eliminar una propiedad
  deleteProperty: async (req, res) => {
    try {
      const propiedad = await Propiedad.findByPk(req.params.id, {
        include: ['direccion']
      });
      
      if (!propiedad) {
        return res.status(404).render('error', {
          title: 'Propiedad no encontrada',
          message: 'La propiedad que intentas eliminar no existe o ya ha sido eliminada.',
          error: { status: 404 }
        });
      }
      
      // Eliminar la propiedad (esto también eliminará la dirección debido a la relación CASCADE)
      await propiedad.destroy();
      
      res.redirect('/admin?message=Propiedad eliminada exitosamente');
    } catch (error) {
      console.error('Error al eliminar la propiedad:', error);
      res.status(500).render('error', {
        title: 'Error',
        message: 'Error al eliminar la propiedad',
        error: { status: 500 }
      });
    }
  }
};

module.exports = adminController;
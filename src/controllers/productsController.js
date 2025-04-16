const {
  Propiedad,
  Direccion,
  Barrio,
  Categoria,
  Usuario,
} = require("../database/models");
const { Op } = require("sequelize");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");

const productsController = {
  // Listar todas las propiedades
  allProducts: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 12;

      console.log('Iniciando búsqueda de productos...');
      console.log('Parámetros de búsqueda:', { page, limit });

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
            model: Usuario, 
            as: "agente",
            required: false,
            attributes: ['nombre', 'apellido', 'email', 'telefono']
          },
        ],
        where: {
          estado: "disponible"
        },
        limit,
        offset: (page - 1) * limit,
        order: [["createdAt", "DESC"]],
        paranoid: false
      });

      console.log(`Se encontraron ${count} productos`);
      if (propiedades.length > 0) {
        console.log('Primera propiedad:', JSON.stringify(propiedades[0].get({ plain: true }), null, 2));
      } else {
        console.log('No se encontraron propiedades');
      }

      const propiedadesConImagen = propiedades.map((propiedad) => {
        const propiedadJSON = propiedad.get({ plain: true });
        let imagenPath = propiedadJSON.imagen || "/images/imageDefault.png";
        
        // Asegurarse de que la ruta de la imagen comience con /
        if (!imagenPath.startsWith('/')) {
          imagenPath = `/${imagenPath}`;
        }
        
        // Si la imagen no existe o es la imagen por defecto, usar una imagen específica
        if (imagenPath === '/images/imageDefault.png') {
          imagenPath = '/images/products/budapest.jpg';
        }
        
        // Asegurarse de que la propiedad tenga todos los campos necesarios
        return {
          ...propiedadJSON,
          foto: imagenPath,
          titulo: propiedadJSON.titulo || 'Propiedad sin título',
          precio: propiedadJSON.precio || 0,
          moneda: propiedadJSON.moneda || 'USD',
          ambientes: propiedadJSON.ambientes || 0,
          m2: propiedadJSON.m2 || 0,
          tipo: propiedadJSON.tipo || 'venta',
          barrio: propiedadJSON.barrio || { nombre: 'Sin barrio' },
          direccion: propiedadJSON.direccion || { ciudad: 'Sin ciudad' }
        };
      });

      console.log('Propiedades procesadas:', JSON.stringify(propiedadesConImagen, null, 2));

      const totalPages = Math.ceil(count / limit);

      res.render("products/products", {
        title: "Propiedades",
        resultadoInmueble: propiedadesConImagen,
        currentPage: page,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
        noResults: count === 0,
      });
    } catch (error) {
      console.error("Error al listar propiedades:", error);
      res.status(500).render("error", {
        title: "Error",
        message: "Error al cargar las propiedades",
        error: { status: 500 },
      });
    }
  },

  // Detalle de propiedad
  productDetail: async (req, res) => {
    try {
      const propiedad = await Propiedad.findByPk(req.params.id, {
        include: [
          { model: Direccion, as: "direccion" },
          { model: Barrio, as: "barrio" },
          { model: Categoria, as: "categoria" },
          { model: Usuario, as: "agente" },
          { model: Usuario, as: "propietario" },
        ],
      });

      if (!propiedad) {
        return res.status(404).render("error", {
          title: "Propiedad no encontrada",
          message: "La propiedad que buscas no existe o ha sido eliminada.",
          error: { status: 404 },
        });
      }

      const propiedadesSimilares = await Propiedad.findAll({
        where: {
          id: { [Op.ne]: propiedad.id },
          categoria_id: propiedad.categoria_id,
          estado: "disponible",
        },
        include: [
          { model: Direccion, as: "direccion" },
          { model: Barrio, as: "barrio" },
          { model: Categoria, as: "categoria" },
        ],
        limit: 4,
      });

      res.render("products/productDetail", {
        title: propiedad.categoria.nombre,
        product: propiedad,
        propiedadesSimilares,
      });
    } catch (error) {
      console.error("Error al mostrar la propiedad:", error);
      res.status(500).render("error", {
        title: "Error",
        message: "Error al cargar la propiedad",
        error: { status: 500 },
      });
    }
  },

  // Formulario para crear propiedad
  createForm: async (req, res) => {
    try {
      let propietarios = [];
      console.log('Iniciando búsqueda de datos...');
      
      const [agentes, barrios, categorias] = await Promise.all([
        Usuario.findAll({ where: { tipo: "agente" } }),
        Barrio.findAll(),
        Categoria.findAll()
      ]);

      console.log('Buscando propietarios...');
      try {
        propietarios = await Usuario.findAll({ 
          where: { tipo: "cliente" },
          raw: true
        });
        console.log(`Se encontraron ${propietarios.length} propietarios:`, JSON.stringify(propietarios, null, 2));

        // Si no hay propietarios, crear uno
        if (propietarios.length === 0) {
          console.log('No se encontraron propietarios, creando uno nuevo...');
          const hashedPassword = await bcrypt.hash('123456', 10);
          
          const nuevoPropietario = await Usuario.create({
            nombre: "Juan",
            apellido: "Pérez",
            email: "juan.perez@ejemplo.com",
            password: hashedPassword,
            telefono: "1155667788",
            tipo: "cliente",
            imagen: "/images/imageDefault.png",
            activo: true,
            fecha_registro: new Date()
          });
          
          console.log('Nuevo propietario creado:', nuevoPropietario.toJSON());
          propietarios = [nuevoPropietario.toJSON()];
        }
      } catch (error) {
        console.error("Error al buscar/crear propietarios:", error);
        console.error("Stack trace:", error.stack);
        
        // Si hay un error, crear un propietario de respaldo
        try {
          console.log('Intentando crear un propietario de respaldo...');
          const hashedPassword = await bcrypt.hash('123456', 10);
          
          const nuevoPropietario = await Usuario.create({
            nombre: "Juan",
            apellido: "Pérez",
            email: "juan.perez@ejemplo.com",
            password: hashedPassword,
            telefono: "1155667788",
            tipo: "cliente",
            imagen: "/images/imageDefault.png",
            activo: true,
            fecha_registro: new Date()
          });
          
          console.log('Propietario de respaldo creado:', nuevoPropietario.toJSON());
          propietarios = [nuevoPropietario.toJSON()];
        } catch (createError) {
          console.error("Error al crear propietario de respaldo:", createError);
          // Si no se puede crear, usar un propietario ficticio
          propietarios = [{
            id: 1,
            nombre: "Juan",
            apellido: "Pérez",
            email: "juan.perez@ejemplo.com",
            telefono: "1155667788",
            tipo: "cliente"
          }];
        }
      }

      console.log(`Enviando datos a la vista con ${propietarios.length} propietarios`);
      res.render("products/productAdd", {
        title: "Agregar Propiedad",
        agentes,
        barrios,
        categorias,
        propietarios: propietarios || []
      });
    } catch (error) {
      console.error("Error al mostrar el formulario de agregar:", error);
      console.error("Stack trace:", error.stack);
      res.status(500).render("error", {
        title: "Error",
        message: "Error al cargar el formulario",
        error: { status: 500 },
      });
    }
  },

  // Almacenar nueva propiedad
  store: async (req, res) => {
    let direccion = null;
    try {
      console.log('=== Iniciando creación de propiedad ===');
      console.log('Body recibido:', JSON.stringify(req.body, null, 2));
      console.log('Archivo recibido:', req.file);
      console.log('Usuario en sesión:', req.session.user);

      // Validar errores de express-validator
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // Obtener datos necesarios para re-renderizar el formulario
        const [agentes, barrios, categorias, propietarios] = await Promise.all([
          Usuario.findAll({ where: { tipo: "agente", activo: true } }),
          Barrio.findAll(),
          Categoria.findAll(),
          Usuario.findAll({ where: { tipo: "cliente", activo: true } })
        ]);

        return res.render("products/productAdd", {
          title: "Error al Agregar Propiedad",
          errors: errors.array(),
          oldData: req.body,
          agentes,
          barrios,
          categorias,
          propietarios: propietarios || []
        });
      }

      // Validar la sesión del usuario
      if (!req.session.user) {
        throw new Error('Debe iniciar sesión para crear una propiedad');
      }

      // Obtener el usuario logueado
      const usuarioLogueado = await Usuario.findOne({
        where: { 
          id: req.session.user.id,
          activo: true
        }
      });

      if (!usuarioLogueado) {
        throw new Error('Usuario no encontrado o inactivo');
      }

      console.log('Usuario logueado:', usuarioLogueado.toJSON());

      // Validar que todos los campos requeridos estén presentes y no estén vacíos
      const requiredFields = ['calle', 'numero', 'ciudad', 'provincia', 'barrio_id', 'categoria_id', 
                            'titulo', 'tipo', 'precio'];
      
      const missingFields = requiredFields.filter(field => !req.body[field] || req.body[field].toString().trim() === '');
      if (missingFields.length > 0) {
        throw new Error(`Los siguientes campos son obligatorios: ${missingFields.join(', ')}`);
      }

      // Validar campos numéricos
      const numericValidations = {
        'barrio_id': { min: 1, message: 'Debe seleccionar un barrio válido' },
        'categoria_id': { min: 1, message: 'Debe seleccionar una categoría válida' },
        'dormitorios': { min: 0, message: 'El número de dormitorios no puede ser negativo' },
        'banos': { min: 0, message: 'El número de baños no puede ser negativo' },
        'ambientes': { min: 1, message: 'Debe haber al menos un ambiente' },
        'precio': { min: 0, message: 'El precio no puede ser negativo' },
        'm2': { min: 1, message: 'Los metros cuadrados deben ser mayores a 0' }
      };

      const numericErrors = [];
      for (const [field, validation] of Object.entries(numericValidations)) {
        if (req.body[field]) {
          const value = parseFloat(req.body[field]);
          if (isNaN(value) || value < validation.min) {
            numericErrors.push(validation.message);
          }
        }
      }

      if (numericErrors.length > 0) {
        throw new Error(numericErrors.join('. '));
      }

      // Validar propietario_id si está presente
      if (req.body.propietario_id) {
        const propietarioId = parseInt(req.body.propietario_id);
        if (isNaN(propietarioId)) {
          throw new Error('ID de propietario inválido');
        }
        
        // Buscar el propietario sin filtrar por tipo
        const propietarioExiste = await Usuario.findOne({
          where: { 
            id: propietarioId,
            activo: true
          }
        });
        
        if (!propietarioExiste) {
          throw new Error('El propietario seleccionado no existe o no está activo');
        }
        
        // Si el usuario existe pero no es cliente, actualizarlo a cliente
        if (propietarioExiste.tipo !== 'cliente') {
          await propietarioExiste.update({ tipo: 'cliente' });
          console.log(`Usuario ${propietarioExiste.id} actualizado a tipo cliente`);
        }
      } else {
        // Si no se proporciona propietario_id, usar el usuario actual como propietario
        console.log('No se proporcionó propietario, usando el usuario actual como propietario');
      }

      // Validar el tipo de propiedad
      const tiposValidos = ['venta', 'alquiler'];
      if (!tiposValidos.includes(req.body.tipo)) {
        throw new Error('El tipo de propiedad debe ser venta o alquiler');
      }

      console.log('=== Creando dirección ===');
      direccion = await Direccion.create({
        calle: req.body.calle.trim(),
        numero: req.body.numero.trim(),
        piso: req.body.piso ? req.body.piso.trim() : null,
        departamento: req.body.departamento ? req.body.departamento.trim() : null,
        codigo_postal: req.body.codigo_postal ? req.body.codigo_postal.trim() : null,
        ciudad: req.body.ciudad.trim(),
        provincia: req.body.provincia.trim(),
        pais: req.body.pais ? req.body.pais.trim() : "Argentina",
      });
      console.log('Dirección creada:', direccion.toJSON());

      console.log('=== Creando propiedad ===');
      const propiedadData = {
        direccion_id: direccion.id,
        barrio_id: parseInt(req.body.barrio_id),
        categoria_id: parseInt(req.body.categoria_id),
        titulo: req.body.titulo.trim(),
        tipo: req.body.tipo.trim(),
        propietario_id: req.body.propietario_id ? parseInt(req.body.propietario_id) : usuarioLogueado.id,
        agente_id: usuarioLogueado.id,
        dormitorios: parseInt(req.body.dormitorios) || 0,
        banos: parseInt(req.body.banos) || 0,
        ambientes: parseInt(req.body.ambientes) || 1,
        precio: parseFloat(req.body.precio),
        moneda: req.body.moneda || 'USD',
        m2: parseInt(req.body.m2) || 1,
        imagen: req.file ? `/images/products/${req.file.filename}` : "/images/imageDefault.png",
        maps_url: req.body.maps_url && req.body.maps_url.trim() !== '' ? req.body.maps_url.trim() : null,
        estado: req.body.estado || "disponible",
        descripcion: req.body.descripcion ? req.body.descripcion.trim() : null,
        orientacion: req.body.orientacion ? req.body.orientacion.trim() : null
      };

      console.log('Datos de la propiedad a crear:', JSON.stringify(propiedadData, null, 2));
      const propiedad = await Propiedad.create(propiedadData);
      console.log('Propiedad creada:', propiedad.toJSON());

      return res.redirect("/inmuebles/products?message=Propiedad agregada exitosamente");
    } catch (error) {
      console.error("=== Error al agregar la propiedad ===");
      console.error("Mensaje:", error.message);
      console.error("Stack trace:", error.stack);

      // Si se creó la dirección pero falló la creación de la propiedad, eliminar la dirección
      if (direccion) {
        try {
          await direccion.destroy();
          console.log('Dirección eliminada después del error');
        } catch (deleteError) {
          console.error('Error al eliminar la dirección:', deleteError);
        }
      }

      // Obtener datos necesarios para re-renderizar el formulario
      try {
        const [agentes, barrios, categorias, propietarios] = await Promise.all([
          Usuario.findAll({ where: { tipo: "agente", activo: true } }),
          Barrio.findAll(),
          Categoria.findAll(),
          Usuario.findAll({ where: { tipo: "cliente", activo: true } })
        ]);

        return res.render("products/productAdd", {
          title: "Error al Agregar Propiedad",
          errors: [{ msg: error.message }],
          oldData: req.body,
          agentes,
          barrios,
          categorias,
          propietarios: propietarios || []
        });
      } catch (renderError) {
        console.error('Error al re-renderizar el formulario:', renderError);
        return res.status(500).render("error", {
          title: "Error",
          message: "Error al procesar la solicitud",
          error: { status: 500, stack: error.stack }
        });
      }
    }
  },

  // Formulario para editar propiedad
  editForm: async (req, res) => {
    try {
      const [propiedad, agentes, barrios, categorias] = await Promise.all([
        Propiedad.findByPk(req.params.id, {
          include: [
            "direccion",
            "barrio",
            "categoria",
            "propietario",
            "agente",
          ],
        }),
        Usuario.findAll({ where: { tipo: "agente", activo: true } }),
        Barrio.findAll(),
        Categoria.findAll(),
      ]);

      if (!propiedad) {
        return res.status(404).render("error", {
          title: "Propiedad no encontrada",
          message:
            "La propiedad que intentas editar no existe o ha sido eliminada.",
          error: { status: 404 },
        });
      }

      res.render("products/productEdit", {
        title: "Editar Propiedad",
        product: propiedad,
        agentes,
        barrios,
        categorias,
      });
    } catch (error) {
      console.error("Error al mostrar el formulario de edición:", error);
      res.status(500).render("error", {
        title: "Error",
        message: "Error al cargar el formulario",
        error: { status: 500 },
      });
    }
  },

  // Actualizar propiedad
  update: async (req, res) => {
    try {
      console.log('=== Iniciando actualización de propiedad ===');
      console.log('Body recibido:', JSON.stringify(req.body, null, 2));
      console.log('Archivo recibido:', req.file);

      // Validar errores de express-validator
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // Obtener datos necesarios para re-renderizar el formulario
        const [propiedad, agentes, barrios, categorias, propietarios] = await Promise.all([
          Propiedad.findByPk(req.params.id, {
            include: [
              { model: Direccion, as: 'direccion' },
              { model: Barrio, as: 'barrio' },
              { model: Categoria, as: 'categoria' },
              { model: Usuario, as: 'propietario' },
              { model: Usuario, as: 'agente' }
            ]
          }),
          Usuario.findAll({ where: { tipo: "agente", activo: true } }),
          Barrio.findAll(),
          Categoria.findAll(),
          Usuario.findAll({ where: { tipo: "cliente", activo: true } })
        ]);

        return res.render("products/productEdit", {
          title: "Error al Actualizar Propiedad",
          errors: errors.array(),
          propiedad,
          oldData: req.body,
          agentes,
          barrios,
          categorias,
          propietarios: propietarios || []
        });
      }

      const propiedad = await Propiedad.findByPk(req.params.id, {
        include: ["direccion"],
      });

      if (!propiedad) {
        return res.status(404).render("error", {
          title: "Propiedad no encontrada",
          message:
            "La propiedad que intentas editar no existe o ha sido eliminada.",
          error: { status: 404 },
        });
      }

      await propiedad.direccion.update({
        calle: req.body.calle,
        numero: req.body.numero,
        piso: req.body.piso,
        departamento: req.body.departamento,
        codigo_postal: req.body.codigo_postal,
        ciudad: req.body.ciudad,
        provincia: req.body.provincia,
        pais: req.body.pais || "Argentina",
      });

      const updateData = {
        barrio_id: req.body.barrio_id,
        categoria_id: req.body.categoria_id,
        ambientes: parseInt(req.body.ambientes) || 0,
        precio: parseFloat(req.body.precio) || 0,
        m2: parseInt(req.body.m2) || 0,
        maps_url: req.body.maps_url && req.body.maps_url.trim() !== '' ? req.body.maps_url.trim() : null,
        estado: req.body.estado || "disponible",
        descripcion: req.body.descripcion,
      };

      if (req.file) {
        updateData.imagen = `/images/products/${req.file.filename}`;
      }

      await propiedad.update(updateData);

      res.redirect("/inmuebles?message=Propiedad actualizada exitosamente");
    } catch (error) {
      console.error("Error al actualizar la propiedad:", error);
      res.status(500).render("error", {
        title: "Error",
        message: "Error al actualizar la propiedad",
        error: { status: 500 },
      });
    }
  },

  // Eliminar propiedad
  destroy: async (req, res) => {
    try {
      const propiedad = await Propiedad.findByPk(req.params.id, {
        include: ["direccion"],
      });

      if (!propiedad) {
        return res.status(404).render("error", {
          title: "Propiedad no encontrada",
          message:
            "La propiedad que intentas eliminar no existe o ya ha sido eliminada.",
          error: { status: 404 },
        });
      }

      await propiedad.destroy();

      res.redirect("/inmuebles?message=Propiedad eliminada exitosamente");
    } catch (error) {
      console.error("Error al eliminar la propiedad:", error);
      res.status(500).render("error", {
        title: "Error",
        message: "Error al eliminar la propiedad",
        error: { status: 500 },
      });
    }
  },

  // Búsqueda de propiedades
  search: async (req, res) => {
    try {
      const { q, categoria, barrio, minPrice, maxPrice, minM2, maxM2 } =
        req.query;
      const page = parseInt(req.query.page) || 1;
      const limit = 12;

      const where = { estado: "disponible" };

      if (q) {
        where[Op.or] = [
          { "$direccion.calle$": { [Op.like]: `%${q}%` } },
          { "$direccion.ciudad$": { [Op.like]: `%${q}%` } },
          { "$barrio.nombre$": { [Op.like]: `%${q}%` } },
        ];
      }

      if (categoria) where.categoria_id = categoria;
      if (barrio) where.barrio_id = barrio;
      if (minPrice)
        where.precio = { ...where.precio, [Op.gte]: parseFloat(minPrice) };
      if (maxPrice)
        where.precio = { ...where.precio, [Op.lte]: parseFloat(maxPrice) };
      if (minM2) where.m2 = { ...where.m2, [Op.gte]: parseInt(minM2) };
      if (maxM2) where.m2 = { ...where.m2, [Op.lte]: parseInt(maxM2) };

      const [count, propiedades, categorias, barrios] = await Promise.all([
        Propiedad.count({ where }),
        Propiedad.findAll({
          where,
          include: [
            { model: Direccion, as: "direccion" },
            { model: Barrio, as: "barrio" },
            { model: Categoria, as: "categoria" },
            { model: Usuario, as: "agente" },
          ],
          limit,
          offset: (page - 1) * limit,
          order: [["createdAt", "DESC"]],
        }),
        Categoria.findAll(),
        Barrio.findAll(),
      ]);

      const totalPages = Math.ceil(count / limit);

      res.render("products/search", {
        title: "Buscar Propiedades",
        propiedades,
        categorias,
        barrios,
        currentPage: page,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
        filters: { q, categoria, barrio, minPrice, maxPrice, minM2, maxM2 },
      });
    } catch (error) {
      console.error("Error al buscar propiedades:", error);
      res.status(500).render("error", {
        title: "Error",
        message: "Error al realizar la búsqueda",
        error: { status: 500 },
      });
    }
  },

  // Obtener propiedades destacadas
  getFeaturedProperties: async () => {
    try {
      // Consulta para obtener todas las propiedades sin filtrar por estado
      const properties = await Propiedad.findAll({
        include: [
          { model: Direccion, as: "direccion" },
          { model: Barrio, as: "barrio" },
          { model: Categoria, as: "categoria" },
          { model: Usuario, as: "agente" },
        ],
        where: { estado: "disponible" },
        order: [["createdAt", "DESC"]],
        limit: 6,
        paranoid: false,
      });

      console.log(`Se encontraron ${properties.length} propiedades destacadas`);

      // Si no hay propiedades, intentar obtener algunas sin relaciones
      if (properties.length === 0) {
        const simpleProperties = await Propiedad.findAll({
          where: { estado: "disponible" },
          limit: 6,
          paranoid: false,
        });

        console.log(
          `Se encontraron ${simpleProperties.length} propiedades sin relaciones`
        );

        if (simpleProperties.length > 0) {
          // Si hay propiedades sin relaciones, usarlas
          return {
            products: simpleProperties,
            debug: true,
          };
        }
      }

      return {
        products: properties,
        debug: true,
      };
    } catch (error) {
      console.error("Error al cargar las propiedades destacadas:", error);
      return {
        products: [],
        error: error.message,
        debug: true,
      };
    }
  },
};

module.exports = productsController;

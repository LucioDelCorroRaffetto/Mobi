const path = require("path");
const directory = path.join(__dirname, "../../data/users.json");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const {
  readFile,
  writeFile,
  parseFile,
  stringifyFile,
} = require("../../utils/filesystem");
const { Usuario } = require('../database/models');

const users = parseFile(readFile(directory));

const usersControllers = {
  login: (req, res) => {
    res.render("users/login", { title: "Login" });
  },

  register: (req, res) => {
    res.render("users/register", { title: "Registro" });
  },

  processRegister: async (req, res) => {
    try {
        console.log('=== INICIO DE PROCESO DE REGISTRO ===');
        console.log('Headers:', req.headers);
        console.log('Content-Type:', req.headers['content-type']);
        console.log('Body:', req.body);
        console.log('Files:', req.file);
        console.log('Raw Body:', req.rawBody);
        
        // Intentar acceder a los datos del formulario de diferentes maneras
        const formData = req.body || {};
        const rawData = req.rawBody || '';
        const contentType = req.headers['content-type'] || '';
        
        console.log('Form Data:', formData);
        console.log('Raw Data:', rawData);
        console.log('Content Type:', contentType);
        
        // Verificar si los datos están presentes
        if (!formData || Object.keys(formData).length === 0) {
            console.log('ERROR: No se recibieron datos del formulario');
            return res.render("users/register", {
                errores: {
                    server: {
                        msg: "No se recibieron datos del formulario. Por favor, intente nuevamente."
                    }
                },
                oldData: formData,
                title: "Registro"
            });
        }

        const errores = validationResult(req);
        console.log('Errores de validación:', errores.array());
        
        if (!errores.isEmpty()) {
            console.log('ERROR: Errores de validación encontrados');
            return res.render("users/register", {
                errores: errores.mapped(),
                oldData: formData,
                title: "Registro"
            });
        }

        // Validar que el email esté presente y sea válido
        if (!formData.email || typeof formData.email !== 'string') {
            console.log('ERROR: Email inválido:', formData.email);
            return res.render("users/register", {
                errores: {
                    email: {
                        msg: "El email es obligatorio y debe ser válido"
                    }
                },
                oldData: formData,
                title: "Registro"
            });
        }

        console.log('Buscando usuario existente con email:', formData.email);
        const existingUser = await Usuario.findOne({
            where: { email: formData.email.trim() }
        });

        if (existingUser) {
            console.log('ERROR: Email ya existe:', formData.email);
            return res.render("users/register", {
                errores: {
                    email: {
                        msg: "Este email ya está registrado"
                    }
                },
                oldData: formData,
                title: "Registro"
            });
        }

        console.log('Contraseña antes de hashear:', formData.password);
        const hashedPassword = await bcrypt.hash(formData.password, 10);
        console.log('Contraseña hasheada:', hashedPassword);
        
        const userData = {
            nombre: formData.nombre,
            apellido: formData.apellido,
            email: formData.email.trim(),
            password: hashedPassword,
            genero: formData.genero,
            tipo: 'cliente',
            fecha_registro: new Date(),
            activo: true
        };

        console.log('Datos del usuario a crear:', userData);

        // Agregar imagen solo si se subió una
        if (req.file) {
            userData.imagen = `/images/users/${req.file.filename}`;
            console.log('Imagen subida:', userData.imagen);
        } else {
            userData.imagen = '/images/imageDefault.png';
            console.log('Usando imagen por defecto');
        }

        console.log('Creando usuario...');
        const newUser = await Usuario.create(userData);
        console.log('Usuario creado:', {
            id: newUser.id,
            email: newUser.email,
            password: newUser.password ? 'Contraseña presente' : 'Sin contraseña'
        });

        // Verificar que el usuario se creó correctamente
        console.log('Verificando usuario creado...');
        const createdUser = await Usuario.findOne({
            where: { email: formData.email.trim() }
        });

        if (!createdUser) {
            console.log('ERROR: El usuario no se creó correctamente');
            throw new Error('El usuario no se creó correctamente');
        }

        console.log('Usuario verificado en la base de datos:', {
            id: createdUser.id,
            email: createdUser.email,
            activo: createdUser.activo
        });

        console.log('=== REGISTRO EXITOSO ===');
        res.redirect("/users/login");
    } catch (error) {
        console.error('ERROR EN PROCESO DE REGISTRO:', error);
        res.render("users/register", {
            errores: {
                server: {
                    msg: "Error al procesar el registro. Por favor, intente nuevamente."
                }
            },
            oldData: req.body,
            title: "Registro"
        });
    }
  },

  processLogin: async (req, res) => {
    try {
      console.log('Datos de login recibidos:', req.body);
      
      const errores = validationResult(req);
      console.log('Errores de validación:', errores.array());
      
      if (!errores.isEmpty()) {
        return res.render("users/login", {
          errores: errores.mapped(),
          oldData: req.body,
          title: "Login"
        });
      }

      // Buscar el usuario sin filtrar por activo
      const usuario = await Usuario.findOne({
        where: { email: req.body.email }
      });

      console.log('Usuario encontrado:', usuario ? {
        id: usuario.id,
        email: usuario.email,
        activo: usuario.activo,
        password: usuario.password ? 'Contraseña presente' : 'Sin contraseña'
      } : 'No se encontró usuario');

      if (!usuario) {
        console.log('Usuario no encontrado');
        return res.render("users/login", {
          errores: {
            email: {
              msg: "Las credenciales no son válidas"
            }
          },
          oldData: req.body,
          title: "Login"
        });
      }

      if (!usuario.activo) {
        console.log('Usuario inactivo');
        return res.render("users/login", {
          errores: {
            email: {
              msg: "Esta cuenta está desactivada"
            }
          },
          oldData: req.body,
          title: "Login"
        });
      }

      const passwordMatch = await bcrypt.compare(req.body.password, usuario.password);
      console.log('Contraseña coincide:', passwordMatch);

      if (!passwordMatch) {
        console.log('Contraseña incorrecta');
        return res.render("users/login", {
          errores: {
            email: {
              msg: "Las credenciales no son válidas"
            }
          },
          oldData: req.body,
          title: "Login"
        });
      }

      req.session.user = {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        tipo: usuario.tipo,
        imagen: usuario.imagen
      };

      console.log('Sesión creada:', req.session.user);

      if (req.body.recordar) {
        res.cookie('userEmail', req.body.email, { maxAge: (1000 * 60 * 60 * 24 * 30) });
      }

      res.redirect("/users/profile");
    } catch (error) {
      console.error('Error en processLogin:', error);
      res.status(500).render("users/login", {
        errores: {
          server: {
            msg: "Error al procesar el login: " + error.message
          }
        },
        oldData: req.body,
        title: "Login"
      });
    }
  },

  logout: (req, res) => {
    req.session.destroy();
    res.clearCookie('userEmail');
    res.redirect('/');
  },

  profile: async (req, res) => {
    try {
      if (!req.session.user) {
        req.flash('error', 'Debes iniciar sesión para ver tu perfil');
        return res.redirect('/users/login');
      }

      const usuario = await Usuario.findByPk(req.session.user.id, {
        attributes: ['id', 'nombre', 'apellido', 'email', 'tipo', 'imagen', 'telefono', 'fecha_registro']
      });

      if (!usuario) {
        req.flash('error', 'Usuario no encontrado');
        return res.redirect('/users/login');
      }

      // Asegurar que la ruta de la imagen comience con /
      let imagenPath = usuario.imagen;
      if (imagenPath && !imagenPath.startsWith('/')) {
        imagenPath = `/${imagenPath}`;
      }

      // Formatear la fecha de registro
      const fechaRegistro = usuario.fecha_registro ? 
        new Date(usuario.fecha_registro).toLocaleDateString('es-AR') : 
        'No disponible';

      res.render('users/profile', {
        title: 'Mi Perfil',
        user: {
          ...usuario.get({ plain: true }),
          imagen: imagenPath || '/images/users/default.jpg',
          fecha_registro: fechaRegistro
        },
        success_msg: req.flash('success'),
        error_msg: req.flash('error')
      });
    } catch (error) {
      console.error('Error al cargar el perfil:', error);
      req.flash('error', 'Error al cargar el perfil');
      res.redirect('/');
    }
  },

  update: async (req, res) => {
    try {
      if (!req.session.user) {
        req.flash('error', 'Debes iniciar sesión para actualizar tu perfil');
        return res.redirect('/users/login');
      }

      const usuario = await Usuario.findByPk(req.session.user.id);

      if (!usuario) {
        req.flash('error', 'Usuario no encontrado');
        return res.redirect('/users/login');
      }

      const updateData = {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        email: req.body.email,
        telefono: req.body.telefono
      };

      if (req.file) {
        // Asegurar que la ruta de la imagen comience con /
        updateData.imagen = `/images/users/${req.file.filename}`;
      }

      await usuario.update(updateData);

      // Actualizar la sesión
      req.session.user = {
        ...req.session.user,
        nombre: updateData.nombre,
        apellido: updateData.apellido,
        email: updateData.email,
        imagen: updateData.imagen || req.session.user.imagen
      };

      req.flash('success', 'Perfil actualizado exitosamente');
      return res.redirect('/users/profile');
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      req.flash('error', 'Error al actualizar el perfil');
      return res.redirect('/users/profile');
    }
  },

  delete: async (req, res) => {
    try {
      if (!req.session.user) {
        req.flash('error', 'Debes iniciar sesión para eliminar tu cuenta');
        return res.redirect('/users/login');
      }

      const usuario = await Usuario.findByPk(req.session.user.id);
      
      if (!usuario) {
        req.flash('error', 'Usuario no encontrado');
        return res.redirect('/users/login');
      }

      // Realizar eliminación lógica
      await usuario.update({ activo: false });
      
      // Destruir la sesión
      req.session.destroy();
      
      res.redirect('/');
    } catch (error) {
      console.error('Error al eliminar la cuenta:', error);
      req.flash('error', 'Error al eliminar la cuenta');
      res.redirect('/users/profile');
    }
  }
};

module.exports = usersControllers;

const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const {
  readFile,
  writeFile,
  parseFile,
  stringifyFile,
} = require("../../utils/filesystem");
const { Usuario } = require('../database/models');
const path = require('path');
const fs = require('fs');

const usersControllers = {
  login: (req, res) => {
    res.render("users/login", { title: "Login" });
  },

  register: (req, res) => {
    res.render("users/register", { title: "Registro" });
  },

  processRegister: async (req, res) => {
    try {
      const errores = validationResult(req);

      if (!errores.isEmpty()) {
        return res.render("users/register", {
          errores: errores.mapped(),
          oldData: req.body,
          title: "Registro"
        });
      }

      console.log('Buscando usuario existente con email:', req.body.email);
      const existingUser = await Usuario.findOne({
          where: { email: req.body.email.trim() }
      });

      if (existingUser) {
          console.log('ERROR: Email ya existe:', req.body.email);
          return res.render("users/register", {
              errores: {
                  email: {
                      msg: "Este email ya está registrado"
                  }
              },
              oldData: req.body,
              title: "Registro"
          });
      }

      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      await Usuario.create({
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        email: req.body.email,
        password: hashedPassword,
        telefono: req.body.telefono,
        tipo: req.body.tipo || 'cliente',
        genero: req.body.genero,
        imagen: req.file ? `/images/users/${req.file.filename}` : '/images/default-user.jpg',
        fecha_registro: new Date(),
        activo: true
      });

      res.redirect("/users/login");
    } catch (error) {
      console.error('Error en processRegister:', error);
      res.status(500).render("users/register", {
        errores: {
          server: {
            msg: "Error al procesar el registro"
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

      if (!errores.isEmpty()) {
        return res.render("users/login", {
          errores: errores.mapped(),
          oldData: req.body,
          title: "Login"
        });
      }

      // Buscar el usuario sin filtrar por activo
      const usuario = await Usuario.findOne({
        where: { 
          email: req.body.email,
          activo: true
        }
      });

      if (!usuario || !await bcrypt.compare(req.body.password, usuario.password)) {
        return res.render("users/login", {
          errores: {
            email: {
              msg: "Credenciales inválidas"
            }
          },
          oldData: { email: req.body.email },
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

      if (req.body.recuerdame) {
        res.cookie("userCookie", req.session.user, { maxAge: 1000 * 60 * 60 * 24 * 7 });
      }

      res.redirect("/users/profile");
    } catch (error) {
      console.error('Error en processLogin:', error);
      res.status(500).render("users/login", {
        errores: {
          server: {
            msg: "Error al procesar el login"
          }
        },
        oldData: req.body,
        title: "Login"
      });
    }
  },

  logout: (req, res) => {
    // Destruir la sesión
    req.session.destroy(err => {
      if (err) {
        console.error('Error al destruir la sesión:', err);
      }
      
      // Limpiar todas las cookies relacionadas con el usuario
      res.clearCookie('userEmail');
      res.clearCookie('connect.sid', { path: '/' });
      res.clearCookie('userCookie', { path: '/' });
      
      // Redireccionar al inicio
      return res.redirect('/');
    });
  },

  profile: async (req, res) => {
    try {
      if (!req.session.user) {
        req.flash('error', 'Debes iniciar sesión para ver tu perfil');
        return res.redirect('/users/login');
      }

      const usuario = await Usuario.findByPk(req.session.user.id);

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
      console.error('Error en profile:', error);
      res.status(500).render('error', {
        message: 'Error al cargar el perfil'
      });
    }
  },

  update: async (req, res) => {
    try {
      const usuario = await Usuario.findByPk(req.session.user.id);


      if (!usuario) {
        return res.status(404).send('Usuario no encontrado');
      }

      await usuario.update({
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        telefono: req.body.telefono,
        imagen: req.file ? `/images/users/${req.file.filename}` : usuario.imagen
      });

      req.session.user = {
        ...req.session.user,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        imagen: usuario.imagen
      };

      req.flash('success', 'Perfil actualizado exitosamente');
      return res.redirect('/users/profile');
    } catch (error) {
      console.error('Error en update:', error);
      res.status(500).render('error', {
        message: 'Error al actualizar el perfil'
      });
    }
  },

  delete: async (req, res) => {
    try {
      if (!req.session.user) {
        return res.status(401).json({ error: 'No autorizado' });
      }

      const usuario = await Usuario.findByPk(req.session.user.id);
      
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      // Eliminar imagen de perfil si no es la default
      if (usuario.imagen && !usuario.imagen.includes('imageDefault.png')) {
        const imagePath = path.join(__dirname, '../../public', usuario.imagen);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      // Realizar eliminación lógica
      await usuario.update({ activo: false });
      
      // Destruir la sesión
      req.session.destroy();
      
      return res.status(200).json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
      console.error('Error al eliminar la cuenta:', error);
      return res.status(500).json({ error: 'Error al eliminar la cuenta' });
    }
  }
};

module.exports = usersControllers;
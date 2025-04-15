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
      const errores = validationResult(req);
      
      if (!errores.isEmpty()) {
        return res.render("users/register", {
          errores: errores.mapped(),
          oldData: req.body,
          title: "Registro"
        });
      }

      const existingUser = await Usuario.findOne({
        where: { email: req.body.email }
      });

      if (existingUser) {
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
        imagen: req.file ? `/images/users/${req.file.filename}` : 'default-user.jpg',
        fecha_registro: new Date(),
        activo: true
      });

      res.redirect("/users/login");
    } catch (error) {
      console.error('Error en processRegister:', error);
      res.status(500).render("users/register", {
        errores: {
          server: {
            msg: "Error al procesar el registro: " + error.message
          }
        },
        oldData: req.body,
        title: "Registro"
      });
    }
  },

  processLogin: async (req, res) => {
    try {
      const errores = validationResult(req);
      
      if (!errores.isEmpty()) {
        return res.render("users/login", {
          errores: errores.mapped(),
          oldData: req.body,
          title: "Login"
        });
      }

      const usuario = await Usuario.findOne({
        where: { 
          email: req.body.email,
          activo: true
        }
      });

      if (!usuario || !bcrypt.compareSync(req.body.password, usuario.password)) {
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
        return res.redirect('/users/login');
      }

      const usuario = await Usuario.findByPk(req.session.user.id);
      
      if (!usuario) {
        req.session.destroy();
        return res.redirect('/users/login');
      }

      res.render('users/profile', {
        title: 'Mi Perfil',
        user: usuario
      });
    } catch (error) {
      console.error('Error en profile:', error);
      res.status(500).render('error', {
        title: 'Error',
        message: 'Error al cargar el perfil',
        error: { status: 500 }
      });
    }
  },

  update: async (req, res) => {
    try {
      const errores = validationResult(req);
      
      if (!errores.isEmpty()) {
        return res.render("users/profile", {
          errores: errores.mapped(),
          oldData: req.body,
          title: "Actualizar Perfil"
        });
      }

      const usuario = await Usuario.findByPk(req.session.user.id);
      
      if (!usuario) {
        return res.status(404).render('error', {
          title: 'Error',
          message: 'Usuario no encontrado',
          error: { status: 404 }
        });
      }

      // Verificar si el email ya existe (si se está cambiando)
      if (req.body.email && req.body.email !== usuario.email) {
        const existingUser = await Usuario.findOne({
          where: { email: req.body.email }
        });

        if (existingUser) {
          return res.render("users/profile", {
            errores: {
              email: {
                msg: "Este email ya está registrado"
              }
            },
            oldData: req.body,
            title: "Actualizar Perfil"
          });
        }
      }

      // Preparar datos para actualización
      const updateData = {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        email: req.body.email,
        telefono: req.body.telefono
      };

      // Si se proporciona una nueva contraseña y no está vacía, encriptarla
      if (req.body.password && req.body.password.trim() !== '') {
        updateData.password = await bcrypt.hash(req.body.password, 10);
      }

      // Si se subió una nueva imagen, actualizar la ruta
      if (req.file) {
        updateData.imagen = `/images/users/${req.file.filename}`;
      }

      await usuario.update(updateData);

      // Actualizar la sesión con los nuevos datos
      req.session.user = {
        ...req.session.user,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        telefono: usuario.telefono,
        imagen: usuario.imagen
      };

      res.redirect('/users/profile');
    } catch (error) {
      console.error('Error en update:', error);
      res.status(500).render('error', {
        title: 'Error',
        message: 'Error al actualizar el perfil',
        error: { status: 500 }
      });
    }
  },

  delete: async (req, res) => {
    try {
      const usuario = await Usuario.findByPk(req.session.user.id);
      
      if (!usuario) {
        return res.status(404).render('error', {
          title: 'Error',
          message: 'Usuario no encontrado',
          error: { status: 404 }
        });
      }

      // Realizar eliminación lógica
      await usuario.update({ activo: false });
      
      // Destruir la sesión
      req.session.destroy();
      
      res.redirect('/');
    } catch (error) {
      console.error('Error en delete:', error);
      res.status(500).render('error', {
        title: 'Error',
        message: 'Error al eliminar la cuenta',
        error: { status: 500 }
      });
    }
  }
};

module.exports = usersControllers;

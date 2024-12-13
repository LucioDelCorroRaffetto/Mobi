// Se importan los módulos necesarios para el funcionamiento de la aplicación
var createError = require('http-errors'); // Módulo para crear errores HTTP
var express = require('express'); // Módulo de Express para crear la aplicación
var path = require('path'); // Módulo para manejo de rutas
var cookieParser = require('cookie-parser'); // Módulo para manejo de cookies
var logger = require('morgan'); // Módulo para registro de logs

// Se importan las rutas de la aplicación
var indexRouter = require('./router/index'); // Ruta de inicio
var app = express(); // Se crea la aplicación Express

// Configuración del motor de plantillas
app.set('views', path.join(__dirname, 'views')); // Se establece la carpeta de vistas
app.set('view engine', 'ejs'); // Se establece el motor de plantillas como EJS

// Middleware para el registro de logs, manejo de JSON, URL encoded, cookies y archivos estáticos
app.use(logger('dev')); // Registro de logs en desarrollo
app.use(express.json()); // Manejo de JSON
app.use(express.urlencoded({ extended: false })); // Manejo de URL encoded
app.use(cookieParser()); // Manejo de cookies
app.use(express.static(path.join(__dirname, 'public'))); // Servicio de archivos estáticos

// Se establecen las rutas de la aplicación
app.use('/', indexRouter); // Ruta de inicio

// Manejo de errores 404
app.use(function(req, res, next) {
  next(createError(404)); // Se lanza un error 404
});

// Manejo de errores generales
app.use(function(err, req, res, next) {
  // Se establecen los locales para el mensaje de error y el error mismo
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Se renderiza la página de error
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app; // Se exporta la aplicación
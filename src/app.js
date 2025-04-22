var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const methodOverride = require('method-override');
const sessionVerify = require('../middlewares/sessionVerify');
const flash = require('connect-flash');
const bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
const adminRoutes = require('./routes/admin');
const usersRouter = require('./routes/users');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware básicos
app.use(logger('dev'));

// Configuración para manejar formularios
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
app.use(methodOverride('_method'));

// Configuración de sesión
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}));

// Configuración de flash messages
app.use(flash());
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success');
    res.locals.error_msg = req.flash('error');
    next();
});

// Middleware de autenticación
app.use(sessionVerify);
app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
});

// Rutas
app.use('/', indexRouter);
app.use('/admin', adminRoutes);
app.use('/users', usersRouter);

// Manejo de errores
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
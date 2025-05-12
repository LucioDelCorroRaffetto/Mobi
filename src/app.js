const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const methodOverride = require('method-override');
const sessionVerify = require('../middlewares/sessionVerify');
const flash = require('connect-flash');

const indexRouter = require('./routes/index');
const adminRouter = require('./routes/admin');
const usersRouter = require('./routes/users');
const productsRouter = require('./routes/inmuebles');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware básicos
// Middleware básicos
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, '../public')));

// Configuración de express para parsear JSON y urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Method override para PUT y DELETE
app.use(methodOverride('_method'));

// Cookies y sesión
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 24 horas
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/'
    },
    unset: 'destroy'
}));

// Flash messages
app.use(flash());

// Variables globales
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.error_msg = req.flash('error_msg');
    res.locals.success_msg = req.flash('success_msg');
    next();
});

// Middleware de autenticación
app.use(sessionVerify);

// Rutas
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);
app.use('/inmuebles', productsRouter);

// Manejo de errores 404
app.use(function(req, res, next) {
    // Si la petición es para la API, devolver JSON
    if (req.path.startsWith('/api/')) {
        console.log('Ruta API no encontrada:', req.path, req.method);
        return res.status(404).json({ 
            error: 'Ruta no encontrada',
            path: req.path,
            method: req.method
        });
    }
    
    // Si no, renderizar la vista de error
    res.status(404).render('error', {
        message: 'Página no encontrada',
        error: { status: 404 }
    });
});

// Manejo de errores generales
app.use(function(err, req, res, next) {
    console.error('Error:', err);
    
    // Si la petición es para la API, devolver JSON
    if (req.path.startsWith('/api/')) {
        return res.status(err.status || 500).json({
            error: err.message || 'Error interno del servidor',
            path: req.path,
            method: req.method
        });
    }
    
    // Si no, renderizar la vista de error
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

module.exports = app;
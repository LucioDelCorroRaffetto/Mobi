const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    
    // Si la petición es AJAX o espera JSON, devolver error 401 en formato JSON
    if (req.xhr || req.headers.accept?.includes('application/json')) {
        return res.status(401).json({ error: 'Debes iniciar sesión para realizar esta acción' });
    }
    
    // Si no, redirigir a la página de login
    req.flash('error_msg', 'Debes iniciar sesión para realizar esta acción');
    res.redirect('/users/login');
};

const isNotAuthenticated = (req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    res.redirect('/users/profile');
};

const isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.tipo === 'admin') {
        next();
    } else {
        res.status(403).render('error', { 
            title: 'Acceso Denegado',
            message: 'Acceso denegado. Se requieren permisos de administrador.',
            error: { status: 403 }
        });
    }
};

const isAgente = (req, res, next) => {
    if (req.session.user && (req.session.user.tipo === 'agente' || req.session.user.tipo === 'admin')) {
        next();
    } else {
        res.status(403).render('error', { 
            title: 'Acceso Denegado',
            message: 'Acceso denegado. Se requieren permisos de agente.',
            error: { status: 403 }
        });
    }
};

module.exports = {
    isAuthenticated,
    isNotAuthenticated,
    isAdmin,
    isAgente
}; 
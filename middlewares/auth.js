const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/users/login');
    }
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
    isAdmin,
    isAgente
}; 
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
            message: 'Acceso denegado. Se requieren permisos de administrador.' 
        });
    }
};

const isAgente = (req, res, next) => {
    if (req.session.user && (req.session.user.tipo === 'agente' || req.session.user.tipo === 'admin')) {
        next();
    } else {
        res.status(403).render('error', { 
            message: 'Acceso denegado. Se requieren permisos de agente.' 
        });
    }
};

module.exports = {
    isAuthenticated,
    isAdmin,
    isAgente
}; 
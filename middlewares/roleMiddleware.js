const isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.tipo === 'admin') {
        next();
    } else {
        req.flash('error', 'No tienes permisos para acceder a esta sección');
        res.redirect('/');
    }
};

const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        req.flash('error', 'Debes iniciar sesión para acceder a esta sección');
        res.redirect('/users/login');
    }
};

const isNotAuthenticated = (req, res, next) => {
    if (!req.session.user) {
        next();
    } else {
        res.redirect('/users/profile');
    }
};

module.exports = {
    isAdmin,
    isAuthenticated,
    isNotAuthenticated
}; 
const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    }
    req.flash('error_msg', 'Debes iniciar sesión para acceder a esta página');
    res.redirect('/users/login');
};

const isNotAuthenticated = (req, res, next) => {
    if (!req.session || !req.session.user) {
        return next();
    }
    req.flash('error_msg', 'Ya has iniciado sesión');
    res.redirect('/');
};

module.exports = {
    isAuthenticated,
    isNotAuthenticated
}; 
const loginVerify = (req, res, next) => {
    if (req.session.user) {
        console.log("usuario logueado");

        res.redirect("/users/profile");
    } else {
        next();
    }
};

module.exports = loginVerify;
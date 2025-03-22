const sessionVerify = function(req, res, next){
  console.log("session: ", req.session);
  console.log("cookies: ",req.cookies);
  
  // Si hay cookie de usuario pero no hay sesión, creamos la sesión
  if(!req.session.user && req.cookies.user){
    req.session.user = req.cookies.user;
  }

  // Si hay usuario en sesión, lo hacemos disponible para todas las vistas
  if(req.session.user){
    res.locals.user = req.session.user;
  }
  next();
}

module.exports = sessionVerify;
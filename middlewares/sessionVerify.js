const sessionVerify = function(req, res, next){
  console.log("session: ", req.session);
  console.log("cookies: ",req.cookies);
  
  // Si hay cookie de usuario pero no hay sesión, creamos la sesión
  if(!req.session.user && req.cookies.userEmail){
    // Buscar el usuario en la base de datos
    const { Usuario } = require('../src/database/models');
    Usuario.findOne({
      where: { email: req.cookies.userEmail }
    }).then(usuario => {
      if (usuario) {
        req.session.user = {
          id: usuario.id,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          email: usuario.email,
          tipo: usuario.tipo,
          imagen: usuario.imagen
        };
      }
      next();
    }).catch(error => {
      console.error('Error al buscar usuario:', error);
      next();
    });
  } else {
    // Si hay usuario en sesión, lo hacemos disponible para todas las vistas
    if(req.session.user){
      res.locals.user = req.session.user;
    }
    next();
  }
}

module.exports = sessionVerify;
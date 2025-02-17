const path = require("path");
const directory = path.join(__dirname, "../../data/users.json");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const {
  readFile,
  writeFile,
  parseFile,
  stringifyFile,
} = require("../../utils/filesystem");

const users = parseFile(readFile(directory));

const usersControllers = {
  login: (req, res, next) => {
    res.render("users/login", { title: "Login" });
  },
  processLogin: (req, res) => {
    const { email } = req.body;
    const errores = validationResult(req);
    
    if (errores.array().length > 0) {
      return res.render("users/login", {
        errores: errores.mapped(),
        email
      });
    }

    const user = users.find(user => user.email === email);
    const { firstName } = user;
    
    req.session.user = { email, firstName };
    
    if (req.body.recuerdame) {
      res.cookie("user", { email, firstName }, { maxAge: 1000 * 60 * 30 });
    }
    
    res.redirect("/users/profile");
  },
  logout: (req, res) => {
    req.session.destroy();
    res.clearCookie("user");
    res.redirect("/users/login");
  },
    register: function (req, res, next) {
    res.render("users/register", { title: "registro de usuario" });
  },
  store: function (req, res, next) {
    try {
      console.log('Archivo recibido:', req.file);
      const { firstName, lastName, email, password, category } = req.body;
      const image = req.file ? req.file.filename : 'default-user.jpg';
      const errores = validationResult(req);

      if (errores.array().length > 0) {
        res.render("users/register", {
          errores: errores.mapped(),
          firstName,
          lastName,
          email,
          password,
          category,
        });
      } else {
        bcrypt.hash(password, 10, function(err, hash) {
          if(err){
            console.log("error en el hash",err);
          }
        
          users.push({
            firstName,
            lastName,
            email,
            password:hash,
            image,
            category,});

          writeFile(directory, stringifyFile(users));

          res.redirect("/users/login");
        });
      }
    } catch (error) {
      console.log("el error capturado: ", error);
    }
  },
  profile: (req, res) => {
    if (!req.session.user) {
      return res.redirect('/users/login');
    }
    const user = users.find(user => user.email === req.session.user.email);
    res.render('users/profile', { 
      title: 'Perfil',
      user 
    });
  },
};

module.exports = usersControllers;

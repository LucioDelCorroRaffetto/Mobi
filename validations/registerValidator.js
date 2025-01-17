const {body} = require('express-validator');
const {readFile, parseFile} = require('../utils/filesystem');
const path = require("path");
const { log } = require('console');
const directory = path.join(__dirname, "..", "src", "db", "users.json");
const users = parseFile(readFile(directory));

module.exports = [
    body('nombre').notEmpty().withMessage('El campo no puede estar vacio').bail().trim()
        .isAlpha().withMessage('No se permiten numeros o caracteres especiales').bail()
        .isLength({ min: 5, max: 10 }).withMessage("El minimo de caracters es 5 y el maximo 10").bail(),

    body('contrasena').notEmpty().withMessage('El campo no puede estar vacio').bail()
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,20}$/).withMessage("No cumple con los requisitos, debe contener una mayuscula, minuscula, un valor numerico y un caracter especial. La longitud debe ser entre 8 y 20 caracteres").bail(),

    body('correo').notEmpty().withMessage('El campo no puede estar vacio').bail()
    .isEmail().withMessage('El campo debe ser un correo').bail()
    .custom((value) => {
        console.log("value:",value);
        const user = users.find(user => user.correo === value);
        console.log("user:",user);
        if (user) {
            throw new Error('El usuario ya existe');
        }
        return true;
    }).bail()
]
const {body} = require('express-validator');
const {readFile, parseFile} = require('../utils/filesystem');
const path = require("path");
const { log } = require('console');
const directory = path.join(__dirname, "..", "data", "users.json");
const users = parseFile(readFile(directory));

module.exports = [
    body('firstName').notEmpty().withMessage('El campo no puede estar vacio').bail().trim()
        .isAlpha().withMessage('No se permiten numeros o caracteres especiales').bail()
        .isLength({ min: 5, max: 10 }).withMessage("El minimo de caracters es 5 y el maximo 10").bail(),

        body('lastName').notEmpty().withMessage('El campo no puede estar vacio').bail().trim()
        .isAlpha().withMessage('No se permiten numeros o caracteres especiales').bail()
        .isLength({ min: 4, max: 20 }).withMessage("El minimo de caracters es 4 y el maximo 20").bail(),

    body('password').notEmpty().withMessage('El campo no puede estar vacio').bail()
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,20}$/).withMessage("No cumple con los requisitos, debe contener una mayuscula, minuscula, un valor numerico y un caracter especial. La longitud debe ser entre 8 y 20 caracteres").bail(),

    body('email').notEmpty().withMessage('El campo no puede estar vacio').bail()
    .isEmail().withMessage('El campo debe ser un email').bail()
    .custom((value) => {
        console.log("value:",value);
        const user = users.find(user => user.email === value);
        console.log("user:",user);
        if (user) {
            throw new Error('El usuario ya existe');
        }
        return true;
    }).bail(),

    body('image')
    .custom((value, { req }) => {
        if (!req.file) {
            throw new Error('Debes subir un archivo');
        }
        return true;
    }).bail()
    .custom((value, { req }) => {
        const file = req.file;
        const allowedTypes = ['image/png', 'image/jpeg'];
        
        if (!allowedTypes.includes(file.mimetype)) {
            throw new Error('Solo se permiten imágenes PNG o JPG');
        }
        return true;
    }).bail()
    .custom((value, { req }) => {
        const file = req.file;
        const maxSize = 2 * 1024 * 1024; // 2MB

        if (file.size > maxSize) {
            throw new Error('El archivo no debe superar los 2MB');
        }
        return true;
    }).bail()
]
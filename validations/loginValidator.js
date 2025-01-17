const { body } = require('express-validator');
const { readFile, parseFile } = require('../utils/filesystem');
const path = require("path");
const directory = path.join(__dirname, "..", "src", "db", "users.json");
const users = parseFile(readFile(directory));
const bcrypt = require("bcrypt");

async function comparePass(pass, hash) {
    return await bcrypt.compare(pass, hash);
}

module.exports = [
    body('correo').notEmpty().withMessage('El campo no puede estar vacio').bail()
        .isEmail().withMessage('El campo debe ser un correo').bail()
        .custom(value => {
            const user = users.find(user => user.correo === value);

            if (!user) {
                throw new Error('Las credenciales no son validas');
            }
            return true;
        }).bail(),

    body('contrasena').notEmpty().withMessage('El campo no puede estar vacio').bail()
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,20}$/).withMessage("No cumple con los requisitos, debe contener una mayuscula, minuscula, un valor numerico y un caracter especial. La longitud debe ser entre 8 y 20 caracteres").bail()
        .custom(async (value, { req }) => {
            const user = users.find(user => user.correo === req.body.correo);

            const result = await comparePass(value, user.contrasena);

            if (!result) {
                throw new Error('Las credenciales no son validas');
            }

            console.log("resultado de la comparación", result);


            return true;
        }).bail()
]
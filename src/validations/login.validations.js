const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const loginValidations = [
	check('usuario')
		.trim()
		.escape()
		.notEmpty()
		.withMessage('El usuario no puede estar vacio'),
	check('clave')
		.trim()
		.escape()
		.notEmpty()
		.withMessage('La clave puede estar vacia'),
	validarCampos,
];

module.exports = loginValidations;

const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const vehiculoValidations = [
	check('marca')
		.trim()
		.escape()
		.notEmpty()
		.withMessage('El usuario no puede estar vacio'),
	check('modelo')
		.trim()
		.escape()
		.notEmpty()
		.withMessage('La clave puede estar vacia'),
	validarCampos,
];

module.exports = vehiculoValidations;

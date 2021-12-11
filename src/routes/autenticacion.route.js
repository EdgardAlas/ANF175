// const csrfProteccion = require('../middlewares/csruf');
const { Router } = require('express');
const { StatusCodes } = require('http-status-codes');
const loginValidations = require('../validations/login.validations');

const routes = Router();

routes.post('/login', loginValidations, (req, res) => {
	res.status(StatusCodes.OK).json({
		tes: ' hoa',
	});
});

module.exports = routes;

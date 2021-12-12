// const csrfProteccion = require('../middlewares/csruf');
const { Router } = require('express');
const { login } = require('../controllers/autenticacion.controller');
const loginValidations = require('../validations/login.validations');

const routes = Router();

routes.post('/login', loginValidations, login);

module.exports = routes;

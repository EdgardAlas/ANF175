// const csrfProteccion = require('../middlewares/csruf');
const { Router } = require('express');
const { vistaLogin } = require('../controllers/autenticacion.controller');

const routes = Router();

routes.get('/login', vistaLogin);

module.exports = routes;

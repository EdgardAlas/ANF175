// const csrfProteccion = require('../middlewares/csruf');
const { Router } = require('express');
const { vistaLogin } = require('../controllers/autenticacion.controller');
const { vistaPublica } = require('../middlewares/valida-rutas');

const routes = Router();

routes.get('/login', vistaPublica, vistaLogin);

module.exports = routes;

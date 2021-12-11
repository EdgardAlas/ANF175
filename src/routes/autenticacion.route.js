// const csrfProteccion = require('../middlewares/csruf');
const { Router } = require('express');
const { vistaLogin } = require('../controllers/autenticacion.controller');
const { vistaPublica, vistaProtegida } = require('../middlewares/valida-rutas');

const routes = Router();

routes.get('/login', vistaPublica, vistaLogin);
routes.get('/', vistaProtegida, (req, res) => {
	res.render('inicio');
});

module.exports = routes;

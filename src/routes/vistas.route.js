// const csrfProteccion = require('../middlewares/csruf');
const { Router } = require('express');
const { vistaLogin, logout } = require('../controllers/vistas.controller');
const { vistaPublica, vistaProtegida } = require('../middlewares/valida-rutas');

const routes = Router();
//* Vistas
routes.get('/login', vistaPublica, vistaLogin);
routes.get('/', vistaProtegida, (req, res) => {
	res.render('inicio');
});
routes.get('/logout', logout);

module.exports = routes;
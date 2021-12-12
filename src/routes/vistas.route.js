// const csrfProteccion = require('../middlewares/csruf');
const { Router } = require('express');
const {
	vistaLogin,
	logout,
	vistaEmpleados,
} = require('../controllers/vistas.controller');
const { vistaPublica, vistaProtegida } = require('../middlewares/valida-rutas');

const routes = Router();
//* Vistas
routes.get('/login', vistaPublica, vistaLogin);

routes.get('/', vistaProtegida, (req, res) => {
	res.render('inicio');
});

routes.get('/empleados', vistaProtegida, vistaEmpleados);

routes.get('/logout', logout);

module.exports = routes;

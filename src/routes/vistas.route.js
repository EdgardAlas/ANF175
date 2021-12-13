// const csrfProteccion = require('../middlewares/csruf');
const { Router } = require('express');
const {
	vistaLogin,
	logout,
	vistaEmpleados,
	inicio,
	vistaClientes,
} = require('../controllers/vistas.controller');
const { vistaPublica, vistaProtegida } = require('../middlewares/valida-rutas');

const routes = Router();
routes.get('/', vistaProtegida, inicio);
routes.get('/login', vistaPublica, vistaLogin);
routes.get('/logout', logout);
routes.get('/empleados', vistaProtegida, vistaEmpleados);
routes.get('/clientes', vistaProtegida, vistaClientes);

module.exports = routes;

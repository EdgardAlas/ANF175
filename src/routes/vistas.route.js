// const csrfProteccion = require('../middlewares/csruf');
const { Router } = require('express');
const {
	vistaLogin,
	logout,
	vistaEmpleados,
	inicio,
	vistaClientes,
	vistaVehiculos,
	vistaCartera,
	vistaHipoteca,
	vistaFiador,
	vistaInfoContable,
} = require('../controllers/vistas.controller');
const { vistaPublica, vistaProtegida } = require('../middlewares/valida-rutas');

const routes = Router();
routes.get('/', vistaProtegida, inicio);
routes.get('/login', vistaPublica, vistaLogin);
routes.get('/logout', logout);
routes.get('/empleados', vistaProtegida, vistaEmpleados);
routes.get('/clientes', vistaProtegida, vistaClientes);
routes.get('/vehiculos', vistaProtegida, vistaVehiculos);
routes.get('/cartera', vistaProtegida, vistaCartera);
routes.get('/hipoteca', vistaProtegida, vistaHipoteca);
routes.get('/fiador', vistaProtegida, vistaFiador);
routes.get('/informacion-contable', vistaProtegida, vistaInfoContable);

module.exports = routes;

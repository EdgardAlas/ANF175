const { Router } = require('express');
const {
	obtenerCartera,
	obtenerCliente,
	obtenerEmpleado,
	registrarCartera,
} = require('../controllers/cartera.controller');

const routes = Router();

// api/empleado
routes.get('/', obtenerCartera);
routes.get('/cliente', obtenerCliente);
routes.get('/empleado', obtenerEmpleado);
routes.post('/', registrarCartera);

module.exports = routes;

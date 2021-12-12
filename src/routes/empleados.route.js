// const csrfProteccion = require('../middlewares/csruf');
const { Router } = require('express');
const {
	registrarEmpleado,
	obtenerEmpleados,
} = require('../controllers/empleados.controller');

const routes = Router();

// api/empleado
routes.post('/', registrarEmpleado);
routes.get('/', obtenerEmpleados);

module.exports = routes;

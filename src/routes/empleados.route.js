// const csrfProteccion = require('../middlewares/csruf');
const { Router } = require('express');
const {
	registrarEmpleado,
	obtenerEmpleados,
	editarEmpleado,
} = require('../controllers/empleados.controller');

const routes = Router();

// api/empleado
routes.get('/', obtenerEmpleados);
routes.post('/', registrarEmpleado);
routes.patch('/:id', editarEmpleado);

module.exports = routes;

// const csrfProteccion = require('../middlewares/csruf');
const { Router } = require('express');
const {
	registrarEmpleado,
	obtenerEmpleados,
	editarEmpleado,
	existeCorreo,
	existeDUI,
	existeUsuario,
} = require('../controllers/empleados.controller');

const routes = Router();

// api/empleado
routes.get('/', obtenerEmpleados);
routes.post('/', registrarEmpleado);
routes.patch('/:id', editarEmpleado);
routes.get('/correo/:correo', existeCorreo);
routes.get('/dui/:dui', existeDUI);
routes.get('/usuario/:usuario', existeUsuario);

module.exports = routes;

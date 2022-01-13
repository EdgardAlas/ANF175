const { Router } = require('express');
const {
	obtenerActivo,
	obtenerEmpleado,
	obtenerTipoactivo,
	registrarActivo,
	editarActivo,
} = require('../controllers/activo.controller');
const routes = Router();
routes.get('/', obtenerActivo);
routes.get('/empleado', obtenerEmpleado);
routes.get('/tipoactivo', obtenerTipoactivo);
routes.post('/', registrarActivo);
routes.patch('/:id', editarActivo);

module.exports = routes;

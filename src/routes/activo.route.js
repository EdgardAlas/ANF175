const { Router } = require('express');
const {
	obtenerActivo,
	obtenerEmpleado,
	obtenerTipoactivo,
	registrarActivo,
} = require('../controllers/activo.controller');
const routes = Router();
routes.get('/', obtenerActivo);
routes.get('/empleado', obtenerEmpleado);
routes.get('/tipoactivo', obtenerTipoactivo);
routes.post('/', registrarActivo);

module.exports = routes;

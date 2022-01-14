const { Router } = require('express');
const {
	obtenerActivo,
	obtenerEmpleado,
	obtenerTipoactivo,
	registrarActivo,
	editarActivo,
	registrarBaja,
	editarEstadoActivo,
	obtenerBajaDetalle,
} = require('../controllers/activo.controller');
const routes = Router();
routes.get('/', obtenerActivo);
routes.get('/empleado', obtenerEmpleado);
routes.get('/tipoactivo', obtenerTipoactivo);
routes.post('/', registrarActivo);
routes.post('/baja', registrarBaja);
routes.patch('/:id', editarActivo);
routes.patch('/estado/:id', editarEstadoActivo);
routes.get('/detallebaja/:id', obtenerBajaDetalle);

module.exports = routes;

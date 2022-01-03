// const csrfProteccion = require('../middlewares/csruf');
const { Router } = require('express');
const {
	obtenerHipoteca,
	obtenerCliente,
	registrarHipoteca,
	obtenerArchivo,
	editarHipoteca,
} = require('../controllers/hipoteca.controller');

const routes = Router();

// api/empleado
routes.get('/', obtenerHipoteca);
routes.get('/cliente', obtenerCliente);
routes.post('/', registrarHipoteca);
routes.get('/obtener-archivo/:nombre', obtenerArchivo);
routes.patch('/:id/:archivo?', editarHipoteca);
module.exports = routes;

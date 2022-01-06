const { Router } = require('express');
const {
	obtenerFiadores,
	obtenerArchivo,
	obtenerClientes,
	registrarFiador,
} = require('../controllers/fiador.controller');

const routes = Router();

routes.get('/', obtenerFiadores);
routes.get('/obtener-archivo/:nombre', obtenerArchivo);
routes.get('/cliente', obtenerClientes);
routes.post('/', registrarFiador);

module.exports = routes;

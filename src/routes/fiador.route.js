const { Router } = require('express');
const {
	obtenerFiadores,
	obtenerArchivo,
} = require('../controllers/fiador.controller');

const routes = Router();

routes.get('/', obtenerFiadores);
routes.get('/obtener-archivo/:nombre', obtenerArchivo);

module.exports = routes;

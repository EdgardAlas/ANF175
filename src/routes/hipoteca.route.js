// const csrfProteccion = require('../middlewares/csruf');
const { Router } = require('express');
const {
	obtenerHipoteca,
	obtenerCliente,
	registrarHipoteca,
} = require('../controllers/hipoteca.controller');

const routes = Router();

// api/empleado
routes.get('/', obtenerHipoteca);
routes.get('/cliente', obtenerCliente);
routes.post('/', registrarHipoteca);
module.exports = routes;

const { Router } = require('express');
const {
	obtenerPagos,
	obtenerPagosReal,
	registrarPago,
	DUIpropietario,
	editarFiador,
} = require('../controllers/pago.controller');

const routes = Router();

routes.get('/', obtenerPagos);
routes.get('/real/:id', obtenerPagosReal);
routes.post('/', registrarPago);
routes.get('/:dui/:id', DUIpropietario);
routes.patch('/:id/:archivoF?', editarFiador);

module.exports = routes;

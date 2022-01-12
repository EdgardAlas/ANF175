const { Router } = require('express');
const {
	obtenerPagos,
	obtenerArchivo,
	obtenerClientes,
	registrarFiador,
	DUIpropietario,
	editarFiador,
} = require('../controllers/pago.controller');

const routes = Router();

routes.get('/', obtenerPagos);
routes.get('/obtener-archivo/:nombre', obtenerArchivo);
routes.get('/cliente', obtenerClientes);
routes.post('/', registrarFiador);
routes.get('/:dui/:id', DUIpropietario);
routes.patch('/:id/:archivoF?', editarFiador);

module.exports = routes;

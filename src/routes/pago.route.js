const { Router } = require('express');
const {
	obtenerFiadores,
	obtenerArchivo,
	obtenerClientes,
	registrarFiador,
	DUIpropietario,
	editarFiador,
} = require('../controllers/fiador.controller');

const routes = Router();

routes.get('/', obtenerFiadores);
routes.get('/obtener-archivo/:nombre', obtenerArchivo);
routes.get('/cliente', obtenerClientes);
routes.post('/', registrarFiador);
routes.get('/:dui/:id', DUIpropietario);
routes.patch('/:id/:archivoF?', editarFiador);

module.exports = routes;

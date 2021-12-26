const { Router } = require('express');
const {
	obtenerVehiculos,
	obtenerClientes,
	registrarVehiculo,
	obtenerArchivo,
	editarVehiculo,
	DUIpropietario,
	verificarCliente,
} = require('../controllers/vehiculos.controller');

const routes = Router();

// api/empleado
routes.get('/', obtenerVehiculos);
routes.get('/cliente', obtenerClientes);
routes.get('/obtener-archivo/:nombre', obtenerArchivo);
routes.get('/dui/:dui', DUIpropietario);
routes.get('/verificarcliente/:cliente_fk', verificarCliente);
routes.post('/', registrarVehiculo);
routes.patch('/:id', editarVehiculo);

module.exports = routes;

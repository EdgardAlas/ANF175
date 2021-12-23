const { Router } = require('express');
const {
	obtenerVehiculos,
	obtenerClientes,
	registrarVehiculo,
} = require('../controllers/vehiculos.controller');

const routes = Router();

// api/empleado
routes.get('/', obtenerVehiculos);
routes.get('/cliente', obtenerClientes);
routes.post('/', registrarVehiculo);

module.exports = routes;

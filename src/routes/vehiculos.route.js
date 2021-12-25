const { Router } = require('express');
const {
	obtenerVehiculos,
	obtenerClientes,
	registrarVehiculo,
	obtenerArchivo,
} = require('../controllers/vehiculos.controller');

const routes = Router();

// api/empleado
routes.get('/', obtenerVehiculos);
routes.get('/cliente', obtenerClientes);
routes.get('/obtener-archivo/:nombre', obtenerArchivo);
routes.post('/', registrarVehiculo);

module.exports = routes;

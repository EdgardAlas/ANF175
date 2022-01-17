// const csrfProteccion = require('../middlewares/csruf');
const { Router } = require('express');
const {
	obtenerTipoCuenta,
	obtenerClientes,
	registrarInfoContable,
	obtenerInformacion,
} = require('../controllers/infocontable.controller');
const { rutaProtegida } = require('../middlewares/valida-rutas');

const routes = Router();

// api/empleado
routes.get('/obtener-tipos-cuenta', obtenerTipoCuenta);
routes.get('/obtener-informacion/:cliente', obtenerInformacion);
routes.get('/obtener-clientes', rutaProtegida, obtenerClientes);
routes.post('/', registrarInfoContable);

module.exports = routes;

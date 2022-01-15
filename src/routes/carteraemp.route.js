const { Router } = require('express');

const {
	obtenerCartera,
	registrarPrestamo,
	obtenerprestamo,
} = require('../controllers/carteraemp.controller');
const { rutaProtegida } = require('../middlewares/valida-rutas');

const routes = Router();

// api/empleado
routes.get('/', rutaProtegida, obtenerCartera);
routes.post('/', registrarPrestamo);
routes.get('/:id', rutaProtegida, obtenerprestamo);

module.exports = routes;

const { Router } = require('express');
const { obtenerCartera } = require('../controllers/carteraemp.controller');

const routes = Router();

// api/empleado
routes.get('/', obtenerCartera);

module.exports = routes;

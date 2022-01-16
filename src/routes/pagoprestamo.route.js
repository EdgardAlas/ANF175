const { Router } = require('express');
const { obtenerPago2 } = require('../controllers/pagoprestamo.controller');
const { rutaProtegida } = require('../middlewares/valida-rutas');

const routes = Router();
routes.get('/:id', rutaProtegida, obtenerPago2);

module.exports = routes;

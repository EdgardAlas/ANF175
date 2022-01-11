const { Router } = require('express');
const { obtenerActivo } = require('../controllers/activo.controller');
const routes = Router();
routes.get('/', obtenerActivo);
module.exports = routes;

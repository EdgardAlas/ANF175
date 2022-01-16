const { Router } = require('express');
const {
	obtenerMunicipios,
	existeNIT,
	existeDUI,
	existeCorreo,
	agregarCliente,
	obtenerClientes,
	obtenerInformacion,
	verConstancia,
} = require('../controllers/cliente.controller');
const { rutaProtegida } = require('../middlewares/valida-rutas');

const routes = Router();

routes.get('/municipio/:municipio', obtenerMunicipios);
routes.get('/correo/:correo', existeCorreo);
routes.get('/dui/:dui', existeDUI);
routes.get('/nit/:nit', existeNIT);
routes.post('/', rutaProtegida, agregarCliente);
routes.get('/', rutaProtegida, obtenerClientes);
routes.get('/:id', rutaProtegida, obtenerInformacion);
routes.get('/ver-constancia-laboral/:archivo', verConstancia);

module.exports = routes;

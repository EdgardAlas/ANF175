// const csrfProteccion = require('../middlewares/csruf');
const { Router } = require('express');
const routes = Router();
const render = (vista) => `autenticacion/${vista}`;

routes.get('/login', (req, res) => {
	res.render(render('login'));
});

module.exports = routes;

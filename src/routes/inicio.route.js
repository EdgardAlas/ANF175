const { Router } = require('express');
const csrfProteccion = require('../middlewares/csruf');
const routes = Router();

routes.get('/', csrfProteccion, (req, res) => {
	res.render('inicio', {
		token: req.csrfToken(),
	});
});

routes.post(
	'/',
	[
		(req, res, next) => {
			console.log(req);
			next();
		},
		csrfProteccion,
	],
	(req, res) => {
		res.json({ msg: 'procede este formulario' });
	}
);

module.exports = routes;

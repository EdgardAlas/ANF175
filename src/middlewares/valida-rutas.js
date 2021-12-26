const jwt = require('jsonwebtoken');
const { eliminarSesion } = require('../helpers/crear-sesion');

const rutaProtegida = (req, res, next) => {
	const token = req.cookies['Authorization'];

	if (!token) {
		return res.status(401).json({
			msg: 'No hay token en la petición',
		});
	}

	try {
		const { id, rol } = jwt.verify(token, process.env.JWT_KEY);
		req.id = id;
		req.rol = rol;
	} catch (error) {
		return res.status(401).json({
			msg: 'Token no válido',
		});
	}

	next();
};

const vistaProtegida = (req, res, next) => {
	const token = req.cookies['Authorization'];

	if (!token) {
		return res.redirect('/login');
	}

	try {
		const { id, rol } = jwt.verify(token, process.env.JWT_KEY);
		req.id = id;
		req.rol = rol;
	} catch (error) {
		eliminarSesion(res);
		return res.redirect('/login');
	}

	next();
};

const vistaPublica = (req, res, next) => {
	const token = req.cookies['Authorization'];

	if (!token) {
		return next();
	}

	return res.redirect('/');
};

module.exports = {
	rutaProtegida,
	vistaPublica,
	vistaProtegida,
};

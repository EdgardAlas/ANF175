const jwt = require('jsonwebtoken');

const validarJWT = (req, res, next) => {
	const token = req.cookies['Authorization'];

	if (!token) {
		return res.status(401).json({
			msg: 'No hay token en la petición',
		});
	}

	try {
		const { uid } = jwt.verify(token, process.env.JWT_KEY);
		req.uid = uid;
	} catch (error) {
		return res.status(401).json({
			msg: 'Token no válido',
		});
	}

	next();
};

module.exports = {
	validarJWT,
};

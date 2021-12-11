const jsonwebtoken = require('jsonwebtoken');

const generarJWT = (payload, expiresIn = '3h') => {
	const { JWT_KEY } = process.env;

	return new Promise((resolve, reject) => {
		jsonwebtoken.sign(
			payload,
			JWT_KEY,
			{
				expiresIn,
			},
			(err, token) => {
				if (err) {
					return reject('No se puede generar el token');
				}
				resolve(token);
			}
		);
	});
};

module.exports = {
	generarJWT,
};

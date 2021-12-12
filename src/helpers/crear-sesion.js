const crearSesion = (res, token) => {
	res.cookie('Authorization', token, {
		secure: process.env.NODE_ENV === 'production',
		httpOnly: true,
		maxAge: 3 * 60 * 60 * 1000,
		path: '/',
	});
};

const eliminarSesion = (res) => {
	res.clearCookie('Authorization');
};

module.exports = {
	crearSesion,
	eliminarSesion,
};
